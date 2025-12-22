// stores/wishlistStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref([])
  
  // Getters
  const count = computed(() => items.value?.length || 0)
  
  const productIds = computed(() => 
    items.value?.map(item => item?.mainProduct?.id).filter(Boolean) || []
  )
  
  const hasProduct = (product) => {
    const productId = product?.mainProduct?.id
    if (!productId) return false
    return items.value?.some(item => item?.mainProduct?.id === productId) || false
  }
  
  // Actions
  const loadFromStorage = () => {
    if (typeof window === 'undefined') {
      items.value = []
      return
    }
    
    try {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        const parsed = JSON.parse(stored)
        items.value = Array.isArray(parsed) ? parsed : []
      } else {
        items.value = []
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error)
      items.value = []
    }
  }
  
  const saveToStorage = () => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('wishlist', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving wishlist to storage:', error)
    }
  }
  
  const addItem = (product) => {
    if (!product?.mainProduct?.id) return false
    
    // Ensure items array exists
    if (!Array.isArray(items.value)) {
      items.value = []
    }
    
    if (!hasProduct(product)) {
      items.value.push(product)
      saveToStorage()
      return true
    }
    return false
  }
  
  const removeItem = (product) => {
    const productId = product?.mainProduct?.id
    if (!productId) return false
    
    if (!Array.isArray(items.value)) {
      items.value = []
      return false
    }
    
    const index = items.value.findIndex(item => item?.mainProduct?.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }
  
  const toggleItem = (product) => {
    if (hasProduct(product)) {
      return removeItem(product)
    } else {
      return addItem(product)
    }
  }
  
  const clearAll = () => {
    items.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wishlist')
    }
  }
  
  // Initialize immediately
  loadFromStorage()
  
  return {
    // State
    items,
    
    // Getters
    count,
    productIds,
    hasProduct,
    
    // Actions
    loadFromStorage,
    saveToStorage,
    addItem,
    removeItem,
    toggleItem,
    clearAll
  }
})