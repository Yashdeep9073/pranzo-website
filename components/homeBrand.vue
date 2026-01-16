<template>
  <div class="brand  overflow-hidden">
    <div class="container container-lg">
      <div class="brand-inner rounded-16">
        <div class="section-heading">
          <div class="flex-between flex-wrap gap-8">
            <h5 class="mb-0 wow fadeInLeft">Shop by Brands</h5>
            <div class="flex-align gap-16 wow fadeInRight">
              <NuxtLink to="/shop-all" class="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                View All Deals
              </NuxtLink>
              <div class="flex-align gap-8">
                <button type="button" class="brand-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                  <i class="ph ph-caret-left"></i>
                </button>
                <button type="button" class="brand-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                  <i class="ph ph-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-40">
          <div class="spinner" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-gray-600">Loading brands...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-40">
          <div class="error-icon mb-3">
            <i class="ph ph-warning-circle text-4xl text-red-500"></i>
          </div>
          <p class="text-red-600 mb-3">Failed to load brands. Please try again.</p>
          <button @click="fetchBrands" class="btn-retry px-4 py-2 bg-main-600 text-white rounded-lg hover:bg-main-700 transition">
            Retry
          </button>
        </div>

        <!-- Brands Slider -->
        <div v-else-if="brands.length > 0" class="brand-slider arrow-style-two">
          <div class="swiper-container">
            <Swiper
              :modules="[Navigation]"
              :slides-per-view="6"
              :space-between="20"
              :navigation="{
                nextEl: '.brand-next',
                prevEl: '.brand-prev',
              }"
              :breakpoints="{
                320: { slidesPerView: 2, spaceBetween: 10 },
                576: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 15 },
                992: { slidesPerView: 5, spaceBetween: 20 },
                1200: { slidesPerView: 6, spaceBetween: 20 }
              }"
            >
              <SwiperSlide v-for="(brand, index) in brands" :key="brand.id">
                <div class="brand-item" :data-aos="'zoom-in'" :data-aos-duration="(index + 1) * 200">
                  <NuxtLink :to="`shop-all?brand=${brand.name}`" class="block">
                    <img 
                      :src="brand.logo" 
                      :alt="brand.name"
                      class="brand-logo"
                      @error="handleImageError"
                      loading="lazy"
                    />
                  </NuxtLink>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-40">
          <div class="empty-icon mb-3">
            <i class="ph ph-storefront text-4xl text-gray-400"></i>
          </div>
          <p class="text-gray-600">No brands available at the moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Reactive state
const brands = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch brands from API
const fetchBrands = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await useFetch(
      'https://kartmania-api.vibrantick.org/common/brand/read',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      }
    )
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to fetch brands')
    }
    
    if (data.value && data.value.success !== false && data.value.data) {
      brands.value = data.value.data
    } else {
      throw new Error(data.value?.message || 'No brands data received')
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
    console.error('Error fetching brands:', err)
    brands.value = [] // Reset brands on error
  } finally {
    loading.value = false
  }
}

// Handle broken images
const handleImageError = (event) => {
  const fallbackImage = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f5f5f5"/><text x="50" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="600" text-anchor="middle" fill="%23999">BRAND</text></svg>'
  event.target.src = fallbackImage
  event.target.classList.add('error-image')
}

// Fetch brands on component mount
onMounted(() => {
  fetchBrands()
})

// Optional: Auto-refresh every 5 minutes (uncomment if needed)
/*
const { pause, resume } = useInterval(300000, {
  callback: fetchBrands,
  immediate: false
})

onMounted(() => {
  resume()
})

onUnmounted(() => {
  pause()
})
*/

// Or use setInterval:
/*
let refreshInterval = null

onMounted(() => {
  fetchBrands()
  refreshInterval = setInterval(fetchBrands, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
*/
</script>

<style scoped>
.swiper-container {
  overflow: hidden;
  position: relative;
  padding: 10px 0;
}

.swiper-slide {
  height: auto;
  display: flex;
}

.brand-prev,
.brand-next {
  z-index: 10;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.brand-prev:hover,
.brand-next:hover {
  background-color: #3b82f6; 
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.brand-logo {
  width: 100%;
  height: 120px;
  object-fit: contain;
  padding: 20px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.brand-logo:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.brand-logo.error-image {
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.brand-item {
  background: transparent;
  border-radius: 16px;
  padding: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.brand-item:hover {
  transform: translateY(-2px);
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Button styles */
.btn-retry {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

/* Empty and error states */
.empty-icon,
.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f9fafb;
  margin: 0 auto 20px;
}

.error-icon {
  background: #fef2f2;
}

.empty-icon {
  background: #f9fafb;
}
@media(max-width:1600px){
   .brand { 
  padding-top: 20px;
  }
  
  .brand-inner {
    padding: 11px; 
  }
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .brand {
    padding: 20px 0; 
  }
  
  /* .brand-inner {
    padding: 16px;
  } */
  
  .brand-logo {
    height: 100px;
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .brand-logo {
    height: 80px;
    padding: 10px;
  }
  
  .brand-prev,
  .brand-next {
    width: 36px;
    height: 36px;
  }
}
</style>
