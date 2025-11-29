<template>
  <div class="document-parsing-page">
    <div class="content-box">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">资产列表</h1>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="openDrawer"
            >新增</el-button
          >
           <el-button type="primary" icon="el-icon-plus" :disabled="selectedRows.length === 0" @click="handleExport"
            >导出</el-button
          >
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form
          :model="searchForm.queryCondition"
          :inline="true"
          class="search-form"
        >
          <el-form-item label="任务名称">
            <el-input
              v-model="searchForm.queryCondition.taskName"
              placeholder="请输入任务名称"
              clearable
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
         <el-table-column
      type="selection"
      width="55">
    </el-table-column>
          <el-table-column type="index" width="55" label="序号" />
          <el-table-column prop="taskName" label="任务名称" min-width="200" />
          <el-table-column prop="status" label="状态" min-width="120">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="200" />

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.status !== '已完成'"
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.status !== '待分类'"
                @click="handleClassify(scope.row)"
              >
                分类
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row)"
                style="color: #f56c6c"
              >
                删除
              </el-button>
                <el-button
                type="text"
                size="small"
                :disabled="scope.row.status !== '已完成'"
                @click="onStreamAnalysis(scope.row)"
              >
                流程分析
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
    <drawer ref="drawer" @submit-success="handleSubmitSuccess" @refresh="fetchTableData" />
  </div>
</template>

<script>
import drawer from "./drawer.vue";
import { getTaskList, deleteTask } from "@/api/taskManagement";

export default {
  name: "DocumentParsing",
  components: {
    drawer,
  },
  data() {
    return {
      loading: false,
      pollTimer: null,
      isPolling: false,
      searchForm: {
        queryCondition: {
          taskName: "",
        },
        pageSize: 10,
        currentPage: 1,
      },
        total: 3,

      tableData: [
        {
          id: 1,
          taskName: "资产任务1",
          status: "待分类",
          createTime: "2025-10-18 10:30:00",
        },
        {
          id: 2,
          taskName: "资产任务2",
          status: "解析中",
          createTime: "2025-10-15 14:20:00",
        },
        {
          id: 3,
          taskName: "资产任务3",
          status: "已完成",
          createTime: "2025-10-20 08:00:00",
        },
      ],
      selectedRows: [],
    };
  },
  created() {
    this.fetchTableData();
  },
  mounted() {
    this.startPolling();
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    onStreamAnalysis(row){
      this.$router.push({ name: "streamAnalysis", query: { taskId: row.id } });
    },
    handleExport() {
      console.log("导出");
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    openDrawer() {
      this.$refs.drawer.openDrawer();
    },
    // 获取表格数据
    async fetchTableData(silent = false) {
      if (!silent) this.loading = true;
      try {
        const response = await getTaskList(this.searchForm);
        if (response.data.code === "200" || response.data.data) {
          this.tableData = response.data.data.list;
          this.total = Number(response.data.data.total);
        }
      } catch (error) {
        console.error("获取任务列表失败：", error);
        this.$message.error("获取任务列表失败");
      } finally {
        if (!silent) this.loading = false;
      }
    },
    // 启动轮询（无感知）
    startPolling() {
      this.stopPolling(); // 先清理已存在的定时器
      const poll = async () => {
        // 避免组件销毁后仍然请求
        if (this._isBeingDestroyed || this._isDestroyed) return;
        // 避免轮询请求并发重叠
        if (this.isPolling) {
          this.pollTimer = setTimeout(poll, 10000);
          return;
        }
        this.isPolling = true;
        try {
          await this.fetchTableData(true); // silent: 不展示 loading
        } finally {
          this.isPolling = false;
          this.pollTimer = setTimeout(poll, 10000);
        }
      };
      // 首次延迟 10s 开始，以避免与初始化请求重叠
      this.pollTimer = setTimeout(poll, 10000);
    },
    // 停止轮询
    stopPolling() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
    // 处理新增成功
    handleSubmitSuccess(data) {
      // 刷新列表
      this.fetchTableData();
    },
    // 搜索
    handleSearch() {
      this.searchForm.currentPage = 1; // 重置到第一页
      this.fetchTableData();
    },

    // 重置搜索
    handleReset() {
      this.searchForm.queryCondition.taskName = "";
      this.handleSearch();
    },

    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        待处理: "info",
        解析中: "warning",
        分析中: "warning",
        已完成: "success",
        失败: "danger",
        初始化: "warning",
      };
      return statusMap[status] || "info";
    },

    // 查看
    handleView(row) {
      this.$router.push({ name: "tradeDocumentAnalysis", query: { taskId: row.id } });
    },

    // 分类
    handleClassify(row) {
      this.$router.push({ name: "classify", query: { taskId: row.id } });
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除这个任务吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTask(row.id).then(res => {
            if (res.data.code === "200") {
              this.$message.success("删除成功");
              this.fetchTableData();
            } else {
              this.$message.error("删除失败");
            }
          });
        }).catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.currentPage = 1; // 重置到第一页
      this.fetchTableData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.searchForm.currentPage = val;
      this.fetchTableData();
    },
  },
};
</script>

<style scoped lang="stylus">
.document-parsing-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .content-box {
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
      padding-bottom: 12px;
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

.el-button--primary.is-disabled{
  background-color: #999;
  border-color: #999;
}
</style>
