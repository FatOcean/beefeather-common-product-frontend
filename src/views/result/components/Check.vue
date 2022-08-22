<template>
  <lls-tabs v-model="activeName" @tab-click="handleClick" subscript="simple" height="45px">
    <lls-tab-pane name="first">
      <span slot="label">贸易合同<lls-badge value="4" style="margin-top: 7px"></lls-badge></span>
      <check-result></check-result>
    </lls-tab-pane>
    <lls-tab-pane name="second">
      <span slot="label">发票<lls-badge value="10" style="margin-top: 7px"></lls-badge></span>
      <lls-empty></lls-empty>
    </lls-tab-pane>
    <lls-tab-pane name="third">
      <span slot="label">合同要素AI提取</span>
      <lls-empty></lls-empty>
    </lls-tab-pane>
  </lls-tabs>
</template>

<script>
import CheckResult from './CheckResult'

export default {
  components: {
    CheckResult
  },

  data () {
    return {
      activeName: 'first'
    }
  },

  methods: {
    handleClick () {}
  }
}
</script>

<style lang="stylus" scoped>
</style>
