'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Package, Send, FileText } from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type OrderDetail = {
  id: string
  source: 'firestore'
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

export default function AdminOrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const source = searchParams.get('source') || 'firestore'
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
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore')
        const { getDb } = await import('@/lib/firebase/config')
        const db = getDb()
        let orderData: any = null

        if (userId) {
          // Kayıtlı kullanıcı siparişi
          const snap = await getDoc(doc(db, 'users', userId, 'orders', id))
          if (snap.exists()) {
            orderData = { id: snap.id, source: 'firestore', ...snap.data() }
          }
        }

        if (!orderData) {
          // guestOrders'da ara (doğrudan doc ID ile)
          const guestDoc = await getDoc(doc(db, 'guestOrders', id))
          if (guestDoc.exists()) {
            orderData = { id: guestDoc.id, source: 'firestore', ...guestDoc.data() }
          }
        }

        if (!orderData) {
          // orderId alanıyla guestOrders'da sorgu yap
          const q = query(collection(db, 'guestOrders'), where('orderId', '==', id))
          const snap = await getDocs(q)
          if (!snap.empty) {
            const d = snap.docs[0]
            orderData = { id: d.id, source: 'firestore', ...d.data() }
          }
        }

        if (orderData) {
          const customer = orderData.customer || {}
          const pricing = orderData.pricing || {}
          const items = orderData.items || []
          const createdAt = orderData.createdAt as { seconds: number } | null
          const mapped: OrderDetail = {
            id: orderData.id,
            source: 'firestore',
            orderId: orderData.orderId || orderData.id,
            customer,
            items,
            pricing,
            status: orderData.status || 'pending',
            paymentStatus: orderData.paymentStatus || 'pending',
            createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
            trackingNumber: orderData.trackingNumber || '',
            userId: userId || undefined,
          }
          setOrder(mapped)
          setStatus(mapped.status)
          setTrackingNumber(mapped.trackingNumber || '')
        } else {
          setOrder(null)
        }
      } catch (err) {
        console.error('Order detail load error:', err)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, source, userId, router])

  const handleUpdate = async () => {
    if (!order) return
    setUpdating(true)
    setMessage(null)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      const updateData: Record<string, unknown> = { status }
      if (trackingNumber) updateData.trackingNumber = trackingNumber

      if (order.userId) {
        await updateDoc(doc(db, 'users', order.userId, 'orders', order.id), updateData)
      } else {
        await updateDoc(doc(db, 'guestOrders', order.id), updateData)
      }
      setOrder((prev) => prev ? { ...prev, status, trackingNumber: trackingNumber || prev.trackingNumber } : prev)
      setMessage({ type: 'success', text: 'Sipariş güncellendi.' })
    } catch (err) {
      console.error('Order update error:', err)
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
      const { doc, updateDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()

      if (order.userId) {
        await updateDoc(doc(db, 'users', order.userId, 'orders', order.id), { paymentStatus: 'PAID' })
      } else {
        await updateDoc(doc(db, 'guestOrders', order.id), { paymentStatus: 'PAID' })
      }
      setOrder((prev) => prev ? { ...prev, paymentStatus: 'PAID' } : prev)
      setMessage({ type: 'success', text: 'Ödendi olarak işaretlendi.' })
    } catch (err) {
      console.error('Mark paid error:', err)
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
      // Statik hosting: Fatura e-posta gönderimi mevcut değil (backend gerektirir)
      // Firestore'a fatura gönderim talebi kaydedebiliriz
      const { addDoc, collection: col, serverTimestamp: srvTs } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await addDoc(col(db, 'invoiceRequests'), {
        orderId: id,
        source,
        userId,
        requestedAt: srvTs(),
      })
      setMessage({ type: 'success', text: 'Fatura gönderim talebi kaydedildi. E-posta gönderimi için backend servisi gereklidir.' })
    } catch {
      setMessage({ type: 'error', text: 'Fatura talebi kaydedilirken hata oluştu.' })
    } finally {
      setSendingInvoice(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50/80 py-8">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost">
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Siparişlere Dön
            </Link>
          </Button>
          <Card className="mt-6">
            <CardContent className="py-12 text-center text-gray-600">
              Sipariş bulunamadı veya yetkiniz yok.
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const customer = order.customer as Record<string, string>
  const pricing = order.pricing || {}

  return (
    <div className="min-h-screen bg-gray-50/80 py-8" id="main-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/admin/orders" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Siparişlere Dön
            </Link>
          </Button>
          <Badge variant="outline" className="text-xs">{order.source}</Badge>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.text}
          </div>
        )}

        <Card className="rounded-xl border shadow-sm mb-6">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Sipariş {order.orderId}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{order.status}</Badge>
                <Badge variant={order.paymentStatus === 'PAID' || order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Müşteri</h3>
                <p className="text-sm text-gray-700">{customer.name || '—'}</p>
                <p className="text-sm text-gray-600">{customer.email || '—'}</p>
                <p className="text-sm text-gray-600">{customer.phone || '—'}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {[customer.addressLine, customer.district, customer.city, customer.postalCode].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
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
                    <span className="text-gray-600">Ara toplam</span>
                    <span>{fmtTRY(pricing.subtotal)}</span>
                  </div>
                )}
                {pricing.tax != null && (
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">KDV</span>
                    <span>{fmtTRY(pricing.tax)}</span>
                  </div>
                )}
                {pricing.shipping != null && (
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Kargo</span>
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
                className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            <Button onClick={handleUpdate} disabled={updating} className="rounded-lg bg-red-600 hover:bg-red-700">
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Güncelle'}
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
