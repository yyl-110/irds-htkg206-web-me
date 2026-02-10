<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { AdminApiSystemplementation } from '@/api/tags/demand/管理需求实现';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { Uploado_draggerMoreFile } from '@/components/UploadFile';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const loading = ref<any>(false);
const userStore = useUserStore();
const demandrow = ref<any>({});
const remark = ref<any>('');
const emit = defineEmits(['onClose', 'RefreshtableData']);
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const SupportingDocuments = ref<any>([]);
function filechange(file: any) {
  SupportingDocuments.value = SupportingDocuments.value.filter((item: any) => item.id !== file.id);
}

async function customRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadWordToPDF({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      SupportingDocuments.value.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}
async function handleModalSupportingDocument(row: any) {
  try {
    loading.value = true;
    SupportingDocuments.value = [];
    remark.value = '';
    demandrow.value = row;
    const res = await AdminApiSystemplementation.getUploadProof({
      taskId: row.taskId,
    });
    if (res.data.code == 200) {
      SupportingDocuments.value = res.data.data?.fileList || [];
      remark.value = res.data.data?.remark || '';
      SupportingDocuments.value.forEach((item: any) => {
        item.name = item.oldFileName;
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}
const onSubmitFormData = async (type: string) => {
  if (SupportingDocuments.value.length === 0) {
    message.error('请上传证明材料');
    return;
  }
  let fileIds: any[] = [];
  SupportingDocuments.value.forEach((item: any) => {
    fileIds.push(item.fileId || item.id);
  });
  let data = {
    taskId: demandrow.value.taskId,
    fileIds,
    remark: remark.value,
    saveStatus: 1,
  };
  if (type == 'save') {
    data.saveStatus = 1;
    Saveandsubmitform(data);
  } else {
    data.saveStatus = 2;
    Modal.confirm({
      title: `确定要提交该文件吗？`,
      okText: WeiI18n.t('确定').value,
      cancelText: WeiI18n.t('取消').value,
      async onOk() {
        Saveandsubmitform(data);
      },
    });
  }
};
async function Saveandsubmitform(data: any) {
  const res = await AdminApiSystemplementation.uploadProof(data);
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
  return document.querySelector('.ibution-detail');
}
defineExpose({ handleModalSupportingDocument });
</script>
<template>
  <div class="ibution-detail" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      style="width: 70%"
      v-model:visible="visible"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :title="'上传证明材料'"
      @cancel="cancel">
      <a-spin :spinning="loading" tip="加载中...">
        <div class="form-container">
          <div class="pagecontent-title" style="margin-left: 3%">
            <i></i>
            <span>阶段通过证明：</span>
          </div>
          <div style="margin-left: 20%">
            <Uploado_draggerMoreFile
              class="Upload"
              width="80%"
              ref="reportFileList"
              :file-list="SupportingDocuments"
              @change="filechange($event)"
              @custom-request="customRequest($event)" />
            <div class="instruction-container">
              当某一阶段所有任务内容完成以后，需由产品管理工程师进行输出物汇总，并准备相关材料进行阶段评审，如评审通过，需将评审会议纪要等阶段性证明材料进行上传，标志着此阶段工作任务已全部完成；如评审未通过需返回，重新进行修改直至评审通过为止。
            </div>
          </div>
          <div class="pagecontent-title" style="margin-left: 3%">
            <i></i>
            <span>证明材料说明：</span>
          </div>
          <div style="margin-left: 20%">
            <a-textarea style="margin-top: 20px; width: 80%" show-count maxlength="1000" allowClear v-model:value="remark" :rows="4" />
          </div>
        </div>
      </a-spin>
      <template #footer>
        <a-button @click="onSubmitFormData('save')" type="primary">
          <EpcIcon type="icon-baocun" style="font-size: 15px" />
          保存</a-button
        >
        <a-button @click="onSubmitFormData('submit')" type="primary">
          <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
          提交</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.form-container {
  height: calc(100vh - 300px);
  overflow: auto;
}
.instruction-container {
  width: 80%;
  margin-top: 20px;
  white-space: pre-wrap;
}
</style>
