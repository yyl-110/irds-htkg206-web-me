<script lang="ts" setup>
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { previewUrlFile } from '@/utils/file';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close']);
const title = ref('');
const content = ref('');
const pdfUrlData = ref('');
const visible = ref(false);

/** handle close */
function handleClose() {
  // 通过事件传过去
  visible.value = false;
  emit('close');
}

const getDetailFromMain = (data: any, filedata: any) => {
  title.value = data.title;
  content.value = data.content;
  if (filedata.pdfFileName) {
    pdfUrlData.value = filedata.pdfFileName;
  } else {
    pdfUrlData.value = '';
  }
  visible.value = true;
};

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.notice-detail');
}
defineExpose({ getDetailFromMain,customGetContainer });
</script>

<template>
  <div class="notice-detail" v-dragModal>
  <a-modal
    v-model:visible="visible"
    :getContainer="customGetContainer"
    style="width: 80%"
    :title="$t('公告详情')"
    :cancel-text="$t('关闭')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @cancel="handleClose">
    <h3 style="text-align: center">{{ title }}</h3>
    <div style="height: 500px">
      <iframe v-if="pdfUrlData" width="100%" height="100%" :src="`/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(pdfUrlData)}`"></iframe>
      <div v-html="content" v-else style="overflow-y: auto; height: 500px"></div>
    </div>
    <template #footer>
      <a-button key="back" @click="handleClose">关闭</a-button>
    </template>
  </a-modal>
  </div>
</template>

<style scoped>
.notice-detail {
  position: relative;
}
</style>
