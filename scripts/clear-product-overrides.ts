import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ids = ['hims-hctk-22-g', 'hims-hctk-22-g-tf']
    console.log('Checking overrides for:', ids)

    const overrides = await prisma.productOverride.findMany({
        where: {
            productId: { in: ids }
        }
    })

    if (overrides.length > 0) {
        console.log(`Found ${overrides.length} overrides:`)
        overrides.forEach(o => {
            console.log(`- ID: ${o.productId}, UpdatedAt: ${o.updatedAt}`)
        })

        const deleted = await prisma.productOverride.deleteMany({
            where: {
                productId: { in: ids }
            }
        })
        console.log(`Deleted ${deleted.count} overrides. Mock data should now take precedence.`)
    } else {
        console.log('No overrides found for these IDs.')
    }

    const stockOverrides = await prisma.stockOverride.findMany({
        where: {
            productId: { in: ids }
        }
    })

    if (stockOverrides.length > 0) {
        console.log(`Found ${stockOverrides.length} stock overrides. Deleting...`)
        await prisma.stockOverride.deleteMany({
            where: {
                productId: { in: ids }
            }
        })
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
