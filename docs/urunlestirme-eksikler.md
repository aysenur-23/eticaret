# Siteyi Ürünleştirmek İçin Eksikler

Bu liste, siteyi canlıya almak ve tam işlevsel bir e-ticaret olarak çalıştırmak için tamamlanması gereken başlıkları özetler. Detaylar için `docs/backend-gereksinimler-ve-plan.md` dosyasına bakın.

---

## 1. Ortam ve Altyapı

| Eksik | Açıklama |
|-------|----------|
| **.env.local doldurulması** | Firebase (client + isteğe bağlı admin), `JWT_SECRET`, `DATABASE_URL` mutlaka tanımlı olmalı. SMTP ve `ADMIN_EMAIL` mail akışları için gerekli. |
| **Ödeme entegrasyonu** | PayTR veya Stripe için `PAYTR_*` / `STRIPE_*` değişkenleri; webhook URL’leri canlı ortamda ayarlanmalı. |
| **Canlı veritabanı** | Geliştirme için SQLite kullanılıyor; canlıda PostgreSQL (veya uyumlu) `DATABASE_URL` ile kullanılmalı. |

---

## 2. Kimlik Doğrulama (Auth)

| Eksik | Açıklama |
|-------|----------|
| **Kayıt sonrası Firestore** | Kayıt olunca Firestore’da `users/{uid}` dokümanı (role, customerNo, email vb.) oluşturulmalı. |
| **JWT akışı** | Giriş sonrası `/api/auth/firebase-session` ile JWT alınıp tüm korumalı API’lerde `Authorization: Bearer <JWT>` kullanılmalı. |
| **E-posta doğrulama** | Firebase `sendEmailVerification` ve isteğe bağlı backend doğrulama. |
| **Şifremi unuttum** | Firebase `sendPasswordResetEmail` ve SMTP/backend entegrasyonu test edilmeli. |

---

## 3. E-posta Akışları

| Eksik | Açıklama |
|-------|----------|
| **SMTP yapılandırması** | `.env.local`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL` dolu olmalı. |
| **İletişim formu** | `POST /api/contact` → admin’e mail gittiği test edilmeli. |
| **Sipariş mailleri** | Sipariş oluşunca: 1) Müşteriye “Siparişiniz alındı”, 2) Admin’e “Yeni sipariş” (ör. `/api/orders/notify`). |
| **GES teklif bildirimleri** | GES formu ve “Teklif al” için admin + müşteri mailleri tetiklenmeli. |

---

## 4. Ürün Kataloğu

| Eksik | Açıklama |
|-------|----------|
| **Veri kaynağı** | Şu an ürün listesi büyük ölçüde **mock** (`lib/products-mock.ts`). Ana sayfa ve ürün listesi bu mock’u kullanıyor; API ise `getMergedProducts()` ile mock + Prisma ProductOverride birleşimi. |
| **Tam ürün CRUD** | İsterseniz ürünlerin tamamı Prisma Product/Variant veya Firestore’a taşınabilir; mock kaldırılıp tek kaynak kullanılır. |
| **Görsel yükleme** | Admin’de ürün görseli yükleme → Firebase Storage (veya benzeri) → URL’in ürün kaydına yazılması tutarlı çalışmalı. |
| **Stok senkronu** | Stok bilgisi admin/API ile güncellenip sepette ve siparişte doğru yansımalı. |

---

## 5. Sipariş ve Ödeme

| Eksik | Açıklama |
|-------|----------|
| **Checkout akışı** | `/checkout` sayfası: giriş varsa adresler Firestore’dan; sipariş Prisma Order veya Firestore’a yazılmalı. |
| **Sipariş numarası** | `POST /api/orders` veya checkout API’de `/api/orders/next-order-no` ile sipariş no üretilip kullanılmalı. |
| **Ödeme webhook** | PayTR/Stripe webhook’ları canlıda doğru URL ve secret ile test edilmeli; ödeme onayı sonrası sipariş durumu güncellenmeli. |
| **Fatura / bildirim** | Sipariş sonrası müşteri ve admin mailleri + isteğe bağlı fatura (ör. `/api/orders/[id]/send-invoice`) test edilmeli. |

---

## 6. GES (Güneş Enerjisi) ve İletişim

| Eksik | Açıklama |
|-------|----------|
| **GES form kaydı** | `/api/ges-quote` kayıt, `/api/ges-quote-verify` doğrulama ve bildirim mailleri çalışır olmalı. |
| **Dosya yükleme** | `/api/upload/ges-docs` → Firebase Storage; Storage kuralları ve URL’lerin kayda yazılması doğrulanmalı. |
| **İletişim rate limit** | Spam önleme için iletişim formunda rate limit (ör. `lib/rate-limit`) kullanılması önerilir. |

---

## 7. Yasal ve İçerik Sayfaları

| Mevcut | Eksik / Kontrol |
|--------|------------------|
| **Gizlilik** | `app/privacy/page.tsx` var; metinler hukuki incelemeye göre güncellenebilir. |
| **Çerezler** | `app/cookies/page.tsx` ve `CookieConsent` var. |
| **İade / iptal** | `app/returns/page.tsx` var. |
| **KVKK / Aydınlatma** | Gerekirse ayrı sayfa veya gizlilik sayfasında bölüm eklenebilir. |
| **Kullanım koşulları** | İsteğe bağlı `/terms` veya `/kullanim-kosullari` sayfası. |

---

## 8. Canlıya Alma (Deploy) ve Güvenlik

| Eksik | Açıklama |
|-------|----------|
| **Hosting** | Vercel, Node sunucu veya tercih edilen platform; `DATABASE_URL` ve tüm env canlıda tanımlanmalı. |
| **Hassas değerler** | Hiçbir API key veya secret kod içinde veya repo’da olmamalı; sadece `.env` / sunucu env. |
| **NEXT_PUBLIC** | Sadece gerçekten client’ta gereken değişkenler `NEXT_PUBLIC_` ile tanımlanmalı. |
| **HTTPS** | Canlıda zorunlu; ödeme ve auth için gerekli. |

---

## 9. Kontrol Listesi (Hızlı Doğrulama)

- [ ] `.env.local` içinde Firebase, JWT_SECRET, DATABASE_URL, SMTP, ADMIN_EMAIL dolu.
- [ ] Kayıt ol → Firestore’da `users/{uid}` oluşuyor.
- [ ] Giriş sonrası JWT alınıyor; API’ler Bearer token ile çalışıyor.
- [ ] İletişim formu admin’e mail atıyor.
- [ ] GES formu kaydediliyor; dosya yükleniyor; bildirim mailleri gidiyor.
- [ ] Sipariş oluşunca müşteri ve admin sipariş mailleri gidiyor.
- [ ] Ödeme (PayTR/Stripe) webhook canlıda test edildi.
- [ ] Ürün listesi ve detay sayfaları doğru veri kaynağından besleniyor (mock vs Prisma/Firestore kararı uygulandı).
- [ ] Gizlilik / çerez / iade sayfaları güncel ve erişilebilir.
- [ ] Canlı ortamda tüm hassas değerler env’den; repo’da yok.

---

## 10. Öncelik Sırası Önerisi

1. **Ortam:** `.env.local` (Firebase, JWT, SMTP, DATABASE_URL) doldur.
2. **Auth:** Kayıt → Firestore kullanıcı, giriş → JWT akışı test.
3. **İletişim:** Contact API + SMTP ile admin maili test.
4. **Sipariş:** Checkout → sipariş kaydı → müşteri ve admin mailleri test.
5. **Ödeme:** PayTR/Stripe webhook ve sipariş durumu güncellemesi test.
6. **Ürün:** Mock’u kademeli kaldırma veya Prisma/Firestore tek kaynak; admin ürün CRUD + görsel yükleme.
7. **GES:** Form, dosya yükleme ve bildirim mailleri test.
8. **Canlı:** Deploy, env, HTTPS ve son güvenlik kontrolleri.

Bu doküman, `backend-gereksinimler-ve-plan.md` ile birlikte güncel tutulabilir.
