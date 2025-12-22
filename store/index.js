export const state = () => ({
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