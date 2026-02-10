<template>
  <div class="dialogWarp">
    <a-modal
      width="100%"
      wrapClassName="full-modal"
      v-model:visible="pageInfoArgs.pageInfoIsShow"
      :title="'页面配置：' + pageInfoArgs.rowData.pageName"
      class="page-eldialog"
      :mask-closable="false"
      @closed="closedFun">
      <PageTemplate
        ref="pageTemplateRef"
        :clearPageTemplateDate="clearPageTemplateDate"
        :checkPageInfoNewId="pageInfoArgs.rowData.id"
        :treeId="pageInfoArgs.productType"
        @reloadPageList="reloadPageList"
        @clearPageTemplatStatus="clearPageTemplatStatus"></PageTemplate>
      <template #footer>
        <span class="dialog-footer">
          <a-button type="primary" @click="closedFun"><EpcIcon type="icon-quxiao" style="font-size: 16px" />关闭</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, defineEmits, watch } from 'vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import PageTemplate from './pageTemplateInfo.vue';
const props = defineProps({
  pageInfoArgs: {
    require: false,
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['completePageInfoGetList', 'closedPageInfoDialog']);
const clearPageTemplateDate = ref(false);
const pageTemplateRef = ref<any>(null);
const reloadPageList = () => {
  emit('completePageInfoGetList');
};
const closedFun = () => {
  clearPageTemplateDate.value = true;
  emit('closedPageInfoDialog');
};
const clearPageTemplatStatus = status => {
  clearPageTemplateDate.value = status;
};

const reloadTableStyle = () => {
  getMaxListeners();
};
async function getMaxListeners() {
  nextTick(() => {
    pageTemplateRef.value.getCheckPageList2();
  });
}
defineExpose({ reloadTableStyle });
</script>
<style lang="less" scoped>
:deep(.page-eldialog .el-dialog__header) {
  border-bottom: 1px solid #e5e7ec;
  margin-right: 0;
  padding: 10px 20px;
}
:deep(.page-eldialog .el-dialog__body) {
  margin: 0;
}
:deep(.page-eldialog .el-dialog__headerbtn) {
  top: 0;
}
.dialogWarp {
  .dialog-footer {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
}
:deep(.page-eldialog .el-dialog__footer) {
  border-top: none !important;
}
</style>
