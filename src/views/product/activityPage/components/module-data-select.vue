<template>
  <a-modal
    v-model:visible="visible"
    title="数据选取"
    width="1200px"
    :mask-closable="false"
    :force-render="true"
    :destroy-on-close="false"
    :get-container="getModalContainer"
    :z-index="1200"
    class="module-data-select"
    @cancel="handleCancel">
    <div class="module-data-select__body">
      <div v-if="queryColumns.length" class="module-data-select__query">
        <a-row :gutter="[12, 8]">
          <a-col v-for="item in queryColumns" :key="item.key" :span="8">
            <div class="query-item-picker-row">
              <span class="query-item-picker-label">{{ item.title }}：</span>
              <a-select
                v-if="item.inputType === 'select'"
                v-model:value="queryForm[item.key]"
                allow-clear
                show-search
                class="query-item-picker-control"
                :placeholder="`请选择${item.title}`"
                :options="item.options.map(opt => ({ label: opt, value: opt }))"
                :filter-option="filterSelectOption" />
              <a-input
                v-else
                v-model:value="queryForm[item.key]"
                allow-clear
                class="query-item-picker-control"
                placeholder="请输入" />
            </div>
          </a-col>
        </a-row>
        <div class="module-data-select__query-actions">
          <a-button type="primary" :loading="loading" @click="handleQuery">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button @click="handleQueryReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </div>
      </div>

      <a-table
        class="module-data-select__table"
        :columns="tableColumns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="getRowKey"
        :row-selection="rowSelection"
        :scroll="{ x: 'max-content', y: 420 }"
        bordered
        size="small"
        @change="handleTableChange">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'status' || column.dataIndex === 'para10'">
            {{ getRowDisplayText(String(column.dataIndex), record, text) }}
          </template>
        </template>
      </a-table>
    </div>

    <template #footer>
      <a-space>
        <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { message, type TableProps } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import type {
  ConfirmColumnItem,
  ModuleOkPayload,
  ModulePropertyItem,
  ModuleTableRow,
  QueryColumnItem,
  SelectPageStrItem,
} from './config/module-data-select.types';
import {
  applyQueryPrefill,
  buildConfirmColumns,
  buildModuleQueryFilters,
  buildTableColumns,
  getRowDisplayText,
  isApiSuccess,
  isZeroFlag,
  resolveInitArgs,
  resolveLibraryDataQueryType,
} from './config/module-data-select.utils';

export type { ModuleOkItem, ModuleOkPayload } from './config/module-data-select.types';

defineOptions({ name: 'ModuleDataSelect' });

const props = withDefaults(
  defineProps<{
    mcategoryid?: string;
    moduleDataSelect?: boolean;
  }>(),
  {
    mcategoryid: '',
    moduleDataSelect: false,
  },
);

const emit = defineEmits<{
  moduleOk: [payload: ModuleOkPayload];
  moduleCancel: [];
}>();

const userStore = useUserStore();

const visible = ref(false);
const loading = ref(false);

const categoryId = ref('');
const menuId = ref('');
const libraryDataQueryType = ref('1');
const queryPrefill = ref<Record<string, string>>({});

const modulePropertyInfo = ref<ModulePropertyItem[]>([]);
const queryColumns = ref<QueryColumnItem[]>([]);
const queryForm = reactive<Record<string, unknown>>({});
const tableColumns = ref<TableColumnType[]>([]);
const tableData = ref<ModuleTableRow[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<ModuleTableRow[]>([]);

const page = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const pagination = computed(() => ({
  current: page.current,
  pageSize: page.pageSize,
  total: page.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
  showTotal: (total: number) => `共 ${total} 条`,
}));

const rowSelection = computed<TableProps['rowSelection']>(() => ({
  type: 'radio',
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[], rows: ModuleTableRow[]) => {
    selectedRowKeys.value = keys.length ? [keys[keys.length - 1]] : [];
    selectedRows.value = rows.length ? [rows[rows.length - 1]] : [];
  },
}));

function getModalContainer() {
  return document.body;
}

function getRowKey(record: ModuleTableRow) {
  return String(record.id ?? record.para1 ?? JSON.stringify(record));
}

function filterSelectOption(input: string, option?: { value?: string | number }) {
  return String(option?.value ?? '')
    .toLowerCase()
    .includes(String(input ?? '').toLowerCase());
}

function resetSelection() {
  selectedRowKeys.value = [];
  selectedRows.value = [];
}

function resetQueryForm() {
  Object.keys(queryForm).forEach(key => {
    delete queryForm[key];
  });
}

async function loadPickerData() {
  const currentCategoryId = categoryId.value || props.mcategoryid;
  const currentMenuId = menuId.value || currentCategoryId;
  if (!currentCategoryId) {
    message.warning('模型库分类未配置');
    return;
  }

  loading.value = true;
  resetSelection();
  resetQueryForm();
  queryColumns.value = [];
  tableColumns.value = [];
  tableData.value = [];
  page.current = 1;

  try {
    const basePayload: Record<string, unknown> = {
      userId: userStore.getUser.id,
      moduleParaList: [],
      categoryId: currentCategoryId,
      currentPage: page.current,
      numberPage: page.pageSize,
      pageNo: page.current,
      pageSize: page.pageSize,
      menuId: currentMenuId,
      type: libraryDataQueryType.value,
    };

    const [listRes, distinctRes, propertyRes] = await Promise.all([
      AdminApiSystemModule.preciseQueryModuleLibrary(basePayload as never),
      AdminApiSystemModule.getDistinctValuesByDefaultQueryFields(basePayload as never),
      AdminApiSystemModule.findCurrentModuleInfoByCategoryId({
        categoryId: currentCategoryId,
        menuId: currentMenuId,
      } as Record<string, unknown>),
    ]);

    const distinctValues: Record<string, unknown[]> =
      (distinctRes as { data?: { data?: { values?: Record<string, unknown[]> } } })?.data?.data?.values ??
      (distinctRes as { data?: { values?: Record<string, unknown[]> } })?.data?.values ??
      (distinctRes as { data?: { data?: Record<string, unknown[]> } })?.data?.data ??
      {};

    if (isApiSuccess(propertyRes.data?.code)) {
      modulePropertyInfo.value = (propertyRes.data?.data ?? []) as ModulePropertyItem[];
      tableColumns.value = buildTableColumns(modulePropertyInfo.value) as TableColumnType[];

      queryColumns.value = modulePropertyInfo.value
        .filter(item => isZeroFlag(item.searchFlag))
        .map(item => {
          const key = item.propertyName === '贡献者' ? 'para7Name' : String(item.dataProp ?? item.modelInfoProp ?? '');
          const valueKeyCandidates = [String(item.dataProp ?? ''), key, key.endsWith('Name') ? key.slice(0, -4) : ''].filter(
            Boolean,
          );
          const rawOptions =
            valueKeyCandidates.map(k => distinctValues[k]).find(v => Array.isArray(v) && v.length > 0) || [];
          const options = (rawOptions as unknown[]).map(v => String(v)).filter(v => v.trim() !== '');
          queryForm[key] = undefined;
          return {
            id: item.id,
            title: item.propertyName,
            key,
            parameterNum: String(item.parameterNum ?? item.paramNum ?? '').trim(),
            paraDictionary: String(item.paraDictionary ?? '').trim(),
            inputType: 'select' as const,
            options,
          };
        })
        .filter(item => item.key);
    } else {
      modulePropertyInfo.value = [];
    }

    if (isApiSuccess(listRes.data?.code)) {
      const data = listRes.data?.data ?? {};
      tableData.value = (data.list ?? data.moduleList ?? []) as ModuleTableRow[];
      page.total = Number(data.total ?? data.pageCount ?? data.totalPage ?? 0);
      page.current = Number(data.currentPage ?? 1);
    }

    if (applyQueryPrefill(queryColumns.value, queryForm, queryPrefill.value)) {
      await fetchModuleList(true);
    }
  } catch (error) {
    console.error('[ModuleDataSelect] loadPickerData failed', error);
    message.error('加载模块库数据失败');
  } finally {
    loading.value = false;
  }
}

async function fetchModuleList(resetPage = false) {
  const currentCategoryId = categoryId.value || props.mcategoryid;
  const currentMenuId = menuId.value || currentCategoryId;
  if (!currentCategoryId) return;

  if (resetPage) {
    page.current = 1;
    resetSelection();
  }

  loading.value = true;
  try {
    const payload: Record<string, unknown> = {
      userId: userStore.getUser.id,
      moduleParaList: buildModuleQueryFilters(queryForm),
      categoryId: currentCategoryId,
      pageNo: page.current,
      pageSize: page.pageSize,
      menuId: currentMenuId,
      type: libraryDataQueryType.value,
    };
    const res = await AdminApiSystemModule.preciseQueryModuleLibrary(payload as never);
    if (!isApiSuccess(res.data?.code)) {
      throw new Error(String(res.data?.msg ?? '查询模块库失败'));
    }
    const data = res.data?.data ?? {};
    tableData.value = (data.list ?? data.moduleList ?? []) as ModuleTableRow[];
    page.total = Number(data.total ?? data.pageCount ?? data.totalPage ?? 0);
    page.current = Number(data.currentPage ?? page.current);
  } finally {
    loading.value = false;
  }
}

function buildLegacyPayload(): ModuleOkPayload {
  const row = selectedRows.value[0];
  if (!row) {
    return {
      para1: '',
      para3: '',
      para4: '',
      para5: '',
      arr: [{ id: '', val: '', name: '' }],
    };
  }

  const arr = buildConfirmColumns(modulePropertyInfo.value)
    .filter((col: ConfirmColumnItem) => col.paraDictionaryName || col.parameterNum)
    .map((col: ConfirmColumnItem) => ({
      id: col.dataIndex,
      val: String(row[col.dataIndex] ?? ''),
      name: String(col.paraDictionaryName || col.parameterNum || ''),
    }));

  return {
    para1: String(row.para1 ?? ''),
    para3: String(row.para3 ?? ''),
    para4: String(row.para4 ?? ''),
    para5: String(row.para5 ?? ''),
    arr,
  };
}

function initData(
  nextCategoryId: string,
  selectPageStr: string | SelectPageStrItem[] = '',
  _matchingModuelPara?: string,
  _matchingRelation?: string,
  _matchingParaVal?: string,
  libraryQueryType?: string | number,
) {
  const resolved = resolveInitArgs(nextCategoryId, selectPageStr);
  categoryId.value = nextCategoryId;
  menuId.value = resolved.menuId;
  libraryDataQueryType.value = libraryQueryType != null ? String(libraryQueryType) : resolveLibraryDataQueryType(resolved.menuId);
  queryPrefill.value = resolved.queryPrefill;
  resetSelection();
  if (props.moduleDataSelect || visible.value) {
    void loadPickerData();
  }
}

function handleQuery() {
  void fetchModuleList(true);
}

function handleQueryReset() {
  queryColumns.value.forEach(col => {
    queryForm[col.key] = col.inputType === 'select' ? undefined : '';
  });
  void fetchModuleList(true);
}

function handleTableChange(pag: { current?: number; pageSize?: number }) {
  page.current = pag.current ?? 1;
  page.pageSize = pag.pageSize ?? page.pageSize;
  void fetchModuleList(false);
}

function handleOk() {
  const payload = buildLegacyPayload();
  if (!payload.para1 && !payload.para3) {
    message.warning('请选择一条数据');
    return;
  }
  visible.value = false;
  emit('moduleOk', payload);
}

function handleCancel() {
  visible.value = false;
  emit('moduleCancel');
}

watch(
  () => props.moduleDataSelect,
  async val => {
    visible.value = val;
    if (!val) return;
    await loadPickerData();
  },
);

defineExpose({
  initData,
});
</script>

<style scoped lang="less">
.module-data-select__body {
  min-height: 560px;
}

.module-data-select__query {
  margin-bottom: 12px;
  padding: 12px;
  background: #fafbff;
  border-radius: 4px;
}

.query-item-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-item-picker-label {
  flex: 0 0 96px;
  text-align: right;
  color: rgba(0, 0, 0, 0.85);
}

.query-item-picker-control {
  flex: 1;
  min-width: 0;
}

.module-data-select__query-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.module-data-select__table :deep(.ant-table) {
  margin-top: 4px;
}
</style>
