<template>
  <section class="recommended-section pt-12 pb-12">
    <div class="container">
      <div class="section-heading">
        <h2>{{ filteredProducts.length > 0 ? 'Recommended for you' : '' }}</h2>
        <div class="category-tabs-container">
          <!-- Left Scroll Button -->
          <button v-if="showScrollButtons" class="scroll-btn scroll-left" @click="scrollTabs(-1)" :disabled="isAtStart">
            <i class="ph ph-caret-left"></i>
          </button>

          <div class="category-tabs-wrapper" ref="tabsContainer">
            <div class="category-tabs" @scroll.passive="handleScroll">
              <!-- All Category Tab -->
              <button class="tab-button" :class="{ active: activeTab === 'all' }"
                @click="loadProductsForCategory('all')" :disabled="isLoading && activeTab !== 'all'">
                <span class="tab-label">All Products</span>
              </button>

              <!-- Categories from API -->
              <button v-for="(category, index) in allCategories" :key="category.id" class="tab-button" :class="{
                active: activeTab === category.id,
                'no-products': category.productCount === 0
              }" @click="loadProductsForCategory(category.id)"
                :disabled="(isLoading && activeTab !== category.id) || category.productCount === 0"
                :title="category.productCount === 0 ? 'No products available' : `${category.productCount} products`">
                <span class="tab-label">
                  {{ category.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Right Scroll Button -->
          <button v-if="showScrollButtons" class="scroll-btn scroll-right" @click="scrollTabs(1)" :disabled="isAtEnd">
            <i class="ph ph-caret-right"></i>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- Products Swiper Carousel (Desktop) -->
      <div v-else-if="filteredProducts.length > 0" class="products-swiper-container desktop-only">
        <Swiper class="products-swiper" :modules="swiperModules" :slides-per-view="2" :space-between="8"
          :breakpoints="swiperBreakpoints" :watch-overflow="true">
          <SwiperSlide v-for="(product, index) in filteredProducts" :key="product.groupId || `product-${index}`"
            class="h-auto">
            <div class="product-card">
              <NuxtLink :to="getProductLink(product)" class="product-image-container">
                <img :src="getProductImage(product, index)" :alt="getProductName(product)" class="product-image"
                  @error="handleImageError($event, index)" loading="lazy" width="280" height="210" />
              </NuxtLink>

              <div class="product-content">
                <h6 class="product-title">
                  <NuxtLink :to="getProductLink(product)" class="product-link">
                    {{ getProductName(product) }}
                  </NuxtLink>
                </h6>

                <div class="price-review-row">
                  <div class="price-section">
                    <span class="current-price">
                      ₹{{ Math.floor(getDiscountedPrice(product)) }}
                      <span class="per-unit">/Qty</span>
                    </span>
                    <span class="original-price" v-if="hasDiscount(product)">
                      ₹{{ Math.floor(getOriginalPrice(product)) }}
                    </span>
                  </div>

                  <div class="review-section">
                    <span class="rating">{{ getProductRating(product).toFixed(1) }}</span>
                    <i class="ph-fill ph-star rating-star"></i>
                    <span class="review-count">({{ getReviewCount(product) }})</span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress-section">
                  <div class="progress-info">
                    <span>Sold: {{ Math.floor(Math.random() * 30) + 70 }}%</span>
                    <span>Available: {{ Math.floor(Math.random() * 20) + 5 }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (Math.floor(Math.random() * 30) + 70) + '%' }"></div>
                  </div>
                </div>

                <button class="add-cart-btn" @click="handleAddToCart(product)"
                  :disabled="getProductStock(product) === 0 || isAddingToCart">
                  <template v-if="getProductStock(product) === 0">
                    Out of Stock
                  </template>
                  <template v-else>
                    <i v-if="!isAddingToCart" class="ph ph-shopping-cart"></i>
                    {{ isAddingToCart ? 'Adding...' : 'Add' }}
                  </template>
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Mobile 3x3 Grid -->
      <div v-if="filteredProducts.length > 0" class="mobile-grid-container mobile-only">
        <div class="mobile-grid">
          <NuxtLink v-for="(product, index) in mobileGridProducts" :key="product.groupId || `product-${index}`"
            :to="getProductLink(product)" class="mobile-product-card">
            <img :src="getProductImage(product, index)" :alt="getProductName(product)" class="mobile-product-image"
              @error="handleImageError($event, index)" loading="lazy" width="120" height="120" />
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="errorMessage && !isLoading" class="error-state">
        <div class="error-icon">
          <i class="ph ph-warning-circle text-5xl text-red-400"></i>
        </div>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="retryInitialization" class="retry-btn">
          <i class="ph ph-arrow-clockwise mr-2"></i>
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="ph ph-package text-5xl text-gray-400"></i>
        </div>
        <p>No products available</p>
      </div>

      <!-- View More Button -->
      <div v-if="filteredProducts.length > 0 && pagination.total > pagination.perPage" class="view-more-container">
        <button @click="viewMoreProducts" class="view-more-btn" :disabled="isLoading">
          <i class="ph ph-arrow-down mr-2"></i>
          View More
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRecommendStore } from '../../store/useRecommendStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import { useToast } from "vue-toastification"
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useCart } from '~/composables/api/useCart'

/* Import Swiper styles */
import 'swiper/css'

const toast = useToast()
const recommendStore = useRecommendStore()
const wishlistStore = useWishlistStore()
const { addToCart } = useCart()

// State
const activeTab = ref('all')
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const productsPerPage = 10
const isAddingToCart = ref(false) // Prevent multiple clicks

// Tab scrolling
const tabsContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const showScrollButtons = ref(false)

const swiperBreakpoints = {
  320: { slidesPerView: 1.5, spaceBetween: 8 },
  375: { slidesPerView: 1.8, spaceBetween: 8 },
  480: { slidesPerView: 2, spaceBetween: 10 },
  640: { slidesPerView: 2.5, spaceBetween: 12 },
  768: { slidesPerView: 3, spaceBetween: 12 },
  840: { slidesPerView: 3.2, spaceBetween: 12 },
  992: { slidesPerView: 3.5, spaceBetween: 14 },
  1200: { slidesPerView: 4.5, spaceBetween: 16 },
  1400: { slidesPerView: 5, spaceBetween: 16 },
  1600: { slidesPerView: 6, spaceBetween: 16 }
}

// Computed
const allCategories = computed(() => {
  return recommendStore.categories || []
})

const filteredProducts = computed(() => {
  const products = recommendStore.products || []

  // API returns main products directly, no need to filter variants
  return products
})

const pagination = computed(() => recommendStore.pagination || { total: 0, perPage: productsPerPage })

const mobileGridProducts = computed(() => {
  return filteredProducts.value.slice(0, 9)
})

// Handle image error with fallback
const handleImageError = (event, index) => {
  const img = event.target

  // Prevent infinite loop
  if (img.dataset.fallbackSet) {
    return
  }

  // Try fallback image first
  const fallbackSrc = '/assets/images/placeholder.jpg'
  if (img.src !== fallbackSrc && !img.src.includes('placeholder')) {
    img.src = fallbackSrc
    img.dataset.fallbackSet = 'true'
    return
  }

  // If fallback also fails, hide image but show placeholder
  img.style.display = 'none'

  // Create placeholder div
  const wrapper = img.parentElement
  if (wrapper && !wrapper.querySelector('.image-placeholder')) {
    const placeholder = document.createElement('div')
    placeholder.className = 'image-placeholder'
    placeholder.innerHTML = '<i class="ph ph-package text-3xl text-gray-400"></i>'
    placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; background: #f9fafb;'
    wrapper.appendChild(placeholder)
  }

  img.onerror = null
}

// Get product link
const getProductLink = (product) => {
  const productName = getProductName(product)
  const groupId = product.groupId || product.mainProduct?.id || product.id

  // Ensure we have valid values
  if (!groupId || groupId === 'undefined') {
    console.warn('Invalid product ID for link generation:', product)
    return '/shop/shop-all'
  }

  // Create a URL-safe product name with fallback
  let safeProductName = 'product' // default fallback
  if (productName && productName.trim()) {
    safeProductName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) // limit length
  }

  // Ensure we don't end up with an empty slug
  if (!safeProductName || safeProductName === '') {
    safeProductName = 'product'
  }

  return `/shop-all/${safeProductName}--${groupId}`
}

// Initialize
onMounted(async () => {
  isLoading.value = true

  try {
    // Load categories first with timeout
    const categoriesPromise = recommendStore.fetchCategories()
    const categoriesTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Categories fetch timeout')), 5000)
    )

    await Promise.race([categoriesPromise, categoriesTimeout])
      .catch(err => {
        console.warn('Categories fetch failed, using fallback:', err.message)
        // Continue with products even if categories fail
      })

    // Load "All" products with timeout and retry
    let productsLoaded = false
    let retryCount = 0
    const maxRetries = 2

    while (!productsLoaded && retryCount <= maxRetries) {
      try {
        const productsPromise = recommendStore.fetchProducts({
          page: 1,
          limit: 10,
          category: null,
          sortBy: 'popularity'
        })

        const productsTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Products fetch timeout')), 8000)
        )

        await Promise.race([productsPromise, productsTimeout])
        productsLoaded = true

        // Check if we got products
        if (recommendStore.products.length === 0) {
          console.warn('No products loaded, trying fallback...')
          // Try with different parameters
          await recommendStore.fetchProducts({
            page: 1,
            limit: 10,
            category: null,
            sortBy: 'name' // Try different sort
          })
        }

      } catch (error) {
        retryCount++
        console.error(`Products fetch attempt ${retryCount} failed:`, error)

        if (retryCount <= maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        } else {
          // Set error state but don't break the UI
          errorMessage.value = 'Unable to load products. Please refresh the page.'
          console.error('All product fetch attempts failed')
        }
      }
    }

    // Check if we need scroll buttons
    nextTick(() => {
      checkScrollButtons()
    })

  } catch (error) {
    console.error('Initialization error:', error)
    errorMessage.value = 'Failed to load data. Please try again.'
  } finally {
    isLoading.value = false
  }
})

// Check scroll buttons visibility
const checkScrollButtons = () => {
  const tabs = getTabsScrollElement()
  if (!tabs) return

  const isOverflowing = tabs.scrollWidth > tabs.clientWidth + 1
  showScrollButtons.value = isOverflowing

  updateScrollState()
}

// Update scroll state
const updateScrollState = () => {
  const tabs = getTabsScrollElement()
  if (!tabs) return

  isAtStart.value = tabs.scrollLeft <= 10
  isAtEnd.value = tabs.scrollLeft + tabs.clientWidth >= tabs.scrollWidth - 10
}

// Scroll tabs
const scrollTabs = (direction) => {
  const tabs = getTabsScrollElement()
  if (!tabs) return

  const scrollAmount = 200 // pixels to scroll

  tabs.scrollBy({
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

const getTabsScrollElement = () => {
  if (!tabsContainer.value) return null
  return tabsContainer.value.querySelector('.category-tabs')
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

    // Add retry logic for category loading
    let productsLoaded = false
    let retryCount = 0
    const maxRetries = 2

    while (!productsLoaded && retryCount <= maxRetries) {
      try {
        const productsPromise = recommendStore.fetchProducts({
          page: 1,
          limit: 10,
          category: categoryName,
          sortBy: 'popularity'
        })

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Category products timeout')), 6000)
        )

        await Promise.race([productsPromise, timeoutPromise])
        productsLoaded = true

        // Verify we got products
        if (recommendStore.products.length === 0 && categoryName) {
          console.warn(`No products found for category: ${categoryName}`)
          // Try case-insensitive search
          const allCats = recommendStore.categories || []
          const matchingCat = allCats.find(cat =>
            cat.name?.toLowerCase() === categoryName?.toLowerCase()
          )

          if (matchingCat) {
            await recommendStore.fetchProducts({
              page: 1,
              limit: 10,
              category: matchingCat.name,
              sortBy: 'popularity'
            })
          }
        }

      } catch (error) {
        retryCount++
        console.error(`Category ${categoryName} load attempt ${retryCount} failed:`, error)

        if (retryCount <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        } else {
          errorMessage.value = `Unable to load ${categoryName || 'products'}. Please try again.`
        }
      }
    }

  } catch (error) {
    console.error('Error loading products:', error)
    errorMessage.value = 'Failed to load products. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Retry initialization
const retryInitialization = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Reset store state
    recommendStore.products = []

    // Retry initialization
    await Promise.race([
      recommendStore.fetchCategories(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Categories timeout')), 5000))
    ]).catch(() => {
      console.warn('Categories retry failed, continuing with products')
    })

    await Promise.race([
      recommendStore.fetchProducts({
        page: 1,
        limit: 10,
        category: null,
        sortBy: 'popularity'
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Products timeout')), 8000))
    ])

    errorMessage.value = ''
  } catch (error) {
    console.error('Retry failed:', error)
    errorMessage.value = 'Still unable to load products. Please check your connection and refresh the page.'
  } finally {
    isLoading.value = false
  }
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

// Helper function to get category name by ID
const getCategoryName = (categoryId) => {
  if (categoryId === 'all') return null

  const category = allCategories.value.find(cat =>
    cat.id === categoryId || cat.id.toString() === categoryId.toString()
  )

  return category?.name || null
}

// Cart functionality
const handleAddToCart = (product) => {
  console.log('handleAddToCart called with product:', product)

  // Prevent multiple clicks
  if (isAddingToCart.value) {
    console.log('Already adding to cart, preventing duplicate call')
    return
  }

  // Extract actual product data from nested structure
  const actualProduct = product.mainProduct || product

  if (!actualProduct || !actualProduct.id) {
    console.error('Invalid product:', actualProduct)
    toast.error("Invalid product data", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true
    })
    return
  }

  // Set flag to prevent multiple clicks
  isAddingToCart.value = true

  try {
    console.log('Adding to cart:', actualProduct)
    addToCart(actualProduct)
    toast.success("Added to cart!", {
      position: "top-center",
      timeout: 1500,
      hideProgressBar: true
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error("Failed to add to cart", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true
    })
  } finally {
    // Reset flag after a short delay
    setTimeout(() => {
      isAddingToCart.value = false
    }, 500)
  }
}

// Add resize listener
onMounted(() => {
  window.addEventListener('resize', checkScrollButtons)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollButtons)
})
</script>

<style scoped>
/* HomeFlash Card Design Styles */
.product-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 240px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #CA2D52;
}

/* Product Image */
.product-image-container {
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-shrink: 0;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Product Content */
.product-content {
  padding: 6px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.price-review-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  flex-shrink: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.per-unit {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.original-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.review-section {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.rating {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.rating-star {
  color: #f59e0b;
  font-size: 14px;
}

.review-count {
  font-size: 14px;
  color: #64748b;
}

/* Product Title */
.product-title {
  margin: 0;
  flex-shrink: 0;
  line-height: 1.4;
}

.product-link {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  max-height: 3em;
}

.product-link:hover {
  color: #CA2D52;
}

/* Progress Section */
.progress-section {
  margin-top: 4px;
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Add to Cart Button */
.add-cart-btn {
  background: #CA2D52;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.3);
  width: 100%;
  margin-top: 8px;
}

.add-cart-btn:hover:not(:disabled) {
  background: #B02548;
  box-shadow: 0 6px 16px rgba(202, 45, 82, 0.4);
  transform: translateY(-2px);
}

.add-cart-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Existing styles from HomeRecomend */
.recommended-section {
  padding: 24px 0;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Section Heading */
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-heading h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex-shrink: 0;
}

/* Products Swiper */
.products-swiper-container {
  padding: 10px 0;
}

.products-swiper {
  padding: 0 10px 6px;
}

.products-swiper .swiper {
  overflow: visible;
}

.products-swiper .swiper-slide {
  height: auto;
  display: flex;
}

.products-swiper .swiper-wrapper {
  align-items: stretch;
}

.products-swiper .swiper-slide>.product-card {
  width: 100%;
}


/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
}

.error-icon {
  margin-bottom: 16px;
}

.error-message {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #475569;
}

.retry-btn {
  background: #CA2D52;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #B02548;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
}

.empty-icon {
  margin-bottom: 16px;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e2e8f0;
  border-top-color: #CA2D52;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Category Tabs */
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
  background: #ecedeb;
  border-color: var(--main-600);
  color: var(--main-600);
  box-shadow: 0 4px 8px rgba(202, 45, 82, 0.1);
}

.scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #ecedeb;
}

.scroll-left {
  order: -1;
}

.scroll-right {
  order: 1;
}

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
  color: var(--main-600);
  border-color: var(--main-600);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(202, 45, 82, 0.15);
}

.tab-button.active {
  background: linear-gradient(135deg, #CA2D52, #B02548);
  color: white !important;
  border-color: #CA2D52;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(202, 45, 82, 0.25);
}

.tab-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #ecedeb;
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

/* View More Button */
.view-more-container {
  text-align: center;
  margin-top: 32px;
}

.view-more-btn {
  background: #CA2D52;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.view-more-btn:hover:not(:disabled) {
  background: #B02548;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(202, 45, 82, 0.4);
}

.view-more-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    padding: 0 12px;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .section-heading h2 {
    font-size: 1.25rem;
  }

  .category-tabs-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .recommended-section {
    padding: 16px 0;
  }

  .container {
    padding: 0 8px;
  }

  .section-heading {
    margin-bottom: 16px;
    gap: 12px;
  }

  .section-heading h2 {
    font-size: 1.125rem;
  }

  .category-tabs-container {
    gap: 6px;
  }

  .scroll-btn {
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }

  .tab-button {
    padding: 5px 12px;
    font-size: 0.8rem;
    min-height: 28px;
  }

  .products-swiper-container {
    padding: 8px 0;
  }

  .products-swiper {
    padding: 0 8px 4px;
  }

  .error-state,
  .empty-state {
    padding: 40px 16px;
  }

  .error-message {
    font-size: 16px;
  }

  .loading-container {
    padding: 60px 0;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .view-more-container {
    margin-top: 24px;
  }

  .view-more-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .recommended-section {
    padding: 12px 0;
  }

  .container {
    padding: 0 6px;
  }

  .section-heading {
    margin-bottom: 12px;
    gap: 8px;
  }

  .section-heading h2 {
    font-size: 1rem;
  }

  .category-tabs-container {
    gap: 4px;
  }

  .scroll-btn {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }

  .tab-button {
    padding: 4px 10px;
    font-size: 0.75rem;
    min-height: 24px;
  }

  .category-tabs {
    padding: 6px 2px 8px;
    gap: 6px;
  }

  .products-swiper-container {
    padding: 6px 0;
  }

  .products-swiper {
    padding: 0 6px 2px;
  }

  .error-state,
  .empty-state {
    padding: 30px 12px;
  }

  .error-message {
    font-size: 14px;
  }

  .retry-btn {
    padding: 8px 16px;
    font-size: 12px;
  }

  .loading-container {
    padding: 40px 0;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }

  .view-more-container {
    margin-top: 20px;
  }

  .view-more-btn {
    padding: 8px 16px;
    font-size: 12px;
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .container {
    padding: 0 4px;
  }

  .section-heading h2 {
    font-size: 0.875rem;
  }

  .tab-button {
    padding: 3px 8px;
    font-size: 0.7rem;
    min-height: 22px;
  }
}

/* Fix for Swiper layout */
:deep(.swiper-slide) {
  height: auto !important;
}

:deep(.swiper-slide > *) {
  height: 100% !important;
  width: 100% !important;
}

/* Mobile Grid Styles */
.mobile-grid-container {
  padding: 16px 0;
}

.mobile-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px;
}

.mobile-product-card {
  display: block;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  aspect-ratio: 1;
}

.mobile-product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #CA2D52;
}

.mobile-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.mobile-product-card:hover .mobile-product-image {
  transform: scale(1.1);
}

/* Responsive visibility classes */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .mobile-grid {
    gap: 10px;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .mobile-grid {
    gap: 8px;
    padding: 0 6px;
  }
}

@media (max-width: 360px) {
  .mobile-grid {
    gap: 6px;
    padding: 0 4px;
  }
}
</style>
