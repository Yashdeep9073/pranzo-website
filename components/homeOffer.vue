<template>
  <section class="offer pt-80">
    <div class="container container-lg">
      <div v-if="loading" class="row gy-4">
        <!-- Loading Skeletons -->
        <div class="col-sm-6" data-aos="zoom-in" data-aos-duration="600">
          <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
            <div class="skeleton-bg position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100"></div>
            <div class="py-xl-4 max-w-392 ms-auto">
              <div class="skeleton-logo mb-16 w-80 h-80 rounded-circle"></div>
              <div class="skeleton-title mb-8"></div>
              <div class="flex-align gap-8 mb-16">
                <div class="skeleton-text-sm"></div>
                <div class="skeleton-text-xs"></div>
              </div>
              <div class="skeleton-btn"></div>
            </div>
          </div>
        </div>
        
        <div class="col-sm-6" data-aos="zoom-in" data-aos-duration="800">
          <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
            <div class="skeleton-bg position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100"></div>
            <div class="py-xl-4 max-w-392">
              <div class="skeleton-logo mb-16 w-80 h-80 rounded-circle"></div>
              <div class="skeleton-title mb-8"></div>
              <div class="flex-align gap-8 mb-16">
                <div class="skeleton-text-sm"></div>
                <div class="skeleton-text-xs"></div>
              </div>
              <div class="skeleton-btn-white"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-80">
        <div class="alert alert-danger">
          {{ error }}
        </div>
        <button @click="fetchOfferData" class="btn btn-main mt-3">
          Retry
        </button>
      </div>
      
      <div v-else class="row gy-4">
        <!-- Offer Card 1 - ID 11 -->
        <div v-if="offerId11" class="col-sm-6" data-aos="zoom-in" data-aos-duration="600">
          <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
            <!-- Background Image from API ID 11 -->
            <img 
              :src="offerId11.image" 
              :alt="offerId11.title" 
              class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
              loading="lazy"
            />
            
            <div class="py-xl-4 max-w-392 ms-auto">
              <!-- Logo - Static or fallback -->
              <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                <img 
                  src="/assets/images/thumbs/offer-logo.png" 
                  alt="Offer Logo" 
                  class="w-100 h-100 object-fit-contain p-2"
                />
              </div>
              
              <!-- Title from ID 11 -->
              <h5 class="mb-8 text-white fw-bold">{{ offerId11.title }}</h5>
              
              <!-- Description if available, else static text -->
              <div class="flex-align gap-8">
                <span class="text-sm fw-medium text-white">
                  {{ offerId11.description && offerId11.description !== offerId11.title ? offerId11.description : 'Delivery by 6:15am' }}
                </span>
                <span class="text-xs text-white">Expire Aug 5</span>
              </div>
              
              <!-- Button -->
              <NuxtLink 
                to="/shop" 
                class="mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8"
              >
                Shop Now
                <span class="icon text-xl d-flex">
                  <i class="ph ph-arrow-right"></i>
                </span> 
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Offer Card 2 - ID 12 -->
        <div v-if="offerId12" class="col-sm-6" data-aos="zoom-in" data-aos-duration="800">
          <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
            <!-- Background Image from API ID 12 -->
            <img 
              :src="offerId12.image" 
              :alt="offerId12.title" 
              class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
              loading="lazy"
            />
            
            <div class="py-xl-4 max-w-392">
              <!-- Logo - Static or fallback -->
              <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                <img 
                  src="/assets/images/thumbs/offer-logo.png" 
                  alt="Offer Logo" 
                  class="w-100 h-100 object-fit-contain p-2"
                />
              </div>
              
              <!-- Title from ID 12 -->
              <h5 class="mb-8 text-heading fw-bold">{{ offerId12.title }}</h5>
              
              <!-- Description if available, else static text -->
              <div class="flex-align gap-8">
                <span class="text-sm fw-medium text-heading">
                  {{ offerId12.description && offerId12.description !== offerId12.title ? offerId12.description : 'Delivery by 6:15am' }}
                </span>
                <span class="text-sm text-success-600">Expire Aug 5</span>
              </div>
              
              <!-- Button -->
              <NuxtLink 
                to="/shop" 
                class="mt-16 btn bg-white hover-text-white hover-bg-main-800 text-heading fw-medium d-inline-flex align-items-center rounded-pill gap-8"
              >
                Shop Now
                <span class="icon text-xl d-flex">
                  <i class="ph ph-arrow-right"></i>
                </span> 
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Fallback if IDs 11 & 12 not found -->
        <template v-if="!offerId11 || !offerId12">
          <!-- Fallback Card 1 -->
          <div class="col-sm-6" data-aos="zoom-in" data-aos-duration="600">
            <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
              <img 
                src="/assets/images/bg/offer-bg-img1.png" 
                alt="Offer Background" 
                class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
              />
              
              <div class="py-xl-4 max-w-392 ms-auto">
                <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                  <img 
                    src="/assets/images/thumbs/offer-logo.png" 
                    alt="Offer Logo" 
                    class="w-100 h-100 object-fit-contain p-2"
                  />
                </div>
                
                <h5 class="mb-8 text-white fw-bold">$5 off your first order</h5>
                
                <div class="flex-align gap-8">
                  <span class="text-sm fw-medium text-white">Delivery by 6:15am</span>
                  <span class="text-xs text-white">Expire Aug 5</span>
                </div>
                
                <NuxtLink 
                  to="/shop" 
                  class="mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8"
                >
                  Shop Now
                  <span class="icon text-xl d-flex">
                    <i class="ph ph-arrow-right"></i>
                  </span> 
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Fallback Card 2 -->
          <div class="col-sm-6" data-aos="zoom-in" data-aos-duration="800">
            <div class="offer-card position-relative rounded-16 overflow-hidden p-16 ps-56-px">
              <img 
                src="/assets/images/bg/offer-bg-img2.png" 
                alt="Offer Background" 
                class="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
              />
              
              <div class="py-xl-4 max-w-392">
                <div class="offer-card__logo mb-16 w-80 h-80 flex-center bg-white rounded-circle">
                  <img 
                    src="/assets/images/thumbs/offer-logo.png" 
                    alt="Offer Logo" 
                    class="w-100 h-100 object-fit-contain p-2"
                  />
                </div>
                
                <h5 class="mb-8 text-heading fw-bold">$5 off your first order</h5>
                
                <div class="flex-align gap-8">
                  <span class="text-sm fw-medium text-heading">Delivery by 6:15am</span>
                  <span class="text-sm text-success-600">Expire Aug 5</span>
                </div>
                
                <NuxtLink 
                  to="/shop" 
                  class="mt-16 btn bg-white hover-text-white hover-bg-main-800 text-heading fw-medium d-inline-flex align-items-center rounded-pill gap-8"
                >
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
import { ref, onMounted, computed } from 'vue'

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
const offerData = ref<OfferData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// API URL
const API_URL = 'https://kartmania-api.vibrantick.org/common/media/read'

// Fetch offer data from API
const fetchOfferData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    // Assert the response shape so TypeScript knows the types
    const result = await response.json() as { data?: OfferData[] }
    if (result.data && Array.isArray(result.data)) {
      offerData.value = result.data.filter((offer: OfferData) => !offer.isDeleted)
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
  return offerData.value.find(item => item.id === 11)
})

// Get ID 12 data
const offerId12 = computed(() => {
  return offerData.value.find(item => item.id === 12)
})

// Fetch data on component mount
onMounted(() => {
  fetchOfferData()
})
</script>

<style scoped>
/* Component Styles */
.offer-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 300px;
  position: relative;
  overflow: hidden;
}

.offer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.offer-card__logo {
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn {
  transition: all 0.3s ease;
  padding: 10px 24px;
  font-weight: 600;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Loading Skeletons */
.skeleton-bg {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-logo {
  background: #e0e0e0;
  animation: loading 1.5s infinite;
}

.skeleton-title {
  height: 28px;
  width: 70%;
  background: #e0e0e0;
  border-radius: 4px;
  animation: loading 1.5s infinite;
}

.skeleton-text-sm {
  height: 16px;
  width: 120px;
  background: #e0e0e0;
  border-radius: 4px;
  animation: loading 1.5s infinite;
}

.skeleton-text-xs {
  height: 14px;
  width: 80px;
  background: #e0e0e0;
  border-radius: 4px;
  animation: loading 1.5s infinite;
}

.skeleton-btn {
  height: 44px;
  width: 120px;
  background: #059669;
  border-radius: 24px;
  animation: loading 1.5s infinite;
}

.skeleton-btn-white {
  height: 44px;
  width: 120px;
  background: #e0e0e0;
  border-radius: 24px;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Text Colors for ID 11 card (white text) */
.text-white {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Text Colors for ID 12 card (dark text) */
.text-heading {
  color: #1e293b !important;
}

.text-success-600 {
  color: #059669 !important;
}

/* Responsive Design */
@media (max-width: 992px) {
  .offer {
    padding-top: 60px !important;
  }
  
  .offer-card {
    min-height: 280px;
  }
}

@media (max-width: 768px) {
  .offer {
    padding-top: 40px !important;
  }
  
  .ps-56-px {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .offer-card {
    min-height: 260px;
    padding: 12px !important;
  }
  
  .offer-card__logo {
    width: 60px !important;
    height: 60px !important;
  }
  
  h5 {
    font-size: 1.25rem !important;
  }
  
  .btn {
    padding: 8px 20px;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .col-sm-6 {
    width: 100%;
  }
  
  .offer-card {
    min-height: 240px;
    margin-bottom: 20px;
  }
}
</style>