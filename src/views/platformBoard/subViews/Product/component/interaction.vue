<template>
  <div style="width: 90%; height: 100%">
    <v-chart :option="chartOption" class="chart" style="margin-left: 40px" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const chartOption = ref({});

const props = defineProps({
  chartData: {
    type: Object,
    default: () => {},
  },
});

// 定义分段名称映射 - 对应每个分段的实际产品型号
const segmentNames = {
  动车组产品平台: {
    1: 'CRH5型动车组',
    2: 'CRH380型动车组',
    3: 'CR300BF型动车组',
    4: 'CR400BF型动车组',
    5: 'CR450型动车组',
  },
  铁路客车产品平台: {
    1: '25G/T型铁路客车',
    2: 'CR200J动力集中动车组',
  },
  城际列车产品平台: {
    1: 'CRH3A型动车组',
    2: 'CJ5E型动车组',
  },
  市域列车产品平台: {
    1: '市域A型车',
    2: '市域B型车',
    3: '市域C型车',
    4: '市域D型车',
  },
  地铁列车产品平台: {
    1: '地铁A型列车',
    2: '地铁B型列车',
    3: '地铁C型列车',
  },
  有轨电车产品平台: {
    1: '100%低地板列车',
    2: '70%低地板列车',
    3: '中高地板铰接列车',
  },
  磁浮列车产品平台: {
    1: '小型磁浮列车',
    2: '中低速磁浮列车',
    3: '常导高速磁浮列车',
    4: '超导高速磁浮列车',
  },
  单轨列车产品平台: {
    1: 'A型单轨列车',
    2: 'B型单轨列车',
    3: 'S型单轨列车',
  },
  特种制式列车产品平台: {
    1: '电子导向列车',
    2: '胶轮导轨列车',
    3: '直线电机列车',
    4: '齿轨山地列车',
  },
};

const initChart = () => {
  const keys = Object.keys(props.chartData);
  let xData = keys.map(item => props.chartData[item].name);
  let seriesData = keys.map(item => props.chartData[item].num);

  console.log('xData:', xData);
  console.log('seriesData:', seriesData);

  // 生成颜色列表
  const generateColors = count => {
    const baseColors = ['#e74a05', '#80d3f8', '#c58048', '#07fc46', '#667ffb', '#1ce6c7', '#fd5502', '#1ce6c7', '#15728C', '#92D1DE'];
    let colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // 获取最大分段数来生成颜色
  const maxSegments = Math.max(...seriesData);
  const colorList = generateColors(maxSegments);

  chartOption.value = {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%', // 增加底部空间用于显示X轴标签
      top: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const platformName = params.name;
        const segmentIndex = params.seriesIndex;
        const segmentNumber = segmentIndex + 1;

        let segmentName = '';
        if (segmentNames[platformName] && segmentNames[platformName][segmentNumber]) {
          segmentName = segmentNames[platformName][segmentNumber];
        } else {
          segmentName = `产品型号${segmentNumber}`;
        }

        return `
          <div style="font-size: 12px; padding: 8px; min-width: 180px;">
            <div style="font-weight: bold; margin-bottom: 6px; color: #1890ff; padding-bottom: 3px;">
              ${platformName}
            </div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${params.color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="font-size: 13px;">${segmentName}</span>
            </div>
          </div>
        `;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#1890ff',
      borderWidth: 1,
      textStyle: {
        color: '#333',
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        rotate: 30, // 减小旋转角度
        textStyle: {
          color: '#fff',
          fontSize: 11, // 减小字体大小
          fontWeight: 'normal',
        },
        margin: 10, // 减小边距
        // 截断过长的标签
        formatter: function (value) {
          if (value.length > 6) {
            return value.substring(0, 6) + '...';
          }
          return value;
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '',
      nameTextStyle: {
        color: 'transparent', // 隐藏名称
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        show: true,
        textStyle: {
          fontSize: 12, // 减小字体大小
          color: '#CCCCCC',
          fontWeight: 'normal',
        },
      },
      splitLine: {
        show: false,
      },
      min: 0,
      max: maxSegments,
      interval: 1, // 确保显示整数刻度
    },
    series: (function () {
      let series = [];

      for (let i = 0; i < maxSegments; i++) {
        let datas = [];
        let segmentNumber = i + 1;

        for (let j = 0; j < seriesData.length; j++) {
          if (seriesData[j] > i) {
            datas.push(1);
          } else {
            datas.push(0);
          }
        }

        let serie = {
          name: `产品型号${segmentNumber}`,
          type: 'bar',
          stack: 'total',
          barWidth: '25px', // 减小柱状图宽度
          barMinHeight: 1, // 设置最小高度
          data: datas,
          itemStyle: {
            color: colorList[i],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          tooltip: {
            formatter: function (params) {
              const platformName = params.name;
              const segmentNum = segmentNumber;

              let productName = '';
              if (segmentNames[platformName] && segmentNames[platformName][segmentNum]) {
                productName = segmentNames[platformName][segmentNum];
              } else {
                productName = `产品型号${segmentNum}`;
              }

              return `
                <div style="font-size: 12px; padding: 6px;">
                  <div style="font-weight: bold; color: #1890ff; margin-bottom: 4px;">${platformName}</div>
                  <div>产品型号: <strong>${productName}</strong></div>
                </div>
              `;
            },
          },
        };

        series.push(serie);
      }

      return series;
    })(),
  };
};

// 监听数据变化
watch(
  () => props.chartData,
  val => {
    if (val && Object.keys(val).length > 0) {
      initChart();
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="less" scoped></style>
