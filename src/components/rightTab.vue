<template>
  <div class="right-tab">
    <div
      v-for="i in 4"
      :key="i"
      class="border-corner"
      :class="[`border-corner-${i}`]"
    ></div>
    <svg-icon iconClass="识别结果" class="svgClass"></svg-icon>
    <el-tabs v-model="activeName" height="50px" @tab-click="handleClickTabs">
      <el-tab-pane label="识别结果" name="first">
        <div
          class="ocr-text"
          @scroll="$parent.parentProxy"
          ref="ocrTextWrapper"
        >
          <slot></slot>
        </div>
      </el-tab-pane>

    </el-tabs>
    <div class="right-tab-button">
        <template v-if="isshowBank && activeName === 'first'">
          <el-select
            ref="selectRef"
            style="margin-right: 8px"
            v-model="bank"
            placeholder="请选择银行"
            :disabled="bankType"
            @change="getResult()"
          >
            <el-option
              v-for="item in options"
              :key="item.bankCh"
              :label="item.bankCh"
              :value="item.bankEn"
            >
            </el-option>
          </el-select>
        </template>
        <div v-if="!isImgdownload">
          <el-button
            type="text"
            @click="downloadResult"
            v-if="activeName === 'first' && isshowDownButton"
            ><i class="el-icon-download"></i>
            {{
              `下载识别结果`
            }}</el-button
          >
        </div>

        <div v-else>
          <el-dropdown @command="downloadResult" v-if="activeName === 'first'">
            <el-button type="text"
              ><i class="el-icon-download"></i>
              {{
                `下载${activeName === "first" ? "识别" : "Json"}结果`
              }}</el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="JPG">JPG</el-dropdown-item>
              <el-dropdown-item command="JPEG">JPEG</el-dropdown-item>
              <el-dropdown-item command="PNG">PNG</el-dropdown-item>
              <el-dropdown-item command="BMP">BMP</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" v-else @click="downloadResult"
            ><i class="el-icon-download"></i>
            {{
              `下载${activeName === "first" ? "识别" : "Json"}结果`
            }}</el-button
          >
        </div>
    </div>

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
      newActiveName: ''
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

::v-deep .el-tabs__active-bar {
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
  ::v-deep .el-tabs__active-bar {
    margin-left: 0px !important;
  }
}

::v-deep .el-tabs__header {
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
  border: 4px solid #009688;

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
.right-tab-button{
  position: absolute;
  right: 20px;
  top: 26px;
  display: flex;
}
</style>
