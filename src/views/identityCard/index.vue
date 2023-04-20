<template>
  <div class="document-ocr-wrapper" :class="{ 'bee-loading': beeLoading }">
    <ocr-layout
      v-model="page"
      ref="ocrlayout"
      :data="documents"
      locatable
      isMultiCoordinate
      @on-open-viewer="postFixdMessage(true)"
      @on-close-viewer="postFixdMessage(false)"
      @on-change-example="handleChangeExample"
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
          v-if="pageMenuPerm['DOWNIDENTITY']"
        >
          <!-- v-if="pageMenuPerm['DOWNCERTIFICATE']" -->
          <svg-icon class="download" iconClass="下载"></svg-icon>
          <span>下载</span>
        </llsButton>
        <more-button
          productName="身份证解析"
          :collect="pageMenuPerm['COLLIDENTITY']"
          :servicecon="pageMenuPerm['SERIDENTITY']"
          :collectName="true"
        ></more-button>
      </div>
      <lls-tabs
        @tab-click="handleClick"
        v-model="activeName"
        v-if="tabsArray.length > 1"
      >
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        >
        </lls-tab-pane>
      </lls-tabs>

      <table cellspacing="0" cellpadding="0">
        <tr>
          <th>字段名</th>
          <th>识别结果</th>
        </tr>
        <ocr-el
          tag="tr"
          :value="row.coordinatesList"
          v-for="(row, rowIndex) in tabResult"
          :key="rowIndex"
        >
          <td>{{ row.key }}</td>
          <td style="white-space: pre-line">{{ row.value }}</td>
        </ocr-el>
      </table>
    </ocr-layout>

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
    <!-- createUrl="/beefeather/file-handle-web/file/createUploadRecord"
        action="/beefeather/file-handle-web/file/upload" -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADIDENTITY']">
      <!-- v-if="pageMenuPerm['UPLOADCERTIFICATE']" -->
      <upload-File
        productName="身份证解析"
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
      starsFlag: false, // 是否收集
      loadRecordId: "", // 难例收集id
      activeName: "",
      tabsArray: [],
      activeTabIndex: 0,
    };
  },
  components: {
    [beeLoading.name]: beeLoading,
    [OcrLayout.name]: OcrLayout,
    [OcrEl.name]: OcrEl,
  },
  computed: {
    ...mapState(["pageMenuPerm"]),
    tabResult() {
      return this.page.analysisResult[this.activeTabIndex].tabResult;
    },
  },
  created() {
    this.page = this.documents[0].pages[0];
    this.tabsArray = this.page.analysisResult.map((item) => {
      return { name: item.tabName };
    });
    this.activeName = this.tabsArray[0].name;
  },
  methods: {
    handleClick(value) {
      // console.log(this.$refs.ocrlayout);
      this.activeTabIndex = Number(value.index);
      // this.$refs.ocrlayout.resetProps();
      this.$refs.ocrlayout.pathValue = null;
      this.$refs.ocrlayout.activeText = null;
      this.$refs.ocrlayout.activeTextId = "";
    },
    handleChangeExample() {
      this.activeTabIndex = 0;
      this.$nextTick(() => {
        this.tabsArray = this.page.analysisResult.map((item) => {
          return { name: item.tabName };
        });
        this.activeName = this.tabsArray[0].name;
      });
    },

    // 样本收集点击事件
    clickSampleCollection() {
      const requestId = this.documents[0].requestId;
      const picAddress = this.page.collectImgUrl;
      if (!this.starsFlag) {
        // const requestId = this.documents[0].requestId;
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            requestId: requestId,
            picAddress: picAddress,
            productName: "身份证解析",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = true;
              this.loadRecordId = res.data.data;
              this.$message({
                message: "样本收集成功",
                type: "success",
                offset: 72,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 72,
              });
            }
          });
      } else {
        this.$http
          .post(
            `/general-product-web/hardCaseCollect/cancelSaveCollectInfo?loadRecordId=${encodeURIComponent(
              this.loadRecordId
            )}&picAddress=${encodeURIComponent(picAddress)}`
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = false;
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 72,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 72,
              });
            }
          });
      }
    },
    uploadFileData(res) {
      this.documents.splice(0, this.documents.length > 2 ? 1 : 0, {
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
    },
    resolveCol(value) {
      return value && value.replace(/。/gi, "<br/>");
    },
    // 下载识别结果
    handleClickDownload() {
      this.$http({
        method: "get",
        url: `/general-product-web/general/downloadResult?taskId=${this.$refs.ocrlayout.example.requestId}&productName=身份证解析`,
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
