<script setup>
import { defineAsyncComponent } from "vue"

/* Light & critical components (direct load) */
import BannerStrip from "~/components/BannerStrip.vue"
import HomeBanner from "~/components/homeBanner.vue"
import HomeFeature from "~/components/homeFeature.vue"
import HomeFlashm from "~/components/homeFlashm.vue"
import LazySection from "~/components/LazySection.vue"

/* Heavy components (ASYNC) */
const HomePromotion = defineAsyncComponent(() => 
  import("~/components/homePromotion.vue")
)
const HomeFlash = defineAsyncComponent(() =>
  import("~/components/homeFlash.vue")
)
const HomeBrand = defineAsyncComponent(() =>
  import("~/components/homeBrand.vue")
)
const HomeCategory = defineAsyncComponent(() =>
  import("~/components/homeCategory.vue")
)
const HomeRecomend = defineAsyncComponent(() =>
  import("~/components/homeRecomend.vue")
)
const HomeOffer = defineAsyncComponent(() =>
  import("~/components/homeOffer.vue") 
)
const HomeHotdeal = defineAsyncComponent(() =>
  import("~/components/homeHotdeal.vue") 
)
const HomeDiscount = defineAsyncComponent(() =>
  import("~/components/homeDiscount.vue")
)
const HomeShortProduct = defineAsyncComponent(() =>   
  import("~/components/homeShortProduct.vue")
)
const HomeDailySell = defineAsyncComponent(() =>
  import("~/components/homeDailySell.vue")
)
const ProductNews = defineAsyncComponent(() =>
  import("~/components/productNews.vue")
)

useHead({ title: "Home" })
</script>

<template>
  <div class="main-container">
    <!-- FAST ABOVE THE FOLD -->
    <BannerStrip />
    <HomeBanner />
    <HomeFeature />

    <!-- BELOW THE FOLD (LAZY) -->
    <LazySection :component="HomePromotion"/>
    <LazySection :component="HomeFlash" />
    <LazySection :component="HomeBrand" />
    <LazySection :component="HomeFlashm" /> 
    <LazySection :component="HomeCategory" /> 
    <LazySection :component="HomeRecomend" /> 
    <LazySection :component="HomeOffer" /> 
    <LazySection :component="HomeHotdeal" /> 
    <LazySection :component="HomeDiscount" />
    <LazySection :component="HomeShortProduct" />
    <LazySection :component="HomeDailySell" /> 
    <LazySection :component="ProductNews" /> 
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
