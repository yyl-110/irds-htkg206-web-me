<script setup lang="ts">
import dayjs from 'dayjs';
import type { UnwrapRef } from 'vue';
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { useDictStore } from '@/store/modules/dict';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemDemand } from '@/api/tags/demand/管理我的需求';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemDictType } from '@/api/tags/管理后台字典类型';
import { AdminApiSystemUserProfile } from '@/api/tags/管理后台用户个人中心';
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
  firstTechnology: undefined | string;
  secondTechnology: undefined | string;
  urgencyLevel: string;
  saveStatus: number;
}
/** 获取字典 */
const useDict = useDictStore();
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
const deptName = ref('');
const formRef = ref();
const companyPosition = ref<any>([]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const loading = ref<boolean>(false);
/** 富文本对象 */
const ckeditorRef = ref();
const visibletitle = ref<string>('新增原始需求');
const labelCol = ref({ style: { width: '260px' } });
interface OptionrItem {
  label: string;
  value: string;
}
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
  saveStatus: 1,
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
// 一级技术学科
const Atechnicaldisciplinelist = ref<OptionrItem[]>([]);
// 二级技术学科
const Twotechnicaldisciplineslist = ref<OptionrItem[]>([]);
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
function formdisabled() {
  return visibletitle.value == '原始需求';
}
// 根据产品平台匹配当前平台下的系列
function PlatformChange(value: string | undefined) {
  ProductPlatformData.value.forEach((item: any) => {
    if (value == item.id && item.children.length > 0) {
      ProductSerieslist.value = item.children.map((item: any) => ({ label: item.name, value: `${item.id}` })) || [];
    }
  });
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
    saveStatus: 1,
  };
}
const FormEcho = async (row: any) => {
  formRef.value.resetFields();
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
async function getCurrentPositionRoleList() {
  const res = await AdminApiSystemDemand.getCurrentPositionRoleList({});
  if (res.data.code == 200) {
    let data: any = res.data.data;
    companyPosition.value = [];
    if (data.length > 0) {
      data.forEach((item: any) => {
        companyPosition.value.push(item.roleName);
      });
    }
    formData.value.companyPosition = companyPosition.value.join(',');
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
 * 新增/编辑
 * @param id
 * @param title
 */
const handleModalAddOrUpdate = async (row: any, title: string) => {
  scrollIntoViewF();
  if (row) {
    visibletitle.value = title ? title : '编辑原始需求';
  } else {
    visibletitle.value = '新增原始需求';
  }
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
          resolve(getCurrentPositionRoleList());
        });
      });
  } catch (error) {
    loading.value = false;
  }
};
function scrollIntoViewF() {
  const targetElement = document.querySelector('.form-container');
  if (targetElement) {
    targetElement.scrollTop = 0;
  }
}
const onSubmitFormData = async (type: string) => {
  await formRef.value?.validate();
  if (!ckeditorRef.value.getData()) {
    message.error('原始需求描述不能为空');
    return;
  }
  formData.value.demandRemarks = ckeditorRef.value.getData();
  if (type == 'save') {
    formData.value.saveStatus = 1;
    Saveandsubmitform();
  } else {
    formData.value.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该需求吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        Saveandsubmitform();
      },
    });
  }
};
async function Saveandsubmitform() {
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
  if (formData.value.id) {
    // 修改 保存
    const res = await AdminApiSystemDemand.updatedemand(data);
    if (res.data.code == 200) {
      message.success('操作成功');
      emit('RefreshtableData');
      emit('onClose', false);
    }
  } else {
    const res = await AdminApiSystemDemand.createdemand(data);
    if (res.data.code == 200) {
      message.success('操作成功');
      emit('RefreshtableData');
      emit('onClose', false);
    }
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
  return document.querySelector('.demand-add-update');
}
defineExpose({ handleModalAddOrUpdate });
</script>
<template>
  <!-- <div class="demand-add-update" v-dragModal>
      :getContainer="customGetContainer" -->
  <a-modal style="width: 90%" v-model:visible="visible" :confirm-loading="$isPending()" :mask-closable="false" :title="visibletitle" @cancel="cancel">
    <a-form v-if="visible" ref="formRef" layout="vertical" class="form-container" :model="formData" :label-col="labelCol">
      <a-spin :spinning="loading" tip="加载中...">
        <div style="display: flex">
          <!-- 左侧表单区域 -->
          <div style="width: 60%">
            <a-form-item label="需求标题" name="demandTitle" :rules="[{ required: true, message: '请输入需求标题' }]">
              <a-textarea
                :disabled="formdisabled()"
                class="textarea"
                allowClear
                v-model:value="formData.demandTitle"
                :rows="2"
                show-count
                maxlength="30"
                placeholder="请输入需求标题（不超过30字）" />
              <h5 class="conter_title">提示：提高车辆座椅舒适性</h5>
            </a-form-item>
            <a-form-item class="demand-title" label="原始需求描述" name="demandRemarks">
              <CkeditorPlugin v-if="visibletitle != '原始需求'" ref="ckeditorRef" height="200" />
              <!-- 提交页面单独用一个 disabled 组件 -->
              <CkeditorPlugin v-else disabled ref="ckeditorRef" height="200" />
            </a-form-item>
            <a-form-item label="客户应用场景描述" name="sceneDescription" :rules="[{ required: Departmentalverification(), message: '请输入需求标题' }]">
              <a-textarea
                show-count
                maxlength="1000"
                allowClear
                :disabled="formdisabled()"
                v-model:value="formData.sceneDescription"
                :rows="4"
                placeholder="客户应用场景、工况、约束条件等描述" />
            </a-form-item>
            <a-form-item label="原始需求价值" name="demandValue">
              <a-textarea
                show-count
                maxlength="1000"
                allowClear
                :disabled="formdisabled()"
                v-model:value="formData.demandValue"
                :rows="4"
                placeholder="需求实现后对客户及公司的价值（包含广泛性）" />
            </a-form-item>
            <a-form-item label="我司当前产品的差距/客户期望的解决方案" name="productGap">
              <a-textarea
                show-count
                maxlength="1000"
                allowClear
                :disabled="formdisabled()"
                v-model:value="formData.productGap"
                :rows="4"
                placeholder="1、我司当前产品上存在的差距；2、客户是否有期望的解决方案（包含广泛性）" />
            </a-form-item>
            <a-form-item label="其他竞品/其他解决方案的描述" name="otherDescriptions">
              <a-textarea
                show-count
                maxlength="1000"
                allowClear
                :disabled="formdisabled()"
                v-model:value="formData.otherDescriptions"
                :rows="4"
                placeholder="市面上其他竞品及其解决方案描述" />
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
                    style="width: 100%; text-align: left"
                    :placeholder="'提报时间'" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="原始需求编号" v-if="formData.demandNum" name="demandNum">
              <a-input v-model:value="formData.demandNum" :disabled="true" />
            </a-form-item>
            <a-form-item label="提交人单位及职务" name="companyPosition">
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
              <a-input show-count maxlength="11" allowClear :disabled="formdisabled()" v-model:value="formData.phone" :placeholder="'请输入提交人联系方式'" />
            </a-form-item>
            <a-form-item label="期望反馈时间" name="feedbackTime" :rules="[{ required: true, message: '请选择期望反馈时间' }]">
              <a-date-picker
                allowClear
                :disabled="formdisabled()"
                :locale="locale"
                :disabled-date="disabledDate"
                v-model:value="formData.feedbackTime"
                format="YYYY-MM-DD "
                value-format="YYYY-MM-DD"
                style="width: 100%; text-align: left"
                :placeholder="'期望反馈时间'" />
            </a-form-item>
            <a-form-item label="客户名称（需求方）" name="customerName">
              <a-input show-count maxlength="15" allowClear :disabled="formdisabled()" v-model:value="formData.customerName" :placeholder="'请输入客户名称'" />
            </a-form-item>
            <a-form-item label="需求来源" name="demandSource" :rules="[{ required: true, message: '请选择需求来源' }]">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.demandSource" placeholder="请选择需求来源">
                <a-select-option v-for="item in CustomerNamelist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="区域市场" name="regionalMarket" :rules="[{ required: true, message: '请选择区域市场' }]">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.regionalMarket" placeholder="请选择区域市场" @change="RegionChange">
                <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="细分市场" name="marketSegment">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.marketSegment" placeholder="请选择细分市场">
                <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="产品平台" name="platform">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.platform" placeholder="请选择产品平台" @change="PlatformChange">
                <a-select-option v-for="item in ProductPlatformlist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="产品系列" name="series">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.series" placeholder="请选择产品系列">
                <a-select-option v-for="item in ProductSerieslist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="型号" name="model">
              <a-input show-count maxlength="35" allowClear :disabled="formdisabled()" v-model:value="formData.model" placeholder="请输入型号" />
            </a-form-item>
            <a-form-item label="一级技术学科" name="firstTechnology">
              <a-select
                allowClear
                :disabled="formdisabled()"
                v-model:value="formData.firstTechnology"
                :max-tag-count="1"
                mode="multiple"
                placeholder="请选择一级技术学科"
                @change="disciplineChange"
                @blur="disciplineblur">
                <a-select-option v-for="item in Atechnicaldisciplinelist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="二级技术学科" name="secondTechnology">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.secondTechnology" :max-tag-count="1" mode="multiple" placeholder="请选择二级技术学科">
                <a-select-option v-for="item in Twotechnicaldisciplineslist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="紧急程度" name="urgencyLevel" :rules="[{ required: true, message: '请选择紧急程度' }]">
              <a-select allowClear :disabled="formdisabled()" v-model:value="formData.urgencyLevel" placeholder="请选择紧急程度">
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

    <template #footer>
      <a-button v-if="visibletitle != '原始需求'" @click="onSubmitFormData('save')" type="primary">
        <EpcIcon type="icon-baocun" style="font-size: 15px" />
        保存</a-button
      >
      <a-button @click="onSubmitFormData('submit')" type="primary">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        提交</a-button
      >
    </template>
  </a-modal>
  <!-- </div> -->
</template>

<style scoped lang="less">
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
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
