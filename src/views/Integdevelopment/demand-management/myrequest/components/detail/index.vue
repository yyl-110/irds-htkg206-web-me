<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { EpcIcon } from '@/components/icon/EpcIcon';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemacceptance } from '@/api/tags/demand/管理需求验收';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { getDistributionteamLabel } from '@/enums/Distributionteam';
import { getStatusStyle } from '@/style/StatusStyle';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  editStage: [type: string];
  uploadsuccess: [fileList: any];
  onFileremove: [fileList: any];
  uploadOk: any;
}>();
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
  demandClassify?: string;
  saveStatus: number;
  preAnalysisType?: string;
  preAnalysisConclusion?: string;
  preAnalysisOpinion?: string;
  preAnalysisUpdateData?: string;
  demandClassify1?: string;
  demandClassify2?: string;
}
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const initialloading = ref<boolean>(false);
const loading = ref<boolean>(false);
const distributeloading = ref<boolean>(false);
const formRef = ref();
const activeKey = ref<string>('1');
/** 富文本对象 */
const ckeditorRef = ref();
const ckeditorRef1 = ref();
const visibletitle = ref<string>('需求详情');
const demandrow = ref<any>({});
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
// 产品平台
const ProductPlatformData = ref<any>([]);
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
  saveStatus: 1,
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
// 细分市场
const MarketSegmentlist = ref<OptionrItem[]>([]);
// 产品平台
const ProductPlatformlist = ref<OptionrItem[]>([]);
// 产品系列
const ProductSerieslist = ref<OptionrItem[]>([]);
// 请选择一级技术学科
const Atechnicaldisciplinelist = ref<OptionrItem[]>([]);
// 请选择一级技术学科
const Twotechnicaldisciplineslist = ref<OptionrItem[]>([]);
// 紧急程度
const UrgencyLevellist = ref<OptionrItem[]>([
  { label: '低', value: '低' },
  { label: '中', value: '中' },
  { label: '高', value: '高' },
]);
function RegionChange(value: string) {
  if (value == '国内地铁市场') {
    MarketSegmentlist.value = [
      { label: '东北区域', value: '东北区域' },
      { label: '华北区域', value: '华北区域' },
      { label: '华中区域', value: '华中区域' },
      { label: '华东区域', value: '华东区域' },
      { label: '华南区域', value: '华南区域' },
      { label: '西南区域', value: '西南区域' },
      { label: '西北区域', value: '西北区域' },
    ];
  } else if (value == '国内铁路市场') {
    MarketSegmentlist.value = [
      {
        label: '中国铁路哈尔滨局集团有限公司',
        value: '中国铁路哈尔滨局集团有限公司',
      },
      {
        label: '中国铁路沈阳局集团有限公司',
        value: '中国铁路沈阳局集团有限公司',
      },
      {
        label: '中国铁路北京局集团有限公司',
        value: '中国铁路北京局集团有限公司',
      },
      {
        label: '中国铁路太原局集团有限公司',
        value: '中国铁路太原局集团有限公司',
      },
      {
        label: '中国铁路呼和浩特局集团有限公司',
        value: '中国铁路呼和浩特局集团有限公司',
      },
      {
        label: '中国铁路济南局集团有限公司',
        value: '中国铁路济南局集团有限公司',
      },
      {
        label: '中国铁路上海局集团有限公司',
        value: '中国铁路上海局集团有限公司',
      },
      {
        label: '中国铁路郑州局集团有限公司',
        value: '中国铁路郑州局集团有限公司',
      },
      {
        label: '中国铁路武汉局集团有限公司',
        value: '中国铁路武汉局集团有限公司',
      },
      {
        label: '中国铁路西安局集团有限公司',
        value: '中国铁路西安局集团有限公司',
      },
      {
        label: '中国铁路兰州局集团有限公司',
        value: '中国铁路兰州局集团有限公司',
      },
      {
        label: '中国铁路乌鲁木齐局集团有限公司',
        value: '中国铁路乌鲁木齐局集团有限公司',
      },
      { label: '中国铁路青藏集团有限公司', value: '中国铁路青藏集团有限公司' },
      {
        label: '中国铁路广州局集团有限公司',
        value: '中国铁路广州局集团有限公司',
      },
      {
        label: '中国铁路成都局集团有限公司',
        value: '中国铁路成都局集团有限公司',
      },
    ];
  } else {
    MarketSegmentlist.value = [
      { label: '北美区域', value: '北美区域' },
      { label: '拉美区域', value: '拉美区域' },
      { label: '亚太区域', value: '亚太区域' },
      { label: '中东及非洲区域', value: '中东及非洲区域' },
      { label: '欧洲及中亚地区', value: '欧洲及中亚地区' },
    ];
  }
}
// 技术学科数据存储
const AtechnicaldisciplineData = ref<any>([]);
const disciplineChangeList = ref<any>([]);
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
function onSelectClick() {
  getProductPlatform();
}
const disabledDate = (current: any) => {
  // 禁用今天之前的日期（当前时间的前一天24点之前）
  return current && current < dayjs().startOf('day');
};

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
function ClearForm() {
  formRef.value.resetFields();
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
    formRef.value.resetFields();
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
const FormEcho = async (row: any) => {
  formRef.value.resetFields();
  if (row) {
    try {
      loading.value = true;
      visibletitle.value = '原始需求详情';
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
        loading.value = false;
      }
    } catch (error) {
      console.log(error);
      loading.value = false;
    }
  } else {
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData('');
      }
    });
    ClearForm();
    formData.value.firstTechnology = undefined;
    formData.value.secondTechnology = undefined;
  }
};

const initialFormEcho = async (row: any) => {
  formRef.value.resetFields();
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
      nextTick(() => {
        if (ckeditorRef1.value) {
          ckeditorRef1.value.setData('');
        }
      });
      ClearriginalForm();
      initialloading.value = false;
      console.log(e);
    }
  } else {
    nextTick(() => {
      if (ckeditorRef1.value) {
        ckeditorRef1.value.setData('');
      }
    });
    ClearriginalForm();
    loading.value = false;
  }
};
async function getPreAnalysisConclusion(row: any) {
  const res = await AdminApiSystemDemandcollect.getPreAnalysisConclusion({
    basicId: row.basicId,
  });
  let data: any = res.data;
  if (data.code == 200) {
    beginningformData.value.preAnalysisType = data.data.preAnalysisType;
    beginningformData.value.preAnalysisOpinion = data.data.preAnalysisOpinion;
    beginningformData.value.preAnalysisConclusion = data.data.preAnalysisConclusion;
    beginningformData.value.preAnalysisUpdateData = data.data.preAnalysisUpdateData;
  }
}
/**
 * @description tab切换
 * @param key tab切换key
 */
async function tabChange(key: string) {
  if (key == '1') {
    FormEcho(demandrow.value);
  } else if (key == '2') {
    await initialFormEcho(demandrow.value);
    getPreAnalysisConclusion(demandrow.value);
  } else if (key == '3') {
    // 初始化默认展示需求详情
    if (currentStepkey.value == 0) {
      FormEcho(demandrow.value);
    } else if (currentStepkey.value == 1) {
      await initialFormEcho(demandrow.value);
      getPreAnalysisConclusion(demandrow.value);
    } else if (currentStepkey.value == 2 || currentStepkey.value == 3 || currentStepkey.value == 4) {
      getdistributeData();
    }
  }
}
/**
 * 详情
 * @param id
 * @param parentId
 */
const handleModalDetails = async (row: any) => {
  demandrow.value = row;
  activeKey.value = '1';
  DemandProcessStatus(row.status);
  try {
    loading.value = true;
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
          resolve(FormEcho(row));
        });
      });
  } catch (error) {
    loading.value = false;
  }
};
// -------------------------------------------------步骤条----------------------------------------------------
// -------------------------需求分发/需求实现/需求验收-----------------------------
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
// 需求验收表格列
const columns = ref<any[]>([
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
    title: WeiI18n.$t('需求实现周期'),
    dataIndex: 'periodicAttribute',
    key: 'periodicAttribute',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.periodicAttribute, b.periodicAttribute),
    width: 150,
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
    title: WeiI18n.$t('实现证明材料'),
    dataIndex: 'implementProofFileList',
    key: 'implementProofFileList',
    align: 'center',
    resizable: true,
    width: 150,
  },
]);
const customRow = (record: any, index: number) => {
  return {
    onClick: () => {},
    style: {
      backgroundColor: record.upFlag ? '#fff8e6' : 'transparent',
    },
  };
};

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
const stepList = ref([
  {
    title: '需求收集',
    icon: 'icon-xuqiushouji',
    key: 0,
    disabled: true,
  },
  {
    title: '需求分析',
    icon: 'icon-edit',
    key: 1,
    disabled: true,
  },
  {
    title: '需求分发',
    icon: 'icon-xuqiufenfa',
    key: 2,
    disabled: true,
  },
  {
    title: '需求实现',
    icon: 'icon-xuqiushixian',
    key: 3,
    disabled: true,
  },
  {
    title: '需求验收',
    icon: 'icon-icon-xuqiu-yanshouguanli',
    key: 4,
    disabled: true,
  },
]);
// 需求收集
const RequirementsGathering = ref(['RME_AP', 'RME_ANALYZING', 'A_CLOSED']);
// 需求分析
const RequirementsAnalysis = ref(['RME_ANALYZED', 'RAT_NOT_ANALYZED', 'RAT_ANALYZING', 'RAT_AC', 'IPMT_PD', 'IPMT_DEC', 'UP_CLOSED', 'FD_CLOSED']);
// 需求分发
const RequirementsDistribution = ref(['DISPATCH_PENDING', 'DISTRIBUTION', 'DISPATCHED']);
// 需求实现
const RequirementsImplementation = ref(['IMPLEMENTATION_PENDING', 'ACCEPTANCE_PENDING']);
// 需求验收
const RequirementsAcceptance = ref(['COMPLETED']);
const current = ref(0);
const currents = ref(0);
const currentStepkey = ref(0);
function handleChange(num: number) {
  current.value = currents.value;
}
async function handleClick(row: any) {
  if (row.disabled) return;
  currentStepkey.value = row.key;
  if (row.key == 0) {
    FormEcho(demandrow.value);
  } else if (row.key == 1) {
    await initialFormEcho(demandrow.value);
    getPreAnalysisConclusion(demandrow.value);
  } else if (row.key == 2 || row.key == 3 || row.key == 4) {
    getdistributeData();
  }
}

async function DemandProcessStatus(status: string) {
  let key = 0;
  await stepList.value.forEach(async (item: any, index: number) => {
    if (item.title == '需求收集' && RequirementsGathering.value.includes(status)) {
      key = item.key;
    }
    if (item.title == '需求分析' && RequirementsAnalysis.value.includes(status)) {
      key = item.key;
    }
    if (item.title == '需求分发' && RequirementsDistribution.value.includes(status)) {
      key = item.key;
    }
    if (item.title == '需求实现' && RequirementsImplementation.value.includes(status)) {
      key = item.key;
    }
    if (item.title == '需求验收' && RequirementsAcceptance.value.includes(status)) {
      key = item.key;
    }
    current.value = key;
    currents.value = key;
    currentStepkey.value = key;
  });
  stepList.value.forEach(async (item: any, index: number) => {
    if (item.key <= current.value) {
      item.disabled = false;
    } else {
      item.disabled = true;
    }
  });
}
// 证明材料预览
const filevisible = ref<boolean>(false);
const implementProofFileList = ref<any>([]);
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
function Morefiles(record: any) {
  filevisible.value = true;
  implementProofFileList.value = record.implementProofFileList;
}
const fileType = ref<string>('1');
const filePath = ref<string>('1');
const powVisible = ref<boolean>(false);
async function priview(row: any) {
  const lastDotIndex = row.oldFileName.lastIndexOf('.');
  fileType.value = lastDotIndex !== -1 ? row.oldFileName.slice(lastDotIndex) : '';
  if (fileType.value == '.doc' || fileType.value == '.pdf') {
    filePath.value = row.pdfFileName;
  } else {
    filePath.value = row.filePath;
  }
  powVisible.value = true;
}
function handleClosePowModal() {
  powVisible.value = false;
}
function linkClick(url: string) {
  window.open(url);
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.demand-detail');
}
const tabBarStyle = {
  position: 'sticky', // 关键属性：粘滞定位
  top: 0, // 粘住容器顶部
  zIndex: 10, // 避免被内容遮挡
  background: '#fff', // 背景色覆盖下方内容
  width: '100%',
};
defineExpose({ handleModalDetails });
</script>
<template>
  <!-- <div class="demand-detail" v-dragModal>
      :getContainer="customGetContainer" -->
  <a-modal style="width: 90%" :style="{ top: '5%' }" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="visibletitle" @cancel="cancel">
    <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="原始需求">
        <a-form ref="formRef" layout="vertical" class="form-container" :model="formData" :label-col="labelCol">
          <a-spin :spinning="loading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="title">
                  <a-textarea class="textarea" disabled allow-clear v-model:value="formData.demandTitle" :rows="2" />
                  <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                </a-form-item>
                <a-form-item label="原始需求描述" name="description">
                  <CkeditorPlugin ref="ckeditorRef" :disabled="true" height="200" />
                </a-form-item>
                <a-form-item label="应用场景描述">
                  <a-textarea disabled v-model:value="formData.sceneDescription" :rows="4" />
                </a-form-item>
                <a-form-item label="原始需求价值">
                  <a-textarea disabled v-model:value="formData.demandValue" :rows="4" />
                </a-form-item>
                <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                  <a-textarea disabled v-model:value="formData.productGap" :rows="4" />
                </a-form-item>
                <a-form-item label="其他竞品/其他解决方案的描述">
                  <a-textarea disabled v-model:value="formData.otherDescriptions" :rows="4" />
                </a-form-item>
              </div>
              <!-- 右侧表单区域 -->
              <div style="width: 30%; margin-left: 5%">
                <a-row style="display: flex; justify-content: space-between">
                  <a-col :span="11">
                    <a-form-item label="提报人：">
                      <a-input disabled v-model:value="formData.originaUserName" />
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
                        style="width: 100%; text-align: left" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="原始需求编号" v-if="formData.demandNum">
                  <a-input disabled v-model:value="formData.demandNum" />
                </a-form-item>
                <a-form-item label="提交人单位及职务">
                  <a-textarea v-model:value="formData.companyPosition" :rows="1" :disabled="true" />
                </a-form-item>
                <a-form-item label="提交人联系方式" name="phone">
                  <a-input disabled v-model:value="formData.phone" />
                </a-form-item>
                <a-form-item label="期望反馈时间" name="feedbackTime">
                  <a-date-picker
                    disabled
                    :locale="locale"
                    :disabled-date="disabledDate"
                    v-model:value="formData.feedbackTime"
                    format="YYYY-MM-DD "
                    value-format="YYYY-MM-DD"
                    style="width: 100%; text-align: left" />
                </a-form-item>
                <a-form-item label="客户名称（需求方）">
                  <a-input disabled v-model:value="formData.customerName" />
                </a-form-item>
                <a-form-item label="需求来源" name="demandSource">
                  <a-select disabled v-model:value="formData.demandSource">
                    <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="区域市场" name="regionalMarket">
                  <a-select disabled v-model:value="formData.regionalMarket" @change="RegionChange">
                    <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="细分市场">
                  <a-select disabled v-model:value="formData.marketSegment">
                    <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品平台">
                  <a-select disabled v-model:value="formData.platform" @click="onSelectClick" @change="PlatformChange">
                    <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品系列">
                  <a-select disabled v-model:value="formData.series">
                    <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="型号">
                  <a-input disabled v-model:value="formData.model" />
                </a-form-item>
                <a-form-item label="一级技术学科">
                  <a-select disabled v-model:value="formData.firstTechnology" :max-tag-count="1" mode="multiple">
                    <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="二级技术学科">
                  <a-select disabled v-model:value="formData.secondTechnology" :max-tag-count="1" mode="multiple">
                    <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="紧急程度" name="urgencyLevel">
                  <a-select disabled v-model:value="formData.urgencyLevel">
                    <a-select-option v-for="item in UrgencyLevellist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="初始需求">
        <a-form ref="formRef" layout="vertical" class="form-container" :model="beginningformData" :label-col="labelCol">
          <a-spin :spinning="initialloading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="title">
                  <a-textarea class="textarea" disabled allow-clear v-model:value="beginningformData.demandTitle" :rows="2" maxlength="30" />
                  <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                </a-form-item>
                <a-form-item label="原始需求描述" name="description">
                  <CkeditorPlugin ref="ckeditorRef1" :disabled="true" height="200" />
                </a-form-item>
                <a-form-item label="应用场景描述">
                  <a-textarea disabled v-model:value="beginningformData.sceneDescription" :rows="4" />
                </a-form-item>
                <a-form-item label="原始需求价值">
                  <a-textarea disabled v-model:value="beginningformData.demandValue" :rows="4" />
                </a-form-item>
                <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                  <a-textarea disabled v-model:value="beginningformData.productGap" :rows="4" />
                </a-form-item>
                <a-form-item label="其他竞品/其他解决方案的描述">
                  <a-textarea disabled v-model:value="beginningformData.otherDescriptions" :rows="4" />
                </a-form-item>
                <a-form-item label="预分析：">
                  <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                    <a-col :span="11">
                      <div style="display: flex; justify-content: space-between">
                        <a-form-item style="width: 48%" label="结论：">
                          <a-input disabled v-model:value="beginningformData.preAnalysisConclusion" />
                        </a-form-item>
                        <a-form-item style="width: 48%" label="下步处理方式：">
                          <a-input disabled v-model:value="beginningformData.preAnalysisType" />
                        </a-form-item>
                      </div>
                      <a-form-item label="修改内容记录">
                        <a-textarea disabled v-model:value="beginningformData.preAnalysisUpdateData" :rows="3" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="11">
                      <a-form-item label="意见：">
                        <a-textarea disabled v-model:value="beginningformData.preAnalysisOpinion" :rows="7" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form-item>
              </div>
              <!-- 右侧表单区域 -->
              <div style="width: 30%; margin-left: 5%">
                <a-row style="display: flex; justify-content: space-between">
                  <a-col :span="11">
                    <a-form-item label="提报人：">
                      <a-input disabled v-model:value="beginningformData.originaUserName" />
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
                        style="width: 100%; text-align: left" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="原始需求编号" v-if="beginningformData.demandNum">
                  <a-input disabled v-model:value="beginningformData.demandNum" />
                </a-form-item>
                <a-form-item label="提交人单位及职务">
                  <a-textarea v-model:value="beginningformData.companyPosition" :rows="1" :disabled="true" />
                </a-form-item>
                <a-form-item label="提交人联系方式" name="phone">
                  <a-input disabled v-model:value="beginningformData.phone" />
                </a-form-item>
                <a-form-item label="期望反馈时间" name="feedbackTime">
                  <a-date-picker
                    disabled
                    :locale="locale"
                    :disabled-date="disabledDate"
                    v-model:value="beginningformData.feedbackTime"
                    format="YYYY-MM-DD "
                    value-format="YYYY-MM-DD"
                    style="width: 100%; text-align: left" />
                </a-form-item>
                <a-form-item label="客户名称（需求方）">
                  <a-input disabled v-model:value="beginningformData.customerName" />
                </a-form-item>
                <a-form-item label="需求来源" name="demandSource">
                  <a-select disabled v-model:value="beginningformData.demandSource">
                    <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="区域市场" name="regionalMarket">
                  <a-select disabled v-model:value="beginningformData.regionalMarket" @change="RegionChange">
                    <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="细分市场">
                  <a-select disabled v-model:value="beginningformData.marketSegment">
                    <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品平台">
                  <a-select disabled v-model:value="beginningformData.platform" @click="onSelectClick" @change="PlatformChange">
                    <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品系列">
                  <a-select disabled v-model:value="beginningformData.series">
                    <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="型号">
                  <a-input disabled v-model:value="beginningformData.model" />
                </a-form-item>
                <a-form-item label="一级技术学科">
                  <a-select disabled v-model:value="beginningformData.firstTechnology" :max-tag-count="1" mode="multiple">
                    <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="二级技术学科">
                  <a-select disabled v-model:value="beginningformData.secondTechnology" :max-tag-count="1" mode="multiple">
                    <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="紧急程度" name="urgencyLevel">
                  <a-select disabled v-model:value="beginningformData.urgencyLevel">
                    <a-select-option v-for="item in UrgencyLevellist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="需求分类：" name="demandClassify">
                  <a-input disabled v-model:value="beginningformData.demandClassify2" />
                </a-form-item>
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="3" tab="需求进展">
        <div>
          <a-steps class="allow-process-step-click" v-model:current="current" @change="handleChange">
            <a-step v-for="item in stepList" :key="item.key" :disabled="item.disabled" @click="handleClick(item)">
              <template #title>
                <span
                  :style="{
                    color: currentStepkey === item.key ? '#3770e1' : '',
                    fontWeight: 'bold',
                  }"
                  >{{ item.title }}</span
                >
              </template>
              <template #icon>
                <EpcIcon :type="item.icon" />
              </template>
              <template #description>
                <div class="moving-div" v-if="item.key !== 4 ? item.key === current : false">
                  <EpcIcon type="icon-gaotie" style="font-size: 60px; color: red" />
                </div>
                <div class="jump-box" v-if="item.title === '需求关闭'">
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
          <div class="demand-status-page">
            <!-- 需求收集 -->
            <div v-if="currentStepkey === 0">
              <div class="pagecontent-title">
                <i></i>
                <span style="font-size: 13px">初始需求</span>
              </div>
              <a-form ref="formRef" layout="vertical" class="form-container" :model="formData" :label-col="labelCol">
                <a-spin :spinning="loading" tip="加载中...">
                  <div style="display: flex">
                    <!-- 左侧表单区域 -->
                    <div style="width: 60%">
                      <a-form-item label="需求标题" name="title">
                        <a-textarea class="textarea" disabled allow-clear v-model:value="formData.demandTitle" :rows="2" />
                        <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                      </a-form-item>
                      <a-form-item label="原始需求描述" name="description">
                        <CkeditorPlugin ref="ckeditorRef" :disabled="true" height="200" />
                      </a-form-item>
                      <a-form-item label="应用场景描述">
                        <a-textarea disabled v-model:value="formData.sceneDescription" :rows="4" />
                      </a-form-item>
                      <a-form-item label="原始需求价值">
                        <a-textarea disabled v-model:value="formData.demandValue" :rows="4" />
                      </a-form-item>
                      <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                        <a-textarea disabled v-model:value="formData.productGap" :rows="4" />
                      </a-form-item>
                      <a-form-item label="其他竞品/其他解决方案的描述">
                        <a-textarea disabled v-model:value="formData.otherDescriptions" :rows="4" />
                      </a-form-item>
                    </div>
                    <!-- 右侧表单区域 -->
                    <div style="width: 30%; margin-left: 5%">
                      <a-row style="display: flex; justify-content: space-between">
                        <a-col :span="11">
                          <a-form-item label="提报人：">
                            <a-input disabled v-model:value="formData.originaUserName" />
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
                              style="width: 100%; text-align: left" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-form-item label="原始需求编号" v-if="formData.demandNum">
                        <a-input disabled v-model:value="formData.demandNum" />
                      </a-form-item>
                      <a-form-item label="提交人单位及职务">
                        <a-textarea v-model:value="formData.companyPosition" :rows="1" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人联系方式" name="phone">
                        <a-input disabled v-model:value="formData.phone" />
                      </a-form-item>
                      <a-form-item label="期望反馈时间" name="feedbackTime">
                        <a-date-picker
                          disabled
                          :locale="locale"
                          :disabled-date="disabledDate"
                          v-model:value="formData.feedbackTime"
                          format="YYYY-MM-DD "
                          value-format="YYYY-MM-DD"
                          style="width: 100%; text-align: left" />
                      </a-form-item>
                      <a-form-item label="客户名称（需求方）">
                        <a-input disabled v-model:value="formData.customerName" />
                      </a-form-item>
                      <a-form-item label="需求来源" name="demandSource">
                        <a-select disabled v-model:value="formData.demandSource">
                          <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="区域市场" name="regionalMarket">
                        <a-select disabled v-model:value="formData.regionalMarket" @change="RegionChange">
                          <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="细分市场">
                        <a-select disabled v-model:value="formData.marketSegment">
                          <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品平台">
                        <a-select disabled v-model:value="formData.platform" @click="onSelectClick" @change="PlatformChange">
                          <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品系列">
                        <a-select disabled v-model:value="formData.series">
                          <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="型号">
                        <a-input disabled v-model:value="formData.model" />
                      </a-form-item>
                      <a-form-item label="一级技术学科">
                        <a-select disabled v-model:value="formData.firstTechnology" :max-tag-count="1" mode="multiple">
                          <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="二级技术学科">
                        <a-select disabled v-model:value="formData.secondTechnology" :max-tag-count="1" mode="multiple">
                          <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="紧急程度" name="urgencyLevel">
                        <a-select disabled v-model:value="formData.urgencyLevel">
                          <a-select-option v-for="item in UrgencyLevellist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                  </div>
                </a-spin>
              </a-form>
            </div>
            <!-- 需求分析 -->
            <div v-if="currentStepkey === 1">
              <div class="pagecontent-title">
                <i></i>
                <span style="font-size: 13px">原始需求</span>
              </div>
              <a-form ref="formRef" layout="vertical" class="form-container" :model="beginningformData" :label-col="labelCol">
                <a-spin :spinning="initialloading" tip="加载中...">
                  <div style="display: flex">
                    <!-- 左侧表单区域 -->
                    <div style="width: 60%">
                      <a-form-item label="需求标题" name="title">
                        <a-textarea class="textarea" disabled allow-clear v-model:value="beginningformData.demandTitle" :rows="2" maxlength="30" />
                        <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                      </a-form-item>
                      <a-form-item label="原始需求描述" name="description">
                        <CkeditorPlugin ref="ckeditorRef1" :disabled="true" height="200" />
                      </a-form-item>
                      <a-form-item label="应用场景描述">
                        <a-textarea disabled v-model:value="beginningformData.sceneDescription" :rows="4" />
                      </a-form-item>
                      <a-form-item label="原始需求价值">
                        <a-textarea disabled v-model:value="beginningformData.demandValue" :rows="4" />
                      </a-form-item>
                      <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                        <a-textarea disabled v-model:value="beginningformData.productGap" :rows="4" />
                      </a-form-item>
                      <a-form-item label="其他竞品/其他解决方案的描述">
                        <a-textarea disabled v-model:value="beginningformData.otherDescriptions" :rows="4" />
                      </a-form-item>
                      <a-form-item label="预分析：">
                        <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                          <a-col :span="11">
                            <div style="display: flex; justify-content: space-between">
                              <a-form-item style="width: 48%" label="结论：">
                                <a-input disabled v-model:value="beginningformData.preAnalysisConclusion" />
                              </a-form-item>
                              <a-form-item style="width: 48%" label="下步处理方式：">
                                <a-input disabled v-model:value="beginningformData.preAnalysisType" />
                              </a-form-item>
                            </div>
                            <a-form-item label="修改内容记录">
                              <a-textarea disabled v-model:value="beginningformData.preAnalysisUpdateData" :rows="3" />
                            </a-form-item>
                          </a-col>
                          <a-col :span="11">
                            <a-form-item label="意见：">
                              <a-textarea disabled v-model:value="beginningformData.preAnalysisOpinion" :rows="7" />
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </a-form-item>
                    </div>
                    <!-- 右侧表单区域 -->
                    <div style="width: 30%; margin-left: 5%">
                      <a-row style="display: flex; justify-content: space-between">
                        <a-col :span="11">
                          <a-form-item label="提报人：">
                            <a-input disabled v-model:value="beginningformData.originaUserName" />
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
                              style="width: 100%; text-align: left" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-form-item label="原始需求编号" v-if="beginningformData.demandNum">
                        <a-input disabled v-model:value="beginningformData.demandNum" />
                      </a-form-item>
                      <a-form-item label="提交人单位及职务">
                        <a-textarea v-model:value="beginningformData.companyPosition" :rows="1" :disabled="true" />
                      </a-form-item>
                      <a-form-item label="提交人联系方式" name="phone">
                        <a-input disabled v-model:value="beginningformData.phone" />
                      </a-form-item>
                      <a-form-item label="期望反馈时间" name="feedbackTime">
                        <a-date-picker
                          disabled
                          :locale="locale"
                          :disabled-date="disabledDate"
                          v-model:value="beginningformData.feedbackTime"
                          format="YYYY-MM-DD "
                          value-format="YYYY-MM-DD"
                          style="width: 100%; text-align: left" />
                      </a-form-item>
                      <a-form-item label="客户名称（需求方）">
                        <a-input disabled v-model:value="beginningformData.customerName" />
                      </a-form-item>
                      <a-form-item label="需求来源" name="demandSource">
                        <a-select disabled v-model:value="beginningformData.demandSource">
                          <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="区域市场" name="regionalMarket">
                        <a-select disabled v-model:value="beginningformData.regionalMarket" @change="RegionChange">
                          <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="细分市场">
                        <a-select disabled v-model:value="beginningformData.marketSegment">
                          <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品平台">
                        <a-select disabled v-model:value="beginningformData.platform" @click="onSelectClick" @change="PlatformChange">
                          <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="产品系列">
                        <a-select disabled v-model:value="beginningformData.series">
                          <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="型号">
                        <a-input disabled v-model:value="beginningformData.model" />
                      </a-form-item>
                      <a-form-item label="一级技术学科">
                        <a-select disabled v-model:value="beginningformData.firstTechnology" :max-tag-count="1" mode="multiple">
                          <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="二级技术学科">
                        <a-select disabled v-model:value="beginningformData.secondTechnology" :max-tag-count="1" mode="multiple">
                          <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="紧急程度" name="urgencyLevel">
                        <a-select disabled v-model:value="beginningformData.urgencyLevel">
                          <a-select-option v-for="item in UrgencyLevellist" :key="item.value" :value="item.value">
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item label="需求分类：" name="demandClassify">
                        <a-input disabled v-model:value="beginningformData.demandClassify2" />
                      </a-form-item>
                    </div>
                  </div>
                </a-spin>
              </a-form>
            </div>
            <!-- 需求分发 -->
            <div v-if="currentStepkey === 2">
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
            </div>
            <!-- 需求实现 -->
            <div v-if="currentStepkey === 3">
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
            </div>
            <!-- 需求验收 -->
            <div v-if="currentStepkey === 4">
              <div class="pagecontent-title">
                <i></i>
                <span style="font-size: 13px">需求验收列表</span>
              </div>
              <a-spin :spinning="distributeloading" tip="加载中...">
                <a-table
                  :scroll="{ x: 1500 }"
                  row-key="basicId"
                  :columns="columns"
                  :data-source="distributedata"
                  :locale="locale"
                  :pagination="false"
                  :loading="loading"
                  :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                      <span :style="getStatusStyle(record.status)">{{ getTaskStatusLabel(record.status) }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'periodicAttribute'">
                      <span>{{ periodicAttributemedth(record.periodicAttribute) }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'allocateType'">
                      <span style="color: #4caf50">{{ getDistributionteamLabel(record.allocateType) }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'implementProofFileList'">
                      <a v-if="record.implementProofFileList && record.implementProofFileList.length > 0" @click.stop="Morefiles(record)">查看文件列表</a>
                    </template>
                  </template>
                </a-table>
              </a-spin>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-button type="primary" @click="emit('onClose', false)">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        关闭</a-button
      >
    </template>
  </a-modal>
  <!-- </div> -->
  <!-- 实现证明材料 -->
  <a-modal v-model:visible="filevisible" style="width: 90%" title="文件列表" :ok-text="false" :confirm-loading="$isPending()" :mask-closable="false" @cancel="handlfileeClose">
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
              <div class="tit">{{ item.oldFileName }}</div>
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
        关闭</a-button
      >
    </template>
  </a-modal>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style scoped lang="less">
//文件列表
.upload-file-wrap {
  margin: 0 20px 28px 16px;
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
          margin-left: 27px;
          font-size: 12px !important;
          height: 14px;
          width: 280px;
          overflow: hidden;
          color: #0d53e2;
          cursor: pointer;
          white-space: nowrap; /* 强制文本不换行 */
          overflow: hidden; /* 超出容器部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          // &:hover {
          // height: 14px;
          // width: 280px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // word-wrap: normal;
          // white-space: nowrap;
          // display: block;
          // border-bottom: 1px solid blue;
          // color: #0d53e2;
          // transform: translateY(-2px);
          // }
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
/* 允许当前步骤点击（覆盖默认禁用样式） */
:deep(.allow-process-step-click .ant-steps-item-process) {
  pointer-events: auto !important; /* 启用点击事件 */
  cursor: pointer !important; /* 鼠标指针变为手型 */
}
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.demand-status-page {
  height: calc(100vh - 392px);
  overflow: auto;
  margin: 5px 0 0 5px;
}
.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
}
:deep(.ant-tabs-top > .ant-tabs-nav::before) {
  border-bottom: none;
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
