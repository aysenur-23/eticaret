/**
 * Hostinger File Storage
 * Uses Hostinger's file system for static and dynamic file storage
 * For static files: Use Next.js public folder
 * For dynamic files: Use Hostinger's file system (public_html/uploads)
 */

import fs from 'fs/promises'
import path from 'path'

// Base upload directory (Hostinger'da public_html/uploads olacak)
// Production'da: /home/username/public_html/uploads
// Development'ta: ./public/uploads
const UPLOAD_BASE_DIR = process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'public', 'uploads')
const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Cache directory existence check
const dirCache = new Set<string>()

/**
 * Ensure upload directory exists (with caching for performance)
 */
async function ensureUploadDir(subDir: string = '') {
  const dirPath = subDir ? path.join(UPLOAD_BASE_DIR, subDir) : UPLOAD_BASE_DIR
  
  // Check cache first
  if (dirCache.has(dirPath)) {
    return
  }

  try {
    // Check if directory exists
    try {
      const stats = await fs.stat(dirPath)
      if (stats.isDirectory()) {
        dirCache.add(dirPath)
        return
      }
    } catch {
      // Directory doesn't exist, create it
    }

    // Create directory with proper permissions
    await fs.mkdir(dirPath, { 
      recursive: true,
      mode: 0o755 // rwxr-xr-x
    })
    
    // Cache successful creation
    dirCache.add(dirPath)
  } catch (error) {
    console.error('Failed to create upload directory:', error)
    throw new Error(`Failed to create upload directory: ${dirPath}`)
  }
}

/**
 * Upload file to Hostinger file system
 */
export async function uploadFile(
  category: 'products' | 'invoices' | 'datasheets' | 'reviews' | 'models',
  fileBuffer: Buffer,
  fileName: string,
  contentType?: string
): Promise<string> {
  const startTime = Date.now()
  
  try {
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (fileBuffer.length > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`)
    }

    // Validate file name (prevent path traversal)
    const safeFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_')
    if (!safeFileName || safeFileName.length === 0) {
      throw new Error('Invalid file name')
    }

    // Ensure directory exists
    await ensureUploadDir(category)

    // Generate unique filename with better collision avoidance
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(safeFileName) || '.bin'
    const baseName = path.basename(safeFileName, ext)
    const uniqueFileName = `${baseName}-${timestamp}-${random}${ext}`
    const filePath = path.join(UPLOAD_BASE_DIR, category, uniqueFileName)

    // Write file atomically (write to temp file first, then rename)
    const tempPath = `${filePath}.tmp`
    try {
      await fs.writeFile(tempPath, fileBuffer, { mode: 0o644 }) // rw-r--r--
      await fs.rename(tempPath, filePath)
    } catch (error) {
      // Clean up temp file if rename fails
      try {
        await fs.unlink(tempPath)
      } catch {
        // Ignore cleanup errors
      }
      throw error
    }

    const duration = Date.now() - startTime
    console.log(`File uploaded in ${duration}ms: ${uniqueFileName} (${(fileBuffer.length / 1024).toFixed(2)}KB)`)

    // Return public URL
    // Production'da: https://yourdomain.com/uploads/products/image.jpg
    // Development'ta: http://localhost:3000/uploads/products/image.jpg
    const relativePath = path.join('uploads', category, uniqueFileName).replace(/\\/g, '/')
    return `${PUBLIC_URL}/${relativePath}`
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`File upload error (${duration}ms):`, error)
    throw error instanceof Error ? error : new Error('Failed to upload file')
  }
}

/**
 * Upload invoice PDF
 */
export async function uploadInvoice(
  orderId: string,
  pdfBuffer: Buffer
): Promise<string> {
  return uploadFile('invoices', pdfBuffer, `${orderId}.pdf`, 'application/pdf')
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  productId: string,
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  return uploadFile('products', imageBuffer, `${productId}-${fileName}`, 'image/jpeg')
}

/**
 * Upload datasheet PDF
 */
export async function uploadDatasheet(
  productId: string,
  pdfBuffer: Buffer,
  fileName: string
): Promise<string> {
  return uploadFile('datasheets', pdfBuffer, `${productId}-${fileName}`, 'application/pdf')
}

/**
 * Upload 3D model file
 */
export async function uploadModel(
  productId: string,
  modelBuffer: Buffer,
  fileName: string
): Promise<string> {
  return uploadFile('models', modelBuffer, `${productId}-${fileName}`)
}

/**
 * Delete file
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl)
    const urlPath = url.pathname
    
    // Remove leading slash and check if it's in uploads folder
    const cleanPath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
    if (!cleanPath.startsWith('uploads/')) {
      console.error('Invalid file path for deletion:', cleanPath)
      return false
    }

    // Use UPLOAD_BASE_DIR if configured, otherwise use public/uploads
    const baseDir = process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'public')
    const filePath = path.join(baseDir, cleanPath)

    await fs.unlink(filePath)
    return true
  } catch (error) {
    console.error('File delete error:', error)
    return false
  }
}

/**
 * Get file size
 */
export async function getFileSize(fileUrl: string): Promise<number> {
  try {
    const url = new URL(fileUrl)
    const urlPath = url.pathname
    const cleanPath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
    
    if (!cleanPath.startsWith('uploads/')) {
      return 0
    }

    const baseDir = process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'public')
    const filePath = path.join(baseDir, cleanPath)
    const stats = await fs.stat(filePath)
    return stats.size
  } catch (error) {
    console.error('Get file size error:', error)
    return 0
  }
}

