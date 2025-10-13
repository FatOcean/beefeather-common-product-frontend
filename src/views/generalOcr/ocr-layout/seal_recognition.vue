<template>
  <div class="ocr-layout">
    <!-- ocr -->
    <div class="ocr-inner">
      <!-- 文档 -->
      <div class="document-box" ref="document-box">
        <div class="tool-bar">
          <div class="name">
            <el-tooltip
              effect="dark"
              :content="imageName"
              placement="bottom-start"
            >
              <span>{{ imageName }}</span>
            </el-tooltip>
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
              @click.native="showImageViewer = true"
            ></svg-icon>
          </div>
        </div>
        <div
          class="document-layout"
          @mouseleave="
            (e) => {
              removeEventListener(e, 'drag-document');
            }
          "
          ref="documentLayout"
          @mousewheel="handleZoom"
        >
          <div
            class="document"
            ref="drag-document"
            :key="example.id"
            :class="{ draggable: draggable, transition: transition }"
            @mousedown="
              (e) => {
                handleMousedown(e, 'drag-document');
              }
            "
            :style="{
              // backgroundImage: `url(${imageUrl})`,
              height: `${realRenderHeight}px`,
              width: `${realRenderWidth}px`,
              transform: `rotate(${90 * rotateIndex}deg) translateY(${
                page.translateY + moveY + initTranslateY
              }px) translateX(${page.translateX + moveX}px) scale(${
                page.rotateScale * zoomScale
              })`,
              transformOrigin: page.transformOrigin,
            }"
          >
            <img
              :style="{
                transform: `rotate(${example.angle || 0}deg)`,
              }"
              :src="imageUrl"
              :alt="imageName"
            />
            <svg
              class="svg-seal"
              :height="realRenderHeight"
              :width="realRenderWidth"
            >
              <!-- <polygon
                ref="svg-polygon"
                :points="svgPosition"
                style="fill:rgba(8,135,255,0.1);stroke:#009688;stroke-width:2"
              />-->
              <circle
                ref="pointEl"
                v-for="(i, index) in svgCircle"
                :key="index"
                :cx="i.cx"
                :cy="i.cy"
                r="0.5"
                fill="none"
                stroke="none"
              />
              <path
                ref="svg-polygon"
                :d="svgPosition ? `M ${svgPosition} z` : ''"
                fill="rgba(8,135,255,0.1)"
                stroke="#009688"
                stroke-width="1"
              />
            </svg>
            <svg
              class="svg-seal"
              :height="realRenderHeight"
              :width="realRenderWidth"
            >
              <!-- <polygon
                ref="svg-rectangle"
                :points="rectanglePosition"
                style="fill:rgba(8,135,255,0.1);stroke:#009688;stroke-width:2"
              />-->
              <path
                ref="svg-rectangle"
                :d="rectanglePosition ? `M ${rectanglePosition} z` : ''"
                fill="rgba(8,135,255,0.1)"
                stroke="#009688"
                stroke-width="2"
              />
              <!-- <path d="M 100 100 L 300 100 L 200 300 z" fill="red" stroke="blue" stroke-width="3" /> -->
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
        <rightTab :codeTest="codeTest" ref="rightTab" :isshowDownButton="false">
          <slot></slot
        ></rightTab>
      </div>
      <svgPath
        v-if="pathValue"
        :pathValue="pathValue"
        :documentWidth="documentWidth"
        :documentHeight="documentHeight"
      ></svgPath>
      <el-collapse-transition>
        <upload-File
        :fileTypes="['jpg', 'png', 'jpeg', 'bmp']"
          @uploadFileData="$parent.uploadFileData"
          :productObj="productObj"
        ></upload-File>
      </el-collapse-transition>
    </div>
    <!-- 大图预览 -->
    <showImg
      v-if="showImageViewer"
      :urlList="urlList"
      @close="showImageViewer = false"
    ></showImg>
  </div>
</template>
<script>
import ResizeObserver from 'resize-observer-polyfill'

export default {
  model: {
    prop: 'value',
    event: 'handle-change'
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
      required: true,
      default: () => []
    },
    activeTabIndex: {
      type: Number
    }
  },
  data() {
    return {
      activeName: 'first',
      documentWidth: null, // 画布的宽度
      documentHeight: null, // 画布的高度
      activeDocumentIndex: 0, // 当前示例索引
      activePageIndex: 1, // 当前页面索引
      activeTextId: null, // 高亮的文本索引
      pathValue: null, // 连线的起点、终点路径
      rotateIndex: 0, // 旋转次数
      zoomScale: 1, // 手动缩放比例
      zoomStep: 0.1, // 缩放梯度
      // windowResizeScale: 1, // 浏览器窗口缩放比例
      dragX: 0, // x方向拖动距离
      dragY: 0, // y方向拖动距离
      moveX: 0, // x方向平移距离
      moveY: 0, // y方向平移距离
      viewX: 0, // 视口偏移值
      initTranslateY: 0, // 初始位移数据
      draggable: false, // 是否抓住页面
      showImageViewer: false, // 是否启用大图预览
      realRenderHeight: 0,
      realRenderWidth: 0,
      scale: 1,
      total: 1,
      svgPosition: '',
      rectanglePosition: '',
      svgCircle: [],
      vertices: null,
      rectangle: null,
      eleItem: null,
      transition: false,
      productObj: {
        name: '印章识别',
        staticName: 'seal_recognition'
      }
    }
  },
  created() {},
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    this.resizeImg()

    // 兼容firefox
    this.bind(this.$refs.documentLayout, 'DOMMouseScroll', this.handleZoom)
    this.$events.listen('click-ocr-el', this.handleClickText)
    this.$events.listen('click-rectangle', this.handleClickRectangle)
    this.$events.listen('drag-document', this.transferDocument)
    this.$events.listen('drag-view', this.transferView)
  },
  watch: {
    data(val) {
      this.activeDocumentIndex = 0
      this.reRenderImage()
      this.resetProps()
      this.$nextTick(() => {
        this.$refs.rightTab.activeName = 'first'
      })
      // console.log(val, "watch.val");
    }
  },
  beforeDestroy() {
    this.$events.remove('click-ocr-el', this.clickOcrEl)
    this.$events.remove('drag-document', this.transferDocument)
    this.$events.remove('drag-view', this.transferView)
    this.resizeObserver.disconnect()
  },
  methods: {
    handleClickTabs() {
      this.$nextTick(() => {
        this.$refs.editor.formatCode()
      })
      this.resetProps()
    },
    inputChange() {
      // 输入页码
      if (this.activePageIndex > this.total) {
        this.activePageIndex = this.total
      }
      if (this.activePageIndex < 1) {
        this.activePageIndex = 1
      }
      const page = this.example.content
      this.resizeImg()
      this.$emit('handle-change', page)
      this.$emit('tabs', this.activeDocumentIndex, this.activePageIndex - 1)
    },
    handleClick(index) {
      // 点击右侧tabs
      // this.resetProps()
      this.rotateIndex = 0
      // this.activePageIndex = 1
      this.activeTextId = null
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.updateTranslateY()
      this.$emit('resetId')
      // this.activePageIndex = index + 1
      const page = this.example.content
      this.resizeImg()
      this.$emit('handle-change', page)
    },
    resizeImg() {
      const el = this.$el
      this.resizeObserver = new ResizeObserver((_) => {
        this.proxy((_) => {
          this.documentWidth = this.$refs.documentLayout.clientWidth
          this.documentHeight = this.$refs.documentLayout.clientHeight
          // console.log(this.documentWidth, this.documentHeight);
          // 初始化每张图片的宽高
          this.reRenderImage()
        })
      })
      this.resizeObserver.observe(el)
    },
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data.forEach((page) => {
        const vm = this
        // const img = new Image();
        // img.src = page.img;
        // img.onload = function () {
        // page.originalWidth = this.width // 图片原始宽度
        // page.originalHeight = this.height // 图片原始高度
        const widthScale = vm.documentWidth / +page.width
        const heightScale = vm.documentHeight / +page.height
        page.scale = widthScale < heightScale ? widthScale : heightScale
        // page.scale =
        //   page.height > page.width
        //     ? vm.documentHeight / +page.height
        //     : vm.documentWidth / +page.width; // 初始图片缩放比例

        page.realRenderHeight = +page.height * page.scale // 图片实际渲染高度
        // if (page.realRenderHeight > vm.documentHeight) {
        //   page.realRenderHeight = vm.documentHeight;
        //   page.scale = vm.documentHeight / +page.height;
        // }
        page.realRenderWidth = +page.width * page.scale // 图片实际渲染宽度
        // page.initTranslateY = (page.realRenderHeight - vm.documentHeight) / 2; // 图片实际渲染高度
        // };
      })
      // console.log("render")
      window.setTimeout((_) => {
        this.calculateXy()
      })
      // this.$nextTick((_) => {
      //   this.calculateXy();
      // });
      this.updateTranslateY()
      const page = this.data[this.activeDocumentIndex]
      // console.log(page, "page");
      this.realRenderHeight = page.realRenderHeight
      this.realRenderWidth = page.realRenderWidth
      this.scale = page.scale
    },
    // 切换示例
    handleClickExample(index) {
      if (this.activeDocumentIndex === index) {
        return
      }
      this.activeDocumentIndex = index
      this.resetProps()
      const page = this.example.content.identityList
      this.resizeImg()
      this.$emit('handle-change', page)
      this.$emit('tabs', this.activeDocumentIndex, this.activePageIndex - 1)
    },
    // 翻页
    handleTurnPage(val) {
      const num = this.activePageIndex - 1 + val
      this.resetProps()
      if (num === this.total) {
        if (this.activeDocumentIndex === this.data.length - 1) {
          this.activeDocumentIndex = 0
          this.activePageIndex = 1
        } else {
          this.activeDocumentIndex += 1
          this.activePageIndex = 1
        }
      } else if (num < 0) {
        if (this.activeDocumentIndex === 0) {
          this.activeDocumentIndex = this.data.length - 1
          this.activePageIndex =
            this.data[this.activeDocumentIndex].content.length
        } else {
          this.activeDocumentIndex -= 1
          this.activePageIndex =
            this.data[this.activeDocumentIndex].content.length
        }
      } else {
        this.activePageIndex = num + 1
      }

      const page = this.example.content[this.activePageIndex - 1]
      this.resizeImg()
      this.$emit('handle-change', page)
      this.$emit('tabs', this.activeDocumentIndex, this.activePageIndex - 1)
      this.resizeImg()
      // this.$emit("handle-change", page);
      // this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
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
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX}px)`
      this.$refs['document-box'].style.width = `calc(50% + ${
        this.viewX + 8
      }px)`
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.reRenderImage()
        this.calculateXy()
      })
    },
    // 激活文本
    handleClickText({ el, id, item }) {
      this.rectanglePosition = ''
      this.vertices = item.position
      this.svgPositionMethods(this.rotateIndex)
      this.activeEl = el
      this.activeTextId = id
      this.moveImage('svg-polygon')
    },
    moveImage(domName) {
      this.$nextTick((_) => {
        const maskEl = this.$refs[domName]
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
    handleClickRectangle({ item }) {
      console.log(item)
      this.svgPosition = ''
      this.pathValue = null
      this.rectangle = item.position
      this.rectanglePositionMethods()
      this.moveImage('svg-rectangle')
    },
    svgPositionMethods(rotateIndex) {
      this.svgPosition = this.vertices.reduce((total, cur, index) => {
        return (total += `${cur.x * this.imgScale} ${cur.y * this.imgScale} `)
      }, '')
      this.svgCircle = this.vertices.map((item) => {
        return {
          cx: item.x * this.imgScale,
          cy: item.y * this.imgScale
        }
      })
    },
    rectanglePositionMethods() {
      this.rectanglePosition = this.rectangle.reduce((total, cur, index) => {
        return (total += `${cur.x * this.imgScale} ${cur.y * this.imgScale} `)
      }, '')
    },
    // 计算path起点、终点坐标
    calculateXy() {
      this.rectanglePosition && this.rectanglePositionMethods()
      if (!this.svgPosition) return
      this.svgPositionMethods()
      this.$nextTick((_) => {
        let pointEl
        const pointEls = this.$refs.pointEl
        const pointElsRect = pointEls.map((i, index) => {
          const elRect = i.getBoundingClientRect()
          if (index === 0 || pointEl.rect.right < elRect.right) {
            pointEl = { rect: elRect, index }
          }
          return { rect: elRect, index }
        })
        const beforeEl =
          pointElsRect[
            pointEl.index === 0 ? pointElsRect.length - 1 : pointEl.index - 1
          ]
        const afterEl =
          pointElsRect[
            pointEl.index === pointElsRect.length - 1 ? 0 : pointEl.index + 1
          ]
        const otherEl =
          beforeEl.rect.right > afterEl.rect.right ? beforeEl : afterEl
        // const maskEl = this.$refs["svg-polygon"],
        const documentLayout = this.$refs.documentLayout
        const ocrTextWrapper = this.$refs.rightTab.$refs.ocrTextWrapper
        // maskElRect = maskEl.getBoundingClientRect(),
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const activeElRect = this.activeEl.getBoundingClientRect()
        const ocrTextWrapperRect = ocrTextWrapper.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = (otherEl.rect.top + pointEl.rect.top) / 2
        const mX = (otherEl.rect.right + pointEl.rect.right) / 2
        const startX = mX - lX
        const startY = mY - lY
        const offsetTop = activeElRect.top - ocrTextWrapperRect.top
        const offsetLeft = activeElRect.left - ocrTextWrapperRect.left
        const pathEndX = this.documentWidth + offsetLeft + 44
        const pathEndY = offsetTop + this.activeEl.clientHeight / 2
        let x = startX
        let y = startY
        if (x > this.documentWidth) {
          x = this.documentWidth
        }
        if (y > this.documentHeight) {
          y = this.documentHeight
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
      this.activePageIndex = 1
      this.activeTextId = null
      this.zoomScale = 1
      this.pathValue = null
      this.svgPosition = ''
      this.rectanglePosition = ''
      this.vertices = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.updateTranslateY()
      this.$emit('resetId')
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

    handleMousedown(e, elName) {
      const el = this.$refs[elName]
      this.removeEventListener(e, elName)
      e = e || window.event
      // if (e.target !== el) {
      //   return;
      // }
      this.offsetX = e.pageX
      this.offsetY = e.pageY
      window.addEventListener(
        'mousemove',
        (this[`${elName}Mousemove`] = (e) => {
          e = e || window.event
          // const el = this.$refs[elName];
          this.proxy(this.calculateDragDis, {
            offsetX: e.pageX,
            offsetY: e.pageY,
            elName: elName
          })
          el.removeEventListener('mousedown', this.handleMousedown)
          this.draggable = true
          // console.log(e, elName, this[`${elName}Mousemove`]);
        })
      )
      window.addEventListener(
        'mouseup',
        this.removeEventListener.bind(this, e, elName)
      )
    },
    removeEventListener(e, elName, w) {
      // console.log(elName);
      // const el = this.$refs[elName];

      window.removeEventListener('mousemove', this[`${elName}Mousemove`])
      window.removeEventListener('mouseup', this.removeEventListener)
      // this[`${elName}Mousemove`] = null;
      this.draggable = false
    },
    fn(arr) {
      return arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? this.fn(cur) : cur)
      }, [])
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
    parentProxy() {
      this.proxy(this.calculateXy)
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
  },
  computed: {
    // 当前示例信息
    example() {
      return this.data[this.activeDocumentIndex]
    },
    // 当前页面信息
    page() {
      const translateX = 0
      const translateY = 0
      const rotateScale = 1
      const page = {
        ...this.value,
        taskId: this.example.taskId,
        translateX,
        translateY,
        rotateScale // 旋转导致的缩放比例
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.codeTest = JSON.stringify(page?.json || '')
      return page
    },
    // pageDetail() {
    //   return this.page.value[this.activeTabIndex].identityList;
    // },
    // 文档图片地址
    imageUrl() {
      return this.page.imagePath
    },
    imageName() {
      return this.data[this.activeDocumentIndex].fileName
    },
    // fileName() {
    //   return this.allData[this.activeDocumentIndex].fileName.substring(
    //     0,
    //     this.allData[this.activeDocumentIndex].fileName.indexOf(".")
    //   );
    // },
    // 大图预览所需数据
    urlList() {
      return [{ url: this.imageUrl, title: this.imageName }]
    },
    // 当前文本信息
    text() {
      const { value } = this.page

      const textArr = [...value]
      const textValue = textArr[this.activeTabIndex].identityList
      // console.log(textValue, "textValue");
      return textValue.filter((i) => {
        return i.id === this.activeTextId
      })[0]
    },
    // 当前图片初始缩放比例
    imgScale() {
      return this.scale
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './ocr-layout.styl';

::v-deep .CodeMirror {
  height: calc(100vh - 200px);
}

::v-deep .CodeMirror-gutters {
  display: none;
}

::v-deep .cm-string {
  color: red;
}

.svg-seal {
  pointer-events: none;
  position: absolute;
  z-index: 1;
}
</style>
