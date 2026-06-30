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
  return `A modern electronics and gadgets storefront facade in ${data.title}, ${data.state}, ${data.country}. Sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets, smartphones, drones, gaming devices. Urban shopping district aesthetic. No text or signage visible. Daylight photography style.`;
}

async function generateAndUploadImage(store) {
  const data = store.data || {};
  const title = data.title || 'Unknown';
  
  console.log(`\n📸 Generating image for: ${title}`);
  
  try {
    const prompt = generatePrompt(store);
    
    // Submit job
    console.log('  ⏳ Submitting image generation job...');
    const submitOutput = execSync(
      `npx --yes workar submit --type image-gen prompt="${prompt.replace(/"/g, '\\"')}" 2>&1`,
      { encoding: 'utf-8', timeout: 30000 }
    ).trim();
    
    const match = submitOutput.match(/Submitted work\s+(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3})/);
    if (!match) throw new Error('Failed to extract job ID');
    const jobId = match[1];
    console.log(`  ✅ Job submitted: ${jobId}`);
    
    // Wait and retrieve
    console.log('  ⏳ Waiting for image generation (~30-40 seconds)...');
    await new Promise(r => setTimeout(r, 5000));
    
    const retrieveOutput = execSync(`npx --yes workar get ${jobId} 2>&1`, { 
      encoding: 'utf-8',
      timeout: 60000
    });
    
    const fileMatch = retrieveOutput.match(/I saved the result to\s+"?([^"]+\.png)"?/);
    const imagePath = fileMatch ? fileMatch[1] : `work-${jobId}.png`;
    
    if (!fs.existsSync(imagePath)) throw new Error(`Image file not found: ${imagePath}`);
    console.log(`  ✅ Image generated: ${imagePath}`);
    
    // Upload
    console.log('  ⏳ Uploading to Builder...');
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
            if (res.statusCode >= 400) reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
            else resolve(parsed.url);
          } catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(fileContent);
      req.end();
    });
    
    console.log(`  ✅ Uploaded to: ${uploadResult}`);
    
    // Cleanup
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    return { storeId: store.id, imageUrl: uploadResult };
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    throw error;
  }
}

async function updateStore(storeId, imageUrl) {
  console.log(`  ⏳ Updating store record...`);
  return new Promise((resolve, reject) => {
    const url = new URL(`https://builder.io/api/v1/content/${storeId}`);
    url.searchParams.set('apiKey', apiKey);
    
    const key = process.env.BUILDER_PRIVATE_API_KEY;
    const payload = JSON.stringify({ data: { image: imageUrl } });
    
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
          else {
            console.log(`  ✅ Store updated with image`);
            resolve(parsed);
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  try {
    const stores = await fetchAllStores();
    const storesNeedingImages = stores.filter(s => !s.data?.image);
    
    console.log(`\n🎯 Found ${storesNeedingImages.length} stores needing images`);
    console.log('Processing first 3 stores sequentially...\n');
    
    const first3 = storesNeedingImages.slice(0, 3);
    
    for (let i = 0; i < first3.length; i++) {
      const store = first3[i];
      const data = store.data || {};
      
      console.log(`\n[${i + 1}/3] ${data.title} (${data.state}, ${data.country})`);
      
      try {
        const { storeId, imageUrl } = await generateAndUploadImage(store);
        await updateStore(storeId, imageUrl);
        console.log(`✨ Complete!`);
      } catch (error) {
        console.log(`\n❌ Failed: ${error.message}`);
        process.exit(1);
      }
    }
    
    console.log('\n\n✅ Successfully processed 3 stores!\n');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
