'use client'

import React from 'react'

const headerRootClassName =
  'relative w-full bg-white shadow-sm border-b border-palette pt-safe'

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div role="banner" className={headerRootClassName}>
      {children}
    </div>
  )
}
