export interface Media {
  id: number
  url: string
  type: "image" 
  alt?: string
  title?: string
  productId?: number
  categoryId?: number
  createdAt: string
  updatedAt: string
}

export interface FetchMediaParams {
  search?: string

  // relations
  productId?: number
  categoryId?: number
  brandId?: number

  // filters
  type?: "image" 
  isPrimary?: boolean

  // date filter
  fromDate?: string
  toDate?: string

  // pagination
  page?: number
  limit?: number

  // sorting
  sort?: string
}

export interface MediaApiResponse {
  success: boolean
  message?: string
  data: Media[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
