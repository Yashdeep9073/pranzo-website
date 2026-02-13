<template>
  <div ref="target">
    <component v-if="visible" :is="component" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  component: {
    type: [Object, Function],
    required: true
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
    { rootMargin: "200px" } 
  )

  if (target.value) observer.observe(target.value)
})
</script>
