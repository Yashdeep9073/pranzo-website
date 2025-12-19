export default defineNuxtRouteMiddleware((to) => {
//   if (
//     import.meta.client &&
//     to.path !== "/product/shop-all"
//   ) {
//     return navigateTo("/product/shop-all")
//   }
     (import.meta.client?console.log("hey"):console.log("haaay"))
})
