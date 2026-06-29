import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const baseUrl = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}`;

async function fetchAllStores() {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}&limit=200&includeUnpublished=true`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).results || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generatePrompt(store) {
  const data = store.data || {};
  return `A modern electronics and gadgets storefront facade in ${data.title}, ${data.state}, ${data.country}. Sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets, smartphones, drones, gaming devices. No text or signage. Daylight photography.`;
}

async function submitImageJob(prompt) {
  const sanitized = prompt.replace(/"/g, '\\"').replace(/\$/g, '\\$');
  const cmd = `npx --yes workar submit --type image-gen prompt="${sanitized}" 2>&1`;
  const result = execSync(cmd, { encoding: 'utf-8', timeout: 60000 }).trim();
  const match = result.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
  return match ? match[1] : result.split('\n').pop();
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retrieveImage(jobId, maxWait = 120000) {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait) {
    try {
      const cmd = `npx --yes workar get ${jobId} 2>&1`;
      const result = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      const match = result.match(/I saved the result to\s+"?([^"]+\.png)"?/);
      if (match) return match[1];
      const fileMatch = result.match(/work-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}\.png/);
      if (fileMatch) return fileMatch[0];
      return `work-${jobId}.png`;
    } catch (e) {
      if (Date.now() - startTime > maxWait) throw e;
      await sleep(5000);
    }
  }
  throw new Error('Timeout waiting for image');
}

async function uploadImage(imagePath, name, altText) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`File not found: ${imagePath}`);
  }
  
  const key = process.env.BUILDER_PRIVATE_API_KEY;
  if (!key) throw new Error('BUILDER_PRIVATE_API_KEY not set');
  
  const fileContent = fs.readFileSync(imagePath);
  const params = new URLSearchParams({ name, altText });
  const url = new URL(`https://builder.io/api/v1/upload?${params.toString()}`);
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'image/png',
        'Content-Length': fileContent.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Upload failed: ${parsed.message}`));
          } else {
            resolve(parsed.url);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(fileContent);
    req.end();
  });
}

async function processStore(store, index) {
  const data = store.data || {};
  const title = data.title || 'Unknown';
  
  console.log(`\n[${index}] ${title} - ${data.state}`);
  
  try {
    const prompt = generatePrompt(store);
    
    process.stdout.write('  1. Submit... ');
    const jobId = await submitImageJob(prompt);
    console.log(jobId);
    
    process.stdout.write('  2. Generate (120s max)... ');
    const imagePath = await retrieveImage(jobId, 120000);
    console.log('✓');
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not created: ${imagePath}`);
    }
    
    process.stdout.write('  3. Upload... ');
    const sanitized = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const imageUrl = await uploadImage(imagePath, `store-${sanitized}.png`, `${title} storefront`);
    console.log('✓');
    
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    return { storeId: store.id, imageUrl, success: true };
  } catch (error) {
    console.log(`✗ ${error.message}`);
    return { storeId: store.id, success: false };
  }
}

async function main() {
  console.log('Fetching stores...');
  const stores = await fetchAllStores();
  const storesWithoutImages = stores.filter(s => !s.data?.image);
  
  console.log(`Found ${storesWithoutImages.length} stores without images`);
  console.log(`Processing next 10...\n`);
  
  const storesToProcess = storesWithoutImages.slice(0, 10);
  let successful = 0;
  
  for (let i = 0; i < storesToProcess.length; i++) {
    const result = await processStore(storesToProcess[i], i + 1);
    if (result.success) {
      successful++;
      fs.appendFileSync('.builder/store-image-updates.jsonl', 
        JSON.stringify({ storeId: result.storeId, imageUrl: result.imageUrl }) + '\n');
    }
  }
  
  console.log(`\n✅ Completed: ${successful}/10 stores processed`);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
