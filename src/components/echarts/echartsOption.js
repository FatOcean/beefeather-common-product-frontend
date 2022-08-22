import * as echarts from 'echarts/core'

function pieOptions (options) {
  return {
    color: ['#379CFA', '#FFB933', '#20E275', '#FF7272', '#B26AFF', '#1AD5B7', '#1AD5B7', '#1AD5B7'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      icon: 'circle',
      orient: 'vertical',
      right: 0,
      top: 'center'
    },
    series: [
      {
        name: '饼图',
        type: 'pie',
        radius: ['70%', '90%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        label: {
          position: 'center',
          formatter: [
            `{value|${options.labelValue}}`,
            `{title|${options.labelTitle}}`
          ].join('\n'),
          rich: {
            title: {
              fontSize: 12,
              color: '#999'
            },
            value: {
              fontFamily: 'Rubik',
              fontSize: 30,
              lineHeight: 38
            }
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        data: options.seriesData
      }
    ]
  }
}

function lineOptions (options) {
  return {
    color: [
      '#379CFA'
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisTick: {
        show: false
      },
      data: options.xAxisData
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    grid: {
      left: '0%',
      right: '5%',
      bottom: '0%',
      top: '5%',
      containLabel: true
    },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(155, 204, 250, 1)'
          }, {
            offset: 1,
            color: 'rgba(155, 204, 250, 0)'
          }])
        },
        data: options.seriesData
      }
    ]
  }
}

export { pieOptions, lineOptions }
