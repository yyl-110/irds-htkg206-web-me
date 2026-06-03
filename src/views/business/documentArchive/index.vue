<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { Modal, Tooltip, message, type UploadChangeParam } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import UploadModal from '@/views/product/components/upload-modal.vue';
import { Pane, Splitpanes } from 'splitpanes';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import dayjs, { type Dayjs } from 'dayjs';
import Tree from '@/components/tree/tree.vue';
import { AdminApiDocumentArchive } from '@/api/tags/docarchive/文档归档';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { toSnowflakeIdStr } from '@/utils/snowflakeId';
import { findNodeByIdFromKey } from '@/utils/tools';
import { handleEpcDownload } from '@/utils/file';

const userStore = useUserStore();
/** 编辑弹窗 / 嵌套上传弹窗层级（后者须高于前者，避免被父级遮罩盖住） */
const DOC_EDIT_MODAL_Z_INDEX = 1000;
const DOC_EDIT_UPLOAD_MODAL_Z_INDEX = 1100;
const { leftTreeCollapsed, leftTreePaneSize, rightTreePaneSize, minExpanded, onSplitpanesResized, toggleLeftTreePanel, splitToggleStyle, splitpanesTreeCollapseWrapClass } =
  useSplitpanesTreeCollapse();

const loadingTree = ref(false);
const loadingTable = ref(false);
const treeData = ref<any[]>([]);
const rawTreeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>('');
const currentNode = ref<any>(null);
const treePage = ref<any>(null);
const treeNodeColmoun = ref<any[]>([]);

const query = reactive({
  fileName: '',
  fileNumber: '',
  archiveCode: '',
  pageNo: 1,
  pageSize: 10,
});

const tableData = ref<any[]>([]);
const total = ref(0);

const docModalVisible = ref(false);
const docModalTitle = ref('上传归档');
const docModalMode = ref<'create' | 'edit'>('create');
const modalCategoryLabel = ref('');
const uploadedFileId = ref('');
const docForm = reactive({
  id: '',
  categoryId: '',
  fileName: '',
  fileNumber: '',
  fileFormat: '',
  fileId: '',
  archiveDate: undefined as Dayjs | undefined,
  confidentialLevel: undefined as number | undefined,
});

const historyVisible = ref(false);
const historyList = ref<any[]>([]);
const historyLoading = ref(false);

/** 上传归档弹窗（密级 + 拖拽上传） */
const uploadModalVisible = ref(false);
const editUploadModalVisible = ref(false);
const uploadFileList = ref<UploadFile[]>([]);
const editUploadFileList = ref<UploadFile[]>([]);
const uploadConfidentialLevel = ref<number | undefined>(undefined);
const editUploadConfidentialLevel = ref<number | undefined>(undefined);
/** 编辑时原始 fileId，用于判断是否换文件升版 */
const originalFileIdOnEdit = ref('');
const editFileReplaced = ref(false);
/** 上传时锁定的分类 ID（字符串，避免雪花 ID 精度丢失） */
const uploadTargetCategoryId = ref<string>('');
const createArchiveLoading = ref(false);
/** 上传成功后的 fileId 与原始响应（Upload 受控列表未同步时的兜底） */
const uploadedFileIdCache = ref('');
const uploadResponseCache = ref<unknown>(null);

const editRecordMeta = reactive({
  archiveCode: '',
  docVersionNo: '',
});

function normalizeArchiveRow(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: toSnowflakeIdStr(row.id),
    fileId: toSnowflakeIdStr(row.fileId),
    categoryId: toSnowflakeIdStr(row.categoryId),
    docGroupId: row.docGroupId != null ? toSnowflakeIdStr(row.docGroupId) : row.docGroupId,
    fileInfo: row.fileInfo
      ? { ...row.fileInfo, id: toSnowflakeIdStr(row.fileInfo.id ?? row.fileId) }
      : row.fileInfo,
  };
}

function resolveRecordFileId(record: any): string {
  return toSnowflakeIdStr(record?.fileId ?? record?.fileInfo?.id);
}

const confidentialOptions = computed(() => userStore.getConfidentialLevel || []);

function downloadArchiveFile(record: any) {
  const fileId = resolveRecordFileId(record);
  if (!fileId) {
    message.warning('暂无文件');
    return;
  }
  const fileName = record.fileName || record.fileInfo?.oldFileName || 'file';
  handleEpcDownload({ fileId }, fileName);
}

/** 转为统一 Tree 组件节点结构（与设计活动页一致） */
function findFirstLeafNode(nodes: any[]): any | null {
  for (const node of nodes || []) {
    if (isLeafCategoryNode(node)) return node;
    const child = findFirstLeafNode(node.children);
    if (child) return child;
  }
  return null;
}

function normalizeCategoryTree(data: any[]): any[] {
  if (!data?.length) return [];
  return data.map(item => ({
    ...item,
    id: toSnowflakeIdStr(item.id),
    parentId: item.parentId != null ? toSnowflakeIdStr(item.parentId) : item.parentId,
    children: item.children?.length ? normalizeCategoryTree(item.children) : [],
  }));
}

function convertToTreeNodes(data: any[]): any[] {
  if (!data?.length) return [];
  return data.map(item => {
    const id = toSnowflakeIdStr(item.id);
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    const countSuffix = item.docCount != null && item.docCount > 0 ? ` (${item.docCount})` : '';
    return {
      id,
      key: id,
      partName: `${item.name || ''}${countSuffix}`,
      parentId: item.parentId != null ? toSnowflakeIdStr(item.parentId) : item.parentId,
      fixedFlag: item.fixedFlag,
      level: hasChildren ? 2 : 3,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  if (!nodes?.length) return [];
  const kw = searchValue.toLowerCase();
  return nodes
    .map(node => {
      const name = String(node.name || '');
      const isMatch = name.toLowerCase().includes(kw);
      let matchingChildren: any[] = [];
      if (node.children?.length) {
        matchingChildren = filterTreeNodes(node.children, searchValue);
      }
      if (isMatch || matchingChildren.length > 0) {
        return { ...node, children: matchingChildren };
      }
      return null;
    })
    .filter(Boolean) as any[];
}

async function loadTree(type?: string) {
  loadingTree.value = true;
  try {
    const res = await AdminApiDocumentArchive.getCategoryTree();
    if (res?.data?.code === 200) {
      const list = normalizeCategoryTree(res.data.data || []);
      rawTreeData.value = list;
      const treeNodes = convertToTreeNodes(list);
      treeData.value = treeNodes;
      if (treeNodes.length > 0) {
        selectedKeys.value = '';
        await nextTick();
        if (type && getNodeKey(currentNode.value)) {
          const keepKey = getNodeKey(currentNode.value);
          const rootNode = findNodeByIdFromKey(treeData.value, keepKey, 'key');
          if (rootNode) {
            selectedKeys.value = rootNode.key;
            expandedKeys.value = rootNode.key;
            selectNode(rootNode);
          } else {
            selectedKeys.value = keepKey;
            loadTable();
          }
        } else {
          const firstNode = findFirstLeafNode(treeNodes) || treeNodes[0];
          selectedKeys.value = firstNode.key;
          expandedKeys.value = firstNode.key;
          selectNode(firstNode);
        }
      } else {
        tableData.value = [];
        total.value = 0;
      }
    }
  } catch {
    message.error('加载分类树失败');
  } finally {
    loadingTree.value = false;
  }
}

function getNodeKey(node: any): string {
  if (!node) return '';
  const data = node.dataRef ?? node;
  return toSnowflakeIdStr(data.key ?? data.id ?? node.key ?? node.id);
}

function resolveCategoryId(): string {
  return getNodeKey(currentNode.value) || toSnowflakeIdStr(selectedKeys.value);
}

/** 仅叶子分类可归档，避免归档到父节点后在子分类下列表为空 */
function isLeafCategoryNode(node: any): boolean {
  if (!node) return false;
  const data = node.dataRef ?? node;
  const children = data.children;
  return !children || !Array.isArray(children) || children.length === 0;
}

async function loadTable() {
  const categoryId = resolveCategoryId();
  if (!categoryId) {
    tableData.value = [];
    total.value = 0;
    return;
  }
  loadingTable.value = true;
  try {
    const res = await AdminApiDocumentArchive.getArchivePage({
      categoryId,
      includeChildren: true,
      fileName: query.fileName || undefined,
      fileNumber: query.fileNumber || undefined,
      archiveCode: query.archiveCode || undefined,
      pageNo: query.pageNo,
      pageSize: query.pageSize,
    });
    if (res?.data?.code === 200) {
      tableData.value = (res.data.data?.list || []).map(normalizeArchiveRow);
      total.value = Number(res.data.data?.total || 0);
    } else {
      tableData.value = [];
      total.value = 0;
      message.error(res?.data?.msg || '加载归档列表失败');
    }
  } catch {
    message.error('加载归档列表失败');
  } finally {
    loadingTable.value = false;
  }
}

function selectNode(node: any) {
  const key = getNodeKey(node);
  currentNode.value = node?.key != null || node?.dataRef ? node : { ...node, key };
  selectedKeys.value = key;
  query.pageNo = 1;
  loadTable();
}

function getSelectedCategoryId() {
  return resolveCategoryId();
}

function initDefaultConfidentialLevel(target: { value: number | undefined }) {
  const opts = confidentialOptions.value;
  if (opts?.length) {
    target.value = Number(opts[0].value);
  } else {
    target.value = 0;
  }
}

/** 点击「上传归档」：校验树节点后打开上传弹窗（先选密级再上传） */
function handleUploadArchiveClick() {
  if (!getSelectedCategoryId()) {
    message.warning('请先在左侧选择文件类型（树节点）');
    return;
  }
  if (!isLeafCategoryNode(currentNode.value)) {
    message.warning('请选择具体文件类型（如：设计文件、计算文件），不能在父级分类文件夹上直接归档');
    return;
  }
  initDefaultConfidentialLevel(uploadConfidentialLevel);
  uploadFileList.value = [];
  uploadedFileIdCache.value = '';
  uploadResponseCache.value = null;
  uploadTargetCategoryId.value = resolveCategoryId();
  if (!uploadTargetCategoryId.value) {
    message.warning('无法识别当前分类，请重新选择树节点');
    return;
  }
  uploadModalVisible.value = true;
}

function beforeArchiveUpload() {
  if (uploadConfidentialLevel.value == null || Number.isNaN(Number(uploadConfidentialLevel.value))) {
    message.warning('请先选择附件密级');
    return false;
  }
  return true;
}

function beforeEditArchiveUpload() {
  if (editUploadConfidentialLevel.value == null || Number.isNaN(Number(editUploadConfidentialLevel.value))) {
    message.warning('请先选择附件密级');
    return false;
  }
  return true;
}

/** 兼容 upload.json：① CommonResult { code, data }；② 直接返回文件 DTO */
function parseUploadFileResult(raw: unknown): {
  ok: boolean;
  fileId: string;
  record: Record<string, unknown>;
  responseBody: unknown;
  errMsg?: string;
} {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, fileId: '', record: {}, responseBody: raw, errMsg: '响应为空' };
  }
  const body = raw as Record<string, unknown>;
  const code = body.code;
  const successCodes: Array<number | string> = [0, 200, '0', '200'];
  if (code !== undefined && code !== null && !successCodes.includes(code as number | string)) {
    return { ok: false, fileId: '', record: {}, responseBody: raw, errMsg: String(body.msg ?? '上传失败') };
  }
  let record: Record<string, unknown> = body;
  const nested = body.data;
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id != null) {
    record = nested as Record<string, unknown>;
  } else if (body.id == null && body.queryId == null && nested && typeof nested === 'object') {
    record = nested as Record<string, unknown>;
  }
  const fileId = String(record.id ?? record.queryId ?? '').trim();
  if (!fileId) {
    return { ok: false, fileId: '', record: {}, responseBody: raw, errMsg: '未获取到上传文件ID' };
  }
  return { ok: true, fileId, record, responseBody: raw };
}

function parseFileIdFromUploadFile(file?: UploadFile): string {
  if (!file) return uploadedFileIdCache.value || '';
  const fromRes = parseUploadId(file.response);
  if (fromRes) return fromRes;
  const anyFile = file as UploadFile & { id?: string; queryId?: string };
  const direct = String(anyFile.id ?? anyFile.queryId ?? '').trim();
  if (direct) return direct;
  return uploadedFileIdCache.value || '';
}

type UploadRequestFile = File & { uid?: string };

function syncUploadFileListDone(
  targetList: typeof uploadFileList,
  file: UploadRequestFile,
  responseBody: unknown,
  displayName: string,
) {
  targetList.value = [
    {
      uid: file.uid || `upload-${Date.now()}`,
      name: displayName,
      status: 'done',
      response: responseBody,
    },
  ];
}

async function customRequestCreateUpload(options: {
  file: File | Blob;
  onSuccess?: (body: unknown, file?: File) => void;
  onError?: (e: Error) => void;
}) {
  if (uploadConfidentialLevel.value == null) {
    message.warning('请先选择附件密级');
    options.onError?.(new Error('no confidential level'));
    return;
  }
  const file = options.file as UploadRequestFile;
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file: file as File,
      userId: userStore.getUser.id,
      confidentialLevel: uploadConfidentialLevel.value,
    });
    const { ok, fileId, record, responseBody, errMsg } = parseUploadFileResult(uploadRes?.data ?? uploadRes);
    if (!ok) {
      message.error(errMsg || '上传失败');
      options.onError?.(new Error(errMsg || 'upload failed'));
      return;
    }
    uploadedFileIdCache.value = fileId;
    uploadResponseCache.value = responseBody;
    const displayName = String(record.oldFileName ?? file.name ?? '').trim() || file.name;
    options.onSuccess?.(responseBody, file);
    await nextTick();
    syncUploadFileListDone(uploadFileList, file, responseBody, displayName);
    message.success('文件已上传，请点击确定完成归档');
  } catch (e) {
    options.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

async function customRequestEditUpload(options: {
  file: File | Blob;
  onSuccess?: (body: unknown, file?: File) => void;
  onError?: (e: Error) => void;
}) {
  if (editUploadConfidentialLevel.value == null) {
    message.warning('请先选择附件密级');
    options.onError?.(new Error('no confidential level'));
    return;
  }
  const file = options.file as UploadRequestFile;
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file: file as File,
      userId: userStore.getUser.id,
      confidentialLevel: editUploadConfidentialLevel.value,
    });
    const { ok, fileId, record, responseBody, errMsg } = parseUploadFileResult(uploadRes?.data ?? uploadRes);
    if (!ok) {
      message.error(errMsg || '上传失败');
      options.onError?.(new Error(errMsg || 'upload failed'));
      return;
    }
    uploadedFileIdCache.value = fileId;
    uploadResponseCache.value = responseBody;
    const displayName = String(record.oldFileName ?? file.name ?? '').trim() || file.name;
    options.onSuccess?.(responseBody, file);
    await nextTick();
    syncUploadFileListDone(editUploadFileList, file, responseBody, displayName);
    message.success('上传成功');
  } catch (e) {
    options.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

function onCreateUploadChange(info: UploadChangeParam) {
  if (info.file.status === 'removed') {
    uploadFileList.value = [];
    uploadedFileIdCache.value = '';
    uploadResponseCache.value = null;
    return;
  }
  const last = info.fileList.slice(-1);
  if (!last.length) {
    return;
  }
  const row = last[0];
  if (info.file.status === 'done') {
    if (!row.response && uploadResponseCache.value) {
      row.response = uploadResponseCache.value;
    }
    uploadFileList.value = [{ ...row, status: 'done' }];
  } else {
    uploadFileList.value = last;
  }
}

function onEditUploadChange(info: UploadChangeParam) {
  if (info.file.status === 'removed') {
    editUploadFileList.value = [];
    return;
  }
  const last = info.fileList.slice(-1);
  if (!last.length) {
    return;
  }
  const row = last[0];
  if (info.file.status === 'done') {
    if (!row.response && uploadResponseCache.value) {
      row.response = uploadResponseCache.value;
    }
    editUploadFileList.value = [{ ...row, status: 'done' }];
  } else {
    editUploadFileList.value = last;
  }
}

function removeCreateUploadFile() {
  uploadFileList.value = [];
  uploadedFileIdCache.value = '';
  uploadResponseCache.value = null;
}

function removeEditUploadFile() {
  editUploadFileList.value = [];
}

/** 上传弹窗确定：直接写入归档记录（Network 需出现 document-archive/create） */
async function onCreateUploadConfirm() {
  if (createArchiveLoading.value) return;
  const categoryId = uploadTargetCategoryId.value || resolveCategoryId();
  if (!categoryId) {
    message.warning('请先在左侧选择文件类型（树节点）');
    return;
  }
  const list = uploadFileList.value.filter(f => f.status !== 'removed' && f.status !== 'error');
  const file = list.length ? list[list.length - 1] : undefined;
  const fileId = toSnowflakeIdStr(parseFileIdFromUploadFile(file) || uploadedFileIdCache.value);
  if (!fileId) {
    message.warning('请先上传文件');
    return;
  }
  if (uploadConfidentialLevel.value == null || Number.isNaN(Number(uploadConfidentialLevel.value))) {
    message.warning('请选择密级');
    return;
  }
  const record = parseUploadFileResult(uploadResponseCache.value).record;
  const fileName = String(record.oldFileName ?? file?.name ?? '').trim() || '未命名文件';
  let fileFormat = '';
  if (fileName.includes('.')) {
    fileFormat = fileName.split('.').pop()?.toLowerCase() || '';
  }
  createArchiveLoading.value = true;
  try {
    const res = await AdminApiDocumentArchive.createArchive({
      categoryId,
      fileId,
      fileName,
      fileFormat: fileFormat || undefined,
      archiveDate: dayjs().format('YYYY-MM-DD'),
      confidentialLevel: Number(uploadConfidentialLevel.value),
    });
    if (res?.data?.code !== 200) {
      message.error(res?.data?.msg || '归档失败');
      return;
    }
    message.success('归档成功');
    uploadModalVisible.value = false;
    uploadFileList.value = [];
    uploadedFileIdCache.value = '';
    uploadResponseCache.value = null;
    uploadTargetCategoryId.value = '';
    query.pageNo = 1;
    await loadTable();
    await loadTree('change');
  } catch (e: any) {
    if (!e?.notified) {
      message.error(e?.message || '归档失败，请稍后重试');
    }
  } finally {
    createArchiveLoading.value = false;
  }
}

/** 编辑弹窗内重新上传确定 */
function onEditUploadConfirm() {
  const list = editUploadFileList.value.filter(f => f.status !== 'removed' && f.status !== 'error');
  const file = list.length ? list[list.length - 1] : undefined;
  const fileId = toSnowflakeIdStr(parseFileIdFromUploadFile(file));
  if (!fileId) {
    message.warning('请先上传文件');
    return;
  }
  docForm.fileId = fileId;
  uploadedFileId.value = fileId;
  docForm.confidentialLevel = editUploadConfidentialLevel.value;
  editFileReplaced.value = fileId !== toSnowflakeIdStr(originalFileIdOnEdit.value);
  const fileName = String(file?.name ?? '').trim();
  if (fileName) {
    docForm.fileName = fileName;
    if (fileName.includes('.')) {
      docForm.fileFormat = fileName.split('.').pop()?.toLowerCase() || '';
    }
  }
  editUploadModalVisible.value = false;
  message.success('新文件已上传，保存后将升版');
}

function openEditUploadModal() {
  editUploadConfidentialLevel.value = docForm.confidentialLevel;
  if (editUploadConfidentialLevel.value == null) {
    initDefaultConfidentialLevel(editUploadConfidentialLevel);
  }
  editUploadFileList.value = [];
  uploadedFileIdCache.value = '';
  uploadResponseCache.value = null;
  editUploadModalVisible.value = true;
}

function isFixedNode(node: any) {
  return node?.fixedFlag === 1;
}

async function getNodeAddData(selectedKeysNode: any) {
  const parentNode = currentNode.value ?? selectedKeysNode ?? {};
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: parentNode?.partName || WeiI18n.t('根节点').value,
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'categoryName',
      value: '',
      type: 'input',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点名称不能为空').value }],
    },
    {
      title: 'pid',
      key: 'pid',
      value: parentNode?.key ?? 0,
      type: 'input',
      hidden: true,
      disabled: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

async function getNodeUpdateData(selectedKeysNode: any) {
  if (isFixedNode(selectedKeysNode)) {
    message.warning('固定分类不可编辑');
    return;
  }
  const parentId = String(selectedKeysNode?.parentId ?? '');
  const parentNode = parentId && parentId !== '0' ? findNodeById(treeData.value, parentId) : null;
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: parentNode?.partName ?? '',
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'categoryName',
      value: selectedKeysNode?.partName?.replace(/\s*\(\d+\)\s*$/, '') ?? '',
      type: 'input',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点名称不能为空').value }],
    },
    {
      title: 'id',
      key: 'id',
      value: selectedKeysNode?.key,
      type: 'input',
      hidden: true,
      disabled: true,
    },
    {
      title: 'pid',
      key: 'pid',
      value: selectedKeysNode?.parentId ?? 0,
      type: 'input',
      hidden: true,
      disabled: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

function findNodeById(tree: any[], targetId: string): any | null {
  for (const node of tree || []) {
    if (String(node.key) === String(targetId)) return node;
    if (node.children?.length) {
      const found = findNodeById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

async function submitTreeData(nodeList: any) {
  await AdminApiDocumentArchive.createCategory({
    name: nodeList.categoryName,
    parentId: nodeList.pid ?? 0,
  });
  message.success(WeiI18n.t('保存成功').value);
  await loadTree('change');
}

async function editTreeData(nodeList: any) {
  await AdminApiDocumentArchive.updateCategory({
    id: nodeList.id,
    name: nodeList.categoryName,
    parentId: nodeList.pid ?? 0,
  });
  message.success(WeiI18n.t('修改成功').value);
  await loadTree('change');
}

async function deleteTreeNode(node: any) {
  if (isFixedNode(node)) {
    message.warning('固定分类不可删除');
    return;
  }
  await AdminApiDocumentArchive.deleteCategory({ id: node.key });
  message.success(WeiI18n.t('删除成功').value);
  await loadTree();
}

async function upNode(node: any) {
  await AdminApiDocumentArchive.sortCategoryUp({ id: node.key });
  await loadTree('change');
}

async function downNode(node: any) {
  await AdminApiDocumentArchive.sortCategoryDown({ id: node.key });
  await loadTree('change');
}

async function reloadTree() {
  await loadTree('change');
}

async function handleChangeSelectKey(searchValue: string) {
  if (!searchValue) {
    treeData.value = convertToTreeNodes(rawTreeData.value);
    return;
  }
  const filtered = filterTreeNodes(rawTreeData.value, searchValue);
  treeData.value = convertToTreeNodes(filtered);
}

function parseUploadId(data: any): string {
  const body = data || {};
  const code = body.code;
  if (code !== undefined && code !== 200 && code !== 0) return '';
  const record = body.data && typeof body.data === 'object' ? body.data : body;
  return String(record?.id ?? record?.queryId ?? '');
}

function resetDocForm() {
  docForm.id = '';
  docForm.categoryId = getSelectedCategoryId();
  docForm.fileName = '';
  docForm.fileNumber = '';
  docForm.fileFormat = '';
  docForm.fileId = '';
  docForm.archiveDate = dayjs();
  docForm.confidentialLevel = userStore.getConfidentialLevel?.[0]?.value;
  uploadedFileId.value = '';
  originalFileIdOnEdit.value = '';
  editFileReplaced.value = false;
}

function openDocModal(_mode: 'edit', record?: any) {
  if (!record?.editable) {
    message.warning('仅创建人可编辑');
    return;
  }
  const row = normalizeArchiveRow(record);
  docModalMode.value = 'edit';
  docModalTitle.value = '编辑归档';
  docForm.id = row.id;
  docForm.categoryId = row.categoryId;
  docForm.fileName = row.fileName;
  docForm.fileId = row.fileId;
  originalFileIdOnEdit.value = row.fileId;
  uploadedFileId.value = row.fileId;
  editFileReplaced.value = false;
  editRecordMeta.archiveCode = row.archiveCode || '';
  editRecordMeta.docVersionNo = row.docVersionNo != null ? String(row.docVersionNo) : '';
  modalCategoryLabel.value = row.categoryName || currentCategoryLabel.value;
  docModalVisible.value = true;
}

async function saveDoc() {
  const categoryId = toSnowflakeIdStr(docForm.categoryId);
  if (!categoryId) {
    message.warning('请选择文件类型');
    return;
  }
  if (!docForm.fileName?.trim()) {
    message.warning('请输入文件名称');
    return;
  }
  const upgraded =
    editFileReplaced.value &&
    !!toSnowflakeIdStr(docForm.fileId) &&
    toSnowflakeIdStr(docForm.fileId) !== toSnowflakeIdStr(originalFileIdOnEdit.value);
  const body: Record<string, unknown> = {
    categoryId,
    fileName: docForm.fileName.trim(),
    id: toSnowflakeIdStr(docForm.id),
  };
  if (upgraded) {
    const fileId = toSnowflakeIdStr(docForm.fileId);
    if (!fileId) {
      message.warning('文件ID无效，请重新上传');
      return;
    }
    body.fileId = fileId;
    const fileName = docForm.fileName.trim();
    if (fileName.includes('.')) {
      body.fileFormat = fileName.split('.').pop()?.toLowerCase();
    }
  }
  let res: any;
  try {
    res = await AdminApiDocumentArchive.updateArchive(body);
  } catch (e: any) {
    if (!e?.notified) {
      message.error(e?.message || '保存失败');
    }
    return Promise.reject();
  }
  if (res?.data?.code !== 200) {
    message.error(res?.data?.msg || '保存失败');
    return Promise.reject();
  }
  message.success(upgraded ? '已更换文件并升版' : '保存成功');
  docModalVisible.value = false;
  query.pageNo = 1;
  await loadTable();
  await loadTree('change');
}

async function handleModalOk() {
  try {
    await saveDoc();
  } catch {
    return Promise.reject();
  }
}

function deleteDoc(record: any) {
  if (!record?.editable) {
    message.warning('仅创建人可删除');
    return;
  }
  Modal.confirm({
    title: '删除将移除该文档全部历史版本，确认继续？',
    onOk: async () => {
      await AdminApiDocumentArchive.deleteArchive({ id: toSnowflakeIdStr(record.id) });
      message.success('删除成功');
      await loadTable();
    },
  });
}

async function openHistory(record: any) {
  historyVisible.value = true;
  historyLoading.value = true;
  historyList.value = [];
  try {
    const res = await AdminApiDocumentArchive.listHistory({ id: toSnowflakeIdStr(record.id) });
    if (res?.data?.code === 200) {
      historyList.value = (res.data.data || []).map(normalizeArchiveRow);
    } else {
      message.error(res?.data?.msg || '加载历史版本失败');
    }
  } catch (e: any) {
    if (!e?.notified) {
      message.error(e?.message || '加载历史版本失败');
    }
  } finally {
    historyLoading.value = false;
  }
}

function downloadFile(record: any) {
  downloadArchiveFile(record);
}

const columns = [
  { title: '归档编号', dataIndex: 'archiveCode', width: 140 },
  { title: '文件名称', dataIndex: 'fileName', ellipsis: true },
  { title: '文件编号', dataIndex: 'fileNumber', width: 120 },
  { title: '文件类型', dataIndex: 'categoryName', width: 100 },
  { title: '格式', dataIndex: 'fileFormat', width: 70 },
  { title: '版本', dataIndex: 'docVersionNo', width: 70 },
  { title: '归档日期', dataIndex: 'archiveDate', width: 110 },
  { title: '创建人', dataIndex: 'creatorName', width: 100 },
  { title: '操作', key: 'action', width: 220, fixed: 'right' as const },
];

const currentCategoryLabel = computed(() => {
  const name = currentNode.value?.partName || '';
  return name.replace(/\s*\(\d+\)\s*$/, '');
});

onMounted(() => loadTree());
</script>

<template>
  <div class="drawerContent h-full">
    <div :class="splitpanesTreeCollapseWrapClass" class="h-full">
      <Splitpanes class="default-theme sbom" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
        <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
          <a-spin :spinning="loadingTree" tip="加载中...">
            <Tree
              ref="treePage"
              :operate-flag="true"
              :tree-data="treeData"
              bom-type="unBom"
              :selected-keys="selectedKeys"
              :expanded-keys="expandedKeys"
              @select-node="selectNode"
              @up-node="upNode"
              @down-node="downNode"
              @get-node-update-data="getNodeUpdateData"
              @get-node-add-data="getNodeAddData"
              @delete-tree-node="deleteTreeNode"
              @submit="submitTreeData"
              @edit="editTreeData"
              @reload-tree="reloadTree"
              @change-select-key="handleChangeSelectKey" />
          </a-spin>
        </Pane>

        <Pane class="splitpane-cls doc-archive-right-pane" :size="rightTreePaneSize">
          <div class="doc-archive-pane">
            <a-card class="doc-archive-toolbar-card">
              <a-form layout="inline" class="doc-archive-toolbar-form">
                <a-form-item>
                  <a-input v-model:value="query.archiveCode" allow-clear placeholder="归档编号" style="width: 140px" />
                </a-form-item>
                <a-form-item>
                  <a-input v-model:value="query.fileName" allow-clear placeholder="文件名称" style="width: 140px" />
                </a-form-item>
                <a-form-item>
                  <a-input v-model:value="query.fileNumber" allow-clear placeholder="文件编号" style="width: 140px" />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="() => { query.pageNo = 1; loadTable(); }">查询</a-button>
                  <a-button type="primary" :disabled="!selectedKeys" style="margin-left: 8px" @click="handleUploadArchiveClick">上传归档</a-button>
                </a-form-item>
              </a-form>
            </a-card>

            <div v-if="selectedKeys" class="doc-archive-category-hint">
              当前文件类型：<strong>{{ currentCategoryLabel }}</strong>
              <span class="hint-action" @click="handleUploadArchiveClick">点击上传归档文件</span>
            </div>

            <a-card class="doc-archive-table-card">
              <a-table
                :columns="columns"
                :data-source="tableData"
                :loading="loadingTable"
                row-key="id"
                bordered
                :scroll="{ x: 1200, y: 'calc(100vh - 300px)' }"
                :pagination="{
                  current: query.pageNo,
                  pageSize: query.pageSize,
                  total,
                  showSizeChanger: true,
                  onChange: (p: number, s: number) => {
                    query.pageNo = p;
                    query.pageSize = s;
                    loadTable();
                  },
                }"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'action'">
                    <a-space wrap class="doc-archive-op-links">
                      <a @click.stop="downloadFile(record)">下载</a>
                      <a @click.stop="openHistory(record)">历史版本</a>
                      <a v-if="record.editable" @click.stop="openDocModal('edit', record)">编辑</a>
                      <a v-if="record.editable" class="danger-link" @click.stop="deleteDoc(record)">删除</a>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-card>
          </div>
        </Pane>
      </Splitpanes>

      <Tooltip :title="leftTreeCollapsed ? '展开分类' : '折叠分类'">
        <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle" @click="toggleLeftTreePanel" @mousedown.stop>
          <LeftOutlined v-if="!leftTreeCollapsed" />
          <RightOutlined v-else />
        </button>
      </Tooltip>
    </div>

    <a-modal
      v-model:visible="docModalVisible"
      :title="docModalTitle"
      width="560px"
      :z-index="DOC_EDIT_MODAL_Z_INDEX"
      :mask-closable="false"
      destroy-on-close
      @ok="handleModalOk">
      <a-form layout="vertical">
        <a-form-item label="归档编号">
          <a-input :value="editRecordMeta.archiveCode" disabled />
        </a-form-item>
        <a-form-item label="文件类型">
          <a-input :value="modalCategoryLabel" disabled />
        </a-form-item>
        <a-form-item label="当前版本">
          <a-input :value="editRecordMeta.docVersionNo ? `V${editRecordMeta.docVersionNo}` : '-'" disabled />
        </a-form-item>
        <a-form-item label="文件名称" required>
          <a-input v-model:value="docForm.fileName" placeholder="仅修改名称不会升版" />
        </a-form-item>
        <a-form-item label="更换文件">
          <div class="edit-file-tip">重新上传并保存后将自动升版（通过 fileId 变化判断）</div>
          <div class="edit-upload-trigger">
            <a-button type="primary" @click="openEditUploadModal">重新上传文件</a-button>
            <span v-if="editFileReplaced && docForm.fileName" class="edit-upload-trigger__name">{{ docForm.fileName }}</span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="historyVisible"
      title="历史版本"
      width="900px"
      :footer="null"
      destroy-on-close>
      <a-table
        :loading="historyLoading"
        :data-source="historyList"
        row-key="id"
        size="small"
        bordered
        :pagination="false"
        :columns="[
          { title: '版本', dataIndex: 'docVersionNo', width: 70 },
          { title: '文件名称', dataIndex: 'fileName' },
          { title: '格式', dataIndex: 'fileFormat', width: 80 },
          { title: '归档日期', dataIndex: 'archiveDate', width: 110 },
          { title: '当前', dataIndex: 'isCurrent', width: 70 },
          { title: '操作', key: 'hact', width: 100 },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'isCurrent'">
            {{ record.isCurrent ? '是' : '否' }}
          </template>
          <template v-else-if="column.key === 'hact'">
            <a @click="downloadFile(record)">下载</a>
          </template>
        </template>
      </a-table>
    </a-modal>

    <UploadModal
      v-model:visible="uploadModalVisible"
      v-model:confidential-level="uploadConfidentialLevel"
      modal-title="上传归档文件"
      hint="请先选择附件密级并上传文件；点击确定后将自动归档到左侧所选分类"
      accept="*"
      :file-list="uploadFileList"
      :before-upload="beforeArchiveUpload"
      :custom-request="customRequestCreateUpload"
      @confirm="onCreateUploadConfirm"
      @upload-change="onCreateUploadChange"
      @remove-file="removeCreateUploadFile" />

    <UploadModal
      v-model:visible="editUploadModalVisible"
      v-model:confidential-level="editUploadConfidentialLevel"
      modal-title="重新上传文件"
      hint="请先选择附件密级，再上传新文件；保存后将自动升版"
      accept="*"
      :z-index="DOC_EDIT_UPLOAD_MODAL_Z_INDEX"
      :form-confidential-level="docForm.confidentialLevel"
      :file-list="editUploadFileList"
      :before-upload="beforeEditArchiveUpload"
      :custom-request="customRequestEditUpload"
      @confirm="onEditUploadConfirm"
      @upload-change="onEditUploadChange"
      @remove-file="removeEditUploadFile" />
  </div>
</template>

<style scoped lang="less">
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}

:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

.drawerContent {
  position: relative;
  width: 100%;
  background-color: #ffffff !important;
}

.doc-archive-right-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 10px;
}

.doc-archive-pane {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.doc-archive-toolbar-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.doc-archive-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.doc-archive-table-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 0;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #fafafa !important;
    text-align: center;
    font-weight: 600;
  }
}

.doc-archive-op-links {
  :deep(a.danger-link) {
    color: #ff4d4f;
  }
}

.danger-link {
  color: #ff4d4f;
}

.text-muted {
  color: #999;
}

.edit-file-tip {
  margin-bottom: 8px;
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.5;
}

.edit-upload-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-upload-trigger__name {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.doc-archive-category-hint {
  padding: 8px 0;
  font-size: 13px;
  color: #595959;

  .hint-action {
    margin-left: 12px;
    color: #1677ff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
