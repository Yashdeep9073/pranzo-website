<template>
  <div class="header-top bg-main-600 flex-between">
    <div class="container container-lg">
      <div class="flex-between flex-wrap gap-8">

        <!-- Countdown Section -->
        <div class="d-flex align-items-center gap-10">
          <span class="text-md fw-medium text-white d-none d-md-flex">Until the end of the sale:</span>
          <span class="text-md fw-medium text-white d-flex d-md-none">Sale end:</span>
          <div id="countdown25" class="d-flex align-items-center gap-10">
            <div class="d-flex align-items-center gap-4 text-white">
              <strong class="text-md fw-semibold days">35</strong> 
              <span class="text-xs">Days</span>
            </div>
            <div class="d-flex align-items-center gap-4 text-white">
              <strong class="text-md fw-semibold hours">14</strong> 
              <span class="text-xs">Hours</span>
            </div>
            <div class="d-flex align-items-center gap-4 text-white">
              <strong class="text-md fw-semibold minutes">54</strong> 
              <span class="text-xs">Minutes</span>
            </div>
            <div class="d-flex align-items-center gap-4 text-white">
              <strong class="text-md fw-semibold seconds">28</strong> 
              <span class="text-xs">Sec.</span>
            </div>
          </div>
        </div>

        <!-- Offers Section -->
        <ul class="flex-align flex-wrap d-none d-xl-flex">
          <li class="border-right-item pe-12 me-12">
            <span class="text-white text-sm">
              Buy one get one free on 
              <span class="text-yellow">first order</span>
            </span>
          </li>
          <li class="border-right-item pe-12 me-12">
            <a href="javascript:void(0)" class="text-white text-sm d-flex align-items-center gap-4 hover-text-decoration-underline">
              <img src="/assets/images/icon/track-icon.png" alt="Track Icon">
              <span class="">Track Your Order</span>
            </a>
          </li>
        </ul>

        <!-- Right Menu -->
        <ul class="header-top__right flex-align flex-wrap gap-16 w-auto">
          <li class="d-lg-flex d-none">
            <a href="#shipping" class="text-white text-sm hover-text-decoration-underline">Order Tracking</a>
          </li>
          <li class="d-lg-flex d-none">
            <a href="javascript:void(0)" class="text-white text-sm hover-text-decoration-underline">About Us</a>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script setup>

// Composition API code
const countdown = ref({
  days: 35,
  hours: 14,
  minutes: 54,
  seconds: 28
})

const startCountdown = () => {
  setInterval(() => {
    if (countdown.value.seconds > 0) {
      countdown.value.seconds--
    } else {
      countdown.value.seconds = 59
      if (countdown.value.minutes > 0) {
        countdown.value.minutes--
      } else {
        countdown.value.minutes = 59
        if (countdown.value.hours > 0) {
          countdown.value.hours--
        } else {
          countdown.value.hours = 23
          if (countdown.value.days > 0) {
            countdown.value.days--
          } else {
            countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
          }
        }
      }
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})
</script>

<style scoped>
</style>