<template>
  <div class="profile">
    <lls-card class="profile-card" body-style="padding:16px 32px 0 32px;">
        <lls-tabs v-model="activeTab" @tab-click="handleClick" show-return-header header-title="建档审核" height="50px">
          <lls-tab-pane label="资产审批" name="first"><lls-empty></lls-empty></lls-tab-pane>
          <lls-tab-pane label="供应商信息" name="second">
            <lls-splitpanes>
              <lls-pane min-size="30" size="70">
                <company-info></company-info>
              </lls-pane>
              <lls-pane min-size="30">
                <directory-tree></directory-tree>
              </lls-pane>
            </lls-splitpanes>
          </lls-tab-pane>
          <lls-tab-pane label="项目公司信息" name="third"><lls-empty></lls-empty></lls-tab-pane>
          <lls-tab-pane label="合规审查" name="fourth"><lls-empty></lls-empty></lls-tab-pane>
          <lls-tab-pane label="审批轨迹" name="fifth"><lls-empty></lls-empty></lls-tab-pane>
        </lls-tabs>
    </lls-card>
  </div>
</template>

<script>
import CompanyInfo from './components/CompanyInfo.vue'
import DirectoryTree from './components/DirectoryTree.vue'

export default {
  name: 'ProfilePage',

  components: {
    CompanyInfo,
    DirectoryTree
  },

  data () {
    return {
      activeTab: 'second'
    }
  },

  methods: {
    handleClick () {},
    goBack () {}
  },

  created () {}
}

</script>

<style lang="stylus" scoped>
.profile {
  position: relative;
  color: #333;
  .profile-card {
    min-height: calc(100vh - 100px);
  }
  ::v-deep .lls-tabs__header {
    margin-bottom: 0;
  }
}

.lls-splitpanes {
  min-height: calc(100vh - 166px);
}

.lls-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 228px);
}
</style>
