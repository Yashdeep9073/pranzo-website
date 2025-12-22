<template>
  <header class="header bg-white border-bottom-0 box-shadow-3xl py-10 z-2">
    <div class="container container-lg">
      <nav class="header-inner d-flex justify-content-between gap-8">
        <div class="flex-align menu-category-wrapper position-relative">
          <!-- Category Dropdown Start -->
          <div class="category-dropdown-container position-relative">
            <button 
              type="button" 
              class="category-button d-flex align-items-center gap-12 text-white bg-black px-20 py-16 rounded-6 hover-bg-success-700 transition-2"
              @click="toggleDropdown"
              :disabled="loadingCategories"
            >
              <span class="text-xl line-height-1"><i class="ph ph-squares-four"></i></span>
              <span class="button-text">{{ loadingCategories ? 'Loading...' : 'Browse Categories' }}</span>
              <span class="line-height-1 icon transition-2">
                <i :class="['ph', showDropdown ? 'ph-caret-up' : 'ph-caret-down', 'ph-bold']"></i>
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown" 
              ref="dropdownRef"
              class="category-dropdown-menu"
              @click.stop
            >
              <!-- Loading State -->
              <div v-if="loadingCategories" class="dropdown-loading">
                <div class="spinner-border text-main-600" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-12 text-gray-600">Loading categories...</p>
              </div>
              
              <!-- Categories Content -->
              <div v-else-if="categories.length > 0" class="dropdown-content">
                <!-- All Categories -->
                <NuxtLink 
                  to="/product/shop-all"
                  class="dropdown-item all-categories"
                  @click="closeDropdown"
                >
                  <div class="item-icon">
                    <i class="ph ph-grid-nine"></i>
                  </div>
                  <div class="item-text">
                    <span class="item-title">All Categories</span>
                    <span class="item-count">({{ totalProductsCount }})</span>
                  </div>
                </NuxtLink>
                
                <div class="dropdown-divider"></div>
                
                <!-- Categories List -->
                <div class="categories-list">
                  <NuxtLink 
                    v-for="category in categories" 
                    :key="category.id"
                    :to="getCategoryLink(category)" 
                    class="dropdown-item"
                    @click="handleCategoryClick(category)"
                  >
                    <div class="item-icon">
                      <img 
                        :src="getCategoryImage(category)" 
                        :alt="category.name"
                        @error="handleImageError"
                        loading="lazy"
                        class="category-img"
                      >
                    </div>
                    <div class="item-text">
                      <span class="item-title">{{ category.name }}</span>
                      <span class="item-count">({{ category._count?.products || 0 }})</span>
                    </div>
                  </NuxtLink>
                </div>
              </div>
              
              <!-- No Categories -->
              <div v-else class="dropdown-empty">
                <i class="ph ph-folder-open text-4xl text-gray-300 mb-12"></i>
                <p class="text-gray-600">No categories found</p>
              </div>
            </div>
          </div>

          <!-- Menu Start -->
          <div class="header-menu d-lg-block d-none">
            <ul class="nav-menu flex-align">
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/') }"
                  @click="setActiveLink('home')"
                  prefetch
                >
                  Home
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/product/shop-all"
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/product') || isActiveLink('/shop') }"
                  @click="setActiveLink('shop')"
                  prefetch
                >
                  Shop
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/become-a-seller" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/become-a-seller') }"
                  @click="setActiveLink('become-a-seller')"
                  prefetch
                >
                  Become a Seller
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/blogs" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isBlogActive }"
                  @click="setActiveLink('blogs')"
                  prefetch
                >
                  Blog
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/contact" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/contact') }"
                  @click="setActiveLink('contact')"
                  prefetch
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
              ref="mobileMenuRef"
              class="mobile-menu-dropdown-wrapper"
              :class="{ 'mobile-menu-show': showMobileMenu }"
              @click.stop
            >
              <div class="mobile-menu-dropdown">
                <div class="mobile-menu-header bg-main-600 text-white px-24 py-16">
                  <div class="d-flex align-items-center justify-content-between">
                    <h3 class="text-lg fw-bold m-0">Navigation Menu</h3>
                    <button @click="closeMobileMenu" class="mobile-close-btn">
                      <i class="ph ph-x text-lg"></i>
                    </button>
                  </div>
                </div>
                
                <div class="mobile-menu-content py-12 px-16">
                  <NuxtLink to="/" class="mobile-menu-item"
                    :class="{ 'active-mobile': isActiveLink('/') }"
                    @click="closeMobileMenu">
                    <div class="menu-icon">
                      <i class="ph ph-house"></i>
                    </div>
                    <div class="menu-text">
                      <span class="item-title">Home</span>
                      <span class="item-subtitle">Main Dashboard</span>
                    </div>
                  </NuxtLink>
                  
                  <NuxtLink to="/product/shop-all" class="mobile-menu-item"
                    :class="{ 'active-mobile': isActiveLink('/product') || isActiveLink('/shop') }"
                    @click="closeMobileMenu">
                    <div class="menu-icon">
                      <i class="ph ph-shopping-cart"></i>
                    </div>
                    <div class="menu-text">
                      <span class="item-title">Shop</span>
                      <span class="item-subtitle">Browse Products</span>
                    </div>
                  </NuxtLink>
                  
                  <NuxtLink to="/person" class="mobile-menu-item"
                    :class="{ 'active-mobile': isBlogActive }"
                    @click="closeMobileMenu">
                    <div class="menu-icon">
                      <i class="ph ph-newspaper"></i>
                    </div>
                    <div class="menu-text">
                      <span class="item-title">Blog</span>
                      <span class="item-subtitle">Latest Articles</span>
                    </div>
                  </NuxtLink>
                  
                  <button @click="callPhone" class="mobile-menu-item phone-item">
                    <div class="menu-icon">
                      <i class="ph ph-phone"></i>
                    </div>
                    <div class="menu-text">
                      <span class="item-title">Call Us</span>
                      <span class="item-subtitle">+(2) 871 382 023</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from '#imports'

const router = useRouter()
const route = useRoute()

// State
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const activeLink = ref('')
const categories = ref([])
const loadingCategories = ref(false)
const totalProductsCount = ref(0)
const dropdownRef = ref(null)
const mobileMenuRef = ref(null)

// Computed property to check if blog is active
const isBlogActive = computed(() => {
  const path = route.path
  return path === '/person' || 
         path.startsWith('/person/') || 
         path === '/blogs' || 
         path.startsWith('/blogs/') ||
         path === '/blog' || 
         path.startsWith('/blog/')
})

// Helper function to check active link
const isActiveLink = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

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

// Get category image with fallback
const getCategoryImage = (category) => {
  if (category.logo) return category.logo
  if (category.image) return category.image
  return '/assets/images/category-placeholder.png'
}

// Get category link for shop-all page
const getCategoryLink = (category) => {
  return `/product/shop-all?category=${encodeURIComponent(category.name)}`
}

// Handle category click
const handleCategoryClick = (category) => {
  console.log('Category clicked:', category.name)
  closeDropdown()
}

// Set active link
const setActiveLink = (link) => {
  activeLink.value = link
}

// Toggle category dropdown
const toggleDropdown = () => {
  console.log('Toggle dropdown clicked, current state:', showDropdown.value)
  
  if (showMobileMenu.value) {
    showMobileMenu.value = false
    enableBodyScroll()
  }
  
  showDropdown.value = !showDropdown.value
  
  if (showDropdown.value) {
    disableBodyScroll()
    if (categories.value.length === 0) {
      console.log('Fetching categories...')
      fetchCategories()
    }
  } else {
    enableBodyScroll()
  }
}

// Close dropdown
const closeDropdown = () => {
  console.log('Closing dropdown')
  showDropdown.value = false
  enableBodyScroll()
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  if (showDropdown.value) {
    showDropdown.value = false
    enableBodyScroll()
  }
  
  showMobileMenu.value = !showMobileMenu.value
  
  if (showMobileMenu.value) {
    disableBodyScroll()
  } else {
    enableBodyScroll()
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
  enableBodyScroll()
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

// Disable body scroll
const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
}

// Enable body scroll
const enableBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const dropdown = dropdownRef.value
  const dropdownButton = document.querySelector('.category-button')
  const mobileMenu = mobileMenuRef.value
  const mobileMenuButton = document.querySelector('.toggle-mobileMenu')
  
  if (dropdown && dropdownButton && 
      !dropdown.contains(event.target) && 
      !dropdownButton.contains(event.target) &&
      showDropdown.value) {
    closeDropdown()
  }
  
  if (mobileMenu && mobileMenuButton && 
      !mobileMenu.contains(event.target) && 
      !mobileMenuButton.contains(event.target) &&
      showMobileMenu.value) {
    closeMobileMenu()
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
  } else if (isBlogActive.value) {
    activeLink.value = 'blog'
  } else if (newPath.includes('/contact')) {
    activeLink.value = 'contact'
  } else {
    activeLink.value = ''
  }
  
  closeDropdown()
  closeMobileMenu()
})

// Lifecycle hooks
onMounted(() => {
  console.log('Header component mounted')
  
  document.addEventListener('click', handleClickOutside)
  
  if (route.path === '/') {
    activeLink.value = 'home'
  } else if (route.path.includes('/product') || route.path.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (route.path.includes('/seller')) {
    activeLink.value = 'seller'
  } else if (isBlogActive.value) {
    activeLink.value = 'blog'
  } else if (route.path.includes('/contact')) {
    activeLink.value = 'contact'
  }
})

// Cleanup
onUnmounted(() => {
  console.log('Header component unmounted')
  document.removeEventListener('click', handleClickOutside)
  enableBodyScroll() // Ensure scroll is enabled when component unmounts
})
</script>

<style scoped>
/* ==================== BASE STYLES ==================== */
.header {
  position: relative;
  z-index: 1000;
  width: 100%;
}

.menu-category-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
}

/* ==================== CATEGORY DROPDOWN FIXES ==================== */
.category-dropdown-container {
  position: relative;
  display: inline-block;
}

.category-button {
  position: relative;
  z-index: 1001;
  white-space: nowrap;
}

.category-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 320px;
  max-height: 400px;
  overflow: hidden;
  z-index: 99999 !important;
  animation: dropdownSlide 0.3s ease;
  transform-origin: top center;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dropdown Loading */
.dropdown-loading {
  padding: 40px 20px;
  text-align: center;
}

/* Dropdown Content */
.dropdown-content {
  padding: 8px 0;
}

/* Dropdown Items */
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f9fafb;
  border-left-color: #000000;
}

.dropdown-item.all-categories {
  background: #f3f4f6;
  font-weight: 600;
  margin-bottom: 4px;
}

.dropdown-item.all-categories:hover {
  background: #e5e7eb;
}

/* Item Icon */
.item-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.all-categories .item-icon {
  background: #000000;
  color: white;
  border-radius: 8px;
  padding: 6px;
}

/* Item Text */
.item-text {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-count {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

/* Dropdown Divider */
.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 20px;
}

/* Categories List */
.categories-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.categories-list::-webkit-scrollbar {
  width: 6px;
}

.categories-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.categories-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.categories-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Dropdown Empty */
.dropdown-empty {
  padding: 40px 20px;
  text-align: center;
}

/* ==================== NAVIGATION MENU ==================== */
.header-menu {
  margin-left: 30px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu__item {
  position: relative;
}

.nav-menu__link {
  position: relative;
  text-decoration: none !important;
  color: #000000 !important;
  transition: all 0.2s ease;
  padding: 8px 16px;
  display: inline-block;
  font-weight: 500;
  font-size: 15px;
  white-space: nowrap;
}

.nav-menu__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #000000;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.nav-menu__link:hover::after {
  transform: scaleX(1);
}

.nav-menu__link.active {
  color: #000000 !important;
  font-weight: 700 !important;
}

.nav-menu__link.active::after {
  transform: scaleX(1);
  background: #000000;
}

/* ==================== MOBILE MENU ==================== */
.mobile-menu-dropdown-wrapper {
  position: fixed;
  top: 80px;
  right: 0;
  width: 320px;
  height: calc(100vh - 80px);
  background: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 999999 !important;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  border-top: 1px solid #e5e7eb;
  /* No overlay background */
}

.mobile-menu-dropdown-wrapper.mobile-menu-show {
  transform: translateX(0);
}

.mobile-menu-dropdown {
  height: 100%;
  width: 100%;
}

.mobile-menu-header {
  padding: 1.5rem;
  background: #000000;
  color: white;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: white;
  color: #000000;
  transform: rotate(90deg);
}

.mobile-menu-content {
  padding: 1rem;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: #374151;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.mobile-menu-item:hover {
  background: #f9fafb;
  border-left-color: #000000;
}

.menu-icon {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
}

.item-title {
  font-weight: 600;
  font-size: 0.875rem;
  display: block;
  color: #111827;
}

.item-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
}

.active-mobile {
  background: #f0f9ff;
  border-left-color: #000000;
}

.phone-item .menu-icon {
  background: #f0f9ff;
  color: #000000;
}

/* ==================== RESPONSIVE FIXES ==================== */

/* Desktop (992px and above) */
@media (min-width: 992px) {
  .header-menu {
    display: block !important;
  }
  
  .mobile-menu-dropdown-wrapper {
    display: none !important;
  }
  
  .category-dropdown-menu {
    position: absolute !important;
    top: calc(100% + 8px) !important;
    left: 0 !important;
    transform: none !important;
  }
}

/* Tablet (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .header-menu {
    display: none !important;
  }
  
  .category-dropdown-menu {
    top: 70px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 320px !important;
    max-height: 60vh;
  }
  
  .nav-menu {
    gap: 20px;
  }
  
  .nav-menu__link {
    font-size: 14px;
    padding: 6px 12px;
  }
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
  .header-inner {
    gap: 1rem;
  }
  
  .header-menu {
    display: none !important;
  }
  
  .category-dropdown-menu {
    width: calc(100vw - 32px) !important;
    max-width: 400px;
    max-height: 60vh;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  
  .categories-list {
    max-height: 40vh;
  }
  
  .dropdown-item {
    padding: 10px 16px;
  }
  
  .category-button {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .mobile-menu-dropdown-wrapper {
    width: 280px;
    top: 70px;
    height: calc(100vh - 70px);
  }
}

/* Mobile Portrait (up to 575px) */
@media (max-width: 575px) {
  .category-dropdown-menu {
    width: calc(100vw - 24px) !important;
    left: 50%;
  }
  
  .categories-list {
    max-height: 50vh;
  }
  
  .nav-menu__link {
    font-size: 13px;
    padding: 4px 10px;
  }
  
  .mobile-menu-dropdown-wrapper {
    width: 260px;
  }
}

/* Extra Small Devices (up to 375px) */
@media (max-width: 375px) {
  .category-dropdown-menu {
    width: calc(100vw - 20px) !important;
    position: absolute;
    left: 10%;
  }
  
  .category-button {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .button-text {
    font-size: 13px;
  }
  
  .dropdown-item {
    padding: 8px 12px;
  }
  
  .item-title {
    font-size: 13px;
  }
  
  .item-count {
    font-size: 11px;
  }
  
  .mobile-menu-dropdown-wrapper {
    width: 240px;
  }
}

/* Prevent body scroll when menu is open */
body.no-scroll {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
}
</style>