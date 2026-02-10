<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import Empty from '@/components/Empty/index.vue';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { downloadFileFromStream } from '@/utils/file.ts';
const imgRooturl = import.meta.env.VITE_MINIO_PREVIEW_URL;
const userStore = useUserStore();
const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
const operateFlag = ref<any>('calc(100vh - 380px)');
const topFileComponents = ref<any>(null);
const taskStatusComponentsa = ref<any>(null);
const paramDisabled = ref<boolean>(false);
const keepDisabled = ref<boolean>(false);
const submitDisabled = ref<boolean>(false);
const updateDisabled = ref<boolean>(false);
const sumbitDisplay = ref<boolean>(false);
const activeKey = ref<string>('1');
const activeKey2 = ref<string>('1');

// 弹窗相关状态
const modalVisible = ref<boolean>(false);
const modalTitle = ref<string>('');
const currentCellData = ref<any>({});
const keyInvestProduct = ref<String>('');
const reduceInvestProduct = ref<String>('');
const fileListDataEnds = ref<any>([]);
const fileListData = ref<any>([]);
// 弹窗表格数据
const modalTableData = ref<any[]>([]);
// 弹窗表格列配置
const modalColumns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    customRender: ({ index }) => index + 1,
    width: 80,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'productName',
    key: 'productName',
    ellipsis: true,
    align: 'left',
  },
]);

const tableList = ref<any[]>([]);
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '区域',
    dataIndex: 'region',
    key: 'region',
    ellipsis: true,
    align: 'left',
    width: 80,
    resizable: true,
  },
  {
    title: '市域列车产品平台',
    dataIndex: 'metropolitanArea',
    key: 'metropolitanArea',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#F6FFED' },
  },
  {
    title: '地铁列车产品平台',
    dataIndex: 'subway',
    key: 'subway',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#FFFBE6' },
  },
  {
    title: '有轨电车产品平台',
    dataIndex: 'tram',
    key: 'tram',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#F9F0FF' },
  },
  {
    title: '单轨列车产品平台',
    dataIndex: 'monorailTrain',
    key: 'monorailTrain',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#FFF2F0' },
  },
  {
    title: '磁浮列车产品平台',
    dataIndex: 'maglevTrain',
    key: 'maglevTrain',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#96ca78' },
  },
  {
    title: '特种制式列车产品平台',
    dataIndex: 'specialTrain',
    key: 'specialTrain',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#89e0e6' },
  },
]);

const columnsSubway = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '集团',
    dataIndex: 'region',
    key: 'region',
    ellipsis: true,
    align: 'left',
    width: 80,
    resizable: true,
  },
  {
    title: '动车组产品平台',
    dataIndex: 'emu',
    key: 'emu',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#E6F7FF' },
  },
  {
    title: '铁路客车产品平台',
    dataIndex: 'bus',
    key: 'bus',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#58cac1' },
  },
  {
    title: '城际列车产品平台',
    dataIndex: 'intercity',
    key: 'intercity',
    ellipsis: true,
    align: 'center',
    width: 120,
    resizable: true,
    cellStyle: { backgroundColor: '#cfea8b' },
  },
]);

async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  getTaskWorkStatus();
  handleTabChange('1');
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const imgSize = file.size / 1024 / 1024 < 10;
  if (!imgSize) message.warn(`上传文件大小不能超过 ${10}M！`);
  return imgSize;
};

async function customRequest_A(options: any, type: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListDataEnds.value = [];
      fileListDataEnds.value.push({
        fileId: res.data.data.id,
        fileName: res.data.data.oldFileName,
        oldFileName: res.data.data.oldFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

async function customRequest_B(options: any, type: any) {
  // 调用上传接口
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.file = options.file as File;
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF(data);
    console.log(res);
    if (res.data.code == 200) {
      fileListData.value = [];
      fileListData.value.push({
        fileId: res.data.data.id,
        fileName: res.data.data.oldFileName,
        oldFileName: res.data.data.oldFileName,
        filePath: imgRooturl + res.data.data.newFileName,
        pdfFileName: imgRooturl + res.data.data.pdfFileName,
      });
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

// 多选点击行选择
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.productName;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.productName);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.productName !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}

async function submitOk(type: any) {
  if (type == 0) {
    if (activeKey.value == '2') {
      let data: any = {};
      data.planId = planTaskInfo.value.planId;
      data.keyInvestProduct = keyInvestProduct.value;
      data.reduceInvestProduct = reduceInvestProduct.value;
      const res = await AdminApiProductPlanTaskDesign.updateAllStrategy(data);
      if (res.data.code == 200) {
        submitAdd();
      }
    } else if (activeKey.value == '3') {
      let data: any = {};
      data.planId = planTaskInfo.value.planId;
      //循环文件取出fileID
      // 直接将map结果赋值给数组变量，不需要.value属性
      let strategyReviewFileIds: any = [];
      strategyReviewFileIds = fileListDataEnds.value.map(element => element.fileId);
      let strategyReviewProofFileIds: any = [];
      strategyReviewProofFileIds = fileListData.value.map(element => element.fileId);
      data.strategyReviewFileIds = strategyReviewFileIds;
      data.strategyReviewConclusion = itemReviewConclusion.value;
      data.strategyReviewInstr = strategyReviewInstr.value;
      // 格式化为后端需要的yyyy-MM-dd HH:mm:ss格式
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      data.strategyReviewTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      data.strategyReviewProofFileIds = strategyReviewProofFileIds;
      data.saveStatus = 1;
      data.taskId = planTaskInfo.value.id;
      const res = await AdminApiProductPlanTaskDesign.saveStrategyConclusion(data);
      if (res.data.code == 200) {
        submitAdd();
      }
    }
  } else {
    // 提交
    let data: any = {};
    data.planId = planTaskInfo.value.planId;
    //循环文件取出fileID
    // 直接将map结果赋值给数组变量，不需要.value属性
    let strategyReviewFileIds: any = [];
    strategyReviewFileIds = fileListDataEnds.value.map(element => element.fileId);
    let strategyReviewProofFileIds: any = [];
    strategyReviewProofFileIds = fileListData.value.map(element => element.fileId);
    data.strategyReviewFileIds = strategyReviewFileIds;
    data.strategyReviewConclusion = itemReviewConclusion.value;
    data.strategyReviewInstr = strategyReviewInstr.value;
    // 格式化为后端需要的yyyy-MM-dd HH:mm:ss格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    data.strategyReviewTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    data.strategyReviewProofFileIds = strategyReviewProofFileIds;
    data.saveStatus = 2;
    data.taskId = planTaskInfo.value.id;
    const res = await AdminApiProductPlanTaskDesign.saveStrategyConclusion(data);
    let data_A: any = {};
    data_A.taskId = planTaskInfo.value.id;
    data_A.planId = planTaskInfo.value.planId;
    data_A.fileType = 212;
    const res_A = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data_A);
    data_A.fileType = 213;
    const res_B = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data_A);
    if (res.data.code == 200 && res_A.data.code == 200 && res_B.data.code == 200) {
      if (itemReviewConclusion.value == '通过，进入开发产品周期规划阶段') {
        submitCommit();
      }
    }
  }
}

async function keepTechnology() {
  let data: any = { ...recordDataSource.value };
  Object.keys(data).forEach(key => {
    if (key !== 'index' && key !== 'region' && key !== 'id' && key !== 'planId' && key !== 'taskId' && key !== 'type') {
      const value = data[key];
      if (typeof value === 'string' && value.trim() !== '') {
        if (value.includes('<br/>')) {
          data[key] = value.split('<br/>').filter((item: string) => item.trim() !== '');
        } else {
          data[key] = [value];
        }
      } else if (value === null || value === undefined) {
        // 空值处理为数组
        data[key] = null;
      }
    }
  });
  if (columnKey.value && columnKey.value !== 'index' && columnKey.value !== 'region') {
    const selectedProducts = selectedRowList.value.map((item: any) => item.productName);
    data[columnKey.value] = selectedProducts;
  }
  console.log('处理后的数据:', data);
  try {
    const res = await AdminApiProductPlanTaskDesign.strategyUpdate(data);
    if (res.data.code == 200) {
      message.success('保存成功！');
    } else {
      message.error('保存失败！');
    }
    handleTabChange2(activeKey2.value);
    modalVisible.value = false;
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

async function handleTabChange(key: any) {
  if (key == '1') {
    activeKey.value = '1';
    handleTabChange2('1');
  } else if (key == '2') {
    activeKey.value = '2';
    const res = await AdminApiProductPlanTaskDesign.getAllStrategyDetail({ planId: planTaskInfo.value.planId });
    if (res.data.data) {
      keyInvestProduct.value = res.data.data.keyInvestProduct;
      reduceInvestProduct.value = res.data.data.reduceInvestProduct;
    }
  } else {
    activeKey.value = '3';
    const res = await AdminApiProductPlanTaskDesign.getStrategyConclusion({ planId: planTaskInfo.value.planId });
    if (res.data.data) {
      itemReviewConclusion.value = res.data.data.strategyReviewConclusion;
      strategyReviewInstr.value = res.data.data.strategyReviewInstr;
      fileListData.value = res.data.data.strategyReviewProofFileList;
      fileListDataEnds.value = res.data.data.strategyReviewFileList;
    }
  }
}

async function exportExcel() {
  let data: any = {};
  data.planId = planTaskInfo.value.planId;
  if (activeKey2.value == '1') {
    data.type = '城市铁路';
  } else {
    data.type = '干线铁路';
  }
  const res = await AdminApiProductPlanTaskDesign.excelExport(data);
  const fileName = data.type + '.xlsx';
  downloadFileFromStream(res, fileName);
}
// 处理JSON数组字段为字符串格式，支持表格换行展示
function processJsonArrayFields(data: any[]) {
  return data.map(item => {
    const processedItem = { ...item };

    // 遍历对象的所有属性
    Object.keys(processedItem).forEach(key => {
      const value = processedItem[key];

      // 如果属性值是数组
      if (Array.isArray(value) && value.length > 0) {
        // 检查数组元素是否为对象
        if (typeof value[0] === 'object' && value[0] !== null) {
          // 如果数组包含对象，将每个对象转换为字符串并以换行分隔
          processedItem[key] = value
            .map(obj => {
              // 将对象转换为键值对字符串
              return Object.entries(obj)
                .map(([k, v]) => `${k}: ${v}`)
                .join('; ');
            })
            .join('<br/>');
        } else {
          // 如果是简单数组，直接用换行连接
          processedItem[key] = value.join('<br/>');
        }
      }
    });

    return processedItem;
  });
}

async function handleTabChange2(key: any) {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  data.planId = planTaskInfo.value.planId;
  if (key == '1') {
    activeKey2.value = '1';
    data.type = '城市铁路';
    const res = await AdminApiProductPlanTaskDesign.combinationStrategyList(data);
    // 处理数据中的JSON数组字段
    tableList.value = processJsonArrayFields(res.data.data);
  } else if (key == '2') {
    activeKey2.value = '2';
    data.type = '干线铁路';
    const res = await AdminApiProductPlanTaskDesign.combinationStrategyList(data);
    // 处理数据中的JSON数组字段
    tableList.value = processJsonArrayFields(res.data.data);
  }
}

async function submitCommit() {
  //调取子方法
  taskStatusComponentsa.value?.submitCommit(planTaskInfo.value.progress);
}
async function submitAdd() {
  //调取子方法
  taskStatusComponentsa.value?.submitAdd(planTaskInfo.value.progress);
}

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
  sumbitDisplay.value = res.data.data.sumbitDisplay;
  planTaskInfo.value.progress = res.data.data.progress;
  if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true &&
    submitDisabled.value == true &&
    keepDisabled.value == true
  ) {
    paramDisabled.value = true;
  } else if (
    planTaskInfo.value.headUserId == productInfo.value.headUserId &&
    planTaskInfo.value.parentNodeName == productInfo.value.parentNodeName &&
    updateDisabled.value == true
  ) {
    paramDisabled.value = false;
  } else {
    paramDisabled.value = true;
  }
}
const emit = defineEmits(['refreshTree']);
async function refreshTree(id: any) {
  emit('refreshTree', id);
}
async function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

// 根据单元格数据获取样式，无数据时不显示背景色
function getCellStyle(record: any, column: any) {
  const baseStyle = { minHeight: '24px', padding: '4px 0' };
  const cellValue = record[column.dataIndex];
  if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
    return { ...column.cellStyle, ...baseStyle };
  }
  return baseStyle;
}

const recordDataSource = ref<any>({});
const columnKey = ref<any>('');
// 处理表格单元格点击事件
async function handleCellClick(record: any, column: any) {
  if (paramDisabled.value) {
    return;
  }
  recordDataSource.value = record;
  columnKey.value = column.key;
  // 排除序号、区域、集团列
  if (column.key === 'index' || column.key === 'region') {
    return;
  }
  // 获取单元格当前值
  const cellValue = record[column.dataIndex];
  try {
    const res = await AdminApiProductPlanTaskDesign.getProductByPlatformName({ platformNames: column.title });
    modalTitle.value = column.title;
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      modalTableData.value = res.data.data;
      if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
        const cellValues = cellValue.includes('<br/>') ? cellValue.split('<br/>').filter((item: string) => item.trim() !== '') : [cellValue];
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        cellValues.forEach(value => {
          const matchedProduct = modalTableData.value.find((product: any) => product.productName === value.trim());
          if (matchedProduct) {
            selectedRowkeys.value.push(matchedProduct.productName);
            selectedRowList.value.push(matchedProduct);
          }
        });
      } else {
        // 单元格为空时，清空勾选内容
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      }
    } else {
      modalTableData.value = [];
      // 清空勾选内容
      selectedRowkeys.value = [];
      selectedRowList.value = [];
    }

    currentCellData.value = { record, column };
    modalVisible.value = true;
  } catch (error) {
    console.error('获取产品数据失败:', error);
    modalTableData.value = [];
    // 清空勾选内容
    selectedRowkeys.value = [];
    selectedRowList.value = [];
    modalVisible.value = true;
  }
}

const selectStr = [
  { label: '通过，进入开发产品周期规划阶段', value: '通过，进入开发产品周期规划阶段' },
  { label: '不通过，重新定义产品组合策略', value: '不通过，重新定义产品组合策略' },
];
const itemReviewConclusion = ref<string>('通过，进入开发产品周期规划阶段');
const strategyReviewInstr = ref<string>('');
function linkClick(url: string) {
  window.open(url);
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.fileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.fileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function delEnSystemUpload(row: any) {
  fileListDataEnds.value = fileListDataEnds.value.filter((item: any) => item.fileId !== row.fileId);
}
function delEnSystemUploadB(row: any) {
  fileListData.value = fileListData.value.filter((item: any) => item.fileId !== row.fileId);
}
function handleClosePowModal() {
  powVisible.value = false;
}
const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});
function submitDisplayshow() {
  if (planTaskInfo.value.status == 2 || (activeKey.value == '3' && sumbitDisplay.value && itemReviewConclusion.value == '通过，进入开发产品周期规划阶段')) {
    return true;
  } else {
    return false;
  }
}
defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">产品组合策略</span>
      <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
    </div>
    <div style="margin-left: 15px; margin-top: -15px">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane key="1" tab="产品组合全景">
          <a-tabs v-model:activeKey="activeKey2" @change="handleTabChange2">
            <a-tab-pane key="1" tab="城市铁路">
              <a-table
                :scroll="{ x: 'max-content' }"
                :locale="localeA"
                @resizeColumn="handleResizeColumn"
                style="margin-left: 1px; margin-right: 10px; overflow-y: auto; height: 390px"
                :columns="columns"
                bordered
                :pagination="false"
                :data-source="tableList">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'index'">
                    {{ index + 1 }}
                  </template>
                  <template v-else>
                    <div v-html="record[column.dataIndex] || ''" :style="getCellStyle(record, column)" @click="handleCellClick(record, column)"></div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="干线铁路">
              <a-table
                :scroll="{ x: 'max-content' }"
                :locale="localeA"
                @resizeColumn="handleResizeColumn"
                style="margin-left: 1px; margin-right: 10px; overflow-y: auto; height: 390px"
                :columns="columnsSubway"
                bordered
                :pagination="false"
                :data-source="tableList">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'index'">
                    {{ index + 1 }}
                  </template>
                  <template v-else>
                    <div v-html="record[column.dataIndex] || ''" :style="getCellStyle(record, column)" @click="handleCellClick(record, column)"></div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane key="2" tab="整体投资策略">
          <div>
            <span style="margin-left: 1px; font-weight: 600; font-size: 16px">重点投资产品</span>
            <a-textarea v-model:value="keyInvestProduct" placeholder="请输入" style="width: 99%; height: 170px; margin-top: 10px"></a-textarea>
          </div>
          <div style="margin-top: 10px">
            <span style="margin-left: 1px; font-weight: 600; font-size: 16px">维持或缩减投资产品</span>
            <a-textarea v-model:value="reduceInvestProduct" placeholder="请输入" style="width: 99%; height: 170px; margin-top: 10px"></a-textarea>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="产品组合策略评审意见">
          <div>
            <span style="margin-left: 1px; font-weight: 600; font-size: 20px">评审结论</span>
            <div style="margin-top: 20px">
              <span style="margin-left: 1px; font-weight: 500; font-size: 15px">产品组合策略文件</span>
              <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_A(options, 1)" :show-upload-list="false">
                <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
                  <EpcIcon type="icon-shangchuanwenjian1" style="font-size: 14px" />
                  {{ $t('上传文件') }}
                </a-button>
              </a-upload>
            </div>
            <div class="upload-file-wrap" style="margin-top: 20px">
              <div v-for="(item, index) in fileListDataEnds" :key="index">
                <div class="file-list">
                  <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                  <div class="file-dec">
                    <div class="tit">{{ item.oldFileName }}</div>
                    <div class="number">
                      <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                    </div>
                    <a-button class="elbuttoAn" @click="priview(item)">
                      <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    </a-button>
                    <a-button class="elbutton" :disabled="paramDisabled" @click="delEnSystemUpload(item)">
                      <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
            <div style="display: flex; margin-top: 20px">
              <div style="width: 50%; margin-right: 20px">
                <div style="margin-bottom: 20px">
                  <span style="margin-left: 1px; font-weight: 500; font-size: 15px">评审结论：</span>
                  <a-select v-model:value="itemReviewConclusion" placeholder="请选择评审结论" style="width: 100%; margin-top: 10px">
                    <a-select-option v-for="option in selectStr" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <!-- 证明材料 -->
                <div style="margin-bottom: 10px">
                  <span style="margin-left: 1px; font-weight: 500; font-size: 15px">证明材料</span>
                  <a-upload ref="fileUpload" multiple :before-upload="beforeUpload" :custom-request="options => customRequest_B(options, 1)" :show-upload-list="false">
                    <a-button type="primary" style="margin-left: 20px" :disabled="paramDisabled">
                      <EpcIcon type="icon-shangchuan" style="font-size: 14px" />
                      {{ $t('上传材料') }}
                    </a-button>
                  </a-upload>
                </div>
                <div class="upload-file-wrap" style="margin-top: 20px">
                  <div v-for="(item, index) in fileListData" :key="index">
                    <div class="file-list">
                      <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                      <div class="file-dec">
                        <div class="tit">{{ item.oldFileName }}</div>
                        <div class="number">
                          <div style="color: #0d53e2; cursor: pointer" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                        </div>
                        <a-button class="elbuttoAn" @click="priview(item)">
                          <EpcIcon type="icon-liulan" style="font-size: 15px" />
                        </a-button>
                        <a-button class="elbutton" :disabled="paramDisabled" @click="delEnSystemUploadB(item)">
                          <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右侧：说明（单独显示） -->
              <div style="width: 50%">
                <div style="margin-bottom: 10px">
                  <span style="margin-left: 1px; font-weight: 500; font-size: 15px">说明</span>
                </div>
                <a-textarea v-model:value="strategyReviewInstr" placeholder="请输入" style="width: 99%; height: 200px; min-height: 200px"></a-textarea>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <taskStatusComponents
    v-show="activeKey != '1'"
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    :submitDisplay="submitDisplayshow()"
    ref="taskStatusComponentsa"></taskStatusComponents>
  <!-- 信息弹窗 -->
  <a-modal v-model:visible="modalVisible" :title="modalTitle" :mask-closable="false" width="600px">
    <a-table
      :columns="modalColumns"
      :data-source="modalTableData"
      size="small"
      :pagination="false"
      :row-key="(record: any) => record.productName"
      :row-selection="rowSelection"
      :customRow="customRow"
      style="height: 300px; overflow-y: auto"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="keepTechnology()"> 确定 </a-button>
      <a-button @click="modalVisible = false">取消</a-button>
    </template>
  </a-modal>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style lang="less" scoped>
.role-item {
  margin-right: 20px;
  margin-bottom: 10px;
}
.role-label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
  text-align: right;
}
.role-user-container {
  display: flex;
  flex-wrap: wrap;
}
//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 1px;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 50px);
  .file-list {
    min-width: 493px;
    max-width: 493px;
    height: 72px;
    background: #f3f2f7;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    margin-right: 12px;
    margin-bottom: 12px;
    .icon {
      min-width: 40px;
      max-width: 40px;
      height: 40px;
      color: #0d53e2;
      margin: 15px 13px 20px 15px;
    }
    .file-dec {
      position: relative;
      width: 100%;
      .tit {
        margin: 16px 0 4px 0;
        height: 22px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .number {
        display: flex;
        align-items: center;
        height: 12px;
        font-family:
          Source Sans 3,
          Source Sans 3;
        font-weight: 400;
        font-size: 12px;
        color: #6a696e;
        line-height: 12px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        .hover-link {
          font-size: 12px !important;
          height: 14px;
          width: 280px;
          overflow: hidden;
          color: #0d53e2;
          cursor: pointer;
        }
      }
      .elbutton {
        position: absolute;
        right: 0px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
      .elbuttoAn {
        position: absolute;
        right: 30px;
        top: 20px;
        background: none !important;
        border: none !important;
      }
    }
  }
}

//底部按钮
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}

//内容标题
.content-title {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  margin-left: 16px;
  i {
    width: 6px;
    height: 20px;
    background: #0d53e2;
    border-radius: 0px 0px 0px 0px;
    margin-right: 8px;
  }
  .test {
    height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.bodyPageStyle {
  background-color: #ffffff !important;
  overflow-y: auto;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input {
  text-align: left;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-picker) {
  width: 100%;
  border-radius: 2px;
}

:deep(.ant-table-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: center;
  height: 40px;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.ant-table-tbody > tr > td:first-child) {
  font-weight: 500;
}

:deep(.ant-table) {
  margin-bottom: 0;
}
</style>
