export function useUrlSync(state, route, router, fetchProductsWithFilters) {
  
  // ==================== URL PARSING ====================
  const parseFiltersFromURL = () => {
    const query = route.query

    const defaultMaxPrice = () => {
      if (state.allProducts.length === 0) return 50000
      const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
      return Math.ceil(maxPrice / 1000) * 1000
    }

    const newFilters = {
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

    // Parse from URL - SINGLE DECODE ONLY
    if (query.category) {
      if (typeof query.category === 'string' && !query.category.includes('%')) {
        newFilters.category = query.category
      } else {
        try {
          const decoded = decodeURIComponent(query.category)
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
      newFilters.maxPrice = parseInt(query.max_price) || defaultMaxPrice()
    }

    //console.log('Parsed filters from URL:', newFilters)
    return newFilters
  }

  // ==================== UPDATE URL ====================
  const updateURLFromFilters = (filters) => {
    if (state.urlUpdateInProgress) {
      return
    }

    const query = {}

    // Only add to URL if filter is active - SINGLE ENCODE ONLY
    if (filters.category && filters.category !== 'all') {
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
    
    const defaultMaxPrice = () => {
      if (state.allProducts.length === 0) return 50000
      const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
      return Math.ceil(maxPrice / 1000) * 1000
    }
    
    if (filters.maxPrice < defaultMaxPrice()) query.max_price = filters.maxPrice
    if (filters.page > 1) query.page = filters.page

    //console.log('Updating URL with query:', query)

    // Mark that we're updating URL
    state.urlUpdateInProgress = true

    router.push({
      path: route.path,
      query
    }, undefined, {
      shallow: true
    }).finally(() => {
      setTimeout(() => {
        state.urlUpdateInProgress = false
      }, 50)
    })
  }

  // ==================== EXTERNAL LINK HANDLING ====================
  const applyFiltersFromExternalLink = async (filtersObj) => {
    try {
      state.isLoading = true
      
      // Reset everything first
      state.allProducts = []
      state.filteredAndSortedProducts = []
      
      // Base filters
      const defaultMaxPrice = () => {
        if (state.allProducts.length === 0) return 50000
        const maxPrice = Math.max(...state.allProducts.map(p => p.mainProduct?.price || 0), 50000)
        return Math.ceil(maxPrice / 1000) * 1000
      }
      
      const baseFilters = {
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
      
      // Merge with provided filters
      const mergedFilters = { ...baseFilters, ...filtersObj }
      
      // Update state
      state.filters = mergedFilters
      
      // Fetch products
      await fetchProductsWithFilters(mergedFilters)
      
      // Update URL
      updateURLFromFilters(mergedFilters)
      
      return true
    } catch (error) {
      console.error('Error applying filters from external link:', error)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // ==================== SYNC FROM URL ====================
  const syncFiltersFromURL = async () => {
    if (state.isUpdatingFromURL || state.urlUpdateInProgress) {
      return
    }

    state.isUpdatingFromURL = true

    try {
      // Get filters from URL
      const urlFilters = parseFiltersFromURL()

      //console.log('Syncing from URL with filters:', urlFilters)

      // Update filters in state
      state.filters = urlFilters

      // Fetch products with URL filters
      await fetchProductsWithFilters(urlFilters)

    } catch (error) {
      console.error('Error syncing from URL:', error)
    } finally {
      setTimeout(() => {
        state.isUpdatingFromURL = false
      }, 50)
    }
  }

  return {
    parseFiltersFromURL,
    updateURLFromFilters,
    syncFiltersFromURL,
    applyFiltersFromExternalLink
  }
}