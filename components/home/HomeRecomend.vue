<template>
  <section class="recommended-section">
    <div class="container">
      <div class="section-heading">
        <h2>Recommended for you</h2>
        <div class="category-tabs-container">
          <!-- Left Scroll Button -->
          <button 
            v-if="showScrollButtons"
            class="scroll-btn scroll-left"
            @click="scrollTabs(-1)"
            :disabled="isAtStart"
          >
            <i class="ph ph-caret-left"></i>
          </button>
          
          <div class="category-tabs-wrapper" ref="tabsContainer">
            <div class="category-tabs">
              <!-- All Category Tab -->
              <button 
                class="tab-button"
                :class="{ active: activeTab === 'all' }"
                @click="loadProductsForCategory('all')"
                :disabled="isLoading && activeTab !== 'all'"
              >
                <span class="tab-label">All</span>
              </button>
               
              <!-- Categories from API or Fallback -->
              <button 
                v-for="(category, index) in allCategories"
                :key="category.id"
                class="tab-button"
                :class="{ 
                  active: activeTab === category.id,
                  'no-products': category.productCount === 0,
                  'fallback-category': isFallbackData
                }"
                @click="loadProductsForCategory(category.id)"
                :disabled="(isLoading && activeTab !== category.id) || category.productCount === 0"
                :title="category.productCount === 0 ? 'No products available' : `${category.productCount} products`"
              >
                <span class="tab-label">
                  {{ category.name }}
                  <!-- <span v-if="isFallbackData" class="fallback-badge">DEMO</span> -->
                </span>  
              </button>
            </div>
          </div>
          
          <!-- Right Scroll Button -->
          <button 
            v-if="showScrollButtons"
            class="scroll-btn scroll-right"
            @click="scrollTabs(1)"
            :disabled="isAtEnd"
          >
            <i class="ph ph-caret-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
      
      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <div      
          v-for="(product, index) in filteredProducts"
          :key="product.groupId || `product-${index}`"
          class="product-card"
          :class="{ 'fallback-product': isFallbackProduct(product) }"
         > 
          <!-- Product Badges -->
          <div class="product-badges">
            <span v-if="hasDiscount(product)" class="badge sale">SALE</span>
            <!-- <span v-if="isBestSeller(product)" class="badge best">BEST</span> -->
            <!-- <span v-if="getProductStock(product) === 0" class="badge out-of-stock">OUT</span> -->
            <!-- <span v-if="isFallbackProduct(product)" class="badge fallback">DEMO</span> -->
          </div> 
          
          <!-- Wishlist Button -->
          <button 
            class="wishlist-btn"
            @click="addToWishlist(product)"
            :disabled="isLoading || isFallbackProduct(product)"
            :title="isFallbackProduct(product) ? 'Demo mode' : isInWishlist(product) ? 'Remove from wishlist' : 'Add to wishlist'"
            :class="{ 
              'in-wishlist': isInWishlist(product),
              'fallback-disabled': isFallbackProduct(product)
            }"
          >
            <i :class="['ph', isInWishlist(product) ? 'ph-heart-fill' : 'ph-heart']"></i>
          </button>
          
          <!-- Product Image -->
          <div class="product-image-wrapper" :class="{ 'out-of-stock': getProductStock(product) === 0 }">
            <img 
              :src="getProductImage(product, index)"
              :alt="getProductName(product)"
              class="product-image"
              @error="handleImageError($event, index)"
              loading="lazy"
            />
          </div>
          
          <!-- Product Content -->
          <NuxtLink
            :to="getProductLink(product)"
            class="text-decoration-none text-reset d-block"
          >
            <div class="product-content">
              
              <!-- Product Title -->
              <h3 class="product-title">
                {{ getProductName(product) }}
              </h3>
              
              <!-- Rating -->
              <div class="rating-section">
                <div class="stars">
                  <span v-for="star in 5" :key="star">
                    <i 
                      :class="[
                        'ph',
                        star <= Math.round(getProductRating(product))
                          ? 'ph-star-fill text-yellow-400'
                          : 'ph-star text-gray-300'
                      ]"
                    ></i>
                  </span>
                </div>
                <span class="rating-value">
                  {{ getProductRating(product).toFixed(1) }}
                </span>
                <span class="review-count">
                  ({{ getReviewCount(product) }})
                </span>
              </div>
              
              <!-- Price -->
              <div class="price-section">
                <div class="price-wrapper">
                  <span class="current-price">
                    ₹{{ Math.floor(getDiscountedPrice(product)) }}
                  </span>
                  <span v-if="hasDiscount(product)" class="original-price">
                     ₹{{ Math.floor(getOriginalPrice(product)) }}
                  </span>
                </div>
                <span v-if="hasDiscount(product)" class="discount-percentage">
                  {{ getDiscountPercentage(product) }}% off
                </span>
              </div>
              
              <!-- Stock Status -->
              <div class="stock-status">
                <span v-if="getProductStock(product) > 10" class="in-stock">
                  In stock
                </span>
                <span v-else-if="getProductStock(product) > 0" class="low-stock">
                  Only {{ getProductStock(product) }} left
                </span>
                <span v-else class="out-of-stock">
                  Out of stock
                </span>
              </div>

            </div>
          </NuxtLink>

        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="ph ph-package text-5xl text-gray-400"></i>
        </div> 
        <h3>No products found</h3>
        <p v-if="activeTab !== 'all'">
          No products available in {{ getActiveCategoryName() }} category yet.
        </p>
        <p v-else>
          Try selecting a different category or check back later.
        </p>
        <button @click="useDemoProducts" class="demo-btn" v-if="errorMessage">
          Try Demo Products
        </button>
      </div>
      
      <!-- View More Button -->
      <div v-if="filteredProducts.length > 0 && pagination.total > pagination.perPage" class="view-more-container">
        <button @click="viewMoreProducts" class="view-more-btn" :disabled="isLoading">
          <i class="ph ph-arrow-down mr-2"></i>
          View More Products
        </button>
      </div>
      
      <!-- Demo Mode Indicator -->
      <!-- <div v-if="isFallbackData && filteredProducts.length > 0" class="demo-notice">
        <i class="ph ph-info"></i>
        <span>Showing demo products. API connection will be restored automatically.</span>
      </div> -->
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRecommendStore } from '../../store/useRecommendStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import { useToast } from "vue-toastification"

const toast = useToast()
const recommendStore = useRecommendStore()
const wishlistStore = useWishlistStore()

// State
const activeTab = ref('all')
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const productsPerPage = 10
const isFallbackData = ref(false)

// Tab scrolling
const tabsContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const showScrollButtons = ref(false)

// Computed
const allCategories = computed(() => {
  return recommendStore.categories || []
})

const filteredProducts = computed(() => recommendStore.products || [])

const pagination = computed(() => recommendStore.pagination || { total: 0, perPage: productsPerPage })

// Check if product is fallback
const isFallbackProduct = (product) => {
  return product?.groupId?.includes('fallback') || product?.groupId?.includes('demo')
}

// Handle image error with fallback
const handleImageError = (event, index) => {
  console.log('Image failed to load, using fallback:', event.target.src)
  
  // Use different fallback based on index
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
  
  const fallbackIndex = index % fallbackImages.length
  event.target.src = fallbackImages[fallbackIndex]
  event.target.onerror = null // Prevent infinite loop
}

// Get product link
const getProductLink = (product) => {
  if (isFallbackProduct(product)) {
    return '/shop/shop-all/--1'
  }
  return `/shop/shop-all/${getProductName(product)}--${product.groupId}`
}

// Initialize
onMounted(async () => {
  console.log('Component mounted - Loading initial data')
  
  isLoading.value = true
  
  try {
    // Load categories first
    await recommendStore.fetchCategories()
    
    // Check if using fallback categories
    if (allCategories.value.some(cat => cat.id.includes('fallback') || cat.name === 'DEMO')) {
      isFallbackData.value = true
    }
    
    // Load "All" products
    activeTab.value = 'all'
    await recommendStore.fetchProducts({
      page: 1,
      limit: productsPerPage,
      category: null, 
      sortBy: 'popularity'
    })
    
    // Check if using fallback products
    if (filteredProducts.value.some(p => isFallbackProduct(p))) {
      isFallbackData.value = true
    }
    
    // Check if we need scroll buttons
    nextTick(() => {
      checkScrollButtons()
    })
    
  } catch (error) {
    console.error('Initialization error:', error)
    errorMessage.value = 'Failed to load data. Please try again.'
    isFallbackData.value = true
  } finally {
    isLoading.value = false
  }
})

// Check scroll buttons visibility
const checkScrollButtons = () => {
  if (!tabsContainer.value) return
  
  const container = tabsContainer.value
  const tabs = container.querySelector('.category-tabs')
  
  if (tabs && container) {
    const isOverflowing = tabs.scrollWidth > container.offsetWidth
    showScrollButtons.value = isOverflowing
    
    if (isOverflowing) {
      updateScrollState()
    }
  }
}

// Update scroll state
const updateScrollState = () => {
  if (!tabsContainer.value) return
  
  const container = tabsContainer.value
  isAtStart.value = container.scrollLeft <= 10
  isAtEnd.value = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10
}

// Scroll tabs
const scrollTabs = (direction) => {
  if (!tabsContainer.value) return
  
  const scrollAmount = 200 // pixels to scroll
  const container = tabsContainer.value
  
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  })
  
  // Update state after scroll
  setTimeout(updateScrollState, 300)
}

// Handle scroll events
const handleScroll = () => {
  updateScrollState()
}

// Load products for category
const loadProductsForCategory = async (categoryId) => {
  if (activeTab.value === categoryId || isLoading.value) return
  
  activeTab.value = categoryId
  currentPage.value = 1
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const categoryName = categoryId === 'all' ? null : getCategoryName(categoryId)
    
    await recommendStore.fetchProducts({
      page: 1,
      limit: productsPerPage,
      category: categoryName,
      sortBy: 'popularity'
    })
    
  } catch (error) {
    console.error('Error loading products:', error)
    errorMessage.value = 'Failed to load products. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Use demo products manually
const useDemoProducts = async () => {
  isLoading.value = true
  isFallbackData.value = true
  
  // Force use fallback data
  recommendStore.categories = [
    { id: 'all', name: 'All', productCount: 6, hasProducts: true },
    { id: '10', name: 'Electronics', productCount: 2, hasProducts: true },
    { id: '7', name: 'Footwear', productCount: 1, hasProducts: true },
    { id: '1', name: 'Fashion', productCount: 1, hasProducts: true },
    { id: '5', name: 'Accessories', productCount: 1, hasProducts: true },
    { id: '8', name: 'Personal Care', productCount: 1, hasProducts: true },
    { id: '9', name: 'Home & Kitchen', productCount: 1, hasProducts: true },
    { id: '11', name: 'Sports & Fitness', productCount: 1, hasProducts: true },
    { id: '12', name: 'Books', productCount: 1, hasProducts: true },
    { id: '13', name: 'Toys & Games', productCount: 1, hasProducts: true },
    { id: '14', name: 'Beauty', productCount: 1, hasProducts: true },
    { id: '15', name: 'Automotive', productCount: 1, hasProducts: true }
  ]
  
  // Use fallback products
  recommendStore.products = [
    {
      groupId: 'demo-1',
      name: 'Wireless Headphones',
      mainProduct: {
        id: 'demo-1',
        name: 'Wireless Headphones',
        price: 2499,
        discountValue: 15,
        stock: 50,
        popularity: 85
      },
      category: { name: 'Electronics', id: '10' }
    },
    {
      groupId: 'demo-2',
      name: 'Sports Sneakers',
      mainProduct: {
        id: 'demo-2',
        name: 'Sports Sneakers',
        price: 2999,
        discountValue: 20,
        stock: 30,
        popularity: 90
      },
      category: { name: 'Footwear', id: '7' }
    },
    {
      groupId: 'demo-3',
      name: 'Casual T-Shirt',
      mainProduct: {
        id: 'demo-3',
        name: 'Casual T-Shirt',
        price: 799,
        discountValue: 10,
        stock: 100,
        popularity: 75
      },
      category: { name: 'Fashion', id: '1' }
    },
    {
      groupId: 'demo-4',
      name: 'Smart Watch',
      mainProduct: {
        id: 'demo-4',
        name: 'Smart Watch',
        price: 5999,
        discountValue: 25,
        stock: 20,
        popularity: 95
      },
      category: { name: 'Electronics', id: '10' }
    },
    {
      groupId: 'demo-5',
      name: 'Backpack',
      mainProduct: {
        id: 'demo-5',
        name: 'Backpack',
        price: 1299,
        discountValue: 0,
        stock: 40,
        popularity: 65
      },
      category: { name: 'Accessories', id: '5' }
    },
    {
      groupId: 'demo-6',
      name: 'Perfume',
      mainProduct: {
        id: 'demo-6',
        name: 'Perfume',
        price: 1599,
        discountValue: 30,
        stock: 25,
        popularity: 80
      },
      category: { name: 'Personal Care', id: '8' }
    },
    {
      groupId: 'demo-7',
      name: 'Bluetooth Speaker',
      mainProduct: {
        id: 'demo-7',
        name: 'Bluetooth Speaker',
        price: 1999,
        discountValue: 20,
        stock: 35,
        popularity: 85
      },
      category: { name: 'Electronics', id: '10' }
    },
    {
      groupId: 'demo-8',
      name: 'Running Shoes',
      mainProduct: {
        id: 'demo-8',
        name: 'Running Shoes',
        price: 3499,
        discountValue: 15,
        stock: 25,
        popularity: 88
      },
      category: { name: 'Footwear', id: '7' }
    },
    {
      groupId: 'demo-9',
      name: 'Sunglasses',
      mainProduct: {
        id: 'demo-9',
        name: 'Sunglasses',
        price: 1299,
        discountValue: 30,
        stock: 60,
        popularity: 70
      },
      category: { name: 'Accessories', id: '5' }
    },
    {
      groupId: 'demo-10',
      name: 'Yoga Mat',
      mainProduct: {
        id: 'demo-10',
        name: 'Yoga Mat',
        price: 899,
        discountValue: 10,
        stock: 45,
        popularity: 75
      },
      category: { name: 'Sports & Fitness', id: '11' }
    }
  ]
  
  recommendStore.pagination = {
    currentPage: 1,
    lastPage: 1,
    total: 10,
    perPage: 10
  }
  
  isLoading.value = false
  
  // Check scroll buttons after adding more categories
  nextTick(() => {
    checkScrollButtons()
  })
  
  toast.info('Showing demo products', {
    position: 'top-center',
    timeout: 2000
  })
}

// Helper functions
const getCategoryName = (categoryId) => {
  if (categoryId === 'all') return null
  const category = allCategories.value.find(cat => cat.id === categoryId)
  return category?.name || null
}

const getActiveCategoryName = () => {
  if (activeTab.value === 'all') return 'All'
  const category = allCategories.value.find(cat => cat.id === activeTab.value)
  return category?.name || 'Selected'
}

// View more products
const viewMoreProducts = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  currentPage.value += 1
  
  try {
    const categoryName = activeTab.value === 'all' ? null : getCategoryName(activeTab.value)
    
    await recommendStore.fetchProducts({
      page: currentPage.value,
      limit: productsPerPage,
      category: categoryName,
      sortBy: 'popularity'
    })
    
  } catch (error) {
    console.error('Error loading more products:', error)
    currentPage.value -= 1
  } finally {
    isLoading.value = false
  }
}

// Product actions
const addToWishlist = (product) => {
  if (isFallbackProduct(product)) {
    toast.info('This is a demo product. Add real products when API is connected.', {
      position: 'top-center',
      timeout: 2000
    })
    return
  }
  
  try {
    const wasInWishlist = wishlistStore?.hasProduct?.(product)
    wishlistStore?.toggleItem?.(product)

    toast.success(
      wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      {
        position: "top-center",
        timeout: 1500,
        hideProgressBar: true
      }
    )
  } catch (error) {
    console.error("Error toggling wishlist:", error)
    toast.error("Error updating wishlist")
  }
}

const isInWishlist = (product) => {
  try {
    return wishlistStore?.hasProduct?.(product) || false
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return false
  }
}

// Product getters from store
const getProductName = (product) => recommendStore.getProductName(product)
const getProductImage = (product, index) => recommendStore.getProductImage(product, index)
const getOriginalPrice = (product) => recommendStore.getOriginalPrice(product).toFixed(2)
const getDiscountedPrice = (product) => recommendStore.getDiscountedPrice(product).toFixed(2)
const getProductRating = (product) => recommendStore.getProductRating(product)
const getProductStock = (product) => recommendStore.getProductStock(product)
const getReviewCount = (product) => recommendStore.getReviewCount?.(product) || 0
const hasDiscount = (product) => recommendStore.hasDiscount(product)
const getDiscountPercentage = (product) => recommendStore.getDiscountPercentage(product)
const isBestSeller = (product) => recommendStore.isBestSeller(product)

// Add resize listener
onMounted(() => {
  window.addEventListener('resize', checkScrollButtons)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollButtons)
})
</script>

<style scoped>
/* Previous CSS remains the same, add these new styles */

/* Fallback badge */
.fallback-badge {
  background: #f59e0b;
  color: white;
  font-size: 0.6rem;
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 4px;
  vertical-align: top;
}

.fallback-category {
  opacity: 0.9;
}

.fallback-category.active {
  background: #f59e0b;
}

.fallback-product {
  border: 1px dashed #f59e0b;
}

.badge.fallback {
  background: #f59e0b;
}

.wishlist-btn.fallback-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wishlist-btn.fallback-disabled:hover {
  background: white;
  border-color: #e5e7eb;
}

/* Demo notice */
.demo-notice {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9a3412;
  font-size: 0.9rem;
}

.demo-notice i {
  font-size: 1.1rem;
}

/* Demo button in empty state */
.demo-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 12px;
}

.demo-btn:hover {
  background: #d97706;
}

/* Stock status */
.stock-status {
  margin-top: 6px;
  font-size: 0.75rem;
}

.stock-status .in-stock {
  color: #059669;
}

.stock-status .low-stock {
  color: #d97706;
}

.stock-status .out-of-stock {
  color: #dc2626;
}

.review-count {
  font-size: 0.8rem;
  color: #6b7280;
  margin-left: 4px;
}

/* ==================== ENHANCED TABS SCROLLING ==================== */
.category-tabs-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  position: relative;
}

.category-tabs-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-width: 0;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 8px 4px 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  white-space: nowrap;
  min-width: max-content;
  transition: transform 0.3s ease;
}

.category-tabs::-webkit-scrollbar {
  display: none;
  height: 0;
  width: 0;
}

/* Scroll buttons */
.scroll-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
  font-size: 1rem;
  padding: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.scroll-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #1b6db5;
  color: #1b6db5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #f9fafb;
}

.scroll-left {
  order: -1;
}

.scroll-right {
  order: 1;
}

/* Tab buttons always visible */
.tab-button {
  padding: 6px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-height: 32px;
  position: relative;
  overflow: visible;
}

.tab-button:hover:not(:disabled) {
  color: #1b6db5;
  border-color: #1b6db5;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(27, 109, 181, 0.15);
}

.tab-button.active {
  background: linear-gradient(135deg, #1b6db5 0%, #2a8ce6 100%);
  color: white;
  border-color: #1b6db5;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(27, 109, 181, 0.25);
}

.tab-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f9fafb;
}

.tab-button.no-products:not(.active) {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #9ca3af;
  border-color: #e5e7eb;
}

.tab-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tab-count {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: 2px;
}

/* Touch device optimizations */
@media (hover: none) {
  .category-tabs {
    -webkit-overflow-scrolling: touch;
    padding-bottom: 16px; /* Extra space for scroll indicator */
  }
  
  .scroll-btn {
    display: none; /* Hide scroll buttons on touch devices */
  }
}

/* Add visual scroll hint on mobile */
@media (max-width: 768px) {
  .category-tabs-wrapper::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9));
    pointer-events: none;
    z-index: 5;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .category-tabs-wrapper.scrollable::after {
    opacity: 1;
  }
}
</style>

<style scoped>
/* ==================== RECOMMENDED PRODUCTS SECTION ==================== */
.recommended-section {
  padding: 40px 0;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ==================== SECTION HEADING ==================== */
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-heading h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex-shrink: 0;
}

/* ==================== PRODUCTS GRID ==================== */
.products-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1b6db5;
}

/* ==================== PRODUCT BADGES ==================== */
.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 10;
}

.badge {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  display: inline-block;
  line-height: 1;
}

.badge.sale {
  background: #1d79c5;
}

.badge.best {
  background: #0891b2;
}

.badge.out-of-stock {
  background: #6b7280;
}

/* ==================== WISHLIST BUTTON ==================== */
.wishlist-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  padding: 0;
}

.wishlist-btn:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.wishlist-btn.in-wishlist {
  background: #fef2f2;
  border-color: #dc2626;
}

.wishlist-btn.in-wishlist i {
  color: #dc2626;
}

.wishlist-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== PRODUCT IMAGE ==================== */
.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 140px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image-wrapper.out-of-stock {
  opacity: 0.6;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* ==================== PRODUCT CONTENT ==================== */
.product-content {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  display: flex;
  gap: 1px;
  font-size: 0.8rem;
}

.rating-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-left: 4px;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.price-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.current-price {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.original-price {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.discount-percentage {
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 600;
  background: #fee2e2;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ==================== RESPONSIVE DESIGN ==================== */

/* Large Desktop */
@media (max-width: 1600px) {
  .products-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Desktop */
@media (max-width: 1400px) {
  .products-grid {
    grid-template-columns: repeat(7, 1fr);
  }
  
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-tabs-container {
    width: 100%;
    justify-content: flex-start;
  }
  
  .category-tabs {
    justify-content: flex-start;
  }
}

/* Laptop */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Tablet */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }
  .recommended-section {
    padding: 30px 0;
  }
  .product-image-wrapper {
    height: 120px;
  }
  
  .product-content {
    padding: 10px;
  }
  
  .product-title {
    font-size: 0.8rem;
    min-height: 36px;
  }
  
  .current-price {
    font-size: 0.95rem;
  }
  
  .section-heading h2 {
    font-size: 1.4rem;
  }
  
  .scroll-btn {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
}

@media (max-width: 769px) {
  .recommended-section {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .product-card {
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    border: 1px solid #f3f4f6;
  }
  
  .rating-section {
    display: none;
  }
  
  .product-image-wrapper {
    height: 100px;
  }
  
  .product-content {
    padding: 8px;
    gap: 6px;
  }
  
  .product-title {
    font-size: 0.75rem;
    line-height: 1.3;
    min-height: 32px;
    -webkit-line-clamp: 2;
  }
  
  .price-wrapper {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .current-price {
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .original-price {
    font-size: 0.7rem;
  }
  
  .discount-percentage {
    font-size: 0.7rem;
    padding: 1px 4px;
  }
  
  .section-heading {
    margin-bottom: 20px;
    gap: 16px;
  }
  
  .section-heading h2 {
    font-size: 1.2rem;
  }
  
  .category-tabs {
    padding: 6px 4px 10px;
    gap: 6px;
  }
  
  .tab-button {
    padding: 5px 10px;
    font-size: 0.75rem;
    min-height: 28px;
  }
  
  .product-badges {
    top: 6px;
    left: 6px;
  }
  
  .badge {
    padding: 2px 4px;
    font-size: 0.6rem;
  }
  
  .wishlist-btn {
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
  
  .scroll-btn {
    display: none; /* Hide scroll buttons on mobile, use touch scrolling */
  }
}

/* Small Mobile */
@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;   
  }
  
  .rating-section {
    display: none;
  }
  
  .product-content {
    padding: 6px;
    gap: 4px;
  }
  
  .product-image-wrapper {
    height: 90px;
  }
  
  .product-title {
    font-size: 0.7rem;
    min-height: 28px;
    -webkit-line-clamp: 2;
  }
  
  .price-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .current-price {
    font-size: 0.85rem;
  }
  
  .original-price {
    font-size: 0.65rem;
  }
  
  .discount-percentage {
    font-size: 0.65rem;
  }
  
  .section-heading h2 {
    font-size: 1.1rem;
  }
  
  .tab-button {
    padding: 4px 8px;
    font-size: 0.7rem;
    min-height: 26px;
  }
}

/* Extra Small Mobile */
@media (max-width: 400px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .product-image-wrapper {
    height: 80px;
  }
  
  .product-title {
    font-size: 0.65rem;
    min-height: 26px;
  }
  
  .current-price {
    font-size: 0.8rem;
  }
}

/* ==================== UTILITY CLASSES ==================== */
.text-yellow-400 {
  color: #fbbf24;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-5xl {
  font-size: 3rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #186fc6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  margin: 20px 0;
}

.empty-icon {
  font-size: 2.5rem;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #1f2937;
  margin: 12px 0 8px;
  font-size: 1.2rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 0.9rem;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

/* View More Button */
.view-more-container {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.view-more-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #1b6db5 0%, #2a8ce6 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(27, 109, 181, 0.2);
}

.view-more-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #155a9e 0%, #1e7bc7 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 109, 181, 0.3);
}

.view-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Fallback Indicator */
.fallback-indicator {
  text-align: center;
  margin-top: 15px;
  padding: 8px;
  font-size: 0.85rem;
}

.fallback-indicator i {
  margin-right: 5px;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-main {
  background: #1b6db5;
  color: white;
}

.btn-main:hover {
  background: #155a9e;
}

.btn-main i {
  margin-right: 5px;
}
</style>
