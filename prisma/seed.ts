/**
 * Prisma Seed Script
 * Populates database with sample engineering e-commerce data
 */

import { PrismaClient, Lifecycle } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (optional - be careful in production!)
  // await prisma.orderLine.deleteMany()
  // await prisma.order.deleteMany()
  // await prisma.cartItem.deleteMany()
  // await prisma.cart.deleteMany()
  // await prisma.stock.deleteMany()
  // await prisma.variant.deleteMany()
  // await prisma.product.deleteMany()
  // await prisma.category.deleteMany()

  // ============================================
  // 1. CATEGORIES (idempotent upsert)
  // ============================================
  console.log('📁 Creating categories...')

  const powerElectronics = await prisma.category.upsert({
    where: { slug: 'guc-elektronigi' },
    create: {
      slug: 'guc-elektronigi',
      name: 'Güç Elektroniği',
      nameEn: 'Power Electronics',
      description: 'DC-DC konvertörler, güç kaynakları, invertörler',
      descriptionEn: 'DC-DC converters, power supplies, inverters',
      order: 1,
    },
    update: {
      name: 'Güç Elektroniği',
      nameEn: 'Power Electronics',
      description: 'DC-DC konvertörler, güç kaynakları, invertörler',
      descriptionEn: 'DC-DC converters, power supplies, inverters',
      order: 1,
    },
  })

  const dcDcConverters = await prisma.category.upsert({
    where: { slug: 'dc-dc-konvertorler' },
    create: {
      slug: 'dc-dc-konvertorler',
      name: 'DC-DC Konvertörler',
      nameEn: 'DC-DC Converters',
      description: 'Step-up, step-down, buck-boost konvertörler',
      descriptionEn: 'Step-up, step-down, buck-boost converters',
      parentId: powerElectronics.id,
      order: 1,
    },
    update: {
      name: 'DC-DC Konvertörler',
      nameEn: 'DC-DC Converters',
      description: 'Step-up, step-down, buck-boost konvertörler',
      descriptionEn: 'Step-up, step-down, buck-boost converters',
      parentId: powerElectronics.id,
      order: 1,
    },
  })

  const mechanical = await prisma.category.upsert({
    where: { slug: 'mekanik' },
    create: {
      slug: 'mekanik',
      name: 'Mekanik',
      nameEn: 'Mechanical',
      description: 'Redüktörler, motorlar, aktüatörler',
      descriptionEn: 'Reducers, motors, actuators',
      order: 2,
    },
    update: {
      name: 'Mekanik',
      nameEn: 'Mechanical',
      description: 'Redüktörler, motorlar, aktüatörler',
      descriptionEn: 'Reducers, motors, actuators',
      order: 2,
    },
  })

  const reducers = await prisma.category.upsert({
    where: { slug: 'reduktorler' },
    create: {
      slug: 'reduktorler',
      name: 'Redüktörler',
      nameEn: 'Reducers',
      description: 'Planet dişli, düz dişli redüktörler',
      descriptionEn: 'Planetary gear, spur gear reducers',
      parentId: mechanical.id,
      order: 1,
    },
    update: {
      name: 'Redüktörler',
      nameEn: 'Reducers',
      description: 'Planet dişli, düz dişli redüktörler',
      descriptionEn: 'Planetary gear, spur gear reducers',
      parentId: mechanical.id,
      order: 1,
    },
  })

  // ============================================
  // 2. PRODUCTS WITH VARIANTS
  // ============================================
  console.log('📦 Creating products...')

  // Product 1: DC-DC Converter 12V/24V
  const product1 = await prisma.product.upsert({
    where: { slug: 'dc-dc-konvertor-12v-24v' },
    create: {
      slug: 'dc-dc-konvertor-12v-24v',
      name: 'DC-DC Konvertör 12V/24V',
      nameEn: 'DC-DC Converter 12V/24V',
      brand: 'TechPower',
      mpn: 'TP-DCDC-1224',
      sku: 'TP-DCDC-1224-BASE',
      hsCode: '8504.40.95',
      lifecycle: Lifecycle.ACTIVE,
      certifications: {
        rohs: true,
        reach: true,
        ce: true,
        ip: 'IP65',
      },
      specs: {
        voltage_min: 12,
        voltage_max: 24,
        current_max: 10,
        power: 240,
        efficiency: 92,
        temp_min: -40,
        temp_max: 85,
        input_voltage_min: 9,
        input_voltage_max: 36,
      },
      description: 'Yüksek verimli DC-DC konvertör, 12V/24V çıkış, 10A maksimum akım',
      descriptionEn: 'High efficiency DC-DC converter, 12V/24V output, 10A max current',
      fullDescription: 'Bu konvertör, geniş giriş voltaj aralığı (9-36V) ile çalışır ve 12V veya 24V çıkış sağlar. %92 verimlilik ile çalışır ve -40°C ile +85°C arası sıcaklıklarda güvenilir performans gösterir.',
      datasheets: [
        { title: 'Teknik Döküman', url: '/datasheets/tp-dcdc-1224.pdf', type: 'pdf' },
        { title: '3D Model', url: '/models/tp-dcdc-1224.step', type: 'step' },
      ],
      images: [
        { url: '/images/products/dc-dc-converter.jpg', alt: 'DC-DC Konvertör', order: 1 },
      ],
      categoryId: dcDcConverters.id,
      leadTimeDays: 5,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
    },
    update: {
      name: 'DC-DC Konvertör 12V/24V',
      nameEn: 'DC-DC Converter 12V/24V',
      description: 'Yüksek verimli DC-DC konvertör, 12V/24V çıkış, 10A maksimum akım',
      descriptionEn: 'High efficiency DC-DC converter, 12V/24V output, 10A max current',
      categoryId: dcDcConverters.id,
    },
  })

  // Variants for Product 1
  await prisma.variant.upsert({
    where: { sku: 'TP-DCDC-1224-12V' },
    create: {
      productId: product1.id,
      sku: 'TP-DCDC-1224-12V',
      matrix: { voltage: '12V', current: '10A' },
      price: 450.00,
      vatRate: 20.00,
      weightG: 250,
      isActive: true,
      stock: {
        create: {
          onHand: 50,
          reserved: 0,
          incoming: 20,
        },
      },
    },
    update: { price: 450.00, vatRate: 20.00 },
  })

  await prisma.variant.upsert({
    where: { sku: 'TP-DCDC-1224-24V' },
    create: {
      productId: product1.id,
      sku: 'TP-DCDC-1224-24V',
      matrix: { voltage: '24V', current: '10A' },
      price: 480.00,
      vatRate: 20.00,
      weightG: 250,
      isActive: true,
      stock: {
        create: {
          onHand: 30,
          reserved: 0,
          incoming: 15,
        },
      },
    },
    update: { price: 480.00, vatRate: 20.00 },
  })

  // Product 2: Planetary Reducer
  const product2 = await prisma.product.upsert({
    where: { slug: 'planet-disi-reduktor' },
    create: {
      slug: 'planet-disi-reduktor',
      name: 'Planet Dişli Redüktör',
      nameEn: 'Planetary Gear Reducer',
      brand: 'MechDrive',
      mpn: 'MD-PGR-50',
      sku: 'MD-PGR-50-BASE',
      hsCode: '8483.40.10',
      lifecycle: Lifecycle.ACTIVE,
      certifications: {
        rohs: true,
        ce: true,
      },
      specs: {
        ratio: 50,
        torque_max: 50,
        rpm_max: 3000,
        efficiency: 85,
        temp_min: -20,
        temp_max: 80,
        shaft_diameter: 8,
      },
      description: '50:1 oranlı planet dişli redüktör, 50 Nm maksimum tork',
      descriptionEn: '50:1 ratio planetary gear reducer, 50 Nm max torque',
      fullDescription: 'Yüksek tork kapasiteli planet dişli redüktör. Robotik ve endüstriyel uygulamalar için idealdir.',
      datasheets: [
        { title: 'Teknik Döküman', url: '/datasheets/md-pgr-50.pdf', type: 'pdf' },
      ],
      images: [
        { url: '/images/products/reducer.jpg', alt: 'Planet Dişli Redüktör', order: 1 },
      ],
      categoryId: reducers.id,
      leadTimeDays: 7,
      moq: 5,
      orderStep: 5,
      isFeatured: true,
    },
    update: {
      name: 'Planet Dişli Redüktör',
      nameEn: 'Planetary Gear Reducer',
      description: '50:1 oranlı planet dişli redüktör, 50 Nm maksimum tork',
      descriptionEn: '50:1 ratio planetary gear reducer, 50 Nm max torque',
      categoryId: reducers.id,
    },
  })

  // Variants for Product 2
  await prisma.variant.upsert({
    where: { sku: 'MD-PGR-50-8MM' },
    create: {
      productId: product2.id,
      sku: 'MD-PGR-50-8MM',
      matrix: { ratio: '50:1', shaftDiameter: '8mm' },
      price: 850.00,
      vatRate: 20.00,
      weightG: 1200,
      isActive: true,
      stock: {
        create: {
          onHand: 25,
          reserved: 0,
          incoming: 10,
        },
      },
    },
    update: { price: 850.00, vatRate: 20.00 },
  })

  await prisma.variant.upsert({
    where: { sku: 'MD-PGR-50-10MM' },
    create: {
      productId: product2.id,
      sku: 'MD-PGR-50-10MM',
      matrix: { ratio: '50:1', shaftDiameter: '10mm' },
      price: 950.00,
      vatRate: 20.00,
      weightG: 1400,
      isActive: true,
      stock: {
        create: {
          onHand: 15,
          reserved: 0,
          incoming: 5,
        },
      },
    },
    update: { price: 950.00, vatRate: 20.00 },
  })

  // Product 3: Motor Controller
  const product3 = await prisma.product.upsert({
    where: { slug: 'motor-kontrolcu-24v' },
    create: {
      slug: 'motor-kontrolcu-24v',
      name: 'Motor Kontrolcü 24V',
      nameEn: 'Motor Controller 24V',
      brand: 'MotionTech',
      mpn: 'MT-MC-24',
      sku: 'MT-MC-24-BASE',
      hsCode: '8537.10.90',
      lifecycle: Lifecycle.ACTIVE,
      certifications: {
        rohs: true,
        ce: true,
        ip: 'IP54',
      },
      specs: {
        voltage: 24,
        current_max: 30,
        power: 720,
        frequency: 20000,
        temp_min: -10,
        temp_max: 70,
      },
      description: '24V motor kontrolcü, 30A maksimum akım, PWM kontrol',
      descriptionEn: '24V motor controller, 30A max current, PWM control',
      categoryId: powerElectronics.id,
      leadTimeDays: 3,
      moq: 1,
      orderStep: 1,
    },
    update: {
      name: 'Motor Kontrolcü 24V',
      nameEn: 'Motor Controller 24V',
      description: '24V motor kontrolcü, 30A maksimum akım, PWM kontrol',
      descriptionEn: '24V motor controller, 30A max current, PWM control',
      categoryId: powerElectronics.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'MT-MC-24-STD' },
    create: {
      productId: product3.id,
      sku: 'MT-MC-24-STD',
      matrix: { voltage: '24V', current: '30A' },
      price: 650.00,
      vatRate: 20.00,
      weightG: 180,
      isActive: true,
      stock: {
        create: {
          onHand: 100,
          reserved: 0,
          incoming: 50,
        },
      },
    },
    update: { price: 650.00, vatRate: 20.00 },
  })

  // Add more products...
  const product4 = await prisma.product.upsert({
    where: { slug: 'step-up-konvertor-5v-12v' },
    create: {
      slug: 'step-up-konvertor-5v-12v',
      name: 'Step-Up Konvertör 5V-12V',
      nameEn: 'Step-Up Converter 5V-12V',
      brand: 'TechPower',
      mpn: 'TP-SU-512',
      sku: 'TP-SU-512-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { rohs: true, ce: true },
      specs: { voltage_min: 5, voltage_max: 12, current_max: 3, power: 36 },
      description: '5V giriş, 12V çıkış step-up konvertör',
      categoryId: dcDcConverters.id,
      leadTimeDays: 4,
      moq: 1,
      orderStep: 1,
    },
    update: {
      name: 'Step-Up Konvertör 5V-12V',
      nameEn: 'Step-Up Converter 5V-12V',
      description: '5V giriş, 12V çıkış step-up konvertör',
      categoryId: dcDcConverters.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'TP-SU-512-3A' },
    create: {
      productId: product4.id,
      sku: 'TP-SU-512-3A',
      matrix: { input: '5V', output: '12V', current: '3A' },
      price: 120.00,
      vatRate: 20.00,
      weightG: 50,
      isActive: true,
      stock: {
        create: {
          onHand: 200,
          reserved: 0,
          incoming: 100,
        },
      },
    },
    update: { price: 120.00, vatRate: 20.00 },
  })

  const product5 = await prisma.product.upsert({
    where: { slug: 'reduktor-10-1' },
    create: {
      slug: 'reduktor-10-1',
      name: 'Redüktör 10:1',
      nameEn: 'Reducer 10:1',
      brand: 'MechDrive',
      mpn: 'MD-RED-10',
      sku: 'MD-RED-10-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { rohs: true },
      specs: { ratio: 10, torque_max: 20, rpm_max: 5000 },
      description: '10:1 oranlı redüktör',
      categoryId: reducers.id,
      leadTimeDays: 6,
      moq: 3,
      orderStep: 3,
    },
    update: {
      name: 'Redüktör 10:1',
      nameEn: 'Reducer 10:1',
      description: '10:1 oranlı redüktör',
      categoryId: reducers.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'MD-RED-10-6MM' },
    create: {
      productId: product5.id,
      sku: 'MD-RED-10-6MM',
      matrix: { ratio: '10:1', shaftDiameter: '6mm' },
      price: 450.00,
      vatRate: 20.00,
      weightG: 800,
      isActive: true,
      stock: {
        create: {
          onHand: 40,
          reserved: 0,
          incoming: 20,
        },
      },
    },
    update: { price: 450.00, vatRate: 20.00 },
  })

  const product6 = await prisma.product.upsert({
    where: { slug: 'buck-konvertor-36v-12v' },
    create: {
      slug: 'buck-konvertor-36v-12v',
      name: 'Buck Konvertör 36V-12V',
      nameEn: 'Buck Converter 36V-12V',
      brand: 'TechPower',
      mpn: 'TP-BUCK-3612',
      sku: 'TP-BUCK-3612-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { rohs: true, ce: true, ip: 'IP67' },
      specs: {
        voltage_min: 12,
        voltage_max: 12,
        current_max: 15,
        power: 180,
        input_voltage_min: 18,
        input_voltage_max: 36,
        temp_min: -40,
        temp_max: 85,
      },
      description: '36V giriş, 12V çıkış buck konvertör, IP67 koruma',
      categoryId: dcDcConverters.id,
      leadTimeDays: 5,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
    },
    update: {
      name: 'Buck Konvertör 36V-12V',
      nameEn: 'Buck Converter 36V-12V',
      description: '36V giriş, 12V çıkış buck konvertör, IP67 koruma',
      categoryId: dcDcConverters.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'TP-BUCK-3612-15A' },
    create: {
      productId: product6.id,
      sku: 'TP-BUCK-3612-15A',
      matrix: { input: '36V', output: '12V', current: '15A' },
      price: 580.00,
      vatRate: 20.00,
      weightG: 320,
      isActive: true,
      stock: {
        create: {
          onHand: 35,
          reserved: 0,
          incoming: 15,
        },
      },
    },
    update: { price: 580.00, vatRate: 20.00 },
  })

  // ============================================
  // 2b. Duvar Tipi (Sabit) EV Şarj İstasyonları – kategori ve ürünler
  // ============================================
  console.log('📁 Creating Duvar Tipi EV Charging category and products...')

  const duvarTipiCategory = await prisma.category.upsert({
    where: { slug: 'duvar-tipi-sabit-elektrikli-arac-sarj-istonu' },
    create: {
      slug: 'duvar-tipi-sabit-elektrikli-arac-sarj-istonu',
      name: 'Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları',
      nameEn: 'Wall-Mounted (Fixed) EV Charging Stations',
      description: 'Duvar tipi sabit elektrikli araç şarj istasyonları',
      descriptionEn: 'Wall-mounted fixed electric vehicle charging stations',
      order: 2,
      active: true,
    },
    update: {
      name: 'Duvar Tipi (Sabit) Elektrikli Araç Şarj İstasyonları',
      nameEn: 'Wall-Mounted (Fixed) EV Charging Stations',
    },
  })

  // Ürün 1: Hims 22kW Akıllı Duvar Tipi Araç Şarj İstasyonu
  const hims22 = await prisma.product.upsert({
    where: { slug: 'hims-22kw-akilli-duvar-tipi-sarj-istonu' },
    create: {
      slug: 'hims-22kw-akilli-duvar-tipi-sarj-istonu',
      name: 'Hims 22kW Akıllı Duvar Tipi Araç Şarj İstasyonu',
      nameEn: 'Hims 22kW Smart Wall-Mounted EV Charging Station',
      brand: 'Hims',
      mpn: 'HCDK-22',
      sku: 'HCDK-22-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { ce: true, rohs: true, iec61851: true },
      specs: {
        power_max_kw: 22,
        power_mono_kw: 7.4,
        current_min_a: 6,
        current_max_a: 32,
        voltage_nominal_v: 240,
        voltage_3phase_v: 400,
        frequency_hz: '50-60',
        cable_length_m: 5,
        cable_type: 'H07BZ5-F 5x6mm²+1x0,75mm²',
        protection_class: 'IP65',
        temp_min_c: -30,
        temp_max_c: 65,
        rcmu: 'Type B AC 30mA + DC 6mA',
        weight_kg: null,
        dimensions_mm: '180x180x70',
      },
      description:
        'Hims 22kW Duvar Tipi Şarj İstasyonu, minimal tasarım ve 22kW desteğiyle ev/site kullanımı için. Mobil uygulama (Wi-Fi/Bluetooth), %100 Türkçe menü, RFID yetkilendirme. Type 2 soketli tüm elektrikli araçlarla uyumlu.',
      descriptionEn:
        'Hims 22kW wall-mounted charging station with smart app control, Turkish UI, RFID, Type 2. For home and site use.',
      fullDescription:
        'Hims 22kW Duvar Tipi Şarj İstasyonu, hem minimal şık tasarımı ile dekoratif bir görünüm sunar hem de 22kW desteğiyle aracınızı hızlı şarj etmenizi sağlar. Ev, site ve bireysel kullanımlar için geliştirilmiş olup mobil uygulama üzerinden %100 Türkçe menü ile tam kontrol imkanı sunar. Tüm elektrikli araçlarla (Type 2 soketli) tam uyumludur. Özellikler: Wi-Fi (2.4GHz) ve Bluetooth ile mobil uygulama, LED göstergeler, Türkçe hata kodları, RFID kart desteği, Type B RCMU, acil stop butonu. Monofaze 7.4kW, trifaze 22kW. Çıkış akımı 6A–32A ayarlanabilir. IP65, -30°C ile +65°C çalışma. CE, RoHS, IEC 61851.',
      fullDescriptionEn:
        'Hims 22kW wall-mounted EV charger with app control, Turkish interface, RFID, Type 2. IP65, 7.4kW single-phase / 22kW three-phase. CE, RoHS, IEC 61851.',
      images: [{ url: '/images/products/hims-22kw.jpg', alt: 'Hims 22kW Duvar Tipi Şarj İstasyonu', order: 1 }],
      categoryId: duvarTipiCategory.id,
      leadTimeDays: 7,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
      active: true,
    },
    update: {
      name: 'Hims 22kW Akıllı Duvar Tipi Araç Şarj İstasyonu',
      description:
        'Hims 22kW Duvar Tipi Şarj İstasyonu, minimal tasarım ve 22kW desteğiyle ev/site kullanımı için. Mobil uygulama (Wi-Fi/Bluetooth), %100 Türkçe menü, RFID yetkilendirme. Type 2 soketli tüm elektrikli araçlarla uyumlu.',
      categoryId: duvarTipiCategory.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'HCDKB-22' },
    create: {
      productId: hims22.id,
      sku: 'HCDKB-22',
      matrix: { color: 'Beyaz', model: 'HCDKB-22' },
      price: 900,
      currency: 'EUR',
      vatRate: 20,
      weightG: null,
      isActive: true,
      stock: { create: { onHand: 10, reserved: 0, incoming: 5 } },
    },
    update: { price: 900, currency: 'EUR' },
  })
  await prisma.variant.upsert({
    where: { sku: 'HCDKS-22' },
    create: {
      productId: hims22.id,
      sku: 'HCDKS-22',
      matrix: { color: 'Siyah', model: 'HCDKS-22' },
      price: 900,
      currency: 'EUR',
      vatRate: 20,
      weightG: null,
      isActive: true,
      stock: { create: { onHand: 10, reserved: 0, incoming: 5 } },
    },
    update: { price: 900, currency: 'EUR' },
  })

  // Ürün 2: Elektromarketim EMEV 22kW Elektrikli Araç Şarj İstasyonu
  const emev22 = await prisma.product.upsert({
    where: { slug: 'elektromarketim-emev-22kw-sarj-istonu' },
    create: {
      slug: 'elektromarketim-emev-22kw-sarj-istonu',
      name: 'Elektromarketim EMEV 22kW Elektrikli Araç Şarj İstasyonu',
      nameEn: 'Elektromarketim EMEV 22kW EV Charging Station',
      brand: 'Elektromarketim',
      mpn: 'EMEV-22-3F32',
      sku: 'EMEV-22-BASE',
      lifecycle: Lifecycle.ACTIVE,
      certifications: { ce: true, mid: true, ocpp16: true },
      specs: {
        power_kw: '11/22',
        current_a: '16/32',
        voltage_v: '230-380',
        connection: '3P+N+PE',
        type2: true,
        options: 'Kablolu 5m veya T2 kilitli prizli',
        protection_class: 'IP54',
        ik_rating: 'IK08',
        temp_min_c: -40,
        temp_max_c: 50,
        weight_kg_plug: 3.2,
        weight_kg_cable: 8.2,
      },
      description:
        'EMEV 22kW serisi bireysel garaj ve site/kurumsal kullanım için. OCPP 1.6, Wi-Fi/Ethernet/4G, MID sertifikalı KWh metre. LCD ekran, RFID, 30mA kaçak akım rölesi, surge arrester.',
      descriptionEn:
        'EMEV 22kW for home and commercial use. OCPP 1.6, Wi-Fi/Ethernet/4G, MID meter. LCD, RFID, RCCB, surge arrester.',
      fullDescription:
        'Elektromarketim EMEV serisi, hem bireysel garajlar hem de site, toplu konut ve ticari alanlar için tasarlanmış endüstriyel standartlarda şarj istasyonudur. OCPP 1.6 desteği ile ticari yazılımlarla entegrasyon. 5m entegre kablolu veya T2 kilitli prizli seçenek. Wi-Fi, Ethernet, 4G (kurumsal); kullanıcı ekleme/çıkarma, şarj geçmişi, güç tüketim raporları. Yüksek çözünürlüklü LCD, RFID ile yetkilendirme. 4 montaj deliği ile kolay kurulum. Type B RCCB 30mA, aşırı yük/gerilim/kısa devre koruması, acil durdurma butonu, Surge Arrester Tip 2. IP54, IK08.',
      fullDescriptionEn:
        'EMEV 22kW for residential and commercial use. OCPP 1.6, optional cable or socket. Wi-Fi/Ethernet/4G, LCD, RFID, MID meter. IP54, IK08.',
      images: [{ url: '/images/products/emev-22kw.jpg', alt: 'Elektromarketim EMEV 22kW Şarj İstasyonu', order: 1 }],
      categoryId: duvarTipiCategory.id,
      leadTimeDays: 10,
      moq: 1,
      orderStep: 1,
      isFeatured: true,
      active: true,
    },
    update: {
      name: 'Elektromarketim EMEV 22kW Elektrikli Araç Şarj İstasyonu',
      description:
        'EMEV 22kW serisi bireysel garaj ve site/kurumsal kullanım için. OCPP 1.6, Wi-Fi/Ethernet/4G, MID sertifikalı KWh metre. LCD ekran, RFID, 30mA kaçak akım rölesi, surge arrester.',
      categoryId: duvarTipiCategory.id,
    },
  })

  await prisma.variant.upsert({
    where: { sku: 'EMEV-22-3F32-PT2' },
    create: {
      productId: emev22.id,
      sku: 'EMEV-22-3F32-PT2',
      matrix: { type: 'Prizli', model: '22kW 3F 32A Tip 2 Soketli' },
      price: 730,
      currency: 'EUR',
      vatRate: 20,
      weightG: 3200,
      isActive: true,
      stock: { create: { onHand: 8, reserved: 0, incoming: 4 } },
    },
    update: { price: 730, currency: 'EUR' },
  })
  await prisma.variant.upsert({
    where: { sku: 'EMEV-22-3F32-KT2' },
    create: {
      productId: emev22.id,
      sku: 'EMEV-22-3F32-KT2',
      matrix: { type: 'Kablolu', model: '22kW 3F 32A Tip 2 OCPP 1.6' },
      price: 940,
      currency: 'EUR',
      vatRate: 20,
      weightG: 8200,
      isActive: true,
      stock: { create: { onHand: 6, reserved: 0, incoming: 4 } },
    },
    update: { price: 940, currency: 'EUR' },
  })

  // ============================================
  // 3. PRICE RULES (Tiered Pricing)
  // ============================================
  console.log('💰 Creating price rules...')

  await prisma.priceRule.create({
    data: {
      productId: product1.id,
      name: 'Tiered Pricing - 10+ units',
      type: 'tiered',
      minQty: 10,
      maxQty: 49,
      discountPct: 5.00,
      active: true,
    },
  })

  await prisma.priceRule.create({
    data: {
      productId: product1.id,
      name: 'Tiered Pricing - 50+ units',
      type: 'tiered',
      minQty: 50,
      discountPct: 10.00,
      active: true,
    },
  })

  await prisma.priceRule.create({
    data: {
      productId: product2.id,
      name: 'Tiered Pricing - 20+ units',
      type: 'tiered',
      minQty: 20,
      discountPct: 8.00,
      active: true,
    },
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
