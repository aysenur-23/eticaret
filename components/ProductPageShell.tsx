'use client'

import React, { Suspense } from 'react'
import { CategorySidebar } from '@/components/CategorySidebar'

interface ProductPageShellProps {
    children: React.ReactNode
    hero?: React.ReactNode
    breadcrumbs?: React.ReactNode
    showSidebar?: boolean
}

/**
 * Ürün sayfaları için ortak shell: hero, breadcrumbs ve iki sütunlu (sidebar + içerik) yapı.
 */
export function ProductPageShell({
    children,
    hero,
    breadcrumbs,
    showSidebar = true,
}: ProductPageShellProps) {
    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-50 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
            {hero && (
                <section className="w-full shrink-0 min-w-0">
                    {hero}
                </section>
            )}

            {breadcrumbs && (
                <section className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-10 py-2.5 shadow-sm shrink-0 px-safe">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] min-w-0">
                        {breadcrumbs}
                    </div>
                </section>
            )}

            <div className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden pb-safe">
                <div className={`flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6 min-w-0`}>
                    {showSidebar && (
                        <div className="w-full lg:w-60 xl:w-64 shrink-0 overflow-visible">
                            <Suspense fallback={<div className="w-full lg:w-60 xl:w-64 shrink-0 bg-white/50 animate-pulse rounded-xl h-[400px]" />}>
                                <CategorySidebar />
                            </Suspense>
                        </div>
                    )}
                    <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
