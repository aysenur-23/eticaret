'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Search,
  Eye,
  Clock,
  Loader2,
  ArrowRight,
  Layers,
  Tag,
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Truck,
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
  pending: 'Beklemede', PENDING: 'Beklemede',
  confirmed: 'Onaylandı', CONFIRMED: 'Onaylandı',
  processing: 'İşleniyor', PROCESSING: 'İşleniyor',
  shipped: 'Kargoda', SHIPPED: 'Kargoda',
  delivered: 'Teslim Edildi', DELIVERED: 'Teslim Edildi',
  cancelled: 'İptal', CANCELLED: 'İptal',
  PAID: 'Ödendi', paid: 'Ödendi',
  failed: 'Başarısız', FAILED: 'Başarısız',
  refunded: 'İade', REFUNDED: 'İade',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', PENDING: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700', PROCESSING: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', DELIVERED: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700', CANCELLED: 'bg-red-100 text-red-700',
  PAID: 'bg-green-100 text-green-700', paid: 'bg-green-100 text-green-700',
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setSiteStats(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/orders', { credentials: 'include' })
        if (!res.ok) throw new Error('API hatası')
        const data: { prisma: any[]; firestore: any[] } = await res.json()
        const rows: OrderRow[] = []
        for (const o of data.prisma ?? []) {
          rows.push({ id: o.id, source: 'prisma', orderId: o.orderNo || o.id, customerName: o.shippingName || o.user?.name, customerEmail: o.user?.email || o.shippingEmail, total: o.total ?? 0, status: o.status ?? 'PENDING', paymentStatus: o.paymentStatus, createdAt: o.createdAt ?? '', userId: o.userId ?? null })
        }
        for (const o of data.firestore ?? []) {
          const customer = o.customer || {}
          rows.push({ id: o.id, source: 'firestore', orderId: o.orderId || o.id, customerName: customer.name, customerEmail: customer.email, total: o.pricing?.total ?? 0, status: o.status ?? 'pending', paymentStatus: o.paymentStatus, createdAt: o.createdAt ?? '', userId: o.userId ?? null })
        }
        rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        setOrders(rows)
      } catch { setOrders([]) }
      finally { setLoading(false) }
    })()
  }, [router])

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || (o.orderId || '').toLowerCase().includes(q) || (o.customerName || '').toLowerCase().includes(q) || (o.customerEmail || '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalOrders = siteStats?.totalOrders ?? orders.length
  const pendingOrders = siteStats?.pendingOrders ?? orders.filter((o) => o.status === 'pending' || o.status === 'PENDING').length
  const monthRevenue = siteStats?.monthRevenue ?? 0
  const todayOrders = siteStats?.todayOrders ?? 0

  const handleStatusChange = async (row: OrderRow, newStatus: string) => {
    setUpdatingId(row.id)
    try {
      const url = row.source === 'firestore' && row.userId
        ? `/api/admin/orders/${row.id}?source=firestore&userId=${row.userId}`
        : `/api/admin/orders/${row.id}?source=${row.source}`
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }), credentials: 'include' })
      setOrders((prev) => prev.map((o) => o.id === row.id && o.source === row.source ? { ...o, status: newStatus } : o))
    } catch {}
    finally { setUpdatingId(null) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Hoş geldiniz, işte günlük özet.</p>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Toplam Sipariş */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-200">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-100 text-xs font-medium uppercase tracking-wide">Toplam Sipariş</span>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{totalOrders}</p>
            <p className="text-blue-200 text-xs mt-1">Tüm zamanlar</p>
          </div>
        </div>

        {/* Bu Ay Gelir */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg shadow-emerald-200">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Bu Ay Gelir</span>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold leading-tight">{fmtTRY(monthRevenue)}</p>
            <p className="text-emerald-200 text-xs mt-1">Bugün: {fmtTRY(siteStats?.todayRevenue ?? 0)}</p>
          </div>
        </div>

        {/* Bekleyen */}
        <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${pendingOrders > 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-200' : 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-200'}`}>
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-xs font-medium uppercase tracking-wide">Bekleyen</span>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{pendingOrders}</p>
            <p className="text-white/70 text-xs mt-1">Onay bekliyor</p>
          </div>
        </div>

        {/* Bugünkü Sipariş */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-5 text-white shadow-lg shadow-violet-200">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-violet-200 text-xs font-medium uppercase tracking-wide">Bugün</span>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{todayOrders}</p>
            <p className="text-violet-300 text-xs mt-1">Son 24 saat</p>
          </div>
        </div>
      </div>

      {/* Katalog + Hızlı Linkler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ürün istatistikleri */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">Ürünler</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{siteStats?.totalProducts ?? '—'}</p>
            <Link href="/admin/products" className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-flex items-center gap-1 font-medium">
              Yönet <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className={`bg-white rounded-2xl border shadow-sm p-5 ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">Stoksuz</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'bg-red-100' : 'bg-slate-50'}`}>
                <AlertTriangle className={`w-4 h-4 ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'text-red-500' : 'text-slate-400'}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${(siteStats?.outOfStockProducts ?? 0) > 0 ? 'text-red-600' : 'text-slate-900'}`}>{siteStats?.outOfStockProducts ?? '—'}</p>
            <Link href="/admin/products?stock=outofstock" className="text-xs text-red-500 hover:text-red-600 mt-2 inline-flex items-center gap-1 font-medium">
              Güncelle <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">Kupon</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Tag className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{siteStats?.activeCoupons ?? '—'}</p>
            <Link href="/admin/indirimler" className="text-xs text-yellow-600 hover:text-yellow-700 mt-2 inline-flex items-center gap-1 font-medium">
              Yönet <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-800 mb-4">Hızlı İşlemler</p>
          <div className="space-y-2">
            {[
              { href: '/admin/orders', label: 'Siparişler', icon: ShoppingCart, badge: pendingOrders > 0 ? pendingOrders : null, color: 'text-blue-600 bg-blue-50' },
              { href: '/admin/products', label: 'Ürün Yönetimi', icon: Package, color: 'text-slate-600 bg-slate-100' },
              { href: '/admin/urunler', label: 'Stok Yönetimi', icon: Layers, color: 'text-emerald-600 bg-emerald-50' },
              { href: '/admin/istatistikler', label: 'İstatistikler', icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{item.badge}</span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Son Siparişler */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Son Siparişler</h2>
            <p className="text-xs text-slate-400 mt-0.5">{filteredOrders.length} sipariş</p>
          </div>
          <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            Tümünü Gör <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Arama + Filtreler */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-3 border-b border-slate-50 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input type="text" placeholder="Sipariş ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 text-sm bg-white border-slate-200" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[null, 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((s) => (
              <button key={s ?? 'all'} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                {s ? STATUS_LABELS[s] : 'Tümü'}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Sipariş bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="px-6 py-3">Sipariş</th>
                  <th className="px-6 py-3">Müşteri</th>
                  <th className="px-6 py-3">Tutar</th>
                  <th className="px-6 py-3">Durum</th>
                  <th className="px-6 py-3">Tarih</th>
                  <th className="px-6 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.slice(0, 20).map((row) => (
                  <tr key={`${row.source}-${row.id}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-semibold text-slate-800">{row.orderId}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-slate-800 leading-tight">{row.customerName || '—'}</p>
                      {row.customerEmail && <p className="text-xs text-slate-400 truncate max-w-[180px]">{row.customerEmail}</p>}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{fmtTRY(row.total)}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {STATUS_LABELS[row.status] ?? row.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-400 whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${row.id}?source=${row.source}&userId=${row.userId ?? ''}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Detay
                        </Link>
                        {(row.status === 'pending' || row.status === 'PENDING') && (
                          <button onClick={() => handleStatusChange(row, 'confirmed')} disabled={updatingId === row.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50">
                            {updatingId === row.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" /> Onayla</>}
                          </button>
                        )}
                        {row.status === 'confirmed' && (
                          <button onClick={() => handleStatusChange(row, 'processing')} disabled={updatingId === row.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50">
                            {updatingId === row.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'İşle'}
                          </button>
                        )}
                        {row.status === 'processing' && (
                          <button onClick={() => handleStatusChange(row, 'shipped')} disabled={updatingId === row.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-violet-500 hover:bg-violet-600 transition-colors disabled:opacity-50">
                            {updatingId === row.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Truck className="w-3.5 h-3.5" /> Kargo</>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length > 20 && (
              <div className="px-6 py-3 border-t border-slate-100 text-center">
                <Link href="/admin/orders" className="text-xs text-blue-600 font-medium hover:underline">
                  +{filteredOrders.length - 20} sipariş daha →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
