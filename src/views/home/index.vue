<template>
    <div class="document-parsing-page">
        <div class="content-box">

            <!-- 页面标题 -->
            <div class="page-header">
                <h1 class="page-title">单据解析</h1>
                <div class="header-actions">
                    <el-button type="primary" icon="el-icon-plus" @click="openDrawer">新增</el-button>
                </div>
            </div>

            <!-- 搜索区域 -->
            <div class="search-section">
                <el-form :model="searchForm" :inline="true" class="search-form">
                    <el-form-item label="任务名称">
                        <el-input v-model="searchForm.taskName" placeholder="请输入任务名称" clearable style="width: 300px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 表格区域 -->
            <div class="table-section">
                <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%">
                    <el-table-column label=" " type="index" width="55" />
                    <el-table-column prop="index" label="序号" width="80" />
                    <el-table-column prop="taskName" label="任务名称" min-width="200" />
                    <el-table-column prop="status" label="状态" width="120">
                        <template slot-scope="scope">
                            <el-tag :type="getStatusType(scope.row.status)" size="small">
                                {{ scope.row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleView(scope.row)">
                                查看
                            </el-button>
                            <el-button type="text" size="small" @click="handleClassify(scope.row)">
                                分类
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color: #f56c6c">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total" />
            </div>
        </div>
        <drawer ref="drawer" />
    </div>
</template>

<script>
import drawer from './drawer.vue'
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
      tableData: [
        {
          id: 1,
          taskName: '发票解析任务001',
          status: '处理中'
        },
        {
          id: 2,
          taskName: '合同解析任务002',
          status: '已完成'
        },
        {
          id: 3,
          taskName: '收据解析任务003',
          status: '待处理'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 3
      }
    }
  },
  methods: {
    openDrawer() {
      this.$refs.drawer.openDrawer()
    },
    // 搜索
    handleSearch() {
      this.loading = true
      // 模拟搜索请求
      setTimeout(() => {
        this.loading = false
        this.$message.success('搜索完成')
      }, 1000)
    },

    // 重置搜索
    handleReset() {
      this.searchForm.taskName = ''
      this.handleSearch()
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

    // 查看
    handleView(row) {
      this.$router.push({ name: 'tradeDocumentAnalysis' })
      this.$message.info(`查看任务: ${row.taskName}`)
    },

    // 分类
    handleClassify(row) {
      this.$router.push({ name: 'classify' })
      this.$message.info(`分类任务: ${row.taskName}`)
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除这个任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        // 这里可以添加删除逻辑
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.handleSearch()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.handleSearch()
    }
  }
}
</script>

<style scoped lang="stylus">
.document-parsing-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .content-box{
    background: #fff;
    height: calc(100vh - 40px);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #E5E7EC;
        padding-bottom:12px;
    }
  }
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.search-form {
  margin: 0;
}

.table-section {
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  gap: 10px;
}
</style>
