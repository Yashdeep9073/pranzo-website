<template>
  <header class="header">
    <div class="container">
      <nav class="header-inner">
        <!-- Logo with Category Dropdown --> 
        <div class="logo-section">
          <!-- Category Dropdown Component --> 
          <div class="category-dropdown-wrapper" v-if="!isMobile">
            <button 
              type="button"
              class="category-button"
              @click="toggleCategoryDropdown"
              @blur="onCategoryBlur"
              aria-label="Browse categories"
            > 
              <span class="category-icon-wrapper">
                <!-- Category icon -->
                <svg class="category-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </span>
              
              <span class="category-text">Browse Categories</span>
              
              <span class="dropdown-arrow" :class="{ 'rotate-180': showCategoryDropdown }">
                <svg viewBox="0 0 256 256" width="16" height="16">
                  <path fill="currentColor" d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
              </span>
            </button>

            <!-- Category Dropdown -->
            <div 
              v-if="showCategoryDropdown"
              class="category-dropdown"
              @mouseenter="keepCategoryDropdownOpen = true"
              @mouseleave="closeCategoryDropdown"
            >
              <div class="category-grid">
                <a
                  v-for="category in limitedCategories"
                  :key="category.id"
                  :href="getCategoryLink(category)"
                  class="category-card"
                  @click.prevent="handleCategoryDropdownClick(category)"
                >
                  <span class="category-card-icon">
                    <img 
                      :src="getCategoryImage(category)" 
                      :alt="category.name" 
                      class="category-card-image"
                      @error="handleImageError"
                    />
                  </span>
                  <span class="category-card-name">{{ category.name }}</span>
                </a>
              </div>
              
              <!-- View All Button (Optional) -->
              <div v-if="categories.length > 9" class="view-all-container">
                <NuxtLink 
                  to="/shop-all" 
                  class="view-all-button"
                  @click="closeCategoryDropdown"
                >
                  <span>View All Categories</span>
                  <svg viewBox="0 0 256 256" width="16" height="16">
                    <path fill="currentColor" d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"/>
                  </svg>
                </NuxtLink> 
              </div>
            </div>
          </div>
          
          <!-- Logo -->

         
          <div class="logo"> 
            <NuxtLink to="/" class="logo-link" aria-label="Market Pro Home">
              <img  
                :src="logoImage || '/assets/images/logo/favicon.png'"
                alt="Market Pro"
                class="logo-img"
                @error="handleLogoError"
              >
            </NuxtLink>
          </div>
          
          
        </div>
         <div class="mobile-search-triggeres" @click="openMobileSearch">
          <div class="mobile-search-placeholderes">
            <i class="search-icones"></i>
            <span>Search products...</span>
          </div>
        </div>
          <div class="mobile-search-triggeress" @click="openMobileSearch">
          <div class="mobile-search-placeholderess">
            <i class="search-icones"></i>
            <span>Search products...</span>
          </div>
        </div>
         <div class="mobile-search-wrapperr" @click="openMobileSearch">
    <!-- Search Icon -->
    <span class="icon left">
      <i class="ph ph-magnifying-glass"></i>
    </span>

    <!-- Placeholder -->
    <span class="placeholderr">
      Search...
    </span>

    <!-- Scan Icon -->
    <!-- <span class="icon right">
      <i class="ph ph-scan"></i>
    </span> -->
  </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" aria-label="Main navigation" v-if="!isMobile">
          <ul class="nav-list">
            <li 
              v-for="category in visibleCategories"
              :key="category.id"
              class="nav-item"
              @mouseenter="handleCategoryHover(category)"
              @mouseleave="handleCategoryLeave"
            >
              <NuxtLink
                :to="getCategoryLink(category)"
                class="nav-link"
                :class="{ 'active': isActiveCategory(category) }"
                @click="handleCategoryClick(category)"
                prefetch
              >
                {{ getCategoryName(category) }}
                <i 
                  v-if="hasSubCategories(category)" 
                  class="dropdown-icon"
                  :class="{ 'rotated': activeCategoryMenu === category.id }"
                ></i>
              </NuxtLink>
              
              <!-- Category Mega Menu here centered -->
              <div 
                v-if="activeCategoryMenu === category.id && hasSubCategories(category)"
                class="category-mega-menu"
                @mouseenter="keepMenuOpen"
                @mouseleave="closeCategoryMenu"
              >
                <div class="mega-menu-content">
                  <!-- Dynamic Subcategories - Equal Width Grid --> 
                  <template v-if="category.subCategories && category.subCategories.length > 0">
                    <div class="mega-grid">
                      <template v-for="subCategory in category.subCategories" :key="subCategory.id">
                        <div class="mega-column">
                          <!-- Sub Category -->
                          <NuxtLink
                            :to="getCategoryLink(subCategory)"
                            class="subcategory-title"
                            @click="handleSubCategoryClick"
                          >
                            {{subCategory.name}}
                          </NuxtLink>

                          <!-- Sub Sub Categories -->
                          <div
                            v-if="subCategory.subSubCategories?.length"
                            class="subsubcategory-list"
                          >
                            <NuxtLink
                              v-for="subSubCategory in subCategory.subSubCategories"
                              :key="subSubCategory.id"
                              :to="getCategoryLink(subSubCategory)"
                              class="subsubcategory-item"
                              @click="handleSubCategoryClick"
                            >
                              {{subSubCategory.name}}
                            </NuxtLink>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                  
                  <!-- Static Categories for Men (Equal Width Grid) -->
                  <template v-else-if="category.name.toLowerCase() === 'men'">
                    <div class="mega-grid static-categories">
                      <!-- Column structure remains the same -->
                      <div class="mega-column">
                        <h5 class="section-title">Topwear</h5>
                        <div class="category-items">
                          <NuxtLink 
                            to="/shop-all?category=T-Shirts" 
                            class="subcategory-item"
                            @click="handleSubCategoryClick"
                          >
                            T-Shirts
                          </NuxtLink>
                          <!-- Other items... -->
                        </div>
                      </div>
                      <!-- More columns... -->
                    </div>
                  </template>
                </div>
                
                <!-- Banner Section --> 
                <div class="category-banner">
                  <div class="banner-content">
                    <h4>{{ getBannerTitle(category) }}</h4>
                    <p>{{ getBannerSubtitle(category) }}</p>
                    <NuxtLink
                      :to="getCategoryLink(category)"
                      class="banner-button"     
                      @click="handleCategoryClick(category)" 
                    >
                      Shop Now
                    </NuxtLink>
                  </div> 
                </div> 
              </div> 
            </li> 
          </ul> 
        </nav>  

        <!-- Search Bar -->
        <div class="search-container" v-if="!isMobile">
          <div class="search-wrapper">
            <input 
              type="text"
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showSearchDropdown = true"
              @blur="onInputBlur"
              @keydown.enter="performSearch"
              class="search-input"
              placeholder="Search for products..."
              autocomplete="off"
              aria-label="Search products"
            >
            
            <div v-if="searchLoading" class="search-loading">
              <div class="spinner"></div>
            </div>
            
            <button
              type="button"
              @click="performSearch"
              class="search-button"
              :disabled="searchLoading"
              aria-label="Search"
            >
              <i class="search-icon"></i>
            </button>

            <!-- Search Results --> 
            <div
              v-if="showSearchDropdown && searchResults.length > 0"
              class="search-results"
            >
              <div class="results-header">
                <h6>Found {{ searchResults.length }} product{{ searchResults.length !== 1 ? 's' : '' }}</h6>
              </div>
              <div class="results-list">
                <div 
                  v-for="product in searchResults"
                  :key="product.id"
                  @click="selectProduct(product)"
                  @mousedown.prevent
                  class="product-result"
                >
                  <div class="product-image">
                    <img :src="getProductImage(product)" :alt="product.name">
                  </div>
                  <div class="product-info">
                    <h6>{{ product.name }}</h6>
                    <span class="product-price">₹{{ product.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Header Actions -->
        <div class="header-actions">
          <NuxtLink to="/profile" class="action-link" aria-label="Profile" v-if="!isMobile">
            <i class="action-icon profile"></i>
          </NuxtLink>
          
          <NuxtLink to="/wishlist" class="action-link" aria-label="Wishlist" v-if="!isMobile">
            <i class="action-icon heart"></i>
            <span v-if="wishlistCount > 0" class="action-badge">{{ wishlistCount }}</span>
          </NuxtLink>
           
          <NuxtLink to="/cart" class="action-link" aria-label="Cart" v-if="!isMobile">
            <i class="action-icon cart"></i>
            <span v-if="cartCount > 0" class="action-badge cart-badge" :class="{ 'pulse': badgePulse }">
              {{ cartCount }}
            </span>
          </NuxtLink>
          
          <button
            class="mobile-toggle"
            @click="toggleMobileMenu"
            aria-label="Toggle mobile menu"
            :aria-expanded="showMobileMenu"
            v-if="isMobile"
          >
            <i class="menu-icon"></i>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="showMobileMenu"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Mobile Menu -->
    <div
      v-if="showMobileMenu"
      class="mobile-menu"
      :class="{ 'active': showMobileMenu }"
    >
      <div class="mobile-header">
        <img
          src="/assets/images/logo/favicon.png"
          alt="Market Pro"
          class="mobile-logo"
        />
        <button @click="closeMobileMenu" class="mobile-close" aria-label="Close menu">
          <i class="close-icon"></i>
        </button>
      </div>
      
      <!-- Mobile Content --> 
      <div class="mobile-content">
        <!-- Mobile Search Trigger -->
        <div class="mobile-search-trigger" @click="openMobileSearch">
          <div class="mobile-search-placeholder">
            <i class="search-icon"></i>
            <span>Search products...</span>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="mobile-nav">
          <NuxtLink 
            v-for="category in categories" 
            :key="category.id"
            :to="getCategoryLink(category)"
            class="mobile-nav-item"
            @click="handleMobileCategoryClick"
          > 
            <div class="mobile-nav-icon">
              <img
                :src="getCategoryImage(category)"
                :alt="category.name"
                @error="handleImageError"
              >
            </div>
            <span>{{ category.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Full Screen Mobile Search Modal -->
    <div 
      v-if="showMobileSearchModal" 
      class="mobile-search-modal"
      :class="{ 'modal-active': showMobileSearchModal }"
    >
      <div class="mobile-search-header">
        <div class="mobile-search-input-wrapper">
          <button 
            @click="closeMobileSearch" 
            class="back-button"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          
          <input
            type="text"
            ref="mobileSearchInput"
            v-model="mobileSearchQuery"
            @input="handleMobileSearchInput"
            @keydown.enter="performMobileSearchSubmit"
            class="mobile-modal-search-input"
            placeholder="Search for products..."
            autocomplete="off"
            aria-label="Search products"
          >
          
          <button
            v-if="mobileSearchQuery"
            @click="clearMobileSearch"
            class="clear-button"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          <button
            type="button"
            @click="performMobileSearchSubmit"
            class="search-submit-button"
            :disabled="mobileSearchLoading"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        
        <div v-if="mobileSearchLoading" class="mobile-search-loading">
          <div class="mobile-spinner"></div>
          <span>Searching...</span>
        </div>
      </div>

      <!-- Search Results Content -->
      <div class="mobile-search-results">
        <!-- Recent Searches -->
        <div 
          v-if="!mobileSearchQuery && recentSearches.length > 0"
          class="recent-searches"
        >
          <div class="recent-header">
            <h6>Recent Searches</h6>
            <button 
              @click="clearRecentSearches" 
              class="clear-recent"
            >
              Clear
            </button>
          </div>
          <div class="recent-list">
            <div 
              v-for="search in recentSearches"
              :key="search"
              @click="selectRecentSearch(search)"
              class="recent-item"
            >
              <span>{{ search }}</span>
              <button @click.stop="removeRecentSearch(search)">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No Recent Searches -->
        <div v-else-if="!mobileSearchQuery && recentSearches.length === 0" class="initial-state">
          <svg viewBox="0 0 24 24" width="48" height="48" class="search-placeholder-icon">
            <path fill="#ddd" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <p>Search for products by name, category or description</p>
        </div>
        
        <!-- Loading State -->
        <div v-else-if="mobileSearchLoading" class="loading-state">
          <div class="mobile-spinner"></div>
          <p>Searching...</p>
        </div>
        
        <!-- No Results -->
        <div 
          v-else-if="mobileSearchQuery && !mobileSearchLoading && mobileSearchResults.length === 0"
          class="no-results"
        >
          <svg viewBox="0 0 24 24" width="48" height="48" class="no-results-icon">
            <path fill="#999" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <p>No products found for "{{ mobileSearchQuery }}"</p>
        </div>
        
        <!-- Search Results -->
        <div 
          v-else-if="mobileSearchResults.length > 0"
          class="mobile-results-list"
        >
          <div class="mobile-results-header">
            <h6>Found {{ mobileSearchResults.length }} product{{ mobileSearchResults.length !== 1 ? 's' : '' }}</h6>
          </div>
          
          <div class="mobile-products-list">
            <div 
              v-for="product in mobileSearchResults"
              :key="product.id"
              @click="selectMobileProduct(product)"
              class="mobile-product-result"
            >
              <div class="mobile-product-image">
                <img :src="getProductImage(product)" :alt="product.name" @error="handleProductImageError">
              </div>
              <div class="mobile-product-info">
                <h6>{{ product.name }}</h6>
                <p class="mobile-product-category">{{ product.category?.name || 'Uncategorized' }}</p>
                <span class="mobile-product-price">₹{{ formatPrice(product.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Bottom Navigation (Only on Mobile) -->
  <nav v-if="isMobile" class="mobile-bottom-nav">
    <NuxtLink 
      v-for="tab in mobileTabs"
      :key="tab.name"
      :to="tab.route"
      class="nav-item"
      :class="{ 'active': activeTab === tab.name }"
      @click="setActiveTab(tab.name)"
    >
      <div class="nav-icon-wrapper">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path :d="tab.icon" fill="currentColor" />
        </svg>
        <span v-if="tab.name === 'cart' && cartCount > 0" class="cart-badge">
          {{ cartCount > 99 ? '99+' : cartCount }}
        </span>
        <span v-if="tab.name === 'wishlist' && wishlistCount > 0" class="wishlist-badge">
          {{ wishlistCount > 99 ? '99+' : wishlistCount }}
        </span>
      </div>
      <span class="nav-label">{{ tab.label }}</span>
    </NuxtLink>
  </nav>

  <!-- Desktop Footer Navigation (Only on Desktop) -->
  <footer v-else class="desktop-footer-nav">
    <div class="footer-container">
      <div class="footer-content">
        <NuxtLink
          v-for="tab in desktopTabs"
          :key="tab.name"
          :to="tab.route"
          class="footer-item"
          :class="{ 'active': activeTab === tab.name }"
          @click="setActiveTab(tab.name)"
        >
          <div class="footer-icon-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path :d="tab.icon" fill="currentColor" />
            </svg>
            <span v-if="tab.name === 'cart' && cartCount > 0" class="cart-badge">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
            <span v-if="tab.name === 'wishlist' && wishlistCount > 0" class="wishlist-badge">
              {{ wishlistCount > 99 ? '99+' : wishlistCount }}
            </span>
          </div>
          <span class="footer-label">{{ tab.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from '#imports'
const config = useRuntimeConfig() 
const API_URL = config.public.api.MEDIA_API_URL
const router = useRouter()
const route = useRoute()

// ==================== HEADER STATE ====================
const searchQuery = ref('')
const searchLoading = ref(false)
const searchResults = ref([])
const showSearchDropdown = ref(false)
const showMobileMenu = ref(false)
const showMobileSearchModal = ref(false)
const mobileSearchQuery = ref('')
const mobileSearchResults = ref([])
const mobileSearchLoading = ref(false)
const wishlistCount = ref(0)
const cartCount = ref(0)
const badgePulse = ref(false)
const logoImage = ref('')
const activeCategoryMenu = ref(null)
const categories = ref([])
const categoryMenuTimeout = ref(null)
const isMobile = ref(false)
const recentSearches = ref([])
const mobileSearchController = ref(null)

// New State Variables for Category Dropdown
const showCategoryDropdown = ref(false)
const keepCategoryDropdownOpen = ref(false)

// ==================== BOTTOM NAV STATE ====================
const activeTab = ref('home')

// Tab configurations
const mobileTabs = [
  {
    name: 'home',
    label: 'Home',
    route: '/',
    icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
  },
  {
    name: 'categories',
    label: 'Categories',
    route: '/shop-all',
    icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
  },
  {
    name: 'cart',
    label: 'Cart',
    route: '/cart',
    icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 2h10l-1.2 10h-7.6L7 2zm0 12h10v2H7v-2z'
  },
  {
    name: 'wishlist',
    label: 'Wishlist',
    route: '/wishlist',
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54z'
  },
  {
    name: 'account',
    label: 'Account',
    route: '/profile',
    icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z'
  }
]

const desktopTabs = [
  {
    name: 'home',
    label: 'Home',
    route: '/',
    icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
  },
  {
    name: 'categories',
    label: 'Shop',
    route: '/categories',
    icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
  },
  {
    name: 'cart',
    label: 'Cart',
    route: '/cart',
    icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 2h10l-1.2 10h-7.6L7 2zm0 12h10v2H7v-2z'
  },
  {
    name: 'wishlist',
    label: 'Wishlist',
    route: '/wishlist',
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54z'
  },
  {
    name: 'account',
    label: 'Account',
    route: '/account',
    icon: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z'
  }
]

// Computed
const visibleCategories = computed(() => {
  return categories.value.slice(0, 6) // Limit to 6 categories for better UX
})
const limitedCategories = computed(() => {
  // Only show first 9 categories
  return categories.value.slice(0, 9);
});

// Utility Functions
const debounce = (fn, delay) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const throttle = (fn, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// ==================== CART SYSTEM ====================
const cartManager = {
  getCart() {
    try {
      const cart = localStorage.getItem('shopping_cart')
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  },

  getWishlist() {
    try {
      const wishlist = localStorage.getItem('wishlist')
      return wishlist ? JSON.parse(wishlist) : []
    } catch {
      return []
    }
  },

  calculateCartCount() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + (item.quantity || 1), 0)
  },

  calculateWishlistCount() {
    return this.getWishlist().length
  },

  updateCounts() {
    cartCount.value = this.calculateCartCount()
    wishlistCount.value = this.calculateWishlistCount()
  }
}

// ==================== BOTTOM NAV FUNCTIONS ====================
const setActiveTab = (tabName) => {
  activeTab.value = tabName
}

const updateActiveTabFromRoute = () => {
  const path = route.path
  
  if (path === '/') {
    activeTab.value = 'home'
  } else if (path.includes('/categories') || path.includes('/shop-all')) {
    activeTab.value = 'categories'
  } else if (path.includes('/cart')) {
    activeTab.value = 'cart'
  } else if (path.includes('/wishlist')) {
    activeTab.value = 'wishlist'
  } else if (path.includes('/account') || path.includes('/profile')) {
    activeTab.value = 'account'
  }
}
// watch(
//   () => store.isOpen,
//   (isOpen) => {
//     if (isOpen) {  
//       openMobileSearch()
//     } else {
//       closeMobileSearch()
//     }
//   }
// ) 
// ==================== MOBILE SEARCH FUNCTIONS ====================
const openMobileSearch = () => {
  showMobileSearchModal.value = true
  document.body.style.overflow = 'hidden'
  loadRecentSearches()
  // Focus input after modal opens
  setTimeout(() => {
    if (mobileSearchInput.value) {
      mobileSearchInput.value.focus()
    }
  }, 100)
} 

const closeMobileSearch = () => {
  showMobileSearchModal.value = false
  mobileSearchQuery.value = ''
  mobileSearchResults.value = []
  document.body.style.overflow = ''
  
  // Abort any ongoing search
  if (mobileSearchController.value) {
    mobileSearchController.value.abort()
    mobileSearchController.value = null
  }
}

const clearMobileSearch = () => {
  mobileSearchQuery.value = ''
  mobileSearchResults.value = []
}

const loadRecentSearches = () => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved)
    } catch (e) {
      recentSearches.value = []
    }
  }
}

const saveRecentSearches = () => {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const addToRecentSearches = (query) => {
  if (!query.trim()) return
  
  // Remove if already exists
  recentSearches.value = recentSearches.value.filter(s => s.toLowerCase() !== query.toLowerCase())
  // Add to beginning
  recentSearches.value.unshift(query.trim())
  // Keep only last 5 searches
  recentSearches.value = recentSearches.value.slice(0, 5)
  saveRecentSearches()
}

const clearRecentSearches = () => {
  recentSearches.value = []
  saveRecentSearches()
}

const removeRecentSearch = (search) => {
  recentSearches.value = recentSearches.value.filter(s => s !== search)
  saveRecentSearches()
}

const selectRecentSearch = (search) => {
  mobileSearchQuery.value = search
  performMobileSearch()
}

const performMobileSearch = debounce(async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    mobileSearchResults.value = []
    mobileSearchLoading.value = false
    return
  }

  // Abort previous request if exists
  if (mobileSearchController.value) {
    mobileSearchController.value.abort()
  }

  mobileSearchController.value = new AbortController()
  mobileSearchLoading.value = true

  try {
    const response = await fetch(
      'https://kartmania-api.vibrantick.org/common/product/read',
      { 
        signal: AbortSignal.timeout(3000)
      }
    )
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const result = await response.json()
    const products = result.data || []
    
    const queryLower = searchTerm.toLowerCase()
    const filtered = products.filter(product => 
      product.name?.toLowerCase().includes(queryLower) ||
      product.description?.toLowerCase().includes(queryLower) ||
      product.category?.name?.toLowerCase().includes(queryLower)
    )
    mobileSearchResults.value = filtered.slice(0, 8)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Mobile search failed:', error)
      mobileSearchResults.value = []
    }
  } finally {
    mobileSearchLoading.value = false
    mobileSearchController.value = null
  }
}, 300)

const handleMobileSearchInput = debounce(() => {
  if (mobileSearchQuery.value.trim()) {
    performMobileSearch(mobileSearchQuery.value)
  } else {
    mobileSearchResults.value = []
    mobileSearchLoading.value = false
  }
}, 300)

const performMobileSearchSubmit = () => {
  if (mobileSearchQuery.value.trim()) {
    addToRecentSearches(mobileSearchQuery.value)
    performMobileSearch(mobileSearchQuery.value)
  }
}

const selectMobileProduct = (product) => {
  addToRecentSearches(mobileSearchQuery.value)
  closeMobileSearch()
  router.push(`/shop-all/${product.name}--${product.groupId}`)
}

const formatPrice = (price) => {
  if (!price) return '0'
  return parseFloat(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const handleProductImageError = (event) => {
  event.target.src = '/assets/images/thumbs/placeholder.png'
}

// ==================== INITIALIZATION ====================
const initialize = () => {
  // Check mobile
  isMobile.value = window.innerWidth < 1024
  window.addEventListener('resize', handleResize)
  
  // Fetch data
  fetchLogo()
  fetchCategories()
  
  // Setup cart system
  setupCartSystem()
  
  // Initialize counts
  cartManager.updateCounts()
  
  // Load recent searches
  loadRecentSearches()
  
  // Update active tab based on current route
  updateActiveTabFromRoute()
}

const handleResize = throttle(() => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    showCategoryDropdown.value = false
    keepCategoryDropdownOpen.value = false
  }
}, 200)

// ==================== CART EVENT SYSTEM ====================
const setupCartSystem = () => {
  // Storage event
  const handleStorage = (e) => {
    if (e.key === 'shopping_cart' || e.key === 'wishlist') {
      cartManager.updateCounts()
    }
  }

  // Custom events
  const handleCartEvent = () => cartManager.updateCounts()
  const handleWishlistEvent = () => wishlistCount.value = cartManager.calculateWishlistCount()

  // Polling
  let lastCart = ''
  let lastWishlist = ''
  
  const poll = () => {
    const currentCart = JSON.stringify(cartManager.getCart())
    const currentWishlist = JSON.stringify(cartManager.getWishlist())
    
    if (currentCart !== lastCart) {
      lastCart = currentCart
      cartManager.updateCounts()
    }
    
    if (currentWishlist !== lastWishlist) {
      lastWishlist = currentWishlist
      wishlistCount.value = cartManager.getWishlist().length
    }
  }

  // Setup
  window.addEventListener('storage', handleStorage) 
  window.addEventListener('cart-updated', handleCartEvent)
  window.addEventListener('wishlist-updated', handleWishlistEvent)
  
  const interval = setInterval(poll, 1000)

  // Return cleanup
  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener('cart-updated', handleCartEvent)
    window.removeEventListener('wishlist-updated', handleWishlistEvent)
    clearInterval(interval)
  }
}

// ==================== CATEGORIES ====================
const fetchCategories = async () => {
  try {
    const response = await fetch(
      'https://kartmania-api.vibrantick.org/common/product-category/read',
      { signal: AbortSignal.timeout(5000) }
    )
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const data = await response.json()
    categories.value = data.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  }
}

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

const getCategoryName = (category) => {
  return category.name.toUpperCase()
}

const hasSubCategories = (category) => {
  return (category.subCategories?.length > 0) || 
         ['men', 'women'].includes(category.name.toLowerCase())
}

const getCategoryLink = (category) => {
  return `/shop-all?category=${encodeURIComponent(category.name)}`
}

const isActiveCategory = (category) => {
  return route.query.category === category.name
}

const getCategoryImage = (category) => {
  return category.logo || category.image || '/assets/images/category-placeholder.png'
}  
const getBannerTitle = (category) => {
  const name = category.name
  if (name.includes('Men')) return "MEN'S COLLECTION" 
  if (name.includes('Women')) return "WOMEN'S FASHION"  
  return "EXCLUSIVE COLLECTION"
}
const getBannerSubtitle = (category) => {
  const name = category.name
  if (name.includes('Men')) return 'Trending styles for men'
  if (name.includes('Women')) return 'Latest fashion trends'
  return 'Shop the best products'
}

// ==================== CATEGORY DROPDOWN FUNCTIONS ====================
const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
  keepCategoryDropdownOpen.value = showCategoryDropdown.value
  
  // Close other dropdowns when this opens
  if (showCategoryDropdown.value) {
    showSearchDropdown.value = false
    activeCategoryMenu.value = null
  }
}

const closeCategoryDropdown = () => {
  keepCategoryDropdownOpen.value = false
  setTimeout(() => {
    if (!keepCategoryDropdownOpen.value) {
      showCategoryDropdown.value = false
    }
  }, 10)
}
const onCategoryBlur = () => {
  setTimeout(() => {
    if (!keepCategoryDropdownOpen.value) {
      showCategoryDropdown.value = false
    }
  }, 100)
}

const handleCategoryDropdownClick = (category) => {
  showCategoryDropdown.value = false
  keepCategoryDropdownOpen.value = false
  router.push(getCategoryLink(category))
}

// ==================== MENU MANAGEMENT ====================
const handleCategoryHover = throttle((category) => {
  if (categoryMenuTimeout.value) clearTimeout(categoryMenuTimeout.value)
  if (hasSubCategories(category)) {
    activeCategoryMenu.value = category.id
  }
}, 10)

const handleCategoryLeave = throttle(() => {
  categoryMenuTimeout.value = setTimeout(() => {
    activeCategoryMenu.value = null
  }, 200)
}, 100)

const keepMenuOpen = () => {
  if (categoryMenuTimeout.value) clearTimeout(categoryMenuTimeout.value)
}

const closeCategoryMenu = () => {
  if (categoryMenuTimeout.value) clearTimeout(categoryMenuTimeout.value)
  activeCategoryMenu.value = null
}

const closeAllMenus = () => {
  showCategoryDropdown.value = false
  keepCategoryDropdownOpen.value = false
  closeCategoryMenu()
  showSearchDropdown.value = false
  showMobileMenu.value = false
  enableBodyScroll()
}

// ==================== SCROLL MANAGEMENT FUNCTIONS ====================
const disableBodyScroll = () => {
  const scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
  sessionStorage.setItem('scrollPosition', scrollY)
}

const enableBodyScroll = () => {
  if (document.body.style.position === 'fixed') {
    const scrollY = parseInt(document.body.style.top || '0') * -1
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    
    window.scrollTo(0, scrollY)
    sessionStorage.removeItem('scrollPosition')
  }
}

// ==================== CLICK HANDLERS ====================
const handleCategoryClick = (category) => {
  closeAllMenus()
  enableBodyScroll()
  window.scrollTo(0, 0)
  sessionStorage.removeItem('scrollPosition')
}

const handleSubCategoryClick = () => {
  closeAllMenus()
  enableBodyScroll()
  window.scrollTo(0, 0)
  sessionStorage.removeItem('scrollPosition')
}

const handleMobileCategoryClick = () => {
  closeMobileMenu()
  enableBodyScroll()
  window.scrollTo(0, 0)
  sessionStorage.removeItem('scrollPosition')
}

// ==================== DESKTOP SEARCH ====================
const performSearch = debounce(async (query) => {
  const searchTerm = query || searchQuery.value
  
  if (!searchTerm.trim()) {
    searchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    const response = await fetch(
      'https://kartmania-api.vibrantick.org/common/product/read',
      { signal: AbortSignal.timeout(3000) }
    )
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const result = await response.json()
    const products = result.data || []
    
    const queryLower = searchTerm.toLowerCase()
    const filtered = products.filter(product => 
      product.name?.toLowerCase().includes(queryLower) ||
      product.description?.toLowerCase().includes(queryLower) ||
      product.category?.name?.toLowerCase().includes(queryLower)
    )
    
    searchResults.value = filtered.slice(0, 8)
    showSearchDropdown.value = true
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Search failed:', error)
      searchResults.value = []
    }
  } finally {
    searchLoading.value = false
  }
}, 300)

const handleSearchInput = debounce(() => {
  performSearch(searchQuery.value)
}, 300)

const selectProduct = (product) => {
  showSearchDropdown.value = false
  searchQuery.value = ''
  window.scrollTo(0, 0)
  router.push(`/shop-all/${product.name}--${product.groupId}`)
}

// ==================== MOBILE MENU ====================
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    disableBodyScroll()
  } else {
    enableBodyScroll()
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  enableBodyScroll()
}

// ==================== UTILITIES ====================
const onInputBlur = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 150)
}

const handleLogoError = (e) => {
  e.target.src = '/assets/images/logo/favicon.png'
}

const handleImageError = (e) => {
  e.target.src = '/assets/images/placeholder.jpg'
}

const getProductImage = (product) => {
  if (product.images?.length > 0) {
    const primary = product.images.find(img => img.isPrimary)
    return primary?.imageUrl || product.images[0]?.imageUrl
  }
  return '/assets/images/thumbs/placeholder.png'
}

// ==================== LIFECYCLE ====================
let cleanupCartSystem = null

onMounted(() => {
  initialize()
  cleanupCartSystem = setupCartSystem()
  
  const savedScrollPosition = sessionStorage.getItem('scrollPosition')
  if (savedScrollPosition) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedScrollPosition))
      sessionStorage.removeItem('scrollPosition')
    }, 100)
  }
  
  // Click outside handler
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.category-dropdown-wrapper') && 
        !e.target.closest('.search-wrapper') && 
        !e.target.closest('.search-results') &&
        !e.target.closest('.category-mega-menu')) {
      showSearchDropdown.value = false
      if (!e.target.closest('.nav-item')) {
        closeCategoryMenu()
      }
      if (!e.target.closest('.category-dropdown-wrapper')) {
        showCategoryDropdown.value = false
        keepCategoryDropdownOpen.value = false
      }
    }
  })
})

onUnmounted(() => {
  if (categoryMenuTimeout.value) clearTimeout(categoryMenuTimeout.value)
  if (cleanupCartSystem) cleanupCartSystem()
  window.removeEventListener('resize', handleResize)
  enableBodyScroll()
})

// Watch route changes 
watch(() => route.path, () => {
  enableBodyScroll()
  closeAllMenus()
  closeMobileSearch()
  updateActiveTabFromRoute()
})
</script>

<style scoped>
  .mobile-search-triggeress {
  display: none;
}
@media (max-width: 530px){
 
 .mobile-search-triggeress {
    display: block;
    width: 60%;
    max-width: 100%;
    border: #bdb6b6 1px solid;
    border-radius: 9px;
  }

  .mobile-search-placeholderess {
    display: flex;
    align-items: center;
    gap: 0px;
    width: 100%;
    padding: 3px 9px;
    border-radius: 9px;
    background: #f5f5f5;
    color: rgb(58, 58, 58);
    white-space: nowrap;   
    overflow: hidden;        
  }

  .mobile-search-placeholderess span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
  }
}
@media (max-width: 380px) {
  .mobile-search-triggeress {
    display: block;
    width: 40%;
    max-width: 100%;
    border: #bdb6b6 1px solid;
    border-radius: 9px;
  }

  .mobile-search-placeholderess {
    display: flex;
    align-items: center;
    gap: 0px;
    width: 100%;
    padding: 3px 9px;
    border-radius: 9px;
    background: #f5f5f5;
    color: rgb(58, 58, 58);
    white-space: nowrap;   
    overflow: hidden;        
  }

  .mobile-search-placeholderess span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    
  }
}

/* Category Dropdown Styles */ 
.mobile-search-wrapperr {
  display: none;
  align-items: center;
  gap: 10px;
  background: #f1f1f1;
  border-radius: 12px;
  height: 44px;
  padding: 0 12px;
  cursor: pointer;
  user-select: none;
}

/* Placeholder text */
/* .mobile-search-wrapper .placeholder {
  flex: 1;
  font-size: 14px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} */

/* Icons */
/* .mobile-search-wrapper .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
}

.mobile-search-wrapper .icon.right {
  border-left: 1px solid #ddd;
  padding-left: 10px;
} */

/* Hover / active */
/* .mobile-search-wrapper:active {
  background: #e6e6e6;
} */  
 .mobile-search-triggeres{
  display: none;
 }
@media (max-width: 325px) {
  .mobile-search-triggeress{
    display: none;
  }
  .logo {
  flex-shrink: 0;
}
  .mobile-search-wrapperr {
    max-width: 400px;
    min-width: 105px;
    height: 40px;
    margin-left: 25px;
  } 
  .mobile-search-triggeres{
      display: none;
     }
  .mobile-search-wrapperr .placeholder {
    font-size: 13px;
  } 
  .mobile-search-wrapperr {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #e6e6e6;
  /* background: #f1f1f1; */
  border-radius: 12px;
  height: 35px;
  cursor: pointer;
  user-select: none;
}

/* Placeholder text */
.mobile-search-wrapperr .placeholderr {
  flex: 1;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 425px) {
  .mobile-search-wrapperr {
    max-width: 400px;
    min-width: 105px;
    height: 40px;
    margin-left: 25px;
  }
   .mobile-search-triggeres{
      display: none;
     } 
  .mobile-search-wrapperr .placeholder {
    font-size: 13px;
  } 
  .mobile-search-wrapperr {
  display: flex;
  align-items: center;
  gap: 10px;
background-color: #e6e6e6;
  background: #f1f1f1;
  border-radius: 12px;
  height: 30px;
  cursor: pointer;
  user-select: none;
}

.mobile-search-wrapperr .placeholderr {
  flex: 1;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}}

 
/* Icons */
.mobile-search-wrapperr .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #000000;
}

.mobile-search-wrapperr .icon.right {
  border-left: 1px solid #ddd;
  padding-left: 10px;
}

/* Hover / active */
.mobile-search-wrapperr:active {
  background: #ffffff;
}
}
.view-all-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: black;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.view-all-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
}

.view-all-button svg {
  transition: transform 0.3s ease;
}

.view-all-button:hover svg {
  transform: translateX(4px);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-dropdown-wrapper {
  position: relative;
  width: 200px;
  display: flex;
  z-index: 100;
}
               
.category-button {
  width: auto;
  background: linear-gradient(135deg, #02870b 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.7rem 0.7rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.category-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-text {
  flex: 1;
  text-align: left;
  margin-left: 0.5rem;
}

.dropdown-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Category Dropdown */
.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  width: 400px;
  max-width: 400px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-in-out;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.category-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(233, 236, 241, 0.1);
  transform: translateY(-2px);
}

.category-card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.category-card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category-card-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  line-height: 1.2;
}

/* Scrollbar Styling for Category Dropdown */
.category-grid::-webkit-scrollbar {
  width: 4px;
}

.category-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.category-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.category-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

/* Base Header Styles */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 60px;
}
.container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 1.5rem;
}

/* Logo */
/* .logo {
  flex-shrink: 0;
} */

.logo-link {
  display: flex;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

/* Desktop Navigation */
.desktop-nav {
  flex: 1;
  position: relative;
}

.nav-list {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.nav-item {
  position: static;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 0;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  color: #057cb3;
}

.nav-link.active {
  color: #057cb3;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #057cb3;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%236b7280' d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  transition: transform 0.2s;
  display: inline-block;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}
/* Category Mega Menu */
.category-mega-menu {
  position: fixed;
  top: 53px;
  left: 50%;
  transform: translateX(-50%);
  width: min(1200px, 95vw);
  max-width: calc(100vw - 40px);
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  z-index: 9999;
  border: 1px solid #e5e7eb;
  border-top: 2px solid #057cb3;
  padding: 0;
  display: flex;
  gap: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.nav-item:hover .category-mega-menu {
  opacity: 1;
  visibility: visible;
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.mega-menu-content {
  flex: 1;
  max-height: 500px;
  overflow-y: auto;
}

/* Dropdown Grid System - Equal Width Columns */
.mega-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 32px;
  max-height: 420px;
  max-width: 1200px;
  overflow-y: auto;
  padding: 20px 24px;
}

.mega-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Section Titles */
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #e5e7eb;
}

/* Subcategory Titles */
.subcategory-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
  color: #111827;
  padding: 4px 0;
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  border-radius: 4px;
}

.subcategory-title:hover {
  color: #2563eb;
  background: #f0f9ff;
  padding-left: 8px;
}

/* Category Items Container */
.category-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

/* Subcategory Items */
.subcategory-item {
  font-size: 13px;
  color: #4b5563;
  padding: 3px 0;
  text-decoration: none;
  transition: all 0.2s;
  line-height: 1.4;
  border-radius: 3px;
  padding-left: 8px;
}

.subcategory-item:hover {
  color: #2563eb;
  background: #f8fafc;
  padding-left: 12px;
}

/* Sub-subcategory List */
.subsubcategory-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 2px;
  margin-bottom: 8px;
}

.subsubcategory-item {
  font-size: 13px;
  color: #6b7280;
  padding: 2px 0;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  border-radius: 3px;
}

.subsubcategory-item:hover {
  color: #2563eb;
  background: #f8fafc;
}

.subsubcategory-item:hover::before {
  color: #2563eb;
}

/* Divider */
.header-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
  width: 100%;
}

/* Category Banner */
.category-banner {
  width: 280px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #bae6fd;
  flex-shrink: 0;
  margin: 1.5rem;
}

.banner-content {
  text-align: center;
  color: #0c4a6e;
}

.banner-content h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.banner-content p {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.banner-button {
  display: inline-block;
  background: #0ea5e9;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.banner-button:hover {
  background: #0284c7;
  transform: translateY(-1px);
}

/* Search */
.search-container {
  flex: 1;
  max-width: 400px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.625rem 3rem 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-loading {
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 18px;
  height: 18px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%236b7280' d='M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
}

.search-button:hover .search-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%232563eb' d='M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z'%3E%3C/path%3E%3C/svg%3E");
}

/* Search Results */
.search-results {
  scrollbar-width: none;
  overscroll-behavior: contain;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1001;
  max-height: 400px;
  overflow-y: auto;
}

.results-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.results-header h6 {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.results-list {
  padding: 0.5rem;
}

.product-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.product-result:hover {
  background-color: #f9fafb;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h6 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: #059669;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.action-link:hover {
  background-color: #f3f4f6;
}

.action-icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
}

.action-icon.profile {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23374151' d='M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z'%3E%3C/path%3E%3C/svg%3E");
}

.action-icon.heart {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23374151' d='M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z'%3E%3C/path%3E%3C/svg%3E");
}

.action-icon.cart {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23374151' d='M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42a27.75,27.75,0,1,0,16.8-8H82.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z'%3E%3C/path%3E%3C/svg%3E");
}

.action-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  background: #ef4444;
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.cart-badge.pulse {
  animation: badgePulse 0.5s ease;
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-toggle:hover {
  background-color: #f3f4f6;
}

.menu-icon {
  width: 24px;
  height: 24px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23374151' d='M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z'%3E%3C/path%3E%3C/svg%3E");
}

/* Mobile Menu */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu.active {
  right: 0;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-logo {
  height: 30px;
  width: auto;
}

.mobile-close {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 24px;
  height: 24px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23374151' d='M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Mobile Search Trigger */ 
.mobile-search-trigger {
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.mobile-search-placeholder {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.mobile-search-placeholder:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.mobile-search-placeholder .search-icon {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.mobile-search-placeholder span {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  color: #374151;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.mobile-nav-item:hover {
  background-color: #f3f4f6;
}

.mobile-nav-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.mobile-nav-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Full Screen Mobile Search Modal */
.mobile-search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 2000;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-search-modal.modal-active {
  transform: translateY(0);
}

.mobile-search-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  z-index: 1001;
}

.mobile-search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 8px 12px;
}

.back-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button svg {
  color: #333;
}

.mobile-modal-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  padding: 4px 0;
  color: #333;
}

.clear-button {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button svg {
  color: #666;
}

.search-submit-button {
  background: #0357b1;
  border: none;
  border-radius: 6px;
  position: absolute;
  bottom: 14px;
  right: 2px;
  width: 40px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.search-submit-button:hover {
  background: #0056b3;
}

.search-submit-button svg {
  color: white;
}

.mobile-search-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: #666;
  font-size: 14px;
}

.mobile-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Search Results Content */
.mobile-search-results {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Recent Searches */
.recent-searches {
  margin-bottom: 24px;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recent-header h6 {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 600;
}

.clear-recent {
  background: none;
  border: none;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 500;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.recent-item:hover {
  background: #f0f0f0;
}

.recent-item span {
  font-size: 14px;
  color: #333;
}

.recent-item button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-item button:hover {
  opacity: 1;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-state .mobile-spinner {
  margin-bottom: 16px;
}

.loading-state p {
  color: #666;
  font-size: 14px;
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.no-results-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results p {
  color: #666;
  font-size: 16px;
  max-width: 300px;
  line-height: 1.4;
}

/* Initial State */
.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.search-placeholder-icon {
  margin-bottom: 16px;
  opacity: 0.3;
}

.initial-state p {
  color: #999;
  font-size: 16px;
  max-width: 300px;
  line-height: 1.4;
}

/* Search Results List */
.mobile-results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-results-header {
  margin-bottom: 8px;
}

.mobile-results-header h6 {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 600;
}

.mobile-products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-product-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-product-result:hover {
  background-color: #f9f9f9;
}

.mobile-product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
}

.mobile-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-product-info {
  flex: 1;
}

.mobile-product-info h6 {
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.mobile-product-category {
  font-size: 12px;
  color: #666;
  margin: 2px 0 6px 0;
  display: block;
}

.mobile-product-price {
  font-size: 14px;
  font-weight: 700;
  color: #007bff;
}

/* ==================== BOTTOM NAVIGATION STYLES ==================== */

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width:100%;
  height:70px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(49, 146, 236, 0.08);
  z-index: 999;
  /* padding: 8px 0; */
}

.mobile-bottom-nav .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6b7280;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
  /* max-width: 80px; */
}

.mobile-bottom-nav .nav-item:hover {
  background-color: #f9fafb;
}

.mobile-bottom-nav .nav-item.active {
  color: #024787;
}

.mobile-bottom-nav .nav-icon-wrapper {
  position: relative;
  margin-bottom: 2.7px;
}

.mobile-bottom-nav .nav-icon-wrapper svg {
  display: block;
}

.mobile-bottom-nav .nav-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

/* Desktop Footer Navigation */
/* .desktop-footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  z-index: 999;
} */

/* .footer-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  padding: 0 20px;
} */

.footer-content {
  
  display: none;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

/* .desktop-footer-nav .footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6b7280;
  padding: 12px 20px;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  min-width: 100px;
} */

/* .desktop-footer-nav .footer-item:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
}

.desktop-footer-nav .footer-item.active {
  color: #02870b;
  background: linear-gradient(to top, rgba(2, 135, 11, 0.1), transparent);
  font-weight: 600;
} */

/* .desktop-footer-nav .footer-item.active .footer-icon-wrapper svg {
  transform: scale(1.1);
}

.desktop-footer-nav .footer-icon-wrapper {
  position: relative;
  margin-bottom: 6px;
}

.desktop-footer-nav .footer-icon-wrapper svg {
  display: block;
  transition: transform 0.3s ease;
} */

/* .desktop-footer-nav .footer-label {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
} */

/* Badges */
.cart-badge,
.wishlist-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
  animation: badgePulse 0.5s ease;
}

.wishlist-badge {
  background: #f59e0b;
}

/* Responsive */
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .search-container {
    flex: 1;
    max-width: none;
    margin: 0 1rem;
  }
  
  .category-mega-menu {
    display: none !important;
  }
  
  .category-dropdown-wrapper {
    display: none;
  }
  
  /* Hide desktop footer on mobile */
  .desktop-footer-nav {
    display: none;
  }
  
  /* Show mobile bottom nav on mobile */
  .mobile-bottom-nav {
    display: flex;
  }
}

@media (min-width: 1025px) {
  /* Hide mobile bottom nav on desktop */
  .mobile-bottom-nav {
    display: none;
  }
  
  /*Show desktop footer on desktop*/
  .desktop-footer-nav {
    display: block;
  } 
}

 @media (max-width: 769px)  {
  .mobile-search-triggeres {
    display: block;
    position: absolute;
    right: 60px;
    width: 100%;         
    max-width: 300px;    
    min-width: 160px;   
    border: 1px solid rgb(172, 172, 172);
    border-radius: 7px; 
  }


  .mobile-search-placeholderes{
    color: rgb(61, 61, 61);
    padding: 6px;
  }
  .header-inner {
    gap: 1rem;
  }
  
  .logo-img {
    height: 32px;
  }
  
  .search-container {
    margin: 0 0.5rem;
  }
  
  .search-input {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .action-link {
    width: 36px;
    height: 36px;
  }
  
  .action-icon {
    width: 18px;
    height: 18px;
  }
  
  .mobile-menu {
    width: 100%;
    max-width: 320px;
  }
  
  .mobile-nav {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .mobile-bottom-nav {
    height: 65px;
    padding: 6px 0;
  }
  
  .mobile-bottom-nav .nav-item {
    padding: 6px 8px;
    max-width: 70px;
  }
  
  .mobile-bottom-nav .nav-label {
    font-size: 10px;
  }
  
  .cart-badge,
  .wishlist-badge {
    min-width: 16px;
    height: 16px;
    font-size: 9px;
    top: -6px;
    right: -6px;
  }
} 

@media (max-width: 530px) {
  .container {
    padding: 0 0.75rem;
  }
  .mobile-search-triggeres{
    display: none;
  }
  .logo-img {
    height: 28px;
  }
  
  .search-container {
    display: block;
  }
  
  .header-actions {
    gap: 0.25rem;
  }
  
  .action-link {
    width: 32px;
    height: 32px;
  }
  
  .action-badge {
    min-width: 14px;
    height: 14px;
    font-size: 8px;
  }
  
  .mobile-nav {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .mobile-nav-item {
    padding: 0.75rem 0.25rem;
  }
  
  .mobile-nav-icon {
    width: 36px;
    height: 36px;
  }
  
  .mobile-bottom-nav {
    height: 60px;
  }
  
  .mobile-bottom-nav .nav-item {
    padding: 4px 6px;
  }
  
  .mobile-bottom-nav .nav-label {
    font-size: 9px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .footer-container {
    max-width: 700px;
  }
  
  .desktop-footer-nav .footer-item {
    padding: 10px 16px;
    min-width: 90px;
  }
  
  .desktop-footer-nav .footer-label {
    font-size: 12px;
  }
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-bottom-nav {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    height: calc(70px + env(safe-area-inset-bottom));
  }
}
</style>