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
          <img :src="i.imageUrl" :alt="i.fileName" />
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
          <!-- <div>
            <svg-icon v-if="activePageIndex === 1" class="dis-icon" iconClass="左置灰"></svg-icon>
            <svg-icon v-else class="big-icon" iconClass="ic-左" @click.native="handleTurnPage(-1)"></svg-icon>
            <span class="number">
              <input
                class="dih-page-input"
                type="number"
                v-model.number="activePageIndex"
                v-on:change="inputChange($event)"
              />
              <span>/&nbsp;&nbsp;1</span>
            </span>
            <svg-icon v-if="activePageIndex >= total" class="dis-icon" iconClass="右置灰"></svg-icon>
            <svg-icon v-else class="big-icon" iconClass="ic-右" @click.native="handleTurnPage(1)"></svg-icon>
          </div> -->
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
                style="fill:rgba(8,135,255,0.1);stroke:#0887FF;stroke-width:2"
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
                stroke="#0887FF"
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
                style="fill:rgba(8,135,255,0.1);stroke:#0887FF;stroke-width:2"
              />-->
              <path
                ref="svg-rectangle"
                :d="rectanglePosition ? `M ${rectanglePosition} z` : ''"
                fill="rgba(8,135,255,0.1)"
                stroke="#0887FF"
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
          <div class="btn-config">
            <!-- <more-button
              productName="印章识别"
              :requestBody="requestBody"
              :servicecon="pageMenuPerm['SERSEALRECO']"
              :collect="pageMenuPerm['COLSEALRECO']"
            >
            </more-button> -->
            <!-- <img src="../image/服务配置.svg" alt=""> -->
            <servicecon-figuration
              v-if="pageMenuPerm['SERSEALRECO']"
              productName="印章识别"
              :isicon="true"
              type="text"
              :plain="false"
            ></servicecon-figuration>
            <more-button
              v-if="pageMenuPerm['COLSEALRECO']"
              productName="印章识别"
              :servicecon="false"
              :collect="true"
            >
            </more-button>
          </div>
        </div>
        <div
          v-if="this.example.ret.length"
          class="ocr-text"
          @scroll="proxy(calculateXy)"
          ref="ocrTextWrapper"
        >
          <slot></slot>
        </div>
        <div class="no-data" v-else>
          <img :src="require('@/assets/images/暂无数据.png')" alt />
          <div>暂无解析数据</div>
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
  model: {
    prop: "value",
    event: "handle-change",
  },
  components: {
    [ImageViewer.name]: ImageViewer,
    serviceconFiguration: (resolve) =>
      require(["@/components/moreButton/serviceconFiguration.vue"], resolve), // 服务管理页面
  },
  props: {
    value: {
      type: Array,
      default: function () {
        return null;
      },
    },
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
      svgPosition: "",
      rectanglePosition: "",
      svgCircle: [],
      vertices: null,
      rectangle: null,
      eleItem: null,
      transition: false,
    };
  },
  created() {
    // console.log(this.example, "example");
    // console.log(this.data, "data");
    // console.log(this.value, "value");
    // console.log(this.page, "page");
    // console.log(this.text, "text");
    // console.log(this.imageName, "imageName");
    // console.log(this.imageUrl, "imageUrl");
  },
  mounted() {
    // 监听窗口变化 并读取文档的宽度
    this.resizeImg();

    // 兼容firefox
    this.bind(this.$refs.documentLayout, "DOMMouseScroll", this.handleZoom);

    this.$events = new Events();
    this.$events.listen("click-ocr-el", this.handleClickText);
    this.$events.listen("click-rectangle", this.handleClickRectangle);
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
      const page = this.example.ret;
      this.resizeImg();
      this.$emit("handle-change", page);
      this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
    },
    handleClick(index) {
      // 点击右侧tabs
      // this.resetProps()
      this.rotateIndex = 0;
      // this.activePageIndex = 1
      this.activeTextId = null;
      this.zoomScale = 1;
      this.pathValue = null;
      this.dragX = 0;
      this.dragY = 0;
      this.moveX = 0;
      this.moveY = 0;
      this.updateTranslateY();
      this.$emit("resetId");
      // this.activePageIndex = index + 1
      const page = this.example.ret;
      this.resizeImg();
      this.$emit("handle-change", page);
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
        // const img = new Image();
        // img.src = page.img;
        // img.onload = function () {
        // page.originalWidth = this.width // 图片原始宽度
        // page.originalHeight = this.height // 图片原始高度
        const widthScale = vm.documentWidth / +page.width;
        const heightScale = vm.documentHeight / +page.height;
        page.scale = widthScale < heightScale ? widthScale : heightScale;
        // page.scale =
        //   page.height > page.width
        //     ? vm.documentHeight / +page.height
        //     : vm.documentWidth / +page.width; // 初始图片缩放比例

        page.realRenderHeight = +page.height * page.scale; // 图片实际渲染高度
        // if (page.realRenderHeight > vm.documentHeight) {
        //   page.realRenderHeight = vm.documentHeight;
        //   page.scale = vm.documentHeight / +page.height;
        // }
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
      const page = this.example.ret.identityList;
      this.resizeImg();
      this.$emit("handle-change", page);
      this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
    },
    // 翻页
    handleTurnPage(val) {
      const num = this.activePageIndex - 1 + val;
      this.resetProps();
      if (num === this.total) {
        if (this.activeDocumentIndex === this.data.length - 1) {
          this.activeDocumentIndex = 0;
          this.activePageIndex = 1;
        } else {
          this.activeDocumentIndex += 1;
          this.activePageIndex = 1;
        }
      } else if (num < 0) {
        if (this.activeDocumentIndex === 0) {
          this.activeDocumentIndex = this.data.length - 1;
          this.activePageIndex = this.data[this.activeDocumentIndex].ret.length;
        } else {
          this.activeDocumentIndex -= 1;
          this.activePageIndex = this.data[this.activeDocumentIndex].ret.length;
        }
      } else {
        this.activePageIndex = num + 1;
      }

      const page = this.example.ret[this.activePageIndex - 1];
      this.resizeImg();
      this.$emit("handle-change", page);
      this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
      this.resizeImg();
      // this.$emit("handle-change", page);
      // this.$emit("tabs", this.activeDocumentIndex, this.activePageIndex - 1);
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
      this.$refs.ocrResult.style.width = `calc(50% - ${this.viewX}px)`;
      this.$refs["document-box"].style.width = `calc(50% + ${
        this.viewX + 8
      }px)`;
      this.$nextTick((_) => {
        this.documentWidth = this.$refs.documentLayout.clientWidth;
        this.documentHeight = this.$refs.documentLayout.clientHeight;
        this.reRenderImage();
        this.calculateXy();
      });
    },
    // 激活文本
    handleClickText({ el, id, item }) {
      this.rectanglePosition = "";
      this.vertices = item.polygon;
      this.svgPositionMethods(this.rotateIndex);
      this.activeEl = el;
      this.activeTextId = id;
      this.moveImage("svg-polygon");
    },
    moveImage(domName) {
      this.$nextTick((_) => {
        const maskEl = this.$refs[domName],
          documentLayout = this.$refs.documentLayout,
          maskElRect = maskEl.getBoundingClientRect(),
          documentLayoutRect = documentLayout.getBoundingClientRect(),
          lY = documentLayoutRect.top,
          lX = documentLayoutRect.left,
          mY = maskElRect.top,
          mX = maskElRect.left,
          startX = mX - lX,
          startY = mY - lY;
        // 先判断是否出界 => 1、出界=>move  2、未出界=>计算位置
        if (
          startX <= 0 ||
          startY <= 0 ||
          startX >= this.documentWidth ||
          startY >= this.documentHeight
        ) {
          let disX = 0,
            disY = 0;
          if (startX <= 0) {
            disX = -startX + this.documentWidth / 2;
          }
          if (startY <= 0) {
            disY = -startY + this.documentHeight / 2;
          }
          if (startX >= this.documentWidth) {
            disX = this.documentWidth / 2 - startX;
          }
          if (startY >= this.documentHeight) {
            disY = this.documentHeight / 2 - startY;
          }
          this.transferDocument({ disX, disY });
          this.transition = true;
          let index = 0;
          this.timer = window.setInterval((_) => {
            this.calculateXy();
            index++;
            if (index == 10) {
              clearInterval(this.timer);
              this.transition = false;
            }
          }, 30);
        } else {
          this.calculateXy();
        }
      });
    },
    handleClickRectangle({ item }) {
      this.svgPosition = "";
      this.pathValue = null;
      this.rectangle = item.rectangle;
      this.rectanglePositionMethods();
      this.moveImage("svg-rectangle");
    },
    svgPositionMethods(rotateIndex) {
      this.svgPosition = this.vertices.reduce((total, cur, index) => {
        return (total += `${cur.x * this.imgScale} ${cur.y * this.imgScale} `);
      }, "");
      this.svgCircle = this.vertices.map((item) => {
        return {
          cx: item.x * this.imgScale,
          cy: item.y * this.imgScale,
        };
      });
    },
    rectanglePositionMethods() {
      this.rectanglePosition = this.rectangle.reduce((total, cur, index) => {
        return (total += `${cur.x * this.imgScale} ${cur.y * this.imgScale} `);
      }, "");
    },
    // 计算path起点、终点坐标
    calculateXy() {
      // if (this.activeTextId == null) {
      //   return;
      // }
      this.rectanglePosition && this.rectanglePositionMethods();
      if (!this.svgPosition) return;
      this.svgPositionMethods();
      const activeTextId = this.activeTextId;
      const page = this.page;
      const rotateIndex = this.rotateIndex;
      const zoomScale = this.zoomScale || 1;
      this.$nextTick((_) => {
        let pointEls, pointEl, pointElsRect, beforeEl, afterEl, otherEl;
        pointEls = this.$refs.pointEl;
        pointEl;
        pointElsRect = pointEls.map((i, index) => {
          let elRect = i.getBoundingClientRect();
          if (index == 0 || pointEl.rect.right < elRect.right) {
            pointEl = { rect: elRect, index };
          }
          return { rect: elRect, index };
        });
        beforeEl =
          pointElsRect[
            pointEl.index == 0 ? pointElsRect.length - 1 : pointEl.index - 1
          ];
        afterEl =
          pointElsRect[
            pointEl.index == pointElsRect.length - 1 ? 0 : pointEl.index + 1
          ];
        otherEl = beforeEl.rect.right > afterEl.rect.right ? beforeEl : afterEl;
        // const maskEl = this.$refs["svg-polygon"],
        const documentLayout = this.$refs.documentLayout,
          ocrTextWrapper = this.$refs.ocrTextWrapper,
          // maskElRect = maskEl.getBoundingClientRect(),
          documentLayoutRect = documentLayout.getBoundingClientRect(),
          activeElRect = this.activeEl.getBoundingClientRect(),
          ocrTextWrapperRect = ocrTextWrapper.getBoundingClientRect(),
          lY = documentLayoutRect.top,
          lX = documentLayoutRect.left;
        let mY = (otherEl.rect.top + pointEl.rect.top) / 2,
          mX = (otherEl.rect.right + pointEl.rect.right) / 2,
          startX = mX - lX,
          startY = mY - lY,
          offsetTop = activeElRect.top - ocrTextWrapperRect.top,
          offsetLeft = activeElRect.left - ocrTextWrapperRect.left,
          pathEndX = this.documentWidth + offsetLeft + 44,
          pathEndY = offsetTop + this.activeEl.clientHeight / 2,
          x = startX,
          y = startY;
        if (x > this.documentWidth) {
          x = this.documentWidth;
        }
        if (y > this.documentHeight) {
          y = this.documentHeight;
        }

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
      this.svgPosition = "";
      this.rectanglePosition = "";
      this.vertices = null;
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
        // url: `/beefeather-seal-recognition-web/identityCard/common//downLoadFile?path=${this.example.excelPath}`,
        url: `/general-product-web/general/downloadResult?taskId=${this.example.index}&productName=印章识别`,
        responseType: "blob",
      })
        .then((res) => {
          const fileName =
            res.headers["content-disposition"] &&
            res.headers["content-disposition"]
              .split(";")[1]
              .split("filename=")[1]
              .replace(/"/gi, "");
          // console.log(fileName);
          const blob = res.data;
          const type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8";
          this.exportByBlob(blob, decodeURIComponent(fileName), type);
        })
        .catch((error) => {
          console.log(error);
          // this.$message({
          //   message: error.data.message,
          //   type: "error",
          // });
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
    // pageDetail() {
    //   return this.page.value[this.activeTabIndex].identityList;
    // },
    // 文档图片地址
    imageUrl() {
      return this.data[this.activeDocumentIndex].imageUrl;
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

  .lls-dropdown {
    color: #0887FF;
    cursor: pointer;
  }

  .no-data {
    height: calc(100% - 82px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div {
      color: #05121E;
      font-size: 14px;
      margin-top: 12px;
      line-height: 20px;
      font-weight: bold;
    }
  }

  * {
    user-select: none;
  }

  .btn-config {
    font-size: 12px;
    color: #0887FF;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
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

    .svg-seal {
      pointer-events: none;
      position: absolute;
      z-index: 1;
    }

    .document-box {
      border: 1px solid #e2e4e9;
      width: 50%;
      flex-shrink: 0;
      flex-grow: 0;
      height: 100%;

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
          cursor: url('../icon/手势-张开.svg'), grab;
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
            cursor: url('../icon/手势-握紧.svg'), grabbing;
          }

          &.transition {
            transition: all 0.3s linear;
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
        padding: 16px;
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
