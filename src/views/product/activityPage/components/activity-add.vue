<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import type { FormInstance } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import UploadModal from '@/views/product/components/upload-modal.vue';

export default defineComponent({
  name: 'NoticeData',
  components: { UploadModal },
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */

    const visible = computed(() => {
      return props.modalVisible;
    });
    const formRef = ref<FormInstance>();
    const userStore = useUserStore();
    const id = ref(0);
    const remark = ref('');
    const categoryid = ref('');
    const unitId = ref<any>();
    const buttonOptions = ref([
      { label: '再生模型', value: '再生模型' },
      { label: '导出报告', value: '导出报告' },
      { label: '导入参数', value: '导入参数' },
      { label: '导出参数', value: '导出参数' },
    ]);
    const excelFileList = ref<any[]>([]);
    const wordFileList = ref<any[]>([]);
    const openExcelUploadModal = ref(false);
    const openWordUploadModal = ref(false);
    const excelConfidentialLevel = ref(1);
    const wordConfidentialLevel = ref(1);
    const formData = ref({
      pageName: '',
      pageType: '1',
      groupName: '',
      url: '',
      button: [] as string[],
      excelId: '',
      wordId: '',
    });
    const propTypeList = ref<any>([]);

    /** 设计配置页面且勾选「导出报告」时，展示与计算页一致的 Word 模板上传 */
    const showDesignPageWordUpload = computed(() => {
      const pt = String(formData.value.pageType ?? '');
      const btn = formData.value.button || [];
      return pt === '1' && btn.includes('导出报告');
    });

    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };

    /** handle close */
    async function savePageInfo() {
      // 调用保存接口
      await formRef.value?.validate();
      // 保存页面信息
      const data: any = {};
      data.pageName = formData.value.pageName;
      data.pageType = formData.value.pageType;
      data.groupName = formData.value.groupName;
      data.remark = remark.value;
      data.treeId = categoryid.value;
      data.button = (formData.value.button || []).join(',');
      data.calculateFileId = formData.value.excelId;
      data.reportFileId = formData.value.wordId;
      data.url = formData.value.url;
      console.log(data);
      const res = await AdminApiActivityPage.createActivityInfo(data);
      //刷新父页面列表数据
      context.emit('refresh-table-data');
      // //关闭当前窗口
      context.emit('close');
    }

    //初始化数据
    const infoReload = (categoryidStr: string) => {
      id.value = 0;
      formData.value.pageName = '';
      formData.value.pageType = '1';
      formData.value.url = '';
      formData.value.groupName = '';
      formData.value.button = [];
      formData.value.excelId = '';
      formData.value.wordId = '';
      excelFileList.value = [];
      wordFileList.value = [];
      remark.value = '';
      categoryid.value = categoryidStr;
      nextTick(() => {
        formRef.value?.resetFields();
      });
      //获取参数字典
      getUnitParent();
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.activity-add');
    }

    async function getUnitParent() {
      const params: any = {};
      params.dictType = 'page_type';
      params.pageNo = 1;
      params.pageSize = 100;
      const res = await AdminApiSystemDictData.getDictTypePage(params);
      propTypeList.value = res.data.data?.list;
    }

    function isExcelFile(fileName = '') {
      const lowerName = fileName.toLowerCase();
      return lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx');
    }

    function isWordFile(fileName = '') {
      const lowerName = fileName.toLowerCase();
      return lowerName.endsWith('.doc') || lowerName.endsWith('.docx');
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

    watch(
      () => [String(formData.value.pageType ?? ''), [...(formData.value.button || [])].join('|')],
      () => {
        const pt = String(formData.value.pageType ?? '');
        const hasExportReport = (formData.value.button || []).includes('导出报告');
        if (pt === '1' && !hasExportReport) {
          clearWordFile();
        }
      },
    );

    return {
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      savePageInfo,
      getUnitParent,
      formData,
      formRef,
      id,
      propTypeList,
      remark,
      unitId,
      categoryid,
      buttonOptions,
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
      showDesignPageWordUpload,
    };
  },
});
</script>

<template>
  <div class="activity-add" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 700px"
      :style="{ top: '5%' }"
      :title="$t('创建活动页面')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="savePageInfo"
      @cancel="handleClose">
      <a-form ref="formRef" :model="formData" style="margin-top: 20px" :label-col="{ style: { width: '100px' } }">
        <a-form-item :label="$t('页面名称')" name="pageName" :rules="[{ required: true, message: `${$t('请输入页面名称')}` }]">
          <a-input v-model:value="formData.pageName" placeholder="请输入页面名称" />
        </a-form-item>
        <a-form-item :label="$t('页面类型')" name="pageType" :rules="[{ required: true, message: `${$t('请选择页面类型')}` }]">
          <a-select placeholder="请选择页面类型" v-model:value="formData.pageType" show-search>
            <a-select-option v-for="item in propTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('页面URL')" name="url" v-if="formData.pageType == '3'">
          <a-input v-model:value="formData.url" placeholder="请输入页面URL" />
        </a-form-item>
        <a-form-item :label="$t('组名称')" name="groupName">
          <a-input v-model:value="formData.groupName" placeholder="请输入组名称" />
        </a-form-item>
        <a-form-item :label="$t('备注')">
          <a-textarea type="textarea" style="height: 100px" v-model:value="remark" placeholder="请输入备注" name="remark" />
        </a-form-item>
        <a-form-item :label="$t('页面功能按钮')" name="button" v-if="formData.pageType == '1'">
          <a-checkbox-group v-model:value="formData.button" :options="buttonOptions" />
        </a-form-item>
        <a-form-item v-if="showDesignPageWordUpload" :label="$t('上传word文件')" name="wordId">
          <a-button type="primary" @click="openWordUploadModal = true">上传Word文件</a-button>
          <span style="margin-left: 8px">{{ wordFileList[0]?.name || '未上传文件' }}</span>
        </a-form-item>
        <a-form-item :label="$t('上传excel文件')" name="excelId" v-if="formData.pageType == '2'">
          <a-button type="primary" @click="openExcelUploadModal = true">上传Excel文件</a-button>
          <span style="margin-left: 8px">{{ excelFileList[0]?.name || '未上传文件' }}</span>
        </a-form-item>
        <a-form-item :label="$t('上传word文件')" name="wordId" v-if="formData.pageType == '2'">
          <a-button type="primary" @click="openWordUploadModal = true">上传Word文件</a-button>
          <span style="margin-left: 8px">{{ wordFileList[0]?.name || '未上传文件' }}</span>
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
      <template #footer>
        <a-button type="primary" @click="savePageInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
