'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface ClassicPageShellProps {
  /** Breadcrumb: Ana Sayfa > ... > Son */
  breadcrumbs?: BreadcrumbItem[]
  /** Sayfa başlığı (h1) */
  title?: string
  /** Başlık altı kısa açıklama */
  description?: string
  children: React.ReactNode
  /** İçerik arka planı */
  className?: string
  /** Başlık bölümünü gizle (sadece breadcrumb) */
  noTitle?: boolean
}

/**
 * Modern sayfa kabuğu: breadcrumb, başlık, container. Slate/white profesyonel stil.
 */
export function ClassicPageShell({
  breadcrumbs = [],
  title,
  description,
  children,
  className = '',
  noTitle = false,
}: ClassicPageShellProps) {
  return (
    <div className={`min-h-screen bg-slate-50 pb-safe w-full max-w-full min-w-0 overflow-x-hidden ${className}`} id="main-content">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 py-4 md:py-5 min-w-0">
          {breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 mb-2 min-h-[44px] items-center" aria-label="Breadcrumb">
              <Link href="/" className="py-2 -my-2 px-1 hover:text-slate-900 transition-colors touch-manipulation">
                Ana Sayfa
              </Link>
              {breadcrumbs.map((item, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  {item.href ? (
                    <Link href={item.href} className="py-2 hover:text-slate-900 transition-colors touch-manipulation">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-slate-900 font-semibold py-2">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          {!noTitle && (title || description) && (
            <div className="mt-1 md:mt-2">
              {title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-600 md:text-base">{description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 min-w-0">
        {children}
      </div>
    </div>
  )
}
