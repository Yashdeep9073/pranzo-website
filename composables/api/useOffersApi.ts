import { ref, readonly } from 'vue'
import type { OffersApiResponse, Offer, OfferType } from '~/types/offers'
import { useApiEndpoints } from "~/utils/endpoints"
import { useToast } from 'vue-toastification'

export interface FetchOffersParams {
  offerType?: OfferType
  isFeatured?: boolean
  isActive?: boolean
  page?: number
  limit?: number
  category?: string
}

export const useOffersApi = (initialParams: FetchOffersParams = {}) => {
  const api = useApiEndpoints()
  const toast = useToast()

  // State
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentParams = ref<FetchOffersParams>(initialParams)

  // Helper mapper
  const mapApiOfferToOffer = (apiOffer: any): Offer => ({
    id: apiOffer.id,
    name: apiOffer.name,
    slug: apiOffer.slug || apiOffer.name?.toLowerCase().replace(/\s+/g, '-') || '',
    description: apiOffer.description || '',
    offerType: apiOffer.offerType || 'OTHER',
    discountType: apiOffer.discountType || 'PERCENTAGE',
    discountValue: apiOffer.discountValue || 0,
    startDate: apiOffer.startDate || new Date().toISOString(),
    endDate: apiOffer.endDate || new Date().toISOString(),
    isActive: apiOffer.isActive ?? true,
    isFeatured: apiOffer.isFeatured ?? false,
    isDeleted: apiOffer.isDeleted ?? false,
    priority: apiOffer.priority || 0,
    createdAt: apiOffer.createdAt || new Date().toISOString(),
    updatedAt: apiOffer.updatedAt || new Date().toISOString(),
    products: apiOffer.products || [],
    OfferProducts: apiOffer.OfferProducts || [],
    images: apiOffer.images || [],
    _count: apiOffer._count || { products: 0, images: 0 },
    status: apiOffer.status || 'ACTIVE',
    timeRemaining: apiOffer.timeRemaining || null,
    startsIn: apiOffer.startsIn || null
  })

  // 🔥 Single fetch function (no duplication)
  const fetchOffers = async (params: FetchOffersParams = {}) => {
    loading.value = true
    error.value = null

    try {
      currentParams.value = { ...currentParams.value, ...params }

      const url = api.offers.list({
        ...currentParams.value,
        isActive: true
      })

      console.log('📡 Fetching offers with params:', currentParams.value)

      const res = await $fetch<OffersApiResponse>(url)
      const apiOffers = res?.data ?? []
      offers.value = apiOffers.map(mapApiOfferToOffer)

      console.log('✅ Offers fetched:', offers.value.length)

    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch offers'
      offers.value = []

      console.error('❌ Fetch failed:', e)

      if (e?.message?.includes('502')) {
        toast.error('Server temporarily unavailable')
      } else {
        toast.error('Failed to load offers')
      }
    } finally {
      loading.value = false
    }
  }

  return {
    offers,
    loading: readonly(loading),
    error: readonly(error),
    currentParams: readonly(currentParams),

    fetchOffers
  }
}