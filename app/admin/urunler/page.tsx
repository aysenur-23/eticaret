'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockProducts } from '@/lib/products-mock'
import { Package, Search, ArrowLeft, Save, Loader2 } from 'lucide-react'

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

  return (
    <div className="space-y-8 pb-safe" id="main-content">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stok Yönetimi</h1>
          <p className="text-slate-600 mt-1">Site ürünlerinin stok adetlerini güncelleyin</p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline" size="sm">Ürünler</Button>
        </Link>
      </div>

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
                      return (
                        <tr key={product.id} className="border-b border-palette/70 hover:bg-muted/50">
                          <td className="py-3 px-2 font-mono text-xs text-ink-muted">{product.id}</td>
                          <td className="py-3 px-2 font-medium text-ink">{product.name}</td>
                          <td className="py-3 px-2 text-ink-muted">{product.stock} (varsayılan)</td>
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
