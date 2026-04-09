'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Package,
  Edit,
  Trash2,
  Search,
  Eye,
  Star,
  Loader2,
  CheckSquare,
  Square,
  Minus,
  ChevronDown,
  Tag,
  PowerOff,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type ProductFromApi = {
  id: string
  name: string
  sku?: string
  description?: string | null
  featured: boolean
  category?: string | null
  price: number
  stock: number
  brand?: string | null
  image?: string | null
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductFromApi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>('')

  const loadProducts = () => {
    setLoading(true)
    fetch('/api/admin/catalog', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : [])
      .then((data: ProductFromApi[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [router])

  // Unique brands & categories
  const brands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.brand) set.add(p.brand) })
    return Array.from(set).sort()
  }, [products])

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => { if (p.category) set.add(p.category) })
    return Array.from(set).sort()
  }, [products])

  const filteredProducts = useMemo(() =>
    products.filter((p) => {
      const q = searchQuery.toLowerCase()
      const matchQ = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      const matchBrand = !selectedBrand || p.brand === selectedBrand
      const matchCategory = !selectedCategory || p.category === selectedCategory
      return matchQ && matchBrand && matchCategory
    }),
    [products, searchQuery, selectedBrand, selectedCategory]
  )

  // Selection helpers
  const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.has(p.id))
  const someSelected = filteredProducts.some((p) => selectedIds.has(p.id))
  const selectedCount = filteredProducts.filter((p) => selectedIds.has(p.id)).length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filteredProducts.forEach((p) => next.delete(p.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filteredProducts.forEach((p) => next.add(p.id))
        return next
      })
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  // Individual actions
  const handleToggleFeatured = async (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/catalog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
        credentials: 'include',
      })
      if (res.ok) {
        setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, featured: !x.featured } : x)))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünün özelleştirmesini kaldırmak istediğinize emin misiniz?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/catalog/${id}`, { method: 'DELETE', credentials: 'include' })
      loadProducts()
    } finally {
      setDeletingId(null)
    }
  }

  // Bulk actions
  const selectedProductIds = filteredProducts.filter((p) => selectedIds.has(p.id)).map((p) => p.id)

  const executeBulkAction = async (action: string) => {
    if (selectedProductIds.length === 0) return
    setBulkLoading(true)
    try {
      if (action === 'feature') {
        await Promise.all(selectedProductIds.map((id) =>
          fetch(`/api/admin/catalog/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featured: true }),
            credentials: 'include',
          })
        ))
        setProducts((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, featured: true } : p))
      } else if (action === 'unfeature') {
        await Promise.all(selectedProductIds.map((id) =>
          fetch(`/api/admin/catalog/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featured: false }),
            credentials: 'include',
          })
        ))
        setProducts((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, featured: false } : p))
      } else if (action === 'reset_stock') {
        await Promise.all(selectedProductIds.map((id) =>
          fetch(`/api/admin/catalog/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: 0 }),
            credentials: 'include',
          })
        ))
        setProducts((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, stock: 0 } : p))
      } else if (action === 'discount') {
        const pctStr = prompt('İndirim oranı girin (0-99, örn: 10 = %10):')
        if (!pctStr) return
        const pct = parseFloat(pctStr)
        if (isNaN(pct) || pct < 0 || pct >= 100) return
        const factor = 1 - pct / 100
        await Promise.all(
          selectedProductIds.map((id) => {
            const p = products.find((x) => x.id === id)
            if (!p) return Promise.resolve()
            const newPrice = Math.round(p.price * factor)
            return fetch(`/api/admin/catalog/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ price: newPrice }),
              credentials: 'include',
            })
          })
        )
        loadProducts()
      }
      clearSelection()
    } finally {
      setBulkLoading(false)
    }
  }

  const activeFilters = [
    selectedBrand && { label: selectedBrand, clear: () => setSelectedBrand('') },
    selectedCategory && { label: selectedCategory, clear: () => setSelectedCategory('') },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ürün Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} ürün — {filteredProducts.length} gösteriliyor</p>
        </div>
        <Button asChild size="sm" className="bg-brand hover:bg-brand-hover text-white shrink-0">
          <Link href="/admin/katalog">
            <Edit className="w-4 h-4 mr-1.5" />
            Katalog Düzenleme
          </Link>
        </Button>
      </div>

      {/* Filtre ve Arama */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <Input
            type="text"
            placeholder="Ürün adı, SKU, marka ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200 text-sm"
          />
        </div>

        {/* Marka & Kategori Filtreleri */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none h-8 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Aktif filtre etiketleri */}
          {activeFilters.map((f, i) => (
            <button
              key={i}
              onClick={f.clear}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-brand/10 text-brand text-xs font-medium hover:bg-brand/20 transition-colors"
            >
              <Filter className="w-3 h-3" />
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Toplu İşlem Araç Çubuğu */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-brand rounded-xl text-white shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-sm font-semibold mr-1">{selectedCount} ürün seçildi</span>
          <div className="flex-1" />
          <button
            onClick={() => executeBulkAction('discount')}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            İndirim Uygula
          </button>
          <button
            onClick={() => executeBulkAction('feature')}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
          >
            <Star className="w-3.5 h-3.5" />
            Öne Çıkar
          </button>
          <button
            onClick={() => executeBulkAction('unfeature')}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            Pasifleştir
          </button>
          <button
            onClick={() => executeBulkAction('reset_stock')}
            disabled={bulkLoading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Stok Sıfırla
          </button>
          <button
            onClick={clearSelection}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
            aria-label="Seçimi temizle"
          >
            <X className="w-4 h-4" />
          </button>
          {bulkLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
      )}

      {/* Tablo */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 mb-1">Ürün bulunamadı</h3>
          <p className="text-sm text-slate-500">Filtre veya arama kriterini değiştirin.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tablo başlığı */}
          <div className="grid grid-cols-[2.5rem_3rem_1fr_6rem_5rem_6rem_7rem] gap-0 px-4 py-2.5 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <button
              onClick={toggleSelectAll}
              className="flex items-center justify-center"
              aria-label="Tümünü seç"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-brand" />
              ) : someSelected ? (
                <Minus className="w-4 h-4 text-brand" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <span />
            <span>Ürün</span>
            <span className="text-right">Fiyat</span>
            <span className="text-right">Stok</span>
            <span className="text-center">Durum</span>
            <span className="text-right">İşlemler</span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100">
            {filteredProducts.map((product) => {
              const isSelected = selectedIds.has(product.id)
              const isUpdating = updatingId === product.id
              const isDeleting = deletingId === product.id
              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-[2.5rem_3rem_1fr_6rem_5rem_6rem_7rem] gap-0 px-4 py-3 items-center transition-colors ${isSelected ? 'bg-brand/5' : 'hover:bg-slate-50/70'}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(product.id)}
                    className="flex items-center justify-center"
                    aria-label="Seç"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-brand" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>

                  {/* Resim */}
                  <div className="flex items-center justify-center">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-9 h-9 object-contain rounded-md border border-slate-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Ürün bilgisi */}
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-medium text-slate-900 truncate leading-tight">{product.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {[product.brand, product.category].filter(Boolean).join(' · ')}
                      {product.sku ? ` · ${product.sku}` : ''}
                    </p>
                  </div>

                  {/* Fiyat */}
                  <div className="text-right text-sm font-semibold text-slate-900">
                    {fmtTRY(product.price)}
                  </div>

                  {/* Stok */}
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      product.stock === 0
                        ? 'bg-red-50 text-red-600'
                        : product.stock < 5
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {product.stock === 0 ? 'Tükendi' : `${product.stock} adet`}
                    </span>
                  </div>

                  {/* Durum */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleToggleFeatured(product.id)}
                      disabled={isUpdating}
                      title={product.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                        product.featured
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className={`w-3 h-3 ${product.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      )}
                      {product.featured ? 'Öne Çıkan' : 'Normal'}
                    </button>
                  </div>

                  {/* İşlemler */}
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Sitede görüntüle"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/admin/katalog"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Özelleştirmeyi sil"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
