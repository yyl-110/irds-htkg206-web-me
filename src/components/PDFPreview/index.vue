<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import { previewUrlFile } from '@/utils/file';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 表格数据 */
  id: {
    require: false,
    type: String,
    default: '',
  },

  /** 文档标题 */
  title: {
    require: false,
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
}>();

/** 弹窗状态 */
const visible = computed(() => {
  // 需要调用初始化接口
  return props.modalVisible;
});

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}

/** pdf 地址  */
const pdfUrl = computed(() => {
  return previewUrlFile(props.id || '');
});
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 100%"
    wrap-class-name="full-modal"
    :title="$t(title)"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :footer="null"
    :maskClosable="false"
    @cancel="cancel">
    <div id="part_modal_pdf">
      <div class="drawerContent">
        <div class="center-body">
          <a-row v-if="pdfUrl" class="iframe-body">
            <iframe width="100%" :src="`/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`" />
          </a-row>
          <Empty style="height: 78vh" v-else />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
#part_modal_pdf {
  .drawerContent {
    display: flex;
    height: calc(100vh - 107px);
    background-color: var(--main-page-background);
  }

  .center-body {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    position: relative;
    // padding: 20px;
  }

  .iframe-body {
    height: 100%;
    width: auto;
  }
}
</style>
