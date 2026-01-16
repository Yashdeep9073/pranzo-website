import { defineStore } from 'pinia'

export const useMobileSearchStore = defineStore('mobileSearch', {
  state: () => ({
    isOpen: false
  }),

  actions: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    toggle() {
      this.isOpen = !this.isOpen
    }
  }
})
