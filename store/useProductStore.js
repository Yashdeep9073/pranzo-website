import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useProductStore = defineStore('productStore', () => {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  // ==================== STATE ==================== 
  const state = ref({
    // Product data 
    products: [],
    filteredAndSortedProducts: [],
    allProducts: [],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 12,
      from: 0,
      to: 0
    },

    // Category data with nested structure
    categories: [],
    categoryTree: [],
    colors: [],
    sizes: [],
    brands: [],

    // Current filters for GraphQL queries
    filters: {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: 50000
    },

    isLoading: false,
    hasInitialized: false,
    isUpdatingFromURL: false,
    urlUpdateInProgress: false,
    usingFallbackData: false // New flag to track fallback usage
  })

  // ==================== FALLBACK DATA WITH CORRECT IMAGE PATHS ====================
  
  const fallbackCategories = [
    {
      id: 1,
      name: 'Electronics',
      image: '/assets/images/recommended/camera.webp',
      logo: null,
      _count: { products: 45 },
      subCategories: []
    },
    {
      id: 2,
      name: 'Fashion',
      image: '/assets/images/recommended/women_wear.png',
      logo: null,
      _count: { products: 120 },
      subCategories: []
    },
    {
      id: 3,
      name: 'Footwear',
      image: '/assets/images/recommended/highheels.png',
      logo: null,
      _count: { products: 80 },
      subCategories: []
    },
    {
      id: 4,
      name: 'Accessories',
      image: '/assets/images/recommended/women purse.webp',
      logo: null,
      _count: { products: 60 },
      subCategories: []
    },
    {
      id: 5,
      name: 'Gaming',
      image: '/assets/images/recommended/gaming remote.webp',
      logo: null,
      _count: { products: 30 },
      subCategories: []
    },
    {
      id: 6,
      name: 'Audio',
      image: '/assets/images/recommended/headphones.webp',
      logo: null,
      _count: { products: 40 },
      subCategories: []
    },
    {
      id: 7,
      name: "Men's Collection",
      image: '/assets/images/recommended/mens-collection.webp',
      logo: null,
      _count: { products: 90 },
      subCategories: []
    },
    {
      id: 8,
      name: "Women's Collection",
      image: '/assets/images/recommended/women-collection.webp',
      logo: null,
      _count: { products: 110 },
      subCategories: []
    }
  ]

  const fallbackColors = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 
    'Pink', 'Gray', 'Purple', 'Orange', 'Brown', 'Navy',
    'Maroon', 'Teal', 'Gold', 'Silver', 'Beige', 'Cream'
  ]

  const fallbackSizes = [
    { id: 1, size: 'XS' },
    { id: 2, size: 'S' },
    { id: 3, size: 'M' },
    { id: 4, size: 'L' },
    { id: 5, size: 'XL' },
    { id: 6, size: 'XXL' },
    { id: 7, size: '28' },
    { id: 8, size: '30' },
    { id: 9, size: '32' },
    { id: 10, size: '34' },
    { id: 11, size: '36' },
    { id: 12, size: '38' },
    { id: 13, size: '40' },
    { id: 14, size: '42' }
  ]

  const fallbackBrands = [
    {
      id: 1,
      name: 'Nike',
      logo: '/assets/images/brands/nike.png',
      description: 'Sports apparel and footwear',
      Seller: { name: 'Nike Inc.' }
    },
    {
      id: 2,
      name: 'Apple',
      logo: '/assets/images/brands/apple.png',
      description: 'Electronics and technology',
      Seller: { name: 'Apple Inc.' }
    },
    {
      id: 3,
      name: 'Samsung',
      logo: '/assets/images/brands/samsung.png',
      description: 'Electronics and appliances',
      Seller: { name: 'Samsung Electronics' }
    },
    {
      id: 4,
      name: 'Adidas',
      logo: '/assets/images/brands/adidas.png',
      description: 'Sports and casual wear',
      Seller: { name: 'Adidas AG' }
    },
    {
      id: 5,
      name: 'Levi\'s',
      logo: '/assets/images/brands/levis.png',
      description: 'Denim and casual wear',
      Seller: { name: 'Levi Strauss & Co.' }
    },
    {
      id: 6,
      name: 'Sony',
      logo: '/assets/images/brands/sony.png',
      description: 'Electronics and entertainment',
      Seller: { name: 'Sony Corporation' }
    },
    {
      id: 7,
      name: 'Puma',
      logo: '/assets/images/brands/puma.png',
      description: 'Sports and lifestyle',
      Seller: { name: 'Puma SE' }
    },
    {
      id: 8,
      name: 'Gucci',
      logo: '/assets/images/brands/gucci.png',
      description: 'Luxury fashion',
      Seller: { name: 'Gucci' }
    }
  ]

  // ==================== CATEGORY FUNCTIONS ====================

  const buildCategoryTree = (categories) => {
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      image: category.image,
      logo: category.logo,
      productCount: category._count?.products || 0,
      subCategories: category.subCategories?.map(subCat => ({
        id: subCat.id,
        name: subCat.name,
        image: subCat.image,
        logo: subCat.logo,
        subSubCategories: subCat.subSubCategories?.map(subSubCat => ({
          id: subSubCat.id,
          name: subSubCat.name,
          image: subSubCat.image,
          logo: subSubCat.logo,
          subSubSubCategories: subSubCat.subSubSubCategory?.map(subSubSubCat => ({
            id: subSubSubCat.id,
            name: subSubSubCat.name,
            logo: subSubSubCat.logo,
            image: subSubSubCat.image
          })) || []
        })) || []
      })) || []
    }))
  }

  const API_URL_CATEGORIES = config.public.api?.categories || null
  
  const fetchCategoriesWithNestedData = async () => {
    try {      
      // If using fallback data, return fallback categories
      if (state.value.usingFallbackData || !API_URL_CATEGORIES) {
        state.value.categories = fallbackCategories
        state.value.categoryTree = buildCategoryTree(fallbackCategories)
        return {
          categories: fallbackCategories,
          categoryTree: state.value.categoryTree,
          totalProductsCount: fallbackCategories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)
        }
      }
      
      const response = await fetch(API_URL_CATEGORIES)  
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()      
      
      if (data.data && Array.isArray(data.data)) {
        state.value.categories = data.data
        state.value.categoryTree = buildCategoryTree(data.data) 
        
        const totalProducts = data.data.reduce((sum, category) => {
          return sum + (category._count?.products || 0)
        }, 0)
        return {
          categories: data.data,
          categoryTree: state.value.categoryTree,
          totalProductsCount: totalProducts
        }
      } else {
        state.value.categories = fallbackCategories
        state.value.categoryTree = buildCategoryTree(fallbackCategories)
        return {
          categories: fallbackCategories,
          categoryTree: state.value.categoryTree,
          totalProductsCount: fallbackCategories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)
        }
      }
    } catch (error) {
      state.value.categories = fallbackCategories
      state.value.categoryTree = buildCategoryTree(fallbackCategories)
      return {
        categories: fallbackCategories,
        categoryTree: state.value.categoryTree,
        totalProductsCount: fallbackCategories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)
      }
    }
  }

  // ==================== GETTERS ====================

  const products = computed(() => state.value.filteredAndSortedProducts)
  const categories = computed(() => {
    // If using fallback or empty, return fallback
    if (state.value.usingFallbackData || state.value.categories.length === 0) {
      return fallbackCategories
    }
    return state.value.categories
  })
  const categoryTree = computed(() => state.value.categoryTree)
  const colors = computed(() => {
    // If using fallback or empty, return fallback
    if (state.value.usingFallbackData || state.value.colors.length === 0) {
      return fallbackColors
    }
    return state.value.colors
  })
  const sizes = computed(() => {
    // If using fallback or empty, return fallback
    if (state.value.usingFallbackData || state.value.sizes.length === 0) {
      return fallbackSizes
    }
    return state.value.sizes
  })
  const brands = computed(() => {
    // If using fallback or empty, return fallback
    if (state.value.usingFallbackData || state.value.brands.length === 0) {
      return fallbackBrands
    }
    return state.value.brands
  })
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)
  const isLoading = computed(() => state.value.isLoading)
  const hasInitialized = computed(() => state.value.hasInitialized)
  const usingFallbackData = computed(() => state.value.usingFallbackData)

  const availableColors = computed(() => {
    // Use computed colors getter which already handles fallback
    const colorList = colors.value
    
    return colorList.map(color => ({
      name: typeof color === 'string' ? color : color.name || color.color,
      hex: getColorHex(typeof color === 'string' ? color : color.name || color.color)
    }))
  })

  const availableSizes = computed(() => {
    // Use computed sizes getter which already handles fallback
    const sizeList = sizes.value
    
    return sizeList.map(size => {
      if (typeof size === 'object') {
        return {
          id: size.id,
          name: size.size || size.name
        }
      }
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: size
      }
    })
  })
  
  const availableBrands = computed(() => {
    // Use computed brands getter which already handles fallback
    const brandList = brands.value
    
    return brandList.map(brand => {
      if (typeof brand === 'object') {
        return {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          description: brand.description,
          seller: brand.Seller?.name || brand.seller || ''
        }
      }
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: brand,
        logo: null,
        description: '',
        seller: ''
      }
    })
  })

  const hasActiveFilters = computed(() => {
    const f = state.value.filters
    return f.category || f.color || f.size || f.brand ||
      f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value ||
      f.sortBy !== 'popularity'
  })

  const defaultMaxPrice = computed(() => {
    if (state.value.allProducts.length === 0) return 50000
    const maxPrice = Math.max(...state.value.allProducts.map(p => p.mainProduct?.price || 0), 50000)
    return Math.ceil(maxPrice / 1000) * 1000
  })

  // ==================== API ENDPOINTS ====================

  const API_ENDPOINTS = {
    categories: config.public.api?.categories || null,  
    colors: config.public.api?.colors || null,  
    sizes: config.public.api?.sizes || null, 
    brands: config.public.api?.brands || null,
    graphql: config.public.api?.graphql || null
  }

  // ==================== HELPER FUNCTIONS ====================

  const getProductColor = (product) => {
    if (product.mainProduct?.attributes?.[0]?.color) {
      return product.mainProduct.attributes[0].color
    }
    if (product.variants?.[0]?.attributes?.[0]?.color) {
      return product.variants[0].attributes[0].color
    }
    // For fallback products
    if (product.mainProduct?.attributes?.[0]?.color) {
      return product.mainProduct.attributes[0].color
    }
    return null
  }

  const getProductSize = (product) => {
    if (product.mainProduct?.attributes?.[0]?.size) {
      return product.mainProduct.attributes[0].size
    }
    if (product.variants?.[0]?.attributes?.[0]?.size) {
      return product.variants[0].attributes[0].size
    }
    // For fallback products
    if (product.mainProduct?.attributes?.[0]?.size) {
      return product.mainProduct.attributes[0].size
    }
    return null
  }

  const getDescription = (product) => {
    return product.mainProduct?.description || ''
  }
  
  const getProductBrand = (product) => {
    return product.brand?.name || product.mainProduct?.brandName || null
  }

  const getDiscountedPrice = (product) => {
    const mainProduct = product.mainProduct
    if (!mainProduct?.price) return 0

    const price = Number(mainProduct.price)
    if (mainProduct.discountValue && mainProduct.discountValue > 0) {
      return Math.round(price * (1 - mainProduct.discountValue / 100))
    }
    return price 
  }

  const getOriginalPrice = (product) => {
    return product.mainProduct?.price || 0
  }

  const getProductRating = (product) => {
    const mainProduct = product.mainProduct
    if (!mainProduct?.reviews?.length) return 3.5 // Default rating
    const total = mainProduct.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / mainProduct.reviews.length
  }

  const getReviewCount = (product) => {
    return product.mainProduct?.reviews?.length || Math.floor(Math.random() * 100) + 1
  }

  const getColorHex = (colorName) => {
    if (!colorName) return '#007bff'

    const colorMap = {
      'Red': '#dc3545',
      'Blue': '#007bff',
      'Green': '#28a745',
      'Black': '#000000',
      'White': '#ffffff',
      'Yellow': '#ffc107',
      'Pink': '#e83e8c',
      'Gray': '#6c757d',
      'Grey': '#6c757d',
      'Purple': '#6f42c1',
      'Orange': '#fd7e14',
      'Brown': '#795548',
      'Navy': '#001f3f',
      'Maroon': '#800000',
      'Teal': '#20c997',
      'Gold': '#ffd700',
      'Silver': '#c0c0c0',
      'Beige': '#f5f5dc',
      'Cream': '#fffdd0'
    }
    return colorMap[colorName] || '#007bff'
  }

  const getProductImage = (product) => {
    // Try main product images first
    const mainImages = product.mainProduct?.images || []
    if (mainImages.length > 0) {
      const primaryImage = mainImages.find(img => img.isPrimary === true)
      if (primaryImage?.imageUrl) {
        return fixImageUrl(primaryImage.imageUrl)
      }
      const firstImage = mainImages[0]?.imageUrl
      if (firstImage) {
        return fixImageUrl(firstImage)
      }
    }

    // Try variant images
    const variantImages = product.variants?.[0]?.images || []
    if (variantImages.length > 0) {
      const primaryVariantImage = variantImages.find(img => img.isPrimary === true)
      if (primaryVariantImage?.imageUrl) {
        return fixImageUrl(primaryVariantImage.imageUrl)
      } 
      const firstVariantImage = variantImages[0]?.imageUrl
      if (firstVariantImage) {
        return fixImageUrl(firstVariantImage)
      }
    }

    // For fallback products, check if image is already set
    if (product.mainProduct?.images?.[0]?.imageUrl) {
      return product.mainProduct.images[0].imageUrl
    }

    // Use fallback images based on category
    const category = getProductCategory(product)?.toLowerCase() || ''
    const fallbackImages = {
      'electronics': '/assets/images/recommended/camera.webp',
      'fashion': '/assets/images/recommended/women_wear.png',
      'footwear': '/assets/images/recommended/highheels.png',
      'accessories': '/assets/images/recommended/women purse.webp',
      'gaming': '/assets/images/recommended/gaming remote.webp',
      'audio': '/assets/images/recommended/headphones.webp',
      'men': '/assets/images/recommended/mens-collection.webp',
      'women': '/assets/images/recommended/women-collection.webp',
      'default': '/assets/images/placeholder.jpg'
    }

    for (const [key, image] of Object.entries(fallbackImages)) {
      if (category.includes(key) && key !== 'default') {
        return image
      }
    }

    return fallbackImages.default
  }

  const fixImageUrl = (url) => {
    if (!url) return '/assets/images/placeholder.jpg'
    
    if (url.startsWith('http')) {
      return url
    }
    
    if (url.startsWith('/')) {
      return `https://kartmania-api.vibrantick.org${url}`
    }
    
    return `https://kartmania-api.vibrantick.org/${url}`
  }

  const getProductStock = (product) => {
    return product.mainProduct?.stock || Math.floor(Math.random() * 100) + 1
  }

  const getProductName = (product) => {
    return product.name || product.mainProduct?.name || 'Unnamed Product'
  }

  const ProductSize = (product) => {
    if (!product?.variants) return []

    return [
      ...new Set(
        product.variants
          .map(v => v?.attributes?.[0]?.size)
          .filter(Boolean)
      )
    ]
  }

  const ProductColor = (product) => {
    if (!product?.variants) return []

    return [
      ...new Set(
        product.variants
          .map(v => v?.attributes?.[0]?.color)
          .filter(Boolean)
      )
    ]
  }

  const getProductCategory = (product) => {
    return product.category?.name || product.mainProduct?.categoryName || null
  }

  const getProductId = (product) => {
    return product.mainProduct?.id || product.groupId
  }

  // ==================== CLIENT-SIDE SORTING ====================

  const applySorting = (products, sortType) => {
    if (!products.length || !sortType || sortType === 'popularity') {
      return [...products].sort((a, b) =>
        (b.mainProduct?.popularity || 0) - (a.mainProduct?.popularity || 0)
      )
    }

    const sorted = [...products]

    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = getDiscountedPrice(a)
          const priceB = getDiscountedPrice(b)
          return priceA - priceB
        })

      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = getDiscountedPrice(a)
          const priceB = getDiscountedPrice(b)
          return priceB - priceA
        })

      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.mainProduct?.createdAt || 0)
          const dateB = new Date(b.mainProduct?.createdAt || 0)
          return dateB - dateA
        })

      case 'brand':
        return sorted.sort((a, b) => {
          const brandA = getProductBrand(a) || ''
          const brandB = getProductBrand(b) || ''
          return brandA.localeCompare(brandB)
        })

      default:
        return sorted.sort((a, b) =>
          (b.mainProduct?.popularity || 0) - (a.mainProduct?.popularity || 0)
        )
    }
  }

  // ==================== FILTER & SORT PRODUCTS ====================
  
  const filterAndSortProducts = () => {
    if (state.value.allProducts.length === 0) {
      state.value.filteredAndSortedProducts = []
      state.value.pagination = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 12,
        from: 0,
        to: 0
      }
      return
    }
  
    let filtered = [...state.value.allProducts]
    const currentFilters = state.value.filters
  
    // Apply price filter (client-side)
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < defaultMaxPrice.value) {
      filtered = filtered.filter(product => {
        const price = getDiscountedPrice(product)
        return price >= currentFilters.minPrice && price <= currentFilters.maxPrice
      })
    }

    // Apply sorting (client-side)
    filtered = applySorting(filtered, currentFilters.sortBy)

    // Update products
    state.value.products = filtered

    // Apply pagination
    const page = currentFilters.page
    const limit = currentFilters.limit
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Update filtered and sorted products
    state.value.filteredAndSortedProducts = filtered.slice(startIndex, endIndex)

    // Update pagination
    state.value.pagination = {
      currentPage: page,
      lastPage: Math.ceil(filtered.length / limit),
      total: filtered.length,
      perPage: limit,
      from: startIndex + 1,
      to: Math.min(endIndex, filtered.length)
    }
  }

  // ==================== URL SYNC FUNCTIONS ====================

  const parseFiltersFromURL = () => {
    const query = route.query

    const newFilters = {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice.value
    }

    // Parse from URL - SINGLE DECODE ONLY
    if (query.category) {
      // First, check if it's already a simple string
      if (typeof query.category === 'string' && !query.category.includes('%')) {
        newFilters.category = query.category
      } else {
        // Try to decode only once
        try {
          const decoded = decodeURIComponent(query.category)
          // Replace any double encoded spaces
          newFilters.category = decoded.replace(/%20/g, ' ').trim()
        } catch (error) {
          console.error('Error decoding category:', error)
          newFilters.category = query.category
        }
      }
    }

    if (query.color) {
      newFilters.color = query.color
    }

    if (query.size) {
      newFilters.size = query.size
    }

    if (query.brand) {
      if (typeof query.brand === 'string' && !query.brand.includes('%')) {
        newFilters.brand = query.brand
      } else {
        try {
          newFilters.brand = decodeURIComponent(query.brand)
        } catch (error) {
          newFilters.brand = query.brand
        }
      }
    }

    if (query.sort) {
      newFilters.sortBy = query.sort
    }

    if (query.page) {
      newFilters.page = parseInt(query.page) || 1
    }

    if (query.min_price) {
      newFilters.minPrice = parseInt(query.min_price) || 0
    }

    if (query.max_price) {
      newFilters.maxPrice = parseInt(query.max_price) || defaultMaxPrice.value
    }

    console.log('Parsed filters from URL:', newFilters)
    return newFilters
  }

  const updateURLFromFilters = (filters) => {
    if (state.value.urlUpdateInProgress) {
      return
    }

    const query = {}

    // Only add to URL if filter is active - SINGLE ENCODE ONLY
    if (filters.category && filters.category !== 'all') {
      // Encode only once and replace spaces with %20 (not +)
      const encodedCategory = encodeURIComponent(filters.category)
      query.category = encodedCategory
    }
    
    if (filters.color) query.color = filters.color
    if (filters.size) query.size = filters.size
    
    if (filters.brand) {
      query.brand = encodeURIComponent(filters.brand)
    }
    
    if (filters.sortBy !== 'popularity') query.sort = filters.sortBy
    if (filters.minPrice > 0) query.min_price = filters.minPrice
    if (filters.maxPrice < defaultMaxPrice.value) query.max_price = filters.maxPrice
    if (filters.page > 1) query.page = filters.page

    console.log('Updating URL with query:', query)

    // Mark that we're updating URL
    state.value.urlUpdateInProgress = true

    router.push({
      path: route.path,
      query
    }, undefined, {
      shallow: true
    }).finally(() => {
      setTimeout(() => {
        state.value.urlUpdateInProgress = false
      }, 50)
    })
  }

  // ==================== EXTERNAL LINK HANDLING ====================

  const applyFiltersFromExternalLink = async (filtersObj) => {
    try {
      state.value.isLoading = true;
      
      // Reset everything first
      state.value.allProducts = [];
      state.value.filteredAndSortedProducts = [];
      
      // Base filters
      const baseFilters = {
        category: '',
        sortBy: 'popularity',
        page: 1,
        limit: 12,
        color: '',
        size: '',
        brand: '',
        minPrice: 0,
        maxPrice: defaultMaxPrice.value
      };
      
      // Merge with provided filters
      const mergedFilters = { ...baseFilters, ...filtersObj };
      
      // Update state
      state.value.filters = mergedFilters;
      
      // Fetch products
      await fetchProductsWithFilters(mergedFilters);
      
      // Update URL
      updateURLFromFilters(mergedFilters);
      
      return true;
    } catch (error) {
      console.error('Error applying filters from external link:', error);
      throw error;
    } finally {
      state.value.isLoading = false;
    }
  };

  // ==================== FETCH FILTER OPTIONS ====================

  const fetchFilterOptions = async () => {
    try {
      // If already using fallback, use fallback data
      if (state.value.usingFallbackData) {
        state.value.categories = fallbackCategories
        state.value.categoryTree = buildCategoryTree(fallbackCategories)
        state.value.colors = fallbackColors
        state.value.sizes = fallbackSizes
        state.value.brands = fallbackBrands
        return true
      }

      // Fetch categories with nested data
      const categoriesResult = await fetchCategoriesWithNestedData()
      
      // Try to fetch colors
      if (!API_ENDPOINTS.colors) {
        state.value.colors = fallbackColors
      } else {
        try {
          const colorsData = await $fetch(API_ENDPOINTS.colors)
          console.log('Colors API Response:', colorsData)

          // Colors - Direct from API
          if (colorsData.colors && Array.isArray(colorsData.colors)) {
            state.value.colors = colorsData.colors
          } else if (colorsData.data && Array.isArray(colorsData.data)) {
            state.value.colors = colorsData.data.map(c => c.name || c.color)
          } else {
            console.warn('No colors data found in response, using fallback')
            state.value.colors = fallbackColors
          }
        } catch (error) {
          console.error('Error fetching colors:', error)
          state.value.colors = fallbackColors
        }
      }

      // Try to fetch sizes
      if (!API_ENDPOINTS.sizes) {
        state.value.sizes = fallbackSizes
      } else {
        try {
          const sizesData = await $fetch(API_ENDPOINTS.sizes)
          console.log('Sizes API Response:', sizesData)

          // Sizes - Direct from API
          if (sizesData.sizes && Array.isArray(sizesData.sizes)) {
            state.value.sizes = sizesData.sizes.map(size => ({
              id: size.id,
              size: size.size
            }))
          } else if (sizesData.data && Array.isArray(sizesData.data)) {
            state.value.sizes = sizesData.data.map(s => ({
              id: s.id,
              size: s.size || s.name
            }))
          } else {
            console.warn('No sizes data found in response, using fallback')
            state.value.sizes = fallbackSizes
          }
        } catch (error) {
          console.error('Error fetching sizes:', error)
          state.value.sizes = fallbackSizes
        }
      }
      
      // Try to fetch brands
      if (!API_ENDPOINTS.brands) {
        state.value.brands = fallbackBrands
      } else {
        try {
          const brandsData = await $fetch(API_ENDPOINTS.brands)
          
          // Brands
          if (brandsData.data?.length) {
            state.value.brands = brandsData.data.map(brand => ({
              id: brand.id,
              name: brand.name,
              logo: brand.logo,
              description: brand.description,
              seller: brand.Seller?.name || ''
            }))
          } else {
            console.warn('No brands data found in response, using fallback')
            state.value.brands = fallbackBrands
          }
        } catch (error) {
          console.error('Error fetching brands:', error)
          state.value.brands = fallbackBrands
        }
      }

      return true
    } catch (error) {
      console.error('Error fetching filter options:', error)

      // Use fallback data
      state.value.colors = fallbackColors
      state.value.sizes = fallbackSizes
      state.value.categories = fallbackCategories
      state.value.categoryTree = buildCategoryTree(fallbackCategories)
      state.value.brands = fallbackBrands

      return false
    }
  }

  // ==================== BUILD GRAPHQL QUERY WITH MULTIPLE FILTERS ====================

  const buildGraphQLQuery = (filters) => {
    // Start building filter parameters
    let filterParams = []

    // Add color filter if selected
    if (filters.color) {
      filterParams.push(`color: "${filters.color}"`)
    }

    // Add size filter if selected
    if (filters.size) {
      filterParams.push(`size: "${filters.size}"`)
    }

    // Add category filter if selected - FIXED
    if (filters.category && filters.category !== 'all') {
      // Find category in categories array to get ID
      const categoryObj = state.value.categories.find(cat => 
        cat.name === filters.category || cat.name.toLowerCase() === filters.category.toLowerCase()
      )
      
      if (categoryObj) {
        // Use category name (not ID) based on API expectation
        filterParams.push(`category: "${categoryObj.name}"`)
      } else {
        // Use the category name from filter
        filterParams.push(`category: "${filters.category}"`)
      }
    }

    // Add brand filter if selected
    if (filters.brand) {
      filterParams.push(`brand: "${filters.brand}"`)
    }

    // Build the filter string for GraphQL
    let filterString = ''
    if (filterParams.length > 0) {
      filterString = `, ${filterParams.join(', ')}`
    }

    // Build complete GraphQL query
    const query = `
      query ProductFilter {
        productFilter(page: ${filters.page}, limit: ${filters.limit}${filterString}) {
          data {
            groupId
            name
            category {
              id
              name
            }
            mainProduct {
              id
              name
              price
              discountValue
              description
              stock
              popularity
              createdAt
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

    console.log('GraphQL Query with filters:', {
      color: filters.color || 'none',
      size: filters.size || 'none',
      category: filters.category || 'none',
      brand: filters.brand || 'none',
      page: filters.page,
      limit: filters.limit
    })

    return query
  }

  // ==================== FETCH PRODUCTS WITH MULTIPLE FILTERS ====================

  const fetchProductsWithFilters = async (filtersToApply = {}) => {
    state.value.isLoading = true

    try {
      // Merge new filters with current filters
      const mergedFilters = { ...state.value.filters, ...filtersToApply }

      // Don't reset page if only changing page
      if (Object.keys(filtersToApply).length === 1 && filtersToApply.page) {
        // Keep other filters as is, just change page
        mergedFilters.page = filtersToApply.page
      } else if (Object.keys(filtersToApply).some(key => key !== 'page')) {
        // Reset to page 1 if any filter except page changes
        mergedFilters.page = 1
      }

      // Update state filters
      state.value.filters = mergedFilters

      // Check if GraphQL endpoint is available
      if (!API_ENDPOINTS.graphql) {
        console.log('GraphQL endpoint not configured, using fallback products')
        // Set fallback flag
        state.value.usingFallbackData = true
        // Use fallback products for demonstration
        await generateFallbackProducts()
        filterAndSortProducts()
        return {
          products: state.value.filteredAndSortedProducts,
          pagination: state.value.pagination,
          usingFallback: true
        }
      }

      // Build GraphQL query with all active filters
      const query = buildGraphQLQuery(mergedFilters)

      console.log('Sending GraphQL query with filters:', mergedFilters)

      let response;
      let apiFailed = false;
      
      try {
        // Use $fetch with proper configuration
        response = await $fetch(API_ENDPOINTS.graphql, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query }),
          timeout: 10000 // 10 seconds timeout
        })
      } catch (apiError) {
        console.error('GraphQL API call failed:', apiError)
        apiFailed = true
      }

      // Check if API failed or returned empty
      if (apiFailed || !response || !response.data?.productFilter?.data || 
          !Array.isArray(response.data.productFilter.data) || 
          response.data.productFilter.data.length === 0) {
        
        console.warn('GraphQL API failed or returned empty data, using fallback products')
        
        // Set fallback flag
        state.value.usingFallbackData = true
        // Use fallback products
        await generateFallbackProducts()
        filterAndSortProducts()
        
        // Still update URL to maintain filter state
        if (!state.value.isUpdatingFromURL) {
          updateURLFromFilters(mergedFilters)
        }
        
        return {
          products: state.value.filteredAndSortedProducts,
          pagination: state.value.pagination,
          usingFallback: true
        }
      }

      console.log('GraphQL response received:', response)
      
      // Reset fallback flag since API succeeded
      state.value.usingFallbackData = false

      // Process API response
      const products = response.data.productFilter.data.map(product => {
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

      // Update state with new products
      state.value.allProducts = products
      state.value.pagination = response.data.productFilter.pagination

      // Apply client-side price filtering and sorting
      filterAndSortProducts()

      // Update URL - but only if we're not syncing from URL
      if (!state.value.isUpdatingFromURL) {
        updateURLFromFilters(mergedFilters)
      }

      return {
        products: state.value.filteredAndSortedProducts,
        pagination: state.value.pagination,
        usingFallback: false
      }
    } catch (error) {
      console.error('Error in fetchProductsWithFilters:', error)
      
      // More detailed error logging
      if (error.response) {
        console.error('Response error:', error.response)
      }
      if (error.status) {
        console.error('Status code:', error.status)
      }
      
      // Set fallback flag
      state.value.usingFallbackData = true
      
      // Use fallback products on any error
      console.warn('Using fallback products due to error')
      await generateFallbackProducts()
      filterAndSortProducts()
      
      return {
        products: state.value.filteredAndSortedProducts,
        pagination: state.value.pagination,
        usingFallback: true
      }
    } finally {
      state.value.isLoading = false
    }
  }

  // ==================== GENERATE FALLBACK PRODUCTS ====================

 // ==================== GENERATE FALLBACK PRODUCTS ====================

const generateFallbackProducts = async () => {
  const fallbackProducts = []
  const productNames = [
    'Wireless Bluetooth Headphones',
    'Premium Leather Jacket',
    'Smart Watch Series 5',
    'Running Shoes',
    'Casual T-Shirt',
    'Gaming Laptop',
    'Digital Camera',
    'Handbag',
    'Sunglasses',
    'Fitness Tracker',
    'Backpack',
    'Smartphone',
    'Tablet',
    'Bluetooth Speaker',
    'Watch',
    'Sneakers',
    'Jeans',
    'Hoodie',
    'Dress',
    'Jacket'
  ]

  const categories = ['Electronics', 'Fashion', 'Footwear', 'Accessories', 'Gaming']
  const brands = ['Nike', 'Apple', 'Samsung', 'Adidas', 'Sony']

  // Fallback product images
  const productImages = [
    '/assets/images/recommended/camera.webp',
    '/assets/images/recommended/women_wear.png',
    '/assets/images/recommended/highheels.png',
    '/assets/images/recommended/women purse.webp',
    '/assets/images/recommended/gaming remote.webp',
    '/assets/images/recommended/headphones.webp',
    '/assets/images/recommended/mens-collection.webp',
    '/assets/images/recommended/women-collection.webp',
    '/assets/images/placeholder.jpg'
  ]

  for (let i = 1; i <= 50; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length)
    const brandIndex = Math.floor(Math.random() * brands.length)
    const colorIndex = Math.floor(Math.random() * fallbackColors.length)
    const sizeIndex = Math.floor(Math.random() * fallbackSizes.length)
    const imageIndex = Math.floor(Math.random() * productImages.length)
    
    const price = Math.floor(Math.random() * 50000) + 1000
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0
    const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price
    
    const category = categories[categoryIndex]
    const brand = brands[brandIndex]
    const color = fallbackColors[colorIndex]
    const size = fallbackSizes[sizeIndex].size
    const productImage = productImages[imageIndex]
    const productName = productNames[Math.floor(Math.random() * productNames.length)]

    fallbackProducts.push({
      groupId: `fallback-${i}`,
      name: productName,
      category: {
        id: categoryIndex + 1,
        name: category
      },
      brand: {
        id: brandIndex + 1,
        name: brand
      },
      mainProduct: {
        id: `main-${i}`,
        name: productName,
        price: price,
        discountValue: discount,
        description: `High-quality ${category.toLowerCase()} product from ${brand}. Perfect for everyday use with ${color} color and size ${size}.`,
        stock: Math.floor(Math.random() * 100) + 1,
        popularity: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        images: [{
          id: `img-${i}`,
          isPrimary: true,
          imageUrl: productImage
        }],
        reviews: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, idx) => ({
          id: `review-${i}-${idx}`,
          rating: Math.floor(Math.random() * 5) + 1,
          review: `Great product! ${idx + 1}`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
        })),
        attributes: [
          {
            id: `attr-${i}`,
            color: color,
            size: size
          }
        ]
      },
      variants: [
        {
          id: `variant-${i}-1`,
          name: `${productName} - ${color}`,
          price: price + (Math.random() > 0.5 ? 500 : -500),
          stock: Math.floor(Math.random() * 50) + 1,
          images: [{
            id: `variant-img-${i}`,
            isPrimary: true,
            imageUrl: productImage
          }],
          attributes: [
            {
              color: color,
              size: size
            }
          ]
        }
      ]
    })
  }

  state.value.allProducts = fallbackProducts
  state.value.pagination = {
    currentPage: state.value.filters.page,
    lastPage: Math.ceil(fallbackProducts.length / state.value.filters.limit),
    total: fallbackProducts.length,
    perPage: state.value.filters.limit,
    from: ((state.value.filters.page - 1) * state.value.filters.limit) + 1,
    to: Math.min(state.value.filters.page * state.value.filters.limit, fallbackProducts.length)
  }
  
  console.log(`Generated ${fallbackProducts.length} fallback products with images`)
}

  const getCategoryImage = (category) => {
    const imageMap = {
      'Electronics': '/assets/images/recommended/camera.webp',
      'Fashion': '/assets/images/recommended/women_wear.png',
      'Footwear': '/assets/images/recommended/highheels.png',
      'Accessories': '/assets/images/recommended/women purse.webp',
      'Gaming': '/assets/images/recommended/gaming remote.webp',
      'Audio': '/assets/images/recommended/headphones.webp',
      'Men': '/assets/images/recommended/mens-collection.webp',
      'Women': '/assets/images/recommended/women-collection.webp',
      'default': '/assets/images/placeholder.jpg'
    }
    return imageMap[category] || imageMap.default
  }

  // ==================== UPDATE FILTERS (MULTIPLE) ====================

  const updateFilters = async (newFilters) => {
    const result = await fetchProductsWithFilters(newFilters)
    return result
  } 

  // ====================TOGGLE FILTER FUNCTIONS====================

  const toggleColorFilter = async (color) => {
    const currentFilters = { ...state.value.filters }

    if (currentFilters.color === color) {
      // Remove color filter
      currentFilters.color = ''
    } else {
      // Add color filter
      currentFilters.color = color
    }

    await fetchProductsWithFilters(currentFilters)
  }

  const toggleSizeFilter = async (size) => {
    const currentFilters = { ...state.value.filters }

    if (currentFilters.size === size) {
      // Remove size filter
      currentFilters.size = ''
    } else {
      // Add size filter
      currentFilters.size = size
    }

    await fetchProductsWithFilters(currentFilters)
  }

  const toggleCategoryFilter = async (category) => {
    const currentFilters = { ...state.value.filters }

    // Check if same category (case insensitive)
    const isSameCategory = currentFilters.category.toLowerCase() === category.toLowerCase()

    if (isSameCategory) {
      // Remove category filter
      currentFilters.category = ''
    } else {
      // Add category filter - use the exact category name from store
      const categoryObj = categories.value.find(cat => 
        cat.name.toLowerCase() === category.toLowerCase()
      )
      
      if (categoryObj) {
        currentFilters.category = categoryObj.name // Use the exact name from store
      } else {
        currentFilters.category = category
      }
    }

    await fetchProductsWithFilters(currentFilters)
  }

  const toggleBrandFilter = async (brand) => {
    const currentFilters = { ...state.value.filters }

    if (currentFilters.brand === brand) {
      // Remove brand filter
      currentFilters.brand = ''
    } else {
      // Add brand filter
      currentFilters.brand = brand
    }

    await fetchProductsWithFilters(currentFilters)
  }

  // ==================== CLEAR FILTERS ====================

  const clearAllFilters = async () => {
    // Reset all filters
    const resetFilters = {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice.value
    }

    await fetchProductsWithFilters(resetFilters)
  }

  const clearFilter = async (filterName) => {
    const newFilters = { ...state.value.filters }

    if (filterName === 'category') {
      newFilters.category = ''
    } else if (filterName === 'color') {
      newFilters.color = ''
    } else if (filterName === 'size') {
      newFilters.size = ''
    } else if (filterName === 'brand') {
      newFilters.brand = ''
    } else if (filterName === 'price') {
      newFilters.minPrice = 0
      newFilters.maxPrice = defaultMaxPrice.value
    } else if (filterName === 'sort') {
      newFilters.sortBy = 'popularity'
    }

    newFilters.page = 1
    await fetchProductsWithFilters(newFilters)
  }

  // ==================== URL SYNC ====================

  const syncFiltersFromURL = async () => {
    if (state.value.isUpdatingFromURL || state.value.urlUpdateInProgress) {
      return
    }

    state.value.isUpdatingFromURL = true

    try {
      // Get filters from URL
      const urlFilters = parseFiltersFromURL()

      console.log('Syncing from URL with filters:', urlFilters)

      // Update filters in state
      state.value.filters = urlFilters

      // Fetch products with URL filters
      const result = await fetchProductsWithFilters(urlFilters)
      
      if (result.usingFallback) {
        console.log('Using fallback data while syncing from URL')
      }

    } catch (error) {
      console.error('Error syncing from URL:', error)
    } finally {
      setTimeout(() => {
        state.value.isUpdatingFromURL = false
      }, 50)
    }
  }

  // ==================== INITIALIZATION ====================
  const initialize = async () => {
    if (state.value.hasInitialized) {
      return true
    }

    try {
      state.value.isLoading = true

      // 1. Load filter options (colors, sizes, etc. from separate APIs)
      await fetchFilterOptions()

      // 2. Check if URL has filters
      const query = route.query
      const hasUrlFilters = Object.keys(query).length > 0

      if (hasUrlFilters) {
        // Use syncFiltersFromURL which handles URL parameters properly
        await syncFiltersFromURL()
      } else {
        // Load all products initially (no filters)
        const result = await fetchProductsWithFilters({})
        
        if (result.usingFallback) {
          console.log('Initialized with fallback data')
        }
      }

      state.value.hasInitialized = true
      state.value.isLoading = false

      return true

    } catch (error) {
      console.error('Failed to initialize store:', error)
      state.value.isLoading = false
      state.value.hasInitialized = true
      return false
    }
  }
  
  // ==================== WATCHERS ====================

  watch(() => route.query, (newQuery, oldQuery) => {
    // Don't sync if we're already updating
    if (state.value.isUpdatingFromURL || state.value.urlUpdateInProgress) {
      return;
    }
    
    // Check if query actually changed
    if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
      return;
    }
    
    console.log('Route query changed, syncing from URL...');
    syncFiltersFromURL();
  }, { deep: true, immediate: false });

  // ==================== EXPORTS ====================

  return {
    // New getters
    categoryTree,
    usingFallbackData,
    
    // Existing getters
    products,
    categories,
    colors,
    sizes,
    brands,
    pagination,
    filters,
    isLoading,
    hasInitialized,
    availableColors,
    availableSizes,
    availableBrands,
    hasActiveFilters,
    defaultMaxPrice,

    // New actions
    fetchCategoriesWithNestedData,
    applyFiltersFromExternalLink,
    
    // Existing actions
    fetchProducts: fetchProductsWithFilters,
    updateFilters,
    toggleColorFilter,
    toggleSizeFilter,
    toggleCategoryFilter,
    toggleBrandFilter,
    clearAllFilters,
    clearFilter,
    initialize,
    syncFiltersFromURL,

    // Helper functions
    getDescription,
    getProductColor,
    getProductSize,
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
})