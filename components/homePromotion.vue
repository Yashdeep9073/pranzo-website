<!-- components/PromotionalBanner.vue -->
<template>
  <section class="promotional-banner pb-40 pt-10 pt-md-60 pt-lg-80">
    <div class="container container-lg px-3 px-md-4">
      <div v-if="loading" class="text-center py-60 py-md-80">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-60 py-md-80">
        <div class="alert alert-danger px-3 px-md-4 py-3">
          {{ error }}
        </div>
      </div>

      <div v-else class="row gy-3 gy-md-4">

        <div
          v-for="(banner, index) in visibleBanners"
          :key="banner.id"
          :class="getColumnClasses(index)"
        >
          <div class="promotional-banner-item position-relative rounded-16 rounded-md-20 rounded-lg-24 overflow-hidden z-1 py-32 py-md-40 py-lg-52 ps-20 ps-md-30 ps-lg-40 pe-16 pe-md-20 pe-lg-24 h-100">
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

              <!-- Price display if description contains price -->
              <div v-if="hasPrice(banner.description)" class="d-flex align-items-end gap-2 gap-md-4 gap-lg-8 mb-2 mb-md-3 mb-lg-4">
                <span class="text-heading fst-italic text-xs text-md-sm text-lg-base">Starting at</span>
                <h6 class="text-danger-600 mb-0 text-sm text-md-base text-lg-xl">{{ extractPrice(banner.description) }}</h6>
              </div>

              <!-- Show description if not a price -->
              <div v-else-if="banner.description && banner.description !== 'This is testing'" class="text-heading text-xs text-md-sm text-lg-base mb-3 mb-md-4 mb-lg-8">
                {{ banner.description }}
              </div>

              <!-- Fallback default text if no proper description -->
              <div v-else class="d-flex align-items-end gap-2 gap-md-4 gap-lg-8 mb-2 mb-md-3 mb-lg-4">
                <span class="text-heading fst-italic text-xs text-md-sm text-lg-base">Starting at</span>
                <h6 class="text-danger-600 mb-0 text-sm text-md-base text-lg-xl">₹ 100</h6>
              </div>
  
              <NuxtLink to="/shop-all" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-2 gap-md-4 gap-lg-8 mt-3 mt-md-4 mt-lg-6 px-3 px-md-4 py-2 py-md-2 py-lg-3 text-xs text-md-sm text-lg-base">
                Shop Now
                <span class="icon d-flex text-sm text-md-base text-lg-xl">
                  <i class="ph ph-arrow-right p-5"></i>
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Fallback static banners if API has less than required items -->
        <template v-if="promotionalBanners.length < requiredBanners">
          <div
            v-for="n in (requiredBanners - promotionalBanners.length)"
            :key="'fallback-' + n"
            :class="getFallbackColumnClasses(n)"
          >
            <div class="promotional-banner-item position-relative rounded-16 rounded-md-20 rounded-lg-24 overflow-hidden z-1 py-32 py-md-40 py-lg-52 ps-20 ps-md-30 ps-lg-40 pe-16 pe-md-20 pe-lg-24 h-100">
              <img
                :src="`/assets/images/thumbs/promotional-banner-img${n + promotionalBanners.length}.png`"
                :alt="`Fallback Banner ${n}`"
                class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-n1"
              > 
              <div class="promotional-banner-item__content">
                <h6 class="promotional-banner-item__title fw-bold mb-2 mb-md-3 mb-lg-4 text-base text-md-lg text-lg-2xl">
                  {{ getFallbackTitle(n + promotionalBanners.length) }}
                </h6>
                <div class="d-flex align-items-end gap-2 gap-md-4 gap-lg-8 mb-2 mb-md-3 mb-lg-4">
                  <span class="text-heading fst-italic text-xs text-md-sm text-lg-base">Starting at</span>
                  <h6 class="text-danger-600 mb-0 text-sm text-md-base text-lg-xl">$60.99</h6>
                </div>
                <NuxtLink to="/shop" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-2 gap-md-4 gap-lg-8 mt-3 mt-md-4 mt-lg-6 px-3 px-md-4 py-2 py-md-2 py-lg-3 text-xs text-md-sm text-lg-base">
                  Shop Now
                  <span class="icon d-flex text-sm text-md-base text-lg-xl">
                    <i class="ph ph-arrow-right"></i>
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
const config = useRuntimeConfig() 
const API_URL = config.public.api.offers 
interface BannerData {
  id: number
  title: string
  description: string
  image: string
  category: string 
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  message: string
  data: BannerData[]
}

// Reactive state
const promotionalBanners = ref<BannerData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Responsive breakpoints
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Update screen width on resize
if (typeof window !== 'undefined') {
  onMounted(() => {
    const updateWidth = () => screenWidth.value = window.innerWidth
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  })
}

// Determine required banners based on screen size
const requiredBanners = computed(() => {
  if (screenWidth.value < 768) return 2 // Mobile: 2 banners
  return 4 // Tablet/Desktop: 4 banners
})

// Get visible banners (limit based on screen size)
const visibleBanners = computed(() => {
  return promotionalBanners.value.slice(0, requiredBanners.value)
})

// Get column classes based on index and screen size
const getColumnClasses = (index: number): string => {
  return 'col-12 col-md-6 col-lg-3'
}


// Get fallback column classes
const getFallbackColumnClasses = (index: number): string => {
  return 'col-12 col-md-6 col-lg-3'
}

// Fetch banner data
const fetchPromotionalBanners = async () => {
  try {
    loading.value = true
    error.value = null

    const result: ApiResponse = await $fetch(API_URL, {
      method: 'GET',

      params: {
        offerType: 'FLASH_SALE',
        isActive: true
      },

      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      retry: 3,
      retryDelay: 2000,
    })

    if (result?.data && Array.isArray(result.data)) {
      promotionalBanners.value = result.data
        .filter(  
          banner =>
            banner.category === 'HEROSECTION' && 
            !banner.isDeleted
        )
        .sort((a, b) => a.id - b.id)
    }

  } catch (err: any) {
    error.value =
      err?.data?.message ||
      err?.message ||
      'Failed to fetch banner data'

    console.error('Error fetching promotional banners:', err)
  } finally {
    loading.value = false
  }
}


// Helper function to check if description contains price
const hasPrice = (description: string): boolean => {
  return description.includes('₹') || description.includes('$')
}

// Extract price from description
const extractPrice = (description: string): string => {
  // Extract price pattern like ₹ 100 or $60.99
  const priceMatch = description.match(/(₹|\$)\s*[\d,.]+/)
  return priceMatch ? priceMatch[0] : description
}

// Fallback titles for static banners
const getFallbackTitle = (index: number): string => {
  const titles = [
    'Everyday Fresh Meat',
    'Daily Fresh Vegetables',
    'Everyday Fresh Milk',
    'Everyday Fresh Fruits'
  ]
  return titles[index - 1] || 'Fresh Products'
}

// Fetch data on component mount
onMounted(() => {
  fetchPromotionalBanners()
})

// Optional: Auto-refresh every 5 minutes
onMounted(() => {
  const interval = setInterval(fetchPromotionalBanners, 5 * 60 * 1000)
  return () => clearInterval(interval)
})
</script>

<style scoped>
/* .promotional-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding:0px 5px;
} */
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
  /* .promotional-banner {
    padding-top: 32px !important;
  } */

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
  /* .promotional-banner {
    padding-top: 24px !important;
  } */
  
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