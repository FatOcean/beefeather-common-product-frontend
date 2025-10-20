<template>
  <div class="classify">
    <!-- <Header
      :detailData="detailData"
      :title="$t('asset.categorizationResults')"
      :backPath="'assetCheck'"
      :backQuery="{ activeName: 'assetCheck' }"
      :callback="true"
      @callback="goBack('back')"
    >
      <el-button
        type="primary"
        plain
        @click="gotoParsing"
        style="margin: 0 12px 0 0; border-radius: 4px; height: 24px"
        :disabled="isBtnAIParsingInfo"
        :class="{ 'is-disabled': isBtnAIParsingInfo }"
      >
        <svg-icon
          iconClass="解析页"
          style="margin-right: 4px; position: relative; top: -1px"
          :class="{ 'svg-Class': isBtnAIParsingInfo }"
        ></svg-icon>
        {{ $t("asset.AIParsingInfo") }}</el-button
      >
      <el-button
        type="primary"
        plain
        @click="goAuditing"
        style="margin: 0 12px 0 0; border-radius: 4px; height: 24px"
        :disabled="isBtnCheckResult"
      >
        <svg-icon
          iconClass="审核页"
          style="margin-right: 4px; position: relative; top: -1px"
          :class="{ 'svg-Class': isBtnCheckResult }"
        ></svg-icon>
        {{ $t("asset.DocCheckResult") }}</el-button
      >
      <el-button
        type="primary"
        plain
        @click="changeLog"
        style="margin: 0; border-radius: 4px; height: 24px"
        class="color0078B3"
        :disabled="loading || contentLoading"
      >
        <svg-icon
          iconClass="Supply_Doc"
          style="position: relative; top: -1px; margin-right: 4px"
          :class="{ 'svg-Class': loading || contentLoading }"
        ></svg-icon>
        {{ $t("asset.changeLog") }}</el-button
      >
      <el-button
        type="primary"
        plain
        @click="UnlockBtn"
        style="margin: 0 0 0 12px; border-radius: 4px; height: 24px"
        class="color0078B3"
        :disabled="loading || contentLoading"
        v-if="
          detailData.manualReviewStatus != 'APPROVED' &&
          detailData.manualReviewStatus != 'AUDIT_COMPLETED' &&
          isLock &&
          isReview
        "
      >
        <svg-icon
          iconClass="高级解锁2"
          style="margin-right: 4px; position: relative; top: -1px"
          :class="{ 'svg-Class': loading || contentLoading }"
        ></svg-icon>
        {{ $t("asset.Unlock") }}</el-button
      >
      <el-button
        type="primary"
        plain
        @click="supplementaryUploadClick"
        style="margin: 0 0 0 12px; border-radius: 4px; height: 24px"
        class="color0078B3"
        :disabled="loading || contentLoading"
        v-if="
          newPageMenuPermit['BILLS_UPLOAD'] &&
          isLock &&
          !isReviwCompleted &&
          isReview
        "
      >
        <i class="el-icon-upload2"></i>
        {{ $t("asset.supplementaryUpload") }}</el-button
      >
      <el-button
        type="primary"
        plain
        @click="supplementaryUploadLaterClick"
        style="margin: 0 0 0 12px; border-radius: 4px; height: 24px"
        class="color0078B3"
        :disabled="
          loading ||
          contentLoading ||
          allAssetStatus ||
          isShowSupplementaryUpload
        "
        v-if="
          newPageMenuPermit['BILLS_UPLOAD'] && isReviwCompleted && !isReview
        "
      >
        <i class="el-icon-upload2"></i>
        {{ $t("asset.supplementaryUpload") }}</el-button
      >
      <el-button
        type="primary"
        @click="beforeSubmit"
        :loading="loading"
        v-click-prevent="1000"
        :disabled="anyFailed || contentLoading"
        style="margin: 0 0 0 12px; border-radius: 4px; height: 24px"
        class="backgtound0078B3"
        :class="{ 'is-disabled-primary': anyFailed || contentLoading }"
        v-if="isLock && !isReviwCompleted && isReview"
      >
        <svg-icon
          iconClass="Proceed"
          style="position: relative; top: -1px; margin-right: 4px"
        ></svg-icon>
        <span v-if="isStpFinished">{{ $t("asset.Rerun") }}</span>
        <span v-else>{{ $t("asset.Comfirm") }}</span>
      </el-button>
    </Header> -->

    <div style="height: calc(100vh - 104px)">
      <div class="classify-content" v-loading="contentLoading">
        <div class="classify-content-left">
          <!-- <LeftTreeVue :assetId="assetId" @getInfo="getInfo" ref="leftTreeRef">
          </LeftTreeVue> -->
        </div>
        <RecycleScroller
          class="classify-content-content"
          ref="scroller"
          :items="docImageInfos"
          :item-size="parseInt(itemSecondarySizeWidth * 1.7)"
          :gridItems="gridItems"
          :item-secondary-size="itemSecondarySizeWidth"
          key-field="id"
          v-slot="{ item, index }"
          :buffer="parseInt(itemSecondarySizeWidth * 2)"
        >
          <div :id="item.id" style="height: 100%">
            <ImageBox
              :allAi="allAi"
              :data="item"
              :itemSecondarySizeWidth="itemSecondarySizeWidth"
              :isLock="isLock && isReview"
              :isReviwCompleted="isReviwCompleted"
              :spliceNumber="spliceNumber"
              :docTypeList="docTypeList"
              :activeBorder="borderActiveList.includes(item.id)"
              :activeSlected="activeSelectId === item.id"
              :isActiveNumber="isActiveNumber"
              :ref="'itemImagebox' + item.id"
              @showImg="showImg"
              @changeActiveSelected="
                (val) => {
                  activeSelectId = val.id;
                  isActiveNumber = val.isActiveNumber;
                }
              "
              @setDocImgList="setDocImgList"
              @getInitTree="getInitTree"
              @setLoading="(data) => (contentLoading = data)"
              @rotateImg="isNotpageListSelect = true"
              @openDialogMessage="openDialogMessage"
              :marginRight="marginRight"
              :isDrag="isDrag"
              :assetId="assetId"
              @docTypeNumberChange="(data) => (docTypeNumberChange = data)"
              :docTypeNumberSubumit="docTypeNumberSubumit"
              @submit="submit"
              @updateDocType="updateDocType"
              @deleteDocTags="deleteDocTags"
              @dragstart="handleDragStart($event, index)"
              @dragover.prevent="handleDragOver($event, index)"
              @dragend="handleDragEnd($event, index)"
              @drag="handleDrag"
              @getInfo="getInfo"
            ></ImageBox>
          </div>
        </RecycleScroller>
        <!-- <div class="classify-content-right">
          <RightToolsVue
            :selectNum="selectNum"
            :docImageInfos="FilterdocImageInfos"
            ref="rightTools"
            :isLock="isLock && isReview"
            :isReviwCompleted="isReviwCompleted"
          ></RightToolsVue>
        </div> -->
      </div>
    </div>
    <image-viewer
      @click.native.stop
      v-if="showImageViewer"
      :urlList="urlList"
      :on-close="
        () => {
          showImageViewer = false;
        }
      "
    ></image-viewer>
  </div>
</template>

<script>
// import RightToolsVue from './rightTools.vue'
import ImageViewer from '@/components/imageViewer.vue'
import ImageBox from './itemImagebox.vue'
import { debounce, throttle } from '@/utils/debounce'
// import LeftTreeVue from './leftTree.vue'
import { mapMutations } from 'vuex'
import { docImageInfos } from './data'
export default {
  name: 'ClassifyResult',
  components: {
    // RightToolsVue,
    ImageBox,
    ImageViewer
    // LeftTreeVue
  },
  data() {
    return {
      loading: false,
      anyFailed: false,
      assetId: this.$route.query.assetId || '',
      assetNo: '',
      showImageViewer: false,
      assetName: null,
      docTypeList: [],
      borderActiveList: [],
      urlList: [
        {
          url: '',
          title: ''
        }
      ],
      docImageInfos: docImageInfos,
      itemSecondarySizeWidth: 300,
      itemSizeheight: 450,
      gridItems: 8,
      marginRight: 16,
      debounceResize: null,
      FilterdocImageInfos: [],
      necessaryTypes: [],
      moveImageId: null,
      contentLoading: false,
      zoomType: 'default',
      isDrag: false,
      dealNo: '',
      clientId: '',
      isNotpageListSelect: false, // 用于判断当前页面是否修改(所有调用接口的行为)
      filterTreeData: {}, // 记录树形过滤的条件
      rightSelectFilterData: [], // 记录右侧下拉框筛选条件
      docTypeNumberChange: false, // 用于判断是否修改了docType未失焦
      docTypeNumberSubumit: false,
      detailData: {},
      lastExecution: 0,
      mountedDataTime: new Date().getTime(),
      isMultipleImg: false,
      multipleImgNewCards: [],
      multipleImgArr: [],
      DragStartIndex: null,
      docImageInfosNew: [],
      dragEndIndex: null,
      isLock: true,
      isHandle: false,
      isStpFinished: false,
      assetStatus: '',
      intervalId: null,
      isReview: true,
      isSumbit: false,
      activeSelectId: null, // 选中的id 用来显示select下拉框active
      isActiveNumber: false,
      isShowSupplementaryUpload: false,
      supUploadIntervalId: '',
      allAssetStatus: false,
      pandsDialog: false
    }
  },
  computed: {
    spliceNumber() {
      const height = parseInt(this.itemSecondarySizeWidth * 1.7) - 100
      // 32为一个docTag的高度
      return parseInt(height / 32) - 2
    },
    selectNum() {
      return this.borderActiveList.length
    },
    allAi() {
      return this.FilterdocImageInfos.every(
        (item) => item?.imageSource === 'AI'
      )
    },
    isReviwCompleted() {
      // 'REVIEW_COMPLETED' 审核完成
      return (
        this.detailData.manualReviewStatus === 'APPROVED' ||
        this.detailData.manualReviewStatus === 'AUDIT_COMPLETED'
      )
    },
    isBtnCheckResult() {
      return (
        !this.isStpFinished ||
        this.loading ||
        this.isHandle ||
        !(
          this.detailData.assetStatus === 'RULE_REVIEW_COMPLETED' ||
          this.detailData.assetStatus === 'RULE_REVIEW_FAILED' ||
          this.detailData.manualReviewStatus === 'APPROVED' ||
          this.detailData.manualReviewStatus === 'AUDIT_COMPLETED'
        ) ||
        this.contentLoading
      )
    },
    isBtnAIParsingInfo() {
      return (
        this.loading ||
        this.isHandle ||
        !(
          this.detailData.assetStatus === 'PARSING_COMPLETED' ||
          this.detailData.assetStatus === 'PARSING_FAILED' ||
          this.detailData.assetStatus === 'RULE_REVIEW_COMPLETED' ||
          this.detailData.assetStatus === 'RULE_REVIEW_FAILED' ||
          this.detailData.manualReviewStatus === 'APPROVED' ||
          this.detailData.manualReviewStatus === 'AUDIT_COMPLETED'
        ) ||
        this.contentLoading
      )
      // !this.isStpFinished ||
    }
  },
  watch: {
    docImageInfos: {
      handler(val, old) {
        this.FilterdocImageInfos.forEach((item) => {
          const docImg = val.find((img) => img.id === item.id)
          if (docImg) Object.assign(item, docImg)
        })
      }
    }
  },
  created() {
    // this.assetId = this.$route.query.assetId;
    // this.assetNo = this.$route.query.assetNo
    // const isReviewQuery = this.$route.query.isReview
    // if (isReviewQuery === 'view') {
    //   this.isReview = false
    // } else {
    //   this.isReview = true
    // }
    // this.isAiPage = this.$route.query.isAiPage
    // this.getStp()
    // this.init()
    // this.getOperatorVerification()
  },
  mounted() {
    // require('./drag.js')

    // document.addEventListener('click', this.closeDropdown)
    // this.initImageCardWidth()
    // this.debounceResize = debounce(this.initImageCardWidth, 200)
    // window.addEventListener('resize', this.debounceResize)
    // window.addEventListener('keydown', this.handleKeyDown)
    // document.addEventListener('wheel', this.handleKeyDown)
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId)
    this.intervalId = null
    this.stoptIntervalId()
    this.supUploadUnlockstopPolling()
    document.removeEventListener('click', this.closeDropdown)
    window.removeEventListener('resize', this.debounceResize)
    window.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('wheel', this.handleKeyDown)
  },
  beforeRouteLeave(to, from, next) {
    this.stoptIntervalId()
    next()
  },

  methods: {

  }
}
</script>

<style lang="stylus" scoped>
.classify {
  // padding: 0px 12px;

  .el-page-header {
    padding: 10px 0 10px 12px;
    height: 54px;
    border-bottom: 1px solid #e8e8e8;

    // line-height: 40px;
    .el-page-header__content__text {
      color: #202D40;
      font-size: 12px;
      font-weight: 400;

      .svg-icon {
        margin-right: 4px;
        margin-left: 16px;
      }
    }

    .page-hader-right {
      .el-button {
        height: 32px;
      }
    }

    .header-main-content {
      margin-left: 12px;
      display: flex;
      align-items: center;
      flex: 1;

      .content-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 24px;
        font-size: 12px;
        font-weight: 400;
        width: 240px;
        white-space: nowrap;

        .attr {
          color: #8492A6;
        }
      }
    }
  }

  .classify-content {
    display: flex;
    height: 100%;

    .classify-content-left {
      // padding-top: 12px;
    }

    .classify-content-content {
      flex: 1;
      padding: 12px;

      // padding-right: 0px;
      >div {
        overflow: auto;
        height: calc(100vh - 78px);
        // display: flex;
        // height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-template-columns: repeat(auto-fit, maxmax(300px, 1fr));
        // grid-template-rows: repeat(auto-fit, minmax(600px, 1fr));
        grid-gap: 30px;
        padding: 20px;

        .Draggble-active {
          background: #f9f9f9;
          padding: 12px;
          border-radius: 8px;
          cursor: move;
        }
      }
    }

    .classify-content-right {
      border-left: 1px solid #e3e8f0;
      width: 120px;
      background: #f7f8fa;
      // padding-left: 12px;
      padding-top: 12px;
    }
  }
}

::v-deep .vue-recycle-scroller__item-wrapper {
  // overflow: auto;
  height: calc(100vh - 78px);
  // display: flex;
  // height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-columns: repeat(auto-fit, maxmax(300px, 1fr));
  // grid-template-rows: repeat(auto-fit, minmax(600px, 1fr));
  grid-gap: 30px;
  // padding: 20px;
}

.dragging {
  opacity: 1;
}

.is-disabled {
  border: 1px solid #b6beca !important;
  color: #b6beca !important;
}

.svg-Class {
  color: #b6beca !important;
  filter: grayscale(100%);
  opacity: 0.6;
}

.is-disabled-primary {
  background: #b6beca !important;
  color: #ffffff !important;
  border: 1px solid #ffffff !important;
  height: 24px;
}
</style>
<style lang="stylus">
.drag-count {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  opacity: 1;
  position: relative;
}

.drag-count-badge {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 255, 0.7);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.dragover {
  background-color: rgba(204, 204, 204, 0.7);
  padding: 12px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  .pandsDialogTip {
    .pandsTop {
      display: flex;
      align-items: center;

      .pandsDialogtext {
        padding-top: 3px;
        font-size: 13px;
        font-weight: 600;
      }
    }
    .pandsBottom {
      padding-left: 29px;
      margin-top: 4px;
    }
  }
}
.dialog-custom.el-dialog {
  .el-dialog__body {
    min-height: 120px;
    padding: 18px 20px 0px;
  }
}
.pandaButtonBox {
  display: flex;
  align-items: center
  .pandaImg {
    // background: #b6beca;
    width: 11px;
    height: 11px;
    position: relative;
    bottom: -1px;
  }
}
</style>
