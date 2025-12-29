<!-- components/homeBanner.vue -->
<template>
  <div class="banner">
    <div class="container container-lg">
      <div class="banner-item rounded-24 overflow-hidden position-relative arrow-center">
        <!-- Background Image -->
       <img 
  src="/assets/images/buysection/full-shop.jpg"
  alt="Banner Background"
  class="banner-img position-absolute inset-0 w-100 h-100 object-fit-cover rounded-24"
/>


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
                  <!-- Left Side - Content -->
                  <div class="banner-item__content">
                    <!-- Top Tagline -->
                    <div class="banner-tagline mb-16">
                      <span class="fw-bold text-uppercase text-white bg-danger-500 px-16 py-4 rounded-pill">
                        END OF YEAR SALE
                      </span>
                    </div>
                    
                    <!-- Main Heading -->
                    <h1 class="banner-main-heading text-white mb-12">
                      HIGH ENERGY,<br>
                      <span class="text-warning-400">HIGHER SAVINGS</span>
                    </h1>
                    
                    <!-- Discount Badge -->
                    <div class="discount-badge mb-20">
                      <div class="discount-amount bg-white text-dark px-24 py-8 rounded-pill d-inline-block">
                        <span class="fw-black display-4">50-70%</span>
                        <span class="fw-bold text-uppercase ms-8">OFF</span>
                      </div>
                    </div>
                    
                    <!-- Date Range -->
                    <div class="date-range text-white mb-24">
                      <span class="fw-semibold text-uppercase">DEC 25 - 30</span>
                    </div>
                    
                    <!-- Category Tags -->
                    <div class="category-tags d-flex gap-16 mb-30">
                      <NuxtLink to="/shop-all?category=Women" >
                      <span class="category-tag bg-white text-dark px-20 py-8 rounded-pill fw-semibold">
                        FOR HER 
                      </span>
                      </NuxtLink>
                       <NuxtLink  to="/shop-all?category=Men">
                      <span class="category-tag bg-white text-dark px-20 py-8 rounded-pill fw-semibold">
                        FOR HIM 
                      </span>
                      </NuxtLink>
                    </div>
                    
                    <!-- CTA Button -->
                    <NuxtLink to="/shop-all" class="btn btn-shop-now">
                      SHOP NOW
                      <span class="icon ms-8">
                        <i class="ph ph-arrow-right"></i>
                      </span>
                    </NuxtLink>
                  </div>

                  <!-- Right Side - Product Image -->
                  <div class="banner-item__thumb">
                    <img 
                      :src="banner.image" 
                      :alt="banner.title || `Banner Image ${index + 1}`"
                      width="600"
                      height="500"
                      class="banner-product-img"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <!-- <button 
          type="button" 
          class="swiper-button-prev slick-arrow flex-center rounded-circle box-shadow-4xl bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
          @click="slidePrev"
        >
          <i class="ph ph-caret-left"></i>
        </button>
        <button 
          type="button" 
          class="swiper-button-next slick-arrow flex-center rounded-circle box-shadow-4xl bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
          @click="slideNext"
        >
          <i class="ph ph-caret-right"></i>
        </button> -->

        <!-- Pagination Dots -->
        <div class="swiper-pagination"></div>
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
      // Filter for BANNER category and limit to first few
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

  if (import.meta.client && swiperContainer.value) {
    try {
      const Swiper = await import('swiper')
      const { Autoplay, Navigation, Pagination } = await import('swiper/modules')
      
      // Initialize Swiper only if banners are available
      if (banners.value.length > 0) {
        // Initialize Swiper
        swiperInstance.value = new Swiper.default(swiperContainer.value, {
          modules: [Autoplay, Navigation, Pagination],
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          speed: 1000,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
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
  min-height: 500px;
  position: relative;
  margin-top: 20px;
}

.banner-item {
  min-height: 500px;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  position: relative;
  overflow: hidden;
}

.banner-slider__inner {
  padding: 40px 60px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

/* Left Content Side */
.banner-item__content {
  flex: 1;
  max-width: 50%;
  padding-right: 40px;
}

.banner-tagline {
  animation: fadeInDown 0.8s ease;
}

.banner-main-heading {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.5px;
  text-transform: uppercase;
  animation: fadeInLeft 0.8s ease 0.2s both;
}

.discount-badge {
  animation: bounceIn 0.8s ease 0.4s both;
}

.discount-amount {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.discount-amount span:first-child {
  font-size: 3.5rem;
  line-height: 1;
}

.date-range {
  font-size: 1.2rem;
  letter-spacing: 2px;
  animation: fadeInLeft 0.8s ease 0.6s both;
}

.category-tags {
  animation: fadeInUp 0.8s ease 0.8s both;
}

.category-tag {
  transition: transform 0.3s ease;
}

.category-tag:hover {
  transform: translateY(-3px);
}

/* CTA Button */
.btn-shop-now {
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  animation: fadeInUp 0.8s ease 1s both;
}

.btn-shop-now:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(255, 107, 107, 0.6);
  color: white;
}

/* Right Image Side */
.banner-item__thumb {
  flex: 1;
  max-width: 50%;
  text-align: center;
  animation: fadeInRight 0.8s ease 0.4s both;
}

.banner-product-img {
  max-width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3));
}

/* Swiper Styles */
.bannerSwiper {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.swiper-slide {
  opacity: 0.5;
  transition: opacity 0.5s ease;
}

.swiper-slide-active {
  opacity: 1;
}

/* Navigation Buttons */
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  z-index: 10;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-prev {
  left: 20px;
}

.swiper-button-next {
  right: 20px;
}

/* Pagination Dots */
.swiper-pagination {
  bottom: 20px !important;
}

.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background: #ff6b6b;
  transform: scale(1.2);
}

/* Animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .banner-main-heading {
    font-size: 2.8rem;
  }
  
  .discount-amount span:first-child {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .banner-slider__inner {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    gap: 30px;
  }
  
  .banner-item__content,
  .banner-item__thumb {
    max-width: 100%;
    padding-right: 0;
  }
  
  .banner-main-heading {
    font-size: 2.2rem;
  }
  
  .discount-amount span:first-child {
    font-size: 2.2rem;
  }
  
  .banner-product-img {
    max-height: 300px;
  }
  
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}
</style>