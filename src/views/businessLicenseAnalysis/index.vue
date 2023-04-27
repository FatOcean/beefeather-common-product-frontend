<template>
  <div class="business-license">
    <ocrlayout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="documents"
      v-model="page"
      :activeTabIndex="activeTabIndex"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
    >
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <ocr-el
          v-for="(i, index) in page.items"
          v-show="!i.notShow && !i.notEmpty"
          :key="index"
          :value="i"
        >
          <td class="pre-line" colspan="2">{{ i.key }}</td>
          <td class="pre-line">{{ i.value }}</td>
        </ocr-el>
      </table>
    </ocrlayout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      v-if="example.isUpload"
      @click="clickSampleCollection"
      v-loading="isLoading"
    >
      <svg-icon :iconClass="starsFlag ? '星星填充' : '星星'"></svg-icon>
      <span>{{ starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADBSINESSLICENSE']">
      <upload-File
        productName="营业执照解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { normalData } from "./defaultData";
import ocrlayout from "./ocr-layout";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      starsFlag: null,
      activeTextId: "",
      page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: "",
      activeDocumentIndex: 0,
      search: "",
      checked: false,
      tabsArray: [],
      documents: normalData,
      activeTabIndex: 0,
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
    };
  },
  components: { ocrlayout },
  watch: {
    checked(val) {
      this.activeTextId = null;
      this.$refs.documents.activeTextId = null;
      this.$refs.documents.pathValue = null;
      this.filterEmpty(val);
    },
  },
  computed: {
    ...mapState(["pageMenuPerm"]),
    example() {
      return this.documents[this.activeDocumentIndex];
    },
    originLocation() {
      return process.env.NODE_ENV === "development"
        ? "https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image"
        : `${window.location.origin}/file-handle-web/file/image`;
    },
  },
  mounted() {},
  methods: {
    uploadFileData(res) {
      res.data.forEach((i) => {
        i.isUpload = true;
      });
      res.data[0].images.forEach((item) => {
        item.url = `${this.originLocation}?filename=${encodeURIComponent(
          item.path
        )}`;
      });
      this.starsFlag = false;
      if (this.documents.length >= 3) {
        this.documents.shift();
      }
      this.documents = res.data.concat(this.documents);
      this.activeDocumentIndex = 0;
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.checked = false;
      this.filterEmpty(false);
      // this.searchData()
      this.activeDocumentIndex = activeDocumentIndex;
    },
    filterEmpty(flag) {
      this.page.items = this.emptyData(this.page.items, flag);
      // this.page.describes = this.emptyData(this.page.describes, flag)
    },
    emptyData(arr, flag) {
      const newArr = arr.map((item) => {
        return {
          ...item,
          notEmpty: flag ? item.value === "" || !item.value : false,
        };
      });
      return newArr;
    },
    // 样本收集点击事件
    clickHandler(e, i, noParent) {
      const el = e.target.parentNode.firstChild;
      if (!i.startX || !i.startY || !i.width || !i.height) {
        this.$refs.documents.pathValue = null;
        this.$refs.documents.activeTextId = null;
        this.activeTextId = i.id;
        return;
      }
      e = e || window.event;
      this.$refs.documents.$events.trigger("click-ocr-el", {
        el,
        id: i.id,
      });
      this.activeTextId = this.$refs.documents.activeTextId;
      console.log(this.activeTextId, i.id);
    },
    clickSampleCollection() {
      const data = this.documents[this.activeDocumentIndex];
      const requestId = this.documents[this.activeDocumentIndex].requestId;
      const picAddress = data.images[0].path;
      if (!this.starsFlag) {
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            requestId: requestId,
            picAddress: `/home/lls_data/${picAddress}`,
            productName: "营业执照解析",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = true;
              this.documents[this.activeDocumentIndex].loadRecordId =
                res.data.data;
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
              this.documents[this.activeDocumentIndex].loadRecordId
            )}&picAddress=/home/lls_data/${encodeURIComponent(
              picAddress
            )}&name=${data.images[0].name}`
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.starsFlag = false;
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 60,
              });
            } else {
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 60,
              });
            }
          });
      }
      // if (this.isLoading) return;
      // this.isLoading = true;
      // const data = this.documents[this.activeDocumentIndex];
      // const picAddress = data.images[0].path;
      // if (!this.starsFlag) {
      //   const fileId = data.id;
      //   this.$http
      //     .post(
      //       "/business-license-analysis-web/invoice/common/savecollectinfo",
      //       {
      //         fileId,
      //         picAddress,
      //         productName: "营业执照解析",
      //       }
      //     )
      //     .then((res) => {
      //       if (res.data.code === "200") {
      //         this.starsFlag = true;

      //         this.documents[this.activeDocumentIndex].loadRecordId =
      //           res.data.data.loadRecordId;
      //         this.$message({
      //           message: "样本收集成功",
      //           type: "success",
      //           offset: 60,
      //         });
      //       } else {
      //         this.$message({
      //           message: res.data.message,
      //           type: "error",
      //           offset: 60,
      //         });
      //       }
      //     })
      //     .finally((res) => {
      //       this.isLoading = false;
      //     });
      // } else {
      //   this.$http
      //     .post(
      //       "/business-license-analysis-web/invoice/common/cancelcollectinfo",
      //       {
      //         loadRecordId:
      //           this.documents[this.activeDocumentIndex].loadRecordId,
      //         name: data.images[0].name,
      //         url: data.path,
      //       }
      //     )
      //     .then((res) => {
      //       if (res.data.code === "200") {
      //         this.starsFlag = false;

      //         this.$message({
      //           message: "取消收集成功",
      //           type: "success",
      //           offset: 60,
      //         });
      //       } else {
      //         this.$message({
      //           message: res.data.message,
      //           type: "error",
      //           offset: 60,
      //         });
      //       }
      //     })
      //     .finally((res) => {
      //       this.isLoading = false;
      //     });
      // }
    },
  },
};
</script>
<style lang="stylus" scoped>
.table-data {
  width: 100%;
  margin-bottom: 16px;

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
      td:first-child {
        background: rgba(8, 135, 255, 0.1);
        border-top-left-radius: 4px;
        border-right: none;
        border-bottom-left-radius: 4px;
        border-color: #0887ff;
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
    border-top: 1px solid #fff;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
  }
}

.business-license {
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
    z-index: 999 !important;
    left: 0;
  }

  ::-webkit-scrollbar {
    width: 4px;
    background: rgba(#202D40);
    opacity: 0.5;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    padding-right: 4px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.3);
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
