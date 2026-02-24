<template>
  <section class="cancellation-returns min-vh-100 py-80">
    <div class="container container-lg">
      <!-- Page Header -->
      <div class="text-center mb-60" data-aos="fade-up">
        <div class="d-inline-flex align-items-center justify-content-center mb-24">
          <div class="bg-gradient-main p-16 rounded-16 me-16">
            <i class="ph ph-arrow-counter-clockwise text-white text-32"></i>
          </div>
          <h1 class="mb-0">Cancellation & Returns</h1>
        </div>
        <p class="text-gray-600 max-text-76 mx-auto">
          Easy returns and cancellations for your peace of mind. Read our policies and initiate returns/cancellations online.
        </p>
      </div>

      <div class="row gy-5">
        <!-- Return Request Form -->
        <div class="col-lg-8">
          <div class="return-form-box bg-white border-0 shadow-sm rounded-24 p-32" data-aos="fade-up" data-aos-duration="200">
            <div class="form-tabs mb-40">
              <div class="d-flex bg-gray-50 p-4 rounded-12">
                <button 
                  class="tab-btn flex-1 px-20 py-12 rounded-8 text-sm fw-semibold transition-all"
                  :class="{ 
                    'active bg-white text-main-600 shadow-sm': activeTab === 'return',
                    'text-gray-600 hover:text-gray-900': activeTab !== 'return'
                  }"
                  @click="activeTab = 'return'"
                >
                  <i class="ph ph-arrow-counter-clockwise me-8"></i>
                  Return Item
                </button>
                <button 
                  class="tab-btn flex-1 px-20 py-12 rounded-8 text-sm fw-semibold transition-all ms-8"
                  :class="{ 
                    'active bg-white text-main-600 shadow-sm': activeTab === 'cancel',
                    'text-gray-600 hover:text-gray-900': activeTab !== 'cancel'
                  }"
                  @click="activeTab = 'cancel'"
                >
                  <i class="ph ph-x-circle me-8"></i>
                  Cancel Order
                </button>
              </div>
            </div>

            <!-- Return Form -->
            <form v-if="activeTab === 'return'" @submit.prevent="handleReturnSubmit">
              <!-- Progress Indicator -->
              <div class="progress-indicator mb-40">
                <div class="d-flex align-items-center justify-content-between mb-16">
                  <div class="progress-step" v-for="step in totalSteps" :key="step">
                    <div 
                      class="step-circle d-flex align-items-center justify-content-center rounded-circle mb-8"
                      :class="{ 
                        'bg-main-600 text-white': step <= currentStep,
                        'bg-gray-200 text-gray-500': step > currentStep 
                      }"
                    >
                      <i v-if="step < currentStep" class="ph ph-check text-14"></i>
                      <span v-else class="text-12 fw-semibold">{{ step }}</span>
                    </div>
                    <span 
                      class="step-label text-xs text-center"
                      :class="{ 
                        'text-main-600 fw-semibold': step <= currentStep,
                        'text-gray-500': step > currentStep 
                      }"
                    >
                      {{ getStepLabel(step, 'return') }}
                    </span>
                  </div>
                </div>
                <div class="progress-bar bg-gray-200 rounded-full overflow-hidden" style="height: 4px;">
                  <div 
                    class="progress-fill bg-gradient-main transition-all duration-300"
                    :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                  ></div>
                </div>
              </div>

              <h6 class="mb-32">Request Return</h6>

              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success mb-32 p-20 rounded-16 border-0 bg-success-50">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-success-100 p-8 rounded-circle">
                    <i class="ph ph-check-circle text-success-600 text-20"></i>
                  </div>
                  <div class="flex-1">
                    <span class="text-sm fw-semibold text-success-900">Return Request Submitted!</span>
                    <p class="text-sm text-success-700 mb-0 mt-4">Return ID: {{ returnId }}</p>
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
                <!-- Order ID -->
                <div class="col-12">
                  <label for="orderId" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Order ID <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <div class="input-group">
                    <div class="input-group-text bg-gray-50 border-end-0">
                      <i class="ph ph-package text-gray-600"></i>
                    </div>
                    <input 
                      type="text" 
                      class="form-control px-16" 
                      id="orderId" 
                      v-model="returnForm.orderId"
                      placeholder="Enter your order ID (e.g., ORD-12345)" 
                      :disabled="isSubmitting" 
                      :class="{ 
                        'border-danger': errors.orderId,
                        'border-success': returnForm.orderId && !errors.orderId
                      }" 
                    />
                    <div v-if="returnForm.orderId && !errors.orderId" class="input-group-text bg-success-50 border-start-0">
                      <i class="ph ph-check-circle text-success-600"></i>
                    </div>
                  </div>
                  <div v-if="errors.orderId" class="text-danger text-sm mt-2 d-flex align-items-center gap-4">
                    <i class="ph ph-warning-circle text-14"></i>
                    {{ errors.orderId }}
                  </div>
                </div>

                <!-- Email -->
                <div class="col-12">
                  <label for="email" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Email Address <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <div class="input-group">
                    <div class="input-group-text bg-gray-50 border-end-0">
                      <i class="ph ph-envelope text-gray-600"></i>
                    </div>
                    <input 
                      type="email" 
                      class="form-control px-16" 
                      id="email" 
                      v-model="returnForm.email"
                      placeholder="Email used for order" 
                      :disabled="isSubmitting" 
                      :class="{ 
                        'border-danger': errors.email,
                        'border-success': returnForm.email && !errors.email
                      }" 
                    />
                    <div v-if="returnForm.email && !errors.email" class="input-group-text bg-success-50 border-start-0">
                      <i class="ph ph-check-circle text-success-600"></i>
                    </div>
                  </div>
                  <div v-if="errors.email" class="text-danger text-sm mt-2 d-flex align-items-center gap-4">
                    <i class="ph ph-warning-circle text-14"></i>
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Product Selection -->
                <div class="col-12">
                  <label class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-16">
                    Select Items to Return <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  
                  <!-- Product Search Modal -->
                  <div v-if="showProductSearch" class="product-search-modal mb-24 p-20 bg-gray-50 rounded-16 border border-gray-200">
                    <div class="d-flex align-items-center justify-content-between mb-16">
                      <h6 class="mb-0">Search Products</h6>
                      <button type="button" @click="showProductSearch = false" class="btn btn-sm text-gray-500 hover:text-gray-700">
                        <i class="ph ph-x text-20"></i>
                      </button>
                    </div>
                    
                    <div class="search-input-group mb-16">
                      <div class="input-group">
                        <input 
                          type="text" 
                          class="form-control px-16 py-12 border-end-0" 
                          v-model="productSearchQuery"
                          placeholder="Search by product name or SKU..."
                          @input="filterProducts"
                        />
                        <button class="btn btn-outline-main px-16">
                          <i class="ph ph-magnifying-glass"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="product-search-results" style="max-height: 300px; overflow-y: auto;">
                      <div v-if="filteredProducts.length === 0" class="text-center py-20 text-gray-500">
                        <i class="ph ph-package text-32 mb-8"></i>
                        <p class="text-sm">No products found</p>
                      </div>
                      
                      <div v-for="product in filteredProducts" :key="product.id" class="product-item p-12 bg-white rounded-8 mb-8 border border-gray-200 hover:border-main-300 transition-all cursor-pointer" @click="addProduct(product)">
                        <div class="d-flex align-items-center gap-12">
                          <img :src="product.image" :alt="product.name" class="w-50 h-50 rounded-4 object-fit-cover">
                          <div class="flex-1">
                            <h6 class="text-sm fw-semibold mb-2">{{ product.name }}</h6>
                            <p class="text-xs text-gray-600 mb-1">SKU: {{ product.sku }}</p>
                            <p class="text-sm fw-semibold text-main-600">{{ product.price }}</p>
                          </div>
                          <div class="text-center">
                            <p class="text-xs text-gray-500 mb-1">Available</p>
                            <p class="text-sm fw-semibold">{{ product.maxQuantity }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="product-selection">
                    <div class="selected-products mb-16">
                      <div v-if="selectedProducts.length === 0" class="text-center py-20 bg-gray-50 rounded-8 border-2 border-dashed border-gray-300">
                        <i class="ph ph-package text-32 text-gray-400 mb-8"></i>
                        <p class="text-sm text-gray-500 mb-0">No products selected</p>
                        <p class="text-xs text-gray-400">Click "Add Product" to search and select items</p>
                      </div>
                      
                      <div v-for="(item, index) in selectedProducts" :key="index" class="selected-item mb-12 p-16 bg-white border border-gray-200 rounded-12 shadow-sm">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="flex-align gap-12">
                            <img :src="item.image" :alt="item.name" class="w-60 h-60 rounded-8 object-fit-cover">
                            <div>
                              <h6 class="text-sm fw-semibold mb-4">{{ item.name }}</h6>
                              <p class="text-xs text-gray-600 mb-2">SKU: {{ item.sku }}</p>
                              <div class="d-flex align-items-center gap-8">
                                <span class="text-sm text-gray-600">Qty:</span>
                                <div class="input-group input-group-sm" style="width: 100px;">
                                  <button type="button" class="btn btn-outline-secondary px-8 py-4" @click="updateQuantity(index, -1)" :disabled="item.quantity <= 1">
                                    <i class="ph ph-minus text-12"></i>
                                  </button>
                                  <input type="number" class="form-control text-center px-8 py-4" v-model.number="item.quantity" min="1" :max="item.maxQuantity" @input="validateQuantity(index)">
                                  <button type="button" class="btn btn-outline-secondary px-8 py-4" @click="updateQuantity(index, 1)" :disabled="item.quantity >= item.maxQuantity">
                                    <i class="ph ph-plus text-12"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button type="button" @click="removeProduct(index)" class="btn btn-sm text-danger hover:bg-danger-50 p-8 rounded-8">
                            <i class="ph ph-trash text-16"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button type="button" @click="showProductSearch = true" class="btn btn-outline-main py-12 px-20 rounded-8 text-sm">
                      <i class="ph ph-plus me-8"></i>Add Product
                    </button>
                  </div>
                  <div v-if="errors.products" class="text-danger text-sm mt-2">
                    {{ errors.products }}
                  </div>
                </div>

                <!-- Return Reason -->
                <div class="col-12">
                  <label for="reason" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Return Reason <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <select 
                    class="common-input px-16" 
                    id="reason" 
                    v-model="returnForm.reason"
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.reason }"
                  >
                    <option value="">Select Reason</option>
                    <option value="wrong-item">Wrong Item Delivered</option>
                    <option value="defective">Defective Product</option>
                    <option value="damaged">Damaged in Transit</option>
                    <option value="size-fit">Size/Fit Issues</option>
                    <option value="quality">Quality Issues</option>
                    <option value="not-as-described">Not as Described</option>
                    <option value="no-longer-needed">No Longer Needed</option>
                    <option value="other">Other</option>
                  </select>
                  <div v-if="errors.reason" class="text-danger text-sm mt-2">
                    {{ errors.reason }}
                  </div>
                </div>

                <!-- Detailed Reason -->
                <div class="col-12">
                  <label for="details" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Detailed Description <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <div class="position-relative">
                    <textarea 
                      class="form-control px-16" 
                      id="details" 
                      v-model="returnForm.details"
                      rows="4"
                      placeholder="Please provide details about your return request..." 
                      :disabled="isSubmitting" 
                      :class="{ 
                        'border-danger': errors.details,
                        'border-success': returnForm.details && !errors.details
                      }"
                    ></textarea>
                    <div class="position-absolute top-0 end-0 p-8">
                      <span 
                        class="text-xs"
                        :class="{
                          'text-gray-500': returnForm.details.length < 400,
                          'text-warning-600': returnForm.details.length >= 400 && returnForm.details.length < 500,
                          'text-danger-600': returnForm.details.length >= 500
                        }"
                      >
                        {{ returnForm.details.length }}/500
                      </span>
                    </div>
                  </div>
                  <div v-if="errors.details" class="text-danger text-sm mt-2 d-flex align-items-center gap-4">
                    <i class="ph ph-warning-circle text-14"></i>
                    {{ errors.details }}
                  </div>
                  <div v-else-if="returnForm.details && returnForm.details.length >= 10" class="text-success text-sm mt-2 d-flex align-items-center gap-4">
                    <i class="ph ph-check-circle text-14"></i>
                    Description looks good
                  </div>
                </div>

                <!-- Refund Preference -->
                <div class="col-12">
                  <label class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Refund Preference <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <div class="refund-options">
                    <label class="refund-option d-flex align-items-center gap-8 mb-12">
                      <input type="radio" name="refundType" value="original" v-model="returnForm.refundType" class="form-check-input">
                      <span class="text-sm">Refund to Original Payment Method</span>
                    </label>
                    <label class="refund-option d-flex align-items-center gap-8 mb-12">
                      <input type="radio" name="refundType" value="wallet" v-model="returnForm.refundType" class="form-check-input">
                      <span class="text-sm">Refund to Wallet (5% Bonus)</span>
                    </label>
                    <label class="refund-option d-flex align-items-center gap-8">
                      <input type="radio" name="refundType" value="exchange" v-model="returnForm.refundType" class="form-check-input">
                      <span class="text-sm">Exchange for Different Product</span>
                    </label>
                  </div>
                  <div v-if="errors.refundType" class="text-danger text-sm mt-2">
                    {{ errors.refundType }}
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
                    <span v-else>Submit Return Request</span>
                  </button>
                </div>
              </div>
            </form>

            <!-- Cancellation Form -->
            <form v-else @submit.prevent="handleCancelSubmit">
              <!-- Progress Indicator -->
              <div class="progress-indicator mb-40">
                <div class="d-flex align-items-center justify-content-between mb-16">
                  <div class="progress-step" v-for="step in 3" :key="step">
                    <div 
                      class="step-circle d-flex align-items-center justify-content-center rounded-circle mb-8"
                      :class="{ 
                        'bg-main-600 text-white': step <= currentStep,
                        'bg-gray-200 text-gray-500': step > currentStep 
                      }"
                    >
                      <i v-if="step < currentStep" class="ph ph-check text-14"></i>
                      <span v-else class="text-12 fw-semibold">{{ step }}</span>
                    </div>
                    <span 
                      class="step-label text-xs text-center"
                      :class="{ 
                        'text-main-600 fw-semibold': step <= currentStep,
                        'text-gray-500': step > currentStep 
                      }"
                    >
                      {{ getStepLabel(step, 'cancel') }}
                    </span>
                  </div>
                </div>
                <div class="progress-bar bg-gray-200 rounded-full overflow-hidden" style="height: 4px;">
                  <div 
                    class="progress-fill bg-gradient-main transition-all duration-300"
                    :style="{ width: `${(currentStep / 3) * 100}%` }"
                  ></div>
                </div>
              </div>

              <h6 class="mb-32">Cancel Order</h6>

              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success mb-32 p-20 rounded-16 border-0 bg-success-50">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-success-100 p-8 rounded-circle">
                    <i class="ph ph-check-circle text-success-600 text-20"></i>
                  </div>
                  <div class="flex-1">
                    <span class="text-sm fw-semibold text-success-900">Order Cancellation Requested!</span>
                    <p class="text-sm text-success-700 mb-0 mt-4">Cancellation ID: {{ returnId }}</p>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="showError" class="alert alert-danger mb-32 p-20 rounded-16 border-0 bg-danger-50">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-danger-100 p-8 rounded-circle">
                    <i class="ph ph-warning-circle text-danger-600 text-20"></i>
                  </div>
                  <div class="flex-1">
                    <span class="text-sm fw-semibold text-danger-900">Error</span>
                    <p class="text-sm text-danger-700 mb-0 mt-4">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>

              <div class="row gy-4">
                <!-- Order ID -->
                <div class="col-12">
                  <label for="cancelOrderId" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Order ID <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input 
                    type="text" 
                    class="common-input px-16" 
                    id="cancelOrderId" 
                    v-model="cancelForm.orderId"
                    placeholder="Enter your order ID" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.orderId }" 
                  />
                  <div v-if="errors.orderId" class="text-danger text-sm mt-2">
                    {{ errors.orderId }}
                  </div>
                </div>

                <!-- Email -->
                <div class="col-12">
                  <label for="cancelEmail" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Email Address <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <input 
                    type="email" 
                    class="common-input px-16" 
                    id="cancelEmail" 
                    v-model="cancelForm.email"
                    placeholder="Email used for order" 
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.email }" 
                  />
                  <div v-if="errors.email" class="text-danger text-sm mt-2">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Cancellation Reason -->
                <div class="col-12">
                  <label for="cancelReason" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Cancellation Reason <span class="text-danger text-xl line-height-1">*</span>
                  </label>
                  <select 
                    class="common-input px-16" 
                    id="cancelReason" 
                    v-model="cancelForm.reason"
                    :disabled="isSubmitting" 
                    :class="{ 'border-danger': errors.reason }"
                  >
                    <option value="">Select Reason</option>
                    <option value="ordered-by-mistake">Ordered by Mistake</option>
                    <option value="found-better-price">Found Better Price Elsewhere</option>
                    <option value="delivery-time">Delivery Time Too Long</option>
                    <option value="payment-issues">Payment Issues</option>
                    <option value="changed-mind">Changed Mind</option>
                    <option value="other">Other</option>
                  </select>
                  <div v-if="errors.reason" class="text-danger text-sm mt-2">
                    {{ errors.reason }}
                  </div>
                </div>

                <!-- Additional Comments -->
                <div class="col-12">
                  <label for="cancelComments" class="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">
                    Additional Comments
                  </label>
                  <textarea 
                    class="common-input px-16" 
                    id="cancelComments" 
                    v-model="cancelForm.comments"
                    rows="3"
                    placeholder="Any additional information about your cancellation..." 
                    :disabled="isSubmitting"
                  ></textarea>
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
                    <span v-else>Cancel Order</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar Information -->
        <div class="col-lg-4">
          <!-- Return Policy -->
          <div class="policy-box bg-white border-0 shadow-sm rounded-24 p-32 mb-24" data-aos="fade-up" data-aos-duration="400">
            <div class="d-flex align-items-center mb-24">
              <div class="bg-gradient-main p-8 rounded-circle me-12">
                <i class="ph ph-arrow-counter-clockwise text-white text-20"></i>
              </div>
              <h6 class="mb-0">Return Policy</h6>
            </div>
            <div class="policy-list">
              <div class="policy-item p-16 bg-gray-50 rounded-12 mb-16">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-clock text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">30-Day Return Window</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">Return items within 30 days of delivery</p>
                  </div>
                </div>
              </div>
              <div class="policy-item p-16 bg-gray-50 rounded-12 mb-16">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-package text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">Original Condition</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">Items must be unused and in original packaging</p>
                  </div>
                </div>
              </div>
              <div class="policy-item p-16 bg-gray-50 rounded-12 mb-16">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-receipt text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">Proof of Purchase</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">Original invoice or order confirmation required</p>
                  </div>
                </div>
              </div>
              <div class="policy-item p-16 bg-gray-50 rounded-12">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-truck text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">Free Return Shipping</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">We provide prepaid return labels for eligible items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancellation Policy -->
          <div class="policy-box bg-white border-0 shadow-sm rounded-24 p-32 mb-24" data-aos="fade-up" data-aos-duration="600">
            <div class="d-flex align-items-center mb-24">
              <div class="bg-gradient-main p-8 rounded-circle me-12">
                <i class="ph ph-x-circle text-white text-20"></i>
              </div>
              <h6 class="mb-0">Cancellation Policy</h6>
            </div>
            <div class="policy-list">
              <div class="policy-item p-16 bg-gray-50 rounded-12 mb-16">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-hourglass text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">Before Shipment</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">Full refund if cancelled before order ships</p>
                  </div>
                </div>
              </div>
              <div class="policy-item p-16 bg-gray-50 rounded-12 mb-16">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-warning text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">After Shipment</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">Must initiate return after delivery</p>
                  </div>
                </div>
              </div>
              <div class="policy-item p-16 bg-gray-50 rounded-12">
                <div class="d-flex align-items-start gap-12">
                  <div class="bg-main-100 p-6 rounded-circle">
                    <i class="ph ph-bank text-main-600 text-16"></i>
                  </div>
                  <div>
                    <span class="text-sm fw-semibold text-gray-900">Refund Timeline</span>
                    <p class="text-sm text-gray-600 mb-0 mt-2">5-7 business days after we receive the return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Track Request -->
          <div class="track-box bg-white border-0 shadow-sm rounded-24 p-32" data-aos="fade-up" data-aos-duration="800">
            <div class="d-flex align-items-center mb-24">
              <div class="bg-gradient-main p-8 rounded-circle me-12">
                <i class="ph ph-magnifying-glass text-white text-20"></i>
              </div>
              <h6 class="mb-0">Track Your Request</h6>
            </div>
            <form @submit.prevent="trackRequest">
              <div class="mb-20">
                <label for="trackingId" class="text-sm font-heading-two text-gray-900 fw-semibold mb-8 d-block">
                  Request ID
                </label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="common-input px-16 border-end-0" 
                    id="trackingId" 
                    v-model="trackingId"
                    placeholder="Enter return/cancellation ID" 
                    :disabled="isTracking"
                  />
                  <button 
                    type="submit" 
                    class="btn btn-main px-20 rounded-end"
                    :disabled="isTracking || !trackingId.trim()"
                  >
                    <span v-if="isTracking" class="spinner-border spinner-border-sm" role="status"></span>
                    <i v-else class="ph ph-arrow-right"></i>
                  </button>
                </div>
              </div>
            </form>
            
            <!-- Tracking Result -->
            <div v-if="trackingResult" class="mt-24 p-20 bg-main-50 border border-main-200 rounded-16">
              <div class="d-flex align-items-start gap-12 mb-16">
                <div class="bg-main-100 p-6 rounded-circle">
                  <i class="ph ph-info-circle text-main-600 text-16"></i>
                </div>
                <div class="flex-1">
                  <span class="text-sm fw-semibold text-main-900">Status: {{ trackingResult.status }}</span>
                  <p class="text-sm text-main-700 mb-0 mt-2">Last Updated: {{ formatDate(trackingResult.lastUpdated) }}</p>
                </div>
              </div>
              <div class="bg-white p-16 rounded-12">
                <p class="text-sm text-gray-700 mb-0">{{ trackingResult.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section mt-80" data-aos="fade-up">
        <div class="text-center mb-48">
          <div class="d-inline-flex align-items-center justify-content-center mb-16">
            <div class="bg-gradient-main p-12 rounded-circle me-16">
              <i class="ph ph-question text-white text-24"></i>
            </div>
            <h4 class="mb-0">Frequently Asked Questions</h4>
          </div>
          <p class="text-gray-600">Common questions about returns and cancellations</p>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="faq-accordion">
              <div 
                v-for="(faq, index) in faqs" 
                :key="index" 
                class="faq-item bg-white border border-gray-200 rounded-16 mb-16 shadow-sm transition-all"
                :class="{ 'border-main-300 shadow-md': faq.isOpen }"
              >
                <button 
                  class="faq-question w-100 text-start px-24 py-20 bg-transparent border-0 d-flex align-items-center justify-content-between gap-16 transition-all"
                  :class="{ 'bg-main-50': faq.isOpen }"
                  @click="toggleFaq(index)"
                >
                  <div class="d-flex align-items-center gap-12 flex-1">
                    <div class="bg-main-100 p-6 rounded-circle">
                      <i class="ph ph-question text-main-600 text-14"></i>
                    </div>
                    <span class="text-sm fw-semibold text-gray-900">{{ faq.question }}</span>
                  </div>
                  <i 
                    class="ph ph-chevron-down text-main-600 transition-all" 
                    :class="{ 'rotate-180': faq.isOpen }"
                  ></i>
                </button>
                <div v-show="faq.isOpen" class="faq-answer px-24 pb-20">
                  <div class="ps-40">
                    <p class="text-sm text-gray-700 mb-0">{{ faq.answer }}</p>
                  </div>
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
import { ref, reactive, watch } from 'vue'

// Page Meta
useHead({
  title: 'Cancellation & Returns - Pranzo',
  meta: [
    { name: 'description', content: 'Easy returns and cancellations for your Pranzo orders. Read our policies and initiate returns/cancellations online.' }
  ]
})

// Tab State
const activeTab = ref('return')

// Progress State
const currentStep = ref(1)
const totalSteps = ref(4)

// Form State
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const returnId = ref('')
const selectedProducts = ref([])
const showProductSearch = ref(false)
const productSearchQuery = ref('')
const filteredProducts = ref([])

// Mock product data
const mockProducts = ref([
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    price: '$79.99',
    image: 'https://picsum.photos/seed/headphones/100/100',
    maxQuantity: 2
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    sku: 'SW5-002',
    price: '$299.99',
    image: 'https://picsum.photos/seed/smartwatch/100/100',
    maxQuantity: 1
  },
  {
    id: 3,
    name: 'Laptop Stand Adjustable',
    sku: 'LSA-003',
    price: '$49.99',
    image: 'https://picsum.photos/seed/laptopstand/100/100',
    maxQuantity: 3
  },
  {
    id: 4,
    name: 'USB-C Hub 7-in-1',
    sku: 'UCH-004',
    price: '$39.99',
    image: 'https://picsum.photos/seed/usbhub/100/100',
    maxQuantity: 5
  },
  {
    id: 5,
    name: 'Mechanical Keyboard RGB',
    sku: 'MKR-005',
    price: '$129.99',
    image: 'https://picsum.photos/seed/keyboard/100/100',
    maxQuantity: 2
  }
])

// Return Form Data
const returnForm = reactive({
  orderId: '',
  email: '',
  reason: '',
  details: '',
  refundType: ''
})

// Cancellation Form Data
const cancelForm = reactive({
  orderId: '',
  email: '',
  reason: '',
  comments: ''
})

// Form Errors
const errors = reactive({
  orderId: '',
  email: '',
  products: '',
  reason: '',
  details: '',
  refundType: ''
})

// Tracking State
const trackingId = ref('')
const isTracking = ref(false)
const trackingResult = ref(null)

// FAQ Data
const faqs = ref([
  {
    question: 'How long do I have to return an item?',
    answer: 'You have 30 days from the date of delivery to return most items. Some items may have different return periods.',
    isOpen: false
  },
  {
    question: 'Can I cancel my order after it has been shipped?',
    answer: 'Once an order has been shipped, you cannot cancel it directly. You will need to wait for delivery and then initiate a return.',
    isOpen: false
  },
  {
    question: 'How long does it take to process a refund?',
    answer: 'Refunds are typically processed within 5-7 business days after we receive and inspect your returned item.',
    isOpen: false
  },
  {
    question: 'Who pays for return shipping?',
    answer: 'We provide prepaid return labels for most returns. In some cases, you may need to pay for return shipping, which will be reimbursed.',
    isOpen: false
  },
  {
    question: 'What items cannot be returned?',
    answer: 'Items that are customized, perishable, intimate apparel, or marked as final sale cannot be returned. Please check product details for specific return eligibility.',
    isOpen: false
  }
])

// Form Validation
const validateReturnForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Order ID validation
  if (!returnForm.orderId.trim()) {
    errors.orderId = 'Order ID is required'
    isValid = false
  }

  // Email validation
  if (!returnForm.email.trim()) {
    errors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(returnForm.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Products validation
  if (selectedProducts.value.length === 0) {
    errors.products = 'Please select at least one item to return'
    isValid = false
  }

  // Reason validation
  if (!returnForm.reason) {
    errors.reason = 'Please select a return reason'
    isValid = false
  }

  // Details validation
  if (!returnForm.details.trim()) {
    errors.details = 'Description is required'
    isValid = false
  } else if (returnForm.details.length < 10) {
    errors.details = 'Description must be at least 10 characters long'
    isValid = false
  }

  // Refund type validation
  if (!returnForm.refundType) {
    errors.refundType = 'Please select a refund preference'
    isValid = false
  }

  return isValid
}

const validateCancelForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Order ID validation
  if (!cancelForm.orderId.trim()) {
    errors.orderId = 'Order ID is required'
    isValid = false
  }

  // Email validation
  if (!cancelForm.email.trim()) {
    errors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cancelForm.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Reason validation
  if (!cancelForm.reason) {
    errors.reason = 'Please select a cancellation reason'
    isValid = false
  }

  return isValid
}

// Handle Return Submit
const handleReturnSubmit = async () => {
  if (!validateReturnForm()) return

  isSubmitting.value = true
  showError.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate return ID
    returnId.value = 'RET' + Date.now().toString().slice(-8)

    // Show success message
    showSuccess.value = true

    // Reset form
    Object.keys(returnForm).forEach(key => {
      returnForm[key] = ''
    })
    selectedProducts.value = []

    // Scroll to success message
    setTimeout(() => {
      document.querySelector('.alert-success')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

  } catch (error) {
    showError.value = true
    errorMessage.value = 'Failed to submit return request. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Handle Cancellation Submit
const handleCancelSubmit = async () => {
  if (!validateCancelForm()) return

  isSubmitting.value = true
  showError.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate cancellation ID
    returnId.value = 'CAN' + Date.now().toString().slice(-8)

    // Show success message
    showSuccess.value = true

    // Reset form
    Object.keys(cancelForm).forEach(key => {
      cancelForm[key] = ''
    })

    // Scroll to success message
    setTimeout(() => {
      document.querySelector('.alert-success')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

  } catch (error) {
    showError.value = true
    errorMessage.value = 'Failed to submit cancellation request. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Remove Product
const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1)
  updateProgress()
}

// Filter Products
const filterProducts = () => {
  const query = productSearchQuery.value.toLowerCase()
  if (!query) {
    filteredProducts.value = mockProducts.value.filter(product => 
      !selectedProducts.value.some(selected => selected.id === product.id)
    )
  } else {
    filteredProducts.value = mockProducts.value.filter(product => 
      !selectedProducts.value.some(selected => selected.id === product.id) &&
      (product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query))
    )
  }
}

// Add Product
const addProduct = (product) => {
  const existingProduct = selectedProducts.value.find(item => item.id === product.id)
  if (existingProduct) {
    existingProduct.quantity = Math.min(existingProduct.quantity + 1, existingProduct.maxQuantity)
  } else {
    selectedProducts.value.push({
      ...product,
      quantity: 1
    })
  }
  showProductSearch.value = false
  productSearchQuery.value = ''
  filteredProducts.value = []
  updateProgress()
}

// Update Quantity
const updateQuantity = (index, change) => {
  const item = selectedProducts.value[index]
  const newQuantity = item.quantity + change
  if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
    item.quantity = newQuantity
  }
}

// Validate Quantity
const validateQuantity = (index) => {
  const item = selectedProducts.value[index]
  if (item.quantity < 1) item.quantity = 1
  if (item.quantity > item.maxQuantity) item.quantity = item.maxQuantity
}

// Real-time validation functions
const validateOrderId = (orderId) => {
  if (!orderId.trim()) {
    errors.orderId = 'Order ID is required'
    return false
  } else if (orderId.length < 3) {
    errors.orderId = 'Order ID must be at least 3 characters'
    return false
  } else if (!/^[A-Z0-9-]+$/i.test(orderId)) {
    errors.orderId = 'Order ID can only contain letters, numbers, and hyphens'
    return false
  } else {
    errors.orderId = ''
    return true
  }
}

const validateEmail = (email) => {
  if (!email.trim()) {
    errors.email = 'Email address is required'
    return false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address'
    return false
  } else {
    errors.email = ''
    return true
  }
}

const validateDetails = (details) => {
  if (!details.trim()) {
    errors.details = 'Description is required'
    return false
  } else if (details.length < 10) {
    errors.details = 'Description must be at least 10 characters long'
    return false
  } else if (details.length > 500) {
    errors.details = 'Description must be less than 500 characters'
    return false
  } else {
    errors.details = ''
    return true
  }
}

const validateReason = (reason) => {
  if (!reason) {
    errors.reason = 'Please select a reason'
    return false
  } else {
    errors.reason = ''
    return true
  }
}

const validateRefundType = (refundType) => {
  if (!refundType) {
    errors.refundType = 'Please select a refund preference'
    return false
  } else {
    errors.refundType = ''
    return true
  }
}

// Real-time validation watchers
watch(() => returnForm.orderId, (newValue) => {
  validateOrderId(newValue)
  updateProgress()
})

watch(() => returnForm.email, (newValue) => {
  validateEmail(newValue)
  updateProgress()
})

watch(() => returnForm.reason, (newValue) => {
  validateReason(newValue)
  updateProgress()
})

watch(() => returnForm.details, (newValue) => {
  validateDetails(newValue)
  updateProgress()
})

watch(() => returnForm.refundType, (newValue) => {
  validateRefundType(newValue)
  updateProgress()
})

watch(() => cancelForm.orderId, (newValue) => {
  validateOrderId(newValue)
  updateProgress()
})

watch(() => cancelForm.email, (newValue) => {
  validateEmail(newValue)
  updateProgress()
})

watch(() => cancelForm.reason, (newValue) => {
  validateReason(newValue)
  updateProgress()
})

// Track Request
const trackRequest = async () => {
  if (!trackingId.value.trim()) return

  isTracking.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock tracking result
    trackingResult.value = {
      status: 'Processing',
      lastUpdated: new Date().toISOString(),
      message: 'Your request is currently being processed by our team.'
    }

  } catch (error) {
    trackingResult.value = {
      status: 'Error',
      lastUpdated: new Date().toISOString(),
      message: 'Unable to fetch request status. Please check your request ID and try again.'
    }
  } finally {
    isTracking.value = false
  }
}

// Toggle FAQ
const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

// Get Step Label
const getStepLabel = (step, type) => {
  if (type === 'return') {
    const labels = ['Order Info', 'Select Items', 'Reason', 'Review']
    return labels[step - 1] || ''
  } else {
    const labels = ['Order Info', 'Reason', 'Review']
    return labels[step - 1] || ''
  }
}

// Update Progress
const updateProgress = () => {
  if (activeTab.value === 'return') {
    let step = 1
    if (returnForm.orderId && returnForm.email) step = 2
    if (selectedProducts.value.length > 0) step = 3
    if (returnForm.reason && returnForm.details && returnForm.refundType) step = 4
    currentStep.value = step
  } else {
    let step = 1
    if (cancelForm.orderId && cancelForm.email) step = 2
    if (cancelForm.reason) step = 3
    currentStep.value = step
  }
}

// Format Date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// Watchers for progress updates
watch([() => returnForm.orderId, () => returnForm.email, () => selectedProducts.value.length, () => returnForm.reason, () => returnForm.details, () => returnForm.refundType], () => {
  if (activeTab.value === 'return') {
    updateProgress()
  }
}, { deep: true })

watch([() => cancelForm.orderId, () => cancelForm.email, () => cancelForm.reason], () => {
  if (activeTab.value === 'cancel') {
    updateProgress()
  }
}, { deep: true })

watch(activeTab, () => {
  currentStep.value = 1
  updateProgress()
})
</script>

<style scoped>
.cancellation-returns {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.bg-gradient-main {
  background: linear-gradient(135deg, var(--main-color) 0%, var(--main-hover) 100%);
}

.bg-main-50 {
  background-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.05);
}

.bg-main-100 {
  background-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.1);
}

.text-main-600 {
  color: var(--main-color);
}

.text-main-700 {
  color: rgba(var(--main-color-rgb, 59, 130, 246), 0.8);
}

.text-main-900 {
  color: rgba(var(--main-color-rgb, 59, 130, 246), 0.95);
}

.border-main-200 {
  border-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.2);
}

.border-main-300 {
  border-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.3);
}

.bg-success-50 {
  background-color: rgba(34, 197, 94, 0.05);
}

.bg-success-100 {
  background-color: rgba(34, 197, 94, 0.1);
}

.text-success-600 {
  color: #16a34a;
}

.text-success-700 {
  color: #15803d;
}

.text-success-900 {
  color: #14532d;
}

.bg-danger-50 {
  background-color: rgba(239, 68, 68, 0.05);
}

.bg-danger-100 {
  background-color: rgba(239, 68, 68, 0.1);
}

.text-danger-600 {
  color: #dc2626;
}

.text-danger-700 {
  color: #b91c1c;
}

.text-danger-900 {
  color: #7f1d1d;
}

.return-form-box,
.policy-box,
.track-box {
  background-color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.return-form-box:hover,
.policy-box:hover,
.track-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-tabs {
  border-bottom: none;
}

.tab-btn {
  background-color: transparent;
  border: none;
  color: #6c757d;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.tab-btn:hover {
  color: #495057;
}

.tab-btn.active {
  color: var(--main-color);
  font-weight: 600;
}

.selected-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.selected-item:hover {
  border-color: var(--main-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.refund-option {
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.refund-option:hover {
  border-color: var(--main-color);
  background-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.05);
  transform: translateY(-1px);
}

.form-check-input:checked {
  background-color: var(--main-color);
  border-color: var(--main-color);
}

.faq-item {
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--main-color);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.faq-question {
  transition: all 0.3s ease;
}

.faq-question:hover {
  background-color: rgba(var(--main-color-rgb, 59, 130, 246), 0.02);
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
  background: linear-gradient(135deg, var(--main-color) 0%, var(--main-hover) 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-main:hover {
  background: linear-gradient(135deg, var(--main-hover) 0%, var(--main-color) 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--main-color-rgb, 59, 130, 246), 0.3);
}

.btn-main:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.btn-outline-main {
  border: 2px solid var(--main-color);
  color: var(--main-color);
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-main:hover {
  background-color: var(--main-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--main-color-rgb, 59, 130, 246), 0.3);
}

.text-main-600 {
  color: var(--main-color);
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

.w-60 {
  width: 60px;
}

.h-60 {
  height: 60px;
}

.object-fit-cover {
  object-fit: cover;
}

/* Progress Indicator Styles */
.progress-indicator {
  max-width: 600px;
  margin: 0 auto;
}

.progress-step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 600;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.step-circle.bg-main-600 {
  border-color: var(--main-color);
  box-shadow: 0 0 0 4px rgba(var(--main-color-rgb, 59, 130, 246), 0.1);
}

.step-label {
  font-size: 11px;
  line-height: 1.2;
  max-width: 80px;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
}

/* Product Search Styles */
.product-search-modal {
  animation: slideDown 0.3s ease;
}

.product-item {
  transition: all 0.2s ease;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-item:active {
  transform: translateY(0);
}

.input-group-sm .btn {
  font-size: 12px;
  padding: 4px 8px;
}

.input-group-sm .form-control {
  font-size: 12px;
  padding: 4px 8px;
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

/* Form Validation Styles */
.form-control.border-success {
  border-color: #16a34a;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.1);
}

.form-control.border-danger {
  border-color: #dc2626;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.1);
}

.input-group-text {
  transition: all 0.2s ease;
}

.input-group-text.bg-success-50 {
  background-color: rgba(34, 197, 94, 0.05);
  border-color: #16a34a;
  color: #16a34a;
}

.text-success {
  color: #16a34a;
}

.text-warning-600 {
  color: #d97706;
}

.text-danger-600 {
  color: #dc2626;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.end-0 {
  right: 0;
}

.text-xs {
  font-size: 0.75rem;
}

.p-8 {
  padding: 8px;
}

/* Additional utility styles */
.bg-main-600 {
  background-color: var(--main-color);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .cancellation-returns {
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

  /* Responsive progress indicator */
  .step-label {
    font-size: 10px;
    max-width: 60px;
  }
  
  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .progress-indicator {
    max-width: 100%;
  }
}
</style>
