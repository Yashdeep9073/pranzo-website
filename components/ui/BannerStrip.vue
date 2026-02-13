
<!-- <script setup>
import { useOffers } from '~/composables/useOffers'
import { useOffersApi } from '~/composables/api/useOffersApi'

const config = useRuntimeConfig()

// Use the offers composable for better state management
const { offers, loading, error, fetchAllOffers } = useOffers()
const { fetchOffers } = useOffersApi()

// Computed property for limited time offer
const limitedTimeOffer = computed(() => {
  if (!offers.value || offers.value.length === 0) return null
  
  // Find offers that are active, have images, and are either featured or have a specific type
  const activeOffers = offers.value.filter(offer => 
    offer.isActive && 
    offer.images?.length > 0 &&
    (offer.isFeatured || offer.offerType === 'LIMITED_TIME' || offer.offerType === 'FLASH_SALE')
  )
  
  if (activeOffers.length === 0) {
    // Fallback to any active offer with images
    return offers.value.find(offer => offer.isActive && offer.images?.length > 0) || null
  }
  
  // Sort by priority (highest first) and return the top one
  return activeOffers.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0]
})

// Fetch offers on component mount
onMounted(async () => {
  if (offers.value.length === 0) {
    await fetchAllOffers()
  }
})

const primaryImageUrl = computed(() => {
  if (!limitedTimeOffer.value?.images?.length) {
    return '/assets/images/buysection/t-shirt1.jpg'
  }

  const primary = limitedTimeOffer.value.images.find(img => img.isPrimary)
  return primary?.imageUrl || limitedTimeOffer.value.images[0]?.imageUrl
})

const handleImageError = (e) => {
  e.target.src = '/assets/images/buysection/t-shirt1.jpg'
}

// Format discount text for display
const discountText = computed(() => {
  if (!limitedTimeOffer.value) return '40% OFF'
  
  const { discountType, discountValue } = limitedTimeOffer.value
  if (discountType === 'PERCENTAGE') {
    return `${discountValue}% OFF`
  } else if (discountType === 'FIXED') {
    return `₹${discountValue} OFF`
  }
  return 'SPECIAL OFFER'
})

// Format offer name for display
const offerDisplayName = computed(() => {
  if (!limitedTimeOffer.value) return 'Limited Time Deal'
  
  const offerTypes = {
    'LIMITED_TIME': 'Limited Time',
    'FLASH_SALE': 'Flash Sale',
    'BANK': 'Bank Offer',
    'PRODUCT': 'Special Deal'
  }
  
  return offerTypes[limitedTimeOffer.value.offerType] || limitedTimeOffer.value.name || 'Special Deal'
})
</script> -->


<script setup lang="ts">
import { useOffersApi } from '~/composables/api/useOffersApi'
import type { Offer } from '~/types/offers'

const { fetchOffers } = useOffersApi()

const loading = ref(false)
const error = ref<string | null>(null)
const festivalOffers = ref<Offer[]>([])


 // Fetch ONLY FESTIVAL offers

const fetchFestivalOffers = async () => {
  loading.value = true
  error.value = null

  try {
    festivalOffers.value = await fetchOffers({
      offerType: 'FESTIVAL',
      isActive: true
    })
  } catch (err: any) {
    error.value = err.message ?? 'Failed to load festival offers'
  } finally {
    loading.value = false
  }
}

// Pick best festival offer
 
const festivalOffer = computed<Offer | null>(() => {
  if (!festivalOffers.value.length) return null

  return [...festivalOffers.value]
    .filter(o => o.images?.length > 0)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0] ?? null
})

/**
 * Primary image
 */
const primaryImageUrl = computed(() => {
  const offer = festivalOffer.value
  if (!offer?.images?.length) {
    return '/assets/images/buysection/t-shirt1.jpg'
  }

  return (
    offer.images.find(img => img.isPrimary)?.imageUrl ||
    offer.images[0]?.imageUrl
  )
})

/**
 * Discount label
 */
const discountText = computed(() => {
  const offer = festivalOffer.value
  if (!offer) return 'SPECIAL OFFER'

  return offer.discountType === 'PERCENTAGE'
    ? `${offer.discountValue}% OFF`
    : `₹${offer.discountValue} OFF`
})

/**
 * Display title
 */
const offerDisplayName = computed(() => {
  return festivalOffer.value?.name || 'Festival Offer'
})

// Image fallback

const handleImageError = (e: Event) => {
  ;(e.target as HTMLImageElement).src =
    '/assets/images/buysection/t-shirt1.jpg'
}

onMounted(fetchFestivalOffers)
</script>


<template>
  <div class="banner-wrapper" :class="{ loading }">
    <!-- Offer strip -->
    <div class="offer-strip">
      <span class="offer-text">
        <template v-if="festivalOffer">
          {{ discountText }} | {{ offerDisplayName }}
        </template>
        <template v-else>
          FLAT 40% OFF | Flash Sale
        </template>
      </span>
    </div>

    <!-- Banner content -->
    <div class="banner-content">
      <div class="banner-text">
        <p v-if="festivalOffer?.description">
          {{ festivalOffer.description }}
        </p>
        <p v-else>
          Top styles curated for you
        </p>
      </div>

      <div class="images-section">
        <img
          v-if="!festivalOffer?.images?.length"
          src="/assets/images/bg/shirt-removebg-preview.png"
          alt="Shirt"
          class="main-img"
        />

        <NuxtLink
          :to="`/shop/shop-all?offer=${festivalOffer?.slug ?? 'all'}`"
          class="shop-link"
        >
          <button class="shop-btn">
            Shop Now →
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Background banner -->
    <div class="banner-bg-wrapper">
      <img
        :src="primaryImageUrl"
        class="banner-bg"
        :alt="festivalOffer?.name || 'Festival Offer Banner'"
        @error="handleImageError"
      />
      <div class="bg-overlay"></div>
    </div>
  </div>
</template>





<style scoped>
.banner-wrapper {
  position: relative;
  margin-bottom: 15px; 
  width: 100%; 
  height: 150px;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 78px; 
  z-index: 10;
}

.banner-wrapper.loading {
  opacity: 0.7;
}

.banner-bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 30px;
  overflow: hidden;
}

.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.banner-bg.loaded {
  opacity: 1;
}

.offer-strip {
  position: absolute;
  left: 1px;
  top: 0;
  background: linear-gradient(90deg, #006124, #02c0b3);
  padding: 6px 16px;
  border-radius: 11px;
  z-index: 4;
}

.offer-text {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.banner-text {
  flex: 1;
  color: #fff;
  z-index: 5;
}

.banner-text p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
  max-width: 150px;
  line-height: 1.4;
}

.images-section {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.main-img {
  width: 160px;
  height: auto;
  object-fit: contain;
  z-index: 3;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  margin-right: 20px;
}

.shop-link {
  position: absolute;
  bottom: 15px;
  right: 0;
  z-index: 6;
}

.shop-btn {
  background: #fff;
  color: #046ab7;
  border: none;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px; 
  cursor: pointer; 
  transition: all 0.25s ease; 
  display: flex; 
  align-items: center;
  justify-content: center;
}

.shop-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* ==================== resposnive ==================== */

@media (max-width: 768px) {
  .banner-wrapper {
    height: 110px;
    margin-top: 60px;
    margin-bottom: 20px;
  }

  .banner-bg-wrapper {
    border-radius: 0;
  }

  .banner-content {
    padding: 0 16px;
  }

  .banner-text p {
    font-size: 11px;
    max-width: 120px;
  }

  .main-img {
    width: 100px;
    margin-right: 15px;
  }

  .shop-btn {
    padding: 6px 14px;
    font-size: 11px;
  }

  .shop-link {
    bottom: 10px;
  }

  .offer-strip {
    left: 16px;
    padding: 5px 12px;
  }
  
  .offer-text {
    font-size: 11px;
  } 
}

@media (max-width: 1640px) {
  .banner-wrapper {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .banner-wrapper {
    height: 100px;
    margin-top: 60px;
    margin-bottom: 15px;
  }

  .banner-content {
    padding: 0 12px;
  }

  .banner-text p {
    font-size: 10px;
    max-width: 100px;
  }

  .main-img {
    width: 80px;
    margin-right: 10px;
  }

  .shop-btn {
    padding: 5px 12px;
    font-size: 10px;
  }

  .shop-link {
    bottom: 8px;
  }

  .offer-strip {
    left: 0;
    right: 0;
    top: 0;
    border-radius: 0;
    display: flex;
    justify-content: center;
    padding: 4px 0;
  }

  .offer-text {
    font-size: 10px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 460px) {
  .banner-wrapper {
    height: 90px;
    margin-bottom: 0;
  }

  .banner-text p {
    font-size: 9px;
    max-width: 90px;
  }

  .main-img {
    width: 70px;
    margin-right: 8px;
  }

  .shop-btn {
    padding: 4px 10px;
    font-size: 9px;
  }

  .shop-link {
    bottom: 3px;
  }
}

:global(header) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
}
</style>
