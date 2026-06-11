<template>
  <div class="complete-pie">
    <v-chart :option="chartOption" class="chart" ref="myChart" autoresize />
  </div>
</template>

<script setup>
import * as echarts from 'echarts';

const defaultList = [
  {
    taskNums: 0,
    taskState: 2,
    taskStateName: '已完成',
    color: '#43CF7C',
  },
  {
    taskNums: 0,
    taskState: 1,
    taskStateName: '进行中',
    color: '#FFEB3B',
  },
  {
    taskNums: 0,
    taskState: 3,
    taskStateName: '变更中',
    color: '#D43030',
  },
  {
    taskNums: 0,
    taskState: 0,
    taskStateName: '未开始',
    color: '#66B2C8',
  },
];

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});
const myChart = ref(null);
const timer = ref(null);
let angle = 0;

const buildDataList = () => {
  const source = Array.isArray(props.chartData) ? props.chartData : [];
  return defaultList.map((item) => {
    const valueObj = source.find((v) => v.taskState === item.taskState);
    return {
      name: item.taskStateName,
      value: valueObj ? Number(valueObj.taskNums) || 0 : 0,
      color: item.color,
    };
  });
};

const buildPieData = (dataList) => {
  const orderNames = ['已完成', '进行中', '变更中'];
  const data1 = orderNames
    .map((name) => dataList.find((x) => x.name === name))
    .filter((row) => row && row.value > 0)
    .map((row) => ({
      ...row,
      itemStyle: { color: row.color },
    }));

  if (!data1.length) {
    data1.push({
      name: '暂无',
      value: 1,
      itemStyle: { color: 'rgba(255,255,255,0.15)' },
    });
  }
  return data1;
};

const buildOption = (data1, sum) => ({
  tooltip: {
    show: true,
    trigger: 'item',
  },
  title: {
    text: `{a|${sum}}\n{b|总任务}`,
    left: 'center',
    top: '34%',
    textStyle: {
      rich: {
        a: {
          color: '#ffffff',
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 42,
          textAlign: 'center',
        },
        b: {
          color: 'rgba(255,255,255,0.88)',
          fontSize: 14,
          padding: [8, 0, 0, 0],
          textAlign: 'center',
        },
      },
    },
  },
  legend: {
    left: 'center',
    bottom: '4%',
    icon: 'circle',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 20,
    data: data1.map((d) => d.name).filter((n) => n !== '暂无'),
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
    selectedMode: false,
  },
  series: [
    {
      name: '总任务',
      type: 'pie',
      center: ['50%', '42%'],
      radius: ['28%', '50%'],
      avoidLabelOverlap: false,
      hoverAnimation: false,
      label: { show: false },
      emphasis: {
        label: { show: false },
      },
      labelLine: { show: false },
      data: data1,
    },
    {
      type: 'custom',
      coordinateSystem: 'none',
      silent: true,
      data: [0],
      renderItem(params, api) {
        const r = Math.min(api.getWidth(), api.getHeight()) / 2;
        const center = {
          x: api.getWidth() * 0.5,
          y: api.getHeight() * 0.42,
        };
        const rBig = r * 0.78;
        const rSmall = r * 0.66;
        const bigSector = [];
        const smallSector = [];
        const sectorSize = 60;
        const sectorInterval = 30;
        const bigStartAngle = 310;

        for (let i = 0; i < 4; i += 1) {
          const startAngle =
            ((i * (sectorInterval + sectorSize) + bigStartAngle) * Math.PI) / 180;
          const endAngle = startAngle + (sectorSize * Math.PI) / 180;
          const smallStartAngle =
            (Math.PI / 180) * (280 + angle + i * (sectorSize + sectorInterval));
          const smallEndAngle = smallStartAngle + (sectorSize * Math.PI) / 180;

          bigSector.push({
            type: 'sector',
            shape: {
              cx: center.x,
              cy: center.y,
              r: rBig,
              r0: rBig * 0.93,
              startAngle,
              endAngle,
            },
            style: {
              fill: '#00C1BD',
              lineWidth: 1,
            },
          });
          smallSector.push({
            type: 'sector',
            shape: {
              cx: center.x,
              cy: center.y,
              r: rSmall * 0.93,
              r0: rSmall * 0.87,
              startAngle: smallStartAngle,
              endAngle: smallEndAngle,
            },
            style: {
              fill: '#19ECFF',
              lineWidth: 2,
            },
          });
        }

        return {
          type: 'group',
          children: [
            {
              type: 'group',
              children: [
                ...bigSector,
                {
                  type: 'arc',
                  shape: {
                    cx: center.x,
                    cy: center.y,
                    r: rBig,
                  },
                  style: {
                    fill: 'transparent',
                    stroke: '#19ECFF',
                    lineWidth: 2,
                  },
                },
              ],
            },
            {
              type: 'group',
              children: [
                ...smallSector,
                {
                  type: 'arc',
                  shape: {
                    cx: center.x,
                    cy: center.y,
                    r: rSmall,
                  },
                  style: {
                    fill: 'transparent',
                    stroke: '#19ECFF',
                    lineWidth: 2,
                  },
                },
              ],
            },
          ],
        };
      },
    },
  ],
});

const initChart = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }

  const dataList = buildDataList();
  const data1 = buildPieData(dataList);
  const sum = dataList.reduce((total, item) => total + item.value, 0);
  const option = buildOption(data1, sum);

  chartOption.value = option;
  angle = 0;

  const play = () => {
    angle += 3;
    myChart.value?.setOption(buildOption(data1, sum), { notMerge: false, lazyUpdate: true });
  };

  nextTick(() => {
    myChart.value?.setOption(option);
    timer.value = setInterval(() => {
      requestAnimationFrame(play);
    }, 50);
  });
};

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

watch(
  () => props.chartData,
  () => {
    initChart();
  },
  { deep: true, immediate: true },
);
</script>

<style lang="less" scoped>
.complete-pie {
  width: 42%;
  height: 100%;
  min-width: 260px;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
