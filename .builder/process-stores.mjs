import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';

const apiKey = 'b9fca26fe967446595da74f3f38325f1';
const baseUrl = `https://cdn.builder.io/api/v3/content/stores?apiKey=${apiKey}`;

// Fetch all stores
async function fetchStores() {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}&limit=200&includeUnpublished=true`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const stores = parsed.results || [];
          resolve(stores);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Generate image prompt based on store details
function generatePrompt(store) {
  const data = store.data || {};
  const title = data.title || 'Quarto';
  const state = data.state || '';
  const country = data.country || '';
  
  return `A modern electronics and gadgets storefront facade in ${title}, ${state}, ${country}. The store has a sleek minimalist design with glass frontage, contemporary shelving displaying tech gadgets and electronics, smartphones, drones, gaming devices, and consumer electronics. Upscale urban shopping district aesthetic. Professional product display environment. No text or signage text visible. Daylight photography style with natural lighting.`;
}

// Main workflow
async function processStores() {
  try {
    console.log('Fetching stores...');
    const stores = await fetchStores();
    console.log(`Found ${stores.length} stores\n`);
    
    // For demonstration, process first 3 stores
    const storesToProcess = stores.slice(0, 3);
    
    console.log(`Processing ${storesToProcess.length} stores sequentially...\n`);
    
    for (let i = 0; i < storesToProcess.length; i++) {
      const store = storesToProcess[i];
      const data = store.data || {};
      console.log(`\n[${'='.repeat(60)}]`);
      console.log(`[${i + 1}/${storesToProcess.length}] ${data.title}`);
      console.log(`[${'='.repeat(60)}]`);
      
      // Generate image prompt
      const prompt = generatePrompt(store);
      console.log(`\nGenerating image prompt...`);
      console.log(`Prompt: ${prompt.substring(0, 100)}...`);
      
      // Submit image generation job
      console.log(`\nSubmitting image generation job...`);
      let jobId;
      try {
        const submitOutput = execSync(
          `npx --yes workar submit --type image-gen prompt="${prompt.replace(/"/g, '\\"')}"`,
          { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
        ).trim();
        
        // Extract job ID from output (last line usually contains the ID)
        jobId = submitOutput.split('\n').pop().trim();
        console.log(`Job ID: ${jobId}`);
      } catch (e) {
        console.error(`Failed to submit image generation job: ${e.message}`);
        continue;
      }
      
      // Wait a bit and retrieve image
      console.log(`Waiting for image generation...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Retrieving generated image...`);
      let imagePath;
      try {
        execSync(`npx --yes workar get ${jobId}`, { stdio: 'inherit' });
        imagePath = `./${jobId}.png`;
        console.log(`Image saved to: ${imagePath}`);
      } catch (e) {
        console.error(`Failed to retrieve image: ${e.message}`);
        continue;
      }
      
      console.log(`\nStore: ${data.title}`);
      console.log(`State: ${data.state}`);
      console.log(`Country: ${data.country}`);
      console.log(`Store ID: ${store.id}`);
      console.log(`Image path: ${imagePath}`);
      console.log(`\nNext: Upload and update this store's image property`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

processStores();
