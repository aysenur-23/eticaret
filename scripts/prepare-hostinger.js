const fs = require('fs');
const path = require('path');

console.log('🚀 Hostinger deployment hazırlığı başlıyor...\n');

// Klasör yolları
const rootDir = path.resolve(__dirname, '..');
const publicHtmlDir = path.join(rootDir, 'public_html');
const outDir = path.join(rootDir, 'out'); // Static export için
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const serverDir = path.join(rootDir, '.next', 'server');
const staticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');

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

console.log('\n📦 Dosyalar kopyalanıyor...\n');

// 1. Static export kontrolü (out klasörü varsa)
if (fs.existsSync(outDir)) {
  console.log('📁 Static export (out) klasörü kopyalanıyor...');
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
  console.log('✅ Static export kopyalandı\n');
  
  // .htaccess dosyası oluştur (static site için - 403 hatası önleme)
  const htaccessContent = `# Static Site Configuration - 403 hatası önleme
# Hostinger için static export (Node.js gerekmez)

# Özel 404 sayfası (Next.js static export 404.html)
ErrorDocument 404 /404.html

# Directory listing ve FollowSymLinks - 403 hatasını önlemek için
Options -Indexes +FollowSymLinks

# PHP engine'i kapat
<IfModule mod_php.c>
  php_flag engine off
</IfModule>

# Next.js static export routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Ana sayfa için özel kural (403 hatasını önlemek için)
  RewriteCond %{REQUEST_URI} ^/$
  RewriteRule ^ - [L]
  
  # _next/static için direkt erişim
  RewriteCond %{REQUEST_URI} ^/_next/static
  RewriteRule ^ - [L]
  
  # RSC payload (.txt) istekleri: /path/segment.txt -> /path/segment/ (ürün/sayfa HTML'i sunulur, 500 önlenir)
  RewriteCond %{REQUEST_URI} \\.txt$
  RewriteCond %{REQUEST_URI} !^/data/
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteRule ^(.+)\\.txt$ $1/ [L]
  
  # Static dosyalar için direkt erişim (dosya varsa)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Klasörler için direkt erişim (klasör varsa)
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Next.js static export: /path -> /path/index.html (root / -> /index.html)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /$1/index.html [L]
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
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
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
</IfModule>
`;
  
  fs.writeFileSync(
    path.join(publicHtmlDir, '.htaccess'),
    htaccessContent,
    'utf8'
  );
  console.log('✅ .htaccess (static) oluşturuldu\n');
  
  // README güncelle
  const readmeContent = `# Hostinger Static Site Deployment Dosyaları

Bu klasör Hostinger'a yüklenecek STATIC dosyaları içerir.

## 📤 Yükleme Talimatları

1. Bu klasörün TÜM İÇERİĞİNİ FTP/File Manager ile Hostinger'a yükleyin
2. Yükleme konumu: /public_html (veya belirlediğiniz klasör)
3. Dosyalar tamamen statik olduğu için Node.js gerekmez
4. Sadece web hosting (Apache/Nginx) yeterlidir

## 📁 Klasör Yapısı

- index.html - Ana sayfa
- 404.html - Özel 404 sayfası
- robots.txt - Arama motoru kuralları
- .htaccess - Apache yapılandırması (routing, güvenlik, önbellek)
- _next/ - Next.js static assets (JS, CSS)
- images/ - Görseller
- products/, category/, cart/, checkout/ vb. - Sayfa klasörleri

## ⚠️ Önemli Notlar

- Bu bir STATIC export'tur, API route'lar çalışmaz
- Tüm sayfalar önceden oluşturulmuş HTML'dir (ürün/kategori sayfaları dahil)
- Environment variables gerekmez (build sırasında dahil edilir)

## ✅ Kontrol Listesi

- [ ] Tüm dosyalar ve klasörler yüklendi (özellikle _next/, images/)
- [ ] .htaccess dosyası yüklendi (gizli dosya)
- [ ] 404.html ve robots.txt root'ta
- [ ] Domain / SSL ayarlandı
- [ ] Ana sayfa ve bir ürün sayfası test edildi

Detaylı bilgi için: HOSTINGER_DEPLOY.md
`;
  
  fs.writeFileSync(
    path.join(publicHtmlDir, 'README.txt'),
    readmeContent,
    'utf8'
  );
  console.log('📄 README.txt (static) oluşturuldu\n');
  
  console.log('\n✅ public_html klasörü hazır (STATIC EXPORT)!');
  console.log(`📁 Konum: ${publicHtmlDir}`);
  console.log('\n📤 Şimdi bu klasörün TÜM İÇERİĞİNİ Hostinger\'a yükleyin.\n');
  process.exit(0);
}

// 2. Standalone build içeriğini kopyala (varsa)
// Eğer standalone yoksa, server klasörünü ve gerekli dosyaları manuel olarak hazırla
if (fs.existsSync(standaloneDir)) {
  console.log('📁 .next/standalone içeriği kopyalanıyor...');
  const standaloneFiles = fs.readdirSync(standaloneDir);
  standaloneFiles.forEach(file => {
    const srcPath = path.join(standaloneDir, file);
    const destPath = path.join(publicHtmlDir, file);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
  console.log('✅ Standalone build kopyalandı\n');
  
  // KRİTİK: .next/server/ klasörünü de kopyala (standalone build'de eksik olabilir)
  if (fs.existsSync(serverDir)) {
    console.log('📁 .next/server klasörü kopyalanıyor (standalone build\'e ekleniyor)...');
    const serverDest = path.join(publicHtmlDir, '.next', 'server');
    // .next klasörünü oluştur
    const nextDir = path.join(publicHtmlDir, '.next');
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
    }
    copyDir(serverDir, serverDest);
    console.log('✅ .next/server klasörü kopyalandı\n');
  }
} else {
  console.log('⚠️  Standalone build bulunamadı, manuel hazırlık yapılıyor...\n');
  
  // Server klasörünü kopyala
  if (fs.existsSync(serverDir)) {
    console.log('📁 .next/server klasörü kopyalanıyor...');
    const serverDest = path.join(publicHtmlDir, '.next', 'server');
    copyDir(serverDir, serverDest);
    console.log('✅ Server klasörü kopyalandı\n');
  }
  
  // package.json'dan gerekli dependencies'i oku ve minimal package.json oluştur
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const minimalPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      private: true,
      dependencies: packageJson.dependencies || {}
    };
    
    fs.writeFileSync(
      path.join(publicHtmlDir, 'package.json'),
      JSON.stringify(minimalPackageJson, null, 2),
      'utf8'
    );
    console.log('✅ package.json oluşturuldu\n');
    
    // index.js oluştur (Next.js server'ı başlatmak için)
    // Next.js 14 App Router için doğru server başlatma
    const indexJsContent = `const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ 
  dev,
  hostname,
  port,
  dir: __dirname
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://\${hostname}:\${port}\`);
  });
});
`;
    
    fs.writeFileSync(
      path.join(publicHtmlDir, 'index.js'),
      indexJsContent,
      'utf8'
    );
    console.log('✅ index.js oluşturuldu\n');
  }
}

// 2. Static dosyaları kopyala
if (fs.existsSync(staticDir)) {
  console.log('📁 .next/static klasörü kopyalanıyor...');
  const staticDest = path.join(publicHtmlDir, '.next', 'static');
  copyDir(staticDir, staticDest);
  console.log('✅ Static dosyalar .next/static olarak kopyalandı\n');
  
  // Ayrıca _next/static olarak da kopyala (Apache/Nginx direkt serve için)
  console.log('📁 _next/static klasörü kopyalanıyor (web server için)...');
  const webStaticDest = path.join(publicHtmlDir, '_next', 'static');
  copyDir(staticDir, webStaticDest);
  console.log('✅ Static dosyalar _next/static olarak kopyalandı\n');
} else {
  console.warn('⚠️  .next/static klasörü bulunamadı!');
}

// 3. Public klasörünü kopyala
if (fs.existsSync(publicDir)) {
  console.log('📁 public klasörü kopyalanıyor...');
  const publicDest = path.join(publicHtmlDir, 'public');
  copyDir(publicDir, publicDest);
  console.log('✅ Public dosyalar kopyalandı\n');
  
  // public/.htaccess dosyası oluştur (403 hatası önleme)
  const publicHtaccessContent = `# Allow access to public files - 403 hatası önleme
<FilesMatch "\\.(jpg|jpeg|png|gif|svg|ico|pdf|css|js|woff|woff2|ttf|eot|webp)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# Directory listing'i kapat
Options -Indexes
`;
  fs.writeFileSync(
    path.join(publicDest, '.htaccess'),
    publicHtaccessContent,
    'utf8'
  );
  console.log('✅ public/.htaccess oluşturuldu (403 hatası önleme)\n');
  
  // Favicon.ico'yu root'a da kopyala (tarayıcılar /favicon.ico'yu root'ta arar)
  const faviconSrc = path.join(publicDir, 'favicon.ico');
  const faviconDest = path.join(publicHtmlDir, 'favicon.ico');
  if (fs.existsSync(faviconSrc)) {
    copyFile(faviconSrc, faviconDest);
    console.log('✅ favicon.ico root\'a kopyalandı\n');
  } else {
    // Eğer favicon.ico yoksa, icon.png'yi favicon.ico olarak kopyala
    const iconSrc = path.join(publicDir, 'icon.png');
    if (fs.existsSync(iconSrc)) {
      copyFile(iconSrc, faviconDest);
      console.log('✅ icon.png favicon.ico olarak root\'a kopyalandı\n');
    }
  }
} else {
  console.warn('⚠️  public klasörü bulunamadı!');
}

// 4. .htaccess dosyasını oluştur (ULTRA MINIMAL - 403 hatası için)
console.log('📄 .htaccess dosyası oluşturuluyor (ULTRA MINIMAL - 403 hatası önleme)...');
const htaccessContent = `# Next.js Standalone Build için Hostinger .htaccess
# Hostinger Node.js modülü otomatik server.js'i çalıştırır
# Bu dosya sadece static dosyalar için direkt erişim sağlar
# Node.js routing Hostinger tarafından otomatik handle edilir

# DirectoryIndex'i boş bırak (index.html aramasını engelle)
# Next.js standalone build'de index.html yok, server.js var
# Apache'nin index.html aramasını engelle
<IfModule mod_dir.c>
  DirectoryIndex ""
</IfModule>

# PHP engine'i kapat
<IfModule mod_php.c>
  php_flag engine off
</IfModule>

# Static dosyalar ve klasörler için direkt erişim
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # _next/static için direkt erişim (öncelikli)
  RewriteCond %{REQUEST_URI} ^/_next/static
  RewriteRule ^ - [L]
  
  # public/ klasörü için direkt erişim
  RewriteCond %{REQUEST_URI} ^/public
  RewriteRule ^ - [L]
  
  # Favicon, icon, logo için direkt erişim
  RewriteCond %{REQUEST_URI} ^/(favicon\\.ico|icon\\.png|logo\\.png)$
  RewriteRule ^ - [L]
  
  # Gerçek dosyalar için direkt erişim (dosya varsa)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Gerçek klasörler için direkt erişim (klasör varsa)
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Diğer tüm istekler Node.js'e gider (Hostinger otomatik handle eder)
  # Burada özel bir yönlendirme yapmıyoruz, Hostinger Node.js modülü server.js'i çalıştırır
</IfModule>
`;

fs.writeFileSync(
  path.join(publicHtmlDir, '.htaccess'),
  htaccessContent,
  'utf8'
);
console.log('✅ .htaccess oluşturuldu\n');

// 5. package.json'ı kopyala (opsiyonel, referans için)
const packageJsonSrc = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonSrc)) {
  console.log('📄 package.json kopyalanıyor (referans için)...');
  copyFile(packageJsonSrc, path.join(publicHtmlDir, 'package.json'));
  console.log('✅ package.json kopyalandı\n');
}

// 6. README dosyası oluştur
const readmeContent = `# Hostinger Deployment Dosyaları

Bu klasör Hostinger'a yüklenecek dosyaları içerir.

## 📤 Yükleme Talimatları

1. Bu klasörün TÜM İÇERİĞİNİ FTP/File Manager ile Hostinger'a yükleyin
2. Application Root: /public_html (veya belirlediğiniz klasör)
3. Hostinger panelinde:
   - Node.js Version: 20.x seçin
   - Application Root: /public_html
   - Application Startup File: server.js (ÖNEMLİ: index.js değil!)
   - Environment Variables ekleyin (.env.production.example dosyasına bakın)
   - Start butonuna tıklayın

## 📁 Klasör Yapısı

- server.js - Ana uygulama dosyası (Hostinger'da Application Startup File olarak ayarlanmalı)
- package.json - Package bilgileri
- node_modules/ - Gerekli paketler (standalone build içinde)
- .next/standalone/ veya .next/server/ - Next.js server dosyaları
- .next/static/ - Static assets
- public/ - Public dosyalar
- .htaccess - Apache yapılandırması

## ✅ Kontrol Listesi

- [ ] Tüm dosyalar yüklendi
- [ ] Environment variables eklendi
- [ ] Node.js uygulaması başlatıldı
- [ ] Domain yönlendirmesi yapıldı
- [ ] SSL aktif

Detaylı bilgi için: HOSTINGER_DEPLOY.md
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
