<template>
  <section class="chart">
    <lls-row :gutter="24">
      <lls-col :span="24" :md="10" :lg="8">
        <lls-card>
          <div class="card-title">数据统计图表</div>
          <div class="chart-warper">
            <c-pie-chart :seriesData="pie.seriesData" labelTitle="汇总统计"/>
          </div>
        </lls-card>
      </lls-col>
      <lls-col :span="24" :md="14" :lg="16">
        <lls-card>
          <div class="card-title">数据统计图表</div>
          <div class="chart-warper" ref="lineChartWarper">
            <c-line-chart ref="lineChart" :xAxisData="line.xAxisData" :seriesData="line.seriesData"></c-line-chart>
          </div>
        </lls-card>
      </lls-col>
    </lls-row>
  </section>
</template>

<script>
import CPieChart from '@/components/echarts/CPieChart'
import CLineChart from '@/components/echarts/CLineChart'

export default {
  components: {
    CPieChart,
    CLineChart
  },

  data () {
    return {
      pie: {
        seriesData: [
          { value: 300, name: '统计数据1' },
          { value: 150, name: '统计数据2' },
          { value: 80, name: '统计数据3' },
          { value: 60, name: '统计数据4' },
          { value: 80, name: '统计数据5' },
          { value: 40, name: '统计数据6' },
          { value: 20, name: '统计数据7' }
        ]
      },
      line: {
        xAxisData: ['2020-2', '2020-3', '2020-4', '2020-5', '2020-6', '2020-7'],
        seriesData: [280, 110, 720, 320, 650, 580]
      },
      resizeObserver: null
    }
  },

  mounted () {
    this.resizeObserver = new ResizeObserver(entries => {
      this.$refs.lineChart.resize()
    })
    this.resizeObserver.observe(this.$refs.lineChartWarper)
  },

  beforeDestroy () {
    this.resizeObserver.unobserve(this.$refs.lineChartWarper)
  }
}
</script>

<style scoped lang="stylus">
.lls-card {
  margin-bottom: 24px;
}

.card-title {
  margin-bottom: 24px;
}

.chart-warper {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
