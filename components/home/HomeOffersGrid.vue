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

const route = useRoute()
const { offers, loading, error, refresh } = useOffersApi({ isActive: true })

const normalize = (value: unknown) => String(value || '').trim().toLowerCase()

const selectedCategory = computed(() => {
  const queryValue = Array.isArray(route.query.category)
    ? route.query.category[0]
    : route.query.category
  return normalize(queryValue)
})

const selectedSubCategory = computed(() => {
  const queryValue = Array.isArray(route.query.subcategory)
    ? route.query.subcategory[0]
    : route.query.subcategory
  return normalize(queryValue)
})

const hasCategoryFilter = computed(() => {
  return Boolean(selectedCategory.value || selectedSubCategory.value)
})

const getOfferProducts = (offer: any) => {
  const source = offer?.products?.length ? offer.products : (offer?.OfferProducts || [])
  return source
    .map((item: any) => item?.product || item?.Product || item)
    .filter(Boolean)
}

const getOfferCategoryNames = (offer: any) => {
  return [
    offer?.category?.name,
    offer?.categoryName,
    offer?.subcategory?.name,
    offer?.subCategory?.name,
    offer?.subCategoryName
  ]
    .map(normalize)
    .filter(Boolean)
}

const getProductCategoryNames = (product: any) => {
  return [
    product?.category?.name,
    product?.subCategory?.name,
    product?.subcategory?.name,
    product?.subSubCategory?.name,
    product?.subsubcategory?.name,
    product?.mainProduct?.category?.name,
    product?.mainProduct?.subCategory?.name,
    product?.mainProduct?.subcategory?.name
  ]
    .map(normalize)
    .filter(Boolean)
}

const offerMatchesFilters = (offer: any) => {
  if (!selectedCategory.value && !selectedSubCategory.value) return true

  const products = getOfferProducts(offer)
  const explicitOfferNames = getOfferCategoryNames(offer)
  const productNames = products.flatMap((product: any) => getProductCategoryNames(product))
  const names = [...explicitOfferNames, ...productNames]
  if (!names.length) return false

  const categoryMatched = !selectedCategory.value || names.includes(selectedCategory.value)
  const subCategoryMatched = !selectedSubCategory.value || names.includes(selectedSubCategory.value)
  return categoryMatched && subCategoryMatched
}

const activeOffers = computed(() => {
  return offers.value
    .filter(offer => offer.isActive !== false)
    // When user chooses a category from Browse Categories, keep only category-specific offers.
    .filter(offer => !hasCategoryFilter.value || offer.offerType === 'CATEGORY')
    .filter(offerMatchesFilters)
})

// Computed properties
const offersByType = computed(() => {
  const grouped: { [key: string]: any[] } = {}
  activeOffers.value.forEach(offer => {
    const type = offer.offerType || 'OTHER'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(offer)
  })
  return grouped
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
