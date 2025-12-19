<template>
  <div class="feature" id="featureSection">
    <div class="container container-lg">
      <div class="position-relative arrow-center gradient-shadow">
        <div class="flex-align">
          <button 
            type="button" 
            @click="slidePrev"
            class="slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
          >
            <i class="ph ph-caret-left"></i>
          </button>
          <button 
            type="button" 
            @click="slideNext"
            class="slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
          >
            <i class="ph ph-caret-right"></i>
          </button>
        </div>
        
        <!-- Swiper Container -->
        <swiper
          ref="swiperRef"
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="20"
          :loop="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }"
          :navigation="{
            nextEl: '.slick-next',
            prevEl: '.slick-prev'
          }"
          :breakpoints="breakpoints"
          class="feature-item-wrapper"
        >
          <!-- Swiper Slides -->
          <swiper-slide 
            v-for="(item, index) in featureItems" 
            :key="item.id"
            class="feature-item text-center"
          >
            <div class="feature-item__thumb rounded-circle">
              <NuxtLink :to="item.link" class="w-100 h-100 flex-center">
                <img :src="item.image" :alt="item.title">
              </NuxtLink>
            </div>
            <div class="feature-item__content mt-16">
              <h6 class="text-lg mb-8">
                <NuxtLink :to="item.link" class="text-inherit">{{ item.title }}</NuxtLink>
              </h6>
              <span class="text-sm text-gray-400">{{ item.products }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

// Swiper modules
const modules = [Autoplay, Navigation]

// Swiper instance
const swiperRef = ref(null)

// Feature items data
const featureItems = [
  {
    id: 1,
    title: 'Vegetables',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img1.png',
    link: '/shop'
  },
  {
    id: 2,
    title: 'Fish & Meats',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img2.png',
    link: '/shop'
  },
  {
    id: 3,
    title: 'Desserts',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img3.png',
    link: '/shop'
  },
  {
    id: 4,
    title: 'Drinks & Juice',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img4.png',
    link: '/shop'
  },
  {
    id: 5,
    title: 'Animals Food',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img5.png',
    link: '/shop'
  },
  {
    id: 6,
    title: 'Fresh Fruits',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img6.png',
    link: '/shop'
  },
  {
    id: 7,
    title: 'Yummy Candy',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img7.png',
    link: '/shop'
  },
  {
    id: 8,
    title: 'Fish & Meats',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img2.png',
    link: '/shop'
  },
  {
    id: 9,
    title: 'Dairy & Eggs',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img8.png',
    link: '/shop'
  },
  {
    id: 10,
    title: 'Snacks',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img9.png',
    link: '/shop'
  },
  {
    id: 11,
    title: 'Frozen Foods',
    products: '125+ Products',
    image: '/assets/images/thumbs/feature-img10.png',
    link: '/shop'
  }
]

// Responsive breakpoints
const breakpoints = {
  320: { slidesPerView: 2 },
  576: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  992: { slidesPerView: 5 },
  1200: { slidesPerView: 6 },
  1400: { slidesPerView: 7 }
}

// Responsive slides per view
const slidesPerView = ref(6)

// Navigation methods
const slideNext = () => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideNext()
  }
}

const slidePrev = () => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slidePrev()
  }
}

// Handle window resize
const handleResize = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 576) {
      slidesPerView.value = 2
    } else if (window.innerWidth < 768) {
      slidesPerView.value = 3
    } else if (window.innerWidth < 992) {
      slidesPerView.value = 4
    } else if (window.innerWidth < 1200) {
      slidesPerView.value = 5
    } else if (window.innerWidth < 1400) {
      slidesPerView.value = 6
    } else {
      slidesPerView.value = 7
    }
  }
}

// Initialize on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    handleResize()
    window.addEventListener('resize', handleResize)
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>


.feature-item__thumb:hover {
  transform: scale(1.05);
}

.feature-item__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 15px;
}

.feature-item__content {
  text-align: center;
}

.feature-item__content h6 {
  transition: color 0.3s ease;
}

.feature-item__content h6:hover {
  color: var(--main-600);
}






/* Original styling preserved */
.arrow-center {
  position: relative;
}

.gradient-shadow {
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .feature-item__thumb {
    width: 100px;
    height: 100px;
  }
  
  .flex-align {
    top: -50px;
  }
}

@media (max-width: 576px) {
  .feature-item__thumb {
    width: 80px;
    height: 80px;
  }
  
  .flex-align {
    position: relative;
    top: 0;
    margin-bottom: 20px;
  }
}
</style>