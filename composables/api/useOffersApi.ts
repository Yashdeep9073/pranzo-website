import { ref, watchEffect } from 'vue'
import type { OffersApiResponse, Offer, OfferType } from '~/types/offers'
import { useApiEndpoints } from "~/utlis/endpoints"

export interface FetchOffersParams {
  offerType?: OfferType
  isFeatured?: boolean
  isActive?: boolean
  page?: number
  limit?: number
}

export const useOffersApi = (params: FetchOffersParams = {}) => {

  const api = useApiEndpoints()

  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  const fetchOffers = async () => {
    loading.value = true
    error.value = null

    try {
      const url = api.offers.list(params)

      const res = await $fetch<OffersApiResponse>(url)

      offers.value = res?.data ?? []
    }
    catch (e) {
      error.value = e
      offers.value = []
      console.error("❌ Offers fetch failed:", e)
    }
    finally {
      loading.value = false
    }
  }

  // auto run
  watchEffect(fetchOffers)

  return {
    offers,
    loading,
    error,
    refresh: fetchOffers
  }
}
