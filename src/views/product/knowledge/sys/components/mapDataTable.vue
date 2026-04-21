<template>
  <div class="tableWrap p-[16px] h-full flex flex-col pb-0">
    <div class="header">
      <div class="map-data-toolbar flex flex-wrap items-center gap-[8px]">
        <a-input
          v-model:value="searchData.title"
          placeholder="请输入标题"
          class="map-data-toolbar__field"
          allow-clear
          @keydown.enter="fetchProductList" />
        <a-select
          v-model:value="searchData.type"
          class="map-data-toolbar__field map-data-toolbar__select"
          placeholder="请选择知识类型"
          allow-clear>
          <a-select-option v-for="item in tagList" :key="item.id" :value="item.value">{{ item.name }}</a-select-option>
        </a-select>

        <a-button type="primary" @click="fetchProductList">查询</a-button>
        <a-button type="primary" @click="reset">重置</a-button>
        <a-button type="primary" @click="addDataDialogVisible = true">
          <template #icon>
            <PlusOutlined />
          </template>
          创建项目
        </a-button>
        <a-button>
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
    </div>
    <main class="mt-[16px] flex-1 map-data-table-main min-h-0">
      <a-card class="calc-table-card">
        <a-table
          class="exe-config-table"
          :columns="columns"
          :data-source="mapTableDisplayList"
          :scroll="{ x: mapTableScrollX, y: 'calc(100vh - 400px)' }"
          :row-key="getMapRowKey"
          :loading="loading"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          bordered
          table-layout="fixed"
          :row-class-name="getMapTableRowClassName"
          :pagination="pagination"
          @resize-column="handleResizeColumn">
          <template #headerCell="{ column }">
            <template v-if="isMapTableSelectionColumn(column)">
              <span />
            </template>
            <template v-else-if="isSortableMapColumn(column) || isFilterableMapColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isFilterableMapColumn(column) }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isSortableMapColumn(column) }"
                  @click.stop="toggleMapColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isSortableMapColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getMapSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getMapSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isFilterableMapColumn(column)" class="header-filter-anchor">
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getMapFilterOpen(String(column.dataIndex))"
                    @openChange="handleMapFilterOpenChange(String(column.dataIndex), $event)">
                    <template #content>
                      <div class="header-filter-pop">
                        <template v-if="String(column.dataIndex) === 'fileName'">
                          <a-input v-model:value="filterValueMap.fileName" placeholder="搜索标题" allow-clear />
                        </template>
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyMapColumnFilter(String(column.dataIndex))">
                            <SearchOutlined />
                            确定
                          </a-button>
                          <a-button size="small" @click="resetMapColumnFilter(String(column.dataIndex))">重置</a-button>
                        </div>
                      </div>
                    </template>
                    <FilterOutlined class="header-query-icon" />
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
            <template v-if="column.key === 'type'">
              <span>{{ getTagName(record?.type) }}</span>
            </template>
            <template v-else-if="column.key === 'fileName'">
              <a-tooltip :title="record?.fileName">
                <div class="text-primary cursor-pointer text-ellipsis w-full overflow-hidden" @click="viewPdfFun(record)">
                  {{ record?.fileName }}</div>
              </a-tooltip>
            </template>
            <template v-else-if="column.key === 'addTime'">
              <span>{{ getTimes(Date.parse(record?.addTime)) }}</span>
            </template>
            <template v-else-if="column.key === 'operation'">
              <a href="#" class="map-data-op-delete" @click.prevent="deleteProject(record)">删除</a>
            </template>
            <template v-else-if="column.key === 'confidential_level'">
              <a-tag v-if="record.confidential_level === '0' || record.confidential_level === null" color="default">公开</a-tag>
              <a-tag v-else-if="record.confidential_level === '1'" color="blue">内部</a-tag>
              <a-tag v-else-if="record.confidential_level === '2'" color="orange">秘密</a-tag>
              <a-tag v-else-if="record.confidential_level === '3'" color="red">机密</a-tag>
              <a-tag v-else color="default">公开</a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </main>

    <center-search :addDataDialogVisible="addDataDialogVisible" @closeCenterDia="addDataDialogVisible = false"
      @handleSuccess="handleSuccess" :nodeId="nodeId" />
    <Video :videoHide="videoHide" :fileUrlPlay="fileUrlPlay" :dialogType="dialogType" :titleType="titleType"
      @getVideoHide="getVideoHide"></Video>
  </div>
</template>

<script setup lang="ts">
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { getPdfPreviewPath, knowledgeFileMapData, removeMapData, updateKldCounting } from '@/api/knowledge';
import { message, Modal, TableColumnsType } from 'ant-design-vue';
import { getTimes } from '@/utils/dateUtils';
import { PaginationConfig } from 'ant-design-vue/es/pagination';
import { sortermethod } from '@/utils/tools';
import Video from '@/views/knowledge/components/videoImg.vue';
import centerSearch from './centerSearch.vue'


const props = defineProps({
  kldTreeId: {
    type: String,
    default: ''
  },
  tagList: {
    type: Array,
    default: () => []
  },
  nodeId: {
    type: String,
    default: ''
  }
})

const searchData = ref({
  tagName: '',
  type: null,
  title: '',
  userName: ''
})

// const tagList = ref<{ name: string; id: number; value: string; }[]>([])
const loading = ref(false)
const selectedRowKeys = ref<string[]>([]);
const router = useRouter()
const addDataDialogVisible = ref(false)

const videoHide = ref(false)
const fileUrlPlay = ref('')
const dialogType = ref('')
// 弹窗title类型
const titleType = ref('');

const pagination = reactive<PaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 10,
  showLessItems: true,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (pageNum, pageSize) => {
    pagination.current = pageNum;
    pagination.pageSize = pageSize;
    fetchProductList();
  },
})

// 添加数据弹框保存成功回调
const handleSuccess = () => {
  fetchProductList()
  addDataDialogVisible.value = false
}

async function fetchProductList() {
  try {
    loading.value = true;
    const params = { ...searchData.value, kldTreeId: props.kldTreeId, currentPage: pagination.current, pageSize: pagination.pageSize }
    const res = await knowledgeFileMapData(params);
    if (res && res.data.code === "0") {
      tableData.value = res.data.data?.result || [];
      pagination.total = res.data.data?.total || 0;
    }
  } catch (error) {
    console.log("error:", error);
  } finally {
    loading.value = false;
  }
}

// 查看pdf
const viewPdf = (item) => {
  updateKldCounting({ kldFileId: item.id, countingType: 1 });
  getPdfPreviewPath({ id: item.fileId }).then((res) => {
    if (res && res.status === 200) {
      router.push({
        path: "/knowledge/pdfView",
        query: { docId: res.data.fileUrl },
      });
    }
  });
};

const viewPdfFun = (item) => {
  dialogType.value = item.type;
  if (item.type === '1') {
    viewPdf(item);
  } else if (item.type === '2') {
    fileUrlPlay.value = item?.fileUrl;
    videoHide.value = true;
    titleType.value = '视频播放';
  } else if (item.type === '3') {
    fileUrlPlay.value = item?.fileUrl;
    videoHide.value = true;
    titleType.value = '图片查看';
  }
};

/** 斑马纹 class 与 parameter/index.vue 一致 */
function getMapTableRowClassName(_record: any, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

const tableData = ref<any[]>([]);

const getTagName = (type: string | number | undefined) =>
  (props.tagList as any[]).find((item: any) => String(item.value) === String(type ?? ''))?.name as string | undefined;

/** 横向滚动：列 width 之和 + 勾选列（与 parameter/index.vue 一致） */
const MAP_TABLE_SCROLL_BUFFER = 2;
const MAP_TABLE_SELECTION_COL_W = 60;
const mapTableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + MAP_TABLE_SELECTION_COL_W + MAP_TABLE_SCROLL_BUFFER;
});

function getMapRowKey(record: any) {
  return record.id;
}

function handleResizeColumn(w: number, col: any) {
  col.width = w;
}

/** 列定义：首列/操作列固定；可拖拽列宽（与 parameter 一致） */
const columns = ref<TableColumnsType>([
  {
    title: '标题',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 200,
    ellipsis: true,
    fixed: 'left',
    align: 'left',
    resizable: false,
  },
  {
    title: '知识类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    align: 'center',
    resizable: true,
  },
  {
    title: '知识来源',
    dataIndex: 'source',
    key: 'source',
    width: 120,
    align: 'center',
    resizable: true,
  },
  {
    title: '密级',
    dataIndex: 'confidential_level',
    key: 'confidential_level',
    width: 90,
    align: 'center',
    resizable: true,
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    key: 'addTime',
    width: 120,
    align: 'center',
    resizable: true,
  },
  {
    title: '创建人',
    dataIndex: 'userName',
    key: 'userName',
    width: 120,
    align: 'center',
    resizable: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 80,
    align: 'center',
    fixed: 'right',
    resizable: false,
  },
]);

/** 表头排序、筛选（与 parameter/index.vue 一致：当前页数据） */
type MapSortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: MapSortOrder }>({ key: '', order: '' });
const columnFilters = ref({
  fileName: '',

});
const filterValueMap = ref({
  fileName: '',

});
const filterOpenMap = ref<Record<string, boolean>>({});

function confidentialLevelLabel(v: string | null | undefined) {
  if (v === '0' || v === null || v === undefined || v === '') return '公开';
  if (v === '1') return '内部';
  if (v === '2') return '秘密';
  if (v === '3') return '机密';
  return String(v);
}

const mapSourceFilterOptions = computed(() => {
  const set = new Set<string>();
  for (const row of tableData.value) {
    const v = row?.source;
    if (v != null && v !== '') set.add(String(v));
  }
  return [...set].sort((a, b) => sortermethod(a, b)).map(v => ({ label: v, value: v }));
});

const mapConfidentialFilterOptions = computed(() => {
  const set = new Set<string>();
  for (const row of tableData.value) {
    const raw = row?.confidential_level;
    const key = raw === null || raw === undefined || raw === '' ? '0' : String(raw);
    set.add(key);
  }
  return [...set]
    .sort((a, b) => sortermethod(a, b))
    .map(v => ({ label: confidentialLevelLabel(v === '0' ? null : v), value: v }));
});

const mapUserNameFilterOptions = computed(() => {
  const set = new Set<string>();
  for (const row of tableData.value) {
    const v = row?.userName;
    if (v != null && v !== '') set.add(String(v));
  }
  return [...set].sort((a, b) => sortermethod(a, b)).map(v => ({ label: v, value: v }));
});

function mapSortCompare(a: any, b: any, key: string) {
  if (key === 'type') {
    return sortermethod(getTagName(a?.type) ?? String(a?.type ?? ''), getTagName(b?.type) ?? String(b?.type ?? ''));
  }
  if (key === 'confidential_level') {
    return sortermethod(confidentialLevelLabel(a?.confidential_level), confidentialLevelLabel(b?.confidential_level));
  }
  return sortermethod(String(a?.[key] ?? ''), String(b?.[key] ?? ''));
}

const mapTableDisplayList = computed(() => {
  let list = [...tableData.value];
  const f = columnFilters.value;
  if (f.fileName.trim()) {
    const q = f.fileName.trim().toLowerCase();
    list = list.filter((r: any) => String(r?.fileName ?? '').toLowerCase().includes(q));
  }
  if (!sortState.value.key || !sortState.value.order) return list;
  const key = sortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => mapSortCompare(a, b, key));
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function isMapTableSelectionColumn(column: any) {
  const c = column?.className;
  if (typeof c === 'string') return c.includes('selection-column');
  if (Array.isArray(c)) return c.some((x: unknown) => String(x).includes('selection-column'));
  return false;
}

function isSortableMapColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation') return false;
  return true;
}

function isFilterableMapColumn(column: any) {
  const di = column?.dataIndex;
  return di === 'fileName';
}

function toggleMapColumnSort(column: any) {
  if (!isSortableMapColumn(column)) return;
  const key = String(column.dataIndex);
  if (sortState.value.key !== key) {
    sortState.value = { key, order: 'ascend' };
    return;
  }
  if (sortState.value.order === 'ascend') {
    sortState.value = { key, order: 'descend' };
    return;
  }
  if (sortState.value.order === 'descend') {
    sortState.value = { key: '', order: '' };
    return;
  }
  sortState.value = { key, order: 'ascend' };
}

function getMapSortOrder(key: string): MapSortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function getMapFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function handleMapFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'fileName') {
      filterValueMap.value = { ...filterValueMap.value, fileName: columnFilters.value.fileName };
    }
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function applyMapColumnFilter(key: string) {
  if (key === 'fileName') {
    columnFilters.value = { ...columnFilters.value, fileName: String(filterValueMap.value.fileName ?? '').trim() };
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
}

function resetMapColumnFilter(key: string) {
  if (key === 'fileName') {
    filterValueMap.value = { ...filterValueMap.value, fileName: '' };
    columnFilters.value = { ...columnFilters.value, fileName: '' };
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
}


const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};


const reset = () => {
  searchData.value = {
    tagName: '',
    type: null,
    title: '',
    userName: '',
  };
  sortState.value = { key: '', order: '' };
  columnFilters.value = { fileName: ''};
  filterValueMap.value = {
    fileName: ''

  };
  filterOpenMap.value = {};
  void fetchProductList();
};

const getVideoHide = val => {
  videoHide.value = val;
};

const deleteProject = (row) => {
  try {
    Modal.confirm({
      title: '温馨提示',
      content: '是否确认删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await removeMapData({ id: row.id })
        if (res.data.code === '0') {
          message.success('删除成功')
          fetchProductList()
        }
      },
    });

  } catch (error) {
  console.log('error:', error)
  }
}

watch(() => props.kldTreeId, () => {
  if (props.kldTreeId) {
    pagination.current = 1;
    pagination.pageSize = 10;
    fetchProductList()
  }
})


</script>

<style scoped lang="less">
/* 表格区域布局（右侧列表与 parameter 一致：卡片 + 表） */
.map-data-table-main {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 以下与 src/views/product/parameter/index.vue 中 .calc-table-card / .exe-config-table 一致 */
.calc-table-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 0;
  }

  :deep(.ant-table-wrapper) {
    height: 100%;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead .ant-table-column-sorters) {
    justify-content: center !important;
  }

  :deep(.ant-table-thead .ant-table-column-title) {
    flex: none;
  }

  /* 本页仍使用列内置筛选时，标题与漏斗与 parameter 自定义表头视觉对齐 */
  :deep(.ant-table-thead .ant-table-filter-column) {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  :deep(.ant-table-thead .ant-table-filter-trigger) {
    margin-inline-start: 4px;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }
}

.exe-config-table {
  :deep(.ant-table-cell-ellipsis .ant-typography) {
    margin-bottom: 0;
  }

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

/* 表头：标题 + 排序 + 右侧筛选图标（与 parameter/index.vue 一致） */
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
  padding-right: 22px;
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

.map-data-op-delete {
  color: #ff4d4f;
  cursor: pointer;
}

.map-data-op-delete:hover {
  color: #ff7875;
}

/* 工具栏：占位符、输入、按钮统一 14px；条件与四个按钮同一行（空间不足时换行） */
.map-data-toolbar {
  font-size: 14px;
  line-height: 1.5715;

  :deep(.ant-input),
  :deep(.ant-input::placeholder),
  :deep(.ant-select-single .ant-select-selector),
  :deep(.ant-select-selection-item),
  :deep(.ant-select-selection-placeholder) {
    font-size: 14px;
  }

  :deep(.ant-btn) {
    font-size: 14px;
  }
}

.map-data-toolbar__field {
  width: 200px;
  max-width: 200px;
}

.map-data-toolbar__select {
  min-width: 200px;
}
</style>