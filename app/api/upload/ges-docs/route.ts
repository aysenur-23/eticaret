/**
 * GES teklif formu dosya yükleme (elektrik panosu, fatura, çatı fotoğrafı).
 * PDF ve resim (JPEG, PNG, WebP) kabul eder. Google Drive'a yükler, webViewLink döner.
 * Ortam: GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID veya GOOGLE_DRIVE_FOLDER_ID_GES
 */

import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import { google } from 'googleapis'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
])
const ALLOWED_EXT = /\.(pdf|jpg|jpeg|png|webp)$/i

function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY
  const folderId =
    process.env.GOOGLE_DRIVE_FOLDER_ID_GES || process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!clientEmail || !privateKey || !folderId) {
    throw new Error(
      'Google Drive ortam değişkenleri eksik (GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID veya GOOGLE_DRIVE_FOLDER_ID_GES)'
    )
  }
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })
  return { drive: google.drive({ version: 'v3', auth }), folderId }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Dosya gönderilmedi (field: file)' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Dosya boyutu en fazla ${MAX_SIZE_BYTES / 1024 / 1024} MB olabilir.`,
        },
        { status: 400 }
      )
    }
    const mime = file.type || ''
    const name = file.name || 'dosya'
    if (!ALLOWED_MIMES.has(mime) && !ALLOWED_EXT.test(name)) {
      return NextResponse.json(
        {
          error:
            'Sadece PDF veya resim (JPG, PNG, WebP) dosyaları kabul edilir.',
        },
        { status: 400 }
      )
    }

    const { drive, folderId } = getDriveClient()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `ges-${timestamp}-${safeName}`

    const buf = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buf)
    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: mime || 'application/octet-stream',
        body: stream,
      },
    })

    const fileId = res.data.id
    if (!fileId) {
      return NextResponse.json(
        { error: 'Drive dosya oluşturulamadı' },
        { status: 500 }
      )
    }

    const meta = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    })
    const url = (meta.data.webViewLink ||
      meta.data.webContentLink) as string | undefined
    if (!url) {
      return NextResponse.json(
        { error: 'Paylaşım linki alınamadı' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, url })
  } catch (err) {
    console.error('Upload GES docs error:', err)
    const message = err instanceof Error ? err.message : 'Yükleme hatası'
    return NextResponse.json(
      {
        error:
          message.startsWith('Google Drive') ? message : 'Dosya yüklenemedi.',
      },
      { status: 500 }
    )
  }
}
