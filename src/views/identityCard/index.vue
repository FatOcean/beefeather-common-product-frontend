<template>
  <div class="identity-card-analysis-wrapper">
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="data"
      v-model="page"
      ref="documents"
      :activeTabIndex="activeTabIndex"
      :pageMenuPerm="pageMenuPerm"
    >
      <lls-tabs @tab-click="handleClick" v-model="activeName">
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
        <table cellspacing="0" class="table-data">
          <thead>
            <td colspan="2">字段名</td>
            <td>识别结果</td>
          </thead>
          <tbody v-for="i in pageDetail" :key="i.key">
            <tr
              :class="{
                active: activeTextId === i.id,
                commonCursor: !(i.position && i.position.length > 0),
              }"
              @click="(e) => clickHandler(e, i)"
            >
              <td colspan="2">{{ i.key }}</td>
              <td>{{ i.value }}</td>
            </tr>
          </tbody>
        </table>
      </lls-tabs>
    </ocr-layout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      @click="clickSampleCollection"
      v-show="documents.isUpload"
      v-loading="isLoading"
    >
      <svg-icon
        :iconClass="documents.starsFlag ? '星星填充' : '星星'"
      ></svg-icon>
      <span>{{ documents.starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOADIDENTITY']">
      <upload-File
        productName="身份证解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { data } from './example'
import ocrLayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      data,
      isLoading: false,
      files: [],
      activeTextId: '',
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.imageAnalysisResult,
      dragenter: false,
      token: window.sessionStorage.getItem('token'),
      origin: window.sessionStorage.getItem('origin'),
      href: window.location.href,
      search: '',
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      falg: true
    }
  },
  components: { ocrLayout },
  created() {
    // console.log(this.data, "data");
    this.documents = this.data[0]
    // console.log(this.documents, "documents");
    this.page = this.documents.imageAnalysisResult
    // console.log(this.page, "page");
    // const frontHash = { 身份证正面: 0 };
    // const backHash = { 身份证反面: 0 };
    for (let i = 0; i < this.page.length; i++) {
      this.tabsArray[i] = { name: this.page[i].analysisName }
    }
    // if (this.tabsArray[i].name === "身份证正面") {
    //   frontHash["身份证正面"]++;
    // } else {
    //   backHash["身份证反面"]++;
    // }
    // if (frontHash["身份证正面"] === 1) {
    // } else {
    //   let num = 1;
    //   this.tabsArray.forEach((item) => {
    //     if (item.name === "身份证正面") {
    //       item.name += `${num}`;
    //       num++;
    //     }
    //   });
    // }
    // if (backHash["身份证反面"] === 1) {
    // } else {
    //   let num = 1;
    //   this.tabsArray.forEach((item) => {
    //     if (item.name === "身份证反面") {
    //       item.name += `${num}`;
    //       num++;
    //     }
    //   });
    // }

    // this.tabsArray = this.page.map((item) => {
    //   return {
    //     name: item.imageType,
    //   };
    // });
    // console.log(this.tabsArray, "tabsArray");
    // this.tabsArray.forEach((item) => {
    //   this.page.forEach(i => {
    //     if()
    //   })
    // })
    this.activeName = this.tabsArray[0].name
    // console.log(this.activeName, "activeName");
    // console.log(this.data, "data");
    // this.getServiceName();
    // console.log(this.example, "example");
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    pageDetail() {
      return this.page[this.activeTabIndex].identityList
    },
    example() {
      return this.data[this.activeDocumentIndex]
    }
  },
  methods: {
    tabs(activeDocumentIndex, activePageIndex) {
      this.activeDocumentIndex = activeDocumentIndex
      this.documents = this.data[activeDocumentIndex]
      this.page = this.documents.imageAnalysisResult
      // console.log(this.page, "121312312321312312");
      this.activeTabIndex = 0
      this.tabsArray = []
      for (let i = 0; i < this.page.length; i++) {
        this.tabsArray[i] = { name: this.page[i].analysisName, index: i }
      }
      this.activeName = this.tabsArray[activePageIndex].name

      // console.log(this.example, "ex2");
    },
    handleClick(value) {
      // console.log(value.index);
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.handleClick(value.index)
      // console.log(this.documents);
      // console.log(this.page);
      // this.tabsArray.forEach((item, index) => {
      //   if (item.name === value.name) {
      //     console.log(index);
      //     this.activeTabIndex = index;
      //     this.$refs.documents.handleClick(index);
      //   }
      // });
    },
    // 样本收集点击事件
    clickHandler(e, i, noParent) {
      const el = e.target.parentNode.firstChild

      if (!(i.position && i.position.length > 0)) {
        // this.$refs.documents.resetProps();
        // this.activeTextId = i.id;
        // this.$refs.documents.pathValue = null;
        // this.$refs.documents.activeTextId = null;
        // this.$refs.documents.rectanglePosition = [];
        return
      }
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        id: i.id
        // imageIndex: i.imageIndex,
      })
      this.activeTextId = this.$refs.documents.activeTextId
      // console.log(this.activeTextId, "activeTextId");
    },
    clickSampleCollection() {
      if (this.isLoading) return
      this.isLoading = true
      // const data = this.data[this.activeDocumentIndex];
      const picAddress = `${this.documents.imagePath}`
      // console.log(data, '000')
      if (!this.documents.starsFlag) {
        this.$http
          .post('/general-product-web/hardCaseCollect/saveCollectInfo', {
            picAddress,
            productName: '身份证解析',
            requestId: this.documents.requestId
          })
          .then((res) => {
            if (res.data.code === '200') {
              this.$set(this.documents, 'starsFlag', true)
              this.documents.loadRecordId = res.data.data
              this.$message({
                message: '样本收集成功',
                type: 'success',
                offset: 60
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                offset: 60
              })
            }
          })
          .finally((res) => {
            this.isLoading = false
          })
      } else {
        this.$http
          .post(
            `/general-product-web/hardCaseCollect/cancelSaveCollectInfo?loadRecordId=${encodeURIComponent(
              this.documents.loadRecordId
            )}&picAddress=${encodeURIComponent(picAddress)}`
          )
          .then((res) => {
            if (res.data.code === '200') {
              this.documents.starsFlag = false
              this.$message({
                message: '取消收集成功',
                type: 'success',
                offset: 60
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                offset: 60
              })
            }
          })
          .finally((res) => {
            this.isLoading = false
          })
      }
    },
    uploadFileData(res) {
      res.data.forEach((i) => {
        i.isUpload = true
        i.starsFlag = false
      })
      if (this.data.length > 2) this.data.shift()
      this.data = res.data.concat(this.data)
      this.documents = this.data[0]
      this.page = this.documents.imageAnalysisResult
      // console.log(this.documents, "documents2");
      this.activeDocumentIndex = 0
      this.activeTabIndex = 0
      this.tabsArray = []
      for (let i = 0; i < this.page.length; i++) {
        this.tabsArray[i] = {
          name: this.page[i].analysisName
            ? this.page[i].analysisName
            : `未识别${i + 1}`
        }
      }
      this.activeName = this.tabsArray[0].name
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false
      }, 200)
    }
  }
}
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

    &.commonCursor {
      cursor: default;
      background: none;
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

.identity-card-analysis-wrapper {
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

  // .checked {
  // position: absolute;
  // right: 0;
  // }

  // .function_bar {
  // display:flex,
  // flex-wrap:nowrap,
  // justify-content:space-between
  // }
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
</style>
