import https from 'https';
import fs from 'fs';

const stores = [
  {
    id: '467d235769f74ada8e92c64be52da7fb',
    title: 'Nashville Gulch',
    file: 'work-2026-06-29-21-16-14-065.png'
  },
  {
    id: '467d235769f74ada8e92c64be52da7fb',
    title: 'Portland Pearl District',
    file: 'work-2026-06-29-21-16-19-376.png'
  },
  {
    id: 'f2728801dac34461bc4bbc08e96c20b7',
    title: 'San Francisco Union Square',
    file: 'work-2026-06-29-21-16-23-690.png'
  },
  {
    id: 'db84d09b21004491b5f947fe75f85a21',
    title: 'Austin South Congress',
    file: 'work-2026-06-29-21-16-28-948.png'
  },
  {
    id: '0447884ce31d4fedb13d3bb7dff19ce8',
    title: 'Denver Cherry Creek',
    file: 'work-2026-06-29-21-16-32-905.png'
  },
  {
    id: '83ea14cef11248f78466889d650064e1',
    title: 'Atlanta Midtown',
    file: 'work-2026-06-29-21-16-36-994.png'
  }
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
  console.log('Uploading 6 new store images and saving mappings...\n');
  
  let successful = 0;
  
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    try {
      process.stdout.write(`${i + 1}. ${store.title}... `);
      
      const sanitized = store.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const imageUrl = await uploadImage(
        store.file,
        `store-${sanitized}.png`,
        `${store.title} gadgets storefront`
      );
      
      console.log('✓');
      
      // Save mapping
      fs.appendFileSync('.builder/store-image-updates.jsonl',
        JSON.stringify({ storeId: store.id, imageUrl }) + '\n'
      );
      
      successful++;
      
      // Cleanup image file
      if (fs.existsSync(store.file)) {
        fs.unlinkSync(store.file);
      }
      
    } catch (error) {
      console.log(`✗ ${error.message}`);
    }
  }
  
  console.log(`\n✅ Uploaded and mapped ${successful}/6 stores\n`);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
