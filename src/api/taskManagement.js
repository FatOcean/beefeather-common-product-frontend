import api from './apiRequest'

/**
 * 任务管理相关接口
 */

/**
 * 1. 获取任务列表
 * @param {Object} params - 查询参数
 * @param {string} params.taskName - 任务名称（可选）
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export const getTaskList = (params) => {
  return api.post('/api/docflow/task/list', params)
}

// 获取单据类型
export const getDocumentTypeList = () => {
  return api.post('/api/docflow/task/document-types')
}

/**
 * 上传单个文件
 * @param {FormData} formData - 包含文件和文档类型的表单数据
 * @returns {Promise} 返回文件ID
 */
export const uploadFile = (formData) => {
  // 先模拟调用成功  生成唯一id返回
  return api.post('/api/docflow/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 300000 // 5分钟超时，适用于大文件上传
  })
}

/**
 * 创建任务（提交文件ID）
 * @param {Object} data - 任务数据
 * @returns {Promise}
 */
export const createTask = (data) => {
  return api.post('/api/docflow/task/create', data)
} 

/**
 * 3. 获取待分类的图片列表
 * @param {number|string} taskId - 任务ID
 * @returns {Promise}
 */
export const getClassifyImages = (taskId) => {
  return api.get(`/api/docflow/task/classify?taskId=${taskId}`)
}

/**
 * 4. 提交分类结果
 * @param {Object} data - 分类数据
 * @param {number|string} data.taskId - 任务ID
 * @param {Array} data.imageList - 图片分类列表
 * @param {string} data.imageList[].imageId - 图片ID
 * @param {string} data.imageList[].docType - 单据类型
 * @param {string} data.imageList[].group - 分组标识
 * @returns {Promise}
 */
export const submitClassifyResult = (data) => {
  return api.post('/api/docflow/task/classify/submit', data)
}

/**
 * 5. 删除任务
 * @param {number|string} taskId - 任务ID
 * @returns {Promise}
 */
export const deleteTask = (taskId) => {
  return api.post(`/api/docflow/task/delete/${taskId}`)
}
