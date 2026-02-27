# Hostinger Static Site Deployment Dosyaları

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
