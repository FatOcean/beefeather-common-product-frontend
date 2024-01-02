<template>
  <div
    class="treasury-flow-analysis-wrapper"
    style="flex-shrink: 1; flex-grow: 1; width: calc(100vw - 230px)"
  >
    <ocrLayout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="data"
      ref="documents"
      :activeTabIndex="activeTabIndex"
      :pageMenuPerm="pageMenuPerm"
    >
      <template>
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
            <!-- <thead>
              <td v-for="(header, index) in page[0].columns" :key="index">
                {{ header }}
              </td>
            </thead> -->
            <tbody>
              <tr v-for="(row, rowindex) in page" :key="rowindex">
                <td
                  v-for="(item, index) in row.columns"
                  :key="rowindex + index"
                >
                  {{ item }}
                </td>
              </tr>
            </tbody>
          </table>
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
import { staticData } from '../staticData'
import failed from '@/assets/images/failed.png'
import searching from '@/assets/images/searching.png'
import { analysisFile, getBankList, extractInfo } from '@/api/receiptAnalysis'
import ocrLayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  name: 'treasuryFlowAnalysis',
  components: {
    ocrLayout
  },
  data() {
    return {
      failed,
      searching,
      data: staticData.financial_statement,
      files: [],
      activeTextId: '',
      page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      token: window.sessionStorage.getItem('token'),
      origin: window.sessionStorage.getItem('origin'),
      href: window.location.href,
      search: '',
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      falg: true,
      hasTab: false,
      tabList: [],
      selectValue: '',
      options: [],
      url: '',
      loading: false,
      banks: null,
      failedStatus: false,
      taskId: 0
    }
  },
  created() {
    console.log(staticData)
    getBankList()
      .then((res) => {
        if (res.data.code === '200') {
          this.options = res.data.data.map((item) => {
            return {
              id: item.id,
              label: item.bankCh,
              value: item.bankCh
            }
          })
          this.banks = res.data.data.reduce((acc, cur) => {
            acc[cur.bankCh] = cur.bankEn
            return acc
          }, {})
        }
      })
      .catch((err) => {
        console.log(err)
      })
    this.documents = this.data[0]
    this.page = this.documents.content
    this.selectValue = this.documents.flag
    this.url = this.documents.imagePath
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    example() {
      return this.data[this.activeDocumentIndex]
    }
  },
  methods: {
    uploadFileData(res) {
      res.data.isUpload = true
      res.data.starsFlag = false
      this.url = res.data.pdfPath ? res.data.pdfPath : res.data.imagePath
      if (this.data.length > 3) this.data.shift()
      this.data.unshift(res.data)
      this.documents = this.data[0]
      this.documents.flag = ''
      this.selectValue = ''
      const scrollDiv = document.getElementsByClassName('hasContent')[0]
      scrollDiv.scrollLeft = 0
    },
    getResult() {
      this.loading = true
      const param = {
        filePath: encodeURIComponent(this.url),
        bankName: this.banks[this.selectValue],
        productName: '流水解析'
      }
      extractInfo(param)
        .then((res) => {
          res = res.data
          if (res.code === '200') {
            if (res.data.resultVO.content.length === 0) {
              this.failedStatus = true
              this.selectValue = ''
              this.$refs.documents.down_allow = false
            } else {
              this.documents.resultVO = res.data.resultVO
              this.documents.excelPath = res.data.excelPath
              this.documents.flag = this.selectValue
              this.page = this.documents.resultVO
              this.$refs.documents.down_allow = true
              this.failedStatus = false
              const scrollDiv =
                document.getElementsByClassName('hasContent')[0]
              scrollDiv.scrollLeft = 0
            }
          } else {
            this.failedStatus = true
            this.selectValue = ''
            this.$refs.documents.down_allow = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.failedStatus = true
          this.documents.flag = ''
          this.selectValue = ''
          this.$refs.documents.down_allow = false
          this.$message({
            message: res.message,
            type: 'error',
            offset: 60
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.failedStatus = false
      this.activeDocumentIndex = activeDocumentIndex
      this.documents = this.data[activeDocumentIndex]
      this.url = this.documents.pdfPath
        ? this.documents.pdfPath
        : this.documents.imagePath
      this.selectValue = this.documents.flag
      if (this.selectValue !== '') {
        this.page = this.documents.resultVO
        if (this.page.content.length > 0) {
          this.$refs.documents.down_allow = true
        } else this.$refs.documents.down_allow = false
      } else this.$refs.documents.down_allow = false
    },
    handleClick(value) {
      // console.log(value.index);
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.handleClick(value.index)
      this.page = this.tabList[this.activeTabIndex].productsConverterList
      this.page = this.page.filter((item) => {
        return item.value !== ''
      })
    },
    // 样本收集点击事件    //快速开发暂时隐藏
    clickHandler(e, i, noParent) {}
  }
}
</script>
<style lang="stylus" scoped>
.table-data {
  width: 100%;
  tr {
    &:hover {
      background: #f6f9fb;
      cursor: pointer;
    }

    &:first-child {
          background: #f3f4f6;
      td {
        border-top: 1px solid #E3E8F0;
        color: #202D40;
      }
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
