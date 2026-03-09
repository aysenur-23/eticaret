'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  href?: string
  asDiv?: boolean
}

export function Logo({ size = 'md', className, href, asDiv = false }: LogoProps) {
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  const logoElement = (
    <span
      className={cn(
        'font-black tracking-tight text-brand select-none',
        textSizeClasses[size]
      )}
    >
      voltekno
    </span>
  )

  if (asDiv) {
    return (
      <div className={cn('flex items-center', className)}>
        {logoElement}
      </div>
    )
  }

  return (
    <Link
      href={href || '/'}
      className={cn('flex items-center cursor-pointer hover:opacity-80 transition-opacity', className)}
    >
      {logoElement}
    </Link>
  )
}
