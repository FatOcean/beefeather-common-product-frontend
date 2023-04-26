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
          :disabled="loading || documents.forbid_change"
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
          <table cellspacing="0" class="table-data" ref="table">
            <thead>
              <td v-for="(header, index) in page.headers" :key="index">
                {{ header }}
              </td>
            </thead>
            <tbody>
              <tr v-for="row in page.content" :key="row.id * 100">
                <td
                  v-for="(item, index) in row.value"
                  :key="row.id * 100 + index + 1"
                >
                  {{ item }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 错误样本收集-->
          <div
            class="sample-collection"
            @click="clickSampleCollection"
            v-show="documents.isUpload"
          >
            <svg-icon
              :iconClass="documents.starsFlag ? '星星填充' : '星星'"
            ></svg-icon>
            <span>{{ documents.starsFlag ? "取消" : "难例" }}样本收集</span>
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
            >上传流水与该银行信息不匹配，请重新选择银行</span
          >
        </div>
        <div class="noContent" v-show="loading" v-loading="loading">
          <img :src="searching" alt="" />
          <span>正在解析中...</span>
        </div>
      </template>
    </ocrLayout>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLOAD_TREASURY_FLOW']">
      <upload-File
        productName="流水解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { data } from "./example";
import failed from "@/assets/images/failed.png";
import searching from "@/assets/images/searching.png";
import { getBankList, analysisFile } from "../../api/treasuryFlow";
import ocrLayout from "./ocr-layout";
import { mapState } from "vuex";
export default {
  name: "treasuryFlowAnalysis",
  components: {
    ocrLayout,
  },
  data() {
    return {
      failed,
      searching,
      data,
      files: [],
      activeTextId: "",
      page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: "",
      servicePortAddress: "",
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
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
    };
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
    this.documents = this.data[0];
    this.page = this.documents.resultVO;
    this.selectValue = this.documents.flag;
    this.url = this.documents.imagePath;
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
      this.documents = this.data[0];
      this.documents.flag = "";
      this.selectValue = "";
      const scrollDiv = document.getElementsByClassName("hasContent")[0];
      scrollDiv.scrollLeft = 0;
    },
    getResult() {
      this.loading = true;
      const param = {
        filePath: this.url,
        bankName: this.banks[this.selectValue],
        productName: "流水解析",
      };
      analysisFile(param)
        .then((res) => {
          res = res.data;
          if (res.code === "200") {
            if (res.data.resultVO.content.length === 0) {
              this.failedStatus = true;
              this.selectValue = "";
              this.$refs.documents.down_allow = false;
            } else {
              this.documents.resultVO = res.data.resultVO;
              this.documents.excelPath = res.data.excelPath;
              this.documents.flag = this.selectValue;
              this.page = this.documents.resultVO;
              this.$refs.documents.down_allow = true;
              this.failedStatus = false;
              const scrollDiv =
                document.getElementsByClassName("hasContent")[0];
              scrollDiv.scrollLeft = 0;
            }
          } else {
            this.failedStatus = true;
            this.selectValue = "";
            this.$refs.documents.down_allow = false;
          }
        })
        .catch((err) => {
          this.failedStatus = true;
          this.documents.flag = "";
          this.selectValue = "";
          this.$refs.documents.down_allow = false;
          this.$message({
            message: res.message,
            type: "error",
            offset: 60,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.failedStatus = false;
      this.activeDocumentIndex = activeDocumentIndex;
      this.documents = this.data[activeDocumentIndex];
      this.url = this.documents.pdfPath
        ? this.documents.pdfPath
        : this.documents.imagePath;
      this.selectValue = this.documents.flag;
      if (this.selectValue !== "") {
        this.page = this.documents.resultVO;
        if (this.page.content.length > 0)
          this.$refs.documents.down_allow = true;
        else this.$refs.documents.down_allow = false;
      } else this.$refs.documents.down_allow = false;
    },
    handleClick(value) {
      // console.log(value.index);
      this.activeTabIndex = Number(value.index);
      this.$refs.documents.handleClick(value.index);
      this.page = this.tabList[this.activeTabIndex].productsConverterList;
      this.page = this.page.filter((item) => {
        return item.value !== "";
      });
    },
    // 样本收集点击事件    //快速开发暂时隐藏
    clickHandler(e, i, noParent) {},
    clickSampleCollection() {
      const requestId = this.data[this.activeDocumentIndex].requestId;
      const picAddress = this.documents.imagePath;
      if (!this.documents.starsFlag) {
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            requestId: requestId,
            picAddress: `/home/lls_data/${picAddress}`,
            productName: "流水解析",
          })
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(this.documents, "starsFlag", true);
              this.documents.loadRecordId = res.data.data;
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
              this.documents.loadRecordId
            )}&picAddress=/home/lls_data/${encodeURIComponent(picAddress)}`
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.documents.starsFlag = false;
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
      return;
      // const data = this.data[this.activeDocumentIndex];
      // const picAddress = `${this.documents.imagePath}`;
      // console.log(data, '000')
      if (!this.documents.starsFlag) {
        const fileId = 1;
        this.$http
          .post(
            "/treasury-flow-analysis-web/treasuryFlow/common/saveCollectInfo",
            {
              fileId,
              picAddress,
              productName: "流水解析",
            }
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.$set(this.documents, "starsFlag", true);
              this.documents.loadRecordId = res.data.data.loadRecordId;
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
            "/treasury-flow-analysis-web/treasuryFlow/common/cancelcollectinfo",
            {
              loadRecordId: this.documents.loadRecordId,
              url: picAddress,
            }
          )
          .then((res) => {
            if (res.data.code === "200") {
              this.documents.starsFlag = false;

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
  },
};
</script>
<style lang="stylus">
.table-data {
  width: 100%;

  thead {
    background: #F3F4F6;

    td {
      border-top: 1px solid #E3E8F0;
      font-weight: bold;
      color: #202D40;
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
    white-space: nowrap;

    &:last-child {
      border-right: 1px solid #E3E8F0;
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
