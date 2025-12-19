export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  components: true,

  devServer: {
    port: 5180,
    host: '127.0.0.1'
  },

  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    // Urql के लिए module
  ],

  css: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/thumbs',
    'swiper/css/autoplay'
  ],

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/select2.min.css' },
        { rel: 'stylesheet', href: '/assets/css/jquery-ui.css' },
        { rel: 'stylesheet', href: '/assets/css/animate.css' },
        { rel: 'stylesheet', href: '/assets/css/aos.css' },
        { rel: 'stylesheet', href: '/assets/css/main.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css' }
      ],
      script: [
        { src: 'https://unpkg.com/@phosphor-icons/web@2.1.1', defer: true },
        { src: '/assets/js/jquery-3.7.1.min.js', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js', defer: true },
        { src: '/assets/js/bootstrap.bundle.min.js', defer: true },
        { src: '/assets/js/phosphor-icon.js', defer: true },
        { src: '/assets/js/select2.min.js', defer: true },
        { src: '/assets/js/slick.min.js', defer: true },
        { src: '/assets/js/count-down.js', defer: true },
        { src: '/assets/js/jquery-ui.js', defer: true },
        { src: '/assets/js/wow.min.js', defer: true },
        { src: '/assets/js/aos.js', defer: true },
        { src: '/assets/js/marque.min.js', defer: true },
        { src: '/assets/js/vanilla-tilt.min.js', defer: true },
        { src: '/assets/js/counter.min.js', defer: true },
        { src: '/assets/js/main.js', defer: true }
      ]
    }
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  build: {
    transpile: ['@urql/vue', 'graphql']
  },

  runtimeConfig: {
    public: {
      api: {
        categories: process.env.VITE_API_CATEGORIES,
        colors: process.env.VITE_API_COLORS,
        sizes: process.env.VITE_API_SIZES,
        brands: process.env.VITE_API_BRANDS,
        graphql: process.env.VITE_API_GRAPHQL,
        blogs: process.env.VITE_API_BLOG,
        contact: process.env.VITE_API_CONATCT
      }
    }
  }
})