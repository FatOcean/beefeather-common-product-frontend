import api from '../apiRequest'
// 默认服务配置下拉框
export function defaultServiceConfigurationSelect(url, data) {
    return api.post(`${url}?productName=${data}`)
}
// 默认服务配置下拉框 请求体是body
export function defaultServiceConfigurationSelectForBody(url, data) {
    return api.post(url, data)
}
//默认服务配置
export function defaultServiceConfiguration(url,data) {
    return api.get(`${url}?productName=${data}`)
}
// 保存服务配置接口
export function saveServiceConfiguration(url, data) {
    return api.post(url, data)
}