# Ürün Görselleri – Konumlar ve Kaynaklar

## Tek klasör (yerel dosyalar)

**Tüm yerel ürün görselleri şu klasörde toplanır:**

```
public/images/products/
```

- Proje köküne göre tam yol: `c:\...\eticaret - Kopya\public\images\products\`
- Sitede URL: `/images/products/<dosya-adı>` (örn. `/images/products/orbit-12v-100ah-abs-1.jpg`)

Bu klasörde yaklaşık **742** dosya var (orbit, deye, srp, hims, tommatech, electromarketim, placeholder vb.).

---

## Kaynaklara göre konumlar

### 1. Yerel – `public/images/products/`

Aşağıdaki ürün gruplarının görselleri bu klasörde **dosya** olarak durur; path'ler `/images/products/...` ile başlar.

| Kaynak / Grup | Örnek path'ler | Tanımlandığı dosya |
|---------------|----------------|---------------------|
| **ORBİT / DEYE / SRP** (orbitdepo) | `orbit-12v-100ah-abs-1.jpg`, `deye-5kw-monofaze-hybrid-1.jpg`, `srp-30kw-trifaze-hv-1.jpg` | `lib/products-mock-orbit-inverters.ts` |
| **Placeholder** | `placeholder.png` | `lib/products-mock.ts`, `lib/products-mock-orbit-inverters.ts` |
| **TommaTech (yerel)** | `tommatech-m10-topcon-dark-n-type.jpg`, `tommatech-m10-topcon-full-black-sizdirmaz.jpg` | `lib/products-mock.ts` |
| **Elektromarketim / HIMS** | `hims-hcv2l-01-1.jpg`, `hims-emef-22t2-sb-2-1.jpg`, `hcdkb-22-7.jpg`, `hctk-22-g-tf-1.jpg`, `emev-1.png`, `hims-hcc2l-13-1.webp`, `hims-hcb4010-1.jpg` vb. | `lib/products-mock.ts`, `lib/products-mock-electromarketim.ts` |

### 2. Harici URL’ler (dosya projede yok)

Bu görseller **harici sunucularda**; projede fiziksel dosya yok, sadece URL kullanılıyor.

| Kaynak | Örnek URL | Tanımlandığı dosya |
|--------|-----------|---------------------|
| **TommaTech (harici)** | `https://tommatech.de/images/kategory/...`, `https://tommatech.de/images/product/...`, `https://tommatech.de/images/kategory_grup/...` | `lib/products-mock.ts` |
| **Placeholder (test)** | `https://picsum.photos/seed/ev1/600/600` vb. | `lib/products-mock.ts` |

---

## Mock dosyalarındaki image alanları

- **`lib/products-mock.ts`** – Ana mock: TommaTech, HIMS, electromarketim, placeholder, picsum vb. Hem `/images/products/...` hem `https://...` path’leri var.
- **`lib/products-mock-electromarketim.ts`** – Elektromarketim’den gelen ek ürünler; görseller `public/images/products/` altında (örn. `hims-emef-22t2-sb-10-cnt-1.jpg`).
- **`lib/products-mock-orbit-inverters.ts`** – ORBİT/DEYE/SRP ürünleri; görseller `public/images/products/` altında (`orbit-*-1.jpg`, `deye-*-1.jpg`, `srp-*-1.jpg`). Bir ürün (srp-5kw-offgrid-mf-lv) `placeholder.png` kullanıyor.

---

## Görsel indirme script’i (Orbit)

Orbit/DEYE/SRP görselleri orbitdepo.com’dan toplu indirilir:

- **Script:** `scripts/fetch-orbitdepo-images.mjs`
- **Yazılan klasör:** `public/images/products/` (proje kökünden çalıştırıldığında)
- **Çıktı map:** `scripts/orbitdepo-images-map.json`

---

## Özet

| Konum | Açıklama |
|-------|----------|
| **`public/images/products/`** | Tüm yerel ürün görsellerinin tek klasörü (orbit, deye, srp, hims, tommatech yerel, electromarketim, placeholder). |
| **Harici** | TommaTech (tommatech.de), picsum – projede dosya yok, sadece URL. |

Yerel görsellerin hepsi `public/images/products/` altında; harici görseller sadece URL ile kullanılıyor.
