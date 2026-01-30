<template>
  <div class="banner-wrapper">
    <div class="offer-strip" v-if="offerData">
      <span class="offer-text">
        FLAT {{ offerData.discountValue }}% OFF | {{ offerData.name }}
      </span>
    </div>

    <div class="offer-strip" v-else>
      <span class="offer-text">
        FLAT 40% OFF | Limited Time Deal 
      </span>
    </div>

    <div class="banner-content">
      <div class="banner-text">
        <p v-if="offerData?.description">{{ offerData.description }}</p>
        <p v-else>Top styles curated for you</p> 
      </div>

      <div class="images-section">
        <img
          src="/assets/images/bg/shirt-removebg-preview.png"
          alt="Shirt"
          class="main-img"
        /> 
        
        <NuxtLink :to="`/shop-all?offer=${offerData?.slug || 'all'}`" class="shop-link">
          <button class="shop-btn">
            Shop Now →
          </button>
        </NuxtLink>
      </div>
    </div>

    <div class="banner-bg-wrapper">
      <img
        v-if="primaryImageUrl"
        :src="primaryImageUrl"
        :alt="offerData?.name || 'Banner'"
        class="banner-bg"
        @error="handleImageError"
      />
      <img
        v-else
        src="/assets/images/buysection/t-shirt1.jpg"
        alt="Fallback Banner"
        class="banner-bg"
      />
      <div class="bg-overlay"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const offerData = ref(null)
const primaryImageUrl = ref('')
const isLoading = ref(true)
const hasError = ref(false)

const getPrimaryImageUrl = (images) => {
  if (!images || images.length === 0) return null
  
  const primaryImage = images.find(img => img.isPrimary)
  if (primaryImage) return primaryImage.imageUrl
  
  return images[0]?.imageUrl || null
}

const handleImageError = () => {
  primaryImageUrl.value = '/assets/images/buysection/t-shirt1.jpg'
}

const fetchOfferData = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    
    const config = useRuntimeConfig()
    const API_URL = config.public.api.offers
    
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    const activeOffer = result.data?.find(offer => 
      offer.isActive && offer.images?.length > 0
    )
    
    if (activeOffer) {
      offerData.value = activeOffer
      primaryImageUrl.value = getPrimaryImageUrl(activeOffer.images)
    }
    
  } catch (error) {
    console.error('Error fetching offer data:', error)
    hasError.value = true
    offerData.value = null
    primaryImageUrl.value = '/assets/images/buysection/t-shirt1.jpg'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOfferData()
})

// const refreshInterval = ref(null)
// onMounted(() => {
//   fetchOfferData()
//   refreshInterval.value = setInterval(fetchOfferData, 5 * 60 * 1000)
// })
// onUnmounted(() => {
//   if (refreshInterval.value) {
//     clearInterval(refreshInterval.value)
//   }
// })
</script>

<style scoped>
.banner-wrapper {
  position: relative;
  margin-bottom: 15px; 
  width: 100%; 
  height: 150px;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 78px; 
  z-index: 10;
}

.banner-wrapper.loading {
  opacity: 0.7;
}

.banner-bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 30px;
  overflow: hidden;
}

.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.banner-bg.loaded {
  opacity: 1;
}

.offer-strip {
  position: absolute;
  left: 1px;
  top: 0;
  background: linear-gradient(90deg, #006124, #02c0b3);
  padding: 6px 16px;
  border-radius: 11px;
  z-index: 4;
}

.offer-text {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.banner-text {
  flex: 1;
  color: #fff;
  z-index: 5;
}

.banner-text p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
  max-width: 150px;
  line-height: 1.4;
}

.images-section {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.main-img {
  width: 160px;
  height: auto;
  object-fit: contain;
  z-index: 3;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  margin-right: 20px;
}

.shop-link {
  position: absolute;
  bottom: 15px;
  right: 0;
  z-index: 6;
}

.shop-btn {
  background: #fff;
  color: #046ab7;
  border: none;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px; 
  cursor: pointer; 
  transition: all 0.25s ease; 
  display: flex; 
  align-items: center;
  justify-content: center;
}

.shop-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* ==================== resposnive ==================== */

@media (max-width: 768px) {
  .banner-wrapper {
    height: 110px;
    margin-top: 60px;
    margin-bottom: 20px;
  }

  .banner-bg-wrapper {
    border-radius: 0;
  }

  .banner-content {
    padding: 0 16px;
  }

  .banner-text p {
    font-size: 11px;
    max-width: 120px;
  }

  .main-img {
    width: 100px;
    margin-right: 15px;
  }

  .shop-btn {
    padding: 6px 14px;
    font-size: 11px;
  }

  .shop-link {
    bottom: 10px;
  }

  .offer-strip {
    left: 16px;
    padding: 5px 12px;
  }
  
  .offer-text {
    font-size: 11px;
  } 
}

@media (max-width: 1640px) {
  .banner-wrapper {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .banner-wrapper {
    height: 100px;
    margin-top: 60px;
    margin-bottom: 15px;
  }

  .banner-content {
    padding: 0 12px;
  }

  .banner-text p {
    font-size: 10px;
    max-width: 100px;
  }

  .main-img {
    width: 80px;
    margin-right: 10px;
  }

  .shop-btn {
    padding: 5px 12px;
    font-size: 10px;
  }

  .shop-link {
    bottom: 8px;
  }

  .offer-strip {
    left: 0;
    right: 0;
    top: 0;
    border-radius: 0;
    display: flex;
    justify-content: center;
    padding: 4px 0;
  }

  .offer-text {
    font-size: 10px;
  }
}

/* 小屏幕移动端 */
@media (max-width: 460px) {
  .banner-wrapper {
    height: 90px;
    margin-bottom: 0;
  }

  .banner-text p {
    font-size: 9px;
    max-width: 90px;
  }

  .main-img {
    width: 70px;
    margin-right: 8px;
  }

  .shop-btn {
    padding: 4px 10px;
    font-size: 9px;
  }

  .shop-link {
    bottom: 3px;
  }
}

:global(header) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
}
</style>