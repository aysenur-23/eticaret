/**
 * TommaTech ürün sayfalarından ana görseli indirir, public/images/products/tommatech/ altına kaydeder.
 * Kullanım: node scripts/download-tommatech-images.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const MAPPING = {
  'tommatech-m10-topcon-dark-n-type': 'https://tommatech.de/en/product/tommatech-590wp-144tn-m10-topcon-solar-panel-1145.html',
  'tommatech-m10-topcon-full-black-sizdirmaz': 'https://tommatech.de/en/product/tommatech-m10-full-black-solar-panel-972.html',
  'tommatech-m10-perc-dark-series': 'https://tommatech.de/en/product/tommatech-535wp-144pm-m10-dark-series-solar-panel-971.html',
  'tommatech-esnek-flexible-paneller': 'https://tommatech.de/en/products/solar-panels-1.html',
  'tommatech-katlanabilir-200wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-katlanabilir-110wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-micro-s-800w': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-uno-atom': 'https://tommatech.de/en/products/on-grid-inverters-72.html',
  'tommatech-uno-home': 'https://tommatech.de/en/product/tommatech-uno-home-55kw-single-phase-string-inverter-1041.html',
  'tommatech-trio-atom-plus-k': 'https://tommatech.de/en/products/on-grid-inverters-72.html',
  'tommatech-uno-hybrid-k': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-k': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-lv-f': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-m-50kw': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-offgrid-new-pro-plus': 'https://tommatech.de/en/products/off-grid-inverters-20.html',
  'tommatech-sarj-kontrol-au-scc': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-hightech-lifepo4-3kwh': 'https://tommatech.de/en/product/tommatech-3-kwh-lithium-batterystorage-management-system-352.html',
  'tommatech-hightech-5-8kwh-booster': 'https://tommatech.de/en/product/tommatech-high-tech-power-general-pack-58kwh-lithium-battery-353.html',
  'tommatech-prizmatik-51-2v-high-capacity': 'https://tommatech.de/en/products/residential-energy-storage-solutions-130.html',
  'tommatech-prizmatik-marin-karavan': 'https://tommatech.de/en/products/marine-storage-solutions-152.html',
  'tommatech-mobil-guc-istasyonu': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-endustriyel-ess-kabin': 'https://tommatech.de/en/products/industrial-energy-storage-solutions-133.html',
  'tommatech-r290-dc-inverter-isı-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-split-evi-dc-inverter': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-havuz-isı-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-endustriyel-isı-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-ev-ac-dc-sarj': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-ev-sarj-kablosu': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-fan-coil-unitesi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-akumulasyon-tanki': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-solar-carport': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-solar-sulama-inverter-spi': 'https://tommatech.de/en/products/irrigation-systems-115.html',
  'tommatech-hazir-solar-sulama-panosu': 'https://tommatech.de/en/products/irrigation-systems-115.html',
  'tommatech-wifi-lan-4g-dongle': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-smart-meter': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-eps-box': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-smart-controller': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-heatpump-controller': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-booster-paralel-box': 'https://tommatech.de/en/products/storage-solutions-56.html',
  'tommatech-solar-led-yuruyus-yolu': 'https://tommatech.de/en/products/solar-lighting-solutions-models-prices-157.html',
  'tommatech-solar-carport-2car': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
};

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products', 'tommatech');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': UA } };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractFirstProductImageUrl(html) {
  const re = /https:\/\/tommatech\.de\/images\/product\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi;
  const m = re.exec(html);
  if (m) return m[0];
  const re2 = /src=["'](\/images\/product\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i;
  const m2 = re2.exec(html);
  if (m2) return 'https://tommatech.de' + m2[1];
  return null;
}

function download(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({ hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': UA } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = {};
  const ids = Object.keys(MAPPING);
  for (let i = 0; i < ids.length; i++) {
    const productId = ids[i];
    const pageUrl = MAPPING[productId];
    try {
      const html = await fetchHtml(pageUrl);
      const imgUrl = extractFirstProductImageUrl(html);
      if (!imgUrl) {
        console.log(`[${i + 1}/${ids.length}] ${productId}: no image found`);
        continue;
      }
      const ext = (imgUrl.match(/\.(webp|png|jpe?g)/i) || ['', 'jpg'])[1].toLowerCase();
      const filename = productId + '.' + (ext === 'jpeg' ? 'jpg' : ext);
      const filepath = path.join(OUT_DIR, filename);
      const buf = await download(imgUrl);
      fs.writeFileSync(filepath, buf);
      results[productId] = '/images/products/tommatech/' + filename;
      console.log(`[${i + 1}/${ids.length}] ${productId}: saved`);
    } catch (e) {
      console.log(`[${i + 1}/${ids.length}] ${productId}: error ${e.message}`);
    }
  }
  const outJson = path.join(__dirname, '..', 'tommatech-downloaded-images.json');
  fs.writeFileSync(outJson, JSON.stringify(results, null, 2));
  console.log('Downloaded', Object.keys(results).length, 'images. Wrote', outJson);
}

main().catch(console.error);
