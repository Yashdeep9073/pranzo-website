<!-- components/FlashSales.vue -->
<template>
  <div class="product pt-60">
    <div class="container container-lg">
      <!-- Section Heading -->
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Flash Sales Today</h5>
          <div class="flex-align gap-16">
            <NuxtLink to="/shop" class="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
              View All Deals
            </NuxtLink>
            <div class="flex-align gap-8">
              <button 
                type="button" 
                class="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                @click="slidePrev"
              >
                <i class="ph ph-caret-left"></i>
              </button>
              <button 
                type="button" 
                class="slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                @click="slideNext"
              >
                <i class="ph ph-caret-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Swiper Products Slider -->
      <div ref="swiperContainer" class="swiper productSwiper">
        <div class="swiper-wrapper">
          <!-- Product 1 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img26.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img27.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 3 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img28.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 4 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img29.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 5 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img30.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 6 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img13.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Product 7 -->
          <div class="swiper-slide">
            <div class="product-card px-20 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
              <NuxtLink to="/cart" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                Add <i class="ph ph-shopping-cart"></i> 
              </NuxtLink>
              
              <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                <img 
                  src="/assets/images/thumbs/product-img3.png" 
                  alt="Taylor Farms Broccoli Florets Vegetables"
                  width="200"
                  height="200"
                >
              </NuxtLink>
              <div class="product-card__content mt-12">
                <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                  <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                </div>
                <div class="flex-align gap-6">
                  <span class="text-xs fw-bold text-gray-600">4.8</span>
                  <span class="text-15 fw-bold text-warning-600 d-flex">
                    <i class="ph-fill ph-star"></i>
                  </span>
                  <span class="text-xs fw-bold text-gray-600">(17k)</span>
                </div>
                <h6 class="title text-lg fw-semibold mt-12 mb-20">
                  <NuxtLink to="/product-details" class="link text-line-2">
                    Taylor Farms Broccoli Florets Vegetables
                  </NuxtLink>
                </h6>
                <div class="mt-12">
                  <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar">
                    <div class="progress-bar bg-main-600 rounded-pill" :style="{ width: '35%' }"></div>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
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
interface SwiperInstance {
  slideNext: () => void
  slidePrev: () => void
  destroy: () => void
}

const swiperInstance = ref<SwiperInstance | null>(null)
const swiperContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (import.meta.client && swiperContainer.value) {
    try {
      const Swiper = await import('swiper')
      const { Navigation, Autoplay } = await import('swiper/modules')
      
      // Initialize Swiper for products
      swiperInstance.value = new Swiper.default(swiperContainer.value, {
        modules: [Navigation, Autoplay],
        loop: true,
        slidesPerView: 5,
        spaceBetween: 16,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.slick-next',
          prevEl: '.slick-prev',
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 12
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 14
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 16
          }
        }
      }) as SwiperInstance

      console.log('Product Swiper initialized successfully')
    } catch (error) {
      console.error('Product Swiper loading error:', error)
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
.product {
  background: #f8fafc;
}

.section-heading h5 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Product Card Styles */
.product-card {
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.product-card__cart {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.product-card:hover .product-card__cart {
  opacity: 1;
  transform: translateY(0);
}

.product-card__thumb {
  height: 180px;
  padding: 20px;
}

.product-card__thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-card__thumb img {
  transform: scale(1.05);
}

.product-card__content {
  text-align: center;
}

.title a {
  color: #1e293b;
  text-decoration: none;
  transition: color 0.3s ease;
}

.title a:hover {
  color: #4f46e5;
}

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Progress Bar */
.progress {
  background-color: #e2e8f0;
}

.progress-bar {
  transition: width 0.3s ease;
}

/* Swiper Styles */
.productSwiper {
  padding: 20px 10px;
  margin: 0 -10px;
}

.swiper-slide {
  height: auto;
}

/* Navigation Buttons */
.slick-prev, .slick-next {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.slick-prev:hover, .slick-next:hover {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .product {
    padding-top: 40px !important;
  }
  
  .section-heading {
    text-align: center;
  }
  
  .flex-between {
    justify-content: center;
  }
  
  .product-card {
    padding: 15px 12px !important;
  }
  
  .product-card__thumb {
    height: 150px;
  }
}
</style>