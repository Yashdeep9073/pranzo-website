<template>
  <section class="explore-categories pt-20">
    <h4 class="section-title">Explore Top Categories</h4>

    <!-- MAIN CATEGORIES -->
    <div 
      v-for="category in categories"
      :key="category.id"
      class="category-block"
    >
      <!-- Main category name OUTSIDE -->
      <h5 class="category-titlee">
        {{ category.name }} 
      </h5>
           
      <!-- Sub categories swiper --> 
       <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :space-between="spaceBetween"
        :free-mode="true"
        :breakpoints="breakpoints"
        class="category-swiper"
      >
        <swiper-slide
          v-for="sub in category.subCategories"
          :key="sub.id"
          class="subcategory-card"
        >
          <NuxtLink :to="getSubCategoryLink(category, sub)">
            <div class="image-wrap">
              <img
                :src="sub.image || category.image || fallbackImage"
                :alt="sub.name"
                loading="lazy"
              /> 
            </div>

            <p class="label">
              {{ sub.name }} 
            </p>
          </NuxtLink>
        </swiper-slide>
      </swiper>
    </div>
  
    <!-- Loader -->
    <div v-if="!categories.length" class="loading">
      Loading categories... 
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

const modules = [FreeMode] 
const categories = ref([])
const slidesPerView = ref(3)
const spaceBetween = ref(14)

const breakpoints = {
  320: {
    slidesPerView: 3.4,
    spaceBetween: 11
  },
  576: {
    slidesPerView: 4.7,
    spaceBetween: 14
  },
  768: {
    slidesPerView: 6.7, 
    spaceBetween: 16
  },
  992: {
    slidesPerView: 7, 
    spaceBetween: 18
  },
  1200: {
    slidesPerView: 8,
    spaceBetween: 20
  },
  1400: {
    slidesPerView: 9,
    spaceBetween: 22
  },
  1600: {
    slidesPerView: 11,
    spaceBetween: 24
  }
}

const fallbackImage =
  'https://via.placeholder.com/300x300?text=Category'

const config = useRuntimeConfig()
console.log('🔍 [HomeCategory] Config loaded:', config.public)
console.log('🔍 [HomeCategory] apiCategories value:', config.public.apiCategories)
const API_URL = config.public.apiCategories 
console.log('🔍 [HomeCategory] Final API_URL:', API_URL)

const fetchCategories = async () => {
  try {
    const res = await $fetch(API_URL)
    categories.value = (res?.data || [])
      .filter(cat => cat && !cat.isDeleted)
      .filter(cat => Array.isArray(cat.subCategories)) 
      .filter(cat => cat.subCategories.length > 0)
      .map(cat => ({
        ...cat,
        subCategories: cat.subCategories.filter(sub => sub && sub.name)
      }))
      .slice(0, 6)  
  } catch (err) {
    console.error('Category fetch failed:', err) 
  }
}

onMounted(fetchCategories)

const getSubCategoryLink = (category, sub) => {
  return `/shop/shop-all?category=${category.name}`
}
</script>

<style scoped>

.category-block {
  position: relative;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.category-block::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 1px;
  background: #e5e5e5;
}

.explore-categories {
  padding: 8px;
  display: none;
}
.section-title {
  position: relative;
  display: inline-block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  font-family: 'Poppins', sans-serif;
}

.section-title::after { 
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 40px;         
  height: 2.2px;         
  background: #2896f6;  
  border-radius: 2px;
}

.category-block {
  margin-bottom: 20px;
}

.category-titlee {
   font-size: 16px;
   margin-bottom: 12px;
   color: black;
   font-family: 'Poppins', sans-serif;
   font-weight: 600;
}

.subcategory-card {
  text-align: center;
  
}

.image-wrap {
  background: #f3f3f3;
  width: 80px;
  border-radius: 16px;
  overflow: hidden;
}

.image-wrap img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.label {
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  color: black;
}

/* Loader */
.loading {
  font-size: 14px;
  color: #888;
}
@media(max-width:325px){
    .category-block {
  margin-bottom: 6px;
}
.explore-categories{
  display: block;
}
}
</style>
