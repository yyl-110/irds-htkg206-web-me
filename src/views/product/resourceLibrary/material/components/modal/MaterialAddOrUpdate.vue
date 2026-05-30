<script lang="ts" setup>
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { ref, computed, nextTick, reactive, watch, h } from 'vue';
import { TableProps, Modal, message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { ModuleMenuAddRequestDTOModel } from '@/api/models/module/ModuleMenuAddRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import UploadModal from '@/views/product/components/upload-modal.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { characterToList } from '@/utils/tools';
import dynamicForm from '@/views/product/module/components/form/dynamicForm.vue';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  modalInit: any;
}>();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '暂无数据',
    style: { marginTop: '10px' },
  }),
});
const userStore = useUserStore();
const typeValue = ref<any>([
  { label: 'prt', value: 'prt' },
  { label: 'asm', value: 'asm' },
  { label: 'gph', value: 'gph' },
]);
const moduleTypeValue = ref<any>([
  { label: 'BZ', value: 'BZ' },
  { label: 'MB', value: 'MB' },
]);

const modelStateList = ref<any>([
  { label: '已发布', value: '已发布' },
  { label: '设计中', value: '设计中' },
  { label: '停用', value: '停用' },
  { label: '审核中', value: '审核中' },
]);

const servicesLevel = ref<any>([
  { label: '公开', value: 1 },
  { label: '内部', value: 2 },
  { label: '秘密', value: 3 },
  { label: '机密', value: 4 },
]);
const childrenList = ref<any>([]);

/** 表单样式 label 对象 */
const variableComp = ref<any>(null);
const dynamicParm = ref<any[]>([]);
const uploadFileList = ref<UploadFile[]>([]);
/** 技术文档上传弹窗内附件密级，受 modelData.confidentialLevel 上限约束（见 UploadModal formConfidentialLevel） */
const uploadModalAttachmentLevel = ref(0);
const categoryid = ref<any>('');
const menuId = ref<any>('');
const loading = ref<boolean>(false);
const modelData = reactive<any>(new ModuleMenuAddRequestDTOModel());
const ckeditorRef = ref();
const pendingRemarkContent = ref('');
const visible = computed(() => props.modalVisible);

watch(
  [ckeditorRef, pendingRemarkContent],
  () => {
    if (ckeditorRef.value?.setData && pendingRemarkContent.value !== '') {
      const content = pendingRemarkContent.value;
      pendingRemarkContent.value = '';
      nextTick(() => {
        ckeditorRef.value?.setData(content);
      });
    }
  },
  { deep: true, flush: 'post' },
);

/** 贡献者选取用户列表弹框 */
const userListModalVisible = ref(false);
const condition = ref('');
const userList = ref<any[]>([]);
const userTotal = ref(0);
const pageNo = ref(1);
const pageSize = ref(20);
const userListLoading = ref(false);
const selectedUserKeys = ref<(string | number)[]>([]);
const selectedUserRows = ref<any[]>([]);
const userListRowSelection = computed(() => ({
  type: 'checkbox',
  selectedRowKeys: selectedUserKeys.value,
  onChange: (keys: (string | number)[], rows: any[]) => {
    selectedUserKeys.value = keys;
    selectedUserRows.value = rows;
  },
}));
const userListColumns: TableProps['columns'] = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '部门', dataIndex: 'deptName', key: 'deptName', ellipsis: true },
];

function cancel() {
  emit('onClose', false);
}

/** 初始化专有属性动态列 */
async function initColumnData(categoryidStr: any) {
  categoryid.value = categoryidStr;
  loading.value = true;
  try {
    let params: any = {};
    params.categoryId = categoryidStr;
    params.menuId = menuId.value;
    const res = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(params);
    if (res.data.code == 200) {
      var moduleParaList = res.data.data;
      let newList: any = [];
      for (let i = 0; i < moduleParaList.length; i++) {
        if (moduleParaList[i].paraType == 1) {
          newList.push({
            id: moduleParaList[i].id,
            name: 'rxLabel',
            labelName: moduleParaList[i].propertyName + '：',
            type: moduleParaList[i].propertyType,
            modeTypeList: characterToList(moduleParaList[i].selectStr),
            typeKey: moduleParaList[i].dataProp,
            modeTypeVal: moduleParaList[i].paraValue,
          });
        }
      }
      dynamicParm.value = newList;
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

// 添加
async function handleModalAdd(id: string, pdmType: string, menu_id: string) {
  try {
    categoryid.value = id;
    menuId.value = menu_id;
    loading.value = true;
    await initColumnData(categoryid.value);
    modelData.id = '';
    modelData.categoryid = '';
    modelData.creator = '';
    modelData.para1 = '';
    modelData.para2 = '';
    modelData.para3 = '';
    modelData.para4 = '';
    modelData.para5 = '';
    modelData.para6 = '';
    modelData.para7 = '';
    modelData.para7Name = '';
    modelData.para8 = undefined;
    modelData.para9 = '';
    modelData.para10 = undefined;
    modelData.confidentialLevel = Number(userStore.getConfidentialLevel[0]?.value ?? 1);
    filedataSource.value = [];
    uploadFileList.value = [];
    modelData.modelEngName = pdmType;
    pendingRemarkContent.value = '';
    nextTick(() => {
      ckeditorRef.value?.setData('');
    });
    loading.value = false;
  } catch (error) {
    message.error(error);
    loading.value = false;
  }
}

// 编辑
async function handleModalUpdate(id: string, row: any, menu_id: any) {
  loading.value = true;
  try {
    menuId.value = menu_id;
    categoryid.value = id;
    dynamicParm.value = [];
    modelData.id = row.id;
    modelData.para1 = row.para1;
    modelData.para2 = row.para2;
    modelData.para3 = row.para3;
    modelData.para4 = row.para4 ?? '';
    modelData.para5 = row.para5;
    modelData.para6 = row.para6;
    modelData.para7 = row.para7;
    modelData.para7Name = row.para7Name;
    modelData.para8 = row.para8;
    modelData.para9 = row.para9;
    modelData.para10 = row.para10;
    modelData.confidentialLevel = Number(row.confidentialLevel ?? userStore.getConfidentialLevel[0]?.value ?? 1);
    modelData.createUser = row.creatorName;
    let params: any = {};
    params.categoryId = categoryid.value;
    params.menuId = menuId.value;
    const res = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(params);
    if (res.data.code == 200) {
      var moduleParaList = res.data.data;
      let newList: any = [];
      for (let i = 0; i < moduleParaList.length; i++) {
        if (moduleParaList[i].paraType == 1) {
          newList.push({
            id: moduleParaList[i].id,
            name: 'rxLabel',
            labelName: moduleParaList[i].propertyName + '：',
            type: moduleParaList[i].propertyType,
            modeTypeList: characterToList(moduleParaList[i].selectStr),
            typeKey: moduleParaList[i].dataProp,
            modeTypeVal: row[moduleParaList[i].dataProp],
          });
        }
      }
      dynamicParm.value = newList;
    }
    const resData = await AdminApiSystemModule.getLibraryFileInfoList({ id: row.id });
    filedataSource.value = resData.data.data;
    loading.value = false;
    nextTick(() => {
      pendingRemarkContent.value = row.para4 ?? '';
    });
  } catch (error) {
    console.log(error);
    loading.value = false;
    nextTick(() => {
      pendingRemarkContent.value = row?.para4 ?? '';
    });
  }
}

const filedataSource = ref<any[]>([]);
const FileColumns = ref([
  {
    title: '文件名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    minWidth: 200,
  },
  {
    title: '文件类型',
    key: 'fileType',
    dataIndex: 'fileType',
    align: 'left',
    minWidth: 100,
  },
  {
    title: '下载',
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
    width: 100,
  },
]);

// 声明表格类型
interface DataType {
  objType: string;
  objId: string;
  amount: number;
  buyFlag: boolean;
}

const previewImage = ref<string>('');
const previewVisible = ref<boolean>(false);
const previewTitle = ref<string>('');

// 文件上传
const selectedRowfileList = ref<any[]>([]);
const openfileUploadModal = ref<boolean>(false);

/** 表格勾选事件 */
const rowSelectionfile: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowfileList.value = selectedRows;
  },
};

/** 删除按钮状态 */
const deletefileFlag = computed(() => {
  return selectedRowfileList.value?.length === 0;
});

function openUpload() {
  uploadFileList.value = [];
  const cap = Number(modelData.confidentialLevel);
  uploadModalAttachmentLevel.value = Number.isFinite(cap) ? cap : Number(userStore.getConfidentialLevel[0]?.value ?? 0);
  openfileUploadModal.value = true;
}

async function downloadFile(record: any) {
  window.open(record.fileUrl);
}

/** 解析 uploadFile 返回，保证能拿到 id（常见于 res.data.data） */
function parseUploadFileRecordForModule(raw: unknown): { id: string; fileUrl?: string; displayName?: string } {
  if (!raw || typeof raw !== 'object') return { id: '' };
  const body = raw as Record<string, unknown>;
  const code = body.code;
  const ok = code === undefined || code === null || code === 0 || code === 200 || code === '0' || code === '200';
  if (!ok) return { id: '' };
  let record: Record<string, unknown> = body;
  const nested = body.data;
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id != null) {
    record = nested as Record<string, unknown>;
  } else if (body.id == null && body.queryId == null && nested && typeof nested === 'object') {
    record = nested as Record<string, unknown>;
  }
  const id = String(record.id ?? record.queryId ?? '').trim();
  const fileUrl = record.fileUrl != null ? String(record.fileUrl) : record.filePath != null ? String(record.filePath) : undefined;
  const displayName = record.oldFileName != null ? String(record.oldFileName) : record.fileName != null ? String(record.fileName) : undefined;
  return { id, fileUrl, displayName };
}

function getEntryFileId(entry: UploadFile | undefined): string {
  if (!entry) return '';
  const direct = (entry as UploadFile & { id?: string }).id ?? (entry as UploadFile & { queryId?: string }).queryId;
  if (direct != null && String(direct).trim() !== '') return String(direct).trim();
  return parseUploadFileRecordForModule(entry.response).id;
}

/** 从文件名取扩展名作为文件类型展示 */
function fileExtFromName(name: string): string {
  const s = String(name ?? '').trim();
  const i = s.lastIndexOf('.');
  return i >= 0 ? s.slice(i + 1).toLowerCase() : '';
}

/** 与列表列一致：documentName、fileType、fileUrl、id 与 fileId */
function buildFileTableRow(entry: UploadFile, fileId: string) {
  const res = entry.response as Record<string, unknown> | undefined;
  let inner: Record<string, unknown> = {};
  if (res && typeof res === 'object') {
    const nested = res.data;
    inner = nested && typeof nested === 'object' && !Array.isArray(nested) ? (nested as Record<string, unknown>) : { ...res };
  }
  const documentName = String(inner.documentName ?? inner.oldFileName ?? inner.fileName ?? inner.newFileName ?? entry.name ?? '').trim();
  const nameForExt = documentName || String(entry.name ?? '');
  const fileTypeRaw = inner.fileType ?? inner.suffix ?? inner.fileExtension;
  const fileType = fileTypeRaw != null && String(fileTypeRaw).trim() !== '' ? String(fileTypeRaw).trim() : fileExtFromName(nameForExt) || '--';
  const fileUrl =
    inner.fileUrl != null
      ? String(inner.fileUrl)
      : inner.filePath != null
        ? String(inner.filePath)
        : (entry as UploadFile & { fileUrl?: string }).fileUrl != null
          ? String((entry as UploadFile & { fileUrl?: string }).fileUrl)
          : '';

  return {
    id: fileId,
    fileId,
    documentName: documentName || nameForExt || '—',
    fileType,
    fileUrl,
  };
}

function beforeUploadTechDoc() {
  return true;
}

async function datacustomRequest(options: { file: File | Blob; onSuccess?: (body: unknown, file?: File) => void; onError?: (e: Error) => void }) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      confidentialLevel: uploadModalAttachmentLevel.value,
    });
    const parsed = parseUploadFileRecordForModule(res?.data);
    const codeOk = res?.data?.code === 0 || res?.data?.code === 200 || res?.data?.code === '0' || res?.data?.code === '200';
    if (codeOk && parsed.id) {
      const file: UploadFile & { id?: string; fileUrl?: string } = {
        uid: parsed.id,
        name: parsed.displayName ?? (options.file as File).name ?? 'file',
        status: 'done',
        response: res.data as object,
        id: parsed.id,
      };
      if (parsed.fileUrl) file.fileUrl = parsed.fileUrl;
      uploadFileList.value = [file];
      options.onSuccess?.(res.data, options.file as File);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
      options.onError?.(new Error(String((res?.data as any)?.msg ?? 'upload failed')));
    }
  } catch (err) {
    console.log(err);
    options.onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

function onUploadModalChange(info: UploadChangeParam) {
  uploadFileList.value = [...info.fileList];
}

function onUploadModalRemove() {
  uploadFileList.value = [];
}

/** UploadModal 确定时已调用 updateFileConfidentialLevel；此处把文件加入表格 */
function handleUploadModalConfirm() {
  const entry = uploadFileList.value[0];
  const fid = getEntryFileId(entry);
  if (!entry || !fid) {
    message.info(WeiI18n.t('请上传文件').value);
    return;
  }
  filedataSource.value.push(buildFileTableRow(entry, fid));
  openfileUploadModal.value = false;
}

// 删除文件
function removeFile() {
  if (selectedRowfileList.value.length === 0) {
    message.error('请选择要删除的文件');
    return;
  }
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: () => {
      filedataSource.value = filedataSource.value.filter(item => !selectedRowfileList.value.some(t => t.id === item.id));
      selectedRowfileList.value = [];
    },
  });
}

/** 贡献者选取用户列表：请求参数 condition, pageNo, pageSize(最大100) */
async function fetchUserList() {
  userListLoading.value = true;
  try {
    const size = Math.min(Number(pageSize.value) || 20, 100);
    const res = await AdminApiSystemModule.findUserInfo({
      condition: condition.value,
      pageNo: pageNo.value,
      pageSize: size,
    });
    const data = res?.data;
    if (data?.code === 200 && data?.data) {
      userList.value = data.data.list || [];
      userTotal.value = Number(data.data.total) || 0;
    } else {
      userList.value = [];
      userTotal.value = 0;
    }
  } catch (e) {
    userList.value = [];
    userTotal.value = 0;
    message.error('获取用户列表失败');
  } finally {
    userListLoading.value = false;
  }
}

/** 贡献者浏览：打开选取用户弹框 */
async function handleBrowseContributor() {
  condition.value = '';
  pageNo.value = 1;
  pageSize.value = 10;
  selectedUserKeys.value = [];
  selectedUserRows.value = [];
  userListModalVisible.value = true;
  await fetchUserList();
}

/** 用户列表分页变更 */
function onUserListPageChange(page: number, size: number) {
  pageNo.value = page;
  pageSize.value = Math.min(size, 100);
  fetchUserList();
}

/** 用户列表关键字查询（搜索） */
function onUserListSearch() {
  pageNo.value = 1;
  fetchUserList();
}

/** 用户列表行点击：切换该行选中状态（点击复选框列由 table 自身处理，不重复切换） */
function onUserRowClick(record: any, e: MouseEvent) {
  const target = (e?.target as HTMLElement) || null;
  if (target?.closest?.('.ant-table-selection-column')) return;
  const key = record.id;
  const keys = selectedUserKeys.value;
  if (keys.includes(key)) {
    selectedUserKeys.value = keys.filter(k => k !== key);
    selectedUserRows.value = selectedUserRows.value.filter((r: any) => r.id !== key);
  } else {
    selectedUserKeys.value = [...keys, key];
    selectedUserRows.value = [...selectedUserRows.value, record];
  }
}

/** 确认选取贡献者（仅允许选择唯一一名用户） */
function confirmSelectContributor() {
  if (selectedUserRows.value.length !== 1) {
    message.warning('请选择且仅选择一名用户');
    return;
  }
  const u = selectedUserRows.value[0];
  modelData.para7 = u.id;
  modelData.para7Name = u.nickname;
  userListModalVisible.value = false;
}

/** 从动态表单项收集专有属性值 */
function getDynamicComponentVal(): { modelInfoProp: string; modelInfoPropValue: string }[] {
  const comps = variableComp.value;
  if (!comps) return [];
  const list = Array.isArray(comps) ? comps : [comps];
  const params = dynamicParm.value;
  return list.map((comp: any, index: number) => {
    const typeKey = params[index]?.typeKey ?? comp?.typeKey ?? '';
    const raw = comp?.newModeTypeVal != null ? (typeof comp.newModeTypeVal === 'object' && 'value' in comp.newModeTypeVal ? comp.newModeTypeVal.value : comp.newModeTypeVal) : '';
    const val = String(raw ?? '');
    return { modelInfoProp: typeKey, modelInfoPropValue: val };
  });
}

/**
 * @description 点击确认
 */
async function handleSave() {
  const isAdd = !modelData.id;
  const moduleList = getDynamicComponentVal();
  const libraryCustomizeDataBaseDTO: Record<string, string> = {};
  const baseFieldValues: Record<string, string> = {
    para4: ckeditorRef.value?.getData() ?? '',
  };

  for (const item of moduleList) {
    const key = item.modelInfoProp;
    if (!key) continue;
    const paraNum = Number(String(key).replace(/^para/, ''));
    if (String(key).startsWith('para') && !Number.isNaN(paraNum) && paraNum >= 1 && paraNum <= 50 && key !== 'para4') {
      baseFieldValues[key] = item.modelInfoPropValue;
    } else {
      libraryCustomizeDataBaseDTO[key] = item.modelInfoPropValue;
    }
  }

  const libraryDataBaseDTO = {
    id: isAdd ? '' : modelData.id,
    categoryId: categoryid.value,
    menuId: menuId.value,
    creator: userStore.getUser.id,
    para1: baseFieldValues.para1 ?? modelData.para1 ?? '',
    para2: baseFieldValues.para2 ?? modelData.para2 ?? '',
    para3: baseFieldValues.para3 ?? modelData.para3 ?? '',
    para4: baseFieldValues.para4,
    para5: baseFieldValues.para5 ?? modelData.para5 ?? '',
    para6: baseFieldValues.para6 ?? modelData.para6 ?? '',
    para7: baseFieldValues.para7 ?? modelData.para7 ?? '',
    para8: baseFieldValues.para8 ?? modelData.para8,
    para9: baseFieldValues.para9 ?? modelData.para9 ?? '',
    para10: baseFieldValues.para10 ?? modelData.para10,
    para11: '',
    confidentialLevel: modelData.confidentialLevel ?? 1,
  };
  const libraryFileUpdateRequestDTO = filedataSource.value.map(item => ({
    id: '',
    type: 3,
    fileId: item.fileId,
    categoryId: categoryid.value,
    dataId: '',
    versionFlag: 0,
    effectiveVersionFlag: 0,
    lastVersionFlag: 0,
  }));
  const data = {
    libraryDataBaseDTO,
    libraryCustomizeDataBaseDTO,
    libraryFileUpdateRequestDTO,
  };
  try {
    const res = await AdminApiSystemModule.moduleInfoKeep(data);
    if (res.data.code === -1) {
      message.warning({ content: res.data.msg, duration: 3, closable: true });
    } else {
      message.success(isAdd ? '添加成功' : '修改成功');
      emit('modalInit');
      emit('onClose', false);
    }
  } catch (e) {
    console.error(e);
    message.error('保存失败');
  }
}

defineExpose({ handleModalAdd, handleModalUpdate });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="fixed-modal"
    :style="{ width: '1200px', top: '2%' }"
    :title="modelData.id ? '修改数据' : '新建数据'"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel">
    <div v-if="!loading" class="modal-body">
      <!-- 可变参数与附件区域 -->
      <div class="variableParm-box" v-if="dynamicParm && dynamicParm.length > 0">
        <div class="section-subtitle">专有属性</div>
        <div class="varargsBox">
          <dynamicForm
            ref="variableComp"
            v-for="(item, index) in dynamicParm"
            :key="item.id"
            :label="item.labelName"
            :modeTypeList="item.modeTypeList"
            :type="item.type"
            :typeKey="item.typeKey"
            :modeTypeVal="item.modeTypeVal"
            :width="252"
            prop="id"
            :labelWidth="55" />
        </div>
      </div>
      <div class="attachments-row">
        <div class="attachments-column">
          <div class="section-subtitle">备注信息</div>
          <CkeditorPlugin ref="ckeditorRef" height="160" />
        </div>
      </div>
    </div>
    <div v-else class="example"><a-spin tip="加载中..." /></div>
    <template #footer>
      <a-button type="primary" @click="handleSave">确定</a-button>
      <a-button @click="cancel">取消</a-button>
    </template>
  </a-modal>

  <!-- 技术文档上传（共用 upload-modal） -->
  <UploadModal
    v-model:visible="openfileUploadModal"
    v-model:confidential-level="uploadModalAttachmentLevel"
    :modal-title="$t('技术文档与资料上传')"
    hint="温馨提示： 允许上传pdf、doc、docx、xls、xlsx等格式文件"
    accept=".pdf,.doc,.docx,.xls,.xlsx,.PDF,.DOC,.DOCX,.XLS,.XLSX"
    :file-list="uploadFileList"
    :before-upload="beforeUploadTechDoc"
    :custom-request="datacustomRequest"
    :form-confidential-level="modelData.confidentialLevel"
    @upload-change="onUploadModalChange"
    @remove-file="onUploadModalRemove"
    @confirm="handleUploadModalConfirm" />

  <!-- 贡献值浏览 / 选取用户列表 -->
  <a-modal v-model:visible="userListModalVisible" title="选取贡献者" width="880px" @cancel="userListModalVisible = false">
    <div class="user-list-modal">
      <div class="user-list-search">
        <a-input-search v-model:value="condition" placeholder="关键字查询（用户名/名称）" allow-clear style="width: 440px; margin-right: 8px" @search="onUserListSearch" />
        <a-button type="primary" @click="onUserListSearch">查询</a-button>
      </div>
      <a-table
        :columns="userListColumns"
        :data-source="userList"
        :loading="userListLoading"
        :pagination="false"
        row-key="id"
        size="small"
        :scroll="{ y: 480 }"
        :locale="locale"
        :row-selection="userListRowSelection"
        :custom-row="(record: any) => ({ onClick: (e: MouseEvent) => onUserRowClick(record, e) })">
        <template #bodyCell="{ column, record }">
          <template v-if="column?.dataIndex === 'deptName'">
            {{ record.deptName ?? '-' }}
          </template>
        </template>
      </a-table>
      <div class="user-list-pagination">
        <a-pagination
          v-model:current="pageNo"
          v-model:page-size="pageSize"
          :total="userTotal"
          :page-size-options="['10', '20', '50', '100']"
          :build-option-text="(prop: { value: number }) => `${prop.value} 条/页`"
          show-size-changer
          show-quick-jumper
          :show-total="(t: number) => `共 ${t} 条`"
          @change="(p: number, s: number) => onUserListPageChange(p, s)" />
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="confirmSelectContributor">确定</a-button>
      <a-button @click="userListModalVisible = false">取消</a-button>
    </template>
  </a-modal>

  <!-- 图片预览 -->
  <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 45%;
  left: 50%;
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    overflow: auto;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.btn_left {
  margin-left: 15px;
}

:deep(.ant-table-content) {
  overflow: hidden !important;
}

:deep(.ant-form-item) {
  margin-left: 20px !important;
}

.elformitem :deep(.el-form-item__label) {
  width: 120px;
}

.module-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.module-section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.module-section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 18px;
  background: var(--ant-primary-color);
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 24px;
}

.material-basic-grid {
  grid-template-columns: repeat(2, 1fr);
}

.material-desc-item {
  grid-column: span 2;
}

/* 贡献者：输入框与浏览按钮不重叠，保留间距 */
.contributor-input-group {
  display: flex;
  width: 100%;
}
.contributor-input-group :deep(.ant-input) {
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}
.contributor-input-group :deep(.ant-btn) {
  flex: 0 0 auto;
}

/* 选取贡献者弹框 */
.user-list-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.user-list-search {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.user-list-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.attachments-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.attachments-column {
  width: 100%;
  margin-bottom: 8px;
}

.attachments-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.section-subtitle {
  font-weight: 700;
  margin-bottom: 8px;
}

/* 专有属性：可变列横向平铺 */
.varargsBox {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.varargsBox > * {
  flex: 0 0 252px;
  max-width: 252px;
}

/* footer 按钮右对齐 */
:deep(.ant-modal-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 固定 Modal 的头部和底部，内容区可滚动 */
.fixed-modal ::v-deep(.ant-modal-header) {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  /* 保持原有头部高度与分隔线 */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动，避免 modal 内容撑开整个视图 */
.fixed-modal ::v-deep(.ant-modal-body) {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
}

/* 底部按钮固定显示（覆盖原有 .ant-modal-footer 样式） */
.fixed-modal ::v-deep(.ant-modal-footer) {
  position: sticky;
  bottom: 0;
  z-index: 30;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 在窄屏时稍微降低 body 的 max-height */
@media (max-width: 920px) {
  .fixed-modal ::v-deep(.ant-modal-body) {
    max-height: calc(70vh - 120px);
  }
}

/* 响应式 */
@media (max-width: 920px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .single-line ::v-deep(.ant-input),
  .single-line ::v-deep(.ant-select-selector) {
    width: 100% !important;
  }
}
</style>

<style lang="less">
/* Modal 被 teleport，作用域样式无效 -> 全局样式生效 */

/* 选择器针对 a-modal 加的 class="fixed-modal" */
.fixed-modal .ant-modal-content .ant-modal-header {
  position: sticky;
  top: 0;
  z-index: 1200;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动 */
.fixed-modal .ant-modal-content .ant-modal-body {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
  background: #fff;
}

/* 底部按钮固定 */
.fixed-modal .ant-modal-content .ant-modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 1300;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 兼容窄屏 */
@media (max-width: 920px) {
  .fixed-modal .ant-modal-content .ant-modal-body {
    max-height: calc(70vh - 120px);
  }
}
</style>
