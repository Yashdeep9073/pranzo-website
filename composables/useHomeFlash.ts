import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useOffersApi } from '@/composables/api/useOffersApi'

export interface FlashSaleProduct {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  discount: number
  soldPercentage: number
  available: number
  rating: number
  reviews: number
}

export const useHomeFlash = () => {
  // Use the offers API
  const { fetchOffers } = useOffersApi()
  
  // Reactive state
  const offers = ref<any[]>([])
  const loading = ref(true)
  
  // Helper functions
  const formatDiscountText = (offer: any) => {
    if (offer.discountType === 'PERCENTAGE') {
      return `${offer.discountValue}% OFF`
    } else if (offer.discountType === 'FIXED') {
      return `₹${offer.discountValue} OFF`
    }
    return 'SPECIAL'
  }
  
  const getCountdown = (offerId: number) => {
    const offer = offers.value.find(o => o.id === offerId)
    if (!offer || !offer.endDate) return null
    
    const now = new Date().getTime()
    const endTime = new Date(offer.endDate).getTime()
    const startTime = offer.startDate ? new Date(offer.startDate).getTime() : now
    
    const isStarting = startTime > now
    const targetTime = isStarting ? startTime : endTime
    const difference = targetTime - now
    
    if (difference <= 0) {
      return { isExpired: true, days: 0, hours: 0, minutes: 0, seconds: 0, isStarting: false }
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    
    return { isExpired: false, days, hours, minutes, seconds, isStarting }
  }
  
  const getPrimaryImage = (offer: any) => {
    if (offer.images && offer.images.length > 0) {
      const primary = offer.images.find((img: any) => img.isPrimary)
      return primary?.imageUrl || offer.images[0]?.imageUrl
    }
    return null
  }
  
  // Computed properties
  const flashSaleOffers = computed(() => {
    return offers.value.filter(offer => offer.offerType === 'FLASH_SALE' && offer.isActive)
  })
  
  const bestFlashSaleOffer = computed(() => {
    const activeFlashSales = flashSaleOffers.value
    if (activeFlashSales.length === 0) return null
    
    // Return the offer with highest priority or first one
    return activeFlashSales.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0]
  })

  // Refs
  const swiperInstance = ref<any>(null)
  const swiperContainer = ref<HTMLElement | null>(null)

  // Use best flash sale offer from dynamic hook
  const activeOffer = computed(() => bestFlashSaleOffer.value)

  // Static products as fallback
  const staticProducts: FlashSaleProduct[] = [
    {
      id: 1,
      name: "Premium T-Shirt",
      price: 299,
      originalPrice: 599,
      image: "/assets/images/buysection/t-shirt1.jpg",
      discount: 50,
      soldPercentage: 75,
      available: 15,
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      name: "Classic Jeans",
      price: 799,
      originalPrice: 1299,
      image: "/assets/images/buysection/jeans1.jpg",
      discount: 38,
      soldPercentage: 82,
      available: 8,
      rating: 4.3,
      reviews: 189
    },
    {
      id: 3,
      name: "Sports Shoes",
      price: 1299,
      originalPrice: 1999,
      image: "/assets/images/buysection/shoes1.jpg",
      discount: 35,
      soldPercentage: 68,
      available: 22,
      rating: 4.7,
      reviews: 412
    },
    {
      id: 4,
      name: "Winter Jacket",
      price: 1499,
      originalPrice: 2499,
      image: "/assets/images/buysection/jacket1.jpg",
      discount: 40,
      soldPercentage: 91,
      available: 5,
      rating: 4.6,
      reviews: 156
    },
    {
      id: 5,
      name: "Casual Shirt",
      price: 499,
      originalPrice: 899,
      image: "/assets/images/buysection/shirt1.jpg",
      discount: 44,
      soldPercentage: 77,
      available: 18,
      rating: 4.4,
      reviews: 298
    }
  ]

  // Display products (from active offer or static fallback)
  const displayProducts = computed(() => {
    if (activeOffer.value?.products && activeOffer.value.products.length > 0) {
      return activeOffer.value.products.map((product: any) => ({
        id: product.id,
        name: product.name || `Product ${product.id}`,
        price: product.price || 299,
        originalPrice: product.originalPrice || 599,
        image: product.image || staticProducts[product.id % staticProducts.length]?.image,
        discount: product.discount || 50,
        soldPercentage: product.soldPercentage || Math.floor(Math.random() * 30) + 70,
        available: product.available || Math.floor(Math.random() * 20) + 5,
        rating: product.rating || 4.5,
        reviews: product.reviews || Math.floor(Math.random() * 400) + 100
      }))
    }
    return staticProducts
  })

  // Initialize Swiper
  const initSwiper = async () => {
    if (!swiperContainer.value || displayProducts.value.length === 0) return
    
    try {
      const SwiperModule = await import('swiper')
      const { Navigation, Autoplay } = await import('swiper/modules')
      
      const Swiper = SwiperModule.default
      
      swiperInstance.value = new Swiper(swiperContainer.value, {
        modules: [Navigation, Autoplay],
        loop: displayProducts.value.length > 4,
        slidesPerView: 5,
        spaceBetween: 16,
        centeredSlides: false,
        grabCursor: true,
        speed: 600,
        
        navigation: {
          nextEl: '.next-btn',
          prevEl: '.prev-btn',
          disabledClass: 'nav-btn-disabled'
        },
        
        autoplay: {
          delay: 3000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true
        },
        
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 12
          },
          400: {
            slidesPerView: 1.5,
            spaceBetween: 12
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 12
          },
          576: {
            slidesPerView: 2.5,
            spaceBetween: 14
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 14
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16
          },
          900: {
            slidesPerView: 4,
            spaceBetween: 16
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 16
          },
          1400: {
            slidesPerView: 5,
            spaceBetween: 16
          }
        },
        
        on: {
          init: function() {
            //console.log('Swiper initialized successfully')
          }
        }
      })

    } catch (error) {
      console.error('Error initializing Swiper:', error)
    }
  }

  const slideNext = () => {
    swiperInstance.value?.slideNext()
  }

  const slidePrev = () => {
    swiperInstance.value?.slidePrev()
  }

  // Watch for active offer changes to reinitialize swiper
  watch(() => activeOffer.value, (newOffer) => {
    if (newOffer && swiperContainer.value) {
      nextTick(() => {
        //console.log('⚡ [HomeFlash] Reinitializing swiper with new offer')
        initSwiper()
      })
    }
  }, { immediate: false })

  // Fetch data function
  const fetchFlashSaleData = async () => {
    try {
      loading.value = true
      const fetchedOffers = await fetchOffers({ 
        offerType: 'FLASH_SALE',
        isActive: true 
      })
      offers.value = fetchedOffers
    } catch (error) {
      console.error('Error fetching flash sale offers:', error)
      offers.value = []
    } finally {
      loading.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    //console.log('⚡ [HomeFlash] Component mounted')
    
    // Fetch flash sale data
    await fetchFlashSaleData()
    
    // Small delay to ensure data is ready
    setTimeout(() => {
      nextTick(() => {
        //console.log('⚡ [HomeFlash] Initializing swiper with', displayProducts.value.length, 'products')
        initSwiper()
      })
    }, 100)
  })

  onUnmounted(() => {
    if (swiperInstance.value) {
      swiperInstance.value.destroy(true, true)
      swiperInstance.value = null
    }
  })

  // Helper functions
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Limited time'
    }
  }

  const getProductImage = (product: FlashSaleProduct) => {
    return product.image || '/assets/images/buysection/default.jpg'
  }

  const calculateDiscountedPrice = (originalPrice: number, discount: number) => {
    return Math.round(originalPrice * (1 - discount / 100))
  }

  const getRandomSoldPercentage = () => {
    return Math.floor(Math.random() * 30) + 70
  }

  const getRandomAvailable = () => {
    return Math.floor(Math.random() * 20) + 5
  }

  const handleImageError = (event: any, index?: number) => {
    event.target.src = '/assets/images/buysection/default.jpg'
  }

  const addToCart = (product: FlashSaleProduct) => {
    //console.log('Added to cart:', product.name)
    // Add to cart logic here
  }

  return {
    // State
    swiperContainer,
    swiperInstance,
    
    // Computed
    activeOffer,
    displayProducts,
    loading,
    
    // Methods
    initSwiper,
    slideNext,
    slidePrev,
    formatDate,
    getProductImage,
    calculateDiscountedPrice,
    getRandomSoldPercentage,
    getRandomAvailable,
    handleImageError,
    addToCart,
    
    // Helper functions
    getCountdown,
    formatDiscountText
  }
}
