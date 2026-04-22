<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { set } from 'lodash-es';
import DeptUpdateOrAdd from './deptUpdateOrAdd.vue';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import type { DeptListRequestDTO, DeptResponseDTO } from '@/api/tags/data-contracts';
import { DeptListRequestDTOModel } from '@/api/models/DeptListRequestDTOModel';
import type { DeptCreateRequestDTOModel } from '@/api/models/DeptCreateRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { TableColumnsType } from 'ant-design-vue';
import { getAllTimes } from '@/utils/dateUtils';
import { sortermethod } from '@/utils/tools';
/** 懒加载部门树数据类型 */
type DeptLazyData = DeptResponseDTO & {
  children: DeptLazyData[];
  /** 所有上级部门的名称, 在数据初始化时填充 */
  $parentsNameList: Array<string>;
};

const treeDataTranslate: any = inject('treeDataTranslate');
const loading = ref(false);

/** 当前查询条件中的 name */
const currentQueryName = ref('');
/** 列表请求参数 */
const requestParams = reactive(new DeptListRequestDTOModel());
requestParams.parentId = undefined;
requestParams.status = undefined;
/** 列表数据 */
const resources = ref<Array<DeptResponseDTO>>([]);

/** 所有部门数据(`Map` 结构) */
const tableDataMap = ref<Record<DeptLazyData['id'], DeptLazyData>>({});



/** 获取部门数据 */
async function getResources() {
  currentQueryName.value = requestParams.name || '';
  loading.value = true;
  try {
    const res = await AdminApiSystemDept.listDepts(requestParams);
    loading.value = false;
    // let count = 1000
    // const firstRecord = (res.data.data || [])[0]
    // while (count--) {
    //   res.data.data?.push({ ...firstRecord, name: `dept-${count}`, id: count + 39082, parentId: Math.random() > 0.2 ? 0 : firstRecord.id })
    // }
    for (const item of res.data.data || []) {
      set(item, '$parentsNameList', []);
      tableDataMap.value[item.id] = item as DeptLazyData;
    }
    // resources.value = res.data.data as Array<DeptLazyData>;
    resources.value = treeDataTranslate(res.data.data, 'id');
    _fillParentsNameList(res.data.data as Array<DeptLazyData>);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getResources();
});

const formRef = ref();

/** 是否显示 新增 / 编辑 弹窗 */
const visibleModal = ref<boolean>(false);

const rowClassName = (_record: any, index: number) => (index % 2 === 0 ? 'odd' : 'even');

const columns = computed<TableColumnsType>(() => [
  {
    title: WeiI18n.t('部门编码').value,
    dataIndex: 'code',
    key: 'code',
    width: 140,
    fixed: 'left',
    align: 'center',
    ellipsis: true,
    sorter: (a: any, b: any) => sortermethod(a?.code, b?.code),
  },
  {
    title: WeiI18n.t('部门名称').value,
    dataIndex: 'name',
    key: 'name',
    width: 200,
    align: 'left',
    ellipsis: true,
    sorter: (a: any, b: any) => sortermethod(a?.name, b?.name),
  },
  {
    title: WeiI18n.t('排序').value,
    dataIndex: 'sort',
    key: 'sort',
    width: 90,
    align: 'center',
    sorter: (a: any, b: any) => (Number(a?.sort) || 0) - (Number(b?.sort) || 0),
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    sorter: (a: any, b: any) => (Number(a?.status) || 0) - (Number(b?.status) || 0),
  },
  {
    title: WeiI18n.t('创建时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a?.createTime, b?.createTime),
  },
  {
    title: WeiI18n.t('操作').value,
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
    width: 160,
    fixed: 'right',
  },
]);

const DEPT_TABLE_SCROLL_BUFFER = 24;
const deptTableScrollX = computed(() => {
  let sum = 0;
  for (const col of columns.value) {
    const w = (col as { width?: number }).width;
    if (typeof w === 'number') sum += w;
  }
  return sum + DEPT_TABLE_SCROLL_BUFFER;
});

function deptRowKey(record: DeptResponseDTO) {
  return record.id;
}
/**
 * 获取部门的所有上级部门
 * @param dept 部门数据
 */
function _getAllDeptParents(dept: DeptLazyData) {
  const result: Array<DeptLazyData> = [];
  let parent: DeptLazyData | undefined = dept;
  while (parent) {
    parent = Number.isInteger(parent.parentId) ? tableDataMap.value[parent.parentId as number] : undefined;
    if (parent) result.unshift(parent);
    else break;
  }
  return result;
}
/**
 * 填充部门数据的 `$parentsNameList` 字段
 * @param deptResList 部门数据 list
 */
function _fillParentsNameList(deptResList: Array<DeptLazyData>) {
  const parentMap: Record<DeptResponseDTO['id'], DeptLazyData['$parentsNameList']> = {};
  for (const dept of deptResList) {
    // if (dept.$parentsNameList) continue
    dept.$parentsNameList = parentMap[dept.id] || (parentMap[dept.id] = _getAllDeptParents(dept).map(d => d.name));
  }
}
/** 懒加载部门数据请求参数 */
const lazyRequestParams = computed<DeptListRequestDTO>(() => {
  return {
    name: requestParams.name,
    parentId: 0,
    status: requestParams.status as number,
  };
});
/**
 * 懒加载部门数据
 * @param parentId 上级 ID
 */
async function getTableDataLazy(parentId: number = 0) {
  loading.value = true;
  try {
    const res = await AdminApiSystemDept.listDeptsLazy({ ...lazyRequestParams.value, parentId });
    const data: Array<DeptLazyData> =
      res.data.data?.map(item => {
        const dept: DeptLazyData = { ...item, children: [], $parentsNameList: [] };
        if (!tableDataMap.value[item.id]) {
          resources.value.push(item);
        }
        tableDataMap.value[item.id] = dept;
        return dept;
      }) || [];
    if (parentId === 0) resources.value = data;

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    loading.value = false;
  }
}
/** 查询表格数据 */
function handleFinish() {
  getResources();
  // getTableDataLazy()
}

/**
 * 删除
 * @param record record
 */
function handleDelete(record: DeptLazyData) {
  const delTable = AdminApiSystemDept.deleteDept1({ id: record.id });
  delTable.then(() => {
    message.success(WeiI18n.t('删除成功').value);
    const index = resources.value.findIndex(item => item.id === record.id);
    if (index !== -1) resources.value.splice(index, 1);
  });
}
/** reset */
function handleReset() {
  formRef.value.resetFields();
  getResources();
}

/** 当前操作的数据 */
const editableData = ref<DeptLazyData>();

/**
 * 显示 新增 / 编辑 弹窗
 * @param record record
 */
function handleAddOrUpdate(record?: DeptLazyData) {
  editableData.value = record;
  visibleModal.value = true;
}
/**
 * refresh table event function
 * @param record record
 */
async function onRefreshTableData(record: DeptCreateRequestDTOModel) {
  if (editableData.value) {
    // 编辑, 获取当前数据详情并更新
    const res = await AdminApiSystemDept.getDept1({ id: editableData.value.id });
    const data = res.data.data;
    if (data) {
      const index = resources.value.findIndex(item => item.id === data.id);
      if (index !== -1) resources.value.splice(index, 1);
      nextTick(() => resources.value.push(data));
    }
  } else {
    // 新增, 若加载上级部门数据, 则重新加载上级部门的 children, 否则不做处理
    const parent = tableDataMap.value[record.parentId as number];
    if (!parent) {
      await getResources();
    } else {
      await getTableDataLazy(parent.id);
    }
  }
}
</script>

<template>
  <div class="drawerContent dept-page-root">
    <a-card class="dept-list-card">
      <div class="dept-list-body-scroll">
        <a-form
          ref="formRef"
          class="form_main calc-toolbar-form dept-toolbar-form"
          layout="inline"
          :label-col="{ style: { width: '100px' } }"
          :wrapper-col="{ span: 14 }"
          :model="requestParams"
          @finish="handleFinish">
          <a-form-item name="name">
            <a-input v-model:value="requestParams.name" style="width: 240px" :placeholder="$t('请输入部门名称')" allow-clear />
          </a-form-item>
          <a-form-item name="status">
            <a-select v-model:value="requestParams.status" style="width: 240px; text-align: left" :placeholder="$t('请选择部门状态')" allow-clear>
              <a-select-option value="0">
                {{ $t('开启') }}
              </a-select-option>
              <a-select-option value="1">
                {{ $t('关闭') }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- v-hasPermi="['system:dept:query']" -->
          <a-form-item class="dept-toolbar-form__actions">
            <a-button type="primary" html-type="submit">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
            <!-- v-hasPermi="['system:dept:create']" -->
            <a-button type="primary" style="margin-left: 15px" @click="handleAddOrUpdate(undefined)">
              <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
              {{ $t('添加') }}
            </a-button>
          </a-form-item>
        </a-form>

        <a-table
          class="dept-list-table exe-config-table parameter-table-spaced"
          table-layout="fixed"
          :columns="columns"
          :data-source="resources"
          :scroll="{ x: deptTableScrollX, y: 'calc(100vh - 380px)' }"
          :row-key="deptRowKey"
          :loading="loading"
          bordered
          :row-class-name="rowClassName"
          :pagination="false"
          defaultExpandAllRows>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="blue">{{ $t('开启') }}</a-tag>
              <a-tag v-else-if="record.status === 1">{{ $t('关闭') }}</a-tag>
            </template>
            <template v-else-if="column.key === 'createTime'">
              <span>{{ getAllTimes(Date.parse(record.createTime)) }}</span>
            </template>
            <template v-else-if="column.key === 'operation'">
              <span class="handle_btn text-primary cursor-pointer" @click="handleAddOrUpdate(record)">编辑</span>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="$t('确定要删除吗？')"
                :ok-text="$t('确定')"
                :cancel-text="$t('取消')"
                :disabled="$isPending('delete', record.id)"
                @confirm="handleDelete(record)">
                <span class="handle_btn text-[red] cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': $isPending('delete', record.id) }">删除</span>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
      <DeptUpdateOrAdd v-model:visible="visibleModal" :resource="editableData" @success="onRefreshTableData" />
    </a-card>
  </div>
</template>

<style scoped lang="less">
/* 填满主内容区，避免整页被顶出主布局 */
.drawerContent.dept-page-root {
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

.dept-toolbar-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 12px;
  column-gap: 0;
}

.dept-toolbar-form :deep(.ant-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.dept-toolbar-form :deep(.ant-form-item:not(:last-child)) {
  margin-right: 16px;
}

.dept-toolbar-form__actions :deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.dept-list-card {
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
    padding: 12px 20px 16px;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.dept-list-body-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.dept-list-card :deep(.parameter-table-spaced) {
  margin-top: 16px;
}

.dept-list-card :deep(.ant-table-thead > tr > th) {
  border-right: 1px solid #e8e8e8;
  text-align: center !important;
  vertical-align: middle;
  background: #fafafa !important;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
}

.dept-list-card :deep(.ant-table-thead .ant-table-column-sorters) {
  justify-content: center !important;
}

.dept-list-card :deep(.ant-table-thead .ant-table-column-title) {
  flex: none;
}

.dept-list-card :deep(.ant-table-tbody > tr.odd > td) {
  background: #ffffff;
}

.dept-list-card :deep(.ant-table-tbody > tr.even > td) {
  background: #f7f9fc;
}

.dept-list-card :deep(.ant-table-tbody > tr > td) {
  border-right: none !important;
}

.dept-list-card :deep(.ant-table-tbody > tr > td:last-child) {
  border-right: 1px solid #e8e8e8 !important;
}

.dept-list-card :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: 1px solid #e8e8e8 !important;
}

.dept-list-table.exe-config-table.parameter-table-spaced {
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
</style>
