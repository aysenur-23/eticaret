export type PackageCategory = {
  slug: 'bag-evi-paketleri' | 'villa-paketleri' | 'karavan-paketleri' | 'sulama-paketleri' | 'marin-paketleri'
  title: string
  shortTitle: string
  image: string
  description: string
  seoDescription: string
  searchHint: string
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
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    description: 'Bağ evi için panel, inverter ve batarya kombinasyonları.',
    seoDescription: 'Bağ evi güneş enerji paketleri: panel, inverter ve batarya çözümleri.',
    searchHint: 'Güneş Panelleri',
    targetAudience: 'Hafta sonu kullanımına uygun, ekonomik ve güvenli enerji isteyen bağ evi kullanıcıları.',
    useCases: ['Aydınlatma', 'Küçük ev aletleri', 'Yedek enerji'],
    includedHighlights: ['Monokristal panel seçeneği', 'Hibrit/off-grid inverter uyumu', 'İsteğe bağlı batarya kapasitesi'],
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
    slug: 'villa-paketleri',
    title: 'Villa Paketleri',
    shortTitle: 'Villa',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    description: 'Villa tipi yüksek tüketim için hibrit enerji paketleri.',
    seoDescription: 'Villa güneş enerji paketleri ve hibrit inverter sistemleri.',
    searchHint: 'Hibrit İnverterler',
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
    slug: 'karavan-paketleri',
    title: 'Karavan Paketleri',
    shortTitle: 'Karavan',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    description: 'Karavan ve mobil yaşam için taşınabilir enerji paketleri.',
    seoDescription: 'Karavan güneş paneli ve taşınabilir güç paketi çözümleri.',
    searchHint: 'Taşınabilir Güç İstasyonları',
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
    slug: 'sulama-paketleri',
    title: 'Sulama Paketleri',
    shortTitle: 'Sulama',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    description: 'Tarımsal sulama için dayanıklı solar paketler.',
    seoDescription: 'Tarımsal solar sulama paketleri ve güneş enerjisi çözümleri.',
    searchHint: 'Solar Sistemler',
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
    slug: 'marin-paketleri',
    title: 'Marin Paketleri',
    shortTitle: 'Marin',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
    description: 'Tekne ve marin kullanım için düşük voltaj enerji paketleri.',
    seoDescription: 'Marin uygulamalar için güneş enerji ve batarya paketleri.',
    searchHint: 'Lityum Aküler',
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
