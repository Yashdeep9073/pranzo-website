<template>
  <section class="newsletter-new">
    <div class="container container-lg">
      <div
        class="py-20 px-80-px bg-neutral-100 rounded-12 d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap gap-32">
        <div class="max-w-700 position-relative" ref="dropdownRef">
          <h3 class="mb-30">
            Stay home & get your daily needs from our shop
          </h3>

          <!-- FORM -->
          <form class="d-flex gap-8 flex-wrap flex-sm-nowrap position-relative" @submit.prevent="subscribeNewsletter">
            <input v-model="email" type="email"
              class="form-control bg-white px-20 shadow-none py-16 rounded placeholder-text-14 flex-grow-1"
              placeholder="Enter your mail" @input="handleInput" required />

            <button type="submit" class="btn py-20 px-32 bg-success-600 flex-shrink-0 hover-bg-success-700 flex-grow-1"
              :disabled="loading">
              {{ loading ? 'Subscribing...' : 'Subscribe now' }}
            </button>

            <!-- SUGGESTIONS -->
            <ul v-if="showSuggestions && suggestions.length"
              class="list-group position-absolute w-100 mt-60 z-3 shadow">
              <li v-for="item in suggestions" :key="item" class="list-group-item list-group-item-action cursor-pointer"
                @click="selectSuggestion(item)">
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
import { ref } from 'vue'

/* ---------------- STATE ---------------- */
const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const showSuggestions = ref(false)
const suggestions = ref([])
const correctionSuggestion = ref('')
const dropdownRef = ref(null)

/* CLICK OUTSIDE HANDLER */

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* ---------------- CONFIG ---------------- */
const API_URL =
  'https://kartmania-api.vibrantick.org/customer/news-letter/create'

const domains = [
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@hotmail.com'
]

// email typo intelligence
const typoMap = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com'
}

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

//REAL AI NAME SUGGESTION (Datamuse – FREE)
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

  if (typoMap[domain]) {
    correctionSuggestion.value = `${name}@${typoMap[domain]}`
  }
}

// Input handler
const handleInput = async () => {
  const value = email.value.toLowerCase()
  if (!value) {
    showSuggestions.value = false
  } else {
    showSuggestions.value = true
  }
  const history = getEmailHistory()

  detectCorrection(value)

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

  suggestions.value = domains
    .filter(d => d.includes(domainPart))
    .map(d => name + d)
}

// Select suggestion
const selectSuggestion = (value) => {
  email.value = value
  showSuggestions.value = false
  correctionSuggestion.value = ''
}

// Submit form
const subscribeNewsletter = async () => {
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
  }
}
const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>
