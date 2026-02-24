// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import('@/pages/shop/shop-all/[slug].vue'),
      props: (route) => ({ 
        slug: route.params.id 
      })
    },
    {
      path: '/product/:id-:slug',
      name: 'ProductDetailWithSlug',
      component: () => import('@/pages/shop/shop-all/[slug].vue'),
      props: (route) => ({ 
        slug: route.params.slug 
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
      path: '/terms',
      name: 'Terms',
      component: () => import('@/pages/terms.vue')
    },
    {
      path: '/shop',
      redirect: '/shop/shop-all'
    },
    {
      path: '/shop/:pathMatch(.*)*',
      name: 'ShopPages',
      component: () => import('@/pages/shop/shop-all/index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/index.vue')
    }
  ]
})

export default router
