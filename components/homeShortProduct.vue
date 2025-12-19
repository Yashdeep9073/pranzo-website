<template>
  <!-- <div>
    <button @click="show = !show">Show Products</button>

    <div v-if="show">
      <div v-for="item in products" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </div>  -->
   <div class="short-product pt-110">
    <div class="container container-lg">
      <div class="row gy-4">
        <!-- Featured Products -->
        <div class="col-xxl-3 col-lg-4 col-sm-6">
          <div class="p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
            <div class="p-16 bg-main-50 rounded-16 mb-32">
              <h6 class="underlined-line position-relative mb-0 pb-16 d-inline-block">Featured Products</h6>
            </div>
            <div class="short-product-list arrow-style-two max-h-unset">
              <Swiper
                :modules="[Autoplay]"
                direction="vertical"
                :autoplay="{ delay: 3000, disableOnInteraction: false }"
                :slides-per-view="4"
                :space-between="44"
                :loop="true"
                class="h-500"
              >
                <SwiperSlide v-for="product in featuredProducts" :key="product.id">
                  <div class="flex-align gap-16">
                    <div class="w-90 h-90 rounded-12 border border-gray-100 flex-shrink-0">
                      <NuxtLink to="/product-details" class="link">
                        <img :src="product.image" :alt="product.name">
                      </NuxtLink>
                    </div>
                    <div class="product-card__content mt-12">
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-500">{{ product.rating }}</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex">
                          <i class="ph-fill ph-star"></i>
                        </span>
                        <span class="text-xs fw-bold text-gray-500">({{ product.reviews }})</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-8 mb-8">
                        <NuxtLink to="/product-details" class="link text-line-1">{{ product.name }}</NuxtLink>
                      </h6>
                      <div class="product-card__price flex-align gap-8">
                        <span class="text-heading text-md fw-semibold d-block">${{ product.price }}</span>
                        <span class="text-gray-400 text-md fw-semibold d-block">${{ product.originalPrice }}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>

        <!-- Top Selling Products -->
        <div class="col-xxl-3 col-lg-4 col-sm-6">
          <div class="p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
            <div class="p-16 bg-main-50 rounded-16 mb-32">
              <h6 class="underlined-line position-relative mb-0 pb-16 d-inline-block">Top Selling Products</h6>
            </div>
            <div class="short-product-list arrow-style-two max-h-unset">
              <Swiper
                :modules="[Autoplay]"
                direction="vertical"
                :autoplay="{ delay: 3500, disableOnInteraction: false }"
                :slides-per-view="4"
                :space-between="44"
                :loop="true"
                class="h-500"
              >
                <SwiperSlide v-for="product in topSellingProducts" :key="product.id">
                  <div class="flex-align gap-16">
                    <div class="w-90 h-90 rounded-12 border border-gray-100 flex-shrink-0">
                      <NuxtLink to="/product-details" class="link">
                        <img :src="product.image" :alt="product.name">
                      </NuxtLink>
                    </div>
                    <div class="product-card__content mt-12">
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-500">{{ product.rating }}</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex">
                          <i class="ph-fill ph-star"></i>
                        </span>
                        <span class="text-xs fw-bold text-gray-500">({{ product.reviews }})</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-8 mb-8">
                        <NuxtLink to="/product-details" class="link text-line-1">{{ product.name }}</NuxtLink>
                      </h6>
                      <div class="product-card__price flex-align gap-8">
                        <span class="text-heading text-md fw-semibold d-block">${{ product.price }}</span>
                        <span class="text-gray-400 text-md fw-semibold d-block">${{ product.originalPrice }}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>

        <!-- On-sale Products -->
        <div class="col-xxl-3 col-lg-4 col-sm-6">
          <div class="p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
            <div class="p-16 bg-main-50 rounded-16 mb-32">
              <h6 class="underlined-line position-relative mb-0 pb-16 d-inline-block">On-sale Products</h6>
            </div>
            <div class="short-product-list arrow-style-two max-h-unset">
              <Swiper
                :modules="[Autoplay]"
                direction="vertical"
                :autoplay="{ delay: 4000, disableOnInteraction: false }"
                :slides-per-view="4"
                :space-between="44"
                :loop="true"
                class="h-500"
              >
                <SwiperSlide v-for="product in onSaleProducts" :key="product.id">
                  <div class="flex-align gap-16">
                    <div class="w-90 h-90 rounded-12 border border-gray-100 flex-shrink-0">
                      <NuxtLink to="/product-details" class="link">
                        <img :src="product.image" :alt="product.name">
                      </NuxtLink>
                    </div>
                    <div class="product-card__content mt-12">
                      <div class="flex-align gap-6">
                        <span class="text-xs fw-bold text-gray-500">{{ product.rating }}</span>
                        <span class="text-15 fw-bold text-warning-600 d-flex">
                          <i class="ph-fill ph-star"></i>
                        </span>
                        <span class="text-xs fw-bold text-gray-500">({{ product.reviews }})</span>
                      </div>
                      <h6 class="title text-lg fw-semibold mt-8 mb-8">
                        <NuxtLink to="/product-details" class="link text-line-1">{{ product.name }}</NuxtLink>
                      </h6>
                      <div class="product-card__price flex-align gap-8">
                        <span class="text-heading text-md fw-semibold d-block">${{ product.price }}</span>
                        <span class="text-gray-400 text-md fw-semibold d-block">${{ product.originalPrice }}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>

        <!-- Deals of the Week -->
        <div class="col-xxl-3 col-lg-4 col-sm-6">
          <div class="product-card h-100 p-24 pt-32 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 group-item pt-32">
            <button type="button" class="wishlist-btn-two" @click="toggleWishlist">
              <i class="ph-bold ph-heart"></i>
            </button>

            <div class="">
              <h6 class="position-relative mb-0 pb-12 d-inline-block">Deals of the week</h6>
              <div class="countdown mb-10">
                <ul class="countdown-list flex-align flex-wrap">
                  <li class="countdown-list__item colon-red py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 bg-main-600 text-white">
                    <span>{{ weekDealCountdown.days }}</span> D
                  </li>
                  <li class="countdown-list__item colon-red py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 bg-main-600 text-white">
                    <span>{{ weekDealCountdown.hours }}</span> H
                  </li>
                  <li class="countdown-list__item colon-red py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 bg-main-600 text-white">
                    <span>{{ weekDealCountdown.minutes }}</span> M
                  </li>
                  <li class="countdown-list__item colon-red py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 bg-main-600 text-white">
                    <span>{{ weekDealCountdown.seconds }}</span> S
                  </li>
                </ul>
              </div>
              <p class="text-neutral-300 fw-medium text-sm">Don't miss this opportunity at a special</p>
            </div>
            
            <NuxtLink to="/product-details" class="product-card__thumb flex-center overflow-hidden">
              <img src="/assets/images/thumbs/product-img32.png" alt="">
            </NuxtLink>
            <div class="product-card__content w-100">
              <div class="flex-align gap-4">
                <div class="flex-align gap-2 me-4">
                  <span class="text-12 fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                  <span class="text-12 fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                  <span class="text-12 fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                  <span class="text-12 fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                  <span class="text-12 fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                </div>
                <span class="text-xs fw-medium text-heading">(3)</span>
              </div>
              <div class="d-flex align-items-center gap-12 mt-6">
                <h6 class="text-danger-600 mb-0 text-lg"> $60.99</h6>
                <h6 class="text-neutral-300 fw-medium mb-0 text-lg">$79.99</h6>
              </div>
              
              <h6 class="title text-md fw-semibold mt-10 mb-0">
                <NuxtLink to="/product-details" class="link text-line-2 fw-bold">Perfectly Packed Meat Combos for Delicious and Flavorful Meals Every Day</NuxtLink>
              </h6>   
              <p class="text-gray-500 text-sm mt-12 pb-12 border-bottom border-neutral-100 mb-8">This product is about to run out</p>
  
              <div class="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar" aria-label="Basic example" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-success-600 rounded-pill" style="width: 35%"></div>
              </div>
              <div class="d-flex align-items-center gap-6 mt-6">
                <span class="text-sm text-gray-500">available only:</span>
                <h6 class="text-danger-600 mb-0 text-md fw-semibold"> $60.99</h6>
              </div>
              <button @click="addToCart(weekDealProduct)" class="product-card__cart btn bg-success-600 text-white hover-bg-success-700 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-16 w-100 justify-content-center">
                Add To Cart <i class="ph ph-shopping-cart"></i> 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import { ref, onMounted, onUnmounted } from 'vue'

// Wishlist state
const isInWishlist = ref(false)

// Toggle wishlist
const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Wishlist toggled:', isInWishlist.value)
}

// Add to cart function
const addToCart = (product) => {
  console.log('Added to cart:', product)
}

// Featured Products data
const featuredProducts = [
  {
    id: 1,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img1.png"
  },
  {
    id: 2,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img2.png"
  },
  {
    id: 3,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img3.png"
  },
  {
    id: 4,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img4.png"
  },
  {
    id: 5,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img1.png"
  },
  {
    id: 6,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img2.png"
  }
]

// Top Selling Products data
const topSellingProducts = [
  {
    id: 1,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img5.png"
  },
  {
    id: 2,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img6.png"
  },
  {
    id: 3,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img7.png"
  },
  {
    id: 4,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img8.png"
  },
  {
    id: 5,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img5.png"
  },
  {
    id: 6,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img6.png"
  }
]

// On-sale Products data
const onSaleProducts = [
  {
    id: 1,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img9.png"
  },
  {
    id: 2,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img4.png"
  },
  {
    id: 3,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img7.png"
  },
  {
    id: 4,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img4.png"
  },
  {
    id: 5,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img9.png"
  },
  {
    id: 6,
    name: "Taylor Farms Broccoli Florets Vegetables",
    rating: 4.8,
    reviews: '17k',
    price: '1500.00',
    originalPrice: '1500.00',
    image: "/assets/images/thumbs/short-product-img4.png"
  }
]

// Week Deal Product
const weekDealProduct = {
  id: 1,
  name: "Perfectly Packed Meat Combos for Delicious and Flavorful Meals Every Day",
  price: 60.99,
  originalPrice: 79.99,
  stock: 35
}

// Week Deal Countdown
const weekDealCountdown = ref({
  days: '03',
  hours: '12',
  minutes: '45',
  seconds: '30'
})

// Update countdown timers
let countdownInterval

onMounted(() => {
  // Start countdown timer
  countdownInterval = setInterval(() => {
    let seconds = parseInt(weekDealCountdown.value.seconds)
    let minutes = parseInt(weekDealCountdown.value.minutes)
    let hours = parseInt(weekDealCountdown.value.hours)
    let days = parseInt(weekDealCountdown.value.days)
    
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
    
    weekDealCountdown.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
/* Vertical Swiper custom height */
.h-500 {
  height: 500px;
}

/* Swiper slide styling */
.swiper-slide {
  height: auto !important;
}

/* Wishlist button hover effect */
.wishlist-btn-two:hover i {
  color: #ef4444;
}

/* Product image container */
.w-90.h-90 img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>