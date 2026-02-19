<template>
  <div class="offer-card rounded-12 overflow-hidden transition-all h-100">
    <!-- Card Header with Badge -->
    <div class="offer-card__header position-relative overflow-hidden" :style="getHeaderStyle()">
      <!-- Badge -->
      <div class="offer-badge">
        <span class="badge-text fw-bold">{{ formatDiscountText(props.offer) }}</span>
      </div>

      <!-- Image -->
      <div v-if="primaryImage" class="offer-image">
        <img :src="primaryImage" :alt="offer.name" class="w-100 h-100 object-cover" loading="lazy" />
      </div>
      <div v-else class="offer-image-placeholder">
        <i class="ph ph-gift" style="font-size: 3rem;"></i>
      </div>

      <!-- Overlay -->
      <div class="offer-overlay"></div>
    </div>

    <!-- Card Content -->
    <div class="offer-card__content p-16">
      <!-- Offer Type Badge -->
      <div class="mb-8">
        <span class="offer-type-badge">{{ formatOfferType(offer.offerType) }}</span>
      </div>

      <!-- Offer Name -->
      <h4 class="offer-name mb-8">{{ offer.name }}</h4>

      <!-- Description -->
      <p class="offer-description text-sm text-gray-600 mb-12 text-truncate-2">
        {{ offer.description || 'Special offer available now' }}
      </p>

      <!-- Products Count -->
      <div v-if="offer.products && offer.products.length > 0" class="products-count text-xs text-gray-500 mb-12">
        <i class="ph ph-package me-2"></i>
        {{ offer.products.length }} {{ offer.products.length === 1 ? 'Product' : 'Products' }}
      </div>

      <!-- Valid Until with Countdown -->
      <div v-if="offer.endDate" class="valid-until text-xs text-gray-500 mb-12">
        <i class="ph ph-calendar me-2"></i>
        <span v-if="offerCountdown && !offerCountdown.isExpired">
          {{ offerCountdown.isStarting ? 'Starts in' : 'Ends in' }}: 
          {{ offerCountdown.days }}d {{ offerCountdown.hours }}h {{ offerCountdown.minutes }}m
        </span>
        <span v-else>
          Valid until {{ formatDate(offer.endDate) }}
        </span>
      </div>

      <!-- Action Button -->
      <NuxtLink
        to="/shop/shop-all"
        class="offer-btn btn-block"
        :class="`btn-${theme}`"
      >
        Shop Now
        <i class="ph ph-arrow-right ms-2"></i>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOffersApi } from '@/composables/api/useOffersApi'
import type { Offer } from '~/types/offers'

interface Props {
  offer: Offer
  theme?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'primary'
})

// Helper functions for offer formatting
const formatDiscountText = (offer: Offer) => {
  if (offer.discountType === 'PERCENTAGE') {
    return `${offer.discountValue}% OFF`
  } else if (offer.discountType === 'FIXED') {
    return `₹${offer.discountValue} OFF`
  }
  return 'SPECIAL'
}

const getCountdown = (offerId: number) => {
  // This is a simplified countdown - you might want to implement a more sophisticated version
  const offer = props.offer
  if (!offer.endDate) return null
  
  const now = new Date().getTime()
  const endTime = new Date(offer.endDate).getTime()
  const startTime = offer.startDate ? new Date(offer.startDate).getTime() : now
  
  const isStarting = startTime > now
  const targetTime = isStarting ? startTime : endTime
  const difference = targetTime - now
  
  if (difference <= 0) {
    return { isExpired: true, days: 0, hours: 0, minutes: 0, isStarting: false }
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  
  return { isExpired: false, days, hours, minutes, isStarting }
}

const primaryImage = computed(() => {
  if (props.offer.images && props.offer.images.length > 0) {
    const primary = props.offer.images.find((img) => img.isPrimary)
    return primary?.imageUrl || props.offer.images[0]?.imageUrl
  }
  return null
})

const offerCountdown = computed(() => {
  return getCountdown(props.offer.id)
})

const getHeaderStyle = () => {
  if (primaryImage.value) {
    return {
      backgroundColor: '#e2e8f0'
    }
  }
  return {
    backgroundColor: '#f1f5f9',
    minHeight: '180px'
  }
}

const formatOfferType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'Check offer'
  }
}
</script>

<style scoped>
.offer-card {
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.offer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e1;
}

.offer-card__header {
  position: relative;
  width: 100%;
  height: 180px;
  background: #f1f5f9;
  overflow: hidden;
}

.offer-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.offer-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.offer-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #94a3b8;
}

.offer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}

.offer-card:hover .offer-overlay {
  background: rgba(0, 0, 0, 0.15);
}

.offer-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.badge-text {
  background: white;
  color: #1e293b;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.offer-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.offer-type-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offer-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.offer-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.text-truncate-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.products-count,
.valid-until {
  display: flex;
  align-items: center;
  color: #94a3b8;
}

.offer-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: auto;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-success {
  background: #16a34a;
  color: white;
}

.btn-success:hover {
  background: #15803d;
}

.btn-warning {
  background: #d97706;
  color: white;
}

.btn-warning:hover {
  background: #b45309;
}

.btn-info {
  background: #0891b2;
  color: white;
}

.btn-info:hover {
  background: #0e7490;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-block {
  width: 100%;
}

@media (max-width: 576px) {
  .offer-card__header {
    height: 150px;
  }

  .offer-name {
    font-size: 0.95rem;
  }

  .offer-card__content {
    padding: 12px;
  }
}
</style>
