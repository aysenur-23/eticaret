/**
 * Unique sipariş ve müşteri numarası üretimi.
 * Prisma Sequence tablosu kullanır; transaction ile tekil değer garanti edilir.
 *
 * Sipariş no: ORD-YYYY-NNNNN (örn. ORD-2025-00001)
 * Müşteri no: CUS-NNNNN (örn. CUS-00001)
 */

import { prisma } from '@/lib/prisma'

const ORDER_SEQ_NAME = 'orderNo'
const CUSTOMER_SEQ_NAME = 'customerNo'

/**
 * Sonraki sipariş numarasını döner (unique). Format: ORD-YYYY-NNNNN
 */
export async function getNextOrderNo(): Promise<string> {
  const year = new Date().getFullYear()
  const seq = await prisma.$transaction(async (tx) => {
    const current = await tx.sequence.findUnique({ where: { name: ORDER_SEQ_NAME } })
    if (!current) {
      await tx.sequence.create({ data: { name: ORDER_SEQ_NAME, value: 1 } })
      return 1
    }
    const updated = await tx.sequence.update({
      where: { name: ORDER_SEQ_NAME },
      data: { value: { increment: 1 } },
    })
    return updated.value
  })
  return `ORD-${year}-${String(seq).padStart(5, '0')}`
}

/**
 * Sonraki müşteri numarasını döner (unique). Format: CUS-NNNNN
 */
export async function getNextCustomerNo(): Promise<string> {
  const seq = await prisma.$transaction(async (tx) => {
    const current = await tx.sequence.findUnique({ where: { name: CUSTOMER_SEQ_NAME } })
    if (!current) {
      await tx.sequence.create({ data: { name: CUSTOMER_SEQ_NAME, value: 1 } })
      return 1
    }
    const updated = await tx.sequence.update({
      where: { name: CUSTOMER_SEQ_NAME },
      data: { value: { increment: 1 } },
    })
    return updated.value
  })
  return `CUS-${String(seq).padStart(5, '0')}`
}
