'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { sendPasswordResetEmail } from 'firebase/auth'
import { getAuth, isFirebaseConfigured } from '@/lib/firebase/config'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isFirebaseConfigured) throw new Error('Firebase yapılandırılmamış.')
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: any) {
      const code = err?.code || ''
      const message =
        code === 'auth/user-not-found'
          ? 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.'
          : code === 'auth/invalid-email'
            ? 'Geçersiz e-posta adresi.'
            : err?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
      setError(message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <ClassicPageShell breadcrumbs={[{ label: 'Şifremi Unuttum' }]} noTitle>
        <div className="flex justify-center py-8">
          <div className="w-full max-w-md">
            <Card className="classic-card rounded-lg overflow-hidden">
              <CardHeader className="space-y-1 text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-brand rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-ink">E-posta Gönderildi</CardTitle>
              <CardDescription className="text-ink-muted">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="rounded-xl">
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi. E-posta kutunuzu ve spam klasörünü kontrol edin.
                </AlertDescription>
              </Alert>
              <div className="text-center text-sm text-ink-muted py-2">
                E-posta gelmedi mi?{' '}
                <button type="button" onClick={() => { setSuccess(false); setEmail('') }} className="text-brand hover:text-brand-hover font-semibold py-2 touch-manipulation min-h-[44px] inline-flex items-center">Tekrar dene</button>
              </div>
              <Button asChild variant="outline" className="w-full rounded-lg font-bold border-2 border-palette min-h-[48px] touch-manipulation">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </ClassicPageShell>
    )
  }

  return (
    <ClassicPageShell breadcrumbs={[{ label: 'Şifremi Unuttum' }]} noTitle>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="classic-card rounded-lg overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-brand rounded-lg flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-ink">Şifremi Unuttum</CardTitle>
            <CardDescription className="text-ink-muted">E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted w-5 h-5 z-10 pointer-events-none shrink-0" />
                  <Input id="email" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 rounded-xl min-w-0" required disabled={loading} autoComplete="email" />
                </div>
              </div>
              <Button type="submit" className="w-full btn-classic-primary rounded-lg min-h-[48px] touch-manipulation" disabled={loading} size="lg">
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Gönderiliyor...</> : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </Button>
              <div className="text-center text-sm text-ink-muted py-2">
                <Link href="/login" className="text-brand hover:text-brand-hover font-semibold flex items-center justify-center gap-2 py-2 touch-manipulation min-h-[44px]">
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </ClassicPageShell>
  )
}

