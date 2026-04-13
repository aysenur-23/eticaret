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
  Home,
  Leaf,
  Anchor,
  Building2,
  Factory,
  Package,
  FileText,
  CheckCircle2,
  Calculator,
  ArrowRight,
  ChevronRight,
  Cpu,
  Flame,
  Settings,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts } from '@/lib/products-mock'
import { useTranslations } from 'next-intl'
import type { MockProduct } from '@/lib/products-mock'

const HERO_SLIDES: { src: string; href: string }[] = [
  { src: '/images/hero/hero-4.png', href: '/category/elektrikli-arac-sarj-urunleri' },
  { src: '/images/hero/hero-2.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
  { src: '/images/hero/hero-3.png', href: '/products' },
  { src: '/images/hero/hero-1.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
]
const HERO_SLIDE_INTERVAL_MS = 5000

const USE_CASES = [
  {
    key: 'villa',
    label: 'Villa',
    desc: 'Yüksek tüketimli konutlar için hibrit çözümler',
    icon: Home,
    color: 'from-blue-500 to-blue-600',
    href: '/paketler/villa-paketleri',
  },
  {
    key: 'bag-evi',
    label: 'Bağ / Dağ Evi',
    desc: 'Şebekeden bağımsız küçük konutlar',
    icon: Leaf,
    color: 'from-emerald-500 to-emerald-600',
    href: '/paketler/bag-evi-paketleri',
  },
  {
    key: 'karavan',
    label: 'Karavan',
    desc: 'Mobil yaşam için taşınabilir enerji',
    icon: Truck,
    color: 'from-amber-500 to-amber-600',
    href: '/paketler/karavan-paketleri',
  },
  {
    key: 'tarim',
    label: 'Tarım / Sulama',
    desc: 'Solar pompa ve sulama sistemleri',
    icon: Flame,
    color: 'from-green-600 to-green-700',
    href: '/paketler/sulama-paketleri',
  },
  {
    key: 'marin',
    label: 'Marin',
    desc: 'Tekne ve yatlar için marin paketler',
    icon: Anchor,
    color: 'from-sky-500 to-sky-600',
    href: '/paketler/marin-paketleri',
  },
  {
    key: 'isletme',
    label: 'İşletme',
    desc: 'Ticari tesis ve işyerleri için enerji',
    icon: Building2,
    color: 'from-violet-500 to-violet-600',
    href: '/ges',
  },
  {
    key: 'ev-sarj',
    label: 'EV Şarj',
    desc: 'Araç şarj istasyonu kurulumu',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    href: '/category/elektrikli-arac-sarj-urunleri',
  },
  {
    key: 'cati-ges',
    label: 'Çatı GES',
    desc: 'Şehir evi ve apartman GES sistemleri',
    icon: Sun,
    color: 'from-orange-400 to-red-500',
    href: '/ges',
  },
  {
    key: 'endustriyel',
    label: 'Endüstriyel',
    desc: 'Fabrika ve büyük tesis projeleri',
    icon: Factory,
    color: 'from-slate-500 to-slate-700',
    href: '/contact',
  },
]

const CATEGORIES_GRID = [
  {
    label: 'Güneş Paneli',
    desc: 'Mono ve poli kristal panel modelleri',
    href: '/category/gunes-enerjisi',
    icon: Sun,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    label: 'Batarya',
    desc: 'Lityum ve kurşun asit akü seçenekleri',
    href: '/category/batarya-depolama',
    icon: Battery,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    label: 'İnverter',
    desc: 'Hibrit, off-grid ve mikro inverterler',
    href: '/category/inverterler',
    icon: Cpu,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    label: 'EV Şarj',
    desc: 'AC / DC şarj istasyonları ve kablolar',
    href: '/category/elektrikli-arac-sarj-urunleri',
    icon: Zap,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    label: 'Enerji Depolama',
    desc: 'ESS ve taşınabilir güç istasyonları',
    href: '/category/batarya-depolama',
    icon: Package,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
  },
  {
    label: 'Isı Pompası',
    desc: 'HVAC ve ısı pompası sistemleri',
    href: '/category/isi-pompasi-hvac',
    icon: Flame,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    label: 'Enerji Yönetimi',
    desc: 'Akıllı sayaç ve izleme sistemleri',
    href: '/category/enerji-yonetimi',
    icon: Settings,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
  },
  {
    label: 'Tüm Ürünler',
    desc: 'Ürün kataloğumuza göz atın',
    href: '/products',
    icon: ShoppingBag,
    color: 'text-brand',
    bg: 'bg-brand/10',
    isAll: true,
  },
]

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
    icon: Sun,
    color: 'from-orange-400 to-red-500',
  },
  {
    title: 'Tarımsal Sulama',
    location: 'Adana',
    capacity: '30 kW',
    type: 'Off-Grid Solar',
    desc: 'Şebekesiz tarla sulama sistemi. Kuyu pompası besleme, mevsimlik bağımsız çalışma.',
    icon: Leaf,
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: 'EV Şarj İstasyonu',
    location: 'İstanbul',
    capacity: '22 kW AC',
    type: 'Ticari EV Şarj',
    desc: 'AVM otoparkı için 8 noktalı çift taraflı AC şarj istasyonu kurulumu.',
    icon: Zap,
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Marin Batarya',
    location: 'Antalya',
    capacity: '15 kWh',
    type: 'Marin Sistem',
    desc: 'Tekne için lityum batarya sistemi, düşük voltaj DC dağıtım ve solar şarj regülatörü.',
    icon: Anchor,
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
  },
  {
    slug: 'gunes-paneli-verimlilik',
    title: 'Güneş Paneli Verimi Nasıl Hesaplanır?',
    desc: 'Panel gücü, yıllık üretim tahmini ve yatırım geri dönüş hesabı hakkında kapsamlı rehber.',
    category: 'Güneş Enerjisi',
    icon: Sun,
  },
  {
    slug: 'lityum-vs-kursum-asit',
    title: 'Lityum mu, Kurşun Asit mi? Akü Karşılaştırması',
    desc: 'Fiyat, ömür, derinlik deşarj ve kullanım senaryolarına göre kapsamlı akü karşılaştırması.',
    category: 'Batarya',
    icon: Battery,
  },
]

function getPopularProducts(products: MockProduct[] = mockProducts): MockProduct[] {
  const popular = products.filter((p) => p.featured || (p.discount != null && p.discount > 0))
  const rest = products.filter((p) => !popular.find((fp) => fp.id === p.id))
  return [...popular, ...rest].slice(0, 8)
}

export default function HomePage() {
  const t = useTranslations('home')
  const [allProducts, setAllProducts] = useState(mockProducts)
  const popularProducts = useMemo(() => getPopularProducts(allProducts), [allProducts])
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

  const containerClass = 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] min-w-0'
  const sectionPadding = 'py-12 sm:py-16 md:py-20'
  const sectionTitleClass = 'text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight'
  const sectionOverlineClass = 'block text-xs font-bold uppercase tracking-widest text-brand mb-2'
  const sectionDescClass = 'text-slate-500 text-sm sm:text-base mt-2 leading-relaxed'

  return (
    <div className="min-h-full w-full max-w-full min-w-0 overflow-x-hidden bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 pt-16 pb-20 md:pt-24 md:pb-32 px-4" aria-label="Ana başlık">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/25 via-slate-950 to-slate-900 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/40 px-4 py-1.5 text-xs font-bold text-brand-light uppercase tracking-widest mb-8">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Türkiye'nin Enerji Mağazası
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-6">
            Temiz Enerji&nbsp;
            <span className="text-brand">Her Yerde,</span>
            <br className="hidden sm:block" />
            &nbsp;Her İhtiyaç İçin
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Güneş paneli, batarya, inverter ve EV şarj çözümleri.
            Enerji bağımsızlığınız için doğru ürün, uzman destek.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            <Button asChild size="lg" className="bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/30 px-7 h-12 w-full sm:w-auto">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Ürünleri İncele
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-600 bg-white/5 text-white hover:bg-white/15 hover:border-slate-400 rounded-xl px-7 h-12 w-full sm:w-auto">
              <Link href="/paketler" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Paketleri Gör
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 px-7 h-12 w-full sm:w-auto">
              <Link href="/ges" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Teklif Al
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 justify-center text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Güvenli Ödeme</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Hızlı Kargo</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Teknik Destek</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Vade Farksız Taksit</span>
          </div>
        </div>
      </section>

      {/* ─── 2. KULLANIM SENARYOLARI ──────────────────────────────────────── */}
      <section className={`${sectionPadding} opacity-0 animate-section-in`} aria-labelledby="use-cases-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>Kullanım Senaryoları</span>
            <h2 id="use-cases-heading" className={sectionTitleClass}>Hangi İhtiyaç İçin?</h2>
            <p className={sectionDescClass}>Kullanım alanınıza özel enerji çözümlerini keşfedin.</p>
          </header>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 md:gap-4">
            {USE_CASES.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center touch-manipulation"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{item.label}</span>
                  <span className="hidden lg:block text-[10px] text-slate-500 leading-snug line-clamp-2">{item.desc}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. POPÜLER ÜRÜNLER ───────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-50/70 opacity-0 animate-section-in animate-section-in-delay-1`} aria-labelledby="popular-products-heading">
        <div className={containerClass}>
          <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className={sectionOverlineClass}>Popüler Ürünler</span>
              <h2 id="popular-products-heading" className={sectionTitleClass}>En Çok Tercih Edilenler</h2>
              <p className={sectionDescClass}>Müşterilerimizin en çok satın aldığı ürünler.</p>
            </div>
            <Link href="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
              Tümünü Gör <ArrowUpRight className="w-4 h-4" />
            </Link>
          </header>

          {popularProducts.length === 0 ? (
            <p className="text-slate-500 py-8">Henüz ürün bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 min-w-0">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. SLIDER ────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 md:px-8" aria-label="Fırsatlar ve Kampanyalar">
        <div className="w-full max-w-[1600px] mx-auto min-w-0">
          <div className="relative w-full rounded-2xl md:rounded-3xl bg-slate-900 shadow-xl min-h-[28vh] sm:min-h-0 aspect-[3/1.4] sm:aspect-[9/4] md:aspect-[5/2] ring-1 ring-slate-200/30 overflow-hidden">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src + index}
                className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
              >
                <Link
                  href={slide.href}
                  className="absolute inset-0 block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-[2]" aria-hidden />
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[3] flex gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={t('slideDotLabel', { n: i + 1 })}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 touch-manipulation w-1.5 h-1.5 sm:w-2 sm:h-2 ${i === currentSlide ? 'bg-white ring-2 ring-white/60 shadow-md' : 'bg-white/60 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. KATEGORİLER ───────────────────────────────────────────────── */}
      <section className={`${sectionPadding} opacity-0 animate-section-in`} aria-labelledby="categories-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className={sectionOverlineClass}>Kategoriler</span>
              <h2 id="categories-heading" className={sectionTitleClass}>Tüm Ürün Kategorileri</h2>
              <p className={sectionDescClass}>İhtiyacınıza göre kategori seçin, ürünleri filtreleyin.</p>
            </div>
            <Link href="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
              Tüm Ürünler <ArrowUpRight className="w-4 h-4" />
            </Link>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES_GRID.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-brand hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 touch-manipulation${item.isAll ? ' border-brand/30 bg-brand/5' : ''}`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold text-slate-900 group-hover:text-brand transition-colors leading-tight${item.isAll ? ' text-brand' : ''}`}>{item.label}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. NASIL ÇALIŞIR ─────────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-950 opacity-0 animate-section-in`} aria-labelledby="how-it-works-heading">
        <div className={containerClass}>
          <header className="text-center mb-10 md:mb-14">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand mb-2">Nasıl Çalışır?</span>
            <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              3 Adımda Enerji Çözümü
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
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

      {/* ─── 7. TEKLİF AL CTA BLOĞU ──────────────────────────────────────── */}
      <section className="relative overflow-hidden opacity-0 animate-section-in" aria-labelledby="quote-cta-heading">
        <div className="bg-gradient-to-r from-brand via-blue-600 to-violet-600 py-16 md:py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none" />
          <div className="container mx-auto max-w-3xl text-center relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Para Kazandıran Adım
            </div>
            <h2 id="quote-cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Enerji Faturanızı Düşürmeye<br className="hidden sm:block" /> Hazır mısınız?
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
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

      {/* ─── 8. NEDEN VOLTEKNO ────────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-50/60 opacity-0 animate-section-in animate-section-in-delay-2`} aria-labelledby="why-voltekno-heading">
        <div className={containerClass}>
          <header className="text-center mb-10 md:mb-14">
            <span className={sectionOverlineClass}>{t('whyUs')}</span>
            <h2 id="why-voltekno-heading" className={`${sectionTitleClass} max-w-2xl mx-auto`}>
              {t('whyIMORA')}
            </h2>
            <p className={`${sectionDescClass} max-w-xl mx-auto text-center`}>
              {t('whyIMORADesc')}
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

      {/* ─── 9. REFERANS PROJELER ─────────────────────────────────────────── */}
      <section className={`${sectionPadding} opacity-0 animate-section-in`} aria-labelledby="reference-projects-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>Referans Projeler</span>
            <h2 id="reference-projects-heading" className={sectionTitleClass}>Tamamlanan Projelerden</h2>
            <p className={sectionDescClass}>Gerçek projeler, gerçek sonuçlar.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {REFERENCE_PROJECTS.map((project) => {
              const Icon = project.icon
              return (
                <div key={project.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${project.color}`} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{project.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{project.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 rounded-lg px-2.5 py-1">{project.capacity}</span>
                      <span className="text-xs font-medium bg-brand/10 text-brand rounded-lg px-2.5 py-1">{project.type}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{project.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 10. BLOG ─────────────────────────────────────────────────────── */}
      <section className={`${sectionPadding} bg-slate-50/60 opacity-0 animate-section-in animate-section-in-delay-1`} aria-labelledby="blog-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className={sectionOverlineClass}>Blog</span>
              <h2 id="blog-heading" className={sectionTitleClass}>Enerji Rehberi</h2>
              <p className={sectionDescClass}>Bilgilendirici yazılar, ürün karşılaştırmaları ve kurulum rehberleri.</p>
            </div>
            <Link href="/blog" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
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
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-brand/10 text-brand rounded-lg px-2.5 py-1">{post.category}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Yakında</span>
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

      {/* ─── 11. SSS ──────────────────────────────────────────────────────── */}
      <section className={`${sectionPadding} opacity-0 animate-section-in animate-section-in-delay-2`} aria-labelledby="home-faq-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('faqOverline')}</span>
            <h2 id="home-faq-heading" className={sectionTitleClass}>{t('faqTitle')}</h2>
            <p className={sectionDescClass}>{t('faqDesc')}</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900">{item.q}</h3>
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
