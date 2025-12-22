<template>
  <div class="breadcrumb-area pt-24 pb-24 bg-color-three">
    <div class="container container-lg">
      <div class="row">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <NuxtLink to="/" class="text-neutral-600 hover-text-main-600">
                  Home
                </NuxtLink>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <span class="text-main-600">Wishlist</span>
              </li>
            </ol>
          </nav>
          
          <h1 class="h2 fw-bold mt-16 mb-0">My Wishlist</h1>
          <p class="text-gray-600 mt-8 mb-0">Manage your favorite products</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.breadcrumb-area {
  background-color: #f8f9fa;
}
</style>