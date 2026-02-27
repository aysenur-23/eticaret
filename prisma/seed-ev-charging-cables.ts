/**
 * Elektrikli Araç Şarj Kabloları kategorisi ve Hims EMEF / EMEF-F serisi ürünleri.
 * Kullanım: npx tsx prisma/seed-ev-charging-cables.ts
 */

import { PrismaClient, Lifecycle } from '@prisma/client'

const prisma = new PrismaClient()

// Ürün 1: Çift soketli – kablo rengi × soket rengi (X: Kablo, Y: Soket)
const CABLE_COLORS = [
  { code: 'GRN', name: 'Yeşil', ral: 'RAL 6016' },
  { code: 'BLU', name: 'Mavi', ral: 'RAL 5015' },
  { code: 'ORG', name: 'Turuncu', ral: 'RAL 2003' },
  { code: 'GRY', name: 'Gri', ral: 'RAL 7001' },
  { code: 'BLK', name: 'Siyah', ral: 'RAL 9005' },
] as const
const SOCKET_COLORS = [
  { code: 'BLK', name: 'Siyah' },
  { code: 'WHT', name: 'Beyaz' },
] as const

// 22kW uzunluk (m) ve fiyat (€ KDV hariç)
const LENGTHS_22KW = [
  { m: 2, price: 112 },
  { m: 3, price: 118 },
  { m: 5, price: 136 },
  { m: 7, price: 168 },
  { m: 8, price: 178 },
  { m: 10, price: 260 },
  { m: 15, price: 280 },
  { m: 16, price: 300 },
  { m: 20, price: 374 },
] as const
// 11kW çift soketli: sadece 5m
const PRICE_11KW_5M = 95

// Ürün 2: Tek soketli – kablo rengi (5 renk)
const CABLE_COLORS_F = ['BLK', 'GRN', 'ORG', 'BLU', 'GRY'] as const
// 22kW tek soketli: uzunluk ve fiyat
const LENGTHS_22KW_F = [
  { m: 5, price: 116 },
  { m: 7, price: 146 },
  { m: 8, price: 156 },
  { m: 10, price: 200 },
  { m: 15, price: 270 },
] as const
const PRICE_11KW_F_5M = 72
const PRICE_74KW_F_5M = 84
const PRICE_36KW_F_5M = 54

async function main() {
  console.log('🌱 Elektrikli Araç Şarj Kabloları seed: kategori ve ürünler...')

  const category = await prisma.category.upsert({
    where: { slug: 'elektrikli-arac-sarj-kablolari' },
    create: {
      slug: 'elektrikli-arac-sarj-kablolari',
      name: 'Elektrikli Araç Şarj Kabloları',
      nameEn: 'EV Charging Cables',
      description: 'Çift soketli (istasyondan araca) ve tek soketli (istasyon montajlı) Type 2 şarj kabloları. Hims EMEF / EMEF-F serisi.',
      descriptionEn: 'Dual-socket (station-to-vehicle) and single-socket (station-mounted) Type 2 charging cables. Hims EMEF / EMEF-F series.',
      order: 3,
      active: true,
    },
    update: {
      name: 'Elektrikli Araç Şarj Kabloları',
      nameEn: 'EV Charging Cables',
    },
  })

  // ========== ÜRÜN 1: Hims EMEF Serisi Çift Soketli ==========
  const product1Name = 'Hims EMEF Serisi Çift Soketli Elektrikli Araç Şarj Kabloları (İstasyondan Araca)'
  const product1NameEn = 'Hims EMEF Series Dual-Socket EV Charging Cables (Station to Vehicle)'
  const product1Slug = 'hims-emef-cift-soketli-sarj-kablosu'

  const prod1 = await prisma.product.upsert({
    where: { slug: product1Slug },
    create: {
      slug: product1Slug,
      name: product1Name,
      nameEn: product1NameEn,
      brand: 'Hims',
      mpn: 'EMEF-22T2 / EMEF-11T2',
      sku: 'EMEF-22T2-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { ce: true, type2: true },
      specs: {
        type: 'Çift soketli (prizli istasyonlardan araca)',
        type_en: 'Dual-socket (from socketed stations to vehicle)',
        power_22kw_a: 32,
        power_11kw_a: 20,
        voltage_v: 380,
        frequency_hz: '50/60',
        cable_section_22kw: '5x6mm² + 1x0,75mm²',
        cable_section_11kw: '5x2.5mm² + 1x0,75mm²',
        temp_operating_c: '-25 to +55',
        temp_storage_c: '-30 to +80',
        humidity_max: '%95 (yoğuşmasız)',
        features: 'Gümüş kontak kaplama, su/toz koruma kapağı, özel metraj ve renk üretimi',
      },
      description:
        'Prizli şarj istasyonlarından aracınıza enerji aktarımı için Type 2 çift soketli kablo. 22kW (32A) ve 11kW (20A) modeller. Gümüş kontak, dayanıklı gövde, kablo ve soket rengi seçenekleri.',
      descriptionEn:
        'Type 2 dual-socket cable from socketed stations to vehicle. 22kW (32A) and 11kW (20A). Silver contacts, durable body, cable and socket color options.',
      fullDescription:
        'Hims EMEF Serisi çift soketli şarj kabloları; prizli elektrikli araç şarj istasyonlarından aracınıza enerji aktarımı için tasarlanmıştır. Avrupa standartlarındaki tüm Type 2 soketli araçlar ve istasyonlarla uyumludur. Gümüş kontak kaplama ile yüksek iletkenlik ve ısınma azaltma; dayanıklı plastik gövde, su/toz koruma kapağı. 22kW modeller 32A, 11kW modeller 20A taşır. 380V AC, 50/60 Hz. Çalışma -25°C ile +55°C, depolama -30°C ile +80°C. İstenen metraj ve renklerde özel üretim yapılabilir.',
      fullDescriptionEn:
        'Hims EMEF dual-socket cables for station-to-vehicle charging. Type 2 compatible. Silver contacts, durable body, IP protection. 22kW 32A, 11kW 20A. 380V AC, 50/60 Hz. Custom length and colors available.',
      images: [{ url: '/images/products/hims-emef-cable.jpg', alt: product1Name, order: 1 }],
      categoryId: category.id,
      leadTimeDays: 7,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
      active: true,
    },
    update: {
      name: product1Name,
      nameEn: product1NameEn,
      description:
        'Prizli şarj istasyonlarından aracınıza enerji aktarımı için Type 2 çift soketli kablo. 22kW (32A) ve 11kW (20A) modeller. Gümüş kontak, dayanıklı gövde, kablo ve soket rengi seçenekleri.',
      categoryId: category.id,
    },
  })

  let variantCount1 = 0
  // 22kW: her uzunluk × kablo rengi × soket rengi
  for (const len of LENGTHS_22KW) {
    for (const cable of CABLE_COLORS) {
      for (const socket of SOCKET_COLORS) {
        const sku = `EMEF-22T2-${len.m}M-${cable.code}-${socket.code}`
        await prisma.variant.upsert({
          where: { sku },
          create: {
            productId: prod1.id,
            sku,
            matrix: {
              power: '22kW',
              length_m: len.m,
              cableColor: cable.name,
              cableRal: cable.ral,
              socketColor: socket.name,
            },
            price: len.price,
            currency: 'EUR',
            vatRate: 20,
            weightG: null,
            isActive: true,
            stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
          },
          update: { price: len.price, currency: 'EUR' },
        })
        variantCount1++
      }
    }
  }
  // 11kW: 5m × kablo × soket
  for (const cable of CABLE_COLORS) {
    for (const socket of SOCKET_COLORS) {
      const sku = `EMEF-11T2-5M-${cable.code}-${socket.code}`
      await prisma.variant.upsert({
        where: { sku },
        create: {
          productId: prod1.id,
          sku,
          matrix: {
            power: '11kW',
            length_m: 5,
            cableColor: cable.name,
            cableRal: cable.ral,
            socketColor: socket.name,
          },
          price: PRICE_11KW_5M,
          currency: 'EUR',
          vatRate: 20,
          weightG: null,
          isActive: true,
          stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
        },
        update: { price: PRICE_11KW_5M, currency: 'EUR' },
      })
      variantCount1++
    }
  }

  // ========== ÜRÜN 2: Hims EMEF-F Serisi Tek Soketli ==========
  const product2Name = 'Hims EMEF-F Serisi Tek Soketli Şarj İstasyonu Kabloları (İstasyon Montajlı)'
  const product2NameEn = 'Hims EMEF-F Series Single-Socket Station-Mounted Charging Cables'
  const product2Slug = 'hims-emef-f-tek-soketli-sarj-kablosu'

  const prod2 = await prisma.product.upsert({
    where: { slug: product2Slug },
    create: {
      slug: product2Slug,
      name: product2Name,
      nameEn: product2NameEn,
      brand: 'Hims',
      mpn: 'EMEF-22T2F / EMEF-11T2F / EMEF-7T2F / EMEF-3T2F',
      sku: 'EMEF-22T2F-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { ce: true, type2: true },
      specs: {
        type: 'Tek soketli (kablolu istasyon montajı)',
        type_en: 'Single-socket (for cabled station installation)',
        cable_22kw: '5x6mm² + 1x0,75mm²',
        cable_11kw: '5x2.5mm² + 1x0,75mm²',
        cable_74kw: '3x6mm² + 1x0,75mm²',
        cable_36kw: '3x2.5mm² + 1x0,75mm²',
        features: 'Gümüş iletken kontaklar, Type 2 tabanca, toz/su koruma kapağı, soyulmuş montaj ucu',
      },
      description:
        'Kablolu şarj istasyonları ve kablo değişimi için tek soketli Type 2 kablolar. Bir uç istasyon panosuna bağlanır, diğer uç araca takılır. 22kW, 11kW, 7.4kW, 3.6kW ve çoklu metraj seçenekleri.',
      descriptionEn:
        'Single-socket Type 2 cables for cabled stations and cable replacement. One end for panel connection, one end Type 2 plug. 22kW, 11kW, 7.4kW, 3.6kW and multiple lengths.',
      fullDescription:
        'Hims EMEF-F Serisi tek soketli kablolar; prizli olmayan (kablolu) şarj istasyonlarının üretimi veya kablo değişimi için tasarlanmıştır. Bir uç istasyon panosuna/klemensine bağlanmak üzere açık (montaja hazır), diğer uç ergonomik Type 2 soket. Gümüş iletken kontaklar, toz/su koruma kapağı. Siyah, Yeşil, Turuncu, Mavi, Gri kablo rengi seçenekleri.',
      fullDescriptionEn:
        'Hims EMEF-F single-socket cables for cabled station installation or cable replacement. One end stripped for panel, one end Type 2 plug. Silver contacts, protection cap. Cable colors: Black, Green, Orange, Blue, Grey.',
      images: [{ url: '/images/products/hims-emef-f-cable.jpg', alt: product2Name, order: 1 }],
      categoryId: category.id,
      leadTimeDays: 7,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
      active: true,
    },
    update: {
      name: product2Name,
      nameEn: product2NameEn,
      description:
        'Kablolu şarj istasyonları ve kablo değişimi için tek soketli Type 2 kablolar. Bir uç istasyon panosuna bağlanır, diğer uç araca takılır. 22kW, 11kW, 7.4kW, 3.6kW ve çoklu metraj seçenekleri.',
      categoryId: category.id,
    },
  })

  let variantCount2 = 0
  // 22kW: uzunluk × renk
  for (const len of LENGTHS_22KW_F) {
    for (const color of CABLE_COLORS_F) {
      const sku = `EMEF-22T2F-${len.m}M-${color}`
      await prisma.variant.upsert({
        where: { sku },
        create: {
          productId: prod2.id,
          sku,
          matrix: { power: '22kW', length_m: len.m, cableColor: color },
          price: len.price,
          currency: 'EUR',
          vatRate: 20,
          weightG: null,
          isActive: true,
          stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
        },
        update: { price: len.price, currency: 'EUR' },
      })
      variantCount2++
    }
  }
  // 11kW 5m, 7.4kW 5m, 3.6kW 5m – her renk
  for (const color of CABLE_COLORS_F) {
    await prisma.variant.upsert({
      where: { sku: `EMEF-11T2F-5M-${color}` },
      create: {
        productId: prod2.id,
        sku: `EMEF-11T2F-5M-${color}`,
        matrix: { power: '11kW', length_m: 5, cableColor: color },
        price: PRICE_11KW_F_5M,
        currency: 'EUR',
        vatRate: 20,
        weightG: null,
        isActive: true,
        stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
      },
      update: { price: PRICE_11KW_F_5M, currency: 'EUR' },
    })
    variantCount2++
  }
  for (const color of CABLE_COLORS_F) {
    await prisma.variant.upsert({
      where: { sku: `EMEF-7T2F-5M-${color}` },
      create: {
        productId: prod2.id,
        sku: `EMEF-7T2F-5M-${color}`,
        matrix: { power: '7.4kW', length_m: 5, cableColor: color },
        price: PRICE_74KW_F_5M,
        currency: 'EUR',
        vatRate: 20,
        weightG: null,
        isActive: true,
        stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
      },
      update: { price: PRICE_74KW_F_5M, currency: 'EUR' },
    })
    variantCount2++
  }
  for (const color of CABLE_COLORS_F) {
    await prisma.variant.upsert({
      where: { sku: `EMEF-3T2F-5M-${color}` },
      create: {
        productId: prod2.id,
        sku: `EMEF-3T2F-5M-${color}`,
        matrix: { power: '3.6kW', length_m: 5, cableColor: color },
        price: PRICE_36KW_F_5M,
        currency: 'EUR',
        vatRate: 20,
        weightG: null,
        isActive: true,
        stock: { create: { onHand: 5, reserved: 0, incoming: 2 } },
      },
      update: { price: PRICE_36KW_F_5M, currency: 'EUR' },
    })
    variantCount2++
  }

  console.log(
    '✅ Elektrikli Araç Şarj Kabloları seed tamamlandı: 1 kategori, 2 ürün, ' +
      (variantCount1 + variantCount2) +
      ' varyant (Çift soketli: ' +
      variantCount1 +
      ', Tek soketli: ' +
      variantCount2 +
      ').'
  )
}

main()
  .catch((e) => {
    console.error('❌ EV şarj kabloları seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
