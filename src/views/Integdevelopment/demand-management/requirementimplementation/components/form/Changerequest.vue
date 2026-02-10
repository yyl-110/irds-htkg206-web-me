<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useDictStore } from '@/store/modules/dict';
import { AdminApiSystemDictType } from '@/api/tags/管理后台字典类型';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { Uploado_draggerMoreFile } from '@/components/UploadFile';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
/** 获取字典 */
const useDict = useDictStore();
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const Upgradeform = reactive<any>({
  changeReason: '',
  changeProofFileIds: [],
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
  preAnalysisType?: string;
  preAnalysisTypelist?: string;
  preAnalysisConclusion?: string;
  preAnalysisOpinion?: string;
  preAnalysisUpdateData?: string;
}
/** 核心与强制性分类 */
const CoreMandatoryicationList = ref<any[]>([]);
/** 技术性分类 */
const TechnicalClassificationList = ref<any[]>([]);
/** 运营与商业分类 */
const OperationsBusinessList = ref<any[]>([]);
const Samplevisible = ref<boolean>(false);
const browsevisible = ref<boolean>(false);
const formRef = ref();
const formRef1 = ref();
const activeKey = ref<string[]>(['1', '2']);
/** 富文本对象 */
const ckeditorRef = ref();
const visibletitle = ref<string>('需求变更');
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
const deptName = ref('');
function Departmentalverification() {
  return ['海外事业部', '城铁事业部', '铁路事业部'].includes(deptName.value);
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
  originaUserName: userStore.getUser.userName,
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
  preAnalysisConclusion: '',
  preAnalysisType: '',
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
  // { label: '国内地铁市场', value: '国内地铁市场' },
  // { label: '国内铁路市场', value: '国内铁路市场' },
  // { label: '海外产品市场', value: '海外产品市场' },
]);
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
const demandrow = ref<any>({});
const loading = ref(false);
const requirementloading = ref(false);
// 紧急程度
const UrgencyLevellist = ref<OptionrItem[]>([
  { label: '低', value: '低' },
  { label: '中', value: '中' },
  { label: '高', value: '高' },
]);
const preAnalysisConclusionlist = ref<OptionrItem[]>([
  { label: '有效需求', value: '有效需求' },
  { label: '无效需求', value: '无效需求' },
]);
const preAnalysisTypelist = ref<OptionrItem[]>([]);
// 技术学科数据存储
const AtechnicaldisciplineData = ref<any>([]);
const disciplineChangeList = ref<any>([]);
// 区域/细分市场
const marketList = ref([]);
function RegionChange(value: string) {
  formData.value.marketSegment = undefined;
  let data: any = marketList.value.filter((item: any) => item.value == value);
  if (data[0] && data[0].remark) {
    let arr = data[0].remark.split(',');
    if (arr.length > 0) {
      MarketSegmentlist.value = arr.map((item: string) => ({ label: item, value: item }));
    }
  }
  // if (value == '国内地铁市场') {
  //   MarketSegmentlist.value = [
  //     { label: '东北区域', value: '东北区域' },
  //     { label: '华北区域', value: '华北区域' },
  //     { label: '华中区域', value: '华中区域' },
  //     { label: '华东区域', value: '华东区域' },
  //     { label: '华南区域', value: '华南区域' },
  //     { label: '西南区域', value: '西南区域' },
  //     { label: '西北区域', value: '西北区域' },
  //   ];
  // } else if (value == '国内铁路市场') {
  //   MarketSegmentlist.value = [
  //     { label: '中国铁路哈尔滨局集团有限公司', value: '中国铁路哈尔滨局集团有限公司' },
  //     { label: '中国铁路沈阳局集团有限公司', value: '中国铁路沈阳局集团有限公司' },
  //     { label: '中国铁路北京局集团有限公司', value: '中国铁路北京局集团有限公司' },
  //     { label: '中国铁路太原局集团有限公司', value: '中国铁路太原局集团有限公司' },
  //     { label: '中国铁路呼和浩特局集团有限公司', value: '中国铁路呼和浩特局集团有限公司' },
  //     { label: '中国铁路济南局集团有限公司', value: '中国铁路济南局集团有限公司' },
  //     { label: '中国铁路上海局集团有限公司', value: '中国铁路上海局集团有限公司' },
  //     { label: '中国铁路郑州局集团有限公司', value: '中国铁路郑州局集团有限公司' },
  //     { label: '中国铁路武汉局集团有限公司', value: '中国铁路武汉局集团有限公司' },
  //     { label: '中国铁路西安局集团有限公司', value: '中国铁路西安局集团有限公司' },
  //     { label: '中国铁路兰州局集团有限公司', value: '中国铁路兰州局集团有限公司' },
  //     { label: '中国铁路乌鲁木齐局集团有限公司', value: '中国铁路乌鲁木齐局集团有限公司' },
  //     { label: '中国铁路青藏集团有限公司', value: '中国铁路青藏集团有限公司' },
  //     { label: '中国铁路广州局集团有限公司', value: '中国铁路广州局集团有限公司' },
  //     { label: '中国铁路成都局集团有限公司', value: '中国铁路成都局集团有限公司' },
  //   ];
  // } else {
  //   MarketSegmentlist.value = [
  //     { label: '北美区域', value: '北美区域' },
  //     { label: '拉美区域', value: '拉美区域' },
  //     { label: '亚太区域', value: '亚太区域' },
  //     { label: '中东及非洲区域', value: '中东及非洲区域' },
  //     { label: '欧洲及中亚地区', value: '欧洲及中亚地区' },
  //   ];
  // }
}
// 根据产品平台匹配当前平台下的系列
function PlatformChange(value: string | undefined) {
  ProductPlatformData.value.forEach((item: any) => {
    if (value == item.id && item.children.length > 0) {
      ProductSerieslist.value = item.children.map((item: any) => ({ label: item.name, value: `${item.id}` })) || [];
    }
  });
}
function onSelectClick() {
  getProductPlatform();
}
function preAnalysisChange(value: string) {
  formData.value.preAnalysisType = '';
  if (value == '有效需求') {
    preAnalysisTypelist.value = [
      { label: '提交RAT分析', value: '提交RAT分析' },
      { label: '关闭并反馈提交人', value: '关闭并反馈提交人' },
    ];
  } else {
    preAnalysisTypelist.value = [{ label: '退回提交人', value: '退回提交人' }];
  }
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
    ProductPlatformlist.value = res.data.data[0].children.map((item: any) => ({ label: item.name, value: `${item.id}` })) || [];
  }
}
/** 获取技术学科 */
async function gettechnicaldisciplinesList() {
  const res = await AdminApiSystemTechnicaldisciplines.gettechnicaldisciplinesList({});
  if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
    AtechnicaldisciplineData.value = res.data.data;
    Atechnicaldisciplinelist.value = res.data.data.map((item: any) => ({ label: item.categoryName, value: `${item.id}` })) || [];
  }
}
// 一级技术学科选中
function disciplineChange(value: string) {
  disciplineChangeList.value = value;
  formData.value.secondTechnology = undefined;
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
      Twotechnicaldisciplineslist.value.push(...(matchedBItem.children.map((item: any) => ({ label: item.categoryName, value: `${item.id}` })) || []));
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
    originaUserName: userStore.getUser.userName,
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
    preAnalysisConclusion: '',
    preAnalysisType: '',
    preAnalysisOpinion: '',
    preAnalysisUpdateData: '',
  };
  formRef1.value.resetFields();
  Upgradeform.value = {
    changeReason: '',
    changeProofFileIds: [],
  };
}

const FormEcho = async (row: any) => {
  formRef.value.resetFields();
  formRef1.value.resetFields();
  if (row) {
    try {
      const res = await AdminApiSystemDemandcollect.getInitDemandDetail({ basicId: row.basicId });
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
    } catch (e) {
      loading.value = false;
      console.log(e);
    }
  } else {
    nextTick(() => {
      if (ckeditorRef.value) {
        ckeditorRef.value.setData('');
      }
    });
    ClearForm();
    loading.value = false;
  }
};

async function getPreAnalysisConclusion(row: any) {
  const res = await AdminApiSystemDemandcollect.getPreAnalysisConclusion({ basicId: row.basicId });
  let data: any = res.data;
  if (data.code == 200 && data.data) {
    formData.value.preAnalysisType = data.data.preAnalysisType;
    formData.value.preAnalysisOpinion = data.data.preAnalysisOpinion;
    formData.value.preAnalysisConclusion = data.data.preAnalysisConclusion;
    formData.value.preAnalysisUpdateData = data.data.preAnalysisUpdateData;
  }
}
async function getProfile() {
  const res = await AdminApiSystemUserProfile.profile({ id: `${userStore.getUser.id}` });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    if (data.dept) {
      deptName.value = data.dept.name;
    }
  }
}
/**
 * @param category
 * @description 获取字典
 */
async function initDictionary(dictType: string) {
  const res = await AdminApiSystemDictType.getSelValListById({ dictType });
  if (res.data.code === 200) {
    let data: any = res.data.data;
    marketList.value = data;
    regionalMarketlist.value = data.map((item: any) => ({ label: item.label, value: item.value })) || [];
  }
}
/**
 * 详情
 * @param id
 */
const handleModalAddOrUpdate = async (row: any) => {
  demandrow.value = row;
  formRef.value.resetFields();
  getProfile();
  initDictionary('Demandmarkets');
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
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          resolve(getPreAnalysisConclusion(row));
        });
      });
  } catch (error) {
    loading.value = false;
  }
};
const onSubmitFormData = async () => {
  await formRef.value?.validate();
  await formRef1.value.validate();
  if (!ckeditorRef.value.getData()) {
    message.error('原始需求描述不能为空');
    return;
  }
  formData.value.demandRemarks = ckeditorRef.value.getData();
  let firstTechnology: any = formData.value.firstTechnology;
  let secondTechnology: any = formData.value.secondTechnology;
  if (Array.isArray(firstTechnology)) {
    firstTechnology = firstTechnology ? firstTechnology.join(',') : '';
  } else {
    firstTechnology = firstTechnology;
  }
  if (Array.isArray(secondTechnology)) {
    secondTechnology = secondTechnology ? secondTechnology.join(',') : '';
  } else {
    secondTechnology = secondTechnology;
  }
  let data: any = { ...formData.value };
  data.firstTechnology = firstTechnology;
  data.secondTechnology = secondTechnology;
  let arr: any = [];
  data.changeReason = Upgradeform.changeReason;
  if (Upgradeform.changeProofFileIds.length > 0) {
    Upgradeform.changeProofFileIds.forEach((item: any) => {
      arr.push(item.id);
    });
  }
  data.changeProofFileIds = arr;
  Modal.confirm({
    title: `确定要发起变更吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemplementation.taskChange(data);
      if (res.data.code == 200) {
        message.success('操作成功');
        emit('RefreshtableData');
        emit('onClose', false);
      }
    },
  });
};
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
// --------------------------------------参考范文-------------------------------
function ReferenceSample() {
  selectedRowList.value = [];
  selectedRowkeys.value = [];
  Samplevisible.value = true;
}
const SampleData = ref<any>([
  {
    name: '描述不清，要素缺失',
  },
  {
    name: '转至所属领域RAT处理 ',
  },
  {
    name: '属于问题，提交问题处理流程处理',
  },
  {
    name: '已实现，见编号',
  },
  {
    name: '与 编号合并跟踪',
  },
  {
    name: '其他原因 ',
  },
]);
const Samplecolumns = ref<any>([
  {
    title: WeiI18n.t('意见').value,
    dataIndex: 'name',
    key: 'name',
    minWidth: 100,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
]);
const selectedRowkeys = ref<any>([]); // 存储选中行的key
const selectedRowList = ref<any>([]); // 存储选中行的完整数据
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      if (record.name == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.name);
        selectedRowList.value.push(record);
      }
    },
  };
}
// 参考文献
function Sampleconfirm() {
  if (selectedRowList.value.length == 0) {
    message.error('请选择参考范文');
    return;
  }
  if (selectedRowList.value[0].name) {
    formData.value.preAnalysisOpinion = selectedRowList.value[0].name;
    Samplevisible.value = false;
  }
}
// --------------------------------------需求分类-------------------------------
// 需求分类数据结构
const categoryGroups = ref<any>([
  // {
  //   title: '核心与强制性分类',
  //   categories: [
  //     { value: 'safety', label: '安全性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'reliability', label: '可靠性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'availability', label: '可用性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'maintainability', label: '可维护性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'testability', label: '可测试性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'environmental-adaptability', label: '环境适应性需求', description: '', category: '核心与强制性分类' },
  //     { value: 'compliance', label: '法规与标准符合性需求', description: '', category: '核心与强制性分类' },
  //   ],
  // },
  // {
  //   title: '技术性分类',
  //   categories: [
  //     { value: 'functionality', label: '功能需求', description: '', category: '技术性分类' },
  //     { value: 'performance', label: '性能需求', description: '', category: '技术性分类' },
  //     { value: 'interface', label: '接口需求', description: '', category: '技术性分类' },
  //     { value: 'physical-material', label: '物理与材质需求', description: '', category: '技术性分类' },
  //   ],
  // },
  // {
  //   title: '运营与商业分类',
  //   categories: [
  //     { value: 'operation-maintenance', label: '运营维护需求', description: '', category: '运营与商业分类' },
  //     { value: 'user-experience', label: '用户体验需求', description: '', category: '运营与商业分类' },
  //     { value: 'economy', label: '经济性需求', description: '', category: '运营与商业分类' },
  //   ],
  // },
]);
// 存储已选需求的响应式对象
const selectedCategories = ref<any>({});
// 存储已选需求列表的响应式数组
const selectedCategoriesList = ref<any>([]);
// 计算已选需求数量
const selectedCategoriesCount = ref(0);
// 计算核心与强制性分类数量
const coreCount = ref(0);
// 计算技术性分类数量
const techCount = ref(0);
// 计算运营与商业分类数量
const opCount = ref(0);
/**
 * @param category
 * @description 获取字典
 */
async function initclassificationDictionary(dictType: string) {
  const res = await AdminApiSystemDictType.getSelValListById({ dictType });
  if (res.data.code === 200) {
    let data: any = res.data.data;
    if (dictType == 'CoreMandatoryication') {
      CoreMandatoryicationList.value = data;
    } else if (dictType == 'TechnicalClassification') {
      TechnicalClassificationList.value = data;
    } else if (dictType == 'OperationsBusiness') {
      OperationsBusinessList.value = data;
    }
  }
}
// 浏览
async function browseClcik() {
  requirementloading.value = true;
  browsevisible.value = true;
  await initclassificationDictionary('CoreMandatoryication');
  await initclassificationDictionary('TechnicalClassification');
  await initclassificationDictionary('OperationsBusiness');
  categoryGroups.value = [
    {
      title: (CoreMandatoryicationList.value[0] && CoreMandatoryicationList.value[0].cssClass) || '核心与强制性分类',
      categories: CoreMandatoryicationList.value,
    },
    {
      title: (TechnicalClassificationList.value[0] && TechnicalClassificationList.value[0].cssClass) || '技术性分类',
      categories: TechnicalClassificationList.value,
    },
    {
      title: (OperationsBusinessList.value[0] && OperationsBusinessList.value[0].cssClass) || '运营与商业分类',
      categories: OperationsBusinessList.value,
    },
  ];
  selectedCategories.value = {};
  selectedCategoriesList.value = [];
  nextTick(() => {
    let demandClassify = formData.value.demandClassify2 ? formData.value.demandClassify2.split(',') : [];
    requirementloading.value = false;
    if (demandClassify.length == 0) {
      return;
    }
    // 遍历数组B中的每个对象
    categoryGroups.value.forEach((item: any) => {
      // 遍历当前对象的categories数组
      item.categories.forEach((ite: any) => {
        // 若category.label存在于arrayA中，则添加到结果数组
        if (demandClassify.includes(ite.label)) {
          selectedCategoriesList.value.push(ite);
        }
      });
    });
    selectedCategoriesList.value.forEach((cat: any) => {
      selectedCategories.value[cat.value] = true;
    });
    updateStatistics();
  });
}

// 处理需求分类选择变化
const handleCategoryChange = (item: any) => {
  const data = { ...selectedCategories.value };
  data[item.value] = !data[item.value];
  selectedCategories.value[item.value] = !data[item.value];
  if (selectedCategories.value[item.value]) {
    selectedCategoriesList.value.push(item);
  } else {
    selectedCategoriesList.value = selectedCategoriesList.value.filter((cat: any) => cat.value !== item.value);
  }
  updateStatistics();
};

// 更新统计信息
const updateStatistics = () => {
  selectedCategoriesCount.value = selectedCategoriesList.value.length;
  coreCount.value = selectedCategoriesList.value.filter(
    (cat: any) => cat.cssClass === ((CoreMandatoryicationList.value[0] && CoreMandatoryicationList.value[0].cssClass) || '核心与强制性分类'),
  ).length;
  techCount.value = selectedCategoriesList.value.filter(
    (cat: any) => cat.cssClass === ((TechnicalClassificationList.value[0] && TechnicalClassificationList.value[0].cssClass) || '技术性分类'),
  ).length;
  opCount.value = selectedCategoriesList.value.filter(
    (cat: any) => cat.cssClass === ((OperationsBusinessList.value[0] && OperationsBusinessList.value[0].cssClass) || '运营与商业分类'),
  ).length;
};
// 重置选择
const resetSelection = () => {
  requirementloading.value = true;
  selectedCategories.value = {};
  selectedCategoriesList.value = [];
  nextTick(() => {
    requirementloading.value = false;
  });
  updateStatistics();
};
// 确认需求分类
function browseconfirm() {
  if (selectedCategoriesList.value.length === 0) {
    message.error('请选择需求分类');
    return;
  }
  const nameStr = selectedCategoriesList.value.map((item: any) => item.label).join(',');
  let arr = selectedCategoriesList.value.map((item: any) => item.cssClass);
  const uniqueArr = Array.from(new Set(arr));
  formData.value.demandClassify1 = uniqueArr.join(',');
  formData.value.demandClassify2 = nameStr;
  browsevisible.value = false;
}
// 移除已选需求
const removeSelected = (selected: any) => {
  selectedCategories.value[selected.value] = false;
  selectedCategoriesList.value = selectedCategoriesList.value.filter((cat: any) => cat.value !== selected.value);
  updateStatistics();
};
async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      Upgradeform.changeProofFileIds.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
function filechange(file: any) {
  Upgradeform.changeProofFileIds = Upgradeform.changeProofFileIds.filter((item: any) => item.id !== file.id);
}

defineExpose({ handleModalAddOrUpdate });
</script>
<template>
  <a-modal style="width: 90%" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="visibletitle" @cancel="cancel">
    <a-collapse class="custom-collapse form-container" v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1" header="初始需求">
        <a-form ref="formRef" layout="vertical" :model="formData" :label-col="labelCol">
          <a-spin :spinning="loading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="demandTitle" :rules="[{ required: true, message: '请输入需求标题' }]">
                  <a-textarea class="textarea" allowClear v-model:value="formData.demandTitle" :rows="2" show-count maxlength="30" placeholder="请输入需求标题（不超过30字）" />
                  <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                </a-form-item>
                <a-form-item class="demand-title" label="原始需求描述" name="demandRemarks">
                  <CkeditorPlugin ref="ckeditorRef" height="200" />
                </a-form-item>
                <a-form-item label="应用场景描述" name="sceneDescription" :rules="[{ required: Departmentalverification(), message: '应用场景描述' }]">
                  <a-textarea show-count maxlength="1000" allowClear v-model:value="formData.sceneDescription" :rows="4" placeholder="客户应用场景、工况、约束条件等描述" />
                </a-form-item>
                <a-form-item label="原始需求价值">
                  <a-textarea show-count maxlength="1000" allowClear v-model:value="formData.demandValue" :rows="4" placeholder="需求实现后对客户及公司的价值（包含广泛性）" />
                </a-form-item>
                <a-form-item label="我司当前产品的差距/客户期望的解决方案">
                  <a-textarea
                    show-count
                    maxlength="1000"
                    allowClear
                    v-model:value="formData.productGap"
                    :rows="4"
                    placeholder="1、我司当前产品上存在的差距；2、客户是否有期望的解决方案（包含广泛性）" />
                </a-form-item>
                <a-form-item label="其他竞品/其他解决方案的描述">
                  <a-textarea show-count maxlength="1000" allowClear v-model:value="formData.otherDescriptions" :rows="4" placeholder="市面上其他竞品及其解决方案描述" />
                </a-form-item>
                <a-form-item label="预分析：">
                  <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                    <a-col :span="11">
                      <div style="display: flex; justify-content: space-between">
                        <a-form-item style="width: 48%" label="结论：" name="preAnalysisConclusion" :rules="[{ required: true, message: '请输入结论：' }]">
                          <a-select allowClear v-model:value="formData.preAnalysisConclusion" @change="preAnalysisChange">
                            <a-select-option v-for="item in preAnalysisConclusionlist" :key="item.value" :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item style="width: 48%" label="下步处理方式：" name="preAnalysisType" :rules="[{ required: true, message: '请输入下步处理方式：' }]">
                          <a-select allowClear v-model:value="formData.preAnalysisType">
                            <a-select-option v-for="item in preAnalysisTypelist" :key="item.value" :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </div>
                      <a-form-item label="修改内容记录">
                        <a-textarea show-count maxlength="1000" allowClear v-model:value="formData.preAnalysisUpdateData" :rows="3" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="11">
                      <a-form-item
                        label="意见："
                        name="preAnalysisOpinion"
                        :rules="[{ required: formData.preAnalysisType == '提交RAT分析' ? false : true, message: '请输入意见' }]">
                        <a-textarea show-count maxlength="1000" allowClear v-model:value="formData.preAnalysisOpinion" :rows="7" />
                      </a-form-item>
                      <a-button size="small" style="position: absolute; top: -2px; left: 50px" @click="ReferenceSample()" type="primary">
                        <EpcIcon type="icon-cankaowenjian" style="font-size: 15px" />
                        参考范文</a-button
                      >
                    </a-col>
                  </a-row>
                </a-form-item>
              </div>
              <!-- 右侧表单区域 -->
              <div style="width: 30%; margin-left: 5%">
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
                <a-form-item label="原始需求编号" v-if="formData.demandNum">
                  <a-input v-model:value="formData.demandNum" :disabled="true" />
                </a-form-item>
                <a-form-item label="提交人单位及职务">
                  <a-textarea v-model:value="formData.companyPosition" :rows="1" :disabled="true" />
                </a-form-item>
                <a-form-item
                  label="提交人联系方式"
                  name="phone"
                  :rules="[
                    {
                      required: true,
                      message: `${$t('请输入正确的联系方式')}`,
                      pattern: /^(1[3456789]\d{9}|0\d{2,3}-\d{7,8})$/,
                      trigger: 'blur',
                    },
                  ]">
                  <a-input show-count maxlength="11" allowClear v-model:value="formData.phone" :placeholder="'请输入提交人联系方式'" />
                </a-form-item>
                <a-form-item label="期望反馈时间" name="feedbackTime" :rules="[{ required: true, message: '请选择期望反馈时间' }]">
                  <a-date-picker
                    allowClear
                    :locale="locale"
                    :disabled-date="disabledDate"
                    v-model:value="formData.feedbackTime"
                    format="YYYY-MM-DD "
                    value-format="YYYY-MM-DD"
                    style="width: 100%; text-align: left"
                    :placeholder="'期望反馈时间'" />
                </a-form-item>
                <a-form-item label="客户名称（需求方）">
                  <a-input show-count maxlength="15" allowClear v-model:value="formData.customerName" :placeholder="'请输入客户名称'" />
                </a-form-item>
                <a-form-item label="需求来源" name="demandSource" :rules="[{ required: true, message: '请选择需求来源' }]">
                  <a-select allowClear v-model:value="formData.demandSource" placeholder="请选择需求来源">
                    <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="区域市场" name="regionalMarket" :rules="[{ required: true, message: '请选择区域市场' }]">
                  <a-select allowClear v-model:value="formData.regionalMarket" placeholder="请选择区域市场" @change="RegionChange">
                    <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="细分市场">
                  <a-select allowClear v-model:value="formData.marketSegment" placeholder="请选择细分市场">
                    <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品平台">
                  <a-select allowClear v-model:value="formData.platform" placeholder="请选择产品平台" @click="onSelectClick" @change="PlatformChange">
                    <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="产品系列">
                  <a-select allowClear v-model:value="formData.series" placeholder="请选择产品系列">
                    <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="型号">
                  <a-input show-count maxlength="35" allowClear v-model:value="formData.model" placeholder="请输入型号" />
                </a-form-item>
                <a-form-item label="一级技术学科">
                  <a-select
                    allowClear
                    v-model:value="formData.firstTechnology"
                    :max-tag-count="1"
                    mode="multiple"
                    @change="disciplineChange"
                    @blur="disciplineblur"
                    placeholder="请选择一级技术学科">
                    <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="二级技术学科">
                  <a-select allowClear v-model:value="formData.secondTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择二级技术学科">
                    <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="紧急程度" name="urgencyLevel" :rules="[{ required: true, message: '请选择紧急程度' }]">
                  <a-select allowClear v-model:value="formData.urgencyLevel" placeholder="请选择紧急程度">
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
                <a-form-item label="需求分类：" name="demandClassify2" :rules="[{ required: true, message: '请选择需求分类' }]">
                  <a-input disabled v-model:value="formData.demandClassify2" />
                  <a-button size="small" style="position: absolute; top: -30px; right: 0px" @click="browseClcik()" type="primary">
                    <EpcIcon type="icon-liulan" style="font-size: 15px" />
                    浏览</a-button
                  >
                </a-form-item>
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="变更原因">
        <div style="margin-top: 10px">
          <a-form ref="formRef1" :model="Upgradeform" :label-col="{ style: { width: '120px' } }">
            <a-form-item label="变更原因 " name="changeReason" :rules="{ required: true, message: '请填写变更原因' }">
              <a-textarea allowClear style="width: 50%" v-model:value="Upgradeform.changeReason" placeholder="请填写变更原因" />
            </a-form-item>
            <a-form-item label="上传附件" name="changeProofFileIds" :rules="{ required: true, trigger: 'blur', message: '请上传变更附件' }">
              <Uploado_draggerMoreFile
                width="50%"
                ref="changeProofFileIds"
                :file-list="Upgradeform.changeProofFileIds"
                @change="filechange($event)"
                @custom-request="customRequest($event)" />
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <template #footer>
      <a-button @click="onSubmitFormData()" type="primary">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        确定</a-button
      >
    </template>
  </a-modal>
  <a-modal style="width: 50%" v-model:visible="Samplevisible" title="参考范文">
    <a-table
      :scroll="{ x: 400, y: 400 }"
      row-key="name"
      :pagination="false"
      :data-source="SampleData"
      :columns="Samplecolumns"
      :row-selection="rowSelection"
      :customRow="customRow"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
    </a-table>
    <template #footer>
      <a-button type="primary" @click="Sampleconfirm">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        确定
      </a-button>
      <a-button type="primary" @click="Samplevisible = false">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <a-modal style="width: 80%" v-model:visible="browsevisible" title="需求分类选择">
    <a-spin :spinning="requirementloading" tip="加载中...">
      <div class="container">
        <div class="container_title">
          <h1 class="title">铁路客车产品需求分类选择器</h1>
          <p class="description">请根据您的项目需求，选择相应的需求分类。系统将帮助您构建完整的需求规格。</p>
        </div>
        <div class="content">
          <div class="left-panel">
            <h2>需求分类</h2>
            <div class="category-group" v-for="(group, index) in categoryGroups" :key="index">
              <h3>{{ group.title }}</h3>
              <div style="display: flex; flex-wrap: wrap">
                <div class="category-item" v-for="(item, catIndex) in group.categories" :key="catIndex">
                  <a-checkbox v-if="!requirementloading" v-model:checked="selectedCategories[item.value]" @change="handleCategoryChange(item)">{{ item.label }}</a-checkbox>
                </div>
              </div>
            </div>
            <a-button type="primary" @click="resetSelection">重置选择</a-button>
            <!-- <a-button class="m-left" type="primary" @click="confirmSelection">确认需求分类</a-button> -->
          </div>
          <div class="right-panel">
            <h2>已选需求</h2>
            <div class="selected-item" v-for="(selected, index) in selectedCategoriesList" :key="index">
              <div>
                <h3 style="font-weight: bold; color: #407fff">{{ selected.label }}</h3>
                <!-- <div>{{ selected.description }}</div> -->
                <div class="category-label">{{ selected.cssClass }}</div>
              </div>

              <EpcIcon type="icon-shanchu2" style="font-size: 15px" @click="removeSelected(selected)" />
            </div>
            <div class="selection-statistics">
              <h3 style="font-weight: bold; color: #407fff">选择统计:</h3>
              <p>
                已选择
                <span style="font-weight: bold; color: #407fff">
                  {{ selectedCategoriesCount }}
                </span>
                个分类
              </p>
              <p>
                核心与强制性分类:
                <span style="font-weight: bold; color: #407fff">
                  {{ coreCount }}
                </span>
              </p>
              <p>
                技术性分类:
                <span style="font-weight: bold; color: #407fff">
                  {{ techCount }}
                </span>
              </p>
              <p>
                运营与商业分类:
                <span style="font-weight: bold; color: #407fff">
                  {{ opCount }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <template #footer>
      <a-button type="primary" @click="browseconfirm">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        确定
      </a-button>
      <a-button type="primary" @click="browsevisible = false">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
</template>

<style scoped lang="less">
@import '../../.././../../../sheets/collapse.less';
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
}
.example {
  position: absolute;
  top: 40%;
  left: 50%;
}
.container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.container_title {
  height: 100px;
}
.title {
  font-size: 24px;
  margin-bottom: 10px;
}
.description {
  margin-bottom: 20px;
}
.content {
  flex: 1;
  display: flex;
}
.left-panel {
  flex: 2;
  margin-right: 20px;
}
.right-panel {
  flex: 1;
  border-left: 1px solid #e8e8e8;
  padding-left: 20px;
}
.category-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  padding: 10px;
  border-radius: 4px;
}
.category-item {
  width: 300px;
  margin-bottom: 10px;
}
.selected-item {
  border: 1px solid #e8e8e8;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selection-statistics {
  margin-top: 20px;
}
:deep(.demand-title .ant-form-item-label label::before) {
  content: ''; /* 清除默认样式（若存在） */
  color: #ff4d4f; /* Ant Design 错误色，与 required 样式统一 */
}
:deep(.demand-title .ant-form-item-label label) {
  position: relative;
  padding-left: 10px; /* 给*号预留位置 */
}
:deep(.demand-title .ant-form-item-label label::before) {
  content: '*';
  color: #ff4d4f; /* Ant Design 错误色，与 required 样式统一 */
  position: absolute;
  left: 0;
}
</style>
