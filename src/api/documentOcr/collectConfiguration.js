import api from '../apiRequest'
// 查询收集配置信息  GET
export function queryDataSet(url) {
    return api.get(url)
}
// 查询数据集列表（GET、无参）
export function dataSetList(url) {
    return api.get(url)
}
// （保存收集配置）
export function saveDatasetInfo(url, data) {
    return api.post(url, data)
}