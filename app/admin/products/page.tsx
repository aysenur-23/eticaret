'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Package,
  Edit,
  Trash2,
  Search,
  Eye,
  Star,
  Loader2,
  ChevronDown,
  CheckSquare,
  Square,
  Minus,
  TrendingDown,
  PowerOff,
  RefreshCw,
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

type BulkAction = 'feature' | 'unfeature' | 'apply_discount' | 'reset_stock' | 'set_stock'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductFromApi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [discountInput, setDiscountInput] = useState('')
  const [stockInput, setStockInput] = useState('')
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  const loadProducts = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/catalog', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : [])
      .then((data: ProductFromApi[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[]
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[]

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    const matchBrand = brandFilter === 'all' || p.brand === brandFilter
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchStock = stockFilter === 'all' ? true : stockFilter === 'instock' ? p.stock > 0 : p.stock === 0
    return matchSearch && matchBrand && matchCategory && matchStock
  })

  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id))

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => { const n = new Set(prev); filtered.forEach((p) => n.delete(p.id)); return n })
    } else {
      setSelectedIds((prev) => { const n = new Set(prev); filtered.forEach((p) => n.add(p.id)); return n })
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const executeBulk = async (action: BulkAction, value?: number) => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      const res = await fetch('/api/admin/catalog/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: Array.from(selectedIds), action, value }),
      })
      const json = await res.json()
      if (res.ok) {
        showToast(`${json.affected} ürün güncellendi.`)
        clearSelection()
        setDiscountInput('')
        setStockInput('')
        loadProducts()
      } else {
        showToast(json.error || 'İşlem başarısız.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası.', 'error')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleToggleFeatured = async (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/catalog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !p.featured }),
      })
      if (res.ok) setProducts((prev) => prev.map((x) => x.id === id ? { ...x, featured: !x.featured } : x))
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

  const activeFilterCount = (brandFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0) + (stockFilter !== 'all' ? 1 : 0)

  return (
    <div className="space-y-5">
      {/* Toast bildirimi */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-xl border ${toastMsg.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
          {toastMsg.type === 'success' ? '✓' : '✗'} {toastMsg.text}
        </div>
      )}

      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ürün Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} ürün · {filtered.length} filtrelenmiş</p>
        </div>
        <Link href="/admin/katalog">
          <Button size="sm" className="gap-2 bg-brand hover:bg-brand-hover text-white">
            <Edit className="w-4 h-4" />
            Yeni Ürün Ekle
          </Button>
        </Link>
      </div>

      {/* Filtre Satırı */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Ad, marka, SKU, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-slate-200"
            />
          </div>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-slate-500 gap-1.5 shrink-0"
              onClick={() => { setBrandFilter('all'); setCategoryFilter('all'); setStockFilter('all') }}>
              <X className="w-3.5 h-3.5" />
              Temizle
              <span className="ml-0.5 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Marka filtresi */}
          <div className="relative">
            <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
              className={`h-8 pl-3 pr-7 text-xs rounded-lg border appearance-none cursor-pointer focus:outline-none ${brandFilter !== 'all' ? 'border-brand bg-blue-50 text-brand font-semibold' : 'border-slate-200 bg-white text-slate-600'}`}>
              <option value="all">Tüm Markalar</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
          {/* Kategori filtresi */}
          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className={`h-8 pl-3 pr-7 text-xs rounded-lg border appearance-none cursor-pointer focus:outline-none ${categoryFilter !== 'all' ? 'border-brand bg-blue-50 text-brand font-semibold' : 'border-slate-200 bg-white text-slate-600'}`}>
              <option value="all">Tüm Kategoriler</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
          {/* Stok filtresi */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs h-8">
            {(['all', 'instock', 'outofstock'] as const).map((v) => (
              <button key={v} onClick={() => setStockFilter(v)}
                className={`px-3 transition-colors ${stockFilter === v ? 'bg-brand text-white font-semibold' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {v === 'all' ? 'Tüm Stok' : v === 'instock' ? '✓ Stokta' : '✗ Stoksuz'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toplu İşlem Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <CheckSquare className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-brand">{selectedIds.size} ürün seçildi</span>
          </div>
          <div className="h-4 w-px bg-brand/20 hidden sm:block" />
          <Button size="sm" variant="outline" disabled={bulkLoading}
            className="h-8 gap-1.5 text-xs border-brand/30 text-brand hover:bg-brand hover:text-white transition-colors"
            onClick={() => executeBulk('feature')}>
            <Star className="w-3.5 h-3.5" /> Öne Çıkar
          </Button>
          <Button size="sm" variant="outline" disabled={bulkLoading}
            className="h-8 gap-1.5 text-xs border-slate-300 text-slate-600 hover:bg-slate-100"
            onClick={() => executeBulk('unfeature')}>
            <Star className="w-3.5 h-3.5" /> Öne Çıkarmayı Kaldır
          </Button>
          {/* İndirim */}
          <div className="flex items-center gap-1">
            <Input type="number" min="1" max="99" placeholder="%" value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="h-8 w-16 text-xs text-center border-slate-300 px-1" />
            <Button size="sm" variant="outline" disabled={bulkLoading || !discountInput}
              className="h-8 gap-1 text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => { const v = parseFloat(discountInput); if (v > 0 && v < 100) executeBulk('apply_discount', v) }}>
              <TrendingDown className="w-3.5 h-3.5" /> İndirim Uygula
            </Button>
          </div>
          {/* Stok ayarla */}
          <div className="flex items-center gap-1">
            <Input type="number" min="0" placeholder="Stok" value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="h-8 w-16 text-xs text-center border-slate-300 px-1" />
            <Button size="sm" variant="outline" disabled={bulkLoading || stockInput === ''}
              className="h-8 gap-1 text-xs border-teal-300 text-teal-700 hover:bg-teal-50"
              onClick={() => { const v = parseInt(stockInput); if (!isNaN(v) && v >= 0) executeBulk('set_stock', v) }}>
              <RefreshCw className="w-3.5 h-3.5" /> Stok Ayarla
            </Button>
          </div>
          <Button size="sm" variant="outline" disabled={bulkLoading}
            className="h-8 gap-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => executeBulk('reset_stock')}>
            <PowerOff className="w-3.5 h-3.5" /> Stok Sıfırla
          </Button>
          {bulkLoading && <Loader2 className="w-4 h-4 animate-spin text-brand" />}
          <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-500 ml-auto" onClick={clearSelection}>
            <X className="w-3.5 h-3.5 mr-1" /> İptal
          </Button>
        </div>
      )}

      {/* Tablo */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Package className="w-14 h-14 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Ürün bulunamadı</p>
          <p className="text-sm text-slate-400 mt-1">Filtre veya arama kriterini değiştirin.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="w-10 px-4 py-3">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-brand transition-colors flex items-center">
                      {allFilteredSelected
                        ? <CheckSquare className="w-4 h-4 text-brand" />
                        : filtered.some((p) => selectedIds.has(p.id))
                        ? <Minus className="w-4 h-4" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ürün</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Marka / Kategori</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stok</th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">★</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const isSelected = selectedIds.has(product.id)
                  const isUpdating = updatingId === product.id
                  const isDeleting = deletingId === product.id
                  return (
                    <tr key={product.id}
                      className={`transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/40'}`}>
                      <td className="w-10 px-4 py-2.5">
                        <button onClick={() => toggleOne(product.id)} className="flex items-center text-slate-300 hover:text-brand transition-colors">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-brand" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt={product.name}
                              className="w-10 h-10 object-contain rounded-lg border border-slate-100 shrink-0 bg-white" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-slate-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate max-w-[180px] xl:max-w-[260px] leading-tight">{product.name}</p>
                            {product.sku && <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 hidden md:table-cell">
                        <div className="space-y-0.5">
                          {product.brand && (
                            <Badge variant="outline" className="text-[11px] font-medium border-slate-200 text-slate-600 block w-fit">{product.brand}</Badge>
                          )}
                          {product.category && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{product.category}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap text-sm">
                        {fmtTRY(product.price)}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-semibold ${
                          product.stock === 0
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : product.stock < 5
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center hidden lg:table-cell">
                        <button onClick={() => handleToggleFeatured(product.id)} disabled={isUpdating}
                          className="disabled:opacity-40 hover:scale-110 transition-transform" title={product.featured ? 'Öne çıkarı kaldır' : 'Öne çıkar'}>
                          {isUpdating
                            ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            : <Star className={`w-4 h-4 ${product.featured ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <Link href={`/products/${product.id}`} target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/5 transition-colors" title="Sitede Gör">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/admin/katalog?id=${product.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/5 transition-colors" title="Düzenle">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} disabled={isDeleting}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40" title="Sil">
                            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-400 flex items-center justify-between">
            <span>{filtered.length} / {products.length} ürün gösteriliyor</span>
            {selectedIds.size > 0 && (
              <span className="font-semibold text-brand">{selectedIds.size} ürün seçildi</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
