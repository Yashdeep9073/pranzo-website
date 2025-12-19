<template>
  <section class="best sells pb-80">
    <div class="container container-lg">
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Daily Best Sells</h5>
        <div @click="add">ajs</div>
        </div>
      </div>

      <div class="row g-12">
        <!-- Left Products Section -->
        <div class="col-xxl-8">
          <div class="row gy-4">
            <!-- Product 1 -->
            <div class="col-md-6">
              <div class="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                <div class="">
                  <span class="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50%</span>
                  <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                    <img src="/assets/images/thumbs/best-sell1.png" alt="">
                  </NuxtLink>
                  <div class="countdown">
                    <ul class="countdown-list style-three flex-align flex-wrap">
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown1.days }}</span>Days
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown1.hours }}</span>Hours
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown1.minutes }}</span>Min
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown1.seconds }}</span>Sec
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-card__content">
                  <div class="product-card__price mb-16">
                    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                    <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  </div>
                  <div class="flex-align gap-6">
                    <span class="text-xs fw-bold text-gray-600">4.8</span>
                    <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-bold text-gray-600">(17k)</span>
                  </div>
                  <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                  </h6>
                  <div class="flex-align gap-4">
                    <span class="text-main-600 text-md d-flex"><i class="ph-fill ph-storefront"></i></span>
                    <span class="text-gray-500 text-xs">By Lucky Supermarket</span>
                  </div>
                  <div class="mt-12">
                    <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                    </div>
                    <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                  </div>
                  <button @click="addToCart(1)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Product 2 -->
            <div class="col-md-6">
              <div class="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                <div class="">
                  <span class="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50%</span>
                  <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                    <img src="/assets/images/thumbs/best-sell2.png" alt="">
                  </NuxtLink>
                  <div class="countdown">
                    <ul class="countdown-list style-three flex-align flex-wrap">
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown2.days }}</span>Days
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown2.hours }}</span>Hours
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown2.minutes }}</span>Min
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown2.seconds }}</span>Sec
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-card__content">
                  <div class="product-card__price mb-16">
                    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                    <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  </div>
                  <div class="flex-align gap-6">
                    <span class="text-xs fw-bold text-gray-600">4.8</span>
                    <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-bold text-gray-600">(17k)</span>
                  </div>
                  <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                  </h6>
                  <div class="flex-align gap-4">
                    <span class="text-main-600 text-md d-flex"><i class="ph-fill ph-storefront"></i></span>
                    <span class="text-gray-500 text-xs">By Lucky Supermarket</span>
                  </div>
                  <div class="mt-12">
                    <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                    </div>
                    <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                  </div>
                  <button @click="addToCart(2)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Product 3 -->
            <div class="col-md-6">
              <div class="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                <div class="">
                  <span class="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50%</span>
                  <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                    <img src="/assets/images/thumbs/best-sell3.png" alt="">
                  </NuxtLink>
                  <div class="countdown">
                    <ul class="countdown-list style-three flex-align flex-wrap">
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown3.days }}</span>Days
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown3.hours }}</span>Hours
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown3.minutes }}</span>Min
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown3.seconds }}</span>Sec
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-card__content">
                  <div class="product-card__price mb-16">
                    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                    <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  </div>
                  <div class="flex-align gap-6">
                    <span class="text-xs fw-bold text-gray-600">4.8</span>
                    <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-bold text-gray-600">(17k)</span>
                  </div>
                  <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                  </h6>
                  <div class="flex-align gap-4">
                    <span class="text-main-600 text-md d-flex"><i class="ph-fill ph-storefront"></i></span>
                    <span class="text-gray-500 text-xs">By Lucky Supermarket</span>
                  </div>
                  <div class="mt-12">
                    <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                    </div>
                    <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                  </div>
                  <button @click="addToCart(3)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Product 4 -->
            <div class="col-md-6">
              <div class="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                <div class="">
                  <span class="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50%</span>
                  <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                    <img src="/assets/images/thumbs/best-sell4.png" alt="">
                  </NuxtLink>
                  <div class="countdown">
                    <ul class="countdown-list style-three flex-align flex-wrap">
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown4.days }}</span>Days
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown4.hours }}</span>Hours
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown4.minutes }}</span>Min
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ countdown4.seconds }}</span>Sec
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-card__content">
                  <div class="product-card__price mb-16">
                    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                    <span class="text-heading text-md fw-semibold">$14.99 <span class="text-gray-500 fw-normal">/Qty</span></span>
                  </div>
                  <div class="flex-align gap-6">
                    <span class="text-xs fw-bold text-gray-600">4.8</span>
                    <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-bold text-gray-600">(17k)</span>
                  </div>
                  <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets Vegetables</NuxtLink>
                  </h6>
                  <div class="flex-align gap-4">
                    <span class="text-main-600 text-md d-flex"><i class="ph-fill ph-storefront"></i></span>
                    <span class="text-gray-500 text-xs">By Lucky Supermarket</span>
                  </div>
                  <div class="mt-12">
                    <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar bg-main-600 rounded-pill" style="width: 35%"></div>
                    </div>
                    <span class="text-gray-900 text-xs fw-medium mt-8">Sold: 18/35</span>
                  </div>
                  <button @click="addToCart(4)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Banner Card -->
        <div class="col-xxl-4">
          <div class="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 h-100">
            <div class="">
              <img src="/assets/images/bg/special-snacks.png" alt="" class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img">
            </div>
            <div class="py-xl-4">
              <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                <img src="/assets/images/thumbs/offer-logo.png" alt="">
              </div>
              <h5 class="mb-8">$5 off your first order</h5>
              <div class="flex-align gap-8">
                <span class="text-sm fw-medium text-heading">Delivery by 6:15am</span>
                <span class="text-xs text-heading">Expire Aug 5</span>
              </div>
              <NuxtLink to="/shop" class="mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8">
                Shop Now
                <span class="icon text-xl d-flex"><i class="ph ph-arrow-right"></i></span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
function add(){
  console.log("hey")  
}  
// Countdown timers for each product
const countdown1 = ref({ days: '02', hours: '08', minutes: '30', seconds: '45' })
const countdown2 = ref({ days: '01', hours: '12', minutes: '15', seconds: '20' })
const countdown3 = ref({ days: '03', hours: '06', minutes: '45', seconds: '10' })
const countdown4 = ref({ days: '00', hours: '23', minutes: '59', seconds: '59' })

// Add to cart function
const addToCart = (productId) => {
  console.log('Added to cart:', productId)
}

// Update all countdowns
let timerInterval

const updateCountdown = (countdown) => {
  let seconds = parseInt(countdown.seconds)
  let minutes = parseInt(countdown.minutes)
  let hours = parseInt(countdown.hours)
  let days = parseInt(countdown.days)

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

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  }
}

onMounted(() => {
  timerInterval = setInterval(() => {
    countdown1.value = updateCountdown(countdown1.value)
    countdown2.value = updateCountdown(countdown2.value)
    countdown3.value = updateCountdown(countdown3.value)
    countdown4.value = updateCountdown(countdown4.value)
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
/* Add any minimal styles if needed */
.product-card.style-two:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cover-img {
  object-fit: cover;
}
</style>