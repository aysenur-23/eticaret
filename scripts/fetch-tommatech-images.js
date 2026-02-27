/**
 * TommaTech product page'lerinden ana ürün görseli URL'lerini çıkarır.
 * Kullanım: node scripts/fetch-tommatech-images.js
 * Çıktı: tommatech-image-urls.json (productId -> imageUrl)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Sitedeki 46 TommaTech ürün id'si -> tommatech.de ürün sayfası URL eşlemesi
// tommatech.de/en/products/ altındaki kategorilerden ve ürün sayfalarından derlendi
const PRODUCT_PAGE_MAP = {
  'tommatech-m10-topcon-dark-n-type': 'https://tommatech.de/en/product/tommatech-535wp-144pm-m10-dark-series-solar-panel-971.html',
  'tommatech-m10-topcon-full-black-sizdirmaz': 'https://tommatech.de/en/product/tommatech-m10-full-black-solar-panel-972.html',
  'tommatech-m10-perc-dark-series': 'https://tommatech.de/en/product/tommatech-535wp-144pm-m10-dark-series-solar-panel-971.html',
  'tommatech-esnek-flexible-paneller': 'https://tommatech.de/en/products/solar-panels-1.html',
  'tommatech-katlanabilir-200wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-katlanabilir-110wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-micro-s-800w': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-uno-atom': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-uno-home': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-trio-atom-plus-k': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-uno-hybrid-k': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-trio-hybrid-k': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-trio-hybrid-lv-f': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-trio-hybrid-m-50kw': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-offgrid-new-pro-plus': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-sarj-kontrol-au-scc': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-hightech-lifepo4-3kwh': 'https://tommatech.de/en/product/tommatech-3-kwh-lithium-batterystorage-management-system-352.html',
  'tommatech-hightech-5-8kwh-booster': 'https://tommatech.de/en/product/tommatech-high-tech-power-general-pack-58kwh-lithium-battery-353.html',
  'tommatech-prizmatik-51-2v-high-capacity': 'https://tommatech.de/en/products/storage-solutions-56.html',
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

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractFirstProductImage(html, baseUrl) {
  const base = baseUrl.replace(/\/[^/]+$/, '/');
  const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  const candidates = [];
  let m;
  while ((m = imgRe.exec(html)) !== null) {
    let src = m[1];
    if (src.startsWith('//')) src = 'https:' + src;
    else if (src.startsWith('/')) src = 'https://tommatech.de' + src;
    else if (!src.startsWith('http')) src = base + src;
    if (/\.(jpg|jpeg|png|webp)(\?|$)/i.test(src) && !/logo|icon|banner|pixel|1x1/i.test(src))
      candidates.push(src);
  }
  return candidates[0] || null;
}

async function main() {
  const results = {};
  const productPages = Object.entries(PRODUCT_PAGE_MAP).filter(([_, url]) => url.includes('/product/'));
  for (const [productId, pageUrl] of productPages) {
    try {
      const html = await fetchHtml(pageUrl);
      const imgUrl = extractFirstProductImage(html, pageUrl);
      if (imgUrl) results[productId] = imgUrl;
      else results[productId] = null;
    } catch (e) {
      results[productId] = null;
    }
  }
  const outPath = path.join(__dirname, '..', 'tommatech-image-urls.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Written', outPath);
  console.log('Fetched image URLs:', Object.values(results).filter(Boolean).length, '/', Object.keys(results).length);
}

main().catch(console.error);
