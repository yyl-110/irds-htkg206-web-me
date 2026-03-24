<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import RoleMenuData from './role-menu-data.vue';
import { getModuleRoleUpdateMenuData } from '@/api/system/role/index';
import type { RolePOModel } from '@/api/models/RolePOModel';
import { AdminApiSystemPermission } from '@/api/tags/管理后台权限';

const emit = defineEmits<{
  /** 点击取消按钮 */
  close: [visible: boolean];
  /** 刷新数据 */
  refreshTableData: [visible: boolean];
}>();
const visible = ref(false);
const record = ref<RolePOModel>();
const MenuModel = ref<InstanceType<typeof RoleMenuData>>();
const menuVisible = ref<boolean>(true);
const current = ref<number>(0);

/** 数据 定义 */
const formData = ref<any>({
  id: 0,
  name: '',
  code: '',
  checkedKeys: [],
});
interface RoleMenuPermissionSubmitData {
  menuIds: number[];
  manageMenuIds: number[];
  appMenuIds: number[];
  permissionItems: Array<{
    menuId: number;
    permissionTypes: 1 | 2 | 3;
  }>;
}

/**
 * handleMenuListData
 * @param val record
 */
function handleMenuListData(val: RolePOModel) {
  visible.value = true;
  record.value = val;
  const data = {
    name: val.name,
    code: val.code,
    id: val.id,
  };
  formData.value = data;
  handleMenuData();
}

/** handle close */
function handleClose() {
  // 通过事件传过去
  visible.value = false;
  emit('close', false);
}
/** 表单提交 */
function onSubmitFormData() {
  if (current.value == 0) {
    const selected = findTreeNodeAuth() as RoleMenuPermissionSubmitData | number[] | undefined;
    const parsed = Array.isArray(selected)
      ? { menuIds: selected as number[], manageMenuIds: [], appMenuIds: [], permissionItems: [] }
      : selected || { menuIds: [], manageMenuIds: [], appMenuIds: [], permissionItems: [] };
    const data = {
      roleId: formData.value.id,
      permissionItems: parsed.permissionItems,
    };
    console.log(data);
    getModuleRoleUpdateMenuData(data).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
    });
  }
}

function findTreeNodeAuth() {
  return MenuModel.value?.findTreeNodeAuth();
}
function handleExpandAllMenu() {
  MenuModel.value?.handleExpandAll();
}
function handleCollapseAllMenu() {
  MenuModel.value?.handleCollapseAll();
}

/**
 * handle menu data
 * @param resource resource
 */
function handleMenuData() {
  menuVisible.value = true;
  current.value = 0;
  nextTick(() => {
    MenuModel.value?.handleMenuListData(record.value);
  });
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.authManagementData');
}
defineExpose({ handleMenuListData });
</script>

<template>
  <div class="authManagementData" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      width="1000px"
      height="400px"
      :title="`${$t('授权管理')}-${formData.name}`"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="onSubmitFormData()"
      @cancel="handleClose">
      <div class="menu-permission-row">
        <a-steps :current="current" size="small">
          <a-step title="菜单权限" @click="handleMenuData" />
        </a-steps>
        <div class="menu-permission-actions">
          <a-button type="link" size="small" @click="handleExpandAllMenu">
            {{ $t('全部展开') }}
          </a-button>
          <a-button type="link" size="small" @click="handleCollapseAllMenu">
            {{ $t('全部收起') }}
          </a-button>
        </div>
      </div>
      <RoleMenuData v-if="menuVisible" ref="MenuModel" />
      <template #footer>
        <a-button type="primary" @click="onSubmitFormData">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
.authManagementData {
  position: relative;
}

.menu-permission-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-permission-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}

:deep(.ant-card-bordered) {
  height: calc(100%);
}

.html-content {
  padding: 20px;
  width: 100%;
  background-color: #fff;
  min-height: calc(100vh - 170px);
}
.html-content2 {
  padding: 20px;
  width: 100%;
  background-color: #fff;
  min-height: calc(100vh - 170px);
}

:deep(.ant-modal-body) {
  padding: 0px;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 0px;
}

:deep(.ant-modal-footer) {
  background: #fff;
}
</style>
