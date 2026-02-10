<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  allocation: {
    require: false,
    type: Object,
    default: () => {},
  },
});
interface formData {
  id: number;
  productPlatform: string;
  mainProduct: string;
  productName: string;
  version: string;
  feature: string;
  characteristics: string;
  projectInitiationDate: string;
  designDate: string;
  prototypeDate: string;
  productLaunchDate: string;
}
interface resourceformData {
  id: number;
  overallVehicle: string;
  vehicleEndConnection: string;
  contents: string;
  body: string;
  frontEnd: string;
  caDoor: string;
  bogie: string;
  braking: string;
  carEquipment: string;
  carWindow: string;
  airConditioner: string;
  serviceFacilities: string;
  underCar: string;
  powerSupply: string;
  traction: string;
  assistance: string;
  passenger: string;
  cabinet: string;
  lighting: string;
  fireworks: string;
  inVehicle: string;
  roofWiring: string;
  interiorWiring: string;
  underboardWiring: string;
}
const userStore = useUserStore();
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  RefreshtableData: any;
}>();
const activeKey = ref<string[]>(['1', '2']);
const formRef = ref();
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
  }
  return props.modalVisible;
});
const loading = ref<boolean>(false);
const visibletitle = ref<string>('分配资源');
const labelCol = ref({ style: { width: '260px' } });
// 表单数据
const formData = ref<formData>({
  id: 0,
  productPlatform: '',
  mainProduct: '',
  productName: '',
  version: '',
  feature: '',
  characteristics: '',
  projectInitiationDate: '',
  designDate: '',
  prototypeDate: '',
  productLaunchDate: '',
});
// 表单数据
const resourceformData = ref<resourceformData>({
  id: 0,
  overallVehicle: '',
  vehicleEndConnection: '',
  contents: '',
  body: '',
  frontEnd: '',
  caDoor: '',
  bogie: '',
  braking: '',
  carEquipment: '',
  carWindow: '',
  airConditioner: '',
  serviceFacilities: '',
  underCar: '',
  powerSupply: '',
  traction: '',
  assistance: '',
  passenger: '',
  cabinet: '',
  lighting: '',
  fireworks: '',
  inVehicle: '',
  roofWiring: '',
  interiorWiring: '',
  underboardWiring: '',
});

function ClearForm() {
  formRef.value.resetFields();
  resourceformData.value = {
    id: 0,
    overallVehicle: '',
    vehicleEndConnection: '',
    contents: '',
    body: '',
    frontEnd: '',
    caDoor: '',
    bogie: '',
    braking: '',
    carEquipment: '',
    carWindow: '',
    airConditioner: '',
    serviceFacilities: '',
    underCar: '',
    powerSupply: '',
    traction: '',
    assistance: '',
    passenger: '',
    cabinet: '',
    lighting: '',
    fireworks: '',
    inVehicle: '',
    roofWiring: '',
    interiorWiring: '',
    underboardWiring: '',
  };
}

/**
 * 详情
 * @param id
 * @param parentId
 */
const handleModalChange = async (row: any, title: string) => {
  if (row) {
    try {
      const resv = await AdminApiSystemProductPlanningscoring.combinationGetDetail({ id: row.combinationId });
      const res = await AdminApiSystemProductPlanningscoring.allocationDetail({ id: row.id });
      let data: any = res.data;
      if (data.code == 200) {
        resourceformData.value = { ...data.data };
        formData.value = { ...resv.data.data };
        loading.value = false;
      }
    } catch (e) {
      loading.value = false;
      console.log(e);
    } finally {
      loading.value = false;
    }
  } else {
    ClearForm();
    loading.value = false;
  }
};
const onSubmitFormData = async (type: string) => {
  await formRef.value?.validate();
  Modal.confirm({
    title: `确定要分配资源吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      Changeform();
    },
  });
};
async function Changeform() {
  let data: any = { ...resourceformData.value };
  console.log(data, 'data');
  const res = await AdminApiSystemProductPlanningscoring.updateallocation(data);
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
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.allocateresources');
}
defineExpose({ handleModalChange });
</script>
<template>
  <div class="allocateresources" v-dragModal>
    <a-modal
      style="width: 70%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="visibletitle"
      @cancel="cancel">
      <a-collapse class="custom-collapse form-container" v-model:activeKey="activeKey" :bordered="false" :defaultActiveKey="['1', '2', '3', '4', '5', '6']">
        <a-collapse-panel key="1" header="基本信息">
          <a-form layout="vertical" :model="formData" :label-col="labelCol">
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">产品信息</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="12">
                <a-form-item label="产品平台" name="productPlatform">
                  <a-input disabled v-model:value="formData.productPlatform" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="主型产品" name="mainProduct">
                  <a-input disabled v-model:value="formData.mainProduct" :style="{ width: '80%' }" allowClear />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="12">
                <a-form-item label="产品名称" name="productName">
                  <a-input disabled v-model:value="formData.productName" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="版本" name="version">
                  <a-input disabled v-model:value="formData.version" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">产品描述</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="12">
                <a-form-item label="技术特征" name="feature">
                  <a-input disabled v-model:value="formData.feature" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="功能特征" name="characteristics">
                  <a-input disabled v-model:value="formData.characteristics" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">开发阶段 (里程碑)</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="12">
                <a-form-item label="立项日期" name="projectInitiationDate">
                  <a-date-picker disabled :locale="locale" v-model:value="formData.projectInitiationDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="设计日期" name="designDate">
                  <a-date-picker disabled :locale="locale" v-model:value="formData.designDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="12">
                <a-form-item label="样机试制日期" name="prototypeDate">
                  <a-date-picker disabled :locale="locale" v-model:value="formData.prototypeDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="产品发布日期" name="productLaunchDate">
                  <a-date-picker disabled :locale="locale" v-model:value="formData.productLaunchDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="资源分配">
          <a-form ref="formRef" layout="vertical" :model="resourceformData" :label-col="labelCol">
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">{{ `车辆总体(${allocation?.totalDesignerCount})` }}</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="车辆总体" name="overallVehicle">
                  <a-input-number v-model:value="resourceformData.overallVehicle" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">{{ `车辆机械(${allocation?.mechanicalDesignerCount})` }}</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="车端连接" name="vehicleEndConnection">
                  <a-input v-model:value="resourceformData.vehicleEndConnection" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="内装" name="contents">
                  <a-input v-model:value="resourceformData.contents" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车体" name="body">
                  <a-input v-model:value="resourceformData.body" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="前端" name="frontEnd">
                  <a-input v-model:value="resourceformData.frontEnd" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车门" name="caDoor">
                  <a-input v-model:value="resourceformData.caDoor" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="转向架" name="bogie">
                  <a-input v-model:value="resourceformData.bogie" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="制动" name="braking">
                  <a-input v-model:value="resourceformData.braking" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车内设备" name="carEquipment">
                  <a-input v-model:value="resourceformData.carEquipment" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车窗" name="carWindow">
                  <a-input v-model:value="resourceformData.carWindow" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="空调" name="airConditioner">
                  <a-input v-model:value="resourceformData.airConditioner" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务设施" name="serviceFacilities">
                  <a-input v-model:value="resourceformData.serviceFacilities" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车下结构" name="underCar">
                  <a-input v-model:value="resourceformData.underCar" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="pagecontent-title">
              <i></i>
              <span style="font-size: 13px">{{ `车辆电气(${allocation?.electricalDesignerCount})` }}</span>
            </div>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="主供电" name="powerSupply">
                  <a-input v-model:value="resourceformData.powerSupply" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="牵引" name="traction">
                  <a-input v-model:value="resourceformData.traction" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="辅助" name="assistance">
                  <a-input v-model:value="resourceformData.assistance" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="旅客信息" name="passenger">
                  <a-input v-model:value="resourceformData.passenger" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="屏柜" name="cabinet">
                  <a-input v-model:value="resourceformData.cabinet" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="照明系统" name="lighting">
                  <a-input v-model:value="resourceformData.lighting" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="烟火系统" name="fireworks">
                  <a-input v-model:value="resourceformData.fireworks" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车载设备" name="inVehicle">
                  <a-input v-model:value="resourceformData.inVehicle" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车顶布线" name="roofWiring">
                  <a-input v-model:value="resourceformData.roofWiring" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left: 9%">
              <a-col :span="8">
                <a-form-item label="车内布线" name="interiorWiring">
                  <a-input v-model:value="resourceformData.interiorWiring" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车下布线" name="underboardWiring">
                  <a-input v-model:value="resourceformData.underboardWiring" placeholder="请输入" :style="{ width: '80%' }" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-collapse-panel>
      </a-collapse>
      <template #footer>
        <a-button @click="onSubmitFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
@import '../../../../sheets/collapse.less';
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.conter_title {
  margin-top: 5px;
  font-weight: bold; /* 等同于 700，标准加粗 */
}
.pagecontent-title {
  margin-bottom: 0px;
}
</style>
