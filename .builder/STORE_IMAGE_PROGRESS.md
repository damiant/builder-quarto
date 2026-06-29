# Store Image Generation Progress

## Summary

**Status**: In Progress (7 of 70 stores completed)  
**Completion Rate**: 10%  
**Time per Store**: ~5-7 minutes (image generation + upload)  
**Total Estimated Time**: 6-8 hours for all 70 stores

## Completed Stores (7/70)

### ✅ Completed
1. **Washington Georgetown** - District of Columbia, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F41c4cf363a504d47ba8be300e27d4751`
   - Updated: YES

2. **San Diego La Jolla** - California, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F5eb6f4b742aa41a2af48f4837ab10679`
   - Updated: YES

3. **Las Vegas Summerlin** - Nevada, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2Fcf0157db11cd487a8215551938f51b90`
   - Updated: YES

4. **Charlotte SouthPark** - North Carolina, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F2afad877d8e747479df8584ce70eddca`
   - Updated: YES

5. **Minneapolis North Loop** - Minnesota, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2Ff0a3e8a53ca542d092b16b8030ab19ab`
   - Updated: YES

6. **Philadelphia Rittenhouse** - Pennsylvania, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F51ded8ebccaf4e16946f8adebf99c604`
   - Updated: YES

7. **Phoenix Scottsdale** - Arizona, United States
   - Image: `https://cdn.builder.io/api/v1/image/assets%2Fb9fca26fe967446595da74f3f38325f1%2F5610c21a54a84a4d80ea7c41fb408025`
   - Updated: YES

## Remaining Stores (63/70)

The following 63 stores still need images generated and associated:

- Nashville Gulch, Tennessee, United States
- Portland Pearl District, Oregon, United States
- San Francisco Union Square, California, United States
- Austin South Congress, Texas, United States
- Denver Cherry Creek, Colorado, United States
- Atlanta Midtown, Georgia, United States
- Boston Back Bay, Massachusetts, United States
- Seattle Capitol Hill, Washington, United States
- Dallas Uptown, Texas, United States
- Miami Design District, Florida, United States
- Chicago Loop, Illinois, United States
- Los Angeles Melrose, California, United States
- New York SoHo, New York, United States
- Tel Aviv Dizengoff, Israel
- Doha West Bay, Qatar
- Dubai Downtown, United Arab Emirates
- Johannesburg Sandton, South Africa
- Cape Town V&A, South Africa
- Lima Miraflores, Peru
- Bogotá Zona T, Colombia
- Santiago Providencia, Chile
- Buenos Aires Palermo, Argentina
- Rio Ipanema, Brazil
- São Paulo Jardins, Brazil
- Guadalajara Centro, Mexico
- Mexico City Polanco, Mexico
- Montreal Sainte-Catherine, Canada
- Vancouver Robson, Canada
- Toronto Queen West, Canada
- Auckland Britomart, New Zealand
- Brisbane Queen Street, Australia
- Melbourne Collins, Australia
- Sydney Pitt Street, Australia
- Perth Hay Street, Australia
- Shanghai Jing An, China
- Beijing Chaoyang, China
- Tokyo Shibuya, Japan
- Osaka Umeda, Japan
- Seoul Gangnam, South Korea
- Bangkok Ploenchit, Thailand
- Singapore Orchard, Singapore
- Hong Kong Central, Hong Kong
- Mumbai BKC, India
- New Delhi Connaught, India
- Bangkok Silom, Thailand
- Kuala Lumpur Pavilion, Malaysia
- Jakarta Senayan, Indonesia
- Manila Ayala, Philippines
- London Regent Street, United Kingdom
- Paris Marais, France
- Berlin Charlottenburg, Germany
- Madrid Gran Vía, Spain
- Barcelona Paseo de Gracia, Spain
- Rome Via Condotti, Italy
- Milan Galleria, Italy
- Amsterdam Dam, Netherlands
- Vienna Stephansplatz, Austria
- Zurich Bahnhofstrasse, Switzerland
- Geneva Rue du Rhône, Switzerland
- Stockholm Norrmalm, Sweden
- Copenhagen Strøget, Denmark
- Helsinki Aleksanterinkatu, Finland

## Processing Scripts

### Main Script: `batch-process-stores.mjs`
Processes remaining stores with image generation, upload, and creates update mappings.

**Usage:**
```bash
node .builder/batch-process-stores.mjs
```

### Alternative: `process-remaining-stores.mjs`
Original script with progress tracking. Can be resumed if interrupted.

## Next Steps

1. **Continue Processing**: Run the batch processor script to generate images for remaining 63 stores
   ```bash
   node .builder/batch-process-stores.mjs
   ```

2. **Monitor Progress**: Mappings are saved to `.builder/batch-updates.jsonl`

3. **Apply Updates**: Once images are generated and uploaded, use the MCP tool to update stores:
   ```javascript
   // For each store ID and image URL:
   mcp__buildercms__update_builder_content({
     contentId: storeId,
     data: { image: imageUrl }
   })
   ```

## Technical Details

### Image Generation Workflow

1. **Generate Prompt**: Create descriptive prompt based on store location
   - Format: "A modern electronics and gadgets storefront facade in [Title], [State], [Country]..."
   - No text or signage visible (as requested)

2. **Submit Job**: Use `workar` CLI to submit image generation
   - Command: `npx --yes workar submit --type image-gen prompt="..."`
   - Returns: Job ID (e.g., `2026-06-29-20-16-44-206`)

3. **Retrieve Image**: Wait and fetch generated image
   - Command: `npx --yes workar get {jobId}`
   - Output: PNG file saved locally

4. **Upload to Builder**: Upload to Builder.io Asset Library
   - API: `https://builder.io/api/v1/upload`
   - Auth: `Bearer BUILDER_PRIVATE_API_KEY`
   - Returns: CDN URL for the image

5. **Update Store**: Associate image with store record
   - Tool: `mcp__buildercms__update_builder_content`
   - Field: `data.image`
   - Value: CDN URL from upload

### Files Created

- `.builder/batch-process-stores.mjs` - Main batch processor
- `.builder/process-remaining-stores.mjs` - Original processor
- `.builder/fetch-stores.mjs` - Utility to fetch all stores
- `.builder/store-image-updates.jsonl` - Completed mappings (5 entries)
- `.builder/batch-updates.jsonl` - Batch processor mappings (if run)
- `.builder/STORE_IMAGE_PROGRESS.md` - This file

## Estimated Timeline

- **Current**: 7 stores done (10%)
- **Remaining**: 63 stores × 5.5 min = ~346 minutes ≈ 5.8 hours
- **Total**: ~6-7 hours for full completion
- **Recommendation**: Run overnight or in parallel batches if possible

## Known Issues & Solutions

### Issue: Timeout after 10 minutes
**Solution**: Script designed with individual timeouts per image. If one fails, it continues to the next.

### Issue: Image generation takes ~5 minutes per image
**Solution**: This is expected. To speed up, multiple jobs can be submitted in parallel (workar supports queuing).

### Issue: BUILDER_PRIVATE_API_KEY not set
**Solution**: Environment variable must be set before running uploads.
```bash
export BUILDER_PRIVATE_API_KEY="your-key-here"
```

## API Endpoints Used

- **Stores CMS**: `https://cdn.builder.io/api/v3/content/stores`
- **Image Upload**: `https://builder.io/api/v1/upload`
- **Image Generation**: workar CLI (managed by `workar` service)

## How to Resume

If the script is interrupted, it can be resumed:

1. Check what's been completed in mapping files
2. Run the batch processor again - it will skip stores with images
3. Apply new mappings to Builder CMS

The process is idempotent and safe to restart at any point.
