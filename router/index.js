// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ProductDetail from '@/pages/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/index.vue')
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      props: (route) => ({ 
        id: route.params.id 
      })
    },
    {
      path: '/product/:id-:slug',
      name: 'ProductDetailWithSlug',
      component: ProductDetail,
      props: (route) => ({ 
        id: route.params.id 
      })
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/pages/cart/Cart.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/pages/cart/Checkout.vue')
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import("@/pages/account/Wishlist.vue")
    },
    {
      path:'/profile',
      name:'Profile',
      component:() => import('@/pages/account/Profile.vue')
    }
  ]
})

export default router
