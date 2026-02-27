const fs = require('fs');
const path = require('path');

console.log('🚀 Static build hazırlığı başlıyor...\n');

// Klasör yolları
const rootDir = path.resolve(__dirname, '..');
const publicHtmlDir = path.join(rootDir, 'public_html');
const outDir = path.join(rootDir, 'out');

// Klasör oluşturma fonksiyonu
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Klasör oluşturuldu: ${path.basename(dir)}`);
  }
}

// Dosya kopyalama fonksiyonu
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  ensureDir(destDir);
  fs.copyFileSync(src, dest);
}

// Klasör kopyalama fonksiyonu
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Kaynak klasör bulunamadı: ${src}`);
    return false;
  }
  
  ensureDir(dest);
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
  
  return true;
}

// public_html klasörünü temizle
if (fs.existsSync(publicHtmlDir)) {
  console.log('🧹 Eski public_html klasörü temizleniyor...');
  fs.rmSync(publicHtmlDir, { recursive: true, force: true });
}

// public_html klasörünü oluştur
ensureDir(publicHtmlDir);

// out klasörünü kontrol et
if (!fs.existsSync(outDir)) {
  console.error('❌ out klasörü bulunamadı! Önce STATIC_EXPORT=true npm run build çalıştırın.');
  process.exit(1);
}

console.log('\n📦 Dosyalar kopyalanıyor...\n');

// out klasörünün tüm içeriğini public_html'ye kopyala
console.log('📁 out klasörü içeriği kopyalanıyor...');
const outFiles = fs.readdirSync(outDir);
outFiles.forEach(file => {
  const srcPath = path.join(outDir, file);
  const destPath = path.join(publicHtmlDir, file);
  const stat = fs.statSync(srcPath);
  
  if (stat.isDirectory()) {
    copyDir(srcPath, destPath);
  } else {
    copyFile(srcPath, destPath);
  }
});
console.log('✅ out klasörü kopyalandı\n');

// .htaccess dosyası oluştur
const htaccessContent = `<IfModule mod_headers.c>
  Header set Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
</IfModule>

# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle Next.js routing
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
`;

fs.writeFileSync(
  path.join(publicHtmlDir, '.htaccess'),
  htaccessContent,
  'utf8'
);
console.log('✅ .htaccess dosyası oluşturuldu\n');

// README dosyası oluştur
const readmeContent = `# Hostinger Static Deployment Dosyaları

Bu klasör Hostinger'a yüklenecek static dosyaları içerir.

## 📤 Yükleme Talimatları

1. Bu klasörün TÜM İÇERİĞİNİ FTP/File Manager ile Hostinger'a yükleyin
2. Yükleme konumu: /public_html (veya belirlediğiniz klasör)
3. Dosyalar static olduğu için Node.js gerekmez

## 📁 Klasör Yapısı

- index.html - Ana sayfa
- configurator/ - Konfigüratör sayfası
- checkout/ - Checkout sayfası
- _next/ - Next.js static dosyaları
- .htaccess - Apache yapılandırması

## ✅ Kontrol Listesi

- [ ] Tüm dosyalar yüklendi
- [ ] .htaccess dosyası yüklendi
- [ ] Domain yönlendirmesi yapıldı
- [ ] SSL aktif
- [ ] Site çalışıyor

Not: Bu bir static build'dir. API routes ve server-side özellikler çalışmaz.
`;

fs.writeFileSync(
  path.join(publicHtmlDir, 'README.txt'),
  readmeContent,
  'utf8'
);
console.log('📄 README.txt oluşturuldu\n');

// Özet
console.log('\n✅ public_html klasörü hazır!');
console.log(`📁 Konum: ${publicHtmlDir}`);
console.log('\n📤 Şimdi bu klasörün TÜM İÇERİĞİNİ Hostinger\'a yükleyin.\n');
