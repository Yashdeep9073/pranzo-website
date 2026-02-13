<template>
  <div class="pt-20 up">

  <Breadcrumbwishlist/>
  </div>
  
  <section class="wishlist py-80">
    <div class="container container-lg">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-16">Loading wishlist...</p>
      </div>

      <!-- Empty Wishlist State -->
      <div v-else-if="wishlistStore.count === 0" class="text-center py-80">
        <div class="empty-wishlist">
          <i class="ph ph-heart text-6xl text-gray-300 mb-24 d-block"></i>
          <h4 class="text-2xl fw-bold mb-16">Your wishlist is empty</h4>
          <p class="text-gray-600 mb-32">You haven't added any products to your wishlist yet.</p>
          <NuxtLink to="/shop/shop-all" class="btn btn-main py-16 px-32 rounded-8">
            <i class="ph ph-shopping-cart me-8"></i>
            Start Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Wishlist Content (Cart-style Layout) -->
      <div v-else class="row gy-4">
        <!-- Wishlist Table Header (Cart-style) -->
        <div class="col-12">
          <div class="flex-between mb-32">
            <h3 class="text-2xl fw-bold text-gray-800">My Wishlist</h3>
            <div class="text-sm text-gray-600">
              <span class="fw-semibold">{{ wishlistStore.count }}</span> items
            </div>
          </div>

          <!-- Wishlist Table -->
          <div class="wishlist-table border border-gray-100 rounded-8 px-40 py-48">
            <div class="overflow-x-auto scroll-sm scroll-sm-horizontal">
              <table class="table style-three">
                <thead>
                  <tr>
                    <th class="h6 mb-0 text-lg fw-bold">Remove</th>
                    <th class="h6 mb-0 text-lg fw-bold">Product</th>
                    <th class="h6 mb-0 text-lg fw-bold">Price</th>
                    <!-- <th class="h6 mb-0 text-lg fw-bold">Stock Status</th> -->
                    <th class="h6 mb-0 text-lg fw-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in wishlistStore.items" :key="getProductId(product)">
                    <!-- Remove Button -->
                    <td>
                      <button 
                        type="button" 
                        class="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                        @click="removeFromWishlist(product)"
                      >
                        <i class="ph ph-x-circle text-2xl d-flex"></i>
                        Remove
                      </button>
                    </td>

                    <!-- Product Details -->
                    <td>
                      <div class="table-product d-flex align-items-center gap-24">
                        <NuxtLink 
                          :to="getProductLink(product)" 
                          class="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          style="width: 100px; height: 100px;"
                        >
                          <img 
                            :src="getPrimaryImage(product)" 
                            :alt="getProductName(product)" 
                            class="w-100 h-100 object-cover rounded-8"
                            loading="lazy"
                          />
                        </NuxtLink>
                        <div class="table-product__content text-start">
                          <h6 class="title text-lg fw-semibold mb-8">
                            <NuxtLink 
                              :to="getProductLink(product)" 
                              class="link text-line-2 hover-text-main-600"
                            > 
                              {{ getProductName(product) }}
                            </NuxtLink>
                          </h6>

                          <!-- Variant Info -->
                          <div v-if="getAvailableColors(product).length > 0 || getAvailableSizes(product).length > 0" 
                               class="variant-info flex-align gap-10 mb-10">
                            <span v-if="getAvailableColors(product).length > 0" class="variant-chip">
                              Color: {{ getAvailableColors(product)[0] }}
                            </span>

                            <span v-if="getAvailableSizes(product).length > 0" class="variant-chip">
                              Size: {{ getAvailableSizes(product)[0] }}
                            </span>
                          </div>

                          <!-- Rating -->
                          <div class="flex-align gap-16 mb-16">
                            <div class="flex-align gap-6">
                              <span class="text-md fw-medium text-warning-600 d-flex">
                                <i class="ph-fill ph-star"></i>
                              </span>
                              <span class="text-md fw-semibold text-gray-900">
                                {{ getProductRating(product).toFixed(1) }}
                              </span>
                            </div>
                            <span class="text-sm fw-medium text-gray-200">|</span>
                            <span class="text-neutral-600 text-sm">
                              {{ getReviewCount(product) }} Reviews
                            </span>
                          </div>

                          <!-- Tags -->
                          <div class="flex-align gap-16">
                            <span 
                              v-for="tag in product.mainProduct?.tags || ['New', 'Popular']" 
                              :key="tag"
                              class="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                            >
                              {{ tag }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Price -->
                    <td>
                      <div class="d-flex flex-column gap-4">
                        <span class="text-lg h6 mb-0 fw-semibold text-main-600">
                          ₹{{ formatPrice(getDiscountedPrice(product)) }}
                        </span>
                        <span v-if="getDiscountValue(product) > 0" 
                              class="text-sm text-gray-500 text-decoration-line-through">
                          ₹{{ formatPrice(getOriginalPrice(product)) }}
                        </span>
                        <span v-if="getDiscountValue(product) > 0" 
                              class="text-xs text-success-600 fw-medium">
                          Save {{ getDiscountValue(product) }}%
                        </span>
                      </div>
                    </td>

                    <!-- Stock Status -->
                    <!-- <td>
                      <div class="d-flex align-items-center gap-8">
                        <span :class="{
                          'text-success-600': getProductStock(product) > 10,
                          'text-warning-600': getProductStock(product) <= 10 && getProductStock(product) > 0,
                          'text-danger-600': getProductStock(product) <= 0
                        }">
                          <i :class="{
                            'ph ph-check-circle': getProductStock(product) > 0,
                            'ph ph-warning-circle': getProductStock(product) <= 10 && getProductStock(product) > 0,
                            'ph ph-x-circle': getProductStock(product) <= 0
                          }" class="me-2"></i>
                          {{ getStockStatus(product) }}
                        </span>
                        <div v-if="getProductStock(product) > 0 && getProductStock(product) <= 10" 
                             class="text-xs text-gray-500">
                          (Only {{ getProductStock(product) }} left)
                        </div>
                      </div>
                    </td> -->
 
                    <!-- Action Buttons -->
                    <td>
                      <div class="d-flex flex-column gap-8">
                        <button
                          type="button"
                          class="btn btn-main py-8 px-16 rounded-8 fw-medium text-sm flex-align justify-content-center gap-8 hover-bg-main-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          @click="openAddToCartModal(product)"
                          :disabled="getProductStock(product) <= 0"
                        >
                          <i class="ph ph-shopping-cart text-sm"></i>
                          Add to Cart
                        </button>
                        
                        <NuxtLink 
                          :to="getProductLink(product)" 
                          class="btn btn-outline-main border py-8 px-16 rounded-8 fw-medium text-sm flex-align justify-content-center gap-8 hover-bg-main-50 transition-all duration-300"
                        >
                          <i class="ph ph-eye text-sm"></i>
                          View Details
                        </NuxtLink>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Clear Wishlist Button -->
            <div class="flex-between flex-wrap gap-16 mt-32 pt-32 border-t border-gray-100">
              <div class="flex-align gap-16">
                <NuxtLink 
                  to="/shop-all" 
                  class="text-lg text-gray-500 hover-text-main-600 transition-colors"
                >
                  <i class="ph ph-arrow-left me-2"></i> Continue Shopping
                </NuxtLink>
              </div>
              <div class="flex-align gap-16">
                <button
                  type="button"
                  class="text-lg text-gray-500 hover-text-danger-600 transition-colors"
                  @click="clearWishlist"
                >
                  <i class="ph ph-trash me-2"></i> Clear Wishlist
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
        <!-- Product Info with Main Image -->
        <div class="product-info mb-24">
          <div class="flex items-start gap-16">
            <div class="flex-shrink-0">
              <!-- Main Product Image - Changes based on selected color -->
              <div class="main-image-container mb-16">
                <img
                  :src="getCurrentMainImage()"
                  :alt="selectedProductName"
                  class="w-80 h-80 object-cover rounded-xl shadow-lg border border-gray-200 transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
               
                <!-- Image Navigation if multiple images available -->
                <div v-if="selectedVariantImages.length > 1" class="flex gap-8 mt-12 justify-center">
                  <button
                    v-for="(img, index) in selectedVariantImages.slice(0, 4)"
                    :key="index"
                    @click="setActiveImageIndex(index)"
                    :class="[
                      'w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-md',
                      activeImageIndex === index ? 'border-main-600 scale-110 shadow-md' : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    <img
                      :src="img"
                      :alt="`Image ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex-1">
              <h6 class="text-lg font-semibold mb-8 leading-tight">{{ selectedProductName }}</h6>
              <div class="flex items-center gap-8 mb-8">
                <span class="text-xl font-bold text-main-600">
                  ₹{{ formatPrice(getDiscountedPrice(selectedProduct)) }}
                </span>
                <span
                  v-if="getDiscountValue(selectedProduct) > 0"
                  class="text-sm text-gray-500 line-through"
                >
                  ₹{{ formatPrice(getOriginalPrice(selectedProduct)) }}
                </span>
                <span
                  v-if="getDiscountValue(selectedProduct) > 0"
                  class="text-xs text-success-600 font-medium bg-success-50 px-12 py-4 rounded-full"
                >
                  Save {{ getDiscountValue(selectedProduct) }}%
                </span>
              </div>
              <div class="flex items-center gap-16 text-sm mb-8">
                <span class="text-gray-600">Stock: </span>
                <span :class="{
                  'text-success-600 font-medium': selectedProductStock > 0,
                  'text-danger-600 font-medium': selectedProductStock <= 0
                }">
                  {{ selectedProductStock > 0 ? `${selectedProductStock} available` : 'Out of stock' }}
                </span>
              </div>
             
              <!-- Selected Variant Display -->
              <div v-if="selectedColor || selectedSize" class="flex flex-wrap gap-8 mt-8">
                <span v-if="selectedColor" class="badge bg-blue-100 text-blue-800 border border-blue-200 px-12 py-4 rounded-full text-xs">
                  <i class="ph ph-palette me-2"></i>{{ selectedColor }}
                </span>
                <span v-if="selectedSize" class="badge bg-green-100 text-green-800 border border-green-200 px-12 py-4 rounded-full text-xs">
                  <i class="ph ph-ruler me-2"></i>{{ selectedSize }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Selection -->
        <div v-if="availableColors.length > 0" class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Select Color:</h6>
            <span class="text-xs text-gray-500">{{ selectedColor || 'Any' }}</span>
          </div>
          <div class="flex flex-wrap gap-12">
            <div
              v-for="color in availableColors"
              :key="color"
              @click="selectColor(color)"
              :class="[
                'color-option w-48 h-48 rounded-xl border-2 cursor-pointer transition-all duration-400 overflow-hidden relative group shadow-sm hover:shadow-md',
                selectedColor === color
                  ? 'border-main-600 scale-110 ring-2 ring-main-600/20'
                  : 'border-gray-300 hover:border-gray-400 hover:scale-105'
              ]"
              :title="color"
            >
              <!-- Show color image if available -->
              <div
                v-if="getColorImage(color)"
                class="w-full h-full"
              >
                <img
                  :src="getColorImage(color)"
                  :alt="color"
                  class="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                />
              </div>
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                :style="{ backgroundColor: getColorHex(color) }"
              >
                <span class="text-xs font-medium text-white">{{ color.charAt(0).toUpperCase() + color.slice(1) }}</span>
              </div>
             
              <!-- Check mark for selected color -->
              <div v-if="selectedColor === color" class="absolute top-2 right-2 bg-main-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <i class="ph-fill ph-check text-sm"></i>
              </div>
             
              <!-- Color name on hover -->
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {{ color }}
              </div>
            </div>
          </div>
        </div>

        <!-- Size Selection -->
        <div v-if="availableSizes.length > 0" class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Select Size:</h6>
            <span class="text-xs text-gray-500">{{ selectedSize || 'Any' }}</span>
          </div>
          <div class="flex flex-wrap gap-12">
            <div
              v-for="size in availableSizes"
              :key="size"
              @click="selectSize(size)"
              :class="[
                'size-option px-20 py-12 rounded-xl border cursor-pointer transition-all duration-400 text-center min-w-60 group shadow-sm hover:shadow-md',
                selectedSize === size
                  ? 'bg-main-600 text-white border-main-600 scale-105 ring-1 ring-main-600/20'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:scale-105'
              ]"
              :title="size"
            >
              <span class="text-sm fw-medium">{{ size }}</span>
             
              <!-- Size guide info on hover -->
              <div v-if="getSizeGuide(size)" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
                {{ getSizeGuide(size) }}
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity Selection -->
        <div class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Quantity:</h6>
            <div class="flex items-center gap-8">
              <span class="text-xs text-gray-500">Max: {{ getMaxQuantity() }}</span>
              <button
                type="button"
                @click="quantity = getMaxQuantity()"
                class="text-xs text-main-600 hover:text-main-800 font-medium underline transition-colors duration-200"
                v-if="getMaxQuantity() > 1"
              >
                Set to max
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="border border-gray-200 rounded-full py-8 px-16 flex items-center bg-white shadow-sm">
              <button
                type="button"
                @click="decreaseQuantity"
                class="quantity__minus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="quantity <= 1 || selectedProductStock <= 0"
              >
                <i class="ph ph-minus text-lg" :class="quantity <= 1 ? 'text-gray-400' : 'text-gray-700'"></i>
              </button>
              <input
                type="number"
                v-model.number="quantity"
                class="quantity__input border-0 text-center w-48 fw-bold text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-main-500 focus:ring-opacity-30 rounded"
                :max="getMaxQuantity()"
                min="1"
                @input="validateQuantity"
                @focus="$event.target.select()"
                :disabled="selectedProductStock <= 0"
              />
              <button
                type="button"
                @click="increaseQuantity"
                class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="quantity >= getMaxQuantity() || selectedProductStock <= 0"
              >
                <i class="ph ph-plus text-lg" :class="quantity >= getMaxQuantity() ? 'text-gray-400' : 'text-gray-700'"></i>
              </button>
            </div>
           
            <!-- Stock Progress Bar -->
            <div class="w-48">
              <div class="text-xs text-gray-600 mb-2 text-center">Stock</div>
              <div class="progress h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="progress-bar h-full bg-gradient-to-r from-success-500 to-emerald-500 transition-all duration-700"
                  :style="{ width: getStockPercentage() + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-700 text-center mt-1">
                {{ selectedVariantStock ?? selectedProductStock }} / {{ getMaxQuantity() }}
              </div>
            </div>
          </div>
         
          <!-- Quantity Quick Select -->
          <div v-if="selectedProductStock > 5" class="flex flex-wrap gap-8 mt-12 justify-center">
            <button
              v-for="qty in [1, 2, 3, 5, 10]"
              :key="qty"
              @click="quantity = Math.min(qty, getMaxQuantity())"
              :class="[
                'px-16 py-8 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm',
                quantity === qty
                  ? 'bg-main-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              ]"
              :disabled="qty > getMaxQuantity()"
            >
              {{ qty }}
            </button>
          </div>
        </div>

        <!-- Selected Variant Details -->
        <div v-if="selectedVariant || selectedColor || selectedSize" class="mb-24 p-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
          <h6 class="text-sm font-semibold mb-8 text-gray-700 flex items-center gap-8">
            <i class="ph ph-package text-main-600"></i>
            Selected Variant Details
          </h6>
          <div class="grid grid-cols-2 gap-16">
            <div class="space-y-8">
              <div v-if="selectedColor" class="flex items-center gap-8">
                <div class="w-6 h-6 rounded-full border border-gray-300" :style="{ backgroundColor: getColorHex(selectedColor) }"></div>
                <div>
                  <div class="text-xs text-gray-500">Color</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedColor }}</div>
                </div>
              </div>
             
              <div v-if="selectedSize" class="flex items-center gap-8">
                <i class="ph ph-ruler text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">Size</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedSize }}</div>
                </div>
              </div>
            </div>
           
            <div class="space-y-8">
              <div class="flex items-center gap-8">
                <i class="ph ph-barcode text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">SKU</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedVariant?.sku || selectedProduct?.mainProduct?.sku }}</div>
                </div>
              </div>
             
              <div class="flex items-center gap-8">
                <i class="ph ph-warehouse text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">Stock</div>
                  <div :class="[
                    'text-sm font-medium',
                    (selectedVariantStock ?? selectedProductStock) > 0 ? 'text-success-600' : 'text-danger-600'
                  ]">
                    {{ (selectedVariantStock ?? selectedProductStock) > 0 ? `${selectedVariantStock ?? selectedProductStock} available` : 'Out of stock' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <!-- Price Summary -->
          <div class="mt-16 pt-16 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xs text-gray-500">Unit Price</div>
                <div class="text-lg font-bold text-main-600">
                  ₹{{ formatPrice(selectedVariantPrice || getDiscountedPrice(selectedProduct)) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">Total ({{ quantity }} items)</div>
                <div class="text-xl font-bold text-gray-900">
                  ₹{{ formatPrice(getTotalPrice()) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="mb-16">
          <div class="alert alert-danger p-12 rounded-xl border border-red-200 bg-red-50">
            <div class="flex items-center gap-8">
              <i class="ph ph-warning-circle text-red-600"></i>
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
            </div>
          </div>
        </div>
        <div v-if="successMessage" class="mb-16">
          <div class="alert alert-success p-12 rounded-xl border border-green-200 bg-green-50">
            <div class="flex items-center gap-8">
              <i class="ph ph-check-circle text-green-600"></i>
              <span class="text-green-700 text-sm">{{ successMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
<div class="flex justify-center items-center h-screen">
          <button
            @click="confirmAddToCart"
            :class="[
              'btn flex-1 py-12 rounded-xl font-semibold transition-all duration-400 flex items-center justify-center gap-8 shadow-sm hover:shadow-lg active:scale-95',
              selectedProductStock > 0 ? 'btn-main hover:bg-main-700' : 'btn-secondary cursor-not-allowed opacity-50'
            ]"
            :disabled="selectedProductStock <= 0"
          >
            <i class="ph ph-shopping-cart"></i>
            Add to Cart (₹{{ formatPrice(getTotalPrice()) }})
          </button>
          <button
            @click="closeAddToCartModal"
            class="btn btn-outline-main border-2 py-12 px-24 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- <WishlistShop /> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../store/useProductStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { toKebabCase } from "../utlis/toKebabCase"
import WishlistBreakcrumb from '../../components/wishlist/WishlistBreakcrumb.vue'
import Breadcrumbs from '../../components/navigation/Breadcrumbs.vue'
import WishlistShop from '../../components/wishlist/WishlistShop.vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

const toast = useToast()


useHead({
  title: "My Wishlist"
})

// Pinia Stores
const productStore = useProductStore()
const wishlistStore = useWishlistStore()

// Refs
const loading = ref(false)
const showAddToCartModal = ref(false)
const selectedProduct = ref(null)
const selectedProductName = ref('')
const selectedProductStock = ref(0)
const selectedColor = ref('')
const selectedSize = ref('')
const selectedVariant = ref(null)
const selectedVariantPrice = ref(0)
const selectedVariantStock = ref(0)
const selectedVariantImages = ref([])
const activeImageIndex = ref(0)
const quantity = ref(1)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const availableColors = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableColors(selectedProduct.value)
})

const availableSizes = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableSizes(selectedProduct.value)
})

// Helper functions from product store
const getProductName = (product) => productStore.getProductName(product)
const getPrimaryImage = (product) => productStore.getProductImage(product) || '/assets/images/placeholder-product.jpg'
const getDiscountedPrice = (product) => productStore.getDiscountedPrice(product)
const getOriginalPrice = (product) => productStore.getOriginalPrice(product)
const getProductStock = (product) => productStore.getProductStock(product)
const getProductId = (product) => productStore.getProductId(product)
const getProductRating = (product) => productStore.getProductRating(product) || 4.5
const getReviewCount = (product) => productStore.getReviewCount(product) || 0
const getColorHex = (color) => productStore.getColorHex(color)
const getDiscountValue = (product) => product?.mainProduct?.discountValue || 0

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}

const getProductLink = (product) => {
  const productName = toKebabCase(getProductName(product))
  const productId = product.groupId || getProductId(product)
  return `/shop-all/${productName}--${productId}`
}

const getStockStatus = (product) => {
  const stock = getProductStock(product)
  if (stock > 10) return 'In Stock'
  if (stock > 0) return 'Low Stock'
  return 'Out of Stock'
}

// Variant functions
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
  if (!selectedProduct.value?.variants) return null
  const variant = selectedProduct.value.variants.find(v =>
    v?.attributes?.[0]?.color === color && v.images?.length > 0
  )
  return variant?.images?.[0]?.imageUrl || getPrimaryImage(selectedProduct.value)
}

const getVariantImages = (color, size) => {
  if (!selectedProduct.value?.variants) return []
  
  const variant = selectedProduct.value.variants.find(v => {
    const variantColor = v?.attributes?.[0]?.color
    const variantSize = v?.attributes?.[0]?.size
    const colorMatch = !color || variantColor === color
    const sizeMatch = !size || variantSize === size
    return colorMatch && sizeMatch
  })
  
  if (variant?.images?.length > 0) {
    return variant.images.map(img => img.imageUrl).filter(Boolean)
  }
  
  return selectedProduct.value.mainProduct?.images?.map(img => img.imageUrl).filter(Boolean) || []
}

const getSizeGuide = (size) => {
  const sizeGuide = {
    'XS': 'Extra Small',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'Extra Large',
    'XXL': '2XL',
    'XXXL': '3XL'
  }
  return sizeGuide[size] || ''
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

// Image functions
const getCurrentMainImage = () => {
  if (selectedVariantImages.value.length > 0 && activeImageIndex.value < selectedVariantImages.value.length) {
    return selectedVariantImages.value[activeImageIndex.value]
  }
  return getPrimaryImage(selectedProduct.value)
}

const setActiveImageIndex = (index) => {
  activeImageIndex.value = index
}

// Quantity functions
const getMaxQuantity = () => {
  return selectedVariant.value?.stock ?? selectedProductStock.value
}

const getTotalPrice = () => {
  if (!selectedProduct.value) return 0
  const price = selectedVariantPrice.value || getDiscountedPrice(selectedProduct.value)
  return price * quantity.value
}

const decreaseQuantity = () => {
  if (quantity.value > 1 && selectedProductStock.value > 0) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  const maxQty = getMaxQuantity()
  if (quantity.value < maxQty && selectedProductStock.value > 0) {
    quantity.value++
  }
}

const validateQuantity = () => {
  if (quantity.value < 1) quantity.value = 1
  const maxQty = getMaxQuantity()
  if (quantity.value > maxQty) quantity.value = maxQty
}

const getStockPercentage = () => {
  const stock = selectedVariantStock.value ?? selectedProductStock.value
  const maxStock = selectedProduct.value?.mainProduct?.maxStock || 100
  return Math.min((stock / maxStock) * 100, 100)
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
  selectedVariantImages.value = []
  activeImageIndex.value = 0
  quantity.value = 1
  errorMessage.value = ''
  successMessage.value = ''
  
  // Get initial images
  selectedVariantImages.value = getVariantImages('', '')
  showAddToCartModal.value = true
}

const closeAddToCartModal = () => {
  showAddToCartModal.value = false
  setTimeout(() => {
    selectedProduct.value = null
    selectedColor.value = ''
    selectedSize.value = ''
    selectedVariant.value = null
    quantity.value = 1
    errorMessage.value = ''
    successMessage.value = ''
  }, 300)
}

// Selection functions
const selectColor = (color) => {
  selectedColor.value = color
  updateSelectedVariant()
  selectedVariantImages.value = getVariantImages(color, selectedSize.value)
  activeImageIndex.value = 0
}

const selectSize = (size) => {
  selectedSize.value = size
  updateSelectedVariant()
  selectedVariantImages.value = getVariantImages(selectedColor.value, size)
  activeImageIndex.value = 0
}

const updateSelectedVariant = () => {
  if (!selectedProduct.value) return
  
  selectedVariant.value = findMatchingVariant()
  if (selectedVariant.value) {
    selectedVariantPrice.value = getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedVariant.value.stock ?? selectedProductStock.value
    
    if (quantity.value > selectedVariantStock.value) {
      quantity.value = selectedVariantStock.value
    }
    
    selectedVariantImages.value = getVariantImages(selectedColor.value, selectedSize.value)
  } else {
    selectedVariantPrice.value = getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedProductStock.value
    selectedVariantImages.value = getVariantImages('', '')
  }
}

// Cart functions
const addToCart = (product, variant = null, qty = 1, selectedColor = null, selectedSize = null) => {
  try {
    const existingCart = localStorage.getItem('shopping_cart')
    let cart = existingCart ? JSON.parse(existingCart) : []
    
    const targetProduct = variant || product.mainProduct || product
    
    // Check if product already exists
    const existingIndex = cart.findIndex(item => {
      const sameProduct = item.productId === targetProduct.id
      const sameVariant = item.variantId === (variant?.id || null)
      const sameColor = item.color === selectedColor
      const sameSize = item.size === selectedSize
      return sameProduct && sameVariant && sameColor && sameSize
    })
    
    const discountedPrice = getDiscountedPrice(product)
    
    if (existingIndex > -1) {
      const newQuantity = cart[existingIndex].quantity + qty
      const maxQuantity = cart[existingIndex].maxStock ?? cart[existingIndex].stock
      
      if (newQuantity > maxQuantity) return false
      
      cart[existingIndex].quantity = newQuantity
      cart[existingIndex].totalPrice = cart[existingIndex].price * newQuantity
    } else {
      const cartItem = {
        id: Date.now(),
        productId: targetProduct.id,
        variantId: variant?.id || null,
        name: getProductName(product),
        color: selectedColor,
        size: selectedSize,
        sku: targetProduct.sku || product.mainProduct?.sku,
        price: discountedPrice,
        quantity: qty,
        totalPrice: discountedPrice * qty,
        image: getCurrentMainImage(),
        stock: variant?.stock ?? getProductStock(product),
        maxStock: variant?.stock ?? getProductStock(product),
        groupId: product.groupId || product.id
      }
      cart.push(cartItem)
    }
    
    localStorage.setItem('shopping_cart', JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cart-updated'))
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
    successMessage.value = `✓ ${quantity.value} × ${selectedProductName.value} added to cart!`
    setTimeout(() => {
      if (successMessage.value) closeAddToCartModal()
    }, 500)
  } else {
    errorMessage.value = 'Failed to add product to cart. Stock might be insufficient.'
  }
}

// Wishlist actions
const removeFromWishlist = async (product) => {
  const result = await Swal.fire({
    title: 'Remove item?',
    text: 'This product will be removed from your wishlist.', 
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
      popup: 'rounded-16',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  })

  if (result.isConfirmed) {
    const removed = wishlistStore.removeItem(product)
    if (removed) {
      // Vue Toastification
      toast.success('Removed from wishlist', {
        position: 'top-right',
        timeout: 1800,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
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
  console.log('Wishlist items:', wishlistStore.items)
})
</script>

<style scoped>
/* Cart-style Table Styling */
.up{
  margin-top: 50px;
}
.wishlist-table {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
  font-size: 16px;
}

.table.style-three tr:hover {
  background-color: #f9fafb;
}

.table-product__thumb {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.table-product__thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.table-product__thumb:hover img {
  transform: scale(1.05);
}

/* Variant Chips */
.variant-info {
  font-size: 13px;
}

.variant-chip {
  padding: 4px 10px;
  border-radius: 20px;
  background: #f7f7f7;
  color: #111;
  font-weight: 500;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.variant-chip:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}

/* Remove Button */
.remove-tr-btn {
  transition: all 0.3s ease;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.remove-tr-btn:hover {
  color: #dc2626;
  transform: translateX(-2px);
}

/* Button Styles */
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
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
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
  padding: 20px;
}

/* Color and Size Options */
.color-option {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.size-option {
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.size-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Quantity Input */
.quantity__input {
  -moz-appearance: textfield;
  appearance: textfield;
}

.quantity__input::-webkit-outer-spin-button,
.quantity__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity__input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Progress Bar */
.progress {
  position: relative;
  overflow: hidden;
}

.progress-bar {
  position: relative;
  border-radius: 9999px;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* SweetAlert Customization */
.swal-confirm-btn {
  background-color: #dc2626;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
}

.swal-confirm-btn:hover {
  background-color: #b91c1c;
}

.swal-cancel-btn {
  background-color: #f3f4f6;
  color: #111827;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 500;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .wishlist-table {
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
  
  .table-product {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .table-product__thumb {
    width: 80px;
    height: 80px;
  }
  
  .modal-content {
    max-width: 95%;
    margin: 8px;
    border-radius: 12px;
  }
  
  .color-option {
    width: 44px;
    height: 44px;
  }
  
  .size-option {
    min-width: 52px;
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* Spinner Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
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

/* Custom scrollbar */
.wishlist-table::-webkit-scrollbar {
  height: 6px;
}

.wishlist-table::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.wishlist-table::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.wishlist-table::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>