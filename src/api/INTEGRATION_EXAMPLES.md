# 接口集成示例

本文档展示如何在三个页面中集成API接口。

---

## 1. 列表页集成 (home/index.vue)

### 修改要点

```vue
<script>
import drawer from './drawer.vue'
// 👇 引入API
import { getTaskList, deleteTask } from '@/api/taskManagement'

export default {
  name: 'DocumentParsing',
  components: {
    drawer
  },
  data() {
    return {
      loading: false,
      searchForm: {
        taskName: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    // 👇 页面加载时获取列表
    this.loadTaskList()
  },
  methods: {
    // 👇 新增：加载任务列表
    async loadTaskList() {
      this.loading = true
      try {
        const res = await getTaskList({
          taskName: this.searchForm.taskName,
          pageNum: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        
        if (res.code === '200') {
          this.tableData = res.data.list
          this.pagination.total = res.data.pagination.total
          this.$message.success('加载成功')
        }
      } catch (error) {
        this.$message.error('加载失败：' + (error.message || '网络错误'))
      } finally {
        this.loading = false
      }
    },

    openDrawer() {
      this.$refs.drawer.openDrawer()
    },

    // 👇 修改：搜索方法调用真实接口
    handleSearch() {
      this.pagination.currentPage = 1 // 重置到第一页
      this.loadTaskList()
    },

    // 重置搜索
    handleReset() {
      this.searchForm.taskName = ''
      this.pagination.currentPage = 1
      this.loadTaskList()
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        待处理: 'info',
        处理中: 'warning',
        已完成: 'success',
        失败: 'danger'
      }
      return statusMap[status] || 'info'
    },

    // 👇 修改：查看时传递任务ID
    handleView(row) {
      this.$router.push({ 
        name: 'tradeDocumentAnalysis',
        query: { taskId: row.id }
      })
    },

    // 👇 修改：分类时传递任务ID
    handleClassify(row) {
      this.$router.push({ 
        name: 'classify',
        query: { taskId: row.id }
      })
    },

    // 👇 修改：删除调用真实接口
    async handleDelete(row) {
      try {
        await this.$confirm('确定要删除这个任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 调用删除接口
        const res = await deleteTask(row.id)
        if (res.code === '200') {
          this.$message.success('删除成功')
          // 重新加载列表
          this.loadTaskList()
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + (error.message || '网络错误'))
        }
      }
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.loadTaskList()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loadTaskList()
    }
  }
}
</script>
```

### 表格列添加更多信息

```vue
<!-- 在 el-table 中添加更多列 -->
<el-table-column prop="documentTypeName" label="单据类型" width="120" />
<el-table-column label="进度" width="150">
  <template slot-scope="scope">
    <el-progress 
      :percentage="Math.round((scope.row.classifiedCount / scope.row.fileCount) * 100)" 
      :status="scope.row.classifiedCount === scope.row.fileCount ? 'success' : ''"
    />
  </template>
</el-table-column>
<el-table-column prop="createTime" label="创建时间" width="180" />
```

---

## 2. 新增页集成 (home/drawer.vue)

### 修改要点

```vue
<template>
  <el-drawer
    title="新增任务"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="500px"
  >
    <div style="padding: 0 20px 20px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input 
            v-model="form.taskName" 
            placeholder="请输入任务名称" 
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="单据类型" prop="documentType">
          <el-select 
            v-model="form.documentType" 
            placeholder="请选择单据类型"
            style="width: 100%;"
          >
            <el-option 
              v-for="item in documentTypeOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上传文件" prop="fileList">
          <upload 
            :limit="1" 
            :fileList="form.fileList" 
            @change="handleFileChange" 
            :accept="['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'json', 'zip', 'rar', '7z']"
          />
        </el-form-item>
      </el-form>
      
      <!-- 👇 添加操作按钮 -->
      <div style="text-align: right; margin-top: 20px;">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          :loading="submitLoading"
        >
          {{ submitLoading ? '创建中...' : '确定' }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import upload from '@/components/LinkUpload'
// 👇 引入API
import { createTask } from '@/api/taskManagement'

export default {
  components: {
    upload
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      submitLoading: false, // 👈 新增提交loading
      form: {
        taskName: '',
        documentType: 'vat',
        fileList: []
      },
      // 👇 新增表单验证规则
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        documentType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        fileList: [
          { 
            required: true, 
            type: 'array',
            min: 1,
            message: '请上传文件', 
            trigger: 'change' 
          }
        ]
      },
      documentTypeOptions: [
        { label: '流水', value: 'financial_statement' },
        { label: '增值税发票', value: 'vat' },
        { label: '提单', value: 'bill_of_lading' },
        { label: '订单', value: 'order' }
      ]
    }
  },
  methods: {
    openDrawer() {
      this.drawer = true
    },
    
    handleClose() {
      // 重置表单
      this.$refs.form.resetFields()
      this.form.fileList = []
      this.drawer = false
    },
    
    handleFileChange(fileList) {
      this.form.fileList = fileList
      // 触发表单验证
      this.$refs.form.validateField('fileList')
    },
    
    // 👇 新增：提交方法
    async handleSubmit() {
      try {
        // 先验证表单
        await this.$refs.form.validate()
        
        this.submitLoading = true
        
        // 调用创建接口
        const res = await createTask({
          taskName: this.form.taskName,
          documentType: this.form.documentType,
          fileList: this.form.fileList
        })
        
        if (res.code === '200') {
          this.$message.success('创建成功')
          
          // 关闭抽屉
          this.handleClose()
          
          // 通知父组件刷新列表
          this.$emit('refresh')
          // 或者直接调用父组件方法
          this.$parent.loadTaskList && this.$parent.loadTaskList()
        } else {
          this.$message.error(res.message || '创建失败')
        }
      } catch (error) {
        if (error !== false) { // 表单验证失败时error为false
          this.$message.error(error.message || '创建失败')
        }
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>
```

---

## 3. 分类页集成 (classifyResult/newIndex.vue)

### 修改要点

```vue
<script>
// 👇 引入API
import { getClassifyImages, submitClassifyResult } from '@/api/taskManagement'

export default {
  name: 'ClassifyNew',
  data() {
    return {
      taskId: null, // 👈 新增：任务ID
      taskName: '', // 👈 新增：任务名称
      loading: false, // 👈 新增：加载状态
      submitLoading: false, // 👈 新增：提交loading
      
      // 单据类型选项
      docTypeOptions: [
        { label: '发票', value: 'invoice' },
        { label: '合同', value: 'contract' },
        { label: '收据', value: 'receipt' },
        { label: '提单', value: 'bill_of_lading' },
        { label: '装箱单', value: 'packing_list' },
        { label: '商业发票', value: 'commercial_invoice' },
        { label: '产地证', value: 'certificate_of_origin' },
        { label: '保险单', value: 'insurance_policy' }
      ],
      
      // 图片列表数据
      imageList: []
    }
  },
  
  // 👇 新增：页面创建时获取数据
  created() {
    // 从路由获取任务ID
    this.taskId = this.$route.query.taskId
    
    if (!this.taskId) {
      this.$message.error('缺少任务ID')
      this.$router.back()
      return
    }
    
    this.loadClassifyData()
  },
  
  methods: {
    // 👇 新增：加载分类数据
    async loadClassifyData() {
      this.loading = true
      try {
        const res = await getClassifyImages(this.taskId)
        
        if (res.code === '200') {
          this.taskName = res.data.taskName
          this.imageList = res.data.imageList
          this.$message.success('加载成功')
        } else {
          this.$message.error(res.message || '加载失败')
        }
      } catch (error) {
        this.$message.error('加载失败：' + (error.message || '网络错误'))
        // 加载失败后延迟返回
        setTimeout(() => {
          this.$router.back()
        }, 2000)
      } finally {
        this.loading = false
      }
    },

    // 返回
    goBack() {
      this.$confirm('确定要返回吗？未保存的修改将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {})
    },

    // 👇 修改：提交调用真实接口
    async handleSubmit() {
      // 验证是否所有图片都已选择单据类型
      const unclassified = this.imageList.filter(item => !item.docType)
      if (unclassified.length > 0) {
        this.$message.warning('请为所有单据选择类型')
        return
      }

      try {
        await this.$confirm('确定要提交分类结果吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        
        this.submitLoading = true
        
        // 调用提交接口
        const res = await submitClassifyResult({
          taskId: this.taskId,
          imageList: this.imageList.map(item => ({
            imageId: item.imageId,
            docType: item.docType,
            group: item.group
          }))
        })
        
        if (res.code === '200') {
          this.$message.success('提交成功')
          
          // 显示统计信息
          this.$notify({
            title: '提交成功',
            message: `共分类 ${res.data.classifiedCount} 个文件`,
            type: 'success',
            duration: 3000
          })
          
          // 提交成功后返回
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        } else {
          this.$message.error(res.message || '提交失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '提交失败')
        }
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>
```

### 模板修改

```vue
<template>
  <div class="classify-page" v-loading="loading">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <el-button icon="el-icon-arrow-left" @click="goBack" circle></el-button>
        <!-- 👇 显示任务名称 -->
        <span class="title">单据分类 - {{ taskName }}</span>
      </div>
      <div class="header-right">
        <!-- 👇 添加loading状态 -->
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="submitLoading"
        >
          {{ submitLoading ? '提交中...' : '提交' }}
        </el-button>
      </div>
    </div>

    <!-- 图片内容区域 -->
    <div class="content-area">
      <!-- 👇 添加空状态提示 -->
      <el-empty 
        v-if="!loading && imageList.length === 0" 
        description="暂无数据"
      />
      
      <div class="image-grid" v-else>
        <!-- 图片列表 -->
        <div
          v-for="(item, index) in imageList"
          :key="item.id"
          class="image-item"
        >
          <!-- ... 其余代码保持不变 ... -->
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## 4. 完整的数据流程图

```
用户操作流程：

1. 进入列表页
   ↓
   调用 getTaskList() 获取任务列表
   ↓
   显示任务列表（带分页）

2. 点击"新增"按钮
   ↓
   打开抽屉，填写任务信息
   ↓
   调用 createTask() 创建任务
   ↓
   创建成功，刷新列表页

3. 点击"分类"按钮
   ↓
   跳转到分类页（携带taskId）
   ↓
   调用 getClassifyImages(taskId) 获取图片列表
   ↓
   用户对图片进行分类（选择类型、设置分组）
   ↓
   点击"提交"按钮
   ↓
   调用 submitClassifyResult() 提交分类结果
   ↓
   提交成功，返回列表页

4. 点击"删除"按钮
   ↓
   弹出确认框
   ↓
   调用 deleteTask(taskId) 删除任务
   ↓
   删除成功，刷新列表页
```

---

## 5. 错误处理建议

```javascript
// 统一错误处理函数
function handleApiError(error, defaultMessage = '操作失败') {
  const message = error?.message || defaultMessage
  this.$message.error(message)
  
  // 可以根据错误码做特殊处理
  if (error?.code === '401') {
    // 未登录，跳转到登录页
    this.$router.push('/login')
  } else if (error?.code === '403') {
    // 无权限
    this.$message.error('您没有权限执行此操作')
  }
}

// 使用示例
async loadTaskList() {
  try {
    const res = await getTaskList(params)
    // 处理成功逻辑
  } catch (error) {
    this.handleApiError(error, '加载列表失败')
  }
}
```

---

## 6. Loading 状态管理

```javascript
// 推荐使用局部loading而不是全局loading
data() {
  return {
    loadings: {
      list: false,    // 列表加载
      submit: false,  // 提交操作
      delete: false   // 删除操作
    }
  }
}

// 使用示例
async loadTaskList() {
  this.loadings.list = true
  try {
    // API调用
  } finally {
    this.loadings.list = false
  }
}
```

---

## 7. 环境切换建议

```javascript
// 在 .env.development 文件中
VUE_APP_USE_MOCK=true

// 在 taskManagement.js 中
const USE_MOCK = process.env.VUE_APP_USE_MOCK === 'true'

export const getTaskList = (params) => {
  if (USE_MOCK) {
    // 返回模拟数据
    return mockGetTaskList(params)
  }
  
  // 真实接口调用
  return api({
    url: '/api/task/list',
    method: 'get',
    params
  })
}
```

---

## 注意事项

1. ✅ 所有接口调用都要加 try-catch 错误处理
2. ✅ 提交操作要有 loading 状态，防止重复提交
3. ✅ 表单要添加验证规则
4. ✅ 列表页要支持刷新功能
5. ✅ 路由跳转要携带必要的参数（如 taskId）
6. ✅ 操作成功后要给用户明确的反馈
7. ✅ 敏感操作（删除）要二次确认

