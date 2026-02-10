<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs, Form, InputNumber, UploadProps } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const { TabPane: ATabPane } = ATabs;
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { AdminApiProductPlanTaskDesign } from '@/api/tags/productSpecification/产品规划后台设计';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import topComponents from './topComponents.vue';
import taskStatusComponents from './taskStatusComponents.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import MemberAuthModal from '@/components/MemberAuthModal/index.vue'; // 引入封装组件
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { file } from '@babel/types';
import { A } from 'vitest/dist/chunks/environment.LoooBwUu';
import { downloadFileFromStream } from '@/utils/file.ts';
import { UploadFile } from '@/components/UploadFile';
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
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
  nextTick(() => {
    topFileComponents.value?.initInfo(planTaskInfo.value, productInfo.value);
    taskStatusComponentsa.value?.initInfo(planTaskInfo.value, productInfo.value);
  });
  initPageData();
  getTaskWorkStatus();
}
//浏览器大小变化
watch(
  () => window.innerWidth,
  val => {
    operateFlag.value = 'calc(100vh - 380px)';
  }
);

async function initPageData() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.purchasedList(data);
  tableList.value = res.data.data;
}

async function submitOk(type: any) {
  if (type == 0) {
    submitAdd();
  } else {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    data.planId = planTaskInfo.value.planId;
    data.fileType = 207;
    const res = await AdminApiProductPlanTaskDesign.fileSaveExportFile(data);
    if (res.data.code == 200) {
      submitCommit();
    }
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

const localeA = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    text: '数据为空',
    style: { paddingBottom: '50px', marginTop: '50px' },
  }),
});

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

async function priviewPram(record: any) {
  modalTitle.value = '查看外购部件分析';
  currentRecord.value = record;
  formData.id = record.id;
  formData.materialName = record.materialName;
  formData.specifications = record.specifications;
  formData.model = record.model;
  formData.analyst = record.analyst;
  formData.analystName = record.analystName;
  formData.analystDate = record.analystDate;
  formData.technicalStandard = record.technicalStandard;
  formData.performanceCompliance = record.performanceCompliance;
  formData.interfaceCompatibilityAssessment = record.interfaceCompatibilityAssessment;
  formData.ppm = record.ppm;
  formData.mtbf = record.mtbf;
  formData.testRequirement = record.testRequirement;
  formData.unitPrice = record.unitPrice;
  formData.purchaseQuantity = record.purchaseQuantity;
  formData.toolFee = record.toolFee;
  formData.logisticsCost = record.logisticsCost;
  formData.paymentTerms = record.paymentTerms;
  formData.totalCostEstimation = record.totalCostEstimation;
  formData.supplierName = record.supplierName;
  formData.supplierLocation = record.supplierLocation;
  formData.qualification = record.qualification;
  formData.technicalCapabilityAssess = record.technicalCapabilityAssess;
  formData.deliveryCapabilityAssess = record.deliveryCapabilityAssess;
  formData.cooperationHistory = record.cooperationHistory;
  formData.procurementCycle = record.procurementCycle;
  formData.mqq = record.mqq;
  formData.alternativeSuppliers = record.alternativeSuppliers;
  formData.singleSourceRisk = record.singleSourceRisk;
  formData.geopolitics = record.geopolitics;
  formData.lifecycleState = record.lifecycleState;
  formData.inventoryStrategySuggestions = record.inventoryStrategySuggestions;
  formData.partType = record.partType;
  formData.overallRiskAssessment = record.overallRiskAssessment;
  formData.procurementAdvice = record.procurementAdvice;
  formData.riskMitigationMeasures = record.riskMitigationMeasures;
  formData.finalEvaluation = record.finalEvaluation;
  formData.taskId = planTaskInfo.value.id;
  modalPriviewVisible.value = true;
}

async function updatePram(record: any) {
  modalTitle.value = '编辑外购部件分析';
  currentRecord.value = record;
  formData.id = record.id;
  formData.materialName = record.materialName;
  formData.specifications = record.specifications;
  formData.model = record.model;
  formData.analyst = record.analyst;
  formData.analystName = record.analystName;
  formData.analystDate = record.analystDate;
  formData.technicalStandard = record.technicalStandard;
  formData.performanceCompliance = record.performanceCompliance;
  formData.interfaceCompatibilityAssessment = record.interfaceCompatibilityAssessment;
  formData.ppm = record.ppm;
  formData.mtbf = record.mtbf;
  formData.testRequirement = record.testRequirement;
  formData.unitPrice = record.unitPrice;
  formData.purchaseQuantity = record.purchaseQuantity;
  formData.toolFee = record.toolFee;
  formData.logisticsCost = record.logisticsCost;
  formData.paymentTerms = record.paymentTerms;
  formData.totalCostEstimation = record.totalCostEstimation;
  formData.supplierName = record.supplierName;
  formData.supplierLocation = record.supplierLocation;
  formData.qualification = record.qualification;
  formData.technicalCapabilityAssess = record.technicalCapabilityAssess;
  formData.deliveryCapabilityAssess = record.deliveryCapabilityAssess;
  formData.cooperationHistory = record.cooperationHistory;
  formData.procurementCycle = record.procurementCycle;
  formData.mqq = record.mqq;
  formData.alternativeSuppliers = record.alternativeSuppliers;
  formData.singleSourceRisk = record.singleSourceRisk;
  formData.geopolitics = record.geopolitics;
  formData.lifecycleState = record.lifecycleState;
  formData.inventoryStrategySuggestions = record.inventoryStrategySuggestions;
  formData.partType = record.partType;
  formData.overallRiskAssessment = record.overallRiskAssessment;
  formData.procurementAdvice = record.procurementAdvice;
  formData.riskMitigationMeasures = record.riskMitigationMeasures;
  formData.finalEvaluation = record.finalEvaluation;
  formData.taskId = planTaskInfo.value.id;
  modalVisible.value = true;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.Wgbjfx');
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);

function handleClosePowModal() {
  powVisible.value = false;
}
async function deletePram(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条外购部件分析记录吗？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let data: any = {};
        data.id = record.id;
        const res = await AdminApiProductPlanTaskDesign.purachasedDelete(data);
        if (res.data.code === 200) {
          message.success('删除成功');
          // 重新加载数据
          await initPageData();
        } else {
          message.error(res.data.message || '删除失败');
        }
      } catch (error) {
        message.error('删除失败，请重试');
      }
    },
  });
}

const tableList = ref<any>([]);
// 弹窗相关状态
const modalVisible = ref<boolean>(false);
const modalPriviewVisible = ref<boolean>(false);
const modalTitle = ref<string>('添加外购部件分析');
const currentRecord = ref<any>(null);
// 下拉框选项数据
const qualificationOptions = [
  { label: '战略供应商', value: '战略供应商' },
  { label: '优先供应商', value: '优先供应商' },
  { label: '合格供应商', value: '合格供应商' },
  { label: '潜在供应商', value: '潜在供应商' },
];

const interfaceCompatibilityOptions = [
  { label: '完全兼容', value: '完全兼容' },
  { label: '需适配', value: '需适配' },
  { label: '不兼容', value: '不兼容' },
];

const singleSourceRiskOptions = [
  { label: '无风险(多来源)', value: '无风险(多来源)' },
  { label: '低风险(有替代方案)', value: '低风险(有替代方案)' },
  { label: '中风险(替代困难)', value: '中风险(替代困难)' },
  { label: '高风险(唯一来源)', value: '高风险(唯一来源)' },
];

const lifecycleStateOptions = [
  { label: '导入期', value: '导入期' },
  { label: '成长期', value: '成长期' },
  { label: '成熟期', value: '成熟期' },
  { label: '衰退期', value: '衰退期' },
  { label: '即将停产', value: '即将停产' },
];

const inventoryStrategyOptions = [
  { label: 'JIT(零库存)', value: 'JIT(零库存)' },
  { label: '安全库存', value: '安全库存' },
  { label: '批量采购', value: '批量采购' },
  { label: '战略储备', value: '战略储备' },
];

const partTypeOptions = [
  { label: 'A类(关键件)', value: 'A类(关键件)' },
  { label: 'B类(重要件)', value: 'B类(重要件)' },
  { label: 'C类(标准件)', value: 'C类(标准件)' },
];

const overallRiskAssessmentOptions = [
  { label: '低风险', value: '低风险' },
  { label: '中风险', value: '中风险' },
  { label: '高风险', value: '高风险' },
];

const procurementAdviceOptions = [
  { label: '推荐采购', value: '推荐采购' },
  { label: '有条件推荐', value: '有条件推荐' },
  { label: '不推荐', value: '不推荐' },
];

// 表单数据
const formData = reactive({
  id: '',
  materialName: '',
  specifications: '',
  model: '',
  analyst: '',
  analystName: '',
  analystDate: '',
  technicalStandard: '',
  performanceCompliance: '',
  interfaceCompatibilityAssessment: undefined,
  ppm: '',
  mtbf: '',
  testRequirement: '',
  unitPrice: '',
  purchaseQuantity: '',
  toolFee: '',
  logisticsCost: '',
  paymentTerms: '',
  totalCostEstimation: '',
  supplierName: '',
  supplierLocation: '',
  qualification: undefined,
  technicalCapabilityAssess: '',
  deliveryCapabilityAssess: '',
  cooperationHistory: '',
  procurementCycle: '',
  mqq: '',
  alternativeSuppliers: '',
  singleSourceRisk: undefined,
  geopolitics: '',
  lifecycleState: undefined,
  inventoryStrategySuggestions: undefined,
  partType: undefined,
  overallRiskAssessment: undefined,
  procurementAdvice: undefined,
  riskMitigationMeasures: '',
  finalEvaluation: '',
  taskId: '',
});
// 表单实例
const formRef = ref();
// 表单验证规则
const rules = {
  materialName: [{ required: true, message: '请输入物料名称/描述', trigger: 'blur' }],
  specifications: [{ required: true, message: '请输入型号/规格', trigger: 'blur' }],
  model: [{ required: true, message: '请输入所属产品/模块', trigger: 'blur' }],
  analystDate: [{ required: true, message: '请选择分析时间', trigger: 'change' }],
  analyst: [{ required: true, message: '请输入分析负责人', trigger: 'change' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  partType: [{ required: true, message: '请选择部件分类', trigger: 'blur' }],
  overallRiskAssessment: [{ required: true, message: '请选择总体风险评估', trigger: 'blur' }],
  procurementAdvice: [{ required: true, message: '请选择采购建议', trigger: 'blur' }],
};
const columns = ref<TableColumnType<any>[]>([
  {
    title: '序号',
    key: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '物料名称/描述',
    dataIndex: 'materialName',
    key: 'materialName',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.materialName, b.materialName),
  },
  {
    title: '型号/规格',
    dataIndex: 'specifications',
    key: 'specifications',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.specifications, b.specifications),
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.supplierName, b.supplierName),
  },
  {
    title: '交付能力评估',
    dataIndex: 'deliveryCapabilityAssess',
    key: 'deliveryCapabilityAssess',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.deliveryCapabilityAssess, b.deliveryCapabilityAssess),
  },
  {
    title: '部件分类',
    dataIndex: 'partType',
    key: 'partType',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.partType, b.partType),
  },
  {
    title: '总体风险评估',
    dataIndex: 'overallRiskAssessment',
    key: 'overallRiskAssessment',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.overallRiskAssessment, b.overallRiskAssessment),
  },
  {
    title: '采购建议',
    dataIndex: 'procurementAdvice',
    key: 'procurementAdvice',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.procurementAdvice, b.procurementAdvice),
  },
  {
    title: '分析负责人',
    dataIndex: 'analyst',
    key: 'analyst',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.analyst, b.analyst),
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    align: 'left',
    width: 120,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]);

async function getTaskWorkStatus() {
  let data: any = {};
  data.id = planTaskInfo.value.id;
  data.userId = userStore.getUser.id;
  const res = await AdminApiSystemProductSpecification.getProductTaskWorkStatus(data);
  paramDisabled.value = res.data.data.paramDisabled;
  keepDisabled.value = res.data.data.keepDisabled;
  submitDisabled.value = res.data.data.submitDisabled;
  updateDisabled.value = res.data.data.updateDisabled;
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

async function downLoadTemplate() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.partsExcelTemplate(data);
  const fileName = '外购部件分析模板.xlsx';
  downloadFileFromStream(res, fileName);
}

const openfileUploadModal = ref<boolean>(false);
const uploadFileList = ref<any>([]);
const fileList = ref<any>([]);
async function importExcelModal() {
  uploadFileList.value = [];
  fileList.value = [];
  openfileUploadModal.value = true;
}

async function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    let data: any = {};
    data.taskId = planTaskInfo.value.id;
    const file = fileList.value[0];
    const res = await AdminApiProductPlanTaskDesign.partsExcelImport({
      file,
      data,
    });
    if (res.data.code == 200) {
      openfileUploadModal.value = false;
      await initPageData();
      message.success(WeiI18n.t('导入成功').value);
    }
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

async function datacustomRequest(options: any) {
  fileList.value[0] = options.file;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
    });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      uploadFileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

async function exportExcel() {
  let data: any = {};
  data.taskId = planTaskInfo.value.id;
  const res = await AdminApiProductPlanTaskDesign.partsExcelExport(data);
  const fileName = '外购部件分析数据.xlsx';
  downloadFileFromStream(res, fileName);
}

async function addModule() {
  modalTitle.value = '添加外购部件分析';
  currentRecord.value = null;
  formData.id = '';
  formData.materialName = '';
  formData.specifications = '';
  formData.model = '';
  formData.analyst = '';
  formData.analystName = '';
  formData.analystDate = '';
  formData.technicalStandard = '';
  formData.performanceCompliance = '';
  formData.interfaceCompatibilityAssessment = undefined;
  formData.ppm = '';
  formData.mtbf = '';
  formData.testRequirement = '';
  formData.unitPrice = '';
  formData.purchaseQuantity = '';
  formData.toolFee = '';
  formData.logisticsCost = '';
  formData.paymentTerms = '';
  formData.totalCostEstimation = '';
  formData.supplierName = '';
  formData.supplierLocation = '';
  formData.qualification = undefined;
  formData.technicalCapabilityAssess = '';
  formData.deliveryCapabilityAssess = '';
  formData.cooperationHistory = '';
  formData.procurementCycle = '';
  formData.mqq = '';
  formData.alternativeSuppliers = '';
  formData.singleSourceRisk = undefined;
  formData.geopolitics = '';
  formData.lifecycleState = undefined;
  formData.inventoryStrategySuggestions = undefined;
  formData.partType = undefined;
  formData.overallRiskAssessment = undefined;
  formData.procurementAdvice = undefined;
  formData.riskMitigationMeasures = '';
  formData.finalEvaluation = '';
  formData.taskId = planTaskInfo.value.id;
  modalVisible.value = true;
}

// 保存表单数据
async function saveForm() {
  // 使用表单验证
  try {
    await formRef.value?.validate();
    let data = formData;
    console.log(data);
    let res;
    if (currentRecord.value == null) {
      res = await AdminApiProductPlanTaskDesign.purChasedCreate(data);
      if (res.data.code === 200) {
        message.success('添加成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } else {
      res = await AdminApiProductPlanTaskDesign.purChasedUpdate(data);
      if (res.data.code === 200) {
        message.success('修改成功');
        modalVisible.value = false;
        // 重新加载数据
        await initPageData();
      } else {
        message.error(res.data.message || '修改失败');
      }
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('表单验证失败，请检查输入信息');
    } else {
      message.error('操作失败，请重试');
    }
  }
}

const groupData = ref<any>([]);
const grpuVisible = ref(false);
const targetKeys = ref<any>([]);
async function handleUserBrowse() {
  const resB = await AdminApiSystemUser.getSimpleUsers({});
  groupData.value = resB.data.data || [];
  if (formData.analyst) {
    targetKeys.value.push(formData.analyst);
  } else {
    targetKeys.value = [];
  }
  grpuVisible.value = true;
}

async function handleClose() {
  grpuVisible.value = false;
}
async function handleModalConfirm() {
  formData.analyst = targetKeys.value[0];
  // 根据headUserId循环commonData数组查找对应的用户名称
  const selectedUser = groupData.value.find(item => item.id === targetKeys.value[0]);
  if (selectedUser) {
    formData.analystName = selectedUser.nickname || '';
  } else {
    formData.analystName = '';
  }
  grpuVisible.value = false;
}
function handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
  targetKeys.value = nextTargetKeys;
  console.log(targetKeys.value);
}

defineExpose({ initInfo });
</script>

<template>
  <topComponents ref="topFileComponents"></topComponents>
  <div class="bodyPageStyle" :style="{ height: operateFlag }">
    <div class="content-title">
      <i></i>
      <span class="test">外购部件分析</span>
      <a-button type="primary" style="margin-left: 20px" @click="downLoadTemplate()"> <EpcIcon type="icon-xiazaimoban" style="font-size: 16px" />下载模板</a-button>
      <a-button type="primary" @click="importExcelModal()" style="margin-left: 20px" :disabled="paramDisabled">
        <EpcIcon type="icon-mobanxiazai" style="font-size: 16px" />导入</a-button
      >
      <a-button type="primary" @click="exportExcel()" style="margin-left: 20px"> <EpcIcon type="icon-shangchuan" style="font-size: 16px" />导出</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="addModule()" :disabled="paramDisabled"> <EpcIcon type="icon-tianjia1" style="font-size: 12px" />添加</a-button>
    </div>
    <a-div>
      <a-div>
        <a-table
          :scroll="{ x: 'max-content' }"
          :locale="localeA"
          @resizeColumn="handleResizeColumn"
          style="margin-left: 20px; margin-right: 10px; overflow-y: auto; height: 390px"
          :columns="columns"
          bordered
          :pagination="false"
          :data-source="tableList">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ index + 1 }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">编辑</a>
              <a v-else @click="updatePram(record)" type="link">编辑</a>
              <a-divider type="vertical" />
              <a v-if="paramDisabled" :disabled="paramDisabled" type="link">删除</a>
              <a v-else @click="deletePram(record)" type="link">删除</a>
              <a-divider type="vertical" />
              <a @click="priviewPram(record)" type="link">详情</a>
            </template>
          </template>
        </a-table>
      </a-div>
    </a-div>
  </div>
  <taskStatusComponents
    @submitOk="submitOk"
    @getTaskWorkStatus="getTaskWorkStatus"
    @refreshTree="refreshTree"
    :keepDisabled="keepDisabled"
    :submitDisabled="submitDisabled"
    :updateDisabled="updateDisabled"
    ref="taskStatusComponentsa"></taskStatusComponents>

  <div class="Wgbjfx" v-dragModal>
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :getContainer="customGetContainer"
      :width="1000"
      :mask-closable="false"
      :body-style="{ height: '600px', overflowY: 'auto', padding: '20px' }">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" style="padding: 20px">
        <a-collapse class="custom-collapse" :defaultActiveKey="['1', '2', '3', '4', '5', '6']">
          <a-collapse-panel key="1" header="基础信息">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="物料名称/描述" name="materialName" required>
                  <a-input v-model:value="formData.materialName" placeholder="请输入物料名称/描述" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="型号/规格" name="specifications" required>
                  <a-input v-model:value="formData.specifications" placeholder="请输入型号/规格" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="所属产品/模块" name="model" required>
                  <a-input v-model:value="formData.model" placeholder="请输入所属产品/模块" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="分析时间" name="analystDate" required>
                  <a-date-picker
                    :locale="locale"
                    v-model:value="formData.analystDate"
                    format="YYYY-MM-DD "
                    placeholder="请选择分析时间"
                    value-format="YYYY-MM-DD"
                    style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="分析负责人" name="analyst" required>
                  <a-input v-model:value="formData.analyst" placeholder="请选择分析负责人" :style="{ width: '49%' }" allowClear />
                  <!-- <a-button style="margin-left: 10px" type="primary" @click="handleUserBrowse()"> <EpcIcon type="icon-liulan" style="font-size: 16px" />浏览</a-button> -->
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="技术与质量">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="技术标准/认证要求" name="technicalStandard">
                  <a-input v-model:value="formData.technicalStandard" placeholder="请输入技术标准/认证要求" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="性能参数符合度" name="performanceCompliance">
                  <a-radio-group v-model:value="formData.performanceCompliance" button-style="solid" :style="{ display: 'flex', gap: '10px' }">
                    <a-radio-button value="完全符合">完全符合</a-radio-button>
                    <a-radio-button value="部分符合">部分符合</a-radio-button>
                    <a-radio-button value="需改进">需改进</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="接口兼容性评估" name="interfaceCompatibilityAssessment">
                  <a-select v-model:value="formData.interfaceCompatibilityAssessment" placeholder="请选择接口兼容性评估" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in interfaceCompatibilityOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="质量等级/失效率(PPM)" name="ppm">
                  <a-input v-model:value="formData.ppm" placeholder="请输入质量等级/失效率" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="可靠性数据(MTBF)" name="mtbf">
                  <a-input v-model:value="formData.mtbf" placeholder="请输入可靠性数据(MTBF)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="测试与验证要求" name="testRequirement">
                  <a-textarea v-model:value="formData.testRequirement" placeholder="请输入测试与验证要求" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="成本与商务">
            <a-row style="display: flex; justify-content: space-between">
              <a-col :span="12" style="display: flex; justify-content: space-between">
                <a-form-item label="单价(元)" name="unitPrice" required>
                  <a-input v-model:value="formData.unitPrice" placeholder="请输入单价(元)" allowClear />
                </a-form-item>
                <a-form-item style="margin-right: 10px" label="采购数量" name="purchaseQuantity">
                  <a-input type="number" v-model:value="formData.purchaseQuantity" placeholder="请输入采购数量" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item style="margin-left: 8px" label="模具费/NRE(元)" name="toolFee">
                  <a-input v-model:value="formData.toolFee" :style="{ width: '100%' }" placeholder="请输入模具费/NRE(元)" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="form-row" style="margin-top: 10px">
              <div class="form-col">
                <a-form-item label="物流成本(元)" name="logisticsCost">
                  <a-input v-model:value="formData.logisticsCost" placeholder="请输入物流成本(元)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="付款条款" name="paymentTerms">
                  <a-input v-model:value="formData.paymentTerms" placeholder="请输入付款条款" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="总拥有成本估算(元)" name="totalCostEstimation">
                  <a-input v-model:value="formData.totalCostEstimation" placeholder="请输入总拥有成本估算(元)" :style="{ width: '49%' }" allowClear />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="供应商信息">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="供应商名称" name="supplierName" required>
                  <a-input v-model:value="formData.supplierName" placeholder="请输入供应商名称" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="供应商所在地" name="supplierLocation">
                  <a-input v-model:value="formData.supplierLocation" placeholder="请输入供应商所在地" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="供应商等级/资质" name="qualification">
                  <a-select v-model:value="formData.qualification" placeholder="请选择供应商等级/资质" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in qualificationOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="技术能力评估(1-10分)" name="technicalCapabilityAssess">
                  <a-input v-model:value="formData.technicalCapabilityAssess" placeholder="请输入技术能力评估(1-10分)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="交付能力评估" name="deliveryCapabilityAssess">
                  <a-radio-group v-model:value="formData.deliveryCapabilityAssess" button-style="solid" :style="{ display: 'flex', gap: '10px' }">
                    <a-radio-button value="优秀">优秀</a-radio-button>
                    <a-radio-button value="良好">良好</a-radio-button>
                    <a-radio-button value="一般">一般</a-radio-button>
                    <a-radio-button value="较差">较差</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="合作历史/业绩评价" name="cooperationHistory">
                  <a-textarea v-model:value="formData.cooperationHistory" placeholder="请输入合作历史/业绩评价" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="5" header="供应链与风险">
            <a-row style="display: flex; justify-content: space-between">
              <a-col :span="12" style="display: flex; justify-content: space-between">
                <a-form-item label="采购周期(天)" name="procurementCycle">
                  <a-input v-model:value="formData.procurementCycle" placeholder="请输入采购周期(天)" allowClear />
                </a-form-item>
                <a-form-item style="margin-right: 10px" label="最小起订量" name="mqq">
                  <a-input v-model:value="formData.mqq" placeholder="请输入最小起订量" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item style="margin-left: 8px" label="替代供应商/部件" name="alternativeSuppliers">
                  <a-input v-model:value="formData.alternativeSuppliers" :style="{ width: '100%' }" placeholder="请输入替代供应商/部件" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="form-row" style="margin-top: 10px">
              <div class="form-col">
                <a-form-item label="生命周期状态" name="lifecycleState">
                  <a-select v-model:value="formData.lifecycleState" placeholder="请选择生命周期状态" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in lifecycleStateOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="库存策略建议" name="inventoryStrategySuggestions">
                  <a-select v-model:value="formData.inventoryStrategySuggestions" placeholder="请选择库存策略建议" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in inventoryStrategyOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="单一来源风险" name="singleSourceRisk">
                  <a-select v-model:value="formData.singleSourceRisk" placeholder="请选择单一来源风险" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in singleSourceRiskOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="地缘政治/贸易风险" name="geopolitics">
                  <a-textarea v-model:value="formData.geopolitics" placeholder="请输入地缘政治/贸易风险" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="6" header="综合评估与决策">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="部件分类" name="partType" required>
                  <a-select v-model:value="formData.partType" placeholder="请选择部件分类" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in partTypeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="总体风险评估" name="overallRiskAssessment" required>
                  <a-select v-model:value="formData.overallRiskAssessment" placeholder="请选择总体风险评估" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in overallRiskAssessmentOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="采购建议" name="procurementAdvice" required>
                  <a-select v-model:value="formData.procurementAdvice" placeholder="请选择采购建议" :style="{ width: '49%' }" allowClear>
                    <a-select-option v-for="option in procurementAdviceOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="风险缓解措施" name="riskMitigationMeasures">
                  <a-textarea v-model:value="formData.riskMitigationMeasures" placeholder="请输入风险缓解措施" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="最终评价与备注" name="finalEvaluation">
                  <a-textarea v-model:value="formData.finalEvaluation" placeholder="请输入最终评价与备注" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
      <template #footer>
        <div class="modal-footer">
          <a-button type="primary" @click="saveForm">确定</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal
      v-model:visible="modalPriviewVisible"
      :title="modalTitle"
      :getContainer="customGetContainer"
      :width="1000"
      :mask-closable="false"
      :body-style="{ height: '700px', overflowY: 'auto', padding: '20px' }">
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" style="padding: 20px">
        <a-collapse class="custom-collapse" :defaultActiveKey="['1', '2', '3', '4', '5', '6']">
          <a-collapse-panel key="1" header="基础信息">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="物料名称/描述" name="materialName" required>
                  <a-input :disabled="true" v-model:value="formData.materialName" placeholder="请输入物料名称/描述" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="型号/规格" name="specifications" required>
                  <a-input :disabled="true" v-model:value="formData.specifications" placeholder="请输入型号/规格" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="所属产品/模块" name="model" required>
                  <a-input :disabled="true" v-model:value="formData.model" placeholder="请输入所属产品/模块" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="分析时间" name="analystDate" required>
                  <a-date-picker
                    :locale="locale"
                    :disabled="true"
                    v-model:value="formData.analystDate"
                    format="YYYY-MM-DD "
                    placeholder="请选择分析时间"
                    value-format="YYYY-MM-DD"
                    style="width: 100%" />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="分析负责人" name="analyst" required>
                  <a-input :disabled="true" v-model:value="formData.analyst" placeholder="请输入分析负责人" :style="{ width: '49%' }" allowClear />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="技术与质量">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="技术标准/认证要求" name="technicalStandard">
                  <a-input :disabled="true" v-model:value="formData.technicalStandard" placeholder="请输入技术标准/认证要求" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="性能参数符合度" name="performanceCompliance">
                  <a-radio-group v-model:value="formData.performanceCompliance" button-style="solid" :style="{ display: 'flex', gap: '10px' }">
                    <a-radio-button value="完全符合">完全符合</a-radio-button>
                    <a-radio-button value="部分符合">部分符合</a-radio-button>
                    <a-radio-button value="需改进">需改进</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="接口兼容性评估" name="interfaceCompatibilityAssessment">
                  <a-select :disabled="true" v-model:value="formData.interfaceCompatibilityAssessment" placeholder="请选择接口兼容性评估" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in interfaceCompatibilityOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="质量等级/失效率(PPM)" name="ppm">
                  <a-input :disabled="true" v-model:value="formData.ppm" placeholder="请输入质量等级/失效率" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="可靠性数据(MTBF)" name="mtbf">
                  <a-input :disabled="true" v-model:value="formData.mtbf" placeholder="请输入可靠性数据(MTBF)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="测试与验证要求" name="testRequirement">
                  <a-textarea :disabled="true" v-model:value="formData.testRequirement" placeholder="请输入测试与验证要求" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="成本与商务">
            <a-row style="display: flex; justify-content: space-between">
              <a-col :span="12" style="display: flex; justify-content: space-between">
                <a-form-item label="单价(元)" name="unitPrice" required>
                  <a-input :disabled="true" v-model:value="formData.unitPrice" placeholder="请输入单价(元)" allowClear />
                </a-form-item>
                <a-form-item style="margin-right: 10px" label="采购数量" name="purchaseQuantity">
                  <a-input :disabled="true" type="number" v-model:value="formData.purchaseQuantity" placeholder="请输入采购数量" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item style="margin-left: 8px" label="模具费/NRE(元)" name="toolFee">
                  <a-input :disabled="true" v-model:value="formData.toolFee" :style="{ width: '100%' }" placeholder="请输入模具费/NRE(元)" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="form-row" style="margin-top: 10px">
              <div class="form-col">
                <a-form-item label="物流成本(元)" name="logisticsCost">
                  <a-input :disabled="true" v-model:value="formData.logisticsCost" placeholder="请输入物流成本(元)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="付款条款" name="paymentTerms">
                  <a-input :disabled="true" v-model:value="formData.paymentTerms" placeholder="请输入付款条款" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="总拥有成本估算(元)" name="totalCostEstimation">
                  <a-input :disabled="true" v-model:value="formData.totalCostEstimation" placeholder="请输入总拥有成本估算(元)" :style="{ width: '49%' }" allowClear />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="供应商信息">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="供应商名称" name="supplierName" required>
                  <a-input :disabled="true" v-model:value="formData.supplierName" placeholder="请输入供应商名称" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="供应商所在地" name="supplierLocation">
                  <a-input :disabled="true" v-model:value="formData.supplierLocation" placeholder="请输入供应商所在地" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="供应商等级/资质" name="qualification">
                  <a-select :disabled="true" v-model:value="formData.qualification" placeholder="请选择供应商等级/资质" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in qualificationOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item :disabled="true" label="技术能力评估(1-10分)" name="technicalCapabilityAssess">
                  <a-input :disabled="true" v-model:value="formData.technicalCapabilityAssess" placeholder="请输入技术能力评估(1-10分)" :style="{ width: '100%' }" allowClear />
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item :disabled="true" label="交付能力评估" name="deliveryCapabilityAssess">
                  <a-radio-group v-model:value="formData.deliveryCapabilityAssess" button-style="solid" :style="{ display: 'flex', gap: '10px' }">
                    <a-radio-button value="优秀">优秀</a-radio-button>
                    <a-radio-button value="良好">良好</a-radio-button>
                    <a-radio-button value="一般">一般</a-radio-button>
                    <a-radio-button value="较差">较差</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="合作历史/业绩评价" name="cooperationHistory">
                  <a-textarea :disabled="true" v-model:value="formData.cooperationHistory" placeholder="请输入合作历史/业绩评价" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="5" header="供应链与风险">
            <a-row style="display: flex; justify-content: space-between">
              <a-col :span="12" style="display: flex; justify-content: space-between">
                <a-form-item label="采购周期(天)" name="procurementCycle">
                  <a-input :disabled="true" v-model:value="formData.procurementCycle" placeholder="请输入采购周期(天)" allowClear />
                </a-form-item>
                <a-form-item style="margin-right: 10px" label="最小起订量" name="mqq">
                  <a-input :disabled="true" v-model:value="formData.mqq" placeholder="请输入最小起订量" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item style="margin-left: 8px" label="替代供应商/部件" name="alternativeSuppliers">
                  <a-input :disabled="true" v-model:value="formData.alternativeSuppliers" :style="{ width: '100%' }" placeholder="请输入替代供应商/部件" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="form-row" style="margin-top: 10px">
              <div class="form-col">
                <a-form-item label="生命周期状态" name="lifecycleState">
                  <a-select :disabled="true" v-model:value="formData.lifecycleState" placeholder="请选择生命周期状态" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in lifecycleStateOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="库存策略建议" name="inventoryStrategySuggestions">
                  <a-select :disabled="true" v-model:value="formData.inventoryStrategySuggestions" placeholder="请选择库存策略建议" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in inventoryStrategyOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="单一来源风险" name="singleSourceRisk">
                  <a-select :disabled="true" v-model:value="formData.singleSourceRisk" placeholder="请选择单一来源风险" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in singleSourceRiskOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="地缘政治/贸易风险" name="geopolitics">
                  <a-textarea :disabled="true" v-model:value="formData.geopolitics" placeholder="请输入地缘政治/贸易风险" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="6" header="综合评估与决策">
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="部件分类" name="partType" required>
                  <a-select :disabled="true" v-model:value="formData.partType" placeholder="请选择部件分类" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in partTypeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="总体风险评估" name="overallRiskAssessment" required>
                  <a-select :disabled="true" v-model:value="formData.overallRiskAssessment" placeholder="请选择总体风险评估" :style="{ width: '100%' }" allowClear>
                    <a-select-option v-for="option in overallRiskAssessmentOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="采购建议" name="procurementAdvice" required>
                  <a-select :disabled="true" v-model:value="formData.procurementAdvice" placeholder="请选择采购建议" :style="{ width: '49%' }" allowClear>
                    <a-select-option v-for="option in procurementAdviceOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <a-form-item label="风险缓解措施" name="riskMitigationMeasures">
                  <a-textarea :disabled="true" v-model:value="formData.riskMitigationMeasures" placeholder="请输入风险缓解措施" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
              <div class="form-col">
                <a-form-item label="最终评价与备注" name="finalEvaluation">
                  <a-textarea :disabled="true" v-model:value="formData.finalEvaluation" placeholder="请输入最终评价与备注" :style="{ width: '100%', height: '80px' }" />
                </a-form-item>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
      <template #footer>
        <div class="modal-footer">
          <a-button @click="modalPriviewVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
  <MemberAuthModal
    modalWidth="60%"
    v-model:modalVisible="grpuVisible"
    :data-source="groupData"
    v-model:target-keys="targetKeys"
    :Singlechoice="true"
    @confirm="handleModalConfirm"
    @change="handleChange"
    @Cancel="handleClose" />
  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 只允许上传xls、xlsx格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.upload-btn-wrap {
  margin-left: 2px;
  margin-top: 10px;
  display: flex;
  .block {
    margin-top: 2px;
    width: 122px;
    margin-bottom: 20px;
    height: 100px;
    border-radius: 8px;
    // border: 1px solid #d3d2d9;
    cursor: pointer;
  }
  .upload-dec {
    margin-top: 13px;
    margin-left: 15px;
    font-weight: Regular;
    font-style: Source Sans 3-Regular;
    div {
      margin: 9px 0;
      color: #6a696e;
    }
    p {
      color: #a2a1a6;
      font-size: 12px;
    }
    .correlationBtn {
      margin-top: 5px;
    }
  }
}

//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 2px;
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
    }
  }
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

// 表单样式
.form-content {
  padding: 10px 0;

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-input-number) {
    width: 100%;
  }
}

@import '../../../../sheets/collapse.less';

// 弹窗底部按钮样式
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    margin-left: 8px;
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

.Wgbjfx {
  position: relative;
  z-index: 1000;
}

// 两列表单布局样式
.form-row {
  display: flex;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
}

.form-col {
  flex: 1;
  padding: 0 8px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &.full-width {
    flex: none;
    width: 100%;
    padding: 0;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
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
</style>
