<template>
  <section class="recommended-section">
    <div class="container">
      <div class="section-heading">
        <h2>Recommended for you</h2>
        <div class="category-tabs-container">
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
             
            <!-- Categories from API -->
            <button 
              v-for="category in allCategories"
              :key="category.id"
              class="tab-button"
              :class="{ 
                active: activeTab === category.id,
                'no-products': category.productCount === 0
              }"
              @click="loadProductsForCategory(category.id)"
              :disabled="(isLoading && activeTab !== category.id) || category.productCount === 0"
              :title="category.productCount === 0 ? 'No products available' : `${category.productCount} products`"
            >
              <span class="tab-label">
                {{ category.name }}
              </span>
            </button>
          </div>
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
        >
          <!-- Product Badges -->
          <div class="product-badges">
            <span v-if="hasDiscount(product)" class="badge sale">SALE</span>
            <span v-if="isBestSeller(product)" class="badge best">BEST</span>
            <span v-if="getProductStock(product) === 0" class="badge out-of-stock">OUT</span>
          </div> 
          
          <!-- Wishlist Button -->
          <button 
            class="wishlist-btn"
            @click="addToWishlist(product)"
            :disabled="isLoading"
            :title="isInWishlist(product) ? 'Remove from wishlist' : 'Add to wishlist'"
            :class="{ 'in-wishlist': isInWishlist(product) }"
          >
            <i :class="['ph', isInWishlist(product) ? 'ph-heart-fill' : 'ph-heart']"></i>
          </button>
          
          <!-- Product Image -->
          <div class="product-image-wrapper" :class="{ 'out-of-stock': getProductStock(product) === 0 }">
            <img 
              :src="getProductImage(product)"
              :alt="getProductName(product)"
              class="product-image"
              @error="handleImageError"
              loading="lazy"
            />
          </div>
          
          <!-- Product Content -->
          <NuxtLink
            :to="`/shop-all/${getProductName(product)}--${product.groupId}`"
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
      </div>
      
      <!-- View More Button -->
      <div v-if="filteredProducts.length > 0 && pagination.total > pagination.perPage" class="view-more-container">
        <button @click="viewMoreProducts" class="view-more-btn" :disabled="isLoading">
          <i class="ph ph-arrow-down mr-2"></i>
          View More Products
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRecommendStore } from '../store/useRecommendStore'
import { useWishlistStore } from '../store/useWishlistStore'
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

// ==================== COMPUTED PROPERTIES ====================
const allCategories = computed(() => {
  return recommendStore.categories || []
})

const totalProductsCount = computed(() => {
  const categories = recommendStore.categories || []
  return categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)
})

const filteredProducts = computed(() => recommendStore.products || [])

const pagination = computed(() => recommendStore.pagination || { total: 0, perPage: productsPerPage })

// ==================== INITIALIZATION ====================
onMounted(async () => {
  console.log('Component mounted - Loading initial data')
  
  isLoading.value = true
  
  try {
    // Step 1: Load categories first
    console.log(' Step 1: Loading categories...')
    await recommendStore.fetchCategories()
    
    console.log(' Categories loaded:', allCategories.value.map(c => ({ 
      name: c.name, 
      count: c.productCount 
    })))
    
    // Step 2: Load "All" products (category: null)
    console.log(' Step 2: Loading "All" products (category: null)...')
    activeTab.value = 'all'
    await recommendStore.fetchProducts({
      page: 1,
      limit: productsPerPage,
      category: null, // यहीं key है - null भेजें
      sortBy: 'popularity'
    })
    
    console.log(' Initial products loaded:', filteredProducts.value.length)
    console.log('First product category:', filteredProducts.value[0]?.category?.name)
    
  } catch (error) {
    console.error(' Initialization error:', error)
    errorMessage.value = 'Failed to load data. Please try again.'
  } finally {
    isLoading.value = false
  }
})

// ==================== SIMPLE CATEGORY SWITCHING ====================
const loadProductsForCategory = async (categoryId) => {
  if (activeTab.value === categoryId || isLoading.value) return
  
  console.log(`Loading products for category: ${categoryId}`)
  activeTab.value = categoryId
  currentPage.value = 1
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const categoryName = categoryId === 'all' ? null : getCategoryName(categoryId)
    
    console.log(` Fetching products with category: ${categoryName === null ? 'null (ALL)' : categoryName}`)
    
    await recommendStore.fetchProducts({
      page: 1,
      limit: productsPerPage,
      category: categoryName,
      sortBy: 'popularity'
    })
    
    console.log(` Products loaded for "${categoryName || 'ALL'}": ${filteredProducts.value.length}`)
    
  } catch (error) {
    console.error('Error loading products:', error)
    errorMessage.value = 'Failed to load products. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ==================== HELPER FUNCTIONS ====================
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

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Product+Image'
}

// ==================== VIEW MORE ====================
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

// ==================== PRODUCT ACTIONS ====================
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

// ==================== PRODUCT GETTERS ====================
const getProductName = (product) => recommendStore.getProductName(product)
const getProductImage = (product) => recommendStore.getProductImage(product)
const getOriginalPrice = (product) => recommendStore.getOriginalPrice(product).toFixed(2)
const getDiscountedPrice = (product) => recommendStore.getDiscountedPrice(product).toFixed(2)
const getProductRating = (product) => recommendStore.getProductRating(product)
const getProductStock = (product) => recommendStore.getProductStock(product)
const hasDiscount = (product) => recommendStore.hasDiscount(product)
const getDiscountPercentage = (product) => recommendStore.getDiscountPercentage(product)
const isBestSeller = (product) => recommendStore.isBestSeller(product)
</script>

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

/* ==================== CATEGORY TABS ==================== */
.category-tabs-container {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 8px 4px 12px;
  scrollbar-width: none;
  justify-content: flex-end;
}

.category-tabs::-webkit-scrollbar {
  display: none;
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
}

.tab-button:hover:not(:disabled) {
  /* border-color: #dc2626; */
  color: #1b6db5;
}

.tab-button.active {
  background:#1b6db5;
  color: white;
  /* border-color: #dc2626; */
  font-weight: 600;
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  line-height: 0.9;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  object-fit:contain;
  /* padding: 12px; */
  /* transition: transform 0.3s ease; */
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
  /* gap: 6px;
  margin: 4px 0; */
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
}

/* .price-section {
  margin: 8px 0 0;
} */

.price-wrapper {
  display: flex;
  align-items: center;
  /* gap: 8px; */
  /* margin-bottom: 4px; */
}

.current-price {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
}

.original-price {
  font-size: 0.8rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.discount-percentage {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 600;
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
    grid-template-columns: repeat(10, 1fr);
  }
}

/* Laptop */
@media (max-width: 1200px) {
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
    padding: 8px;
  }
  
  .product-content {
    padding: 10px;
  }
  
  .product-title {
    font-size: 0.8rem;
    min-height: 36px;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .section-heading h2 {
    font-size: 1.4rem;
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
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
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
    padding: 0;
  }
  
  .product-image {
    padding: 0;
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
    color: #dc2626;
  }
  
  .rating-section {
    margin: 2px 0;
  }
  
  .stars {
    font-size: 0.7rem;
  }
  
  .rating-value {
    font-size: 0.7rem;
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
}

/* Small Mobile (480px and below) */
/* @media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
  }
  
  .product-image-wrapper {
    height: 90px;
  }
  
  .product-title {
    font-size: 0.7rem;
    min-height: 28px;
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
  
  .rating-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .stars {
    font-size: 0.65rem;
  }
  
  .rating-value {
    font-size: 0.65rem;
  }
  
  .section-heading h2 {
    font-size: 1.1rem;
  }
  
  .container {
    padding: 0 8px;
  }
} */

@media (max-width: 500px) {
   .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;   
  }
    .rating-section {
    display: none;
  }
  .product-content {
  padding: 3px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

  .product-image{
    padding: 0;
  }
  .product-image-wrapper {
    height: 80px;
    padding: 0;
  }
  
  /* .product-content {
    padding: 6px;
  } */
  
  .product-title {
    font-size: 0.65rem;
    min-height: 24px;
    -webkit-line-clamp: 2;
  }
  
  .price-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
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
  background: #dc2626;
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
}

.view-more-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.view-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>