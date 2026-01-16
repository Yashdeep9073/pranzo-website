<template>
  <section class="hot-deals pt-80 overflow-hidden">
    <div class="container container-lg">
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Hot Deals Today</h5>


          <div class="flex-align gap-16">
            <NuxtLink to="/shop-all" class="btn btn-main d-inline-flex align-items-center gap-2
         px-4 py-2 rounded-pill text-sm fw-semibold shadow-sm">
              View All Deals
              <i class="ph ph-arrow-right"></i>

            </NuxtLink>


            <!-- <div class="flex-align gap-8">
              <button
                type="button"
                class="deals-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                @click="slidePrev"
              >
                <i class="ph ph-caret-left"></i> 
              </button>
              <button
                type="button"
                class="deals-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                @click="slideNext"
              >
                <i class="ph ph-caret-right"></i>
              </button>
            </div> -->
          </div>
        </div>
        <div class="countdown">
          <ul class="countdown-list d-flex align-items-center flex-wrap">
            <li class="countdown-list__item text-heading text-sm fw-medium">
              <span>{{ countdown.days }}</span>D
            </li>
            <li class="countdown-list__item text-heading text-sm fw-medium">
              <span>{{ countdown.hours }}</span>H
            </li>
            <li class="countdown-list__item text-heading text-sm fw-medium">
              <span>{{ countdown.minutes }}</span>M
            </li>
            <li class="countdown-list__item text-heading text-sm fw-medium">
              <span>{{ countdown.seconds }}</span>S
            </li>
          </ul>
        </div>
      </div>

      <div class="row g-12">
        <!-- Left Banner Card -->
        <div class="col-md-4">
          <div class="hot-deals position-relative rounded-16 bg-main-600 overflow-hidden ps-40 pe-24 pt-80 pb-120 z-1">
            <img src="/assets/images/shape/offer-shape.png" alt=""
              class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 opacity-6">
            <img src="/assets/images/thumbs/basket-img.png" alt="Basket Thumb"
              class="position-absolute inset-inline-end-0 inset-block-end-0">

            <span class="text-primary-600 bg-yellow text-heading mt-6
 py-4 px-12 rounded-4 text-sm fw-medium">Medical equipment

            </span>


            <div class="">
              <NuxtLink to="/shop" class="explore-shop-btn">
                Explore Shop
                <span class="icon">
                  <i class="ph-bold ph-shopping-cart"></i>
                </span>
              </NuxtLink>
              <h5 class="text-white mb-8 mt-12">Deals of the day</h5>
              <p class="fw-semibold text-success-600">Save up to 50% off on your first order</p>

              <!-- <div class="countdown mt-24 mb-24">
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
              </div> -->
              <!-- <NuxtLink to="/shop" class="mt-16 btn bg-white hover-text-white hover-bg-main-800 text-main-600 fw-medium d-inline-flex align-items-center rounded-pill gap-8">
                Explore Shop
                <span class="icon text-xl d-flex"><i class="ph-bold ph-shopping-cart"></i></span> 
              </NuxtLink> -->
            </div>
          </div>
        </div>

        <!-- Product Slider with Swiper -->
        <div class="col-md-8">
          <div class="hot-deals-slider arrow-style-two">
            <div ref="swiperContainer" class="swiper">
              <div class="swiper-wrapper">
                <!-- Product 1 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(1)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>

                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img26.png" alt="Product 26" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                   <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 2 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(2)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img27.png" alt="Product 27" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                     <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 3 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(3)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img28.png" alt="Product 28" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                   <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 4 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(4)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img29.png" alt="Product 29" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                    <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 5 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(5)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img30.png" alt="Product 30" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                   <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 6 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(6)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img13.png" alt="Product 13" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8">
                        <span class="text-heading text-md fw-semibold">$14.99 <span
                            class="text-gray-500 fw-normal">/Qty</span></span>
                        <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                        <div class="d-flex align-items-center">
                          <span class="text-xs fw-bold text-gray-600">4.8</span>
                          <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                          <span class="text-xs fw-bold text-gray-600">(17k)</span>
                        </div>
                      </div>

                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>

                <!-- Product 7 -->
                <div class="swiper-slide">
                  <div
                    class="product-card px-20 pt-16 pb-40 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <button @click="addToCart(7)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>
                    <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
                      <img src="/assets/images/thumbs/product-img3.png" alt="Product 3" width="200" height="200">
                    </NuxtLink>
                    <div class="product-card__content mt-12">
                  <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
  <div class="price-group">
    <span class="text-heading text-md fw-semibold">
      $14.99 <span class="text-gray-500 fw-normal">/Qty</span>
    </span>
    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">
      $28.99
    </span>
  </div>

  <div class="rating-group">
    <span class="text-xs fw-bold text-gray-600">4.8</span>
    <span class="text-15 fw-bold text-warning-600">
      <i class="ph-fill ph-star"></i>
    </span>
    <span class="text-xs fw-bold text-gray-600">(17k)</span>
  </div>
</div>


                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink to="/product-details" class="link text-line-2">Taylor Farms Broccoli Florets
                          Vegetables</NuxtLink>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

// Countdown timer
const countdown = ref({
  days: '07',
  hours: '09',
  minutes: '16',
  seconds: '23'
})

// Add to cart function
const addToCart = (productId: number): void => {
  console.log('Added to cart:', productId)
}

// Initialize Swiper
onMounted(async () => {
  if (import.meta.client && swiperContainer.value) {
    try {
      const Swiper = await import('swiper')
      const { Navigation, Autoplay } = await import('swiper/modules')

      // Initialize Swiper for hot deals
      swiperInstance.value = new Swiper.default(swiperContainer.value, {
        modules: [Navigation, Autoplay],
        loop: true,
        slidesPerView: 4,
        spaceBetween: 12,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.deals-next',
          prevEl: '.deals-prev',
        },
        breakpoints: {
          320: {
            slidesPerView: 1.3,
            spaceBetween: 10
          },
          576: {
            slidesPerView: 2.5,
            spaceBetween: 12
          },
          768: {
            slidesPerView: 2.2,
            spaceBetween: 12
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 12
          },
          1500:{
             slidesPerView: 3.5,
            spaceBetween: 12
          }
        }
      }) as SwiperInstance

      console.log('Hot Deals Swiper initialized successfully')

      // Start countdown timer
      const timerInterval = setInterval(() => {
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
          clearInterval(timerInterval)
        }

        countdown.value = {
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        }
      }, 1000)

      // Cleanup interval on component unmount
      onUnmounted(() => {
        clearInterval(timerInterval)
      })
    } catch (error) {
      console.error('Hot Deals Swiper loading error:', error)
    }
  }
})

// Cleanup Swiper
onUnmounted(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy()
    swiperInstance.value = null
  }
})

// Navigation functions
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
/* parent container MUST be relative */
.price-group {
  display: flex;
  gap: 6px;
  white-space: nowrap;
}

.rating-group {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto; 
  white-space: nowrap;
}

@media (max-width: 475px) {
  .explore-shop-btn {
    position: absolute;
    top: 39%;
    right: 0;
    transform: translateY(-50%);

    margin: 0;
    padding: 3px;

    display: inline-flex;
    align-items: center;
    gap: 8px;

    background: white;
    color: #1f6ae1;
    font-weight: 500;
    text-decoration: none;
    border-radius: 999px;
  }
}
/* button styling */
.explore-shop-btn {
  position: absolute;
  top: 15px;
  right: -1px;
  transform: translateY(-50%);
  padding: 10px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: white;
  color: #0a6fc2;
  /* example main color */
  font-weight: 500;
  text-decoration: none;
  border-radius: 9px;
}

/* hover effect */
.explore-shop-btn:hover {
  background: #1a2c5b;
  color: #fff;
}

/* icon */
.explore-shop-btn .icon {
  display: flex;
  font-size: 20px;
}

.hot-deals {
  background: #f8fafc;
}

.section-heading h5 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Banner Card Styles */
.hot-deals.bg-main-600 {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  min-height: 400px;
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

/* Swiper Styles */
.swiper {
  padding: 20px 10px;
  margin: 0 -10px;
}

.swiper-slide {
  height: auto;
}

/* Navigation Buttons */
.deals-prev,
.deals-next {
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

.deals-prev:hover,
.deals-next:hover {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: scale(1.1);
}

/* .countdown{
  position: absolute;
  top: -20px;
  right: 40px;
} */
/* Countdown Timer */
.countdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.countdown-list__item {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
}

.countdown-list__item.colon-white::after {
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hot-deals {
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

  .hot-deals.bg-main-600 {
    padding: 40px 20px !important;
    text-align: center;
  }
}
</style>