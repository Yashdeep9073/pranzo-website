<template  >
  <div class="pt-20 up">
     <CartBreakcrumb/>
  </div>
  
  <section class="cart py-80">
    <div class="container container-lg">
      <!-- Empty Cart State -->  
      <div v-if="cartItems.length === 0" class="text-center py-80">
        <div class="mb-32">
          <i class="ph ph-shopping-cart text-6xl text-gray-300"></i>
        </div>
        <h4 class="text-2xl fw-bold text-gray-800 mb-16">Your cart is empty</h4>
        <p class="text-gray-600 mb-32">Add some products to your cart to see them here</p>
        <NuxtLink to="/shop-all" class="btn btn-main py-16 px-32 rounded-8">
          <i class="ph ph-shopping-bag me-2"></i> Continue Shopping
        </NuxtLink>
      </div>

      <!-- Cart Content -->    
      <div v-else class="row gy-4">
        <!-- Cart Items Table -->
        <div class="col-xl-9 col-lg-8">
          <div class="cart-table border border-gray-100 rounded-8 px-40 py-48">
            <div class="flex-between mb-32">
              <h4 class="text-2xl fw-bold text-gray-800">Shopping Cart</h4>
              <div class="text-sm text-gray-600">
                <span class="fw-semibold">{{ cartItemCount }}</span> items in cart
              </div>
            </div>
            
            <div class="overflow-x-auto scroll-sm scroll-sm-horizontal scrollbar-hide">
              <table class="table style-three">
                <thead>
                  <tr>
                    <th class="h6 mb-0 text-lg fw-bold">Delete</th>
                    <th class="h6 mb-0 text-lg fw-bold">Product Name</th>
                    <th class="h6 mb-0 text-lg fw-bold">Price</th>
                    <th class="h6 mb-0 text-lg fw-bold">Quantity</th>
                    <th class="h6 mb-0 text-lg fw-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Cart Items from localStorage -->
                  <tr v-for="(item, index) in cartItems" :key="item.id">
                    <td>
                      <button 
                        type="button" 
                        class="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                        @click="removeItem(item.id)"
                      >
                        <i class="ph ph-x-circle text-2xl d-flex"></i>
                        Remove
                      </button>
                    </td>
                    <td>
                      <div class="table-product d-flex align-items-center gap-24">
                        <NuxtLink 
                          :to="getProductLink(item)" 
                          class="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          style="width: 100px; height: 100px;"
                        >
                          <img 
                            :src="item.image || '/assets/images/thumbs/default-product.png'" 
                            :alt="item.name" 
                            class="w-100 h-100 object-cover rounded-8"

                          />
                        </NuxtLink>
                        <div class="table-product__content text-start">
                          <h6 class="title text-lg fw-semibold mb-8">
                            <NuxtLink 
                              :to="getProductLink(item)" 
                              class="link text-line-2"
                            > 
                              {{ item.name }}
                            </NuxtLink>
                          </h6>

                          <!-- Variant Info -->
                         <div v-if="item.color || item.size" class="variant-info flex-align gap-10 mb-10">
  <span v-if="item.color" class="variant-chip">
    Color: {{ item.color }}
  </span>

  <span v-if="item.size" class="variant-chip">
    Size: {{ Array.isArray(item.size) ? item.size.join(', ') : item.size }}
  </span>
</div>


                          <div v-if="item.rating || item.reviewCount" class="flex-align gap-16 mb-16">
                            <div class="flex-align gap-6">
                              <span class="text-md fw-medium text-warning-600 d-flex">
                                <i class="ph-fill ph-star"></i>
                              </span>
                              <span class="text-md fw-semibold text-gray-900">{{ item.rating }}</span>
                            </div>
                            <span v-if="item.reviewCount" class="text-sm fw-medium text-gray-200">|</span>
                            <span v-if="item.reviewCount" class="text-neutral-600 text-sm">{{ item.reviewCount }} Reviews</span>
                          </div>

                          <div v-if="Array.isArray(item.tags) && item.tags.length" class="flex-align gap-16">
                            <span 
                              v-for="tag in item.tags" 
                              :key="tag"
                              class="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                            >
                              {{ tag }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column gap-4">
                        <span class="text-lg h6 mb-0 fw-semibold">₹{{ formatCurrency(item.price) }}</span>
                        <span v-if="item.discounted" class="text-sm text-gray-500 text-decoration-line-through">
                          ₹{{ formatCurrency(item.originalPrice ?? item.price) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex rounded-4 overflow-hidden">
                        <button 
                          type="button" 
                          class="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white transition-colors"
                          @click="decreaseQuantity(item.id)"
                          :disabled="item.quantity <= 1"
                          :class="item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
                        >
                          <i class="ph ph-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          class="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4 bg-white" 
                          v-model.number="item.quantity"
                          @change="updateQuantity(item.id, $event)"
                          :min="1"
                          :max="getMaxQuantity(item) || undefined"
                        />
                        <button 
                          type="button" 
                          class="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white transition-colors"
                          @click="increaseQuantity(item.id)"
                          :disabled="getMaxQuantity(item) ? item.quantity >= getMaxQuantity(item) : false"
                          :class="getMaxQuantity(item) && item.quantity >= getMaxQuantity(item) ? 'opacity-50 cursor-not-allowed' : ''"
                        >
                          <i class="ph ph-plus"></i>
                        </button>
                      </div>
                      <div v-if="getMaxQuantity(item)" class="text-xs text-gray-500 mt-4">
                        Stock: {{ getMaxQuantity(item) }}
                      </div>
                    </td>
                    <td>
                      <span class="text-lg h6 mb-0 fw-semibold text-main-600">
                        ₹{{ formatCurrency(itemSubtotal(item)) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Coupon and Update Cart -->
            <div class="flex-between flex-wrap gap-16 mt-32 pt-32 border-t border-gray-100">
              <div class="flex-align gap-16">
                <input 
                  type="text" 
                  v-model="couponCode"
                  class="common-input py-12 px-16" 
                  placeholder="Coupon Code"
                  @keyup.enter="applyCoupon"
                />
                <button 
                  type="button" 
                  class="btn btn-main py-12 px-24 rounded-8"
                  @click="applyCoupon"
                >
                  Apply Coupon
                </button>
              </div>
              <div class="flex-align gap-16">
                <NuxtLink 
                  to="/shop-all" 
                  class="text-lg text-gray-500 hover-text-main-600 transition-colors"
                >
                  <i class="ph ph-arrow-left me-2"></i> Continue Shopping
                </NuxtLink>
                <button 
                  type="button" 
                  class="clear-cart-btn text-lg hover-text-danger-600 transition-all duration-300 transform hover:scale-105"
                  @click="clearCart"
                >
                  <i class="ph ph-trash me-2"></i> 
                  <span>Clear Cart</span>
                  <div class="clear-cart-underline"></div>
                </button>
              </div>
            </div>

            <!-- Applied Coupon -->
            <div v-if="appliedCoupon" class="mt-24 p-16 bg-green-50 border border-green-200 rounded-8">
              <div class="flex-between items-center">
                <div class="flex-align gap-12">
                  <i class="ph ph-check-circle text-green-600 text-lg"></i>
                  <span class="text-green-800 fw-semibold">
                    Coupon "{{ appliedCoupon }}" applied successfully!
                  </span>
                  <span class="text-green-600">-₹{{ couponDiscount.toFixed(2) }}</span>
                </div>
                <button 
                  @click="removeCoupon"
                  class="text-sm text-red-600 hover-text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="col-xl-3 col-lg-4">
          <div class="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
            <h6 class="text-xl mb-32 fw-bold text-gray-800">Cart Totals</h6>
            
            <div class="bg-color-three rounded-8 p-24">
              <div class="mb-24 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Items</span>
                <span class="text-gray-900 fw-semibold">{{ cartItemCount }}</span>
              </div>
              <div class="mb-24 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Subtotal</span>
                <span class="text-gray-900 fw-semibold">₹{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="mb-24 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Estimated Delivery</span>
                <span class="text-gray-900 fw-semibold">{{ deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}` }}</span>
              </div>
              <div class="mb-24 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Estimated Tax</span>
                <span class="text-gray-900 fw-semibold">₹{{ tax.toFixed(2) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="mb-24 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Coupon Discount</span>
                <span class="text-green-600 fw-semibold">-₹{{ couponDiscount.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="bg-color-three rounded-8 p-24 mt-24">
              <div class="flex-between gap-8">
                <span class="text-gray-900 text-xl fw-semibold">Total</span>
                <span class="text-gray-900 text-xl fw-semibold">₹{{ total.toFixed(0) }}</span>
              </div>
            </div>
            
            <div class="mt-32 space-y-16">
              <NuxtLink 
                to="/cart/checkout" 
                class="btn btn-main py-18 w-100 rounded-8 fw-semibold flex-center gap-12"
                :class="{ 'disabled': cartItems.length === 0 }"
                :disabled="cartItems.length === 0"
              >
                <i class="ph ph-credit-card"></i>
                Proceed to Checkout
              </NuxtLink>
              
              <NuxtLink 
                to="/shop-all" 
                class="btn btn-outline-main py-18 w-100 rounded-8 fw-semibold flex-center gap-12"
              >
                <i class="ph ph-shopping-bag"></i>
                Continue Shopping
              </NuxtLink>  
            </div>

            <!-- Secure Checkout Info -->
            <div class="mt-32 pt-24 border-t border-gray-100">
              <div class="flex-align gap-12 mb-16">
                <i class="ph ph-shield-check text-green-600 text-lg"></i>
                <span class="text-sm text-gray-700">Secure SSL checkout</span>
              </div>
              <div class="flex-align gap-12 mb-16">
                <i class="ph ph-truck text-blue-600 text-lg"></i>
                <span class="text-sm text-gray-700">Free shipping over ₹500</span>
              </div>
              <div class="flex-align gap-12">
                <i class="ph ph-arrow-counter-clockwise text-purple-600 text-lg"></i>
                <span class="text-sm text-gray-700">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <CartShop/>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#app'
import CartBreakcrumb from '~/components/cart/CartBreakcrumb.vue'
import CartShop from '~/components/cart/CartShop.vue'
import Swal from 'sweetalert2'

useHead({
  title: "Cart"  
})
const route = useRoute()
definePageMeta({
  middleware: 'cart'
})

// State
const cartItems = ref([])
const couponCode = ref('')
const appliedCoupon = ref(null)
const couponDiscount = ref(0)

const toNumber = (value, fallback = 0) => {
  const normalized = String(value ?? '').replace(/[^0-9.-]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeCartItem = (item, index = 0) => {
  const price = toNumber(item?.price, 0)
  const originalPrice = item?.originalPrice != null ? toNumber(item.originalPrice, price) : null
  const quantity = Math.max(1, Math.floor(toNumber(item?.quantity, 1)))
  const parsedStock = toNumber(item?.stock, NaN)
  const stock = Number.isFinite(parsedStock) && parsedStock > 0 ? Math.floor(parsedStock) : null

  return {
    ...item,
    id: item?.id ?? `${item?.productId ?? item?.groupId ?? 'cart-item'}-${index}`,
    price,
    originalPrice,
    quantity,
    stock
  }
}

const getMaxQuantity = (item) => {
  const stock = toNumber(item?.stock, NaN)
  return Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : null
}

const itemSubtotal = (item) => {
  return toNumber(item?.price, 0) * Math.max(1, Math.floor(toNumber(item?.quantity, 1)))
}

const formatCurrency = (amount) => {
  return toNumber(amount, 0).toFixed(2)
}

const slugify = (text) => {
  return String(text || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product'
}

const getProductLink = (item) => {
  const groupId = item?.groupId || item?.productId || item?.id
  if (!groupId) return '/shop-all'
  return `/shop-all/${slugify(item?.name)}/${groupId}`
}

const normalizeCart = (items = []) => {
  if (!Array.isArray(items)) return []
  return items.map((item, index) => normalizeCartItem(item, index))
}

// Computed Properties
const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + Math.max(1, Math.floor(toNumber(item.quantity, 1))), 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = toNumber(item.price, 0)
    const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)))
    return sum + (price * quantity)
  }, 0)
})

const deliveryCharge = computed(() => {
  return subtotal.value > 500 ? 0 : 50 // Free delivery over ₹500
})

const tax = computed(() => {
  return subtotal.value * 0.18 // 18% GST
})

const total = computed(() => {
  return subtotal.value + deliveryCharge.value + tax.value - couponDiscount.value
})

// Helper Functions
function decodeId(encoded) {
  try {
    return atob(encoded)
  } catch (error) {
    console.error('Error decoding ID:', error)
    return null
  }
}

// Cart Functions
const loadCartFromStorage = () => {
  try {
    //console.log('Loading cart from localStorage...')
    const cartData = localStorage.getItem('shopping_cart')
    if (cartData) {
      const parsed = JSON.parse(cartData)
      const cart = Array.isArray(parsed)
        ? parsed
        : (Array.isArray(parsed?.items) ? parsed.items : [])
      cartItems.value = normalizeCart(cart)
    } else {
      //console.log('No cart found in localStorage')
      cartItems.value = []
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error)
    cartItems.value = []
  }
}

const saveCartToStorage = () => {
  try {
    cartItems.value = normalizeCart(cartItems.value)
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems.value))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
    //console.log('Cart saved to localStorage')
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}


const removeItem = (itemId) => {
  Swal.fire({
    title: 'Remove item?',
    text: 'This item will be removed from your cart.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Remove',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#111',
    cancelButtonColor: '#d1d5db'
  }).then((result) => {
    if (result.isConfirmed) {
      cartItems.value = cartItems.value.filter(item => item.id !== itemId)
      saveCartToStorage()
    }
  })
}
const increaseQuantity = (itemId) => {
  const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
  if (itemIndex > -1) {
    const item = cartItems.value[itemIndex]
    const maxQuantity = getMaxQuantity(item)
    if (!maxQuantity || item.quantity < maxQuantity) {
      item.quantity++
      saveCartToStorage()
    }
  }
}

const decreaseQuantity = (itemId) => {
  const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
  if (itemIndex > -1) {
    const item = cartItems.value[itemIndex]
    if (item.quantity > 1) {
      item.quantity--
      saveCartToStorage()
    }
  }
}

const updateQuantity = (itemId, event) => {
  const value = parseInt(event.target.value)
  const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
  
  if (itemIndex > -1 && Number.isFinite(value) && value >= 1) {
    const item = cartItems.value[itemIndex]
    const maxStock = getMaxQuantity(item)
    
    if (!maxStock || value <= maxStock) {
      item.quantity = value
      saveCartToStorage()
    } else {
      item.quantity = maxStock
      alert(`Maximum available stock is ${maxStock}`)
      saveCartToStorage()
    }
  }
}

const clearCart = () => {
  Swal.fire({
    title: 'Clear Cart?',
    text: 'Are you sure you want to remove all items from your cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, clear it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      cartItems.value = []
      localStorage.removeItem('shopping_cart')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated'))
      }
      
      // Show success message
      Swal.fire({
        title: 'Cart Cleared!',
        text: 'All items have been removed from your cart.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-center'
      })
    }
  })
}

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('Please enter a coupon code')
    return
  }

  // Simulate coupon validation
  const validCoupons = {
    'SAVE10': 0.1, // 10% discount
    'FREE50': 50, // ₹50 discount
    'WELCOME20': 0.2, // 20% discount
    'FIRSTORDER': 0.15 // 15% discount
  }

  const coupon = couponCode.value.toUpperCase()
  
  if (validCoupons[coupon]) {
    appliedCoupon.value = coupon
    
    if (coupon === 'FREE50') {
      couponDiscount.value = 50 // Fixed ₹50 discount
    } else {
      couponDiscount.value = subtotal.value * validCoupons[coupon] // Percentage discount
    }
    
    // Ensure discount doesn't exceed total
    if (couponDiscount.value > subtotal.value) {
      couponDiscount.value = subtotal.value
    }
    
    alert(`Coupon "${coupon}" applied successfully!`)
    couponCode.value = ''
  } else {
    alert('Invalid coupon code')
    couponCode.value = ''
    couponDiscount.value = 0
    appliedCoupon.value = null
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponDiscount.value = 0
  couponCode.value = ''
}

// Load cart when component mounts
onMounted(() => {
  // Check for product ID in URL (from Add to Cart)
  const encodedId = route.query.pid
  if (encodedId) {
    const productId = decodeId(encodedId)
    //console.log("Product ID from URL:", productId)
    
    // You could automatically add this product to cart here
    // or redirect to product page
  }
  
  // Listen for storage changes (for cross-tab updates)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageUpdate)
  }
})

const handleStorageUpdate = (event) => {
  if (event.key === 'shopping_cart') {
    loadCartFromStorage()
  }
}

if (process.client) {
  loadCartFromStorage()
}

// Cleanup event listener
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', handleStorageUpdate)
  }
})
</script>

<style scoped>
  .up{
    margin-top: 50px;
  }

  /* Hide scrollbar while keeping scrollability */
  .scrollbar-hide {
    /* Firefox */
    scrollbar-width: none;
    -moz-scrollbar-width: none;
    
    /* Internet Explorer 10+ */
    -ms-overflow-style: none;
    -ms-scrollbar-width: none;
    
    /* Chrome, Safari, Opera */
    scrollbar-color: transparent transparent;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent;
    display: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-hide::-webkit-scrollbar-thumb {
    background: transparent;
    display: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar-corner {
    background: transparent;
  }

  .variant-info {
  font-size: 13px;
}
.swal-center-popup {
  border-radius: 14px;
}


.variant-chip {
  padding: 4px 10px;
  border-radius: 20px;
  background: #f7f7f7;
  color: #111;                 /* BLACK TEXT  */
  font-weight: 500;
  border: 1px solid #e5e5e5;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.variant-chip:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}

/* Custom styles */
.cart-table {
  background-color: #fff;
}

.table.style-three {
  width: 100%;
  border-collapse: collapse;
}

.table.style-three th,
.table.style-three td {
  padding: 20px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
  vertical-align: middle;
}

.table.style-three th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.table.style-three tr:hover {
  background-color: #ecedeb;
}

.table-product__thumb {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.table-product__thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.quantity__input {
  -moz-appearance: textfield;
  appearance: textfield;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.quantity__input::-webkit-outer-spin-button,
.quantity__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.common-input {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 200px;
  transition: all 0.3s ease;
}

.common-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-main {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-main:hover:not(.disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.btn-main.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline-main {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.btn-outline-main:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.remove-tr-btn {
  transition: all 0.3s ease;
  color: #6b7280;
}

.remove-tr-btn:hover {
  color: #dc2626;
}

.quantity__minus,
.quantity__plus {
  transition: all 0.3s ease;
}

.quantity__minus:hover:not([disabled]),
.quantity__plus:hover:not([disabled]) {
  background-color: #3b82f6;
  color: white;
}

.quantity__minus[disabled],
.quantity__plus[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-sm-horizontal {
  overflow-x: auto;
}

.scroll-sm {
  scrollbar-width: thin;
}

.scroll-sm::-webkit-scrollbar {
  height: 6px;
}

.scroll-sm::-webkit-scrollbar-track {
  background: #ecedeb;
  border-radius: 3px;
}

.scroll-sm::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.scroll-sm::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Badge Styles */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Link Styles */
.link {
  color: #111827;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #3b82f6;
}

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transition utilities */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Spacing Utilities */
.space-y-16 > * + * {
  margin-top: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cart-table {
    padding: 20px;
  }
  
  .table.style-three th,
  .table.style-three td {
    padding: 12px 8px;
  }
  
  .flex-between {
    flex-direction: column;
    gap: 16px;
  }
  
  .flex-align {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .common-input {
    width: 100%;
  }
  
  .table-product {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .table-product__thumb {
    width: 80px;
    height: 80px;
  }
}

/* Spinner Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ==================== ENHANCED CLEAR CART BUTTON ==================== */
.clear-cart-btn {
  position: relative;
  background: transparent;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.clear-cart-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.clear-cart-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
}

.clear-cart-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  transition: width 0.3s ease;
}

.clear-cart-btn:hover .clear-cart-underline {
  width: 100%;
}

.clear-cart-btn i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.clear-cart-btn:hover i {
  transform: scale(1.1);
}

.clear-cart-btn span {
  position: relative;
  z-index: 1;
}
</style>
