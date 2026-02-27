const https = require('https');
const url = 'https://tommatech.de/en/product/tommatech-3-kwh-lithium-batterystorage-management-system-352.html';
const opts = { hostname: 'tommatech.de', path: '/en/product/tommatech-3-kwh-lithium-batterystorage-management-system-352.html', headers: { 'User-Agent': 'Mozilla/5.0' } };
https.get(opts, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const re = /src=["']([^"']*(?:jpg|jpeg|png|webp)[^"']*)["']/gi;
    let m;
    const urls = [];
    while ((m = re.exec(data)) !== null) urls.push(m[1]);
    console.log(JSON.stringify(urls.slice(0, 20), null, 2));
  });
}).on('error', e => console.error(e.message));
