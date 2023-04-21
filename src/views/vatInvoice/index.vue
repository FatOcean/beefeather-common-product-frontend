<template>
  <div class="vat-invoice-wrapper">
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      @changeActivePageIndex="changeActivePageIndex"
      :data="documents"
      v-model="page"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
    >
      <!-- <ocr-el v-for="(i, index) in page.tableData" :key="index" :id="i.id">
        {{ i.text }}{{i.value}}
      </ocr-el>-->
      <lls-tabs @tab-click="handleClick" v-model="activeName">
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
      </lls-tabs>
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tr
          :class="{ active: activeTextId === i.id, pointer: i.startX }"
          @click="(e) => clickHandler(e, i)"
          v-for="i in page.headData"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td style="white-space: pre-line">{{ i.value }}</td>
        </tr>
        <template v-for="(item, index) in page.otherData">
          <tr v-bind:key="index">
            <td class="td-title" :rowspan="page.otherData[index].length + 1">
              货物或应税劳务、服务描述{{ index + 1 }}
            </td>
          </tr>
          <tr
            :class="{ active: activeTextId === item.id, pointer: item.startX }"
            @click="(e) => clickHandler(e, item)"
            v-for="item in page.otherData[index]"
            :key="item.key"
          >
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </template>
        <tr
          :class="{ active: activeTextId === i.id, pointer: i.startX }"
          @click="(e) => clickHandler(e, i)"
          v-for="i in page.bottomData"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td>{{ i.value }}</td>
        </tr>
      </table>
    </ocr-layout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      @click="clickSampleCollection"
      v-if="example.path"
      v-loading="isLoading"
    >
      <svg-icon
        :iconClass="activeImage.starsFlag ? '星星填充' : '星星'"
      ></svg-icon>
      <span>{{ activeImage.starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['SPECIALUPLOADAPP']">
      <upload-File
        productName="增值税发票解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { specialData } from "./defaultData";
import beeLoading from "@linklogis/beeLoading";
import { mapState } from "vuex";
import ocrLayout from "./ocr-layout";
export default {
  data() {
    return {
      activePageIndex: 0,
      isLoading: false,
      selectData: specialData,
      files: [],
      activeTextId: "",
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: "",
      servicePortAddress: "",
      activeDocumentIndex: 0,
      tabsArray: [],
      // documents: [],
      documents: [],
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
      falg: true,
    };
  },
  components: { [beeLoading.name]: beeLoading, ocrLayout },
  computed: {
    ...mapState(["pageMenuPerm"]),
    example() {
      return this.documents[this.activeDocumentIndex];
    },
    activeImage() {
      return this.example.specificData[this.activePageIndex];
    },
    originLocation() {
      return process.env.NODE_ENV === "development"
        ? "https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image"
        : `${window.location.origin}/file-handle-web/file/image`;
    },
  },
  created() {
    this.documents = this.selectData;
    this.documents.forEach((item) => {
      item.specificData.forEach((ele) => {
        ele.otherData = ele.otherData.map((item, index) => {
          return item.commodity;
        });
      });
    });
    this.page = this.documents[0].specificData[0];
    this.tabsArray = this.documents[0].specificData.map((item, index) => {
      return {
        name: `发票${index + 1}`,
      };
    });
    this.activeName = this.tabsArray[0].name;
  },
  methods: {
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageFromVatInvoice",
          fixed: fixed,
        },
        "*"
      );
    },
    changeActivePageIndex(activePageIndex) {
      this.activePageIndex = activePageIndex;
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.activePageIndex = 0;
      this.activeDocumentIndex = activeDocumentIndex;
      this.tabsArray = this.documents[activeDocumentIndex].specificData.map(
        (item, index) => {
          return {
            name: `发票${index + 1}`,
          };
        }
      );
      this.activeName = this.tabsArray[activePageIndex].name;
    },
    handleClick(value) {
      this.tabsArray.forEach((item, index) => {
        if (item.name === value.name) {
          this.$refs.documents.handleClick(index);
        }
      });
    },
    // 样本收集点击事件
    clickHandler(e, i) {
      if (!i.startX || !i.startY || !i.width || !i.height) {
        return;
      }
      const el =
        e.target.nodeName === "TR"
          ? e.target.firstChild
          : e.target.parentNode.firstChild;
      this.activeTextId = i.id;
      e = e || window.event;
      this.$refs.documents.$events.trigger("click-ocr-el", {
        el,
        value: i,
      });
    },
    clickSampleCollection() {
      if (this.isLoading) return;
      this.isLoading = true;
      const data = this.documents[this.activeDocumentIndex];
      const picAddress = `${data.path}${
        data.specificData[this.activePageIndex].name
      }`;
      if (!this.activeImage.starsFlag) {
        const fileId = data.id;
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            fileId,
            picAddress,
            productName: "增值税发票解析",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(
                this.documents[this.activeDocumentIndex].specificData[
                  this.activePageIndex
                ],
                "starsFlag",
                true
              );
              // this.page.starsFlag = true;
              this.documents[this.activeDocumentIndex].loadRecordId =
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
          .post("/general-product-web/hardCaseCollect/cancelSaveCollectInfo", {
            loadRecordId: this.documents[this.activeDocumentIndex].loadRecordId,
            url: data.path,
            name: data.specificData[this.activePageIndex].name,
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(
                this.documents[this.activeDocumentIndex].specificData[
                  this.activePageIndex
                ],
                "starsFlag",
                false
              );
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
    uploadFileData(res) {
      res.data.specificData.forEach((i) => {
        i.starsFlag = false;
        i.img = `${this.originLocation}?filename=${
          res.data.path
        }${encodeURIComponent(i.name)}`;
        i.otherData = i.otherData.map((item, index) => {
          return item.commodity;
        });
      });
      this.documents.splice(0, this.documents.length > 3 ? 1 : 0, res.data);
      this.activeDocumentIndex = 0;
      this.page = this.documents[0].specificData[0];
      this.tabsArray = this.documents[0].specificData.map((item, index) => {
        return {
          name: `发票${index + 1}`,
        };
      });
      this.activeName = this.tabsArray[0].name;
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
    &.pointer:hover {
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

.vat-invoice-wrapper {
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
