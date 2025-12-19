<script setup lang="ts">
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import CartShop from '~/components/cartShop.vue';
import SellerBanner from '~/components/sellerBanner.vue';
import SellerCounter from '~/components/sellerCounter.vue';
import SellerStep from '~/components/sellerStep.vue';
import SellerTestimonials from '~/components/sellerTestimonials.vue';
import WhySeller from '~/components/whySeller.vue';

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
