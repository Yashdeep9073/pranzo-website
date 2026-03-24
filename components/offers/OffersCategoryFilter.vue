<template>
  <div class="offers-page">

    <!-- 🔥 Sticky Category Bar -->
    <div class="category-bar">
      <div class="container-fluid d-flex gap-2 flex-wrap align-items-center">

        <button v-if="selectedCategory" @click="clearCategoryFilter"
          class="btn btn-sm btn-light rounded-pill">
          ✕ Clear
        </button>

        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          :class="[
            'btn btn-sm rounded-pill px-3',
            selectedCategory?.id === category.id
              ? 'btn-main text-white'
              : 'btn-outline-secondary'
          ]"
        >
          {{ category.name }}
          <span v-if="category.offerCount" class="badge bg-light text-dark ms-1">
            {{ category.offerCount }}
          </span>
        </button>

      </div>
    </div>

    <!-- 🔥 Content -->
    <div class="container-fluid mt-4">

      <!-- Loading -->
      <div v-if="loading" class="row g-4">
        <div v-for="n in 8" :key="n" class="col-6 col-md-4 col-lg-3">
          <div class="offer-card-skeleton"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-5">
        <div class="alert alert-danger d-inline-block">
          {{ error }}
        </div>
        <div>
          <button @click="$emit('retry')" class="btn btn-main mt-3">
            Retry
          </button>
        </div>
      </div>

      <!-- Offers -->
      <div v-else-if="visibleOffers.length > 0" class="row g-4">

        <div
          v-for="offer in visibleOffers"
          :key="offer.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="offer-card h-100">

            <div class="offer-image-container">
              <img
                :src="getOfferImage(offer)"
                :alt="offer.name"
                class="offer-image"
                @error="handleImageError"
              />

              <div class="offer-discount-badge">
                {{ formatDiscount(offer) }}
              </div>

              <div class="offer-overlay">
                <div class="offer-category" v-if="offer.products?.[0]?.category">
                  {{ offer.products[0].category }}
                </div>

                <h5 class="offer-title">
                  {{ offer.name }}
                </h5>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Empty -->
      <div v-else class="text-center py-5">
        <h4>No offers found</h4>
      </div>

      <!-- 🔥 Load More -->
      <div class="text-center mt-4" v-if="visibleCount < offers.length">
        <button @click="loadMore" class="btn btn-main px-4">
          Load More
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Offer } from '~/types/offers'

interface Category {
  id: number
  name: string
  slug: string
  offerCount?: number
}

const props = defineProps<{
  categories: Category[]
  offers: Offer[]
  loading: boolean
  error: string | null
  selectedCategory?: Category | null
}>()

const emit = defineEmits(['category-selected', 'retry'])

const selectedCategory = ref<Category | null>(null)
const visibleCount = ref(8)

watch(
  () => props.selectedCategory,
  (val) => {
    selectedCategory.value = val || null
  },
  { immediate: true }
)

const visibleOffers = computed(() => {
  return props.offers.slice(0, visibleCount.value)
})

const loadMore = () => {
  visibleCount.value += 8
}

const selectCategory = (category: Category) => {
  selectedCategory.value = category
  visibleCount.value = 8
  emit('category-selected', category)
}

const clearCategoryFilter = () => {
  selectedCategory.value = null
  visibleCount.value = 8
  emit('category-selected', null)
}

const getOfferImage = (offer: Offer) => {
  if (offer.images?.length) {
    const url = offer.images[0].imageUrl
    return url?.startsWith('http') ? url : `/uploads/${url}`
  }
  return '/images/offers/default-offer.svg'
}

const formatDiscount = (offer: Offer) => {
  if (offer.discountType === 'PERCENTAGE') {
    return `${offer.discountValue}% OFF`
  }
  if (offer.discountType === 'FIXED') {
    return `₹${offer.discountValue} OFF`
  }
  return 'SPECIAL'
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/offers/default-offer.svg'
}
</script>

<style scoped>
.offers-page {
  background: #f1f3f6;
  min-height: 100vh;
}

/* 🔥 Sticky Category Bar */
.category-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

/* 🔥 Card */
.offer-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.offer-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.15);
}

/* 🔥 Image */
.offer-image-container {
  height: 260px;
  position: relative;
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 🔥 Discount */
.offer-discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ef4444;
  color: white;
  padding: 5px 10px;
  font-size: 11px;
  border-radius: 6px;
}

/* 🔥 Overlay */
.offer-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.offer-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.offer-category {
  font-size: 10px;
  color: #ddd;
}

/* 🔥 Skeleton */
.offer-card-skeleton {
  height: 260px;
  background: #e5e7eb;
  border-radius: 10px;
}

/* 🔥 Responsive */
@media (min-width: 1200px) {
  .offer-image-container {
    height: 280px;
  }
}
</style>