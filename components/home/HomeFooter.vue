<template>
  <footer class="footer py-120">
    <div class="container container-lg">
      <div class="footer-item-wrapper d-flex align-items-start flex-wrap">
        <div class="footer-item" data-aos="fade-up" data-aos-duration="200">
       <div class="footer-item__logo">
  <NuxtLink to="/">
    <img :src="logoSrc" alt="Vibrantick Infotech Solutions">
  </NuxtLink>
</div>

<p class="mb-28 text-heading">
  Vibrantick Infotech Solutions
</p>

<div class="d-flex flex-column gap-8">
  <p class="text-heading fw-medium">
    Phase 8B, Industrial Area, Sector 74,<br>
    Mohali, Punjab, India
  </p>

  <a 
    href="mailto:info@vibrantick.org" 
    class="text-heading fw-medium hover-text-main-600"
  >
    info@vibrantick.org
  </a>

  <a 
    href="tel:+919915400090" 
    class="text-heading fw-medium hover-text-main-600"
  >
    +91 99154 00090
  </a>
</div>
</div> 
        
        <div class="footer-item" data-aos="fade-up" data-aos-duration="400">
          <h6 class="footer-item__title">Information</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/seller/become-a-seller" class="text-heading hover-text-main-600">Become a Vendor</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Affiliate Program</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Privacy Policy</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Our Suppliers</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Extended Plan</NuxtLink>
            </li>
            <li class="">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Community</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-item" data-aos="fade-up" data-aos-duration="600">
          <h6 class="footer-item__title">Customer Support</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/" class="text-heading hover-text-main-600">Help Center</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Contact Us</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Report Abuse</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Submit and Dispute</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Policies & Rules</NuxtLink>
            </li>
            <li class="">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Online Shopping</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-item" data-aos="fade-up" data-aos-duration="800">
          <h6 class="footer-item__title">My Account</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">My Account</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/cart/checkout" class="text-heading hover-text-main-600">Order History</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/cart/cart" class="text-heading hover-text-main-600">Shoping Cart</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Compare</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Help Ticket</NuxtLink>
            </li>
            <li class="">
              <NuxtLink to="/account/wishlist" class="text-heading hover-text-main-600">Wishlist</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-item" data-aos="fade-up" data-aos-duration="1000">
          <h6 class="footer-item__title">Daily Groceries</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Clothing</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Electronics</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Summer Deals</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Household Supplies</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Cars & Bike</NuxtLink>
            </li>
            <li class="">
              <NuxtLink to="/shop/shop-all" class="text-heading hover-text-main-600">Seasons Sales</NuxtLink>
            </li>
          </ul>
        </div>
        
        <div class="footer-item" data-aos="fade-up" data-aos-duration="1200">
          <h6 class="">Shop on The Go</h6>
          <p class="mb-16">MarketPro App is available.  Get it now</p>
          <div class="my-32">
            <div class="flex-align gap-8">
              <div class="bg-white rounded-10 p-1 box-shadow-5xl">
                <img src="/assets/images/thumbs/qr-code.png" alt="QR Code">
              </div>
              <div class="d-flex flex-column gap-16">
                <a href="https://www.apple.com/app-store" class="py-14 px-32 d-flex justify-content-center align-items-center gap-8 fw-medium text-heading text-sm hover-bg-main-600 hover-text-white box-shadow-6xl rounded-6">
                  <i class="ph-fill ph-apple-logo"></i>
                  Google play
                </a>
                <a href="https://www.apple.com/app-store" class="py-14 px-32 d-flex justify-content-center align-items-center gap-8 fw-medium text-heading text-sm hover-bg-main-600 hover-text-white box-shadow-6xl rounded-6">
                  <img src="/assets/images/icon/google-play.svg" alt="Play Store">
                  Google play
                </a>
              </div>
            </div>
            <div class="mt-24">
              <img src="/assets/images/thumbs/method.png" alt="Method ">
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'ufo'

const config = useRuntimeConfig()
const logoSrc = computed(() =>
  withBase('/assets/images/logo/pranzo-weblogo.png', config.app.baseURL)
)
</script>

<style scoped>
/* Scoped styles if any overrides needed; global CSS already handles classes. */
</style>
