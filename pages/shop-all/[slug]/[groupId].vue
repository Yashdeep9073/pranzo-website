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
        <div class="text-center">
          <h5 class="mb-3">Product Style Not Found</h5>
          <p class="mb-3">
            <span v-if="error && typeof error === 'object' && 'status' in error && (error as any).status === 404">
              The product style "{{ styleGroupId }}" is not available or has been discontinued.
            </span>
            <span v-else>
              Unable to load product details. Please try again later.
            </span>
          </p>
          <div class="d-flex gap-3 justify-content-center">
            <NuxtLink to="/shop-all" class="btn btn-primary">
              Browse All Products
            </NuxtLink>
            <button @click="refresh" class="btn btn-outline-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="mainProduct" class="row gy-4">
        <div class="col-12">
          <div class="row gy-4">
            <!-- Product Images Section -->
            <div class="col-xl-6">
              <div class="product-details__left">
                <!-- Desktop: 2x2 Grid Layout -->
                <div class="product-gallery-grid d-none d-xl-grid">
                  <div class="grid-container">
                    <div v-for="(image, index) in mainImages.slice(0, 4)" :key="index" class="grid-image-container"
                      @click="openImageModal(Number(index))">
                      <img :src="safeLoadImage(image)" :alt="`Product image ${Number(index) + 1}`"
                        class="grid-product-image" loading="lazy" decoding="async" @error="handleImageError" />
                    </div>
                  </div>
                </div>

                <!-- Mobile/Tablet: Single image with horizontal scroll -->
                <div class="d-xl-none">
                  <!-- Main Image with Dots -->
                  <div class="mobile-main-slider">
                    <Swiper :modules="[Pagination]" :spaceBetween="0" :slidesPerView="1" :pagination="{
                      clickable: true,
                      el: '.mobile-pagination',
                      bulletClass: 'mobile-dot',
                      bulletActiveClass: 'mobile-dot-active'
                    } as any" @swiper="setMobileMainSwiper" @slideChange="onMobileSlideChange"
                      class="mobile-main-swiper">
                      <SwiperSlide v-for="(image, index) in mainImages" :key="index">
                        <div class="mobile-main-image-container">
                          <img :src="safeLoadImage(image)" :alt="`Product image ${Number(index) + 1}`"
                            class="mobile-main-product-image" :loading="index === 0 ? 'eager' : 'lazy'" decoding="async"
                            :preload="index === 0" @error="handleImageError" />
                        </div>
                      </SwiperSlide>
                    </Swiper>
                    <!-- Pagination Dots -->
                    <div class="mobile-pagination text-center mt-3"></div>
                  </div>

                  <!-- Horizontal Thumbnails Slider for Mobile -->
                  <div class="mobile-thumbnails-slider mt-4">
                    <Swiper :spaceBetween="10" :slidesPerView="4" :watchSlidesProgress="true"
                      class="mobile-thumbnail-swiper" @swiper="setMobileThumbsSwiper">
                      <SwiperSlide v-for="(thumb, index) in thumbnailImages" :key="index"
                        @click="goToMobileSlide(Number(index))">
                        <div :class="[
                          'mobile-thumbnail-item',
                          mobileActiveThumb === index ? 'mobile-active-thumbnail' : ''
                        ]">
                          <div class="mobile-thumbnail-image-wrapper">
                            <img :src="safeLoadImage(thumb)" :alt="`Thumbnail ${Number(index) + 1}`"
                              class="mobile-thumbnail-image" loading="lazy" decoding="async"
                              @error="handleImageError" />
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
                <h5>{{ mainProduct.name }}</h5>

                <!-- Enhanced Rating Section -->
                <div class="rating-section">
                  <div class="rating-stars">
                    <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                  </div>
                  <span class="rating-text">4.7 Star Rating</span>
                  <span class="text-sm fw-medium text-gray-500">({{ mainProduct.reviews?.length || 0 }})</span>
                </div>

                <!-- Enhanced SKU Info -->
                <div class="sku-info">
                  <span class="text-gray-400">SKU:</span> {{ selectedVariant?.sku || mainProduct.sku }}
                </div>
                <!-- Enhanced Product Description -->
                <div class="product-description">
                  {{ mainProduct.description }}
                </div>

                <!-- Enhanced Color Selection -->
                <div v-if="availableColorsWithImages.length > 0" class="color-selection">
                  <div class="color-selection-title">
                    <span>Color:</span>
                  </div>
                  <div class="flex-align flex-wrap gap-16">
                    <div v-for="color in availableColorsWithImages" :key="color.name" @click="selectColor(color.name)"
                      @mouseenter="preloadColorImages(color.name)" :class="['flex flex-col items-center cursor-pointer',
                        isChangingColor ? 'pointer-events-none opacity-50' : '']">
                      <div :class="[
                        'color-option w-48 h-48 rounded-lg border-2 transition-all duration-300 overflow-hidden relative',
                        selectedColor === color.name
                          ? 'border-main-600 scale-110 shadow-lg ring-2 ring-main-600 ring-offset-2'
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      ]" :title="color.name">
                        <img :src="safeLoadImage(color.imageUrl)" :alt="color.name" class="w-full h-full object-cover"
                          loading="lazy" decoding="async" @error="handleImageError" />
                        <div v-if="selectedColor === color.name"
                          class="absolute top-2 right-2 bg-main-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          <i class="ph-fill ph-check text-xs"></i>
                        </div>
                        <div v-if="isChangingColor && selectedColor === color.name"
                          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                          <div class="w-6 h-6 border-2 border-main-600 border-t-transparent rounded-full animate-spin">
                          </div>
                        </div>
                      </div>
                      <span class="text-xs text-gray-700 mt-2 font-medium">{{ color.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Category-Specific Size Selection -->
                <div v-if="availableSizes.length > 0" class="mt-24">
                  <div class="flex-between mb-8">
                    <span class="text-gray-900 d-block fw-semibold">Size:</span>
                    <button @click="openSizeGuide"
                      class="text-sm text-main-600 hover:text-main-800 transition-colors flex items-center gap-1">
                      Size Guide <i class="ph ph-info text-xs"></i>
                    </button>
                  </div>

                  <!-- Clothing Sizes (S, M, L, XL, XXL) -->
                  <div v-if="isClothingCategory" class="flex-align flex-wrap gap-12">
                    <div v-for="size in getClothingSizes()" :key="size" @click="selectSize(size)" :class="[
                      'size-option px-20 py-12 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 text-center min-w-60',
                      selectedSize === size
                        ? 'bg-main-600 text-white border-main-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    ]">
                      <span class="text-sm fw-medium">{{ size }}</span>
                    </div>
                  </div>

                  <!-- Shoe Sizes (5, 6, 7, 8, 9, 10, 11, 12) -->
                  <div v-else-if="isShoesCategory" class="flex-align flex-wrap gap-12">
                    <div v-for="size in getShoeSizes()" :key="size" @click="selectSize(size)" :class="[
                      'size-option px-20 py-12 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 text-center min-w-60',
                      selectedSize === size
                        ? 'bg-main-600 text-white border-main-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    ]">
                      <span class="text-sm fw-medium">{{ size }}</span>
                    </div>
                  </div>

                  <!-- Electronics (Generic sizes or technical specs) -->
                  <div v-else-if="isElectronicsCategory" class="space-y-16">
                    <div class="flex-align flex-wrap gap-12">
                      <div v-for="size in getElectronicsSizes()" :key="size" @click="selectSize(size)" :class="[
                        'size-option px-20 py-12 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 text-center min-w-80',
                        selectedSize === size
                          ? 'bg-main-600 text-white border-main-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      ]">
                        <span class="text-sm fw-medium">{{ size }}</span>
                      </div>
                    </div>
                    <!-- Additional technical specs for electronics -->
                    <div class="mt-16 p-16 bg-gray-50 rounded-lg">
                      <h6 class="text-sm font-semibold mb-8">Technical Specifications:</h6>
                      <div class="grid grid-cols-2 gap-12 text-sm">
                        <div v-if="selectedVariant?.attributes?.[0]?.extraAttributes?.storage"
                          class="flex justify-between">
                          <span class="text-gray-600">Storage:</span>
                          <span class="font-medium">{{ selectedVariant.attributes[0].extraAttributes.storage }}</span>
                        </div>
                        <div v-if="selectedVariant?.attributes?.[0]?.extraAttributes?.ram" class="flex justify-between">
                          <span class="text-gray-600">RAM:</span>
                          <span class="font-medium">{{ selectedVariant.attributes[0].extraAttributes.ram }}</span>
                        </div>
                        <div v-if="selectedVariant?.attributes?.[0]?.extraAttributes?.screenSize"
                          class="flex justify-between">
                          <span class="text-gray-600">Screen:</span>
                          <span class="font-medium">{{ selectedVariant.attributes[0].extraAttributes.screenSize
                          }}</span>
                        </div>
                        <div v-if="selectedVariant?.attributes?.[0]?.extraAttributes?.color"
                          class="flex justify-between">
                          <span class="text-gray-600">Color:</span>
                          <span class="font-medium">{{ selectedVariant.attributes[0].extraAttributes.color }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Default/Fallback for other categories -->
                  <div v-else class="flex-align flex-wrap gap-12">
                    <div v-for="size in availableSizes" :key="size" @click="selectSize(size)" :class="[
                      'size-option px-20 py-12 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 text-center min-w-60',
                      selectedSize === size
                        ? 'bg-main-600 text-white border-main-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    ]">
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
                        <span class="badge bg-main-600 text-white border border-main-600">
                          {{ selectedVariant.color?.name || selectedVariant.color }}
                        </span>
                        <span class="badge bg-gray-800 text-white border border-gray-800">
                          {{ selectedVariant.size?.name || selectedVariant.size }}
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
                    <h4 class="mb-0">₹{{ discountedPrice }}</h4>
                    <span v-if="mainProduct.discountValue > 0"
                      class="text-md text-gray-500 text-decoration-line-through">
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
                <div v-if="mainProduct.discountValue > 0"
                  class="flex-align flex-wrap gap-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-12 py-16 px-24 border border-red-100">
                  <div class="flex-align gap-16">
                    <span class="text-main-600 text-sm fw-semibold"> Special Offer:</span>
                  </div>
                  <div class="countdown" id="countdown11">
                    <ul class="countdown-list flex-align flex-wrap gap-2">
                      <li
                        class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="days text-main-600">05</span>
                      </li>
                      <li
                        class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="hours text-main-600">12</span>
                      </li>
                      <li
                        class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="minutes text-main-600">30</span>
                      </li>
                      <li
                        class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="seconds text-main-600">45</span>
                      </li>
                    </ul>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium">Remains until the end of the offer</span>
                </div>

                <!-- Stock Progress -->
                <div class="mb-24">
                  <div class="mt-32 flex-align gap-12 mb-16">
                    <span
                      class="w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 flex-center rounded-circle text-green-600 box-shadow-lg">
                      <i class="ph-fill ph-lightning text-lg"></i>
                    </span>
                    <h6 class="text-md mb-0 fw-bold text-gray-900">
                      {{ getStockStatus() }}
                    </h6>
                  </div>
                  <div class="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                    :aria-valuenow="stockPercentage" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar bg-gradient-to-r from-green-500 to-emerald-500 rounded-pill"
                      :style="{ width: stockPercentage + '%' }"></div>
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
                      <button type="button" @click="decreaseQuantity"
                        class="quantity__minus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                        :disabled="quantity <= 1"
                        :class="quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'">
                        <i class="ph ph-minus text-lg"></i>
                      </button>
                      <input type="number" v-model.number="quantity"
                        class="quantity__input border-0 text-center w-48 fw-bold text-gray-900"
                        :max="selectedVariant?.stock || mainProduct.stock" min="0"
                        @input="(e) => quantity = validateQuantity(Number((e.target as HTMLInputElement).value))" />
                      <button type="button" @click="increaseQuantity"
                        class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                        :disabled="quantity >= (selectedVariant?.stock || mainProduct.stock)"
                        :class="quantity >= (selectedVariant?.stock || mainProduct.stock) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'">
                        <i class="ph ph-plus text-lg"></i>
                      </button>
                    </div>
                    <button @click="addToCart" :class="[
                      'btn rounded-full flex-align d-inline-flex gap-8 px-48 py-12 fw-semibold shadow-sm transition-all duration-300',
                      (selectedVariant?.stock || mainProduct.stock) <= 0 ? 'btn-secondary' : 'btn-main hover:shadow-lg hover:-translate-y-0.5'
                    ]" :disabled="(selectedVariant?.stock || mainProduct.stock) <= 0 || quantity <= 0">
                      <i class="ph ph-shopping-cart text-lg"></i>
                      {{ (selectedVariant?.stock || mainProduct.stock) <= 0 ? 'Out of Stock' : 'Add To Cart' }}
                        </button>
                  </div>

                  <!-- Category-Specific Features -->
                  <div class="mt-24">
                    <!-- Clothing Features -->
                    <div v-if="isClothingCategory()" class="space-y-16">
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-fabric text-main-600 text-lg"></i>
                        <span class="text-gray-700">Premium fabric quality</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-washing-machine text-main-600 text-lg"></i>
                        <span class="text-gray-700">Machine washable</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-rainbow-cloud text-main-600 text-lg"></i>
                        <span class="text-gray-700">Color fast technology</span>
                      </div>
                    </div>

                    <!-- Shoes Features -->
                    <div v-else-if="isShoesCategory()" class="space-y-16">
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-footprints text-main-600 text-lg"></i>
                        <span class="text-gray-700">Ergonomic design</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-drop text-main-600 text-lg"></i>
                        <span class="text-gray-700">Water resistant</span>
                        <i class="ph ph-breadcrumb text-main-600 text-lg"></i>
                        <span class="text-gray-700">Non-slip sole</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-wind text-main-600 text-lg"></i>
                        <span class="text-gray-700">Breathable material</span>
                      </div>
                    </div>

                    <!-- Electronics Features -->
                    <div v-else-if="isElectronicsCategory()" class="space-y-16">
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-shield-check text-main-600 text-lg"></i>
                        <span class="text-gray-700">1 Year Warranty</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-certificate text-main-600 text-lg"></i>
                        <span class="text-gray-700">Genuine Product</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-headset text-main-600 text-lg"></i>
                        <span class="text-gray-700">24/7 Customer Support</span>
                      </div>
                    </div>

                    <!-- Default Features for other categories -->
                    <div v-else class="space-y-16">
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-check-circle text-main-600 text-lg"></i>
                        <span class="text-gray-700">Quality assured</span>
                      </div>
                      <div class="flex items-center gap-12 text-sm">
                        <i class="ph ph-truck text-main-600 text-lg"></i>
                        <span class="text-gray-700">Fast delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex-align gap-12">
                  <button @click="toggleWishlist(mainProduct)"
                    :class="['w-52 h-52 flex-center rounded-circle text-xl transition-all duration-300',
                      isInWishlist(mainProduct?.id) ? 'bg-gradient-to-br from-red-500 to-pink-500 text-yellow-300 shadow-lg' :
                        'bg-gradient-to-br from-gray-50 to-white text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:text-red-500 border border-gray-100 shadow-sm']">
                    <i class="ph" :class="isInWishlist(mainProduct?.id) ? 'ph-heart-fill' : 'ph-heart'"></i>
                  </button>
                  <button @click="compareProduct"
                    class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300">
                    <i class="ph ph-shuffle"></i>
                  </button>
                  <button @click="shareProduct"
                    class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300">
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
                  <span v-if="mainProduct.subCategory" class="badge bg-black text-white border border-black">
                    {{ mainProduct.subCategory.name }}
                  </span>
                  <!-- Sub-Sub Category -->
                  <span v-if="mainProduct.subSubCategory" class="badge bg-black text-white border border-black">
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

      <!-- Product Tabs Section -->
      <div v-if="!loading && !error && mainProduct" class="pt-24 product-tabs-wrap">
        <div class="product-dContent border border-gray-100 rounded-24 shadow-sm">
          <div class="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16 p-24">
            <ul class="nav common-tab nav-pills mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button :class="['nav-link fw-semibold', activeTab === 'description' ? 'active' : '']"
                  @click="activeTab = 'description'" type="button">
                  Description
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button :class="['nav-link fw-semibold', activeTab === 'attributes' ? 'active' : '']"
                  @click="activeTab = 'attributes'" type="button">
                  Attributes
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button :class="['nav-link fw-semibold', activeTab === 'reviews' ? 'active' : '']"
                  @click="activeTab = 'reviews'" type="button">
                  Reviews ({{ mainProduct.reviews?.length || 0 }})
                </button>
              </li>
            </ul>
            <div class="satisfaction-badge">
              <img :src="safeLoadImage('/assets/images/logo/pfevicon.png')" alt="Satisfaction Guaranteed"
                class="w-24 h-24" loading="lazy" decoding="async" @error="handleImageError" />
              100% Satisfaction Guaranteed
            </div>
          </div>

          <div class="product-dContent__box p-24">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="tab-content">
              <div class="mb-40">
                <h6 class="section-title">Product Description</h6>
                <div class="description-text">
                  {{ mainProduct.description }}
                </div>

                <div v-if="mainProduct.category" class="mt-32">
                  <h6 class="section-title">Product Categories</h6>
                  <div class="category-badges">
                    <span class="category-badge">
                      {{ mainProduct.category.name }}
                    </span>
                    <span v-if="mainProduct.subCategory" class="category-badge">
                      {{ mainProduct.subCategory.name }}
                    </span>
                    <span v-if="mainProduct.subSubCategory" class="category-badge">
                      {{ mainProduct.subSubCategory.name }}
                    </span>
                  </div>
                </div>

                <!-- Product Information -->
                <div class="mt-40">
                  <h6 class="section-title">Product Information</h6>
                  <div class="info-list">
                    <div class="info-item">
                      <div class="info-icon sku">
                        <i class="ph ph-package"></i>
                      </div>
                      <div class="info-content">
                        <div class="info-label">SKU</div>
                        <div class="info-value">{{ selectedVariant?.sku || mainProduct.sku }}</div>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon barcode">
                        <i class="ph ph-barcode"></i>
                      </div>
                      <div class="info-content">
                        <div class="info-label">Barcode</div>
                        <div class="info-value">{{ mainProduct.barcode || 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon unit">
                        <i class="ph ph-cube"></i>
                      </div>
                      <div class="info-content">
                        <div class="info-label">Unit</div>
                        <div class="info-value">{{ mainProduct.unit?.name }} ({{ mainProduct.unit?.shortName }})</div>
                      </div>
                    </div>
                    <div v-if="mainProduct.manufacturedDate && formatDate(mainProduct.manufacturedDate) !== 'N/A'"
                      class="info-item">
                      <div class="info-icon manufactured">
                        <i class="ph ph-calendar"></i>
                      </div>
                    </div>
                    <div v-if="mainProduct.origin" class="info-item">
                      <div class="info-icon origin">
                        <i class="ph ph-map-pin"></i>
                      </div>
                      <div class="info-content">
                        <div class="info-label">Origin</div>
                        <div class="info-value">{{ mainProduct.origin }}</div>
                      </div>
                    </div>
                  </div>
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
                <div class="attributes-panel">
                  <div class="attributes-panel__header">
                    <h6 class="attributes-panel__title">Product Attributes</h6>
                    <p class="attributes-panel__subtitle">Variant specifications and pricing details</p>
                  </div>

                  <!-- Selected Variant Info -->
                  <div v-if="selectedVariant" class="attributes-card mb-32">
                    <div class="attributes-card__top">
                      <div class="attributes-card__variant">
                        <div class="attributes-card__image-wrap">
                          <img
                            :src="safeLoadImage(getColorFirstImage(selectedVariant.color?.name || selectedVariant.color))"
                            :alt="selectedVariant.color?.name || selectedVariant.color"
                            class="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            @error="handleImageError"
                          />
                        </div>
                        <div>
                          <p class="attributes-card__label">Selected Variant</p>
                          <div class="attributes-chip-list">
                            <span class="attributes-chip">{{ selectedVariant.color?.name || selectedVariant.color }}</span>
                            <span class="attributes-chip attributes-chip--neutral">{{ selectedVariant.size?.name || selectedVariant.size }}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        :class="[
                          'attributes-stock',
                          selectedVariant.stock > 10
                            ? 'attributes-stock--in'
                            : selectedVariant.stock > 0
                              ? 'attributes-stock--low'
                              : 'attributes-stock--out'
                        ]"
                      >
                        {{ selectedVariant.stock > 10 ? 'In stock' : selectedVariant.stock > 0 ? selectedVariant.stock + ' left' : 'Out of stock' }}
                      </span>
                    </div>

                    <div class="attributes-spec-grid">
                      <div class="attributes-spec">
                        <span>SKU</span>
                        <strong>{{ selectedVariant.sku || 'N/A' }}</strong>
                      </div>
                      <div class="attributes-spec">
                        <span>MRP</span>
                        <strong>₹{{ selectedVariant.price }}</strong>
                      </div>
                      <div v-if="mainProduct.discountValue > 0" class="attributes-spec">
                        <span>Discount</span>
                        <strong class="text-green-600">{{ mainProduct.discountValue }}% OFF</strong>
                      </div>
                      <div class="attributes-spec">
                        <span>Offer Price</span>
                        <strong class="text-main-600">₹{{ discountedPrice }}</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback: Main Product Attributes when no variant is selected -->
                  <div v-else class="attributes-card mb-32">
                    <div class="attributes-card__top">
                      <div class="attributes-card__variant">
                        <div class="attributes-card__image-wrap attributes-card__image-wrap--placeholder">
                          <i class="ph ph-package"></i>
                        </div>
                        <div>
                          <p class="attributes-card__label">Product Information</p>
                          <div class="attributes-chip-list">
                            <span class="attributes-chip attributes-chip--neutral">SKU: {{ mainProduct?.sku || 'N/A' }}</span>
                            <span v-if="mainProduct?.barcode" class="attributes-chip attributes-chip--neutral">Barcode: {{ mainProduct.barcode }}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        :class="[
                          'attributes-stock',
                          (mainProduct?.stock || 0) > 10
                            ? 'attributes-stock--in'
                            : (mainProduct?.stock || 0) > 0
                              ? 'attributes-stock--low'
                              : 'attributes-stock--out'
                        ]"
                      >
                        {{ (mainProduct?.stock || 0) > 10 ? 'In stock' : (mainProduct?.stock || 0) > 0 ? (mainProduct?.stock || 0) + ' left' : 'Out of stock' }}
                      </span>
                    </div>

                    <div class="attributes-spec-grid">
                      <div class="attributes-spec">
                        <span>MRP</span>
                        <strong>₹{{ mainProduct?.price || 0 }}</strong>
                      </div>
                      <div v-if="mainProduct?.discountValue > 0" class="attributes-spec">
                        <span>Discount</span>
                        <strong class="text-green-600">{{ mainProduct.discountValue }}% OFF</strong>
                      </div>
                      <div class="attributes-spec">
                        <span>Status</span>
                        <strong class="text-main-600">{{ (mainProduct?.stock || 0) > 0 ? 'Available' : 'Out of stock' }}</strong>
                      </div>
                      <div class="attributes-spec">
                        <span>Total Stock</span>
                        <strong>{{ mainProduct?.stock || 0 }}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- All Variants -->
                <div v-if="variants.length > 0">
                  <h6 class="attributes-list-title">All Variants</h6>
                  <div class="variants-container">
                    <div class="variants-grid attributes-variants-grid scrollable-variants">
                      <div v-for="(variant, index) in variants.slice(0, displayedVariantsCount)" :key="variant.id"
                        class="variant-card attributes-variant-card">
                        <div class="attributes-variant-card__head">
                          <span class="attributes-variant-badge">Variant {{ Number(index) + 1 }}</span>
                          <span :class="[
                            'attributes-variant-stock',
                            variant.stock > 10 ? 'attributes-variant-stock--in' :
                              variant.stock > 0 ? 'attributes-variant-stock--low' : 'attributes-variant-stock--out'
                          ]">
                            {{ variant.stock > 10 ? 'In stock' : variant.stock > 0 ? variant.stock + ' left' : 'Out of stock' }}
                          </span>
                        </div>

                        <div class="attributes-variant-card__body">
                          <div class="attributes-variant-image">
                            <img
                              :src="safeLoadImage(getColorFirstImage(variant.color?.name || variant.color))"
                              :alt="`${variant.color?.name || variant.color} - ${variant.size?.name || variant.size}`"
                              class="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              @error="handleImageError"
                            />
                          </div>

                          <div class="attributes-variant-meta">
                            <span class="attributes-variant-meta__label">SKU</span>
                            <p class="attributes-variant-meta__value">{{ variant.sku || 'N/A' }}</p>
                            <div class="attributes-chip-list">
                              <span class="attributes-chip">{{ variant.color?.name || variant.color }}</span>
                              <span class="attributes-chip attributes-chip--neutral">{{ variant.size?.name || variant.size }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="attributes-variant-card__footer">
                          <div class="attributes-variant-price">
                            <span class="attributes-variant-price__label">Offer Price</span>
                            <div class="attributes-variant-price__value-wrap">
                              <span class="attributes-variant-price__value">₹{{ discountedPriceForVariant(variant) }}</span>
                              <span v-if="mainProduct.discountValue > 0" class="attributes-variant-price__mrp">₹{{ variant.price }}</span>
                            </div>
                          </div>
                          <div class="attributes-variant-action">
                            <button @click="selectVariant(variant)" class="attributes-select-btn">
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Load More Button -->
                    <div v-if="displayedVariantsCount < variants.length" class="text-center mt-24">
                      <button @click="scrollToNextVariants"
                        class="px-24 py-12 bg-white border border-gray-300 hover:border-red-300 rounded-lg text-gray-700 hover:text-red-600 font-medium transition-all duration-300">
                        <div class="flex items-center gap-8">
                          <i class="ph ph-arrow-down"></i>
                          Load {{ Math.min(9, variants.length - displayedVariantsCount) }} more variants
                        </div>
                      </button>
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
                      <img src="/assets/images/thumbs/comment-img1.png" alt=""
                        class="w-52 h-52 object-fit-cover rounded-full flex-shrink-0 shadow-sm" loading="lazy"
                        decoding="async" @error="handleImageError" />
                      <div class="flex-grow-1">
                        <div class="flex-between align-items-start gap-8">
                          <div class="">
                            <h6 class="mb-12 text-md fw-semibold">Customer {{ Number(index) + 1 }}</h6>
                            <div class="flex-align gap-8">
                              <span v-for="star in 5" :key="star" class="text-xs fw-medium d-flex">
                                <i class="ph"
                                  :class="star <= review.rating ? 'ph-fill ph-star text-warning-600' : 'ph-star text-gray-300'"></i>
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
                        <span v-for="star in 5" :key="star" @click="setRating(star)" :class="['text-2xl cursor-pointer transition-transform hover:scale-110',
                          star <= rating ? 'text-warning-500' : 'text-gray-300']">
                          <i class="ph" :class="star <= rating ? 'ph-fill ph-star' : 'ph-star'"></i>
                        </span>
                      </div>
                    </div>
                    <div class="mt-32">
                      <form @submit.prevent="submitReview">
                        <div class="mb-32">
                          <label for="title" class="text-neutral-600 mb-8 d-block fw-medium">Review Title</label>
                          <input type="text" v-model="reviewTitle"
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300"
                            id="title" placeholder="Great Products" required>
                        </div>
                        <div class="mb-32">
                          <label for="desc" class="text-neutral-600 mb-8 d-block fw-medium">Review Content</label>
                          <textarea v-model="reviewContent"
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300"
                            id="desc" rows="5" placeholder="Share your experience with this product..."
                            required></textarea>
                        </div>
                        <button type="submit"
                          class="btn btn-main rounded-full mt-48 px-32 py-12 fw-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
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
                            <i class="ph"
                              :class="star <= Math.round(calculateAverageRating()) ? 'ph-fill ph-star text-warning-600' : 'ph-star text-gray-300'"></i>
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

      <!-- Size Guide Modal -->
      <div v-if="showSizeGuide" class="modal-overlay" @click.self="closeSizeGuide">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Size Guide</h5>
            <button @click="closeSizeGuide" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="getSizeChartData().clothing.length > 0">
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
                    <tr v-for="(item, index) in getSizeChartData().clothing" :key="index">
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
      <!-- Recommended Products Section -->
      <div class="mb-40">
        <div class="recommend-section">
          <div class="recommend-section__head">
            <div>
              <h6 class="recommend-section__title">Recommended Products</h6>
              <p class="recommend-section__subtitle">You might also like these products</p>
            </div>
            <div class="recommend-section__chip">
              <i class="ph ph-heart"></i>
              <span>Curated for you</span>
            </div>
          </div>

          <div v-if="recommendStore.isLoading" class="recommend-state">
            <div class="inline-block animate-spin">
              <i class="ph ph-spinner text-4xl text-red-600"></i>
            </div>
            <p class="text-gray-500 mt-16">Loading recommended products...</p>
          </div>

          <div v-else-if="recommendStore.products.length > 0" class="w-full">
            <Swiper
              :slides-per-view="1.35"
              :space-between="12"
              :breakpoints="{
                '480': {
                  slidesPerView: 1.7,
                  spaceBetween: 14,
                },
                '640': {
                  slidesPerView: 2.35,
                  spaceBetween: 16,
                },
                '768': {
                  slidesPerView: 2.9,
                  spaceBetween: 18,
                },
                '1024': {
                  slidesPerView: 3.8,
                  spaceBetween: 20,
                },
                '1280': {
                  slidesPerView: 4.8,
                  spaceBetween: 20,
                },
              }"
              class="recommended-swiper"
            >
              <SwiperSlide v-for="product in recommendStore.products.slice(0, 12)" :key="product.groupId || product.id">
                <article class="recommended-card">
                  <button
                    @click.stop="toggleWishlist(product)"
                    class="recommended-card__wishlist"
                    :aria-label="isInWishlist(getRecommendationProductId(product)) ? 'Remove from wishlist' : 'Add to wishlist'"
                  >
                    <i :class="[
                      'ph',
                      isInWishlist(getRecommendationProductId(product)) ? 'ph-heart-fill is-active' : 'ph-heart'
                    ]"></i>
                  </button>

                  <NuxtLink :to="getRecommendedProductRoute(product)" class="recommended-card__link">
                    <div class="recommended-card__media">
                      <img
                        :src="recommendStore.getProductImage(product)"
                        :alt="recommendStore.getProductName(product)"
                        class="recommended-card__image"
                        loading="lazy"
                        decoding="async"
                        @error="handleImageError"
                      />
                      <span v-if="recommendStore.hasDiscount(product)" class="recommended-card__pill recommended-card__pill--sale">
                        {{ recommendStore.getDiscountPercentage(product) }}% off
                      </span>
                      <span
                        class="recommended-card__pill"
                        :class="recommendStore.getProductStock(product) > 0 ? 'recommended-card__pill--stock' : 'recommended-card__pill--out'"
                      >
                        {{ getRecommendationStockLabel(product) }}
                      </span>
                    </div>

                    <div class="recommended-card__body">
                      <h6 class="recommended-card__title line-clamp-2">
                        {{ recommendStore.getProductName(product) }}
                      </h6>

                      <div class="recommended-card__rating">
                        <div class="recommended-card__stars">
                          <i
                            v-for="star in 5"
                            :key="star"
                            :class="[
                              'ph',
                              star <= Math.floor(recommendStore.getProductRating(product))
                                ? 'ph-star-fill'
                                : star === Math.ceil(recommendStore.getProductRating(product)) &&
                                    recommendStore.getProductRating(product) % 1 !== 0
                                  ? 'ph-star-half'
                                  : 'ph-star',
                            ]"
                          ></i>
                        </div>
                        <span class="recommended-card__rating-value">{{ recommendStore.getProductRating(product).toFixed(1) }}</span>
                        <span class="recommended-card__reviews">({{ recommendStore.getReviewCount(product) }})</span>
                      </div>

                      <div class="recommended-card__price">
                        <span class="recommended-card__price-current">₹{{ recommendStore.getDiscountedPrice(product) }}</span>
                        <span v-if="recommendStore.hasDiscount(product)" class="recommended-card__price-original">
                          ₹{{ recommendStore.getOriginalPrice(product) }}
                        </span>
                        <span v-if="recommendStore.hasDiscount(product)" class="recommended-card__price-save">
                          {{ recommendStore.getDiscountPercentage(product) }}% off
                        </span>
                      </div>
                    </div>
                  </NuxtLink>

                  <button
                    @click.stop="addRecommendedToCart(product)"
                    :disabled="recommendStore.getProductStock(product) <= 0"
                    class="recommended-card__cart"
                    :class="{ 'recommended-card__cart--disabled': recommendStore.getProductStock(product) <= 0 }"
                  >
                    <i class="ph ph-shopping-cart text-base"></i>
                    {{ recommendStore.getProductStock(product) <= 0 ? 'Out of Stock' : 'Add to Cart' }}
                  </button>
                </article>
              </SwiperSlide>
            </Swiper>
          </div>

          <div v-else class="recommend-state">
            <div class="mb-16">
              <i class="ph ph-shopping-bag text-4xl text-gray-300"></i>
            </div>
            <p class="text-gray-500">No recommended products available at the moment.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useProductGroupApi } from '~/composables/api/useProductGroupApi'
import { useRecommendStore } from '~/store/useRecommendStore'
import { useWishlistStore } from '~/store/useWishlistStore'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/pagination'

/* ----------------------------------
   ROUTE
-----------------------------------*/

const route = useRoute()
const router = useRouter()
const styleGroupId = computed(() => route.params.groupId as string)

/* ----------------------------------
   API
-----------------------------------*/

const { data, loading, error, refresh } = useProductGroupApi(styleGroupId)

// Auto-redirect on 404 errors
watch(error, (newError) => {
  if (newError && typeof newError === 'object' && 'status' in newError && (newError as any).status === 404) {
    // Show user notification about redirect
    const toast = useToast?.() || { add: () => { } }
    toast.add({
      title: 'Product Style Not Found',
      description: `Redirecting to available product style...`,
      color: 'warning'
    })

    // Try to get available groups and redirect to first one
    const fetchAvailableGroups = async () => {
      try {
        const api = useApiEndpoints()
        const allGroupsRes = await $fetch<{ data: any }>(api.products.group.list())
        const availableGroups = allGroupsRes?.data || []

        if (availableGroups.length > 0) {
          const firstGroup = availableGroups[0]

          console.log(`🔄 Redirecting from group ${styleGroupId.value} to ${firstGroup.groupId}: ${firstGroup.name}`)

          // Redirect to first available group
          await router.replace({
            params: {
              slug: route.params.slug,
              groupId: firstGroup.groupId
            }
          })
        }
      } catch (e) {
        console.error('Failed to fetch groups for redirect:', e)
      }
    }

    fetchAvailableGroups()
  }
})

/* ----------------------------------
   STORES
-----------------------------------*/

const recommendStore = useRecommendStore()
const wishlistStore = useWishlistStore()

/* ----------------------------------
   CORE STATE
-----------------------------------*/

const isChangingColor = ref(false)
const groupID = ref<string | number | null>(null)
const mainProduct = ref<any>(null)
const variants = ref<any[]>([])
const selectedVariant = ref<any>(null)

/* ----------------------------------
   SWIPER STATE
-----------------------------------*/

const thumbsSwiper = ref<SwiperType | null>(null)
const mainSwiper = ref<SwiperType | null>(null)
const activeThumb = ref(0)

/* ----------------------------------
   MOBILE SWIPER STATE
-----------------------------------*/

const mobileMainSwiper = ref<SwiperType | null>(null)
const mobileThumbsSwiper = ref<SwiperType | null>(null)
const mobileActiveThumb = ref(0)

const setMobileMainSwiper = (swiper: SwiperType) => {
  mobileMainSwiper.value = swiper
}

const setMobileThumbsSwiper = (swiper: SwiperType) => {
  mobileThumbsSwiper.value = swiper
}

const goToMobileSlide = (index: number) => {
  mobileActiveThumb.value = index
  if (mobileMainSwiper.value && mobileMainSwiper.value.slideTo) mobileMainSwiper.value.slideTo(index)
}

const onMobileSlideChange = (swiper: SwiperType) => {
  mobileActiveThumb.value = swiper.activeIndex
}

/* ----------------------------------
   QUANTITY
-----------------------------------*/

const quantity = ref(1)

/* ----------------------------------
   MAP API RESPONSE
-----------------------------------*/

watch(
  data,
  (val) => {
    if (!val) return

    groupID.value = val.groupId
    mainProduct.value = val.mainProduct
    variants.value = val.variants ?? []

    if (variants.value.length > 0) {
      selectedVariant.value = variants.value[0]
    }
  },
  { immediate: true }
)

/* ----------------------------------
   DERIVED SELECTION (CLEAN)
-----------------------------------*/

const selectedColor = computed(
  () => selectedVariant.value?.color?.name ?? null
)

const selectedSize = computed(
  () => selectedVariant.value?.size?.name ?? null
)

/* ----------------------------------
   IMAGES
-----------------------------------*/

const mainImages = computed(() => {
  // First try: Selected variant images
  if (selectedVariant.value?.images?.length) {
    return selectedVariant.value.images.map((i: any) => safeLoadImage(i.imageUrl || i))
  }

  // Second try: Main product images
  if (mainProduct.value?.images?.length) {
    return mainProduct.value.images.map((i: any) => safeLoadImage(i.imageUrl || i))
  }

  // Fallback: Return empty array to prevent errors
  return []
})

const thumbnailImages = computed(() => mainImages.value)

/* ----------------------------------
   AVAILABLE OPTIONS
-----------------------------------*/

const availableColorsWithImages = computed(() => {
  const map = new Map()

  variants.value.forEach(v => {
    const colorName = v.color?.name
    if (!colorName || map.has(colorName)) return

    map.set(colorName, {
      name: colorName,
      hexCode: v.color?.hexCode,
      imageUrl: v.images?.[0]?.imageUrl ?? null
    })
  })

  return Array.from(map.values())
})

const availableSizes = computed(() => {
  return [...new Set(variants.value.map(v => v.size?.name))]
})

/* ----------------------------------
   VARIANT SELECTION
-----------------------------------*/

const selectVariant = (variant: any) => {
  selectedVariant.value = variant
}

const selectColor = (colorName: string) => {
  // Find any variant with the selected color (prioritize current size if available)
  let match = variants.value.find(
    v =>
      v.color?.name === colorName &&
      v.size?.name === selectedSize.value
  )

  // If no variant matches current size, pick the first variant with the selected color
  if (!match) {
    match = variants.value.find(
      v => v.color?.name === colorName
    )
  }

  if (match) {
    // Set loading state
    isChangingColor.value = true

    selectedVariant.value = match

    // Force immediate update of computed properties
    nextTick(() => {
      // Preload all images for this color
      const colorVariants = variants.value.filter(v => v.color?.name === colorName)
      colorVariants.forEach(variant => {
        preloadVariantImages(variant)
      })

      // Force Swiper to completely reinitialize
      setTimeout(() => {
        if (mainSwiper.value) {
          mainSwiper.value.slideTo(0)
          mainSwiper.value.update()
          mainSwiper.value.updateSize()
          mainSwiper.value.updateSlides()
        }
        if (mobileMainSwiper.value) {
          mobileMainSwiper.value.slideTo(0)
          mobileMainSwiper.value.update()
          mobileMainSwiper.value.updateSize()
          mobileMainSwiper.value.updateSlides()
        }

        // Reset loading state
        isChangingColor.value = false
      }, 100)
    })
  }
}

const selectSize = (sizeName: string) => {
  const match = variants.value.find(
    v =>
      v.size?.name === sizeName &&
      v.color?.name === selectedColor.value
  )

  if (match) selectedVariant.value = match
}

/* ----------------------------------
   PRICE
-----------------------------------*/

const discountedPrice = computed(() => {
  if (!selectedVariant.value) return 0

  const price = parseFloat(selectedVariant.value.price ?? 0)
  const discount = parseFloat(mainProduct.value?.discountValue ?? 0)

  if (mainProduct.value?.discount === 'PERCENTAGE' && discount > 0) {
    return +(price - (price * discount) / 100).toFixed(2)
  }

  return price
})

/* ----------------------------------
   IMAGE PRELOADING & ERROR HANDLING
-----------------------------------*/

// Fallback image path
const FALLBACK_IMAGE = '/assets/images/nowcategory/p1.jpg'

// Safe image loading with error handling
const safeLoadImage = (src: any, fallback: string = FALLBACK_IMAGE): string => {
  if (!src || typeof src !== 'string' || src.trim() === '') return fallback
  return src
}

// Image error handler with infinite loop protection
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement

  // Prevent infinite loops
  if (img.dataset.fallbackSet === 'true') return

  // Set fallback and mark as handled
  img.src = FALLBACK_IMAGE
  img.dataset.fallbackSet = 'true'
}

const preloadVariantImages = (variant: any) => {
  if (!variant?.images?.length) return

  // Create image elements with proper error handling
  variant.images.forEach((imageObj: any, index: number) => {
    const img = new Image()

    // Set up load and error handlers
    img.onload = () => {
      console.log(`Image loaded: ${imageObj.imageUrl}`)
    }

    img.onerror = (error) => {
      console.error(`Image failed to load: ${imageObj.imageUrl}`, error)
    }

    // Start loading the image
    img.src = safeLoadImage(imageObj.imageUrl || imageObj)
  })
}

const preloadColorImages = (colorName: any) => {
  if (!colorName || typeof colorName !== 'string') return

  const colorVariants = variants.value.filter(v => v.color?.name === colorName)
  // Preload only first image of each variant for color switching
  colorVariants.forEach(variant => {
    if (variant.images?.[0]) {
      const img = new Image()
      const firstImage = variant.images[0]
      img.src = safeLoadImage(firstImage.imageUrl || firstImage)
    }
  })
}

// Progressive image loading
const loadImagesProgressively = () => {
  if (!mainImages.value.length) return

  // Load first image immediately (above the fold)
  if (mainImages.value[0]) {
    const img = new Image()
    img.src = safeLoadImage(mainImages.value[0])
  }

  // Load remaining images after a delay
  setTimeout(() => {
    mainImages.value.slice(1).forEach((src: string, index: number) => {
      setTimeout(() => {
        const img = new Image()
        img.src = safeLoadImage(src)
      }, index * 200) // Stagger loading by 200ms
    })
  }, 500)
}

// Preload images for all variants when component mounts
onMounted(() => {
  // Load images progressively instead of all at once
  loadImagesProgressively()

  // Preload first variant only
  if (variants.value.length > 0) {
    preloadVariantImages(variants.value[0])
  }
})

/* ----------------------------------
   STOCK
-----------------------------------*/

const getStockStatus = () => {
  const stock = selectedVariant.value?.stock ?? 0
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 5) return 'Low Stock - Hurry!'
  return 'In Stock'
}

/* ----------------------------------
   QUANTITY CONTROLS
-----------------------------------*/

const increaseQuantity = () => {
  const max = selectedVariant.value?.stock ?? 1
  if (quantity.value < max) quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

/* ----------------------------------
   SWIPER METHODS
-----------------------------------*/

const setThumbsSwiper = (swiper: SwiperType) => {
  thumbsSwiper.value = swiper
}

const setMainSwiper = (swiper: SwiperType) => {
  mainSwiper.value = swiper
}

const goToSlide = (index: number) => {
  activeThumb.value = index
  if (mainSwiper.value && mainSwiper.value.slideTo) mainSwiper.value.slideTo(index)
}

const onSlideChange = (swiper: SwiperType) => {
  activeThumb.value = swiper.activeIndex
}

// Image modal functionality
const openImageModal = (index: number) => {
  // For now, just log - can be extended to open a modal
  console.log('Opening image modal for index:', index)
  // TODO: Implement modal functionality
}



/* ----------------------------------
   CART (SIMPLE)
-----------------------------------*/

const cartItems = ref<any[]>([])

const loadCartFromStorage = () => {
  const data = localStorage.getItem('shopping_cart')
  cartItems.value = data ? JSON.parse(data) : []
}

const saveCart = (cart: any[]) => {
  localStorage.setItem('shopping_cart', JSON.stringify(cart))
  loadCartFromStorage()
}

/* ----------------------------------
   MISSING FUNCTIONS & PROPERTIES
-----------------------------------*/

const activeTab = ref('description')
const showSizeGuide = ref(false)
const successMessage = ref('')
const showSuccessMessage = ref(false)
const rating = ref(0)
const reviewTitle = ref('')
const reviewContent = ref('')

// Cart computed properties
const cartItemCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
const cartSubtotal = computed(() => cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
const cartTotalPrice = computed(() => cartSubtotal.value)
const cartSavings = computed(() => {
  // Calculate potential savings from discounts (mock calculation)
  return cartItems.value.reduce((sum, item) => {
    const originalPrice = item.price * 1.1 // Assume 10% original price
    const savings = (originalPrice - item.price) * item.quantity
    return sum + Math.max(0, savings)
  }, 0)
})

// Size functions
const isClothingCategory = () => mainProduct.value?.category?.name?.toLowerCase().includes('clothing')
const isShoesCategory = () => mainProduct.value?.category?.name?.toLowerCase().includes('shoes')
const isElectronicsCategory = () => mainProduct.value?.category?.name?.toLowerCase().includes('electronics')

const getClothingSizes = () => ['S', 'M', 'L', 'XL', 'XXL']
const getShoeSizes = () => ['6', '7', '8', '9', '10', '11', '12']
const getElectronicsSizes = () => ['Standard', 'Large', 'Extra Large']

const getSizeChartData = () => ({
  clothing: [
    { size: 'S', chest: '36-38', waist: '30-32', length: '26-27' },
    { size: 'M', chest: '39-41', waist: '33-35', length: '27-28' },
    { size: 'L', chest: '42-44', waist: '36-38', length: '28-29' }
  ] as Array<{ size: string, chest: string, waist: string, length: string }>,
  shoes: [
    { size: '8', length: '25.5', width: '10' },
    { size: '9', length: '26', width: '10.5' },
    { size: '10', length: '26.5', width: '11' }
  ] as Array<{ size: string, length: string, width: string }>
})

const getFitClass = (fit: string) => {
  const fits: Record<string, string> = { 'tight': 'text-red-600', 'regular': 'text-green-600', 'loose': 'text-blue-600' }
  return fits[fit] || 'text-gray-600'
}

const getFitText = (fit: string) => {
  const fits: Record<string, string> = { 'tight': 'Tight Fit', 'regular': 'Regular Fit', 'loose': 'Loose Fit' }
  return fits[fit] || 'Unknown Fit'
}

// Image functions
const getColorFirstImage = (colorName: any) => {
  if (!colorName || typeof colorName !== 'string') {
    return '/assets/images/placeholder.jpg'
  }

  // Try to find color in mainProduct.colors first
  const color = mainProduct.value?.colors?.find((c: any) =>
    c.name?.toLowerCase() === colorName?.toLowerCase()
  )

  if (color?.imageUrl) {
    return color.imageUrl
  }

  // Try to find in variant images
  const variantWithColor = variants.value.find(v =>
    v.color?.name?.toLowerCase() === colorName?.toLowerCase()
  )

  if (variantWithColor?.images?.length > 0) {
    const firstImage = variantWithColor.images[0]
    // Handle both string URLs and image objects with imageUrl property
    return typeof firstImage === 'string' ? firstImage : firstImage?.imageUrl || '/assets/images/placeholder.jpg'
  }

  // Try to construct image path based on color name
  if (colorName) {
    const possiblePaths = [
      `/assets/images/products/${colorName.toLowerCase().replace(/\s+/g, '-')}/main.jpg`,
      `/assets/images/colors/${colorName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      `/assets/images/nowcategory/${colorName.toLowerCase().replace(/\s+/g, '-')}.jpg`
    ]

    for (const path of possiblePaths) {
      if (path) return path
    }
  }

  // Final fallback
  return '/assets/images/placeholder.jpg'
}

// Utility functions
const formatDate = (date: string) => {
  if (!date) return 'N/A'

  const parsedDate = new Date(date)

  // Check if date is invalid or is the Unix epoch (1970-01-01)
  if (isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() === 1970 &&
    parsedDate.getMonth() === 0 &&
    parsedDate.getDate() === 1) {
    return 'N/A'
  }

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateAverageRating = () => {
  if (!mainProduct.value?.reviews?.length) return 0
  const sum = mainProduct.value.reviews.reduce((acc: number, review: any) => acc + review.rating, 0)
  return Number((sum / mainProduct.value.reviews.length).toFixed(1))
}

// Variant functions
const discountedPriceForVariant = (variant: any) => {
  if (!mainProduct.value?.discountValue) return variant.price
  return Math.round(variant.price * (1 - mainProduct.value.discountValue / 100))
}

const displayedVariantsCount = ref(9)

const scrollToNextVariants = () => {
  console.log('Load More clicked - Current count:', displayedVariantsCount.value, 'Total variants:', variants.value.length)

  // Increase the displayed variants count
  displayedVariantsCount.value = Math.min(displayedVariantsCount.value + 9, variants.value.length)
  console.log('New count after increment:', displayedVariantsCount.value)

  // Scroll to the newly loaded variants
  nextTick(() => {
    const container = document.querySelector('.variants-container')
    if (container) {
      // Scroll to the last newly added variant
      const newVariantIndex = displayedVariantsCount.value - 1
      const newVariantElement = container.querySelector(`.variant-card:nth-child(${newVariantIndex + 1})`)

      if (newVariantElement) {
        console.log('Scrolling to new variant at index:', newVariantIndex)
        newVariantElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      } else {
        console.log('Using fallback scroll to bottom')
        // Fallback: scroll to bottom of container
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    } else {
      console.log('Container not found')
    }
  })
}

// Action functions
const openSizeGuide = () => showSizeGuide.value = true
const closeSizeGuide = () => showSizeGuide.value = false

const setRating = (value: number) => rating.value = value

const orderOnWhatsapp = () => {
  const message = `I want to order: ${mainProduct.value?.name} - ${selectedVariant.value?.name}`
  window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank')
}

const validateQuantity = (value: number) => {
  const max = selectedVariant.value?.stock || 1
  return Math.min(Math.max(1, value), max)
}

const getRecommendationProductId = (product: any): string | number | null => {
  if (!product) return null
  return product?.mainProduct?.id ?? product?.id ?? product?.groupId ?? null
}

const getRecommendedProductRoute = (product: any): string => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  const groupId = product?.groupId ?? product?.id ?? product?.mainProduct?.groupId

  if (!slug || !groupId) return '/shop-all'
  return `/shop-all/${slug}/${groupId}`
}

const getRecommendationStockLabel = (product: any): string => {
  const stock = recommendStore.getProductStock(product)
  if (stock <= 0) return 'Out of stock'
  if (stock <= 10) return `${stock} left`
  return 'In stock'
}

const toggleWishlist = (product: any) => {
  if (!product) {
    console.log('No product provided to toggleWishlist')
    return
  }

  const productId = getRecommendationProductId(product)
  if (!productId) {
    console.log('Unable to resolve product id for wishlist')
    return
  }

  console.log('Toggling wishlist for product:', productId)

  const mainProductForWishlist = product?.mainProduct?.id ? product.mainProduct : product
  const wishlistProduct = {
    mainProduct: mainProductForWishlist,
    selectedVariant: selectedVariant.value
  }

  if (isInWishlist(productId)) {
    console.log('Removing from wishlist')
    wishlistStore.removeItem({ mainProduct: { id: productId } })
  } else {
    console.log('Adding to wishlist')
    wishlistStore.addItem(wishlistProduct)
  }

  console.log('Wishlist items count:', wishlistStore.items.length)
}

const isInWishlist = (productId: string | number | null | undefined) => {
  if (productId === null || productId === undefined) return false
  return wishlistStore.items.some(item => String(item?.mainProduct?.id) === String(productId))
}

const compareProduct = () => {
  // Compare logic
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: mainProduct.value?.name,
      url: window.location.href
    })
  }
}

const refreshCartSummary = () => {
  loadCartFromStorage()
}

const removeFromCart = (itemId: number) => {
  const cart = cartItems.value.filter(item => item.id !== itemId)
  saveCart(cart)
}

const updateCartItemQuantity = (itemId: number, change: number) => {
  const cart = cartItems.value.map(item => {
    if (item.id === itemId) {
      const newQuantity = item.quantity + change
      // Ensure quantity doesn't go below 1 or exceed stock
      const finalQuantity = Math.max(1, item.stock ? Math.min(newQuantity, item.stock) : newQuantity)
      return { ...item, quantity: finalQuantity }
    }
    return item
  })
  saveCart(cart)
}

const submitReview = () => {
  // Review submission logic
  console.log('Review submitted:', { rating: rating.value, title: reviewTitle.value, content: reviewContent.value })
}

const addToCart = () => {
  const baseProduct = selectedVariant.value || mainProduct.value
  if (!baseProduct) return

  const discountType = String(mainProduct.value?.discount || '').toUpperCase()
  const discountValue = Number.parseFloat(String(mainProduct.value?.discountValue ?? 0)) || 0
  const rawPrice = Number.parseFloat(String(baseProduct.price ?? mainProduct.value?.price ?? 0)) || 0
  const finalPrice = discountType === 'PERCENTAGE' && discountValue > 0
    ? +(rawPrice - (rawPrice * discountValue) / 100).toFixed(2)
    : rawPrice

  const stock = Number.parseInt(String(baseProduct.stock ?? mainProduct.value?.stock ?? 999), 10) || 999
  const qtyToAdd = Math.max(1, Math.min(Number(quantity.value) || 1, stock))

  const cart = [...cartItems.value]
  const productId = baseProduct.id || mainProduct.value?.id
  const variantId = baseProduct.id && mainProduct.value?.id && baseProduct.id !== mainProduct.value.id
    ? baseProduct.id
    : null

  const existing = cart.find(
    item =>
      String(item.productId) === String(productId) &&
      String(item.variantId || '') === String(variantId || '')
  )

  if (existing) {
    const currentQty = Number(existing.quantity) || 1
    existing.quantity = Math.min(currentQty + qtyToAdd, stock)
    existing.price = Number.parseFloat(String(existing.price ?? finalPrice)) || finalPrice
    existing.stock = stock
  } else {
    cart.push({
      id: Date.now().toString(),
      productId,
      groupId: groupID.value,
      variantId,
      name: mainProduct.value?.name || baseProduct.name || 'Product',
      price: finalPrice,
      originalPrice: rawPrice,
      discounted: finalPrice < rawPrice,
      quantity: qtyToAdd,
      stock,
      image: mainImages.value?.[0] || '/assets/images/nowcategory/p1.jpg',
      color: selectedColor.value,
      size: selectedSize.value
    })
  }

  cartItems.value = cart
  saveCart(cart)
}

const addRecommendedToCart = (product: any) => {
  if (!product) return

  const stock = recommendStore.getProductStock(product)
  if (stock <= 0) return

  const productId = getRecommendationProductId(product)
  if (!productId) return

  const cart = [...cartItems.value]
  const existing = cart.find(
    item =>
      String(item.productId) === String(productId) &&
      String(item.variantId || '') === String(product.variantId || '')
  )

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      id: Date.now().toString(),
      productId,
      variantId: product.variantId || null,
      name: recommendStore.getProductName(product),
      price: recommendStore.getDiscountedPrice(product),
      quantity: 1,
      image: recommendStore.getProductImage(product),
      color: product?.color?.name || product?.color || null,
      size: product?.size?.name || product?.size || null,
      stock
    })
  }

  cartItems.value = cart
  saveCart(cart)
}

const stockPercentage = computed(() => {
  const stock = selectedVariant.value?.stock ?? 0
  const maxStock = 100
  return Math.min((stock / maxStock) * 100, 100)
})

/* ----------------------------------
   LIFECYCLE
-----------------------------------*/

onMounted(async () => {
  // Load cart data
  loadCartFromStorage()

  window.addEventListener('storage', (event) => {
    if (event.key === 'shopping_cart') {
      loadCartFromStorage()
    }
  })

  // Load recommended products
  try {
    await recommendStore.fetchProducts({ sortBy: 'popularity', limit: 12 })
  } catch (error) {
    console.error('Failed to fetch recommended products:', error)
  }
})
</script>

<style scoped>
.product-details {
  padding-bottom: 25px !important;
}

.product-tabs-wrap {
  padding-top: 20px !important;
}

@media (max-width: 768px) {
  .product-details {
    padding-bottom: 28px !important;
  }

  .product-tabs-wrap {
    padding-top: 12px !important;
  }
}

/* Cart item label colors */
.cart-label-text {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

/* Product Gallery Wrapper */
.product-gallery-wrapper {
  display: flex;
  gap: 16px;
  height: 500px;
}

/* Desktop Thumbnail Container */
.thumbnail-container {
  width: 80px;
  flex-shrink: 0;
}

.thumbnail-swiper {
  height: 100%;
}

.thumbnail-swiper .swiper-wrapper {
  height: 100%;
}

.thumbnail-swiper .swiper-slide {
  height: calc(100% / 4 - 12px) !important;
  margin-bottom: 12px;
}

.thumbnail-item {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.thumbnail-item.active-thumbnail {
  border-color: #CA2D52;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.thumbnail-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Desktop Main Image Slider */
.product-details__thumb-slider {
  flex: 1;
  height: 100%;
}

.main-swiper {
  height: 100%;
}

.main-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
}

.main-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* ============================================= */
/* MOBILE/TABLET STYLES */
/* ============================================= */

/* Mobile Main Slider */
.mobile-main-slider {
  position: relative;
}

.mobile-main-swiper {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
}

.mobile-main-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.mobile-main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 350px;
}

/* Mobile Pagination Dots */
.mobile-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.mobile-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-dot-active {
  width: 24px;
  height: 8px;
  border-radius: 4px;
  background-color: #CA2D52;
}

/* Mobile Thumbnails Slider */
.mobile-thumbnails-slider {
  margin-top: 20px;
}

.mobile-thumbnail-swiper {
  width: 100%;
  height: 80px;
}

.mobile-thumbnail-item {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-thumbnail-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.mobile-thumbnail-item.mobile-active-thumbnail {
  border-color: #CA2D52;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.mobile-thumbnail-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.mobile-thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1199px) {
  .mobile-main-swiper {
    height: 400px;
  }

  .mobile-main-product-image {
    max-height: 400px;
  }

  .mobile-thumbnail-swiper {
    height: 90px;
  }
}

/* Small Mobile adjustments */
@media (max-width: 480px) {
  .mobile-main-swiper {
    height: 300px;
  }

  .mobile-main-product-image {
    max-height: 300px;
  }

  .mobile-thumbnail-swiper {
    height: 70px;
  }
}

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
  background: #ecedeb;
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
  background: #ecedeb;
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
  border: 1px solid #CA2D52;
  color: #CA2D52;
}

.btn-outline-main:hover {
  background: #CA2D52;
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

/* Sticky Image Gallery */
.sticky-image-gallery {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  z-index: 10;
}

/* Ensure sidebar is always on the right side */
@media (min-width: 992px) {
  .product-details .row {
    flex-direction: row;
  }

  .product-details .col-lg-9 {
    order: 1;
  }

  .product-details .col-lg-3 {
    order: 2;
  }
}

/* Color Option */
.color-option {
  transition: all 0.3s ease;
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Size Option */
.size-option {
  transition: all 0.3s ease;
  border-radius: 12px;
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

/* Button Styles */
.btn-main {
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
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

.space-y-2>*+* {
  margin-top: 0.5rem;
}

.space-y-3>*+* {
  margin-top: 0.75rem;
}

.space-y-4>*+* {
  margin-top: 1rem;
}

/* Responsive adjustments for other elements */
@media (max-width: 768px) {
  .color-option {
    width: 40px;
    height: 40px;
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

@media (max-width: 768px) {
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

/* Color option styles */
.color-option {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.color-option img {
  transition: transform 0.3s ease;
}

.color-option:hover img {
  transform: scale(1.1);
}

.ring-2 {
  box-shadow: 0 0 0 2px currentColor;
}

.ring-offset-2 {
  margin: 2px;
}

/* Custom Scrollbar for Cart Items */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Line Clamp Utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style>
/* Product Gallery Grid Styles */
.product-gallery-grid {
  width: 100%;
  height: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  width: 90%;
  height: 900px;
  margin: 0 auto;
}

.grid-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e5e7eb;
}

.grid-image-container:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.grid-product-image {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  transition: transform 0.3s ease;
  background-color: #f8fafc;
}

.grid-image-container:hover .grid-product-image {
  transform: scale(1.05);
}

/* Enhanced Product Details Styles */
.product-details__content {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.product-details__content h5 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
  line-height: 1.3;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fef3c7;
  border-radius: 12px;
  margin-bottom: 20px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-weight: 600;
  color: #92400e;
}

.sku-info {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #64748b;
}

.product-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
  margin: 20px 0;
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;
  border-left: 4px solid #CA2D52;
}

.color-selection {
  margin: 24px 0;
}

.color-selection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-option:hover {
  transform: translateY(-2px);
}

.size-selection {
  margin: 24px 0;
}

.size-selection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.size-guide-button {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.size-guide-button:hover {
  color: #2563eb;
}

.price-section {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #0369a1;
}

.original-price {
  font-size: 1.25rem;
  color: #64748b;
  text-decoration: line-through;
}

.discount-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #dc2626;
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-info {
  margin: 20px 0;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stock-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stock-text {
  font-weight: 600;
  color: #166534;
}

.stock-progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.stock-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  transition: width 0.3s ease;
}

/* Enhanced Product Tabs Section */
.product-dContent {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-top: 40px;
}

.product-dContent__header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 24px 32px;
}

.product-dContent .nav {
  display: flex;
  gap: 8px;
  background: #ffffff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-dContent .nav-link {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #64748b;
  border: none;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.product-dContent .nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.product-dContent .nav-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.3);
  transform: translateY(-1px);
}

.product-dContent .nav-link:hover:not(.active) {
  color: #CA2D52;
  background: #fef2f4;
  transform: translateY(-1px);
}

.satisfaction-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  color: #CA2D52;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(202, 45, 82, 0.25);
  transition: all 0.3s ease;
}

.satisfaction-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(202, 45, 82, 0.35);
}

.product-dContent__box {
  padding: 32px;
  background: #ffffff;
}

.tab-content {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #830622;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #CA2D52 0%, transparent 100%);
  border-radius: 1px;
}

.description-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #CA2D52;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.category-badge {
  padding: 8px 16px;
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  box-shadow: 0 2px 8px rgba(202, 45, 82, 0.2);
  transition: all 0.3s ease;
}

.category-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.3);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.info-icon.sku {
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
}

.info-icon.barcode {
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
}

.info-icon.unit {
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
}

.info-icon.origin {
  background: linear-gradient(135deg, #CA2D52 0%, #830622 100%);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
}

/* Attributes tab refinements */
.attributes-panel {
  border: 1px solid #e7edf3;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #fbfcff 100%);
  padding: 20px;
}

.attributes-panel__header {
  margin-bottom: 18px;
}

.attributes-panel__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
}

.attributes-panel__subtitle {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.attributes-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  padding: 16px;
}

.attributes-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.attributes-card__variant {
  display: flex;
  align-items: center;
  gap: 12px;
}

.attributes-card__image-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  flex-shrink: 0;
}

.attributes-card__image-wrap--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ca2d52;
  background: #fff1f4;
  border-color: #fbc9d4;
}

.attributes-card__image-wrap--placeholder i {
  font-size: 1.1rem;
}

.attributes-card__label {
  margin: 0 0 6px;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
}

.attributes-chip-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.attributes-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffe9ee;
  color: #9f1239;
  border: 1px solid #fbc9d4;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.2;
}

.attributes-chip--neutral {
  background: #f8fafc;
  color: #475569;
  border-color: #e2e8f0;
}

.attributes-stock {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid transparent;
}

.attributes-stock--in {
  color: #166534;
  background: #dcfce7;
  border-color: #86efac;
}

.attributes-stock--low {
  color: #92400e;
  background: #fef3c7;
  border-color: #fcd34d;
}

.attributes-stock--out {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fca5a5;
}

.attributes-spec-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.attributes-spec {
  border: 1px solid #e7edf3;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fafcff;
}

.attributes-spec span {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 4px;
}

.attributes-spec strong {
  font-size: 0.9rem;
  color: #111827;
  font-weight: 700;
}

.attributes-list-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.attributes-variants-grid {
  gap: 14px;
}

.attributes-variant-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attributes-variant-card:hover {
  border-color: #f4b4c2;
  box-shadow: 0 12px 24px rgba(190, 18, 60, 0.12);
  transform: translateY(-2px);
}

.attributes-variant-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.attributes-variant-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #9f1239;
  background: #ffe9ee;
  border: 1px solid #fbc9d4;
  border-radius: 999px;
  padding: 4px 10px;
}

.attributes-variant-stock {
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 4px 10px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.attributes-variant-stock--in {
  color: #166534;
  background: #dcfce7;
  border-color: #86efac;
}

.attributes-variant-stock--low {
  color: #92400e;
  background: #fef3c7;
  border-color: #fcd34d;
}

.attributes-variant-stock--out {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fca5a5;
}

.attributes-variant-card__body {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 12px;
  align-items: start;
}

.attributes-variant-image {
  width: 100%;
  height: 104px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.attributes-variant-meta__label {
  display: block;
  font-size: 0.72rem;
  color: #64748b;
  margin-bottom: 4px;
}

.attributes-variant-meta__value {
  font-size: 0.86rem;
  color: #111827;
  font-weight: 700;
  margin: 0 0 10px;
  line-height: 1.35;
}

.attributes-variant-card__footer {
  border-top: 1px solid #eef2f7;
  padding-top: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.attributes-variant-price__label {
  display: block;
  font-size: 0.72rem;
  color: #64748b;
  margin-bottom: 4px;
}

.attributes-variant-price__value-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.attributes-variant-price__value {
  color: #be123c;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1;
}

.attributes-variant-price__mrp {
  color: #6b7280;
  font-size: 0.78rem;
  text-decoration: line-through;
}

.attributes-select-btn {
  border: 0;
  border-radius: 9px;
  padding: 7px 12px;
  background: linear-gradient(135deg, #ca2d52 0%, #9f1239 100%);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  line-height: 1;
}

.attributes-select-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 14px rgba(159, 18, 57, 0.2);
}

@media (max-width: 640px) {
  .attributes-panel {
    padding: 14px;
  }

  .attributes-card {
    padding: 12px;
  }

  .attributes-card__top {
    flex-direction: column;
    align-items: flex-start;
  }

  .attributes-spec-grid {
    grid-template-columns: 1fr;
  }

  .attributes-variant-card {
    padding: 12px;
    gap: 10px;
  }

  .attributes-variant-card__head {
    flex-wrap: wrap;
  }

  .attributes-variant-card__body {
    grid-template-columns: 1fr;
  }

  .attributes-variant-image {
    height: 140px;
  }

  .attributes-variant-card__footer {
    align-items: center;
  }
}

/* Force cart label colors - non-scoped to override everything */
.cart-label-text {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

/* Additional override for any potential conflicts */
span.cart-label-text {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

div[class*="bg-"] span.cart-label-text {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

/* Final attempt - new class name */
.force-color-red {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

span.force-color-red {
  color: #CA2D52 !important;
  font-size: 0.75rem !important;
}

/* Red Theme Overrides for main-600 color */
.text-main-600 {
  color: #CA2D52 !important;
}

.bg-main-600 {
  background-color: #CA2D52 !important;
}

.border-main-600 {
  border-color: #CA2D52 !important;
}

.hover\:text-main-600:hover {
  color: #CA2D52 !important;
}

.hover\:text-main-800:hover {
  color: #830622 !important;
}

.hover\:bg-main-600:hover {
  background-color: #CA2D52 !important;
}

/* Ensure consistency for all main color variants */
.text-main-800 {
  color: #830622 !important;
}

.bg-main-800 {
  background-color: #830622 !important;
}

.border-main-800 {
  border-color: #830622 !important;
}

/* Variants Grid Styles */
.variants-container {
  max-height: 800px;
  overflow-y: auto;
  padding-right: 8px;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.scrollable-variants {
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollable-variants::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.variant-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.variant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(202, 45, 82, 0.15);
}

.variant-image img {
  transition: transform 0.3s ease;
}

.variant-card:hover .variant-image img {
  transform: scale(1.05);
}

/* Scrollbar Styles */
.variants-scrollbar {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.scrollbar-track {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #fef2f4 0%, #fecaca 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fca5a5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scrollbar-track:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(202, 45, 82, 0.2);
}

.scrollbar-thumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #830622;
  font-weight: 600;
  font-size: 0.875rem;
}

.scrollbar-thumb i {
  font-size: 1.25rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .variants-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .variants-grid {
    grid-template-columns: 1fr;
  }
}

/* Recommended Products Redesign */
.recommend-section {
  border-radius: 20px;
  border: 1px solid #f3d6dc;
  background: linear-gradient(120deg, #ffffff 0%, #fff6f7 55%, #ffffff 100%);
  box-shadow: 0 12px 34px rgba(2, 6, 23, 0.04);
  padding: 32px;
}

.recommend-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.recommend-section__title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.recommend-section__subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.recommend-section__chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #fbc9d4;
  background: #fff1f4;
  color: #be123c;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.recommend-state {
  text-align: center;
  padding: 56px 0;
}

.recommended-swiper {
  padding-bottom: 24px !important;
}

.recommended-swiper .swiper-slide {
  height: auto !important;
  display: flex;
}

.recommended-swiper .swiper-slide > article {
  height: 100%;
  width: 100%;
}

.recommended-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #e8edf2;
  background: #ffffff;
  overflow: hidden;
  min-height: 100%;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.recommended-card:hover {
  transform: translateY(-4px);
  border-color: #f4b4c2;
  box-shadow: 0 18px 35px rgba(190, 18, 60, 0.14);
}

.recommended-card__wishlist {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
  width: 34px;
  height: 34px;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.25s ease;
}

.recommended-card__wishlist:hover {
  border-color: #fda4af;
  color: #dc2626;
  background: #fff3f5;
}

.recommended-card__wishlist i.is-active {
  color: #dc2626;
}

.recommended-card__link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

.recommended-card__media {
  position: relative;
  aspect-ratio: 5 / 4;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
}

.recommended-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.recommended-card:hover .recommended-card__image {
  transform: scale(1.06);
}

.recommended-card__pill {
  position: absolute;
  left: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
}

.recommended-card__pill--sale {
  top: 10px;
  background: #dc2626;
  color: #ffffff;
}

.recommended-card__pill--stock {
  bottom: 10px;
  background: rgba(22, 163, 74, 0.12);
  color: #166534;
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.recommended-card__pill--out {
  bottom: 10px;
  background: rgba(107, 114, 128, 0.16);
  color: #374151;
  border: 1px solid rgba(107, 114, 128, 0.22);
}

.recommended-card__body {
  padding: 12px 12px 10px;
}

.recommended-card__title {
  color: #111827;
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 10px;
  min-height: 2.4em;
}

.recommended-card__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.recommended-card__stars {
  display: flex;
  align-items: center;
  color: #f59e0b;
  font-size: 0.82rem;
}

.recommended-card__rating-value {
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}

.recommended-card__reviews {
  font-size: 0.74rem;
  color: #6b7280;
}

.recommended-card__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.recommended-card__price-current {
  color: #be123c;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.recommended-card__price-original {
  color: #6b7280;
  font-size: 0.78rem;
  text-decoration: line-through;
}

.recommended-card__price-save {
  color: #15803d;
  font-size: 0.76rem;
  font-weight: 600;
}

.recommended-card__cart {
  margin: 0 12px 12px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #ca2d52 0%, #b91c3c 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.84rem;
  padding: 9px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.recommended-card__cart:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(185, 28, 60, 0.28);
}

.recommended-card__cart--disabled,
.recommended-card__cart:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

@media (max-width: 1024px) {
  .recommend-section {
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .recommend-section {
    padding: 18px;
    border-radius: 16px;
  }

  .recommend-section__head {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .recommend-section__chip {
    font-size: 0.8rem;
    padding: 7px 12px;
  }

  .recommended-card__title {
    font-size: 0.84rem;
  }

  .recommended-card__price-current {
    font-size: 0.94rem;
  }
}
</style>
