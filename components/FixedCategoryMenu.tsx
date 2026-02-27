'use client'

import React, { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Menu, ChevronDown, ChevronRight } from 'lucide-react'
import { CATEGORY_GROUPS, getCategoryKey } from '@/lib/categories'
import { useCategoriesWithProducts } from '@/components/CategoriesWithProductsProvider'

/** Robotzade tarzı: sidebar header’ın hemen altında, tek bant + kategori listesi */
const SIDEBAR_WIDTH = 260
/** Header yüksekliği (TopBar + Logo satırı + Nav): sidebar buna göre aşağıdan hizalanır */
const HEADER_OFFSET_REM = 8.5
const HIDE_ON_PATHS = ['/login', '/register', '/checkout', '/admin']

export function FixedCategoryMenu() {
  const t = useTranslations('header')
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()
  const categoriesWithProducts = useCategoriesWithProducts()
  const currentCategory = searchParams?.get('category') ?? null
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filteredGroups = useMemo(() => {
    if (!categoriesWithProducts || categoriesWithProducts.size === 0) return CATEGORY_GROUPS
    const filtered = CATEGORY_GROUPS.map((group) => ({
      ...group,
      categoryValues: group.categoryValues.filter((v) => categoriesWithProducts.has(v)),
    })).filter((g) => g.categoryValues.length > 0)
    return filtered.length > 0 ? filtered : CATEGORY_GROUPS
  }, [categoriesWithProducts])

  const shouldHide = HIDE_ON_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  if (shouldHide) return null

  const clearLeaveTimeout = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }

  const handleEnter = (id: string) => {
    clearLeaveTimeout()
    setHoveredId(id)
  }

  const handleLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setHoveredId(null), 120)
  }

  return (
    <aside
      className="hidden md:block fixed left-0 z-30 flex flex-col bg-white border-r border-slate-200"
      style={{
        width: SIDEBAR_WIDTH,
        top: `${HEADER_OFFSET_REM}rem`,
        bottom: 0,
      }}
      aria-label="Tüm kategoriler"
      onMouseLeave={handleLeave}
    >
      {/* Robotzade: TÜM KATEGORİLER bandı – hamburger sol, metin, dropdown sağ; header ile bağlantılı (tüm ürünler) */}
      <Link
        href="/products"
        className="flex items-center gap-2 h-12 px-4 shrink-0 bg-red-600 hover:bg-red-700 text-white border-b border-red-700 transition-colors"
        aria-label="Tüm ürünler"
      >
        <Menu className="w-5 h-5 shrink-0" aria-hidden />
        <span className="flex-1 text-sm font-bold uppercase tracking-wide truncate text-left">
          Tüm Kategoriler
        </span>
        <ChevronDown className="w-5 h-5 shrink-0 opacity-90" aria-hidden />
      </Link>

      {/* Robotzade: Kategori listesi – her satır tek blok, metin + sağ ok, ince ayırıcı */}
      <nav className="flex-1 min-h-0 bg-white overflow-y-auto">
        {filteredGroups.map((group) => {
          const isHovered = hoveredId === group.id
          const isGroupActive =
            pathname.startsWith(`/category/${group.id}`) ||
            (pathname === '/products' &&
              currentCategory !== null &&
              (group.categoryValues as readonly string[]).includes(currentCategory))

          return (
            <div
              key={group.id}
              className="relative border-b border-slate-200 last:border-b-0"
              onMouseEnter={() => handleEnter(group.id)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={`/category/${group.id}`}
                className={`flex items-center justify-between gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  isGroupActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{t(group.labelKey)}</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
              </Link>

              {isHovered && (
                <div
                  className="absolute left-full top-0 ml-0 min-w-[240px] max-w-[320px] max-h-[85vh] overflow-y-auto border border-slate-200 border-l-0 bg-white shadow-lg py-1 z-50 animate-in fade-in slide-in-from-left-2 duration-150"
                  onMouseEnter={() => {
                    clearLeaveTimeout()
                    setHoveredId(group.id)
                  }}
                >
                  {(group.categoryValues as readonly string[]).map((catValue) => {
                    const href = `/products?category=${encodeURIComponent(catValue)}`
                    const isActive =
                      pathname === '/products' && currentCategory === catValue
                    const labelKey = getCategoryKey(catValue)
                    const label = labelKey ? t(labelKey) : catValue
                    return (
                      <Link
                        key={catValue}
                        href={href}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  })}
                  <div className="border-t border-slate-200 mt-1 pt-1">
                    <Link
                      href={`/category/${group.id}`}
                      className="block px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Tümü →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export const FIXED_CATEGORY_MENU_WIDTH = SIDEBAR_WIDTH
