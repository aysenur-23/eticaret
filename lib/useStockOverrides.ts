'use client'

import { useState, useEffect } from 'react'

/**
 * Public stok override listesini çeker (GET /api/stock-overrides).
 * Static export'ta API yoksa /data/stock-overrides.json kullanılır.
 */
export function useStockOverrides(): Record<string, number> {
  const [overrides, setOverrides] = useState<Record<string, number>>({})

  useEffect(() => {
    // Statik hosting: Firestore stockOverrides koleksiyonundan oku, fallback: static JSON
    (async () => {
      try {
        const { collection: col, getDocs } = await import('firebase/firestore')
        const { getDb, isFirebaseConfigured } = await import('@/lib/firebase/config')
        if (!isFirebaseConfigured) throw new Error('no firebase')
        const db = getDb()
        const snap = await getDocs(col(db, 'stockOverrides'))
        const map: Record<string, number> = {}
        snap.docs.forEach((d) => {
          map[d.id] = d.data().stock ?? 0
        })
        if (Object.keys(map).length > 0) {
          setOverrides(map)
          return
        }
        throw new Error('empty')
      } catch {
        // Fallback: static JSON
        fetch('/data/stock-overrides.json')
          .then((res) => (res.ok ? res.json() : {}))
          .then((map: Record<string, number>) => setOverrides(map || {}))
          .catch(() => setOverrides({}))
      }
    })()
  }, [])

  return overrides
}
