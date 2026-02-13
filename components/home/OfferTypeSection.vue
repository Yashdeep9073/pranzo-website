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
        <NuxtLink to="/shop/shop-all" class="btn btn-outline btn-sm">
          View All
          <i class="ph ph-arrow-right ms-2"></i>
        </NuxtLink>
      </div>
    </div>

    <!-- Offers Grid -->
    <div class="row g-16">
      <div
        v-for="(offer, index) in offers.slice(0, showAll ? offers.length : 4)"
        :key="offer.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <OfferCard :offer="offer" :theme="theme" />
      </div>
    </div>

    <!-- Show More Button -->
    <div v-if="offers.length > 4" class="text-center mt-40">
      <button
        @click="toggleShowAll"
        class="btn btn-outline"
      >
        {{ showAll ? 'Show Less' : `View All ${offers.length} Offers` }}
        <i :class="`ph ph-${showAll ? 'caret-up' : 'caret-down'} ms-2`"></i>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Offer } from '~/types/offers'
import OfferCard from './OfferCard.vue'

interface Props {
  type: string
  title: string
  icon: string
  theme?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'secondary'
  offers?: Offer[]
}

withDefaults(defineProps<Props>(), {
  theme: 'primary',
  offers: () => []
})

const showAll = ref(false)

const toggleShowAll = () => {
  showAll.value = !showAll.value
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
  color: #4f46e5;
}

.theme-danger {
  background: #fee2e2;
  color: #dc2626;
}

.theme-success {
  background: #dcfce7;
  color: #16a34a;
}

.theme-warning {
  background: #fef3c7;
  color: #d97706;
}

.theme-info {
  background: #cffafe;
  color: #0891b2;
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
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
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
</style>
