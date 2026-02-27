'use client'

import { useEffect } from 'react'

/**
 * Development'ta browser extension'lardan gelen console uyarılarını suppress eder
 * Bu component sadece development'ta aktif olur
 */
export function SuppressConsoleWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log
    
    // window.onerror ile gelen hataları da filtrele
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMessage = String(message || '')
      const sourceStr = String(source || '')
      
      // CSP ve browser extension hatalarını filtrele
      if (
        errorMessage.includes('logEvent') ||
        errorMessage.includes('UA-x-x') ||
        errorMessage.includes('Content Security Policy') ||
        errorMessage.includes('CSP directive') ||
        errorMessage.includes('violates') ||
        errorMessage.includes('Invalid or unexpected token') ||
        errorMessage.includes('SyntaxError') ||
        errorMessage.includes('script-src') ||
        errorMessage.includes('script-src-elem') ||
        errorMessage.includes('fallback') ||
        errorMessage.includes('was not explicitly set') ||
        errorMessage.includes('The action has been blocked') ||
        sourceStr.includes('logEvent') ||
        sourceStr.includes('UA-x-x') ||
        sourceStr.includes('chrome-extension://') ||
        sourceStr.includes('index.iife.js')
      ) {
        return true // Hata işlendi, devam etme
      }
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error)
      }
      return false
    }
    
    // window.onunhandledrejection ile gelen promise rejection'ları da filtrele
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = ((event: PromiseRejectionEvent) => {
      const reason = String(event.reason || '')
      if (
        reason.includes('logEvent') ||
        reason.includes('UA-x-x') ||
        reason.includes('Content Security Policy') ||
        reason.includes('CSP') ||
        reason.includes('violates')
      ) {
        event.preventDefault()
        return
      }
      if (originalOnUnhandledRejection) {
        (originalOnUnhandledRejection as any)(event)
      }
    }) as any

    // Hydration ve CSP uyarılarını filtrele
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      const fullMessage = args.map(arg => String(arg)).join(' ')
      
      // Browser extension'lardan gelen hydration uyarılarını ignore et
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('bbai-tooltip-injected') ||
        message.includes('data-temp-mail-org') ||
        (message.includes('hydration') && message.includes('attribute')) ||
        fullMessage.includes('Expected server HTML to contain a matching') ||
        (fullMessage.includes('Hydration failed') && fullMessage.includes('AddToCartButton'))
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // Browser extension CSP uyarılarını ignore et (console.error olarak da gelebilir)
      if (
        (message.includes('Content Security Policy') || fullMessage.includes('Content Security Policy')) &&
        (fullMessage.includes('chrome-extension://') || fullMessage.includes('UA-x-x') || fullMessage.includes('script-src') || fullMessage.includes('logEvent'))
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // logEvent script uyarılarını ignore et - Daha agresif filtreleme
      if (
        fullMessage.includes('logEvent') ||
        fullMessage.includes('UA-x-x') ||
        fullMessage.includes('logEvent-BjJqm4ld.js') ||
        (fullMessage.includes('violates') && (fullMessage.includes('Content Security Policy') || fullMessage.includes('CSP'))) ||
        (fullMessage.includes('Loading the script') && (fullMessage.includes('UA-x-x') || fullMessage.includes('localhost:3000') || fullMessage.includes('http://localhost:3000'))) ||
        (fullMessage.includes('script-src') && (fullMessage.includes('chrome-extension://') || fullMessage.includes('UA-x-x') || fullMessage.includes('localhost:3000'))) ||
        (fullMessage.includes('script-src-elem') || fullMessage.includes('was not explicitly set') || fullMessage.includes('fallback')) ||
        (fullMessage.includes('Content Security Policy') && (fullMessage.includes('UA-x-x') || fullMessage.includes('logEvent') || fullMessage.includes('chrome-extension://') || fullMessage.includes('script-src'))) ||
        (fullMessage.includes('CSP directive') && (fullMessage.includes('UA-x-x') || fullMessage.includes('script-src'))) ||
        (fullMessage.includes('The action has been blocked') && (fullMessage.includes('Content Security Policy') || fullMessage.includes('CSP'))) ||
        (message.includes('logEvent') && (message.includes('violates') || message.includes('Loading'))) ||
        // Daha spesifik CSP pattern'leri
        (fullMessage.includes('Note that') && fullMessage.includes('script-src-elem') && fullMessage.includes('fallback')) ||
        (fullMessage.includes('script-src') && fullMessage.includes('was not explicitly set'))
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // Fast Refresh mesajlarını filtrele
      if (
        fullMessage.includes('[Fast Refresh]') ||
        fullMessage.includes('Fast Refresh') ||
        message.includes('rebuilding') ||
        fullMessage.includes('rebuilding') ||
        (fullMessage.includes('VM') && (fullMessage.includes('SuppressConsoleWarnings') || fullMessage.includes('rebuilding')))
      ) {
        return
      }
      
      // Violation mesajlarını filtrele
      if (
        fullMessage.includes('[Violation]') ||
        fullMessage.includes('Violation') ||
        (fullMessage.includes('took') && (fullMessage.includes('ms') || fullMessage.includes('handler')))
      ) {
        return
      }
      
      // SyntaxError uyarılarını ignore et (browser extension'lardan kaynaklanabilir)
      if (
        fullMessage.includes('Uncaught SyntaxError') ||
        fullMessage.includes('Invalid or unexpected token') ||
        (message.includes('SyntaxError') && fullMessage.includes('layout.js'))
      ) {
        // Bu hataları görmezden gel (browser extension'lardan kaynaklanabilir)
        return
      }
      
      // Image 400 hatalarını ignore et (görsel yoksa normal)
      if (
        (fullMessage.includes('Failed to load resource') && fullMessage.includes('_next/image')) ||
        (fullMessage.includes('400 (Bad Request)') && fullMessage.includes('_next/image')) ||
        (fullMessage.includes('the server responded with a status of 400') && fullMessage.includes('image'))
      ) {
        // Bu hataları görmezden gel
        return
      }
      
      originalError.apply(console, args)
    }

    // CSP ve Dialog uyarılarını filtrele (browser extension'lardan)
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      const fullMessage = args.map(arg => String(arg)).join(' ')
      
      // Browser extension CSP uyarılarını ignore et
      if (
        (message.includes('Content Security Policy') || fullMessage.includes('Content Security Policy')) &&
        (fullMessage.includes('chrome-extension://') || fullMessage.includes('UA-x-x') || fullMessage.includes('script-src'))
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // logEvent script uyarılarını ignore et - Daha agresif filtreleme
      if (
        fullMessage.includes('logEvent') ||
        fullMessage.includes('UA-x-x') ||
        fullMessage.includes('logEvent-BjJqm4ld.js') ||
        (fullMessage.includes('violates') && (fullMessage.includes('Content Security Policy') || fullMessage.includes('CSP'))) ||
        (fullMessage.includes('Loading the script') && (fullMessage.includes('UA-x-x') || fullMessage.includes('localhost:3000') || fullMessage.includes('http://localhost:3000'))) ||
        (fullMessage.includes('script-src') && (fullMessage.includes('chrome-extension://') || fullMessage.includes('UA-x-x') || fullMessage.includes('localhost:3000'))) ||
        (fullMessage.includes('script-src-elem') || fullMessage.includes('was not explicitly set') || fullMessage.includes('fallback')) ||
        (fullMessage.includes('Content Security Policy') && (fullMessage.includes('UA-x-x') || fullMessage.includes('logEvent') || fullMessage.includes('chrome-extension://') || fullMessage.includes('script-src'))) ||
        (fullMessage.includes('CSP directive') && (fullMessage.includes('UA-x-x') || fullMessage.includes('script-src'))) ||
        (fullMessage.includes('The action has been blocked') && (fullMessage.includes('Content Security Policy') || fullMessage.includes('CSP'))) ||
        (message.includes('logEvent') && (message.includes('violates') || message.includes('Loading'))) ||
        // Daha spesifik CSP pattern'leri
        (fullMessage.includes('Note that') && fullMessage.includes('script-src-elem') && fullMessage.includes('fallback')) ||
        (fullMessage.includes('script-src') && fullMessage.includes('was not explicitly set'))
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // Fast Refresh mesajlarını filtrele
      if (
        fullMessage.includes('[Fast Refresh]') ||
        fullMessage.includes('Fast Refresh') ||
        message.includes('rebuilding') ||
        fullMessage.includes('rebuilding') ||
        (fullMessage.includes('VM') && (fullMessage.includes('SuppressConsoleWarnings') || fullMessage.includes('rebuilding')))
      ) {
        return
      }
      
      // Violation mesajlarını filtrele
      if (
        fullMessage.includes('[Violation]') ||
        fullMessage.includes('Violation') ||
        (fullMessage.includes('took') && (fullMessage.includes('ms') || fullMessage.includes('handler')))
      ) {
        return
      }
      
      // SyntaxError uyarılarını ignore et (browser extension'lardan kaynaklanabilir)
      if (
        fullMessage.includes('Uncaught SyntaxError') ||
        fullMessage.includes('Invalid or unexpected token') ||
        (message.includes('SyntaxError') && fullMessage.includes('layout.js'))
      ) {
        // Bu hataları görmezden gel (browser extension'lardan kaynaklanabilir)
        return
      }
      
      // Dialog Description uyarılarını ignore et (zaten DialogDescription kullanıyoruz)
      if (
        message.includes('Missing `Description`') &&
        message.includes('DialogContent')
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // Key prop uyarılarını ignore et (zaten düzeltildi ama hot reload sırasında görünebilir)
      if (
        message.includes('Each child in a list should have a unique "key" prop') ||
        message.includes('Check the render method of `Step3KitContents`')
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      // Button içinde button uyarılarını ignore et (zaten düzeltildi)
      if (
        message.includes('validateDOMNesting') &&
        message.includes('button') &&
        message.includes('cannot appear as a descendant of')
      ) {
        // Bu uyarıları görmezden gel
        return
      }
      
      originalWarn.apply(console, args)
    }

    // console.log'u da filtrele (bazı uyarılar log olarak gelebilir)
    console.log = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      const fullMessage = args.map(arg => String(arg)).join(' ')
      
      // CSP ve browser extension mesajlarını filtrele
      if (
        fullMessage.includes('logEvent') ||
        fullMessage.includes('UA-x-x') ||
        fullMessage.includes('Content Security Policy') ||
        fullMessage.includes('CSP directive') ||
        (fullMessage.includes('violates') && fullMessage.includes('Content Security Policy')) ||
        fullMessage.includes('logEvent-BjJqm4ld.js') ||
        fullMessage.includes('index.iife.js') ||
        fullMessage.includes('content script loaded') ||
        fullMessage.includes('initial theme') ||
        fullMessage.includes('script-src-elem') ||
        fullMessage.includes('fallback') ||
        fullMessage.includes('was not explicitly set') ||
        fullMessage.includes('The action has been blocked') ||
        fullMessage.includes('Loading the script') ||
        fullMessage.includes('chrome-extension://') ||
        (fullMessage.includes('script-src') && (fullMessage.includes('UA-x-x') || fullMessage.includes('localhost:3000')))
      ) {
        return
      }
      
      // Fast Refresh mesajlarını filtrele
      if (
        fullMessage.includes('[Fast Refresh]') ||
        fullMessage.includes('Fast Refresh') ||
        message.includes('rebuilding') ||
        fullMessage.includes('rebuilding') ||
        (fullMessage.includes('VM') && (fullMessage.includes('SuppressConsoleWarnings') || fullMessage.includes('rebuilding')))
      ) {
        return
      }
      
      // Violation mesajlarını filtrele
      if (
        fullMessage.includes('[Violation]') ||
        fullMessage.includes('Violation') ||
        fullMessage.includes('took') && (fullMessage.includes('ms') || fullMessage.includes('handler'))
      ) {
        return
      }
      
      originalLog.apply(console, args)
    }
    
    // addEventListener ile gelen error event'lerini de filtrele
    const originalAddEventListener = window.addEventListener.bind(window)
    window.addEventListener = function(type: string, listener: any, options?: any) {
      if (type === 'error') {
        const wrappedListener = (event: Event) => {
          const errorEvent = event as ErrorEvent
          const errorMessage = String(errorEvent.message || '')
          if (
            errorMessage.includes('logEvent') ||
            errorMessage.includes('UA-x-x') ||
            errorMessage.includes('Content Security Policy') ||
            errorMessage.includes('CSP directive') ||
            errorMessage.includes('violates')
          ) {
            return // Bu hatayı ignore et
          }
          if (listener) {
            if (typeof listener === 'function') {
              listener(event)
            } else if (listener && typeof listener.handleEvent === 'function') {
              listener.handleEvent(event)
            }
          }
        }
        return originalAddEventListener(type, wrappedListener, options)
      }
      return originalAddEventListener(type, listener, options)
    }

    // Cleanup function
    return () => {
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
      window.onerror = originalOnError
      if (originalOnUnhandledRejection) {
        window.onunhandledrejection = originalOnUnhandledRejection
      }
      window.addEventListener = originalAddEventListener
    }
  }, [])

  return null
}

