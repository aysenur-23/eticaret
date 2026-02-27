/**
 * Taşınabilir Şarj İstasyonları kategorisi ve Hims taşınabilir şarj serisini ekler.
 * Kullanım: npx tsx prisma/seed-portable-chargers.ts
 */

import { PrismaClient, Lifecycle } from '@prisma/client'

const prisma = new PrismaClient()

const categorySlug = 'tasinabilir-sarj-istonlari'
const productSlug = 'hims-akilli-tasinabilir-arac-sarj-istonu-serisi'

const fullDescription =
  'Hims taşınabilir akıllı şarj istasyonu serisi; evde, işte, kampta veya seyahatte elektrikli aracınızı güvenle şarj etmeniz için tasarlanmıştır. Alüminyum gövde, zorlu dış ortam koşullarına dayanıklılık; modüler güç konnektörü ile farklı enerji kaynaklarına ve priz tiplerine uyum. ' +
  'Özellikler: Wi-Fi (2.4GHz) mobil uygulama ile uzaktan şarj başlatma/bitirme, programlama, gecikmeli şarj. Alüminyum kasa, IP66, IK10. LED ekran, dokunmatik tuş, durum ışığı; 2–22 kW arası akım ayarı. ' +
  'Teknik: Monofaze/Trifaze, AC 240V/400V 50/60Hz. Type 2 soket. H07BZ5-F (5x6mm²+1x0,75mm²) entegre kablo. Type A RCMU (AC 30mA + DC 6mA). Çalışma -30°C ile +55°C, ≤%95 nem, 2000 m. Standby <3W. CE, EN/IEC 61851-1:2017. ' +
  'Kutu içeriği: Ergonomin taşıma çantası (22/11/7.4 kW modellerinde); 3.6 kW hariç tüm siparişlerde 1 adet dönüştürücü (adaptör) hediye.'

const fullDescriptionEn =
  'Hims portable smart EV charging station series for home, work, camp or travel. Aluminum body, modular power connector for different power sources and plug types. ' +
  'Features: Wi-Fi (2.4GHz) app – remote start/stop, scheduling. IP66, IK10. LED display, touch key, status light; 2–22 kW current adjustment. ' +
  'Specs: Single/three phase, AC 240V/400V 50/60Hz. Type 2 socket. Type A RCMU. Operating -30°C to +55°C. CE, EN/IEC 61851-1:2017. Carry case and adapter (except 3.6 kW) included.'

const variants: Array<{ sku: string; name: string; powerKw: number; price: number; matrix: Record<string, string> }> = [
  { sku: 'HCTK-22-G-TF', name: '22kW Tip 2 Quick Konnektörlü', powerKw: 22, price: 940, matrix: { power: '22kW', connector: 'Quick Konnektör', socket: 'Type 2' } },
  { sku: 'HCTK-22-G', name: '22kW Tip 2 Sanayi Tipi Konnektörlü', powerKw: 22, price: 820, matrix: { power: '22kW', connector: 'Sanayi Tipi', socket: 'Type 2' } },
  { sku: 'HCTK-11', name: '11kW Kablolu Taşınabilir', powerKw: 11, price: 430, matrix: { power: '11kW', type: 'Kablolu' } },
  { sku: 'HCTK-7.4', name: '7.4kW Kablolu Taşınabilir', powerKw: 7.4, price: 370, matrix: { power: '7.4kW', type: 'Kablolu' } },
  { sku: 'HCTK-3.6', name: '3.6kW Kablolu Taşınabilir', powerKw: 3.6, price: 310, matrix: { power: '3.6kW', type: 'Kablolu' } },
]

async function main() {
  console.log('🌱 Taşınabilir Şarj İstasyonları seed...')

  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    create: {
      slug: categorySlug,
      name: 'Taşınabilir Şarj İstasyonları',
      nameEn: 'Portable Charging Stations',
      description: 'Ev, iş, kamp ve seyahatte kullanıma uygun taşınabilir elektrikli araç şarj istasyonları.',
      descriptionEn: 'Portable EV charging stations for home, work, camp and travel.',
      order: 5,
      active: true,
    },
    update: {
      name: 'Taşınabilir Şarj İstasyonları',
      nameEn: 'Portable Charging Stations',
    },
  })

  const product = await prisma.product.upsert({
    where: { slug: productSlug },
    create: {
      slug: productSlug,
      name: 'Hims Akıllı Taşınabilir Araç Şarj İstasyonu Serisi (22kW / 11kW / 7.4kW / 3.6kW)',
      nameEn: 'Hims Smart Portable EV Charging Station Series (22kW / 11kW / 7.4kW / 3.6kW)',
      brand: 'Hims',
      mpn: 'HCTK',
      sku: 'HCTK-SERIES',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { ce: true, en61851: true },
      specs: {
        power_options_kw: [22, 11, 7.4, 3.6],
        phase: 'Monofaze / Trifaze',
        voltage_v: 'AC 240V / AC 400V',
        frequency_hz: '50/60',
        max_current_3phase_a: 32,
        max_power_3phase_kw: 22,
        socket: 'Type 2',
        cable_type: 'H07BZ5-F (5x6mm² + 1x0,75mm²)',
        rcmu: 'Type A (AC 30mA + DC 6mA)',
        protection: 'IP66, IK10',
        temp_min_c: -30,
        temp_max_c: 55,
        humidity_max_pct: 95,
        altitude_m: 2000,
        standby_w: 3,
        cooling: 'Doğal soğutma',
        features: 'Wi-Fi 2.4GHz, mobil uygulama, LED ekran, dokunmatik tuş, akım ayarı 2–22 kW',
        included: 'Taşıma çantası (3.6 kW hariç), adaptör (3.6 kW hariç)',
      },
      description: 'Hims taşınabilir akıllı şarj istasyonu; ev, iş, kamp ve seyahatte kullanım. Alüminyum gövde, IP66, IK10. Wi-Fi uygulama, Type 2, 22/11/7.4/3.6 kW seçenekleri.',
      descriptionEn: 'Hims portable smart EV charger for home, work, camp, travel. Aluminum, IP66, IK10. Wi-Fi app, Type 2. 22/11/7.4/3.6 kW options.',
      fullDescription,
      fullDescriptionEn,
      images: [{ url: '/images/products/hims-portable-charger.jpg', alt: 'Hims Taşınabilir Şarj İstasyonu', order: 1 }],
      categoryId: category.id,
      leadTimeDays: 7,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
      active: true,
    },
    update: {
      name: 'Hims Akıllı Taşınabilir Araç Şarj İstasyonu Serisi (22kW / 11kW / 7.4kW / 3.6kW)',
      description: 'Hims taşınabilir akıllı şarj istasyonu; ev, iş, kamp ve seyahatte kullanım. Alüminyum gövde, IP66, IK10. Wi-Fi uygulama, Type 2, 22/11/7.4/3.6 kW seçenekleri.',
      fullDescription,
      categoryId: category.id,
    },
  })

  for (const v of variants) {
    await prisma.variant.upsert({
      where: { sku: v.sku },
      create: {
        productId: product.id,
        sku: v.sku,
        matrix: v.matrix,
        price: v.price,
        currency: 'EUR',
        vatRate: 20,
        weightG: null,
        isActive: true,
        stock: { create: { onHand: 8, reserved: 0, incoming: 4 } },
      },
      update: { price: v.price, currency: 'EUR' },
    })
  }

  console.log('✅ Taşınabilir Şarj İstasyonları seed tamamlandı: 1 kategori, 1 ürün, 5 varyant.')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
