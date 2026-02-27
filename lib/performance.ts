/**
 * Performance Monitoring Utilities
 * Tracks and logs slow operations
 */

const SLOW_OPERATION_THRESHOLD = 1000 // 1 second

export function trackPerformance<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  
  return operation()
    .then((result) => {
      const duration = Date.now() - startTime
      if (duration > SLOW_OPERATION_THRESHOLD) {
        console.warn(`⚠️ Slow operation detected: ${operationName} took ${duration}ms`)
      } else {
        console.log(`✅ ${operationName} completed in ${duration}ms`)
      }
      return result
    })
    .catch((error) => {
      const duration = Date.now() - startTime
      console.error(`❌ ${operationName} failed after ${duration}ms:`, error)
      throw error
    })
}

export function trackSyncPerformance<T>(
  operationName: string,
  operation: () => T
): T {
  const startTime = Date.now()
  
  try {
    const result = operation()
    const duration = Date.now() - startTime
    if (duration > SLOW_OPERATION_THRESHOLD) {
      console.warn(`⚠️ Slow sync operation detected: ${operationName} took ${duration}ms`)
    }
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ ${operationName} failed after ${duration}ms:`, error)
    throw error
  }
}

