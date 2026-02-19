<template>
  <section class="checkout py-80 pt-100 up">
    <div class="container container-lg">
      <!-- Coupon Banner -->
      <div class="border border-gray-100 rounded-8 px-30 py-20 mb-40">
        <span class="">
          Have a coupon? 
          <NuxtLink 
            to="/cart/cart" 
            class="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
          >
            Click here to enter your code
          </NuxtLink>
        </span>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="text-center py-80">
        <div class="mb-32">
          <i class="ph ph-shopping-cart text-6xl text-gray-300"></i>
        </div>
        <h4 class="text-2xl fw-bold text-gray-800 mb-16">Your cart is empty</h4>
        <p class="text-gray-600 mb-32">Add some products to your cart to checkout</p>
        <NuxtLink to="/shop/shop-all" class="btn btn-main py-16 px-32 rounded-8">
          <i class="ph ph-shopping-bag me-2"></i> Continue Shopping
        </NuxtLink>
      </div>

      <!-- Checkout Form (Show only if cart has items) -->
      <div v-else class="row">
        <!-- Checkout Form -->
        <div class="col-xl-8 col-lg-7">
          <form @submit.prevent="handleSubmit" class="pe-xl-5">
            <div class="row gy-3">
              <!-- Personal Information -->
              <div class="col-sm-6 col-xs-6">
                <input 
                  type="text" 
                  v-model="formData.firstName"
                  class="common-input border-gray-100" 
                  placeholder="First Name"
                  required
                />
                <div v-if="errors.firstName" class="text-danger-600 text-sm mt-1">
                  {{ errors.firstName }}
                </div>
              </div>
              <div class="col-sm-6 col-xs-6">
                <input 
                  type="text" 
                  v-model="formData.lastName"
                  class="common-input border-gray-100" 
                  placeholder="Last Name"
                  required
                />
                <div v-if="errors.lastName" class="text-danger-600 text-sm mt-1">
                  {{ errors.lastName }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.businessName"
                  class="common-input border-gray-100" 
                  placeholder="Business Name (Optional)"
                />
              </div>

              <!-- Address Information -->
              <div class="col-12">
                <select 
                  v-model="formData.country"
                  class="common-input border-gray-100" 
                  required
                >
                  <option value="">Select Country</option>
                  <option value="IN">India</option>
                  <option value="US">United States (US)</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.address1"
                  class="common-input border-gray-100" 
                  placeholder="House number and street name"
                  required
                />
                <div v-if="errors.address1" class="text-danger-600 text-sm mt-1">
                  {{ errors.address1 }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.address2"
                  class="common-input border-gray-100" 
                  placeholder="Apartment, suite, unit, etc. (Optional)"
                />
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.city"
                  class="common-input border-gray-100" 
                  placeholder="City"
                  required
                />
                <div v-if="errors.city" class="text-danger-600 text-sm mt-1">
                  {{ errors.city }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.state"
                  class="common-input border-gray-100" 
                  placeholder="State / Province"
                  required
                />
                <div v-if="errors.state" class="text-danger-600 text-sm mt-1">
                  {{ errors.state }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.postCode"
                  class="common-input border-gray-100" 
                  placeholder="Post Code / ZIP"
                  required
                />
                <div v-if="errors.postCode" class="text-danger-600 text-sm mt-1">
                  {{ errors.postCode }}
                </div>
              </div>

              <!-- Contact Information -->
              <div class="col-12">
                <input 
                  type="tel" 
                  v-model="formData.phone"
                  class="common-input border-gray-100" 
                  placeholder="Phone"
                  required
                />
                <div v-if="errors.phone" class="text-danger-600 text-sm mt-1">
                  {{ errors.phone }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="email" 
                  v-model="formData.email"
                  class="common-input border-gray-100" 
                  placeholder="Email Address"
                  required
                />
                <div v-if="errors.email" class="text-danger-600 text-sm mt-1">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Additional Information -->
              <div class="col-12">
                <div class="my-40">
                  <h6 class="text-lg mb-24">Additional Information</h6>
                  <textarea 
                    v-model="formData.notes"
                    class="common-input border-gray-100 min-h-120"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="col-xl-4 col-lg-5">
          <div class="checkout-sidebar">
            <!-- Order Header -->
            <div class="bg-color-three rounded-8 p-24 text-center">
              <span class="text-gray-900 text-xl fw-semibold">Your Orders</span>
            </div>

            <!-- Order Items -->
            <div class="border border-gray-100 rounded-8 px-24 py-40 mt-24">
              <div class="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                <span class="text-gray-900 fw-medium text-xl font-heading-two">Product</span>
                <span class="text-gray-900 fw-medium text-xl font-heading-two">Subtotal</span>
              </div>

              <!-- Order Items List -->
              <div 
                v-for="(item, index) in cartItems" 
                :key="item.id || index"
                class="flex-between gap-24 mb-32"
              >
                <div class="flex-align gap-12">
                  <span class="text-gray-900 fw-normal text-md font-heading-two w-144">
                    {{ item.name }}
                    <div v-if="item.color || item.size" class="variant-info flex-align gap-8 mt-1">
                      <span v-if="item.color" class="text-xs text-gray-500">
                        Color: {{ item.color }}
                      </span>
                      <span v-if="item.size" class="text-xs text-gray-500">
                        Size: {{ Array.isArray(item.size) ? item.size.join(', ') : item.size }}
                      </span>
                    </div>
                  </span>
                  <span class="text-gray-900 fw-normal text-md font-heading-two">
                    <i class="ph-bold ph-x"></i>
                  </span>
                  <span class="text-gray-900 fw-semibold text-md font-heading-two">
                    {{ item.quantity }}
                  </span>
                </div>
                <span class="text-gray-900 fw-bold text-md font-heading-two">
                  ₹{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>

              <!-- Order Totals -->
              <div class="border-top border-gray-100 pt-30 mt-30">
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ subtotal.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Shipping</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    {{ shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toFixed(2)}` }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Tax</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ tax.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-0 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ total.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Payment Methods - Only 2 Options -->
            <div class="mt-32">
              <h6 class="text-lg mb-20 fw-semibold">Select Payment Method</h6>
              
              <!-- Cash on Delivery -->
              <div class="payment-item mb-3">
                <div class="form-check common-check common-radio py-16 mb-0">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedPayment"
                    value="cod"
                    id="paymentCOD"
                  />
                  <label 
                    class="form-check-label fw-semibold text-neutral-600 d-flex align-items-center gap-2" 
                    for="paymentCOD"
                  >
                    <i class="ph ph-money text-main-600"></i>
                    Cash on Delivery
                  </label>
                </div>
                <div 
                  v-show="selectedPayment === 'cod'"
                  class="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative"
                >   
                  <p class="text-gray-800 mb-3">
                    Pay in cash when your order is delivered. 
                    <span class="text-danger-600 fw-bold">₹{{ total.toFixed(2) }}</span> to be paid upon delivery.
                  </p>
                  <p class="text-sm text-gray-600">
                    <i class="ph ph-info text-xs me-1"></i>
                    Delivery executive will collect payment at your doorstep.
                  </p>
                </div>
              </div>
              
              <!-- Online Payment (Razorpay) -->
              <div class="payment-item mb-3">
                <div class="form-check common-check common-radio py-16 mb-0">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedPayment"
                    value="online"
                    id="paymentOnline"
                  />
                  <label 
                    class="form-check-label fw-semibold text-neutral-600 d-flex align-items-center gap-2" 
                    for="paymentOnline"
                  >
                    <i class="ph ph-credit-card text-main-600"></i>
                    Online Payment
                  </label>
                </div>
                <div 
                  v-show="selectedPayment === 'online'"
                  class="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative"
                >   
                  <p class="text-gray-800 mb-3">Pay securely via Razorpay (UPI, Cards, Net Banking, Wallets)</p>
                  <div class="mt-3">
                    <small class="text-gray-600">
                      <i class="ph ph-info text-xs me-1"></i>
                      Payment amount: <strong>₹{{ total.toFixed(2) }}</strong>
                    </small>
                  </div>
                  <div class="payment-options flex-align gap-2 mt-3">
                    <span class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">UPI</span>
                    <span class="badge bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Cards</span>
                    <span class="badge bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Net Banking</span>
                    <span class="badge bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Wallets</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Privacy Policy -->
            <div class="mt-32 pt-32 border-top border-gray-100">
              <p class="text-gray-500">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our 
                <NuxtLink to="/account/profile" class="text-main-600 text-decoration-underline">
                  privacy policy
                </NuxtLink>.
              </p>
            </div>

            <!-- Place Order Button -->
            <button 
              @click="processOrder"
              :disabled="isSubmitting || !isFormValid"
              class="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
              :class="{ 'disabled': isSubmitting || !isFormValid }"
            >
              <span v-if="isSubmitting">
                <i class="ph ph-circle-notch ph-spin"></i> Processing...
              </span>
              <span v-else>
                {{ selectedPayment === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toFixed(2)}` }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status Modal -->
    <div v-if="showPaymentModal" class="payment-modal-overlay">
      <div class="payment-modal">
        <div class="modal-header">
          <h3>Payment Status</h3>
          <button @click="closePaymentModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="paymentStatus === 'success'" class="text-center">
            <div class="success-icon mb-3">
              <i class="ph ph-check-circle text-success-600 text-5xl"></i>
            </div>
            <h4 class="text-success-600 fw-bold mb-2">Payment Successful!</h4>
            <p class="text-gray-600 mb-4">Your payment of ₹{{ total.toFixed(2) }} has been processed successfully.</p>
            <p class="text-sm text-gray-500">Order ID: {{ currentOrderId }}</p>
            <button @click="redirectToSuccess" class="btn btn-success mt-4">
              Continue to Order Confirmation
            </button>
          </div>
          
          <div v-else-if="paymentStatus === 'failed'" class="text-center">
            <div class="failed-icon mb-3">
              <i class="ph ph-x-circle text-danger-600 text-5xl"></i>
            </div>
            <h4 class="text-danger-600 fw-bold mb-2">Payment Failed</h4>
            <p class="text-gray-600 mb-4">{{ paymentErrorMessage || 'Payment could not be processed.' }}</p>
            <button @click="closePaymentModal" class="btn btn-danger mt-2">
              Try Again
            </button>
          </div>
          
          <div v-else class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h4 class="text-primary fw-bold mb-2">Processing Payment</h4>
            <p class="text-gray-600">Please wait while we process your payment...</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// API endpoints
const API_BASE = 'https://api.pranzo.in/common'
const ORDER_CREATE_API = `${API_BASE}/order/create`
const PAYMENT_CREATE_API = `${API_BASE}/payment/create`
const PAYMENT_VERIFY_API = `${API_BASE}/payment/verify`

// Cart items from localStorage
const cartItems = ref([])

// Payment related refs
const showPaymentModal = ref(false)
const isSubmitting = ref(false)
const paymentStatus = ref(null)
const paymentErrorMessage = ref('')
const currentOrderId = ref(null)
const currentPaymentId = ref(null)

// Payment method
const selectedPayment = ref('cod') // Default to COD

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (cartData) {
      cartItems.value = JSON.parse(cartData)
    } else {
      cartItems.value = []
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  }
}

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  businessName: '',
  country: 'IN',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postCode: '',
  phone: '',
  email: '',
  notes: ''
})

// Form validation errors
const errors = reactive({})

// Calculate order totals
const subtotal = computed(() => {
  if (cartItems.value.length === 0) return 0
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCharge = computed(() => {
  return subtotal.value > 500 ? 0 : 50
})

const tax = computed(() => {
  return subtotal.value * 0.18
})

const total = computed(() => {
  return subtotal.value + shippingCharge.value + tax.value
})

// Form validation
const isFormValid = computed(() => {
  return (
    cartItems.value.length > 0 &&
    formData.firstName &&
    formData.lastName &&
    formData.country &&
    formData.address1 &&
    formData.city &&
    formData.state &&
    formData.postCode &&
    formData.phone &&
    formData.email
  )
})

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  let isValid = true

  if (cartItems.value.length === 0) {
    alert('Your cart is empty. Please add items to cart before checkout.')
    router.push('/cart/cart')
    return false
  }

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!formData.address1.trim()) {
    errors.address1 = 'Address is required'
    isValid = false
  }

  if (!formData.city.trim()) {
    errors.city = 'City is required'
    isValid = false
  }

  if (!formData.state.trim()) {
    errors.state = 'State is required'
    isValid = false
  }

  if (!formData.postCode.trim()) {
    errors.postCode = 'Postal code is required'
    isValid = false
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else {
    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit phone number'
      isValid = false
    }
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  return isValid
}

// Load Razorpay SDK
const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Create order in backend
const createOrder = async () => {
  try {
    const response = await fetch(ORDER_CREATE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(total.value), // Amount in rupees
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.address1,
            line2: formData.address2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postCode,
            country: formData.country
          }
        },
        items: cartItems.value.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        }))
      })
    })

    if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`)
    
    const data = await response.json()
    currentOrderId.value = data.orderId
    return data
    
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Create payment in backend
const createPayment = async (orderId) => {
  try {
    const response = await fetch(PAYMENT_CREATE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        amount: Math.round(total.value) // Auto use total amount
      })
    })

    if (!response.ok) throw new Error(`Failed to create payment: ${response.statusText}`)
    
    const data = await response.json()
    currentPaymentId.value = data.paymentId
    return data
    
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}



// Verify payment
const verifyPayment = async (paymentData) => { 
  try { 
    const response = await fetch(PAYMENT_VERIFY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    })
  
    if (!response.ok) throw new Error(`Payment verification failed: ${response.statusText}`)
    
    return await response.json()
    
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

// Initialize Razorpay payment
const initRazorpayPayment = async (paymentData) => {
  try {
    const sdkLoaded = await loadRazorpaySDK()
    if (!sdkLoaded) throw new Error('Failed to load payment gateway')

   const options = {
  key: paymentData.key,
  name: 'Kartmania',
  description: `Order #${currentOrderId.value}`,
  order_id: paymentData.razorpayOrderId,

  handler: async (response) => {
    await verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    })
    await handleSuccessfulPayment()
  },

  prefill: {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    contact: formData.phone
  },

  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true
  },

  theme: { color: '#3b82f6' }
}

    const razorpay = new window.Razorpay(options)
    razorpay.open()
    
  } catch (error) {
    console.error('Error initializing Razorpay:', error)
    paymentStatus.value = 'failed'
    paymentErrorMessage.value = error.message || 'Failed to initialize payment'
    showPaymentModal.value = true
    isSubmitting.value = false
  }
}

// Handle successful payment/order
const handleSuccessfulPayment = async () => {
  try {
    // Save order to localStorage
    const orderData = {
      orderId: currentOrderId.value,
      customer: { ...formData },
      items: cartItems.value,
      paymentMethod: selectedPayment.value === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      subtotal: subtotal.value,
      shipping: shippingCharge.value,
      tax: tax.value,
      total: total.value,
      notes: formData.notes,
      orderDate: new Date().toISOString(), 
      status: 'confirmed',
      paymentStatus: selectedPayment.value === 'cod' ? 'pending' : 'paid'
    } 
  
    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('order_history') || '[]')
    existingOrders.push(orderData)
    localStorage.setItem('order_history', JSON.stringify(existingOrders)) 
    
    // Clear cart
    clearCartAfterOrder()
    
    // Remove form data
    localStorage.removeItem('checkoutFormData')
    
    // Show success modal
    paymentStatus.value = 'success'
    showPaymentModal.value = true
    
  } catch (error) {
    console.error('Error handling successful payment:', error)
    paymentStatus.value = 'failed'
    paymentErrorMessage.value = 'Order placed but failed to save details'
    showPaymentModal.value = true
    isSubmitting.value = false
  }
}

// Clear cart
const clearCartAfterOrder = () => {
  localStorage.removeItem('shopping_cart') 
  cartItems.value = []
}

// Main order processing function
const processOrder = async () => {
  if (!validateForm()) {
    alert('Please fill in all required fields correctly.')
    return
  }

  isSubmitting.value = true
  paymentStatus.value = 'pending'

  try {
    // Create order first
    const orderResult = await createOrder()
    currentOrderId.value = orderResult.orderId
    
    if (selectedPayment.value === 'cod') {
      // Cash on Delivery - directly complete order
      await handleSuccessfulPayment()
    } else {
      // Online Payment - initialize Razorpay
      const paymentResult = await createPayment(orderResult.orderId)
      await initRazorpayPayment(paymentResult)
    }
    
  } catch (error) {
    console.error('Order processing error:', error)
    paymentStatus.value = 'failed'
    paymentErrorMessage.value = error.message || 'Failed to process order'
    showPaymentModal.value = true
    isSubmitting.value = false
  }
}

// Close payment modal
const closePaymentModal = () => {
  showPaymentModal.value = false
  if (paymentStatus.value === 'success') {
    redirectToSuccess()
  }
}

// Redirect to success page
const redirectToSuccess = () => {
  router.push({
    path: '/cart/order-confirmation',
    query: {
      orderId: currentOrderId.value,
      total: total.value.toFixed(2),
      status: 'success',
      paymentMethod: selectedPayment.value === 'cod' ? 'COD' : 'Online'
    }
  })
}

// Handle form submission
const handleSubmit = () => {
  processOrder()
}

// Load user data
const loadUserData = () => {
  const savedData = localStorage.getItem('checkoutFormData')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
  }
}

// Save form data on change
Object.keys(formData).forEach(key => {
  watch(() => formData[key], () => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData))
  })
})

// Load data on mount
onMounted(() => {
  loadCartFromStorage()
  loadUserData()
  
  // Pre-load Razorpay SDK
  loadRazorpaySDK()
  
  // Listen for storage changes
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === 'shopping_cart') {
        loadCartFromStorage()
      }
    })
  }
})

// Cleanup
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', () => {})
  }
})
</script>

<style scoped>
/* Custom styles for checkout page */
.up {
  margin-top: 50px;
}

.common-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.common-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.min-h-120 {
  min-height: 120px;
}

/* Payment methods */
.payment-item {
  margin-bottom: 16px;
}

.payment-item__content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Payment options badges */
.payment-options {
  flex-wrap: wrap;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
}

/* Form check/radio styles */
.form-check.common-check.common-radio {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.form-check-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

/* Button styles */
.btn-main {
  background-color: #3b82f6;
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-main:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-main:disabled,
.btn-main.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal styles */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.payment-modal {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 20px 0;
}

.success-icon,
.failed-icon {
  margin-bottom: 20px;
}

.btn-success {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
  border-color: #3b82f6 transparent #3b82f6 transparent;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Utility classes */
.w-144 {
  width: 144px;
}

.flex-align {
  display: flex;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Responsive */
@media (max-width: 767px) {
  .up {
    margin-top: 30px;
  }
  
  .checkout {
    padding: 30px 0;
  }
  
  .payment-modal {
    padding: 20px;
    width: 95%;
  }
  
  .w-144 {
    width: 100px;
  }
  
  .flex-between.gap-24 {
    gap: 12px;
  }
}

/* Colors */
.text-success-600 { color: #059669; }
.text-danger-600 { color: #dc2626; }
.text-warning-600 { color: #d97706; }
.text-main-600 { color: #3b82f6; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-800 { color: #1f2937; }
.text-gray-900 { color: #111827; }

/* Background colors */
.bg-main-50 { background-color: #eff6ff; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #d1fae5; }
.bg-purple-100 { background-color: #f3e8ff; }
.bg-yellow-100 { background-color: #fef3c7; }

/* Text colors */
.text-blue-800 { color: #1e40af; }
.text-green-800 { color: #065f46; }
.text-purple-800 { color: #5b21b6; }
.text-yellow-800 { color: #92400e; }

/* Borders */
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }

/* Typography */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-md { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-2xl { font-size: 24px; }
.text-5xl { font-size: 48px; }

.fw-normal { font-weight: 400; }
.fw-medium { font-weight: 500; }
.fw-semibold { font-weight: 600; }
.fw-bold { font-weight: 700; }

/* Animations */
.ph-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
