const fs = require('fs')
const path = require('path')

const mockPath = path.join(__dirname, '..', 'lib', 'products-mock.ts')
let content = fs.readFileSync(mockPath, 'utf8')

const shortDesc = "Hims 22 kW Tip 2 elektrikli araç şarj kablosu, Türkiye ve Avrupa'daki tüm Tip 2 soketlerle uyumludur. Düz yapı sayesinde taşınması kolaydır. Gümüş kontaklar ve %100 bakır iletken ile yüksek iletkenlik ve ısınma önlemi sağlanır; şarj cihazı ile aracın güvenliği desteklenir. Hims şarj kablosu garantisi teslim tarihinden itibaren 2 yıldır; tüm parçalar dahil, işçilik ve üretim hataları kapsamdadır."
const shortDescEscaped = shortDesc.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

// fullDescription: '...' or fullDescription: `...` (cable products: Hims 22kw / Hims 22 kW / Hims Elektrikli / Hims Tip 2 + şarj kablosu)
// Match until we see ', followed by newline and "    features:" or "    warranty:" or "    descriptionSections:"
const cableFullDescRegex = /(fullDescription: )(?:'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)(\s*,\s*\n\s+(?:features|warranty|descriptionSections):)/g

let match
const replacements = []
while ((match = cableFullDescRegex.exec(content)) !== null) {
  const fullMatch = match[0]
  // Only replace if it looks like a cable (Hims + şarj kablosu / 22kw / 22 kW)
  if (!/Hims.*(22kw|22 kW|şarj kablosu|Elektrikli Araç Şarj)/i.test(fullMatch)) continue
  // Çantalı has different structure - skip for now (we'll do manually)
  if (fullMatch.includes('Çantalı') && fullMatch.includes('5m şarj kablosu ve şarj kablo çantası')) continue
  replacements.push({ index: match.index, length: match[0].length, match })
}

// Apply replacements from end to start to preserve indices
for (let i = replacements.length - 1; i >= 0; i--) {
  const r = replacements[i]
  const before = content.slice(0, r.index)
  const after = content.slice(r.index + r.length)
  const newBlock = r.match[1] + "'" + shortDescEscaped + "'" + r.match[2]
  content = before + newBlock + after
}

// Çantalı (SB-5-CNT): replace its fullDescription separately
const cntShortDesc = `Hims 22 kW Tip 2 elektrikli araç şarj kablosu 5 m uzunlukta; paket içinde şarj kablo çantası bulunur. Türkiye ve Avrupa'daki tüm Tip 2 soketlerle uyumludur. Gümüş kontaklar ve %100 bakır iletken; ısınma önlemi. Çanta: su geçirmez Imperteks kumaş, 40x40x10 cm; 2–10 m kablolar için uygun. Hims şarj kablosu garantisi teslim tarihinden itibaren 2 yıldır; tüm parçalar dahil.`
const cntShortEscaped = cntShortDesc.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

const cntRegex = /fullDescription: `Hims 22kW Destekli 5m Çantalı[\s\S]*?Not: Hims markasının şarj kablosu garantisi[\s\S]*?kapsamdadır\.\s*`/
if (cntRegex.test(content)) {
  content = content.replace(cntRegex, "fullDescription: '" + cntShortEscaped + "'")
}

// Remove descriptionSections from SB-3 and SB-8 (blocks that are just generic FAQ)
const removeDescSections = /,?\s*descriptionSections: \[\s*\{ title: 'Elektrikli Araç Şarj Kablosu Özelliği Nedir\?', content: '[^']*' \},\s*\{ title: 'Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir\?', content: '[^']*' \},\s*\{ title: 'Elektrikli Araç Şarj Kablosu Nasıl Seçilir\?', content: '[^']*' \}\s*\]/g
content = content.replace(removeDescSections, '')

fs.writeFileSync(mockPath, content, 'utf8')
console.log('Cable fullDescription and descriptionSections updated.')
