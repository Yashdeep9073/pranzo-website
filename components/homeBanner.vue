<!-- components/homeBanner.vue -->
<template>
  <div class="banner">
    <div class="container container-lg">
      <div class="banner-item rounded-24 overflow-hidden position-relative arrow-center">
        <!-- Scroll Down Button -->
        <a 
          href="#featureSection" 
          class="scroll-down w-84 h-84 text-center flex-center bg-main-600 rounded-circle border border-5 text-white border-white position-absolute start-50 translate-middle-x bottom-0 hover-bg-main-800"
        >
          <span class="icon line-height-0">
            <i class="ph ph-caret-double-down"></i>
          </span> 
        </a>

        <!-- Background Image -->
        <img 
          src="/assets/images/bg/banner-bg.png" 
          alt="Banner Background" 
          class="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24"
        >

        <!-- Navigation Buttons -->
        <div class="flex-align">
          <button 
            type="button" 
            class="slick-prev slick-arrow flex-center rounded-circle box-shadow-4xl bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
            @click="slidePrev"
          >
            <i class="ph ph-caret-left"></i>
          </button>
          <button 
            type="button" 
            class="slick-next slick-arrow flex-center rounded-circle box-shadow-4xl bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
            @click="slideNext"
          >
            <i class="ph ph-caret-right"></i>
          </button>
        </div>

        <!-- Swiper Container -->
        <div ref="swiperContainer" class="swiper bannerSwiper">
          <div class="swiper-wrapper">
            <!-- Dynamic Slides -->
            <div 
              v-for="(banner, index) in banners" 
              :key="banner.id"
              class="swiper-slide"
            >
              <div class="banner-slider__item">
                <div class="banner-slider__inner flex-between position-relative">
                  <!-- Left Side - Dynamic Image -->
                  <div class="banner-item__thumb">
                    <img 
                      :src="banner.image" 
                      :alt="banner.title || `Banner Image ${index + 1}`"
                      width="500"
                      height="400"
                    >
                  </div>

                  <!-- Right Side - Content (Centered) -->
                  <div class="banner-item__content text-center">
                    <span class="fw-semibold text-success-600 text-capitalize mb-8 d-block">
                      {{ banner.description || 'Save up to 50% off on your first order' }}
                    </span>
                    <h2 class="banner-item__title mb-30">
                      {{ banner.title || 'Daily Grocery Order and' }} <br>
                      Get <span class="text-main-600">Express</span> Delivery
                    </h2>
                    <div class="d-flex align-items-center gap-16 justify-content-center">
                      <NuxtLink to="/shop" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-8">
                        Explore Shop 
                        <span class="icon text-xl d-flex">
                          <i class="ph ph-shopping-cart-simple"></i>
                        </span> 
                      </NuxtLink>
                      <div class="d-flex align-items-end gap-8">
                        <span class="text-heading fst-italic text-sm">Starting at</span>
                        <h6 class="text-danger-600 mb-0"> $60.99</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    const response = await fetch('https://kartmania-api.vibrantick.org/common/media/read')
    if (!response.ok) {
      throw new Error('Failed to fetch banners')
    }
    const data = await response.json()
    if (data.data) {
      // Filter for BANNER category and limit to first few (e.g., 2-3)
      banners.value = data.data
        .filter((item: BannerItem) => item.category === 'BANNER')
        .slice(0, 3) // Adjust limit as needed
      console.log('Banners loaded:', banners.value)
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
  }
}

onMounted(async () => {
  // Fetch banners first
  await fetchBanners()

  if (import.meta.client && swiperContainer.value) {
    try {
      const Swiper = await import('swiper')
      const { Autoplay, EffectFade } = await import('swiper/modules')
      
      // Initialize Swiper only if banners are available
      if (banners.value.length > 0) {
        // Initialize Swiper
        swiperInstance.value = new Swiper.default(swiperContainer.value, {
          modules: [Autoplay, EffectFade],
          loop: true,
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          speed: 1000,
        }) as SwiperInstance

        console.log('Swiper initialized successfully')
      }
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

const slideNext = (): void => {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  }
}

const slidePrev = (): void => {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  }
}
</script>

<style scoped>
.banner {
  min-height: 600px;
  position: relative;
}

.banner-item {
  min-height: 600px;
  padding: 40px 0;
}

.banner-img {
  object-fit: cover;
}

.banner-slider__inner {
  padding: 60px 0;
  min-height: 500px;
  align-items: center;
  display: flex;
  gap: 40px;
}

/* Left Side - Image */
.banner-item__thumb {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-item__thumb img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}

/* Right Side - Content */
.banner-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-left: 20px;
}

.banner-item__title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: #2d3748;
}

.banner-item__content .text-success-600 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

/* Button Styles */
.btn-main {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

/* Price Styles */
.text-danger-600 {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Swiper specific styles */
.bannerSwiper {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.swiper-slide {
  height: auto;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.swiper-slide-active {
  opacity: 1;
}

/* Navigation Buttons */
.flex-align {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
  transform: translateY(-50%);
}

.slick-prev, .slick-next {
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner-slider__inner {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .banner-item__content {
    padding-left: 0;
  }
  
  .banner-item__title {
    font-size: 2rem;
  }
}
</style>