<template>
  <div class="table-wrapper" @scroll="scroll">
    <slot></slot>
    <!-- <div
      v-show="disY > 8"
      ref="virtual"
      class="virtual"
      @scroll="scroll"
      :style="{ left: `${scrollLeft}px`, bottom: `${disY - 7}px` }"
    >
      <div :style="{ width: `${scrollWidth}px` }"></div>
    </div> -->
  </div>
</template>
<script>
import ResizeObserver from "resize-observer-polyfill";

export default {
  data() {
    return {
      clientWidth: null,
      scrollWidth: null,
      scrollLeft: null,
      disY: null,
    };
  },
  mounted() {
    const el = this.$el;
    this.resizeObserver = new ResizeObserver((_) => {
      this.proxy((_) => {
        this.clientWidth = this.$el.clientWidth;
        this.scrollWidth = this.$el.scrollWidth;
        this.updateVirtual();
      });
    });
    // console.log("listen")
    this.$events.listen("ocr-text-scroll", this.updateVirtual);
    this.resizeObserver.observe(el);
  },
  beforeDestroy() {
    this.$events.remove("ocr-text-scroll");
    this.resizeObserver.disconnect();
  },
  methods: {
    scroll(e) {
      this.scrollLeft = e.target.scrollLeft;
      this.$el.scrollLeft = this.scrollLeft;
      // this.$refs.virtual.scrollLeft = this.scrollLeft;
      this.$emit("scroll");
    },
    updateVirtual() {
      this.scrollLeft = this.$el.scrollLeft;
      // this.$refs.virtual.scrollLeft = this.scrollLeft;

      const elRect = this.$el.getBoundingClientRect();
      const parentRect = this.$el.parentNode.getBoundingClientRect();
      const elBottom = elRect.bottom;
      const parentBottom = parentRect.bottom;
      const disY = elBottom - parentBottom;

      // console.log(elBottom, parentBottom);

      this.disY = disY;
    },
    proxy(fun, args) {
      if (this.proxying) return;
      this.proxying = true;
      window.requestAnimationFrame((_) => {
        fun.call(this, args);
        this.proxying = false;
      });
    },
  },
};
</script>
<style lang="stylus">
.table-wrapper {
  width: calc(100% - 16px);
  // overflow: auto;
  position: relative;

  .virtual {
    width: 100%;
    overflow: auto;
    position: absolute;
    bottom: 100px;

    >div {
      height: 1px;
    }
  }
}
</style>
