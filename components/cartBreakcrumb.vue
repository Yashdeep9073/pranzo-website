<template>
  <div class="breadcrumb mb-0 py-26 bg-main-two-50">
    <div class="container container-lg">
      <div class="breadcrumb-wrapper flex-between flex-wrap gap-16">
        <!-- Page Title -->
        <h6 class="mb-0">{{ title }}</h6>
        
        <!-- Breadcrumb Navigation -->
        <ul class="flex-align gap-8 flex-wrap">
          <!-- Home Link -->
          <li class="text-sm">
            <NuxtLink to="/" class="text-gray-900 flex-align gap-8 hover-text-main-600">
              <i class="ph ph-house"></i>
              Home
            </NuxtLink>
          </li>
          
          <!-- Breadcrumb Items -->
          <template v-for="(item, index) in items" :key="item.path">
            <!-- Separator -->
            <li class="flex-align" v-if="index < items.length">
              <i class="ph ph-caret-right"></i>
            </li>
            
            <!-- Breadcrumb Item -->
            <li class="text-sm" :class="{ 'text-main-600': isLastItem(index) }">
              <NuxtLink 
                v-if="!isLastItem(index)" 
                :to="item.path" 
                class="text-gray-900 hover-text-main-600"
              >
                {{ item.label }}
              </NuxtLink>
              <span v-else class="text-main-600">
                {{ item.label }}
              </span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  title: {
    type: String,
    default: 'Cart'
  },
  items: {
    type: Array,
    default: () => [
      { label: 'Product Cart', path: '/cart' }
    ]
  }
})

// Check if item is the last one
const isLastItem = (index) => {
  return index === props.items.length - 1
}
</script>

<style scoped>
/* Breadcrumb styles */
.breadcrumb {
  background-color: #f8fafc;
}

.breadcrumb-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* List styles */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

/* Link styles */
a {
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

a:hover {
  color: #3b82f6;
}

/* Text styles */
.text-sm {
  font-size: 14px;
}

.text-gray-900 {
  color: #111827;
}

.text-main-600 {
  color: #3b82f6;
}

.hover-text-main-600:hover {
  color: #3b82f6;
}

.mb-0 {
  margin-bottom: 0;
}

/* Flex utilities */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-align {
  display: flex;
  align-items: center;
}

.gap-8 {
  gap: 8px;
}

.gap-16 {
  gap: 16px;
}

/* Container */
.container-lg {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Spacing */
.py-26 {
  padding-top: 26px;
  padding-bottom: 26px;
}

/* Icon colors */
.ph {
  color: inherit;
}

/* Responsive */
@media (max-width: 768px) {
  .breadcrumb-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  ul {
    flex-wrap: wrap;
    row-gap: 4px;
  }
}
</style>