export const useApiEndpoints = () => {
  const config = useRuntimeConfig()

  const base = config.public.apiBase

  // helper to attach query params
  const withQuery = (url: string, params?: Record<string, any>) => {
    if (!params || Object.keys(params).length === 0) return url

    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        query.append(key, String(value))
    })

    return `${url}?${query.toString()}`
  }

  return {
    // ---------------- OFFERS ----------------
    offers: {
      list: (params?: Record<string, any>) =>
        withQuery(`${base}/common/offers/read`, params),
    },

    // ---------------- PRODUCTS ----------------
    products: {
      list: (params?: Record<string, any>) =>
        withQuery(`${base}/common/product/read`, params),

      single: (id: number | string) =>
        `${base}/common/product/read/${id}`,

      
    },
    media: {
      list: (params?: Record<string, any>) =>
        withQuery(`${base}/common/media/read`, params),
    },
    
  }
}
