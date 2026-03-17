<template>
  <section class="offer-type-section mb-80">
    <!-- Section Header -->
    <div class="section-heading mb-40">
      <div class="flex-between flex-wrap gap-16">
        <div class="flex-align gap-12">
          <div :class="['offer-icon', `theme-${theme}`]">
            <i :class="`ph ph-${icon}`"></i>
          </div>
          <h3 class="mb-0">{{ title }}</h3>
        </div>
        <NuxtLink to="/shop-all" class="btn btn-main btn-sm">
          View All
          <i class="ph ph-arrow-right ms-2"></i>
        </NuxtLink>
      </div>
    </div>

    <!-- Offers Grid -->
    <div class="row g-16 d-none d-md-flex">
      <div v-for="(offer, index) in validOffers.slice(0, showAll ? validOffers.length : 4)" :key="offer.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3">
        <OfferCard :offer="offer" :theme="theme" />
      </div>
    </div>

    <!-- Mobile 2x2 Grid for this section -->
    <div class="mobile-section-grid d-md-none">
      <div class="section-grid-mobile grid-4">
        <div v-for="(offer, index) in validOffers.slice(0, 4)" :key="offer.id" class="section-card-mobile">
          <div class="section-card-image">
            <img v-if="getOfferImage(offer)" :src="getOfferImage(offer)" :alt="offer.name" class="section-full-image" />
            <div v-else class="section-full-placeholder">
              <i class="ph ph-gift"></i>
            </div>
            <div class="section-offer-name">
              {{ offer.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More Button -->
    <div v-if="validOffers.length > 4" class="text-center mt-40">
      <button @click="toggleShowAll" class="btn btn-main">
        {{ showAll ? 'Show Less' : `View All ${validOffers.length} Offers` }}
        <i :class="`ph ph-${showAll ? 'caret-up' : 'caret-down'} ms-2`"></i>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Offer } from '~/types/offers'
import OfferCard from './OfferCard.vue'

interface Props {
  type: string
  title: string
  icon: string
  theme?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'secondary'
  offers?: Offer[]
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'primary',
  offers: () => []
})

const validOffers = computed(() => {
  return (Array.isArray(props.offers) ? props.offers : []).filter((o: any) => o && o.id && o.name)
})

const showAll = ref(false)

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

// Helper functions for mobile grid
const getGridClass = (count: number) => {
  if (count <= 1) return 'grid-1'
  if (count === 2) return 'grid-2'
  if (count === 3) return 'grid-3'
  if (count === 4) return 'grid-4'
  if (count === 5) return 'grid-5'
  if (count === 6) return 'grid-6'
  if (count === 7) return 'grid-7'
  if (count === 8) return 'grid-8'
  if (count === 9) return 'grid-9'
  return 'grid-many' // for 10 or more
}

const getOfferImage = (offer: any) => {
  if (offer.images && offer.images.length > 0) {
    const primary = offer.images.find((img: any) => img.isPrimary)
    return primary?.imageUrl || offer.images[0]?.imageUrl
  }
  return null
}

const formatDiscountText = (offer: any) => {
  if (offer.discountType === 'PERCENTAGE') {
    return `${offer.discountValue}% OFF`
  } else if (offer.discountType === 'FIXED') {
    return `₹${offer.discountValue} OFF`
  }
  return 'SPECIAL'
}

// Use offers prop directly; no internal fetching
</script>

<style scoped>
.offer-type-section {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-heading h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.offer-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.theme-primary {
  background: #eef2ff;
  color: #CA2D52;
}

.theme-danger {
  background: var(--main-50);
  color: var(--main-600);
}

.theme-success {
  background: var(--main-50);
  color: var(--main-600);
}

.theme-warning {
  background: #fef3c7;
  color: #d97706;
}

.theme-info {
  background: var(--main-50);
  color: var(--main-600);
}

.theme-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-outline {
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-outline:hover {
  background: var(--main-50);
  border-color: var(--main-200);
  color: var(--main-600);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .offer-type-section {
    padding: 20px 16px;
  }

  .section-heading h3 {
    font-size: 1.25rem;
  }

  .offer-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

/* Mobile Section Grid Styles */
.mobile-section-grid {
  margin-top: 32px;
  padding: 0 8px;
}

.section-grid-mobile {
  display: grid;
  gap: 20px;
  margin-top: 24px;
}

/* Grid layouts based on card count */
.section-grid-mobile.grid-1 {
  grid-template-columns: 1fr;
  max-width: 300px;
  margin: 20px auto 0;
}

.section-grid-mobile.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.section-grid-mobile.grid-3 {
  grid-template-columns: repeat(2, 1fr);
}

.section-grid-mobile.grid-3 .section-card-mobile:last-child {
  grid-column: 1 / -1;
  max-width: 300px;
  margin: 0 auto;
}

.section-grid-mobile.grid-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.section-grid-mobile.grid-5 {
  grid-template-columns: repeat(2, 1fr);
}

.section-grid-mobile.grid-5 .section-card-mobile:last-child {
  grid-column: 1 / -1;
  max-width: 300px;
  margin: 0 auto;
}

.section-grid-mobile.grid-6 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.section-grid-mobile.grid-7 {
  grid-template-columns: repeat(3, 1fr);
}

.section-grid-mobile.grid-8 {
  grid-template-columns: repeat(3, 1fr);
}

.section-grid-mobile.grid-9 {
  grid-template-columns: repeat(3, 1fr);
}

.section-grid-mobile.grid-many {
  grid-template-columns: repeat(3, 1fr);
}

.section-card-mobile {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.section-card-mobile:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  border-color: #CA2D52;
}

.section-card-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.section-full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.0);
}

.section-card-mobile:hover .section-full-image {
  transform: scale(1.12);
  filter: brightness(0.9);
}

.section-full-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #94a3b8;
  font-size: 2rem;
}

.section-offer-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.4), transparent);
  z-index: 3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card-mobile:hover .section-offer-name {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6), transparent);
  padding-bottom: 24px;
}


@media (max-width: 480px) {
  .mobile-section-grid {
    padding: 0 4px;
    margin-top: 24px;
  }

  .section-grid-mobile {
    gap: 16px;
    margin-top: 20px;
  }

  .section-card-image {
    height: 180px;
  }

  .section-discount-overlay {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .section-offer-name {
    font-size: 14px;
    padding: 16px 12px;
  }

  .section-card-mobile:hover .section-offer-name {
    padding-bottom: 20px;
  }
}

@media (max-width: 375px) {
  .mobile-section-grid {
    padding: 0 2px;
  }

  .section-grid-mobile {
    gap: 14px;
  }

  .section-card-image {
    height: 160px;
  }

  .section-discount-overlay {
    font-size: 15px;
  }

  .section-offer-name {
    font-size: 13px;
    padding: 14px 10px;
  }
}
</style>
