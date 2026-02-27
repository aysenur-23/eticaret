/**
 * Ürün kategorileri – filtre, URL ve çeviri anahtarları için tek kaynak.
 * Sidebar'da az sayıda ana grup gösterilir; her grup birden fazla product.category değerini toplar.
 */

/** Sidebar'da gösterilecek ana kategoriler (gruplar). URL'de category=<id> kullanılır. */
export const CATEGORY_GROUPS = [
  {
    id: 'enerji-depolama',
    labelKey: 'groupEnergyStorage',
    categoryValues: [
      'Ev Tipi Yüksek Voltaj Lityum',
      'Marin/Karavan Tipi Düşük Voltaj Lityum',
      'Taşınabilir Güç İstasyonları',
      'Endüstriyel ESS Sistemleri',
      'Taşınabilir Güç Kaynakları',
      'Akü',
      'Lityum (LiFePO4) Aküler',
      'Batarya',
    ],
  },
  {
    id: 'ev-sarj',
    labelKey: 'groupEVCharging',
    categoryValues: [
      'Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları',
      'Taşınabilir Şarj İstasyonları',
      'AC Araç Şarj İstasyonları',
      'DC Araç Şarj İstasyonları',
      'Araç Şarj Kabloları',
      'Elektrikli Araç Şarj ve V2L',
      'Araç Elektrik Aktarım (V2L / C2L) Adaptörleri ve Dönüştürücüler',
      'Elektrikli Araç Şarj İstasyonu Standları, Çantalar ve Aksesuarlar',
      'Şarj İstasyonu Yönetim Yazılımları ve Ticari Çözümler',
      'Elektrikli Araç (EV) Şarj Sistemleri',
    ],
  },
  {
    id: 'gunes-enerjisi',
    labelKey: 'groupSolarGES',
    categoryValues: [
      'Güneş Panelleri',
      'Şarj Kontrol Cihazları',
      'Solar Dış Mekan Aydınlatma Sistemleri',
      'Solar Yapı ve Montaj Sistemleri',
      'Tarımsal Solar Sulama Sistemleri',
    ],
  },
  {
    id: 'inverterler',
    labelKey: 'groupInverters',
    categoryValues: [
      'On-Grid İnverterler',
      'Hybrid İnverterler',
      'Off-Grid İnverterler',
      'İnverter Sistemleri',
    ],
  },
  {
    id: 'isi-pompalari',
    labelKey: 'groupHeatPumps',
    categoryValues: ['Isı Pompaları'],
  },
  {
    id: 'akilli-enerji',
    labelKey: 'groupSmartEnergy',
    categoryValues: ['Akıllı Enerji Yönetimi ve Aksesuarlar'],
  },
] as const

export type CategoryGroupId = (typeof CATEGORY_GROUPS)[number]['id']

/** Tüm kategori değerleri (static export / API yokken menü fallback için). */
export const ALL_CATEGORY_VALUES = CATEGORY_GROUPS.flatMap((g) => [...g.categoryValues])

/** Bir product.category değerinin hangi gruba ait olduğunu döndürür (URL ve sidebar filtre için). */
export function getGroupIdForCategory(category: string): CategoryGroupId | null {
  for (const group of CATEGORY_GROUPS) {
    if (group.categoryValues.includes(category)) return group.id
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
  const keys: Record<string, string> = {
    'AC Araç Şarj İstasyonları': 'categoryACCharging',
    'Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları': 'categoryWallMountedEVCharging',
    'Taşınabilir Şarj İstasyonları': 'categoryPortableChargingStations',
    'DC Araç Şarj İstasyonları': 'categoryDCCharging',
    'Araç Şarj Kabloları': 'categoryChargingCables',
    'Elektrikli Araç Şarj ve V2L': 'categoryEVChargingV2L',
    'Şarj İstasyonu Yönetim Yazılımları ve Ticari Çözümler': 'categoryChargingStationSoftware',
    'Araç Elektrik Aktarım (V2L / C2L) Adaptörleri ve Dönüştürücüler': 'categoryV2LC2LAdapters',
    'Elektrikli Araç Şarj İstasyonu Standları, Çantalar ve Aksesuarlar': 'categoryEVChargingStandsBags',
    'Taşınabilir Güç Kaynakları': 'categoryPortablePower',
    'Akü': 'categoryBattery',
    'Lityum (LiFePO4) Aküler': 'categoryLiFePO4',
    'Batarya': 'categoryBatteryPack',
    'Güneş Panelleri': 'categorySolarPanels',
    'On-Grid İnverterler': 'categoryOnGridInverters',
    'Hybrid İnverterler': 'categoryHybridInverters',
    'Off-Grid İnverterler': 'categoryOffGridInverters',
    'İnverter Sistemleri': 'categoryInverterSystems',
    'Şarj Kontrol Cihazları': 'categoryChargeControllers',
    'Ev Tipi Yüksek Voltaj Lityum': 'categoryEvHighVoltage',
    'Marin/Karavan Tipi Düşük Voltaj Lityum': 'categoryMarinLowVoltage',
    'Taşınabilir Güç İstasyonları': 'categoryMobilePowerStations',
    'Endüstriyel ESS Sistemleri': 'categoryIndustrialESS',
    'Isı Pompaları': 'categoryHeatPumps',
    'Elektrikli Araç (EV) Şarj Sistemleri': 'categoryEVCharging',
    'Tarımsal Solar Sulama Sistemleri': 'categorySolarIrrigation',
    'Akıllı Enerji Yönetimi ve Aksesuarlar': 'categorySmartEnergyAccessories',
    'Solar Dış Mekan Aydınlatma Sistemleri': 'categorySolarOutdoorLighting',
    'Solar Yapı ve Montaj Sistemleri': 'categorySolarStructureMounting',
  }
  return keys[value] ?? 'categorySmartEnergyAccessories'
}

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]['value']

/** Kategori value (product.category) ile çeviri key'ini döndürür. */
export function getCategoryKey(value: string): string | undefined {
  return getCategoryKeyFromValue(value) || undefined
}
