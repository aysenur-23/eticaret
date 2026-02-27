'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeft,
} from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type ProductFromApi = {
  id: string
  name: string
  slug: string
  description?: string | null
  active: boolean
  isFeatured: boolean
  category?: { id: string; name: string } | null
  variants?: Array<{ id: string; price: number; stock?: { onHand: number } | null }>
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductFromApi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    // Statik hosting: mock ürün listesinden oku (API yok)
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      return
    }
    import('@/lib/products-mock').then(({ mockProducts }) => {
      const mapped: ProductFromApi[] = mockProducts.map((p: any) => ({
        id: p.id || p.slug,
        name: p.name,
        slug: p.slug || p.id,
        description: p.description || null,
        active: true,
        isFeatured: p.isFeatured || false,
        category: p.category ? { id: p.category, name: p.category } : null,
        variants: p.price ? [{ id: 'v1', price: p.price, stock: { onHand: p.stock ?? 100 } }] : [],
      }))
      setProducts(mapped)
      setLoading(false)
    }).catch(() => {
      setProducts([])
      setLoading(false)
    })
  }, [router])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const minPrice = (p: ProductFromApi) => {
    if (!p.variants?.length) return null
    return Math.min(...p.variants.map((v) => v.price))
  }

  const totalStock = (p: ProductFromApi) => {
    if (!p.variants?.length) return 0
    return p.variants.reduce((sum, v) => sum + (v.stock?.onHand ?? 0), 0)
  }

  const handleToggleActive = async (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setUpdatingId(id)
    try {
      // Statik hosting: Firestore productOverrides koleksiyonuna yaz
      const { doc, setDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await setDoc(doc(db, 'productOverrides', id), { active: !p.active }, { merge: true })
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleToggleFeatured = async (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setUpdatingId(id)
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await setDoc(doc(db, 'productOverrides', id), { isFeatured: !p.isFeatured }, { merge: true })
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, isFeatured: !x.isFeatured } : x)))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    setDeletingId(id)
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await setDoc(doc(db, 'productOverrides', id), { deleted: true }, { merge: true })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ürünler</h1>
        <p className="text-slate-600 mt-1">Ürünleri listele ve yönet</p>
      </div>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
              <Input
                type="text"
                placeholder="Ürün ara (ad, açıklama, slug)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 min-w-0 border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const price = minPrice(product)
              const stock = totalStock(product)
              const isUpdating = updatingId === product.id
              const isDeleting = deletingId === product.id
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                          {product.isFeatured && (
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {product.description || product.slug || '—'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.category && (
                        <Badge variant="secondary">{product.category.name}</Badge>
                      )}
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                      <Badge variant="outline">
                        {product.variants?.length ?? 0} varyant, stok: {stock}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      {price != null ? (
                        <> {fmtTRY(price)} {product.variants && product.variants.length > 1 && <span className="text-sm font-normal text-gray-500">’den itibaren</span>}</>
                      ) : (
                        '—'
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${product.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Görüntüle
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(product.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Star
                            className={`w-4 h-4 ${product.isFeatured ? 'fill-yellow-500 text-yellow-500' : ''}`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(product.id)}
                        disabled={isUpdating}
                      >
                        {product.active ? 'Pasif Yap' : 'Aktif Yap'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600">
              {products.length === 0
                ? 'Henüz ürün yok. Ürün eklemek için Katalog sayfasını kullanabilirsiniz.'
                : 'Arama kriterine uygun ürün yok.'}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/urunler">Stok yönetimine git</Link>
            </Button>
          </div>
        )}
    </div>
  )
}
