<template>
  <section class="shop py-80 bg-color-three">
    <div class="container container-lg">
      <div class="row">
        <div class="col-12 text-center mb-48">
          <h2 class="h1 fw-bold mb-16">Continue Shopping</h2>
          <p class="text-gray-600">Discover more amazing products</p>
        </div>
      </div>
      
      <div class="row g-4">
        <!-- Add your shop/products component here -->
        <!-- Or link to categories -->
        <div class="col-md-3 col-6">
          <NuxtLink  
            to="/product/shop-all?category=women"
            class="category-card d-block text-center p-24 bg-white rounded-8 border border-gray-100 hover-border-main-600 transition-all"
          >
            <div class="icon-wrapper mb-16">
              <i class="ph ph-dress text-4xl text-main-600"></i>
            </div>
            <h6 class="text-lg fw-semibold mb-8">Women</h6>
            <p class="text-sm text-gray-600">Fashion & Apparel</p>
          </NuxtLink>
        </div>
        
        <div class="col-md-3 col-6">
          <NuxtLink 
            to="/product/shop-all?category=men"
            class="category-card d-block text-center p-24 bg-white rounded-8 border border-gray-100 hover-border-main-600 transition-all"
          >
            <div class="icon-wrapper mb-16">
              <i class="ph ph-tshirt text-4xl text-main-600"></i>
            </div>
            <h6 class="text-lg fw-semibold mb-8">Men</h6>
            <p class="text-sm text-gray-600">Clothing & Accessories</p>
          </NuxtLink>
        </div>
        
        <div class="col-md-3 col-6">
          <NuxtLink 
            to="/product/shop-all?category=electronics"
            class="category-card d-block text-center p-24 bg-white rounded-8 border border-gray-100 hover-border-main-600 transition-all"
          >
            <div class="icon-wrapper mb-16">
              <i class="ph ph-device-mobile text-4xl text-main-600"></i>
            </div>
            <h6 class="text-lg fw-semibold mb-8">Electronics</h6>
            <p class="text-sm text-gray-600">Gadgets & Devices</p>
          </NuxtLink>
        </div>
        
        <div class="col-md-3 col-6">
          <NuxtLink 
            to="/product/shop-all"
            class="category-card d-block text-center p-24 bg-white rounded-8 border border-gray-100 hover-border-main-600 transition-all"
          >
            <div class="icon-wrapper mb-16">
              <i class="ph ph-shopping-bag text-4xl text-main-600"></i>
            </div>
            <h6 class="text-lg fw-semibold mb-8">All Products</h6>
            <p class="text-sm text-gray-600">Browse Everything</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.transition-all {
  transition: all 0.3s ease;
}
</style>