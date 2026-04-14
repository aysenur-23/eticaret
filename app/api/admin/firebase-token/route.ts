export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/adminAuth'
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebaseAdminServer'

const ADMIN_UID = 'admin-panel-user'

export async function GET(request: NextRequest) {
  const adminCheck = await checkAdmin(request)
  if ('error' in adminCheck) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: adminCheck.status })
  }

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ success: false, error: 'Firebase Admin yapılandırılmamış.' }, { status: 503 })
  }

  const firebaseAuth = getAdminAuth()
  if (!firebaseAuth) {
    return NextResponse.json({ success: false }, { status: 503 })
  }

  const firebaseCustomToken = await firebaseAuth.createCustomToken(ADMIN_UID, { admin: true })
  return NextResponse.json({ success: true, firebaseCustomToken })
}
