<template>
  <div class="offer-card">
    <NuxtLink :to="offer.link || '/shop-all'" class="offer-link">
      <!-- Full Background Image -->
      <div class="offer-image-container">
        <img :src="offer.image" :alt="offer.title" @error="handleImageError" loading="lazy" />

        <!-- Overlay Content -->
        <div class="offer-overlay">
          <!-- Discount Badge -->
          <div class="discount-badge">
            {{ offer.discount }}
          </div>

          <!-- Offer Title -->
          <div class="offer-content">
            <!-- Brand Logo -->
            <div v-if="offer.brandLogo" class="brand-logo">
              <img :src="offer.brandLogo" :alt="offer.brand" @error="handleBrandLogoError" loading="lazy" />
            </div>

            <!-- Brand Name (fallback if no logo) -->
            <div v-else-if="offer.brand" class="brand-name">
              {{ offer.brand }}
            </div>

            <!-- Offer Title -->
            <h3 class="offer-title">{{ offer.title }}</h3>

            <!-- Offer Description -->
            <p class="offer-description">{{ offer.description }}</p>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Offer {
  id: number
  title: string
  description: string
  discount: string
  brand?: string
  brandLogo?: string
  image: string
  category: string
  subcategory?: string
  isActive: boolean
  startDate: string
  endDate: string
  link?: string
}

interface Props {
  offer: Offer
}

const props = defineProps<Props>()

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/offers/default-offer.svg'
}

const handleBrandLogoError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.offer-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4/3;
}

.offer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.offer-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.offer-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.offer-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.offer-card:hover .offer-image-container img {
  transform: scale(1.05);
}

.offer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #CA2D52, #830622);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.offer-content {
  margin-top: auto;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.brand-logo {
  width: 60px;
  height: 24px;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.brand-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.8rem;
}

.offer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.offer-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin-bottom: 0;
}


/* Responsive */
@media (max-width: 768px) {
  .offer-overlay {
    padding: 0.8rem;
  }

  .offer-title {
    font-size: 1rem;
  }

  .offer-description {
    font-size: 0.85rem;
  }

  .discount-badge {
    top: 8px;
    right: 8px;
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .offer-overlay {
    padding: 0.6rem;
  }

  .brand-logo {
    width: 50px;
    height: 20px;
  }

  .offer-title {
    font-size: 0.95rem;
  }

  .offer-description {
    font-size: 0.8rem;
  }
}
</style>
