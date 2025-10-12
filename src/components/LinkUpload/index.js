import LinkUpload from './LinkUpload.vue'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('LinkUpload', LinkUpload)
}

LinkUpload.install = function (Vue) {
  Vue.component(LinkUpload.name, LinkUpload)
}

export default LinkUpload
