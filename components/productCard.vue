<script setup>
  import { toKebabCase } from '~/utlis/toKebabCase';
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
     <NuxtLink
                        :to="`/product/${toKebabCase(product.name)}`"
                        class="d-block h-100"
                      >
    <img :src="product.thumbnail" class="w-full h-40 object-cover rounded" />
    <h2 class="mt-3 font-semibold text-lg">{{ product.name }}</h2>
    <p class="text-sm text-gray-600">₹ {{ product.price }}</p>
    
  </NuxtLink>
</template>