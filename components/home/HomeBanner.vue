<template>
  <section v-if="!loading && banners.length > 0" class="hero-banner">
    <div class="banner-main">
      <div class="banner-slider">
        <div class="slide active">
          <!-- Background Image -->
          <Transition name="slide" mode="out-in">
            <img 
              v-if="currentBanner"
              :key="currentBanner.image"
              :src="currentBanner.image" 
              :alt="currentBanner.title"
              class="banner-image"
            />
          </Transition>
          
          <!-- Overlay -->
          <div class="overlay"></div>
          
          <!-- Content -->
          <Transition name="slide-content" mode="out-in">
          <div v-if="currentBanner" class="content" :key="currentBanner.title">
            <span class="subtitle">{{ currentBanner.description }}</span>
            <h1 class="title">{{ currentBanner.title }}</h1>
            <NuxtLink to="/shop/shop-all">
              <button class="shop-btn">Shop Now</button>
            </NuxtLink>
          </div>
          </Transition>
        </div>

        <!-- Navigation Arrows -->
        <button 
          v-show="banners.length > 1"
          class="nav-btn nav-prev" 
          @click="prevBanner" 
          aria-label="Previous banner"
        >
          <span class="nav-icon">←</span>
        </button>
        <button 
          v-show="banners.length > 1"
          class="nav-btn nav-next" 
          @click="nextBanner" 
          aria-label="Next banner"
        >
          <span class="nav-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useMediaApi } from '~/composables/api/useMediaApi'

// Banners list (starts empty)
const banners = ref<Array<{
  id: number
  title: string
  description: string
  image: string
  category: string
}>>([])
const currentIndex = ref(0)
const currentBanner = computed(() => banners.value[currentIndex.value] || null)
const loading = ref(true)
const error = ref<string | null>(null)
const autoTimer = ref<ReturnType<typeof setInterval> | null>(null)

// Initialize API hooks
const { fetchMedia } = useMediaApi()

// Normalize category strings for matching
const normalizeCategory = (value?: string) => {
  if (!value) return ''
  return value.toString().replace(/\s+/g, '').toUpperCase()
}

// Slider controls
const nextBanner = () => {
  if (banners.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

const prevBanner = () => {
  if (banners.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length
}

const startAutoSlide = () => {
  if (autoTimer.value || banners.value.length <= 1) return
  autoTimer.value = setInterval(() => {
    nextBanner()
  }, 6000)
}

const stopAutoSlide = () => {
  if (autoTimer.value) {
    clearInterval(autoTimer.value)
    autoTimer.value = null
  }
}

// Fetch banners from API using new media hook
const fetchBanners = async () => {
  loading.value = true
  
  try {
    // Fetch media with slider category filter
    const mediaResponse = await fetchMedia({
      type: "image",
      limit: 10,
      sort: "createdAt:desc"
    })
    
    const items = mediaResponse.data || []
    
    // Filter for SLIDER category media only
    const sliderItems = items.filter((item: any) => {
      const category = item?.category?.toLowerCase() || ''
      const title = item?.title?.toLowerCase() || ''
      
      // Look for exact "slider" category match
      return category === 'slider' || 
             category === 'SLIDER' ||
             title === 'slider' ||
             title === 'SLIDER'
    })
    
    if (sliderItems.length > 0) {
      const apiBanners = sliderItems.map((item: any) => {
        // Try different possible URL fields
        let imageUrl = item.url || item.imageUrl || item.image || item.src || ''
        
        // If the URL is relative, construct full URL
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/assets')) {
          imageUrl = `https://api.pranzo.in${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
        }
        
        return {
          id: item.id,
          title: item.title || '',
          description: item.description || item.alt || '',
          image: imageUrl,
          category: 'HEROSECTION'
        }
      })
      
      banners.value = apiBanners
      currentIndex.value = 0
      error.value = null
    } else {
      error.value = 'No slider category media found'
      banners.value = []
      currentIndex.value = 0
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    error.value = errorMessage
    banners.value = []
    currentIndex.value = 0
  } finally {
    loading.value = false
    stopAutoSlide()
    startAutoSlide()
  }
}

// Initialize - fetch banners from API
onMounted(() => {
  // Try to fetch slider media from API
  fetchBanners()
  
  // Also try again after 3 seconds if failed
  setTimeout(() => {
    if (error.value) {
      console.log('🔄 Retrying slider media fetch...')
      fetchBanners()
    }
  }, 3000)
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.hero-banner {
  min-height: 450px;
  position: relative;
  overflow: hidden;
}

/* Loading State (minimal) */
.loading-state {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Banner Main (always visible) */
.banner-main {
  width: 100%;
  min-height: 450px;
}

.banner-slider {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: relative;
  min-height: 450px;
}

.banner-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

/* Smooth slide between slides */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease;
  will-change: transform;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Smooth slide for text/content */
.slide-content-enter-active,
.slide-content-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
  will-change: transform, opacity;
}

.slide-content-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-content-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.content {
  position: relative;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 25px;
  line-height: 1.3;
}

.shop-btn {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s;
}

.shop-btn:hover {
  transform: translateY(-3px);
}

/* Navigation buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 15;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #fff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-prev {
  left: 30px;
}

.nav-next {
  right: 30px;
}

.nav-icon {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  user-select: none;
  pointer-events: none;
}

/* Error Indicator (small, non-blocking) */
.error-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 59, 48, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 5;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 350px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 300px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .shop-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
