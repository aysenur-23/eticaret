'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Menu,
  Search,
  ChevronDown,
  ChevronRight,
  Zap,
  Battery,
  Sun,
  Cpu,
  Flame,
  Settings2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORY_GROUPS, getCategoryKey } from '@/lib/categories'
import { useCategoriesWithProducts } from './CategoriesWithProductsProvider'

const GROUP_ICONS: Record<string, React.ElementType> = {
  'ev-sarj': Zap,
  'enerji-depolama': Battery,
  'gunes-enerjisi': Sun,
  'inverterler': Cpu,
  'isi-pompalari': Flame,
  'akilli-enerji': Settings2,
}

/**
 * Sticky kategori sidebar – ana gruplar + açılabilir alt kategoriler + arama.
 * Header'daki dropdown yapısıyla senkronize.
 */
export function CategorySidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const categoriesWithProducts = useCategoriesWithProducts()
  const categoryParam = searchParams.get('category')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')

  /** Ürünü olan alt kategorilerle filtrelenmiş gruplar; boşsa tüm gruplar gösterilir. */
  const filteredGroups = useMemo(() => {
    if (!categoriesWithProducts || categoriesWithProducts.size === 0) return CATEGORY_GROUPS
    const filtered = CATEGORY_GROUPS.map((group) => ({
      ...group,
      categoryValues: group.categoryValues.filter((v) => categoriesWithProducts.has(v)),
    })).filter((g) => g.categoryValues.length > 0)
    return filtered.length > 0 ? filtered : CATEGORY_GROUPS
  }, [categoriesWithProducts])

  /** Aktif grup ID'sini tespit et */
  const activeGroupId = useMemo(() => {
    const match = pathname.match(/^\/category\/([^/]+)/)
    if (match) return match[1]
    if (categoryParam) {
      const grp = filteredGroups.find((g) =>
        (g.categoryValues as readonly string[]).includes(categoryParam)
      )
      return grp?.id ?? null
    }
    return null
  }, [pathname, categoryParam, filteredGroups])

  /** Hangi gruplar açık */
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    if (activeGroupId) {
      setExpandedGroups((prev) => (prev.has(activeGroupId) ? prev : new Set([...prev, activeGroupId])))
    }
  }, [activeGroupId])

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isAllActive = !activeGroupId && pathname === '/products'

  return (
    <aside
      className="w-full lg:w-60 xl:w-64 shrink-0"
      aria-label="Tüm kategoriler"
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:shadow-none lg:border-0 lg:bg-transparent">
        {/* Başlık – sadece desktop */}
        <div className="hidden lg:flex items-center gap-2 pb-3 border-b border-slate-200">
          <Menu className="w-5 h-5 text-slate-400 shrink-0" aria-hidden />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Tüm Kategoriler
          </h2>
        </div>

        {/* Arama */}
        <form
          className="flex gap-2 mt-3"
          onSubmit={(e) => {
            e.preventDefault()
            const params = new URLSearchParams()
            if (searchQuery.trim()) params.set('q', searchQuery.trim())
            router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`)
          }}
        >
          <Input
            type="search"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-10 rounded-lg border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-lg bg-slate-800 hover:bg-slate-700"
            aria-label="Ara"
          >
            <Search className="w-4 h-4 text-white" />
          </Button>
        </form>

        {/* Kategori listesi */}
        <nav
          className="mt-3 rounded-xl lg:rounded-none border border-slate-200 lg:border-0 overflow-hidden bg-white lg:bg-transparent"
          aria-label="Ürün kategorileri"
        >
          {/* Mobil başlık */}
          <div className="lg:hidden bg-slate-800 text-white px-4 py-3 flex items-center gap-2">
            <Menu className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm uppercase tracking-wide">Kategoriler</span>
          </div>

          <ul className="p-2 lg:p-0 space-y-0.5">
            {/* Tümü */}
            <li>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                  isAllActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{tCommon('all')}</span>
              </Link>
            </li>

            {/* Gruplar */}
            {filteredGroups.map((group) => {
              const isGroupActive = activeGroupId === group.id
              const isExpanded = expandedGroups.has(group.id)
              const Icon = GROUP_ICONS[group.id] ?? Menu
              const label = tHeader(group.labelKey)

              return (
                <li key={group.id}>
                  {/* Grup satırı: link (sol) + toggle butonu (sağ) */}
                  <div
                    className={`flex items-stretch rounded-lg overflow-hidden transition-colors ${
                      isGroupActive ? 'bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <Link
                      href={`/category/${group.id}`}
                      className={`flex-1 flex items-center gap-2.5 px-3.5 py-3 min-h-[44px] text-sm font-semibold min-w-0 transition-colors touch-manipulation ${
                        isGroupActive ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isGroupActive ? 'text-white/70' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`min-h-[44px] min-w-[44px] px-2.5 shrink-0 transition-colors touch-manipulation ${
                        isGroupActive
                          ? 'text-white/70 hover:text-white hover:bg-white/10'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                      }`}
                      aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Alt kategoriler */}
                  {isExpanded && (
                    <ul className="mt-0.5 ml-3 border-l-2 border-slate-200 pl-1.5 space-y-0.5 pb-1">
                      {(group.categoryValues as readonly string[]).map((catValue) => {
                        const isSubActive =
                          pathname === '/products' && categoryParam === catValue
                        const labelKey = getCategoryKey(catValue)
                        const label = labelKey ? tHeader(labelKey) : catValue
                        return (
                          <li key={catValue}>
                            <Link
                              href={`/products?category=${encodeURIComponent(catValue)}`}
                              className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium leading-snug transition-colors touch-manipulation ${
                                isSubActive
                                  ? 'bg-slate-800 text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />
                              <span className="truncate">{label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
