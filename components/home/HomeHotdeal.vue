<template>
  <!-- hide entire block if no HOT_DEALS -->
  <section v-if="showSection" class="hot-deals pt-80 overflow-hidden">
    <div class="container container-lg">
      <!-- HEADER -->
      <div class="section-heading flex-between mb-24">
        <h5 class="mb-0">
          {{ activeOffer?.name }}
        </h5>
        <!-- COUNTDOWN -->
        <ul v-if="countdown" class="countdown-list d-flex gap-12">
          <li><span>{{ countdown.days }}</span>D</li>
          <li><span>{{ countdown.hours }}</span>H</li>
          <li><span>{{ countdown.minutes }}</span>M</li>
          <li><span>{{ countdown.seconds }}</span>S</li>
        </ul>
      </div>
      <div class="equal-height-grid">
        <!-- LEFT BANNER -->
        <div class="banner-column">
          <div class="deal-banner rounded-16 overflow-hidden position-relative h-100">
            <div class="banner-image-wrapper h-100">
              <img :src="activeOffer?.images?.[0]?.imageUrl || '/assets/images/thumbs/basket-img.png'" :alt="activeOffer?.name" class="banner-img w-100 h-100" />
              <div class="banner-gradient-overlay"></div>
            </div>
            <div class="banner-content-wrapper">
              <div class="banner-badge">
                <i class="ph ph-fire"></i>
                <span>Hot Deal</span>
              </div>
              <div class="banner-text-content">
                <h5 class="banner-heading mb-8">{{ activeOffer?.name }}</h5>
                <p class="banner-desc mb-12">{{ activeOffer?.description }}</p>
              </div>             
              <div class="banner-discount-wrapper">
                <div class="discount-badge">
                  {{ activeOffer?.discountType === 'PERCENTAGE'
                    ? activeOffer?.discountValue + '% OFF'
                    : '₹' + activeOffer?.discountValue + ' OFF'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- PRODUCTS -->
        <div class="products-column">
          <div class="products-container h-100">
            <div class="row g-12 h-100">
              <div v-for="product in products" :key="product.id" class="col-6 col-md-4 col-lg-4 col-xl-3">
                <div class="product-card border rounded-16 overflow-hidden h-100">
                  <div class="product-image-container">
                    <NuxtLink :to="`/product/${product.id}`" class="product-link">
                      <img :src="product.images?.[0]?.imageUrl || '/assets/images/thumbs/product-img26.png'" :alt="product.name" class="product-img w-100" />
                      <div class="product-overlay">
                        <button class="quick-view-btn">
                          <i class="ph ph-eye"></i>
                        </button>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="product-content p-16">
                    <h6 class="mb-6 product-title">
                      <NuxtLink :to="`/product/${product.id}`" class="product-name-link">
                        {{ product.name }}
                      </NuxtLink>
                    </h6>                  
                    <div class="product-price-section">
                      <div class="price-display fw-semibold text-main-600">
                        ₹{{ product.price }}
                      </div>
                    </div>
                    <button @click="handleAddToCart(product)" class="add-cart-btn">
                      <i class="ph ph-shopping-cart"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOffersApi } from '@/composables/api/useOffersApi'
import { useProductsApi } from '@/composables/api/useProductsApi'
import { useCart } from '~/composables/api/useCart'

/* ---------------- FETCH HOT DEALS ---------------- */

const { offers, loading: offersLoading, error } = useOffersApi({
  offerType: "HOT_DEALS",
  isActive: true,
  limit: 10
})

/* (optional) you still asked 2 hooks — products not used for UI,
   but you can keep it for later add-to-cart or caching */
const { products } = useProductsApi({
  limit: 5,
  inStock: true,
  hasDiscount: true
})

/* ---------------- CART FUNCTIONALITY ---------------- */
const { addToCart } = useCart()

const handleAddToCart = (product: any) => {
  addToCart(product)
}

/* ---------------- GLOBAL STATE ---------------- */

const loading = computed(() => offersLoading.value)

/* ---------------- ACTIVE OFFER ---------------- */

const activeOffer = computed(() => {
  if (!offers.value?.length) return null
  return offers.value.find(o => o.isActive) || offers.value[0]
})

/* ---------------- COUNTDOWN ---------------- */

const countdown = computed(() => {
  if (!activeOffer.value?.endDate) return null

  const diff = new Date(activeOffer.value.endDate).getTime() - Date.now()
  if (diff <= 0) return null

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  return {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
})

/* ---------------- PRODUCTS FROM OFFER ---------------- */

const displayProducts = computed(() => {
  if (!activeOffer.value) return []

  // backend structure: offer.products[].product
  return (activeOffer.value.products || [])
    .filter((item: any) => item.product)
    .map((item: any) => {
      const p = item.product
      return {
        id: p.id,
        name: p.name,
        image: p.images?.[0]?.imageUrl,
        price: p.price
      }
    })
})

/* ---------------- VISIBILITY ---------------- */

const showSection = computed(() =>
  !loading.value &&
  !error.value &&
  activeOffer.value &&
  products.value.length > 0
)

const getProductImage = (product: any) => {
  if (!product?.images?.length) return '/assets/images/thumbs/product-img26.png'

  const primary = product.images.find((img: any) => img.isPrimary)
  return (primary || product.images[0]).imageUrl
}

</script>


<style scoped>
/* Banner Media Container */
.banner-media-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.banner-media-image {
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
}

.banner-container:hover .banner-media-image {
  transform: scale(1.05);
}

/* Banner Content Styling */
.banner-content {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  min-height: 400px;
}

/* Category Badge */
.banner-category {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 4;
}

.text-primary-600.bg-yellow {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1e293b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.75rem;
  display: inline-block;
}

/* Main Content Area */
.banner-main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex: 1;
  margin: 0 auto;
  max-width: 70%;
}

.banner-main-content h5 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.banner-main-content p {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

/* Discount Badge */
.badge.bg-white.text-main-600 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #1e293b;
  font-weight: 700;
  border: 2px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  margin-bottom: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
}

/* Explore Button */
.explore-shop-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.explore-shop-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.explore-shop-btn .icon {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.explore-shop-btn:hover .icon {
  transform: translateX(3px);
}

/* Hot Deals Section */
.hot-deals {
  background: #f8fafc;
}

.section-heading h5 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Equal Height Grid */
.equal-height-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  align-items: start;
  min-height: 400px;
}

.banner-column,
.products-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Deal Banner Styles */
.deal-banner {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  flex: 1;
}

.deal-banner:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
}

.banner-image-wrapper {
  position: relative;
  height: 100%;
  flex: 1;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  min-height: 200px;
}

.deal-banner:hover .banner-img {
  transform: scale(1.05);
}

.banner-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 1;
}

.banner-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.8rem;
  width: fit-content;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

.banner-badge i {
  font-size: 0.9rem;
}

.banner-text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 90%;
}

.banner-heading {
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
}

.banner-desc {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.5;
}

.banner-discount-wrapper {
  display: flex;
  justify-content: flex-start;
}

.discount-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  animation: bounce 2s infinite;
}

/* Banner Animations */
@keyframes glow {
  from {
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
  }
  to {
    box-shadow: 0 4px 24px rgba(245, 158, 11, 0.6);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* banner Background Image */
.banner-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  /* Half area cover */
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  z-index: 1;
}

/* For API images */
.banner-container[style*="background-image"]::before {
  display: none;
  /* Hide if we have dynamic background */
}

.banner-bg-image {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background-image: url('/assets/images/thumbs/basket-img.png');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  z-index: 1;
}

/* banner Content */
.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
}

/* Products Container */
.products-container {
  display: flex;
  flex-direction: column;
}

.products-container .row {
  flex: 1;
  align-content: flex-start;
}

/* Product Card Styles */
.product-card {
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.product-link {
  display: block;
  position: relative;
}

.product-img {
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-img {
  transform: scale(1.08);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  color: #1e293b;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-view-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-title {
  margin: 0;
  line-height: 1.4;
}

.product-name-link {
  color: #1e293b;
  text-decoration: none;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-name-link:hover {
  color: #3b82f6;
}

.product-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.price-display {
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.stars i {
  font-size: 0.75rem;
  color: #fbbf24;
}

.rating-number {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.add-cart-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  font-size: 0.9rem;
}

.add-cart-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.add-cart-btn i {
  font-size: 1rem;
}

.product-card__cart {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
  z-index: 10;
}

.product-card:hover .product-card__cart {
  opacity: 1;
  transform: translateY(0);
}

/* Image Container - Stretched to corners (Flash Sales style) */
.product-card__thumb {
  position: relative;
  width: 100%;
  flex-shrink: 0;
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 75%;
  /* 4:3 aspect ratio */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Content Area */
.product-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title a {
  color: #1e293b;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* .title a:hover {
  color: #4f46e5;
} */

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
  line-height: 1.5;
}

/* Price and Rating Layout */
.price-group {
  display: flex;
  gap: 6px;
  white-space: nowrap;
  flex: 1;
}

.rating-group {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* Explore Shop Button */
.explore-shop-btn {
  position: absolute;
  top: 15px;
  right: -1px;
  padding: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #0a6fc2;
  font-weight: 500;
  text-decoration: none;
  border-radius: 9px;
  transition: all 0.3s ease;
  z-index: 10;
}

.explore-shop-btn:hover {
  background: #1a2c5b;
  color: #fff;
  transform: translateX(-5px);
}

.explore-shop-btn .icon {
  display: flex;
  font-size: 20px;
}

/* Swiper Styles - Removed fixed width/height */
.hot-deals-swiper {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
}

.swiper-wrapper {
  align-items: stretch;
}

.swiper-slide {
  height: auto;
  display: flex;
}

/* Navigation Buttons */
.deals-prev,
.deals-next {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.deals-prev:hover,
.deals-next:hover {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: scale(1.1);
}

/* Countdown Timer */
.countdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.countdown-list__item {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 4px 8px;
  margin: 0 2px;
}

/* Skeleton Loader */
.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-banner {
  height: 400px;
  width: 100%;
  border-radius: 16px;
}

.skeleton-image {
  width: 100%;
  padding-top: 75%;
  background: #ddd;
  border-radius: 8px;
}

.skeleton-text {
  height: 20px;
  background: #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text:last-child {
  width: 70%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hot-deals {
    padding-top: 40px !important;
  }

  .section-heading {
    text-align: center;
  }

  .flex-between {
    justify-content: center;
  }

  .product-card__content {
    padding: 16px !important;
  }

  .product-img {
    height: 150px;
  }

  .product-content {
    padding: 1rem !important;
  }

  .price-display {
    font-size: 1.1rem;
  }

  .image-container {
    padding-top: 100%;
    /* Square aspect ratio on mobile */
  }

  .equal-height-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: 300px;
  }

  .banner-content-wrapper {
    padding: 1rem;
  }

  .banner-text-content {
    max-width: 95%;
  }

  .banner-content {
    padding: 20px !important;
  }

  .explore-shop-btn {
    top: 39%;
    right: 0;
    padding: 3px;
  }
}

@media (max-width: 475px) {
  .equal-height-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    min-height: 250px;
  }

  .banner-content-wrapper {
    padding: 0.75rem;
  }

  .banner-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  .discount-badge {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .explore-shop-btn {
    top: 39%;
    right: 0;
    padding: 3px;
    font-size: 0.75rem;
  }

  .product-card__content {
    padding: 12px !important;
  }

  .product-img {
    height: 120px;
  }

  .product-content {
    padding: 0.75rem !important;
  }

  .quick-view-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .add-cart-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .title {
    font-size: 0.9rem !important;
  }

  .product-card__price {
    font-size: 0.85rem !important;
  }

  .deals-prev,
  .deals-next {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .product-card__cart {
    padding: 8px 16px !important;
    font-size: 0.875rem;
  }

  .countdown-list__item {
    padding: 2px 4px;
    font-size: 0.75rem;
  }
}

/* Utility Classes */
.rounded-t-16 {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
}

.z-10 {
  z-index: 10;
}
</style>
