<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="证件解析" bottom-line>
    </lls-page-header>
    <ocrlayout
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
          @click-ocr-el="(data)=>$refs.documents.handleClickText(data)"
        >
          <td class="pre-line" colspan="2">{{ i.key }}</td>
          <td class="pre-line">{{ i.value }}</td>
        </ocr-el>
      </table>
    </ocrlayout>

  </div>
</template>
<script>
import { normalData } from './defaultData'
import ocrlayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: '',
      activeDocumentIndex: 0,
      checked: false,
      documents: normalData,
      activeTabIndex: 0
    }
  },
  components: { ocrlayout },
  watch: {
    checked(val) {
      this.$refs.documents.pathValue = null
      this.filterEmpty(val)
    }
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    example() {
      return this.documents[this.activeDocumentIndex]
    },
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  mounted() {},
  methods: {
    goBack() {},
    uploadFileData(res) {
      res.data.forEach((i) => {
        i.isUpload = true
      })
      res.data[0].images.forEach((item) => {
        item.url = `${this.originLocation}?filename=${encodeURIComponent(
          item.path
        )}`
      })
      if (this.documents.length >= 3) {
        this.documents.shift()
      }
      this.documents = res.data.concat(this.documents)
      this.activeDocumentIndex = 0
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.checked = false
      this.filterEmpty(false)
      this.activeDocumentIndex = activeDocumentIndex
    },
    filterEmpty(flag) {
      this.page.items = this.emptyData(this.page.items, flag)
      // this.page.describes = this.emptyData(this.page.describes, flag)
    },
    emptyData(arr, flag) {
      const newArr = arr.map((item) => {
        return {
          ...item,
          notEmpty: flag ? item.value === '' || !item.value : false
        }
      })
      return newArr
    }
  }
}
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

.document-parsing {
  padding: 60px 12px 2px 12px;
  .lls-page-header{
    padding-bottom: 12px;
    border-bottom: 1px solid #E5E7EC;
  }

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
}
</style>
