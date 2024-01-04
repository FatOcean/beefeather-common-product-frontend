<template>
  <ocr-layout
    @resetId="() => (activeTextId = null)"
    @reRenderImage="reRenderImage"
    @tabs="tabs"
    :data="data"
    ref="documents"
    :activeTabIndex="activeTabIndex"
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
    <div class="tool-bar">
      <div class="name">
        <div>
          <span style="color: #8492a6; margin-right: 8px">印章类型</span>
          <span style="font-weight: bold">{{ sealName }}</span>
        </div>
      </div>
      <div>
        <svg-icon
          iconClass="放大"
          @click.native="handleZoom(zoomStep)"
        ></svg-icon>
        <svg-icon
          iconClass="ic-缩小"
          @click.native="handleZoom(-zoomStep)"
        ></svg-icon>
        <svg-icon iconClass="旋转" @click.native="handleClickRotate"></svg-icon>
        <svg-icon iconClass="还原" @click.native="resetProps"></svg-icon>
        <svg-icon
          iconClass="全屏"
          @click.native="
            showImageViewer = true;
            postFixedMessage(true);
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
        :class="{ draggable: draggable }"
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
          transformOrigin: page.transformOrigin,
        }"
      >
        <img :src="imageUrl" :alt="imageName" />
      </div>
    </div>
    <lls-image-viewer
      v-if="showImageViewer"
      :urlList="urlList"
      :on-close="
        () => {
          showImageViewer = false;
          postFixedMessage(false);
        }
      "
    ></lls-image-viewer>
  </ocr-layout>
</template>
<script>
import { staticData } from '../staticData'
import beeLoading from '@linklogis/beeLoading'
import ImageViewer from '@linklogis/image-viewer'
import ocrLayout from './ocr-layout.vue'
import { mapState } from 'vuex'
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
  data() {
    return {
      isLoading: false,
      data: staticData.seal_detection,
      zoomStep: 0.1,
      scale: 1,
      zoomScale: 1,
      activePageIndex: 1,
      rotateIndex: 0,
      dragX: 0, // x方向拖动距离
      dragY: 0, // y方向拖动距离
      moveX: 0, // x方向平移距离
      moveY: 0, // y方向平移距离
      initTranslateY: 0, // 初始位移数据
      showImageViewer: false,
      draggable: false,
      files: [],
      activeTextId: '',
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      token: window.sessionStorage.getItem('token'),
      origin: window.sessionStorage.getItem('origin'),
      href: window.location.href,
      search: '',
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      realRenderHeight: 0,
      realRenderWidth: 0
    }
  },
  // props: {
  //   data: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  components: {
    [beeLoading.name]: beeLoading,
    [ImageViewer.name]: ImageViewer,
    ocrLayout
  },
  created() {
    this.documents = this.data[0]
    this.tabsArray = this.data[0].content.map((item, index) => {
      return {
        name: `印章${index + 1}`,
        index: index
      }
    })
    this.activeName = this.tabsArray[0].name
    this.activeTabIndex = 0
  },
  mounted() {
    this.resizeImg()
    this.$events = new Events()
    this.$events.listen('drag-document', this.transferDocument)
  },
  beforeDestroy() {
    this.$events.remove('drag-document', this.transferDocument)

    this.resizeObserver.disconnect()
  },
  computed: {
    ...mapState(['pageMenuPerm']),
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    },
    imgHeight() {
      return this.activeImage.realRenderHeight
    },
    example() {
      return this.data[this.activeDocumentIndex]
    },
    imageUrl() {
      return this.activeImage?.sealImage
    },
    activeImage() {
      return this.example.content[this.activeTabIndex]
    },
    imageName() {
      return this.activeImage?.sealName
    },
    sealName() {
      return this.activeImage?.sealType
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
      return this.data[this.activeDocumentIndex].content.map((item) => {
        return {
          url: item.sealImage,
          title: item.sealName
        }
      })
      // return [{ url: this.imageUrl, title: this.imageName }];
    }
  },
  methods: {
    uploadFileData(res) {
      res.data[0]?.content?.length && this.resizeImg()
      this.tabsArray = res.data[0].content.map((item, index) => {
        return {
          name: `印章${index + 1}`,
          index: index
        }
      })
      this.activeName = this.tabsArray[0]?.name
      res.data.forEach((i) => {
        i.isUpload = true
        i.imagePath = `${this.originLocation}?filename=${i.imagePath}`
      })
      res.data[0].content.forEach((item) => {
        item.sealImage = `${this.originLocation}?filename=${item.sealImage}`
      })
      if (this.data.length > 2) this.data.shift()
      this.data = res.data
      // this.data.splice(0, this.data.length > 2 ? 1 : 0,res.data[0]);

      this.documents = this.data[0]
      this.documents.requestId = res.traceId
      this.activeDocumentIndex = 0
      this.activeTabIndex = 0
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
    postFixedMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: 'messageGeneralProduct',
          fixed: fixed
        },
        '*'
      )
    },
    reRenderImage() {
      const vm = this
      this.data.forEach((document) => {
        document.content.forEach((page) => {
          const widthScale =
            (this.$refs.documentLayout.clientWidth - 32) / +page.width
          const heightScale =
            (this.$refs.documentLayout.clientHeight - 40) / +page.height
          page.scale = widthScale < heightScale ? widthScale : heightScale
          page.realRenderWidth = page.width * page.scale // 图片实际渲染宽度
          page.realRenderHeight = +page.height * page.scale // 图片实际渲染高度
        })
      })
      this.updateTranslateY()
      const page =
        this.data[this.activeDocumentIndex].content[this.activeTabIndex]
      this.realRenderHeight = page.realRenderHeight
      this.realRenderWidth = page.realRenderWidth
      vm.scale = page.scale
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
      this.resetProps()
      this.resizeImg()
      this.tabsArray = this.data[activeDocumentIndex].content.map(
        (item, index) => {
          return {
            name: `印章${index + 1}`,
            index: index
          }
        }
      )
      this.activeTabIndex = 0
      this.activeName = this.tabsArray[activePageIndex].name
      this.$refs.documents.handleClick(0, false)
    },
    removeEventListener(e, elName, w) {
      window.removeEventListener('mousemove', this[`${elName}Mousemove`])
      window.removeEventListener('mouseup', this.removeEventListener)
      this.draggable = false
    },
    handleClick(value) {
      this.resetProps()
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.setRectangle(value.index)
      this.$refs.documents.handleClick()
      this.reRenderImage()
    },
    // 样本收集点击事件
    clickHandler(e, i, noParent) {
      const el = e.target.parentNode.firstChild

      if (!i.startX || !i.startY || !i.width || !i.height) {
        this.$refs.documents.resetProps()
        this.activeTextId = i.id
        return
      }
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        id: i.id
        // imageIndex: i.imageIndex,
      })
      this.activeTextId = this.$refs.documents.activeTextId
      // console.log(this.activeTextId, "activeTextId");
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false
      }, 200)
    }
  }
}
</script>
<style lang="stylus" scoped>
.tool-bar {
  height: 38px;
  line-height: 38px;
  padding: 0 16px;
  box-shadow: 0px 3px 8px 0px rgba(5, 18, 30, 0.08);
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;

  > div {
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
    width: 40px;

    ::v-deep .lls-input__inner {
      width: 20px;
      position: relative;
      left: -8px;
      border: none;
      border-bottom: 1px solid #e3e8f0;
      height: 14px;
      padding: 0;
      border-radius: 0;
      text-align: center;

      &:focus {
        border-color: #0887ff;
      }
    }

    span {
      font-size: 12px;
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
  border: 1px solid #e3e8f0;
  overflow: hidden;
  height: calc(100% - 90px);
  padding: 20px 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  .document {
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

</style>
<style lang="stylus">
 .ocr-text {
  ::v-deep .lls-tabs__active-bar {
    margin-left: 0px !important;
  }
}
</style>
