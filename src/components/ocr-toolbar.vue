<template>
  <div>
    <div class="tool-bar">
      <div class="name">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ data[activeGroupIndex].group_name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in data" :key="item.group_name" :command="index">{{
              item.group_name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip effect="dark" :content="fileName" placement="bottom-start">
          <span>{{ fileName }}</span>
        </el-tooltip>
      </div>
      <div>
        <svg-icon
          v-if="activePageIndex === 1"
          class="dis-icon"
          iconClass="左置灰"
        ></svg-icon>
        <svg-icon
          v-else
          class="big-icon"
          iconClass="ic-左"
          @click.native="handleTurnPage(-1)"
        ></svg-icon>
        <span class="number">
          <input
            class="dih-page-input"
            type="number"
            v-model.number="activePageIndex"
            v-on:change="handleInputChange"
          /><span>/&nbsp;&nbsp;{{ total }}</span>
        </span>
        <svg-icon
          v-if="activePageIndex === total"
          class="dis-icon"
          iconClass="右置灰"
        ></svg-icon>
        <svg-icon
          v-else
          class="big-icon"
          iconClass="ic-右"
          @click.native="handleTurnPage(1)"
        ></svg-icon>
      </div>
      <div>
        <svg-icon
          iconClass="ic-放大"
          @click.native="handleZoom(zoomStep)"
        ></svg-icon>
        <svg-icon
          iconClass="ic-缩小"
          @click.native="handleZoom(-zoomStep)"
        ></svg-icon>
        <svg-icon iconClass="ic-旋转" @click.native="handleRotate"></svg-icon>
        <svg-icon
          iconClass="ic-恢复默认"
          @click.native="handleReset"
        ></svg-icon>
        <svg-icon
          iconClass="ic-全屏"
          @click.native="handleFullscreen"
        ></svg-icon>
      </div>
    </div>
    <!-- 图片预览组件 -->
    <imageViewer
      v-if="showImageViewer"
      :urlList="urlList"
      :onClose="handleCloseImageViewer"
    />
  </div>
</template>

<script>
import imageViewer from "@/components/imageViewer.vue";

export default {
  name: "OcrToolbar",
  components: {
    imageViewer,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    // 文件名
    fileName: {
      type: String,
      required: true,
    },
    // 当前页码
    activePageIndex: {
      type: Number,
      required: true,
    },
    // 总页数
    total: {
      type: Number,
      required: true,
    },
    // 缩放步长
    zoomStep: {
      type: Number,
      default: 0.2,
    },
    // 图片列表
    urlList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showImageViewer: false,
      activeGroupIndex: 0,
    };
  },
  methods: {
    handleCommand(index) {
      this.activeGroupIndex = index;
      this.$emit("change-group", index);
    },
    // 翻页
    handleTurnPage(direction) {
      this.$emit("turn-page", direction);
    },
    // 输入页码变化
    handleInputChange(event) {
      this.$emit("input-change", event);
    },
    // 缩放
    handleZoom(step) {
      this.$emit("zoom", step);
    },
    // 旋转
    handleRotate() {
      this.$emit("rotate");
    },
    // 重置
    handleReset() {
      this.$emit("reset");
    },
    // 全屏
    handleFullscreen() {
      this.showImageViewer = true;
    },
    // 关闭图片预览
    handleCloseImageViewer() {
      this.showImageViewer = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.tool-bar {
  height: 38px;
  line-height: 38px;
  padding: 0 16px;
  box-shadow: 0px 3px 8px 0px rgba(5, 18, 30, 0.08);
  font-size: 12px;
  display: flex;
  justify-content: space-between;

  >div {
    flex: 1;
    text-align: center;

    &:last-child {
      text-align: right;
    }
  }

  .name {
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .number {
    border-bottom: 1px solid #E3E8F0;
    padding: 0 8px;

    .el-input {
      width: auto;

      .el-input__inner {
        max-width: 30px;
        color: #999;
        position: relative;
        left: -4px;
        border: none;
        height: 14px;
        padding: 0;
        border-radius: 0;
        text-align: center;

        &:focus {
          border-color: #009688;
        }
      }
    }

    span {
      font-size: 12px;
    }
  }

  .svg-icon {
    font-size: 12px;
    margin: 0 6px;
    cursor: pointer;

    &.big-icon, &.dis-icon {
      font-size: 15px;
      margin: 0 4px;
    }

    &.dis-icon {
      cursor: default;
    }
  }
}
</style>
