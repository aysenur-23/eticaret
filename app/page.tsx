'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Truck,
  Shield,
  HeadphonesIcon,
  CreditCard,
  ShoppingBag,
  Zap,
  Battery,
  Sun,
  Package,
} from 'lucide-react'
import { ParallaxSection } from '@/components/ParallaxSection'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts } from '@/lib/products-mock'
import { PRODUCT_CATEGORIES } from '@/lib/categories'
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
  for (const list of byCategory.values()) list.sort((a, b) => a.id.localeCompare(b.id))
  const categories = [...byCategory.keys()].sort()

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

  return (
    <div className="min-h-full bg-slate-50 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Hero – mobilde 4:3 oran, masaüstünde geniş; noktalar mobilde büyük */}
      <section className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4" aria-label={t('heroTitle2')}>
        <div className="relative overflow-hidden w-full rounded-xl sm:rounded-2xl bg-slate-900 shadow-lg aspect-[4/3] md:aspect-[2048/820]">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src + index}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
            <Link
              href={slide.href}
              className="absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label={index === 0 ? 'Şarj istasyonlarına git' : index === 1 || index === 3 ? 'Şarj kablolarına git' : 'Tüm ürünlere git'}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                className="object-cover object-center pointer-events-none"
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
        {/* Slider noktaları – mobilde büyük ve kolay tıklanır */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[3] flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slayt ${i + 1}`}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all touch-manipulation min-w-[28px] min-h-[28px] w-2.5 h-2.5 sm:min-w-0 sm:min-h-0 sm:w-2 sm:h-2 flex items-center justify-center p-1 -m-1 sm:p-0 sm:m-0 ${i === currentSlide ? 'bg-white ring-2 ring-white/50 shadow-sm' : 'bg-white/50 hover:bg-white/70 active:bg-white/90'}`}
            />
          ))}
        </div>
        </div>
      </section>

      {/* Ana kategoriler – küçük kartlar, kategori sayfalarında ayrı büyük görseller kullanılır */}
      <section className="py-6 sm:py-8 md:py-10 bg-white border-t border-slate-200 min-w-0" aria-labelledby="main-categories-heading">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-[1440px] min-w-0">
          <h2 id="main-categories-heading" className="sr-only">
            {t('categoryCharge')}, {t('categoryBattery')}, {t('categorySolar')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            {[
              {
                href: '/category/ev-sarj',
                tag: t('categoryDetails'),
                title: t('categoryCharge'),
                subtitle: t('categoryChargeDesc'),
                image: '/images/categories/sarj.png',
                objectPosition: 'center center',
                icon: Zap,
              },
              {
                href: '/category/enerji-depolama',
                tag: t('categoryDetails'),
                title: t('categoryBattery'),
                subtitle: t('categoryBatteryDesc'),
                image: '/images/categories/batarya.png',
                objectPosition: 'center center',
                icon: Battery,
              },
              {
                href: '/category/gunes-enerjisi',
                tag: t('categoryDetails'),
                title: t('categorySolar'),
                subtitle: t('categorySolarDesc'),
                image: '/images/categories/panel.png',
                objectPosition: 'center center',
                icon: Sun,
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative block rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 min-w-0 touch-manipulation"
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={'imageScale' in item ? { transform: `scale(${(item as { imageScale?: number }).imageScale ?? 1})` } : undefined}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={`${'objectFit' in item && (item as any).objectFit === 'contain' ? 'object-contain p-3' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      style={'objectPosition' in item ? { objectPosition: (item as { objectPosition?: string }).objectPosition } : undefined}
                    />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-brand-light transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{item.title}</h3>
                    <p className="text-[11px] text-white line-clamp-1 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{item.subtitle}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between bg-white border-t border-slate-100">
                  <span className="text-slate-500 text-xs font-medium uppercase tracking-tight">Kategoriyi Keşfet</span>
                  <span className="rounded-lg bg-slate-800 group-hover:bg-brand text-white text-xs font-bold px-4 py-2 shrink-0 transition-all duration-300 shadow-sm group-hover:shadow-brand/20">
                    {t('categoryIncele')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler – tek satır (kaydırılabilir) */}
      <section className="py-8 sm:py-10 bg-slate-50 border-t border-slate-200 min-w-0" aria-labelledby="featured-products-heading">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-[1440px] min-w-0">
          <header className="mb-4 md:mb-6">
            <h2 id="featured-products-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('pickedForYou')}
            </h2>
            <p className="text-slate-600 text-sm mt-1">{t('pickedForYouDesc')}</p>
          </header>
          {featuredRowProducts.length === 0 ? (
            <p className="text-slate-500 py-6">{t('noProductsYet')}</p>
          ) : (
            <div className="overflow-hidden -mx-1 px-1 group/scroll">
              <div
                className="flex gap-3 sm:gap-4 w-max animate-featured-scroll"
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

      {/* Ürünlerimiz – karışık ürünler, ~5 satır */}
      <section className="py-10 sm:py-12 md:py-14 bg-white border-t border-slate-200 min-w-0" aria-labelledby="our-products-heading">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-[1440px] min-w-0">
          <header className="mb-6 md:mb-8">
            <h2 id="our-products-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Ürünlerimiz
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">Katalogdan seçilmiş ürünler</p>
          </header>
          {mixedProducts.length === 0 ? (
            <p className="text-slate-500 py-8">{t('noProductsYet')}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 min-w-0">
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
                  isVariantProduct={product.isVariantProduct}
                  variant="compact"
                />
              ))}
            </div>
          )}
          <div className="mt-8 md:mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Tüm Ürünleri Görüntüle
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Neden Bizi Tercih Etmelisiniz */}
      <ParallaxSection className="py-14 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
          <header className="text-center mb-10 md:mb-12 lg:mb-16">
            <span className="block mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">{t('whyUs')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {t('whyRevision')}
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('whyRevisionDesc')}
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { icon: Package, titleKey: 'rightProduct' as const, descKey: 'rightProductDesc' as const },
              { icon: Shield, titleKey: 'reliableQuality' as const, descKey: 'reliableQualityDesc' as const },
              { icon: HeadphonesIcon, titleKey: 'techSupport' as const, descKey: 'techSupportDesc' as const },
              { icon: Truck, titleKey: 'fastDelivery' as const, descKey: 'fastDeliveryDesc' as const },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.titleKey}
                  className="text-center p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-white mb-2">{t(item.titleKey)}</h3>
                  <p className="text-base text-slate-300 leading-relaxed">{t(item.descKey)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </ParallaxSection>

      {/* Sabit iletişim butonu */}
      <Link
        href="/contact"
        className="fixed bottom-safe right-safe z-50 flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-3.5 text-white font-semibold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all duration-200"
        aria-label={t('askUsNow')}
      >
        <HeadphonesIcon className="w-5 h-5 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{t('askUsNow')}</span>
      </Link>
    </div>
  )
}
