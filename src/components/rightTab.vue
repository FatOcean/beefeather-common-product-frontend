<template>
  <div>
    <div
      v-for="i in 4"
      :key="i"
      class="border-corner"
      :class="[`border-corner-${i}`]"
    ></div>
    <svg-icon iconClass="识别结果" class="svgClass"></svg-icon>
    <lls-tabs v-model="activeName" height="50px" @tab-click="handleClickTabs">
      <lls-tab-pane label="识别结果" name="first">
        <div class="ocr-text" @scroll="$parent.parentProxy" ref="ocrTextWrapper">
          <slot></slot>
        </div>
      </lls-tab-pane>
      <lls-tab-pane label="Json结果" name="second">
        <div style="border: 1px solid #e3e8f0">
          <b-code-editor
            :indent-unit="4"
            v-model="newCodeTest"
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
</template>

<script>
export default {
  name: '',
  props: {
    codeTest: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'first',
      newCodeTest: ''
    }
  },
  watch: {
    codeTest: {
      handler(codeTest) {
        this.newCodeTest = codeTest
        this.$nextTick(() => {
          this.$refs.editor.formatCode()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleClickTabs() {
      this.$parent.resetProps()
      document.getElementsByClassName('CodeMirror-lines')[0].click()
      // if (this.activeName !== 'first') {
      //   this.$nextTick(() => {
      //     this.$refs.editor.formatCode()
      //   })
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
::v-deep #tab-first {
  margin-left: 22px !important;
}

::v-deep .lls-tabs__active-bar {
  margin-left: 22px;
}

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

.svgClass {
  font-size: 16px;
  position: relative;
  top: 28px;
}
</style>
