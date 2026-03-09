'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Search, Loader2, RefreshCw, ShoppingBag, Mail } from 'lucide-react'
import { fmtTRY } from '@/lib/format'

type CustomerRow = {
  uid: string
  email: string
  displayName?: string
  phone?: string
  role?: string
  createdAt?: string
  orderCount: number
  totalSpent: number
}

export default function AdminMusterilerPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCustomers = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const { collection: col, getDocs } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()

      const usersSnap = await getDocs(col(db, 'users'))
      const rows: CustomerRow[] = []

      for (const userDoc of usersSnap.docs) {
        const data = userDoc.data()
        const createdAt = data.createdAt as { seconds: number } | null

        // Sipariş sayısını ve toplam harcamayı hesapla
        let orderCount = 0
        let totalSpent = 0
        try {
          const ordersSnap = await getDocs(col(db, 'users', userDoc.id, 'orders'))
          orderCount = ordersSnap.size
          ordersSnap.docs.forEach((od) => {
            const pricing = od.data().pricing || {}
            totalSpent += pricing.total ?? 0
          })
        } catch {}

        rows.push({
          uid: userDoc.id,
          email: data.email || '',
          displayName: data.displayName || data.name || undefined,
          phone: data.phone || data.phoneNumber || undefined,
          role: data.role || 'user',
          createdAt: createdAt?.seconds
            ? new Date(createdAt.seconds * 1000).toISOString()
            : undefined,
          orderCount,
          totalSpent,
        })
      }

      rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      setCustomers(rows)
    } catch (err) {
      console.error('Customers load error:', err)
      setCustomers([])
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
    fetchCustomers()
  }, [router])

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.displayName || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      c.uid.toLowerCase().includes(q)
    )
  })

  const adminCount = customers.filter((c) => c.role === 'admin').length
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Müşteriler</h1>
          <p className="text-slate-600 mt-1">
            {loading ? 'Yükleniyor...' : `${customers.length} kayıtlı kullanıcı · ${fmtTRY(totalRevenue)} toplam harcama`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchCustomers(true)}
          disabled={refreshing || loading}
          className="w-fit"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Özet kartları */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Toplam</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{customers.length}</p>
                </div>
                <Users className="w-8 h-8 text-slate-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sipariş Veren</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {customers.filter((c) => c.orderCount > 0).length}
                  </p>
                </div>
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Toplam Gelir</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{fmtTRY(totalRevenue)}</p>
                </div>
                <Mail className="w-8 h-8 text-slate-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200/80 pb-4">
          <CardTitle className="text-lg font-semibold">Kayıtlı Kullanıcılar</CardTitle>
          <CardDescription>
            {filtered.length} kullanıcı görüntüleniyor
            {adminCount > 0 && ` · ${adminCount} admin`}
          </CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 translate-y-[-30%] text-slate-400 w-4 h-4 pointer-events-none shrink-0" />
            <Input
              placeholder="E-posta, ad veya telefon ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 min-w-0 border-slate-200 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users className="w-14 h-14 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">
                {searchQuery ? 'Kullanıcı bulunamadı.' : 'Henüz kayıtlı kullanıcı yok.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-left text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-700">Kullanıcı</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Telefon</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Rol</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Siparişler</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Harcama</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Kayıt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => (
                    <tr key={c.uid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 text-sm">
                          {c.displayName || '—'}
                        </div>
                        <a
                          href={`mailto:${c.email}`}
                          className="text-xs text-brand hover:underline"
                        >
                          {c.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {c.phone
                          ? <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        {c.role === 'admin' ? (
                          <Badge className="bg-brand/10 text-brand border-0 text-xs">Admin</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Kullanıcı</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                        {c.orderCount > 0 ? c.orderCount : <span className="text-slate-400 font-normal">—</span>}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900 tabular-nums">
                        {c.totalSpent > 0 ? fmtTRY(c.totalSpent) : <span className="text-slate-400 font-normal">—</span>}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
