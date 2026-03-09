'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Shield,
  HeadphonesIcon,
  CreditCard,
  ShoppingBag,
  Zap,
  Battery,
  Sun,
  Truck,
} from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts } from '@/lib/products-mock'
import { PRODUCT_CATEGORIES } from '@/lib/categories'
import { PACKAGE_CATEGORIES } from '@/lib/package-categories'
import { useTranslations } from 'next-intl'
import type { MockProduct } from '@/lib/products-mock'

/** Hero slider – 4 görsel; ilk iki: şarj istasyonları ve şarj kabloları sayfalarına gider. */
const HERO_SLIDES: { src: string; href: string }[] = [
  { src: '/images/hero/hero-4.png', href: '/category/ev-sarj' },
  { src: '/images/hero/hero-2.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
  { src: '/images/hero/hero-3.png', href: '/products' },
  { src: '/images/hero/hero-1.png', href: '/products?category=' + encodeURIComponent('Araç Şarj Kabloları') },
]
const HERO_SLIDE_INTERVAL_MS = 5000

/** Öne çıkan ürünler tek satırda (en fazla bu kadar). */
const FEATURED_ROW_MAX = 10

/** Ürünlerimiz bölümünde gösterilecek ürün sayısı (yaklaşık 5 satır x 4 sütun = 20). */
const MIXED_PRODUCTS_COUNT = 20

/** Öne çıkan ürünleri deterministik sırada çeşitlendirir; art arda aynı kategoride ürün gelmez (SSR/CSR uyumu için rastgele değil). */
function getFeaturedRowProducts(): MockProduct[] {
  const featured = mockProducts.filter((p) => p.featured || (p.discount != null && p.discount > 0))
  const sliced = featured.slice(0, FEATURED_ROW_MAX)
  if (sliced.length <= 1) return sliced

  const byCategory = new Map<string, MockProduct[]>()
  for (const p of sliced) {
    const list = byCategory.get(p.category) ?? []
    list.push(p)
    byCategory.set(p.category, list)
  }
  // Deterministik sıra: sunucu ve istemci aynı sonucu üretsin (hydration hatasını önler)
  Array.from(byCategory.values()).forEach((list) => list.sort((a, b) => a.id.localeCompare(b.id)))
  const categories = Array.from(byCategory.keys()).sort()

  const result: MockProduct[] = []
  let lastCategory: string | null = null
  while (result.length < sliced.length) {
    let picked = false
    for (const cat of categories) {
      const list = byCategory.get(cat)!
      if (list.length === 0 || cat === lastCategory) continue
      const item = list.shift()!
      result.push(item)
      lastCategory = cat
      picked = true
      break
    }
    if (!picked) {
      for (const cat of categories) {
        const list = byCategory.get(cat)!
        if (list.length > 0) {
          result.push(list.shift()!)
          lastCategory = cat
          break
        }
      }
    }
  }
  return result
}

/** Ana sayfa: "Ürünlerimiz" için karışık ürünler (öne çıkan satırda gösterilenler hariç, ~5 satır). */
function getMixedProductsForHome(featuredIds: Set<string> | undefined): MockProduct[] {
  const ids = featuredIds ?? new Set<string>()
  const rest = mockProducts.filter((p) => !ids.has(p.id))
  return rest.slice(0, MIXED_PRODUCTS_COUNT)
}

export default function HomePage() {
  const t = useTranslations('home')
  const { featuredRowProducts, mixedProducts } = useMemo(() => {
    const featured = getFeaturedRowProducts()
    const featuredIds = new Set(featured.map((p) => p.id))
    const mixed = getMixedProductsForHome(featuredIds)
    return { featuredRowProducts: featured, mixedProducts: mixed }
  }, [])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Her slayt tam aynı süre (5 sn) görünsün; slayt değişince yeni süre başlar
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
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  // Öne çıkan ürünler — ItemList schema (ilk 8)
  const featuredItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Öne Çıkan Ürünler — voltekno',
    url: SITE_URL,
    numberOfItems: Math.min(featuredRowProducts.length, 8),
    itemListElement: featuredRowProducts.slice(0, 8).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/products/${p.id}`,
      name: p.name,
    })),
  }

  // Paket kategorileri — ItemList schema
  const packageListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Enerji Paket Kategorileri — voltekno',
    url: `${SITE_URL}/paketler`,
    numberOfItems: 5,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bağ Evi Paketleri', url: `${SITE_URL}/paketler/bag-evi-paketleri` },
      { '@type': 'ListItem', position: 2, name: 'Villa Paketleri', url: `${SITE_URL}/paketler/villa-paketleri` },
      { '@type': 'ListItem', position: 3, name: 'Karavan Paketleri', url: `${SITE_URL}/paketler/karavan-paketleri` },
      { '@type': 'ListItem', position: 4, name: 'Sulama Paketleri', url: `${SITE_URL}/paketler/sulama-paketleri` },
      { '@type': 'ListItem', position: 5, name: 'Marin Paketleri', url: `${SITE_URL}/paketler/marin-paketleri` },
    ],
  }

  return (
    <div className="min-h-full w-full max-w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageListSchema) }} />
      {/* Hero – masaüstünde en büyük blok; mobilde orantılı büyük (aspect yüksek, min-height ile vurgu) */}
      <section className="pt-1 sm:pt-2 md:pt-3 pb-6 sm:pb-10 md:pb-14 px-4 sm:px-6 md:px-8 lg:px-10" aria-label={t('heroTitle2')}>
        <div className="w-full max-w-[1600px] mx-auto min-w-0">
          <div className="relative w-full rounded-xl sm:rounded-2xl md:rounded-3xl bg-slate-900 shadow-xl min-h-[38vh] sm:min-h-0 aspect-[3/2] sm:aspect-[9/4] md:aspect-[5/2] ring-1 ring-slate-200/30 transition-shadow duration-300 hover:shadow-2xl overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src + index}
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
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
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 100vw"
                unoptimized={slide.src.startsWith('http')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target) target.style.display = 'none'
                }}
              />
            </Link>
          </div>
        ))}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-[2]" aria-hidden />
        {/* Slider noktaları – küçük, tıklanabilir */}
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


      {/* Ana kategoriler – masaüstünde herodan küçük; mobilde orantılı küçük (2 sütun, kısa kart) */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in`} aria-labelledby="main-categories-heading">
        <div className={containerClass}>
          <header className="mb-5 sm:mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('categoryDetails')}</span>
            <h2 id="main-categories-heading" className={sectionTitleClass}>
              {t('categoriesTitle')}
            </h2>
            <p className={sectionDescClass}>{t('categoriesDesc')}</p>
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-6 min-w-0">
            {[
              { href: '/category/ev-sarj', tag: t('categoryDetails'), title: t('categoryCharge'), subtitle: t('categoryChargeDesc'), image: '/images/categories/sarj.png', objectPosition: 'center center', icon: Zap },
              { href: '/category/enerji-depolama', tag: t('categoryDetails'), title: t('categoryBattery'), subtitle: t('categoryBatteryDesc'), image: '/images/categories/batarya.png', objectPosition: 'center center', icon: Battery },
              { href: '/category/gunes-enerjisi', tag: t('categoryDetails'), title: t('categorySolar'), subtitle: t('categorySolarDesc'), image: '/images/categories/panel.png', objectPosition: 'center center', icon: Sun },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative block rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 min-w-0 touch-manipulation"
              >
                {/* Görsel alanı: sadece fotoğraf, üzerinde yazı yok */}
                <div className="aspect-[4/3] sm:aspect-[3/2] relative overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  {/* Sadece en altta ince gradient, görseli kapatmıyor */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" aria-hidden />
                </div>
                {/* Başlık ve açıklama görselin dışında, beyaz bölümde */}
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
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-1`} aria-labelledby="featured-products-heading">
        <div className={containerClass}>
          <header className="mb-6 md:mb-8">
            <span className={sectionOverlineClass}>{t('featuredOverline')}</span>
            <h2 id="featured-products-heading" className={sectionTitleClass}>
              {t('pickedForYou')}
            </h2>
            <p className={sectionDescClass}>{t('pickedForYouDesc')}</p>
          </header>
          {featuredRowProducts.length === 0 ? (
            <p className="text-slate-500 py-8">{t('noProductsYet')}</p>
          ) : (
            <div className="overflow-hidden -mx-1 px-1 group/scroll rounded-2xl">
              <div
                className="flex gap-4 sm:gap-5 w-max animate-featured-scroll"
                style={{ width: 'max-content' }}
              >
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

      {/* Ürünlerimiz */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-2`} aria-labelledby="our-products-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('catalogOverline')}</span>
            <h2 id="our-products-heading" className={sectionTitleClass}>
              {t('ourProducts')}
            </h2>
            <p className={sectionDescClass}>{t('catalogDesc')}</p>
          </header>
          {mixedProducts.length === 0 ? (
            <p className="text-slate-500 py-8">{t('noProductsYet')}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 min-w-0">
              {mixedProducts.map((product) => (
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
          <div className="mt-10 md:mt-12 text-center">
            <Button asChild size="lg" className="rounded-xl font-semibold bg-brand hover:bg-brand-hover text-white shadow-sm">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {t('viewAllProducts')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Paket Kategorileri */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in`}>
        <div className={containerClass}>
          <header className="mb-6 sm:mb-8 md:mb-10">
            <span className={sectionOverlineClass}>Paketler</span>
            <h2 className={sectionTitleClass}>İhtiyaca Özel Paketler</h2>
            <p className={sectionDescClass}>Bağ evi, villa, karavan, sulama ve marin kullanım için hazır çözümler.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {PACKAGE_CATEGORIES.map((item) => (
              <Link
                key={item.slug}
                href={`/paketler/${item.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm min-h-[360px] sm:min-h-[420px] bg-slate-900"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/45 to-slate-900/75" />
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <h3 className="text-[clamp(1.7rem,2vw,2.4rem)] font-black leading-[1.02] uppercase text-white tracking-tight">
                    <span className="block text-amber-300">{item.shortTitle}</span>
                    <span className="block">Paketleri</span>
                  </h3>
                  <span className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white text-sm font-bold px-4 py-2 shadow-[0_0_18px_rgba(56,189,248,0.45)]">
                    Hemen İncele
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ayırıcı: Ürünler ile Neden IMORA arası */}
      <div className="w-full border-t border-slate-200/80 bg-slate-100/40" aria-hidden />

      {/* Neden Bizi Tercih Etmelisiniz */}
      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-3 bg-slate-50/60`} aria-labelledby="why-imora-heading">
        <div className={containerClass}>
          <header className="text-center mb-10 md:mb-14">
            <span className={sectionOverlineClass}>{t('whyUs')}</span>
            <h2 id="why-imora-heading" className={`${sectionTitleClass} max-w-2xl mx-auto`}>
              {t('whyIMORA')}
            </h2>
            <p className={`${sectionDescClass} max-w-2xl mx-auto mt-2 text-center`}>
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
                <div
                  key={item.titleKey}
                  className="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
                >
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

      <section className={`${sectionPadding} min-w-0 opacity-0 animate-section-in animate-section-in-delay-2`} aria-labelledby="home-faq-heading">
        <div className={containerClass}>
          <header className="mb-8 md:mb-10">
            <span className={sectionOverlineClass}>{t('faqOverline')}</span>
            <h2 id="home-faq-heading" className={sectionTitleClass}>
              {t('faqTitle')}
            </h2>
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </div>
      </section>

      {/* Sabit iletisim butonu */}
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
