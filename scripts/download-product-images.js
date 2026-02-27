/**
 * For each product in product-image-mapping.json:
 * 1. Fetch the TommaTech page HTML
 * 2. Extract main product image URL (pbigimg or first /images/product/)
 * 3. Download image to public/images/products/{id}.webp (or original ext)
 * Run: node scripts/download-product-images.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const mappingPath = path.join(__dirname, 'product-image-mapping.json');
const outDir = path.join(__dirname, '..', 'public', 'images', 'products');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', (ch) => (data += ch));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractImageUrl(html, pageUrl) {
  const base = new URL(pageUrl).origin;
  // Product detail page: id="pbigimg" src="..." or data-img="..."
  let m = html.match(/id="pbigimg"[^>]+src=["']([^"']+)["']/);
  if (m) return m[1].startsWith('http') ? m[1] : base + m[1];
  m = html.match(/data-img=["']([^"']+)["']/);
  if (m) return m[1].startsWith('http') ? m[1] : base + m[1];
  // Category page: first /images/product/ URL (exclude logo, icon)
  const productImgRegex = /(https?:)?\/\/[^"'\s]*\/images\/product\/\d+_[^"'\s]+\.(webp|jpg|jpeg|png)/gi;
  let match;
  while ((match = productImgRegex.exec(html)) !== null) {
    let url = match[0];
    if (url.startsWith('//')) url = 'https:' + url;
    if (!url.includes('logo') && !url.includes('icon')) return url;
  }
  return null;
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', (ch) => chunks.push(ch));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  const results = [];
  for (const [productId, pageUrl] of Object.entries(mapping)) {
    try {
      const html = await fetchHtml(pageUrl);
      const imageUrl = extractImageUrl(html, pageUrl);
      if (!imageUrl) {
        console.log(`Skip ${productId}: no image found`);
        results.push({ id: productId, imageUrl: null, ok: false });
        continue;
      }
      const ext = imageUrl.match(/\.(webp|jpg|jpeg|png)/i)?.[1]?.toLowerCase() || 'webp';
      const outPath = path.join(outDir, `${productId}.${ext}`);
      const buf = await downloadImage(imageUrl);
      fs.writeFileSync(outPath, buf);
      console.log(`OK ${productId} -> ${productId}.${ext}`);
      results.push({ id: productId, imageUrl, path: `/images/products/${productId}.${ext}`, ok: true });
    } catch (err) {
      console.error(`Error ${productId}:`, err.message);
      results.push({ id: productId, error: err.message, ok: false });
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  fs.writeFileSync(path.join(__dirname, 'download-results.json'), JSON.stringify(results, null, 2));
  console.log('Done. Results in scripts/download-results.json');
}

main().catch(console.error);
