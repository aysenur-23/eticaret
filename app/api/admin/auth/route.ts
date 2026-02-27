/**
 * Admin girişi: Firebase ID token ile doğrulama.
 * Firebase Auth ile giriş yapılmış kullanıcının token'ı gönderilir;
 * backend token'ı doğrular, Firestore users/{uid} içinde role === 'admin' kontrol eder.
 * Sadece admin rolü olanlar için admin_session JWT cookie set edilir.
 */

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getAdminAuth } from '@/lib/firebaseAdminServer'
import { getAdminFirestore, isFirebaseAdminConfigured } from '@/lib/firebaseAdminServer'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 gün

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const idToken = typeof body?.idToken === 'string' ? body.idToken.trim() : ''

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'Firebase token gerekli.' }, { status: 400 })
    }

    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin yapılandırılmamış. Admin girişi kullanılamıyor.' },
        { status: 503 }
      )
    }

    const auth = getAdminAuth()
    const firestore = getAdminFirestore()
    if (!auth || !firestore) {
      return NextResponse.json({ success: false, error: 'Sunucu hatası.' }, { status: 503 })
    }

    const decoded = await auth.verifyIdToken(idToken)
    const uid = decoded.uid

    const userDoc = await firestore.collection('users').doc(uid).get()
    const profile = userDoc.data()
    const role = profile?.role as string | undefined

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu hesabın admin yetkisi yok.' },
        { status: 403 }
      )
    }

    const sessionToken = jwt.sign(
      { sub: uid, admin: true },
      JWT_SECRET,
      { expiresIn: SESSION_MAX_AGE }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    return response
  } catch (err: any) {
    if (err?.code === 'auth/id-token-expired' || err?.message?.includes('expired')) {
      return NextResponse.json({ success: false, error: 'Oturum süresi doldu. Tekrar giriş yapın.' }, { status: 401 })
    }
    if (err?.code === 'auth/argument-error' || err?.message?.includes('decode')) {
      return NextResponse.json({ success: false, error: 'Geçersiz token.' }, { status: 401 })
    }
    console.error('Admin auth error:', err)
    return NextResponse.json({ success: false, error: 'Doğrulama başarısız.' }, { status: 401 })
  }
}
