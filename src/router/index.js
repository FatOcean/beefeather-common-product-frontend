import Vue from 'vue'
import VueRouter from 'vue-router'

import houseProperty from '../views/house-property/index.vue'
import proofIncome from '../views/proof-income/index.vue'
import vehicleQualificationCertificate from '../views/vehicle-qualification-certificate/index.vue'
import drivingLicense from '../views/driving-license/index.vue'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/login',
  //   component: login
  // },
  {
    path: '/',
    // children: layoutRoutes
    redirect: "/drivingLicense"
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
    path: '/vehicleQualificationCertificate',
    component: vehicleQualificationCertificate,
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
  },
  {
    path: '/drivingLicense',
    component: drivingLicense,
    meta: {
      title: '文档OCR',
      icon: 'icon_4',
      activeIcon: 'icon_4_active'
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
