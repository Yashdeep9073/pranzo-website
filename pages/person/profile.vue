<template>
  <section class="account-section py-5 py-md-120">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 col-12">
          <!-- Main Card -->
          <div class="account-card rounded-24 overflow-hidden shadow-lg border-0">
            <!-- Background Gradient Overlay -->
            <div class="account-card__bg position-absolute inset-0 opacity-10"></div>

            <div class="p-32 p-md-48 position-relative z-2">
              <!-- Title -->
              <h3 class="text-center mb-8 fw-bold text-gray-900">
                {{ showRegister ? 'Create Account' : 'Welcome Back!' }}
              </h3>
              <p class="text-center text-gray-600 mb-40">
                {{ showRegister ? 'Sign up to continue shopping' : 'Log in to your account' }}
              </p>

              <!-- Error/Success Messages -->
              <div v-if="errorMessage" class="alert alert-danger mb-32 p-16 rounded-8">
                <div class="flex-align gap-8">
                  <i class="ph ph-warning-circle text-danger-600 text-lg"></i>
                  <span class="text-sm">{{ errorMessage }}</span>
                </div>
              </div>

              <div v-if="successMessage" class="alert alert-success mb-32 p-16 rounded-8">
                <div class="flex-align gap-8">
                  <i class="ph ph-check-circle text-success-600 text-lg"></i>
                  <span class="text-sm">{{ successMessage }}</span>
                </div>
              </div>

              <!-- Login Form -->
              <form v-if="!showRegister" @submit.prevent="handleLogin" class="space-y-24">
                <div>
                  <label class="text-sm fw-semibold text-gray-700 mb-8 d-block">Email <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    v-model="loginForm.email" 
                    class="common-input rounded-12" 
                    placeholder="Enter your email"
                    :disabled="isLoading"
                    required
                  >
                </div>

                <div>
                  <label class="text-sm fw-semibold text-gray-700 mb-8 d-block">Password <span class="text-danger">*</span></label>
                  <div class="position-relative">
                    <input 
                      :type="showLoginPassword ? 'text' : 'password'" 
                      v-model="loginForm.password" 
                      class="common-input rounded-12 pe-56" 
                      placeholder="Enter your password"
                      :disabled="isLoading"
                      required
                    >
                    <button 
                      type="button"
                      @click="showLoginPassword = !showLoginPassword"
                      class="position-absolute top-50 end-0 translate-middle-y me-16 text-gray-500 hover-text-main-600 transition-2"
                      :disabled="isLoading"
                    >
                      <i class="ph text-2xl" :class="showLoginPassword ? 'ph-eye' : 'ph-eye-slash'"></i>
                    </button>
                  </div>
                </div>

                <div class="d-flex flex-wrap align-items-center justify-content-between gap-16">
                  <label class="form-check d-flex align-items-center gap-8 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="loginForm.remember" 
                      class="form-check-input"
                      :disabled="isLoading"
                    >
                    <span class="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" class="text-sm text-main-600 hover-text-decoration-underline fw-medium">
                    Forgot password?
                  </a>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-main w-100 py-16 rounded-16 fw-bold text-lg shadow-main hover-shadow-lg transition-2"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">
                    <i class="ph ph-spinner-gap animate-spin me-8"></i>
                    Logging in...
                  </span>
                  <span v-else>Log In</span>
                </button>
              </form>

              <!-- Register Form -->
              <form v-else @submit.prevent="handleRegister" class="space-y-24">
                <div>
                  <label class="text-sm fw-semibold text-gray-700 mb-8 d-block">Full Name <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    v-model="registerForm.name" 
                    class="common-input rounded-12" 
                    placeholder="Enter your full name"
                    :disabled="isLoading"
                    required
                    :class="{ 'border-danger': errors.name }"
                  >
                  <div v-if="errors.name" class="text-danger text-xs mt-2">
                    {{ errors.name }}
                  </div>
                </div>

                <div>
                  <label class="text-sm fw-semibold text-gray-700 mb-8 d-block">Email Address <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    v-model="registerForm.email" 
                    class="common-input rounded-12" 
                    placeholder="you@example.com"
                    :disabled="isLoading"
                    required
                    :class="{ 'border-danger': errors.email }"
                  >
                  <div v-if="errors.email" class="text-danger text-xs mt-2">
                    {{ errors.email }}
                  </div>
                </div>

                <div>
                  <label class="text-sm fw-semibold text-gray-700 mb-8 d-block">Password <span class="text-danger">*</span></label>
                  <div class="position-relative">
                    <input 
                      :type="showRegisterPassword ? 'text' : 'password'" 
                      v-model="registerForm.password" 
                      class="common-input rounded-12 pe-56" 
                      placeholder="Create strong password"
                      :disabled="isLoading"
                      required
                      :class="{ 'border-danger': errors.password }"
                    >
                    <button 
                      type="button"
                      @click="showRegisterPassword = !showRegisterPassword"
                      class="position-absolute top-50 end-0 translate-middle-y me-16 text-gray-500 hover-text-main-600 transition-2"
                      :disabled="isLoading"
                    >
                      <i class="ph text-2xl" :class="showRegisterPassword ? 'ph-eye' : 'ph-eye-slash'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="text-danger text-xs mt-2">
                    {{ errors.password }}
                  </div>
                  <div class="text-xs text-gray-500 mt-8">
                    • At least 8 characters<br>
                    • Include uppercase, lowercase, number & special character
                  </div>
                </div>

                <div v-if="registerForm.password" class="password-strength">
                  <div class="d-flex gap-8 mb-8">
                    <div v-for="n in 4" :key="n" 
                         class="strength-bar flex-1 h-8 rounded-pill"
                         :class="getStrengthBarClass(n)"></div>
                  </div>
                  <div class="text-xs" :class="getStrengthTextClass()">
                    Password strength: {{ getPasswordStrength() }}
                  </div>
                </div>

                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="registerForm.terms" 
                    class="form-check-input" 
                    id="terms"
                    :disabled="isLoading"
                    required
                  >
                  <label class="form-check-label text-xs text-gray-600 cursor-pointer" for="terms">
                    I agree to the 
                    <a href="#" class="text-main-600 hover-text-decoration-underline">Terms of Service</a> 
                    and 
                    <a href="#" class="text-main-600 hover-text-decoration-underline">Privacy Policy</a>
                  </label>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-main w-100 py-16 rounded-16 fw-bold text-lg shadow-main hover-shadow-lg transition-2"
                  :disabled="isLoading || !registerForm.terms"
                >
                  <span v-if="isLoading">
                    <i class="ph ph-spinner-gap animate-spin me-8"></i>
                    Creating Account...
                  </span>
                  <span v-else>Create Account</span>
                </button>
              </form>

              <!-- Divider -->
              <div class="divider my-40 position-relative">
                <span class="divider-text bg-white px-16 text-sm text-gray-500">Or continue with</span>
              </div>

              <!-- Social Login -->
              <!-- <div class="social-login-buttons d-flex gap-16">
                <button class="btn btn-outline-gray flex-1 py-12 rounded-12 d-flex align-items-center justify-content-center gap-8">
                  <img src="/assets/images/icons/google.svg" alt="Google" class="w-20 h-20">
                  <span class="text-sm fw-medium">Google</span>
                </button>
                <button class="btn btn-outline-gray flex-1 py-12 rounded-12 d-flex align-items-center justify-content-center gap-8">
                  <img src="/assets/images/icons/facebook.svg" alt="Facebook" class="w-20 h-20">
                  <span class="text-sm fw-medium">Facebook</span>
                </button>
              </div> -->

              <!-- Toggle Link -->
              <div class="mt-40 pt-32 border-top border-gray-200 text-center">
                <p class="text-gray-600">
                  {{ showRegister ? 'Already have an account?' : "Don't have an account?" }}
                  <a 
                    href="#" 
                    @click.prevent="toggleForm"
                    class="text-main-600 fw-bold hover-text-decoration-underline ms-4"
                  >
                    {{ showRegister ? 'Log In' : 'Sign Up' }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <CartShop />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import CartShop from '~/components/cartShop.vue'

// API Endpoints
const API_BASE_URL = 'https://kartmania-api.vibrantick.org'
const REGISTER_API = `${API_BASE_URL}/customer/auth/register`
// Note: Login API endpoint not provided, you need to add it

// UI State
const showRegister = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const isLoading = ref(false)

// Messages
const errorMessage = ref('')
const successMessage = ref('')

// Form Data
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  terms: false
})

// Errors
const errors = reactive({
  name: '',
  email: '',
  password: ''
})

// Toggle between login and register
const toggleForm = () => {
  showRegister.value = !showRegister.value
  clearMessages()
  clearErrors()
}

// Clear messages
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// Clear errors
const clearErrors = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
}

// Validate register form
const validateRegisterForm = () => {
  clearErrors()
  let isValid = true

  // Name validation
  if (!registerForm.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (registerForm.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!registerForm.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(registerForm.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!registerForm.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (registerForm.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(registerForm.password)) {
    errors.password = 'Password must include uppercase, lowercase, number and special character'
    isValid = false
  }

  return isValid
}

// Calculate password strength
const getPasswordStrength = () => {
  const password = registerForm.password
  if (!password) return 'None'
  
  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character type checks
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  if (strength <= 2) return 'Weak'
  if (strength <= 4) return 'Medium'
  return 'Strong'
}

const getStrengthBarClass = (n) => {
  const strength = getPasswordStrength()
  if (strength === 'Weak') {
    return n <= 1 ? 'bg-danger' : 'bg-gray-200'
  } else if (strength === 'Medium') {
    return n <= 2 ? 'bg-warning' : 'bg-gray-200'
  } else if (strength === 'Strong') {
    return n <= 3 ? 'bg-success' : 'bg-gray-200'
  }
  return 'bg-gray-200'
}

const getStrengthTextClass = () => {
  const strength = getPasswordStrength()
  if (strength === 'Weak') return 'text-danger'
  if (strength === 'Medium') return 'text-warning'
  if (strength === 'Strong') return 'text-success'
  return 'text-gray-500'
}

// Handle Register
const handleRegister = async () => {
  clearMessages()
  
  if (!validateRegisterForm()) {
    errorMessage.value = 'Please fix the errors above'
    return
  }
  
  if (!registerForm.terms) {
    errorMessage.value = 'Please agree to the terms and conditions'
    return
  }
  
  isLoading.value = true
  
  try {
    const payload = {
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password
    }
    
    console.log('Sending registration data:', payload)
    
    const response = await fetch(REGISTER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed. Please try again.')
    }
    
    // Registration successful
    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    // Reset form
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.terms = false
    
    // Switch to login form after 3 seconds
    setTimeout(() => {
      showRegister.value = false
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'An error occurred. Please try again.'
    
    // Auto-hide error message
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isLoading.value = false
  }
}

// Handle Login (You need to implement this with your login API)
const handleLogin = async () => {
  clearMessages()
  
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Please enter email and password'
    return
  }
  
  isLoading.value = true
  
  try {
    // TODO: Add your login API endpoint here
    // Example:
    // const response = await fetch(`${API_BASE_URL}/customer/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: loginForm.email,
    //     password: loginForm.password
    //   })
    // })
    
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate successful login
    successMessage.value = 'Login successful! Redirecting...'
    
    // Store login info if remember me is checked
    if (loginForm.remember) {
      localStorage.setItem('userEmail', loginForm.email)
    }
    
    // Redirect to dashboard/home
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
    
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Invalid email or password'
    
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isLoading.value = false
  }
}

// Load saved email if remember me was checked
const loadSavedEmail = () => {
  const savedEmail = localStorage.getItem('userEmail')
  if (savedEmail) {
    loginForm.email = savedEmail
    loginForm.remember = true
  }
}

// Load saved email on component mount
onMounted(() => {
  loadSavedEmail()
})
</script>

<style scoped>
.account-section {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
}

.account-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  transition: all 0.4s ease;
}

.account-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.18);
}

.account-card__bg {
  background: linear-gradient(135deg, var(--main-color, #ff6b6b) 0%, #4ecdc4 100%);
}

.common-input {
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  background: white;
}

.common-input:focus {
  border-color: var(--main-color, #ff6b6b);
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15);
  outline: none;
}

.common-input.border-danger {
  border-color: #dc3545 !important;
}

.common-input.border-danger:focus {
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.15);
}

.btn-main {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-main:hover:not(:disabled) {
  background: linear-gradient(135deg, #ee5a52 0%, #d63447 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.btn-main:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-outline-gray {
  border: 2px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
}

.btn-outline-gray:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.space-y-24 > * + * {
  margin-top: 24px;
}

.alert {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 16px;
  animation: slideDown 0.3s ease;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
}

.alert-success {
  background-color: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.2);
}

.text-danger-600 {
  color: #dc3545;
}

.text-success-600 {
  color: #28a745;
}

.divider {
  border-top: 1px solid #e2e8f0;
}

.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 16px;
}

.strength-bar {
  transition: all 0.3s ease;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-gray-200 {
  background-color: #e5e7eb !important;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Password strength colors */
.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #ffc107;
}

.text-success {
  color: #28a745;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .p-32, .p-md-48 {
    padding: 24px !important;
  }
  
  .account-card {
    margin: 16px;
    border-radius: 20px;
  }
  
  .social-login-buttons {
    flex-direction: column;
  }  
}
</style>







