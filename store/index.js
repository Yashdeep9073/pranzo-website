// Nuxt में यह file automatic load हो जाती है
export const state = () => ({
  // Global state यहाँ define करें (optional)
})

export const mutations = {
  // Global mutations
}

export const actions = {
  // Global actions
  async nuxtServerInit({ dispatch }) {
    // Server-side initialization
    await dispatch('products/initializeData')
  }
}

export const getters = {
  // Global getters
}