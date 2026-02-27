'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { applyActionCode } from 'firebase/auth'
import { getAuth, isFirebaseConfigured } from '@/lib/firebase/config'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'code'>('loading')
  const [message, setMessage] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const token = searchParams.get('oobCode') || searchParams.get('token')
    const verified = searchParams.get('verified')
    const emailParam = searchParams.get('email')
    const codeParam = searchParams.get('code')

    if (verified === 'true') {
      setStatus('success')
      setMessage('E-posta adresiniz başarıyla doğrulandı! Giriş yapabilirsiniz.')
      return
    }

    if (token) {
      verifyWithToken(token)
    } else if (emailParam) {
      // Email from registration - pre-fill it
      setEmail(emailParam)
      if (codeParam) {
        setCode(codeParam)
        setStatus('code')
      } else {
        setStatus('code')
      }
    } else {
      setStatus('code')
    }
  }, [searchParams])

  const verifyWithToken = async (token: string) => {
    try {
      if (!isFirebaseConfigured) {
        setStatus('error')
        setMessage('Firebase yapılandırılmamış.')
        return
      }
      const auth = getAuth()
      // Firebase oobCode ile e-posta doğrulama
      await applyActionCode(auth, token)
      setStatus('success')
      setMessage('E-posta adresiniz başarıyla doğrulandı!')
      setTimeout(() => {
        router.push('/login?verified=true')
      }, 2000)
    } catch (error: any) {
      console.error('Verify email error:', error)
      if (error?.code === 'auth/expired-action-code') {
        setStatus('error')
        setMessage('Doğrulama bağlantısının süresi dolmuş. Lütfen yeni kayıt olun.')
      } else if (error?.code === 'auth/invalid-action-code') {
        setStatus('error')
        setMessage('Geçersiz veya kullanılmış doğrulama bağlantısı.')
      } else {
        setStatus('error')
        setMessage('Doğrulama başarısız oldu. Lütfen tekrar deneyin.')
      }
    }
  }

  const verifyWithCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code || !email) {
      setMessage('Lütfen e-posta ve doğrulama kodunu girin')
      return
    }

    setVerifying(true)
    setMessage('')

    try {
      // Firebase uses oobCode (token) for verification, not short codes
      // If code looks like an oobCode, use applyActionCode
      if (!isFirebaseConfigured) {
        setStatus('error')
        setMessage('Firebase yapılandırılmamış.')
        return
      }
      const auth = getAuth()
      await applyActionCode(auth, code)
      setStatus('success')
      setMessage('E-posta adresiniz başarıyla doğrulandı!')
      setTimeout(() => {
        router.push('/login?verified=true')
      }, 2000)
    } catch (error: any) {
      console.error('Verify email error:', error)
      setStatus('error')
      setMessage('Doğrulama kodu geçersiz veya süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <ClassicPageShell breadcrumbs={[{ label: 'E-posta Doğrulama' }]} noTitle>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <Card className="classic-card rounded-lg overflow-hidden bg-white">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                  status === 'success' ? 'bg-green-100' : 
                  status === 'error' ? 'bg-red-100' : 
                  'bg-red-100'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  ) : status === 'error' ? (
                    <XCircle className="w-7 h-7 text-red-600" />
                  ) : (
                    <Mail className="w-7 h-7 text-red-600" />
                  )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {status === 'success' ? 'E-posta Doğrulandı' : 
               status === 'error' ? 'Doğrulama Başarısız' : 
               'E-posta Doğrulama'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status === 'success' ? 'Hesabınız aktifleştirildi' : 
               status === 'error' ? 'Lütfen tekrar deneyin' : 
               'E-posta adresinizi doğrulayın'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600">Doğrulanıyor...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <Alert className="rounded-xl">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <Button asChild className="w-full btn-classic-primary rounded-lg" size="lg">
                  <Link href="/login">Giriş Yap</Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive" className="rounded-xl">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <Button asChild variant="outline" className="w-full rounded-lg font-bold border-2 border-gray-200">
                  <Link href="/register">Yeniden Kayıt Ol</Link>
                </Button>
              </div>
            )}

            {status === 'code' && (
              <form onSubmit={verifyWithCode} className="space-y-4">
                {email ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                        className="bg-gray-50 pl-12 rounded-xl min-w-0"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      E-posta adresiniz kayıt sırasında verdiğiniz adres
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={verifying}
                        className="pl-12 rounded-xl min-w-0"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Doğrulama Kodu</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="6 haneli kod"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    required
                    disabled={verifying}
                    className="text-center text-2xl font-mono tracking-widest rounded-xl"
                  />
                  <p className="text-xs text-gray-500">
                    E-posta adresinize gönderilen 6 haneli kodu girin
                  </p>
                </div>

                {message && (
                  <Alert variant={message.includes('başarı') ? 'default' : 'destructive'} className="rounded-xl">
                    {!message.includes('başarı') && <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full btn-classic-primary rounded-lg" size="lg" disabled={verifying}>
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Doğrulanıyor...
                    </>
                  ) : (
                    'Doğrula'
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                    Giriş sayfasına dön
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </ClassicPageShell>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor…</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

