const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Hostinger için eksiksiz statik derleme başlıyor...\n');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const publicHtmlDir = path.join(rootDir, 'public_html');
const apiDir = path.join(rootDir, 'app', 'api');
const apiBackupDir = path.join(rootDir, 'api.backup.temp');
const nextDir = path.join(rootDir, '.next');

// Dynamic route sayfaları (statik export için devre dışı bırakılacak)
const dynamicPages = [
  path.join(rootDir, 'app', 'products', '[id]'),
  path.join(rootDir, 'app', 'admin', 'orders', '[id]'),
];
const dynamicPagesBackup = dynamicPages.map(p => p.replace('[id]', '[id].backup'));

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

// Dosya varlığını kontrol et
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} bulundu: ${path.basename(filePath)}`);
    return true;
  } else {
    console.error(`❌ ${description} bulunamadı: ${filePath}`);
    return false;
  }
}

// ADIM 1: Temizleme
console.log('🧹 ADIM 1: Eski build dosyaları temizleniyor...\n');

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log('✅ out/ klasörü temizlendi');
}

if (fs.existsSync(publicHtmlDir)) {
  fs.rmSync(publicHtmlDir, { recursive: true, force: true });
  console.log('✅ public_html/ klasörü temizlendi');
}

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ .next/ klasörü temizlendi');
}

if (fs.existsSync(apiBackupDir)) {
  fs.rmSync(apiBackupDir, { recursive: true, force: true });
  console.log('✅ Eski API backup temizlendi');
}

console.log('\n');

// ADIM 2: API route'ları ve dynamic route'ları geçici olarak devre dışı bırak
console.log('📁 ADIM 2: API route\'ları ve dynamic route\'lar geçici olarak devre dışı bırakılıyor...\n');

// API klasörünü devre dışı bırak
if (fs.existsSync(apiDir)) {
  console.log('📁 API klasörü yedekleniyor...');
  copyDir(apiDir, apiBackupDir);
  fs.rmSync(apiDir, { recursive: true, force: true });
  console.log('✅ API klasörü devre dışı bırakıldı');
}

// Dynamic route sayfalarını devre dışı bırak
dynamicPages.forEach((pageDir, index) => {
  if (fs.existsSync(pageDir)) {
    const backupDir = dynamicPagesBackup[index];
    console.log(`📁 ${path.basename(pageDir)} sayfası yedekleniyor...`);
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    copyDir(pageDir, backupDir);
    fs.rmSync(pageDir, { recursive: true, force: true });
    console.log(`✅ ${path.basename(pageDir)} devre dışı bırakıldı`);
  }
});

if (fs.existsSync(apiDir) || dynamicPages.some(p => fs.existsSync(p))) {
  console.log('');
}

// ADIM 3: Statik export build
console.log('📦 ADIM 3: Statik export build başlatılıyor...\n');

try {
  // Environment variables ayarla
  const env = { ...process.env, STATIC_EXPORT: 'true', NODE_ENV: 'production' };
  
  // Windows'ta cmd.exe kullan, Linux/Mac'te shell kullan
  const isWindows = process.platform === 'win32';
  const buildCommand = isWindows 
    ? 'npm run build'
    : 'npm run build';
  
  execSync(buildCommand, {
    stdio: 'inherit',
    cwd: rootDir,
    shell: true,
    env: env
  });
  
  console.log('\n✅ Build başarılı!\n');
} catch (error) {
  console.error('\n❌ Build hatası:', error.message);
  
  // API klasörünü geri yükle
  if (fs.existsSync(apiBackupDir)) {
    console.log('\n📁 API klasörü geri yükleniyor...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    copyDir(apiBackupDir, apiDir);
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
    console.log('✅ API klasörü geri yüklendi');
  }
  
  // Dynamic route sayfalarını geri yükle
  dynamicPages.forEach((pageDir, index) => {
    const backupDir = dynamicPagesBackup[index];
    if (fs.existsSync(backupDir)) {
      console.log(`📁 ${path.basename(pageDir)} sayfası geri yükleniyor...`);
      if (fs.existsSync(pageDir)) {
        fs.rmSync(pageDir, { recursive: true, force: true });
      }
      copyDir(backupDir, pageDir);
      fs.rmSync(backupDir, { recursive: true, force: true });
      console.log(`✅ ${path.basename(pageDir)} geri yüklendi`);
    }
  });
  
  process.exit(1);
}

// ADIM 4: Build doğrulama
console.log('🔍 ADIM 4: Build doğrulaması yapılıyor...\n');

const criticalFiles = [
  { path: path.join(outDir, 'index.html'), desc: 'Ana index.html dosyası' },
  { path: path.join(outDir, '_next'), desc: '_next klasörü' },
];

let allFilesExist = true;
criticalFiles.forEach(({ path: filePath, desc }) => {
  if (!checkFileExists(filePath, desc)) {
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Kritik dosyalar eksik! Build başarısız.\n');
  
  // API klasörünü geri yükle
  if (fs.existsSync(apiBackupDir)) {
    console.log('📁 API klasörü geri yükleniyor...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    copyDir(apiBackupDir, apiDir);
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
    console.log('✅ API klasörü geri yüklendi');
  }
  
  process.exit(1);
}

// index.html içeriğini kontrol et
const indexHtmlPath = path.join(outDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  if (indexContent.length < 100) {
    console.error('❌ index.html dosyası çok küçük, muhtemelen bozuk!');
    process.exit(1);
  }
  console.log(`✅ index.html dosyası geçerli (${Math.round(indexContent.length / 1024)} KB)\n`);
}

// ADIM 5: public_html klasörüne kopyalama
console.log('📦 ADIM 5: Dosyalar public_html klasörüne kopyalanıyor...\n');

ensureDir(publicHtmlDir);

// out klasörünün tüm içeriğini kopyala
console.log('📁 out/ klasörü içeriği kopyalanıyor...');
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
console.log('✅ Tüm dosyalar kopyalandı\n');

// ADIM 6: .htaccess dosyası oluştur
console.log('📄 ADIM 6: .htaccess dosyası oluşturuluyor...\n');

const htaccessContent = `# Hostinger Static Site Configuration
# Next.js Static Export için optimize edilmiş .htaccess

# Directory listing ve FollowSymLinks - 403 hatası önleme
Options -Indexes +FollowSymLinks

# PHP engine'i kapat
<IfModule mod_php.c>
  php_flag engine off
</IfModule>

# Next.js static export routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # _next/static için direkt erişim (öncelikli)
  RewriteCond %{REQUEST_URI} ^/_next/static
  RewriteRule ^ - [L]
  
  # Static dosyalar için direkt erişim (dosya varsa)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Klasörler için direkt erişim (klasör varsa)
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Handle client-side routing - tüm istekleri index.html'e yönlendir
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# MIME Types
<IfModule mod_mime.c>
  AddType application/javascript js
  AddType text/css css
  AddType image/svg+xml svg svgz
  AddEncoding gzip svgz
</IfModule>
`;

fs.writeFileSync(
  path.join(publicHtmlDir, '.htaccess'),
  htaccessContent,
  'utf8'
);
console.log('✅ .htaccess dosyası oluşturuldu\n');

// ADIM 7: README dosyası oluştur
console.log('📄 ADIM 7: README dosyası oluşturuluyor...\n');

const readmeContent = `# Hostinger Static Site Deployment Dosyaları

Bu klasör Hostinger'a yüklenecek STATIC dosyaları içerir.

## 📤 Yükleme Talimatları

1. Bu klasörün TÜM İÇERİĞİNİ FTP/File Manager ile Hostinger'a yükleyin
2. Yükleme konumu: /public_html (veya belirlediğiniz klasör)
3. Dosyalar tamamen statik olduğu için Node.js gerekmez
4. Sadece web hosting (Apache/Nginx) yeterlidir

## 📁 Klasör Yapısı

- index.html - Ana sayfa (MUTLAKA OLMALI!)
- _next/ - Next.js static assets
- configurator/ - Konfigüratör sayfası
- products/ - Ürün sayfaları
- checkout/ - Checkout sayfası
- cart/ - Sepet sayfası
- .htaccess - Apache yapılandırması

## ⚠️ Önemli Notlar

- Bu bir STATIC export'tur, API route'lar çalışmaz
- Dynamic route'lar (örn: /products/[id]) client-side routing ile çalışır
- Environment variables gerekmez (tüm değişkenler build sırasında dahil edilir)
- index.html dosyası MUTLAKA root'ta olmalı

## ✅ Kontrol Listesi

- [ ] Tüm dosyalar yüklendi
- [ ] index.html dosyası root'ta var
- [ ] .htaccess dosyası yüklendi
- [ ] _next/ klasörü yüklendi
- [ ] Domain yönlendirmesi yapıldı
- [ ] SSL aktif
- [ ] Ana sayfa açılıyor mu test edildi
- [ ] Tüm sayfalar çalışıyor mu test edildi

## 🔍 Sorun Giderme

### 403 Hatası
- .htaccess dosyasının yüklendiğinden emin olun
- Dosya izinlerini kontrol edin (755 klasörler, 644 dosyalar)

### 404 Hatası
- index.html dosyasının root'ta olduğundan emin olun
- .htaccess dosyasının doğru yüklendiğinden emin olun

### Sayfalar Yüklenmiyor
- Tarayıcı konsolunu kontrol edin
- _next/ klasörünün tamamen yüklendiğinden emin olun

Detaylı bilgi için: HOSTINGER_DEPLOY.md
`;

fs.writeFileSync(
  path.join(publicHtmlDir, 'README.txt'),
  readmeContent,
  'utf8'
);
console.log('✅ README.txt oluşturuldu\n');

// ADIM 8: Final doğrulama
console.log('🔍 ADIM 8: Final doğrulama yapılıyor...\n');

const finalChecks = [
  { path: path.join(publicHtmlDir, 'index.html'), desc: 'public_html/index.html' },
  { path: path.join(publicHtmlDir, '.htaccess'), desc: 'public_html/.htaccess' },
  { path: path.join(publicHtmlDir, '_next'), desc: 'public_html/_next klasörü' },
];

let allFinalChecksPass = true;
finalChecks.forEach(({ path: filePath, desc }) => {
  if (!checkFileExists(filePath, desc)) {
    allFinalChecksPass = false;
  }
});

if (!allFinalChecksPass) {
  console.error('\n❌ Final doğrulama başarısız!\n');
  process.exit(1);
}

// Dosya sayısını kontrol et
const countFiles = (dir) => {
  let count = 0;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        count += countFiles(filePath);
      } else {
        count++;
      }
    });
  }
  return count;
};

const fileCount = countFiles(publicHtmlDir);
console.log(`✅ Toplam ${fileCount} dosya hazır\n`);

// ADIM 9: API klasörünü ve dynamic route'ları geri yükle
console.log('📁 ADIM 9: API klasörü ve dynamic route\'lar geri yükleniyor...\n');

// API klasörünü geri yükle
if (fs.existsSync(apiBackupDir)) {
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  copyDir(apiBackupDir, apiDir);
  fs.rmSync(apiBackupDir, { recursive: true, force: true });
  console.log('✅ API klasörü geri yüklendi');
}

// Dynamic route sayfalarını geri yükle
dynamicPages.forEach((pageDir, index) => {
  const backupDir = dynamicPagesBackup[index];
  if (fs.existsSync(backupDir)) {
    console.log(`📁 ${path.basename(pageDir)} sayfası geri yükleniyor...`);
    if (fs.existsSync(pageDir)) {
      fs.rmSync(pageDir, { recursive: true, force: true });
    }
    copyDir(backupDir, pageDir);
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log(`✅ ${path.basename(pageDir)} geri yüklendi`);
  }
});

if (fs.existsSync(apiBackupDir) || dynamicPagesBackup.some(p => fs.existsSync(p))) {
  console.log('');
}

// Özet
console.log('═══════════════════════════════════════════════════════════');
console.log('✅ HOSTINGER STATİK DERLEME BAŞARIYLA TAMAMLANDI!');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`📁 Hazır dosyalar: ${publicHtmlDir}`);
console.log(`📊 Toplam dosya sayısı: ${fileCount}`);
console.log('\n📤 Şimdi public_html klasörünün TÜM İÇERİĞİNİ Hostinger\'a yükleyin.\n');
console.log('✅ Kontrol edilen öğeler:');
console.log('   ✓ index.html dosyası mevcut');
console.log('   ✓ _next/ klasörü mevcut');
console.log('   ✓ .htaccess dosyası oluşturuldu');
console.log('   ✓ Tüm statik dosyalar kopyalandı');
console.log('\n🚀 Site Hostinger\'da sorunsuz çalışacaktır!\n');

