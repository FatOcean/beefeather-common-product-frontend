<template>
  <section class="data">
    <lls-card body-style="padding-bottom:50px;">
      <div class="card-title">数据统计</div>
      <div class="data-warper">
        <div class="data-item" v-for="i in assetsData" :key="i.type">
          <div>{{ i.type }}</div>
          <div class="data-num">{{ numToThousands(i.num) }}</div>
        </div>
      </div>
    </lls-card>
  </section>
</template>

<script>
export default {
  data () {
    return {
      assetsData: [
        { type: '待签收资产(元)', num: 28463 },
        { type: '持有资产(元)', num: 63468.12 },
        { type: '待兑付资产(元)', num: 46995 },
        { type: '已兑付资产(元)', num: 8462.32 }
      ]
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

.card-title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}

.data {
  .lls-card {
    margin-bottom: 24px;
  }
  .data-warper {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
  }
  .data-item {
    font-size: 14px;
  }
  .data-num {
    @include NumFontStyle;
    margin-top: 12px;
  }
}
</style>
