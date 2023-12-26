<template>
  <div class="ocr-layout" :class="{ 'show-image-viewer': showImageViewer }">
    <!-- 示例区-缩略图 -->
    <RightSelect ref="RightSelectRefs"></RightSelect>
    <!-- ocr -->
    <div class="ocr-inner">
      <!-- 文档 -->
      <div class="document-box" ref="document-box">
        <div class="tool-bar">
          <div class="name">
            <lls-tooltip
              effect="dark"
              :content="example.fileName"
              placement="bottom-start"
            >
              <span>{{ example.fileName }}</span>
            </lls-tooltip>
          </div>
          <div>
            <svg-icon
              v-if="activePageIndex === 1"
              class="dis-icon"
              iconClass="左置灰"
            ></svg-icon>
            <svg-icon
              v-else
              class="big-icon"
              iconClass="ic-左"
              @click.native="handleTurnPage(-1)"
            ></svg-icon>
            <span class="number">
              <lls-input
                v-model.number="activePageIndex"
                v-on:change="inputChange($event)"
              />
              <span>/{{ total }}</span>
            </span>
            <svg-icon
              v-if="activePageIndex >= total"
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
              @click.native="
                postFixdMessage(true);
                showImageViewer = true;
              "
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
              height: `${realRenderHeight}px`,
              width: `${realRenderWidth}px`,
              transform: `rotate(${90 * rotateIndex}deg) translateY(${
                page.translateY + moveY
              }px) translateX(${page.translateX + moveX}px) scale(${
                page.rotateScale * zoomScale
              })`,
            }"
          >
            <img
              :style="{
                transform: `rotate(${-page.imgRotatingDeg || 0}deg)`,
              }"
              :src="imageUrl"
              :alt="example.fileName"
            />
            <svg class="svg-seal" height="100%" width="100%">
              <polygon
                ref="svg-rectangle"
                :points="rectanglePosition"
                style="
                  fill: rgba(8, 135, 255, 0.1);
                  stroke: #0887ff;
                  stroke-width: 2;
                "
              />
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
        <lls-tabs v-model="activeName" height="50px" @tab-click="handleClick">
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
      <SvgPath
        v-if="pathValue"
        :pathValue="pathValue"
        :documentWidth="documentWidth"
        :documentHeight="documentHeight"
      ></SvgPath>
      <lls-collapse-transition>
        <upload-File @uploadFileData="uploadFileData"></upload-File>
      </lls-collapse-transition>
    </div>
    <!-- 大图预览 -->
    <lls-image-viewer
      v-if="showImageViewer"
      :urlList="urlList"
      :on-close="
        () => {
          postFixdMessage(false);
          showImageViewer = false;
        }
      "
    ></lls-image-viewer>
    <!-- 上传文件 -->
  </div>
</template>
<script>
import ResizeObserver from 'resize-observer-polyfill'
import ImageViewer from '@linklogis/image-viewer'
import RightSelect from './rightselect.vue'
import SvgPath from './svgPath.vue'
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
  model: {
    prop: 'value',
    event: 'handle-change'
  },
  components: {
    [ImageViewer.name]: ImageViewer,
    RightSelect,
    SvgPath
  },
  props: {
    value: {
      type: Array,
      default: function () {
        return null
      }
    },
    data: {
      // 文档数组
      type: Array,
      required: true
    },
    activeTabIndex: {
      type: Number
    }
  },

  data() {
    return {
      rectanglePosition: '',
      // codeTest: '',
      // '{"title":"测试json数据","children":[{"name":"子项名称", "desc":"子项说明" },{"name":"子项名称1", "desc":"子项说明1" }]}',
      activeName: 'first',
      data_: [],
      documentWidth: null, // 画布的宽度
      documentHeight: null, // 画布的高度
      activeDocumentIndex: 0, // 当前示例索引
      activePageIndex: 1, // 当前页面索引
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
      activeTextId: null,
      realRenderHeight: 0,
      realRenderWidth: 0
    }
  },
  watch: {
    data() {
      this.activeDocumentIndex = 0
      this.reRenderImage()
      this.resetProps()
    }
  },
  computed: {
    // 当前示例信息
    example() {
      return this.data[this.activeDocumentIndex]
    },
    codeTest() {
      return JSON.stringify(this.example.json)
    },
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
        value: this.value,
        translateX,
        translateY,
        rotateScale // 旋转导致的缩放比例
      }
      return page
    },
    // 文档图片地址
    imageUrl() {
      return this.example.imagePath
    },
    // 大图预览所需数据
    urlList() {
      return [{ url: this.page.img, title: this.example.fileName }]
    },
    // 当前图片初始缩放比例
    imgScale() {
      return this.scale
    },
    text() {
      const { value } = this.page
      const textArr = [...value]
      const textValue = textArr[this.activeTabIndex].identityList
      return textValue.filter((i) => {
        return i.id === this.activeTextId
      })[0]
    }
  },
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    const el = this.$el
    this.resizeObserver = new ResizeObserver((_) => {
      this.proxy((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        // 初始化每张图片的宽高
        this.reRenderImage()
      })
    })
    this.resizeObserver.observe(el)

    // 兼容firefox
    this.bind(this.$refs.documentLayout, 'DOMMouseScroll', this.handleZoom)

    this.$events = new Events()
    this.$events.listen('click-ocr-el', this.handleClickText)
    this.$events.listen('drag-document', this.transferDocument)
    this.$events.listen('drag-view', this.transferView)
  },

  beforeDestroy() {
    this.$events.remove('click-ocr-el', this.handleClickText)
    this.$events.remove('drag-document', this.transferDocument)
    this.$events.remove('drag-view', this.transferView)
    this.resizeObserver.disconnect()
  },
  methods: {
    setProductName(data) {
      this.resetProps()
      this.$parent.setProductName(data)
    },
    loaded() {
      this.loading = false
      this.rectanglePosition = ''
    },
    setRectangle(index = 0) {
      const rectangle = this.text?.position
      if (rectangle) {
        this.rectanglePosition = rectangle.reduce((total, cur) => {
          const str = (total +=
            `${cur.x * this.scale},${cur.y * this.scale}` + ' ')
          return str
        }, '')
      }
    },
    handleClick(tab, event) {
      // if (this.activeName === 'second') {
      // this.$nextTick(() => {
      // this.codeTest = this.example.json
      this.$refs.editor.formatCode()
      // this.resetProps()
      // })
      // }
    },
    uploadFileData() {},
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: 'messageGeneralProduct',
          fixed: fixed
        },
        '*'
      )
    },
    inputChange() {
      // 输入页码
      if (this.activePageIndex > this.total) {
        this.activePageIndex = this.total
      }
      if (this.activePageIndex < 1) {
        this.activePageIndex = 1
      }
      const page = this.example.items[this.activePageIndex - 1]
      this.reRenderImage()
      this.$emit('handle-change', page)
      // this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
    },
    // 翻页
    handleTurnPage(val) {
      this.rotateIndex = 0
      this.activeText = null
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.activePageIndex = this.activePageIndex + val
      this.reRenderImage()
    },
    // 设置初始y位移
    updateTranslateY() {
      this.$nextTick((_) => {
        if (this.rotateIndex % 4 === 0 && this.zoomScale === 1) {
          this.initTranslateY = Math.max(
            (this.realRenderHeight - this.documentHeight) / 2,
            0
          )
        } else {
          this.initTranslateY = 0
        }
      })
    },
    // 旋转图片
    handleClickRotate() {
      this.rotateIndex++
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
      this.updateTranslateY()
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
      this.$events.trigger(offset.elName, { disX, disY })
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
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX + 8}px)`
      this.$refs['document-box'].style.width = `calc(50% + ${this.viewX}px)`
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.reRenderImage()
        this.calculateXy()
      })
    },
    // 激活文本
    handleClickText({ el, id }) {
      this.activeEl = el
      this.activeTextId = id
      this.setRectangle(this.activeTextId)
      this.$nextTick((_) => {
        const maskEl = this.$refs['svg-rectangle']
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
            if (index === 12) {
              clearInterval(this.timer)
              this.transition = false
            }
          }, 30)
        } else {
          this.calculateXy()
        }
      })
    },
    getOffsetTopRelativeToAncestor(childElement, ancestorElement) {
      var offsetTop = 0
      var currentElement = childElement

      while (currentElement && currentElement !== ancestorElement) {
        offsetTop += currentElement.offsetTop
        currentElement = currentElement.offsetParent
      }

      return offsetTop
    },
    // 计算path起点、终点坐标
    calculateXy() {
      if (this.activeTextId == null) {
        return
      }
      this.setRectangle(this.activeTextId)
      const page = this.page
      const rotateIndex = this.rotateIndex
      const zoomScale = this.zoomScale || 1
      this.$nextTick((_) => {
        const maskEl = this.$refs['svg-rectangle']
        const documentLayout = this.$refs.documentLayout
        const ocrTextWrapper = this.$refs.ocrTextWrapper
        const offsetTop = this.activeEl.offsetTop
        const scrollTop = ocrTextWrapper.scrollTop
        var offsetTopRelativeToAncestor = this.getOffsetTopRelativeToAncestor(
          document.getElementById('table-data'),
          this.$refs.ocrTextWrapper
        )

        console.log(
          '相对于祖先元素的 offsetTop: ' + offsetTopRelativeToAncestor
        )
        const tableTop = document.getElementById('table-data').offsetTop
        const pathEndY =
          offsetTop -
          scrollTop +
          this.activeEl.clientHeight / 2 +
          offsetTopRelativeToAncestor
        const maskElRect = maskEl.getBoundingClientRect()
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = maskElRect.top
        const mX = maskElRect.right
        const startX = mX - lX
        const startY = mY - lY
        const offsetLeft = this.activeEl.offsetLeft
        const pathEndX = this.documentWidth + offsetLeft + 50
        const scale = page.rotateScale * zoomScale * this.imgScale
        const w = this.text.position[1].x - this.text.position[0].x
        const h = this.text.position[2].y - this.text.position[0].y

        let x = startX
        let y = startY + (h * scale) / 2

        if (rotateIndex % 4 === 1) {
          y = startY + (w * scale) / 2
        }
        if (rotateIndex % 4 === 2) {
          y = startY + (h * scale) / 2
        }
        if (rotateIndex % 4 === 3) {
          y = startY + (w * scale) / 2
        }

        // 处理边界
        if (x > this.documentWidth) {
          x = this.documentWidth
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
      this.activeTextId = null
      this.activePageIndex = 1
      this.activeText = null
      this.zoomScale = 1
      this.pathValue = null
      this.rectanglePosition = ''
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.updateTranslateY()
      this.$emit('resetId')
    },
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data_ = []
      this.data.forEach((document, index) => {
        this.data_.push(document)
        const vm = this
        if (index === this.activeDocumentIndex) {
          const page = {
            ...document,
            imgRotatingDeg: document.angle,
            originalWidth: document.width,
            originalHeight: document.height,
            img: document.imagePath
          }

          const img = new Image()
          img.src = page.img
          img.onload = function () {
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
            console.log(page)
            vm.scale = page.scale
            vm.realRenderHeight = page.realRenderHeight
            vm.realRenderWidth = page.realRenderWidth
            vm.data_.splice(index, 1, { ...document })
          }
        }
      })
      window.setTimeout((_) => {
        this.calculateXy()
      })
      this.updateTranslateY()
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
    // 绑定事件函数
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun, false)
        node.addEventListener(event, fun, false)
      } else {
        node.detachEvent('on' + event, fun)
        node.attachEvent('on' + event, fun)
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
@import './index.styl';

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
