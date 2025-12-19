<script setup>
import { onMounted } from "vue"
import { useProductStore } from "@/stores/useProductStore"

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})
</script>

<template>
  <div>
    <p v-if="store.loading">Loading...</p>

    <div v-else>
      <div v-for="p in store.filteredProducts" :key="p.id">
        <img :src="p.image" width="100" />
        <h4>{{ p.title }}</h4>
        <p>₹ {{ p.price }}</p>
        <small>{{ p.category }}</small>
      </div>
    </div>
  </div>
</template>
