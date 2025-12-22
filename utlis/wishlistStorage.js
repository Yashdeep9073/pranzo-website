const WISHLIST_KEY = 'wishlist_products'

export const getWishlistFromStorage = () => {
  if (!process.client) return []
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []
}

export const setWishlistToStorage = (products) => {
  if (!process.client) return
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(products))
}
