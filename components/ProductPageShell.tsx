'use client'

import React from 'react'

interface ProductPageShellProps {
    children: React.ReactNode
    hero?: React.ReactNode
    breadcrumbs?: React.ReactNode
    showSidebar?: boolean
}

/**
 * Ürün sayfaları için ortak shell: hero, breadcrumbs ve içerik alanı.
 */
export function ProductPageShell({
    children,
    hero,
    breadcrumbs,
    showSidebar = true,
}: ProductPageShellProps) {
    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-50 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden pt-0 mt-0">
            {hero && (
                <section className="w-full shrink-0 min-w-0">
                    {hero}
                </section>
            )}

            {breadcrumbs && (
                <section className="bg-white border-b border-slate-200 sticky top-0 z-20 min-h-[44px] flex items-center pt-3 pb-3 md:pt-4 md:pb-4 shadow-sm shrink-0 px-safe mt-0">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] min-w-0 w-full">
                        {breadcrumbs}
                    </div>
                </section>
            )}

            <div className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden pb-safe relative z-0">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-6 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 md:pb-24 min-w-0 bg-slate-50">
                    <main className="flex-1 min-w-0 max-w-full overflow-x-hidden w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
