<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { AdminApiSystemchange } from '@/api/tags/demand/管理需求变更';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { ChangeTreeattribute, getSelectedNodeIds } from '@/utils/tree';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { TaskStatus, getTaskStatusLabel } from '@/enums/TaskStatus';
import { getStatusStyle } from '@/style/StatusStyle';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { Uploado_draggerMoreFile } from '@/components/UploadFile';
import { ChangeType, getDistributionteamLabel } from '@/enums/ChangeType';
import priviewFile from '@/components/PriviewFileInfo/index.vue';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
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
const changeform = reactive<any>({
  changeReason: '',
  changeConclusion: '',
  changeRejectionReason: '',
  applyChangeFileList: [],
  changeConclusionFileList: [],
});
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
const collapseactiveKey = ref<string[]>(['1', '2', '3']);
const changeformRef = ref<any>();
const originalloading = ref<boolean>(false);
const initialloading = ref<boolean>(false);
const Detailsflag = ref<boolean>(false);
const userStore = useUserStore();
const demandrow = ref<any>({});
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
    ProductPlatformlist.value = res.data.data[0].children.map((item: any) => ({ label: item.name, value: `${item.id}` })) || [];
  }
}
// 根据产品平台匹配当前平台下的系列
function PlatformChange(value: string | undefined) {
  ProductPlatformData.value.forEach((item: any) => {
    if (value == item.id && item.children.length > 0) {
      ProductSerieslist.value = item.children.map((item: any) => ({ label: item.name, value: `${item.id}` })) || [];
    }
  });
}
// 技术学科数据存储
const AtechnicaldisciplineData = ref<any>([]);
const disciplineChangeList = ref<any>([]);
const Atechnicaldisciplinelist = ref<OptionrItem[]>([]);
// 请选择一级技术学科
const Twotechnicaldisciplineslist = ref<OptionrItem[]>([]);
/** 获取技术学科 */
async function gettechnicaldisciplinesList() {
  const res = await AdminApiSystemTechnicaldisciplines.gettechnicaldisciplinesList({});
  if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
    AtechnicaldisciplineData.value = res.data.data;
    Atechnicaldisciplinelist.value = res.data.data.map((item: any) => ({ label: item.categoryName, value: `${item.id}` })) || [];
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
      Twotechnicaldisciplineslist.value.push(...(matchedBItem.children.map((item: any) => ({ label: item.categoryName, value: `${item.id}` })) || []));
    }
  });
}
async function getPreAnalysisConclusion(row: any) {
  const res = await AdminApiSystemDemandcollect.getPreAnalysisConclusion({ basicId: row.basicId });
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
      const res = await AdminApiSystemDemand.getdemanddetail({ id: row.originalId });
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
      const res = await AdminApiSystemDemandcollect.getInitDemandDetail({ basicId: row.basicId });
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
async function handleModalChange(row: any, type: string) {
  if (type == 'detail') {
    Detailsflag.value = true;
  } else {
    Detailsflag.value = false;
  }
  nextTick(() => {
    if (changeformRef.value) {
      changeformRef.value.resetFields();
    }
  });
  activeKey.value = '1';
  demandrow.value = row;
  const res = await AdminApiSystemchange.getChangeDetail({ basicId: row.basicId });
  if (res.data.code == 200) {
    let data: any = res.data.data;
    console.log(data, 'data');
    changeform.changeReason = data.changeReason || '';
    changeform.changeConclusion = data.changeConclusion || '';
    changeform.changeRejectionReason = data.changeRejectionReason || '';
    changeform.applyChangeFileList = data.applyChangeFileList || [];
    changeform.changeConclusionFileList = data.changeConclusionFileList || [];
    if (changeform.applyChangeFileList && changeform.applyChangeFileList.length > 0) {
      changeform.applyChangeFileList.forEach((item: any) => {
        item.id = item.fileId;
        item.name = item.oldFileName;
      });
    }
    if (changeform.changeConclusionFileList && changeform.changeConclusionFileList.length > 0) {
      changeform.changeConclusionFileList.forEach((item: any) => {
        item.id = item.fileId;
        item.name = item.oldFileName;
      });
    }
  }
  getVersionList();
  getFormEchodata();
}
const versionList = ref<any>([]);
async function getVersionList() {
  const res = await AdminApiSystemchange.getVersionList({ demandNum: demandrow.value.demandNum });
  if (res.data.code == 200) {
    versionList.value = res.data.data || [];
  }
}
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
async function changeVersion(version: any, type: string) {
  if (type == 'ORIGINAL') {
    FormEcho({ originalId: version.id });
  } else if (type == 'INIT') {
    await initialFormEcho({ basicId: version.id });
    getPreAnalysisConclusion({ basicId: version.id });
  }
}

const onSubmitFormData = async (type: string) => {
  await changeformRef.value?.validate();
  let fileIds: any = [];
  if (changeform.changeConclusionFileList.length > 0) {
    changeform.changeConclusionFileList.forEach((item: any) => {
      fileIds.push(item.id);
    });
  }
  let data = {
    basicId: demandrow.value.basicId,
    changeConclusion: changeform.changeConclusion || '',
    changeRejectionReason: changeform.changeRejectionReason || '',
    fileIds,
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
  const res = await AdminApiSystemchange.saveChangeConclusion(data);
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

// collapse切换
async function collapsetabChange(key: any) {
  if (key == '1') {
    FormEcho(demandrow.value);
  } else if (key == '2') {
    await initialFormEcho(demandrow.value);
    getPreAnalysisConclusion(demandrow.value);
  } else if (key == '3') {
    nextTick(() => {
      if (changeformRef.value) {
        changeformRef.value.resetFields();
      }
    });
  }
}

/**
 * @description tab切换
 * @param key tab切换key
 */
async function tabChange(key: string) {
  if (key == '1') {
    FormEcho(demandrow.value);
  } else {
    await initialFormEcho(demandrow.value);
    getPreAnalysisConclusion(demandrow.value);
  }
}

async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      changeform.changeConclusionFileList.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
function filechange(file: any) {
  changeform.changeConclusionFileList = changeform.changeConclusionFileList.filter((item: any) => item.id !== file.id);
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
defineExpose({ handleModalChange });
</script>
<template>
  <div class="acceptancec" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      style="width: 90%"
      v-model:visible="visible"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'变更分析'"
      @cancel="cancel">
      <a-collapse class="custom-collapse form-container" @change="collapsetabChange" v-model:activeKey="collapseactiveKey" :bordered="false">
        <a-collapse-panel key="1" header="原始需求/初始需求（只读）">
          <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey" @change="tabChange">
            <a-tab-pane key="1">
              <template #tab>
                原始需求
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    <EpcIcon
                      v-if="demandrow.changeType == ChangeType.ORIGINAL"
                      type="icon-xiangqing"
                      style="font-size: 18px; position: relative; top: 3px; left: 5px; color: #165dff" />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item v-for="item in versionList.originalList" :key="item.id">
                        <a @click="changeVersion(item, 'ORIGINAL')"
                          >版本 <span style="color: #4caf50">{{ item.version }}</span> {{ item.effectiveVersionFlag == 1 ? '（生效版本）' : '' }}</a
                        >
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
              <a-form ref="formRef" layout="vertical" :model="formData" :label-col="labelCol">
                <a-spin :spinning="originalloading" tip="加载中...">
                  <div style="display: flex">
                    <!-- 左侧表单区域 -->
                    <div style="width: 60%">
                      <a-form-item label="需求标题" name="demandTitle">
                        <a-textarea disabled class="textarea" v-model:value="formData.demandTitle" :rows="2" placeholder="请输入需求标题（不超过30字）" />
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
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #tab>
                初始需求
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    <EpcIcon
                      v-if="demandrow.changeType == ChangeType.INIT"
                      type="icon-xiangqing"
                      style="font-size: 18px; position: relative; top: 3px; left: 5px; color: #165dff" />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item v-for="item in versionList.initList" :key="item.id">
                        <a @click="changeVersion(item, 'INIT')"
                          >版本 <span style="color: #4caf50">{{ item.version }}</span> {{ item.effectiveVersionFlag == 1 ? '（生效版本）' : '' }}</a
                        >
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
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
            </a-tab-pane>
          </a-tabs>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="变更原因（只读）">
          <a-textarea disabled style="width: 50%; margin-top: 10px" :rows="4" v-model:value="changeform.changeReason" />
          <div class="upload-file-wrap" style="margin-left: 0px; margin-top: 10px" v-if="changeform.applyChangeFileList.length > 0">
            <div v-for="(item, index) in changeform.applyChangeFileList" :key="index">
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
                  <a-button class="elbutton" @click="priview(item)">
                    <EpcIcon type="icon-liulan" style="font-size: 15px" />
                  </a-button>
                  <!-- <a-button class="elbutton" v-if="item.fileId" disabled>
                    <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                  </a-button> -->
                </div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="变更分析结论">
          <a-form ref="changeformRef" :model="changeform" :label-col="{ style: { width: '150px' } }">
            <a-form-item label="变更结论 " name="changeConclusion" :rules="{ required: Detailsflag ? false : true, message: '请选择变更结论' }">
              <a-select allowClear :disabled="Detailsflag" :dropdown-style="{ zIndex: 2200 }" style="width: 50%" v-model:value="changeform.changeConclusion">
                <a-select-option value="同意变更">同意变更</a-select-option>
                <a-select-option value="驳回并反馈需求变更提交人">驳回并反馈需求变更提交人</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="驳回原因 " name="changeRejectionReason">
              <a-textarea
                allowClear
                :disabled="Detailsflag"
                style="width: 50%"
                :rows="2"
                v-model:value="changeform.changeRejectionReason"
                :placeholder="Detailsflag ? '' : '请填写变更驳回原因'" />
            </a-form-item>
            <a-form-item
              label="变更证明材料文件"
              name="changeConclusionFileList"
              :rules="{ required: Detailsflag ? false : true, trigger: 'blur', message: '请上传变更证明材料文件' }">
              <Uploado_draggerMoreFile
                :disabled="Detailsflag"
                width="50%"
                ref="changeProofFileIds"
                :file-list="changeform.changeConclusionFileList"
                @change="filechange($event)"
                @custom-request="customRequest($event)" />
            </a-form-item>
          </a-form>
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
  </div>
  <priviewFile ref="powerModel" :modal-visible="powVisible" :pdf-url="filePath" :file-type="fileType" @onClose="handleClosePowModal" />
</template>

<style scoped lang="less">
@import '../../../../../../assets/css/designFlow/designFlow.less';
@import '../../.././../../../sheets/collapse.less';
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>
