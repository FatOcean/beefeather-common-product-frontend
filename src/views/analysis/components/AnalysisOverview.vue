<template>
  <section class="overview">
    <lls-row :gutter="24">
      <lls-col :span="12" :lg="6">
        <lls-card class="total-assets">
          <i class="lls-icon-info"></i>
          <div class="total-title">总资产金额</div>
          <div class="total-num">¥ {{ numToThousands(totalAssets) }}</div>
        </lls-card>
      </lls-col>
      <lls-col :span="12" :lg="6">
        <lls-card class="task" body-style="display:flex;">
          <div class="icon-warper handling">
            <i class="lls-icon-s-check"></i>
          </div>
          <div class="task-content">
            <span class="task-title">待办理任务</span>
            <span class="task-num">372</span>
          </div>
        </lls-card>
      </lls-col>
      <lls-col :span="12" :lg="6">
        <lls-card class="task" body-style="display:flex;" >
          <div class="icon-warper pending">
            <i class="lls-icon-s-flag"></i>
          </div>
          <div class="task-content">
            <span class="task-title">待领取任务</span>
            <span class="task-num">426</span>
          </div>
        </lls-card>
      </lls-col>
      <lls-col :span="12" :lg="6">
        <lls-card class="feedback" body-style="display:flex;flex-direction:column;">
          <span class="feedback-title">意见反馈</span>
          <span>期待你的声音</span>
        </lls-card>
      </lls-col>
    </lls-row>
  </section>
</template>

<script>
export default {
  data () {
    return {
      totalAssets: 78126
    }
  }
}
</script>

<style lang="stylus" scoped>
@mixin NumFontStyle {
  font-size: 32px;
  line-height: 38px;
  font-family: "Rubik";
}

.overview {
  .lls-card {
    flex: 1;
    margin-bottom: 24px;
    height: 140px;
    ::v-deep .lls-card__body {
      padding: 36px;
    }
    &.feedback {
      ::v-deep .lls-card__body {
        padding: 44px 36px;
      }
    }
  }
}

.total-assets {
  position: relative;
  color: #fff;
  background: linear-gradient(45deg, #179BFF, #0887FF);
  &.lls-card, &.lls-card:focus, &.lls-card:hover {
    box-shadow: 0 10px 20px 8px rgba(8,135,255,0.16);
  }
  .lls-icon-info {
    position: absolute;
    top: 24px;
    right: 25px;
    opacity: 0.6;
  }
  .total-title {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 5px;
  }
  .total-num {
    @include NumFontStyle;
  }
}

.task {
  .icon-warper {
    width: 66px;
    height: 66px;
    border-radius: 16px;
    font-size: 30px;
    text-align: center;
    line-height: 66px;
    color: #fff;
    margin-right: 24px;
  }
  .handling {
    background-color: #0887FF;
  }
  .pending {
    background-color: #FCB813;
  }
  .task-content {
    display: flex;
    flex-direction: column;
    .task-title {
      font-size: 14px;
      line-height: 22px;
      color: #666;
      margin-bottom: 4px
    }
    .task-num {
      @include NumFontStyle;
    }
  }
}

.feedback {
  font-size: 14px;
  line-height: 14px;
  color: #666;
  background-image: url('../assets/icon_bee.png');
  background-position: 140px -5px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  .feedback-title {
    font-size: 24px;
    line-height: 24px;
    color: #333;
    margin-bottom: 12px;
    font-weight: bold;
  }
}
</style>
