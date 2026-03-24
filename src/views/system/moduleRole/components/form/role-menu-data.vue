<script lang="ts" setup>
import { ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { getModuleRoleMenuList } from '@/api/system/role/index';
/** 模块分类接口节点（与 browseTopModuleTree 返回一致） */
interface ModuleCategoryNode {
  id?: string | number;
  categoryName?: string;
  sort?: number;
  children?: ModuleCategoryNode[];
}

/** 表格树节点（含 children 供 a-table 展开） */
interface ModuleCategoryTableRow {
  key: string;
  serial: string;
  categoryName: string;
  children?: ModuleCategoryTableRow[];
}
type PermissionType = 'manage' | 'app';
interface RoleMenuPermissionItem {
  menuId: number;
  permissionTypes: 1 | 2 | 3;
}
interface RoleMenuPermissionSubmitData {
  menuIds: number[];
  manageMenuIds: number[];
  appMenuIds: number[];
  permissionItems: RoleMenuPermissionItem[];
}
interface RoleMenuPermissionApiItem {
  menuId?: string | number;
  permissionTypes?: string | number;
}

const visible = ref(false);

/** 数据 定义 */
const formData = ref({
  id: 0,
  name: '',
  code: '',
  checkedKeys: [] as Array<string | number>,
});

const tableLoading = ref(false);
const moduleMenuTableData = ref<ModuleCategoryTableRow[]>([]);
/** 受控展开的行 key（有子节点的行） */
const expandedRowKeys = ref<string[]>([]);
/** 每行权限勾选状态 */
const permissionByRow = ref<Record<string, PermissionType[]>>({});

const columns = ref<TableColumnType<ModuleCategoryTableRow>[]>([
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'serial',
    key: 'serial',
    width: 100,
    align: 'center',
  },
  {
    title: WeiI18n.$t('分类名称'),
    dataIndex: 'categoryName',
    key: 'categoryName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('权限'),
    dataIndex: 'permission',
    key: 'permission',
    width: 220,
    align: 'center',
  },
]);

/**
 * 只保留到二级：一级(根) + 二级(根的子节点)，去掉三级及以下
 * depth 0 = 一级，depth 1 = 二级；到达二级后不再保留 children
 */
const MAX_CATEGORY_DEPTH = 1;

function trimTreeToSecondLevelOnly(nodes: ModuleCategoryNode[] | undefined | null, depth = 0): ModuleCategoryNode[] {
  if (!nodes?.length) return [];
  return nodes.map(node => {
    const next: ModuleCategoryNode = { ...node };
    if (depth >= MAX_CATEGORY_DEPTH) {
      next.children = undefined;
    } else if (node.children?.length) {
      next.children = trimTreeToSecondLevelOnly(node.children, depth + 1);
    }
    return next;
  });
}

/**
 * 将接口数据转为带 children 的树形表格数据；序号按层级 1、1.1（最多两层）
 */
function mapToTreeRows(nodes: ModuleCategoryNode[] | undefined | null, parentSerial = ''): ModuleCategoryTableRow[] {
  if (!nodes?.length) return [];
  return nodes.map((node, index) => {
    const serial = parentSerial ? `${parentSerial}.${index + 1}` : `${index + 1}`;
    const key = String(node.id ?? `node-${serial}`);
    const row: ModuleCategoryTableRow = {
      key,
      serial,
      categoryName: node.categoryName ?? '',
    };
    if (node.children?.length) {
      row.children = mapToTreeRows(node.children, serial);
    }
    return row;
  });
}

/** 收集所有「仍有子级」的行的 key，用于全部展开 */
function collectExpandableKeys(rows: ModuleCategoryTableRow[]): string[] {
  const keys: string[] = [];
  function walk(list: ModuleCategoryTableRow[]) {
    for (const row of list) {
      if (row.children?.length) {
        keys.push(row.key);
        walk(row.children);
      }
    }
  }
  walk(rows);
  return keys;
}

function handleExpandAll() {
  expandedRowKeys.value = collectExpandableKeys(moduleMenuTableData.value);
}

function handleCollapseAll() {
  expandedRowKeys.value = [];
}

function collectAllRows(rows: ModuleCategoryTableRow[]): ModuleCategoryTableRow[] {
  const all: ModuleCategoryTableRow[] = [];
  function walk(list: ModuleCategoryTableRow[]) {
    for (const row of list) {
      all.push(row);
      if (row.children?.length) walk(row.children);
    }
  }
  walk(rows);
  return all;
}

function rebuildCheckedKeys() {
  formData.value.checkedKeys = Object.entries(permissionByRow.value)
    .filter(([, permissions]) => permissions.length > 0)
    .map(([key]) => key);
}

function findRowByKey(rows: ModuleCategoryTableRow[], key: string): ModuleCategoryTableRow | undefined {
  for (const row of rows) {
    if (row.key === key) return row;
    if (row.children?.length) {
      const target = findRowByKey(row.children, key);
      if (target) return target;
    }
  }
  return undefined;
}

function applyPermissionToChildren(row: ModuleCategoryTableRow | undefined, permissions: PermissionType[]) {
  if (!row?.children?.length) return;
  for (const child of row.children) {
    permissionByRow.value[child.key] = [...permissions];
    applyPermissionToChildren(child, permissions);
  }
}

function syncParentPermissionsByChildren(rows: ModuleCategoryTableRow[]) {
  function walk(list: ModuleCategoryTableRow[]) {
    for (const row of list) {
      if (row.children?.length) {
        walk(row.children);
        const allManageChecked = row.children.every(child => (permissionByRow.value[child.key] || []).includes('manage'));
        const allAppChecked = row.children.every(child => (permissionByRow.value[child.key] || []).includes('app'));
        const nextPermissions: PermissionType[] = [];
        if (allManageChecked) nextPermissions.push('manage');
        if (allAppChecked) nextPermissions.push('app');
        permissionByRow.value[row.key] = nextPermissions;
      }
    }
  }
  walk(rows);
}

function handlePermissionChange(rowKey: string, permissions: PermissionType[]) {
  permissionByRow.value[rowKey] = permissions;
  // 一级节点变更时，子节点默认同步勾选/取消
  const currentRow = findRowByKey(moduleMenuTableData.value, rowKey);
  applyPermissionToChildren(currentRow, permissions);
  // 子节点全选时，父级自动勾选；子节点非全选时，父级自动取消对应权限
  syncParentPermissionsByChildren(moduleMenuTableData.value);
  rebuildCheckedKeys();
}

function mapPermissionTypesToCheckboxValues(permissionTypes: string | number | undefined): PermissionType[] {
  const normalized = Number(permissionTypes);
  if (normalized === 1) return ['manage'];
  if (normalized === 2) return ['app'];
  if (normalized === 3) return ['manage', 'app'];
  return [];
}

/**
 * handleMenuListData
 * @param val record
 */
async function handleMenuListData(val: any) {
  visible.value = true;
  formData.value.name = val.name;
  formData.value.code = val.code;
  formData.value.id = val.id;
  tableLoading.value = true;
  moduleMenuTableData.value = [];
  expandedRowKeys.value = [];
  permissionByRow.value = {};
  try {
    const res = await AdminApiSystemModule.getModuleMenuList({});
    const raw = (res.data?.data ?? []) as ModuleCategoryNode[];
    const list = trimTreeToSecondLevelOnly(raw);
    moduleMenuTableData.value = mapToTreeRows(list);
    expandedRowKeys.value = collectExpandableKeys(moduleMenuTableData.value);
    for (const row of collectAllRows(moduleMenuTableData.value)) {
      permissionByRow.value[row.key] = [];
    }
    const data = {
      roleId: formData.value.id,
    };
    const resList = await getModuleRoleMenuList(data);
    const selectedPermissions = (resList.data?.data ?? []) as RoleMenuPermissionApiItem[];
    for (const item of selectedPermissions) {
      const rowKey = String(item.menuId ?? '');
      if (!rowKey || !(rowKey in permissionByRow.value)) continue;
      permissionByRow.value[rowKey] = mapPermissionTypesToCheckboxValues(item.permissionTypes);
    }
    // 仅在子级全选某权限时，父级自动补齐对应权限
    syncParentPermissionsByChildren(moduleMenuTableData.value);
    rebuildCheckedKeys();
  } finally {
    tableLoading.value = false;
  }
}

/** 提交授权时仍由父组件调用；当前为纯展示表格，无勾选，返回空 */
function findTreeNodeAuth() {
  const menuIds: number[] = [];
  const manageMenuIds: number[] = [];
  const appMenuIds: number[] = [];
  const permissionItems: RoleMenuPermissionItem[] = [];
  for (const [menuIdStr, permissions] of Object.entries(permissionByRow.value)) {
    if (!permissions.length) continue;
    const menuId = Number(menuIdStr);
    if (Number.isNaN(menuId)) continue;
    menuIds.push(menuId);
    if (permissions.includes('manage')) manageMenuIds.push(menuId);
    if (permissions.includes('app')) appMenuIds.push(menuId);
    const hasManage = permissions.includes('manage');
    const hasApp = permissions.includes('app');
    const permissionTypes: 1 | 2 | 3 = hasManage && hasApp ? 3 : hasManage ? 1 : 2;
    permissionItems.push({ menuId, permissionTypes });
  }
  return {
    menuIds: Array.from(new Set(menuIds)),
    manageMenuIds: Array.from(new Set(manageMenuIds)),
    appMenuIds: Array.from(new Set(appMenuIds)),
    permissionItems,
  } as RoleMenuPermissionSubmitData;
}

defineExpose({ handleMenuListData, findTreeNodeAuth, handleExpandAll, handleCollapseAll });
</script>

<template>
  <div>
    <a-form :model="formData" style="margin-top: 20px">
      <a-form-item>
        <a-card>
          <a-table
            row-key="key"
            size="small"
            :loading="tableLoading"
            :columns="columns"
            :data-source="moduleMenuTableData"
            :pagination="false"
            :scroll="{ y: 300 }"
            :indent-size="20"
            v-model:expanded-row-keys="expandedRowKeys"
            bordered>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'permission'">
                <a-checkbox-group :value="permissionByRow[record.key] || []" @change="(vals: any) => handlePermissionChange(record.key, vals as PermissionType[])">
                  <a-space :size="10">
                    <a-checkbox value="manage">
                      <span class="permission-rich-text permission-manage">{{ $t('管理') }}</span>
                    </a-checkbox>
                    <a-checkbox value="app">
                      <span class="permission-rich-text permission-app">{{ $t('应用') }}</span>
                    </a-checkbox>
                  </a-space>
                </a-checkbox-group>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
:deep(.ant-modal-body) {
  height: 300px;
  padding: 0px;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 0px;
}

:deep(.ant-modal-footer) {
  background: #fff;
}
:deep(.ant-form-item) {
  margin: 0;
}

.permission-rich-text {
  font-weight: 500;
}

.permission-manage {
  color: #1677ff;
}

.permission-app {
  color: #13a8a8;
}
</style>
