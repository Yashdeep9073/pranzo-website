import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // New flag to track if we're using fallback
  const usingFallbackData = ref(false)
  
  // Cache
  const productsCache = ref({})
  const categoryCache = ref(null)
  const lastFetchTime = ref({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // ==================== ENHANCED FALLBACK DATA ====================
  const FALLBACK_PRODUCTS = [
    {
      groupId: 'fallback-1',
      name: 'Wireless Headphones',
      category: { 
        name: 'Electronics', 
        id: '10',
        image: '/assets/images/recommended/headphones.webp'
      },
      mainProduct: {
        id: 'fallback-1',
        name: 'Wireless Headphones',
        price: 2499,
        discountValue: 15,
        stock: 50,
        popularity: 85,
        images: [{
          id: 'img-1',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/headphones.webp'
        }],
        reviews: [
          { rating: 4.5, review: 'Great sound quality!' },
          { rating: 5, review: 'Excellent battery life' }
        ],
        attributes: [
          { id: 'attr-1', color: 'Black', size: null }
        ],
        description: 'Noise cancelling wireless headphones with 30hr battery life.',
        createdAt: '2024-01-15T10:30:00Z'
      },
      variants: []
    },
    {
      groupId: 'fallback-2',
      name: 'Sports Sneakers',
      category: { 
        name: 'Footwear', 
        id: '7',
        image: '/assets/images/recommended/highheels.png'
      },
      mainProduct: {
        id: 'fallback-2',
        name: 'Sports Sneakers',
        price: 2999,
        discountValue: 20,
        stock: 30,
        popularity: 90,
        images: [{
          id: 'img-2',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/highheels.png'
        }],
        reviews: [
          { rating: 4, review: 'Very comfortable' },
          { rating: 5, review: 'Perfect for running' }
        ],
        attributes: [
          { id: 'attr-2', color: 'Blue', size: '42' }
        ],
        description: 'Lightweight running shoes with cushion support.',
        createdAt: '2024-02-10T14:20:00Z'
      },
      variants: []
    },
    {
      groupId: 'fallback-3',
      name: 'Casual T-Shirt',
      category: { 
        name: 'Fashion', 
        id: '1',
        image: '/assets/images/recommended/women_wear.png'
      },
      mainProduct: {
        id: 'fallback-3',
        name: 'Casual T-Shirt',
        price: 799,
        discountValue: 10,
        stock: 100,
        popularity: 75,
        images: [{
          id: 'img-3',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/women_wear.png'
        }],
        reviews: [
          { rating: 4, review: 'Good quality fabric' },
          { rating: 3.5, review: 'Nice fit' }
        ],
        attributes: [
          { id: 'attr-3', color: 'White', size: 'M' }
        ],
        description: 'Comfortable cotton t-shirt for daily wear.',
        createdAt: '2024-01-20T09:15:00Z'
      },
      variants: []
    },
    {
      groupId: 'fallback-4',
      name: 'Smart Watch',
      category: { 
        name: 'Electronics', 
        id: '10',
        image: '/assets/images/recommended/camera.webp'
      },
      mainProduct: {
        id: 'fallback-4',
        name: 'Smart Watch',
        price: 5999,
        discountValue: 25,
        stock: 20,
        popularity: 95,
        images: [{
          id: 'img-4',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/camera.webp'
        }],
        reviews: [
          { rating: 5, review: 'Best smartwatch ever!' },
          { rating: 4.5, review: 'Great features' }
        ],
        attributes: [
          { id: 'attr-4', color: 'Silver', size: null }
        ],
        description: 'Advanced smartwatch with health monitoring features.',
        createdAt: '2024-02-05T11:45:00Z'
      },
      variants: []
    },
    {
      groupId: 'fallback-5',
      name: 'Backpack',
      category: { 
        name: 'Accessories', 
        id: '5',
        image: '/assets/images/recommended/women purse.webp'
      },
      mainProduct: {
        id: 'fallback-5',
        name: 'Backpack',
        price: 1299,
        discountValue: 0,
        stock: 40,
        popularity: 65,
        images: [{
          id: 'img-5',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/women purse.webp'
        }],
        reviews: [
          { rating: 4, review: 'Durable and spacious' },
          { rating: 3.5, review: 'Good for laptop' }
        ],
        attributes: [
          { id: 'attr-5', color: 'Navy', size: null }
        ],
        description: 'Durable backpack with laptop compartment.',
        createdAt: '2024-01-25T16:30:00Z'
      },
      variants: []
    },
    {
      groupId: 'fallback-6',
      name: 'Perfume',
      category: { 
        name: 'Personal Care', 
        id: '8',
        image: '/assets/images/recommended/mens-collection.webp'
      },
      mainProduct: {
        id: 'fallback-6',
        name: 'Perfume',
        price: 1599,
        discountValue: 30,
        stock: 25,
        popularity: 80,
        images: [{
          id: 'img-6',
          isPrimary: true,
          imageUrl: '/assets/images/recommended/mens-collection.webp'
        }],
        reviews: [
          { rating: 4.5, review: 'Long lasting fragrance' },
          { rating: 4, review: 'Nice packaging' }
        ],
        attributes: [
          { id: 'attr-6', color: 'Clear', size: null }
        ],
        description: 'Premium fragrance with long lasting scent.',
        createdAt: '2024-02-12T13:20:00Z'
      },
      variants: []
    }
  ]

  const FALLBACK_CATEGORIES = [
    { 
      id: '1', 
      name: 'Fashion', 
      productCount: 16, 
      hasProducts: true,
      image: '/assets/images/recommended/women_wear.png',
      fallbackImage: '/assets/images/recommended/women_wear.png'
    },
    { 
      id: '5', 
      name: 'Accessories', 
      productCount: 11, 
      hasProducts: true,
      image: '/assets/images/recommended/women purse.webp',
      fallbackImage: '/assets/images/recommended/women purse.webp'
    },
    { 
      id: '7', 
      name: 'Footwear', 
      productCount: 9, 
      hasProducts: true,
      image: '/assets/images/recommended/highheels.png',
      fallbackImage: '/assets/images/recommended/highheels.png'
    },
    { 
      id: '10', 
      name: 'Electronics', 
      productCount: 8, 
      hasProducts: true,
      image: '/assets/images/recommended/camera.webp',
      fallbackImage: '/assets/images/recommended/camera.webp'
    },
    { 
      id: '8', 
      name: 'Personal Care', 
      productCount: 6, 
      hasProducts: true,
      image: '/assets/images/recommended/mens-collection.webp',
      fallbackImage: '/assets/images/recommended/mens-collection.webp'
    },
    { 
      id: '12', 
      name: 'Men', 
      productCount: 12, 
      hasProducts: true,
      image: '/assets/images/recommended/mens-collection.webp',
      fallbackImage: '/assets/images/recommended/mens-collection.webp'
    },
    { 
      id: '6', 
      name: 'Women', 
      productCount: 14, 
      hasProducts: true,
      image: '/assets/images/recommended/women-collection.webp',
      fallbackImage: '/assets/images/recommended/women-collection.webp'
    },
    { 
      id: '3', 
      name: 'Mobile', 
      productCount: 0, 
      hasProducts: false,
      image: '/assets/images/recommended/camera.webp',
      fallbackImage: '/assets/images/recommended/camera.webp'
    },
    { 
      id: '13', 
      name: 'Kitchen', 
      productCount: 0, 
      hasProducts: false,
      image: '/assets/images/recommended/camera.webp',
      fallbackImage: '/assets/images/recommended/camera.webp'
    },
    { 
      id: '11', 
      name: 'Skin care', 
      productCount: 0, 
      hasProducts: false,
      image: '/assets/images/recommended/women-collection.webp',
      fallbackImage: '/assets/images/recommended/women-collection.webp'
    }
  ]

  // ==================== FALLBACK IMAGES ====================
  const getFallbackImages = (index = 0) => {
    const fallbackImages = [
      '/assets/images/flashsale/camera.webp',
      '/assets/images/flashsale/earbuds.jpg',
      '/assets/images/flashsale/jean.jpg',
      '/assets/images/flashsale/jeans-and-tshirt.jpg',
      '/assets/images/flashsale/mobile.jpg',
      '/assets/images/flashsale/sandal-women.jpg',
      '/assets/images/buysection/sneaker.jpg',
      '/assets/images/buysection/women-kurti.jpg'
    ]
    return fallbackImages[index % fallbackImages.length]
  }

  const getCategoryFallbackImage = (categoryName) => {
    const categoryImages = {
      'Electronics': '/assets/images/recommended/camera.webp',
      'Mobile': '/assets/images/recommended/camera.webp',
      'Women': '/assets/images/recommended/women-collection.webp',
      'Men': '/assets/images/recommended/mens-collection.webp',
      'Footwear': '/assets/images/recommended/highheels.png',
      'Fashion': '/assets/images/recommended/women_wear.png',
      'Accessories': '/assets/images/recommended/women purse.webp',
      'Personal Care': '/assets/images/recommended/mens-collection.webp',
      'Kitchen': '/assets/images/recommended/camera.webp',
      'Skin care': '/assets/images/recommended/women-collection.webp'
    }
    return categoryImages[categoryName] || '/assets/images/recommended/camera.webp'
  }

  // Computed
  const hasProducts = computed(() => products.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  
  const getAllCategories = computed(() => {
    if (usingFallbackData.value || categories.value.length === 0) {
      return FALLBACK_CATEGORIES
    }
    return categories.value
  })
  
  const getCategoriesWithProducts = computed(() => {
    const cats = usingFallbackData.value || categories.value.length === 0 
      ? FALLBACK_CATEGORIES 
      : categories.value
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

  // Main fetch function with enhanced fallback
  const fetchProducts = async (filters = {}, forceRefresh = false) => {
    try {
      isLoading.value = true
      error.value = null

      const { page = 1, limit = 10, category = null, sortBy = 'popularity' } = filters
      const cacheKey = `products_${category || 'all'}_${sortBy}_${page}_${limit}`

      // Check if API endpoint is available
      if (!graphql) {
        //console.log('GraphQL endpoint not configured, using fallback products')
        usingFallbackData.value = true
        useFallbackProducts(category, limit)
        isLoading.value = false
        return products.value
      }

      // Check cache if not forcing refresh
      if (!forceRefresh) {
        const cached = getFromCache(cacheKey)
        if (cached) {
          //console.log(` Using cached data for: ${cacheKey}`)
          products.value = cached.products
          pagination.value = cached.pagination
          isLoading.value = false
          return cached.products
        }
      }

      //console.log(` Fetching products with filters:`, { page, limit, category, sortBy })

      let response;
      try {
        response = await fetch(graphql, {
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
          }),
          timeout: 10000 // 10 second timeout
        })
      } catch (fetchError) {
        console.error('Network error fetching products:', fetchError)
        throw new Error('Network error: Unable to fetch products')
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
        throw new Error(result.errors[0]?.message || 'GraphQL error')
      }

      // Check if we got valid data
      if (result.data?.productFilter?.data && Array.isArray(result.data.productFilter.data)) {
        const { data, pagination: paginationData } = result.data.productFilter
        
        // Check if data is empty
        if (data.length === 0) {
          console.warn('API returned empty products array, using fallback')
          usingFallbackData.value = true
          useFallbackProducts(category, limit)
        } else {
          //console.log(` Products fetched for "${category || 'all'}": ${data.length} items`)
          
          // Reset fallback flag since API succeeded
          usingFallbackData.value = false
          
          // Fix image URLs if needed
          const processedData = data.map(product => {
            // Fix image URLs
            const fixImageUrl = (url) => {
              if (url && !url.startsWith('http')) {
                if (url.startsWith('/')) {
                  return `https://kartmania-api.vibrantick.org${url}`
                } else {
                  return `https://kartmania-api.vibrantick.org/${url}`
                }
              }
              return url
            }

            // Fix main product images
            if (product.mainProduct?.images) {
              product.mainProduct.images = product.mainProduct.images.map(img => ({
                ...img,
                imageUrl: fixImageUrl(img.imageUrl)
              }))
            }

            // Fix variant images
            if (product.variants) {
              product.variants = product.variants.map(variant => ({
                ...variant,
                images: variant.images?.map(img => ({
                  ...img,
                  imageUrl: fixImageUrl(img.imageUrl)
                })) || []
              }))
            }

            return product
          })
          
          products.value = processedData
          pagination.value = paginationData
          
          // Save to cache
          saveToCache(cacheKey, processedData, paginationData)
        }
      } else {
        console.warn('No valid productFilter data in response, using fallback')
        usingFallbackData.value = true
        useFallbackProducts(category, limit)
      }

      return products.value
    } catch (err) {
      error.value = err.message
      console.error(' Error fetching products:', err)
      
      // Set fallback flag
      usingFallbackData.value = true
      
      // Use fallback products on error
      const { category = null, limit = 10 } = filters
      useFallbackProducts(category, limit)
      
      return products.value
    } finally {
      isLoading.value = false
    }
  }

  // Enhanced fallback products function
  const useFallbackProducts = (category = null, limit = 10) => {
    //console.log(' Using fallback products for category:', category)
    
    let filteredProducts = [...FALLBACK_PRODUCTS]
    
    if (category) {
      // Filter by category
      filteredProducts = FALLBACK_PRODUCTS.filter(p => 
        p.category?.name?.toLowerCase() === category.toLowerCase()
      )
      
      // If no products for category, show all
      if (filteredProducts.length === 0) {
        //console.log(`No fallback products for category "${category}", showing all`)
        filteredProducts = FALLBACK_PRODUCTS
      }
    }
    
    // Apply limit
    filteredProducts = filteredProducts.slice(0, limit)
    
    products.value = filteredProducts
    
    pagination.value = {
      currentPage: 1,
      lastPage: Math.ceil(FALLBACK_PRODUCTS.length / limit),
      total: FALLBACK_PRODUCTS.length,
      perPage: limit
    }
    
    //console.log(`Showing ${filteredProducts.length} fallback products`)
  }

  // Fetch categories with enhanced fallback
  const fetchCategories = async (forceRefresh = false) => {
    try {
      // Check if API endpoint is available
      if (!API_URL_CATEGORY) {
        //console.log('Categories API endpoint not configured, using fallback')
        usingFallbackData.value = true
        useFallbackCategories()
        return categories.value
      }

      // Check cache first
      if (!forceRefresh && categoryCache.value && isCacheValid('categories')) {
        //console.log('Using cached categories')
        categories.value = categoryCache.value
        usingFallbackData.value = false
        return categories.value
      }

      isLoading.value = true
      error.value = null

      //console.log('Fetching categories from API...', API_URL_CATEGORY)
      
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
            hasProducts: (category._count?.products || 0) > 0,
            fallbackImage: getCategoryFallbackImage(category.name)
          }))
          .filter(category => category.name && category.id)
          .sort((a, b) => b.productCount - a.productCount)

        //console.log('Processed categories:', allCategories.length)
        
        // Reset fallback flag
        usingFallbackData.value = false
        
        categories.value = allCategories
        categoryCache.value = allCategories
        lastFetchTime.value['categories'] = Date.now()
        
        //console.log(`Categories fetched: ${allCategories.length} items`)
      } else {
        console.warn('No valid categories data in response, using fallback')
        usingFallbackData.value = true
        useFallbackCategories()
      }

      return categories.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)
      
      // Set fallback flag
      usingFallbackData.value = true
      
      useFallbackCategories()
      return categories.value
    } finally {
      isLoading.value = false
    }
  }

  // Use fallback categories
  const useFallbackCategories = () => {
    //console.log(' Using fallback categories')
    categories.value = FALLBACK_CATEGORIES
    categoryCache.value = FALLBACK_CATEGORIES
    lastFetchTime.value['categories'] = Date.now()
  }

  // ==================== PRODUCT GETTERS WITH FALLBACK ====================
  const getProductName = (product) => {
    if (!product) return 'Product Name'
    
    // Check if using fallback data
    if (usingFallbackData.value) {
      return product.name || product.mainProduct?.name || 'Unnamed Product'
    }
    
    return product.name || product.mainProduct?.name || 'Unnamed Product'
  }

  const getProductImage = (product, index = 0) => {
    if (!product) return getFallbackImages(index)
    
    // If using fallback data, return fallback image
    if (usingFallbackData.value) {
      return product.mainProduct?.images?.[0]?.imageUrl || 
             getCategoryFallbackImage(product.category?.name) ||
             getFallbackImages(index)
    }

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

    // Use fallback image based on product index or category
    const categoryName = product?.category?.name || ''
    if (categoryName) {
      return getCategoryFallbackImage(categoryName)
    }
    
    // Default fallback images
    return getFallbackImages(index)
  }

  const getOriginalPrice = (product) => {
    if (!product) return 0
    
    if (usingFallbackData.value) {
      return product.mainProduct?.price || 0
    }
    
    const price = product?.mainProduct?.price || product?.price || 0
    return parseFloat(price) || 0
  }

  const getDiscountedPrice = (product) => {
    const originalPrice = getOriginalPrice(product)
    
    if (usingFallbackData.value) {
      const discountValue = product.mainProduct?.discountValue || 0
      if (discountValue > 0 && discountValue <= 100) {
        const discounted = originalPrice - (originalPrice * discountValue / 100)
        return Math.max(0, Math.round(discounted))
      }
      return originalPrice
    }
    
    const discountValue = product?.mainProduct?.discountValue || product?.discountValue || 0
    
    if (discountValue > 0 && discountValue <= 100) {
      const discounted = originalPrice - (originalPrice * discountValue / 100)
      return Math.max(0, Math.round(discounted))
    }
    return originalPrice
  }

  const getProductRating = (product) => {
    if (!product) return 4.0
    
    if (usingFallbackData.value) {
      const reviews = product.mainProduct?.reviews || []
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0)
        const average = totalRating / reviews.length
        return parseFloat(average.toFixed(1))
      }
      return 4.0 + Math.random() * 0.5
    }
    
    const reviews = product?.mainProduct?.reviews || []
    if (reviews.length === 0) return 4.0 + Math.random() * 0.5
    
    const totalRating = reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0)
    const average = totalRating / reviews.length
    return parseFloat(average.toFixed(1))
  }

  const getReviewCount = (product) => {
    if (!product) return Math.floor(Math.random() * 100) + 5
    
    if (usingFallbackData.value) {
      return product.mainProduct?.reviews?.length || Math.floor(Math.random() * 100) + 5
    }
    
    return product?.mainProduct?.reviews?.length || Math.floor(Math.random() * 100) + 5
  }

  const getProductStock = (product) => {
    if (!product) return Math.floor(Math.random() * 50) + 10
    
    if (usingFallbackData.value) {
      return product.mainProduct?.stock || Math.floor(Math.random() * 50) + 10
    }
    
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
    
    if (usingFallbackData.value) {
      const popularity = product.mainProduct?.popularity || Math.floor(Math.random() * 100)
      return popularity > 80
    }
    
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
        success: true, 
        usingFallback: usingFallbackData.value 
      }
    } catch (err) {
      console.error('Initialize failed:', err)
      return { 
        success: false, 
        error: err.message,
        usingFallback: true 
      }
    }
  }

  // New getter to check if using fallback
  const isUsingFallback = computed(() => usingFallbackData.value)

  return {
    // State
    products,
    categories,
    isLoading,
    error,
    pagination,
    usingFallbackData,
    
    // Computed
    hasProducts,
    hasCategories,
    getAllCategories,
    getCategoriesWithProducts,
    isUsingFallback,

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