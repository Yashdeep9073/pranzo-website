import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useOffersApi } from '~/composables/api/useOffersApi'
import type { Offer, OfferType, DiscountType } from '~/types/offers'

export interface OfferFilters {
  offerType?: OfferType
  isActive?: boolean
  isFeatured?: boolean
  discountType?: DiscountType
  minDiscount?: number
  maxDiscount?: number
  hasProducts?: boolean
  hasImages?: boolean
  priority?: number
  search?: string
}

export interface OfferCountdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  isStarting: boolean
  timeRemaining: number
}

export const useDynamicOffers = () => {
  // State
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<Date | null>(null)
  const filters = ref<OfferFilters>({})
  const countdowns = ref<Map<number, OfferCountdown>>(new Map())
  
  // API
  const { fetchOffers } = useOffersApi()
  
  // Countdown timer interval
  let countdownInterval: NodeJS.Timeout | null = null

  // Fetch offers with optional filters
  const fetchOffersWithFilters = async (customFilters?: OfferFilters) => {
    loading.value = true
    error.value = null

    try {
      const fetchFilters = customFilters || filters.value
      
      // Build API params
      const apiParams: any = {}
      if (fetchFilters.offerType) apiParams.offerType = fetchFilters.offerType
      if (fetchFilters.isActive !== undefined) apiParams.isActive = fetchFilters.isActive
      if (fetchFilters.isFeatured !== undefined) apiParams.isFeatured = fetchFilters.isFeatured

      console.log('🔍 [DynamicOffers] Fetching with filters:', apiParams)
      
      const data = await fetchOffers(apiParams)
      offers.value = data
      lastFetched.value = new Date()
      
      // Initialize countdowns for active offers
      initializeCountdowns()
      
      console.log(`✅ [DynamicOffers] Fetched ${offers.value.length} offers`)
    } catch (err: any) {
      console.error('❌ [DynamicOffers] Error:', err)
      error.value = err.message || 'Failed to fetch offers'
      offers.value = []
    } finally {
      loading.value = false
    }
  }

  // Real-time countdown calculation
  const calculateCountdown = (offer: Offer): OfferCountdown => {
    const now = new Date().getTime()
    const startDate = new Date(offer.startDate).getTime()
    const endDate = new Date(offer.endDate).getTime()
    
    let targetTime = endDate
    let isStarting = false
    
    if (now < startDate) {
      targetTime = startDate
      isStarting = true
    }
    
    const timeRemaining = Math.max(0, targetTime - now)
    const isExpired = now > endDate
    
    if (isExpired) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        isStarting: false,
        timeRemaining: 0
      }
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
    
    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      isStarting,
      timeRemaining
    }
  }

  // Initialize countdowns for all offers
  const initializeCountdowns = () => {
    offers.value.forEach(offer => {
      countdowns.value.set(offer.id, calculateCountdown(offer))
    })
  }

  // Update countdowns every second
  const startCountdownTimer = () => {
    if (countdownInterval) clearInterval(countdownInterval)
    
    countdownInterval = setInterval(() => {
      offers.value.forEach(offer => {
        const countdown = calculateCountdown(offer)
        countdowns.value.set(offer.id, countdown)
      })
    }, 1000)
  }

  // Stop countdown timer
  const stopCountdownTimer = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  // Get countdown for specific offer
  const getCountdown = (offerId: number): OfferCountdown | undefined => {
    return countdowns.value.get(offerId)
  }

  // Filter offers based on current filters
  const filteredOffers = computed(() => {
    let filtered = [...offers.value]
    
    if (filters.value.offerType) {
      filtered = filtered.filter(o => o.offerType === filters.value.offerType)
    }
    
    if (filters.value.isActive !== undefined) {
      filtered = filtered.filter(o => o.isActive === filters.value.isActive)
    }
    
    if (filters.value.isFeatured !== undefined) {
      filtered = filtered.filter(o => o.isFeatured === filters.value.isFeatured)
    }
    
    if (filters.value.discountType) {
      filtered = filtered.filter(o => o.discountType === filters.value.discountType)
    }
    
    if (filters.value.minDiscount !== undefined) {
      filtered = filtered.filter(o => o.discountValue >= filters.value.minDiscount!)
    }
    
    if (filters.value.maxDiscount !== undefined) {
      filtered = filtered.filter(o => o.discountValue <= filters.value.maxDiscount!)
    }
    
    if (filters.value.hasProducts) {
      filtered = filtered.filter(o => o.products && o.products.length > 0)
    }
    
    if (filters.value.hasImages) {
      filtered = filtered.filter(o => o.images && o.images.length > 0)
    }
    
    if (filters.value.priority !== undefined) {
      filtered = filtered.filter(o => o.priority >= filters.value.priority!)
    }
    
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(searchLower) ||
        o.description.toLowerCase().includes(searchLower) ||
        o.slug.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  })

  // Computed properties for different offer groups
  const activeOffers = computed(() => 
    offers.value.filter(o => o.isActive) // Temporarily removed expiry check for testing
  )

  const flashSaleOffers = computed(() => 
    offers.value.filter(o => 
      o.offerType === 'FLASH_SALE' && 
      o.isActive && 
      !calculateCountdown(o).isExpired
    )
  )

  const featuredOffers = computed(() => 
    offers.value.filter(o => 
      o.isFeatured && 
      o.isActive && 
      !calculateCountdown(o).isExpired
    )
  )

  const seasonalOffers = computed(() => 
    offers.value.filter(o => 
      o.offerType === 'SEASONAL' && 
      o.isActive && 
      !calculateCountdown(o).isExpired
    )
  )

  const clearanceOffers = computed(() => 
    offers.value.filter(o => 
      o.offerType === 'CLEARANCE' && 
      o.isActive && 
      !calculateCountdown(o).isExpired
    )
  )

  const expiringSoonOffers = computed(() => {
    const twentyFourHours = 24 * 60 * 60 * 1000
    return offers.value.filter(o => {
      const countdown = calculateCountdown(o)
      return o.isActive && 
             !countdown.isExpired && 
             countdown.timeRemaining < twentyFourHours
    })
  })

  const startingSoonOffers = computed(() => {
    const oneHour = 60 * 60 * 1000
    return offers.value.filter(o => {
      const countdown = calculateCountdown(o)
      return o.isActive && countdown.isStarting && countdown.timeRemaining < oneHour
    })
  })

  // Get best offer by priority
  const bestOffer = computed(() => {
    const validOffers = activeOffers.value.filter(o => o.images && o.images.length > 0)
    return validOffers.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0] || null
  })

  // Get best flash sale offer
  const bestFlashSaleOffer = computed(() => {
    const validFlashSales = flashSaleOffers.value.filter(o => o.images && o.images.length > 0)
    return validFlashSales.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0] || null
  })

  // Offers grouped by type
  const offersByType = computed(() => {
    const grouped: Record<string, Offer[]> = {}
    filteredOffers.value.forEach(offer => {
      const type = offer.offerType || 'OTHER'
      if (!grouped[type]) grouped[type] = []
      grouped[type].push(offer)
    })
    return grouped
  })

  // Helper functions
  const getOfferById = (id: number): Offer | undefined => {
    return offers.value.find(o => o.id === id)
  }

  const getOffersBySlug = (slug: string): Offer[] => {
    return offers.value.filter(o => o.slug === slug)
  }

  const isOfferValid = (offer: Offer): boolean => {
    const countdown = calculateCountdown(offer)
    return offer.isActive && !countdown.isExpired
  }

  const formatDiscountText = (offer: Offer): string => {
    if (offer.discountType === 'PERCENTAGE') {
      return `${offer.discountValue}% OFF`
    } else {
      return `₹${offer.discountValue} OFF`
    }
  }

  const getPrimaryImage = (offer: Offer): string | null => {
    if (!offer.images || offer.images.length === 0) return null
    
    const primary = offer.images.find(img => img.isPrimary)
    return primary?.imageUrl || offer.images[0]?.imageUrl || null
  }

  // Update filters
  const updateFilters = (newFilters: Partial<OfferFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  // Refresh offers
  const refreshOffers = () => {
    fetchOffersWithFilters()
  }

  // Lifecycle
  onMounted(() => {
    fetchOffersWithFilters()
    startCountdownTimer()
  })

  onUnmounted(() => {
    stopCountdownTimer()
  })

  return {
    // State
    offers,
    filteredOffers,
    loading,
    error,
    filters,
    lastFetched,
    
    // Computed
    activeOffers,
    flashSaleOffers,
    featuredOffers,
    seasonalOffers,
    clearanceOffers,
    expiringSoonOffers,
    startingSoonOffers,
    bestOffer,
    bestFlashSaleOffer,
    offersByType,
    
    // Methods
    fetchOffersWithFilters,
    refreshOffers,
    updateFilters,
    clearFilters,
    getCountdown,
    getOfferById,
    getOffersBySlug,
    isOfferValid,
    formatDiscountText,
    getPrimaryImage,
    
    // Timer controls
    startCountdownTimer,
    stopCountdownTimer
  }
}
