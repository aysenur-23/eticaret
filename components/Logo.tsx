'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  href?: string
  asDiv?: boolean
}

export function Logo({ size = 'md', className, href, asDiv = false }: LogoProps) {
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  }

  const h = heightMap[size]
  // Logo is 1100x300 px → aspect ratio ≈ 3.67
  const w = Math.round(h * 3.67)

  const logoElement = (
    <Image
      src="/logo.png"
      alt="Voltekno Enerji Sistemleri"
      width={w}
      height={h}
      priority
      className="object-contain"
    />
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
