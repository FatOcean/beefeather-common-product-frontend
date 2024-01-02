<template>
  <div
    class="vat-invoice-wrapper"
    style="flex-shrink: 1; flex-grow: 1; width: calc(100vw - 230px)"
  >
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      @changeActivePageIndex="changeActivePageIndex"
      :data="documents"
      v-model="page"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
    >
      <lls-tabs @tab-click="handleClick" v-model="activeName">
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
      </lls-tabs>
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tr
          :class="{
            active: activeTextId === i.id && activeTableType === 'info',
            pointer: i.position,
          }"
          @click="(e) => clickHandler(e, i, 'info')"
          v-for="i in page.content[0].info"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td style="white-space: pre-line">{{ i.value }}</td>
        </tr>
        <template v-for="(item, index) in page.content[0].commodity">
          <tr v-bind:key="index">
            <td
              class="td-title"
              :rowspan="page.content[0].commodity[index].length + 1"
            >
              货物或应税劳务、服务描述{{ index + 1 }}
            </td>
          </tr>
          <tr
            :class="{
              active:
                activeTextId === item.id && activeTableType === 'commodity',
              pointer: item.position,
            }"
            @click="(e) => clickHandler(e, item, 'commodity')"
            v-for="item in page.content[0].commodity[index]"
            :key="item.key"
          >
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </template>
        <tr
          :class="{
            active: activeTextId === i.id && activeTableType === 'others',
            pointer: i.position,
          }"
          @click="(e) => clickHandler(e, i, 'others')"
          v-for="i in page.content[0].others"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td>{{ i.value }}</td>
        </tr>
      </table>
    </ocr-layout>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ocrLayout from './ocr-layout'
import { staticData } from '../staticData'

export default {
  data() {
    return {
      activePageIndex: 0,
      activeTextId: '',
      page: {},
      activeName: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: staticData.vat,
      activeTableType: ''
    }
  },
  components: { ocrLayout },
  computed: {
    ...mapState(['pageMenuPerm']),
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  created() {
    this.page = this.documents[0]
    this.tabsArray = this.documents.map((item, index) => {
      return {
        name: `发票${index + 1}`
      }
    })
    this.activeName = this.tabsArray[0].name
  },
  methods: {
    changeActivePageIndex(activePageIndex) {
      this.activePageIndex = activePageIndex
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.activePageIndex = 0
      this.activeDocumentIndex = activeDocumentIndex
      this.tabsArray = this.documents[activeDocumentIndex].specificData.map(
        (item, index) => {
          return {
            name: `发票${index + 1}`
          }
        }
      )
      this.activeName = this.tabsArray[activePageIndex].name
    },
    handleClick(value) {
      this.tabsArray.forEach((item, index) => {
        if (item.name === value.name) {
          this.$refs.documents.handleClick(index)
        }
      })
    },
    clickHandler(e, i, type) {
      if (i.value === '' || i.position[0].length !== 4) {
        return
      }
      const el =
        e.target.nodeName === 'TR'
          ? e.target.firstChild
          : e.target.parentNode.firstChild
      this.activeTextId = i.id
      this.activeTableType = type
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        value: i.position
      })
    },
    uploadFileData(res) {
      const data = res.data
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
      this.documents = data
      this.page = this.documents[0]
      this.tabsArray = this.documents.map((item, index) => {
        return {
          name: `发票${index + 1}`
        }
      })
      this.activeName = this.tabsArray[0].name
    }
  }
}
</script>
<style lang="stylus">
.pre-line {
  white-space: pre-line;
}
</style>
