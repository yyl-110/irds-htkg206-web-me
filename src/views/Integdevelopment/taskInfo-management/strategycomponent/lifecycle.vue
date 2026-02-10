<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemProductPlanningscoring } from '@/api/tags/productSpecification/管理后台产品组合策略';
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
  gaDate: string;
  eomDate: string;
  eopDate: string;
  lodspDate: string;
  eosDate: string;
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
const labelCol = ref({ style: { width: '260px' } });
// 表单数据
const formData = ref<formData>({
  id: 0,
  gaDate: '',
  eomDate: '',
  eopDate: '',
  lodspDate: '',
  eosDate: '',
});

function ClearForm() {
  formRef.value.resetFields();
  formData.value = {
    id: 0,
    gaDate: '',
    eomDate: '',
    eopDate: '',
    lodspDate: '',
    eosDate: '',
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
      formData.value = { ...row };
      loading.value = false;
    } catch (e) {
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
  Changeform();
};
async function Changeform() {
  let data: any = { ...formData.value };
  console.log(data, 'data');
  const res = await AdminApiSystemProductPlanningscoring.updatecycleList(data);
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
  return document.querySelector('.lifecycle');
}
defineExpose({ handleModalChange });
</script>
<template>
  <div class="lifecycle" v-dragModal>
    <a-modal
      style="width: 70%"
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'生命周期定义'"
      @cancel="cancel">
      <a-form layout="vertical" class="form-container" :model="formData" :label-col="labelCol">
        <div class="pagecontent-title">
          <i></i>
          <span style="font-size: 13px">生命周期设置</span>
        </div>
        <a-row style="margin-left: 9%; margin-top: 2%">
          <a-col :span="12">
            <a-form-item label="GA(正式上市)日期" name="gaDate">
              <a-date-picker  :locale="locale" v-model:value="formData.gaDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="EOM(停止市场推广)日期" name="eomDate">
              <a-date-picker  :locale="locale" v-model:value="formData.eomDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="margin-left: 9%">
          <a-col :span="12">
            <a-form-item label="EOP(停止生产)日期" name="eopDate">
              <a-date-picker  :locale="locale" v-model:value="formData.eopDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="LODSP(备件最后订购日期)" name="lodspDate">
              <a-date-picker  :locale="locale" v-model:value="formData.lodspDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="margin-left: 9%">
          <a-col :span="12">
            <a-form-item label="EOS(停止支持)日期" name="eosDate">
              <a-date-picker  :locale="locale" v-model:value="formData.eosDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 80%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
  height: calc(100vh - 380px);
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
