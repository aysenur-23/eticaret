'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { getAuth } from '@/lib/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { isFirebaseConfigured } from '@/lib/firebase/config'

export default function AdminAuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isFirebaseConfigured) {
        setError('Firebase yapılandırılmamış.')
        setLoading(false)
        return
      }
      const auth = getAuth()
      const cred = await signInWithEmailAndPassword(auth, email, password)
      // Firestore'dan admin rolünü kontrol et (statik hosting — API yok)
      const { doc, getDoc } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        // Admin oturum bilgisini localStorage'a kaydet
        localStorage.setItem('admin_uid', cred.user.uid)
        localStorage.setItem('admin_token', await cred.user.getIdToken())
        router.push('/admin')
        router.refresh()
        return
      }
      setError('Bu hesabın admin yetkisi yok.')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı.')
      } else if (code === 'auth/invalid-email') {
        setError('Geçersiz e-posta.')
      } else {
        setError(err?.message || 'Giriş başarısız.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink">
            <ArrowLeft className="w-4 h-4" />
            Siteye Dön
          </Link>
        </Button>
        <Card className="border border-palette shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Paneli
            </CardTitle>
            <CardDescription>
              Panele girmek için Firebase hesabınızla giriş yapın. Sadece admin yetkisi olan hesaplar erişebilir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none shrink-0" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@ornek.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 rounded-lg min-w-0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Şifre</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full rounded-lg gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Doğrulanıyor...
                  </>
                ) : (
                  'Admin Girişi'
                )}
              </Button>
            </form>
            <p className="mt-4 text-sm text-ink-muted">
              Admin yetkisi için sistem yöneticinize başvurun. Hesabınız Firestore&apos;da <code className="text-xs bg-gray-100 px-1 rounded">role: &quot;admin&quot;</code> olarak ayarlanmalıdır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
