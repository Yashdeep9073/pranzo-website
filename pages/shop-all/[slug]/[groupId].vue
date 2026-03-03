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
        <div class="col-lg-9 order-lg-1">
          <div class="row gy-4">
            <!-- Product Images Section -->
            <div class="col-xl-6">
              <div class="product-details__left sticky-image-gallery">
                <!-- Desktop: Vertical thumbnails on left -->
                <div class="product-gallery-wrapper d-none d-xl-flex">
                  <!-- LEFT: VERTICAL THUMBNAILS (Desktop only) -->
                  <div class="thumbnail-container me-3">
                    <Swiper direction="vertical" @swiper="setThumbsSwiper" :spaceBetween="12" :slidesPerView="4" :watchSlidesProgress="true"
                      class="thumbnail-swiper h-100">
                      <SwiperSlide v-for="(thumb, index) in thumbnailImages" :key="index"
                        @click="goToSlide(Number(index))">
                        <div :class="[
                          'thumbnail-item',
                          activeThumb === index ? 'active-thumbnail' : ''
                        ]">
                          <div class="thumbnail-image-wrapper">
                            <img :src="safeLoadImage(thumb)" :alt="`Thumbnail ${Number(index) + 1}`"
                              class="thumbnail-image" loading="lazy" decoding="async" @error="handleImageError" />
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>

                  <!-- RIGHT: MAIN IMAGE -->
                  <div class="product-details__thumb-slider overflow-hidden flex-grow-1">
                    <Swiper :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }" :spaceBetween="0" :slidesPerView="1"
                      :loadOnTransitionStart="true" class="main-swiper h-100"
                      @swiper="setMainSwiper" @slideChange="onSlideChange">
                      <SwiperSlide v-for="(image, index) in mainImages" :key="index" class="main-image-slide h-100">
                        <div class="main-image-container h-100 d-flex align-items-center justify-content-center">
                          <img :src="safeLoadImage(image)" :alt="`Product image ${Number(index) + 1}`"
                            class="main-product-image" :loading="index === 0 ? 'eager' : 'lazy'" decoding="async"
                            :preload="index === 0" @error="handleImageError" />
                        </div>

                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
                <!-- Mobile/Tablet: Horizontal thumbnails with dots -->
                <div class="d-xl-none">
                  <!-- Main Image with Dots -->
                  <div class="mobile-main-slider">
                    <Swiper :modules="[Pagination]" :spaceBetween="0" :slidesPerView="1"
                      :pagination="{
                        clickable: true,
                        el: '.mobile-pagination',
                        bulletClass: 'mobile-dot',
                        bulletActiveClass: 'mobile-dot-active'
                      } as any" @swiper="setMobileMainSwiper" @slideChange="onMobileSlideChange" class="mobile-main-swiper">
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
                    <Swiper :spaceBetween="10" :slidesPerView="4":watchSlidesProgress="true"
                      class="mobile-thumbnail-swiper"
                      @swiper="setMobileThumbsSwiper">
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

            <!-- Product Details (Remains exactly the same) -->
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

                <!-- Color Selection images instead of color circles -->
                <div v-if="availableColorsWithImages.length > 0" class="mt-32">
                  <span class="text-gray-900 d-block mb-8 fw-semibold">Color:</span>
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
                        <span class="badge bg-blue-100 text-blue-800 border border-blue-200">
                          {{ selectedVariant.color?.name || selectedVariant.color }}
                        </span>
                        <span class="badge bg-green-100 text-green-800 border border-green-200">
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
                  class="flex-align flex-wrap gap-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-12 py-16 px-24 border border-blue-100">
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
                  <button @click="toggleWishlist"
                    :class="['w-52 h-52 flex-center rounded-circle text-xl transition-all duration-300',
                      isInWishlist ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg' :
                        'bg-gradient-to-br from-gray-50 to-white text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:text-red-500 border border-gray-100 shadow-sm']">
                    <i class="ph" :class="isInWishlist ? 'ph-heart-fill' : 'ph-heart'"></i>
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

        <!-- Sidebar -->
        <div class="col-lg-3 order-lg-2">
          <div class="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden shadow-sm">
            <!-- Store Info -->
            <div class="p-24 bg-yellow-400">
              <div class="flex-between rounded-full p-8">
                <div class="flex-align gap-8">
                  <span class="w-44 h-44 bg-white rounded-full flex-center text-2xl text-main-600">
                    <i class="ph ph-storefront"></i>
                  </span>
                  <span class="text-Black fw-semibold">By Marketpro</span>
                </div>
                <NuxtLink to="/shop"
                  class="btn btn-white rounded-full text-uppercase fw-semibold transition-all duration-300">
                  View Store
                </NuxtLink>
              </div>
            </div>

            <!-- Features Section -->
            <div class="sidebar-features">
              <!-- Fast Delivery -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-truck"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Fast Delivery</h6>
                  <p class="text-gray-700 text-sm">Lightning-fast shipping, guaranteed.</p>
                </div>
              </div>

              <!-- Free Returns -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-arrow-u-up-left"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Free 90-day returns</h6>
                  <p class="text-gray-700 text-sm">Shop risk-free with easy returns.</p>
                </div>
              </div>

              <!-- Pickup Available -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Pickup available at Shop location</h6>
                  <p class="text-gray-700 text-sm">Usually ready in 24 hours</p>
                </div>
              </div>

              <!-- Payment -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-credit-card"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Payment</h6>
                  <p class="text-gray-700 text-sm">Payment upon receipt of goods, Payment by card in the department,
                    Google Pay, Online card.</p>
                </div>
              </div>

              <!-- Warranty -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Warranty</h6>
                  <p class="text-gray-700 text-sm">The Consumer Protection Act does not provide for the return of this
                    product of proper quality.</p>
                </div>
              </div>

              <!-- Packaging -->
              <div
                class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300">
                <span
                  class="w-44 h-44 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-package"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Packaging</h6>
                  <p class="text-gray-700 text-sm">Research & development value proposition graphical user interface
                    investor.</p>
                </div>
              </div>
            </div>

            <!-- Enhanced Cart Summary -->
            <div class="p-24 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
              <div class="flex-between items-center mb-20">
                <div class="flex items-center gap-8">
                  <div class="w-8 h-8 bg-main-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ cartItemCount }}</span>
                  </div>
                  <h6 class="text-sm fw-bold text-gray-900">Your Cart</h6>
                </div>
                <button @click="refreshCartSummary" 
                  class="text-xs text-main-600 hover:text-main-800 transition-all duration-200 flex items-center gap-4 px-8 py-4 rounded-full hover:bg-main-50">
                  <i class="ph ph-arrows-clockwise text-sm"></i> 
                  <span>Refresh</span>
                </button>
              </div>

              <div v-if="cartItems.length > 0" class="space-y-4">
                <!-- Cart Items List with Enhanced UI -->
                <div class="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  <div v-for="item in cartItems" :key="item.id"
                    class="cart-item border border-gray-100 rounded-xl p-16 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div class="flex items-start gap-12">
                      <div class="flex-shrink-0">
                        <div class="w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                          <img :src="safeLoadImage(item.image)" :alt="item.name" 
                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy" decoding="async" @error="handleImageError" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex-between items-start">
                          <div class="flex-1">
                            <p class="text-sm font-semibold text-gray-800 line-clamp-2 mb-4">{{ item.name }}</p>
                            <div class="flex items-center gap-8 flex-wrap">
                              <span v-if="item.color" 
                                class="inline-flex items-center gap-4 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getColorHex(item.color) }"></span>
                                {{ item.color }}
                              </span>
                              <span v-if="item.size" 
                                class="px-6 py-2 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                {{ item.size }}
                              </span>
                            </div>
                          </div>
                          <button @click="removeFromCart(item.id)"
                            class="text-gray-400 hover:text-red-500 transition-all duration-200 p-4 rounded-full hover:bg-red-50">
                            <i class="ph ph-trash text-sm"></i>
                          </button>
                        </div>

                        <div class="flex-between items-center mt-12">
                          <div class="flex items-center gap-8">
                            <div class="flex items-center border border-gray-200 rounded-full overflow-hidden">
                              <button @click="updateCartItemQuantity(item.id, -1)" :disabled="item.quantity <= 1"
                                :class="['w-28 h-28 flex-center transition-colors',
                                  item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-gray-600 hover:bg-gray-100']">
                                <i class="ph ph-minus text-sm"></i>
                              </button>
                              <span class="text-sm font-bold w-32 text-center border-x border-gray-200 py-4 bg-gray-50">{{ item.quantity }}</span>
                              <button @click="updateCartItemQuantity(item.id, 1)" 
                                :class="['w-28 h-28 flex-center transition-colors',
                                  'text-main-600 hover:bg-main-100']">
                                <i class="ph ph-plus text-sm"></i>
                              </button>
                            </div>
                          </div>
                          <div class="text-right">
                            <p class="text-sm font-bold text-main-600">₹{{ (item.price * item.quantity).toFixed(2) }}</p>
                            <p v-if="item.quantity > 1" class="text-xs text-gray-500">₹{{ item.price.toFixed(2) }} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Cart Totals -->
                <div class="pt-20 border-t border-gray-200 space-y-3 bg-white rounded-xl p-16">
                  <!-- Savings Badge -->
                  <div v-if="cartSavings > 0" 
                    class="flex items-center justify-between p-12 bg-green-50 border border-green-200 rounded-lg mb-16">
                    <div class="flex items-center gap-8">
                      <i class="ph ph-piggy-bank text-green-600 text-lg"></i>
                      <span class="text-sm font-semibold text-green-700">You're saving!</span>
                    </div>
                    <span class="text-sm font-bold text-green-600">₹{{ cartSavings.toFixed(2) }}</span>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Items ({{ cartItemCount }})</span>
                      <span class="text-sm font-medium">{{ cartItems.length }} products</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Subtotal</span>
                      <span class="text-sm font-semibold">₹{{ cartSubtotal.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Shipping</span>
                      <div class="text-right">
                        <span class="text-sm font-semibold text-green-600">FREE</span>
                        <p class="text-xs text-gray-500">On orders above ₹499</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center pt-12 border-t border-gray-200">
                    <div>
                      <span class="text-sm font-bold text-gray-900">Total</span>
                      <p class="text-xs text-gray-500">Inclusive of all taxes</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xl font-bold text-main-600">₹{{ cartTotalPrice.toFixed(2) }}</span>
                      <p v-if="cartTotalPrice >= 499" class="text-xs text-green-600 font-medium">Free Shipping Applied</p>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-8 mt-16">
                    <NuxtLink to="/cart/cart" 
                      class="btn btn-outline-main w-100 flex items-center justify-center gap-8 py-12 transition-all duration-300 hover:shadow-lg">
                      <i class="ph ph-shopping-cart-simple"></i> 
                      <span>View Cart ({{ cartItemCount }})</span>
                    </NuxtLink>
                    <NuxtLink to="/cart/checkout" 
                      class="btn btn-main w-100 flex items-center justify-center gap-8 py-12 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                      <i class="ph ph-lock-simple"></i> 
                      <span>Secure Checkout</span>
                    </NuxtLink>
                  </div>

                  <!-- Trust Badges -->
                  <div class="flex items-center justify-center gap-16 mt-16 pt-16 border-t border-gray-100">
                    <div class="flex items-center gap-6 text-xs text-gray-500">
                      <i class="ph ph-shield-check text-green-600"></i>
                      <span>Secure</span>
                    </div>
                    <div class="flex items-center gap-6 text-xs text-gray-500">
                      <i class="ph ph-truck text-blue-600"></i>
                      <span>Fast Delivery</span>
                    </div>
                    <div class="flex items-center gap-6 text-xs text-gray-500">
                      <i class="ph ph-arrow-u-up-left text-purple-600"></i>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enhanced Empty Cart -->
              <div v-else class="text-center py-16">
                <div class="mb-16 relative">
                  <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <i class="ph ph-shopping-cart text-4xl text-gray-300"></i>
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h6 class="text-lg font-semibold text-gray-700 mb-8">Your cart is empty</h6>
                <p class="text-sm text-gray-500 mb-16">Add items to get started!</p>
                <div class="space-y-8">
                  <button @click="addToCart" 
                    :disabled="!selectedVariant || (selectedVariant?.stock || mainProduct.stock) <= 0"
                    :class="['btn btn-main w-100 transition-all duration-300',
                      !selectedVariant || (selectedVariant?.stock || mainProduct.stock) <= 0 ? 'btn-secondary' : 'hover:shadow-lg hover:-translate-y-0.5']">
                    <i class="ph ph-plus-circle me-2"></i> 
                    Add This Product to Cart
                  </button>
                </div>
              </div>
            </div>

            <!-- Variants Summary -->
            <div v-if="variants.length > 0" class="p-24 border-t border-gray-100">
              <h6 class="text-sm mb-16 fw-semibold text-gray-900">Available Variants</h6>
              <div class="space-y-3 max-h-200 overflow-y-auto pr-2">
                <div v-for="variant in variants" :key="variant.id" @click="selectVariant(variant)" :class="[
                  'variant-item p-12 rounded-lg border cursor-pointer transition-all duration-300',
                  selectedVariant?.id === variant.id
                    ? 'border-main-600 bg-main-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]">
                  <div class="flex-between items-center">
                    <div>
                      <div class="flex-align gap-2 mb-2">
                        <span class="text-xs text-gray-600">SKU:</span>
                        <span class="text-xs font-medium">{{ variant.sku }}</span>
                      </div>
                      <div class="flex-align gap-2">
                        <span class="text-xs text-gray-600">Color:</span>
                        <span class="text-xs font-medium">{{ variant.color?.name || variant.color }}</span>
                        <span class="text-xs text-gray-400 mx-2">•</span>
                        <span class="text-xs text-gray-600">Size:</span>
                        <span class="text-xs font-medium">{{ variant.size?.name || variant.size }}</span>
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
            <div
              class="bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-12 flex-align gap-8 hover:from-green-100 hover:to-emerald-100 hover:text-green-700 transition-all duration-300 border border-green-200">
              <img :src="safeLoadImage('/assets/images/icon/satisfaction-icon.png')" alt="Satisfaction Guaranteed"
                class="w-24 h-24" loading="lazy" decoding="async" @error="handleImageError" />
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
                    <span v-if="mainProduct.subCategory" class="badge bg-black text-white border border-black">
                      {{ mainProduct.subCategory.name }}
                    </span>
                    <span v-if="mainProduct.subSubCategory" class="badge bg-black text-white border border-black">
                      {{ mainProduct.subSubCategory.name }}
                    </span>
                  </div>
                </div>

                <!-- Product Information -->
                <div class="mt-40">
                  <h6 class="mb-24 fw-bold">Product Information</h6>
                  <ul class="mt-32">
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        SKU: <span class="text-gray-500">{{ selectedVariant?.sku || mainProduct.sku }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Barcode: <span class="text-gray-500">{{ mainProduct.barcode || 'N/A' }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Unit: <span class="text-gray-500">{{ mainProduct.unit?.name }} ({{ mainProduct.unit?.shortName
                          }})</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.manufacturedDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Manufactured: <span class="text-gray-500">{{ formatDate(mainProduct.manufacturedDate) }}</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.expiryDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Expiry: <span class="text-gray-500">{{ formatDate(mainProduct.expiryDate) }}</span>
                      </span>
                    </li>
                    <li v-if="mainProduct.origin" class="text-gray-400 mb-14 flex-align gap-14">
                      <span
                        class="w-20 h-20 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 text-xs flex-center rounded-full shadow-sm">
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

                <div v-if="selectedVariant"
                  class="mb-32 p-24 border border-gray-100 rounded-16 bg-gradient-to-r from-gray-50 to-white">
                  <h6 class="text-md fw-semibold mb-16">Selected Variant</h6>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
                    <!-- Basic Attributes -->
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <div class="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                          <img :src="safeLoadImage(getColorFirstImage(selectedVariant.color?.name || selectedVariant.color))"
                            :alt="selectedVariant.color?.name || selectedVariant.color" class="w-full h-full object-cover" loading="lazy"
                            decoding="async" @error="handleImageError" />
                        </div>
                        <div>
                          <span class="text-gray-500 text-sm">Color:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.color?.name || selectedVariant.color }}</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-3">
                        <span
                          class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-full flex-center text-xs shadow-sm">
                          <i class="ph ph-ruler"></i>
                        </span>
                        <div>
                          <span class="text-gray-500 text-sm">Size:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.size?.name || selectedVariant.size }}</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-3">
                        <span
                          class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-full flex-center text-xs shadow-sm">
                          <i class="ph ph-fabric"></i>
                        </span>
                        <div>
                          <span class="text-gray-500 text-sm">SKU:</span>
                          <span class="text-gray-800 font-medium ml-2">{{ selectedVariant.sku }}</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-3">
                        <span
                          class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-full flex-center text-xs shadow-sm">
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
                        <p class="text-main-600 font-medium">₹{{ discountedPrice }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- All Variants -->
                <div v-if="variants.length > 0">
                  <h6 class="text-md fw-semibold mb-16">All Variants</h6>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                    <div v-for="variant in variants" :key="variant.id"
                      class="border border-gray-200 rounded-lg p-16 hover:border-gray-300 transition-colors">
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
                        <span class="badge bg-blue-100 text-blue-800">{{ variant.color?.name || variant.color }}</span>
                        <span class="badge bg-green-100 text-green-800">{{ variant.size?.name || variant.size }}</span>
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

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/pagination'

/* ----------------------------------
   ROUTE
-----------------------------------*/

const route = useRoute()
const styleGroupId = computed(() => route.params.groupId as string)

/* ----------------------------------
   API
-----------------------------------*/

const { data, loading, error } = useProductGroupApi(styleGroupId)

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
    return selectedVariant.value.images.map((i: any) => safeLoadImage(i.imageUrl))
  }

  // Second try: Main product images
  if (mainProduct.value?.images?.length) {
    return mainProduct.value.images.map((i: any) => safeLoadImage(i.imageUrl))
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
const FALLBACK_IMAGE = '/assets/images/placeholder.jpg'

// Safe image loading with error handling
const safeLoadImage = (src: string, fallback: string = FALLBACK_IMAGE): string => {
  if (!src || src.trim() === '') return fallback
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
    img.src = safeLoadImage(imageObj.imageUrl)
  })
}

const preloadColorImages = (colorName: string) => {
  const colorVariants = variants.value.filter(v => v.color?.name === colorName)
  // Preload only first image of each variant for color switching
  colorVariants.forEach(variant => {
    if (variant.images?.[0]?.imageUrl) {
      const img = new Image()
      img.src = safeLoadImage(variant.images[0].imageUrl)
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

const getClothingSizes = () => ['XS', 'S', 'M', 'L', 'XL', 'XXL']
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
const getColorFirstImage = (colorName: string) => {
  const color = mainProduct.value?.colors?.find((c: any) => c.name === colorName)
  return color?.imageUrl || '/assets/images/placeholder.jpg'
}

// Utility functions
const formatDate = (date: string) => new Date(date).toLocaleDateString()

const calculateAverageRating = () => {
  if (!mainProduct.value?.reviews?.length) return 0
  const sum = mainProduct.value.reviews.reduce((acc: number, review: any) => acc + review.rating, 0)
  return Number((sum / mainProduct.value.reviews.length).toFixed(1))
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

const toggleWishlist = () => {
  // Wishlist toggle logic
}

const isInWishlist = computed(() => false) // Simplified for now

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

const updateCartItemQuantity = (itemId: number, newQuantity: number) => {
  const cart = cartItems.value.map(item =>
    item.id === itemId ? { ...item, quantity: newQuantity } : item
  )
  saveCart(cart)
}

const submitReview = () => {
  // Review submission logic
  console.log('Review submitted:', { rating: rating.value, title: reviewTitle.value, content: reviewContent.value })
}

const addToCart = () => {
  if (!selectedVariant.value) return

  const cart = [...cartItems.value]

  const existing = cart.find(
    item =>
      item.productId === mainProduct.value.id &&
      item.variantId === selectedVariant.value.id
  )

  if (existing) {
    existing.quantity += quantity.value
  } else {
    cart.push({
      id: Date.now(),
      productId: mainProduct.value.id,
      variantId: selectedVariant.value.id,
      name: mainProduct.value.name,
      price: discountedPrice.value,
      quantity: quantity.value,
      image: mainImages.value[0]
    })
  }

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

onMounted(() => {
  loadCartFromStorage()

  window.addEventListener('storage', (event) => {
    if (event.key === 'shopping_cart') {
      loadCartFromStorage()
    }
  })
})
</script>

<style scoped>
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
