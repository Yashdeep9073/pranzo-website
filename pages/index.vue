<script setup>
import { defineAsyncComponent, ref, watch, onMounted, computed } from "vue"
import { useProductStore } from "~/store/useProductStore"
import { formatStringWithDash } from "~/utils/format"

/* Light & critical components (direct load) */
import BannerStrip from "~/components/ui/BannerStrip.vue"
import HomeBanner from "~/components/home/HomeBanner.vue"
import HomeFeature from "~/components/home/HomeFeature.vue"
import HomeFlashm from "~/components/home/HomeFlashm.vue"
import LazySection from "~/components/ui/LazySection.vue"

/* Heavy components (ASYNC with error handling) */
const HomePromotion = defineAsyncComponent({ 
  loader: () => import("~/components/home/HomePromotion.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeFlash = defineAsyncComponent({
  loader: () => import("~/components/home/HomeFlash.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeBrand = defineAsyncComponent({
  loader: () => import("~/components/home/HomeBrand.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeCategory = defineAsyncComponent({
  loader: () => import("~/components/home/HomeCategory.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeRecomend = defineAsyncComponent({
  loader: () => import("~/components/home/HomeRecomend.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeOffer = defineAsyncComponent({
  loader: () => import("~/components/home/HomeOffer.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeHotdeal = defineAsyncComponent({
  loader: () => import("~/components/home/HomeHotdeal.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeDiscount = defineAsyncComponent({
  loader: () => import("~/components/home/HomeDiscount.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeShortProduct = defineAsyncComponent({   
  loader: () => import("~/components/home/HomeShortProduct.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeDailySell = defineAsyncComponent({
  loader: () => import("~/components/home/HomeDailySell.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const ProductNews = defineAsyncComponent({
  loader: () => import("~/components/product/ProductNews.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 10000 // Increased timeout to 10 seconds
})
const HomeOffersGrid = defineAsyncComponent({
  loader: () => import("~/components/home/HomeOffersGrid.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})

const route = useRoute()
const productStore = useProductStore()
const mobileHomeSearch = ref("")
const mobileHomeSearchResults = ref([])
const showMobileHomeSearchResults = ref(false)
const mobileHomeSearchLoading = ref(false)
const mobileHomeSearchInitialized = ref(false)
let mobileHomeSearchTimer = null

const searchableProducts = computed(() => {
  return Array.isArray(productStore.products) ? productStore.products : []
})

const syncMobileSearchFromRoute = () => {
  const searchQuery = route.query.search
  const searchValue = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery
  mobileHomeSearch.value = typeof searchValue === "string" ? searchValue : ""
}

const getProductBrand = (product) => {
  return product?.brand?.name || product?.mainProduct?.brandName || ""
}

const getProductImage = (product) => {
  const images = product?.mainProduct?.images || []
  const primary = images.find(img => img?.isPrimary)
  const imageUrl = primary?.imageUrl || images[0]?.imageUrl

  if (!imageUrl) return "/assets/images/placeholder.jpg"
  if (String(imageUrl).startsWith("http")) return imageUrl
  if (String(imageUrl).startsWith("/")) return `https://kartmania-api.vibrantick.org${imageUrl}`
  return `https://kartmania-api.vibrantick.org/${imageUrl}`
}

const getProductPrice = (product) => {
  const base = Number(product?.mainProduct?.price || 0)
  const discount = Number(product?.mainProduct?.discountValue || 0)
  return discount > 0 ? Math.round(base * (1 - discount / 100)) : base
}

const searchTextForProduct = (product) => {
  const name = (product?.name || product?.mainProduct?.name || "").toString()
  const brand = getProductBrand(product).toString()
  const category = (product?.category?.name || "").toString()
  const description = (product?.mainProduct?.description || "").toString()
  return `${name} ${brand} ${category} ${description}`.toLowerCase()
}

const performMobileHomeSearch = () => {
  const term = mobileHomeSearch.value.trim().toLowerCase()
  if (!term) {
    mobileHomeSearchResults.value = []
    showMobileHomeSearchResults.value = false
    return
  }

  const filtered = searchableProducts.value.filter((product) => {
    return searchTextForProduct(product).includes(term)
  })

  mobileHomeSearchResults.value = filtered.slice(0, 8)
  showMobileHomeSearchResults.value = true
}

const submitMobileHomeSearch = () => {
  // Do not redirect; only search in place.
  performMobileHomeSearch()
}

const openProductFromSearch = (product) => {
  const productName = formatStringWithDash(product?.name || product?.mainProduct?.name || "product")
  const groupId = product?.groupId || product?.id
  if (!groupId) return

  showMobileHomeSearchResults.value = false
  navigateTo(`/shop-all/${productName}/${groupId}`)
}

const initMobileHomeSearchData = async () => {
  if (mobileHomeSearchInitialized.value) return
  mobileHomeSearchLoading.value = true

  try {
    await productStore.fetchProducts({
      search: "",
      category: "",
      color: "",
      size: "",
      brand: "",
      sortBy: "popularity",
      page: 1,
      limit: 1000,
      minPrice: 0,
      maxPrice: 1000000
    })
    mobileHomeSearchInitialized.value = true
  } finally {
    mobileHomeSearchLoading.value = false
  }
}

onMounted(() => {
  syncMobileSearchFromRoute()
  initMobileHomeSearchData()
})

watch(
  () => route.query.search,
  () => {
    syncMobileSearchFromRoute()
  }
)

watch(mobileHomeSearch, () => {
  if (mobileHomeSearchTimer) {
    clearTimeout(mobileHomeSearchTimer)
  }

  mobileHomeSearchTimer = setTimeout(() => {
    performMobileHomeSearch()
  }, 160)
})

useHead({ title: "Home" })
</script>

<template>
  <div class="main-container">
    <!-- FAST ABOVE THE FOLD -->
    <form class="mobile-home-search" @submit.prevent="submitMobileHomeSearch">
      <div class="mobile-home-search__field">
        <input
          v-model="mobileHomeSearch"
          type="text"
          class="mobile-home-search__input"
          placeholder="Search product or brand..."
          aria-label="Search products"
          @focus="showMobileHomeSearchResults = mobileHomeSearchResults.length > 0"
        />
        <button type="submit" class="mobile-home-search__button" aria-label="Search">
          <span class="mobile-home-search__icon"></span>
        </button>

        <div
          v-if="showMobileHomeSearchResults && mobileHomeSearch.trim()"
          class="mobile-home-search__results"
        >
          <div v-if="mobileHomeSearchLoading" class="mobile-home-search__state">Searching...</div>
          <template v-else-if="mobileHomeSearchResults.length > 0">
            <button
              v-for="product in mobileHomeSearchResults"
              :key="product.groupId || product.id"
              type="button"
              class="mobile-home-search__item"
              @click="openProductFromSearch(product)"
            >
              <img
                :src="getProductImage(product)"
                :alt="product.name || product.mainProduct?.name || 'Product'"
                class="mobile-home-search__item-image"
              />
              <span class="mobile-home-search__item-info">
                <span class="mobile-home-search__item-title">{{ product.name || product.mainProduct?.name }}</span>
                <span class="mobile-home-search__item-meta">
                  {{ getProductBrand(product) || "Brand" }} • ₹{{ getProductPrice(product).toLocaleString("en-IN") }}
                </span>
              </span>
            </button>
          </template>
          <div v-else class="mobile-home-search__state">No matching products found</div>
        </div>
      </div>
    </form>

    <BannerStrip class="banner-strip-section" />
    <HomeBanner class="home-banner-section" />
    <HomeFeature class="home-feature-section" />

    <!-- BELOW THE FOLD (LAZY) -->
    <LazySection :component="HomePromotion" class="home-promotion-section" root-margin="50px" />
    <LazySection :component="HomeFlash" class="home-flash-section" root-margin="50px" />
    <LazySection :component="HomeBrand" class="home-brand-section" root-margin="50px" />
    <LazySection :component="HomeFlashm" class="home-flashm-section" root-margin="50px" /> 
    <LazySection :component="HomeOffersGrid" class="home-offers-grid-section" root-margin="50px" />
    <LazySection :component="HomeCategory" class="home-category-section" root-margin="50px" /> 
    <LazySection :component="HomeRecomend" class="home-recomend-section" root-margin="50px" /> 
    <!-- <LazySection :component="HomeOffer" class="home-offer-section" root-margin="50px" />  -->
    <LazySection :component="HomeHotdeal" class="home-hotdeal-section" root-margin="50px" /> 
    <LazySection :component="HomeDiscount" class="home-discount-section" root-margin="50px" />
    <LazySection :component="HomeShortProduct" class="home-short-product-section" root-margin="50px" />
    <LazySection :component="HomeDailySell" class="home-daily-sell-section" root-margin="50px" /> 
    <LazySection :component="ProductNews" class="product-news-section" root-margin="50px" /> 
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.mobile-home-search {
  display: none;
  z-index: 2;
}

/* Add consistent spacing between sections */
.main-container > * {
  margin-bottom: 3rem; /* 48px spacing between sections */
}

.main-container > *:last-child {
  margin-bottom: 0;
}

/* Tighten spacing specifically between top promo strip and hero banner */
.banner-strip-section {
  margin-bottom: 0 !important;
}

.home-banner-section {
  margin-bottom: 0 !important;
}
.home-feature-section {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.home-promotion-section {
  margin-bottom: 0 !important;
}
.home-flash-section {
  margin-bottom: 0 !important;
}
.home-brand-section {
  margin-bottom: 0 !important;
}
.home-flashm-section {
  margin-bottom: 0 !important;
}
.home-offers-grid-section {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.home-category-section {
  margin-bottom: 0 !important;
}
.home-recomend-section {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.home-offer-section {
  margin-bottom: 0 !important;
}
.home-hotdeal-section {
  margin-bottom: 0 !important;
}
.home-discount-section {
  margin-bottom: 0 !important;
}
.home-short-product-section {
  margin-bottom: 40px !important;
}
.home-daily-sell-section {
  margin-bottom: 40px !important;
}
.product-news-section {
  margin-bottom: 0 !important;
}



/* Reduce spacing for smaller screens */
@media (max-width: 768px) {
  .main-container > * {
    margin-bottom: 2rem; /* 32px on mobile */
  }
}

@media (max-width: 576px) {
  .main-container > * {
    margin-bottom: 1.5rem; /* 24px on small mobile */
  }
}

@media (max-width: 1024px) {
  .mobile-home-search {
    display: flex !important;
    align-items: center;
    padding: 0 12px;
    margin: 78px 0 12px;
    width: 100%;
    position: relative;
    z-index: 900;
  }

  .banner-strip-section :deep(.banner-wrapper) {
    margin-top: 10px !important;
  }

  .mobile-home-search__field {
    position: relative;
    width: 100%;
    z-index: 901;
  }

  .mobile-home-search__input {
    width: 100%;
    height: 44px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    padding: 0 44px 0 12px;
    font-size: 14px;
    outline: none;
  }

  .mobile-home-search__input:focus {
    border-color: #CA2D52;
    box-shadow: 0 0 0 2px rgba(202, 45, 82, 0.15);
  }

  .mobile-home-search__button {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 8px;
    padding: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-home-search__icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    border: 2px solid #6b7280;
    border-radius: 50%;
    position: relative;
  }

  .mobile-home-search__icon::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 2px;
    background: #6b7280;
    bottom: -4px;
    right: -5px;
    transform: rotate(45deg);
    border-radius: 2px;
  }

  .mobile-home-search__results {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    max-height: 320px;
    overflow-y: auto;
    z-index: 902;
  }

  .mobile-home-search__state {
    padding: 12px;
    font-size: 13px;
    color: #6b7280;
  }

  .mobile-home-search__item {
    width: 100%;
    border: 0;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    text-align: left;
  }

  .mobile-home-search__item + .mobile-home-search__item {
    border-top: 1px solid #f3f4f6;
  }

  .mobile-home-search__item-image {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .mobile-home-search__item-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .mobile-home-search__item-title {
    font-size: 13px;
    color: #111827;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-home-search__item-meta {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<style>
@media (max-width: 768px) {
  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  .main-container {
    width: 100%;
    overflow-x: hidden;
  }

  .main-container > * {
    min-width: 0;
    max-width: 100%;
  }

  .main-container img,
  .main-container video,
  .main-container canvas,
  .main-container svg {
    max-width: 100%;
    height: auto;
  }
}
</style>
