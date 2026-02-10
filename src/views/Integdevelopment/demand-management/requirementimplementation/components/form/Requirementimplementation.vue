<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import { message, Modal } from 'ant-design-vue';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import { AdminApiSystemDemandcollect } from '@/api/tags/demand/管理需求收集';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { EpcIcon } from '@/components/icon/EpcIcon';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
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
  RefreshtableData: any;
  onClose: [visible: boolean];
}>();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const formRef = ref();
const formRef1 = ref();
const activeKey = ref<string>('1');
const demandrow = ref<any>({});
const loading = ref(false);
const originalloading = ref(false);
// 需求落实方案
const implementPlan = ref<string>('');
/** 富文本对象 */
const ckeditorRef = ref();
const ckeditorRef1 = ref();
const visibletitle = ref<string>('需求确认');
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
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
  saveStatus: 1,
  preAnalysisTypelist: '',
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
const FormEcho = async (row: any) => {
  formRef.value.resetFields();
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
const originalFormEcho = async (row: any) => {
  originalloading.value = true;
  nextTick(() => {
    formRef1.value.resetFields();
  });
  if (row) {
    try {
      const res = await AdminApiSystemDemand.getdemanddetail({ id: row.originalId });
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
        originalloading.value = false;
      }
    } catch (e) {
      originalloading.value = false;
      console.log(e);
    }
  } else {
    nextTick(() => {
      if (ckeditorRef1.value) {
        ckeditorRef1.value.setData('');
      }
    });
    ClearriginalForm();
    originalloading.value = false;
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
/**
 * @description tab切换
 * @param key tab切换key
 */
function tabChange(key: string) {
  if (key === '2') {
    originalFormEcho(demandrow.value);
  } else {
    getPreAnalysisConclusion(demandrow.value);
  }
}
/**
 * 详情
 * @param id
 */
const handleModaldetail = async (row: any) => {
  activeKey.value = '1';
  demandrow.value = row;
  implementPlan.value = row.remark;
  formRef.value.resetFields();
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
async function onSubmitFormData(type: string) {
  Modal.confirm({
    title: `确定要提交该条数据吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      const res = await AdminApiSystemplementation.taskConfirm({
        taskId: demandrow.value.taskId,
        implementPlan: implementPlan.value ? implementPlan.value : '',
      });
      if (res.data.code == 200) {
        message.success('操作成功');
        emit('RefreshtableData');
        emit('onClose', false);
      }
    },
  });
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
defineExpose({ handleModaldetail });
</script>
<template>
  <!-- <div class="demand-detail" v-dragModal>
      :getContainer="customGetContainer" -->
  <a-modal style="width: 90%" :style="{ top: '5%' }" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="visibletitle" @cancel="cancel">
    <a-tabs :tabBarStyle="tabBarStyle" v-model:active-key="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="初始需求">
        <a-form ref="formRef" layout="vertical" class="form-container" :model="formData" :label-col="labelCol">
          <a-spin :spinning="loading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="title">
                  <a-textarea disabled class="textarea" allow-clear v-model:value="formData.demandTitle" :rows="2" />
                  <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                </a-form-item>
                <a-form-item disabled label="原始需求描述" name="description">
                  <CkeditorPlugin :disabled="true" ref="ckeditorRef" height="200" />
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
                <a-form-item label="预分析：">
                  <a-row style="display: flex; justify-content: space-between; border: 1px solid #e8e8e8; padding: 10px">
                    <a-col :span="11">
                      <div style="display: flex; justify-content: space-between">
                        <a-form-item style="width: 48%" label="结论：">
                          <a-select disabled v-model:value="formData.preAnalysisConclusion" @change="preAnalysisChange">
                            <a-select-option v-for="item in preAnalysisConclusionlist" :key="item.value" :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-form-item style="width: 48%" label="下步处理方式：">
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
                <!-- </a-form-item> -->
                <a-form-item label="需求编号" v-if="formData.demandNum">
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
                <a-form-item label="需求分类：" name="demandClassify">
                  <a-input disabled v-model:value="formData.demandClassify2" />
                </a-form-item>
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="原始需求">
        <a-form ref="formRef1" layout="vertical" class="form-container" :model="beginningformData" :label-col="labelCol">
          <a-spin :spinning="originalloading" tip="加载中...">
            <div style="display: flex">
              <!-- 左侧表单区域 -->
              <div style="width: 60%">
                <a-form-item label="需求标题" name="title">
                  <a-textarea class="textarea" disabled allow-clear v-model:value="beginningformData.demandTitle" :rows="2" maxlength="30" />
                  <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
                </a-form-item>
                <a-form-item label="原始需求描述" name="description">
                  <CkeditorPlugin :disabled="true" ref="ckeditorRef1" height="200" />
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
              </div>
              <!-- 右侧表单区域 -->
              <div style="width: 30%; margin-left: 5%">
                <!-- <a-form-item label="提报信息："> -->
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
                <!-- </a-form-item> -->
                <a-form-item label="需求编号" v-if="beginningformData.demandNum">
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
              </div>
            </div>
          </a-spin>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <div style="margin-top: 20px">
      <div class="pagecontent-title">
        <i></i>
        <span>需求落实方案：</span>
      </div>
      <a-textarea class="textarea" allowClear v-model:value="implementPlan" :rows="2" />
    </div>
    <template #footer>
      <a-button @click="onSubmitFormData('save')" type="primary">
        <EpcIcon type="icon-baocun" style="font-size: 15px" />
        提交</a-button
      >
      <a-button @click="emit('onClose', false)" type="primary">
        <EpcIcon type="icon-quxiao" style="font-size: 15px" />
        取消</a-button
      >
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<style scoped lang="less">
.form-container {
  height: calc(100vh - 400px);
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
:deep(.ant-tabs-top > .ant-tabs-nav::before) {
  border-bottom: none;
}
.demand-status-page {
  padding: 10px;
}
.page-title {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
