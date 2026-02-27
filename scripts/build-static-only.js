const fs = require('fs');
const path = require('path');

console.log('🚀 Static Export Build (API routes devre dışı)...\n');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'app', 'api');
const apiBackupDir = path.join(rootDir, 'api.backup.temp');

// Dynamic route sayfaları
const dynamicPages = [
  path.join(rootDir, 'app', 'products', '[id]'),
  path.join(rootDir, 'app', 'admin', 'orders', '[id]'),
];
const dynamicPagesBackup = dynamicPages.map(p => p.replace('[id]', '[id].backup'));

// API klasörünü geçici olarak app dışına taşı
if (fs.existsSync(apiDir)) {
  console.log('📁 API klasörü geçici olarak devre dışı bırakılıyor...');
  if (fs.existsSync(apiBackupDir)) {
    fs.rmSync(apiBackupDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, apiBackupDir);
  console.log('✅ API klasörü devre dışı bırakıldı\n');
}

// Dynamic route sayfalarını geçici olarak devre dışı bırak
dynamicPages.forEach((pageDir, index) => {
  if (fs.existsSync(pageDir)) {
    const backupDir = dynamicPagesBackup[index];
    console.log(`📁 ${path.basename(pageDir)} sayfası geçici olarak devre dışı bırakılıyor...`);
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    fs.renameSync(pageDir, backupDir);
    console.log(`✅ ${path.basename(pageDir)} devre dışı bırakıldı`);
  }
});
if (dynamicPages.some(p => fs.existsSync(p))) {
  console.log('');
}

// Build al
console.log('📦 Static export build başlatılıyor...\n');
const { execSync } = require('child_process');

try {
  process.env.STATIC_EXPORT = 'true';
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, STATIC_EXPORT: 'true' }
  });
  console.log('\n✅ Build başarılı!\n');
} catch (error) {
  console.error('\n❌ Build hatası:', error.message);
  // API klasörünü geri yükle
  if (fs.existsSync(apiBackupDir)) {
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiBackupDir, apiDir);
    console.log('✅ API klasörü geri yüklendi\n');
  }
  process.exit(1);
}

// API klasörünü geri yükle
if (fs.existsSync(apiBackupDir)) {
  console.log('📁 API klasörü geri yükleniyor...');
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiBackupDir, apiDir);
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
    fs.renameSync(backupDir, pageDir);
    console.log(`✅ ${path.basename(pageDir)} geri yüklendi`);
  }
});
if (fs.existsSync(apiBackupDir) || dynamicPagesBackup.some(p => fs.existsSync(p))) {
  console.log('');
}

console.log('✅ Static export build tamamlandı!');
console.log('📁 out/ klasörü hazır\n');

