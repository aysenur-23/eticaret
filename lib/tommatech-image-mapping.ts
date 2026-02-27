/**
 * TommaTech ürün id (sitedeki) -> tommatech.de ürün sayfası URL eşlemesi.
 * Resmi siteden görsel almak için kullanılır.
 * Kaynak: tommatech.de/en/products/ kategorileri ve ürün sayfaları.
 */
export const TOMMATECH_PRODUCT_PAGE_MAP: Record<string, string> = {
  'tommatech-m10-topcon-dark-n-type': 'https://tommatech.de/en/product/tommatech-590wp-144tn-m10-topcon-solar-panel-1145.html',
  'tommatech-m10-topcon-full-black-sizdirmaz': 'https://tommatech.de/en/product/tommatech-m10-full-black-solar-panel-972.html',
  'tommatech-m10-perc-dark-series': 'https://tommatech.de/en/product/tommatech-535wp-144pm-m10-dark-series-solar-panel-971.html',
  'tommatech-esnek-flexible-paneller': 'https://tommatech.de/en/products/solar-panels-1.html',
  'tommatech-katlanabilir-200wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-katlanabilir-110wp': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-micro-s-800w': 'https://tommatech.de/en/products/inverters-19.html',
  'tommatech-uno-atom': 'https://tommatech.de/en/products/on-grid-inverters-72.html',
  'tommatech-uno-home': 'https://tommatech.de/en/product/tommatech-uno-home-55kw-single-phase-string-inverter-1041.html',
  'tommatech-trio-atom-plus-k': 'https://tommatech.de/en/products/on-grid-inverters-72.html',
  'tommatech-uno-hybrid-k': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-k': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-lv-f': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-trio-hybrid-m-50kw': 'https://tommatech.de/en/products/tommatech-hybrid-inverter-models-prices-136.html',
  'tommatech-offgrid-new-pro-plus': 'https://tommatech.de/en/products/off-grid-inverters-20.html',
  'tommatech-sarj-kontrol-au-scc': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-hightech-lifepo4-3kwh': 'https://tommatech.de/en/product/tommatech-3-kwh-lithium-batterystorage-management-system-352.html',
  'tommatech-hightech-5-8kwh-booster': 'https://tommatech.de/en/product/tommatech-high-tech-power-general-pack-58kwh-lithium-battery-353.html',
  'tommatech-prizmatik-51-2v-high-capacity': 'https://tommatech.de/en/products/residential-energy-storage-solutions-130.html',
  'tommatech-prizmatik-marin-karavan': 'https://tommatech.de/en/products/marine-storage-solutions-152.html',
  'tommatech-mobil-guc-istasyonu': 'https://tommatech.de/en/products/mobile-power-station-solutions-153.html',
  'tommatech-endustriyel-ess-kabin': 'https://tommatech.de/en/products/industrial-energy-storage-solutions-133.html',
  'tommatech-r290-dc-inverter-isi-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-split-evi-dc-inverter': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-havuz-isi-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-endustriyel-isi-pompasi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-ev-ac-dc-sarj': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-ev-sarj-kablosu': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-fan-coil-unitesi': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-akumulasyon-tanki': 'https://tommatech.de/en/products/heating-and-cooling-127.html',
  'tommatech-solar-carport': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
  'tommatech-solar-sulama-inverter-spi': 'https://tommatech.de/en/products/irrigation-systems-115.html',
  'tommatech-hazir-solar-sulama-panosu': 'https://tommatech.de/en/products/irrigation-systems-115.html',
  'tommatech-wifi-lan-4g-dongle': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-smart-meter': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-eps-box': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-smart-controller': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-heatpump-controller': 'https://tommatech.de/en/products/accessories-103.html',
  'tommatech-booster-paralel-box': 'https://tommatech.de/en/products/storage-solutions-56.html',
  'tommatech-solar-led-yuruyus-yolu': 'https://tommatech.de/en/products/solar-lighting-solutions-models-prices-157.html',
  'tommatech-solar-carport-2car': 'https://tommatech.de/en/products/electric-vehicle-charging-stations-95.html',
}

/** Bu klasöre konacak görsel dosya adları (public/images/products/tommatech/). Genelde {id}.jpg veya .webp formatındadır. */
export const TOMMATECH_IMAGE_FILENAMES: string[] = Object.keys(TOMMATECH_PRODUCT_PAGE_MAP).map(
  (id) => `${id}.*`
)
