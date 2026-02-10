<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref } from 'vue';
import { Button, Popconfirm, message } from 'ant-design-vue';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 弹窗状态 */
  languageForm: {
    require: false,
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
}>();

/** 表单label宽度配置  */
const labelCol = ref({ style: { width: '155px' } });

/** 表单数据  */
const modelData = ref({});

/** 表单对象 */
const formRef = ref<FormInstance>();

/** 中文key 验证 */
const rules: Partial<Record<keyof any, Array<any> | any>> = {
  zh_CN: { required: true, message: '请填填写中文' },
};

/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    // modelData.value = {}
    nextTick(() => {
      if (formRef.value) {
        formRef.value!.resetFields();
      }
    });
  }
  return props.modalVisible;
});

/**
 * @description 点击确认
 */
async function handleSave() {
  formRef.value
    ?.validate()
    .then(() => {
      emit('handleSave', modelData.value);
    })
    .catch(() => {});
}

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 40%"
    :title="$t('新建语言')"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel">
    <a-form ref="formRef" :model="modelData" :label-col="labelCol" :rules="rules">
      <a-form-item v-for="(item, index) in languageForm" :key="index" :label="item.title" :name="item.dataIndex">
        <a-input v-model:value="modelData[item.dataIndex]" :placeholder="$t('请输入')" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
