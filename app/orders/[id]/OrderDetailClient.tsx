'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, Truck } from 'lucide-react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { getDb } from '@/lib/firebase/config'
import { fmtPrice } from '@/lib/format'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { ClassicPageShell } from '@/components/ClassicPageShell'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { user, isAuthenticated } = useAuthStore()
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const formatPrice = (amount: number) => fmtPrice(amount, currency, rates?.rates ?? null)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isOrderNo = /^ORD-/.test(id)

    // ORD-xxx: Firestore guestOrders veya kullanıcı siparişinden ara
    if (isOrderNo) {
      (async () => {
        try {
          const db = getDb()
          // Önce guestOrders koleksiyonunda ara
          const guestQ = query(collection(db, 'guestOrders'), where('orderId', '==', id))
          const guestSnap = await getDocs(guestQ)
          if (!guestSnap.empty) {
            const data = guestSnap.docs[0].data()
            const createdAt = data.createdAt as { seconds: number } | null
            setOrder({
              id: guestSnap.docs[0].id,
              orderId: data.orderId,
              createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000) : new Date(),
              status: data.status || 'pending',
              trackingNumber: data.trackingNumber,
              customer: data.customer,
              items: data.items || [],
              pricing: data.pricing || { total: 0 },
            })
          } else if (user?.id) {
            // Giriş yapılmışsa kullanıcı siparişlerinde orderId ile ara
            const userOrders = await getDocs(collection(db, 'users', user.id, 'orders'))
            const match = userOrders.docs.find((d) => d.data().orderId === id)
            if (match) {
              const data = match.data()
              const createdAt = data.createdAt as { seconds: number } | null
              setOrder({
                id: match.id,
                orderId: data.orderId,
                createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000) : new Date(),
                status: data.status || 'pending',
                trackingNumber: data.trackingNumber,
                customer: data.customer,
                items: data.items || [],
                pricing: data.pricing || { total: 0 },
              })
            } else {
              setOrder(null)
            }
          } else {
            setOrder(null)
          }
        } catch {
          setOrder(null)
        } finally {
          setLoading(false)
        }
      })()
      return
    }

    // Firestore siparişi (giriş gerekli)
    if (!isAuthenticated || !user?.id) {
      router.push('/login?redirect=/orders/' + id)
      return
    }
    try {
      const db = getDb()
      getDoc(doc(db, 'users', user.id, 'orders', id))
        .then((snap) => {
          if (snap.exists()) {
            const data = snap.data()
            const createdAt = data.createdAt as { seconds: number } | null
            setOrder({
              id: snap.id,
              orderId: data.orderId || snap.id,
              ...data,
              createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000) : new Date(),
            })
          } else {
            setOrder(null)
          }
        })
        .catch(() => setOrder(null))
        .finally(() => setLoading(false))
    } catch {
      setOrder(null)
      setLoading(false)
    }
  }, [id, user?.id, isAuthenticated, router])

  if (loading) {
    return (
      <ClassicPageShell breadcrumbs={[{ label: 'Sipariş Detayı' }]} noTitle>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent" />
        </div>
      </ClassicPageShell>
    )
  }

  const isGuestOrderId = /^ORD-/.test(id)

  if (!order) {
    return (
      <ClassicPageShell breadcrumbs={[{ label: 'Siparişlerim' }, { label: 'Sipariş Detayı' }]} noTitle>
        <div className="flex justify-center py-8">
          <Card className="max-w-md w-full p-8 text-center classic-card rounded-lg">
            {isGuestOrderId ? (
              <>
                <div className="inline-flex h-14 w-14 rounded-lg bg-red-100 items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Siparişiniz alındı</h2>
                <p className="text-gray-600 mb-2">Sipariş numaranız:</p>
                <p className="font-mono font-semibold text-red-600 mb-4">{id}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Giriş yapmadan verdiğiniz siparişler burada detaylı görüntülenemez. Sipariş takibi için e-posta ile iletişime geçebilirsiniz.
                </p>
              </>
            ) : (
              <p className="text-gray-600 mb-4">Sipariş bulunamadı.</p>
            )}
            <Button asChild className="btn-classic-primary">
              <Link href="/">{isGuestOrderId ? 'Ana Sayfaya Dön' : 'Siparişlerime Dön'}</Link>
            </Button>
          </Card>
        </div>
      </ClassicPageShell>
    )
  }

  const statusLabels: Record<string, string> = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
  }

  return (
    <ClassicPageShell
      breadcrumbs={[
        { label: 'Hesabım', href: '/profile' },
        { label: 'Siparişlerim', href: '/profile?tab=orders' },
        { label: `Sipariş #${order.orderId}` },
      ]}
      title={`Sipariş #${order.orderId}`}
      description={new Date(order.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
    >
        <Card className="classic-card rounded-lg max-w-3xl">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Sipariş #{order.orderId}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge
                className={
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                }
              >
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-gray-500" />
                <span>Kargo takip: <strong>{order.trackingNumber}</strong></span>
              </div>
            )}
            {order.customer && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Teslimat adresi</h3>
                <p className="text-gray-600 text-sm">
                  {order.customer.name}<br />
                  {order.customer.addressLine}, {order.customer.district} / {order.customer.city} {order.customer.postalCode}<br />
                  {order.customer.phone}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ürünler</h3>
              <ul className="space-y-2">
                {(order.items || []).map((item: any) => (
                  <li key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="font-semibold text-gray-900">Toplam</span>
              <span className="text-xl font-bold text-red-600">{formatPrice(order.pricing?.total || 0)}</span>
            </div>
          </CardContent>
        </Card>
    </ClassicPageShell>
  )
}
