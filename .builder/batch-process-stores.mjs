import https from 'https';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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
  return `A modern electronics and gadgets storefront facade in ${data.title}, ${data.state}, ${data.country}. Sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets, smartphones, drones, gaming devices. Urban shopping district aesthetic. No text or signage visible. Daylight photography style.`;
}

async function generateAndUploadImage(store, index) {
  const data = store.data || {};
  const title = data.title || 'Unknown';
  
  try {
    const prompt = generatePrompt(store);
    
    // Submit job
    const submitOutput = execSync(
      `npx --yes workar submit --type image-gen prompt="${prompt.replace(/"/g, '\\"')}" 2>&1`,
      { encoding: 'utf-8', timeout: 30000 }
    ).trim();
    
    const match = submitOutput.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
    if (!match) throw new Error('Failed to extract job ID');
    const jobId = match[1];
    
    // Wait and retrieve
    await new Promise(r => setTimeout(r, 5000));
    
    const retrieveOutput = execSync(`npx --yes workar get ${jobId} 2>&1`, { 
      encoding: 'utf-8',
      timeout: 30000
    });
    
    const fileMatch = retrieveOutput.match(/I saved the result to\s+"?([^"]+\.png)"?/);
    const imagePath = fileMatch ? fileMatch[1] : `work-${jobId}.png`;
    
    if (!fs.existsSync(imagePath)) throw new Error(`Image file not found: ${imagePath}`);
    
    // Upload
    const key = process.env.BUILDER_PRIVATE_API_KEY;
    if (!key) throw new Error('BUILDER_PRIVATE_API_KEY not set');
    
    const fileContent = fs.readFileSync(imagePath);
    const uploadUrl = new URL('https://builder.io/api/v1/upload');
    uploadUrl.searchParams.set('name', `store-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`);
    uploadUrl.searchParams.set('altText', `${title} gadgets storefront`);
    
    const uploadResult = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: uploadUrl.hostname,
        path: uploadUrl.pathname + uploadUrl.search,
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
            if (res.statusCode >= 400) reject(new Error(parsed.message));
            else resolve(parsed.url);
          } catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(fileContent);
      req.end();
    });
    
    // Cleanup
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    return { storeId: store.id, imageUrl: uploadResult, success: true };
    
  } catch (error) {
    return { storeId: store.id, success: false, error: error.message };
  }
}

async function main() {
  const stores = await fetchAllStores();
  
  // Get stores without images
  const storesNeedingImages = stores.filter(s => !s.data?.image);
  console.log(`\nProcessing ${storesNeedingImages.length} stores needing images\n`);
  
  for (let i = 0; i < storesNeedingImages.length; i++) {
    const store = storesNeedingImages[i];
    const data = store.data || {};
    
    try {
      console.log(`[${i + 1}/${storesNeedingImages.length}] ${data.title} - ${data.state}, ${data.country}`);
      const result = await generateAndUploadImage(store, i);
      
      if (result.success) {
        console.log(`  ✅ Generated and uploaded`);
        // Save to mappings
        fs.appendFileSync(
          '.builder/batch-updates.jsonl',
          JSON.stringify({ storeId: result.storeId, imageUrl: result.imageUrl }) + '\n'
        );
      } else {
        console.log(`  ❌ ${result.error}`);
      }
    } catch (error) {
      console.log(`  ❌ ${error.message}`);
    }
  }
  
  console.log('\n✅ Batch processing complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
