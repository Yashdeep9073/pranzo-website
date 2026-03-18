<script setup lang="ts">
import { useOffersApi } from '~/composables/api/useOffersApi'
import type { Offer } from '~/types/offers'

const { offers: festivalOffers, loading, error, refresh } = useOffersApi({
  offerType: 'FESTIVAL',
  isActive: true
})

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
  const img = e.target as HTMLImageElement
  if (!img.dataset.fallbackSet) {
    img.src = '/assets/images/buysection/t-shirt1.jpg'
    img.dataset.fallbackSet = 'true'
  }
}
</script>

<template>
  <NuxtLink :to="`/shop-all?offer=${festivalOffer?.slug ?? 'all'}`" class="banner-link">
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
          <img v-if="!festivalOffer?.images?.length" src="/assets/images/bg/shirt-removebg-preview.png" alt="Shirt"
            class="main-img" />
        </div>
      </div>

      <!-- Background banner -->
      <div class="banner-bg-wrapper">
        <img :src="primaryImageUrl" class="banner-bg" :alt="festivalOffer?.name || 'Festival Offer Banner'"
          @error="handleImageError" />
        <div class="bg-overlay"></div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.banner-link {
  display: block;
  text-decoration: none;
}

.banner-link:hover .banner-bg {
  transform: scale(1.01);
  transition: transform 0.4s ease;
}

.banner-link:hover .offer-strip {
  transform: translateY(-1px);
  transition: transform 0.25s ease;
}

.banner-wrapper {
  position: relative;
  width: min(100%, 1000px);
  height: 150px;
  margin: 120px auto 25px;
  overflow: hidden;
  border-radius: 30px;
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
  border-radius: inherit;
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
  top: 8px;
  left: 12px;
  max-width: calc(100% - 24px);
  background: linear-gradient(90deg, #CA2D52, #830622);
  padding: 6px 16px;
  border-radius: 11px;
  z-index: 4;
}

.offer-text {
  display: block;
  max-width: 100%;
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
  gap: 12px;
  padding: 38px 24px 10px;
}

.banner-text {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 62%;
  color: #fff;
  z-index: 5;
}

.banner-text p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
  max-width: 100%;
  line-height: 1.4;
}

.images-section {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  min-width: 0;
}

.main-img {
  width: 150px;
  height: auto;
  object-fit: contain;
  z-index: 3;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  margin-right: 0;
}

/* Responsive */
@media (hover: none) {
  .banner-link:hover {
    transform: none;
    box-shadow: none;
  }

  .banner-link:hover .banner-bg {
    transform: none;
  }
}

@media (max-width: 768px) {
  .banner-wrapper {
    height: 150px;
    margin-top: 76px;
    margin-bottom: 16px;
    border-radius: 18px;
  }

  .banner-content {
    gap: 10px;
    padding: 34px 14px 10px;
  }

  .banner-text {
    max-width: 65%;
  }

  .banner-text p {
    font-size: 11px;
    line-height: 1.35;
  }

  .main-img {
    width: 92px;
  }

  .offer-strip {
    top: 6px;
    left: 10px;
    max-width: calc(100% - 20px);
    padding: 4px 10px;
  }

  .offer-text {
    font-size: 10.5px;
  }
}

@media (max-width: 480px) {
  .banner-wrapper {
    height: 130px;
    margin-top: 72px;
    margin-bottom: 12px;
    border-radius: 14px;
  }

  .banner-content {
    gap: 8px;
    padding: 32px 10px 8px;
  }

  .banner-text {
    max-width: 100%;
  }

  .banner-text p {
    font-size: 10px;
    line-height: 1.3;
  }

  .images-section {
    display: none;
  }

  .offer-strip {
    top: 6px;
    left: 8px;
    right: 8px;
    max-width: none;
    border-radius: 8px;
    padding: 4px 8px;
  }

  .offer-text {
    font-size: 10px;
    text-align: center;
  }
}

@media (max-width: 360px) {
  .banner-wrapper {
    height: 100px;
    margin-top: 80px;
    margin-bottom: 8px;
  }

  .banner-content {
    padding: 30px 8px 8px;
  }

  .banner-text p {
    font-size: 9.5px;
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
