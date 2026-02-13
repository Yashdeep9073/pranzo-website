<template>
  <section class="hot-deals pt-80 overflow-hidden">
    <div class="container container-lg">
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Hot Deals Today</h5>

          <div class="flex-align gap-16">
            <NuxtLink to="/shop/shop-all" class="btn btn-main d-inline-flex align-items-center gap-2
         px-4 py-2 rounded-pill text-sm fw-semibold shadow-sm">
              View All Deals
              <i class="ph ph-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Countdown Timer (show for both API and static) -->
        <div v-if="!loading" class="countdown">
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

      <!-- Loading State -->
      <div v-if="loading" class="row g-12">
        <div class="col-md-4">
          <div class="hot-deals position-relative rounded-16 bg-main-600 overflow-hidden ps-40 pe-24 pt-80 pb-120 z-1 skeleton-loader">
            <div class="skeleton-banner"></div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="row g-12">
            <div v-for="n in 4" :key="n" class="col-6 col-md-3">
              <div class="product-card p-20 border border-gray-100 rounded-16 skeleton-loader">
                <div class="skeleton-image"></div>
                <div class="skeleton-text mt-12"></div>
                <div class="skeleton-text mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="row g-12">
        <!-- Left banner Card -->
        <div class="col-md-4">
          <div 
            v-if="!showStatic && activeOffer" 
            class="hot-deals position-relative rounded-16 overflow-hidden z-1 banner-container"
            :style="getbannerStyle(activeOffer)"
          >
            <!-- Content Overlay -->
            <div class="banner-content position-relative z-2 h-100 d-flex flex-column justify-content-between p-40">
              <!-- Category Badge -->
              <div>
                <span class="text-primary-600 bg-yellow text-heading mt-6 py-4 px-12 rounded-4 text-sm fw-medium">
                  {{ activeOffer.offerType || 'Special Offer' }}
                </span>
              </div>

              <!-- Content -->
              <div class="position-relative z-2">
                <h5 class="text-white mb-8">{{ activeOffer.name || 'Deals of the day' }}</h5>
                <p class="fw-semibold text-success-600 mb-16">
                  {{ activeOffer.description || 'Save up to 50% off on your first order' }}
                </p>
                
                <!-- Discount Badge -->
                <div v-if="activeOffer.discountValue" class="badge bg-white text-main-600 py-8 px-16 rounded-pill fw-bold mb-16">
                  {{ activeOffer.discountValue }}% OFF
                </div>

                <!-- Explore Button -->
                <NuxtLink 
                  :to="`/shop/shop-all`" 
                  class="explore-shop-btn"
                >
                  Explore Offer
                  <span class="icon">
                    <i class="ph-bold ph-arrow-right"></i>
                  </span>
                </NuxtLink> 
              </div>
            </div>
          </div>

          <!-- Static banner Fallback -->
          <div 
            v-else 
            class="hot-deals position-relative rounded-16 overflow-hidden z-1 banner-container"
            style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);"
          >
            <!-- Background Image -->
            <div class="banner-bg-image"></div>
            
            <!-- Content Overlay -->
            <div class="banner-content position-relative z-2 h-100 d-flex flex-column justify-content-between p-40">
              <span class="text-primary-600 bg-yellow text-heading mt-6 py-4 px-12 rounded-4 text-sm fw-medium">
                Medical equipment
              </span>

              <div class="position-relative z-2">
                <NuxtLink to="/shop/shop-all" class="explore-shop-btn">
                  Explore Shop
                  <span class="icon">
                    <i class="ph-bold ph-shopping-cart"></i>
                  </span>
                </NuxtLink>
                <h5 class="text-white mb-8 mt-12">Deals of the day</h5>
                <p class="fw-semibold text-success-600">Save up to 50% off on your first order</p>
                <!-- Static Discount Badge -->
                <div class="badge bg-white text-main-600 py-8 px-16 rounded-pill fw-bold mb-16">
                  50% OFF
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Slider with Swiper -->
        <div class="col-md-8">
          <div class="hot-deals-slider arrow-style-two">
            <div ref="swiperContainer" class="swiper hot-deals-swiper">
              <div class="swiper-wrapper">
                <!-- Dynamic Products -->
                <div 
                  v-for="(productItem, index) in displayProducts" 
                  :key="productItem.product?.id || `static-${index}`"
                  class="swiper-slide"
                >
                  <div class="product-card border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 overflow-hidden">
                    <button @click="addToCart(productItem.product?.id || index)"
                      class="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16 z-10">
                      Add <i class="ph ph-shopping-cart"></i>
                    </button>

                    <NuxtLink 
                      :to="getProductLink(productItem.product?.id || index)" 
                      class="product-card__thumb block overflow-hidden rounded-t-16"
                    >
                      <div class="image-container">
                        <img
                          :src="getProductImage(productItem, index)"
                          :alt="getProductName(productItem, index)"
                          class="product-image w-100 h-100"
                          @error="handleImageError($event, index)"
                          loading="lazy"
                        />
                      </div>
                    </NuxtLink>
                    
                    <div class="product-card__content p-20">
                      <!-- Price + Rating -->
                      <div class="product-card__price mb-8 d-flex align-items-center gap-8 no-wrap">
                        <div class="price-group">
                          <span class="text-heading text-md fw-semibold">
                            ${{ getProductPrice(productItem, index) }}
                            <span class="text-gray-500 fw-normal">/Qty</span>
                          </span>
                          <span 
                            class="text-gray-400 text-md fw-semibold text-decoration-line-through"
                          >
                            ${{ showStatic ? staticProducts[index]?.originalPrice : (productItem.product?.price || '') }}
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

                      <!-- Product Title -->
                      <h6 class="title text-lg fw-semibold mt-12 mb-20">
                        <NuxtLink 
                          :to="getProductLink(productItem.product?.id || index)" 
                          class="link text-line-2"
                        >
                          {{ getProductName(productItem, index) }}
                        </NuxtLink>
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
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'

// Type definitions (same as before)
interface SwiperInstance {
  slideNext: () => void
  slidePrev: () => void
  destroy: () => void
  update: () => void
}

interface ProductImage {
  id: number
  productId: number
  imageUrl: string
  altText: string | null
  isPrimary: boolean
  createdAt: string
}

interface Product {
  id: number
  name: string
  sku: string
  price: string
  images: ProductImage[]
  groupId: number | null
}

interface ProductItem {
  offerId: number
  productId: number
  createdAt: string
  product: Product | null
}

interface OfferImage {
  id: number
  offerId: number
  imageUrl: string
  altText: string | null
  isPrimary: boolean
  createdAt: string
}

interface Offer {
  id: number
  name: string
  slug: string
  description: string
  offerType: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  startDate: string
  endDate: string
  isActive: boolean
  isFeatured: boolean
  priority: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  products: ProductItem[]
  images: OfferImage[]
}

// Static products for fallback (with original prices for strikethrough)
const staticProducts = [
  {
    id: 1,
    name: "Taylor Farms Broccoli Florets Vegetables",
    price: "14.99",
    originalPrice: "28.99",
    image: "/assets/images/thumbs/product-img26.png",
    discount: 48
  },
  {
    id: 2,
    name: "Fresh Organic Avocados",
    price: "19.99",
    originalPrice: "34.99",
    image: "/assets/images/thumbs/product-img27.png",
    discount: 43
  },
  {
    id: 3,
    name: "Organic Strawberries Pack",
    price: "12.99",
    originalPrice: "24.99",
    image: "/assets/images/thumbs/product-img28.png",
    discount: 48
  },
  {
    id: 4,
    name: "Fresh Spinach Leaves",
    price: "9.99",
    originalPrice: "18.99",
    image: "/assets/images/thumbs/product-img29.png",
    discount: 47
  },
  {
    id: 5,
    name: "Organic Carrots Bundle",
    price: "7.99",
    originalPrice: "14.99",
    image: "/assets/images/thumbs/product-img30.png",
    discount: 47
  },
  {
    id: 6,
    name: "Fresh Bell Peppers Mix",
    price: "11.99",
    originalPrice: "22.99",
    image: "/assets/images/thumbs/product-img13.png",
    discount: 48
  },
  {
    id: 7,
    name: "Organic Tomatoes Pack",
    price: "8.99",
    originalPrice: "16.99",
    image: "/assets/images/thumbs/product-img3.png",
    discount: 47
  }
]

// Refs
const swiperInstance = ref<SwiperInstance | null>(null)
const swiperContainer = ref<HTMLElement | null>(null)
const loading = ref(false)
const showApiError = ref(false)
const activeOffer = ref<Offer | null>(null)

// Countdown timer
const countdown = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

// Store countdown interval
let countdownInterval: NodeJS.Timeout | null = null

// Computed property to determine if we should show static products
const showStatic = computed(() => {
  console.log('🔍 [HotDeals] showStatic check:', {
    hasActiveOffer: !!activeOffer.value,
    hasProducts: (activeOffer.value?.products?.length || 0) > 0,
    hasApiError: showApiError.value,
    offerType: activeOffer.value?.offerType
  })
  
  // Show static only if no active offer OR API error
  // For HOT_DEALS, don't require products to show dynamic content
  return !activeOffer.value || showApiError.value
})

// Start countdown timer with backend end time
const startCountdown = () => {
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  // Get end time from active offer or use default
  const endTime = activeOffer.value?.endDate
  if (!endTime) {
    console.log('⚠️ [HotDeals] No end time found in offer, using default countdown')
    // Use default 24 hours from now
    const defaultEnd = new Date()
    defaultEnd.setHours(defaultEnd.getHours() + 24)
    startCountdownWithEndTime(defaultEnd)
    return
  }

  console.log('✅ [HotDeals] Using offer end time:', endTime)
  startCountdownWithEndTime(new Date(endTime))
}

const startCountdownWithEndTime = (endTime: Date) => {
  countdownInterval = setInterval(() => {
    const now = new Date()
    const timeDiff = endTime.getTime() - now.getTime()

    if (timeDiff <= 0) {
      // Countdown finished
      countdown.value = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      console.log('⏰ [HotDeals] Countdown finished')
      return
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

    countdown.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }, 1000)
}

// banner style function
const getbannerStyle = (offer: Offer) => {
  const primaryImage = offer.images[0]?.imageUrl
  if (primaryImage) {
    return { 
      backgroundImage: `url(${primaryImage})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
      backgroundBlendMode: 'overlay',
      minHeight: '400px'
    } 
  }
  return {
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    minHeight: '400px'
  }
}

// Computed property to get display products
const displayProducts = computed(() => {
  console.log('showStatic for hot deals:', showStatic.value)
  
  // If we should show static products
  if (showStatic.value) {
    console.log('Using static products for hot deals:', staticProducts.length)
    return staticProducts.map((product, index) => ({
      product: {
        id: product.id,
        name: product.name,
        price: product.originalPrice, // Use original price as base for static
        sku: `STATIC-${index + 1}`,
        images: [{
          id: 1000 + index,
          productId: product.id,
          imageUrl: product.image,
          altText: product.name,
          isPrimary: true,
          createdAt: new Date().toISOString()
        }],
        groupId: null
      }
    }))
  }
  
  // Otherwise use API products
  if (activeOffer.value?.products && activeOffer.value.products.length > 0) {
    console.log('Using API products for hot deals:', activeOffer.value.products.length)
    return activeOffer.value.products.slice(0, 7)
  }
  
  // Fallback to static (shouldn't reach here due to showStatic check)
  console.log('Fallback to static for hot deals')
  return staticProducts.map((product, index) => ({
    product: {
      id: product.id,
      name: product.name,
      price: product.originalPrice,
      sku: `STATIC-${index + 1}`,
      images: [{
        id: 1000 + index,
        productId: product.id,
        imageUrl: product.image,
        altText: product.name,
        isPrimary: true,
        createdAt: new Date().toISOString()
      }],
      groupId: null
    }
  }))
})

// Helper functions
const getProductLink = (productId: number | string) => {
  if (typeof productId === 'number' && productId > 0) {
  return '/shop/shop-all/--1'
  } 
  return '/shop/shop-all/--1'
}

const getProductImage = (productItem: any, index: number) => {
  // If we have product with images
  if (productItem.product?.images && productItem.product.images.length > 0) {
    return productItem.product.images[0]?.imageUrl
  }
  
  // Fallback to static image
  const staticIndex = index % staticProducts.length
  return staticProducts[staticIndex]?.image || `/assets/images/thumbs/product-img${(index % 7) + 26}.png`
}

const getProductName = (productItem: any, index: number) => {
  return productItem.product?.name || staticProducts[index]?.name || 'Product Name'
}

const getProductPrice = (productItem: any, index: number) => {
  if (showStatic.value) {
    // Return discounted price for static products
    return staticProducts[index]?.price || '14.99'
  }
  
  if (activeOffer.value && productItem.product?.price) {
    return calculateDiscountedPrice(productItem.product.price)
  }
  
  return staticProducts[index]?.price || '14.99'
}

const handleImageError = (event: Event, index: number) => {
  const img = event.target as HTMLImageElement
  const staticIndex = index % staticProducts.length
  img.src = staticProducts[staticIndex]?.image || `/assets/images/thumbs/product-img${(index % 7) + 26}.png`
}

// Add to cart function
const addToCart = (productId: number | string): void => {
  console.log('Added to cart:', productId)
  // Add your cart logic here
}

// Calculate discounted price
const calculateDiscountedPrice = (price: string) => {
  if (!activeOffer.value || !price) return price
  
  try {
    const numericPrice = parseFloat(price)
    
    if (activeOffer.value.discountType === 'PERCENTAGE') {
      const discountAmount = numericPrice * (activeOffer.value.discountValue / 100)
      return (numericPrice - discountAmount).toFixed(2)
    } else if (activeOffer.value.discountType === 'FIXED') {
      return Math.max(0, numericPrice - activeOffer.value.discountValue).toFixed(2)
    }
    
    return numericPrice.toFixed(2)
  } catch {
    return price
  }
}

// Fetch offers from API
const fetchOffers = async () => {
  loading.value = true
  showApiError.value = false
  
  try {
    // Get config - with fallback
    // Get config - with robust fallback
    let API_URL = ''
    const config = useRuntimeConfig()
    // Prefer the explicit offers endpoint if defined
    if (config.public.api && config.public.api.offers) {
      API_URL = `${config.public.api.offers}?type=HOT_DEALS`
    } else if (config.public.API_URL) {
      API_URL = `${config.public.API_URL}/offers?type=HOT_DEALS`
    } else {
      // Default relative endpoint
      API_URL = `/api/offers?type=HOT_DEALS`
    }
    console.log('Hot Deals API URL resolved to:', API_URL)

    // Make API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
    
    console.log('Fetching HOT DEALS offers:', API_URL)
    
    const data: any = await $fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 8000,
      retry: 2,
    })
    console.log('Hot Deals API Response:', data)
    
    // Check data structure
    if (data.data) {
      // Check if data is an array (list endpoint) or single object (detail endpoint)
      if (Array.isArray(data.data)) {
        // This is a list endpoint - find HOT_DEALS offers
        console.log('🔍 [HotDeals] All offers received:', data.data.length)
        console.log('🔍 [HotDeals] Sample offer structure:', JSON.stringify(data.data[0], null, 2))
        
        const hotDealsOffers = data.data.filter((offer: Offer) => {
          console.log('🔍 [HotDeals] Checking offer:', {
            id: offer.id,
            name: offer.name,
            offerType: offer.offerType,
            isActive: offer.isActive
          })
          
          const isHotDeal = offer.isActive && 
            (offer.offerType === 'HOT_DEALS' || offer.offerType === 'HOT_DEAL')
          
          console.log('🔍 [HotDeals] Is HOT_DEAL?', isHotDeal)
          return isHotDeal
        })
        
        console.log('Found HOT_DEALS offers:', hotDealsOffers.length)
        
        // Sort by priority (highest first)
        hotDealsOffers.sort((a: Offer, b: Offer) => b.priority - a.priority)
        
        if (hotDealsOffers.length > 0) {
          activeOffer.value = hotDealsOffers[0]
          console.log('Hot Deals selected offer:', activeOffer.value?.name)
        } else {
          console.log('No HOT_DEALS offers found - using static')
          showApiError.value = true
          activeOffer.value = null
        }
      } else {
        // This is a single offer endpoint
        const offer = data.data as Offer
        if (offer.isActive && 
            (offer.offerType === 'HOT_DEALS' || offer.offerType === 'HOT_DEAL')) {
          activeOffer.value = offer
          console.log('Hot Deals using single HOT_DEALS offer:', activeOffer.value.name)
        } else {
          console.log('Single offer not HOT_DEALS type - using static')
          showApiError.value = true
          activeOffer.value = null
        }
      }
    } else {
      console.log('No data in data for hot deals - using static')
      showApiError.value = true
      activeOffer.value = null
    }
    
  } catch (err: any) {
    console.error('❌ [HotDeals] API Error details:', {
      error: err,
      message: err?.message,
      status: err?.status,
      statusText: err?.statusText,
      data: err?.data
    })
    showApiError.value = true
    activeOffer.value = null
  } finally {
    loading.value = false
    // Initialize or update swiper after data is loaded
    nextTick(() => {
      initOrUpdateSwiper()
    })
  }
}

// Initialize or update Swiper
const initOrUpdateSwiper = async () => {
  if (import.meta.client && swiperContainer.value && displayProducts.value.length > 0) {
    try {
      if (!swiperInstance.value) {
        await initSwiper()
      } else {
        swiperInstance.value.update()
      }
    } catch (err) {
      console.error('Hot Deals Swiper error:', err)
    }
  }
}

const initSwiper = async () => {
  try {
    const Swiper = await import('swiper')
    const { Navigation, Autoplay } = await import('swiper/modules')

    const slidesCount = displayProducts.value.length
    const slidesPerView = Math.min(4, slidesCount)
    
    swiperInstance.value = new Swiper.default(swiperContainer.value!, {
      modules: [Navigation, Autoplay],
      loop: slidesCount > 1,
      slidesPerView: slidesPerView,
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
          slidesPerView: Math.min(1.3, slidesCount),
          spaceBetween: 10
        },
        576: {
          slidesPerView: Math.min(2.5, slidesCount),
          spaceBetween: 12
        },
        768: {
          slidesPerView: Math.min(2.2, slidesCount),
          spaceBetween: 12
        },
        1024: {
          slidesPerView: Math.min(2.5, slidesCount),
          spaceBetween: 12
        },
        1500: {
          slidesPerView: Math.min(3.5, slidesCount),
          spaceBetween: 12
        }
      }
    }) as SwiperInstance

    console.log('Hot Deals Swiper initialized with', slidesCount, 'slides')
  } catch (error) {
    console.error('Hot Deals Swiper loading error:', error)
  }
}

onMounted(async () => {
  console.log('HotDeals component mounted')
  await fetchOffers()
  startCountdown()
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

// Watch for offer changes to restart countdown
watch(activeOffer, (newOffer, oldOffer) => {
  if (newOffer && newOffer !== oldOffer) {
    console.log('🔄 [HotDeals] New offer selected, restarting countdown:', newOffer.name)
    startCountdown()
  }
}, { immediate: false })

// Log computed properties for debugging
watch(displayProducts, (newVal) => {
  console.log('Hot Deals Products updated:', newVal.length)
}, { immediate: true })

watch(showStatic, (newVal) => {
  console.log('Show Static for hot deals:', newVal)
}, { immediate: true })
</script>

<style scoped>
/* Hot Deals Section */
.hot-deals {
  background: #f8fafc;
}

.section-heading h5 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* banner Container */
.banner-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  min-height: 400px;
  background: linear-gradient(135deg, #b2aff3 0%, #3b82f6 100%);
}

/* banner Background Image */
.banner-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%; /* Half area cover */
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  z-index: 1;
}

/* For API images */
.banner-container[style*="background-image"]::before {
  display: none; /* Hide if we have dynamic background */
}

.banner-bg-image {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background-image: url('/assets/images/thumbs/basket-img.png');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  z-index: 1;
}

/* banner Content */
.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
}

/* Product Card Styles */ 
.product-card {
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.product-card__cart {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
  z-index: 10;
}

.product-card:hover .product-card__cart {
  opacity: 1;
  transform: translateY(0);
}

/* Image Container - Stretched to corners (Flash Sales style) */
.product-card__thumb {
  position: relative;
  width: 100%;
  flex-shrink: 0;
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Content Area */
.product-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title a {
  color: #1e293b;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* .title a:hover {
  color: #4f46e5;
} */

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
  line-height: 1.5;
}

/* Price and Rating Layout */
.price-group {
  display: flex;
  gap: 6px;
  white-space: nowrap;
  flex: 1;
}

.rating-group {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* Explore Shop Button */
.explore-shop-btn {
  position: absolute;
  top: 15px;
  right: -1px;
  padding: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #0a6fc2;
  font-weight: 500;
  text-decoration: none;
  border-radius: 9px;
  transition: all 0.3s ease;
  z-index: 10;
}

.explore-shop-btn:hover {
  background: #1a2c5b;
  color: #fff;
  transform: translateX(-5px);
}

.explore-shop-btn .icon {
  display: flex;
  font-size: 20px;
}

/* Swiper Styles - Removed fixed width/height */
.hot-deals-swiper {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
}

.swiper-wrapper {
  align-items: stretch;
}

.swiper-slide {
  height: auto;
  display: flex;
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
  padding: 4px 8px;
  margin: 0 2px;
}

/* Skeleton Loader */
.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-banner {
  height: 400px;
  width: 100%;
  border-radius: 16px;
}

.skeleton-image {
  width: 100%;
  padding-top: 75%;
  background: #ddd;
  border-radius: 8px;
}

.skeleton-text {
  height: 20px;
  background: #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text:last-child {
  width: 70%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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

  .product-card__content {
    padding: 16px !important;
  }
  
  .image-container {
    padding-top: 100%; /* Square aspect ratio on mobile */
  }

  .banner-container {
    min-height: 300px !important;
  }

  .banner-content {
    padding: 20px !important;
  }

  .explore-shop-btn {
    top: 39%;
    right: 0;
    padding: 3px;
  }
}

@media (max-width: 475px) {
  .banner-container {
    min-height: 250px !important;
  }
  
  .explore-shop-btn {
    top: 39%;
    right: 0;
    padding: 3px;
    font-size: 0.75rem;
  }
  
  .product-card__content {
    padding: 12px !important;
  }
  
  .title {
    font-size: 0.9rem !important;
  }
  
  .product-card__price {
    font-size: 0.85rem !important;
  }
  
  .deals-prev,
  .deals-next {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
  
  .product-card__cart {
    padding: 8px 16px !important;
    font-size: 0.875rem;
  }
  
  .countdown-list__item {
    padding: 2px 4px;
    font-size: 0.75rem;
  }
}

/* Utility Classes */
.rounded-t-16 {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

.z-10 {
  z-index: 10;
}
</style>
