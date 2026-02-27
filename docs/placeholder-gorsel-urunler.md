# Placeholder Görselli Ürünler

Bu ürünlerin görseli doğru/alakalı olmadığı için placeholder atandı ve **sitede gizleniyor**. Doğru görsel eklendiğinde bu listeye göre `lib/products-mock.ts` içindeki `PLACEHOLDER_PRODUCT_IDS` listesinden çıkarılıp tekrar sitede gösterilebilir.

| Ürün ID | Ürün adı / not |
|---------|----------------|
| `hims-3ps-tasinabilir-sarj` | 3.6 kW Tip 2 Taşınabilir Şarj İstasyonu |
| `hims-7ps-tasinabilir-sarj` | 7.4 kW Tip 2 Taşınabilir Şarj İstasyonu |
| `hims-11ps-tasinabilir-sarj` | 11 kW Tip 2 Taşınabilir Şarj İstasyonu |
| `hims-22ps-tasinabilir-sarj` | 22 kW Tip 2 Taşınabilir Şarj İstasyonu |
| `mock-dc-hizli-sarj-istasyonu` | DC Hızlı Şarj İstasyonu (50 kW) |
| `emma-d01-duvar-aski-aparati` | Duvar Askı Aparatı (Priz Tutucu) |
| `mock-ac-arac-sarj-istasyonu` | AC Araç Şarj İstasyonu (7.4 kW) |
| `emma-arac-sarj-zemin-montaj-standlari` | Araç Şarj Zemin Montaj Standları |
| `hims-hcc2l-c2l-adaptorleri` | C2L (Charger to Load) Adaptörleri |
| `pufusu-sarj-istasyonu-yonetim-yazilimi` | Şarj İstasyonu Yönetim Yazılımı |
| `mock-tip2-sarj-kablosu` | Tip 2 Araç Şarj Kablosu (5 m, 32A) |
| `mock-lifepo4-12v-100ah` | LiFePO4 Lityum Akü 12V 100Ah (MOCK-LFP-01) |
| `mock-batarya-modulu-51v` | Batarya Modülü 51.2V 100Ah (MOCK-BAT-01) |
| `mock-inverter-sistemi-5kva` | İnverter Sistemi 5 kVA (Hybrid Paket) |
| `orbit-24v-150ah-abs` | ORBİT 24 V 150 Ah LiFePO4 Akü - ABS Kasa |

**Gizleme:** `lib/products-mock.ts` içinde `mockProducts`, hem bu ID'leri hem de görseli olmayan veya sadece placeholder kullanan tüm ürünleri filtreler. Bu ürünler sitede görünmez; doğrudan URL ile erişimde 404 döner.

**Güncelleme:** Yeni placeholder’lı ürün ekledikten sonra hem bu dokümana hem de `PLACEHOLDER_PRODUCT_IDS` dizisine ekleyin. Görseli olmayan diğer ürünler otomatik gizlenir.
