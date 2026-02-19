<template>
  <div class="product-detail-page">
    <!-- Product detail page content -->
    <div v-if="product" class="container">
      <h1>{{ product.name }}</h1>
      <p>Product ID: {{ $route.params.id }}</p>
      <p>Price: ₹{{ product.price }}</p>
      <p>{{ product.description }}</p>
    </div>
    <div v-else class="container">
      <h1>Loading product...</h1>
    </div>
  </div>
</template>

<script setup>
// Get the product ID from the route params
const productId = computed(() => $route.params.id)

// Mock product data - replace with actual API call
const product = ref(null)

// Fetch product data based on the ID
onMounted(async () => {
  try {
    // Replace with actual API call
    // const { data } = await $fetch(`/api/products/${productId.value}`)
    // product.value = data
    
    // Mock data for now
    product.value = {
      id: productId.value,
      name: `Product ${productId.value}`,
      price: '999',
      description: 'This is a placeholder product description.'
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  }
})
</script>

<style scoped>
.product-detail-page {
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #666;
}
</style>
