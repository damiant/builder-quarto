import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const baseUrl = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}`;

// Fetch all stores
async function fetchStores() {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}&limit=200&includeUnpublished=true`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const stores = parsed.results || [];
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

      // Extract job ID from "Submitted work 2026-06-29-20-21-03-206" format
      const match = result.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
      const jobId = match ? match[1] : result.split('\n').pop().trim();
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

      // Extract filename from "I saved the result to work-2026-06-29-20-21-03-206.png"
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

async function updateStore(storeId, imageUrl) {
  return new Promise((resolve, reject) => {
    const key = process.env.BUILDER_PRIVATE_API_KEY;
    if (!key) {
      reject(new Error('BUILDER_PRIVATE_API_KEY not set'));
      return;
    }
    
    const payload = JSON.stringify({ data: { image: imageUrl } });
    const url = `https://cdn.builder.io/api/v3/content/stores/${storeId}?apiKey=${apiKey}`;
    
    const reqUrl = new URL(url);
    const req = https.request({
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + reqUrl.search,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!res.statusCode || res.statusCode >= 400) {
            reject(new Error(`Update failed: ${parsed.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processStore(store, index, total) {
  const data = store.data || {};
  const storeName = data.title || 'Unknown';
  
  console.log(`\n[${'='.repeat(70)}]`);
  console.log(`[${index}/${total}] Processing: ${storeName}`);
  console.log(`[${'='.repeat(70)}]`);
  console.log(`Location: ${data.state}, ${data.country}`);
  
  try {
    // Generate image
    console.log(`\n1️⃣  Generating image prompt...`);
    const prompt = generatePrompt(store);
    
    console.log(`2️⃣  Submitting image generation job...`);
    const jobId = await submitImageJob(prompt);
    console.log(`    Job ID: ${jobId}`);
    
    // Wait for generation
    console.log(`⏳ Waiting for image generation (5 seconds)...`);
    await sleep(5000);
    
    console.log(`3️⃣  Retrieving generated image...`);
    const imagePath = await retrieveImage(jobId);
    console.log(`    Image: ${imagePath}`);
    
    // Upload image
    console.log(`4️⃣  Uploading to Builder.io...`);
    const sanitizedName = storeName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const imageUrl = await uploadImage(
      imagePath,
      `store-${sanitizedName}.png`,
      `${storeName} gadgets storefront`
    );
    console.log(`    ✅ Uploaded: ${imageUrl.substring(0, 80)}...`);
    
    // Update store
    console.log(`5️⃣  Updating store data...`);
    await updateStore(store.id, imageUrl);
    console.log(`    ✅ Store updated successfully`);
    
    // Cleanup
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    console.log(`✅ Complete!\n`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    console.log('🏗️  Fetching all stores...\n');
    const stores = await fetchStores();
    console.log(`Found ${stores.length} stores`);
    
    // Start from index 2 (we already processed 0 and 1)
    const startIndex = 2;
    const storesToProcess = stores.slice(startIndex);
    
    console.log(`\nProcessing ${storesToProcess.length} remaining stores sequentially...\n`);
    
    for (let i = 0; i < storesToProcess.length; i++) {
      const store = storesToProcess[i];
      const displayIndex = startIndex + i + 1;
      
      try {
        await processStore(store, displayIndex, stores.length);
      } catch (error) {
        console.error(`\nSkipping store due to error. Continuing with next...\n`);
      }
      
      // Small delay between stores to avoid rate limiting
      if (i < storesToProcess.length - 1) {
        await sleep(1000);
      }
    }
    
    console.log(`\n🎉 All stores processed!`);
    
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
