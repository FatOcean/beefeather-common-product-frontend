import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: (resolve) => require(['@/views/home'], resolve),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/classify',
    name: 'classify',
    component: (resolve) => require(['@/views/classifyResult/newIndex.vue'], resolve),
    meta: {
      title: '分类结果'
    }
  },
  {
    path: '/tradeDocumentAnalysis',
    name: 'tradeDocumentAnalysis',
    component: (resolve) => require(['@/views/tradeDocumentAnalysis'], resolve),
    meta: {
      title: '贸易单证解析'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
