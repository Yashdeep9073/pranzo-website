<template>
  <!-- Skeleton Loading -->
  <div v-if="showInitialLoading" class="skeleton-container">
    <div class="container container-lg pt-80">
      <div class="row">
        <!-- Sidebar Skeleton -->
        <div class="col-lg-3 d-none d-lg-block">
          <div class="skeleton-sidebar">
            <div class="skeleton-card mb-32" v-for="n in 3" :key="n">
              <div class="skeleton-title mb-24 shimmer"></div>
              <div class="skeleton-item mb-16 shimmer" v-for="i in 4" :key="i"></div>
            </div>
          </div>
        </div>

        <!-- Content Skeleton -->
        <div class="col-lg-9">
          <!-- Top Bar -->
          <div class="skeleton-topbar mb-40">
            <div class="skeleton-text shimmer" style="width: 200px;"></div>
            <div class="skeleton-controls">
              <div class="skeleton-button shimmer" style="width: 100px;"></div>
              <div class="skeleton-button shimmer" style="width: 120px;"></div>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="row g-24">
            <div v-for="n in 8" :key="n" class="col-xl-3 col-lg-4 col-md-6">
              <div class="skeleton-product-card">
                <div class="skeleton-image shimmer mb-16"></div>
                <div class="skeleton-line shimmer mb-8"></div>
                <div class="skeleton-line shimmer mb-8" style="width: 60%;"></div>
                <div class="skeleton-line shimmer mb-12" style="width: 80%;"></div>
                <div class="skeleton-line shimmer mb-16" style="width: 40%;"></div>
                <div class="skeleton-button shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <section v-show="!showInitialLoading" class="shop py-80">
    <!-- Mobile Filter Overlay -->
    <div v-if="showMobileSidebar" class="mobile-filter-overlay d-lg-none" @click="closeMobileSidebar"></div>

    <!-- Mobile Filter Sheet -->
    <div v-if="showMobileSidebar" class="mobile-filter-sheet d-lg-none" :class="{ 'show': showMobileSidebar }">
      <div class="filter-sheet-header">
        <h6>Filters</h6>
        <button class="close-filter-btn" @click="closeMobileSidebar">
          <i class="ph ph-x"></i>
        </button>
      </div>

      <div class="filter-sheet-content">
        <!-- Active Filters Summary -->
        <div v-if="hasActiveFilters" class="mobile-active-filters">
          <div class="active-filters-chips">
            <span v-for="filter in getMobileFilterChips()" :key="filter.key" class="mobile-filter-chip">
              {{ filter.label }}
              <i class="ph ph-x" @click="filter.clearFn"></i>
            </span>
          </div>
          <button class="clear-all-mobile" @click="clearAllFilters" :disabled="isLoading">
            Clear All
          </button>
        </div>

        <!-- Mobile Filter Options -->
        <div class="mobile-filter-options">
          <!-- Sort Options -->
          <div class="mobile-filter-section">
            <h6>Sort By</h6>
            <div class="mobile-sort-options">
              <button v-for="option in sortOptions" :key="option.value"
                :class="{ 'active': filters.sortBy === option.value }" @click="selectSortOptionMobile(option.value)"
                :disabled="isLoading">
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Category Filters -->
          <div class="mobile-filter-section" v-if="categories.length > 0">
            <div class="flex-between mb-12">
              <h6>Category</h6>
              <button v-if="filters.category" @click="clearCategoryFilter" class="btn-clear" :disabled="isLoading">
                Clear
              </button>
            </div>
            <div class="mobile-quick-filters">
              <button :class="{ 'active': !filters.category }" @click="clearCategoryFilter" :disabled="isLoading">
                All
              </button>
              <button v-for="category in categories.slice(0, 5)" :key="category.id"
                :class="{ 'active': filters.category === category.name }" @click="toggleCategoryFilter(category.name)"
                :disabled="isLoading">
                {{ category.name }}
              </button>
              <NuxtLink to="/shop/shop-all" class="view-all-link" v-if="categories.length > 5">
                View All
              </NuxtLink>
            </div>
          </div>
          <!-- Size Filters -->
          <h6 class="text-black text-lg font-bold pb-10">Sizes</h6>
          <div class="size-filters pb-10">
            <button class="size-btn" :class="{
              'size-btn-active': !filters.size
            }" @click="clearSizeFilter" :disabled="isLoading">
              All Sizes
            </button>
            <button v-for="size in sizes" :key="size.id" class="size-btn" :class="{
              'size-btn-active': filters.size === size.size
            }" @click="toggleSizeFilter(size.size)" :disabled="isLoading">
              {{ size.size }}
            </button>
          </div>
          <!-- Price Range -->
          <div class="mobile-price-range">
            <div class="price-display">
              <span>₹{{ formatPrice(priceRange.min) }}</span>
              <span class="separator">-</span>
              <span>₹{{ formatPrice(priceRange.max) }}</span>
            </div>

            <div class="range-slider-wrapper">
              <!-- MIN -->
              <input type="range" :min="0" :max="defaultMaxPrice" :step="100" v-model.number="priceRange.min"
                @input="syncLivePrice" @change="applyPriceFilter" :disabled="isLoading" class="range-slider" />

              <!-- MAX -->
              <input type="range" :min="0" :max="defaultMaxPrice" :step="100" v-model.number="priceRange.max"
                @input="syncLivePrice" @change="applyPriceFilter" :disabled="isLoading" class="range-slider" />
            </div>
          </div>
          <!-- Color Filters -->
          <div class="mobile-filter-section" v-if="colors.length > 0">
            <div class="flex-between mb-12">
              <h6>Color</h6>
              <button v-if="filters.color" @click="clearColorFilter" class="btn-clear" :disabled="isLoading">
                Clear
              </button>
            </div>
            <div class="mobile-color-filters">
              <button :class="{ 'active': !filters.color }" @click="clearColorFilter" :disabled="isLoading">
                All
              </button>
              <button v-for="color in colors.slice(0, 6)" :key="color" :class="{ 'active': filters.color === color }"
                @click="toggleColorFilter(color)" :disabled="isLoading" class="color-filter-btn">
                <span class="color-dot-mobile" :style="{ backgroundColor: getColorHex(color) }"></span>
                <span>{{ color }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-sheet-actions">
        <button class="btn-apply-filters" @click="applyMobileFilters" :disabled="isLoading">
          Apply Filters ({{ pagination.total }} products)
        </button>
      </div>
    </div>

    <!-- Mobile Filter Toggle Bar -->
    <div class="mobile-filter-toggle-bar d-lg-none">
      <div class="container container-lg">
        <div class="mobile-filter-summary ">
          <span class="product-count">
            {{ pagination.total || 0 }} products
          </span>
          <span v-if="hasActiveFilters" class="active-filter-count">
            ({{ getActiveFilterCount() }} active)
          </span>
        </div>
        <div class="mobile-filter-buttons">
          <div class="custom-dropdown-mobile">
            <button class="mobile-sort-btn" @click="toggleSortDropdownMobile" :disabled="isLoading">
              <i class="ph ph-arrow-up-down"></i>
              <span>{{ getSortLabel(filters.sortBy) }}</span>
            </button>
            <div v-if="isSortDropdownOpenMobile" class="sort-dropdown-mobile">
              <button v-for="option in sortOptions" :key="option.value"
                :class="{ 'active': filters.sortBy === option.value }" @click="selectSortOption(option.value)"
                :disabled="isLoading">
                {{ option.label }}
              </button>
            </div>
          </div>
          <button class="mobile-filter-btn" @click="toggleMobileSidebar" :disabled="isLoading">
            <i class="ph ph-funnel"></i>
            <span>Filters</span>
            <span v-if="hasActiveFilters" class="filter-indicator"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="container container-lg">
      <div class="row">
        <!-- Desktop Sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <div class="shop-sidebar">
            <!-- Product Category -->
            <div v-if="categories.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Product Category</h6>
                <button v-if="filters.category" @click="clearCategoryFilter" class="btn-clear" :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input type="radio" name="categoryFilter" id="category-all" :checked="!filters.category"
                      @change="clearCategoryFilter" :disabled="isLoading">
                    <label for="category-all">
                      <span>All Categories</span>
                    </label>
                  </div>
                </li>
                <li v-for="category in categories" :key="category.id" class="mb-16">
                  <div class="form-check">
                    <input type="radio" name="categoryFilter" :id="`category-${category.id}`"
                      :checked="filters.category === category.name" @change="toggleCategoryFilter(category.name)"
                      :disabled="isLoading">
                    <label :for="`category-${category.id}`">
                      <span>{{ category.name }}</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Brand -->
            <div v-if="brands.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Brand</h6>
                <button v-if="filters.brand" @click="clearBrandFilter" class="btn-clear" :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input type="radio" name="brandFilter" id="brand-all" :checked="!filters.brand"
                      @change="clearBrandFilter" :disabled="isLoading">
                    <label for="brand-all">
                      <div>
                        <span>All Brands</span>
                      </div>
                    </label>
                  </div>
                </li>
                <li v-for="brand in brands" :key="brand.id" class="mb-16">
                  <div class="form-check">
                    <input type="radio" name="brandFilter" :id="`brand-${brand.id}`"
                      :checked="filters.brand === brand.name" @change="toggleBrandFilter(brand.name)"
                      :disabled="isLoading">
                    <label :for="`brand-${brand.id}`">
                      <div>
                        <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" class="brand-logo" loading="lazy"
                          @error="handleBrandImageError">
                        <span>{{ brand.name }}</span>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Price -->
            <div class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Price</h6>
                <button v-if="isPriceFilterApplied" @click="resetPriceFilter" class="btn-clear" :disabled="isLoading">
                  Clear
                </button>
              </div>

              <div class="mb-24">
                <p class="price-range-text">
                  Price Range: ₹{{ formatPrice(filters.minPrice) }} - ₹{{ formatPrice(filters.maxPrice) }}
                </p>

                <div class="mb-16">
                  <label>Min Price: ₹{{ formatPrice(filters.minPrice) }}</label>
                  <input type="range" :min="0" :max="defaultMaxPrice" v-model.number="priceRange.min"
                    @change="applyPriceFilter" :step="100" :disabled="isLoading">
                </div>

                <div class="mb-24">
                  <label>Max Price: ₹{{ formatPrice(filters.maxPrice) }}</label>
                  <input type="range" :min="0" :max="defaultMaxPrice" v-model.number="priceRange.max"
                    @change="applyPriceFilter" :step="100" :disabled="isLoading">
                </div>
              </div>
            </div>

            <!-- Filter by Color -->
            <div v-if="colors.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Color</h6>
                <button v-if="filters.color" @click="clearColorFilter" class="btn-clear" :disabled="isLoading">
                  Clear
                </button>
              </div>
              <ul class="scroll-list">
                <li class="mb-16">
                  <div class="form-check">
                    <input type="checkbox" name="colorFilter" id="color-all" :checked="!filters.color"
                      @change="clearColorFilter" :disabled="isLoading">
                    <label for="color-all">
                      <div>
                        <span class="color-indicator"></span>
                        <span>All Colors</span>
                      </div>
                    </label>
                  </div>
                </li>
                <li v-for="color in colors" :key="color" class="mb-16">
                  <div class="form-check">
                    <input type="checkbox" name="colorFilter" :id="`color-${color}`" :checked="filters.color === color"
                      @change="toggleColorFilter(color)" :disabled="isLoading">
                    <label :for="`color-${color}`">
                      <div>
                        <span class="color-indicator" :style="{ backgroundColor: getColorHex(color) }"></span>
                        <span>{{ color }}</span>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Size -->
            <div v-if="sizes.length > 0" class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Filter by Size</h6>
                <button v-if="filters.size" @click="clearSizeFilter" class="btn-clear" :disabled="isLoading">
                  Clear
                </button>
              </div>
              <div class="size-filters">
                <button class="size-btn" :class="{
                  'size-btn-active': !filters.size
                }" @click="clearSizeFilter" :disabled="isLoading">
                  All Sizes
                </button>
                <button v-for="size in sizes" :key="size.id" class="size-btn" :class="{
                  'size-btn-active': filters.size === size.size
                }" @click="toggleSizeFilter(size.size)" :disabled="isLoading">
                  {{ size.size }}
                </button>
              </div>
            </div>

            <!-- Sort By -->
            <div class="shop-sidebar__box mb-32">
              <div class="flex-between mb-24">
                <h6>Sort By</h6>
                <button v-if="filters.sortBy !== 'popularity'" @click="clearSortFilter" class="btn-clear"
                  :disabled="isLoading">
                  Reset
                </button>
              </div>
              <ul class="scroll-list">
                <li v-for="option in sortOptions" :key="option.value" class="mb-16">
                  <div class="form-check">
                    <input type="radio" name="sortFilter" :id="`sort-${option.value}`"
                      :checked="filters.sortBy === option.value" @change="selectSortFilter(option.value)"
                      :disabled="isLoading">
                    <label :for="`sort-${option.value}`">
                      <span>{{ option.label }}</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Clear All Filters -->
            <div class="clear-filter-box mb-32">
              <button @click="clearAllFilters" :disabled="!hasActiveFilters || isLoading" class="clear-btn">
                <i class="ph ph-x"></i>
                Clear All Filters
              </button>
            </div>

            <!-- Advertise -->
            <div class="advertise-box">
              <img src="/assets/images/thumbs/advertise-img1.png" alt="Advertisement" loading="lazy"
                @error="handleImageError">
            </div>
          </div>
        </div>

        <!-- Content Start -->
        <div class="col-lg-9 col-12">
          <!-- Desktop Top Bar -->
          <div class="product-topbar d-none d-lg-flex">
            <div class="topbar-info">
              <span class="count-text">
                Showing {{ pagination.from || 0 }}-{{ pagination.to || 0 }} of {{ pagination.total || 0 }} products
              </span>
              <span v-if="filters.category" class="active-filter-tag">
                in {{ filters.category }}
              </span>
              <span v-if="filters.brand" class="active-filter-tag">
                from {{ filters.brand }}
              </span>
              <span v-if="filters.color" class="active-filter-tag">
                color: {{ filters.color }}
              </span>
              <span v-if="filters.size" class="active-filter-tag">
                size: {{ filters.size }}
              </span>
            </div>

            <div class="topbar-actions">
              <!-- View Toggle -->
              <div class="view-toggle">
                <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" :disabled="isLoading">
                  <i class="ph ph-squares-four"></i>
                </button>
                <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" :disabled="isLoading">
                  <i class="ph-bold ph-list-dashes"></i>
                </button>
              </div>

              <!-- Sort Dropdown -->
              <div class="custom-dropdown d-none d-lg-block">
                <button class="custom-btn" @click="toggleSortDropdown" :disabled="isLoading">
                  <i class="ph ph-arrow-up-down"></i>
                  <span>Sort by: {{ getSortLabel(filters.sortBy) }}</span>
                  <i class="arrow" :class="{ open: isSortDropdownOpen }">▼</i>
                </button>

                <ul v-if="isSortDropdownOpen" class="custom-menu">
                  <li v-for="option in sortOptions" :key="option.value">
                    <button :class="{ active: filters.sortBy === option.value }" @click="selectSortOption(option.value)"
                      :disabled="isLoading">
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Mobile Sidebar Filter -->
              <button class="mobile-filter-btn d-lg-none" @click="toggleMobileSidebar" :disabled="isLoading">
                <i class="ph-bold ph-funnel-simple"></i>
                <span v-if="hasActiveFilters" class="filter-badge"></span>
              </button>
            </div>
          </div>

          <!-- Active Filters Bar -->
          <div v-if="hasActiveFilters" class="active-filters-bar">
            <div class="filters-header">
              <div class="title">
                <i class="ph ph-funnel"></i>
                <span>Active Filters</span>
              </div>

              <div class="actions">
                <button class="link-btn" @click="copyURLToClipboard" :disabled="isLoading">
                  <i class="ph ph-copy"></i>
                  Copy link
                </button>

                <button class="clear-all" @click="clearAllFilters" :disabled="isLoading">
                  Clear all
                </button>
              </div>
            </div>

            <div class="filters-chips">
              <!-- Category -->
              <button v-if="filters.category" class="chip" @click="clearCategoryFilter" :disabled="isLoading">
                {{ filters.category }}
                <i class="ph ph-x"></i>
              </button>

              <!-- Brand -->
              <button v-if="filters.brand" class="chip" @click="clearBrandFilter" :disabled="isLoading">
                <img v-if="getBrandLogo(filters.brand)" :src="getBrandLogo(filters.brand)" class="chip-logo"
                  loading="lazy" @error="handleChipImageError" />
                {{ filters.brand }}
                <i class="ph ph-x"></i>
              </button>

              <!-- Color -->
              <button v-if="filters.color" class="chip" @click="clearColorFilter" :disabled="isLoading">
                <span class="color-dot" :style="{ backgroundColor: getColorHex(filters.color) }"></span>
                {{ filters.color }}
                <i class="ph ph-x"></i>
              </button>

              <!-- Size -->
              <button v-if="filters.size" class="chip" @click="clearSizeFilter" :disabled="isLoading">
                Size: {{ filters.size }}
                <i class="ph ph-x"></i>
              </button>

              <!-- Price -->
              <button v-if="isPriceFilterApplied" class="chip" @click="resetPriceFilter" :disabled="isLoading">
                ₹{{ formatPrice(filters.minPrice) }} – ₹{{ formatPrice(filters.maxPrice) }}
                <i class="ph ph-x"></i>
              </button>
            </div>
          </div>

          <!-- Products -->
          <div>
            <!-- Products Grid/List -->
            <div v-if="products.length > 0">
              <!-- Grid View -->
              <div v-if="viewMode === 'grid'" class="product-grid">
                <div v-for="product in products" :key="product.groupId" class="product-card">
                  <!-- Product Image -->
                  <div class="product-image">
                    <NuxtLink :to="getProductLink(product)">
                      <div v-if="!hasImage(product)" class="no-image">
                        <i class="ph ph-image"></i>
                        <span>No image available</span>
                      </div>
                      <img v-else :src="getPrimaryImage(product)" :alt="getProductName(product)" loading="lazy"
                        @error="handleProductImageError">

                      <!-- Badges -->
                      <div class="product-badges">
                        <span v-if="getDiscountValue(product) > 0" class="discount-badge">
                          -{{ getDiscountValue(product) }}%
                        </span>
                        <span v-if="isProductNew(product)" class="new-badge">
                          New
                        </span>
                      </div>
                    </NuxtLink>
                    <!-- Quick Actions -->
                    <div class="product-actions">
                      <button @click="addToWishlist(product)" title="Add to Wishlist" :disabled="isLoading">
                        <i class="ph ph-heart" :class="{ 'in-wishlist': isInWishlist(product) }"></i>
                      </button>
                      <!-- <button @click="quickView(product)" title="Quick View" :disabled="isLoading">
                        <i class="ph ph-eye"></i>
                      </button> -->
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="product-info">
                    <div class="product-meta">
                      <span class="product-category">{{ getProductCategory(product) || 'General' }}</span>
                      <span v-if="getProductBrand(product)" class="product-brand">
                        {{ getProductBrand(product) }}
                      </span>
                    </div>

                    <div class="product-title-section">
                      <NuxtLink :to="getProductLink(product)" class="product-link">
                        <h2 class="product-title">
                          {{ truncateText(getProductName(product), 16) }}
                        </h2>

                        <!-- <p class="product-description">
                          {{ product.mainProduct?.description || '' }}
                        </p> -->

                        <div v-if="getProductColor(product) || getProductSize(product)" class="variant-info">
                          <span v-if="getProductColor(product)" class="variant-chip">
                            <span class="color-dot"
                              :style="{ backgroundColor: getColorHex(getProductColor(product)) }"></span>
                            {{ getProductColor(product) }}
                          </span>
                          <span v-if="getProductSize(product)" class="variant-chip size-chip">
                            Size {{ getProductSize(product) }}
                          </span>
                          <span class="review-badge">
                            <i class="ph ph-eye-bold"></i>
                            {{ (getReviewCount(product) || 12) + Math.floor(Math.random() * 5) + 1 }} Reviews
                          </span>
                        </div>
                      </NuxtLink>
                    </div>

                    <!-- Rating -->
                    <div class="product-rating">
                      <div class="stars">
                        <i v-for="star in 5" :key="star" :class="{
                          'filled': star <= Math.round(getProductRating(product)),
                          'empty': star > Math.round(getProductRating(product))
                        }"></i>
                      </div>
                    </div>

                    <!-- Price -->
                    <div class="product-price">
                      <span class="current-price">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                      <span v-if="getDiscountValue(product) > 0" class="original-price">
                        ₹{{ formatPrice(getOriginalPrice(product)) }}
                      </span>
                      <span v-if="getDiscountValue(product) > 0" class="save-badge">
                        Save {{ getDiscountValue(product) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- List View -->
              <div v-else class="list-view">
                <div v-for="product in products" :key="product.groupId" class="product-list-item">
                  <div class="list-item-content">
                    <div class="list-image">
                      <NuxtLink :to="getProductLink(product)">
                        <div v-if="!hasImage(product)" class="no-image">
                          <i class="ph ph-image"></i>
                        </div>
                        <img v-else :src="getPrimaryImage(product)" :alt="getProductName(product)" loading="lazy"
                          @error="handleProductImageError">
                      </NuxtLink>
                    </div>
                    <div class="list-details">
                      <h3>
                        <NuxtLink :to="getProductLink(product)">
                          {{ truncateText(getProductName(product), 70) }}
                        </NuxtLink>
                      </h3>

                      <div class="list-meta">
                        <div v-if="getProductColor(product)" class="color-meta">
                          <span class="color-indicator-sm"
                            :style="{ backgroundColor: getColorHex(getProductColor(product)) }"></span>
                          <span>{{ getProductColor(product) }}</span>
                        </div>
                        <span v-if="getProductBrand(product)">Brand: {{ getProductBrand(product) }}</span>
                        <span v-if="getProductSize(product)">Size: {{ getProductSize(product) }}</span>
                      </div>

                      <div class="list-price">
                        <span class="current-price">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                        <span v-if="getDiscountValue(product) > 0" class="original-price">
                          ₹{{ formatPrice(getOriginalPrice(product)) }}
                        </span>
                        <span v-if="getDiscountValue(product) > 0" class="save-badge">
                          Save {{ getDiscountValue(product) }}%
                        </span>
                      </div>

                      <div class="list-actions">
                        <button @click="addToCart(product)" :disabled="getProductStock(product) === 0 || isLoading"
                          class="btn-add-cart" :class="{ 'out-of-stock': getProductStock(product) === 0 }">
                          <i class="ph ph-shopping-cart"></i>
                          <span>{{ getProductStock(product) === 0 ? 'Out of Stock' : 'Add to Cart' }}</span>
                        </button>

                        <button @click="addToWishlist(product)" class="btn-wishlist" :disabled="isLoading">
                          <i class="ph ph-heart" :class="{ 'in-wishlist': isInWishlist(product) }"></i>
                          <span>{{ isInWishlist(product) ? 'In Wishlist' : 'Wishlist' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="pagination.lastPage > 1" class="pagination-container">
                <div class="pagination">
                  <button @click="goToPage(filters.page - 1)" :disabled="filters.page === 1 || isLoading"
                    class="pagination-btn prev">
                    <i class="ph-bold ph-arrow-left"></i>
                  </button>

                  <button v-for="page in getVisiblePages()" :key="page" @click="page !== '...' && goToPage(page)"
                    :disabled="page === '...' || isLoading" class="pagination-btn" :class="{
                      'active': page === filters.page,
                      'disabled': page === '...'
                    }">
                    {{ page }}
                  </button>

                  <button @click="goToPage(filters.page + 1)"
                    :disabled="filters.page === pagination.lastPage || isLoading" class="pagination-btn next">
                    <i class="ph-bold ph-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- No Products Found -->
            <div v-else class="no-products">
              <div>
                <i class="ph ph-magnifying-glass"></i>
              </div>
              <h4>No products found</h4>
              <p>Try adjusting your filters or search criteria</p>
              <button @click="clearAllFilters" class="btn-clear-filters" :disabled="isLoading">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toKebabCase } from '~/utlis/toKebabCase'
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '~/store/useProductStore'
import { encodeId } from '~/utlis/encode'
import { useWishlistStore } from '~/store/useWishlistStore'
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()

// Local state
const viewMode = ref('grid')
const showMobileSidebar = ref(false)
const isSortDropdownOpen = ref(false)
const isSortDropdownOpenMobile = ref(false)
const showInitialLoading = ref(true)
const priceRange = ref({ min: 0, max: 50000 })

// Sort options
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'brand', label: 'Brand Name (A-Z)' }
]

// Computed properties
const isLoading = computed(() => productStore.isLoading)
const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)
const colors = computed(() => productStore.colors)
const sizes = computed(() => productStore.sizes)
const brands = computed(() => productStore.brands)
const pagination = computed(() => productStore.pagination)
const filters = computed(() => productStore.filters)
const hasActiveFilters = computed(() => productStore.hasActiveFilters)
const defaultMaxPrice = computed(() => productStore.defaultMaxPrice || 50000)
const isPriceFilterApplied = computed(() => {
  const f = filters.value
  return f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value
})

// Helper functions
const hasImage = (product) => {
  const imageUrl = productStore.getProductImage(product)
  return imageUrl && imageUrl !== '/assets/images/placeholder.jpg'
}

const syncLivePrice = () => {
  filters.value.minPrice = priceRange.value.min
  filters.value.maxPrice = priceRange.value.max
}

const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}

// Image error handling with fallback images
const handleProductImageError = (event) => {
  // Try fallback images from recommended folder
  const recommendedImages = [
    'camera.webp',
    'women_wear.png',
    'highheels.png',
    'women purse.webp',
    'gaming remote.webp',
    'headphones.webp',
    'mens-collection.webp',
    'women-collection.webp',
    'shoe.webp',
    'triple-jean.jpg',
    'women wear.webp',
    'pixel-perfect-camera.webp',
    'kids-wear.webp'
  ]

  // Get a random recommended image
  const randomImage = recommendedImages[Math.floor(Math.random() * recommendedImages.length)]
  event.target.src = `/assets/images/recommended/${randomImage}`

  // Add error handling for the fallback image too
  event.target.onerror = () => {
    event.target.src = '/assets/images/placeholder.jpg'
  }
}

const handleImageError = (event) => {
  const fallbackImages = [
    '/assets/images/recommended/camera.webp',
    '/assets/images/recommended/women_wear.png',
    '/assets/images/recommended/highheels.png',
    '/assets/images/recommended/women purse.webp',
    '/assets/images/recommended/gaming remote.webp',
    '/assets/images/placeholder.jpg'
  ]

  // Try different fallback images
  const currentSrc = event.target.src
  const currentIndex = fallbackImages.findIndex(img => currentSrc.includes(img))
  const nextIndex = (currentIndex + 1) % fallbackImages.length

  event.target.src = fallbackImages[nextIndex]
}

const handleBrandImageError = (event) => {
  // Fallback brand logo
  event.target.src = '/assets/images/brands/placeholder.png'
}

const handleChipImageError = (event) => {
  // Remove the broken image from chip
  event.target.style.display = 'none'
}

const getProductColor = (product) => productStore.getProductColor(product)
const getProductSize = (product) => productStore.getProductSize(product)
const getProductRating = (product) => productStore.getProductRating(product) || 3.5
const getReviewCount = (product) => productStore.getReviewCount(product) || Math.floor(Math.random() * 100) + 1
const getPrimaryImage = (product) => productStore.getProductImage(product)
const getDiscountedPrice = (product) => productStore.getDiscountedPrice(product)
const getOriginalPrice = (product) => productStore.getOriginalPrice(product)
const getDiscountValue = (product) => product.mainProduct?.discountValue || 0
const getProductName = (product) => productStore.getProductName(product)
const getProductId = (product) => productStore.getProductId(product)
const getProductStock = (product) => productStore.getProductStock(product)
const getProductCategory = (product) => productStore.getProductCategory(product)
const getProductBrand = (product) => productStore.getProductBrand(product)
const getColorHex = (colorName) => productStore.getColorHex(colorName) || '#007bff'
const getBrandLogo = (brandName) => {
  const brand = brands.value.find(b => b.name === brandName)
  return brand?.logo || null
}
const getSortLabel = (sortType) => sortOptions.find(opt => opt.value === sortType)?.label || 'Most Popular'

const isProductNew = (product) => {
  const mainProduct = product.mainProduct
  if (!mainProduct?.createdAt) return false
  const createdDate = new Date(mainProduct.createdAt)
  const now = new Date()
  const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

const getProductLink = (product) => {
  const productName = toKebabCase(getProductName(product))
  const productId = encodeId(getProductId(product))
  const productColor = getProductColor(product)

  let url = `/shop/shop-all/${productName}--${product.groupId}`

  if (productColor) {
    url += `?color=${encodeURIComponent(productColor)}`
  }

  return url
}

// Mobile-specific functions
const getMobileFilterChips = () => {
  const chips = []
  const f = filters.value

  if (f.category) {
    chips.push({
      key: 'category',
      label: f.category,
      clearFn: clearCategoryFilter
    })
  }

  if (f.brand) {
    chips.push({
      key: 'brand',
      label: f.brand,
      clearFn: clearBrandFilter
    })
  }

  if (f.color) {
    chips.push({
      key: 'color',
      label: f.color,
      clearFn: clearColorFilter
    })
  }

  if (f.size) {
    chips.push({
      key: 'size',
      label: `Size: ${f.size}`,
      clearFn: clearSizeFilter
    })
  }

  if (isPriceFilterApplied.value) {
    chips.push({
      key: 'price',
      label: `₹${formatPrice(f.minPrice)}-₹${formatPrice(f.maxPrice)}`,
      clearFn: resetPriceFilter
    })
  }

  return chips
}

const getActiveFilterCount = () => {
  let count = 0
  const f = filters.value

  if (f.category) count++
  if (f.brand) count++
  if (f.color) count++
  if (f.size) count++
  if (isPriceFilterApplied.value) count++

  return count
}

const selectSortOptionMobile = (value) => {
  selectSortFilter(value)
}

const applyMobileFilters = () => {
  closeMobileSidebar()
}

// Filter functions with URL update
const toggleCategoryFilter = async (category) => {
  await productStore.toggleCategoryFilter(category)
  updateURL()
}

const clearCategoryFilter = async () => {
  await productStore.clearFilter('category')
  updateURL()
}

const toggleBrandFilter = async (brand) => {
  await productStore.toggleBrandFilter(brand)
  updateURL()
}

const clearBrandFilter = async () => {
  await productStore.clearFilter('brand')
  updateURL()
}

const toggleColorFilter = async (color) => {
  await productStore.toggleColorFilter(color)
  updateURL()
}

const clearColorFilter = async () => {
  await productStore.clearFilter('color')
  updateURL()
}

const toggleSizeFilter = async (size) => {
  await productStore.toggleSizeFilter(size)
  updateURL()
}

const clearSizeFilter = async () => {
  await productStore.clearFilter('size')
  updateURL()
}

const selectSortFilter = async (sortType) => {
  await productStore.updateFilters({ sortBy: sortType })
  updateURL()
}

const clearSortFilter = async () => {
  await productStore.updateFilters({ sortBy: 'popularity' })
  updateURL()
}

const applyPriceFilter = async () => {
  const newFilters = {
    minPrice: Math.min(priceRange.value.min, priceRange.value.max),
    maxPrice: Math.max(priceRange.value.min, priceRange.value.max)
  }

  if (newFilters.minPrice > newFilters.maxPrice) {
    const temp = newFilters.minPrice
    newFilters.minPrice = newFilters.maxPrice
    newFilters.maxPrice = temp
  }

  await productStore.updateFilters(newFilters)
  updateURL()
}

const resetPriceFilter = async () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  await productStore.clearFilter('price')
  updateURL()
}

const clearAllFilters = async () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  await productStore.clearAllFilters()
  updateURL()
  closeMobileSidebar()
}

// URL update function
const updateURL = () => {
  const query = {}

  if (filters.value.category) query.category = filters.value.category
  if (filters.value.brand) query.brand = filters.value.brand
  if (filters.value.color) query.color = filters.value.color
  if (filters.value.size) query.size = filters.value.size
  if (filters.value.sortBy && filters.value.sortBy !== 'popularity') query.sort = filters.value.sortBy
  if (filters.value.minPrice > 0) query.min_price = filters.value.minPrice
  if (filters.value.maxPrice < defaultMaxPrice.value) query.max_price = filters.value.maxPrice
  if (filters.value.page > 1) query.page = filters.value.page

  // Update URL without adding to history
  const url = new URL(window.location)
  url.search = new URLSearchParams(query).toString()
  window.history.replaceState({}, '', url)
}

// Pagination
const goToPage = async (page) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    await productStore.updateFilters({ page })
    updateURL()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
const getVisiblePages = () => {
  const pages = []
  const total = pagination.value.lastPage
  const currentPage = filters.value.page

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (currentPage >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// UI functions
const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value
}

const toggleSortDropdownMobile = () => {
  isSortDropdownOpenMobile.value = !isSortDropdownOpenMobile.value
}

const selectSortOption = (value) => {
  selectSortFilter(value)
  isSortDropdownOpen.value = false
  isSortDropdownOpenMobile.value = false
}

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
  if (showMobileSidebar.value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
  document.body.classList.remove('no-scroll')
}

// Wishlist & Cart functions
const addToWishlist = (product) => {
  try {
    const wasInWishlist = wishlistStore.hasProduct(product)
    wishlistStore.toggleItem(product)

    const toastOptions = {
      position: "top-center",
      timeout: 1500,
      hideProgressBar: true,
      closeButton: false,
      pauseOnHover: false,
      draggable: false,
      toastClassName: "dark-toast"
    }

    if (wasInWishlist) {
      toast.info("Removed from wishlist", toastOptions)
    } else {
      toast.success("Added to wishlist", toastOptions)
    }

  } catch (error) {
    console.error("Error toggling wishlist:", error)
    toast.error("Error updating wishlist")
  }
}


const isInWishlist = (product) => {
  try {
    return wishlistStore.hasProduct(product)
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return false
  }
}

const addToCart = (product) => {
  if (getProductStock(product) === 0) {
    toast.warning('Product is out of stock')
    return
  }
  toast.success('Added to cart')
}

const quickView = (product) => {
  console.log('Quick view:', getProductName(product))
}

// URL Copy
const copyURLToClipboard = async () => {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    toast.success('Filter link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy URL:', err)
    toast.error('Failed to copy URL')
  }
}

// Watch for filter changes to update price range
watch(() => filters.value, (newFilters) => {
  priceRange.value = {
    min: newFilters.minPrice,
    max: newFilters.maxPrice
  };
}, { deep: true, immediate: true });

// Initialize
onMounted(async () => {
  try {
    // Just initialize the store - it will handle URL syncing internally
    await productStore.initialize();

    // Sync price range with current filters
    priceRange.value = {
      min: filters.value.minPrice,
      max: filters.value.maxPrice
    };

    showInitialLoading.value = false;
  } catch (error) {
    console.error('Initialization error:', error);
    showInitialLoading.value = false;
    toast.error('Error loading products');
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll')
})

definePageMeta({
  scrollToTop: true
})
</script>

<style scoped>
/* Mobile Filter Overlay & Sheet */
.mobile-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.mobile-filter-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80vh;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.mobile-filter-sheet.show {
  transform: translateY(0);
}

.filter-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.filter-sheet-header h6 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-filter-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  -webkit-overflow-scrolling: touch;
}

.mobile-active-filters {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.active-filters-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.mobile-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  border: none;
}

.mobile-filter-chip i {
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
}

.clear-all-mobile {
  width: 100%;
  padding: 12px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.clear-all-mobile:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-filter-options {
  padding: 16px 0;
}

.mobile-filter-section {
  margin-bottom: 24px;
}

.mobile-filter-section h6 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.mobile-sort-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-sort-options button {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.mobile-sort-options button.active {
  border-color: #4f46e5;
  background: #eef2ff;
  color: #4f46e5;
}

.mobile-sort-options button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.mobile-quick-filters button {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.mobile-quick-filters button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.mobile-quick-filters button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.view-all-link {
  color: #4f46e5;
  font-size: 14px;
  text-decoration: none;
  padding: 8px 12px;
}

.mobile-price-range {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.price-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.price-display .separator {
  color: #666;
}

.range-slider-wrapper {
  position: relative;
  height: 40px;
}

.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 6px;
  outline: none;
  position: absolute;
  pointer-events: none;
}

.range-slider::-webkit-slider-thumb {
  pointer-events: auto;
  width: 24px;
  height: 24px;
  background: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  position: relative;
  z-index: 2;
}

.mobile-color-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.color-filter-btn.active {
  border-color: #4f46e5;
  background: #f0f0ff;
}

.color-dot-mobile {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.filter-sheet-actions {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.btn-apply-filters {
  width: 100%;
  padding: 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-apply-filters:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-filter-toggle-bar {
  position: fixed;
  width: 100%;
  top: 0;
  background: white;
  z-index: 500;
  border-bottom: 1px solid #f0f0f0;
  margin-top: 50px;
  padding: 10px 0;
}

.mobile-filter-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.product-count {
  font-weight: 600;
  color: #333;
}

.active-filter-count {
  color: #105cb2;
  font-weight: 500;
}

.mobile-filter-buttons {
  display: flex;
  gap: 12px;
}

.custom-dropdown-mobile {
  position: relative;
  flex: 1;
}

.mobile-sort-btn,
.mobile-filter-btn {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
}

.mobile-filter-btn {
  width: auto;
  min-width: 100px;
  position: relative;
}

.filter-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #ff4444;
  border-radius: 50%;
}

.sort-dropdown-mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 4px;
}

.sort-dropdown-mobile button {
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.sort-dropdown-mobile button.active {
  background: #e0e7ff;
  color: #4f46e5;
}

.sort-dropdown-mobile button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Active Filters */
.arrow {
  display: inline-block;
  margin-left: 6px;
  transition: transform 0.25s ease;
  transform: rotate(0deg);
}

.arrow.open {
  transform: rotate(180deg);
}

.active-filters-bar {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filters-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.filters-header .actions {
  display: flex;
  gap: 12px;
}

.link-btn {
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
}

.link-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-all {
  background: none;
  border: none;
  color: #d32f2f;
  font-size: 14px;
  cursor: pointer;
}

.clear-all:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filters-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  border: none;
}

.chip:hover {
  background: #f5f5f5;
}

.chip i {
  font-size: 12px;
}

.chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.chip-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.review-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff7ed;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.product-title-section {
  padding: 8px 0;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Title */
.product-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 4px;
  color: #111;
}

/* Variant Info */
.variant-info {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 8px;
}

/* Chips */
.variant-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 999px;
  background: #f5f5f5;
  color: #444;
}

/* Color Dot */
.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* Size chip subtle */
.size-chip {
  background: #eef2ff;
  color: #3730a3;
}

/* Skeleton Loading */
.skeleton-container {
  min-height: 100vh;
  background: white;
}

.skeleton-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
}

.skeleton-title {
  height: 24px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-item {
  height: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-image {
  height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
}

.skeleton-line {
  height: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

.skeleton-button {
  height: 40px;
  background: #f5f5f5;
  border-radius: 6px;
}

.skeleton-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-controls {
  display: flex;
  gap: 12px;
}

.skeleton-product-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #f5f5f5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* Main Styles */
.shop-sidebar {
  position: relative;
}

.shop-sidebar__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.shop-sidebar__close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shop-sidebar__box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: white;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h6 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-clear {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-list {
  max-height: 300px;
  overflow-y: auto;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-check input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-check label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  padding: 4px 0;
}

.form-check label>div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.price-range-text {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.shop-sidebar__box input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
}

.shop-sidebar__box input[type="range"]:disabled {
  opacity: 0.5;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.size-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover:not(:disabled) {
  color: #000000;
}

.size-btn-active {
  background: #034cb9;
  color: white;
}

.size-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-filter-box {
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.clear-btn {
  width: 100%;
  padding: 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.advertise-box img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Product Topbar */
.product-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.topbar-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.count-text {
  font-weight: 500;
  color: #111827;
}

.active-filter-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  display: flex;
  gap: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px;
  background: #f9fafb;
}

.view-toggle button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
}

.view-toggle button.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-toggle button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom Dropdown */
.custom-dropdown {
  position: relative;
}

.custom-btn {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
  margin-top: 4px;
}

.custom-menu button {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.custom-menu button:hover:not(:disabled) {
  background: #f9fafb;
}

.custom-menu button.active {
  background: #e0e7ff;
  color: #4f46e5;
}

.custom-menu button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-filter-btn {
  width: 30px;
  height: 25px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.mobile-filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  border: 2px solid white;
}

/* Product Grid - OPTIMIZED FOR ALL SCREENS */
.product-grid {
  display: grid;
  gap: 16px;
  width: 100%;
  margin-top: 61px;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 160px;
  /* Minimum width ensure */
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  /* Square aspect ratio */
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image a {
  display: block;
  height: 100%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.4s ease;
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.no-image i {
  font-size: 48px;
  margin-bottom: 8px;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.discount-badge {
  background: #dc2626;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.new-badge {
  background: #059669;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-actions button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.product-actions button:hover:not(:disabled) {
  background: #de0060;
  color: white;
}

.product-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-actions .in-wishlist {
  color: #dc2626;
}

.product-info {
  padding: 6px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.product-title {
  font-size: clamp(13px, 2vw, 16px);
  /* Responsive font size */
  font-weight: 500;
  color: #111827;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-title-section a {
  color: inherit;
  text-decoration: none;
}

.product-title-section a:hover {
  color: #c50360;
}

.variant-info {
  margin-top: 8px;
}

.variant-info>div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.color-indicator-sm {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0;
  flex-wrap: wrap;
}

.current-price {
  font-size: clamp(14px, 2vw, 18px);
  /* Responsive price font */
  font-weight: 600;
  color: #111827;
}

.original-price {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
}

.save-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-list-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  overflow: hidden;
}

.list-item-content {
  display: flex;
}

.list-image {
  width: 200px;
  height: 200px;
  background: #f9fafb;
  flex-shrink: 0;
}

.list-image a {
  display: block;
  height: 100%;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-details {
  flex: 1;
  padding: 24px;
}

.list-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.list-details h3 a {
  color: inherit;
  text-decoration: none;
}

.list-details h3 a:hover {
  color: #4f46e5;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.color-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.list-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.list-actions {
  display: flex;
  gap: 12px;
}

.btn-add-cart {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-add-cart:hover:not(:disabled) {
  background: #4338ca;
}

.btn-add-cart.out-of-stock {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-wishlist {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-wishlist:hover:not(:disabled) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.btn-wishlist:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-wishlist .in-wishlist {
  color: #dc2626;
}

/* Pagination */
.pagination-container {
  margin-top: 48px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled):not(.active):not(.disabled) {
  border-color: #4f46e5;
  color: #4f46e5;
}

.pagination-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.disabled {
  background: #f9fafb;
  cursor: default;
}

/* No Products */
.no-products {
  text-align: center;
  padding: 80px 20px;
}

.no-products i {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 24px;
}

.no-products h4 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.no-products p {
  color: #6b7280;
  margin-bottom: 24px;
}

.btn-clear-filters {
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-clear-filters:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVE MEDIA QUERIES - FIXED AND OPTIMIZED */

/* Small Mobile (up to 480px) */
@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .product-card {
    min-width: 160px;
  }

  .stars {
    display: none;
  }

  .discount-badge {
    font-size: 10px;
    padding: 2px 6px;
  }

  .variant-info {
    display: none;
  }

  .product-rating {
    display: none;
  }

  .product-title {
    padding: 0;
    margin: 0;
    font-size: 13px;
  }

  .product-price {
    margin: 0;
  }

  .product-actions {
    top: 8px;
    right: 8px;
    gap: 6px;
  }

  .product-actions button {
    width: 24px;
    height: 24px;
  }

  .product-actions i {
    font-size: 14px;
  }

  .product-info {
    padding: 8px;
  }

  .current-price {
    font-size: 14px;
  }

  .original-price {
    font-size: 12px;
  }

  .container-lg {
    padding-left: 12px;
    padding-right: 12px;
  }
}

/* Mobile (481px to 640px) */
@media (min-width: 481px) and (max-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .product-card {
    min-width: 180px;
  }

  .product-image {
    aspect-ratio: 1 / 1;
  }

  .product-title {
    font-size: 13px;
  }

  .current-price {
    font-size: 14px;
  }

  .product-actions {
    top: 10px;
    right: 10px;
    gap: 6px;
  }

  .product-actions button {
    width: 28px;
    height: 28px;
  }
}

/* Tablet (641px to 768px) */
@media (min-width: 641px) and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 61px;
  }

  .product-card {
    min-width: 200px;
  }

  .product-title {
    font-size: 14px;
  }

  .variant-info {
    font-size: 11px;
  }
}

/* Small Desktop (769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 61px;
  }

  .product-card {
    min-width: 220px;
  }

  .product-meta {
    margin: 0;
  }

  .product-price {
    margin: 0;
  }
}

/* Desktop (1025px and above) */
@media (min-width: 1025px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 61px;
  }
}

/* Large Desktop (1400px and above) */
@media (min-width: 1400px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
}

/* List View Responsive */
@media (max-width: 768px) {
  .list-item-content {
    flex-direction: column;
  }

  .list-image {
    width: 100%;
    height: 200px;
  }

  .list-actions {
    flex-direction: column;
  }

  .topbar-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .filters-chips {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .filters-chips::-webkit-scrollbar {
    display: none;
  }

  .chip {
    flex-shrink: 0;
    white-space: nowrap;
  }
}

/* Tablet list view */
@media (max-width: 1024px) {
  .list-view .list-image {
    width: 180px;
    height: 180px;
  }
}

/* Utility */
.no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Performance Optimizations */
@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Touch-friendly */
@media (hover: none) {
  .product-actions button {
    width: 36px;
    height: 36px;
  }

  .pagination-btn {
    width: 44px;
    height: 44px;
  }

  .btn-add-cart,
  .btn-wishlist {
    padding: 14px 24px;
  }
}

/* Accessibility */
@media (prefers-contrast: high) {
  .product-card {
    border: 2px solid #000;
  }

  .btn-add-cart {
    border: 2px solid #000;
  }
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .product-card {
    background: #1f2937;
    border-color: #374151;
  }
  
  .product-title {
    color: #f9fafb;
  }
  
  .current-price {
    color: #f9fafb;
  }
} */
</style>
