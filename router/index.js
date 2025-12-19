// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ProductDetail from '@/pages/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue')
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
      component: () => import('@/pages/Cart.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/pages/Checkout.vue')
    }
  ]
})

export default router