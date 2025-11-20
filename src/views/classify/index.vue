<template>
  <div class="container">
    <PageHeader
      @back="goBack"
      content="单据分组"
      :documentTypelist="documentTypelist"
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

        <div
          v-for="(group, idx) in groupList"
          :key="group.id"
          class="group-item"
        >
          <div class="group-header">
            <strong>组 {{ idx + 1 }}</strong>
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
            @click="batchGroup"
            :disabled="selectedImages.length === 0"
          >
            批量分组（单图成组）
          </el-button>
          <!-- <el-button
            @click="resetGroup"
            :disabled="selectedImages.length === 0"
          >
            重置为未分组
          </el-button> -->
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
            v-for="(img, index) in displayImages"
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
import {
  submitClassifyResult,
  getClassifyImages,
  getDocumentTypeList,
} from "@/api/taskManagement";
import { generateUuid } from "@/utils/uuid";
export default {
  name: "ImageGrouping",
  components: {
    PageHeader,
  },
  data() {
    return {
      selectedImages: [],
      images: Array.from({ length: 60 }, (_, i) => ({
        id: `vat-${i + 1}`,
        url: `https://picsum.photos/seed/vat-${i + 1}/200/350`,
        group: null,
        tab: null,
      })),
      activeName: "vat",
      // 组ID使用UUID；展示时用索引
      documentTypelist: [
        {
          label: "增值税发票",
          value: "vat",
        },
        {
          label: "流水",
          value: "financial_statement",
        },
        {
          label: "提货单",
          value: "delivery_order",
        },
        {
          label: "合同",
          value: "contract",
        },
      ],
      taskId: this.$route.query.taskId,
      useMock: true,
    };
  },
  computed: {
    groupList() {
      const groups = {};
      // 仅统计当前 Tab 中的已分组图片
      this.images.forEach((img) => {
        const groupId = img.group;
        if (groupId !== null && img.tab === this.activeName) {
          if (!groups[groupId]) groups[groupId] = { id: groupId, images: [] };
          groups[groupId].images.push(img);
        }
      });
      return Object.values(groups);
    },
    displayImages() {
      // 左侧仅展示“未分组”的图片，避免一图多组
      return this.images.filter((img) => img.group === null);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 根据默认 activeName 加载对应的图片列表
      // 移除按 Tab 加载，统一从全局图片池取未分组
      getDocumentTypeList().then((response) => {
        if (response.data.code === "200") {
          this.documentTypelist = response.data;
        }
      });

      if (this.useMock) {
        this.images = this.inflateImagesFromGroupingPayload(this.mockGroupingPayload());
        return;
      }

      getClassifyImages(this.taskId).then((response) => {
        if (response.data.code === "200") {
          const data = response.data.data.images
          this.images = this.inflateImagesFromGroupingPayload(data);
        }
      });
    },
    // mock 后端分组结构数据
    mockGroupingPayload() {
      return {
        unclassified: [
          "https://picsum.photos/seed/u1/200/350",
          "https://picsum.photos/seed/u2/200/350",
          { imageId: "u3", imageUrl: "https://picsum.photos/seed/u3/200/350" },
        ],
        vat: [
          [
            "https://picsum.photos/seed/v1/200/350",
            "https://picsum.photos/seed/v2/200/350",
          ],
          ["https://picsum.photos/seed/v3/200/350"],
        ],
        financial_statement: [
          [
            { imageId: "fs-1", imageUrl: "https://picsum.photos/seed/fs1/200/350" },
            { imageId: "fs-2", imageUrl: "https://picsum.photos/seed/fs2/200/350" },
          ],
        ],
        delivery_order: [[]],
        contract: [],
      };
    },
    // 将后端的分组结构还原为前端 images 列表
    inflateImagesFromGroupingPayload(payload) {
      const data = payload || {};
      const UNCLASSIFIED_KEY = "unclassified";
      const result = [];

      const pushImage = (url, groupId = null, tab = null, imageId = null) => {
        if (!url) return;
        result.push({
          id: imageId || generateUuid(),
          url,
          group: groupId,
          tab,
        });
      };

      // 1) 未分组
      const ungrouped = Array.isArray(data[UNCLASSIFIED_KEY])
        ? data[UNCLASSIFIED_KEY]
        : [];
      ungrouped.forEach((item) => {
        if (typeof item === "string") {
          pushImage(item, null, null, null);
        } else if (item && typeof item === "object") {
          pushImage(item.url || item.imageUrl, null, null, item.imageId);
        }
      });

      // 2) 各 Tab 的分组：二维数组
      Object.keys(data).forEach((key) => {
        if (key === UNCLASSIFIED_KEY) return;
        const groups = Array.isArray(data[key]) ? data[key] : [];
        groups.forEach((groupArr) => {
          const groupId = generateUuid();
          (Array.isArray(groupArr) ? groupArr : []).forEach((item) => {
            if (typeof item === "string") {
              pushImage(item, groupId, key, null);
            } else if (item && typeof item === "object") {
              pushImage(item.url || item.imageUrl, groupId, key, item.imageId);
            }
          });
        });
      });

      return result;
    },
    goBack() {
      this.$router.back();
    },
    handleTabChange(tabName) {
      // 切换tab时清空选中状态
      this.selectedImages = [];
      this.activeName = tabName;
      // this.loadImagesByTab(tabName);
    },
    getCurrentTab() {
      return this.documentTypelist.find(
        (item) => item.value === this.activeName
      );
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

      const newGroupId = generateUuid();
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = newGroupId;
          img.tab = this.activeName;
        }
      });
      this.selectedImages = [];
    },
    batchGroup() {
      if (this.selectedImages.length === 0) return;
      const currentTab = this.getCurrentTab();
      if (!currentTab) return;
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id) && img.group === null) {
          img.group = generateUuid();
          img.tab = this.activeName;
        }
      });
      this.selectedImages = [];
    },
    resetGroup() {
      if (this.selectedImages.length === 0) return;
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = null;
          img.tab = null;
        }
      });
      this.selectedImages = [];
    },
    deleteGroup(groupId) {
      // 仅删除当前 Tab 下该组（不影响其他 Tab）
      this.images.forEach((img) => {
        if (img.group === groupId && img.tab === this.activeName) {
          img.group = null;
          img.tab = null;
        }
      });
    },
    clearSelection() {
      this.selectedImages = [];
    },
    selectAll() {
      // 基于当前显示（未分组）的图片选择
      this.selectedImages = this.displayImages.map((img) => img.id);
    },
    handleSubmit() {
      // 收集所有 tab 的分组数据
      const groupingData = this.collectGroupingData();

      // 展示收集到的数据（调试用）
      console.log(
        "提交的分组数据 有则提交 没有默认按无分组处理:",
        groupingData
      );

      // 调用后台接口
      this.submitGroupingData(groupingData);
    },
    collectGroupingData() {
      // 生成结构：
      // { unclassified: [url, ...], <tab.value>: [[url, ...], [url, ...]], ... }
      const payload = { unclassified: [] };

      // 未分组（跨所有）
      this.images.forEach((img) => {
        if (img.group === null) payload.unclassified.push(img.url);
      });

      // 各 Tab 的分组
      this.documentTypelist.forEach((tab) => {
        const groupIdToUrls = {};
        this.images.forEach((img) => {
          if (img.tab === tab.value && img.group !== null) {
            if (!groupIdToUrls[img.group]) groupIdToUrls[img.group] = [];
            groupIdToUrls[img.group].push(img.url);
          }
        });
        // UUID 作为键，保持插入顺序即可
        const groupArrays = Object.keys(groupIdToUrls).map(
          (gid) => groupIdToUrls[gid]
        );
        payload[tab.value] = groupArrays.length > 0 ? groupArrays : [];
      });

      return payload;
    },

    async submitGroupingData(images) {
      try {
        // 调用 API 提交数据
        const response = await submitClassifyResult({
          taskId: this.taskId,
          images,
        });
        if (response.data.code === "200") {
          this.$message.success("提交成功！");
        } else {
          this.$message.error("提交失败！");
        }
      } catch (error) {
        this.$message.error("提交失败：" + (error.message || "未知错误"));
        console.error("提交分组数据失败:", error);
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
