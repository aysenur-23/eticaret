# Backend ve Tüm Özellikler – Gereksinim Listesi ve Uygulama Planı

Bu doküman, sitedeki tüm özelliklerin kayıtlı ve çalışır hale gelmesi için gereken backend, Firebase, e-posta, veritabanı ve entegrasyonları listeler.

---

## Not: Tarayıcı Konsol Hataları

Gördüğünüz `constants-BV5VWQA_.js: Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')` hataları **projenize ait değil**. Bunlar bir **tarayıcı eklentisinin** (content script) kodundan geliyor. Sitedeki JavaScript’i etkilemez; eklentiyi kapatarak veya gizli pencerede test ederek doğrulayabilirsiniz.

---

## 1. Ortam Değişkenleri (.env.local)

Aşağıdaki değişkenlerin **hepsi** tanımlı ve doğru olmalı:

### Firebase (Client – tarayıcı)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase Admin (Backend – sunucu)
```env
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### JWT (Backend oturum)
```env
JWT_SECRET=  # Güçlü, rastgele bir anahtar
```

### E-posta (SMTP – tüm mailler)
```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=  # Gönderen adres (örn. noreply@site.com)
ADMIN_EMAIL=  # Sipariş/iletişim bildirimlerinin gideceği adres
```

### Veritabanı (Prisma)
```env
DATABASE_URL=  # SQLite: file:./dev.db  veya PostgreSQL connection string
```

### Ödeme (isteğe bağlı)
```env
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
# veya Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 2. Kimlik Doğrulama (Auth)

| Özellik | Durum / Gereksinim |
|--------|---------------------|
| **Kayıt ol** | Firebase Auth `createUserWithEmailAndPassword` (client). Kayıt sonrası Firestore `users/{uid}` dokümanı oluşturulmalı (role: customer, customerNo). |
| **E-posta doğrula** | Firebase Auth e-posta doğrulama linki gönderilmeli. Client: `sendEmailVerification`. İsteğe bağlı: `/api/auth/verify-email` ile backend’de ek doğrulama. |
| **Giriş yap** | Firebase Auth `signInWithEmailAndPassword`. Giriş sonrası client, `/api/auth/firebase-session` ile Firebase ID token gönderip **JWT** almalı. Tüm korumalı API istekleri `Authorization: Bearer <JWT>` kullanmalı. |
| **Çıkış** | Firebase `signOut` + client tarafında JWT’yi temizle. |
| **Şifremi unuttum** | Firebase `sendPasswordResetEmail`. Backend: `/api/auth/forgot-password` varsa e-posta ile link gönderme veya sadece client’ta Firebase kullanımı. |
| **Şifre sıfırlama** | Firebase Auth şifre sıfırlama linki (client). Backend’de `/api/auth/reset-password` token ile şifre güncelleme (isteğe bağlı). |

**Yapılacaklar:**
- Firestore’da `users/{uid}` dokümanı: `role`, `customerNo`, `email`, `displayName`, `emailVerified`.
- Prisma `User` tablosu: Firebase UID ile senkron (firebase-session’da create/update).
- Admin rolü: Firestore `users/{uid}.role = 'admin'` ile belirlenir.

---

## 3. E-posta Akışları

| E-posta | Tetikleyen | İçerik / API |
|---------|------------|--------------|
| **Kayıt / doğrulama** | Kayıt ol | Firebase Auth e-posta doğrulama (varsayılan Firebase şablonu). |
| **Şifre sıfırlama** | Şifremi unuttum | Firebase Auth şifre sıfırlama linki. |
| **İletişim formu** | İletişim / “Bu ürün size uygun mu?” | Admin’e mail: `/api/contact` → `sendEmailSMTP`. |
| **Sipariş geldi (müşteri)** | Sipariş tamamlandı | Müşteriye “Siparişiniz alındı” maili. `/api/orders/notify` veya checkout sonrası. |
| **Sipariş geldi (admin)** | Sipariş oluşturuldu | Admin’e “Yeni sipariş” maili. |
| **GES teklif talebi** | GES formu gönderildi | Admin’e bildirim: `/api/ges-quote/notify`. |
| **GES teklif (müşteri)** | “Teklif al” butonu | Müşteriye teklif özeti maili. |

**Yapılacaklar:**
- Tüm maillerde `sendEmailSMTP` (veya seçilen SMTP kütüphanesi) kullanımı.
- `.env.local`: `SMTP_*`, `ADMIN_EMAIL`, `SMTP_FROM` dolu olmalı.
- Sipariş sonrası müşteri maili: checkout API’de veya `POST /api/orders` sonrası tetikle.

---

## 4. GES (Güneş Enerjisi Hesaplama)

| Özellik | Durum / Gereksinim |
|---------|---------------------|
| **Hesaplama** | Client’ta hesaplama (lib/ges-calc). Backend’e gönderim: `/api/ges-quote` (kayıt). |
| **Doğrulama** | `/api/ges-quote-verify` – token ile teklif doğrulama. |
| **Dosya yükleme** | `/api/upload/ges-docs` → Firebase Storage `ges-attachments/{uuid}/`; URL Firestore’a yazılır. |
| **Bildirim mailleri** | Her kayıtta admin’e mail; “Teklif al” tıklanınca ek müşteri maili (`/api/ges-quote/notify`). |

**Yapılacaklar:**
- Firebase Storage kuralları: sadece authenticated veya server ile yükleme.
- Firestore’da GES talepleri koleksiyonu (veya mevcut yapı) tutarlı kullanılsın.

---

## 5. İletişim Formu

- **API:** `POST /api/contact`
- **Gönderim:** SMTP ile admin’e (veya `ADMIN_EMAIL`) mail.
- Rate limit: `lib/rate-limit` ile istek sınırı (spam önleme).

---

## 6. Sipariş ve Ödeme

| Özellik | Durum / Gereksinim |
|---------|---------------------|
| **Sepet** | Client: Zustand (useCartStore). Kalemler: ürün/varyant veya teklif kalemi. |
| **Checkout** | `/checkout` sayfası. Giriş varsa: adresler Firestore `users/{uid}/addresses`. Sipariş: Prisma Order veya Firestore `users/{uid}/orders`. |
| **Sipariş oluşturma** | `POST /api/orders` veya `POST /api/checkout`. Sipariş numarası: `/api/orders/next-order-no`. |
| **Sipariş geldi mailleri** | Sipariş kaydı sonrası: 1) Müşteriye “Siparişiniz alındı”, 2) Admin’e “Yeni sipariş” (ör. `/api/orders/notify`). |
| **Ödeme** | PayTR / Stripe webhook: `/api/webhooks/paytr`, `/api/webhooks/stripe`. Ödeme onayı sonrası sipariş durumu güncellenir, gerekirse ek mail. |

**Yapılacaklar:**
- Prisma: `Order`, `OrderItem`, ilişkiler ve seed (gerekirse).
- Firestore: adres ve sipariş yapısı dokümante edilsin; admin paneli aynı yapıyı okusun.

---

## 7. Ürün Kataloğu ve Görseller

| Özellik | Durum / Gereksinim |
|---------|---------------------|
| **Ürün listesi** | Şu an: mock data (lib/products-mock). Tam çalışır hale getirmek için: Prisma Product/Variant veya Firestore products koleksiyonu. |
| **Ürün kaydı** | Admin: `/api/admin/products`, `/api/admin/products/[id]`. Ürün oluşturma/güncelleme ve görsel URL’lerinin kaydı. |
| **Görsel yükleme** | Ürün görselleri: Firebase Storage (örn. `products/{productId}/`) veya `/api/upload/design` benzeri endpoint. Yüklenen dosya URL’i ürün kaydına yazılır. |

**Yapılacaklar:**
- Ürünler için tek kaynak: Prisma Product + Variant veya Firestore. Mock’tan gerçek veriye geçiş planı.
- Admin ürün formunda: görsel yükleme → Storage → URL’i kaydet.
- Kategori ve stok alanları tutarlı kullanılsın.

---

## 8. Veritabanı Özeti

| Veri | Konum |
|------|--------|
| Kullanıcı (auth eşlemesi, customerNo) | Prisma User |
| Kullanıcı profili, rol, adresler, siparişler (giriş yapan) | Firestore `users/{uid}` |
| RFQ / Teklif talepleri | Prisma RFQ |
| Siparişler (misafir veya senkron) | Prisma Order + OrderItem veya Firestore |
| Ürünler / varyantlar | Prisma Product, Variant veya Firestore |
| GES talepleri / doğrulama | Firestore veya Prisma (mevcut API’ye göre) |
| Görsel dosyalar | Firebase Storage (ges-attachments, products, vb.) |

---

## 9. Uygulama Sırası Önerisi

1. **Ortam:** `.env.local` içinde Firebase (client + admin), JWT_SECRET, SMTP, DATABASE_URL doldur.
2. **Auth:** Kayıt → Firestore `users/{uid}` oluşturma, e-posta doğrulama, firebase-session → JWT akışını test et.
3. **İletişim:** Contact API ve SMTP ile admin’e maili test et.
4. **GES:** Form kaydı, Storage yükleme, notify mailleri test et.
5. **Sipariş:** Checkout → Order kaydı → müşteri ve admin mailleri.
6. **Ürün:** Admin ürün CRUD + görsel yükleme (Storage) + sitede listeleme.

---

## 10. Kontrol Listesi (Hızlı Doğrulama)

- [ ] Kayıt ol çalışıyor; Firestore’da `users/{uid}` oluşuyor.
- [ ] E-posta doğrulama linki gidiyor (Firebase Auth).
- [ ] Giriş sonrası JWT alınıyor; API’ler Bearer ile çalışıyor.
- [ ] Şifremi unuttum ile sıfırlama maili gidiyor.
- [ ] İletişim formu admin’e mail atıyor.
- [ ] GES formu kaydediliyor; dosya Storage’a yükleniyor; admin ve (Teklif al’da) müşteri maili gidiyor.
- [ ] Sipariş oluşturulunca müşteri ve admin sipariş mailleri gidiyor.
- [ ] Admin ürün ekleyebiliyor; görsel yüklenip ürünle ilişkileniyor.
- [ ] Tüm hassas değerler .env’de; NEXT_PUBLIC sadece client’ta.

Bu doküman güncellenerek yeni endpoint’ler ve env değişkenleri eklenebilir.
