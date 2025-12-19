<template>
  <header class="header-middle border-bottom border-gray-100">
    <div class="container container-lg">
      <nav class="header-inner flex-between gap-8">
        <!-- Logo Start -->
        <div class="logo">
          <NuxtLink to="/" class="link">
            <img 
              v-if="logoImage" 
              :src="logoImage" 
              alt="Logo"
              class="logo-img"
            >
            <img 
              v-else 
              src="/assets/images/logo/logo.png" 
              alt="Logo"
              class="logo-img"
            >
          </NuxtLink>
        </div>
        <!-- Logo End --> 
         
        <!-- Search Form Start -->
        <div class="flex-align flex-wrap form-location-wrapper max-w-840 w-100 position-relative">
          <div class="search-form d-flex text-heading-two text-sm w-100">
            <div class="search-form__wrapper position-relative flex-grow-1">
              <input 
                type="text"
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="showDropdown = true"
                @blur="onInputBlur"
                @keydown.enter="handleSearch"
                class="common-input border-neutral-40 py-18 ps-16 pe-76 rounded-8 placeholder-italic placeholder-text-sm"
                placeholder="Search your product..."
                autocomplete="off"
              >
              
              <!-- Loading indicator -->
              <div v-if="loading" class="position-absolute top-50 translate-middle-y inset-inline-end-44">
                <div class="spinner-border spinner-border-sm text-main-600" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <button 
                type="button" 
                @click="handleSearch"
                class="w-64 h-44 bg-main-600 hover:bg-main-800 rounded-4 flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-6"
                :disabled="loading"
              >
                <i class="ph-bold ph-magnifying-glass" style="font-size: 20px;"></i>
              </button>

              <!-- Search Results Dropdown - FIXED Z-INDEX -->
              <div v-if="showDropdown && searchResults.length > 0" 
                   class="search-dropdown position-absolute top-100 start-0 end-0 bg-white border border-gray-200 rounded-8 shadow-lg mt-4"
                   style="z-index: 99999 !important;">
                
                <!-- Results Header -->
                <div class="p-12 border-b border-gray-100">
                  <h6 class="text-sm font-semibold text-gray-700">
                    Found {{ searchResults.length }} product{{ searchResults.length !== 1 ? 's' : '' }}
                  </h6>
                </div>

                <!-- Results List -->
                <div class="max-h-400 overflow-y-auto">
                  <div v-for="product in searchResults" 
                       :key="product.id"
                       @click="selectProduct(product)"
                       @mousedown.prevent
                       class="product-result flex items-center gap-12 p-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 last:border-b-0"
                       style="cursor: pointer !important;">
                    
                    <!-- Product Image -->
                    <div class="w-60 h-60 flex-shrink-0 rounded-6 bg-gray-100 overflow-hidden">
                      <img :src="getProductImage(product)" :alt="product.name" 
                           class="w-full h-full object-cover">
                    </div>
                    
                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-8 mb-4">
                        <h6 class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</h6>
                        <span class="text-sm font-bold text-main-600 flex-shrink-0">₹{{ product.price }}</span>
                      </div>
                      
                      <!-- Product Details -->
                      <div class="flex items-center gap-8 flex-wrap">
                        <!-- Category -->
                        <div v-if="product.category?.name" class="flex items-center gap-4">
                          <i class="ph ph-tag text-gray-400 text-xs"></i>
                          <span class="text-xs text-gray-500">{{ product.category.name }}</span>
                        </div>
                        
                        <!-- Stock -->
                        <div class="flex items-center gap-4">
                          <i class="ph ph-package text-gray-400 text-xs"></i>
                          <span class="text-xs" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                            {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- Description -->
                      <div v-if="product.description" class="mt-4">
                        <span class="text-xs text-gray-400 line-clamp-2">{{ product.description }}</span>
                      </div>
                    </div>
                    
                    <!-- View Button -->
                    <div class="flex-shrink-0">
                      <div class="w-32 h-32 bg-main-600 hover:bg-main-700 rounded-4 flex-center text-white text-sm transition-colors duration-200">
                        <i class="ph ph-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results Message - FIXED Z-INDEX -->
              <div v-if="showDropdown && searchQuery && !loading && searchResults.length === 0" 
                   class="search-dropdown position-absolute top-100 start-0 end-0 bg-white border border-gray-200 rounded-8 shadow-lg mt-4"
                   style="z-index: 99999 !important;">
                <div class="text-center p-16">
                  <i class="ph ph-magnifying-glass text-gray-400 text-xl mb-8"></i>
                  <p class="text-sm text-gray-600 mb-4">No products found</p>
                  <p class="text-xs text-gray-500">Try searching by product name</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Search Form End -->

        <!-- Header Middle Right start -->
        <div class="header-right flex-align flex-shrink-0">
          <div class="flex-align gap-20">
            <!-- Mobile Search Toggle -->
            <button type="button" @click="toggleMobileSearch" class="search-icon flex-align d-lg-none d-flex gap-4 item-hover">
              <span class="text-2xl text-gray-700 d-flex position-relative item-hover__text">
                <i class="ph-bold ph-magnifying-glass" style="font-size: 20px;"></i>
              </span>
            </button>

            <NuxtLink to="/person/profile" class="flex-align gap-4 item-hover">
              <span class="text-xl text-gray-700 d-flex position-relative item-hover__text">
                <i class="ph-bold ph-user" style="font-size: 20px;"></i>
              </span>
              <span class="text-md text-heading-three item-hover__text d-none d-lg-flex">Profile</span>
            </NuxtLink>

            <NuxtLink to="/product/wishlist" class="flex-align gap-4 item-hover">
              <span class="text-xl text-gray-700 d-flex position-relative me-6 mt-6 item-hover__text">
                <i class="ph-bold ph-heart" style="font-size: 20px;"></i>
                <span class="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">{{ wishlistCount }}</span>
              </span>
              <span class="text-md text-heading-three item-hover__text d-none d-lg-flex">Wishlist</span>
            </NuxtLink>
                 
            <NuxtLink to="/product/cart" class="flex-align gap-4 item-hover">
              <span class="text-xl text-gray-700 d-flex position-relative me-6 mt-6 item-hover__text">
                <i class="ph-bold ph-shopping-cart" style="font-size: 20px;"></i>
                <span class="w-16 h-16 flex-center rounded-circle bg-main-600 text-white text-xs position-absolute top-n6 end-n4">{{ cartCount }}</span>
              </span>
              <span class="text-md text-heading-three item-hover__text d-none d-lg-flex">Cart</span>
            </NuxtLink>
          </div>
        </div>
        <!-- Header Middle Right End -->
      </nav>

      <!-- Mobile Search Overlay -->
      <div v-if="showMobileSearch" class="mobile-search-overlay">
        <!-- Overlay Background -->
        <div class="mobile-search-backdrop" @click="closeMobileSearch"></div>
        
        <!-- Mobile Search Panel -->
        <div class="mobile-search-panel">
          <!-- Search Header -->
          <div class="mobile-search-header">
            <div class="mobile-search-input-wrapper">
              <input 
                type="text"
                v-model="mobileSearchQuery"
                @input="handleMobileSearch"
                @keydown.enter="handleMobileSearchSubmit"
                ref="mobileSearchInput"
                class="mobile-search-input"
                placeholder="Search your product..."
                autocomplete="off"
                autofocus
              >
              
              <!-- Loading indicator -->
              <div v-if="loading" class="mobile-search-loading">
                <div class="spinner-border spinner-border-sm text-main-600" role="status"></div>
              </div>
              
              <!-- Close Button -->
              <button 
                type="button" 
                @click="closeMobileSearch"
                class="mobile-search-close"
              >
                <i class="ph ph-x" style="font-size: 20px;"></i>
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="mobileSearchResults.length > 0" class="mobile-search-results">
            <div class="mobile-results-header">
              <h6>Search Results ({{ mobileSearchResults.length }})</h6>
              <button @click="clearSearch" class="mobile-clear-search">
                Clear
              </button>
            </div>
            
            <div class="mobile-results-list">
              <div v-for="product in mobileSearchResults" 
                   :key="product.id"
                   @click="selectProduct(product)"
                   class="mobile-result-item">
                <div class="mobile-result-image">
                  <img :src="getProductImage(product)" :alt="product.name" />
                </div>

                <div class="mobile-result-info">
                  <h6 class="mobile-result-name">{{ product.name }}</h6>
                  <div class="mobile-result-meta">
                    <span class="mobile-result-price">₹{{ product.price }}</span>
                    <span class="mobile-result-category" v-if="product.category?.name">
                      {{ product.category.name }}
                    </span>
                  </div>
                  <div class="mobile-result-stock" :class="product.stock > 0 ? 'in-stock' : 'out-of-stock'">
                    {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                  </div>
                </div>
                
                <div class="mobile-result-action">
                  <i class="ph ph-arrow-right text-main-600"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="mobileSearchQuery && !loading" class="mobile-no-results">
            <div class="mobile-no-results-icon">
              <i class="ph ph-magnifying-glass"></i>
            </div>
            <h6>No products found</h6>
            <p>Try searching by product name</p>
          </div>
          
          <!-- Recent Searches -->
          <div v-else class="mobile-recent-searches">
            <div class="mobile-recent-header">
              <h6>Recent Searches</h6>
              <button @click="clearRecentSearches" class="mobile-clear-recent">
                Clear All
              </button>
            </div>
            <div class="mobile-recent-list">
              <div v-for="(search, index) in recentSearches" 
                   :key="index"
                   @click="setRecentSearch(search)"
                   class="mobile-recent-item">
                <i class="ph ph-clock"></i>
                <span>{{ search }}</span>
                <button @click.stop="removeRecentSearch(index)" class="mobile-remove-recent">
                  <i class="ph ph-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'
import { toKebabCase } from "../utlis/toKebabCase"

// Reactive state
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const loading = ref(false)
const showDropdown = ref(false)
const showMobileSearch = ref(false)
const searchResults = ref([])
const mobileSearchResults = ref([])
const wishlistCount = ref(2)
const cartCount = ref(2)
const logoImage = ref('')
const recentSearches = ref([])
const mobileSearchInput = ref(null)

const router = useRouter()

// Fetch logo from API (ID 13)
const fetchLogo = async () => {
  try {
    const response = await fetch('https://kartmania-api.vibrantick.org/common/media/read')
    if (response.ok) {
      const result = await response.json()
      const logoData = result.data?.find(item => item.id === 13 && item.category === 'LOGO')
      if (logoData) {
        logoImage.value = logoData.image
      }
    }
  } catch (error) {
    console.error('Error fetching logo:', error)
  }
}
/* Add to your watch in script for mobile search */
watch(showMobileSearch, (newVal) => {
  if (newVal) {
    document.body.classList.add('mobile-search-open')
  } else {
    document.body.classList.remove('mobile-search-open')
  }
})
// Fetch all products and search by name
const fetchProducts = async (query = '') => {
  if (!query.trim()) {
    searchResults.value = []
    mobileSearchResults.value = []
    return
  }

  loading.value = true
  try {
    const response = await fetch('https://kartmania-api.vibrantick.org/common/product/read')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    const allProducts = result.data || []
    
    // Filter products by name (case-insensitive)
    const filteredProducts = allProducts.filter(product => {
      const queryLower = query.toLowerCase().trim()
      
      // Search by name
      if (product.name?.toLowerCase().includes(queryLower)) {
        return true
      }
      
      // Search by description
      if (product.description?.toLowerCase().includes(queryLower)) {
        return true
      }
      
      // Search by category name
      if (product.category?.name?.toLowerCase().includes(queryLower)) {
        return true
      }
      
      return false
    })
    
    // Sort by relevance (name matches first)
    filteredProducts.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase())
      const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase())
      
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
    
    // Limit results
    searchResults.value = filteredProducts.slice(0, 10)
    mobileSearchResults.value = filteredProducts.slice(0, 8)
    
    // Save to recent searches if we have results
    if (filteredProducts.length > 0 && !recentSearches.value.includes(query)) {
      recentSearches.value.unshift(query)
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop()
      }
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    }
    
  } catch (err) {
    console.error('Error fetching products:', err)
    searchResults.value = []
    mobileSearchResults.value = []
  } finally {
    loading.value = false
  }
}

// Handle desktop search input
const handleSearchInput = () => {
  showDropdown.value = true
  const query = searchQuery.value.trim()
  
  if (window.searchDebounce) {
    clearTimeout(window.searchDebounce)
  }
  
  window.searchDebounce = setTimeout(() => {
    fetchProducts(query)
  }, 300)
}

// Handle mobile search
const handleMobileSearch = () => {
  const query = mobileSearchQuery.value.trim()
  
  if (window.mobileSearchDebounce) {
    clearTimeout(window.mobileSearchDebounce)
  }
  
  window.mobileSearchDebounce = setTimeout(() => {
    fetchProducts(query)
  }, 300)
}

// Handle desktop search submit
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    fetchProducts(query)
  }
}

// Handle mobile search submit
const handleMobileSearchSubmit = () => {
  const query = mobileSearchQuery.value.trim()
  if (query) {
    fetchProducts(query)
  }
}

// Get product image
const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary)
    return primaryImage?.imageUrl || product.images[0]?.imageUrl
  }
  return '/assets/images/thumbs/placeholder.png'
}

// Select product and navigate - FIXED FUNCTION
const selectProduct = (product) => {
  showDropdown.value = false
  showMobileSearch.value = false
  searchQuery.value = product.name
  
  // Navigate to product page
  const productSlug = toKebabCase(product.groupId)
  console.log('Navigating to product:', productSlug)
  
  // Use router to navigate
  router.push(`/product/${product.name}--${productSlug}`)
}

// Toggle mobile search
const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  if (showMobileSearch.value) {
    // Focus on mobile search input
    setTimeout(() => {
      mobileSearchInput.value?.focus()
    }, 100)
    
    // Load recent searches
    loadRecentSearches()
  } else {
    mobileSearchQuery.value = ''
    mobileSearchResults.value = []
  }
}

// Close mobile search
const closeMobileSearch = () => {
  showMobileSearch.value = false
  mobileSearchQuery.value = ''
  mobileSearchResults.value = []
}

// Clear search
const clearSearch = () => {
  mobileSearchQuery.value = ''
  mobileSearchResults.value = []
  mobileSearchInput.value?.focus()
}

// Set recent search
const setRecentSearch = (search) => {
  mobileSearchQuery.value = search
  fetchProducts(search)
}

// Clear recent searches
const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

// Remove recent search
const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Load recent searches from localStorage
const loadRecentSearches = () => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
}

// Handle input blur - FIXED FUNCTION
const onInputBlur = () => {
  // Small delay to allow click event to fire
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// Initialize
onMounted(() => {
  fetchLogo()
  
  // Add global click handler to close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    const searchWrapper = document.querySelector('.search-form__wrapper')
    const dropdown = document.querySelector('.search-dropdown')
    
    if (searchWrapper && dropdown && 
        !searchWrapper.contains(event.target) && 
        !dropdown.contains(event.target)) {
      showDropdown.value = false
    }
  })
})
</script>

<style scoped>
/* Only keep necessary custom styles for mobile search overlay */

/* Mobile Search Overlay Styles */
.mobile-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999 !important;
}

.mobile-search-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

.mobile-search-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: white;
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-search-header {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-search-input-wrapper {
  position: relative;
}

.mobile-search-input {
  width: 100%;
  padding: 14px 48px 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.mobile-search-input:focus {
  border-color: #4f46e5;
}

.mobile-search-loading {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
}

.mobile-search-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Search Results Styles */
.mobile-search-results {
  flex: 1;
  overflow-y: auto;
}

.mobile-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-results-header h6 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.mobile-clear-search {
  font-size: 12px;
  color: #4f46e5;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-results-list {
  padding: 8px;
}

.mobile-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-result-item:hover {
  background-color: #f9fafb;
}

.mobile-result-image {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
}

.mobile-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-result-info {
  flex: 1;
  min-width: 0;
}

.mobile-result-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-result-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mobile-result-price {
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
}

.mobile-result-category {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.mobile-result-stock {
  font-size: 11px;
}

.mobile-result-stock.in-stock {
  color: #059669;
}

.mobile-result-stock.out-of-stock {
  color: #dc2626;
}

.mobile-result-action {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* No Results Styles */
.mobile-no-results {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.mobile-no-results-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #9ca3af;
  font-size: 24px;
}

.mobile-no-results h6 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.mobile-no-results p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* Recent Searches Styles */
.mobile-recent-searches {
  flex: 1;
  padding: 16px;
}

.mobile-recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mobile-recent-header h6 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.mobile-clear-recent {
  font-size: 12px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-recent-item:hover {
  background-color: #f9fafb;
}

.mobile-recent-item i {
  color: #9ca3af;
  font-size: 16px;
}

.mobile-recent-item span {
  flex: 1;
  font-size: 14px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-remove-recent {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🔴 CRITICAL FIXES FOR DESKTOP DROPDOWN */
.search-dropdown {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px !important;
  animation: fadeIn 0.2s ease !important;
  z-index: 99999 !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: 0 !important;
  margin-top: 8px !important;
}

.product-result {
  transition: all 0.2s ease !important;
  cursor: pointer !important;
  position: relative !important;
  z-index: 1 !important;
}

.product-result:hover {
  background-color: rgba(249, 250, 251, 1) !important;
  transform: translateY(-1px) !important;
}

/* Fix for click events */
.product-result > * {
  pointer-events: none !important;
}

.product-result {
  pointer-events: all !important;
}

/* Ensure search wrapper has proper z-index */
.search-form__wrapper {
  position: relative !important;
  z-index: 1000 !important;
}

/* Fix for input blur issue */
.common-input {
  position: relative !important;
  z-index: 1001 !important;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Utility Classes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.logo-img {
  height: 40px;
  object-fit: contain;
}

/* Fix for hover states */
.item-hover {
  position: relative;
  z-index: 1;
}

/* Ensure header doesn't interfere */
.header-middle {
  position: relative;
  z-index: 100;
}

/* Fix for other dropdowns interference */
.form-location-wrapper {
  position: relative;
  z-index: 1000;
}

/* Prevent body scroll when mobile search is open */
body.mobile-search-open {
  overflow: hidden !important;
}


</style>