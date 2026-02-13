<template>
  <div class="category-dropdown-wrapper position-relative">
    <button
      type="button"
      class="category-button d-flex align-items-center gap-12 text-white bg-success-600 px-20 py-16 rounded-6 hover-bg-success-700 transition-2"
      @click="toggleDropdown"
      @blur="onBlur"
    >
      <span class="text-xl line-height-1"><i class="ph ph-squares-four"></i></span>
      <span class="">Browse Categories</span>
      <span class="line-height-1 icon transition-2" :class="{ 'rotate-180': isOpen }">
        <i class="ph-bold ph-caret-down"></i>
      </span>
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="isOpen"
      class="category-dropdown border border-success-200 shadow bg-white p-16 rounded-16 w-100 max-w-472 position-absolute inset-block-start-100 inset-inline-start-0 z-99 transition-2"
      @mouseenter="keepOpen = true"
      @mouseleave="closeDropdown"
    >
      <div class="d-grid grid-cols-3-repeat gap-4 max-h-350 overflow-y-auto">
        <a
          v-for="category in categories"
          :key="category.id"
          :href="category.link"
          class="py-16 px-8 rounded-8 hover-bg-main-50 d-flex flex-column align-items-center text-center border border-white hover-border-main-100"
          @click.prevent="navigateTo(category.link)"
        >
          <span class="">
            <img :src="category.icon" :alt="category.name" class="w-40" />
          </span>
          <span class="fw-semibold text-heading mt-16 text-sm">{{ category.name }}</span>
        </a>
      </div>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '#imports'

const router = useRouter()
const isOpen = ref(false)
const keepOpen = ref(false)

const categories = [
  { id: 1, name: 'Vegetables', link: '/shop', icon: '/assets/images/icon/category-1.png' },
  { id: 2, name: 'Milk & Cake', link: '/shop', icon: '/assets/images/icon/category-2.png' },
  { id: 3, name: 'Grocery', link: '/shop', icon: '/assets/images/icon/category-3.png' },
  { id: 4, name: 'Beauty', link: '/shop', icon: '/assets/images/icon/category-4.png' },
  { id: 5, name: 'Wines & Drinks', link: '/shop', icon: '/assets/images/icon/category-5.png' },
  { id: 6, name: 'Snacks', link: '/shop', icon: '/assets/images/icon/category-6.png' },
  { id: 7, name: 'Juice', link: '/shop', icon: '/assets/images/icon/category-7.png' },
  { id: 8, name: 'Fruits', link: '/shop', icon: '/assets/images/icon/category-8.png' },
  { id: 9, name: 'Tea & Coffee', link: '/shop', icon: '/assets/images/icon/category-9.png' },
]

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  keepOpen.value = isOpen.value
}

const closeDropdown = () => {
  keepOpen.value = false
  setTimeout(() => {
    if (!keepOpen.value) {
      isOpen.value = false
    }
  }, 100)
}

const onBlur = () => {
  setTimeout(() => {
    if (!keepOpen.value) {
      isOpen.value = false
    }
  }, 100)
}

const navigateTo = (link) => {
  isOpen.value = false
  keepOpen.value = false
  router.push(link)
}
</script> 

<style scoped> 
.category-dropdown-wrapper {
  display: inline-block;
  width: 400px;
  max-width: 400px;
  position: relative;
}

.category-dropdown {
  margin-top: 4px;
  animation: fadeIn 0.2s ease-in-out;

}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease-in-out;

}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
</style>