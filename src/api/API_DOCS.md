# 任务管理接口文档

## 接口概述

本文档包含任务管理相关的4个核心接口：
1. 获取任务列表
2. 新增任务
3. 获取待分类图片列表
4. 提交分类结果

---

## 1. 获取任务列表

**接口名称**: `getTaskList`  
**请求方式**: `GET`  
**接口地址**: `/api/task/list`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskName | string | 否 | 任务名称（模糊搜索） |
| pageNum | number | 是 | 页码，从1开始 |
| pageSize | number | 是 | 每页数量 |

### 请求示例

```javascript
import { getTaskList } from '@/api/taskManagement'

getTaskList({
  taskName: '发票',
  pageNum: 1,
  pageSize: 10
}).then(res => {
  console.log(res.data)
})
```

### 返回数据

```json
{
  "code": "200",
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "taskName": "发票解析任务001",
        "status": "处理中",
        "documentType": "vat",
        "documentTypeName": "增值税发票",
        "fileCount": 15,
        "classifiedCount": 8,
        "createTime": "2025-10-18 10:30:00",
        "updateTime": "2025-10-20 09:15:00"
      }
    ],
    "pagination": {
      "total": 5,
      "pageNum": 1,
      "pageSize": 10
    }
  }
}
```

### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 任务ID |
| taskName | string | 任务名称 |
| status | string | 任务状态：待处理/处理中/已完成/失败 |
| documentType | string | 单据类型代码 |
| documentTypeName | string | 单据类型名称 |
| fileCount | number | 文件总数 |
| classifiedCount | number | 已分类数量 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| errorMessage | string | 错误信息（状态为失败时） |

---

## 2. 新增任务

**接口名称**: `createTask`  
**请求方式**: `POST`  
**接口地址**: `/api/task/create`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskName | string | 是 | 任务名称 |
| documentType | string | 是 | 单据类型：vat/financial_statement/bill_of_lading/order |
| fileList | array | 是 | 上传的文件列表 |

### 单据类型枚举

| 值 | 说明 |
|----|------|
| financial_statement | 流水 |
| vat | 增值税发票 |
| bill_of_lading | 提单 |
| order | 订单 |

### 请求示例

```javascript
import { createTask } from '@/api/taskManagement'

createTask({
  taskName: '发票解析任务001',
  documentType: 'vat',
  fileList: [
    {
      name: 'invoice.pdf',
      url: 'http://example.com/files/invoice.pdf',
      size: 1024000
    }
  ]
}).then(res => {
  console.log('创建成功，任务ID:', res.data.taskId)
}).catch(err => {
  console.error('创建失败:', err.message)
})
```

### 返回数据

```json
{
  "code": "200",
  "message": "创建成功",
  "data": {
    "taskId": 1234,
    "taskName": "发票解析任务001",
    "documentType": "vat",
    "status": "待处理",
    "createTime": "2025-10-20 10:30:25"
  }
}
```

### 错误返回示例

```json
{
  "code": "400",
  "message": "任务名称不能为空"
}
```

---

## 3. 获取待分类图片列表

**接口名称**: `getClassifyImages`  
**请求方式**: `GET`  
**接口地址**: `/api/task/classify/{taskId}`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | number/string | 是 | 任务ID |

### 请求示例

```javascript
import { getClassifyImages } from '@/api/taskManagement'

getClassifyImages(1234).then(res => {
  console.log('图片列表:', res.data.imageList)
})
```

### 返回数据

```json
{
  "code": "200",
  "message": "查询成功",
  "data": {
    "taskId": 1234,
    "taskName": "发票解析任务001",
    "documentType": "vat",
    "imageList": [
      {
        "id": 1,
        "imageId": "img_001",
        "docType": "invoice",
        "group": "S1",
        "imageUrl": "https://example.com/images/001.jpg",
        "imageName": "10_46fb064dce3.jpg",
        "uploadTime": "2025-10-20 09:00:00"
      }
    ]
  }
}
```

### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | number | 任务ID |
| taskName | string | 任务名称 |
| documentType | string | 单据类型 |
| imageList | array | 图片列表 |
| imageList[].id | number | 图片记录ID |
| imageList[].imageId | string | 图片唯一标识 |
| imageList[].docType | string | 单据类型（可预设） |
| imageList[].group | string | 分组标识 |
| imageList[].imageUrl | string | 图片URL |
| imageList[].imageName | string | 图片文件名 |
| imageList[].uploadTime | string | 上传时间 |

### 单据类型枚举（分类用）

| 值 | 说明 |
|----|------|
| invoice | 发票 |
| contract | 合同 |
| receipt | 收据 |
| bill_of_lading | 提单 |
| packing_list | 装箱单 |
| commercial_invoice | 商业发票 |
| certificate_of_origin | 产地证 |
| insurance_policy | 保险单 |

---

## 4. 提交分类结果

**接口名称**: `submitClassifyResult`  
**请求方式**: `POST`  
**接口地址**: `/api/task/classify/submit`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | number/string | 是 | 任务ID |
| imageList | array | 是 | 图片分类列表 |
| imageList[].imageId | string | 是 | 图片ID |
| imageList[].docType | string | 是 | 单据类型 |
| imageList[].group | string | 否 | 分组标识 |

### 请求示例

```javascript
import { submitClassifyResult } from '@/api/taskManagement'

submitClassifyResult({
  taskId: 1234,
  imageList: [
    {
      imageId: 'img_001',
      docType: 'invoice',
      group: 'S1'
    },
    {
      imageId: 'img_002',
      docType: 'contract',
      group: 'S1'
    },
    {
      imageId: 'img_003',
      docType: 'receipt',
      group: 'S2'
    }
  ]
}).then(res => {
  console.log('提交成功:', res.data)
}).catch(err => {
  console.error('提交失败:', err.message)
})
```

### 返回数据

```json
{
  "code": "200",
  "message": "提交成功",
  "data": {
    "taskId": 1234,
    "classifiedCount": 8,
    "submitTime": "2025-10-20 11:30:00",
    "groupStats": {
      "S1": 4,
      "S2": 4
    },
    "typeStats": {
      "invoice": 3,
      "contract": 2,
      "receipt": 3
    }
  }
}
```

### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| taskId | number | 任务ID |
| classifiedCount | number | 分类数量 |
| submitTime | string | 提交时间 |
| groupStats | object | 按分组统计 |
| typeStats | object | 按单据类型统计 |

### 错误返回示例

```json
{
  "code": "400",
  "message": "请为所有单据选择类型"
}
```

---

## 5. 删除任务（附加）

**接口名称**: `deleteTask`  
**请求方式**: `DELETE`  
**接口地址**: `/api/task/{taskId}`

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| taskId | number/string | 是 | 任务ID |

### 请求示例

```javascript
import { deleteTask } from '@/api/taskManagement'

deleteTask(1234).then(res => {
  console.log('删除成功')
})
```

### 返回数据

```json
{
  "code": "200",
  "message": "删除成功",
  "data": {
    "taskId": 1234,
    "deleteTime": "2025-10-20 12:00:00"
  }
}
```

---

## 使用说明

### 1. 在页面中引入

```javascript
import {
  getTaskList,
  createTask,
  getClassifyImages,
  submitClassifyResult,
  deleteTask
} from '@/api/taskManagement'
```

### 2. 完整使用流程

```javascript
// 步骤1: 获取任务列表
async function loadTaskList() {
  try {
    const res = await getTaskList({
      taskName: '',
      pageNum: 1,
      pageSize: 10
    })
    if (res.code === '200') {
      this.tableData = res.data.list
      this.pagination.total = res.data.pagination.total
    }
  } catch (error) {
    this.$message.error('获取列表失败')
  }
}

// 步骤2: 创建新任务
async function createNewTask() {
  try {
    const res = await createTask({
      taskName: this.form.taskName,
      documentType: this.form.documentType,
      fileList: this.form.fileList
    })
    if (res.code === '200') {
      this.$message.success('创建成功')
      this.loadTaskList() // 刷新列表
    }
  } catch (error) {
    this.$message.error(error.message || '创建失败')
  }
}

// 步骤3: 获取待分类图片
async function loadClassifyData(taskId) {
  try {
    const res = await getClassifyImages(taskId)
    if (res.code === '200') {
      this.imageList = res.data.imageList
    }
  } catch (error) {
    this.$message.error('获取数据失败')
  }
}

// 步骤4: 提交分类结果
async function submitClassify(taskId) {
  try {
    const res = await submitClassifyResult({
      taskId: taskId,
      imageList: this.imageList.map(item => ({
        imageId: item.imageId,
        docType: item.docType,
        group: item.group
      }))
    })
    if (res.code === '200') {
      this.$message.success('提交成功')
      this.$router.back()
    }
  } catch (error) {
    this.$message.error(error.message || '提交失败')
  }
}
```

---

## 注意事项

1. **当前接口为模拟数据**：所有接口都返回模拟的 Promise 数据，方便前端开发调试
2. **切换真实接口**：当后端接口就绪后，只需取消 `taskManagement.js` 文件中真实接口调用的注释，并注释掉模拟数据部分
3. **错误处理**：建议使用 try-catch 或 .catch() 捕获错误
4. **响应延迟**：模拟接口设置了延迟（500-1200ms）以模拟真实网络请求
5. **数据验证**：接口会进行基本的参数验证，返回相应的错误信息

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

