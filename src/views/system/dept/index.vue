<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { set } from 'lodash-es';
import type { VxeGridEventProps, VxeGridProps } from 'vxe-table';
import { useWindowSize } from '@vueuse/core';
import DeptUpdateOrAdd from './deptUpdateOrAdd.vue';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import type { DeptListRequestDTO, DeptResponseDTO } from '@/api/tags/data-contracts';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { DeptListRequestDTOModel } from '@/api/models/DeptListRequestDTOModel';
import type { DeptCreateRequestDTOModel } from '@/api/models/DeptCreateRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon.js';

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

const gridOptions = ref<VxeGridProps<DeptLazyData> & VxeGridEventProps<DeptLazyData>>({
  columns: [],
  treeConfig: {
    rowField: 'id',
    childrenField: 'children',
    transform: true,
  },
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
});

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
    resources.value = res.data.data as Array<DeptLazyData>;
    // resources.value = treeDataTranslate(res.data.data, 'id')
    _fillParentsNameList(res.data.data as Array<DeptLazyData>);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getResources();
});

const userNickNameMap = reactive<{ [id: string]: string }>({});

const formRef = ref();

const { height } = useWindowSize();
const gridHeight = computed(() => height.value - 285);

/** 是否显示 新增 / 编辑 弹窗 */
const visibleModal = ref<boolean>(false);
const columns = computed<VxeGridProps<DeptLazyData>['columns']>(() => {
  const _columns: VxeGridProps<DeptLazyData>['columns'] = [
    {
      title: WeiI18n.t('部门编码').value,
      field: 'code',
      width: 90,
    },
    {
      title: WeiI18n.t('部门名称').value,
      field: 'name',
      treeNode: true,
      minWidth: 170,
      align: 'left',
    },
    // {
    //   title: WeiI18n.t('负责人').value,
    //   field: 'leaderUserId',
    //   minWidth: 170,
    //   slots: {
    //     default({ row }) {
    //       const content =
    //         row.leaderUserId &&
    //         row.leaderUserId
    //           .map((id: number) => userNickNameMap[id])
    //           .filter((item: any) => item)
    //           .join(', ');
    //       return content || '';
    //     },
    //   },
    // },
    {
      title: WeiI18n.t('排序').value,
      field: 'sort',
      width: 90,
    },
    {
      title: WeiI18n.t('状态').value,
      field: 'status',
      width: 90,
      slots: {
        default: 'status_default',
      },
    },
    {
      title: WeiI18n.t('创建时间').value,
      field: 'createTime',
      align: 'center',
      width: 200,
      formatter: 'dateTime',
    },
    {
      title: WeiI18n.t('操作').value,
      field: 'operation',
      align: 'center',
      width: 160,
      fixed: 'right',
      slots: {
        default: 'operation_default',
      },
    },
  ];
  // if (!currentQueryName.value) _columns.splice(1, 1);

  return _columns;
});
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
  <div class="drawerContent">
    <a-card>
      <a-form ref="formRef" class="form_main" layout="inline" :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 14 }" :model="requestParams" @finish="handleFinish">
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
        <a-form-item>
          <a-button type="primary" html-type="submit">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
        </a-form-item>
        <!-- v-hasPermi="['system:dept:create']" -->
        <a-form-item>
          <a-button type="primary" @click="handleAddOrUpdate(undefined)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card style="margin-top: 10px" class="b-body">
      <VxeGrid v-bind="gridOptions" :loading="loading" :columns="columns" :data="resources" :cell-config="{ height: 45 }" :header-cell-config="{ height: 45 }">
        <template #status_default="{ row }">
          <span>
            <a-tag v-if="row.status === 0" color="blue">{{ $t('开启') }}</a-tag>
            <a-tag v-else-if="row.status === 1">{{ $t('关闭') }}</a-tag>
          </span>
        </template>
        <template #operation_default="{ row }">
          <section @click.stop="() => {}">
            <!-- v-hasPermi="['system:dept:update']" -->
            <a @click.prevent="handleAddOrUpdate(row)">{{ $t('编辑') }}</a>
            <!-- v-hasPermi="['system:dept:update']" -->
            <a-divider type="vertical" />
            <a-popconfirm :title="$t('确定要删除吗？')" :ok-text="$t('确定')" :cancel-text="$t('取消')" :disabled="$isPending('delete', row.id)" @confirm="handleDelete(row)">
              <!-- v-hasPermi="['system:dept:delete']" -->
              <a-button type="link" danger :disabled="$isPending('delete', row.id)" class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </section>
        </template>
      </VxeGrid>

      <DeptUpdateOrAdd v-model:visible="visibleModal" :resource="editableData" @success="onRefreshTableData" />
    </a-card>
  </div>
</template>

<style scoped lang="less">
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

:deep(.vxe-table--header-wrapper) {
  height: 50px !important; /* 强制设置表头高度 */
}
:deep(.vxe-header--row .vxe-cell) {
  margin-top: -13px !important;
  background-color: #ededed;
  height: 48px;
}
</style>
