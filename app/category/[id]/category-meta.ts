export type CategoryMetaItem = {
  title: string
  description: string
  image: string
  imagePosition?: string
  imageScale?: number
  objectFit?: 'cover' | 'contain'
}

/** Kategori sayfası hero görselleri – ana sayfa kartlarından farklı, sayfa başına büyük görsel. */
export const CATEGORY_META: Record<string, CategoryMetaItem> = {
  'ev-sarj': {
    title: 'Şarj İstasyonları',
    description:
      'Duvar tipi, taşınabilir ve hızlı şarj istasyonları. Ev, site ve işletmeler için AC/DC çözümler.',
    image: '/images/categories/sarj.png',
    imagePosition: 'center center',
    imageScale: 0.78,
  },
  'enerji-depolama': {
    title: 'Batarya Paketleri',
    description:
      'Ev tipi lityum bataryalar, taşınabilir güç istasyonları ve endüstriyel ESS sistemleri.',
    image: '/images/categories/batarya.png',
    imagePosition: 'center center',
    imageScale: 0.78,
  },
  'gunes-enerjisi': {
    title: 'GES & Güneş Paneli',
    description:
      'Monokristal güneş panelleri, şarj kontrolörler ve güneş enerjisi aksesuarları.',
    image: '/images/categories/panel.png',
    imagePosition: 'center center',
    imageScale: 0.78,
  },
  'inverterler': {
    title: 'İnverterler',
    description:
      'On-Grid, Off-Grid ve Hibrit inverterler. Ev ve ticari projeler için tüm kapasiteler.',
    image: 'https://tommatech.de/images/kategory/19_inverter-cesitleri-fiyatlari_0.webp',
    imagePosition: 'center 25%',
    imageScale: 0.78,
  },
  'isi-pompalari': {
    title: 'Isı Pompaları',
    description: 'Monoblok, split ve havuz ısı pompaları. A+++ enerji verimliliği.',
    image:
      'https://tommatech.de/images/kategory/127_tommatech-isi-pompasi-modelleri-ve-fiyatlari_0.webp',
    imagePosition: 'center 20%',
    imageScale: 0.78,
  },
  'akilli-enerji': {
    title: 'Akıllı Enerji & Aksesuarlar',
    description: 'Smart meter, dongle, EPS box ve enerji yönetim sistemleri.',
    image: 'https://tommatech.de/images/kategory/103_solar-sistem-aksesuarlari_0.webp',
    imagePosition: 'center 30%',
    imageScale: 0.78,
  },
}
