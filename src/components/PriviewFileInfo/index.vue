<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';
import { FullscreenOutlined, FullscreenExitOutlined, CloseOutlined } from '@ant-design/icons-vue';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
import VueOfficeDocx from '@vue-office/docx';
import '@vue-office/docx/lib/index.css';
import '@vue-office/excel/lib/index.css';
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

  pdfUrl: {
    require: false,
    type: String,
    default: '',
  },

  fileType: {
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
  return props.modalVisible;
});

const isFullscreen = ref(false);
const previewKey = ref(0);

const modalWidth = computed(() => (isFullscreen.value ? '100%' : '70%'));

const contentHeight = computed(() => (isFullscreen.value ? '100%' : 'calc(100vh - 200px)'));

/** 容器尺寸变化后重新挂载预览组件，使 excel/pdf 等按新宽度渲染 */
function refreshPreview() {
  nextTick(() => {
    setTimeout(() => {
      previewKey.value += 1;
    }, 300);
  });
}

watch(
  () => props.modalVisible,
  val => {
    if (!val) {
      isFullscreen.value = false;
      previewKey.value = 0;
    }
  },
);

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  refreshPreview();
}

/**
 * @description 点击取消事件
 */
function cancel() {
  isFullscreen.value = false;
  emit('onClose', false);
}

function customGetContainer() {
  return document.querySelector('.priviewFileInfoIndex');
}
</script>

<template>
  <div class="priviewFileInfoIndex" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      :width="modalWidth"
      :closable="false"
      :wrap-class-name="isFullscreen ? 'priview-file-fullscreen-wrap' : ''"
      :confirm-loading="$isPending()"
      :ok-text="$t('确定')"
      :cancel-text="$t('取消')"
      :footer="null"
      :maskClosable="false"
      @cancel="cancel">
      <template #title>
        <div class="priview-file-modal-title">
          <span>附件预览</span>
          <span class="priview-file-modal-actions">
            <fullscreen-outlined v-if="!isFullscreen" class="priview-file-modal-icon" @click="toggleFullscreen" />
            <fullscreen-exit-outlined v-else class="priview-file-modal-icon" @click="toggleFullscreen" />
            <close-outlined class="priview-file-modal-icon" @click="cancel" />
          </span>
        </div>
      </template>
      <div id="part_modal_pdf">
        <div class="drawerContent" :style="{ height: contentHeight }">
          <div class="center-body">
            <div v-if="fileType == '.docx'" class="preview-file-wrap">
              <vue-office-docx :key="previewKey" :src="pdfUrl" />
            </div>
            <div v-else-if="fileType == '.xlsx' || fileType == '.xls'" class="preview-file-wrap">
              <vue-office-excel :key="previewKey" :src="pdfUrl" />
            </div>
            <div v-else class="preview-file-wrap">
              <vue-office-pdf :key="previewKey" :src="pdfUrl" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.priviewFileInfoIndex {
  position: relative;
  z-index: 2000; /* 确保模态框内容显示在遮罩层上方 */

  :deep(.ant-modal-header .ant-modal-title) {
    width: 100%;
  }
}

#part_modal_pdf {
  width: 100%;
  height: 100%;

  .drawerContent {
    display: flex;
    width: 100%;
    background-color: var(--main-page-background);
  }

  .center-body {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    position: relative;
  }

  .preview-file-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  :deep(.vue-office-excel),
  :deep(.vue-office-pdf),
  :deep(.vue-office-docx) {
    width: 100%;
    height: 100%;
  }

  :deep(.vue-office-excel-main) {
    width: 100%;
    height: 100%;
  }

  .iframe-body {
    height: 100%;
    width: auto;
  }
}

.priview-file-modal-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 4px;
}

.priview-file-modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.priview-file-modal-icon {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  transition: color 0.2s;

  &:hover {
    color: rgba(0, 0, 0, 0.75);
  }
}
</style>

<style lang="less">
.priview-file-fullscreen-wrap {
  padding: 0 !important;

  .ant-modal {
    top: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .ant-modal-content {
    height: 100%;
    border-radius: 0;
    display: flex;
    flex-direction: column;
  }

  .ant-modal-header {
    flex-shrink: 0;
  }

  .ant-modal-body {
    flex: 1;
    min-height: 0;
    padding: 0;
    overflow: hidden;

    #part_modal_pdf {
      height: 100%;

      .drawerContent {
        height: 100% !important;
      }
    }
  }
}
</style>
