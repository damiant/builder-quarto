import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const baseUrl = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}`;

// Get all stores that still need images
async function fetchStoresWithoutImages() {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}&limit=200&includeUnpublished=true`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const stores = (parsed.results || []).filter(s => {
            const hasImage = s.data && s.data.image;
            return !hasImage;
          });
          resolve(stores);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generatePrompt(store) {
  const data = store.data || {};
  const title = data.title || 'Quarto';
  const state = data.state || '';
  const country = data.country || '';
  
  return `A modern electronics and gadgets storefront facade in ${title}, ${state}, ${country}. Sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets, smartphones, drones, gaming devices, and consumer electronics. Urban shopping district aesthetic. Professional product display environment. No text or signage visible. Daylight photography style.`;
}

async function submitImageJob(prompt) {
  return new Promise((resolve, reject) => {
    try {
      const result = execSync(
        `npx --yes workar submit --type image-gen prompt="${prompt.replace(/"/g, '\\"')}" 2>&1`,
        { encoding: 'utf-8' }
      ).trim();
      
      const match = result.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
      const jobId = match ? match[1] : result.split('\n').filter(l => l.match(/^\d{4}-/))[0];
      resolve(jobId);
    } catch (e) {
      reject(e);
    }
  });
}

async function retrieveImage(jobId) {
  return new Promise((resolve, reject) => {
    try {
      const result = execSync(`npx --yes workar get ${jobId} 2>&1`, { 
        encoding: 'utf-8'
      });
      
      const match = result.match(/I saved the result to\s+"?([^"]+\.png)"?/);
      const filename = match ? match[1] : `work-${jobId}.png`;
      resolve(filename);
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
    
    const params = new URLSearchParams({ name, altText });
    const url = `https://builder.io/api/v1/upload?${params.toString()}`;
    
    const fileContent = fs.readFileSync(imagePath);
    const reqUrl = new URL(url);
    const req = https.request({
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + reqUrl.search,
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
          if (!res.statusCode || res.statusCode >= 400) {
            reject(new Error(`Upload failed: ${parsed.message || data}`));
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

// Write store-image mapping to file for MCP tool processing
function writeStoreImageMapping(storeId, imageUrl) {
  const mappingFile = '.builder/store-image-updates.jsonl';
  const line = JSON.stringify({ storeId, imageUrl });
  fs.appendFileSync(mappingFile, line + '\n');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processStoreForImage(store, index, total) {
  const data = store.data || {};
  const storeName = data.title || 'Unknown';
  
  console.log(`[${index}/${total}] ${storeName} - ${data.state}, ${data.country}`);
  
  try {
    const prompt = generatePrompt(store);
    
    process.stdout.write('  Submitting... ');
    const jobId = await submitImageJob(prompt);
    console.log(`(${jobId})`);
    
    process.stdout.write('  Waiting... ');
    await sleep(5000);
    console.log('done');
    
    process.stdout.write('  Retrieving... ');
    const imagePath = await retrieveImage(jobId);
    console.log('done');
    
    process.stdout.write('  Uploading... ');
    const sanitizedName = storeName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const imageUrl = await uploadImage(
      imagePath,
      `store-${sanitizedName}.png`,
      `${storeName} gadgets storefront`
    );
    console.log('done');
    
    // Save mapping for later MCP update
    writeStoreImageMapping(store.id, imageUrl);
    
    // Cleanup
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    return { storeId: store.id, imageUrl, success: true };
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { storeId: store.id, success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🏗️  Fetching stores without images...\n');
    const stores = await fetchStoresWithoutImages();
    console.log(`Found ${stores.length} stores needing images\n`);
    
    if (stores.length === 0) {
      console.log('✅ All stores have images!');
      return;
    }
    
    // Clear previous mappings
    const mappingFile = '.builder/store-image-updates.jsonl';
    if (fs.existsSync(mappingFile)) {
      fs.unlinkSync(mappingFile);
    }
    
    console.log('Processing stores...\n');
    
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      await processStoreForImage(store, i + 1, stores.length);
      
      if (i < stores.length - 1) {
        await sleep(500);
      }
    }
    
    console.log('\n✅ All image generations and uploads complete!');
    console.log(`\nNext step: Use MCP tool to update all stores with their images`);
    console.log(`Mappings saved to: ${mappingFile}`);
    
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
