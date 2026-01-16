// middlewares/route-guard.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const productStore = useProductStore()
  
  console.log('🛡️ Route Guard triggered')
  console.log('📍 From:', from.path, from.query)
  console.log('📍 To:', to.path, to.query)
  
  // Check if we're navigating to shop page
  if (to.path.startsWith('/shop')) {
    console.log('🛍️ Navigating to shop page')
    
    // Force reinitialize if coming from different page
    if (from.path !== to.path) {
      console.log('🔄 Different page, forcing store reset')
      await productStore.forceSyncFromURL()
    } else {
      // Same page, just sync URL
      console.log('🔄 Same page, syncing from URL')
      await productStore.syncFiltersFromURL()
    }
  }
})