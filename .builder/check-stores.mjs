import https from "https";

const apiKey = "b9fca26fe967446595da74f3f38325f1";
const url = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}&limit=200&includeUnpublished=true`;

https
  .get(url, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const parsed = JSON.parse(data);
      const stores = parsed.results || [];

      const withoutImages = stores.filter((s) => !s.data.image || s.data.image.trim() === "");

      console.log(`Total stores: ${stores.length}`);
      console.log(`Stores without images: ${withoutImages.length}\n`);

      console.log("First 10 stores without images:");
      withoutImages.slice(0, 10).forEach((store, i) => {
        const d = store.data || {};
        console.log(`${i + 1}. ID: ${store.id}`);
        console.log(`   Title: ${d.title}`);
        console.log(`   Location: ${d.state}, ${d.country}`);
        console.log(`   Address: ${d.address}\n`);
      });
    });
  })
  .on("error", console.error);
