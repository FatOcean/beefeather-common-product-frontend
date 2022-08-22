<template>
  <div class="company-info">
    <div class="title">
      企业基本信息
    </div>
    <div class="second-title">
      <div class="line-v"></div>
      <div>融资详情</div>
      <div class="line-h"></div>
    </div>
    <div class="item-wapper">
      <div class="item">
        <span class="item-title">融资申请编号</span>
        <lls-input value="A202008120000001" placeholder="请输入"></lls-input>
      </div>
      <div class="item">
        <span class="item-title">期望融资金额</span>
        <lls-input value="5,000,000.00" placeholder="请输入"><span slot="suffix">元</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">融资起始日期</span>
        <lls-input value="2020-06-01" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">融资截止日期</span>
        <lls-input value="2020-06-01" placeholder="请输入"></lls-input>
      </div>
      <div class="item">
        <span class="item-title">融资期限</span>
        <lls-input value="24" placeholder="请输入" short><span slot="suffix">月</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">尾款金额</span>
        <lls-input value="3,000,000.00" placeholder="请输入"><span slot="suffix">元</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">融资申请本金</span>
        <lls-input value="" placeholder="请输入"><span slot="suffix">元</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">第三方资产估值</span>
        <lls-input value="10,000,000.00" placeholder="请输入" disabled><span slot="suffix">元</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">融资利率(年化)</span>
        <lls-input value="24" placeholder="请输入" short><span slot="suffix">%</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">还款方式</span>
        <lls-input value="等额本金-按月" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">逾期利率(年化)</span>
        <lls-input value="5" placeholder="请输入" short><span slot="suffix">%</span></lls-input>
      </div>
      <div class="item">
        <span class="item-title">宽限期</span>
        <lls-input value="0" placeholder="请输入" short><span slot="suffix">天</span></lls-input>
      </div>
    </div>
    <div class="second-title">
      <div class="line-v"></div>
      <div>收款银行账号</div>
      <div class="line-h"></div>
    </div>
    <div class="item-wapper">
      <div class="item">
        <span class="item-title">收款账户名</span>
        <lls-input value="中国吉祥航空股份有限公司" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">收款银行</span>
        <lls-input value="中国民生银行" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">收款账号</span>
        <lls-input value="0000 0000000000 000" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">收款银行所在省市</span>
        <lls-input value="广东省深圳市" placeholder="请输入" disabled></lls-input>
      </div>
      <div class="item">
        <span class="item-title">收款银行所在支行</span>
        <lls-input value="广东省深圳市" placeholder="请输入" disabled></lls-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@mixin title-font {
  color: #000;
  font-size: 14px;
  font-weight: bold;
}

.company-info {
  padding: 16px 16px 16px 0;
  .title {
    @include title-font;
    height: 32px;
    line-height: 32px;
    background-color: #EEF2F6;
    border-radius: 4px;
    padding-left: 17px;
  }
  .second-title {
    @include title-font;
    display: flex;
    align-items: center;
    height: 14px;
    line-height: 14px;
    padding-left: 16px;
    margin-top: 20px;
    .line-v {
      width: 4px;
      height: 12px;
      border-radius: 3px;
      background-color: #0887FF;
      margin-right: 5px;
    }
    .line-h {
      flex-grow: 1;
      height: 0;
      border-bottom: 1px dashed #E9E9E9;
      margin-left: 8px;
    }
  }
}
.item-wapper {
  display: flex;
  flex-wrap: wrap;
  .item {
    display: flex;
    width: 50%;
    min-width: 300px;
    margin-top: 20px;
    .item-title {
      width: 105px;
      font-size: 12px;
      line-height: 32px;
      text-align: right;
      margin-right: 8px;
    }
    .lls-input {
      width: auto;
      flex-grow: 1;
      max-width: 260px;
      &.is-short {
        max-width: 88px;
      }
      ::v-deep .lls-input__suffix {
        right: 11px;
        font-size: 12px;
      }
    }
  }
}
</style>
