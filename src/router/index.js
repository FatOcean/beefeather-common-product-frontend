import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '@/views/login'
import layout from '@/views/layout'
// import layoutRoutes from './modules/layout'
import houseProperty from '../views/house-property/index.vue'
import proofIncome from '../views/proof-income/index.vue'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/login',
  //   component: login
  // },
  {
    path: '/',
    component: layout,
    // children: layoutRoutes
    redirect: "/houseProperty"
  },
  {
    path: '/houseProperty',
    component: houseProperty,
    meta: {
      title: '文档OCR',
      icon: 'icon_4',
      activeIcon: 'icon_4_active'
    }
  },
  {
    path: '/proofIncome',
    component: proofIncome,
    meta: {
      title: '文档OCR',
      icon: 'icon_4',
      activeIcon: 'icon_4_active'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
