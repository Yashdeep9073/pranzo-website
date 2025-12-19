
<template>
  <div>
    <h1>Products</h1>

    <div v-if="store.loading">Loading...</div>

    <div class="grid">
      <div 
        v-for="p in store.products" 
        :key="p.id"
        class="card"
        @click="goToDetail(p.id)"
      >
        <img :src="p.image" />
        <h3>{{ p.title }}</h3>
        <p>₹{{ p.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { useShopStore } from '../../store/shop'   // <-- IMPORTANT
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const store = useShopStore()
store.fetchProducts()
const goToDetail = (id) => router.push(`/product/${id}`)

</script>



<style>
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.card { padding: 20px; border: 1px solid #ddd; cursor: pointer; }
.card:hover { background: #fafafa; }
</style>
