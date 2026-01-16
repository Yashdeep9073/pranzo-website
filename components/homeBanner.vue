<!-- components/homeBanner.vue -->
<template>
  <div class="banner pb-0">
    <div class="banner-item position-relative">
      <!-- Static Camera Background (First Layer) -->
      <!-- <div class="static-camera-bg position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100">
        <img  
          src="/assets/images/recommended/camera.webp" 
          alt="Banner Background"
          class="w-100 h-100 object-fit-cover opacity-50"
        >
      </div> -->

      <!-- Swiper Container for API Images (Second Layer) -->
      <div ref="swiperContainer" class="swiper bannerSwiper">
        <div class="swiper-wrapper">
          <!-- Dynamic Background Slides -->
          <div v-for="(banner, index) in banners" :key="banner.id" class="swiper-slide">
            <div class="banner-slide position-relative">
              <!-- API Background Image -->
              <img :src="banner.image" :alt="banner.title || `Banner Image ${index + 1}`"
                class="api-bg position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover">

              <!-- Overlay for better text visibility -->
              <div class="banner-overlay position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100"></div>

              <!-- Content Container -->
              <div class="banner-content position-relative z-1 h-100 d-flex align-items-center">
                <div class="container container-lg">
                  <div class="row justify-content-center">
                    <div class="col-lg-10 col-xl-8 text-center">
                      <!-- Text Content -->
                      <div class="banner-text-wrapper">
                        <span class="banner-subtitle fw-semibold text-white text-uppercase mb-3 d-block">
                          {{ banner.description || 'Save up to 50% off on your first order' }}
                        </span>
                        <h1 class="banner-title text-white mb-4">
                          <div class="title-line">{{ banner.title || 'Daily Grocery Order and' }}</div>
                          <div class="title-line">
                            Get <span class="text-main-600">Express</span> Delivery
                          </div>
                        </h1>

                        <!-- Call to Action Button -->
                        <NuxtLink to="/shop-all">
                          <div class="banner-actions mt-5">
                            <button class="btn btn-primary btn-lg px-5 py-3 fw-semibold">
                              Shop Now <i class="fas fa-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Swiper Pagination (Dots) -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const config = useRuntimeConfig() 
const API_URL = config.public.api.Media
const API_URL_Category = config.public.api.categories
// Type definitions
interface BannerItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

interface SwiperInstance {
  slideNext: () => void
  slidePrev: () => void
  destroy: () => void
}

const swiperInstance = ref<SwiperInstance | null>(null)
const swiperContainer = ref<HTMLElement | null>(null)
const banners = ref<BannerItem[]>([])

// Fetch banners from API
const fetchBanners = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch banners')
    }
    const data = await response.json()
    if (data.data) {
      // Filter for BANNER category
      banners.value = data.data
        .filter((item: BannerItem) => item.category === 'BANNER')
        .slice(0, 3)
      console.log('Banners loaded:', banners.value)
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
  }
}

onMounted(async () => {
  // Fetch banners first
  await fetchBanners()

  if (import.meta.client && swiperContainer.value && banners.value.length > 0) {
    try {
      const Swiper = await import('swiper')
      const { Autoplay, EffectFade, Pagination } = await import('swiper/modules')

      // Initialize Swiper
      swiperInstance.value = new Swiper.default(swiperContainer.value, {
        modules: [Autoplay, EffectFade, Pagination],
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        speed: 1500, // Slower transition
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      }) as SwiperInstance

      console.log('Swiper initialized successfully')
    } catch (error) {
      console.error('Swiper loading error:', error)
    }
  }
})

onUnmounted(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy()
    swiperInstance.value = null
  }
})
</script>

<style scoped>
.banner {
  min-height: 450px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
}

.banner-item {
  min-height: 450px;
}

/* Static Camera Background */
.static-camera-bg {
  z-index: 1;
  filter: brightness(0.7);
  animation: superSlowZoom 40s infinite alternate ease-in-out;
}

.static-camera-bg img {
  filter: blur(1px);
}

.banner-slide {
  min-height: 450px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.api-bg {
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: brightness(0.8);
  animation: extremelySlowZoom 10s infinite alternate ease-in-out;
}

.banner-overlay {
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
  z-index: 1;
}

/* Content Styling */
.banner-content {
  min-height: 130px;
  z-index: 3;
}

.banner-text-wrapper {
  padding: 1.5rem;
  position: relative;
  animation: fadeInUp 1s ease;
  position: absolute;
  bottom: 20px;
}

.banner-subtitle {

  font-size: 1rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.75rem !important;
  opacity: 0.9;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.title-line {
  display: block;
  margin-bottom: 0.5rem;
  animation: none !important;
  transform: none !important;
}

.banner-title .text-main-600 {
  color: #ff6b35 !important;
  position: relative;
  display: inline-block;
}

/* Stable underline - No animation */
.banner-title .text-main-600::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #ff6b35;
  transform: scaleX(1);
  animation: none;
}

/* Button Styling */
.banner-actions .btn-primary {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 20px rgba(255, 107, 53, 0.4),
    0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 0.75rem 2rem;
}

.banner-actions .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 25px rgba(255, 107, 53, 0.5),
    0 6px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ff8e53, #ff6b35);
}

.banner-actions .btn-primary:active {
  transform: translateY(-1px);
}

/* Swiper Styles */
.bannerSwiper {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.swiper-slide {
  height: auto;
  opacity: 0;
  transition: opacity 1.5s ease !important;
}

.swiper-slide-active {
  opacity: 1;
}

/* Swiper Pagination - All Grey Dots */
.swiper-pagination {
  bottom: 15px !important;
}

.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3) !important;
  opacity: 1;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.swiper-pagination-bullet-active {
  background: rgba(0, 0, 0, 0.7) !important;
  border-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.2);
}

.swiper-pagination-bullet-active {
  background: green;
}

@keyframes superSlowZoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.02);
  }
}

@keyframes extremelySlowZoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.01);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 350px;
  }

  .banner-title {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 300px;
    /* Adjusted */
  }

  .banner-title {
    font-size: 1.8rem;
    /* Reduced */
  }

  .banner-subtitle {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }

  .banner-actions .btn-primary {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 250px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .banner-text-wrapper {
    padding: 1rem;
  }

  .banner-subtitle {
    font-size: 0.8rem;
    letter-spacing: 1px;
    margin-bottom: 0.5rem !important;
  }

  .swiper-pagination {
    bottom: 10px !important;
  }
}

@media (max-width: 576px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 200px;
  }

  .banner-title {
    font-size: 1.2rem;
  }

  .banner-subtitle {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  .banner-actions .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    margin-top: 0.5rem !important;
  }

  .banner-text-wrapper {
    padding: 0.75rem;
  }

  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 375px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 180px;
  }

  .banner-title {
    font-size: 1rem;
    display: none;
  }

  .banner-subtitle {
    font-size: 0.65rem;
    display: none;
  }
}
</style>