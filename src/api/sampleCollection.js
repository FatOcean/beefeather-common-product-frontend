import api from './apiRequest'
// 收藏样本
export function sampleCollection(data){
    return api.post('/qualification-certificate-analysis-web/qualificationCertificate//saveCollectInfo',data)
}
// 取消收藏
export function cancelSampleCollection(data){
    return api.post('/qualification-certificate-analysis-web/qualificationCertificate/cancelSaveCollectInfo',data)
}
