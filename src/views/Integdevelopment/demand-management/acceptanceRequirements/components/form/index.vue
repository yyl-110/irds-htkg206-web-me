<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { AdminApiSystemacceptance } from '@/api/tags/demand/管理需求验收';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { ChangeTreeattribute, getSelectedNodeIds } from '@/utils/tree';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { getDistributionteamLabel } from '@/enums/Distributionteam';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { getStatusStyle } from '@/style/StatusStyle';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
import AnalyzeProductPackage from '@/views/Integdevelopment/demand-management/requirementsanalysis/components/form/demand-add-update.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
interface formData {
  id: number;
  demandTitle: string;
  demandRemarks: string;
  sceneDescription: string;
  demandValue: string;
  productGap: string;
  otherDescriptions: string;
  originaUserName: string;
  submitTime: string;
  demandNum: string;
  companyPosition: string;
  phone: string;
  feedbackTime: string;
  customerName: string;
  demandSource: undefined;
  regionalMarket: undefined;
  marketSegment: undefined;
  platform: undefined;
  series: undefined;
  model: string;
  firstTechnology: undefined;
  secondTechnology: undefined;
  urgencyLevel: string;
  demandClassify1?: string;
  demandClassify2?: string;
  demandClassify?: string;
  saveStatus: number;
  preAnalysisType?: string;
  preAnalysisTypelist?: string;
  preAnalysisConclusion?: string;
  preAnalysisOpinion?: string;
  preAnalysisUpdateData?: string;
}
// 表单数据
const formData = ref<formData>({
  id: 0,
  demandTitle: '',
  demandRemarks: '',
  sceneDescription: '',
  demandValue: '',
  productGap: '',
  otherDescriptions: '',
  originaUserName: '',
  submitTime: '',
  demandNum: '',
  companyPosition: '',
  phone: '',
  feedbackTime: '',
  customerName: '',
  demandSource: undefined,
  regionalMarket: undefined,
  marketSegment: undefined,
  platform: undefined,
  series: undefined,
  model: '',
  firstTechnology: undefined,
  secondTechnology: undefined,
  urgencyLevel: '中',
  demandClassify1: '',
  demandClassify2: '',
  saveStatus: 1,
  preAnalysisConclusion: '',
  preAnalysisType: '',
  preAnalysisOpinion: '',
  preAnalysisUpdateData: '',
});
const beginningformData = ref<formData>({
  id: 0,
  demandTitle: '',
  demandRemarks: '',
  sceneDescription: '',
  demandValue: '',
  productGap: '',
  otherDescriptions: '',
  originaUserName: '',
  submitTime: '',
  demandNum: '',
  companyPosition: '',
  phone: '',
  feedbackTime: '',
  customerName: '',
  demandSource: undefined,
  regionalMarket: undefined,
  marketSegment: undefined,
  platform: undefined,
  series: undefined,
  model: '',
  firstTechnology: undefined,
  secondTechnology: undefined,
  urgencyLevel: '中',
  demandClassify: '',
  saveStatus: 1,
  demandClassify1: '',
  demandClassify2: '',
  preAnalysisType: '',
  preAnalysisConclusion: '',
  preAnalysisOpinion: '',
  preAnalysisUpdateData: '',
});
const disabledDate = (current: any) => {
  // 禁用今天之前的日期（当前时间的前一天24点之前）
  return current && current < dayjs().startOf('day');
};
const emit = defineEmits(['onClose', 'RefreshtableData']);
const formRef = ref();
const formRef1 = ref();
const activeKey = ref<string>('1');
const collapseactiveKey = ref<string>('1');
const loading = ref<boolean>(false);
const originalloading = ref<boolean>(false);
const initialloading = ref<boolean>(false);
const remDecisionloadingloading = ref<boolean>(false);
const distributeloading = ref<boolean>(false);
const userStore = useUserStore();
const demandrow = ref<any>({});
const filevisible = ref<boolean>(false);
const implementProofFileList = ref<any>([]);
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '60px', marginTop: '50px' },
  }),
});
const datasource = ref<any[]>([]);
const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: WeiI18n.$t('需求编号'),
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
    width: 120,
  },
  {
    title: WeiI18n.$t('初始需求标题'),
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandTitle, b.demandTitle),
    width: 240,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('提出人'),
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('实现人'),
    dataIndex: 'taskUsernames',
    key: 'taskUsernames',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskUsernames, b.taskUsernames),
    width: 120,
  },

  {
    title: WeiI18n.$t('发起验收时间'),
    dataIndex: 'initiateAcceptTime',
    key: 'initiateAcceptTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiateAcceptTime, b.initiateAcceptTime),
    width: 200,
  },
  {
    title: WeiI18n.$t('需求实现周期'),
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
    width: 130,
  },
  {
    title: WeiI18n.$t('需求状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 150,
  },
  {
    title: WeiI18n.$t('验收结论'),
    dataIndex: 'acceptConclusion',
    key: 'acceptConclusion',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acceptConclusion, b.acceptConclusion),
    width: 200,
  },
  {
    title: WeiI18n.$t('原因说明'),
    dataIndex: 'acceptReasons',
    key: 'acceptReasons',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.acceptReasons, b.acceptReasons),
    width: 200,
  },
  {
    title: WeiI18n.$t('分发路径'),
    dataIndex: 'allocateType',
    key: 'allocateType',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateType, b.allocateType),
    width: 150,
  },
  {
    title: WeiI18n.$t('分发结果'),
    dataIndex: 'taskName',
    key: 'taskName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskName, b.taskName),
    width: 150,
  },
  {
    title: WeiI18n.$t('证明材料说明'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.remark, b.remark),
    width: 150,
  },
  {
    title: WeiI18n.$t('实现证明材料'),
    dataIndex: 'implementProofFileList',
    key: 'implementProofFileList',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 120,
    fixed: 'right',
  },
]);
function ClearForm() {
  nextTick(() => {
    formRef.value.resetFields();
  });
  formData.value = {
    id: 0,
    demandTitle: '',
    demandRemarks: '',
    sceneDescription: '',
    demandValue: '',
    productGap: '',
    otherDescriptions: '',
    originaUserName: '',
    submitTime: '',
    demandNum: '',
    companyPosition: '',
    phone: '',
    feedbackTime: '',
    customerName: '',
    demandSource: undefined,
    regionalMarket: undefined,
    marketSegment: undefined,
    platform: undefined,
    series: undefined,
    model: '',
    firstTechnology: undefined,
    secondTechnology: undefined,
    urgencyLevel: '中',
    demandClassify1: '',
    demandClassify2: '',
    saveStatus: 1,
    preAnalysisConclusion: '',
    preAnalysisType: '',
    preAnalysisOpinion: '',
    preAnalysisUpdateData: '',
  };
}
function ClearriginalForm() {
  nextTick(() => {
    formRef1.value.resetFields();
  });
  beginningformData.value = {
    id: 0,
    demandTitle: '',
    demandRemarks: '',
    sceneDescription: '',
    demandValue: '',
    productGap: '',
    otherDescriptions: '',
    originaUserName: '',
    submitTime: '',
    demandNum: '',
    companyPosition: '',
    phone: '',
    feedbackTime: '',
    customerName: '',
    demandSource: undefined,
    regionalMarket: undefined,
    marketSegment: undefined,
    platform: undefined,
    series: undefined,
    model: '',
    firstTechnology: undefined,
    secondTechnology: undefined,
    urgencyLevel: '中',
    demandClassify1: '',
    demandClassify2: '',
    saveStatus: 1,
  };
}
/** 富文本对象 */
const ckeditorRef = ref();
const ckeditorRef1 = ref();
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
const preAnalysisConclusionlist = ref<OptionrItem[]>([
  { label: '有效需求', value: '有效需求' },
  { label: '无效需求', value: '无效需求' },
]);
// 需求来源
const CustomerNamelist = ref<OptionrItem[]>([
  { label: '客户', value: '客户' },
  { label: '行业分析', value: '行业分析' },
  { label: '竞争对手', value: '竞争对手' },
  { label: '展览展会', value: '展览展会' },
  { label: '专业媒体', value: '专业媒体' },
  { label: '技术论坛', value: '技术论坛' },
  { label: '合作伙伴', value: '合作伙伴' },
  { label: '市场', value: '市场' },
  { label: '管理层', value: '管理层' },
  { label: '研发', value: '研发' },
  { label: '售后', value: '售后' },
  { label: '订单相关', value: '订单相关' },
]);
// 区域市场
const regionalMarketlist = ref<OptionrItem[]>([
  { label: '国内地铁市场', value: '国内地铁市场' },
  { label: '国内铁路市场', value: '国内铁路市场' },
  { label: '海外产品市场', value: '海外产品市场' },
]);
// 细分市场
const MarketSegmentlist = ref<OptionrItem[]>([]);
const preAnalysisTypelist = ref<OptionrItem[]>([]);
// 产品平台
const ProductPlatformData = ref<any>([]);
const ProductPlatformlist = ref<OptionrItem[]>([]);
/** 获取分类数据 */
async function getProductPlatform() {
  const res = await AdminApiSystemProduct.getProductTree(new ProductTreeInfoRequestDTOModel());
  if (res.data.code == 0 && res.data.data && res.data.data.length > 0) {
    ProductPlatformData.value = res.data.data[0].children;
    ProductPlatformlist.value =
      res.data.data[0].children.map((item: any) => ({
        label: item.name,
        value: `${item.id}`,
      })) || [];
  }
}
// 根据产品平台匹配当前平台下的系列
function PlatformChange(value: string | undefined) {
  ProductPlatformData.value.forEach((item: any) => {
    if (value == item.id && item.children.length > 0) {
      ProductSerieslist.value =
        item.children.map((item: any) => ({
          label: item.name,
          value: `${item.id}`,
        })) || [];
    }
  });
}
// 技术学科数据存储
const AtechnicaldisciplineData = ref<any>([]);
const Atechnicaldisciplinelist = ref<OptionrItem[]>([]);
// 请选择一级技术学科
const Twotechnicaldisciplineslist = ref<OptionrItem[]>([]);
const disciplineChangeList = ref<any>([]);
/** 获取技术学科 */
async function gettechnicaldisciplinesList() {
  const res = await AdminApiSystemTechnicaldisciplines.gettechnicaldisciplinesList({});
  if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
    AtechnicaldisciplineData.value = res.data.data;
    Atechnicaldisciplinelist.value =
      res.data.data.map((item: any) => ({
        label: item.categoryName,
        value: `${item.id}`,
      })) || [];
  }
}
async function disciplineblur() {
  // 合并children到新数组
  Twotechnicaldisciplineslist.value = [];
  // 遍历数组A，查找数组B中id匹配的对象
  disciplineChangeList.value.forEach((aItem: any) => {
    // 查找数组B中id相同的对象
    const matchedBItem = AtechnicaldisciplineData.value.find((bItem: any) => bItem.id === aItem);
    if (matchedBItem && Array.isArray(matchedBItem.children)) {
      // 若存在children且为数组，则合并到新数组
      Twotechnicaldisciplineslist.value.push(
        ...(matchedBItem.children.map((item: any) => ({
          label: item.categoryName,
          value: `${item.id}`,
        })) || []),
      );
    }
  });
}
async function getPreAnalysisConclusion(row: any) {
  const res = await AdminApiSystemDemandcollect.getPreAnalysisConclusion({
    basicId: row.basicId,
  });
  let data: any = res.data;
  if (data.code == 200 && data.data) {
    beginningformData.value.preAnalysisType = data.data.preAnalysisType;
    beginningformData.value.preAnalysisOpinion = data.data.preAnalysisOpinion;
    beginningformData.value.preAnalysisConclusion = data.data.preAnalysisConclusion;
    beginningformData.value.preAnalysisUpdateData = data.data.preAnalysisUpdateData;
  }
}
// 产品系列
const ProductSerieslist = ref<OptionrItem[]>([]);
const FormEcho = async (row: any) => {
  ClearForm();
  if (row) {
    try {
      const res = await AdminApiSystemDemand.getdemanddetail({
        id: row.originalId,
      });
      let data: any = res.data;
      if (data.code == 200) {
        formData.value = { ...data.data };
        nextTick(() => {
          if (ckeditorRef.value) {
            ckeditorRef.value.setData(formData.value.demandRemarks || '');
          }
        });
        let firstTechnology: any = formData.value.firstTechnology;
        let secondTechnology: any = formData.value.secondTechnology;
        formData.value.firstTechnology = firstTechnology ? firstTechnology.split(',') : [];
        formData.value.secondTechnology = secondTechnology ? secondTechnology.split(',') : [];
        // 根据平台回显系列列表
        PlatformChange(formData.value.platform);
        // 根据一级学科获取二级学科列表
        disciplineChangeList.value = formData.value.firstTechnology;
        disciplineblur();
        originalloading.value = false;
      }
    } catch (error) {
      console.log(error);
      originalloading.value = false;
    }
  } else {
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData('');
      }
    });
    formData.value.firstTechnology = undefined;
    formData.value.secondTechnology = undefined;
  }
};
const initialFormEcho = async (row: any) => {
  ClearriginalForm();
  if (row) {
    try {
      initialloading.value = true;
      const res = await AdminApiSystemDemandcollect.getInitDemandDetail({
        basicId: row.basicId,
      });
      let data: any = res.data;
      if (data.code == 200) {
        beginningformData.value = { ...data.data };
        nextTick(() => {
          if (ckeditorRef1.value) {
            ckeditorRef1.value.setData(beginningformData.value.demandRemarks || '');
          }
        });
        let firstTechnology: any = beginningformData.value.firstTechnology;
        let secondTechnology: any = beginningformData.value.secondTechnology;
        beginningformData.value.firstTechnology = firstTechnology ? firstTechnology.split(',') : [];
        beginningformData.value.secondTechnology = secondTechnology ? secondTechnology.split(',') : [];
        // 根据平台回显系列列表
        PlatformChange(beginningformData.value.platform);
        // 根据一级学科获取二级学科列表
        disciplineChangeList.value = beginningformData.value.firstTechnology;
        disciplineblur();
        initialloading.value = false;
      }
    } catch (e) {
      initialloading.value = false;
      console.log(e);
    }
  } else {
    nextTick(() => {
      if (ckeditorRef1.value) {
        ckeditorRef1.value.setData('');
      }
    });
    beginningformData.value.firstTechnology = undefined;
    beginningformData.value.secondTechnology = undefined;
    initialloading.value = false;
  }
};
function getFormEchodata() {
  originalloading.value = true;
  try {
    // 只有当第一个then返回了promise对象才会接着调用下一个的then方法
    Promise.resolve()
      .then(res => {
        return new Promise((resolve, reject) => {
          resolve(getProductPlatform());
        });
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          resolve(gettechnicaldisciplinesList());
        });
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          resolve(FormEcho(demandrow.value));
        });
      });
  } catch (error) {
    originalloading.value = false;
  }
}
/**
 * @description tab切换
 * @param key tab切换key
 */
function tabChange(key: string) {
  if (key === '2') {
    getFormEchodata();
  }
}
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const allCompleted = ref<boolean>(true);
async function handleModalacceptancec(row: any) {
  allCompleted.value = true;
  activeKey.value = '1';
  try {
    loading.value = true;
    demandrow.value = row;
    if (demandrow.value.status && demandrow.value.status == TaskStatus.COMPLETED) {
      allCompleted.value = false;
    }
    const res = await AdminApiSystemacceptance.getTaskList({
      basicId: row.basicId,
    });
    if (res.data.code == 200) {
      datasource.value = res.data.data || [];
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}
const onSubmitFormData = async (record: any, type: string) => {
  if (record.acceptConclusion == '未满足需求' && !record.acceptReasons) {
    message.error('请输入原因说明');
    return;
  }
  let data = {
    taskId: record.taskId,
    basicId: record.basicId,
    acceptConclusion: record.acceptConclusion,
    acceptReasons: record.acceptReasons,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    Saveandsubmitform(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该需求吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        Saveandsubmitform(data);
      },
    });
  }
};
async function Saveandsubmitform(data: any) {
  const res = await AdminApiSystemacceptance.saveTask(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    handleModalacceptancec(demandrow.value);
  }
}
function Morefiles(record: any) {
  console.log(record);
  filevisible.value = true;
  implementProofFileList.value = record.ipmtUpConclusionFileList || record.implementProofFileList;
}

const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.oldFileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.oldFileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf' || fileType.value == '.pptx') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
// collapse切换
async function collapsetabChange(key: any) {
  if (key == '1') {
    FormEcho(demandrow.value);
  } else if (key == '2') {
    await initialFormEcho(demandrow.value);
    getPreAnalysisConclusion(demandrow.value);
  } else if (key == '3') {
    remDecisionList();
  } else if (key == '4') {
    getdistributeData();
  } else if (key == '5') {
    getdistributeData();
  }
}
function handleClosePowModal() {
  powVisible.value = false;
}
function linkClick(url: string) {
  window.open(url);
}

function truncatedFileName(fileName: any) {
  if (!fileName) return '';
  if (fileName.length > 26) {
    return fileName.substring(0, 26) + '...';
  }
  return fileName;
}
function periodicAttributemedth(periodicAttribute: any) {
  let str = '';
  if (periodicAttribute == 1) {
    str = '小于1年';
  } else if (periodicAttribute == 2) {
    str = '1-3年';
  } else if (periodicAttribute == 3) {
    str = '大于3年';
  }
  return str;
}
// ----------------------------RAT分析------------------
const ProductPackage = ref<boolean>(false);
const DecisionAnalysisRef = ref<any>();
const Ratcolumns = [
  {
    title: '需求编号/排序维度',
    align: 'center',
    dataIndex: 'demandNum',
    key: 'demandNum',
    width: 160,
  },
  {
    title: '客户重要程度',
    dataIndex: 'importance',
    key: 'importance',
    align: 'center',
    width: 150,
  },
  {
    title: '销售项目规模',
    dataIndex: 'projectScale',
    key: 'projectScale',
    align: 'center',
    width: 150,
  },
  {
    title: '对市场格局与竞争的影响',
    dataIndex: 'marketImpact',
    key: 'marketImpact',
    align: 'center',
    width: 220,
  },
  {
    title: '需求的普遍适用性',
    dataIndex: 'universalApplicability',
    key: 'universalApplicability',
    align: 'center',
    width: 150,
  },
  {
    title: '开发工作量',
    dataIndex: 'workload',
    key: 'workload',
    align: 'center',
    width: 120,
  },
  {
    title: '实现难易程度',
    dataIndex: 'difficultyLevel',
    key: 'difficultyLevel',
    align: 'center',
    width: 120,
  },
  {
    title: '评分总和',
    dataIndex: 'sum',
    key: 'sum',
    align: 'center',
    width: 120,
  },
  {
    title: '分析结论',
    dataIndex: 'decisionConclusion',
    key: 'decisionConclusion',
    align: 'center',
    width: 150,
  },
  {
    title: '结论描述',
    dataIndex: 'decisionConclusionDescription',
    key: 'decisionConclusionDescription',
    align: 'center',
    width: 220,
  },
];
const dataSource = ref<any>([]);
const Ipmtcolumns = [
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'center',
    width: 150,
  },
  {
    title: '初始需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'center',
    width: 240,
  },
  {
    title: 'IPMT决策结论',
    dataIndex: 'ipmtUpConclusion',
    key: 'ipmtUpConclusion',
    align: 'center',
    width: 180,
  },
  {
    title: 'IPMT决策描述',
    dataIndex: 'ipmtUpRemarks',
    key: 'ipmtUpRemarks',
    align: 'center',
    width: 200,
  },
  {
    title: 'IPMT决策证明材料（如有）',
    dataIndex: 'ipmtUpConclusionFileList',
    key: 'ipmtUpConclusionFileList',
    align: 'center',
    width: 200,
  },
  {
    title: '分析结论',
    dataIndex: 'decisionConclusion',
    key: 'decisionConclusion',
    align: 'center',
    width: 180,
  },
  {
    title: '结论描述',
    dataIndex: 'decisionConclusionDescription',
    key: 'decisionConclusionDescription',
    align: 'center',
    width: 220,
  },
];
const IpmtdataSource = ref<any>([]);
async function remDecisionList() {
  try {
    remDecisionloadingloading.value = true;
    dataSource.value = [];
    IpmtdataSource.value = [];
    let basicIds = [demandrow.value.basicId];
    const res = await AdminApiSystemDemandanalyze.remDecisionList({ basicIds });
    if (res.data.code == 200) {
      let data: any = res.data.data;
      if (data.length > 0) {
        data.forEach((item: any) => {
          if (item.upFlag) {
            IpmtdataSource.value.push(item);
          } else {
            dataSource.value.push(item);
          }
        });
      }
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    remDecisionloadingloading.value = false;
  }
}
async function ViewinitialDetails() {
  ProductPackage.value = true;
  nextTick(() => {
    DecisionAnalysisRef.value.handleModalAddOrUpdate(demandrow.value, 'detail-IPMT');
  });
}
// -------------------------需求分发/需求实现-----------------------------
// 需求分发表格列
const distributedata = ref<any>([]);
const distributecolumns = [
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'center',
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
    width: 150,
  },
  {
    title: '初始需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'center',
    width: 240,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 120,
  },
  {
    title: WeiI18n.$t('细分市场'),
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.marketSegment, b.marketSegment),
    width: 160,
  },
  {
    title: WeiI18n.$t('提出人'),
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('分发路径'),
    dataIndex: 'allocateType',
    key: 'allocateType',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateType, b.allocateType),
    width: 150,
  },
  {
    title: WeiI18n.$t('分发结果'),
    dataIndex: 'taskName',
    key: 'taskName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskName, b.taskName),
    width: 150,
  },
  {
    title: WeiI18n.$t('实现人'),
    dataIndex: 'taskUsernames',
    key: 'taskUsernames',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskUsernames, b.taskUsernames),
    width: 120,
  },
];
// 需求实现表格列
const implementcolumns = [
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: center;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: '需求编号',
    dataIndex: 'demandNum',
    key: 'demandNum',
    align: 'center',
    sorter: (a: any, b: any) => sortermethod(a.demandNum, b.demandNum),
    width: 150,
  },
  {
    title: '初始需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    align: 'center',
    width: 240,
  },
  {
    title: WeiI18n.$t('需求来源'),
    dataIndex: 'demandSource',
    key: 'demandSource',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.demandSource, b.demandSource),
    width: 120,
  },
  {
    title: WeiI18n.$t('区域市场'),
    dataIndex: 'regionalMarket',
    key: 'regionalMarket',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.regionalMarket, b.regionalMarket),
    width: 120,
  },
  {
    title: WeiI18n.$t('细分市场'),
    dataIndex: 'marketSegment',
    key: 'marketSegment',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.marketSegment, b.marketSegment),
    width: 160,
  },
  {
    title: WeiI18n.$t('提出人'),
    dataIndex: 'originaUserName',
    key: 'originaUserName',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.originaUserName, b.originaUserName),
    width: 120,
  },
  {
    title: WeiI18n.$t('实现人'),
    dataIndex: 'taskUsernames',
    key: 'taskUsernames',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.taskUsernames, b.taskUsernames),
    width: 120,
  },
  {
    title: WeiI18n.$t('需求实现周期'),
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
    width: 130,
  },
  {
    title: WeiI18n.$t('分发时间'),
    dataIndex: 'allocateTime',
    key: 'allocateTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.allocateTime, b.allocateTime),
    width: 130,
  },

  {
    title: WeiI18n.$t('发起验收时间'),
    dataIndex: 'initiateAcceptTime',
    key: 'initiateAcceptTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiateAcceptTime, b.initiateAcceptTime),
    width: 130,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 100,
    fixed: 'right',
  },
];

async function getdistributeData() {
  try {
    distributeloading.value = true;

    const res = await AdminApiSystemacceptance.getTaskList({
      basicId: demandrow.value.basicId,
    });
    if (res.data.code == 200) {
      distributedata.value = res.data.data || [];
    }
  } catch (error) {
    console.log(error, 'error');
  } finally {
    distributeloading.value = false;
  }
}
const customRow = (record: any, index: number) => {
  return {
    onClick: () => {},
    style: {
      backgroundColor: record.upFlag ? '#fff8e6' : 'transparent',
    },
  };
};
async function MaterialPreview(row: any) {
  try {
    loading.value = true;
    implementProofFileList.value = [];
    demandrow.value = row;
    const res = await AdminApiSystemplementation.getUploadProof({
      taskId: row.taskId,
    });
    if (res.data.code == 200) {
      filevisible.value = true;
      implementProofFileList.value = res.data.data?.fileList || [];
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}
function closeDemand() {
  let flag = false;
  let arr: any = [];
  if (datasource.value.length > 0) {
    datasource.value.forEach(item => {
      if (item.status !== TaskStatus.COMPLETED) {
        flag = true;
        arr.push(item.demandNum);
      }
    });
    if (flag) {
      Modal.confirm({
        title: `有未完成/未验收条目是否完成并关闭需求,需求编号为：${arr.join(',')},  如果点击确认，程序完成并关闭需求`,
        okText: WeiI18n.t('确定').value,
        cancelText: WeiI18n.t('取消').value,
        async onOk() {
          Promise.resolve()
            .then(res => {
              return new Promise((resolve, reject) => {
                resolve(ChangeRequestStatus());
              });
            })
            .then(() => {
              return new Promise((resolve, reject) => {
                resolve(CloseRefreshList());
              });
            });
        },
      });
    } else {
      ChangeRequestStatus();
      emit('onClose', false);
    }
  }
}
function CloseRefreshList() {
  emit('RefreshtableData');
  emit('onClose', false);
}
async function ChangeRequestStatus() {
  const res = await AdminApiSystemDemandanalyze.updateStatus({
    basicId: demandrow.value.basicId,
    status: TaskStatus.COMPLETED,
  });
  if (res.data.code == 200) {
    // message.success('操作成功');
  }
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.acceptancec');
}
const tabBarStyle = {
  position: 'sticky', // 关键属性：粘滞定位
  top: 0, // 粘住容器顶部
  zIndex: 10, // 避免被内容遮挡
  background: '#fff', // 背景色覆盖下方内容
  width: '100%',
};
defineExpose({ handleModalacceptancec });
</script>
<template>
  <div class="acceptancec" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      style="width: 90%"
      v-model:visible="visible"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'需求验收'"
      @cancel="cancel">
      <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="需求验收">
          <a-spin :spinning="loading" tip="加载中...">
            <a-steps>
              <a-step status="finish" title="需求收集">
                <template #icon>
                  <EpcIcon type="icon-xuqiushouji" />
                </template>
              </a-step>
              <a-step status="finish" title="需求分析">
                <template #icon>
                  <EpcIcon type="icon-edit" />
                </template>
              </a-step>
              <a-step status="finish" title="需求分发">
                <template #icon>
                  <EpcIcon type="icon-xuqiufenfa" />
                </template>
              </a-step>
              <a-step status="finish" title="需求实现">
                <template #icon>
                  <EpcIcon type="icon-xuqiushixian" />
                </template>
              </a-step>
              <a-step status="finish" title="需求验收">
                <template #icon>
                  <EpcIcon type="icon-icon-xuqiu-yanshouguanli" />
                </template>
                <template #description>
                  <div class="moving-div">
                    <EpcIcon type="icon-gaotie" style="font-size: 60px; color: red" />
                  </div>
                </template>
              </a-step>
              <a-step status="wait" title="需求关闭">
                <template #icon>
                  <EpcIcon type="icon-xuqiuguanbi" />
                </template>
                <template #description>
                  <div class="jump-box">
                    <EpcIcon type="icon-hongqi-svg" style="font-size: 30px; color: red" />
                  </div>
                </template>
              </a-step>
            </a-steps>
            <div class="high-speed-track">
              <!-- 道床（轨道基础，灰色碎石层） -->
              <div class="track-bed"></div>
              <!-- 铁轨主体（双轨+轨枕） -->
              <div class="track-rail"></div>
            </div>
            <div style="margin-top: 10px">
              <a-table
                :scroll="{ x: 1200, y: 326 }"
                row-key="basicId"
                :columns="columns"
                :data-source="datasource"
                :locale="locale"
                :pagination="false"
                @resizeColumn="handleResizeColumn"
                :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'status'">
                    <span :style="getStatusStyle(record.status)">{{ getTaskStatusLabel(record.status) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'remark'">
                    <a-tooltip placement="top">
                      <template #title>{{ record.remark }}</template>
                      <div class="textclass">{{ record.remark }}</div>
                    </a-tooltip>
                  </template>
                  <template v-if="column.dataIndex === 'periodicAttribute'">
                    <span>{{ periodicAttributemedth(record.periodicAttribute) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'acceptConclusion'">
                    <a-select style="width: 180px" v-model:value="record.acceptConclusion">
                      <a-select-option value="满足原始需求">满足原始需求</a-select-option>
                      <a-select-option value="未满足需求">未满足需求，退实施团队改进</a-select-option>
                    </a-select>
                  </template>
                  <template v-if="column.dataIndex === 'acceptReasons'">
                    <a-textarea rows="1" v-model:value="record.acceptReasons" />
                  </template>
                  <template v-if="column.dataIndex === 'allocateType'">
                    <span style="color: #4caf50">{{ getDistributionteamLabel(record.allocateType) }}</span>
                  </template>
                  <template v-if="column.dataIndex === 'implementProofFileList'">
                    <a v-if="record.implementProofFileList && record.implementProofFileList.length > 0" @click.stop="Morefiles(record)">查看文件列表</a>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <a-button shape="circle" :disabled="record.status != TaskStatus.ACCEPTANCE_PENDING" @click="onSubmitFormData(record, 'save')" type="link">保存</a-button>
                    <a-divider type="vertical" />
                    <a-button shape="circle" :disabled="record.status != TaskStatus.ACCEPTANCE_PENDING" type="link" @click="onSubmitFormData(record, 'submit')">提交</a-button>
                  </template>
                </template>
              </a-table>
            </div>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="2" tab="需求履历（只读）">
          <a-collapse class="custom-collapse form-container" @change="collapsetabChange" accordion v-model:activeKey="collapseactiveKey" :bordered="false">
            <a-collapse-panel key="1" header="需求收集">
              <div class="pagecontent-title">
                <i></i>
                <span style="font-size: 13px">原始需求</span>
              </div>
              <a-form ref="formRef" layout="vertical" :model="formData" :label-col="labelCol">
                <a-spin :spinning="originalloading" tip="加载中...">
                  <div style="display: flex">
                    <!-- 左侧表单区域 -->
                    <div style="width: 60%">
                      <a-form-item label="需求标题" name="demandTitle">
                        <a-textarea
                          disabled
                          class="textarea"
                          allow-clear
                          v-model:value="formData.demandTitle"
                          :rows="2"
                          show-count
                          maxlength="30"
                          placeholder="请输入需求标题（不超过30字）" />
                        <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                      </a-form-item>
                      <a-form-item label="原始需求描述" name="demandRemarks">
                        <CkeditorPlugin :disabled="true" ref="ckeditorRef" height="200" />
                      </a-form-item>
                      <a-form-item label="应用场景描述">
                        <a-textarea disabled v-model:value="formData.sceneDescription" :rows="4" placeholder="客户应用场景、工况、约束条件等描述" />
                      </a-form-item>
                      <a-form-item label="原始需求价值">
                        <a-textarea disabled v-model:value="formData.demandValue" :rows="4" placeholder="需求实现后对客户及公司的价值（包含广泛性）" />
                      </a-form-item>
                      <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                        <a-textarea disabled v-model:value="formData.productGap" :rows="4" placeholder="1、我司当前产品上存在的差距；2、客户是否有期望的解决方案（包含广泛性）" />
                      </a-form-item>
                      <a-form-item label="其他竞品/其他解决方案的描述">
                        <a-textarea disabled v-model:value="formData.otherDescriptions" :rows="4" placeholder="市面上其他竞品及其解决方案描述" />
                      </a-form-item>
                    </div>
                    <!-- 右侧表单区域 -->
                    <div style="width: 30%; margin-left: 5%">
                      <!-- <a-form-item label="提报信息："> -->
                      <a-row style="display: flex; justify-content: space-between">
                        <a-col :span="11">
                          <a-form-item label="提报人：">
                            <a-input v-model:value="formData.originaUserName" disabled />
                          </a-form-item>
                        </a-col>
                        <a-col :span="11">
                          <a-form-item label="提报时间：">
                            <a-date-picker
                              disabled
                              :locale="locale"
                              v-model:value="formData.submitTime"
                              format="YYYY-MM-DD "
                              value-format="YYYY-MM-DD"
                              style="width: 100%; text-align: left"
                              :placeholder="'提报时间'" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <!-- </a-form-item> -->
                      <a-form-item label="原始需求编号" v-if="formData.demandNum">
                        <a-input v-model:value="formData.demandNum" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人单位及职务">
                        <a-textarea v-model:value="formData.companyPosition" :rows="1" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人联系方式" name="phone">
                        <a-input disabled v-model:value="formData.phone" :placeholder="'请输入提交人联系方式'" />
                      </a-form-item>
                      <a-form-item label="期望反馈时间" name="feedbackTime">
                        <a-date-picker
                          disabled
                          :locale="locale"
                          :disabled-date="disabledDate"
                          v-model:value="formData.feedbackTime"
                          format="YYYY-MM-DD "
                          value-format="YYYY-MM-DD"
                          style="width: 100%; text-align: left"
                          :placeholder="'期望反馈时间'" />
                      </a-form-item>
                      <a-form-item label="客户名称（需求方）">
                        <a-input disabled v-model:value="formData.customerName" :placeholder="'请输入客户名称'" />
                      </a-form-item>
                      <a-form-item label="需求来源" name="demandSource">
                        <a-select disabled v-model:value="formData.demandSource" placeholder="请选择需求来源">
                          <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="区域市场" name="regionalMarket">
                        <a-select disabled v-model:value="formData.regionalMarket" placeholder="请选择区域市场">
                          <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="细分市场">
                        <a-select disabled v-model:value="formData.marketSegment" placeholder="请选择细分市场">
                          <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品平台">
                        <a-select disabled v-model:value="formData.platform" placeholder="请选择产品平台">
                          <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品系列">
                        <a-select disabled v-model:value="formData.series" placeholder="请选择产品系列">
                          <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="型号">
                        <a-input disabled v-model:value="formData.model" placeholder="请输入型号" />
                      </a-form-item>
                      <a-form-item label="一级技术学科">
                        <a-select disabled v-model:value="formData.firstTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择一级技术学科">
                          <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="二级技术学科">
                        <a-select disabled v-model:value="formData.secondTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择二级技术学科">
                          <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="紧急程度" name="urgencyLevel">
                        <a-select disabled v-model:value="formData.urgencyLevel" placeholder="请选择紧急程度">
                          <a-select-option key="低" value="低">
                            <span style="background-color: #4caf50; color: aliceblue; border-radius: 3px; padding: 2px 6px">低</span>
                          </a-select-option>
                          <a-select-option key="中" value="中">
                            <span style="background-color: #ffc107; color: aliceblue; border-radius: 3px; padding: 2px 6px">中</span>
                          </a-select-option>
                          <a-select-option key="高" value="高">
                            <span style="background-color: #f44336; color: aliceblue; border-radius: 3px; padding: 2px 6px">高</span>
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                  </div>
                </a-spin>
              </a-form>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="RME分析">
              <div class="pagecontent-title">
                <i></i>
                <span style="font-size: 13px">初始需求</span>
              </div>
              <a-form ref="formRef1" layout="vertical" :model="beginningformData" :label-col="labelCol">
                <a-spin :spinning="initialloading" tip="加载中...">
                  <div style="display: flex">
                    <!-- 左侧表单区域 -->
                    <div style="width: 60%">
                      <a-form-item label="需求标题" name="demandTitle">
                        <a-textarea disabled class="textarea" v-model:value="beginningformData.demandTitle" :rows="2" maxlength="30" placeholder="请输入需求标题（不超过30字）" />
                        <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                      </a-form-item>
                      <a-form-item label="原始需求描述" name="demandRemarks">
                        <CkeditorPlugin :disabled="true" ref="ckeditorRef1" height="200" />
                      </a-form-item>
                      <a-form-item label="应用场景描述">
                        <a-textarea disabled v-model:value="beginningformData.sceneDescription" :rows="4" placeholder="客户应用场景、工况、约束条件等描述" />
                      </a-form-item>
                      <a-form-item label="原始需求价值">
                        <a-textarea disabled v-model:value="beginningformData.demandValue" :rows="4" placeholder="需求实现后对客户及公司的价值（包含广泛性）" />
                      </a-form-item>
                      <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                        <a-textarea
                          disabled
                          v-model:value="beginningformData.productGap"
                          :rows="4"
                          placeholder="1、我司当前产品上存在的差距；2、客户是否有期望的解决方案（包含广泛性）" />
                      </a-form-item>
                      <a-form-item label="其他竞品/其他解决方案的描述">
                        <a-textarea disabled v-model:value="beginningformData.otherDescriptions" :rows="4" placeholder="市面上其他竞品及其解决方案描述" />
                      </a-form-item>
                      <a-form-item label="预分析：">
                        <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                          <a-col :span="11">
                            <div style="display: flex; justify-content: space-between">
                              <a-form-item style="width: 48%" label="结论：" name="preAnalysisConclusion">
                                <a-select disabled v-model:value="beginningformData.preAnalysisConclusion">
                                  <a-select-option v-for="item in preAnalysisConclusionlist" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item style="width: 48%" label="下步处理方式：" name="preAnalysisType">
                                <a-select disabled v-model:value="beginningformData.preAnalysisType">
                                  <a-select-option v-for="item in preAnalysisTypelist" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                            </div>
                            <a-form-item label="修改内容记录">
                              <a-textarea disabled v-model:value="beginningformData.preAnalysisUpdateData" :rows="3" />
                            </a-form-item>
                          </a-col>
                          <a-col :span="11">
                            <a-form-item label="意见：" name="preAnalysisOpinion">
                              <a-textarea disabled v-model:value="beginningformData.preAnalysisOpinion" :rows="7" />
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </a-form-item>
                    </div>
                    <!-- 右侧表单区域 -->
                    <div style="width: 30%; margin-left: 5%">
                      <!-- <a-form-item label="提报信息："> -->
                      <a-row style="display: flex; justify-content: space-between">
                        <a-col :span="11">
                          <a-form-item label="提报人：">
                            <a-input v-model:value="beginningformData.originaUserName" disabled />
                          </a-form-item>
                        </a-col>
                        <a-col :span="11">
                          <a-form-item label="提报时间：">
                            <a-date-picker
                              disabled
                              :locale="locale"
                              v-model:value="beginningformData.submitTime"
                              format="YYYY-MM-DD "
                              value-format="YYYY-MM-DD"
                              style="width: 100%; text-align: left"
                              :placeholder="'提报时间'" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <!-- </a-form-item> -->
                      <a-form-item label="原始需求编号" v-if="beginningformData.demandNum">
                        <a-input v-model:value="beginningformData.demandNum" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人单位及职务">
                        <a-textarea v-model:value="beginningformData.companyPosition" :rows="1" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人联系方式" name="phone">
                        <a-input disabled v-model:value="beginningformData.phone" :placeholder="'请输入提交人联系方式'" />
                      </a-form-item>
                      <a-form-item label="期望反馈时间" name="feedbackTime">
                        <a-date-picker
                          disabled
                          :locale="locale"
                          :disabled-date="disabledDate"
                          v-model:value="beginningformData.feedbackTime"
                          format="YYYY-MM-DD "
                          value-format="YYYY-MM-DD"
                          style="width: 100%; text-align: left"
                          :placeholder="'期望反馈时间'" />
                      </a-form-item>
                      <a-form-item label="客户名称（需求方）">
                        <a-input disabled v-model:value="beginningformData.customerName" :placeholder="'请输入客户名称'" />
                      </a-form-item>
                      <a-form-item label="需求来源" name="demandSource">
                        <a-select disabled v-model:value="beginningformData.demandSource" placeholder="请选择需求来源">
                          <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="区域市场" name="regionalMarket">
                        <a-select disabled v-model:value="beginningformData.regionalMarket" placeholder="请选择区域市场">
                          <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="细分市场">
                        <a-select disabled v-model:value="beginningformData.marketSegment" placeholder="请选择细分市场">
                          <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品平台">
                        <a-select disabled v-model:value="beginningformData.platform" placeholder="请选择产品平台">
                          <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品系列">
                        <a-select disabled v-model:value="beginningformData.series" placeholder="请选择产品系列">
                          <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="型号">
                        <a-input disabled v-model:value="beginningformData.model" placeholder="请输入型号" />
                      </a-form-item>
                      <a-form-item label="一级技术学科">
                        <a-select disabled v-model:value="beginningformData.firstTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择一级技术学科">
                          <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="二级技术学科">
                        <a-select disabled v-model:value="beginningformData.secondTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择二级技术学科">
                          <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="紧急程度" name="urgencyLevel">
                        <a-select disabled v-model:value="beginningformData.urgencyLevel" placeholder="请选择紧急程度">
                          <a-select-option key="低" value="低">
                            <span style="background-color: #4caf50; color: aliceblue; border-radius: 3px; padding: 2px 6px">低</span>
                          </a-select-option>
                          <a-select-option key="中" value="中">
                            <span style="background-color: #ffc107; color: aliceblue; border-radius: 3px; padding: 2px 6px">中</span>
                          </a-select-option>
                          <a-select-option key="高" value="高">
                            <span style="background-color: #f44336; color: aliceblue; border-radius: 3px; padding: 2px 6px">高</span>
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="需求分类：" name="demandClassify2">
                        <a-input disabled v-model:value="beginningformData.demandClassify2" />
                      </a-form-item>
                    </div>
                  </div>
                </a-spin>
              </a-form>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="RAT分析">
              <a-spin :spinning="remDecisionloadingloading" tip="加载中...">
                <div class="ipmt-decision-container">
                  <div class="pagecontent-title">
                    <i></i>
                    <span style="font-size: 13px">RAT结论</span>
                  </div>
                  <a-table
                    style="padding: 0 5px 0 5px"
                    row-key="id"
                    :scroll="{ x: 1800 }"
                    :pagination="false"
                    :locale="locale"
                    :columns="Ratcolumns"
                    :data-source="dataSource"
                    :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'demandNum'">
                        <a @click.stop="ViewinitialDetails">{{ record.demandNum }}</a>
                      </template>
                    </template>
                  </a-table>
                  <div class="pagecontent-title">
                    <i></i>
                    <span style="font-size: 13px">IPMT决策结论</span>
                  </div>
                  <a-table
                    style="padding: 0 5px 0 5px"
                    row-key="id"
                    :pagination="false"
                    :columns="Ipmtcolumns"
                    :locale="locale"
                    :data-source="IpmtdataSource"
                    :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'demandNum'">
                        <a @click.stop="ViewinitialDetails">{{ record.demandNum }}</a>
                      </template>
                      <template v-if="column.dataIndex === 'ipmtUpConclusionFileList'">
                        <a v-if="record.ipmtUpConclusionFileList.length > 0" @click.stop="Morefiles(record)">查看文件列表</a>
                      </template>
                    </template>
                  </a-table>
                </div>
              </a-spin>
            </a-collapse-panel>
            <a-collapse-panel key="4" header="需求分发">
              <a-spin :spinning="distributeloading" tip="加载中...">
                <div class="pagecontent-title">
                  <i></i>
                  <span style="font-size: 13px">需求分发结果</span>
                  <a-tooltip>
                    <template #title>{{ '注: 表格高亮行的需求为IPMT决策的需求通过!' }}</template>
                    <EpcIcon type="icon-xiangqing" style="font-size: 18px; margin-left: 10px; color: #165dff" />
                  </a-tooltip>
                </div>
                <a-table
                  style="padding: 0 5px 0 5px"
                  row-key="id"
                  :locale="locale"
                  :scroll="{ x: 1800 }"
                  :pagination="false"
                  :columns="distributecolumns"
                  :data-source="distributedata"
                  :customRow="customRow"
                  :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'allocateType'">
                      <span style="color: #4caf50">{{ getDistributionteamLabel(record.allocateType) }}</span>
                    </template>
                  </template>
                </a-table>
              </a-spin>
            </a-collapse-panel>
            <a-collapse-panel key="5" header="需求实现">
              <a-spin :spinning="distributeloading" tip="加载中...">
                <div class="pagecontent-title">
                  <i></i>
                  <span style="font-size: 13px">需求证明材料</span>
                  <a-tooltip>
                    <template #title>{{ '注: 表格高亮行的需求为IPMT决策的需求通过!' }}</template>
                    <EpcIcon type="icon-xiangqing" style="font-size: 18px; margin-left: 10px; color: #165dff" />
                  </a-tooltip>
                </div>
                <a-table
                  style="padding: 0 5px 0 5px"
                  row-key="id"
                  :locale="locale"
                  :scroll="{ x: 1800 }"
                  :pagination="false"
                  :columns="implementcolumns"
                  :data-source="distributedata"
                  :customRow="customRow"
                  :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'periodicAttribute'">
                      <span>{{ periodicAttributemedth(record.periodicAttribute) }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                      <a-button shape="circle" @click="MaterialPreview(record)" type="link">证明材料预览</a-button>
                    </template>
                  </template>
                </a-table>
              </a-spin>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
      <template #footer>
        <a-button type="primary" v-if="allCompleted" @click="closeDemand">
          <EpcIcon type="icon-xuqiuguanbi" style="font-size: 15px" />
          关闭需求</a-button
        >
        <a-button v-else @click="emit('onClose', false)" type="primary">
          <EpcIcon type="icon-quxiao" style="font-size: 15px" />
          取消</a-button
        >
      </template>
    </a-modal>
  </div>
  <!-- 实现证明材料 -->
  <a-modal v-model:visible="filevisible" style="width: 90%" title="文件列表" :ok-text="false" :confirm-loading="$isPending()" :mask-closable="false" @cancel="filevisible = false">
    <div class="pagecontent-title">
      <i></i>
      <span>实现证明材料</span>
    </div>
    <div style="height: calc(100vh - 600px)">
      <div class="upload-file-wrap" style="margin-left: 0px" v-if="implementProofFileList.length > 0">
        <div v-for="(item, index) in implementProofFileList" :key="index">
          <div class="file-list" v-if="item.filePath">
            <a-tooltip>
              <template #title>点击预览</template>
              <EpcIcon
                @click="priview(item)"
                type="icon-document-checked"
                style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
            </a-tooltip>
            <div class="file-dec">
              <div class="tit">{{ truncatedFileName(item.oldFileName) }}</div>
              <div class="number">
                <span>文件类型：{{ item.oldFileName ? item.oldFileName.split('.').pop() : '' }}</span>
                <div class="hover-link" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
              </div>
              <a-button class="elbuttonAn" @click="priview(item)">
                <EpcIcon type="icon-liulan" style="font-size: 15px" />
              </a-button>
              <a-button class="elbutton" v-if="item.fileId" disabled>
                <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="margin-left: 10px">暂无实现证明材料</div>
    </div>
    <template #footer>
      <a-button @click="filevisible = false" type="primary">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <AnalyzeProductPackage ref="DecisionAnalysisRef" :modalVisible="ProductPackage" @onClose="ProductPackage = false"></AnalyzeProductPackage>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style scoped lang="less">
@import '../../../../../../assets/css/designFlow/designFlow.less';
@import '../../.././../../../sheets/collapse.less';
.textclass {
  width: 150px !important;
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
.form-container {
  height: calc(100vh - 360px);
  overflow: auto;
}
.moving-div {
  width: 50px;
  height: 50px;
  margin-top: -15px;
  animation: moveForward 3s linear infinite; /* 动画名称、时长、速度曲线、循环 */
}

/* 定义动画关键帧 */
@keyframes moveForward {
  0% {
    transform: translateX(0); /* 起始位置（X=0） */
  }
  100% {
    transform: translateX(100px); /* 结束位置（向右移动300px） */
  }
}
.jump-box {
  width: 20px;
  margin-left: 30px;
  text-align: center;
  color: white;
  border-radius: 4px;
  /* 核心动画属性 */
  animation: jump 2s ease 0.5s infinite alternate forwards running;
}

/* 定义向上跳动的关键帧 */
@keyframes jump {
  0% {
    transform: translateY(0); /* 起始位置（不偏移） */
  }
  50% {
    transform: translateY(-5px); /* 向上跳动20px（最高点） */
  }
  100% {
    transform: translateY(0); /* 落回原位置 */
  }
}
.high-speed-track {
  width: 100%; /* 轨道长度（支持响应式） */
  height: 30px; /* 总高度（道床+铁轨） */
  position: relative;
  margin-top: -5px;
  padding: 0 5px; /* 道床两侧留白 */
}

/* 道床：灰色碎石基础，底部有阴影增强厚度 */
.track-bed {
  width: 100%;
  height: 12px; /* 道床高度（占总高度的 40%） */
  background: repeating-linear-gradient(to right, #355aab 0, #666 2px, #888 2px, #888 4px); /* 碎石纹理（灰色渐变条纹） */
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2) inset; /* 内阴影模拟凹陷 */
  position: absolute;
  bottom: 0;
}

/* 铁轨+轨枕：精密间距，金属质感 */
.track-rail {
  width: calc(100%); /* 铁轨宽度（比道床窄，避免溢出） */
  height: 16px; /* 铁轨高度（含轨枕） */
  position: absolute;
  top: 2px;
  left: 5px;
  background:
    /* 铁轨主体（双轨，内侧浅色反光） */
    // linear-gradient(90deg, #444 0%, #555 30%, #666 50%, #555 70%, #444 100%),
    linear-gradient(90deg, #a1b1d2 0%, #6188d6 30%, #5483e0 50%, #3d6fd3 70%, #3471e9 100%),
    /* 轨枕：高密度混凝土枕，等距排列 */
      repeating-linear-gradient(
        to right,
        #aaa,
        /* 轨枕颜色（浅灰，比铁轨亮） */ #aaa 15px,
        /* 轨枕宽度（高铁轨枕更宽） */ transparent 15px,
        transparent 50px /* 轨枕间距（15px 枕木 + 35px 间隙，比普通轨道密集） */
      );
  background-size:
    100% 100%,
    /* 铁轨占满高度 */ 100% 10px; /* 轨枕高度（略低于铁轨） */
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 2px;
  box-shadow: 0 1px 0 #333; /* 铁轨底部阴影，增强分层 */
}
/* 轨枕滚动动画（模拟高铁移动时的地面视角） */
@keyframes railScroll {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -50px;
  } /* 轨枕间距的整数倍（50px） */
}
/* 道床轻微模糊，增强远景感 */
.track-bed {
  filter: blur(0.3px);
}
</style>
