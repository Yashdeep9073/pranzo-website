<template>
  <div class="pt-20">
    <WishlistBreakcrumb/>
  </div>

  <section class="wishlist py-80">
    <div class="container container-lg">
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-16">Loading wishlist...</p>
      </div>

      <div v-else-if="wishlistStore.count === 0" class="text-center py-80">
        <div class="empty-wishlist">
          <i class="ph ph-heart text-6xl text-gray-300 mb-24 d-block"></i>
          <h4 class="text-2xl fw-bold mb-16">Your wishlist is empty</h4>
          <p class="text-gray-600 mb-32">You haven't added any products to your wishlist yet.</p>
          <NuxtLink to="/products" class="btn btn-main py-16 px-32 rounded-8">
            <i class="ph ph-shopping-cart me-8"></i>
            Start Shopping
          </NuxtLink>
        </div>
      </div>

      <div v-else class="row g-4">
        <!-- Wishlist Products Grid -->
        <div class="col-12">
          <div class="flex-between mb-32">
            <span class="text-gray-600">{{ wishlistStore.count }} items</span>
          </div>
             
          <div class="row g-4">
            <div 
              v-for="product in wishlistStore.items" 
              :key="getProductId(product)"
              class="col-xl-3 col-lg-4 col-md-6"
            >
              <div class="product-card style-two border border-gray-100 rounded-8 p-24">
                <!-- Wishlist Remove Button -->
                <button 
                  type="button" 
                  class="wishlist-btn position-absolute top-24 right-24 bg-white border border-gray-100 rounded-circle w-40 h-40 flex-center hover-bg-danger-600 hover-text-white hover-border-danger-600"
                  @click="removeFromWishlist(product)"
                  title="Remove from wishlist"
                >
                  <i class="ph ph-heart text-xl"></i>
                </button>
                         
                <!-- Product Image -->
                <NuxtLink 
                  :to="getProductLink(product)"
                  class="product-card__thumb border border-gray-100 rounded-8 d-block overflow-hidden position-relative mb-24"
                >
                  <img 
                    :src="getPrimaryImage(product)" 
                    :alt="getProductName(product)"
                    class="w-100"
                    style="height: 200px; object-fit: cover;"
                  />
                  <!-- Stock Badge -->
                  <span 
                    v-if="getProductStock(product) <= getProductAlertThreshold(product)"
                    class="badge bg-danger-600 text-white position-absolute top-16 left-16 py-6 px-12 rounded-4"
                  >
                    Low Stock
                  </span>
                  <span 
                    v-else-if="getDiscountValue(product) > 0"
                    class="badge bg-main-600 text-white position-absolute top-16 left-16 py-6 px-12 rounded-4"
                  >
                    {{ getDiscountValue(product) }}% OFF
                  </span>
                </NuxtLink>

                <!-- Product Info -->
                <div class="product-card__content text-start">
                  <!-- Category -->
                  <div class="mb-12">
                    <span class="text-sm text-gray-600">
                      {{ getProductCategory(product) || 'Uncategorized' }}
                    </span>
                  </div>

                  <!-- Product Name -->
                  <h6 class="title text-lg fw-semibold mb-12">
                    <NuxtLink 
                      :to="getProductLink(product)"
                      class="link text-line-2"
                    >
                      {{ getProductName(product) }}
                    </NuxtLink>
                  </h6>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 text-line-2 mb-16">
                    {{ product.mainProduct.description }}
                  </p>
                     
                  <!-- Rating -->
                  <div class="flex-align gap-8 mb-16">
                    <div class="flex-align gap-4">
                      <span class="text-sm fw-medium text-warning-600 d-flex">
                        <i class="ph-fill ph-star"></i>
                      </span>
                      <span class="text-sm fw-semibold text-gray-900">
                        {{ getProductRating(product) || '4.5' }}
                      </span>
                    </div>
                    <span class="text-xs fw-medium text-gray-200">|</span>
                    <span class="text-xs text-neutral-600">
                      {{ getReviewCount(product) || 0 }} Reviews
                    </span>
                  </div>

                  <!-- Price -->
                  <div class="flex-between align-items-end">
                    <div>
                      <h6 class="text-xl fw-bold text-gray-900">
                        ₹{{ formatPrice(getDiscountedPrice(product)) }}
                      </h6>
                      <span 
                        v-if="getDiscountValue(product) > 0"
                        class="text-sm text-gray-500 text-decoration-line-through"
                      >
                        ₹{{ formatPrice(getOriginalPrice(product)) }}
                      </span>
                    </div>

                    <!-- Add to Cart Button -->
                    <button 
                      type="button"
                      class="btn btn-outline-main border-2 py-10 px-20 rounded-8 flex-align gap-8"
                      @click="openAddToCartModal(product)"
                      :disabled="getProductStock(product) <= 0"
                    >
                      <i class="ph ph-shopping-cart"></i>
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <!-- Available Variants -->
                  <div v-if="hasVariants(product)" class="mt-12">
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="color in getAvailableColors(product)" 
                        :key="color"
                        class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        {{ color }}
                      </span>
                      <span 
                        v-for="size in getAvailableSizes(product)" 
                        :key="size"
                        class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        {{ size }}
                      </span>
                    </div>
                  </div>

                  <!-- Stock Info -->
                  <div class="mt-16 pt-16 border-top border-gray-100">
                    <div class="flex-between">
                      <span class="text-sm text-gray-600">Available:</span>
                      <span 
                        :class="{
                          'text-success-600': getProductStock(product) > 0,
                          'text-danger-600': getProductStock(product) <= 0
                        }"
                        class="text-sm fw-medium"
                      >
                        {{ getProductStock(product) > 0 ? `${getProductStock(product)} in stock` : 'Out of stock' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="col-12">
          <div class="border border-gray-100 rounded-8 p-32 mt-32">
            <div class="row g-4">
              <div class="col-md-6">
                <button 
                  type="button"
                  class="btn btn-outline-main border-2 w-100 py-16 rounded-8 flex-align justify-content-center gap-12"
                  @click="openBulkAddModal"
                  :disabled="!hasInStockItems"
                >
                  <i class="ph ph-shopping-cart"></i>
                  Add All to Cart
                </button>
              </div>
              <div class="col-md-6">
                <button 
                  type="button"
                  class="btn btn-danger-600 text-white w-100 py-16 rounded-8 flex-align justify-content-center gap-12"
                  @click="clearWishlist"
                >
                  <i class="ph ph-trash"></i>
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Add to Cart Modal -->
  <div v-if="showAddToCartModal" class="modal-overlay" @click.self="closeAddToCartModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add to Cart - {{ selectedProductName }}</h5>
        <button @click="closeAddToCartModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Product Info -->
        <div class="product-info mb-24">
          <div class="flex items-start gap-16">
            <div class="flex-shrink-0">
              <img 
                :src="getProductImage(selectedProduct)" 
                :alt="selectedProductName"
                class="w-80 h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <h6 class="text-lg font-semibold mb-8">{{ selectedProductName }}</h6>
              <div class="flex items-center gap-8">
                <span class="text-xl font-bold text-main-600">
                  ₹{{ formatPrice(getDiscountedPrice(selectedProduct)) }}
                </span>
                <span 
                  v-if="getDiscountValue(selectedProduct) > 0"
                  class="text-sm text-gray-500 line-through"
                >
                  ₹{{ formatPrice(getOriginalPrice(selectedProduct)) }}
                </span>
              </div>
              <div class="mt-8">
                <span class="text-sm text-gray-600">Stock: </span>
                <span :class="{
                  'text-green-600': selectedProductStock > 0,
                  'text-red-600': selectedProductStock <= 0
                }">
                  {{ selectedProductStock > 0 ? `${selectedProductStock} available` : 'Out of stock' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Selection -->
        <div v-if="availableColors.length > 0" class="mb-24">
          <h6 class="text-sm font-semibold mb-12">Select Color:</h6>
          <div class="flex flex-wrap gap-12">
            <div 
              v-for="color in availableColors" 
              :key="color"
              @click="selectColor(color)"
              :class="[
                'color-option w-48 h-48 rounded-lg border-2 cursor-pointer transition-all duration-300 overflow-hidden',
                selectedColor === color 
                  ? 'border-main-600 scale-110 shadow-lg ring-2 ring-main-600 ring-offset-2' 
                  : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <!-- Show color image if available -->
              <div 
                v-if="getColorImage(color)"
                class="w-full h-full"
              >
                <img 
                  :src="getColorImage(color)" 
                  :alt="color"
                  class="w-full h-full object-cover"
                />
              </div>
              <div 
                v-else
                class="w-full h-full flex items-center justify-center"
                :style="{ backgroundColor: getColorHex(color) }"
              >
                <span class="text-xs text-white font-medium">{{ color }}</span>
              </div>
              
              <div v-if="selectedColor === color" class="absolute top-2 right-2 bg-main-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <i class="ph-fill ph-check text-xs"></i>
              </div>
            </div>
          </div>
          <div v-if="selectedColor" class="mt-8">
            <span class="text-sm text-gray-600">Selected: </span>
            <span class="text-sm font-medium text-gray-800">{{ selectedColor }}</span>
          </div>
        </div>

        <!-- Size Selection -->
        <div v-if="availableSizes.length > 0" class="mb-24">
          <h6 class="text-sm font-semibold mb-12">Select Size:</h6>
          <div class="flex flex-wrap gap-12">
            <div 
              v-for="size in availableSizes" 
              :key="size"
              @click="selectSize(size)"
              :class="[
                'size-option px-20 py-12 rounded-lg border cursor-pointer transition-all duration-300 text-center min-w-60',
                selectedSize === size 
                  ? 'bg-main-600 text-white border-main-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              ]"
            >
              <span class="text-sm fw-medium">{{ size }}</span>
            </div>
          </div>
          <div v-if="selectedSize" class="mt-8">
            <span class="text-sm text-gray-600">Selected: </span>
            <span class="text-sm font-medium text-gray-800">{{ selectedSize }}</span>
          </div>
        </div>

        <!-- Quantity Selection -->
        <div class="mb-24">
          <h6 class="text-sm font-semibold mb-12">Quantity:</h6>
          <div class="flex items-center gap-16">
            <div class="border border-gray-200 rounded-full py-8 px-16 flex items-center bg-white shadow-sm">
              <button
                type="button"
                @click="decreaseQuantity"
                class="quantity__minus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                :disabled="quantity <= 1"
                :class="quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'"
              >
                <i class="ph ph-minus text-lg"></i>
              </button>
              <input
                type="number"
                v-model.number="quantity"
                class="quantity__input border-0 text-center w-48 fw-bold text-gray-900"
                :max="getMaxQuantity()"
                min="1"
                @input="validateQuantity"
              />
              <button
                type="button"
                @click="increaseQuantity"
                class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                :disabled="quantity >= getMaxQuantity()"
                :class="quantity >= getMaxQuantity() ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'"
              >
                <i class="ph ph-plus text-lg"></i>
              </button>
            </div>
            <span class="text-sm text-gray-600">Max: {{ getMaxQuantity() }}</span>
          </div>
        </div>

        <!-- Selected Variant Info -->
        <div v-if="selectedVariant" class="mb-24 p-16 bg-gray-50 rounded-lg">
          <h6 class="text-sm font-semibold mb-8">Selected Variant:</h6>
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center gap-8 mb-4">
                <span v-if="selectedColor" class="badge bg-blue-100 text-blue-800">
                  {{ selectedColor }}
                </span>
                <span v-if="selectedSize" class="badge bg-green-100 text-green-800">
                  {{ selectedSize }}
                </span>
              </div>
              <div class="text-sm text-gray-600">
                SKU: {{ selectedVariant.sku || 'N/A' }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-800">
                ₹{{ selectedVariantPrice }}
              </div>
              <div :class="[
                'text-xs mt-2',
                selectedVariantStock > 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ selectedVariantStock > 0 ? `${selectedVariantStock} available` : 'Out of stock' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-16">
          <div class="alert alert-danger p-12 rounded-lg">
            <div class="flex items-center gap-8">
              <i class="ph ph-warning-circle"></i>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-16">
          <button
            @click="confirmAddToCart"
            :class="[
              'btn flex-1 py-12 rounded-lg font-semibold',
              canAddToCart ? 'btn-main' : 'btn-secondary cursor-not-allowed'
            ]"
            :disabled="!canAddToCart"
          >
            <i class="ph ph-shopping-cart me-8"></i>
            Add to Cart
          </button>
          <button
            @click="closeAddToCartModal"
            class="btn btn-outline-main border-2 py-12 px-24 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bulk Add Modal -->
  <div v-if="showBulkAddModal" class="modal-overlay" @click.self="closeBulkAddModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add All to Cart</h5>
        <button @click="closeBulkAddModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <p class="text-gray-700 mb-24">
          You are about to add {{ inStockProducts.length }} products to your cart.
          Please select options for products with variants:
        </p>

        <div class="space-y-4 max-h-300 overflow-y-auto pr-2">
          <div 
            v-for="product in productsWithVariants" 
            :key="getProductId(product)"
            class="border border-gray-200 rounded-lg p-16"
          >
            <div class="flex items-start gap-12 mb-12">
              <img 
                :src="getProductImage(product)" 
                :alt="getProductName(product)"
                class="w-60 h-60 object-cover rounded"
              />
              <div class="flex-1">
                <h6 class="text-sm font-semibold mb-2">{{ getProductName(product) }}</h6>
                <div class="flex items-center gap-8">
                  <span class="text-sm font-bold text-main-600">
                    ₹{{ formatPrice(getDiscountedPrice(product)) }}
                  </span>
                  <span class="text-xs text-gray-600">
                    Stock: {{ getProductStock(product) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Color Selection for Bulk Add -->
            <div v-if="getAvailableColors(product).length > 0" class="mb-8">
              <label class="text-xs text-gray-600 mb-4 block">Color:</label>
              <select 
                v-model="bulkSelections[getProductId(product)].color"
                class="w-full border border-gray-300 rounded-lg py-8 px-12 text-sm"
              >
                <option value="">Select Color</option>
                <option v-for="color in getAvailableColors(product)" :key="color" :value="color">
                  {{ color }}
                </option>
              </select>
            </div>

            <!-- Size Selection for Bulk Add -->
            <div v-if="getAvailableSizes(product).length > 0">
              <label class="text-xs text-gray-600 mb-4 block">Size:</label>
              <select 
                v-model="bulkSelections[getProductId(product)].size"
                class="w-full border border-gray-300 rounded-lg py-8 px-12 text-sm"
              >
                <option value="">Select Size</option>
                <option v-for="size in getAvailableSizes(product)" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-24 pt-24 border-t border-gray-200">
          <div class="flex gap-16">
            <button
              @click="confirmBulkAddToCart"
              class="btn btn-main flex-1 py-12 rounded-lg font-semibold"
            >
              <i class="ph ph-shopping-cart me-8"></i>
              Add All to Cart
            </button>
            <button
              @click="closeBulkAddModal"
              class="btn btn-outline-main border-2 py-12 px-24 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <WishlistShop/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../../store/useProductStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import { toKebabCase } from "../../utlis/toKebabCase"
import { encodeId } from "../../utlis/encode"
import WishlistBreakcrumb from '../../components/WishlistBreakcrumb.vue'
import WishlistShop from '../../components/WishlistShop.vue'

useHead({
  title: "My Wishlist"
})

// Pinia Stores
const productStore = useProductStore()
const wishlistStore = useWishlistStore()

// Refs
const loading = ref(false)

// Add to Cart Modal State
const showAddToCartModal = ref(false)
const showBulkAddModal = ref(false)
const selectedProduct = ref(null)
const selectedProductName = ref('')
const selectedProductStock = ref(0)
const selectedColor = ref('')
const selectedSize = ref('')
const selectedVariant = ref(null)
const selectedVariantPrice = ref(0)
const selectedVariantStock = ref(0)
const quantity = ref(1)
const errorMessage = ref('')
const bulkSelections = ref({})

// Computed properties
const hasInStockItems = computed(() => {
  return wishlistStore.items.some(product => getProductStock(product) > 0)
})

const inStockProducts = computed(() => {
  return wishlistStore.items.filter(product => getProductStock(product) > 0)
})

const productsWithVariants = computed(() => {
  return inStockProducts.value.filter(product => hasVariants(product))
})

const availableColors = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableColors(selectedProduct.value)
})

const availableSizes = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableSizes(selectedProduct.value)
})

const canAddToCart = computed(() => {
  if (!selectedProduct.value) return false
  if (selectedProductStock.value <= 0) return false
  if (hasVariants(selectedProduct.value)) {
    return selectedColor.value || selectedSize.value
  }
  return true
})

// Helper functions
const ProductColor = (product) => productStore.ProductColor(product)
const ProductSize = (product) => productStore.ProductSize(product)
const getProductName = (product) => productStore.getProductName(product)
const getProductImage = (product) => productStore.getProductImage(product)
const getDiscountedPrice = (product) => productStore.getDiscountedPrice(product)
const getOriginalPrice = (product) => productStore.getOriginalPrice(product)
const getProductStock = (product) => productStore.getProductStock(product)
const getProductCategory = (product) => productStore.getProductCategory(product)
const getProductBrand = (product) => productStore.getProductBrand(product)
const getProductId = (product) => productStore.getProductId(product)
const getProductRating = (product) => productStore.getProductRating(product) || 0
const getReviewCount = (product) => productStore.getReviewCount(product) || 0
const getColorHex = (color) => productStore.getColorHex(color)

// Custom helper functions
const getDiscountValue = (product) => {
  return product?.mainProduct?.discountValue || 0
}

const getProductAlertThreshold = (product) => {
  return product?.mainProduct?.quantityAlertThreshold || 5
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}

const getPrimaryImage = (product) => {
  return getProductImage(product) || '/assets/images/placeholder-product.jpg'
}

const getProductLink = (product) => {
  const productName = toKebabCase(getProductName(product))
  const productId = encodeId(getProductId(product))
  const productColor = productStore.getProductColor(product)
  
  let url = `/product/${productName}--${product.groupId}`
  
  if (productColor) {
    url += `?color=${encodeURIComponent(productColor)}`
  }
  
  return url
}

// Variant functions
const hasVariants = (product) => {
  const colors = getAvailableColors(product)
  const sizes = getAvailableSizes(product)
  return colors.length > 0 || sizes.length > 0
}

const getAvailableColors = (product) => {
  if (!product?.variants || !Array.isArray(product.variants)) return []
  const colors = product.variants
    .map(v => v?.attributes?.[0]?.color)
    .filter(Boolean)
  return [...new Set(colors)]
}

const getAvailableSizes = (product) => {
  if (!product?.variants || !Array.isArray(product.variants)) return []
  const sizes = product.variants
    .map(v => v?.attributes?.[0]?.size)
    .filter(Boolean)
  return [...new Set(sizes)]
}

const getColorImage = (color) => {
  // This function should return the image for the color
  // You might need to fetch this from the product variants
  return null
}

const findMatchingVariant = () => {
  if (!selectedProduct.value?.variants) return null
  
  return selectedProduct.value.variants.find(variant => {
    const variantColor = variant?.attributes?.[0]?.color
    const variantSize = variant?.attributes?.[0]?.size
    
    const colorMatch = !selectedColor.value || variantColor === selectedColor.value
    const sizeMatch = !selectedSize.value || variantSize === selectedSize.value
    
    return colorMatch && sizeMatch
  })
}

const getMaxQuantity = () => {
  if (selectedVariant.value) {
    return selectedVariant.value.stock || 0
  }
  return selectedProductStock.value
}

// Modal functions
const openAddToCartModal = (product) => {
  selectedProduct.value = product
  selectedProductName.value = getProductName(product)
  selectedProductStock.value = getProductStock(product)
  
  // Reset selections
  selectedColor.value = ''
  selectedSize.value = ''
  selectedVariant.value = null
  quantity.value = 1
  errorMessage.value = ''
  
  // Auto-select first available color/size if only one option
  const colors = getAvailableColors(product)
  const sizes = getAvailableSizes(product)
  
  if (colors.length === 1) {
    selectedColor.value = colors[0]
  }
  if (sizes.length === 1) {
    selectedSize.value = sizes[0]
  }
  
  // Find matching variant if both color and size are selected
  if (selectedColor.value || selectedSize.value) {
    selectedVariant.value = findMatchingVariant()
    if (selectedVariant.value) {
      selectedVariantPrice.value = selectedVariant.value.price || getDiscountedPrice(product)
      selectedVariantStock.value = selectedVariant.value.stock || selectedProductStock.value
    }
  }
  
  showAddToCartModal.value = true
}

const closeAddToCartModal = () => {
  showAddToCartModal.value = false
  setTimeout(() => {
    selectedProduct.value = null
  }, 300)
}

const openBulkAddModal = () => {
  // Initialize bulk selections
  bulkSelections.value = {}
  productsWithVariants.value.forEach(product => {
    const productId = getProductId(product)
    bulkSelections.value[productId] = {
      color: '',
      size: ''
    }
  })
  showBulkAddModal.value = true
}

const closeBulkAddModal = () => {
  showBulkAddModal.value = false
}

// Selection functions
const selectColor = (color) => {
  selectedColor.value = color
  updateSelectedVariant()
}

const selectSize = (size) => {
  selectedSize.value = size
  updateSelectedVariant()
}

const updateSelectedVariant = () => {
  if (!selectedProduct.value) return
  
  selectedVariant.value = findMatchingVariant()
  if (selectedVariant.value) {
    selectedVariantPrice.value = selectedVariant.value.price || getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedVariant.value.stock || selectedProductStock.value
    
    // Reset quantity if exceeds stock
    if (quantity.value > selectedVariantStock.value) {
      quantity.value = selectedVariantStock.value
    }
  } else {
    selectedVariantPrice.value = getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedProductStock.value
  }
}

// Quantity functions
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  const maxQty = getMaxQuantity()
  if (quantity.value < maxQty) {
    quantity.value++
  }
}

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1
  }
  const maxQty = getMaxQuantity()
  if (quantity.value > maxQty) {
    quantity.value = maxQty
  }
}

// Add to Cart function (same as product details page)
const addToCart = (product, variant = null, qty = 1, selectedColor = null, selectedSize = null) => {
  try {
    // Get existing cart or initialize
    const existingCart = localStorage.getItem('shopping_cart')
    let cart = existingCart ? JSON.parse(existingCart) : []
    
    // Use variant or main product
    const targetProduct = variant || product.mainProduct || product
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => {
      // Match by product ID and variant (if any)
      const sameProduct = item.productId === targetProduct.id
      const sameVariant = item.variantId === (variant?.id || null)
      const sameColor = item.color === selectedColor
      const sameSize = item.size === selectedSize
      
      return sameProduct && sameVariant && sameColor && sameSize
    })
    
    const discountedPrice = variant?.price || getDiscountedPrice(product)
    
    if (existingIndex > -1) {
      // Update existing item quantity
      cart[existingIndex].quantity += qty
      cart[existingIndex].totalPrice = cart[existingIndex].price * cart[existingIndex].quantity
    } else {
      // Add new item
      const cartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: targetProduct.id,
        variantId: variant?.id || null,
        name: getProductName(product),
        color: selectedColor,
        groupIid:product.groupId,
        size: selectedSize,
        sku: targetProduct.sku || product.mainProduct?.sku,
        price: discountedPrice,
        quantity: qty,
        totalPrice: discountedPrice * qty,
        image: getProductImage(product),
        stock: variant?.stock || getProductStock(product),
        maxStock: variant?.stock || getProductStock(product)
      }
      cart.push(cartItem)
    }
    
    // Save to localStorage
    localStorage.setItem('shopping_cart', JSON.stringify(cart))
    
    return true
  } catch (error) {
    console.error('Error adding to cart:', error)
    return false
  }
}

const confirmAddToCart = () => {
  if (!selectedProduct.value) return
  
  const success = addToCart(
    selectedProduct.value,
    selectedVariant.value,
    quantity.value,
    selectedColor.value,
    selectedSize.value
  )
  
  if (success) {
    alert(`${quantity.value} × ${selectedProductName.value} added to cart!`)
    closeAddToCartModal()
    
    // You might want to emit an event or update a cart store here
    window.dispatchEvent(new CustomEvent('cart-updated'))
  } else {
    errorMessage.value = 'Failed to add product to cart. Please try again.'
  }
}

const confirmBulkAddToCart = () => {
  let successCount = 0
  let failedCount = 0
  
  // Add all in-stock products
  inStockProducts.value.forEach(product => {
    const productId = getProductId(product)
    const selections = bulkSelections.value[productId] || {}
    
    // Find matching variant based on selections
    let variant = null
    if (selections.color || selections.size) {
      variant = product.variants?.find(v => {
        const variantColor = v?.attributes?.[0]?.color
        const variantSize = v?.attributes?.[0]?.size
        
        const colorMatch = !selections.color || variantColor === selections.color
        const sizeMatch = !selections.size || variantSize === selections.size
        
        return colorMatch && sizeMatch
      })
    }
    
    const success = addToCart(
      product,
      variant,
      1, // Default quantity 1 for bulk add
      selections.color,
      selections.size
    )
    
    if (success) {
      successCount++
    } else {
      failedCount++
    }
  })
  
  closeBulkAddModal()
  
  if (successCount > 0) {
    alert(`Successfully added ${successCount} products to cart!`)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }
  
  if (failedCount > 0) {
    alert(`Failed to add ${failedCount} products to cart.`)
  }
}

// Wishlist actions
const removeFromWishlist = (product) => {
  const confirmRemove = confirm('Are you sure you want to remove this item from your wishlist?')
  
  if (confirmRemove) {
    const removed = wishlistStore.removeItem(product)
    if (removed) {
      alert('Product removed from wishlist!')
    }
  }
}

const clearWishlist = () => {
  const confirmClear = confirm('Are you sure you want to clear your entire wishlist?')
  
  if (confirmClear) {
    wishlistStore.clearAll()
    alert('Wishlist cleared!')
  }
}

// Lifecycle hooks
onMounted(() => {
  // Wishlist store automatically loads from localStorage
  console.log('Wishlist items:', wishlistStore.items)
})
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

/* Color Option */
.color-option {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.color-option:hover {
  transform: scale(1.05);
}

/* Size Option */
.size-option {
  transition: all 0.3s ease;
}

.size-option:hover {
  border-color: #9ca3af;
  transform: translateY(-2px);
}

/* Scrollbar */
.max-h-300 {
  max-height: 300px;
}

.max-h-300::-webkit-scrollbar {
  width: 4px;
}

.max-h-300::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-300::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

/* Existing Styles */
.wishlist-btn {
  z-index: 10;
  transition: all 0.3s ease;
}

.product-card {
  position: relative;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge {
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
  }
  
  .color-option {
    width: 40px;
    height: 40px;
  }
  
  .size-option {
    min-width: 50px;
    padding: 8px 12px;
  }
}
</style>