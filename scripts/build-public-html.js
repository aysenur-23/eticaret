/**
 * Eksiksiz public_html klasörü oluşturur.
 * Static export için app/api geçici kaldırılır, build sonrası geri yüklenir.
 * 1) app/api yedeklenip kaldırılır
 * 2) STATIC_EXPORT=true ile next build (out/ üretir)
 * 3) prepare-hostinger.js ile out/ -> public_html
 * 4) app/api geri yüklenir
 */

const path = require('path')
const { execSync } = require('child_process')
const fs = require('fs')

const rootDir = path.resolve(__dirname, '..')
const outDir = path.join(rootDir, 'out')
const publicHtmlDir = path.join(rootDir, 'public_html')
const apiDir = path.join(rootDir, 'app', 'api')
const apiBackupDir = path.join(rootDir, '.api.backup.static')
const ordersIdDir = path.join(rootDir, 'app', 'orders', '[id]')
const ordersIdBackupDir = path.join(rootDir, '.orders-id.backup.static')
// Hiçbir sayfa build dışı bırakılmıyor; tüm route'lar static export'a dahil.
const staticExportRemoveDirs = []
const notFoundFile = path.join(rootDir, 'app', 'not-found.tsx')
const notFoundBackup = path.join(rootDir, '.not-found.backup.static')

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name)
    const d = path.join(dest, name)
    if (fs.statSync(s).isDirectory()) copyDirSync(s, d)
    else fs.copyFileSync(s, d)
  }
}

function rmDirSync(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

console.log('═══════════════════════════════════════════════════════════')
console.log('  public_html klasörü hazırlanıyor (static export)')
console.log('═══════════════════════════════════════════════════════════\n')

// 0. API ve dynamic route'ları yedekle ve kaldır (static export için)
if (fs.existsSync(apiDir)) {
  console.log('📁 Adım 0: app/api geçici olarak yedekleniyor...\n')
  rmDirSync(apiBackupDir)
  copyDirSync(apiDir, apiBackupDir)
  rmDirSync(apiDir)
  console.log('✅ app/api kaldırıldı (build sonrası geri yüklenecek)\n')
}
if (fs.existsSync(ordersIdDir)) {
  rmDirSync(ordersIdBackupDir)
  copyDirSync(ordersIdDir, ordersIdBackupDir)
  rmDirSync(ordersIdDir)
  console.log('✅ app/orders/[id] kaldırıldı (build sonrası geri yüklenecek)\n')
}
// Static export'ta hata veren route'ları geçici kaldır
for (const [relDir, backupName] of staticExportRemoveDirs) {
  const dir = path.join(rootDir, relDir)
  const backup = path.join(rootDir, backupName)
  if (fs.existsSync(dir)) {
    rmDirSync(backup)
    copyDirSync(dir, backup)
    rmDirSync(dir)
    console.log(`✅ ${relDir} kaldırıldı (build sonrası geri yüklenecek)\n`)
  }
}
// not-found build'e dahil (hiçbir route dışarıda bırakılmıyor)

// 0.5. Static export için kategori listesi JSON üret (header/sidebar menüleri için)
console.log('📄 Adım 0.5: categories-with-products.json üretiliyor...\n')
try {
  execSync('npx tsx scripts/generate-categories-json.ts', {
    stdio: 'inherit',
    cwd: rootDir,
    shell: true,
  })
} catch (e) {
  console.warn('⚠️ generate-categories-json atlandı (menü fallback kullanılacak)\n')
}

// 1. Static build
console.log('📦 Adım 1: Next.js static export build...\n')

try {
  execSync('npm run build', {
    stdio: 'inherit',
    cwd: rootDir,
    shell: true,
    env: { ...process.env, STATIC_EXPORT: 'true', NODE_ENV: 'production' },
  })
} catch (e) {
  restoreBackups()
  console.error('\n❌ Build başarısız. Lütfen hataları düzeltin.\n')
  process.exit(1)
}

function restoreBackups() {
  if (fs.existsSync(apiBackupDir)) { copyDirSync(apiBackupDir, apiDir); rmDirSync(apiBackupDir) }
  if (fs.existsSync(ordersIdBackupDir)) { copyDirSync(ordersIdBackupDir, ordersIdDir); rmDirSync(ordersIdBackupDir) }
  for (const [relDir, backupName] of staticExportRemoveDirs) {
    const dir = path.join(rootDir, relDir)
    const backup = path.join(rootDir, backupName)
    if (fs.existsSync(backup)) { copyDirSync(backup, dir); rmDirSync(backup) }
  }
  if (fs.existsSync(notFoundBackup)) { fs.copyFileSync(notFoundBackup, notFoundFile); fs.rmSync(notFoundBackup) }
}

if (!fs.existsSync(outDir)) {
  restoreBackups()
  console.error('\n❌ out/ klasörü oluşmadı.\n')
  process.exit(1)
}

console.log('\n✅ Build tamamlandı.\n')

// 2. prepare-hostinger.js
console.log('📁 Adım 2: public_html klasörü oluşturuluyor...\n')

execSync('node scripts/prepare-hostinger.js', {
  stdio: 'inherit',
  cwd: rootDir,
})

// 3. API, dynamic route ve kaldırılan sayfaları geri yükle
console.log('\n📁 Adım 3: Kaldırılan klasörler geri yükleniyor...\n')
if (fs.existsSync(apiBackupDir)) { copyDirSync(apiBackupDir, apiDir); rmDirSync(apiBackupDir); console.log('✅ app/api geri yüklendi') }
if (fs.existsSync(ordersIdBackupDir)) { copyDirSync(ordersIdBackupDir, ordersIdDir); rmDirSync(ordersIdBackupDir); console.log('✅ app/orders/[id] geri yüklendi') }
for (const [relDir, backupName] of staticExportRemoveDirs) {
  const backup = path.join(rootDir, backupName)
  if (fs.existsSync(backup)) {
    const dir = path.join(rootDir, relDir)
    copyDirSync(backup, dir)
    rmDirSync(backup)
    console.log(`✅ ${relDir} geri yüklendi`)
  }
}
console.log('')

// 4. Son doğrulama
const required = [
  path.join(publicHtmlDir, 'index.html'),
  path.join(publicHtmlDir, '.htaccess'),
  path.join(publicHtmlDir, '_next', 'static'),
  path.join(publicHtmlDir, '404.html'),
  path.join(publicHtmlDir, 'robots.txt'),
]
let ok = true
for (const p of required) {
  if (!fs.existsSync(p)) {
    console.error('❌ Eksik: ' + path.relative(rootDir, p))
    ok = false
  }
}
if (!ok) {
  console.error('\n⚠️ Bazı dosyalar eksik. Yine de public_html kullanılabilir.\n')
}

console.log('✅ public_html hazır.')
console.log('📂 Konum: ' + publicHtmlDir)
console.log('\nBu klasörün TÜM İÇERİĞİNİ sunucunuzun public_html (veya web root) dizinine yükleyin.\n')
