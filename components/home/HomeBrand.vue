<template>
  <section class="brand">
    <div class="container container-lg">
      <div class="brand-inner rounded-16 p-16 p-md-24">

        <!-- HEADER -->
        <div class="section-heading flex-between flex-wrap gap-8 mb-16 mb-md-24">
          <h5 class="mb-0 text-lg text-md-xl">Shop by Brands</h5>

          <div class="flex-align gap-12">
            <NuxtLink to="/shop-all" class="text-sm fw-medium text-gray-700 hover-text-main-600">
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

        <!-- MOBILE VIEW -->
        <div class="mobile-brands-view d-md-none">
          <div class="mobile-brands-grid">
            <div v-for="brand in displayedBrands.slice(0, 6)" :key="brand.id" class="mobile-brand-tile">
              <NuxtLink :to="`/shop-all?brand=${encodeURIComponent(brand.name)}`" class="mobile-brand-card">
                <img :src="brand.logo" :alt="brand.name" loading="lazy" class="brand-logo-img" @error="handleImageError"
                  decoding="async" />
                <div class="brand-info">
                  <h3 class="brand-title">{{ brand.name }}</h3>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- DESKTOP VIEW -->
        <div class="desktop-brands-view d-none d-md-block">
          <div class="brand-slider-wrapper position-relative" :class="{ 'opacity-0': loading }">
            <ClientOnly>
              <Swiper :modules="[Navigation]" :slides-per-view="6" :space-between="12" :navigation="{
                nextEl: '.brand-next',
                prevEl: '.brand-prev'
              }" :breakpoints="{
                320: {
                  slidesPerView: 3,
                  spaceBetween: 12
                },
                480: {
                  slidesPerView: 4,
                  spaceBetween: 16
                },
                576: {
                  slidesPerView: 4,
                  spaceBetween: 16
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 12
                },
                992: {
                  slidesPerView: 5,
                  spaceBetween: 12
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 12
                }
              }" class="brand-swiper">
                <SwiperSlide v-for="brand in displayedBrands" :key="brand.id">
                  <NuxtLink :to="`/shop-all?brand=${encodeURIComponent(brand.name)}`" class="brand-item d-block h-100">
                    <div class="brand-card h-100 p-8 p-md-12">
                      <div class="brand-logo-container h-100">
                        <div class="brand-logo-wrapper mb-8 mb-md-12">
                          <img :src="brand.logo" :alt="brand.name" loading="lazy" class="brand-logo"
                            @error="handleImageError" decoding="async" />
                        </div>
                        <div class="brand-name text-center text-xs text-md-sm">{{ brand.name }}</div>
                      </div>
                    </div>
                  </NuxtLink>
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Reactive state
const brands = ref([])
const loading = ref(true)
const error = ref(null)

// Use fallback brands when API fails
const displayedBrands = computed(() => brands.value)

const config = useRuntimeConfig()
const API_URL_BRAND = config.public.api.brands

// Handle image loading errors
const handleImageError = (event) => {
  const img = event.target
  // Prevent infinite loop - only set fallback once
  if (!img.dataset.fallbackSet) {
    img.src = '/assets/images/nowcategory/festivel.jpg'
    img.dataset.fallbackSet = 'true'
  }
  img.onerror = null // Prevent infinite loop
}

const fetchBrands = async () => {
  try {
    loading.value = true

    // Check if API URL is available
    if (!API_URL_BRAND) {
      console.log('Brands API not configured, using fallback brands')
      brands.value = getFallbackBrands()
      loading.value = false
      return
    }

    const res = await $fetch(API_URL_BRAND, { timeout: 5000 })

    if (res?.data && res.data.length > 0) {
      // Process API brands
      brands.value = res.data.map(brand => ({
        id: brand.id,
        name: brand.name || `Brand ${brand.id}`,
        logo: brand.logo || '/assets/images/nowcategory/festivel.jpg'
      }))
      error.value = null
    } else {
      // API returned empty data, use fallback
      brands.value = getFallbackBrands()
      //console.log('API returned empty data, using fallback brands')
    }
  } catch (err) {
    console.error('API failed, using fallback brands:', err.message)
    // Use fallback brands on error
    brands.value = getFallbackBrands()
    error.value = null // Don't show error to user
  } finally {
    loading.value = false
  }
}

// Fallback brands to prevent API failures
const getFallbackBrands = () => {
  return [
    { id: 1, name: 'Brand A', logo: '/assets/images/nowcategory/festivel.jpg' },
    { id: 2, name: 'Brand B', logo: '/assets/images/nowcategory/festivel.jpg' },
  ]
}

onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
/* Main Container */
.brand {
  padding: 20px 0;
}

.brand-inner {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Slider Wrapper */
.brand-slider-wrapper {
  position: relative;
  min-height: 140px;
}

.brand-swiper {
  padding: 8px 8px 16px 8px;
  margin: -8px -8px;
}

/* Brand Card */
.brand-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.brand-card:hover {
  transform: translateY(-4px);
  border-color: #CA2D52;
  box-shadow: 0 12px 20px -6px rgba(59, 130, 246, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.05);
}

.brand-logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.brand-logo-wrapper {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  padding: 8px;
  transition: transform 0.3s ease;
}

.brand-card:hover .brand-logo {
  transform: scale(1.05);
}

.brand-name {
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
  padding: 0 4px;
  margin-top: auto;
}

/* Navigation Buttons */
.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: #CA2D52;
  border-color: #CA2D52;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #CA2D52;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Swiper Slide Fix */
:deep(.swiper-slide) {
  height: auto !important;
}

:deep(.swiper-slide > *) {
  height: 100% !important;
}

/* Responsive Design */

/* Tablet (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .brand-logo-wrapper {
    height: 75px;
  }

  .brand-card {
    padding: 10px;
  }
}

/* Small Desktop (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .brand-logo-wrapper {
    height: 80px;
  }
}

/* Large Desktop (≥1200px) */
@media (min-width: 1200px) {
  .brand-logo-wrapper {
    height: 85px;
  }
}

/* Mobile (480px - 767px) */
@media (max-width: 767px) {
  .brand {
    padding: 16px 0;
  }

  .brand-inner {
    padding: 16px !important;
  }

  .brand-slider-wrapper {
    min-height: 140px;
  }

  .brand-logo-wrapper {
    height: 80px;
  }

  .brand-card {
    padding: 12px;
    min-height: 120px;
  }

  .brand-logo {
    padding: 4px;
  }

  .brand-name {
    font-size: 13px;
    margin-top: 8px;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

/* Small Mobile (≤479px) */
@media (max-width: 479px) {
  .brand {
    padding: 12px 0;
  }

  .brand-inner {
    padding: 12px !important;
  }

  .brand-slider-wrapper {
    min-height: 130px;
  }

  .brand-logo-wrapper {
    height: 70px;
  }

  .brand-card {
    padding: 10px;
    min-height: 110px;
  }

  .brand-name {
    font-size: 12px;
    margin-top: 6px;
  }

  .section-heading h5 {
    font-size: 18px !important;
  }

  .nav-btn {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }
}

/* Extra Small Mobile (≤375px) */
@media (max-width: 375px) {

  .brand-card {
    padding: 8px;
    min-height: 100px;
  }

  .brand-name {
    font-size: 11px;
    margin-top: 4px;
  }

  .brand-logo {
    padding: 2px;
  }
}

/* Mobile Brands View - 2x3 Grid Layout */
.mobile-brands-view {
  margin-top: 24px;
  position: relative;
  background-color: #ffffff;
}

.mobile-brands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 16px;
  padding: 8px 0;
}

.mobile-brand-tile {
  position: relative;
}

.mobile-brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  justify-content: center;
}

.mobile-brand-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #CA2D52, #e11d48);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.mobile-brand-card:hover::before {
  transform: translateY(0);
}

.mobile-brand-card:hover {
  background: #ffffff;
  border-color: #CA2D52;
  box-shadow: 0 10px 25px rgba(202, 45, 82, 0.15), 0 4px 10px rgba(0, 0, 0, 0.05);
  transform: translateY(-4px);
}

.mobile-brand-card:hover {
  border-color: #CA2D52;
  box-shadow: 0 8px 24px rgba(202, 45, 82, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.brand-logo-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  filter: brightness(0.9);
}

.mobile-brand-card:hover .brand-logo-img {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(202, 45, 82, 0.2));
}

.brand-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
  padding: 16px 8px 8px;
  text-align: center;
  width: 100%;
}

.brand-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  letter-spacing: 0.025em;
  transition: color 0.3s ease;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.mobile-brand-card:hover .brand-title {
  color: #ffffff;
}

/* Responsive adjustments */
</style>