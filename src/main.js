import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/link'
import './common/prototype.js'

import './assets/styles/reset.styl'
import './assets/styles/common.styl'


import './icons'
import './components/table-wrapper'
import LinkUpload from '@linklogis/link-upload'
import api from "./api/apiRequest.js"
import './components/upload-file'
Vue.use(LinkUpload)


Vue.prototype.$http = api

Vue.config.productionTip = false
router.beforeEach((to, from, next) => { // 权限验证
  let token = to.query.token, origin = to.query.origin;
  sessionStorage.setItem('token', token)
  sessionStorage.setItem('origin', origin || '')
  next()
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
