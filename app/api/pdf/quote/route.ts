import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, bom, customerInfo } = body

    if (!bom) {
      return NextResponse.json(
        { error: 'BOM verisi gerekli' },
        { status: 400 }
      )
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    // Add content to PDF
    doc.fontSize(20).text('Batarya Teklifi', 50, 50)
    doc.fontSize(12).text(`Proje: ${projectName || 'Batarya Konfigürasyonu'}`, 50, 80)
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 50, 100)
    
    if (customerInfo) {
      doc.text(`Müşteri: ${customerInfo.name}`, 50, 120)
      doc.text(`E-posta: ${customerInfo.email}`, 50, 140)
    }

    // Add BOM summary
    doc.fontSize(16).text('Özet', 50, 180)
    doc.fontSize(12)
    doc.text(`Toplam Maliyet: ₺${bom.summary.totalCost.toFixed(2)}`, 50, 200)
    doc.text(`Voltaj: ${bom.summary.batterySpecs.vnom.toFixed(1)}V`, 50, 220)
    doc.text(`Kapasite: ${bom.summary.batterySpecs.ah.toFixed(1)}Ah`, 50, 240)
    doc.text(`Enerji: ${bom.summary.batterySpecs.wh.toFixed(0)}Wh`, 50, 260)
    doc.text(`Ağırlık: ${bom.summary.batterySpecs.weight.toFixed(1)}kg`, 50, 280)

    // Add BOM items
    let yPosition = 320
    doc.fontSize(16).text('Malzeme Listesi', 50, yPosition)
    yPosition += 30

    bom.items.forEach((category: any) => {
      doc.fontSize(14).text(category.category, 50, yPosition)
      yPosition += 20

      category.items.forEach((item: any) => {
        doc.fontSize(12)
        doc.text(`${item.name} x${item.quantity}`, 70, yPosition)
        doc.text(`₺${item.unitCost.toFixed(2)}`, 400, yPosition)
        doc.text(`₺${item.totalCost.toFixed(2)}`, 500, yPosition)
        yPosition += 20

        // Add specifications
        if (item.specifications) {
          Object.entries(item.specifications).forEach(([key, value]) => {
            doc.fontSize(10).text(`  ${key}: ${value}`, 90, yPosition)
            yPosition += 15
          })
        }
        yPosition += 10
      })
      yPosition += 20
    })

    // Add technical specifications
    yPosition += 20
    doc.fontSize(16).text('Teknik Özellikler', 50, yPosition)
    yPosition += 30

    doc.fontSize(12)
    doc.text(`S/P Konfigürasyonu: ${bom.summary.batterySpecs.ns}S${bom.summary.batterySpecs.np}P`, 50, yPosition)
    yPosition += 20
    doc.text(`Maksimum Akım: ${bom.summary.batterySpecs.iAvailable.toFixed(1)}A`, 50, yPosition)
    yPosition += 20
    doc.text(`Pik Akım: ${bom.summary.batterySpecs.iPeakAvailable.toFixed(1)}A`, 50, yPosition)
    yPosition += 20
    doc.text(`Boyutlar: ${bom.summary.batterySpecs.dimensions.width}×${bom.summary.batterySpecs.dimensions.height}×${bom.summary.batterySpecs.dimensions.length}mm`, 50, yPosition)

    // Add cable specifications
    if (bom.summary.cableSpecs) {
      yPosition += 40
      doc.fontSize(16).text('Kablo Özellikleri', 50, yPosition)
      yPosition += 30
      doc.fontSize(12)
      doc.text(`Önerilen AWG: ${bom.summary.cableSpecs.awg}`, 50, yPosition)
      yPosition += 20
      doc.text(`Direnç: ${bom.summary.cableSpecs.resistance.toFixed(2)}mΩ/m`, 50, yPosition)
      yPosition += 20
      doc.text(`Voltaj Düşümü: ${bom.summary.cableSpecs.voltageDrop.toFixed(2)}V`, 50, yPosition)
    }

    // Add thermal specifications
    if (bom.summary.thermalSpecs) {
      yPosition += 40
      doc.fontSize(16).text('Termal Özellikler', 50, yPosition)
      yPosition += 30
      doc.fontSize(12)
      doc.text(`Güç Kaybı: ${bom.summary.thermalSpecs.powerLoss.toFixed(2)}W`, 50, yPosition)
      yPosition += 20
      doc.text(`Sıcaklık Artışı: ${bom.summary.thermalSpecs.temperatureRise.toFixed(1)}°C`, 50, yPosition)
      if (bom.summary.thermalSpecs.warning) {
        doc.text('⚠️ Termal uyarı: Yüksek sıcaklık artışı bekleniyor', 50, yPosition + 20)
      }
    }

    // Add charger specifications
    if (bom.summary.chargerSpecs) {
      yPosition += 40
      doc.fontSize(16).text('Şarj Cihazı Özellikleri', 50, yPosition)
      yPosition += 30
      doc.fontSize(12)
      doc.text(`Uyumluluk: ${bom.summary.chargerSpecs.compatible ? 'Uyumlu' : 'Uyumsuz'}`, 50, yPosition)
      yPosition += 20
      doc.text(`Şarj Süresi: ${bom.summary.chargerSpecs.chargeTime.toFixed(1)} saat`, 50, yPosition)
      yPosition += 20
      doc.text(`Verimlilik: %${(bom.summary.chargerSpecs.efficiency * 100).toFixed(1)}`, 50, yPosition)
    }

    // Add footer
    yPosition += 60
    doc.fontSize(10).text('Bu teklif otomatik olarak oluşturulmuştur.', 50, yPosition)
    doc.text('Detaylı bilgi için lütfen iletişime geçin.', 50, yPosition + 15)

    // Finalize PDF
    doc.end()

    const pdfBuffer = await pdfPromise

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="batarya-teklifi-${projectName || 'konfigurasyon'}.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'PDF oluşturma hatası' },
      { status: 500 }
    )
  }
}
