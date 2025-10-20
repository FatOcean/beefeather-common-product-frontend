<template>
  <div>
    <div class="tools">
      <div type="text" class="color8492a6">
        {{ $t('asset.Instruction') }}
        <el-popover
          placement="bottom-end"
          trigger="click"
          :visible-arrow="false"
          popper-class="instruction-popover"
          @show="isHovered = true"
          @hide="isHovered = false"
          ref="instructionPopover"
        >
          <div class="instruction-tip">
            <div class="titler">{{ $t('asset.specialMarkMeaning') }}</div>
            <div class="content">
              <div v-for="(value, key) in specialMarkMeaning" :key="key">
                <span :class="[`${key}`]">{{ key }}</span
                ><span>{{ $t(`asset.${value}`) }}</span>
              </div>
            </div>
            <div class="line"></div>
            <div class="content">
              <div v-for="(value, key) in docTypeText" :key="key">
                <span class="left-key">{{ key }}</span>
                <span v-html="$t(`asset.${value}`)" style="text-align: right"></span>
              </div>
            </div>
            <div class="line"></div>

            <div class="titler">{{ $t('asset.shortcutKkeyOperation') }}</div>
            <div class="content">
              <div v-for="(value, key) in shortcutKey" :key="key">
                <span class="left-key">{{
                  ['ShiftMouseWheel', 'ImageSelectedDkey'].includes(key) ? $t(`asset.${key}`) : key
                }}</span
                ><span>{{ $t(`asset.${value}`) }}</span>
              </div>
            </div>
          </div>

          <!-- <svg-icon iconClass="疑问hover" v-if="isHovered" slot="reference"> </svg-icon> -->
          <svg-icon iconClass="疑问" slot="reference" style="cursor: pointer"> </svg-icon>
        </el-popover>
      </div>
      <el-popover
        placement="bottom-end"
        width="660"
        trigger="click"
        :visible-arrow="false"
        @show="filterPopoverShow"
        popper-class="badge-popover"
      >
        <div class="badge-tip">
          <el-form style="width: auto" label-position="top" label-width="80px" column="3">
            <el-form-item :label="$t('asset.filterSet')">
              <selectList
                v-model="filterSetList"
                :placeholder="$t('placeholder.seletPlaceholder')"
                clearable
                multiple
                collapse-tags
                @change="filterSetChange"
              >
                <el-option v-for="item in filterSetListOptions" :key="item" :label="item" :value="item" />
              </selectList>
            </el-form-item>
            <el-form-item :label="$t('asset.filterDocumentType')">
              <selectList
                v-model="filterDocType"
                :placeholder="$t('placeholder.seletPlaceholder')"
                clearable
                multiple
                collapse-tags
                @change="filterSetChange"
              >
                <el-option
                  v-for="item in filterDocTypeOptions"
                  :key="item.docType"
                  :label="$i18n.locale === 'zh' ? item.docTypeCh : item.docTypeEn"
                  :value="item.docType"
                ></el-option>
              </selectList>
            </el-form-item>
            <el-form-item :label="$t('asset.filterDocumentFolder')">
              <selectList
                v-model="filterDocFolder"
                :placeholder="$t('placeholder.seletPlaceholder')"
                clearable
                multiple
                collapse-tags
                @change="filterSetChange"
              >
                <el-option v-for="item in filterDocFolderOptions" :key="item" :label="item" :value="item" />
              </selectList>
            </el-form-item>
          </el-form>
        </div>

        <el-badge :value="filterLeng" :hidden="filterLeng === 0" slot="reference">
          <el-button class="colore58b04">
            <svg-icon iconClass="Filter"> </svg-icon>
            {{ $t('asset.filter') }}
          </el-button>
        </el-badge>
      </el-popover>
      <el-button class="backgtound0078B3" type="primary" @click.stop="zoom(-1)">
        <svg-icon iconClass="放大1"> </svg-icon>
        {{ $t('asset.zoomin') }}
      </el-button>
      <el-button class="backgtound0078B3" type="primary" @click.stop="zoom(1)">
        <svg-icon iconClass="缩小1"> </svg-icon>
        {{ $t('asset.zoomOut') }}
      </el-button>
      <el-button class="backgtound0078B3" type="primary" @click="reset">
        <svg-icon iconClass="重置1"> </svg-icon>
        {{ $t('asset.reset') }}
      </el-button>
      <div class="line"></div>
      <div class="Selected-class">
        <span>{{ $t('asset.Selected') }}</span>
        <span>{{ selectNum }}</span>
      </div>
      <el-button
        class="backgtound009D19"
        type="primary"
        :disabled="selectNum === 0 || !isLock"
        @click.stop="groupClick"
      >
        <svg-icon iconClass="Group"> </svg-icon>
        {{ $t('asset.group') }}
      </el-button>
      <div>
        <inputNumber
          v-model="groupNum"
          controls-position="right"
          @change="handleChange"
          :min="0"
          :max="10000"
          :isReviwCompleted="isReviwCompleted"
          @blur="handleBlur"
          style="margin-right: 4px"
        ></inputNumber>
        <el-tooltip class="item" effect="dark" :content="`S0:${$t('asset.transactionDimension')}`" placement="top">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div>
      <el-button class="backgtound009D19" type="primary" :disabled="selectNum === 0 || !isLock" @click="handleApplySet">
        <svg-icon iconClass="配置"> </svg-icon>
        {{ $t('asset.applySet') }}
      </el-button>
      <el-button class="backgtound009D19" type="primary" :disabled="selectNum === 0 || !isLock" @click="handleAddSet">
        <i class="el-icon-plus"></i>
        {{ $t('asset.addSet') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import inputNumber from './components/inputNumber.vue'
export default {
  name: '',
  props: {
    selectNum: {
      type: Number,
      default: 0
    },
    docImageInfos: {
      type: Array,
      default: () => {
        return []
      }
    },
    isLock: {
      typeof: Boolean,
      default: () => {
        return false
      }
    },
    isReviwCompleted: {
      type: Boolean,
      default: null
    }
  },
  components: { inputNumber },
  data() {
    return {
      isHovered: false,
      groupNum: 2,
      filterSetList: [],
      filterDocType: [],
      filterDocFolder: [],
      filterSetListOptions: [],
      filterDocTypeOptions: [],
      filterDocFolderOptions: [],
      shortcutKey: {
        Ctrl: 'Ctrl',
        Shift: 'Shift',
        'Ctrl + h': 'CtrlAddH',
        'Ctrl + g': 'CtrlAddG',
        '↑ → ← ↓': 'arrows',
        ImageSelectedDkey: 'ImageSelectedD',
        ShiftMouseWheel: 'mouseWheel'
      },
      specialMarkMeaning: {
        D: 'Duplicate',
        Sup: 'supplementaryUpload'
        // AI: "AI",
      },
      docTypeText: {
        S0: 'S0Tip'
        // S1: "S1Tip",
      }
    }
  },
  computed: {
    filterLeng() {
      return this.filterSetList.length + this.filterDocType.length + this.filterDocFolder.length
    }
  },
  mounted() {
    const checkDocAgentStatus = JSON.parse(sessionStorage.getItem('checkDocAgentStatus'))

    if (!checkDocAgentStatus?.classifyGuided) {
      this.$nextTick(() => {
        this.$refs.instructionPopover.showPopper = true
      })
      save().then((res) => {
        sessionStorage.setItem('checkDocAgentStatus', JSON.stringify({ classifyGuided: true }))
        this.$emit('getInfo')
      })
    }
  },
  methods: {
    filterSetChange() {
      this.$parent.filterSetChange([this.filterSetList, this.filterDocType, this.filterDocFolder])
    },
    groupClick(event) {
      event.stopPropagation()
      this.$parent.groupClick()
    },
    handleChange() {},
    handleBlur() {
      this.groupNum = parseInt(this.groupNum) || 0
    },
    zoom(width) {
      this.$parent.zoom(width)
    },
    handleApplySet(event) {
      event.stopPropagation()
      this.$parent.handleApplySet(this.groupNum)
    },
    handleAddSet() {
      this.$parent.handleApplySet(this.groupNum, true)
    },
    reset() {
      this.$parent.initImageCardWidth()
    },
    filterPopoverShow() {
      const filterSetListOptions = [...new Set(this.docImageInfos.flatMap((item) => item.docTag))].filter(
        (num) => num !== 'Others'
      )
      this.filterSetListOptions = filterSetListOptions.sort((a, b) => {
        const numA = parseInt(a.substring(1))
        const numB = parseInt(b.substring(1))
        return numA - numB
      })
      this.filterDocTypeOptions = this.getfilterDocType()
      this.filterDocFolderOptions = [...new Set(this.docImageInfos.map((item) => item.sortId).sort((a, b) => a - b))]
    },
    getfilterDocType() {
      const extractedArray = this.docImageInfos.map((item) => ({
        docType: item.docType,
        docTypeCh: item.docTypeCh,
        docTypeEn: item.docTypeEn
      }))
      // 对新对象数组去重
      const uniqueExtractedArray = extractedArray.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) => t.docType === item.docType && t.docTypeCh === item.docTypeCh && t.docTypeEn === item.docTypeEn
          )
      )
      if (this.docImageInfos.some((item) => item.isDuplicate === 'D')) {
        uniqueExtractedArray.push({
          docType: 'Duplicate',
          docTypeCh: '重复',
          docTypeEn: 'Duplicate'
        })
      }
      return uniqueExtractedArray
    }
  }
}
</script>
<style lang="stylus">
.badge-popover {
  margin-top: 0px !important;

  .el-form {
    display: flex;
    justify-content: space-between;

    .el-form-item {
      margin-bottom: 4px;
      width: 33%;
      margin-left: 12px;

      &:nth-child(1) {
        margin-left: 0px !important;
      }

      .el-form-item__label {
        padding-bottom: 0px;
      }
    }
  }
}

.instruction-popover {
  margin-top: 0px !important;

  .instruction-tip {
    .titler {
      font-size: 14px;
      font-weight: 500;
    }

    .line {
      height: 1px;
      width: 100%;
      // border-top: 1px dashed #ccc;
    }

    .content {
      >div {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        padding-left: 12px;
        margin: 8px 0;

        .left-key {
          margin-right: 16px;
        }
      }

      .D, .Sup, .AI {
        padding: 0 8px;
      }

      .D {
        background: rgba(181, 13, 217, 0.1);
        color: #B50DD9;
      }

      .Sup {
        background: rgba(27, 198, 92, 0.1);
        color: #1BC65C;
      }

      .AI {
        background: rgba(8, 135, 255, 0.1);
        color: #0078B3;
      }
    }
  }
}
</style>
<style lang="stylus" scoped>
.tools {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color8492a6 {
  color: #8492a6 !important;
  margin-bottom: 8px;

  &:hover {
    // color: #0078B3 !important;
  }
}

.el-button {
  width: 80%;
  height: 32px;
  margin-bottom: 8px;
  margin-left: 0px;
  border-radius: 4px;

  .svg-icon {
    position: relative;
    top: -1px;
  }
}

.el-badge {
  width: 106px;
  margin-left: 12px;

  .el-button {
    width: 88%;
  }

  ::v-deep .el-badge__content {
    right: 24px !important;
  }
}

.line {
  width: 40%;
  height: 1px;
  text-align: center;
  background: #E3E8F0;
  margin-top: 8px;
  margin-bottom: 8px;
}

.Selected-class {
  margin-bottom: 8px;

  >span {
    &:nth-child(1) {
      color: #8492A6;
      font-weight: 400;
    }

    &:nth-child(2) {
      color: #202D40;
      margin-left: 8px;
      font-weight: 600;
    }
  }
}

.el-input-number {
  width: 64%;
  margin-left: 11px;
  margin-bottom: 8px;
  line-height: 28px;

  ::v-deep .el-input__inner {
    height: 28px !important;
  }
  ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
      line-height: 13px;
    }
}

.backgtound009D19.is-disabled {
  background: rgba(0, 157, 25, 0.5) !important;
}

.backgtound0078B3.is-disabled {
  background: rgba(0, 120, 179, 0.5) !important;
}

  ::v-deep .el-input__inner{
    border-radius: 4px !important
  }
  .el-button--primary{
    margin-left:0px !important;
    }
</style>
