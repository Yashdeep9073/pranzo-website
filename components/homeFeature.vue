<template>
  <div class="fashion-section" id="fashionSection">
    <div class="container container-lg">
      <div class="section-header mb-32">
        <h2 class="section-title">Trending Categories</h2>
        <p class="section-subtitle">Shop from our curated collection</p>
      </div>
      
      <div class="position-relative arrow-center">
        <!-- Navigation Arrows -->
        <button 
          type="button" 
          @click="slidePrev"
          class="nav-arrow nav-prev"
          :disabled="currentIndex === 0"
        >
          <i class="ph ph-caret-left"></i>
        </button>
        <button 
          type="button" 
          @click="slideNext"
          class="nav-arrow nav-next"
          :disabled="currentIndex >= maxIndex"
        >
          <i class="ph ph-caret-right"></i>
        </button>
        
        <!-- Swiper Container -->
        <div 
          class="swiper-container" 
          ref="swiperContainer"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
          @wheel="handleWheel"
        >
          <div 
            class="swiper-wrapper" 
            ref="swiperWrapper"
            :style="wrapperStyle"
          >
            <!-- Swiper Slides -->
            <div 
              v-for="(item, index) in visibleCategories" 
              :key="item.id"
              class="swiper-slide"
            >
              <div class="category-card">
                <!-- Image with Optimized Loading -->
                <div class="card-image">
                  <NuxtLink :to="item.link" class="image-link">
                    <img 
                      :src="getOptimizedImage(item.image, index)"
                      :alt="item.title"
                      class="lazy-image"
                      loading="lazy"
                      width="280"
                      height="280"
                      @load="handleImageLoad"
                      @error="handleImageError"
                    />
                  </NuxtLink>
                  <!-- <button 
                    class="wishlist-btn"
                    @click="toggleWishlist(item)"
                    :class="{ active: item.isWishlisted }"
                  >
                    <i class="ph" :class="item.isWishlisted ? 'ph-heart-fill' : 'ph-heart'"></i>
                  </button> -->
                </div>
                
                <!-- Card Content -->
                <div class="card-content">
                  <h3 class="card-title">
                    <NuxtLink :to="item.link">{{ item.title }}</NuxtLink>
                  </h3>
                  <p class="card-desc">{{ item.description }}</p>
                  
                  <div class="card-meta">
                    <span class="product-count">{{ item.products }}</span>
                    <span class="price">{{ item.price }}</span>
                  </div>
                  
                  <NuxtLink :to="item.link" class="shop-btn">
                    Shop Now <i class="ph ph-arrow-right"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Refs
const swiperContainer = ref(null)
const swiperWrapper = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragOffset = ref(0)
const currentIndex = ref(0)
const autoSlideInterval = ref(null)
const isHovering = ref(false)
const loadedImages = ref(new Set())

// Configuration
const slidesPerView = ref(4)
const slideGap = 8 // Very small gap
const slideWidth = 280 // Fixed card width
const transitionSpeed = 300

// Categories Data
const categories = ref([
  {
    id: 1,
    title: 'Full Shop',
    description: 'Complete collection',
    products: '1000+ Products',
    price: '₹499',
    image: '/assets/images/buysection/full-shop.jpg',
    link: '/shop/full-collection',
    isWishlisted: false,
    priority: true
  },
  {
    id: 2,
    title: 'Jeans',
    description: 'Trendy denim wear',
    products: '150+ Styles',
    price: '₹799',
    image: '/assets/images/buysection/jean-all.jpg',
    link: '/shop/jeans',
    isWishlisted: false,
    priority: true
  },
  {
    id: 3,
    title: 'T-Shirts',
    description: 'Comfortable wear',
    products: '200+ Designs',
    price: '₹299',
    image: '/assets/images/buysection/t-shirt1.jpg',
    link: '/shop/t-shirts',
    isWishlisted: true,
    priority: true
  },
  {
    id: 4,
    title: 'Footwear',
    description: 'Stylish shoes',
    products: '120+ Pairs',
    price: '₹1299',
    image: '/assets/images/buysection/shoe1.jpg',
    link: '/shop/shoes',
    isWishlisted: false
  },
  {
    id: 5,
    title: 'Sarees',
    description: 'Traditional wear',
    products: '80+ Designs',
    price: '₹1999',
    image: '/assets/images/buysection/saree.jpg',
    link: '/shop/sarees',
    isWishlisted: false
  },
  {
    id: 6,
    title: 'Jean Sets',
    description: 'Complete outfits',
    products: '3-Piece Set',
    price: '₹2499',
    image: '/assets/images/buysection/triple-jean.jpg',
    link: '/shop/jean-sets',
    isWishlisted: false
  },
  {
    id: 7,
    title: 'Shirts',
    description: 'Office wear',
    products: '90+ Styles',
    price: '₹899',
    image: '/assets/images/buysection/shirt.jpg',
    link: '/shop/shirts',
    isWishlisted: false
  },
  {
    id: 8,
    title: 'Jewelry',
    description: 'Fine collection',
    products: '60+ Pieces',
    price: '₹1599',
    image: '/assets/images/buysection/jwellery.jpg',
    link: '/shop/jewelry',
    isWishlisted: false
  }
])

// Computed
const maxIndex = computed(() => Math.max(0, categories.value.length - slidesPerView.value))
const visibleCategories = computed(() => categories.value)
const wrapperStyle = computed(() => ({
  transform: `translateX(${-(currentIndex.value * (slideWidth + slideGap)) + dragOffset.value}px)`,
  transition: isDragging.value ? 'none' : `transform ${transitionSpeed}ms ease`,
  gap: `${slideGap}px`
}))

// Image Optimization - Load low priority images later
const getOptimizedImage = (image, index) => {
  // Priority images load immediately, others can wait
  const category = categories.value[index]
  if (category?.priority || index < 4) {
    return image
  }
  return image // In production, you could use a lower quality version here
}

// Navigation
const slideNext = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const slidePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Mouse Events
const handleMouseDown = (e) => {
  if (e.button !== 0) return // Only left click
  isDragging.value = true
  startX.value = e.clientX
  currentX.value = e.clientX
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const deltaX = e.clientX - currentX.value
  currentX.value = e.clientX
  dragOffset.value += deltaX
  
  // Constrain dragging
  const maxDrag = (slideWidth + slideGap) * 0.5
  dragOffset.value = Math.max(-maxDrag, Math.min(maxDrag, dragOffset.value))
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  
  const dragDistance = dragOffset.value
  dragOffset.value = 0
  
  // Determine if we should change slide
  const threshold = (slideWidth + slideGap) * 0.3
  if (Math.abs(dragDistance) > threshold) {
    if (dragDistance < 0 && currentIndex.value < maxIndex.value) {
      slideNext()
    } else if (dragDistance > 0 && currentIndex.value > 0) {
      slidePrev()
    }
  }
  
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// Touch Events
const handleTouchStart = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  currentX.value = e.touches[0].clientX
  
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const deltaX = e.touches[0].clientX - currentX.value
  currentX.value = e.touches[0].clientX
  dragOffset.value += deltaX
  
  const maxDrag = (slideWidth + slideGap) * 0.5
  dragOffset.value = Math.max(-maxDrag, Math.min(maxDrag, dragOffset.value))
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  const dragDistance = dragOffset.value
  dragOffset.value = 0
  
  const threshold = (slideWidth + slideGap) * 0.25
  if (Math.abs(dragDistance) > threshold) {
    if (dragDistance < 0 && currentIndex.value < maxIndex.value) {
      slideNext()
    } else if (dragDistance > 0 && currentIndex.value > 0) {
      slidePrev()
    }
  }
  
  isDragging.value = false
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
}

// Wheel navigation (optional)
const handleWheel = (e) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return // Only horizontal
  
  e.preventDefault()
  if (e.deltaX > 0 && currentIndex.value < maxIndex.value) {
    slideNext()
  } else if (e.deltaX < 0 && currentIndex.value > 0) {
    slidePrev()
  }
}

// Image Handlers
const handleImageLoad = (e) => {
  const img = e.target
  loadedImages.value.add(img.src)
  img.classList.add('loaded')
}

const handleImageError = (e) => {
  const img = e.target
  // Set a fallback image or hide
  img.style.opacity = '0'
}

// Toggle Wishlist
const toggleWishlist = (item) => {
  item.isWishlisted = !item.isWishlisted
}

// Responsive
const updateSlidesPerView = () => {
  const width = window.innerWidth
  
  if (width < 480) slidesPerView.value = 1
  else if (width < 640) slidesPerView.value = 2
  else if (width < 768) slidesPerView.value = 2
  else if (width < 1024) slidesPerView.value = 3
  else if (width < 1280) slidesPerView.value = 4
  else slidesPerView.value = 5
}

// Auto Slide
const startAutoSlide = () => {
  stopAutoSlide()
  autoSlideInterval.value = setInterval(() => {
    if (!isHovering.value && !isDragging.value) {
      if (currentIndex.value >= maxIndex.value) {
        currentIndex.value = 0
      } else {
        slideNext()
      }
    }
  }, 4000)
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  if (typeof window !== 'undefined') {
    updateSlidesPerView()
    window.addEventListener('resize', updateSlidesPerView)
    
    // Start auto slide after images load
    setTimeout(startAutoSlide, 1000)
    
    // Hover events
    const container = swiperContainer.value
    if (container) {
      container.addEventListener('mouseenter', () => {
        isHovering.value = true
        stopAutoSlide()
      })
      container.addEventListener('mouseleave', () => {
        isHovering.value = false
        startAutoSlide()
      })
    }
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateSlidesPerView)
    stopAutoSlide()
  }
})
</script>

<style scoped>
/* Base Styles */
.fashion-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9, #22d3ee);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin-top: 12px;
}

/* Swiper Container */
.arrow-center {
  position: relative;
  padding: 0 40px;
}

.swiper-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  cursor: grab;
  user-select: none;
}

.swiper-container:active {
  cursor: grabbing;
}

.swiper-wrapper {
  display: flex;
  transition-property: transform;
  will-change: transform;
  padding: 4px 0; /* Minimal padding */
  box-sizing: content-box;
}

.swiper-slide {
  flex: 0 0 auto;
  width: 280px; /* Fixed width for consistent layout */
  padding: 0 4px; /* VERY small gap between cards */
}

/* Category Card */
.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.3);
}

/* Card Image */
.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1; /* Perfect square */
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
}

.image-link {
  display: block;
  width: 100%;
  height: 100%;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  background: #f1f5f9;
}

.lazy-image.loaded {
  animation: fadeIn 0.3s ease;
}

.category-card:hover .lazy-image {
  transform: scale(1.05);
}

.wishlist-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  z-index: 2;
  padding: 0;
}

.wishlist-btn:hover {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.wishlist-btn i {
  font-size: 16px;
  line-height: 1;
}

/* Card Content */
.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  line-height: 1.3;
}

.card-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-title a:hover {
  color: #0ea5e9;
}

.card-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.product-count {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #013750;
}

.shop-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(90deg, #0a7cb1, #127ec1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.shop-btn:hover {
  background: linear-gradient(90deg, #0284c7, #0a7eb4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.shop-btn i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.shop-btn:hover i {
  transform: translateX(2px);
}

/* Navigation Arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1024b5;
  z-index: 10;
  padding: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.nav-arrow:hover:not(:disabled) {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%);
}

.nav-prev {
  left: 0;
}

.nav-next {
  right: 0;
}

.nav-arrow i {
  font-size: 18px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1280px) {
  .swiper-slide {
    width: 260px;
  }
  .arrow-center {
    padding: 0 36px;
  }
}

@media (max-width: 1024px) {
  .fashion-section {
    padding: 32px 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .swiper-slide {
    width: 240px;
  }
  
  .arrow-center {
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .arrow-center {
    padding: 0 28px;
  }
  
  .nav-arrow {
    width: 32px;
    height: 32px;
  }
  
  .nav-arrow i {
    font-size: 16px;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .shop-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .arrow-center {
    padding: 0 24px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .section-subtitle {
    font-size: 0.85rem;
  }
  
  .swiper-slide {
    width: 220px;
  }
  
  .nav-arrow {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .fashion-section {
    padding: 24px 0;
  }
  
  .arrow-center {
    padding: 0 20px;
  }
  
  .swiper-slide {
    width: 200px;
    padding: 0 3px;
  }
  
  .nav-arrow {
    display: none;
  }
  
  .card-desc {
    font-size: 0.75rem;
    -webkit-line-clamp: 1;
  }
}

/* Performance Optimizations */
.swiper-wrapper {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

.lazy-image {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .category-card,
  .lazy-image,
  .shop-btn,
  .nav-arrow,
  .wishlist-btn {
    transition: none !important;
  }
  
  .lazy-image.loaded {
    animation: none;
  }
}
</style>