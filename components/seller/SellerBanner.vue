<template>
  <section class="why-seller py-80">
    <div class="container">
      <!-- Section Heading -->
      <div class="section-heading text-center mx-auto mb-48">
        <h5 class="mb-16">{{ title }}</h5>
        <span class="text-gray-600">{{ subtitle }}</span>
      </div>

      <!-- Features Grid -->
      <div class="row gy-4 justify-content-center">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="col-lg-4 col-sm-6"
          :class="{ 'mt-lg-0': index > 0 }"
        >
          <div class="why-seller-item text-center h-100 p-32 rounded-16 hover-lift transition-all duration-300">
            <!-- Icon -->
            <span class="text-main-two-600 text-72 d-inline-flex mb-24 icon-wrapper">
              <i :class="feature.icon"></i>
            </span>
            
            <!-- Title -->
            <h6 class="my-28 fw-semibold">{{ feature.title }}</h6>
            
            <!-- Description -->
            <p class="text-gray-600 max-w-392 mx-auto line-height-lg">
              {{ feature.description }}
            </p>
            
            <!-- Optional Learn More Link -->
            <NuxtLink 
              v-if="feature.link"
              :to="feature.link"
              class="text-main-two-600 text-sm fw-medium mt-24 d-inline-flex align-items-center gap-8 hover-text-decoration-underline"
            >
              Learn more
              <i class="ph ph-arrow-right text-sm"></i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Optional CTA Button -->
      <div v-if="showCta" class="text-center mt-64">
        <NuxtLink 
          :to="ctaLink"
          class="btn btn-main-two py-16 px-40 rounded-8 hover-lift"
        >
          {{ ctaText }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props for customization
const props = defineProps({
  title: {
    type: String,
    default: 'Why become a seller on Marketpro?'
  },
  subtitle: {
    type: String,
    default: 'More than half the units sold in our stores from independent sellers.'
  },
  
  // Features data
  features: {
    type: Array,
    default: () => [
      {
        icon: 'ph ph-gift',
        title: 'Free Shipping',
        description: 'Explore insightful content that keeps you ahead of the curve and connected to the pulse of what\'s happening.',
        link: '/shipping-info'
      },
      {
        icon: 'ph ph-credit-card',
        title: 'Flexible Payment',
        description: 'Explore insightful content that keeps you ahead of the curve and connected to the pulse of what\'s happening.',
        link: '/payment-options'
      },
      {
        icon: 'ph ph-chats',
        title: 'Online Support',
        description: 'Explore insightful content that keeps you ahead of the curve and connected to the pulse of what\'s happening.',
        link: '/support'
      }
    ]
  },
  
  // CTA Configuration
  showCta: {
    type: Boolean,
    default: false
  },
  ctaText: {
    type: String,
    default: 'Start Selling Today'
  },
  ctaLink: {
    type: String,
    default: '/seller-registration'
  },
  
  // Styling options
  cardHoverEffect: {
    type: Boolean,
    default: true
  },
  showIcons: {
    type: Boolean,
    default: true
  }
})

// Computed properties
const gridColumns = computed(() => {
  const count = props.features.length
  if (count <= 3) return 'col-lg-4 col-sm-6'
  if (count === 4) return 'col-lg-3 col-sm-6'
  return 'col-lg-4 col-sm-6'
})

// Emit events if needed
const emit = defineEmits(['feature-click', 'cta-click'])

// Methods
const handleFeatureClick = (feature, index) => {
  emit('feature-click', { feature, index })
  
  // You can add additional logic here
  if (feature.link) {
    // Navigation will be handled by NuxtLink
  }
}

const handleCtaClick = () => {
  emit('cta-click')
}
</script>

<style scoped>
.why-seller {
  background-color: #ffffff;
}

/* Section heading styles */
.section-heading h5 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.section-heading span {
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Feature item styles */
.why-seller-item {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  height: 100%;
}

/* Hover effect */
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--main-two-600, #7c3aed);
}

/* Icon styles */
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
  transition: all 0.3s ease;
}

.why-seller-item:hover .icon-wrapper {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
  transform: scale(1.05);
}

/* Text styles */
.why-seller-item h6 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.why-seller-item p {
  font-size: 1rem;
  line-height: 1.6;
  color: #6b7280;
}

.max-w-392 {
  max-width: 392px;
}

.line-height-lg {
  line-height: 1.7;
}

/* Button styles */
.btn-main-two {
  background-color: var(--main-two-600, #7c3aed);
  color: white;
  border: none;
  font-weight: 500;
  padding: 16px 40px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-main-two:hover {
  background-color: var(--main-two-700, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
}

/* Responsive styles */
@media (max-width: 1199.98px) {
  .py-80 {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  
  .section-heading h5 {
    font-size: 1.75rem;
  }
}

@media (max-width: 991.98px) {
  .py-80 {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  
  .why-seller-item {
    padding: 24px;
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .text-72 {
    font-size: 48px;
  }
}

@media (max-width: 767.98px) {
  .py-80 {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .section-heading h5 {
    font-size: 1.5rem;
  }
  
  .section-heading span {
    font-size: 1rem;
  }
  
  .mb-48 {
    margin-bottom: 32px;
  }
  
  .why-seller-item {
    margin-bottom: 24px;
  }
  
  .why-seller-item:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 575.98px) {
  .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .why-seller-item {
    max-width: 100%;
    margin: 0 auto 24px;
  }
  
  .max-w-392 {
    max-width: 100%;
  }
}

/* Animation for items on scroll */
.why-seller-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.why-seller-item:nth-child(1) {
  animation-delay: 0.1s;
}

.why-seller-item:nth-child(2) {
  animation-delay: 0.2s;
}

.why-seller-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility improvements */
.why-seller-item:focus-within {
  outline: 2px solid var(--main-two-600);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .why-seller-item {
    border: 1px solid #ddd;
    box-shadow: none;
  }
  
  .hover-lift:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>

<!-- Alternative: Using slots for more flexibility -->
