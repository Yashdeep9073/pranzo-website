<!-- components/FlashSalesBanner.vue -->
<template>
  <section class="flash-sales pt-80 overflow-hidden">
    <div class="container container-lg">
      <div v-if="loading" class="row gy-4 arrow-style-two">
        <!-- Loading skeletons -->
        <div class="col-lg-6" data-aos="fade-up" data-aos-duration="600">
          <div class="flash-sales-item rounded-16 overflow-hidden z-1 position-relative flex-align flex-0 justify-content-between gap-8 ps-56-px">
            <div class="skeleton-image position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"></div>
            <div class="flash-sales-item__content ms-sm-auto">
              <div class="skeleton-title mb-8"></div>
              <div class="skeleton-text mb-12"></div>
              <div class="countdown">
                <ul class="countdown-list flex-align flex-wrap">
                  <li v-for="i in 4" :key="i" class="countdown-list__item py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 skeleton-timer"></li>
                </ul>
              </div>
              <div class="skeleton-btn mt-24"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000">
          <div class="flash-sales-item rounded-16 overflow-hidden z-1 position-relative flex-align flex-0 justify-content-between gap-8 ps-56-px">
            <div class="skeleton-image position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"></div>
            <div class="flash-sales-item__content">
              <div class="skeleton-title mb-8"></div>
              <div class="skeleton-text mb-12"></div>
              <div class="countdown">
                <ul class="countdown-list flex-align flex-wrap">
                  <li v-for="i in 4" :key="i" class="countdown-list__item py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5 bg-custom-countdown skeleton-timer"></li>
                </ul>
              </div>
              <div class="skeleton-btn mt-24"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-80">
        <div class="alert alert-danger">
          {{ error }}
        </div>
        <button @click="fetchFlashSales" class="btn btn-main mt-3">
          Retry
        </button>
      </div>
      
      <div v-else class="row gy-4 arrow-style-two">
        <!-- Dynamic Flash Sale Items from API -->
        <div 
          v-for="(advertisement, index) in displayItems" 
          :key="advertisement.id" 
          class="col-lg-6" 
          :data-aos="index === 0 ? 'fade-up' : 'fade-up'"
          :data-aos-duration="index === 0 ? '600' : '1000'"
        >
          <div class="flash-sales-item rounded-16 overflow-hidden z-1 position-relative flex-align flex-0 justify-content-between gap-8 ps-56-px">
            <img 
              :src="advertisement.image" 
              :alt="advertisement.title"
              class="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1 flash-sales-item__bg"
              loading="lazy"
            >
            <div :class="['flash-sales-item__content', index === 0 ? 'ms-sm-auto' : '']">
              <h6 class="text-32 mb-8">{{ advertisement.title }}</h6>
              <p :class="index === 0 ? 'text-neutral-500 mb-12' : 'text-heading mb-12'">
                {{ getDescription(advertisement) }}
              </p>
              <div class="countdown">
                <ul class="countdown-list flex-align flex-wrap">
                  <li 
                    v-for="timeUnit in timeUnits" 
                    :key="timeUnit"
                    :class="[
                      'countdown-list__item py-8 px-12 flex-align gap-4 text-sm fw-medium box-shadow-4xl rounded-5',
                      index === 1 ? 'bg-custom-countdown text-white' : 'text-heading'
                    ]"
                  >
                    <span :class="timeUnit">{{ formatTime(getCountdownValue(index, timeUnit)) }}</span> 
                    {{ timeUnit.charAt(0).toUpperCase() }}
                  </li>
                </ul>
              </div>
              <NuxtLink 
                to="/shop" 
                :class="[
                  'btn d-inline-flex align-items-center rounded-pill gap-8 mt-24',
                  index === 0 ? 'btn-main' : 'bg-success-600 hover-bg-success-700'
                ]"
              >
                Shop Now
                <span class="icon text-xl d-flex"><i class="ph ph-arrow-right"></i></span> 
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Interfaces
interface AdvertisementData {
  id: number
  title: string
  description: string
  image: string
  category: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface CountdownTimer {
  days: number
  hours: number
  minutes: number
  seconds: number
  interval?: ReturnType<typeof setInterval>
}

// Typed time units constant so template gets a proper literal type
const timeUnits = ['days', 'hours', 'minutes', 'seconds'] as const
type TimeUnit = (typeof timeUnits)[number]

// Reactive state
const flashSales = ref<AdvertisementData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Countdown timers for dynamic items
const countdowns = ref<CountdownTimer[]>([
  { days: 2, hours: 12, minutes: 30, seconds: 45 },
  { days: 1, hours: 6, minutes: 15, seconds: 20 }
])

// API URL
const API_URL = 'https://kartmania-api.vibrantick.org/common/media/read'

// Get items to display (max 2)
const displayItems = computed(() => {
  if (flashSales.value.length >= 2) {
    return flashSales.value.slice(0, 2)
  }
  
  // If less than 2 items, create fallback items
  const fallbackItems: AdvertisementData[] = [...flashSales.value]
  
  // Add fallback items to reach 2
  const fallbackData: Partial<AdvertisementData>[] = [
    {
      id: 999,
      title: 'Vegetables Combo Box',
      description: 'Time remaining until the end of the offer.',
      image: '/assets/images/bg/flash-sale-bg2.png',
      category: 'FALLBACK'
    },
    {
      id: 998,
      title: 'X-Connect Smart Television',
      description: 'Time remaining until the end of the offer.',
      image: '/assets/images/bg/flash-sale-bg1.png',
      category: 'FALLBACK'
    }
  ]
  
  for (let i = flashSales.value.length; i < 2; i++) {
    const fallbackIndex = i - flashSales.value.length
    fallbackItems.push({
      id: fallbackData[fallbackIndex]?.id || 999 + fallbackIndex,
      title: fallbackData[fallbackIndex]?.title || 'Flash Sale',
      description: fallbackData[fallbackIndex]?.description || 'Time remaining until the end of the offer.',
      image: fallbackData[fallbackIndex]?.image || '/assets/images/bg/flash-sale-bg1.png',
      category: 'FALLBACK',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return fallbackItems
})

// Fetch advertisement data
const fetchFlashSales = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.data && Array.isArray(result.data)) {
      // Filter only ADVERTISEMENT category items (IDs 8 and 10)
      flashSales.value = result.data.filter((ad: AdvertisementData) => 
        ad.category === 'ADVERTISEMENT' && !ad.isDeleted
      )
      
      // Sort by ID to maintain order (8, 10)
      flashSales.value.sort((a, b) => a.id - b.id)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch flash sale data'
    console.error('Error fetching flash sales:', err)
  } finally {
    loading.value = false
  }
}

// Get description with fallback
const getDescription = (advertisement: AdvertisementData): string => {
  if (advertisement.description && 
      advertisement.description.trim() !== '' && 
      advertisement.description !== advertisement.title) {
    return advertisement.description.replace('\r\n', ' ')
  }
  return 'Time remaining until the end of the offer.'
}

// Get countdown value
const getCountdownValue = (index: number, timeUnit: TimeUnit): number => {
  if (index < countdowns.value.length && countdowns.value[index]) {
    const value = countdowns.value[index][timeUnit] as number | undefined
    return value ?? 0
  }
  return 0
}

// Format time to always show 2 digits
const formatTime = (time: number): string => {
  return time < 10 ? `0${time}` : time.toString()
}

// Update countdown function (accepts index so reset values can vary per item)
const updateCountdown = (countdown: CountdownTimer, idx: number) => {
  if (countdown.seconds > 0) {
    countdown.seconds--
  } else {
    countdown.seconds = 59
    if (countdown.minutes > 0) {
      countdown.minutes--
    } else {
      countdown.minutes = 59
      if (countdown.hours > 0) {
        countdown.hours--
      } else {
        countdown.hours = 23
        if (countdown.days > 0) {
          countdown.days--
        } else {
          // Countdown finished - reset to default values per index
          countdown.days = idx === 0 ? 2 : 1
          countdown.hours = idx === 0 ? 12 : 6
          countdown.minutes = idx === 0 ? 30 : 15
          countdown.seconds = idx === 0 ? 45 : 20
        }
      }
    }
  }
}

// Start all countdown timers
const startCountdowns = () => {
  // Clear any existing intervals
  countdowns.value.forEach(countdown => {
    if (countdown.interval) {
      clearInterval(countdown.interval)
    }
  })
  
  // Start new intervals for each countdown
  countdowns.value.forEach((countdown, index) => {
    countdown.interval = setInterval(() => {
      updateCountdown(countdown, index)
    }, 1000)
  })
}

// Fetch data on component mount
onMounted(async () => {
  await fetchFlashSales()
  startCountdowns()
})

// Cleanup timers on unmount
onUnmounted(() => {
  countdowns.value.forEach(countdown => {
    if (countdown.interval) {
      clearInterval(countdown.interval)
    }
  })
})
</script>

<style scoped>
/* Custom Countdown Color for 2nd card (27, 181, 212, 0.727) */
.bg-custom-countdown {
  background: rgba(27, 181, 212, 0.727) !important;
  border: none !important;
  color: white !important;
}

/* Original CSS styles preserved */
.flash-sales-item {
  min-height: 300px;
}

.flash-sales-item__bg {
  transition: transform 0.5s ease;
}

.flash-sales-item:hover .flash-sales-item__bg {
  transform: scale(1.05);
}

.text-32 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b; 
  line-height: 1.2;
}

/* Countdown Styles */ 
.countdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 8px;
}

.countdown-list__item {
  background: white;
  border: 1px solid #e2e8f0;
  min-width: 60px;
  text-align: center;
  transition: all 0.3s ease;
}

.countdown-list__item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Custom countdown hover effect */
.bg-custom-countdown:hover {
  background: rgba(20, 160, 190, 0.8) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(27, 181, 212, 0.3);
}

/* Button Styles */
.btn-main {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  padding: 12px 28px;
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

.bg-success-600 {
  background: linear-gradient(135deg, #059669, #047857) !important;
  border: none !important;
  padding: 12px 28px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
}

.bg-success-600:hover {
  background: linear-gradient(135deg, #047857, #065f46) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
  color: white;
}

/* Loading Skeletons */
.skeleton-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-title {
  height: 2rem;
  width: 80%;
  background: #e0e0e0;
  border-radius: 4px;
  animation: loading 1.5s infinite; 
}

.skeleton-text {
  height: 1rem;
  width: 60%;
  background: #e0e0e0;
  border-radius: 4px;
  animation: loading 15s infinite;
}

.skeleton-timer {
  background: #e0e0e0 !important;
  min-width: 60px;
  height: 40px;
  animation: loading 1.5s infinite;
}

.skeleton-btn {
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

/* Text Colors */
.text-neutral-500 {
  color: #64748b;
}

.text-heading {
  color: #1e293b;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .text-32 {
    font-size: 1.75rem;
  }
  
  .flash-sales-item {
    min-height: 280px;
  }
}

@media (max-width: 992px) {
  .flash-sales {
    padding-top: 60px !important;
  }
  
  .flash-sales-item {
    min-height: 250px;
  }
  
  .text-32 {
    font-size: 1.5rem;
  }
  
  .countdown-list__item {
    min-width: 50px;
  }
}

@media (max-width: 768px) {
  .flash-sales {
    padding-top: 40px !important;
  }
  
  .flash-sales-item {
    min-height: 220px;
  }
  
  .text-32 {
    font-size: 1.25rem;
  }
  
  .countdown-list__item {
    min-width: 45px;
    font-size: 0.875rem;
  }
  
  .btn-main,
  .bg-success-600 {
    padding: 10px 20px;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .flash-sales-item {
    min-height: 200px;
  }
  
  .text-32 {
    font-size: 1.125rem;
  }
}
</style>