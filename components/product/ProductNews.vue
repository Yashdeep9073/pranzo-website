<template>
  <section class="newsletter-new">
    <div class="container container-lg">
      <div
        class="py-20 px-80-px bg-neutral-100 rounded-12 d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap gap-32">
        <!-- LEFT SIDE -->
        <div class="max-w-700 position-relative w-100 text-center text-sm-start" ref="dropdownRef">
          <h3 class="mb-30">
            Stay home & get your daily needs from our shop
          </h3>

          <!-- FORM -->
          <form class="d-flex gap-8 flex-wrap flex-sm-nowrap position-relative" @submit.prevent="subscribeNewsletter">
            <input v-model="email" type="email"
              class="form-control bg-white px-20 shadow-none py-16 rounded placeholder-text-14 flex-grow-1"
              placeholder="Enter your mail" @input="handleInput" @keydown="handleKeydown" ref="emailInputRef"
              required />

            <button type="submit" class="btn py-20 px-32 bg-main-600 flex-shrink-0 hover-bg-main-700 flex-grow-1"
              :disabled="loading">
              {{ loading ? "Subscribing..." : "Subscribe now" }}
            </button>

            <!-- SUGGESTIONS -->
            <ul v-if="showSuggestions && suggestions.length" class="list-group position-absolute w-100 mt-60 z-3 shadow"
              ref="suggestionsListRef">
              <li v-for="(item, index) in suggestions" :key="item"
                class="list-group-item list-group-item-action cursor-pointer"
                :class="{ active: activeSuggestionIndex === index }" @click="selectSuggestion(item)"
                @mouseenter="activeSuggestionIndex = index">
                {{ item }}
              </li>
            </ul>
          </form>

          <!-- TYPO CORRECTION -->
          <p v-if="correctionSuggestion" class="text-warning text-sm mt-8 cursor-pointer"
            @click="selectSuggestion(correctionSuggestion)">
            Did you mean <strong>{{ correctionSuggestion }}</strong> ?
          </p>

          <!-- SUCCESS / ERROR MESSAGE -->
          <p v-if="message" class="text-sm mt-12 fw-medium" :class="success ? 'text-success' : 'text-danger'">
            {{ message }}
          </p>

          <p class="text-heading text-sm mt-20 fw-medium">
            I agree that my submitted data is being collected and stored.
          </p>
        </div>

        <!-- RIGHT SIDE IMAGE -->
        <div class="d-lg-block d-none">

          <!-- LOADING -->
          <div v-if="mediaLoading" class="text-center">
            <div class="spinner-border text-main-600" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- IMAGE FROM BACKEND -->
          <div v-else-if="subscribeMedia.length">
            <img :src="subscribeMedia[0].image" :alt="subscribeMedia[0].title || 'Subscribe image'"
              class="img-fluid rounded-12" @error="handleMediaError" />
          </div>

          <!-- FALLBACK IMAGE -->
          <img v-else src="/assets/images/thumbs/newsletter-img.png" alt="Newsletter" class="img-fluid rounded-12" />
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useMediaApi } from '~/composables/api/useMediaApi'

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

const subscribeMedia = ref([])
const mediaLoading = ref(false)

/* ---------------- CONFIG ---------------- */

const { fetchMedia } = useMediaApi()

const domains = ref([
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@hotmail.com'
])

const typoMap = ref({
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yaho.com': 'yahoo.com'
})

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

/* ---------------- AI NAME SUGGESTIONS ---------------- */

const fetchNameSuggestions = async (query) => {
  if (!query) return []

  try {
    const res = await $fetch(`https://api.datamuse.com/sug?s=${query}`)

    return res
      .map(item => item.word)
      .filter(word => word.length <= 10)
      .slice(0, 5)

  } catch {
    return []
  }
}

/* ---------------- TYPO DETECTION ---------------- */

const detectCorrection = (value) => {
  correctionSuggestion.value = ''

  if (!value.includes('@')) return

  const [name, domain] = value.split('@')

  if (typoMap.value[domain]) {
    correctionSuggestion.value = `${name}@${typoMap.value[domain]}`
  }
}

/* ---------------- INPUT HANDLER ---------------- */

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

  activeSuggestionIndex.value = -1

  // BEFORE @ → AI NAME GUESS
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

/* ---------------- KEYBOARD NAVIGATION ---------------- */

const handleKeydown = (event) => {

  if (!showSuggestions.value || suggestions.value.length === 0) {

    if (event.key === 'Enter') {
      event.preventDefault()
      subscribeNewsletter()
    }

    return
  }

  switch (event.key) {

    case 'ArrowDown':
      event.preventDefault()
      activeSuggestionIndex.value =
        (activeSuggestionIndex.value + 1) % suggestions.value.length
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

      if (activeSuggestionIndex.value >= 0) {
        selectSuggestion(suggestions.value[activeSuggestionIndex.value])
      } else {
        subscribeNewsletter()
      }

      break

    case 'Escape':
      showSuggestions.value = false
      activeSuggestionIndex.value = -1
      break
  }
}

/* ---------------- SCROLL ACTIVE SUGGESTION ---------------- */

const scrollToActiveSuggestion = () => {

  nextTick(() => {

    const activeElement =
      suggestionsListRef.value?.querySelector('.active')

    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }

  })
}

/* ---------------- SELECT SUGGESTION ---------------- */

const selectSuggestion = (value) => {

  email.value = value
  showSuggestions.value = false
  correctionSuggestion.value = ''
  activeSuggestionIndex.value = -1

  nextTick(() => {
    emailInputRef.value?.focus()
  })
}

/* ---------------- SUBSCRIBE API ---------------- */

const API_URL = '/api/newsletter/subscribe'

const subscribeNewsletter = async () => {

  if (loading.value) return

  loading.value = true
  message.value = ''

  try {

    const res = await $fetch(API_URL, {
      method: 'POST',
      body: { email: email.value }
    })

    saveEmail(email.value)

    success.value = true
    message.value = res?.message || 'Subscribed successfully!'

    email.value = ''

  } catch (err) {

    success.value = false
    message.value =
      err?.data?.message || 'Something went wrong.'

  } finally {

    loading.value = false
    showSuggestions.value = false
    activeSuggestionIndex.value = -1
  }
}

/* ---------------- FETCH SUBSCRIBE MEDIA ---------------- */

const fetchSubscribeMedia = async () => {

  if (mediaLoading.value) return

  mediaLoading.value = true


  try {

    const response = await fetchMedia()


    if (response?.data) {

      subscribeMedia.value =
        response.data.filter(
          item => item.category === 'SUBSCRIBE'
        )

    }

    mediaLoading.value = false

  } catch (error) {

    mediaLoading.value = false
  }
}

/* ---------------- IMAGE ERROR FALLBACK ---------------- */

const handleMediaError = (event) => {

  if (event.target && !event.target.dataset.fallbackSet) {

    event.target.dataset.fallbackSet = 'true'

    event.target.src =
      '/assets/images/thumbs/newsletter-img.png'

  }
}

/* ---------------- CLICK OUTSIDE ---------------- */

const handleClickOutside = (event) => {

  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    showSuggestions.value = false
    activeSuggestionIndex.value = -1
  }

}

/* ---------------- LIFECYCLE ---------------- */

onMounted(() => {

  document.addEventListener('click', handleClickOutside)

  fetchSubscribeMedia()

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
