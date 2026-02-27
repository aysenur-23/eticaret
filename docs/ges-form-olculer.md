# GES Formu – Genişlik ve Yükseklik Ölçüleri

Tailwind varsayılan ölçeği: **1 birim = 0.25rem = 4px** (16px taban).

---

## Sayfa ve konteyner

| Öğe | Sınıf | Genişlik | Yükseklik / uzunluk |
|-----|--------|----------|----------------------|
| Sayfa wrapper | `min-h-screen py-12 md:py-16` | %100 | Min. 100vh; üst/alt boşluk: 48px (md: 64px) |
| Konteyner | `container mx-auto px-4` | container (ekrana göre) | — |
| İçerik alanı | `max-w-4xl mx-auto space-y-12` | **Maks. 896px** (56rem) | Bloklar arası: **48px** |

---

## Header (başlık bölümü)

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| Güneş ikonu kutusu | `w-14 h-14` | **56px** | **56px** |
| Güneş ikonu | `w-7 h-7` | 28px | 28px |
| Açıklama paragrafı | `max-w-2xl` | Maks. **672px** | — |
| Bloklar arası | `space-y-4` | — | 16px |

---

## Ana form kartı

| Öğe | Sınıf | Genişlik | Yükseklik / padding |
|-----|--------|----------|----------------------|
| Kart içeriği | `p-8 md:p-10` | — | Padding: **32px** (md: **40px**) her yönde |
| Form blokları arası | `space-y-12` | — | **48px** |

---

## Bölüm başlıkları

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| Numaralı rozet (1, 2) | `w-10 h-10` | **40px** | **40px** |
| Ek bilgiler rozet | `w-9 h-9` | **36px** | **36px** |
| Alt bölüm rozet (3, 4, 5) | `w-8 h-8` | **32px** | **32px** |
| Başlık alt boşluk | `pb-4` / `pb-3` | — | 16px / 12px |

---

## Form alanları (input / select)

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| Tüm input ve select | `h-12` | Grid’e göre (yarım/ tam genişlik) | **48px** |
| Input padding | `px-4 py-2` | Yatay 16px | Dikey 8px |
| Alanlar arası (grid) | `gap-5` | **20px** | **20px** |
| Alanlar arası (blok) | `space-y-2` | — | 8px |

---

## Ek bilgiler (details)

| Öğe | Sınıf | Genişlik | Yükseklik / padding |
|-----|--------|----------|----------------------|
| Summary satırı | `px-6 py-4` | — | Padding: 24px yatay, **16px** dikey |
| İç padding | `px-6`, `pt-4 pb-6` | — | Üst 16px, alt 24px |
| Chevron ikon | `w-5 h-5` | 20px | 20px |

---

## Kullanım hedefi kutuları (checkbox)

| Öğe | Sınıf | Genişlik | Yükseklik / padding |
|-----|--------|----------|----------------------|
| Her kutu | `p-4` | Grid’e göre | Padding **16px** |
| Checkbox | `h-5 w-5` | **20px** | **20px** |
| Kutular arası | `gap-3` | 12px | 12px |

---

## Onay kutusu (KVKK / arama)

| Öğe | Sınıf | Genişlik | Yükseklik / padding |
|-----|--------|----------|----------------------|
| Dış kutu | `p-5`, `rounded-2xl` | %100 | Padding **20px** |
| Her satır | `p-3` | — | Padding 12px |
| Checkbox | `h-5 w-5` | **20px** | **20px** |

---

## Hesaplama sonuç kartları (4’lü)

| Öğe | Sınıf | Genişlik | Yükseklik / padding |
|-----|--------|----------|----------------------|
| Kartlar arası | `gap-4` | **16px** | **16px** |
| Kart içeriği | `p-6` | Grid’e göre | Padding **24px** |
| İkon kutusu | `w-12 h-12` | **48px** | **48px** |
| İkon (Settings, Zap, vb.) | `w-6 h-6` | 24px | 24px |
| İkon alt boşluk | `mb-3` | — | 12px |
| Formül notu kutusu | `p-3` | %100 | Padding 12px |

---

## Butonlar

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| Hesapla / Teklif gönder | `w-full h-14` | %100 | **56px** |
| Yeniden hesapla | `flex-1 h-14` | Kalan alan | **56px** |
| Kurulum maliyeti eklemeden teklif al | `w-full h-12` | %100 | **48px** |
| Butonlar arası | `gap-4` | 16px | 16px |
| İkon (Calculator, Sun) | `w-5 h-5` / `w-6 h-6` | 20px / 24px | 20px / 24px |

---

## Başarı ekranı

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| İçerik | `py-16 px-8` | — | Padding: 64px dikey, 32px yatay |
| Yeşil ikon kutusu | `w-20 h-20` | **80px** | **80px** |
| CheckCircle ikon | `w-10 h-10` | 40px | 40px |
| Paragraf | `max-w-md` | Maks. **448px** | — |

---

## Teklif doğrulama linki kartı

| Öğe | Sınıf | Genişlik | Yükseklik |
|-----|--------|----------|-----------|
| İkon kutusu | `w-14 h-14` | **56px** | **56px** |
| İkon | `w-7 h-7` | 28px | 28px |
| İçerik | `p-6` | — | Padding 24px |

---

## Özet (piksel)

| Ölçü | Değer |
|------|--------|
| Sayfa max içerik genişliği | **896px** |
| Açıklama max genişliği | **672px** |
| Form kartı padding (masaüstü) | **40px** |
| Input/select yüksekliği | **48px** |
| Ana buton yüksekliği | **56px** |
| İkincil buton yüksekliği | **48px** |
| Sonuç kartı ikon kutusu | **48×48px** |
| Bölüm rozeti (1–2) | **40×40px** |
| Header güneş ikonu kutusu | **56×56px** |

*Tüm değerler 16px taban (1rem = 16px) ile hesaplanmıştır.*
