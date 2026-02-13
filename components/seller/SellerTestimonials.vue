<template>
  <section
    class="testimonials py-120 bg-neutral-600 bg-img overflow-hidden"
    :style="{ backgroundImage: 'url(/assets/images/bg/pattern-two.png)' }"
  >
    <div class="container container-lg">
      <div class="row gy-4 align-items-center">
        
        <!-- LEFT TITLE COLUMN -->
        <div class="col-xl-1">
          <div class="section-heading mb-0 d-flex flex-column align-items-center writing-mode">
            <p class="text-white">Share information about your brand with your customers.</p>
            <h5 class="text-white mb-0 text-uppercase">Customers Feedback</h5>
          </div>
        </div>

        <!-- RIGHT SLIDER COLUMN -->
        <div class="col-xl-11">
          <div class="position-relative">

            <!-- ================= MAIN SLIDER ================= -->
            <Swiper
              class="testimonials-slider mb-60"
              :modules="modules"
              :slides-per-view="1"
              :loop="true"
              :thumbs="{ swiper: thumbsSwiper }"
              :navigation="{ prevEl: '#testi-prev', nextEl: '#testi-next' }"
            >
              <SwiperSlide v-for="(item, i) in testimonials" :key="i">
                <div class="testimonials-item text-center">

                  <!-- ⭐ MAIN IMAGE (ADDED) -->
                  <div class="mb-32">
                    <img
                      :src="item.img"
                      class="rounded-circle"
                      style="width:120px; height:120px; object-fit:cover; border:3px solid #fff"
                    />
                  </div>

                  <h6 class="text-white text-uppercase mb-8 fw-medium">{{ item.name }}</h6>
                  <span class="text-md text-white fw-normal">{{ item.role }}</span>

                  <div class="flex-align gap-8 mt-24">
                    <span v-for="s in 5" :key="s" class="text-xs fw-medium text-warning-600 d-flex">
                      <i class="ph-fill ph-star" />
                    </span>
                  </div>

                  <p class="testimonials-item__desc text-white text-2xl fw-normal mt-40 max-w-990 mx-auto">
                    {{ item.desc }}
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>

            <!-- ================= THUMBS SLIDER ================= -->
            <Swiper
              class="testimonials-thumbs-slider"
              :modules="modules"
              :slides-per-view="5"
              :space-between="14"
              :loop="true"
              watch-slides-progress
              @swiper="(swiper) => (thumbsSwiper = swiper)"
            >
              <SwiperSlide v-for="(item, i) in testimonials" :key="'thumb-'+i">
                <div class="testimonials-thumbs d-flex position-relative align-items-end justify-content-end">
                  <div class="testimonials-thumbs__img">
                    <img :src="item.img" alt="" class="cover-img" />
                  </div>
                  <div class="testimonials-thumbs__content position-absolute bottom-0 start-50 translate-middle-x mb-16 text-center">
                    <h6 class="text-white text-uppercase mb-8 fw-medium">{{ item.name }}</h6>
                    <span class="text-md text-white fw-normal">{{ item.role }}</span>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

          </div>
        </div>
      </div>

      <!-- NAV BUTTONS -->
      <div class="flex-center gap-8 mt-48">
        <button
          type="button"
          id="testi-prev"
          class="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 text-xl text-white"
        >
          <i class="ph ph-caret-left" />
        </button>

        <button
          type="button"
          id="testi-next"
          class="slick-next slick-arrow flex-center rounded-circle border border-gray-100 text-xl text-white"
        >
          <i class="ph ph-caret-right" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation, Thumbs } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"

const modules = [Navigation, Thumbs]

const thumbsSwiper = ref(null)

const testimonials = [
  {
    name: 'ROBIUL HASAN',
    role: 'Business Owner',
    img: '/assets/images/thumbs/testimonials-img1.png',
    desc: 'Customers expressed that shopping at Asiana Fashion was a delightful experience.'
  },
  {
    name: 'SAMIYA AKTER',
    role: 'Front End Developer',
    img: '/assets/images/thumbs/testimonials-img2.png',
    desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
  },
  {
    name: 'JOHN DOE',
    role: 'Max Model',
    img: '/assets/images/thumbs/testimonials-img3.png',
    desc: 'It is a long established fact that a reader will be distracted.'
  },
  {
    name: 'MICHEL SMITH',
    role: 'Former Model',
    img: '/assets/images/thumbs/testimonials-img4.png',
    desc: 'Many desktop publishing packages and web page editors use Lorem Ipsum as default.'
  },
  {
    name: 'ALEX',
    role: 'Back End Developer',
    img: '/assets/images/thumbs/testimonials-img2.png',
    desc: 'There are many variations of passages of Lorem Ipsum available.'
  }
]
</script>

<style scoped>
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Active thumbnail highlight */
.testimonials-thumbs-slider .swiper-slide-thumb-active img {
  border: 3px solid #fff;
  transform: scale(1.05);
  transition: 0.2s;
  border-radius: 100px;
}
</style>
