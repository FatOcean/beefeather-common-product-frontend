import axios from 'axios'
import router from '../router'
import { Message } from 'link-ui-web'
const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000000, // request timeout
  responseType: 'blob'
})

// 请求拦截
api.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  return config
}, (err) => {
  return Promise.reject(err)
})

// 响应拦截
api.interceptors.response.use((response) => {
  const code = response.data.code
  if (code === '401') {
    router.push('/login')
    Message.error({ message: '用户未登录！' })
    return Promise.reject(new Error('用户未登录！'))
  } else {
    // console.log('axios---', response)
    return response
  }
}, (err) => {
  return Promise.reject(err)
})

export default api
