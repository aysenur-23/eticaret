'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ArrowLeft, Loader2 } from 'lucide-react'
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

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

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
        const { collection: col, getDocs } = await import('firebase/firestore')
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
        <p className="text-slate-600 mt-1">Tüm siparişleri görüntüleyin ve yönetin</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        </div>
      ) : (
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-200/80">
              <CardTitle className="text-lg font-semibold">Tüm Siparişler</CardTitle>
              <CardDescription>{orders.length} sipariş</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Package className="w-14 h-14 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">Henüz sipariş yok.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-left text-sm text-slate-700">
                      <tr>
                        <th className="py-3 px-4 font-medium">Sipariş No</th>
                        <th className="py-3 px-4 font-medium">Müşteri</th>
                        <th className="py-3 px-4 font-medium">Toplam</th>
                        <th className="py-3 px-4 font-medium">Durum</th>
                        <th className="py-3 px-4 font-medium">Kaynak</th>
                        <th className="py-3 px-4 font-medium">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((row) => (
                        <tr key={`${row.source}-${row.id}`} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-900">{row.orderId}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-900">{row.customerName || '—'}</div>
                            {row.customerEmail && (
                              <div className="text-xs text-gray-500">{row.customerEmail}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{fmtTRY(row.total)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="text-xs">
                              {STATUS_LABELS[row.status] ?? row.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-500">{row.source}</td>
                          <td className="py-3 px-4">
                            <Button asChild variant="ghost" size="sm" className="rounded-lg">
                              <Link href={`/admin/orders/${row.id}?source=${row.source}&userId=${row.userId ?? ''}`}>Detay</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
      )}
    </div>
  )
}
