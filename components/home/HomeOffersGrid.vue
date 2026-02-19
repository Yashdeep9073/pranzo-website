<template>
  <div v-if="!loading && activeOffers.length > 0" class="offers-by-type py-80">
    <div class="container container-lg">
      <!-- Flash Sale Section -->
      <OfferTypeSection v-if="offersByType['FLASH_SALE'] && offersByType['FLASH_SALE'].length > 0" type="FLASH_SALE"
        title="Flash Sale" icon="lightning" :offers="offersByType['FLASH_SALE']" theme="danger" />

      <!-- Deals Revealed Section -->
      <OfferTypeSection v-if="offersByType['DEALS_REVEALED'] && offersByType['DEALS_REVEALED'].length > 0"
        type="DEALS_REVEALED" title="Deals Revealed" icon="gift" :offers="offersByType['DEALS_REVEALED']"
        theme="primary" />

      <!-- Festival Section -->
      <OfferTypeSection v-if="offersByType['FESTIVAL'] && offersByType['FESTIVAL'].length > 0" type="FESTIVAL"
        title="Festival Offers" icon="confetti" :offers="offersByType['FESTIVAL']" theme="success" />

      <!-- Clearance Section -->
      <OfferTypeSection v-if="offersByType['CLEARANCE'] && offersByType['CLEARANCE'].length > 0" type="CLEARANCE"
        title="Clearance Sale" icon="tag" :offers="offersByType['CLEARANCE']" theme="warning" />

      <!-- Limited Offers Section -->
      <OfferTypeSection v-if="offersByType['LIMITED'] && offersByType['LIMITED'].length > 0" type="LIMITED"
        title="Limited Offers" icon="hourglass" :offers="offersByType['LIMITED']" theme="info" />

      <!-- Product Category Section -->
      <OfferTypeSection v-if="offersByType['PRODUCT_CATEGORY'] && offersByType['PRODUCT_CATEGORY'].length > 0"
        type="PRODUCT_CATEGORY" title="Category Specials" icon="tag" :offers="offersByType['PRODUCT_CATEGORY']"
        theme="primary" />

      <!-- Other Offers Section -->
      <OfferTypeSection v-for="(offerList, type) in otherOffers" :key="type" :type="type" :title="formatOfferType(type)"
        icon="gift" :offers="offerList" theme="secondary" />
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="py-80">
    <div class="container container-lg">
      <div class="row g-12">
        <div v-for="n in 3" :key="n" class="col-md-4">
          <div class="skeleton-loader p-20 rounded-16">
            <div class="skeleton-text"></div>
            <div class="skeleton-text mt-12"></div>
            <div class="skeleton-text mt-12"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { useOffersApi } from '@/composables/api/useOffersApi'
import OfferTypeSection from './OfferTypeSection.vue'

const { offers, loading, error, refresh } = useOffersApi({ isActive: true })

// Computed properties
const offersByType = computed(() => {
  const grouped: { [key: string]: any[] } = {}
  offers.value.forEach(offer => {
    const type = offer.offerType || 'OTHER'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(offer)
  })
  return grouped
})

const activeOffers = computed(() => {
  return offers.value.filter(offer => offer.isActive !== false)
})

// Get offers that are not in predefined types
const otherOffers = computed(() => {
  const predefinedTypes = ['FLASH_SALE', 'DEALS_REVEALED', 'LIMITED', 'CATEGORY', 'CLEARANCE', 'FESTIVAL', 'SEASONAL', 'BANNER', 'PRODUCT', 'PRODUCT_CATEGORY']
  const result: { [key: string]: any[] } = {}
  
  Object.entries(offersByType.value).forEach(([type, offerList]) => {
    if (!predefinedTypes.includes(type)) {
      result[type] = offerList
    }
  })
  
  return result
})

// Format offer type to readable text
const formatOfferType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

<style scoped>
.offers-by-type {
  background: #f8fafc;
}

.skeleton-loader {
  background: #e2e8f0;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-text {
  height: 12px;
  background: #cbd5e1;
  border-radius: 4px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
