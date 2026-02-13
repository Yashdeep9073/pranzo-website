<script setup>
import { defineAsyncComponent } from "vue"

/* Light & critical components (direct load) */
import BannerStrip from "~/components/ui/BannerStrip.vue"
import HomeBanner from "~/components/home/HomeBanner.vue"
import HomeFeature from "~/components/home/HomeFeature.vue"
import HomeFlashm from "~/components/home/HomeFlashm.vue"
import LazySection from "~/components/ui/LazySection.vue"

/* Heavy components (ASYNC) */
const HomePromotion = defineAsyncComponent(() => 
  import("~/components/home/HomePromotion.vue")
)
const HomeFlash = defineAsyncComponent(() =>
  import("~/components/home/HomeFlash.vue")
)
const HomeBrand = defineAsyncComponent(() =>
  import("~/components/home/HomeBrand.vue")
)
const HomeCategory = defineAsyncComponent(() =>
  import("~/components/home/HomeCategory.vue")
)
const HomeRecomend = defineAsyncComponent(() =>
  import("~/components/home/HomeRecomend.vue")
)
const HomeOffer = defineAsyncComponent(() =>
  import("~/components/home/HomeOffer.vue") 
)
const HomeHotdeal = defineAsyncComponent(() =>
  import("~/components/home/HomeHotdeal.vue") 
)
const HomeDiscount = defineAsyncComponent(() =>
  import("~/components/home/HomeDiscount.vue")
)
const HomeShortProduct = defineAsyncComponent(() =>   
  import("~/components/home/HomeShortProduct.vue")
)
const HomeDailySell = defineAsyncComponent(() =>
  import("~/components/home/HomeDailySell.vue")
)
const ProductNews = defineAsyncComponent(() =>
  import("~/components/product/ProductNews.vue")
)
const HomeOffersGrid = defineAsyncComponent(() =>
  import("~/components/home/HomeOffersGrid.vue")
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
    <LazySection :component="HomeOffersGrid" />
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

