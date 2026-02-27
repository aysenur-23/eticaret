# Sipariş & Müşteri Numarası + E-posta Planı

## 1. Eksikler Listesi

| # | Eksik | Açıklama | Öncelik |
|---|--------|----------|---------|
| 1 | Sipariş numarası unique değil | `ORD-${Date.now()}-${random}` aynı milisaniyede çakışma riski | Yüksek |
| 2 | Sipariş numarası otomatik ve tek kaynak yok | Prisma siparişi API’de, Firestore siparişi client’ta üretiliyor; ortak sıra yok | Yüksek |
| 3 | Müşteri numarası yok | Ne Prisma User’da ne Firestore profilde `customerNo` alanı var | Yüksek |
| 4 | Sipariş oluşturuldu e-postası metni | E-posta “Siparişiniz Alındı” olarak gidiyor; “Siparişiniz oluşturuldu” + sipariş no vurgusu isteniyor | Orta |
| 5 | OrderConfirmation şablonu config’e bağımlı | Config/choices yoksa (sepet siparişi) hata riski | Orta |
| 6 | Firestore siparişine ortak sipariş no | Havale ile giriş yapan kullanıcı siparişi için de aynı numara havuzu kullanılmalı | Yüksek |

---

## 2. Sipariş Numarası – Tanım

- **Format:** `ORD-YYYY-NNNNN`  
  Örnek: `ORD-2025-00001`, `ORD-2025-00002`  
  Yıl değişince NNNNN yıla göre sıfırlanabilir (opsiyonel; şu an global sıra da kullanılabilir).
- **Uniqueness:** Veritabanında tek (Prisma `Order.orderNo` zaten unique).
- **Atanma anı:** Sipariş kaydı oluşturulmadan hemen önce, sunucu tarafında.
- **Nerede tutulur:**
  - **Prisma:** `Order.orderNo` (mevcut alan).
  - **Firestore:** `users/{uid}/orders/{doc}.orderId` — bu alan sipariş numarası (ORD-...) ile doldurulacak; doküman id’si değil.
- **Nasıl üretilir:** Prisma’da `Sequence` tablosu (örn. `name: 'orderNo'`, `value: number`). Her sipariş oluşturmada (Prisma veya Firestore için) `getNextOrderNo()` çağrılır; transaction içinde değer artırılıp `ORD-YYYY-NNNNN` döner.

---

## 3. Müşteri Numarası – Tanım

- **Format:** `CUS-NNNNN`  
  Örnek: `CUS-00001`, `CUS-00002`
- **Uniqueness:** Veritabanında tek (Prisma `User.customerNo` unique; Firestore’da aynı değer tutulur).
- **Atanma anı:**  
  - Prisma kullanıcısı: Kayıt sırasında veya ilk siparişte (yoksa atanır).  
  - Firestore (sadece Auth) kullanıcısı: Profil oluşturulduğunda veya ilk siparişte (yoksa atanır).
- **Nerede tutulur:**
  - **Prisma:** `User.customerNo` (yeni alan, `String?`, `@unique`).
  - **Firestore:** `users/{uid}.customerNo`.
- **Nasıl üretilir:** Aynı `Sequence` tablosunda `name: 'customerNo'`, `value` artırılarak `CUS-NNNNN` üretilir.

---

## 4. Sipariş Oluşturuldu E-postası – Tanım

- **Ne zaman:** Sipariş kaydı (Prisma veya Firestore) oluşturulduktan hemen sonra, bir kez.
- **Kime:** Siparişteki e-posta (misafir: `shippingEmail` / `customer.email`; giriş yapan: kullanıcı e-postası).
- **Konu:** Örn. `Siparişiniz oluşturuldu - ORD-2025-00001`
- **İçerik:** “Siparişiniz oluşturuldu” mesajı + sipariş numarası belirgin şekilde. Mevcut `sendOrderConfirmation` kullanılacak; konu ve şablon metni buna göre güncellenecek.
- **Not:** Ödeme tamamlandığında (webhook) ayrıca “Ödeme Onayı” e-postası zaten gidiyor; “sipariş oluşturuldu” e-postası sipariş anında gidecek.

---

## 5. Uygulama Sırası

1. **Prisma:** `Sequence` modeli ekle; `customerNo` alanını `User` modeline ekle.
2. **lib/sequence.ts:** `getNextOrderNo()`, `getNextCustomerNo()` fonksiyonları (transaction ile artan sıra).
3. **POST /api/orders:** Sipariş numarasını `getNextOrderNo()` ile al; müşteri Prisma user ise `customerNo` yoksa `getNextCustomerNo()` atayıp güncelle.
4. **Sipariş oluşturuldu e-postası:** `sendOrderConfirmation` konu metnini “Siparişiniz oluşturuldu - {orderNo}” yap; OrderConfirmation şablonunda başlık “Siparişiniz oluşturuldu”, config/choices opsiyonel.
5. **Firestore:** `createOrder` için sipariş numarası sunucudan alınsın: yeni endpoint `POST /api/orders/next-order-no` veya mevcut bir API’den dönülsün; checkout’ta bu numara ile Firestore’a yazılsın. Firestore kullanıcısı için `customerNo`: profil oluşturma veya ilk siparişte atanacak (API ile).
6. **Müşteri numarası atama:** Firebase ile giriş/kayıt sonrası profil oluşturulurken veya ilk siparişte `customerNo` yoksa API’den alınıp Firestore’a yazılsın; Prisma tarafında ilk siparişte veya kullanıcı oluşturmada atanır.

---

## 6. Kısa Özet

| Öğe | Format | Nerede | Ne zaman |
|-----|--------|--------|----------|
| Sipariş no | `ORD-YYYY-NNNNN` | Order.orderNo (Prisma), order.orderId (Firestore) | Sipariş create öncesi, sunucu |
| Müşteri no | `CUS-NNNNN` | User.customerNo (Prisma), users/{uid}.customerNo (Firestore) | Kayıt veya ilk sipariş |
| E-posta | Konu: "Siparişiniz oluşturuldu - {orderNo}" | Müşteri e-postasına | Sipariş oluşturulduktan hemen sonra |

Bu doküman, sipariş ve müşteri numaraları ile sipariş oluşturuldu e-postasının tek referans tanımıdır.
