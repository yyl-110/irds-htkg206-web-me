<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormInstance, TableColumnType, UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';

type ProductTemplateRow = {
  id?: string;
  tempName?: string;
  tempNum?: string;
  remarks?: string;
};

const props = defineProps<{
  projectForm: Record<string, any>;
  projectFormLabelCol: Record<string, any>;
  projectFormWrapperCol: Record<string, any>;
  confidentialOptions: Array<{ label: string; value: number }>;
  localeA: any;
  disabledPlanStartDate: (current: any) => boolean;
  disabledPlanEndDate: (current: any) => boolean;
}>();

const userStore = useUserStore();
const projectFormRef = ref<FormInstance>();
const materialFileList = ref<UploadFile[]>([]);
const materialFileListPrevLen = ref(0);

const PRODUCT_TEMPLATE_TABLE_SCROLL_Y = 390;
const productTemplateModalVisible = ref(false);
const productTemplateLoading = ref(false);
const productTemplateList = ref<ProductTemplateRow[]>([]);
const selectedProductTemplateKeys = ref<string[]>([]);
const selectedProductTemplateRow = ref<ProductTemplateRow | null>(null);

const productTemplateColumns: TableColumnType<ProductTemplateRow>[] = [
  { title: WeiI18n.$t('序号'), key: 'index', align: 'center', width: 72, customRender: ({ index }) => String((index ?? 0) + 1) },
  { title: WeiI18n.$t('模板名称'), dataIndex: 'tempName', key: 'tempName', ellipsis: true },
  { title: WeiI18n.$t('模板编号'), dataIndex: 'tempNum', key: 'tempNum', width: 160, ellipsis: true },
  { title: WeiI18n.$t('备注'), dataIndex: 'remarks', key: 'remarks', ellipsis: true },
];

const productTemplateRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedProductTemplateKeys.value,
  onChange: (keys: (string | number)[], rows: ProductTemplateRow[]) => {
    selectedProductTemplateKeys.value = keys.map(String);
    selectedProductTemplateRow.value = rows[0] ?? null;
  },
}));

function productTemplateCustomRow(record: ProductTemplateRow) {
  return {
    onClick: () => {
      const id = record.id;
      if (id == null || id === '') return;
      selectedProductTemplateKeys.value = [String(id)];
      selectedProductTemplateRow.value = record;
    },
  };
}

function resetProductTemplateModalSelection() {
  selectedProductTemplateKeys.value = [];
  selectedProductTemplateRow.value = null;
}

async function selectProductTemplate() {
  resetProductTemplateModalSelection();
  productTemplateModalVisible.value = true;
  productTemplateLoading.value = true;
  try {
    const res = await AdminApiProductTemp.getProductTempList({});
    const list = res?.data?.data;
    productTemplateList.value = Array.isArray(list) ? list : [];
  } finally {
    productTemplateLoading.value = false;
  }
}

function closeProductTemplateModal() {
  productTemplateModalVisible.value = false;
}

function onProductTemplateModalAfterClose() {
  resetProductTemplateModalSelection();
}

function confirmProductTemplateSelection(): boolean {
  const row = selectedProductTemplateRow.value;
  if (!row?.id) {
    message.warning(WeiI18n.$t('请选择产品模板'));
    return false;
  }
  props.projectForm.productTempId = String(row.id);
  props.projectForm.productTempName = row.tempName ?? '';
  return true;
}

function handleProductTemplateModalOk() {
  if (confirmProductTemplateSelection()) {
    closeProductTemplateModal();
  }
}

const beforeMaterialUpload: UploadProps['beforeUpload'] = () => true;

const materialCustomRequest: UploadProps['customRequest'] = async options => {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      securityLevel: props.projectForm.confidentialLevel,
    });
    if (res.data.code === 0) {
      options.onSuccess?.(res.data, options.file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      options.onError?.(new Error(res.data.msg || 'upload failed'));
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    options.onError?.(err as Error);
    message.error(WeiI18n.t('上传失败').value);
  }
};

function materialFileIdFromResponse(file: UploadFile): string | undefined {
  const r = file.response as Record<string, unknown> | undefined;
  if (!r) return undefined;
  const nested = r.data as Record<string, unknown> | undefined;
  const raw = r.id ?? nested?.id ?? nested?.queryId ?? r.queryId;
  if (raw == null || raw === '') return undefined;
  return String(raw);
}

function enrichMaterialUploadFiles(files: UploadFile[]): UploadFile[] {
  return files.map(f => {
    const fileId = materialFileIdFromResponse(f);
    if (f.status === 'done' && fileId != null) {
      return { ...f, id: fileId } as UploadFile;
    }
    return f;
  });
}

function onMaterialFileChange(info: UploadChangeParam) {
  const list = info.fileList;
  const prev = materialFileListPrevLen.value;
  let next: UploadFile[];
  if (list.length - prev > 1) {
    next = [...list.slice(0, prev), list[prev]!];
  } else {
    next = list;
  }
  materialFileList.value = enrichMaterialUploadFiles(next);
  materialFileListPrevLen.value = materialFileList.value.length;
}

function getMaterialFileIds(): string[] {
  return materialFileList.value
    .filter(f => f.status === 'done')
    .map(f => materialFileIdFromResponse(f))
    .filter((id): id is string => id != null && id !== '');
}

function setMaterialFileListFromProject(rawFileList: any[]) {
  if (!Array.isArray(rawFileList)) return;
  const mapped = rawFileList
    .map((f: any, index: number): UploadFile | null => {
      const fileId = f?.fileId ?? f?.id ?? f?.queryId;
      if (fileId == null || fileId === '') return null;
      const filename = f?.oldFileName ?? f?.fileName ?? f?.fileRealName ?? f?.fileTitle ?? `文件${index + 1}`;
      const fileUrl = f?.filePath ?? f?.url;
      return {
        uid: String(fileId),
        name: String(filename),
        status: 'done',
        url: fileUrl,
        response: { id: String(fileId), data: { id: String(fileId) } },
      } as UploadFile;
    })
    .filter((x): x is UploadFile => x != null);
  materialFileList.value = mapped;
  materialFileListPrevLen.value = mapped.length;
}

function resetMaterialFiles() {
  materialFileList.value = [];
  materialFileListPrevLen.value = 0;
}

async function validateForm() {
  await projectFormRef.value?.validate();
}

defineExpose({
  validateForm,
  getMaterialFileIds,
  setMaterialFileListFromProject,
  resetMaterialFiles,
});
</script>

<template>
  <a-form
    ref="projectFormRef"
    :model="projectForm"
    layout="horizontal"
    :colon="false"
    :label-col="projectFormLabelCol"
    :wrapper-col="projectFormWrapperCol"
    label-align="right"
    class="project-editor-form project-editor-form--uniform">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('项目编号：')" name="projectNum" :rules="[{ required: true, message: $t('请输入项目编号') }]">
          <a-input v-model:value="projectForm.projectNum" :placeholder="$t('请输入项目编号')" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="$t('平台：')">
          <a-input v-model:value="projectForm.productPlatform" :placeholder="$t('请输入')" disabled />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('项目名称：')" name="projectName" :rules="[{ required: true, message: $t('请输入项目名称') }]">
          <a-input v-model:value="projectForm.projectName" :placeholder="$t('请输入项目名称')" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="$t('产品模板：')">
          <div class="project-num-with-browse">
            <a-input v-model:value="projectForm.productTempName" :placeholder="$t('请选择')" disabled />
            <a-button type="primary" @click="selectProductTemplate">{{ $t('浏览') }}</a-button>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('计划开始时间：')">
          <a-date-picker
            :locale="localeA"
            v-model:value="projectForm.planStartTime"
            class="project-form-date"
            style="width: 100%"
            placeholder="计划开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledPlanStartDate" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="$t('计划结束时间：')">
          <a-date-picker
            :locale="localeA"
            v-model:value="projectForm.planEndTime"
            class="project-form-date"
            style="width: 100%"
            placeholder="计划结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledPlanEndDate" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('密级：')">
          <a-select v-model:value="projectForm.confidentialLevel" :options="confidentialOptions"> </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12" />
    </a-row>
    <a-row :gutter="24">
      <a-col :span="20">
        <a-form-item :label="$t('备注：')">
          <a-textarea v-model:value="projectForm.remarks" :placeholder="$t('请输入备注')" :rows="4" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="4" />
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('资料密级：')">
          <a-select v-model:value="projectForm.dataConfidentialLevel" :options="confidentialOptions" />
        </a-form-item>
      </a-col>
      <a-col :span="12" />
    </a-row>
    <a-row :gutter="24">
      <a-col :span="20">
        <a-form-item :label="$t('项目资料：')">
          <a-upload-dragger
            v-model:file-list="materialFileList"
            name="file"
            :multiple="false"
            :before-upload="beforeMaterialUpload"
            :custom-request="materialCustomRequest"
            @change="onMaterialFileChange">
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">{{ $t('点击或将文件拖拽到这里上传') }}</p>
            <p class="ant-upload-hint">{{ $t('支持扩展名：.rar .zip .doc .docx .pdf .jpg...') }}</p>
          </a-upload-dragger>
        </a-form-item>
      </a-col>
      <a-col :span="4" />
    </a-row>
  </a-form>

  <a-modal
    v-model:visible="productTemplateModalVisible"
    wrap-class-name="product-template-select-modal"
    :title="$t('选择产品模板')"
    width="960px"
    destroy-on-close
    @cancel="closeProductTemplateModal"
    @after-close="onProductTemplateModalAfterClose">
    <a-table
      :columns="productTemplateColumns"
      :data-source="productTemplateList"
      :loading="productTemplateLoading"
      :pagination="false"
      :scroll="{ y: PRODUCT_TEMPLATE_TABLE_SCROLL_Y }"
      :row-selection="productTemplateRowSelection"
      :custom-row="productTemplateCustomRow"
      row-key="id"
      size="small" />
    <template #footer>
      <a-space>
        <a-button type="primary" @click="handleProductTemplateModalOk">{{ $t('确定') }}</a-button>
        <a-button @click="closeProductTemplateModal">{{ $t('取消') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
.project-editor-form {
  padding-top: 4px;
}

.project-num-with-browse {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.project-num-with-browse :deep(.ant-input) {
  flex: 1;
  min-width: 0;
}

.project-editor-form--uniform :deep(.ant-col-12) {
  flex: 0 0 50% !important;
  max-width: 50% !important;
}

.project-editor-form--uniform :deep(.ant-col-12 > .ant-form-item) {
  width: 100%;
}

.project-editor-form--uniform :deep(.ant-form-item-control) {
  flex: 1;
  min-width: 0;
}

.project-editor-form--uniform :deep(.ant-form-item-control-input-content) {
  width: 100% !important;
  max-width: 100%;
  box-sizing: border-box;
}

.project-editor-form--uniform .project-num-with-browse :deep(.ant-input),
.project-editor-form--uniform .project-num-with-browse :deep(.ant-input-affix-wrapper) {
  width: auto !important;
  flex: 1 1 0;
  min-width: 0;
}

.project-editor-form--uniform :deep(.ant-input),
.project-editor-form--uniform :deep(.ant-input-affix-wrapper),
.project-editor-form--uniform :deep(.ant-select),
.project-editor-form--uniform :deep(.ant-picker),
.project-editor-form--uniform :deep(.project-form-date),
.project-editor-form--uniform :deep(.project-form-range),
.project-editor-form--uniform :deep(.ant-input-textarea textarea) {
  width: 100% !important;
}

.project-editor-form--uniform :deep(.ant-upload.ant-upload-drag) {
  width: 100% !important;
}
</style>

<style lang="less">
.product-template-select-modal .ant-table-tbody > tr {
  cursor: pointer;
}
</style>
