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
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        code: '200',
        message: '查询成功',
        data: {
          list: [
            {
              id: 1,
              taskName: '发票解析任务001',
              status: '处理中',
              documentType: 'vat',
              documentTypeName: '增值税发票',
              fileCount: 15,
              classifiedCount: 8,
              createTime: '2025-10-18 10:30:00',
              updateTime: '2025-10-20 09:15:00'
            },
            {
              id: 2,
              taskName: '合同解析任务002',
              status: '已完成',
              documentType: 'financial_statement',
              documentTypeName: '流水',
              fileCount: 20,
              classifiedCount: 20,
              createTime: '2025-10-15 14:20:00',
              updateTime: '2025-10-19 16:45:00'
            },
            {
              id: 3,
              taskName: '收据解析任务003',
              status: '待处理',
              documentType: 'bill_of_lading',
              documentTypeName: '提单',
              fileCount: 10,
              classifiedCount: 0,
              createTime: '2025-10-20 08:00:00',
              updateTime: '2025-10-20 08:00:00'
            },
            {
              id: 4,
              taskName: '提单解析任务004',
              status: '已完成',
              documentType: 'bill_of_lading',
              documentTypeName: '提单',
              fileCount: 25,
              classifiedCount: 25,
              createTime: '2025-10-12 11:00:00',
              updateTime: '2025-10-17 13:30:00'
            },
            {
              id: 5,
              taskName: '订单解析任务005',
              status: '失败',
              documentType: 'order',
              documentTypeName: '订单',
              fileCount: 8,
              classifiedCount: 0,
              createTime: '2025-10-19 15:30:00',
              updateTime: '2025-10-19 16:00:00',
              errorMessage: '文件格式不支持'
            }
          ],
          pagination: {
            total: 5,
            pageNum: params.pageNum || 1,
            pageSize: params.pageSize || 10
          }
        }
      }

      // 如果有搜索关键词，过滤数据
      if (params.taskName) {
        mockData.data.list = mockData.data.list.filter(item =>
          item.taskName.includes(params.taskName)
        )
        mockData.data.pagination.total = mockData.data.list.length
      }

      resolve(mockData)
    }, 800)
  })

  // 真实接口调用（注释掉，需要时启用）
  // return api({
  //   url: '/api/task/list',
  //   method: 'get',
  //   params
  // })
}

/**
 * 2. 新增任务
 * @param {Object} data - 任务数据
 * @param {string} data.taskName - 任务名称
 * @param {string} data.documentType - 单据类型
 * @param {Array} data.fileList - 文件列表
 * @returns {Promise}
 */
export const createTask = (data) => {
  // 模拟数据
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证必填项
      if (!data.taskName) {
        reject({
          code: '400',
          message: '任务名称不能为空'
        })
        return
      }

      if (!data.documentType) {
        reject({
          code: '400',
          message: '单据类型不能为空'
        })
        return
      }

      if (!data.fileList || data.fileList.length === 0) {
        reject({
          code: '400',
          message: '请上传文件'
        })
        return
      }

      const mockResponse = {
        code: '200',
        message: '创建成功',
        data: {
          taskId: Math.floor(Math.random() * 10000) + 1000,
          taskName: data.taskName,
          documentType: data.documentType,
          status: '待处理',
          createTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-')
        }
      }

      resolve(mockResponse)
    }, 1000)
  })

  // 真实接口调用（注释掉，需要时启用）
  // return api({
  //   url: '/api/task/create',
  //   method: 'post',
  //   data
  // })
}

/**
 * 3. 获取待分类的图片列表
 * @param {number|string} taskId - 任务ID
 * @returns {Promise}
 */
export const getClassifyImages = (taskId) => {
  // 模拟数据
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!taskId) {
        reject({
          code: '400',
          message: '任务ID不能为空'
        })
        return
      }

      const mockResponse = {
        code: '200',
        message: '查询成功',
        data: {
          taskId: taskId,
          taskName: '发票解析任务001',
          documentType: 'vat',
          imageList: [
            {
              id: 1,
              imageId: 'img_001',
              docType: 'invoice',
              group: 'S1',
              imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              imageName: '10_46fb064dce3.jpg',
              uploadTime: '2025-10-20 09:00:00'
            },
            {
              id: 2,
              imageId: 'img_002',
              docType: 'contract',
              group: 'S1',
              imageUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
              imageName: '11_4f3847ae7186.jpg',
              uploadTime: '2025-10-20 09:01:00'
            },
            {
              id: 3,
              imageId: 'img_003',
              docType: 'receipt',
              group: 'S1',
              imageUrl: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
              imageName: '12_ce61b957ed6a.jpg',
              uploadTime: '2025-10-20 09:02:00'
            },
            {
              id: 4,
              imageId: 'img_004',
              docType: 'bill_of_lading',
              group: 'S1',
              imageUrl: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
              imageName: '13_3432b02b932d.jpg',
              uploadTime: '2025-10-20 09:03:00'
            },
            {
              id: 5,
              imageId: 'img_005',
              docType: 'packing_list',
              group: 'S2',
              imageUrl: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
              imageName: '14_5621c34a876e.jpg',
              uploadTime: '2025-10-20 09:04:00'
            },
            {
              id: 6,
              imageId: 'img_006',
              docType: 'commercial_invoice',
              group: 'S2',
              imageUrl: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              imageName: '15_7843f92b456c.jpg',
              uploadTime: '2025-10-20 09:05:00'
            },
            {
              id: 7,
              imageId: 'img_007',
              docType: 'certificate_of_origin',
              group: 'S2',
              imageUrl: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
              imageName: '16_8954a03b567d.jpg',
              uploadTime: '2025-10-20 09:06:00'
            },
            {
              id: 8,
              imageId: 'img_008',
              docType: 'insurance_policy',
              group: 'S2',
              imageUrl: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
              imageName: '17_9065b14c678e.jpg',
              uploadTime: '2025-10-20 09:07:00'
            }
          ]
        }
      }

      resolve(mockResponse)
    }, 600)
  })

  // 真实接口调用（注释掉，需要时启用）
  // return api({
  //   url: `/api/task/classify/${taskId}`,
  //   method: 'get'
  // })
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
  // 模拟数据
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证必填项
      if (!data.taskId) {
        reject({
          code: '400',
          message: '任务ID不能为空'
        })
        return
      }

      if (!data.imageList || data.imageList.length === 0) {
        reject({
          code: '400',
          message: '分类数据不能为空'
        })
        return
      }

      // 验证每个图片是否都有单据类型
      const unclassified = data.imageList.filter(item => !item.docType)
      if (unclassified.length > 0) {
        reject({
          code: '400',
          message: '请为所有单据选择类型'
        })
        return
      }

      const mockResponse = {
        code: '200',
        message: '提交成功',
        data: {
          taskId: data.taskId,
          classifiedCount: data.imageList.length,
          submitTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-'),
          // 按分组统计
          groupStats: data.imageList.reduce((acc, item) => {
            const key = item.group || '未分组'
            acc[key] = (acc[key] || 0) + 1
            return acc
          }, {}),
          // 按单据类型统计
          typeStats: data.imageList.reduce((acc, item) => {
            acc[item.docType] = (acc[item.docType] || 0) + 1
            return acc
          }, {})
        }
      }

      resolve(mockResponse)
    }, 1200)
  })

  // 真实接口调用（注释掉，需要时启用）
  // return api({
  //   url: '/api/task/classify/submit',
  //   method: 'post',
  //   data
  // })
}

/**
 * 5. 删除任务
 * @param {number|string} taskId - 任务ID
 * @returns {Promise}
 */
export const deleteTask = (taskId) => {
  // 模拟数据
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!taskId) {
        reject({
          code: '400',
          message: '任务ID不能为空'
        })
        return
      }

      const mockResponse = {
        code: '200',
        message: '删除成功',
        data: {
          taskId: taskId,
          deleteTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-')
        }
      }

      resolve(mockResponse)
    }, 500)
  })

  // 真实接口调用（注释掉，需要时启用）
  // return api({
  //   url: `/api/task/${taskId}`,
  //   method: 'delete'
  // })
}
