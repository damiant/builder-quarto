---
name: upload-assets
description: >
  Upload image assets to Builder.io using the Upload API and a private API key.
  Use when the user asks to upload, import, add, or publish an image asset to
  Builder.io, the Builder Asset Library, or Builder CDN, especially when they
  reference an image file, attachment, path, or image URL.
---

# Upload Assets

Upload a user-referenced image to Builder.io with the Upload API and report the uploaded asset URL.

## Requirements

- The private API key must be available as `BUILDER_PRIVATE_API_KEY`.
- If `BUILDER_PRIVATE_API_KEY` is missing, stop and ask the user to add it as an environment variable before attempting the upload.
- Never ask the user to paste the private key into chat, never echo it, and never write it to files.
- Only upload images the user has explicitly referenced or asked to upload.

## Upload API

- Endpoint: `https://builder.io/api/v1/upload`
- Method: `POST`
- Auth header: `Authorization: Bearer $BUILDER_PRIVATE_API_KEY`
- Body for local files: raw binary bytes with `--data-binary @file`
- Required useful query params:
  - `name`: asset file/name shown in Builder
  - `altText`: accessible alt text when provided or inferable
- Optional query params:
  - `title`: asset title
  - `folder`: Builder Asset Library folder ID
  - `url`: hosted image URL to import instead of sending file bytes
- File size must be under 100 MB.

## Workflow

1. Identify the image the user wants uploaded:
   - For a local file path, verify it exists before uploading.
   - For an attached file URL or hosted image URL, use the `url` query parameter when the URL is directly accessible; otherwise download/read the image first and upload the bytes.
2. Check that `BUILDER_PRIVATE_API_KEY` is set in the environment.
   - If missing, ask the user to add `BUILDER_PRIVATE_API_KEY` as an environment variable and wait.
3. Determine the asset name:
   - Use the user-provided name if given.
   - Otherwise use the image filename.
4. Determine the MIME type for byte uploads:
   - Prefer the file's detected MIME type.
   - Use image MIME types such as `image/png`, `image/jpeg`, `image/webp`, `image/gif`, or `image/svg+xml`.
5. Upload with the Node `fetch` pattern for local files when available; use `curl` for hosted URL imports or when shell policy allows it. Keep the key out of command output.
6. Parse the JSON response and report:
   - Whether the upload succeeded.
   - The returned `url`.
   - The Builder response `message` or error details if the upload failed.

## Command Patterns

Preferred for a local image file in Fusion environments, because it avoids shell command substitution and keeps `BUILDER_PRIVATE_API_KEY` inside the Node process:

```bash
node -e "const fs=require('node:fs'); const path='public/image.png'; if (!fs.existsSync(path)) { console.error('Missing file: '+path); process.exit(1); } const key=process.env.BUILDER_PRIVATE_API_KEY; if (!key) { console.error('BUILDER_PRIVATE_API_KEY is not set'); process.exit(1); } const params=new URLSearchParams({name:'image.png', altText:'Descriptive alt text'}); fetch('https://builder.io/api/v1/upload?'+params.toString(), {method:'POST', headers:{Authorization:'Bearer '+key, 'Content-Type':'image/png'}, body:fs.readFileSync(path)}).then(async r => { const text=await r.text(); let data; try { data=JSON.parse(text); } catch { data={message:text}; } if (!r.ok) { console.error(JSON.stringify({status:r.status, message:data.message || data.error || text}, null, 2)); process.exit(1); } console.log(JSON.stringify({status:data.status, message:data.message, url:data.url}, null, 2)); }).catch(err => { console.error(err && err.message ? err.message : String(err)); process.exit(1); });"
```

Alternative for a local image file when shell policy allows command substitution:

```bash
asset_file="/path/to/image.png"
asset_name="image.png"
alt_text="Descriptive alt text"
mime_type="$(file --brief --mime-type "$asset_file")"

curl --fail-with-body --silent --show-error \
  --request POST \
  --header "Authorization: Bearer $BUILDER_PRIVATE_API_KEY" \
  --header "Content-Type: $mime_type" \
  --data-binary "@$asset_file" \
  --get \
  --data-urlencode "name=$asset_name" \
  --data-urlencode "altText=$alt_text" \
  "https://builder.io/api/v1/upload"
```

For a hosted image URL:

```bash
image_url="https://example.com/image.png"
asset_name="image.png"
alt_text="Descriptive alt text"

curl --fail-with-body --silent --show-error \
  --request POST \
  --header "Authorization: Bearer $BUILDER_PRIVATE_API_KEY" \
  --get \
  --data-urlencode "name=$asset_name" \
  --data-urlencode "altText=$alt_text" \
  --data-urlencode "url=$image_url" \
  "https://builder.io/api/v1/upload"
```

## Success Response

A successful response looks like:

```json
{
  "status": 200,
  "message": "Success",
  "url": "https://cdn.builder.io/api/v1/image/..."
}
```

Report the uploaded asset URL as a clickable link when possible.

## Gotchas

- Do not proceed without `BUILDER_PRIVATE_API_KEY`; the Upload API requires a private key, not a public API key.
- Do not expose the private key in terminal output, logs, markdown, or generated files.
- URL-encode all query parameter values; filenames and alt text often contain spaces.
- If shell ACL policy blocks heredocs, command substitution, `${...}` expansion, or chained `curl` commands, retry with the Node `fetch` pattern above.
- If `curl --get` changes the request to `GET` in the current curl version, build the query string another safe way and keep `--request POST` explicit.
- For SVG uploads, use `image/svg+xml` and preserve the original file contents.
- If the API returns JSON without `url`, report the full non-secret response summary and treat it as a failed upload.
