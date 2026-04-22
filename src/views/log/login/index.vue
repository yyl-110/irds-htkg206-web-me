<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { LoginLogResponseDTOModel } from '@/api/models/log/LoginLogResponseDTOModel';
import { AdminApiLog } from '@/api/tags/管理后台日志管理';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';

const loading = ref(false);
/** 时间对象 */
const dateRangeParams = ref([]);
/** 列表请求参数 */
const requestParams = reactive(new LoginLogResponseDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

type LoginListRow = Record<string, any> & { id: number | string };
type LoginSortOrder = 'ascend' | 'descend' | '';

const loginTableSortState = ref<{ key: string; order: LoginSortOrder }>({ key: '', order: '' });
const loginTableFilterValueMap = ref<Record<string, string>>({ username: '' });
const loginTableFilterOpenMap = ref<Record<string, boolean>>({});

function isLoginTableSortableColumn(column: { dataIndex?: unknown }) {
  const k = column?.dataIndex;
  return Boolean(k && k !== 'operation');
}

function isLoginTableFilterableColumn(column: { dataIndex?: unknown }) {
  return column?.dataIndex === 'username';
}

function setLoginTableFilterOpen(key: string, open: boolean) {
  loginTableFilterOpenMap.value = { ...loginTableFilterOpenMap.value, [key]: open };
}

function getLoginTableFilterOpen(key: string) {
  return Boolean(loginTableFilterOpenMap.value[key]);
}

function handleLoginTableFilterOpenChange(key: string, open: boolean) {
  if (open && key === 'username') {
    loginTableFilterValueMap.value = { ...loginTableFilterValueMap.value, username: String(requestParams.username ?? '') };
  }
  setLoginTableFilterOpen(key, open);
}

function onLoginUsernameFilterOpenChange(vis: boolean) {
  handleLoginTableFilterOpenChange('username', vis);
}

function getLoginTableSortOrder(dataIndex: string): LoginSortOrder {
  return loginTableSortState.value.key === dataIndex ? loginTableSortState.value.order : '';
}

function toggleLoginTableColumnSort(column: { dataIndex?: unknown }) {
  if (!isLoginTableSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (loginTableSortState.value.key !== key) {
    loginTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (loginTableSortState.value.order === 'ascend') {
    loginTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (loginTableSortState.value.order === 'descend') {
    loginTableSortState.value = { key: '', order: '' };
    return;
  }
  loginTableSortState.value = { key, order: 'ascend' };
}

/** 数据 */
const dataSource = ref<LoginListRow[]>([]);

const loginTableDisplayList = computed(() => {
  const list = [...dataSource.value];
  if (!loginTableSortState.value.key || !loginTableSortState.value.order) return list;
  const k = loginTableSortState.value.key;
  const sorted = [...list].sort((a: LoginListRow, b: LoginListRow) => sortermethod(a[k] as any, b[k] as any));
  return loginTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

const columns = ref<TableColumnType<LoginListRow>[]>([
  {
    title: WeiI18n.t('操作用户').value,
    dataIndex: 'username',
    key: 'username',
    width: 280,
    resizable: true,
    align: 'left',
    fixed: 'left',
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.t('操作IP').value,
    dataIndex: 'userIp',
    key: 'userIp',
    width: 280,
    resizable: true,
    align: 'center',
  },
  {
    title: WeiI18n.t('地址').value,
    dataIndex: 'ipRegion',
    key: 'ipRegion',
    width: 280,
    resizable: true,
    align: 'center',
  },
  {
    title: WeiI18n.t('用户登录时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    resizable: true,
    width: 280,
    align: 'center',
  },

]);

const LOGIN_TABLE_SCROLL_BUFFER = 24;
const loginTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + LOGIN_TABLE_SCROLL_BUFFER;
});

function applyLoginTableColumnFilter(key: string) {
  if (key === 'username') {
    requestParams.username = String(loginTableFilterValueMap.value.username ?? '').trim() as any;
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setLoginTableFilterOpen(key, false);
  void getListData();
}

function resetLoginTableColumnFilter(key: string) {
  if (key === 'username') {
    loginTableFilterValueMap.value = { ...loginTableFilterValueMap.value, username: '' };
    requestParams.username = '' as any;
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setLoginTableFilterOpen(key, false);
  void getListData();
}

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

function handleResizeColumn(w: number, col: TableColumnType<LoginListRow>) {
  col.width = w;
}

function loginTableRowClassName(_record: LoginListRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function loginRowKey(record: LoginListRow) {
  return record.id;
}

/**
 * @description 获取数据列表
 */
async function getListData() {
  if (dateRangeParams.value.length > 0) {
    requestParams.createTime = dateRangeParams.value as any;
  }
  requestParams.username = requestParams.username;
  requestParams.createTime = requestParams.createTime;
  loading.value = true;
  try {
    const res = await AdminApiLog.getLoginLogPageList(requestParams);
    if (res.data.code === 200) {
      const page = res.data.data as { list?: LoginListRow[]; total?: number } | undefined;
      dataSource.value = page?.list || [];
      pagination.total = page?.total;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getListData();
});

/** 表单对象 */
const formRef = ref();

/** 表单样式 label对象 */
const labelCol = ref({ style: { width: '100px', height: '50px' } });

/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });

/**
 * @description 重置搜索条件
 */
function handleReset() {
  dateRangeParams.value = [];
  requestParams.username = '' as any;
  formRef.value?.resetFields();
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}

/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
</script>

<template>
  <div class="drawerContent login-log-page-root">
    <a-card class="login-log-list-card">
      <div class="login-log-list-body-scroll">
        <a-form
          ref="formRef"
          class="form_css calc-toolbar-form login-log-toolbar-form"
          layout="inline"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :model="requestParams"
          @finish="handleFinish">
          <a-form-item name="username">
            <a-input v-model:value="requestParams.username" style="width: 220px; text-align: left" :placeholder="$t('请输入操作用户')" />
          </a-form-item>
          <a-form-item name="createTime">
            <a-range-picker
              v-model:value="dateRangeParams"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 340px; text-align: left"
              :placeholder="[$t('选择开始日期'), $t('选择结束日期')]" />
          </a-form-item>
          <a-form-item class="login-log-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
            <!-- <a-button @click="handleReset" style="margin-left: 8px">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button> -->
          </a-form-item>
        </a-form>

        <a-table
          class="login-log-list-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          :scroll="{ x: loginTableScrollX }"
          :pagination="false"
          :loading="loading"
          :row-key="loginRowKey"
          :locale="locale"
          :data-source="loginTableDisplayList"
          :columns="columns"
          :row-class-name="loginTableRowClassName"
          @resize-column="handleResizeColumn">
          <template #headerCell="{ column }">
            <template v-if="isLoginTableSortableColumn(column) || isLoginTableFilterableColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isLoginTableFilterableColumn(column) }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isLoginTableSortableColumn(column) }"
                  @click.stop="toggleLoginTableColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isLoginTableSortableColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getLoginTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getLoginTableSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isLoginTableFilterableColumn(column)" class="header-filter-anchor" @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getLoginTableFilterOpen('username')"
                    @openChange="onLoginUsernameFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="loginTableFilterValueMap.username"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyLoginTableColumnFilter('username')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyLoginTableColumnFilter('username')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetLoginTableColumnFilter('username')">{{ $t('重置') }}</a-button>
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
            <template v-if="column.dataIndex === 'operation'">
              <div style="height: 22px; display: flex; align-items: center">
                <!-- <a @click.stop="handleDetail(record)">{{ $t('查看') }}</a> -->
              </div>
            </template>
            <template v-else>
              <span>{{ record[String(column.dataIndex || '')] }}</span>
            </template>
          </template>
        </a-table>
        <div class="login-log-list-pagination">
          <a-pagination v-bind="pagination" class="ant-table-pagination" />
        </div>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
/* 填满主内容区，避免整页被顶出主布局 */
.drawerContent.login-log-page-root {
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

.login-log-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.login-log-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.login-log-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.login-log-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.form_css .ant-form {
  margin-bottom: 0;
}

.login-log-list-card {
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

.login-log-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.login-log-list-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.login-log-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.login-log-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.login-log-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.login-log-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.login-log-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.login-log-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.login-log-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.login-log-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.login-log-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.login-log-list-table.exe-config-table.parameter-table-spaced {
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

.card_css {
  margin-top: 0;
}

.calclation-content {
  width: 100%;
  padding: 10px 20px 15px 20px;
  text-align: left;
  color: #222222;
  height: 80px;
  background: #fff;
}
</style>
