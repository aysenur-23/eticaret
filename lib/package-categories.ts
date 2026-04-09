export type PackageCategory = {
  slug: 'bag-evi-paketleri' | 'villa-paketleri' | 'karavan-paketleri' | 'sulama-paketleri' | 'marin-paketleri'
  title: string
  shortTitle: string
  image: string
  objectPosition?: string
  imageAlt: string
  description: string
  seoTitle: string
  seoDescription: string
  keywords: string[]
  searchHint: string
  /** mockProducts'taki category değerleriyle eşleşen filtre listesi */
  productCategories: string[]
  targetAudience: string
  useCases: string[]
  includedHighlights: string[]
  faq: Array<{ question: string; answer: string }>
}

export const PACKAGE_CATEGORIES: PackageCategory[] = [
  {
    slug: 'bag-evi-paketleri',
    title: 'Bağ Evi Paketleri',
    shortTitle: 'Bağ Evi',
    image: '/images/packages/custom/bahce.jpg',
    objectPosition: 'center 52%',
    imageAlt: 'Bağ evi, dağ evi, yayla evi ve bungalov kullanımına uygun ahşap kırsal yaşam alanı',
    description: 'Bağ evi, dağ evi, yayla evi ve bungalov için panel, inverter ve batarya kombinasyonları.',
    seoTitle: 'Bağ Evi, Dağ Evi, Yayla Evi ve Bungalov Güneş Enerji Paketleri',
    seoDescription: 'Bağ evi, dağ evi, yayla evi ve bungalov güneş enerji paketleri: panel, inverter ve batarya çözümleriyle şebekeden bağımsız veya hibrit kullanım.',
    keywords: ['bağ evi güneş enerji paketi', 'dağ evi güneş paneli', 'yayla evi solar sistem', 'bungalov güneş enerji sistemi', 'off grid küçük ev sistemi'],
    searchHint: 'Güneş Panelleri',
    productCategories: ['Güneş Panelleri', 'Off-Grid İnverterler', 'Solar Sistemler', 'Taşınabilir Güç İstasyonları', 'Taşınabilir Paneller'],
    targetAudience: 'Hafta sonu evi, dağ evi, yayla evi veya bungalov gibi küçük yaşam alanlarında güvenli ve ekonomik enerji isteyen kullanıcılar.',
    useCases: ['Aydınlatma', 'Küçük ev aletleri', 'Mini buzdolabı', 'Yedek enerji'],
    includedHighlights: ['Monokristal panel seçeneği', 'Hibrit/off-grid inverter uyumu', 'İsteğe bağlı batarya kapasitesi', 'Kompakt yaşam alanları için uygun kurulum'],
    faq: [
      {
        question: 'Bağ evi paketi hangi güç aralığına uygundur?',
        answer: 'Tüketim durumuna göre başlangıçtan orta seviyeye kadar farklı güç seçenekleri sunulur.',
      },
      {
        question: 'Kış aylarında performans nasıl olur?',
        answer: 'Kışın üretim düşse de doğru panel ve batarya kombinasyonu ile temel ihtiyaçlar karşılanabilir.',
      },
    ],
  },
  {
    slug: 'sulama-paketleri',
    title: 'Sulama Paketleri',
    shortTitle: 'Sulama',
    image: '/images/packages/custom/tarla.png',
    objectPosition: 'center 56%',
    imageAlt: 'Tarla ve tarımsal sulama düzenine uygun sulama paketi görseli',
    description: 'Tarımsal sulama için dayanıklı solar paketler.',
    seoTitle: 'Tarımsal Sulama için Güneş Enerjisi ve GES Paketleri',
    seoDescription: 'Tarla sulama pompaları için güneş enerjili sulama sistemleri, GES destekli tarımsal sulama paketleri ve solar pompa çözümleri.',
    keywords: ['tarımsal sulama güneş enerjisi', 'ges sulama sistemi', 'solar sulama pompası', 'tarla güneş paneli sulama', 'güneş enerjili su pompası'],
    searchHint: 'Solar Sistemler',
    productCategories: ['Solar Sistemler', 'Güneş Panelleri', 'Off-Grid İnverterler', 'Batarya Modülleri'],
    targetAudience: 'Tarım arazilerinde sulama maliyetini düşürmek isteyen üreticiler.',
    useCases: ['Gündüz sulama', 'Kuyu pompası besleme', 'Şebekeden uzak tarla uygulamaları'],
    includedHighlights: ['Sulama inverteri uyumu', 'Dış saha koşullarına dayanıklı ekipman', 'Yüksek verimli panel kombinasyonları'],
    faq: [
      {
        question: 'Sulama pompası için paket nasıl seçilir?',
        answer: 'Pompa gücü, çalışma süresi ve günlük su ihtiyacına göre doğru kapasite belirlenir.',
      },
      {
        question: 'Gece sulama için batarya gerekir mi?',
        answer: 'Evet, gece çalışma planı varsa uygun batarya kapasitesi eklenmesi önerilir.',
      },
    ],
  },
  {
    slug: 'karavan-paketleri',
    title: 'Karavan Paketleri',
    shortTitle: 'Karavan',
    image: '/images/packages/custom/karavan.png',
    objectPosition: 'center 58%',
    imageAlt: 'Doğa içinde park edilmiş karavan ve mobil yaşam kullanımına uygun enerji paketi görseli',
    description: 'Karavan ve mobil yaşam için taşınabilir enerji paketleri.',
    seoTitle: 'Karavan Güneş Paneli ve Taşınabilir Enerji Paketleri',
    seoDescription: 'Karavan güneş paneli, taşınabilir güç istasyonu ve mobil yaşam için enerji paketi çözümleri.',
    keywords: ['karavan güneş paneli', 'karavan enerji paketi', 'taşınabilir güç istasyonu', 'mobil yaşam güneş sistemi', 'karavan akü sistemi'],
    searchHint: 'Taşınabilir Güç İstasyonları',
    productCategories: ['Taşınabilir Güç İstasyonları', 'Taşınabilir Paneller', 'Lityum Aküler', 'Mobil / Taşınabilir Şarj İstasyonları'],
    targetAudience: 'Mobil yaşam ve kamp kullanımında hafif, güvenli ve pratik enerji çözümü arayan kullanıcılar.',
    useCases: ['Telefon/laptop şarjı', 'Kamp buzdolabı', 'Mini aydınlatma sistemleri'],
    includedHighlights: ['Katlanabilir panel opsiyonları', 'Taşınabilir güç istasyonu uyumu', 'Düşük ağırlık ve kolay kurulum'],
    faq: [
      {
        question: 'Karavan çatısına sabit montaj gerekiyor mu?',
        answer: 'İhtiyaca göre sabit veya taşınabilir panel seçenekleri kullanılabilir.',
      },
      {
        question: 'Paket şehir şebekesinden bağımsız çalışır mı?',
        answer: 'Evet, doğru depolama kapasitesiyle bağımsız kullanım senaryoları mümkündür.',
      },
    ],
  },
  {
    slug: 'villa-paketleri',
    title: 'Villa Paketleri',
    shortTitle: 'Villa',
    image: '/images/packages/custom/villa.jpg',
    objectPosition: 'center 52%',
    imageAlt: 'Çatısında yoğun güneş paneli kurulumu bulunan modern villa tipi konut',
    description: 'Villa tipi yüksek tüketim için hibrit enerji paketleri.',
    seoTitle: 'Villa Güneş Enerji Paketleri ve Hibrit İnverter Sistemleri',
    seoDescription: 'Lüks ve yüksek tüketimli konutlar için villa güneş enerji paketleri, çatı GES çözümleri ve hibrit inverter sistemleri.',
    keywords: ['villa güneş enerji paketi', 'villa çatı ges', 'lüks konut güneş paneli', 'villa hibrit inverter', 'villa batarya depolama'],
    searchHint: 'Hibrit İnverterler',
    productCategories: ['Hibrit İnverterler', 'Güneş Panelleri', 'Enerji Depolama Sistemleri', 'Batarya Modülleri', 'Lityum Aküler'],
    targetAudience: 'Yüksek tüketimli konutlarda tasarruf ve enerji sürekliliği arayan villa sahipleri.',
    useCases: ['Klima ve havuz ekipmanları', 'Beyaz eşya yükleri', 'Kesinti anında yedekleme'],
    includedHighlights: ['Yüksek güçlü inverter seçenekleri', 'Akıllı enerji yönetimi', 'Genişletilebilir depolama altyapısı'],
    faq: [
      {
        question: 'Villa paketinde batarya şart mı?',
        answer: 'Şart değildir ancak kesintisiz kullanım ve gece tüketimi için batarya önerilir.',
      },
      {
        question: 'Paket sonradan büyütülebilir mi?',
        answer: 'Evet, doğru inverter ve batarya seçimiyle sistem modüler şekilde genişletilebilir.',
      },
    ],
  },
  {
    slug: 'marin-paketleri',
    title: 'Marin Paketleri',
    shortTitle: 'Marin',
    image: '/images/packages/custom/marin.jpg',
    objectPosition: 'center 60%',
    imageAlt: 'Üst güvertesinde solar panel bulunan katamaran tipi tekne için marin enerji paketi görseli',
    description: 'Tekne ve marin kullanım için düşük voltaj enerji paketleri.',
    seoTitle: 'Tekne ve Yatlar için Marin Güneş Enerji Paketleri',
    seoDescription: 'Tekne, yat ve marin uygulamalar için tekneye entegre güneş paneli, batarya ve düşük voltaj enerji paketi çözümleri.',
    keywords: ['marin güneş enerji paketi', 'tekne güneş paneli', 'yat solar sistem', 'marin lityum batarya', 'tekneye entegre güneş paneli'],
    searchHint: 'Lityum Aküler',
    productCategories: ['Lityum Aküler', 'Batarya Modülleri', 'Enerji Depolama Sistemleri', 'Off-Grid İnverterler', 'Taşınabilir Güç İstasyonları'],
    targetAudience: 'Tekne ve yatlarda güvenli, tuzlu su koşullarına uygun enerji çözümü isteyen kullanıcılar.',
    useCases: ['Aydınlatma ve elektronik sistemler', 'Navigasyon ekipmanları', 'Uzun süreli seyir destek enerjisi'],
    includedHighlights: ['Marin tip lityum batarya seçenekleri', 'Düşük voltaj sistem uyumu', 'Kompakt ve dayanıklı tasarım'],
    faq: [
      {
        question: 'Marin paketleri tuzlu su koşullarına uygun mu?',
        answer: 'Seçilen ekipmanlar deniz koşullarına uygunluk kriterleri gözetilerek önerilir.',
      },
      {
        question: 'Teknede alan kısıtı varsa hangi paket önerilir?',
        answer: 'Kompakt inverter ve yüksek yoğunluklu batarya kombinasyonu tercih edilir.',
      },
    ],
  },
]

export function getPackageCategory(slug: string) {
  return PACKAGE_CATEGORIES.find((item) => item.slug === slug)
}
