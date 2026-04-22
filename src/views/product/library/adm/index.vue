<script lang="ts" setup>
import { computed, h, nextTick, onMounted, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message, Modal } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { LibraryPageRequestDTOModel } from '@/api/models/library/LibraryPageRequestDTOModel';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import LibraryAddOrUpdate from './libraryAddOrUpdate.vue';
import { sortermethod } from '@/utils/tools';
import ParameterGeneral from '../../module/components/modal/ParameterGeneral.vue';
const powerModel = ref<any>(null);
const addOrUpdateModel = ref<any>(null);
const userStore = useUserStore();
const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);
const ParameterGeneralVisible = ref<boolean>(false);
const ParameterGeneralRef = ref<any>(null);
/** 属性配置：当前操作的行记录 */
const propertyConfigRecord = ref<any>(null);
/** 属性配置：属性列表数据（表格行） */
interface PropertyRow {
  _rowKey?: string; // 前端唯一标识，用于空 id 时区分行，不提交后端
  id: string;
  propertyName: string;
  dataProp: string;
  parameterNum: string;
  /** 关联参数字典 id（后端字段名沿用旧逻辑） */
  parameterId?: string;
  showFlag: number;
  colWidth: string;
  searchFlag: number;
  propertyType: number;
  selectStr: string;
  parameterType: number;
  creator: number;
  menuId: number;
  sort: number;
}
const propertyList = ref<PropertyRow[]>([]);
/** 属性配置：当前点击“浏览”的行 index（用于回填） */
const selectParmIndex = ref<number>(-1);
function genRowKey() {
  return `__row_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
function createEmptyPropertyRow(sort = 1): PropertyRow {
  return {
    _rowKey: genRowKey(),
    id: '',
    propertyName: '',
    dataProp: '',
    parameterNum: '',
    showFlag: 1,
    colWidth: '100',
    searchFlag: 1,
    propertyType: 1,
    selectStr: '',
    parameterType: 1,
    creator: Number(userStore.getUser.id),
    menuId: Number(propertyConfigRecord.value.id),
    sort,
  };
}
/** 属性配置表格列 */
const propertyColumns = [
  { title: WeiI18n.$t('属性名称'), dataIndex: 'propertyName', key: 'propertyName', width: 140, align: 'center' },
  { title: WeiI18n.$t('属性内部值'), dataIndex: 'dataProp', key: 'dataProp', width: 140, align: 'center' },
  { title: WeiI18n.$t('关联参数字典'), dataIndex: 'parameterNum', key: 'parameterNum', width: 230, align: 'center' },
  { title: WeiI18n.$t('显示状态'), dataIndex: 'showFlag', key: 'showFlag', width: 100, align: 'center' },
  { title: WeiI18n.$t('列宽'), dataIndex: 'colWidth', key: 'colWidth', width: 100, align: 'center' },
  { title: WeiI18n.$t('默认查询'), dataIndex: 'searchFlag', key: 'searchFlag', width: 100, align: 'center' },
  { title: WeiI18n.$t('文本类型'), dataIndex: 'propertyType', key: 'propertyType', width: 100, align: 'center' },
  { title: WeiI18n.$t('下拉属性信息'), dataIndex: 'selectStr', key: 'selectStr', width: 160, align: 'center' },
  { title: WeiI18n.$t('数值类型'), dataIndex: 'parameterType', key: 'parameterType', width: 100, align: 'center' },
  { title: WeiI18n.$t('操作'), dataIndex: 'operation', key: 'operation', width: 180, align: 'center', fixed: 'right' },
];
const displayStatusOptions = [
  { label: WeiI18n.$t('隐藏'), value: 1 },
  { label: WeiI18n.$t('显示'), value: 0 },
];
const defaultQueryOptions = [
  { label: WeiI18n.$t('是'), value: 0 },
  { label: WeiI18n.$t('否'), value: 1 },
];
const textTypeOptions = [
  { label: WeiI18n.$t('文本框'), value: 1 },
  { label: WeiI18n.$t('下拉值'), value: 2 },
  { label: WeiI18n.$t('附件'), value: 3 },
  { label: WeiI18n.$t('文本域'), value: 4 },
];
const numericTypeOptions = [
  { label: WeiI18n.$t('数值'), value: 0 },
  { label: WeiI18n.$t('字符串'), value: 1 },
  { label: WeiI18n.$t('boolean'), value: 2 },
];
const visibleNoticeEditor = ref<boolean>(false);

type LibraryListRow = Record<string, any> & { id: number | string };
type LibrarySortOrder = 'ascend' | 'descend' | '';

/** 列表请求参数（须在表头筛选用到 requestParams 之前声明） */
const requestParams = reactive(new LibraryPageRequestDTOModel());
requestParams.userid = userStore.getUser.id;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 列表数据 */
const resources = ref<LibraryListRow[]>([]);

const libraryTableSortState = ref<{ key: string; order: LibrarySortOrder }>({ key: '', order: '' });
const libraryTableFilterValueMap = ref<Record<string, string>>({ menuName: '' });
const libraryTableFilterOpenMap = ref<Record<string, boolean>>({});

function isLibraryTableSortableColumn(column: { dataIndex?: unknown }) {
  const k = column?.dataIndex;
  return Boolean(k && k !== 'operation');
}

function isLibraryTableFilterableColumn(column: { dataIndex?: unknown }) {
  return column?.dataIndex === 'menuName';
}

function setLibraryTableFilterOpen(key: string, open: boolean) {
  libraryTableFilterOpenMap.value = { ...libraryTableFilterOpenMap.value, [key]: open };
}

function getLibraryTableFilterOpen(key: string) {
  return Boolean(libraryTableFilterOpenMap.value[key]);
}

function handleLibraryTableFilterOpenChange(key: string, open: boolean) {
  if (open && key === 'menuName') {
    libraryTableFilterValueMap.value = { ...libraryTableFilterValueMap.value, menuName: String(requestParams.menuName ?? '') };
  }
  setLibraryTableFilterOpen(key, open);
}

function onLibraryMenuNameFilterOpenChange(vis: boolean) {
  handleLibraryTableFilterOpenChange('menuName', vis);
}

function getLibraryTableSortOrder(dataIndex: string): LibrarySortOrder {
  return libraryTableSortState.value.key === dataIndex ? libraryTableSortState.value.order : '';
}

function toggleLibraryTableColumnSort(column: { dataIndex?: unknown }) {
  if (!isLibraryTableSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (libraryTableSortState.value.key !== key) {
    libraryTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (libraryTableSortState.value.order === 'ascend') {
    libraryTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (libraryTableSortState.value.order === 'descend') {
    libraryTableSortState.value = { key: '', order: '' };
    return;
  }
  libraryTableSortState.value = { key, order: 'ascend' };
}

const libraryTableDisplayList = computed(() => {
  const list = [...resources.value];
  if (!libraryTableSortState.value.key || !libraryTableSortState.value.order) return list;
  const k = libraryTableSortState.value.key;
  if (k === 'sort') {
    const sorted = [...list].sort((a, b) => (Number(a.sort) || 0) - (Number(b.sort) || 0));
    return libraryTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
  }
  const sorted = [...list].sort((a: LibraryListRow, b: LibraryListRow) => sortermethod(a[k] as any, b[k] as any));
  return libraryTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

const columns = ref<TableColumnType<LibraryListRow>[]>([
  {
    title: WeiI18n.$t('基础库名称'),
    dataIndex: 'menuName',
    key: 'menuName',
    align: 'left',
    resizable: true,
    fixed: 'left',
    width: 260,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('参数库类型'),
    dataIndex: 'categoryType',
    key: 'categoryType',
    align: 'center',
    resizable: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('资源库类型'),
    dataIndex: 'menuType',
    key: 'menuType',
    align: 'center',
    resizable: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'sort',
    key: 'sort',
    align: 'center',
    resizable: true,
    ellipsis: { showTitle: true },
    width: 100,
  },
  {
    title: WeiI18n.$t('分类节点共用'),
    dataIndex: 'categoryName',
    key: 'categoryName',
    align: 'left',
    resizable: true,
    ellipsis: { showTitle: true },
    width: 200,
  },
  {
    title: WeiI18n.$t('发布状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    ellipsis: { showTitle: true },
    width: 180,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 280,
    fixed: 'right',
    resizable: false,
  },
]);

const LIBRARY_TABLE_SCROLL_BUFFER = 24;
const libraryTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + LIBRARY_TABLE_SCROLL_BUFFER;
});

function applyLibraryTableColumnFilter(key: string) {
  if (key === 'menuName') {
    requestParams.menuName = String(libraryTableFilterValueMap.value.menuName ?? '').trim();
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setLibraryTableFilterOpen(key, false);
  void getResources();
}

function resetLibraryTableColumnFilter(key: string) {
  if (key === 'menuName') {
    libraryTableFilterValueMap.value = { ...libraryTableFilterValueMap.value, menuName: '' };
    requestParams.menuName = '';
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setLibraryTableFilterOpen(key, false);
  void getResources();
}

onMounted(() => {
  getResources();
});

function handleResizeColumn(w: number, col: TableColumnType<LibraryListRow>) {
  col.width = w;
}

function libraryTableRowClassName(_record: LibraryListRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function libraryRowKey(record: LibraryListRow) {
  return record.id;
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.admIndex');
}

function handleClosePowModal() {
  powVisible.value = false;
}

/** 属性配置弹窗请求关闭时：先询问是否保存，确定则保存后关闭，取消则仅关闭 */
function handleRequestClosePowModal() {
  powVisible.value = false;
  // Modal.confirm({
  //   title: WeiI18n.$t('是否保存当前配置？'),
  //   okText: WeiI18n.$t('确定'),
  //   cancelText: WeiI18n.$t('取消'),
  //   onOk: () => savePropertyConfig(),
  //   onCancel: () => handleClosePowModal(),
  // });
}

function handleCloseAddModal() {
  visibleNoticeEditor.value = false;
}

function onPowModalVisibleChange(v: boolean) {
  if (v) powVisible.value = true;
  else handleRequestClosePowModal();
}

function propertyTableRowKey(row: PropertyRow) {
  return row._rowKey ?? row.id;
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await businessApiLibrary.getLibraryPageList({
      ...requestParams,
    });
    console.log(res);
    resources.value = res.data.data.list || [];
    pagination.total = res.data?.data.total;
  } finally {
    loading.value = false;
  }
}
/**
 * 属性配置页面
 */
async function seeDetailFun(record: any) {
  propertyConfigRecord.value = record;
  const data: any = {
    menuId: Number(propertyConfigRecord.value.id),
    paraType: 0,
  };
  const res = await businessApiLibrary.getPropertyList(data);
  console.log(res);
  if (res.data.data.length > 0) {
    propertyList.value = (res.data.data as PropertyRow[]).map(r => ({
      ...r,
      _rowKey: r._rowKey ?? (r.id ? String(r.id) : genRowKey()),
    }));
  } else {
    propertyList.value = [createEmptyPropertyRow()];
  }
  powVisible.value = true;
}

function addPropertyRow() {
  const list = propertyList.value;
  const nextSort = list.length > 0 ? Math.max(...list.map(r => r.sort ?? 1)) + 1 : 1;
  propertyList.value = [...list, createEmptyPropertyRow(nextSort)];
}

async function removePropertyRow(row: PropertyRow) {
  const rowKey = row._rowKey ?? row.id;
  if (row.id != null && String(row.id).trim() !== '') {
    await businessApiLibrary.deleteLibraryProperty({ id: row.id });
    message.success(WeiI18n.$t('删除成功'));
  }
  propertyList.value = propertyList.value.filter(r => (r._rowKey ?? r.id) !== rowKey);
}

function showSelectParameter(record: any, index: number) {
  selectParmIndex.value = index;
  ParameterGeneralVisible.value = true;
  nextTick(() => {
    ParameterGeneralRef.value.handlegetData('');
  });
}

function handleSave(e: any) {
  const idx = selectParmIndex.value;
  if (idx < 0 || idx >= propertyList.value.length) {
    message.warning(WeiI18n.$t('未找到要替换的行，请重新选择'));
    ParameterGeneralVisible.value = false;
    return;
  }
  // 回填到当前点击的行
  propertyList.value[idx] = {
    ...propertyList.value[idx],
    parameterNum: e?.parameterNum ?? '',
    parameterId: e?.id != null ? String(e.id) : '',
  };
  ParameterGeneralVisible.value = false;
}

function movePropertyUp(index: number) {
  if (index <= 0) return;
  const list = [...propertyList.value];
  [list[index - 1], list[index]] = [list[index], list[index - 1]];
  list.forEach((row, i) => (row.sort = i + 1));
  propertyList.value = list;
}

function movePropertyDown(index: number) {
  if (index >= propertyList.value.length - 1) return;
  const list = [...propertyList.value];
  [list[index], list[index + 1]] = [list[index + 1], list[index]];
  list.forEach((row, i) => (row.sort = i + 1));
  propertyList.value = list;
}

async function savePropertyConfig() {
  const list = propertyList.value;
  // 校验 dataProp 为空
  const emptyIndex = list.findIndex(row => !row.dataProp || String(row.dataProp).trim() === '');
  if (emptyIndex !== -1) {
    message.error(WeiI18n.$t('属性内部值不能为空，请检查第') + (emptyIndex + 1) + WeiI18n.$t('行'));
    return;
  }
  // 校验 dataProp 重复（忽略大小写，trim 后比较）
  const dataProps = list.map(row => String(row.dataProp).trim().toLowerCase());
  const seen = new Set<string>();
  for (let i = 0; i < dataProps.length; i++) {
    const prop = dataProps[i];
    if (seen.has(prop)) {
      message.error(WeiI18n.$t('属性内部值不能重复，请检查第') + (i + 1) + WeiI18n.$t('行'));
      return;
    }
    seen.add(prop);
  }
  console.log(propertyList.value);
  const data: any = {};
  data.propertyDto = propertyList.value.map(({ _rowKey, ...rest }) => rest);
  const res = await businessApiLibrary.keepLibraryProperty(data);
  message.success(WeiI18n.$t('保存成功'));
  handleClosePowModal();
}
/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: number) {
  await businessApiLibrary.deleteLibrary({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
}

async function handleStatusChange(checked: any, record: any) {
  const data: any = {};
  data.id = record.id;
  if (checked) {
    data.status = 1;
  } else {
    data.status = 0;
  }
  const res = await businessApiLibrary.updateLibraryMenuStatus(data);
  if (checked) {
    message.success(WeiI18n.$t('发布成功'));
  } else {
    message.success(WeiI18n.$t('撤销成功'));
  }
  getResources();
}

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/**
 * 添加数据和编辑页面
 */
async function libraryAdd(record?: any) {
  visibleNoticeEditor.value = true;
  if (record) {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(record, resources.value);
    });
  } else {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(undefined, resources.value);
    });
  }
}
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}
</script>

<template>
  <div class="drawerContent library-page-root">
    <a-card class="library-list-card">
      <div class="library-list-body-scroll">
        <a-form
          layout="inline"
          class="calc-toolbar-form library-toolbar-form"
          :label-col="{ style: { width: '70px' } }"
          :model="requestParams"
          @finish="handleFinish">
          <a-form-item name="menuName">
            <a-input v-model:value="requestParams.menuName" style="width: 220px" allow-clear :placeholder="$t('请输入基础库名称')" />
          </a-form-item>
          <a-form-item class="library-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
            <a-button type="primary" style="margin-left: 15px" @click="libraryAdd(undefined)">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="library-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          :scroll="{ x: libraryTableScrollX }"
          :row-key="libraryRowKey"
          :columns="columns"
          :locale="locale"
          :data-source="libraryTableDisplayList"
          :pagination="false"
          @resize-column="handleResizeColumn"
          :loading="loading"
          :row-class-name="libraryTableRowClassName">
          <template #headerCell="{ column }">
            <template v-if="isLibraryTableSortableColumn(column) || isLibraryTableFilterableColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isLibraryTableFilterableColumn(column) }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isLibraryTableSortableColumn(column) }"
                  @click.stop="toggleLibraryTableColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isLibraryTableSortableColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getLibraryTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getLibraryTableSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isLibraryTableFilterableColumn(column)" class="header-filter-anchor" @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getLibraryTableFilterOpen('menuName')"
                    @openChange="onLibraryMenuNameFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="libraryTableFilterValueMap.menuName"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyLibraryTableColumnFilter('menuName')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyLibraryTableColumnFilter('menuName')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetLibraryTableColumnFilter('menuName')">{{ $t('重置') }}</a-button>
                        </div>
                      </div>
                    </template>
                    <FilterOutlined class="header-query-icon" @mousedown.stop />
                  </a-popover>
                </span>
              </div>
            </template>
            <template v-else>
              <div class="header-cell-main header-cell-main--static">
                <span class="header-title-sort header-title-sort--disabled">
                  <span>{{ column.title }}</span>
                </span>
              </div>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'categoryType'">
              <span>
                <span v-if="record.categoryType === 1"> {{ $t('固定列') }}</span>
                <span v-else-if="record.categoryType === 2"> {{ $t('自定义列') }}</span>
                <span v-else-if="record.categoryType === 3"> {{ $t('固定列+自定义列') }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'menuType'">
              <span>
                <span v-if="record.menuType === 1"> {{ $t('模块库') }}</span>
                <span v-else-if="record.menuType === 2"> {{ $t('UDF库') }}</span>
                <span v-else-if="record.menuType === 3"> {{ $t('列表数据类') }}</span>
                <span v-else-if="record.menuType === 4"> {{ $t('系统集成类') }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <span>
                <a-switch :checked="record.status === 1" @change="checked => handleStatusChange(checked, record)" />
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="libraryAdd(record)">{{ $t('编辑') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
                <a-button type="link" danger class="p-0 text-[12px]">
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
              <a-divider type="vertical" v-if="record.categoryType !== 2" />
              <a @click="seeDetailFun(record)" v-if="record.categoryType !== 2">{{ $t('属性配置') }}</a>
            </template>
            <template v-else>
              <span>{{ record[String(column.dataIndex || '')] }}</span>
            </template>
          </template>
        </a-table>
        <div class="library-list-pagination">
          <a-pagination v-bind="pagination" class="ant-table-pagination" />
        </div>
      </div>
      <LibraryAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
    </a-card>

    <!-- 属性配置弹窗 -->
    <div class="admIndex" v-dragModal>
      <a-modal
        :getContainer="customGetContainer"
        :visible="powVisible"
        @update:visible="onPowModalVisibleChange"
        :title="$t('属性配置')"
        width="1200px"
        :mask-closable="false"
        :body-style="{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }"
        :footer="null"
        destroy-on-close
        @cancel="handleRequestClosePowModal">
        <div class="property-config-wrap">
          <div class="property-config-toolbar">
            <a-button type="primary" @click="addPropertyRow">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加属性') }}
            </a-button>
          </div>
          <a-table
            :columns="propertyColumns"
            :data-source="propertyList"
            :row-key="propertyTableRowKey"
            :pagination="false"
            :scroll="{ x: 1240, y: 380 }"
            size="small"
            class="property-config-table">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'propertyName'">
                <a-input v-model:value="record.propertyName" placeholder="请输入..." allow-clear />
              </template>
              <template v-else-if="column.dataIndex === 'dataProp'">
                <a-input v-model:value="record.dataProp" placeholder="请输入..." allow-clear />
              </template>
              <template v-else-if="column.dataIndex === 'parameterNum'">
                <a-input v-model:value="record.parameterNum" placeholder="请选择" disabled style="width: 63%; float: left" />
                <a-button @click="showSelectParameter(record, index)" style="float: right; margin-top: 2px" type="primary" size="small">
                  <EpcIcon type="icon-liulan" style="font-size: 15px" />{{ $t('浏览') }}</a-button
                >
              </template>
              <template v-else-if="column.dataIndex === 'showFlag'">
                <a-select v-model:value="record.showFlag" placeholder="请选择" size="small" style="width: 100%">
                  <a-select-option v-for="opt in displayStatusOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'colWidth'">
                <a-input v-model:value="record.colWidth" placeholder="请输入..." allow-clear size="small" />
              </template>
              <template v-else-if="column.dataIndex === 'searchFlag'">
                <a-select v-model:value="record.searchFlag" placeholder="请选择" size="small" style="width: 100%">
                  <a-select-option v-for="opt in defaultQueryOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </a-select-option>
                </a-select>
              </template>

              <template v-else-if="column.dataIndex === 'propertyType'">
                <a-select v-model:value="record.propertyType" placeholder="请选择" size="small" style="width: 100%">
                  <a-select-option v-for="opt in textTypeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'selectStr'">
                <a-input v-model:value="record.selectStr" placeholder="请输入..." allow-clear size="small" />
              </template>
              <template v-else-if="column.dataIndex === 'parameterType'">
                <a-select v-model:value="record.parameterType" placeholder="请选择" size="small" style="width: 100%">
                  <a-select-option v-for="opt in numericTypeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="removePropertyRow(record)">
                  <a-button type="link" danger size="small" class="p-0">
                    {{ $t('删除') }}
                  </a-button>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a-button type="link" size="small" class="p-0" @click="movePropertyUp(index)">
                  {{ $t('上移') }}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="link" size="small" class="p-0" @click="movePropertyDown(index)">
                  {{ $t('下移') }}
                </a-button>
              </template>
            </template>
          </a-table>
          <div class="property-config-footer">
            <a-button type="primary" @click="savePropertyConfig">{{ $t('保存') }}</a-button>
            <a-button @click="handleRequestClosePowModal">{{ $t('关闭') }}</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
  <ParameterGeneral ref="ParameterGeneralRef" :modalVisible="ParameterGeneralVisible" @onClose="ParameterGeneralVisible = false" @handleSave="handleSave"></ParameterGeneral>
</template>

<style lang="less" scoped>
.admIndex {
  position: relative;
}

/* 填满主内容区，避免整页被顶出主布局 */
.drawerContent.library-page-root {
  height: 100%;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  position: static;
  background-color: #ffffff;
}

.calc-toolbar-form {
  gap: 4px;
}

.library-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.library-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.library-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.library-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.library-list-card {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: none;
  overflow: hidden;

  :deep(.ant-card-body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: 12px 20px 0;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.library-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.library-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.library-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.library-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.library-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.library-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.library-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.library-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.library-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.library-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.library-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.library-list-table.exe-config-table.parameter-table-spaced {
  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }
}

.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
}

.header-cell-main--static {
  padding-right: 0;
}

.header-cell-main--has-filter {
  gap: 6px;
  padding-right: 0;
}

.header-filter-anchor {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.header-filter-pop {
  width: 220px;
}

.header-filter-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}

// .user-selector-modal{
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

// :deep(.ant-table-column-sorters) {
//   justify-content: center;
//   align-items: flex-end;
// }

// :deep(.ant-table-column-title) {
//   flex: none;
// }

.property-config-wrap {
  .property-config-toolbar {
    margin-bottom: 16px;
  }
  .property-config-table {
    margin-bottom: 16px;
  }
  /* 保证操作列固定右侧时表头与内容对齐 */
  .property-config-table :deep(.ant-table-cell-fix-right) {
    z-index: 2;
  }
  .property-config-footer {
    text-align: right;
    padding-top: 12px;
    border-top: 1px solid var(--ant-color-border-secondary);
    .ant-btn + .ant-btn {
      margin-left: 8px;
    }
  }
}
</style>
