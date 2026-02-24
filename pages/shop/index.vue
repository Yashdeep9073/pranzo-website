<template>
  <div>
    <!-- Redirect to shop-all -->
    <div class="text-center py-80">
      <div class="spinner-border text-main-600" role="status">
        <span class="visually-hidden">Redirecting...</span>
      </div>
      <p class="mt-16">Redirecting to shop...</p>
    </div>
  </div>
</template>

<script setup>
// Redirect to shop-all
onMounted(() => {
  navigateTo('/shop/shop-all')
})
</script>
