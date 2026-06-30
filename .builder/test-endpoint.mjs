import https from 'https';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const storeId = '2db82030a21c4925909f6f0fab89fa8b';

// Try with model name in path
const payload = JSON.stringify({ data: { image: 'https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F0c965756b1b446d5a8416a34ad2b0bc3' } });

const url = `https://cdn.builder.io/api/v3/content/stores/${storeId}?apiKey=${apiKey}`;
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

console.log('Testing endpoint:', options.path);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', console.error);
req.write(payload);
req.end();
