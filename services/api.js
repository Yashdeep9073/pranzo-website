// API service functions
const CATEGORY_API = 'https://kartmania-api.vibrantick.org/common/product-category/read'
const COLORS_API = 'https://kartmania-api.vibrantick.org/common/color/read'
const SIZES_API = 'https://kartmania-api.vibrantick.org/common/size/read'

export const fetchCategories = async () => {
  try {
    const response = await fetch(CATEGORY_API)
    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(category => ({
        id: category.id,
        name: category.name,
        image: category.image,
        productCount: category._count?.products || 0
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const fetchColors = async () => {
  try {
    const response = await fetch(COLORS_API)
    const data = await response.json()
    
    if (data.colors && Array.isArray(data.colors)) {
      return data.colors.map(color => ({
        id: color.id,
        name: color.name,
        hex: color.hex
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching colors:', error)
    return []
  }
}

export const fetchSizes = async () => {
  try {
    const response = await fetch(SIZES_API)
    const data = await response.json()
    
    if (data.sizes && Array.isArray(data.sizes)) {
      return data.sizes.map(size => ({
        id: size.id,
        name: size.size
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching sizes:', error)
    return []
  }
}