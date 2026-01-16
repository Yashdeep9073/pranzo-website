import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
 const config = useRuntimeConfig()
const graphql = config.public.api.graphql
const API_URL_MEDIA = config.public.api.Media
export const useRecommendStore = defineStore('recommend', () => {
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
  // Cache for instant switching
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
    return categories.value.filter(cat => (cat.productCount || 0) > 0)
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
    
    // Also save to localStorage for persistence
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

  // Load from localStorage on init
  const loadCacheFromStorage = () => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('products_cache_')) {
          const data = JSON.parse(localStorage.getItem(key))
          const cacheKey = key.replace('products_cache_', '')
          if (data && (Date.now() - data.timestamp) < CACHE_DURATION) {
            productsCache.value[cacheKey] = data
            lastFetchTime.value[cacheKey] = data.timestamp
          }
        }
      })
    } catch (e) {
      console.warn('LocalStorage load failed:', e)
    }
  }

// Main fetch function with caching
const fetchProducts = async (filters = {}, forceRefresh = false) => {
  try {
    isLoading.value = true
    error.value = null

    const { page = 1, limit = 10, category = null, sortBy = 'popularity' } = filters
    const cacheKey = `products_${category || 'all'}_${sortBy}_${page}_${limit}`

    // DEBUG: Log what we're fetching
    console.log(' DEBUG fetchProducts:', { 
      category, 
      isNull: category === null,
      isUndefined: category === undefined,
      filters 
    })

    // Check cache if not forcing refresh
    if (!forceRefresh) {
      const cached = getFromCache(cacheKey)
      if (cached) {
        console.log(` Using cached data for: ${cacheKey}`)
        products.value = cached.products
        pagination.value = cached.pagination
        isLoading.value = false
        return cached.products
      }
    }

    console.log(` Fetching products with filters:`, { page, limit, category, sortBy })

    const response = await fetch(graphql, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({
        query: PRODUCT_FILTER_QUERY,
        variables: { 
          page,
          limit, 
          category,
          sortBy
        } 
      })
    })
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    console.log(' GraphQL Response:', {
      hasData: !!result.data,
      hasProductFilter: !!result.data?.productFilter,
      dataLength: result.data?.productFilter?.data?.length || 0,
      firstProductCategory: result.data?.productFilter?.data?.[0]?.category?.name
    })

    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      throw new Error(result.errors[0]?.message || 'GraphQL error')
    }

    if (result.data?.productFilter) {
      const { data, pagination: paginationData } = result.data.productFilter
      
      // DEBUG: Check what we got
      console.log(` Products fetched for "${category || 'all'}": ${data?.length || 0} items`)
      if (data && data.length > 0) {
        console.log('First 3 products categories:', data.slice(0, 3).map(p => p.category?.name))
      }
      
      products.value = data || []
      pagination.value = paginationData
      
      // Save to cache
      saveToCache(cacheKey, data, paginationData)
      
    } else {
      products.value = []
      console.warn('No productFilter data in response')
    }

    return products.value
  } catch (err) {
    error.value = err.message
    console.error(' Error fetching products:', err)
    
    // Try to show cached data on error
    const cacheKey = `products_${filters.category || 'all'}_${filters.sortBy || 'popularity'}_${filters.page || 1}_${filters.limit || 12}`
    const cached = getFromCache(cacheKey)
    if (cached) {
      console.log(` Showing cached data on error for: ${cacheKey}`)
      products.value = cached.products
      pagination.value = cached.pagination
    } else {
      products.value = []
    }
    
    return products.value
  } finally {
    isLoading.value = false
  }
}

  // Fetch categories with caching
  const fetchCategories = async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh && categoryCache.value && isCacheValid('categories')) {
        console.log(' Using cached categories')
        categories.value = categoryCache.value
        return categories.value
      }

      isLoading.value = true
      error.value = null

      console.log(' Fetching categories from API...')

      const response = await fetch(API_URL_MEDIA)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.data && Array.isArray(result.data)) {
        const allCategories = result.data
          .filter(category => 
            category.name && 
            category.id && 
            !category.isDeleted
          )
          .map(category => ({
            id: category.id.toString(),
            name: category.name,
            productCount: category._count?.products || 0,
            image: category.image,
            logo: category.logo,
            hasProducts: (category._count?.products || 0) > 0
          }))
          .sort((a, b) => {
            if (a.hasProducts !== b.hasProducts) {
              return b.hasProducts - a.hasProducts
            }
            if (b.productCount !== a.productCount) {
              return b.productCount - a.productCount
            }
            return a.name.localeCompare(b.name)
          })

        categories.value = allCategories
        categoryCache.value = allCategories
        lastFetchTime.value['categories'] = Date.now()
        
        console.log(` Categories fetched: ${allCategories.length} items`)
      } else {
        console.warn('No categories data in response')
        categories.value = getFallbackCategories()
      }

      return categories.value
    } catch (err) {
      error.value = err.message
      console.error(' Error fetching categories:', err)
      categories.value = getFallbackCategories()
      return categories.value
    } finally {
      isLoading.value = false
    }
  }

  // Prefetch all categories' products 
  const prefetchAllCategoryProducts = async () => {
    try {
      console.log(' Starting background prefetch of all categories...')
      
      // Get categories first
      await fetchCategories()
      
      // Prefetch products for each category (non-blocking)
      const prefetchPromises = categories.value.map(async (category) => {
        try {
          // Don't wait for each to complete - do them in parallel 
          fetchProducts({
            page: 1,
            limit: 10,
            category: category.name,
            sortBy: 'popularity'
          }).catch(e => console.warn(`Prefetch failed for ${category.name}:`, e))
          
          // Small delay to not overload server
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (e) {
          // Silent fail for prefetch
        }
      })
      
      // Also prefetch 'all' products
      fetchProducts({
        page: 1,
        limit: 10,
        category: null,
        sortBy: 'popularity'
      }).catch(e => console.warn('Prefetch failed for all:', e))
      
      console.log(' Background prefetch initiated for all categories')
      
    } catch (error) {
      console.warn('Background prefetch failed:', error)
    }
  }
  
  // Get cached products for instant switching
const getCachedProducts = (categoryName) => {
  const cacheKey = `products_${categoryName || 'all'}_popularity_1_12`
  const cached = getFromCache(cacheKey)
  return cached ? cached.products : null
}
  // Set products directly (for instant switching)
const setProductsDirect = (categoryName) => {
  const cachedProducts = getCachedProducts(categoryName)
  if (cachedProducts) {
    products.value = cachedProducts
    console.log(` Instantly showing cached products for: ${categoryName || 'all'}`)
    return true
  }
  return false
}
  // Quick category switch with fallback
const switchCategory = async (categoryName) => {
  const category = categoryName === 'all' ? null : categoryName
  
  // First try to show cached data instantly
  if (setProductsDirect(categoryName)) {
    return { instant: true, data: products.value }
  }
  
  // If no cache, fetch fresh data
  const data = await fetchProducts({
    page: 1,
    limit: 10,
    category: category,
    sortBy: 'popularity'
  })
  
  return {
    instant: false,
    data: data
  }
}

  // Rest of the store functions (getters, helpers) remain the same
  const getProductName = (product) => {
    return product?.name || product?.mainProduct?.name || 'Unnamed Product'
  }

  const getProductBrand = (product) => {
    return product?.brand || product?.mainProduct?.brand || 'Unknown Brand'
  }

  const getProductImage = (product) => {
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

    return 'https://via.placeholder.com/300x200?text=Product+Image'
  }

  const getOriginalPrice = (product) => {
    const price = product?.mainProduct?.price || 0
    return parseFloat(price) || 0
  }

  const getDiscountedPrice = (product) => {
    const originalPrice = getOriginalPrice(product)
    const discountValue = product?.mainProduct?.discountValue || 0
    
    if (discountValue > 0 && discountValue <= 100) {
      const discounted = originalPrice - (originalPrice * discountValue / 100)
      return Math.max(0, discounted)
    }
    return originalPrice
  }

  const getProductRating = (product) => {
    const reviews = product?.mainProduct?.reviews || []
    if (reviews.length === 0) return 4.0
    
    const totalRating = reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0)
    const average = totalRating / reviews.length
    return parseFloat(average.toFixed(1))
  }

  const getReviewCount = (product) => {
    return product?.mainProduct?.reviews?.length || 0
  }

  const getProductStock = (product) => {
    return product?.mainProduct?.stock || 0
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
    const popularity = product?.mainProduct?.popularity || 0
    return popularity > 80
  }

  const getFallbackCategories = () => {
    return [
      { id: 'all', name: 'All', productCount: 27, hasProducts: true },
      { id: '6', name: 'Women', productCount: 11, hasProducts: true },
      { id: '12', name: 'Men', productCount: 16, hasProducts: true },
      { id: '3', name: 'Mobile', productCount: 0, hasProducts: false },
      { id: '10', name: 'Electronic', productCount: 0, hasProducts: false },
      { id: '13', name: 'Kitchen', productCount: 0, hasProducts: false },
      { id: '11', name: 'Skin care', productCount: 0, hasProducts: false }
    ]
  }

  // Initialize store with prefetching
  const initialize = async () => {
    try {
      // Load cache from localStorage
      loadCacheFromStorage()
      
      // Fetch categories
      await fetchCategories()
      
      // Start background prefetching
      setTimeout(() => {
        prefetchAllCategoryProducts()
      }, 0)
      
      // Load initial products
      await fetchProducts({ sortBy: 'popularity' })
      
      return { success: true }
    } catch (err) {
      console.error('Initialize failed:', err)
      return { success: false, error: err.message }
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
    prefetchAllCategoryProducts,
    getCachedProducts,
    setProductsDirect,
    switchCategory,
    
    // Product Getters
    getProductName,
    getProductBrand,
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