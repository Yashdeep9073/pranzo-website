<template>
  <footer class="footer py-28 ">
    <div class="container container-lg">
      <div class="row g-4">
        <!-- Company Info - Takes more space on desktop -->
        <div class="col-lg-3 col-md-6 col-12 footer-brand-col">
          <div class="footer-item">
            <div class="footer-item__logo mb-3">
              <NuxtLink to="/">
                <img :src="logoSrc" alt="239 The Business Developers">
              </NuxtLink>
            </div>

            <p class="mb-3 text-heading fw-semibold">
              239 The Business Developers
            </p>

            <div class="contact-info">
              <p class="text-heading small mb-3">
                <i class="ph ph-map-pin me-2"></i>
                Lower Ground Kh, 1273, Old Delhi Gurugram Rd, opp. Fun N Food Village, Kapas Hera Extension, New Delhi, Delhi, 110097
              </p>

              <div class="contact-links mb-2">
                <a href="mailto:info@pranzo.in" class="text-heading small hover-text-main-600 d-block mb-2">
                  <i class="ph ph-envelope me-2"></i>info@pranzo.in
                </a>
                <a href="tel:+919549936342" class="text-heading small hover-text-main-600 d-block">
                  <i class="ph ph-phone me-2"></i>+91 95499 36342
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Information -->
        <div class="col-lg-2 col-md-6 col-6 footer-grid-col">
          <div class="footer-item">
            <h6 class="footer-item__title mb-3">Information</h6>
            <ul class="footer-menu list-unstyled">
              <li class="mb-2">
                <NuxtLink to="/seller/become-a-seller" class="text-heading hover-text-main-600 small">Become a Vendor</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/account/profile" class="text-heading hover-text-main-600 small">Affiliate Program</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/privacy" class="text-heading hover-text-main-600 small">Privacy Policy</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/terms" class="text-heading hover-text-main-600 small">Terms of Use</NuxtLink>
              </li>
              <li class="mb-0">
                <NuxtLink to="/security" class="text-heading hover-text-main-600 small">Security</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Customer Support -->
        <div class="col-lg-2 col-md-6 col-6 footer-grid-col">
          <div class="footer-item">
            <h6 class="footer-item__title mb-3">Customer Support</h6>
            <ul class="footer-menu list-unstyled">
              <li class="mb-2">
                <NuxtLink to="/" class="text-heading hover-text-main-600 small">Help Center</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600 small">Contact Us</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/account/profile" class="text-heading hover-text-main-600 small">Report Abuse</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600 small">Submit and Dispute</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/grievance-redressal" class="text-heading hover-text-main-600 small">Grievance Redressal</NuxtLink>
              </li>
              <li class="mb-0">
                <NuxtLink to="/cancellation-returns" class="text-heading hover-text-main-600 small">Cancellation & Returns</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- My Account -->
        <div class="col-lg-2 col-md-6 col-6 footer-grid-col">
          <div class="footer-item">
            <h6 class="footer-item__title mb-3">My Account</h6>
            <ul class="footer-menu list-unstyled">
              <li class="mb-2">
                <NuxtLink to="/account/profile" class="text-heading hover-text-main-600 small">My Account</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/cart/checkout" class="text-heading hover-text-main-600 small">Order History</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/cart/cart" class="text-heading hover-text-main-600 small">Shopping Cart</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Compare</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600 small">Help Ticket</NuxtLink>
              </li>
              <li class="mb-0">
                <NuxtLink to="/account/wishlist" class="text-heading hover-text-main-600 small">Wishlist</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Popular Searches -->
        <div class="col-lg-2 col-md-6 col-6 footer-grid-col">
          <div class="footer-item">
            <h6 class="footer-item__title mb-3">Popular Searches</h6>
            <ul class="footer-menu list-unstyled">
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Men's Clothing</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Women's Fashion</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Electronics</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Home & Living</NuxtLink>
              </li>
              <li class="mb-2">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Sports & Fitness</NuxtLink>
              </li>
              <li class="mb-0">
                <NuxtLink to="/shop-all" class="text-heading hover-text-main-600 small">Beauty & Personal Care</NuxtLink>
              </li>
            </ul>
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
.footer{
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
}

.footer-menu li > a {
  position: relative;
  display: inline-block;
  padding-left: 14px;
}

.footer-menu li > a::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid currentColor;
}

@media (max-width: 1024px) {
  .footer {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    margin-bottom: 84px;
  }
}

@media (max-width: 767px) {
  .footer {
    padding-top: 20px !important;
    padding-bottom: 8px !important;
  }

  .footer :deep(.row.g-4) {
    row-gap: 18px !important;
  }

  .footer :deep(.footer-brand-col) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }

  .footer :deep(.footer-grid-col) {
    width: 50% !important;
    max-width: 50% !important;
    flex: 0 0 50% !important;
  }

  .footer-item__title {
    margin-bottom: 10px !important;
  }

  .footer-menu li {
    margin-bottom: 8px !important;
  }
}
</style>
