import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';

// Job IDs we submitted earlier that are still generating
const queuedJobs = [
  { id: '2026-06-29-21-05-33-090', store: 'Nashville Gulch' },
  { id: '2026-06-29-21-06-43-662', store: 'Portland Pearl District' },
  { id: '2026-06-29-21-07-53-347', store: 'San Francisco Union Square' },
  { id: '2026-06-29-21-09-03-029', store: 'Austin South Congress' },
];

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processExisting() {
  console.log('Processing existing image files...\n');
  
  const existingFiles = [
    { path: 'work-2026-06-29-20-31-16-936.png', store: 'Las Vegas Summerlin' },
    { path: 'work-2026-06-29-20-33-01-481.png', store: 'Charlotte SouthPark' },
    { path: 'work-2026-06-29-20-39-39-465.png', store: 'Minneapolis North Loop' },
    { path: 'work-2026-06-29-20-41-23-484.png', store: 'Philadelphia Rittenhouse' },
  ];
  
  let uploaded = 0;
  
  for (const file of existingFiles) {
    if (fs.existsSync(file.path)) {
      try {
        console.log(`Uploading ${file.store}...`);
        const sanitized = file.store.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const imageUrl = await uploadImage(file.path, `store-${sanitized}.png`, `${file.store} storefront`);
        
        console.log(`  ✓ ${imageUrl.substring(0, 100)}...`);
        fs.appendFileSync('.builder/store-image-updates.jsonl', 
          JSON.stringify({ 
            storeId: 'pending', 
            store: file.store,
            imageUrl 
          }) + '\n');
        uploaded++;
      } catch (e) {
        console.log(`  ✗ ${e.message}`);
      }
    }
  }
  
  return uploaded;
}

async function main() {
  try {
    const existingCount = await processExisting();
    console.log(`\n✅ Processed ${existingCount} existing images`);
    console.log('\nNote: Store ID associations still need to be linked via MCP tool');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
