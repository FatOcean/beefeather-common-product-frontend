<template>
  <div class="container">
    <PageHeader
      @back="goBack"
      content="单据分组"
      :mockData="mockData"
      :activeName="activeName"
      @tab-change="handleTabChange"
      @submit="handleSubmit"
    >
    </PageHeader>

    <div class="content">
      <!-- 右侧分组情况 -->
      <div class="right-panel">
        <h3>当前分组情况</h3>
        <div v-if="groupList.length === 0" class="empty">暂无分组</div>

        <div v-for="group in groupList" :key="group.id" class="group-item">
          <div class="group-header">
            <strong>组 {{ group.id }}</strong>
            <el-button class="delete-btn" @click="deleteGroup(group.id)">
              删除组
            </el-button>
          </div>

          <div class="group-images">
            <img
              v-for="img in group.images"
              :key="img.id"
              :src="img.url"
              alt="缩略图"
            />
          </div>
        </div>
      </div>
      <!-- 左侧图片区域 -->
      <div class="left-panel">
        <div class="toolbar">
          <el-button
            @click="createGroup"
            :disabled="selectedImages.length === 0"
          >
            创建新组 (选中 {{ selectedImages.length }} 张)
          </el-button>
          <el-button
            @click="resetGroup"
            :disabled="selectedImages.length === 0"
          >
            重置为未分组
          </el-button>
          <el-button
            @click="clearSelection"
            :disabled="selectedImages.length === 0"
          >
            清除选中
          </el-button>
          <el-button @click="selectAll" :disabled="selectedImages.length === 0">
            全选
          </el-button>
        </div>

        <div class="image-grid">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="image-box"
            :class="{
              selected: selectedImages.includes(img.id),
              [`group-${img.group}`]: img.group !== null,
              ungrouped: img.group === null,
            }"
            @click="toggleSelect(img)"
          >
            <img :src="img.url" alt="示例图片" />
            <div class="label">
              {{ img.group !== null ? "组 " + img.group : "未分组" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "./pageHeader.vue";
import { submitClassifyResult,getClassifyImages } from "@/api/taskManagement";

export default {
  name: "ImageGrouping",
  components: {
    PageHeader,
  },
  data() {
    return {
      selectedImages: [],
      images: [],
      activeName: "vat",
      mockData: [
        {
          name: "增值税发票",
          value: "vat",
          imagesList: Array.from({ length: 60 }, (_, i) => ({
            id: `vat-${i + 1}`,
            url: `https://picsum.photos/seed/vat-${i + 1}/200/350`,
            group: null,
          })),
        },
        {
          name: "流水",
          value: "financial_statement",
          imagesList: Array.from({ length: 45 }, (_, i) => ({
            id: `financial-${i + 1}`,
            url: `https://picsum.photos/seed/financial-${i + 1}/200/350`,
            group: null,
          })),
        },
        {
          name: "提货单",
          value: "bill_of_lading",
          imagesList: Array.from({ length: 30 }, (_, i) => ({
            id: `bill-${i + 1}`,
            url: `https://picsum.photos/seed/bill-${i + 1}/200/350`,
            group: null,
          })),
        },
        {
          name: "合同",
          value: "contract",
          imagesList: Array.from({ length: 20 }, (_, i) => ({
            id: `contract-${i + 1}`,
            url: `https://picsum.photos/seed/contract-${i + 1}/200/350`,
            group: null,
          })),
        },
      ],
      taskId: this.$route.query.taskId,
    };
  },
  computed: {
    groupList() {
      const groups = {};
      this.images.forEach((img) => {
        const groupId = img.group;
        if (groupId !== null) {
          if (!groups[groupId]) groups[groupId] = { id: groupId, images: [] };
          groups[groupId].images.push(img);
        }
      });
      return Object.values(groups);
    },
  },
  created() {
    // 根据默认 activeName 加载对应的图片列表
    this.loadImagesByTab(this.activeName);

    getClassifyImages(this.taskId).then((response) => {
      if (response.code === '200') {
        this.images = response.data;
      }
    });
    console.log(this.mockData, '现有mock数据')
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    handleTabChange(tabName) {
      // 切换tab时清空选中状态
      this.selectedImages = [];
      this.activeName = tabName;
      this.loadImagesByTab(tabName);
    },
    loadImagesByTab(tabName) {
      const currentTab = this.mockData.find(item => item.value === tabName);
      if (currentTab && currentTab.imagesList) {
        // 直接引用原数据，这样修改会保存到 mockData 中
        this.images = currentTab.imagesList;
      } else {
        this.images = [];
      }
    },
    getCurrentTab() {
      return this.mockData.find(item => item.value === this.activeName);
    },
    toggleSelect(img) {
      const idx = this.selectedImages.indexOf(img.id);
      if (idx > -1) this.selectedImages.splice(idx, 1);
      else this.selectedImages.push(img.id);
    },
    createGroup() {
      if (this.selectedImages.length === 0) return;
      const currentTab = this.getCurrentTab();
      if (!currentTab) return;
      
      const newGroupId = currentTab.nextGroupId++;
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = newGroupId;
        }
      });
      this.selectedImages = [];
    },
    resetGroup() {
      if (this.selectedImages.length === 0) return;
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = null;
        }
      });
      this.selectedImages = [];
    },
    deleteGroup(groupId) {
      this.images.forEach((img) => {
        if (img.group === groupId) img.group = null;
      });
    },
    clearSelection() {
      this.selectedImages = [];
    },
    selectAll() {
      this.images.forEach((img) => {
        this.selectedImages.push(img.id);
      });
    },
    handleSubmit() {
      // 收集所有 tab 的分组数据
      const groupingData = this.collectGroupingData();
      
      // 展示收集到的数据（调试用）
      console.log('提交的分组数据 有则提交 没有默认按无分组处理:', groupingData);
      
      // 调用后台接口
      this.submitGroupingData(groupingData);
    },
    collectGroupingData() {
      const result = [];
      
      // 遍历所有 tab
      this.mockData.forEach((tab) => {
        // 收集该 tab 中的所有分组
        const groups = {};
        
        tab.imagesList.forEach((img) => {
          if (img.group !== null) {
            if (!groups[img.group]) {
              groups[img.group] = {
                groupId: img.group,
                images: [],
              };
            }
            groups[img.group].images.push({
              id: img.id,
              url: img.url,
            });
          }
        });
        
        // 如果该 tab 有分组数据，则添加到结果中
        const groupList = Object.values(groups);
        if (groupList.length > 0) {
          result.push({
            documentType: tab.value,
            documentName: tab.name,
            groups: groupList,
            // totalGroups: groupList.length,
            // totalImages: groupList.reduce((sum, g) => sum + g.images.length, 0),
          });
        }
      });
      
      return result;
    },
    async submitGroupingData(data) {
      try {
        
        // 调用 API 提交数据
        const response = await submitClassifyResult({ taskId: this.taskId, data });
        if (response.code === '200') {
          this.$message.success("提交成功！");
        } else {
          this.$message.error("提交失败！");
        }
      } catch (error) {
        this.$message.error('提交失败：' + (error.message || '未知错误'));
        console.error('提交分组数据失败:', error);
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.container {
  padding: 12px;
  height: 100vh;
  font-family: sans-serif;

  .el-page-header {
    border-bottom: 1px solid #e5e7ec;
    margin-bottom: 12px;
  }

  .content {
    display: flex;
    gap: 20px;
    height: calc(100vh - 80px);

    /* 左侧图片区域 */
    .left-panel {
      flex: 3;
      height: 100%;
      overflow: auto;
      padding: 0 12px;

      .toolbar {
        margin-bottom: 16px;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;

        .image-box {
          position: relative;
          border: 3px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.03);
          }

          img {
            width: 100%;
            display: block;
            user-select: none;
          }

          .label {
            position: absolute;
            bottom: 5px;
            left: 5px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
          }

          &.selected {
            border-color: #009688 !important;
            /* box-shadow: 0 0 10px rgba(0, 255, 157, 0.8); */
            /* transform: scale(1.05); */
            z-index: 1;
          }

          &.ungrouped {
            border-color: #ccc;
          }
        }
      }
    }

    /* 右侧分组情况 */
    .right-panel {
      flex: 1.2;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      overflow-y: auto;
      max-height: 100%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

      .empty {
        text-align: center;
        color: #777;
        margin-top: 20px;
      }

      .group-item {
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        margin-bottom: 12px;
        padding: 8px;

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .group-images {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;

          img {
            width: 60px;
            height: 95px;
            object-fit: cover;
            border-radius: 4px;
            border: 2px solid #ccc;
          }
        }
      }
    }
  }
}
</style>
