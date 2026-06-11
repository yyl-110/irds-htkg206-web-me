<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, TableColumnType, UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { InboxOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { ProductTempPageRequestDTOModel } from '@/api/models/productTemp/ProductTempPageRequestDTOModel';
import { usePagination } from '@/hooks/usePagination';
import { useUserStore } from '@/store/modules/user';

type ProductTemplateRow = {
  id?: string;
  tempName?: string;
  tempNum?: string;
  remarks?: string;
  versionNum?: number | string;
};

const props = defineProps<{
  projectForm: Record<string, any>;
  /** 路由或保存后已有项目主键：仅展示编号，不提供请码 */
  persistedProjectId?: string;
  /** 非项目经理时为只读 */
  readonly?: boolean;
  projectFormLabelCol: Record<string, any>;
  projectFormWrapperCol: Record<string, any>;
  confidentialOptions: Array<{ label: string; value: number }>;
  localeA: any;
  disabledPlanStartDate: (current: any) => boolean;
  disabledPlanEndDate: (current: any) => boolean;
}>();

const canRequestProjectNum = computed(
  () => !props.readonly && (!props.persistedProjectId || String(props.persistedProjectId).trim() === ''),
);

const projectNumApplyLoading = ref(false);

const userStore = useUserStore();
const projectFormRef = ref<FormInstance>();
const materialFileList = ref<UploadFile[]>([]);
const materialFileListPrevLen = ref(0);

const PRODUCT_TEMPLATE_TABLE_SCROLL_Y = 360;
const productTemplateModalVisible = ref(false);
const productTemplateLoading = ref(false);
const productTemplateList = ref<ProductTemplateRow[]>([]);
const productTemplateKeyword = ref('');
const productTemplateRequestParams = reactive(new ProductTempPageRequestDTOModel());
productTemplateRequestParams.pageSize = 10;
productTemplateRequestParams.status = 1;
const selectedProductTemplateKeys = ref<string[]>([]);
const selectedProductTemplateRow = ref<ProductTemplateRow | null>(null);

const { pagination: productTemplatePagination, resetPagination: resetProductTemplatePagination } = usePagination(
  productTemplateRequestParams,
  fetchProductTemplatePage,
);
productTemplatePagination.showQuickJumper = true;
productTemplatePagination.showSizeChanger = true;
productTemplatePagination.showTotal = total => `${WeiI18n.$t('共')}${total}${WeiI18n.$t('条')}`;

function productTemplateRowIndex(index?: number): string {
  const page = productTemplateRequestParams.pageNo || 1;
  const size = productTemplateRequestParams.pageSize || 10;
  return String((page - 1) * size + (index ?? 0) + 1);
}

function formatProductTemplateVersion(version?: number | string): string {
  if (version == null || version === '') return '—';
  return `V${version}`;
}

const productTemplateColumns: TableColumnType<ProductTemplateRow>[] = [
  {
    title: WeiI18n.$t('序号'),
    key: 'index',
    align: 'center',
    width: 64,
    customRender: ({ index }) => productTemplateRowIndex(index),
  },
  { title: WeiI18n.$t('模板名称'), dataIndex: 'tempName', key: 'tempName', width: 180, ellipsis: true },
  { title: WeiI18n.$t('模板编号'), dataIndex: 'tempNum', key: 'tempNum', width: 200, ellipsis: true },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'versionNum',
    key: 'versionNum',
    align: 'center',
    width: 80,
    customRender: ({ text }) => formatProductTemplateVersion(text),
  },
  { title: WeiI18n.$t('备注'), dataIndex: 'remarks', key: 'remarks', width: 140, ellipsis: true },
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

function normalizeProductTemplateRow(raw: Record<string, unknown>): ProductTemplateRow {
  return {
    id: raw.id != null ? String(raw.id) : undefined,
    tempName: raw.tempName != null ? String(raw.tempName) : undefined,
    tempNum: raw.tempNum != null ? String(raw.tempNum) : undefined,
    remarks: raw.remarks != null ? String(raw.remarks) : undefined,
    versionNum: raw.versionNum as number | string | undefined,
  };
}

async function fetchProductTemplatePage() {
  const platformMenuId = resolveProjectPlatformMenuId();
  if (!platformMenuId) return;
  productTemplateLoading.value = true;
  try {
    productTemplateRequestParams.currentPage = productTemplateRequestParams.pageNo;
    productTemplateRequestParams.numberPage = productTemplateRequestParams.pageSize;
    const keyword = productTemplateKeyword.value.trim();
    const res = await AdminApiProductTemp.getProductTempPageList({
      ...productTemplateRequestParams,
      menuId: platformMenuId,
      keyword: keyword || undefined,
      tempName: undefined,
      tempNum: undefined,
      status: 1,
    });
    const pageData = res?.data?.data;
    const list = Array.isArray(pageData?.list) ? pageData.list : [];
    const rows = list.map((item: Record<string, unknown>) => normalizeProductTemplateRow(item));
    productTemplateList.value = rows;
    productTemplatePagination.total = Number(pageData?.total ?? 0);
  } finally {
    productTemplateLoading.value = false;
  }
}

function onProductTemplateSearch() {
  productTemplateRequestParams.pageNo = 1;
  productTemplatePagination.current = 1;
  void fetchProductTemplatePage();
}

function resetProductTemplateSearch() {
  productTemplateKeyword.value = '';
  onProductTemplateSearch();
}

function resolveProjectPlatformMenuId(): string | null {
  const mid = String(props.projectForm.productPlatformId ?? '').trim();
  if (!mid) {
    message.warning(WeiI18n.$t('请先选择或确认项目所属平台'));
    return null;
  }
  return mid;
}

async function selectProductTemplate() {
  if (props.readonly) return;
  const platformMenuId = resolveProjectPlatformMenuId();
  if (!platformMenuId) return;

  resetProductTemplateModalSelection();
  productTemplateKeyword.value = '';
  resetProductTemplatePagination(productTemplateRequestParams);
  productTemplatePagination.current = 1;
  productTemplateModalVisible.value = true;
  await fetchProductTemplatePage();
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
      confidentialLevel: props.projectForm.confidentialLevel,
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

async function applyProjectSerialNum() {
  if (!canRequestProjectNum.value) {
    return;
  }
  projectNumApplyLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.nextNo({ ruleCode: 'project' });
    const code = res?.data?.code as number | string | undefined;
    const ok = code === 0 || code === 200 || code === '0' || code === '200';
    if (!ok) {
      message.error(String(res?.data?.msg ?? WeiI18n.$t('请码失败')));
      return;
    }
    const nextVal = String(res?.data?.data ?? '').trim();
    if (!nextVal) {
      message.warning(WeiI18n.$t('未返回项目编号'));
      return;
    }
    props.projectForm.projectNum = nextVal;
    message.success(WeiI18n.$t('请码成功'));
  } catch {
    message.error(WeiI18n.$t('请码失败'));
  } finally {
    projectNumApplyLoading.value = false;
  }
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
        <a-form-item
          :label="$t('项目编号：')"
          name="projectNum"
          :rules="[{ required: true, message: $t('请点击请码申请项目编号') }]">
          <div class="project-num-with-browse">
            <a-input
              v-model:value="projectForm.projectNum"
              :placeholder="canRequestProjectNum ? $t('请点击请码申请项目编号') : $t('项目编号')"
              disabled />
            <a-button
              v-if="canRequestProjectNum"
              type="primary"
              :loading="projectNumApplyLoading"
              @click="applyProjectSerialNum">
              {{ $t('请码') }}
            </a-button>
          </div>
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
          <a-input v-model:value="projectForm.projectName" :placeholder="$t('请输入项目名称')" :disabled="readonly" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="$t('产品模板：')"
          name="productTempId"
          :rules="[{ required: true, message: $t('请选择产品模板') }]">
          <div class="project-num-with-browse">
            <a-input v-model:value="projectForm.productTempName" :placeholder="$t('请选择')" disabled />
            <a-button v-if="!readonly" type="primary" @click="selectProductTemplate">{{ $t('浏览') }}</a-button>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          :label="$t('计划开始时间：')"
          name="planStartTime"
          :rules="[{ required: true, message: $t('请选择计划开始时间') }]">
          <a-date-picker
            :locale="localeA"
            v-model:value="projectForm.planStartTime"
            class="project-form-date"
            style="width: 100%"
            placeholder="计划开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="readonly"
            :disabled-date="disabledPlanStartDate" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="$t('计划结束时间：')"
          name="planEndTime"
          :rules="[{ required: true, message: $t('请选择计划结束时间') }]">
          <a-date-picker
            :locale="localeA"
            v-model:value="projectForm.planEndTime"
            class="project-form-date"
            style="width: 100%"
            placeholder="计划结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="readonly"
            :disabled-date="disabledPlanEndDate" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          :label="$t('密级：')"
          name="confidentialLevel"
          :rules="[{ required: true, message: $t('请选择密级') }]">
          <a-select v-model:value="projectForm.confidentialLevel" :options="confidentialOptions" :disabled="readonly"> </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12" />
    </a-row>
    <a-row :gutter="24">
      <a-col :span="20">
        <a-form-item class="project-form-item--textarea" :label="$t('备注：')">
          <a-textarea v-model:value="projectForm.remarks" :placeholder="$t('请输入备注')" :rows="4" :disabled="readonly" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="4" />
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="$t('资料密级：')">
          <a-select v-model:value="projectForm.dataConfidentialLevel" :options="confidentialOptions" :disabled="readonly" />
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
            :disabled="readonly"
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
    width="980px"
    destroy-on-close
    @cancel="closeProductTemplateModal"
    @after-close="onProductTemplateModalAfterClose">
    <div class="product-template-select-modal__body">
      <div class="product-template-select-toolbar">
        <a-input-search
          v-model:value="productTemplateKeyword"
          allow-clear
          :placeholder="$t('搜索模板名称或编号')"
          class="product-template-select-toolbar__search"
          @search="onProductTemplateSearch">
          <template #enterButton>
            <a-button type="primary">
              <SearchOutlined />
              {{ $t('搜索') }}
            </a-button>
          </template>
        </a-input-search>
        <a-button @click="resetProductTemplateSearch">{{ $t('重置') }}</a-button>
        <span class="product-template-select-toolbar__hint">{{ $t('仅展示已发布模板') }}</span>
      </div>
      <a-table
        class="product-template-select-table"
        :columns="productTemplateColumns"
        :data-source="productTemplateList"
        :loading="productTemplateLoading"
        :pagination="productTemplatePagination"
        :scroll="{ y: PRODUCT_TEMPLATE_TABLE_SCROLL_Y, x: 720 }"
        :row-selection="productTemplateRowSelection"
        :custom-row="productTemplateCustomRow"
        row-key="id"
        size="middle"
        bordered />
    </div>
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

/* 备注 textarea 拖拽增高时，表单项随内容撑开，避免盖住下方字段 */
.project-editor-form--uniform :deep(.project-form-item--textarea) {
  align-items: flex-start;

  .ant-form-item-label > label {
    height: auto;
    min-height: 32px;
  }

  .ant-form-item-control-input {
    align-items: flex-start;
    height: auto;
    min-height: 32px;
  }

  .ant-form-item-control-input-content {
    overflow: visible;
  }

  .ant-input-affix-wrapper-textarea-with-clear-btn {
    display: block;
    width: 100%;
    height: auto;
  }

  textarea {
    resize: vertical;
  }
}
</style>

<style lang="less">
.product-template-select-modal {
  .ant-modal-body {
    padding-top: 16px;
  }
}

.product-template-select-modal__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-template-select-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.product-template-select-toolbar__search {
  width: 320px;
  max-width: 100%;
}

.product-template-select-toolbar__hint {
  margin-left: auto;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.product-template-select-table {
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }

  .ant-table-tbody > tr {
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f5f9ff;
  }

  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: #e6f4ff;
  }
}
</style>
