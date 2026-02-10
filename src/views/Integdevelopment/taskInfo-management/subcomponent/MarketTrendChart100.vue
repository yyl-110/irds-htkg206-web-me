<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import * as echarts from 'echarts';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { forEach } from 'mathjs';
import { base64ToFile } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
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
const option = ref<any>(null);
const option2 = ref<any>(null);
const option3 = ref<any>(null);
const option4 = ref<any>(null);
const selectYear = ref<any>();
const selectPt = ref<any>('动车组产品');
const selectPtOptions = ref<any>([
  '动车组产品',
  '铁路客车产品',
  '城际列车产品',
  '市域列车产品',
  '地铁列车产品',
  '有轨电车产品',
  '磁浮列车产品',
  '单轨列车产品',
  '特种制式列车产品',
]);

async function initInfo(taskIds: any, planIds: any) {
  taskId.value = taskIds;
  planId.value = planIds;
  //查询数据列表
  const res = await AdminApiProductPlanTaskDesign.getTaskMarketTrendChartData({
    taskId: taskId.value,
  });
  if (res.data.code == 200) {
    xaxisData.value = res.data.data.xaxisData;
    if (xaxisData.value.length > 0) {
      selectYear.value = xaxisData.value[0];
    }
    seriesY1.value = res.data.data.seriesY1;
    seriesY2.value = res.data.data.seriesY2;
  }
  // 获取图表信息
  nextTick(() => {
    let chartDom = document.getElementById('centerEchart1');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      option.value = {
        grid: {
          top: 80, // 图表区域距离顶部 80px（值越大，图表越靠下，与标题间距越大）
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        title: {
          text: '市场规模与增长率趋势',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 图例
        legend: {
          data: ['市场规模(亿元)', '增长率(%)'],
          top: 20,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xaxisData.value,
          top: 40,
        },
        yAxis: [
          {
            // 左侧 Y 轴
            type: 'value',
            name: '市场规模(亿元)',
            position: 'left',
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              show: true,
            },
          },
          {
            // 右侧 Y 轴
            type: 'value',
            name: '增长率(%)',
            position: 'right',
            axisLabel: {
              formatter: '{value} %',
            },
            splitLine: {
              show: false, // 右侧轴通常不显示分割线，避免与左侧混淆
            },
          },
        ],
        // 数据系列
        series: [
          {
            name: '市场规模(亿元)',
            type: 'line',
            data: seriesY1.value,
            // 指定使用左侧 Y 轴（索引为 0）
            yAxisIndex: 0,
          },
          {
            name: '增长率(%)',
            type: 'line',
            data: seriesY2.value,
            // 指定使用右侧 Y 轴（索引为 1）
            yAxisIndex: 1,
          },
        ],
      };
      option.value && myChart.setOption(option.value);
    }
    let chartDom2 = document.getElementById('centerEchart2');
    if (chartDom2) {
      let myChart2 = echarts.init(chartDom2);
      option2.value = {
        grid: {
          top: 80, // 图表区域距离顶部 80px（值越大，图表越靠下，与标题间距越大）
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        title: {
          text: '市场增长率分布',
          textStyle: {
            fontSize: 14, // 设置字体大小为20px
            color: '#333', // 可选：文字颜色
            fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
          },
        },
        // 图例
        legend: {
          data: ['增长率(%)'],
          top: 20,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: xaxisData.value,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %', // 标签格式：显示百分比
          },
        },
        series: [
          {
            data: seriesY2.value,
            type: 'bar',
          },
        ],
      };

      option2.value && myChart2.setOption(option2.value);
    }
  });

  tableData.value = [];
  nextTick(() => {
    //查询数据列表
    AdminApiProductPlanTaskDesign.productTaskMarketTrendList({
      taskId: taskId.value,
      planId: planId.value,
    }).then(res => {
      tableData.value = res.data.data;
      reloadPtBarChart();
      reloadYearBarChart();
    });
  });
}

function reloadPtBarChart() {
  let seriesY3 = ref<any>([]);
  forEach(tableData.value, item => {
    if (item.years == selectYear.value) {
      seriesY3.value = [
        item.emuScore,
        item.busScore,
        item.intercityScore,
        item.metropolitanAreaScore,
        item.subwayScore,
        item.tramScore,
        item.maglevTrainScore,
        item.monorailTrainScore,
        item.specialTrainScore,
      ];
    }
  });

  let chartDom = document.getElementById('centerEchart3');
  if (chartDom) {
    let myChart = echarts.init(chartDom);
    option3.value = {
      // 标题
      title: {
        text: '市场产品占比',
        textStyle: {
          fontSize: 14, // 设置字体大小为20px
          color: '#333', // 可选：文字颜色
          fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
        },
      },
      // 提示框（鼠标悬停时显示详情）
      tooltip: {
        trigger: 'axis', // 按坐标轴触发
        axisPointer: { type: 'shadow' }, // 阴影指示器
      },
      // 图例（如果有多个数据系列，用于区分）
      legend: {
        data: ['平台'], // 与series.name对应
        top: 30, // 距离顶部30px
      },
      // x轴（类目轴，如月份）
      xAxis: {
        type: 'category', // 类目类型
        data: selectPtOptions.value, // x轴数据
        axisLabel: { rotate: 30 }, // 标签旋转30度，避免重叠
      },
      // y轴（数值轴，如销量值）
      yAxis: {
        type: 'value', // 数值类型
        name: '占比（%）', // 轴名称
      },
      // 数据系列（柱状图核心数据）
      series: [
        {
          name: '平台', // 与图例data对应
          type: 'bar', // 类型为柱状图
          data: seriesY3.value, // 具体数值
          barWidth: 40, // 柱形宽度
          itemStyle: {
            color: '#5470c6', // 柱形颜色
          },
        },
      ],
    };
    option3.value && myChart.setOption(option3.value);
  }
}

function reloadYearBarChart() {
  let seriesY4 = ref<any>([]);
  //循环年份列表
  forEach(xaxisData.value, itemYear => {
    forEach(tableData.value, item => {
      if (itemYear == item.years) {
        if (selectPt.value == '动车组产品') {
          seriesY4.value.push(item.emuScore);
        }
        if (selectPt.value == '铁路客车产品') {
          seriesY4.value.push(item.busScore);
        }
        if (selectPt.value == '城际列车产品') {
          seriesY4.value.push(item.intercityScore);
        }
        if (selectPt.value == '市域列车产品') {
          seriesY4.value.push(item.metropolitanAreaScore);
        }
        if (selectPt.value == '地铁列车产品') {
          seriesY4.value.push(item.subwayScore);
        }
        if (selectPt.value == '有轨电车产品') {
          seriesY4.value.push(item.tramScore);
        }
        if (selectPt.value == '磁浮列车产品') {
          seriesY4.value.push(item.maglevTrainScore);
        }
        if (selectPt.value == '单轨列车产品') {
          seriesY4.value.push(item.monorailTrainScore);
        }
        if (selectPt.value == '特种制式列车产品') {
          seriesY4.value.push(item.specialTrainScore);
        }
      }
    });
  });

  let chartDom = document.getElementById('centerEchart4');
  if (chartDom) {
    let myChart = echarts.init(chartDom);
    option4.value = {
      // 标题
      title: {
        text: '产品市场占比变化',
        textStyle: {
          fontSize: 14, // 设置字体大小为20px
          color: '#333', // 可选：文字颜色
          fontWeight: 'bold', // 可选：字体粗细（'normal'/'bold'或100-900）
        },
      },
      // 提示框（鼠标悬停时显示详情）
      tooltip: {
        trigger: 'axis', // 按坐标轴触发
        axisPointer: { type: 'shadow' }, // 阴影指示器
      },
      // 图例（如果有多个数据系列，用于区分）
      legend: {
        data: ['年份'], // 与series.name对应
        top: 30, // 距离顶部30px
      },
      // x轴（类目轴，如月份）
      xAxis: {
        type: 'category', // 类目类型
        data: xaxisData.value, // x轴数据
        axisLabel: { rotate: 30 }, // 标签旋转30度，避免重叠
      },
      // y轴（数值轴，如销量值）
      yAxis: {
        type: 'value', // 数值类型
        name: '占比（%）', // 轴名称
      },
      // 数据系列（柱状图核心数据）
      series: [
        {
          name: '年份', // 与图例data对应
          type: 'bar', // 类型为柱状图
          data: seriesY4.value, // 具体数值
          barWidth: 40, // 柱形宽度
          itemStyle: {
            color: '#5470c6', // 柱形颜色
          },
        },
      ],
    };
    option4.value && myChart.setOption(option4.value);
  }
}

//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 400px)';
  }
);
async function getEchartsimgfile(type: string, ImgName: string) {
  const myChart = echarts.init(document.getElementById(type));
  const base64Url = myChart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff',
  });
  const file = base64ToFile(base64Url, ImgName);
  const res = await AdminApiSystemUploadFile.uploadFile({ file: file as File, userId: userStore.getUser.id });
  if (res.data.code == 200) {
    let fileId = res.data.data.id;
    return fileId;
  }
}
defineExpose({ initInfo, getEchartsimgfile });
</script>

<template>
  <div :style="{ height: operateFlag, overflowY: 'auto', backgroundColor: '#f3f2f7', padding: '10px' }">
    <div style="display: flex">
      <div style="width: 50%; height: 350px" class="echartsWrap">
        <div id="centerEchart1"></div>
      </div>
      <div style="width: 50%; height: 350px; margin-left: 20px" class="echartsWrap">
        <div id="centerEchart2"></div>
      </div>
    </div>
    <div style="display: flex; margin-top: 20px">
      <div style="width: 50%; height: 350px" class="echartsWrap">
        <a-select v-model:value="selectYear" placeholder="选择年份" allowClear @change="reloadPtBarChart" style="width: 150px">
          <a-select-option v-for="option in xaxisData" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
        <div id="centerEchart3"></div>
      </div>
      <div style="width: 50%; height: 350px; margin-left: 20px" class="echartsWrap">
        <a-select v-model:value="selectPt" placeholder="选择平台" allowClear @change="reloadYearBarChart" style="width: 150px">
          <a-select-option v-for="option in selectPtOptions" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
        <div id="centerEchart4"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.echartsWrap {
  height: 350px;
  #centerEchart1 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    background-color: #fff;
  }
  #centerEchart2 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    background-color: #fff;
  }

  #centerEchart3 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
  }

  #centerEchart4 {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
  }
}
</style>
