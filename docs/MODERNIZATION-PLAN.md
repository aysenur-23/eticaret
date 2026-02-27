# Sayfa Modernizasyon Planı – Profesyonel ve Modern Tasarım

## Hedef
Tüm sayfaları ürünler sayfasındaki gibi profesyonel, modern ve tutarlı bir görünüme kavuşturmak (slate/white, net hiyerarşi, sticky/sayfa entegrasyonu).

## Tasarım İlkeleri
- **Renk:** Açık gri arka plan (`bg-slate-50`), beyaz kartlar, slate-800 vurgu butonlar
- **Tipografi:** Net başlık/alt başlık, okunaklı gövde metni
- **Boşluk:** Tutarlı padding (container, section), dokunulabilir buton yükseklikleri (min-h-44)
- **Bileşenler:** Yuvarlatılmış köşeler (rounded-xl / rounded-2xl), ince border (border-slate-200)

---

## Faz 1 – Ortak altyapı
- [x] **Ürünler listesi** – Tamamlandı (sticky kategori, slate tasarım)
- [x] **ClassicPageShell** – Tamamlandı (slate-50 arka plan, beyaz header, breadcrumb)
- [ ] **globals.css** – Gerekirse ek yardımcı sınıflar

---

## Faz 2 – Ana sayfa ve ürün detay
- [x] **Ana sayfa (app/page.tsx)** – Tamamlandı (slate-50, beyaz kartlar, kategori butonları slate-800)
- [ ] **Ürün detay (app/products/[id]/page.tsx)** – Ürünler sayfası ile aynı dil (isteğe bağlı ince ayar)

---

## Faz 3 – Sepet ve ödeme
- [x] **Sepet (app/cart/page.tsx)** – Tamamlandı (beyaz kartlar, slate butonlar)
- [ ] **Ödeme (app/checkout/page.tsx)** – Aynı shell ve kart stili
- [ ] **Checkout success/cancel** – Aynı ton

---

## Faz 4 – İletişim ve auth
- [x] **İletişim (app/contact/page.tsx)** – Tamamlandı
- [x] **Giriş (app/login/page.tsx)** – Tamamlandı (slate kart ve buton)
- [ ] **Kayıt (app/register/page.tsx)** – Aynı
- [ ] **Şifremi unuttum / Reset / Verify email** – Aynı kabuk

---

## Faz 5 – Profil, favoriler, sipariş
- [ ] **Profil (app/profile/page.tsx)** – Modern shell, form ve kartlar
- [ ] **Favoriler (app/favorites/page.tsx)** – Ürün grid’i ürünler sayfası kart stiliyle
- [ ] **Sipariş detay (app/orders/[id]/page.tsx)** – Modern shell, sipariş kartı

---

## Faz 6 – Statik sayfalar
- [ ] **FAQ, Gizlilik, Koşullar, Çerezler, İade, Kargo** – ClassicPageShell modern; içerik tipografi ve boşluklar

---

## Faz 7 – Diğer
- [ ] **Kategoriler (app/categories/page.tsx)** – Liste/kart modern
- [ ] **GES (teklif al, doğrulama, vb.)** – Form sayfaları aynı shell ve form stili
- [ ] **Admin** – İsteğe bağlı; ayrı bir tema da bırakılabilir

---

## Öncelik sırası (uygulama)
1. ClassicPageShell modern varyantı
2. Ana sayfa bölümleri
3. Sepet
4. İletişim
5. Giriş / Kayıt
6. Ürün detay (küçük dokunuşlar)
7. Favoriler, profil, sipariş detay
8. Statik sayfalar
