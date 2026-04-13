'use client'

import React from 'react'

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full bg-white shadow-sm shrink-0 overflow-visible isolate pt-safe"
    >
      {children}
    </header>
  )
}
