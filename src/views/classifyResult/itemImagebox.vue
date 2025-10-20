<template>
  <div
    class="iamge"
    :style="`margin:0 ${marginRight / 2}px;padding:${marginRight / 2}px 0`"
  >
    <div class="form-select" :draggable="false">
      <el-select
        v-model="data.docType"
        :placeholder="$t('placeholder.seletPlaceholder')"
        @change="docTypeChange"
        @focus="
          $emit('changeActiveSelected', { id: data.id, isActiveNumber: false })
        "
        :disabled="isReviwCompleted || !isLock"
        :class="{
          activeSelectBorder: activeSlected && !isActiveNumber,
        }"
        ref="imageBoxSelect"
        @visible-change="(val) => (selectVisibleChange = val)"
      >
        <el-options
          v-for="item in extendedDocTypeList"
          :key="item.docType"
          :label="$i18n.locale === 'zh' ? item.docCh : item.docEn"
          :value="item.docType"
          :style="{ 'max-width': `${itemSecondarySizeWidth - marginRight}px` }"
        ></el-options>
      </el-select>
      <el-input-number
        v-model="data.sortId"
        :disabled="data.docType === 'Others' || isReviwCompleted || !isLock"
        :min="1"
        :max="10000"
        :step="1"
        controls-position="right"
        @blur="handleBlur"
        @change="docTypeChangeNumber('input-number')"
        @focus="
          $emit('changeActiveSelected', { id: data.id, isActiveNumber: true })
        "
        ref="imageBoxNumber"
        :class="{
          activeSelectBorder: activeSlected && isActiveNumber,
        }"
      ></el-input-number>
    </div>
    <!--             -->
    <div
      :class="{
        'image-box': true,
        activeBorder: activeBorder,
        activeRedBorder: data.docTag.length === 0,
      }"
      @click="clickImg"
      v-loading="loading"
      @mouseenter="showMask = true"
      @mouseleave="showMask = false"
      :draggable="!isReviwCompleted && isLock"
      @dragstart="$emit('dragstart', $event)"
      @dragover.prevent="$emit('dragover', $event)"
      @dragend="$emit('dragend', $event)"
      @drag="$emit('drag', $event)"
    >
      <img
        :id="`item-${data.id}`"
        :key="`item-${data.id}`"
        :src="data.frontendImgUrl"
        alt="fail to load"
        :style="{
          transform: `scale(${data.scale || 1}) rotate(${
            90 * ((data.rotate || 0) % 4)
          }deg)`,
        }"
      />
      <div
        :class="['mask', $i18n.locale === 'zh' ? '' : 'enMaskbuttonWidth']"
        v-show="showMask"
        draggable="false"
      >
        <el-button type="text" @click="showImg">
          <svg-icon iconClass="放大白"></svg-icon>
          {{ $t("button.view") }}</el-button
        >
        <el-button
          type="text"
          @click="rotateImg"
          v-show="isView"
          :disabled="isReviwCompleted || !isLock"
        >
          <svg-icon iconClass="旋转白"></svg-icon>
          {{ $t("asset.rotate") }}</el-button
        >
        <div v-show="isView" class="line"></div>
        <el-button
          type="text"
          @click="setDuplicate"
          v-show="isView"
          :disabled="isReviwCompleted || !isLock"
        >
          <i class="el-icon-circle-check" v-if="data.isDuplicate != 'D'"></i>
          <i class="el-icon-success" v-else></i>
          {{
            data.isDuplicate != "D"
              ? $t("asset.Duplicate")
              : $t("asset.cancelDuplication")
          }}</el-button
        >
      </div>
      <div class="left-tip">
        <div
          v-for="(item, index) in newDocTags"
          :key="`${item}-${index}`"
          class="tip-item"
          @mouseenter="showTipMask(item)"
          @mouseleave="hideTipMask"
        >
          <span v-if="!item.name">
            <div
              class="tip-mask"
              v-show="visibleTipMask === item"
              @click.stop="deleteDocTag(item)"
            >
              <i class="el-icon-delete"></i>
            </div>
            <span v-show="visibleTipMask != item">{{ item }}</span>
          </span>
          <span v-else>
            <el-popover
              placement="right"
              trigger="click"
              width="300"
              popper-class="doctag-popover"
            >
              <div class="doctag-popover-box">
                <div
                  v-for="(child, chindIndex) in item.docTags"
                  :key="`${child}-${chindIndex}`"
                  class="tip-item"
                  @mouseenter="showTipMask(child)"
                  @mouseleave="hideTipMask"
                >
                  <div
                    class="tip-mask"
                    v-show="visibleTipMask === child"
                    @click.stop="deleteDocTag(child)"
                  >
                    <i class="el-icon-delete"></i>
                  </div>
                  <span v-show="visibleTipMask != child">{{ child }}</span>
                </div>
              </div>
              <span slot="reference">{{ item.name }}</span>
            </el-popover>
          </span>
        </div>

        <!-- {{ data.docTag[0] }} -->
      </div>
      <div class="rightTip">
        <span class="AI" v-show="data.imageSource === 'AI' && !allAi">AI</span>
        <span class="Sup" v-show="data.isSupply">Sup</span>
        <span class="D" v-show="data.isDuplicate === 'D'">D</span>
      </div>
    </div>
    <div class="image-name">
      <tooltip :content="data.imageName" :placement="'top'"></tooltip>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/debounce'
export default {
  name: 'ImageBox',
  props: {
    data: {
      typeof: Object,
      default: () => {
        return []
      }
    },
    docTypeList: {
      typeof: Array,
      default: () => {
        return []
      }
    },
    activeBorder: {
      typeof: Boolean,
      default: () => {
        return false
      }
    },
    marginRight: {
      typeof: Number,
      default: () => {
        return ''
      }
    },
    allAi: {
      typeof: Boolean,
      default: () => {
        return false
      }
    },
    isDrag: {
      typeof: Boolean,
      default: () => {
        return false
      }
    },
    assetId: {
      typeof: String,
      default: () => {
        return ''
      }
    },
    spliceNumber: {
      typeof: Number,
      default: () => {
        return 0
      }
    },
    docTypeNumberSubumit: {
      typeof: Boolean,
      default: false
    },
    isLock: {
      typeof: Boolean,
      default: false
    },
    isReviwCompleted: {
      type: Boolean,
      default: null
    },
    activeSlected: {
      typeof: Boolean,
      default: ''
    },
    isActiveNumber: {
      typeof: Boolean,
      default: false
    },
    itemSecondarySizeWidth: {
      typeof: String,
      default: '100%'
    }
  },
  computed: {
    newDocTags() {
      const {
        data: { docTag }
      } = this
      const docTagsCopy = [...docTag]
      const sortedArraydocTag = docTagsCopy.sort((a, b) => {
        const numA = parseInt(a.substring(1))
        const numB = parseInt(b.substring(1))
        return numA - numB
      })
      if (sortedArraydocTag.length <= this.spliceNumber) {
        return sortedArraydocTag
      } else {
        const docTags = JSON.parse(JSON.stringify(sortedArraydocTag))
        const arr = docTags.slice(0, this.spliceNumber)
        arr.push({ name: '...', docTags: docTags.splice(this.spliceNumber) })
        return arr
      }
    },
    // 动态扩展选项列表
    extendedDocTypeList() {
      const selectedItem = this.docTypeList.find(
        (item) => item.docType === this.data.docType
      )

      if (selectedItem) {
        return this.docTypeList
      } else {
        // 如果未找到，添加一个临时选项
        return [
          ...this.docTypeList,
          {
            docType: this.data.docType,
            docCh: this.data.docTypeCh,
            docEn: this.data.docTypeEn
          }
        ]
      }
    },
    isView() {
      return this.$route.query.isReview === 'review'
    }

  },
  data() {
    return {
      showMask: false,
      loading: false,
      visibleTipMask: null,
      selectVisibleChange: false
    }
  },
  mounted() {},
  methods: {
    async deleteDocTag(item) {
      if (await this.checkUnlockGoBack()) return
      this.$emit('openDialogMessage')
      const docTag = this.data.docTag.filter((doc) => {
        return doc !== item
      })
      const params = {
        docId: this.data.docId,
        docTag,
        imageName: this.data.imageName
      }
      deleteDocTags(params).then((res) => {
        if (res.data.code === '200') {
          this.data.docTag = docTag
          const { docType, sortId } = this.data
          this.visibleTipMask = null
          this.$emit('deleteDocTags', { docType, sortId, docTag: item })
          this.$emit('getInitTree')
          this.$emit('getInfo')
        }
      })
    },
    showTipMask(item) {
      if (this.isLock) {
        this.visibleTipMask = item
      }
    },
    hideTipMask() {
      this.visibleTipMask = null
    },
    handleBlur(val) {
      this.data.sortId = parseInt(this.data.sortId) || 1
      // this.docTypeChangeNumber("input-number");
    },
    docTypeChangeNumber: debounce(function() {
      this.docTypeChange('input-number')
    }, 1000),

    async docTypeChange(type = 'select') {
      if (await this.checkUnlockGoBack()) return
      this.$emit('openDialogMessage')
      if (type === 'input-number') {
        if (!this.data.sortId) return
        this.$emit('docTypeNumberChange', true)
      }
      const debounceTime = type === 'input-number' ? 1000 : 0
      const vm = this
      const debouncedFunction = debounce(function() {
        const ruleDocType = vm.docTypeList.filter(
          (item) => item.docType === vm.data.docType
        )[0]
        if (ruleDocType.docType === 'Others') {
          vm.data.sortId = 1
        }
        const sourceImage = {
          ...vm.data,
          docTypeCh: ruleDocType.docCh,
          docTypeEn: ruleDocType.docEn
        }
        const params = {
          sourceImage,
          ruleDocType,
          sortId: vm.data.sortId || 1
        }
        updateDocType(params)
          .then((res) => {
            if (res.data.code === '200') {
              vm.data.docTypeCh = ruleDocType.docCh
              vm.data.docTypeEn = ruleDocType.docEn
              if (type === 'input-number') {
                vm.$emit('docTypeNumberChange', false)
                if (vm.docTypeNumberSubumit) {
                  vm.$emit('submit')
                } else {
                  vm.$emit('updateDocType', res.data.data)
                }
              } else {
                vm.$emit('updateDocType', res.data.data)
              }
              vm.$emit('getInfo')
            }
          })
          .finally(() => {
            if (type === 'input-number') vm.$emit('docTypeNumberChange', false)
          })
      }, debounceTime)
      debouncedFunction()
    },

    clickImg(event) {
      this.$emit('setDocImgList', {
        id: this.data.id,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey
      })
    },
    handleChange() {},
    showImg() {
      this.$emit('showImg', this.data)
      //   this.$parent.showImg(this.data);
      //   this.$emit("showImg", this.data);
    },
    async setDuplicate() {
      // D：重复
      // ND：未重复
      // CANCEL：用户取消重复
      if (await this.checkUnlockGoBack()) return
      this.$emit('openDialogMessage')
      const params = {
        assetId: this.assetId,
        // duplicate: this.data.isDuplicate != "D" ? "D" : "CANCEL",
        duplicateImages: [this.data]
      }
      updateDocDuplicate(params).then((res) => {
        if (res.data.code === '200') {
          const data = res.data.data
          this.data.isDuplicate = data.isDuplicate
          this.$emit('updateDocType', data[0])
          this.$emit('getInfo')
        }
      })
    },
    async rotateImg() {
      if (await this.checkUnlockGoBack()) return
      this.$emit('openDialogMessage')
      const data = { id: this.data.id, angle: 90 }
      this.loading = true
      rotateImg(data)
        .then((res) => {
          res = res.data
          if (res.code === '200') {
            if (!this.data.rotate) this.$set(this.data, 'rotate', 0)
            // this.$nextTick(() => {
            let scale = 1
            const flag = this.data.rotate % 2
            const container = document.getElementsByClassName('image-box')[0]
            const containerWidth = container.offsetWidth - 10
            const containerHeight = container.offsetHeight - 12
            if (!flag) {
              const { width, height } = this.data
              if (width > height) {
                scale = (containerHeight / containerWidth).toFixed(2)
              } else {
                scale = (containerWidth / containerHeight).toFixed(2)
              }
            }
            this.data.rotate++
            this.$set(this.data, 'scale', scale)
            this.$emit('rotateImg')

            this.$emit('getInfo')
            // });
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="stylus">
.doctag-popover {
  width: 400px !important;

  .doctag-popover-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    .tip-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(17, 23, 33, 0.5); /* 半透明黑色遮罩 */
    }

    .tip-item {
      width: 68px;
      height: 24px;
      background: #ec161e;
      // border-radius: 50%;
      color: #fff;
      line-height: 24px;
      text-align: center;
      font-size: 20px;
      margin-top: 8px;
      position: relative;
    }
  }
}
</style>
<style lang="stylus" scoped>
.iamge {
  // height: 500px;
  user-select: none;
  // margin-right: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .form-select {
    height: 28px;
    display: flex;
    justify-content: space-between;

    .el-select {
      flex: 1;
      height: 28px;

      ::v-deep .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }

    .el-input-number {
      width: 40%;
      min-width: 60px;
      margin-left: 4px;
      line-height: 28px;
      ::v-deep .el-input__inner {
        height: 28px;
        padding-right: 35px !important;
        padding-left: 6px !important;
      }
    }
    ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
      line-height: 13px;
    }
  }

  .image-box {
    width: 100%;
    height: calc(100% - 86px);
    flex: 1;
    // max-height: 80%;
    // height: 70%;
    margin-top: 12px;
    border: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 8px;

    &:hover {
      // border: 2px solid rgba(8, 135, 255, 1);
    }

    img {
      max-height: 100%;
      max-width: 100%;
      pointer-events: none;
      content-visibility: auto;
      border-radius: 8px;
    }

    .enMaskbuttonWidth {
      .el-button {
        min-width: 164px !important;
      }
    }

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 6px;
      background-color: rgba(17, 23, 33, 0.5); /* 半透明黑色遮罩 */
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 38% 0px;

      .el-button {
        margin-left: 0;
        color: #fff;
        font-size: 14px;
        border: 1px solid #fff;
        padding: 8px 16px;
        width: 33%;
        height: 32px;
        min-width: 108px;
        // max-width: 33%;
        margin-bottom: 4px;

        .svg-icon {
          position: relative;
          top: -2px;
        }

        .el-icon-success {
          color: #ec161e;
        }
      }

      .line {
        height: 1px;
        width: 33%;
        background: #fff;
      }
    }

    .left-tip {
      position: absolute;
      top: 0px;
      left: -4px;
      cursor: pointer;

      .tip-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(17, 23, 33, 0.5); /* 半透明黑色遮罩 */
      }

      .tip-item {
        width: 68px;
        height: 24px;
        background: #ec161e;
        // border-radius: 50%;
        color: #fff;
        line-height: 24px;
        text-align: center;
        font-size: 20px;
        margin-top: 8px;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-top: 8px solid #ec161e;
        }
      }
    }

    .rightTip {
      position: absolute;
      top: 10px;
      right: -4px;

      span {
        font-size: 12px;
        display: inline-block;
        margin-left: 4px;
        padding: 0px 8px;
        color: #fff;
        line-height: 20px;
      }

      .D {
        background: rgba(181, 13, 217, 1);
      }

      .Sup {
        background: rgba(27, 198, 92, 1);
      }

      .AI {
        background: rgba(8, 135, 255, 1);
      }
    }
  }

  .activeRedBorder {
    border: 2px solid #D40F04;
  }

  .activeBorder {
    border: 2px solid #1890ff;
  }

  .activeSelectBorder {
    ::v-deep .el-input__inner {
      border: 1px solid #1890ff;
    }
  }

  ::v-deep .el-input__inner {
    border-radius: 4px !important;
  }

  // ::v-deep .el-select {
  // .el-input__inner {
  // &:focus {
  // border-color: #dadfe6 !important;
  // }
  // }
  // }
  .image-name {
    height: 32px;
    text-align: center;
    margin-top: 12px;
    // 超出展示省略号
    overflow: hidden; // 超出的文本隐藏
    text-overflow: ellipsis; // 溢出用省略号显示
    white-space: nowrap; // 溢出不换行
  }
}
</style>
