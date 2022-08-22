<template>
  <div class="analysis">
    <analysis-overview></analysis-overview>
    <analysis-data></analysis-data>
    <analysis-chart></analysis-chart>
    <analysis-table :tableData="tableData" :currentPage="1"></analysis-table>
  </div>
</template>

<script>
import AnalysisTable from './components/AnalysisTable'
import AnalysisChart from './components/AnalysisChart'
import AnalysisOverview from './components/AnalysisOverview'
import AnalysisData from './components/AnalysisData.vue'

export default {
  name: 'AnalysisPage',

  components: {
    AnalysisTable,
    AnalysisChart,
    AnalysisOverview,
    AnalysisData
  },

  data () {
    return {
      tableData: []
    }
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
</style>
