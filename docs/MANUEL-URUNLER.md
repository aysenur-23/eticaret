# Manuel Ürün Listesi

Bu doküman, sitede **manuel olarak görsel ve/veya özellik eklenen** ürünleri listeler. Tek kaynak: `lib/products-mock.ts` içindeki **MANUAL_PRODUCT_IDS** sabitidir.

## Neden var?

- `scripts/apply-elektromarketim-to-mock.ts` çalıştırıldığında bu listedeki ürünlerin SKU'ları atlanır; çekilen veriyle üzerine yazılmaz.
- Admin veya raporlarda "manuel ürünler" filtresi veya etiketi için kullanılabilir.

## Liste (ID bazlı)

| Tip | Ürün ID | Açıklama |
|-----|---------|----------|
| Apply'da korunan | `hims-hcdkb-22`, `hims-hctk-22-g-tf` | HCDKB-22, HCTK-22-G-TF – script bu SKU'lara dokunmuyor |
| Şarj istasyonu | `hims-emev-22-3f32-pt2` | EMEV 22kW 3 Faz 32A Tip 2 (manuel açıklama/görsel) |
| Kablo çantalı | `hims-emef-22t2-sb-5-cnt` | EMEF-22T2-SB-5 22kW 5m Çantalı |
| V2L tek çıkış | `hims-hcv2l-01`, `hims-hcv2l-02`, `hims-hcv2l-03` | Hyundai/KIA/Ssangyong, MG, BYD-Skywell |
| V2L 3'lü | `hims-hcv2l-31`, `hims-hcv2l-32`, `hims-hcv2l-33` | 3'lü uzatmalı V2L adaptörleri |
| C2L / CEE | `hims-hcc2l-13`, `hims-hcca-tm32-30-f`, `hims-hcca-tm16-30-f` | C2L 3m tek priz; 3/32A ve 1/16A dönüştürücüler |
| Kablo | `hims-emef-22t2-sb-3`, `hims-emef-22t2-sb-8` | 3m; 8m (Beyaz/Siyah varyantlı tek ürün) |

## Sayfa linkleri

- Tüm ürünler: `/products`
- Tekil ürün: `/products/{id}` (ör. `/products/hims-hcdkb-22`)

## Güncelleme

Yeni manuel ürün eklediğinizde `lib/products-mock.ts` içindeki **MANUAL_PRODUCT_IDS** dizisine ürün `id` değerini ekleyin. Apply script bir sonraki çalıştırmada bu ürünü atlayacaktır.
