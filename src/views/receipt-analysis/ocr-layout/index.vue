<template>
  <div class="ocr-layout">
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
          <img
            :src="
              i.url ? i.url : originalLocation + encodeURIComponent(i.imagePath)
            "
            :alt="i.fileName"
          />
        </div>
        <div class="text">
          <span>{{ i.fileName.substring(0, i.fileName.indexOf(".")) }}</span>
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
              :content="imageName"
              placement="bottom-start"
            >
              <span>{{ imageName }}</span>
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
              /><span>/1</span></span
            >
            <svg-icon
              v-if="activePageIndex === total"
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
              :width="realRenderWidth"
              :height="realRenderHeight"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              class="svg-mask"
            >
              <rect
                ref="rect"
                :x="position.x * scale"
                :y="position.y * scale"
                :width="position.w * scale"
                :height="position.h * scale"
                rx="5"
                ry="5"
                stroke="rgb(26, 155, 255)"
                fill="none"
                stroke-width="2"
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
        <div class="ocr-title-bar">
          <div class="ocr-title">
            <slot name="title"></slot>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 18px;
            "
          >
            <llsButton
              v-if="pageMenuPerm['DOWNLOAD_RECEIPT']"
              type="text"
              @click="handleClickDownload"
              :disabled="!down_allow"
            >
              <svg-icon
                v-show="down_allow"
                class="download"
                iconClass="下载"
              ></svg-icon>
              <svg-icon
                v-show="!down_allow"
                class="download"
                iconClass="下载灰"
              ></svg-icon>
              <span>下载</span></llsButton
            >
            <!-- :requestBody="requestBody" -->
            <more-Button
              productName="回单解析"
              :servicecon="pageMenuPerm['SERVICE_RECEIPT']"
              :collect="pageMenuPerm['COLLECT_RECEIPT']"
            ></more-Button>
          </div>
        </div>

        <div class="ocr-text" @scroll="proxy(calculateXy)" ref="ocrTextWrapper">
          <slot name="text"></slot>
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
          stroke-dasharray="5,5"
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
          showImageViewer = false;
          postFixedMessage(false);
        }
      "
    ></lls-image-viewer>
  </div>
</template>
<script>
import ResizeObserver from "resize-observer-polyfill";
import ImageViewer from "@linklogis/image-viewer";
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
  components: {
    [ImageViewer.name]: ImageViewer,
  },
  props: {
    data: {
      // 文档数组
      type: Array,
      required: true,
      default: () => [],
    },
    activeTabIndex: {
      type: Number,
    },
    pageMenuPerm: Object,
  },
  data() {
    return {
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
      down_allow: true,
      position: { x: 0, y: 0, w: 0, h: 0 },
      // position: {},
    };
  },
  created() {},
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    this.resizeImg();
    // 兼容firefox
    this.bind(this.$refs.documentLayout, "DOMMouseScroll", this.handleZoom);

    this.$events = new Events();
    this.$events.listen("click-ocr-el", this.handleClickText);
    this.$events.listen("drag-document", this.transferDocument);
    this.$events.listen("drag-view", this.transferView);
  },
  watch: {
    data(val) {
      this.activeDocumentIndex = 0;
      this.reRenderImage();
      this.resetProps();
      // console.log(val, "watch.val");
    },
  },
  beforeDestroy() {
    this.$events.remove("click-ocr-el", this.clickOcrEl);
    this.$events.remove("drag-document", this.transferDocument);
    this.$events.remove("drag-view", this.transferView);
    this.resizeObserver.disconnect();
  },
  methods: {
    postFixedMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageGeneralProduct",
          fixed: fixed,
        },
        "*"
      );
    },
    inputChange() {
      // 输入页码
      if (this.activePageIndex > this.total) {
        this.activePageIndex = this.total;
      }
      if (this.activePageIndex < 1) {
        this.activePageIndex = 1;
      }
    },
    resetPosition() {
      this.position = { x: 0, y: 0, w: 0, h: 0 };
    },
    handleClick(position) {
      if (JSON.stringify(position) === "{}") {
        position = { x: 0, y: 0, w: 0, h: 0 };
      }
      this.position = position;
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
    // 计算图片的的实际渲染大小
    reRenderImage() {
      this.data.forEach((page) => {
        const vm = this;
        page.scale = vm.documentWidth / +page.width;
        // page.scale = vm.documentHeight / page.height;
        // 初始图片缩放比例

        page.realRenderHeight = +page.height * page.scale; // 图片实际渲染高度
        if (page.realRenderHeight > vm.documentHeight) {
          page.realRenderHeight = vm.documentHeight;
          page.scale = vm.documentHeight / +page.height;
        }
        page.realRenderWidth = +page.width * page.scale; // 图片实际渲染宽度
        // page.initTranslateY = (page.realRenderHeight - vm.documentHeight) / 2; // 图片实际渲染高度
        // };
      });
      // console.log("render")
      window.setTimeout((_) => {
        this.calculateXy();
      });
      // this.$nextTick((_) => {
      //   this.calculateXy();
      // });
      this.updateTranslateY();
      const page = this.data[this.activeDocumentIndex];
      // console.log(page, "page");
      this.realRenderHeight = page.realRenderHeight;
      this.realRenderWidth = page.realRenderWidth;
      this.scale = page.scale;
    },
    // 切换示例
    handleClickExample(index) {
      if (this.activeDocumentIndex == index) {
        return;
      }
      this.activeDocumentIndex = index;
      this.resetProps();
      this.resizeImg();
      this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
    },
    // 翻页
    handleTurnPage(val) {
      // const num = this.activePageIndex - 1 + val;
      // this.resetProps();
      // if (num === this.total) {
      //   if (this.activeDocumentIndex === this.data.length - 1) {
      //     this.activeDocumentIndex = 0;
      //     this.activePageIndex = 1;
      //   } else {
      //     this.activeDocumentIndex += 1;
      //     this.activePageIndex = 1;
      //   }
      // } else if (num < 0) {
      //   if (this.activeDocumentIndex === 0) {
      //     this.activeDocumentIndex = this.data.length - 1;
      //     this.activePageIndex =
      //       this.data[this.activeDocumentIndex].productsConverters.length;
      //   } else {
      //     this.activeDocumentIndex -= 1;
      //     this.activePageIndex =
      //       this.data[this.activeDocumentIndex].productsConverters.length;
      //   }
      // } else {
      //   this.activePageIndex = num + 1;
      // }
    },
    // 旋转图片
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
      this.$nextTick((_) => {
        this.calculateXy();
      });
    },
    // 缩放图片
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
      this.calculateXy();
      e.preventDefault && e.preventDefault();
      return false;
    },
    // 计算鼠标移动距离
    calculateDragDis(offset) {
      const disX = offset.offsetX - this.offsetX;
      const disY = offset.offsetY - this.offsetY;
      this.$events.trigger(offset.elName, { disX, disY });
      this.offsetX = offset.offsetX;
      this.offsetY = offset.offsetY;
    },
    // 移动文档图片
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
      this.calculateXy();
    },
    // 移动两侧视口
    transferView({ disX, disY }) {
      this.viewX += disX;
      const windowWidth = window.innerWidth;
      if (this.viewX > windowWidth * 0.2) {
        this.viewX = windowWidth * 0.2;
      }
      if (this.viewX < -windowWidth * 0.2) {
        this.viewX = -windowWidth * 0.2;
      }
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX + 8}px)`;
      this.$refs["document-box"].style.width = `calc(50% + ${this.viewX}px)`;
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth;
        this.documentHeight = this.$refs.documentLayout.clientHeight;
        this.reRenderImage();
        this.calculateXy();
      });
    },
    // 激活文本
    handleClickText({ el, id }) {
      // console.log(el, "el2");
      // if (imageIndex !== this.activePageIndex) {
      //   this.activePageIndex = imageIndex;
      // }
      this.activeEl = el;
      this.activeTextId = id;
      this.calculateXy();
    },
    // 计算path起点、终点坐标
    calculateXy() {
      if (this.activeTextId == null) {
        return;
      }
      const activeTextId = this.activeTextId;
      const page = this.page;
      const rotateIndex = this.rotateIndex;
      const zoomScale = this.zoomScale || 1;
      this.$nextTick((_) => {
        const // maskValue = page.tableData[activeTextId],
          maskEl = this.$refs[`maskEl${activeTextId}`][0];
        const documentLayout = this.$refs.documentLayout;
        const ocrTextWrapper = this.$refs.ocrTextWrapper;
        const maskElRect = maskEl.getBoundingClientRect();
        const documentLayoutRect = documentLayout.getBoundingClientRect();
        const lY = documentLayoutRect.top;
        const lX = documentLayoutRect.left;
        const mY = maskElRect.top;
        const mX = maskElRect.right;
        const startX = mX - lX;
        const startY = mY - lY;
        const offsetTop = this.activeEl.offsetTop + 69;
        const offsetLeft = this.activeEl.offsetLeft;
        const scrollTop = ocrTextWrapper.scrollTop;
        const pathEndX = this.documentWidth + offsetLeft + 52;
        const pathEndY = offsetTop - scrollTop + this.activeEl.clientHeight / 2;
        const scale = page.rotateScale * zoomScale * this.imgScale;
        const w = this.text.width;
        const h = this.text.height;
        const Q = this.text.deg;
        const leanX = (scale * w * Math.sin((2 * Math.PI * Q) / 360)) / 2;

        let x = startX;
        let y = startY + (h * scale) / 2;

        if (rotateIndex % 4 === 1) {
          // x = startX + leanX;
          y = startY + (w * scale) / 2;
        }
        if (rotateIndex % 4 === 2) {
          x = startX;
          y = startY + (h * scale) / 2;
        }
        if (rotateIndex % 4 === 3) {
          // x = startX + leanX;
          y = startY + (w * scale) / 2;
        }

        // 处理边界
        if (x > this.documentWidth) {
          x = this.documentWidth;
        }
        // if (y > this.documentHeight) {
        //   y = this.documentHeight;
        // }

        this.pathValue = {
          pathStartX: x,
          pathStartY: y,
          pathEndX,
          pathEndY,
        };
      });
    },
    // 还原
    resetProps() {
      this.rotateIndex = 0;
      this.activePageIndex = 1;
      this.activeTextId = null;
      this.zoomScale = 1;
      this.pathValue = null;
      this.dragX = 0;
      this.dragY = 0;
      this.moveX = 0;
      this.moveY = 0;
      this.updateTranslateY();
      this.$emit("resetId");
    },
    // 设置初始y位移
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
    removeEventListener(e, elName, w) {
      // console.log(elName);
      // const el = this.$refs[elName];

      window.removeEventListener("mousemove", this[`${elName}Mousemove`]);
      window.removeEventListener("mouseup", this.removeEventListener);
      // this[`${elName}Mousemove`] = null;
      this.draggable = false;
    },
    fn(arr) {
      return arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? this.fn(cur) : cur);
      }, []);
    },
    // 绑定事件函数
    bind(node, event, fun) {
      if (node.addEventListener) {
        node.removeEventListener(event, fun);
        node.addEventListener(event, fun, false);
      } else {
        node.detachEvent("on" + event, fun);
        node.attachEvent("on" + event, fun.call(obj));
      }
    },
    // 代理函数
    proxy(fun, args) {
      if (this.proxying) return;
      this.proxying = true;
      window.requestAnimationFrame((_) => {
        fun.call(this, args);
        this.proxying = false;
      });
    },
    // 下载识别结果
    handleClickDownload() {
      this.$http({
        method: "get",
        url: `/general-product-web/general/downloadResult?taskId=${this.example.requestId}&productName=回单解析&path=${this.example.excelPath}`,
        responseType: "blob",
      })
        .then((res) => {
          const fileName =
            res.headers["content-disposition"] &&
            res.headers["content-disposition"]
              .split(";")[1]
              .split("filename=")[1]
              .replace(/"/gi, "");
          const blob = res.data;
          const type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8";
          this.exportByBlob(blob, decodeURIComponent(fileName), type);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    // 当前示例信息
    example() {
      return this.data[this.activeDocumentIndex];
    },
    // 总页数
    // total() {
    //   return this.data[this.activeDocumentIndex].images[this.activeTabIndex]
    //     .length;
    // },
    // 当前页面信息
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
    pageDetail() {
      return this.page.value;
    },
    originalLocation() {
      return `${window.location.origin}/file-handle-web/file/image?filename=`;
    },
    // 文档图片地址
    imageUrl() {
      return this.data[this.activeDocumentIndex].url
        ? this.data[this.activeDocumentIndex].url
        : this.originalLocation +
            encodeURIComponent(this.data[this.activeDocumentIndex].imagePath);
    },
    imageName() {
      return this.data[this.activeDocumentIndex].fileName;
    },
    // fileName() {
    //   return this.allData[this.activeDocumentIndex].fileName.substring(
    //     0,
    //     this.allData[this.activeDocumentIndex].fileName.indexOf(".")
    //   );
    // },
    // 大图预览所需数据
    urlList() {
      return [{ url: this.imageUrl, title: this.imageName }];
    },
    // 当前文本信息
    text() {
      const { value } = this.page;

      const textArr = [...value];
      const textValue = textArr[this.activeTabIndex].identityList;
      // console.log(textValue, "textValue");
      return textValue.filter((i) => {
        return i.id === this.activeTextId;
      })[0];
    },
    // 当前图片初始缩放比例
    imgScale() {
      return this.scale;
    },
  },
};
</script>
<style lang="stylus" scoped>
.ocr-layout {
  padding: 76px 24px 24px 24px;
  display: flex;
  color: #202d40;
  height: 100vh;
  overflow: hidden;

  .dih-page-input {
    background-color: transparent;
    max-width: 20px;
    border: none;
    text-align: center;
    outline: medium;
    color: #999;
  }

  // .function_bar {
  // display:flex,
  // flex-wrap:nowrap,
  // justify-content:space-between
  // }
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

        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: flex;
        // justify-content: center;
        span {
          transform: scale(0.75);
          transform-origin: left;
          /* width: 142.7px; */
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
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    position: relative;
    align-items: center;
    width: calc(100% - 80px);

    .svg-mask {
      pointer-events: none;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 1;
    }

    .document-box {
      border: 1px solid #e2e4e9;
      flex-shrink: 0;
      flex-grow: 0;
      position: relative;
      height: 100%;
      width: 50%;

      // margin-right: 8px;
      .tool-bar {
        height: 38px;
        line-height: 38px;
        padding: 0 16px;
        box-shadow: 0px 3px 8px 0px rgba(5, 18, 30, 0.08);
        font-size: 12px;
        display: flex;
        justify-content: space-between;

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
          width: 360px;
        }

        .number {
          border-bottom: 1px solid #E3E8F0;
          padding: 0 8px;

          .lls-input {
            width: auto;

            ::v-deep .lls-input__inner {
              max-width: 30px;
              position: relative;
              left: -4px;
              border: none;
              height: 14px;
              padding: 0;
              border-radius: 0;
              text-align: center;

              &:focus {
                border-color: #0887ff;
              }
            }
          }

          span {
            font-size: 12px;
          }
        }

        .svg-icon {
          font-size: 15px;
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
          cursor: url('../images/手势-张开.svg'), grab;
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
            cursor: url('../images/手势-握紧.svg'), grabbing;
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
      background: #f7fbff;
      border: 1px solid #0887ff;
      position: relative;
      padding: 0 16px;
      width: calc(50% - 8px);
      flex-shrink: 1;
      flex-grow: 1;
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
        border: 1px solid #e3e8f0;
        height: calc(100% - 74px);
        overflow: auto;
        padding: 0 8px 12px 8px;
        background: #fff;
        position: relative;

        ::-webkit-scrollbar {
          width: 4px;
          height: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(32, 45, 64, 0.5);
        }

        // 竖向滚动条
        &::-webkit-scrollbar-thumb:vertical {
          background-color: rgba(32, 45, 64, 0.5);
          -webkit-border-radius: 2px;
        }
      }
    }
  }
}
</style>
