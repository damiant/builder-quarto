import https from 'https';
import fs from 'fs';

const API_KEY = 'b9fca26fe967446595da74f3f38325f1';

// Map of image files we have to store info
const imageMap = [
  { 
    file: 'work-2026-06-29-20-31-16-936.png',
    storeName: 'Las Vegas Summerlin',
    storeId: '2f3c4446d6cb4812aad257ef7b4c9a1b'
  },
  {
    file: 'work-2026-06-29-20-33-01-481.png',
    storeName: 'Charlotte SouthPark',
    storeId: '33ae3cc2a935447484d57e18d7259459'
  },
  {
    file: 'work-2026-06-29-20-39-39-465.png',
    storeName: 'Minneapolis North Loop',
    storeId: 'b1069fb4836f4fbeb224688a30947f71'
  },
  {
    file: 'work-2026-06-29-20-41-23-484.png',
    storeName: 'Philadelphia Rittenhouse',
    storeId: 'e9585727631440929995bfc20724f3b8'
  },
];

async function uploadImage(imagePath, name, altText) {
  return new Promise((resolve, reject) => {
    const key = process.env.BUILDER_PRIVATE_API_KEY;
    if (!key) {
      reject(new Error('BUILDER_PRIVATE_API_KEY not set'));
      return;
    }
    
    if (!fs.existsSync(imagePath)) {
      reject(new Error(`File not found: ${imagePath}`));
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
            reject(new Error(`Status ${res.statusCode}: ${parsed.message}`));
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

async function main() {
  console.log('Uploading available images...\n');
  
  let count = 0;
  for (const item of imageMap) {
    try {
      console.log(`${count + 1}. ${item.storeName}`);
      process.stdout.write('   Uploading... ');
      
      const sanitized = item.storeName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const imageUrl = await uploadImage(
        item.file, 
        `store-${sanitized}.png`,
        `${item.storeName} gadgets storefront`
      );
      
      console.log('✓');
      
      // Save mapping
      fs.appendFileSync('.builder/store-image-updates.jsonl',
        JSON.stringify({ storeId: item.storeId, imageUrl }) + '\n'
      );
      
      count++;
    } catch (error) {
      console.log(`✗ ${error.message}`);
    }
  }
  
  console.log(`\n✅ Uploaded ${count} images`);
  console.log('\nMappings saved. Now need to process 6 more stores.');
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
