<template>
  <div class="container">
    <h2>图片分组示例</h2>

    <div class="content">
      <!-- 左侧图片区域 -->
      <div class="left-panel">
        <div class="toolbar">
          <button @click="createGroup" :disabled="selectedImages.length === 0">
            创建新组 (选中 {{ selectedImages.length }} 张)
          </button>
          <button @click="resetGroup" :disabled="selectedImages.length === 0">
            重置为未分组
          </button>
          <button @click="clearSelection" :disabled="selectedImages.length === 0">
            清除选中
          </button>
        </div>

        <div class="image-grid">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="image-box"
            :class="{
              selected: selectedImages.includes(img.id),
              [`group-${img.group}`]: img.group !== null,
              ungrouped: img.group === null
            }"
            @click="toggleSelect(img)"
          >
            <img :src="img.url" alt="示例图片" />
            <div class="label">
              {{ img.group !== null ? '组 ' + img.group : '未分组' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧分组情况 -->
      <div class="right-panel">
        <h3>当前分组情况</h3>
        <div v-if="groupList.length === 0" class="empty">
          暂无分组
        </div>

        <div
          v-for="group in groupList"
          :key="group.id"
          class="group-item"
        >
          <div class="group-header">
            <strong>组 {{ group.id }}</strong>
            <button class="delete-btn" @click="deleteGroup(group.id)">
              删除组
            </button>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageGrouping",
  data() {
    return {
      nextGroupId: 1,
      selectedImages: [],
      images: [],
    };
  },
  computed: {
    groupList() {
      const groups = {};
      this.images.forEach(img => {
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
    this.images = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/seed/${i + 1}/200/150`,
      group: null,
    }));
  },
  methods: {
    toggleSelect(img) {
      const idx = this.selectedImages.indexOf(img.id);
      if (idx > -1) this.selectedImages.splice(idx, 1);
      else this.selectedImages.push(img.id);
    },
    createGroup() {
      if (this.selectedImages.length === 0) return;
      const newGroupId = this.nextGroupId++;
      this.images.forEach(img => {
        if (this.selectedImages.includes(img.id)) {
          img.group = newGroupId;
        }
      });
      this.selectedImages = [];
    },
    resetGroup() {
      if (this.selectedImages.length === 0) return;
      this.images.forEach(img => {
        if (this.selectedImages.includes(img.id)) {
          img.group = null;
        }
      });
      this.selectedImages = [];
    },
    deleteGroup(groupId) {
      this.images.forEach(img => {
        if (img.group === groupId) img.group = null;
      });
    },
    clearSelection() {
      this.selectedImages = [];
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: sans-serif;
}
h2 {
  margin-bottom: 16px;
}
.content {
  display: flex;
  gap: 20px;
}

/* 左侧图片区域 */
.left-panel {
  flex: 3;
}
.toolbar {
  margin-bottom: 16px;
}
button {
  margin-right: 10px;
  padding: 6px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover:not(:disabled) {
  background-color: #0069d9;
}
button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.image-box {
  position: relative;
  border: 3px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}
.image-box:hover {
  transform: scale(1.03);
}
.image-box img {
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

/* ✅ 点击选中时的边框样式 */
.selected {
  border-color: #ff9800 !important;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.8);
  transform: scale(1.05);
  z-index: 1;
}

/* 分组边框颜色 */
.ungrouped {
  border-color: #ccc;
}
.group-1 {
  border-color: #e74c3c;
}
.group-2 {
  border-color: #3498db;
}
.group-3 {
  border-color: #2ecc71;
}
.group-4 {
  border-color: #9b59b6;
}
.group-5 {
  border-color: #f1c40f;
}

/* 右侧分组情况 */
.right-panel {
  flex: 1.2;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  overflow-y: auto;
  max-height: 80vh;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.group-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 12px;
  padding: 8px;
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete-btn {
  background: #dc3545;
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #c82333;
}
.group-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.group-images img {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid #ccc;
}
.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}
</style>

