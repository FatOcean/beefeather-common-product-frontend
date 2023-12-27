<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="通用OCR工具" bottom-line>
    </lls-page-header>
    <ocrlayout
      v-if="productName === 'document_ocr'"
      :data="documents"
      v-model="page"
      :activeTabIndex="activeTabIndex"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
      @resetId="() => (activeTextId = null)"
      :coordinateData="page.content"
      locatable
      showAllCoordinate
    >
      <ocr-el
        v-for="(i, index) in page.content"
        :key="index"
        :id="i.id"
        :value="i"
        :class="[`rect${i.id}`]"
        >{{ i.value }}</ocr-el
      >
    </ocrlayout>
    <ocrlayout
      v-if="productName === 'form_ocr'"
      v-model="page"
      ref="ocrLayout"
      :data="documents"
      locatable
      @on-resize="proxy(calculateXy)"
      @on-scroll="proxy(calculateXy)"
    >
      <template v-for="(content, index) in page.content">
        <!-- 表格 -->
        <template v-if="content.table">
          <table-wrapper
            ref="tableWrapper"
            :key="`rable${index}${page.pageNo}${page.requestId}`"
            @scroll="proxy(calculateXy)"
          >
            <table cellspacing="0" cellpadding="0">
              <tr
                v-for="(columns, excelIndex) in content.table"
                :key="`table${index}excel${excelIndex}`"
              >
                <ocr-el
                  v-for="(column, columnIndex) in columns"
                  :key="columnIndex"
                  :value="column"
                  :colspan="column.endCol - column.startCol + 1"
                  :rowspan="column.endRow - column.startRow + 1"
                  :style="{
                    height: `${column.height * page.scale}px`,
                  }"
                  tag="td"
                  v-html="resolveCol(column.value)"
                >
                </ocr-el>
              </tr>
            </table>
          </table-wrapper>
        </template>
        <!-- 文本 -->
        <template v-if="content.text">
          <ocr-el
            v-for="(text, textIndex) in content.text"
            :key="`content${index}text${textIndex}`"
            :value="text"
            tag="div"
            >{{ text.value }}</ocr-el
          >
        </template>
      </template>
    </ocrlayout>
    <ocrlayout
      v-if="productName === 'seal_recognition'"
      @resetId="
        () => {
          activeTextId = null;
          activeId = null;
        }
      "
      :data="documents"
      v-model="page"
      ref="documents"
      :activeTabIndex="activeTabIndex"
    >
      <div class="result-list">
        <div
          class="list-item"
          v-for="item in page.content"
          @click="(e) => listClick(e, item)"
          :class="{ active: activeId === item.id }"
          :key="item.id"
        >
          <div class="head">{{ item.sealType }}</div>
          <div
            class="content"
            v-for="i in item.texts"
            :class="{ contentActive: activeTextId === i.id }"
            @click.stop="(e) => clickHandler(e, i, item)"
            :key="i.key"
          >
            {{ i.text }}
          </div>
        </div>
      </div>
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
      activeTabIndex: 0,
      tabsArray: [],
      activeTextId: 0,
      productName: 'seal_recognition',
      activePageIndex: 0,
      activeId: ''
    }
  },

  watch: {
    checked(val) {
      this.$refs.documents.pathValue = null
      this.filterEmpty(val)
    }
  },
  created() {
    console.log(this.staticData)
  },
  computed: {
    documents() {
      const document = JSON.parse(JSON.stringify(staticData[this.productName]))
      return document
    },
    page() {
      return this.documents[this.activePageIndex]
    },
    pageDetail() {
      return this.page.content[this.activeTabIndex].identityList
    },
    ...mapState(['pageMenuPerm']),
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  mounted() {},
  methods: {
    listClick(e, i) {
      if (this.activeId === i.id) return
      this.activeTextId = null
      this.activeId = i.id
      this.$refs.documents.$events.trigger('click-rectangle', {
        item: i
      })
    },
    clickHandler(e, i, parent) {
      const el = e.target
      this.activeId = parent.id
      e = e || window.event
      this.$refs.documents.handleClickText({
        el,
        id: i.id,
        value: i
      })
      this.activeTextId = this.$refs.documents.activeTextId
    },
    calculateXy() {
      this.$events.trigger('ocr-text-scroll')
      this.$refs.ocrLayout.calculateXy()
    },
    setTableData(index) {
      this.activePageIndex = this.$refs.documents.activePageIndex
    },
    setProductName(data) {
      this.activeTextId = 0
      this.productName = data.staticName
    },
    resetId() {},
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
    },
    resolveCol(value) {
      return value.replace(/\n/gi, '<br/>')
    },
    proxy(fun, args) {
      if (this.proxying) return
      this.proxying = true

      window.requestAnimationFrame((_) => {
        fun.call(this, args)
        this.proxying = false
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './index.styl';
</style>
