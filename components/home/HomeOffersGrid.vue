<template>
  <div v-if="!loading && activeOffers.length > 0" class="offers-by-type py-40">
    <div class="container container-lg">
      <!-- Flash Sale Section -->
      <OfferTypeSection v-if="offersByType['FLASH_SALE'] && offersByType['FLASH_SALE'].length > 0" type="FLASH_SALE"
        title="Flash Sale" icon="lightning" :offers="offersByType['FLASH_SALE']" theme="danger" />

      <!-- Daily Deals Section -->
      <OfferTypeSection v-if="offersByType['DAILY_DEALS'] && offersByType['DAILY_DEALS'].length > 0" type="DAILY_DEALS"
        title="Daily Deals" icon="calendar" :offers="offersByType['DAILY_DEALS']" theme="primary" />

      <!-- Category Section -->
      <OfferTypeSection v-if="offersByType['CATEGORY'] && offersByType['CATEGORY'].length > 0" type="CATEGORY"
        title="Category Specials" icon="tag" :offers="offersByType['CATEGORY']" theme="success" />

      <!-- Festival Section -->
      <OfferTypeSection v-if="offersByType['FESTIVAL'] && offersByType['FESTIVAL'].length > 0" type="FESTIVAL"
        title="Festival Offers" icon="confetti" :offers="offersByType['FESTIVAL']" theme="warning" />

      <!-- Other Offers Section -->
      <OfferTypeSection v-for="(offerList, type) in otherOffers" :key="type" :type="type" :title="formatOfferType(type)"
        icon="gift" :offers="offerList" theme="secondary" />
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="py-30">
    <div class="container container-lg">
      <div class="text-center">
        <p>Loading offers...</p>
      </div>
    </div>
  </div>

  <!-- No Offers State -->
  <div v-else class="py-30">
    <div class="container container-lg">
      <div class="text-center">
        <p>No offers available at the moment.</p>
        <p>Total offers: {{ offers.length }}</p>
        <p>Active offers: {{ activeOffers.length }}</p>
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
  const active = offers.value.filter(offer => offer.isActive !== false)
  active.forEach(offer => {
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
  const predefinedTypes = ['FLASH_SALE', 'DAILY_DEALS', 'CATEGORY', 'FESTIVAL']
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
