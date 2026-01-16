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
    urlUpdateInProgress: false
  })

  // ==================== NEW: CATEGORY FUNCTIONS ====================

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
const API_URL_CATEGORIES = config.public.api.categories
  const fetchCategoriesWithNestedData = async () => {
    try {
      console.log('Fetching categories with nested data...')
      
      const response = await fetch(API_URL_CATEGORIES)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Categories API Response:', data)
      
      if (data.data && Array.isArray(data.data)) {
        state.value.categories = data.data
        state.value.categoryTree = buildCategoryTree(data.data) 
        // console.log('Category tree built:', state.value.categoryTree)
        
        const totalProducts = data.data.reduce((sum, category) => {
          return sum + (category._count?.products || 0)
        }, 0)
        return {
          categories: data.data,
          categoryTree: state.value.categoryTree,
          totalProductsCount: totalProducts
        }
      } else {
        console.warn('No categories data found in response')
        return { categories: [], categoryTree: [], totalProductsCount: 0 }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { categories: [], categoryTree: [], totalProductsCount: 0 }
    }
  }

  // ==================== GETTERS ====================

  const products = computed(() => state.value.filteredAndSortedProducts)
  const categories = computed(() => state.value.categories)
  const categoryTree = computed(() => state.value.categoryTree)
  const colors = computed(() => state.value.colors)
  const sizes = computed(() => state.value.sizes)
  const brands = computed(() => state.value.brands)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)
  const isLoading = computed(() => state.value.isLoading)
  const hasInitialized = computed(() => state.value.hasInitialized)

  const availableColors = computed(() => {
    if (!state.value.colors.length) {
      return []
    }

    return state.value.colors.map(color => ({
      name: color,
      hex: getColorHex(color)
    }))
  })

  const availableSizes = computed(() => {
    if (!state.value.sizes.length) return []

    return state.value.sizes.map(size => ({
      id: size.id,
      name: size.size
    }))
  })
  
  const availableBrands = computed(() => {
    if (!state.value.brands.length) return []

    return state.value.brands.map(brand => ({
      ...brand
    }))
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
    categories: config.public.api.categories,
    colors: config.public.api.colors,
    sizes: config.public.api.sizes,
    brands: config.public.api.brands,
    graphql: config.public.api.graphql
  }

  // ==================== HELPER FUNCTIONS ====================

  const getProductColor = (product) => {
    if (product.mainProduct?.attributes?.[0]?.color) {
      return product.mainProduct.attributes[0].color
    }
    if (product.variants?.[0]?.attributes?.[0]?.color) {
      return product.variants[0].attributes[0].color
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
    return null
  }

  const getDescription = (product) => {
    return product.mainProduct.description
  }
  
  const getProductBrand = (product) => {
    return product.brand?.name || null
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
    if (!mainProduct?.reviews?.length) return 0
    const total = mainProduct.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / mainProduct.reviews.length
  }

  const getReviewCount = (product) => {
    return product.mainProduct?.reviews?.length || 0
  }

  const getColorHex = (colorName) => {
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

  const getProductImage = (product) => {
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

  const getProductStock = (product) => {
    return product.mainProduct?.stock || 0
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
    return product.category?.name || null
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
      // Fetch categories with nested data
      const categoriesResult = await fetchCategoriesWithNestedData()
      
      // Use $fetch for other APIs
      const [colorsData, sizesData, brandsData] = await Promise.all([
        $fetch(API_ENDPOINTS.colors),
        $fetch(API_ENDPOINTS.sizes),
        $fetch(API_ENDPOINTS.brands)
      ])

      console.log('Colors API Response:', colorsData)
      console.log('Sizes API Response:', sizesData)

      // Colors - Direct from API
      if (colorsData.colors && Array.isArray(colorsData.colors)) {
        state.value.colors = colorsData.colors
      } else if (colorsData.data && Array.isArray(colorsData.data)) {
        state.value.colors = colorsData.data.map(c => c.name || c.color)
      } else {
        state.value.colors = []
      }

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
        state.value.sizes = []
      }
      
      // Brands
      if (brandsData.data?.length) {
        state.value.brands = brandsData.data.map(brand => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          description: brand.description,
          seller: brand.Seller?.name || ''
        }))
      }

      return true
    } catch (error) {
      console.error('Error fetching filter options:', error)

      // Fallback data
      state.value.colors = []
      state.value.sizes = []
      state.value.categories = []
      state.value.categoryTree = []
      state.value.brands = []

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

      // Build GraphQL query with all active filters
      const query = buildGraphQLQuery(mergedFilters)

      console.log('Sending GraphQL query with filters:', mergedFilters)

      // Use $fetch with proper configuration
      const response = await $fetch(API_ENDPOINTS.graphql, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })

      console.log('GraphQL response received:', response)

      if (response.data?.productFilter?.data) {
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
          pagination: state.value.pagination
        }
      } else {
        console.error('No products data in response:', response.errors)
        state.value.allProducts = []
        filterAndSortProducts()
        throw new Error('No products found')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      
      // More detailed error logging
      if (error.response) {
        console.error('Response error:', error.response)
      }
      if (error.status) {
        console.error('Status code:', error.status)
      }
      
      state.value.allProducts = []
      filterAndSortProducts()
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  // ==================== UPDATE FILTERS (MULTIPLE) ====================

  const updateFilters = async (newFilters) => {
    await fetchProductsWithFilters(newFilters)
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
      const categoryObj = state.value.categories.find(cat => 
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
      await fetchProductsWithFilters(urlFilters)

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
      await fetchProductsWithFilters({})
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
