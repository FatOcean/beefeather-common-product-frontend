
import throttle from './throttle'
// 自定义指令
const directives = {
  throttle,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
