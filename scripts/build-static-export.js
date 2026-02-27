/**
 * Static Export Build Script
 * API klasörünü geçici olarak gizler, static build alır, geri getirir.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const apiDir = path.join(root, 'app', 'api')
const apiHidden = path.join(root, '_api_hidden')

function log(msg) { console.log('\x1b[36m' + msg + '\x1b[0m') }
function ok(msg) { console.log('\x1b[32m✅ ' + msg + '\x1b[0m') }
function err(msg) { console.log('\x1b[31m❌ ' + msg + '\x1b[0m') }

// Cleanup handler
function restore() {
  if (fs.existsSync(apiHidden) && !fs.existsSync(apiDir)) {
    fs.renameSync(apiHidden, apiDir)
    ok('app/api/ geri getirildi')
  }
}
process.on('exit', restore)
process.on('SIGINT', () => { restore(); process.exit(1) })
process.on('uncaughtException', (e) => { err(e.message); restore(); process.exit(1) })

;(async () => {
  // 1. API klasörünü gizle
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiHidden)
    log('app/api/ geçici olarak gizlendi')
  }

  // 2. Static build
  log('Static export build başlıyor...')
  try {
    execSync('node node_modules/next/dist/bin/next build', {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, STATIC_EXPORT: 'true', NODE_ENV: 'production' },
    })
    ok('Build tamamlandı → out/ klasörü oluştu')
  } catch (e) {
    err('Build başarısız!')
    process.exit(1)
  }

  // 3. API klasörünü geri getir
  restore()
  process.off('exit', restore)

  // 4. public_html'i hazırla
  log('public_html hazırlanıyor...')
  const outDir = path.join(root, 'out')
  const publicHtml = path.join(root, 'public_html')

  if (!fs.existsSync(outDir)) {
    err('out/ klasörü bulunamadı!')
    process.exit(1)
  }

  // Temizle
  if (fs.existsSync(publicHtml)) {
    fs.rmSync(publicHtml, { recursive: true, force: true })
  }
  fs.mkdirSync(publicHtml, { recursive: true })

  // out/ → public_html/ kopyala
  copyDir(outDir, publicHtml)
  ok('out/ → public_html/ kopyalandı')

  // .htaccess ekle
  const htaccess = `# TommaTech Türkiye — Hostinger Static Hosting
# Next.js Static Export için SPA Yönlendirmesi

Options -Indexes

# Sıkıştırma
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

# Cache — statik assetler
<IfModule mod_headers.c>
  <FilesMatch "\\.(js|css|woff2|woff|ttf|ico|png|jpg|jpeg|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
</IfModule>

# SPA Routing — bilinmeyen path'leri 404.html'e yönlendir
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # _next/static için direkt erişim
  RewriteRule ^_next/(.*)$ _next/$1 [L]

  # Gerçek dosya veya klasör varsa direkt sun
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Dynamic routes: SPA shell üzerinden yönlendir
  RewriteRule ^orders/[^/]+/?$ /orders/_/index.html [L]
  RewriteRule ^admin/orders/[^/]+/?$ /admin/orders/_/index.html [L]

  # .html uzantısını gizle (trailingSlash=true ile out/ içinde dizin/index.html var)
  # Yoksa 404.html'e git
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # 404
  ErrorDocument 404 /404/index.html
</IfModule>
`
  fs.writeFileSync(path.join(publicHtml, '.htaccess'), htaccess)
  ok('.htaccess yazıldı')

  // Boyut raporu
  const size = getDirSize(publicHtml)
  ok(`public_html hazır — ${(size / 1024 / 1024).toFixed(1)} MB`)
  console.log('\nYüklenecek klasör: public_html/')
  console.log('Zip için: scripts/zip-public-html.js çalıştırın')
})()

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function getDirSize(dir) {
  let total = 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) total += getDirSize(p)
    else total += fs.statSync(p).size
  }
  return total
}
