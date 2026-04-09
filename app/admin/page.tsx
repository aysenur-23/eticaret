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
  Layers,
  Tag,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type SiteStats = {
  totalProducts: number
  outOfStockProducts: number
  activeCoupons: number
  todayOrders: number
  pendingOrders: number
  totalOrders: number
  todayRevenue: number
  monthRevenue: number
}

type OrderRow = {
  id: string
  source: 'prisma' | 'firestore'
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
  CONFIRMED: 'Onaylandı',
  processing: 'İşleniyor',
  PROCESSING: 'İşleniyor',
  shipped: 'Kargoda',
  SHIPPED: 'Kargoda',
  delivered: 'Teslim Edildi',
  DELIVERED: 'Teslim Edildi',
  cancelled: 'İptal',
  CANCELLED: 'İptal',
  PAID: 'Ödendi',
  paid: 'Ödendi',
  failed: 'Başarısız',
  FAILED: 'Başarısız',
  refunded: 'İade',
  REFUNDED: 'İade',
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Stats API
  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setSiteStats(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/orders', { credentials: 'include' })
        if (!res.ok) throw new Error('API hatası')
        const data: { prisma: any[]; firestore: any[] } = await res.json()
        const rows: OrderRow[] = []
        for (const o of data.prisma ?? []) {
          rows.push({
            id: o.id, source: 'prisma',
            orderId: o.orderNo || o.id,
            customerName: o.shippingName || o.user?.name,
            customerEmail: o.user?.email || o.shippingEmail,
            total: o.total ?? 0,
            status: o.status ?? 'PENDING',
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt ?? '',
            userId: o.userId ?? null,
          })
        }
        for (const o of data.firestore ?? []) {
          const customer = o.customer || {}
          rows.push({
            id: o.id, source: 'firestore',
            orderId: o.orderId || o.id,
            customerName: customer.name,
            customerEmail: customer.email,
            total: o.pricing?.total ?? 0,
            status: o.status ?? 'pending',
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt ?? '',
            userId: o.userId ?? null,
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
    totalOrders: siteStats?.totalOrders ?? orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: siteStats?.pendingOrders ?? orders.filter((o) => o.status === 'pending' || o.status === 'PENDING').length,
    paidOrders: orders.filter((o) => o.paymentStatus === 'paid' || o.paymentStatus === 'PAID').length,
  }

  const handleStatusChange = async (row: OrderRow, newStatus: string) => {
    setUpdatingId(row.id)
    try {
      const url = row.source === 'firestore' && row.userId
        ? `/api/admin/orders/${row.id}?source=firestore&userId=${row.userId}`
        : `/api/admin/orders/${row.id}?source=${row.source}`
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      })
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
          <Loader2 className="w-10 h-10 animate-spin text-brand" />
        </div>
      ) : (
        <>
          {/* Yapılacaklar / Admin görevleri */}
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand" />
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
                            <Icon className="w-4 h-4 text-slate-600 group-hover:text-brand" />
                          </div>
                          <span className="text-sm font-medium text-slate-800 truncate">{item.label}</span>
                          {'count' in item && (item as any).count > 0 && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {(item as any).count}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-brand" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Özet kartları — 4 kart sipariş, 4 kart katalog */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Toplam Sipariş</CardTitle>
                <ShoppingCart className="h-4 w-4 text-brand/60" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-slate-900">{stats.totalOrders}</div>
                <p className="text-xs text-slate-400 mt-0.5">Tüm zamanlar</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Bu Ay Gelir</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500/70" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-lg font-bold text-slate-900">{fmtTRY(siteStats?.monthRevenue ?? stats.totalRevenue)}</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bugün: {fmtTRY(siteStats?.todayRevenue ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card className={`border-slate-200/80 bg-white shadow-sm ${stats.pendingOrders > 0 ? 'border-amber-200 bg-amber-50/30' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Bekleyen</CardTitle>
                <Clock className={`h-4 w-4 ${stats.pendingOrders > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={`text-2xl font-bold ${stats.pendingOrders > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{stats.pendingOrders}</div>
                <p className="text-xs text-slate-400 mt-0.5">Onay bekliyor</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Bugünkü Sipariş</CardTitle>
                <Calendar className="h-4 w-4 text-slate-300" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-slate-900">{siteStats?.todayOrders ?? 0}</div>
                <p className="text-xs text-slate-400 mt-0.5">Son 24 saat</p>
              </CardContent>
            </Card>
          </div>

          {/* Katalog metrikleri */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Toplam Ürün</CardTitle>
                <Package className="h-4 w-4 text-brand/60" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-slate-900">{siteStats?.totalProducts ?? '—'}</div>
                <Link href="/admin/products" className="text-xs text-brand hover:underline mt-0.5 inline-block">Ürünleri Gör →</Link>
              </CardContent>
            </Card>
            <Card className={`border-slate-200/80 shadow-sm ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'bg-red-50/40 border-red-200' : 'bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Stoksuz Ürün</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'text-red-400' : 'text-slate-300'}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={`text-2xl font-bold ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {siteStats?.outOfStockProducts ?? '—'}
                </div>
                <Link href="/admin/products?stock=outofstock" className="text-xs text-red-500 hover:underline mt-0.5 inline-block">Stok Güncelle →</Link>
              </CardContent>
            </Card>
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-slate-500">Aktif Kupon</CardTitle>
                <Tag className="h-4 w-4 text-slate-300" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-slate-900">{siteStats?.activeCoupons ?? '—'}</div>
                <Link href="/admin/indirimler" className="text-xs text-brand hover:underline mt-0.5 inline-block">Kuponları Yönet →</Link>
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
