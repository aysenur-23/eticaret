export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/adminAuth'
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebaseAdminServer'

const ADMIN_UID = 'admin-panel-user'

export async function GET(request: NextRequest) {
  if (!verifyAdminCookie(request)) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'Firebase Admin yapılandırılmamış.' }, { status: 503 })
  }

  const auth = getAdminAuth()
  if (!auth) {
    return NextResponse.json({ success: false }, { status: 503 })
  }

  const firebaseCustomToken = await auth.createCustomToken(ADMIN_UID, { admin: true })
  return NextResponse.json({ success: true, firebaseCustomToken })
}
