// Import both storage implementations
import { uploadInvoice as uploadInvoiceHostinger } from './storage-hostinger'
import { adminStorage } from './firebaseAdmin'

/**
 * Unified Storage Service
 * Uses Hostinger file system if configured, otherwise falls back to Firebase/S3
 * Includes performance tracking and error handling
 */
export async function uploadInvoice(
  orderId: string,
  pdfBuffer: Buffer
): Promise<string> {
  const startTime = Date.now()
  
  try {
    // Priority: Hostinger file system > Firebase/S3
    // If UPLOAD_BASE_DIR is configured, use Hostinger file system
    if (process.env.UPLOAD_BASE_DIR || process.env.NEXT_PUBLIC_BASE_URL) {
      const result = await uploadInvoiceHostinger(orderId, pdfBuffer)
      const duration = Date.now() - startTime
      console.log(`Invoice uploaded via Hostinger FS in ${duration}ms`)
      return result
    }

    // Fallback to Firebase/S3 if Hostinger storage not configured
    const bucket = adminStorage.bucket()
    const fileName = `invoices/${orderId}.pdf`
    
    const file = bucket.file(fileName)
    
    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
      },
    })

    // Make the file publicly readable
    await file.makePublic()

    const duration = Date.now() - startTime
    console.log(`Invoice uploaded via Firebase/S3 in ${duration}ms`)

    // Return the public URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Storage upload error (${duration}ms):`, error)
    throw error instanceof Error ? error : new Error('Failed to upload invoice')
  }
}

// Re-export Hostinger storage functions
export {
  uploadFile,
  uploadProductImage,
  uploadDatasheet,
  uploadModel,
  deleteFile,
  getFileSize,
} from './storage-hostinger'
