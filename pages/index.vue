<script setup>
import HomeBanner from '~/components/homeBanner.vue'
import HomeBrand from '~/components/homeBrand.vue'
import HomeDailySell from '~/components/homeDailySell.vue'
import HomeDiscount from '~/components/homeDiscount.vue'
import HomeFeature from '~/components/homeFeature.vue'
import HomeFlash from '~/components/homeFlash.vue'
import HomeFlashm from '~/components/homeFlashm.vue'
import HomeHotdeal from '~/components/homeHotdeal.vue'
import HomeOffer from '~/components/homeOffer.vue'
import HomePromotion from '~/components/homePromotion.vue'
import HomeRecomend from '~/components/homeRecomend.vue'
import HomeShortProduct from '~/components/homeShortProduct.vue'
import ProductNews from '~/components/productNews.vue'
// import ProductGrid from '~/components/productGrid.vue'
// import ShopAll from '~/components/shopAll.vue'


useHead({
  title: "Shoppinga"  
})

// const { data: homeData } = await useFetch(
//   "https://kartmania-api.vibrantick.org/common/product/read"
// )

// const homeProducts = homeData.value?.data || []
</script>

<template>
  <div class="main-container">
   <!-- <div class="preloader">
    <img src="/assets/images/icon/preloader.gif" alt="">
  </div> -->
    <HomeBanner />
<HomeFeature class="pt-30 pb-60" />
    <HomePromotion />
    <HomeFlash />
    <HomeFlashm />
    <HomeRecomend  /> 
    <HomeOffer/>
    <HomeHotdeal/>
    <HomeDiscount/>
    <HomeShortProduct/>
    <HomeBrand/>
    <HomeDailySell/>
    <ProductNews/>


      <!-- <section class="product-section">
      <div class="container">
        <h2 class="section-title">Our Products</h2>
        <ProductGrid :products="homeProducts" /> 
      </div> 
    </section>  -->
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
 
.product-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 600;
}
</style>