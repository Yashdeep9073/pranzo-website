<!-- components/FlashSales.vue -->
<template>
  <div class="flash-sales-section">
    <!-- Header with Timer -->
    <div class="sales-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h2 class="section-title">
              <span class="title-highlight">FLASH</span> SALES
            </h2>
            <p class="section-subtitle">Limited Time Offers · Hurry Up!</p>
          </div>
          <div class="header-right">
            <div class="countdown-timer">
              <div class="timer-item">
                <span class="timer-number">{{ hours }}</span>
                <span class="timer-label">HOURS</span>
              </div>
              <span class="timer-colon">:</span>
              <div class="timer-item">
                <span class="timer-number">{{ minutes }}</span>
                <span class="timer-label">MINS</span>
              </div>
              <span class="timer-colon">:</span>
              <div class="timer-item">
                <span class="timer-number">{{ seconds }}</span>
                <span class="timer-label">SECS</span>
              </div>
            </div>
            <NuxtLink to="/shop" class="view-all-btn">
              VIEW ALL <i class="ph ph-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container">
      <div class="products-grid">
        <div 
          v-for="product in flashSaleProducts" 
          :key="product.id"
          class="product-card"
          @mouseenter="hoveredProduct = product.id"
          @mouseleave="hoveredProduct = null"
        >
          <!-- Product Badge -->
          <div class="product-badge">
            <span class="badge-text">FLASH DEAL</span>
            <span class="badge-discount">{{ product.discount }}% OFF</span>
          </div>

          <!-- Product Image -->
          <div class="product-image-container">
            <div class="image-wrapper">
              <img 
                :src="product.image" 
                :alt="product.title"
                class="product-image"
                loading="lazy"
                width="280"
                height="200"
              />
              <div class="image-overlay" :class="{ 'active': hoveredProduct === product.id }"></div>
            </div>
            <!-- Quick Actions -->
            <div class="quick-actions" :class="{ 'visible': hoveredProduct === product.id }">
              <button class="quick-action-btn" @click="addToCart(product)" aria-label="Add to cart">
                <i class="ph ph-shopping-cart"></i>
              </button>
              <button class="quick-action-btn" @click="viewDetails(product)" aria-label="View details">
                <i class="ph ph-eye"></i>
              </button>
              <button class="quick-action-btn" @click="addToWishlist(product)" aria-label="Add to wishlist">
                <i class="ph ph-heart"></i>
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h3 class="product-title">
              {{ product.title }}
            </h3>
            <p class="product-subtitle">{{ product.subtitle }}</p>
            
            <div class="price-section">
              <div class="current-price">From {{ product.currentPrice }}</div>
              <div class="original-price">{{ product.originalPrice }}</div>
            </div>

            <!-- Progress Bar -->
            <div class="sale-progress">
              <div class="progress-text">
                <span>Sold: {{ product.sold }}/{{ product.total }}</span>
                <span>{{ product.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: product.progress + '%' }"
                  :aria-valuenow="product.progress"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <!-- CTA Button -->
            <button 
              class="cta-button" 
              @click="addToCart(product)"
              :class="{ 'pulse': hoveredProduct === product.id }"
              aria-label="Buy now"
            >
              <i class="ph ph-lightning"></i>
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface FlashSaleProduct {
  id: number
  title: string
  subtitle: string
  image: string
  currentPrice: string
  originalPrice: string
  discount: number
  sold: number
  total: number
  progress: number
}

const hoveredProduct = ref<number | null>(null)

// Timer Logic
const hours = ref('12')
const minutes = ref('45')
const seconds = ref('30')

// Product Data - Pre-calculated progress for performance
const flashSaleProducts: FlashSaleProduct[] = [
  {
    id: 1,
    title: 'Earbuds',
    subtitle: 'Never Before Deals',
    image: '/assets/images/flashsale/earbuds.jpg',
    currentPrice: '₹2,999',
    originalPrice: '₹5,999',
    discount: 50,
    sold: 42,
    total: 100,
    progress: 42
  },
  {
    id: 2,
    title: 'Canvas jeans',
    subtitle: 'clothing',
    image: '/assets/images/flashsale/jean.jpg',
    currentPrice: '₹1299',
    originalPrice: '₹1599',
    discount: 50,
    sold: 85,
    total: 120,
    progress: 71
  },
  {
    id: 3,
    title: 'T-shirt jeans',
    subtitle: 'clothing',
    image: '/assets/images/flashsale/jeans-and-tshirt.jpg',
    currentPrice: '₹990',
    originalPrice: '₹1,990',
    discount: 50,
    sold: 28,
    total: 60,
    progress: 47
  },
  {
    id: 4,
    title: 'Mobile',
    subtitle: 'Electronics',
    image: '/assets/images/flashsale/mobile.jpg',
    currentPrice: '₹11,999',
    originalPrice: '₹23,999',
    discount: 50,
    sold: 15,
    total: 30,
    progress: 50
  },
  {
    id: 5,
    title: 'Women Sandals',
    subtitle: 'feel the boss',
    image: '/assets/images/flashsale/sandal-women.jpg',
    currentPrice: '₹1,299',
    originalPrice: '₹2,599',
    discount: 50,
    sold: 65,
    total: 100,
    progress: 65
  },
  {
    id: 6,
    title: 'Sneakers',
    subtitle: 'wear pride',
    image: '/assets/images/flashsale/sneaker.jpg',
    currentPrice: '₹1,259',
    originalPrice: '₹2,000',
    discount: 37,
    sold: 120,
    total: 150,
    progress: 80
  },
  {
    id: 7,
    title: 'Ethnic Wear',
    subtitle: 'Trendy Collection',
    image: '/assets/images/flashsale/women-kurti.jpg',
    currentPrice: '₹999',
    originalPrice: '₹1,999',
    discount: 50,
    sold: 45,
    total: 80,
    progress: 56
  },
  {
    id: 8,
    title: 'Shoes',
    subtitle: 'Modern & Tier',
    image: '/assets/images/flashsale/shoe1.jpg',
    currentPrice: '₹1,349',
    originalPrice: '₹1,699',
    discount: 21,
    sold: 32,
    total: 50,
    progress: 64
  }
]

// Timer Logic
let timerInterval: NodeJS.Timeout | null = null

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

const startTimer = () => {
  timerInterval = setInterval(() => {
    let sec = parseInt(seconds.value)
    let min = parseInt(minutes.value)
    let hr = parseInt(hours.value)

    sec--
    
    if (sec < 0) {
      sec = 59
      min--
    }
    
    if (min < 0) {
      min = 59
      hr--
    }
    
    if (hr < 0) {
      hr = 23
      min = 59
      sec = 59
    }

    seconds.value = sec.toString().padStart(2, '0')
    minutes.value = min.toString().padStart(2, '0')
    hours.value = hr.toString().padStart(2, '0')
  }, 1000)
}

// Product Actions
const addToCart = (product: FlashSaleProduct) => {
  console.log('Added to cart:', product)
  // Add your cart logic here
}

const viewDetails = (product: FlashSaleProduct) => {
  console.log('View details:', product)
  // Add navigation logic here
  navigateTo(`/product/${product.id}`)
}

const addToWishlist = (product: FlashSaleProduct) => {
  console.log('Added to wishlist:', product)
  // Add wishlist logic here
}
</script>

<style scoped>
.flash-sales-section {
 background: linear-gradient(135deg, #230f2b 0%, #032d71 100%); 
  padding: 2.5rem 0 3.75rem;
  position: relative;

  overflow: hidden;
}

.sales-header {
  margin-bottom: 2.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.header-left {
  flex: 1;
  min-width: 250px;
}

.section-title {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.title-highlight {
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 2s infinite alternate;
}

@keyframes shine {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.3);
  }
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.875rem;
  flex-wrap: wrap;
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.timer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 2.5rem;
}

.timer-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.125rem;
}

.timer-colon {
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0.125rem;
}

.view-all-btn {
  background: white;
  color: #051a57;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  color: #667eea;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
  position: relative;
  z-index: 2;
}

.product-card {
  background: white;
  border-radius: 12px;
  height: auto;
  min-height: 380px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.product-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  pointer-events: none;
}

.badge-text {
  background: linear-gradient(45deg, #f0e907, #8a0f22);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge-discount {
  background: linear-gradient(45deg, #0a068e, #1e90ff);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 800;
}

.product-image-container {
  position: relative;
  height: 180px;
  overflow: hidden; 
  flex-shrink: 0;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1rem;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay.active {
  opacity: 1;
}

.quick-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.quick-actions.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}

.quick-action-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  padding: 0;
}

.quick-action-btn:hover {
  background: #021465;
  color: white;
  transform: scale(1.1);
}

.product-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-subtitle {
  color: #666;
  font-size: 0.8rem;
  margin: 0 0 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.2em;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.15rem;
  font-weight: 800;
  color: #011e3c;
  line-height: 1;
}

.original-price {
  font-size: 0.85rem;
  color: #616161;
  text-decoration: line-through;
}

.sale-progress {
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
  font-size: 0.75rem;
  color: #666;
}

.progress-bar {
  height: 0.25rem;
  background: #e0e0e0;
  border-radius: 0.125rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c76701, #c2b201);
  border-radius: 0.125rem;
  transition: width 0.5s ease;
}

.cta-button {
  width: 100%;
  padding: 0.75rem;
 background: linear-gradient(135deg, #2a0938 0%, #032d71 100%); 
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-top: auto;
  flex-shrink: 0;
}

.cta-button:hover {
  background: linear-gradient(45deg, #764ba2, #667eea);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.cta-button.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 0.375rem rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .product-image-container {
    height: 160px;
  }
}

@media (max-width: 768px) {
  .flash-sales-section {
    padding: 1.5rem 0 2.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .countdown-timer {
    width: 100%;
    justify-content: center;
    max-width: 280px;
    margin: 0 auto;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.875rem;
  }

  .product-image-container {
    height: 140px;
  }
  
  .product-title {
    font-size: 0.875rem;
  }
  
  .product-subtitle {
    font-size: 0.75rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .cta-button {
    padding: 0.625rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .product-card {
    min-height: 340px;
  }
  
  .product-image-container {
    height: 120px;
  }
  
  .product-info {
    padding: 0.75rem;
  }
  
  .badge-text {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }
  
  .badge-discount {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
}

/* Performance Optimizations */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-image,
  .cta-button,
  .quick-action-btn,
  .view-all-btn,
  .product-badge,
  .image-overlay,
  .quick-actions {
    transition: none !important;
    animation: none !important;
  }
  
  .title-highlight {
    animation: none !important;
  }
}

/* Print Styles */
@media print {
  .flash-sales-section {
    background: white !important;
    color: black !important;
  }
  
  .product-card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd;
  }
  
  .cta-button,
  .quick-actions,
  .countdown-timer,
  .view-all-btn {
    display: none !important;
  }
}
</style>