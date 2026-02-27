'use client'

import { useEffect } from 'react'
import { isFirebaseConfigured, getAnalytics } from '@/lib/firebase/config'

/**
 * Firebase Analytics'i tarayıcıda başlatır (measurementId tanımlıysa).
 * Layout içinde bir kez render edilir.
 */
export function FirebaseAnalyticsInit() {
  useEffect(() => {
    if (!isFirebaseConfigured) return
    void getAnalytics()
  }, [])
  return null
}
