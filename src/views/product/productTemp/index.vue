<script lang="ts" setup>
import { computed, h, nextTick, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { useRender } from '@/components/escape';
import { ProductTempPageRequestDTOModel } from '@/api/models/productTemp/ProductTempPageRequestDTOModel';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import ProductTempAddOrUpdate from './components/productTemp-addorupdate.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { useLayoutStore } from '@/store/modules/layout/layout';
const addOrUpdateModel = ref<any>(null);
const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';

const router = useRouter();
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const loading = ref<boolean>(false);
const titleVisible = ref<boolean>(false);
const shouldShowDrawer = ref<boolean>(false);
const titleList = ref<any[]>([]);
const menuId = ref<string>('');
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '0px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh)',
});
function resetDrawerStyle() {
  drawerStyle.value = {};
}
/** 是否显示 新增 / 编辑 弹窗 */
const visibleNoticeEditor = ref<boolean>(false);
const visibleHistoryModal = ref<boolean>(false);
const historyLoading = ref<boolean>(false);
const historyList = ref<any[]>([]);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('模板编号'),
    dataIndex: 'tempNum',
    key: 'tempNum',
    align: 'left',
    fixed: 'left',
    resizable: false,
    ellipsis: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('模板名称'),
    dataIndex: 'tempName',
    key: 'tempName',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'versionNum',
    key: 'versionNum',
    align: 'center',
    resizable: true,
    width: 130,
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 180,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remarks',
    key: 'remarks',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 270,
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    fixed: 'right',
    resizable: false,
    width: 250,
  },
]);

/** 表头排序、筛选（与 parameter/index.vue 列表一致） */
type ProductTempSortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: ProductTempSortOrder }>({ key: '', order: '' });
const filterValueMap = ref<Record<string, string>>({ tempNum: '', tempName: '' });
const filterOpenMap = ref<Record<string, boolean>>({});

function isSortableProductTempColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation') return false;
  return true;
}

function isFilterableProductTempColumn(column: any) {
  const di = column?.dataIndex;
  return di === 'tempNum' || di === 'tempName';
}

function toggleProductTempColumnSort(column: any) {
  if (!isSortableProductTempColumn(column)) return;
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

function getProductTempSortOrder(key: string): ProductTempSortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function getProductTempFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function handleProductTempFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'tempNum') {
      filterValueMap.value = { ...filterValueMap.value, tempNum: String(requestParams.tempNum ?? '') };
    }
    if (key === 'tempName') {
      filterValueMap.value = { ...filterValueMap.value, tempName: String(requestParams.tempName ?? '') };
    }
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function applyProductTempColumnFilter(key: string) {
  const v = String(filterValueMap.value[key] ?? '').trim();
  if (key === 'tempNum') requestParams.tempNum = v;
  if (key === 'tempName') requestParams.tempName = v;
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void getResources();
}

function resetProductTempColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  if (key === 'tempNum') requestParams.tempNum = '';
  if (key === 'tempName') requestParams.tempName = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void getResources();
}

/** 列宽之和 + 缓冲，保证横向滚动与固定列生效（与 parameter 列表思路一致） */
const SCROLL_X_BUFFER_PX = 2;
const productTempTableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + SCROLL_X_BUFFER_PX;
});

const { dateRange, dateRangeParams } = useDateRangeParams();
/** 列表请求参数 */
const requestParams = reactive(new ProductTempPageRequestDTOModel());
requestParams.userid = userStore.getUser.id;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const resources = ref<Array<NoticeInfoRequestDTOModel>>([]);

const productTempTableDisplayList = computed(() => {
  let list = [...resources.value];
  if (!sortState.value.key || !sortState.value.order) return list;
  const key = sortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[key], b[key]));
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

onMounted(() => {
  drawerStyle.value = {
    marginLeft: layoutStore.asideWidthStyle,
    marginTop: '0px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh)',
  };
  getMenuListData();
});

function handleResizeColumn(w, col) {
  col.width = w;
}

function handleCloseAddModal() {
  visibleNoticeEditor.value = false;
}

/** 获取公告列表数据 */
async function getResources() {
  if (!menuId.value) return;
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await AdminApiProductTemp.getProductTempPageList({
      ...requestParams,
      menuId: menuId.value,
    });
    resources.value = res.data.data.list || [];
    pagination.total = res.data?.data.total;
  } finally {
    loading.value = false;
  }
}

async function showVersionHistory(record: any) {
  visibleHistoryModal.value = true;
  historyLoading.value = true;
  try {
    const data: any = {};
    data.tempId = record.id;
    data.menuId = menuId.value;
    const res = await AdminApiProductTemp.getHistoryList(data);
    historyList.value = (res?.data?.data || []).sort((a: any, b: any) => Number(b.versionNum || 0) - Number(a.versionNum || 0));
  } finally {
    historyLoading.value = false;
  }
}

function closeHistoryModal() {
  visibleHistoryModal.value = false;
}

function getVersionText(versionNum: string | number) {
  return `V${versionNum}.0`;
}

/**
 * 发布公告
 */
async function pushFun(id: string) {
  const data: any = {};
  data.id = id;
  data.status = 1;
  data.menuId = menuId.value;
  const res = await AdminApiProductTemp.goBackPushFun(data);
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
  const data: any = {};
  data.id = id;
  data.status = 0;
  data.menuId = menuId.value;
  const res = await AdminApiProductTemp.goBackPushFun(data);
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
async function handleDelete(id: any) {
  const data: any = {};
  data.id = id;
  data.menuId = menuId.value;
  await AdminApiProductTemp.productTempDelete(data);
  message.success(WeiI18n.$t('删除成功'));
  getResources();
}

async function getMenuListData() {
  try {
    const res = await AdminApiSystemProduct.getProjectTreeList();
    titleList.value = Array.isArray(res?.data?.data) ? res.data.data : [];
    const skipDrawerOnReturn = sessionStorage.getItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN) === '1';
    if (skipDrawerOnReturn) {
      sessionStorage.removeItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN);
      if (titleList.value.length > 0) {
        shouldShowDrawer.value = false;
        menuId.value = String(titleList.value[0]?.id ?? '');
        titleVisible.value = false;
        resetDrawerStyle();
        await getResources();
      }
      return;
    }
    if (titleList.value.length === 1) {
      shouldShowDrawer.value = false;
      titleVisible.value = false;
      menuId.value = String(titleList.value[0]?.id ?? '');
      resetDrawerStyle();
      await getResources();
      return;
    }
    shouldShowDrawer.value = titleList.value.length > 1;
    titleVisible.value = shouldShowDrawer.value;
  } catch (error) {
    console.error('获取平台分类失败:', error);
  }
}

async function updateMenu(item: any) {
  menuId.value = String(item?.id ?? '');
  onCloseDrawer();
  requestParams.pageNo = 1;
  pagination.current = 1;
  await getResources();
}

function onCloseDrawer() {
  resetDrawerStyle();
  titleVisible.value = false;
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
    addOrUpdateModel.value?.noticeInfoAddOrUpdate(record, menuId.value);
  } else {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(undefined, menuId.value);
    });
  }
}
function handleFinish() {
  getResources();
}
function handleReset() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.productTemp-index');
}

function openWbsStructure(record: any) {
  router.push({
    path: '/internal/product-temp-wbs',
    query: {
      id: String(record.id ?? ''),
      tempName: String(record.tempName ?? ''),
      tempNum: String(record.tempNum ?? ''),
    },
  });
}
</script>

<template>
  <div class="drawerContent h-full">
    <div class="product-temp-calc-pane">
      <a-card class="calc-toolbar-card">
        <a-form layout="inline" class="calc-toolbar-form" :label-col="{ style: { width: '70px' } }" :model="requestParams">
          <a-form-item name="tempNum">
            <a-input v-model:value="requestParams.tempNum" style="width: 220px" allow-clear :placeholder="$t('请输入模板编号')" />
          </a-form-item>
          <a-form-item name="tempName">
            <a-input v-model:value="requestParams.tempName" style="width: 220px" allow-clear :placeholder="$t('请输入模板名称')" />
          </a-form-item>
          <a-form-item class="product-temp-toolbar-btns">
            <a-button type="primary" @click="handleFinish"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }} </a-button>
            <a-button type="primary" @click="noticeAdd(undefined)">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card class="calc-table-card product-temp-table-card">
        <a-table
          class="exe-config-table"
          :scroll="{ x: productTempTableScrollX, y: 'calc(100vh - 300px)' }"
          :row-key="record => record.id"
          :columns="columns"
          :locale="locale"
          :data-source="productTempTableDisplayList"
          :pagination="pagination"
          bordered
          table-layout="fixed"
          @resize-column="handleResizeColumn"
          :loading="loading"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #headerCell="{ column }">
            <template v-if="isSortableProductTempColumn(column) || isFilterableProductTempColumn(column)">
              <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isFilterableProductTempColumn(column) }">
                <span class="header-title-sort" :class="{ 'header-title-sort--disabled': !isSortableProductTempColumn(column) }" @click.stop="toggleProductTempColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isSortableProductTempColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getProductTempSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getProductTempSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span v-if="isFilterableProductTempColumn(column)" class="header-filter-anchor" @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getProductTempFilterOpen(String(column.dataIndex))"
                    @openChange="handleProductTempFilterOpenChange(String(column.dataIndex), $event)">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="filterValueMap[String(column.dataIndex)]"
                          :placeholder="`${$t('请输入')}${column.title}`"
                          allow-clear
                          @pressEnter="applyProductTempColumnFilter(String(column.dataIndex))" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyProductTempColumnFilter(String(column.dataIndex))">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetProductTempColumnFilter(String(column.dataIndex))">{{ $t('重置') }}</a-button>
                        </div>
                      </div>
                    </template>
                    <span :title="`${$t('搜索')}${column.title}`" class="header-search-trigger" @click.stop>
                      <FilterOutlined class="header-query-icon" />
                    </span>
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
            <template v-if="column.dataIndex === 'versionNum'">
              <span style="display: inline-flex; align-items: center; gap: 6px">
                <span>{{ 'V' + (record.versionNum ?? '-') + '.0' }}</span>
                <a href="#" style="cursor: pointer" title="查看历史版本" @click.stop.prevent="showVersionHistory(record)">
                  <EpcIcon type="icon-banbenlishi" style="font-size: 14px; color: #1890ff" />
                </a>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <span>
                <a-tag v-if="record.status == '0'" :class="['exe-status-tag', 'exe-status-tag--off']">{{ $t('未发布') }}</a-tag>
                <a-tag v-else-if="record.status == '1'" :class="['exe-status-tag', 'exe-status-tag--on']">{{ $t('已发布') }}</a-tag>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <div class="calc-operation-links" @click.stop>
                <a href="#" :class="{ 'calc-operation-links__disabled': record.status == '1' }" @click.prevent="record.status != '1' && noticeAdd(record)">
                  {{ $t('编辑') }}
                </a>
                <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="record.status == '1'" @confirm.stop.prevent="handleDelete(record.id)">
                  <a href="#" :class="{ 'calc-operation-links__disabled': record.status == '1' }" style="color: #ff4d4f" @click.prevent>{{ $t('删除') }}</a>
                </a-popconfirm>
                <a-popconfirm v-if="record.status == '0'" :title="`${$t('确定要发布吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="pushFun(record.id)">
                  <a href="#" @click.prevent>{{ $t('发布') }}</a>
                </a-popconfirm>
                <a-popconfirm v-else :title="`${$t('确定要撤销发布吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="goBackPushFun(record.id)">
                  <a href="#" @click.prevent>{{ $t('撤销') }}</a>
                </a-popconfirm>
                <a href="#" class="calc-operation-links__wbs-link" @click.prevent.stop="openWbsStructure(record)">{{ $t('浏览WBS结构') }}</a>
              </div>
            </template>
          </template>
        </a-table>
        <ProductTempAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
      </a-card>
    </div>
    <div class="productTemp-index" v-dragModal>
      <a-modal
        v-model:visible="visibleHistoryModal"
        :getContainer="customGetContainer"
        :title="$t('历史版本')"
        :width="760"
        :body-style="{ padding: '0' }"
        :mask-closable="false"
        :footer="null"
        @cancel="closeHistoryModal">
        <div class="history-modal-wrap">
          <div class="history-modal-content" v-if="!historyLoading">
            <div v-if="historyList.length" class="history-timeline">
              <div v-for="item in historyList" :key="item.id || item.versionNum" class="history-item">
                <div class="history-dot"></div>
                <div class="history-main">
                  <div class="history-version">{{ getVersionText(item.versionNum) }}</div>
                  <div class="history-card">
                    <div class="history-title">{{ item.tempName }} {{ item.tempNum }}</div>
                    <div class="history-meta">({{ item.creatorName || '-' }}) {{ item.createTime || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
            <a-empty v-else />
          </div>
          <div v-else class="history-loading-wrap">
            <a-spin />
          </div>
          <div class="history-footer">
            <a-button type="primary" @click="closeHistoryModal">{{ $t('关闭') }}</a-button>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
  <a-drawer
    v-if="shouldShowDrawer"
    :title="`产品平台选择`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :mask="true"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onCloseDrawer"
    @close="onCloseDrawer">
    <div v-for="(item, index) in titleList" :key="index">
      <div style="display: flex; background-color: #ecf5ff; margin: 15px 10px 0 10px; border-radius: 10px; height: 60px; cursor: pointer" @click="updateMenu(item)">
        <img src="@/assets/images/jc.png" v-if="index == 0" alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <img src="@/assets/images/ct.png" v-else-if="index == 1" alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <img src="@/assets/images/hj.png" v-else alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <a-badge>
          <div class="menuLi">{{ item.categoryName }}</div>
        </a-badge>
      </div>
    </div>
  </a-drawer>
</template>

<style lang="less" scoped>
.drawerContent {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 84px);
  background-color: #ffffff !important;
}

:deep(.ant-drawer-content-wrapper) {
  width: 480px !important;
}

:deep(.b-body) {
  height: calc(100vh - 125px);
  overflow: auto;
}

:deep(.ant-drawer-body) {
  padding: 2px;
}

.menuLi {
  display: inline-block;
  margin: 20px 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
}

.menuLi:hover {
  transform: translateY(-2px);
  color: #165dff;
}

/* 与 parameter/index.vue 右侧 calc-config-pane 一致：左右留白、工具条与表格无分割线 */
.product-temp-calc-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 12px;
}

.calc-toolbar-card {
  border: none !important;
  box-shadow: none !important;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.calc-toolbar-form {
  gap: 4px;
}

.product-temp-toolbar-btns :deep(.ant-form-item-control-input-content) {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.product-temp-table-card {
  margin-top: 0 !important;
  border-top: none !important;
  box-shadow: none !important;
}

/* 表头：标题 + 排序 + 筛选（与 parameter/index.vue 一致） */
.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-search-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: pointer;
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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

/* 与 parameter/index.vue 列表表格一致 */
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

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
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

.calc-operation-links__disabled {
  pointer-events: none;
  color: rgba(0, 0, 0, 0.25) !important;
}

.calc-operation-links__static {
  cursor: default;
  color: rgba(0, 0, 0, 0.65);
}

/* 「浏览WBS结构」与「发布」链接同色：主题主色 */
.calc-operation-links__wbs-link {
  color: var(--ant-primary-color, #1890ff) !important;
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

.history-modal-wrap {
  height: 620px;
  display: flex;
  flex-direction: column;
}

.history-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 0;
}

.history-timeline {
  padding-left: 16px;
  border-left: 2px solid #e8e8e8;
}

.history-item {
  position: relative;
  margin-bottom: 28px;
}

.history-dot {
  position: absolute;
  left: -23px;
  top: 42px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #20c997;
}

.history-version {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.history-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 18px 20px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.history-meta {
  margin-top: 10px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.85);
}

.history-loading-wrap {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.history-footer {
  border-top: 1px solid #f0f0f0;
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
