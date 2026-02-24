import type {
  FetchMediaParams,
  MediaApiResponse
} from "~/types/media"
import { useApiEndpoints } from "~/utlis/endpoints"

export const useMediaApi = () => {
  const api = useApiEndpoints()

  const fetchMedia = async (
    params: FetchMediaParams = {}
  ): Promise<MediaApiResponse> => {

    const query = new URLSearchParams()

    // ---------- SEARCH ----------
    if (params.search)
      query.append("search", params.search)

    // ---------- RELATIONS ----------
    if (params.productId)
      query.append("productId", params.productId.toString())

    if (params.categoryId)
      query.append("categoryId", params.categoryId.toString())

    if (params.brandId)
      query.append("brandId", params.brandId.toString())

    // ---------- FILTERS ----------
    if (params.type)
      query.append("type", params.type)

    if (params.isPrimary !== undefined)
      query.append("isPrimary", params.isPrimary.toString())

    // ---------- DATE ----------
    if (params.fromDate)
      query.append("fromDate", params.fromDate)

    if (params.toDate)
      query.append("toDate", params.toDate)

    // ---------- SORT ----------
    if (params.sort)
      query.append("sort", params.sort)

    // ---------- PAGINATION ----------
    if (params.page)
      query.append("page", params.page.toString())

    if (params.limit)
      query.append("limit", params.limit.toString())

    const url = api.media.list(Object.fromEntries(query))

    const data = await $fetch<MediaApiResponse>(url)

    return data
  }

  return { fetchMedia }
}
