<template>
  <header class="header bg-white border-bottom-0 box-shadow-3xl py-10 z-2">
    <div class="container container-lg">
      <nav class="header-inner d-flex justify-content-between gap-8">
        <div class="flex-align menu-category-wrapper position-relative">
          <!-- Category Dropdown Start -->
          <div class="position-relative">
            <button 
              type="button" 
              class="category-button d-flex align-items-center gap-12 text-white bg-black px-20 py-16 rounded-6 hover-bg-success-700 transition-2"
              @click="toggleDropdown"
              :disabled="loadingCategories"
            >
              <span class="text-xl line-height-1"><i class="ph ph-squares-four"></i></span>
              <span class="">{{ loadingCategories ? 'Loading...' : 'Browse Categories' }}</span>
              <span class="line-height-1 icon transition-2">
                <i :class="['ph', showDropdown ? 'ph-caret-up' : 'ph-caret-down', 'ph-bold']"></i>
              </span>
            </button>

            <!-- Dropdown Start --> 
            <div 
              v-if="showDropdown" 
              ref="dropdownRef"
              class="category-dropdown border border-gray-200 bg-white p-16 rounded-8 shadow-lg w-100 max-w-800 position-absolute top-100 start-0 mt-8 z-9999"
              style="display: block;"
              @click.stop
            >
              <!-- Loading State -->
              <div v-if="loadingCategories" class="text-center py-40">
                <div class="spinner-border text-main-600" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-16 text-gray-600">Loading categories...</p>
              </div>
              
              <!-- Categories Grid -->
              <div v-else-if="categories.length > 0" class="categories-grid">
                <!-- All Categories -->
                <NuxtLink 
                  to="/product/shop-all"
                  class="category-card all-categories"
                  @click="closeDropdown"
                >
                  <div class="category-icon">
                    <i class="ph ph-grid-nine"></i>
                  </div>
                  <span class="category-name">All Categories</span>
                  <span class="product-count">({{ totalProductsCount }})</span>
                </NuxtLink>
                
                <!-- Categories List -->
                <div 
                  v-for="category in categories" 
                  :key="category.id"
                  class="category-card-wrapper"
                >
                  <NuxtLink 
                    :to="`/product/category/${category.id}`" 
                    class="category-card"
                    @click="closeDropdown"
                  >
                    <div class="category-image">
                      <img 
                        :src="category.logo || category.image || '/assets/images/placeholder.jpg'" 
                        :alt="category.name"
                        @error="handleImageError"
                        loading="lazy"
                      >
                    </div>
                    <div class="category-info">
                      <span class="category-name">{{ category.name }}</span>
                      <span class="product-count">({{ category._count?.products || 0 }})</span>
                    </div>
                    <div v-if="category.subCategories && category.subCategories.length > 0" class="has-subcategories">
                      <i class="ph ph-caret-right"></i>
                    </div>
                  </NuxtLink>
                  
                  <!-- Subcategories Menu -->
                  <div v-if="category.subCategories && category.subCategories.length > 0" class="subcategories-menu">
                    <div class="subcategories-header">
                      <h4>{{ category.name }}</h4>
                      <span>{{ category._count?.products || 0 }} products</span>
                    </div>
                    <div class="subcategories-list">
                      <!-- View All in Category -->
                      <NuxtLink 
                        :to="`/product/category/${category.id}`" 
                        class="subcategory-item view-all"
                        @click="closeDropdown"
                      >
                        <span>View all in {{ category.name }}</span>
                        <span>({{ category._count?.products || 0 }})</span>
                      </NuxtLink>
                      
                      <!-- Subcategories -->
                      <div 
                        v-for="subcategory in category.subCategories" 
                        :key="subcategory.id"
                        class="subcategory-group"
                      >
                        <NuxtLink 
                          :to="`/product/subcategory/${subcategory.id}`" 
                          class="subcategory-item"
                          @click="closeDropdown"
                        >
                          <div class="subcategory-info">
                            <img 
                              v-if="subcategory.logo || subcategory.image"
                              :src="subcategory.logo || subcategory.image" 
                              :alt="subcategory.name"
                              @error="handleImageError"
                              loading="lazy"
                            >
                            <span>{{ subcategory.name }}</span>
                          </div>
                          <i v-if="subcategory.subSubCategories && subcategory.subSubCategories.length > 0" 
                             class="ph ph-caret-right"></i>
                        </NuxtLink>
                        
                        <!-- Sub-Subcategories -->
                        <div v-if="subcategory.subSubCategories && subcategory.subSubCategories.length > 0" class="sub-subcategories">
                          <NuxtLink 
                            v-for="subSub in subcategory.subSubCategories" 
                            :key="subSub.id"
                            :to="`/product/subsubcategory/${subSub.id}`" 
                            class="sub-subcategory-item"
                            @click="closeDropdown"
                          >
                            <span>{{ subSub.name }}</span>
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No Categories -->
              <div v-else class="no-categories text-center py-40">
                <i class="ph ph-folder-open text-5xl text-gray-300 mb-16"></i>
                <p class="text-gray-600">No categories found</p>
              </div>
            </div>
            <!-- Dropdown End -->
          </div>
          <!-- Category Dropdown End -->

          <!-- Menu Start -->
          <div class="header-menu d-lg-block d-none">
            <ul class="nav-menu flex-align">
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': activeLink === 'home' }"
                  @click="setActiveLink('home')"
                >
                  Home
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/product/shop-all"
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': activeLink === 'shop' }"
                  @click="setActiveLink('shop')"
                >
                  Shop
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/seller" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': activeLink === 'seller' }"
                  @click="setActiveLink('seller')"
                >
                  Become a Seller
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/blog" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': activeLink === 'blog' }"
                  @click="setActiveLink('blog')"
                >
                  Blog
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/contact" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': activeLink === 'contact' }"
                  @click="setActiveLink('contact')"
                >
                  Contact Us
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Header Right start -->
        <div class="header-right flex-align gap-20">
          <!-- Phone Contact -->
          <a href="tel:+(2)871382023" class="d-sm-flex align-items-center gap-16 d-none"> 
            <span class="d-flex text-32">
              <img src="/assets/images/icon/mobile.png" alt="Mobile Icon">
            </span>
            <span class="">
              <span class="d-block text-heading fw-medium">Need any Help! call Us</span>
              <span class="d-block fw-bold text-main-600 hover-text-decoration-underline">+(2) 871 382 023</span>
            </span>
          </a>
          
          <!-- Mobile Menu -->
          <div class="position-relative d-lg-none">
            <button 
              type="button" 
              class="toggle-mobileMenu ms-3n text-gray-800 text-4xl d-flex align-items-center justify-content-center w-48 h-48 rounded-8 hover-bg-gray-100 transition-2"
              @click="toggleMobileMenu"
            >
              <i class="ph text-2xl" :class="showMobileMenu ? 'ph-x' : 'ph-list'"></i>
            </button>

            <!-- Mobile Menu Dropdown -->
            <div 
              v-if="showMobileMenu" 
              class="mobile-menu-dropdown bg-white border border-gray-300 rounded-16 shadow-2xl position-absolute top-100 end-0 mt-8 min-w-280 z-9999"
              @click.stop
            >
              <!-- Mobile menu content remains the same -->
              <div class="bg-main-600 text-white px-24 py-16">
                <div class="d-flex align-items-center justify-content-between">
                  <h3 class="text-lg fw-bold m-0">Navigation Menu</h3>
                  <button @click="closeMobileMenu" class="btn-close-mobile text-white hover-bg-white hover-text-main-600 w-32 h-32 rounded-circle d-flex align-items-center justify-content-center transition-2">
                    <i class="ph ph-x text-lg"></i>
                  </button>
                </div>
              </div>
              
              <div class="py-12 px-16 max-h-400 overflow-y-auto">
                <!-- Menu items remain the same -->
                <NuxtLink to="/" class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'home' }"
                  @click="closeMobileMenu">
                  <div class="menu-icon-container bg-main-50 text-main-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-house text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Home</span>
                    <span class="text-xs text-gray-500">Main Dashboard</span>
                  </div>
                </NuxtLink>
                
                <!-- Other menu items... -->
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()

// State
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const activeLink = ref('')
const categories = ref([])
const loadingCategories = ref(false)
const totalProductsCount = ref(0)
const dropdownRef = ref(null)

// Debug logging
console.log('Header component mounted, showDropdown:', showDropdown.value)

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    console.log('Fetching categories from API...')
    
    const response = await fetch('https://kartmania-api.vibrantick.org/common/product-category/read')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    if (data.data && Array.isArray(data.data)) {
      categories.value = data.data
      console.log('Categories loaded:', categories.value.length)
      
      // Calculate total products count
      totalProductsCount.value = data.data.reduce((sum, category) => {
        return sum + (category._count?.products || 0)
      }, 0)
      console.log('Total products count:', totalProductsCount.value)
    } else {
      console.warn('No categories data found in response')
      categories.value = []
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

// Set active link
const setActiveLink = (link) => {
  activeLink.value = link
}

// Toggle category dropdown
const toggleDropdown = () => {
  console.log('Toggle dropdown clicked, current state:', showDropdown.value)
  showDropdown.value = !showDropdown.value
  
  // Fetch categories when dropdown is opened for the first time
  if (showDropdown.value && categories.value.length === 0) {
    console.log('Fetching categories...')
    fetchCategories()
  }
  
  // Close mobile menu if open
  if (showMobileMenu.value) {
    showMobileMenu.value = false
  }
}

// Close dropdown
const closeDropdown = () => {
  console.log('Closing dropdown')
  showDropdown.value = false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showDropdown.value) {
    showDropdown.value = false
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Handle phone call
const callPhone = () => {
  const phoneNumber = '+(2)871382023'
  if (confirm(`Call ${phoneNumber}?`)) {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`
  }
  closeMobileMenu()
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  console.log('Click outside detected')
  
  const dropdown = dropdownRef.value
  const dropdownButton = document.querySelector('.category-button')
  const mobileMenu = document.querySelector('.mobile-menu-dropdown')
  const mobileMenuButton = document.querySelector('.toggle-mobileMenu')
  
  // Check for category dropdown
  if (dropdown && dropdownButton && 
      !dropdown.contains(event.target) && 
      !dropdownButton.contains(event.target)) {
    console.log('Click outside category dropdown')
    showDropdown.value = false
  }
  
  // Check for mobile menu dropdown
  if (mobileMenu && mobileMenuButton && 
      !mobileMenu.contains(event.target) && 
      !mobileMenuButton.contains(event.target)) {
    console.log('Click outside mobile menu')
    showMobileMenu.value = false
  }
}

// Update active link when route changes
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath)
  
  if (newPath === '/') {
    activeLink.value = 'home'
  } else if (newPath.includes('/product') || newPath.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (newPath.includes('/seller')) {
    activeLink.value = 'seller'
  } else if (newPath.includes('/blog')) {
    activeLink.value = 'blog'
  } else if (newPath.includes('/contact')) {
    activeLink.value = 'contact'
  } else {
    activeLink.value = ''
  }
  
  closeMobileMenu()
})

// Lifecycle hooks
onMounted(() => {
  console.log('Header component mounted')
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
  
  // Set initial active link
  if (route.path === '/') {
    activeLink.value = 'home'
  } else if (route.path.includes('/product') || route.path.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (route.path.includes('/seller')) {
    activeLink.value = 'seller'
  } else if (route.path.includes('/blog')) {
    activeLink.value = 'blog'
  } else if (route.path.includes('/contact')) {
    activeLink.value = 'contact'
  }
})

// Cleanup
onUnmounted(() => {
  console.log('Header component unmounted')
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 🔴 DEBUG: Add visible border to see dropdown area */
.category-dropdown {
  border: 2px solid #dc2626 !important; /* Red border for debugging */
  background: white !important;
  z-index: 9999 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Ensure dropdown is visible */
.category-dropdown[v-if="showDropdown"] {
  display: block !important;
}

/* Debug styles to see boundaries */
.position-relative {
  position: relative !important;
  overflow: visible !important;
}

/* Dropdown container */
.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-width: 800px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 8px;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

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

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Category Card */
.category-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
  background: white;
}

.category-card:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-card.all-categories {
  background: #f3f4f6;
  border-color: #d1d5db;
  grid-column: 1 / -1;
  justify-content: center;
  text-align: center;
}

.category-card.all-categories:hover {
  background: #e5e7eb;
}

/* Category Image */
.category-image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.category-icon {
  width: 40px;
  height: 40px;
  background: #000;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

/* Category Info */
.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-count {
  font-size: 12px;
  color: #6b7280;
}

/* Subcategories Indicator */
.has-subcategories {
  color: #9ca3af;
  margin-left: auto;
  padding-left: 8px;
}

/* Subcategories Menu */
.subcategories-menu {
  position: absolute;
  left: calc(100% + 8px);
  top: 0;
  width: 300px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 16px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  z-index: 10001;
}

.category-card-wrapper:hover .subcategories-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

/* Subcategories Header */
.subcategories-header {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.subcategories-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.subcategories-header span {
  font-size: 12px;
  color: #6b7280;
}

/* Subcategories List */
.subcategories-list {
  max-height: 300px;
  overflow-y: auto;
}

/* Subcategory Items */
.subcategory-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.subcategory-item:hover {
  background: #f9fafb;
  color: #000;
}

.subcategory-item.view-all {
  background: #f3f4f6;
  font-weight: 500;
  margin-bottom: 12px;
}

.subcategory-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subcategory-info img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 4px;
}

/* Sub-Subcategories */
.sub-subcategories {
  margin-left: 20px;
  margin-bottom: 8px;
}

.sub-subcategory-item {
  display: block;
  padding: 8px 12px;
  padding-left: 28px;
  border-radius: 6px;
  text-decoration: none;
  color: #6b7280;
  font-size: 13px;
  transition: all 0.2s ease;
}

.sub-subcategory-item:hover {
  background: #f9fafb;
  color: #374151;
}

/* No Categories */
.no-categories {
  padding: 40px 20px;
  text-align: center;
}

/* Active Link Style */
.nav-menu__link.active {
  color: #dc2626 !important;
  font-weight: 600 !important;
}

.mobile-menu-item.active-mobile {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  border-color: #fca5a5 !important;
  color: #dc2626 !important;
  font-weight: 600 !important;
}

/* Scrollbar Styling */
.categories-grid::-webkit-scrollbar,
.subcategories-list::-webkit-scrollbar {
  width: 6px;
}

.categories-grid::-webkit-scrollbar-track,
.subcategories-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.categories-grid::-webkit-scrollbar-thumb,
.subcategories-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.categories-grid::-webkit-scrollbar-thumb:hover,
.subcategories-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive Design */
@media (max-width: 991px) {
  .category-dropdown {
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px;
    max-height: 70vh;
    margin-top: 0;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    max-height: 60vh;
  }
  
  .category-card.all-categories {
    grid-column: 1 / -1;
  }
  
  .subcategories-menu {
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translateX(-50%) translateX(-10px);
    width: 90%;
    max-width: 350px;
  }
  
  .category-card-wrapper:hover .subcategories-menu {
    transform: translateX(-50%);
  }
}

@media (max-width: 576px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-name {
    font-size: 13px;
  }
  
  .product-count {
    font-size: 11px;
  }
}

/* 🔴 DEBUG: Add background to see if component renders */
.header {
  background: white;
}

.menu-category-wrapper {
  overflow: visible !important;
}
</style>