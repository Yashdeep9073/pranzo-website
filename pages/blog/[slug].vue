<template>
  <section class="blog-details py-80">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-80">
      <div class="spinner-border text-main-600" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-20 text-gray-600">Blog details load ho rahe hain...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-80">
      <div class="alert alert-danger">
        <h6 class="mb-16">Error!</h6>
        <p>{{ error.message }}</p>
        <button @click="refresh" class="btn btn-main mt-16">
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content when blogDetail is available -->
    <div v-else-if="blogDetail" class="container container-lg">
      <div class="row gy-5">
        <!-- Blog Content -->
        <div class="col-lg-8 pe-xl-4">
          <div class="blog-item-wrapper">
            <div class="blog-item">
              <img :src="primaryImageUrl" :alt="blogDetail.title" 
                   class="cover-img rounded-16" loading="lazy" @error="handleImageError">
              <div class="blog-item__content mt-24">
                <span class="bg-main-50 text-main-600 py-4 px-24 rounded-8 mb-16">
                  {{ blogDetail.category?.name || 'Uncategorized' }}
                </span>
                <h4 class="mb-24">{{ blogDetail.title }}</h4>
                
                <!-- Content paragraphs -->
                <div v-if="blogDetail.content" class="blog-content">
                  <div class="text-gray-700 mb-24" v-html="formatContent(blogDetail.content)"></div>
                </div>
                
                <!-- Fallback content -->
                <div v-else>
                  <p class="text-gray-700 mb-24">
                    A great commerce experience cannot be distilled to a single number.
                  </p>
                </div>

                <!-- Meta Info -->
                <div class="flex-align flex-wrap gap-24">
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-calendar-dots"></i></span>
                    <span class="text-sm text-gray-500">
                      <NuxtLink :to="`/person/${blogDetail.slug}`" class="text-gray-500 hover-text-main-600">
                        {{ formatDate(blogDetail.createdAt) }}
                      </NuxtLink>
                    </span>
                  </div>
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-chats-circle"></i></span>
                    <span class="text-sm text-gray-500">
                      <a href="#comments" class="text-gray-500 hover-text-main-600">
                        {{ comments.length }} Comments
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Images Section -->
          <div class="mt-48" v-if="additionalImages.length > 0">
            <div class="row gy-4">
              <div class="col-sm-6 col-xs-6" v-for="(image, index) in additionalImages" :key="image.id">
                <img :src="image.imageUrl" :alt="`Blog image ${index + 1}`" class="rounded-16">
              </div>
            </div>
          </div>

          <!-- Features List -->
          <div class="mt-48" v-if="extractedFeatures.length > 0">
            <h6 class="mb-32">Key Features:</h6>
            <div class="row gy-4">
              <div class="col-sm-6" v-for="(column, colIndex) in chunkArray(extractedFeatures, Math.ceil(extractedFeatures.length/2))" :key="colIndex">
                <ul>
                  <li class="d-flex align-items-start gap-8 mb-20" v-for="(feature, index) in column" :key="index">
                    <span class="text-xl d-flex flex-shrink-0"><i class="ph ph-check"></i></span>
                    <span class="text-gray-700 flex-grow-1">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Testimonial Section -->
          <div class="mt-48">
            <div class="rounded-16 bg-main-50 p-24">
              <span class="w-48 h-48 bg-main-600 text-white flex-center rounded-circle mb-24 text-2xl">
                <i class="ph ph-quotes"></i>
              </span>
              <p class="text-gray-700 mb-24">
                {{ blogDetail.title }} represents a significant evolution of the internet.
              </p>
              <div class="flex-align gap-8">
                <span v-for="star in 5" :key="star" class="text-15 fw-medium text-neutral-600 d-flex">
                  <i class="ph-fill ph-star"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Tags Section -->
          <div class="mt-48">
            <div class="flex-align gap-8">
              <h6 class="mb-0">Tag:</h6>
              <NuxtLink to="/person" class="border border-gray-100 rounded-4 py-6 px-8 hover-bg-gray-100 text-gray-900">
                {{ blogDetail.category?.name || 'Uncategorized' }}
              </NuxtLink>
            </div>
          </div>

          <!-- Navigation -->
          <div class="my-48">
            <span class="border-bottom border-gray-100 d-block"></span>
          </div>

          <div class="my-48 flex-between flex-sm-nowrap flex-wrap gap-24">
            <div>
              <NuxtLink to="/person" class="text-gray-500 hover-text-main-600">
                <button type="button" class="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600">
                  ← All Blogs
                </button>
              </NuxtLink>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="my-48" id="comments">
            <h6 class="mb-48">Comments ({{ comments.length }})</h6>
            
            <!-- Comment Form -->
            <form @submit.prevent="submitComment" class="mb-48">
              <h6 class="mb-24">Leave a Comment</h6>
              <div class="row gy-4">
                <div class="col-sm-6 col-xs-6">
                  <label for="name" class="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Full Name</label>
                  <input type="text" class="common-input px-16" id="name" placeholder="Full name" v-model="commentForm.name" required>
                </div>
                <div class="col-sm-6 col-xs-6">
                  <label for="email" class="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Email Address</label>
                  <input type="email" class="common-input px-16" id="email" placeholder="Email address" v-model="commentForm.email" required>
                </div>
                <div class="col-sm-12">
                  <label for="message" class="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Message</label>
                  <textarea class="common-input px-16" id="message" 
                    placeholder="What's your thought about this blog..." 
                    v-model="commentForm.message" required></textarea>
                </div>
                <div class="col-sm-12 mt-32">
                  <button type="submit" class="btn btn-main py-18 px-32 rounded-8" :disabled="submittingComment">
                    {{ submittingComment ? 'Posting...' : 'Post Comment' }}
                  </button>
                </div>
              </div>
            </form>

            <!-- Comments List -->
            <div v-if="comments.length > 0">
              <div v-for="comment in comments" :key="comment.id" 
                   class="d-flex align-items-start gap-16 mb-32 pb-32 border-bottom border-gray-100">
                <img :src="comment.avatar" alt=""
                     class="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0" @error="handleAvatarError">
                <div class="flex-grow-1">
                  <div class="flex-align gap-8">
                    <h6 class="text-md fw-bold mb-0">{{ comment.name }}</h6>
                    <span class="w-6 h-6 bg-gray-500 rounded-circle"></span>
                    <span class="text-sm fw-medium text-gray-700">{{ formatDate(comment.date) }}</span>
                  </div>
                  <p class="mt-16 text-gray-700">{{ comment.message }}</p>
                </div>
              </div>
            </div>

            <!-- No Comments -->
            <div v-else class="text-center py-40">
              <p class="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4 ps-xl-4">
          <!-- Search Widget -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Search Here</h6>
            <form @submit.prevent="handleSearch">
              <div class="input-group">
                <input type="text" class="form-control common-input bg-color-three" placeholder="Searching..."
                  v-model="sidebarSearch">
                <button type="submit" class="btn btn-main text-2xl h-56 w-56 flex-center text-2xl input-group-text">
                  <i class="ph ph-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- Recent Posts -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Recent Posts</h6>
            <div class="text-center py-20">
              <p class="text-gray-600">More blogs coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Blog Found -->
    <div v-else class="container container-lg">
      <div class="text-center py-80">
        <h6 class="text-xl mb-16">Blog not found</h6>
        <p class="text-gray-600 mb-24">The blog you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/person" class="btn btn-main py-12 px-32 rounded-8">
          Back to Blogs
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Remove onMounted and watch imports
const route = useRoute()
const router = useRouter()

// Get slug from route
const slug = route.params.slug

// API URL
const BLOG_DETAIL_API = `https://kartmania-api.vibrantick.org/common/blog/read/slug/${slug}`
const DEFAULT_IMAGE = '/assets/images/thumbs/default-blog.png'

// Set page title
useHead({
  title: `Blog - ${slug}`,
  meta: [
    {
      name: 'description',
      content: `Read our detailed blog post about ${slug}`
    }
  ]
})

// State
const commentForm = ref({
  name: '',
  email: '',
  message: ''
})
const submittingComment = ref(false)
const comments = ref([
  {
    id: 1,
    name: 'Marvin McKinney',
    avatar: '/assets/images/thumbs/comment-img1.png',
    date: '2024-04-26',
    message: 'In a nisi commodo, porttitor ligula consequat, tincidunt dui.'
  },
  {
    id: 2,
    name: 'Kristin Watson',
    avatar: '/assets/images/thumbs/comment-img2.png',
    date: '2024-04-24',
    message: 'Quisque eget tortor lobortis, facilisis metus eu, elementum est.'
  }
])

// Fetch blog detail with proper error handling
const { data: blogDetail, pending, error, refresh } = await useLazyAsyncData(
  `blog-${slug}`,
  async () => {
    try {
      const response = await $fetch(BLOG_DETAIL_API)
      
      if (!response || !response.data) {
        throw new Error('Blog not found')
      }
      
      return response.data
    } catch (err) {
      console.error('Error fetching blog:', err)
      throw err
    }
  }
)

// Computed properties
const primaryImageUrl = computed(() => {
  if (!blogDetail.value?.images || !Array.isArray(blogDetail.value.images)) {
    return DEFAULT_IMAGE
  }
  
  const primaryImage = blogDetail.value.images.find(img => img.isPrimary)
  const firstImage = blogDetail.value.images[0]
  
  return primaryImage?.imageUrl || firstImage?.imageUrl || DEFAULT_IMAGE
})

const additionalImages = computed(() => {
  if (!blogDetail.value?.images || !Array.isArray(blogDetail.value.images)) {
    return []
  }
  
  return blogDetail.value.images.filter(img => !img.isPrimary).slice(0, 2)
})

const extractedFeatures = computed(() => {
  if (!blogDetail.value?.content) return []
  
  const content = blogDetail.value.content
  const features = []
  
  // Look for numbered items
  const numberMatches = content.match(/\d+\.\s+[^.\n]+/g)
  if (numberMatches) {
    features.push(...numberMatches.map(m => m.replace(/^\d+\.\s+/, '')))
  }
  
  // Look for bullet points
  const bulletMatches = content.match(/[-•*]\s+[^.\n]+/g)
  if (bulletMatches) {
    features.push(...bulletMatches.map(m => m.replace(/^[-•*]\s+/, '')))
  }
  
  return features.slice(0, 6)
})

// Format content for display
function formatContent(content) {
  if (!content) return ''
  
  return content
    .split('\n')
    .filter(para => para.trim())
    .map(para => `<p class="mb-24">${para.trim()}</p>`)
    .join('')
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Unknown date'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

// Chunk array for features
function chunkArray(array, chunkSize) {
  if (!array || !Array.isArray(array)) return []
  
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

// Handle search
function handleSearch() {
  if (sidebarSearch?.value?.trim()) {
    router.push(`/person?search=${encodeURIComponent(sidebarSearch.value.trim())}`)
  }
}

// Handle image error
function handleImageError(event) {
  event.target.src = DEFAULT_IMAGE
}

// Handle avatar error
function handleAvatarError(event) {
  event.target.src = '/assets/images/thumbs/default-avatar.png'
}

// Submit comment
async function submitComment() {
  if (!commentForm.value.name || !commentForm.value.email || !commentForm.value.message) {
    alert('Please fill all fields')
    return
  }
  
  submittingComment.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newComment = {
      id: comments.value.length + 1,
      name: commentForm.value.name,
      avatar: '/assets/images/thumbs/default-avatar.png',
      date: new Date().toISOString(),
      message: commentForm.value.message
    }
    
    comments.value.unshift(newComment)
    
    commentForm.value = {
      name: '',
      email: '',
      message: ''
    }
    
    alert('Comment submitted successfully!')
  } catch (err) {
    console.error('Error submitting comment:', err)
    alert('Failed to submit comment. Please try again.')
  } finally {
    submittingComment.value = false
  }
}

// Watch for slug changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    // Use navigateTo for proper client-side navigation
    navigateTo(`/person/${newSlug}`)
  }
})
</script>

<style scoped>
.cover-img {
  object-fit: cover;
  height: 400px;
  width: 100%;
}

.blog-content :deep(p) {
  margin-bottom: 1.5rem;
  color: #374151;
}

.blog-content :deep(p:first-of-type) {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
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

.text-line-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

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
  
  .cover-img {
    height: 250px;
  }
}
</style>