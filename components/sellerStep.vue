<template>
  <section class="step py-80">
    <div class="position-relative z-1">
      <img
        src="/assets/images/shape/curve-line-shape.png"
        alt=""
        class="position-absolute top-0 inset-inline-end-0 z-n1 me-60 d-lg-block d-none"
      />
      <div class="container container-lg">
        <div class="row gy-4">
          <div class="col-lg-6">
            <div class="step-content">
              <div class="section-heading ms-auto text-end">
                <h5>Over $200k in potential benefits</h5>
                <span class="text-gray-600"
                  >Ready to sell? Launch your brand today with a powerful for new sellers and over $200k in potential benefits</span
                >
              </div>
              <div class="d-flex flex-column align-items-end gap-56">
                <div
                  v-for="(step, index) in steps"
                  :key="index"
                  class="d-flex align-items-center gap-32"
                >
                  <div class="text-end">
                    <h5 class="mb-8">Step {{ step.number }}</h5>
                    <p class="text-gray-600">{{ step.description }}</p>
                  </div>
                  <div class="w-90 h-90 flex-center bg-main-two-100 rounded-circle">
                    <h6
                      class="mb-0 w-60 h-60 bg-main-two-600 text-white d-flex align-items-center justify-content-center rounded-circle border border-5 border-white fw-medium"
                    >
                      {{ step.number }}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <img
                src="/assets/images/thumbs/steps.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Define steps data
const steps = [
  { number: '01', description: 'Create an account on our website. It is fast and free.' },
  { number: '02', description: 'Upload your products and the display in your shop.' },
  { number: '03', description: "We'll verify your account and then you can start selling!" }
]
</script>