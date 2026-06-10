<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import type { FormInstance } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { handleEpcDownload } from '@/utils/file';
import UploadModal from '@/views/product/components/upload-modal.vue';
import ActivityTemplatePageFields from './activity-template-page-fields.vue';
import { useActivityPageTypeDict } from './useActivityPageTypeDict';

export default defineComponent({
  name: 'NoticeData',
  components: { UploadModal, ActivityTemplatePageFields },
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed({
      get: () => props.modalVisible,
      set: (val: boolean) => {
        if (!val) context.emit('close');
      },
    });

    const { displayPropTypeList, loadPageTypeDict, isTemplatePageType, selectPopupContainer } = useActivityPageTypeDict();
    const pageTypeSelectRef = ref<{ blur?: () => void } | null>(null);
    const templateFieldsVisible = ref(false);
    const formRef = ref<FormInstance>();
    const userStore = useUserStore();
    const id = ref(0);
    const remark = ref('');
    const categoryid = ref('');
    const unitId = ref<any>();
    const excelFileList = ref<any[]>([]);
    const wordFileList = ref<any[]>([]);
    const jsFileList = ref<any[]>([]);
    const openExcelUploadModal = ref(false);
    const openWordUploadModal = ref(false);
    const openJsUploadModal = ref(false);
    const excelConfidentialLevel = ref(1);
    const wordConfidentialLevel = ref(1);
    const jsConfidentialLevel = ref(1);
    const formData = ref({
      pageName: '',
      pageType: '1',
      groupName: '',
      url: '',
      excelId: '',
      wordId: '',
      jsId: '',
      auditProcess: '',
      isSynergy: '0',
      tempNum: '',
    });
    const showTemplatePageFields = computed(() => isTemplatePageType(formData.value.pageType));

    function onPageTypeChange() {
      nextTick(() => pageTypeSelectRef.value?.blur?.());
    }

    watch(showTemplatePageFields, show => {
      if (!show) {
        templateFieldsVisible.value = false;
        return;
      }
      nextTick(() => {
        templateFieldsVisible.value = true;
      });
    });

    /** handle close */
    const handleClose = () => {
      context.emit('close');
    };

    /** handle close */
    async function updatePageInfo() {
      // 调用保存接口
      await formRef.value?.validate();
      // 保存页面信息
      const data: any = {};
      data.id = id.value;
      data.pageName = formData.value.pageName;
      data.pageType = formData.value.pageType;
      data.groupName = formData.value.groupName;
      data.remark = remark.value;
      data.treeId = categoryid.value;
      data.calculateFileId = formData.value.excelId;
      data.jsFileId = formData.value.jsId || null;
      if (formData.value.pageType === '2') {
        data.reportFileId = formData.value.wordId;
      }
      data.url = formData.value.url;
      if (isTemplatePageType(formData.value.pageType)) {
        data.auditProcess = formData.value.auditProcess;
        data.isSynergy = formData.value.isSynergy;
        data.tempNum = formData.value.tempNum;
      }
      console.log(data);
      const res = await AdminApiActivityPage.updateActivityInfo(data);
      //刷新父页面列表数据
      context.emit('refresh-table-data');
      // //关闭当前窗口
      context.emit('close');
    }

    function normalizeUploadFile(fileInfo: any) {
      if (!fileInfo) return null;
      const uid = fileInfo.fileId || fileInfo.id || `${Date.now()}`;
      const name = fileInfo.oldFileName || fileInfo.name || fileInfo.fileName || '未命名文件';
      const url = fileInfo.filePath || '';
      return {
        uid: String(uid),
        id: fileInfo.fileId || fileInfo.id || '',
        name,
        status: 'done',
        url,
        oldFileName: fileInfo.oldFileName,
        fileName: fileInfo.fileName,
        filePath: fileInfo.filePath,
      };
    }

    //初始化数据
    const infoReload = (data: any, categoryidStr: string) => {
      id.value = data.id;
      formData.value.pageName = data.pageName;
      formData.value.pageType = String(data.pageType ?? '1');
      formData.value.url = data.url;
      formData.value.groupName = data.groupName;
      formData.value.excelId = data.calculateFileId;
      formData.value.wordId = data.reportFileId;
      formData.value.jsId = data.jsFileId != null ? String(data.jsFileId) : '';
      formData.value.auditProcess = data.auditProcess ?? '';
      formData.value.isSynergy = data.isSynergy != null && data.isSynergy !== '' ? String(data.isSynergy) : '0';
      formData.value.tempNum = data.tempNum ?? '';
      const excelFile = normalizeUploadFile(data.calculateFileInfo);
      const wordFile = normalizeUploadFile(data.reportFileInfo);
      const jsFile = normalizeUploadFile(data.jsFileInfo);
      excelFileList.value = excelFile ? [excelFile] : [];
      wordFileList.value = wordFile ? [wordFile] : [];
      jsFileList.value = jsFile ? [jsFile] : [];
      remark.value = data.remark;
      categoryid.value = categoryidStr;
      if (isTemplatePageType(formData.value.pageType)) {
        nextTick(() => {
          templateFieldsVisible.value = true;
        });
      } else {
        templateFieldsVisible.value = false;
      }
      void loadPageTypeDict();
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.activity-upload');
    }

    function isExcelFile(fileName = '') {
      const lowerName = fileName.toLowerCase();
      return lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx');
    }

    function isWordFile(fileName = '') {
      const lowerName = fileName.toLowerCase();
      return lowerName.endsWith('.doc') || lowerName.endsWith('.docx');
    }

    function isJsFile(fileName = '') {
      const lowerName = fileName.toLowerCase();
      return lowerName.endsWith('.js');
    }

    async function customRequestExcel(options: any) {
      const fileName = options?.file?.name || '';
      if (!isExcelFile(fileName)) {
        message.warning('请上传Excel文件（.xls/.xlsx）');
        options?.onError?.(new Error('invalid excel file'));
        return;
      }
      const res = await AdminApiSystemUploadFile.uploadFile({
        file: options.file as File,
        userId: userStore.getUser.id,
        confidentialLevel: 1,
      });
      if (res.data.code == 0) {
        const file: any = {
          uid: String(res.data?.id || Date.now()),
          id: res.data?.id || '',
          name: res.data?.oldFileName || options?.file?.name || 'excel',
          status: 'done',
          response: res.data,
          url: res.data?.filePath || '',
        };
        excelFileList.value[0] = file;
        formData.value.excelId = res.data.id || '';
        options?.onSuccess?.(res.data, options.file);
        message.success('Excel上传成功');
      } else {
        options?.onError?.(new Error('excel upload failed'));
        message.error('Excel上传失败');
      }
    }

    async function customRequestWord(options: any) {
      const fileName = options?.file?.name || '';
      if (!isWordFile(fileName)) {
        message.warning('请上传Word文件（.doc/.docx）');
        options?.onError?.(new Error('invalid word file'));
        return;
      }
      const res = await AdminApiSystemUploadFile.uploadFile({
        file: options.file as File,
        userId: userStore.getUser.id,
        confidentialLevel: 1,
      });
      if (res.data.code == 0) {
        const file: any = {
          uid: String(res.data?.id || Date.now()),
          id: res.data?.id || '',
          name: res.data?.oldFileName || options?.file?.name || 'word',
          status: 'done',
          response: res.data,
          url: res.data?.filePath || '',
        };
        wordFileList.value[0] = file;
        formData.value.wordId = res.data.id || '';
        options?.onSuccess?.(res.data, options.file);
        message.success('Word上传成功');
      } else {
        options?.onError?.(new Error('word upload failed'));
        message.error('Word上传失败');
      }
    }

    function excelFileChange(info: UploadChangeParam) {
      excelFileList.value = info?.fileList || [];
      if (excelFileList.value.length === 0) {
        formData.value.excelId = '';
      }
    }

    function wordFileChange(info: UploadChangeParam) {
      wordFileList.value = info?.fileList || [];
      if (wordFileList.value.length === 0) {
        formData.value.wordId = '';
      }
    }

    function beforeUploadExcel(file: File) {
      if (!isExcelFile(file?.name || '')) {
        message.warning('请上传Excel文件（.xls/.xlsx）');
        return false;
      }
      return true;
    }

    function beforeUploadWord(file: File) {
      if (!isWordFile(file?.name || '')) {
        message.warning('请上传Word文件（.doc/.docx）');
        return false;
      }
      return true;
    }

    function handleExcelUploadConfirm() {
      const first = excelFileList.value?.[0];
      formData.value.excelId = first?.id || first?.response?.id || '';
      openExcelUploadModal.value = false;
    }

    function handleWordUploadConfirm() {
      const first = wordFileList.value?.[0];
      formData.value.wordId = first?.id || first?.response?.id || '';
      openWordUploadModal.value = false;
    }

    function clearExcelFile() {
      excelFileList.value = [];
      formData.value.excelId = '';
    }

    function clearWordFile() {
      wordFileList.value = [];
      formData.value.wordId = '';
    }

    async function customRequestJs(options: any) {
      const fileName = options?.file?.name || '';
      if (!isJsFile(fileName)) {
        message.warning('请上传JS文件（.js）');
        options?.onError?.(new Error('invalid js file'));
        return;
      }
      const res = await AdminApiSystemUploadFile.uploadFile({
        file: options.file as File,
        userId: userStore.getUser.id,
        confidentialLevel: 1,
      });
      if (res.data.code == 0) {
        const file: any = {
          uid: String(res.data?.id || Date.now()),
          id: res.data?.id || '',
          name: res.data?.oldFileName || options?.file?.name || 'script.js',
          status: 'done',
          response: res.data,
          url: res.data?.filePath || '',
        };
        jsFileList.value[0] = file;
        formData.value.jsId = res.data.id || '';
        options?.onSuccess?.(res.data, options.file);
        message.success('JS文件上传成功');
      } else {
        options?.onError?.(new Error('js upload failed'));
        message.error('JS文件上传失败');
      }
    }

    function jsFileChange(info: UploadChangeParam) {
      jsFileList.value = info?.fileList || [];
      if (jsFileList.value.length === 0) {
        formData.value.jsId = '';
      }
    }

    function beforeUploadJs(file: File) {
      if (!isJsFile(file?.name || '')) {
        message.warning('请上传JS文件（.js）');
        return false;
      }
      return true;
    }

    function handleJsUploadConfirm() {
      const first = jsFileList.value?.[0];
      formData.value.jsId = first?.id || first?.response?.id || '';
      openJsUploadModal.value = false;
    }

    function clearJsFile() {
      jsFileList.value = [];
      formData.value.jsId = '';
    }

    function getJsFileId(file?: any) {
      return String(file?.id || file?.response?.id || formData.value.jsId || '').trim();
    }

    function downloadJsFile() {
      const file = jsFileList.value?.[0];
      const fileId = getJsFileId(file);
      if (!fileId) {
        message.warning('无法下载：缺少文件ID');
        return;
      }
      const fileName = String(file?.name || 'script.js').trim() || 'script.js';
      handleEpcDownload({ fileId }, fileName);
    }

    function handleJsUploadPreview(file: any) {
      const fileId = getJsFileId(file);
      if (!fileId) {
        message.warning('无法下载：缺少文件ID');
        return;
      }
      const fileName = String(file?.name || 'script.js').trim() || 'script.js';
      handleEpcDownload({ fileId }, fileName);
    }

    function clearTemplatePageFields() {
      formData.value.auditProcess = '';
      formData.value.isSynergy = '0';
      formData.value.tempNum = '';
    }

    watch(
      () => String(formData.value.pageType ?? ''),
      pt => {
        if (!isTemplatePageType(pt)) {
          clearTemplatePageFields();
        }
      },
    );

    return {
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      updatePageInfo,
      formData,
      formRef,
      id,
      displayPropTypeList,
      selectPopupContainer,
      pageTypeSelectRef,
      onPageTypeChange,
      templateFieldsVisible,
      remark,
      unitId,
      categoryid,
      excelFileList,
      wordFileList,
      openExcelUploadModal,
      openWordUploadModal,
      excelConfidentialLevel,
      wordConfidentialLevel,
      customRequestExcel,
      customRequestWord,
      excelFileChange,
      wordFileChange,
      beforeUploadExcel,
      beforeUploadWord,
      handleExcelUploadConfirm,
      handleWordUploadConfirm,
      clearExcelFile,
      clearWordFile,
      jsFileList,
      openJsUploadModal,
      jsConfidentialLevel,
      customRequestJs,
      jsFileChange,
      beforeUploadJs,
      handleJsUploadConfirm,
      clearJsFile,
      downloadJsFile,
      handleJsUploadPreview,
      showTemplatePageFields,
    };
  },
});
</script>

<template>
  <div class="activity-upload" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 700px"
      :style="{ top: '5%' }"
      :title="$t('修改活动页面')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="updatePageInfo"
      @cancel="handleClose">
      <a-form ref="formRef" :model="formData" style="margin-top: 20px" :label-col="{ style: { width: '100px' } }">
        <a-form-item
          :label="$t('页面名称')"
          name="pageName"
          :rules="[{ required: true, message: `${$t('请输入页面名称')}` }]">
          <a-input v-model:value="formData.pageName" placeholder="请输入页面名称" allowClear />
        </a-form-item>
        <a-form-item
          :label="$t('页面类型')"
          name="pageType"
          :rules="[{ required: true, message: `${$t('请选择页面类型')}` }]">
          <a-select
            ref="pageTypeSelectRef"
            v-model:value="formData.pageType"
            placeholder="请选择页面类型"
            show-search
            allowClear
            :options="displayPropTypeList"
            option-filter-prop="label"
            :get-popup-container="selectPopupContainer"
            @change="onPageTypeChange" />
        </a-form-item>
        <a-form-item :label="$t('页面URL')" name="url" v-if="formData.pageType == '3'">
          <a-input v-model:value="formData.url" placeholder="请输入页面URL" allowClear />
        </a-form-item>
        <ActivityTemplatePageFields
          v-if="templateFieldsVisible"
          v-model:audit-process="formData.auditProcess"
          v-model:is-synergy="formData.isSynergy"
          v-model:temp-num="formData.tempNum" />
        <a-form-item :label="$t('组名称')" name="groupName">
          <a-input v-model:value="formData.groupName" placeholder="请输入组名称" allowClear />
        </a-form-item>
        <a-form-item :label="$t('备注')">
          <a-textarea
            type="textarea"
            style="height: 100px"
            v-model:value="remark"
            placeholder="请输入备注"
            name="remark"
            allowClear />
        </a-form-item>
        <a-form-item :label="$t('上传excel文件')" name="excelId" v-if="formData.pageType == '2'">
          <a-button type="primary" @click="openExcelUploadModal = true">上传Excel文件</a-button>
          <span style="margin-left: 8px">{{ excelFileList[0]?.name || '未上传文件' }}</span>
        </a-form-item>
        <a-form-item :label="$t('上传word文件')" name="wordId" v-if="formData.pageType == '2'">
          <a-button type="primary" @click="openWordUploadModal = true">上传Word文件</a-button>
          <span style="margin-left: 8px">{{ wordFileList[0]?.name || '未上传文件' }}</span>
        </a-form-item>
        <a-form-item label="上传JS文件" name="jsId" v-if="formData.pageType === '1' || formData.pageType === '2'">
          <div class="activity-file-upload">
            <a-button type="primary" @click="openJsUploadModal = true">上传JS文件</a-button>
            <template v-if="jsFileList[0]">
              <a class="activity-file-upload__link" @click.prevent="downloadJsFile">{{ jsFileList[0]?.name }}</a>
              <a class="activity-file-upload__remove" @click.prevent="clearJsFile">删除</a>
            </template>
            <span v-else class="activity-file-upload__empty">未上传文件</span>
          </div>
        </a-form-item>
      </a-form>
      <UploadModal
        v-model:visible="openExcelUploadModal"
        v-model:confidential-level="excelConfidentialLevel"
        modal-title="上传Excel文件"
        accept=".xls,.xlsx"
        :file-list="excelFileList"
        :before-upload="beforeUploadExcel"
        :custom-request="customRequestExcel"
        @upload-change="excelFileChange"
        @remove-file="clearExcelFile"
        @confirm="handleExcelUploadConfirm" />
      <UploadModal
        v-model:visible="openWordUploadModal"
        v-model:confidential-level="wordConfidentialLevel"
        modal-title="上传Word文件"
        accept=".doc,.docx"
        :file-list="wordFileList"
        :before-upload="beforeUploadWord"
        :custom-request="customRequestWord"
        @upload-change="wordFileChange"
        @remove-file="clearWordFile"
        @confirm="handleWordUploadConfirm" />
      <UploadModal
        v-model:visible="openJsUploadModal"
        v-model:confidential-level="jsConfidentialLevel"
        modal-title="上传JS文件"
        accept=".js"
        :file-list="jsFileList"
        :before-upload="beforeUploadJs"
        :custom-request="customRequestJs"
        @upload-change="jsFileChange"
        @upload-preview="handleJsUploadPreview"
        @remove-file="clearJsFile"
        @confirm="handleJsUploadConfirm" />
      <template #footer>
        <a-button type="primary" @click="updatePageInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.activity-file-upload {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.activity-file-upload__link {
  color: #1677ff;
  cursor: pointer;
  white-space: nowrap;
}

.activity-file-upload__remove {
  color: #ff4d4f;
  cursor: pointer;
  white-space: nowrap;
}

.activity-file-upload__empty {
  color: rgba(0, 0, 0, 0.45);
}
</style>
