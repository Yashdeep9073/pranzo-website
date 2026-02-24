// composables/useCart.js
import { ref, computed } from 'vue'

// Create a reactive cart state
const cartItems = ref([])

// Load cart from localStorage initially
if (process.client) {
  const savedCart = localStorage.getItem('shopping_cart')
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error)
      cartItems.value = []
    }
  }
}

// Computed properties
const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.quantity || 1), 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0)
})

// Cart functions
export function useCart() {
  // Get cart items
  const getCartItems = () => {
    return cartItems.value
  }

  // Add item to cart
  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product)
      return
    }

    const existingIndex = cartItems.value.findIndex(item => item.id === product.id)
    
    if (existingIndex > -1) {
      // Update quantity if exists
      cartItems.value[existingIndex].quantity += product.quantity || 1
    } else {
      // Add new item
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0, // Ensure price is a number
        image: product.images?.[0]?.imageUrl || product.image,
        quantity: product.quantity || 1,
        stock: product.stock,
        category: product.category
      })
    }
    
    saveCart()
    broadcastCartUpdate()
    
    // Show success message
    if (process.client) {
      // You can use a toast notification here
      console.log('Product added to cart:', product.name)
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
    saveCart()
    broadcastCartUpdate()
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const itemIndex = cartItems.value.findIndex(item => item.id === productId)
    if (itemIndex > -1 && quantity > 0) {
      cartItems.value[itemIndex].quantity = quantity
      saveCart()
      broadcastCartUpdate()
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    saveCart()
    broadcastCartUpdate()
  }

  // Save cart to localStorage
  const saveCart = () => {
    if (process.client) {
      localStorage.setItem('shopping_cart', JSON.stringify(cartItems.value))
    }
  }

  // Broadcast cart update to all components
  const broadcastCartUpdate = () => {
    if (process.client) {
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { count: cartCount.value, items: cartItems.value }
      }))
      
      // Also trigger storage event for cross-tab sync
      localStorage.setItem('cart-last-updated', Date.now().toString())
    }
  }

  // Listen for cart updates
  const onCartUpdate = (callback) => {
    if (process.client) {
      window.addEventListener('cart-updated', callback)
      return () => window.removeEventListener('cart-updated', callback)
    }
  }

  // Listen for storage events (cross-tab)
  if (process.client) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'shopping_cart' || event.key === 'cart-last-updated') {
        const savedCart = localStorage.getItem('shopping_cart')
        if (savedCart) {
          try {
            cartItems.value = JSON.parse(savedCart)
            window.dispatchEvent(new CustomEvent('cart-updated', {
              detail: { count: cartCount.value, items: cartItems.value }
            }))
          } catch (error) {
            console.error('Error parsing cart from storage event:', error)
          }
        }
      }
    })
  }

  return {
    // State
    cartItems,
    cartCount,
    cartTotal,
    
    // Methods
    getCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveCart,
    broadcastCartUpdate,
    onCartUpdate
  }
}