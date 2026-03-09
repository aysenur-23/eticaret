'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockProducts } from '@/lib/products-mock'
import { Package, Search, Save, Loader2, AlertTriangle } from 'lucide-react'

const LOW_STOCK_THRESHOLD = 5

export default function AdminUrunlerPage() {
  const router = useRouter()
  const [overrides, setOverrides] = useState<Record<string, number>>({})
  const [editing, setEditing] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Statik hosting: Firestore'dan stok override oku (API yok)
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      return
    }
    (async () => {
      try {
        const { collection: col, getDocs } = await import('firebase/firestore')
        const { getDb } = await import('@/lib/firebase/config')
        const db = getDb()
        const snap = await getDocs(col(db, 'stockOverrides'))
        const map: Record<string, number> = {}
        snap.docs.forEach((d) => {
          const data = d.data()
          map[d.id] = data.stock ?? 0
        })
        setOverrides(map)
        setEditing({ ...map })
      } catch {
        setOverrides({})
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const handleSaveStock = async (productId: string) => {
    const value = editing[productId] ?? overrides[productId] ?? 0
    setSavingId(productId)
    try {
      const stockVal = Math.max(0, Math.floor(Number(value) || 0))
      const { doc, setDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await setDoc(doc(db, 'stockOverrides', productId), { productId, stock: stockVal }, { merge: true })
      setOverrides((prev) => ({ ...prev, [productId]: stockVal }))
      setEditing((prev) => ({ ...prev, [productId]: stockVal }))
    } finally {
      setSavingId(null)
    }
  }

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockProducts = mockProducts.filter((p) => {
    const effectiveStock = overrides[p.id] ?? p.stock
    return effectiveStock <= LOW_STOCK_THRESHOLD
  })

  return (
    <div className="space-y-6 pb-safe" id="main-content">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stok Yönetimi</h1>
          <p className="text-slate-600 mt-1">Site ürünlerinin stok adetlerini güncelleyin</p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline" size="sm">Ürünler</Button>
        </Link>
      </div>

      {/* Düşük stok uyarısı */}
      {!loading && lowStockProducts.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-semibold text-amber-800 text-sm">
              {lowStockProducts.length} ürünün stoğu kritik seviyede (≤{LOW_STOCK_THRESHOLD} adet)
            </span>
          </div>
          <ul className="space-y-1">
            {lowStockProducts.slice(0, 5).map((p) => {
              const stock = overrides[p.id] ?? p.stock
              return (
                <li key={p.id} className="text-xs text-amber-700 flex items-center gap-2">
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-semibold">
                    {stock === 0 ? 'TÜKENDI' : stock}
                  </span>
                  {p.name}
                </li>
              )
            })}
            {lowStockProducts.length > 5 && (
              <li className="text-xs text-amber-600">...ve {lowStockProducts.length - 5} ürün daha</li>
            )}
          </ul>
        </div>
      )}

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted z-10 pointer-events-none shrink-0" />
                <Input
                  placeholder="Ürün ara (isim veya ID)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 min-w-0 border-palette"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-palette">
                      <th className="text-left py-3 px-2 font-semibold text-ink">Ürün ID</th>
                      <th className="text-left py-3 px-2 font-semibold text-ink">Ürün Adı</th>
                      <th className="text-left py-3 px-2 font-semibold text-ink">Mevcut stok (sitede)</th>
                      <th className="text-left py-3 px-2 font-semibold text-ink">Yeni stok</th>
                      <th className="text-left py-3 px-2 font-semibold text-ink w-24">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const currentStock = overrides[product.id] ?? product.stock
                      const editValue = editing[product.id] ?? currentStock
                      const isOutOfStock = currentStock === 0
                      const isLowStock = currentStock > 0 && currentStock <= LOW_STOCK_THRESHOLD
                      return (
                        <tr key={product.id} className={`border-b border-palette/70 hover:bg-muted/50 ${isOutOfStock ? 'bg-red-50/40' : isLowStock ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-3 px-2 font-mono text-xs text-ink-muted">{product.id}</td>
                          <td className="py-3 px-2 font-medium text-ink">
                            {product.name}
                            {isOutOfStock && (
                              <span className="ml-2 text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">TÜKENDI</span>
                            )}
                            {isLowStock && (
                              <span className="ml-2 text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">DÜŞÜK STOK</span>
                            )}
                          </td>
                          <td className={`py-3 px-2 font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-ink-muted'}`}>
                            {currentStock} {overrides[product.id] !== undefined ? '(güncellendi)' : '(varsayılan)'}
                          </td>
                          <td className="py-3 px-2">
                            <Input
                              type="number"
                              min={0}
                              value={editValue}
                              onChange={(e) =>
                                setEditing((prev) => ({ ...prev, [product.id]: parseInt(e.target.value, 10) || 0 }))
                              }
                              className="w-24 border-palette"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveStock(product.id)}
                              disabled={savingId === product.id}
                              className="bg-brand hover:bg-brand-hover"
                            >
                              {savingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-1" />
                                  Kaydet
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-ink-muted mt-4">
              Bu sayfa sitede görünen ürünlerin (ürün listesi / ana sayfa) stok bilgisini günceller. Kaydettiğiniz stok
              değeri sitede anında yansır.
            </p>
          </CardContent>
        </Card>
    </div>
  )
}
