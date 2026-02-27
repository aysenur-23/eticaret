/**
 * Firebase client config (Auth, Firestore, Storage, Analytics)
 * .env.local: NEXT_PUBLIC_FIREBASE_* değişkenleri (bkz. .env.example)
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, type Analytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

function getApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase yapılandırılmamış. .env.local dosyasında NEXT_PUBLIC_FIREBASE_API_KEY ve NEXT_PUBLIC_FIREBASE_PROJECT_ID tanımlayın. Detay için FIREBASE_SETUP.md dosyasına bakın.'
    )
  }
  if (getApps().length) return getApps()[0] as FirebaseApp
  return initializeApp(firebaseConfig)
}

function getAuthInstance(): Auth {
  if (typeof window === 'undefined') throw new Error('Firebase Auth only on client')
  return getAuth(getApp())
}

function getDbInstance(): Firestore {
  if (typeof window === 'undefined') throw new Error('Firestore only on client')
  return getFirestore(getApp())
}

function getStorageInstance(): FirebaseStorage {
  if (typeof window === 'undefined') throw new Error('Firebase Storage only on client')
  return getStorage(getApp())
}

/** Analytics – sadece tarayıcıda ve measurementId tanımlıysa; SSR'da null. */
let analyticsInstance: Analytics | null = null
async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null
  if (analyticsInstance) return analyticsInstance
  const supported = await isSupported()
  if (!supported) return null
  analyticsInstance = getAnalytics(getApp())
  return analyticsInstance
}

export { getApp, getAuthInstance as getAuth, getDbInstance as getDb, getStorageInstance as getStorage, getAnalyticsInstance as getAnalytics }
