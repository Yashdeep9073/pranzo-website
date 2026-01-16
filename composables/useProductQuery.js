export function useProductQuery(state, config) {
  const API_ENDPOINTS = {
    categories: config.public.api.categories,
    colors: config.public.api.colors,
    sizes: config.public.api.sizes,
    brands: config.public.api.brands,
    graphql: config.public.api.graphql
  }

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

  const fetchCategoriesWithNestedData = async () => {
    try {
      console.log('Fetching categories with nested data...')
      
      const response = await fetch('https://kartmania-api.vibrantick.org/common/product-category/read')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Categories API Response:', data)
      
      if (data.data && Array.isArray(data.data)) {
        state.categories = data.data
        state.categoryTree = buildCategoryTree(data.data)
        
        const totalProducts = data.data.reduce((sum, category) => {
          return sum + (category._count?.products || 0)
        }, 0)
        
        return {
          categories: data.data,
          categoryTree: state.categoryTree,
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

  // ==================== FILTER OPTIONS ====================
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
        state.colors = colorsData.colors
      } else if (colorsData.data && Array.isArray(colorsData.data)) {
        state.colors = colorsData.data.map(c => c.name || c.color)
      } else {
        state.colors = []
      }

      // Sizes - Direct from API
      if (sizesData.sizes && Array.isArray(sizesData.sizes)) {
        state.sizes = sizesData.sizes.map(size => ({
          id: size.id,
          size: size.size
        }))
      } else if (sizesData.data && Array.isArray(sizesData.data)) {
        state.sizes = sizesData.data.map(s => ({
          id: s.id,
          size: s.size || s.name
        }))
      } else {
        state.sizes = []
      }
      
      // Brands
      if (brandsData.data?.length) {
        state.brands = brandsData.data.map(brand => ({
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
      state.colors = []
      state.sizes = []
      state.categories = []
      state.categoryTree = []
      state.brands = []
      return false
    }
  }

  // ==================== GRAPHQL QUERY ====================
  const buildGraphQLQuery = (filters) => {
    let filterParams = []

    // Add color filter if selected
    if (filters.color) {
      filterParams.push(`color: "${filters.color}"`)
    }

    // Add size filter if selected
    if (filters.size) {
      filterParams.push(`size: "${filters.size}"`)
    }

    // Add category filter if selected
    if (filters.category && filters.category !== 'all') {
      const categoryObj = state.categories.find(cat => 
        cat.name === filters.category || cat.name.toLowerCase() === filters.category.toLowerCase()
      )
      
      if (categoryObj) {
        filterParams.push(`category: "${categoryObj.name}"`)
      } else {
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

  // ==================== FETCH PRODUCTS ====================
  const fetchProductsWithFilters = async (filtersToApply = {}) => {
    state.isLoading = true

    try {
      // Merge new filters with current filters
      const mergedFilters = { ...state.filters, ...filtersToApply }

      // Don't reset page if only changing page
      if (Object.keys(filtersToApply).length === 1 && filtersToApply.page) {
        mergedFilters.page = filtersToApply.page
      } else if (Object.keys(filtersToApply).some(key => key !== 'page')) {
        mergedFilters.page = 1
      }

      // Update state filters
      state.filters = mergedFilters

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
        state.allProducts = products
        state.pagination = response.data.productFilter.pagination

        return {
          products: products,
          pagination: state.pagination
        }
      } else {
        console.error('No products data in response:', response.errors)
        state.allProducts = []
        throw new Error('No products found')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      
      if (error.response) {
        console.error('Response error:', error.response)
      }
      if (error.status) {
        console.error('Status code:', error.status)
      }
      
      state.allProducts = []
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // ==================== HELPER FUNCTIONS ====================
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

  return {
    fetchProductsWithFilters,
    fetchFilterOptions,
    fetchCategoriesWithNestedData,
    buildCategoryTree,
    getColorHex
  }
}