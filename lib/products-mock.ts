/**
 * Mock ürün listesi - ana sayfa ve ürün listesi sayfasında kullanılır.
 */

export interface MockProduct {
  id: string
  sku: string
  name: string
  description: string
  price: number
  oldPrice?: number
  discount?: number
  rating?: number
  reviews?: number
  image?: string
  category: string
  stock: number
  featured: boolean
  isVariantProduct: boolean
  tags?: string[]
  /** SEO ve satış odaklı kısa slogan */
  slogan?: string
  /** Detay sayfası "Açıklama" sekmesinde gösterilen uzun metin */
  fullDescription?: string
  /** Öne çıkan özellikler listesi (madde işaretli) */
  features?: string[]
  /** Garanti metni (örn. "15 Yıl Ürün, 30 Yıl Performans Garantisi") */
  warranty?: string
  /** Model / kapasite bilgisi (örn. "108TNFB10: 415-450Wp") */
  models?: string
  /** Teknik özellikler key-value (detay sayfası Teknik Özellikler sekmesi) */
  specifications?: Record<string, string>
  /** Ürün markası (görüntüleme için) */
  brand?: string
  /** Detay sayfası galerisi (yoksa product.image kullanılır) */
  images?: string[]
  /** Varyant bazlı galeri (her varyant için ayrı görsel listesi; indeks variants sırasıyla eşleşir) */
  imagesByVariant?: string[][]
  /** Ürün seçenekleri (örn. model/varyant); sepette ayrı kalem, fiyat seçeneğe göre. specifications varsa o varyant seçiliyken özellikler ona göre gösterilir. */
  variants?: { key: string; label: string; price: number; sku?: string; specifications?: Record<string, string> }[]
  /** Açıklama sekmesinde açılır/kapanır (accordion) bölümler; yoksa fullDescription tek blok gösterilir */
  descriptionSections?: { title: string; content: string }[]
  /** Aynı değere sahip ürünler detay sayfasında "Diğer seçenekler" olarak listelenir (örn. farklı renk aynı model) */
  productFamilyKey?: string
  /** Varyantlı ürünlerde sayfa açıldığında seçili olacak varyant key (örn. kablo renkleri için uzunluğa göre farklı varsayılan) */
  defaultVariantKey?: string
}

/** Güneş paneli ürünü görüntülenirken önerilecek tamamlayıcı ürün ID'leri (şarj kontrol, inverter, mobil güç) */
export const COMPLEMENTARY_PRODUCT_IDS_SOLAR: string[] = [
  'tommatech-sarj-kontrol-au-scc',
  'tommatech-micro-s-800w',
  'tommatech-mobil-guc-istasyonu',
]

/** Hibrit inverter ürünü görüntülenirken önerilecek aksesuarlar (Smart Meter, Dongle, EPS Box) */
export const COMPLEMENTARY_PRODUCT_IDS_HYBRID: string[] = [
  'tommatech-smart-meter',
  'tommatech-wifi-lan-4g-dongle',
  'tommatech-eps-box',
]

/** Taşınabilir güç istasyonu sayfasında önerilecek katlanabilir güneş panelleri */
export const COMPLEMENTARY_PRODUCT_IDS_MOBILE_POWER: string[] = [
  'tommatech-katlanabilir-200wp',
  'tommatech-katlanabilir-110wp',
]

/** Ev tipi yüksek voltaj batarya sayfasında önerilecek (Booster Paralel Box) */
export const COMPLEMENTARY_PRODUCT_IDS_EV_BATTERY: string[] = [
  'tommatech-booster-paralel-box',
]

/** Isı pompası sayfasında önerilecek tesisat tamamlayıcıları (Fan Coil, Boyler) */
export const COMPLEMENTARY_PRODUCT_IDS_HEAT_PUMP: string[] = [
  'tommatech-fan-coil-unitesi',
  'tommatech-akumulasyon-tanki',
]

/** EV şarj sayfasında önerilecek (Solar Carport) */
export const COMPLEMENTARY_PRODUCT_IDS_EV_CHARGING: string[] = [
  'tommatech-solar-carport',
  'tommatech-solar-carport-2car',
]

/** Tarımsal Solar Sulama sayfasında önerilecek (Güneş Panelleri, Wi-Fi Dongle) */
export const COMPLEMENTARY_PRODUCT_IDS_IRRIGATION: string[] = [
  'tommatech-m10-topcon-dark-n-type',
  'tommatech-wifi-lan-4g-dongle',
]

/** Eksik ürün görselleri için placeholder (404/400 hatalarını önler). */
export const PLACEHOLDER_PRODUCT_IMAGE = '/images/products/placeholder.png'

/**
 * Placeholder görselli ürünler – sitede gizlenir (liste ve detayda gösterilmez).
 * Liste: docs/placeholder-gorsel-urunler.md
 */
export const PLACEHOLDER_PRODUCT_IDS: string[] = [
  'hims-3ps-tasinabilir-sarj',
  'hims-7ps-tasinabilir-sarj',
  'hims-11ps-tasinabilir-sarj',
  'hims-22ps-tasinabilir-sarj',
  'emma-d01-duvar-aski-aparati',
  'mock-ac-arac-sarj-istasyonu',
  'emma-arac-sarj-zemin-montaj-standlari',
  'hims-hcc2l-c2l-adaptorleri',
  'pufusu-sarj-istasyonu-yonetim-yazilimi',
  'mock-tip2-sarj-kablosu',
  'mock-lifepo4-12v-100ah',
  'mock-batarya-modulu-51v',
  'mock-inverter-sistemi-5kva',
  'orbit-24v-150ah-abs',
]

/**
 * Manuel olarak görsel/özellik eklenen ürünlerin id listesi.
 * Apply script (elektromarketim) bu id'lerdeki ürünlerin SKU'larına dokunmaz.
 * Admin veya dokümantasyon için "manuel ürünler" listesi olarak kullanılabilir.
 */
export const MANUAL_PRODUCT_IDS: string[] = [
  'hims-hcdkb-22',
  'hims-hctk-22-g-tf',
  'hims-emev-22-3f32-pt2',
  'hims-emef-22t2-sb-5-cnt',
  'hims-hcv2l-01',
  'hims-hcv2l-02',
  'hims-hcv2l-03',
  'hims-hcv2l-31',
  'hims-hcv2l-32',
  'hims-hcv2l-33',
  'hims-hcc2l-13',
  'hims-hcca-tm32-30-f',
  'hims-hcca-tm16-30-f',
  'hims-emef-22t2-sb-3',
  'hims-emef-22t2-sb-8',
]

/** TommaTech ürünlerinden public/images/products/ altında gerçek dosyası olanlar. Diğerleri placeholder kullanır. */
const TOMATECH_IDS_WITH_IMAGE = [
  'tommatech-m10-topcon-dark-n-type',
  'tommatech-m10-topcon-full-black-sizdirmaz',
  'tommatech-katlanabilir-200wp',
  'tommatech-katlanabilir-110wp',
]

/** Kategoriye göre tamamlayıcı ürünler – tek şablon için (başlık, açıklama, ürün ID listesi; isteğe bağlı banner) */
export const COMPLEMENTARY_BY_CATEGORY: Record<string, { title: string; description: string; productIds: string[]; banner?: string }> = {
  'Güneş Panelleri': {
    title: 'Bu ürünle birlikte alın',
    description: 'Güneş panelinizi tam verimle kullanmak için şarj kontrol cihazı, inverter veya taşınabilir güç istasyonu ile tamamlayabilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_SOLAR,
  },
  'Hibrit İnverterler': {
    title: 'Birlikte alınanlar',
    description: 'Hibrit sisteminizi tam verimle yönetmek için akıllı sayaç, uzaktan izleme ve acil güç aksesuarlarını ekleyebilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_HYBRID,
    banner: 'Bu inverteri uzaktan izleyebilmek için Dongle almayı unutmayın! Elektrik kesintisinde evinizin karanlıkta kalmaması için EPS Box ekleyin.',
  },
  'Taşınabilir Güç Kaynakları': {
    title: 'Birlikte alınanlar',
    description: 'Taşınabilir güç istasyonunuzu doğada şarj etmek için katlanabilir çanta tipi güneş panelleri ile tamamlayabilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_MOBILE_POWER,
  },
  'Lityum Aküler': {
    title: 'Birlikte alınanlar',
    description: 'Kapasite artırımında bataryaları paralel ve güvenli şekilde bağlamak için Booster Paralel Box (çoklayıcı kutu) ile tamamlayabilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_EV_BATTERY,
  },
  'Isı Pompası ve HVAC': {
    title: 'Tesisat tamamlayıcıları',
    description: 'Isı pompası sisteminizi fan coil üniteleri ve akümülasyon tankı / boyler ile tamamlayabilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_HEAT_PUMP,
  },
  'AC Şarj İstasyonları': {
    title: 'Birlikte incele',
    description: 'Aracınızı güneşin altında değil, şık ve teknolojik bir yapı altında şarj etmek için Solar Carport (güneş panelli otopark) sistemlerini inceleyebilirsiniz.',
    productIds: COMPLEMENTARY_PRODUCT_IDS_EV_CHARGING,
  },
}

const mockProductsBase: MockProduct[] = [
  // —— 6. GÜNEŞ PANELLERİ ——
  {
    id: 'tommatech-550wp-m10-perc-144pm',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-550-144PM',
    name: '550Wp TommaTech Lowe-H Serisi M10 PERC 144PM Half-Cut',
    description: 'Yüksek verimli M10 hücre teknolojisi ile üretilen TommaTech 550Wp güneş paneli. PERC teknolojisi ile yüksek enerji yoğunluğu.',
    category: 'Güneş Panelleri',
    price: 5200,
    stock: 100,
    featured: true,
    isVariantProduct: false,
    tags: ['M10', 'PERC', '550Wp', 'Half-Cut'],
    specifications: {
      'Hücre Tipi': 'M10 Monokristal',
      'Teknoloji': 'PERC',
      'Hücre Sayısı': '144',
      'Güç': '550Wp',
      'Garanti': '15 Yıl Ürün / 30 Yıl Performans'
    },
  },
  {
    id: 'tommatech-410wp-m10-perc-black',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-410-108PM-S-B',
    name: '410Wp TommaTech Lowe-B Serisi M10 PERC 108PM-S Half-Cut Black (Beyaz Arka Folye – Siyah Çerçeve)',
    description: '410Wp TommaTech M10 PERC Half-Cut Black güneş paneli. Estetik siyah çerçeve tasarımı.',
    category: 'Güneş Panelleri',
    price: 4100,
    stock: 80,
    featured: false,
    isVariantProduct: false,
    tags: ['M10', 'PERC', '410Wp', 'Black Frame'],
    specifications: {
      'Hücre Tipi': 'M10 Monokristal',
      'Teknoloji': 'PERC',
      'Hücre Sayısı': '108',
      'Güç': '410Wp',
      'Çerçeve': 'Siyah',
      'Garanti': '15 Yıl Ürün / 25 Yıl Performans'
    },
  },
  {
    id: 'tommatech-410wp-m10-perc-all-black',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-410-108PM-S-AB',
    name: '410Wp TommaTech Lowe-B Serisi M10 PERC 108PM-S Half-Cut All Black',
    description: 'Tamamen siyah tasarımı ile estetik ve yüksek verimli 410Wp TommaTech güneş paneli.',
    category: 'Güneş Panelleri',
    price: 4500,
    stock: 60,
    featured: true,
    isVariantProduct: false,
    tags: ['M10', 'PERC', '410Wp', 'All Black'],
    specifications: {
      'Hücre Tipi': 'M10 Monokristal',
      'Tasarım': 'All Black',
      'Güç': '410Wp',
      'Garanti': '15 Yıl Ürün / 30 Yıl Performans'
    },
  },
  {
    id: 'tommatech-570wp-topcon-144pm-t',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-570-144PM-T',
    name: '570Wp TommaTech Lowe-i Serisi TOPCON 144PM-T Half-Cut',
    description: 'Yeni nesil TOPCON teknolojisi ile 570Wp yüksek güç kapasiteli TommaTech güneş paneli.',
    category: 'Güneş Panelleri',
    price: 5800,
    stock: 50,
    featured: false,
    isVariantProduct: false,
    tags: ['TOPCON', '570Wp', 'Half-Cut'],
    specifications: {
      'Hücre Tipi': 'TOPCON Monokristal',
      'Güç': '570Wp',
      'Hücre Sayısı': '144',
      'Garanti': '15 Yıl Ürün / 25 Yıl Performans'
    },
  },
  {
    id: 'tommatech-450wp-m10-perc-144pm-r',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-450-144PM-R',
    name: '450Wp TommaTech M10 PERC 144PM Half-Cut Lowe-R',
    description: 'Çatı uygulamaları için optimize edilmiş Lowe-R serisi 450Wp güneş paneli.',
    category: 'Güneş Panelleri',
    price: 4300,
    stock: 45,
    featured: false,
    isVariantProduct: false,
    tags: ['Lowe-R', 'Çatı Tipi', 'M10'],
    specifications: {
      'Hücre Tipi': 'M10 Monokristal',
      'Güç': '450Wp',
      'Kullanım': 'Çatı Tipi',
      'Garanti': '15 Yıl Ürün / 25 Yıl Performans'
    },
  },
  {
    id: 'tt-standart-serisi',
    brand: 'TommaTech',
    image: '/images/products/tommatech-m10-topcon-dark-n-type.jpg',
    sku: 'TT-STD-VAR',
    name: 'TommaTech Standart Güneş Paneli',
    description: 'Küçük ve orta ölçekli enerji ihtiyaçları için ideal TommaTech Standart serisi güneş panelleri. Bağ evleri, aydınlatma ve küçük sistemler için.',
    category: 'Güneş Panelleri',
    price: 450,
    stock: 200,
    featured: false,
    isVariantProduct: true,
    variants: [
      { key: '10w', label: '10W', price: 450, sku: 'TT-STD-10' },
      { key: '20w', label: '20W', price: 850, sku: 'TT-STD-20' },
      { key: '50w', label: '50W', price: 1850, sku: 'TT-STD-50' },
      { key: '100w', label: '100W', price: 2850, sku: 'TT-STD-100' },
      { key: '200w', label: '200W', price: 4200, sku: 'TT-STD-200' },
    ],
    tags: ['Küçük Sistemler', 'Aydınlatma', 'Bağ Evi'],
    specifications: {
      'Tip': 'Polikristal / Monokristal',
      'Garanti': '2 Yıl Ürün'
    },
  },
  {
    id: 'tt-esnek-serisi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/9_tommatech-170-110wp-flexibleesnek-gunes-paneli-serisi.webp',
    sku: 'TT-ESNEK-VAR',
    name: 'TommaTech Esnek Güneş Paneli',
    description: 'Marin ve karavan uygulamaları için hafif ve bükülebilir TommaTech Esnek serisi güneş panelleri.',
    category: 'Güneş Panelleri',
    price: 3800,
    stock: 70,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '110w', label: '110W', price: 3800, sku: 'TT-FLEX-110' },
      { key: '170w', label: '170W', price: 5400, sku: 'TT-FLEX-170' },
    ],
    tags: ['Marin', 'Karavan', 'Esnek', 'Hafif'],
    specifications: {
      'Hücre Tipi': 'IBC',
      'Kalınlık': '3 mm',
      'Garanti': '2 Yıl Ürün'
    },
  },
  {
    id: 'tommatech-lite-katlanabilir-serisi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/11_tommatech-easy-life-katlanir-gunes-paneli.jpg',
    sku: 'TT-LITE-FOLD-VAR',
    name: 'TommaTech Lite Serisi Katlanabilir Güneş Panelleri',
    description: 'Doğa tutkunları için taşınabilir, Lite serisi katlanabilir güneş panelleri. 120Wp ve 200Wp seçenekleri.',
    category: 'Taşınabilir Paneller',
    price: 4200,
    stock: 40,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: '120w', label: '120Wp (4x30Wp)', price: 4200, sku: 'TT-LITE-120' },
      { key: '200w', label: '200Wp (4x50Wp)', price: 5900, sku: 'TT-LITE-200' },
    ],
    tags: ['Taşınabilir', 'Kamp', 'Katlanabilir', 'Lite Serisi'],
    specifications: {
      'Tip': 'Taşınabilir / Katlanabilir',
      'Seri': 'Lite Serisi',
      'Konnektör': 'MC4 / XT60',
      'Garanti': '2 Yıl Ürün'
    },
  },
  // —— 2. İNVERTERLER VE ŞARJ CİHAZLARI ——
  // 2.1 ON-GRID
  {
    id: 'tommatech-micro-s-800w',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1490_tommatech-micro-s-800w-tek-faz-inverter_0.jpg',
    sku: 'TT-MICRO-S-800',
    name: 'TommaTech Micro S Serisi Mikro İnverter (800W)',
    slogan: 'Balkon ve Küçük Çatı Sistemleri İçin Tak-Çalıştır Akıllı Çözüm!',
    description: 'Geleneksel ve yeni nesil yüksek güçlü panellerle tam uyumlu, 800 VA\'ya kadar çıkış sunan 2\'si 1 arada mikro inverter. Dahili Wi-Fi ile akıllı telefondan anlık izleme. Kompakt, tak-çalıştır kurulum.',
    fullDescription: 'Geleneksel ve yeni nesil yüksek güçlü güneş panelleriyle tam uyumlu çalışan TommaTech Micro S Serisi, 800 VA\'ya kadar olağanüstü güç çıkışı sunan popüler bir 2\'si 1 arada mikro inverter çözümüdür. Dahili Wi-Fi teknolojisi sayesinde ekstra bir donanıma ihtiyaç duymadan sisteminizi akıllı telefonunuzdan anlık olarak izleyebilirsiniz. Kompakt yapısı ve tak-çalıştır (Plug/Play) özelliği ile kurulumu son derece kolaydır.',
    features: [
      '2 bağımsız MPPT ve 2 panel dizisi girişi ile gölgelenmede bile maksimum üretim.',
      'IP67 tam sızdırmazlık; dış mekan koşullarına tam dayanım.',
      'Entegre Wi-Fi ile TommaTech Portal, App ve Web üzerinden kesintisiz takip.',
      'Doğal soğutma (fansız sessiz çalışma), geniş sıcaklık aralığı.',
    ],
    warranty: '10 Yıl Ürün Garantisi.',
    specifications: { 'Maksimum çıkış': '800 VA', 'MPPT': '2 bağımsız', 'Koruma': 'IP67', 'Garanti': '10 yıl' },
    price: 8500,
    category: 'Mikro İnverter',
    stock: 30,
    featured: true,
    isVariantProduct: false,
    tags: ['Mikro inverter', 'IP67', 'Wi-Fi'],
  },
  {
    id: 'tommatech-uno-atom',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/41_tommatech-uno-atom-tek-faz-dizi-06-36-inverter-serisi.jpg',
    sku: 'TT-UNO-ATOM',
    name: 'TommaTech Uno Atom Serisi Tek Fazlı String İnverter (0.6 - 3.6 kW)',
    slogan: 'Küçük İnverter, Büyük Performans!',
    description: 'Ev tipi küçük GES için özel tasarım. Sadece 50V başlangıç voltajı ile sabahın ilk ışıklarından itibaren üretim. %98 maksimum verimlilik, IP65, 6 kg kompakt tasarım. 0.6 kW\'dan 3.6 kW\'a 9 kapasite modeli.',
    fullDescription: 'TommaTech Uno Atom string inverterler, en küçük alanlara kurulabilir ve performanstan ödün vermez. %98 verimlilik ve piyasada öncü 50V başlangıç voltajı ile PV çözümünüzden azami enerjiyi alırsınız; kurulum iç mekanda veya dış mekanda olsun fark etmez.',
    features: [
      '50V düşük başlangıç voltajı ile daha uzun saatler enerji üretimi.',
      'IP65 dış mekana uygun, suya ve toza dayanıklı dizayn.',
      'Küçük ve hafif: 6 kg, kompakt tasarım.',
      'Uzaktan izleme (Remote Monitoring) imkânı.',
      'Yüksek verimlilik: %98\'e varan dönüşüm.',
      '0.6 kW\'dan 3.6 kW\'a kadar 9 farklı kapasite modeli.',
    ],
    warranty: '10 Yıl Garanti (5 Yıl Ürün + 5 Yıl Yedek Parça).',
    specifications: { 'Güç aralığı': '0.6 - 3.6 kW', 'Başlangıç voltajı': '50V', 'Koruma': 'IP65', 'Ağırlık': '6 kg' },
    price: 12000,
    category: 'Hibrit İnverterler',
    stock: 25,
    featured: true,
    isVariantProduct: false,
    tags: ['Monofaze', 'Küçük sistem'],
  },
  {
    id: 'tommatech-uno-home',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/44_tommatech-uno-home-tek-faz-dizi-30-60-inverter-serisi.jpg',
    sku: 'TT-UNO-HOME',
    name: 'TommaTech Uno Home Serisi Monofaze İnverter (3.0 - 6.0 kW)',
    description: 'Orta ve büyük ölçekli evsel projeler için kalite ve verimliliği buluşturan Uno Home Serisi. 70V–580V geniş MPPT voltaj aralığı, %97.8\'e varan verimlilik. 2 MPPT / 2 dizi, doğal soğutma, IP66.',
    features: [
      'Çift MPPT: Farklı yönlere bakan çatı sistemleri için 2 MPPT / 2 dizi girişi.',
      '%97.8\'e varan dönüştürme verimliliği.',
      'İç fan gerektirmeyen doğal soğutma, IP66 koruma.',
    ],
    specifications: { 'Güç aralığı': '3.0 - 6.0 kW', 'MPPT voltaj': '70V - 580V', 'Verimlilik': '%97.8 max', 'Koruma': 'IP66' },
    price: 22000,
    category: 'Hibrit İnverterler',
    stock: 20,
    featured: false,
    isVariantProduct: false,
    tags: ['Monofaze', 'Ev tipi'],
  },
  {
    id: 'tommatech-trio-atom-plus-k',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/64_tommatech-trio-atom-k-serisi-uc-faz-dizi-30-150-inverterler.png',
    sku: 'TT-TRIO-ATOM-PLUS-K',
    name: 'TommaTech Trio Atom K ve Trio Plus K Serisi Trifaze İnverterler',
    slogan: 'Ticari ve Büyük Evsel Projelerde Kesintisiz Üç Faz Gücü!',
    description: 'Trifaze altyapıya sahip konut ve ticari işletmeler için. Trio Atom K (3–15 kW) %98.5 verimlilik; Trio Plus K (8–30 kW) 1100V PV girişi ile yüksek güçlü panellere tam uyum. 2 veya 3 MPPT, 6 diziye kadar.',
    fullDescription: 'Trifaze (3 faz) elektrik altyapısına sahip konutlar ve ticari işletmeler için tasarlanmıştır. Trio Atom K serisi (3-15 kW) %98.5\'e varan verimlilik sunarken; daha büyük kapasiteli Trio Plus K serisi (8-30 kW), pazar lideri 1100V PV giriş voltajı ile çok yüksek güçlü güneş panellerine tam uyum sağlar.',
    features: [
      '3.0 kW\'dan 30.0 kW\'a kadar esnek model yelpazesi.',
      '2 veya 3 MPPT ile 6 diziye kadar panel bağlama (Trio Plus K).',
      'Geniş sıcaklık aralığı, IP66, akıllı fan/doğal soğutma.',
    ],
    specifications: { 'Trio Atom K': '3 - 15 kW', 'Trio Plus K': '8 - 30 kW', 'PV giriş (Plus K)': '1100V', 'Koruma': 'IP66' },
    price: 45000,
    category: 'Hibrit İnverterler',
    stock: 12,
    featured: true,
    isVariantProduct: false,
    tags: ['Trifaze', 'Ticari'],
  },
  // 2.2 HYBRID
  {
    id: 'tommatech-uno-hybrid-k',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/69_tommatech-uno-hybrid-k-serisi-tek-faz-30-75kw-inverterler.jpg',
    sku: 'TT-UNO-HYBRID-K',
    name: 'TommaTech Uno Hybrid K Serisi Monofaze Hibrit İnverter (3.0 - 7.5 kW)',
    slogan: 'Gündüz Üretin, Gece Kullanın: Evinizin Akıllı Enerji Yöneticisi!',
    description: 'Fazla güneş enerjisini lityum bataryalara depolayıp gece veya kesintide kullanmanızı sağlayan Uno Hybrid K. %97.6 verimlilik, EPS çıkışı, BMS haberleşmeli lityum uyumluluk. 90V başlama, 600V max PV, 2 MPPT.',
    fullDescription: 'Güneş panellerinizden gelen fazla enerjiyi lityum bataryalara (akülere) depolayarak gece veya elektrik kesintilerinde kullanmanızı sağlayan Uno Hybrid K Serisi, %97.6 verimlilikle çalışır. Tak-çalıştır kolaylığı sunan cihaz, gelişmiş enerji çıkış kontrolü sayesinde öz tüketiminizi maksimize eder.',
    features: [
      'EPS (Acil Güç): Şebeke kesildiğinde kritik yüklerinizi bataryadan beslemeye devam eder.',
      'Lider lityum-iyon batarya çözümleriyle %100 uyumlu, BMS haberleşmeli yapı.',
      '90V düşük başlama, 600V maksimum PV dizi voltajı, 2 MPPT desteği.',
    ],
    specifications: { 'Güç aralığı': '3.0 - 7.5 kW', 'Verimlilik': '%97.6', 'MPPT': '2', 'EPS': 'Var' },
    price: 35000,
    category: 'Hibrit İnverterler',
    stock: 18,
    featured: true,
    isVariantProduct: false,
    tags: ['Hibrit', 'Batarya', 'EPS'],
  },
  {
    id: 'tommatech-trio-hybrid-k',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/70_tommatech-trio-hybrid-k-serisi-uc-faz-50-150kw-inverterler.jpg',
    sku: 'TT-TRIO-HYBRID-K',
    name: 'TommaTech Trio Hybrid K Serisi Trifaze Hibrit İnverter (5.0 - 15.0 kW)',
    description: 'Konut ve ticari yüksek güç ihtiyacı için. Tek cihazda 46 kWh, paralelde 460 kWh\'ye kadar depolama. Faz dengeleme (dengesiz faz çıkış) özelliği. 10 adede kadar paralel (150 kW).',
    features: [
      '10 adede kadar inverter paralel bağlanarak 150 kW\'a kadar büyütme.',
      'Yüksek voltaj (HV) lityum batarya desteği, BMS çift koruma kalkanı.',
      'Faz dengesizliği (Phase Stabilisation) ayarı.',
    ],
    specifications: { 'Güç aralığı': '5.0 - 15.0 kW', 'Depolama (tek)': '46 kWh', 'Paralel depolama': '460 kWh max' },
    price: 72000,
    category: 'Hibrit İnverterler',
    stock: 10,
    featured: false,
    isVariantProduct: false,
    tags: ['Trifaze', 'Hibrit'],
  },
  {
    id: 'tommatech-trio-hybrid-lv-f',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/115_tommatech-f-serisi-uc-faz-150-200kw-lv-hibrit-inverter.jpg',
    sku: 'TT-TRIO-HYBRID-LV-F',
    name: 'TommaTech Trio Hybrid LV F Serisi Düşük Voltaj Trifaze İnverter (15 kW - 20 kW)',
    slogan: 'Düşük Voltaj Bataryalarla Büyük Güç Elde Edin!',
    description: '48V düşük voltaj (LV) batarya sistemleri ile çalışan LV F Serisi. 15 kW ve 20 kW seçenekleri. 280A ve 350A\'ya varan şarj/deşarj akımı. Jeneratör desteği, SolarMan uygulaması ile uzaktan izleme.',
    fullDescription: 'Pazardaki 48V düşük voltaj (Low Voltage) batarya sistemleri ile çalışmak üzere özel olarak üretilen LV F Serisi, 15 kW ve 20 kW seçenekleriyle esnek ve güvenli bir ticari/büyük konut çözümüdür. Jeneratör desteği ve SolarMan uygulaması üzerinden uzaktan izleme özelliği içerir.',
    features: [
      '48V sistem voltajı ile tam uyum, 280A ve 350A\'ya varan şarj/deşarj akımı.',
      'Paralel bağlantı imkanı ile kapasite artırımı.',
      'Şebeke veya Jeneratör giriş desteği.',
    ],
    specifications: { 'Güç': '15 kW / 20 kW', 'Batarya voltajı': '48V', 'Max akım': '280A / 350A' },
    price: 95000,
    category: 'Hibrit İnverterler',
    stock: 8,
    featured: false,
    isVariantProduct: false,
    tags: ['Düşük voltaj', 'Trifaze'],
  },
  {
    id: 'tommatech-trio-hybrid-m-50kw',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1491_tommatech-trio-hybrid-m-50w-uc-faz-inverter_0.jpg',
    sku: 'TT-TRIO-M-50',
    name: 'TommaTech Trio Hybrid M Serisi Endüstriyel İnverter (50 kW)',
    slogan: 'Fabrikanız ve İşletmeniz İçin Dev Enerji Depolama Çözümü!',
    description: 'Büyük ölçekli endüstriyel ve ticari projeler için 50 kW kapasite. 4 MPPT, 8 dizi girişi. Yüksek gerilimli lityum batarya, 100A şarj/deşarj. 10 adede kadar paralel. Jeneratör ve şebeke senkronu.',
    fullDescription: 'Büyük ölçekli endüstriyel ve ticari projeler için tasarlanan 50 kW kapasiteli Trio Hybrid M Serisi, 4 bağımsız MPPT girişi ile çatınızdaki potansiyeli sonuna kadar kullanır. Yüksek gerilimli lityum bataryalar ile çalışan bu dev sistem, 10 adede kadar paralel bağlanarak bir fabrikanın tüm yükünü sırtlayabilir.',
    features: [
      '50 kW AC güç, 100A şarj/deşarj akımı.',
      '4 MPPT ve toplam 8 dizi (array) bağlama kapasitesi.',
      'Şebeke kesintilerinde jeneratör adaptasyonu ve kesintisiz yedekleme.',
    ],
    specifications: { 'Güç': '50 kW', 'MPPT': '4 (8 dizi)', 'Şarj/Deşarj': '100A', 'Paralel': '10 adet' },
    price: 185000,
    category: 'Hibrit İnverterler',
    stock: 5,
    featured: true,
    isVariantProduct: false,
    tags: ['Endüstriyel', '50 kW'],
  },
  // 2.3 OFF-GRID
  {
    id: 'tommatech-offgrid-new-pro-plus',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/46_tommatech-new-serisi-1-5kw-off-grid-inverterler.jpg',
    sku: 'TT-OFG',
    name: 'TommaTech Off-Grid Akıllı İnverter Serisi (New, New Pro, Plus)',
    slogan: 'Şebekenin Ulaşmadığı Yerde Kontrol Sizde!',
    description: 'Dağ evi, bağ evi, karavan veya şebekenin olmadığı tüm mekanlar için tam bağımsız enerji. Güneş paneli, akü ve gerektiğinde jeneratör arasında köprü. New (1K/3K/5K), New Pro (1.2K/3K/5K, BMS, Wi-Fi opsiyonel), Plus (4K/7K/11K).',
    fullDescription: 'Dağ evleri, bağ evleri, karavanlar veya şebeke bağlantısının olmadığı tüm mekanlar için tam bağımsız enerji çözümleri. TommaTech Off-Grid (Şebekeden Bağımsız) İnverterler, güneş paneli, akü ve gerektiğinde jeneratör arasında mükemmel bir köprü kurar.\n\nNew Serisi: 1K, 3K, 5K modelleri. New Pro Serisi: Lityum BMS haberleşmesi, 1200W/3000W/5000W, opsiyonel Wi-Fi. Plus Serisi: 4K, 7K, 11K yüksek güç.',
    features: [
      'New: Başlangıç seviyesi, ekranlı temel off-grid (1K, 3K, 5K).',
      'New Pro: Lityum BMS haberleşmesi, Wi-Fi ile akıllı telefondan izleme.',
      'Plus: 4K, 7K, 11K yüksek güçlü modeller.',
    ],
    models: 'New: 1K, 3K, 5K. New Pro: 1.2K, 3K, 5K (Wi-Fi opsiyonel). Plus: 4K, 7K, 11K.',
    specifications: { 'New': '1K / 3K / 5K', 'New Pro': '1.2K / 3K / 5K', 'Plus': '4K / 7K / 11K' },
    price: 18000,
    category: 'Off-Grid İnverterler',
    stock: 22,
    featured: true,
    isVariantProduct: false,
    tags: ['Off-Grid', 'Bağ evi', 'Karavan'],
  },
  // 2.4 ŞARJ KONTROL
  {
    id: 'tommatech-sarj-kontrol-au-scc',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/417_tommatech-60a-122448v-mppt-sarj-kontrol-cihazi_0.jpg',
    sku: 'TT-AU-SCC',
    name: 'TommaTech Güneş Paneli Şarj Kontrol Cihazları (AU ve SCC Serisi)',
    description: 'Marin, karavan, esnek ve katlanabilir mobil panel sistemlerinde güneş voltajını düzenleyerek aküleri güvenle şarj eden hayati üniteler. VS3024AU (PWM, USB, LCD) ve SSC-19-MPPT60 (MPPT %99 verim, 12/24/48V, 60A) modelleri.',
    fullDescription: 'Marin, karavan, esnek panel (Flexible) ve katlanabilir (Foldable) mobil panel sistemlerinde, güneşten gelen voltajı düzenleyerek akülerinizi güvenle şarj etmenizi sağlayan hayati üniteler.\n\nVS3024AU Serisi (PWM): USB çıkış (5V 2.4A), LCD ekran; kampçılar ve karavanlar için pratik. SSC-19-MPPT60 Serisi (MPPT): %99\'a varan takip verimliliği, 12V/24V/48V otomatik tanıma, 60A.',
    features: [
      'VS3024AU (PWM): USB portları (5V 2.4A), LCD ekran, kamp ve karavan için pratik.',
      'SSC-19-MPPT60 (MPPT): %99 takip verimliliği, 12/24/48V otomatik, 60A.',
    ],
    models: 'VS3024AU Serisi (PWM). SSC-19-MPPT60 Serisi (MPPT, 60A, 12/24/48V).',
    specifications: { 'PWM model': 'VS3024AU (USB, LCD)', 'MPPT model': 'SSC-19-MPPT60, 60A', 'MPPT verim': '%99' },
    price: 2400,
    category: 'Enerji Yönetimi',
    stock: 55,
    featured: true,
    isVariantProduct: false,
    tags: ['Şarj kontrol', 'PWM', 'MPPT'],
  },
  // —— 3. ENERJİ DEPOLAMA VE BATARYALAR ——
  // 3.1 EV TİPİ YÜKSEK VOLTAJ
  {
    id: 'tommatech-hightech-lifepo4-3kwh',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/73_tommatech-hightech-power-serisi-lityum-bataryalar.png',
    sku: 'TT-HV-LFP-3',
    name: 'TommaTech HighTech Power LiFePO4 Lityum Batarya (3.0 kWh)',
    slogan: 'Hibrit Sistemleriniz İçin Kesintisiz ve Güvenli Depolama!',
    description: 'Evinizdeki güneş enerjisi sistemiyle tam uyumlu yüksek voltajlı (HV) lityum depolama. 3.1 kWh net kapasite, LiFePO4 teknolojisi ile maksimum güvenlik ve elektrik kesintilerinde kesintisiz enerji. 4 adede kadar seri bağlantı ile 12.0 kWh\'e kadar genişletme.',
    fullDescription: 'TommaTech HighTech Power serisi, evinizdeki güneş enerjisi sistemiyle tam uyumlu çalışan yüksek voltajlı (High Voltage) lityum depolama çözümüdür. 3.1 kWh net depolama kapasitesine sahip olan bu modüller, yeni nesil LiFePO4 (Lityum Demir Fosfat) teknolojisi sayesinde hem eviniz için maksimum güvenlik sunar hem de elektrik kesintilerinde hayatınızın kesintisiz devam etmesini sağlar.',
    features: [
      '4 adede kadar bataryayı seri bağlayarak 12.0 kWh kapasiteye ulaşma.',
      '6000 döngü ömrü ile yıllarca performans kaybı yaşamadan kullanım.',
      '%90 deşarj derinliği (DOD) ile depoladığınız enerjinin tamamına yakınını kullanma.',
      '102V nominal voltaj, 30A şarj/deşarj akımı kapasitesi.',
      'Toza ve suya karşı IP65 koruma sınıfı.',
    ],
    warranty: '10 Yıl Ürün Garantisi.',
    specifications: { 'Net kapasite': '3.1 kWh', 'Nominal voltaj': '102V', 'Şarj/Deşarj': '30A', 'DOD': '%90', 'Koruma': 'IP65', 'Seri genişletme': '12.0 kWh\'e kadar' },
    price: 32000,
    category: 'Batarya Modülleri',
    stock: 25,
    featured: true,
    isVariantProduct: false,
    tags: ['LiFePO4', 'HV', '10 yıl garanti'],
  },
  {
    id: 'tommatech-hightech-5-8kwh-booster',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/73_tommatech-hightech-power-serisi-lityum-bataryalar.png',
    sku: 'TT-HV-5.8-GP',
    name: 'TommaTech HighTech Power Lityum Batarya (5.8 kWh) & Booster Paralel Box',
    slogan: 'Enerjinizi Katlayın, Özgürlüğü Hissedin!',
    description: 'Geniş evler ve villalar için 5.8 kWh depolama kapasiteli ana batarya modülü (General Pack). Ek bataryalar (Booster Pack) ve Booster Paralel Kutusu ile 23 kWh\'ye kadar kapasite artırımı. 115V nominal, LiFePO4, 6000 döngü, akıllı BMS.',
    fullDescription: 'Daha yüksek enerji tüketimi olan geniş evler ve villalar için tasarlanmış 5.8 kWh depolama kapasiteli ana batarya modülüdür (General Pack). İhtiyacınız arttığında, sisteme ekleyeceğiniz ek bataryalar (Booster Pack) ve Booster Paralel Kutusu ile sistem kapasitenizi kolayca çoklayabilirsiniz.',
    features: [
      'General Pack\'e 3 adede kadar Booster Pack ekleyerek 23 kWh\'ye varan depolama.',
      'Bataryaların dengeli şarj-deşarj olmasını sağlayan entegre Akıllı BMS.',
      '115V nominal gerilim, LiFePO4 güvenliği, 6000 döngü çalışma ömrü.',
    ],
    models: 'Ana modül: 5.8 kWh (General Pack). Kapasite artırımı: Booster Pack + Booster Paralel Box ile 23 kWh\'ye kadar.',
    specifications: { 'Ana kapasite': '5.8 kWh', 'Max genişletme': '23 kWh', 'Nominal voltaj': '115V', 'Döngü': '6000' },
    price: 48000,
    category: 'Batarya Modülleri',
    stock: 18,
    featured: true,
    isVariantProduct: false,
    tags: ['5.8 kWh', 'Booster', 'Genişletilebilir'],
  },
  {
    id: 'tommatech-prizmatik-51-2v-high-capacity',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1309_tommatech-moduler-serisi-512v-102ah-g2-lfp-lityum-batarya_0.webp',
    sku: 'TT-BTR-P-51.2V',
    name: 'TommaTech 51.2V Prizmatik Serisi Lityum Bataryalar (High Capacity)',
    description: 'Marin, karavan ve ev tipi yedekleme sistemleri için geliştirilmiş, tek modülde devasa kapasiteler sunan 51.2V gerilimli prizmatik lityum serisi.',
    fullDescription: 'Marin, karavan ve ev tipi yedekleme sistemleri için geliştirilmiş 51.2V prizmatik lityum serisi. 102Ah modelleri 5222.4 Wh nominal depolama; 280Ah model tek modülde 14.336 Wh (14.3 kWh) ile büyük projeler ve yüksek tüketimli ticari araç/tekne uygulamaları için ideal.',
    features: [
      'BTR-P-51.2V-102Ah & 102Ah-R: 5222.4 Wh nominal enerji depolama, 102Ah kompakt 51.2V güç.',
      'BTR-P-51.2V-280Ah: Tek modülde 14.336 Wh (14.3 kWh) enerji depolama; büyük projeler ve yüksek tüketimli ticari araçlar/tekneler için rakipsiz çözüm.',
    ],
    models: 'BTR-P-51.2V-102Ah, BTR-P-51.2V-102Ah-R (5222.4 Wh). BTR-P-51.2V-280Ah (14.336 Wh / 14.3 kWh).',
    specifications: { 'Voltaj': '51.2V', '102Ah': '5222.4 Wh nominal', '280Ah': '14.336 Wh (14.3 kWh)', 'Uygulama': 'Marin, karavan, ev yedekleme' },
    price: 32000,
    category: 'Batarya Modülleri',
    stock: 12,
    featured: true,
    isVariantProduct: false,
    tags: ['51.2V', 'Prizmatik', 'High Capacity'],
  },
  // 3.2 MARİN/KARAVAN DÜŞÜK VOLTAJ
  {
    id: 'tommatech-prizmatik-marin-karavan',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1565_tommatech-marine-abs-kasa-batarya-128v-100ah-lfp-lityum-batarya_0.webp',
    sku: 'TT-BTR-P',
    name: 'TommaTech Prizmatik Serisi Marin ve Karavan Lityum Bataryaları (12.8V / 25.6V)',
    slogan: 'Karavanda, Teknede, Doğada: Kurşun Akülere Veda Edin!',
    description: 'Jel/kurşun-asit akülere veda. Yüksek enerji yoğunluğu, uzun ömür ve darbelere dayanıklı metal kasa ile tekne ve karavan için yeni nesil düşük voltaj lityum bataryalar. 8000 döngü, Al-Cu baralar, BMS balans.',
    fullDescription: 'Eski nesil, ağır ve kısa ömürlü jel/kurşun-asit akülerinizi unutun. TommaTech Yeni Nesil Düşük Voltaj Lityum Bataryalar; yüksek enerji yoğunluğu, muazzam kalitesi ve uzun ömrüyle teknenizin ve karavanınızın vazgeçilmezi olacak. Darbelere dayanıklı metal kasası ile zorlu seyahatleriniz için özel olarak üretilmiştir.',
    features: [
      '8000 defaya varan şarj-deşarj döngü ömrü (kullanım şartlarına bağlı).',
      'Alüminyum-Bakır (Al-Cu) alaşımlı iletken baralar ile paralel bağlantıda performans kaybı yok.',
      'Isı sensörlü, dengeleyici (balancing) BMS ve darbelere dayanıklı metal dış kasa.',
      '12.8V-102Ah, 12.8V-204Ah, 25.6V-102Ah, 25.6V-204Ah modelleri.',
    ],
    models: 'BTR-P-12.8V-102Ah, 12.8V-204Ah, 25.6V-102Ah, 25.6V-204Ah.',
    specifications: { 'Voltaj': '12.8V / 25.6V', 'Kapasite': '102Ah / 204Ah', 'Döngü': '8000\'e kadar', 'Kasa': 'Metal, darbe dayanımlı' },
    price: 18500,
    category: 'Lityum Aküler',
    stock: 40,
    featured: true,
    isVariantProduct: false,
    tags: ['Marin', 'Karavan', 'LiFePO4'],
  },
  // 3.3 TAŞINABİLİR GÜÇ İSTASYONLARI
  {
    id: 'tommatech-mobil-guc-istasyonu',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1598_tommatech-kolay-yasam-serisi-512wh-tasinabilir-guc-kaynagi_0.jpg',
    sku: 'TT-MPS',
    name: 'TommaTech Yeni Nesil Mobil Taşınabilir Güç İstasyonları (Power Station)',
    slogan: 'Şebekeden Uzakta Konforu Yaşayın: Her Yerde Priziniz Yanınızda!',
    description: 'Kamp, karavan veya acil kesintide priz enerjisi çantanızda. Katlanabilir panellerle güneşten doğrudan şarj. Laptop, TV, mini buzdolabı, elektrikli aletler. 500W, 1200W ve 2400W model seçenekleri ile.',
    fullDescription: 'Kamp kurarken, karavanınızda mola verirken veya acil elektrik kesintilerinde ihtiyacınız olan priz enerjisi artık çantanızda! TommaTech Taşınabilir Güç İstasyonları, katlanabilir güneş panelleriyle güneşten doğrudan şarj edilebilen, üzerine laptop, televizyon, mini buzdolabı hatta elektrikli aletleriniz doğrudan takıp çalıştırabileceğiniz kompakt bir mucizedir.',
    features: [
      '2000W AC giriş ile prizden 1 saatte %100 tam dolum.',
      'Entegre MPPT ile katlanabilir panelden (240W–1000W) güneşten bedava şarj.',
      'Monomer lamine hücre: uzun ömür, minimum ısınma, düşük iç direnç.',
      '220V AC, Type-C, USB-A, DC 5525, araç çakmaklık portu.',
      'Bluetooth/Wi-Fi mobil uygulama ile cep telefonundan yönetim.',
    ],
    models: '500W / 1200W / 2400W',
    specifications: { 'AC şarj': '2000W', 'Güneş girişi': 'MPPT, 240W-1000W' },
    price: 28500,
    category: 'Taşınabilir Güç İstasyonları',
    stock: 22,
    featured: true,
    isVariantProduct: true,
    variants: [
      {
        key: '500w',
        label: 'MGI-R-500W (512Wh)',
        price: 28500,
        sku: 'MGI-R-500W',
        specifications: {
          'Kapasite': '512Wh',
          'Sürekli Güç': '500W',
          'Ağırlık': '7.5 kg',
          'Hücre Tipi': 'LiFePO4',
        },
      },
      {
        key: '1200w',
        label: 'MGI-V-1200W-PLS (1030Wh)',
        price: 46500,
        sku: 'MGI-V-1200W-PLS',
        specifications: {
          'Kapasite': '1030Wh',
          'Sürekli Güç': '1200W',
          'Ağırlık': '11.5 kg',
          'Hücre Tipi': 'LiFePO4',
        },
      },
      {
        key: '2400w',
        label: 'MGI-V-2400W-PLS (2400Wh)',
        price: 78500,
        sku: 'MGI-V-2400W-PLS',
        specifications: {
          'Kapasite': '2400Wh',
          'Sürekli Güç': '2400W',
          'Ağırlık': '22 kg',
          'Hücre Tipi': 'LiFePO4',
        },
      },
    ],
    tags: ['Taşınabilir', 'Kamp', 'Güneş şarj'],
  },
  // 3.4 ENDÜSTRİYEL ESS
  {
    id: 'tommatech-endustriyel-ess-kabin',
    brand: 'TommaTech',
    image: '/images/products/kabin.webp',
    sku: 'TT-ESS-CAB',
    name: 'TommaTech Kabin Tipi Endüstriyel Enerji Depolama Sistemleri (ESS Cabinet)',
    slogan: 'Fabrikanızın Enerji Bağımsızlığını Güvence Altına Alın!',
    description: 'Ticari işletmeler, fabrikalar ve büyük tarımsal tesisler için tek parça bütüncül çözüm. İçinde inverter, lityum hücreler, BMS ve soğutma/yangın sistemleri. ESS-TT-KB-60KWH-M50K (50 kW, 60 kWh) ve ESS-TT-232KWH-100KW-LC (232.9 kWh) modelleri.',
    fullDescription: 'Yüksek enerji tüketimine sahip ticari işletmeler, fabrikalar ve büyük tarımsal tesisler için tek parça bütüncül çözüm! İçerisinde inverter, lityum batarya hücreleri, batarya yönetim sistemi ve soğutma/yangın sistemlerini barındıran bu endüstriyel kabinler ile işletmenizi elektrik kesintilerine ve yüksek faturalara karşı koruyun.',
    features: [
      'Dahili yangın söndürme (Aerosol) sistemi, gaz ve duman detektörleri.',
      'Black Start: Şebeke çöktüğünde sistemi güneş veya batarya ile sıfırdan başlatma.',
      'IP55 / IP67 kabin koruma, akıllı iklimlendirme/soğutma.',
      '1C/1C performansı: Hızlı şarj ve deşarj ihtiyacına anında tepki.',
    ],
    models: 'ESS-TT-KB-60KWH-M50K: 50 kW inverter, 60 kWh batarya (paralel ile 500 kW / 600 kWh). ESS-TT-232KWH-100KW-LC: 232.9 kWh LFP (280Ah hücreler).',
    price: 400000,
    category: 'Enerji Depolama Sistemleri',
    stock: 3,
    featured: true,
    isVariantProduct: true,
    variants: [
      {
        key: '60kwh',
        label: '60 kWh (ESS-TT-KB-60KWH-M50K) – 50 kW, 60 kWh',
        price: 400000,
        sku: 'ESS-TT-KB-60KWH-M50K',
        specifications: {
          'Model': 'ESS-TT-KB-60KWH-M50K',
          'İnverter gücü': '50 kW',
          'Batarya kapasitesi': '60 kWh',
          'Paralel genişletme': '500 kW / 600 kWh\'e kadar',
          'Koruma': 'IP55/IP67',
          'Black Start': 'Var',
          'Yangın söndürme': 'Dahili Aerosol',
        },
      },
      {
        key: '232kwh',
        label: '232 kWh (ESS-TT-232KWH-100KW-LC) – 232.9 kWh LFP, 100 kW',
        price: 650000,
        sku: 'ESS-TT-232KWH-100KW-LC',
        specifications: {
          'Model': 'ESS-TT-232KWH-100KW-LC',
          'İnverter gücü': '100 kW',
          'Batarya kapasitesi': '232.9 kWh LFP',
          'Hücre': '280Ah',
          'Koruma': 'IP55/IP67',
          'Black Start': 'Var',
          'Yangın söndürme': 'Dahili Aerosol',
        },
      },
    ],
    tags: ['Endüstriyel', 'ESS', 'Kabin'],
  },
  // —— 4. ISI POMPALARI VE ELEKTRİKLİ ARAÇ ŞARJ ——
  // 4.1 ISI POMPALARI
  {
    id: 'tommatech-r290-dc-inverter-isi-pompasi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/118_tommatech-24-83kw-power-serisi-isi-pompalari.jpg',
    sku: 'TT-HP-R290',
    name: 'TommaTech R290 DC İnverter Monoblok Isı Pompası',
    slogan: 'Doğal Enerji ile Üstün Performans, Aşırı Soğukta Bile Endişesiz!',
    description: 'Isıtma, soğutma ve kullanım sıcak suyu tek sistemde. Çevre dostu R290 doğal gaz, -25°C ile +43°C aralığında yüksek performans. Güneş enerjisi ile tam uyum (SG-Ready & PV-Ready). 48 dB(A) ultra sessiz, A+++, akıllı Defrost, Wi-Fi/IoT.',
    fullDescription: 'Geleceğin evinde güç sizin elinizde! TommaTech Power Serisi R290 Isı Pompası, ısıtma, soğutma ve kullanım sıcak suyu ihtiyaçlarınızı tek bir sistemde buluşturur. Çevre dostu R290 doğal gazı kullanan bu premium cihaz, -25°C ile +43°C gibi çok geniş ve zorlu bir sıcaklık aralığında bile yüksek performansından ödün vermez. Güneş enerjisi sisteminizle doğrudan entegre çalışarak faturalarınızı sıfırlamanıza yardımcı olur.',
    features: [
      'SG-Ready & PV-Ready: Güneş paneli fazlasıyla öncelikli bedava su ısıtma.',
      'Ultra sessiz: Titreşim sönümleyici, ses emici PU sünger, 48 dB(A).',
      'A+++ enerji sınıfı, akıllı buz çözme (Defrost).',
      'Wi-Fi, IoT bulut, 15 dil dokunmatik panel ile anlık izleme.',
    ],
    models: '8.3 kW (220V/1 Faz), 14.8 kW, 18.2 kW ve 24.0 kW (380V/3 Faz).',
    specifications: { 'Kapasiteler': '8.3 / 14.8 / 18.2 / 24.0 kW', 'Sıcaklık': '-25°C / +43°C', 'Ses': '48 dB(A)', 'Enerji': 'A+++' },
    price: 95000,
    category: 'Isı Pompası ve HVAC',
    stock: 12,
    featured: true,
    isVariantProduct: false,
    tags: ['R290', 'Monoblok', 'PV-Ready'],
  },
  {
    id: 'tommatech-split-evi-dc-inverter',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1175_tommatech-13kw-isi-pompasimonofaze_0.jpg',
    sku: 'TT-HP-EVI-SPLIT',
    name: 'TommaTech Split Tasarım EVI DC İnverter Isı Pompası',
    slogan: 'İç ve Dış Ünite Mükemmel Uyumu, -30°C\'de Bile Maksimum Konfor!',
    description: 'Avrupa standartları için özel tasarım. Dış ünite + şık vidasız iç ünite. Yerden ısıtma, radyatör ve fan coil ile uyumlu. Panasonic DC İnverter kompresör, A+++, COP 4.65\'e varan. EVI teknolojisi ile -30°C\'de kesintisiz ısıtma. 5 akıllı mod.',
    fullDescription: 'Avrupa standartları için özel olarak tasarlanan TommaTech Split Isı Pompası; evin dışına kurulan dış ünite ve içine yerleştirilen şık iç üniteden (vidasız modern tasarım) oluşur. Yerden ısıtma sistemleri, radyatörler ve fan coiller ile tam uyumlu çalışır.',
    features: [
      'Panasonic DC İnverter kompresör: A+++ verimlilik, COP 4.65\'e varan.',
      'EVI teknolojisi ile -30°C\'de kesintisiz ısıtma.',
      '5 akıllı mod: Hızlı, Akıllı, Sessiz, Tatil vb.',
    ],
    models: 'HP-TT-8/12-R32-MF-IC, HP-TT-18/22-R32-MF-IC (iç). 12 kW\'dan 22 kW\'a Monofaze/Trifaze dış ünite.',
    specifications: { 'Dış ünite': '12–22 kW', 'İç ünite': '8/12/18/22 kW', 'Min. çalışma': '-30°C', 'COP': '4.65\'e varan' },
    price: 78000,
    category: 'Isı Pompası ve HVAC',
    stock: 14,
    featured: true,
    isVariantProduct: false,
    tags: ['Split', 'EVI', 'Panasonic'],
  },
  {
    id: 'tommatech-havuz-isi-pompasi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory/125_havuz-isi-pompalari_0.jpg',
    sku: 'TT-HP-POOL',
    name: 'TommaTech Havuz Tipi Isı Pompası',
    slogan: 'Havuz Keyfinizi Dört Mevsime Taşıyın!',
    description: 'Havuz suyunu ideal sıcaklıkta tutan, sessiz inverter havuz ısı pompası. DC Twin Rotary kompresör: 3 kat düşük kalkış akımı, %20 güç ile yumuşak kalkış. 32 dB(A) fısıltı sessizliği. R32 çevre dostu gaz.',
    fullDescription: 'Havuzunuzun konfor şartlarını sağlarken sessizliği ile varlığını unutturan TommaTech Havuz Isı Pompası, akıllı inverter teknolojisiyle elektrik tesisatınızı yormadan suyu ideal sıcaklıkta tutar.',
    features: [
      'DC Twin Rotary: ON/OFF\'a göre 3 kat düşük kalkış akımı, %20 güç yumuşak kalkış.',
      'Özel ses yalıtım ceketi ile 32 dB(A) sessizlik.',
      'R32 yüksek verimli, çevre dostu soğutucu gaz.',
    ],
    models: 'HP-POL-MF-R32-21-N-M1 (21 kW Monofaze), HP-POL-TF-R32-28-N-M1 (28 kW Trifaze).',
    specifications: { 'Monofaze': '21 kW', 'Trifaze': '28 kW', 'Ses': '32 dB(A)' },
    price: 58000,
    category: 'Isı Pompası ve HVAC',
    stock: 8,
    featured: false,
    isVariantProduct: false,
    tags: ['Havuz', 'DC Inverter', 'Sessiz'],
  },
  {
    id: 'tommatech-endustriyel-isi-pompasi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/81_tommatech-26-16kw-isi-pompalaritrifaze.jpg',
    sku: 'TT-HP-EVI-IND',
    name: 'TommaTech Endüstriyel & Ticari Isı Pompası Çözümleri',
    description: 'Otel, AVM, hastane ve fabrikalar için merkezi soğutma ve yerden ısıtma (kazan/kombi alternatifi). EVI teknolojili endüstriyel ısı pompaları. Monoblok EVI: 16/20/26 kW. Dev seri: 45, 86, 168 kW (HP-EVI-TT-IND). -25°C\'ye kadar performans.',
    features: [
      'Monoblok EVI: 16 kW, 20 kW, 26 kW – büyük villa ve küçük işletme.',
      'Endüstriyel dev seri: 45 kW, 86 kW, 168 kW – -25°C\'ye kadar ticari çözüm.',
    ],
    models: 'Monoblok EVI: 16/20/26 kW. HP-EVI-TT-IND Serisi: 45, 86, 168 kW.',
    specifications: { 'Monoblok': '16 / 20 / 26 kW', 'Endüstriyel': '45 / 86 / 168 kW', 'Min. sıcaklık': '-25°C' },
    price: 185000,
    category: 'Isı Pompası ve HVAC',
    stock: 5,
    featured: false,
    isVariantProduct: false,
    tags: ['Endüstriyel', 'EVI', 'Ticari'],
  },
  // 4.2 ELEKTRİKLİ ARAÇ (EV) ŞARJ
  {
    id: 'tommatech-ev-ac-dc-sarj',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1259_tommatech-trio-22kw-uc-faz400v-ac-elektrikli-arac-sarj-unitesi-kablosuz_0.jpg',
    sku: 'TT-EV-AC-DC',
    name: 'TommaTech Akıllı AC & DC Elektrikli Araç Şarj Cihazları',
    slogan: 'Güneşin Gücünü Aracınıza Aktarın, Sınırları Kaldırın!',
    description: 'EV\'inizi evde, sitede veya işletmede en hızlı ve güvenli şekilde şarj edin. Uno, Trio, Likya AC Serisi ve DC Hızlı Şarj; güneş enerjisi ile senkronize, Alman mühendisliği. Solar entegrasyon, TommaTech Portal ve uygulama, yıldırım ve aşırı akım koruması, OCPP 1.6J.',
    fullDescription: 'Elektrikli aracınızı (EV) evinizde, sitenizde veya işletmenizde en hızlı ve en güvenli şekilde şarj edin. TommaTech Uno, Trio, Likya AC Serisi ve DC Hızlı Şarj Cihazları, üstün Alman mühendisliği ile güneş enerjisi sisteminizle senkronize çalışacak şekilde dizayn edilmiştir.',
    features: [
      'Güneş entegrasyonu: Panel fazlasını doğrudan araca, %100 bedava şarj.',
      'TommaTech Portal ve mobil uygulama ile anlık takip, programlama.',
      'Dahili yıldırım koruması, aşırı akım/voltaj korumaları.',
      'OCPP 1.6J ile şarj ağları ve ticari ödeme sistemlerine entegrasyon.',
    ],
    warranty: '2 Yıl Kapsamlı Ürün Garantisi.',
    specifications: { 'Tipler': 'AC (Uno/Trio/Likya) + DC Hızlı Şarj', 'Solar': 'Entegre', 'OCPP': '1.6J', 'Garanti': '2 yıl' },
    price: 45000,
    category: 'AC Şarj İstasyonları',
    stock: 18,
    featured: true,
    isVariantProduct: false,
    tags: ['EV', 'AC/DC', 'Solar'],
  },
  {
    id: 'tommatech-ac-sarj-7-4kw',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1259_tommatech-trio-22kw-uc-faz400v-ac-elektrikli-arac-sarj-unitesi-kablosuz_0.jpg',
    sku: 'TT-EV-AC-7.4',
    name: 'AC Tipi Elektrikli Araç Şarj İstasyonu (7.4 kW)',
    description: 'Ev tipi kullanım için ideal, 7.4 kW monofaze akıllı şarj istasyonu. Güneş enerjisi entegrasyonu ile bedava şarj imkanı.',
    fullDescription: 'TommaTech 7.4 kW AC şarj istasyonu, evinizdeki monofaze altyapı ile tam uyumlu çalışır. Akıllı telefon uygulaması üzerinden kontrol edilebilir, güneş panellerinizden gelen fazla enerjiyle aracınızı şarj edebilir.',
    features: ['7.4 kW Monofaze şarj.', 'Solar entegrasyon (SG-Ready).', 'Mobil uygulama ve Wi-Fi.', 'Dinamik yük dengeleme.'],
    specifications: { 'Güç': '7.4 kW', 'Faz': '1 Faz 230V', 'Akım': '32A', 'Koruma': 'IP65' },
    price: 32000,
    category: 'AC Şarj İstasyonları',
    stock: 15,
    featured: false,
    isVariantProduct: false,
    tags: ['7.4 kW', 'Monofaze', 'Smart'],
  },
  {
    id: 'tommatech-ev-sarj-kablosu',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1211_tommatech-22kw-type2-32a-5m-arac-sarj-kablosu_0.jpg',
    sku: 'EVCTT-TF-CBL-TIP2',
    name: 'TommaTech EV Şarj Kablosu (Tip 2 – Tip 2)',
    description: 'Elektrikli araç ile şarj ünitesi arasında güvenli veri ve güç aktarımı. Avrupa standardı Tip 2\'den Tip 2\'ye. 22 kW hızlı şarj, Trifaze 32A. 5 m uzunluk, esnek ve dayanıklı beyaz kılıf. 2 yıl garanti.',
    features: [
      'Tip 2 – Tip 2 Avrupa standardı.',
      '22 kW yüksek hızlı şarj, Trifaze 32A.',
      '5 m uzunluk, zorlu doğa koşullarına dayanıklı beyaz kılıf.',
    ],
    warranty: '2 Yıl Garanti.',
    specifications: { 'Model': 'EVCTT-TF-CBL-TIP2', 'Güç': '22 kW', 'Faz': '3 Faz 32A', 'Uzunluk': '5 m' },
    price: 4200,
    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 65,
    featured: false,
    isVariantProduct: false,
    tags: ['EV', 'Tip 2', 'Şarj kablosu'],
  },

  // —— Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları – Hims HCDKB-22 (Beyaz / Siyah) ——
  {
    id: 'hims-hcdkb-22',
    brand: 'Hims',
    image: '/images/products/hcdkb-22-7.jpg',
    images: [
      '/images/products/hcdkb-22-7.jpg',
      '/images/products/hcdkb-22-1.jpg',
      '/images/products/hcdkb-22-2.jpg',
      '/images/products/hcdkb-22-3.jpg',
      '/images/products/hcdkb-22-4.jpg',
      '/images/products/hcdkb-22-5.jpg',
      '/images/products/hcdkb-22-6.jpg',
      '/images/products/hcdkb-22-8.jpg',
      '/images/products/hcdkb-22-9.jpg',
      '/images/products/hcdkb-22-10.jpg',
      '/images/products/hcdkb-22-11.jpg',
    ],
    /** Beyaz: 8 görsel; Siyah: 3 görsel sıra 2-3-1 (10, 11, 9) */
    imagesByVariant: [
      ['/images/products/hcdkb-22-7.jpg', '/images/products/hcdkb-22-1.jpg', '/images/products/hcdkb-22-2.jpg', '/images/products/hcdkb-22-3.jpg', '/images/products/hcdkb-22-4.jpg', '/images/products/hcdkb-22-5.jpg', '/images/products/hcdkb-22-6.jpg', '/images/products/hcdkb-22-8.jpg'],
      ['/images/products/hcdkb-22-10.jpg', '/images/products/hcdkb-22-11.jpg', '/images/products/hcdkb-22-9.jpg'],
    ],
    sku: 'HCDKB-22',
    name: '22kW Tip 2 Soketli Kablolu Beyaz Smart Elektrikli Araç Şarj İstasyonu',
    slogan: 'Duvar Tipi 22 kW Akıllı Şarj; Beyaz veya Siyah Gövde, 5 m Kablo. Tüm elektrikli araç modelleri ile uyumlu.',
    description: 'NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Şık tasarımı, akıllı kontrol sistemleri ve 22kW güç kapasitesiyle HCDKB-22, bireysel kullanıcılar için geliştirilmiş bir elektrikli araç şarj istasyonu modelidir. Beyaz veya siyah seçenek; 5 m kablo dahil, RFID, LCD ekran, mobil uygulama ve OCPP 1.6J desteği.',
    fullDescription: `NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR.

Şık tasarımı, akıllı kontrol sistemleri ve 22kW güç kapasitesiyle HCDKB-22, bireysel kullanıcılar için geliştirilmiş bir elektrikli araç şarj istasyonu modelidir.

Yüksek performanslı Hims HCDKB-22 elektrikli araba şarj cihazı, duvara sabitlenebilir bir yapıdadır. Duvar askı aparatı ile şarj istasyonu kolayca sabitlenebilir ve kullanım sonrasında kablonun düzenli bir şekilde yerleştirilmesini sağlar.

Type 2 soket desteği, Avrupa standartlarındaki tüm elektrikli araçlarla uyumludur. Her türlü Type 2 girişli araca uyum sağlayan araç şarj cihazı, 5 metrelik güçlü kablo ile üretilmektedir.

Akıllı kontrol sistemi, istasyonu mobil uygulama ile kontrol etmenizi sağlar ve 22kW güce kadar destek sunar. Beyaz veya siyah rengi ve küçük boyutu ile her alana uyum sağlayan HCDKB-22, kolay anlaşılan menüsü sayesinde kolaylıkla kontrol edilebilir.

RFID Kart Okuyucu ve LCD Ekran ile aracınızı şarj etmek artık çok daha kolay ve güvenli. RFID kart sistemi sayesinde kişisel şarj işlemlerinizi güven içinde gerçekleştirebilir, LCD ekran üzerinden şarj sürecini takip edebilirsiniz. Acil stop butonu ile acil durumlarda şarj işlemi tek tuşla hızlı şekilde durdurulabilir.

Mobil Uygulama Desteği: Uygulama üzerinden şarj programlaması yapılabilir. Uzaktan şarj başlatma ve durdurma fonksiyonları sayesinde tam kontrol sağlanır. Şarj geçmişi mobil uygulama üzerinden görüntülenebilir.

Kullanıcı Dostu Arayüz: %100 Türkçe menü desteğiyle kolay kullanım sunar. Hata kodları ve şarj planlamaları Türkçe olarak görüntülenebilir.

Kompakt ve Estetik Tasarım: Küçük ve sade formuyla dekoratif görünüme sahiptir. 18x18x7cm ölçüleri ile alandan tasarruf sağlar. Type 2 soket uyumluluğu ile Avrupa standartlarındaki tüm araçlarla kullanılabilir.

Yüksek Güvenlik ve Koruma: Aşırı akım, düşük ve yüksek gerilim koruması ile sistem güvenliği artırılmıştır. Topraklama kontrolü ve Type B RCMU kaçak akım izleme desteği bulunur. IP65 koruma sınıfı, toza ve suya karşı direnç gösterir.`,
    features: [
      'Tüm elektrikli araç modelleri ile uyumlu (Tip 2 soket).',
      '22 kW güç; monofaze 7.4 kW / trifaze 22 kW.',
      '5 m kablo dahil (5x6mm²+1x0,75mm² H07BZ5-F).',
      'Mobil uygulama ile şarj programlama, uzaktan başlatma/durdurma ve şarj geçmişi.',
      '%100 Türkçe menü, hata kodları ve şarj planlamaları.',
      'RFID kart okuyucu ve LCD ekran.',
      'Acil stop butonu; Type B RCMU (AC 30mA+DC 6mA) kaçak akım izleme.',
      'IP65 koruma; -30°C ~ 65°C çalışma sıcaklığı.',
      'OCPP 1.6J (Wi‑Fi 2.4GHz ile); WiFi / Bluetooth.',
      'Kompakt boyut: 18 x 18 x 7 cm.',
    ],
    warranty: 'Ürün garantisi için satıcı ile iletişime geçiniz.',
    specifications: {
      'Faz Sayısı': 'Monofaze / Trifaze',
      'Ürün Modeli': 'HCDK-22-B',
      'Nominal Gerilim': 'AC 240V(Monofaze)/AC 400V(Trifaze) 50-60Hz',
      'Çıkış Akımı': 'min. 6A - max. 32A',
      'Maksimum Çıkış Gücü': 'Monofaze için 7.4kW - Trifaze için 22kW',
      'Kablo Özelliği': '5x6mm²+1x0,75mm² - H07BZ5-F',
      'Standart': 'IEC 61851',
      'Sertifika': 'CE, RoHS',
      'Led Göstergeler': 'Var',
      'Kaçak Akım İzleme (RCMU)': 'Type B (AC 30mA+DC 6mA)',
      'Akım Ayarı': 'Var',
      'RFID': 'Var',
      'Wifi / Bluetooth': 'Var (wifi 2.4GHz)',
      'OCPP 1.6J': 'Var (Wifi ile)',
      'Koruma Derecesi': 'IP65',
      'Çalışma Sıcaklığı': '-30°C ~ 65°C',
      'Nem': '≤95%RH',
      'Maksimum Çalışma Yüksekliği': '≤2000m',
      'Soğutma': 'Doğal Soğutma',
      'Beklemede Kullandığı Güç': '<5w',
      'Boyut': '18 x 18 x 7 cm',
    },
    price: 34000,
    variants: [
      { key: 'beyaz', label: 'HCDKB-22 Beyaz', price: 34000, sku: 'HCDKB-22' },
      { key: 'siyah', label: 'HCDKS-22 Siyah', price: 34000, sku: 'HCDKS-22' },
    ],
    category: 'AC Şarj İstasyonları',
    stock: 30,
    featured: true,
    isVariantProduct: true,
    productFamilyKey: 'HCDKB-22',
    tags: ['Hims', 'HCDKB-22', 'HCDKS-22', 'Duvar tipi', '22 kW', 'Tip 2', 'Smart', 'RFID', 'OCPP'],
  },

  // —— HCDKB-22 Siyah (ayrı ürün; listelenir, beyaz ile productFamilyKey ile bağlı) ——
  {
    id: 'hims-hcdkb-22-siyah',
    brand: 'Hims',
    image: '/images/products/hcdkb-22-10.jpg',
    images: ['/images/products/hcdkb-22-10.jpg', '/images/products/hcdkb-22-11.jpg', '/images/products/hcdkb-22-9.jpg'],
    sku: 'HCDKS-22',
    name: '22kW Tip 2 Soketli Kablolu Siyah Smart Elektrikli Araç Şarj İstasyonu',
    slogan: 'Duvar Tipi 22 kW Akıllı Şarj; Siyah Gövde, 5 m Kablo.',
    description: 'NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Hims HCDKB-22 siyah versiyonu. 22kW, 5 m kablo dahil, RFID, LCD ekran, mobil uygulama ve OCPP 1.6J.',
    fullDescription: `NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Şık siyah tasarımı, akıllı kontrol sistemleri ve 22kW güç kapasitesiyle HCDKB-22 Siyah, bireysel kullanıcılar için geliştirilmiş bir elektrikli araç şarj istasyonu modelidir. 5 m kablo dahil, RFID, LCD ekran, mobil uygulama ve OCPP 1.6J desteği.`,
    features: [
      'Tüm elektrikli araç modelleri ile uyumlu (Tip 2 soket).',
      '22 kW güç; monofaze 7.4 kW / trifaze 22 kW.',
      '5 m kablo dahil.',
      'Mobil uygulama, RFID, LCD ekran.',
      'IP65 koruma; -30°C ~ 65°C çalışma sıcaklığı.',
    ],
    warranty: 'Ürün garantisi için satıcı ile iletişime geçiniz.',
    specifications: {
      'Faz Sayısı': 'Monofaze / Trifaze',
      'Ürün Modeli': 'HCDK-22-B',
      'Nominal Gerilim': 'AC 240V(Monofaze)/AC 400V(Trifaze) 50-60Hz',
      'Çıkış Akımı': 'min. 6A - max. 32A',
      'Maksimum Çıkış Gücü': 'Monofaze için 7.4kW - Trifaze için 22kW',
      'Koruma Derecesi': 'IP65',
      'Çalışma Sıcaklığı': '-30°C ~ 65°C',
    },
    price: 34000,
    category: 'AC Şarj İstasyonları',
    stock: 30,
    featured: true,
    isVariantProduct: false,
    productFamilyKey: 'HCDKB-22',
    tags: ['Hims', 'HCDKB-22', 'HCDKS-22', 'Duvar tipi', '22 kW', 'Tip 2', 'Smart', 'RFID', 'OCPP'],
  },

  // —— Elektromarketim Duvar Tipi Şarj İstasyonu (Elektromarketim kategorisi) ——
  {
    id: 'elektromarketim-emev-22-3f32-pt2',
    brand: 'Elektromarketim',
    image: '/images/products/emev-1.png',
    images: [
      '/images/products/emev-1.png',
      '/images/products/emev-2.png',
      '/images/products/emev-3.png',
      '/images/products/emev-5.jpg',
      '/images/products/emev-519748-11-K.png',
    ],
    sku: 'EMEV-22-3F32-PT2',
    name: '22kW 3 Faz 32A Tip 2 Soketli Elektrikli Araç Şarj İstasyonu',
    slogan: 'Tüm elektrikli araç modelleri ile uyumlu; 22kW/11kW/7.2kW, RFID ve LCD ekran.',
    description: 'TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Monofaze ve Trifaze bağlantı; 22kW / 11kW / 7.2kW güç. LCD ekran, RFID kart ile kişisel kullanım. İç ve dış mekân kullanımına uygun, 2 yıl garantili. Elektromarketim.com üretimi.',
    fullDescription: `TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Monofaze ve Trifaze bağlantı; 22kW / 11kW / 7.2kW güç. LCD ekran, RFID kart ile kişisel kullanım. İç ve dış mekân kullanımına uygun, 2 yıl garantili. Ürün paketine araç şarj kablosu dahil değildir; opsiyonel kablo seçeneklerine ürün sayfasından ulaşabilirsiniz.`,
    descriptionSections: [
      {
        title: 'Ürün Hakkında',
        content: `Elektromarketim tarafından üretilen wallbox tipi şarj istasyonu, 22kW gücünde 380V (trifaze) 32A besleme ile elektrikli aracınızı hızlı ve güvenli şarj eder.

• Gelişmiş Güvenlik: 30mA kaçak akım rölesi, aşırı yük, aşırı voltaj ve kısa devre koruması.
• Modüler Yapı: Elektronik kilitli Type 2 priz, RFID kart okuyucu, LCD ekran. İç ve dış mekan kullanımına uygun.
• 2 yıl garantilidir.`,
      },
      {
        title: 'Teknik Yapı',
        content: `Şarj istasyonları elektrikli araçların AC şarjı için kullanılır. Tek veya üç fazlı AC şarj cihazı olarak kullanışlıdır. Ürün uluslararası standartlara uygun tasarlanmıştır; IP54 koruma sınıfı ile toz ve suya karşı dayanıklıdır. Hem dış hem iç mekanda kullanılabilir. 22kW destekleyen bu istasyonu 11kW ihtiyacı olan araçlar için de tercih edebilirsiniz.`,
      },
      {
        title: 'Kullanım',
        content: `Çalıştırmadan önce: AC şarj istasyonu ve aksesuarların doğru bağlandığını kontrol edin. AC giriş için uygun koruma ürünleri kullanın. Ünite üzerinde harici nesne bulundurmayın.

Cihazı çalıştırma: Kaçak akım devre kesicisine basarak açın. Güç bağlandığında yaklaşık 7 saniye kendi kendini test eder. Gösterge ışıkları kırmızı, mavi ve yeşil yanıp söner. Test bitince yeşil ışık sürekli yanar, şarja hazırdır.`,
      },
      {
        title: 'Bu ürünü kim üretti?',
        content: `Bu ürün Elektromarketim tarafından üretilen bir elektrikli araç şarj istasyonu modelidir.`,
      },
      {
        title: 'Özellikleri nelerdir?',
        content: `22kW elektrikli araç şarj istasyonu; 380V (trifaze) 32A besleme. 30mA kaçak akım rölesi, aşırı yük, aşırı voltaj ve kısa devre korumaları. Modüler yapı, elektronik kilitli Type 2 priz. İç ve dış mekanlarda kullanım. RFID kart okuyucu ve LCD ekran.`,
      },
      {
        title: 'Nasıl kullanılır?',
        content: `Kurulum alanına elektrik bağlantısını yaparak kurun. RFID kart okuyucu ile ürünü kullanmaya başlayın. Kontrol ekranından şarj durumunu takip edebilir, aracınızı rahatça şarj edebilirsiniz.`,
      },
    ],
    features: [
      'Tüm elektrikli araç modelleri ile uyumludur.',
      'Monofaze ve Trifaze bağlantı seçenekleri ile çalışır.',
      '22kW / 11kW / 7.2kW güç çalışma kapasitesi.',
      'LCD ekran üzerinden anlık akım ve güç kullanımı takibi.',
      'RFID kart ile kişisel kullanım.',
      '30mA kaçak akım rölesi, aşırı yük / aşırı voltaj / kısa devre koruması.',
      'Modüler yapı, elektronik kilitli Type 2 priz.',
      'İç ve dış mekân kullanımına uygun, IP54.',
      '2 yıl garantili.',
    ],
    warranty: '2 yıl garantili.',
    category: 'AC Şarj İstasyonları',
    price: 23200,
    stock: 20,
    featured: false,
    isVariantProduct: true,
    variants: [
      {
        key: 'pt2',
        label: 'EMEV-22-3F32-PT2 (Tip 2 soket)',
        price: 23200,
        sku: 'EMEV-22-3F32-PT2',
        specifications: {
          'Model': 'EMEV-22-3F32-PT2',
          'Güç modu': '3P+N+PE',
          'Çalışma gerilimi': '230–380V (±%10) 50 Hz',
          'Çıkış akımı': '16A / 32A',
          'Çıkış gücü': '11 kW / 22 kW',
          'Soğutma': 'Doğal soğutma',
          'Fiş/priz': 'Avrupa standardı Type 2',
          'Çalışma sıcaklığı': '-40°C ile +50°C',
          'IP sınıfı': 'IP54',
          'IK darbe dayanıklılığı': 'IK08',
          'Kurulum': 'Taşınabilir, duvar montajlı',
          'Ağırlık': '3.2 kg',
          'Ürün ölçüleri': '357×245×123 mm',
          'Montaj ölçüleri': '180×280×3 mm',
        },
      },
      {
        key: 'kt2',
        label: 'EMEV-22-3F32-KT2 (OCPP 1.6)',
        price: 34113,
        sku: 'EMEV-22-3F32-KT2',
        specifications: {
          'Model': 'EMEV-22-3F32-KT2',
          'Güç modu': '3P+N+PE',
          'Çalışma gerilimi': '230–380V (±%10) 50 Hz',
          'Çıkış akımı': '16A / 32A',
          'Çıkış gücü': '11 kW / 22 kW',
          'Soğutma': 'Doğal soğutma',
          'Fiş/priz': 'Avrupa standardı Type 2',
          'OCPP': '1.6',
          'Çalışma sıcaklığı': '-40°C ile +50°C',
          'IP sınıfı': 'IP54',
          'IK darbe dayanıklılığı': 'IK08',
          'Kurulum': 'Taşınabilir, duvar montajlı',
          'Ağırlık': '8.2 kg',
          'Ürün ölçüleri': '357×245×123 mm',
          'Montaj ölçüleri': '180×280×3 mm',
        },
      },
    ],
    tags: ['Elektromarketim', '22 kW', 'Tip 2', 'Duvar tipi', 'OCPP'],
  },

  // —— DC Hızlı Şarj İstasyonları ——
  {
    id: 'dc-hizli-sarj-istasyonu-50kw',
    brand: 'TommaTech',
    image: '/images/products/dc-charger-placeholder.jpg',
    sku: 'TT-DC-50KW',
    name: 'DC Hızlı Şarj İstasyonu (50 kW)',
    description: 'Ticari alanlar ve otoyol kenarları için 50 kW yüksek hızlı DC şarj istasyonu. CCS2 ve CHAdeMO desteği.',
    fullDescription: 'TommaTech DC hızlı şarj istasyonu, 50 kW çıkış gücü ile elektrikli araçlarınızı kısa sürede şarj eder. Çift soket desteği, OCPP 1.6J ve dayanıklı dış gövde.',
    features: ['50 kW DC hızlı şarj.', 'CCS2 / CHAdeMO soket seçenekleri.', 'OCPP 1.6J uyumlu.', 'IP54 dış mekan dayanımı.'],
    specifications: { 'Güç': '50 kW', 'Giriş': '3 Faz 400V', 'Soket': 'CCS2 / CHAdeMO', 'Verimlilik': '>%94' },
    price: 450000,
    category: 'DC Hızlı Şarj İstasyonları',
    stock: 5,
    featured: true,
    isVariantProduct: false,
    tags: ['DC', 'Hızlı Şarj', '50 kW', 'Ticari'],
  },

  // —— Taşınabilir Şarj İstasyonları — Hims-xPS Standart Serisi (Kablolu Tip 2) ——
  {
    id: 'hims-3ps-tasinabilir-sarj',
    brand: 'Hims',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'Hims-3PS',
    name: '3.6 kW Tip 2 Soketli Kablolu Taşınabilir Şarj İstasyonu',
    slogan: 'Düşük Bütçeli Taşınabilir Şarj; Taşıma Çantası Hediye.',
    description: '3.6 kW Tip 2 soketli kablolu taşınabilir şarj istasyonu. Hims-xPS standart serisi; taşıma çantası hediyedir. Ev, ofis veya seyahatte kullanım.',
    fullDescription: 'Hims-xPS standart serisinin 3.6 kW modeli. Tip 2 soketli, kablolu taşınabilir şarj istasyonu. Tüm xPS serisinde taşıma çantası hediyedir; 3.6 kW modelde dönüştürücü hediyesi yoktur. Fiyat KDV hariç 310€.',
    features: ['3.6 kW, Tip 2 soketli kablolu taşınabilir.', 'Taşıma çantası hediyedir.', 'Hims-xPS standart serisi.'],
    specifications: { 'Model': 'Hims-3PS', 'Güç': '3.6 kW', 'Soket': 'Tip 2 kablolu', 'Fiyat (KDV hariç)': '310€' },
    price: 11000,
    category: 'Mobil / Taşınabilir Şarj İstasyonları',
    stock: 45,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims-3PS', 'Taşınabilir', '3.6 kW', 'Tip 2'],
  },
  {
    id: 'hims-7ps-tasinabilir-sarj',
    brand: 'Hims',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'Hims-7PS',
    name: '7.4 kW Tip 2 Soketli Kablolu Taşınabilir Şarj İstasyonu',
    slogan: '7.4 kW Taşınabilir Şarj; Çanta + 1 Dönüştürücü Hediye.',
    description: '7.4 kW Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Hims-xPS standart serisi.',
    fullDescription: 'Hims-xPS standart serisinin 7.4 kW modeli. Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Fiyat KDV hariç 370€.',
    features: ['7.4 kW, Tip 2 soketli kablolu taşınabilir.', 'Taşıma çantası + 1 dönüştürücü hediyedir.', 'Hims-xPS standart serisi.'],
    specifications: { 'Model': 'Hims-7PS', 'Güç': '7.4 kW', 'Soket': 'Tip 2 kablolu', 'Fiyat (KDV hariç)': '370€' },
    price: 13200,
    category: 'Mobil / Taşınabilir Şarj İstasyonları',
    stock: 40,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims-7PS', 'Taşınabilir', '7.4 kW', 'Tip 2'],
  },
  {
    id: 'hims-11ps-tasinabilir-sarj',
    brand: 'Hims',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'Hims-11PS',
    name: '11 kW Tip 2 Soketli Kablolu Taşınabilir Şarj İstasyonu',
    slogan: '11 kW Taşınabilir Şarj; Çanta + 1 Dönüştürücü Hediye.',
    description: '11 kW Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Hims-xPS standart serisi.',
    fullDescription: 'Hims-xPS standart serisinin 11 kW modeli. Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Fiyat KDV hariç 430€.',
    features: ['11 kW, Tip 2 soketli kablolu taşınabilir.', 'Taşıma çantası + 1 dönüştürücü hediyedir.', 'Hims-xPS standart serisi.'],
    specifications: { 'Model': 'Hims-11PS', 'Güç': '11 kW', 'Soket': 'Tip 2 kablolu', 'Fiyat (KDV hariç)': '430€' },
    price: 15300,
    category: 'Mobil / Taşınabilir Şarj İstasyonları',
    stock: 38,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims-11PS', 'Taşınabilir', '11 kW', 'Tip 2'],
  },
  {
    id: 'hims-22ps-tasinabilir-sarj',
    brand: 'Hims',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'Hims-22PS',
    name: '22 kW Tip 2 Soketli Kablolu Taşınabilir Şarj İstasyonu',
    slogan: '22 kW Taşınabilir Şarj; Çanta + 1 Dönüştürücü Hediye.',
    description: '22 kW Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Hims-xPS standart serisi; en yüksek güç seçeneği.',
    fullDescription: 'Hims-xPS standart serisinin 22 kW modeli. Tip 2 soketli kablolu taşınabilir şarj istasyonu. Taşıma çantası ve 1 adet dönüştürücü hediyedir. Fiyat KDV hariç 490€.',
    features: ['22 kW, Tip 2 soketli kablolu taşınabilir.', 'Taşıma çantası + 1 dönüştürücü hediyedir.', 'Hims-xPS standart serisi; 22 kW seçeneği.'],
    specifications: { 'Model': 'Hims-22PS', 'Güç': '22 kW', 'Soket': 'Tip 2 kablolu', 'Fiyat (KDV hariç)': '490€' },
    price: 17400,
    category: 'Mobil / Taşınabilir Şarj İstasyonları',
    stock: 35,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims-22PS', 'Taşınabilir', '22 kW', 'Tip 2'],
  },

  // —— Hims Taşınabilir Şarj (HCTK-22-G-TF) ——
  {
    id: 'hims-hctk-22-g-tf',
    brand: 'Hims',
    image: '/images/products/hctk-22-g-tf-3.jpg',
    images: [
      '/images/products/hctk-22-g-tf-3.jpg',
      '/images/products/hctk-22-g-tf-2.jpg',
      '/images/products/hctk-22-g-tf-1.jpg',
      '/images/products/hctk-22-g-tf-4.jpg',
      '/images/products/hctk-22-g-tf-5.jpg',
    ],
    sku: 'HCTK-22-G-TF',
    name: '22kW Tip 2 Soketli Sanayi Tipi Konnektörlü Taşınabilir Elektrikli Araç Şarj Cihazı',
    slogan: '22kW Taşınabilir Şarj; Sanayi Tipi Konnektör ve Modüler Yapı.',
    description:
      'NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Gelişmiş yapısı, modüler bağlantı sistemi ve 22kW yüksek güç kapasitesiyle Hims HCTK-22-G-TF, elektrikli araç kullanıcılarının tüm mobil şarj ihtiyaçları karşılayan taşınabilir elektrikli araç şarj istasyonu modelidir.',
    fullDescription: `NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR.

Gelişmiş yapısı, modüler bağlantı sistemi ve 22kW yüksek güç kapasitesiyle Hims HCTK-22-G-TF, elektrikli araç kullanıcılarının tüm mobil şarj ihtiyaçları karşılayan taşınabilir elektrikli araç şarj istasyonu modelidir.

Yüksek performanslı elektrikli araba taşınabilir şarj cihazı arayan kullanıcılar için tasarlanan HCTK-22-G-TF, 32A akım taşıma kapasitesine ve dayanıklı alüminyum kasaya sahiptir.

Cihaz, Togg taşınabilir şarj aleti her alanda rahatlıkla kullanılabilir. Ayrıca, Type 2 soket yapısı ile Tesla taşınabilir şarj aleti olarak da kullanılabilir.

Tüm type 2 şarj girişine sahip araçlar ile uyumlu olan elektrikli araç taşınabilir şarj cihazı, her yolculukta rahatça taşınabilir.

Kompakt boyutları ve modüler konnektör tasarımı ile kolayca depolanabilir.

Monofaz fiş ile ev tipi priz ile kullanım sağlayabilir, Trifaz fiş ile yapılan kullanımlarda ise Trifaze kullanım elde edilmektedir.

Gelişmiş ekran arayüzü ve akım ayarı seçenekleriyle 22kw taşınabilir şarj cihazı, kullanıcıya istasyonu kontrol etme imkanı sunar.

İstasyon içerisinde bulunan araç şarj kablosu uzunluğu 5 metredir.

Dayanıklı kablo yapısı ve modüler bağlantılarıyla taşınabilir elektrikli araç şarj kablosu gereksinimini tek cihazda karşılar.

İster seyahatte ister günlük kullanımda taşınabilir şarj istasyonu pratik ve güvenli şarj deneyimi sağlar.

Type 2 soket desteği sayesinde Avrupa standartlarındaki tüm elektrikli araçlarla uyumludur.

Mobil şarj istayonu, farklı akım seviyelerine uygun kablolu dönüştürücülerle çalışabilir (3.6kW, 7.4kW, 22kW).

Ürün içerisinde 3.6kW dönüştürücü dahildir.

Eğer 3.6kW güç elde etmek isterseniz bu dönüştürücüyü kullanmanız gerekmektedir.

Dönüştürücü üzerinde belirtilen ''Aracınızın akım ayarını 16A değerine düşürmeyi unutmayınız' uyarısına dikkat edilmelidir.

Alüminyum Kasa, Güvenli Kullanım
✓ Dayanıklı alüminyum kasa yapısı sayesinde cihaz, dış etkenlere karşı yüksek koruma sağlar.

✓ Hafif ve sağlam gövdesi, 22 kW taşınabilir elektrikli araç şarj cihazının uzun ömürlü ve güvenli kullanımını destekler.

✓ Isı dağılımını optimize eden alüminyum kasa, şarj cihazının yoğun kullanımda bile stabil çalışmasını sağlar.

✓ Darbe dayanımı yüksek bu yapı, taşınabilir elektrikli araç şarj çözümleri için ideal bir güvenlik ve performans sunar.

✓ Şık ve sağlam alüminyum gövdesi ile öne çıkan Hims HCTK-22, hem estetik hem de dayanıklılığı bir arada sunar.

✓ Dış ortamlara uygun alüminyum kasa, cihazı korurken kullanıcıya güven veren profesyonel bir şarj deneyimi sağlar.

Mobil Uygulama Desteği

✓ Uygulama üzerinden şarj programlama yapılabilir.

✓ Uzaktan şarj başlatma ve durdurma fonksiyonu ile tam kontrol sağlar.

✓ Gecikmeli başlatma özelliği ile enerji verimliliği artırılır.


Taşıma Kolaylığı

✓ Özel taşıma çantası ile düzenli bir şekilde taşınabilir.

✓ Çanta arkasındaki cırtlar, bagaj içine sabitlenmesini sağlar.

✓ Ergonomik kulplar sayesinde uzun taşımalarda kullanıcıyı yormaz.


Modüler ve Esnek Şarj Seçenekleri

✓ Modüler güç konnektörü ile her ortamda şarj edilebilir.

✓ 2kW ila 22kW arasında ayarlanabilir çıkış gücü ile farklı ihtiyaçlara uygundur.

✓ Ev, iş yeri ve kamp gibi her ortamda kullanıma uygundur.


Yüksek Koruma ve Dayanıklılık

✓ IP65 ve IK10 koruma sınıfı sayesinde toza, suya ve dış darbeye karşı yüksek dayanım sağlar.

✓ Aşırı akım, düşük ve yüksek gerilim koruma sistemleri ile cihazı ve aracı güvence altına alır.

✓ Topraklama kontrol özelliği elektriksel güvenliği artırır.


Akıllı Gövde Tasarımı

✓ Alüminyum kasası ile hem hafif hem de dayanıklı yapıdadır.

✓ LED ekran üzerinden akım bilgisi, durum göstergesi ve şarj verileri okunabilir.

✓ Akım ayarı fiziksel olarak kullanıcı tarafından kolayca yapılabilir.`,
    features: [
      'Alüminyum Kasa, Güvenli Kullanım ve Üstün Soğutma',
      'Mobil Uygulama Desteği (Programlama, Uzaktan Başlatma/Durdurma)',
      'Özel Taşıma Çantası (Cırtlı Sabitleme)',
      'Modüler ve Esnek Şarj Seçenekleri (2kW - 22kW Ayarlanabilir)',
      'Yüksek Koruma (IP65 & IK10)',
      'Akıllı Gövde ve LED Ekran Tasarımı',
      '5 Metre Dayanıklı Araç Şarj Kablosu',
      'Sanayi Tipi Trifaze Konnektörlü Modüler Yapı',
      '3.6kW Dönüştürücü Hediye',
    ],
    specifications: {
      'Faz Sayısı': 'Monofaze / Trifaze',
      'Ürün Modeli': 'HCTK-22-G-TF',
      'Nominal Gerilim': 'AC240V AC400V 50/60HZ',
      'Maksimum Çıkış Akımı': '3 Faz için 32A',
      'Maksimum Çıkış Gücü': '3 Faz için 22kW',
      'Kablo Özelliği': '3 Faz içi 5x6mm²+1x0,75mm² - H07BZ5-F',
      'Standart': 'IEC 61851',
      'Sertifika': 'CE / EN/IEC 61851-1:2017',
      'Led Göstergeler': 'Var',
      'Kaçak Akım İzleme (RCMU)': 'Type A (AC 30mA+DC 6mA)',
      'Akım Ayarı': 'Var',
      'Led Ekran': 'Var',
      'Wifi / Bluetoooth': 'Var (wifi 2.4GHz)',
      'Koruma Derecesi': 'IP65',
      'Çalışma Sıcaklığı': '-30°C ~ 55°C',
      'Nem': '≤95%RH',
      'Maksimum Çalışma Yüksekliği': '≤2000m',
      'Soğutma': 'Doğal Soğutma',
      'Araç Şarj Kablo Uzunluğu': '5 metre',
      'Beklemede Kullandığı Güç': '<3w',
    },
    price: 36433,
    category: 'Mobil / Taşınabilir Şarj İstasyonları',
    stock: 22,
    featured: true,
    isVariantProduct: false,
    productFamilyKey: 'HCTK-22-G',
    tags: ['Hims', 'HCTK-22-G-TF', 'Taşınabilir', '22 kW', 'Tip 2', 'Modüler'],
  },
  {
    id: 'hims-hctk-22-g',
    brand: 'Hims',
    image: '/images/products/hctk-22-g-1.jpg',
    images: [
      '/images/products/hctk-22-g-1.jpg',
      '/images/products/hctk-22-g-2.jpg',
      '/images/products/hctk-22-g-3.jpg',
      '/images/products/hctk-22-g-4.jpg',
      '/images/products/hctk-22-g-5.jpg',
    ],
    imagesByVariant: [
      ['/images/products/hctk-22-g-1.jpg', '/images/products/hctk-22-g-2.jpg', '/images/products/hctk-22-g-3.jpg', '/images/products/hctk-22-g-4.jpg', '/images/products/hctk-22-g-5.jpg'],
      ['/images/products/hctk-22-g-tf-3.jpg', '/images/products/hctk-22-g-tf-2.jpg', '/images/products/hctk-22-g-tf-1.jpg', '/images/products/hctk-22-g-tf-4.jpg', '/images/products/hctk-22-g-tf-5.jpg'],
    ],
    sku: 'HCTK-22-G',
    name: '22kW Tip 2 Taşınabilir Mobil Elektrikli Araç Şarj İstasyonu',
    slogan: '22kW Gümüş Taşınabilir Şarj; Ev ve Seyahat.',
    description:
      'NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR. Gelişmiş yapısı, modüler bağlantı sistemi ve 22kW yüksek güç kapasitesiyle Hims HCTK-22-G, elektrikli araç kullanıcılarının tüm mobil şarj ihtiyaçları karşılayan taşınabilir elektrikli araç şarj istasyonu modelidir.',
    fullDescription: `NOT: TÜM ELEKTRİKLİ ARAÇ MODELLERİ İLE UYUMLUDUR.

Gelişmiş yapısı, modüler bağlantı sistemi ve 22kW yüksek güç kapasitesiyle Hims HCTK-22-G, elektrikli araç kullanıcılarının tüm mobil şarj ihtiyaçları karşılayan taşınabilir elektrikli araç şarj istasyonu modelidir.

Yüksek performanslı elektrikli araba taşınabilir şarj cihazı arayan kullanıcılar için tasarlanan HCTK-22-G, 32A akım taşıma kapasitesine ve dayanıklı alüminyum kasaya sahiptir. Type 2 soket desteği ile Avrupa standartlarındaki tüm elektrikli araçlarla uyumludur. Aşağıdaki bölümlerden detaylı bilgiye ulaşabilirsiniz.`,
    descriptionSections: [
      {
        title: 'Mobil Uygulama Desteği',
        content: `✓ Uygulama üzerinden şarj programlama yapılabilir.

✓ Uzaktan şarj başlatma ve durdurma fonksiyonu ile tam kontrol sağlar.

✓ Gecikmeli başlatma özelliği ile enerji verimliliği artırılır.`,
      },
      {
        title: 'Taşıma Kolaylığı',
        content: `✓ Özel taşıma çantası ile düzenli bir şekilde taşınabilir.

✓ Çanta arkasındaki cırtlar, bagaj içine sabitlenmesini sağlar.

✓ Ergonomik kulplar sayesinde uzun taşımalarda kullanıcıyı yormaz.`,
      },
      {
        title: 'Modüler ve Esnek Şarj Seçenekleri',
        content: `✓ Modüler güç konnektörü ile her ortamda şarj edilebilir.

✓ 2kW ila 22kW arasında ayarlanabilir çıkış gücü ile farklı ihtiyaçlara uygundur.

✓ Ev, iş yeri ve kamp gibi her ortamda kullanıma uygundur.`,
      },
      {
        title: 'Yüksek Koruma ve Dayanıklılık',
        content: `✓ IP65 ve IK10 koruma sınıfı sayesinde toza, suya ve dış darbeye karşı yüksek dayanım sağlar.

✓ Aşırı akım, düşük ve yüksek gerilim koruma sistemleri ile cihazı ve aracı güvence altına alır.

✓ Topraklama kontrol özelliği elektriksel güvenliği artırır.`,
      },
      {
        title: 'Akıllı Gövde Tasarımı',
        content: `✓ Alüminyum kasası ile hem hafif hem de dayanıklı yapıdadır.

✓ LED ekran üzerinden akım bilgisi, durum göstergesi ve şarj verileri okunabilir.

✓ Akım ayarı fiziksel olarak kullanıcı tarafından kolayca yapılabilir.`,
      },
    ],
    features: [
      'Alüminyum Kasa, Güvenli Kullanım ve Üstün Soğutma',
      'Mobil Uygulama Desteği (Programlama, Uzaktan Başlatma/Durdurma)',
      'Özel Taşıma Çantası (Cırtlı Sabitleme)',
      'Modüler ve Esnek Şarj Seçenekleri (2kW - 22kW Ayarlanabilir)',
      'Yüksek Koruma (IP65 & IK10)',
      'Akıllı Gövde ve LED Ekran Tasarımı',
      '5 Metre Dayanıklı Araç Şarj Kablosu',
      'Monofaze / Trifaze Kullanım Özgürlüğü',
    ],
    specifications: {
      'Faz Sayısı': 'Monofaze / Trifaze',
      'Ürün Modeli': 'HCTK-22-G',
      'Nominal Gerilim': 'AC240V AC400V 50/60HZ',
      'Maksimum Çıkış Akımı': '3 Faz için 32A',
      'Maksimum Çıkış Gücü': '3 Faz için 22kW',
      'Kablo Özelliği': '3 Faz içi 5x6mm²+1x0,75mm² - H07BZ5-F',
      'Standart': 'IEC 61851',
      'Sertifika': 'CE / EN/IEC 61851-1:2017',
      'Led Göstergeler': 'Var',
      'Kaçak Akım İzleme (RCMU)': 'Type A (AC 30mA+DC 6mA)',
      'Akım Ayarı': 'Var',
      'Led Ekran': 'Var',
      'Wifi / Bluetoooth': 'Var (wifi 2.4GHz)',
      'Koruma Derecesi': 'IP65',
      'Çalışma Sıcaklığı': '-30°C ~ 55°C',
      'Nem': '≤95%RH',
      'Araç Şarj Kablo Uzunluğu': '5 metre',
      'Maksimum Çalışma Yüksekliği': '≤2000m',
      'Soğutma': 'Doğal Soğutma',
      'Beklemede Kullandığı Güç': '<3w',
    },
    variants: [
      {
        key: 'hctk-22-g',
        label: 'HCTK-22-G (Sanayi Tipi Konnektör)',
        price: 33433,
        sku: 'HCTK-22-G',
        specifications: {
          'Faz Sayısı': 'Monofaze / Trifaze',
          'Ürün Modeli': 'HCTK-22-G',
          'Nominal Gerilim': 'AC240V AC400V 50/60HZ',
          'Maksimum Çıkış Akımı': '3 Faz için 32A',
          'Maksimum Çıkış Gücü': '3 Faz için 22kW',
          'Kablo Özelliği': '3 Faz içi 5x6mm²+1x0,75mm² - H07BZ5-F',
          'Standart': 'IEC 61851',
          'Sertifika': 'CE / EN/IEC 61851-1:2017',
          'Led Göstergeler': 'Var',
          'Kaçak Akım İzleme (RCMU)': 'Type A (AC 30mA+DC 6mA)',
          'Akım Ayarı': 'Var',
          'Led Ekran': 'Var',
          'Wifi / Bluetoooth': 'Var (wifi 2.4GHz)',
          'Koruma Derecesi': 'IP65',
          'Çalışma Sıcaklığı': '-30°C ~ 55°C',
          'Nem': '≤95%RH',
          'Araç Şarj Kablo Uzunluğu': '5 metre',
          'Maksimum Çalışma Yüksekliği': '≤2000m',
          'Soğutma': 'Doğal Soğutma',
          'Beklemede Kullandığı Güç': '<3w',
        },
      },
      {
        key: 'hctk-22-g-tf',
        label: 'HCTK-22-G-TF (Quick Konnektör)',
        price: 36433,
        sku: 'HCTK-22-G-TF',
        specifications: {
          'Faz Sayısı': 'Monofaze / Trifaze',
          'Ürün Modeli': 'HCTK-22-G-TF',
          'Nominal Gerilim': 'AC240V AC400V 50/60HZ',
          'Maksimum Çıkış Akımı': '3 Faz için 32A',
          'Maksimum Çıkış Gücü': '3 Faz için 22kW',
          'Kablo Özelliği': '3 Faz içi 5x6mm²+1x0,75mm² - H07BZ5-F',
          'Standart': 'IEC 61851',
          'Sertifika': 'CE / EN/IEC 61851-1:2017',
          'Led Göstergeler': 'Var',
          'Kaçak Akım İzleme (RCMU)': 'Type A (AC 30mA+DC 6mA)',
          'Akım Ayarı': 'Var',
          'Led Ekran': 'Var',
          'Wifi / Bluetoooth': 'Var (wifi 2.4GHz)',
          'Koruma Derecesi': 'IP65',
          'Çalışma Sıcaklığı': '-30°C ~ 55°C',
          'Nem': '≤95%RH',
          'Maksimum Çalışma Yüksekliği': '≤2000m',
          'Soğutma': 'Doğal Soğutma',
          'Araç Şarj Kablo Uzunluğu': '5 metre',
          'Beklemede Kullandığı Güç': '<3w',
        },
      },
    ],
    price: 33433,
    category: 'AC Şarj İstasyonları',
    stock: 22,
    featured: true,
    isVariantProduct: true,
    productFamilyKey: 'HCTK-22-G',
    tags: ['Hims', 'HCTK-22-G', 'HCTK-22-G-TF', 'Taşınabilir', '22 kW', 'Gümüş', 'Mobil'],
  },
  {
    id: 'hims-hctk-g-3',
    brand: 'Hims',
    image: '/images/products/placeholder.png',
    sku: 'HCTK-G-3',
    name: '3.7kW Ev Tipi Taşınabilir Elektrikli Araç Şarj Cihazı',
    slogan: 'Düşük güç ev tipi taşınabilir şarj; standart prizle çalışır.',
    description: '3.7 kW ev tipi taşınabilir elektrikli araç şarj cihazı. Standart ev prizinden beslenir; düşük güç ile güvenli gece şarjı.',
    fullDescription: 'Hims HCTK-G-3, 3.7 kW gücünde ev tipi taşınabilir şarj cihazıdır. Standart ev prizine (tek faz) takılarak kullanılır. Düşük güç sayesinde mevcut tesisata yük bindirmez; gece şarjı için uygundur. Tip 2 soket; tüm Tip 2 uyumlu elektrikli araçlarla kullanılır.',
    features: [
      '3.7 kW ev tipi taşınabilir.',
      'Standart ev prizinden beslenir.',
      'Tip 2 soket.',
      'Gece şarjı için uygun.',
    ],
    specifications: { 'Model': 'HCTK-G-3', 'Güç': '3.7 kW', 'Soket': 'Tip 2', 'Besleme': 'Tek faz ev prizi' },
    price: 9380,
    category: 'AC Şarj İstasyonları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'HCTK-G-3', 'Ev tipi', '3.7 kW', 'Taşınabilir'],
  },

  // Tamamlayıcı ürünler (Isı pompası / EV sayfalarında önerilir)
  {
    id: 'tommatech-fan-coil-unitesi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory/147_residential-isi-pompalari_0.jpg',
    sku: 'TT-FC',
    name: 'TommaTech Fan Coil Üniteleri (Kasetli / Kasetsiz)',
    description: 'Isı pompası ve yerden ısıtma sistemlerinizle uyumlu fan coil üniteleri. Kasetli ve kasetsiz modeller ile konforlu iklimlendirme.',
    price: 8500,
    category: 'Enerji Yönetimi',
    stock: 30,
    featured: false,
    isVariantProduct: false,
    tags: ['Fan coil', 'Isı pompası aksesuar'],
  },
  {
    id: 'tommatech-akumulasyon-tanki',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory/147_residential-isi-pompalari_0.jpg',
    sku: 'TT-BOYLER',
    name: 'TommaTech Akümülasyon Tankları / Boylerler',
    description: 'Isı pompası tesisatınızı tamamlayan akümülasyon tankı ve boyler çözümleri. Sıcak su depolama ve verimli dağıtım.',
    price: 12000,
    category: 'Enerji Yönetimi',
    stock: 22,
    featured: false,
    isVariantProduct: false,
    tags: ['Boyler', 'Akümülasyon', 'Isı pompası'],
  },
  {
    id: 'tommatech-solar-carport',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1255_tommatech-1-araclik-solar-otopark-paketi-590wp_0.webp',
    sku: 'TT-CARPORT',
    name: 'TommaTech Solar Carport (Güneş Panelli Otopark)',
    description: 'Elektrikli aracınızı güneşin altında değil, şık ve teknolojik bir yapı altında şarj edin. Güneş panelli otopark sistemleri.',
    price: 95000,
    category: 'Enerji Yönetimi',
    stock: 5,
    featured: false,
    isVariantProduct: false,
    tags: ['Carport', 'Solar', 'EV'],
  },
  // —— 5. TARIMSAL SOLAR SULAMA ——
  {
    id: 'tommatech-solar-sulama-inverter-spi',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory/29_sulama-inverteri-modelleri_0.jpg',
    sku: 'TT-SPI',
    name: 'TommaTech SPI Serisi Solar Pompa İnverteri',
    slogan: 'TommaTech ile Sulamada Kontrol Sizde!',
    description: 'Tarlanızda şebeke elektriği olmasa bile bedava güneş enerjisiyle sulama yapmanın en akıllı yolu! TommaTech Solar Pompa İnverterleri, güneş panellerinden gelen DC (Doğru Akım) enerjisini AC (Alternatif Akım) enerjisine çevirerek 220V/230V Monofaze ya da 380V/400V Trifaze su pompalarınızı ve dalgıç motorlarınızı doğrudan çalıştırır. Özel sürücü devresi sayesinde pompa motorunun yumuşak kalkış yapmasını sağlar, sabahın erken saatlerinden gün batımına kadar anlık güce göre suyun debisini otomatik olarak ayarlar.',
    fullDescription: 'Tarlanızda şebeke elektriği olmasa bile bedava güneş enerjisiyle sulama yapmanın en akıllı yolu! TommaTech Solar Pompa İnverterleri, güneş panellerinden gelen DC enerjisini AC enerjisine çevirerek 220V/230V Monofaze ya da 380V/400V Trifaze su pompalarınızı ve dalgıç motorlarınızı doğrudan çalıştırır. Özel sürücü devresi sayesinde pompa motorunun yumuşak kalkış yapmasını sağlar, sabahın erken saatlerinden gün batımına kadar anlık güce göre suyun debisini otomatik olarak ayarlar.\n\nGelişmiş MPPT algoritması ile yüksek MPPT çalışma gerilimi aralığı (1000VDC ve 900VDC seçenekleri) sayesinde daha fazla panel bağlama imkanı sunar ve bulutlu havalarda dahi yüksek performans gösterir. İstenirse inverterin AC girişi sayesinde şebekeden veya jeneratörden beslenerek gece sulamalarında da kullanılabilir.',
    features: [
      'Gelişmiş MPPT Algoritması: Yüksek MPPT çalışma gerilimi aralığı (1000VDC ve 900VDC seçenekleri) sayesinde daha fazla panel bağlama imkanı, bulutlu havalarda dahi yüksek performans.',
      'Hibrit Çalışma Desteği: AC giriş ile şebeke veya jeneratörden beslenerek gece sulamalarında da kullanım.',
      'Zorlu Şartlara Dayanım: -40°C ile +70°C arası geniş çalışma sıcaklığı, IP20 koruma sınıfı.',
      'Uzaktan İzleme: TommaTech Portal veya WEB/APP üzerinden akıllı telefondan anlık veri izleme ve uzaktan kontrol.',
      'Tasarım: Çok fonksiyonlu LCD tuş takımı; 15 kW altı için ABS plastik veya metal dış kasa seçenekleri.',
    ],
    models: 'Monofaze (MF): SPI-TT-2.2-MF (2.2 kW). Trifaze (TF): SPI-TT-2.2-TF\'den SPI-TT-250.0-TF\'ye kadar; projeye özel 650.0 kW\'a kadar üretim seçeneği.',
    specifications: {
      'MPPT gerilim aralığı': '900VDC / 1000VDC seçenekleri',
      'Çıkış': '220V/230V Monofaze, 380V/400V Trifaze',
      'Çalışma sıcaklığı': '-40°C / +70°C',
      'Koruma sınıfı': 'IP20',
      'Monofaze modeller': 'SPI-TT-2.2-MF (2.2 kW ve üzeri)',
      'Trifaze modeller': 'SPI-TT-2.2-TF ~ SPI-TT-250.0-TF (650 kW\'a kadar özel)',
    },
    price: 35000,
    category: 'Solar Sistemler',
    stock: 14,
    featured: true,
    isVariantProduct: false,
    tags: ['Solar sulama', 'Dalgıç pompa', 'MPPT', 'Hibrit'],
  },
  {
    id: 'tommatech-hazir-solar-sulama-panosu',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1212_tommatech-1hp-075kw-1-faz-230v-pompa-icin-sulama-paketi_0.jpg',
    sku: 'TT-SPI-BOX',
    name: 'TommaTech Hazır Solar Sulama Kutusu / Panosu',
    slogan: 'Tak - Çalıştır Kolaylığı ile Tarlanızda Anında Kurulum!',
    description: 'Güneş paneli ve su pompanız arasındaki tüm bağlantı, koruma ve inverter sistemlerinin uzman mühendisler tarafından tek bir pano içerisinde birleştirildiği hazır sulama çözümüdür. IP55 dış mekan koruma sınıfına sahip bu pano sayesinde, arazinizde ekstra bir pano kurulumuyla uğraşmadan kabloları bağlayıp doğrudan sulamaya başlayabilirsiniz.',
    fullDescription: 'Güneş paneli ve su pompanız arasındaki tüm bağlantı, koruma ve inverter sistemlerinin uzman mühendisler tarafından tek bir pano içerisinde birleştirildiği hazır sulama çözümüdür. IP55 dış mekan koruma sınıfına sahip bu pano sayesinde, arazinizde ekstra bir pano kurulumuyla uğraşmadan kabloları bağlayıp doğrudan sulamaya başlayabilirsiniz.\n\nSigorta, kablo bağlantı klemensleri ve havalandırma (iklimlendirme) ızgaraları gibi tüm bileşenler özenle konumlandırılmıştır. Arazideki toza ve sıvı temasına karşı IP55 sertifikalı sağlam metal/sac kasa yapısı ile dış ortama dayanıklıdır.',
    features: [
      'Tam Güvenlik ve Uyumluluk: Sigorta, kablo bağlantı klemensleri ve havalandırma ızgaraları özenle konumlandırılmış.',
      'Dış Ortama Dayanıklı: Toza ve sıvı temasına karşı IP55 koruma sınıfı sertifikalı sağlam metal/sac kasa.',
      'Esnek Bağlantı Çıkışları: 2 delikten 54 deliğe kadar çeşitli rakor/kablo geçiş seçenekleri.',
      'Çoklu Kapasite: 7.5 kW\'dan 160.0 kW\'a (SPI-TT-7.5 TF - SPI-TT-160.0 TF) tüm sulama inverterleri için farklı boyut seçenekleri (10 kg - 200 kg boş ağırlık).',
    ],
    specifications: {
      'Koruma sınıfı': 'IP55 (dış mekan)',
      'Kapasite aralığı': '7.5 kW - 160.0 kW (SPI-TT-7.5 TF ~ SPI-TT-160.0 TF)',
      'Kasa': 'Metal/sac, dış mekan',
      'Kablo geçişleri': '2 - 54 delik (rakor seçenekleri)',
    },
    price: 18500,
    category: 'Solar Sistemler',
    stock: 28,
    featured: false,
    isVariantProduct: false,
    tags: ['Tak-çalıştır', 'Pano', 'IP55'],
  },
  // —— 6. AKILLI ENERJİ YÖNETİMİ VE AKSESUARLAR ——
  {
    id: 'tommatech-wifi-lan-4g-dongle',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1232_tommatech-next-generation-4g-dongle-aksesuar_0.jpg',
    sku: 'TT-DONGLE',
    name: 'TommaTech Uzaktan İzleme Antenleri (Dongle Serisi)',
    slogan: 'Sisteminiz Her An, Her Yerde Cebinizde!',
    description: 'İnverterinizin performansını artırmak, uzaktan kontrol etmek ve yazılım güncellemelerini saniyeler içinde yapabilmek için TommaTech Dongle cihazları mükemmel bir çözümdür. Kurulum alanınızdaki internet altyapısına göre Wi-Fi, LAN veya 4G seçeneklerinden birini seçerek, sisteminizi TommaTech Portal (Web ve App) üzerinden 7/24 kesintisiz izleyebilirsiniz.',
    fullDescription: 'İnverterinizin performansını artırmak, uzaktan kontrol etmek ve yazılım güncellemelerini saniyeler içinde yapabilmek için TommaTech Dongle cihazları mükemmel bir çözümdür. Wi-Fi, LAN veya 4G seçenekleri ile TommaTech Portal (Web ve App) üzerinden 7/24 kesintisiz izleme. Tak/Çalıştır (Plug & Play) kurulum, IP65 dış mekan dayanımı ve 5 dakikalık veri yükleme aralıklarıyla anlık aktarım.',
    features: [
      'Tak / Çalıştır (Plug & Play): Herhangi bir uzmanlık gerektirmeden inverter altındaki porta takılarak anında devreye alınır.',
      'Zorlu Şartlara Dayanıklı: IP65 koruma sınıfı sayesinde dış mekan koşullarına tam uyum sağlar.',
      'Veri Güvenliği: Sadece 5 dakikalık veri yükleme aralıklarıyla anlık ve kesintisiz aktarım.',
    ],
    models: 'Dongle Wi-Fi 3.0, Dongle LAN 3.0, Wi-Fi+LAN Dongle 3.0, Wi-Fi Plus Dongle 3.0 ve 4G Dongle (Sim kart destekli).',
    specifications: { 'Koruma': 'IP65', 'Veri aralığı': '5 dk', 'Modeller': 'Wi-Fi 3.0, LAN 3.0, Wi-Fi+LAN 3.0, Wi-Fi Plus 3.0, 4G' },
    price: 850,
    category: 'Hibrit İnverterler',
    stock: 120,
    featured: false,
    isVariantProduct: false,
    tags: ['Wi-Fi', '4G', 'Portal', 'Plug & Play'],
  },
  {
    id: 'tommatech-smart-meter',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1204_ctli-trio-smart-meter-aksesuar_0.png',
    sku: 'TT-SMART-METER',
    name: 'TommaTech Smart Meter (Akıllı Sayaç) Serisi',
    slogan: 'Enerji Tüketiminizde Tam Kontrol ve Hassas Ölçüm!',
    description: 'Güneş enerjisi sisteminizin beyni! TommaTech Smart Meter, evinizin veya işletmenizin şebekeden çektiği ve şebekeye verdiği enerjiyi anlık olarak büyük bir hassasiyetle ölçer. Gelişmiş iletişim protokolleri (RS485/Modbus-RTU) sayesinde inverteriniz ile haberleşerek enerji yönetimini (örneğin; şebekeye enerji vermeyi engelleme veya bataryayı şarj etme) kusursuz şekilde koordine eder. Kullanıcı dostu LCD ekranı ve kompakt yapısıyla sisteminizin ayrılmaz bir parçasıdır.',
    fullDescription: 'Güneş enerjisi sisteminizin beyni! TommaTech Smart Meter, evinizin veya işletmenizin şebekeden çektiği ve şebekeye verdiği enerjiyi anlık olarak büyük bir hassasiyetle ölçer. RS485/Modbus-RTU protokolleri ile inverterinizle haberleşerek enerji yönetimini koordine eder. Geniş çalışma aralığı ve hassas ölçüm sınıfı ile verimliliğinizi artırmanıza yardımcı olur. DIN Ray tipi montaj ile panoya kolay entegrasyon.',
    features: [
      'Geniş Çalışma Aralığı: Hem düşük gerilimlerde hem de geniş sıcaklık aralıklarında sorunsuz çalışma garantisi.',
      'Hassas Ölçüm Sınıfı: Enerji verilerinizi güvenli bir şekilde analiz ederek verimliliğinizi artırmanıza yardımcı olur.',
      'Kompakt ve Hafif: Pano içerisine kolayca monte edilebilen (DIN Ray tipi) estetik ve yer kaplamayan tasarım.',
    ],
    models: 'Uno (Monofaze sistemler için), Trio ve Trio CT (Trifaze sistemler için akım trafolu model).',
    specifications: { 'İletişim': 'RS485 / Modbus-RTU', 'Montaj': 'DIN Ray', 'Modeller': 'Uno (Monofaze), Trio, Trio CT (Trifaze)' },
    price: 1200,
    category: 'Hibrit İnverterler',
    stock: 65,
    featured: false,
    isVariantProduct: false,
    tags: ['Akıllı sayaç', 'Enerji takibi', 'Modbus'],
  },
  {
    id: 'tommatech-eps-box',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/350_tommatech-trio-eps-box_0.jpg',
    sku: 'TT-EPS-BOX',
    name: 'TommaTech EPS Box (Acil Güç Kutusu)',
    slogan: 'Elektrik Kesintilerine Son! Kritik Yükleriniz Asla Durmasın!',
    description: 'TommaTech hibrit inverterlerinizi EPS Box ile destekleyin ve elektrik kesintilerinde bile hayatınıza kesintisiz devam edin. Şebeke elektriği varken evinizi şebekeden besleyen bu akıllı kutu, elektrik kesildiği anda sadece 0.5 saniye gibi inanılmaz bir sürede inverterin EPS (Acil Güç) çıkışına geçiş yapar. Buzdolabı, aydınlatma, modem gibi kritik cihazlarınız kapanmadan çalışmaya devam eder.',
    fullDescription: 'TommaTech hibrit inverterlerinizi EPS Box ile destekleyin; elektrik kesintilerinde hayatınıza kesintisiz devam edin. Şebeke varken evinizi şebekeden besleyen bu akıllı kutu, kesinti anında 0.5 saniye (500 ms) içinde inverterin EPS çıkışına geçiş yapar. IP65 ile -20°C / +60°C arası dış ortam uyumluluğu ve kolay tesisat entegrasyonu.',
    features: [
      'Ultra Hızlı Geçiş: 0.5 saniye (500 ms) geçiş süresi ile enerji kesintisini hissettirmez.',
      'Dış Ortama Uygunluk: IP65 koruma standartı ile -20°C ile +60°C arası geniş çalışma sıcaklığı.',
      'Kolay Kurulum: Dayanıklı yapısı ile tesisata güvenli ve hızlı entegrasyon.',
    ],
    models: 'Uno EPS Box (Monofaze), Trio EPS Box (Trifaze 3x63A) ve Trio EPS Parallel Box (Trifaze 3x160A büyük sistemler için).',
    specifications: { 'Geçiş süresi': '500 ms', 'Koruma': 'IP65', 'Sıcaklık': '-20°C / +60°C', 'Modeller': 'Uno EPS, Trio EPS 3x63A, Trio EPS Parallel 3x160A' },
    price: 2400,
    category: 'Batarya Modülleri',
    stock: 42,
    featured: false,
    isVariantProduct: false,
    tags: ['EPS', 'Acil güç', 'UPS'],
  },
  {
    id: 'tommatech-smart-controller',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1564_smart-controller_0.webp',
    sku: 'TT-SMART-CTRL',
    name: 'TommaTech Smart Controller (Akıllı Kontrolör)',
    slogan: 'Büyük Tesislerin Akıllı ve Merkezi Güç Yöneticisi!',
    description: 'Aynı tesis içerisinde birden çok TommaTech inverterin bulunduğu endüstriyel and ticari projeler için geliştirilmiş profesyonel bir yönetim çözümüdür. 60 adede kadar cihazı tek bir merkezden izlemenizi ve yönetmenizi sağlar. IEC104 protokolü desteği ve kaskad (cascade) bağlantı yapısıyla yerel şebeke uyumluluğunu en üst düzeye çıkarır.',
    fullDescription: 'Endüstriyel ve ticari projelerde birden çok TommaTech inverteri tek merkezden izleme ve yönetme. 60 cihaza kadar genişletilebilir ağ, IEC104 protokolü ve kaskad bağlantı. RS485 (x4), CAN, Ethernet ve kuru kontak portları; 8G/16G TF kart ile büyük veri depolama ve geçmişe dönük analiz imkanı.',
    features: [
      'Çoklu Cihaz Desteği: 60 cihaza kadar genişletilebilir ağ yönetimi.',
      'Büyük Veri (Big Data) Depolama: Sistem verilerini hafızasında tutarak geçmişe dönük akıllı analizler (8G/16G TF kart opsiyonel).',
      'Zengin Arayüzler: RS485 (x4), CAN, Ethernet ve Kuru Kontak (Dry contact) bağlantı portları.',
    ],
    specifications: { 'Cihaz kapasitesi': '60 adede kadar', 'Protokol': 'IEC104', 'Portlar': 'RS485 x4, CAN, Ethernet, Kuru kontak', 'Depolama': '8G/16G TF kart (opsiyonel)' },
    price: 4500,
    category: 'Hibrit İnverterler',
    stock: 18,
    featured: false,
    isVariantProduct: false,
    tags: ['Cascade', 'IEC-104', 'Merkezi yönetim'],
  },
  {
    id: 'tommatech-heatpump-controller',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1564_smart-controller_0.webp',
    sku: 'TT-HP-CTRL',
    name: 'TommaTech Heatpump Controller (Isı Pompası Kontrol Cihazı)',
    slogan: 'Güneş Enerjinizle Isı Pompanızı Konuşturun!',
    description: 'Güneş enerjisi sisteminiz (Fotovoltaik inverterler) ile evinizdeki ısı pompasını entegre ederek enerji yönetimini optimize eden akıllı köprü cihazıdır. Kuru kontak (dry contact) fonksiyonuna sahip ısı pompaları ile haberleşerek; şebeke gücü, batarya kapasitesi veya sizin belirlediğiniz zaman aralıklarına göre sistemi yönetir. Güneşten elde edilen bedava enerji fazlası olduğunda, bu enerjiyi ısı pompanıza yönlendirerek suyu veya evi bedavaya ısıtmanızı sağlar.',
    fullDescription: 'Fotovoltaik inverter ile ısı pompasını entegre eden akıllı köprü. Kuru kontak ile ısı pompası haberleşmesi; şebeke, batarya veya zaman dilimine göre yönetim. Güneş enerjisi fazlasını ısı pompasına yönlendirerek su ve ev ısıtmasında tasarruf. IP65, -25°C / +60°C dış mekan dayanımı.',
    features: [
      'Akıllı Enerji Yönetimi: Elektrik faturasını düşüren, yenilenebilir enerjiden maksimum fayda sağlayan otomasyon.',
      'Dış Mekan Koruması: IP65 standartlarında, -25°C ile +60°C arası zorlu hava şartlarına dayanıklı.',
    ],
    specifications: { 'Koruma': 'IP65', 'Sıcaklık': '-25°C / +60°C', 'Haberleşme': 'Kuru kontak (dry contact)' },
    price: 1800,
    category: 'Isı Pompası ve HVAC',
    stock: 55,
    featured: false,
    isVariantProduct: false,
    tags: ['Isı pompası', 'Güneş entegrasyonu', 'Otomasyon'],
  },
  {
    id: 'tommatech-booster-paralel-box',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1492_tommatech-booster-paralel-box_0.jpg',
    sku: 'TT-BOOSTER-BOX',
    name: 'TommaTech Booster Paralel Box (Batarya Çoklayıcı Kutu)',
    slogan: 'Enerjinizi Katlayın, Özgürlüğü Hissedin!',
    description: 'TommaTech Hightech Power Serisi 5.8 kWh yüksek voltaj lityum bataryalarınızın kapasitesini artırmak istediğinizde ihtiyacınız olan sistem birleştiricidir. General Pack ana bataryanıza, ek Booster Pack bataryaları güvenli ve sorunsuz bir şekilde paralel/seri bağlamanızı sağlar. Enerji ihtiyacınız büyüdükçe sisteminizi esnek bir şekilde genişletmenize (23 kWh\'ye kadar) olanak tanır.',
    fullDescription: 'TommaTech Hightech Power 5.8 kWh lityum bataryaların kapasite artırımı için birleştirici. General Pack + Booster Pack ile güvenli paralel/seri bağlantı; 23 kWh\'ye kadar genişletilebilir sistem. Kompakt ve hafif dizayn; inverter ile batarya (BMS) arasında kesintisiz haberleşme.',
    features: [
      'Sistem Genişletilebilirliği: Minimum alan kaplayarak (kompakt ve hafif dizayn) maksimum kapasite artırımı; 23 kWh\'ye kadar.',
      'Haberleşme: İnverter ile bataryalar (BMS) arasında kesintisiz ve güvenli veri iletişimi.',
    ],
    models: 'General Pack ana batarya + Booster Pack ek bataryalar; 5.8 kWh birim, 23 kWh\'ye kadar sistem.',
    specifications: { 'Birim kapasite': '5.8 kWh (Hightech Power)', 'Maks. sistem': '23 kWh', 'Bağlantı': 'Paralel/seri, BMS uyumlu' },
    price: 3200,
    category: 'Batarya Modülleri',
    stock: 30,
    featured: false,
    isVariantProduct: false,
    tags: ['Paralel', 'Kapasite artırımı', 'Booster Pack'],
  },
  // —— 7. SOLAR DIŞ MEKAN AYDINLATMA ——
  {
    id: 'tommatech-solar-led-yuruyus-yolu',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/kategory_grup/88_tommatech-yuruyus-yolu-solar-led-aydinlatma.jpg',
    sku: 'TT-SOLAR-LED-PATH',
    name: 'TommaTech Yürüyüş Yolu Solar LED Aydınlatma Sistemi',
    slogan: 'Park ve Bahçeleriniz İçin Elektrik Faturasız, Akıllı Aydınlatma!',
    description: 'TommaTech Solar LED Yürüyüş Yolu Aydınlatma Serisi; parklar, bahçeler, site içerileri ve iş yeri çevre aydınlatmaları için tasarlanmış şebekeden tam bağımsız yeşil enerji çözümüdür. Yeni nesil yüksek verimli güneş panelleri ve dahili lityum bataryası sayesinde elektrik faturası derdini tamamen ortadan kaldırır. Üzerindeki entegre mikrodalga sensör ile hareketi algılayarak gücünü akıllıca yönetir ve gece boyunca kesintisiz aydınlatma sağlar.',
    fullDescription: 'Parklar, bahçeler, site ve iş yeri çevre aydınlatması için şebekeden bağımsız solar LED çözümü. Yüksek verimli panel ve dahili lityum batarya (921.6 Wh\'e kadar) ile bulutlu günlerde dahi ışıksız kalmaz. Mikrodalga hareket sensörü ile akıllı güç yönetimi; 10.730–16.650 lümen modele göre. 4 m, 6 m, 8 m, 10 m direk ve 20W / 58W / 90W LED seçenekleri.',
    features: [
      'Akıllı Güç Modu & Sensör: Mikrodalga sensör (hareket algılayıcı) ile uzun süreli ve aktif aydınlatma.',
      'Yüksek Aydınlatma Kapasitesi: Modele göre 10.730 lümenden 16.650 lümene kadar süper parlak LED.',
      'Entegre Lityum Batarya: 921.6 Wh (28.8V/32.0Ah) kapasite ile bulutlu günlerde dahi ışıksız bırakmaz.',
      'Güneş Paneli Entegrasyonu: Direk tepesine monte yüksek verimli panel (örn. 2x100Wp) ile hızlı şarj.',
    ],
    models: '4 m direk 20W LED; 6 m / 8 m direk 58W programlanabilir LED; 6 m / 8 m / 10 m direk 90W programlanabilir LED.',
    specifications: { 'Batarya': '921.6 Wh (28.8V/32Ah)', 'Lümen': '10.730–16.650', 'Direk': '4 m / 6 m / 8 m / 10 m', 'LED güç': '20W / 58W / 90W' },
    price: 12500,
    category: 'Solar Sistemler',
    stock: 24,
    featured: true,
    isVariantProduct: false,
    tags: ['Solar LED', 'Yürüyüş yolu', 'Hareket sensörü'],
  },
  // —— 8. SOLAR YAPI VE MONTAJ SİSTEMLERİ ——
  {
    id: 'tommatech-solar-carport-2car',
    brand: 'TommaTech',
    image: 'https://tommatech.de/images/product/1258_tommatech-2-araclik-solar-otopark-paketi-590wp_0.webp',
    sku: 'TT-CARPORT-2CAR',
    name: 'TommaTech 2 Araçlık Solar Carport (Güneş Panelli Otopark Sistemi)',
    slogan: 'Aracınızı Gölgede Korurken, Güneşten Bedava Şarj Edin!',
    description: 'Güneş enerjisinin kullanım alanını genişletmek için özel olarak tasarlanan TommaTech Solar Carport, sıradan bir otoparkı akıllı bir enerji üretim istasyonuna dönüştürür. Çatısında güneş panellerinin yer aldığı bu estetik çelik konstrüksiyon yapı, elektrikli araç şarj cihazlarıyla tam entegre çalışır. Evinizin veya işyerinizin bahçesine kurarak hem aracınızı güneş ve yağmurdan koruyun hem de kendi elektriğinizi üretin.',
    fullDescription: 'TommaTech Solar Carport; otoparkı güneş enerjisi üretim istasyonuna dönüştüren çelik konstrüksiyon. Aynı anda 2 araç (model AY-CAR-STL-2CAR-590). TommaTech EV Şarj Cihazları ve Smart Meter ile %100 senkronize, aracı doğrudan güneşten şarj. Paslanmaz, rüzgar ve kar yüküne dayanıklı, modern mimari uyumlu tasarım.',
    features: [
      'Kapasite: Aynı anda 2 aracı rahatlıkla barındıran geniş iç hacim (Model: AY-CAR-STL-2CAR-590).',
      'Tam Entegrasyon: TommaTech EV Şarj İstasyonları ve Akıllı Sayaç (Smart Meter) ile %100 senkronize; aracınızı doğrudan güneşten şarj edecek şekilde tasarlanmıştır.',
      'Estetik ve Dayanıklı: Modern mimariyle uyumlu, paslanmaya ve zorlu hava koşullarına (rüzgar, kar yükü) dayanıklı tasarım.',
    ],
    specifications: { 'Kapasite': '2 araç', 'Model': 'AY-CAR-STL-2CAR-590', 'Yapı': 'Çelik konstrüksiyon', 'Entegrasyon': 'EV Şarj + Smart Meter' },
    price: 95000,
    category: 'Solar Sistemler',
    stock: 5,
    featured: true,
    isVariantProduct: false,
    tags: ['Carport', 'Solar', 'EV', '2 araçlık'],
  },

  // —— 6. Şarj İstasyonu Yönetim Yazılımları ve Ticari Çözümler ——
  {
    id: 'pufusu-sarj-istasyonu-yonetim-yazilimi',
    brand: 'PUFUSU',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'PUFUSU-YONETIM',
    name: 'Şarj İstasyonu Yönetim ve Raporlama Arayüzü',
    slogan: 'Kurumsal Şarj İstasyonlarınızı Tek Ekrandan Yönetin, Raporlayın ve Faturalandırın!',
    description: 'Elektromarketim EMEV Kurumsal/Ticari şarj istasyonları (OCPP 1.6 destekli) için geliştirilmiş profesyonel yönetim ve raporlama yazılımı. Cihazları bilgisayar veya mobil tarayıcı üzerinden kontrol edin; kullanıcı/RFID yönetimi, tüketim raporları ve uzaktan konfigürasyon tek arayüzde. Siteler, iş yerleri ve otoparklar için entegre ağ yönetim çözümü.',
    fullDescription: 'PUFUSU, Elektromarketim EMEV Kurumsal/Ticari şarj istasyonları (OCPP 1.6 destekli modeller) için geliştirilmiş, cihazların bilgisayar veya mobil cihazlardaki web tarayıcısı üzerinden kontrol edilmesini sağlayan profesyonel bir yönetim ve raporlama yazılımıdır. E-ticaret sitemizde bu sistemi, kurumsal donanımlarla birlikte entegre bir "Ağ Yönetim Çözümü" olarak sunuyoruz.\n\nGelişmiş kullanıcı ve RFID yönetimi: Site yöneticileri veya işletme sahipleri, arayüz üzerinden kullanıcı ekleyip çıkarabilir; belirli müşterilere veya personellere ait RFID kartlarını (ör. "İsa RFID", "Müşteri" vb.) sisteme tanımlayıp yetkilendirebilir.\n\nDetaylı tüketim raporlaması: Sisteme bağlı tüm şarj istasyonlarının işlem geçmişi tek tıkla görüntülenir. Raporlarda şarjın başlama-bitiş zamanları, inaktivite (bekleme) süreleri ve anlık/toplam tüketilen enerji (kWh) miktarları listelenir; anlık veya ay sonu kullanım raporu olarak çekilebilir.\n\nUzaktan cihaz konfigürasyonu: İstasyonlar Wi-Fi, Ethernet veya 4G ile internete bağlı olduğundan, yöneticiler tarayıcı üzerinden cihazın maksimum amper (A) ve güç (Watt) limitlerini uzaktan ayarlayabilir ve anlık internet durumunu görüntüleyebilir.\n\nTam ticari entegrasyon: OCPP 1.6 ticari özellik desteği sayesinde şarj istasyonları faturalandırma ve diğer ticari yönetim sistemlerine kolayca entegre edilebilir. Halka açık ticari şarj istasyonu kurmak isteyen girişimciler için ideal altyapı. Elektromarketim EMEV-22-3F32-KT2 gibi kurumsal cihazlarla birlikte ticari kullanıma hazır yazılım desteği olarak sunulmaktadır.',
    features: [
      'Gelişmiş kullanıcı ve RFID yönetimi: Kullanıcı ekleme/çıkarma, RFID kart tanımlama ve yetkilendirme (isimlendirme ile kolay yönetim).',
      'Detaylı tüketim raporlaması: Tüm istasyonların işlem geçmişi tek tıkla; şarj başlama-bitiş, inaktivite süreleri, anlık/toplam kWh; anlık veya ay sonu raporu.',
      'Uzaktan cihaz konfigürasyonu: Maksimum amper (A) ve güç (W) limitleri tarayıcı üzerinden; Wi-Fi, Ethernet veya 4G ile anlık durum görüntüleme.',
      'Tam ticari entegrasyon: OCPP 1.6 ile faturalandırma ve yönetim sistemlerine entegrasyon; halka açık ticari şarj için ideal altyapı.',
    ],
    warranty: 'Kurumsal cihazlarla birlikte ticari kullanıma hazır yazılım desteği sunulmaktadır. Detaylı lisans ve destek için iletişime geçiniz.',
    models: 'OCPP 1.6 destekli EMEV Kurumsal/Ticari şarj istasyonları ile uyumlu.',
    specifications: {
      'Protokol': 'OCPP 1.6',
      'Erişim': 'Web tarayıcı (bilgisayar veya mobil)',
      'Yönetim': 'Kullanıcı, RFID, uzaktan konfigürasyon',
      'Raporlama': 'Tüketim (kWh), işlem geçmişi, ay sonu raporları',
      'Entegrasyon': 'Faturalandırma ve ticari yönetim sistemleri',
    },
    price: 0,
    category: 'Enerji Yönetimi',
    stock: 1,
    featured: true,
    isVariantProduct: false,
    tags: ['PUFUSU', 'OCPP 1.6', 'Kurumsal', 'Yönetim yazılımı', 'Raporlama', 'RFID'],
  },

  // —— Araç Elektrik Aktarım (V2L / C2L) Adaptörleri ve Dönüştürücüler ——
  {
    id: 'hims-v2l-tek-priz',
    brand: 'Hims',
    image: '/images/products/hims-hcv2l-01-1.jpg',
    sku: 'HCV2L-0X',
    name: 'V2L (Vehicle to Load) Adaptör - Tek Priz',
    description: 'Aracınızdan 230V elektrik almanızı sağlayan tek çıkışlı V2L adaptörü. Kompakt tasarım, kablosuz doğrudan bağlantı. Taşıma çantası dahil.',
    price: 2415,
    category: 'Adaptörler',
    stock: 50,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: 'hyundai-kia', label: 'Hyundai, Kia & Ssangyong', price: 2415, sku: 'HCV2L-01' },
      { key: 'mg', label: 'MG', price: 2415, sku: 'HCV2L-02' },
      { key: 'byd-skywell', label: 'BYD & Skywell', price: 2415, sku: 'HCV2L-03' },
    ],
    tags: ['V2L', 'Tek Priz', 'Hims', 'Kamp'],
    specifications: {
      'Tip': 'Tek Çıkışlı (Kablosuz)',
      'Gerilim': '230 V',
      'Maksimum Akım': '16 A',
      'Maksimum Güç': '3.7 kW',
      'Koruma': 'Aşırı akım ve ısı koruması'
    },
  },
  {
    id: 'hims-v2l-3lu-uzatmali',
    brand: 'Hims',
    image: '/images/products/hims-hcv2l-31-1.jpg',
    sku: 'HCV2L-3X',
    name: 'V2L (Vehicle to Load) Adaptör - 3\'lü Uzatmalı',
    description: 'Aracınızdan 230V elektrik almanızı sağlayan 3 metre uzatmalı ve 3 prizli V2L adaptörü. Aynı anda birden fazla cihaz desteği. Taşıma çantası dahil.',
    price: 3348,
    category: 'Adaptörler',
    stock: 50,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: 'hyundai-kia', label: 'Hyundai, Kia & Ssangyong', price: 3348, sku: 'HCV2L-31' },
      { key: 'mg', label: 'MG', price: 3348, sku: 'HCV2L-32' },
      { key: 'byd-skywell', label: 'BYD & Skywell', price: 3348, sku: 'HCV2L-33' },
      { key: 'ssangyong-torres', label: 'Ssangyong Torres', price: 3348, sku: 'HCV2L-34' },
    ],
    tags: ['V2L', '3\'lü Priz', 'Hims', '3 Metre', 'Kamp'],
    specifications: {
      'Tip': '3\'lü Uzatmalı',
      'Kablo Uzunluğu': '3 Metre',
      'Priz Sayısı': '3 Adet',
      'Gerilim': '230 V',
      'Maksimum Akım': '16 A',
      'Maksimum Güç': '3.7 kW',
      'Koruma': 'Aşırı ısınma ve yüksek akım koruması'
    },
  },
  {
    id: 'hims-c2l-adaptor-serisi',
    brand: 'Hims',
    image: '/images/products/hims-hcc2l-13-1.webp',
    sku: 'HIMS-C2L-VAR',
    name: 'Hims C2L (Charger to Load) Adaptör Serisi',
    description: 'Şarj istasyonu soketini ev tipi prize dönüştürerek doğrudan 220V elektrik almanızı sağlar. Standart ve kablolu seçenekler mevcuttur.',
    price: 2275, // 65 Euro conversion
    category: 'Adaptörler',
    stock: 40,
    featured: true,
    isVariantProduct: true,
    variants: [
      { key: 'std', label: 'Standart Kablosuz (HCC2L-01)', price: 2275, sku: 'HCC2L-01' },
      { key: '3m-tek', label: '3M Kablolu Tek Priz (HCC2L-13)', price: 2695, sku: 'HCC2L-13' },
      { key: '3m-cift', label: '3M Kablolu Çift Priz (HCC2L-23)', price: 2975, sku: 'HCC2L-23' },
      { key: '3m-uc', label: '3M Kablolu Üç Priz (HCC2L-31)', price: 3185, sku: 'HCC2L-31' },
    ],
    tags: ['C2L', 'Hims', 'Adaptör', '220V'],
    specifications: {
      'Giriş': 'AC Şarj İstasyonu (Tip 2)',
      'Çıkış': '220V Ev Tipi Priz',
      'Kablo': '0 - 3 m seçenekli',
    },
  },
  {
    id: 'hims-cee-donusturucu-serisi',
    brand: 'Hims',
    image: '/images/products/hims-hcca-tm16-30-1.jpg',
    sku: 'HIMS-CEE-VAR',
    name: 'Hims CEE Norm Sanayi Tipi Dönüştürücü Serisi',
    description: 'Sanayi tipi (CEE) fişlerden şarj cihazlarınıza güvenli enerji aktarımı için yüksek akım kapasiteli dönüştürücüler. 16/32A seçenekleri.',
    price: 792,
    category: 'Fiş / Priz Dönüştürücüler',
    stock: 35,
    featured: false,
    isVariantProduct: true,
    variants: [
      { key: '16a-32a', label: '1/16A Fiş -> 5/32A Priz (3.6 kW)', price: 792, sku: 'HCCA-TM16-30-F' },
      { key: '32a-32a', label: '3/32A Fiş -> 5/32A Priz (7.2 kW)', price: 1076, sku: 'HCCA-TM32-30-F' },
      { key: '16a-32a-3', label: '1/16A Fiş -> 3/32A Priz', price: 792, sku: 'HCCA-MM3216-F' },
    ],
    tags: ['CEE', 'Hims', 'Dönüştürücü', 'Sanayi'],
    specifications: {
      'Kablo': '3x2,5 TTR / 3x6 TTR',
      'Uzunluk': '30 cm',
      'Garanti': '2 Yıl',
    },
  },

  // —— Elektrikli Araç Şarj İstasyonu Standları, Çantalar ve Aksesuarlar ——
  {
    id: 'emma-arac-sarj-zemin-montaj-standlari',
    brand: 'EMMA',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'EMMA-AS1',
    name: 'Araç Şarj İstasyonu Zemin Montaj Standları',
    slogan: 'Açık Otopark ve Bahçede Şarj İstasyonunuzu Güvenle Konumlandırın!',
    description: 'Duvara monte edilemeyen açık otopark, bahçe veya ticari alanlar için zemin montaj standı. Şapkalı (EMMA-AS1) veya şapkasız (EMMA-A1) model. 146 cm uzunluk, statik boya kaplama, dahili sigorta bölmesi ve kablo toplama aparatı. Zemin montaj vidaları ile beton/sert zemin sabitleme.',
    fullDescription: 'Şarj istasyonunuzun duvara monte edilemeyeceği açık otopark, bahçe veya ticari alanlar için özel olarak tasarlanmış zemin montaj standıdır. Zemin montaj vidaları sayesinde istasyonunuzu güvenli bir şekilde konumlandırmanızı sağlar ve kablo kargaşasından kurtulmanıza yardımcı olur.\n\nFiziksel özellikler: Toplam 146 cm uzunluk. Zorlu dış ortam koşullarına karşı ekstra dayanıklılık sağlayan özel statik boya kaplama. Dahili sigorta montaj bölmesi (şeffaf kapaklı). Entegre şarj kablosu toplama aparatı (askı kancaları). Zemin montaj flanşı ile beton veya sert zeminlere sabitlenir.\n\nModeller (KDV hariç EUR): EMMA-A1 Şapkasız 290€. EMMA-AS1 Şapkalı 300€.',
    features: [
      '146 cm uzunluk; statik boya ile dış ortama dayanıklı.',
      'Dahili sigorta bölmesi (şeffaf kapaklı) ile güvenlik ve estetik.',
      'Entegre kablo toplama aparatı; kabloların yerde sürünmesi engellenir.',
      'Zemin montaj flanşı ile beton/sert zemin sabitleme.',
    ],
    warranty: 'Üretici garantisi.',
    models: 'EMMA-A1 (Şapkasız) 290€. EMMA-AS1 (Şapkalı) 300€. Fiyatlar KDV hariç EUR.',
    specifications: {
      'Uzunluk': '146 cm',
      'Modeller': 'EMMA-A1 (şapkasız), EMMA-AS1 (şapkalı)',
      'Montaj': 'Zemin (beton/sert zemin)',
      'Fiyat (KDV hariç)': '290€ – 300€',
    },
    price: 12200,
    category: 'EV Şarj Aksesuarları',
    stock: 25,
    featured: true,
    isVariantProduct: false,
    tags: ['EMMA', 'Zemin standı', 'Şarj istasyonu', 'Açık otopark'],
  },
  {
    id: 'hims-eva-hardcase-tasima-cantalari',
    brand: 'Hims',
    images: [
      '/images/products/hims-hcb4010-1.jpg',
      '/images/products/hims-hcb4010-2.jpg',
      '/images/products/hims-hcb4010-3.jpg',
      '/images/products/hims-hcb4010-4.jpg',
      '/images/products/hims-hcb4010-5.jpg',
    ],

    image: '/images/products/hims-hcb4010-1.jpg',
    sku: 'HCB4010',
    name: 'Elektrikli Araç Şarj Kablosu Çantası',
    slogan: 'Şarj Kabloları ve Taşınabilir İstasyonlarınızı Güvenle Taşıyın!',
    description: 'Hims HCB4010 elektrikli araç şarj kablo taşıma çantası; Tip 2 kablolarınızı düzenli, kuru ve darbelere karşı korumalı taşımanız için. Su geçirmez Imperteks kumaş, EVA sert taban, 40×40×10 cm.',
    fullDescription: `Hims HCB4010, elektrikli araç şarj kablolarınızı düzenli ve güvenli taşımak için tasarlanmış, su geçirmez ve darbeye dayanıklı bir taşıma çantasıdır.Tip 2(Type 2) şarj kablolarınızı yağmur, nem ve çarpmalara karşı koruyarak hem bagajda hem garajda uzun ömürlü kullanım sağlar.

Kaliteli ve Güvenli Kullanım
• Imperteks kumaş: Su geçirmez, sıvı emmeyen yapı; kabloların kuru kalmasını sağlar.
• EVA sert taban(hardcase): Darbelere, sıkışmaya ve ezilmeye karşı ek koruma.
• Suya dayanıklı fermuar: Ani yağmur veya nemli ortamlarda içeriğin korunması.
• İç askılar ve bölme düzeni: Kabloların çanta içinde sabit kalması, sallanmadan taşınması.
• Ergonomik taşıma kulpları: Sağlam ve rahat taşıma.

Kullanım Alanları
• Araç bagajında kablo taşıma ve saklama.
• Garaj veya iş yerinde düzenli muhafaza.
• Seyahat ve şarj noktası değişimlerinde güvenli taşıma.
• 2, 3, 5, 7, 8 ve 10 metre uzunluğundaki Tip 2 kablolar için uygundur.

  Siyah, sade tasarımı ile hem günlük kullanıma hem profesyonel kullanıma uygun bir aksesuardır.`,
    features: [
      'Su geçirmez Imperteks kumaş; kablolar kuru ve temiz kalır.',
      'EVA sert taban ve suya dayanıklı fermuar.',
      '40×40×10 cm; 2–10 m arası Tip 2 kablolar için uygun.',
      'İç askı ve bölme düzeni ile kablolar sabit taşınır.',
      'Ergonomik ve dayanıklı taşıma kulpları.',
    ],
    warranty: 'Üretici garantisi.',
    specifications: {
      'Dış ölçü': '40 × 40 × 10 cm',
      'Kumaş': 'Su geçirmez Imperteks kumaş',
      'Uygun kablo uzunlukları': '2, 3, 5, 7, 8, 10 m',
    },
    price: 1350,
    productFamilyKey: 'HCB4010',

    category: 'EV Şarj Aksesuarları',
    stock: 60,
    featured: true,
    isVariantProduct: false,
    tags: ['Taşıma çantası', 'EVA Hardcase', 'Şarj kablosu', 'V2L'],
  },
  {
    id: 'emma-d01-duvar-aski-aparati',
    brand: 'EMMA',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'EMMA-D01',
    name: 'Duvar Askı Aparatı (Priz Tutucu)',
    slogan: 'Şarj Kablosunu Duvarda Düzenli ve Korunaklı Tutun!',
    description: 'Kablolu şarj istasyonları veya harici şarj kablolarının kullanılmadığı zamanlarda düzenli kalmasını sağlayan duvar montaj soket tutucu. Type 2 (T2) soketlerle uyumlu; yağmur, toz ve kire karşı koruma. Kompakt yapı, duvar veya stand üzerine kolay montaj.',
    fullDescription: 'Kablolu şarj istasyonlarının veya harici şarj kablolarının kullanılmadığı zamanlarda düzenli ve temiz kalmasını sağlayan, duvara monte edilen ergonomik soket tutucu aparat.\n\nAvrupa standartlarındaki tüm Type 2 (T2) soketlerle birebir uyumludur. Soketinizi yağmur, toz ve kire karşı koruyarak kullanım ömrünü uzatır. Kompakt yapısı sayesinde duvarda veya stand üzerinde kolayca monte edilebilir.\n\nFiyat (KDV hariç EUR): EMMA-D01 25€.',
    features: [
      'Type 2 (T2) soketlerle tam uyumluluk.',
      'Yağmur, toz ve kire karşı soket koruması.',
      'Kompakt yapı; duvar veya stand üzerine kolay montaj.',
    ],
    warranty: 'Üretici garantisi.',
    models: 'EMMA-D01. Fiyat 25€ KDV hariç EUR.',
    specifications: {
      'Ürün kodu': 'EMMA-D01',
      'Uyumluluk': 'Type 2 (T2) soket',
      'Montaj': 'Duvar veya stand',
      'Fiyat (KDV hariç)': '25€',
    },
    price: 1050,
    category: 'EV Şarj Aksesuarları',
    stock: 45,
    featured: false,
    isVariantProduct: false,
    tags: ['EMMA', 'Duvar aparatı', 'Type 2', 'Priz tutucu'],
  },

  // —— Boş kategoriler için mock ürünler (içerik tamamlama) ——
  // AC Araç Şarj İstasyonları
  {
    id: 'mock-ac-arac-sarj-istasyonu',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-AC-01',
    name: 'AC Tipi Elektrikli Araç Şarj İstasyonu (7.4 kW)',
    description: 'Ev ve ofis kullanımı için tek fazlı AC şarj istasyonu. Tip 2 soket, akıllı şarj ve güvenlik özellikleri.',
    price: 9500,
    category: 'AC Şarj İstasyonları',
    stock: 25,
    featured: false,
    isVariantProduct: false,
    tags: ['AC', '7.4 kW', 'Tip 2'],
  },
  // DC Araç Şarj İstasyonları
  {
    id: 'mock-dc-hizli-sarj-istasyonu',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-DC-01',
    name: 'DC Hızlı Şarj İstasyonu (50 kW)',
    description: 'Otopark ve ticari kullanım için DC hızlı şarj ünitesi. CCS uyumlu, orta güç segmenti.',
    price: 185000,
    category: 'AC Şarj İstasyonları',
    stock: 5,
    featured: false,
    isVariantProduct: false,
    tags: ['DC', '50 kW', 'Hızlı şarj'],
  },
  // Araç Şarj Kabloları — Weidmüller (Elektromarketim kategorisi)
  {
    id: 'weidmuller-ca-t2wb-55m-istasyon-kablosu',
    brand: 'Weidmüller',
    image: '/images/products/placeholder.png',
    sku: '2791350000',
    name: 'İstasyon Kablosu (CA-T2WB-5.5M-11/3P-R-BBG)',
    description: 'Weidmüller elektrikli araç şarj istasyonu bağlantı kablosu. 5.5 m uzunluk, Tip 2 uyumlu; istasyon ile araç arasında güvenli bağlantı.',
    fullDescription: 'Weidmüller İstasyon Kablosu Weidmüller istasyon kablosu , elektrikli araç şarj istasyonu kurmak veya satmak isteyenler i çin özel olarak geli ştirilmiştir. Bu modelin bir ucu a ç ık kablo, diğer ucu ise Tip 2 konnekt ör...',
    features: [
      '5.5 m uzunluk.',
      'Tip 2 (Type 2) uyumlu.',
      'İstasyon–araç bağlantı kablosu.',
      'Weidmüller kalitesi.',
    ],
    specifications: { 'Model': 'CA-T2WB-5.5M-11/3P-R-BBG', 'Uzunluk': '5.5 m', 'Tip': 'Tip 2 istasyon kablosu', 'Marka': 'Weidmüller' },
    price: 2708,
    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 35,
    featured: false,
    isVariantProduct: false,
    tags: ['Weidmüller', 'Tip 2', 'İstasyon kablosu', '5.5 m'],
  },

  // Araç Şarj Kabloları — Hims EMEF-22T2 22 kW Tip 2 (Elektromarketim verisi, fiyat -100 TL)
  {
    id: 'hims-emef-22t2-sb-2',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-2-1.jpg',
      '/images/products/hims-emef-22t2-sb-2-2.jpg',
      '/images/products/hims-emef-22t2-sb-2-3.jpg',
      '/images/products/hims-emef-22t2-sb-2-4.jpg',
      '/images/products/hims-emef-22t2-sb-2-5.jpg',
      '/images/products/hims-emef-22t2-sb-2-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-2-1.jpg',
    sku: 'EMEF-22T2-SB-2',
    name: '22kW Tip 2 Beyaz Soketli 2m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. Avrupa ve Türkiye\'deki tüm Tip 2 soketler ile uyumlu. Gümüş kontaklar, aşırı ısınma önlemleri.',
    fullDescription: 'Hims 22 kW Tip 2 elektrikli araç şarj kablosu, Türkiye ve Avrupa\'daki tüm Tip 2 soketlerle uyumludur. Düz yapı sayesinde taşınması kolaydır. Gümüş kontaklar ve %100 bakır iletken ile yüksek iletkenlik ve ısınma önlemi sağlanır; şarj cihazı ile aracın güvenliği desteklenir. Hims şarj kablosu garantisi teslim tarihinden itibaren 2 yıldır; tüm parçalar dahil, işçilik ve üretim hataları kapsamdadır.',
    features: [
      '22 kW yüksek hızlı şarj, Trifaze 32A.',
      'Tip 2 – Tip 2 Avrupa standardı; tüm istasyonlarla uyumlu.',
      'Gümüş kontaklar ile yüksek iletkenlik ve ısınma önlemi.',
      'Geniş çalışma sıcaklığı ve yüksek nem toleransı.',
    ],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '2 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '2 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 5578,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-3',
    brand: 'Hims',
    image: '/images/products/hims-emef-22t2-sb-3-1.jpg',
    images: [
      '/images/products/hims-emef-22t2-sb-3-1.jpg',
      '/images/products/hims-emef-22t2-sb-3-2.jpg',
      '/images/products/hims-emef-22t2-sb-3-3.jpg',
      '/images/products/hims-emef-22t2-sb-3-4.jpg',
      '/images/products/hims-emef-22t2-sb-3-5.jpg',
    ],
    sku: 'EMEF-22T2-SB-3',
    name: '22kW Tip 2 Beyaz Soketli 3m Elektrikli Araç Şarj Kablosu',
    description: 'Türkiye\'de üretilen tüm elektrikli araçlar ile uyumlu. 22 kW Tip 2 şarj kablosu, Avrupa ve Türkiye\'deki tüm Tip 2 soketlerle uyumlu. 3 m, gümüş kontaklar, 2 yıl garanti.',
    fullDescription: `Türkiye'de üretilen tüm elektrikli araçlar ile uyumludur.

22 kW araç şarj kablosu hem Avrupa hem de Türkiye'deki tüm tip 2 soketler ile kullanıma uygundur.

Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir.

Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır.

  Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir.Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır.Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.

Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir.Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar.Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.

Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır.Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz.Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır.Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.

Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir.Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir.`,
    descriptionSections: [
      { title: 'Elektrikli Araç Şarj Kablosu Özelliği Nedir?', content: 'Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.' },
      { title: 'Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir?', content: 'Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır. Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.' },
      { title: 'Elektrikli Araç Şarj Kablosu Nasıl Seçilir?', content: 'Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir. Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir.' },
    ],
    features: [
      '22 kW güç aktarım kapasitesi, Trifaze 32A.',
      'Tip 2 Avrupa standardı; Türkiye ve Avrupa\'daki tüm Tip 2 soketlerle uyumlu.',
      'Gümüş kontak kaplama, %100 bakır iletken; ısınma önlemi.',
      '3 m kablo uzunluğu, 5x6 kesit.',
      '2 yıl garanti (teslim tarihinden itibaren).',
    ],
    warranty: '2 yıl garanti. Ürünün tüm parçaları dahil; işçilik ve üretim hataları kapsamdadır.',
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz', '3 m'],
  },
  {
    id: 'hims-emef-22t2-sb-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-5-1.jpg',
      '/images/products/hims-emef-22t2-sb-5-2.jpg',
      '/images/products/hims-emef-22t2-sb-5-3.jpg',
      '/images/products/hims-emef-22t2-sb-5-4.jpg',
      '/images/products/hims-emef-22t2-sb-5-5.jpg',
      '/images/products/hims-emef-22t2-sb-5-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-5-1.jpg',
    sku: 'EMEF-22T2-SB-5',
    name: '22kW Tip 2 Beyaz Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: 'Türkiye\'de üretilen tüm elektrikli araçlar ile uyumlu. 22 kW araç şarj kablosu hem Avrupa hem Türkiye\'deki tüm Tip 2 soketler ile kullanıma uygundur. Gümüş kontaklar, 2 yıl garanti.',
    fullDescription: 'Hims 22kw Destekli Siyah 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 5 m Kablo Rengi : Siyah Ürün Etiketleri Hafta Sonu Fırsatları , Hafta Ortası İndirimleri Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON',
    features: [
      '22 kW güç aktarım kapasitesi, Trifaze 32A.',
      'Tip 2 Avrupa standardı; Türkiye ve Avrupa\'daki tüm Tip 2 soketlerle uyumlu.',
      'Gümüş kontak kaplama, %100 bakır iletken; ısınma önlemi.',
      'Çalışma sıcaklığı -25°C ile +55°C; %95\'e kadar yoğuşmasız nem.',
      '2 yıl garanti (teslim tarihinden itibaren).',
    ],
    warranty: '2 yıl garanti. Ürünün tüm parçaları dahil; işçilik ve üretim hataları kapsamdadır.',
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '5 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-5-cnt',
    brand: 'Hims',
    image: '/images/products/hims-emef-22t2-sb-5-cnt-1.jpg',
    images: [
      '/images/products/hims-emef-22t2-sb-5-cnt-1.jpg',
      '/images/products/hims-emef-22t2-sb-5-cnt-2.jpg',
      '/images/products/hims-emef-22t2-sb-5-cnt-3.jpg',
      '/images/products/hims-emef-22t2-sb-5-cnt-4.jpg',
      '/images/products/hims-emef-22t2-sb-5-cnt-5.jpg',
      '/images/products/hims-emef-22t2-sb-5-cnt-6.png'
    ],
    sku: 'EMEF-22T2-SB-5-CNT',
    name: '22kW Tip 2 Soketli 5m Çantalı Elektrikli Araç Şarj Kablosu',
    description: 'Hims 22 kW 5m elektrikli araç şarj kablosu + şarj kablo çantası. Tip 2 soket, gümüş kontaklar, Imperteks çanta. Paket: 5m şarj kablosu ve şarj kablo çantası.',
    fullDescription: `Hims 22kW Destekli 5m Çantalı Elektrikli Araç Şarj Kablosu

Not: Ürün paket içeriğinde 5m şarj kablosu ve şarj kablo çantası bulunmaktadır.

  Hims 22kW 5m Araç Şarj Kablosu
Hims markasının ürettiği 5m elektrikli araç şarj kablosu, aracınızı güvenli ve verimli bir şekilde şarj etmenizi sağlar.

5 metre uzunluğundaki Hims elektrikli araç şarj kablosu, tüm şarj istasyonlarıyla uyumludur ve sorunsuz kullanım sunar.

22kW gücündeki şarj kablosu, Avrupa ve Türkiye'deki tüm Tip 2 soketlere uygun olarak tasarlanmıştır.

Esnek ve düz yapısı sayesinde kolay taşınabilir.

Yüksek akım taşıyabilen gümüş kontaklı bağlantı uçları, üstün iletkenlik sağlayarak ısınmayı önler ve hem şarj cihazının hem de aracınızın güvenliğini maksimum seviyede korur.

Hims Araç Şarj Kablo Çantası
Hims elektrikli araç şarj kablo taşıma çantası, araç şarj kablolarınızı düzenli ve güvenli bir şekilde saklamanız için tasarlanmıştır.

✓ Sıvıya dayanıklı yapısı, darbelere karşı ekstra koruma sağlaması ve ergonomik taşıma detaylarıyla günlük kullanımda büyük bir avantaj sunar.

✓ Özel Imperteks kumaş kaplaması sayesinde hem sağlam hem de estetik bir ürüne sahip olabilirsiniz.

Hims araç şarj kablo çantası, yüksek kaliteli Imperteks kumaş kullanılarak üretilmiştir.Bu kumaş, su geçirmez özellikte olup, aynı zamanda sıvıyı emmeyerek içerideki kabloların kuru kalmasını sağlar.

✓ Günlük kullanımda suya, neme ve kire karşı üstün koruma sunar.Araç şarj kablolarınızı taşırken, çarpmalara, sıkışmalara ve dış etkenlere karşı güvenli bir şekilde muhafaza edebilirsiniz.

✓ Eva hardcase olması sayesinde kablo çantası, suya dayanıklı fermuar sistemine sahiptir.Böylece ani yağmurlarda veya nemli ortamlarda bile kablolarınızı güvenle koruyabilirsiniz.

✓ 40 x 40 x 10 cm ölçülerinde olan bu taşıma çantası, 2, 3, 5, 7, 8 ve 10 metre uzunluğundaki kablolar için uygundur.İç bölme düzeni, kabloların içerde sallanmadan taşınmasını sağlar.

✓ Çanta içerisinde kablolarınızın sabit kalmasını sağlayan özel askılar bulunur.Bu sayede kablolarınız hareket etmeyecek ve düzenli bir şekilde yerleştirilecektir.

Ergonomik ve sağlam taşıma kulpları, çantayı kolay bir şekilde taşımanıza olanak tanır.

Siyah renkli sade ama modern tasarımıyla hem profesyonel kullanımlara hem de günlük ihtiyaçlara uygun bir çantadır.

Araç bagajında, garajda veya iş yerinde rahatça saklanabilir.

Bu su geçirmez elektrikli araba şarj kablo taşıma çantası, kablolarınızı düzenli, güvenli ve uzun ömürlü bir şekilde saklamak için en ideal üründür.

Şık tasarımı, dayanıklı Imperteks kumaşı ve üstün koruma özellikleriyle günlük hayatta vazgeçilmez bir yardımcıdır.

  Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir.Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır.Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.

`,
    features: [
      '22 kW güç aktarım kapasitesi, Trifaze 32A.',
      'Tip 2 Avrupa standardı; Türkiye ve Avrupa\'daki tüm Tip 2 soketlerle uyumlu.',
      'Gümüş kontak kaplama, %100 bakır iletken; ısınma önlemi.',
      'Çalışma sıcaklığı -25°C ile +55°C; %95\'e kadar yoğuşmasız nem.',
      'Paket: 5m şarj kablosu + şarj kablo çantası.',
      'Imperteks su geçirmez çanta, 40x40x10 cm; 2–10 m kablolar için uygun.',
      '2 yıl garanti (teslim tarihinden itibaren).',
    ],
    warranty: '2 yıl garanti. Ürünün tüm parçaları dahil; işçilik ve üretim hataları kapsamdadır.',
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Ölçü': '40x40x10 cm',
      'Kumaş Tipi': 'Su geçirmez Imperteks kumaş',
      'Kablo Rengi': 'Siyah',
      'Aksesuar': 'Çantalı',
      'Kablo Uzunluğu': '5 m'
    },
    price: 7295,
    productFamilyKey: 'EMEF-22T2-SB-5-CNT',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: true,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Çantalı', '5 m'],
  },
  {
    id: 'hims-emef-22t2-sb-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-7-1.jpg',
      '/images/products/hims-emef-22t2-sb-7-2.jpg',
      '/images/products/hims-emef-22t2-sb-7-3.jpg',
      '/images/products/hims-emef-22t2-sb-7-4.jpg',
      '/images/products/hims-emef-22t2-sb-7-5.jpg',
      '/images/products/hims-emef-22t2-sb-7-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-7-1.jpg',
    sku: 'EMEF-22T2-SB-7',
    name: '22kW Tip 2 Beyaz Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. 7 m uzunluk, beyaz kılıf.',
    fullDescription: 'Hims 22kw Destekli Siyah 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 7 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DAT',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', 'Gümüş kontaklar, aşırı ısınma önlemleri.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '7 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-8',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-8-1.jpg',
      '/images/products/hims-emef-22t2-ss-8-2.jpg',
      '/images/products/hims-emef-22t2-ss-8-3.jpg',
      '/images/products/hims-emef-22t2-ss-8-4.jpg',
      '/images/products/hims-emef-22t2-ss-8-5.jpg',
      '/images/products/hims-emef-22t2-ss-8-6.png'
    ],
    image: '/images/products/hims-emef-22t2-ss-8-1.jpg',
    sku: 'EMEF-22T2-SB-8',
    name: '22kW Tip 2 Beyaz Soketli 8m Elektrikli Araç Şarj Kablosu',
    description: 'Türkiye\'de üretilen tüm elektrikli araçlar ile uyumlu. 22 kW Tip 2 şarj kablosu, Avrupa ve Türkiye\'deki tüm Tip 2 soketlerle uyumlu. Beyaz veya siyah soket seçeneği, 8 m, 2 yıl garanti.',
    fullDescription: `Hims 22kw Destekli Siyah 8 Metre Elektrikli Araç Şarj Kablosu

Türkiye'de üretilen tüm elektrikli araçlar ile uyumludur.

22 kW araç şarj kablosu hem Avrupa hem de Türkiye'deki tüm tip 2 soketler ile kullanıma uygundur.

Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir.

Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır.

  Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir.Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır.Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.

Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir.Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar.Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.

Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır.Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz.Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır.Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.

Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir.Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir.`,
    descriptionSections: [
      { title: 'Elektrikli Araç Şarj Kablosu Özelliği Nedir?', content: 'Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.' },
      { title: 'Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir?', content: 'Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır. Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.' },
      { title: 'Elektrikli Araç Şarj Kablosu Nasıl Seçilir?', content: 'Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir. Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir.' },
    ],
    features: [
      '22 kW güç aktarım kapasitesi, Trifaze 32A.',
      'Tip 2 Avrupa standardı; Türkiye ve Avrupa\'daki tüm Tip 2 soketlerle uyumlu.',
      'Gümüş kontak kaplama, %100 bakır iletken; ısınma önlemi.',
      '8 m kablo uzunluğu, 5x6 kesit. Beyaz veya siyah soket seçeneği.',
      '2 yıl garanti (teslim tarihinden itibaren).',
    ],
    warranty: '2 yıl garanti. Ürünün tüm parçaları dahil; işçilik ve üretim hataları kapsamdadır.',
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '8 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '8 m',
      'Kablo Rengi': 'Siyah'
    },
    imagesByVariant: [
      ['/images/products/hims-emef-22t2-sb-8-1.jpg', '/images/products/hims-emef-22t2-sb-8-2.jpg', '/images/products/hims-emef-22t2-sb-8-3.jpg', '/images/products/hims-emef-22t2-sb-8-4.jpg', '/images/products/hims-emef-22t2-sb-8-5.jpg'],
      ['/images/products/hims-emef-22t2-ss-8-1.jpg', '/images/products/hims-emef-22t2-ss-8-2.jpg', '/images/products/hims-emef-22t2-ss-8-3.jpg', '/images/products/hims-emef-22t2-ss-8-4.jpg', '/images/products/hims-emef-22t2-ss-8-5.jpg'],
    ],
    variants: [
      { key: 'sb-8', label: 'Hims EMEF-22T2-SB-8 22kW Tip 2 Beyaz Soketli 8m', price: 8945, sku: 'EMEF-22T2-SB-8' },
      { key: 'ss-8', label: 'Hims EMEF-22T2-SS-8 22kW Tip 2 Siyah Soketli 8m', price: 8945, sku: 'EMEF-22T2-SS-8' },
    ],
    price: 8945,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: true,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz', 'Siyah', '8 m'],
  },
  {
    id: 'hims-emef-22t2-sb-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-10-1.jpg',
      '/images/products/hims-emef-22t2-sb-10-2.jpg',
      '/images/products/hims-emef-22t2-sb-10-3.jpg',
      '/images/products/hims-emef-22t2-sb-10-4.jpg',
      '/images/products/hims-emef-22t2-sb-10-5.jpg',
      '/images/products/hims-emef-22t2-sb-10-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-10-1.jpg',
    sku: 'EMEF-22T2-SB-10',
    name: '22kW Tip 2 Beyaz Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. 10 m uzunluk, beyaz kılıf.',
    fullDescription: 'Hims 22kw Destekli Siyah 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 10 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"113971\\",\\"name\\":\\"Hims EMEF-22T2-SB-10 22kW Tip 2 Beyaz Soketli 10m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP175576\\",\\"supplier_code\\":\\"EMEF-22T2-SB-10\\",\\"sale_price\\":\\"10985\\",\\"total_base_price\\":20280,\\"total_sale_price\\":13182,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":16900,\\"total_price\\":20280,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329192\\",\\"subproduct_name\\":\\"\\",\\"image\\":\\"https:\\\\/\\\\/www.elektromarketim.com\\\\/hims-emef-22t2-sb-10-beyaz-soketli-22kw-siyah-10m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519634-11-O.jpg\\",\\"quantity\\":9999,\\"url\\":\\"hims-emef-22t2-sb-10-beyaz-soketli-',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '10 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-15',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-15-1.jpg',
      '/images/products/hims-emef-22t2-sb-15-2.jpg',
      '/images/products/hims-emef-22t2-sb-15-3.jpg',
      '/images/products/hims-emef-22t2-sb-15-4.jpg',
      '/images/products/hims-emef-22t2-sb-15-5.jpg',
      '/images/products/hims-emef-22t2-sb-15-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-15-1.jpg',
    sku: 'EMEF-22T2-SB-15',
    name: '22kW Tip 2 Beyaz Soketli 15m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. 15 m uzunluk, beyaz kılıf.',
    fullDescription: 'Hims Elektrikli Araç Şarj Kablosu Siyah 15 Metre 22kw Destekli Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Hims markası elektrikli araç şarj kablosu fiyatları konusunda kullanıcılara her zaman tasarruflu çözümler sunan bir markadır. Elektrikli araç şarj kablosu 220V destekli olduğundan kolaylıkla her alanda kullanılmaktadır. Sağlam ve dayanıklı yapısı ile elektrikli araç şarj kablosu 15 metre sıklıkla tercih edilmektedir. Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 15 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 15 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) {"@context":"https:\\/\\/ ","@type":"Product","name":"Hims EMEF-22T2-SB-15 22kW Destekli 15m Elektrikli Araç Şarj Kablosu","image":["https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519635-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518334-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518318-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518317-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518368-11-O.jpg"],"description":"Hims Elektrikli Araç Şarj Kablosu Siyah 15 Metre 22kw DestekliTürkiye\\\\\'de üretilen tüm elektrikli araçlar ile uyumludur.22kW araç şarj kablosu hem Avrupa hem de Türkiye\\\\\'deki tüm tip 2 soketler ile kullanıma uygundur.Hims markası elektrikli araç şarj kablosu fiyatları konusunda kullanıcılara her zaman tasarruflu çözümler sunan bir markadır.Elektrikli araç şarj kablosu 220V destekli olduğundan kolaylıkla her alanda kullanılmaktadır.Sağlam ve dayanıklı yapısı ile elektrikli araç şarj kablosu 15 metre sıklıkla tercih edilmektedir.Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir.Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır.Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.Geleceğin enerjisine yatırım yapmaya hazır mısınız? Elektrikli araç altyapısına yaptığınız yatırımla hem çevreyi koruyun hem de büyüyen bir pazarda yerinizi alın. Bayilik programımız için tıklayın, yerli üretimimiz olan şarj istasyonu ve kabloları ile geleceğin dönüşümüne ortak olun!Elektrikli Araç Şarj Kablosu Özelliği Nedir?Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir?Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile ol…',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '15 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '15 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '15 m'
    },
    price: 14096,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-16',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-16-1.jpg',
      '/images/products/hims-emef-22t2-sb-16-2.jpg',
      '/images/products/hims-emef-22t2-sb-16-3.jpg',
      '/images/products/hims-emef-22t2-sb-16-4.jpg',
      '/images/products/hims-emef-22t2-sb-16-5.jpg',
      '/images/products/hims-emef-22t2-sb-16-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-16-1.jpg',
    sku: 'EMEF-22T2-SB-16',
    name: '22kW Tip 2 Beyaz Soketli 16m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. 16 m uzunluk, beyaz kılıf.',
    fullDescription: 'Hims 22kw Destekli Siyah 16 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 16 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 16 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(documen',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '16 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '16 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '16 m'
    },
    price: 15110,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-sb-20',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-sb-20-1.jpg',
      '/images/products/hims-emef-22t2-sb-20-2.jpg',
      '/images/products/hims-emef-22t2-sb-20-3.jpg',
      '/images/products/hims-emef-22t2-sb-20-4.jpg',
      '/images/products/hims-emef-22t2-sb-20-5.jpg',
      '/images/products/hims-emef-22t2-sb-20-6.png'
    ],

    image: '/images/products/hims-emef-22t2-sb-20-1.jpg',
    sku: 'EMEF-22T2-SB-20',
    name: '22kW Tip 2 Beyaz Soketli 20m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. 20 m uzunluk, beyaz kılıf.',
    fullDescription: 'Hims Tip 2 Araç Şarj Kablosu 22kW Destekli Siyah 20 Metre Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Kaliteli ve güvenilir araç şarj kablosu ile aracınızı kolaylıkla şarj edebilirsiniz. Bu elektrikli araç şarj kablosu 22kW\'a kadar desteklemektedir, böylece elektrikli arabanız ile beraber rahatlıkla kullanabilirsiniz. Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 20 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 20 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) {"@context":"https:\\/\\/ ","@type":"Product","name":"Hims EMEF-22T2-SB-20 22kW Tip 2 Beyaz Soketli 20m Elektrikli Araç Şarj Kablosu","image":["https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519640-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518329-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518280-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518301-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-518363-11-O.jpg"],"description":"Hims Tip 2 Araç Şarj Kablosu 22kW Destekli Siyah 20 MetreTürkiye\\\\\'de üretilen tüm elektrikli araçlar ile uyumludur.22kW araç şarj kablosu hem Avrupa hem de Türkiye\\\\\'deki tüm tip 2 soketler ile kullanıma uygundur.Kaliteli ve güvenilir araç şarj kablosu ile aracınızı kolaylıkla şarj edebilirsiniz.Bu elektrikli araç şarj kablosu 22kW\\\\\'a kadar desteklemektedir, böylece elektrikli arabanız ile beraber rahatlıkla kullanabilirsiniz.Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir.Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır.Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.Geleceğin enerjisine yatırım yapmaya hazır mısınız? Elektrikli araç altyapısına yaptığınız yatırımla hem çevreyi koruyun hem de büyüyen bir pazarda yerinizi alın. Bayilik programımız için tıklayın, yerli üretimimiz olan şarj istasyonu ve kabloları ile geleceğin dönüşümüne ortak olun!Elektrikli Araç Şarj Kablosu Özelliği Nedir?Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir?Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır. Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.Elektrikli Araç Şarj Kablosu Nasıl Seçilir?Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda …',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '20 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '20 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '20 m'
    },
    price: 18882,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Beyaz'],
  },
  {
    id: 'hims-emef-22t2-ss-2',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-2-1.jpg',
      '/images/products/hims-emef-22t2-ss-2-2.jpg',
      '/images/products/hims-emef-22t2-ss-2-3.jpg',
      '/images/products/hims-emef-22t2-ss-2-4.jpg',
      '/images/products/hims-emef-22t2-ss-2-5.jpg',
      '/images/products/hims-emef-22t2-ss-2-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-2-1.jpg',
    sku: 'EMEF-22T2-SS-2',
    name: '22kW Tip 2 Siyah Soketli 2m Elektrikli Araç Şarj Kablosu',
    description: '22 kW destekli Tip 2 elektrikli araç şarj kablosu. Siyah kılıf, 2 m. Avrupa ve Türkiye\'deki tüm Tip 2 soketler ile uyumlu.',
    fullDescription: 'Hims 22kw Destekli Siyah 2 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 2 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 2 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115124\\",\\"name\\":\\"Hims EMEF-22T2-SS-2 22kW Tip 2 Siyah Soketli 2m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178440\\",\\"supplier_code\\":\\"EMEF-22T2-SS-2\\",\\"sale_price\\":\\"4732\\",\\"t',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', 'Gümüş kontaklar.', '2 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '2 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '2 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 5578,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-3',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-3-1.jpg',
      '/images/products/hims-emef-22t2-ss-3-2.jpg',
      '/images/products/hims-emef-22t2-ss-3-3.jpg',
      '/images/products/hims-emef-22t2-ss-3-4.jpg',
      '/images/products/hims-emef-22t2-ss-3-5.jpg',
      '/images/products/hims-emef-22t2-ss-3-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-3-1.jpg',
    sku: 'EMEF-22T2-SS-3',
    name: '22kW Tip 2 Siyah Soketli 3m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 3 m, siyah.',
    fullDescription: 'Hims 22kw Destekli Siyah 3 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 3 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 3 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115130\\",\\"name\\":\\"Hims EMEF-22T2-SS-3 22kW Tip 2 Siyah Soketli 3m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178442\\",\\"supplier_code\\":\\"EMEF-22T2-SS-3\\",\\"sale_price\\":\\"5002.4\\",\\"total_base_price\\":9235.2,\\"total_sale_price\\":6002.88,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":7696,\\"total_price\\":9235.2,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329468\\",\\"subproduct_name\\":\\"\\",\\"image\\":\\"https:\\\\/\\\\/www.elektromarketim.com\\\\/hims-emef-22t2-ss-3-siyah-soketli-22kw-siyah-3m-elektrikli-arac-sarj-kablosu-ele',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '3 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-5-1.jpg',
      '/images/products/hims-emef-22t2-ss-5-2.jpg',
      '/images/products/hims-emef-22t2-ss-5-3.jpg',
      '/images/products/hims-emef-22t2-ss-5-4.jpg',
      '/images/products/hims-emef-22t2-ss-5-5.jpg',
      '/images/products/hims-emef-22t2-ss-5-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-5-1.jpg',
    sku: 'EMEF-22T2-SS-5',
    name: '22kW Tip 2 Siyah Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 5 m, siyah.',
    fullDescription: 'Hims 22kw Destekli Siyah 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 5 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115126\\",\\"name\\":\\"Hims EMEF-22T2-SS-5 22kW Tip 2 Siyah Soketli 5m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178443\\",\\"supplier_code\\":\\"EMEF-22T2-SS-5\\",\\"sale_price\\":\\"5746\\",\\"total_base_price\\":10608,\\"total_sale_price\\":6895.2,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":8840,\\"total_price\\":10608,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329475\\",\\"subproduct_name\\":\\"\\",\\"image\\":\\"https:\\\\/\\\\/www.elektromarketim.com\\\\/hims-emef-22t2-ss-5-siyah-soketli-22kw-siyah-5m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519608-11-O.jpg\\",\\"quantity\\":9999,\\"url\\":\\"hims-emef-22t2-ss-5-siyah-soketli-22kw-siyah-5m-elektrikli-arac-sarj-kablosu\\",\\"currency\\":\\"TL\\",\\"currency_target\\":\\"TL\\",\\"brand\\":\\"Hims\\",\\"category\\":\\"Elektrikli Ara\\\\u00e7 \\\\u015earj Kablolar\\\\u0131\\",\\"category_id\\":',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '5 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '5 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-7-1.jpg',
      '/images/products/hims-emef-22t2-ss-7-2.jpg',
      '/images/products/hims-emef-22t2-ss-7-3.jpg',
      '/images/products/hims-emef-22t2-ss-7-4.jpg',
      '/images/products/hims-emef-22t2-ss-7-5.jpg',
      '/images/products/hims-emef-22t2-ss-7-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-7-1.jpg',
    sku: 'EMEF-22T2-SS-7',
    name: '22kW Tip 2 Siyah Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 7 m, siyah.',
    fullDescription: 'Hims 22kw Destekli Siyah 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 7 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115127\\",\\"name\\":\\"Hims EMEF-22T2-SS-7 22kW Tip 2 Siyah Soketli 7m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178444\\",\\"supplier_code\\":\\"EMEF-22T2-SS-7\\",\\"sale_price\\":\\"7098\\",\\"total_base_price\\":13104,\\"total_sale_price\\":8517.6,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '7 m'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-10-1.jpg',
      '/images/products/hims-emef-22t2-ss-10-2.jpg',
      '/images/products/hims-emef-22t2-ss-10-3.jpg',
      '/images/products/hims-emef-22t2-ss-10-4.jpg',
      '/images/products/hims-emef-22t2-ss-10-5.jpg',
      '/images/products/hims-emef-22t2-ss-10-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-10-1.jpg',
    sku: 'EMEF-22T2-SS-10',
    name: '22kW Tip 2 Siyah Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 10 m, siyah.',
    fullDescription: 'Hims 22kw Destekli Siyah 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 10 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115129\\",\\"name\\":\\"Hims EMEF-22T2-SS-10 22kW Tip 2 Siyah Soketli 10m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178437\\",\\"supplier_code\\":\\"EMEF-22T2-SS-10\\",\\"sale_price\\":\\"10985\\",\\"total_base_price\\":20280,\\"total_sale_price\\":13182,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":16900,\\"total_price\\":20280,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329505\\",\\"subproduct_name\\":\\"\\",\\"image\\":\\"https:\\\\/\\\\/www.elektromarketim.com\\\\/hims-emef-22t2-ss-10-siyah-soketli-22kw-siyah-10m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519611-11-O.jpg\\",\\"quantity\\":9999,\\"url\\":\\"hims-emef-22t2-ss-10-siyah-soketli-22kw-siyah-10m-elektrikli-arac-sarj-kablosu\\",\\"currency',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '10 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-15',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-15-1.jpg',
      '/images/products/hims-emef-22t2-ss-15-2.jpg',
      '/images/products/hims-emef-22t2-ss-15-3.jpg',
      '/images/products/hims-emef-22t2-ss-15-4.jpg',
      '/images/products/hims-emef-22t2-ss-15-5.jpg',
      '/images/products/hims-emef-22t2-ss-15-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-15-1.jpg',
    sku: 'EMEF-22T2-SS-15',
    name: '22kW Tip 2 Siyah Soketli 15m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 15 m, siyah.',
    fullDescription: 'Hims Elektrikli Araç Şarj Kablosu Siyah 15 Metre 22kw Destekli Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Hims markası elektrikli araç şarj kablosu fiyatları konusunda kullanıcılara her zaman tasarruflu çözümler sunan bir markadır. Elektrikli araç şarj kablosu 220V destekli olduğundan kolaylıkla her alanda kullanılmaktadır. Sağlam ve dayanıklı yapısı ile elektrikli araç şarj kablosu 15 metre sıklıkla tercih edilmektedir. Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 15 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 15 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115128\\",\\"name\\":\\"Hims EMEF-22T2-SS-15 22kW Tip 2 Siyah Soketli 15m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178438\\",\\"supplier_code\\":\\"EMEF-22T2-SS-15\\",\\"sale_price\\":\\"11830\\",\\"total_base_price\\":21840,\\"total_sale_price\\":14196,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '15 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '15 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '15 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 14096,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-16',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-16-1.jpg',
      '/images/products/hims-emef-22t2-ss-16-2.jpg',
      '/images/products/hims-emef-22t2-ss-16-3.jpg',
      '/images/products/hims-emef-22t2-ss-16-4.jpg',
      '/images/products/hims-emef-22t2-ss-16-5.jpg',
      '/images/products/hims-emef-22t2-ss-16-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-16-1.jpg',
    sku: 'EMEF-22T2-SS-16',
    name: '22kW Tip 2 Siyah Soketli 16m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 16 m, siyah.',
    fullDescription: 'Hims 22kw Destekli Siyah 16 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 16 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 16 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) {"@context":"https:\\/\\/ ","@type":"Product","name":"Hims EMEF-22T2-SS-16 22kW Tip 2 Siyah Soketli 16m Elektrikli Araç Şarj Kablosu","image":["https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519614-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519971-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519973-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519974-11-O.jpg","https:\\/\\/www.elektromarketim.com\\/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519972-11-O.jpg"],"description":"\\n\\n\\nHims 22kw Destekli Siyah 16 Metre Elektrikli Araç Şarj Kablosu\\n\\n\\n\\nTürkiye\\\\\'de üretilen tüm elektrikli araçlar ile uyumludur.\\n\\n22kW araç şarj kablosu hem Avrupa hem de Türkiye\\\\\'deki tüm tip 2 soketler ile kullanıma uygundur.\\n\\n\\n\\nDüz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir.Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır.Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur.\\nGeleceğin enerjisine yatırım yapmaya hazır mısınız? Elektrikli araç altyapısına yaptığınız yatırımla hem çevreyi koruyun hem de büyüyen bir pazarda yerinizi alın. Bayilik programımız için tıklayın, yerli üretimimiz olan şarj istasyonu ve kabloları ile geleceğin dönüşümüne ortak olun!\\n\\n\\n\\nElektrikli Araç Şarj Kablosu Özelliği Nedir?\\n\\n\\n\\nElektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır.\\n\\n\\n\\n\\n\\nElektrikli Araç Şarj Kablosu Kullanım Alanları Nedir?\\n\\n\\n\\nElektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır. Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır.\\n\\n\\n\\n\\n\\nElektrikli Araç Şarj Kablosu Nasıl Seçilir?\\n\\n\\n\\nElektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir. Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir.\\n\\n\\n\\n\\n\\n\\nÜrün Özellikleri\\n\\n\\nÇalışma Akımı\\n:\\n32A\\n\\n\\nGüç Aktarım Kapasitesi\\n:\\n22 kW\\n\\n\\nÇalıma Gerilimi\\n:\\n…',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '16 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '16 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '16 m'
    },
    price: 15110,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-ss-20',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ss-20-1.jpg',
      '/images/products/hims-emef-22t2-ss-20-2.jpg',
      '/images/products/hims-emef-22t2-ss-20-3.jpg',
      '/images/products/hims-emef-22t2-ss-20-4.jpg',
      '/images/products/hims-emef-22t2-ss-20-5.jpg',
      '/images/products/hims-emef-22t2-ss-20-6.png'
    ],

    image: '/images/products/hims-emef-22t2-ss-20-1.jpg',
    sku: 'EMEF-22T2-SS-20',
    name: '22kW Tip 2 Siyah Soketli 20m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 20 m, siyah.',
    fullDescription: 'Hims Tip 2 Araç Şarj Kablosu 22kW Destekli Siyah 20 Metre Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims araç şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 20 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 20 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115125\\",\\"name\\":\\"Hims EMEF-22T2-SS-20 22kW Tip 2 Siyah Soketli 20m Elektrikli Ara\\\\u00e7 \\\\u015earj Kablosu\\",\\"code\\":\\"TP178441\\",\\"supplier_code\\":\\"EMEF-22T2-SS-20\\",\\"sale_price\\":\\"15818.4\\",\\"total_base_price\\":29203.2,\\"total_sale_price\\":18982.08,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":24336,\\"total_price\\":29203.2,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329536\\",\\"subproduct_name\\":\\"\\",\\"image\\":\\"https:\\\\/\\\\/www.elektromarketim.com\\\\/hims-emef-22t2-ss-20-siyah-soketli-22kw-siyah-20m-elektrikli-arac-sarj-kablosu-elektrikli-arac-sarj-kablolari-hims-519607-11-O.jpg\\",\\"quantity\\":9999,\\"url\\":\\"hims-emef-22t2-ss-20-siyah-soketli-22kw-siyah-20m-elektrikli-arac-sarj-kablosu\\",\\"currency\\":\\"TL\\",\\"currency_target\\":\\"TL\\",\\"brand\\":\\"Hims\\",\\"category\\":\\"Elektrikli Ara\\\\u00e7 \\\\u015earj Kablolar\\\\u0131\\",\\"category_id\\":\\"4885\\",\\"category_path\\":\\"Elektrikli Ara\\\\u00e7 \\\\u015earj \\\\u0130stasyonlar\\\\u0131 ve Ekipmanlar\\\\u0131 > \\",\\"model\\":\\"\\",\\"personalization_id\\":0,\\"variant1\\"',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '20 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '20 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '20 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 18882,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'hims-emef-22t2-tb-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-tb-5-1.jpg',
      '/images/products/hims-emef-22t2-tb-5-2.jpg',
      '/images/products/hims-emef-22t2-tb-5-3.jpg',
      '/images/products/hims-emef-22t2-tb-5-4.jpg',
      '/images/products/hims-emef-22t2-tb-5-5.jpg',
      '/images/products/hims-emef-22t2-tb-5-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-tb-5-1.jpg',
    sku: 'EMEF-22T2-TB-5',
    name: '22kW Tip 2 Turuncu Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 5 m, turuncu kılıf.',
    fullDescription: 'Hims 22kw Destekli Turuncu 5 Metre Elektrikli Araç Şarj Kablosu Hims bir elektromarketim markasıdır. Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 5 m Kablo Rengi : Turuncu Ürün Etiketleri Hafta Ortası İndirimleri , Hafta Sonu Fırsatları Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#list-catalog1062\').equalizer(); $(\'#list-slide1062\').slide({ slideType : \'carousel\', slideCtrl : { showCtrl: true, wrapCtrl: \'#productControl1062\', nextBtn: \'#nextProduct1062\', prevBtn: \'#prevProduct1062\' } }); });',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '5 m uzunluk.', 'Turuncu kılıf.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '5 m',
      'Kablo Rengi': 'Turuncu'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Turuncu'],
  },
  {
    id: 'hims-emef-22t2-tb-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-tb-7-1.jpg',
      '/images/products/hims-emef-22t2-tb-7-2.jpg',
      '/images/products/hims-emef-22t2-tb-7-3.jpg',
      '/images/products/hims-emef-22t2-tb-7-4.jpg',
      '/images/products/hims-emef-22t2-tb-7-5.jpg',
      '/images/products/hims-emef-22t2-tb-7-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-tb-7-1.jpg',
    sku: 'EMEF-22T2-TB-7',
    name: '22kW Tip 2 Turuncu Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 7 m, turuncu kılıf.',
    fullDescription: 'Hims 22kw Destekli Turuncu 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 7 m Kablo Rengi : Turuncu Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '7 m',
      'Kablo Rengi': 'Turuncu'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Turuncu'],
  },
  {
    id: 'hims-emef-22t2-tb-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-tb-10-1.jpg',
      '/images/products/hims-emef-22t2-tb-10-2.jpg',
      '/images/products/hims-emef-22t2-tb-10-3.jpg',
      '/images/products/hims-emef-22t2-tb-10-4.jpg',
      '/images/products/hims-emef-22t2-tb-10-5.jpg',
      '/images/products/hims-emef-22t2-tb-10-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-tb-10-1.jpg',
    sku: 'EMEF-22T2-TB-10',
    name: '22kW Tip 2 Turuncu Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 10 m, turuncu kılıf.',
    fullDescription: 'Hims 22kw Destekli Turuncu 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Turuncu Kablo Uzunluğu : 10 m Ürün Etiketleri Hafta Sonu Fırsatları Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-md-4 col-sm-6 col-',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Turuncu',
      'Kablo Uzunluğu': '10 m'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Turuncu'],
  },
  {
    id: 'hims-emef-22t2-gb-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-gb-5-1.jpg',
      '/images/products/hims-emef-22t2-gb-5-2.jpg',
      '/images/products/hims-emef-22t2-gb-5-3.jpg',
      '/images/products/hims-emef-22t2-gb-5-4.jpg',
      '/images/products/hims-emef-22t2-gb-5-5.jpg',
      '/images/products/hims-emef-22t2-gb-5-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-gb-5-1.jpg',
    sku: 'EMEF-22T2-GB-5',
    name: '22kW Tip 2 Gri Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 5 m, gri kılıf.',
    fullDescription: 'Hims 22kw Destekli Gri 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Gri Kablo Uzunluğu : 5 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <div style="position: absolute;z-index:',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '5 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Gri',
      'Kablo Uzunluğu': '5 m'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Gri'],
  },
  {
    id: 'hims-emef-22t2-gb-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-gb-7-1.jpg',
      '/images/products/hims-emef-22t2-gb-7-2.jpg',
      '/images/products/hims-emef-22t2-gb-7-3.jpg',
      '/images/products/hims-emef-22t2-gb-7-4.jpg',
      '/images/products/hims-emef-22t2-gb-7-5.jpg',
      '/images/products/hims-emef-22t2-gb-7-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-gb-7-1.jpg',
    sku: 'EMEF-22T2-GB-7',
    name: '22kW Tip 2 Gri Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 7 m, gri kılıf.',
    fullDescription: 'Hims 22kw Destekli Gri 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 7 m Kablo Rengi : Gri Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-md-4 col-sm-6 col-xs-12 productItem ease" id="1062-product-d',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '7 m',
      'Kablo Rengi': 'Gri'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Gri'],
  },
  {
    id: 'hims-emef-22t2-gb-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-gb-10-1.jpg',
      '/images/products/hims-emef-22t2-gb-10-2.jpg',
      '/images/products/hims-emef-22t2-gb-10-3.jpg',
      '/images/products/hims-emef-22t2-gb-10-4.jpg',
      '/images/products/hims-emef-22t2-gb-10-5.jpg',
      '/images/products/hims-emef-22t2-gb-10-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-gb-10-1.jpg',
    sku: 'EMEF-22T2-GB-10',
    name: '22kW Tip 2 Gri Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 10 m, gri kılıf.',
    fullDescription: 'Hims 22kw Destekli Gri 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 10 m Kablo Rengi : Gri Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-md-4 col-sm-6 col-xs-12 pr',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '10 m',
      'Kablo Rengi': 'Gri'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Gri'],
  },
  {
    id: 'hims-emef-22t2-yb-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-yb-5-1.jpg',
      '/images/products/hims-emef-22t2-yb-5-2.jpg',
      '/images/products/hims-emef-22t2-yb-5-3.jpg',
      '/images/products/hims-emef-22t2-yb-5-4.jpg',
      '/images/products/hims-emef-22t2-yb-5-5.jpg',
      '/images/products/hims-emef-22t2-yb-5-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-yb-5-1.jpg',
    sku: 'EMEF-22T2-YB-5',
    name: '22kW Tip 2 Yeşil Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 5 m, yeşil kılıf.',
    fullDescription: 'Hims 22kw Destekli Yeşil 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Yeşil Kablo Uzunluğu : 5 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <div styl',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '5 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Yeşil',
      'Kablo Uzunluğu': '5 m'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Yeşil'],
  },
  {
    id: 'hims-emef-22t2-yb-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-yb-7-1.jpg',
      '/images/products/hims-emef-22t2-yb-7-2.jpg',
      '/images/products/hims-emef-22t2-yb-7-3.jpg',
      '/images/products/hims-emef-22t2-yb-7-4.jpg',
      '/images/products/hims-emef-22t2-yb-7-5.jpg',
      '/images/products/hims-emef-22t2-yb-7-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-yb-7-1.jpg',
    sku: 'EMEF-22T2-YB-7',
    name: '22kW Tip 2 Yeşil Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 7 m, yeşil kılıf.',
    fullDescription: 'Hims 22kw Destekli Yeşil 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Yeşil Kablo Uzunluğu : 7 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <input type="hidden" class="myP',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze )',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Yeşil',
      'Kablo Uzunluğu': '7 m'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Yeşil'],
  },
  {
    id: 'hims-emef-22t2-yb-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-yb-10-1.jpg',
      '/images/products/hims-emef-22t2-yb-10-2.jpg',
      '/images/products/hims-emef-22t2-yb-10-3.jpg',
      '/images/products/hims-emef-22t2-yb-10-4.jpg',
      '/images/products/hims-emef-22t2-yb-10-5.jpg',
      '/images/products/hims-emef-22t2-yb-10-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-yb-10-1.jpg',
    sku: 'EMEF-22T2-YB-10',
    name: '22kW Tip 2 Yeşil Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 10 m, yeşil kılıf.',
    fullDescription: 'Hims 22kw Destekli Yeşil 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Yeşil Kablo Uzunluğu : 10 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-md',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Yeşil',
      'Kablo Uzunluğu': '10 m'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Yeşil'],
  },
  {
    id: 'hims-emef-22t2-mb-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-mb-5-1.jpg',
      '/images/products/hims-emef-22t2-mb-5-2.jpg',
      '/images/products/hims-emef-22t2-mb-5-3.jpg',
      '/images/products/hims-emef-22t2-mb-5-4.jpg',
      '/images/products/hims-emef-22t2-mb-5-5.jpg',
      '/images/products/hims-emef-22t2-mb-5-6.png'
    ],

    image: '/images/products/hims-emef-22t2-mb-5-1.jpg',
    sku: 'EMEF-22T2-MB-5',
    name: '22kW Tip 2 Mavi Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 5 m, mavi kılıf.',
    fullDescription: 'Hims 22kw Destekli Mavi 5 Metre Elektrikli Araç Şarj Kablosu Hims bir elektromarketim markasıdır. Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Mavi Kablo Uzunluğu : 5 m Ürün Etiketleri Hafta Ortası İndirimleri Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <di',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '5 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Mavi',
      'Kablo Uzunluğu': '5 m'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Mavi'],
  },
  {
    id: 'hims-emef-22t2-mb-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-mb-7-1.jpg',
      '/images/products/hims-emef-22t2-mb-7-2.jpg',
      '/images/products/hims-emef-22t2-mb-7-3.jpg',
      '/images/products/hims-emef-22t2-mb-7-4.jpg',
      '/images/products/hims-emef-22t2-mb-7-5.jpg',
      '/images/products/hims-emef-22t2-mb-7-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-mb-7-1.jpg',
    sku: 'EMEF-22T2-MB-7',
    name: '22kW Tip 2 Mavi Soketli 7m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 7 m, mavi kılıf.',
    fullDescription: 'Hims 22kw Destekli Mavi 7 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Mavi Kablo Uzunluğu : 7 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <li class="fl col-3 col-md-4 col-sm-6 col-xs-12 productItem ease" id=',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '7 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Mavi',
      'Kablo Uzunluğu': '7 m'
    },
    price: 8418,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Mavi'],
  },
  {
    id: 'hims-emef-22t2-mb-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-mb-10-1.jpg',
      '/images/products/hims-emef-22t2-mb-10-2.jpg',
      '/images/products/hims-emef-22t2-mb-10-3.jpg',
      '/images/products/hims-emef-22t2-mb-10-4.jpg',
      '/images/products/hims-emef-22t2-mb-10-5.jpg',
      '/images/products/hims-emef-22t2-mb-10-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-mb-10-1.jpg',
    sku: 'EMEF-22T2-MB-10',
    name: '22kW Tip 2 Mavi Soketli 10m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 10 m, mavi kılıf.',
    fullDescription: 'Hims 22kw Destekli Mavi 10 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Mavi Kablo Uzunluğu : 10 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) Tamamlayıcı Ürünler <d',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '10 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Mavi',
      'Kablo Uzunluğu': '10 m'
    },
    price: 13082,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Mavi'],
  },
  {
    id: 'hims-hcc-22t2-10',
    brand: 'Hims',
    images: [
      '/images/products/hims-hcc-22t2-10-1.webp',
      '/images/products/hims-hcc-22t2-10-2.png',
      '/images/products/hims-hcc-22t2-10-3.png'
    ],

    image: '/images/products/hims-hcc-22t2-10-1.webp',
    sku: 'HCC-22T2-10',
    name: 'Hims HCC-22T2-10 22kW Destekli 10m Elektrikli Araç Şarj Kablosu',
    description: 'Hims 22 kW destekli 10 metre elektrikli araç şarj kablosu. Tip 2 uyumlu; tüm şarj istasyonları ve araçlarla kullanılır.',
    fullDescription: 'Hims 22kw Destekli 10 Metre Elektrikli Araç Şarj Kablosu Hims bir elektromarketim markasıdır. Hims markasının üretmiş olduğu elektrikli araç şarj kablosudur. Aracınızı, Hims 10 metre elektirkli araç şarj kablosu ile tüm elektrikli araç şarj istasyonları ile güvenle şarj edebilirsiniz. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 10 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 10 m Kablo Rengi : Siyah Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#newsletterBtn\').click(function () { personaclick("segment", "add", { "segment_id": 7872, "email": $(".sub-email").val(), }); var userMobile; $.ajax({ url : "/srv/service/customer/get-detail", method : "GET", async: false, success : function(response){ persms = JSON.parse(response).sms_notify; } }) if(persms == "0"){ var persms="false"; }else{ var persms="true"; } personaclick("profile", "set", { id: MEMBER_INFO.ID, email: $(".sub-email").val(), }); personaclick(\'subscription\', \'manage\', { email: $(".sub-email").val(), email_bulk: true, email_chain: true, email_transactional: true, sms_bulk: persms, sms_chain: persms, sms_transactional: persms }); }); $(\'#footerMiddle h3\').click(function () { if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) { $(this).tog',
    features: [
      '22 kW destekli, 10 m uzunluk.',
      'Tip 2 Avrupa standardı.',
      'Tüm istasyon ve araçlarla uyumlu.',
      'Hims kalitesi.',
    ],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '10 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '10 m',
      'Kablo Rengi': 'Siyah'
    },
    price: 11764,
    productFamilyKey: 'HCC-22T2-10',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 30,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'HCC', '22 kW', '10 m', 'Tip 2'],
  },
  {
    id: 'hims-hcc-22t2-7',
    brand: 'Hims',
    images: [
      '/images/products/hims-hcc-22t2-7-1.webp',
      '/images/products/hims-hcc-22t2-7-2.png',
      '/images/products/hims-hcc-22t2-7-3.png'
    ],

    image: '/images/products/hims-hcc-22t2-7-1.webp',
    sku: 'HCC-22T2-7',
    name: 'Hims HCC-22T2-7 22kW Destekli 7m Elektrikli Araç Şarj Kablosu',
    description: 'Hims 22 kW destekli 7 metre elektrikli araç şarj kablosu. Tip 2 uyumlu.',
    fullDescription: 'Hims 22kw Destekli 7 Metre Elektrikli Araç Şarj Kablosu Hims bir elektromarketim markasıdır. Hims markasının üretmiş olduğu elektrikli araç şarj kablosudur. Aracınızı, Hims 7 metre elektirkli araç şarj kablosu ile tüm elektrikli araç şarj istasyonları ile güvenle şarj edebilirsiniz. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Not: Araç şarj kablosu, taşıma çantası ile birlikte gelir. Elektrikli Araç Şarj Kablosu Özelliği Nedir? Elektrikli araç şarj kablosu modelleri genel olarak istasyondan ayrı olarak da üretilmektedir. Hem yedek kablo olarak hem de kablosu olmayan elektrikli araç şarj istasyonları için kullanım sunarlar. Yapıları bakımından yüksek performans sunan elektrikli araç şarj kablosu modelleri, en iyi şekilde aracınızı şarj etmenize yardımcı olmaktadır. Teknik olarak elektrikli araç şarj istasyonunuz ile uyumlu ise Volti elektrikli araç şarj kablosu modelini tercih edebilirsiniz. Elektrikli Araç Şarj Kablosu Kullanım Alanları Nedir? Elektrikli araç şarj kablosu modeli uygun olan elektrikli araç şarj istasyonu ile kullanılmaktadır. Uygun teknik özelliklerde olduğuna dikkat ederek seçim yapabilirsiniz. Ülke olarak Türkiye ve Avrupa kullanabilen soketleri bulunması ile oldukça kullanışlıdır. Pek çok elektrikli araç şarj istasyonu ile uyumlu şekilde çalışmaktadır. Elektrikli Araç Şarj Kablosu Nasıl Seçilir? Elektrikli araç şarj kablosu teknik özellikleri doğrultusunda uyumluluğuna bakılarak seçilmektedir. Güç olarak elektrikli araç şarj istasyonu ile uyumlu çalışıyorsa o zaman elektrikli araç şarj kablosu seçimi kolaylıkla yapılabilmektedir. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 7 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 7 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) const imgObserver = new IntersectionObserver((entries, self) => { entries.forEach(entry => { if (entry.isIntersecting) { lazyLoad(entry.target); self.unobserve(entry.target); } }); }); document.querySelectorAll(\'.lazy-picture\').forEach((picture) => { imgObserver.observe(picture); }); $( document ).ready(function() { }); const lazyLoad = (picture) => { const sources = picture.querySelectorAll(\'source\'); sources.forEach((source) => { if(source.dataset.srcset != undefined){ source.srcset = source.dataset.srcset; source.removeAttribute(\'data-srcset\'); } }); } function onError() { this.onerror = null; fetch(\'https://cdnimg.elektromarketim.app/img\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\'}, body: JSON.stringify({\'u\': this.parentNode.children[1].srcset}) }).then((response) => response.json()); console.log(\'HATA : \'+ this.parentNode.children[0].srcset) if(this.parentNode != undefined){ if(this.getAttribute(\'data-src\')){ this.parentNode.children[1] = this.getAttribute(\'data-src\'); this.parentNode.children[0] = this.parentNode.children[1]; } else{ this.parentNode.children[1] = this.get',
    features: ['22 kW destekli, 7 m uzunluk.', 'Tip 2 Avrupa standardı.', 'Tüm istasyon ve araçlarla uyumlu.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '7 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '7 m'
    },
    price: 7566,
    productFamilyKey: 'HCC-22T2-7',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 32,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'HCC', '22 kW', '7 m', 'Tip 2'],
  },
  {
    id: 'hims-emef-22t2-gb-3',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-gb-3-1.jpg',
      '/images/products/hims-emef-22t2-gb-3-2.jpg',
      '/images/products/hims-emef-22t2-gb-3-3.jpg',
      '/images/products/hims-emef-22t2-gb-3-4.jpg',
      '/images/products/hims-emef-22t2-gb-3-5.jpg',
      '/images/products/hims-emef-22t2-gb-3-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-gb-3-1.jpg',
    sku: 'EMEF-22T2-GB-3',
    name: '22kW Tip 2 Soketli Gri 3m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 3 m, gri kılıf.',
    fullDescription: 'Hims 22kw Destekli Gri 3 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 3 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 3 m Kablo Rengi : Gri Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#newsletterBtn\').click(function () { personaclick("segment", "add", { "segment_id": 7872, "email": $(".sub-email").val(), }); var userMobile; $.ajax({ url : "/srv/service/customer/get-detail", method : "GET", async: false, success : functio',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '3 m uzunluk.', 'Gri kılıf.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Gri'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Gri'],
  },
  {
    id: 'hims-emef-22t2-tb-3',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-tb-3-1.jpg',
      '/images/products/hims-emef-22t2-tb-3-2.jpg',
      '/images/products/hims-emef-22t2-tb-3-3.jpg',
      '/images/products/hims-emef-22t2-tb-3-4.jpg',
      '/images/products/hims-emef-22t2-tb-3-5.jpg',
      '/images/products/hims-emef-22t2-tb-3-6.png'
    ],

    image: '/images/products/hims-emef-22t2-tb-3-1.jpg',
    sku: 'EMEF-22T2-TB-3',
    name: '22kW Tip 2 Soketli Turuncu 3m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 3 m, turuncu kılıf.',
    fullDescription: 'Hims 22kw Destekli Turuncu 3 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 3 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 3 m Kablo Rengi : Turuncu Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#newsletterBtn\').click(function () { personaclick("segment", "add", { "segment_id": 7872, "email": $(".sub-email").val(), }); var userMobile; $.ajax({ url : "/srv/service/customer/get-detail", method : "GET", async: false, success : function(response){ persms = JSON.parse(response).sms_notify; } }) if(persms == "0"){ var persms="false"; }else{ var persms="true"; } personacl',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '3 m uzunluk.', 'Turuncu kılıf.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Turuncu'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Turuncu'],
  },
  {
    id: 'hims-emef-22t2-yb-3',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-yb-3-1.jpg',
      '/images/products/hims-emef-22t2-yb-3-2.jpg',
      '/images/products/hims-emef-22t2-yb-3-3.jpg',
      '/images/products/hims-emef-22t2-yb-3-4.jpg',
      '/images/products/hims-emef-22t2-yb-3-5.jpg',
      '/images/products/hims-emef-22t2-yb-3-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-yb-3-1.jpg',
    sku: 'EMEF-22T2-YB-3',
    name: '22kW Tip 2 Soketli Yeşil 3m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 3 m, yeşil kılıf.',
    fullDescription: 'Hims 22kw Destekli Yeşil 3 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 3 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 3 m Kablo Rengi : Yeşil Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#newsletterBtn\').click(function () { personaclick("segment", "add", { "segment_id": 7872, "email": $(".sub-email").val(), }); var userMobile; $.ajax({ url : "/srv/service/customer/get-detail", method : "GET", async: false,',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '3 m uzunluk.', 'Yeşil kılıf.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Yeşil'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Yeşil'],
  },
  {
    id: 'hims-emef-22t2-mb-3',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-mb-3-1.jpg',
      '/images/products/hims-emef-22t2-mb-3-2.jpg',
      '/images/products/hims-emef-22t2-mb-3-3.jpg',
      '/images/products/hims-emef-22t2-mb-3-4.jpg',
      '/images/products/hims-emef-22t2-mb-3-5.jpg',
      '/images/products/hims-emef-22t2-mb-3-6.jpg'
    ],

    image: '/images/products/hims-emef-22t2-mb-3-1.jpg',
    sku: 'EMEF-22T2-MB-3',
    name: '22kW Tip 2 Soketli Mavi 3m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu, 3 m, mavi kılıf.',
    fullDescription: 'Hims 22kw Destekli Mavi 3 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 3 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 3 m Kablo Rengi : Mavi Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) $(document).ready(function () { $(\'#newsletterBtn\').click(function () { personaclick("segment", "add", { "segment_id": 7872, "email": $(".sub-email").val(), }); var userMobile; $.ajax({ url : "/srv/service/customer/get-detail", method : "GET", async: false, success : function(response){ persms = JSON.parse(response).sms_notify; } }) if(persms == "0"){ var persms="false"; }else{ var persms="true"; } personaclick("profile", "set", { id: MEMBER_INFO.ID, email: $(".sub-email").val(), }); personaclick(\'subscription\', \'manage\', { email: $(".sub-email").val(), email_bulk: true, email_chain: tr',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', '3 m uzunluk.', 'Mavi kılıf.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '3 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '3 m',
      'Kablo Rengi': 'Mavi'
    },
    price: 5903,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 40,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Mavi'],
  },
  {
    id: 'hims-emef-22t2-ts-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-22t2-ts-5-1.jpg',
      '/images/products/hims-emef-22t2-ts-5-2.png',
      '/images/products/hims-emef-22t2-ts-5-3.png'
    ],

    image: '/images/products/hims-emef-22t2-ts-5-1.jpg',
    sku: 'EMEF-22T2-TS-5',
    name: 'Siyah Soketli 22kW Turuncu 5m Elektrikli Araç Şarj Kablosu',
    description: '22 kW Tip 2 şarj kablosu; siyah soket, turuncu kılıf, 5 m. Farklı renk kombinasyonu.',
    fullDescription: 'Hims 22kw Destekli Turuncu 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 22kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 32A Güç Aktarım Kapasitesi : 22 kW Çalıma Gerilimi : 380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.) Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -25 ile 55 derece Nem : %95\'e kadar yoğuşmasız Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -30 ile 80 derece Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x6 Teknik Özellikler Kablo Uzunluğu : 5 m Kablo Rengi : Turuncu Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) const imgObserver = new IntersectionObserver((entrie',
    features: ['22 kW, Trifaze 32A.', 'Tip 2 Avrupa standardı.', 'Siyah soket, turuncu kılıf.', '5 m uzunluk.'],
    specifications: {
      'Çalışma Akımı': '32A',
      'Güç Aktarım Kapasitesi': '22 kW',
      'Çalıma Gerilimi': '380V AC ( Trifaze ) (Trifaze kablolar, Monofaze sistemlerde kullanım için uygundur.)',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-25 ile 55 derece',
      'Nem': '%95\'e kadar yoğuşmasız',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Depolama Sıcaklığı': '-30 ile 80 derece',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x6',
      'Kablo Uzunluğu': '5 m',
      'Kablo Rengi': 'Turuncu'
    },
    price: 6795,
    productFamilyKey: 'EMEF-22T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 35,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '22 kW', 'Şarj kablosu', 'Turuncu', 'Siyah soket'],
  },
  {
    id: 'hims-emef-11t2-ss-5',
    brand: 'Hims',
    images: [
      '/images/products/hims-emef-11t2-ss-5-1.jpg',
      '/images/products/hims-emef-11t2-ss-5-2.jpg',
      '/images/products/hims-emef-11t2-ss-5-3.jpg',
      '/images/products/hims-emef-11t2-ss-5-4.jpg',
      '/images/products/hims-emef-11t2-ss-5-5.jpg',
      '/images/products/hims-emef-11t2-ss-5-6.png'
    ],
    image: '/images/products/hims-emef-11t2-ss-5-1.jpg',
    sku: 'EMEF-11T2-SS-5',
    name: '11kW Tip 2 Siyah Soketli 5m Elektrikli Araç Şarj Kablosu',
    description: '11 kW Tip 2 siyah soketli 5 m elektrikli araç şarj kablosu. Tek faz veya düşük güç istasyonları için uygun.',
    fullDescription: 'Hims 11kW Tip 2 Gri 5 Metre Elektrikli Araç Şarj Kablosu Türkiye\'de üretilen tüm elektrikli araçlar ile uyumludur. 11kW araç şarj kablosu hem Avrupa hem de Türkiye\'deki t üm tip 2 soketler ile kullanıma uygundur. Sadece monofaze kullanımda 3.6kW\'ı, trifaze kullanımda ise 11kW\'a kadar desteklemektedir. Düz yapıya sahip Hims şarj kablosu, rahatlıkla her yere taşınabilir ve kullanılabilir. Yüksek akım taşımaya uygun özelliklere sahip gümüş kablo kontakları, yalnızca yüksek performanslı iletkenlik sağlamakla kalmaz, aynı zamanda ısınmanın önüne geçerek şarj cihazlarının ve aracın güvenliğini de garanti altına alır. Not: Hims markasının şarj kablosu garantisi, teslim edildikten sonra başlar ve 2 yıl geçerlidir. Ürünün bütün parçaları dahil olmak üzere tamamı garanti kapsamındadır. Garanti kapsamında işçilik ve üretim hatalarına karşı garanti mevcuttur. Ürün Özellikleri Çalışma Akımı : 20A Güç Aktarım Kapasitesi : 11 kW Çalıma Gerilimi : 480V AC Çalışma Frekansı : 50/60 Hz Çalışma Sıcaklığı : -30 ile 55 derece Nem : %5 - %95 bağıl nem Kontak Kaplama : Gümüş İletken : %100 Bakır Depolama Sıcaklığı : -40 °C...70 °C Ürün Kablo Uzunluğu : 5 metre Ürün Kablo Kesiti : 5x2.5+1x0.5 mm Teknik Özellikler Kablo Rengi : Siyah Kablo Uzunluğu : 5 m Ortalama Puan ★★★★★ Çok İyi ★★★★ ★ İyi ★★★ ★★ Ortalama ★★ ★★★ Kötü ★ ★★★★ Çok Kötü ( ) ( ) ( ) ( ) ( ) PRODUCT_DATA.push(JSON.parse(\'{\\"id\\":\\"115625\\",\\"name\\":\\"H\\\\u0131ms Emef-11t2-ss-5 11kw T\\\\u0131p 2 S\\\\u0131yah Soketl\\\\u0131 5m Elektr\\\\u0131kl\\\\u0131 Arac Sarj Kablosu\\",\\"code\\":\\"TP180381\\",\\"supplier_code\\":\\"EMEF-11T2-SS-5\\",\\"sale_price\\":\\"4022.2\\",\\"total_base_price\\":7425.6,\\"total_sale_price\\":4826.64,\\"vat\\":20,\\"subproduct_code\\":\\"\\",\\"subproduct_id\\":0,\\"price\\":6188,\\"total_price\\":7425.6,\\"available\\":true,\\"category_ids\\":\\"4885\\",\\"barcode\\":\\"8684556329826\\",\\"subproduct',
    features: [
      '11 kW, Tip 2 siyah soket.',
      '5 m uzunluk, siyah kılıf.',
      'Ev ve düşük güç istasyonları için.',
      'Avrupa Tip 2 standardı.',
    ],
    specifications: {
      'Çalışma Akımı': '20A',
      'Güç Aktarım Kapasitesi': '11 kW',
      'Çalıma Gerilimi': '480V AC',
      'Çalışma Frekansı': '50/60 Hz',
      'Çalışma Sıcaklığı': '-30 ile 55 derece',
      'Kontak Kaplama': 'Gümüş',
      'İletken': '%100 Bakır',
      'Ürün Kablo Uzunluğu': '5 metre',
      'Ürün Kablo Kesiti': '5x2.5+1x0.5 mm',
      'Kablo Rengi': 'Siyah',
      'Kablo Uzunluğu': '5 m'
    },
    price: 4727,
    productFamilyKey: 'EMEF-11T2',

    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 45,
    featured: false,
    isVariantProduct: false,
    tags: ['Hims', 'Tip 2', '11 kW', 'Şarj kablosu', 'Siyah'],
  },
  {
    id: 'mock-tip2-sarj-kablosu',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-CABLE-01',
    name: 'Tip 2 Araç Şarj Kablosu (5 m, 32A)',
    description: 'Elektrikli araç şarj istasyonu ile aracınız arasında güvenli bağlantı. 5 metre uzunluk, 32A taşıma kapasitesi.',
    price: 2200,
    category: 'Tip 2 – Tip 2 Şarj Kabloları',
    stock: 60,
    featured: false,
    isVariantProduct: false,
    tags: ['Tip 2', '5 m', '32A'],
  },
  // Akü
  {
    id: 'mock-kuru-aku-12v',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-AKU-01',
    name: 'Kuru Akü 12V 100Ah (Derin Devirli)',
    description: 'Solar ve off-grid sistemler için derin devirli kuru akü. Bakım gerektirmez, uzun ömürlü.',
    price: 4200,
    category: 'Kurşun Asit Aküler',
    stock: 35,
    featured: false,
    isVariantProduct: false,
    tags: ['12V', '100Ah', 'Kuru akü'],
  },
  // Lityum (LiFePO4) Aküler
  {
    id: 'mock-lifepo4-12v-100ah',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-LFP-01',
    name: 'LiFePO4 Lityum Akü 12V 100Ah',
    description: 'Yüksek döngü ömrü ve güvenli kimyası ile LiFePO4 lityum akü. Solar ve mobil uygulamalar için uygundur.',
    price: 8500,
    category: 'Lityum Aküler',
    stock: 20,
    featured: false,
    isVariantProduct: false,
    tags: ['LiFePO4', '12V', '100Ah'],
  },
  // Batarya
  {
    id: 'mock-batarya-modulu-51v',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-BAT-01',
    name: 'Batarya Modülü 51.2V 100Ah (Ev Tipi)',
    description: 'Ev tipi enerji depolama için hazır batarya modülü. BMS dahil, inverter ile uyumlu.',
    price: 22000,
    category: 'Batarya Modülleri',
    stock: 15,
    featured: false,
    isVariantProduct: false,
    tags: ['51.2V', '100Ah', 'Ev tipi'],
  },
  // İnverter Sistemleri
  {
    id: 'mock-inverter-sistemi-5kva',
    brand: 'Genel',
    image: PLACEHOLDER_PRODUCT_IMAGE,
    sku: 'MOCK-INV-SYS-01',
    name: 'İnverter Sistemi 5 kVA (Hybrid Paket)',
    description: 'Hybrid inverter, batarya ve güneş paneli seçenekleri ile paket inverter sistemi. Ev tipi kurulum için.',
    price: 65000,
    category: 'Hibrit İnverterler',
    stock: 10,
    featured: false,
    isVariantProduct: false,
    tags: ['5 kVA', 'Hybrid', 'Paket sistem'],
  },
]

import { mockProductsElectromarketim } from './products-mock-electromarketim'
import { mockProductsOrbitInverters } from './products-mock-orbit-inverters'

/** EMEF-22T2 kablo renk kodu → Model/Kapasite etiketi (tek üründe renk varyantı) */
const CABLE_COLOR_LABEL: Record<string, string> = {
  SB: 'Beyaz',
  SS: 'Siyah',
  TB: 'Turuncu',
  GB: 'Gri',
  YB: 'Yeşil',
  MB: 'Mavi',
  TS: 'Turuncu (Siyah soket)',
}

/** 22T2 kabloları: uzunluğa göre tek ürün, renkler Model/Kapasite varyantı. Çantalı (-cnt) ve 11kW (11T2) hariç. */
function isCableToMergeByLength(p: MockProduct): boolean {
  if (p.category !== 'Tip 2 – Tip 2 Şarj Kabloları' || !p.sku) return false
  if (!/^EMEF-22T2-[A-Z]{2}-\d+$/.test(p.sku)) return false
  if (p.id.includes('-cnt') || p.sku.includes('11T2')) return false
  return true
}

function getLengthFromSku(sku: string): number | null {
  const m = sku.match(/EMEF-22T2-[A-Z]{2}-(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

function getColorKeyFromSku(sku: string): string | null {
  const m = sku.match(/EMEF-22T2-([A-Z]{2})-\d+/)
  return m ? m[1] : null
}

function buildMergedCablesByLength(cableProducts: MockProduct[]): MockProduct[] {
  const byLength = new Map<number, MockProduct[]>()
  for (const p of cableProducts) {
    const len = getLengthFromSku(p.sku!)
    if (len == null) continue
    if (!byLength.has(len)) byLength.set(len, [])
    byLength.get(len)!.push(p)
  }
  const sortedLengths = [...byLength.keys()].sort((a, b) => a - b)
  const result: MockProduct[] = []
  for (const [length, products] of byLength.entries()) {
    const sorted = products.slice().sort((a, b) => (a.sku || '').localeCompare(b.sku || ''))
    const variants: { key: string; label: string; price: number; sku?: string }[] = []
    const imagesByVariant: string[][] = []
    for (const p of sorted) {
      const colorKey = getColorKeyFromSku(p.sku!)
      const label = colorKey ? (CABLE_COLOR_LABEL[colorKey] ?? p.sku) : (p.specifications?.['Kablo Rengi'] ?? p.sku)
      variants.push({ key: p.id, label, price: p.price, sku: p.sku })
      const imgs = p.images?.length ? p.images : (p.image ? [p.image] : [])
      imagesByVariant.push(imgs)
    }
    // Her uzunluğa farklı varsayılan renk (uzunluk sırasına göre döngüsel)
    const lengthIndex = sortedLengths.indexOf(length)
    const defaultVariantIndex = variants.length ? lengthIndex % variants.length : 0
    const defaultVariantKey = variants[defaultVariantIndex]?.key
    const hasValidImage = (x: MockProduct) => !!x.image && x.image !== PLACEHOLDER_PRODUCT_IMAGE
    const first = sorted.find(hasValidImage) ?? sorted[0]
    const defaultImage = imagesByVariant[defaultVariantIndex]?.[0] ?? first.image
    result.push({
      ...first,
      id: `hims - 22kw - tip2 - ${length} m - elektrikli - arac - sarj - kablosu`,
      name: `22kW Tip 2 ${length}m Elektrikli Araç Şarj Kablosu`,
      sku: first.sku,
      image: defaultImage,
      images: imagesByVariant[defaultVariantIndex],
      price: variants[defaultVariantIndex]?.price ?? first.price,
      variants,
      imagesByVariant,
      defaultVariantKey,
      isVariantProduct: true,
      productFamilyKey: 'EMEF-22T2',
    })
  }
  return result.sort((a, b) => getLengthFromSku(a.sku!)! - getLengthFromSku(b.sku!)!)
}

const cableProductsToMerge = mockProductsBase.filter(isCableToMergeByLength)
const baseWithoutCables = mockProductsBase.filter((p) => !isCableToMergeByLength(p))
const mergedCablesByLength = buildMergedCablesByLength(cableProductsToMerge)

const mockProductsAll: MockProduct[] = [
  ...baseWithoutCables,
  ...mergedCablesByLength,
  ...mockProductsElectromarketim,
  ...mockProductsOrbitInverters,
]

/** Sitede gösterilen ürünler; görseli olmayan veya sadece placeholder olan ürünler gizlenir. */
export const mockProducts: MockProduct[] = mockProductsAll.filter((p) => {
  if (PLACEHOLDER_PRODUCT_IDS.includes(p.id)) return false
  if (!p.image || p.image === PLACEHOLDER_PRODUCT_IMAGE) return false
  return true
})

// İsteğe bağlı: Görsel dosyası kesin olmayan ürünleri placeholder'a yönlendirmek için aşağıdaki döngüyü kullanın.
// Şu an tüm TommaTech görselleri /images/products/{id}.jpg olarak aranıyor; dosya yoksa UI'da onError placeholder gösterilir.
// mockProducts.forEach((p) => {
//   if (p.brand === 'TommaTech' && !TOMATECH_IDS_WITH_IMAGE.includes(p.id) && p.image?.startsWith('/images/products/')) {
//     p.image = PLACEHOLDER_PRODUCT_IMAGE
//   }
// })
