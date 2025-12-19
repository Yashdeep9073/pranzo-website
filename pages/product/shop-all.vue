<template>
  <!-- Skeleton Loading -->
  <div v-if="showInitialLoading" class="skeleton-container">
    <div class="container container-lg pt-80">
      <div class="row">
        <!-- Sidebar Skeleton -->
        <div class="col-lg-3 d-none d-lg-block">
          <div class="skeleton-sidebar">
            <div class="skeleton-card mb-32" v-for="n in 3" :key="n">
              <div class="skeleton-title mb-24 shimmer"></div>
              <div class="skeleton-item mb-16 shimmer" v-for="i in 4" :key="i"></div>
            </div>
          </div>
        </div>

        <!-- Content Skeleton -->
        <div class="col-lg-9">
          <!-- Top Bar -->
          <div class="skeleton-topbar mb-40">
            <div class="skeleton-text shimmer" style="width: 200px;"></div>
            <div class="skeleton-controls">
              <div class="skeleton-button shimmer" style="width: 100px;"></div>
              <div class="skeleton-button shimmer" style="width: 120px;"></div>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="row g-24">
            <div v-for="n in 8" :key="n" class="col-xl-3 col-lg-4 col-md-6">
              <div class="skeleton-product-card">
                <div class="skeleton-image shimmer mb-16"></div>
                <div class="skeleton-line shimmer mb-8"></div>
                <div class="skeleton-line shimmer mb-8" style="width: 60%;"></div>
                <div class="skeleton-line shimmer mb-12" style="width: 80%;"></div>
                <div class="skeleton-line shimmer mb-16" style="width: 40%;"></div>
                <div class="skeleton-button shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <section v-show="!showInitialLoading" class="shop py-80">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="showMobileSidebar" 
      class="sidebar-overlay d-lg-none"
      @click="closeMobileSidebar"
    ></div>
    
    <div class="container container-lg">
      <div class="row">
        <!-- Sidebar Start -->
        <div 
          class="col-lg-3 sidebar-mobile-wrapper"
          :class="{ 'mobile-open': showMobileSidebar }"
        >
          <div class="shop-sidebar">
            <!-- Close button for mobile -->
            <button
              type="button"
              class="shop-sidebar__close d-lg-none"
              @click="closeMobileSidebar"
              :disabled="isLoading"
            >
              <i class="ph ph-x"></i>
            </button>
              
            <!-- Product Category -->
            <div v-if="categories.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Product Category</h6>
                <button v-if="filters.category" 
                        @click="clearCategoryFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="categoryFilter"
                      id="category-all"
                      :checked="!filters.category"
                      @change="clearCategoryFilter"
                      :disabled="isLoading"
                    >
                    <label for="category-all">
                      <span>All Categories</span>
                    </label>
                  </div>
                </li>
                <li v-for="category in categories" :key="category.id" class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="categoryFilter"
                      :id="`category-${category.id}`"
                      :checked="filters.category === category.name"
                      @change="toggleCategoryFilter(category.name)"
                      :disabled="isLoading"
                    >
                    <label :for="`category-${category.id}`">
                      <span>{{ category.name }}</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Brand -->
            <div v-if="brands.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Brand</h6>
                <button v-if="filters.brand" 
                        @click="clearBrandFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="brandFilter"
                      id="brand-all"
                      :checked="!filters.brand"
                      @change="clearBrandFilter"
                      :disabled="isLoading"
                    >
                    <label for="brand-all">
                      <div>
                        <span>All Brands</span>
                      </div>
                    </label>
                  </div>
                </li>
                <li v-for="brand in brands" :key="brand.id" class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="brandFilter"
                      :id="`brand-${brand.id}`"
                      :checked="filters.brand === brand.name"
                      @change="toggleBrandFilter(brand.name)"
                      :disabled="isLoading"
                    >
                    <label :for="`brand-${brand.id}`">
                      <div>
                        <img v-if="brand.logo" 
                             :src="brand.logo" 
                             :alt="brand.name"
                             class="brand-logo"
                             @error="handleImageError">
                        <span>{{ brand.name }}</span>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Price -->
            <div class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Price</h6>
                <button v-if="isPriceFilterApplied" 
                        @click="resetPriceFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Clear
                </button>
              </div>
              
              <div class="mb-24">
                <p class="price-range-text">
                  Price Range: ₹{{ formatPrice(filters.minPrice) }} - ₹{{ formatPrice(filters.maxPrice) }}
                </p>
                
                <div class="mb-16">
                  <label>Min Price: ₹{{ formatPrice(filters.minPrice) }}</label>
                  <input 
                    type="range"
                    :min="0"
                    :max="defaultMaxPrice"
                    v-model.number="priceRange.min"
                    @change="applyPriceFilter"
                    :step="100"
                    :disabled="isLoading"
                  >
                </div>
                
                <div class="mb-24">
                  <label>Max Price: ₹{{ formatPrice(filters.maxPrice) }}</label>
                  <input 
                    type="range"
                    :min="0"
                    :max="defaultMaxPrice"
                    v-model.number="priceRange.max"
                    @change="applyPriceFilter"
                    :step="100"
                    :disabled="isLoading"
                  >
                </div>
              </div>
            </div>

            <!-- Filter by Color -->
            <div v-if="colors.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Color</h6>
                <button v-if="filters.color" 
                        @click="clearColorFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="colorFilter"
                      id="color-all"
                      :checked="!filters.color"
                      @change="clearColorFilter"
                      :disabled="isLoading"
                    >
                    <label for="color-all">
                      <div>
                        <span class="color-indicator"></span>
                        <span>All Colors</span>
                      </div>
                    </label>
                  </div>
                </li>
                <li v-for="color in colors" :key="color" class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="colorFilter"
                      :id="`color-${color}`"
                      :checked="filters.color === color"
                      @change="toggleColorFilter(color)"
                      :disabled="isLoading"
                    >
                    <label :for="`color-${color}`">
                      <div>
                        <span 
                          class="color-indicator"
                          :style="{ backgroundColor: getColorHex(color) }"
                        ></span>
                        <span>{{ color }}</span>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Size -->
            <div v-if="sizes.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Size</h6>
                <button v-if="filters.size" 
                        @click="clearSizeFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Clear
                </button>
              </div>
              <div class="size-filters">
                <button 
                  class="size-btn"
                  :class="{ 
                    'size-btn-active': !filters.size
                  }"
                  @click="clearSizeFilter"
                  :disabled="isLoading"
                >
                  All Sizes
                </button>
                <button 
                  v-for="size in sizes" 
                  :key="size.id"
                  class="size-btn"
                  :class="{ 
                    'size-btn-active': filters.size === size.size
                  }"
                  @click="toggleSizeFilter(size.size)"
                  :disabled="isLoading"
                >
                  {{ size.size }}
                </button>
              </div>
            </div>

            <!-- Sort By -->
            <div class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Sort By</h6>
                <button v-if="filters.sortBy !== 'popularity'" 
                        @click="clearSortFilter"
                        class="btn-clear"
                        :disabled="isLoading">
                  Reset
                </button>
              </div>
              <ul class="scroll-list">
                <li v-for="option in sortOptions" :key="option.value" class="mb-16">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      name="sortFilter"
                      :id="`sort-${option.value}`"
                      :checked="filters.sortBy === option.value"
                      @change="selectSortFilter(option.value)"
                      :disabled="isLoading"
                    >
                    <label :for="`sort-${option.value}`">
                      <span>{{ option.label }}</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Clear All Filters -->
            <div class="clear-filter-box mb-32">
              <button 
                @click="clearAllFilters"
                :disabled="!hasActiveFilters || isLoading"
                class="clear-btn"
              >
                <i class="ph ph-x"></i>
                Clear All Filters
              </button>
            </div>

            <!-- Advertise -->
            <div class="advertise-box">
              <img src="/assets/images/thumbs/advertise-img1.png" alt="Advertisement" @error="handleImageError">
            </div>
          </div>
        </div>

        <!-- Content Start -->
        <div class="col-lg-9">
          <!-- Top Bar -->
          <div class="product-topbar">
            <div class="topbar-info">
              <span class="count-text">
                Showing {{ pagination.from || 0 }}-{{ pagination.to || 0 }} of {{ pagination.total || 0 }} products
              </span>
              <span v-if="filters.category" class="active-filter-tag">
                in {{ filters.category }}
              </span>
              <span v-if="filters.brand" class="active-filter-tag">
                from {{ filters.brand }}
              </span>
              <span v-if="filters.color" class="active-filter-tag">
                color: {{ filters.color }}
              </span>
              <span v-if="filters.size" class="active-filter-tag">
                size: {{ filters.size }}
              </span>
            </div>

            <div class="topbar-actions">
              <!-- View Toggle -->
              <div class="view-toggle">
                <button 
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  :disabled="isLoading"
                >
                  <i class="ph ph-squares-four"></i>
                </button>
                <button 
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  :disabled="isLoading"
                >
                  <i class="ph-bold ph-list-dashes"></i>
                </button>
              </div>

              <!-- Sort Dropdown -->
              <div class="custom-dropdown d-none d-lg-block">
                <button class="custom-btn" @click="toggleSortDropdown" :disabled="isLoading">
                  <i class="ph ph-arrow-up-down"></i>
                  <span>Sort by: {{ getSortLabel(filters.sortBy) }}</span>
                  <i class="arrow" :class="{ open: isSortDropdownOpen }">▼</i>
                </button>

                <ul v-if="isSortDropdownOpen" class="custom-menu">
                  <li v-for="option in sortOptions" :key="option.value">
                    <button
                      :class="{ active: filters.sortBy === option.value }"
                      @click="selectSortOption(option.value)"
                      :disabled="isLoading"
                    >
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Mobile Sidebar Filter -->
              <button 
                class="mobile-filter-btn d-lg-none"
                @click="toggleMobileSidebar"
                :disabled="isLoading"
              >
                <i class="ph-bold ph-funnel-simple"></i>
                <span v-if="hasActiveFilters" class="filter-badge"></span>
              </button>
            </div>
          </div>

          <!-- Active Filters Bar -->
          <div v-if="hasActiveFilters" class="active-filters-bar mb-32">
            <div class="d-flex align-items-center gap-12 mb-16">
              <i class="ph ph-funnel"></i>
              <span>Active Filters:</span>
              
              <button @click="copyURLToClipboard" class="btn-copy-link" :disabled="isLoading">
                <i class="ph ph-copy"></i>Copy Link
              </button>
            </div>
            
            <div class="active-filters">
              <!-- Category Filter -->
              <div v-if="filters.category" class="active-filter-item">
                <span>{{ filters.category }}</span>
                <button @click="clearCategoryFilter" :disabled="isLoading">
                  <i class="ph ph-x"></i>
                </button>
              </div>
              
              <!-- Brand Filter -->
              <div v-if="filters.brand" class="active-filter-item">
                <div>
                  <img v-if="getBrandLogo(filters.brand)" 
                        :src="getBrandLogo(filters.brand)" 
                        :alt="filters.brand"
                        class="brand-logo-sm"
                        @error="handleImageError">
                  <span>{{ filters.brand }}</span>
                </div>
                <button @click="clearBrandFilter" :disabled="isLoading">
                  <i class="ph ph-x"></i>
                </button>
              </div>
              
              <!-- Color Filter -->
              <div v-if="filters.color" class="active-filter-item">
                <div>
                  <span class="color-dot" :style="{ backgroundColor: getColorHex(filters.color) }"></span>
                  <span>{{ filters.color }}</span>
                </div>
                <button @click="clearColorFilter" :disabled="isLoading">
                  <i class="ph ph-x"></i>
                </button>
              </div>
              
              <!-- Size Filter -->
              <div v-if="filters.size" class="active-filter-item">
                <span>Size: {{ filters.size }}</span>
                <button @click="clearSizeFilter" :disabled="isLoading">
                  <i class="ph ph-x"></i>
                </button>
              </div>
              
              <!-- Price Filter -->
              <div v-if="isPriceFilterApplied" class="active-filter-item">
                <span>Price: ₹{{ formatPrice(filters.minPrice) }} - ₹{{ formatPrice(filters.maxPrice) }}</span>
                <button @click="resetPriceFilter" :disabled="isLoading">
                  <i class="ph ph-x"></i>
                </button>
              </div>
              
              <!-- Clear All Button -->
              <button @click="clearAllFilters" class="btn-clear-all" :disabled="isLoading">
                <i class="ph ph-x"></i>
                Clear All
              </button>
            </div>
          </div>

          <!-- Products -->
          <div>
            <!-- Products Grid/List -->
            <div v-if="products.length > 0">
              <!-- Grid View -->
              <div v-if="viewMode === 'grid'" class="product-grid">
                <div v-for="product in products" :key="product.groupId" class="product-card">
                  <!-- Product Image -->
                  <div class="product-image">
                    <NuxtLink :to="getProductLink(product)">
                      <div v-if="!hasImage(product)" class="no-image">
                        <i class="ph ph-image"></i>
                        <span>No image available</span>
                      </div>
                      <img 
                        v-else
                        :src="getPrimaryImage(product)" 
                        :alt="getProductName(product)"
                        loading="lazy"
                        @error="handleProductImageError"
                      >
                    
                      <!-- Badges -->     
                      <div class="product-badges">
                        <span v-if="getDiscountValue(product) > 0" class="discount-badge">
                          -{{ getDiscountValue(product) }}%
                        </span>
                        <span v-if="isProductNew(product)" class="new-badge">
                          New
                        </span>
                      </div>
                      
                      <!-- Quick Actions -->   
                      <div class="product-actions">
                        <button @click="addToWishlist(product)" title="Add to Wishlist" :disabled="isLoading">
                          <i class="ph ph-heart" :class="{ 'in-wishlist': isInWishlist(product) }"></i>
                        </button>
                        <button @click="quickView(product)" title="Quick View" :disabled="isLoading">
                          <i class="ph ph-eye"></i>
                        </button>
                      </div>
                    </NuxtLink>
                  </div>
                  
                  <!-- Product Info -->
                  <div class="product-info">
                    <div class="product-meta">
                      <span class="product-category">{{ getProductCategory(product) || 'General' }}</span>
                      <span v-if="getProductBrand(product)" class="product-brand">
                        {{ getProductBrand(product) }}
                      </span>
                    </div>
                      
                    <div class="product-title-section">
                      <NuxtLink :to="getProductLink(product)">
                        <h3>{{ truncateText(getProductName(product), 50) }}</h3>
                    
                        <!-- Color and Size Info -->
                        <div v-if="getProductColor(product) || getProductSize(product)" class="variant-info">
                          <div>
                            <span v-if="getProductColor(product)" 
                                  class="color-indicator-sm"
                                  :style="{ backgroundColor: getColorHex(getProductColor(product)) }"
                            ></span>
                            <span v-if="getProductColor(product)">{{ getProductColor(product) }}</span>
                            <span v-if="getProductSize(product)">Size: {{ getProductSize(product) }}</span>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                    
                    <!-- Rating -->
                    <div class="product-rating">
                      <div class="stars">
                        <i v-for="star in 5" :key="star" 
                           :class="{
                             'filled': star <= Math.round(getProductRating(product)),
                             'empty': star > Math.round(getProductRating(product))
                           }"></i>
                      </div>
                      <span>({{ getReviewCount(product) }})</span>
                    </div>
                    
                    <!-- Price -->
                    <div class="product-price">
                      <span class="current-price">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                      <span v-if="getDiscountValue(product) > 0" class="original-price">
                        ₹{{ formatPrice(getOriginalPrice(product)) }}
                      </span>
                      <span v-if="getDiscountValue(product) > 0" class="save-badge">
                        Save {{ getDiscountValue(product) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- List View -->
              <div v-else class="list-view">
                <div v-for="product in products" :key="product.groupId" class="product-list-item">
                  <div class="list-item-content">
                    <div class="list-image">
                      <NuxtLink :to="getProductLink(product)">
                        <div v-if="!hasImage(product)" class="no-image">
                          <i class="ph ph-image"></i>
                        </div>
                        <img 
                          v-else
                          :src="getPrimaryImage(product)" 
                          :alt="getProductName(product)"
                          loading="lazy"
                          @error="handleProductImageError"
                        >
                      </NuxtLink>
                    </div>
                    <div class="list-details">
                      <h3>
                        <NuxtLink :to="getProductLink(product)">
                          {{ truncateText(getProductName(product), 70) }}
                        </NuxtLink>
                      </h3>
                      
                      <div class="list-meta">
                        <div v-if="getProductColor(product)" class="color-meta">
                          <span 
                            class="color-indicator-sm"
                            :style="{ backgroundColor: getColorHex(getProductColor(product)) }"
                          ></span>
                          <span>{{ getProductColor(product) }}</span>
                        </div>
                        <span v-if="getProductBrand(product)">Brand: {{ getProductBrand(product) }}</span>
                        <span v-if="getProductSize(product)">Size: {{ getProductSize(product) }}</span>
                      </div>
                      
                      <div class="list-price">
                        <span class="current-price">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                        <span v-if="getDiscountValue(product) > 0" class="original-price">
                          ₹{{ formatPrice(getOriginalPrice(product)) }}
                        </span>
                        <span v-if="getDiscountValue(product) > 0" class="save-badge">
                          Save {{ getDiscountValue(product) }}%
                        </span>
                      </div>
                      
                      <div class="list-actions">
                        <button 
                          @click="addToCart(product)" 
                          :disabled="getProductStock(product) === 0 || isLoading"
                          class="btn-add-cart"
                          :class="{ 'out-of-stock': getProductStock(product) === 0 }"
                        >
                          <i class="ph ph-shopping-cart"></i>
                          <span>{{ getProductStock(product) === 0 ? 'Out of Stock' : 'Add to Cart' }}</span>
                        </button>
                        
                        <button @click="addToWishlist(product)" class="btn-wishlist" :disabled="isLoading">
                          <i class="ph ph-heart" :class="{ 'in-wishlist': isInWishlist(product) }"></i>
                          <span>{{ isInWishlist(product) ? 'In Wishlist' : 'Wishlist' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Pagination -->
              <div v-if="pagination.lastPage > 1" class="pagination-container">
                <div class="pagination">
                  <button 
                    @click="goToPage(filters.page - 1)"
                    :disabled="filters.page === 1 || isLoading"
                    class="pagination-btn prev"
                  >
                    <i class="ph-bold ph-arrow-left"></i>
                  </button>
                  
                  <button 
                    v-for="page in getVisiblePages()" 
                    :key="page" 
                    @click="page !== '...' && goToPage(page)"
                    :disabled="page === '...' || isLoading"
                    class="pagination-btn"
                    :class="{ 
                      'active': page === filters.page, 
                      'disabled': page === '...' 
                    }"
                  >
                    {{ page }}
                  </button>
                  
                  <button 
                    @click="goToPage(filters.page + 1)"
                    :disabled="filters.page === pagination.lastPage || isLoading"
                    class="pagination-btn next"
                  >
                    <i class="ph-bold ph-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- No Products Found -->
            <div v-else class="no-products">
              <div>
                <i class="ph ph-magnifying-glass"></i>
              </div>
              <h4>No products found</h4>
              <p>Try adjusting your filters or search criteria</p>
              <button @click="clearAllFilters" class="btn-clear-filters" :disabled="isLoading">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toKebabCase } from "../../utlis/toKebabCase"
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useProductStore } from '../../store/useProductStore'
import { encodeId } from "../../utlis/encode"

const productStore = useProductStore()

// Local state
const viewMode = ref('grid')
const showMobileSidebar = ref(false)
const isSortDropdownOpen = ref(false)
const wishlist = ref([])
const showInitialLoading = ref(true)
const priceRange = ref({ min: 0, max: 50000 })

// Sort options
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'brand', label: 'Brand Name (A-Z)' }
]

// Computed properties
const isLoading = computed(() => productStore.isLoading)
const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)
const colors = computed(() => productStore.colors)
const sizes = computed(() => productStore.sizes)
const brands = computed(() => productStore.brands)
const pagination = computed(() => productStore.pagination)
const filters = computed(() => productStore.filters)
const hasActiveFilters = computed(() => productStore.hasActiveFilters)
const defaultMaxPrice = computed(() => productStore.defaultMaxPrice || 50000)

const isPriceFilterApplied = computed(() => {
  const f = filters.value
  return f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value
})

const totalProductsCount = computed(() => {
  return pagination.value.total || 0
})

// Helper functions
const hasImage = (product) => {
  return productStore.getProductImage(product) !== '/assets/images/placeholder.jpg'
}

const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}

const handleProductImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

const getProductColor = (product) => productStore.getProductColor(product)
const getProductSize = (product) => productStore.getProductSize(product)
const getProductRating = (product) => productStore.getProductRating(product) || 0
const getReviewCount = (product) => productStore.getReviewCount(product) || 0
const getPrimaryImage = (product) => productStore.getProductImage(product)
const getDiscountedPrice = (product) => productStore.getDiscountedPrice(product)
const getOriginalPrice = (product) => productStore.getOriginalPrice(product)
const getDiscountValue = (product) => product.mainProduct?.discountValue || 0
const getProductName = (product) => productStore.getProductName(product)
const getProductId = (product) => productStore.getProductId(product)
const getProductStock = (product) => productStore.getProductStock(product)
const getProductCategory = (product) => productStore.getProductCategory(product)
const getProductBrand = (product) => productStore.getProductBrand(product)
const getColorHex = (colorName) => productStore.getColorHex(colorName) || '#007bff'
const getBrandLogo = (brandName) => brands.value.find(b => b.name === brandName)?.logo || null
const getSortLabel = (sortType) => sortOptions.find(opt => opt.value === sortType)?.label || 'Most Popular'

const isProductNew = (product) => {
  const mainProduct = product.mainProduct
  if (!mainProduct?.createdAt) return false
  const createdDate = new Date(mainProduct.createdAt)
  const now = new Date()
  const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

// Generate product link with color parameter
const getProductLink = (product) => {
  const productName = toKebabCase(getProductName(product))
  const productId = encodeId(getProductId(product))
  const productColor = getProductColor(product)
  
  let url = `/product/${productName}--${product.groupId}`
  
  if (productColor) {
    url += `?color=${encodeURIComponent(productColor)}`
  }
  
  return url
}

// Filter functions
const toggleColorFilter = async (color) => {
  try {
    await productStore.toggleColorFilter(color)
  } catch (error) {
    console.error('Error toggling color filter:', error)
    showToast('Error applying color filter', 'error')
  }
}

const clearColorFilter = async () => {
  await productStore.clearFilter('color')
}

const toggleSizeFilter = async (size) => {
  try {
    await productStore.toggleSizeFilter(size)
  } catch (error) {
    console.error('Error toggling size filter:', error)
    showToast('Error applying size filter', 'error')
  }
}

const clearSizeFilter = async () => {
  await productStore.clearFilter('size')
}

const toggleCategoryFilter = async (category) => {
  try {
    await productStore.toggleCategoryFilter(category)
  } catch (error) {
    console.error('Error toggling category filter:', error)
    showToast('Error applying category filter', 'error')
  }
}

const clearCategoryFilter = async () => {
  await productStore.clearFilter('category')
}

const toggleBrandFilter = async (brand) => {
  try {
    await productStore.toggleBrandFilter(brand)
  } catch (error) {
    console.error('Error toggling brand filter:', error)
    showToast('Error applying brand filter', 'error')
  }
}

const clearBrandFilter = async () => {
  await productStore.clearFilter('brand')
}

const selectSortFilter = async (sortType) => {
  try {
    await productStore.updateFilters({ sortBy: sortType })
  } catch (error) {
    console.error('Error applying sort:', error)
    showToast('Error applying sort', 'error')
  }
}

const clearSortFilter = async () => {
  await productStore.clearFilter('sort')
}

const applyPriceFilter = async () => {
  const newFilters = {
    minPrice: Math.min(priceRange.value.min, priceRange.value.max),
    maxPrice: Math.max(priceRange.value.min, priceRange.value.max)
  }
  
  if (newFilters.minPrice > newFilters.maxPrice) {
    const temp = newFilters.minPrice
    newFilters.minPrice = newFilters.maxPrice
    newFilters.maxPrice = temp
  }
  
  try {
    await productStore.updateFilters(newFilters)
  } catch (error) {
    console.error('Error applying price filter:', error)
    showToast('Error applying price filter', 'error')
  }
}

const resetPriceFilter = async () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  await productStore.clearFilter('price')
}

const clearAllFilters = async () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  try {
    await productStore.clearAllFilters()
  } catch (error) {
    console.error('Error clearing all filters:', error)
    showToast('Error clearing filters', 'error')
  }
}

// URL Sharing functions
const generateFilterURL = () => {
  const params = new URLSearchParams()
  
  if (filters.value.category) params.append('category', filters.value.category)
  if (filters.value.color) params.append('color', filters.value.color)
  if (filters.value.size) params.append('size', filters.value.size)
  if (filters.value.brand) params.append('brand', filters.value.brand)
  if (filters.value.sortBy !== 'popularity') params.append('sort', filters.value.sortBy)
  if (filters.value.minPrice > 0) params.append('min_price', filters.value.minPrice)
  if (filters.value.maxPrice < defaultMaxPrice.value) params.append('max_price', filters.value.maxPrice)
  if (filters.value.page > 1) params.append('page', filters.value.page)
  
  const queryString = params.toString()
  const baseURL = window.location.origin + '/shop'
  
  return queryString ? `${baseURL}?${queryString}` : baseURL
}

const copyURLToClipboard = async () => {
  try {
    const url = generateFilterURL()
    await navigator.clipboard.writeText(url)
    showToast('Filter link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy URL:', err)
    showToast('Failed to copy URL', 'error')
  }
}

// Pagination
const goToPage = async (page) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    try {
      await productStore.updateFilters({ page })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error changing page:', error)
      showToast('Error changing page', 'error')
    }
  }
}

const getVisiblePages = () => {
  const pages = []
  const total = pagination.value.lastPage
  const currentPage = filters.value.page
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (currentPage >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// UI functions
const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value
}

const selectSortOption = (value) => {
  selectSortFilter(value)
  isSortDropdownOpen.value = false
}

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
  if (showMobileSidebar.value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
  document.body.classList.remove('no-scroll')
}

// Wishlist & Cart
const addToWishlist = (product) => {
  const index = wishlist.value.findIndex(item => 
    item.groupId === product.groupId || 
    item.mainProduct?.id === product.mainProduct?.id
  )
  if (index > -1) {
    wishlist.value.splice(index, 1)
    showToast('Removed from wishlist')
  } else {
    wishlist.value.push(product)
    showToast('Added to wishlist')
  }
}

const isInWishlist = (product) => {
  return wishlist.value.some(item => 
    item.groupId === product.groupId || 
    item.mainProduct?.id === product.mainProduct?.id
  )
}

const addToCart = (product) => {
  if (getProductStock(product) === 0) {
    showToast('Product is out of stock', 'warning')
    return
  }
  showToast('Added to cart')
}

const quickView = (product) => {
  console.log('Quick view:', getProductName(product))
}

const showToast = (message, type = 'success') => {
  console.log(`${type}: ${message}`)
}

// Image error handling
const handleImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

// Watchers
watch(() => filters.value.minPrice, (value) => {
  priceRange.value.min = value
})

watch(() => filters.value.maxPrice, (value) => {
  priceRange.value.max = value
})

// Initialize
onMounted(async () => {
  try {
    await productStore.initialize()
    priceRange.value.min = filters.value.minPrice
    priceRange.value.max = filters.value.maxPrice
    showInitialLoading.value = false
  } catch (error) {
    console.error('Initialization error:', error)
    showInitialLoading.value = false
    showToast('Error loading products', 'error')
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
/* All styles remain the same as your original file */
/* Skeleton Styles */
.skeleton-container {
  min-height: 100vh;
  background: white;
}

.skeleton-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
}

.skeleton-title {
  height: 24px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-item {
  height: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-image {
  height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
}

.skeleton-line {
  height: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-button {
  height: 40px;
  background: #f5f5f5;
  border-radius: 6px;
}

.skeleton-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-controls {
  display: flex;
  gap: 12px;
}

.skeleton-product-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #f5f5f5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Main Styles */
.shop-sidebar {
  position: relative;
}

.shop-sidebar__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.shop-sidebar__close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shop-sidebar__box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: white;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h6 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-clear {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-list {
  max-height: 300px;
  overflow-y: auto;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-check input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-check label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  padding: 4px 0;
}

.form-check label > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.price-range-text {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.shop-sidebar__box input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
}

.shop-sidebar__box input[type="range"]:disabled {
  opacity: 0.5;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.size-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover:not(:disabled) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.size-btn-active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.size-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-filter-box {
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.clear-btn {
  width: 100%;
  padding: 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.advertise-box img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Mobile Sidebar */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar-mobile-wrapper {
  position: relative;
}

@media (max-width: 991px) {
  .sidebar-mobile-wrapper {
    position: fixed;
    top: 0;
    left: -100%;
    width: 320px;
    max-width: 90%;
    height: 100vh;
    z-index: 1000;
    background: white;
    transition: left 0.3s ease;
    overflow-y: auto;
  }
  
  .sidebar-mobile-wrapper.mobile-open {
    left: 0;
  }
}

/* Product Topbar */
.product-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.topbar-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.count-text {
  font-weight: 500;
  color: #111827;
}

.active-filter-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  display: flex;
  gap: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px;
  background: #f9fafb;
}

.view-toggle button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
}

.view-toggle button.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-toggle button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom Dropdown */
.custom-dropdown {
  position: relative;
}

.custom-btn {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
  margin-top: 4px;
}

.custom-menu button {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.custom-menu button:hover:not(:disabled) {
  background: #f9fafb;
}

.custom-menu button.active {
  background: #e0e7ff;
  color: #4f46e5;
}

.custom-menu button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-filter-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.mobile-filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  border: 2px solid white;
}

/* Active Filters Bar */
.active-filters-bar {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.active-filter-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
}

.active-filter-item button {
  background: none;
  border: none;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
}

.active-filter-item button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-copy-link {
  padding: 6px 12px;
  border: 1px solid #4f46e5;
  border-radius: 6px;
  background: white;
  color: #4f46e5;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.btn-copy-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear-all {
  padding: 6px 12px;
  border: 1px solid #dc2626;
  border-radius: 6px;
  background: white;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.btn-clear-all:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 280px;
  background: #f9fafb;
}

.product-image a {
  display: block;
  height: 100%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.no-image i {
  font-size: 48px;
  margin-bottom: 8px;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.discount-badge {
  background: #dc2626;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.new-badge {
  background: #059669;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-actions button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.product-actions button:hover:not(:disabled) {
  background: #4f46e5;
  color: white;
}

.product-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-actions .in-wishlist {
  color: #dc2626;
}

.product-info {
  padding: 16px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.product-title-section h3 {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-title-section a {
  color: inherit;
  text-decoration: none;
}

.product-title-section a:hover {
  color: #4f46e5;
}

.variant-info {
  margin-top: 8px;
}

.variant-info > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.color-indicator-sm {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 12px 0;
  font-size: 12px;
  color: #6b7280;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  width: 12px;
  height: 12px;
}

.stars .filled {
  color: #f59e0b;
}

.stars .empty {
  color: #d1d5db;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.original-price {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
}

.save-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #4338ca;
}

.add-to-cart-btn.out-of-stock {
  background: #9ca3af;
  cursor: not-allowed;
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-list-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  overflow: hidden;
}

.list-item-content {
  display: flex;
}

.list-image {
  width: 200px;
  height: 200px;
  background: #f9fafb;
  flex-shrink: 0;
}

.list-image a {
  display: block;
  height: 100%;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-details {
  flex: 1;
  padding: 24px;
}

.list-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.list-details h3 a {
  color: inherit;
  text-decoration: none;
}

.list-details h3 a:hover {
  color: #4f46e5;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.color-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.list-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.list-actions {
  display: flex;
  gap: 12px;
}

.btn-add-cart {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-add-cart:hover:not(:disabled) {
  background: #4338ca;
}

.btn-add-cart.out-of-stock {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-wishlist {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-wishlist:hover:not(:disabled) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.btn-wishlist:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-wishlist .in-wishlist {
  color: #dc2626;
}

/* Pagination */
.pagination-container {
  margin-top: 48px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled):not(.active):not(.disabled) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.pagination-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.disabled {
  background: #f9fafb;
  cursor: default;
}

/* No Products */
.no-products {
  text-align: center;
  padding: 80px 20px;
}

.no-products i {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 24px;
}

.no-products h4 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.no-products p {
  color: #6b7280;
  margin-bottom: 24px;
}

.btn-clear-filters {
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-clear-filters:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .product-image {
    height: 200px;
  }
  
  .list-item-content {
    flex-direction: column;
  }
  
  .list-image {
    width: 100%;
    height: 200px;
  }
  
  .list-actions {
    flex-direction: column;
  }
  
  .topbar-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 576px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .shop-sidebar__box {
    padding: 16px;
  }
  
  .product-info {
    padding: 12px;
  }
}

/* Utility */
.no-scroll {
  overflow: hidden;
}
</style>