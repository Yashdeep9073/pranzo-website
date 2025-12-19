<template>
  <section class="hot-deals pt-80 overflow-hidden">
    <div class="container container-lg">
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Hot Deals Today</h5>
          <div class="flex-align gap-16">
            <NuxtLink to="/shop" class="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
              View All Deals
            </NuxtLink>
            <div class="flex-align gap-8">
              <button type="button" class="deals-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                <i class="ph ph-caret-left"></i>
              </button>
              <button type="button" class="deals-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                <i class="ph ph-caret-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row g-12">
        <!-- Left Banner Card -->
        <div class="col-md-4">
          <div class="hot-deals position-relative rounded-16 bg-main-600 overflow-hidden ps-40 pe-24 pt-80 pb-120 z-1">
            <img src="/assets/images/shape/offer-shape.png" alt="" class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 opacity-6">

            <img src="/assets/images/thumbs/basket-img.png" alt="Basket Thumb" class="position-absolute inset-inline-end-0 inset-block-end-0">
            
            <span class="text-primary-600 bg-yellow text-heading py-4 px-12 rounded-4 text-sm fw-medium">Medical equipment</span>
            <div class="">
              <h5 class="text-white mb-8 mt-12">Deals of the day</h5>
              <p class="fw-semibold text-success-600">Save up to 50% off on your first order</p>
              <div class="countdown mt-24 mb-24">
                <ul class="countdown-list d-flex align-items-center flex-wrap">
                  <li class="countdown-list__item py-8 px-12 text-heading flex-align gap-4 text-sm fw-medium colon-white">
                    <span>{{ countdown.days }}</span> D
                  </li>
                  <li class="countdown-list__item py-8 px-12 text-heading flex-align gap-4 text-sm fw-medium colon-white">
                    <span>{{ countdown.hours }}</span> H
                  </li>
                  <li class="countdown-list__item py-8 px-12 text-heading flex-align gap-4 text-sm fw-medium colon-white">
                    <span>{{ countdown.minutes }}</span> M
                  </li>
                  <li class="countdown-list__item py-8 px-12 text-heading flex-align gap-4 text-sm fw-medium colon-white">
                    <span>{{ countdown.seconds }}</span> S
                  </li>
                </ul>
              </div>
              <NuxtLink to="/shop" class="mt-16 btn bg-white hover-text-white hover-bg-main-800 text-main-600 fw-medium d-inline-flex align-items-center rounded-pill gap-8">
                Explore Shop
                <span class="icon text-xl d-flex"><i class="ph-bold ph-shopping-cart"></i></span> 
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Product Slider with Swiper -->
        <div class="col-md-8">
          <div class="hot-deals-slider arrow-style-two">
            <div class="swiper-container">
              <Swiper
                :modules="[Navigation]"
                :slides-per-view="4"
                :space-between="12"
                :navigation="{
                  nextEl: '.deals-next',
                  prevEl: '.deals-prev',
                }"
                :breakpoints="{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  576: { slidesPerView: 2, spaceBetween: 12 },
                  768: { slidesPerView: 3, spaceBetween: 12 },
                  992: { slidesPerView: 4, spaceBetween: 12 }
                }"
              >
                <!-- Product 1 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(1)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img26.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 2 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(2)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img27.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 3 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(3)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img28.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 4 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(4)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img29.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 5 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(5)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img30.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 6 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(6)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img13.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                <!-- Product 7 -->
                <SwiperSlide>
                  <div class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(7)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i> 
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img3.png" alt="">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span> </span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through"> $28.99</span>
                      </div>
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-600">4.8</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                        <span class="text-xs fw-bold text-gray-600">(17k)</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                      </h6>
                      <div class="mt-12">
                        <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                        </div>
                        <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Import Swiper components correctly
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Countdown timer
const countdown = ref({
  days: '07',
  hours: '09',
  minutes: '16',
  seconds: '23'
})

// Add to cart function
const addToCart = (productId) => {
  console.log('Added to cart:', productId)
}

// Update countdown timer every second
let timerInterval
onMounted(() => {
  timerInterval = setInterval(() => {
    let seconds = parseInt(countdown.value.seconds)
    let minutes = parseInt(countdown.value.minutes)
    let hours = parseInt(countdown.value.hours)
    let days = parseInt(countdown.value.days)
    
    seconds--
    
    if (seconds < 0) {
      seconds = 59
      minutes--
    }
    
    if (minutes < 0) {
      minutes = 59
      hours--
    }
    
    if (hours < 0) {
      hours = 23
      days--
    }
    
    if (days < 0) {
      days = 0
    }
    
    countdown.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
/* Add this minimal CSS for Swiper to work */
.swiper-container {
  overflow: hidden;
  position: relative;
}

.swiper-slide {
  height: auto;
}

/* Navigation buttons  */
.deals-prev,
.deals-next {
  z-index: 10; 
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #e5e7eb; /* gray-100 */
}

.deals-prev:hover,
.deals-next:hover {
  background-color: #3b82f6; 
  color: white;
  border-color: #3b82f6;
}
</style>