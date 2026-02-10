<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { EpcIcon } from '@/components/icon/EpcIcon';
import FileList from '@/views/competitor/manage/components/FileList.vue';
import { forEach } from 'mathjs';
import * as echarts from 'echarts';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

/** 弹窗状态 */
const visible = computed(() => {
  selectedRowkeys.value = [];
  selectedRowList.value = [];
  return props.modalVisible;
});
const loading = ref<boolean>(false);
const columns = ref<any>([]);
const columnsAll = ref<any>([]);
const visible2 = ref(false);
const datasource = ref<any>([]);
const datasourceAll = ref<any>([]);
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const defaultExpandedKeys = ref<any>([]);
const tableHeight = ref(window.innerHeight - 310);
const treeData = ref<any>([]);
const selectedKey = ref('');
const maxKeyNum = ref(0);
const changetitleNum = ref('');
const checkBoxChecked = ref<boolean>(false);
const checkBoxChecked2 = ref<boolean>(false);
const fileListVisible = ref<boolean>(false);
const fileListModel = ref<any>();
const portVisible = ref<boolean>(false);
const portDiv = ref<boolean>(false);
const port2Visible = ref<boolean>(false);
const port2Div = ref<boolean>(false);
const treeId = ref<any>(0);
let colorStr = ref<any>([
  'rgba(84, 112, 198, 0.4)',
  'rgba(145, 204, 117, 0.4)',
  'rgba(250, 200, 88, 0.4)',
  'rgba(238, 102, 102, 0.4)',
  'rgba(115, 192, 222, 0.4)',
  'rgba(59, 162, 114, 0.4)',
  'rgba(84, 112, 198, 0.4)',
  'rgba(145, 204, 117, 0.4)',
  'rgba(250, 200, 88, 0.4)',
  'rgba(238, 102, 102, 0.4)',
  'rgba(115, 192, 222, 0.4)',
  'rgba(59, 162, 114, 0.4)',
  'rgba(84, 112, 198, 0.4)',
  'rgba(145, 204, 117, 0.4)',
  'rgba(250, 200, 88, 0.4)',
  'rgba(238, 102, 102, 0.4)',
  'rgba(115, 192, 222, 0.4)',
  'rgba(59, 162, 114, 0.4)',
]);

/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
const selectedRowkeys = ref<any[]>([]);
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRows: selectedRowList.value,
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: any) => {
      if (selected) {
        selectedRowkeys.value.push(record.id);
        const newSelectedKeys = [...new Set([...selectedRowkeys.value])];
        selectedRowkeys.value = newSelectedKeys;
      } else {
        const newSelectedRows = selectedRowkeys.value.filter(item => item != record.id);
        selectedRowkeys.value = newSelectedRows;
      }
    },
  };
});

//窗口大小变化后计算高度
onMounted(() => {
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 310;
  });
});
/** 加载列表信息 */
async function getListData(checkComp: any, treeIds: any) {
  loading.value = true;
  columnsAll.value = [];
  columns.value = [];
  datasource.value = [];
  datasourceAll.value = [];
  changetitleNum.value = '';
  try {
    if (treeIds) {
      treeId.value = treeIds;
    }
    AdminApiCompetitor.getCompetitorCompList({ treeId: treeId.value }).then(res => {
      if (res && res.data.code == 200) {
        //根据返回的行、列、图片的信息构建动态表格
        columnsAll.value = res.data.data.columnStr || [];
        columnsAll.value.forEach((item: any) => {
          //判断编号包含于checkComp
          if (item.title == '车型信息') {
            columns.value.push(item);
          } else {
            if (checkComp.some((item2: any) => item2.title === item.title)) {
              columns.value.push(item);
            }
          }
        });
        if (columns.value.length < 6) {
          for (let i = columns.value.length; i < 6; i++) {
            columns.value.push({
              title: '暂无车型',
              dataIndex: 'addTitle' + i,
              key: 'addTitle' + i,
              id: 'addTitle' + i,
              width: '190px',
              align: 'center',
              imgUrl: imgRooturl + '1756782838448.jpg',
            });
          }
          maxKeyNum.value = 5;
          columns.value.push({
            title: '',
            align: 'left',
            minWidth: 35,
          });
        }
        datasource.value = res.data.data.tableStr.treeNodesList || [];
        let dataStr = [...res.data.data.tableStr.treeNodesList];
        datasourceAll.value = JSON.parse(JSON.stringify(dataStr));
        defaultExpandedKeys.value = [];
        datasource.value.forEach((item: any) => {
          if (item.children && item.children.length > 0) {
            defaultExpandedKeys.value.push(item.categoryName);
          }
        });
      }
    });
  } finally {
    loading.value = false;
  }
}
function addCarType() {
  if (columns.value.length < 12) {
    //去掉最后一列
    columns.value.splice(columns.value.length - 1, 1);
    maxKeyNum.value = maxKeyNum.value + 1;
    columns.value.push({
      title: '暂无车型',
      dataIndex: 'addTitle' + maxKeyNum.value,
      key: 'addTitle' + maxKeyNum.value,
      id: 'addTitle' + maxKeyNum.value,
      width: '190px',
      align: 'center',
      imgUrl: imgRooturl + '1756782838448.jpg',
    });
    columns.value.push({
      title: '',
      align: 'left',
      minWidth: 35,
    });
  }
}
//更换车型或添加车型
function changeCarType(multiple: any) {
  changetitleNum.value = multiple;
  //获取columns中的标题集合
  const checkComp2 = columns.value.map((item: any) => {
    return item.title;
  });
  const params = { checkComp2: checkComp2 + '', treeId: treeId.value };
  AdminApiCompetitor.getCompetitorTreeListByType(params).then(res => {
    if (res && res.data.code == 200) {
      visible2.value = true;
      treeData.value = res.data.data.columnTreeStr || [];
    }
  });
}

function onSelect(selectedKeys: string[], info: any) {
  if (selectedKeys && selectedKeys.length > 0) {
    selectedKey.value = selectedKeys[0];
    if (info.node.compType == 3) {
      //更新列
      nextTick(() => {
        changeColumns(info.node.categoryName);
      });
    }
  }
}

function changeColumns(categoryName: any) {
  let itemsel = ref<any>([]);
  columnsAll.value.find((item: any) => {
    if (item.title == categoryName) {
      itemsel = item;
    }
  });
  //循环Columns 找到title等于changetitleNum的列替换成columnsAll中对应列
  columns.value.forEach((item: any, index: number) => {
    if (item.key == changetitleNum.value) {
      columns.value[index] = itemsel;
    }
  });
  changetitleNum.value = '';
  visible2.value = false;
}

function deleteTableColumn(key: any) {
  //循环Columns 找到key等于key的列删除
  columns.value.forEach((item: any, index: number) => {
    if (item.key == key) {
      //item.key以addTitle开头的删除
      if (item.key.startsWith('addTitle')) {
        columns.value.splice(index, 1);
      } else {
        //把该列替换成addTitle列
        maxKeyNum.value = maxKeyNum.value + 1;
        columns.value[index] = {
          title: '暂无车型',
          dataIndex: 'addTitle' + maxKeyNum.value,
          key: 'addTitle' + maxKeyNum.value,
          id: 'addTitle' + maxKeyNum.value,
          width: '190px',
          align: 'center',
          imgUrl: imgRooturl + '1756782838448.jpg',
        };
      }
    }
  });
}
function checkBoxChange() {
  checkBoxChecked.value = !checkBoxChecked.value;
  //选中状态要隐藏相同项
  if (checkBoxChecked.value) {
    let columnKeys: any = [];
    columns.value.forEach((item: any) => {
      if (item.key != null && item.key != undefined && item.key != '' && item.key != 'x1') {
        if (!item.key.startsWith('addTitle')) {
          columnKeys.push(item.key);
        }
      }
    });
    let arrData = datasource.value;
    datasource.value = [];
    arrData.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((item2: any) => {
          let sameNum = 0;
          let samenumFlag = '';
          for (let i = 0; i < columnKeys.length; i++) {
            if (i == 0) {
              samenumFlag = item2[columnKeys[i]];
              sameNum = 1;
            } else {
              if (samenumFlag == item2[columnKeys[i]]) {
                sameNum++;
              }
            }
          }
          if (sameNum == columnKeys.length) {
            //删除该行
            item.children = item.children.filter((item3: any) => {
              return item3.categoryName != item2.categoryName;
            });
          }
        });
      }
    });
    datasource.value.push(...arrData);
  } else {
    //表格内容显示全部
    let columnKeys = datasourceAll.value;
    datasource.value = JSON.parse(JSON.stringify(columnKeys));
    checkBoxChange2(1);
  }
}

function checkBoxChange2(type: any) {
  if (type == 0) {
    checkBoxChecked2.value = !checkBoxChecked2.value;
  }
  //选中状态要隐藏相同项
  if (checkBoxChecked2.value) {
    let columnKeys: any = [];
    columns.value.forEach((item: any) => {
      if (item.key != null && item.key != undefined && item.key != '' && item.key != 'x1') {
        if (!item.key.startsWith('addTitle')) {
          columnKeys.push(item.key);
        }
      }
    });

    datasource.value.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((item2: any) => {
          let sameNum = 0;
          let samenumFlag = '';
          for (let i = 0; i < columnKeys.length; i++) {
            if (i == 0) {
              samenumFlag = item2[columnKeys[i]];
              sameNum = 1;
            } else {
              if (samenumFlag == item2[columnKeys[i]]) {
                sameNum++;
              }
            }
          }
          if (sameNum != columnKeys.length) {
            //修改该行背景色
            item2.bgColor = 'red';
          }
        });
      }
    });
  } else {
    datasource.value.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((item2: any) => {
          item2.bgColor = '';
        });
      }
    });
  }
}

function handleCloseFileList() {
  fileListVisible.value = false;
}

function getCompetitorFileList(id: any) {
  fileListVisible.value = true;
  nextTick(() => {
    fileListModel.value?.getListData(id);
  });
}

function propComparisonMain() {
  let nums = '';
  forEach(selectedRowList.value, (item: any) => {
    if (item.level == 2) {
      if (item.paraType != '2') {
        nums = nums + item.categoryName + ',';
      }
    }
  });
  if (nums != '') {
    message.warning('选择的‘' + nums.substring(0, nums.length - 1) + '’属性不是实数不能参与对比');
    return;
  }

  //获取表头
  let titleStr = ref<any>([]);
  let keyStr = ref<any>([]);
  titleStr.value = [];
  keyStr.value = [];
  forEach(columns.value, (item: any) => {
    if (item.key != null && item.key != undefined && item.key != '' && item.key != 'x1') {
      if (!item.key.startsWith('addTitle')) {
        titleStr.value.push(item.title);
        keyStr.value.push(item.key);
      }
    }
  });
  let nameStr = ref<any>([]);
  let nameStr2 = ref<any>([]);
  let xObject = ref<any>([]);
  let yObject = ref<any>([]);
  nameStr.value = [];
  xObject.value = [];
  yObject.value = [];

  forEach(selectedRowList.value, (item: any) => {
    if (item.level == 2) {
      nameStr.value.push(item.categoryName);
      nameStr2.value.push({ name: item.categoryName });
      //循环Columns 找到title等于changetitleNum的列替换成columnsAll中对应列
      let itemsel = ref<any>([]);
      keyStr.value.forEach((item2: any, index: number) => {
        itemsel.value.push(item[item2]);
      });
      xObject.value.push({
        name: item.categoryName,
        type: 'bar',
        data: itemsel,
      });
    }
  });
  keyStr.value.forEach((item2: any, index: number) => {
    let itemsel2 = ref<any>([]);
    forEach(selectedRowList.value, (item: any) => {
      if (item.level == 2) {
        //循环Columns 找到title等于changetitleNum的列替换成columnsAll中对应列
        if (item[item2] != null && item[item2] != undefined && item[item2] != '') {
          itemsel2.value.push(item[item2]);
        } else {
          itemsel2.value.push(0);
        }
      }
    });
    yObject.value.push({
      type: 'radar',
      name: titleStr.value[index],
      data: [{ value: itemsel2.value, name: titleStr.value[index] }],
      //lineStyle: { width: 2 },
      // 填充区域样式（透明度0.2避免重叠过深）
      areaStyle: {
        opacity: 0.2,
        //color: colorStr.value[index],
      },
    });
  });

  if (nameStr.value.length > 3) {
    port2Div.value = true;
    port2Visible.value = true;
    port2Div.value = false;
    nextTick(() => {
      //加载图信息
      const chartDom = document.getElementById('chart-container2');
      const myChart = echarts.init(chartDom);
      // 配置项
      const option = {
        // 图表标题
        title: {
          text: '竞品数据对比',
          left: 'left',
        },
        // 图例（区分不同对象）
        legend: {
          data: titleStr.value, // 与系列name对应
          bottom: 0,
          margin: 10,
          itemStyle: {
            //color: ['#5470c6', '#91cc75', 'fac858', 'ee6666', '73c0de', '3ba272', '#5470c6', '#91cc75', 'fac858', 'ee6666', '73c0de', '3ba272'],
            //color: 'red',
          },
        },
        // 提示框（鼠标悬停显示详细数据）
        tooltip: {
          trigger: 'item', // 触发方式：点击或悬停单个数据项
        },
        // 雷达图核心配置（定义维度和坐标轴）
        radar: {
          // 雷达图形状（'polygon'多边形 / 'circle'圆形）
          shape: 'polygon',
          // 每个维度的配置（指标名称、最大值等）
          indicator: nameStr2.value,
          // 坐标轴刻度标签样式
          axisLabel: {
            fontSize: 12,
          },
          // 雷达图中心位置调整
          center: ['50%', '50%'],
          // 雷达图大小（相对于容器的百分比）
          radius: '70%',
        },
        // 系列数据（雷达图的数据）
        series: yObject.value,
      };
      // 设置配置项并渲染图表
      myChart.setOption(option, true);
    });
  } else {
    portDiv.value = true;
    portVisible.value = true;
    portDiv.value = false;
    nextTick(() => {
      //加载图信息
      const chartDom = document.getElementById('chart-container');
      const myChart = echarts.init(chartDom);
      const option = {
        // 图表标题
        title: {
          text: '竞品数据对比',
          left: 'center',
        },
        // 图例（区分不同组数据）
        legend: {
          data: nameStr.value, // 与系列的name对应
          top: 30,
        },
        // 提示框（鼠标悬停时显示详细数据）
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }, // 阴影指示器
        },
        // 网格布局（调整图表位置）
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true, // 包含坐标轴标签
        },
        // x轴配置
        xAxis: {
          type: 'category',
          data: titleStr.value, // x轴分类
          axisLabel: { interval: 0 }, // 强制显示所有标签
        },
        // y轴配置
        yAxis: {
          type: 'value',
          name: '数值', // y轴名称
        },
        // 系列数据（多组柱状图的核心）
        series: xObject.value,
      };

      // 设置配置项并渲染图表
      myChart.setOption(option, true);
    });
  }
}

function closePortVisible() {
  portVisible.value = false;
}
function closePort2Visible() {
  port2Visible.value = false;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.importFileIndex');
}
function customGetContainer2() {
  // 返回自定义挂载节点
  return document.querySelector('.importFileIndex2');
}
function customGetContainer3() {
  // 返回自定义挂载节点
  return document.querySelector('.importFileIndex3');
}

const emit = defineEmits(['close', 'refresh-table-data']);
const tableRef = ref(null);
const getTableScrollContainer = () => {
  if (tableRef.value) {
    return tableRef.value.$el.querySelector('.ant-table-body');
  }
  return null;
};
defineExpose({ getListData });
</script>

<template>
  <a-modal title="竞品数据比较" class="modelstyle" v-model:visible="visible" width="100%" wrapClassName="full-modal" :confirm-loading="$isPending()" @cancel="emit('close')">
    <div class="drawerContent">
      <a-table
        v-if="datasource.length > 0"
        ref="tableRef"
        :columns="columns"
        :data-source="datasource"
        row-key="categoryName"
        bordered
        :row-selection="rowSelection"
        v-model:expandedRowKeys="defaultExpandedKeys"
        :pagination="false"
        :scroll="{ x: 'max-content', y: tableHeight }">
        <template #headerCell="{ column }">
          <template v-if="column.imgUrl != null && column.imgUrl != ''">
            <div style="text-align: center">
              <img :src="column.imgUrl" height="90px" width="190px" alt="" />
              <div style="display: flex; margin-top: 3px">
                <div class="tableTitle" style="width: 160px; margin-top: -3px">
                  <a-tooltip :title="column.title" placement="top">
                    {{ column.title }}
                  </a-tooltip>
                </div>
                <EpcIcon type="icon-cankaowenjian" v-if="column.fileStatus > 0" style="color: #165dff; cursor: pointer" @click="getCompetitorFileList(column.id)" />
                <!--添加删除icon-->
                <EpcIcon type="icon-shanchu2" style="color: red; margin-left: 5px; cursor: pointer" @click="deleteTableColumn(column.key)" />
              </div>
              <!--换车型按钮-->
              <a-button type="primary" style="width: 160px" v-if="column.title != '暂无车型'" @click="changeCarType(column.key)">换车型</a-button>
              <a-button type="primary" style="width: 160px" v-else @click="changeCarType(column.key)">添加车型</a-button>
            </div>
          </template>
          <template v-if="column.title == ''">
            <div style="margin-top: 40px; cursor: pointer; margin-left: -8px" v-if="columns.length < 12" @click="addCarType()">
              <img src="@/assets/images/addCar.png" alt="" width="40px" />
            </div>
          </template>
          <template v-if="column.key == 'x1' && column.title == '车型信息'">
            {{ column.title }}
            <div style="font-weight: 100; margin-top: 10px">
              <div>
                <label class="custom-checkbox">
                  <input type="checkbox" name="option1" @change="checkBoxChange" />隐藏相同参数
                  <span class="checkmark"></span>
                </label>
              </div>
              <div style="margin-top: 10px">
                <label class="custom-checkbox">
                  <input type="checkbox" name="option2" @change="checkBoxChange2(0)" />高亮不同参数
                  <span class="checkmark"></span>
                </label>
              </div>
              <div style="margin-top: 10px">
                <a-button type="primary" style="width: 160px" :disabled="selectedRowList.length < 1 || selectedRowList.length > 7" @click="propComparisonMain()">参数比较</a-button>
              </div>
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'x1'">
            <div class="tableTitle" style="width: 160px; text-align: left">
              <a-tooltip :title="record[column.dataIndex]" placement="top">
                {{ record[column.dataIndex] }}
                <span v-if="record.unit != null && record.unit != '' && record.unit != ' ' && record.unit != undefined && record.unit != 'null'">({{ record.unit }})</span>
              </a-tooltip>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'x2'">
            <div class="tableTitle" style="width: 160px; text-align: left; display: flex; justify-content: flex-start">
              <a-tooltip :title="record[column.dataIndex]" placement="top">
                {{ record[column.dataIndex] }}
              </a-tooltip>
            </div>
          </template>
          <template v-else>
            <template v-if="record.bgColor != null && record.bgColor != ''">
              <div class="tableTitle" style="width: 160px; text-align: left; white-space: normal; word-break: break-word; color: #165dff">
                <a-tooltip :title="record[column.dataIndex]" placement="top">
                  {{ record[column.dataIndex] }}
                </a-tooltip>
              </div>
            </template>
            <template v-else>
              <div class="tableTitle" style="width: 160px; text-align: left; white-space: normal; word-break: break-word">
                <a-tooltip :title="record[column.dataIndex]" placement="top">
                  {{ record[column.dataIndex] }}
                </a-tooltip>
              </div>
            </template>
          </template>
        </template>
      </a-table>
      <div v-if="datasource.length > 0" class="custom-btn">
        <a-back-top visibility-height="100" :target="getTableScrollContainer">
          <div class="ant-back-top-inner">
            <EpcIcon type="icon-huidaodingbu" style="font-size: 30px; color: white" />
          </div>
        </a-back-top>
      </div>
      <div v-else class="example">
        <a-spin tip="加载中..." />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="emit('close')"><EpcIcon type="icon-quxiao" style="font-size: 17px" />关闭</a-button>
      </div>
    </template>
  </a-modal>
  <div class="importFileIndex" v-dragModal>
    <a-modal title="车型选择" :getContainer="customGetContainer" v-model:visible="visible2" width="50%" zIndex="9999" style="z-index: 2000">
      <div style="height: 450px">
        <a-tree :tree-data="treeData" @select="onSelect" blockNode :default-expand-all="true" :field-names="{ categoryName: 'categoryName', key: 'id', children: 'children' }">
          <template #title="item">
            <span>{{ item.categoryName }}</span>
          </template>
        </a-tree>
        <Empty v-if="treeData.length == 0" />
      </div>
      <template #footer>
        <div class="dialog-footer"></div>
      </template>
    </a-modal>
  </div>

  <FileList ref="fileListModel" :modal-visible="fileListVisible" @close="handleCloseFileList" />

  <div class="importFileIndex2" v-dragModal>
    <a-modal
      title="参数比较图表"
      :getContainer="customGetContainer2"
      class="modelstyle"
      zIndex="9999"
      v-model:visible="portVisible"
      width="800px"
      :confirm-loading="$isPending()"
      @cancel="closePortVisible()">
      <div class="model-content">
        <!--echart 散点图-->
        <div id="chart-container" style="width: 770px; height: 300px" v-if="!portDiv"></div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="closePortVisible()"><EpcIcon type="icon-quxiao" style="font-size: 17px" />关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
  <div class="importFileIndex3" v-dragModal>
    <a-modal
      title="参数比较图表"
      class="modelstyle"
      :getContainer="customGetContainer3"
      v-model:visible="port2Visible"
      zIndex="9999"
      width="800px"
      :confirm-loading="$isPending()"
      @cancel="closePort2Visible()">
      <div class="model-content">
        <!--echart 散点图-->
        <div id="chart-container2" style="width: 770px; height: 300px" v-if="!port2Div"></div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="closePort2Visible()"><EpcIcon type="icon-quxiao" style="font-size: 17px" />关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
:deep(.custom-btn .ant-back-top) {
  bottom: 50px;
  right: 50px;
}
:deep(.custom-btn .ant-back-top-inner) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4d4d4d;
  &:hover {
    background-color: #151515;
  }
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  padding-right: 20px;
  background-color: #ffffff !important;
  height: 20px;
}
.example {
  position: absolute;
  top: 40%;
  left: 50%;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
.custom-checkbox input {
  position: absolute;
  opacity: 0; /* 隐藏原生复选框 */
  width: 0;
  height: 0;
}
.checkmark {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd; /* 边框颜色 */
  border-radius: 3px; /* 圆角 */
  background-color: #fff;
  vertical-align: middle;
  margin-right: 8px; /* 与文字间距 */
  position: relative;
}
/* 选中时的背景色 */
.custom-checkbox input:checked + .checkmark {
  background-color: #1890ff; /* 品牌色 */
  border-color: #1890ff;
}

/* 勾选图标（通过 ::after 生成对勾） */
.custom-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg); /* 旋转成对勾形状 */
}

.tableTitle {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
