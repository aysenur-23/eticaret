'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, ChevronRight, Minus, Plus, ShoppingCart, Zap, Send } from 'lucide-react'
import { fmtPrice } from '@/lib/format'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/toast'
import { FavoriteButton } from '@/components/FavoriteButton'
import { mockProducts, COMPLEMENTARY_BY_CATEGORY } from '@/lib/products-mock'
import { getCategoryKey, getGroupIdForCategory } from '@/lib/categories'
import { ProductCard } from '@/components/ProductCard'
import { useTranslations } from 'next-intl'
import { ProductPageShell } from '@/components/ProductPageShell'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const mockProductsMap: Record<string, (typeof mockProducts)[number]> = {}
mockProducts.forEach((p) => { mockProductsMap[p.id] = p })

type Props = { initialProduct?: (typeof mockProducts)[number] | null; productId?: string }

export default function ProductDetailClient({ initialProduct, productId: productIdProp }: Props = {}) {
  const params = useParams()
  const productId = (productIdProp ?? params?.id) as string
  const [product, setProduct] = useState<(typeof mockProducts)[number] | null>(initialProduct ?? null)
  const [loading, setLoading] = useState(!initialProduct)
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const formatPrice = (amount: number) => fmtPrice(amount, currency, rates?.rates ?? null)
  const tHeader = useTranslations('header')
  const { addItem } = useCartStore()
  const { addToast } = useToast()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  /** Varyantlı ürünlerde seçilen seçenek (model/kapasite); yoksa ilk varyant veya null */
  const [selectedVariant, setSelectedVariant] = useState<{ key: string; label: string; price: number; sku?: string } | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactFormOpen, setContactFormOpen] = useState(false)

  useEffect(() => {
    if (!productId) return
    const data = mockProductsMap[productId] ?? null
    setProduct(data)
    setSelectedVariant(data?.variants?.[0] ?? null)
    setLoading(false)
  }, [productId])

  const images = product ? (product.images ?? [product.image]).filter(Boolean) as string[] : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  useEffect(() => {
    setSelectedIndex(0)
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Ürün Bulunamadı</h2>
          <p className="text-sm text-slate-500 font-medium">Aradığınız ürün bulunamadı veya kaldırılmış olabilir.</p>
          <Button asChild variant="outline" className="rounded-xl border-slate-200">
            <Link href="/products" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ürünlere Dön
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const categoryKey = product.category ? getCategoryKey(product.category) : undefined
  const categoryLabel = product.category ? (categoryKey ? tHeader(categoryKey) : product.category) : ''
  const mainImage = images[selectedIndex] ?? images[0]

  /** Önerilen ürünler: en az 1 sıra her zaman; önce tamamlayıcı/kategori, yoksa genel öne çıkanlar */
  const recommendedProducts = React.useMemo(() => {
    const complementary = product.category ? COMPLEMENTARY_BY_CATEGORY[product.category] : undefined
    let ids = complementary
      ? complementary.productIds.filter((id) => id !== product.id && mockProductsMap[id])
      : mockProducts
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 8)
          .map((p) => p.id)
    ids = ids.slice(0, 8)
    if (ids.length === 0) {
      ids = mockProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 8)
        .map((p) => p.id)
    }
    return ids
      .map((id) => mockProductsMap[id])
      .filter(Boolean) as (typeof mockProducts)[number][]
  }, [product.id, product.category])

  /** Aynı ürün ailesindeki diğer seçenekler (örn. farklı renk aynı model) */
  const otherOptions = React.useMemo(() => {
    if (!product?.productFamilyKey) return []
    return mockProducts.filter(
      (p) => p.productFamilyKey === product.productFamilyKey && p.id !== product.id
    ) as (typeof mockProducts)[number][]
  }, [product?.id, product?.productFamilyKey])

  return (
    <ProductPageShell
      breadcrumbs={
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-brand transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300" />
          <Link href="/products" className="hover:text-brand transition-colors">Ürünler</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300" />
          <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
        </div>
      }
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
            <div className="space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                {mainImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={mainImage} alt={product.name} className="w-full h-full object-contain scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <Package className="w-20 h-20 text-slate-200" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                        selectedIndex === i ? 'ring-2 ring-brand' : 'ring-1 ring-slate-200/80'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {product.brand && <p className="text-sm font-bold text-brand uppercase tracking-wider">{product.brand}</p>}
                {product.sku && (
                  <span className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1 rounded-lg bg-white">
                    Ürün kodu: {product.sku}
                  </span>
                )}
                <FavoriteButton productId={product.id} className="ml-auto sm:ml-0" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight leading-snug max-w-xl">{product.name}</h1>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Model / Kapasite</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                          selectedVariant?.key === v.key
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block">{v.label}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
              </p>
              <p className="text-sm text-slate-500 mb-6">
                KDV Dahil Fiyatı: {formatPrice((selectedVariant ? selectedVariant.price : product.price) * 1.20)}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 min-w-0">
                <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex items-center justify-center h-12 w-11 text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Miktarı azalt"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex items-center justify-center h-12 w-11 font-semibold text-slate-900 tabular-nums text-sm border-x border-slate-100 bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex items-center justify-center h-12 w-11 text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Miktarı artır"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={() => {
                    const cartId = selectedVariant ? `${product.id}-${selectedVariant.key}` : product.id
                    const displayName = selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name
                    const price = selectedVariant ? selectedVariant.price : product.price
                    addItem({
                      id: cartId,
                      name: displayName,
                      description: product.description,
                      price,
                      image: product.image,
                      category: product.category,
                      quantity,
                    })
                    addToast({ type: 'success', title: 'Sepete Eklendi', description: `${displayName} sepete eklendi.` })
                  }}
                  className="rounded-xl min-h-12 h-auto py-3 px-4 sm:px-5 flex-1 min-w-0 sm:min-w-[140px] bg-brand hover:bg-brand-hover text-white font-semibold text-sm sm:text-base text-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2 shrink-0" />
                  <span className="break-words">Sepete Ekle</span>
                </Button>
                <Button
                  onClick={() => {
                    const cartId = selectedVariant ? `${product.id}-${selectedVariant.key}` : product.id
                    const displayName = selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name
                    const price = selectedVariant ? selectedVariant.price : product.price
                    addItem({
                      id: cartId,
                      name: displayName,
                      description: product.description,
                      price,
                      image: product.image,
                      category: product.category,
                      quantity,
                    })
                    router.push('/cart')
                  }}
                  variant="destructive"
                  className="rounded-xl min-h-12 h-auto py-3 px-4 sm:px-5 flex-1 min-w-0 sm:min-w-[160px] font-semibold text-sm sm:text-base text-center"
                >
                  <Zap className="w-4 h-4 mr-2 shrink-0" />
                  <span className="break-words">Hemen Al</span>
                </Button>
              </div>

              {/* Görselin sağında: Bu ürün size uygun mu? – tıklanınca mini form açılır */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setContactFormOpen((o) => !o)}
                  className="text-sm font-semibold text-brand hover:text-brand/80 transition-colors text-left flex items-center gap-2"
                >
                  Bu ürün size uygun mu?
                  <ChevronRight className={`w-4 h-4 transition-transform ${contactFormOpen ? 'rotate-90' : ''}`} />
                </button>
                <p className="text-slate-600 text-sm mt-1.5">Sizi arayıp ürünün uygunluğu hakkında bilgi verelim.</p>
                {contactFormOpen && (
                  <div className="mt-4">
                    {contactSent ? (
                      <p className="text-sm text-green-600 font-medium py-2">Mesajınız iletildi. En kısa sürede size dönüş yapacağız.</p>
                    ) : (
                      <form
                        className="space-y-2.5"
                        onSubmit={async (e) => {
                          e.preventDefault()
                          if (contactSubmitting || !contactForm.name.trim() || !contactForm.email.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) return
                          setContactSubmitting(true)
                          try {
                            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
                            const { getDb } = await import('@/lib/firebase/config')
                            const db = getDb()
                            await addDoc(collection(db, 'contactMessages'), {
                              name: contactForm.name.trim(),
                              email: contactForm.email.trim(),
                              phone: contactForm.phone.trim(),
                              subject: 'Bu ürün bana uygun mu?',
                              message: `[Ürün: ${product.name}]\n\n${contactForm.message.trim()}`,
                              productId: product.id,
                              createdAt: serverTimestamp(),
                              status: 'new',
                            })
                            setContactSent(true)
                            addToast({ type: 'success', title: 'Gönderildi', description: 'Mesajınız iletildi. En kısa sürede dönüş yapacağız.' })
                          } catch {
                            addToast({ type: 'error', title: 'Hata', description: 'Gönderilemedi. Lütfen tekrar deneyin.' })
                          } finally {
                            setContactSubmitting(false)
                          }
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Ad Soyad *"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm"
                          required
                        />
                        <input
                          type="email"
                          placeholder="E-posta *"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Telefon *"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm"
                          required
                        />
                        <textarea
                          placeholder="Mesajınız *"
                          value={contactForm.message}
                          onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                          className="w-full min-h-[60px] rounded-lg border border-slate-200 px-3 py-2 text-sm resize-y"
                          rows={2}
                          required
                        />
                        <Button type="submit" disabled={contactSubmitting} size="sm" className="w-full rounded-lg h-9 text-sm font-semibold">
                          {contactSubmitting ? 'Gönderiliyor...' : (
                            <>
                              <Send className="w-3.5 h-3.5 mr-1.5" />
                              Gönder
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Bu ürünün diğer seçenekleri (aynı aile: farklı renk/varyant) */}
              {otherOptions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Bu ürünün diğer seçenekleri</h3>
                  <ul className="flex flex-wrap gap-2">
                    {otherOptions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand transition-colors"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Ürün Açıklamaları: sol = teknik tablo, sağ = akordiyon. Varyant seçiliyse o varyantın özellikleri gösterilir. */}
          {(() => {
            const displaySpecs = selectedVariant?.specifications ?? product.specifications
            const hasSpecs = displaySpecs && Object.keys(displaySpecs).length > 0
            return (hasSpecs ||
            product.fullDescription ||
            product.description ||
            (product.features && product.features.length > 0) ||
            (product.descriptionSections && product.descriptionSections.length > 0)) ? (
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Ürün Açıklamaları</h2>
              <div
                className={`grid gap-8 md:gap-10 ${
                  hasSpecs ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* Sol: Teknik veriler tablosu (varyanta göre değişir) */}
                {hasSpecs && (
                  <div className="md:max-w-sm min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Ürün Özellikleri</h3>
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible">
                      <dl className="divide-y divide-slate-100">
                        {Object.entries(displaySpecs).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-x-3 gap-y-1 py-3 px-4 text-sm min-h-[44px] hover:bg-slate-50/80 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            <dt className="text-slate-500 font-medium shrink-0 w-full sm:max-w-[45%] break-words" title={key}>
                              {key}
                            </dt>
                            <dd className="text-slate-900 font-semibold sm:text-right w-full min-w-0 flex-1 break-all break-words" title={String(value)}>
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
                {/* Sağ: En üstte ana paragraf + ürün içeriği (akordiyon değil); altında ek açıklama bölümleri akordiyon */}
                <div className="min-w-0 flex-1 space-y-6">
                  {/* Ana Açıklama – her zaman görünür, akordiyon değil */}
                  {(product.fullDescription || product.description) && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Ana Açıklama</h3>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {product.fullDescription || product.description}
                      </p>
                    </div>
                  )}
                  {/* Ürün İçeriği – her zaman görünür, akordiyon değil */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Ürün İçeriği</h3>
                      <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed space-y-1">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Geri kalan açıklamalar: başlıklara ayrılmış akordiyon bölümleri */}
                  {product.descriptionSections && product.descriptionSections.length > 0 && (
                    <Accordion type="multiple" className="w-full">
                      {product.descriptionSections.map((section, i) => (
                        <AccordionItem key={i} value={`section-${i}`}>
                          <AccordionTrigger>{section.title}</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                              {section.content}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            </div>
          ) : null
          })()}

          {/* Önerilen Ürünler – her ürün sayfasında en az 1 sıra mutlaka gösterilir */}
          <div className="mt-10 pt-8 border-t border-slate-200 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Önerilen Ürünler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 min-w-0">
              {recommendedProducts.map((rec) => (
                  <ProductCard
                    key={rec.id}
                    product={{
                      id: rec.id,
                      name: rec.name,
                      description: rec.description,
                      price: rec.price,
                      image: rec.images?.[0] ?? rec.image,
                      category: rec.category,
                      brand: rec.brand,
                    }}
                    oldPrice={rec.oldPrice}
                    discount={rec.discount}
                    badges={rec.tags}
                    sku={rec.sku}
                    isVariantProduct={rec.isVariantProduct}
                    variant="compact"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </ProductPageShell>
  )
}
