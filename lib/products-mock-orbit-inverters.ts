/**
 * ORBİT Lityum (LiFePO4) Aküler ve İnverter Sistemleri (DEYE, SRP, ORBİT).
 * Kategoriler: Lityum (LiFePO4) Aküler, Off-Grid İnverterler, İnverter Sistemleri.
 */

import type { MockProduct } from './products-mock'

/** Placeholder path (products-mock ile döngüyü önlemek için burada tanımlı). */
const PLACEHOLDER = '/images/products/placeholder.png'

function spec(o: Record<string, string>): Record<string, string> {
  return o
}

const LIFEPO4_CATEGORY = 'Lityum Aküler'
const HYBRID_CATEGORY = 'Hibrit İnverterler'
const OFFGRID_CATEGORY = 'Off-Grid İnverterler'
const MICRO_CATEGORY = 'Mikro İnverter'

export const mockProductsOrbitInverters: MockProduct[] = [
  // ----- 12V Lityum Aküler -----
  {
    id: 'orbit-12v-lifepo4-aku',
    brand: 'ORBİT',
    image: '/images/products/orbit-12v-100ah-abs-1.jpg',
    sku: 'ORBIT-12V-VAR',
    name: 'ORBİT 12V LiFePO4 Akü Serisi',
    description: '6000 Cycle (%80 D.O.D), prizmatik hücre, ABS veya Marin kasa seçenekleri. Ekran ve Bluetooth desteği.',
    price: 18410,
    category: LIFEPO4_CATEGORY,
    stock: 50,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '100ah-abs', label: '100Ah ABS Kasa', price: 18410, sku: 'GU12100' },
      { key: '100ah-marin', label: '100Ah Marin Tip (Victron Uyumlu)', price: 24430, sku: 'VP12100' },
      { key: '200ah-abs', label: '200Ah ABS Kasa', price: 29235, sku: 'GU12200' },
      { key: '200ah-marin', label: '200Ah Marin Tip (Victron Uyumlu)', price: 34125, sku: 'VP12200' },
      { key: '420ah-abs', label: '420Ah ABS Kasa', price: 57845, sku: 'GU12420' },
      { key: '420ah-marin', label: '420Ah Marin Tip (Victron Uyumlu)', price: 61250, sku: 'VP12420' },
    ],
    tags: ['12V', 'LiFePO4', 'Marin', 'Bluetooth'],
    specifications: {
      'Çevrim Ömrü': '6000 Cycle (%80 D.O.D)',
      'Hücre Tipi': 'Prizmatik',
      'Özellikler': 'Ekran / Bluetooth / BMS',
    },
  },
  // ----- 24V Lityum Aküler -----
  {
    id: 'orbit-24v-lifepo4-aku',
    brand: 'ORBİT',
    image: '/images/products/orbit-24v-100ah-abs-1.jpg',
    sku: 'ORBIT-24V-VAR',
    name: 'ORBİT 24V LiFePO4 Akü Serisi',
    description: '6000-8000 Cycle, yüksek performanslı lityum aküler. Karavan, tekne ve solar sistemler için ideal.',
    price: 27445,
    category: LIFEPO4_CATEGORY,
    stock: 30,
    featured: false,
    isVariantProduct: true,
    variants: [
      { key: '100ah-abs', label: '100Ah ABS Kasa', price: 27445, sku: 'GU24100' },
      { key: '100ah-marin', label: '100Ah Marin Tip', price: 33600, sku: 'VP24100' },
      { key: '150ah-abs', label: '150Ah ABS Kasa', price: 43680, sku: 'GU24150' },
      { key: '210ah-abs', label: '210Ah ABS Kasa (8000 Cycle)', price: 57845, sku: 'GU24210' },
      { key: '210ah-marin', label: '210Ah Marin Tip (8000 Cycle)', price: 60725, sku: 'VP24210' },
    ],
    tags: ['24V', 'LiFePO4', 'Marin', 'Solar'],
    specifications: {
      'Hücre Tipi': 'Prizmatik',
      'Kullanım': 'Karavan, Tekne, Solar',
    },
  },
  // ----- 48V / 51.2V Lityum Aküler -----
  {
    id: 'orbit-48v-lifepo4-aku',
    brand: 'ORBİT',
    image: '/images/products/orbit-48v-100ah-wall-1.jpg',
    sku: 'ORBIT-48V-VAR',
    name: 'ORBİT 48V / 51.2V Lityum Akü Sistemleri',
    description: 'Ev tipi ve endüstriyel depolama çözümleri. Duvar tipi, raf tipi ve yüksek voltaj (HV) seçenekleri.',
    price: 48650,
    category: LIFEPO4_CATEGORY,
    stock: 25,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '48v-100ah-wall', label: '48V 100Ah Duvar Tipi (Ekranlı)', price: 50890, sku: 'GU48100WT' },
      { key: '48v-100ah-metal', label: '48V 100Ah Metal Kasa', price: 48650, sku: 'GU48100YS' },
      { key: '51v2-50ah-hv', label: '51.2V 50Ah HV (High Voltage)', price: 41270, sku: 'GU51050HV' },
      { key: '51v2-100ah-hv', label: '51.2V 100Ah HV (High Voltage)', price: 50690, sku: 'GU51100HV' },
      { key: '51v2-100ah-lv', label: '51.2V 100Ah LV (Low Voltage)', price: 51065, sku: 'GU51100LV' },
      { key: '51v2-280ah-lv', label: '51.2V 280Ah LV (Trinity2)', price: 126665, sku: 'GU51280LV' },
      { key: '51v2-314ah-lv', label: '51.2V 314Ah LV (Trinity3)', price: 127715, sku: 'GU51314LV' },
    ],
    tags: ['48V', '51.2V', 'HV', 'LV', 'Depolama'],
    specifications: {
      'Çevrim Ömrü': '6000-8000 Cycle',
      'Montaj': 'Duvar / Raf (Rack)',
    },
  },
  // ----- Off-Grid İnverterler -----
  {
    id: 'orbit-off-grid-sinus-inverterler',
    brand: 'ORBİT',
    image: '/images/products/orbit-6-2kw-offgrid-parallel-1.png',
    sku: 'ORBIT-OFFGRID-VAR',
    name: 'ORBİT Tam Sinüs Off-Grid İnverter Serisi',
    description: 'LiFePO4 uyumlu, yüksek verimli tam sinüs inverterler. Paralel bağlantı ve aküsüz çalışma desteği.',
    price: 17735,
    category: OFFGRID_CATEGORY,
    stock: 40,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '6-2kw-parallel', label: '6.2 kW (12 Cihaz Paralellenebilir)', price: 19830, sku: 'M6200-48PL' },
      { key: '6-2kw-std', label: '6.2 kW Standart (Paralel Olmayan)', price: 17735, sku: 'M6200-48' },
      { key: 'srp-5kw-lv', label: 'SRP 5 kW Monofaze LV', price: 20465, sku: 'SRP-5K-LV' },
    ],
    tags: ['Off-Grid', 'Tam Sinüs', 'Paralel'],
    specifications: {
      'PV Giriş': 'Maks. 500 VDC',
      'MPPT': '120A dahili',
    },
  },
  // ----- Hibrit İnverterler -----
  {
    id: 'deye-hibrit-inverter-serisi',
    brand: 'DEYE',
    image: '/images/products/deye-12kw-trifaze-hybrid-1.jpg',
    sku: 'DEYE-HYBRID-VAR',
    name: 'DEYE Hibrit İnverter Serisi (5 kW - 80 kW)',
    description: 'Dünya lideri DEYE hibrit teknolojisi. Monofaze ve trifaze, yüksek ve düşük voltaj batarya desteği.',
    price: 63000,
    category: HYBRID_CATEGORY,
    stock: 20,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '5kw-mf', label: '5 kW Monofaze', price: 63000, sku: 'SUN-5K-SG01' },
      { key: '8kw-mf', label: '8 kW Monofaze', price: 99750, sku: 'SUN-8K-SG01' },
      { key: '12kw-tf', label: '12 kW Trifaze', price: 136500, sku: 'SUN-12K-SG04' },
      { key: '20kw-tf-hv', label: '20 kW Trifaze HV', price: 144665, sku: 'SUN-20K-HV' },
      { key: '25kw-tf-hv', label: '25 kW Trifaze HV', price: 172665, sku: 'SUN-25K-HV' },
      { key: '50kw-tf-hv', label: '50 kW Trifaze HV', price: 344165, sku: 'SUN-50K-HV' },
      { key: '80kw-tf-hv', label: '80 kW Trifaze HV', price: 450660, sku: 'SUN-80K-HV' },
    ],
    tags: ['DEYE', 'Hibrit', 'Trifaze', 'Monofaze', 'HV'],
    specifications: {
      'Garanti': '5 Yıl',
      'Verimlilik': '%97.6',
    },
  },
  {
    id: 'srp-hibrit-inverter-serisi',
    brand: 'SRP',
    image: '/images/products/srp-6kw-monofaze-hybrid-lv-1.png',
    sku: 'SRP-HYBRID-VAR',
    name: 'SRP Hibrit İnverter Serisi',
    description: 'Yüksek akım taşıma kapasiteli, LV ve HV seçenekli hibrit inverterler.',
    price: 69200,
    category: HYBRID_CATEGORY,
    stock: 15,
    featured: false,
    isVariantProduct: true,
    variants: [
      { key: '6kw-lv', label: '6 kW Monofaze LV', price: 69200, sku: 'SRP-6K-LV' },
      { key: '15kw-tf-lv', label: '15 kW Trifaze LV', price: 174530, sku: 'SRP-15K-LV' },
      { key: '30kw-tf-hv', label: '30 kW Trifaze HV', price: 240730, sku: 'SRP-30K-HV' },
    ],
    tags: ['SRP', 'Hibrit', 'LV', 'HV'],
  },
]
