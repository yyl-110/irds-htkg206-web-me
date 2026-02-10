<template>
  <div class="main" ref="mainRef" :class="collapsStatus == false ? '' : 'fit'">
    <!-- <div class="nav-sub">
      <div class="nav-sub-content"><i class="icon"></i><span class="name">平台看板</span></div>
    </div> -->
    <div class="mainbox">
      <div class="boxall h352">
        <div class="alltitle">{{ reportIndexData1.reportName }}</div>
        <div class="sub-alltitle"><span>项目名称</span><span>阶段</span></div>
        <div class="navboxall list-container">
          <div class="table1 marquee" id="carList">
            <div class="list" v-for="(item, index) in reportIndexData1.reportJSON" :key="index">
              <div class="tit">{{ item.title }}</div>
              <div class="status" :style="{ background: item.color }">{{ item.status }}</div>
              <div class="contentWrap">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="boxall echarts-wrap">
        <div class="alltitle">{{ reportIndexData2.reportName }}</div>
        <echartsCell1 :echartAllData1="echartAllData1"></echartsCell1>
      </div>
      <div class="boxall h352" style="padding-bottom: 0">
        <div class="list-wrap">
          <a-carousel style="height: 330px" :autoplay-speed="5000" after-change="onChange">
            <!-- <a-carousel-item> -->
            <div class="list-inner">
              <div class="alltitle">{{ reportIndexData9.reportName }}</div>
              <div class="sub-alltitle" style="padding-right: 0"><span>排名</span><span>人员信息</span><span>模块应用次数</span></div>
              <div class="navboxall" style="height: 240px; padding-right: 5px; overflow-y: auto">
                <div class="table1">
                  <div class="list" v-for="(item, index) in reportIndexData9.reportJSON" :key="index">
                    <div>
                      <img class="pm" v-if="index == 0" src="./images/gold.png" />
                      <img class="pm" v-if="index == 1" src="./images/copper.png" />
                      <img class="pm" v-if="index == 2" src="./images/silver.png" />
                      <span style="margin-left: 18px" v-if="index > 2">{{ index + 1 }}</span>
                    </div>
                    <div class="tit" style="display: flex; align-items: center; justify-content: space-between">
                      <div class="username"><img src="./images/avatar.jpg" />{{ item.name }}</div>
                      <div class="number">{{ item.number }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- </a-carousel-item> -->
            <!-- <a-carousel-item> -->
            <div class="list-inner">
              <div class="alltitle">{{ reportIndexData3.reportName }}</div>
              <div class="sub-alltitle" style="padding-right: 0"><span>排名</span><span>模块名称</span><span>使用次数</span></div>
              <div class="navboxall">
                <div class="table1">
                  <div class="list" v-for="(item, index) in reportIndexData3.reportJSON" :key="index">
                    <div>
                      <img class="pm" v-if="index == 0" src="./images/gold.png" />
                      <img class="pm" v-if="index == 1" src="./images/copper.png" />
                      <img class="pm" v-if="index == 2" src="./images/silver.png" />
                      <span style="margin-left: 18px" v-if="index > 2">{{ index + 1 }}</span>
                    </div>
                    <div class="tit" style="display: flex; align-items: center; justify-content: space-between">
                      <div>{{ item.title }}</div>
                      <div class="number">{{ item.totalNumber ? item.totalNumber : '' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- </a-carousel-item> -->
          </a-carousel>
        </div>
      </div>
    </div>
    <div class="mainbox">
      <div class="boxall h395">
        <div class="alltitle">{{ reportIndexData4.reportName }}</div>
        <!-- <echartsCell2 :echartAllData2="echartAllData2"></echartsCell2> -->
        <div class="box-inner" id="blockList">
          <div class="box-list" v-for="(item, index) in platformLibraryArray" :key="index">
            <div class="inner-tit">{{ item.productLibraryName }}</div>
            <div class="block-wrap">
              <el-tooltip v-for="(i, idx) in item.productLibraryArray" :key="idx" class="box-item" effect="dark" :content="i" placement="top-start">
                <div class="b-list"></div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="boxall echarts-bom-wrap">
        <div class="alltitle">
          模块应用功效
          <div class="bnts-wrap">
            <el-tag v-for="(item, index) in eltagArr" :key="index" :type="item.type" @click="tagClickFun(item.id)">{{ item.name }}</el-tag>
          </div>
        </div>
        <echartsCell4 :echartAllData4="echartAllData4"></echartsCell4>
      </div>

      <div class="boxall h395">
        <div class="alltitle">{{ reportIndexData8.reportName }}</div>
        <echartsCell3 :echartAllData3="echartAllData3"></echartsCell3>
      </div>
    </div>
    <!-- <el-dialog v-model="dialogVisible" title="数据详情" width="50%" :before-close="handleClose" draggable>
      <div class="diaEchart">
        <div id="diaEchart"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false"> 确定 </el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, nextTick } from 'vue';
import { AdminApiSystemDashboard } from '@/api/tags/PlatformDashboard/平台看板管理';
import { useUserStore } from '@/store/modules/user';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import echartsCell1 from './cell/echart1.vue';
import echartsCell2 from './cell/echart2.vue';
import echartsCell3 from './cell/echart3.vue';
import echartsCell4 from './cell/echart4.vue';

const eltagArr = ref([
  {
    type: 'primary',
    name: '效率',
    id: 0,
  },
  {
    type: 'info',
    name: '质量',
    id: 1,
  },
  {
    type: 'info',
    name: '成本',
    id: 2,
  },
]);
const route = useRoute();
const isShow = ref(false);
const dialogVisible = ref(false);
const uStore = useUserStore();
const collapsStatus = computed(() => {
  return true;
});
const reportIndexData1 = ref({});
const reportIndexData2 = ref({});
const reportIndexData3 = ref({});
const reportIndexData4 = ref({});
const platformLibraryArray = ref([]);
const reportIndexData5 = ref([]);
const reportIndexData6 = ref([]);
const reportIndexData7 = ref([]);
const reportIndexData8 = ref([]);
const reportIndexData9 = ref([]);
const echartAllData1 = ref({
  config: {},
});
const echartAllData2 = ref({
  config: {},
});
const echartAllData3 = ref({
  config: {},
});
const echartAllData4 = ref({
  config: {
    legend: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      showContent: false,
    },
    dataset: {
      source: [
        ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        ['项目设计成本达标率', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        ['项目设计成本节约率', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        ['项目特殊成本消耗', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
        ['设计成本', 25.2, 37.1, 41.2, 18, 33.9, 49.1],
      ],
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    grid: { top: '55%' },
    series: [
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
          focus: 'self',
        },
        label: {
          formatter: '{b}: {@2012} ({d}%)',
        },
        encode: {
          itemName: 'product',
          value: '2012',
          tooltip: '2012',
        },
      },
    ],
  },
});
const copyListNum = ref(0);
onMounted(() => {
  getStaticData();
});

watch(
  collapsStatus,
  (newVal, oldVal) => {
    collapsStatus.value = newVal;
  },
  { immediate: true, deep: true }
);
const tagClickFun = id => {
  eltagArr.value.forEach(item => {
    item.type = 'info';
  });
  eltagArr.value[id].type = 'primary';
  if (id == 0 || id == 1) {
    echartAllData4.value.config = null;
    echartAllData4.value.config = {
      legend: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        showContent: false,
      },
      dataset: {
        source: [
          ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
          ['项目设计成本达标率', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
          ['项目设计成本节约率', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
          ['项目特殊成本消耗', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
          ['设计成本', 25.2, 37.1, 41.2, 18, 33.9, 49.1],
        ],
      },
      xAxis: { type: 'category' },
      yAxis: { gridIndex: 0 },
      grid: { top: '55%' },
      series: [
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' },
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' },
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' },
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' },
        },
        {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '25%'],
          emphasis: {
            focus: 'self',
          },
          label: {
            formatter: '{b}: {@2012} ({d}%)',
          },
          encode: {
            itemName: 'product',
            value: '2012',
            tooltip: '2012',
          },
        },
      ],
    };
  }
  if (id == 2) {
    return;
    echartAllData4.value.config = null;
    echartAllData4.value.config = {
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['product', '2012', '2013', '2014', '2015'],
          ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
          ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
          ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4],
        ],
      },
      xAxis: [
        { type: 'category', gridIndex: 0 },
        { type: 'category', gridIndex: 1 },
      ],
      yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
      grid: [{ bottom: '55%' }, { top: '55%' }],
      series: [
        // These series are in the first grid.
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        // These series are in the second grid.
        { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
        { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
        { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
        { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
      ],
    };
  }
};
const downFile = () => {
  // ElMessage({
  //   type: 'error',
  //   message: '待定！！！！！',
  // });
  return;
};
const getEchartInfo = async id => {
  isShow.value = true;
  return;
  let data = {
    id: id,
  };
  const respon = await AdminApiSystemDashboard.reportinfoGetReportInfoById(data);
  if (respon.data.code == 0) {
    dialogVisible.value = true;
    let myChart = null;
    nextTick(() => {
      let chartDom = document.getElementById('diaEchart');
      myChart = echarts.init(chartDom);
      let option = respon.data.data.reportJSON[0];
      option && myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    });
  }
};
const handleClose = () => {
  dialogVisible.value = false;
};
const copyList = () => {
  nextTick(() => {
    const marquee = document.getElementById('carList');
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML;
    // const block = document.getElementById('blockList');
    // block.innerHTML = block.innerHTML + block.innerHTML;
  });
};
const getLevelOption = () => {
  return [
    {
      itemStyle: {
        borderColor: '#444',
        borderWidth: 0,
        gapWidth: 1,
      },
      upperLabel: {
        show: false,
      },
    },
    {
      itemStyle: {
        borderColor: '#000',
        borderWidth: 5,
        gapWidth: 1,
      },
      emphasis: {
        itemStyle: {
          borderColor: '#f56c6c',
        },
      },
    },
    {
      colorSaturation: [0.35, 0.5],
      itemStyle: {
        borderWidth: 5,
        gapWidth: 1,
        borderColorSaturation: 0.6,
      },
    },
  ];
};
async function getStaticData() {
  let data = {
    reportIndex: '',
    reportName: '',
  };
  const respon = await AdminApiSystemDashboard.reportinfoGetReportInfoList(data);
  if (respon.data.code == 0) {
    respon.data.data.result.forEach(item => {
      if (item.reportIndex == 1) {
        reportIndexData1.value = item;
        reportIndexData1.value.reportJSON = JSON.parse(item.reportJSON);
        if (!copyListNum.value) {
          copyList();
          copyListNum.value++;
        }
      }
      if (item.reportIndex == 2) {
        reportIndexData2.value = item;
        reportIndexData2.value.reportJSON = JSON.parse(item.reportJSON);
        echartAllData1.value.config = item.reportJSON[0];
        echartAllData1.value.config = {
          yAxis: {
            axisLabel: {
              textStyle: {
                color: '#A2A1A6',
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {
                color: '#A2A1A6',
              },
            },
            show: true,
            name: item.reportJSON[0].yAxis.name,
            splitLine: {
              lineStyle: {
                color: 'red',
                width: 1,
                type: 'solid',
              },
              show: false,
            },
            type: 'value',
            axisLine: {
              // 纵轴坐标轴线
              show: true,
            },
          },
          xAxis: {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            splitLine: {
              lineStyle: {
                color: 'red',
                width: 1,
                type: 'solid',
              },
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: 'red',
                fontSize: '10',
              },
              rotate: 0,
              interval: 'auto',
              formatter: function (params) {
                var str = ''; // 最终拼接成的字符串
                var paramsLen = params.length; // 获取每项文字的个数
                var len = 4; // 每行能显示的字的个数（根据实际情况自己设置）
                var rowNumber = Math.ceil(paramsLen / len); // 换行的话，需要显示几行，向上取整
                if (paramsLen > len) {
                  //大于设定的len就换行，不大于就不变化
                  for (var i = 0; i < rowNumber; i++) {
                    var temp = ''; // 表示每一次截取的字符串
                    var start = i * len; // 开始截取的位置
                    var end = start + len; // 结束截取的位置
                    if (i == rowNumber - 1) {
                      // 最后一次不换行
                      temp = params.substring(start, paramsLen);
                    } else {
                      // 每一次拼接字符串并换行
                      temp = params.substring(start, end) + '\n';
                    }
                    str += temp; // 最终拼成的字符串
                  }
                } else {
                  // 给新的字符串赋值
                  str = params;
                }
                return str; //返回字符串
              },
            },
            axisLine: {
              lineStyle: {
                color: '#A2A1A6',
              },
            },
            data: item.xAxisData ? item.xAxisData : item.reportJSON[0].xAxis.data,
            show: true,
            name: item.reportJSON[0].xAxis.name,
          },
          grid: {
            top: 50,
            left: 30,
            bottom: 40,
            right: 62,
          },
          tooltip: {
            textStyle: {
              color: '#0A0A0A',
              fontSize: 14,
            },
            percentage: 0,
            show: true,
          },
          title: {
            show: false,
            top: '5',
            text: '',
            textStyle: {
              color: '#c23531',
              fontWeight: 'bolder',
              fontSize: 18,
            },
            left: 'left',
            padding: [5, 10, 5, 10],
          },
          series: [
            {
              barWidth: 15,
              data: changeDataStyle(item.yAxisData ? item.yAxisData : item.reportJSON[0].series[0].data),
              name: item.reportJSON[0].series[0].name,
              itemStyle: {
                barBorderRadius: [3, 3, 0, 0],
                color: 'rgba(89,159,231,1)',
              },
              label: {
                textStyle: {
                  color: '#ccc',
                  fontSize: 10,
                  fontWeight: 'bolder',
                },
                position: 'top',
                formatter: function (params) {
                  return params.value;
                },
                rotate: 0,
                type: 'bar',
                show: true,
              },
              type: 'bar',
              barMinHeight: 2,
              textStyle: {
                color: 'black',
                fontWeight: 'bolder',
              },
            },
          ],
        };
      }
      if (item.reportIndex == 3) {
        reportIndexData3.value = item;
        reportIndexData3.value.reportJSON = item.chartData ? item.chartData : JSON.parse(item.reportJSON);
      }
      if (item.reportIndex == 4) {
        reportIndexData4.value = item;
        reportIndexData4.value.reportJSON = JSON.parse(item.reportJSON);
        platformLibraryArray.value = item.platformLibraryArray;
        echartAllData2.value.config = item.reportJSON[0];
        echartAllData2.value.config = {
          tooltip: {
            formatter: function (info) {
              var value = info.value;
              var treePathInfo = info.treePathInfo;
              var treePath = [];
              for (var i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              return ['<div class="tooltip-title">' + echarts.format.encodeHTML(treePath.join('/')) + '</div>', '平台数量: ' + echarts.format.addCommas(value) + ' 个'].join('');
            },
            z: 100,
            trigger: 'item',
            position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              var obj = { top: 60 };
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            },
          },
          series: [
            {
              // name: 'uuiu',
              type: 'treemap',
              visibleMin: 10,
              childrenVisibleMin: 10,
              label: {
                show: true,
                formatter: '{b}',
                color: '#fff',
                fontSize: '10',
              },
              upperLabel: {
                show: true,
                height: 30,
                color: '#fff',
              },
              itemStyle: {
                borderColor: '#fff',
                color: '#fff',
              },
              levels: getLevelOption(),
              data: item.statisticalPlatforms ? item.statisticalPlatforms : item.reportJSON,
              progressive: 0,
              left: 'center',
              top: 'middle',
              width: '100%',
              height: '87%',
              sort: true,
              clipWindow: 'origin',
              z: 2,
              zlevel: 0,
              squareRatio: 0.5 * (1 + Math.sqrt(5)),
              zoomToNodeRatio: 0.1024,
              roam: true,
              animation: true,
              animationDurationUpdate: 900,
              animationEasing: 'quinticInOut',
            },
          ],
          textStyle: {
            color: '#fff',
          },
        };
      }
      if (item.reportIndex == 5) {
        reportIndexData5.value.push(item);
      }
      if (item.reportIndex == 6) {
        reportIndexData6.value.push(item);
      }
      if (item.reportIndex == 7) {
        reportIndexData7.value.push(item);
      }
      if (item.reportIndex == 8) {
        reportIndexData8.value = item;
        reportIndexData8.value.reportJSON = JSON.parse(item.reportJSON);
        echartAllData3.value.config = item.reportJSON[0];
        echartAllData3.value.config = {
          tooltip: { trigger: 'item' },
          legend: {
            top: '65%',
            left: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0)',
            },
          },
          series: [
            {
              label: { color: '#6A696E', fontSize: 12 },
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              type: 'pie',
              radius: '50%',
              center: ['50%', '35%'],
              data: item.pieData ? item.pieData : item.reportJSON[0].series[0].data,
              name: item.reportJSON[0].series[0].name,
            },
          ],
        };
      }
      if (item.reportIndex == 9) {
        reportIndexData9.value = item;
        reportIndexData9.value.reportJSON = item.chartData ? item.chartData : JSON.parse(item.reportJSON);
      }
    });
  }
}
const changeDataStyle = data => {
  let colorArr = [
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#F5FF40',
    '#FF40EF',
    '#40FFD9',
    '#FF5940',
    '#4043FF',
    '#40F9FF',
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#F5FF40',
    '#FF40EF',
    '#40FFD9',
    '#FF5940',
    '#4043FF',
    '#40F9FF',
  ];
  let __data = [];
  data.forEach((item, index) => {
    __data.push({
      value: item,
      itemStyle: {
        color: colorArr[index],
      },
    });
  });
  return __data;
};

// onBeforeMount(() => {
//   nextTick(() => {
//     getStaticData();
//   });
// });
</script>
<style lang="less" scoped>
.main {
  // width: calc(~'100vw - 168px');
  // height: calc(~'100% - 60px');
  width: auto;
  height: (100vh-16x);
  background: #f3f2f7;
  position: absolute;
  overflow-y: scroll;
  z-index: 10;
}
.fit {
  width: calc(~'100vw - 210px');
}
.mainbox {
  display: flex;
  margin-top: 16px;
  justify-content: space-between;
}
.boxall {
  position: relative;
  // margin-bottom: 15px;
  z-index: 10;
  .alltitle {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 18px;
    color: #000;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bnts-wrap {
      .el-tag {
        margin-left: 12px;
        cursor: pointer;
        border-radius: 10px;
      }
    }
  }
  .sub-alltitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 36px 8px 8px;
    span {
      font-family:
        Source Sans 3,
        Source Sans 3;
      font-weight: 400;
      font-size: 12px;
      color: #a2a1a6;
      line-height: 12px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
.navboxall {
  height: calc(100% - 30px);
}
.num {
  padding-right: 20px;
}
.table1 .list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  border-radius: 2px 2px 2px 2px;
  border-bottom: 1px solid #eaeaf1;
  position: relative;
  .pm {
    min-width: 24px;
    max-width: 24px;
    height: 24px;
    overflow: hidden;
    margin-left: 10px;
  }
  .contentWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 41px;
    overflow: hidden;
    background: #fff;
    display: none;
    line-height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
  }
  &:hover {
    .contentWrap {
      display: block;
    }
  }
}
.table1 .tit {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  text-align: left;
  font-style: normal;
  text-transform: none;
  height: 24px;
  width: 177px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  .username {
    display: flex;
    align-items: center;
    img {
      min-width: 24px;
      max-width: 24px;
      height: 24px;
      border-radius: 24px;
      margin-right: 4px;
    }
  }

  .number {
    font-size: 12px;
  }
}
.table1 .status {
  height: 20px;
  background: #fef1d8;
  border-radius: 13px 13px 13px 13px;
  padding: 0 8px;
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 12px;
  color: #fff;
  font-style: normal;
  text-transform: none;
}

@keyframes myfirst2 {
  from {
    width: 0;
  }
  to {
  }
}
.h352 {
  min-width: 296px;
  max-width: 296px;
  height: 352px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
}
.h395 {
  min-width: 296px;
  max-width: 296px;
  height: 480px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
  .box-inner {
    margin-top: 26px;
    height: 420px;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 2px; /* 设置滚动条的宽度 */
    }
  }
  .box-list {
    margin-bottom: 22px;
    .inner-tit {
      font-family:
        Source Sans 3,
        Source Sans 3;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.8);
      line-height: 14px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 6px;
    }
    .block-wrap {
      display: flex;
      align-items: center;
      .b-list {
        height: 12px;
        width: 30px;
        margin-right: 2px;
        cursor: pointer;
        &:nth-child(odd) {
          background: linear-gradient(270deg, #ffd153 0%, #ffd400 100%);
        }
        &:nth-child(even) {
          background: linear-gradient(270deg, #ff8e8a 0%, #ff6571 100%);
        }
        &:first-child {
          background: linear-gradient(270deg, #6f96fa 0%, #3172f5 72%);
        }
      }
    }
  }
}
.h420 {
  height: 414px;
  overflow: hidden;
}
.c-tit {
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.echarts-wrap {
  width: calc(100vw - 10px);
  height: 352px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
  #echart1 {
    width: 100%;
    height: 330px;
    margin: 0 auto;
  }
}
.echarts-bom-wrap {
  width: calc(100vw - 10px);
  height: 480px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
}
.list-container {
  height: 380px;
  overflow: hidden;
  position: relative;
}
.marquee {
  animation: marquee 15s linear infinite;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-51%);
  }
}
.diaEchart {
  width: 100%;
  height: 400px;
  #diaEchart {
    height: 400px;
    width: 100%;
  }
}
:deep(.el-carousel__button) {
  background: #000;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  // background: #364d79;
  margin-top: 30px;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
.ant-carousel :deep(.slick-dots li button) {
  background: #364d79;
}
</style>
