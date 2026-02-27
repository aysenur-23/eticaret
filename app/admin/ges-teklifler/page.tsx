'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, FileText, Phone, MapPin, FileCheck, AlertTriangle } from 'lucide-react'

type GesQuoteRow = {
  id: string
  fullName: string
  phone: string
  city: string
  email: string | null
  monthlyKwh: number | null
  regionId: string | null
  suggestedKwp: number | null
  installationType: string | null
  notes: string | null
  wantsEvChargingQuote?: boolean
  wantsLightingQuote?: boolean
  createdAt: string
}

type GesVerificationRow = {
  id: string
  companyName: string
  quoteDate: string | null
  totalPriceTry: number | null
  totalKwp: number | null
  panelBrandModel: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  redFlags: string[] | null
  createdAt: string
}

const INSTALLATION_TYPE_LABELS: Record<string, string> = {
  ev: 'Ev',
  isyeri: 'İşyeri',
  tarim: 'Tarım',
  diger: 'Diğer',
}

export default function AdminGesTekliflerPage() {
  const router = useRouter()
  const [list, setList] = useState<GesQuoteRow[]>([])
  const [verifications, setVerifications] = useState<GesVerificationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingVerifications, setLoadingVerifications] = useState(true)

  useEffect(() => {
    // Statik hosting: Firestore'dan GES teklifleri oku (API yok)
    const adminUid = typeof window !== 'undefined' ? localStorage.getItem('admin_uid') : null
    if (!adminUid) {
      router.push('/admin/auth')
      setLoading(false)
      setLoadingVerifications(false)
      return
    }
    (async () => {
      try {
        const { collection: col, getDocs } = await import('firebase/firestore')
        const { getDb } = await import('@/lib/firebase/config')
        const db = getDb()

        // GES teklif talepleri
        const quotesSnap = await getDocs(col(db, 'gesQuotes'))
        const quotes: GesQuoteRow[] = quotesSnap.docs.map((d) => {
          const data = d.data()
          const createdAt = data.createdAt as { seconds: number } | null
          return {
            id: d.id,
            fullName: data.fullName || '',
            phone: data.phone || '',
            city: data.city || '',
            email: data.email || null,
            monthlyKwh: data.monthlyKwh ?? null,
            regionId: data.regionId ?? null,
            suggestedKwp: data.suggestedKwp ?? null,
            installationType: data.installationAreaType ?? data.installationType ?? null,
            notes: data.notes ?? null,
            wantsEvChargingQuote: data.wantsEvChargingQuote,
            wantsLightingQuote: data.wantsLightingQuote,
            createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
          }
        })
        quotes.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        setList(quotes)
      } catch (err) {
        console.error('GES quotes load error:', err)
        setList([])
      } finally {
        setLoading(false)
      }
    })();

    // GES doğrulamaları
    (async () => {
      try {
        const { collection: col, getDocs } = await import('firebase/firestore')
        const { getDb } = await import('@/lib/firebase/config')
        const db = getDb()
        const snap = await getDocs(col(db, 'gesVerifications'))
        const rows: GesVerificationRow[] = snap.docs.map((d) => {
          const data = d.data()
          const createdAt = data.createdAt as { seconds: number } | null
          return {
            id: d.id,
            companyName: data.companyName || '',
            quoteDate: data.quoteDate ?? null,
            totalPriceTry: data.totalPriceTry ?? null,
            totalKwp: data.totalKwp ?? null,
            panelBrandModel: data.panelBrandModel ?? null,
            contactName: data.contactName ?? null,
            contactEmail: data.contactEmail ?? null,
            contactPhone: data.contactPhone ?? null,
            redFlags: Array.isArray(data.redFlags) ? data.redFlags : null,
            createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
          }
        })
        rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        setVerifications(rows)
      } catch (err) {
        console.error('GES verifications load error:', err)
        setVerifications([])
      } finally {
        setLoadingVerifications(false)
      }
    })()
  }, [router])

  const redFlagCount = (row: GesVerificationRow) =>
    Array.isArray(row.redFlags) ? row.redFlags.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">GES Teklif Al</h1>
        <p className="text-slate-600 mt-1">Teklif talepleri ve teklif doğrulama kayıtları</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="requests" className="data-[state=active]:bg-white">
            Teklif Talepleri ({list.length})
          </TabsTrigger>
          <TabsTrigger value="verifications" className="data-[state=active]:bg-white">
            Teklif Doğrulamaları ({verifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
          ) : (
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Talepler ({list.length})
                </CardTitle>
                <CardDescription>En yeni talepler üstte listelenir</CardDescription>
              </CardHeader>
              <CardContent>
                {list.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Henüz GES teklif talebi yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Tarih</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Ad Soyad</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Telefon</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Şehir</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Tip</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">kWp / Tüketim</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Ek teklif</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Not</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((row) => (
                          <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleString('tr-TR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">{row.fullName}</td>
                            <td className="py-3 px-4">
                              <a
                                href={`tel:${row.phone}`}
                                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline"
                              >
                                <Phone className="w-4 h-4" />
                                {row.phone}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {row.city}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {row.installationType ? INSTALLATION_TYPE_LABELS[row.installationType] ?? row.installationType : '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {row.suggestedKwp != null && <span>{row.suggestedKwp} kWp</span>}
                              {row.suggestedKwp != null && row.monthlyKwh != null && ' · '}
                              {row.monthlyKwh != null && <span>{row.monthlyKwh} kWh/ay</span>}
                              {row.suggestedKwp == null && row.monthlyKwh == null && '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {(row.wantsEvChargingQuote === true || row.wantsLightingQuote === true) ? (
                                <span className="flex flex-wrap gap-1">
                                  {row.wantsEvChargingQuote === true && <span className="inline-flex rounded bg-teal-100 px-1.5 py-0.5 text-xs text-teal-800">Şarj</span>}
                                  {row.wantsLightingQuote === true && <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">Aydınlatma</span>}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-500 max-w-[200px] truncate">
                              {row.notes || '—'}
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
        </TabsContent>

        <TabsContent value="verifications" className="space-y-4">
          {loadingVerifications ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
          ) : (
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  Teklif Doğrulamaları ({verifications.length})
                </CardTitle>
                <CardDescription>Müşterilerin aldıkları teklifleri doğrulamak için doldurduğu formlar</CardDescription>
              </CardHeader>
              <CardContent>
                {verifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Henüz teklif doğrulama kaydı yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Tarih</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Firma</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Toplam bedel</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">kWp</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Panel</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">İletişim</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Uyarı</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verifications.map((row) => (
                          <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                            <td className="py-3 px-4 text-sm text-slate-600">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleString('tr-TR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">{row.companyName}</td>
                            <td className="py-3 px-4 text-sm text-slate-700">
                              {row.totalPriceTry != null
                                ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(row.totalPriceTry)
                                : '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700">{row.totalKwp ?? '—'}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 max-w-[140px] truncate" title={row.panelBrandModel ?? undefined}>
                              {row.panelBrandModel || '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">
                              <span className="block truncate max-w-[160px]" title={row.contactName ?? row.contactEmail ?? row.contactPhone ?? undefined}>
                                {row.contactName || row.contactEmail || row.contactPhone || '—'}
                              </span>
                              {row.contactPhone && (
                                <a href={`tel:${row.contactPhone}`} className="inline-flex items-center gap-1 text-teal-600 hover:underline text-xs">
                                  <Phone className="w-3 h-3" />
                                  {row.contactPhone}
                                </a>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {redFlagCount(row) > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800" title={Array.isArray(row.redFlags) ? row.redFlags.join('\n') : ''}>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {redFlagCount(row)}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">0</span>
                              )}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
