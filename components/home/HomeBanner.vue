<template>
  <section class="hero-banner">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading banner...</p>
    </div>

    <!-- Main Banner (always shows, with fallback) -->
    <div class="banner-main" :class="{ 'has-error': error }">
      <div class="banner-slider">
        <div class="slide active">
          <!-- Background Image -->
          <Transition name="slide" mode="out-in">
            <img 
              :key="currentBanner.image"
              :src="currentBanner.image" 
              :alt="currentBanner.title"
              class="banner-image"
              @error="handleImageError"
            />
          </Transition>
          
          <!-- Overlay -->
          <div class="overlay"></div>
          
          <!-- Content -->
          <Transition name="slide-content" mode="out-in">
          <div class="content" :key="currentBanner.title">
            <span class="subtitle">{{ currentBanner.description }}</span>
            <h1 class="title">{{ currentBanner.title }}</h1>
            <NuxtLink to="/shop/shop-all">
              <button class="shop-btn">Shop Now →</button>
            </NuxtLink>
          </div>
          </Transition>
          
          <!-- Error Indicator (small, non-blocking) -->
          <div v-if="error" class="error-indicator">
            <!-- <small>⚠️ Using local image</small> -->
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button class="nav-btn nav-prev" @click="prevBanner" aria-label="Previous banner">
          <span class="nav-icon">‹</span>
        </button>
        <button class="nav-btn nav-next" @click="nextBanner" aria-label="Next banner">
          <span class="nav-icon">›</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useMediaHook } from '~/composables/useMediaHook'
const config = useRuntimeConfig()
const API_URL_MEDIA = config.public.api.media

// Fallback banner data (ALWAYS available)
const fallbackBanner = {
  id: 1,
  title: 'LIVE MORE BUY MORE',
  description: 'BUY SAFE SAVE MORE',
  image: '/assets/images/festivel.jpg',
  category: 'HEROSECTION'
}

// Banners list (starts with fallback)
const banners = ref([{ ...fallbackBanner }])
const currentIndex = ref(0)
const currentBanner = computed(() => banners.value[currentIndex.value] || fallbackBanner)
const loading = ref(true)
const error = ref<string | null>(null)
const autoTimer = ref<ReturnType<typeof setInterval> | null>(null)

// API Configuration

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/assets/images/nowcategory/festivel.jpg'
  img.onerror = null // Prevent infinite loop
}

// Resolve image URLs from API (fallback to local)
const resolveImageUrl = (image?: string) => {
  if (!image) return fallbackBanner.image
  if (image.startsWith('http')) return image
  if (image.startsWith('/')) return image
  return image
}

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

// Fetch banners from API (non-blocking)
const fetchBanners = async () => {
  loading.value = true
  
  try {
    const response = await fetch(API_URL_MEDIA)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    const items = Array.isArray(data?.data) ? data.data : []
    const heroItems = items.filter((item: any) => {
      const category = normalizeCategory(item?.category)
      const mediaCategory = normalizeCategory(item?.mediaCategory)
      return category === 'HEROSECTION' || mediaCategory === 'HEROSECTION'
    })
    const sortedHeroItems = heroItems.sort((a: any, b: any) => {
      const aDate = a?.createdAt ? Date.parse(a.createdAt) : 0
      const bDate = b?.createdAt ? Date.parse(b.createdAt) : 0
      return bDate - aDate
    })

    if (sortedHeroItems.length > 0) {
      const apiBanners = sortedHeroItems.map((item: any) => ({
        id: item.id,
        title: item.title || fallbackBanner.title,
        description: item.description || fallbackBanner.description,
        image: resolveImageUrl(item.image),
        category: item.category || item.mediaCategory || fallbackBanner.category
      }))
      
      
      banners.value = apiBanners
      currentIndex.value = 0
      error.value = null
    } else if (items.length > 0) {
      const apiBanners = items.map((item: any) => ({
        id: item.id,
        title: item.title || fallbackBanner.title,
        description: item.description || fallbackBanner.description,
        image: resolveImageUrl(item.image),
        category: item.category || item.mediaCategory || fallbackBanner.category
      }))
    

      banners.value = apiBanners
      currentIndex.value = 0
      error.value = null
    } else {
      console.log('No HEROSECTION data from API, using fallback')
      error.value = 'No HEROSECTION banner data found'
      banners.value = [{ ...fallbackBanner }]
      currentIndex.value = 0
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.log('API failed, using fallback:', errorMessage)
    error.value = errorMessage
    banners.value = [{ ...fallbackBanner }]
    currentIndex.value = 0
  } finally {
    loading.value = false
    stopAutoSlide()
    startAutoSlide()
  }
}

// Initialize - ALWAYS shows banner immediately
onMounted(() => {
  // Show fallback immediately
  console.log('Showing fallback banner immediately')
  banners.value = [{ ...fallbackBanner }]
  currentIndex.value = 0
  
  // Try to fetch from API in background
  fetchBanners()
  
  // Also try again after 3 seconds if failed
  setTimeout(() => {
    if (error.value) {
      console.log('Retrying API fetch...')
      fetchBanners()
    }
  }, 3000)
})

onMounted(() => {
  // Refresh media banners using hook
  const { banners: mediaBanners, refresh: refreshMedia } = useMediaHook()
  watch(mediaBanners, (val) => {
    if (val && val.length > 0) {
      banners.value = val
      error.value = null
    }
  })
  refreshMedia()
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 6;
  transition: background 0.2s ease, transform 0.2s ease;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.65);
  transform: translateY(-50%) scale(1.05);
}

.nav-prev {
  left: 16px;
}

.nav-next {
  right: 16px;
}

.nav-icon {
  font-size: 28px;
  line-height: 1;
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
