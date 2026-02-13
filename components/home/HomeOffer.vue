<template>
  <section class="kart-deals-section">
    <!-- Header with Timer -->
    <div class="deals-header">
      <div class="header-main">
        <h2 class="section-title">Deals Revealed</h2>
        <div class="deals-timer" v-if="bestOfferCountdown">
          <div class="timer-label">{{ bestOfferCountdown.isStarting ? 'Starts in' : 'Ends in' }}</div>
          <div class="timer-display">
            <div class="time-unit">
              <span class="time-value">{{ String(bestOfferCountdown.hours).padStart(2, '0') }}</span>
              <span class="time-label">Hrs</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-value">{{ String(bestOfferCountdown.minutes).padStart(2, '0') }}</span>
              <span class="time-label">Mins</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-value">{{ String(bestOfferCountdown.seconds).padStart(2, '0') }}</span>
              <span class="time-label">Secs</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-subtitle">
        <span class="discount-badge">Up to {{ maxDiscountPercentage }}% off</span> 
        <span class="subtitle-text">On bestsellers</span>
      </div>
    </div>

    <!-- Loading State (only shown briefly) -->
    <div v-if="loading && !showStaticFallback" class="loading-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="n in 6" :key="n">
          <div class="deal-card skeleton">
            <div class="deal-image-container skeleton-bg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Swiper Container with Data (API or Static Fallback) -->
    <div class="swiper-container-wrapper" :class="{ 'show-fallback': showStaticFallback }">
      <!-- Swiper Container -->
      <div class="swiper-container">
        <div ref="swiper" class="swiper">
          <div class="swiper-wrapper">
            <!-- All deals are now from displayDeals array -->
            <div 
              v-for="(deal, index) in displayDeals" 
              :key="deal.id"
              class="swiper-slide"
            >
              <NuxtLink
                :to="deal.link"
                class="deal-card"
              >
                <div class="deal-image-container" :class="{ 'bank-card': deal.type === 'bank' }">
                  <!-- Bank Card -->
                  <div v-if="deal.type === 'bank'" class="bank-offer-bg">
                    <div class="bank-offer-overlay">
                      <div class="bank-name">{{ deal.bankName || 'Bank Offer' }}</div>
                      <div class="bank-offer">{{ deal.offer || 'Special Discount' }}</div>
                    </div>
                  </div>
                  
                  <!-- Image Card -->
                  <img 
                    v-else
                    :src="deal.image" 
                    :alt="deal.title"
                    class="deal-image"
                    loading="lazy"
                    @error="handleImageError($event, index)"
                  /> 
                  
                  <!-- Overlay Gradient for Text Readability -->
                  <div class="image-overlay"></div>
                  
                  <!-- Top Text -->
                  <div class="deal-top-content">
                    <div class="deal-title">{{ deal.title }}</div>
                  </div>
                  
                  <!-- Bottom Content -->
                  <div class="deal-bottom-content">
                    <div class="deal-price" :class="{ 'bank-price': deal.type === 'bank' }">
                      <template v-if="deal.type === 'bank'">
                        <span class="bank-benefit">{{ (deal as any).priceText || 'Special Offer' }}</span>
                      </template>
                      <template v-else>
                        <span class="current-price">{{ deal.currentPrice }}</span>
                        <span class="original-price" v-if="deal.originalPrice">{{ deal.originalPrice }}</span>
                        <span class="discount-percent" v-if="deal.discount">{{ deal.discount }}</span>
                      </template>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Show next card peek -->
      <div class="next-card-peek"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Swiper from 'swiper'
import { Navigation, Mousewheel, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'
import { useOffersHook } from '~/composables/useOffersHook'
const { offers, loading, error, refresh } = useOffersHook()
const { activeOffers, featuredOffers, getCountdown, formatDiscountText, getPrimaryImage } = useDynamicOffers()

const config = useRuntimeConfig()
const API_URL_MEDIA = config.public.api.media

// Interfaces
interface OfferData {
  id: number
  title: string
  description: string
  image: string
  currentPrice: string
  originalPrice: string
  discount: string
  link: string
  type: string
  bankName?: string
  offer?: string
  priceText?: string
}

// Static fallback deals (always available)
const staticDeals = [
  {
    id: 11,
    title: "Premium Headphones",
    description: "Noise cancelling headphones with premium sound",
    image: "/assets/images/recommended/headphones.webp",
    currentPrice: "₹1,299",
    originalPrice: "₹2,599",
    discount: "50% off",
    link: "/shop/shop-all/--1",
    type: "product"
  },
  {  
    
    id: 12,
    title: "shoes for style",
    description: "Latest shoes for smart",
    image: "/assets/images/recommended/shoe.webp",
    currentPrice: "From ₹499",
    originalPrice: "₹999",
    discount: "50% off",
    link: "/shop/shop-all/--1",
    type: "product"
  },
  {
    id: 13,
    title: "Credit Card & EMI",
    description: "Bank offers and EMI options",
    bankName: "SBI Card",
    offer: "10% Instant Discount*",
    priceText: "No Cost EMI Available",
    link: "/shop/shop-all/--1",
    type: "bank"
  },
  {
    id: 14,
    title: "Latest Smartphones",
    description: "Flagship smartphones with latest features",
    image: "/assets/images/recommended/camera.webp",
    currentPrice: "₹29,999",
    originalPrice: "₹34,999",
    discount: "14% off",
    link: "/shop/shop-all/--1",
    type: "product"
  },
  {
    id: 15,
    title: "Electronics",
    description: "High performance laptops and computers",
    image: "/assets/images/nowcategory/electronics1.jpg",
    currentPrice: "From ₹19,999",
    originalPrice: "₹24,999",
    discount: "20% off",
    link: "/shop/shop-all/--1",
    type: "product"
  },
  {
    id: 16,
    title: "Fashion Collection",
    description: "Wide range of electronic products",
    image: "/assets/images/recommended/triple-jean.jpg",
    currentPrice: "From ₹1,499",
    originalPrice: "₹2,999",
    discount: "50% off",
    link: "/shop/shop-all/--1", 
    type: "product"
  }
]

// Reactive state
const showStaticFallback = ref(false)
const swiper = ref<HTMLElement | null>(null)
let swiperInstance: Swiper | null = null

// Fetch offer data from API
const fetchOfferData = async () => {
  try {
    loading.value = true
    error.value = null
    showStaticFallback.value = false
    
    // Fetch flash sale offers specifically
    await refresh()
    
    if (offers.value.length > 0) {
      showStaticFallback.value = false
      console.log(`✅ [HomeOffer] Successfully loaded ${offers.value.length} offers`)
    } else {
      // No offers data, use fallback
      showStaticFallback.value = true
      console.log('⚠️ [HomeOffer] No offers available, using static fallback')
    }
  } catch (err) {
    console.warn('❌ [HomeOffer] API fetch failed, using static fallback:', err)
    showStaticFallback.value = true
    error.value = null // Don't show error to user
  } finally {
    loading.value = false
  }
}

// Best offer countdown for timer display
const bestOfferCountdown = computed(() => {
  // Try to get offers from both composables for compatibility
  const allOffers = activeOffers.value || offers.value || []
  
  if (allOffers.length > 0) {
    const bestOffer = allOffers.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0]
    return bestOffer ? getCountdown(bestOffer.id) : null
  }
  return null
})

// Calculate maximum discount percentage from all fetched offers
const maxDiscountPercentage = computed(() => {
  // Use offers data directly to compute the highest percentage discount
  const allOffers = offers.value || []
  if (!allOffers.length) return 0
  const percentages = allOffers.map(o => {
    if (o.discountType === 'PERCENTAGE') {
      return o.discountValue
    }
    // For fixed discounts, we cannot determine percentage here
    return 0
  })
  const max = Math.max(...percentages)
  return Math.round(max)
})

// Display deals (API or static fallback)
const displayDeals = computed(() => {
  // Show specific offer types instead of all offers
  const targetTypes = ['DEALS_REVEALED']
  const filteredOffers = offers.value.filter(offer => targetTypes.includes(offer.offerType))
  
  if (!showStaticFallback.value && filteredOffers.length > 0) {
    // Use filtered API data if available
    console.log('🎯 [HomeOffer] Filtered offers:', filteredOffers.length)
    console.log('🎯 [HomeOffer] Filtered offers data:', filteredOffers)
    return filteredOffers.slice(0, 6).map(offer => {
      const primaryImage = offer.images?.find((img: any) => img.isPrimary)?.imageUrl || offer.images?.[0]?.imageUrl
      
      // Handle different offer types
      if (offer.offerType === 'DEALS_REVEALED') {
        return {
          id: offer.id,
          title: offer.name || `Deal ${offer.id}`,
          description: offer.description || 'Special offer',
          image: primaryImage || staticDeals[offer.id % staticDeals.length]?.image || '/assets/images/recommended/default.jpg',
          currentPrice: '',
          originalPrice: '',
          discount: '',
          link: `/shop/shop-all/--1`,
          type: 'bank',
          bankName: offer.name || 'Bank Offer',
          offer: offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% Instant Discount*` : `₹${offer.discountValue} Instant Discount*`,
          priceText: 'No Cost EMI Available'
        }
      } else {
        return {
          id: offer.id,
          title: offer.name || `Deal ${offer.id}`,
          description: offer.description || 'Special offer',
          image: primaryImage || staticDeals[offer.id % staticDeals.length]?.image || '/assets/images/recommended/default.jpg',
          currentPrice: offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`,
          originalPrice: '',
          discount: offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}%` : `₹${offer.discountValue}`,
          link: `/shop/shop-all/--1`,
          type: 'product'
        }
      }
    })
  }
  
  // Use static fallback data
  return staticDeals
})

// Handle image loading errors
const handleImageError = (event: Event, index: number) => {
  const img = event.target as HTMLImageElement
  // Use local fallback image
  const fallbackImages = [
    '/assets/images/recommended/headphone.jpg',
    '/assets/images/recommended/watch.jpg',
    '/assets/images/recommended/camera.webp',
    '/assets/images/recommended/laptop.jpg',
    '/assets/images/recommended/electronics.jpg'
  ]
  img.src = fallbackImages[index % fallbackImages.length] || '/assets/images/recommended/default.jpg'
}

// Initialize Swiper
const initSwiper = () => {
  if (!swiper.value) return
  
  swiperInstance = new Swiper(swiper.value, {
    modules: [Navigation, Mousewheel, FreeMode],
    slidesPerView: 'auto',
    spaceBetween: 20,
    freeMode: {
      enabled: true,
      momentum: true,
      momentumBounce: false,
      momentumVelocityRatio: 0.5,
      sticky: true,
    },
    mousewheel: {
      enabled: true,
      forceToAxis: true,
      sensitivity: 0.5,
    },
    resistance: true,
    resistanceRatio: 0.85,
    speed: 400,
    touchRatio: 1,
    grabCursor: true,
    
    breakpoints: {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 'auto',
        spaceBetween: 18,
      },
      768: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 8,
      },
      1200: {
        slidesPerView: 'auto',
        spaceBetween: 6,
      },
      1400: {
        slidesPerView: 'auto',
        spaceBetween: 5,
      }
    }
  })
}

// Initialize component
const initComponent = async () => {
  // Don't show static fallback immediately - let API data load first
  showStaticFallback.value = false
  
  // Try to fetch API data
  await fetchOfferData()
  
  // Initialize Swiper after data is loaded
  setTimeout(() => {
    initSwiper()
  }, 100)
}

// Fetch data on component mount
onMounted(() => {
  initComponent()
  
  // Set timeout to fallback if API is taking too long
  const fallbackTimeout = setTimeout(() => {
    if (loading.value) {
      showStaticFallback.value = true
      loading.value = false
    }
  }, 2000)
  
  // Cleanup timeout
  return () => clearTimeout(fallbackTimeout)
})

// Background retry of API (if using static fallback)
onMounted(() => {
  const retryInterval = setInterval(() => {
    if (!showStaticFallback.value) {
      clearInterval(retryInterval)
      return
    }
    // Retry API in background every 30 seconds
    fetchOfferData()
  }, 30000)
  
  return () => clearInterval(retryInterval)
})

// Cleanup Swiper on unmount
onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy()
    swiperInstance = null
  }
})
</script>

<style scoped>
/* Main Section */
.kart-deals-section {
  background: #fff;
  padding: 24px 0;
  margin: 20px auto;
  max-width: 1400px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* Header Styles */
.deals-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f1111;
  margin: 0;
}

.deals-timer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timer-label {
  font-size: 14px;
  color: #565959;
  font-weight: 500;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-unit {
  background: #fff;
  border: 1px solid #d5d9d9;
  border-radius: 4px;
  padding: 4px 6px;
  min-width: 32px;
  text-align: center;
}

.time-value {
  font-size: 14px;
  font-weight: 700;
  color: #0f1111;
  display: block;
}

.time-label {
  font-size: 11px;
  color: #565959;
  display: block;
  margin-top: 2px;
}

.time-separator {
  font-size: 16px;
  font-weight: 700;
  color: #0f1111;
  margin: 0 2px;
}

/* Subtitle */
.header-subtitle {
  display: flex;
  align-items: center;
  gap: 12px;
}

.discount-badge {
  background: #cc0c39;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.subtitle-text {
  font-size: 16px;
  color: #0f1111;
  font-weight: 500;
}

/* Loading State */
.loading-container {
  padding: 0 20px;
}

.loading-container .swiper-wrapper {
  display: flex;
  gap: 20px;
}

.loading-container .swiper-slide {
  flex: 0 0 calc(25% - 15px);
  width: 150px;
}

.skeleton {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-bg {
  width: 100%;
  height: 350px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

/* Swiper Container Wrapper */
.swiper-container-wrapper {
  position: relative;
  padding: 0 20px;
  transition: opacity 0.3s ease;
}

.swiper-container-wrapper.show-fallback {
  opacity: 1;
}

.swiper-container {
  overflow: visible !important;
  margin-right: -20px;
  padding-right: 20px;
}

.swiper {
  overflow: visible !important;
  padding: 10px 0 30px;
}

.swiper-wrapper {
  display: flex;
  align-items: stretch;
}

/* Swiper Slide */
.swiper-slide {
  width: auto;
  height: auto;
}

/* Deal Card - Full Image with Overlay Text */
.deal-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 280px;
  position: relative; 
  border: 1px solid #e0e0e0;  
}

.deal-card:hover {
  border-color: #c45500;
  transform: translateY(-4px) scale(1.01);
}

/* Image Container - Full Height */
.deal-image-container {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
}

.bank-card .deal-image-container {
  height: 350px;
}

.deal-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.deal-card:hover .deal-image {
  transform: scale(1.05);
}

/* Image Overlay for Text Readability */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 30%,
    transparent 50%,
    transparent 50%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 1;
}

/* Top Content - Positioned at Top */
.deal-top-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 2;
  text-align: left;
}

.deal-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Bottom Content - Positioned at Bottom */
.deal-bottom-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 2;
  text-align: left;
}

/* Price Section */
.deal-price {
  margin-bottom: 12px;
}

.current-price {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin-right: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.original-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: line-through;
  margin-right: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.discount-percent {
  font-size: 16px;
  color: #ffd700;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.bank-price .bank-benefit {
  font-size: 18px;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Bank Offer Specific */
.bank-offer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #007185, #0097a7);
}

.bank-offer-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  text-align: center;
}

.bank-name {
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.bank-offer {
  font-size: 18px;
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Next Card Peek */
.next-card-peek {
  position: absolute;
  right: 20px;
  top: 10px;
  bottom: 30px;
  width: 60px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8));
  pointer-events: none;
  z-index: 2;
  border-radius: 0 8px 8px 0;
}

/* Animations */
@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .kart-deals-section {
    margin: 0;
    padding: 0;
  }
  
  .swiper {
    overflow: visible !important;
  }
  
  .deals-header {
    padding: 0 16px 16px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .timer-display {
    gap: 2px;
  }
  
  .time-unit {
    min-width: 28px;
    padding: 3px 5px;
  }
  
  .time-value {
    font-size: 12px;
  }
  
  .time-label {
    font-size: 10px;
  }
  
  .swiper-container-wrapper {
    padding: 0 16px;
  }
  
  .deal-title {
    font-size: 16px;
  }
  
  .current-price {
    font-size: 20px;
  }
  
  .deal-card {
    width: 240px;
  }
  
  .deal-image-container {
    height: 300px;
  }
  
  .bank-card .deal-image-container {
    height: 300px;
  }
  
  .next-card-peek {
    width: 40px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .deals-timer {
    width: 100%;
    justify-content: space-between;
  }
  
  .deal-card {
    width: 220px;
  }
  
  .deal-image-container {
    height: 280px;
  }
  
  .bank-card .deal-image-container {
    height: 280px;
  }
  
  .deal-top-content,
  .deal-bottom-content {
    padding: 16px;
  }
  
  .next-card-peek {
    width: 30px;
  }
}

/* Smooth scrolling enhancement */
.swiper-slide {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Momentum scroll styles */
.swiper-free-mode > .swiper-wrapper {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
