<template>
  <div class="treasury-flow-analysis-wrapper" style="width:100%">
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
          v-model="bank"
          placeholder="请选择银行"
          :disabled="loading"
          @change="getResult()"
        >
          <lls-option
            v-for="item in banks"
            :key="item.id"
            :label="item.bankCh"
            :value="item.bankCh"
          >
          </lls-option>
        </lls-select>
      </template>

      <template v-slot:text>
        <div
          v-show="bank === '' && !loading && !failedStatus"
          class="noContent"
          v-loading="loading"
        >
          <img :src="searching" alt="" />
          <span>在上方选择银行后方可进行解析</span>
        </div>
        <div
          class="hasContent"
          ref="content"
          v-show="bank !== '' && !loading && !failedStatus"
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
                <tbody v-for="i in page.fields" :key="i.id">
                  <tr>
                    <td colspan="2">{{ i.key }}</td>
                    <td>{{ i.value }}</td>
                  </tr>
                </tbody>
              </table>
            </lls-tab-pane>
          </lls-tabs>
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
  </div>
</template>
<script>
import { staticData } from '../staticData'
import failed from '@/assets/images/failed.png'
import searching from '@/assets/images/searching.png'
import { getBankList, extractInfo } from '@/api/receiptAnalysis'
import ocrLayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      failed,
      searching,
      data: staticData.receipt,
      activeTextId: '',
      page: {}, // 当前页面数据信息
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      href: window.location.href,
      search: '',
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      falg: true,
      hasTab: false,
      tabList: [],
      bank: '',
      banks: [],
      loading: false,
      failedStatus: false,
      taskId: 0,
      instance: {}
    }
  },
  components: {
    ocrLayout
  },
  created() {
    getBankList()
      .then((res) => {
        if (res.data.code === '200') {
          this.banks = res.data.data
        }
      })
      .catch((err) => {
        console.error(err)
      })
    this.instance = this.data[0]
    this.documents = this.instance.content
    this.page = this.documents[0]
    this.tabsArray = this.documents.map((item, index) => {
      return { name: `回单${index + 1}` }
    })
    this.activeName = this.tabsArray[0].name
    this.bank = this.instance.bank
  },
  mounted() {
    this.$refs.documents.handleClick(this.page.boundingBox)
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    example() {
      return this.data[this.activeDocumentIndex]
    }
  },
  methods: {
    uploadFileData({ res, taskId }) {
      this.taskId = taskId
      res.data.isUpload = true
      res.data.starsFlag = false
      if (this.data.length > 3) this.data.shift()
      this.data.unshift(res.data)
      this.instance = this.data[0]
      this.instance.flag = ''
      this.bank = ''
      this.$refs.documents.down_allow = false
      this.$refs.documents.resetPosition()
    },
    getResult() {
      this.loading = true
      this.$refs.documents.resetPosition()
      const param = {
        taskId: this.taskId,
        bank: this.bank,
        application: 'RECEIPT'
      }
      extractInfo(param)
        .then((res) => {
          res = res.data
          if (res.code === '200' && res.data.tabList) {
            // this.documents = res.data;
            let num = 0
            res.data.tabList.forEach((item) => {
              if (item.contentList.length !== 0) {
                num += 1
              }
            })
            if (num === 0) {
              this.failedStatus = true
              this.bank = ''
              this.$refs.documents.down_allow = false
            } else {
              this.instance.tabList = res.data.tabList
              this.instance.imagePath = res.data.imagePath
              this.instance.excelPath = res.data.excelPath
              this.instance.height = res.data.height
              this.instance.width = res.data.width
              this.$refs.documents.resizeImg()
              this.instance.flag = this.bank
              this.documents = this.instance.tabList
              this.tabsArray = this.documents.map((item, index) => {
                return { name: item.tabName }
              })
              this.activeName = this.tabsArray[0].name
              this.page = this.documents[0]
              this.$refs.documents.down_allow = true
              this.failedStatus = false
              this.$refs.documents.handleClick(
                this.page.boundingBox || {}
              )
            }
          } else {
            this.failedStatus = true
            this.bank = ''
            this.$refs.documents.down_allow = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.failedStatus = true
          this.instance.flag = ''
          this.bank = ''
          this.$refs.documents.down_allow = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.failedStatus = false
      this.activeDocumentIndex = activeDocumentIndex
      this.instance = this.data[activeDocumentIndex]
      this.$refs.documents.resetPosition()
      this.documents = this.instance.tabList
      this.bank = this.instance.flag
      if (this.bank !== '') {
        this.page = this.documents[0]
        this.tabsArray = this.documents.map((item, index) => {
          return { name: item.tabName }
        })
        this.activeName = this.tabsArray[0].name
        this.$refs.documents.handleClick(
          this.page.boundingBox || {}
        )
        this.$refs.documents.down_allow = true
      }
    },
    handleClick(value) {
      this.$refs.documents.resetPosition()
      this.activeTabIndex = Number(value.index)
      this.page = this.documents[this.activeTabIndex]
      this.$refs.documents.handleClick(
        this.page.boundingBox || {}
      )
    }
  }
}
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
