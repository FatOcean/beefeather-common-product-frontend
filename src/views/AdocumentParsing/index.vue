<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="证件解析" bottom-line>
    </lls-page-header>
    <!-- <button @click="pushtest">测试</button> -->
    <ocrlayout
      @tabs="tabs"
      :data="documents"
      v-model="page"
      :activeTabIndex="activeTabIndex"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
      @resetId="() => (activeTextId = null)"
    >
      <lls-tabs
        @tab-click="handleClick"
        v-model="activeName"
        v-if="productName === 'id_card'"
      >
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
        <table cellspacing="0" class="table-data" id="table-data">
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
      <table cellspacing="0" class="table-data" v-else id="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tbody v-for="i in page.content" :key="i.key">
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
    </ocrlayout>
  </div>
</template>
<script>
import { staticData } from './staticData'
import ocrlayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  components: { ocrlayout },
  data() {
    return {
      // page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: '',
      activeDocumentIndex: 0,
      checked: false,
      staticData,
      // documents: staticData.id_card,
      activeTabIndex: 0,
      tabsArray: [],
      activeTextId: 0,
      productName: 'id_card',
      activePageIndex: 0
    }
  },

  watch: {
    checked(val) {
      this.$refs.documents.pathValue = null
      this.filterEmpty(val)
    }
  },
  created() {
    this.isIdcard()
  },
  computed: {
    documents() {
      const document = JSON.parse(JSON.stringify(staticData[this.productName]))
      // if (this.staticName !== 'id_card') {
      //   const content = [
      //     { imageType: this.productName, identityList: document[0].content }
      //   ]
      //   document.content = content
      // } else {
      // this.activeName = ''
      // this.tabsArray = []
      // for (let i = 0; i <script this.page.content.length; i++) {
      //   this.tabsArray[i] = { name: this.page.content[i].imageType }
      // }
      // this.activeName = this.tabsArray[0].name
      // }
      return document
    },
    page() {
      return this.documents[this.activePageIndex]
    },
    pageDetail() {
      return this.page.content[this.activeTabIndex].identityList
    },
    ...mapState(['pageMenuPerm']),
    // example() {
    //   return this.documents[this.activeDocumentIndex]
    // },
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  mounted() {},
  methods: {
    isIdcard() {
      if (this.productName === 'id_card') {
        for (let i = 0; i < this.page.content.length; i++) {
          this.tabsArray[i] = { name: this.page.content[i].imageType }
        }
        this.activeName = this.tabsArray[0].name
      }
    },
    setTableData(index) {
      this.activePageIndex = this.$refs.documents.activePageIndex
    },
    setProductName(data) {
      this.activeTextId = 0
      this.productName = data.staticName
    },
    resetId() {},
    clickHandler(e, i) {
      const el = e.target.parentNode.firstChild
      if (!(i.position && i.position.length > 0)) {
        return
      }
      e = e || window.event
      if (i.value) {
        this.$refs.documents.handleClickText({
          el,
          value: i.position,
          id: i.id
        })
        this.activeTextId = i.id
      }
    },
    handleClick(value) {
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.resetProps()
    },
    goBack() {},
    pushtest() {
      const data = []
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
    },
    uploadFileData(res) {
      const data = res.data
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
      this.staticData[this.productName] = data
      this.isIdcard()
      return
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

  .lls-page-header {
    padding-bottom: 12px;
    border-bottom: 1px solid #E5E7EC;
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
