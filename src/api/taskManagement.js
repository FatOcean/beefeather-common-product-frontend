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
  // // 模拟数据
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const mockData = {
  //       code: '200',
  //       message: '查询成功',
  //       data: {
  //         list: [
  //           {
  //             id: 1,
  //             taskName: '发票解析任务001',
  //             status: '处理中',
  //             documentType: 'vat',
  //             documentTypeName: '增值税发票',
  //             fileCount: 15,
  //             classifiedCount: 8,
  //             createTime: '2025-10-18 10:30:00',
  //             updateTime: '2025-10-20 09:15:00'
  //           },
  //           {
  //             id: 2,
  //             taskName: '合同解析任务002',
  //             status: '已完成',
  //             documentType: 'financial_statement',
  //             documentTypeName: '流水',
  //             fileCount: 20,
  //             classifiedCount: 20,
  //             createTime: '2025-10-15 14:20:00',
  //             updateTime: '2025-10-19 16:45:00'
  //           },
  //           {
  //             id: 3,
  //             taskName: '收据解析任务003',
  //             status: '待处理',
  //             documentType: 'bill_of_lading',
  //             documentTypeName: '提单',
  //             fileCount: 10,
  //             classifiedCount: 0,
  //             createTime: '2025-10-20 08:00:00',
  //             updateTime: '2025-10-20 08:00:00'
  //           },
  //           {
  //             id: 4,
  //             taskName: '提单解析任务004',
  //             status: '已完成',
  //             documentType: 'bill_of_lading',
  //             documentTypeName: '提单',
  //             fileCount: 25,
  //             classifiedCount: 25,
  //             createTime: '2025-10-12 11:00:00',
  //             updateTime: '2025-10-17 13:30:00'
  //           },
  //           {
  //             id: 5,
  //             taskName: '订单解析任务005',
  //             status: '失败',
  //             documentType: 'order',
  //             documentTypeName: '订单',
  //             fileCount: 8,
  //             classifiedCount: 0,
  //             createTime: '2025-10-19 15:30:00',
  //             updateTime: '2025-10-19 16:00:00',
  //             errorMessage: '文件格式不支持'
  //           }
  //         ],
  //         total: "22",
  //       }
  //     }

  //     // 如果有搜索关键词，过滤数据
  //     if (params.taskName) {
  //       mockData.data.list = mockData.data.list.filter(item =>
  //         item.taskName.includes(params.taskName)
  //       )
  //       mockData.data.pagination.total = mockData.data.list.length
  //     }

  //     resolve(mockData)
  //   }, 800)
  // })
  return api.post('/api/docflow/task/list', params)

}


// 获取单据类型
export const getDocumentTypeList = () => {
  return api.post('/api/docflow/document/type/list')
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
  return api.delete(`/api/docflow/task/${taskId}`)
}
