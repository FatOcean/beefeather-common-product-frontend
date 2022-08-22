<template>
  <div ref="dom" :style="{width, height}"></div>
</template>

<script>
import { pieOptions } from './echartsOption'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

export default {
  props: {
    seriesData: Array,
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '200px'
    },
    labelTitle: String
  },

  data () {
    return {
      myChart: null
    }
  },

  watch: {
    seriesData () {
      this.setOption()
    }
  },

  methods: {
    init () {
      const chartDom = this.$refs.dom
      this.myChart = echarts.init(chartDom)
      this.setOption()
    },
    setOption () {
      if (!this.myChart) return
      const labelValue = this.seriesData.reduce((pre, cur) => pre + cur.value, 0)
      const option = pieOptions({
        labelValue: labelValue,
        labelTitle: this.labelTitle,
        seriesData: this.seriesData
      })
      this.myChart.setOption(option)
    }
  },

  mounted () {
    this.init()
  },

  beforeDestroy () {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  }
}
</script>

<style>
</style>
