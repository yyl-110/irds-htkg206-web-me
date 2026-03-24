<script lang="ts" setup>
import { ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useVModel } from '@vueuse/core';
import type { RuleObject } from 'ant-design-vue/es/form';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import type { RolePOModel } from '@/api/models/RolePOModel';
import { RoleBaseDTOModel } from '@/api/models/RoleBaseDTOModel';
import { AdminApiSystemRole, getRole } from '@/api/tags/管理后台角色';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { listToTree } from '@/utils/tools';
defineOptions({ name: 'RoleAddAndUpdate' });
const props = defineProps<{
  /** 是否显示弹窗 */
  visible: boolean;
  /** 当前编辑的数据 */
  resource?: RolePOModel;
}>();

const emit = defineEmits<{
  success: [resource: RolePOModel];
  'update:visible': [visible: boolean];
}>();

/** 是否显示弹窗 */
const modalVisible = useVModel(props, 'visible', emit);

const formRef = ref<FormInstance>();

/** 用户组状态 */
enum RoleStatus {
  on,
  off,
}
/** 用户组状态 options */
const roleStatusOptions: Array<DefaultOptionType> = [
  { label: '开启', value: RoleStatus.on },
  { label: '关闭', value: RoleStatus.off },
];
/** 用户组数据 */
class Role extends RoleBaseDTOModel {
  /** 用户组状态 */
  status?: RoleStatus;
  deptId: any;
  id: string | undefined;
}
const { modelData, operationType } = useModelData<Role, RolePOModel>(Role, {
  emptyFields: ['roleClass', 'sort'],
  syncResource: computed(() => props.resource),
  onAfterSync(resource) {
    const status = roleStatusOptions.find(status => resource.status === status.value);
    // modelData.value.status = status ? Number(status.value) : undefined;
  },
});
const rules: Partial<Record<keyof Role, Array<RuleObject> | RuleObject>> = {
  name: { required: true, message: WeiI18n.$t('请填写用户组名称') },
  code: { required: true, message: WeiI18n.$t('请填写用户组编码') },
};

/** 提交表单 */
async function onOk() {
  await formRef.value!.validate();
  let id = props.resource ? props.resource.id : undefined;
  if (props.resource) {
    await AdminApiSystemRole.updateRole({ ...modelData.value, id: props.resource.id });
  } else {
    const res = await AdminApiSystemRole.createRole(modelData.value);
    id = res.data.data;
  }

  if (operationType.value === '新增') {
    message.success(WeiI18n.$t('新增成功'));
  } else {
    message.success(WeiI18n.$t('编辑成功'));
  }

  modalVisible.value = false;
  if (id !== undefined && modelData.value.status !== undefined) await AdminApiSystemRole.updateRoleStatus({ id, status: modelData.value.status });
  emit('success', modelData.value);
}
/** 部门id列表 */
const deptIdList = ref<Array<DefaultOptionType>>([]);
const treeDefaultExpandedKeys = ref<any>('');
/** get role list */
async function getdeptList() {
  const res = await AdminApiSystemDept.listDepts({});
  const list = res.data.data?.map(item => ({ label: item.name, value: item.id, id: item.id, parentId: item.parentId })) || [];
  deptIdList.value = listToTree(list || []);
  if (res.data.data[0]) {
    treeDefaultExpandedKeys.value = res.data.data[0].id;
  }
}
getdeptList();

watch(
  () => props.visible,
  (newParm, oldParm) => {
    if (newParm && operationType.value === '新增') {
      modelData.value.name = '';
      modelData.value.code = '';
      modelData.value.deptId = undefined;
      modelData.value.remark = '';
    } else if (newParm && operationType.value === '编辑') {
      modelData.value.id = props.resource.id;
      modelData.value.deptId = props.resource.deptId;
    }
  },
  { immediate: true },
);
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.roleAddAndUpdate');
}
</script>

<template>
  <div class="roleAddAndUpdate" v-dragModal>
    <a-modal
      v-model:visible="modalVisible"
      style="width: 40%"
      :title="operationType === '新增' ? $t('新增用户组') : $t('编辑用户组')"
      :rules="rules"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="onOk"
      @cancel="modalVisible = false">
      <a-form ref="formRef" :model="modelData" :label-col="{ style: { width: '100px' } }">
        <a-form-item :label="$t('角色名称')" name="name" :rules="[{ required: true, message: `${$t('请输入角色名称')}` }]">
          <a-input v-model:value="modelData.name" :placeholder="$t('请输入角色名称')" />
        </a-form-item>
        <a-form-item :label="$t('角色标识')" name="code" :rules="[{ required: true, message: `${$t('请输入角色标识')}` }]">
          <a-input v-model:value="modelData.code" :placeholder="$t('请输入角色标识')" />
        </a-form-item>
        <!-- <a-form-item :label="$t('显示顺序')" name="sort">
        <a-input-number v-model:value="modelData.sort" placeholder="请输入显示顺序" style="width: 200px"></a-input-number>
      </a-form-item> -->
        <a-form-item :label="$t('所属部门')" name="deptId" :rules="[{ required: true, message: `${$t('请选择部门')}` }]" class="f-item">
          <a-tree-select
            v-model:value="modelData.deptId"
            show-search
            :placeholder="$t('请选择所属部门')"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            allow-clear
            :treeDefaultExpandedKeys="[treeDefaultExpandedKeys]"
            :tree-data="deptIdList"
            tree-node-filter-prop="label">
          </a-tree-select>
        </a-form-item>
        <a-form-item :label="$t('备注')" name="remark">
          <a-textarea v-model:value="modelData.remark" :placeholder="$t('请输入备注内容')" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="onOk">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="modalVisible = false">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
.demo-ruleForm {
  width: 100%;
}

.roleAddAndUpdate {
  position: relative;
}
</style>
