<template>
  <lls-dropdown class="configuration-wrapper" v-if="servicecon || collect">
    <lls-button type="text" icon="lls-icon-more" style="margin-left:12px">更多</lls-button>
    <lls-dropdown-menu slot="dropdown" class="configuration-dropdown">
      <lls-dropdown-item>
        <servicecon-figuration :productName="productName" type="text" v-if="servicecon" :requestBody="requestBody"></servicecon-figuration>
      </lls-dropdown-item>
      <lls-dropdown-item>
        <collect-configuration
          :productName="productName"
          type="text"
          :collectName="collectName"
          :plain="false"
          v-if="collect"
        >
        </collect-configuration>
      </lls-dropdown-item>
    </lls-dropdown-menu>
  </lls-dropdown>
</template>
<script>
export default {
  props: ['productName', 'servicecon', 'collect', 'collectName','requestBody'],
  name:'moreButton',
  components: {
    collectConfiguration: (resolve) => require(['./collectConfiguration'], resolve), // 收集配置页面
    serviceconFiguration: (resolve) => require(['./serviceconFiguration'], resolve) // 服务管理页面
  }
}
</script>
<style lang="stylus">
.lls-icon-more{
  vertical-align: middle;
}
.configuration-dropdown {
  .lls-dropdown-menu__item {
    line-height: 28px;

    .svg-icon {
      display: none;
    }

    &:focus, &:not(.is-disabled):hover {
      background-color: #F7F9FB;
    }

    .lls-button.lls-button--text {
      height: 28px;
      padding: 0;

      .button-text {
        color: #202D40;
      }
    }
  }
}

.document-ocr-wrapper {
  position: relative;
  padding: 0 !important;
  height: 100%;

  iframe {
    width: calc(100% + 24px);
    margin: -48px -12px -12px -12px;
    height: calc(100% + 60px);
    overflow: hidden;

    &.fixed {
      margin: 0;
      z-index: 9999;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>