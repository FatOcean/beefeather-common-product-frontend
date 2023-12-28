import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/link'
import './common/prototype.js'

import './assets/styles/reset.styl'

import './icons'
import './components/table-wrapper'
import LinkUpload from '@linklogis/link-upload'
import api from './api/apiRequest.js'
// import "./components/upload-file";
import moreButton from '@/components/moreButton/index.vue'
import uploadFile from '@/components/upload-file/index.vue'
import Directives from './directives/index'
import CodeEditor from '@/components/bin-code-editor'
import RightTab from '@/components/rightTab.vue'
import './components/ocr-el'
Vue.use(CodeEditor)
Vue.use(Directives)
Vue.component('RightTab', RightTab)
Vue.component('moreButton', moreButton)
Vue.component('uploadFile', uploadFile)

Vue.use(LinkUpload)

Vue.prototype.$http = api
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  // 权限验证
  const token = to.query.token
  const origin = to.query.origin
  sessionStorage.setItem('token', token)
  sessionStorage.setItem('origin', origin || '')
  next()
})
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
