<template>
  <section class="blog py-80">
    <div class="container container-lg">
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-20 text-gray-600">Blogs load ho rahe hain...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-80">
        <div class="alert alert-danger">
          <h6 class="mb-16">Error!</h6>
          <p>{{ error.message }}</p>
          <button @click="refreshBlogs" class="btn btn-main mt-16">
            Try Again
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="row gy-5">
        <!-- Main Content Area -->
        <div class="col-lg-8 pe-xl-4">
          <!-- Blog Items -->
          <div class="blog-item-wrapper">
            <div v-for="(post, index) in paginatedBlogPosts" :key="post.slug" class="blog-item"
              :class="{ 'mb-40': index < paginatedBlogPosts.length - 1 }">
              <NuxtLink :to="`/blog/${post.slug}`" class="w-100 h-100 rounded-16 overflow-hidden block">
                <img :src="post.image" :alt="post.title" class="cover-img w-100" loading="lazy"
                  @error="handleImageError" />
              </NuxtLink>
              <div class="blog-item__content mt-24">
                <span class="bg-main-50 text-main-600 py-4 px-24 rounded-8 mb-16 inline-block">
                  {{ post.category }}
                </span>
                <h6 class="text-2xl mb-24">
                  <NuxtLink :to="`/blog/${post.slug}`" class="text-neutral-900 hover-text-main-600">
                    {{ post.title }}
                  </NuxtLink>
                </h6>
                <p class="text-gray-700 text-line-2">{{ post.excerpt }}</p>

                <div class="flex-align flex-wrap gap-24 pt-24 mt-24 border-top border-gray-100">
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-calendar-dots"></i></span>
                    <span class="text-sm text-gray-500">
                      <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                        {{ post.date }}
                      </NuxtLink>
                    </span>
                  </div>
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-chats-circle"></i></span>
                    <span class="text-sm text-gray-500">
                      <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                        {{ post.comments }} Comments
                      </NuxtLink>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Blogs Message -->
          <div v-if="!blogPosts || blogPosts.length === 0" class="text-center py-80">
            <h6 class="text-xl mb-16">No blogs found</h6>
            <p class="text-gray-600">Abhi koi blog available nahi hai.</p>
          </div>

          <!-- Pagination -->
          <ul v-if="blogPosts && blogPosts.length > 0" class="pagination flex-align flex-wrap gap-16 mt-40">
            <li class="page-item">
              <button
                class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">
                <i class="ph-bold ph-arrow-left"></i>
              </button>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button
                class="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :class="{ 'bg-main-600 text-white border-main-600': page === currentPage }"
                @click="handlePageChange(page)">
                {{ page.toString().padStart(2, '0') }}
              </button>
            </li>
            <li class="page-item">
              <button
                class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)">
                <i class="ph-bold ph-arrow-right"></i>
              </button>
            </li>
          </ul>
        </div>

        <!-- Sidebar -->
        <div v-if="blogPosts && blogPosts.length > 0" class="col-lg-4 ps-xl-4">
          <!-- Search Widget -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Search Here</h6>
            <form @submit.prevent="handleSearch">
              <div class="input-group">
                <input type="text" class="form-control common-input bg-color-three" placeholder="Searching..."
                  v-model="searchQuery">
                <button type="submit" class="btn btn-main text-2xl h-56 w-56 flex-center text-2xl input-group-text">
                  <i class="ph ph-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- Recent Posts Widget -->
          <div v-if="recentPosts.length > 0" class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Recent Posts</h6>
            <div v-for="(post, index) in recentPosts" :key="post.slug"
              class="d-flex align-items-center flex-sm-nowrap flex-wrap gap-24 mb-16"
              :class="{ 'mb-0': index === recentPosts.length - 1 }">
              <NuxtLink :to="`/blog/${post.slug}`"
                class="w-100 h-100 rounded-4 overflow-hidden w-120 h-120 flex-shrink-0 block">
                <img :src="post.image" :alt="post.title" class="cover-img" loading="lazy" @error="handleImageError" />
              </NuxtLink>
              <div class="flex-grow-1">
                <h6 class="text-lg">
                  <NuxtLink :to="`/blog/${post.slug}`" class="text-line-3 text-neutral-900 hover-text-main-600">
                    {{ post.title }}
                  </NuxtLink>
                </h6>
                <div class="flex-align flex-wrap gap-8">
                  <span class="text-lg text-main-600"><i class="ph ph-calendar-dots"></i></span>
                  <span class="text-sm text-gray-500">
                    <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                      {{ post.date }}
                    </NuxtLink>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Widget -->
          <div v-if="categories.length > 0" class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Categories</h6>
            <ul>
              <li v-for="(category, index) in categories" :key="category.slug" class="mb-16"
                :class="{ 'mb-0': index === categories.length - 1 }">
                <NuxtLink :to="`/blog/category/${category.slug}`"
                  class="flex-between gap-8 text-gray-700 border border-gray-100 rounded-4 p-4 ps-16 hover-border-main-600 hover-text-main-600">
                  <span>{{ category.name }} ({{ category.count }})</span>
                  <span class="w-40 h-40 flex-center rounded-4 bg-main-50 text-main-600">
                    <i class="ph ph-arrow-right"></i>
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- No Categories Message -->
          <div v-else class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Categories</h6>
            <p class="text-gray-600">No categories found</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
const config = useRuntimeConfig();

// API URL
const API_URL = config.public.api.blogs;
const DEFAULT_IMAGE = '/assets/images/thumbs/default-blog.png' // Tumhara default image path

// Pagination settings
const itemsPerPage = ref(3)
const currentPage = ref(1)
const searchQuery = ref('')

// Fetch blogs from API
const { data: blogPosts, pending, error, refresh: refreshBlogs } = await useAsyncData('blogs',
  async () => {
    try {
      console.log('Fetching blogs from API...')
      const response = await $fetch(API_URL)

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid API response:', response)
        return []
      }

      console.log(`Successfully fetched ${response.data.length} blogs`)

      // Transform API data to match our template
      return response.data.map((blog, index) => {
        // Find primary image or use first image
        const primaryImage = blog.images?.find(img => img.isPrimary)
        const firstImage = blog.images?.[0]

        // Create excerpt from content (first 150 characters)
        const excerpt = blog.content
          ? blog.content.replace(/\n/g, ' ').substring(0, 150) + '...'
          : 'No content available...'

        // Generate a date (since API doesn't provide one)
        const date = new Date()
        date.setDate(date.getDate() - index) // Just for demo - older posts get older dates

        return {
          id: blog.slug || `blog-${index}`,
          title: blog.title || 'Untitled Blog',
          excerpt: excerpt,
          image: primaryImage?.imageUrl || firstImage?.imageUrl || DEFAULT_IMAGE,
          category: blog.category?.name || 'Uncategorized',
          date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          comments: 0, // API doesn't provide comments count
          slug: blog.slug || `blog-${index}`,
          originalData: blog // Keep original data if needed
        }
      })
    } catch (err) {
      console.error('Error fetching blogs:', err)
      throw err
    }
  }
)

// Recent Posts (first 4 posts)
const recentPosts = computed(() => {
  if (!blogPosts.value || blogPosts.value.length === 0) return []

  return blogPosts.value.slice(0, 4).map(post => ({
    id: post.slug,
    title: post.title,
    image: post.image,
    date: post.date,
    slug: post.slug
  }))
})

// Categories from blog posts
const categories = computed(() => {
  if (!blogPosts.value || blogPosts.value.length === 0) return []

  const categoryCount = {}

  blogPosts.value.forEach(post => {
    const categoryName = post.category || 'Uncategorized'
    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
  })

  return Object.keys(categoryCount).map(cat => ({
    name: cat,
    count: categoryCount[cat],
    slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'uncategorized'
  }))
})

// Search functionality
const filteredBlogs = computed(() => {
  if (!blogPosts.value) return []

  if (!searchQuery.value.trim()) return blogPosts.value

  const query = searchQuery.value.toLowerCase().trim()
  return blogPosts.value.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query)
  )
})

// Pagination calculations
const totalPages = computed(() =>
  Math.ceil(filteredBlogs.value.length / itemsPerPage.value) || 1
)

const paginatedBlogPosts = computed(() => {
  if (!filteredBlogs.value || filteredBlogs.value.length === 0) return []

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredBlogs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const maxVisible = 7
  const pages = []

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    console.log('Page changed to:', page)

    // Scroll to top on page change
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value.trim())
    currentPage.value = 1 // Reset to first page on new search
  }
}

const handleImageError = (event) => {
  console.log('Image failed to load, using default image')
  event.target.src = DEFAULT_IMAGE
}

// Watch for changes in filteredBlogs to reset page
watch(filteredBlogs, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})
</script>

<style scoped>
/* Optional additional styles */
.cover-img {
  object-fit: cover;
  height: 100%;
  max-height: 400px;
  min-height: 250px;
}

.blog-item {
  transition: all 0.3s ease;
}

.blog-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.page-link {
  transition: all 0.3s ease;
  cursor: pointer;
}

.page-link:hover:not(:disabled) {
  border-color: var(--main-600);
  background-color: var(--main-50);
}

.page-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-line-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Loading spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}

.alert {
  border-radius: 8px;
  padding: 24px;
  background-color: #fee;
  border: 1px solid #fcc;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .pe-xl-4 {
    padding-right: 0 !important;
  }

  .ps-xl-4 {
    padding-left: 0 !important;
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .py-80 {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }

  .w-120 {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>