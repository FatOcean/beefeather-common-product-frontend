script<template>
  <div class="ocr-layout">
    <!-- 示例区-缩略图 -->
    <!-- ocr -->
    <div class="ocr-inner" style="width: 100%">
      <!-- 文档 -->
      <div class="document-box" ref="document-box">
        <div class="tool-bar">
          <div class="name">
            <lls-tooltip
              effect="dark"
              :content="imageName"
              placement="bottom-start"
            >
              <span>{{ imageName }}</span>
            </lls-tooltip>
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
            <svg-icon iconClass="ic-恢复默认" @click.native="reset"></svg-icon>
            <svg-icon
              iconClass="ic-全屏"
              @click.native="
                showImageViewer = true;
              "
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
              @load="loadImage"
            />
            <svg
              class="svg-seal"
              :height="realRenderHeight"
              :width="realRenderWidth"
            >
              <!-- <polygon
                ref="svg-polygon"
                :points="svgPosition"
                style="fill:rgba(8,135,255,0.1);stroke:#0887FF;stroke-width:2"
              />-->
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

      <div class="ocr-result" ref="ocrResult">
        <rightTab ref="rightTab" :codeTest="codeTest" :isImgdownload="true"> <slot></slot></rightTab>
      </div>
      <lls-collapse-transition>
        <upload-File @uploadFileData="$parent.uploadFileData" :fileTypes="['jpg', 'png', 'jpeg', 'bmp']"></upload-File>
      </lls-collapse-transition>
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
    prop: 'value'
  },
  props: {
    data: {
      // 文档数组
      type: Array,
      required: true,
      default: () => []
    },
    activeTabIndex: {
      type: Number
    },
    pageMenuPerm: Object
  },
  data() {
    return {
      rectanglePosition: '',
      selectValue: '',
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
      transition: false,
      scale: 1,
      total: 1,
      suffix: '',
      baseWidth: 0,
      codeTest: '',
      productObj: {
        name: '印章检测',
        staticName: 'seal_detection'
      }
    }
  },
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    this.resizeImg()
    this.setSelectValue()

    // 兼容firefox
    this.bind(this.$refs.documentLayout, 'DOMMouseScroll', this.handleZoom)

    this.$events.listen('click-ocr-el', this.handleClickText)
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
    loadImage(index) {
      this.example.content.length && this.setRectangle(this.activeTabIndex)
    },
    handleCommand(command) {
      this.handleClickDownload(command)
    },
    setRectangle(index = 0) {
      const page = this.data[this.activeDocumentIndex]
      const rectangle = page.content[index].position
      this.rectanglePosition = rectangle.reduce((total, cur) => {
        const str = (total +=
          `${cur.x * page.scale},${cur.y * page.scale}` + ' ')
        return str
      }, '')
    },
    inputChange() {
      // 输入页码
      if (this.activePageIndex > this.total) {
        this.activePageIndex = this.total
      }
      if (this.activePageIndex < 1) {
        this.activePageIndex = 1
      }
      this.resizeImg()
      // this.$emit("handle-change", page);
      this.$emit('tabs', this.activeDocumentIndex, this.activePageIndex - 1)
    },
    handleClick(index, falg = true) {
      this.setSelectValue()
      falg && this.moveImage()
    },
    moveImage() {
      this.$nextTick(() => {
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
          startX < 0 ||
          startY < 0 ||
          startX > this.documentWidth ||
          startY > this.documentHeight
        ) {
          let disX = 0
          let disY = 0
          if (startX < 0) {
            disX = -startX + this.documentWidth / 2
          }
          if (startY < 0) {
            disY = -startY + this.documentHeight / 2
          }
          if (startX > this.documentWidth) {
            disX = this.documentWidth / 2 - startX
          }
          if (startY > this.documentHeight) {
            disY = this.documentHeight / 2 - startY
          }
          this.transferDocument({ disX, disY })
          this.transition = true
          let index = 0
          this.timer = window.setInterval((_) => {
            index++
            if (index === 10) {
              clearInterval(this.timer)
              this.transition = false
            }
          }, 30)
        } else {
        }
      })
    },
    setSelectValue() {
      this.selectValue = this.example.fileName
        .substring(this.example.fileName.lastIndexOf('.') + 1)
        .toUpperCase()
        .trim()
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
          this.baseWidth = this.realRenderWidth
        })
      })
      this.resizeObserver.observe(el)
    },
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data.forEach((page) => {
        const vm = this
        page.scale = vm.documentWidth / +page.width
        page.realRenderHeight = +page.height * page.scale // 图片实际渲染高度
        if (page.realRenderHeight > vm.documentHeight) {
          page.realRenderHeight = vm.documentHeight
          page.scale = vm.documentHeight / +page.height
        }
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
      this.realRenderHeight = page.realRenderHeight
      this.realRenderWidth = page.realRenderWidth
      this.scale = page.scale
      this.handleClick(this.activeTabIndex, false)
    },
    // 切换示例
    handleClickExample(index) {
      if (this.activeDocumentIndex === index) {
        return
      }
      this.activeDocumentIndex = index
      this.resetProps()
      this.resizeImg()
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
          this.activePageIndex = 1
        } else {
          this.activeDocumentIndex -= 1
          this.activePageIndex = 1
        }
      } else {
        this.activePageIndex = num + 1
      }

      this.resizeImg()
      this.$emit('tabs', this.activeDocumentIndex, this.activePageIndex - 1)
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
      // this.calculateXy();
    },
    // 移动两侧视口
    transferView({ disX, disY }) {
      this.viewX += disX
      const windowWidth = window.innerWidth
      if (this.viewX > windowWidth * 0.12) {
        this.viewX = windowWidth * 0.12
      }
      if (this.viewX < -windowWidth * 0.12) {
        this.viewX = -windowWidth * 0.12
      }
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX + 8}px)`
      this.$refs['document-box'].style.width = `calc(50% + ${this.viewX}px)`
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth
        this.documentHeight = this.$refs.documentLayout.clientHeight
        this.reRenderImage()
        this.$emit('reRenderImage')
      })
    },
    // 激活文本
    handleClickText({ el, id }) {
      this.activeEl = el
      this.activeTextId = id
      this.calculateXy()
    },
    // 计算path起点、终点坐标
    calculateXy() {
      this.setRectangle(this.activeTabIndex)
      if (this.activeTextId == null) {
        return
      }
      const activeTextId = this.activeTextId
      const page = this.page
      const rotateIndex = this.rotateIndex
      const zoomScale = this.zoomScale || 1
      this.$nextTick((_) => {
        const // maskValue = page.tableData[activeTextId],
          maskEl = this.$refs[`maskEl${activeTextId}`][0]
        const documentLayout = this.$refs.documentLayout
        const ocrTextWrapper = this.$refs.ocrTextWrapper
        const maskElRect = maskEl.getBoundingClientRect()
        const documentLayoutRect = documentLayout.getBoundingClientRect()
        const lY = documentLayoutRect.top
        const lX = documentLayoutRect.left
        const mY = maskElRect.top
        const mX = maskElRect.right
        const startX = mX - lX
        const startY = mY - lY
        const offsetTop = this.activeEl.offsetTop + 69
        const offsetLeft = this.activeEl.offsetLeft
        const scrollTop = ocrTextWrapper.scrollTop
        const pathEndX = this.documentWidth + offsetLeft + 52
        const pathEndY = offsetTop - scrollTop + this.activeEl.clientHeight / 2
        const scale = page.rotateScale * zoomScale * this.imgScale
        const w = this.text.width
        const h = this.text.height
        // const Q = this.text.deg
        // const leanX = (scale * w * Math.sin((2 * Math.PI * Q) / 360)) / 2

        let x = startX
        let y = startY + (h * scale) / 2

        if (rotateIndex % 4 === 1) {
          // x = startX + leanX;
          y = startY + (w * scale) / 2
        }
        if (rotateIndex % 4 === 2) {
          // x = startX;
          y = startY + (h * scale) / 2
        }
        if (rotateIndex % 4 === 3) {
          // x = startX + leanX;
          y = startY + (w * scale) / 2
        }

        // 处理边界
        if (x > this.documentWidth) {
          x = this.documentWidth
        }
        // if (y > this.documentHeight) {
        //   y = this.documentHeight;
        // }

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
      this.rectanglePosition = ''
      this.zoomScale = 1
      this.pathValue = null
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.updateTranslateY()
      this.$emit('resetId')
    },
    reset() {
      this.rotateIndex = 0
      this.activePageIndex = 1
      this.activeTextId = null
      this.zoomScale = 1
      this.pathValue = null
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
    },
    // 下载识别结果
    handleClickDownload(type) {
      let path
      if (this.example.show) {
        const newType = type.toLowerCase()
        path =
          this.example.pathName === '示例一'
            ? `zip/${newType}/示例一.zip`
            : `zip/${newType}/示例二.${newType}`
      } else {
        path = `${this.example.sealPath}${this.example.fileName}`
      }

      this.$http({
        method: 'get',
        url: `/general-product-web/general/downloadResult?taskId=${
          this.example.index
        }&productName=印章检测&path=${encodeURIComponent(
          path
        )}&type=${type}&show=${this.example.show || false}`,
        responseType: 'blob'
      })
        .then((res) => {
          const fileName =
            res.headers['content-disposition'] &&
            res.headers['content-disposition']
              .split(';')[1]
              .split('filename=')[1]
              .replace(/"/gi, '')
          // console.log(fileName);
          const blob = res.data
          const type =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'
          this.exportByBlob(blob, decodeURIComponent(fileName), type)
        })
        .catch((error) => {
          console.log(error)
          // this.$message({
          //   message: error.data.message,
          //   type: "error",
          // });
        })
    }
  },
  computed: {
    // 当前示例信息
    example() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.codeTest = JSON.stringify(this.data[this.activeDocumentIndex].json || '')
      return this.data[this.activeDocumentIndex]
    },
    // 总页数
    // total() {
    //   return this.data[this.activeDocumentIndex].images[this.activeTabIndex]
    //     .length;
    // },
    // 当前页面信息
    page() {
      const translateX = 0
      const translateY = 0
      const rotateScale = 1
      const page = {
        ...this.example,
        taskId: this.example.taskId,
        translateX,
        translateY,
        rotateScale // 旋转导致的缩放比例
      }
      return page
    },
    // pageDetail() {
    //   return this.page.value[this.activeTabIndex].identityList;
    // },
    // 文档图片地址
    imageUrl() {
      return this.data[this.activeDocumentIndex].imagePath
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
    // 当前图片初始缩放比例
    imgScale() {
      return this.scale
    },
    deltaWidth() {
      return Math.abs(this.realRenderWidth - this.baseWidth) + 5
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../ocr-layout/ocr-layout.styl';

.svg-seal {
  pointer-events: none;
  position: absolute;
  z-index: 1;
}
</style>
<style lang="stylus">
.ocr-text {
  ::v-deep .lls-tabs__active-bar {
    margin-left: 0px !important;
  }
}
</style>
