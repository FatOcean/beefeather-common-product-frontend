<template>
  <div class="seal-removal-wrapper" style="width: 100%">
    <ocrlayout
      @tabs="tabs"
      :data="data"
      ref="documents"
      :activeTabIndex="activeTabIndex"
      :pageMenuPerm="pageMenuPerm"
    >
      <div class="tool-bar">
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
        ref="documentLayout"
        @mousewheel="handleZoom"
        @mouseleave="
          (e) => {
            removeEventListener(e, 'drag-document-parent');
          }
        "
      >
        <div
          class="document"
          ref="drag-document-parent"
          :key="example.id"
          :class="{ draggable: draggable }"
          @mousedown="
            (e) => {
              handleMousedown(e, 'drag-document-parent');
            }
          "
          :style="{
            height: `${realRenderHeight}px`,
            width: hwFlag && `${realRenderWidth}px`,
            transform: `rotate(${90 * rotateIndex}deg) translateY(${
              page.translateY + moveY
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
        </div>
      </div>
      <showImg
        v-if="showImageViewer"
        :urlList="urlList"
        @close="showImageViewer = false"
      ></showImg>
    </ocrlayout>
  </div>
</template>
<script>
import { staticData } from '../staticData'
import ocrlayout from './ocr-layout'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      staticData,
      data: staticData.seal_removal,
      isLoading: false,
      zoomStep: 0.1,
      scale: 1,
      zoomScale: 1,
      rotateIndex: 0,
      dragX: 0, // x方向拖动距离
      dragY: 0, // y方向拖动距离
      moveX: 0, // x方向平移距离
      moveY: 0, // y方向平移距离
      initTranslateY: 0, // 初始位移数据
      showImageViewer: false,
      draggable: false,
      activeDocumentIndex: 0,
      documents: [],
      activeTabIndex: 0,
      realRenderHeight: 0,
      realRenderWidth: 0
    }
  },
  components: {
    ocrlayout
  },
  created() {
    // console.log(this.data, "data");
    this.documents = this.data[0]
  },
  mounted() {
    this.resizeImg()
    this.$events.listen('drag-document-parent', this.transferDocument)
  },
  beforeDestroy() {
    this.$events.remove('drag-document-parent', this.transferDocument)

    this.resizeObserver.disconnect()
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    originalLocation() {
      return `${window.location.origin}/file-handle-web/file/image`
    },
    example() {
      return this.data[this.activeDocumentIndex]
    },
    imageUrl() {
      return this.data[this.activeDocumentIndex].content[0]
    },
    hwFlag() {
      //   return this.data[this.activeDocumentIndex].imageVO[1].hwFlag
      return true
    },
    imageName() {
      return this.data[this.activeDocumentIndex].fileName
    },
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
    urlList() {
      return [{ url: this.imageUrl, title: this.imageName }]
    }
  },
  methods: {
    uploadFileData(res) {
      const data = res.data
      data.forEach((i) => {
        i.isUpload = true
        i.starsFlag = false
        i.imagePath = `${this.originalLocation}?filename=${i.imagePath}`
        i.content[0] = `${this.originalLocation}?filename=${i.content[0]}`
        // if (i.imageVO[1] && i.imageVO[1].height && i.imageVO[1].width) { i.imageVO[1].hwFlag = i.imageVO[1].height > i.imageVO[1].width }
      })
      this.activeDocumentIndex = 0
      if (this.data.length > 2) this.data.shift()
      this.data = data
      this.documents = this.data[0]
      this.resizeImg()
    },
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun)
        node.addEventListener(event, fun, false)
      } else {
        node.detachEvent('on' + event, fun)
        node.attachEvent('on' + event, fun.call())
      }
    },
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
      e.preventDefault && e.preventDefault()
      return false
    },
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
    },

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
    calculateDragDis(offset) {
      const disX = offset.offsetX - this.offsetX
      const disY = offset.offsetY - this.offsetY
      this.$events.trigger(offset.elName, { disX, disY })
      this.offsetX = offset.offsetX
      this.offsetY = offset.offsetY
    },
    resetProps() {
      this.rotateIndex = 0
      this.zoomScale = 1
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.updateTranslateY()
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
    proxy(fun, args) {
      if (this.proxying) return
      this.proxying = true
      window.requestAnimationFrame((_) => {
        fun.call(this, args)
        this.proxying = false
      })
    },
    reRenderImage() {
      this.data.forEach((document) => {
        const page = {}
        const vm = this
        const img = new Image()
        img.src = document.content[0]
        console.log(document.content[0])
        img.onload = function () {
          page.width = img.width // 图片原始宽度
          page.height = img.height // 图片原始高度
          page.scale =
            page.height > page.width
              ? vm.documentHeight / +page.height
              : vm.documentWidth / +page.width // 初始图片缩放比例
          page.realRenderHeight = +page.height * page.scale // 图片实际渲染高度
          if (page.realRenderHeight > vm.documentHeight) {
            page.realRenderHeight = vm.documentHeight
            page.scale = vm.documentHeight / +page.height
          }
          page.realRenderWidth = +page.width * page.scale // 图片实际渲染宽度
          vm.realRenderHeight = page.realRenderHeight
          vm.realRenderWidth = page.realRenderWidth
          vm.scale = page.scale
          // page.initTranslateY = (page.realRenderHeight - vm.documentHeight) / 2; // 图片实际渲染高度
        }
      })
    },
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
    tabs(activeDocumentIndex, activePageIndex) {
      this.activeDocumentIndex = activeDocumentIndex
      this.documents = this.data[activeDocumentIndex]
      this.$refs.documents.selectValue = this.documents.fileName
        .substring(this.documents.fileName.lastIndexOf('.') + 1)
        .toUpperCase()
        .trim()
      this.resetProps()
      this.resizeImg()
    },
    removeEventListener(e, elName, w) {
      // console.log(elName);
      // const el = this.$refs[elName];

      window.removeEventListener('mousemove', this[`${elName}Mousemove`])
      window.removeEventListener('mouseup', this.removeEventListener)
      // this[`${elName}Mousemove`] = null;
      this.draggable = false
    },
    handleClick(value) {
      // console.log(value.index);
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.handleClick(value.index)
    }
  }
}
</script>
<style lang="stylus" scoped>
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
    cursor: url('~@/assets/images/icon/手势-张开.svg'), grab;
    background-repeat: no-repeat;
    width: 100%;

    >img {
      position: absolute;
      top: 0;
      width: 100%;
      pointer-events: none;
      user-select: none;
    }

    &.draggable {
      cursor: url('~@/assets/images/icon/手势-握紧.svg'), grabbing;
    }

    .frame-mask {
      position: absolute;
      cursor: pointer;
      pointer-events: none;

      &.active, &:hover {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #009688;
        border-radius: 4px;
      }
    }
  }
}

.tool-bar {
  height: 36px;
  padding: 0 16px;
  margin-left: -12px;
  margin-right: -8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  box-shadow: 0px 3px 8px 0px rgba(5, 18, 30, 0.08);

  div {
    max-width: 33%;
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }

  .svg-icon {
    margin: 0 6px;
    cursor: pointer;

    &.big-icon, &.dis-icon {
      margin: 0 4px;
    }
  }
}
</style>
