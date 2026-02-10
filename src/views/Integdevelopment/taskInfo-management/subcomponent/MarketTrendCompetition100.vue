<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import * as echarts from 'echarts';
const { TabPane: ATabPane } = ATabs;
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { forEach } from 'mathjs';

const props = defineProps({
  paramDisabled: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const taskId = ref<any>(0);
const planId = ref<any>(0);
const tableData = ref<any>([]);
const operateFlag = ref<any>('calc(100vh - 550px)');

const xaxisData = ref<any>([]);
const seriesY1 = ref<any>([]);
const seriesY2 = ref<any>([]);
const seriesY3 = ref<any>([]);
const seriesY4 = ref<any>([]);
const option = ref<any>(null);
const option2 = ref<any>(null);
const option3 = ref<any>(null);
const option4 = ref<any>(null);
const bgColor0 = ref<any>('');

async function initInfo(taskIds: any, planIds: any) {
  taskId.value = taskIds;
  planId.value = planIds;
  xaxisData.value = [];
  //查询数据列表
  const res = await AdminApiProductPlanTaskDesign.productTaskMarketPatternList({
    taskId: taskId.value,
    planId: planId.value,
  });

  tableData.value = res.data.data;
  // 获取图表信息
  nextTick(() => {
    debugger;
    let seriesValue = ref<any>([]);
    let seriesValue2 = ref<any>([]);
    let technicalStrengthStr = ref<any>([]);
    let productInnovationStr = ref<any>([]);
    let costAdvantageStr = ref<any>([]);
    let xaxisChartData = ref<any>([]);
    let xaxisChartDatas = ref<any>([]);
    let xaxisChartDatas2 = ref<any>([]);
    let colorStr = ref<any>([
      'rgba(247, 165, 165, 0.4)',
      'rgba(149, 146, 241, 0.4)',
      'rgba(126, 231, 243, 0.4)',
      'rgba(126, 243, 197, 0.4)',
      'rgba(118, 227, 130, 0.4)',
      'rgba(212, 227, 90, 0.4)',
      'rgba(149, 146, 241, 0.4)',
      'rgba(126, 231, 243, 0.4)',
      'rgba(126, 243, 197, 0.4)',
      'rgba(118, 227, 130, 0.4)',
      'rgba(247, 165, 165, 0.4)',
      'rgba(149, 146, 241, 0.4)',
      'rgba(126, 231, 243, 0.4)',
      'rgba(126, 243, 197, 0.4)',
      'rgba(118, 227, 130, 0.4)',
    ]);
    forEach(tableData.value, (item, index) => {
      xaxisData.value.push(item.companyName);
      seriesY1.value.push(item.marketShare);
      seriesY2.value.push(item.technicalStrength);
      seriesY3.value.push(item.productInnovation);
      seriesY4.value.push(item.costAdvantage);
      xaxisChartData.value.push({
        name: item.companyName,
        value: item.marketShare,
      });
      xaxisChartDatas2.value.push({
        value: item.marketShare,
        label: item.companyName,
        color: colorStr.value[index],
      });
      xaxisChartDatas.value.push([item.technicalStrength, item.marketShare]);
      seriesValue.value.push({
        name: item.companyName,
        type: 'radar',
        symbol: 'circle', // 数据点形状（circle/rect等）
        symbolSize: 6, // 数据点大小
        lineStyle: { width: 2 }, // 连线样式
        itemStyle: { color: colorStr.value[index] }, // 直接指定线条颜色
        areaStyle: {
          // 填充区域样式
          // 数组colorStr中随机获取
          color: colorStr.value[index],
          // color: 'rgba(84, 112, 198, 0.2)', // 半透明填充'rgba(84, 112, 198, 0.2)'
        },
        data: [
          // 数据数组，顺序与indicator一一对应
          { value: [item.marketShare / 10, item.technicalStrength, item.productInnovation, item.costAdvantage] },
        ],
      });
      technicalStrengthStr.value.push(item.technicalStrength);
      productInnovationStr.value.push(item.productInnovation);
      costAdvantageStr.value.push(item.costAdvantage);
    });

    seriesValue2.value.push({
      name: '技术实力',
      type: 'bar',
      data: technicalStrengthStr,
      barWidth: 10, // 柱形宽度
    });
    seriesValue2.value.push({
      name: '产品创新',
      type: 'bar',
      data: productInnovationStr,
      barWidth: 10, // 柱形宽度
    });
    seriesValue2.value.push({
      name: '成本优势',
      type: 'bar',
      data: costAdvantageStr,
      barWidth: 10, // 柱形宽度
    });

    let chartDom = document.getElementById('centerEchart5');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      option.value = {
        // 标题
        title: {
          text: '市场竞争格局',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 提示框（鼠标悬停时显示详情：名称、数值、占比）
        tooltip: {
          trigger: 'item', // 按数据项触发
        },
        // 图例（显示类别，默认在右侧）
        // legend: {
        //   data: xaxisData.value,
        //   align: 'left',
        // },
        // 数据系列（饼图核心）
        series: [
          {
            type: 'pie', // 类型为饼图
            radius: '70%', // 饼图半径（相对于容器，70%即占容器70%大小）
            center: ['50%', '60%'], // 饼图中心位置（容器宽50%，高60%处）
            data: xaxisChartData.value,
            // 标签（显示在饼图上的文字，默认显示名称和百分比）
            label: {
              show: true,
              formatter: '{b}: {d}%', // 显示名称和百分比
            },
            // 标签连接线（当标签在饼图外时，连接标签与扇区）
            labelLine: {
              show: true,
            },
          },
        ],
      };
      option.value && myChart.setOption(option.value);
    }

    let chartDom2 = document.getElementById('centerEchart6');
    if (chartDom2) {
      let myChart2 = echarts.init(chartDom2);
      option2.value = {
        // 标题
        title: {
          text: '竞争者能力雷达图',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 提示框（鼠标悬停显示详情）
        tooltip: {
          trigger: 'item', // 按数据项触发
        },
        // 图例（区分不同数据系列）
        legend: {
          top: 30,
          data: xaxisData, // 与series.name对应
        },
        // 雷达图核心：维度指示器配置
        radar: {
          // 指示器（每个对象代表一个维度）
          indicator: [
            { name: '市场份额' }, // 维度名称+最大值（坐标轴范围）
            { name: '成本优势' },
            { name: '技术实力' },
            { name: '产品创新' },
          ],
          // 雷达图形状（'polygon'多边形 / 'circle'圆形）
          shape: 'polygon',
          // 坐标轴名称样式
          name: {
            textStyle: {
              color: '#333',
              fontSize: 14,
            },
          },
          // 坐标轴刻度线样式
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.1)', // 网格线颜色
            },
          },
        },
        // 数据系列（雷达图数据）
        series: seriesValue.value,
      };

      option2.value && myChart2.setOption(option2.value);
    }

    let chartDom3 = document.getElementById('centerEchart7');
    if (chartDom3) {
      let myChart3 = echarts.init(chartDom3);
      option3.value = {
        // 标题
        title: {
          text: '企业综合能力对比',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 提示框（显示各组数据详情）
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }, // 阴影指示器，突出当前类目
        },
        // 图例（区分不同产品/数据组）
        legend: {
          data: ['技术实力', '产品创新', '成本优势'], // 与series.name一一对应
          top: 30, // 图例位置（顶部）
        },
        // 网格（调整图表与容器边缘的间距）
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true, // 包含坐标轴标签，避免标签被截断
        },
        // x轴（类目轴：月份）
        xAxis: {
          type: 'category',
          data: xaxisData.value,
          axisLabel: { rotate: 30 }, // 标签旋转，避免重叠
        },
        // y轴（数值轴：销量）
        yAxis: {
          type: 'value',
          name: '评分（1-10）',
          axisLabel: { formatter: '{value}' },
        },
        // 数据系列（多组柱状图核心：每个对象对应一组数据）
        series: seriesValue2.value,
      };

      option3.value && myChart3.setOption(option3.value);
    }

    let chartDom4 = document.getElementById('centerEchart8');
    if (chartDom4) {
      let myChart4 = echarts.init(chartDom4);
      option4.value = {
        dataset: [
          {
            source: xaxisChartDatas.value,
          },
          {
            transform: {
              type: 'ecStat:clustering',
              print: true,
              config: {
                clusterCount: 0,
                outputType: 'single',
                outputClusterIndexDimension: 60,
              },
            },
          },
        ],
        title: {
          text: '技术实力与市场份额关系',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 提示框（鼠标悬停显示数据点详情）
        tooltip: {
          trigger: 'item',
        },
        // x轴（身高，数值轴）
        xAxis: {
          type: 'value',
          name: '技术实力 (1-10)',
          nameGap: 30,
          nameLocation: 'center', // 居中显示
          min: 1, // 坐标轴最小值
          max: 10, // 坐标轴最大值
          axisLabel: { formatter: '{value}' },
        },
        // y轴（体重，数值轴）
        yAxis: {
          type: 'value',
          name: '市场份额(%)',
          min: 0,
          max: 60,
        },
        // 数据系列（散点图核心）
        visualMap: [
          {
            type: 'piecewise',
            min: 0,
            max: 60,
            top: 20, // 距离容器顶部10px（可调整数值控制间距）
            left: 'center', // 水平居中
            orient: 'horizontal', // 水平排列（关键：横向布局适配顶部）
            splitNumber: 0,
            pieces: xaxisChartDatas2.value,
          },
        ],
        series: {
          name: '市场份额%',
          type: 'scatter', // 类型为散点图
          symbol: 'circle', // 点形状（circle/rect/triangle等）
          symbolSize: 15, // 点大小
          // 鼠标悬停时的高亮样式
          emphasis: {
            itemStyle: {
              color: '#ee6666', // 高亮颜色
              symbolSize: 20, // 高亮时放大
            },
          },
        },
      };

      option4.value && myChart4.setOption(option4.value);
    }
  });
}

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 400px)';
  }
);

defineExpose({ initInfo });
</script>

<template>
  <div :style="{ height: operateFlag, overflowY: 'auto', backgroundColor: '#f3f2f7', padding: '10px' }">
    <div style="display: flex">
      <div style="width: 50%; height: 350px" class="echartsWrap">
        <div id="centerEchart5"></div>
      </div>
      <div style="width: 50%; height: 350px; margin-left: 20px" class="echartsWrap">
        <div id="centerEchart6"></div>
      </div>
    </div>
    <div style="display: flex; margin-top: 20px">
      <div style="width: 50%; height: 350px" class="echartsWrap">
        <div id="centerEchart7"></div>
      </div>
      <div style="width: 50%; height: 350px; margin-left: 20px" class="echartsWrap">
        <div id="centerEchart8"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.echartsWrap {
  height: 350px;
  #centerEchart5 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    background-color: #fff;
  }
  #centerEchart6 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    background-color: #fff;
  }

  #centerEchart7 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
  }

  #centerEchart8 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
  }
}
</style>
