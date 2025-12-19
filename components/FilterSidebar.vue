<script setup>
import { useProductStore } from "../store/useCatalogStore"
const store = useProductStore()
</script>

<template>
  <div>
    <h3>Category</h3>
    <button @click="store.setCategory('electronics')">Electronics</button>
    <button @click="store.setCategory('jewelery')">Jewelery</button>
    <button @click="store.setCategory(`men's clothing`)">
      Men's
    </button>

    <h3>Sort</h3>
    <button @click="store.setSort('price-low')">
      Price Low → High
    </button>
    <button @click="store.setSort('price-high')">
      Price High → Low
    </button>

    <button @click="store.clearAll()">Clear All</button>
  </div>
</template>
