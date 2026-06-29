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
  return `A modern electronics and gadgets storefront facade in ${data.title}, ${data.state}, ${data.country}. Sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets, smartphones, drones, gaming devices, and consumer electronics. Urban shopping district aesthetic. Professional product display. No text or signage visible. Daylight photography style.`;
}

async function submitImageJob(prompt) {
  return new Promise((resolve, reject) => {
    try {
      const result = execSync(
        `npx --yes workar submit --type image-gen prompt="${prompt.replace(/"/g, '\\"')}" 2>&1`,
        { encoding: 'utf-8', timeout: 30000 }
      ).trim();
      
      const match = result.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
      resolve(match ? match[1] : result.split('\n').filter(l => l.match(/^\d{4}-/))[0]);
    } catch (e) {
      reject(e);
    }
  });
}

async function retrieveImage(jobId) {
  return new Promise((resolve, reject) => {
    try {
      const result = execSync(`npx --yes workar get ${jobId} 2>&1`, {
        encoding: 'utf-8',
        timeout: 60000
      });

      const match = result.match(/I saved the result to\s+"?([^"]+\.png)"?/);
      resolve(match ? match[1] : `work-${jobId}.png`);
    } catch (e) {
      reject(e);
    }
  });
}

async function uploadImage(imagePath, name, altText) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(imagePath)) {
      reject(new Error(`File not found: ${imagePath}`));
      return;
    }
    
    const key = process.env.BUILDER_PRIVATE_API_KEY;
    if (!key) {
      reject(new Error('BUILDER_PRIVATE_API_KEY not set'));
      return;
    }
    
    const fileContent = fs.readFileSync(imagePath);
    const params = new URLSearchParams({ name, altText });
    const url = new URL(`https://builder.io/api/v1/upload?${params.toString()}`);
    
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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processStore(store, index) {
  const data = store.data || {};
  const title = data.title || 'Unknown';
  
  console.log(`\n[${index}] ${title} - ${data.state}, ${data.country}`);
  
  try {
    const prompt = generatePrompt(store);
    
    process.stdout.write('  1. Submitting... ');
    const jobId = await submitImageJob(prompt);
    console.log(jobId);
    
    process.stdout.write('  2. Waiting (8s)... ');
    await sleep(8000);
    console.log('done');
    
    process.stdout.write('  3. Retrieving... ');
    const imagePath = await retrieveImage(jobId);
    console.log('done');
    
    process.stdout.write('  4. Uploading... ');
    const sanitizedName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const imageUrl = await uploadImage(imagePath, `store-${sanitizedName}.png`, `${title} gadgets storefront`);
    console.log('done');
    
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    return { storeId: store.id, imageUrl, success: true };
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    return { storeId: store.id, success: false };
  }
}

async function main() {
  console.log('Fetching stores...');
  const stores = await fetchAllStores();
  
  const storesWithoutImages = stores.filter(s => !s.data?.image);
  console.log(`Found ${storesWithoutImages.length} stores without images\n`);
  
  const storesToProcess = storesWithoutImages.slice(0, 10);
  console.log(`Processing next 10 stores...\n`);
  
  const updates = [];
  
  for (let i = 0; i < storesToProcess.length; i++) {
    const result = await processStore(storesToProcess[i], i + 1);
    if (result.success) {
      updates.push(result);
      fs.appendFileSync('.builder/store-image-updates.jsonl', 
        JSON.stringify({ storeId: result.storeId, imageUrl: result.imageUrl }) + '\n');
    }
  }
  
  console.log(`\n✅ Completed: ${updates.length}/10 stores\n`);
  console.log('Store IDs and image URLs saved to .builder/store-image-updates.jsonl');
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
