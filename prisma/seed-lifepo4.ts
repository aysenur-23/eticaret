/**
 * Sadece Lityum (LiFePO4) Aküler kategorisi ve ORBİT ürünlerini ekler.
 * Mevcut veritabanına dokunmadan çalışır (upsert kullanır).
 * Kullanım: npx tsx prisma/seed-lifepo4.ts
 */

import { PrismaClient, Lifecycle } from '@prisma/client'

const prisma = new PrismaClient()

const lifepo4BaseSpecs = {
  cell_type: 'Prizmatik (Prismatic)',
  cycle_life: '6000 Cycle (%80 D.O.D)',
  temp_charge_c: '0°C - 60°C',
  temp_discharge_c: '-20°C - 60°C',
  temp_nominal_c: 25,
}

const lifepo4Products: Array<{
  slug: string
  name: string
  nameEn: string
  mpn: string
  variantSku: string
  price: number
  weightG: number | null
  dimensions: string
  caseType: string
  cycle?: string
  features?: string
  note?: string
}> = [
  { slug: 'orbit-12v-100ah-abs', name: 'ORBİT 12 V 100 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 12V 100Ah LiFePO4 Battery - ABS Case', mpn: 'GU12100', variantSku: 'OE-12V100Ah-P-ABS', price: 526, weightG: 13000, dimensions: '332x171x220 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-12v-200ah-abs', name: 'ORBİT 12 V 200 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 12V 200Ah LiFePO4 Battery - ABS Case', mpn: 'GU12200', variantSku: 'OE-12V200Ah-P-ABS', price: 835.33, weightG: 23000, dimensions: '498x244x220 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-12v-420ah-abs', name: 'ORBİT 12 V 420 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 12V 420Ah LiFePO4 Battery - ABS Case', mpn: 'GU12420', variantSku: 'OE-12V420Ah-P-ABS', price: 1652.74, weightG: 43000, dimensions: '635x244x220 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-12v-100ah-marine', name: 'ORBİT 12 V 100 Ah LiFePO4 Akü - Marin Tip (VP Serisi)', nameEn: 'ORBİT 12V 100Ah LiFePO4 Battery - Marine (VP Series)', mpn: 'VP12100', variantSku: 'OE-12V100Ah-P-ABS-MARINE', price: 698, weightG: null, dimensions: '-', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var), Victron Uyumlu' },
  { slug: 'orbit-12v-200ah-marine', name: 'ORBİT 12 V 200 Ah LiFePO4 Akü - Marin Tip (VP Serisi)', nameEn: 'ORBİT 12V 200Ah LiFePO4 Battery - Marine (VP Series)', mpn: 'VP12200', variantSku: 'OE-12V200Ah-P-ABS-MARINE', price: 975, weightG: 23000, dimensions: '508,3x202,4x189,3 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var), Victron Uyumlu' },
  { slug: 'orbit-12v-420ah-marine', name: 'ORBİT 12 V 420 Ah LiFePO4 Akü - Marin Tip (VP Serisi)', nameEn: 'ORBİT 12V 420Ah LiFePO4 Battery - Marine (VP Series)', mpn: 'VP12420', variantSku: 'OE-12V420Ah-P-ABS-MARINE', price: 1750, weightG: 43000, dimensions: '242x630x226 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var), Victron Uyumlu' },
  { slug: 'orbit-24v-100ah-abs', name: 'ORBİT 24 V 100 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 24V 100Ah LiFePO4 Battery - ABS Case', mpn: 'GU24100', variantSku: 'OE-24V100Ah-P-ABS', price: 784.17, weightG: 23000, dimensions: '498x244x220 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-24v-150ah-abs', name: 'ORBİT 24 V 150 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 24V 150Ah LiFePO4 Battery - ABS Case', mpn: 'GU24150', variantSku: 'OE-24V150Ah-P-ABS', price: 1248, weightG: null, dimensions: '508,3x202,4x189,3 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-24v-210ah-abs', name: 'ORBİT 24 V 210 Ah LiFePO4 Akü - ABS Kasa', nameEn: 'ORBİT 24V 210Ah LiFePO4 Battery - ABS Case', mpn: 'GU24210', variantSku: 'OE-24V210Ah-P-ABS', price: 1652.74, weightG: 43000, dimensions: '635x244x220 mm', caseType: 'ABS', cycle: '8000 Cycle (%80 D.O.D)', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-24v-100ah-marine', name: 'ORBİT 24 V 100 Ah LiFePO4 Akü - Marin Tip (VP Serisi)', nameEn: 'ORBİT 24V 100Ah LiFePO4 Battery - Marine (VP Series)', mpn: 'VP24100', variantSku: 'OE-24V100Ah-P-ABS-MARINE', price: 960, weightG: 23000, dimensions: '508,3x202,4x189,3 mm', caseType: 'ABS', features: 'Ekran (Var), Bluetooth (Var), Victron Uyumlu' },
  { slug: 'orbit-24v-210ah-marine', name: 'ORBİT 24 V 210 Ah LiFePO4 Akü - Marin Tip (VP Serisi)', nameEn: 'ORBİT 24V 210Ah LiFePO4 Battery - Marine (VP Series)', mpn: 'VP24210', variantSku: 'VP24210', price: 1735, weightG: 43000, dimensions: '242x630x226 mm', caseType: 'ABS', cycle: '8000 Cycle (%80 D.O.D)', features: 'Ekran (Var), Bluetooth (Var)' },
  { slug: 'orbit-48v-100ah-wall', name: 'ORBİT 48 V 100 Ah LiFePO4 Akü - Ekranlı Duvar Tipi (Wall Type)', nameEn: 'ORBİT 48V 100Ah LiFePO4 Battery - Wall Mount with Display', mpn: 'GU48100WT', variantSku: 'OE-48V100Ah-P-W-METAL', price: 1454, weightG: 43000, dimensions: '430x436x158 mm', caseType: 'Metal', features: 'Ekran (Var)' },
  { slug: 'orbit-48v-100ah-metal-ekranli', name: 'ORBİT 48 V 100 Ah LiFePO4 Akü - Ekranlı Metal Kasa', nameEn: 'ORBİT 48V 100Ah LiFePO4 Battery - Metal Case with Display', mpn: 'GU48100YS', variantSku: 'OE-48V100Ah-P-YS-METAL', price: 1416.46, weightG: 43000, dimensions: '430x436x158 mm', caseType: 'Metal', features: 'Ekran (Var)' },
  { slug: 'orbit-48v-100ah-metal-ekransiz', name: 'ORBİT 48 V 100 Ah LiFePO4 Akü - Ekransız Metal Kasa', nameEn: 'ORBİT 48V 100Ah LiFePO4 Battery - Metal Case without Display', mpn: 'GU48100NS', variantSku: 'OE-48V100Ah-P-NS-METAL', price: 1390, weightG: 43000, dimensions: '430x436x158 mm', caseType: 'Metal', features: 'Ekran (Yok)' },
  { slug: 'orbit-51.2v-50ah-hv', name: 'ORBİT 51.2 V 50 Ah LiFePO4 Akü - Yüksek Voltaj (HV) Metal Kasa', nameEn: 'ORBİT 51.2V 50Ah LiFePO4 Battery - High Voltage (HV) Metal Case', mpn: 'GU51050HV', variantSku: 'OE-51.2V50Ah-P-HV-METAL', price: 1179.18, weightG: 30000, dimensions: '230x235x145 mm', caseType: 'Metal (Raf Tipi)', features: 'Slave BMS', note: 'Tek başına satılamaz (Cannot Be Sold Alone)' },
  { slug: 'orbit-51.2v-100ah-hv', name: 'ORBİT 51.2 V 100 Ah LiFePO4 Akü - Yüksek Voltaj (HV) Metal Kasa', nameEn: 'ORBİT 51.2V 100Ah LiFePO4 Battery - High Voltage (HV) Metal Case', mpn: 'GU51100HV', variantSku: 'OE-51.2V100Ah-P-HV-METAL', price: 1448.41, weightG: 45000, dimensions: '437x435x159 mm', caseType: 'Metal (Raf Tipi)', features: 'Slave BMS', note: 'Tek başına satılamaz (Cannot Be Sold Alone)' },
  { slug: 'orbit-51.2v-100ah-lv', name: 'ORBİT 51.2 V 100 Ah LiFePO4 Akü - Düşük Voltaj (LV) Ekranlı Metal Kasa', nameEn: 'ORBİT 51.2V 100Ah LiFePO4 Battery - Low Voltage (LV) Metal Case with Display', mpn: 'GU51100LV', variantSku: 'OE-51.2V100Ah-P-YS-METAL', price: 1459.06, weightG: 45000, dimensions: '430x436x158 mm', caseType: 'Metal', features: 'Ekran (Var)' },
  { slug: 'orbit-51.2v-280ah-lv-trinity2', name: 'ORBİT 51.2 V 280 Ah LiFePO4 Akü - Düşük Voltaj (LV) Metal Kasa (TRİNİTY2)', nameEn: 'ORBİT 51.2V 280Ah LiFePO4 Battery - Low Voltage (LV) Metal Case (TRINITY2)', mpn: 'GU51280LV-TRINITY2', variantSku: 'OE-51.2V280Ah-P-LV-YS-METAL', price: 3619, weightG: null, dimensions: '-', caseType: 'Metal', features: '' },
  { slug: 'orbit-51.2v-314ah-lv-trinity3', name: 'ORBİT 51.2 V 314 Ah LiFePO4 Akü - Düşük Voltaj (LV) Metal Kasa (TRİNİTY3)', nameEn: 'ORBİT 51.2V 314Ah LiFePO4 Battery - Low Voltage (LV) Metal Case (TRINITY3)', mpn: 'GU51314LVP10-TRINITY3', variantSku: 'OE-51.2V314Ah-P-LV-YS-METAL', price: 3649, weightG: null, dimensions: '-', caseType: 'Metal', features: '' },
]

async function main() {
  console.log('🌱 LiFePO4 seed: Lityum (LiFePO4) Aküler kategori ve ORBİT ürünleri...')

  const lifepo4Category = await prisma.category.upsert({
    where: { slug: 'lityum-lifepo4-akuler' },
    create: {
      slug: 'lityum-lifepo4-akuler',
      name: 'Lityum (LiFePO4) Aküler',
      nameEn: 'Lithium (LiFePO4) Batteries',
      description: '12V, 24V, 48V ve 51.2V ORBİT LiFePO4 aküler; ABS ve metal kasa, marin ve duvar tipi seçenekleri.',
      descriptionEn: '12V, 24V, 48V and 51.2V ORBİT LiFePO4 batteries; ABS and metal case, marine and wall-mount options.',
      order: 3,
      active: true,
    },
    update: {
      name: 'Lityum (LiFePO4) Aküler',
      nameEn: 'Lithium (LiFePO4) Batteries',
    },
  })

  for (const p of lifepo4Products) {
    const cycle = p.cycle ?? lifepo4BaseSpecs.cycle_life
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        nameEn: p.nameEn,
        brand: 'ORBİT',
        mpn: p.mpn,
        sku: p.variantSku,
        lifecycle: Lifecycle.ACTIVE,
        certifications: { ce: true, lifepo4: true },
        specs: {
          ...lifepo4BaseSpecs,
          cycle_life: cycle,
          case_type: p.caseType,
          dimensions_mm: p.dimensions,
          weight_kg: p.weightG != null ? p.weightG / 1000 : null,
          features: p.features || undefined,
          note: p.note || undefined,
        },
        description: [p.name, p.features, p.dimensions, p.weightG ? `${p.weightG / 1000} kg` : null].filter(Boolean).join(' | '),
        descriptionEn: [p.nameEn, p.features, p.dimensions].filter(Boolean).join(' | '),
        fullDescription: `ORBİT LiFePO4 akü. Çevrim ömrü: ${cycle}. Hücre tipi: Prizmatik. Kasa: ${p.caseType}. Sıcaklık: Şarj ${lifepo4BaseSpecs.temp_charge_c}, Deşarj ${lifepo4BaseSpecs.temp_discharge_c}. ${p.features ? 'Ek donanım: ' + p.features + '.' : ''} Boyutlar: ${p.dimensions}.${p.note ? ' ' + p.note : ''}`,
        fullDescriptionEn: `ORBİT LiFePO4 battery. Cycle life: ${cycle}. Prismatic cells. Case: ${p.caseType}. Temp: Charge ${lifepo4BaseSpecs.temp_charge_c}, Discharge ${lifepo4BaseSpecs.temp_discharge_c}. ${p.features || ''} Dimensions: ${p.dimensions}.${p.note ? ' ' + p.note : ''}`,
        images: [{ url: '/images/products/orbit-lifepo4.jpg', alt: p.name, order: 1 }],
        categoryId: lifepo4Category.id,
        leadTimeDays: 14,
        moq: 1,
        orderStep: 1,
        active: true,
      },
      update: {
        name: p.name,
        nameEn: p.nameEn,
        description: [p.name, p.features, p.dimensions, p.weightG ? `${p.weightG / 1000} kg` : null].filter(Boolean).join(' | '),
        categoryId: lifepo4Category.id,
      },
    })
    await prisma.variant.upsert({
      where: { sku: p.variantSku },
      create: {
        productId: prod.id,
        sku: p.variantSku,
        matrix: { voltage: p.slug.split('-')[1], capacity: p.slug.split('-')[2], caseType: p.caseType },
        price: p.price,
        currency: 'USD',
        vatRate: 20,
        weightG: p.weightG,
        isActive: true,
        stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
      },
      update: { price: p.price, currency: 'USD' },
    })
  }

  console.log('✅ LiFePO4 seed tamamlandı: 1 kategori, 19 ürün.')
}

main()
  .catch((e) => {
    console.error('❌ LiFePO4 seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
