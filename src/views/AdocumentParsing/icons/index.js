import Vue from 'vue'
import SvgIcon from './svg-icon.vue'// svg组件
Vue.component('svgIcon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
const iconMap = requireAll(req)
// console.log(iconMap)

export default iconMap
