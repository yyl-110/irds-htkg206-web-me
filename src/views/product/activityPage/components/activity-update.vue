<script lang="ts">
import { computed, defineComponent, nextTick, ref } from 'vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'NoticeData',
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

    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
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
      data.button = (formData.value.button || []).join(',');
      data.calculateFileId = formData.value.excelId;
      data.reportFileId = formData.value.wordId;
      data.url = formData.value.url;
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
      formData.value.pageType = data.pageType;
      formData.value.url = data.url;
      formData.value.groupName = data.groupName;
      formData.value.button = data.button.split(',');
      formData.value.excelId = data.calculateFileId;
      formData.value.wordId = data.reportFileId;
      const excelFile = normalizeUploadFile(data.calculateFileInfo);
      const wordFile = normalizeUploadFile(data.reportFileInfo);
      excelFileList.value = excelFile ? [excelFile] : [];
      wordFileList.value = wordFile ? [wordFile] : [];
      remark.value = data.remark;
      categoryid.value = categoryidStr;
      //获取参数字典
      getUnitParent();
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.activity-upload');
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
        securityLevel: 1,
      });
      if (res.data.code == 0) {
        const file: any = { ...res.data, name: res.data?.oldFileName };
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
        securityLevel: 1,
      });
      if (res.data.code == 0) {
        const file: any = { ...res.data, name: res.data?.oldFileName };
        wordFileList.value[0] = file;
        formData.value.wordId = res.data.id || '';
        options?.onSuccess?.(res.data, options.file);
        message.success('Word上传成功');
      } else {
        options?.onError?.(new Error('word upload failed'));
        message.error('Word上传失败');
      }
    }

    function excelFileChange(info: any) {
      excelFileList.value = info?.fileList || [];
      if (excelFileList.value.length === 0) {
        formData.value.excelId = '';
      }
    }

    function wordFileChange(info: any) {
      wordFileList.value = info?.fileList || [];
      if (wordFileList.value.length === 0) {
        formData.value.wordId = '';
      }
    }

    return {
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      updatePageInfo,
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
      customRequestExcel,
      customRequestWord,
      excelFileChange,
      wordFileChange,
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
        <a-form-item :label="$t('页面类型')" name="pageType" :rules="[{ required: true, message: `${$t('请选择页面类型')}` }]">
          <a-select placeholder="请选择页面类型" v-model:value="formData.pageType" show-search>
            <a-select-option v-for="item in propTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('页面名称')" name="pageName" :rules="[{ required: true, message: `${$t('请输入页面名称')}` }]">
          <a-input v-model:value="formData.pageName" placeholder="请输入页面名称" />
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
        <a-form-item :label="$t('上传excel文件')" name="excelId" v-if="formData.pageType == '2'">
          <a-upload-dragger v-model:file-list="excelFileList" :max-count="1" :custom-request="customRequestExcel" @change="excelFileChange">
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">支持扩展名：.xls .xlsx</p>
          </a-upload-dragger>
        </a-form-item>
        <a-form-item :label="$t('上传word文件')" name="wordId" v-if="formData.pageType == '2'">
          <a-upload-dragger v-model:file-list="wordFileList" :max-count="1" :custom-request="customRequestWord" @change="wordFileChange">
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">支持扩展名：.doc .docx</p>
          </a-upload-dragger>
        </a-form-item>
      </a-form>
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

<style scoped lang="less"></style>
