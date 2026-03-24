<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import RoleMenuData from './role-menu-data.vue';
import RoleModularData from './role-modular-data.vue';
import RoleServiceData from './role-service-data.vue';
import { getRoleUpdateMenuData } from '@/api/system/role/index';
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
const ModularModel = ref<InstanceType<typeof RoleModularData>>();
const ServiceModel = ref<InstanceType<typeof RoleServiceData>>();
const menuVisible = ref<boolean>(true);
const ModularVisible = ref<boolean>(false);
const ServiceVisible = ref<boolean>(false);
const current = ref<number>(0);

/** 数据 定义 */
const formData = ref<any>({
  id: 0,
  name: '',
  code: '',
  checkedKeys: [],
});

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
    const data = {
      roleId: formData.value.id,
      menuIds: findTreeNodeAuth(),
    };
    getRoleUpdateMenuData(data).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
      // emit('refreshTableData', false)
      // handleModularData();
    });
  } else if (current.value == 1) {
    const data = {
      type: 1,
      roleId: formData.value.id,
      funcIds: findModularAuth(),
    };
    AdminApiSystemPermission.savepermissionLogin(data).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
      // handleServiceData();
      // emit('refreshTableData', false)
    });
  } else if (current.value == 2) {
    const data = {
      type: '1',
      roleId: formData.value.id,
      dirIds: findServiceAuth(),
    };
    AdminApiSystemPermission.saveservicedoc(data).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
      // handleServiceData()
      // emit('refreshTableData', false)
    });

    const data2 = {
      type: '2',
      roleId: formData.value.id,
      dirIds: findServiceAdmAuth(),
    };
    AdminApiSystemPermission.saveservicedoc(data2).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
      // handleServiceData()
      // emit('refreshTableData', false)
    });
    const data3 = {
      type: '3',
      roleId: formData.value.id,
      dirIds: findServiceDlAuth(),
    };
    AdminApiSystemPermission.saveservicedoc(data3).then(() => {
      visible.value = false;
      message.success(WeiI18n.$t('操作成功'));
      // handleServiceData()
      // emit('refreshTableData', false)
    });
  }
}

function findTreeNodeAuth() {
  return MenuModel.value?.findTreeNodeAuth();
}

function findModularAuth() {
  return ModularModel.value?.findModularAuth();
}

function findServiceAuth() {
  return ServiceModel.value?.findServiceAuth();
}

function findServiceAdmAuth() {
  return ServiceModel.value?.findServiceAdmAuth();
}

function findServiceDlAuth() {
  return ServiceModel.value?.findServiceDlAuth();
}

/**
 * handle menu data
 * @param resource resource
 */
function handleMenuData() {
  menuVisible.value = true;
  ModularVisible.value = false;
  ServiceVisible.value = false;
  current.value = 0;
  nextTick(() => {
    MenuModel.value?.handleMenuListData(record.value);
  });
}
/**
 * handle menu data
 * @param resource resource
 */
function handleModularData() {
  ModularVisible.value = true;
  menuVisible.value = false;
  ServiceVisible.value = false;
  current.value = 1;
  nextTick(() => {
    ModularModel.value?.handleMenuListData(record.value);
  });
}
/**
 * handle menu data
 * @param resource resource
 */
function handleServiceData() {
  ModularVisible.value = false;
  menuVisible.value = false;
  ServiceVisible.value = true;
  current.value = 2;
  nextTick(() => {
    ServiceModel.value?.handleMenuListData(record.value);
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
    <a-steps :current="current" size="small">
      <a-step title="菜单权限" @click="handleMenuData" />
      <!-- <a-step title="模块权限" @click="handleModularData" /> -->
      <!-- <a-step title="资料权限" @click="handleServiceData" /> -->
    </a-steps>

    <RoleMenuData v-if="menuVisible" ref="MenuModel" />

    <RoleModularData v-if="ModularVisible" ref="ModularModel" />
    <RoleServiceData v-if="ServiceVisible" ref="ServiceModel" />
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
