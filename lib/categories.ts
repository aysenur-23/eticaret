/**
 * Ürün kategorileri – filtre, URL ve çeviri anahtarları için tek kaynak.
 * Sidebar'da az sayıda ana grup gösterilir; her grup birden fazla product.category değerini toplar.
 *
 * Kategori hiyerarşisi:
 * 1. Elektrikli Araç Şarj Ürünleri  → AC, DC, Mobil
 * 2. EV Şarj Kabloları              → Tip 2, Çantalı
 * 3. EV Şarj Aksesuarları           → Adaptörler, Fiş/Priz, Aksesuarlar
 * 4. Batarya ve Enerji Depolama      → Lityum, Kurşun, Batarya Modülleri
 * 5. İnverterler                     → Hibrit, Off-Grid, Mikro
 * 6. Güneş Enerjisi                  → Güneş Panelleri, Taşınabilir, Solar Sistemler
 * 7. Enerji Depolama Sistemleri      → ESS, Taşınabilir Güç
 * 8. Isı Pompası ve HVAC             → Isı Pompası ve HVAC
 * 9. Enerji Yönetimi                 → Enerji Yönetimi
 */

/** Sidebar'da gösterilecek ana kategoriler (gruplar). URL'de category=<id> kullanılır. */
export const CATEGORY_GROUPS = [
  {
    id: 'elektrikli-arac-sarj-urunleri',
    labelKey: 'groupEVMobility', // Elektrikli Araç Şarj Ürünleri
    categoryValues: [
      'AC Şarj İstasyonları',
      'DC Hızlı Şarj İstasyonları',
      'Mobil / Taşınabilir Şarj İstasyonları',
      'Tip 2 – Tip 2 Şarj Kabloları',
      'Çantalı Şarj Kabloları',
      'Adaptörler',
      'Fiş / Priz Dönüştürücüler',
      'EV Şarj Aksesuarları',
    ],
  },
  {
    id: 'batarya-depolama',
    labelKey: 'groupBatteryModules', // Batarya ve Enerji Depolama
    categoryValues: [
      'Lityum Aküler',
      'Kurşun Asit Aküler',
      'Batarya Modülleri',
      'Enerji Depolama Sistemleri',
      'Taşınabilir Güç İstasyonları',
    ],
  },
  {
    id: 'inverterler',
    labelKey: 'groupInverters', // İnverterler
    categoryValues: [
      'Hibrit İnverterler',
      'Off-Grid İnverterler',
      'Mikro İnverter',
    ],
  },
  {
    id: 'gunes-enerjisi',
    labelKey: 'groupSolarEnergy', // Güneş Enerjisi
    categoryValues: [
      'Güneş Panelleri',
      'Taşınabilir Paneller',
      'Solar Sistemler',
    ],
  },
  {
    id: 'isi-pompasi-hvac',
    labelKey: 'groupHeatPumpsHVAC', // Isı Pompası ve HVAC
    categoryValues: [
      'Isı Pompası ve HVAC',
    ],
  },
  {
    id: 'enerji-yonetimi',
    labelKey: 'groupEnergyManagement', // Enerji Yönetimi
    categoryValues: [
      'Enerji Yönetimi',
    ],
  },
] as const

export type CategoryGroupId = (typeof CATEGORY_GROUPS)[number]['id']

/** Tüm kategori değerleri (static export / API yokken menü fallback için). */
export const ALL_CATEGORY_VALUES = CATEGORY_GROUPS.flatMap((g) => [...g.categoryValues])

/** Bir product.category değerinin hangi gruba ait olduğunu döndürür (URL ve sidebar filtre için). */
export function getGroupIdForCategory(category: string): CategoryGroupId | null {
  for (const group of CATEGORY_GROUPS) {
    if ((group.categoryValues as readonly string[]).includes(category)) return group.id
  }
  return null
}

/** Grup id'sine göre gruptaki tüm category değerlerini döndürür. */
export function getCategoryValuesByGroupId(groupId: string): string[] {
  const group = CATEGORY_GROUPS.find((g) => g.id === groupId)
  return group ? [...group.categoryValues] : []
}

/** Eski tekil kategori listesi – ürün detay sayfası breadcrumb/label için hâlâ kullanılabilir. */
export const PRODUCT_CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.categoryValues.map((value) => ({ value, key: getCategoryKeyFromValue(value) }))
)

function getCategoryKeyFromValue(value: string): string {
  switch (value) {
    case 'AC Şarj İstasyonları': return 'categoryACStations'
    case 'DC Hızlı Şarj İstasyonları': return 'categoryDCStations'
    case 'Mobil / Taşınabilir Şarj İstasyonları': return 'categoryPortableStations'
    case 'Tip 2 – Tip 2 Şarj Kabloları': return 'categoryTip2Cables'
    case 'Çantalı Şarj Kabloları': return 'categoryBaggedCables'
    case 'Adaptörler': return 'categoryAdapters'
    case 'Fiş / Priz Dönüştürücüler': return 'categoryFişPriz'
    case 'EV Şarj Aksesuarları': return 'categoryEVAccessories'
    case 'Lityum Aküler': return 'categoryLiFePO4'
    case 'Kurşun Asit Aküler': return 'categoryLeadAcid'
    case 'Batarya Modülleri': return 'categoryBatteryModules'
    case 'Hibrit İnverterler': return 'categoryHybridInverters'
    case 'Off-Grid İnverterler': return 'categoryOffGridInverters'
    case 'Mikro İnverter': return 'categoryMicroInverters'
    case 'Güneş Panelleri': return 'categorySolarPanels'
    case 'Taşınabilir Paneller': return 'categoryPortablePanels'
    case 'Solar Sistemler': return 'categorySolarSystems'
    case 'Enerji Depolama Sistemleri': return 'categoryESS'
    case 'Taşınabilir Güç İstasyonları': return 'categoryMobilePowerStations'
    case 'Isı Pompası ve HVAC': return 'categoryHeatPumps'
    case 'Enerji Yönetimi': return 'categoryEnergyManagement'
    default: return value
  }
}

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]['value']

/** Kategori value (product.category) ile çeviri key'ini döndürür. */
export function getCategoryKey(value: string): string | undefined {
  return getCategoryKeyFromValue(value) || undefined
}
