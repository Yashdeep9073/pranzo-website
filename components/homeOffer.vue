<template>
  <section class="kart-deals-section">
    <!-- Header with Timer -->
    <div class="deals-header">
      <div class="header-main">
        <h2 class="section-title">Deals Revealed</h2>
        <div class="deals-timer">
          <div class="timer-label">Ends in</div>
          <div class="timer-display">
            <div class="time-unit">
              <span class="time-value">02</span>
              <span class="time-label">Hrs</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-value">45</span>
              <span class="time-label">Mins</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-value">30</span>
              <span class="time-label">Secs</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-subtitle">
        <span class="discount-badge">Up to 60% off</span> 
        <span class="subtitle-text">On bestsellers</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="n in 6" :key="n">
          <div class="deal-card skeleton">
            <div class="deal-image-container skeleton-bg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="alert alert-danger">
        {{ error }}
      </div>
      <button @click="fetchOfferData" class="btn btn-main mt-3">
        Retry
      </button>
    </div>

    <!-- Swiper Container with API Data -->
    <div v-else class="swiper-container-wrapper">
      <!-- Swiper Container -->
      <div class="swiper-container">
        <div ref="swiper" class="swiper">
          <div class="swiper-wrapper">
            <!-- Deal 1: API ID 11 -->
            <div v-if="offerId11" class="swiper-slide">
                     <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
              <div class="deal-card" @click="handleDealClick(offerId11.id)">
                <div class="deal-image-container">
                  <img 
                    :src="offerId11.image" 
                    :alt="offerId11.title"
                    class="deal-image"
                    loading="lazy"
                    @error="handleImageError"
                  /> 
                  <!-- Overlay Gradient for Text Readability -->
                  <div class="image-overlay"></div>
                  
                  <!-- Top Text -->
                  <div class="deal-top-content">
                    <div class="deal-title">{{ offerId11.title }}</div>
                  </div>
                  
                  <!-- Bottom Content -->
                  <div class="deal-bottom-content">
                    <div class="deal-price">
                      <span class="current-price">₹1,299</span>
                      <span class="original-price">₹2,599</span>
                      <span class="discount-percent">50% off</span>
                    </div>
                    <!-- <div class="deal-offer">
                      <span class="offer-tag">Delivery by 6:15am</span>
                      <span class="rating">
                        ★ 4.3 <span class="rating-count">(2.1k)</span>
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
               </NuxtLink>
            </div> 

            <!-- Deal 2: API ID 12 -->
            <div v-if="offerId12" class="swiper-slide">
                     <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
              <div class="deal-card" @click="handleDealClick(offerId12.id)">
                <div class="deal-image-container">
                  <img 
                    :src="offerId12.image" 
                    :alt="offerId12.title"
                    class="deal-image"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <div class="image-overlay"></div>
                  
                  <div class="deal-top-content">
                    <div class="deal-title">{{ offerId12.title }}</div>
                  </div>
                  
                  <div class="deal-bottom-content">
                    <div class="deal-price">
                      <span class="current-price">From ₹499</span>
                      <span class="original-price">₹999</span>
                      <span class="discount-percent">50% off</span>
                    </div>
                    <!-- <div class="deal-offer">
                      <span class="offer-tag">Delivery by 6:15am</span>
                      <span class="rating">
                        ★ 4.5 <span class="rating-count">(1.8k)</span>
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
              </NuxtLink> 
            </div>

            <!-- Additional Static Deals -->
             
            <div class="swiper-slide">
              <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
              <div class="deal-card" @click="handleDealClick(3)">
                <div class="deal-image-container bank-card">
                  <div class="bank-offer-bg">
                    <div class="bank-offer-overlay">
                      <div class="bank-name">SBI Card</div>
                      <div class="bank-offer">10% Instant Discount*</div>
                    </div>
                  </div>
                  <div class="image-overlay"></div>
                  
                  <div class="deal-top-content">
                    <div class="deal-title">Credit Card & EMI</div>
                  </div>
                  
                  <div class="deal-bottom-content">
                    <div class="deal-price bank-price">
                      <span class="bank-benefit">No Cost EMI Available</span>
                    </div>
                    <!-- <div class="deal-offer">
                      <span class="offer-tag">*T&C apply</span>
                      <span class="rating">
                        ★ 4.7 <span class="rating-count">(15k+)</span>
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
                </NuxtLink>

            </div>

            <div class="swiper-slide">
  <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
    <div class="deal-image-container">
      <img 
        src="/assets/images/recommended/camera.webp" 
        alt="OnePlus Nord 5"
        class="deal-image"
        loading="lazy"
      />
      
      <div class="image-overlay"></div>

      <div class="deal-top-content">
        <div class="deal-title">Pixel - Latest Flagship</div>
      </div>

      <div class="deal-bottom-content">
        <div class="deal-price">
          <span class="current-price">₹29,999</span>
          <span class="original-price">₹34,999</span>
          <span class="discount-percent">14% off</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</div>


            <div class="swiper-slide">
                <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
              <div class="deal-card" @click="handleDealClick(5)">
                <div class="deal-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop&auto=format" 
                    alt="Mobile Phones"
                    class="deal-image"
                    loading="lazy"
                  />
                  <div class="image-overlay"></div>
                  
                  <div class="deal-top-content">
                    <div class="deal-title">Latest Smartphones</div>
                  </div>
                  
                  <div class="deal-bottom-content">
                    <div class="deal-price">
                      <span class="current-price">From ₹19,999</span>
                      <span class="original-price">₹24,999</span>
                      <span class="discount-percent">20% off</span>
                    </div>
                    <!-- <div class="deal-offer">
                      <span class="offer-tag">Exchange Available</span>
                      <span class="rating">
                        ★ 4.4 <span class="rating-count">(12k+)</span>
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
              </NuxtLink>
            </div>

            <div class="swiper-slide">
                 <NuxtLink
    to="/shop-all/--1"
    class="deal-card"
  >
              <div class="deal-card" @click="handleDealClick(6)">
                <div class="deal-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=500&fit=crop&auto=format" 
                    alt="Electronics"
                    class="deal-image"
                    loading="lazy"
                  />
                  <div class="image-overlay"></div>
                  
                  <div class="deal-top-content">
                    <div class="deal-title">Electronics Collection</div>
                  </div>
                  
                  <div class="deal-bottom-content">
                    <div class="deal-price">
                      <span class="current-price">From ₹1,499</span>
                      <span class="original-price">₹2,999</span>
                      <span class="discount-percent">50% off</span>
                    </div>
                    <div class="deal-offer">
                      <span class="offer-tag">Festive Special</span>
                      <span class="rating">
                        ★ 4.6 <span class="rating-count">(8.5k)</span>
                      </span>
                    </div>
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
import 'swiper/css/free-mode'
  const config = useRuntimeConfig()
const API_URL_MEDIA = config.public.api.media

// Interfaces
interface OfferData {
  id: number
  title: string
  description: string
  image: string
  category: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

// Reactive state
const offersData = ref<OfferData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const swiper = ref<HTMLElement | null>(null)
let swiperInstance: Swiper | null = null

// Fetch offer data from API
const fetchOfferData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(API_URL_MEDIA)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const result = await response.json() as { data?: OfferData[] }
    if (result.data && Array.isArray(result.data)) {
      offersData.value = result.data.filter((offer: OfferData) => !offer.isDeleted)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch offer data'
    console.error('Error fetching offer data:', err)
  } finally {
    loading.value = false
  }
}

// Get ID 11 data
const offerId11 = computed(() => {
  return offersData.value.find(item => item.id === 11)
})

// Get ID 12 data
const offerId12 = computed(() => {
  return offersData.value.find(item => item.id === 12)
})

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format'
}

// Handle deal click
const handleDealClick = (dealId: number) => {
  console.log('Deal clicked:', dealId)
  // Navigate to deal page
  // router.push(`/deal/${dealId}`)
}

// Initialize Swiper
// Initialize Swiper
const initSwiper = () => {
  if (!swiper.value) return
  
  swiperInstance = new Swiper(swiper.value, {
    modules: [Navigation, Mousewheel, FreeMode],
    slidesPerView: 'auto', // इससे slides auto width लेंगे
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
    
    // Removed invalid options 'calculateHeight', 'calculateWidth' and 'setWrapperSize'
    // These are not part of SwiperOptions; control sizing via CSS or call swiper.update() if needed.
    
    breakpoints: {
      320: {
        slidesPerView: 'auto', // हर breakpoint पर auto रखें
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

// Fetch data on component mount
onMounted(async () => {
  await fetchOfferData()
  
  // Initialize Swiper after data is loaded
  setTimeout(() => {
    initSwiper()
  }, 100)
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
  /* margin-bottom: 24px; */
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

/* Error State */
.error-container {
  text-align: center;
  padding: 40px 20px;
}

/* Swiper Container Wrapper */
.swiper-container-wrapper {
  position: relative;
  padding: 0 20px;
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

/* Deal Offer Footer */
.deal-offer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.offer-tag {
  font-size: 12px;
  color: white;
  font-weight: 500;
  background: rgba(0, 113, 133, 0.8);
  padding: 4px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

.rating {
  font-size: 12px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.rating-count {
  color: rgba(255, 255, 255, 0.8);
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
    margin:0;
    padding: 0;
  }
  .swiper {
  overflow: visible !important;
  /* padding: 10px 0 30px; */
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
