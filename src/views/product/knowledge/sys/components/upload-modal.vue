<script lang="ts" setup>
import { UploadFile } from '@/components/UploadFile';
import type { UploadChangeParam } from 'ant-design-vue';
import { ref } from 'vue';
import { Button, Popconfirm, message } from 'ant-design-vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import draggableModal from '@/components/DraggableModal/index.vue';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  /** tab状态 */
  activeKey: {
    require: true,
    type: String,
    default: '1',
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  importSuccess: [val: any];
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
  // if (props.activeKey == '1') {
  const res = await AdminApiSystemUploadFile.uploadFile({ file, userId: useUserStore().getUser.id, confidentialLevel: 1 });
  console.log('res:', res);
  if (res.data.code === 0) {
    message.success(WeiI18n.t('上传成功').value);
    emit('importSuccess', res.data);
  }
  // } else {
  //   const res = await AdminApiSystemLanguage.excelstandardImport({ file });
  //   if (res.data.code === 200) {
  //     message.success(WeiI18n.t('上传成功').value);
  //     emit('importSuccess', false);
  //   }
  // }
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
  <draggable-modal
    v-model:visible="visible"
    style="width: 40%"
    :title="$t('附件上传')"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :mask-closable="false"
    @ok="onOk"
    @cancel="cancel"
    draggable>
    <UploadFile :fileList="fileList" @change="filechange" @customRequest="customRequest" />
  </draggable-modal>
</template>
