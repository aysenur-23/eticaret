/**
 * Test Storage API
 * Tests file upload and storage functionality
 */

import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, deleteFile, getFileSize } from '@/lib/storage'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'public', 'uploads')
    const publicUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://bataryakit.com'

    // Check if upload directory exists and is writable
    let dirExists = false
    let dirWritable = false
    let dirPath = ''

    try {
      await fs.access(uploadBaseDir)
      dirExists = true
      dirPath = uploadBaseDir

      // Try to write a test file
      const testFile = path.join(uploadBaseDir, '.test-write')
      await fs.writeFile(testFile, 'test')
      await fs.unlink(testFile)
      dirWritable = true
    } catch (error) {
      // Directory doesn't exist or not writable
    }

    // Check storage type
    const storageType = process.env.UPLOAD_BASE_DIR ? 'Hostinger File System' : 
                       process.env.STORAGE_BUCKET ? 'S3-Compatible' : 
                       'Default (public/uploads)'

    return NextResponse.json({
      storage: {
        type: storageType,
        baseDir: uploadBaseDir,
        publicUrl: publicUrl,
        dirExists: dirExists,
        dirWritable: dirWritable,
        configured: !!(process.env.UPLOAD_BASE_DIR || process.env.STORAGE_BUCKET),
      },
    })
  } catch (error) {
    console.error('Storage test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create a test file
    const testContent = Buffer.from('Test file content - ' + new Date().toISOString())
    const testFileName = `test-${Date.now()}.txt`

    // Upload test file
    const fileUrl = await uploadFile('products', testContent, testFileName, 'text/plain')

    // Get file size
    const fileSize = await getFileSize(fileUrl)

    // Clean up - delete test file
    await deleteFile(fileUrl)

    return NextResponse.json({
      success: true,
      message: 'Storage test successful',
      data: {
        uploaded: fileUrl,
        size: fileSize,
        deleted: true,
      },
    })
  } catch (error) {
    console.error('Storage upload test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

