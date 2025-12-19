<template>
  <section
    class="banner-inner bg-overlay z-1 position-relative py-72 bg-img bg-start"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div
      class="banner-inner__img position-absolute inset-inline-end-0 top-50 translate-middle-y h-100 arrow-left-clip w-30-percent d-xxl-block d-none"
    >
      <img
        :src="bannerImage"
        alt=""
        class="h-100"
      />
    </div>
    <div class="container">
      <div class="banner-inner__content text-center">
        <h4 class="text-white mb-20 fw-semibold">
          Become A MarketPro Seller
        </h4>
        <p class="text-white my-20">
          More than half the units sold in our stores from independent sellers.
        </p>
        <NuxtLink
          to="/person/profile"
          class="btn btn-main-two rounded-8"
        >
          Create An Account
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Define props or constants for images (assuming assets are in public folder)
const backgroundImage = '/assets/images/thumbs/banner-inner-bg.png'
const bannerImage = '/assets/images/thumbs/banner-inner-img.png'
</script>