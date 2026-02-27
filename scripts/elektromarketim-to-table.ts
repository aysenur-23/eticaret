/**
 * elektromarketim-specs.json içeriğini incelemek için HTML tablosu üretir.
 * Çıktı: scripts/elektromarketim-inceleme.html (tarayıcıda açın)
 */
import * as fs from 'fs'
import * as path from 'path'

const JSON_PATH = path.join(__dirname, 'elektromarketim-specs.json')
const OUT_PATH = path.join(__dirname, 'elektromarketim-inceleme.html')

interface ScrapedItem {
  url: string
  sku: string
  fullDescription?: string
  specifications?: Record<string, string>
  features?: string[]
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truncate(s: string, max: number): string {
  if (!s) return '—'
  const t = s.trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '…'
}

function hasJunk(desc: string): boolean {
  if (!desc || desc.length < 100) return false
  const junk = /Menüyü Kapat|Kategoriler|Anasayfa Aydınlatma|Özel indirimlerden|Fırsatlarla dolu|schema\.org|productId|aggregateRating/
  return junk.test(desc)
}

function specKeysSummary(specs: Record<string, string> | undefined): string {
  if (!specs || !Object.keys(specs).length) return '—'
  const keys = Object.keys(specs)
  const valid = keys.filter(k => !/Ana Kapsayıcı|Örn/i.test(k))
  if (valid.length === 0) return `(${keys.length} junk)`
  return valid.length + ' adet: ' + valid.slice(0, 5).join(', ') + (valid.length > 5 ? '…' : '')
}

function main() {
  const raw = fs.readFileSync(JSON_PATH, 'utf-8')
  const data: ScrapedItem[] = JSON.parse(raw)

  const rows = data.map((item, i) => {
    const desc = item.fullDescription || ''
    const descLen = desc.length
    const specCount = item.specifications ? Object.keys(item.specifications).length : 0
    const featureCount = item.features ? item.features.length : 0
    const durum = hasJunk(desc) ? '⚠ Junk' : (descLen > 80 && !hasJunk(desc) ? '✓' : '—')
    return {
      index: i + 1,
      sku: escapeHtml(item.sku),
      url: escapeHtml(item.url),
      urlShort: escapeHtml(item.url.replace(/^https?:\/\//, '').slice(0, 55) + (item.url.length > 55 ? '…' : '')),
      descPreview: escapeHtml(truncate(desc, 140)),
      descLen,
      specCount,
      specSummary: escapeHtml(specKeysSummary(item.specifications)),
      featureCount,
      durum,
      descFull: escapeHtml(desc).replace(/\n/g, '<br>'),
      specsFull: item.specifications && Object.keys(item.specifications).length
        ? Object.entries(item.specifications).map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v))}</td></tr>`).join('')
        : '<tr><td colspan="2">—</td></tr>',
      featuresFull: item.features && item.features.length
        ? '<ul>' + item.features.map(f => `<li>${escapeHtml(f)}</li>`).join('') + '</ul>'
        : '—'
    }
  })

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Elektromarketim çekilen içerik – İnceleme</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 1rem; background: #f5f5f5; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .meta { color: #666; font-size: 0.875rem; margin-bottom: 1rem; }
    .filter { margin-bottom: 1rem; }
    .filter input { padding: 0.5rem; width: 100%; max-width: 400px; }
    table { border-collapse: collapse; width: 100%; max-width: 1200px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #e0e0e0; padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; font-size: 0.8125rem; }
    th { background: #1e293b; color: #fff; position: sticky; top: 0; }
    tr:nth-child(even) { background: #fafafa; }
    tr.expandable { cursor: pointer; }
    tr.expandable:hover { background: #e8f4fd; }
    tr.detail { background: #f0f9ff; }
    tr.detail td { padding: 1rem; }
    .desc-preview { max-width: 320px; line-height: 1.4; }
    .num { text-align: right; }
    .durum { font-weight: 600; }
    .durum.junk { color: #b45309; }
    .durum.ok { color: #15803d; }
    .detail-inner { max-height: 60vh; overflow: auto; }
    .detail-inner h4 { margin: 0 0 0.5rem 0; font-size: 0.875rem; }
    .detail-inner table { margin-top: 0.5rem; font-size: 0.8125rem; }
    .hidden { display: none; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Elektromarketim çekilen içerik – İnceleme tablosu</h1>
  <p class="meta">Toplam ${data.length} ürün. Satıra tıklayarak tam açıklama ve teknik özellikleri aç/kapat.</p>
  <div class="filter">
    <input type="text" id="q" placeholder="SKU veya URL ile filtrele…" />
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>SKU</th>
        <th>URL</th>
        <th>Açıklama (özet)</th>
        <th class="num">Uzunluk</th>
        <th class="num">Spec</th>
        <th>Spec anahtarları</th>
        <th class="num">Özellik</th>
        <th>Durum</th>
      </tr>
    </thead>
    <tbody>
${rows.map(r => `      <tr class="expandable" data-idx="${r.index}">
        <td>${r.index}</td>
        <td>${r.sku}</td>
        <td><a href="${r.url}" target="_blank" rel="noopener">${r.urlShort}</a></td>
        <td class="desc-preview">${r.descPreview}</td>
        <td class="num">${r.descLen}</td>
        <td class="num">${r.specCount}</td>
        <td>${r.specSummary}</td>
        <td class="num">${r.featureCount}</td>
        <td class="durum ${r.durum === '⚠ Junk' ? 'junk' : 'ok'}">${r.durum}</td>
      </tr>
      <tr class="detail hidden" data-detail-for="${r.index}">
        <td colspan="9">
          <div class="detail-inner">
            <h4>Açıklama (tam)</h4>
            <div>${r.descFull || '—'}</div>
            <h4>Teknik özellikler</h4>
            <table><tbody>${r.specsFull}</tbody></table>
            <h4>Özellikler (features)</h4>
            <div>${r.featuresFull}</div>
          </div>
        </td>
      </tr>`).join('\n')}
    </tbody>
  </table>
  <script>
    document.querySelectorAll('tr.expandable').forEach(function(row) {
      row.addEventListener('click', function() {
        var idx = this.getAttribute('data-idx');
        var detail = document.querySelector('tr.detail[data-detail-for="' + idx + '"]');
        if (detail) detail.classList.toggle('hidden');
      });
    });
    document.getElementById('q').addEventListener('input', function() {
      var q = this.value.trim().toLowerCase();
      document.querySelectorAll('tbody tr').forEach(function(tr) {
        if (tr.classList.contains('detail')) {
          var forIdx = tr.getAttribute('data-detail-for');
          var mainRow = document.querySelector('tr.expandable[data-idx="' + forIdx + '"]');
          tr.classList.add('hidden');
          if (mainRow && (!q || mainRow.textContent.toLowerCase().indexOf(q) >= 0)) { }
          else { }
        } else if (tr.classList.contains('expandable')) {
          tr.style.display = (!q || tr.textContent.toLowerCase().indexOf(q) >= 0) ? '' : 'none';
        }
      });
    });
  </script>
</body>
</html>
`

  fs.writeFileSync(OUT_PATH, html, 'utf-8')
  console.log('Yazıldı:', OUT_PATH)
  console.log('Tarayıcıda açın: file://' + OUT_PATH.replace(/\\/g, '/'))
}

main()
