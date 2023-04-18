<template>
  <div class="seal-recognition-wrapper">
    <ocrlayout
      @resetId="
        () => {
          activeTextId = null;
          activeId = null;
        }
      "
      @tabs="tabs"
      :data="data"
      v-model="page"
      ref="documents"
      :activeTabIndex="activeTabIndex"
      :pageMenuPerm="pageMenuPerm"
    >
      <div class="result-list">
        <div
          class="list-item"
          @click="(e) => listClick(e, item)"
          :class="{ active: activeId === item.index }"
          v-for="item in page"
          :key="item.index"
        >
          <div class="head">{{ item.sealType }}</div>
          <div
            class="content"
            :class="{ contentActive: activeTextId === i.id }"
            v-for="i in item.itemVOS"
            @click.stop="(e) => clickHandler(e, i, item)"
            :key="i.key"
          >
            {{ i.key }}
          </div>
        </div>
      </div>
    </ocrlayout>

    <!--  进度条 -->
    <bee-loading
      :percent="percent"
      :needProgress="true"
      v-show="beeLoading"
    ></bee-loading>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      @click="clickSampleCollection"
      v-show="example.isUpload"
      v-loading="isLoading"
    >
      <svg-icon :iconClass="example.starsFlag ? '星星填充' : '星星'"></svg-icon>
      <span> {{ example.starsFlag ? "取消" : "难例" }}样本收集 </span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLSEALRECO']">
      <upload-file
        v-model="files"
        class="upload-wrapper"
        @http-request="handleFile"
        @mouseenter.native="dragenter = true"
        @mouseleave.native="dragenter = false"
        :class="{ dragenter: dragenter }"
      >
        <div
          class="upload-innder"
          @dragenter="dragenter = true"
          @dragleave="dragenter = false"
          @dragend="dragenter = false"
          @dragover="dragenter = true"
          @drop="dragenter = false"
          draggable="true"
        >
          <div class="put-upload" v-show="!dragenter">
            <svg-icon iconClass="上传"></svg-icon>
            <span>上传文件</span>
          </div>
          <div v-show="dragenter" class="expand-upload">
            <svg-icon iconClass="上传"></svg-icon>
            <div style="color: #5f6c80; margin-top: 12px; font-weight: bold">
              拖拽文件到此处或
              <span style="color: #0887ff; margin: 4px">点击上传</span>
            </div>
            <div class="upload-text">
              支持JPG、PNG、JPEG、BMP格式，文件大小不超过8M
            </div>
          </div>
        </div>
      </upload-file>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { data } from "./defaultData";
import beeLoading from "@linklogis/beeLoading";
import ocrlayout from "./ocr-layout";
export default {
  data() {
    return {
      isLoading: false,
      data,
      files: [],
      activeTextId: "",
      activeId: "",
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: "",
      servicePortAddress: "",
      activeDocumentIndex: 0,
      documents: [],
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
      search: "",
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      pageMenuPerm: {
        UPLSEALRECO: true,
      },
      falg: false,
    };
  },
  components: { [beeLoading.name]: beeLoading, ocrlayout },
  created() {
    this.documents = this.data[0];
    this.page = this.documents.ret;
  },
  computed: {
    example() {
      return this.data[this.activeDocumentIndex];
    },
    originLocation() {
      return process.env.NODE_ENV === "development"
        ? "https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image"
        : `${window.location.origin}/file-handle-web/file/image`;
    },
  },
  methods: {
    postFixedMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageFromSealRecognition",
          fixed: fixed,
        },
        "*"
      );
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.activeDocumentIndex = activeDocumentIndex;
      this.documents = this.data[activeDocumentIndex];
      this.page = this.documents.ret;
      this.activeTabIndex = 0;
    },
    handleClick(value) {
      this.activeTabIndex = Number(value.index);
      this.$refs.documents.handleClick(value.index);
    },
    listClick(e, i) {
      if (this.activeId === i.index) return;
      this.activeTextId = null;
      this.activeId = i.index;
      this.$refs.documents.$events.trigger("click-rectangle", {
        item: i,
      });
    },
    // 样本收集点击事件
    clickHandler(e, i, parent) {
      const el = e.target;
      this.activeId = parent.index;
      e = e || window.event;
      this.$refs.documents.$events.trigger("click-ocr-el", {
        el,
        id: i.id,
        item: i,
        // imageIndex: i.imageIndex,
      });
      this.activeTextId = this.$refs.documents.activeTextId;
    },
    clickSampleCollection() {
      if (this.isLoading) return;
      this.isLoading = true;
      const data = this.data[this.activeDocumentIndex];
      const picAddress = `${data.imagePath}${data.fileName}`;
      if (!data.starsFlag) {
        const fileId = data.id || "1";
        this.$http
          .post("/seal-recognition-web/seal/recognition/savecollectinfo", {
            fileId,
            picAddress,
            productName: "印章识别",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(this.data[this.activeDocumentIndex], "starsFlag", true);
              this.data[this.activeDocumentIndex].loadRecordId =
                res.data.data.loadRecordId;
              this.$message({
                message: "样本收集成功",
                type: "success",
                offset: 60,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 60,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      } else {
        this.$http
          .post("/seal-recognition-web/seal/recognition/cancelcollectinfo", {
            loadRecordId: this.data[this.activeDocumentIndex].loadRecordId,
            url: data.imagePath,
            name: data.fileName,
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.data[this.activeDocumentIndex].starsFlag = false;
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 60,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 60,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      }
    },
    // 点击上传
    handleFile(res) {
      const file = res.file;
      const fileSuffix = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toUpperCase();
      const whiteList = ["JPG", "PNG", "JPEG", "BMP"];
      const isLt8M = Number(file.size / 1024 / 1024);
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message({
          message: "上传文件只能是JPG、PNG、JPEG、 BMP格式",
          type: "error",
          offset: 60,
        });
        return false;
      }
      if (isLt8M > 8) {
        this.$message({
          message: "文件大小超过8M",
          type: "error",
          offset: 60,
        });
        return false;
      }
      this.uploadFile(file);
    },
    // 将文件资源传送到服务器
    uploadFile(file) {
      this.percent = 0;
      this.beeLoading = true;
      this.postFixedMessage(true);
      const fd = new FormData();
      fd.append("file", file);
      this.$http({
        url: "/seal-recognition-web/seal/recognition/upload",
        method: "post",
        data: fd,
        onUploadProgress: (progressEvent) => {
          this.percent =
            Math.ceil((progressEvent.loaded * 100) / progressEvent.total) - 2;
        },
      })
        .then((res) => {
          res = res.data;
          if (res.code === "200") {
            this.postFixedMessage(false);
            this.beeLoading = false;
            this.$message({
              message: "上传成功",
              type: "success",
              offset: 60,
            });
            this.percent = 100;
            res.data.forEach((i) => {
              i.isUpload = true;
              i.imageUrl = `${this.originLocation}?filename=${
                i.imagePath
              }${encodeURIComponent(i.fileName)}`;
            });
            if (this.data.length > 2) this.data.shift();
            this.data = res.data.concat(this.data);
            this.documents = this.data[0];
            this.page = this.documents.ret;
            // console.log(this.documents, "documents2");
            this.activeDocumentIndex = 0;
            this.activeTabIndex = 0;
          } else {
            this.beeLoading = false;
            this.postFixedMessage(false);
            this.$message({
              message: res.message,
              type: "error",
              offset: 60,
            });
          }
        })
        .catch((err) => {
          this.$message.error("文件上传失败（如文件未解压等）");
        })
        .finally((f) => {
          this.beeLoading = false;
        });
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false;
      }, 200);
    },
  },
};
</script>
<style lang="stylus">
.identify-data {
  .identify-header {
    display: flex;
    background: #F3F4F6;

    div {
      width: 50%;
      line-height: 40px;
      padding-left: 8px;
      border: 1px solid #E3E8F0;

      &:last-child {
        border-left: none;
      }
    }
  }

  .identify-content {
    .identify-content-top {
      display: flex;

      div {
        width: 50%;
        line-height: 40px;
        padding-left: 8px;
        border: 1px solid #E3E8F0;
        border-top: none;

        &:last-child {
          border-left: none;
        }
      }
    }

    .identify-content-other {
      border: 1px solid #E3E8F0;
      border-top: none;
      display: flex;
      box-sizing: border-box;

      .other-list {
        width: 50%;
        box-sizing: border-box;

        div {
          border-bottom: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }

      .other-left {
        align-content: center;
        width: 50%;
        box-sizing: border-box;
        display: flex;

        .other-info {
          border-bottom: 1px solid #E3E8F0;
          border-right: 1px solid #E3E8F0;
          border-left: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .lls-checkbox__label {
    padding-left: 4px;
    color: #202D40;
  }

  .lls-checkbox {
    margin-left: 32px;
  }

  .lls-checkbox__input.is-checked+.lls-checkbox__label {
    color: #202D40;
  }
}

.pre-line {
  white-space: pre-line;
}

.table-data {
  width: 100%;
  margin-bottom: 16px;

  tbody {
    tr {
      td {
        p {
          border-bottom: 1px solid #e3e8f0;
          white-space: pre-line;

          &:last-child {
            border: none;
          }
        }
      }
    }
  }

  thead {
    background: #F3F4F6;

    td {
      border-top: 1px solid #E3E8F0;
      font-weight: bold;
      color: #202D40;

      &:last-child {
        width: 50%;
        color: #202D40;
        border-right: 1px solid #E3E8F0;
      }
    }
  }

  tr td:last-child {
    width: 50%;
    color: #202D40;
    border-right: 1px solid #E3E8F0;
  }

  .td-title {
    width: 33% !important;
    border-right: none !important;
  }

  tr {
    &:hover {
      background: #f6f9fb;
      cursor: pointer;
    }

    &.active {
      .activeTd {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-right: none;
        border-left: none;
      }

      td:first-child {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-top-left-radius: 4px;
        border-right: none;
        border-bottom-left-radius: 4px;
      }

      td:last-child {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-left: 1px solid #E3E8F0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  td {
    line-height: 40px;
    padding-left: 8px;
    color: #5F6C80;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
    white-space: pre-line;
  }
}

.seal-recognition-wrapper {
  // loadin 样式
  .analyzing {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    background: #000000;
    position: fixed !important;
    z-index: 999;
    left: 0;
  }

  .sample-collection {
    width: 114px;
    position: fixed;
    right: -87px;
    bottom: 120px;
    transition: all 0.3s;
    cursor: pointer;
    padding: 12px;
    background: #0887ff;
    border-radius: 100px 0px 0px 100px;

    .lls-loading-spinner {
      margin-top: -10px;

      .circular {
        height: 21px;
        width: 21px;
      }
    }

    &:hover {
      right: 0px;
    }

    .svg-icon {
      font-size: 14px;
    }

    span {
      width: 72px;
      color: #fff;
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .upload-wrapper {
    position: absolute;
    bottom: 0px;
    z-index: 9;

    .dragger-wrapper {
      width: 302px;
      height: initial;
      min-height: initial;
      background: #ffffff;
      border: 1px solid #b4dbff;
      border-radius: 16px 16px 0px 0px;
      box-shadow: 0px -3px 6px 0px rgba(5, 18, 30, 0.04);
      text-align: center;
      cursor: pointer;

      .upload-innder {
        margin: 0;
        padding: 16px 36px;

        .put-upload {
          color: #0887ff;
          font-size: 16px;
          pointer-events: none;

          .svg-icon {
            font-size: 16px;
          }

          >span {
            vertical-align: middle;
            margin-left: 8px;
          }
        }

        .expand-upload {
          padding: 16px 0;
          pointer-events: none;

          .svg-icon {
            font-size: 24px;
          }

          .upload-text {
            color: #8492a6;
            margin-top: 8px;
          }
        }
      }
    }
  }
}

.result-list {
  .list-item {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
    border: 2px solid #E3E8F0;
    cursor: url('./icon/手指.svg'), grab;

    &:hover {
      box-shadow: 0px 3px 6px 3px rgba(5, 18, 30, 0.1);
    }

    .head {
      font-weight: bold;
      border-bottom: 1px solid #E3E8F0;
      padding: 10px 0;
      margin: 0 16px;
    }

    .content {
      line-height: 26px;
      margin: 0 8px;
      padding: 0 8px;
      margin-top: 8px;
      border: 1px solid #fff;

      &:hover {
        background: #F7F8FA;
      }
    }

    .contentActive {
      border: 1px solid #0887FF;
      background: rgba(8, 135, 255, 0.1);
      border-radius: 4px;
    }
  }

  .active {
    background: url('./icon/active.svg') no-repeat;
    background-position: 100% 0%;
    background-size: 24px 24px;
    border: 2px solid #0887FF;
  }
}
</style>
