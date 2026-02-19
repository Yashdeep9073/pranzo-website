export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    // request interceptor
    onRequest({ options }) {
      const token = useCookie("auth_token")

      if (token.value) {
        options.headers = {
          ...options.headers,
        //   Authorization: `Bearer ${token.value}`
        }
      }
    },

    // response interceptor
    onResponse({ response }) {
      // optional logging
      // console.log("API Response:", response._data)
    },

    // error interceptor
    onResponseError({ response }) {

      // 401 -> logout
      if (response.status === 401) {
        const token = useCookie("auth_token")
        token.value = null
        navigateTo("/login")
      }

      // 500 -> global error message
      if (response.status === 500) {
        console.error("Server error")
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
