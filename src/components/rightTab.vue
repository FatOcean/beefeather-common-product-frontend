<template>
  <div class="right-tab">
    <div
      v-for="i in 4"
      :key="i"
      class="border-corner"
      :class="[`border-corner-${i}`]"
    ></div>
    <svg-icon iconClass="识别结果" class="svgClass"></svg-icon>
    <lls-tabs v-model="activeName" height="50px" @tab-click="handleClickTabs">
      <lls-tab-pane label="识别结果" name="first">
        <div
          class="ocr-text"
          @scroll="$parent.parentProxy"
          ref="ocrTextWrapper"
        >
          <slot></slot>
        </div>
      </lls-tab-pane>
      <lls-tab-pane label="Json结果" name="second" v-if="isShowJson">
        <div style="border: 1px solid #e3e8f0" v-if="activeName === 'second'">
          <b-code-editor
            :indent-unit="4"
            v-model="newCodeTest"
            :readonly="true"
            :gutter="false"
            ref="editor"
            mode="application/json"
            theme="eclipse"
            :height="'calc(100vh - 200px)'"
            :show-number="false"
            :auto-format="true"
          ></b-code-editor>
        </div>
      </lls-tab-pane>
      <template v-slot:button>
        <template v-if="isshowBank && activeName === 'first'">
          <lls-select
            ref="selectRef"
            style="margin-right: 8px"
            v-model="bank"
            placeholder="请选择银行"
            :disabled="bankType"
            @change="getResult()"
          >
            <lls-option
              v-for="item in options"
              :key="item.bankCh"
              :label="item.bankCh"
              :value="item.bankEn"
            >
            </lls-option>
          </lls-select>
        </template>
        <div v-if="!isImgdownload">
          <lls-button
            type="text"
            @click="downloadResult"
            v-if="activeName === 'first' && isshowDownButton"
            ><i class="lls-icon-download"></i>
            {{
              `下载${activeName === "first" ? "识别" : "Json"}结果`
            }}</lls-button
          >
          <lls-button
            type="text"
            @click="downloadResult"
            v-if="activeName === 'second'"
            ><i class="lls-icon-download"></i>
            {{
              `下载${activeName === "first" ? "识别" : "Json"}结果`
            }}</lls-button
          >
        </div>

        <div v-else>
          <lls-dropdown @command="downloadResult" v-if="activeName === 'first'">
            <lls-button type="text"
              ><i class="lls-icon-download"></i>
              {{
                `下载${activeName === "first" ? "识别" : "Json"}结果`
              }}</lls-button
            >
            <lls-dropdown-menu slot="dropdown">
              <lls-dropdown-item command="JPG">JPG</lls-dropdown-item>
              <lls-dropdown-item command="JPEG">JPEG</lls-dropdown-item>
              <lls-dropdown-item command="PNG">PNG</lls-dropdown-item>
              <lls-dropdown-item command="BMP">BMP</lls-dropdown-item>
            </lls-dropdown-menu>
          </lls-dropdown>
          <lls-button type="text" v-else @click="downloadResult"
            ><i class="lls-icon-download"></i>
            {{
              `下载${activeName === "first" ? "识别" : "Json"}结果`
            }}</lls-button
          >
        </div>
      </template>
    </lls-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getBankList,
  downloadResult,
  downloadJson
} from '@/api/receiptAnalysis'

export default {
  name: '',
  props: {
    codeTest: {
      type: String,
      default: ''
    },
    isshowBank: {
      type: Boolean,
      default: false
    },
    isImgdownload: {
      type: Boolean,
      default: false
    },
    isshowDownButton: {
      type: Boolean,
      default: true
    },
    isShowJson: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'first',
      newCodeTest: '',
      bank: '',
      options: [],
      bankType: true,
      oldActiveName: ''
    }
  },
  created() {
    this.newCodeTest = this.codeTest
    if (this.isshowBank) {
      getBankList().then((res) => {
        if (res.data.code === '200') {
          this.options = res.data.data
        }
      })
    }
  },
  computed: {
    ...mapState(['ocrProductObj'])
    // codeEditorHeight() {
    //   return this.$route.path === '/tradeDocumentAnalysis'
    // }
  },
  watch: {
    // codeTest: {
    //   handler(codeTest) {
    //     this.$nextTick(() => {
    //       this.newCodeTest = codeTest;
    //       this.$refs.editor.formatCode();
    //     });
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    activeName: {
      handler(newActiveName, oldActiveName) {
        this.newActiveName = newActiveName
      }
    }
  },
  methods: {
    // fileFormat 判断是否是下载图片
    downloadResult(fileFormat = false) {
      const isDocumentAnalysis = this.$route.path === '/tradeDocumentAnalysis'
      let data
      let newproductObj
      if (isDocumentAnalysis) {
        const { example } = this.$parent
        data = example
        newproductObj = this.ocrProductObj
      } else {
        const { page, productObj } = this.$parent
        data = page
        newproductObj = productObj
      }
      const download =
        this.activeName === 'first' ? downloadResult : downloadJson
      const params = {
        example: !!data?.isexample,
        application: newproductObj.staticName.toUpperCase(),
        taskId: data.isexample ? data.fileName : data.taskId
      }
      if (this.isImgdownload && this.activeName === 'first') params.fileFormat = fileFormat
      download(params)
        .then((res) => {
          // if (res.data.code === '200') {
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
            offset: 60
          })
        })
    },
    setBank(bank) {
      this.bank = bank
    },
    handleClickTabs(e) {
      console.log(this.activeName, this.newActiveName)
      if (this.activeName === this.newActiveName) return
      this.$parent.resetProps()
      if (this.activeName !== 'first') {
        this.newCodeTest = this.codeTest
        this.$nextTick(() => {
          // this.$refs.editor.formatCode()
          // document.getElementsByClassName('CodeMirror')[0].click()
        })
      }
    },
    getResult() {
      this.$parent.$parent.getResult(this.bank)
    }
  }
}
</script>
<style lang="stylus">
.bin-json-editor {
  height: calc(100vh - 200px);

  ::-webkit-scrollbar {
    width: 4px;
    background: rgba(#202D40);
    opacity: 0.5;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    padding-right: 4px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
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

::v-deep .lls-tabs__header {
  border-bottom: none;
  margin: 0;
}

.svgClass {
  font-size: 16px;
  position: relative;
  top: 28px;
}

.border-corner {
  position: absolute;
  height: 20px;
  width: 20px;
  border: 4px solid #0887ff;

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

.right-tab {
  ::-webkit-scrollbar {
    width: 4px;
    background: rgba(#202D40);
    opacity: 0.5;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    padding-right: 4px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
