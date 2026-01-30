import { ref, computed } from 'vue'
import useSWRV from 'swrv'
        
export interface BannerItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  createdAt?: string
  updatedAt?: string
}

const config = useRuntimeConfig() 
const API_URL_MEDIA = config.public.api.media

// Cache key generator
const getBannersKey = (apiUrl: string) => `banners:${apiUrl}`

// Fetcher function
const bannersFetcher = async (url: string): Promise<BannerItem[]> => {
  try {
    const response = await fetch(API_URL_MEDIA)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Adjust based on your API response structure 
    if (data && data.data) {
      return data.data
        .filter((item: BannerItem) => item.category === 'HEROSECTION')
        .slice(0, 3)
        .map((item: BannerItem) => ({
          ...item,
          // Ensure image URL is complete
          image: item.image?.startsWith('http') 
            ? item.image 
            : item.image?.startsWith('/') 
              ? `https://your-api-domain.com${item.image}`
              : item.image
        }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching banners:', error)
    throw error
  }
}

export function useBanners(apiUrl: string) {
  // Use SWRV for data fetching with caching
  const {
    data: bannersData,
    error: bannersError,
    isValidating,
    mutate: refreshBanners
  } = useSWRV<BannerItem[]>(
    () => apiUrl ? getBannersKey(apiUrl) : null,
    () => bannersFetcher(apiUrl),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
      refreshInterval: 60000, // 1 minute
      ttl: 300000, // 5 minutes cache
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
      errorRetryCount: 3,
    }
  )

  // Derived states
  const isLoading = computed(() => !bannersData.value && !bannersError.value)
  const isError = computed(() => !!bannersError.value)
  const isEmpty = computed(() => 
    !isLoading.value && !isError.value && (!bannersData.value || bannersData.value.length === 0)
  )

  return {
    // Data
    banners: bannersData,
    
    // States
    isLoading,
    isError,
    isValidating: computed(() => isValidating.value),
    isEmpty,
    
    // Error
    error: bannersError, 
    
    // Actions
    refresh: refreshBanners,
    
    // Status helpers
    hasData: computed(() => bannersData.value && bannersData.value.length > 0),
    
    // For debugging
    status: computed(() => {
      if (isLoading.value) return 'loading'
      if (isError.value) return 'error'
      if (isEmpty.value) return 'empty'
      return 'success'
    })
  }
}