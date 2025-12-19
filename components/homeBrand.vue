<template>
  <div class="brand py-80 overflow-hidden">
    <div class="container container-lg">
      <div class="brand-inner p-24 rounded-16">
        <div class="section-heading">
          <div class="flex-between flex-wrap gap-8">
            <h5 class="mb-0 wow fadeInLeft">Shop by Brands</h5>
            <div class="flex-align gap-16 wow fadeInRight">
              <NuxtLink to="/shop" class="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">View All Deals</NuxtLink>
              <div class="flex-align gap-8">
                <button type="button" class="brand-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                  <i class="ph ph-caret-left"></i>
                </button>
                <button type="button" class="brand-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                  <i class="ph ph-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="brand-slider arrow-style-two">
          <div class="swiper-container">
            <Swiper
              :modules="[Navigation]"
              :slides-per-view="6"
              :space-between="20"
              :navigation="{
                nextEl: '.brand-next',
                prevEl: '.brand-prev',
              }"
              :breakpoints="{
                320: { slidesPerView: 2, spaceBetween: 10 },
                576: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 15 },
                992: { slidesPerView: 5, spaceBetween: 20 },
                1200: { slidesPerView: 6, spaceBetween: 20 }
              }"
            >
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="200">    
                  <img src="/assets/images/thumbs/brand-img1.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="400">    
                  <img src="/assets/images/thumbs/brand-img2.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="600">    
                  <img src="/assets/images/thumbs/brand-img3.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="800">    
                  <img src="/assets/images/thumbs/brand-img4.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="1000">    
                  <img src="/assets/images/thumbs/brand-img5.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="1200">    
                  <img src="/assets/images/thumbs/brand-img6.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="1400">    
                  <img src="/assets/images/thumbs/brand-img7.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="1600">    
                  <img src="/assets/images/thumbs/brand-img8.png" alt="">
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="brand-item" data-aos="zoom-in" data-aos-duration="1800">    
                  <img src="/assets/images/thumbs/brand-img3.png" alt="">
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
</script>

<style scoped>
.swiper-container {
  overflow: hidden;
  position: relative;
}

.swiper-slide {
  height: auto;
}

.brand-prev,
.brand-next {
  z-index: 10;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #e5e7eb;
}

.brand-prev:hover,
.brand-next:hover {
  background-color: #3b82f6; 
  color: white;
  border-color: #3b82f6;
}
</style>