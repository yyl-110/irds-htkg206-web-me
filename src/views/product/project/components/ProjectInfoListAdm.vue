<script lang="ts" setup>
import { computed, h, onActivated, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useRender } from '@/components/escape';
import { ProjectPageRequestDTOModel } from '@/api/models/project/ProjectPageRequestDTOModel';
import { AdminApiProjectTemp } from '@/api/tags/project/项目信息后台';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
const addOrUpdateModel = ref<any>(null);
const PROJECT_EDITOR_DRAFT_KEY = 'project-info-editor-draft';
const PROJECT_LIST_REFRESH_FLAG = 'project-info-list-refresh';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const loading = ref<boolean>(false);
const categoryid = ref<string>('');
const categoryName = ref<string>('');

type ProjectListRow = Record<string, any> & { id: string };
type ProjectSortOrder = 'ascend' | 'descend' | '';

/** 列表请求参数（须在表头筛选用到 requestParams 之前声明） */
const requestParams = reactive(new ProjectPageRequestDTOModel());
requestParams.userid = userStore.getUser.id;
requestParams.productPlatformId = categoryid.value;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 列表数据 */
const resources = ref<ProjectListRow[]>([]);

const projectTableSortState = ref<{ key: string; order: ProjectSortOrder }>({ key: '', order: '' });
const projectTableFilterValueMap = ref<Record<string, string>>({ projectNum: '', projectName: '' });
const projectTableFilterOpenMap = ref<Record<string, boolean>>({});

function isProjectTableSortableColumn(column: { dataIndex?: unknown }) {
  const k = column?.dataIndex;
  return Boolean(k && k !== 'operation');
}

function isProjectTableFilterableColumn(column: { dataIndex?: unknown }) {
  return column?.dataIndex === 'projectNum' || column?.dataIndex === 'projectName';
}

function setProjectTableFilterOpen(key: string, open: boolean) {
  projectTableFilterOpenMap.value = { ...projectTableFilterOpenMap.value, [key]: open };
}

function getProjectTableFilterOpen(key: string) {
  return Boolean(projectTableFilterOpenMap.value[key]);
}

function handleProjectTableFilterOpenChange(key: 'projectNum' | 'projectName', open: boolean) {
  if (open) {
    if (key === 'projectNum') {
      projectTableFilterValueMap.value = { ...projectTableFilterValueMap.value, projectNum: String(requestParams.projectNum ?? '') };
    } else if (key === 'projectName') {
      projectTableFilterValueMap.value = { ...projectTableFilterValueMap.value, projectName: String(requestParams.projectName ?? '') };
    }
  }
  setProjectTableFilterOpen(key, open);
}

function onProjectNumFilterOpenChange(vis: boolean) {
  handleProjectTableFilterOpenChange('projectNum', vis);
}

function onProjectNameFilterOpenChange(vis: boolean) {
  handleProjectTableFilterOpenChange('projectName', vis);
}

function getProjectTableSortOrder(dataIndex: string): ProjectSortOrder {
  return projectTableSortState.value.key === dataIndex ? projectTableSortState.value.order : '';
}

function toggleProjectTableColumnSort(column: { dataIndex?: unknown }) {
  if (!isProjectTableSortableColumn(column)) return;
  const key = String(column.dataIndex);
  if (projectTableSortState.value.key !== key) {
    projectTableSortState.value = { key, order: 'ascend' };
    return;
  }
  if (projectTableSortState.value.order === 'ascend') {
    projectTableSortState.value = { key, order: 'descend' };
    return;
  }
  if (projectTableSortState.value.order === 'descend') {
    projectTableSortState.value = { key: '', order: '' };
    return;
  }
  projectTableSortState.value = { key, order: 'ascend' };
}

const projectTableDisplayList = computed(() => {
  const list = [...resources.value];
  if (!projectTableSortState.value.key || !projectTableSortState.value.order) return list;
  const k = projectTableSortState.value.key;
  if (k === 'planStartTime' || k === 'planEndTime') {
    const sorted = [...list].sort((a: ProjectListRow, b: ProjectListRow) => sortermethod(String(a[k] ?? ''), String(b[k] ?? '')));
    return projectTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
  }
  const sorted = [...list].sort((a: ProjectListRow, b: ProjectListRow) =>
    sortermethod(a[k] as any, b[k] as any),
  );
  return projectTableSortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

const columns = ref<TableColumnType<ProjectListRow>[]>([
  {
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'projectNum',
    key: 'projectNum',
    align: 'left',
    resizable: true,
    fixed: 'left',
    width: 200,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'projectName',
    key: 'projectName',
    align: 'left',
    resizable: true,
    width: 200,
    ellipsis: { showTitle: true },
  },
  {
    title: WeiI18n.$t('平台'),
    dataIndex: 'productPlatform',
    key: 'productPlatform',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('密级'),
    dataIndex: 'confidentialLevel',
    key: 'confidentialLevel',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('项目状态'),
    dataIndex: 'projectStatus',
    key: 'projectStatus',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('关联模板'),
    dataIndex: 'productTempName',
    key: 'productTempName',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'creatorName',
    key: 'creatorName',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('计划开始时间'),
    key: 'planStartTime',
    dataIndex: 'planStartTime',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('计划完成时间'),
    key: 'planEndTime',
    dataIndex: 'planEndTime',
    align: 'center',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 160,
    fixed: 'right',
    resizable: false,
  },
]);

const PROJECT_TABLE_SCROLL_BUFFER = 24;
const projectTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = col.width;
    sum += typeof w === 'number' ? w : Number(w) || 0;
  }
  return sum + PROJECT_TABLE_SCROLL_BUFFER;
});

function applyProjectTableColumnFilter(key: 'projectNum' | 'projectName') {
  if (key === 'projectNum') {
    requestParams.projectNum = String(projectTableFilterValueMap.value.projectNum ?? '').trim();
  } else {
    requestParams.projectName = String(projectTableFilterValueMap.value.projectName ?? '').trim();
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setProjectTableFilterOpen(key, false);
  void getResources();
}

function resetProjectTableColumnFilter(key: 'projectNum' | 'projectName') {
  if (key === 'projectNum') {
    projectTableFilterValueMap.value = { ...projectTableFilterValueMap.value, projectNum: '' };
    requestParams.projectNum = '';
  } else {
    projectTableFilterValueMap.value = { ...projectTableFilterValueMap.value, projectName: '' };
    requestParams.projectName = '';
  }
  pagination.current = 1;
  requestParams.pageNo = 1;
  setProjectTableFilterOpen(key, false);
  void getResources();
}

function handleResizeColumn(w: number, col: TableColumnType<ProjectListRow>) {
  col.width = w;
}

function projectTableRowClassName(_record: ProjectListRow, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

function projectRowKey(record: ProjectListRow) {
  return record.id;
}

function formatProjectPlanDate(val: unknown) {
  return useRender.renderDateNoTime(val);
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await AdminApiProjectTemp.getProjectPageList({
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
 * 删除公告
 * @param id id
 */
async function handleDelete(id: string) {
  const data: any = {};
  data.id = id;
  await AdminApiProjectTemp.deleteProject(data);
  message.success(WeiI18n.$t('删除成功'));
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
 * 跳转项目信息创建/编辑页（返回时回到当前列表）
 */
function noticeAdd(record?: any) {
  const query: Record<string, string> = {
    from: encodeURIComponent(route.fullPath),
    /** 供侧栏保持「协同设计」等上级菜单选中 */
    activeMenu: encodeURIComponent(route.path),
  };
  if (record?.id != null && record.id !== '') {
    sessionStorage.setItem(PROJECT_EDITOR_DRAFT_KEY, JSON.stringify(record));
    query.id = String(record.id);
  } else {
    sessionStorage.removeItem(PROJECT_EDITOR_DRAFT_KEY);
    query.categoryName = categoryName.value;
    query.categoryId = categoryid.value;
  }
  router.push({ name: 'ProductProjectEditor', query });
}
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}

function getResourcesByParent(categoryids: any, categoryNames: any) {
  categoryid.value = categoryids;
  categoryName.value = categoryNames;
  // categoryid 是后续由父组件传入更新的，这里需要同步刷新分页请求参数
  requestParams.productPlatformId = String(categoryid.value ?? '');
  getResources();
}

/** 从项目编辑页返回或保存后回到本页时刷新列表 */
function refreshListIfReturnedFromEditor() {
  if (sessionStorage.getItem(PROJECT_LIST_REFRESH_FLAG) === '1') {
    sessionStorage.removeItem(PROJECT_LIST_REFRESH_FLAG);
    getResources();
  }
}

onMounted(refreshListIfReturnedFromEditor);
onActivated(refreshListIfReturnedFromEditor);

defineExpose({ getResourcesByParent });
</script>

<template>
  <div class="drawerContent project-list-adm-root">
    <a-card class="project-list-adm-card">
      <div class="project-list-adm-body-scroll">
        <a-form
          layout="inline"
          class="calc-toolbar-form project-list-adm-toolbar-form"
          :label-col="{ style: { width: '70px' } }"
          :model="requestParams"
          @finish="handleFinish">
          <a-form-item name="projectNum">
            <a-input v-model:value="requestParams.projectNum" style="width: 220px" allow-clear :placeholder="$t('请输入项目编号')" />
          </a-form-item>
          <a-form-item name="projectName">
            <a-input v-model:value="requestParams.projectName" style="width: 220px" allow-clear :placeholder="$t('请输入项目名称')" />
          </a-form-item>
          <a-form-item name="projectStatus">
            <a-select v-model:value="requestParams.projectStatus" allow-clear style="width: 220px" :placeholder="$t('请选择项目类型')">
              <a-select-option value="">{{ $t('全部') }}</a-select-option>
              <a-select-option value="1">{{ $t('待启动') }}</a-select-option>
              <a-select-option value="2">{{ $t('工作中') }}</a-select-option>
              <a-select-option value="3">{{ $t('已完成') }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="project-list-adm-toolbar-form__actions">
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
          class="project-list-adm-table exe-config-table parameter-table-spaced"
          bordered
          table-layout="fixed"
          :scroll="{ x: projectTableScrollX, y: 500 }"
          :row-key="projectRowKey"
          :columns="columns"
          :locale="locale"
          :data-source="projectTableDisplayList"
          :pagination="false"
          @resize-column="handleResizeColumn"
          :loading="loading"
          :row-class-name="projectTableRowClassName">
          <template #headerCell="{ column }">
            <template v-if="isProjectTableSortableColumn(column) || isProjectTableFilterableColumn(column)">
              <div
                class="header-cell-main"
                :class="{
                  'header-cell-main--has-filter': isProjectTableFilterableColumn(column),
                }">
                <span
                  class="header-title-sort"
                  :class="{ 'header-title-sort--disabled': !isProjectTableSortableColumn(column) }"
                  @click.stop="toggleProjectTableColumnSort(column)">
                  <span>{{ column.title }}</span>
                  <span v-if="isProjectTableSortableColumn(column)" class="header-sort-icon">
                    <CaretUpOutlined v-if="getProjectTableSortOrder(String(column.dataIndex)) === 'ascend'" />
                    <CaretDownOutlined v-else-if="getProjectTableSortOrder(String(column.dataIndex)) === 'descend'" />
                    <CaretUpOutlined v-else class="header-sort-icon--muted" />
                  </span>
                </span>
                <span
                  v-if="column.dataIndex === 'projectNum'"
                  class="header-filter-anchor"
                  @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getProjectTableFilterOpen('projectNum')"
                    @openChange="onProjectNumFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="projectTableFilterValueMap.projectNum"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyProjectTableColumnFilter('projectNum')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyProjectTableColumnFilter('projectNum')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetProjectTableColumnFilter('projectNum')">{{ $t('重置') }}</a-button>
                        </div>
                      </div>
                    </template>
                    <FilterOutlined class="header-query-icon" @mousedown.stop />
                  </a-popover>
                </span>
                <span
                  v-else-if="column.dataIndex === 'projectName'"
                  class="header-filter-anchor"
                  @mousedown.stop>
                  <a-popover
                    trigger="click"
                    placement="bottomRight"
                    :open="getProjectTableFilterOpen('projectName')"
                    @openChange="onProjectNameFilterOpenChange">
                    <template #content>
                      <div class="header-filter-pop">
                        <a-input
                          v-model:value="projectTableFilterValueMap.projectName"
                          :placeholder="`${$t('搜索')} ${column.title}`"
                          allow-clear
                          @pressEnter="applyProjectTableColumnFilter('projectName')" />
                        <div class="header-filter-actions">
                          <a-button type="primary" size="small" @click="applyProjectTableColumnFilter('projectName')">
                            <SearchOutlined />
                            {{ $t('确定') }}
                          </a-button>
                          <a-button size="small" @click="resetProjectTableColumnFilter('projectName')">{{ $t('重置') }}</a-button>
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
            <template v-if="column.dataIndex === 'projectStatus'">
              <span>
                <a-tag v-if="record.projectStatus == '1'">{{ $t('未开始') }}</a-tag>
                <a-tag v-else-if="record.projectStatus == '2'" color="gold">{{ $t('进行中') }}</a-tag>
                <a-tag v-else-if="record.projectStatus == '3'" color="blue">{{ $t('已完成') }}</a-tag>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'confidentialLevel'">
              <span v-if="record.confidentialLevel == '1'">{{ $t('公开') }} </span>
              <span v-else-if="record.confidentialLevel == '2'">{{ $t('内部') }} </span>
              <span v-else-if="record.confidentialLevel == '3'">{{ $t('秘密') }} </span>
              <span v-else-if="record.confidentialLevel == '4'">{{ $t('机密') }} </span>
            </template>
            <template v-else-if="column.dataIndex === 'planStartTime' || column.dataIndex === 'planEndTime'">
              <span>{{ formatProjectPlanDate(record[String(column.dataIndex || '')]) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <template v-if="record.projectStatus == '1'">
                <a @click="noticeAdd(record)">{{ $t('编辑') }}</a>
                <a-divider type="vertical" />
                <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
                  <a-button type="link" danger class="p-0">
                    {{ $t('删除') }}
                  </a-button>
                </a-popconfirm>
              </template>
              <template v-else>
                <span class="operation-disabled">{{ $t('编辑') }}</span>
                <a-divider type="vertical" />
                <span class="operation-disabled">{{ $t('删除') }}</span>
              </template>
            </template>
            <template v-else>
              <span>{{ record[String(column.dataIndex || '')] }}</span>
            </template>
          </template>
        </a-table>
        <div class="project-list-adm-pagination">
          <a-pagination v-bind="pagination" class="ant-table-pagination" />
        </div>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.drawerContent.project-list-adm-root {
  height: 100%;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  position: static;
  width: 100%;
  background-color: #ffffff;
}

.calc-toolbar-form {
  gap: 4px;
}

.project-list-adm-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.project-list-adm-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.project-list-adm-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.project-list-adm-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.project-list-adm-card {
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

.project-list-adm-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.project-list-adm-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-bottom: 16px;
}

.project-list-adm-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.project-list-adm-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.project-list-adm-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.project-list-adm-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.project-list-adm-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.project-list-adm-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.project-list-adm-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
  padding: 5px;
}

.project-list-adm-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.project-list-adm-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.project-list-adm-table.exe-config-table.parameter-table-spaced {
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

.operation-disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
</style>
