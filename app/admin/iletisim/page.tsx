'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Search, Loader2, RefreshCw, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  emailSent: boolean
  createdAt: string
}

export default function AdminIletisimPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const { collection: col, getDocs, orderBy, query: fsQuery, limit } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()

      const q = fsQuery(col(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(200))
      const snap = await getDocs(q)

      const rows: ContactMessage[] = snap.docs.map((d) => {
        const data = d.data()
        const createdAt = data.createdAt as { seconds: number } | null
        return {
          id: d.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || null,
          subject: data.subject || '',
          message: data.message || '',
          emailSent: data.emailSent === true,
          createdAt: createdAt?.seconds ? new Date(createdAt.seconds * 1000).toISOString() : '',
        }
      })

      setMessages(rows)
    } catch (err) {
      console.error('Contact messages load error:', err)
      setMessages([])
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
    fetchMessages()
  }, [router])

  const filtered = messages.filter((m) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      (m.phone || '').includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">İletişim Formları</h1>
          <p className="text-slate-600 mt-1">
            {loading ? 'Yükleniyor...' : `${messages.length} mesaj`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(true)}
          disabled={refreshing || loading}
          className="w-fit"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200/80 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand" />
            Gelen Mesajlar
          </CardTitle>
          <CardDescription>{filtered.length} mesaj görüntüleniyor</CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 translate-y-[-30%] text-slate-400 w-4 h-4 pointer-events-none shrink-0" />
            <Input
              placeholder="Ad, e-posta, konu veya telefon ara..."
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
              <MessageSquare className="w-14 h-14 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">
                {searchQuery ? 'Mesaj bulunamadı.' : 'Henüz iletişim formu mesajı yok.'}
              </p>
              {!searchQuery && (
                <p className="text-sm text-slate-400 mt-1">
                  Ziyaretçiler iletişim formunu doldurduğunda burada görünecek.
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((msg) => {
                const isExpanded = expandedId === msg.id
                return (
                  <div key={msg.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Header row */}
                    <button
                      className="w-full text-left px-4 py-3"
                      onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 text-sm">{msg.name}</span>
                            {!msg.emailSent && (
                              <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">E-posta gönderilemedi</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 font-medium mt-0.5 truncate">{msg.subject}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{msg.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleString('tr-TR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-slate-50/80 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 mb-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Gönderen</p>
                            <p className="text-sm font-medium text-slate-900">{msg.name}</p>
                            <a
                              href={`mailto:${msg.email}`}
                              className="inline-flex items-center gap-1 text-sm text-brand hover:underline mt-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {msg.email}
                            </a>
                            {msg.phone && (
                              <a
                                href={`tel:${msg.phone}`}
                                className="flex items-center gap-1 text-sm text-slate-600 hover:underline mt-1"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                {msg.phone}
                              </a>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Konu</p>
                            <p className="text-sm text-slate-900">{msg.subject}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Mesaj</p>
                          <div className="bg-white rounded-lg border border-slate-200 p-3">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="inline-flex items-center gap-1.5 text-xs bg-brand text-white px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Yanıtla
                          </a>
                          {msg.phone && (
                            <a
                              href={`tel:${msg.phone}`}
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Ara
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
