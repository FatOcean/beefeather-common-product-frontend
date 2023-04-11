<template>
  <div class="ocr-layout" :class="{ 'show-image-viewer': showImageViewer }">
    <!-- 示例区-缩略图 -->
    <div class="examples-wrapper">
      <div
        class="example"
        :class="{ active: activeDocumentIndex == index }"
        v-for="(i, index) in data"
        :key="index"
        @click="handleClickExample(index)"
      >
        <div class="example-image">
          <img :src="i.images[0].url" :alt="i.name" />
        </div>
        <div class="text">
          <span>{{ i.name.substring(0, i.name.lastIndexOf(".")) }}</span>
        </div>
      </div>
    </div>
    <!-- ocr -->
    <div class="ocr-inner">
      <!-- 文档 -->
      <div class="document-box" ref="document-box">
        <div class="tool-bar">
          <div class="name">
            <lls-tooltip
              effect="dark"
              :content="example.name"
              placement="bottom-start"
            >
              <span>{{ example.name }}</span>
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
              <input
                class="dih-page-input"
                type="number"
                v-model.number="activePageIndex"
                v-on:change="inputChange($event)"
              />
              <span>/&nbsp;&nbsp;{{ total }}</span>
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
              :alt="example.name"
            />
            <div
              v-if="activeText"
              class="frame-mask active"
              ref="maskEl"
              :style="{
                top: `${activeText.startY * imgScale}px`,
                left: `${activeText.startX * imgScale}px`,
                height: `${activeText.height * imgScale}px`,
                width: `${activeText.width * imgScale}px`,
                transform: `rotate(${activeText.deg}deg)`,
              }"
            ></div>
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
        <div class="ocr-title-bar">
          <div class="ocr-title">
            <svg-icon iconClass="识别结果"></svg-icon>
            <span>识别结果</span>
          </div>
          <div>
            <llsButton
              type="text"
              @click="handleClickDownload"
              v-if="pageMenuPerm['DOWNBSINESSLICENSE']"
            >
              <svg-icon class="download" iconClass="下载"></svg-icon>
              <span>下载</span>
            </llsButton>
            <more-Button
              productName="营业执照解析"
              :servicecon="pageMenuPerm['COLLBSINESSLICENSE']"
              :collect="pageMenuPerm['SERBSINESSLICENSE']"
            ></more-Button>
          </div>
        </div>
        <div class="ocr-text" @scroll="proxy(calculateXy)" ref="ocrTextWrapper">
          <slot></slot>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        :width="documentWidth * 2"
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
  </div>
</template>
<script>
import ResizeObserver from 'resize-observer-polyfill'
import ImageViewer from '@linklogis/image-viewer'

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
    [ImageViewer.name]: ImageViewer
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
    pageMenuPerm: Object
  },
  data() {
    return {
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
      transition: false // 是否开启缓动效果
      // requestBody: {
      //   url: "/business-license-analysis-web/invoice/common/serviceList",
      //   data: {
      //     name: "营业执照解析",
      //   },
      // },
    }
  },
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    const el = this.$el
    this.resizeObserver = new ResizeObserver((_) => {
      this.proxy((_) => {
        // console.log(this.$refs.documentLayout.clientWidth);
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
  watch: {
    data() {
      this.activeDocumentIndex = 0
      this.reRenderImage()
      this.resetProps()
    }
  },
  beforeDestroy() {
    this.$events.remove('click-ocr-el', this.handleClickText)
    this.$events.remove('drag-document', this.transferDocument)
    this.$events.remove('drag-view', this.transferView)
    this.resizeObserver.disconnect()
  },
  methods: {
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: 'messageFromDocumentOcr',
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
    // 切换示例
    handleClickExample(index) {
      if (this.activeDocumentIndex == index) {
        return
      }
      this.activeDocumentIndex = index
      this.resetProps()
      this.reRenderImage()
      // const page = this.example.items[this.activePageIndex];
      // this.$emit("handle-change", page);
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
      // if (this.activePageIndex === -1) {
      //   this.activePageIndex = this.total - 1;
      // } else if (this.activePageIndex === this.total) {
      //   this.activePageIndex = 0;
      // }
      this.reRenderImage()
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
      // this.updateTranslateY();
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
      this.$refs['document-box'].style.width = `calc(50% + ${this.viewX}px)`
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.reRenderImage()
        this.calculateXy()
      })
    },
    // 激活文本
    handleClickText({ el, value }) {
      if (!value.value || value.value === '新乡县') {
        return
      } else {
        this.activeEl = el
        this.activeText = value
      }
      console.log(this.activeText)
      this.$nextTick((_) => {
        const maskEl = this.$refs.maskEl
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
            if (index == 10) {
              clearInterval(this.timer)
              this.transition = false
            }
          }, 30)
        } else {
          this.calculateXy()
        }
      })
    },
    // 计算path起点、终点坐标
    calculateXy() {
      if (this.activeText == null) {
        return
      }

      const page = this.page
      const rotateIndex = this.rotateIndex
      const zoomScale = this.zoomScale || 1
      this.$nextTick((_) => {
        const maskEl = this.$refs.maskEl
        const documentLayout = this.$refs.documentLayout
        const ocrTextWrapper = this.$refs.ocrTextWrapper
        const maskElRect = maskEl.getBoundingClientRect()
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const activeElRect = this.activeEl.getBoundingClientRect()
        const ocrTextWrapperRect = ocrTextWrapper.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = maskElRect.top
        const mX = maskElRect.right
        const startX = mX - lX
        const startY = mY - lY
        const offsetTop = activeElRect.top - ocrTextWrapperRect.top
        const offsetLeft = activeElRect.left - ocrTextWrapperRect.left
        let pathEndX = this.documentWidth + offsetLeft + 44
        const pathEndY = offsetTop + this.activeEl.clientHeight / 2
        const scale = page.rotateScale * zoomScale * this.imgScale
        const w = this.activeText.width
        const h = this.activeText.height
        const Q = this.activeText.deg || 0
        const leanX = (scale * w * Math.sin((2 * Math.PI * Q) / 360)) / 2

        let x = startX
        let y = startY + (h * scale) / 2

        if (rotateIndex % 4 === 1) {
          x = startX + leanX
          y = startY + (w * scale) / 2
        }
        if (rotateIndex % 4 === 2) {
          x = startX
          y = startY + (h * scale) / 2
        }
        if (rotateIndex % 4 === 3) {
          x = startX + leanX
          y = startY + (w * scale) / 2
        }

        // 处理边界
        if (x > this.documentWidth) {
          x = this.documentWidth
        }
        if (pathEndX < this.documentWidth + 48) {
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
      this.activePageIndex = 1
      this.activeText = null
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
    },
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data_ = []
      this.data.forEach((document, index) => {
        this.data_.push(document)
        const vm = this
        if (index == this.activeDocumentIndex) {
          document.items.forEach((page, index_) => {
            const image = document.images[0]
            page = {
              ...page,
              imgRotatingDeg: image.imgRotatingDeg,
              originalWidth: image.originalWidth,
              originalHeight: image.originalHeight,
              img: image.url
            }

            const img = new Image()
            img.src = page.img
            img.onload = function () {
              // page.originalWidth = this.width; // 图片原始宽度
              // page.originalHeight = this.height; // 图片原始高度
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
              // console.log(page);
              document.items.splice(index_, 1, { ...page })
              if (vm.activePageIndex == index_ + 1) {
                vm.$emit('handle-change', { ...page })
              }
              vm.data_.splice(index, 1, { ...document })
            }
          })
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
    // 绑定事件函数
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun)
        node.addEventListener(event, fun, false)
      } else {
        node.detachEvent('on' + event, fun)
        node.attachEvent('on' + event, fun.call(obj))
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
    },
    // 下载识别结果
    handleClickDownload() {
      this.$http({
        method: 'get',
        url: `/general-product-web/general/downloadResult?taskId=${this.example.requestId}&productName=营业执照解析&show=${this.example.show || false}`,
        responseType: 'blob'
      })
        .then((res) => {
          const fileName =
            res.headers['content-disposition'] &&
            res.headers['content-disposition']
              .split(';')[1]
              .split('filename=')[1]
              .replace(/"/gi, '')
          const blob = res.data
          const type =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'
          this.exportByBlob(blob, decodeURIComponent(fileName), type)
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            message: '网络错误，请稍后再试',
            type: 'error',
            offset: 72
          })
        })
    }
  },

  computed: {
    // 当前示例信息
    example() {
      return this.data[this.activeDocumentIndex]
    },
    // 总页数
    total() {
      return this.example.items.length
    },
    // 当前页面信息
    page() {
      const translateX = 0
      const translateY = 0
      const rotateScale = 1
      const page = {
        ...this.value,
        translateX,
        translateY,
        rotateScale // 旋转导致的缩放比例
      }
      return page
    },
    // 文档图片地址
    imageUrl() {
      return this.example.images[0].url
    },
    // 大图预览所需数据
    urlList() {
      return [{ url: this.page.img, title: this.example.name }]
    },
    // 当前图片初始缩放比例
    imgScale() {
      return this.page.scale
    }
  }
}
</script>
<style lang="stylus">
.ocr-layout {
  padding: 76px 24px 24px 24px;
  display: flex;
  color: #202d40;
  height: 100vh;
  overflow: hidden;

  * {
    user-select: none;
  }

  .dih-page-input {
    background-color: transparent;
    max-width: 20px;
    border: none;
    text-align: center;
    outline: medium;
    color: #999;
    border-bottom: 1px solid #E3E8F0;
    line-height: 14px;

    &:focus {
      border-color: #0887ff;
    }
  }

  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  .examples-wrapper {
    width: 80px;
    flex-shrink: 0;
    flex-grow: 0;

    .example {
      width: 64px;
      height: 88px;
      position: relative;
      border-radius: 4px;
      background-color: #ffffff;
      border: 1px solid #dadfe6;
      cursor: pointer;

      .example-image {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin: 4px;
        height: calc(100% - 20px);
        display: flex;
        align-items: center;
        overflow: hidden;

        >img {
          width: 100%;
        }
      }

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      .text {
        position: absolute;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        background: #e2e2e2;
        width: 100%;
        bottom: -1px;
        right: 0;
        border-radius: 0 0 4px 4px;
        text-align: center;

        span {
          transform: scale(0.75);
          transform-origin: left;
          display: block;
          width: 82.7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &.active {
        border: 1px solid #0887ff;
        background-color: rgba(8, 135, 255, 0.08);
        border-radius: 4px;

        .text {
          color: #fff;
          background: #0887ff;
        }
      }
    }
  }

  .ocr-inner {
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    position: relative;
    align-items: center;

    .svg-mask {
      pointer-events: none;
      position: absolute;
      top: 60px;
      left: 16px;
      z-index: 1;
    }

    .document-box {
      border: 1px solid #e2e4e9;
      width: 50%;
      flex-shrink: 0;
      flex-grow: 0;
      height: 100%;

      .tool-bar {
        height: 38px;
        line-height: 38px;
        padding: 0 16px;
        box-shadow: 0px 3px 8px 0px rgba(5, 18, 30, 0.08);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        background-color: #fff;

        >div {
          flex: 1;
          text-align: center;

          &:last-child {
            text-align: right;
          }
        }

        .name {
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .number {
          padding: 0 8px;

          >span {
            color: #8492A6;
          }
        }

        .svg-icon {
          font-size: 12px;
          margin: 0 6px;
          cursor: pointer;

          &.big-icon, &.dis-icon {
            font-size: 15px;
            margin: 0 4px;
          }

          &.dis-icon {
            cursor: default;
          }
        }
      }

      .document-layout {
        overflow: hidden;
        height: calc(100% - 78px);
        margin: 20px 16px;
        display: flex;
        justify-content: center;
        align-items: center;

        .document {
          // transform-origin: 0 0;
          background-size: contain;
          position: relative;
          // cursor: url('../image/手势-张开.svg'), grab;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;

          &.transition {
            transition: all 0.3s;
          }

          >img {
            // position: absolute;
            // top: 0;
            width: 100%;
            pointer-events: none;
            user-select: none;
          }

          &.draggable {
            // cursor: url('../iamge/手势-握紧.svg'), grabbing;
          }

          // transition: all 0.3s linear;
          .frame-mask {
            position: absolute;
            cursor: pointer;
            pointer-events: none;

            &.active, &:hover {
              background: rgba(8, 135, 255, 0.1);
              border: 1px solid #0887ff;
              border-radius: 4px;
            }
          }
        }
      }
    }

    .drag-view {
      width: 8px;
      // height: 30px;
      flex-shrink: 0;
      flex-grow: 0;
      cursor: col-resize;
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;

      &:after {
        content: '';
        width: 100%;
        height: 30px;
        background-image: repeating-linear-gradient(
          to bottom,
          #E5E7EC 0px,
          #E5E7EC 1px,
          transparent 1px,
          transparent 4px
        );
      }
    }

    .ocr-result {
      * {
        user-select: text;
      }

      border: 1px solid #0887ff;
      flex-shrink: 1;
      flex-grow: 1;
      padding: 0 16px;
      background: #f7fbff;
      position: relative;
      height: 100%;

      .border-corner {
        position: absolute;
        height: 20px;
        width: 20px;
        border: 4px solid #0887FF;

        &.border-corner-1 {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        &.border-corner-2 {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        &.border-corner-3 {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        &.border-corner-4 {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }
      }

      .ocr-title-bar {
        display: flex;
        height: 58px;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;

        .svg-icon {
          margin-right: 8px;

          &.download {
            margin-right: 4px;
          }
        }

        .ocr-title {
          font-weight: 600;
        }

        span {
          vertical-align: middle;
        }
      }

      .ocr-text {
        &::-webkit-scrollbar {
          width: 4px;
          height: 6px;
        }

        // 滚动区域背景
        &::-webkit-scrollbar-track-piece {
          background-color: #f7fbff;
          -webkit-border-radius: 6px;
        }

        // 竖向滚动条
        &::-webkit-scrollbar-thumb:vertical {
          background-color: rgba(32, 45, 64, 0.5);
          -webkit-border-radius: 2px;
        }

        border: 1px solid #e3e8f0;
        height: calc(100% - 74px);
        overflow: auto;
        padding: 12px 8px;
        background: #fff;
        position: relative;

        .text {
          line-height: 26px;
          padding: 0 8px;
          border: 1px solid #fff;

          &:not(:last-child) {
            margin-bottom: 8px;
          }

          &:hover {
            background: #f6f9fb;
            cursor: pointer;
          }

          &.not-point:hover {
            background: #fff;
            cursor: default;
          }

          &.active {
            background: rgba(8, 135, 255, 0.1);
            border: 1px solid #0887ff;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
