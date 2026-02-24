import { defineStore } from 'pinia'
import { useOffersApi } from '~/composables/api/useOffersApi'
import type { Offer } from '~/types/offers'

export const useOffersStore = defineStore('offers', () => {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false) // 👈 prevents refetch

  const { offers: apiOffers, loading: apiLoading, error: apiError, refresh: fetchOffers } = useOffersApi()

  const loadOffers = async () => {
    if (loaded.value) return // 🛑 singleton behavior

    loading.value = true
    error.value = null

    try {
      await fetchOffers()
      offers.value = apiOffers.value
      loaded.value = true
    } catch (err: any) {
      error.value = err.message ?? 'Failed to load offers'
    } finally {
      loading.value = false
    }
  }

  // ---- DERIVED STATE ----
  const activeOffers = computed(() =>
    offers.value.filter(o => o.isActive)
  )

  const featuredOffers = computed(() =>
    offers.value.filter(o => o.isFeatured)
  )

  const offersByType = computed(() => {
    return offers.value.reduce<Record<string, Offer[]>>((acc, offer) => {
      const type = offer.offerType || 'OTHER'
      acc[type] ||= []
      acc[type].push(offer)
      return acc
    }, {})
  })

  return {
    offers,
    loading,
    error,
    loadOffers,
    activeOffers,
    featuredOffers,
    offersByType
  }
})
