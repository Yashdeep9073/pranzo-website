<template>
  <section class="contact py-80">
    <div class="container container-lg">
      <div class="row gy-5">
        <!-- Contact Form -->
        <div class="col-lg-8">
          <div class="contact-box border border-gray-100 rounded-16 px-24 py-40">
            <form @submit.prevent="handleSubmit">
              <h6 class="mb-32">Make Custom Request</h6>

              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success mb-32 p-16 rounded-8">
                <div class="flex-align gap-8">
                  <i class="ph ph-check-circle text-success-600 text-lg"></i>
                  <span class="text-sm">Your message has been sent successfully!</span>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="showError" class="alert alert-danger mb-32 p-16 rounded-8">
                <div class="flex-align gap-8">
                  <i class="ph ph-warning-circle text-danger-600 text-lg"></i>
                  <span class="text-sm">{{ errorMessage }}</span>
                </div>
              </div>

              <div class="row gy-4">
                <!-- Full Name -->
                <div class="col-sm-6 col-xs-6">
                  <label for="name" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Full Name <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input type="text" class="common-input px-16" id="name" v-model="formData.name"
                    placeholder="Full name" :disabled="isSubmitting" :class="{ 'border-danger': errors.name }" />
                  <div v-if="errors.name" class="text-danger text-sm mt-2">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Email Address -->
                <div class="col-sm-6 col-xs-6">
                  <label for="email" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Email Address <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input type="email" class="common-input px-16" id="email" v-model="formData.email"
                    placeholder="Email address" :disabled="isSubmitting" :class="{ 'border-danger': errors.email }" />
                  <div v-if="errors.email" class="text-danger text-sm mt-2">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Phone Number -->
                <div class="col-sm-6 col-xs-6">
                  <label for="phone" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Phone Number <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input type="tel" class="common-input px-16" id="phone" v-model="formData.phone"
                    placeholder="Phone Number" :disabled="isSubmitting" :class="{ 'border-danger': errors.phone }" />
                  <div v-if="errors.phone" class="text-danger text-sm mt-2">
                    {{ errors.phone }}
                  </div>
                </div>

                <!-- Subject -->
                <div class="col-sm-6 col-xs-6">
                  <label for="subject" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Subject <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input type="text" class="common-input px-16" id="subject" v-model="formData.subject"
                    placeholder="Subject" :disabled="isSubmitting" :class="{ 'border-danger': errors.subject }" />
                  <div v-if="errors.subject" class="text-danger text-sm mt-2">
                    {{ errors.subject }}
                  </div>
                </div>

                <!-- Message -->
                <div class="col-sm-12">
                  <label for="message" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Message <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <textarea class="common-input px-16" id="message" v-model="formData.message"
                    placeholder="Type your message" rows="5" :disabled="isSubmitting"
                    :class="{ 'border-danger': errors.message }"></textarea>
                  <div v-if="errors.message" class="text-danger text-sm mt-2">
                    {{ errors.message }}
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="col-sm-12 mt-32">
                  <button type="submit" class="btn btn-main py-18 px-32 rounded-8 flex-center gap-8"
                    :disabled="isSubmitting">
                    <span v-if="isSubmitting">
                      <i class="ph ph-spinner-gap animate-spin"></i>
                      Sending...
                    </span>
                    <span v-else>
                      Get a Quote
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-lg-4">
          <!-- Contact Details -->
          <div class="contact-box border border-gray-100 rounded-16 px-24 py-40">
            <h6 class="mb-48">Get In Touch</h6>

            <!-- Phone -->
            <div class="flex-align gap-16 mb-16">
              <span
                class="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                <i class="ph-fill ph-phone-call"></i>
              </span>
              <a href="tel:+00123456789" class="text-md text-gray-900 hover-text-main-600">
                +00 123 456 789
              </a>
            </div>

            <!-- Email -->
            <div class="flex-align gap-16 mb-16">
              <span
                class="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                <i class="ph-fill ph-envelope"></i>
              </span>
              <a href="mailto:support24@marketpro.com" class="text-md text-gray-900 hover-text-main-600">
                support24@marketpro.com
              </a>
            </div>

            <!-- Address -->
            <div class="flex-align gap-16 mb-0">
              <span
                class="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                <i class="ph-fill ph-map-pin"></i>
              </span>
              <span class="text-md text-gray-900">
                789 Inner Lane, California, USA
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-24 flex-align flex-wrap gap-16">
            <!-- Support Call -->
            <NuxtLink to="/support"
              class="bg-neutral-600 hover-bg-main-600 rounded-8 p-10 px-16 flex-between flex-wrap gap-8 flex-grow-1 transition-all duration-300">
              <span class="text-white fw-medium">Get Support On Call</span>
              <span class="w-36 h-36 bg-main-600 rounded-8 flex-center text-xl text-white">
                <i class="ph ph-headset"></i>
              </span>
            </NuxtLink>

            <!-- Get Direction -->
            <NuxtLink to="/location"
              class="bg-neutral-600 hover-bg-main-600 rounded-8 p-10 px-16 flex-between flex-wrap gap-8 flex-grow-1 transition-all duration-300">
              <span class="text-white fw-medium">Get Direction</span>
              <span class="w-36 h-36 bg-main-600 rounded-8 flex-center text-xl text-white">
                <i class="ph ph-map-pin"></i>
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
  <CartShop />
</template>

<script setup>
import { ref, reactive } from 'vue'
import CartShop from '~/components/cartShop.vue'
const config = useRuntimeConfig();
// API endpoint
// const API_URL = 'https://kartmania-api.vibrantick.org/common/contact-us/create'
const API_URL = config.public.api.contact;

// Form state
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

// Error state
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

// UI state
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Validation function
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Phone validation
  const phoneRegex = /^[+]?[0-9\s\-()]{10,15}$/
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number (10-15 digits)'
    isValid = false
  }

  // Subject validation
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required'
    isValid = false
  } else if (formData.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters'
    isValid = false
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters'
    isValid = false
  } else if (formData.message.trim().length > 1000) {
    errors.message = 'Message should not exceed 1000 characters'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  // Reset messages
  showSuccess.value = false
  showError.value = false
  errorMessage.value = ''

  // Validate form
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      // Add any additional required fields
      createdAt: new Date().toISOString()
    }

    // Make API call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submitData)
    })

    const result = await response.json()

    if (!response.ok) {
      // Handle API errors
      throw new Error(result.message || 'Failed to send message. Please try again.')
    }

    // Success handling
    showSuccess.value = true

    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '')

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error submitting form:', error)

    // Show error message
    showError.value = true
    errorMessage.value = error.message || 'Something went wrong. Please try again.'

    // Hide error message after 5 seconds
    setTimeout(() => {
      showError.value = false
      errorMessage.value = ''
    }, 5000)

  } finally {
    isSubmitting.value = false
  }
}

// Auto-format phone number
const formatPhoneNumber = () => {
  let phone = formData.phone.replace(/\D/g, '')

  if (phone.length > 3 && phone.length <= 6) {
    formData.phone = phone.replace(/(\d{3})(\d+)/, '$1-$2')
  } else if (phone.length > 6 && phone.length <= 10) {
    formData.phone = phone.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3')
  } else if (phone.length > 10) {
    formData.phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d+)/, '$1-$2-$3-$4')
  }
}

// Watch phone input for formatting
watch(() => formData.phone, () => {
  if (formData.phone.length > 0) {
    formatPhoneNumber()
  }
})
</script>

<style scoped>
/* Form Styles */
.contact-box {
  background: white;
  transition: all 0.3s ease;
}

.contact-box:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Input Styles */
.common-input {
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  background: white;
}

.common-input:focus {
  border-color: var(--main-600);
  box-shadow: 0 0 0 3px rgba(var(--main-600-rgb), 0.1);
  outline: none;
  background: white;
}

.common-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #f9fafb;
}

.common-input.border-danger {
  border-color: #dc3545 !important;
}

.common-input.border-danger:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

textarea.common-input {
  resize: vertical;
  min-height: 120px;
}

/* Button Styles */
.btn-main {
  background-color: var(--main-600);
  color: white;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-main:hover:not(:disabled) {
  background-color: var(--main-700);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-main:active:not(:disabled) {
  transform: translateY(0);
}

.btn-main:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Alert Styles */
.alert {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 16px;
  animation: slideDown 0.3s ease;
}

.alert-success {
  background-color: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.2);
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
}

.text-success-600 {
  color: #28a745;
}

.text-danger-600 {
  color: #dc3545;
}

/* Animation for alerts */
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

/* Spinner animation */
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

/* Contact Info Items */
.flex-align.gap-16 {
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.flex-align.gap-16:hover {
  background-color: rgba(249, 250, 251, 1);
  transform: translateX(5px);
}

/* Action Buttons */
.bg-neutral-600 {
  background-color: #4b5563;
  transition: all 0.3s ease;
}

.bg-neutral-600:hover {
  background-color: var(--main-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-box {
    padding: 20px !important;
  }

  .px-24 {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .py-40 {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
  }

  .flex-grow-1 {
    min-width: 100%;
  }
}

/* Loading state for button */
.btn-main::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-main:disabled::after {
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

/* Error text styling */
.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Required field indicator */
.text-danger.text-xl {
  color: #dc3545;
  font-size: 1.25rem;
  line-height: 1;
}

/* Placeholder styling */
::placeholder {
  color: #9ca3af;
  opacity: 1;
}

:-ms-input-placeholder {
  color: #9ca3af;
}

::-ms-input-placeholder {
  color: #9ca3af;
}
</style>