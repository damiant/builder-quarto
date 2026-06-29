import https from 'https';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const url = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}&limit=200&includeUnpublished=true`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const stores = parsed.results || [];
    
    console.log(`Total stores: ${stores.length}\n`);
    
    stores.slice(0, 5).forEach((store, i) => {
      const d = store.data || {};
      console.log(`${i+1}. ${d.title} - ${d.state}, ${d.country}`);
      console.log(`   ID: ${store.id}`);
    });
    
    // Save all stores to JSON for processing
    console.log('\n--- ALL STORE IDS FOR PROCESSING ---');
    stores.forEach(store => {
      const d = store.data || {};
      console.log(JSON.stringify({
        id: store.id,
        title: d.title,
        state: d.state,
        country: d.country
      }));
    });
  });
}).on('error', console.error);
