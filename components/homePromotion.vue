<!-- components/PromotionalBanner.vue -->
<template>
  <section class="promotional-banner pt-80">
    <div class="container container-lg">
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-80">
        <div class="alert alert-danger">
          {{ error }}
        </div>
      </div>
      
      <div v-else class="row gy-4">
        <!-- Dynamic Banners from API -->
        <div 
          v-for="(banner, index) in promotionalBanners" 
          :key="banner.id" 
          class="col-xl-3 col-sm-6 col-xs-6"
        >
          <div class="promotional-banner-item position-relative rounded-24 overflow-hidden z-1 py-52 ps-40 pe-24 h-100">
            <img 
              :src="banner.image" 
              :alt="banner.title"
              class="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
              loading="lazy"
            >
            <div class="promotional-banner-item__content">
              <h6 class="promotional-banner-item__title text-2xl max-w-184">
                {{ banner.title }}
              </h6>
              
              <!-- Price display if description contains price -->
              <div v-if="hasPrice(banner.description)" class="d-flex align-items-end gap-8">
                <span class="text-heading fst-italic text-sm">Starting at</span>
                <h6 class="text-danger-600 mb-0 text-xl">{{ extractPrice(banner.description) }}</h6>
              </div>
              
              <!-- Show description if not a price -->
              <div v-else-if="banner.description && banner.description !== 'This is testing'" class="text-heading text-sm mb-16">
                {{ banner.description }}
              </div>
              
              <!-- Fallback default text if no proper description -->
              <div v-else class="d-flex align-items-end gap-8">
                <span class="text-heading fst-italic text-sm">Starting at</span>
                <h6 class="text-danger-600 mb-0 text-xl">₹ 100</h6>
              </div>
              
              <NuxtLink to="/shop" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-24">
                Shop Now
                <span class="icon text-xl d-flex">
                  <i class="ph ph-arrow-right"></i>
                </span> 
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Fallback static banners if API has less than 4 items -->
        <template v-if="promotionalBanners.length < 4">
          <div 
            v-for="n in (4 - promotionalBanners.length)" 
            :key="'fallback-' + n"
            class="col-xl-3 col-sm-6 col-xs-6"
          >
            <div class="promotional-banner-item position-relative rounded-24 overflow-hidden z-1 py-52 ps-40 pe-24 h-100">
              <img 
                :src="`/assets/images/thumbs/promotional-banner-img${n + promotionalBanners.length}.png`" 
                :alt="`Fallback Banner ${n}`"
                class="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
              >
              <div class="promotional-banner-item__content">
                <h6 class="promotional-banner-item__title text-2xl max-w-184">
                  {{ getFallbackTitle(n + promotionalBanners.length) }}
                </h6>
                <div class="d-flex align-items-end gap-8">
                  <span class="text-heading fst-italic text-sm">Starting at</span>
                  <h6 class="text-danger-600 mb-0 text-xl">$60.99</h6>
                </div>
                <NuxtLink to="/shop" class="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-24">
                  Shop Now
                  <span class="icon text-xl d-flex">
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
import { ref, onMounted } from 'vue'

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

// API URL
const API_URL = 'https://kartmania-api.vibrantick.org/common/media/read'

// Fetch banner data
const fetchPromotionalBanners = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const result: ApiResponse = await response.json()
    
    if (result.data && Array.isArray(result.data)) {
      // Filter only HEROSECTION category banners
      promotionalBanners.value = result.data.filter(banner => 
        banner.category === 'HEROSECTION' && !banner.isDeleted
      )
      
      // Sort by ID if needed
      promotionalBanners.value.sort((a, b) => a.id - b.id)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch banner data'
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
.promotional-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.promotional-banner-item {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  position: relative;
  z-index: 2;
}

.promotional-banner-item__title {
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 16px;
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
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  padding: 10px 24px;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .promotional-banner-item {
    padding: 40px 24px !important;
  }
}

@media (max-width: 768px) {
  .promotional-banner {
    padding-top: 40px !important;
  }
  
  .promotional-banner-item {
    padding: 32px 20px !important;
    margin-bottom: 16px;
  }
  
  .promotional-banner-item__title {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 576px) {
  .col-xs-6 {
    flex: 0 0 auto;
    width: 50%;
  }
  
  .promotional-banner-item {
    padding: 24px 16px !important;
  }
}
</style>