import { mockProducts } from './lib/products-mock'

const ids = ['hims-hctk-22-g', 'hims-hctk-22-g-tf']
ids.forEach(id => {
    const p = mockProducts.find(x => x.id === id)
    if (p) {
        console.log(`Product found: ${id}`)
        console.log(`- Name: ${p.name}`)
        console.log(`- Image: ${p.image}`)
        console.log(`- Images Count: ${p.images?.length ?? 0}`)
        console.log(`- Description length: ${p.description?.length ?? 0}`)
    } else {
        console.log(`Product NOT found: ${id}`)
    }
})
