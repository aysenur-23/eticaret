'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Lock, Loader2, AlertCircle, Zap } from 'lucide-react'

export default function AdminAuthPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        setError(data.error || 'Giriş başarısız.')
        return
      }
      // Firebase custom token ile sessiz giriş (Firestore okuma izni için)
      if (data.firebaseCustomToken) {
        try {
          const { getAuth } = await import('@/lib/firebase/config')
          const { signInWithCustomToken } = await import('firebase/auth')
          const auth = getAuth()
          await signInWithCustomToken(auth, data.firebaseCustomToken)
        } catch {}
      }
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError('Bağlantı hatası. Tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Arka plan desen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,110,0.4),transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f4a11a] shadow-lg shadow-amber-500/20 mb-4">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-white">Voltekno Admin</h1>
          <p className="text-sm text-white/40 mt-1">Yönetim paneline giriş yapın</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/8 border-white/15 text-white placeholder:text-white/25 focus:border-[#f4a11a] focus:ring-[#f4a11a]/20 rounded-xl h-11"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#f4a11a] hover:bg-[#e09510] text-white font-semibold gap-2 shadow-lg shadow-amber-500/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Siteye Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
