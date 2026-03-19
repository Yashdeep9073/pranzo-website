import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Keep mobile scrolling smooth: avoid costly AOS observers on small screens.
    if (window.matchMedia('(max-width: 991px)').matches) return
    if (document.documentElement.dataset.aosInitialized === 'true') return

    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true
    })
    document.documentElement.dataset.aosInitialized = 'true'
  }
})
