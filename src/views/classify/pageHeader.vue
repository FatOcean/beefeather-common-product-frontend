<template>
  <div class="el-page-header">
    <div class="el-page-header__left" @click="$emit('back')">
      <i class="el-icon-back"></i>
      <div class="el-page-header__title" style="line-height: 40px">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <el-tabs v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in mockData" :key="item.value" :label="item.name" :name="item.value"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="el-page-header__right">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
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
    mockData: {
      type: Array,
      default() {
        return [];
      },
    },
    activeName: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      currentTab: this.activeName,
    };
  },
  watch: {
    activeName(newVal) {
      this.currentTab = newVal;
    },
  },
  methods: {
    handleClick(tab, event) {
      this.$emit('tab-change', tab.name);
    },
    handleSubmit() {
      this.$emit('submit');
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
