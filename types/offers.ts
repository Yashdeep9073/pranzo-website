// =======================
// Offer Image
// =======================
export interface OfferImage {
    id: number
    imageUrl: string
    isPrimary: boolean
}

// =======================
// Offer Count Meta
// =======================
export interface OfferCount {
    products: number
    images: number
}

// =======================
// Offer Status (backend-friendly enum)
// =======================
export type OfferStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

// =======================
// Offer Type
// =======================
export type OfferType =
    | 'FLASH_SALE'
    | 'SEASONAL'
    | 'CLEARANCE'
    | 'BANNER'
    | 'PRODUCT'
    | 'FESTIVAL'
    | 'DEALS_REVEALED'
    | 'HOT_DEALS'
    | 'OTHER'

// =======================
// Discount Type
// =======================
export type DiscountType = 'PERCENTAGE' | 'FIXED'

// =======================
// Core Offer Entity
// =======================
export interface Offer {
    id: number
    name: string
    slug: string
    description: string

    offerType: OfferType
    discountType: DiscountType
    discountValue: number

    startDate: string // ISO string
    endDate: string   // ISO string

    isActive: boolean
    isFeatured: boolean
    isDeleted: boolean
    priority: number

    createdAt: string
    updatedAt: string

    products: any[] // replace later when product type is ready
    OfferProducts?: any[] // alternative property name from API
    images: OfferImage[]

    _count: OfferCount

    status: OfferStatus
    timeRemaining: number | null
    startsIn: number | null
}

// =======================
// Pagination Meta
// =======================
export interface Pagination {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// =======================
// API Response Wrapper
// =======================
export interface OffersApiResponse {
    message: string
    data: Offer[]
    pagination: Pagination
}
