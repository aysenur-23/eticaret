'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sun, Calculator, Mail, Info, FileCheck, Loader2, CheckCircle, Settings, Zap, Banknote, CircleDollarSign, ChevronDown } from 'lucide-react'
import {
  GES_REGIONS,
  MONTHLY_KWH_MIN,
  MONTHLY_KWH_MAX,
  SUN_HOURS_MIN,
  SUN_HOURS_MAX,
  PR_MIN,
  PR_MAX,
  GES_DEFAULT_PR,
} from '@/lib/ges-constants'
import { gesCalculationRanges, type GesCalcRanges } from '@/lib/ges-calc'
import { TR_CITIES, getDistrictsByCity } from '@/lib/tr-cities'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { getAddresses } from '@/lib/firebase/firestore'

const CONTACT_DRAFT_KEY = 'site_contact_draft'

type FormState = {
  fullName: string
  phone: string
  email: string
  city: string
  district: string
  propertyType: string
  monthlyBillRange: string
  monthlyKwh: string
  subscriberType: string
  threePhase: string
  installationAreaType: string
  roofType: string
  roofAreaRange: string
  shading: string
  deedStatus: string
  usageGoal: string[]
  storagePreference: string
  budgetRange: string
  attachmentBillUrl: string
  attachmentRoofUrl: string
  kvkkAccepted: boolean
  callAccepted: boolean
}

const initialForm: FormState = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  propertyType: '',
  monthlyBillRange: '',
  monthlyKwh: '',
  subscriberType: '',
  threePhase: '',
  installationAreaType: '',
  roofType: '',
  roofAreaRange: '',
  shading: '',
  deedStatus: '',
  usageGoal: [],
  storagePreference: '',
  budgetRange: '',
  attachmentBillUrl: '',
  attachmentRoofUrl: '',
  kvkkAccepted: false,
  callAccepted: false,
}

export default function GesPage() {
  const t = useTranslations('ges')
  const tFooter = useTranslations('footer')
  const { user, isAuthenticated } = useAuthStore()

  // 1. Calculator State
  const [calcMonthlyKwh, setCalcMonthlyKwh] = useState<string>('')
  const [regionId, setRegionId] = useState<string>('')
  const [sunHours, setSunHours] = useState<string>('5')
  const [performanceRatio, setPerformanceRatio] = useState<string>(String(GES_DEFAULT_PR))
  const [calcErrors, setCalcErrors] = useState<{ monthlyKwh?: string; sunHours?: string; pr?: string }>({})
  const [calcResult, setCalcResult] = useState<GesCalcRanges | null>(null)
  const [kvkkDialogOpen, setKvkkDialogOpen] = useState(false)

  // 2. Form State
  const [form, setForm] = useState<FormState>(initialForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const districts = form.city ? getDistrictsByCity(form.city) : []

  // Effects for Form
  useEffect(() => {
    let mounted = true
    const draft = (() => {
      if (typeof window === 'undefined') return {}
      try {
        const raw = localStorage.getItem(CONTACT_DRAFT_KEY)
        return raw ? (JSON.parse(raw) as Record<string, string>) : {}
      } catch {
        return {}
      }
    })()

    if (isAuthenticated && user?.id) {
      getAddresses(user.id)
        .then((addresses) => {
          if (!mounted) return
          const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0]
          setForm((prev) => ({
            ...prev,
            fullName: user.name?.trim() || draft.fullName || prev.fullName,
            phone: user.phone?.trim() || draft.phone || prev.phone,
            email: user.email?.trim() || draft.email || prev.email,
            city: defaultAddr?.city?.trim() || draft.city || prev.city,
            district: defaultAddr?.district?.trim() || prev.district,
          }))
        })
        .catch(() => {
          if (!mounted) return
          setForm((prev) => ({
            ...prev,
            fullName: user.name?.trim() || draft.fullName || prev.fullName,
            phone: user.phone?.trim() || draft.phone || prev.phone,
            email: user.email?.trim() || draft.email || prev.email,
            city: draft.city || prev.city,
          }))
        })
    } else {
      setForm((prev) => ({
        ...prev,
        fullName: draft.fullName || prev.fullName,
        phone: draft.phone || prev.phone,
        email: draft.email || prev.email,
        city: draft.city || prev.city,
      }))
    }
    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id, user?.name, user?.phone, user?.email])

  useEffect(() => {
    if (form.city && !districts.includes(form.district)) {
      setForm((prev) => ({ ...prev, district: '' }))
    }
  }, [form.city, form.district, districts])

  // Calculator Handlers
  const applyRegionSunHours = useCallback((hours: number) => {
    setSunHours(String(hours))
  }, [])

  const handleRegionChange = (value: string) => {
    setRegionId(value)
    const region = GES_REGIONS.find((r) => r.id === value)
    if (region) applyRegionSunHours(region.sunHours)
  }

  const validateCalc = useCallback((): boolean => {
    const kwh = parseFloat(calcMonthlyKwh.replace(',', '.'))
    const hours = parseFloat(sunHours.replace(',', '.'))
    const pr = parseFloat(performanceRatio.replace(',', '.'))
    const next: { monthlyKwh?: string; sunHours?: string; pr?: string } = {}

    if (!Number.isFinite(kwh) || kwh < MONTHLY_KWH_MIN || kwh > MONTHLY_KWH_MAX) {
      next.monthlyKwh = t('errorInvalidKwh')
    }
    if (!Number.isFinite(hours) || hours < SUN_HOURS_MIN || hours > SUN_HOURS_MAX) {
      next.sunHours = t('errorInvalidSunHours')
    }
    if (!Number.isFinite(pr) || pr < PR_MIN || pr > PR_MAX) {
      next.pr = t('errorInvalidPr')
    }

    setCalcErrors(next)
    return Object.keys(next).length === 0
  }, [calcMonthlyKwh, sunHours, performanceRatio, t])

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setCalcResult(null)
    if (!validateCalc()) return

    const kwh = parseFloat(calcMonthlyKwh.replace(',', '.'))
    const hours = parseFloat(sunHours.replace(',', '.'))
    const pr = parseFloat(performanceRatio.replace(',', '.'))

    const ranges = gesCalculationRanges(kwh, hours, pr)
    setCalcResult(ranges)

    setForm(prev => ({ ...prev, monthlyKwh: String(kwh) }))
  }

  // Form Handlers
  const set = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }))
    setFormErrors((prev) => {
      const next = { ...prev }
      Object.keys(updates).forEach((k) => delete next[k])
      return next
    })
  }

  const validateForm = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = t('quoteForm.errorFullName')
    }
    if (!form.phone.trim() || form.phone.replace(/\s/g, '').length < 10) {
      next.phone = t('quoteForm.errorPhone')
    }
    if (!form.city.trim()) {
      next.city = t('quoteForm.errorCity')
    }
    if (!form.kvkkAccepted) {
      next.kvkkAccepted = t('quoteForm.errorKvkk')
    }
    if (!form.callAccepted) {
      next.callAccepted = t('quoteForm.errorCall')
    }
    setFormErrors(next)
    return Object.keys(next).length === 0
  }

  const uploadDirRef = React.useRef<string | null>(null)
  const getUploadDir = () => {
    if (!uploadDirRef.current) {
      uploadDirRef.current = `ges-attachments/${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`}`
    }
    return uploadDirRef.current
  }

  const handleFileUpload = async (field: 'attachmentBillUrl' | 'attachmentRoofUrl', file: File) => {
    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, [field]: `Dosya en fazla ${MAX_SIZE_MB} MB olabilir.` }))
      return
    }
    setUploading(field)
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    try {
      const { getStorage } = await import('@/lib/firebase/config')
      const storage = getStorage()
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
      const path = `${getUploadDir()}/${field}_${safeName}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' })
      const url = await getDownloadURL(storageRef)
      set({ [field]: url })
    } catch (err) {
      console.error('GES file upload error:', err)
      setFormErrors((prev) => ({ ...prev, [field]: 'Yükleme başarısız. Lütfen tekrar deneyin.' }))
      const fileName = file.name
      const fileSize = (file.size / 1024).toFixed(1) + ' KB'
      set({ [field]: `${fileName} (${fileSize})` })
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent, excludeInstallationCost = false) => {
    e.preventDefault()
    if (!validateForm() || submitting) return
    setSubmitting(true)
    setFormErrors({})
    try {
      const body: Record<string, unknown> = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim().replace(/\s/g, ''),
        city: form.city.trim(),
        kvkkAccepted: form.kvkkAccepted,
        callAccepted: form.callAccepted,
        excludeInstallationCost,
        fullQuoteRequested: !excludeInstallationCost,
      }
      if (form.email.trim()) body.email = form.email.trim()
      if (form.district.trim()) body.district = form.district.trim()
      if (form.propertyType) body.propertyType = form.propertyType
      if (form.monthlyBillRange) body.monthlyBillRange = form.monthlyBillRange
      const kwh = parseFloat(form.monthlyKwh.replace(',', '.'))
      if (Number.isFinite(kwh)) body.monthlyKwh = kwh
      if (regionId) body.regionId = regionId
      if (calcResult?.kwp != null) body.suggestedKwp = calcResult.kwp
      if (form.subscriberType) body.subscriberType = form.subscriberType
      if (form.threePhase) body.threePhase = form.threePhase
      if (form.installationAreaType) body.installationAreaType = form.installationAreaType
      if (form.roofType) body.roofType = form.roofType
      if (form.roofAreaRange) body.roofAreaRange = form.roofAreaRange
      if (form.shading) body.shading = form.shading
      if (form.deedStatus) body.deedStatus = form.deedStatus
      if (form.usageGoal.length) body.usageGoal = form.usageGoal.join(',')
      if (form.storagePreference) body.storagePreference = form.storagePreference
      if (form.budgetRange) body.budgetRange = form.budgetRange
      if (form.attachmentBillUrl) body.attachmentBillUrl = form.attachmentBillUrl
      if (form.attachmentRoofUrl) body.attachmentRoofUrl = form.attachmentRoofUrl

      const { collection: col, addDoc, serverTimestamp: srvTs } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await addDoc(col(db, 'gesQuotes'), {
        ...body,
        createdAt: srvTs(),
      })

      const notifyRes = await fetch('/api/ges-quote/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!notifyRes.ok) {
        const data = await notifyRes.json().catch(() => ({}))
        console.error('GES notify error:', data.error || notifyRes.statusText)
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            CONTACT_DRAFT_KEY,
            JSON.stringify({
              fullName: form.fullName.trim(),
              phone: form.phone.trim(),
              city: form.city.trim(),
              email: form.email.trim(),
            })
          )
        } catch { }
      }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setFormErrors({ submit: t('quoteForm.errorSubmit') })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleUsageGoal = (value: string) => {
    setForm((prev) => ({
      ...prev,
      usageGoal: prev.usageGoal.includes(value)
        ? prev.usageGoal.filter((v) => v !== value)
        : [...prev.usageGoal, value],
    }))
  }

  return (
    <ClassicPageShell
      breadcrumbs={[
        { label: tFooter('home'), href: '/' },
        { label: t('title'), href: '/ges' },
      ]}
    >
      <div className="min-h-screen py-12 md:py-16 bg-gradient-to-b from-surface via-surface to-brand-light/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* 1. Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 text-brand mb-2">
                <Sun className="w-7 h-7" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
                {t('title')}
              </h1>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
                {t('description')}
              </p>
            </div>

            {success ? (
              <Card className="border-0 shadow-xl shadow-brand/10 bg-white overflow-hidden">
                <CardContent className="py-16 text-center px-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-2">{t('quoteForm.successTitle')}</h3>
                  <p className="text-lg text-ink-muted mb-8 max-w-md mx-auto">{t('quoteForm.successMessage')}</p>
                  <Button onClick={() => setSuccess(false)} size="lg" className="rounded-xl px-8">
                    Yeni bir form doldur
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl shadow-black/5 overflow-hidden bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8 md:p-10">
                  <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-12">
                    {/* 1. Temel bilgiler */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-palette/80">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand text-white font-bold text-sm shadow-lg shadow-brand/25">
                          1
                        </span>
                        <h3 className="font-bold text-xl text-ink tracking-tight">
                          {t('quoteForm.sectionBasic')}
                        </h3>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2 [&>div]:min-w-0">
                        <div className="space-y-2 min-w-0">
                          <Label htmlFor="fullName" className="text-ink font-medium">{t('quoteForm.fullName')} *</Label>
                          <Input
                            id="fullName"
                            value={form.fullName}
                            onChange={(e) => set({ fullName: e.target.value })}
                            placeholder={t('quoteForm.fullNamePlaceholder')}
                            aria-invalid={!!formErrors.fullName}
                            className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20 transition-shadow"
                          />
                          {formErrors.fullName && (
                            <p className="text-sm text-destructive">{formErrors.fullName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-ink font-medium">{t('quoteForm.phone')} *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => set({ phone: e.target.value })}
                            placeholder={t('quoteForm.phonePlaceholder')}
                            aria-invalid={!!formErrors.phone}
                            className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20 transition-shadow"
                          />
                          {formErrors.phone && (
                            <p className="text-sm text-destructive">{formErrors.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-ink font-medium">{t('quoteForm.email')}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => set({ email: e.target.value })}
                            placeholder={t('quoteForm.emailPlaceholder')}
                            className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20 transition-shadow"
                          />
                        </div>
                        <div className="space-y-2 min-w-0">
                          <Label className="text-ink font-medium">{t('quoteForm.city')} *</Label>
                          <Select
                            value={form.city ?? ''}
                            onValueChange={(v) => set({ city: v || '', district: '' })}
                          >
                            <SelectTrigger id="city" aria-invalid={!!formErrors.city} className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20 transition-shadow">
                              <SelectValue placeholder={t('quoteForm.cityPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {TR_CITIES.map((c) => (
                                <SelectItem key={c.name} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.city && (
                            <p className="text-sm text-destructive">{formErrors.city}</p>
                          )}
                        </div>
                        {districts.length > 0 && (
                          <div className="space-y-2">
                            <Label>{t('quoteForm.district')}</Label>
                            <Select
                              value={form.district ?? ''}
                              onValueChange={(v) => set({ district: v || '' })}
                            >
                              <SelectTrigger id="district" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                                <SelectValue placeholder={t('quoteForm.districtPlaceholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                {districts.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.propertyType')}</Label>
                          <Select
                            value={form.propertyType ?? ''}
                            onValueChange={(v) => set({ propertyType: v || '' })}
                          >
                            <SelectTrigger id="propertyType" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mustakil_ev">{t('quoteForm.propertyTypeMustakil')}</SelectItem>
                              <SelectItem value="site_villa">{t('quoteForm.propertyTypeSite')}</SelectItem>
                              <SelectItem value="apartman_cati">{t('quoteForm.propertyTypeApartman')}</SelectItem>
                              <SelectItem value="dukkan">{t('quoteForm.propertyTypeDukkan')}</SelectItem>
                              <SelectItem value="atolye">{t('quoteForm.propertyTypeAtolye')}</SelectItem>
                              <SelectItem value="fabrika">{t('quoteForm.propertyTypeFabrika')}</SelectItem>
                              <SelectItem value="tarimsal">{t('quoteForm.propertyTypeTarim')}</SelectItem>
                              <SelectItem value="depo">{t('quoteForm.propertyTypeDepo')}</SelectItem>
                              <SelectItem value="diger">{t('quoteForm.propertyTypeDiger')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.budgetRange')}</Label>
                          <Select
                            value={form.budgetRange ?? ''}
                            onValueChange={(v) => set({ budgetRange: v || '' })}
                          >
                            <SelectTrigger id="budgetRange" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="100k_alti">{t('quoteForm.budget100kAlt')}</SelectItem>
                              <SelectItem value="100_300k">{t('quoteForm.budget100_300k')}</SelectItem>
                              <SelectItem value="300_1000k">{t('quoteForm.budget300_1000k')}</SelectItem>
                              <SelectItem value="1m_ustu">{t('quoteForm.budget1mPlus')}</SelectItem>
                              <SelectItem value="teklif_istiyorum">{t('quoteForm.budgetTeklif')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 2. Elektrik */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-palette/80">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand text-white font-bold text-sm shadow-lg shadow-brand/25">
                          2
                        </span>
                        <h3 className="font-bold text-xl text-ink tracking-tight">
                          {t('quoteForm.sectionElectricity')}
                        </h3>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2 [&>div]:min-w-0">
                        <div className="space-y-2 min-w-0">
                          <Label className="text-ink font-medium">{t('quoteForm.monthlyBillRange')}</Label>
                          <Select
                            value={form.monthlyBillRange ?? ''}
                            onValueChange={(v) => set({ monthlyBillRange: v || '' })}
                          >
                            <SelectTrigger id="monthlyBillRange" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0_1000">{t('quoteForm.monthlyBill0_1000')}</SelectItem>
                              <SelectItem value="1000_3000">{t('quoteForm.monthlyBill1000_3000')}</SelectItem>
                              <SelectItem value="3000_10000">{t('quoteForm.monthlyBill3000_10000')}</SelectItem>
                              <SelectItem value="10000_25000">{t('quoteForm.monthlyBill10000_25000')}</SelectItem>
                              <SelectItem value="25k_plus">{t('quoteForm.monthlyBill25kPlus')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyKwh" className="text-ink font-medium">{t('quoteForm.monthlyKwhFree')}</Label>
                          <input
                            id="monthlyKwh"
                            type="text"
                            inputMode="decimal"
                            value={calcMonthlyKwh}
                            onChange={(e) => {
                              setCalcMonthlyKwh(e.target.value)
                              set({ monthlyKwh: e.target.value })
                              if (calcErrors.monthlyKwh) setCalcErrors(prev => ({ ...prev, monthlyKwh: undefined }))
                            }}
                            placeholder="Örn. 350"
                            className="flex h-12 w-full rounded-xl border border-palette bg-surface/50 px-4 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-invalid={!!calcErrors.monthlyKwh}
                          />
                          {calcErrors.monthlyKwh && (
                            <p className="text-sm text-destructive">{calcErrors.monthlyKwh}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.subscriberType')}</Label>
                          <Select
                            value={form.subscriberType ?? ''}
                            onValueChange={(v) => set({ subscriberType: v || '' })}
                          >
                            <SelectTrigger id="subscriberType" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mesken">{t('quoteForm.subscriberMesken')}</SelectItem>
                              <SelectItem value="ticarethane">{t('quoteForm.subscriberTicaret')}</SelectItem>
                              <SelectItem value="sanayi">{t('quoteForm.subscriberSanayi')}</SelectItem>
                              <SelectItem value="tarimsal_sulama">{t('quoteForm.subscriberTarim')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.threePhase')}</Label>
                          <Select
                            value={form.threePhase ?? ''}
                            onValueChange={(v) => set({ threePhase: v || '' })}
                          >
                            <SelectTrigger id="threePhase" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="evet">{t('quoteForm.threePhaseYes')}</SelectItem>
                              <SelectItem value="hayir">{t('quoteForm.threePhaseNo')}</SelectItem>
                              <SelectItem value="bilmiyorum">{t('quoteForm.threePhaseUnknown')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 3–5. İsteğe bağlı: Kurulum alanı, Sistem tercihleri, Dosyalar */}
                    <details className="group rounded-2xl border border-palette/80 bg-surface/30 overflow-hidden shadow-sm">
                      <summary className="flex items-center justify-between gap-3 font-semibold text-ink cursor-pointer list-none px-6 py-4 hover:bg-brand/5 transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand/15 text-brand font-bold text-sm">
                            3
                          </span>
                          Ek bilgiler (isteğe bağlı)
                        </span>
                        <ChevronDown className="w-5 h-5 text-ink-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-10 px-0 pt-4 pb-6">
                    {/* Kurulum alanı bilgileri (tek 3 üstte) */}
                    <div className="space-y-6 px-6">
                      <h3 className="font-bold text-lg text-ink pb-3 border-b border-palette/80">
                        {t('quoteForm.sectionArea')}
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2 [&>div]:min-w-0">
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0 [&>div]:min-w-0">
                          <div className="space-y-2">
                            <Label htmlFor="region" className="text-ink font-medium">{t('regionLabel')}</Label>
                            <Select value={regionId ?? ''} onValueChange={handleRegionChange}>
                              <SelectTrigger id="region" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                                <SelectValue placeholder={t('regionPlaceholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                {GES_REGIONS.map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    {t(`region.${r.id}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sunHours" className="text-ink font-medium">{t('sunHours')}</Label>
                            <input
                              id="sunHours"
                              type="text"
                              inputMode="decimal"
                              value={sunHours}
                              onChange={(e) => {
                                setSunHours(e.target.value)
                                if (calcErrors.sunHours) setCalcErrors(prev => ({ ...prev, sunHours: undefined }))
                              }}
                              className="flex h-12 w-full rounded-xl border border-palette bg-surface/50 px-4 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-invalid={!!calcErrors.sunHours}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="performanceRatio" className="text-ink font-medium">Verim (PR)</Label>
                            <input
                              id="performanceRatio"
                              type="text"
                              inputMode="decimal"
                              value={performanceRatio}
                              onChange={(e) => {
                                setPerformanceRatio(e.target.value)
                                if (calcErrors.pr) setCalcErrors(prev => ({ ...prev, pr: undefined }))
                              }}
                              className="flex h-12 w-full rounded-xl border border-palette bg-surface/50 px-4 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-invalid={!!calcErrors.pr}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.installationAreaType')}</Label>
                          <Select
                            value={form.installationAreaType ?? ''}
                            onValueChange={(v) => set({ installationAreaType: v || '' })}
                          >
                            <SelectTrigger id="installationAreaType" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cati">{t('quoteForm.areaCati')}</SelectItem>
                              <SelectItem value="arazi">{t('quoteForm.areaArazi')}</SelectItem>
                              <SelectItem value="carport">{t('quoteForm.areaCarport')}</SelectItem>
                              <SelectItem value="cephe">{t('quoteForm.areaCephe')}</SelectItem>
                              <SelectItem value="bilmiyorum">{t('quoteForm.areaUnknown')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.roofType')}</Label>
                          <Select
                            value={form.roofType ?? ''}
                            onValueChange={(v) => set({ roofType: v || '' })}
                          >
                            <SelectTrigger id="roofType" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="betonarme_duz">{t('quoteForm.roofBetonarme')}</SelectItem>
                              <SelectItem value="kiremit">{t('quoteForm.roofKiremit')}</SelectItem>
                              <SelectItem value="sandvic">{t('quoteForm.roofSandvic')}</SelectItem>
                              <SelectItem value="trapez">{t('quoteForm.roofTrapez')}</SelectItem>
                              <SelectItem value="bilmiyorum">{t('quoteForm.roofUnknown')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.roofAreaRange')}</Label>
                          <Select
                            value={form.roofAreaRange ?? ''}
                            onValueChange={(v) => set({ roofAreaRange: v || '' })}
                          >
                            <SelectTrigger id="roofAreaRange" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0_50">{t('quoteForm.roofArea0_50')}</SelectItem>
                              <SelectItem value="50_100">{t('quoteForm.roofArea50_100')}</SelectItem>
                              <SelectItem value="100_250">{t('quoteForm.roofArea100_250')}</SelectItem>
                              <SelectItem value="250_plus">{t('quoteForm.roofArea250Plus')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.shading')}</Label>
                          <Select
                            value={form.shading ?? ''}
                            onValueChange={(v) => set({ shading: v || '' })}
                          >
                            <SelectTrigger id="shading" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hayir">{t('quoteForm.shadingNo')}</SelectItem>
                              <SelectItem value="baca">{t('quoteForm.shadingBaca')}</SelectItem>
                              <SelectItem value="agac">{t('quoteForm.shadingAgac')}</SelectItem>
                              <SelectItem value="komsu">{t('quoteForm.shadingKomsu')}</SelectItem>
                              <SelectItem value="emin_degilim">{t('quoteForm.shadingUnsure')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ink font-medium">{t('quoteForm.deedStatus')}</Label>
                          <Select
                            value={form.deedStatus ?? ''}
                            onValueChange={(v) => set({ deedStatus: v || '' })}
                          >
                            <SelectTrigger id="deedStatus" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kendi">{t('quoteForm.deedOwn')}</SelectItem>
                              <SelectItem value="kiracı">{t('quoteForm.deedRenter')}</SelectItem>
                              <SelectItem value="ortak">{t('quoteForm.deedShared')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 4. Sistem tercihleri */}
                    <div className="space-y-6 px-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-palette/80">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/15 text-brand font-bold text-xs">4</span>
                        <h3 className="font-bold text-lg text-ink">{t('quoteForm.sectionSystem')}</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-ink">{t('quoteForm.usageGoal')}</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { v: 'fatura_sifir', key: 'usageFatura' },
                              { v: 'satis', key: 'usageSatis' },
                              { v: 'kismi_tasarruf', key: 'usageKismi' },
                              { v: 'yedekleme', key: 'usageYedek' },
                              { v: 'offgrid', key: 'usageOffgrid' },
                            ].map(({ v, key }) => (
                              <label key={v} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-palette/80 bg-white/60 hover:border-brand/30 hover:bg-brand/5 hover:shadow-sm transition-all">
                                <input
                                  type="checkbox"
                                  checked={form.usageGoal.includes(v)}
                                  onChange={() => toggleUsageGoal(v)}
                                  className="h-5 w-5 rounded border-palette text-brand focus:ring-brand"
                                />
                                <span className="text-sm font-medium">{t(`quoteForm.${key}`)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 [&>div]:min-w-0">
                          <div className="space-y-2 min-w-0">
                            <Label className="text-ink font-medium">{t('quoteForm.storagePreference')}</Label>
                            <Select
                              value={form.storagePreference ?? ''}
                              onValueChange={(v) => set({ storagePreference: v || '' })}
                            >
                              <SelectTrigger id="storagePreference" className="h-12 w-full rounded-xl border-palette bg-surface/50 focus:ring-2 focus:ring-brand/20">
                                <SelectValue placeholder="Seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hayir">{t('quoteForm.storageNo')}</SelectItem>
                                <SelectItem value="evet_kesinti">{t('quoteForm.storageKesinti')}</SelectItem>
                                <SelectItem value="evet_enerji_satis">{t('quoteForm.storageEnerji')}</SelectItem>
                                <SelectItem value="kararsiz">{t('quoteForm.storageUnsure')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Dosyalar */}
                    <div className="space-y-6 px-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-palette/80">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/15 text-brand font-bold text-xs">5</span>
                        <h3 className="font-bold text-lg text-ink">{t('quoteForm.sectionFiles')}</h3>
                      </div>
                      <div className="bg-brand/5 rounded-xl p-4 flex items-start gap-3 border border-brand/10">
                        <Info className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-muted leading-relaxed">{t('quoteForm.uploadHint')}</p>
                      </div>
                      <div className="grid gap-6">
                        {(
                          [
                            { key: 'attachmentBillUrl' as const, label: t('quoteForm.fileBill') },
                            { key: 'attachmentRoofUrl' as const, label: t('quoteForm.fileRoof') },
                          ] as const
                        ).map(({ key, label }) => (
                          <div key={key} className="p-4 rounded-xl border border-palette bg-surface/50">
                            <Label className="text-sm font-bold mb-3 block">{label}</Label>
                            <div className="flex items-center gap-4">
                              <div className="relative flex-1">
                                <Label className="sr-only">Dosya seç</Label>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                                  className="flex h-12 w-full rounded-xl border border-palette bg-surface/50 px-4 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand/20 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={!!uploading}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(key, file)
                                    e.target.value = ''
                                  }}
                                />
                                {form[key] && (
                                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500 bg-white rounded-full" />
                                )}
                              </div>
                              {uploading === key && (
                                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                              )}
                              {form[key] && (
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">Yüklendi</span>
                              )}
                            </div>
                            {formErrors[key] && (
                              <p className="text-sm text-destructive mt-2">{formErrors[key]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                      </div>
                    </details>

                    {/* 6. Onay ve Hesaplama */}
                    <div className="space-y-8 pt-8 border-t-2 border-palette/60">
                      <div className="rounded-2xl bg-surface/50 border border-palette/80 p-5 space-y-4">
                        <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-white/60 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.kvkkAccepted}
                            onChange={(e) => set({ kvkkAccepted: e.target.checked })}
                            className="mt-0.5 h-5 w-5 rounded-md border-2 border-palette text-brand focus:ring-2 focus:ring-brand/30"
                            aria-invalid={!!formErrors.kvkkAccepted}
                          />
                          <span className="text-sm text-ink group-hover:text-ink/90 transition-colors">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setKvkkDialogOpen(true)
                              }}
                              className="underline font-medium text-brand hover:text-brand/80 focus:outline-none focus:ring-2 focus:ring-brand/30 rounded px-0.5 -mx-0.5"
                            >
                              {t('quoteForm.kvkkLinkText')}
                            </button>
                            {' '}{t('quoteForm.kvkkLabelSuffix')}
                          </span>
                        </label>
                        {formErrors.kvkkAccepted && (
                          <p className="text-sm text-destructive ml-9">{formErrors.kvkkAccepted}</p>
                        )}
                        <Dialog open={kvkkDialogOpen} onOpenChange={setKvkkDialogOpen}>
                          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl text-ink pr-8">
                                KVKK Aydınlatma Metni
                              </DialogTitle>
                            </DialogHeader>
                            <div className="text-sm text-ink space-y-4 pr-2">
                              <p><strong>1. Veri Sorumlusu</strong></p>
                              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu olarak Batarya Kit (şirket unvanı ve iletişim bilgileri) tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

                              <p><strong>2. İşlenen Kişisel Veriler ve Amaçları</strong></p>
                              <p>GES teklif formu aracılığıyla toplanan ad soyad, telefon numarası, e-posta adresi, şehir/ilçe, mülk türü, tahmini bütçe, elektrik tüketim bilgileri ve kurulum alanına ilişkin bilgileriniz; teklif talebinizin değerlendirilmesi, sizinle iletişime geçilmesi, teknik keşif ve fiyat teklifi sunulması amacıyla işlenmektedir. İsteğe bağlı olarak paylaştığınız dosya veya ek bilgiler yalnızca teklif sürecinde kullanılmaktadır.</p>

                              <p><strong>3. Hukuki Sebep</strong></p>
                              <p>Bu verilerin işlenmesi, KVKK’nın 5. ve 6. maddelerine dayanmaktadır; özellikle açık rızanız, teklif ve sözleşme süreçlerinin yürütülmesi ile meşru menfaatlerimiz çerçevesinde gerçekleştirilmektedir.</p>

                              <p><strong>4. Verilerin Aktarımı</strong></p>
                              <p>Toplanan verileriniz, yalnızca hukuki zorunluluk veya hizmet sağlayıcılarımız (örn. e-posta/sunucu hizmetleri) ile sınırlı ve gerekli ölçüde paylaşılabilir; yurt dışına aktarım yapılması halinde KVKK’daki usullere uyulacaktır.</p>

                              <p><strong>5. Saklama Süresi</strong></p>
                              <p>Kişisel verileriniz, teklif ve iletişim süreçlerinin gerektirdiği süre boyunca ve yasal saklama süreleriyle sınırlı olarak saklanacak; bu süreler sonunda silinecek veya anonim hale getirilecektir.</p>

                              <p><strong>6. Haklarınız</strong></p>
                              <p>KVKK’nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, düzeltme ve silme işlemlerinin üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için veri sorumlusuna yazılı veya elektronik ortamda başvurabilirsiniz.</p>

                              <p className="text-ink-muted pt-2">Son güncelleme: Bu metin, form gönderimi öncesinde okunup kabul edilmesi amacıyla sunulmaktadır.</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-white/60 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.callAccepted}
                            onChange={(e) => set({ callAccepted: e.target.checked })}
                            className="mt-0.5 h-5 w-5 rounded-md border-2 border-palette text-brand focus:ring-2 focus:ring-brand/30"
                            aria-invalid={!!formErrors.callAccepted}
                          />
                          <span className="text-sm text-ink group-hover:text-ink/90 transition-colors">{t('quoteForm.callLabel')}</span>
                        </label>
                        {formErrors.callAccepted && (
                          <p className="text-sm text-destructive ml-9">{formErrors.callAccepted}</p>
                        )}
                      </div>

                      {calcResult && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 transition-shadow">
                              <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                                  <Settings className="w-6 h-6 text-brand" />
                                </div>
                                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{t('roofPotential')}</p>
                                <p className="text-base font-black text-ink mt-2 tabular-nums">
                                  {calcResult.kwpMin.toLocaleString('tr-TR')} ~ {calcResult.kwpMax.toLocaleString('tr-TR')} kWp
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 transition-shadow">
                              <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                                  <Zap className="w-6 h-6 text-amber-600" />
                                </div>
                                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{t('energyToProduce')}</p>
                                <p className="text-base font-black text-ink mt-2 tabular-nums">
                                  {calcResult.annualKwhMin.toLocaleString('tr-TR')} ~ {calcResult.annualKwhMax.toLocaleString('tr-TR')} kWh
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 transition-shadow">
                              <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                                  <Banknote className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{t('annualSavings')}</p>
                                <p className="text-base font-black text-ink mt-2 tabular-nums">
                                  {calcResult.savingsMin.toLocaleString('tr-TR')} ~ {calcResult.savingsMax.toLocaleString('tr-TR')} TL
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 transition-shadow">
                              <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-slate-200/80 flex items-center justify-center mb-3">
                                  <CircleDollarSign className="w-6 h-6 text-ink-muted" />
                                </div>
                                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{t('installationCost')}</p>
                                <p className="text-base font-black text-ink mt-2 tabular-nums">
                                  {calcResult.costMin.toLocaleString('tr-TR')} ~ {calcResult.costMax.toLocaleString('tr-TR')} TL
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-ink-muted bg-surface/50 rounded-xl p-3 border border-palette/60">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand" />
                            <span>{t('formulaNote')}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        {!calcResult ? (
                          <Button
                            type="button"
                            onClick={handleCalculate}
                            size="lg"
                            className="w-full h-14 text-lg font-bold gap-2 rounded-2xl shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 bg-brand hover:bg-brand-hover transition-all"
                          >
                            <Calculator className="w-5 h-5" />
                            {t('calculate')}
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCalcResult(null)}
                                size="lg"
                                className="flex-1 h-14 text-lg font-bold rounded-2xl border-2 border-palette hover:bg-surface/80 hover:border-brand/30"
                              >
                                Yeniden Hesapla
                              </Button>
                              <Button
                                type="submit"
                                size="lg"
                                disabled={submitting}
                                className="flex-[2] h-14 text-lg font-bold gap-2 rounded-2xl shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 bg-brand hover:bg-brand-hover transition-all"
                              >
                                {submitting ? (
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                  <Sun className="w-6 h-6" />
                                )}
                                {t('quoteForm.submit')}
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              disabled={submitting}
                              onClick={(e) => {
                                e.preventDefault()
                                handleSubmit(e as unknown as React.FormEvent, true)
                              }}
                              className="w-full h-12 text-base font-semibold rounded-2xl border-2 border-dashed border-palette hover:border-brand/40 hover:bg-brand/5 text-ink hover:text-brand transition-colors"
                            >
                              {t('submitWithoutInstallation')}
                            </Button>
                          </div>
                        )}
                        {formErrors.submit && (
                          <p className="p-4 bg-destructive/10 text-destructive text-sm rounded-2xl font-semibold border border-destructive/20">
                            {formErrors.submit}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <div className="flex justify-center">
              <Link href="/ges/teklif-dogrulama" className="group block">
                <Card className="border-0 shadow-lg shadow-black/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 hover:border-brand/20 transition-all bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">{t('quoteVerify.title')}</h4>
                      <p className="text-sm text-ink-muted mt-0.5">{t('quoteVerify.description')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ClassicPageShell>
  )
}
