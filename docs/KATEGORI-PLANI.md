# Ürün Kategorileri – Baştan Plan (Tüm Ürünler Baz Alınarak)

Bu belge, sitedeki **tüm ürünler** baz alınarak ana ve alt kategorilerin nasıl ayrılması gerektiğini ve hangi ürünlerin hangi kategoride olması gerektiğini tanımlar.

---

## 1. Mevcut ürün dağılımı (özet)

| Alt kategori (product.category) | Ürün sayısı (yaklaşık) | Ana grup |
|---------------------------------|------------------------|----------|
| Araç Şarj Kabloları | **40** | Elektrikli Araç Şarj |
| Araç Elektrik Aktarım (V2L / C2L) Adaptörleri ve Dönüştürücüler | **12** | Elektrikli Araç Şarj |
| Taşınabilir Şarj İstasyonları | **7** | Elektrikli Araç Şarj |
| On-Grid İnverterler | **7** | İnverterler |
| Güneş Panelleri | **6** | Güneş Enerjisi |
| Isı Pompaları | **5** | Güneş Enerjisi (alt) |
| Ev Tipi Yüksek Voltaj Lityum | **4** | Enerji Depolama |
| Hybrid İnverterler | **4** | İnverterler |
| Akıllı Enerji Yönetimi ve Aksesuarlar | **3** | İnverterler (alt) |
| Elektrikli Araç Şarj İstasyonu Standları, Çantalar ve Aksesuarlar | **3** | Elektrikli Araç Şarj |
| Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları | **2** | Elektrikli Araç Şarj |
| Elektrikli Araç (EV) Şarj Sistemleri | **2** | Elektrikli Araç Şarj |
| Tarımsal Solar Sulama Sistemleri | **2** | Güneş Enerjisi |
| Elektrikli Araç Şarj ve V2L | **7** (electromarketim) | Elektrikli Araç Şarj |
| Lityum (LiFePO4) Aküler | **1 + ~18** (orbit) | Enerji Depolama |
| İnverter Sistemleri | **1 + ~10** (orbit) | İnverterler |
| Off-Grid İnverterler | **1 + 3** (orbit) | İnverterler |
| Diğer (Şarj Kontrol, Marin, Taşınabilir Güç İstasyonu, ESS, Solar Aydınlatma, Montaj, Yazılım, AC/DC Şarj, Akü, Batarya, Taşınabilir Güç Kaynağı vb.) | **1’er** | Çeşitli |

---

## 2. Ana kategoriler (4 grup) – Uygulanan yapı

Ürün çeşidi ve satış mantığına göre **4 ana kategori** kullanılıyor. Isı Pompaları ve Akıllı Enerji ana kategori değil; biri Güneş Enerjisi, diğeri İnverterler altında.

| # | Ana kategori (grup) | Amaç | Alt kategori sayısı |
|---|----------------------|------|----------------------|
| 1 | **Elektrikli Araç Şarj** (ev-sarj) | EV şarj istasyonları, kablolar, V2L/C2L, aksesuarlar | 9 |
| 2 | **Enerji Depolama** (enerji-depolama) | Batarya, akü, taşınabilir güç, ESS | 8 |
| 3 | **Güneş Enerjisi** (gunes-enerjisi) | Panel, şarj kontrol, solar sulama, aydınlatma, montaj, **ısı pompaları** | 6 |
| 4 | **İnverterler** (inverterler) | On-Grid, Hybrid, Off-Grid, paket sistemler, **akıllı enerji aksesuarları** | 5 |

---

## 3. Alt kategoriler ve içerikleri (detaylı)

### 3.1 Elektrikli Araç Şarj (ev-sarj)

| Alt kategori | İçermesi gereken ürünler | Mevcut product.category değeri |
|--------------|---------------------------|---------------------------------|
| **Duvar tipi (sabit) şarj istasyonları** | Ev/ofis için sabit duvar tipi AC/DC şarj cihazları | Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları |
| **Taşınabilir şarj istasyonları** | Taşınabilir EV şarj cihazları, çantalı modeller | Taşınabilir Şarj İstasyonları |
| **AC araç şarj istasyonları** | AC şarj istasyonları (Type 2 vb.) | AC Araç Şarj İstasyonları |
| **DC araç şarj istasyonları** | DC hızlı şarj üniteleri | DC Araç Şarj İstasyonları |
| **Araç şarj kabloları** | Tip 1/2 kablolar, uzatma, çantalar | Araç Şarj Kabloları |
| **EV şarj ve V2L** | V2L özellikli şarj cihazları, kombi ürünler | Elektrikli Araç (EV) Şarj Sistemleri, Elektrikli Araç Şarj ve V2L |
| **V2L / C2L adaptörleri ve dönüştürücüler** | V2L/C2L adaptör, dönüştürücü, aksesuar | Araç Elektrik Aktarım (V2L / C2L) Adaptörleri ve Dönüştürücüler |
| **Şarj istasyonu standları ve aksesuarlar** | Zemin standı, duvar askısı, çanta, kablo organizeri | Elektrikli Araç Şarj İstasyonu Standları, Çantalar ve Aksesuarlar |
| **Şarj yönetim yazılımları** | OCPP, ticari yönetim yazılımları | Şarj İstasyonu Yönetim Yazılımları ve Ticari Çözümler |

---

### 3.2 Enerji Depolama (enerji-depolama)

| Alt kategori | İçermesi gereken ürünler | Mevcut product.category değeri |
|--------------|---------------------------|---------------------------------|
| **Ev tipi yüksek voltaj lityum** | Ev tipi HV batarya paketleri, stack’ler | Ev Tipi Yüksek Voltaj Lityum |
| **Marin / karavan tipi düşük voltaj lityum** | Tekne, karavan için LV lityum paketler | Marin/Karavan Tipi Düşük Voltaj Lityum |
| **Taşınabilir güç istasyonları** | Büyük taşınabilir güç istasyonu (Power Station) | Taşınabilir Güç İstasyonları |
| **Taşınabilir güç kaynakları** | Küçük taşınabilir güç kaynağı, power bank tarzı | Taşınabilir Güç Kaynakları |
| **Lityum (LiFePO4) aküler** | LiFePO4 hücre / akü / paket (12V, 24V vb.) | Lityum (LiFePO4) Aküler |
| **Akü (kurşun vb.)** | Kuru akü, derin devirli akü, AGM vb. | Akü |
| **Batarya modülleri** | Ev/ESS için batarya modülü (51.2V vb.) | Batarya |
| **Endüstriyel ESS** | Endüstriyel enerji depolama sistemleri | Endüstriyel ESS Sistemleri |

---

### 3.3 Güneş Enerjisi (gunes-enerjisi)

| Alt kategori | İçermesi gereken ürünler | Mevcut product.category değeri |
|--------------|---------------------------|---------------------------------|
| **Güneş panelleri** | Monokristal, polikristal, katlanabilir panel | Güneş Panelleri |
| **Şarj kontrol cihazları** | MPPT, PWM şarj kontrol | Şarj Kontrol Cihazları |
| **Solar dış mekan aydınlatma** | Solar sokak/saha aydınlatma | Solar Dış Mekan Aydınlatma Sistemleri |
| **Solar yapı ve montaj** | Montaj seti, konstrüksiyon, çatı montajı | Solar Yapı ve Montaj Sistemleri |
| **Tarımsal solar sulama** | Solar sulama pompası, kit, kontrol | Tarımsal Solar Sulama Sistemleri |
| **Isı pompaları** | Hava/su kaynaklı ısı pompası, klima tipi (ana kategori değil; bu grupta alt kategori) | Isı Pompaları |

---

### 3.4 İnverterler (inverterler)

| Alt kategori | İçermesi gereken ürünler | Mevcut product.category değeri |
|--------------|---------------------------|---------------------------------|
| **On-Grid inverterler** | Şebekeye bağlı (on-grid) inverterler | On-Grid İnverterler |
| **Hybrid inverterler** | Hibrit (şebeke + batarya + güneş) inverterler | Hybrid İnverterler |
| **Off-Grid inverterler** | Şebekesiz (ada) inverterler | Off-Grid İnverterler |
| **İnverter sistemleri** | Paket inverter sistemi, hybrid kit | İnverter Sistemleri |
| **Akıllı enerji yönetimi ve aksesuarlar** | Smart meter, dongle, enerji izleme (ana kategori değil; bu grupta alt kategori) | Akıllı Enerji Yönetimi ve Aksesuarlar |

---

## 4. Özet tablo: Ana kategori → Alt kategoriler → Ürün tipleri

| Ana kategori | Alt kategoriler | Örnek ürün tipleri |
|--------------|-----------------|---------------------|
| **Elektrikli Araç Şarj** | Duvar tipi, Taşınabilir, AC, DC, Kablolar, EV Şarj/V2L, V2L/C2L adaptörleri, Standlar/Aksesuarlar, Yazılım | Duvar tipi şarj, taşınabilir şarj, Type 2 kablo, V2L adaptör, zemin standı |
| **Enerji Depolama** | Ev HV Lityum, Marin/Karavan LV, Taşınabilir Güç İstasyonu, Taşınabilir Güç Kaynağı, LiFePO4 Aküler, Akü, Batarya Modülü, Endüstriyel ESS | Ev batarya paketi, taşınabilir güç istasyonu, LiFePO4 12V, kuru akü |
| **Güneş Enerjisi** | Güneş Panelleri, Şarj Kontrol, Solar Aydınlatma, Solar Montaj, Tarımsal Solar Sulama, **Isı Pompaları** | Panel, MPPT şarj kontrol, solar sulama, ısı pompası |
| **İnverterler** | On-Grid, Hybrid, Off-Grid, İnverter Sistemleri, **Akıllı Enerji Yönetimi ve Aksesuarlar** | On-grid inverter, hybrid inverter, inverter paketi, smart meter, dongle |

---

## 5. Uygulama notları

- **product.category** alanı: Yukarıdaki “Mevcut product.category değeri” sütunundaki string’ler aynen kullanılmalı; böylece mevcut ürünler doğru alt kategoriye düşer.
- **Boş alt kategoriler**: Sitede ürünü olmayan alt kategoriler menüde gizlenebilir veya “Ürün bulunamadı” ile gösterilebilir.
- **Elektrikli Araç Şarj ve V2L**: Hem “Elektrikli Araç (EV) Şarj Sistemleri” hem “Elektrikli Araç Şarj ve V2L” aynı ana grupta kalmalı; gerekirse menüde tek başlık altında toplanabilir.
- **Çeviriler**: `messages/tr.json` ve `messages/en.json` içinde `header` / kategori key’leri bu plana göre güncellenmeli.
- **lib/categories.ts**: `CATEGORY_GROUPS` 4 ana gruptur; Isı Pompaları ve Akıllı Enerji ana kategori değildir.
- **Eski URL yönlendirme**: `/category/isi-pompalari` → `/category/gunes-enerjisi`, `/category/akilli-enerji` → `/category/inverterler` (app/category/[id]/page.tsx içinde redirect).

Bu plan, tüm ürünler baz alınarak ana ve alt kategorileri tanımlar; içerik listesi ve filtreleme bu yapıya göre yapılmalıdır.
