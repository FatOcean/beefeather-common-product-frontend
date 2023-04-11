<template>
  <div class="document-ocr-wrapper" :class="{ 'bee-loading': beeLoading }">
    <ocr-layout
      v-model="page"
      ref="ocrLayout"
      :data="documents"
      locatable
      @on-open-viewer="postFixdMessage(true)"
      @on-close-viewer="postFixdMessage(false)"
    >
      <div slot="button">
        <llsButton
          type="text"
          @click="handleClickDownload"
          v-if="pageMenuPerm['DOWNCERTIFICATE']"
        >
          <svg-icon class="download" iconClass="下载"></svg-icon>
          <span>下载</span>
        </llsButton>
        <more-button
          productName="资质证书解析"
          :collect="pageMenuPerm['COLLCERTIFICATE']"
          :servicecon="pageMenuPerm['SERCERTIFICATE']"
          :collectName="true"
        ></more-button>
      </div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <th>字段名</th>
          <th>识别结果</th>
        </tr>
        <ocr-el
          tag="tr"
          :value="row.coordinatesList"
          v-for="(row, rowIndex) in page.analysisResult"
          :key="rowIndex"
        >
          <td>{{ row.key }}</td>
          <td v-html="resolveCol(row.value)"></td>
        </ocr-el>
      </table>
    </ocr-layout>

    <!--  进度条 -->
    <bee-loading
      :percent="percent"
      :needProgress="true"
      v-show="beeLoading"
    ></bee-loading>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      v-show="page.collectImgUrl"
      @click="clickSampleCollection"
    >
      <svg-icon :iconClass="starsFlag ? '星星填充' : '星星'"></svg-icon>
      <span>{{ starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADCERTIFICATE']">
      <upload-File
        productName="资质证书解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
      <!-- <link-upload
        v-model="files"
        class="upload-wrapper"
        @mouseenter.native="dragenter = true"
        @mouseleave.native="dragenter = false"
        :before-upload="beforeUpload"
        :on-success="ocrRecognitionExcel"
        :on-progress="onProgress"
        :on-error="onError"
        :showFileList="false"
        :class="{ dragenter: dragenter }"
        :accept="['pdf', 'jpg', 'png', 'jpeg', 'bmp']"
        :messageOffset="120"
        :maxSize="1024 * 1024 * 8"
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
      </link-upload> -->
    </lls-collapse-transition>
  </div>
</template>
<script>
import documents from "./example";
import beeLoading from "@linklogis/beeLoading";
import { OcrLayout, OcrEl } from "@linklogis/ocr-layout";
import { mapState } from "vuex";
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
      starsFlag: false, // 是否收集
      loadRecordId: "", // 难例收集id
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
  methods: {
    uploadFileData(res) {
      this.documents.splice(0, this.documents.length > 2 ? 1 : 0, {
        name: res.data[0].name,
        pages: res.data.map((i) => {
          return {
            ...i,
            collectImgUrl: i.img,
            img: this.resolveUrl(i.img),
            analysisResult: i.analysisResult.map((item) => {
              return {
                ...item,
                coordinatesList: item.coordinatesList || [],
              };
            }),
          };
        }),
      });
      this.starsFlag = false;
      this.page = this.documents[0].pages[0];
    },
    // 样本收集点击事件
    clickSampleCollection() {
      const picAddress = this.page.collectImgUrl;
      if (!this.starsFlag) {
        // const requestId = this.documents[0].requestId;
        this.$http
          .post(
            "/qualification-certificate-analysis-web/qualificationCertificate/saveCollectInfo",
            {
              // requestId: requestId,
              picAddress: picAddress,
              productName: "资质证书解析",
            }
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = true;
              this.loadRecordId = res.data.data.loadRecordId;
              this.$message({
                message: "样本收集成功",
                type: "success",
                offset: 120,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 120,
              });
            }
          });
      } else {
        this.$http
          .post(
            `/qualification-certificate-analysis-web/qualificationCertificate/cancelSaveCollectInfo?loadRecordId=${encodeURIComponent(
              this.loadRecordId
            )}&url=${encodeURIComponent(picAddress)}`
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = false;
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 120,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 120,
              });
            }
          });
      }
    },
    beforeUpload() {
      window.setTimeout((_) => {
        console.log("1");
        this.beeLoading = true;
      }, 80);
    },
    onProgress(event, file) {
      // console.log();
      this.percent = Math.min(Math.floor((100 * file.loaded) / file.size), 98);
    },
    onError(res) {
      // console.log(res);
      this.files = [];
      this.beeLoading = false;
      this.$message.error("文件上传失败（如文件未解压等）");
    },
    // 表格ocr识别
    ocrRecognitionExcel(file) {
      console.log(file);
      this.$http
        .post(
          `/qualification-certificate-analysis-web/qualificationCertificate/analysis/uploadAnalysis?taskId=${this.files[0].taskId}`
        )
        .then((res) => {
          res = res.data;
          if (res.code === "200") {
            this.beeLoading = false;
            this.$message({
              message: "上传成功",
              type: "success",
              offset: 120,
            });
            this.percent = 100;
            this.documents.splice(0, this.documents.length > 2 ? 1 : 0, {
              name: res.data[0].name,
              pages: res.data.map((i) => {
                return {
                  ...i,
                  collectImgUrl: i.img,
                  img: this.resolveUrl(i.img),
                  analysisResult: i.analysisResult.map((item) => {
                    return {
                      ...item,
                      coordinatesList: item.coordinatesList || [],
                    };
                  }),
                };
              }),
            });
            this.starsFlag = false;
            this.page = this.documents[0].pages[0];
          } else {
            this.beeLoading = false;
            this.$message({
              message: res.message,
              type: "error",
              offset: 120,
            });
          }
        });
      this.files = [];
    },
    resolveCol(value) {
      return value && value.replace(/。/gi, "<br/>");
    },
    // 下载识别结果
    handleClickDownload() {
      this.$http({
        method: "get",
        url: `/general-product-web/general/downloadResult?taskId=${this.page.requestId}&productName=资质证书解析解析`,
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
          this.$message({
            message: "网络错误，请稍后再试",
            type: "error",
            offset: 72,
          });
        });
      return;
      this.$http({
        method: "get",
        url: `/qualification-certificate-analysis-web/qualificationCertificate/downLoadFile?path=${encodeURIComponent(
          this.page.excelPath
        )}`,
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

    .ocr-inner .ocr-result .ocr-text {
      padding: 16px;

      * {
        user-select: text;
      }

      table {
        border-left: 1px solid #E3E8F0;
        border-top: 1px solid #E3E8F0;
        table-layout: fixed;
        width: 100%;
      }

      th, td {
        border: 1px solid transparent;
        border-right-color: #E3E8F0;
        border-bottom-color: #E3E8F0;
        min-width: 120px;
        padding: 8px;
        text-align: left;
        height: 40px;
        color: #202D40;
        white-space: initial;
      }

      .text.active {
        td, th {
          border-top-color: #0887ff;
          border-bottom-color: #0887ff;

          &:first-child {
            border-left-color: #0887ff;
          }

          &:last-child {
            border-right-color: #0887ff;
          }
        }
      }

      th {
        background-color: #F3F4F6;
        font-weight: 600;
      }

      td:first-child {
        color: #8492A6;
      }
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
