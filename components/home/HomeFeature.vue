<template>
  <div class="feature pb-20" id="featureSection">
    <div class="container container-lg">
      <div class="position-relative ">
        <div class="flex-align">
          <!-- Navigation buttons commented as in original -->
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="skeleton-container">
          <div class="skeleton-slider">
            <div v-for="i in 7" :key="i" class="skeleton-item">
              <div class="skeleton-image shimmer"></div>
              <div class="skeleton-text shimmer"></div>
              <div class="skeleton-text shimmer" style="width: 60%;"></div>
            </div>
          </div>
        </div>
        
        <!-- Categories Swiper - Show ALL Categories (Desktop) -->
        <swiper 
          v-else
          ref="swiperRef"
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="10"
          :loop="categories.length > slidesPerView"
          :navigation="{
            nextEl: '.slick-next',
            prevEl: '.slick-prev'
          }"
          :breakpoints="breakpoints"
          class="feature-item-wrapper desktop-categories"
        >
          <!-- Category Slides - ALL categories -->
          <swiper-slide
            v-for="category in categories"
            :key="category.id"
            class="feature-item text-center"
          >
            <div class="feature-item__thumb rounded-circle">
              <NuxtLink :to="getCategoryLink(category)" class="w-100 h-100 flex-center">
                <img 
                  :src="getCategoryImage(category)"  
                  :alt="category.name"
                  @error="handleImageError"
                  loading="lazy"
                />
              </NuxtLink>
            </div>
            <div class="feature-item__content mt-16">
              <h6 class="text-lg mb-8">
                <NuxtLink :to="getCategoryLink(category)" class="text-inherit">{{ category.name }}</NuxtLink>
              </h6>
              <span class="text-sm text-gray-400 desktop-count">{{ category.productCount || 0 }}+ Products</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- Mobile Grid Layout (325px and above) -->
    <div v-if="!isLoading && categories.length > 0" class="mobile-deals-grid">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="12"
        :loop="categories.length > 4" 
        class="deal-grid-swiper"
      >
        <!-- 1 slide = 4 cards -->
        <swiper-slide
          v-for="(chunk, index) in chunkedCategories"
          :key="index"
        >
         <div class="deal-grid">
  <NuxtLink
    v-for="category in chunk"
    :key="category.id"
    :to="getCategoryLink(category)"
    class="deal-card"
  >
    <!-- Background Image -->
    <div
      class="deal-bg"
      :style="{
        backgroundImage: `url(${getCategoryImage(category)})` 
      }"
    ></div>

    <!-- Count badge -->
    <div class="deal-count">
      {{ category.productCount || 0 }}+
    </div>

    <!-- Name -->
    <div class="deal-name">
      {{ category.name }}
    </div>
  </NuxtLink>
</div>

        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import { useProductStore } from '../../store/useProductStore'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

// Swiper modules
const modules = [Autoplay, Navigation]

// Stores
const productStore = useProductStore()

// Swiper instance
const swiperRef = ref(null)

// Refs
const isLoading = ref(true)
const categories = ref([])



// Responsive breakpoints - Same as original
const breakpoints = {
  320: { slidesPerView: 2.6 },
  576: { slidesPerView: 3.6 },
  768: { slidesPerView: 4.6 },
  992: { slidesPerView: 5.6},
  1200: { slidesPerView: 6.6 },
  1400: { slidesPerView: 7.6 }
}

// Responsive slides per view - Same as original
const slidesPerView = ref(6)

// Compute chunked categories for mobile grid (4 per slide)
const chunkedCategories = computed(() => {
  const size = 4
  const result = []
  for (let i = 0; i < categories.value.length; i += size) {
    result.push(categories.value.slice(i, i + size))
  }
  return result
})

// Load categories from API
const loadCategories = async () => {
  try {
    isLoading.value = true
    
    // Fetch categories using the store method
    const result = await productStore.fetchCategoriesWithNestedData() 
    if (result.categories && result.categories.length > 0) {
      // Process ALL categories - NO FILTERING
      categories.value = result.categories
        .filter(category => category.name && category.id)
        .map(category => ({
          id: category.id,
          name: category.name,
          image: category.image,
          logo: category.logo,
          productCount: category._count?.products || 0,
          link: '/shop/shop-all',
          fallbackImage: getFallbackImage(category.name)
        }))
        
      
      // Use only backend categories - no fallback additions
      
    } else {
      // Use fallback categories if API fails
      categories.value = productStore.categories.map(item => ({
        id: item.id,
        name: item.name || item.title,
        image: item.image,
        productCount: item._count?.products || parseInt(item.products) || 0,
        link: item.link || '/shop/shop-all',
        fallbackImage: item.image
      }))
    }
    
  } catch (error) {
    // Use fallback on error
    categories.value = productStore.categories.map(item => ({
      id: item.id,
      name: item.name || item.title,
      image: item.image,
      productCount: item._count?.products || parseInt(item.products) || 0,
      link: item.link || '/shop/shop-all',
      fallbackImage: item.image
    }))
  } finally {
    isLoading.value = false
  }
}

// Get category image with fallback
const getCategoryImage = (category) => {
  // First priority: API image
  if (category.image && category.image !== 'null') {
    return category.image
  }
  
  // Second priority: Logo
  if (category.logo && category.logo !== 'null') {
    return category.logo
  }
  
  // Third priority: Fallback image
  return category.fallbackImage || getFallbackImage(category.name)
}

// Get category link
const getCategoryLink = (category) => {
  return `/shop/shop-all?category=${encodeURIComponent(category.name)}`
}

// Handle image error for desktop
const handleImageError = (event) => {
  const imgElement = event.target
  const categoryName = imgElement.alt || ''
  imgElement.src = getFallbackImage(categoryName)
}

// Handle image error for mobile
const handleMobileImageError = (event) => {
  const imgElement = event.target
  const categoryName = imgElement.alt || ''
  imgElement.src = getFallbackImage(categoryName)
  imgElement.classList.add('error-fallback')
}



// Handle window resize - Same as original
const handleResize = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 576) {
      slidesPerView.value = 2
    } else if (window.innerWidth < 768) {
      slidesPerView.value = 3
    } else if (window.innerWidth < 992) {
      slidesPerView.value = 4
    } else if (window.innerWidth < 1200) {
      slidesPerView.value = 5
    } else if (window.innerWidth < 1400) {
      slidesPerView.value = 6
    } else {
      slidesPerView.value = 7
    }
  }
}

// Initialize on mount
onMounted(async () => {
  await loadCategories()
  
  if (typeof window !== 'undefined') {
    handleResize()
    window.addEventListener('resize', handleResize)
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script> 
<style scoped>
/* Desktop Categories Styling */

.feature-item__thumb {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  background: white;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.feature-item__thumb:hover {
  border-color: var(--main-600);
  transform: scale(1.05);
}

.feature-item__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0px;
}

.feature-item__content {
  text-align: center;
}

.feature-item__content h6 {
  transition: color 0.3s ease;
}

.feature-item__content h6:hover {
  color: var(--main-600);
}

/* Mobile Deals Grid Styling */
.mobile-deals-grid {
  display: none;
}

/* Arrow positioning - ORIGINAL */
.arrow-center {
  position: relative;
}

.gradient-shadow {
  position: relative;
}

.flex-align {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  z-index: 10;
  pointer-events: none;
}

.slick-prev {
  left: -20px;
}

.slick-next {
  right: -20px;
}

.slick-arrow {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  pointer-events: all;
  transition: all 0.3s ease;
}

.slick-arrow:hover:not(:disabled) {
  background-color: var(--main-600);
  border-color: var(--main-600);
  color: white;
}

.slick-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.skeleton-container {
  padding: 20px 0;
}
.skeleton-slider {
  display: flex;
  gap: 20px;
  overflow: hidden;
}
.skeleton-item {
  flex: 0 0 auto;
  width: 120px;
  text-align: center;
}
.skeleton-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f3f4f6;
  margin: 0 auto 16px;
}
.skeleton-text {
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  margin: 8px auto;
}
.skeleton-text:first-of-type {
  width: 80%;
}
.shimmer {
  background: linear-gradient(90deg, #f3f4f6 25%, #f9fafb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* MOBILE DEALS GRID LAYOUT - 325px and above */
@media (min-width: 320px) and (max-width: 576px) {
  /* Hide desktop categories on mobile */
  .desktop-categories {
    display: none !important;
  }
  
  /* Show mobile deals grid */
  .mobile-deals-grid {
    display: block;
    padding: 7px 0;
  }
  
  /* Deal grid styling */
.deal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 7px;
  gap: 12px;
}

/* Card */
.deal-card {
  position: relative;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  background: #f5f5f5;
}

/* Background image */
.deal-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.95);
}

.deal-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  z-index: 2;
}

/* Name */
.deal-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  z-index: 2;

  background: linear-gradient(
    to top,
    rgba(0,0,0,0.6),
    rgba(0,0,0,0)
  );
}

}

/* For screens below 325px, show desktop version */
@media (max-width: 324px) {
  .mobile-deals-grid {
    padding: 7px;
  }
  
  /* .desktop-categories {
    display: block !important;
  } */
  
  .feature-item__thumb {
    width: 80px;
    height: 80px;
  }
  
  .skeleton-item {
    width: 80px;
  }
  
  .skeleton-image {
    width: 80px;
    height: 80px;
  }
  
  .flex-align {
    position: relative;
    top: 0;
    margin-bottom: 20px;
  }
}

/* Responsive adjustments - ORIGINAL (unchanged) */
@media (max-width: 768px) {
  .feature-item__thumb {
    width: 100px;
    height: 100px;
  }

  .flex-align {
    top: -50px;
  }
}

/* Original utility classes */
.rounded-circle {
  border-radius: 50%;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-lg {
  font-size: 1rem;
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-inherit {
  color: inherit;
}

.text-gray-400 {
  color: #9ca3af;
}

.mb-8 {
  margin-bottom: 8px;
}

.mt-16 {
  margin-top: 16px;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.bg-white {
  background-color: white;
}

.hover-bg-main-600:hover {
  background-color: var(--main-600);
}

.hover-text-white:hover {
  color: white;
}

.transition-1 {
  transition: all 0.3s ease;
}

/* Main color variable - match your theme */
:root {
  --main-600: #dc2626;
}

/* Ensure Swiper works properly */
.feature-item-wrapper {
  padding: 20px 0;
}
</style>
