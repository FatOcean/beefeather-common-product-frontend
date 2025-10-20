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
    path: '/documentParsing',
    name: 'documentParsing',
    component: (resolve) => require(['@/views/documentParsing'], resolve),
    meta: {
      title: '证件解析'
    }
  },
  {
    path: '/generalOcr',
    name: 'generalOcr',
    component: (resolve) => require(['@/views/generalOcr'], resolve),
    meta: {
      title: '通用OCR工具'
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
