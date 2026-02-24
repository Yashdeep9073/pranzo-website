<template>
  <section class="newsletter-new">
    <div class="container container-lg">
      <div  
        class="py-20 px-80-px bg-neutral-100 rounded-12 d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap gap-32">
        <div class="max-w-700 position-relative w-100 text-center text-sm-start" ref="dropdownRef">
          <h3 class="mb-30">
            Stay home & get your daily needs from our shop
          </h3>
          <!-- FORM --> 
          <form class="d-flex gap-8 flex-wrap flex-sm-nowrap position-relative" @submit.prevent="subscribeNewsletter">
            <input 
              v-model="email" 
              type="email"
              class="form-control bg-white px-20 shadow-none py-16 rounded placeholder-text-14 flex-grow-1"
              placeholder="Enter your mail" 
              @input="handleInput" 
              @keydown="handleKeydown"
              ref="emailInputRef"
              required 
            /> 

            <button type="submit" class="btn py-20 px-32 bg-success-600 flex-shrink-0 hover-bg-success-700 flex-grow-1"
              :disabled="loading">
              {{ loading ? 'Subscribing...' : 'Subscribe now' }}
            </button>

            <!-- SUGGESTIONS -->
            <ul 
              v-if="showSuggestions && suggestions.length"
              class="list-group position-absolute w-100 mt-60 z-3 shadow"
              ref="suggestionsListRef"
            > 
              <li 
                v-for="(item, index) in suggestions" 
                :key="item" 
                class="list-group-item list-group-item-action cursor-pointer"
                :class="{ 'active': activeSuggestionIndex === index }"
                @click="selectSuggestion(item)"
                @mouseenter="activeSuggestionIndex = index"
              >
                {{ item }}
              </li>
            </ul>
          </form>

          <!-- AI TYPO CORRECTION -->
          <p v-if="correctionSuggestion" class="text-warning text-sm mt-8 cursor-pointer"
            @click="selectSuggestion(correctionSuggestion)">
            Did you mean
            <strong>{{ correctionSuggestion }}</strong> ?
          </p>
          <!-- MESSAGE -->
          <p v-if="message" class="text-sm mt-12 fw-medium" :class="success ? 'text-success' : 'text-danger'">
            {{ message }}
          </p>

          <p class="text-heading text-sm mt-20 fw-medium">
            I agree that my submitted data is being collected and stored.
          </p>
        </div>

        <div class="d-lg-block d-none">
          <img src="/assets/images/thumbs/newsletter-img.png" alt="Thumbnail" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

/* ---------------- STATE ---------------- */
const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const showSuggestions = ref(false)
const suggestions = ref([])
const correctionSuggestion = ref('')
const dropdownRef = ref(null)
const emailInputRef = ref(null)
const suggestionsListRef = ref(null)
const activeSuggestionIndex = ref(-1)

/* ---------------- CONFIG ---------------- */
const API_URL = process.env.NUXT_PUBLIC_API_URL || '/api/newsletter'

const domains = ref([])
const typoMap = ref({})

/* ---------------- HELPERS ---------------- */

// Email history
const getEmailHistory = () =>
  JSON.parse(localStorage.getItem('emailHistory') || '[]')

const saveEmail = (value) => {
  let history = getEmailHistory()
  if (!history.includes(value)) {
    history.unshift(value)
    history = history.slice(0, 5)
    localStorage.setItem('emailHistory', JSON.stringify(history))
  }
}

//REAL AI NAME SUGGESTION (Datamuse–FREE)
const fetchNameSuggestions = async (query) => {
  if (!query) return [] 

  try {
    const res = await $fetch(
      `https://api.datamuse.com/sug?s=${query}`
    )

    return res
      .map(item => item.word)
      .filter(word => word.length <= 10)
      .slice(0, 5)
  } catch {
    return []
  }
}

// Typo detection
const detectCorrection = (value) => {
  correctionSuggestion.value = ''

  if (!value.includes('@')) return

  const [name, domain] = value.split('@')

  if (typoMap.value[domain]) {
    correctionSuggestion.value = `${name}@${typoMap.value[domain]}`
  }
}

// Input handler
const handleInput = async () => {
  const value = email.value.toLowerCase()
  if (!value) {
    showSuggestions.value = false
    activeSuggestionIndex.value = -1
  } else {
    showSuggestions.value = true
  }
  const history = getEmailHistory()

  detectCorrection(value)

  // Reset active index when input changes 
  activeSuggestionIndex.value = -1

  // BEFORE @ → AI NAME GUESS + HISTORY
  if (!value.includes('@')) {
    const aiNames = await fetchNameSuggestions(value)

    suggestions.value = aiNames.length 
      ? aiNames
      : history.filter(h =>
        h.toLowerCase().startsWith(value)
      )

    return
  }

  // AFTER @ → DOMAIN SUGGESTIONS
  const [name, domainPart] = value.split('@')

  suggestions.value = domains.value
    .filter(d => d.includes(domainPart))
    .map(d => name + d)
}

// Keyboard navigation handler
const handleKeydown = (event) => {
  if (!showSuggestions.value || suggestions.value.length === 0) {
    // If no suggestions, only handle Enter for submission
    if (event.key === 'Enter') {
      event.preventDefault()
      subscribeNewsletter()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.value.length
      scrollToActiveSuggestion()
      break

    case 'ArrowUp':
      event.preventDefault()
      if (activeSuggestionIndex.value <= 0) {
        activeSuggestionIndex.value = suggestions.value.length - 1
      } else {
        activeSuggestionIndex.value--
      }
      scrollToActiveSuggestion()
      break

    case 'Enter':
      event.preventDefault()
      if (activeSuggestionIndex.value >= 0 && activeSuggestionIndex.value < suggestions.value.length) {
        // Select active suggestion
        selectSuggestion(suggestions.value[activeSuggestionIndex.value])
      } else {
        // Submit form
        subscribeNewsletter()
      }
      break

    case 'Escape':
      event.preventDefault()
      showSuggestions.value = false
      activeSuggestionIndex.value = -1
      break
  }
}

// Scroll to active suggestion
const scrollToActiveSuggestion = () => {
  nextTick(() => {
    const activeElement = suggestionsListRef.value?.querySelector('.active')
    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  })
}

// Select suggestion
const selectSuggestion = (value) => {
  email.value = value
  showSuggestions.value = false
  correctionSuggestion.value = ''
  activeSuggestionIndex.value = -1
  
  // Focus back on input after selection
  nextTick(() => {
    emailInputRef.value?.focus()
  })
}

// Submit form
const subscribeNewsletter = async () => {
  if (loading.value) return
  
  loading.value = true
  message.value = ''

  try {
    const res = await $fetch(API_URL, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: email.value }
    })

    saveEmail(email.value)
    success.value = true
    message.value = res?.message || 'Subscribed successfully!'
    email.value = ''
  } catch (err) {
    success.value = false
    message.value =
      err?.data?.message || 'Something went wrong. Please try again.'
  } finally { 
    loading.value = false
    showSuggestions.value = false
    activeSuggestionIndex.value = -1
  }
}

// Click outside handler
const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    showSuggestions.value = false
    activeSuggestionIndex.value = -1
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
  @media (max-width: 768px) {
  .newsletter-new .py-20.px-80-px {
    padding: 20px !important;
  }
  
  .max-w-700 {
    text-align: center !important;
    max-width: 100% !important;
  }
  
  .d-flex.align-items-center.justify-content-between {
    justify-content: center !important;
  }
  
  h3.mb-30 {
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  
  form.d-flex.gap-8 {
    justify-content: center !important;
  }
  
  .text-heading.text-sm.mt-20.fw-medium {
    text-align: center !important;
  }
}
.list-group-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.list-group-item.active {
  background-color: #031104;
  border-color: #000000;
}

.list-group-item:hover:not(.active) {
  background-color: #414141;
}
</style>
