'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Filter, ChevronLeft, ChevronRight, Search, Menu } from 'lucide-react'
import { fmtPrice } from '@/lib/format'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { mockProducts } from '@/lib/products-mock'
import { ProductCard } from '@/components/ProductCard'
import { CATEGORY_GROUPS, getGroupIdForCategory, getCategoryValuesByGroupId } from '@/lib/categories'
import { productMatchesQuery } from '@/lib/search-product'
import { ProductPageShell } from '@/components/ProductPageShell'

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'

const ALL_OPTION = { id: null as string | null, labelKey: 'all' as const }

/** Tüm alt kategori değerleri (product.category ile eşleşen) – URL'de tam değer kullanıldığında filtre için */
const ALL_CATEGORY_VALUES = new Set(CATEGORY_GROUPS.flatMap((g) => g.categoryValues as string[]))

function isGroupId(cat: string) {
  return CATEGORY_GROUPS.some((g) => g.id === cat)
}

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const formatPrice = (amount: number) => fmtPrice(amount, currency, rates?.rates ?? null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  /** Grup id (ev-sarj, gunes-enerjisi) veya tam alt kategori değeri (Güneş Panelleri); null = tümü */
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const brands = useMemo(
    () =>
      Array.from(new Set(mockProducts.map((p) => p.brand).filter(Boolean))).sort((a, b) =>
        (a || '').localeCompare(b || '', 'tr')
      ) as string[],
    []
  )

  // Calculate min and max prices from products
  const minPrice = Math.min(...mockProducts.map(p => p.price))
  const maxPrice = Math.max(...mockProducts.map(p => p.price))
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [minInput, setMinInput] = useState<string>(minPrice.toString())
  const [maxInput, setMaxInput] = useState<string>(maxPrice.toString())

  const itemsPerPage = 24

  const buildProductsUrl = (opts: { category?: string | null; q?: string; brand?: string | null }) => {
    const params = new URLSearchParams()
    if (opts.category) params.set('category', opts.category)
    if (opts.q?.trim()) params.set('q', opts.q.trim())
    if (opts.brand) params.set('brand', opts.brand)
    return `/products${params.toString() ? `?${params.toString()}` : ''}`
  }

  // Update inputs when slider changes
  useEffect(() => {
    setMinInput(priceRange[0].toString())
    setMaxInput(priceRange[1].toString())
  }, [priceRange])

  // URL'den kategori: grup id (ana kategori) veya tam alt kategori değeri (alt kategori)
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    let value: string | null = null
    if (categoryParam) {
      if (isGroupId(categoryParam)) {
        value = categoryParam
      } else if (ALL_CATEGORY_VALUES.has(categoryParam)) {
        value = categoryParam
      } else {
        const groupId = getGroupIdForCategory(categoryParam)
        if (groupId) value = groupId
      }
    }
    setSelectedCategory(value)
    const q = searchParams.get('q')
    setSearchQuery(q ?? '')
    const brandParam = searchParams.get('brand')
    setSelectedBrand(brandParam ?? null)
  }, [searchParams])

  let filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = productMatchesQuery(product, searchQuery.trim())
    let matchesCategory: boolean
    if (!selectedCategory) {
      matchesCategory = true
    } else if (isGroupId(selectedCategory)) {
      const groupValues = getCategoryValuesByGroupId(selectedCategory)
      matchesCategory = groupValues.includes(product.category)
    } else {
      matchesCategory = product.category === selectedCategory
    }
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    return matchesSearch && matchesCategory && matchesPrice && matchesBrand
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name, 'tr')
      case 'name-desc':
        return b.name.localeCompare(a.name, 'tr')
      case 'newest':
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <ProductPageShell
      breadcrumbs={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
            <Link href="/" className="hover:text-slate-900 transition-colors shrink-0">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate">Tüm Ürünler</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] h-11 rounded-lg border-slate-200 gap-2 touch-manipulation lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="w-4 h-4" />
              Filtreler
            </Button>
            <span className="text-sm text-slate-600 font-medium">{filteredProducts.length} ürün</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="min-h-[44px] h-11 w-[180px] max-w-full bg-white border-slate-200 text-slate-800 text-sm rounded-lg touch-manipulation">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl border-slate-200 bg-white">
                <SelectItem value="newest" className="text-sm">En Yeni</SelectItem>
                <SelectItem value="price-asc" className="text-sm">Fiyat: Düşük → Yüksek</SelectItem>
                <SelectItem value="price-desc" className="text-sm">Fiyat: Yüksek → Düşük</SelectItem>
                <SelectItem value="name-asc" className="text-sm">İsim A-Z</SelectItem>
                <SelectItem value="name-desc" className="text-sm">İsim Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      <div className="min-w-0">
        {/* Açılır filtre paneli – varsayılan kapalı */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-[85vw] sm:max-w-md overflow-y-auto min-w-0" onOpenAutoFocus={(e) => e.preventDefault()}>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                Kategoriler & Filtreler
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Arama */}
              <form
                className="flex gap-2 min-w-0"
                onSubmit={(e) => {
                  e.preventDefault()
                  router.push(buildProductsUrl({ category: selectedCategory, q: searchQuery, brand: selectedBrand }))
                  setCurrentPage(1)
                }}
              >
                <Input
                  type="search"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 max-w-full h-10 rounded-lg border-slate-200 bg-slate-50 text-sm"
                  autoComplete="off"
                />
                <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-lg bg-slate-800 hover:bg-slate-700" aria-label="Ara">
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </form>

              {/* Kategoriler */}
              <nav aria-label="Kategoriler">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Kategori</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={buildProductsUrl({ category: null, q: searchQuery, brand: selectedBrand })}
                      onClick={() => {
                        setSelectedCategory(null)
                        setFilterOpen(false)
                      }}
                      className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <span>{tCommon('all')}</span>
                      {!selectedCategory && <ChevronRight className="w-4 h-4 shrink-0" />}
                    </Link>
                  </li>
                  {CATEGORY_GROUPS.map((group) => {
                    const isGroupSelected = selectedCategory === group.id
                    const isSubOfGroupSelected =
                      selectedCategory != null &&
                      !isGroupId(selectedCategory) &&
                      (group.categoryValues as readonly string[]).includes(selectedCategory)
                    const isSelected = isGroupSelected || isSubOfGroupSelected
                    const label = tHeader(group.labelKey)
                    const subCategories = group.categoryValues as readonly string[]

                    return (
                      <li key={group.id} className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Link
                            href={buildProductsUrl({ category: group.id, q: searchQuery, brand: selectedBrand })}
                            onClick={() => {
                              setSelectedCategory(group.id)
                              setFilterOpen(false)
                            }}
                            className={`flex-1 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                          >
                            <span className="truncate">{label}</span>
                            {isSelected && <ChevronRight className="w-4 h-4 shrink-0" />}
                          </Link>
                        </div>

                        {/* Alt kategoriler: ana kategori veya bu gruba ait alt kategori seçiliyken açık */}
                        {isSelected && (
                          <ul className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-2 py-1 animate-in slide-in-from-top-2 duration-200">
                            {subCategories.map((subVal) => {
                              const isSubSelected = selectedCategory === subVal

                              return (
                                <li key={subVal}>
                                  <Link
                                    href={buildProductsUrl({
                                      category: subVal,
                                      q: searchQuery,
                                      brand: selectedBrand,
                                    })}
                                    onClick={() => {
                                      setSelectedCategory(subVal)
                                      setFilterOpen(false)
                                    }}
                                    className={`block px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isSubSelected ? 'text-brand bg-brand-light/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                  >
                                    {subVal}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* ... Brand section (no changes needed) ... */}
            </div>
          </SheetContent>
        </Sheet>

        <main className="min-w-0 overflow-x-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6 grid-products-mobile">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                oldPrice={product.oldPrice}
                discount={product.discount}
                badges={product.tags}
                sku={product.sku}
                rating={product.rating}
                isVariantProduct={product.isVariantProduct}
                variant="full"
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-transparent opacity-50" />
              <div className="relative z-10 max-w-sm mx-auto">
                <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Search className="w-10 h-10 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ürün Bulunamadı</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Aradığınız kriterlere uygun ürün bulamadık. Lütfen farklı anahtar kelimeler deneyin veya filtreleri temizleyin.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                    setSelectedBrand(null)
                    setPriceRange([minPrice, maxPrice])
                    router.push('/products')
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8"
                >
                  Tüm Filtreleri Temizle
                </Button>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 md:mt-10 flex-wrap py-6">
              <Button variant="outline" size="sm" className="rounded-lg border-slate-300 min-h-[44px] min-w-[44px] touch-manipulation text-slate-700 hover:bg-slate-50" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} aria-label="Önceki sayfa">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="min-h-[44px] px-3 flex items-center justify-center text-sm font-medium text-slate-600 md:sr-only">
                Sayfa {currentPage} / {totalPages}
              </span>
              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" className={`min-h-[44px] min-w-[44px] rounded-lg touch-manipulation ${currentPage === page ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-slate-300 min-h-[44px] min-w-[44px] touch-manipulation text-slate-700 hover:bg-slate-50" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} aria-label="Sonraki sayfa">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>

      </div>
    </ProductPageShell>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-ink-muted">Yükleniyor...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}
