export type ProductSort =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "popular"

export interface FetchProductsParams {
  search?: string
  categoryId?: number
  subCategoryId?: number
  subSubCategoryId?: number
  subSubSubCategoryId?: number
  brandId?: number
  sellerId?: number

  minPrice?: number
  maxPrice?: number

  inStock?: boolean
  hasDiscount?: boolean

  rating?: number
  expiringInDays?: number

  sort?: ProductSort
  page?: number
  limit?: number
}

export interface ProductImage {
  id: number
  imageUrl: string
  isPrimary: boolean
}

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  popularity: number
  images: ProductImage[]
  category?: {
    id: number
    name: string
    image?: string
  }
}

export interface ProductsApiResponse {
  success: boolean
  message: string
  data: Product[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
