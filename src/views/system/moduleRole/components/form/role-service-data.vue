<script lang="ts" setup>
import type { UnwrapRef } from 'vue';
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemPermission } from '@/api/tags/管理后台权限';
import type { MenuSimpleResponseDTO } from '@/api/tags/data-contracts';

/** 数据 定义 */
const formData = ref<any>({
  id: 0,
  name: '',
  code: '',
  checkedKeys: [],
});

/** 数据 定义 */
const formDataAdm = ref<any>({
  id: 0,
  name: '',
  code: '',
  checkedAdmKeys: [],
});

/** 下载 数据 定义 */
const formDataDl = ref<any>({
  id: 0,
  name: '',
  code: '',
  checkedDlKeys: [],
});
const treeDataTranslate: any = inject('treeDataTranslate');
const visible = ref(false);
const expandAll = ref(true);
const expandAdmAll = ref(true);
const expandDlAll = ref(true);
const checkedAll = ref<any>(false);
const checkedAdmAll = ref<any>(false);
const checkedDlAll = ref<any>(false);
const menuTreeData = ref([]);
const menuTreeAdmData = ref([]);
const menuTreeDlData = ref([]);

const menuCheckData = ref([]);
const menuCheckAdmData = ref([]);
const menuCheckDlData = ref([]);

/** 菜单树数据结构 */
type MenuSimpleResponseTree = MenuSimpleResponseDTO & { children?: Array<MenuSimpleResponseDTO> };
/** 菜单树 Map 数据结构 */
interface MenuSimpleResponseTreeMap {
  [id: number]: MenuSimpleResponseTree;
}
const menuCheckDataMap = ref<MenuSimpleResponseTreeMap>({});
const menuCheckAdmDataMap = ref<MenuSimpleResponseTreeMap>({});
const menuCheckDlDataMap = ref<MenuSimpleResponseTreeMap>({});
const expandedKeys = ref<Array<number>>([]);
const expandedAdmKeys = ref<Array<number>>([]);
const expandedDlKeys = ref<Array<number>>([]);

/** 当前处于半选状态的节点 ID */
const halfCheckedKeys = ref<Array<number>>([]);
const halfCheckedAdmKeys = ref<Array<number>>([]);
const halfCheckedDlKeys = ref<Array<number>>([]);

/** 包含全选和半选状态的已选项 id */
interface AllCheckedKeys {
  checkedKeys: Array<number>;
  halfCheckedKeys: Array<number>;
}

/** 包含全选和半选状态的已选项 id */
interface AllCheckedAdmKeys {
  checkedAdmKeys: Array<number>;
  halfCheckedAdmKeys: Array<number>;
  halfCheckedDlKeys: Array<number>;
}

/** get menu data */
function getListData() {
  return AdminApiSystemPermission.getserviceparentList({}).then((res: any) => {
    const data = res.data;
    menuTreeData.value = treeDataTranslate(data.data, 'id');
    menuCheckData.value = data.data;
    for (const item of data.data) menuCheckDataMap.value[item.id] = item;
  });
}

/** get menu data */
function getListAdmData() {
  return AdminApiSystemPermission.getserviceparentList({}).then((res: any) => {
    const data = res.data;
    menuTreeAdmData.value = treeDataTranslate(data.data, 'id');
    menuCheckAdmData.value = data.data;
    for (const item of data.data) menuCheckAdmDataMap.value[item.id] = item;
  });
}

/** get menu data */
function getListDlData() {
  return AdminApiSystemPermission.getserviceparentList({}).then((res: any) => {
    const data = res.data;
    menuTreeDlData.value = treeDataTranslate(data.data, 'id');
    menuCheckDlData.value = data.data;
    for (const item of data.data) menuCheckDlDataMap.value[item.id] = item;
  });
}

/**
 * 菜单权限 check
 * @param checkedKeys checkedKeys
 * @param event event
 */
function onCheck(checkedKeys: Array<number>, event: any) {
  formData.value.checkedKeys = checkedKeys || [];
  halfCheckedKeys.value = event.halfCheckedKeys || [];
}

/**
 * 菜单权限 check
 * @param checkedKeys checkedKeys
 * @param checkedAdmKeys
 * @param event event
 */
function onCheckAdm(checkedAdmKeys: Array<number>, event: any) {
  formDataAdm.value.checkedAdmKeys = checkedAdmKeys || [];
  halfCheckedAdmKeys.value = event.halfCheckedAdmKeys || [];
}

/**
 * 菜单权限 check
 * @param checkedKeys checkedKeys
 * @param checkedAdmKeys
 * @param event event
 */
function onCheckDl(checkedAdmKeys: Array<number>, event: any) {
  formDataDl.value.checkedAdmKeys = checkedAdmKeys || [];
  halfCheckedDlKeys.value = event.halfCheckedDlKeys || [];
}

/**
 * 根据给定的全选和半选节点ID，确定部门树中所有节点的选中状态。
 * @param selection - 包含全选和半选节点ID的数组。
 * @param departmentsMap - 以部门ID为键的部门数据映射。
 * @returns 包含全选节点和半选节点ID的对象。
 */
function getCheckedKeys(selection: number[], departmentsMap: MenuSimpleResponseTreeMap = menuCheckDataMap.value): AllCheckedKeys {
  // 初始化存储每个节点选中状态的映
  const checkedStatus: { [id: number]: boolean } = {};
  // 根据selection初始化选中状态
  selection.forEach(id => {
    if (departmentsMap[id]) checkedStatus[id] = true;
    else return console.error('Menu not found, ID: ', id);
  });

  /**
   * 辅助函数，用于递归确定节点的选中状态
   * @param node menu node
   */
  function determineCheckedStatus(node: MenuSimpleResponseTree) {
    // 如果当前节点被选中，则检查其子节点
    if (checkedStatus[node.id]) {
      // 假设当前节点所有子孙都选中
      let allDescendantsChecked = true;

      // 遍历子节点
      for (const child of node.children || []) {
        if (!determineCheckedStatus(child)) allDescendantsChecked = false;
      }

      // 如果所有子孙都被选中，则当前节点为全选
      if (allDescendantsChecked) return true;
    }
    // 如果当前节点未被选中，则返回false
    return false;
  }

  // 遍历departmentsMap中的所有节点，确定选中状态
  const allMenus: Array<MenuSimpleResponseTree> = Object.values(departmentsMap);
  const checkedKeys: number[] = [];
  const halfCheckedKeys: number[] = [];

  for (const menu of allMenus) {
    if (determineCheckedStatus(menu)) checkedKeys.push(menu.id);
  }

  // 确定半选节点，即选中状态为真但不是全选的节点
  for (const id in checkedStatus) {
    if (checkedStatus[id] && !checkedKeys.includes(+id)) halfCheckedKeys.push(+id);
  }
  return {
    checkedKeys,
    halfCheckedKeys,
  };
}

/**
 * 根据给定的全选和半选节点ID，确定部门树中所有节点的选中状态。
 * @param selection - 包含全选和半选节点ID的数组。
 * @param departmentsMap - 以部门ID为键的部门数据映射。
 * @returns 包含全选节点和半选节点ID的对象。
 */
function getCheckedAdmKeys(selection: number[], departmentsMap: MenuSimpleResponseTreeMap = menuCheckAdmDataMap.value): AllCheckedAdmKeys {
  // 初始化存储每个节点选中状态的映
  const checkedStatus: { [id: number]: boolean } = {};
  // 根据selection初始化选中状态
  selection.forEach(id => {
    if (departmentsMap[id]) checkedStatus[id] = true;
    else return console.error('Menu not found, ID: ', id);
  });

  /**
   * 辅助函数，用于递归确定节点的选中状态
   * @param node menu node
   */
  function determineCheckedStatus(node: MenuSimpleResponseTree) {
    // 如果当前节点被选中，则检查其子节点
    if (checkedStatus[node.id]) {
      // 假设当前节点所有子孙都选中
      let allDescendantsChecked = true;

      // 遍历子节点
      for (const child of node.children || []) {
        if (!determineCheckedStatus(child)) allDescendantsChecked = false;
      }

      // 如果所有子孙都被选中，则当前节点为全选
      if (allDescendantsChecked) return true;
    }
    // 如果当前节点未被选中，则返回false
    return false;
  }

  // 遍历departmentsMap中的所有节点，确定选中状态
  const allMenus: Array<MenuSimpleResponseTree> = Object.values(departmentsMap);
  const checkedAdmKeys: number[] = [];
  const halfCheckedAdmKeys: number[] = [];

  for (const menu of allMenus) {
    if (determineCheckedStatus(menu)) checkedAdmKeys.push(menu.id);
  }

  // 确定半选节点，即选中状态为真但不是全选的节点
  for (const id in checkedStatus) {
    if (checkedStatus[id] && !checkedAdmKeys.includes(+id)) halfCheckedAdmKeys.push(+id);
  }
  return {
    checkedAdmKeys,
    halfCheckedAdmKeys,
  };
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
  formDataAdm.value.name = val.name;
  formDataAdm.value.code = val.code;
  formDataAdm.value.id = val.id;
  halfCheckedKeys.value = [];
  halfCheckedAdmKeys.value = [];
  halfCheckedDlKeys.value = [];
  // await getListData();
  AdminApiSystemPermission.getservicelistroledir({ roleId: formData.value.id }).then((res: any) => {
    const data = res.data;
    const checkedResult = getCheckedKeys(data.data.app);
    formData.value.checkedKeys = checkedResult.checkedKeys;
    halfCheckedKeys.value = checkedResult.checkedKeys;

    const checkedResult2 = getCheckedKeys(data.data.manage);
    formDataAdm.value.checkedAdmKeys = checkedResult2.checkedKeys;
    halfCheckedAdmKeys.value = checkedResult2.checkedKeys;

    const checkedResult3 = getCheckedKeys(data.data.download);
    formDataDl.value.checkedDlKeys = checkedResult3.checkedKeys;
    halfCheckedDlKeys.value = checkedResult3.checkedKeys;
  });
  // await getListAdmData();
  // getListDlData()
  formDataAdm.value.checkedAdmKeys = [];
  halfCheckedAdmKeys.value = [];
  //  AdminApiSystemPermission.getservicelistroledir({ roleId: formDataAdm.value.id }).then((res: any) => {
  //   const data = res.data
  //   const checkedResult = getCheckedAdmKeys(data.data)
  //   formDataAdm.value.checkedAdmKeys = checkedResult.checkedAdmKeys
  //   halfCheckedAdmKeys.value = checkedResult.checkedAdmKeys
  // })
}
/** 全选/全不选 */
function handleSwitchCheckAll() {
  formData.value.checkedKeys = [];
  if (checkedAll.value) {
    menuCheckData.value.forEach((item: any) => {
      formData.value.checkedKeys.push(item.id);
    });
  }
}

/** 业务管理全选/全不选 */
function handleSwitchAdmCheckAll() {
  formDataAdm.value.checkedAdmKeys = [];
  if (checkedAdmAll.value) {
    menuCheckAdmData.value.forEach((item: any) => {
      formDataAdm.value.checkedAdmKeys.push(item.id);
    });
  }
}

/** 下载管理全选/全不选 */
function handleSwitchDlCheckAll() {
  formDataDl.value.checkedDlKeys = [];
  if (checkedDlAll.value) {
    menuCheckDlData.value.forEach((item: any) => {
      formDataDl.value.checkedDlKeys.push(item.id);
    });
  }
}

function findServiceAuth() {
  return formData.value.checkedKeys;
}

function findServiceAdmAuth() {
  return formDataAdm.value.checkedAdmKeys;
}

function findServiceDlAuth() {
  return formDataDl.value.checkedDlKeys;
}
defineExpose({ handleMenuListData, findServiceAuth, findServiceAdmAuth, findServiceDlAuth });
</script>

<template>
  <div>
    <a-form model="formData" style="margin-top: 20px">
      <div style="display: inline-block; width: 300px">
        <a-form-item style="width: 300px">
          <a-card>
            <template #title>
              <span style="width: 120px">
                <strong>浏览应用权限</strong>
              </span>
              <span style="font-size: 14px; margin-left: 30px">
                <a-switch v-model:checked="checkedAll" :checked-children="$t('全不选')" :un-checked-children="$t('全选')" @change="handleSwitchCheckAll" />
              </span>
            </template>
            <a-directory-tree
              v-if="menuTreeData.length"
              v-model:expanded-keys="expandedKeys"
              v-model:checked-keys="formData.checkedKeys"
              :default-expand-all="expandAll"
              checkable
              :show-icon="false"
              :field-names="{ key: 'id', title: 'nodeName' }"
              style="width: 100%"
              :tree-data="menuTreeData"
              :height="300"
              @check="onCheck">
              <template #title="{ nodeName }">
                {{ nodeName }}
              </template>
            </a-directory-tree>
          </a-card>
        </a-form-item>
      </div>
      <div style="display: inline-block; width: 300px; margin-left: 15px">
        <a-form-item style="width: 300px">
          <a-card>
            <template #title>
              <span style="width: 120px">
                <strong>下载权限</strong>
              </span>
              <span style="font-size: 14px; margin-left: 30px">
                <a-switch v-model:checked="checkedDlAll" :checked-children="$t('全不选')" :un-checked-children="$t('全选')" @change="handleSwitchDlCheckAll" />
              </span>
            </template>
            <a-directory-tree
              v-if="menuTreeDlData.length"
              v-model:expanded-keys="expandedDlKeys"
              v-model:checked-keys="formDataDl.checkedDlKeys"
              :default-expand-all="expandDlAll"
              checkable
              :show-icon="false"
              :field-names="{ key: 'id', title: 'nodeName' }"
              style="width: 100%"
              :tree-data="menuTreeDlData"
              :height="300"
              @check="onCheckDl">
              <template #title="{ nodeName }">
                {{ nodeName }}
              </template>
            </a-directory-tree>
          </a-card>
        </a-form-item>
      </div>
      <div style="display: inline-block; margin-left: 15px">
        <a-form-item style="width: 300px">
          <a-card>
            <template #title>
              <span style="width: 120px">
                <strong>业务管理权限</strong>
              </span>
              <span style="font-size: 14px; margin-left: 30px">
                <a-switch v-model:checked="checkedAdmAll" :checked-children="$t('全不选')" :un-checked-children="$t('全选')" @change="handleSwitchAdmCheckAll" />
              </span>
            </template>
            <a-directory-tree
              v-if="menuTreeAdmData.length"
              v-model:expanded-keys="expandedAdmKeys"
              v-model:checked-keys="formDataAdm.checkedAdmKeys"
              :default-expand-all="expandAdmAll"
              checkable
              :show-icon="false"
              :field-names="{ key: 'id', title: 'nodeName' }"
              style="width: 100%"
              :tree-data="menuTreeAdmData"
              :height="300"
              @check="onCheckAdm">
              <template #title="{ nodeName }">
                {{ nodeName }}
              </template>
            </a-directory-tree>
          </a-card>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<style scoped>
:deep(.ant-form-item) {
  margin: 0;
}
</style>
