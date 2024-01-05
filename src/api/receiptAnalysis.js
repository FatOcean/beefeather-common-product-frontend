import api from './apiRequest'
import apiRequestDownload from './apiRequestDownload'

// 获取解析结果
export function analysisFile(data) {
  return api.post(
    `/general-product-web/general/uploadAnalysisFile?filePath=${data.filePath}&bankName=${data.bankName}&productName=${data.productName}`
  )
}
// 获取选项
export function getBankList() {
  return api.post('/general-product-web/general/banks')
}
// 获取解析结果
export function extractInfo(data) {
  return api.post(
    `/general-product-web/general/extractInfo?taskId=${data.taskId}&bank=${data.bank}&application=${data.application}`
  )
}
export function downloadResult(data) {
  return apiRequestDownload.post(
    '/general-product-web/general/export', data
  )
}
export function downloadJson(data) {
  return apiRequestDownload.post(
    '/general-product-web/general/download/json', data
  )
}

export function result(data) {
  return api.post(
    `/general-product-web/trade/result?taskId=${data.taskId}&application=${data.application}`
  )
}
// 登录
export function login(data) {
  return api.post('/sys-web/user/login', data)
}
