export default defineEventHandler((event) => {
  const query = getQuery(event)

  const limit = Number(query.limit || 10)
  const cursor = Number(query.cursor || 0)

  const allProducts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 2000) + 500,
    image: `https://picsum.photos/300/300?random=${i + 1}`,
    categoryId: Math.floor(i / 10) + 1
  }))

  const products = allProducts.slice(cursor, cursor + limit)

  return {
    products,
    nextCursor: cursor + products.length
  }
})
