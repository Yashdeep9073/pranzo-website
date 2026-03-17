<template>
  <div class="flash-sales">
    <div class="container container-lg">
      <!-- Section Heading -->
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8">
          <h5 class="mb-0">Flash Sales Today</h5>

          <div v-if="!loading && activeOffer" class="flex-align gap-16">
            <div class="offer-badge">
              {{ formatDiscountText(activeOffer) }}
            </div>
            <div class="offer-timer">
              <span v-if="getCountdown(activeOffer.id)">
                <span>Ends in:</span>
                {{ getCountdown(activeOffer.id)?.days }}d {{ getCountdown(activeOffer.id)?.hours }}h {{
                  getCountdown(activeOffer.id)?.minutes }}m
              </span>
              <span v-else>
                {{ formatDate(activeOffer.endDate) }}
              </span>
            </div>
          </div>

          <div v-else class="offer-placeholder">
            Special Offers
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading flash sales...</p>
      </div>

      <!-- Content -->
      <div v-else class="flash-sales-content">
        <!-- Mobile Grid View -->
        <div class="mobile-grid-view" v-if="isMobile">
          <div v-for="product in displayProducts.slice(0, 12)" :key="product.id" class="mobile-product-card">
            <NuxtLink :to="generateProductUrl(product)" class="mobile-product-image-container">
              <img :src="getProductImage(product)" :alt="product.name" class="mobile-product-image"
                @error="handleImageError($event)" loading="lazy" width="200" height="200" />
              <div class="mobile-price-overlay">
                Under ₹{{ calculateDiscountedPrice(product.price, product.discount || 50) }}
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop Swiper View -->
        <div class="desktop-swiper-view" v-else>
          <div class="swiper-container-wrapper">
            <div ref="swiperContainer" class="product-swiper">
              <div class="swiper-wrapper">
                <div v-for="(product, index) in displayProducts" :key="product.id" class="swiper-slide">
                  <div class="product-card">
                    <NuxtLink :to="generateProductUrl(product)" class="product-image-container">
                      <img :src="getProductImage(product)" :alt="product.name" class="product-image"
                        @error="handleImageError($event)" loading="lazy" width="280" height="210" />
                    </NuxtLink>

                    <div class="product-content">
                      <h6 class="product-title">
                        <NuxtLink :to="generateProductUrl(product)" class="product-link">
                          {{ product.name }}
                        </NuxtLink>
                      </h6>

                      <div class="price-review-row">
                        <div class="price-section">
                          <span class="current-price">
                            ₹{{ calculateDiscountedPrice(product.price, product.discount || 50) }}
                            <span class="per-unit">/Qty</span>
                          </span>
                          <span class="original-price" v-if="activeOffer?.discountValue">
                            ₹{{ product.price }}
                          </span>
                        </div>

                        <div class="review-section">
                          <span class="rating">4.8</span>
                          <i class="ph-fill ph-star rating-star"></i>
                          <span class="review-count">(17k)</span>
                        </div>
                      </div>

                      <!-- Progress Bar -->
                      <div class="progress-section">
                        <div class="progress-info">
                          <span>Sold: {{ getRandomSoldPercentage() }}%</span>
                          <span>Available: {{ getRandomAvailable() }}</span>
                        </div>
                        <div class="progress-bar">
                          <div class="progress-fill" :style="{ width: getRandomSoldPercentage() + '%' }"></div>
                        </div>
                      </div>

                      <button class="add-cart-btn" @click="addToCart(product)">
                        Add<i class="ph ph-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="navigation-buttons" v-if="displayProducts.length > 0">
              <button type="button" class="nav-btn prev-btn" @click="slidePrev">
                <i class="ph ph-caret-left"></i>
              </button>
              <button type="button" class="nav-btn next-btn" @click="slideNext">
                <i class="ph ph-caret-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- No Products -->
        <div v-if="!loading && displayProducts.length === 0" class="empty-state">
          <i class="ph ph-lightning"></i>
          <p>No flash sale products available</p>
          <p>Check back later for exciting offers!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useOffersApi } from '~/composables/api/useOffersApi'
import { useCart } from '~/composables/api/useCart'

export default {
  name: 'HomeFlash',

  setup() {
    const { offers, loading, error, refresh: fetchAllOffers } = useOffersApi()
    const swiperContainer = ref<HTMLElement | null>(null)
    const swiperInstance = ref<any>(null)
    const isMobile = ref(false)

    // Check if mobile
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    // Mobile responsive listener
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })
    const activeOffer = computed(() => {
      if (!offers.value) return null
      return offers.value.find(o => o.offerType === 'FLASH_SALE') || null
    })

    // Countdown
    const getCountdown = (offerId: number) => {
      const offer = offers.value.find(o => o.id === offerId)
      if (!offer) return undefined

      const now = new Date().getTime()
      const endDate = new Date(offer.endDate).getTime()
      const timeRemaining = Math.max(0, endDate - now)

      if (timeRemaining === 0) return undefined

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

      return { days, hours, minutes, isStarting: false, isExpired: timeRemaining === 0 }
    }

    // Products from offers with duplicates for looping
    const displayProducts = computed(() => {
      if (!offers.value || offers.value.length === 0) return []

      const productOffers = offers.value.filter(offer =>
        (offer.offerType === 'FLASH_SALE' || offer.offerType === 'PRODUCT') &&
        (offer.products?.length || offer.OfferProducts?.length)
      )

      if (!productOffers.length) return []

      const firstOffer = productOffers[0]
      const offerProducts = firstOffer.products || firstOffer.OfferProducts || []

      const products = offerProducts
        .map((item: any) => item.product || item.Product || item)
        .filter((p: any) => {
  // Ensure we have an identifier; fall back to other fields or generate one
  if (!p) return false;
  if (!p.id) {
    p.id = p.productId ?? p.groupId ?? `temp-${Math.random().toString(36).substr(2, 9)}`;
  }
  // Ensure a name exists
  if (!p.name) {
    p.name = p.title ?? 'Unnamed product';
  }
  return true;
})
        .map((product: any) => ({
          ...product,
          price: Number(product.price),
          discount: firstOffer.discountValue ?? 20
        }))

      // Duplicate products if less than needed for proper looping
      const minSlidesForLoop = 6
      if (products.length < minSlidesForLoop && products.length > 0) {
        const duplicatesNeeded = Math.ceil(minSlidesForLoop / products.length)
        const duplicated = []
        for (let i = 0; i < duplicatesNeeded; i++) {
          duplicated.push(...products)
        }
        return duplicated
      }

      return products
    })

    // Initialize swiper
    const initSwiper = async () => {
      if (!swiperContainer.value || displayProducts.value.length === 0) return

      try {
        const SwiperModule = await import('swiper')
        const { Navigation, Autoplay } = await import('swiper/modules')
        const Swiper = SwiperModule.default

        const productCount = displayProducts.value.length
        const shouldLoop = productCount >= 3 // Enable loop only if we have enough products

        swiperInstance.value = new Swiper(swiperContainer.value, {
          modules: [Navigation, Autoplay],
          loop: shouldLoop,
          slidesPerView: 'auto',
          spaceBetween: 16,
          speed: 600,
          grabCursor: true,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            stopOnLastSlide: false
          },
          navigation: {
            nextEl: '.next-btn',
            prevEl: '.prev-btn'
          },
          breakpoints: {
            320: { slidesPerView: 'auto', spaceBetween: 8 },
            480: { slidesPerView: 'auto', spaceBetween: 12 },
            640: { slidesPerView: 'auto', spaceBetween: 12 },
            768: { slidesPerView: 'auto', spaceBetween: 16 },
            1024: { slidesPerView: 'auto', spaceBetween: 20 },
            1200: { slidesPerView: 'auto', spaceBetween: 24 }
          }
        })
      } catch (err) {
        console.error('Swiper initialization failed:', err)
      }
    }

    const slideNext = () => swiperInstance.value?.slideNext()
    const slidePrev = () => swiperInstance.value?.slidePrev()

    // Reinitialize swiper when products change
    watch(displayProducts, async () => {
      await nextTick()

      if (swiperInstance.value) {
        swiperInstance.value.destroy(true, true)
        swiperInstance.value = null
      }

      initSwiper()
    })

    onMounted(async () => {
      try {
        await fetchAllOffers()
      } catch (err) {
        console.error('❌ Failed to fetch offers:', err)
      }
    })

    onUnmounted(() => {
      if (swiperInstance.value) {
        swiperInstance.value.destroy(true, true)
        swiperInstance.value = null
      }
    })

    // Helpers
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch {
        return 'Limited time'
      }
    }

    const getProductImage = (product: any) =>
      product.image ||
      product.images?.[0]?.imageUrl ||
      '/assets/images/buysection/shirt.jpg'

    const calculateDiscountedPrice = (original: number, discount: number) =>
      Math.round(original * (1 - discount / 100))

    const getRandomSoldPercentage = () =>
      Math.floor(Math.random() * 30) + 70

    const getRandomAvailable = () =>
      Math.floor(Math.random() * 20) + 5

    const handleImageError = (event: any) => {
      if (event.target.src !== '/assets/images/buysection/shirt.jpg') {
        event.target.src = '/assets/images/buysection/shirt.jpg'
      }
      event.target.onerror = null
    }

    const generateProductUrl = (product: any) => {
      if (!product) return '/shop-all'

      const name = product.name || 'product'

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const productId =
        product.id || product.groupId || product.productId || ''

      return `/shop-all/${slug}/${productId}`
    }

    const addToCart = (product: any) => {
      const { addToCart: cartAdd } = useCart()
      cartAdd(product)
      console.log('Added to cart:', product.name)
    }

    const formatDiscountText = (offer: any) =>
      `${offer.discountValue}% OFF`

    return {
      swiperContainer,
      swiperInstance,
      activeOffer,
      displayProducts,
      loading,
      error,
      isMobile,
      initSwiper,
      slideNext,
      slidePrev,
      formatDate,
      getProductImage,
      calculateDiscountedPrice,
      getRandomSoldPercentage,
      getRandomAvailable,
      handleImageError,
      generateProductUrl,
      addToCart,
      getCountdown,
      formatDiscountText
    }
  }
}
</script>

<style scoped>
.flash-sales {
  margin-top: 16px;
  padding: 12px 0 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  overflow: hidden;
}

.container-lg {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 12px;
}

/* Section Heading */
.section-heading {
  margin-bottom: 48px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-8 {
  gap: 8px;
}

h5 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.flex-align {
  display: flex;
  align-items: center;
}

.gap-16 {
  gap: 16px;
}

/* Offer Badge */
.offer-badge {
  background: linear-gradient(135deg, var(--main-600), var(--main-700));
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid var(--main-500);
}

.offer-timer {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.offer-placeholder {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e2e8f0;
  border-top-color: #CA2D52;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Flash Sales Content */
.flash-sales-content {
  position: relative;
}

/* Swiper Container Wrapper */
.swiper-container-wrapper {
  position: relative;
  padding: 0 4px;
  overflow: visible;
  margin: 0;
}

/* Swiper */
.product-swiper {
  width: 100%;
  overflow: hidden;
}

.swiper-wrapper {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  transition-timing-function: ease-out;
  box-sizing: border-box;
}

.swiper-slide {
  height: auto;
  display: flex;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  padding: 0;
  margin: 0;
  width: auto;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 200px;
  max-height: 340px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #CA2D52;
}

/* Add to Cart Button */
.add-cart-btn {
  background: #CA2D52;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.3);
  width: 100%;
  margin-top: 6px;
}

.add-cart-btn:hover {
  background: #B02548;
  box-shadow: 0 6px 16px rgba(202, 45, 82, 0.4);
  transform: translateY(-2px);
}

/* Product Image */
.product-image-container {
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-shrink: 0;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Product Content */
.product-content {
  padding: 6px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  max-height: 200px;
}

.price-review-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  flex-shrink: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.per-unit {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.original-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.review-section {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.rating {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.rating-star {
  color: #f59e0b;
  font-size: 14px;
}

.review-count {
  font-size: 14px;
  color: #64748b;
}

/* Product Title */
.product-title {
  margin: 0;
  flex-shrink: 0;
  line-height: 1.3;
  max-height: 2.6em;
}

.product-link {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  max-height: 2.6em;
}

.product-link:hover {
  color: #CA2D52;
}

/* Progress Section */
.progress-section {
  margin-top: 2px;
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 11px;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Navigation Buttons */
.navigation-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
  pointer-events: all;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
  background: #CA2D52;
  color: white;
  border-color: #CA2D52;
  transform: scale(1.1);
}

.nav-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
}

.empty-state i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state p:first-of-type {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #475569;
}

.empty-state p:last-of-type {
  font-size: 14px;
  color: #94a3b8;
}

/* Mobile Grid View */
.mobile-grid-view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  padding: 12px;
  height: 100vw;
  max-height: 600px;
  width: 100%;
}

.mobile-product-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  position: relative;
}

.mobile-product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #CA2D52;
}

.mobile-product-image-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  min-height: 0;
  position: relative;
}

.mobile-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.mobile-product-card:hover .mobile-product-image {
  transform: scale(1.05);
}

.mobile-price-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  background: transparent;
  color: white;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Desktop Swiper View - Hide on Mobile */
.desktop-swiper-view {
  display: block;
}

.mobile-grid-view {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-swiper-view {
    display: none;
  }

  .mobile-grid-view {
    display: grid;
  }

  .flash-sales {
    padding: 8px 0 16px;
  }

  h5 {
    font-size: 20px;
  }

  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .flash-sales {
    padding: 6px 0 12px;
  }

  .swiper-container-wrapper {
    padding: 0 6px;
    margin: 0;
    overflow: hidden;
  }

  .product-image-container {
    min-height: 120px;
  }

  .product-image {
    height: 120px;
    padding: 8px;
  }

  .product-content {
    padding: 10px;
  }

  .product-link {
    font-size: 13px;
    max-height: 2.6em;
  }

  .current-price {
    font-size: 15px;
  }

  .add-cart-btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

/* Fix for Swiper layout */
:deep(.swiper-slide) {
  height: auto !important;
}

:deep(.swiper-slide > *) {
  height: 100% !important;
  width: 100% !important;
}
</style>
