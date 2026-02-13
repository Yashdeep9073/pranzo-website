import { ref, computed } from 'vue'
import type { OffersApiResponse, Offer, OfferImage } from '~/types/offers'

export interface ProductImage {
  id: number
  productId: number
  imageUrl: string
  altText: string | null
  isPrimary: boolean
  createdAt: string
}

export interface Product {
  id: number
  name: string
  sku: string
  price: string
  images: ProductImage[]
  groupId: number | null
}

export interface ProductItem {
  offerId: number
  productId: number
  createdAt: string
  product: Product | null
}

// Mock data for fallback when API is not available
const getMockOffers = (): Offer[] => {
  console.log('🔄 [Offers] USING MOCK DATA - API FAILED')
  return [
    {
      id: 1,
      name: "Flash Sale - Electronics",
      slug: "flash-sale-electronics",
      description: "Amazing deals on electronics",
      offerType: "FLASH_SALE",
      discountType: "PERCENTAGE",
      discountValue: 30,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      isActive: true,
      isFeatured: true,
      priority: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      products: [
        {
          offerId: 1,
          productId: 1,
          createdAt: new Date().toISOString(),
          product: {
            id: 1,
            name: "Smartphone",
            sku: "PHONE001",
            price: "299.99",
            images: [],
            groupId: null
          }
        },
        {
          offerId: 1,
          productId: 2,
          createdAt: new Date().toISOString(),
          product: {
            id: 2,
            name: "Laptop",
            sku: "LAPTOP001",
            price: "899.99",
            images: [],
            groupId: null
          }
        },
        {
          offerId: 1,
          productId: 3,
          createdAt: new Date().toISOString(),
          product: {
            id: 3,
            name: "Headphones",
            sku: "HEAD001",
            price: "149.99",
            images: [],
            groupId: null
          }
        }
      ],
      images: [],
      _count: {
        products: 3,
        images: 2
      },
      status: "ACTIVE" as const,
      timeRemaining: 86400000, // 24 hours in ms
      startsIn: null
    }
  ]
}

export const useOffers = () => {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all offers from API
  const fetchAllOffers = async (productType?: string) => {
    loading.value = true
    error.value = null

    try {
      // Use the direct endpoint you specified
      let url = 'http://localhost:3004/common/offers/read'
      
      // Build query parameters
      const params: any = {}
      if (productType) {
        params.offerType = productType
      }

      console.log('🔍 [Offers] Fetching all offers from:', `${url}?${new URLSearchParams(params).toString()}`)

      const data = await $fetch<OffersApiResponse>(url, {
        query: params
      })

      console.log('✅ [Offers] API Response received:', data)

      if (data && data.data && Array.isArray(data.data)) {
        offers.value = data.data.filter((offer: Offer) => offer.isActive)
        console.log(`✅ [Offers] Fetched ${offers.value.length} active offers:`, offers.value)
      } else {
        offers.value = []
        console.log('⚠️ [Offers] No data found in response')
      }
    } catch (err: any) {
      console.error('❌ [Offers] Error fetching offers:', err)
      error.value = err.message
      
      // Fallback to mock data when API fails
      console.log('🔄 [Offers] Using mock data as fallback')
      offers.value = getMockOffers()
    } finally {
      loading.value = false
    }
  }

  // Get offers grouped by type
  const offersByType = computed(() => {
    const grouped: { [key: string]: Offer[] } = {}

    offers.value.forEach(offer => {
      const type = offer.offerType || 'OTHER'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(offer)
    })

    if (Object.keys(grouped).length > 0) {
      console.log('📊 [Offers] Grouped by type:', grouped)
    }

    return grouped
  })

  // Get specific offer type
  const getOffersByType = (type: string) => {
    return offers.value.filter(offer => offer.offerType === type)
  }

  // Get featured offers
  const featuredOffers = computed(() => {
    return offers.value.filter(offer => offer.isFeatured)
  })

  // Get offers with products
  const offersWithProducts = computed(() => {
    return offers.value.filter(offer => offer.products && offer.products.length > 0)
  })

  // Get offer types available
  const availableOfferTypes = computed(() => {
    const types = new Set<string>()
    offers.value.forEach(offer => {
      if (offer.offerType) {
        types.add(offer.offerType)
      }
    })
    return Array.from(types).sort()
  })

  return {
    offers,
    loading,
    error,
    fetchAllOffers,
    offersByType,
    getOffersByType,
    featuredOffers,
    offersWithProducts,
    availableOfferTypes
  }
}
