<template>
  <div class="seal-removal-wrapper">
    <ocrlayout
      @resetId="() => (activeTextId = null)"
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
            @click.native="
              showImageViewer = true;
              postFixedMessage(true);
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
          :key="example.id"
          :class="{ draggable: draggable }"
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
          <!-- <div
              class="frame-mask"
              :data-id="i.id"
              :class="{ active: activeTextId === i.id }"
              v-for="(i, index) in pageDetail"
              :ref="`maskEl${i.id}`"
              :key="i.key"
              :style="{
                top: `${i.startY * imgScale}px`,
                left: `${i.startX * imgScale}px`,
                height: `${i.height * imgScale}px`,
                width: `${i.width * imgScale}px`,
                transform: `rotate(${i.deg}deg)`,
              }"
            ></div> -->
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
    </ocrlayout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      @click="clickSampleCollection"
      v-show="documents.isUpload"
      v-loading="isLoading"
    >
      <svg-icon
        :iconClass="documents.starsFlag ? '星星填充' : '星星'"
      ></svg-icon>
      <span>{{ documents.starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['UPLSEALREM']">
      <upload-File
        productName="印章去除"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import { data } from "./defaultData";
import beeLoading from "@linklogis/beeLoading";
import ImageViewer from "@linklogis/image-viewer";
import ocrlayout from "./ocr-layout";
import { mapState } from "vuex";
function Events() {
  this.clientList = {};
  this.listen = function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  };
  this.trigger = function () {
    const key = Array.prototype.shift.call(arguments);
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return;
    }
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
  };
  this.remove = function (key, fn) {
    const fns = this.clientList[key];
    if (!fns) {
      return;
    }
    if (!fn) {
      fns.length = 0;
    } else {
      for (let len = fns.length - 1; len >= 0; len--) {
        const _fn = fns[len];
        if (_fn === fn) {
          fns.splice(len, 1);
        }
      }
    }
  };
}

export default {
  data() {
    return {
      data,
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
      files: [],
      activeTextId: "",

      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: "",
      servicePortAddress: "",
      activeDocumentIndex: 0,
      tabsArray: [],
      documents: [],
      // documents: data.analysisResult,
      dragenter: false,
      token: window.sessionStorage.getItem("token"),
      origin: window.sessionStorage.getItem("origin"),
      href: window.location.href,
      search: "",
      documents_backup: [],
      checked: false,
      hideResult: [],
      activeTabIndex: 0,
      realRenderHeight: 0,
      realRenderWidth: 0,
      scale: 1,
      handling: false,
      // pageMenuPerm: {
      //   COLSEALREM: true,
      //   DOWSEALREM: true,
      //   SERSEALREM: true,
      //   UPLSEALREM: true,
      // },
    };
  },
  components: {
    [beeLoading.name]: beeLoading,
    [ImageViewer.name]: ImageViewer,
    ocrlayout,
  },
  created() {
    // console.log(this.data, "data");
    this.documents = this.data[0];

    // console.log(this.documents, "documents");
    // this.page = this.documents.analysisResult
    // console.log(this.page, "page");
    // const frontHash = { 身份证正面: 0 };
    // const backHash = { 身份证反面: 0 };
    // for (let i = 0; i < this.page.length; i++) {
    //   this.tabsArray[i] = { name: this.page[i].analysisName }
    // }
    // if (this.tabsArray[i].name === "身份证正面") {
    //   frontHash["身份证正面"]++;
    // } else {
    //   backHash["身份证反面"]++;
    // }
    // if (frontHash["身份证正面"] === 1) {
    // } else {
    //   let num = 1;
    //   this.tabsArray.forEach((item) => {
    //     if (item.name === "身份证正面") {
    //       item.name += `${num}`;
    //       num++;
    //     }
    //   });
    // }
    // if (backHash["身份证反面"] === 1) {
    // } else {
    //   let num = 1;
    //   this.tabsArray.forEach((item) => {
    //     if (item.name === "身份证反面") {
    //       item.name += `${num}`;
    //       num++;
    //     }
    //   });
    // }

    // this.tabsArray = this.page.map((item) => {
    //   return {
    //     name: item.imageType,
    //   };
    // });
    // console.log(this.tabsArray, "tabsArray");
    // this.tabsArray.forEach((item) => {
    //   this.page.forEach(i => {
    //     if()
    //   })
    // })
    // this.activeName = this.tabsArray[0].name
    // console.log(this.activeName, "activeName");
    // console.log(this.data, "data");
    // this.getServiceName();
    // console.log(this.example, "example");
  },
  mounted() {
    this.resizeImg();
    this.$events = new Events();
    this.$events.listen("drag-document", this.transferDocument);
  },
  beforeDestroy() {
    this.$events.remove("drag-document", this.transferDocument);

    this.resizeObserver.disconnect();
  },
  computed: {
    ...mapState(["pageMenuPerm"]),
    // pageDetail() {
    //   return this.page[this.activeTabIndex].identityList;
    // },
    originalLocation() {
      return `${window.location.origin}/file-handle-web/file/image?filename=`;
    },
    example() {
      return this.data[this.activeDocumentIndex];
    },
    imageUrl() {
      return this.data[this.activeDocumentIndex].imageVO[1].image
        ? this.data[this.activeDocumentIndex].imageVO[1].image
        : this.originalLocation +
            encodeURIComponent(
              this.data[this.activeDocumentIndex].imageVO[1].filePath
            );
    },
    imageName() {
      return this.data[this.activeDocumentIndex].fileName;
    },
    page() {
      const translateX = 0;
      const translateY = 0;
      const rotateScale = 1;
      const page = {
        value: this.value,
        translateX,
        translateY,
        rotateScale, // 旋转导致的缩放比例
      };
      return page;
    },
    urlList() {
      return [{ url: this.imageUrl, title: this.imageName }];
    },
  },
  methods: {
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun);
        node.addEventListener(event, fun, false);
      } else {
        node.detachEvent("on" + event, fun);
        node.attachEvent("on" + event, fun.call(obj));
      }
    },
    handleZoom(e) {
      this.initTranslateY = 0;
      let scale = this.zoomScale;
      let scrollDis;
      if (typeof e === "number") {
        scale += e;
      } else {
        e = e || window.event;
        if (!e) return;
        scrollDis = Math.ceil(e.wheelDelta ? e.wheelDelta / 10 : -e.detail * 6);
        scale += scrollDis > 0 ? this.zoomStep : -this.zoomStep;
      }
      if (scale < 0.3) {
        scale = 0.3;
      }
      if (scale > 3) {
        scale = 3;
      }
      this.zoomScale = scale;
      e.preventDefault && e.preventDefault();
      return false;
    },
    transferDocument({ disX, disY }) {
      this.dragX += disX;
      this.dragY += disY;
      this.moveX = this.dragX;
      this.moveY = this.dragY;
      if (this.rotateIndex % 4 === 1) {
        this.moveX = this.dragY;
        this.moveY = -this.dragX;
      }
      if (this.rotateIndex % 4 === 2) {
        this.moveX = -this.dragX;
        this.moveY = -this.dragY;
      }
      if (this.rotateIndex % 4 === 3) {
        this.moveX = -this.dragY;
        this.moveY = this.dragX;
      }
    },

    handleClickRotate() {
      this.rotateIndex++;
      this.moveX = this.dragX;
      this.moveY = this.dragY;
      if (this.rotateIndex % 4 === 1) {
        this.moveX = this.dragY;
        this.moveY = -this.dragX;
      }
      if (this.rotateIndex % 4 === 2) {
        this.moveX = -this.dragX;
        this.moveY = -this.dragY;
      }
      if (this.rotateIndex % 4 === 3) {
        this.moveX = -this.dragY;
        this.moveY = this.dragX;
      }
      // this.dragX = 0;
      // this.dragY = 0;
      // this.moveX = 0;
      // this.moveY = 0;
      this.updateTranslateY();
    },

    handleMousedown(e, elName) {
      const el = this.$refs[elName];
      this.removeEventListener(e, elName);
      e = e || window.event;
      // if (e.target !== el) {
      //   return;
      // }
      this.offsetX = e.pageX;
      this.offsetY = e.pageY;
      window.addEventListener(
        "mousemove",
        (this[`${elName}Mousemove`] = (e) => {
          e = e || window.event;
          // const el = this.$refs[elName];
          this.proxy(this.calculateDragDis, {
            offsetX: e.pageX,
            offsetY: e.pageY,
            elName: elName,
          });
          el.removeEventListener("mousedown", this.handleMousedown);
          this.draggable = true;
          // console.log(e, elName, this[`${elName}Mousemove`]);
        })
      );
      window.addEventListener(
        "mouseup",
        this.removeEventListener.bind(this, e, elName)
      );
    },
    calculateDragDis(offset) {
      const disX = offset.offsetX - this.offsetX;
      const disY = offset.offsetY - this.offsetY;
      this.$events.trigger(offset.elName, { disX, disY });
      this.offsetX = offset.offsetX;
      this.offsetY = offset.offsetY;
    },
    resetProps() {
      this.rotateIndex = 0;
      this.zoomScale = 1;
      this.dragX = 0;
      this.dragY = 0;
      this.moveX = 0;
      this.moveY = 0;
      this.updateTranslateY();
    },
    resizeImg() {
      const el = this.$el;
      this.resizeObserver = new ResizeObserver((_) => {
        this.proxy((_) => {
          this.documentWidth = this.$refs.documentLayout.clientWidth;
          this.documentHeight = this.$refs.documentLayout.clientHeight;
          // console.log(this.documentWidth, this.documentHeight);
          // 初始化每张图片的宽高
          this.reRenderImage();
        });
      });
      this.resizeObserver.observe(el);
    },
    proxy(fun, args) {
      if (this.proxying) return;
      this.proxying = true;
      window.requestAnimationFrame((_) => {
        fun.call(this, args);
        this.proxying = false;
      });
    },
    postFixedMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageFromSealRemoval",
          fixed: fixed,
        },
        "*"
      );
    },
    getServiceName() {
      this.$http({
        url: "/seal-removal-web/identityCard/common//serviceList",
        method: "post",
        data: {
          name: "印章去除",
        },
      }).then((result) => {
        const res = result.data;
        if (res.code === "200") {
          this.servicePortAddress = res.data[0].servicePortAddress;
        } else {
          this.$message.error("请求错误");
        }
      });
    },
    reRenderImage() {
      this.data.forEach((document) => {
        const page = document.imageVO[1];
        const vm = this;
        // const img = new Image();
        // img.src = page.img;
        // img.onload = function () {
        // page.originalWidth = this.width // 图片原始宽度
        // page.originalHeight = this.height // 图片原始高度
        page.scale =
          page.height > page.width
            ? vm.documentHeight / +page.height
            : vm.documentWidth / +page.width; // 初始图片缩放比例
        let widthScale = 1;
        let heightScale = 1;
        if (page.realRenderHeight > vm.documentHeight) {
          page.realRenderHeight = vm.documentHeight;
          page.scale = vm.documentHeight / +page.height;
          heightScale = vm.documentHeight / +page.height;
        }
        if (page.realRenderWidth > vm.documentWidth) {
          page.realRenderWidth = vm.documentWidth;
          page.scale = vm.documentWidth / +page.width;
          widthScale = vm.documentWidth / +page.width;
        }
        // console.log(widthScale, heightScale, "111");
        page.realRenderHeight = +page.height * page.scale; // 图片实际渲染高度
        page.realRenderWidth = +page.width * page.scale; // 图片实际渲染宽度
        // page.initTranslateY = (page.realRenderHeight - vm.documentHeight) / 2; // 图片实际渲染高度
        // };
      });
      // console.log("render")
      // window.setTimeout((_) => {
      //   this.calculateXy()
      // })
      // this.$nextTick((_) => {
      //   this.calculateXy();
      // });
      this.updateTranslateY();
      const page = this.data[this.activeDocumentIndex].imageVO[0];
      // console.log(page, "page");
      const baseHeight = this.$refs["documents"].getBoundingClientRect().height;
      const newScale =
        page.realRenderHeight > 0.72 * baseHeight
          ? (0.72 * baseHeight) / page.realRenderHeight
          : 1;
      this.realRenderHeight = page.realRenderHeight * newScale;
      this.realRenderWidth = page.realRenderWidth * newScale;
      this.scale = page.scale * newScale;
    },
    updateTranslateY() {
      this.$nextTick((_) => {
        if (this.rotateIndex % 4 === 0 && this.zoomScale === 1) {
          this.initTranslateY = Math.max(
            (this.realRenderHeight - this.documentHeight) / 2,
            0
          );
        } else {
          this.initTranslateY = 0;
        }
      });
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.activeDocumentIndex = activeDocumentIndex;
      this.documents = this.data[activeDocumentIndex];
      this.$refs.documents.selectValue = this.documents.fileName
        .substring(this.documents.fileName.lastIndexOf(".") + 1)
        .toUpperCase()
        .trim();
      this.resetProps();
      this.resizeImg();
      // this.page = this.documents.analysisResult
      // console.log(this.page, "121312312321312312");
      // this.activeTabIndex = 0
      // this.tabsArray = []
      // for (let i = 0; i < this.page.length; i++) {
      //   this.tabsArray[i] = { name: this.page[i].analysisName, index: i }
      // }
      // this.activeName = this.tabsArray[activePageIndex].name

      // console.log(this.example, "ex2");
    },
    removeEventListener(e, elName, w) {
      // console.log(elName);
      // const el = this.$refs[elName];

      window.removeEventListener("mousemove", this[`${elName}Mousemove`]);
      window.removeEventListener("mouseup", this.removeEventListener);
      // this[`${elName}Mousemove`] = null;
      this.draggable = false;
    },
    handleClick(value) {
      // console.log(value.index);
      this.activeTabIndex = Number(value.index);
      this.$refs.documents.handleClick(value.index);
      // console.log(this.documents);
      // console.log(this.page);
      // this.tabsArray.forEach((item, index) => {
      //   if (item.name === value.name) {
      //     console.log(index);
      //     this.activeTabIndex = index;
      //     this.$refs.documents.handleClick(index);
      //   }
      // });
    },
    // 样本收集点击事件
    clickHandler(e, i, noParent) {
      const el = e.target.parentNode.firstChild;

      if (!i.startX || !i.startY || !i.width || !i.height) {
        this.$refs.documents.resetProps();
        this.activeTextId = i.id;
        return;
      }
      e = e || window.event;
      this.$refs.documents.$events.trigger("click-ocr-el", {
        el,
        id: i.id,
        // imageIndex: i.imageIndex,
      });
      this.activeTextId = this.$refs.documents.activeTextId;
      // console.log(this.activeTextId, "activeTextId");
    },
    clickSampleCollection() {
      if (this.isLoading) return;
      this.isLoading = true;
      const data = this.data[this.activeDocumentIndex];
      const picAddress = data.imagePath;
      this.handling = true;
      // console.log(data, '000')
      if (!data.starsFlag) {
        const fileId = data.id;
        this.$http
          .post("/general-product-web/hardCaseCollect/saveCollectInfo", {
            fileId,
            picAddress,
            productName: "印章去除",
            requestId: data.requestId,
          })
          .then((res) => {
            this.handling = false;
            if (res.data.code === "200") {
              // data.starsFlag = true;
              this.$set(data, "starsFlag", true);
              // console.log(data.starsFlag, "11111");
              // console.log(this.example.starsFlag, "111111111111");
              // this.page.starsFlag = true;
              this.data[this.activeDocumentIndex].loadRecordId =
                res.data.data.loadRecordId;
              this.$message({
                message: "样本收集成功",
                type: "success",
                offset: 72,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 72,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      } else {
        this.$http
          .post("/general-product-web/hardCaseCollect/cancelSaveCollectInfo", {
            loadRecordId: this.data[this.activeDocumentIndex].loadRecordId,
            url: picAddress,
            requestId: data.requestId,
          })
          .then((res) => {
            this.handling = false;
            if (res.data.code === "200") {
              // data.starsFlag = false;
              // this.data[this.activeDocumentIndex].starsFlag = false;

              data.starsFlag = false;

              // console.log(data.starsFlag, "22222");
              // console.log(this.example.starsFlag, "22222222222222");
              this.$message({
                message: "取消收集成功",
                type: "success",
                offset: 72,
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                offset: 72,
              });
            }
          })
          .finally((res) => {
            this.isLoading = false;
          });
      }
    },
    uploadFileData(res) {
      res.data.forEach((i) => {
        i.isUpload = true;
        i.starsFlag = false;
      });
      // res.data.forEach((i) => {
      //   i.starsFlag = false;
      // });
      // console.log(res, "res");
      this.activeDocumentIndex = 0;
      if (this.data.length > 2) this.data.shift();
      this.data = [...res.data, ...this.data];
      // this.data = res.data.concat(this.data);

      this.documents = this.data[0];
      this.$refs.documents.selectValue = this.documents.fileName
        .substring(this.documents.fileName.lastIndexOf(".") + 1)
        .toUpperCase()
        .trim();
      if (this.documents.imageVO.length === 1) {
        this.documents.imageVO.push({
          fileName: "",
          filePath: "",
        });
        this.$message({
          message: "解析失败",
          type: "error",
          offset: 72,
        });
      } else {
        this.$message({
          message: "上传成功",
          type: "success",
          offset: 72,
        });
      }
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false;
      }, 200);
    },
  },
};
</script>
<style lang="stylus">
.identify-data {
  .identify-header {
    display: flex;
    background: #F3F4F6;

    div {
      width: 50%;
      line-height: 40px;
      padding-left: 8px;
      border: 1px solid #E3E8F0;

      &:last-child {
        border-left: none;
      }
    }
  }

  .identify-content {
    .identify-content-top {
      display: flex;

      div {
        width: 50%;
        line-height: 40px;
        padding-left: 8px;
        border: 1px solid #E3E8F0;
        border-top: none;

        &:last-child {
          border-left: none;
        }
      }
    }

    .identify-content-other {
      border: 1px solid #E3E8F0;
      border-top: none;
      display: flex;
      box-sizing: border-box;

      .other-list {
        width: 50%;
        box-sizing: border-box;

        div {
          border-bottom: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }

      .other-left {
        align-content: center;
        width: 50%;
        box-sizing: border-box;
        display: flex;

        .other-info {
          border-bottom: 1px solid #E3E8F0;
          border-right: 1px solid #E3E8F0;
          border-left: 1px solid #E3E8F0;
          line-height: 40px;
          padding-left: 8px;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .lls-checkbox__label {
    padding-left: 4px;
    color: #202D40;
  }

  .lls-checkbox {
    margin-left: 32px;
  }

  .lls-checkbox__input.is-checked+.lls-checkbox__label {
    color: #202D40;
  }
}

.pre-line {
  white-space: pre-line;
}

.table-data {
  width: 100%;
  margin-bottom: 16px;

  tbody {
    tr {
      td {
        p {
          border-bottom: 1px solid #e3e8f0;
          white-space: pre-line;

          &:last-child {
            border: none;
          }
        }
      }
    }
  }

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
      .activeTd {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-right: none;
        border-left: none;
      }

      td:first-child {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-top-left-radius: 4px;
        border-right: none;
        border-bottom-left-radius: 4px;
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
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
    white-space: pre-line;
  }
}

.seal-removal-wrapper {
  // loadin 样式
  .analyzing {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    background: #000000;
    position: fixed !important;
    z-index: 999;
    left: 0;
  }

  // .checked {
  // position: absolute;
  // right: 0;
  // }

  // .function_bar {
  // display:flex,
  // flex-wrap:nowrap,
  // justify-content:space-between
  // }
  .sample-collection {
    width: 114px;
    position: fixed;
    right: -87px;
    bottom: 120px;
    transition: all 0.3s;
    cursor: pointer;
    padding: 12px;
    background: #0887ff;
    border-radius: 100px 0px 0px 100px;

    .lls-loading-spinner {
      margin-top: -10px;

      .circular {
        height: 21px;
        width: 21px;
      }
    }

    &:hover {
      right: 0px;
    }

    .svg-icon {
      font-size: 14px;
    }

    span {
      display: inline-block;
      width: 72px;
      color: #fff;
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .upload-wrapper {
    position: absolute;
    bottom: 0px;
    z-index: 9;

    .dragger-wrapper {
      width: 302px;
      height: initial;
      min-height: initial;
      background: #ffffff;
      border: 1px solid #b4dbff;
      border-radius: 16px 16px 0px 0px;
      box-shadow: 0px -3px 6px 0px rgba(5, 18, 30, 0.04);
      text-align: center;
      cursor: pointer;

      .upload-innder {
        margin: 0;
        padding: 16px 36px;

        .put-upload {
          color: #0887ff;
          font-size: 16px;
          pointer-events: none;

          .svg-icon {
            font-size: 16px;
          }

          >span {
            vertical-align: middle;
            margin-left: 8px;
          }
        }

        .expand-upload {
          padding: 16px 0;
          pointer-events: none;

          .svg-icon {
            font-size: 24px;
          }

          .upload-text {
            color: #8492a6;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
