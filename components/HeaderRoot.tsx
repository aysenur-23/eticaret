'use client'

import React from 'react'

export function HeaderRoot({ children }: { children: React.ReactNode }) {
  return React.createElement(
    'div',
    {
      role: 'banner',
      className: 'relative w-full bg-white shadow-sm border-b border-palette pt-safe',
    },
    children
  )
}
