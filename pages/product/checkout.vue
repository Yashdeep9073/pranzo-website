<template>
  <section class="checkout py-80">
    <div class="container container-lg">
      <!-- Coupon Banner -->
      <div class="border border-gray-100 rounded-8 px-30 py-20 mb-40">
        <span class="">
          Have a coupon? 
          <NuxtLink 
            to="/cart" 
            class="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
          >
            Click here to enter your code
          </NuxtLink>
        </span>
      </div>

      <div class="row">
        <!-- Checkout Form -->
        <div class="col-xl-9 col-lg-8">
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
                  <option value="US">United States (US)</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
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
        <div class="col-xl-3 col-lg-4">
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
                v-for="item in orderItems" 
                :key="item.id"
                class="flex-between gap-24 mb-32"
              >
                <div class="flex-align gap-12">
                  <span class="text-gray-900 fw-normal text-md font-heading-two w-144">
                    {{ item.name }}
                  </span>
                  <span class="text-gray-900 fw-normal text-md font-heading-two">
                    <i class="ph-bold ph-x"></i>
                  </span>
                  <span class="text-gray-900 fw-semibold text-md font-heading-two">
                    {{ item.quantity }}
                  </span>
                </div>
                <span class="text-gray-900 fw-bold text-md font-heading-two">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>

              <!-- Order Totals -->
              <div class="border-top border-gray-100 pt-30 mt-30">
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ${{ subtotal.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Shipping</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    {{ shippingCharge === 0 ? 'Free' : `$${shippingCharge.toFixed(2)}` }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Tax</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ${{ tax.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-0 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ${{ total.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="mt-32">
              <div class="payment-item" v-for="method in paymentMethods" :key="method.id">
                <div class="form-check common-check common-radio py-16 mb-0">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedPayment"
                    :value="method.id"
                    :id="`payment${method.id}`"
                  />
                  <label 
                    class="form-check-label fw-semibold text-neutral-600" 
                    :for="`payment${method.id}`"
                  >
                    {{ method.name }}
                  </label>
                </div>
                <div 
                  v-show="selectedPayment === method.id"
                  class="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative"
                >   
                  <p class="text-gray-800">{{ method.description }}</p>
                </div>
              </div>
            </div>

            <!-- Privacy Policy -->
            <div class="mt-32 pt-32 border-top border-gray-100">
              <p class="text-gray-500">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our 
                <NuxtLink to="/privacy-policy" class="text-main-600 text-decoration-underline">
                  privacy policy
                </NuxtLink>.
              </p>
            </div>

            <!-- Place Order Button -->
            <button 
              @click="placeOrder"
              :disabled="isSubmitting || !isFormValid"
              class="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
              :class="{ 'disabled': isSubmitting || !isFormValid }"
            >
              <span v-if="isSubmitting">
                <i class="ph ph-circle-notch ph-spin"></i> Processing...
              </span>
              <span v-else>
                Place Order
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <CartShop/>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import CartShop from '~/components/cartShop.vue'

const router = useRouter()

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  businessName: '',
  country: '',
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

// Order items
const orderItems = ref([
  {
    id: 1,
    name: 'HP Chromebook With Intel Celeron',
    price: 250.00,
    quantity: 1
  },
  {
    id: 2,
    name: 'HP Chromebook With Intel Celeron',
    price: 250.00,
    quantity: 1
  },
  {
    id: 3,
    name: 'HP Chromebook With Intel Celeron',
    price: 250.00,
    quantity: 1
  },
  {
    id: 4,
    name: 'HP Chromebook With Intel Celeron',
    price: 250.00,
    quantity: 1
  }
])

// Payment methods
const paymentMethods = ref([
  {
    id: 1,
    name: 'Direct Bank Transfer',
    description: 'Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.'
  },
  {
    id: 2,
    name: 'Check Payments',
    description: 'Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.'
  },
  {
    id: 3,
    name: 'Cash on Delivery',
    description: 'Pay with cash upon delivery. Additional fees may apply.'
  }
])

const selectedPayment = ref(1) // Default to Direct Bank Transfer

// Form submission state
const isSubmitting = ref(false)

// Calculate order totals
const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCharge = computed(() => {
  return subtotal.value > 100 ? 0 : 15 // Free shipping over $100
})

const tax = computed(() => {
  return subtotal.value * 0.08 // 8% tax
})

const total = computed(() => {
  return subtotal.value + shippingCharge.value + tax.value
})

// Form validation
const isFormValid = computed(() => {
  return (
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
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Required fields validation
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
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
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

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    placeOrder()
  }
}

// Place order function
const placeOrder = async () => {
  if (!validateForm()) {
    alert('Please fill in all required fields correctly.')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare order data
    const orderData = {
      customer: { ...formData },
      items: orderItems.value,
      paymentMethod: paymentMethods.value.find(m => m.id === selectedPayment.value)?.name,
      subtotal: subtotal.value,
      shipping: shippingCharge.value,
      tax: tax.value,
      total: total.value,
      notes: formData.notes,
      orderDate: new Date().toISOString()
    }

    // In a real app, you would send this to your backend API
    console.log('Order Data:', orderData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show success message
    alert('Order placed successfully! Thank you for your purchase.')
    
    // Redirect to order confirmation page
    router.push('/order-confirmation')
    
  } catch (error) {
    console.error('Error placing order:', error)
    alert('There was an error processing your order. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Pre-fill form from localStorage or user session if available
const loadUserData = () => {
  const savedData = localStorage.getItem('checkoutFormData')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
  }
}

// Save form data to localStorage on change
Object.keys(formData).forEach(key => {
  watch(() => formData[key], () => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData))
  })
})

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* Custom styles for checkout page */
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

.common-input.border-gray-100 {
  border-color: #f3f4f6;
}

.common-input.border-gray-100:focus {
  border-color: #3b82f6;
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

/* Error message styles */
.text-danger-600 {
  color: #dc2626;
}

/* Responsive adjustments */
@media (max-width: 1199px) {
  .pe-xl-5 {
    padding-right: 0;
  }
}

@media (max-width: 991px) {
  .col-xl-9,
  .col-lg-8,
  .col-xl-3,
  .col-lg-4 {
    width: 100%;
  }
  
  .checkout-sidebar {
    margin-top: 40px;
  }
}

@media (max-width: 767px) {
  .checkout {
    padding: 40px 0;
  }
  
  .border.border-gray-100.rounded-8.px-30.py-20.mb-40 {
    padding: 16px;
    margin-bottom: 30px;
  }
  
  .border.border-gray-100.rounded-8.px-24.py-40.mt-24 {
    padding: 20px;
  }
  
  .w-144 {
    width: 120px;
  }
  
  .flex-between.gap-24 {
    gap: 12px;
  }
}

/* Grid system styles */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -12px;
}

.gy-3 {
  row-gap: 12px;
}

.col-sm-6,
.col-xs-6,
.col-12 {
  padding: 12px;
}

/* Typography */
.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-md {
  font-size: 16px;
}

.text-sm {
  font-size: 14px;
}

.fw-semibold {
  font-weight: 600;
}

.fw-bold {
  font-weight: 700;
}

.fw-normal {
  font-weight: 400;
}

.fw-medium {
  font-weight: 500;
}

/* Spacing */
.mb-24 {
  margin-bottom: 24px;
}

.mb-32 {
  margin-bottom: 32px;
}

.mb-40 {
  margin-bottom: 40px;
}

.mt-24 {
  margin-top: 24px;
}

.mt-32 {
  margin-top: 32px;
}

.mt-40 {
  margin-top: 40px;
}

.mt-56 {
  margin-top: 56px;
}

.py-80 {
  padding-top: 80px;
  padding-bottom: 80px;
}

/* Borders */
.border-gray-100 {
  border-color: #f3f4f6;
}

.border-bottom {
  border-bottom: 1px solid;
}

.border-top {
  border-top: 1px solid;
}

/* Backgrounds */
.bg-color-three {
  background-color: #f9fafb;
}

.bg-main-50 {
  background-color: #f8f9fa;
}

/* Flex utilities */
.flex-align {
  display: flex;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Border radius */
.rounded-8 {
  border-radius: 8px;
}

/* Colors */
.text-gray-900 {
  color: #111827;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-200 {
  color: #e5e7eb;
}

.text-neutral-600 {
  color: #525252;
}

.text-main-600 {
  color: #3b82f6;
}

.hover-text-main-600:hover {
  color: #3b82f6;
}

/* Links */
.text-decoration-underline {
  text-decoration: underline;
}

.hover-text-decoration-underline:hover {
  text-decoration: underline;
}
</style>