import api from './apiRequest'

// 上传文件
export function uploadAndGetFilePath(data) {
    return api.post(`/treasury-flow-analysis-web//treasuryFlow/analysis/uploadAndGetFilePath`, data)
}
// 获取解析结果
export function analysisFile(filePath, bankName) {
    return api.post(`/treasury-flow-analysis-web/treasuryFlow/analysis/uploadAnalysisFile?filePath=${filePath}&bankName=${bankName}`)
}

// 获取选项
export function getBankList() {
    return api.get(`/treasury-flow-analysis-web/treasuryFlow/analysis/getBankList`)
}