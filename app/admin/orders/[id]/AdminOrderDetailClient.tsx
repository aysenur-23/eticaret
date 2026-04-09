'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Package, FileText } from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type OrderDetail = {
  id: string
  source: 'prisma' | 'firestore'
  orderId: string
  customer: Record<string, unknown>
  items: Array<{ id?: string; name: string; price: number; quantity: number; lineTotal?: number }>
  pricing: { subtotal?: number; tax?: number; shipping?: number; total?: number }
  status: string
  paymentStatus: string
  createdAt: string
  trackingNumber?: string
  userId?: string
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'confirmed', label: 'Onaylandı' },
  { value: 'processing', label: 'İşleniyor' },
  { value: 'shipped', label: 'Kargoya Verildi' },
  { value: 'delivered', label: 'Teslim Edildi' },
  { value: 'cancelled', label: 'İptal' },
]

const STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede', PENDING: 'Beklemede',
  confirmed: 'Onaylandı', CONFIRMED: 'Onaylandı',
  processing: 'İşleniyor', PROCESSING: 'İşleniyor',
  shipped: 'Kargoda', SHIPPED: 'Kargoda',
  delivered: 'Teslim Edildi', DELIVERED: 'Teslim Edildi',
  cancelled: 'İptal', CANCELLED: 'İptal',
  paid: 'Ödendi', PAID: 'Ödendi',
  failed: 'Başarısız', FAILED: 'Başarısız',
  pending_payment: 'Ödeme Bekleniyor',
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const source = searchParams.get('source') || 'prisma'
  const userId = searchParams.get('userId') || ''

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [sendingInvoice, setSendingInvoice] = useState(false)
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const url = userId
      ? `/api/admin/orders/${id}?source=${source}&userId=${userId}`
      : `/api/admin/orders/${id}?source=${source}`
    fetch(url, { credentials: 'include' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) { setOrder(null); return }
        const mapped: OrderDetail = {
          id: data.id,
          source: data.source || source as 'prisma' | 'firestore',
          orderId: data.orderId || data.id,
          customer: data.customer || {},
          items: (data.items || []).map((item: any) => ({
            id: item.id,
            name: item.name || item.productName || 'Ürün',
            price: item.price ?? item.unitPrice ?? 0,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
          pricing: data.pricing || {},
          status: data.status || 'pending',
          paymentStatus: data.paymentStatus || 'pending',
          createdAt: data.createdAt || '',
          trackingNumber: data.trackingNumber || '',
          userId: data.userId || userId || undefined,
        }
        setOrder(mapped)
        setStatus(mapped.status)
        setTrackingNumber(mapped.trackingNumber || '')
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id, source, userId, router])

  const handleUpdate = async () => {
    if (!order) return
    setUpdating(true)
    setMessage(null)
    try {
      const url = order.source === 'firestore' && order.userId
        ? `/api/admin/orders/${order.id}?source=firestore&userId=${order.userId}`
        : `/api/admin/orders/${order.id}?source=${order.source}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...(trackingNumber ? { trackingNumber } : {}) }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Güncelleme hatası')
      setOrder((prev) => prev ? { ...prev, status, trackingNumber: trackingNumber || prev.trackingNumber } : prev)
      setMessage({ type: 'success', text: 'Sipariş güncellendi.' })
    } catch {
      setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' })
    } finally {
      setUpdating(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!order) return
    setUpdating(true)
    setMessage(null)
    try {
      const url = order.source === 'firestore' && order.userId
        ? `/api/admin/orders/${order.id}?source=firestore&userId=${order.userId}`
        : `/api/admin/orders/${order.id}?source=${order.source}`
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Güncelleme hatası')
      setOrder((prev) => prev ? { ...prev, paymentStatus: 'PAID' } : prev)
      setMessage({ type: 'success', text: 'Ödendi olarak işaretlendi.' })
    } catch {
      setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' })
    } finally {
      setUpdating(false)
    }
  }

  const handleSendInvoice = async () => {
    if (!order) return
    setSendingInvoice(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: order.source, userId: order.userId }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fatura gönderilemedi')
      setMessage({ type: 'success', text: data.message || 'Fatura gönderildi.' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Fatura gönderilirken hata oluştu.' })
    } finally {
      setSendingInvoice(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost">
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Siparişlere Dön
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-slate-600">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            Sipariş bulunamadı.
          </CardContent>
        </Card>
      </div>
    )
  }

  const customer = order.customer as Record<string, string>
  const pricing = order.pricing || {}

  return (
    <div className="space-y-6" id="main-content">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/admin/orders" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Siparişlere Dön
            </Link>
          </Button>
          <Badge variant="outline" className="text-xs capitalize">{order.source}</Badge>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
          >
            {message.text}
          </div>
        )}

        <Card className="rounded-xl border shadow-sm mb-6">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Sipariş {order.orderId}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : '—'}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{STATUS_LABELS[order.status] ?? order.status}</Badge>
                <Badge variant={order.paymentStatus === 'PAID' || order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                  {STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Müşteri</h3>
                <p className="text-sm text-slate-700">{customer.name || '—'}</p>
                <p className="text-sm text-slate-600">{customer.email || '—'}</p>
                <p className="text-sm text-slate-600">{customer.phone || '—'}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {[customer.addressLine, customer.district, customer.city, customer.postalCode].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-600">
                    <th className="py-2 pr-4">Ürün</th>
                    <th className="py-2 pr-4 text-right">Adet</th>
                    <th className="py-2 pr-4 text-right">Birim Fiyat</th>
                    <th className="py-2 text-right">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b">
                      <td className="py-3 pr-4">{item.name}</td>
                      <td className="py-3 pr-4 text-right">{item.quantity}</td>
                      <td className="py-3 pr-4 text-right">{fmtTRY(item.price)}</td>
                      <td className="py-3 text-right">
                        {fmtTRY(item.lineTotal ?? item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="text-sm space-y-1">
                {pricing.subtotal != null && (
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-600">Ara toplam</span>
                    <span>{fmtTRY(pricing.subtotal)}</span>
                  </div>
                )}
                {pricing.tax != null && (
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-600">KDV</span>
                    <span>{fmtTRY(pricing.tax)}</span>
                  </div>
                )}
                {pricing.shipping != null && (
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-600">Kargo</span>
                    <span>{fmtTRY(pricing.shipping)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-8 font-bold text-base pt-2 border-t">
                  <span>Toplam</span>
                  <span>{fmtTRY(pricing.total ?? 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-base">Durum Güncelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Sipariş durumu</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="tracking">Kargo takip no</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Örn. 1234567890"
                className="mt-1 max-w-xs rounded-lg"
              />
            </div>
            <Button onClick={handleUpdate} disabled={updating} className="rounded-lg bg-brand hover:bg-brand-hover">
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Güncelle
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {(order.paymentStatus !== 'PAID' && order.paymentStatus !== 'paid') && (
            <Button variant="outline" onClick={handleMarkPaid} disabled={updating} className="rounded-lg">
              Ödendi İşaretle
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSendInvoice}
            disabled={sendingInvoice || !customer.email}
            className="rounded-lg inline-flex items-center gap-2"
          >
            {sendingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Fatura Gönder
          </Button>
        </div>
      </div>
    </div>
  )
}
