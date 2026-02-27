'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { confirmPasswordReset } from 'firebase/auth'
import { getAuth, isFirebaseConfigured } from '@/lib/firebase/config'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('oobCode') || searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Geçersiz veya eksik şifre sıfırlama bağlantısı')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!token) {
      setError('Geçersiz şifre sıfırlama bağlantısı')
      return
    }

    setLoading(true)

    try {
      if (!isFirebaseConfigured) {
        setError('Firebase yapılandırılmamış. Lütfen yöneticiyle iletişime geçin.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const auth = getAuth()
      // Firebase oobCode (token) ile şifre sıfırlama
      await confirmPasswordReset(auth, token, password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      console.error('Reset password error:', error)
      if (error?.code === 'auth/expired-action-code') {
        setError('Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir istek gönderin.')
      } else if (error?.code === 'auth/invalid-action-code') {
        setError('Geçersiz veya kullanılmış şifre sıfırlama bağlantısı.')
      } else if (error?.code === 'auth/weak-password') {
        setError('Şifre çok zayıf. Daha güçlü bir şifre seçin.')
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <ClassicPageShell breadcrumbs={[{ label: 'Şifre Sıfırla' }]} noTitle>
        <div className="flex justify-center py-8">
          <div className="w-full max-w-md">
            <Card className="classic-card rounded-lg overflow-hidden">
              <CardHeader className="space-y-1 text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Şifre Başarıyla Sıfırlandı</CardTitle>
                <CardDescription className="text-gray-600">Yeni şifrenizle giriş yapabilirsiniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Şifreniz başarıyla değiştirildi. 3 saniye sonra giriş sayfasına yönlendirileceksiniz.</AlertDescription>
                </Alert>
                <Button asChild className="w-full btn-classic-primary rounded-lg">
                  <Link href="/login" className="flex items-center justify-center gap-2">Giriş Yap</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ClassicPageShell>
    )
  }

  return (
    <ClassicPageShell breadcrumbs={[{ label: 'Şifre Sıfırla' }]} noTitle>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="classic-card rounded-lg overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Yeni Şifre Belirle</CardTitle>
            <CardDescription className="text-gray-600">Yeni şifrenizi girin</CardDescription>
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
                <Label htmlFor="password">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="En az 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 rounded-xl min-w-0" required minLength={6} disabled={loading} autoComplete="new-password" />
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPassword(!showPassword) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 p-1 rounded" aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Şifrenizi tekrar girin" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-12 pr-12 rounded-xl min-w-0" required minLength={6} disabled={loading} autoComplete="new-password" />
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirmPassword(!showConfirmPassword) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 p-1 rounded" aria-label={showConfirmPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}>{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <Button type="submit" className="w-full btn-classic-primary rounded-lg" disabled={loading || !token} size="lg">
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Şifre Sıfırlanıyor...</> : 'Şifreyi Sıfırla'}
              </Button>
              <div className="text-center text-sm text-gray-600">
                <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold flex items-center justify-center gap-2">
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

