<template>
  <div class="el-page-header">
    <div class="el-page-header__left" @click="$emit('back')">
      <i class="el-icon-back"></i>
      <div class="el-page-header__title" style="line-height: 40px">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="增值税发票" name="first"></el-tab-pane>
        <el-tab-pane label="提货单" name="second"></el-tab-pane>
        <el-tab-pane label="合同" name="third"></el-tab-pane>
        <el-tab-pane label="流水" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="el-page-header__right">
        <el-button type="primary" @click="handleClick">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElPageHeader",

  props: {
    title: {
      type: String,
      default() {
        return "单据分组";
      },
    },
    content: String,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style scoped>
.el-page-header {
  margin-bottom: 0px;
}
::v-deep .el-tabs__header {
  margin-bottom: 0px;
}
.el-page-header__right {
  margin-left: auto;
}
</style>
