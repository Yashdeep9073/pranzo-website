import { ref, watchEffect } from 'vue'
import type { FetchProductsParams, Product, ProductsApiResponse } from "~/types/products"
import { useApiEndpoints } from "~/utlis/endpoints"

export const useProductsApi = (params: FetchProductsParams = {}) => {

  const api = useApiEndpoints()

  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const url = api.products.list(params)

      const res = await $fetch<ProductsApiResponse>(url)

      products.value = res?.data ?? []
    }
    catch (e) {
      error.value = e
      products.value = []
      console.error("❌ Products fetch failed:", e)
    }
    finally {
      loading.value = false
    }
  }

  watchEffect(fetchProducts)

  return {
    products,
    loading,
    error,
    refresh: fetchProducts
  }
}
