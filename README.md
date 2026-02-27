# Sızdırmazlık Market - Profesyonel Sızdırmazlık Çözümleri

Next.js 14, TypeScript ve Tailwind CSS ile geliştirilmiş, sızdırmazlık ürünleri odaklı modern e-ticaret platformu.

## 🚀 Özellikler

- **Hızlı Alışveriş**: Ürünleri doğrudan sepete ekleyip sipariş verme (teklif gerekmez).
- **Varyant Desteği**: 500 ml, 1 kg, 2 kg ve 3 kg seçenekleri.
- **Güvenli Ödeme**: Stripe Checkout entegrasyonu.
- **Admin Panel**: Sipariş yönetimi ve istatistikler.
- **Modern Tasarım**: Şık, hızlı ve responsive arayüz.
- **SEO Uyumlu**: Optimize edilmiş metadata ve içerik.

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI**: Radix UI, Lucide React, Shadcn/UI
- **State Management**: Zustand
- **Backend**: Firebase (Firestore + Auth), Stripe, Resend
- **Validation**: Zod

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyasını oluşturun ve gerekli değişkenleri (Firebase, Stripe, admin token vb.) ayarlayın.

3. Uygulamayı çalıştırın:
```bash
npm run dev
```

## 📁 Proje Yapısı

- `app/`: Sayfa yapıları ve API rotaları
- `components/`: UI bileşenleri
- `lib/`: Yardımcı fonksiyonlar, store'lar ve veri yapıları
- `public/`: Görseller ve statik dosyalar

## 📄 Lisans

Bu proje MIT lisansı altındadır.
