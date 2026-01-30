<template>
  <section class="brand">
    <div class="container container-lg">
      <div class="brand-inner rounded-16">

        <!-- HEADER -->
        <div class="section-heading flex-between flex-wrap gap-8">
          <h5 class="mb-0">Shop by Brands</h5>

          <div class="flex-align gap-12">  
            <NuxtLink
              to="/shop-all"
              class="text-sm fw-medium text-gray-700 hover-text-main-600"
            >
              View All
            </NuxtLink>

            <div class="flex-align gap-6">
              <button class="brand-prev nav-btn">
                <i class="ph ph-caret-left"></i>
              </button>
              <button class="brand-next nav-btn">
                <i class="ph ph-caret-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-40">
          <div class="spinner"></div>
          <p class="mt-2 text-gray-600">Loading brands...</p>
        </div>

        <!-- SLIDER - Always show (with fallback if needed) -->
        <ClientOnly>
          <Swiper
            :modules="[Navigation]"
            :slides-per-view="6"
            :space-between="20"
            :navigation="{
              nextEl: '.brand-next',
              prevEl: '.brand-prev'
            }"
            :breakpoints="{
              320: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
              1200: { slidesPerView: 6 }
            }"
          >
            <SwiperSlide
              v-for="brand in displayedBrands"
              :key="brand.id"
            >
              <NuxtLink
                :to="`/shop-all?brand=${encodeURIComponent(brand.name)}`" 
                class="brand-item"
              >
                <!-- Brand Logo with fallback -->
                <div class="brand-logo-container">
                  <img
                    :src="brand.logo"
                    :alt="brand.name"
                    loading="lazy"
                    class="brand-logo"
                    @error="handleImageError"
                  />
                  <div class="brand-name">{{ brand.name }}</div>
                </div>
              </NuxtLink>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// FALLBACK BRANDS (No copyright issues - generic names)
const fallbackBrands = [
  {
    id: 1,
    name: "FreshMart",
    logo: "/assets/images/nowcategory/festivel.jpg"
  }, 
  {
    id: 2,
    name: "QuickShop",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 3,
    name: "DailyGrocer",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 4,
    name: "OrganicPlus",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 5,
    name: "FarmFresh",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 6,
    name: "UrbanMart",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 7,
    name: "LocalBasket",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 8,
    name: "QuickDeliver",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 9,
    name: "GreenMarket",
    logo: "/assets/images/nowcategory/festivel.jpg"
  },
  {
    id: 10,
    name: "SuperSaver",
    logo: "/assets/images/nowcategory/festivel.jpg"
  }
]

// Reactive state
const brands = ref([])
const loading = ref(true)
const error = ref(null)

// Use fallback brands when API fails
const displayedBrands = computed(() => {
  return brands.value.length > 0 ? brands.value : fallbackBrands
})

const config = useRuntimeConfig()
const API_URL_BRAND = config.public.api.brands 

// Handle image loading errors
const handleImageError = (event) => {
  const img = event.target
  // Fallback to local image
  img.src = '/assets/images/festivel.jpg'
  img.onerror = null // Prevent infinite loop
}

const fetchBrands = async () => {
  try {
    const res = await $fetch(API_URL_BRAND, { timeout: 8000 })
    
    if (res?.data && res.data.length > 0) {
      // Process API brands
      brands.value = res.data.map(brand => ({
        id: brand.id,
        name: brand.name || `Brand ${brand.id}`,
        logo: brand.logo || '/assets/images/festivel.jpg'
      }))
      error.value = null
    } else {
      // API returned empty data, use fallback
      brands.value = []
      console.log('API returned empty data, using fallback brands')
    }
  } catch (err) {
    console.error('API failed, using fallback brands:', err.message)
    // Use fallback brands on error
    brands.value = []
    error.value = null // Don't show error to user
  } finally {
    loading.value = false
  }
}

onMounted(fetchBrands)
</script>

<style scoped>
/* Existing styles remain same, add new ones below */

.brand-logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
}

.brand-logo {
  width: 100%;
  height: 80px;
  object-fit: contain;
  padding: 15px;
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

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-top: 5px;
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

/* Keep all your existing responsive styles */
@media (max-width: 768px) {
  .brand {
    padding: 5px 0;
  }
  
  .brand-logo {
    height: 70px;
    padding: 10px;
  }
  
  .brand-name {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .brand-logo {
    height: 60px;
  }
}
</style>