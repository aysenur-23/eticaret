'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart2,
  Calendar,
  Award,
} from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type DailyPoint = { date: string; revenue: number; orderCount: number }
type TopProduct = { name: string; soldQty: number; revenue: number }
type StatusBucket = { status: string; count: number; revenue: number }

type SalesData = {
  period: string
  summary: { totalRevenue: number; totalOrders: number; avgOrderValue: number }
  dailyRevenue: DailyPoint[]
  topProducts: TopProduct[]
  ordersByStatus: StatusBucket[]
}

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Bugün' },
  { value: '7d', label: '7 Gün' },
  { value: '30d', label: '30 Gün' },
  { value: '90d', label: '90 Gün' },
]

const STATUS_TR: Record<string, string> = {
  PENDING: 'Beklemede', CONFIRMED: 'Onaylandı', PROCESSING: 'İşleniyor',
  SHIPPED: 'Kargoda', DELIVERED: 'Teslim', CANCELLED: 'İptal',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-400', CONFIRMED: 'bg-blue-400', PROCESSING: 'bg-indigo-400',
  SHIPPED: 'bg-violet-400', DELIVERED: 'bg-emerald-400', CANCELLED: 'bg-red-400',
}

function MiniBarChart({ data, maxVal }: { data: DailyPoint[]; maxVal: number }) {
  if (!data.length) return null
  return (
    <div className="flex items-end gap-px h-24 w-full">
      {data.map((d) => {
        const pct = maxVal > 0 ? (d.revenue / maxVal) * 100 : 0
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full bg-brand/70 hover:bg-brand rounded-t transition-all duration-200"
              style={{ height: `${Math.max(pct, d.revenue > 0 ? 2 : 0)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 hidden group-hover:block z-10 bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none shadow-lg">
              {new Date(d.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
              <br />{fmtTRY(d.revenue)} · {d.orderCount} sipariş
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminIstatistiklerPage() {
  const [period, setPeriod] = useState('30d')
  const [data, setData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevData, setPrevData] = useState<SalesData | null>(null)

  const loadData = useCallback(async (p: string) => {
    setLoading(true)
    try {
      const [curr, prev] = await Promise.all([
        fetch(`/api/admin/stats/sales?period=${p}`, { credentials: 'include' }).then((r) => r.ok ? r.json() : null),
        fetch(`/api/admin/stats/sales?period=${p}`, { credentials: 'include' }).then((r) => r.ok ? r.json() : null),
      ])
      setData(curr)
      setPrevData(prev)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData(period) }, [period, loadData])

  const maxRevenue = data ? Math.max(...data.dailyRevenue.map((d) => d.revenue), 1) : 1
  const totalStatusCount = data ? data.ordersByStatus.reduce((s, b) => s + b.count, 0) : 0

  return (
    <div className="space-y-6">
      {/* Başlık + Periyot seçici */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            İstatistikler
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Satış performansı ve sipariş analizi</p>
        </div>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white text-sm shadow-sm">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-4 py-2 font-medium transition-colors ${
                period === opt.value
                  ? 'bg-brand text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 bg-white rounded-xl border border-slate-200">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-sm text-slate-500">İstatistikler yükleniyor...</p>
          </div>
        </div>
      ) : !data ? (
        <div className="text-center py-24 bg-white rounded-xl border border-slate-200">
          <BarChart2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Veri bulunamadı</p>
          <p className="text-sm text-slate-400 mt-1">Bu periyot için sipariş verisi yok.</p>
        </div>
      ) : (
        <>
          {/* Özet Kartlar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Ciro</p>
                <div className="w-8 h-8 rounded-lg bg-brand/8 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-brand" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{fmtTRY(data.summary.totalRevenue)}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {PERIOD_OPTIONS.find((o) => o.value === period)?.label} içinde
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sipariş Sayısı</p>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data.summary.totalOrders}</p>
              <p className="text-xs text-slate-400 mt-1">
                Ort. {fmtTRY(data.summary.avgOrderValue)} / sipariş
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ort. Sepet</p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{fmtTRY(data.summary.avgOrderValue)}</p>
              <p className="text-xs text-slate-400 mt-1">Ortalama sipariş değeri</p>
            </div>
          </div>

          {/* Ciro Grafiği */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Günlük Ciro</h2>
                <p className="text-xs text-slate-400 mt-0.5">Her çubuk bir güne ait</p>
              </div>
              <p className="text-xs font-medium text-brand bg-brand/5 px-3 py-1 rounded-full">
                {data.dailyRevenue.length} gün
              </p>
            </div>
            {data.dailyRevenue.every((d) => d.revenue === 0) ? (
              <div className="flex items-center justify-center h-24 text-slate-400 text-sm">
                Bu periyotta ciro verisi yok
              </div>
            ) : (
              <>
                <MiniBarChart data={data.dailyRevenue} maxVal={maxRevenue} />
                <div className="flex justify-between mt-2">
                  <p className="text-[10px] text-slate-400">
                    {new Date(data.dailyRevenue[0]?.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(data.dailyRevenue[data.dailyRevenue.length - 1]?.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* En Çok Satan Ürünler */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-900">En Çok Satan Ürünler</h2>
              </div>
              {data.topProducts.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                  <Package className="w-8 h-8 mr-2 opacity-40" /> Veri yok
                </div>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.map((p, i) => {
                    const maxRev = data.topProducts[0]?.revenue || 1
                    const pct = (p.revenue / maxRev) * 100
                    return (
                      <div key={p.name} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">#{i + 1}</span>
                            <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-500">{p.soldQty} adet</span>
                            <span className="text-xs font-semibold text-brand">{fmtTRY(p.revenue)}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sipariş Durum Dağılımı */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-semibold text-slate-900">Durum Dağılımı</h2>
              </div>
              {data.ordersByStatus.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
                  Sipariş verisi yok
                </div>
              ) : (
                <div className="space-y-3">
                  {data.ordersByStatus
                    .sort((a, b) => b.count - a.count)
                    .map((s) => {
                      const pct = totalStatusCount > 0 ? (s.count / totalStatusCount) * 100 : 0
                      const colorClass = STATUS_COLOR[s.status] ?? 'bg-slate-400'
                      return (
                        <div key={s.status} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`} />
                              <p className="text-xs font-medium text-slate-700">
                                {STATUS_TR[s.status] ?? s.status}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">{s.count} sipariş</span>
                              <span className="text-xs font-semibold text-slate-700">{fmtTRY(s.revenue)}</span>
                              <span className="text-[10px] text-slate-400 w-8 text-right">{pct.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Toplam: <strong className="text-slate-800">{totalStatusCount} sipariş</strong></p>
                <Link href="/admin/orders" className="text-xs font-medium text-brand hover:underline">
                  Siparişlere Git →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
