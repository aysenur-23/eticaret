'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Shield,
  HeadphonesIcon,
  ShoppingBag,
  ArrowUpRight,
  Zap,
  Battery,
  Sun,
  Truck,
  Package,
  FileText,
  CheckCircle2,
  Calculator,
  TrendingUp,
  MapPin,
  ArrowRight,
  Clock,
  Cpu,
  Flame,
} from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts } from '@/lib/products-mock'
import { PACKAGE_CATEGORIES } from '@/lib/package-categories'
import { useTranslations } from 'next-intl'
import type { MockProduct } from '@/lib/products-mock'

const HERO_SLIDES: { src: string; href: string }[] = [
  { src: '/images/hero/hero-4.png', href: '/category/elektrikli-arac-sarj-urunleri' },
  { src: '/images/hero/hero-2.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
  { src: '/images/hero/hero-3.png', href: '/products' },
  { src: '/images/hero/hero-1.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
]
const HERO_SLIDE_INTERVAL_MS = 5000

// Orijinal 5 paket + 4 yeni senaryo
const EXTRA_USE_CASES = [
  {
    slug: 'isletme',
    title: 'İşletme',
    description: 'Ticari tesis ve işyerleri için enerji çözümleri.',
    image: '/images/hero/hero-4.png',
    objectPosition: 'center 40%',
    imageAlt: 'İşletme ve ticari tesis enerji çözümleri',
    href: '/ges',
  },
  {
    slug: 'ev-sarj-senaryosu',
    title: 'EV Şarj',
    description: 'Araç şarj istasyonu kurulumu ve ürünleri.',
    image: '/images/categories/sarj.png',
    objectPosition: 'center center',
    imageAlt: 'Elektrikli araç şarj istasyonu',
    href: '/category/elektrikli-arac-sarj-urunleri',
  },
  {
    slug: 'cati-ges',
    title: 'Çatı GES',
    description: 'Şehir evi ve apartman güneş enerji sistemleri.',
    image: '/images/categories/panel.png',
    objectPosition: 'center center',
    imageAlt: 'Çatı güneş enerji sistemi',
    href: '/ges',
  },
  {
    slug: 'endustriyel',
    title: 'Endüstriyel',
    description: 'Fabrika ve büyük tesis enerji projeleri.',
    image: '/images/hero/hero-3.png',
    objectPosition: 'center 40%',
    imageAlt: 'Endüstriyel enerji projesi',
    href: '/contact',
  },
]

const FEATURED_ROW_MAX = 10

function getFeaturedRowProducts(products: MockProduct[] = mockProducts): MockProduct[] {
  const featured = products.filter((p) => p.featured || (p.discount != null && p.discount > 0))
  const sliced = featured.slice(0, FEATURED_ROW_MAX)
  if (sliced.length <= 1) return sliced
  const byCategory = new Map<string, MockProduct[]>()
  for (const p of sliced) {
    const list = byCategory.get(p.category) ?? []
    list.push(p)
    byCategory.set(p.category, list)
  }
  Array.from(byCategory.values()).forEach((list) => list.sort((a, b) => a.id.localeCompare(b.id)))
  const categories = Array.from(byCategory.keys()).sort()
  const result: MockProduct[] = []
  let lastCategory: string | null = null
  while (result.length < sliced.length) {
    let picked = false
    for (const cat of categories) {
      const list = byCategory.get(cat)!
      if (list.length === 0 || cat === lastCategory) continue
      result.push(list.shift()!)
      lastCategory = cat
      picked = true
      break
    }
    if (!picked) {
      for (const cat of categories) {
        const list = byCategory.get(cat)!
        if (list.length > 0) { result.push(list.shift()!); lastCategory = cat; break }
      }
    }
  }
  return result
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'İhtiyacını Belirle',
    desc: 'Kullanım senaryonu, tüketim miktarını ve bütçeni belirt. İstersen ücretsiz keşif formumuzu doldur.',
    icon: FileText,
    color: 'bg-brand',
  },
  {
    step: '02',
    title: 'Ürün / Paket Seç',
    desc: 'İhtiyacına özel hazırlanmış paketleri incele ya da ürün kataloğundan doğrudan seçim yap.',
    icon: ShoppingBag,
    color: 'bg-emerald-500',
  },
  {
    step: '03',
    title: 'Kurulum / Teslim',
    desc: 'Siparişin hızla hazırlanır, teknik destek ekibimiz kurulum sürecinde yanında.',
    icon: CheckCircle2,
    color: 'bg-violet-500',
  },
]

const REFERENCE_PROJECTS = [
  {
    title: 'Villa Çatı GES',
    location: 'Muğla',
    capacity: '10 kW',
    type: 'Hibrit Sistem',
    desc: 'Yazlık villa için tam bağımsız enerji çözümü, 3 fazlı hibrit inverter ve lityum batarya.',
    image: '/images/packages/custom/villa.jpg',
    color: 'from-orange-400 to-red-500',
  },
  {
    title: 'Tarımsal Sulama',
    location: 'Adana',
    capacity: '30 kW',
    type: 'Off-Grid Solar',
    desc: 'Şebekesiz tarla sulama sistemi. Kuyu pompası besleme, mevsimlik bağımsız çalışma.',
    image: '/images/packages/custom/tarla.png',
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: 'EV Şarj İstasyonu',
    location: 'İstanbul',
    capacity: '22 kW AC',
    type: 'Ticari EV Şarj',
    desc: 'AVM otoparkı için 8 noktalı çift taraflı AC şarj istasyonu kurulumu.',
    image: '/images/categories/sarj.png',
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Marin Batarya',
    location: 'Antalya',
    capacity: '15 kWh',
    type: 'Marin Sistem',
    desc: 'Tekne için lityum batarya sistemi, düşük voltaj DC dağıtım ve solar şarj regülatörü.',
    image: '/images/packages/custom/marin.jpg',
    color: 'from-sky-500 to-cyan-600',
  },
]

const BLOG_PLACEHOLDER = [
  {
    slug: 'ev-sarj-istasyonu-secimi',
    title: 'Ev için EV Şarj İstasyonu Nasıl Seçilir?',
    desc: 'AC ve DC şarj farkları, güç seviyeleri ve ev elektrik altyapısına uygunluk rehberi.',
    category: 'EV Şarj',
    icon: Zap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-400',
  },
  {
    slug: 'gunes-paneli-verimlilik',
    title: 'Güneş Paneli Verimi Nasıl Hesaplanır?',
    desc: 'Panel gücü, yıllık üretim tahmini ve yatırım geri dönüş hesabı hakkında kapsamlı rehber.',
    category: 'Güneş Enerjisi',
    icon: Sun,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-400',
  },
  {
    slug: 'lityum-vs-kursum-asit',
    title: 'Lityum mu, Kurşun Asit mi? Akü Karşılaştırması',
    desc: 'Fiyat, ömür, derinlik deşarj ve kullanım senaryolarına göre kapsamlı akü karşılaştırması.',
    category: 'Batarya',
    icon: Battery,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-400',
  },
]

// Orijinal 3 kategori + genişletilmiş liste — fotoğraf yoksa renk+ikon
const EXTRA_CATEGORY_ITEMS = [
  {
    href: '/category/inverterler',
    title: 'İnverterler',
    subtitle: 'Hibrit, off-grid ve mikro inverterler',
    icon: Cpu,
    bg: 'from-teal-600 to-teal-800',
  },
  {
    href: '/category/isi-pompasi-hvac',
    title: 'Isı Pompası ve HVAC',
    subtitle: 'İklimlendirme ve ısıtma sistemleri',
    icon: Flame,
    bg: 'from-red-600 to-orange-700',
  },
  {
    href: '/category/enerji-yonetimi',
    title: 'Enerji Yönetimi',
    subtitle: 'Akıllı sayaç ve izleme sistemleri',
    icon: Zap,
    bg: 'from-cyan-600 to-sky-700',
  },
]

export default function HomePage() {
  const t = useTranslations('home')
  const [allProducts, setAllProducts] = useState(mockProducts)
  const featuredRowProducts = useMemo(() => getFeaturedRowProducts(allProducts), [allProducts])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setAllProducts(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, HERO_SLIDE_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [currentSlide])

  const sectionPadding = 'py-8 sm:py-12 md:py-16 lg:py-20'
  const containerClass = 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] min-w-0'
  const sectionTitleClass = 'text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight'
  const sectionOverlineClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2'
  const sectionDescClass = 'text-slate-600 text-sm sm:text-base mt-1'

  const faqItems = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
    { q: t('faqQ5'), a: t('faqA5') },
  ]

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://voltekno.com'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <div className="min-h-full w-full max-w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── 1. YENİ HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950" aria-label="Ana başlık">
        {/* Subtle background glows */}
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-16 md:py-20 lg:py-24">

            {/* Left: text + CTAs */}
            <div className="flex-1 min-w-0 flex flex-col items-start text-left max-w-xl lg:max-w-none">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/40 px-4 py-1.5 text-xs font-bold text-brand-light uppercase tracking-widest mb-7">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Türkiye'nin Enerji Mağazası
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-5">
                Temiz Enerji<br />
                <span className="text-brand">Her Yerde,</span><br />
                Her İhtiyaç İçin
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-9 leading-relaxed max-w-lg">
                Güneş paneli, batarya, inverter ve EV şarj çözümleri.
                Enerji bağımsızlığınız için doğru ürün, uzman destek.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button asChild size="lg" className="bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/30 px-7 h-12">
                  <Link href="/products" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Ürünleri İncele
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-600 bg-white/5 text-white hover:bg-white/15 hover:border-slate-400 rounded-xl px-7 h-12">
                  <Link href="/paketler" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Paketleri Gör
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 px-7 h-12">
                  <Link href="/ges" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Teklif Al
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-slate-400 text-xs font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Güvenli Ödeme</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Hızlı Kargo</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Teknik Destek</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Vade Farksız Taksit</span>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative flex-shrink-0 w-full lg:w-[48%] xl:w-[50%]">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Gradient fade at bottom-left to blend into the dark bg */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
                <Image
                  src="/images/ges/solar-hero-premium.png"
                  alt="Voltekno güneş enerji sistemi kurulumu"
                  width={900}
                  height={620}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Floating stat badges */}
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Toplam Kurulum</p>
                  <p className="text-lg font-extrabold text-slate-900 leading-tight">500+ Proje</p>
                </div>
                <div className="absolute bottom-4 left-4 z-20 bg-emerald-500/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Enerji Tasarrufu</p>
                  <p className="text-lg font-extrabold text-white leading-tight">%80'e kadar</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. KULLANIM SENARYOLARI (orijinal Paket Kategorileri yapısı + eklemeler) ── */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in`} aria-labelledby="use-cases-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className={sectionOverlineClass}>Kullanım Senaryoları</span>
              <h2 id="use-cases-heading" className={sectionTitleClass}>Hangi İhtiyaç İçin?</h2>
              <p className={sectionDescClass}>Kullanım alanınıza özel hazırlanmış enerji çözümleri.</p>
            </div>
            <Link href="/paketler" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Tüm Paketler <ArrowUpRight className="w-4 h-4" />
            </Link>
          </header>

          {/* Üst satır: 3 büyük kart — orijinal PACKAGE_CATEGORIES yapısı */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {PACKAGE_CATEGORIES.slice(0, 3).map((item) => (
              <Link
                key={item.slug}
                href={`/paketler/${item.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover opacity-85 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ objectPosition: item.objectPosition ?? 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Enerji Paketi</p>
                    <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/60 line-clamp-1">{item.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-light group-hover:gap-2 transition-all">
                      İncele <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Orta satır: 2 geniş kart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {PACKAGE_CATEGORIES.slice(3).map((item) => (
              <Link
                key={item.slug}
                href={`/paketler/${item.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover opacity-85 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{ objectPosition: item.objectPosition ?? 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Enerji Paketi</p>
                      <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                      <p className="mt-1 text-sm text-white/60 line-clamp-1">{item.description}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white group-hover:bg-brand group-hover:border-brand transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Alt satır: 4 ek senaryo (aynı kart stili) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EXTRA_USE_CASES.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-white/55 line-clamp-1">{item.description}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-light group-hover:gap-2 transition-all">
                      İncele <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. POPÜLER ÜRÜNLER (orijinal "Öne Çıkan" scroll yapısı, yeni başlık) ── */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-1`} aria-labelledby="popular-products-heading">
        <div className={containerClass}>
          <header className="mb-6 md:mb-8">
            <span className={sectionOverlineClass}>En Çok Tercih Edilenler</span>
            <h2 id="popular-products-heading" className={sectionTitleClass}>
              Popüler Ürünler
            </h2>
            <p className={sectionDescClass}>Müşterilerimizin en çok satın aldığı ürünler.</p>
          </header>
          {featuredRowProducts.length === 0 ? (
            <p className="text-slate-500 py-8">{t('noProductsYet')}</p>
          ) : (
            <div className="overflow-hidden -mx-1 px-1 group/scroll rounded-2xl">
              <div className="flex gap-4 sm:gap-5 w-max animate-featured-scroll" style={{ width: 'max-content' }}>
                {[...featuredRowProducts, ...featuredRowProducts].map((product, i) => (
                  <div key={`${product.id}-${i}`} className="flex-none w-[180px] sm:w-[200px] md:w-[220px] min-w-0">
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        brand: product.brand,
                      }}
                      oldPrice={product.oldPrice}
                      discount={product.discount}
                      badges={product.tags}
                      sku={product.sku}
                      stock={product.stock}
                      isVariantProduct={product.isVariantProduct}
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. SLIDER (sayfanın ortasına taşındı) ──────────────────────── */}
      <section className="pt-0 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 lg:px-10" aria-label={t('heroTitle2')}>
        <div className="w-full max-w-[1600px] mx-auto min-w-0">
          <div className="relative w-full rounded-xl sm:rounded-2xl md:rounded-3xl bg-slate-900 shadow-xl min-h-[28vh] sm:min-h-0 aspect-[3/2] sm:aspect-[9/4] md:aspect-[5/2] ring-1 ring-slate-200/30 overflow-hidden">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src + index}
                className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
              >
                <Link
                  href={slide.href}
                  className="absolute inset-0 block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  aria-label={index === 0 ? t('heroSlideLabelCharge') : (index === 1 || index === 3) ? t('heroSlideLabelCable') : t('heroSlideLabelAll')}
                >
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    className={`object-cover pointer-events-none bg-slate-900 ${index === 0 ? 'object-left md:object-[35%_50%]' : 'object-center'}`}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    unoptimized={slide.src.startsWith('http')}
                    onError={(e) => { const el = e.target as HTMLImageElement; if (el) el.style.display = 'none' }}
                  />
                </Link>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-[2]" aria-hidden />
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[3] flex gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={t('slideDotLabel', { n: i + 1 })}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 touch-manipulation min-w-[10px] min-h-[10px] w-1.5 h-1.5 sm:w-2 sm:h-2 flex items-center justify-center ${i === currentSlide ? 'bg-white ring-2 ring-white/60 shadow-md scale-100' : 'bg-white/60 hover:bg-white/80 active:bg-white backdrop-blur-[1px]'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. KATEGORİLER (orijinal fotoğraf kart yapısı + genişletilmiş) ─ */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in`} aria-labelledby="main-categories-heading">
        <div className={containerClass}>
          <header className="mb-5 sm:mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('categoryDetails')}</span>
            <h2 id="main-categories-heading" className={sectionTitleClass}>
              {t('categoriesTitle')}
            </h2>
            <p className={sectionDescClass}>{t('categoriesDesc')}</p>
          </header>

          {/* Orijinal 3 büyük fotoğraf kartı */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-6 min-w-0 mb-4">
            {[
              { href: '/category/elektrikli-arac-sarj-urunleri', title: t('categoryCharge'), subtitle: t('categoryChargeDesc'), image: '/images/categories/sarj.png', objectPosition: 'center center' },
              { href: '/category/batarya-depolama', title: t('categoryBattery'), subtitle: t('categoryBatteryDesc'), image: '/images/categories/batarya.png', objectPosition: 'center center' },
              { href: '/category/gunes-enerjisi', title: t('categorySolar'), subtitle: t('categorySolarDesc'), image: '/images/categories/panel.png', objectPosition: 'center center' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative block rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 min-w-0 touch-manipulation"
              >
                <div className="aspect-[4/3] sm:aspect-[3/2] relative overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" aria-hidden />
                </div>
                <div className="p-3 sm:p-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5 group-hover:text-brand transition-colors line-clamp-1">{item.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-3">{item.subtitle}</p>
                  <span className="inline-flex items-center rounded-lg sm:rounded-xl bg-brand text-white text-[10px] sm:text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 shadow-sm group-hover:opacity-90">
                    {t('categoryIncele')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Ekstra kategoriler — ikon+renk kart (görsel yok olanlar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {EXTRA_CATEGORY_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative block rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 touch-manipulation"
                >
                  <div className={`aspect-[4/3] sm:aspect-[3/2] bg-gradient-to-br ${item.bg} flex flex-col items-center justify-center gap-2 p-4`}>
                    <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" />
                    <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">Kategori</span>
                  </div>
                  <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5 group-hover:text-brand transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-3">{item.subtitle}</p>
                    <span className="inline-flex items-center rounded-lg sm:rounded-xl bg-brand text-white text-[10px] sm:text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 shadow-sm group-hover:opacity-90">
                      {t('categoryIncele')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. NASIL ÇALIŞIR ─────────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-950 min-w-0 opacity-0 animate-section-in`} aria-labelledby="how-it-works-heading">
        <div className={containerClass}>
          <header className="text-center mb-10 md:mb-14">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand mb-2">Nasıl Çalışır?</span>
            <h2 id="how-it-works-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              3 Adımda Enerji Çözümü
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
              İhtiyacından siparişe, siparişten teslimat ve kuruluma kadar tüm süreçte yanınızdayız.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-black text-white/30 uppercase tracking-widest mb-2">{item.step}</span>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. TEKLİF AL CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-w-0 opacity-0 animate-section-in" aria-labelledby="quote-cta-heading">
        <div className="bg-gradient-to-r from-brand via-blue-600 to-violet-600 py-14 md:py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none" />
          <div className="container mx-auto max-w-3xl text-center relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Para Kazandıran Adım
            </div>
            <h2 id="quote-cta-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
              Enerji Faturanızı Düşürmeye<br className="hidden sm:block" /> Hazır mısınız?
            </h2>
            <p className="text-white/80 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Ücretsiz ön keşif formunu doldurun, size özel teklif hazırlayalım.
              Ya da GES hesaplama aracımızı kullanın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-brand hover:bg-slate-100 font-bold rounded-xl shadow-xl px-8 h-12 w-full sm:w-auto">
                <Link href="/ges" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Teklif Al
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:border-white font-bold rounded-xl px-8 h-12 w-full sm:w-auto">
                <Link href="/configurator" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Hesapla
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. REFERANS PROJELER ─────────────────────────────────────────── */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in`} aria-labelledby="reference-projects-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>Referans Projeler</span>
            <h2 id="reference-projects-heading" className={sectionTitleClass}>Tamamlanan Projelerden</h2>
            <p className={sectionDescClass}>Gerçek projeler, gerçek sonuçlar.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {REFERENCE_PROJECTS.map((project) => (
              <div key={project.title} className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent pointer-events-none" />
                  {/* Location badge top-left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <MapPin className="w-3 h-3 text-brand" />
                    <span className="text-[10px] font-bold text-slate-700">{project.location}</span>
                  </div>
                  {/* Capacity badge bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-bold bg-gradient-to-r ${project.color} text-white rounded-md px-2 py-0.5`}>{project.capacity}</span>
                    <span className="text-[10px] font-medium bg-white/90 text-slate-700 rounded-md px-2 py-0.5">{project.type}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-brand transition-colors">{project.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. BLOG ─────────────────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-50/60 min-w-0 opacity-0 animate-section-in animate-section-in-delay-1`} aria-labelledby="blog-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className={sectionOverlineClass}>Blog</span>
              <h2 id="blog-heading" className={sectionTitleClass}>Enerji Rehberi</h2>
              <p className={sectionDescClass}>Bilgilendirici yazılar, ürün karşılaştırmaları ve kurulum rehberleri.</p>
            </div>
            <Link href="/blog" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              Tüm Yazılar <ArrowUpRight className="w-4 h-4" />
            </Link>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {BLOG_PLACEHOLDER.map((post) => {
              const Icon = post.icon
              return (
                <Link
                  key={post.slug}
                  href="/blog"
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-40 ${post.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-12 h-12 ${post.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-brand/10 text-brand rounded-lg px-2.5 py-1">{post.category}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium"><Clock className="w-3 h-3" />Yakında</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand group-hover:gap-2 transition-all">
                      Okumaya Devam Et <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 11. SSS (orijinal yapı) ──────────────────────────────────────── */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-2`} aria-labelledby="home-faq-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('faqOverline')}</span>
            <h2 id="home-faq-heading" className={sectionTitleClass}>{t('faqTitle')}</h2>
            <p className={sectionDescClass}>{t('faqDesc')}</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50">
              <Link href="/faq">{t('seeAllFaq')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── NEDEN VOLTEKNO (footer öncesi) ──────────────────────────────── */}
      <div className="w-full border-t border-slate-200/80 bg-slate-100/40" aria-hidden />
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-3 bg-slate-50/60`} aria-labelledby="why-voltekno-heading">
        <div className={containerClass}>
          <header className="text-center mb-10 md:mb-14">
            <span className={sectionOverlineClass}>{t('whyUs')}</span>
            <h2 id="why-voltekno-heading" className={`${sectionTitleClass} max-w-2xl mx-auto`}>
              {t('whyVoltekno')}
            </h2>
            <p className={`${sectionDescClass} max-w-2xl mx-auto mt-2 text-center`}>
              {t('whyVolteknoDesc')}
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { icon: Shield, titleKey: 'reliableQuality' as const, descKey: 'reliableQualityDesc' as const, color: 'bg-brand' },
              { icon: ShoppingBag, titleKey: 'rightProduct' as const, descKey: 'rightProductDesc' as const, color: 'bg-emerald-500' },
              { icon: Truck, titleKey: 'fastDelivery' as const, descKey: 'fastDeliveryDesc' as const, color: 'bg-sky-500' },
              { icon: HeadphonesIcon, titleKey: 'techSupport' as const, descKey: 'techSupportDesc' as const, color: 'bg-violet-500' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.titleKey} className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-7 h-7 text-white" aria-hidden />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sabit iletişim butonu */}
      <Link
        href="/contact"
        className="fixed bottom-safe right-safe z-50 flex items-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-white font-semibold shadow-lg hover:bg-brand-hover hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ring-1 ring-black/10"
        aria-label={t('askUsNow')}
      >
        <HeadphonesIcon className="w-5 h-5 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{t('askUsNow')}</span>
      </Link>
    </div>
  )
}
