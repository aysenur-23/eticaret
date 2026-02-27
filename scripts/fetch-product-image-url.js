/**
 * Fetch a TommaTech product page and extract first product image URL.
 * Usage: node scripts/fetch-product-image-url.js <productPageUrl>
 */
const url = process.argv[2] || 'https://tommatech.de/en/product/tommatech-uno-atom-20kw-single-phase-string-inverter-92.html';
fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
  .then(r => r.text())
  .then(html => {
    const baseUrl = new URL(url).origin;
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    const found = [];
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
      let src = m[1];
      if (src.startsWith('//')) src = 'https:' + src;
      else if (src.startsWith('/')) src = baseUrl + src;
      if (src.includes('tommatech') && /\.(jpg|jpeg|png|webp)/i.test(src)) found.push(src);
    }
    const productImg = found.find(s => !s.includes('logo') && !s.includes('icon') && !s.includes('banner')) || found[0];
    console.log(productImg || 'NO_IMAGE');
  })
  .catch(e => {
    console.error('ERROR:', e.message);
    process.exit(1);
  });
