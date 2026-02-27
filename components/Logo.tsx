'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  href?: string
  asDiv?: boolean
}

export function Logo({ size = 'md', className, href, asDiv = false }: LogoProps) {
  const sizeClasses = {
    sm: 'h-16 w-auto', // Küçük boyut
    md: 'h-20 w-auto', // Header için uygun boyut (80px)
    lg: 'h-24 w-auto', // Orta boyut
    xl: 'h-28 w-auto' // Daha büyük kullanımlar için
  }

  const imageSizes = {
    sm: { width: 160, height: 64 }, // Küçük boyut
    md: { width: 200, height: 80 }, // Header için uygun boyut
    lg: { width: 240, height: 96 }, // Orta boyut
    xl: { width: 280, height: 112 } // Daha büyük kullanımlar için
  }

  // Use static path without timestamp to allow proper preloading
  const logoSrc = `/logo.png`

  const imageElement = (
    <Image
      src={logoSrc}
      alt="Batarya Kit Logo"
      width={120}
      height={48}
      className={cn('object-contain', sizeClasses[size], 'max-w-full')}
      priority
      unoptimized={process.env.NODE_ENV === 'development'}
    />
  )

  if (asDiv) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {imageElement}
      </div>
    )
  }

  return (
    <Link href={href || "/"} className={cn('flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity', className)}>
      {imageElement}
    </Link>
  )
}
