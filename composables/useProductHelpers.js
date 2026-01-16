// Pure helper functions - no state dependencies
// These can be imported directly in components

export const getProductColor = (product) => {
  if (product.mainProduct?.attributes?.[0]?.color) {
    return product.mainProduct.attributes[0].color
  }
  if (product.variants?.[0]?.attributes?.[0]?.color) {
    return product.variants[0].attributes[0].color
  }
  return null
}

export const getProductSize = (product) => {
  if (product.mainProduct?.attributes?.[0]?.size) {
    return product.mainProduct.attributes[0].size
  }
  if (product.variants?.[0]?.attributes?.[0]?.size) {
    return product.variants[0].attributes[0].size
  }
  return null
}

export const getDescription = (product) => {
  return product.mainProduct?.description || ''
}

export const getProductBrand = (product) => {
  return product.brand?.name || null
}

export const getDiscountedPrice = (product) => {
  const mainProduct = product.mainProduct
  if (!mainProduct?.price) return 0

  const price = Number(mainProduct.price)
  if (mainProduct.discountValue && mainProduct.discountValue > 0) {
    return Math.round(price * (1 - mainProduct.discountValue / 100))
  }
  return price
}

export const getOriginalPrice = (product) => {
  return product.mainProduct?.price || 0
}

export const getProductRating = (product) => {
  const mainProduct = product.mainProduct
  if (!mainProduct?.reviews?.length) return 0
  const total = mainProduct.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
  return total / mainProduct.reviews.length
}

export const getReviewCount = (product) => {
  return product.mainProduct?.reviews?.length || 0
}

export const getColorHex = (colorName) => {
  if (!colorName) return '#007bff'

  const colorMap = {
    'Green': '#28a745',
    'Pink': '#e83e8c',
    'Black': '#000000',
    'Blue': '#007bff',
    'Red': '#dc3545',
    'White': '#ffffff',
    'Gray': '#6c757d',
    'Grey': '#6c757d',
    'Purple': '#6f42c1',
    'Yellow': '#ffc107',
    'Orange': '#fd7e14',
    'Brown': '#795548',
    'Navy': '#001f3f',
    'Teal': '#20c997',
    'Maroon': '#800000',
    'Gold': '#ffd700'
  }
  return colorMap[colorName] || '#007bff'
}

export const getProductImage = (product) => {
  const mainImages = product.mainProduct?.images || []
  if (mainImages.length > 0) {
    const primaryImage = mainImages.find(img => img.isPrimary === true)
    if (primaryImage?.imageUrl) {
      return primaryImage.imageUrl
    }
    const firstImage = mainImages[0]?.imageUrl
    if (firstImage) {
      return firstImage  
    }
  }

  const variantImages = product.variants?.[0]?.images || []
  if (variantImages.length > 0) {
    const primaryVariantImage = variantImages.find(img => img.isPrimary === true)
    if (primaryVariantImage?.imageUrl) {
      return primaryVariantImage.imageUrl
    } 
    const firstVariantImage = variantImages[0]?.imageUrl
    if (firstVariantImage) {
      return firstVariantImage
    }
  }

  return '/assets/images/placeholder.jpg'
}

export const getProductStock = (product) => {
  return product.mainProduct?.stock || 0
}

export const getProductName = (product) => {
  return product.name || product.mainProduct?.name || 'Unnamed Product'
}

export const ProductSize = (product) => {
  if (!product?.variants) return []

  return [
    ...new Set(
      product.variants
        .map(v => v?.attributes?.[0]?.size)
        .filter(Boolean)
    )
  ]
}

export const ProductColor = (product) => {
  if (!product?.variants) return []

  return [
    ...new Set(
      product.variants
        .map(v => v?.attributes?.[0]?.color)
        .filter(Boolean)
    )
  ]
}

export const getProductCategory = (product) => {
  return product.category?.name || null
}

export const getProductId = (product) => {
  return product.mainProduct?.id || product.groupId
}

// Export all helpers as default for easy import
export default {
  getProductColor,
  getProductSize,
  getDescription,
  getProductBrand,
  getDiscountedPrice,
  getOriginalPrice,
  getProductRating,
  getReviewCount,
  getColorHex,
  getProductImage,
  getProductStock,
  getProductName,
  ProductSize,
  ProductColor,
  getProductCategory,
  getProductId
}