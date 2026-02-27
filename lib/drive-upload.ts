/**
 * Google Drive upload for teklif design files (3D Baskı, Mekanik Üretim).
 *
 * Required env:
 * - GOOGLE_DRIVE_CLIENT_EMAIL (Service Account email)
 * - GOOGLE_DRIVE_PRIVATE_KEY (private key string; use \n for newlines in .env)
 * - GOOGLE_DRIVE_FOLDER_ID (Drive folder ID where files are uploaded)
 *
 * In Google Cloud: enable Drive API, create Service Account, download JSON.
 * In Drive: create folder "Teklif Tasarımlar", share it with the Service Account email (Editor).
 */

import { Readable } from 'stream'
import { google } from 'googleapis'

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
const ALLOWED_MIMES = [
  'application/pdf',
  'application/zip',
  'model/step+xml',
  'application/step',
  'model/stl',
  'application/octet-stream', // STEP/STL sometimes sent as this
]

export async function uploadDesignToDrive(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const email = process.env.GOOGLE_DRIVE_CLIENT_EMAIL
  const key = process.env.GOOGLE_DRIVE_PRIVATE_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!email || !key || !folderId) {
    return {
      success: false,
      error: 'Google Drive is not configured (missing GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY, or GOOGLE_DRIVE_FOLDER_ID)',
    }
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'Dosya boyutu 20 MB sınırını aşıyor.' }
  }

  const normalizedMime = mimeType?.toLowerCase() || 'application/octet-stream'
  const allowed =
    ALLOWED_MIMES.includes(normalizedMime) ||
    normalizedMime.startsWith('model/') ||
    normalizedMime === 'application/octet-stream'
  if (!allowed) {
    return {
      success: false,
      error: 'Bu dosya türü kabul edilmiyor. PDF, STEP, STL veya ZIP yükleyin.',
    }
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: key.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const drive = google.drive({ version: 'v3', auth })
    const safeName = originalName?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'design'
    const timestamp = Date.now()
    const name = `teklif-${timestamp}-${safeName}`

    const res = await drive.files.create({
      requestBody: {
        name,
        parents: [folderId],
      },
      media: {
        mimeType: normalizedMime,
        body: Readable.from(buffer),
      },
      fields: 'id, webViewLink, webContentLink',
    })

    const fileId = res.data.id
    if (!fileId) {
      return { success: false, error: 'Drive did not return file ID' }
    }

    // Optional: allow anyone with link to view (for admin to open)
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    }).catch(() => {})

    const link = (res.data.webViewLink || res.data.webContentLink || `https://drive.google.com/file/d/${fileId}/view`) as string
    return { success: true, url: link }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Drive upload failed'
    console.error('Drive upload error:', err)
    return { success: false, error: message }
  }
}
