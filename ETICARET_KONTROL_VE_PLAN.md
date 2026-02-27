# E-Ticaret Site Kontrol Listesi ve Süreç Planı

Bu dokümanda klasik bir e-ticaret sitesi için mevcut durum, eksikler ve adım adım yapılacaklar (özellikle siparişlerin nerede görüneceği ve ödeme sonrası fatura otomasyonu) özetlenir.

---

## 1. Siparişler Nerede Görünüyor?

### Müşteri tarafı
| Kaynak | Nerede görünür | Sayfa / Veri |
|--------|-----------------|--------------|
| **Giriş yapan kullanıcı** (sipariş Firestore’da) | Profil → Siparişlerim | `/profile?tab=orders` — `getOrders(user.id)` ile Firestore `users/{uid}/orders` |
| **Misafir** (sipariş Prisma’da, ORD-xxx) | Sipariş detay URL | `/orders/ORD-xxx` — `orderNo` ile `/api/orders/by-no/[orderNo]` (Prisma) |

### Admin tarafı
| Kaynak | Nerede görünür | Açıklama |
|--------|-----------------|----------|
| **Tüm siparişler** | Admin → Siparişler | `/admin/orders` — Hem Prisma hem Firestore siparişleri listeler (API: `GET /api/admin/orders`) |
| **Prisma siparişleri** | Aynı tabloda, `source: prisma` | Misafir ve/veya ödeme entegrasyonu ile oluşturulan siparişler |
| **Firestore siparişleri** | Aynı tabloda, `source: firestore` | Giriş yapan müşterinin checkout’ta oluşturduğu siparişler (şu an ödeme “pending”) |

**Sipariş detay (güncel):** Admin’de “Detay” tıklandığında açılan sayfa (`/admin/orders/[id]`) **gerçek sipariş verisi API'den çekilip gösterilir; durum güncelleme ve fatura gönder vardır (eskiden göstermiyordu)**; sadece “Sipariş Detayı – geliştirilme aşamasındadır” mesajı var. Ayrıca Firestore siparişlerinde `row.id` = Firestore döküman id’si; detay sayfası hem Prisma hem Firestore için tek bir id ile çalışamıyor (Firestore için `userId` + doc id gerekir).

---

## 2. Ödeme Yapılan Siparişte Faturanın Otomatik Gönderilmesi

### Mevcut durum
- **Fatura PDF:** `lib/invoice.tsx` ve `lib/pdf.tsx` ile fatura PDF’i üretilebiliyor (`generateInvoicePDF(orderId, orderData)`).
- **Yükleme:** `lib/storage.ts` / `lib/storage-hostinger.ts` ile `uploadInvoice(orderId, pdfBuffer)` var.
- **E-posta:** `lib/notifications.ts` içinde `sendOrderConfirmation`, `sendAdminNewOrderNotification`, `sendPaymentConfirmation` vb. var; **fatura PDF’i e-postaya ekleyen veya fatura linki gönderen bir akış yok**.
- **Webhook’lar:** Stripe ve PayTR webhook’ları sadece **Prisma** siparişini güncelliyor (`paymentStatus: PAID`); e-posta veya fatura tetiklemesi **yok**.

### Yapılması gerekenler (adım adım)

1. **Ödeme başarılı olduğunda (webhook)**
   - Prisma siparişini güncelle (mevcut).
   - Müşteriye **ödeme onayı** e-postası gönder: `sendPaymentConfirmation(notificationData)` (zaten var).
   - Fatura PDF oluştur: `generateInvoicePDF(orderId, orderData)` — `orderData` için Prisma order + customer/items/pricing formatı, invoice’ın beklediği `pricing.items` (sku, title, qty, unitPrice, total) formatına dönüştürülmeli.
   - Fatura e-postaya ekle (attachment) veya önce storage’a yükle, e-postada indirme linki gönder.

2. **Invoice veri formatı**
   - `InvoiceDocument` şu an `orderData.pricing.items` içinde `sku`, `title`, `qty`, `unitPrice`, `total` bekliyor.
   - Prisma order’da `lines` (productName, quantity, unitPrice, lineTotal) var; Firestore’da `items`: `{ id, name, price, quantity }`. Bu verilerden `pricing.items` üretilecek bir map fonksiyonu yazılmalı.

3. **E-posta ile fatura gönderimi**
   - Seçenek A: PDF’i e-postaya ek (attachment) — e-posta servisinizin (Resend/Nodemailer) attachment desteği kullanılır.
   - Seçenek B: PDF’i storage’a yükle, müşteriye “Faturanız hazır” e-postasında indirme linki ver (link süresi sınırlı olabilir).

4. **Firestore siparişleri (giriş yapan müşteri)**
   - Şu an checkout’ta ödeme entegrasyonu (Stripe/PayTR) yok; sipariş “pending” olarak kaydediliyor.
   - İki yol:
     - **A)** Checkout’a ödeme adımı eklenir (ödeme sayfasına yönlendirme, webhook’ta hem Prisma hem Firestore’daki sipariş güncellenir / tek kaynak seçilir) ve ödeme tamamlanınca aynı fatura akışı çalışır.
     - **B)** Havale/EFT ile ödeme kabul edilir; admin panelde “Ödendi” işaretlendiğinde fatura oluşturulup müşteriye e-posta ile gönderilir (manuel tetikleme veya “Ödendi” kaydedildiğinde otomatik).

---

## 3. Klasik E-Ticaret için Genel Kontrol Listesi

### Ürün ve katalog
- [x] Ürün listesi sayfası
- [x] Ürün detay sayfası
- [x] Kategori / arama (query params)
- [x] Stok bilgisinin tutarlı gösterimi (stokta yok + "Son X adet" düşük stok uyarısı)
- [x] Ürün yorumları (API + ürün detay sayfasında Değerlendirmeler sekmesi ve yorum gönderme entegre)

### Sepet
- [x] Sepete ekleme (ürün kartı, detay)
- [x] Sepet sayfası
- [x] Miktar güncelleme / silme
- [x] Toplam hesaplama
- [x] Kupon kodu — API /api/coupons/validate, sepet sayfasında uygula butonu

### Ödeme ve checkout
- [x] Checkout sayfası (adres, özet)
- [x] Giriş yapan: adresler Firestore’dan
- [x] Sipariş oluşturma (giriş: Firestore; misafir: Prisma)
- [x] Sipariş onay e-postası (müşteri) ve admin bildirimi
- [x] Ödeme entegrasyonu (Stripe) checkout'ta — Havale veya Kredi kartı seçimi; kart ile Stripe Checkout Session redirect (Stripe/PayTR) checkout’ta kullanılıyor mu? (Şu an sadece `/api/checkout` Prisma + ödeme başlatıyor; sayfa doğrudan Firestore/API orders kullanıyor)
- [x] Ödeme sonrası yönlendirme (success/cancel) — /checkout/success, /checkout/cancel sayfaları

### Siparişler
- [x] Müşteri: Siparişlerim (profil)
- [x] Müşteri: Sipariş detay (Firestore: `/orders/[id]`; misafir: ORD-xxx ile API)
- [x] Admin: Sipariş listesi (Prisma + Firestore)
- [x] Admin: Sipariş detay sayfası (gerçek veri + durum güncelleme)
- [x] Admin: Sipariş durumu değişince (örn. “Kargoya verildi”) müşteriye e-posta (sendShipmentNotice tetikleniyor)

### Fatura ve ödeme sonrası
- [x] Webhook’ta ödeme başarılı → fatura PDF + müşteriye e-posta
- [x] Fatura formatının Prisma/Firestore item yapısına uyarlanması (lib/invoice-data.ts)
- [x] Admin’den “Fatura gönder” butonu (POST /api/admin/orders/[id]/send-invoice)

### Kullanıcı ve hesap
- [x] Giriş / kayıt (Firebase)
- [x] Profil (adresler, siparişler, favoriler, ayarlar)
- [x] Favoriler (Firestore)
- [x] Hesap menüsü (header)
- [x] Şifre değiştirme (profil → Hesap Ayarları; Firebase reauth + updatePassword)

### Yasal ve bilgi sayfaları
- [x] İletişim
- [x] Gizlilik, şartlar, çerezler, iade, kargo (içerik sayfaları)
- [x] KVKK / çerez onayı (UI) — CookieConsent banner, Kabul Et / Sadece Gerekli

### Admin
- [x] Admin giriş (JWT + role)
- [x] Sipariş listesi (Prisma + Firestore)
- [x] Sipariş detay (veri + durum güncelleme)
- [x] Sipariş “Ödendi” / “Kargoya verildi” işlemleri ve ilgili e-postalar
- [x] Ürün/urunler sayfaları (içerik kontrolü ayrıca yapılabilir)
- [x] **Stok yönetimi:** `/admin/urunler` — site mock ürünlerinin stok adetleri admin tarafından güncellenir; sitede (ana sayfa, ürün listesi, ürün detay) bu stok değerleri kullanılır.

**Admin hesabı açma:** Firestore’da `users/{uid}` dokümanında `role: 'admin'` yapın (uid = giriş yapan kullanıcının Firebase UID’si). Giriş sonrası firebase-session API Firestore’dan role’ü okuyup Prisma kullanıcısına ve JWT’ye yazar; tüm admin sayfaları ve API’ler JWT ile yetkilenir.

### Teknik ve hata
- [x] 404 sayfası (app/not-found.tsx)
- [x] Hata sınırları (error boundary) (app/error.tsx)
- [x] Form validasyonları (checkout, iletişim) — inline hata mesajları ve e-posta formatı
- [x] Rate limit (API) — iletişim 10/dk, giriş 15/dk, sipariş 20/dk (lib/rate-limit.ts)

---

## 4. Öncelikli Uygulama Sırası

1. **Admin sipariş detay sayfası**
   - API: `GET /api/admin/orders/[id]` — query: `source=prisma | firestore`, Firestore için `userId` gerekli (liste zaten `userId` dönüyor).
   - Sayfa: `/admin/orders/[id]` client’ta bu API ile veriyi çeker; hem Prisma hem Firestore siparişi için müşteri, kalemler, toplam, durum gösterilir.
   - (Sonraki adım) Durum güncelleme: Prisma için PATCH; Firestore için Admin SDK ile `users/{userId}/orders/{docId}` güncelleme.

2. **Webhook’ta ödeme sonrası fatura + e-posta**
   - Stripe/PayTR webhook’unda `result.status === 'PAID'` sonrası:
     - Prisma order’ı (zaten) güncelle.
     - Order’dan `notificationData` benzeri yapı oluştur (customer, items, pricing; pricing.items formatı invoice’a uygun).
     - `generateInvoicePDF(orderNo veya orderId, orderData)` çağır.
     - `sendPaymentConfirmation(notificationData)` çağır.
     - Fatura PDF’i e-postaya ekle veya storage’a yükleyip “Faturanız ektedir / linktedir” şeklinde gönder.

3. **Invoice orderData uyarlaması**
   - Prisma `Order` + `lines` → `orderData`: customer (shipping* alanları), pricing: { subtotal, tax, shipping, total }, pricing.items: lines’tan { sku, title, qty, unitPrice, total }.
   - Bu dönüşümü `lib/notifications` veya ayrı bir `lib/invoice-data.ts` içinde yapmak mantıklı.

4. **Checkout ve ödeme akışı netleştirme**
   - Ya mevcut checkout sayfasına “Kredi kartı ile öde” seçeneği eklenip `/api/checkout` (Prisma + Stripe/PayTR) kullanılır ve misafir/giriş ayrımı bu API’ye taşınır; ya da giriş yapan için de aynı API ile sipariş Prisma’da oluşturulur ve tek kaynak kullanılır.
   - Alternatif: Giriş yapan için mevcut Firestore akışı kalır; ödeme “havale” kabul edilir ve admin “Ödendi” yapınca fatura tetiklenir (admin panelden “Ödendi” + “Fatura gönder” veya otomatik).

5. **Admin’de sipariş durumu güncelleme ve e-postalar**
   - Sipariş detay sayfasında “Kargoya ver” butonu → Firestore/Prisma güncelleme + `sendShipmentNotice`.
   - “Ödendi” işareti (Firestore siparişleri için) → istenirse aynı fatura + sendPaymentConfirmation akışı.

---

## 5. Özet Cevaplar

- **Gelen siparişler nerede gözükecek?**  
  **Müşteri:** Profil → Siparişlerim (giriş yapan); misafir siparişi `/orders/ORD-xxx` ile.  
  **Admin:** `/admin/orders` — hem Prisma hem Firestore siparişleri tek listede; detay sayfası gerçek veri ve durum güncelleme ile çalışıyor.

- **Ödemesi yapılan siparişin faturasının otomatik gönderilmesi için ne yapılmalı?**  
  1) Stripe/PayTR webhook’unda ödeme başarılı olunca Prisma siparişini güncelle (mevcut).  
  2) Aynı webhook’ta sipariş verisinden fatura için `orderData` üret; `generateInvoicePDF` ile PDF oluştur.  
  3) Fatura PDF’i müşteri e-postasına ek veya link olarak gönder; `sendPaymentConfirmation` ile ödeme onay e-postasını at (fatura eki/linki ile).  
  4) İsteğe bağlı: Fatura PDF’i storage’a yükle (`uploadInvoice`).  
  5) Firestore (havale) siparişleri için: admin “Ödendi” işaretlediğinde aynı fatura + e-posta akışını tetikleyecek bir endpoint veya admin aksiyonu eklenmeli.

Bu plan uygulandığında siparişler hem müşteri hem admin tarafında tutarlı görünecek ve ödeme sonrası fatura otomasyonu çalışır hale gelir.
