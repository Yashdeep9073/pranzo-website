<template>
  <section class="counter">
    <div class="container container-lg">
      <div class="row justify-content-center">
        <div class="col-xxl-11">
          <div class="bg-neutral-600 rounded-16 px-xxl-5 px-xl-4">
            <div class="row gy-lg-0 gy-4 line-wrapper">
              <div
                v-for="counter in counters"
                :key="counter.label"
                class="col-lg-3 col-sm-6 col-xs-6"
              >
                <div class="counter-item text-center py-100 px-8">
                  <h3 class="text-main-600 counter mb-8 fw-semibold">
                    {{ counter.number }}
                  </h3>
                  <p class="text-white text-xl font-heading-two fw-semibold">
                    {{ counter.label }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Define counters data
const counters = [
  { number: '185+', label: 'Store around the world' },
  { number: '152K', label: 'Product Sold' },
  { number: '15K+', label: 'Registered Users' },
  { number: '2K+', label: 'Top Brands Available in store' }
]
</script>