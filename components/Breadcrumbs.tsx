'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, Home } from 'lucide-react'
import { CATEGORY_GROUPS, getCategoryKey } from '@/lib/categories'

export function Breadcrumbs() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const t = useTranslations('common')
    const tHeader = useTranslations('header')

    const categoryParam = searchParams.get('category')
    const searchQuery = searchParams.get('q')

    // Don't show breadcrumbs on home page
    if (pathname === '/') return null

    type BreadcrumbItem = { label: string; href: string; icon?: React.ElementType }
    const items: BreadcrumbItem[] = [
        { label: t('home'), href: '/', icon: Home },
    ]

    if (pathname.startsWith('/products')) {
        items.push({ label: t('products'), href: '/products' })

        if (categoryParam) {
            const group = CATEGORY_GROUPS.find(g => g.id === categoryParam)
            if (group) {
                items.push({
                    label: tHeader(group.labelKey),
                    href: `/products?category=${encodeURIComponent(categoryParam)}`
                })
            } else {
                // Might be a specific sub-category value
                const key = getCategoryKey(categoryParam)
                items.push({
                    label: key ? tHeader(key) : categoryParam,
                    href: `/products?category=${encodeURIComponent(categoryParam)}`
                })
            }
        }

        if (searchQuery) {
            items.push({ label: `"${searchQuery}"`, href: '#' })
        }
    } else if (pathname.startsWith('/contact')) {
        items.push({ label: tHeader('navContact'), href: '/contact' })
    } else if (pathname.startsWith('/cart')) {
        items.push({ label: tHeader('navCart'), href: '/cart' })
    } else if (pathname.startsWith('/profile')) {
        items.push({ label: tHeader('myAccount'), href: '/profile' })
    }

    return (
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide" aria-label="Breadcrumb">
            {items.map((item, index) => {
                const IsLast = index === items.length - 1
                const Icon = item.icon

                return (
                    <React.Fragment key={item.href + index}>
                        {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                        {IsLast ? (
                            <span className="text-sm font-semibold text-slate-900 truncate">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-slate-500 hover:text-brand flex items-center gap-1.5 transition-colors"
                            >
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}
