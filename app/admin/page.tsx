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
  ShoppingCart,
  DollarSign,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  ClipboardList,
  ArrowRight,
  PackageCheck,
  Layers,
} from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type OrderRow = {
  id: string
  source: 'firestore'
  orderId: string
  customerName?: string
  customerEmail?: string
  total: number
  status: string
  paymentStatus?: string
  createdAt: string
  userId?: string | null
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede',
  PENDING: 'Beklemede',
  confirmed: 'Onaylandı',
  processing: 'İşleniyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
  PAID: 'Ödendi',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade',
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    // Statik hosting: Firestore'dan siparişleri doğrudan oku (API yok)
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      return
    }
    (async () => {
      try {
        const { collection: col, getDocs, collectionGroup } = await import('firebase/firestore')
        const { getDb } = await import('@/lib/firebase/config')
        const db = getDb()
        const rows: OrderRow[] = []

        // guestOrders koleksiyonu
        const guestSnap = await getDocs(col(db, 'guestOrders'))
        guestSnap.docs.forEach((d) => {
          const o = d.data()
          const customer = o.customer || {}
          const pricing = o.pricing || {}
          const createdAt = o.createdAt as { seconds: number } | null
          rows.push({
            id: d.id,
            source: 'firestore',
            orderId: o.orderId || d.id,
            customerName: customer.name,
            customerEmail: customer.email,
            total: pricing.total ?? 0,
            status: o.status ?? 'pending',
            paymentStatus: o.paymentStatus,
            createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
            userId: null,
          })
        })

        // users koleksiyonundaki tüm kullanıcıların siparişlerini topla
        const usersSnap = await getDocs(col(db, 'users'))
        for (const userDoc of usersSnap.docs) {
          const ordersSnap = await getDocs(col(db, 'users', userDoc.id, 'orders'))
          ordersSnap.docs.forEach((d) => {
            const o = d.data()
            const customer = o.customer || {}
            const pricing = o.pricing || {}
            const createdAt = o.createdAt as { seconds: number } | null
            rows.push({
              id: d.id,
              source: 'firestore',
              orderId: o.orderId || d.id,
              customerName: customer.name,
              customerEmail: customer.email,
              total: pricing.total ?? 0,
              status: o.status ?? 'pending',
              paymentStatus: o.paymentStatus,
              createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
              userId: userDoc.id,
            })
          })
        }

        rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        setOrders(rows)
      } catch (err) {
        console.error('Admin orders load error:', err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter((o) => o.status === 'pending' || o.status === 'PENDING').length,
    paidOrders: orders.filter((o) => o.paymentStatus === 'paid' || o.paymentStatus === 'PAID').length,
  }

  const handleStatusChange = async (row: OrderRow, newStatus: string) => {
    setUpdatingId(row.id)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      if (row.userId) {
        // Kayıtlı kullanıcı siparişi
        await updateDoc(doc(db, 'users', row.userId, 'orders', row.id), { status: newStatus })
      } else {
        // Misafir siparişi
        await updateDoc(doc(db, 'guestOrders', row.id), { status: newStatus })
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === row.id && o.source === row.source
            ? { ...o, status: newStatus }
            : o
        )
      )
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const statusOptions = [
    { value: 'confirmed', label: 'Onayla' },
    { value: 'processing', label: 'İşle' },
    { value: 'shipped', label: 'Kargoya Ver' },
  ]

  const todoItems = [
    {
      label: 'Bekleyen siparişleri onayla',
      href: '/admin/orders',
      count: stats.pendingOrders,
      icon: ClipboardList,
    },
    { label: 'Tüm siparişleri görüntüle', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Ürünleri düzenle', href: '/admin/products', icon: Package },
    { label: 'Stok güncelle', href: '/admin/urunler', icon: Layers },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Özet ve günlük işlemler</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        </div>
      ) : (
        <>
          {/* Yapılacaklar / Admin görevleri */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-red-600" />
                Yapılacaklar
              </CardTitle>
              <CardDescription>Admin olarak öncelikli işlemleriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {todoItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between gap-2 p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-red-50 hover:border-red-200/80 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-800 truncate">{item.label}</span>
                          {'count' in item && (item as any).count > 0 && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {(item as any).count}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-red-600" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Özet kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Toplam Sipariş</CardTitle>
                <ShoppingCart className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stats.totalOrders}</div>
                <p className="text-xs text-slate-500 mt-1">Tüm zamanlar</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Toplam Gelir</CardTitle>
                <DollarSign className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-slate-900">{fmtTRY(stats.totalRevenue)}</div>
                <p className="text-xs text-slate-500 mt-1">KDV dahil</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Bekleyen</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</div>
                <p className="text-xs text-slate-500 mt-1">Onay bekliyor</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Ödenen</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stats.paidOrders}</div>
                <p className="text-xs text-slate-500 mt-1">Ödeme tamamlandı</p>
              </CardContent>
            </Card>
          </div>

          {/* Son siparişler */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">Son Siparişler</CardTitle>
                  <CardDescription className="mt-0.5">{filteredOrders.length} sipariş listeleniyor</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <Link href="/admin/orders" className="inline-flex items-center gap-2">
                    Tüm Siparişler
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                  <Input
                    type="text"
                    placeholder="Sipariş ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 min-w-0 border-slate-200"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto flex-wrap">
                  <Button
                    variant={statusFilter === null ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(null)}
                    size="sm"
                  >
                    Tümü
                  </Button>
                  {['pending', 'PENDING', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                    (s) => (
                      <Button
                        key={s}
                        variant={statusFilter === s ? 'default' : 'outline'}
                        onClick={() => setStatusFilter(s)}
                        size="sm"
                      >
                        {STATUS_LABELS[s] ?? s}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Package className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Sipariş bulunamadı</p>
                    <Button asChild variant="outline" size="sm" className="mt-3">
                      <Link href="/admin/orders">Siparişler sayfasına git</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-slate-50/80">
                        <tr className="border-b border-slate-200/80">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Sipariş No</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Müşteri</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Tutar</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Durum</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Ödeme</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Tarih</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.slice(0, 20).map((row) => (
                          <tr key={`${row.source}-${row.id}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900">{row.orderId}</td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-slate-900">{row.customerName || '—'}</div>
                              {row.customerEmail && (
                                <div className="text-xs text-slate-500">{row.customerEmail}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{fmtTRY(row.total)}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="text-xs">
                                {STATUS_LABELS[row.status] ?? row.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {STATUS_LABELS[row.paymentStatus ?? ''] ?? row.paymentStatus ?? '—'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleDateString('tr-TR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link
                                    href={`/admin/orders/${row.id}?source=${row.source}&userId=${row.userId ?? ''}`}
                                    className="flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Detay
                                  </Link>
                                </Button>
                                {row.status === 'pending' || row.status === 'PENDING' ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(row, 'confirmed')}
                                    disabled={updatingId === row.id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {updatingId === row.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      'Onayla'
                                    )}
                                  </Button>
                                ) : null}
                                {row.status === 'confirmed' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(row, 'processing')}
                                    disabled={updatingId === row.id}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {updatingId === row.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      'İşle'
                                    )}
                                  </Button>
                                )}
                                {row.status === 'processing' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(row, 'shipped')}
                                    disabled={updatingId === row.id}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                  >
                                    {updatingId === row.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      'Kargoya Ver'
                                    )}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOrders.length > 20 && (
                      <div className="py-3 text-center border-t border-slate-100">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/admin/orders">
                            Tümünü gör ({filteredOrders.length} sipariş)
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
