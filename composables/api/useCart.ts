// composables/useCart.js
import { ref, computed } from 'vue'

// Create a reactive cart state
const cartItems = ref([])

const toNumber = (value: any, fallback = 0) => {
  const normalized = String(value ?? '').replace(/[^0-9.-]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeItem = (item: any, index = 0) => {
  const price = toNumber(item?.price, 0)
  const quantity = Math.max(1, Math.floor(toNumber(item?.quantity, 1)))
  const stock = Math.max(0, Math.floor(toNumber(item?.stock, 999)))
  const id = item?.id ?? item?.productId ?? item?.mainProduct?.id ?? item?.groupId ?? `cart-item-${index}`

  return {
    ...item,
    id,
    productId: item?.productId ?? id,
    price,
    quantity,
    stock
  }
}

const normalizeCart = (items: any) => {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => normalizeItem(item, index))
}

// Load cart from localStorage initially
if (process.client) {
  const savedCart = localStorage.getItem('shopping_cart')
  if (savedCart) {
    try {
      cartItems.value = normalizeCart(JSON.parse(savedCart))
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error)
      cartItems.value = []
    }
  }
}

// Computed properties
const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + Math.max(1, Math.floor(toNumber(item.quantity, 1))), 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const price = toNumber(item.price, 0)
    const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)))
    return total + (price * quantity)
  }, 0)
})

// Cart functions
export function useCart() {
  const resolveProductId = (product: any) => {
    return product?.id ?? product?.productId ?? product?.mainProduct?.id ?? product?.groupId ?? null
  }

  const resolveProductPrice = (product: any) => {
    return toNumber(
      product?.price ??
      product?.discountedPrice ??
      product?.finalPrice ??
      product?.mainProduct?.price ??
      product?.variant?.price,
      0
    )
  }

  // Get cart items
  const getCartItems = () => {
    return cartItems.value
  }

  // Add item to cart
  const addToCart = (product) => {
    const productId = resolveProductId(product)

    if (!product || !productId) {
      console.error('Invalid product:', product)
      return
    }

    const existingIndex = cartItems.value.findIndex(item => String(item.id) === String(productId))
    
    if (existingIndex > -1) {
      // Update quantity if exists
      cartItems.value[existingIndex].quantity += product.quantity || 1
      cartItems.value[existingIndex].price = resolveProductPrice(cartItems.value[existingIndex])
    } else {
      // Add new item
      cartItems.value.push({
        id: productId,
        productId,
        groupId: product.groupId || product?.mainProduct?.groupId,
        name: product.name || product?.mainProduct?.name || 'Product',
        price: resolveProductPrice(product),
        image: product.images?.[0]?.imageUrl || product.image,
        quantity: product.quantity || 1,
        stock: product.stock || product?.mainProduct?.stock,
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
      cartItems.value = normalizeCart(cartItems.value)
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
            cartItems.value = normalizeCart(JSON.parse(savedCart))
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
