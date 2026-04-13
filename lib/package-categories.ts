export type PackageCategory = {
  slug: 'bag-evi-paketleri' | 'villa-paketleri' | 'karavan-paketleri' | 'sulama-paketleri' | 'marin-paketleri'
  title: string
  shortTitle: string
  image: string
  description: string
  seoDescription: string
  searchHint: string
  targetAudience: string
  forWhom: string
  deviceList: string[]
  dailyUsage: string
  includesItems: string[]
  upgradeOptions: string[]
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
    seoDescription: 'Bağ evi güneş enerji paketleri: panel, inverter ve batarya çözümleri. Hafta sonu ve mevsimlik kullanım için ideal.',
    searchHint: 'Güneş Panelleri',
    targetAudience: 'Hafta sonu kullanımına uygun, ekonomik ve güvenli enerji isteyen bağ evi kullanıcıları.',
    forWhom: 'Hafta sonu veya mevsimlik kullandığı bağ, bahçe ve köy evi olan, şebekeye bağlı olmadan temel ihtiyaçlarını karşılamak isteyen kullanıcılar için tasarlandı.',
    deviceList: [
      '8–15 adet LED aydınlatma',
      'Mini buzdolabı (90–150 W)',
      'Televizyon',
      'Telefon ve tablet şarjı',
      'Fan veya küçük vantilatör',
      'Su pompası (küçük kapasite)',
    ],
    dailyUsage: 'Günde ortalama 4–8 saat hafif kullanım. Tipik tüketim 3–5 kWh/gün. Hafta sonu ağırlıklı; uzun süreli boş kalma dönemlerinde batarya ayakta kalır.',
    includesItems: [
      '1–3 kWp monokristal güneş paneli',
      'Off-grid veya hibrit inverter (1–3 kW)',
      '2–5 kWh LiFePO4 veya GEL batarya',
      'Montaj konstrüksiyonu ve kablo seti',
      'MPPT şarj kontrol ünitesi',
    ],
    upgradeOptions: [
      'Ek güneş paneli ekleyerek kapasite artırımı',
      'Batarya modülü büyütme (ek kW)',
      'Akıllı izleme ve uygulama desteği',
      'Hibrit invertera yükseltme ile şebeke entegrasyonu',
    ],
    useCases: ['Aydınlatma', 'Küçük ev aletleri', 'Yedek enerji'],
    includedHighlights: ['Monokristal panel seçeneği', 'Hibrit/off-grid inverter uyumu', 'İsteğe bağlı batarya kapasitesi'],
    faq: [
      {
        question: 'Bağ evi paketi hangi güç aralığına uygundur?',
        answer: 'Tüketim durumuna göre 1 kWp–3 kWp arası başlangıç seçenekleri önerilir. Uzman ekibimiz ihtiyaç analizi yaparak doğru kapasiteyi belirler.',
      },
      {
        question: 'Kış aylarında performans nasıl olur?',
        answer: 'Kışın güneş ışınım süresi kısalsa da doğru panel ve batarya kombinasyonu ile temel ihtiyaçlar (aydınlatma, şarj) rahatlıkla karşılanabilir.',
      },
      {
        question: 'Kurulum ne kadar sürer?',
        answer: 'Küçük bağ evi sistemleri genellikle 1 iş gününde kurulabilir. Uzak lokasyonlar için nakliye süresi ayrıca planlanır.',
      },
    ],
  },
  {
    slug: 'villa-paketleri',
    title: 'Villa Paketleri',
    shortTitle: 'Villa',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    description: 'Villa tipi yüksek tüketim için hibrit enerji paketleri.',
    seoDescription: 'Villa güneş enerji paketleri ve hibrit inverter sistemleri. Yüksek tüketim için tam donanımlı enerji çözümü.',
    searchHint: 'Hibrit İnverterler',
    targetAudience: 'Yüksek tüketimli konutlarda tasarruf ve enerji sürekliliği arayan villa sahipleri.',
    forWhom: 'Yıl boyu veya yaz sezonunda sürekli oturulan villa ve müstakil evler için. Klima, havuz, beyaz eşya gibi yüksek güçlü cihazları olan ev sahiplerine özeldir.',
    deviceList: [
      'Klima sistemi (1–3 adet, 12.000–24.000 BTU)',
      'Çamaşır ve bulaşık makinesi',
      'Havuz pompası ve ısıtma',
      'Buzdolabı ve derin dondurucu',
      'Aydınlatma (iç + dış peyzaj)',
      'EV şarj istasyonu (opsiyonel)',
    ],
    dailyUsage: 'Günde ortalama 20–40 kWh tüketim. Yaz aylarında klima yüküyle birlikte pik talep 30–50 kWh/gün\'e ulaşabilir. Yıl boyu sürekli ve kararlı üretim gereksinimi.',
    includesItems: [
      '6–12 kWp yüksek verimli güneş paneli',
      '5–10 kW hibrit inverter',
      '10–20 kWh modüler batarya depolama',
      'Akıllı enerji yönetim birimi',
      'Montaj altyapısı ve grid entegrasyonu',
    ],
    upgradeOptions: [
      'Batarya kapasitesini 30+ kWh\'e çıkarma',
      '3 fazlı sisteme yükseltme',
      'EV şarj noktası entegrasyonu (V2H)',
      'Uzaktan izleme ve otomasyon ekleme',
    ],
    useCases: ['Klima ve havuz ekipmanları', 'Beyaz eşya yükleri', 'Kesinti anında yedekleme'],
    includedHighlights: ['Yüksek güçlü inverter seçenekleri', 'Akıllı enerji yönetimi', 'Genişletilebilir depolama altyapısı'],
    faq: [
      {
        question: 'Villa paketinde batarya şart mı?',
        answer: 'Şart değil; ancak kesintisiz kullanım, gece tüketimi ve şebeke kesintilerinde yedekleme için batarya kesinlikle önerilir.',
      },
      {
        question: 'Paket sonradan büyütülebilir mi?',
        answer: 'Evet. Modüler hibrit inverter ve batarya altyapısıyla sistem kolayca genişletilebilir, ek panel veya modül eklenebilir.',
      },
      {
        question: 'Havuz pompasını besleyebilir mi?',
        answer: 'Evet. Doğru inverter kapasitesi seçildiğinde havuz pompası ve benzeri yüksek güçlü yükler rahatça beslenir.',
      },
    ],
  },
  {
    slug: 'karavan-paketleri',
    title: 'Karavan Paketleri',
    shortTitle: 'Karavan',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    description: 'Karavan ve mobil yaşam için taşınabilir enerji paketleri.',
    seoDescription: 'Karavan güneş paneli ve taşınabilir güç paketi çözümleri. Hafif, kompakt, şebeke bağımsız.',
    searchHint: 'Taşınabilir Güç İstasyonları',
    targetAudience: 'Mobil yaşam ve kamp kullanımında hafif, güvenli ve pratik enerji çözümü arayan kullanıcılar.',
    forWhom: 'Tatil, kamp ve uzun yol seyahati için karavan veya mobil yaşam aracı kullananlar. Şebeke bağlantısı olmadan doğada konfor arayanlar için idealdir.',
    deviceList: [
      'Telefon, tablet ve laptop şarjı',
      'Mini kompresörlü buzdolabı (30–60 W)',
      'Aydınlatma (LED şerit ve taşınabilir)',
      'Drone ve kamera ekipmanı şarjı',
      'Taşınabilir hoparlör ve elektrikli battaniye',
      '12V su pompası',
    ],
    dailyUsage: 'Günde 1–3 kWh tüketim. Hareket halinde araç şarjı ile desteklenir, park halinde güneş paneli şarjı devreye girer. Kompakt kullanım önceliklidir.',
    includesItems: [
      '100–400 W katlanabilir veya esnek güneş paneli',
      'Taşınabilir güç istasyonu (500 Wh–2 kWh)',
      'MPPT şarj kontrol cihazı',
      '12V/USB/AC çıkış modülleri',
      'Taşıma çantası ve bağlantı kabloları',
    ],
    upgradeOptions: [
      'Ek panel ile şarj hızını artırma',
      'Karavan çatısına sabit panel montajı',
      'Daha büyük kapasiteli güç istasyonuna geçiş',
      'Araç şarj adaptörü entegrasyonu',
    ],
    useCases: ['Telefon/laptop şarjı', 'Kamp buzdolabı', 'Mini aydınlatma sistemleri'],
    includedHighlights: ['Katlanabilir panel opsiyonları', 'Taşınabilir güç istasyonu uyumu', 'Düşük ağırlık ve kolay kurulum'],
    faq: [
      {
        question: 'Karavan çatısına sabit montaj gerekiyor mu?',
        answer: 'İhtiyaca göre sabit veya taşınabilir panel seçenekleri kullanılabilir. Taşınabilir paneller daha esnektir ve farklı konumlarda yönlendirilebilir.',
      },
      {
        question: 'Paket şehir şebekesinden bağımsız çalışır mı?',
        answer: 'Evet. Güç istasyonu ve güneş paneli kombinasyonuyla birkaç günlük bağımsız kullanım rahatlıkla sağlanabilir.',
      },
      {
        question: 'Ağırlık ve boyut kısıtı var mı?',
        answer: 'Karavan paketleri hafiflik öncelikli seçilir. 100W katlanabilir panel yaklaşık 2–3 kg, güç istasyonu ise 5–15 kg arasında değişir.',
      },
    ],
  },
  {
    slug: 'sulama-paketleri',
    title: 'Sulama Paketleri',
    shortTitle: 'Sulama',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    description: 'Tarımsal sulama için dayanıklı solar paketler.',
    seoDescription: 'Tarımsal solar sulama paketleri ve güneş enerjisi çözümleri. Şebeke bağımsız, düşük işletme maliyeti.',
    searchHint: 'Solar Sistemler',
    targetAudience: 'Tarım arazilerinde sulama maliyetini düşürmek isteyen üreticiler.',
    forWhom: 'Tarla, bahçe ve sera işleten çiftçiler, şebekeden uzak arazilerde sulama maliyetini sıfıra indirmek isteyen tarım üreticileri için geliştirildi.',
    deviceList: [
      'Dalgıç pompa (0.75 kW–7.5 kW)',
      'Yüzey sulama pompası',
      'Damlama ve yağmurlama sistemi kontrol ünitesi',
      'Otomatik vana ve sensör sistemi',
      'Kuyu seviye sensörü',
    ],
    dailyUsage: 'Gündüz güneş saatlerinde 4–8 saat sürekli pompa çalışması. Tipik yaz günü üretim: 10–30 kWh. Şebekesiz çalışma ve yakıt tasarrufu ön planda.',
    includesItems: [
      '2–10 kWp güneş paneli dizisi',
      'Solar sulama inverteri (VFD destekli)',
      'Otomatik başlatma / durdurma kontrol panosu',
      'Dış saha IP65+ ekipman grubu',
      'Montaj konstrüksiyonu ve kablo altyapısı',
    ],
    upgradeOptions: [
      'Panel dizisi büyütme ile daha derin kuyu desteği',
      'Gece sulama için batarya modülü ekleme',
      'GSM/uzaktan izleme ve kontrol sistemi',
      'Birden fazla pompa için paralel bağlantı genişletmesi',
    ],
    useCases: ['Gündüz sulama', 'Kuyu pompası besleme', 'Şebekeden uzak tarla uygulamaları'],
    includedHighlights: ['Sulama inverteri uyumu', 'Dış saha koşullarına dayanıklı ekipman', 'Yüksek verimli panel kombinasyonları'],
    faq: [
      {
        question: 'Sulama pompası için paket nasıl seçilir?',
        answer: 'Pompa gücü (kW), çalışma süresi (saat/gün) ve günlük su ihtiyacı (m³) baz alınarak doğru panel ve inverter kapasitesi belirlenir. Ücretsiz danışmanlık için iletişime geçin.',
      },
      {
        question: 'Gece sulama için batarya gerekir mi?',
        answer: 'Evet. Gece veya bulutlu havalarda çalışma planı varsa uygun kapasitede batarya modülü eklenmesi önerilir.',
      },
      {
        question: 'Kuraklık döneminde sistem ne yapar?',
        answer: 'Sistem, kuyu seviyesi sensörü bağlandığında otomatik olarak kuru çalışmaya karşı koruma sağlar ve pompayı durdurur.',
      },
    ],
  },
  {
    slug: 'marin-paketleri',
    title: 'Marin Paketleri',
    shortTitle: 'Marin',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
    description: 'Tekne ve marin kullanım için düşük voltaj enerji paketleri.',
    seoDescription: 'Marin uygulamalar için güneş enerji ve batarya paketleri. Tuzlu su koşullarına dayanıklı, kompakt.',
    searchHint: 'Lityum Aküler',
    targetAudience: 'Tekne ve yatlarda güvenli, tuzlu su koşullarına uygun enerji çözümü isteyen kullanıcılar.',
    forWhom: 'Tekne, katamaran, yat ve motorbot sahipleri. Rıhtımda şebeke bağımsız kalmak veya uzun seyirlerde güvenli enerji kaynağı arayan denizci kullanıcılar için idealdir.',
    deviceList: [
      'VHF telsiz ve GPS navigasyon sistemi',
      'Seyir ve güverte aydınlatması',
      'Mini buzdolabı / soğutucu',
      'Telefon, kamera ve elektronik şarjı',
      'Çapa ırgat motoru (küçük tekneler)',
      'Tatlı su pompası ve tuvalet sistemi',
    ],
    dailyUsage: 'Günde 3–8 kWh tüketim. Seyir halinde rüzgar + güneş kombinasyonu ile desteklenebilir. Rıhtımda kalma süresinde güneş paneli ile tam şarj.',
    includesItems: [
      'Esnek veya sert monokristal marin panel (100–400 W)',
      'LiFePO4 marin batarya (100–200 Ah / 12V–24V)',
      'MPPT marin şarj kontrolörü',
      'Deniz koşullarına uygun kablo ve konnektörler',
      'Şarj durumu göstergesi (BMS dahil)',
    ],
    upgradeOptions: [
      'Rüzgar türbini ile hibrit üretim sistemi',
      'Yük izleme ve akıllı dağıtım paneli',
      'İkinci batarya bankı (kabin + start ayrımı)',
      '220V invertör eklenerek AC cihaz desteği',
    ],
    useCases: ['Aydınlatma ve elektronik sistemler', 'Navigasyon ekipmanları', 'Uzun süreli seyir destek enerjisi'],
    includedHighlights: ['Marin tip lityum batarya seçenekleri', 'Düşük voltaj sistem uyumu', 'Kompakt ve dayanıklı tasarım'],
    faq: [
      {
        question: 'Marin paketleri tuzlu su koşullarına uygun mu?',
        answer: 'Evet. Önerilen tüm ekipmanlar deniz koşullarına uygunluk (IP67/IP68) ve tuz spreyi dayanımı gözetilerek seçilir.',
      },
      {
        question: 'Teknede alan kısıtı varsa hangi paket önerilir?',
        answer: 'Esnek güneş paneli + yüksek yoğunluklu LiFePO4 batarya kombinasyonu en az yer kaplarken maksimum kapasiteyi sağlar.',
      },
      {
        question: 'Mevcut kurşun asit akü sistemiyle uyumlu mu?',
        answer: 'LiFePO4 sistemler genellikle mevcut elektrik altyapısıyla uyumludur. Geçiş için BMS ve şarj kontrolörü uyumu kontrol edilmesi yeterlidir.',
      },
    ],
  },
]

export function getPackageCategory(slug: string) {
  return PACKAGE_CATEGORIES.find((item) => item.slug === slug)
}
