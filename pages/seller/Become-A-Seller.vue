<script setup lang="ts">
import Breadcrumbs from '~/components/navigation/Breadcrumbs.vue';
import CartShop from '~/components/cart/CartShop.vue';
import SellerBanner from '~/components/seller/SellerBanner.vue';
import SellerCounter from '~/components/seller/SellerCounter.vue';
import SellerStep from '~/components/seller/SellerStep.vue';
import SellerTestimonials from '~/components/seller/SellerTestimonials.vue';
import WhySeller from '~/components/seller/WhySeller.vue';
useHead({
  title: "seller"
})
</script>

<template>
  <div class="pt-20">

    <Breadcrumbs/>
    <WhySeller/>
    <SellerBanner/>
    <SellerCounter/>
    <SellerStep/>
    <SellerTestimonials/>
    <CartShop/>

  </div>
</template>

