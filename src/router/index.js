import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/tradeDocumentAnalysis'
  },
  {
    path: '/documentParsing',
    component: (resolve) => require(['@/views/documentParsing'], resolve),
    meta: {
      title: '证件解析'
    }
  },
  {
    path: '/generalOcr',
    component: (resolve) => require(['@/views/generalOcr'], resolve),
    meta: {
      title: '通用OCR工具'
    }
  },
  {
    path: '/tradeDocumentAnalysis',
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
