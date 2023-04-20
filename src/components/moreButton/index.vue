<template>
  <lls-dropdown
    class="configuration-wrapper"
    v-if="servicecon || collect"
    trigger="click"
  >
    <lls-button
      type="text"
      icon="lls-icon-more"
      style="margin-left: 12px; padding: 0"
      >更多</lls-button
    >
    <lls-dropdown-menu slot="dropdown" class="configuration-dropdown">
      <lls-dropdown-item>
        <servicecon-figuration
          :productName="productName"
          type="text"
          v-if="servicecon"
          style="width: 100%"
        ></servicecon-figuration>
      </lls-dropdown-item>
      <lls-dropdown-item>
        <collect-configuration
          :productName="productName"
          type="text"
          :collectName="collectName"
          :plain="false"
          v-if="collect"
          style="width: 100%"
        >
        </collect-configuration>
      </lls-dropdown-item>
    </lls-dropdown-menu>
  </lls-dropdown>
</template>
<script>
export default {
  props: ["productName", "servicecon", "collect", "collectName"],
  name: "moreButton",
  components: {
    collectConfiguration: (resolve) =>
      require(["./collectConfiguration"], resolve), // 收集配置页面
    serviceconFiguration: (resolve) =>
      require(["./serviceconFiguration"], resolve), // 服务管理页面
  },
};
</script>
<style lang="stylus">
.lls-icon-more {
  vertical-align: middle;
}

.configuration-dropdown {
  .lls-dropdown-menu__item {
    line-height: 28px;
    padding: 0 !important;

    .svg-icon {
      display: none;
    }

    &:focus, &:not(.is-disabled):hover {
      background-color: #F7F9FB;
    }

    .lls-button.lls-button--text {
      height: 28px;
      padding: 0 24px;
      width: 100% !important;

      .button-text {
        color: #202D40;
      }
    }
  }
}

.configuration-wrapper {
  display: flex;
  align-items: center;
  height: 18px;
}
</style>