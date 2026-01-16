export function useProductFilters(state, fetchProductsWithFilters) {
  
  // ==================== CLIENT-SIDE SORTING ====================
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
    if (state.allProducts.length === 0) {
      state.filteredAndSortedProducts = []
      state.pagination = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 12,
        from: 0,
        to: 0
      }
      return
    }

    let filtered = [...state.allProducts]
    const currentFilters = state.filters

    // Apply price filter (client-side)
    const defaultMaxPrice = () => {
      if (state.allProducts.length === 0) return 50000
      const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
      return Math.ceil(maxPrice / 1000) * 1000
    }

    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < defaultMaxPrice()) {
      filtered = filtered.filter(product => {
        const price = getDiscountedPrice(product)
        return price >= currentFilters.minPrice && price <= currentFilters.maxPrice
      })
    }

    // Apply sorting (client-side)
    filtered = applySorting(filtered, currentFilters.sortBy)

    // Update products
    state.products = filtered

    // Apply pagination
    const page = currentFilters.page
    const limit = currentFilters.limit
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Update filtered and sorted products
    state.filteredAndSortedProducts = filtered.slice(startIndex, endIndex)

    // Update pagination
    state.pagination = {
      currentPage: page,
      lastPage: Math.ceil(filtered.length / limit),
      total: filtered.length,
      perPage: limit,
      from: startIndex + 1,
      to: Math.min(endIndex, filtered.length)
    }
  }

  // ==================== PRODUCT HELPER FUNCTIONS ====================
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

  const getProductBrand = (product) => {
    return product.brand?.name || null
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

  const getProductCategory = (product) => {
    return product.category?.name || null
  }

  const getProductId = (product) => {
    return product.mainProduct?.id || product.groupId
  }

  // ==================== FILTER FUNCTIONS ====================
  const toggleColorFilter = async (color) => {
    const currentFilters = { ...state.filters }

    if (currentFilters.color === color) {
      currentFilters.color = ''
    } else {
      currentFilters.color = color
    }

    await fetchProductsWithFilters(currentFilters)
    filterAndSortProducts()
  }

  const toggleSizeFilter = async (size) => {
    const currentFilters = { ...state.filters }

    if (currentFilters.size === size) {
      currentFilters.size = ''
    } else {
      currentFilters.size = size
    }

    await fetchProductsWithFilters(currentFilters)
    filterAndSortProducts()
  }

  const toggleCategoryFilter = async (category) => {
    const currentFilters = { ...state.filters }

    const isSameCategory = currentFilters.category.toLowerCase() === category.toLowerCase()

    if (isSameCategory) {
      currentFilters.category = ''
    } else {
      const categoryObj = state.categories.find(cat => 
        cat.name.toLowerCase() === category.toLowerCase()
      )
      currentFilters.category = categoryObj ? categoryObj.name : category
    }

    await fetchProductsWithFilters(currentFilters)
    filterAndSortProducts()
  }

  const toggleBrandFilter = async (brand) => {
    const currentFilters = { ...state.filters }

    if (currentFilters.brand === brand) {
      currentFilters.brand = ''
    } else {
      currentFilters.brand = brand
    }

    await fetchProductsWithFilters(currentFilters)
    filterAndSortProducts()
  }

  // ==================== CLEAR FILTERS ====================
  const clearFilter = async (filterName) => {
    const newFilters = { ...state.filters }

    if (filterName === 'category') {
      newFilters.category = ''
    } else if (filterName === 'color') {
      newFilters.color = ''
    } else if (filterName === 'size') {
      newFilters.size = ''
    } else if (filterName === 'brand') {
      newFilters.brand = ''
    } else if (filterName === 'price') {
      const defaultMaxPrice = () => {
        if (state.allProducts.length === 0) return 50000
        const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
        return Math.ceil(maxPrice / 1000) * 1000
      }
      newFilters.minPrice = 0
      newFilters.maxPrice = defaultMaxPrice()
    } else if (filterName === 'sort') {
      newFilters.sortBy = 'popularity'
    }

    newFilters.page = 1
    await fetchProductsWithFilters(newFilters)
    filterAndSortProducts()
  }

  const clearAllFilters = async () => {
    const defaultMaxPrice = () => {
      if (state.allProducts.length === 0) return 50000
      const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
      return Math.ceil(maxPrice / 1000) * 1000
    }

    const resetFilters = {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice()
    }

    await fetchProductsWithFilters(resetFilters)
    filterAndSortProducts()
  }

  // ==================== UPDATE FILTERS ====================
  const updateFilters = async (newFilters) => {
    await fetchProductsWithFilters(newFilters)
    filterAndSortProducts()
  }

  return {
    // Filter functions
    toggleColorFilter,
    toggleSizeFilter,
    toggleCategoryFilter,
    toggleBrandFilter,
    clearFilter,
    clearAllFilters,
    updateFilters,
    
    // Sorting
    applySorting,
    filterAndSortProducts,
    
    // Product helper functions
    getDiscountedPrice,
    getOriginalPrice,
    getProductRating,
    getReviewCount,
    getProductImage,
    getProductStock,
    getProductName,
    getProductCategory,
    getProductBrand,
    getProductColor,
    getProductSize,
    getProductId
  }
}