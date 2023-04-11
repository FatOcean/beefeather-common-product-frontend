<template>
  <div class="treasury-flow-analysis-wrapper">
    <ocrLayout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="data"
      ref="documents"
      :activeTabIndex="activeTabIndex"
      :pageMenuPerm="pageMenuPerm"
    >
      <template v-slot:title>
        <svg-icon iconClass="识别结果"></svg-icon><span>识别结果</span>
        <lls-select
          ref="selectRef"
          style="margin-left: 8px"
          v-model="selectValue"
          placeholder="请选择银行"
          :disabled="loading || instance.forbid_change"
          @change="getResult()"
        >
          <lls-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </lls-option>
        </lls-select>
      </template>

      <template v-slot:text>
        <div
          v-show="selectValue === '' && !loading && !failedStatus"
          class="noContent"
          v-loading="loading"
        >
          <img :src="searching" alt="" />
          <span>在上方选择银行后方可进行解析</span>
        </div>
        <div
          class="hasContent"
          ref="content"
          v-show="selectValue !== '' && !loading && !failedStatus"
          v-loading="loading"
        >
          <lls-tabs @tab-click="handleClick" v-model="activeName">
            <lls-tab-pane
              v-for="(item, index) in tabsArray"
              :key="index"
              :label="item.name"
              :name="item.name"
            >
              <table cellspacing="0" class="table-data" ref="table">
                <thead>
                  <td colspan="2">字段名</td>
                  <td>识别结果</td>
                </thead>
                <tbody v-for="i in page.contentList" :key="i.id">
                  <tr>
                    <td colspan="2">{{ i.key }}</td>
                    <td>{{ i.value }}</td>
                  </tr>
                </tbody>
              </table>
            </lls-tab-pane>
          </lls-tabs>
          <div
            class="sample-collection"
            @click="clickSampleCollection"
            v-show="instance.isUpload"
            v-loading="isLoading"
          >
            <svg-icon
              :iconClass="instance.starsFlag ? '星星填充' : '星星'"
            ></svg-icon>
            <span>{{ instance.starsFlag ? "取消" : "难例" }}样本收集</span>
          </div>
        </div>

        <div
          v-show="!loading && failedStatus"
          class="noContent"
          v-loading="loading"
        >
          <img :src="failed" alt="" />
          <span>解析失败 </span>
          <span class="extraText"
            >上传回单与该银行信息不匹配，请重新选择银行</span
          >
        </div>
        <div class="noContent" v-show="loading" v-loading="loading">
          <img :src="searching" alt="" />
          <span>正在解析中...</span>
        </div>
      </template>
    </ocrLayout>
    <lls-collapse-transition v-if="pageMenuPerm['UPLOAD_RECEIPT']">
      <upload-File
        productName="回单解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { data } from "./example";
import failed from "@/assets/images/failed.png";
import searching from "@/assets/images/searching.png";
import { getBankList, analysisFile } from "../../api/receiptAnalysis";
import ocrLayout from "./ocr-layout";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      failed,
      searching,
      data,
      activeTextId: "",
      page: {}, // 当前页面数据信息
      activeName: "",
      servicePortAddress: "",
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      href: window.location.href,
      search: "",
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      falg: true,
      hasTab: false,
      tabList: [],
      selectValue: "",
      options: [],
      url: "",
      loading: false,
      banks: null,
      failedStatus: false,
      taskId: 0,
      instance: {},
    };
  },
  components: {
    ocrLayout,
  },
  created() {
    getBankList()
      .then((res) => {
        if (res.data.code === "200") {
          this.options = res.data.data.map((item) => {
            return {
              id: item.id,
              label: item.bankCh,
              value: item.bankCh,
            };
          });
          this.banks = res.data.data.reduce((acc, cur) => {
            acc[cur.bankCh] = cur.bankEn;
            return acc;
          }, {});
        }
      })
      .catch((err) => {});
    this.instance = this.data[0];
    this.documents = this.instance.tabList;
    this.page = this.documents[0];
    this.tabsArray = this.documents.map((item, index) => {
      return { name: item.tabName };
    });
    this.activeName = this.tabsArray[0].name;
    this.selectValue = this.instance.flag;
    this.url = this.instance.imagePath;
  },
  mounted() {
    this.$refs.documents.handleClick(this.page.position);
  },
  computed: {
    ...mapState(["pageMenuPerm"]),
    example() {
      return this.data[this.activeDocumentIndex];
    },
  },
  methods: {
    uploadFileData(res) {
      res.data.isUpload = true;
      res.data.starsFlag = false;
      this.url = res.data.pdfPath ? res.data.pdfPath : res.data.imagePath;
      if (this.data.length > 3) this.data.shift();
      this.data.unshift(res.data);
      this.instance = this.data[0];
      this.instance.flag = "";
      this.selectValue = "";
      this.$refs.documents.down_allow = false;
      this.$refs.documents.resetPosition();
    },
    getResult() {
      this.loading = true;
      this.$refs.documents.resetPosition();
      analysisFile(this.url, this.banks[this.selectValue], "回单解析")
        .then((res) => {
          res = res.data;
          if (res.code === "200" && res.data.tabList) {
            // this.documents = res.data;
            let num = 0;
            res.data.tabList.forEach((item) => {
              if (item.contentList.length !== 0) {
                num += 1;
              }
            });
            if (num === 0) {
              this.failedStatus = true;
              this.selectValue = "";
              this.$refs.documents.down_allow = false;
            } else {
              this.instance.tabList = res.data.tabList;
              this.instance.imagePath = res.data.imagePath;
              this.instance.excelPath = res.data.excelPath;
              this.instance.height = res.data.height;
              this.instance.width = res.data.width;
              this.$refs.documents.resizeImg();
              this.instance.flag = this.selectValue;
              this.documents = this.instance.tabList;
              this.tabsArray = this.documents.map((item, index) => {
                return { name: item.tabName };
              });
              this.activeName = this.tabsArray[0].name;
              this.page = this.documents[0];
              this.$refs.documents.down_allow = true;
              this.failedStatus = false;
              this.$refs.documents.handleClick(
                this.page.position ? this.page.position : {}
              );
            }
          } else {
            this.failedStatus = true;
            this.selectValue = "";
            this.$refs.documents.down_allow = false;
          }
        })
        .catch((err) => {
          this.failedStatus = true;
          this.instance.flag = "";
          this.selectValue = "";
          this.$refs.documents.down_allow = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.failedStatus = false;
      this.activeDocumentIndex = activeDocumentIndex;
      this.instance = this.data[activeDocumentIndex];
      this.url = this.instance.pdfPath
        ? this.instance.pdfPath
        : this.instance.imagePath;
      this.$refs.documents.resetPosition();
      this.documents = this.instance.tabList;
      this.selectValue = this.instance.flag;
      if (this.selectValue !== "") {
        this.page = this.documents[0];
        this.tabsArray = this.documents.map((item, index) => {
          return { name: item.tabName };
        });
        this.activeName = this.tabsArray[0].name;
        this.$refs.documents.handleClick(
          this.page.position ? this.page.position : {}
        );
        this.$refs.documents.down_allow = true;
      }
    },
    handleClick(value) {
      this.$refs.documents.resetPosition();
      this.activeTabIndex = Number(value.index);
      this.page = this.documents[this.activeTabIndex];
      this.$refs.documents.handleClick(
        this.page.position ? this.page.position : {}
      );
    },
    // 样本收集点击事件    //快速开发暂时隐藏
    clickHandler(e, i, noParent) {},
    clickSampleCollection() {
      if (this.isLoading) return;
      this.isLoading = true;
      // const data = this.data[this.activeDocumentIndex];
      const picAddress = `${this.instance.imagePath}`;
      // console.log(data, '000')
      if (!this.instance.starsFlag) {
        const fileId = 1;
        this.$http
          .post("/receipt-analysis-web/receipt/common/saveCollectInfo", {
            fileId,
            picAddress,
            productName: "回单解析",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(this.instance, "starsFlag", true);
              this.instance.loadRecordId = res.data.data.loadRecordId;
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
          })
          .finally((res) => {
            this.isLoading = false;
          });
      } else {
        this.$http
          .post("/receipt-analysis-web/receipt/common/cancelcollectinfo", {
            loadRecordId: this.instance.loadRecordId,
            url: picAddress,
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.instance.starsFlag = false;

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
          })
          .finally((res) => {
            this.isLoading = false;
          });
      }
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

  tr {
    &:hover {
      background: #f6f9fb;
      cursor: pointer;
    }
  }

  td {
    line-height: 40px;
    padding-left: 8px;
    padding-right: 8px;
    color: #5F6C80;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
    white-space: pre-line;
    min-width: 100px;
    cursor: text;

    &:last-child {
      border-right: 1px solid #E3E8F0;
      width: 50%;
    }
  }
}

.treasury-flow-analysis-wrapper {
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

.noContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;

  img {
    width: 104px;
    height: 96px;
  }

  span {
    margin-top: 12px;
    height: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #5f6c80;
  }

  .extraText {
    margin-top: 12px;
    height: 18px;
    font-weight: 400;
    font-size: 12px;
    color: #8492a6;
  }
}

.hasContent {
  overflow: auto;
  width: calc(100% - 16px);
  position: relative;
  margin: 8px;
}

.lls-select:hover .lls-input__inner {
  border-color: #0887ff !important;
}

.lls-select .lls-input.is-disabled .lls-input__inner:hover {
  border-color: #E9E9E9 !important;
}
</style>
