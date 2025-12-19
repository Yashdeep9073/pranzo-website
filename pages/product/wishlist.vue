<template>
  <div class="pt-20">
 <CartBreakcrumb/>
  </div>
  

  <section class="cart py-80">
    <div class="container container-lg">
      <div class="row gy-4">
        <!-- Cart Items Table -->
        <div class="col-xl-9 col-lg-8">
          <div class="cart-table border border-gray-100 rounded-8 px-40 py-48">
            <div class="overflow-x-auto scroll-sm scroll-sm-horizontal">
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

                  <!-- Cart Item 1 -->
                  <tr v-for="(item, index) in cartItems" :key="item.id">
                    <td>
                      <button 
                        type="button" 
                        class="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                        @click="removeItem(index)" 
                      >
                        <i class="ph ph-x-circle text-2xl d-flex"></i>
                        Remove
                      </button>
                    </td>
                    <td>
                      <div class="table-product d-flex align-items-center gap-24">
                        <NuxtLink 
                          :to="`/product-details/${item.slug}`" 
                          class="table-product__thumb border border-gray-100 rounded-8 flex-center"
                        >
                          <img :src="item.image" :alt="item.name" />
                        </NuxtLink>
                        <div class="table-product__content text-start">
                          <h6 class="title text-lg fw-semibold mb-8">
                            <NuxtLink 
                              :to="`/product-details/${item.slug}`" 
                              class="link text-line-2"
                            >
                              {{ item.name }}
                            </NuxtLink>
                          </h6>

                          <div class="flex-align gap-16 mb-16">
                            <div class="flex-align gap-6">
                              <span class="text-md fw-medium text-warning-600 d-flex">
                                <i class="ph-fill ph-star"></i>
                              </span>
                              <span class="text-md fw-semibold text-gray-900">{{ item.rating }}</span>
                            </div>
                            <span class="text-sm fw-medium text-gray-200">|</span>
                            <span class="text-neutral-600 text-sm">{{ item.reviews }} Reviews</span>
                          </div>

                          <div class="flex-align gap-16">
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
                      <span class="text-lg h6 mb-0 fw-semibold">${{ item.price }}</span>
                    </td>
                    <td>
                      <div class="d-flex rounded-4 overflow-hidden">
                        <button 
                          type="button" 
                          class="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                          @click="decreaseQuantity(index)"
                          :disabled="item.quantity <= 1"
                        >
                          <i class="ph ph-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          class="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4" 
                          v-model="item.quantity"
                          @change="updateQuantity(index, $event)"
                          :min="1"
                        />
                        <button 
                          type="button" 
                          class="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                          @click="increaseQuantity(index)"
                        >
                          <i class="ph ph-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <span class="text-lg h6 mb-0 fw-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Coupon and Update Cart -->
            <div class="flex-between flex-wrap gap-16 mt-16">
              <div class="flex-align gap-16">
                <input 
                  type="text" 
                  v-model="couponCode"
                  class="common-input" 
                  placeholder="Coupon Code"
                  @keyup.enter="applyCoupon"
                />
                <button 
                  type="button" 
                  class="btn btn-main py-18 w-100 rounded-8"
                  @click="applyCoupon"
                >
                  Apply Coupon
                </button>
              </div>
              <button 
                type="button" 
                class="text-lg text-gray-500 hover-text-main-600"
                @click="updateCart"
              >
                Update Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="col-xl-3 col-lg-4">
          <div class="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
            <h6 class="text-xl mb-32">Cart Totals</h6>
            
            <div class="bg-color-three rounded-8 p-24">
              <div class="mb-32 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Subtotal</span>
                <span class="text-gray-900 fw-semibold">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="mb-32 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Estimated Delivery</span>
                <span class="text-gray-900 fw-semibold">{{ deliveryCharge === 0 ? 'Free' : `$${deliveryCharge.toFixed(2)}` }}</span>
              </div>
              <div class="mb-0 flex-between gap-8">
                <span class="text-gray-900 font-heading-two">Estimated Tax</span>
                <span class="text-gray-900 fw-semibold">${{ tax.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="bg-color-three rounded-8 p-24 mt-24">
              <div class="flex-between gap-8">
                <span class="text-gray-900 text-xl fw-semibold">Total</span>
                <span class="text-gray-900 text-xl fw-semibold">${{ total.toFixed(2) }}</span>
              </div>
            </div>
            
            <NuxtLink 
              to="/product/checkout" 
              class="btn btn-main mt-40 py-18 w-100 rounded-8"
              :class="{ 'disabled': cartItems.length === 0 }"
              :disabled="cartItems.length === 0"
            >
              Proceed to checkout
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
    <CartShop/>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CartBreakcrumb from '~/components/cartBreakcrumb.vue'
import CartShop from '~/components/cartShop.vue'

// Cart items data
const cartItems = ref([
  {
    id: 1,
    name: 'Taylor Farms Broccoli Florets Vegetables',
    slug: 'taylor-farms-broccoli-florets',
    image: '/assets/images/thumbs/product-two-img1.png',
    price: 125.00,
    quantity: 1,
    rating: 4.8,
    reviews: 128,
    tags: ['Camera', 'Videos']
  },
  {
    id: 2,
    name: 'Taylor Farms Broccoli Florets Vegetables',
    slug: 'taylor-farms-broccoli-florets-2',
    image: '/assets/images/thumbs/product-two-img2.png',
    price: 125.00,
    quantity: 1,
    rating: 4.8,
    reviews: 128,
    tags: ['Camera', 'Videos']
  },
  {
    id: 3,
    name: 'Taylor Farms Broccoli Florets Vegetables',
    slug: 'taylor-farms-broccoli-florets-3',
    image: '/assets/images/thumbs/product-two-img3.png',
    price: 125.00,
    quantity: 1,
    rating: 4.8,
    reviews: 128,
    tags: ['Camera', 'Videos']
  },
  {
    id: 4,
    name: 'Taylor Farms Broccoli Florets Vegetables',
    slug: 'taylor-farms-broccoli-florets-4',
    image: '/assets/images/thumbs/product-two-img4.png',
    price: 125.00,
    quantity: 1,
    rating: 4.8,
    reviews: 128,
    tags: ['Camera', 'Videos']
  }
])

// Coupon code
const couponCode = ref('')
const appliedCoupon = ref(null)
const couponDiscount = ref(0)

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const deliveryCharge = computed(() => {
  return subtotal.value > 50 ? 0 : 10 // Free delivery over $50
})

const tax = computed(() => {
  return subtotal.value * 0.1 // 10% tax
})

const total = computed(() => {
  return subtotal.value + deliveryCharge.value + tax.value - couponDiscount.value
})

// Cart actions
const removeItem = (index) => {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    cartItems.value.splice(index, 1)
  }
}

const increaseQuantity = (index) => {
  cartItems.value[index].quantity++
  updateItemTotal(index)
}

const decreaseQuantity = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--
    updateItemTotal(index)
  }
}

const updateQuantity = (index, event) => {
  const value = parseInt(event.target.value)
  if (value >= 1) {
    cartItems.value[index].quantity = value
    updateItemTotal(index)
  } else {
    cartItems.value[index].quantity = 1
  }
}

const updateItemTotal = (index) => {
  // If you need to update something specific when quantity changes
  console.log(`Updated quantity for item ${index}:`, cartItems.value[index].quantity)
}

const updateCart = () => {
  // In a real app, this would send updated quantities to the server
  console.log('Cart updated:', cartItems.value)
  alert('Cart updated successfully!')
}

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('Please enter a coupon code')
    return
  }

  // Simulate coupon validation
  const validCoupons = {
    'SAVE10': 0.1, // 10% discount
    'FREE25BAC': 25, // $25 discount
    'WELCOME15': 0.15 // 15% discount
  }

  const coupon = couponCode.value.toUpperCase()
  
  if (validCoupons[coupon]) {
    appliedCoupon.value = coupon
    
    if (coupon === 'FREE25BAC') {
      couponDiscount.value = 25 // Fixed $25 discount
    } else {
      couponDiscount.value = subtotal.value * validCoupons[coupon] // Percentage discount
    }
    
    alert(`Coupon "${coupon}" applied successfully!`)
  } else {
    alert('Invalid coupon code')
    couponCode.value = ''
    couponDiscount.value = 0
    appliedCoupon.value = null
  }
}

// Initialize cart from localStorage or API
onMounted(() => {
  // Load cart from localStorage if exists
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
  
  // Save cart to localStorage whenever it changes
  watch(cartItems, (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  }, { deep: true })
})
const selectedCategories = ref([])

</script>

<style scoped>
/* Custom styles if needed */
.cart-table {
  background-color: #fff;
}

.table.style-three {
  width: 100%;
  border-collapse: collapse;
}

.table.style-three th,
.table.style-three td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
}

.table.style-three th {
  background-color: #f8f9fa;
}

.quantity__input {
  -moz-appearance: textfield;
}

.quantity__input::-webkit-outer-spin-button,
.quantity__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.common-input {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 200px;
}

.btn-main {
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
}

.btn-main:hover {
  background-color: #2563eb;
}

.btn-main.disabled {
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
  height: 4px;
}

.scroll-sm::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll-sm::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.scroll-sm::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cart-table {
    padding: 20px;
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
}
</style>