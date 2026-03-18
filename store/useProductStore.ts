import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { StoreProduct, ProductSort, GraphQLFilters, GraphQLResponse } from '~/types/products'

export const useProductStore = defineStore('productStore', () => {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  // ==================== STATE ==================== 
  const state = ref({
    // Product data 
    products: [] as StoreProduct[],
    filteredAndSortedProducts: [] as StoreProduct[],
    allProducts: [] as StoreProduct[],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 24, // Reduced to show pagination
      from: 0,
      to: 0
    },

    // Category data with nested structure
    categories: [] as any[],
    categoryTree: [] as any[],
    colors: [] as (string | { name: string; color?: string; [key: string]: any })[],
    sizes: [] as (string | { id: string; size: string; name?: string; [key: string]: any })[],
    brands: [] as (string | { id: string; name: string; logo?: string; description?: string; Seller?: { name: string }; seller?: string; [key: string]: any })[],

    // Current filters for GraphQL queries
    filters: {
      search: '',
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 24, // Reduced limit to enable pagination
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000 // Increased to avoid filtering expensive products
    },

    isLoading: false,
    hasInitialized: false,
    isUpdatingFromURL: false,
    urlUpdateInProgress: false
  })


  // ==================== CATEGORY FUNCTIONS ====================

  const buildCategoryTree = (categories: any[]) => {
    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      logo: category.logo,
      productCount: category._count?.products || 0,
      subCategories: category.subCategories?.map((subCat: any) => ({
        id: subCat.id,
        name: subCat.name,
        image: subCat.image,
        logo: subCat.logo,
        subSubCategories: subCat.subSubCategories?.map((subSubCat: any) => ({
          id: subSubCat.id,
          name: subSubCat.name,
          image: subSubCat.image,
          logo: subSubCat.logo,
          subSubSubCategories: subSubCat.subSubSubCategory?.map((subSubSubCat: any) => ({
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
      // If API URL is not available, return empty data
      if (!API_URL_CATEGORIES) {
        state.value.categories = []
        state.value.categoryTree = []
        return {
          categories: [],
          categoryTree: [],
          totalProductsCount: 0
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

        const totalProducts = data.data.reduce((sum: number, category: any) => {
          return sum + (category._count?.products || 0)
        }, 0)
        return {
          categories: data.data,
          categoryTree: state.value.categoryTree,
          totalProductsCount: totalProducts
        }
      } else {
        state.value.categories = []
        state.value.categoryTree = []
        return {
          categories: [],
          categoryTree: [],
          totalProductsCount: 0
        }
      }
    } catch (error) {
      state.value.categories = []
      state.value.categoryTree = []
      return {
        categories: [],
        categoryTree: [],
        totalProductsCount: 0
      }
    }
  }

  // ==================== GETTERS ====================

  const products = computed(() => state.value.filteredAndSortedProducts)
  const categories = computed(() => {
    return state.value.categories
  })
  const categoryTree = computed(() => state.value.categoryTree)
  const colors = computed(() => {
    return state.value.colors
  })
  const sizes = computed(() => {
    return state.value.sizes
  })
  const brands = computed(() => {
    return state.value.brands
  })
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)
  const isLoading = computed(() => state.value.isLoading)
  const hasInitialized = computed(() => state.value.hasInitialized)

  const availableColors = computed(() => {
    const colorList = colors.value

    return colorList.map(color => ({
      name: typeof color === 'string' ? color : color.name || color.color,
      hex: getColorHex(typeof color === 'string' ? color : color.name || color.color || 'Unknown')
    }))
  })

  const availableSizes = computed(() => {
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
    return f.search || f.category || f.color || f.size || f.brand ||
      f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value ||
      f.sortBy !== 'popularity'
  })

  const defaultMaxPrice = computed(() => {
    if (state.value.allProducts.length === 0) return 50000
    const maxPrice = Math.max(...state.value.allProducts.map(p => p.mainProduct?.price || 0), 50000)
    return Math.ceil(maxPrice / 1000) * 1000
  })

  // ==================== MOCK DATA GENERATOR ====================

  const generateMockProducts = () => {
    const mockProducts = []
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys']
    const brands = ['TechCorp', 'FashionHub', 'HomeStyle', 'SportPro', 'BookWorld', 'ToyLand']
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Gray', 'Purple', 'Orange']
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    for (let i = 1; i <= 100; i++) {
      const price = Math.floor(Math.random() * 20000) + 500
      const discountValue = Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0

      mockProducts.push({
        groupId: `product-${i}`,
        name: `Product ${i} - ${categories[i % categories.length]}`,
        category: {
          id: `cat-${i % categories.length + 1}`,
          name: categories[i % categories.length]
        },
        mainProduct: {
          id: `main-${i}`,
          name: `Product ${i} - ${categories[i % categories.length]}`,
          price: price,
          discountValue: discountValue,
          description: `This is a great product from ${categories[i % categories.length]} category. High quality and affordable.`,
          stock: Math.floor(Math.random() * 100) + 1,
          popularity: Math.floor(Math.random() * 1000) + 1,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          images: [
            {
              isPrimary: true,
              imageUrl: `https://picsum.photos/400/300?random=${i}`
            },
            {
              isPrimary: false,
              imageUrl: `https://picsum.photos/400/300?random=${i + 100}`
            }
          ],
          reviews: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, j) => ({
            rating: Math.floor(Math.random() * 2) + 4,
            review: `Great product! Review ${j + 1}`
          })),
          attributes: [
            {
              id: `attr-${i}`,
              color: colors[i % colors.length],
              size: sizes[i % sizes.length]
            }
          ]
        },
        variants: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          id: `variant-${i}-${j}`,
          name: `Variant ${j + 1}`,
          price: price + (j * 100),
          images: [
            {
              id: `img-${i}-${j}`,
              isPrimary: j === 0,
              imageUrl: `https://picsum.photos/400/300?random=${i + j * 10}`
            }
          ],
          attributes: {
            color: colors[(i + j) % colors.length],
            size: sizes[(i + j) % sizes.length]
          }
        })),
        brand: {
          id: `brand-${i % brands.length + 1}`,
          name: brands[i % brands.length],
          logo: `https://picsum.photos/100/50?random=${i + 200}`
        }
      })
    }

    return mockProducts
  }

  const applyFiltersToProducts = (products: StoreProduct[], filters: Partial<typeof state.value.filters>) => {
    let filteredProducts = [...products]

    // Apply text search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim()
      filteredProducts = filteredProducts.filter(product => {
        const productName = getProductName(product)?.toLowerCase() || ''
        const description = getDescription(product)?.toLowerCase() || ''
        const category = getProductCategory(product)?.toLowerCase() || ''
        const brand = getProductBrand(product)?.toLowerCase() || ''

        return productName.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          brand.includes(searchTerm)
      })
    }

    // Apply color filter
    if (filters.color) {
      filteredProducts = filteredProducts.filter(product => {
        const colors = getAllAvailableColors(product)
        return colors.some(color => color.toLowerCase() === filters.color!.toLowerCase())
      })
    }

    // Apply size filter
    if (filters.size) {
      filteredProducts = filteredProducts.filter(product => {
        const sizes = getAllAvailableSizes(product)
        return sizes.some(size => size.toLowerCase() === filters.size!.toLowerCase())
      })
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const category = getProductCategory(product)
        return category && category.toLowerCase() === filters.category!.toLowerCase()
      })
    }

    // Apply brand filter
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product => {
        const brand = getProductBrand(product)
        return brand && brand.toLowerCase() === filters.brand!.toLowerCase()
      })
    }

    // Apply price filter
    if (filters.minPrice > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const price = getDiscountedPrice(product)
        return price >= filters.minPrice!
      })
    }

    if (filters.maxPrice < 1000000) {
      filteredProducts = filteredProducts.filter(product => {
        const price = getDiscountedPrice(product)
        return price <= filters.maxPrice!
      })
    }

    return filteredProducts
  }

  const paginateProducts = (products: StoreProduct[], page: number = 1, limit: number = 24) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)

    return {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        lastPage: Math.ceil(products.length / limit),
        total: products.length,
        perPage: limit,
        from: startIndex + 1,
        to: Math.min(endIndex, products.length)
      }
    }
  }

  // ==================== API ENDPOINTS ====================

  const API_ENDPOINTS = {
    categories: config.public.api?.categories || null,
    colors: config.public.api?.colors || null,
    sizes: config.public.api?.sizes || null,
    brands: config.public.api?.brands || null,
    graphql: config.public.api?.graphql
  }

  // ==================== HELPER FUNCTIONS ====================

  const getProductColor = (product: StoreProduct) => {
    // For main products, try to get color from main product attributes first
    const mainAttributes = product.mainProduct?.attributes
    if (mainAttributes && Array.isArray(mainAttributes)) {
      const colorAttr = mainAttributes.find(attr => attr && attr.color !== null && attr.color !== undefined && attr.color !== '')
      if (colorAttr?.color) return colorAttr.color
    }

    // If no color in main product, get first available color from variants
    if (product.variants && product.variants.length > 0) {
      const variantWithColor = product.variants.find(variant => 
        variant.attributes && variant.attributes.color
      )
      if (variantWithColor?.attributes?.color) {
        return variantWithColor.attributes.color
      }
    }

    return null
  }

  const getProductSize = (product: StoreProduct) => {
    // For main products, try to get size from main product attributes first
    const mainAttributes = product.mainProduct?.attributes
    if (mainAttributes && Array.isArray(mainAttributes)) {
      const sizeAttr = mainAttributes.find(attr => attr && attr.size !== null && attr.size !== undefined && attr.size !== '')
      if (sizeAttr?.size) return sizeAttr.size
    }

    // If no size in main product, get first available size from variants
    if (product.variants && product.variants.length > 0) {
      const variantWithSize = product.variants.find(variant => 
        variant.attributes && variant.attributes.size
      )
      if (variantWithSize?.attributes?.size) {
        return variantWithSize.attributes.size
      }
    }

    return null
  }

  // New functions to get all available colors and sizes for main products
  const getAllAvailableColors = (product: StoreProduct) => {
    const colors = new Set<string>()
    
    // Add color from main product if available
    const mainColor = getProductColor(product)
    if (mainColor) colors.add(mainColor)
    
    // Add colors from all variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        if (variant.attributes?.color) {
          colors.add(variant.attributes.color)
        }
      })
    }
    
    return Array.from(colors)
  }

  const getAllAvailableSizes = (product: StoreProduct) => {
    const sizes = new Set<string>()
    
    // Add size from main product if available
    const mainSize = getProductSize(product)
    if (mainSize) sizes.add(mainSize)
    
    // Add sizes from all variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        if (variant.attributes?.size) {
          sizes.add(variant.attributes.size)
        }
      })
    }
    
    return Array.from(sizes)
  }

  const getProductMaterial = (product: StoreProduct) => {
    const attributes = product.mainProduct?.attributes

    if (!attributes || !Array.isArray(attributes)) return null

    // Find first attribute with non-null material
    const materialAttr = attributes.find(attr => attr && attr.material !== null && attr.material !== undefined && attr.material !== '')
    return materialAttr?.material || null
  }

  const getDescription = (product: StoreProduct) => {
    return product.mainProduct?.description || ''
  }

  const getProductBrand = (product: StoreProduct) => {
    return product.brand?.name || product.mainProduct?.brandName || null
  }

  const getDiscountedPrice = (product: StoreProduct) => {
    const mainProduct = product.mainProduct
    if (!mainProduct?.price) return 0

    const price = Number(mainProduct.price)
    if (mainProduct.discountValue && mainProduct.discountValue > 0) {
      return Math.round(price * (1 - mainProduct.discountValue / 100))
    }
    return price
  }

  const getOriginalPrice = (product:StoreProduct) => {
    return product.mainProduct?.price || 0
  }

  const getProductRating = (product: StoreProduct) => {
    const mainProduct = product.mainProduct
    if (!mainProduct?.reviews?.length) return 3.5 // Default rating
    const total = mainProduct.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / mainProduct.reviews.length
  }

  const getReviewCount = (product: StoreProduct) => {
    return product.mainProduct?.reviews?.length || Math.floor(Math.random() * 100) + 1
  }

  const getColorHex = (colorName: string) => {
    if (!colorName) return '#007bff'

    const colorMap: { [key: string]: string } = {
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

  const getProductImage = (product: StoreProduct) => {
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

    // Check if image is already set
    if (product.mainProduct?.images?.[0]?.imageUrl) {
      return product.mainProduct.images[0].imageUrl
    }

    // Return placeholder image if no image found
    return '/assets/images/placeholder.jpg'
  }

  const fixImageUrl = (url: string) => {
    if (!url) return '/assets/images/placeholder.jpg'

    if (url.startsWith('http')) {
      return url
    }

    if (url.startsWith('/')) {
      return `https://kartmania-api.vibrantick.org${url}`
    }

    return `https://kartmania-api.vibrantick.org/${url}`
  }

  const getProductStock = (product: StoreProduct) => {
    return product.mainProduct?.stock || Math.floor(Math.random() * 100) + 1
  }

  const getProductName = (product: StoreProduct) => {
    return product.name || product.mainProduct?.name || 'Unnamed Product'
  }

  const ProductSize = (product: StoreProduct) => {
    if (!product?.variants) return []

    return [
      ...new Set(
        product.variants
          .map(v => v?.attributes?.size)
          .filter(Boolean)
      )
    ]
  }

  const ProductColor = (product: StoreProduct) => {
    if (!product?.variants) return []

    return [
      ...new Set(
        product.variants
          .map(v => v?.attributes?.color)
          .filter(Boolean)
      )
    ]
  }

  const getProductCategory = (product: StoreProduct) => {
    return product.category?.name || product.mainProduct?.categoryName || null
  }

  const getProductId = (product: StoreProduct) => {
    return product.mainProduct?.id || product.groupId
  }

  // ==================== CLIENT-SIDE SORTING ====================

  const applySorting = (products: StoreProduct[], sortType: ProductSort | string) => {
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
          return dateB.getTime() - dateA.getTime()
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
        perPage: state.value.filters.limit || 24, // Use current limit
        from: 0,
        to: 0
      }
      return
    }

    let filtered = [...state.value.allProducts]
    const currentFilters = state.value.filters

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase().trim()
      filtered = filtered.filter(product => {
        const productName = getProductName(product)?.toLowerCase() || ''
        const description = getDescription(product)?.toLowerCase() || ''
        const category = getProductCategory(product)?.toLowerCase() || ''
        const brand = getProductBrand(product)?.toLowerCase() || ''

        return productName.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          brand.includes(searchTerm)
      })
    }

    // Apply price filter (client-side) - DISABLED to show all products
    // Temporarily disabling price filtering to ensure all products are shown
    // if (currentFilters.minPrice > 0 || currentFilters.maxPrice < defaultMaxPrice.value) {
    //   filtered = filtered.filter(product => {
    //     const price = getDiscountedPrice(product)
    //     return price >= currentFilters.minPrice && price <= currentFilters.maxPrice
    //   })
    // }

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
      search: '',
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 24, // Reduced limit to enable pagination
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000 // Use high value to avoid filtering
    }

    // Parse from URL - SINGLE DECODE ONLY
    if (query.search) {
      const searchValue = Array.isArray(query.search) ? query.search[0] : query.search
      if (searchValue && typeof searchValue === 'string' && !searchValue.includes('%')) {
        newFilters.search = searchValue.trim()
      } else if (searchValue && typeof searchValue === 'string') {
        try {
          newFilters.search = decodeURIComponent(searchValue).trim()
        } catch (error) {
          newFilters.search = searchValue.trim()
        }
      }
    }

    if (query.category) {
      // Handle both string and array cases
      const categoryValue = Array.isArray(query.category) ? query.category[0] : query.category
      
      // Ensure we have a string value
      if (categoryValue) {
        // First, check if it's already a simple string
        if (typeof categoryValue === 'string' && !categoryValue.includes('%')) {
          newFilters.category = categoryValue
        } else {
          // Try to decode only once
          try {
            const decoded = decodeURIComponent(categoryValue)
            // Replace any double encoded spaces
            newFilters.category = decoded.replace(/%20/g, ' ').trim()
          } catch (error) {
            newFilters.category = categoryValue
          }
        }
      }
    }

    if (query.color) {
      const colorValue = Array.isArray(query.color) ? query.color[0] : query.color
      if (colorValue) {
        newFilters.color = colorValue
      }
    }

    if (query.size) {
      const sizeValue = Array.isArray(query.size) ? query.size[0] : query.size
      if (sizeValue) {
        newFilters.size = sizeValue
      }
    }

    if (query.brand) {
      const brandValue = Array.isArray(query.brand) ? query.brand[0] : query.brand
      if (brandValue && typeof brandValue === 'string' && !brandValue.includes('%')) {
        newFilters.brand = brandValue
      } else if (brandValue && typeof brandValue === 'string') {
        try {
          newFilters.brand = decodeURIComponent(brandValue)
        } catch (error) {
          newFilters.brand = brandValue
        }
      }
    }

    if (query.sort) {
      const sortValue = Array.isArray(query.sort) ? query.sort[0] : query.sort
      if (sortValue) {
        newFilters.sortBy = sortValue
      }
    }

    if (query.page) {
      const pageValue = Array.isArray(query.page) ? query.page[0] : query.page
      newFilters.page = parseInt(pageValue as string) || 1
    }

    if (query.min_price) {
      const minPriceValue = Array.isArray(query.min_price) ? query.min_price[0] : query.min_price
      newFilters.minPrice = parseInt(minPriceValue as string) || 0
    }

    if (query.max_price) {
      const maxPriceValue = Array.isArray(query.max_price) ? query.max_price[0] : query.max_price
      newFilters.maxPrice = parseInt(maxPriceValue as string) || defaultMaxPrice.value
    }

    return newFilters
  }

  const updateURLFromFilters = (filters: typeof state.value.filters) => {
    if (state.value.urlUpdateInProgress) {
      return
    }

    const query: Record<string, any> = {}

    // Only add to URL if filter is active - SINGLE ENCODE ONLY
    if (filters.search) {
      query.search = encodeURIComponent(filters.search)
    }

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


    // Mark that we're updating URL
    state.value.urlUpdateInProgress = true

    router.push({
      path: route.path,
      query
    }).finally(() => {
      setTimeout(() => {
        state.value.urlUpdateInProgress = false
      }, 50)
    })
  }

  // ==================== EXTERNAL LINK HANDLING ====================

  const applyFiltersFromExternalLink = async (filtersObj: Partial<typeof state.value.filters>) => {
    try {
      state.value.isLoading = true;

      // Reset everything first
      state.value.allProducts = [];
      state.value.filteredAndSortedProducts = [];

      // Base filters
      const baseFilters = {
        search: '',
        category: '',
        sortBy: 'popularity',
        page: 1,
        limit: 24, // Reduced limit to enable pagination
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
      throw error;
    } finally {
      state.value.isLoading = false;
    }
  };

  // ==================== FETCH FILTER OPTIONS ====================

  const fetchFilterOptions = async () => {
    try {
      // Fetch categories with nested data (don't let this failure break other filters)
      try {
        await fetchCategoriesWithNestedData()
      } catch (error) {
        console.warn('Failed to fetch categories, but continuing with other filters:', error)
      }

      // Use fallback colors (API disabled to prevent 500 errors)
      state.value.colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Gray', 'Purple', 'Orange']

      // Use fallback sizes (API disabled to prevent 500 errors)
      state.value.sizes = [
        { id: '1', size: 'XS' },
        { id: '2', size: 'S' },
        { id: '3', size: 'M' },
        { id: '4', size: 'L' },
        { id: '5', size: 'XL' },
        { id: '6', size: 'XXL' }
      ]

      // Use fallback brands (API disabled to prevent 500 errors)
      state.value.brands = []

      return true
    } catch (error) {
      console.error('Error in fetchFilterOptions:', error)

      // Use fallback arrays as final fallback
      state.value.colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Gray', 'Purple', 'Orange']
      state.value.sizes = [
        { id: '1', size: 'XS' },
        { id: '2', size: 'S' },
        { id: '3', size: 'M' },
        { id: '4', size: 'L' },
        { id: '5', size: 'XL' },
        { id: '6', size: 'XXL' }
      ]
      state.value.categories = []
      state.value.categoryTree = []
      state.value.brands = []

      return false
    }
  }

  // ==================== BUILD GRAPHQL QUERY WITH MULTIPLE FILTERS ====================

  const buildGraphQLQuery = (filters: GraphQLFilters) => {
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
        cat.name === filters.category! || cat.name.toLowerCase() === filters.category!.toLowerCase()
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
                material
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
                id
                color
                size
                material
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


    return query
  }

  // ==================== FETCH PRODUCTS WITH MULTIPLE FILTERS ====================

  const fetchProductsWithFilters = async (filtersToApply: Partial<typeof state.value.filters> = {}) => {
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
        // Use mock data for testing when API is not available
        const mockProducts = generateMockProducts()
        const filteredProducts = applyFiltersToProducts(mockProducts, mergedFilters)
        const paginatedProducts = paginateProducts(filteredProducts, mergedFilters.page || 1, mergedFilters.limit || 24)
        
        state.value.allProducts = mockProducts
        state.value.filteredAndSortedProducts = filteredProducts
        state.value.pagination = paginatedProducts.pagination
        
        return {
          products: paginatedProducts.products,
          pagination: paginatedProducts.pagination
        }
      }

      // Build GraphQL query with all active filters
      const query = buildGraphQLQuery(mergedFilters)


      let response: GraphQLResponse | undefined;
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
        apiFailed = true
      }

      // Check if API failed or returned empty
      if (apiFailed || !response || !response.data?.productFilter?.data ||
        !Array.isArray(response.data.productFilter.data) ||
        response.data.productFilter.data.length === 0) {


        // Set empty state - no mock data
        state.value.allProducts = []
        state.value.filteredAndSortedProducts = []
        state.value.pagination = {
          currentPage: 1,
          lastPage: 1,
          total: 0,
          perPage: 1000,
          from: 0,
          to: 0
        }

        // Still update URL to maintain filter state
        if (!state.value.isUpdatingFromURL) {
          updateURLFromFilters(mergedFilters)
        }

        return {
          products: [],
          pagination: state.value.pagination
        }
      }


      // Process API response - keep only main products
      const realProducts: StoreProduct[] = []

      response.data.productFilter.data.forEach(product => {
        // Add only the main product (not individual variants)
        const mainProductWithFixedImages = {
          ...product,
          // Fix image URLs for main product
          mainProduct: {
            ...product.mainProduct,
            images: product.mainProduct.images ? product.mainProduct.images.map(img => ({
              ...img,
              imageUrl: img.imageUrl ? (img.imageUrl.startsWith('http') ? img.imageUrl : 
                (img.imageUrl.startsWith('/') ? `https://kartmania-api.vibrantick.org${img.imageUrl}` : 
                `https://kartmania-api.vibrantick.org/${img.imageUrl}`)) : img.imageUrl
            })) : []
          }
        }
        realProducts.push(mainProductWithFixedImages)
      })


      // Update state with real products only (no mock data)
      state.value.allProducts = realProducts

      // Update pagination to reflect actual main product count
      if (response.data?.productFilter?.pagination) {
        const pagination = response.data.productFilter.pagination
        state.value.pagination = {
          currentPage: pagination.currentPage || 1,
          lastPage: pagination.lastPage || 1,
          total: realProducts.length,
          perPage: pagination.perPage || 24,
          from: pagination.from || 0,
          to: pagination.to || realProducts.length
        }
      } else {
        // Fallback pagination if API response doesn't include pagination
        state.value.pagination = {
          currentPage: mergedFilters.page || 1,
          lastPage: Math.ceil(realProducts.length / (mergedFilters.limit || 24)),
          total: realProducts.length,
          perPage: mergedFilters.limit || 24,
          from: 0,
          to: realProducts.length
        }
      }

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
    } catch (error) {

      // More detailed error logging

      // Set empty state on any error
      state.value.allProducts = []
      state.value.filteredAndSortedProducts = []
      state.value.pagination = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 24, // Reduced perPage to match limit
        from: 0,
        to: 0
      }

      return {
        products: [],
        pagination: state.value.pagination
      }
    } finally {
      state.value.isLoading = false
    }
  }



  // ==================== UPDATE FILTERS (MULTIPLE) ====================

  const updateFilters = async (newFilters: Partial<typeof state.value.filters>) => {
    const result = await fetchProductsWithFilters(newFilters)
    return result
  }

  // ====================TOGGLE FILTER FUNCTIONS====================

  const toggleColorFilter = async (color: string) => {
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

  const toggleSizeFilter = async (size: string) => {
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

  const toggleCategoryFilter = async (category: string) => {
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

  const toggleBrandFilter = async (brand: string) => {
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
      search: '',
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 24, // Reduced limit to enable pagination
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice.value
    }

    await fetchProductsWithFilters(resetFilters)
  }

  const clearFilter = async (filterName: string) => {
    const newFilters = { ...state.value.filters }

    if (filterName === 'category') {
      newFilters.category = ''
    } else if (filterName === 'search') {
      newFilters.search = ''
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


      // Update filters in state
      state.value.filters = urlFilters

      // Fetch products with URL filters
      await fetchProductsWithFilters(urlFilters)

    } catch (error) {
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
    getAllAvailableColors,
    getAllAvailableSizes,
    getProductMaterial,
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
