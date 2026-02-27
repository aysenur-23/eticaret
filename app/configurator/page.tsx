'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Konfigüratör kaldırıldı; eski linkler ürünler sayfasına yönlendirilir.
 */
export default function ConfiguratorRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/products')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Yönlendiriliyor...</p>
    </div>
  )
}
