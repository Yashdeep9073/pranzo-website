<template>
  <section class="grievance-redressal py-80">
    <div class="container container-lg">
      <!-- Page Header -->
      <div class="text-center mb-60" data-aos="fade-up">
        <h1 class="mb-24">Grievance Redressal</h1>
        <p class="text-gray-600 max-text-76 mx-auto">
          We value your feedback and are committed to resolving your concerns promptly. 
          Submit your grievance and track its resolution status.
        </p>
      </div>

      <div class="row gy-5">
        <!-- Grievance Form -->
        <div class="col-lg-8">
          <div class="grievance-form-box border border-gray-100 rounded-16 px-24 py-40" data-aos="fade-up" data-aos-duration="200">
            <form @submit.prevent="handleSubmit">
              <h6 class="mb-32">Submit Your Grievance</h6>

              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success mb-32 p-16 rounded-8">
                <div class="flex-align gap-8">
                  <i class="ph ph-check-circle text-success-600 text-lg"></i>
                  <div>
                    <span class="text-sm fw-semibold">Grievance Submitted Successfully!</span>
                    <p class="text-sm mb-0 mt-4">Reference ID: {{ referenceId }}</p>
                  </div>
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
                  <input 
                    type="text" 
                    class="common-input px-16" 
                    id="name" 
                    v-model="formData.name"
                    placeholder="Full name" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.name }" 
                  />
                  <div v-if="errors.name" class="text-danger text-sm mt-2">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Email Address -->
                <div class="col-sm-6 col-xs-6">
                  <label for="email" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Email Address <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input 
                    type="email" 
                    class="common-input px-16" 
                    id="email" 
                    v-model="formData.email"
                    placeholder="Email address" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.email }" 
                  />
                  <div v-if="errors.email" class="text-danger text-sm mt-2">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Phone Number -->
                <div class="col-sm-6 col-xs-6">
                  <label for="phone" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Phone Number <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input 
                    type="tel" 
                    class="common-input px-16" 
                    id="phone" 
                    v-model="formData.phone"
                    placeholder="Phone number" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.phone }" 
                  />
                  <div v-if="errors.phone" class="text-danger text-sm mt-2">
                    {{ errors.phone }}
                  </div>
                </div>

                <!-- Order ID (Optional) -->
                <div class="col-sm-6 col-xs-6">
                  <label for="orderId" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Order ID <span class="text-gray-400 text-sm">(If applicable)</span>
                  </label>
                  <input 
                    type="text" 
                    class="common-input px-16" 
                    id="orderId" 
                    v-model="formData.orderId"
                    placeholder="Order ID" 
                    :disabled="isSubmitting" 
                  />
                </div>

                <!-- Grievance Category -->
                <div class="col-12">
                  <label for="category" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Grievance Category <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <select 
                    class="common-input px-16" 
                    id="category" 
                    v-model="formData.category"
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.category }"
                  >
                    <option value="">Select Category</option>
                    <option value="product-quality">Product Quality Issue</option>
                    <option value="delivery">Delivery Problem</option>
                    <option value="payment">Payment Dispute</option>
                    <option value="refund">Refund/Cancellation</option>
                    <option value="service">Customer Service</option>
                    <option value="website">Website/App Issue</option>
                    <option value="other">Other</option>
                  </select>
                  <div v-if="errors.category" class="text-danger text-sm mt-2">
                    {{ errors.category }}
                  </div>
                </div>

                <!-- Subject -->
                <div class="col-12">
                  <label for="subject" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Subject <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    class="common-input px-16" 
                    id="subject" 
                    v-model="formData.subject"
                    placeholder="Brief subject of your grievance" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.subject }" 
                  />
                  <div v-if="errors.subject" class="text-danger text-sm mt-2">
                    {{ errors.subject }}
                  </div>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label for="description" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Detailed Description <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <textarea 
                    class="common-input px-16" 
                    id="description" 
                    v-model="formData.description"
                    rows="5"
                    placeholder="Please provide detailed information about your grievance..." 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.description }"
                  ></textarea>
                  <div v-if="errors.description" class="text-danger text-sm mt-2">
                    {{ errors.description }}
                  </div>
                </div>

                <!-- File Upload -->
                <div class="col-12">
                  <label class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Attachments <span class="text-gray-400 text-sm">(Optional - Max 5MB per file)</span>
                  </label>
                  <div class="file-upload-wrapper">
                    <input 
                      type="file" 
                      id="attachments" 
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      @change="handleFileUpload"
                      class="file-input"
                      :disabled="isSubmitting"
                    />
                    <label for="attachments" class="file-upload-label">
                      <i class="ph ph-upload-simple text-main-600"></i>
                      <span>Choose files or drag and drop</span>
                    </label>
                    <div v-if="files.length > 0" class="mt-16">
                      <div v-for="(file, index) in files" :key="index" class="file-item flex-align gap-8 mb-8">
                        <i class="ph ph-file-text text-gray-400"></i>
                        <span class="text-sm">{{ file.name }}</span>
                        <button type="button" @click="removeFile(index)" class="text-danger hover:text-danger-600">
                          <i class="ph ph-x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button 
                    type="submit" 
                    class="btn btn-main py-12 px-24 rounded-8"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="flex-align gap-8">
                      <span class="spinner-border spinner-border-sm" role="status"></span>
                      Submitting...
                    </span>
                    <span v-else>Submit Grievance</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar Information -->
        <div class="col-lg-4">
          <!-- Track Grievance -->
          <div class="track-grievance-box border border-gray-100 rounded-16 px-24 py-40 mb-24" data-aos="fade-up" data-aos-duration="400">
            <h6 class="mb-24">Track Your Grievance</h6>
            <form @submit.prevent="trackGrievance">
              <div class="mb-16">
                <label for="trackingId" class="text-sm font-heading-two text-gray-900 fw-semibold mb-8 d-block">
                  Reference ID
                </label>
                <input 
                  type="text" 
                  class="common-input px-16" 
                  id="trackingId" 
                  v-model="trackingId"
                  placeholder="Enter reference ID" 
                  :disabled="isTracking"
                />
              </div>
              <button 
                type="submit" 
                class="btn btn-outline-main py-8 px-16 rounded-6 text-sm w-100"
                :disabled="isTracking"
              >
                <span v-if="isTracking" class="flex-align gap-8 justify-content-center">
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  Tracking...
                </span>
                <span v-else>Track Status</span>
              </button>
            </form>
            
            <!-- Tracking Result -->
            <div v-if="trackingResult" class="mt-24 p-16 bg-gray-50 rounded-8">
              <div class="flex-align gap-8 mb-12">
                <i class="ph ph-info-circle text-main-600"></i>
                <span class="text-sm fw-semibold">Status: {{ trackingResult.status }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-8">Last Updated: {{ formatDate(trackingResult.lastUpdated) }}</p>
              <p class="text-sm">{{ trackingResult.message }}</p>
            </div>
          </div>

          <!-- Resolution Timeline -->
          <div class="timeline-box border border-gray-100 rounded-16 px-24 py-40 mb-24" data-aos="fade-up" data-aos-duration="600">
            <h6 class="mb-24">Resolution Timeline</h6>
            <div class="timeline-list">
              <div class="timeline-item flex-align gap-12 mb-20">
                <div class="timeline-icon flex-shrink-0 w-24 h-24 bg-main-100 rounded-circle flex-center">
                  <i class="ph ph-check text-main-600 text-sm"></i>
                </div>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Acknowledgment</h6>
                  <p class="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
              <div class="timeline-item flex-align gap-12 mb-20">
                <div class="timeline-icon flex-shrink-0 w-24 h-24 bg-main-100 rounded-circle flex-center">
                  <i class="ph ph-magnifying-glass text-main-600 text-sm"></i>
                </div>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Investigation</h6>
                  <p class="text-sm text-gray-600">2-3 working days</p>
                </div>
              </div>
              <div class="timeline-item flex-align gap-12 mb-20">
                <div class="timeline-icon flex-shrink-0 w-24 h-24 bg-main-100 rounded-circle flex-center">
                  <i class="ph ph-check-circle text-main-600 text-sm"></i>
                </div>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Resolution</h6>
                  <p class="text-sm text-gray-600">5-7 working days</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="contact-info-box border border-gray-100 rounded-16 px-24 py-40" data-aos="fade-up" data-aos-duration="800">
            <h6 class="mb-24">Need Immediate Help?</h6>
            <div class="contact-list">
              <div class="contact-item flex-align gap-12 mb-16">
                <i class="ph ph-phone text-main-600"></i>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Helpline</h6>
                  <p class="text-sm text-gray-600 mb-0">+91 99154 00090</p>
                </div>
              </div>
              <div class="contact-item flex-align gap-12 mb-16">
                <i class="ph ph-envelope text-main-600"></i>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Email</h6>
                  <p class="text-sm text-gray-600 mb-0">support@pranzo.com</p>
                </div>
              </div>
              <div class="contact-item flex-align gap-12">
                <i class="ph ph-clock text-main-600"></i>
                <div>
                  <h6 class="text-sm fw-semibold mb-4">Working Hours</h6>
                  <p class="text-sm text-gray-600 mb-0">Mon-Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section mt-80" data-aos="fade-up">
        <div class="text-center mb-48">
          <h4 class="mb-16">Frequently Asked Questions</h4>
          <p class="text-gray-600">Find quick answers to common questions</p>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="faq-accordion">
              <div 
                v-for="(faq, index) in faqs" 
                :key="index" 
                class="faq-item border border-gray-100 rounded-8 mb-16"
              >
                <button 
                  class="faq-question w-100 text-start px-24 py-16 bg-transparent border-0 d-flex align-items-center justify-content-between gap-16"
                  @click="toggleFaq(index)"
                >
                  <span class="text-sm fw-semibold">{{ faq.question }}</span>
                  <i 
                    class="ph ph-chevron-down transition-all" 
                    :class="{ 'rotate-180': faq.isOpen }"
                  ></i>
                </button>
                <div v-show="faq.isOpen" class="faq-answer px-24 pb-16">
                  <p class="text-sm text-gray-600 mb-0">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Page Meta
useHead({
  title: 'Grievance Redressal - Pranzo',
  meta: [
    { name: 'description', content: 'Submit and track your grievances with Pranzo. We are committed to resolving your concerns promptly.' }
  ]
})

// Form State
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const referenceId = ref('')
const files = ref([])

// Form Data
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  orderId: '',
  category: '',
  subject: '',
  description: ''
})

// Form Errors
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  category: '',
  subject: '',
  description: ''
})

// Tracking State
const trackingId = ref('')
const isTracking = ref(false)
const trackingResult = ref(null)

// FAQ Data
const faqs = ref([
  {
    question: 'How long does it take to resolve a grievance?',
    answer: 'Most grievances are resolved within 5-7 working days. Complex issues may take longer, and we will keep you updated on the progress.',
    isOpen: false
  },
  {
    question: 'Can I submit a grievance without an order ID?',
    answer: 'Yes, you can submit a grievance without an order ID. However, if your grievance is related to a specific order, providing the order ID helps us resolve it faster.',
    isOpen: false
  },
  {
    question: 'What happens after I submit my grievance?',
    answer: 'You will receive an acknowledgment email with a reference ID within 24 hours. Our team will then investigate your grievance and provide a resolution.',
    isOpen: false
  },
  {
    question: 'How can I track the status of my grievance?',
    answer: 'You can track your grievance status using the reference ID provided in the acknowledgment email. Simply enter the reference ID in the tracking section on this page.',
    isOpen: false
  },
  {
    question: 'What if I\'m not satisfied with the resolution?',
    answer: 'If you\'re not satisfied with the initial resolution, you can request an escalation within 3 days. Your grievance will be reviewed by a senior team member.',
    isOpen: false
  }
])

// Form Validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Full name is required'
    isValid = false
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit phone number'
    isValid = false
  }

  // Category validation
  if (!formData.category) {
    errors.category = 'Please select a grievance category'
    isValid = false
  }

  // Subject validation
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required'
    isValid = false
  }

  // Description validation
  if (!formData.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  } else if (formData.description.length < 20) {
    errors.description = 'Description must be at least 20 characters long'
    isValid = false
  }

  return isValid
}

// Submit Form
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  showError.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate reference ID
    referenceId.value = 'GRV' + Date.now().toString().slice(-8)

    // Show success message
    showSuccess.value = true

    // Reset form
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
    files.value = []

    // Scroll to success message
    setTimeout(() => {
      document.querySelector('.alert-success')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

  } catch (error) {
    showError.value = true
    errorMessage.value = 'Failed to submit grievance. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// File Upload Handler
const handleFileUpload = (event) => {
  const uploadedFiles = Array.from(event.target.files)
  
  // Validate file size (5MB max)
  const validFiles = uploadedFiles.filter(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} is larger than 5MB and will be ignored.`)
      return false
    }
    return true
  })

  files.value = [...files.value, ...validFiles].slice(0, 5) // Max 5 files
}

// Remove File
const removeFile = (index) => {
  files.value.splice(index, 1)
}

// Track Grievance
const trackGrievance = async () => {
  if (!trackingId.value.trim()) return

  isTracking.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock tracking result
    trackingResult.value = {
      status: 'Under Investigation',
      lastUpdated: new Date().toISOString(),
      message: 'Your grievance is currently under review by our team. We will update you within 24 hours.'
    }

  } catch (error) {
    trackingResult.value = {
      status: 'Error',
      lastUpdated: new Date().toISOString(),
      message: 'Unable to fetch grievance status. Please check your reference ID and try again.'
    }
  } finally {
    isTracking.value = false
  }
}

// Toggle FAQ
const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

// Format Date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.grievance-redressal {
  background-color: #f8f9fa;
}

.grievance-form-box,
.track-grievance-box,
.timeline-box,
.contact-info-box {
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grievance-form-box:hover,
.track-grievance-box:hover,
.timeline-box:hover,
.contact-info-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.file-upload-label:hover {
  border-color: var(--main-color);
  background-color: #f0f8ff;
}

.file-item {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.timeline-item {
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 36px;
  width: 2px;
  height: 32px;
  background-color: #e0e0e0;
}

.faq-item {
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--main-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.faq-question {
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.rotate-180 {
  transform: rotate(180deg);
}

.spinner-border-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.btn-main {
  background-color: var(--main-color);
  border-color: var(--main-color);
  color: white;
}

.btn-main:hover {
  background-color: var(--main-hover);
  border-color: var(--main-hover);
  color: white;
}

.btn-outline-main {
  border-color: var(--main-color);
  color: var(--main-color);
}

.btn-outline-main:hover {
  background-color: var(--main-color);
  color: white;
}

.text-main-600 {
  color: var(--main-color);
}

.bg-main-100 {
  background-color: rgba(var(--main-color-rgb), 0.1);
}

.border-danger {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545;
}

.text-danger-600 {
  color: #dc3545;
}

.text-success-600 {
  color: #198754;
}

.bg-gray-50 {
  background-color: #f8f9fa;
}

.text-gray-400 {
  color: #6c757d;
}

.text-gray-600 {
  color: #6c757d;
}

.border-gray-100 {
  border-color: #e0e0e0;
}

.max-text-76 {
  max-width: 760px;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .grievance-redressal {
    padding: 40px 0;
  }
  
  .px-24 {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .py-40 {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
  }
}
</style>
