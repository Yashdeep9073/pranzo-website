<template>
  <section class="product-details py-80">
    <div class="container container-lg">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-16">Product loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Main Content -->
      <div v-else-if="mainProduct" class="row gy-4">
        <div class="col-lg-9">
          <div class="row gy-4">
            <!-- Product Images Section -->
            <div class="col-xl-6">
              <div class="product-details__left">
                <!-- Main Product Image Slider -->
                <div class="product-details__thumb-slider overflow-hidden">
                  <Swiper
                    :modules="[Thumbs]"
                    :thumbs="{ swiper: thumbsSwiper }"
                    :spaceBetween="0"
                    :slidesPerView="1"
                    class="main-swiper"
                    @swiper="setMainSwiper"
                    @slideChange="onSlideChange"
                  >
                    <SwiperSlide
                      v-for="(image, index) in mainImages"
                      :key="index"
                      class="main-image-slide"
                    >
                      <div class="main-image-container w-full">
                        <img 
                          :src="image" 
                          :alt="`Product image ${index + 1}`"
                          class="main-product-image w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>

                <!-- Thumbnail Slider -->
                <div class="mt-24">
                  <div class="thumbnail-container">
                    <Swiper
                      @swiper="setThumbsSwiper"
                      :spaceBetween="12"
                      :slidesPerView="5"
                      :freeMode="true"
                      :watchSlidesProgress="true"
                      class="thumbnail-swiper"
                    >
                      <SwiperSlide
                        v-for="(thumb, index) in thumbnailImages"
                        :key="index"
                        @click="goToSlide(index)"
                      >
                        <div 
                          :class="['thumbnail-item', activeThumb === index ? 'active-thumbnail' : '']"
                        >
                          <div class="thumbnail-image-wrapper">
                            <img 
                              :src="thumb" 
                              :alt="`Thumbnail ${index + 1}`"
                              class="thumbnail-image"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Details -->
            <div class="col-xl-6">
              <div class="product-details__content">
                <h5 class="mb-12">{{ mainProduct.name }}</h5>
                <div class="flex-align flex-wrap gap-12">
                  <div class="flex-align gap-12 flex-wrap">
                    <div class="flex-align gap-8">
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    </div>
                    <span class="text-sm fw-medium text-neutral-600">4.7 Star Rating</span>
                    <span class="text-sm fw-medium text-gray-500">({{ mainProduct.reviews?.length || 0 }})</span>
                  </div>
                  <span class="text-sm fw-medium text-gray-500">|</span>
                  <span class="text-gray-900">
                    <span class="text-gray-400">SKU:</span> {{ selectedVariant?.sku || mainProduct.sku }}
                  </span>
                </div>
                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>
                <p class="text-gray-700">{{ mainProduct.description }}</p>
                
                <!-- Color Selection -->
                <div v-if="availableColors.length > 0" class="mt-32">
                  <span class="text-gray-900 d-block mb-8 fw-semibold">Color:</span>
                  <div class="flex-align flex-wrap gap-12">
                    <div 
                      v-for="color in availableColors" 
                      :key="color"
                      @click="selectColor(color)"
                      :class="[
                        'color-option w-40 h-40 rounded-full border-2 cursor-pointer transition-all duration-300 flex-center',
                        selectedColor === color 
                          ? 'border-main-600 scale-110 shadow-lg' 
                          : 'border-gray-300 hover:border-gray-400'
                      ]"
                      :style="{ backgroundColor: getColorCode(color) }"
                      :title="color"
                    >
                      <i v-if="selectedColor === color" class="ph-fill ph-check text-white text-sm"></i>
                    </div>
                  </div>
                </div>

                <!-- Size Selection -->
                <div v-if="availableSizes.length > 0" class="mt-24">
                  <div class="flex-between mb-8">
                    <span class="text-gray-900 d-block fw-semibold">Size:</span>
                    <button 
                      @click="openSizeGuide"
                      class="text-sm text-main-600 hover:text-main-800 transition-colors flex items-center gap-1"
                    >
                      Size Guide <i class="ph ph-info text-xs"></i>
                    </button>
                  </div>
                  <div class="flex-align flex-wrap gap-12">
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
                </div>

                <!-- Selected Variant Info -->
                <div v-if="selectedVariant" class="mt-32 bg-gray-50 rounded-lg p-16">
                  <div class="flex-between items-center">
                    <div>
                      <span class="text-sm text-gray-600">Selected:</span>
                      <div class="flex-align gap-12 mt-4">
                        <span class="badge bg-blue-100 text-blue-800 border border-blue-200">
                          {{ selectedVariant.color }}
                        </span>
                        <span class="badge bg-green-100 text-green-800 border border-green-200">
                          {{ selectedVariant.size }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-sm text-gray-600">Stock:</span>
                      <div :class="[
                        'text-sm font-semibold mt-4',
                        selectedVariant.stock > 10 ? 'text-green-600' : 
                        selectedVariant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      ]">
                        {{ selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of Stock' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Price Section -->
                <div class="mt-32 flex-align flex-wrap gap-32">
                  <div class="flex-align gap-8">
                    <h4 class="mb-0">₹{{ calculateDiscountedPrice() }}</h4>
                    <span v-if="mainProduct.discountValue > 0" class="text-md text-gray-500 text-decoration-line-through">
                      ₹{{ selectedVariant?.price || mainProduct.price }}
                    </span>
                    <span v-if="mainProduct.discountValue > 0" class="text-sm text-success-600 fw-medium ms-8">
                      {{ mainProduct.discountValue }}% OFF
                    </span>
                  </div>
                  <a @click="orderOnWhatsapp" class="btn btn-main rounded-pill">
                    Order on What'sApp
                  </a>
                </div>
                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>

                <!-- Special Offer -->
                <div v-if="mainProduct.discountValue > 0" class="flex-align flex-wrap gap-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-12 py-16 px-24 border border-blue-100">
                  <div class="flex-align gap-16">
                    <span class="text-main-600 text-sm fw-semibold"> Special Offer:</span>
                  </div>
                  <div class="countdown" id="countdown11">
                    <ul class="countdown-list flex-align flex-wrap gap-2">
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="days text-main-600">05</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="hours text-main-600">12</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="minutes text-main-600">30</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="seconds text-main-600">45</span>
                      </li>
                    </ul>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium">Remains until the end of the offer</span>
                </div>
                     
                <!-- Stock Progress -->
                <div class="mb-24">
                  <div class="mt-32 flex-align gap-12 mb-16">
                    <span class="w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 flex-center rounded-circle text-green-600 box-shadow-lg">
                      <i class="ph-fill ph-lightning text-lg"></i>
                    </span>
                    <h6 class="text-md mb-0 fw-bold text-gray-900">
                      {{ getStockStatus() }}
                    </h6>
                  </div>
                  <div class="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                       :aria-valuenow="calculateStockPercentage()"
                       aria-valuemin="0"
                       aria-valuemax="100">
                    <div class="progress-bar bg-gradient-to-r from-green-500 to-emerald-500 rounded-pill"
                         :style="{ width: calculateStockPercentage() + '%' }"></div>
                  </div>
                  <span class="text-sm text-gray-700 mt-8">
                    Available: {{ selectedVariant?.stock || mainProduct.stock }} units
                  </span>
                </div>

                <!-- Quantity and Actions -->
                <span class="text-gray-900 d-block mb-8 fw-semibold">Quantity:</span>
                <div class="flex-between gap-16 flex-wrap">
                  <div class="flex-align flex-wrap gap-16">
                  <div class="border border-gray-200 rounded-full py-8 px-16 flex-align bg-white shadow-sm">
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
                        :max="selectedVariant?.stock || mainProduct.stock"
                        min="0"
                        @input="validateQuantity"
                      />
                      <button
                        type="button"
                        @click="increaseQuantity"
                        class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                        :disabled="quantity >= (selectedVariant?.stock || mainProduct.stock)"
                        :class="quantity >= (selectedVariant?.stock || mainProduct.stock) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'"
                      >
                        <i class="ph ph-plus text-lg"></i>
                      </button>
                    </div>
                    <button
                      @click="addToCart"
                      :class="[
                        'btn rounded-full flex-align d-inline-flex gap-8 px-48 py-12 fw-semibold shadow-sm transition-all duration-300',
                        (selectedVariant?.stock || mainProduct.stock) <= 0 ? 'btn-secondary' : 'btn-main hover:shadow-lg hover:-translate-y-0.5'
                      ]"
                      :disabled="(selectedVariant?.stock || mainProduct.stock) <= 0 || quantity <= 0"
                    >
                      <i class="ph ph-shopping-cart text-lg"></i>
                      {{ (selectedVariant?.stock || mainProduct.stock) <= 0 ? 'Out of Stock' : 'Add To Cart' }}
                    </button> 

                  </div>

                  <div class="flex-align gap-12">
                    <button
                      @click="toggleWishlist"
                      :class="['w-52 h-52 flex-center rounded-circle text-xl transition-all duration-300', 
                               isInWishlist ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg' : 
                               'bg-gradient-to-br from-gray-50 to-white text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:text-red-500 border border-gray-100 shadow-sm']"
                    >
                      <i class="ph" :class="isInWishlist ? 'ph-heart-fill' : 'ph-heart'"></i>
                    </button>
                    <button
                      @click="compareProduct"
                      class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300"
                    >
                      <i class="ph ph-shuffle"></i>
                    </button>
                    <button
                      @click="shareProduct"
                      class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300"
                    >
                      <i class="ph ph-share-network"></i>
                    </button>
                  </div>
                </div>

                <!-- Success Message -->
                <div v-if="showSuccessMessage" class="mt-16">
                  <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <div class="d-flex align-items-center gap-12">
                      <i class="ph-fill ph-check-circle text-lg"></i>
                      <span>{{ successMessage }}</span>
                    </div>
                    <button type="button" class="btn-close" @click="showSuccessMessage = false"></button>
                  </div>
                </div>

                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>

                <!-- Category Info -->
                <div class="mt-24">
                  <div class="flex-align gap-12 mb-16">
                    <span class="text-gray-900 fw-semibold">Category:</span>
                    <!-- Main Category -->
                    <span class="badge bg-black text-white border border-black">
                      {{ mainProduct.category?.name }}
                    </span>
                    <!-- Sub Category -->
                    <span 
                      v-if="mainProduct.subCategory"
                      class="badge bg-black text-white border border-black"
                    >
                      {{ mainProduct.subCategory.name }}
                    </span>
                    <!-- Sub-Sub Category -->
                    <span 
                      v-if="mainProduct.subSubCategory"
                      class="badge bg-black text-white border border-black"
                    >
                      {{ mainProduct.subSubCategory.name }}
                    </span>
                  </div>
                </div>

                <!-- Manufacturer & Packer Info -->
                <div v-if="mainProduct.manufacturerDetails || mainProduct.packerDetails" class="mt-24">
                  <span class="text-gray-900 d-block mb-8 fw-semibold">Product Details:</span>
                  <div class="text-sm text-gray-700 space-y-2">
                    <div v-if="mainProduct.manufacturerDetails" class="flex items-start gap-2">
                      <span class="text-gray-500 min-w-[120px]">Manufacturer:</span>
                      <span>{{ mainProduct.manufacturerDetails }}</span>
                    </div>
                    <div v-if="mainProduct.packerDetails" class="flex items-start gap-2">
                      <span class="text-gray-500 min-w-[120px]">Packer:</span>
                      <span>{{ mainProduct.packerDetails }}</span>
                    </div>
                    <div v-if="mainProduct.origin" class="flex items-start gap-2">
                      <span class="text-gray-500 min-w-[120px]">Origin:</span>
                      <span>{{ mainProduct.origin }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden shadow-sm">
            <!-- Store Info -->
            <div class="p-24 bg-yellow-400">
              <div class="flex-between rounded-full p-8">
                <div class="flex-align gap-8">
                  <span class="w-44 h-44 bg-white rounded-full flex-center text-2xl text-main-600">
                    <i class="ph ph-storefront"></i>
                  </span>
                  <span class="text-white fw-semibold">by Marketpro</span>
                </div>
                <NuxtLink
                  to="/shop"
                  class="btn btn-white rounded-full text-uppercase fw-semibold transition-all duration-300"
                >
                  View Store
                </NuxtLink>
              </div>
            </div>

            <!-- Features Section -->
            <div class="sidebar-features">
              <!-- Fast Delivery -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-truck"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Fast Delivery</h6>
                  <p class="text-gray-700 text-sm">Lightning-fast shipping, guaranteed.</p>
                </div>
              </div>

              <!-- Free Returns -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-arrow-u-up-left"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Free 90-day returns</h6>
                  <p class="text-gray-700 text-sm">Shop risk-free with easy returns.</p>
                </div>
              </div>

              <!-- Pickup Available -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Pickup available at Shop location</h6>
                  <p class="text-gray-700 text-sm">Usually ready in 24 hours</p>
                </div>
              </div>

              <!-- Payment -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-credit-card"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Payment</h6>
                  <p class="text-gray-700 text-sm">Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card.</p>
                </div>
              </div>

              <!-- Warranty -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Warranty</h6>
                  <p class="text-gray-700 text-sm">The Consumer Protection Act does not provide for the return of this product of proper quality.</p>
                </div>
              </div>

              <!-- Packaging -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-package"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Packaging</h6>
                  <p class="text-gray-700 text-sm">Research & development value proposition graphical user interface investor.</p>
                </div>
              </div>
            </div>

            <!-- Cart Summary (LIVE UPDATES) -->
            <div class="p-24 border-t border-gray-100">
              <div class="flex-between mb-16">
                <h6 class="text-sm fw-semibold text-gray-900">Cart Summary</h6>
                <button @click="refreshCartSummary" class="text-xs text-main-600 hover:text-main-800 transition-colors">
                  <i class="ph ph-arrows-clockwise"></i> Refresh
                </button>
              </div>
              
              <div v-if="cartItems.length > 0" class="space-y-4">
                <!-- Cart Items List -->
                <div class="max-h-60 overflow-y-auto pr-2 space-y-3">
                  <div v-for="item in cartItems" :key="item.id" 
                       class="cart-item border border-gray-100 rounded-lg p-12 bg-white">
                    <div class="flex items-start gap-12">
                      <div class="flex-shrink-0">
                        <div class="w-40 h-40 rounded-lg overflow-hidden">
                          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex-between items-start">
                          <div>
                            <p class="text-xs font-medium text-gray-800 truncate">{{ item.name }}</p>
                            <div class="flex items-center gap-2 mt-1">
                              <span v-if="item.color" class="text-xs text-gray-600">{{ item.color }}</span>
                              <span v-if="item.size" class="text-xs text-gray-600">| {{ item.size }}</span>
                            </div>
                          </div>
                          <button @click="removeFromCart(item.id)" 
                                  class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="ph ph-x text-sm"></i>
                          </button>
                        </div>
                        
                        <div class="flex-between items-center mt-8">
                          <div class="flex items-center gap-2">
                            <button @click="updateCartItemQuantity(item.id, -1)"
                                    :disabled="item.quantity <= 1"
                                    :class="['w-20 h-20 flex-center rounded-full text-xs transition-colors', 
                                             item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100']">
                              <i class="ph ph-minus"></i>
                            </button>
                            <span class="text-sm font-medium w-24 text-center">{{ item.quantity }}</span>
                            <button @click="updateCartItemQuantity(item.id, 1)"
                                    :class="['w-20 h-20 flex-center rounded-full text-xs transition-colors', 
                                             'text-gray-600 hover:bg-gray-100']">
                              <i class="ph ph-plus"></i>
                            </button>
                          </div>
                          <div class="text-right">
                            <p class="text-xs font-semibold text-main-600">₹{{ (item.price * item.quantity).toFixed(2) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Cart Totals -->
                <div class="pt-16 border-t border-gray-100 space-y-3">
                  <div class="flex-between">
                    <span class="text-sm text-gray-600">Total Items:</span>
                    <span class="text-sm font-semibold">{{ cartItemCount }}</span>
                  </div>
                  <div class="flex-between">
                    <span class="text-sm text-gray-600">Subtotal:</span>
                    <span class="text-sm font-semibold">₹{{ cartSubtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex-between">
                    <span class="text-sm text-gray-600">Shipping:</span>
                    <span class="text-sm font-semibold text-green-600">FREE</span>
                  </div>
                  <div class="flex-between pt-8 border-t border-gray-200">
                    <span class="text-sm font-semibold text-gray-900">Total:</span>
                    <span class="text-lg font-bold text-main-600">₹{{ cartTotalPrice.toFixed(2) }}</span>
                  </div>
                  
                  <NuxtLink to="/product/cart" class="btn btn-main w-100 mt-16">
                    <i class="ph ph-shopping-cart me-2"></i> View Cart
                  </NuxtLink>
                  
                  <NuxtLink to="/checkout" class="btn btn-outline-main w-100">
                    <i class="ph ph-credit-card me-2"></i> Checkout
                  </NuxtLink>
                </div>
              </div>
              
              <div v-else class="text-center py-8">
                <div class="mb-12">
                  <i class="ph ph-shopping-cart text-3xl text-gray-300"></i>
                </div>
                <p class="text-sm text-gray-500 mb-4">Your cart is empty</p>
                <p class="text-xs text-gray-400">Add items to your cart to see them here</p>
              </div>
            </div>

            <!-- Variants Summary -->
            <div v-if="variants.length > 0" class="p-24 border-t border-gray-100">
              <h6 class="text-sm mb-16 fw-semibold text-gray-900">Available Variants</h6>
              <div class="space-y-3 max-h-200 overflow-y-auto pr-2">
                <div 
                  v-for="variant in variants" 
                  :key="variant.id"
                  @click="selectVariant(variant)"
                  :class="[
                    'variant-item p-12 rounded-lg border cursor-pointer transition-all duration-300',
                    selectedVariant?.id === variant.id 
                      ? 'border-main-600 bg-main-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex-between items-center">
                    <div>
                      <div class="flex-align gap-2 mb-2">
                        <span class="text-xs text-gray-600">SKU:</span>
                        <span class="text-xs font-medium">{{ variant.sku }}</span>
                      </div>
                      <div class="flex-align gap-2">
                        <span class="text-xs text-gray-600">Color:</span>
                        <span class="text-xs font-medium">{{ variant.color }}</span>
                        <span class="text-xs text-gray-400 mx-2">•</span>
                        <span class="text-xs text-gray-600">Size:</span>
                        <span class="text-xs font-medium">{{ variant.size }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div :class="[
                        'text-xs font-medium',
                        variant.stock > 10 ? 'text-green-600' : 
                        variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      ]">
                        {{ variant.stock }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Tabs Section -->
      <div v-if="!loading && !error && mainProduct" class="pt-80">
        <div class="product-dContent border border-gray-100 rounded-24 shadow-sm">
          <div class="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16 p-24">
            <ul class="nav common-tab nav-pills mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link fw-semibold', activeTab === 'description' ? 'active' : '']"
                  @click="activeTab = 'description'"
                  type="button"
                >
                  Description
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link fw-semibold', activeTab === 'attributes' ? 'active' : '']"
                  @click="activeTab = 'attributes'"
                  type="button"
                >
                  Attributes
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link fw-semibold', activeTab === 'reviews' ? 'active' : '']"
                  @click="activeTab = 'reviews'"
                  type="button"
                >
                  Reviews ({{ mainProduct.reviews?.length || 0 }})
                </button>
              </li>
            </ul>
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-12 flex-align gap-8 hover:from-green-100 hover:to-emerald-100 hover:text-green-700 transition-all duration-300 border border-green-200">
              <img src="/assets/images/icon/satisfaction-icon.png" alt="Satisfaction Guaranteed" class="w-24 h-24">
              100% Satisfaction Guaranteed
            </div>
          </div>
          
          <div class="product-dContent__box p-24">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="tab-content">
              <div class="mb-40">
                <h6 class="mb-24 fw-bold">Product Description</h6>
                <p class="text-gray-700">{{ mainProduct.description }}</p>
                
                <div v-if="mainProduct.category" class="mt-32">
                  <h6 class="mb-16 fw-semibold">Product Categories</h6>
                  <div class="d-flex flex-wrap gap-12">
                    <span class="badge bg-black text-white border border-black">
                      {{ mainProduct.category.name }}
                    </span>
                    <span 
                      v-if="mainProduct.subCategory"
                      class="badge bg-black text-white border border-black"
                    >
                      {{ mainProduct.subCategory.name }}
                    </span>
                    <span 
                      v-if="mainProduct.subSubCategory"
                      class="badge bg-black text-white border border-black"
                    >
                      {{ mainProduct.subSubCategory.name }}
                    </span>
                  </div>
                </div>

                <!-- Product Information -->
                <div class="mt-40">
                  <h6 class="mb-24 fw-bold">Product Information</h6>
                  <ul class="mt-32">
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        SKU: <span class="text-gray-500">{{ selectedVariant?.sku || mainProduct.sku }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Barcode: <span class="text-gray-500">{{ mainProduct.barcode || 'N/A' }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Unit: <span class="text-gray-500">{{ mainProduct.unit?.name }} ({{ mainProduct.unit?.shortName }})</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.manufacturedDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Manufactured: <span class="text-gray-500">{{ formatDate(mainProduct.manufacturedDate) }}</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.expiryDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Expiry: <span class="text-gray-500">{{ formatDate(mainProduct.expiryDate) }}</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.origin" class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Origin: <span class="text-gray-500">{{ mainProduct.origin }}</span>
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Manufacturer Details -->
                <div v-if="mainProduct.manufacturerDetails || mainProduct.packerDetails" class="mt-40">
                  <h6 class="mb-24 fw-bold">Manufacturing & Packaging Details</h6>
                  <div class="space-y-4">
                    <div v-if="mainProduct.manufacturerDetails" class="bg-gray-50 rounded-lg p-4">
                      <h6 class="text-sm font-semibold text-gray-700 mb-2">Manufacturer Details:</h6>
                      <p class="text-gray-600 text-sm">{{ mainProduct.manufacturerDetails }}</p>
                    </div>
                    <div v-if="mainProduct.packerDetails" class="bg-gray-50 rounded-lg p-4">
                      <h6 class="text-sm font-semibold text-gray-700 mb-2">Packer Details:</h6>
                      <p class="text-gray-600 text-sm">{{ mainProduct.packerDetails }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attributes Tab -->
            <div v-else-if="activeTab === 'attributes'" class="tab-content">
              <div class="mb-40">
                <h6 class="mb-24 fw-bold">Product Attributes</h6>
                
                <div v-if="selectedVariant" class="mb-32 p-24 border border-gray-100 rounded-16 bg-gradient-to-r from-gray-50 to-white">
                  <h6 class="text-md fw-semibold mb-16">Selected Variant</h6>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
                    <!-- Basic Attributes -->
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <span class="w-20 h-20 rounded-full border border-gray-300" 
                              :style="{ backgroundColor: getColorCode(selectedVariant.color) }"></span>
                        <div>
                          <span class="text-gray-500 text-sm">Color:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.color }}</span>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <span class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-full flex-center text-xs shadow-sm">
                          <i class="ph ph-ruler"></i>
                        </span>
                        <div>
                          <span class="text-gray-500 text-sm">Size:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.size }}</span>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <span class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-full flex-center text-xs shadow-sm">
                          <i class="ph ph-fabric"></i>
                        </span>
                        <div>
                          <span class="text-gray-500 text-sm">SKU:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.sku }}</span>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3">
                        <span class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-full flex-center text-xs shadow-sm">
                          <i class="ph ph-package"></i>
                        </span>
                        <div>
                          <span class="text-gray-500 text-sm">Stock:</span>
                          <span :class="[
                            'font-medium ml-2',
                            selectedVariant.stock > 10 ? 'text-green-600' : 
                            selectedVariant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          ]">
                            {{ selectedVariant.stock }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Price Information -->
                    <div class="space-y-3">
                      <h6 class="text-sm font-semibold text-gray-700 mb-8">Pricing</h6>
                      
                      <div class="bg-white p-3 rounded-lg border border-gray-100">
                        <span class="text-gray-500 text-xs">Price</span>
                        <p class="text-gray-800 font-medium">₹{{ selectedVariant.price }}</p>
                      </div>
                      
                      <div v-if="mainProduct.discountValue > 0" class="bg-white p-3 rounded-lg border border-gray-100">
                        <span class="text-gray-500 text-xs">Discount</span>
                        <p class="text-green-600 font-medium">{{ mainProduct.discountValue }}% OFF</p>
                      </div>
                      
                      <div class="bg-white p-3 rounded-lg border border-gray-100">
                        <span class="text-gray-500 text-xs">Discounted Price</span>
                        <p class="text-main-600 font-medium">₹{{ calculateDiscountedPrice() }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- All Variants -->
                <div v-if="variants.length > 0">
                  <h6 class="text-md fw-semibold mb-16">All Variants</h6>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                    <div 
                      v-for="variant in variants" 
                      :key="variant.id"
                      class="border border-gray-200 rounded-lg p-16 hover:border-gray-300 transition-colors"
                    >
                      <div class="flex-between items-start mb-12">
                        <div>
                          <span class="text-xs text-gray-500">SKU</span>
                          <p class="text-sm font-medium">{{ variant.sku }}</p>
                        </div>
                        <div class="text-right">
                          <span class="text-xs text-gray-500">Stock</span>
                          <p :class="[
                            'text-sm font-medium',
                            variant.stock > 10 ? 'text-green-600' : 
                            variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          ]">
                            {{ variant.stock }}
                          </p>
                        </div>
                      </div>
                      <div class="flex-align gap-8">
                        <span class="badge bg-blue-100 text-blue-800">{{ variant.color }}</span>
                        <span class="badge bg-green-100 text-green-800">{{ variant.size }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-40 border border-gray-100 rounded-12 bg-gray-50">
                  <div class="mb-16">
                    <i class="ph ph-list-checks text-4xl text-gray-400"></i>
                  </div>
                  <p class="text-gray-500 mb-8">No variants available for this product.</p>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-else-if="activeTab === 'reviews'" class="tab-content">
              <div class="row g-4">
                <div class="col-lg-6">
                  <h6 class="mb-24 fw-bold">Customer Reviews ({{ mainProduct.reviews?.length || 0 }})</h6>
                  
                  <!-- Reviews List -->
                  <div v-if="mainProduct.reviews && mainProduct.reviews.length > 0">
                    <div v-for="(review, index) in mainProduct.reviews" :key="index"
                         class="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                      <img src="/assets/images/thumbs/comment-img1.png" alt="" class="w-52 h-52 object-fit-cover rounded-full flex-shrink-0 shadow-sm">
                      <div class="flex-grow-1">
                        <div class="flex-between align-items-start gap-8">
                          <div class="">
                            <h6 class="mb-12 text-md fw-semibold">Customer {{ index + 1 }}</h6>
                            <div class="flex-align gap-8">
                              <span v-for="star in 5" :key="star" class="text-xs fw-medium d-flex">
                                <i class="ph" :class="star <= review.rating ? 'ph-fill ph-star text-warning-600' : 'ph-star text-gray-300'"></i>
                              </span>
                            </div>
                          </div>
                          <span class="text-gray-800 text-xs">{{ formatDate(review.createdAt) }}</span>
                        </div>
                        <p class="text-gray-700 mt-16">{{ review.comment || 'No comment provided' }}</p>
                        <div class="mt-16 flex-align gap-16">
                          <span class="text-sm text-gray-500">
                            <i class="ph ph-thumbs-up"></i>
                            {{ review.helpfulVotes || 0 }} helpful
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-40 border border-gray-100 rounded-12 bg-gray-50">
                    <div class="mb-16">
                      <i class="ph ph-chat-circle-text text-4xl text-gray-400"></i>
                    </div>
                    <p class="text-gray-500 mb-8">No reviews yet.</p>
                    <p class="text-gray-400 text-sm">Be the first to review this product!</p>
                  </div>

                  <!-- Review Form -->
                  <div class="mt-56 border border-gray-100 rounded-12 p-24 bg-gradient-to-br from-gray-50 to-white">
                    <div class="mb-24">
                      <h6 class="mb-24 fw-bold">Write a Review</h6>
                      <span class="text-heading mb-8 d-block fw-medium">What is it like to Product?</span>
                      <div class="flex-align gap-8 mb-24">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          @click="setRating(star)"
                          :class="['text-2xl cursor-pointer transition-transform hover:scale-110', 
                                   star <= rating ? 'text-warning-500' : 'text-gray-300']"
                        >
                          <i class="ph" :class="star <= rating ? 'ph-fill ph-star' : 'ph-star'"></i>
                        </span>
                      </div>
                    </div>
                    <div class="mt-32">
                      <form @submit.prevent="submitReview">
                        <div class="mb-32">
                          <label for="title" class="text-neutral-600 mb-8 d-block fw-medium">Review Title</label>
                          <input 
                            type="text" 
                            v-model="reviewTitle" 
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300" 
                            id="title" 
                            placeholder="Great Products"
                            required
                          >
                        </div>
                        <div class="mb-32">
                          <label for="desc" class="text-neutral-600 mb-8 d-block fw-medium">Review Content</label>
                          <textarea 
                            v-model="reviewContent" 
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300" 
                            id="desc" 
                            rows="5"
                            placeholder="Share your experience with this product..."
                            required
                          ></textarea>
                        </div>
                        <button type="submit" class="btn btn-main rounded-full mt-48 px-32 py-12 fw-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="ms-xxl-5">
                    <h6 class="mb-24 fw-bold">Customer Feedback Summary</h6>
                    <div class="border border-gray-100 rounded-12 p-24 bg-gradient-to-br from-gray-50 to-white">
                      <div class="text-center mb-32">
                        <div class="text-5xl fw-bold text-gray-900 mb-8">{{ calculateAverageRating() }}</div>
                        <div class="flex-align justify-center gap-8 mb-8">
                          <span v-for="star in 5" :key="star" class="text-xl">
                            <i class="ph" :class="star <= Math.round(calculateAverageRating()) ? 'ph-fill ph-star text-warning-600' : 'ph-star text-gray-300'"></i>
                          </span>
                        </div>
                        <p class="text-gray-600">Based on {{ mainProduct.reviews?.length || 0 }} reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Size Guide Modal -->
    <div v-if="showSizeGuide" class="modal-overlay" @click.self="closeSizeGuide">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Size Guide</h5>
          <button @click="closeSizeGuide" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="getSizeChartData().length > 0">
            <div class="mb-24">
              <h6 class="text-sm font-semibold mb-8">How to measure:</h6>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-start gap-2">
                  <i class="ph ph-check-circle text-green-500 mt-0.5"></i>
                  <span>Measure around the fullest part of your chest</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="ph ph-check-circle text-green-500 mt-0.5"></i>
                  <span>Measure around your natural waistline</span> 
                </li>
                <li class="flex items-start gap-2">
                  <i class="ph ph-check-circle text-green-500 mt-0.5"></i>
                  <span>Measure from shoulder to hem</span>
                </li>
              </ul>
            </div>
            
            <div class="overflow-x-auto">
              <table class="size-guide-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                    <th>Fit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in getSizeChartData()" :key="index">
                    <td class="font-semibold">{{ item.size }}</td>
                    <td>{{ item.chest }}</td>
                    <td>{{ item.waist }}</td>
                    <td>{{ item.length }}</td>
                    <td>
                      <span class="badge" :class="getFitClass(item.size)">
                        {{ getFitText(item.size) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="ph ph-ruler text-3xl mb-4"></i>
            <p>No size guide available for this product</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from '#app'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/thumbs'

// Get route
const route = useRoute()


const styleGroupId = computed(() => {
  const slug = route.path.split('/').pop()
  return slug.split('--')[1] || null
})
// State 
const thumbsSwiper = ref(null)
const mainSwiper = ref(null)
const quantity = ref(1)
const isInWishlist = ref(false)
const rating = ref(0)
const reviewTitle = ref('')
const reviewContent = ref('')
const activeTab = ref('description')
const activeThumb = ref(0)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const showSizeGuide = ref(false)

// Cart state
const cartItems = ref([])
const cartItemCount = ref(0)
const cartSubtotal = ref(0)
const cartTotalPrice = ref(0)

// Product Data
const mainProduct = ref(null)
const variants = ref([])
const loading = ref(false)
const error = ref(null)

// Selection States
const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedVariant = ref(null)

// Images
const mainImages = ref([])
const thumbnailImages = ref([])

// Computed Properties
const availableColors = computed(() => {
  const colors = new Set()
  variants.value.forEach(variant => {
    if (variant.color) colors.add(variant.color)
  })
  return Array.from(colors)
})

const availableSizes = computed(() => {
  const sizes = new Set()
  variants.value.forEach(variant => {
    if (variant.size) sizes.add(variant.size)
  })
  return Array.from(sizes)
})

// Cart Functions - UPDATED FOR LIVE UPDATES
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (cartData) {
      const cart = JSON.parse(cartData)
      cartItems.value = cart
      updateCartSummary()
    } else {
      cartItems.value = []
      updateCartSummary()
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error)
    cartItems.value = []
    updateCartSummary()
  }
}

const updateCartSummary = () => {
  // Calculate cart summary
  cartItemCount.value = cartItems.value.reduce((total, item) => total + item.quantity, 0)
  cartSubtotal.value = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  cartTotalPrice.value = cartSubtotal.value // For now, shipping is free
}

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('shopping_cart', JSON.stringify(cart))
    loadCartFromStorage() // Update cart summary
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

const addToCart = () => {
  const product = selectedVariant.value || mainProduct.value
  if (!product || product.stock <= 0 || quantity.value <= 0) {
    alert('Cannot add to cart. Check quantity and stock availability.')
    return
  }
  
  try {
    // Get existing cart or initialize
    const existingCart = localStorage.getItem('shopping_cart')
    let cart = existingCart ? JSON.parse(existingCart) : []
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => 
      item.productId === product.id && 
      item.variantId === (selectedVariant.value?.id || null)
    )
    
    const discountedPrice = parseFloat(calculateDiscountedPrice())
    
    if (existingIndex > -1) {
      // Update existing item quantity
      cart[existingIndex].quantity += quantity.value
      cart[existingIndex].totalPrice = cart[existingIndex].price * cart[existingIndex].quantity
    } else {
      // Add new item
      const cartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: product.id,
        variantId: selectedVariant.value?.id || null,
        name: mainProduct.value.name,
        color: selectedVariant.value?.color || null,
        size: selectedVariant.value?.size || null,
        sku: product.sku,
        price: discountedPrice,
        quantity: quantity.value,
        totalPrice: discountedPrice * quantity.value,
        image: getImageUrl(product),
        stock: product.stock,
        maxStock: product.stock
      }
      cart.push(cartItem)
    }
    
    // Save to localStorage
    saveCartToStorage(cart)
    
    // Show success message
    successMessage.value =  `${quantity.value} × ${mainProduct.value.name} added to cart!`
    showSuccessMessage.value = true
    
    // Hide message after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
    console.log('Added to cart:', {
      product: mainProduct.value.name,
      variant: selectedVariant.value,
      quantity: quantity.value,
      price: discountedPrice
    })
    
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Error adding item to cart. Please try again.')
  }
}

// Update cart item quantity
const updateCartItemQuantity = (itemId, change) => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (!cartData) return
    
    let cart = JSON.parse(cartData)
    const itemIndex = cart.findIndex(item => item.id === itemId)
    
    if (itemIndex > -1) {
      const newQuantity = cart[itemIndex].quantity + change
      
      // Ensure quantity is at least 1
      if (newQuantity < 1) {
        // If quantity becomes 0, remove item
        cart.splice(itemIndex, 1)
      } else {
        // Update quantity and total price
        cart[itemIndex].quantity = newQuantity
        cart[itemIndex].totalPrice = cart[itemIndex].price * newQuantity
      }
      
      // Save updated cart
      saveCartToStorage(cart)
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error)
  }
}

// Remove item from cart
const removeFromCart = (itemId) => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (!cartData) return
    
    let cart = JSON.parse(cartData)
    cart = cart.filter(item => item.id !== itemId)
    
    // Save updated cart
    saveCartToStorage(cart)
  } catch (error) {
    console.error('Error removing item from cart:', error)
  }
}

// Refresh cart summary manually
const refreshCartSummary = () => {
  loadCartFromStorage()
  
}

// Size Guide Functions
const openSizeGuide = () => {
  showSizeGuide.value = true
}

const closeSizeGuide = () => {
  showSizeGuide.value = false
}

const getSizeChartData = () => {
  // Create size chart from variants or use default data
  if (variants.value.length > 0) {
    return variants.value.map(variant => {
      // Try to get measurements from attributes
      const attributes = variant.attributes?.[0]?.extraAttributes || {}
      
      return {
        size: variant.size,
        chest: attributes.chestForGarment || attributes.chestForBody || '38-40',
        waist: attributes.waistForGarment || attributes.waistForBody || '32-34',
        length: attributes.length || '26-27',
        fit: 'Regular'
      }
    })
  }
  
  // Default size chart
  return [
    { size: 'M', chest: '38-40', waist: '32-34', length: '26-27', fit: 'Regular' },
    { size: 'L', chest: '40-42', waist: '34-36', length: '27-28', fit: 'Regular' },
    { size: 'XL', chest: '42-44', waist: '36-38', length: '28-29', fit: 'Regular' },
    { size: 'XXL', chest: '44-46', waist: '38-40', length: '29-30', fit: 'Regular' }
  ]
}

const getFitClass = (size) => {
  const fitMap = {
    'XS': 'bg-blue-100 text-blue-800',
    'S': 'bg-blue-100 text-blue-800',
    'M': 'bg-green-100 text-green-800',
    'L': 'bg-yellow-100 text-yellow-800',
    'XL': 'bg-orange-100 text-orange-800',
    'XXL': 'bg-red-100 text-red-800',
    'XXXL': 'bg-purple-100 text-purple-800'
  }
  return fitMap[size] || 'bg-gray-100 text-gray-800'
}

const getFitText = (size) => {
  const fitMap = {
    'XS': 'Small',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'X-Large',
    'XXL': 'XX-Large',
    'XXXL': 'XXX-Large'
  }
  return fitMap[size] || 'Regular'
}

// Watch for route changes
watch(() => route.params.styleGroupId, () => {
  if (styleGroupId.value) {
    fetchProductStyleGroup(styleGroupId.value)
  }
})

// Fetch product style group
const fetchProductStyleGroup = async (id) => {
  if (!id) {
    error.value = 'Invalid style group ID'
    return
  }

  loading.value = true
  error.value = null
  mainProduct.value = null
  variants.value = []
  selectedVariant.value = null
  selectedColor.value = null
  selectedSize.value = null

  try {
    console.log('Fetching product style group with ID:', id)
    
    const response = await fetch(`https://kartmania-api.vibrantick.org/common/product/read/group/style/${styleGroupId.value}`)
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result)
    
    if (result.message === 'Product style group fetched successfully' && result.data) {
      mainProduct.value = result.data.mainProduct
      variants.value = result.data.variants || []
      
      // Set default selection to first variant
      if (variants.value.length > 0) {
        selectedVariant.value = variants.value[0]
        selectedColor.value = variants.value[0].color
        selectedSize.value = variants.value[0].size
        updateImagesFromVariant(variants.value[0])
      } else if (mainProduct.value) {
        // If no variants, use main product
        selectedVariant.value = mainProduct.value
        updateImagesFromAPI(mainProduct.value)
      }
      
      console.log('Product style group loaded:', {
        mainProduct: mainProduct.value,
        variants: variants.value,
        selectedVariant: selectedVariant.value
      })
    } else {
      error.value = 'Product style group not found'
    }
    
  } catch (err) {
    console.error('Error fetching product style group:', err)
    error.value = `Failed to load product: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Update images from variant
const updateImagesFromVariant = (variant) => {
  if (variant.images && variant.images.length > 0) {
    console.log('Variant images found:', variant.images)
    
    // Extract image URLs
    const imageUrls = variant.images.map(img => img.imageUrl)
    
    // Set both main and thumbnail images
    mainImages.value = imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/800x800?text=No+Image+Available']
    thumbnailImages.value = imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/800x800?text=No+Image+Available']
    
    console.log('Main images set:', mainImages.value)
    console.log('Thumbnail images set:', thumbnailImages.value)
  } else {
    console.log('No images found in variant, using fallback')
    const fallbackImage = 'https://via.placeholder.com/800x800?text=No+Image+Available'
    mainImages.value = [fallbackImage]
    thumbnailImages.value = [fallbackImage]
  }
}

// Update images from main product
const updateImagesFromAPI = (productData) => {
  if (productData.images && productData.images.length > 0) {
    console.log('Product images found:', productData.images)
    
    // Extract image URLs
    const imageUrls = productData.images.map(img => img.imageUrl)
    
    // Set both main and thumbnail images
    mainImages.value = imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/800x800?text=No+Image+Available']
    thumbnailImages.value = imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/800x800?text=No+Image+Available']
    
    console.log('Main images set:', mainImages.value)
    console.log('Thumbnail images set:', thumbnailImages.value)
  } else {
    console.log('No images found, using fallback')
    const fallbackImage = 'https://via.placeholder.com/800x800?text=No+Image+Available'
    mainImages.value = [fallbackImage]
    thumbnailImages.value = [fallbackImage]
  }
}

// Selection Methods
const selectColor = (color) => {
  selectedColor.value = color
  findMatchingVariant()
}

const selectSize = (size) => {
  selectedSize.value = size
  findMatchingVariant()
}

const selectVariant = (variant) => {
  selectedVariant.value = variant
  selectedColor.value = variant.color
  selectedSize.value = variant.size
  updateImagesFromVariant(variant)
}

const findMatchingVariant = () => {
  if (!selectedColor.value && !selectedSize.value) return
  
  const matchingVariant = variants.value.find(variant => 
    variant.color === selectedColor.value && 
    variant.size === selectedSize.value
  )
  
  if (matchingVariant) {
    selectedVariant.value = matchingVariant
    updateImagesFromVariant(matchingVariant)
  }
}

// WhatsApp order function
const orderOnWhatsapp = () => {
  const phone = "8219773546"
  const imageUrl = getImageUrl(selectedVariant.value || mainProduct.value)

  const message = `
 *New Order Request* 
--------------------------------
 *Product:* ${mainProduct.value.name}
 *Variant:* ${selectedVariant.value?.color || ''} ${selectedVariant.value?.size || ''}
 *Price:* ₹${calculateDiscountedPrice()}
 *SKU:* ${selectedVariant.value?.sku || mainProduct.value.sku}
 *Image:* ${imageUrl}

Please confirm the availability.
  `

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

// Encode ID function
function encodeId(id) {
  return btoa(id.toString())
}

// Get image URL
const getImageUrl = (product) => {
  if (!product || !product.images || product.images.length === 0) return ""

  const img = product.images[0]
  if (!img) return ""
  
  return img.imageUrl || ""
}

// Color mapping function
const getColorCode = (colorName) => {
  const colorMap = {
    'blue': '#3b82f6',
    'red': '#ef4444',
    'green': '#10b981',
    'yellow': '#f59e0b',
    'purple': '#8b5cf6',
    'pink': '#ec4899',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#6b7280',
    'orange': '#f97316',
    'brown': '#92400e',
    'navy': '#1e3a8a',
    'maroon': '#991b1b',
    'teal': '#0d9488',
    'cyan': '#06b6d4'
  }
  
  if (!colorName) return '#6b7280'
  const normalizedColor = colorName.toLowerCase().trim()
  return colorMap[normalizedColor] || '#6b7280'
}

// Helper Methods
const calculateDiscountedPrice = () => {
  const product = selectedVariant.value || mainProduct.value
  if (!product) return '0'
  
  const price = parseFloat(product.price) || 0
  const discount = parseFloat(mainProduct.value?.discountValue) || 0
  
  if (discount > 0 && mainProduct.value?.discount === 'PERCENTAGE') {
    const discountedPrice = price - (price * discount / 100)
    return discountedPrice.toFixed(2)
  }
  
  return price.toFixed(2)
}

const calculateAverageRating = () => {
  if (!mainProduct.value || !mainProduct.value.reviews || mainProduct.value.reviews.length === 0) {
    return 0
  }
  
  const totalRating = mainProduct.value.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
  return (totalRating / mainProduct.value.reviews.length).toFixed(1)
}

const calculateStockPercentage = () => {
  const product = selectedVariant.value || mainProduct.value
  if (!product) return 0
  
  const maxStock = 100
  const currentStock = product.stock || 0
  
  return Math.min((currentStock / maxStock) * 100, 100)
}

const getStockStatus = () => {
  const product = selectedVariant.value || mainProduct.value
  if (!product) return 'Stock information not available'
  
  const stock = product.stock || 0
  
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 5) return 'Low Stock - Hurry!'
  if (stock <= 20) return 'Limited Stock Available'
  return 'In Stock'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    console.error('Date formatting error:', e)
    return 'Invalid date'
  }
}

// Swiper Methods
const setThumbsSwiper = (swiper) => {
  console.log('Thumbs swiper set:', swiper)
  thumbsSwiper.value = swiper
}

const setMainSwiper = (swiper) => {
  console.log('Main swiper set:', swiper)
  mainSwiper.value = swiper
}

const goToSlide = (index) => {
  console.log('Going to slide:', index)
  activeThumb.value = index
  if (mainSwiper.value) {
    mainSwiper.value.slideTo(index)
  }
}

const onSlideChange = (swiper) => {
  activeThumb.value = swiper.activeIndex
}

// Quantity Methods 
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => { 

  const product = selectedVariant.value || mainProduct.value

  if (product && quantity.value < product.stock) {

    quantity.value++
  }
}

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1
  }
  const product = selectedVariant.value || mainProduct.value
  if (product && quantity.value > product.stock) {
    quantity.value = product.stock
  }
}

// Action Methods
const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Wishlist status:', isInWishlist.value)
  alert(isInWishlist.value ? 'Added to wishlist!' : 'Removed from wishlist!')
}

const compareProduct = () => {
  console.log('Compare product clicked')
  alert('Product added to compare list!')
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: mainProduct.value?.name || "Product",
      text: `Check out ${mainProduct.value?.name} for ₹${calculateDiscountedPrice()}`,
      url: window.location.href
    }).then(() => {
      console.log('Product shared successfully')
    }).catch(err => {
      console.error('Error sharing:', err)
    })
  } else {
    console.log('Web Share API not supported')
    alert('Share feature not supported on this browser')
  }
}

const setRating = (stars) => {
  rating.value = stars
  console.log('Rating set to:', stars)
}

const submitReview = () => {
  if (!reviewTitle.value.trim() || !reviewContent.value.trim()) {
    alert('Please fill in both title and content for review.')
    return
  }
  
  console.log('Review submitted:', {
    productName: mainProduct.value?.name,
    rating: rating.value,
    title: reviewTitle.value,
    content: reviewContent.value
  })
  
  alert('Review submitted successfully! Thank you for your feedback.')
  
  rating.value = 0
  reviewTitle.value = ''
  reviewContent.value = ''
}

// Lifecycle
onMounted(() => {
  console.log('Product Details page mounted')
  console.log('Style Group ID from URL:', styleGroupId.value)
  
  // Load cart data
  loadCartFromStorage()
  
  if (styleGroupId.value) {
    fetchProductStyleGroup(styleGroupId.value)
  } else {
    error.value = 'No style group ID found in URL'
    loading.value = false
  }
})

// Watch for storage changes (for cross-tab updates)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'shopping_cart') {
      loadCartFromStorage()
    }
  })
}
</script>

<style scoped>
/* Size Guide Modal Styles */
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  border-radius: 16px 16px 0 0;
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

/* Size Guide Table */
.size-guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.size-guide-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.size-guide-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
}

.size-guide-table tr:hover {
  background: #f9fafb;
}

.size-guide-table tr:last-child td {
  border-bottom: none;
}

/* Cart Item Styles */
.cart-item {
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.btn-outline-main {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-outline-main:hover {
  background: #3b82f6;
  color: white;
}

/* Success Alert */
.alert-success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 1px solid #10b981;
  color: #065f46;
  border-radius: 12px;
  padding: 16px;
}

.alert-dismissible .btn-close {
  padding: 0.75rem 1rem;
  filter: brightness(0) saturate(100%) invert(27%) sepia(64%) saturate(439%) hue-rotate(120deg) brightness(92%) contrast(87%);
}

/* Scrollbar Styling */
.max-h-60 {
  max-height: 240px;
}

.max-h-60::-webkit-scrollbar {
  width: 4px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Add these new styles */

/* Color Option */
.color-option {
  transition: all 0.3s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

/* Size Option */
.size-option {
  transition: all 0.3s ease;
}

.size-option:hover:not(.selected) {
  border-color: #9ca3af;
  transform: translateY(-2px);
}

/* Variant Item */
.variant-item {
  transition: all 0.3s ease;
}

.variant-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .color-option {
    width: 32px;
    height: 32px;
  }
  
  .size-option {
    min-width: 50px;
    padding: 8px 12px;
  }
  
  .modal-content {
    max-width: 95%;
  }
  
  .size-guide-table {
    font-size: 12px;
  }
  
  .size-guide-table th,
  .size-guide-table td {
    padding: 8px 12px;
  }
}

/* Keep all existing styles from your original code */
.main-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 500px;
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
}

.main-product-image:hover {
  transform: scale(1.02);
}

/* Modern Thumbnail Styles */
.thumbnail-container {
  padding: 8px 4px;
}

.thumbnail-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-item.active-thumbnail {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.thumbnail-image-wrapper {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

/* Button Styles */
.btn-main {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
}

.btn-main:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}
   
/* Progress Bar */
.progress-bar {
  background: linear-gradient(90deg, #e66f1b 0%, #500596 100%);
}

/* Loading Spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 3px;
}
/* Grid utilities */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-24 {
  gap: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-image-container {
    height: 300px;
    min-height: 300px;
  }
  
  .thumbnail-image-wrapper {
    height: 60px;
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Thumbnail slider fixes */
.thumbnail-swiper,
.thumbnail-swiper .swiper,
.thumbnail-swiper .swiper-wrapper,
.thumbnail-swiper .swiper-slide {
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.thumbnail-swiper .swiper-slide {
  width: 72px !important;
  height: 72px !important;
}

.thumbnail-image-wrapper {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  height: 100%;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.active-thumbnail {
  border: 2px solid #2563eb;
  border-radius: 8px;
}

.main-image-slide {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>