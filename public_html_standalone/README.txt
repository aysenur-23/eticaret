# Hostinger Deployment Dosyaları

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
