import fs from 'fs';
import https from 'https';

const mappingFile = '.builder/store-image-updates.jsonl';
const apiKey = 'b9fca26fe967446595da74f3f38325f1';

async function updateStoreViaAPI(storeId, imageUrl) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ data: { image: imageUrl } });
    const url = `https://cdn.builder.io/api/v3/content/${storeId}?apiKey=${apiKey}`;
    
    const reqUrl = new URL(url);
    const options = {
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + reqUrl.search,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Status ${res.statusCode}: ${parsed.message || data}`));
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

async function main() {
  if (!fs.existsSync(mappingFile)) {
    console.log('No mapping file found. Run the image generation script first.');
    return;
  }
  
  const lines = fs.readFileSync(mappingFile, 'utf-8').trim().split('\n');
  console.log(`Found ${lines.length} store updates to apply\n`);
  
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { storeId, imageUrl } = JSON.parse(line);
    
    try {
      await updateStoreViaAPI(storeId, imageUrl);
      console.log(`[${i + 1}/${lines.length}] ✅ Updated store ${storeId}`);
      successful++;
    } catch (error) {
      console.log(`[${i + 1}/${lines.length}] ❌ Failed: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${successful} successful, ${failed} failed`);
}

main().catch(console.error);
