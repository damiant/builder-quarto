import https from "https";

const apiKey = "b9fca26fe967446595da74f3f38325f1";

const storeIds = [
  { id: "2db82030a21c4925909f6f0fab89fa8b", title: "Dallas Uptown" },
  { id: "63af9076c4d346e6a8a85d233a0d315b", title: "Dubai Downtown" },
];

function fetchStoreImage(storeId) {
  return new Promise((resolve, reject) => {
    const url = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}&limit=1&query.id=${storeId}`;
    const reqUrl = new URL(url);

    https
      .get(reqUrl.href, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const store = parsed.results && parsed.results[0];
            resolve(store);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  for (const store of storeIds) {
    try {
      const content = await fetchStoreImage(store.id);
      const hasImage = content.data && content.data.image;
      console.log(`${store.title}:`);
      console.log(`  Has image: ${hasImage ? "YES ✅" : "NO ❌"}`);
      if (hasImage) {
        console.log(`  Image URL: ${content.data.image}`);
      }
      console.log();
    } catch (error) {
      console.error(`Error fetching ${store.title}:`, error.message);
    }
  }
}

void main();
