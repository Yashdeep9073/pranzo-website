<template>
  <section class="wheel-categories-section">
    <div class="section-header">
      <!-- <h4 class="section-title">Top Categories</h4>
      <NuxtLink to="/categories" class="view-all">
        View All
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink> -->
    </div>

    <!-- Wheel Layout Categories -->
    <swiper
      :modules="modules"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :free-mode="true"
      :breakpoints="breakpoints"
      class="wheel-categories-swiper"
    >
      <swiper-slide
        v-for="category in categories"
        :key="category.id"
        class="wheel-category-card"
      >
        <NuxtLink :to="getCategoryLink(category)" class="wheel-category-link">
          <div class="wheel-icon-circle">
            <img
              :src="category.image || fallbackImage"
              :alt="category.name"
              class="wheel-icon"
            />
          </div>
          <p class="wheel-category-name">
            {{ category.name }}
          </p>
        </NuxtLink>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
const config = useRuntimeConfig() 
const API_URL = config.public.api.categories
const modules = [FreeMode]
const categories = ref([])

const breakpoints = {
  320: {
    slidesPerView: 4.5,
    spaceBetween: 6
  },
  400: {
    slidesPerView: 5.6,
    spaceBetween: 10
  },
  576: {
    slidesPerView: 6.6,
    spaceBetween: 12
  },
  768: {
    slidesPerView: 7.6,
    spaceBetween: 14
  },
  992: {
    slidesPerView: 7,
    spaceBetween: 16
  },
  1200: {
    slidesPerView: 8,
    spaceBetween: 18
  },
  1400: {
    slidesPerView: 9,
    spaceBetween: 20
  }
}

const fallbackImage = 'https://via.placeholder.com/100x100?text=Cat'

const fetchCategories = async () => {
  try {
    const res = await $fetch(API_URL)
    
    categories.value = (res?.data || [])
      .filter(cat => cat && !cat.isDeleted && cat.name)
      .map(category => ({
        id: category.id,
        name: category.name,
        image: category.image || fallbackImage,
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
      }))
      .slice(0, 10)
      
  } catch (err) {
    console.error('Categories fetch failed:', err)
  }
}

onMounted(fetchCategories)

const getCategoryLink = (category) => {
  return `/shop-all?category=${encodeURIComponent(category.name)}`
}
</script>

<style scoped>
.wheel-categories-section {
  display: none;
  background: #fff;
}

.section-header {
  margin: 0;
  padding: 0;
}

.wheel-categories-swiper {
  margin: 0;
  padding: 0;
}

.wheel-category-card {
  margin: 0;
  padding: 0;
}

.wheel-category-link {
  display: flex; 
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  margin: 0;
  padding: 0;
}

.wheel-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #f8f8f8;
  border: 2px solid #f0f0f0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.wheel-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.wheel-category-name {
  font-size: 12px;
  font-weight: 500;
  color: #444;
  margin: 0;
  line-height: 1.3;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 30px;
  max-width: 70px;
}

/* Responsive */
@media (max-width: 767px) {
  .wheel-categories-section {
    display: none;
  }
}

@media (max-width: 480px)  {
  .wheel-categories-section {
    display: block;
    padding-top: 10px;

  }
  
  .wheel-icon-circle {
    width: 45px;
    height: 45px;
  }
  
  .wheel-icon {
    width: 28px;
    height: 28px;
  }
  
  .wheel-category-name {
    font-size: 11px;
    max-width: 55px;
    min-height: 26px;
  }
}
</style> 
