import api from '../apiRequest'
// 自定义服务配置
export function customServiceConfiguration(url) {
    return api.get(url)
}
// 检查接口联通状态
export function checkingInterfaceStatus(url, data) {
    return api.request({
        method: 'post',
        url: `${url}?url=${data}`,
        showError:false
      })
}
