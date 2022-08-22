<template>
  <div class="table-list">
    <lls-card class="table-list-card" body-style="padding:16px 32px;">
        <lls-tabs v-model="activeTab" @tab-click="handleClick" height="50px">
          <template v-slot:button>
            <lls-button icon="lls-icon-download" type="common" plain>下载</lls-button>
            <lls-button icon="lls-icon-plus" type="primary">新增</lls-button>
          </template>
          <lls-tab-pane label="标题标题" name="first">
            <query></query>
            <div class="amount">
              <div>合计金额(元)：<span class="num">{{ numToThousands(value1) }}</span></div>
              <div>合计金额(元)：<span class="num">{{ numToThousands(value2) }}</span></div>
            </div>
            <query-table :tableData="tableData" :currentPage="1"></query-table>
          </lls-tab-pane>
          <lls-tab-pane label="标题标题" name="second">
            <lls-empty></lls-empty>
          </lls-tab-pane>
          <lls-tab-pane label="标题标题" name="third">
            <lls-empty></lls-empty>
          </lls-tab-pane>
        </lls-tabs>
    </lls-card>
  </div>
</template>

<script>
import Query from './components/Query.vue'
import QueryTable from './components/QueryTable.vue'

export default {
  name: 'TableListPage',

  components: {
    Query,
    QueryTable
  },

  data () {
    return {
      activeTab: 'first',
      value1: 132343000,
      value2: 56800000,
      tableData: []
    }
  },

  methods: {
    handleClick () {}
  },

  created () {
    // 模拟数据
    setTimeout(() => {
      const tableDataItem = {
        content1: '正文内容',
        num: 467333,
        content2: '正文内容',
        status: 'processing',
        content3: '正文内容'
      }
      const tableData = []
      for (let i = 0; i < 10; i++) {
        tableData[i] = Object.assign({}, tableDataItem)
        tableData[i].index = i + 1
        if (i % 3 === 0) tableData[i].status = 'warning'
      }
      this.tableData = tableData
    }, 0)
  }
}

</script>

<style scoped lang="stylus">
.table-list {
  color: #333;
  .table-list-card {
    min-height: calc(100vh - 100px);
  }
}

.amount {
  display: flex;
  font-size: 14px;
  margin-bottom: 8px;
  >div + div {
    margin-left: 24px;
  }
  .num {
    font-family: "Rubik";
    color: #F5A623;
    font-size: 16px;
  }
}

.lls-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 228px);
}
</style>
