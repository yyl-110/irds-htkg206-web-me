<script lang="ts" setup>
import { computed, h, nextTick, onMounted, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { useRender } from '@/components/escape';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import NoticeDetail from './components/notice-detail.vue';
import NoticeAddOrUpdate from './components/notice-addorupdate.vue';
import Empty from '@/components/Empty/index.vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { sortermethod } from '@/utils/tools';
const powerModel = ref<any>(null);
const addOrUpdateModel = ref<any>(null);

const userStore = useUserStore();
const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);
/** 是否显示 新增 / 编辑 弹窗 */
const visibleNoticeEditor = ref<boolean>(false);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('公告名称'),
    dataIndex: 'title',
    key: 'title',
    align: 'left',
    fixed: 'left',
    resizable: true,
    width: 320,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('类型'),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    resizable: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'left',
    resizable: true,
    width: 200,
    /**
     * customRender
     * @param root0 params
     * @param root0.text text
     */
    customRender: ({ text }) => {
      return useRender.renderDateNoTime(text);
    },
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    width: 180,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 300,
    fixed: 'right',
    resizable: false,
  },
]);

const { dateRange, dateRangeParams } = useDateRangeParams();
/** 列表请求参数（须在表头筛选用到 requestParams 之前声明） */
const requestParams = reactive(new NoticePageRequestDTOModel());
requestParams.releaseFlag = 0;
requestParams.userid = userStore.getUser.id;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const resources = ref<Array<NoticeInfoRequestDTOModel>>([]);

type NoticeSortOrder = 'ascend' | 'descend' | '';
const noticeTableSortState = ref<{ key: string; order: NoticeSortOrder }>({ key: '', order: '' });

const noticeTableFilterValueMap = ref<Record<string, string>>({ title: '' });
const noticeTableFilterOpenMap = ref<Record<string, boolean>>({});

function isNoticeTableSortableColumn(column: { dataIndex?: unknown }) {
  const k = column?.dataIndex;
  return Boolean(k && k !== 'operation');
}

function isNoticeTableFilterableColumn(column: { dataIndex?: unknown }) {
  return column?.dataIndex === 'title';
}

function setNoticeTableFilterOpen(key: string, open: boolean) {
  noticeTableFilterOpenMap.value = { ...noticeTableFilterOpenMap.value, [key]: open };
}

function getNoticeTableFilterOpen(key: string) {
  return Boolean(noticeTableFilterOpenMap.value[key]);
}

function handleNoticeTableFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'title') {
      noticeTableFilterValueMap.value = { ...noticeTableFilterValueMap.value, title: String(requestParams.title ?? '') };
    }
  }
  setNoticeTableFilterOpen(key, open);
}

function onNoticeTitleTableFilterOpenChange(visible: boolean) {
  handleNoticeTableFilterOpenChange('title', visible);
}

function getNoticeTableSortOrder(dataIndex: string): NoticeSortOrder {
  return noticeTableSortState.value.key === dataIndex ? noticeTableSortState.value.order : '';
}

function toggleNoticeTableColumnSort(column: { dataIndex?: unknown }) {
  if (!isNoticeTableSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (noticeTableSortState.value.key !== key) {
    noticeTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (noticeTableSortState.value.order === 'ascend') {
    noticeTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (noticeTableSortState.value.order === 'descend') {
    noticeTableSortState.value = { key: '', order: '' };
    return;
  }
  noticeTableSortState.value = { key, order: 'ascend' };
}

const noticeTableDisplayList = computed(() => {
  const list = [...resources.value];
  if (!noticeTableSortState.value.key || !noticeTableSortState.value.order) return list;
  const k = noticeTableSortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[k], b[k]));
  return noticeTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function applyNoticeTableColumnFilter(key: string) {
  if (key === 'title') {
    requestParams.title = String(noticeTableFilterValueMap.value[key] ?? '').trim();
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setNoticeTableFilterOpen(key, false);
  void getResources();
}

function resetNoticeTableColumnFilter(key: string) {
  if (key === 'title') {
    noticeTableFilterValueMap.value = { ...noticeTableFilterValueMap.value, title: '' };
    requestParams.title = '';
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setNoticeTableFilterOpen(key, false);
  void getResources();
}

const NOTICE_TABLE_SCROLL_BUFFER = 24;
const noticeTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + NOTICE_TABLE_SCROLL_BUFFER;
});

onMounted(() => {
  getResources();
});

function handleResizeColumn(w: number, col: TableColumnType<NoticeInfoRequestDTOModel>) {
  col.width = w;
}

function noticeTableRowClassName(_record: NoticeInfoRequestDTOModel, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function noticeRowKey(record: NoticeInfoRequestDTOModel) {
  return record.id;
}

function handleClosePowModal() {
  powVisible.value = false;
}

function handleCloseAddModal() {
  visibleNoticeEditor.value = false;
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await AdminApiSystemNotice.getNoticePageList({
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
 * 详情查看页面
 */
async function seeDetailFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
  let data = res.data.data.systemNoticeInfoBaseDTO;
  let filedata = res.data.data;
  powVisible.value = true;
  nextTick(() => {
    powerModel.value.getDetailFromMain(data, filedata);
  });
}

/**
 * 发布公告
 */
async function pushFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.noticeRelease({ ...requestParams });
  nextTick(() => {
    //发布成功刷新页面
    message.success(WeiI18n.$t('发布成功'));
    getResources();
  });
}

/**
 * 撤销发布
 */
async function goBackPushFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.goBackNotice({ ...requestParams });
  nextTick(() => {
    //撤销成功刷新页面
    message.success(WeiI18n.$t('撤销成功'));
    getResources();
  });
}

/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: string) {
  await AdminApiSystemNotice.deleteNotice({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
  //   },
  // })
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
async function noticeAdd(record?: any) {
  visibleNoticeEditor.value = true;
  if (record) {
    requestParams.id = record.id;
    const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
    console.log(res);
    let data = res.data.data.systemNoticeInfoBaseDTO;
    let filedata = res.data.data;
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(data, filedata);
    });
  } else {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate();
    });
  }
}
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}
function handleReset() {
  requestParams.title = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}
</script>

<template>
  <div class="drawerContent notice-page-root">
    <a-card class="notice-list-card">
      <div class="notice-list-body-scroll">
        <a-form layout="inline" class="calc-toolbar-form notice-toolbar-form" :label-col="{ style: { width: '70px' } }" :model="requestParams" @finish="handleFinish">
        <a-form-item name="title">
          <a-input v-model:value="requestParams.title" style="width: 220px" allow-clear :placeholder="$t('请输入公告名称')" />
        </a-form-item>
        <a-form-item class="notice-toolbar-form__actions">
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <a-button type="primary" style="margin-left: 15px" @click="noticeAdd(undefined)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
      </a-form>

      <a-table
        class="notice-list-table exe-config-table parameter-table-spaced"
        bordered
        table-layout="fixed"
        :scroll="{ x: noticeTableScrollX }"
        :row-key="noticeRowKey"
        :columns="columns"
        :locale="locale"
        :data-source="noticeTableDisplayList"
        :pagination="false"
        @resize-column="handleResizeColumn"
        :loading="loading"
        :row-class-name="noticeTableRowClassName">
        <template #headerCell="{ column }">
          <template v-if="isNoticeTableSortableColumn(column) || isNoticeTableFilterableColumn(column)">
            <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isNoticeTableFilterableColumn(column) }">
              <span
                class="header-title-sort"
                :class="{ 'header-title-sort--disabled': !isNoticeTableSortableColumn(column) }"
                @click.stop="toggleNoticeTableColumnSort(column)">
                <span>{{ column.title }}</span>
                <span v-if="isNoticeTableSortableColumn(column)" class="header-sort-icon">
                  <CaretUpOutlined v-if="getNoticeTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                  <CaretDownOutlined v-else-if="getNoticeTableSortOrder(String(column.dataIndex)) === 'descend'" />
                  <CaretUpOutlined v-else class="header-sort-icon--muted" />
                </span>
              </span>
              <span v-if="isNoticeTableFilterableColumn(column)" class="header-filter-anchor" @mousedown.stop>
                <a-popover
                  trigger="click"
                  placement="bottomRight"
                  :open="getNoticeTableFilterOpen('title')"
                  @openChange="onNoticeTitleTableFilterOpenChange">
                  <template #content>
                    <div class="header-filter-pop">
                      <a-input
                        v-model:value="noticeTableFilterValueMap.title"
                        :placeholder="`${$t('搜索')} ${column.title}`"
                        allow-clear
                        @pressEnter="applyNoticeTableColumnFilter('title')" />
                      <div class="header-filter-actions">
                        <a-button type="primary" size="small" @click="applyNoticeTableColumnFilter('title')">
                          <SearchOutlined />
                          {{ $t('确定') }}
                        </a-button>
                        <a-button size="small" @click="resetNoticeTableColumnFilter('title')">{{ $t('重置') }}</a-button>
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
          <template v-if="column.dataIndex === 'type'">
            <span>
              <span v-if="record.type === '1'"> {{ $t('富文本') }}</span>
              <span v-else>{{ $t('附件') }}</span>
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === '0'">{{ $t('未发布') }}</a-tag>
              <a-tag v-else-if="record.status === '1'" color="blue">{{ $t('已发布') }}</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a @click="seeDetailFun(record.id)">{{ $t('查看') }}</a>
            <a-divider type="vertical" />
            <a @click="noticeAdd(record)">{{ $t('编辑') }}</a>

            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0 text-[12px]">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a v-if="record.status === '0'" @click="pushFun(record.id)">{{ $t('发布') }}</a>
            <a v-else @click="goBackPushFun(record.id)">{{ $t('撤销') }}</a>
          </template>
          <!-- <template v-else>
          {{ column.dataIndex }}
        </template> -->
        </template>
      </a-table>
        <div class="notice-list-pagination">
          <a-pagination v-bind="pagination" class="ant-table-pagination" />
        </div>
      </div>
      <NoticeAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
      <NoticeDetail ref="powerModel" :modal-visible="powVisible" @refreshtabledata="getResources" @close="handleClosePowModal" />
    </a-card>
  </div>
</template>

<style lang="less" scoped>
/* 填满 .route-page-wrapper，避免整块页面顶出主布局导致浏览器最右侧出整页滚动条 */
.drawerContent.notice-page-root {
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

/* 与 system/role 一致：条件与按钮同一行、垂直居中对齐 */
.notice-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.notice-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.notice-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.notice-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

/* 与菜单 / 用户列表一致；卡片内区域滚动，不把整页顶出主内容区 */
.notice-list-card {
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

/* 搜索区 + 表格 + 分页在此区域滚动（竖向/横向在需要时仅出现在内容区，而非浏览器最外侧） */
.notice-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.notice-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.notice-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.notice-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.notice-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.notice-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.notice-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.notice-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.notice-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.notice-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.notice-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.notice-list-table.exe-config-table.parameter-table-spaced {
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

/* 表头：自定义排序 + 首列筛选（与 system/role、product/parameter 一致） */
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
</style>
