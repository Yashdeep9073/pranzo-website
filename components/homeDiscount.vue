<script setup>
import { ref } from 'vue'

const coupon = "FREE25BAC"
const copied = ref(false)

function copyCode() {
  navigator.clipboard.writeText(coupon)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="pt-80">
    <div class="container container-lg">

      <div
        class="
          border border-main-500 bg-main-50 border-dashed rounded-8
          py-12 py-md-20
          px-12 px-md-20
          d-flex align-items-center justify-content-evenly
          gap-12 gap-md-0
          flex-wrap
        "
      >
        <!-- Left Text -->
        <p class="text-xs text-md-sm text-lg-md text-main-600 fw-normal text-center text-md-start">
          Super discount for your
          <a
            href="javascript:void(0)"
            class="fw-bold text-decoration-underline text-main-600"
          >
            first purchase
          </a>
        </p>

        <!-- Coupon Button -->
        <div class="position-relative">
          <button
            @click="copyCode"
            class="
              copy-coupon-btn
              px-16 px-md-32
              py-8 py-md-10
              text-xs text-md-sm
              text-white text-uppercase
              bg-main-600
              rounded-pill
              border-0
              hover-bg-main-800
              white-space-nowrap
            "
          >
            {{ coupon }}
            <i class="ph ph-file-text text-lg line-height-1"></i>
          </button>

          <!-- Tooltip -->
          <span
            v-if="copied"
            class="
              copy-text
              bg-main-600 text-white
              fw-normal
              position-absolute
              bottom-100 start-50 translate-middle-x
              px-12 py-4
              rounded-pill
              mb-6
              text-xs
              min-w-max
            "
          >
            Copied!
          </span>
        </div>

        <!-- Right Text -->
        <p class="text-xs text-md-sm text-lg-md text-main-600 fw-normal text-center text-md-start">
          Use discount code to get
          <span class="fw-bold">20%</span>
          discount for any item
        </p>

      </div>

    </div>
  </div>
</template>

