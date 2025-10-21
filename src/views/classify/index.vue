<template>
  <div class="container">
    <PageHeader @back="goBack" content="单据分组"> </PageHeader>

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
           <el-button
            @click="selectAll"
            :disabled="selectedImages.length === 0"
          >
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
export default {
  name: "ImageGrouping",
  components: {
    PageHeader,
  },
  data() {
    return {
      nextGroupId: 1,
      selectedImages: [],
      images: [],
      data: {
        taskId: "",
        data: [
          {
            name: "增值税发票",
            value: "vat",
            imagesList: [
              {
                imageUrl: "xxx",
                imageName: "xxx",
                group:'', // 有参数代表有组别 传null或者为空 表示单独为一张
              },
            ],
          },
        ],
      },
      mockData: [
        {
          name: "增值税发票",
          value: "vat",
          imagesList: [
            {
              imageUrl: "xxx",
              imageName: "xxx",
            },
          ],
        },
        {
          name: "流水",
          value: "financial_statement",
          imagesList: [{}],
        },
        {
          name: "提货单",
          value: "bill_of_lading",
          imagesList: [{}],
        },
        {
          name: "合同",
          value: "contract",
          imagesList: [{}],
        },
      ],
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
    // 模拟 12 张图片
    this.images = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/seed/${i + 1}/200/350`,
      group: null,
    }));
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    toggleSelect(img) {
      const idx = this.selectedImages.indexOf(img.id)
      if (idx > -1) this.selectedImages.splice(idx, 1)
      else this.selectedImages.push(img.id)
    },
    createGroup() {
      if (this.selectedImages.length === 0) return
      const newGroupId = this.nextGroupId++
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = newGroupId
        }
      });
      this.selectedImages = []
    },
    resetGroup() {
      if (this.selectedImages.length === 0) return
      this.images.forEach((img) => {
        if (this.selectedImages.includes(img.id)) {
          img.group = null
        }
      })
      this.selectedImages = []
    },
    deleteGroup(groupId) {
      this.images.forEach((img) => {
        if (img.group === groupId) img.group = null
      })
    },
    clearSelection() {
      this.selectedImages = []
    },
    selectAll() {
      this.images.forEach((img) => {
        this.selectedImages.push(img.id)
      })
    }
  }
}
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
