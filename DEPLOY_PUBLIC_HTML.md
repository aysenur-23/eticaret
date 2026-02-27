# public_html Klasörü – Statik Yayın

## Nasıl oluşturulur?

Proje kökünde:

```bash
npm run public-html
```

Bu komut:

1. `app/api`, `app/orders/[id]`, `app/admin/orders/[id]` klasörlerini geçici yedekler ve kaldırır
2. **Static export** ile `next build` çalıştırır
3. `out/` çıktısını `public_html/` klasörüne kopyalar
4. `.htaccess` ve `README.txt` ekler
5. Yedeklenen klasörleri geri yükler

## Ne zaman kullanılır?

- **Paylaşımlı hosting** (Hostinger, sadece Apache/Nginx, Node.js yok)
- **Sadece statik site** yayınlamak istediğinizde

## Yükleme

1. `public_html` klasörünün **içindeki tüm dosya ve klasörleri** FTP veya File Manager ile sunucuya yükleyin
2. Hedef dizin genelde `public_html` veya sitenizin web root’u
3. Node.js veya ek kurulum gerekmez

## Statik sitede çalışanlar

- Ana sayfa, ürünler, ürün detayları (sizdirmazlik, sizdirmazlik-pro, sizdirmazlik-eko)
- Sepet, checkout, giriş, kayıt, iletişim, SSS, kargo, iade, gizlilik, şartlar, çerezler
- Konfigüratör, favoriler, profil (client-side)

## Statik sitede çalışmayanlar

- **API route’lar** (giriş, sipariş, teklif vb. backend işlemleri)
- **Sipariş detay** (`/orders/xxx`) ve **admin sipariş detay** – bu sayfalar static export’a dahil değil

Bu sayfalar için Node.js ortamında (standalone build veya Vercel vb.) çalışan bir backend gerekir.

## Normal geliştirme ve Node’lu sunucu

- **Geliştirme:** `npm run dev`
- **Node’lu sunucu (standalone):** `npm run build` (ortamda `STATIC_EXPORT` **olmasın**), sonra `npm run start` veya sunucuda `server.js` çalıştırma

`npm run public-html` yalnızca statik export üretir; günlük geliştirme veya Node’lu production build’i etkilemez.
