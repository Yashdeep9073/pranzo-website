<template>
  <div class="offers-page">
    <!-- Header -->
    <section class="offers-header py-2">
      <div class="container container-lg">
        <div class="text-center mb-2">
          <h1 class="page-title mb-2">Exclusive Offers</h1>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="offers-content py-2">
      <div class="container container-lg">
        <OffersCategoryFilter :categories="categories" :offers="offers" :loading="loading" :error="error"
          @category-selected="handleCategorySelected" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useHead } from '#app'

// Components
import OffersCategoryFilter from '~/components/offers/OffersCategoryFilter.vue'

// Composable
import { useOffersApi } from '~/composables/api/useOffersApi'

// Types
interface Category {
  id: number
  name: string
  slug: string
  image?: string
  subcategories?: any[]
  offers?: any[]
}

// State
const categories = ref<Category[]>([])
const selectedCategory = ref<Category | null>(null)

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

// ✅ Use clean composable
const { offers, loading, error, fetchOffers } = useOffersApi()

// 📦 Load categories
const loadCategories = async () => {
  try {
    console.log('📂 Loading categories...')

    const res = await fetch(`${API_BASE}/common/product-category/read`)
    if (!res.ok) throw new Error('Failed to load categories')

    const result = await res.json()

    categories.value = (result.data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name || cat.title,
      slug:
        cat.slug ||
        (cat.name
          ? cat.name.toLowerCase().replace(/\s+/g, '-')
          : ''),
      image: cat.image,
      subcategories: cat.subcategories || [],
      offers: cat.offers || []
    }))

    console.log('✅ Categories loaded:', categories.value.length)

  } catch (err) {
    console.error('❌ Failed to load categories:', err)

    // fallback (optional)
    categories.value = []
  }
}

// 🎯 Handle category click
const handleCategorySelected = (category: Category | null) => {
  console.log('🎯 Selected category:', category?.slug)

  selectedCategory.value = category

  if (category) {
    fetchOffers({ category: category.slug })
  } else {
    fetchOffers({})
  }
}

// 🚀 Init
onMounted(async () => {
  console.log('🚀 Offers page mounted')

  await loadCategories()

  // auto-select first category (best UX)
  if (categories.value.length > 0) {
    const first = categories.value[0]
    selectedCategory.value = first

    await fetchOffers({ category: first.slug })
  } else {
    await fetchOffers({})
  }
})

// SEO
useHead({
  title: 'Exclusive Offers - Amazing Deals & Discounts',
  meta: [
    {
      name: 'description',
      content:
        'Discover amazing deals across all categories. Fashion, electronics, mobiles and more with exclusive discounts.'
    }
  ]
})
</script>

<style scoped>
.offers-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.offers-category-filter {
  min-height: 400px;
  margin-top: -1rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
}

.offers-content {
  padding-top: 0.5rem;
}
</style>