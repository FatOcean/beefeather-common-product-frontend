<template>
  <div class="bill-of-lading-wrapper" style="width: 100%">
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      :data="data"
      v-model="pageDetail"
      ref="documents"
      :activeTabIndex="activeTabIndex"
    >
      <div class="search-box">
        <lls-input
          placeholder="请输入字段名进行搜索"
          prefix-icon="lls-icon-search"
          v-model="search"
        >
        </lls-input>
        <lls-checkbox v-model="checked">隐藏空白字段</lls-checkbox>
      </div>

      <lls-tabs @tab-click="handleClick" v-model="activeName">
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        >
          <table cellspacing="0" class="table-data">
            <thead>
              <td colspan="2">字段名</td>
              <td>识别结果</td>
            </thead>
            <tbody v-for="i in page" :key="i.id">
              <tr
                v-if="i.keyCh === 'Goods Description'"
                :class="{ active: activeTextId === i.id }"
                @click="(e) => clickHandler(e, i)"
              >
                <td rowspan="5">{{ i.keyEn }}<br />{{i.keyCh}}</td>
                <td :class="{ activeTd: activeTextId === i.id }">
                  <table>
                    <p>Goods Description<br />商品描述</p>
                    <p>
                      Commodity<br />
                      商品名称
                    </p>
                    <p>
                      HS Code<br />
                      HS编码
                    </p>
                    <p>
                      Quantity<br />
                      数量
                    </p>
                    <p>
                      Quantity Unit<br />
                      数量单位
                    </p>
                  </table>
                </td>
                <td>
                  {{
                    i.values && i.values.length > 0 && i.values[0].value
                      ? i.values[0].value
                      : ""
                  }}
                </td>
              </tr>
              <tr
                :class="{ active: activeTextId === i.id }"
                @click="(e) => clickHandler(e, i)"
                v-else-if="i.keyCh === 'Gross Weight'"
                v-show="!i.notShow && !i.notEmpty"
              >
                <td>{{ i.keyEn }}<br />{{i.keyCh}}</td>
                <td :class="{ activeTd: activeTextId === i.id }">
                  <table>
                    <p>
                      Gross Weight<br />
                      毛重
                    </p>
                    <p>
                      Gross Weight Unit<br />
                      毛重单位
                    </p>
                    <p>
                      Gross Weight per Carton<br />
                      每箱毛重
                    </p>
                  </table>
                </td>
                <td>
                  {{
                    i.values && i.values.length > 0 && i.values[0].value
                      ? i.values[0].value
                      : ""
                  }}
                </td>
              </tr>
              <tr
                :class="{ active: activeTextId === i.id }"
                @click="(e) => clickHandler(e, i)"
                v-else-if="i.keyCh === 'Net Weight'"
                v-show="!i.notShow && !i.notEmpty"
              >
                <td>{{ i.keyEn }}<br />{{i.keyCh}}</td>
                <td :class="{ activeTd: activeTextId === i.id }">
                  <table>
                    <p>
                      Net Weight<br />
                      净重
                    </p>
                    <p>
                      Net Weight Unit<br />
                      净重单位
                    </p>
                  </table>
                </td>
                <td>
                  {{
                    i.values && i.values.length > 0 && i.values[0].value
                      ? i.values[0].value
                      : ""
                  }}
                </td>
              </tr>
              <tr
                :class="{ active: activeTextId === i.id }"
                @click="(e) => clickHandler(e, i)"
                v-else-if="i.keyCh === 'Product CBM'"
                v-show="!i.notShow && !i.notEmpty"
              >
                <td>{{ i.keyCh }}</td>
                <td :class="{ activeTd: activeTextId === i.id }">
                  Product CBM<br />
                  商品体积
                </td>
                <td>
                  {{
                    i.values && i.values.length > 0 && i.values[0].value
                      ? i.values[0].value
                      : ""
                  }}
                </td>
              </tr>
              <tr v-else @click="(e) => clickHandler(e, i)" :class="{ active: activeTextId === i.id }">
                <td colspan="2">{{ i.keyEn }}<br />{{i.keyCh}}</td>
                <td>
                  {{
                    i.values && i.values.length > 0 && i.values[0].value
                      ? i.values[0].value
                      : ""
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </lls-tab-pane>
      </lls-tabs>
    </ocr-layout>
  </div>
</template>
<script>
import { staticData } from '../staticData'
import ocrLayout from './ocr-layout.vue'
export default {
  components: {
    ocrLayout
  },
  data() {
    return {
      data: staticData.bill_of_lading,
      isLoading: false,
      files: [],
      activeTextId: '',
      page: [], // 当前页面数据信息
      percent: 0, // 进度条
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      dragenter: false,
      token: window.sessionStorage.getItem('token'),
      origin: window.sessionStorage.getItem('origin'),
      href: window.location.href,
      search: '',
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      instance: {},
      falg: true,
      pageDetail: []
    }
  },
  computed: {
    activeImage() {
      return this.instance.images[this.$refs.documents.activePageIndex - 1]
    }
  },
  created() {
    this.instance = this.data[0]
    this.documents = this.instance
    this.page = this.documents.content
    this.tabsArray = this.data.map((item, index) => {
      return { name: `提单${index + 1}` }
    })
    this.activeName = this.tabsArray[0].name
    this.pageDetail = this.page
  },
  mounted() {},
  watch: {
    checked(val) {
      this.activeTextId = null
      this.$refs.documents.activeTextId = null
      this.$refs.documents.pathValue = null
      this.$refs.documents.rectanglePosition = []
      this.filterEmpty(val)
    },
    search(val) {
      this.searchData()
    }
  },
  methods: {
    clickHandler(e, i, noParent) {
      let el = e.target.parentNode.firstChild
      if (el.tagName === 'TR') el = el.firstChild
      if (!(i.values && i.values.length > 0)) {
        return
      }
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        id: i.sortId,
        imageIndex: i.imageIndex
      })
      this.activeTextId = this.$refs.documents.activeTextId
    },
    uploadFileData() {},
    tabs(activeDocumentIndex, activePageIndex) {
      this.search = ''
      this.checked = false
      this.filterEmpty(false)
      this.searchData()
      this.activeDocumentIndex = activeDocumentIndex
      this.instance = this.data[this.activeDocumentIndex]
      this.documents = this.instance.tabList
      this.page = this.documents[0]
      this.tabsArray = this.documents.map((item, index) => {
        return { name: item.tabName }
      })
      this.activeName = this.tabsArray[0].name
      this.pageDetail = this.page.customDeclarationList
      this.activeTabIndex = 0
      // console.log(this.example, "ex2");
    },

    handleClick(value) {
      this.search = ''
      this.checked = false
      this.filterEmpty(false)
      this.searchData()
      if (typeof value === 'number') {
        if (value === 0) {
          this.activeTabIndex = 0
          this.activeName = this.tabsArray[this.activeTabIndex].name
          this.$refs.documents.handleClick(this.activeTabIndex)
          this.page = this.documents[this.activeTabIndex]
          this.pageDetail = this.page.customDeclarationList
        } else {
          this.activeTabIndex += value
          this.activeName = this.tabsArray[this.activeTabIndex].name
          this.$refs.documents.handleClick(this.activeTabIndex)
          this.page = this.documents[this.activeTabIndex]
          this.pageDetail = this.page.customDeclarationList
        }
      } else {
        this.tabsArray.forEach((item, index) => {
          if (item.name === value.name) {
            this.activeTabIndex = index
            this.$refs.documents.handleClick(index)
            this.page = this.documents[index]
            this.pageDetail = this.page.customDeclarationList
          }
        })
      }
    },

    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false
      }, 200)
    },
    filterEmpty(flag) {
      this.pageDetail = this.emptyData(this.pageDetail, flag)
    },
    emptyData(arr, flag) {
      const newArr = arr.map((item) => {
        if (item.billDictionaryList) {
          item.billDictionaryList = item.billDictionaryList.map((i) => {
            return {
              ...i,
              notEmpty: flag ? i.value === '' || !i.value : false
            }
          })
          return item
        } else {
          return {
            ...item,
            notEmpty: flag ? item.value === '' || !item.value : false
          }
        }
      })
      return newArr
    },
    searchData() {
      // this.$refs.documents.resetProps()
      this.activeTextId = null
      this.$refs.documents.activeTextId = null
      this.$refs.documents.pathValue = null
      this.$refs.documents.rectanglePosition = []
      this.pageDetail = this.handleArr(
        this.pageDetail,
        this.search.toLowerCase()
      )
    },
    handleArr(arr, eleName) {
      const newArr = arr.map((item) => {
        if (item.billDictionaryList) {
          item.billDictionaryList = item.billDictionaryList.map((i) => {
            return {
              ...i,
              notShow:
                !(i.key.toLowerCase().indexOf(eleName) > -1) &&
                !(i.value.toLowerCase().indexOf(eleName) > -1)
            }
          })
          return item
        } else {
          return {
            ...item,
            notShow:
              !(item.key.toLowerCase().indexOf(eleName) > -1) &&
              !(item.value.toLowerCase().indexOf(eleName) > -1)
          }
        }
      })
      return newArr
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
        table {
          width: calc(100% + 8px);
          margin-left: -8px;

          p {
            padding-left: 8px;
            border-bottom: 1px solid #e3e8f0;
            white-space: pre-line;

            &:last-child {
              border: none;
            }
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
    padding-right: 8px;
    color: #5F6C80;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
    white-space: pre-line;
  }
}

.bill-of-lading-wrapper {
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

// .lls-tabs__nav-scroll {
//   overflow: auto !important;

//   &::-webkit-scrollbar {
//     height: 4px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: rgba(32, 45, 64, 0.5) !important;
//   }

// }
</style>
