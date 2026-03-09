'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Search, Eye, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
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

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-0',
  PENDING: 'bg-amber-100 text-amber-800 border-0',
  confirmed: 'bg-blue-100 text-blue-800 border-0',
  processing: 'bg-indigo-100 text-indigo-800 border-0',
  shipped: 'bg-purple-100 text-purple-800 border-0',
  delivered: 'bg-green-100 text-green-800 border-0',
  cancelled: 'bg-red-100 text-red-800 border-0',
  PAID: 'bg-green-100 text-green-800 border-0',
  paid: 'bg-green-100 text-green-800 border-0',
  failed: 'bg-red-100 text-red-800 border-0',
  refunded: 'bg-slate-100 text-slate-700 border-0',
}

const FILTER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

async function loadOrdersFromFirestore(): Promise<OrderRow[]> {
  const { collection: col, getDocs } = await import('firebase/firestore')
  const { getDb } = await import('@/lib/firebase/config')
  const db = getDb()
  const rows: OrderRow[] = []

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
  return rows
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const rows = await loadOrdersFromFirestore()
      setOrders(rows)
    } catch (err) {
      console.error('Admin orders load error:', err)
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      return
    }
    fetchOrders()
  }, [router])

  const handleStatusChange = async (row: OrderRow, newStatus: string) => {
    setUpdatingId(row.id)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      if (row.userId) {
        await updateDoc(doc(db, 'users', row.userId, 'orders', row.id), { status: newStatus })
      } else {
        await updateDoc(doc(db, 'guestOrders', row.id), { status: newStatus })
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === row.id && o.source === row.source ? { ...o, status: newStatus } : o
        )
      )
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      (order.orderId || '').toLowerCase().includes(q) ||
      (order.customerName || '').toLowerCase().includes(q) ||
      (order.customerEmail || '').toLowerCase().includes(q)
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'PENDING').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
          <p className="text-slate-600 mt-1">
            {loading ? 'Yükleniyor...' : `${orders.length} sipariş · ${fmtTRY(totalRevenue)} toplam gelir`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(true)}
          disabled={refreshing || loading}
          className="w-fit"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Özet satırı */}
      {!loading && pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-600" />
          {pendingCount} sipariş onay bekliyor — aşağıdan hızlıca onaylayabilirsiniz.
        </div>
      )}

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">Tüm Siparişler</CardTitle>
              <CardDescription className="mt-0.5">
                {filteredOrders.length} sipariş görüntüleniyor
              </CardDescription>
            </div>
          </div>
          {/* Arama + Filtre */}
          <div className="flex flex-col md:flex-row gap-3 pt-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none shrink-0" />
              <Input
                type="text"
                placeholder="Sipariş no, müşteri adı veya e-posta ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 min-w-0 border-slate-200 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                Tümü ({orders.length})
              </Button>
              {FILTER_STATUSES.map((s) => {
                const count = orders.filter((o) => o.status === s || (s === 'pending' && o.status === 'PENDING')).length
                if (count === 0) return null
                return (
                  <Button
                    key={s}
                    variant={statusFilter === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  >
                    {STATUS_LABELS[s]} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Package className="w-14 h-14 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">
                {searchQuery || statusFilter ? 'Kritere uyan sipariş bulunamadı.' : 'Henüz sipariş yok.'}
              </p>
              {(searchQuery || statusFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => { setSearchQuery(''); setStatusFilter(null) }}
                >
                  Filtreleri temizle
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-left text-sm text-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Sipariş No</th>
                    <th className="py-3 px-4 font-semibold">Müşteri</th>
                    <th className="py-3 px-4 font-semibold">Tutar</th>
                    <th className="py-3 px-4 font-semibold">Durum</th>
                    <th className="py-3 px-4 font-semibold">Ödeme</th>
                    <th className="py-3 px-4 font-semibold">Tarih</th>
                    <th className="py-3 px-4 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((row) => {
                    const isUpdating = updatingId === row.id
                    return (
                      <tr key={`${row.source}-${row.id}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900 text-sm">{row.orderId}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-slate-900">{row.customerName || '—'}</div>
                          {row.customerEmail && (
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{row.customerEmail}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">{fmtTRY(row.total)}</td>
                        <td className="py-3 px-4">
                          <Badge className={`text-xs ${STATUS_BADGE_CLASS[row.status] ?? 'bg-slate-100 text-slate-700 border-0'}`}>
                            {STATUS_LABELS[row.status] ?? row.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {STATUS_LABELS[row.paymentStatus ?? ''] ?? row.paymentStatus ?? '—'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleDateString('tr-TR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                              <Link
                                href={`/admin/orders/${row.id}?source=${row.source}&userId=${row.userId ?? ''}`}
                                className="inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Detay
                              </Link>
                            </Button>
                            {(row.status === 'pending' || row.status === 'PENDING') && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(row, 'confirmed')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Onayla'}
                              </Button>
                            )}
                            {row.status === 'confirmed' && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleStatusChange(row, 'processing')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'İşle'}
                              </Button>
                            )}
                            {row.status === 'processing' && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => handleStatusChange(row, 'shipped')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Kargoya Ver'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
