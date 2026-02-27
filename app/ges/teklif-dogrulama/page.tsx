'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileCheck, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

type FormState = {
  companyName: string
  quoteDate: string
  totalPriceTry: string
  turnkey: string
  panelBrandModel: string
  panelWatt: string
  panelCount: string
  totalKwp: string
  panelTechnology: string
  panelEfficiencyPct: string
  warrantyProductYears: string
  warrantyPerformanceYears: string
  warrantyPerformance25Pct: string
  inverterBrandModel: string
  inverterTotalKw: string
  inverterType: string
  mpptCount: string
  storageCompatible: string
  batteryBrandModel: string
  batteryKwh: string
  batteryChemistry: string
  mountingType: string
  staticProjectProvided: string
  annualProductionKwh: string
  paybackYearsQuoted: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

const initialForm: FormState = {
  companyName: '',
  quoteDate: '',
  totalPriceTry: '',
  turnkey: '',
  panelBrandModel: '',
  panelWatt: '',
  panelCount: '',
  totalKwp: '',
  panelTechnology: '',
  panelEfficiencyPct: '',
  warrantyProductYears: '',
  warrantyPerformanceYears: '',
  warrantyPerformance25Pct: '',
  inverterBrandModel: '',
  inverterTotalKw: '',
  inverterType: '',
  mpptCount: '',
  storageCompatible: '',
  batteryBrandModel: '',
  batteryKwh: '',
  batteryChemistry: '',
  mountingType: '',
  staticProjectProvided: '',
  annualProductionKwh: '',
  paybackYearsQuoted: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
}

export default function GesTeklifDogrulamaPage() {
  const t = useTranslations('ges')
  const tFooter = useTranslations('footer')
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [redFlags, setRedFlags] = useState<string[]>([])

  const set = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(updates).forEach((k) => delete next[k])
      return next
    })
  }

  const num = (s: string) => {
    const n = parseFloat(s.replace(',', '.'))
    return Number.isFinite(n) ? n : undefined
  }
  const int = (s: string) => {
    const n = parseInt(s, 10)
    return Number.isFinite(n) ? n : undefined
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.companyName.trim() || form.companyName.trim().length < 2)
      next.companyName = 'Teklifi veren firma adı en az 2 karakter olmalıdır.'
    if (!form.quoteDate)
      next.quoteDate = 'Teklif tarihi zorunludur.'
    if (!form.totalPriceTry || (num(form.totalPriceTry) ?? 0) <= 0)
      next.totalPriceTry = 'Toplam fiyat (TL) zorunludur ve 0\'dan büyük olmalıdır.'
    if (!form.totalKwp || (num(form.totalKwp) ?? 0) <= 0)
      next.totalKwp = 'Toplam sistem gücü (kWp) zorunludur.'
    if (!form.panelBrandModel.trim() || form.panelBrandModel.trim().length < 2)
      next.panelBrandModel = 'Panel marka/model bilgisi zorunludur.'
    if (!form.panelCount || (int(form.panelCount) ?? 0) <= 0)
      next.panelCount = 'Panel adedi zorunludur.'
    if (!form.inverterBrandModel.trim() || form.inverterBrandModel.trim().length < 2)
      next.inverterBrandModel = 'İnverter marka/model bilgisi zorunludur.'
    if (!form.contactName.trim() || form.contactName.trim().length < 2)
      next.contactName = 'Ad soyad zorunludur.'
    if (!form.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim()))
      next.contactEmail = 'Geçerli bir e-posta adresi zorunludur.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    setErrors({})
    setRedFlags([])
    try {
      const body: Record<string, unknown> = {
        companyName: form.companyName.trim(),
      }
      if (form.quoteDate) body.quoteDate = form.quoteDate
      const price = num(form.totalPriceTry)
      if (price != null) body.totalPriceTry = price
      if (form.turnkey) body.turnkey = form.turnkey
      if (form.panelBrandModel) body.panelBrandModel = form.panelBrandModel
      const panelWatt = int(form.panelWatt)
      if (panelWatt != null) body.panelWatt = panelWatt
      const panelCount = int(form.panelCount)
      if (panelCount != null) body.panelCount = panelCount
      const totalKwp = num(form.totalKwp)
      if (totalKwp != null) body.totalKwp = totalKwp
      if (form.panelTechnology) body.panelTechnology = form.panelTechnology
      const eff = num(form.panelEfficiencyPct)
      if (eff != null) body.panelEfficiencyPct = eff
      const wp = int(form.warrantyProductYears)
      if (wp != null) body.warrantyProductYears = wp
      const wperf = int(form.warrantyPerformanceYears)
      if (wperf != null) body.warrantyPerformanceYears = wperf
      const w25 = num(form.warrantyPerformance25Pct)
      if (w25 != null) body.warrantyPerformance25Pct = w25
      if (form.inverterBrandModel) body.inverterBrandModel = form.inverterBrandModel
      const invKw = num(form.inverterTotalKw)
      if (invKw != null) body.inverterTotalKw = invKw
      if (form.inverterType) body.inverterType = form.inverterType
      const mppt = int(form.mpptCount)
      if (mppt != null) body.mpptCount = mppt
      if (form.storageCompatible) body.storageCompatible = form.storageCompatible
      if (form.batteryBrandModel) body.batteryBrandModel = form.batteryBrandModel
      const batKwh = num(form.batteryKwh)
      if (batKwh != null) body.batteryKwh = batKwh
      if (form.batteryChemistry) body.batteryChemistry = form.batteryChemistry
      if (form.mountingType) body.mountingType = form.mountingType
      if (form.staticProjectProvided) body.staticProjectProvided = form.staticProjectProvided
      const ann = num(form.annualProductionKwh)
      if (ann != null) body.annualProductionKwh = ann
      const payback = num(form.paybackYearsQuoted)
      if (payback != null) body.paybackYearsQuoted = payback
      if (form.contactName) body.contactName = form.contactName
      if (form.contactEmail) body.contactEmail = form.contactEmail
      if (form.contactPhone) body.contactPhone = form.contactPhone

      // Firestore'a GES teklif doğrulama talebi yaz + client-side red flag analizi
      const { collection: col, addDoc, serverTimestamp: srvTs } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()

      // Client-side red flag analizi
      const flags: string[] = []
      const kwp = num(form.totalKwp)
      const priceTry = num(form.totalPriceTry)
      const panelCountVal = int(form.panelCount)
      const panelWattVal = int(form.panelWatt)
      const annualProd = num(form.annualProductionKwh)
      const paybackYears = num(form.paybackYearsQuoted)

      if (kwp && priceTry) {
        const pricePerKwp = priceTry / kwp
        if (pricePerKwp < 8000) flags.push('kWp başına fiyat çok düşük — ekipman kalitesini sorgulayın.')
        if (pricePerKwp > 25000) flags.push('kWp başına fiyat ortalamanın üzerinde.')
      }
      if (panelCountVal && panelWattVal && kwp) {
        const calcKwp = (panelCountVal * panelWattVal) / 1000
        if (Math.abs(calcKwp - kwp) > 0.5) flags.push(`Panel adedi × Watt (${calcKwp.toFixed(1)} kWp) ile belirtilen toplam kWp (${kwp}) uyuşmuyor.`)
      }
      if (paybackYears && paybackYears < 3) flags.push('Amortisman süresi gerçekçi olmayabilir (3 yıldan kısa).')
      if (paybackYears && paybackYears > 12) flags.push('Amortisman süresi uzun — teklifin ekonomik fizibilitesini değerlendirin.')
      if (annualProd && kwp) {
        const cf = annualProd / (kwp * 8760)
        if (cf > 0.22) flags.push('Yıllık üretim tahmini iyimser olabilir.')
        if (cf < 0.10) flags.push('Yıllık üretim tahmini düşük — panel yönelimi/gölgelenme kontrol edin.')
      }

      await addDoc(col(db, 'gesVerifications'), {
        ...body,
        redFlags: flags,
        createdAt: srvTs(),
      })
      setRedFlags(flags)
      setSuccess(true)
    } catch {
      setErrors({ submit: 'Gönderilirken bir hata oluştu.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <ClassicPageShell
        breadcrumbs={[
          { label: tFooter('home'), href: '/' },
          { label: t('title'), href: '/ges' },
          { label: t('quoteVerify.title'), href: '/ges/teklif-dogrulama' },
        ]}
        title={t('quoteVerify.successTitle')}
        description={t('quoteVerify.successMessage')}
      >
        <div className="container mx-auto max-w-xl px-4 py-12 space-y-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <p className="text-lg text-ink">{t('quoteVerify.successMessage')}</p>
          </div>
          {redFlags.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                  {t('quoteVerify.redFlagsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                  {redFlags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {redFlags.length === 0 && (
            <p className="text-center text-ink-muted text-sm">{t('quoteVerify.redFlagsNone')}</p>
          )}
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/ges/teklif-dogrulama">Yeni doğrulama</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/ges">{t('quoteCheckCta')} / GES</Link>
            </Button>
          </div>
        </div>
      </ClassicPageShell>
    )
  }

  return (
    <ClassicPageShell
      breadcrumbs={[
        { label: tFooter('home'), href: '/' },
        { label: t('title'), href: '/ges' },
        { label: t('quoteVerify.title'), href: '/ges/teklif-dogrulama' },
      ]}
      title={t('quoteVerify.title')}
      description={t('quoteVerify.description')}
    >
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <Card className="border-palette shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="w-5 h-5 text-brand" />
              {t('quoteVerify.title')}
            </CardTitle>
            <p className="text-sm text-ink-muted">{t('quoteVerify.description')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  {t('quoteVerify.section1')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="companyName">{t('quoteVerify.companyName')} *</Label>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => set({ companyName: e.target.value })}
                      placeholder="Firma adı"
                      aria-invalid={!!errors.companyName}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">{errors.companyName}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="quoteDate">{t('quoteVerify.quoteDate')} *</Label>
                    <Input
                      id="quoteDate"
                      type="date"
                      value={form.quoteDate}
                      onChange={(e) => set({ quoteDate: e.target.value })}
                      aria-invalid={!!errors.quoteDate}
                    />
                    {errors.quoteDate && <p className="text-xs text-destructive">{errors.quoteDate}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="totalPriceTry">{t('quoteVerify.totalPriceTry')} *</Label>
                    <Input
                      id="totalPriceTry"
                      type="text"
                      inputMode="decimal"
                      value={form.totalPriceTry}
                      onChange={(e) => set({ totalPriceTry: e.target.value })}
                      placeholder="Örn. 250000"
                      aria-invalid={!!errors.totalPriceTry}
                    />
                    {errors.totalPriceTry && <p className="text-xs text-destructive">{errors.totalPriceTry}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.turnkey')}</Label>
                    <Select value={form.turnkey ?? ''} onValueChange={(v) => set({ turnkey: v || '' })}>
                      <SelectTrigger id="turnkey"><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evet">{t('quoteVerify.turnkeyYes')}</SelectItem>
                        <SelectItem value="hayir">{t('quoteVerify.turnkeyNo')}</SelectItem>
                        <SelectItem value="emin_degilim">{t('quoteVerify.turnkeyUnsure')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 2 Panel */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  {t('quoteVerify.section2')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.panelBrandModel')} *</Label>
                    <Input
                      value={form.panelBrandModel}
                      onChange={(e) => set({ panelBrandModel: e.target.value })}
                      placeholder="Marka / model"
                      aria-invalid={!!errors.panelBrandModel}
                    />
                    {errors.panelBrandModel && <p className="text-xs text-destructive">{errors.panelBrandModel}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.panelWatt')}</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.panelWatt}
                      onChange={(e) => set({ panelWatt: e.target.value })}
                      placeholder="Örn. 550"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.panelCount')} *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.panelCount}
                      onChange={(e) => set({ panelCount: e.target.value })}
                      placeholder="Adet"
                      aria-invalid={!!errors.panelCount}
                    />
                    {errors.panelCount && <p className="text-xs text-destructive">{errors.panelCount}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.totalKwp')} *</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={form.totalKwp}
                      onChange={(e) => set({ totalKwp: e.target.value })}
                      placeholder="kWp"
                      aria-invalid={!!errors.totalKwp}
                    />
                    {errors.totalKwp && <p className="text-xs text-destructive">{errors.totalKwp}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.panelTech')}</Label>
                    <Select value={form.panelTechnology ?? ''} onValueChange={(v) => set({ panelTechnology: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monokristal">{t('quoteVerify.panelMono')}</SelectItem>
                        <SelectItem value="perc">{t('quoteVerify.panelPerc')}</SelectItem>
                        <SelectItem value="topcon">{t('quoteVerify.panelTopcon')}</SelectItem>
                        <SelectItem value="hjt">{t('quoteVerify.panelHjt')}</SelectItem>
                        <SelectItem value="bilmiyorum">{t('quoteVerify.panelUnknown')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.panelEfficiency')}</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={form.panelEfficiencyPct}
                      onChange={(e) => set({ panelEfficiencyPct: e.target.value })}
                      placeholder="%"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.warrantyProduct')}</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.warrantyProductYears}
                      onChange={(e) => set({ warrantyProductYears: e.target.value })}
                      placeholder="Yıl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.warrantyPerformance')}</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.warrantyPerformanceYears}
                      onChange={(e) => set({ warrantyPerformanceYears: e.target.value })}
                      placeholder="Yıl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.warranty25Pct')}</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={form.warrantyPerformance25Pct}
                      onChange={(e) => set({ warrantyPerformance25Pct: e.target.value })}
                      placeholder="%"
                    />
                  </div>
                </div>
              </div>

              {/* 3 İnverter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  {t('quoteVerify.section3')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.inverterBrandModel')} *</Label>
                    <Input
                      value={form.inverterBrandModel}
                      onChange={(e) => set({ inverterBrandModel: e.target.value })}
                      aria-invalid={!!errors.inverterBrandModel}
                    />
                    {errors.inverterBrandModel && <p className="text-xs text-destructive">{errors.inverterBrandModel}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.inverterTotalKw')}</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={form.inverterTotalKw}
                      onChange={(e) => set({ inverterTotalKw: e.target.value })}
                      placeholder="kW"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.inverterType')}</Label>
                    <Select value={form.inverterType ?? ''} onValueChange={(v) => set({ inverterType: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">{t('quoteVerify.inverterString')}</SelectItem>
                        <SelectItem value="mikro">{t('quoteVerify.inverterMikro')}</SelectItem>
                        <SelectItem value="hibrit">{t('quoteVerify.inverterHibrit')}</SelectItem>
                        <SelectItem value="merkezi">{t('quoteVerify.inverterMerkezi')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.mpptCount')}</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.mpptCount}
                      onChange={(e) => set({ mpptCount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.storageCompatible')}</Label>
                    <Select value={form.storageCompatible ?? ''} onValueChange={(v) => set({ storageCompatible: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evet">Evet</SelectItem>
                        <SelectItem value="hayir">Hayır</SelectItem>
                        <SelectItem value="bilmiyorum">Bilmiyorum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 4 Batarya */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  {t('quoteVerify.section4')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.batteryBrandModel')}</Label>
                    <Input
                      value={form.batteryBrandModel}
                      onChange={(e) => set({ batteryBrandModel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.batteryKwh')}</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={form.batteryKwh}
                      onChange={(e) => set({ batteryKwh: e.target.value })}
                      placeholder="kWh"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.batteryChemistry')}</Label>
                    <Select value={form.batteryChemistry ?? ''} onValueChange={(v) => set({ batteryChemistry: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lfp">{t('quoteVerify.batteryLfp')}</SelectItem>
                        <SelectItem value="nmc">{t('quoteVerify.batteryNmc')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 5 Mekanik */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  {t('quoteVerify.section5')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.mountingType')}</Label>
                    <Select value={form.mountingType ?? ''} onValueChange={(v) => set({ mountingType: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delinerek">{t('quoteVerify.mountingDrill')}</SelectItem>
                        <SelectItem value="balastli">{t('quoteVerify.mountingBallast')}</SelectItem>
                        <SelectItem value="entegre">{t('quoteVerify.mountingIntegral')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.staticProject')}</Label>
                    <Select value={form.staticProjectProvided ?? ''} onValueChange={(v) => set({ staticProjectProvided: v || '' })}>
                      <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evet">Evet</SelectItem>
                        <SelectItem value="hayir">Hayır</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 7 Üretim, 8 Amortisman */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>{t('quoteVerify.annualProductionKwh')}</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={form.annualProductionKwh}
                    onChange={(e) => set({ annualProductionKwh: e.target.value })}
                    placeholder="kWh"
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t('quoteVerify.paybackYearsQuoted')}</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={form.paybackYearsQuoted}
                    onChange={(e) => set({ paybackYearsQuoted: e.target.value })}
                    placeholder="Yıl"
                  />
                </div>
              </div>

              {/* İletişim */}
              <div className="space-y-3">
                <h3 className="font-semibold text-ink border-b border-palette pb-1 text-sm">
                  İletişim
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.contactName')} *</Label>
                    <Input
                      value={form.contactName}
                      onChange={(e) => set({ contactName: e.target.value })}
                      aria-invalid={!!errors.contactName}
                    />
                    {errors.contactName && <p className="text-xs text-destructive">{errors.contactName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.contactEmail')} *</Label>
                    <Input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => set({ contactEmail: e.target.value })}
                      aria-invalid={!!errors.contactEmail}
                    />
                    {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>{t('quoteVerify.contactPhone')}</Label>
                    <Input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) => set({ contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-destructive">{errors.submit}</p>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4" />
                  )}
                  {t('quoteVerify.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClassicPageShell>
  )
}
