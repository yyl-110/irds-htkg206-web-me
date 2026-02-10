<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import { previewUrlFile } from '@/utils/file';
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
  // 需要调用初始化接口
  return props.modalVisible;
});

/**
 * @description 点击取消事件
 */
function cancel() {
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
      width="70%"
      title="附件预览"
      :confirm-loading="$isPending()"
      :ok-text="$t('确定')"
      :cancel-text="$t('取消')"
      :footer="null"
      :maskClosable="false"
      @cancel="cancel">
      <div id="part_modal_pdf">
        <div class="drawerContent">
          <div class="center-body">
            <div v-if="fileType == '.docx'" style="height: 100%; overflow: auto">
              <vue-office-docx :src="pdfUrl" />
            </div>
            <div v-else-if="fileType == '.xlsx' || fileType == '.xls'" style="height: 100%; overflow: auto">
              <vue-office-excel :src="pdfUrl" />
            </div>
            <div v-else style="height: 100%; overflow: auto">
              <vue-office-pdf :src="pdfUrl" />
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
}

#part_modal_pdf {
  .drawerContent {
    display: flex;
    height: calc(100vh - 200px);
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
