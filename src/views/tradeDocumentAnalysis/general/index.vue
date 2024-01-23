<template>
  <div class="bill-of-lading-wrapper" style="width: 100%">
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      :data="data"
      v-model="page"
      ref="documents"
      :activeTabIndex="activeTabIndex"
    >
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tbody v-for="i in page" :key="i.sortId">
          <template v-if="i.groupable">
            <tr
            >
              <td :rowspan="i.row.length + 1" class="td-title">
                {{ i.keyEn }}<br />{{ i.keyCh }}
              </td>
            </tr>
            <tr
              v-for="(j, jindex) in i.row"
              :key="jindex"
              :class="{ active: activeTextId === j.sortId && text.keyCh === j.keyCh }"
              @click="(e) => clickHandler(e, j)"
            >
              <template>
                <td>{{ j.keyEn }}<br />{{ j.keyCh }}</td>
                <td>
                  {{
                    j.values && j.values.length > 0 && j.values[0].value
                      ? j.values[0].value
                      : ""
                  }}
                </td>
              </template>
            </tr>
          </template>

          <tr
            v-else
            :class="{ active: activeTextId === i.sortId }"
            @click="(e) => clickHandler(e, i)"
          >
            <td colspan="2">{{ i.keyEn }}<br />{{ i.keyCh }}</td>
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
  props: {
    productName: {
      type: String,
      default: 'order'
    }
  },
  data() {
    return {
      data: staticData[this.productName],
      activeTextId: '',
      page: [], // 当前页面数据信息
      activeDocumentIndex: 0,
      activeTabIndex: 0,
      text: ''
    }
  },
  watch: {
    productName() {
      this.data = staticData[this.productName]
      this.page = this.disposeContent(this.data[0].content)
      this.$nextTick(() => {
        this.$refs.documents.resetProps()
      })
    }
  },
  created() {
    const content = this.data[0].content
    this.page = this.disposeContent(content)
  },
  mounted() {},
  methods: {
    // 处理数据
    disposeContent(content) {
      // 找出groupable为true的数组中，row数组中存在values数组下数据为多个的情况
    // 修改原有数据，直接替换掉row数组
      const contents = content
      contents.forEach((item) => {
        if (item.groupable && item.row) {
          item.row = item.row
            .map((row) => {
              if (row.values && row.values.length > 1) {
                return row.values.map((value, index) => {
                  const newKeyCh = `${row.keyCh}${index + 1}`
                  return {
                    keyCh: newKeyCh,
                    keyEn: row.keyEn,
                    sortId: row.sortId,
                    values: [value]
                  }
                })
              } else {
                return row
              }
            })
            .flat() // 使用 flat() 展开嵌套数组
        }
      })
      return contents
    },
    clickHandler(e, i, noParent) {
      let el = e.target.parentNode.firstChild
      this.text = i
      if (el.tagName === 'TR') el = el.firstChild
      if (!(i.values && i.values.length > 0 && i.values[0].value !== '')) {
        return
      }
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        id: i.sortId,
        text: i
      })
      this.activeTextId = this.$refs.documents.activeTextId
    },
    uploadFileData(res) {
      this.data = res.data
      this.page = this.disposeContent(this.data[0].content)
      this.$refs.documents.resetProps()
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.filterEmpty(false)
      this.activeDocumentIndex = activeDocumentIndex
      this.page = this.data[this.activeDocumentIndex][0]
    },

    handleClick(value) {
      this.page = this.disposeContent(this.data[value - 1].content)
      this.activeTextId = ''
      // if (typeof value === 'number') {
      //   console.log(value)
      //   if (value === 0) {
      //     this.activeTabIndex = 0
      //     this.activeName = this.tabsArray[this.activeTabIndex].name
      //     this.$refs.documents.handleClick(this.activeTabIndex)
      //     this.page = this.documents[this.activeTabIndex]
      //   } else {
      //     this.activeTabIndex += value
      //     this.activeName = this.tabsArray[this.activeTabIndex].name
      //     this.$refs.documents.handleClick(this.activeTabIndex)
      //     this.page = this.documents[this.activeTabIndex]
      //   }
      // } else {
      //   this.tabsArray.forEach((item, index) => {
      //     if (item.name === value.name) {
      //       this.activeTabIndex = index
      //       this.$refs.documents.handleClick(index)
      //       this.page = this.documents[index]
      //     }
      //   })
      // }
    }
  }
}
</script>
<style lang="stylus" scoped>
.table-data {
  width: 100%;
  margin: 12px 0;

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
</style>
