<template>
  <div class="moduleBoardWrap">
    <div class="scrollBoard">
      <ScrollBoard :config="config" style="width:100%;height:100%" />
    </div>
    <div class="lineWrap">
      <v-chart :option="chartOption" class="chart" />
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import ScrollBoard from '@/views/platformBoard/components/ScrollBoard.vue'
import _ from 'lodash-es'
import dayjs from 'dayjs';
const props = defineProps({
  chartData: {
    type: Object,
    default: () => { }
  }
})

const chartOption = ref({});

const config = ref({})
const dataList = ref([])
const monthList = ref([])

const initTable = () => {
  monthList.value = Object.keys(props.chartData[0]).filter(item => item !== 'systemTemp').map(item => `${dayjs(item).get('month') + 1}月`)

  const yearMonthList = Object.keys(props.chartData[0]).filter(item => item !== 'systemTemp');

  dataList.value = props.chartData.map(item => {
    // 根据 monthList 的顺序提取对应的数据值
    const values = yearMonthList.map(month => item[month] || 0);
    return [item.systemTemp, ...values];
  });
  console.log('dataList.value:', dataList.value)

  config.value = {
    header: ['', ...monthList.value],
    data: dataList.value,
    columnWidth: [80],
    align: ['center'],
    headerBGC: "#043C64",
    oddRowBGC: "#051841",
    evenRowBGC: 'transparent',
  }

}
const initChart = () => {
  console.log(props.chartData)
  const colorList = ['#52F5F9', '#0C98EB']

  const seriesData = props.chartData.map((item, index) => {
    const _item = _.cloneDeep(item)
    delete _item.systemTemp
    const dataList = Object.values(_item)
    return {
      name: item.systemTemp,
      type: 'line',
      smooth: false, //是否平滑曲线显示
      showSymbol: true,

      itemStyle: {
        color: colorList[index],
        borderColor: colorList[index],
        borderWidth: 1,
      },
      lineStyle: {
        normal: {
          width: 3,
          color: colorList[index],
        },
      },
      data: dataList,
    }
  })

  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,95,182,0.5)',
      textStyle: {
        color: '#fff',
      },
      showContent: true,
    },
    legend: {
      show: false,
    },
    grid: {
      left: '5%',
      right: '0',
      bottom: '5%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#334984',
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      //轴线上的字
      axisLabel: {
        show: true,
        textStyle: {
          color: '#BACDF5',
          fontSize: 12,
          lineHeight: 20,
        },
        rotate: 45, // 添加这行，使标签倾斜45度
        // formatter: function (value) {
        //   // 将每个字符换行显示
        //   return value.split('').join('\n');
        // }
      },
      data: monthList.value
    },
    yAxis: [
      {
        nameTextStyle: {
          color: 'rgba(255,255,255,0.8)',
        },
        type: 'value',
        axisTick: {
          show: false,
        },
        //轴线上的字
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: '12',
            color: 'rgba(255,255,255,0.5)',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#334984',
          },
        },
        //网格线
        splitLine: {
          lineStyle: {
            color: '#334984',
            type: 'dashed',
          },
        },
      },
    ],
    series: seriesData,
  };
};


// ====== Mock 数据（预览用，不影响原有逻辑）======
const mockData = () => {
  config.value = {
    header: ['系统', '1月', '2月', '3月', '4月', '5月', '6月'],
    data: [
      ['管理系统', '128', '256', '312', '198', '276', '345'],
      ['监控平台', '87', '143', '201', '165', '189', '224'],
      ['数据中心', '342', '298', '376', '412', '389', '456'],
      ['运维系统', '56', '78', '92', '104', '87', '115'],
      ['安全平台', '213', '187', '245', '278', '256', '301'],
      ['网关服务', '167', '198', '223', '189', '214', '267'],
      ['日志系统', '94', '112', '134', '156', '143', '178'],
      ['消息队列', '278', '312', '356', '334', '367', '401'],
    ],
    columnWidth: [80],
    align: ['center'],
    headerBGC: '#043C64',
    oddRowBGC: '#051841',
    evenRowBGC: 'transparent',
    rowNum: 5,
    waitTime: 2000,
  }
}

onMounted(() => {
  // 没有真实数据时使用 mock 数据预览
  if (!props.chartData || !Object.keys(props.chartData).length) {
    mockData()
  }
})

watch(() => props.chartData, () => {
  initTable();
  initChart();
}, { deep: true })

</script>

<style lang="less" scoped>
.moduleBoardWrap {
  display: flex;
  align-items: center;
  padding-left: 20px;
  width: 100%;
  height: 100%;

  .scrollBoard {
    width: 65%;
    height: 100%;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .lineWrap {
    width: 35%;
    height: 100%;

  }
}
</style>