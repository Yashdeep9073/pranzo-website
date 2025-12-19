<template>
  <section class="recommended-section">
    <div class="container">
      <div class="section-heading">
        <h2>Recommended for you</h2>
        <div class="category-tabs">
          <button 
            v-for="category in categories"
            :key="category.id"
            class="tab-button"
            :class="{ active: activeTab === category.id }"
            @click="setActiveTab(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      
      <div class="products-grid">
        <div 
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          class="product-card"
          :style="{ 'animation-delay': `${index * 0.1}s` }"
        >
          <div class="card-inner">
            <button class="wishlist-btn" @click="toggleWishlist(product.id)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
                      :fill="product.isWishlisted ? '#dc2626' : 'none'" 
                      :stroke="product.isWishlisted ? '#dc2626' : '#6b7280'" 
                      stroke-width="2"/>
              </svg>
            </button>
            
            <div v-if="product.badge" class="product-badge" :class="product.badge.type">
              {{ product.badge.text }}
            </div>
            
            <div class="product-image">
              <img 
                :src="product.image" 
                :alt="product.title"
                @error="handleImageError"
              />
            </div>
            
            <div class="product-content">
              <h3 class="product-title">{{ product.title }}</h3>
              
              <div class="store-info">
                <span class="store-name">By {{ product.store }}</span>
              </div>

              <div class="product-details">
                <div class="price-section">
                  <span class="current-price">${{ product.currentPrice }}</span>
                  <span class="original-price">${{ product.originalPrice }}</span>
                </div>
                
                <div class="rating">
                  <span class="rating-value">{{ product.rating }}</span>
                  <span class="review-count">({{ product.reviews }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Import ref from vue
import { ref, computed } from 'vue'

// Active tab state
const activeTab = ref('all')

// Categories data
const categories = [
  { id: 'all', name: 'All' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'juices', name: 'Juices' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'organic', name: 'Organic Foods' }
]

// Products data matching your image exactly
const products = ref([
  {
    id: 1,
    title: "Marcel's Modern Pantry Almond...",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img8.png",
    category: "grocery",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 2,
    title: "Onganics Milk, Whole, Vitamin D",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img9.png",
    category: "grocery",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 3,
    title: "Whole Grains and Seeds Organic Bread",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img10.png",
    category: "organic",
    isWishlisted: false,
    badge: { text: "Best Sale", type: "best" }
  },
  {
    id: 4,
    title: "Lucerne Yogurt, Lowfat, Strawberry",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img11.png",
    category: "grocery",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 5,
    title: "Nature Valley Whole Grain Oats and Hon...",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img12.png",
    category: "snacks",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 6,
    title: "Organic Quinoa, 12 oz",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img13.png",
    category: "organic",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 7,
    title: "C-500 Antioxidant Protect Dietary Supplement",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img7.png",
    category: "all",
    isWishlisted: false,
    badge: null
  },
  {
    id: 8,
    title: "Good & Gather Farmed Atlantic Salmon",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img16.png",
    category: "grocery",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 9,
    title: "Market Pantry 41/50 Raw Tail-Off Large Raw Shrimp",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img17.png",
    category: "grocery",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 10,
    title: "Tropicana 100% Juice, Orange, No Pulp",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img18.png",
    category: "juices",
    isWishlisted: false,
    badge: { text: "New", type: "new" }
  },
  {
    id: 11,
    title: "Fresh Organic Avocados",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img14.png",
    category: "fruits",
    isWishlisted: false,
    badge: { text: "Sale 50%", type: "sale" }
  },
  {
    id: 12,
    title: "Organic Spinach Pack",
    store: "Lucky Supermarket",
    currentPrice: "14.99",
    originalPrice: "28.00",
    rating: "4.6",
    reviews: "17%",
    image: "/assets/images/thumbs/product-img15.png",
    category: "vegetables",
    isWishlisted: false,
    badge: { text: "New", type: "new" }
  }
])

// Computed property for filtered products
const filteredProducts = computed(() => {
  if (activeTab.value === 'all') {
    return products.value
  }
  return products.value.filter(product => product.category === activeTab.value)
})

// Methods
const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const toggleWishlist = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.isWishlisted = !product.isWishlisted
  }
}

const _addToCart = (productId) => {
  // Add your cart logic here
  console.log(`Added product ${productId} to cart`)
  // You can add toast notification or cart state management
}

const handleImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
  // You can set a fallback image here if needed
  // event.target.src = '/fallback-image.png'
}
</script>

<style scoped>
.recommended-section {
  padding: 80px 0;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-heading h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.tab-button.active {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

/* CHANGED: 6 products per row */
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  border: 1px solid #e5e7eb;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-inner {
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.wishlist-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.wishlist-btn:hover {
  background: #fef2f2;
  border-color: #dc2626;
  transform: scale(1.1);
}

.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  z-index: 10;
}

.product-badge.sale {
  background: #dc2626;
}

.product-badge.best {
  background: #0891b2;
}

.product-badge.new {
  background: #d97706;
}

.product-image {
  width: 100%;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.store-info {
  margin-bottom: 12px;
}

.store-name {
  font-size: 0.8rem;
  color: #6b7280;
}

.product-details {
  margin-top: auto;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.original-price {
  font-size: 0.8rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.review-count {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

/* REMOVED: Add to Cart button to match your image */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1400px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .recommended-section {
    padding: 40px 0;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .section-heading h2 {
    font-size: 1.5rem;
  }
  
  .product-image {
    height: 120px;
  }
}
</style>