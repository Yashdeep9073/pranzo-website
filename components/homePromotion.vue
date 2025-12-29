<!-- components/CategoryBanner.vue -->
<template>
  <section class="category-banner-section py-80">
    <div class="container container-lg">
      <div class="section-header text-center mb-60">
        <h2 class="section-title display-5 fw-bold mb-16">Shop By Category</h2>
        <p class="section-subtitle text-muted fs-5">Discover amazing products in every category</p>
      </div>
      
      <div v-if="loading" class="row g-4">
        <div v-for="i in 4" :key="'skeleton-' + i" class="col-xl-3 col-md-6">
          <div class="category-card-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-text"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-40">
        <div class="alert alert-warning p-16 d-inline-block">
          <i class="ph ph-warning-circle fs-24 me-8"></i>
          <span class="fs-5">{{ error }}</span>
        </div>
      </div>
      
      <div v-else class="row g-24">
        <!-- Dynamic Category Banners -->
        <div 
          v-for="(category, index) in categoryData" 
          :key="category.id || index"
          class="col-xl-3 col-md-6"
        >
          <div 
            class="category-card"
            :class="getCategoryClass(index)"
            @mouseenter="handleHover(index)"
            @mouseleave="handleLeave(index)"
          >
            <div class="category-image-wrapper">
              <img 
                :src="category.image" 
                :alt="category.title"
                class="category-image"
                loading="lazy"
              />
              <div class="category-overlay"></div>
              
              <!-- Category Badge -->
              <div class="category-badge">
                <span class="badge-text">Hot</span>
              </div>
              
              <!-- Quick View Button -->
              <button 
                class="quick-view-btn"
                @click="navigateToCategory(category.link)"
                :style="{ backgroundColor: categoryColors[index % categoryColors.length] }"
              >
                <i class="ph ph-eye me-8"></i>
                Quick View
              </button>
            </div>
            
            <div class="category-content">
              <h3 class="category-title">
                <NuxtLink 
                  :to="category.link" 
                  class="category-link"
                  :style="{ color: categoryColors[index % categoryColors.length] }"
                >
                  {{ category.title }}
                </NuxtLink>
              </h3>
              
              <p class="category-description">
                {{ category.description }}
              </p>
              
              <div class="category-stats">
                <div class="stat-item">
                  <i class="ph ph-package stat-icon"></i>
                  <span class="stat-value">{{ category.productCount }}</span>
                  <span class="stat-label">Products</span>
                </div>
                <div class="stat-item">
                  <i class="ph ph-star stat-icon"></i>
                  <span class="stat-value">{{ category.rating }}/5</span>
                  <span class="stat-label">Rating</span>
                </div>
              </div>
              
              <div class="category-actions">
                <NuxtLink 
                  :to="category.link" 
                  class="shop-now-btn"
                  :style="{
                    background: `linear-gradient(135deg, ${(categoryColors[index % categoryColors.length] ?? '#3B82F0')}, ${darkenColor(categoryColors[index % categoryColors.length] ?? '#3B82F6', 20)})`,
                    boxShadow: `0 4px 15px ${(categoryColors[index % categoryColors.length] ?? '#3B82F6')}40`
                  }"
                >
                  <span>Shop Now</span>
                  <i class="ph ph-arrow-right arrow-icon"></i>
                </NuxtLink>
                
                <!-- <button 
                  class="wishlist-btn"
                  @click="toggleWishlist(category)"
                  :style="{ color: categoryColors[index % categoryColors.length] }"
                >
                  <i :class="category.isWishlisted ? 'ph ph-heart-fill' : 'ph ph-heart'"></i>
                </button> -->
              </div>
            </div>
            
            <!-- Floating Decoration -->
            <div class="floating-decoration">
              <div 
                class="floating-circle circle-1"
                :style="{ backgroundColor: `${categoryColors[index % categoryColors.length]}20` }"
              ></div>
              <div 
                class="floating-circle circle-2"
                :style="{ backgroundColor: `${categoryColors[index % categoryColors.length]}15` }"
              ></div>
              <div 
                class="floating-shape"
                :style="{ backgroundColor: `${categoryColors[index % categoryColors.length]}10` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- View All Categories Button -->
      <div v-if="!loading && !error" class="text-center mt-60">
        <NuxtLink to="/shop-all" class="view-all-btn">
          <span>View All Categories</span>
          <i class="ph ph-arrow-circle-right ms-12"></i>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'

interface CategoryData {
  id: number
  title: string
  description: string
  image: string
  link: string
  productCount: string
  rating: number
  isWishlisted: boolean
  isHovered?: boolean
}

// Reactive state
const categoryData = ref<CategoryData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

// Color palette for categories
const categoryColors = [
 '#4E342E', // Blue
  '#4B2E2A', // Emerald
  '#5D4037', // Amber
  '#3E2723', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316'  // Orange
]

// Initialize with your images
const initializeCategories = () => {
  const images = [
    '/assets/images/nowcategory/electronics1.jpg',
    '/assets/images/nowcategory/women.jpg',
    '/assets/images/nowcategory/men.jpg',
    '/assets/images/nowcategory/festivel.jpg'
  ]
  
  const titles = [
    'Electronics',
    'Women Fashion',
    'Men Fashion',
    'Festive Collection'
  ]
  
  const descriptions = [
    'Latest gadgets, smartphones, and tech accessories',
    'Trendy outfits, accessories, and beauty products',
    'Stylish clothing, footwear, and grooming essentials',
    'Special collections for festivals and celebrations'
  ]
  
  const links = [
    '/shop-all?category=Electronics',
    '/shop-all?category=Women',
    '/shop-all?category=Men',
    '/shop-all?category=Festive-collection'
  ]
  
  const productCounts = ['500+', '1200+', '800+', '300+']
  
  categoryData.value = images.map((image, index) => ({
    id: index + 1,
    title: titles[index]!,
    description: descriptions[index]!,
    image: image,
    link: links[index]!,
    productCount: productCounts[index]!,
    rating: Number((4.5 + (Math.random() * 0.5)).toFixed(1)), // Random rating between 4.5-5.0
    isWishlisted: Math.random() > 0.5, // Random wishlist status
    isHovered: false
  }))
  
  loading.value = false
}

// Hover effects
const handleHover = (index: number) => {
  const cat = categoryData.value[index]
  if (cat) cat.isHovered = true
}

const handleLeave = (index: number) => {
  const cat = categoryData.value[index]
  if (cat) cat.isHovered = false
}

// Get dynamic class for category card
const getCategoryClass = (index: number) => {
  const baseClass = 'category-card'
  const hoverClass = categoryData.value[index]?.isHovered ? 'category-card-hover' : ''
  const indexClass = `category-${index + 1}`
  return `${baseClass} ${hoverClass} ${indexClass}`
}

// Darken color utility
const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = (num >> 8 & 0x00FF) - amt
  const B = (num & 0x0000FF) - amt
  
  return "#" + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)
}

// Toggle wishlist
const toggleWishlist = (category: CategoryData) => {
  category.isWishlisted = !category.isWishlisted
}

// Navigate to category
const navigateToCategory = (link: string) => {
  router.push(link)
}

// Initialize on mount
onMounted(() => {
  setTimeout(() => {
    initializeCategories()
  }, 500) // Simulate loading delay
})
</script>

<style scoped>
.category-banner-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.category-banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-bottom-left-radius: 50% 20%;
  border-bottom-right-radius: 50% 20%;
}

.section-title {
  background: linear-gradient(135deg, #6e5101, #2d0097);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
}

.section-title::after { 

  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #52be05, #03ae1d);
  border-radius: 2px;
}

/* Category Card */
.category-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.category-card-hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Image Container */
.category-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.category-card:hover .category-overlay {
  opacity: 0.8;
}

/* Category Badge */
.category-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.badge-text {
  background: linear-gradient(135deg, #0d0d0d, #4f15ff);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Quick View Button */
.quick-view-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  background: #3B82F6;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.category-card:hover .quick-view-btn {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.quick-view-btn:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Content Area */
.category-content {
  padding: 24px;
  position: relative;
  z-index: 1;
  background: white;
}

.category-title {
  margin-bottom: 12px;
}

.category-link {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
}

.category-link:hover {
  opacity: 0.9;
}

.category-description {
  color: #64748b;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 48px;
}

/* Stats */
.category-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  color: #94a3b8;
  font-size: 1.125rem;
}

.stat-value {
  font-weight: 300;
  color: #696969;
  font-size: 0.8rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
}

/* Actions */
.category-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.shop-now-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.shop-now-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.wishlist-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;
}

.wishlist-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: scale(1.1);
}

/* Floating Decoration */
.floating-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: -40px;
  right: -40px;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  bottom: 20px;
  left: -30px;
  animation-delay: 2s;
}

.floating-shape {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 30px;
  top: 50%;
  right: 10%;
  transform: rotate(45deg);
  animation: float 8s ease-in-out infinite;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* View All Button */
.view-all-btn {
  display: inline-flex;
  align-items: center;
  background: white;
  color: #060606;
  text-decoration: none;
  padding: 16px 40px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border: 2px solid transparent;
}

.view-all-btn:hover {
  background: #6c1d03;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
  border-color: #3B82F6;
}

.view-all-btn i {
  transition: transform 0.3s ease;
}

.view-all-btn:hover i {
  transform: translateX(8px);
}

/* Skeleton Loading */
.category-card-skeleton {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 24px;
}

.skeleton-title {
  height: 28px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 12px;
  border-radius: 6px;
  width: 70%;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 8px;
  border-radius: 4px;
  width: 90%;
}

.skeleton-button {
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
  margin-top: 20px;
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
@media (max-width: 1200px) {
  .category-image-wrapper {
    height: 180px;
  }
  
  .category-content {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .category-banner-section {
    padding: 60px 0 !important;
  }
  
  .section-title {
    font-size: 2.5rem !important;
  }
  
  .category-stats {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .category-image-wrapper {
    height: 160px;
  }
  
  .category-link {
    font-size: 1.25rem;
  }
  
  .quick-view-btn {
    min-width: 120px;
    padding: 8px 16px;
    font-size: 0.8125rem;
  }
  
  .view-all-btn {
    padding: 14px 32px;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .row.g-24 {
    --bs-gutter-y: 16px;
  }
  
  .category-card {
    margin-bottom: 16px;
  }
  
  .category-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .shop-now-btn {
    width: 100%;
  }
  

}
</style>