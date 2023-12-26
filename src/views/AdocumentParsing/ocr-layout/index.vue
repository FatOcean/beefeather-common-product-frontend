<template>
  <div
    class="ocr-layout"
    :class="{ 'show-image-viewer': showImageViewer }"
    :style="{
      height: layoutHeight,
    }"
  >
    <!-- 示例区-缩略图 -->
    <RightSelect ref="RightSelectRefs"></RightSelect>
    <!-- ocr -->
    <div
      :class="{
        'ocr-inner': true,
        ocrInnerWidth: isshowRight,
      }"
    >
      <!-- 文档 -->
      <div class="document-box" ref="documentBox">
        <div class="tool-bar">
          <div class="name">
            <lls-tooltip
              effect="dark"
              :content="page.fileName"
              placement="bottom-start"
            >
              <span>{{ page.fileName }}</span>
            </lls-tooltip>
          </div>
          <div>
            <svg-icon
              v-if="pageIndex === 1"
              class="dis-icon"
              iconClass="左置灰"
            ></svg-icon>
            <svg-icon
              v-else
              class="big-icon"
              iconClass="ic-左"
              @click.native="handleTurnPage(-1)"
            ></svg-icon>
            <lls-input
              :min="1"
              :max="total"
              class="number"
              v-model.number="pageIndex"
              @change="
                (e) => {
                  handleTurnPage(0, e);
                }
              "
              :short="true"
            >
              <span slot="suffix">/{{ total }}</span>
            </lls-input>
            <!-- <span class="number"
              >{{ activePageIndex + 1 }}&nbsp;&nbsp;<span
                >/{{ total }}</span
              ></span
            >-->

            <svg-icon
              v-if="pageIndex === total"
              class="dis-icon"
              iconClass="右置灰"
            ></svg-icon>
            <svg-icon
              v-else
              class="big-icon"
              iconClass="ic-右"
              @click.native="handleTurnPage(1)"
            ></svg-icon>
          </div>
          <div>
            <svg-icon
              iconClass="ic-放大"
              @click.native="handleZoom(zoomStep)"
            ></svg-icon>
            <svg-icon
              iconClass="ic-缩小"
              @click.native="handleZoom(-zoomStep)"
            ></svg-icon>
            <svg-icon
              iconClass="ic-旋转"
              @click.native="handleClickRotate"
            ></svg-icon>
            <svg-icon
              iconClass="ic-恢复默认"
              @click.native="resetProps"
            ></svg-icon>
            <svg-icon
              iconClass="ic-全屏"
              @click.native="handleFullScreen"
            ></svg-icon>
          </div>
        </div>
        <div
          class="document-layout"
          ref="documentLayout"
          @mousewheel="handleZoom"
          @mouseleave="
            (e) => {
              removeEventListener(e, 'drag-document');
            }
          "
        >
          <div
            class="document"
            ref="drag-document"
            :key="page.id"
            :class="{ draggable: draggable, transition: transition }"
            @mousedown="
              (e) => {
                handleMousedown(e, 'drag-document');
              }
            "
            :style="{
              height: `${page.realRenderHeight}px`,
              width: `${page.realRenderWidth}px`,
              transform: `rotate(${90 * rotateIndex}deg) translateY(${
                page.translateY + moveY
              }px) translateX(${page.translateX + moveX}px) scale(${
                page.rotateScale * zoomScale
              })`,
            }"
          >
            <img
              :style="{
                height: `${page.imgRenderHeight}px`,
                width: `${page.imgRenderWidth}px`,
                transform: `rotate(${-page.imgRotatingDeg || 0}deg)`,
              }"
              :src="imageUrl"
              :alt="page.fileName"
            />
            <svg
              v-if="showAllCoordinate && !isMultiCoordinate"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="frame-mask-svg"
              :width="page.realRenderWidth"
              :height="page.realRenderHeight"
              :style="{
                transform: `rotate(${-page.imgRotatingDeg || 0}deg)`,
              }"
            >
              <!-- 多边形 -->
              <template v-if="allPolygon">
                <circle
                  ref="pointEl"
                  v-for="(i, index) in svgCircle"
                  :key="`circle${index}`"
                  :cx="i.x * imgScale || 1"
                  :cy="i.y * imgScale || 1"
                  r="0.5"
                  fill="none"
                  stroke="none"
                />
                <path
                  v-for="item in coordinateData"
                  :key="`path${item.id}`"
                  :ref="`maskEl${item.id}`"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  style="fill: #dea2f3; opacity: 0.4"
                  :class="{ 'rect-active': activeTextId === item.id }"
                  @click.stop="(e) => clickRect(e, item)"
                  :d="polygonPathValue(item)"
                />
              </template>
              <template v-else>
                <rect
                  v-for="item in coordinateData"
                  :key="item.id"
                  :x="item.startX * imgScale || 1"
                  :y="item.startY * imgScale || 1"
                  :rx="4"
                  :ry="4"
                  :width="item.width * imgScale || 1"
                  :height="item.height * imgScale || 1"
                  :ref="`maskEl${item.id}`"
                  :class="{ 'rect-active': activeTextId === item.id }"
                  style="fill: #dea2f3; opacity: 0.4"
                  @click.stop="(e) => clickRect(e, item)"
                />
              </template>
            </svg>
            <svg
              v-if="activeText && !showAllCoordinate && !isMultiCoordinate"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="frame-mask-svg"
              :width="page.realRenderWidth"
              :height="page.realRenderHeight"
              :style="{
                transform: `rotate(${-page.imgRotatingDeg || 0}deg)`,
              }"
            >
              <!-- 多边形 -->
              <template v-if="polygon">
                <circle
                  ref="pointEl"
                  v-for="(i, index) in activeText"
                  :key="index"
                  :cx="i.x * imgScale"
                  :cy="i.y * imgScale"
                  r="0.5"
                  fill="none"
                  stroke="none"
                />
                <path
                  ref="maskEl"
                  stroke-width="0.5"
                  stroke="#0887FF"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  fill="rgba(8, 135, 255, 0.1)"
                  :d="maskElPathValue"
                />
              </template>
              <!-- 矩形 -->
              <rect
                v-else
                :x="activeText.startX * imgScale"
                :y="activeText.startY * imgScale"
                :rx="4"
                :ry="4"
                :width="activeText.width * imgScale"
                :height="activeText.height * imgScale"
                ref="maskEl"
                stroke-width="0.5"
                stroke="#0887FF"
                fill="rgba(8, 135, 255, 0.1)"
              />
            </svg>
            <svg
              v-if="activeText && isMultiCoordinate"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="frame-mask-svg"
              :width="page.realRenderWidth"
              :height="page.realRenderHeight"
              :style="{
                transform: `rotate(${-page.imgRotatingDeg || 0}deg)`,
              }"
            >
              <template v-for="(item, index) in activeText">
                <template v-if="index === 0">
                  <circle
                    v-for="(i, idx) in item"
                    :key="`cir${index}${idx}`"
                    ref="pointEl"
                    :cx="i.x * imgScale"
                    :cy="i.y * imgScale"
                    r="0.5"
                    fill="none"
                    stroke="none"
                  />
                </template>
                <path
                  :key="index"
                  ref="maskEl"
                  stroke-width="0.5"
                  stroke="#0887FF"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  fill="rgba(8, 135, 255, 0.1)"
                  :d="multiMaskElPathValue(item)"
                />
              </template>
            </svg>
          </div>
        </div>
      </div>
      <!-- 拖动更改两侧视口大小 -->
      <div
        ref="drag-view"
        class="drag-view"
        @mousedown="
          (e) => {
            handleMousedown(e, 'drag-view');
          }
        "
      ></div>
      <!-- ocr识别结果 -->
      <div class="ocr-result" ref="ocrResult">
        <div
          v-for="i in 4"
          :key="i"
          class="border-corner"
          :class="[`border-corner-${i}`]"
        ></div>
        <svg-icon iconClass="识别结果" class="svgClass"></svg-icon>
        <lls-tabs
          v-model="activeName"
          height="50px"
          @tab-click="handleClickTabs"
        >
          <lls-tab-pane label="识别结果" name="first">
            <div
              class="ocr-text"
              @scroll="proxy(calculateXy)"
              ref="ocrTextWrapper"
            >
              <slot></slot>
            </div>
          </lls-tab-pane>
          <lls-tab-pane label="Json结果" name="second">
            <div style="border: 1px solid #e3e8f0">
              <b-code-editor
                :indent-unit="4"
                v-model="codeTest"
                :readonly="true"
                :gutter="false"
                ref="editor"
                mode="application/json"
                theme="eclipse"
                :height="'calc(100vh - 198px)'"
                :show-number="false"
                :auto-format="true"
              ></b-code-editor>
            </div>
          </lls-tab-pane>
          <template v-slot:button>
            <lls-button type="text"
              ><i class="lls-icon-download"></i>
              {{
                `下载${activeName === "first" ? "识别" : "Json"}结果`
              }}</lls-button
            >
          </template>
        </lls-tabs>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        :width="documentWidth + ocrResultWidth + 8"
        :height="documentHeight"
        class="svg-mask"
        v-if="pathValue"
      >
        <path
          :d="`M${pathValue.pathStartX} ${pathValue.pathStartY} h${
            documentWidth - pathValue.pathStartX + 8
          } v${pathValue.pathEndY - pathValue.pathStartY} L${
            pathValue.pathEndX
          } ${pathValue.pathEndY}`"
          stroke-width="1"
          stroke="#0887FF"
          stroke-dasharray="5 5"
          fill="transparent"
        />
        <circle
          v-if="pathValue.pathStartX != documentWidth"
          :cx="pathValue.pathStartX"
          :cy="pathValue.pathStartY"
          r="3"
          fill="#0887FF"
        />
        <circle
          :cx="pathValue.pathEndX"
          :cy="pathValue.pathEndY"
          r="2"
          fill="#0887FF"
        />
      </svg>
      <lls-collapse-transition>
        <upload-File
          @uploadFileData="$parent.uploadFileData"
          :productObj="productObj"
        ></upload-File>
      </lls-collapse-transition>
    </div>
    <!-- 大图预览 -->
    <lls-image-viewer
      v-if="showImageViewer"
      :urlList="urlList"
      :on-close="handleClose"
    ></lls-image-viewer>
  </div>
</template>
<script>
import ResizeObserver from 'resize-observer-polyfill'
import ImageViewer from '@linklogis/image-viewer'
import RightSelect from './rightselect.vue'
import '@/icons'

function Events() {
  this.clientList = {}
  this.listen = function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  }
  this.trigger = function () {
    const key = Array.prototype.shift.call(arguments)
    const fns = this.clientList[key]
    if (!fns || fns.length === 0) {
      return
    }
    for (let i = 0, fn; (fn = fns[i++]);) {
      fn.apply(this, arguments)
    }
  }
  this.remove = function (key, fn) {
    const fns = this.clientList[key]
    if (!fns) {
      return
    }
    if (!fn) {
      fns.length = 0
    } else {
      for (let len = fns.length - 1; len >= 0; len--) {
        const _fn = fns[len]
        if (_fn === fn) {
          fns.splice(len, 1)
        }
      }
    }
  }
}

export default {
  name: 'ocr-layout',
  model: {
    prop: 'value',
    event: 'handle-change'
  },
  components: {
    [ImageViewer.name]: ImageViewer,
    RightSelect
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return null
      }
    },
    data: {
      // 文档数组
      type: Array,
      required: true
    },
    // 容器高度
    layoutHeight: {
      type: String
    },
    // 是否将出界的高亮区自动定位到画布中央
    locatable: {
      type: Boolean,
      default: true
    },
    // 是否展示所有坐标
    showAllCoordinate: {
      type: Boolean,
      default: false
    },
    // 所有坐标数据，必须开启showAllCoordinate
    coordinateData: {
      type: Array,
      default: () => []
    },
    isMultiCoordinate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'first',
      data_: [],
      activeTextId: '',
      documentWidth: null, // 画布的宽度
      documentHeight: null, // 画布的高度
      ocrResultWidth: null, // 识别结果的宽度
      pageIndex: 1, // 手动输入的页数
      activePageIndex: 0, // 当前页面索引
      activeText: null, // 高亮的文本
      pathValue: null, // 连线的起点、终点路径
      rotateIndex: 0, // 旋转次数
      zoomScale: 1, // 手动缩放比例
      zoomStep: 0.2, // 缩放梯度
      // windowResizeScale: 1, // 浏览器窗口缩放比例
      dragX: 0, // x方向拖动距离
      dragY: 0, // y方向拖动距离
      moveX: 0, // x方向平移距离
      moveY: 0, // y方向平移距离
      viewX: 0, // 视口偏移值
      initTranslateY: 0, // 初始位移数据
      draggable: false, // 是否抓住页面
      showImageViewer: false, // 是否启用大图预览
      transition: false, // 是否开启缓动效果
      scale: 1,
      newpage: {},
      productObj: {
        name: '身份证',
        staticName: 'id_card'
      },
      isshowRight: true
    }
  },
  computed: {
    // 当前示例信息
    // example() {
    //   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    //   this.codeTest = JSON.stringify(this.data[this.activePageIndex].json)
    //   return this.data[this.activePageIndex]
    // },
    // 总页数
    total() {
      return this.data.length
    },
    // 当前页面信息
    page() {
      const translateX = 0
      const translateY = 0
      const rotateScale = 1
      const page = {
        ...this.value,
        ...this.newpage,
        translateX,
        translateY,
        rotateScale // 旋转导致的缩放比例
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.codeTest = JSON.stringify(page.json)
      return page
    },
    // 文档图片地址
    imageUrl() {
      return this.page.imagePath
    },
    // 大图预览所需数据
    urlList() {
      return [{ url: this.page.imagePath, title: this.page.fileName }]
    },
    // 当前图片初始缩放比例
    imgScale() {
      return this.scale
    },
    // 是否是多边形
    polygon() {
      return (
        Object.prototype.toString.call(this.activeText) === '[object Array]'
      )
    },
    // 多边形路径
    maskElPathValue() {
      if (!this.activeText || Object.keys(this.activeText).length === 0) {
        return
      }
      let d = ''
      this.activeText.forEach((i, index) => {
        d += `${index === 0 ? 'M' : 'L'}${i.x * this.imgScale} ${
          i.y * this.imgScale
        } `
        // d += `${i.x * this.imgScale} ${i.y * this.imgScale}, `
      })
      return d + 'Z'
      // return d
    },
    allPolygon() {
      return (
        this.showAllCoordinate &&
        this.coordinateData &&
        this.coordinateData[0] &&
        this.coordinateData[0].coordinatesList
      )
    },
    svgCircle() {
      const value = this.coordinateData.find(
        (val) => val.id === this.activeTextId
      )
      return value ? value.coordinatesList : []
    }
  },
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    const el = this.$el
    this.resizeObserver = new ResizeObserver((_) => {
      this.proxy((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.ocrResultWidth = this.$refs.ocrResult.clientWidth
        // 初始化每张图片的宽高
        this.reRenderImage()
        this.$emit('on-resize')
      })
    })
    this.resizeObserver.observe(el)

    // 兼容firefox
    this.bind(this.$refs.documentLayout, 'DOMMouseScroll', this.handleZoom)

    this.$ocrLayoutEvents = new Events()
    this.$ocrLayoutEvents.listen('click-ocr-el', this.handleClickText)
    this.$ocrLayoutEvents.listen('drag-document', this.transferDocument)
    this.$ocrLayoutEvents.listen('drag-view', this.transferView)
  },
  watch: {
    data() {
      this.pageIndex = 1
      this.activePageIndex = 0
      this.reRenderImage()
      this.resetProps()
    }
  },
  beforeDestroy() {
    this.$ocrLayoutEvents.remove('click-ocr-el', this.handleClickText)
    this.$ocrLayoutEvents.remove('drag-document', this.transferDocument)
    this.$ocrLayoutEvents.remove('drag-view', this.transferView)
    this.resizeObserver.disconnect()
  },
  methods: {
    setisshowRight(data) {
      this.isshowRight = data
      this.proxy((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.ocrResultWidth = this.$refs.ocrResult.clientWidth
        // 初始化每张图片的宽高
        this.reRenderImage()
        this.$emit('on-resize')
      })
    },
    setProductName(data) {
      this.productObj = data

      this.resetProps()
      if (this.activeName !== 'first') this.handleClickTabs()
      this.$parent.setProductName(data)
    },
    handleClickTabs() {
      this.$nextTick(() => {
        this.$refs.editor.formatCode()
      })
      this.resetProps()
    },
    handleFullScreen() {
      this.$emit('on-open-viewer')
      this.showImageViewer = true
    },
    handleClose() {
      this.showImageViewer = false
      this.$emit('on-close-viewer')
    },
    // 翻页
    handleTurnPage(val, page) {
      const pageIndex = this.activePageIndex
      this.activePageIndex = this.activePageIndex + val
      if (this.activePageIndex === -1) {
        this.activePageIndex = this.total - 1
      } else if (this.activePageIndex === this.total) {
        this.activePageIndex = 0
      }
      if (page && page > 0 && page <= this.total) {
        this.activePageIndex = page - 1
      }
      this.pageIndex = this.activePageIndex + 1
      if (pageIndex === this.activePageIndex) {
        return
      }
      this.rotateIndex = 0
      this.activeText = null
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.$parent.setTableData(this.pageIndex)
      this.reRenderImage()
    },
    // 旋转图片
    handleClickRotate() {
      this.rotateIndex++
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.$nextTick((_) => {
        this.calculateXy()
      })
    },
    // 缩放图片
    handleZoom(e) {
      this.initTranslateY = 0
      let scale = this.zoomScale
      let scrollDis
      if (typeof e === 'number') {
        scale += e
      } else {
        e = e || window.event
        if (!e) return
        scrollDis = Math.ceil(e.wheelDelta ? e.wheelDelta / 10 : -e.detail * 6)
        scale += scrollDis > 0 ? this.zoomStep : -this.zoomStep
      }
      if (scale < 0.3) {
        scale = 0.3
      }
      if (scale > 3) {
        scale = 3
      }
      this.zoomScale = scale
      this.calculateXy()
      e.preventDefault && e.preventDefault()
      return false
    },
    // 计算鼠标移动距离
    calculateDragDis(offset) {
      const disX = offset.offsetX - this.offsetX
      const disY = offset.offsetY - this.offsetY
      this.$ocrLayoutEvents.trigger(offset.elName, { disX, disY })
      this.offsetX = offset.offsetX
      this.offsetY = offset.offsetY
    },
    // 移动文档图片
    transferDocument({ disX, disY }) {
      this.dragX += disX
      this.dragY += disY
      this.moveX = this.dragX
      this.moveY = this.dragY
      if (this.rotateIndex % 4 === 1) {
        this.moveX = this.dragY
        this.moveY = -this.dragX
      }
      if (this.rotateIndex % 4 === 2) {
        this.moveX = -this.dragX
        this.moveY = -this.dragY
      }
      if (this.rotateIndex % 4 === 3) {
        this.moveX = -this.dragY
        this.moveY = this.dragX
      }
      this.calculateXy()
    },
    // 移动两侧视口
    transferView({ disX, disY }) {
      this.viewX += disX
      const windowWidth = window.innerWidth
      if (this.viewX > windowWidth * 0.2) {
        this.viewX = windowWidth * 0.2
      }
      if (this.viewX < -windowWidth * 0.2) {
        this.viewX = -windowWidth * 0.2
      }
      this.$refs.documentBox.style.width = `calc(50% + ${this.viewX}px)`
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX + 8}px)`
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.ocrResultWidth = this.$refs.ocrResult.clientWidth
        this.reRenderImage()
        this.calculateXy()
      })
    },
    clickRect(e, value) {
      const el = document.getElementsByClassName(`rect${value.id}`)[0]
      const ocrElText = document.getElementsByClassName('ocr-text')[0]
      this.handleClickText({ el, value }, false)
      ocrElText.scrollTop = el.offsetTop
    },
    // 激活文本
    handleClickText({ el, value, id = '' }, locate = true) {
      this.activeEl = el
      this.activeText = value
      if (this.showAllCoordinate) this.activeTextId = value.id || id
      if (value == null || Object.keys(value).length === 0) {
        this.pathValue = null
        return
      }
      if (this.locatable && locate) {
        this.locate()
      } else {
        this.calculateXy()
      }
    },
    // 自动定位
    locate() {
      this.$nextTick((_) => {
        const el = this.$refs[`maskEl${this.activeTextId}`]
        const maskEl = el.length ? el[0] : el
        const documentLayout = this.$refs.documentLayout
        const maskElRect = maskEl.getBoundingClientRect()
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = maskElRect.top
        const mX = maskElRect.left
        const startX = mX - lX
        const startY = mY - lY
        // 先判断是否出界 => 1、出界=>move  2、未出界=>计算位置
        if (
          startX <= 0 ||
          startY <= 0 ||
          startX >= this.documentWidth ||
          startY >= this.documentHeight
        ) {
          let disX = 0
          let disY = 0
          if (startX <= 0) {
            disX = -startX + this.documentWidth / 2
          }
          if (startY <= 0) {
            disY = -startY + this.documentHeight / 2
          }
          if (startX >= this.documentWidth) {
            disX = this.documentWidth / 2 - startX
          }
          if (startY >= this.documentHeight) {
            disY = this.documentHeight / 2 - startY
          }
          this.transferDocument({ disX, disY })
          this.transition = true
          let index = 0
          this.timer = window.setInterval((_) => {
            this.calculateXy()
            index++
            if (index === 10) {
              clearInterval(this.timer)
              this.transition = false
            }
          }, 30)
        } else {
          this.calculateXy()
        }
      })
    },
    // 滚动识别结果区域
    handleScroll() {
      this.proxy(this.calculateXy)
      this.$emit('on-scroll')
    },
    // 多边形路径
    polygonPathValue(value) {
      if (!value.coordinatesList.length) return
      let d = ''
      value.coordinatesList.forEach((i, index) => {
        d += `${index === 0 ? 'M' : 'L'}${i.x * this.imgScale} ${
          i.y * this.imgScale
        } `
        // d += `${i.x * this.imgScale} ${i.y * this.imgScale}, `
      })
      return d + 'Z'
      // return d
    },
    // 计算path起点、终点坐标
    calculateXy() {
      if (
        this.activeText == null ||
        Object.keys(this.activeText).length === 0
      ) {
        return
      }
      this.$nextTick((_) => {
        let pointEls, pointEl, pointElsRect, beforeEl, afterEl, otherEl
        // 多边形点连线
        if (this.polygon) {
          pointEls = this.$refs.pointEl
          pointElsRect = pointEls.map((i, index) => {
            const elRect = i.getBoundingClientRect()
            if (index === 0 || pointEl.rect.right < elRect.right) {
              pointEl = { rect: elRect, index }
            }
            return { rect: elRect, index }
          })
          beforeEl =
            pointElsRect[
              pointEl.index === 0 ? pointElsRect.length - 1 : pointEl.index - 1
            ]
          afterEl =
            pointElsRect[
              pointEl.index === pointElsRect.length - 1 ? 0 : pointEl.index + 1
            ]
          otherEl =
            beforeEl.rect.right > afterEl.rect.right ? beforeEl : afterEl
        }
        const el = this.$refs[`maskEl${this.activeTextId}`]
        const maskEl = el.length ? el[0] : el
        const documentLayout = this.$refs.documentLayout
        const ocrTextWrapper = this.$refs.ocrTextWrapper
        const maskElRect = maskEl.getBoundingClientRect()
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const activeElRect = this.activeEl.getBoundingClientRect()
        const ocrTextWrapperRect = ocrTextWrapper.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = this.polygon
          ? (otherEl.rect.top + pointEl.rect.top) / 2
          : maskElRect.top
        const mX = this.polygon
          ? (otherEl.rect.right + pointEl.rect.right) / 2
          : maskElRect.right
        const startX = mX - lX
        const startY = mY - lY
        const offsetTop = activeElRect.top - ocrTextWrapperRect.top
        const offsetLeft = activeElRect.left - ocrTextWrapperRect.left
        let pathEndX = this.documentWidth + offsetLeft + 44
        const pathEndY = offsetTop + this.activeEl.clientHeight / 2
        const h = maskElRect.height
        let x = startX
        const y = this.polygon ? startY : startY + h / 2

        // 处理边界
        if (x > this.documentWidth) {
          x = this.documentWidth
        }
        if (pathEndX <= this.documentWidth + 48) {
          pathEndX = this.documentWidth + 48
        }

        this.pathValue = {
          pathStartX: x,
          pathStartY: y,
          pathEndX,
          pathEndY
        }
      })
    },
    // 还原
    resetProps() {
      this.rotateIndex = 0
      this.activePageIndex = 0
      this.activeText = null
      this.activeTextId = ''
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
    },
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data.forEach((document, index) => {
        // this.data_.push(document)
        const vm = this
        if (index === this.activePageIndex) {
          const page = {
            ...document,
            imgRotatingDeg: document.angle,
            originalWidth: document.width,
            originalHeight: document.height,
            img: document.imagePath
          }
          page.scale = vm.documentWidth / +page.originalWidth // 初始图片缩放比例
          page.realRenderHeight = +page.originalHeight * page.scale // 图片实际渲染高度
          if (page.realRenderHeight > vm.documentHeight) {
            page.realRenderHeight = vm.documentHeight
            page.scale = vm.documentHeight / +page.originalHeight
          }
          page.realRenderWidth = +page.originalWidth * page.scale // 图片实际渲染宽度

          if (/0|2/.test(page.imgRotatingDeg / 90)) {
            page.imgRenderWidth = page.realRenderWidth
            page.imgRenderHeight = page.realRenderHeight
          }
          if (/1|3/.test(page.imgRotatingDeg / 90)) {
            page.imgRenderWidth = page.realRenderHeight
            page.imgRenderHeight = page.realRenderWidth
          }
          vm.scale = page.scale
          vm.newpage = page
        }
      })
      window.setTimeout((_) => {
        this.calculateXy()
      })
    },
    handleMousedown(e, elName) {
      const el = this.$refs[elName]
      this.removeEventListener(e, elName)
      e = e || window.event
      this.offsetX = e.pageX
      this.offsetY = e.pageY
      window.addEventListener(
        'mousemove',
        (this[`${elName}Mousemove`] = (e) => {
          e = e || window.event
          this.proxy(this.calculateDragDis, {
            offsetX: e.pageX,
            offsetY: e.pageY,
            elName: elName
          })
          el.removeEventListener('mousedown', this.handleMousedown)
          this.draggable = true
        })
      )
      window.addEventListener(
        'mouseup',
        this.removeEventListener.bind(this, e, elName)
      )
    },
    removeEventListener(e, elName, w) {
      window.removeEventListener('mousemove', this[`${elName}Mousemove`])
      window.removeEventListener('mouseup', this.removeEventListener)
      this.draggable = false
    },
    multiMaskElPathValue(value) {
      if (!value || Object.keys(value).length === 0) {
        return
      }
      let d = ''
      value.forEach((i, index) => {
        d += `${index === 0 ? 'M' : 'L'}${i.x * this.imgScale} ${
          i.y * this.imgScale
        } `
        // d += `${i.x * this.imgScale} ${i.y * this.imgScale}, `
      })
      return d + 'Z'
    },
    // 绑定事件函数
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun)
        node.addEventListener(event, fun, false)
      } else {
        node.detachEvent('on' + event, fun)
        node.attachEvent('on' + event, fun.call())
      }
    },
    // 代理函数
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
@import './ocr-layout.styl';
.ocr-layout{
  background-image:url('~@/assets/images/bj.png')
}
.document-layout{
  background-color:#fff;
}
::v-deep .CodeMirror {
  height: calc(100vh - 200px);
}

::v-deep .CodeMirror-gutters {
  display: none;
}

::v-deep .cm-string {
  color: red;
}

.ocr-text {
  ::v-deep .lls-tabs__active-bar {
    margin-left: 0px !important;
  }
}
</style>
