<template>
  <div ref="dom" :style="{width, height}"></div>
</template>

<script>
import { lineOptions } from './echartsOption'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    xAxisData: Array,
    seriesData: Array
  },

  data () {
    return {
      myChart: null
    }
  },

  watch: {
    xAxisData () {
      this.setOption()
    },
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
      const option = lineOptions({
        xAxisData: this.xAxisData,
        seriesData: this.seriesData
      })
      this.myChart.setOption(option)
    },
    resize () {
      this.myChart && this.myChart.resize()
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
