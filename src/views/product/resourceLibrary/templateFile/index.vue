<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Modal, message, type TableColumnsType, type UploadProps } from 'ant-design-vue';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileOutlined } from '@ant-design/icons-vue';
import { AdminApiReportPreparation, type ReportPreparationTemplateDTO } from '@/api/tags/product/报告编制';
import { handleEpcDownload, normalizePdfViewerUrl, parseUploadFileResponse } from '@/utils/file';
import { ContentType, httpClient } from '@/api/tags/http-client';
import { usePagination } from '@/hooks/usePagination';
import { useUserStore } from '@/store/modules/user';

const router = useRouter();
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

const columns: TableColumnsType = [
  { title: '文件编号', dataIndex: 'para1', key: 'para1', align: 'center', ellipsis: true },
  { title: '文件名称', dataIndex: 'para2', key: 'para2', align: 'center', ellipsis: true },
  { title: '附件', key: 'attachment', align: 'center', width: 140 },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: ReportPreparationTemplateDTO[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
}));

const deleteDisabled = computed(() => selectedRowKeys.value.length === 0);
const editDisabled = computed(() => selectedRowKeys.value.length !== 1);

const modalVisible = ref(false);
const modalTitle = ref('添加');
const isEdit = ref(false);

const formModel = reactive({
  id: undefined as string | number | undefined,
  para1: '',
  para2: '',
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
  formModel.fileId = normalized.fileId != null ? String(normalized.fileId) : fallback?.fileId != null ? String(fallback.fileId) : undefined;
  formModel.oldFileName = resolveAttachmentName(normalized, fallback);
}

function resetForm() {
  formModel.id = undefined;
  formModel.para1 = '';
  formModel.para2 = '';
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

function openEditModal() {
  if (editDisabled.value) {
    message.warning('请选择一条数据进行编辑');
    return;
  }
  const row = selectedRows.value[0];
  if (!row?.id) {
    return;
  }
  isEdit.value = true;
  modalTitle.value = '修改';
  fillEditForm(row, row);
  modalVisible.value = true;
}

function handleDelete() {
  if (deleteDisabled.value) {
    message.warning('请选择要删除的数据');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 条模板吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      for (const id of selectedRowKeys.value) {
        await AdminApiReportPreparation.delete(id);
      }
      message.success('删除成功');
      await loadPage();
    },
  });
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
  const payload: ReportPreparationTemplateDTO = {
    id: formModel.id,
    para1: formModel.para1.trim(),
    para2: formModel.para2.trim(),
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
  const pdfUrl = normalizePdfViewerUrl(resolveFullPdfUrl(record), record.fileId);
  if (!pdfUrl) {
    message.warning('暂无 PDF 预览地址');
    return;
  }
  router.push({
    path: '/knowledge/pdfView',
    query: {
      docId: pdfUrl,
      ...(record.fileId ? { fileId: String(record.fileId) } : {}),
    },
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
      <a-button type="primary" class="toolbar-btn" :disabled="editDisabled" @click="openEditModal">
        <template #icon><EditOutlined /></template>
        编辑
      </a-button>
      <a-button class="toolbar-btn" :disabled="deleteDisabled" @click="handleDelete">
        <template #icon><DeleteOutlined /></template>
        删除
      </a-button>
    </div>

    <a-table
      row-key="id"
      bordered
      size="small"
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ y: 'calc(100vh - 260px)' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'attachment'">
          <a-space>
            <a @click="handlePreview(record)">查看</a>
            <a @click="handleDownload(record)">下载</a>
          </a-space>
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
</style>
