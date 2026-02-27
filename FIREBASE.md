# Firebase / Firestore Kullanımı

## Veri yapısı (Firestore)

- **users/{uid}** — Kullanıcı profili (email, name, phone, role)
- **users/{uid}/addresses/{addressId}** — Teslimat adresleri
- **users/{uid}/orders/{orderId}** — Giriş yapan kullanıcının siparişleri
- **users/{uid}/favorites/{productId}** — Favori ürünler (doc id = productId)

Profil, adresler, siparişler ve favoriler client tarafında bu yapı ile okunup yazılır. API’ler (`/api/addresses`, admin sipariş listesi) Firebase Admin ile aynı koleksiyonlara erişir.

## Güvenlik kuralları

`firestore.rules` dosyasında:

- `users/{uid}` ve alt koleksiyonları (addresses, orders, favorites) sadece `request.auth.uid == uid` ile okunup yazılabilir.

Kuralları güncelledikten sonra Firebase Console’dan deploy edin.

## Admin sipariş listesi (collection group)

Admin panelinde Firestore’daki tüm siparişler `collectionGroup('orders')` ile listelenir. Bu sorgu için **Firestore bileşik indeksi** gerekebilir:

- Koleksiyon grubu: `orders`
- Alan: `createdAt` (Azalan)

İlk çalıştırmada Firestore hata mesajında indeks linki verir; linke tıklayıp indeksi oluşturabilirsiniz. Alternatif: Firebase Console → Firestore → Indexes → Composite → Collection group `orders`, field `createdAt` desc.

## Ortam değişkenleri

- **Client (Firebase):** `.env.local` içinde `NEXT_PUBLIC_FIREBASE_*` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). İsteğe bağlı: `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (Analytics). Tam liste: `.env.example`.
- **Server (Firebase Admin):** `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`  
  JWT bridge (`/api/auth/firebase-session`), adres API’si ve admin sipariş listesi için gerekli.
- **JWT:** `JWT_SECRET` — API Bearer token doğrulama için.

**Analytics:** `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` tanımlıysa uygulama açılışında Analytics başlatılır (`FirebaseAnalyticsInit`).
