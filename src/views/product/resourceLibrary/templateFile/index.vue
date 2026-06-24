<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Modal, message, type TableColumnsType, type UploadProps } from 'ant-design-vue';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import reportTempImg from '@/assets/images/reportTemp.png';
import { AdminApiReportPreparation, type ReportPreparationTemplateDTO } from '@/api/tags/product/报告编制';
import { handleEpcDownload, parseUploadFileResponse } from '@/utils/file';
import { formatDate } from '@/utils/formatTime';
import { ContentType, httpClient } from '@/api/tags/http-client';
import { usePagination } from '@/hooks/usePagination';
import { useUserStore } from '@/store/modules/user';
import TableCellOverflowTooltip from '@/views/product/parameter/components/TableCellOverflowTooltip.vue';
import TemplateFilePreviewModal from './template-file-preview-modal.vue';

const router = useRouter();
const previewModalRef = ref<InstanceType<typeof TemplateFilePreviewModal> | null>(null);
const userStore = useUserStore();
const useForm = Form.useForm;

const loading = ref(false);
const uploadLoading = ref(false);
const keyword = ref('');
const tableData = ref<ReportPreparationTemplateDTO[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const selectedRows = ref<ReportPreparationTemplateDTO[]>([]);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
});

const { pagination, resetPagination } = usePagination(queryParams, loadPage);
pagination.showTotal = (total: number) => `共 ${total} 条`;

function pickFirstText(record: ReportPreparationTemplateDTO, keys: string[]) {
  const row = record as Record<string, unknown>;
  for (const key of keys) {
    const v = row[key];
    if (v != null && String(v).trim() !== '') {
      return String(v).trim();
    }
  }
  return '';
}

function fileExtFromName(name: string) {
  const s = String(name ?? '').trim();
  const i = s.lastIndexOf('.');
  return i >= 0 ? s.slice(i + 1).toLowerCase() : '';
}

function resolveCreatorName(record: ReportPreparationTemplateDTO) {
  return pickFirstText(record, ['creatorName', 'createUserName', 'createName', 'createUser']);
}

function resolveCreateTime(record: ReportPreparationTemplateDTO) {
  return pickFirstText(record, ['createTime', 'createData', 'gmtCreate']);
}

function formatCreateTimeDisplay(record: ReportPreparationTemplateDTO) {
  const raw = resolveCreateTime(record);
  if (!raw) {
    return '';
  }
  return formatDate(raw as unknown as Date, 'YYYY-MM-DD');
}

function resolveRemark(record: ReportPreparationTemplateDTO) {
  return pickFirstText(record, ['remark', 'remarks']);
}

/** 发布状态：0 未发布，1 已发布 */
function resolvePublishStatus(record: ReportPreparationTemplateDTO) {
  const row = record as Record<string, unknown>;
  const raw = row.status ?? row.publishStatus ?? row.publish_status;
  if (raw == null || String(raw).trim() === '') {
    return 0;
  }
  return Number(raw) === 1 ? 1 : 0;
}

function isPublished(record: ReportPreparationTemplateDTO) {
  return resolvePublishStatus(record) === 1;
}

function resolveFileType(record: ReportPreparationTemplateDTO) {
  const row = record as Record<string, unknown>;
  const direct = row.fileType ?? row.suffix ?? row.fileExtension;
  if (direct != null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  const name = record.oldFileName || record.fileName || '';
  return fileExtFromName(name) || '';
}

const TABLE_SELECTION_COL_WIDTH_PX = 60;
const SCROLL_X_BUFFER_PX = 2;

/** 操作列宽度（5 个操作用 --main-operation5-width） */
const operationWidth = computed(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root!).getPropertyValue('--main-operation5-width');
  return Number(width) || 250;
});

const columns = computed<TableColumnsType>(() => [
  { title: '文件编号', dataIndex: 'para1', key: 'para1', align: 'center', ellipsis: true, width: 140 },

  {
    title: '文件类型',
    dataIndex: 'fileType',
    key: 'fileType',
    align: 'center',
    ellipsis: true,
    width: 90,
    customRender: ({ record }) => resolveFileType(record as ReportPreparationTemplateDTO) || '—',
  },
  { title: '文件名称', dataIndex: 'para2', key: 'para2', align: 'center', ellipsis: true, width: 200 },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    align: 'center',
    ellipsis: true,
    width: 100,
    customRender: ({ record }) => resolveCreatorName(record as ReportPreparationTemplateDTO) || '—',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    ellipsis: true,
    width: 120,
    customRender: ({ record }) => formatCreateTimeDisplay(record as ReportPreparationTemplateDTO) || '—',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    ellipsis: true,
    width: 160,
  },
  {
    title: '发布状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: operationWidth.value,
    fixed: 'right',
  },
]);

const tableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + TABLE_SELECTION_COL_WIDTH_PX + SCROLL_X_BUFFER_PX;
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: ReportPreparationTemplateDTO[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

const deleteDisabled = computed(() => {
  if (selectedRowKeys.value.length === 0) {
    return true;
  }
  return selectedRows.value.some(row => isPublished(row));
});
const editDisabled = computed(() => {
  if (selectedRowKeys.value.length !== 1) {
    return true;
  }
  return isPublished(selectedRows.value[0]);
});

const modalVisible = ref(false);
const modalTitle = ref('添加');
const isEdit = ref(false);

const formModel = reactive({
  id: undefined as string | number | undefined,
  para1: '',
  para2: '',
  remark: '',
  /** 雪花 ID 必须保持字符串，Number() 会丢失精度 */
  fileId: undefined as string | undefined,
  oldFileName: '',
});

const formRules = reactive({
  para1: [{ required: true, message: '请输入文件编号', trigger: 'blur' }],
  para2: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
  fileId: [{ required: true, message: '请选择附件', trigger: 'change' }],
});

const { resetFields, validate, validateInfos } = useForm(formModel, formRules);

function unwrapPage(res: any) {
  return res?.data?.data ?? res?.data ?? {};
}

function unwrapData<T>(res: any): T | undefined {
  return res?.data?.data ?? res?.data;
}

/** 将列表中的 pdfUrl 补全为可访问的完整地址 */
function resolveFullPdfUrl(record: ReportPreparationTemplateDTO) {
  const pdfUrl = record.pdfUrl?.trim();
  if (!pdfUrl) {
    return '';
  }
  if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
    return pdfUrl;
  }
  const fileUrl = record.fileUrl || '';
  const slashIdx = fileUrl.lastIndexOf('/');
  if (slashIdx > 0) {
    return `${fileUrl.substring(0, slashIdx + 1)}${pdfUrl}`;
  }
  return pdfUrl;
}

async function loadPage() {
  loading.value = true;
  try {
    queryParams.keyword = keyword.value.trim();
    const res = await AdminApiReportPreparation.getPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      keyword: queryParams.keyword || undefined,
    });
    const page = unwrapPage(res);
    tableData.value = (page.list ?? []).map((item: ReportPreparationTemplateDTO) => normalizeRecord(item)!);
    pagination.total = page.total ?? 0;
    pagination.current = queryParams.pageNo;
    pagination.pageSize = queryParams.pageSize;
    selectedRowKeys.value = [];
    selectedRows.value = [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  resetPagination(queryParams);
  loadPage();
}

function normalizeRecord(record?: ReportPreparationTemplateDTO | null): ReportPreparationTemplateDTO | null {
  if (!record) {
    return null;
  }
  return {
    ...record,
    id: record.id,
    fileId: record.fileId != null ? String(record.fileId) : undefined,
  };
}

function resolveAttachmentName(data: ReportPreparationTemplateDTO, fallbackRow?: ReportPreparationTemplateDTO) {
  const name = data.oldFileName ?? data.fileName ?? fallbackRow?.oldFileName ?? fallbackRow?.fileName ?? '';
  if (name) {
    return name;
  }
  const fileId = data.fileId ?? fallbackRow?.fileId;
  if (fileId) {
    const base = data.para2 ?? fallbackRow?.para2 ?? '';
    return base ? `${base}.docx` : '已上传附件';
  }
  return '';
}

function fillEditForm(data: ReportPreparationTemplateDTO, fallbackRow?: ReportPreparationTemplateDTO) {
  const normalized = normalizeRecord(data) ?? data;
  const fallback = normalizeRecord(fallbackRow) ?? fallbackRow;
  formModel.id = normalized.id;
  formModel.para1 = normalized.para1 ?? '';
  formModel.para2 = normalized.para2 ?? '';
  formModel.remark = resolveRemark(normalized) || (fallback ? resolveRemark(fallback) : '');
  formModel.fileId = normalized.fileId != null ? String(normalized.fileId) : fallback?.fileId != null ? String(fallback.fileId) : undefined;
  formModel.oldFileName = resolveAttachmentName(normalized, fallback);
}

function resetForm() {
  formModel.id = undefined;
  formModel.para1 = '';
  formModel.para2 = '';
  formModel.remark = '';
  formModel.fileId = undefined;
  formModel.oldFileName = '';
  resetFields();
}

function openAddModal() {
  isEdit.value = false;
  modalTitle.value = '添加';
  modalVisible.value = true;
  resetForm();
}

function openEditRow(row?: ReportPreparationTemplateDTO) {
  const target = row ?? selectedRows.value[0];
  if (!row && editDisabled.value) {
    message.warning('请选择一条数据进行编辑');
    return;
  }
  if (!target?.id) {
    return;
  }
  if (isPublished(target)) {
    message.warning('已发布的数据不能编辑');
    return;
  }
  isEdit.value = true;
  modalTitle.value = '修改';
  fillEditForm(target, target);
  modalVisible.value = true;
}

function openEditModal() {
  openEditRow();
}

function confirmDelete(ids: (string | number)[]) {
  if (!ids.length) {
    message.warning('请选择要删除的数据');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: ids.length === 1 ? '确定删除该模板吗？' : `确定删除选中的 ${ids.length} 条模板吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      for (const id of ids) {
        await AdminApiReportPreparation.delete(id);
      }
      message.success('删除成功');
      await loadPage();
    },
  });
}

function handleDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的数据');
    return;
  }
  if (selectedRows.value.some(row => isPublished(row))) {
    message.warning('已发布的数据不能删除');
    return;
  }
  confirmDelete(selectedRowKeys.value);
}

async function handleRowDeleteConfirm(row: ReportPreparationTemplateDTO) {
  if (row?.id == null) {
    return;
  }
  if (isPublished(row)) {
    message.warning('已发布的数据不能删除');
    return;
  }
  await AdminApiReportPreparation.delete(row.id);
  message.success('删除成功');
  await loadPage();
}

function removeAttachment() {
  formModel.fileId = undefined;
  formModel.oldFileName = '';
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const okSize = file.size / 1024 / 1024 < 50;
  if (!okSize) {
    message.warning('上传文件大小不能超过 50M');
  }
  return okSize;
};

const customUpload: UploadProps['customRequest'] = async options => {
  const { file, onSuccess, onError } = options;
  uploadLoading.value = true;
  try {
    const uploadRes = await httpClient.request(
      {
        path: 'system-service/fileManagerController/uploadWordToPDF.json',
        method: 'POST',
        body: {
          file: file as File,
          userId: Number(userStore.getUser?.id ?? 0),
          confidentialLevel: '1',
        },
        secure: true,
        type: ContentType.FormData,
      },
      Object,
    );
    const { ok, fileId, oldFileName, errMsg } = parseUploadFileResponse(uploadRes?.data);
    if (!ok) {
      onError?.(new Error(errMsg || '上传失败'));
      message.error(errMsg || '上传失败');
      return;
    }
    formModel.fileId = fileId;
    formModel.oldFileName = oldFileName || (file as File).name;
    onSuccess?.(uploadRes);
    message.success('上传成功');
  } catch (e) {
    onError?.(e as Error);
  } finally {
    uploadLoading.value = false;
  }
};

async function handleModalOk() {
  try {
    await validate();
  } catch {
    return;
  }
  const remark = formModel.remark.trim();
  const payload: ReportPreparationTemplateDTO = {
    id: formModel.id,
    para1: formModel.para1.trim(),
    para2: formModel.para2.trim(),
    remark: remark || undefined,
    remarks: remark || undefined,
    fileId: formModel.fileId,
  };
  try {
    if (isEdit.value) {
      await AdminApiReportPreparation.update(payload);
      message.success('修改成功');
    } else {
      await AdminApiReportPreparation.create(payload);
      message.success('添加成功');
    }
    modalVisible.value = false;
    await loadPage();
  } catch (e) {
    console.error(e);
  }
}

function handlePreview(record: ReportPreparationTemplateDTO) {
  if (isPublished(record)) {
    if (record.id == null) {
      message.warning('缺少模板ID');
      return;
    }
    if (!record.fileId) {
      message.warning('暂无模板文件');
      return;
    }
    previewModalRef.value?.open({
      templateId: record.id,
      fileId: record.fileId,
      templateName: record.para2 || record.para1 || '',
    });
    return;
  }
  const pdfUrl = resolveFullPdfUrl(record);
  if (!pdfUrl) {
    message.warning('暂无 PDF 预览地址');
    return;
  }
  router.push({
    path: '/knowledge/pdfView',
    query: { docId: pdfUrl },
  });
}

function handleDownload(record: ReportPreparationTemplateDTO) {
  if (record.fileUrl) {
    window.open(record.fileUrl);
    return;
  }
  if (!record.fileId) {
    message.warning('暂无附件');
    return;
  }
  const fileName = record.oldFileName || record.fileName || record.para2 || '模板文件';
  handleEpcDownload({ fileId: String(record.fileId) }, fileName);
}

function buildStatusUpdatePayload(record: ReportPreparationTemplateDTO, status: 0 | 1): ReportPreparationTemplateDTO {
  const normalized = normalizeRecord(record) ?? record;
  const remark = resolveRemark(normalized);
  return {
    id: normalized.id,
    para1: normalized.para1,
    para2: normalized.para2,
    remark: remark || undefined,
    remarks: remark || undefined,
    fileId: normalized.fileId,
    status,
  };
}

async function handlePublish(record: ReportPreparationTemplateDTO) {
  if (record?.id == null) {
    return;
  }
  try {
    await AdminApiReportPreparation.update(buildStatusUpdatePayload(record, 1));
    message.success('发布成功');
    await loadPage();
  } catch (e) {
    console.error(e);
  }
}

async function handleCancelPublish(record: ReportPreparationTemplateDTO) {
  if (record?.id == null) {
    return;
  }
  try {
    await AdminApiReportPreparation.update(buildStatusUpdatePayload(record, 0));
    message.success('取消发布成功');
    await loadPage();
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  loadPage();
});
</script>

<template>
  <div class="template-file-page">
    <div class="toolbar">
      <div class="toolbar-search">
        <a-input v-model:value="keyword" placeholder="请输入关键字" allow-clear style="width: 220px" @press-enter="handleSearch" />
        <a-button type="primary" class="search-btn" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </div>
      <a-button type="primary" class="toolbar-btn" @click="openAddModal">
        <template #icon><PlusCircleOutlined /></template>
        添加
      </a-button>
      <a-popover trigger="hover" placement="bottomRight" :overlay-inner-style="{ padding: '8px' }">
        <template #content>
          <img :src="reportTempImg" alt="模板说明" class="report-temp-help-img" />
        </template>
        <QuestionCircleOutlined class="toolbar-help-icon" />
      </a-popover>
    </div>

    <a-table
      class="exe-config-table template-file-table"
      row-key="id"
      bordered
      size="small"
      table-layout="fixed"
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: tableScrollX, y: 'calc(100vh - 260px)' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="!isPublished(record)" :class="['exe-status-tag', 'exe-status-tag--off']">未发布</a-tag>
          <a-tag v-else :class="['exe-status-tag', 'exe-status-tag--on']">已发布</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'remark'">
          <TableCellOverflowTooltip :text="resolveRemark(record) || '—'" />
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="calc-operation-links" @click.stop>
            <span v-if="isPublished(record)" class="calc-operation-links__disabled">编辑</span>
            <a v-else href="#" @click.prevent="openEditRow(record)">编辑</a>
            <a-popconfirm
              placement="topLeft"
              title="确定要删除吗？"
              ok-text="确定"
              cancel-text="取消"
              :disabled="isPublished(record)"
              @confirm.stop.prevent="handleRowDeleteConfirm(record)">
              <a
                href="#"
                :class="['calc-operation-links__danger', { 'calc-operation-links__disabled': isPublished(record) }]"
                @click.prevent>
                删除
              </a>
            </a-popconfirm>
            <a @click.stop.prevent="handlePreview(record)">预览</a>
            <a @click.stop.prevent="handleDownload(record)">下载</a>
            <a-popconfirm
              v-if="!isPublished(record)"
              placement="topLeft"
              title="确定要发布吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm.stop.prevent="handlePublish(record)">
              <a href="#" @click.prevent>发布</a>
            </a-popconfirm>
            <a-popconfirm
              v-else
              placement="topLeft"
              title="确定要取消发布吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm.stop.prevent="handleCancelPublish(record)">
              <a href="#" @click.prevent>取消发布</a>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="560" :mask-closable="false" destroy-on-close @cancel="modalVisible = false">
      <a-form :label-col="{ style: { width: '100px' } }">
        <a-form-item label="文件编号" v-bind="validateInfos.para1" required>
          <a-input v-model:value="formModel.para1" placeholder="请输入文件编号" allow-clear />
        </a-form-item>
        <a-form-item label="文件名称" v-bind="validateInfos.para2" required>
          <a-input v-model:value="formModel.para2" placeholder="请输入文件名称" allow-clear />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="formModel.remark" placeholder="请输入备注" :rows="4" allow-clear />
        </a-form-item>
        <a-form-item label="附件" v-bind="validateInfos.fileId" required>
          <a-input v-if="formModel.fileId" :value="formModel.oldFileName || '已上传附件'" readonly class="attachment-name-input">
            <template #suffix>
              <a class="attachment-remove" @click.stop="removeAttachment">删除</a>
            </template>
          </a-input>
          <a-input v-else value="" placeholder="请选择附件" readonly />
          <a-upload :show-upload-list="false" :before-upload="beforeUpload" :custom-request="customUpload">
            <a-button class="upload-btn" :loading="uploadLoading">
              <template #icon><FileOutlined /></template>
              选择文件
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="handleModalOk">确定</a-button>
        <a-button @click="modalVisible = false">取消</a-button>
      </template>
    </a-modal>

    <TemplateFilePreviewModal ref="previewModalRef" />
  </div>
</template>

<style lang="less" scoped>
.template-file-page {
  width: 100%;
  min-height: 100%;
  padding: 16px 20px;
  box-sizing: border-box;
  background: #fff;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-btn {
  margin-right: 4px;
}

.toolbar-help-icon {
  font-size: 18px;
  color: #1890ff;
  cursor: pointer;
}

.report-temp-help-img {
  display: block;
  max-width: min(90vw, 800px);
  max-height: 70vh;
}

.toolbar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.attachment-name-input {
  margin-bottom: 10px;
}

.attachment-remove {
  color: #1677ff;
  white-space: nowrap;
}

.upload-btn {
  margin-top: 4px;
}

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

/* 与 parameter/index.vue 操作列一致：竖线分隔、右侧固定 */
.template-file-table {
  :deep(.ant-table-cell[data-column-key='remark']),
  :deep(.ant-table-cell[data-column-key='operation']) {
    text-align: left;
  }

  :deep(.calc-operation-links__disabled),
  :deep(.calc-operation-links a.calc-operation-links__disabled) {
    color: rgba(0, 0, 0, 0.25) !important;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  row-gap: 6px;
  column-gap: 0;

  > * {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 2px @exe-op-links-line-gap;
    line-height: inherit;
    font-size: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:first-child) {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: @exe-op-links-divider-h;
        margin-left: -0.5px;
        background: @exe-op-links-divider;
        transform: translateY(-50%);
        pointer-events: none;
      }
    }
  }
}

.calc-operation-links__danger {
  color: #ff4d4f;
}

.calc-operation-links__disabled {
  pointer-events: none;
  color: rgba(0, 0, 0, 0.25) !important;
}

.calc-operation-links__danger.calc-operation-links__disabled {
  color: rgba(0, 0, 0, 0.25) !important;
}

.exe-status-tag {
  margin: 0;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  padding: 0 10px;
  border-style: solid;
  border-width: 1px;
}

.exe-status-tag--on {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.exe-status-tag--off {
  color: rgba(0, 0, 0, 0.65);
  background: #fafafa;
  border-color: #d9d9d9;
}
</style>
