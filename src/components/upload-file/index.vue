<template>
  <div>
    <!--  进度条 -->
    <bee-loading
      :percent="percent"
      :needProgress="true"
      v-show="beeLoading"
    ></bee-loading>
    <link-upload
      v-model="files"
      class="upload-wrapper"
      @mouseenter.native="dragenter = true"
      @mouseleave.native="dragenter = false"
      :beforeUpload="beforeUpload"
      :on-success="ocrRecognitionExcel"
      :on-progress="onProgress"
      :on-error="onError"
      :showFileList="false"
      :class="{ dragenter: dragenter }"
      :messageOffset="120"
      :maxSize="1024 * 1024 * 8"
      :accept="['jpg', 'jpeg', 'bmp', 'png', 'pdf']"
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
            支持PDF、JPG、PNG、JPEG、BMP格式，文件大小不超过8M
          </div>
        </div>
      </div>
    </link-upload>
  </div>
</template>

<script>
import beeLoading from "@linklogis/beeLoading";
export default {
  name: "upload-file",
  props: {
    productName: {
      type: String,
    },
  },
  data() {
    return {
      dragenter: false,
      files: [],
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
    };
  },
  components: {
    [beeLoading.name]: beeLoading,
  },
  methods: {
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageGeneralProduct",
          fixed: fixed,
        },
        "*"
      );
    },
    onError(res) {
      this.files = [];
      this.beeLoading = false;
      this.$message.error("文件上传失败（如文件未解压等）");
    },
    onProgress(event, file) {
      this.percent = Math.min(Math.floor((100 * file.loaded) / file.size), 98);
    },
    ocrRecognitionExcel(file) {
      this.$http
        .post(
          `/general-product-web/general/productRecognition?taskId=${this.files[0].taskId}&productName=${this.productName}`
        )
        .then((res) => {
          res = res.data;
          if (res.code === "200") {
            this.postFixdMessage(false);
            this.beeLoading = false;
            this.$message({
              message: "上传成功",
              type: "success",
              offset: 72,
            });
            this.percent = 100;
            this.documents.splice(0, this.documents.length > 1 ? 1 : 0, {
              name: res.data.name,
              requestId: res.data.requestId,
              pages: res.data.pages.map((i) => {
                return {
                  ...i,
                  collectImgUrl: `${i.img}${i.pageName}`,
                  img: this.resolveUrl(`${i.img}${i.pageName}`),
                  originalHeight: /0|2/.test(i.imgRotatingDeg / 90)
                    ? i.originalHeight
                    : i.originalWidth,
                  originalWidth: /0|2/.test(i.imgRotatingDeg / 90)
                    ? i.originalWidth
                    : i.originalHeight,
                  analysisResult: i.analysisResult.map((item) => {
                    return {
                      tabName: item.tabName,
                      tabResult: item.analysisResult.map((j) => {
                        return {
                          ...j,
                          coordinatesList: j.coordinatesList || [],
                        };
                      }),
                    };
                  }),
                };
              }),
            });
            this.starsFlag = false;
            this.page = this.documents[0].pages[0];
            this.tabsArray = this.page.analysisResult.map((item) => {
              return { name: item.tabName };
            });
            this.activeName = this.tabsArray[0].name;
          } else {
            this.postFixdMessage(false);
            this.beeLoading = false;
            this.$message({
              message: res.message,
              type: "error",
              offset: 72,
            });
          }
        });
      this.files = [];
    },
    beforeUpload(file) {
      this.postFixdMessage(true);
      this.percent = 0;
      window.setTimeout((_) => {
        this.beeLoading = true;
      }, 80);
    },
  },
};
</script>

<style lang="stylus">
.upload-wrapper {
  position: absolute;
  bottom: 0px;
  z-index: 9;

  .dragger-wrapper {
    width: 302px;
    height: initial;
    min-height: initial;
    background: #ffffff !important;
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
</style>