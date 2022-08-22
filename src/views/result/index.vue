<template>
  <div class="result">
    <lls-card class="result-card" body-style="padding:16px 32px 32px;">
      <lls-tabs class="result-tabs" v-model="activeTab" @tab-click="handleClick" show-return-header height="50px">
        <lls-tab-pane label="资产审批" name="first"><lls-empty></lls-empty></lls-tab-pane>
        <lls-tab-pane label="自动化核查" name="second">
          <check></check>
        </lls-tab-pane>
        <lls-tab-pane label="项目公司信息" name="third"><lls-empty></lls-empty></lls-tab-pane>
        <lls-tab-pane label="合规审查" name="fourth"><lls-empty></lls-empty></lls-tab-pane>
        <lls-tab-pane label="审批轨迹" name="fifth"><lls-empty></lls-empty></lls-tab-pane>
      </lls-tabs>
    </lls-card>
  </div>
</template>

<script>
import Check from './components/Check'

export default {
  name: 'ResultPage',

  components: {
    Check
  },

  data () {
    return {
      activeTab: 'second'
    }
  },

  methods: {
    goBack () {},
    handleClick () {}
  },

  created () {}
}

</script>

<style lang="stylus" scoped>
.result {
  color: #333;
  .result-card {
    min-height: calc(100vh - 100px);
  }
  .result-tabs {
    &>::v-deep .lls-tabs__header {
      margin-bottom: 0;
    }
  }
}

.lls-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 228px);
}
</style>
