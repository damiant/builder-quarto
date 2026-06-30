import https from 'https';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';

const updates = [
  {
    id: '2db82030a21c4925909f6f0fab89fa8b',
    title: 'Dallas Uptown',
    imageUrl: 'https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F0c965756b1b446d5a8416a34ad2b0bc3'
  },
  {
    id: '63af9076c4d346e6a8a85d233a0d315b',
    title: 'Dubai Downtown',
    imageUrl: 'https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2Fe13c9f35e4e14f2aa5234f49c9d43038'
  }
];

function updateStore(storeId, imageUrl, title) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ data: { image: imageUrl } });
    
    const reqUrl = new URL(`https://cdn.builder.io/api/v3/content/stores/${storeId}`);
    reqUrl.searchParams.set('apiKey', apiKey);
    
    const options = {
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + '?' + reqUrl.searchParams.toString(),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };
    
    console.log(`Attempting POST to: ${options.path}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Status ${res.statusCode}: ${parsed.message || JSON.stringify(parsed)}`));
          } else {
            resolve({ success: true, data: parsed });
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data });
          } else {
            reject(new Error(`Status ${res.statusCode}: ${data}`));
          }
        }
      });
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('Updating stores with generated images...\n');
  
  for (const update of updates) {
    try {
      await updateStore(update.id, update.imageUrl, update.title);
      console.log(`✅ Updated ${update.title}\n`);
    } catch (error) {
      console.error(`❌ Failed to update ${update.title}: ${error.message}\n`);
    }
  }
  
  console.log('✅ All updates complete!');
}

main();
