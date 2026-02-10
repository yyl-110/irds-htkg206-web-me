<script lang="ts" setup>
import { UploadFile } from '@/components/UploadFile';
import type { UploadChangeParam } from 'ant-design-vue';
import { ref } from 'vue';
import { Button, Popconfirm, message } from 'ant-design-vue';
import { AdminApiSystemPosition } from '@/api/tags/position/管理后台岗位管理';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  /** tab类型 */
  type: {
    require: true,
    type: String,
    default: 'INTER_PART',
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  importSuccess: [visible: boolean];
}>();

/** 文件列表 */
const fileList = ref<any>([]);

/** 弹窗状态 */
const visible = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  fileList.value = [];
  return props.modalVisible;
});

/**
 * @description 导入点击确认
 */
async function onOk() {
  if (!fileList.value[0]) {
    message.warning(WeiI18n.t('请选择文件').value);
    return;
  }
  const file = fileList.value[0];
  const res = await AdminApiSystemPosition.excelImport({ file, type: props.type });
  if (res.data.code == '200') {
    message.success(WeiI18n.t('导入成功').value);
    emit('importSuccess', false);
  }
}

function cancel() {
  emit('onClose', false);
}
async function customRequest(options: any) {
  fileList.value[0] = options.file;
}
function filechange(file: any) {
  fileList.value[0] = file;
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 40%"
    :title="$t('附件上传')"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :mask-closable="false"
    @ok="onOk"
    @cancel="cancel">
    <UploadFile :fileList="fileList" @change="filechange" @customRequest="customRequest" />
  </a-modal>
</template>
