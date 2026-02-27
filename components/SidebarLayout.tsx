'use client'

import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { CategorySidebar } from '@/components/CategorySidebar'

/** Sidebar gösterilmeyecek sayfalar (iletişim, giriş, ödeme vb.) */
const SIDEBAR_EXCLUDE_PREFIXES = [
  '/contact',
  '/login',
  '/register',
  '/checkout',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/admin',
]

function shouldHideSidebar(pathname: string): boolean {
  if (!pathname) return false
  if (pathname === '/' || pathname.startsWith('/products') || pathname.startsWith('/category/')) return true
  return SIDEBAR_EXCLUDE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
}

/**
 * Sidebar gösterilecek sayfalarda [CategorySidebar | children], diğerlerinde sadece children.
 */
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = shouldHideSidebar(pathname ?? '')

  if (hideSidebar) {
    const isHome = pathname === '/'
    const isProducts = pathname?.startsWith('/products') || pathname?.startsWith('/category/')
    return (
      <div
        className={
          isHome
            ? 'w-full min-w-0 overflow-x-hidden pt-0 pb-4 lg:pb-8'
            : isProducts
              ? 'w-full min-w-0 overflow-x-hidden'
              : 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full min-w-0 overflow-x-hidden py-4 lg:py-8'
        }
      >
        {children}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full min-w-0 overflow-x-hidden py-4 lg:py-8">
      <Suspense fallback={<div className="w-full lg:w-64 xl:w-72 shrink-0" />}>
        <CategorySidebar />
      </Suspense>
      <div className="flex-1 min-w-0 max-w-full">
        {children}
      </div>
    </div>
  )
}
