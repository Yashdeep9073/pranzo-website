<template>
  <div ref="target" :style="{ minHeight: placeholderHeight }">
    <component v-if="visible" :is="component" />
    <div v-else-if="showPlaceholder" class="lazy-placeholder">
      <div class="lazy-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  component: {
    type: [Object, Function],
    required: true
  },
  rootMargin: {
    type: String,
    default: "200px"
  },
  placeholderHeight: {
    type: String,
    default: "200px"
  },
  showPlaceholder: {
    type: Boolean,
    default: true
  }
})

const visible = ref(false)
const target = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { 
      rootMargin: props.rootMargin,
      threshold: 0.1
    }
  )

  if (target.value) observer.observe(target.value)
})
</script>

<style scoped>
.lazy-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.lazy-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #CA2D52;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
