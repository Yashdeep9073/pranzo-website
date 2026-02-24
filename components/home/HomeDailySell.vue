<template>
  <section class="best sells pt-30 pb-80">
    <div class="container container-lg">
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Daily Best Sells</h5>
        </div>
      </div>

        <div class="row g-12">
        <!-- Left Products Section -->
        <div class="col-xxl-8">
          <div class="row gy-4">
            <!-- Dynamic Products from Backend -->
            <div v-for="(product, index) in displayProducts" :key="product.id" class="col-md-6">
              <div class="product-card style-two h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 flex-align gap-16">
                <div class="">
                  <span class="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale {{ product.discount }}%</span>
                  <NuxtLink :to="`/shop/shop-all/${product.id}`" class="product-card__thumb flex-center overflow-hidden">
                    <img :src="product.image" :alt="product.name">
                  </NuxtLink>
                  <div class="countdown">
                    <ul class="countdown-list style-three flex-align flex-wrap">
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ getCountdown(index).days }}</span>Days
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ getCountdown(index).hours }}</span>Hours
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ getCountdown(index).minutes }}</span>Min
                      </li>
                      <li class="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium">
                        <span>{{ getCountdown(index).seconds }}</span>Sec
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-card__content">
                  <div class="product-card__price mb-16">
                    <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">₹{{ Number(product.originalPrice || 0).toFixed(2) }}</span>
                    <span class="text-heading text-md fw-semibold">₹{{ Number(product.price || 0).toFixed(2) }} <span class="text-gray-500 fw-normal">/Qty</span></span>
                  </div>
                  <div class="flex-align gap-6">
                    <span class="text-xs fw-bold text-gray-600">{{ product.rating }}</span>
                    <span class="text-15 fw-bold text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-bold text-gray-600">({{ product.reviews }})</span>
                  </div>
                  <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <NuxtLink :to="`/shop/shop-all/${product.id}`" class="link text-line-2">{{ product.name }}</NuxtLink>
                  </h6>
                  <div class="flex-align gap-4">
                    <span class="text-main-600 text-md d-flex"><i class="ph-fill ph-storefront"></i></span>
                    <span class="text-gray-500 text-xs">By {{ product.store }}</span>
                  </div>
                  <div class="mt-12">
                    <div class="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" :aria-label="`Sold: ${product.sold || 0}/${product.stock || 0}`" :aria-valuenow="(Number(product.sold || 0) / Number(product.stock || 1)) * 100" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar bg-main-600 rounded-pill" :style="`width: ${(Number(product.sold || 0) / Number(product.stock || 1)) * 100}%`"></div>
                    </div>
                    <span class="text-gray-900 text-xs fw-medium mt-8">Sold: {{ product.sold || 0 }}/{{ product.stock || 0 }}</span>
                  </div>
                  <button @click="addToCart(product.id)" class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Loading State -->
            <div v-if="productsLoading" class="col-12 text-center py-4">
              <div class="spinner-border text-main-600" role="status">
                <span class="visually-hidden">Loading daily deals...</span>
              </div>
            </div>
            
            <!-- Error State -->
            <div v-if="productsError" class="col-12 text-center py-4">
              <div class="alert alert-danger">
                <i class="ph ph-warning-circle"></i> Failed to load daily deals. Please try again later.
              </div>
            </div>
          </div>
        </div>

        <!-- Right Banner Card -->
        <div class="col-xxl-4">
          <div v-if="offersLoading" class="text-center py-4">
            <div class="spinner-border text-main-600" role="status">
              <span class="visually-hidden">Loading offer...</span>
            </div>
          </div>
          
          <div v-else-if="offersError" class="alert alert-danger">
            <i class="ph ph-warning-circle"></i> Failed to load offer.
          </div>
          
          <div v-else-if="dailyDealsOffers.length > 0" class="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 h-100">
            <div class="">
              <img :src="dailyDealsOffers[0].images?.[0]?.imageUrl || '/assets/images/bg/special-snacks.png'" alt="" class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img">
            </div>
            <div class="py-xl-4">
              <h5 class="mb-8">{{ dailyDealsOffers[0].name || 'Special Offer' }}</h5>
              <div class="flex-align gap-8">
                <span class="text-sm fw-medium text-heading">{{ dailyDealsOffers[0].description || 'Limited time offer' }}</span>
                <span class="text-xs text-heading">Expire {{ new Date(dailyDealsOffers[0].endDate).toLocaleDateString() }}</span>
              </div>
              <NuxtLink to="/shop/shop-all" class="mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8">
                Shop Now
                <span class="icon text-xl d-flex"><i class="ph ph-arrow-right"></i></span>
              </NuxtLink>
            </div>  
          </div>
          
          <!-- Fallback banner if no offers -->
          <div v-else class="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 h-100">
            <div class="">
              <img src="/assets/images/bg/special-snacks.png" alt="" class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img">
            </div>
            <div class="py-xl-4">
              <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                <img src="/assets/images/thumbs/offer-logo.png" alt="">
              </div>
              <h5 class="mb-8">₹5 off your first order</h5>
              <div class="flex-align gap-8">
                <span class="text-sm fw-medium text-heading">Delivery by 6:15am</span>
                <span class="text-xs text-heading">Expire Aug 5</span>
              </div>
              <NuxtLink to="/shop/shop-all" class="mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductsApi } from '@/composables/api/useProductsApi'
import { useCart } from '~/composables/api/useCart'
import { useOffersApi } from '@/composables/api/useOffersApi'

// Fetch products with discounts for daily deals
const { products: dailyProducts, loading: productsLoading, error: productsError, refresh: refreshProducts } = useProductsApi({
  inStock: true,
  limit: 4,
  sort: 'popular'
})

// Fetch DAILY_DEALS offers for banner
const { offers: dailyDealsOffers, loading: offersLoading, error: offersError, refresh: refreshOffers } = useOffersApi({
  offerType: 'DAILY_DEALS',
  isActive: true,
  limit: 1
})

// Computed products with backend data integration
const displayProducts = computed(() => {
  if (dailyProducts.value && dailyProducts.value.length > 0) {
    return dailyProducts.value.slice(0, 4).map((product, index) => {
      const price = Number(product.price) || 0
      const originalPrice = price * 1.5 // Estimate original price for discount display
      
      return {
        id: product.id,
        name: product.name || 'Product Name',
        rating: 4.8, // Default rating since not in Product type
        reviews: '17k', // Default reviews since not in Product type
        price: price,
        originalPrice: originalPrice,
        discount: Math.round(((originalPrice - price) / originalPrice) * 100),
        image: product.images?.find(img => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || "/assets/images/thumbs/best-sell1.png",
        store: product.category?.name || "Lucky Supermarket",
        sold: Math.floor(Math.random() * 30) + 10, // Random sold count since not in Product type
        stock: Number(product.stock) || 35,
        startDate: null, // Products don't have offer dates
        endDate: null
      }
    })
  }

})

// Countdown timers for each product (dynamic)
const countdowns = ref([
  { days: '02', hours: '08', minutes: '30', seconds: '45' },
  { days: '01', hours: '12', minutes: '15', seconds: '20' },
  { days: '03', hours: '06', minutes: '45', seconds: '10' },
  { days: '00', hours: '23', minutes: '59', seconds: '59' }
])


// Function to calculate countdown based on offer dates
const calculateCountdown = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return null // Use fallback
  }
  
  const now = new Date().getTime()
  const endTime = new Date(endDate).getTime()
  const diff = endTime - now
  
  if (diff <= 0) {
    return {
      days: '00',
      hours: '00', 
      minutes: '00',
      seconds: '00'
    }
  }
  
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  
  console.log('🔍 [HomeDailySell] Daily Deal countdown - End:', endDate, 'Countdown:', {d, h, m, s})
  
  return {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

// Function to update countdown
const updateCountdown = (countdown, startDate, endDate) => {
  // Try to use backend dates first
  const backendCountdown = calculateCountdown(startDate, endDate)
  if (backendCountdown) {
    return backendCountdown
  }
  
  // Fallback to decrementing countdown
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

// Function to get countdown by index
const getCountdown = (index) => {
  return countdowns.value[index] || { days: '00', hours: '00', minutes: '00', seconds: '00' }
}

// Add to cart function
const addToCart = (productId) => {
  const { addToCart: cartAdd } = useCart()
  // Find the full product object
  const product = displayProducts.value.find(p => p.id === productId)
  if (product) {
    cartAdd(product)
    console.log('Added to cart:', product.name)
  }
}

// Update all countdowns
let timerInterval

onMounted(() => {
  
  timerInterval = setInterval(() => {
    const products = displayProducts.value
    
    if (products && products.length > 0) {
      // Update each countdown with backend dates or fallback
      countdowns.value = countdowns.value.map((countdown, index) => {
        const product = products[index]
        if (product) {
          return updateCountdown(countdown, product.startDate, product.endDate)
        }
        return updateCountdown(countdown)
      })
    } else {
      // Use fallback countdowns
      countdowns.value = countdowns.value.map(countdown => updateCountdown(countdown))
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

/* Add any minimal styles if needed */
.product-card.style-two:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
} 

.cover-img {
  object-fit: cover;
}
</style>
