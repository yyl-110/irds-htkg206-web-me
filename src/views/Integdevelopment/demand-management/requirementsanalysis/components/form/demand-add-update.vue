<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import { TableColumnType, TableProps, Modal, message } from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { ProdProductpackageRequestDTOModel } from '@/api/models/productpackage/ProdProductpackageRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { AdminApiSystemDemandanalyze } from '@/api/tags/demand/管理需求分析';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { sortermethod } from '@/utils/tools';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const pagetype = ref('default');
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
const Upgradeform = reactive<any>({
  ipmtUpConclusion: '',
  ipmtUpRemarks: '',
  proveFileList: [],
});
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
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
  saveStatus: number;
  preAnalysisType?: string;
  preAnalysisTypelist?: string;
  preAnalysisConclusion?: string;
  preAnalysisOpinion?: string;
  preAnalysisUpdateData?: string;
}
const tablelocale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '60px', marginTop: '50px' },
  }),
});
const demandrow = ref<any>({});
const Periodicattribute = ref<string>('');
const Detailsflag = ref<boolean>(false);
const tableloading = ref<boolean>(false);
const loading = ref<boolean>(false);
const formRef = ref<any>();
const IPMTformRef = ref<any>();
const activeKey = ref<string[]>(['1', '2', '3']);
/** 富文本对象 */
const ckeditorRef = ref();
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
// 产品平台
const ProductPlatformData = ref<any>([]);
const basicId = ref<string>('');
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
const preAnalysisConclusionlist = ref<OptionrItem[]>([
  { label: '有效需求', value: '有效需求' },
  { label: '无效需求', value: '无效需求' },
]);
const preAnalysisTypelist = ref<OptionrItem[]>([]);

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
      { label: '中国铁路哈尔滨局集团有限公司', value: '中国铁路哈尔滨局集团有限公司' },
      { label: '中国铁路沈阳局集团有限公司', value: '中国铁路沈阳局集团有限公司' },
      { label: '中国铁路北京局集团有限公司', value: '中国铁路北京局集团有限公司' },
      { label: '中国铁路太原局集团有限公司', value: '中国铁路太原局集团有限公司' },
      { label: '中国铁路呼和浩特局集团有限公司', value: '中国铁路呼和浩特局集团有限公司' },
      { label: '中国铁路济南局集团有限公司', value: '中国铁路济南局集团有限公司' },
      { label: '中国铁路上海局集团有限公司', value: '中国铁路上海局集团有限公司' },
      { label: '中国铁路郑州局集团有限公司', value: '中国铁路郑州局集团有限公司' },
      { label: '中国铁路武汉局集团有限公司', value: '中国铁路武汉局集团有限公司' },
      { label: '中国铁路西安局集团有限公司', value: '中国铁路西安局集团有限公司' },
      { label: '中国铁路兰州局集团有限公司', value: '中国铁路兰州局集团有限公司' },
      { label: '中国铁路乌鲁木齐局集团有限公司', value: '中国铁路乌鲁木齐局集团有限公司' },
      { label: '中国铁路青藏集团有限公司', value: '中国铁路青藏集团有限公司' },
      { label: '中国铁路广州局集团有限公司', value: '中国铁路广州局集团有限公司' },
      { label: '中国铁路成都局集团有限公司', value: '中国铁路成都局集团有限公司' },
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
/** 获取技术学科 */
async function gettechnicaldisciplinesList() {
  const res = await AdminApiSystemTechnicaldisciplines.gettechnicaldisciplinesList({});
  if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
    AtechnicaldisciplineData.value = res.data.data;
    Atechnicaldisciplinelist.value = res.data.data.map((item: any) => ({ label: item.categoryName, value: `${item.id}` })) || [];
  }
}
function ClearForm() {
  // formRef.value.resetFields();
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
    saveStatus: 1,
    preAnalysisConclusion: '',
    preAnalysisType: '',
    preAnalysisOpinion: '',
    preAnalysisUpdateData: '',
  };
}
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
const FormEcho = async (row: any) => {
  ClearForm();
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
async function ipmtDecisionDetail(row: any) {
  const res = await AdminApiSystemDemandanalyze.ipmtDecisionDetail({ basicId: row.basicId });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    Upgradeform.proveFileList = data.proveFileList || [];
    Upgradeform.ipmtUpRemarks = data.ipmtUpRemarks || [];
    Upgradeform.ipmtUpConclusion = data.ipmtUpConclusion || '';
    if (Upgradeform.proveFileList.length > 0) {
      Upgradeform.proveFileList.forEach((item: any) => {
        item.id = item.fileId;
        item.name = item.oldFileName;
        item.fileType = item.oldFileName.split('.').pop();
      });
    }
  }
}
function linkClick(url: string) {
  window.open(url);
}

const handleModalAddOrUpdate = async (row: any, type: string) => {
  if (type == 'edit') {
    Detailsflag.value = false;
  } else {
    Detailsflag.value = true;
  }
  pagetype.value = type;
  demandrow.value = row;
  getListData(row);
  getFormEchodata();
  if (type == 'detail-IPMT') {
    ipmtDecisionDetail(row);
  }
};
function getFormEchodata() {
  loading.value = true;
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
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          resolve(getPreAnalysisConclusion(demandrow.value));
        });
      });
  } catch (error) {
    loading.value = false;
  }
}
const onSubmitFormData = async (type: string) => {
  if (!Periodicattribute.value) {
    message.error('请选择周期属性');
    return;
  }
  let data = {
    basicId: basicId.value,
    periodicAttribute: Periodicattribute.value,
    packageList: packageList.value,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    savePackageType(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该条数据吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        savePackageType(data);
      },
    });
  }
};
async function savePackageType(data: any) {
  const res = await AdminApiSystemDemandanalyze.savePackageType(data);
  if (res.data.code == 200) {
    message.success('操作成功');
    emit('RefreshtableData');
    emit('onClose', false);
  }
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
const productpackageData = ref<any>([]);
const productpackagecolumns = ref<any>([
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
    title: WeiI18n.t('类别名称').value,
    dataIndex: 'packageName',
    key: 'packageName',
    minWidth: 150,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
    customCell: (record: any, index: any) => {
      let obj: any = {};
      // 查找相同值的行数
      let rowSpan = 1;
      for (let i = index + 1; i < productpackageData.value.length; i++) {
        if (productpackageData.value[i].packageName === record.packageName) {
          rowSpan++;
        } else {
          break;
        }
      }
      // 如果不是第一个相同值的行，则隐藏单元格
      if (index > 0 && productpackageData.value[index - 1].packageName === record.packageName) {
        obj.rowSpan = 0;
      } else {
        obj.rowSpan = rowSpan;
      }

      return obj;
    },
  },
  {
    title: WeiI18n.t('类别说明').value,
    dataIndex: 'packageRemarks',
    key: 'packageRemarks',
    minWidth: 200,
    resizable: true,
    sortDirections: ['descend', 'ascend'],
    customCell: (record: any, index: any) => {
      let obj: any = {};
      // 查找相同值的行数
      let rowSpan = 1;
      for (let i = index + 1; i < productpackageData.value.length; i++) {
        if (productpackageData.value[i].packageRemarks === record.packageRemarks) {
          rowSpan++;
        } else {
          break;
        }
      }
      // 如果不是第一个相同值的行，则隐藏单元格
      if (index > 0 && productpackageData.value[index - 1].packageRemarks === record.packageRemarks) {
        obj.rowSpan = 0;
      } else {
        obj.rowSpan = rowSpan;
      }

      return obj;
    },
  },
  {
    title: WeiI18n.t('项点').value,
    dataIndex: 'vertexName',
    key: 'vertexName',
    width: 200,
    align: 'center',
    resizable: true,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('适用/不适用').value,
    align: 'center',
    key: 'applicable',
    dataIndex: 'applicable',
    width: 200,
  },
]);
/** 列表请求参数 */
const requestParams = reactive(new ProdProductpackageRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const packageList = ref([]);

async function getListData(row: any) {
  tableloading.value = true;
  try {
    const res = await AdminApiSystemDemandanalyze.getPackageType({ basicId: row.basicId });
    if (res.data.code == 200) {
      tableloading.value = false;
      let tabledata: any = res.data.data;
      basicId.value = tabledata.basicId;
      let data: any = tabledata.packageList;
      packageList.value = tabledata.packageList;
      Periodicattribute.value = tabledata.periodicAttribute;
      productpackageData.value = [];
      // 遍历外层数组（假设packageList可能有多个元素）
      data.forEach((item: any) => {
        // 提取外层需要合并的属性
        const outerProps = {
          packageTypeId: item.packageTypeId,
          packageName: item.packageName,
          packageRemarks: item.packageRemarks,
          packageSortIndex: item.sortIndex, // 避免与子对象sortIndex冲突，可重命名
        };
        // 合并到内层每个对象
        item.packageItemList.forEach((ite: any) => {
          Object.assign(ite, outerProps); // 直接修改原对象
        });
        productpackageData.value.push(...item.packageItemList);
      });
    }
  } finally {
    tableloading.value = false;
  }
}
// collapse切换
function collapsetabChange(key: any) {}
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

const tabBarStyle = {
  position: 'sticky', // 关键属性：粘滞定位
  width: '0',
  zIndex: 10, // 避免被内容遮挡
  background: '#fff', // 背景色覆盖下方内容
};
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.demand-add-updatealysis');
}
defineExpose({ handleModalAddOrUpdate });
</script>
<template>
  <!-- <div class="demand-add-updatealysis" v-dragModal> -->
  <!-- :zIndex="2000" -->
  <a-modal
    style="width: 90%"
    v-model:visible="visible"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    :title="Detailsflag ? $t('需求处理详情') : '需求处理'"
    @cancel="cancel">
    <a-collapse class="custom-collapse form-container" @change="collapsetabChange" v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1" header="产品包属性">
        <!-- :row-selection="rowSelection" :customRow="customRow" -->
        <a-table
          bordered
          style="margin-top: 5px"
          :scroll="{ x: 300 }"
          row-key="name"
          :loading="tableloading"
          :locale="tablelocale"
          :pagination="false"
          :data-source="productpackageData"
          :columns="productpackagecolumns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'vertexName'">
              <a-row>
                <a-col :span="20">
                  <sapn>{{ record.vertexName }}</sapn>
                </a-col>
                <a-col :span="4">
                  <a-tooltip>
                    <template #title>{{ record.remarks }}</template>
                    <EpcIcon type="icon-xiangqing" style="font-size: 18px; color: #165dff" />
                  </a-tooltip>
                </a-col>
              </a-row>
            </template>
            <template v-if="column.dataIndex === 'applicable'">
              <a-radio :disabled="Detailsflag" v-model:checked="record.applyFlag" @click="record.applyFlag = !record.applyFlag"></a-radio>
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="周期属性">
        <div style="margin-top: 10px">
          <a-radio-group :disabled="Detailsflag" v-model:value="Periodicattribute" name="radioGroup">
            <a-radio :value="1">小于1年</a-radio>
            <a-radio :value="2">1-3年</a-radio>
            <a-radio :value="3">大于3年</a-radio>
          </a-radio-group>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="初始需求（只读）">
        <a-form ref="formRef" layout="vertical" :model="formData" :label-col="labelCol">
          <a-spin :spinning="loading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="demandTitle">
                  <a-textarea disabled class="textarea" allow-clear v-model:value="formData.demandTitle" :rows="2" placeholder="请输入需求标题（不超过30字）" />
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
                <a-form-item label="预分析：">
                  <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                    <a-col :span="11">
                      <div style="display: flex; justify-content: space-between">
                        <a-form-item style="width: 48%" label="结论：" name="preAnalysisConclusion">
                          <a-select disabled v-model:value="formData.preAnalysisConclusion" @change="preAnalysisChange">
                            <a-select-option v-for="item in preAnalysisConclusionlist" :key="item.value" :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item style="width: 48%" label="下步处理方式：" name="preAnalysisType">
                          <a-select disabled v-model:value="formData.preAnalysisType">
                            <a-select-option v-for="item in preAnalysisTypelist" :key="item.value" :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </div>
                      <a-form-item label="修改内容记录">
                        <a-textarea disabled v-model:value="formData.preAnalysisUpdateData" :rows="3" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="11">
                      <a-form-item label="意见：" name="preAnalysisOpinion">
                        <a-textarea disabled v-model:value="formData.preAnalysisOpinion" :rows="7" />
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
                  <a-select disabled v-model:value="formData.regionalMarket" placeholder="请选择区域市场" @change="RegionChange">
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
                  <a-select disabled v-model:value="formData.platform" placeholder="请选择产品平台" @click="onSelectClick" @change="PlatformChange">
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
                  <a-select
                    disabled
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
                <a-form-item label="需求分类：" name="demandClassify2">
                  <a-input disabled v-model:value="formData.demandClassify2" />
                </a-form-item>
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel v-if="pagetype == 'detail-IPMT'" key="4" header=" IPMT决策结果">
        <div style="margin-top: 10px">
          <a-form ref="IPMTformRef" :model="Upgradeform" :label-col="{ style: { width: '120px' } }">
            <a-form-item label="IPMT决策结论 " name="ipmtUpConclusion" :rules="{ required: true, message: '请选择决策结论' }">
              <a-select :dropdown-style="{ zIndex: 2200 }" disabled style="width: 50%" v-model:value="Upgradeform.ipmtUpConclusion">
                <a-select-option value="同意发布分析结论">同意发布分析结论</a-select-option>
                <a-select-option value="其他结论">不同意分析结论</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="决策描述 " name="ipmtUpRemarks">
              <a-textarea disabled style="width: 50%" v-model:value="Upgradeform.ipmtUpRemarks" placeholder="请输入IPMT决策结论详细描述" />
            </a-form-item>
            <a-form-item label="决策证明材料 " name="proveFileList" :rules="{ required: true, trigger: 'blur', message: '请上传决策证明材料文件' }">
              <div class="upload-file-wrap" style="margin-left: 0px">
                <div v-for="(item, index) in Upgradeform.proveFileList" :key="index">
                  <div class="file-list" v-if="item.filePath">
                    <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
                    <div class="file-dec">
                      <div class="tit">{{ item.oldFileName }}</div>
                      <div class="number">
                        <span>文件类型：{{ item.fileType }}</span>
                        <div class="hover-link" @click="linkClick(item.filePath)">链接：{{ item.filePath }}</div>
                      </div>
                      <a-button class="elbutton" v-if="item.id" disabled>
                        <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <template #footer>
      <a-button v-if="!Detailsflag" @click="onSubmitFormData('save')" type="primary">
        <EpcIcon type="icon-baocun" style="font-size: 15px" />
        保存</a-button
      >
      <a-button v-if="!Detailsflag" @click="onSubmitFormData('submit')" type="primary">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        提交</a-button
      >
      <a-button v-if="Detailsflag" @click="cancel()" type="primary">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<style scoped lang="less">
@import '../../../../../../assets/css/designFlow/designFlow.less';
@import '../../.././../../../sheets/collapse.less';
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}

.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
}
:deep(.hover-link) {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
