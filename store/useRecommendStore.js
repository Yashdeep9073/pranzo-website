import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsApi } from '~/composables/api/useProductsApi'

export const useRecommendStore = defineStore('recommend', () => {
  const config = useRuntimeConfig()
  const graphql = config.public.api?.graphql || null
  const API_URL_CATEGORY = config.public.api?.categories || null

  // State
  const products = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({  
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12
  })
  
  // Cache
  const productsCache = ref({})
  const categoryCache = ref(null)
  const lastFetchTime = ref({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Computed
  const hasProducts = computed(() => products.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  
  const getAllCategories = computed(() => {
    return categories.value
  })
  
  const getCategoriesWithProducts = computed(() => {
    const cats = categories.value
    return cats.filter(cat => (cat.productCount || 0) > 0)
  })

  // GraphQL query
  const PRODUCT_FILTER_QUERY = `
    query ProductFilter($page: Int, $limit: Int, $category: String, $sortBy: String) {
      productFilter(page: $page, limit: $limit, category: $category, sortBy: $sortBy) {
        data {
          groupId
          name
          category {
            name
            id
          }
          mainProduct {
            id
            name
            price
            description
            discountValue
            stock
            popularity
            images {
              isPrimary
              imageUrl
            }
            reviews {
              rating
              review
            }
            attributes {
              id
              color
              size
            }
          }
          variants {
            id
            name
            price
            images {
              id
              isPrimary
              imageUrl
            }
            attributes {
              color
              size
            }
          }
        }
        pagination {
          currentPage
          lastPage
          total
          perPage
        }
      }
    }
  `

  // Check if cache is valid
  const isCacheValid = (cacheKey) => {
    const lastTime = lastFetchTime.value[cacheKey]
    if (!lastTime) return false
    return (Date.now() - lastTime) < CACHE_DURATION
  }

  // Get from cache
  const getFromCache = (cacheKey) => {
    if (isCacheValid(cacheKey)) {
      return productsCache.value[cacheKey]
    }
    return null
  }

  // Save to cache
  const saveToCache = (cacheKey, data, paginationData) => {
    productsCache.value[cacheKey] = {
      products: data,
      pagination: paginationData,
      timestamp: Date.now()
    }
    lastFetchTime.value[cacheKey] = Date.now()
    
    try {
      localStorage.setItem(`products_cache_${cacheKey}`, JSON.stringify({
        products: data,
        pagination: paginationData,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.warn('LocalStorage save failed:', e)
    }
  }

  // Main fetch function using useProductsApi hook
  const fetchProducts = async (filters = {}, forceRefresh = false) => {
    try {
      isLoading.value = true
      error.value = null

      const { page = 1, limit = 10, category = null, sortBy = 'popularity' } = filters
      
      // Convert category name to categoryId if needed
      let categoryId = null
      if (category && typeof category === 'string') {
        // Find category by name from categories array
        const foundCategory = categories.value.find(cat => 
          cat.name?.toLowerCase() === category.toLowerCase()
        )
        categoryId = foundCategory?.id || null
      } else if (category && typeof category === 'number') {
        categoryId = category
      }

      // Use the products API hook
      const { products: apiProducts, loading: apiLoading, error: apiError, refresh } = useProductsApi({
        categoryId: categoryId,
        limit: limit,
        page: page,
        sort: sortBy === 'popularity' ? 'popular' : sortBy
      })
      
      // Call the fetch function
      await refresh()
      
      // Wait for loading to complete
      while (apiLoading.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Check if we got product data
      if (apiProducts.value && apiProducts.value.length > 0) {
        // Convert products to the expected format for the store
        const convertedProducts = apiProducts.value.map(product => ({
          groupId: product.id?.toString() || `group-${product.id}`,
          name: product.name,
          category: product.category,
          mainProduct: {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            popularity: product.popularity,
            images: product.images || [],
            description: product.description || '',
            discountValue: 0, // Add if your API has discount info
            reviews: [], // Add if your API has reviews
            attributes: [] // Add if your API has attributes
          },
          variants: [] // Add if your API has variants
        }))
        
        products.value = convertedProducts
        pagination.value = {
          currentPage: page,
          lastPage: Math.ceil(convertedProducts.length / limit),
          total: convertedProducts.length,
          perPage: limit
        }
        
        console.log(`Products fetched for category "${category || 'all'}": ${convertedProducts.length} items`)
      } else {
        console.warn('API returned empty products array')
        products.value = []
        pagination.value = {
          currentPage: 1,
          lastPage: 1,
          total: 0,
          perPage: limit
        }
      }

      return products.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
      
      // Set empty state on error
      products.value = []
      pagination.value = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: limit
      }
      
      return products.value
    } finally {
      isLoading.value = false
    }
  }

  // Fetch categories
  const fetchCategories = async (forceRefresh = false) => {
    try {
      // Check if API endpoint is available
      if (!API_URL_CATEGORY) {
        console.warn('Categories API endpoint not configured')
        categories.value = []
        return categories.value
      }

      // Check cache first
      if (!forceRefresh && categoryCache.value && isCacheValid('categories')) {
        console.log('Using cached categories')
        categories.value = categoryCache.value
        return categories.value
      }

      isLoading.value = true
      error.value = null

      console.log('Fetching categories from API...', API_URL_CATEGORY)
      
      let response;
      try {
        response = await fetch(API_URL_CATEGORY, { timeout: 10000 })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (fetchError) {
        console.error('Network error fetching categories:', fetchError)
        throw new Error('Network error: Unable to fetch categories')
      }

      const result = await response.json()

      // Check if we got valid data
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const allCategories = result.data
          .map(category => ({
            id: category.id?.toString() || Math.random().toString(36).substr(2, 9),
            name: category.name || 'Unnamed Category',
            productCount: category._count?.products || 0,
            image: category.image,
            logo: category.logo,
            hasProducts: (category._count?.products || 0) > 0
          }))
          .filter(category => category.name && category.id)
          .sort((a, b) => b.productCount - a.productCount)

        console.log('Processed categories:', allCategories.length)
        
        categories.value = allCategories
        categoryCache.value = allCategories
        lastFetchTime.value['categories'] = Date.now()
        
        console.log(`Categories fetched: ${allCategories.length} items`)
      } else {
        console.warn('No valid categories data in response')
        categories.value = []
      }

      return categories.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)
      
      categories.value = []
      return categories.value
    } finally {
      isLoading.value = false
    }
  }

  // ==================== PRODUCT GETTERS ====================
  const getProductName = (product) => {
    if (!product) return 'Product Name'
    
    return product.name || product.mainProduct?.name || 'Unnamed Product'
  }

  const getProductImage = (product, index = 0) => {
    if (!product) return '/assets/images/placeholder.jpg'
    
    // Try API image first
    const primaryImage = product?.mainProduct?.images?.find(img => img.isPrimary)
    if (primaryImage?.imageUrl) {
      if (primaryImage.imageUrl.startsWith('http')) {
        return primaryImage.imageUrl
      } else {
        return `https://kartmania-api.vibrantick.org${primaryImage.imageUrl}`
      }
    }

    const mainImage = product?.mainProduct?.images?.[0]?.imageUrl
    if (mainImage) {
      if (mainImage.startsWith('http')) {
        return mainImage
      } else {
        return `https://kartmania-api.vibrantick.org${mainImage}`
      }
    }

    const variantImage = product?.variants?.[0]?.images?.find(img => img.isPrimary)?.imageUrl
    if (variantImage) {
      if (variantImage.startsWith('http')) {
        return variantImage
      } else {
        return `https://kartmania-api.vibrantick.org${variantImage}`
      }
    }

    // Default placeholder image
    return '/assets/images/placeholder.jpg'
  }

  const getOriginalPrice = (product) => {
    if (!product) return 0
    
    const price = product?.mainProduct?.price || product?.price || 0
    return parseFloat(price) || 0
  }

  const getDiscountedPrice = (product) => {
    const originalPrice = getOriginalPrice(product)
    
    const discountValue = product?.mainProduct?.discountValue || product?.discountValue || 0
    
    if (discountValue > 0 && discountValue <= 100) {
      const discounted = originalPrice - (originalPrice * discountValue / 100)
      return Math.max(0, Math.round(discounted))
    }
    return originalPrice
  }

  const getProductRating = (product) => {
    if (!product) return 4.0
    
    const reviews = product?.mainProduct?.reviews || []
    if (reviews.length === 0) return 4.0 + Math.random() * 0.5
    
    const totalRating = reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0)
    const average = totalRating / reviews.length
    return parseFloat(average.toFixed(1))
  }

  const getReviewCount = (product) => {
    if (!product) return Math.floor(Math.random() * 100) + 5
    
    return product?.mainProduct?.reviews?.length || Math.floor(Math.random() * 100) + 5
  }

  const getProductStock = (product) => {
    if (!product) return Math.floor(Math.random() * 50) + 10
    
    return product?.mainProduct?.stock || product?.stock || Math.floor(Math.random() * 50) + 10
  }

  const hasDiscount = (product) => {
    const originalPrice = getOriginalPrice(product)
    const discountedPrice = getDiscountedPrice(product)
    return originalPrice > 0 && discountedPrice < originalPrice
  }

  const getDiscountPercentage = (product) => {
    const originalPrice = getOriginalPrice(product)
    const discountedPrice = getDiscountedPrice(product)
    
    if (originalPrice > 0 && discountedPrice < originalPrice) {
      const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
      return Math.round(discount)
    }
    return 0
  }

  const isBestSeller = (product) => {
    if (!product) return false
    
    const popularity = product?.mainProduct?.popularity || product?.popularity || Math.floor(Math.random() * 100)
    return popularity > 80
  }

  // Initialize
  const initialize = async () => {
    try {
      // Fetch categories first
      await fetchCategories()
      
      // Load initial products
      await fetchProducts({ sortBy: 'popularity' })
      
      return { 
        success: true
      }
    } catch (err) {
      console.error('Initialize failed:', err)
      return { 
        success: false, 
        error: err.message
      }
    }
  }

  return {
    // State
    products,
    categories,
    isLoading,
    error,
    pagination,
    
    // Computed
    hasProducts,
    hasCategories,
    getAllCategories,
    getCategoriesWithProducts,

    // Actions
    fetchProducts,
    fetchCategories,
    
    // Product Getters
    getProductName,
    getProductImage,
    getOriginalPrice,
    getDiscountedPrice,
    getProductRating,
    getReviewCount,
    getProductStock,
    hasDiscount,
    getDiscountPercentage,
    isBestSeller,
    
    // Initialization
    initialize
  }
})