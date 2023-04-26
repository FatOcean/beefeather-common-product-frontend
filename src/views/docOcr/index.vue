<template>
  <div class="document-ocr-wrapper" :class="{ 'bee-loading': beeLoading }">
    <ocr-layout
      ref="ocrlayout"
      :data="documents"
      v-model="page"
      locatable
      @on-open-viewer="postFixdMessage(true)"
      @on-close-viewer="postFixdMessage(false)"
      showAllCoordinate
      :coordinateData="page.wordData"
    >
      <div
        slot="button"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 18px;
        "
      >
        <llsButton
          type="text"
          @click="handleClickDownload"
          v-if="pageMenuPerm['DOWNDOCUMOCR']"
        >
          <!-- v-if="pageMenuPerm['DOWNCERTIFICATE']" -->
          <svg-icon class="download" iconClass="下载"></svg-icon>
          <span>下载</span>
        </llsButton>
        <more-button
          productName="文档OCR"
          :collect="pageMenuPerm['COLLDOCUMOCR']"
          :servicecon="pageMenuPerm['SERDOCUMOCR']"
        ></more-button>
      </div>
      <ocr-el
        v-for="(i, index) in page.wordData"
        :key="index"
        :id="i.id"
        :value="i"
        :class="[`rect${i.id}`]"
        >{{ i.text }}</ocr-el
      >
    </ocr-layout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      v-show="page.collectImgUrl"
      @click="clickSampleCollection"
    >
      <svg-icon :iconClass="page.starsFlag ? '星星填充' : '星星'"></svg-icon>
      <span>{{ page.starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <!-- createUrl="/beefeather/file-handle-web/file/createUploadRecord"
        action="/beefeather/file-handle-web/file/upload" -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADDOCUMOCR']">
      <upload-File
        productName="文档OCR"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import documents from "./example";
import beeLoading from "@linklogis/beeLoading";
import { OcrLayout, OcrEl } from "@linklogis/ocr-layout";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      files: [],
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      documents: documents,
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
      falg: true,
    };
  },
  components: {
    [beeLoading.name]: beeLoading,
    [OcrLayout.name]: OcrLayout,
    [OcrEl.name]: OcrEl,
  },
  computed: {
    ...mapState(["pageMenuPerm"]),
  },
  created() {
    this.page = this.documents[0].pages[0];
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
    // 样本收集点击事件
    clickSampleCollection() {
      if (!this.page.starsFlag) {
        const requestId = this.documents[0].id;
        const picAddress = this.page.collectImgUrl;
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            requestId: requestId,
            picAddress: picAddress,
            productName: "文档OCR",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(this.page, "starsFlag", true);
              // this.page.starsFlag = true;
              this.page.loadRecordId = res.data.data;
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
          });
      } else {
        this.$http
          .post(
            `/general-product-web/hardCaseCollect/cancelSaveCollectInfo?loadRecordId=${encodeURIComponent(
              this.page.loadRecordId
            )}&picAddress=${encodeURIComponent(this.page.collectImgUrl)}`
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.page.starsFlag = false;
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
          });
      }
    },

    uploadFileData(res) {
      let pages = res.data.specificData;
      pages.forEach((i) => {
        i.starsFlag = false;
        i.img = this.resolveUrl(i.img);
      });
      this.documents.splice(0, this.documents.length > 3 ? 1 : 0, {
        pages,
        name: res.data.name,
        id: res.data.id,
      });
      this.page = this.documents[0].pages[0];
    },

    // 下载识别结果
    handleClickDownload() {
      this.$http({
        method: "get",
        url: `/general-product-web/general/downloadResult?taskId=${this.$refs.ocrlayout.example.id}&productName=文档OCR`,
        responseType: "blob",
      })
        .then((res) => {
          const fileName =
            res.headers["content-disposition"] &&
            res.headers["content-disposition"]
              .split(";")[1]
              .split("filename=")[1]
              .replace(/"/gi, "");
          const blob = res.data;
          const type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8";
          this.exportByBlob(blob, decodeURIComponent(fileName), type);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="stylus">
.document-ocr-wrapper {
  .ocr-layout {
    padding: 76px 24px 24px 24px;
  }

  .ocr-result {
    * {
      user-select: text;
    }
  }

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

    &:hover {
      right: 0px;
    }

    .svg-icon {
      font-size: 14px;
    }

    span {
      display: inline-block;
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
</style>

<style>
.frame-mask-svg {
  transform: rotate(0deg) !important;
}
</style>