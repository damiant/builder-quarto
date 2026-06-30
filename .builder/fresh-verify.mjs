import https from 'https';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';

const stores = [
  '2db82030a21c4925909f6f0fab89fa8b',  // Dallas Uptown
  '63af9076c4d346e6a8a85d233a0d315b'   // Dubai Downtown
];

function getStoreViaV1(storeId) {
  return new Promise((resolve, reject) => {
    const url = `https://cdn.builder.io/api/v1/content/${storeId}?apiKey=${apiKey}&_t=${Date.now()}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ error: 'Parse error', raw: data.substring(0, 100) });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Checking stores via v1 API with fresh timestamp:\n');
  
  for (const storeId of stores) {
    try {
      const result = await getStoreViaV1(storeId);
      if (result.data && result.data.image) {
        console.log(`✅ ${storeId}: HAS IMAGE`);
        console.log(`   URL: ${result.data.image.substring(0, 80)}...`);
      } else if (result.error) {
        console.log(`❌ ${storeId}: ${result.error}`);
      } else {
        console.log(`❌ ${storeId}: NO IMAGE`);
      }
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
}

main();
