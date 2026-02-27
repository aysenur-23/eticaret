'use client'

import React, { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Package, SlidersHorizontal, Filter, Menu } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { mockProducts } from '@/lib/products-mock'
import { getCategoryValuesByGroupId } from '@/lib/categories'
import { CATEGORY_META } from '@/app/category/[id]/category-meta'
import { ProductPageShell } from '@/components/ProductPageShell'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

export function CategoryPageClient({ id: groupId }: { id: string }) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const meta = CATEGORY_META[groupId]
  const categoryValues = useMemo(() => getCategoryValuesByGroupId(groupId), [groupId])

  const subcategories = useMemo(
    () => categoryValues.filter((v) => mockProducts.some((p) => p.category === v)),
    [categoryValues]
  )

  const brands = useMemo(() => {
    const set = new Set(
      mockProducts
        .filter((p) => categoryValues.includes(p.category) && p.brand)
        .map((p) => p.brand as string)
    )
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'))
  }, [categoryValues])

  const products = useMemo(() => {
    let list = mockProducts.filter((p) => {
      const catOk = selectedSub ? p.category === selectedSub : categoryValues.includes(p.category)
      const brandOk = !selectedBrand || p.brand === selectedBrand
      return catOk && brandOk
    })
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sortBy === 'name-asc')
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    return list
  }, [categoryValues, selectedBrand, selectedSub, sortBy])

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Kategori bulunamadı</h1>
          <Link href="/products" className="text-brand hover:underline text-sm">
            Tüm ürünlere dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProductPageShell
      hero={
        <div className="relative h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden w-full">
          {/* Arka plan: görselin arkası siyah */}
          <div className="absolute inset-0 bg-black" />
          {/* Görsel yukarı ve aşağıdan görünebildiği kadar: object-contain, dikeyde tam görünür */}
          <div className="absolute inset-0 flex items-center justify-center p-0">
            <Image
              src={meta.image}
              alt={meta.title}
              fill
              className="object-contain"
              style={{ objectPosition: meta.imagePosition ?? 'center center' }}
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold mb-2 tracking-tight leading-tight">
              {meta.title}
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-lg leading-relaxed font-light">
              {meta.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15">
                <Package className="w-3.5 h-3.5" />
                {products.length} ürün
              </span>
            </div>
          </div>
        </div>
      }
      breadcrumbs={
        <nav className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">Ürünler</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">{meta.title}</span>
        </nav>
      }
    >
      <div className="min-w-0">
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-[85vw] sm:max-w-md overflow-y-auto min-w-0">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                Filtreler
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {subcategories.length > 0 && (
                <nav aria-label="Kategori filtresi">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Kategori</h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => { setSelectedSub(null); setFilterOpen(false) }}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${!selectedSub ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span>Tümü</span>
                        {!selectedSub && <ChevronRight className="w-4 h-4 shrink-0" />}
                      </button>
                    </li>
                    {subcategories.map((sub) => {
                      const isSelected = selectedSub === sub
                      return (
                        <li key={sub}>
                          <button
                            type="button"
                            onClick={() => { setSelectedSub(isSelected ? null : sub); setFilterOpen(false) }}
                            className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                          >
                            <span className="truncate text-left">{sub}</span>
                            {isSelected && <ChevronRight className="w-4 h-4 shrink-0" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              )}
              {brands.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Marka</h3>
                  <ul className="space-y-0.5">
                    <li>
                      <button
                        type="button"
                        onClick={() => { setSelectedBrand(null); setFilterOpen(false) }}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${!selectedBrand ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span>Tümü</span>
                        {!selectedBrand && <ChevronRight className="w-4 h-4 shrink-0" />}
                      </button>
                    </li>
                    {brands.map((brand) => {
                      const isSelected = selectedBrand === brand
                      return (
                        <li key={brand}>
                          <button
                            type="button"
                            onClick={() => { setSelectedBrand(isSelected ? null : brand); setFilterOpen(false) }}
                            className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                          >
                            <span className="truncate text-left">{brand}</span>
                            {isSelected && <ChevronRight className="w-4 h-4 shrink-0" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap border-b border-slate-200 pb-5">
          <p className="text-slate-500 text-sm">
            <span className="font-semibold text-slate-900">{products.length}</span> ürün listeleniyor
          </p>
          <div className="flex items-center gap-2.5">
            <Button type="button" variant="outline" size="sm" className="min-h-[44px] h-11 rounded-lg border-slate-200 gap-2 touch-manipulation lg:hidden" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4" />
              Filtreler
            </Button>
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            {brands.length > 1 && (
              <Select value={selectedBrand ?? 'all'} onValueChange={(v) => setSelectedBrand(v === 'all' ? null : v)}>
                <SelectTrigger className="w-[148px] min-h-[44px] h-11 text-sm border-slate-200 bg-white touch-manipulation">
                  <SelectValue placeholder="Marka" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Markalar</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[178px] min-h-[44px] h-11 text-sm border-slate-200 bg-white touch-manipulation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">En Yeni</SelectItem>
                <SelectItem value="price-asc">Fiyat: Düşük → Yüksek</SelectItem>
                <SelectItem value="price-desc">Fiyat: Yüksek → Düşük</SelectItem>
                <SelectItem value="name-asc">İsim: A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">Bu kategoride ürün bulunamadı.</p>
            <Link href="/products" className="mt-4 inline-block text-brand hover:underline text-sm font-medium">
              Tüm ürünlere dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ id: product.id, name: product.name, description: product.description, price: product.price, image: product.image, category: product.category, brand: product.brand }}
                sku={product.sku}
                badges={product.tags}
                isVariantProduct={product.isVariantProduct}
              />
            ))}
          </div>
        )}
      </div>
    </ProductPageShell>
  )
}
