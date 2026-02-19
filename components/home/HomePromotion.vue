<!-- components/PromotionalBanner.vue -->
<template>
  <section class="promotional-banner pb-40 pt-10 pt-md-60 pt-lg-80">
    <div class="container container-lg px-3 px-md-4">
      <div v-if="loading && showStaticFallback === false" class="text-center py-60 py-md-80">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error && showStaticFallback === false" class="text-center py-60 py-md-80">
        <div class="alert alert-danger px-3 px-md-4 py-3">
          {{ error }}
        </div>
      </div>

      <div v-else class="row gy-3 gy-md-4">
        <!-- Category Header -->
        <div v-if="props.category" class="col-12 mb-4">
          <h4 class="text-center mb-3 text-capitalize">
            {{ props.category.replace('-', ' ') }} Offers
          </h4>
          <p class="text-center text-muted mb-4">
            Special deals on {{ props.category.replace('-', ' ') }} products
          </p>
        </div>
        
        <!-- Dynamic Banners from API -->
        <div
          v-for="(banner, index) in (showStaticFallback ? visibleStaticBanners : promotionalBanners)"
          :key="banner.id"
          :class="getColumnClasses(index)"
        >
          <div class="promotional-banner-item position-relative rounded-16 rounded-md-20 rounded-lg-24 overflow-hidden z-1 py-32 py-md-40 py-lg-52 ps-20 ps-md-30 ps-lg-40 pe-16 pe-md-20 pe-lg-24 h-100">
            <!-- Category Badge -->
            <div v-if="banner.category" class="position-absolute top-0 end-0 m-3 z-2">
              <span class="badge bg-primary text-white text-capitalize">
                {{ banner.category?.replace('-', ' ')}}
              </span>
            </div>
            
            <img
              :src="banner.image"
              :alt="banner.title"
              class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-n1"
              loading="lazy"
            >
            <div class="promotional-banner-item__content">
              <h6 class="promotional-banner-item__title fw-bold mb-2 mb-md-3 mb-lg-4 text-base text-md-lg text-lg-2xl">
                {{ banner.title }}
              </h6>

              <div class="d-flex align-items-end gap-2 gap-md-4 gap-lg-8 mb-2 mb-md-3 mb-lg-4">
                <span class="text-heading fst-italic text-xs text-md-sm text-lg-base">Starting at</span>
                <h6 class="text-danger-600 mb-0 text-sm text-md-base text-lg-xl">{{ banner.price || '₹299' }}</h6>
              </div>
  
              <NuxtLink :to="banner.slug ? `/shop/shop-all?offer=${banner.slug}` : (banner.category ? `/shop/shop-all?category=${banner.category}` : '/shop/shop-all')" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-2 gap-md-4 gap-lg-8 mt-3 mt-md-4 mt-lg-6 px-3 px-md-4 py-2 py-md-2 py-lg-3 text-xs text-md-sm text-lg-base">
                Shop Now
                <span class="icon d-flex text-sm text-md-base text-lg-xl">
                  <i class="ph ph-arrow-right p-5"></i>
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Props for dynamic category filtering
const props = defineProps({
  category: { type: String, default: '' }
})

const config = useRuntimeConfig() 
const API_URL = `${config.public.api.offers}?offerType=CATEGORY` 

interface OfferData {
  id: number
  title: string
  description: string
  image: string
  category: string 
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  price?: string // Optional price field for API data
  slug?: string // Offer slug for dynamic routing
  discountType?: string // Discount type (PERCENTAGE, FIXED)
  discountValue?: number // Discount value
  startDate?: string // Offer start date
  endDate?: string // Offer end date
  offerType?: string // Offer type (FLASH_SALE, LIMITED, etc.)
  isActive?: boolean // Whether offer is active
  isFeatured?: boolean // Whether offer is featured
  priority?: number // Display priority
}

interface StaticBanner {
  id: number
  title: string
  description: string
  image: string
  price: string
  category?: string // Optional category for static banners
  slug?: string // Optional slug for static banners
}

interface ApiResponse {
  message: string
  data: OfferData[] // Changed from BannerData[] to OfferData[]
}

// Reactive state
const promotionalBanners = ref<OfferData[]>([])
const loading = ref(false) // Start with false since we have static fallback
const error = ref<string | null>(null)
const showStaticFallback = ref(false) // Control when to show static banners

// Static banners data (always available)
const staticBanners = ref<StaticBanner[]>([
  {
    id: 1,
    title: 'Everyday Fresh Meat',
    description: 'Fresh meat delivered daily',
    image: '/assets/images/thumbs/promotional-banner-img1.png',
    price: '₹ 299',
    category: 'meat'
  },
  {
    id: 2,
    title: 'Daily Fresh Vegetables',
    description: 'Organic vegetables at your doorstep',
    image: '/assets/images/thumbs/promotional-banner-img2.png',
    price: '₹ 149',
    category: 'vegetables'
  },
  {
    id: 3,
    title: 'Everyday Fresh Milk',
    description: 'Pure and fresh dairy products',
    image: '/assets/images/thumbs/promotional-banner-img3.png',
    price: '₹ 49'
  },
  {
    id: 4,
    title: 'Everyday Fresh Fruits',
    description: 'Seasonal fruits from local farms',
    image: '/assets/images/thumbs/promotional-banner-img4.png',
    price: '₹ 199'
  }
])

// Responsive breakpoints
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Determine required banners based on screen size
const requiredBanners = computed(() => {
  if (screenWidth.value < 768) return 2 // Mobile: 2 banners
  return 4 // Tablet/Desktop: 4 banners
})

// Get visible static banners based on screen size
const visibleStaticBanners = computed(() => {
  return staticBanners.value.slice(0, requiredBanners.value)
})

// Update screen width on resize
if (typeof window !== 'undefined') {
  onMounted(() => {
    const updateWidth = () => screenWidth.value = window.innerWidth
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  })
}

// Get column classes based on index and screen size
const getColumnClasses = (index: number): string => {
  return 'col-12 col-md-6 col-lg-3'
}

// Fetch offer data from API
const fetchPromotionalBanners = async () => {
  try {
    loading.value = true
    error.value = null
    showStaticFallback.value = false

    const result: ApiResponse = await $fetch(API_URL, {
      method: 'GET',
      params: {
        isActive: true,
        // Filter by offerType if category is specified
        ...(props.category && { offerType: props.category.toUpperCase() })
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 8000,
      retry: 2,
    })

    //console.log('🔍 [HomePromotion] Raw API response:', result)
    //console.log('🔍 [HomePromotion] API URL:', API_URL)
    //console.log('🔍 [HomePromotion] API data length:', result?.data?.length || 0)

    if (result?.data && Array.isArray(result.data)) {
      //console.log('🔍 [HomePromotion] Raw API data:', result.data)
      
      // Log the first offer structure in detail
      if (result.data.length > 0) {
        //console.log('🔍 [HomePromotion] First offer structure:', JSON.stringify(result.data[0], null, 2))
      }
      
      // TEMP: Bypass filtering to test display logic
      const validOffers = result.data
        .map((offer: any) => {
          //console.log('🔍 [HomePromotion] Processing offer for display:', offer)
          return {
            id: offer.id,
            title: offer.name || offer.title || `Special Offer ${offer.id}`,
            description: offer.description || '',
            image: offer.image || (offer.images?.[0]?.imageUrl) || '/assets/images/thumbs/promotional-banner-img1.png',
            category: offer.offerType?.toLowerCase() || 'general',
            slug: offer.slug || `offer-${offer.id}`,
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            startDate: offer.startDate,
            endDate: offer.endDate,
            offerType: offer.offerType,
            isActive: offer.isActive,
            isFeatured: offer.isFeatured,
            priority: offer.priority,
            isDeleted: offer.isDeleted,
            createdAt: offer.createdAt || new Date().toISOString(),
            updatedAt: offer.updatedAt || new Date().toISOString(),
            price: offer.discountValue ? (offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue}`) : undefined
          }
        })
        .sort((a, b) => a.id - b.id)

      //console.log(`🔍 [HomePromotion] Filtered valid offers count: ${validOffers.length}`)
      //console.log(`🔍 [HomePromotion] showStaticFallback before: ${showStaticFallback.value}`)
      //console.log(`🔍 [HomePromotion] promotionalBanners length: ${promotionalBanners.value.length}`)
      
      if (validOffers.length > 0) {
        promotionalBanners.value = validOffers
        showStaticFallback.value = false
        //console.log(`✅ [HomePromotion] Loaded ${validOffers.length} offers`)
        //console.log(`🔍 [HomePromotion] showStaticFallback after: ${showStaticFallback.value}`)
      } else {
        showStaticFallback.value = true
        //console.log('⚠️ [HomePromotion] No offers available, using static data')
        //console.log(`🔍 [HomePromotion] showStaticFallback after: ${showStaticFallback.value}`)
      }
    } else {
      showStaticFallback.value = true
      //console.log('⚠️ [HomePromotion] Invalid API response, using static data')
    }
  } catch (err: any) {
    console.error('❌ [HomePromotion] API fetch failed:', err)
    showStaticFallback.value = true
    error.value = null
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  // Try to fetch from API, but immediately show static banners if fails
  fetchPromotionalBanners()
  
  // Set a timeout to show static banners if API is taking too long
  setTimeout(() => {
    if (loading.value) {
      showStaticFallback.value = true
      loading.value = false
    }
  }, 3000) // Show static after 3 seconds if API is slow
})

// Optional: Retry API in background (but keep showing static banners)
onMounted(() => {
  const retryInterval = setInterval(() => {
    if (!showStaticFallback.value) {
      clearInterval(retryInterval)
      return
    }
    // Retry API in background every 30 seconds
    fetchPromotionalBanners().then(() => {
      // If API succeeds now, update banners
      if (promotionalBanners.value.length >= requiredBanners.value) {
        showStaticFallback.value = false
      }
    })
  }, 30000)
  
  return () => clearInterval(retryInterval)
})
</script>

<style scoped>
/* Keep all your existing styles */
.promotional-banner-item {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.promotional-banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%); 
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.promotional-banner-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);  
  border-color: rgba(79, 70, 229, 0.2);
}

.promotional-banner-item:hover::before {
  opacity: 1;
}

.promotional-banner-item__content {
  padding: 20px;
  position: relative;
  z-index: 2;
}

.promotional-banner-item__title {
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 0;
}

.promotional-banner-item img {
  transition: transform 0.5s ease;
  min-height: 100%;
  object-position: center;
}

.promotional-banner-item:hover img {
  transform: scale(1.05);
}

.btn-main {
  background: linear-gradient(135deg, #0266c3, #04b370);
  border: none;
  font-weight: 600;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  color: white;
}

.text-danger-600 {
  color: #dc2626 !important;
  font-weight: 700;
}

.text-heading {
  color: #64748b;
}

/* Loading spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Enhanced Responsive Design */

/* Desktop (≥1200px) */
@media (min-width: 1200px) {
  .promotional-banner-item__title {
    margin-bottom: 16px;
  }
}

/* Tablet (≥768px) */
@media (max-width: 1199px) and (min-width: 768px) {
  .promotional-banner {
    padding-top: 40px !important;
  }

  .promotional-banner-item {
    margin-bottom: 16px;
  }
}

/* Mobile (≥576px) */
@media (max-width: 767px) and (min-width: 576px) {
  .col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
}

/* Small Mobile (<576px) */
@media (max-width: 575px) {
  .promotional-banner-item {
    margin-bottom: 12px;
  }
  
  .promotional-banner-item__title {
    font-size: 0.875rem !important;
    line-height: 1.2;
  }
  
  .btn-main {
    padding: 8px 16px !important;
    font-size: 0.75rem !important;
    min-height: 36px;
  }
  
  .text-heading {
    font-size: 0.75rem !important;
  }
  
  .text-danger-600 {
    font-size: 0.875rem !important;
  }
}

/* Extra Small Mobile (<400px) */
@media (max-width: 399px) {
  .container-lg {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  
  .promotional-banner-item {
    padding: 20px 16px !important;
    margin-bottom: 8px;
  }
  
  .promotional-banner-item__title {
    font-size: 0.8125rem !important;
    line-height: 1.1;
  }
  
  .btn-main {
    padding: 6px 12px !important;
    font-size: 0.6875rem !important;
    min-height: 32px;
  }
  
  .text-heading {
    font-size: 0.6875rem !important;
  }
  
  .text-danger-600 {
    font-size: 0.8125rem !important;
  }
}

@media (hover: none) and (pointer: coarse) {
  .promotional-banner-item:hover {
    transform: none;
  }
  
  .promotional-banner-item:active {
    transform: scale(0.98);
  }
  
  .btn-main {
    min-height: 44px;
  }
} 
</style> 
