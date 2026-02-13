import type { OffersApiResponse, Offer, OfferType } from '~/types/offers'

export interface FetchOffersParams {
  offerType?: OfferType
  isFeatured?: boolean
  isActive?: boolean
  page?: number
  limit?: number
}



export const useOffersApi = () => {
  const config = useRuntimeConfig()

  const fetchOffers = async (params: FetchOffersParams = {}
  ): Promise<Offer[]> => {
    // Build query parameters
    const queryParams = new URLSearchParams()
    if (params.offerType) queryParams.append('offerType', params.offerType)
    if (params.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured.toString())
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    const url = `http://localhost:3004/common/offers/read${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    
    console.log('🔍 [OffersApi] Fetching from:', url)

    const data = await $fetch<OffersApiResponse>(url)

    console.log('✅ [OffersApi] API Response received:', data)

    return data?.data ?? []
  }

  return { fetchOffers }
}
