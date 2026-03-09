'use client'

import React from 'react'

/** Header: tüm sayfalarda sticky, sabit z-index, taşma yok, güvenilir arka plan (içerik altında kalmaz) */
const headerRootClassName =
  'sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] shrink-0 overflow-hidden isolate pt-safe'

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <header role="banner" className={headerRootClassName}>
      {children}
    </header>
  )
}
