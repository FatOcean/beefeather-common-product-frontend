import api from './apiRequest'

// 上传文件
// export function uploadAndGetFilePath(data) {
//     return api.post(`/treasury-flow-analysis-web//treasuryFlow/analysis/uploadAndGetFilePath`, data)
// }
// 获取解析结果
export function analysisFile(data) {
  return api.post(
    `/general-product-web/general/uploadAnalysisFile?filePath=${data.filePath}&bankName=${data.bankName}&productName=${data.productName}`
  )
}

// 获取选项
export function getBankList() {
  return api.get('/general-product-web/general/getBankList')
}

// 登录
export function login(data) {
  return api.post('/sys-web/user/login', data)
}
