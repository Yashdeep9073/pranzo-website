<template>
  <section v-if="!loading && banners.length > 0" class="hero-banner">
    <div class="banner-main">
      <div class="banner-slider">
        <div class="slide active">
          <!-- Background Image -->
          <Transition name="slide-fade">
            <img v-if="currentBanner" :key="currentBanner.image" :src="currentBanner.image" :alt="currentBanner.title"
              class="banner-image" />
          </Transition>

          <!-- Overlay -->
          <div class="overlay"></div>

          <!-- Content -->
          <Transition name="slide-content-fade">
            <NuxtLink v-if="currentBanner" :key="currentBanner.title" to="/shop-all" class="banner-content-link">
              <div class="content">
                <span class="subtitle">{{ currentBanner.description }}</span>
                <h1 class="title">{{ currentBanner.title }}</h1>
              </div>
            </NuxtLink>
          </Transition>
        </div>

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
  }, 3000)
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
  width: 100%;
  min-height: 250px;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  /* Ensure banner takes full viewport width on mobile */
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
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
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.loading-state:hover {
  background: rgba(255, 255, 255, 0.95);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: #CA2D52;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Banner Main (always visible) */
.banner-main {
  width: 100%;
  min-height: 250px;
  /* Reduced from 450px */
}

.banner-slider {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide {
  position: relative;
  min-height: 350px;
  /* Reduced from 450px */
}

.banner-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

.banner-content-link {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
  color: inherit;
}

.banner-content-link:hover {
  transform: none;
}

.banner-content-link:hover .content {
  transform: none;
}

.banner-content-link:hover .overlay {
  background: rgba(0, 0, 0, 0.3);
}

.banner-content-link:hover .banner-image {
  transform: none;
}

/* Crossfade transition for smooth image changes */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-fade-enter-from {
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}

/* Crossfade transition for content */
.slide-content-fade-enter-active,
.slide-content-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.slide-content-fade-enter-from {
  opacity: 0;
}

.slide-content-fade-leave-to {
  opacity: 0;
}

/* Enhanced animations */
@keyframes slideInFadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }

  100% {
    background-position: 200% center;
  }
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.content {
  position: relative;
  height: 350px;
  /* Reduced from 450px */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  width: 100%;
  max-width: min(100%, 1100px);
  margin: 0 auto;
  padding: 20px 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 1px;
  max-width: min(90vw, 900px);
  overflow-wrap: anywhere;
  word-break: break-word;
  opacity: 1;
}

.title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 25px;
  line-height: 1.3;
  max-width: min(90vw, 980px);
  overflow-wrap: anywhere;
  word-break: break-word;
  opacity: 1;
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
  backdrop-filter: blur(4px);
}

.error-indicator:hover {
  background: rgba(255, 59, 48, 0.95);
}

/* Responsive */
@media (max-width: 1200px) {
  .content {
    max-width: min(100%, 960px);
    padding: 18px 20px;
  }

  .title {
    font-size: 32px;
    max-width: min(92vw, 880px);
  }

  .subtitle {
    font-size: 17px;
    max-width: min(92vw, 800px);
  }
}

@media (max-width: 1024px) {
  .hero-banner {
    margin-bottom: 2.5rem;
  }

  .content {
    max-width: min(100%, 880px);
    padding: 16px 18px;
  }

  .title {
    font-size: 30px;
    max-width: min(94vw, 800px);
    margin-bottom: 20px;
  }

  .subtitle {
    font-size: 16px;
    max-width: min(94vw, 750px);
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 30vh;
    /* Reduced from 35vh */
  }

  .hero-banner {
    margin-bottom: 2rem;
    /* Reset full viewport width on mobile */
    margin-left: 0;
    margin-right: 0;
  }

  .banner-image {
    object-position: center;
    height: 30vh;
    object-fit: cover;
  }

  .content {
    padding: 14px 16px;
    max-width: min(100%, 720px);
  }

  .title {
    font-size: 28px;
    line-height: 1.25;
    max-width: 96vw;
    margin-bottom: 14px;
  }

  .subtitle {
    font-size: 16px;
    line-height: 1.35;
    letter-spacing: 0.4px;
    max-width: 96vw;
    margin-bottom: 10px;
  }

  .loading-state {
    top: 8px;
    right: 8px;
    padding: 4px 8px;
  }

  .spinner {
    width: 16px;
    height: 16px;
  }

  .error-indicator {
    bottom: 8px;
    right: 8px;
    font-size: 11px;
  }
}

@media (max-width: 640px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 25vh;
    /* Reduced from 30vh */
  }

  .hero-banner {
    margin-bottom: 1.8rem;
  }

  .banner-image {
    height: 25vh;
    object-fit: cover;
  }

  .content {
    padding: 12px 14px;
    justify-content: flex-start;
    padding-top: 15vh;
    /* Relative positioning */
  }

  .title {
    font-size: 26px;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 15px;
    line-height: 1.3;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 20vh;
    /* Reduced from 25vh */
  }

  .hero-banner {
    margin-bottom: 1.5rem;
  }

  .banner-image {
    height: 20vh;
    object-fit: cover;
  }

  .content {
    padding: 10px 12px;
    padding-top: 12vh;
    /* Adjusted relative positioning */
    justify-content: flex-start;
  }

  .title {
    font-size: 22px;
    line-height: 1.2;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 14px;
    line-height: 1.3;
    margin-bottom: 6px;
  }

  .overlay {
    background: rgba(0, 0, 0, 0.4);
  }

  .loading-state {
    top: 6px;
    right: 6px;
    padding: 3px 6px;
    font-size: 11px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border-width: 1.5px;
  }

  .error-indicator {
    bottom: 6px;
    right: 6px;
    font-size: 10px;
    padding: 3px 6px;
  }
}

@media (max-width: 414px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 25vh;
    /* Reduced from 35vh */
  }

  .content {
    padding: 8px 10px;
    padding-top: 10vh;
  }

  .title {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 13px;
    margin-bottom: 5px;
  }
}

@media (max-width: 375px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 22vh;
    /* Reduced from 30vh */
  }

  .content {
    padding: 6px 8px;
    padding-top: 8vh;
  }

  .title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .subtitle {
    font-size: 12px;
    margin-bottom: 4px;
  }
}

@media (max-width: 360px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 20vh;
    /* Reduced from 28vh */
  }

  .title {
    font-size: 17px;
    margin-bottom: 5px;
  }

  .subtitle {
    font-size: 11px;
    margin-bottom: 3px;
  }

  .content {
    padding: 4px 6px;
    padding-top: 6vh;
  }
}

@media (max-width: 320px) {

  .hero-banner,
  .banner-main,
  .slide,
  .content {
    min-height: 18vh;
    /* Reduced from 25vh */
  }

  .content {
    padding: 2px 4px;
    padding-top: 5vh;
  }

  .title {
    font-size: 16px;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 10px;
    margin-bottom: 2px;
  }
}

/* Enhanced mobile hover effects */
@media (hover: none) {
  .banner-content-link:hover {
    transform: none;
  }

  .banner-content-link:hover .content {
    transform: none;
  }

  .banner-content-link:hover .overlay {
    background: rgba(0, 0, 0, 0.3);
  }

  .banner-content-link:hover .banner-image {
    transform: none;
  }
}
</style>
