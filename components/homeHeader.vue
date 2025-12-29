<template>
  <header class="header bg-white border-bottom-0 box-shadow-3xl z-2">
    <div class="container container-lg">
      <nav class="header-inner d-flex justify-content-between align-items-center gap-8">
        <!-- Logo - Market Pro -->
        <div class="logo flex-shrink-0">
          <NuxtLink to="/" class="link">
            <img 
              v-if="logoImage"
              :src="logoImage"
              alt="Market Pro"
              class="logo-img"
            >
            <img
              v-else
              src="/assets/images/logo/favicon.png"
              alt="Market Pro"
              class="logo-img"
            >
          </NuxtLink>
        </div>
        <!--Navigation with Dynamic Categories -->
        <div class="header-menu d-lg-block d-none flex-grow-1">
          <ul class="nav-menu flex-align justify-content-center">
           
            <!-- Static Categories -->
            <!-- <li class="nav-menu__item">
              <NuxtLink
                to="/shop-all"
                class="nav-menu__link text-heading-two"
                :class="{ 'active': isActiveLink('/shop-all') }"
                @click="setActiveLink('shop-all')"
                prefetch
              >
                Shop All
              </NuxtLink>
            </li>
             -->
            <!-- Dynamic Categories from API -->
            <li
              v-for="category in categories"
              :key="category.id"
              class="nav-menu__item category-menu-item"
              @mouseenter="openCategoryMenu(category)"
              @mouseleave="closeCategoryMenu"
            >
              <NuxtLink
                :to="getCategoryLink(category)"
                class="nav-menu__link text-heading-two"
                :class="{ 'active': isActiveCategory(category) }"
                prefetch
              >
                {{ category.name.toUpperCase()+1 }}
                <i class="ph ph-caret-down ms-2 text-sm" v-if="hasSubCategories(category)"></i>
              </NuxtLink>
             
              <!-- Category Submenu  -->
              <div
                v-if="activeCategoryMenu === category.id && hasSubCategories(category)"
                class="category-submenu"
                @mouseenter="keepCategoryMenuOpen"
                @mouseleave="closeCategoryMenu"
              >
                <div class="category-submenu-content">
                  <!-- Subcategories Grid -->
                  <div class="subcategory-columns"> 
                    <!-- Dynamic Subcategories -->
                    <template v-if="category.subCategories && category.subCategories.length > 0">
                      <div
                        v-for="subCategory in category.subCategories" 
                        :key="subCategory.id"
                        class="subcategory-column"
                      >
                        <NuxtLink
                          :to="getCategoryLink(subCategory)"
                          class="subcategory-title"
                          @click="closeAllMenus"
                        >
                          <div class="subcategory-icon">
                            <img
                              :src="getCategoryImage(subCategory)"
                              :alt="subCategory.name"
                              loading="lazy"
                              @error="handleImageError"
                            >
                          </div>
                          <span class="subcategory-name">{{ subCategory.name }}</span>
                          <i class="ph ph-arrow-right"></i>
                        </NuxtLink>
                       
                        <!-- Sub-subcategories -->
                        <div v-if="subCategory.subSubCategories?.length" class="subsubcategory-list">
                          <NuxtLink
                            v-for="subSubCategory in subCategory.subSubCategories"
                            :key="subSubCategory.id"
                            :to="getCategoryLink(subSubCategory)"
                            class="subsubcategory-item"
                            @click="closeAllMenus"
                          >
                            {{ subSubCategory.name }}
                           
                            <!-- Sub-sub-subcategories (4th level) -->
                            <div
                              v-if="subSubCategory.subSubSubCategory?.length"
                              class="subsubsubcategory-list"
                            >
                              <NuxtLink
                                v-for="subSubSubCategory in subSubCategory.subSubSubCategory"
                                :key="subSubSubCategory.id"
                                :to="getCategoryLink(subSubSubCategory)"
                                class="subsubsubcategory-item"
                                @click="closeAllMenus"
                              >
                                {{ subSubSubCategory.name }}
                              </NuxtLink>
                            </div>
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                   
                    <!-- Static Categories for Men -->
                    <template v-if="category.name.toLowerCase() === 'men'">
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Topwear</h5>
                          <NuxtLink to="/shop-all?category=T-Shirts" class="subcategory-item" @click="closeAllMenus">
                            T-Shirts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Casual Shirts" class="subcategory-item" @click="closeAllMenus">
                            Casual Shirts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Formal Shirts" class="subcategory-item" @click="closeAllMenus">
                            Formal Shirts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sweatshirts" class="subcategory-item" @click="closeAllMenus">
                            Sweatshirts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sweaters" class="subcategory-item" @click="closeAllMenus">
                            Sweaters
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Jackets" class="subcategory-item" @click="closeAllMenus">
                            Jackets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Blazers & Coats" class="subcategory-item" @click="closeAllMenus">
                            Blazers & Coats
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Suits" class="subcategory-item" @click="closeAllMenus">
                            Suits
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Rain Jackets" class="subcategory-item" @click="closeAllMenus">
                            Rain Jackets
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Bottomwear</h5>
                          <NuxtLink to="/shop-all?category=Jeans" class="subcategory-item" @click="closeAllMenus">
                            Jeans
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Casual Trousers" class="subcategory-item" @click="closeAllMenus">
                            Casual Trousers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Formal Trousers" class="subcategory-item" @click="closeAllMenus">
                            Formal Trousers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Shorts" class="subcategory-item" @click="closeAllMenus">
                            Shorts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Track Pants & Joggers" class="subcategory-item" @click="closeAllMenus">
                            Track Pants & Joggers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Innerwear & Sleepwear" class="subcategory-item" @click="closeAllMenus">
                            Innerwear & Sleepwear
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Thermals" class="subcategory-item" @click="closeAllMenus">
                            Thermals
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Plus Size" class="subcategory-item" @click="closeAllMenus">
                            Plus Size
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Footwear</h5>
                          <NuxtLink to="/shop-all?category=Casual Shoes" class="subcategory-item" @click="closeAllMenus">
                            Casual Shoes
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sports Shoes" class="subcategory-item" @click="closeAllMenus">
                            Sports Shoes
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Formal Shoes" class="subcategory-item" @click="closeAllMenus">
                            Formal Shoes
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sneakers" class="subcategory-item" @click="closeAllMenus">
                            Sneakers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sandals & Floaters" class="subcategory-item" @click="closeAllMenus">
                            Sandals & Floaters
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Flip Flops" class="subcategory-item" @click="closeAllMenus">
                            Flip Flops
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Socks" class="subcategory-item" @click="closeAllMenus">
                            Socks
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Swimwear" class="subcategory-item" @click="closeAllMenus">
                            Swimwear
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Fashion Accessories</h5>
                          <NuxtLink to="/shop-all?category=Wallets" class="subcategory-item" @click="closeAllMenus">
                            Wallets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Belts" class="subcategory-item" @click="closeAllMenus">
                            Belts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Perfumes & Body Mists" class="subcategory-item" @click="closeAllMenus">
                            Perfumes & Body Mists
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Trimmers" class="subcategory-item" @click="closeAllMenus">
                            Trimmers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Deodorants" class="subcategory-item" @click="closeAllMenus">
                            Deodorants
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Ties, Cufflinks & Pocket Squares" class="subcategory-item" @click="closeAllMenus">
                            Ties, Cufflinks & Pocket Squares
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Accessory Gift Sets" class="subcategory-item" @click="closeAllMenus">
                            Accessory Gift Sets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Mufflers, Scarves & Gloves" class="subcategory-item" @click="closeAllMenus">
                            Mufflers, Scarves & Gloves
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sunglasses & Frames" class="subcategory-item" @click="closeAllMenus">
                            Sunglasses & Frames
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Indian & Festive Wear</h5>
                          <NuxtLink to="/shop-all?category=Kurtas & Kurta Sets" class="subcategory-item" @click="closeAllMenus">
                            Kurtas & Kurta Sets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sherwanis" class="subcategory-item" @click="closeAllMenus">
                            Sherwanis
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Nehru Jackets" class="subcategory-item" @click="closeAllMenus">
                            Nehru Jackets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Dhotis" class="subcategory-item" @click="closeAllMenus">
                            Dhotis
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                   
                    <!-- Static Categories for Women -->
                    <template v-else-if="category.name.toLowerCase() === 'women'">
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Western Wear</h5>
                          <NuxtLink to="/shop-all?category=Women Tops" class="subcategory-item" @click="closeAllMenus">
                            Tops
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Women Dresses" class="subcategory-item" @click="closeAllMenus">
                            Dresses
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Women Jeans" class="subcategory-item" @click="closeAllMenus">
                            Jeans
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Women Jackets" class="subcategory-item" @click="closeAllMenus">
                            Jackets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Women Skirts" class="subcategory-item" @click="closeAllMenus">
                            Skirts
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Women Blouses" class="subcategory-item" @click="closeAllMenus">
                            Blouses
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Ethnic Wear</h5>
                          <NuxtLink to="/shop-all?category=Sarees" class="subcategory-item" @click="closeAllMenus">
                            Sarees
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Kurtis" class="subcategory-item" @click="closeAllMenus">
                            Kurtis
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Lehengas" class="subcategory-item" @click="closeAllMenus">
                            Lehengas
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Salwar Suits" class="subcategory-item" @click="closeAllMenus">
                            Salwar Suits
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Anarkalis" class="subcategory-item" @click="closeAllMenus">
                            Anarkalis
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Beauty & Cosmetics</h5>
                          <NuxtLink to="/shop-all?category=Makeup" class="subcategory-item" @click="closeAllMenus">
                            Makeup
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Skincare" class="subcategory-item" @click="closeAllMenus">
                            Skincare
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Haircare" class="subcategory-item" @click="closeAllMenus">
                            Haircare
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Fragrances" class="subcategory-item" @click="closeAllMenus">
                            Fragrances
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Jewelry" class="subcategory-item" @click="closeAllMenus">
                            Jewelry
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Bags & Accessories</h5>
                          <NuxtLink to="/shop-all?category=Handbags" class="subcategory-item" @click="closeAllMenus">
                            Handbags
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Clutches" class="subcategory-item" @click="closeAllMenus">
                            Clutches
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Wallets" class="subcategory-item" @click="closeAllMenus">
                            Wallets
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Scarves" class="subcategory-item" @click="closeAllMenus">
                            Scarves
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Belts" class="subcategory-item" @click="closeAllMenus">
                            Belts
                          </NuxtLink>
                        </div>
                      </div>
                     
                      <div class="subcategory-column">
                        <div class="subcategory-section">
                          <h5 class="section-title">Footwear</h5>
                          <NuxtLink to="/shop-all?category=Heels" class="subcategory-item" @click="closeAllMenus">
                            Heels
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Flats" class="subcategory-item" @click="closeAllMenus">
                            Flats
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sandals" class="subcategory-item" @click="closeAllMenus">
                            Sandals
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Sneakers" class="subcategory-item" @click="closeAllMenus">
                            Sneakers
                          </NuxtLink>
                          <NuxtLink to="/shop-all?category=Boots" class="subcategory-item" @click="closeAllMenus">
                            Boots
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                  </div>
                 
                  <!-- Banner Section -->
                  <div class="category-banner">
                    <div class="banner-content">
                      <h4>{{ getBannerTitle(category) }}</h4>
                      <p>{{ getBannerSubtitle(category) }}</p>
                      <NuxtLink
                        :to="getCategoryLink(category)"
                        class="banner-button"
                        @click="closeAllMenus"
                      >
                        Shop Now
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </li>
           
            <!-- Static Studio Category -->
            <!-- <li class="nav-menu__item">
              <NuxtLink
                to="/studio"
                class="nav-menu__link text-heading-two"
                :class="{ 'active': isActiveLink('/studio') }"
                @click="setActiveLink('studio')"
                prefetch
              >
                STUDIO
              </NuxtLink>
            </li> -->
           
            <!-- Static Blog Category -->
            <!-- <li class="nav-menu__item">
              <NuxtLink
                to="/blogs"
                class="nav-menu__link text-heading-two"
                :class="{ 'active': isActiveLink('/blogs') }"
                @click="setActiveLink('blogs')"
                prefetch
              >
                BLOG
              </NuxtLink>
            </li> -->
          </ul>
        </div>
        <!-- Search Bar (Compact Version) -->
        <div class="header-search flex-shrink-0 ms-auto me-12">
          <div class="search-form-compact position-relative">
            <div class="search-form__wrapper position-relative">
              <input 
                type="text"
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="showDropdown = true"
                @blur="onInputBlur"
                @keydown.enter="handleSearch"
                class="compact-search-input py-10 ps-12 pe-40 rounded-20 placeholder-italic"
                placeholder="Search for products, brands and more"
                autocomplete="off"
              >
             
              <!-- Loading indicator -->
              <div v-if="loading" class="position-absolute top-50 translate-middle-y end-32">
                <div class="spinner-border spinner-border-sm text-main-600" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
             
              <button
                type="button"
                @click="handleSearch"
                class="compact-search-btn w-36 h-36 bg-transparent text-gray-600 flex-center position-absolute top-50 translate-middle-y end-0 me-8"
                :disabled="loading"
              >
                <i class="ph-bold ph-magnifying-glass" style="font-size: 16px;"></i>
              </button>
              <!-- Search Results Dropdown -->
              <div v-if="showDropdown && searchResults.length > 0"
                   class="search-dropdown position-absolute top-100 start-0 end-0 bg-white border border-gray-200 rounded-8 shadow-lg mt-4"
                   style="z-index: 99999 !important;">
               
                <!-- Results Header -->
                <div class="p-12 border-b border-gray-100">
                  <h6 class="text-sm font-semibold text-gray-700">
                    Found {{ searchResults.length }} product{{ searchResults.length !== 1 ? 's' : '' }}
                  </h6>
                </div>
                <!-- Results List -->
                <div class="max-h-400 overflow-y-auto">
                  <div v-for="product in searchResults"
                       :key="product.id"
                       @click="selectProduct(product)"  
                       @mousedown.prevent
                       class="product-result flex items-center gap-12 p-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 last:border-b-0">
                   
                    <!-- Product Image -->
                    <div class="w-48 h-48 flex-shrink-0 rounded-6 bg-gray-100 overflow-hidden">
                      <img :src="getProductImage(product)" :alt="product.name"
                           class="w-full h-full object-cover">
                    </div>
                   
                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-8 mb-4">
                        <h6 class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</h6>
                        <span class="text-sm font-bold text-main-600 flex-shrink-0">₹{{ product.price }}</span>
                      </div>
                     
                      <!-- Product Details -->
                      <div class="flex items-center gap-8 flex-wrap">
                        <!-- Category -->
                        <div v-if="product.category?.name" class="flex items-center gap-4">
                          <i class="ph ph-tag text-gray-400 text-xs"></i>
                          <span class="text-xs text-gray-500">{{ product.category.name }}</span>
                        </div>
                       
                        <!-- Stock -->
                        <div class="flex items-center gap-4">
                          <i class="ph ph-package text-gray-400 text-xs"></i>
                          <span class="text-xs" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                            {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                          </span>
                        </div>
                      </div>
                    </div>
                   
                    <!-- View Button -->
                    <div class="flex-shrink-0">
                      <div class="w-28 h-28 bg-main-600 hover:bg-main-700 rounded-4 flex-center text-white text-sm transition-colors duration-200">
                        <i class="ph ph-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- No Results Message -->
              <div v-if="showDropdown && searchQuery && !loading && searchResults.length === 0"
                   class="search-dropdown position-absolute top-100 start-0 end-0 bg-white border border-gray-200 rounded-8 shadow-lg mt-4"
                   style="z-index: 99999 !important;">
                <div class="text-center p-16">
                  <i class="ph ph-magnifying-glass text-gray-400 text-xl mb-8"></i>
                  <p class="text-sm text-gray-600 mb-4">No products found</p>
                  <p class="text-xs text-gray-500">Try searching by product name</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Header Right (Compact Icons) -->
        <div class="header-right flex-align flex-shrink-0">
          <div class="flex-align gap-12">
            <!-- Profile Icon -->
            <NuxtLink to="/profile" class="flex-center item-hover w-40 h-40 rounded-circle hover-bg-gray-100">
              <i class="ph-bold ph-user text-gray-700" style="font-size: 18px;"></i>
            </NuxtLink>
            <!-- Wishlist Icon -->
           <NuxtLink 
  to="/wishlist" 
  class="wishlist-icon flex-center w-40 h-40 rounded-circle hover-bg-gray-100 position-relative"
>
  <i class="ph-bold ph-heart text-gray-700" style="font-size: 20px;"></i>

  <span 
    v-if="wishlistCount > 0" 
    class="wishlist-badge"
  >
    {{ wishlistCount }}
  </span>
</NuxtLink>
                
            <!-- Cart Icon -->
            <NuxtLink to="/cart" class="flex-center item-hover w-40 h-40 rounded-circle hover-bg-gray-100 relative cart-link">
              <i class="ph-bold ph-shopping-cart text-gray-700" style="font-size: 18px;"></i>
              <!-- Cart Count Badge - REAL-TIME -->
              <span
                v-if="cartCount > 0"
                class="w-14 h-14 flex-center rounded-circle  text-white text-2xs position-absolute top-n2 end-n2 cart-badge"
                :class="{ 'cart-badge-pulse': badgePulse }"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
           
            <!-- Mobile Menu Toggle -->
            <button
              type="button"
              class="toggle-mobileMenu text-gray-800 text-xl d-flex align-items-center justify-content-center w-40 h-40 rounded-8 hover-bg-gray-100 transition-2 d-lg-none"
              @click="toggleMobileMenu"
            >
              <i class="ph ph-list"></i>
            </button>
          </div>
        </div>
      </nav>
    </div>
    <!-- Mobile Menu Overlay -->
    <div
      v-if="showMobileMenu"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
    <!-- Mobile Menu Sidebar -->
    <div
      v-if="showMobileMenu"
      ref="mobileMenuRef"
      class="mobile-menu-sidebar"
      :class="{ 'mobile-menu-show': showMobileMenu }"
      @click.stop
    >
      <div class="mobile-menu-header bg-main-600 text-white px-20 py-16">
        <div class="d-flex align-items-center justify-content-between">
          <!-- Logo -->
          <img
            src="/assets/images/logo/favicon.png"
            alt="Market Pro"
            class="mobile-logo"
          />
          <!-- Close Button -->
          <button @click="closeMobileMenu" class="mobile-close-btn">
            <i class="ph ph-x text-xl fw-bold"></i>
          </button>
        </div>
      </div>
     
      <!-- Mobile Search in Sidebar -->
      <div class="mobile-search-section px-16 py-12 border-b border-gray-200">
        <div class="search-form__wrapper position-relative">
          <input
            type="text"
            v-model="mobileSearchQuery"
            @input="handleMobileSearch"
            @keydown.enter="handleMobileSearchSubmit"
            ref="mobileSearchInput"
            class="mobile-search-input py-10 ps-12 pe-40 rounded-20 w-100"
            placeholder="Search products..."
            autocomplete="off"
          >
          <button
            type="button"
            @click="handleMobileSearchSubmit"
            class="compact-search-btn w-36 h-36 bg-transparent text-gray-600 flex-center position-absolute top-50 translate-middle-y end-0 me-8"
            :disabled="loading"
          >
            <i class="ph-bold ph-magnifying-glass" style="font-size: 16px;"></i>
          </button>
        </div>
      </div>
     
      <div class="mobile-menu-content py-12">
        <!-- Main Categories -->
        <div class="mobile-category-section">
          <NuxtLink to="/shop-all" class="mobile-menu-item"
            :class="{ 'active-mobile': isActiveLink('/shop-all') }"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-shopping-cart"></i>
            </div>
            <div class="menu-text">
              <span class="item-title">Shop All</span>
            </div>
            <i class="ph ph-arrow-right text-gray-400"></i>
          </NuxtLink>
         
          <!-- Dynamic Categories Mobile -->
          <div v-for="category in categories" :key="category.id">
            <button
              class="mobile-menu-item category-header"
              @click="toggleMobileCategory(category.id)"
            >
              <div class="menu-icon">
                <img
                  :src="getCategoryImage(category)"
                  :alt="category.name"
                  loading="lazy"
                  @error="handleImageError"
                  class="category-icon"
                >
              </div>
              <div class="menu-text">
                <span class="item-title">{{ category.name.toUpperCase() }}</span>
              </div>
              <i :class="['ph', mobileOpenCategory === category.id ? 'ph-caret-up' : 'ph-caret-down', 'text-gray-400']"></i>
            </button>
           
            <!-- Mobile Subcategories -->
            <div v-if="mobileOpenCategory === category.id" class="mobile-subcategories">
              <!-- Dynamic Subcategories -->
              <div v-for="subCategory in category.subCategories" :key="subCategory.id">
                <div class="mobile-subcategory-section">
                  <h6 class="mobile-section-title">{{ subCategory.name }}</h6>
                  <NuxtLink
                    :to="getCategoryLink(subCategory)"
                    class="mobile-subcategory-item"
                    @click="closeMobileMenu"
                  >
                    All {{ subCategory.name }}
                  </NuxtLink>
                 
                  <!-- Sub-subcategories -->
                  <div v-if="subCategory.subSubCategories?.length">
                    <NuxtLink
                      v-for="subSubCategory in subCategory.subSubCategories"
                      :key="subSubCategory.id"
                      :to="getCategoryLink(subSubCategory)"
                      class="mobile-subsubcategory-item"
                      @click="closeMobileMenu"
                    >
                      {{ subSubCategory.name }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
             
              <!-- Static Categories for Men Mobile -->
              <template v-if="category.name.toLowerCase() === 'men'">
                <div class="mobile-subcategory-section">
                  <h6 class="mobile-section-title">Topwear</h6>
                  <NuxtLink to="/shop-all?category=T-Shirts" class="mobile-subcategory-item" @click="closeMobileMenu">
                    T-Shirts
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Casual Shirts" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Casual Shirts
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Formal Shirts" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Formal Shirts
                  </NuxtLink>
                </div>
               
                <div class="mobile-subcategory-section">
                  <h6 class="mobile-section-title">Bottomwear</h6>
                  <NuxtLink to="/shop-all?category=Jeans" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Jeans
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Casual Trousers" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Casual Trousers
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Formal Trousers" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Formal Trousers
                  </NuxtLink>
                </div>
              </template>
             
              <!-- Static Categories for Women Mobile -->
              <template v-else-if="category.name.toLowerCase() === 'women'">
                <div class="mobile-subcategory-section">
                  <h6 class="mobile-section-title">Western Wear</h6>
                  <NuxtLink to="/shop-all?category=Women Tops" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Tops
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Women Dresses" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Dresses
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Women Jeans" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Jeans
                  </NuxtLink>
                </div>
               
                <div class="mobile-subcategory-section">
                  <h6 class="mobile-section-title">Ethnic Wear</h6>
                  <NuxtLink to="/shop-all?category=Sarees" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Sarees
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Kurtis" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Kurtis
                  </NuxtLink>
                  <NuxtLink to="/shop-all?category=Lehengas" class="mobile-subcategory-item" @click="closeMobileMenu">
                    Lehengas
                  </NuxtLink>
                </div>
              </template>
            </div>
          </div>
         
          <!-- Static Studio Category Mobile -->
          <NuxtLink to="/studio" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-camera"></i>
            </div>
            <div class="menu-text">
              <span class="item-title">STUDIO</span>
            </div>
            <i class="ph ph-arrow-right text-gray-400"></i>
          </NuxtLink>
         
          <!-- Static Blog Category Mobile -->
          <NuxtLink to="/blogs" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-newspaper"></i>
            </div>
            <div class="menu-text">
              <span class="item-title">BLOG</span>
            </div>
            <i class="ph ph-arrow-right text-gray-400"></i>
          </NuxtLink>
        </div>
       
        <!-- User Menu -->
        <div class="mobile-user-section mt-16 pt-16 border-t border-gray-200">
          <NuxtLink to="/profile" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-user"></i>
            </div>
            <div class="menu-text">
              <span class="item-title">Profile</span>
            </div>
          </NuxtLink>
         
          <NuxtLink to="/wishlist" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-heart"></i>
              <span v-if="wishlistCount > 0" class="mobile-badge">{{ wishlistCount }}</span>
            </div>
            <div class="menu-text">
              <span class="item-title">Wishlist</span>
            </div>
          </NuxtLink>
         
          <NuxtLink to="/cart" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-shopping-cart"></i>
              <span v-if="cartCount > 0" class="mobile-badge">{{ cartCount }}</span>
            </div>
            <div class="menu-text">
              <span class="item-title">Cart</span>
            </div>
          </NuxtLink>
         
          <NuxtLink to="/become-a-seller" class="mobile-menu-item"
            @click="closeMobileMenu">
            <div class="menu-icon">
              <i class="ph ph-storefront"></i>
            </div>
            <div class="menu-text">
              <span class="item-title">Become a Seller</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from '#imports'
import { toKebabCase } from "../utlis/toKebabCase"

const router = useRouter()
const route = useRoute()

// State
const searchDropdown = ref(false)
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const loading = ref(false)
const searchResults = ref([])
const mobileSearchResults = ref([])
const wishlistCount = ref(0)
const cartCount = ref(0)
const logoImage = ref('')
const activeCategoryMenu = ref(null)
const mobileOpenCategory = ref(null)
const categoryMenuTimeout = ref(null)
const badgePulse = ref(false)
const categories = ref([])
const loadingCategories = ref(false)

// ==================== ENHANCED REAL-TIME CART SYSTEM ====================
// 1. Enhanced Cart Data Management
const getCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (cartData) {
      const parsed = JSON.parse(cartData)
      console.log('Cart data loaded:', parsed)
      return Array.isArray(parsed) ? parsed : []
    }
    return []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

const calculateCartCount = () => {
  const cartItems = getCartFromStorage()
  
  // Calculate total quantity including all items
  const totalQuantity = cartItems.reduce((total, item) => {
    const quantity = parseInt(item.quantity) || 1
    return total + quantity
  }, 0)
  
  console.log('Total cart quantity:', totalQuantity)
  return totalQuantity
}

const updateCartCount = () => {
  const newCount = calculateCartCount()
  console.log('Updating cart count from', cartCount.value, 'to', newCount)
  
  // Force update for better reliability
  cartCount.value = newCount
  
  // Trigger animation only if count changed
  if (newCount !== cartCount.value) {
    triggerBadgePulse()
  }
}

const updateWishlistCount = () => {
  try {
    const wishlistData = localStorage.getItem('wishlist')
    const wishlistItems = wishlistData ? JSON.parse(wishlistData) : []
    wishlistCount.value = wishlistItems.length
    console.log('Wishlist count:', wishlistCount.value)
  } catch (error) {
    console.error('Error reading wishlist:', error)
    wishlistCount.value = 0
  }
}

// 2. Enhanced Event System
let pollingInterval = null

const setupCartEventSystem = () => {
  console.log('Setting up enhanced cart event system...')
  
  // A. Listen for localStorage changes (cross-tab)
  window.addEventListener('storage', (event) => {
    console.log('Storage event detected:', event.key)
    
    if (event.key === 'shopping_cart') {
      console.log('Cart updated in another tab')
      setTimeout(() => {
        updateCartCount()
      }, 50)
    }
    if (event.key === 'wishlist') {
      console.log('Wishlist updated in another tab')
      setTimeout(() => {
        updateWishlistCount()
      }, 50)
    }
  })
  
  // B. Listen for custom events (same tab)
  window.addEventListener('cart-updated', () => {
    console.log('Cart custom event triggered')
    setTimeout(() => {
      updateCartCount()
    }, 50)
  })
  
  window.addEventListener('wishlist-updated', () => {
    console.log('Wishlist custom event triggered')
    setTimeout(() => {
      updateWishlistCount()
    }, 50)
  })
  
  // C. Enhanced polling system for reliability
  startPollingForChanges()
  
  // D. Monitor page visibility
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('Page became visible, refreshing cart count')
      updateCartCount()
      updateWishlistCount()
    }
  })
  
  // E. Global cart helper functions
  setupGlobalCartHelpers()
}

// 3. Enhanced polling system
const startPollingForChanges = () => {
  let lastCartData = JSON.stringify(getCartFromStorage())
  let lastWishlistData = localStorage.getItem('wishlist') || '[]'
  let lastCartUpdateTime = localStorage.getItem('cart-last-updated') || '0'
  
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  
  pollingInterval = setInterval(() => {
    const currentCartData = JSON.stringify(getCartFromStorage())
    const currentWishlistData = localStorage.getItem('wishlist') || '[]'
    const currentCartUpdateTime = localStorage.getItem('cart-last-updated') || '0'
    
    if (currentCartData !== lastCartData || currentCartUpdateTime !== lastCartUpdateTime) {
      console.log('Cart change detected via polling')
      lastCartData = currentCartData
      lastCartUpdateTime = currentCartUpdateTime
      updateCartCount()
    }
    
    if (currentWishlistData !== lastWishlistData) {
      console.log('Wishlist change detected via polling')
      lastWishlistData = currentWishlistData
      updateWishlistCount()
    }
  }, 500) // Check every 500ms
}

// 4. Badge animation
const triggerBadgePulse = () => {
  badgePulse.value = true
  setTimeout(() => {
    badgePulse.value = false
  }, 500)
}

// 5. Global cart helper functions
const setupGlobalCartHelpers = () => {
  // Function to add item to cart
  window.addItemToCart = (product, quantity = 1, options = {}) => {
    try {
      const cartItems = getCartFromStorage()
      const { color = '', size = '', image = getProductImage(product) } = options
      
      // Generate unique identifier for cart item
      const uniqueId = `${product.id}-${color}-${size}`
      
      const existingIndex = cartItems.findIndex(item => 
        `${item.id}-${item.color}-${item.size}` === uniqueId
      )
      
      let updatedItem
      
      if (existingIndex > -1) {
        // Update quantity if exists
        const currentQuantity = parseInt(cartItems[existingIndex].quantity) || 1
        cartItems[existingIndex].quantity = currentQuantity + quantity
        cartItems[existingIndex].updatedAt = Date.now()
        updatedItem = cartItems[existingIndex]
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: image,
          quantity: quantity,
          color: color,
          size: size,
          stock: product.stock || 10,
          category: product.category?.name || 'General',
          brand: product.brand || 'Unknown',
          addedAt: Date.now(),
          updatedAt: Date.now()
        }
        cartItems.push(newItem)
        updatedItem = newItem
      }
      
      // Save to localStorage
      localStorage.setItem('shopping_cart', JSON.stringify(cartItems))
      localStorage.setItem('cart-last-updated', Date.now().toString())
      
      // Trigger updates
      updateCartCount()
      window.dispatchEvent(new Event('cart-updated'))
      
      // Show notification
      showCartNotification(updatedItem.name, quantity)
      
      console.log('Item added to cart:', updatedItem.name)
      return { success: true, item: updatedItem, cart: cartItems }
    } catch (error) {
      console.error('Error adding item to cart:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Function to remove item from cart
  window.removeItemFromCart = (productId, color = '', size = '') => {
    try {
      const cartItems = getCartFromStorage()
      const uniqueId = `${productId}-${color}-${size}`
      
      const newCart = cartItems.filter(item => 
        `${item.id}-${item.color}-${item.size}` !== uniqueId
      )
      
      localStorage.setItem('shopping_cart', JSON.stringify(newCart))
      localStorage.setItem('cart-last-updated', Date.now().toString())
      
      updateCartCount()
      window.dispatchEvent(new Event('cart-updated'))
      
      console.log('Item removed from cart:', productId)
      return { success: true, cart: newCart }
    } catch (error) {
      console.error('Error removing item from cart:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Function to update item quantity
  window.updateCartItemQuantity = (productId, newQuantity, color = '', size = '') => {
    try {
      if (newQuantity < 1) {
        return window.removeItemFromCart(productId, color, size)
      }
      
      const cartItems = getCartFromStorage()
      const uniqueId = `${productId}-${color}-${size}`
      
      const itemIndex = cartItems.findIndex(item => 
        `${item.id}-${item.color}-${item.size}` === uniqueId
      )
      
      if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity
        cartItems[itemIndex].updatedAt = Date.now()
        
        localStorage.setItem('shopping_cart', JSON.stringify(cartItems))
        localStorage.setItem('cart-last-updated', Date.now().toString())
        
        updateCartCount()
        window.dispatchEvent(new Event('cart-updated'))
        
        console.log('Cart item quantity updated:', productId, 'to', newQuantity)
        return { success: true, cart: cartItems }
      }
      
      return { success: false, error: 'Item not found in cart' }
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Function to get cart items
  window.getCartItems = () => {
    return getCartFromStorage()
  }
  
  // Function to get cart total
  window.getCartTotal = () => {
    const cartItems = getCartFromStorage()
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1))
    }, 0)
  }
  
  // Function to clear cart
  window.clearCart = () => {
    localStorage.setItem('shopping_cart', '[]')
    localStorage.setItem('cart-last-updated', Date.now().toString())
    
    updateCartCount()
    window.dispatchEvent(new Event('cart-updated'))
    
    console.log('Cart cleared')
  }
}

// 6. Notification function
const showCartNotification = (productName, quantity) => {
  // You can add notification logic here if needed
  console.log(`Added ${quantity}x ${productName} to cart`)
}

// ==================== EXISTING FUNCTIONS (UPDATED) ====================
// Fetch categories from API
const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    console.log('Fetching categories from API...')
   
    const response = await fetch('https://kartmania-api.vibrantick.org/common/product-category/read')
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
   
    const data = await response.json()
    console.log('Categories API Response:', data)
   
    if (data.data && Array.isArray(data.data)) {
      categories.value = data.data
      console.log('Categories loaded:', categories.value.length)
    } else {
      console.warn('No categories data found in response')
      categories.value = []
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

// Helper function to check active link
const isActiveLink = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Check if category is active
const isActiveCategory = (category) => {
  const currentCategory = route.query.category
  return currentCategory === category.name
}

// Check if category has subcategories
const hasSubCategories = (category) => {
  return (category.subCategories && category.subCategories.length > 0) ||
         ['men', 'women'].includes(category.name.toLowerCase())
}

// Get category image with fallback
const getCategoryImage = (category) => {
  if (category.logo) return category.logo
  if (category.image) return category.image
  return '/assets/images/category-placeholder.png'
}

// Get category link
const getCategoryLink = (category) => {
  return `/shop-all?category=${encodeURIComponent(category.name)}`
}

// Get banner title based on category
const getBannerTitle = (category) => {
  const categoryName = category.name.toLowerCase()
  if (categoryName.includes('men')) return 'MEN\'S COLLECTION'
  if (categoryName.includes('women')) return 'WOMEN\'S FASHION'
  if (categoryName.includes('mobile')) return 'LATEST SMARTPHONES'
  if (categoryName.includes('electronic')) return 'ELECTRONIC DEALS'
  if (categoryName.includes('kitchen')) return 'KITCHEN ESSENTIALS'
  return 'EXCLUSIVE COLLECTION'
}

// Get banner subtitle
const getBannerSubtitle = (category) => {
  const categoryName = category.name.toLowerCase()
  if (categoryName.includes('men')) return 'Trending styles for men'
  if (categoryName.includes('women')) return 'Latest fashion trends'
  if (categoryName.includes('mobile')) return 'Best smartphone deals'
  if (categoryName.includes('electronic')) return 'Tech gadgets & more'
  if (categoryName.includes('kitchen')) return 'Cook like a pro'
  return 'Shop the best products'
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

// Set active link
const setActiveLink = (link) => {
  console.log('Active link set to:', link)
}

// Open category menu on hover
const openCategoryMenu = (category) => {
  if (categoryMenuTimeout.value) {
    clearTimeout(categoryMenuTimeout.value)
  }
  if (hasSubCategories(category)) {
    activeCategoryMenu.value = category.id
  }
}

// Keep menu open when hovering over submenu
const keepCategoryMenuOpen = () => {
  if (categoryMenuTimeout.value) {
    clearTimeout(categoryMenuTimeout.value)
  }
}

// Close category menu
const closeCategoryMenu = () => {
  categoryMenuTimeout.value = setTimeout(() => {
    activeCategoryMenu.value = null
  }, 300)
}

// Close all menus
const closeAllMenus = () => {
  activeCategoryMenu.value = null
  showDropdown.value = false
  showMobileMenu.value = false
  enableBodyScroll()
}

// Toggle mobile category
const toggleMobileCategory = (categoryId) => {
  if (mobileOpenCategory.value === categoryId) {
    mobileOpenCategory.value = null
  } else {
    mobileOpenCategory.value = categoryId
  }
}

// Fetch logo from API
const fetchLogo = async () => {
  try {
    const response = await fetch('https://kartmania-api.vibrantick.org/common/media/read')
    if (response.ok) {
      const result = await response.json()
      const logoData = result.data?.find(item => item.id === 13 && item.category === 'LOGO')
      if (logoData) {
        logoImage.value = logoData.image
      }
    }
  } catch (error) {
    console.error('Error fetching logo:', error)
  }
}

// Fetch all products and search by name
const fetchProducts = async (query = '') => {
  if (!query.trim()) {
    searchResults.value = []
    mobileSearchResults.value = []
    return
  }
  loading.value = true
  try {
    const response = await fetch('https://kartmania-api.vibrantick.org/common/product/read')
   
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
   
    const result = await response.json()
    const allProducts = result.data || []
   
    // Filter products by name (case-insensitive)
    const filteredProducts = allProducts.filter(product => {
      const queryLower = query.toLowerCase().trim()
     
      // Search by name
      if (product.name?.toLowerCase().includes(queryLower)) {
        return true
      }
     
      // Search by description
      if (product.description?.toLowerCase().includes(queryLower)) {
        return true
      }
     
      // Search by category name
      if (product.category?.name?.toLowerCase().includes(queryLower)) {
        return true
      }
     
      return false
    })
   
    // Sort by relevance (name matches first)
    filteredProducts.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase())
      const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase())
     
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
   
    // Limit results
    searchResults.value = filteredProducts.slice(0, 8)
    mobileSearchResults.value = filteredProducts.slice(0, 6)
   
  } catch (err) {
    console.error('Error fetching products:', err)
    searchResults.value = []
    mobileSearchResults.value = []
  } finally {
    loading.value = false
  }
}

// Handle desktop search input
const handleSearchInput = () => {
  showDropdown.value = true
  const query = searchQuery.value.trim()
 
  if (window.searchDebounce) {
    clearTimeout(window.searchDebounce)
  }
 
  window.searchDebounce = setTimeout(() => {
    fetchProducts(query)
  }, 300)
}

// Handle mobile search
const handleMobileSearch = () => {
  const query = mobileSearchQuery.value.trim()
 
  if (window.mobileSearchDebounce) {
    clearTimeout(window.mobileSearchDebounce)
  }
 
  window.mobileSearchDebounce = setTimeout(() => {
    fetchProducts(query)
  }, 300)
}

// Handle desktop search submit
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    fetchProducts(query)
  }
}

// Handle mobile search submit
const handleMobileSearchSubmit = () => {
  const query = mobileSearchQuery.value.trim()
  if (query) {
    fetchProducts(query)
  }
}

// Get product image
const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary)
    return primaryImage?.imageUrl || product.images[0]?.imageUrl
  }
  return '/assets/images/thumbs/placeholder.png'
}

// Select product and navigate
const selectProduct = (product) => {
  showDropdown.value = false
  showMobileMenu.value = false
  searchQuery.value = product.name
 
  // Navigate to product page
  const productSlug = toKebabCase(product.groupId)
  console.log('Navigating to product:', productSlug)
 
  // Use router to navigate
  router.push(`/product/${product.name}--${productSlug}`)
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
 
  if (showMobileMenu.value) {
    disableBodyScroll()
  } else {
    enableBodyScroll()
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
  mobileOpenCategory.value = null
  enableBodyScroll()
}

// Handle phone call
const callPhone = () => {
  const phoneNumber = '+2871382023'
  if (confirm(`Call ${phoneNumber}?`)) {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`
  }
  closeMobileMenu()
}

// Handle input blur
const onInputBlur = () => {
  // Small delay to allow click event to fire
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// Disable body scroll
const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
}

// Enable body scroll
const enableBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const searchWrapper = document.querySelector('.search-form__wrapper')
  const dropdown = document.querySelector('.search-dropdown')
 
  if (searchWrapper && dropdown &&
      !searchWrapper.contains(event.target) &&
      !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
 
  // Close category menu when clicking outside
  const categoryMenus = document.querySelectorAll('.category-menu-item, .category-submenu')
  let isInsideCategoryMenu = false
 
  categoryMenus.forEach(menu => {
    if (menu.contains(event.target)) {
      isInsideCategoryMenu = true
    }
  })
 
  if (!isInsideCategoryMenu) {
    activeCategoryMenu.value = null
  }
}

// Update active link when route changes
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath)
 
  closeDropdown()
  closeMobileMenu()
  activeCategoryMenu.value = null
})

// Initialize
onMounted(() => {
  console.log('Header component mounted')
 
  fetchLogo()
  fetchCategories()
 
  // Initialize cart system
  updateCartCount()
  updateWishlistCount()
  setupCartEventSystem()
 
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
onUnmounted(() => {
  console.log('Header component unmounted')
  
  // Cleanup polling interval
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  
  document.removeEventListener('click', handleClickOutside)
  if (categoryMenuTimeout.value) {
    clearTimeout(categoryMenuTimeout.value)
  }
  enableBodyScroll()
})
</script>

<style scoped>
/* ==================== ENHANCED CART BADGE STYLES ==================== */
/* Small Cart Badge - Size Reduced */
.wishlist-icon {
  position: relative;
}

.wishlist-badge {
  position: absolute;
  top: -6px;      /* icon ke upar */
  right: -6px;    /* right side */
  
  width: 16px;
  height: 16px;
  
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: #ff3b3b;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.cart-badge {
  animation: badgePulse 0.5s ease;
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.3); 
  transition: all 0.3s ease;
  background-color:  #ff3b3b;
  font-weight: 600; 
  font-size: 9px !important; /* Smaller font size */ 
  min-width: 16px !important; /* Smaller width */
  height: 16px !important; /* Smaller height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1px !important; /* Reduced padding */
  position: absolute;
  top: -6px !important; /* Adjusted position */
  right: -6px !important; /* Adjusted position */
  line-height: 1;
  z-index: 10;
}

/* Mobile badge size */
.mobile-badge {
  min-width: 14px !important;
  height: 14px !important;
  font-size: 8px !important;
  top: -3px !important;
  right: -3px !important;
}

/* Badge animation */
.cart-badge-pulse { 
  animation: strongPulse 0.3s ease-in-out;
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes strongPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 6px rgba(52, 152, 219, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

/* Cart Link Hover Effect */
.cart-link:hover .cart-badge {
  transform: scale(1.05);
  box-shadow: 0 3px 8px rgba(52, 152, 219, 0.3);
}

/* ==================== OTHER EXISTING STYLES ==================== */
.header {
  position: relative;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #e1e5e9;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-height: 70px;
  display: flex;
  align-items: center;
  overflow: visible;
}

.container-lg {
  width: 100%;
  box-sizing: border-box;
}

/* ==================== FIXED LAYOUT - NO COLLAPSE ==================== */
.header-inner {
  display: flex !important;
  align-items: center !important;
  width: 100%;
  min-height: 70px;
  gap: 0 !important;
  justify-content: space-between !important;
}

/* LOGO - LEFT SIDE */
.logo {
  flex: 0 0 auto !important;
  margin-right: auto !important;
  padding-left: 0 !important;
  min-width: 120px;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
  display: block;
}

/* NAVIGATION - CENTER (NO COLLAPSE) */
.header-menu {
  flex: 0 0 auto !important;
  margin: 0 auto !important;
  position: relative !important;
  left: 0 !important;
  transform: none !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-width: 400px;
  max-width: 600px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  height: 70px;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
}

.nav-menu__item {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.nav-menu__link {
  position: relative;
  text-decoration: none !important;
  color: #2c3e50 !important;
  transition: all 0.2s ease;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.4;
  height: 100%;
  min-width: 0;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
}

/* Professional underline effect */
.nav-menu__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3498db;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center;
}

.nav-menu__link:hover::after,
.nav-menu__item:hover .nav-menu__link::after {
  transform: scaleX(1);
}

.nav-menu__link:hover,
.nav-menu__item:hover .nav-menu__link {
  color: #2980b9 !important;
}

.nav-menu__link.active {
  color: #3498db !important;
  font-weight: 700;
}

.nav-menu__link.active::after {
  transform: scaleX(1);
  background: #3498db;
}

/* Dropdown arrow styling */
.nav-menu__link i {
  font-size: 12px;
  margin-left: 6px;
  transition: transform 0.3s ease;
  vertical-align: middle;
  color: #7f8c8d;
}

.nav-menu__item:hover .nav-menu__link i {
  transform: rotate(180deg);
  color: #3498db;
}

/* RIGHT SECTION - NO COLLAPSE */
.header-search {
  flex: 0 0 auto !important;
  margin-left: auto !important;
  margin-right: 20px !important;
  min-width: 300px;
  max-width: 350px;
  flex-shrink: 0;
}

.header-right {
  flex: 0 0 auto !important;
  margin-left: 0 !important;
  flex-shrink: 0;
}

/* ==================== SEARCH BAR STYLES ==================== */
.search-form-compact {
  width: 100%;
}

.compact-search-input {
  width: 100%;
  border: 1px solid #e1e5e9;
  background: #f8f9fa;
  font-size: 14px;
  color: #2c3e50;
  outline: none;
  transition: all 0.2s ease;
  border-radius: 4px;
  height: 40px;
  padding: 0 42px 0 16px;
  box-sizing: border-box;
}

.compact-search-input:focus {
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.compact-search-input::placeholder {
  color: #95a5a6;
  font-size: 14px;
  font-weight: 400;
}

.compact-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  background: transparent;
  color: #95a5a6;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.compact-search-btn:hover {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.compact-search-btn i {
  font-size: 16px;
}

/* ==================== HEADER ICONS ==================== */
.flex-align {
  display: flex !important;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.item-hover {
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  color: #4a5568;
  cursor: pointer;
  flex-shrink: 0;
  text-decoration: none;
}

.item-hover:hover {
  background: #f8f9fa;
  color: #3498db;
}

.item-hover i {
  font-size: 18px;
}

/* ==================== CATEGORY SUBMENU STYLES ==================== */
.category-menu-item {
  position: static;
}

.category-submenu {
  position: absolute;
  top: 100% !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 90vw !important;
  max-width: 1200px !important;
  background: white;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  z-index: 99998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid #e1e5e9;
  border-top: 2px solid #3498db;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translate(-50%, 8px);
  padding: 0;
  transition-delay: 0.15s;
}

.category-menu-item:hover .category-submenu,
.category-submenu:hover {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0) !important;
  transition-delay: 0s;
}

.category-submenu-content {
  display: flex;
  padding: 24px;
  gap: 24px;
  min-height: 350px;
  width: 100%;
  box-sizing: border-box;
}

.subcategory-columns {
  flex: 4;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding-right: 24px;
  border-right: 1px solid #ecf0f1;
  min-width: 0;
}

/* Dynamic grid based on category */
.category-menu-item:nth-child(2) .subcategory-columns {
  grid-template-columns: repeat(4, 1fr);
}
.category-menu-item:nth-child(3) .subcategory-columns {
  grid-template-columns: repeat(3, 1fr);
}
.category-menu-item:nth-child(4) .subcategory-columns {
  grid-template-columns: repeat(3, 1fr);
}
.category-menu-item:nth-child(5) .subcategory-columns {
  grid-template-columns: repeat(2, 1fr);
}
.category-menu-item:nth-child(6) .subcategory-columns {
  grid-template-columns: repeat(2, 1fr);
}

.subcategory-column {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.subcategory-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #ecf0f1;
  white-space: nowrap;
}

.subcategory-item {
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: #34495e;
  font-size: 14px;
  transition: all 0.2s ease;
  line-height: 1.4;
  font-weight: 400;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.subcategory-item:hover {
  color: #3498db;
  padding-left: 8px;
}

.subcategory-item::before {
  content: '→';
  position: absolute;
  left: -12px;
  opacity: 0;
  transition: all 0.2s ease;
  color: #3498db;
}

.subcategory-item:hover::before {
  opacity: 1;
  left: 0;
}

/* Dynamic Subcategories Styles */
.subcategory-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  background: #f8f9fa;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

.subcategory-title:hover {
  background: #ecf0f1;
  color: #3498db;
}

.subcategory-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
  border: 1px solid #e1e5e9;
}

.subcategory-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.subcategory-title:hover .subcategory-icon img {
  transform: scale(1.05);
}

.subcategory-name {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subsubcategory-list {
  margin-left: 44px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  width: calc(100% - 44px);
}

.subsubcategory-item {
  padding: 6px 8px;
  text-decoration: none;
  color: #4a5568;
  font-size: 13px;
  border-radius: 3px;
  transition: all 0.2s ease;
  position: relative;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
}

.subsubcategory-item:hover {
  color: #3498db;
  background: #f8f9fa;
}

.subsubcategory-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 3px;
  background: #3498db;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.subsubcategory-item:hover::before {
  opacity: 1;
}

.subsubsubcategory-list {
  margin-left: 16px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: calc(100% - 16px);
}

.subsubsubcategory-item {
  padding: 4px 8px;
  text-decoration: none;
  color: #718096;
  font-size: 12px;
  border-radius: 3px;
  transition: all 0.2s ease;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
}

.subsubsubcategory-item:hover {
  color: #3498db;
  background: #f8f9fa;
}

/* Banner Section - Professional Theme */
.category-banner {
  flex: 1;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  min-height: 350px;
  background: linear-gradient(135deg, #f1f8ff 0%, #e8f4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #dbeafe;
  min-width: 280px;
  max-width: 350px;
  flex-shrink: 0;
}

.banner-content {
  padding: 24px;
  color: #2c3e50;
  width: 100%;
}

.banner-content h4 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #2c3e50;
  line-height: 1.2;
  word-wrap: break-word;
}

.banner-content p {
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 20px;
  opacity: 0.9;
  line-height: 1.5;
  word-wrap: break-word;
}

.banner-button {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 10px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.banner-button:hover {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

/* ==================== SEARCH DROPDOWN ==================== */
.search-dropdown {
  max-height: 450px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3498db #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.search-dropdown::-webkit-scrollbar {
  width: 6px;
}

.search-dropdown::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.search-dropdown::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 3px;
}

.search-dropdown::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}

.product-result {
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
}

.product-result:last-child {
  border-bottom: none;
}

.product-result:hover {
  background-color: #f8f9fa;
}

/* ==================== RESPONSIVE DESIGN - FIXED ==================== */
@media (min-width: 1200px) {
  .nav-menu {
    gap: 35px;
  }
  
  .nav-menu__link {
    min-width: 90px;
  }
  
  .header-menu {
    min-width: 500px;
    max-width: 700px;
  }
}

@media (max-width: 1199px) and (min-width: 992px) {
  .nav-menu {
    gap: 20px;
  }
  
  .nav-menu__link {
    min-width: 70px;
    font-size: 13px;
  }
  
  .header-search {
    min-width: 250px;
    max-width: 300px;
    margin-right: 15px !important;
  }
  
  .header-menu {
    min-width: 350px;
    max-width: 500px;
  }
  
  .category-submenu {
    width: 95vw !important;
    max-width: 1100px !important;
  }
}

@media (max-width: 991px) {
  .header-menu {
    display: none !important;
  }
  
  .header-search {
    min-width: 200px;
    max-width: 250px;
    margin-right: 15px !important;
  }
  
  .logo {
    min-width: 100px;
  }
}

@media (max-width: 767px) {
  .container-lg {
    padding: 0 15px !important;
  }
  
  .logo-img {
    height: 35px;
  }
  
  .header-search {
    display: none !important;
  }
  
  .flex-align {
    gap: 10px;
  }
  
  .item-hover {
    width: 36px;
    height: 36px;
  }
  
  .item-hover i {
    font-size: 16px;
  }
  
  .cart-badge {
    min-width: 12px !important;
    height: 12px !important;
    font-size: 7px !important;
    top: -2px !important;
    right: -2px !important;
  }
}

/* ==================== MOBILE MENU STYLES ==================== */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-overlay.show {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow-y: auto;
  border-right: 1px solid #e1e5e9;
}

.mobile-menu-sidebar.mobile-menu-show {
  left: 0;
}

.mobile-menu-header {
  padding: 1.5rem 1.25rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-logo {
  height: 28px;
  width: auto;
  filter: brightness(0) invert(1);
}

.mobile-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.mobile-search-section {
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px;
}

.mobile-search-input {
  width: 100%;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 14px;
  color: #374151;
  outline: none;
  transition: all 0.2s ease;
  border-radius: 4px;
  height: 40px;
  padding: 0 42px 0 16px;
}

.mobile-search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.mobile-menu-content {
  padding: 1rem 0;
  flex: 1;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: #374151;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  font-family: inherit;
  cursor: pointer;
}

.mobile-menu-item:hover {
  background: #f8f9fa;
  border-left-color: #3498db;
}

.mobile-menu-item.active-mobile {
  background: rgba(52, 152, 219, 0.1);
  border-left-color: #3498db;
  color: #3498db;
  font-weight: 600;
}

.menu-icon {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5568;
  flex-shrink: 0;
  font-size: 1rem;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-menu-item:hover .menu-icon,
.mobile-menu-item.active-mobile .menu-icon {
  background: white;
  color: #3498db;
}

.category-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.mobile-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Mobile subcategories */
.mobile-subcategories {
  padding-left: 20px;
  background: #f8f9fa;
}

.mobile-subcategory-section {
  padding: 12px 0;
}

.mobile-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  padding: 0 1.25rem;
  text-transform: uppercase;
}

.mobile-subcategory-item {
  display: block;
  padding: 8px 1.25rem;
  text-decoration: none;
  color: #4a5568;
  font-size: 14px;
  transition: all 0.2s ease;
}

.mobile-subcategory-item:hover {
  color: #3498db;
  background: #ecf0f1;
}

.mobile-subsubcategory-item {
  display: block;
  padding: 6px 1.25rem 6px 2rem;
  text-decoration: none;
  color: #718096;
  font-size: 13px;
  transition: all 0.2s ease;
}

.mobile-subsubcategory-item:hover {
  color: #3498db;
}

.mobile-user-section {
  border-top: 1px solid #e1e5e9;
  padding-top: 16px;
  margin-top: 16px;
}

/* ==================== HOVER FIXES ==================== */
.category-menu-item:hover .category-submenu,
.category-submenu:hover,
.category-submenu:hover ~ .category-submenu::before {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translate(-50%, 0) !important;
  transition-delay: 0s !important;
}

/* Ensure banner is visible in Women category */
.category-submenu .category-banner {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Fix for dropdown positioning */
.category-submenu {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

/* Prevent elements from collapsing */
.header-menu,
.header-search,
.header-right {
  flex-shrink: 0 !important;
  min-width: 0 !important;
  overflow: visible !important;
}

/* Ensure navigation doesn't go behind search */
.header-inner {
  position: relative;
  overflow: visible !important;
}

.header-menu {
  z-index: 1 !important;
}

.header-search {
  z-index: 2 !important;
}
</style>