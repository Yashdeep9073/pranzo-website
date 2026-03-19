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
  id?: number
  imageUrl: string
  isPrimary: boolean
}

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  popularity: number
  description?: string
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

// Extended product types for the store
export interface ProductAttribute {
  id: string
  color?: string
  size?: string
  material?: string
}

export interface ProductReview {
  rating: number
  review: string
}

export interface ProductImage {
  id?: number
  imageUrl: string
  isPrimary: boolean
}

export interface MainProduct {
  id: string
  name: string
  price: number
  discountValue?: number
  description?: string
  stock: number
  popularity: number
  createdAt?: string
  images: ProductImage[]
  reviews?: ProductReview[]
  attributes?: ProductAttribute[]
  categoryName?: string
  brandName?: string
}

export interface ProductReview {
  rating: number
  review: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  images: ProductImage[]
  attributes: ProductAttribute
}

export interface ProductBrand {
  id: string
  name: string
  logo?: string
  description?: string
  Seller?: {
    name: string
  }
  seller?: string
}

export interface ProductCategory {
  id: string
  name: string
  image?: string
  logo?: string
}

export interface StoreProduct {
  groupId: string
  name: string
  category?: ProductCategory
  mainProduct: MainProduct
  variants?: ProductVariant[]
  brand?: ProductBrand
  variantId?: string
  variantIndex?: number
}

export interface GraphQLFilters {
  search?: string
  color?: string
  size?: string
  category?: string
  brand?: string
  page: number
  limit: number
}

export interface GraphQLProductFilterResponse {
  data: {
    productFilter: {
      data: StoreProduct[]
      pagination: {
        currentPage: number
        lastPage: number
        perPage: number
        total: number
        from: number
        to: number
      }
    }
  }
}

export interface GraphQLResponse {
  data?: {
    productFilter?: {
      data?: StoreProduct[]
      pagination?: {
        currentPage: number
        lastPage: number
        total: number
        perPage: number
        from: number
        to: number
      }
    }
  }
  errors?: any[]
}
