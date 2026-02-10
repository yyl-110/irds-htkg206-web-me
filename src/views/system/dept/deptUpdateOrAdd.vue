<script lang="ts" setup>
import type { FormInstance, TreeSelectProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import { useVModel } from '@vueuse/core';
import type { DeptResponseDTO } from '@/api/tags/data-contracts';
import { AdminApiSystemDept } from '@/api/tags/管理后台部门';
import { DeptCreateRequestDTOModel } from '@/api/models/DeptCreateRequestDTOModel';
import type { DeptUpdateRequestDTOModel } from '@/api/models/DeptUpdateRequestDTOModel';

defineOptions({ name: 'DeptUpdateOrAdd' });

const props = defineProps<{
  /** 是否显示弹窗 */
  visible: boolean;
  /** 当前编辑的数据 */
  resource?: DeptResponseDTO;
}>();

const emit = defineEmits<{
  success: [resource: DeptCreateRequestDTOFromModel];
  'update:visible': [visible: boolean];
}>();

/** 当前表单使用的 data 类 */
class DeptCreateRequestDTOFromModel extends DeptCreateRequestDTOModel {
  /** 负责人 */
  $leaders: Array<any> = [];
  /**
   * 转换为当前的 (新增 / 编辑)请求参数
   * @param resource resource prop data
   */
  getParams<R extends DeptResponseDTO | undefined>(resource: R): R extends DeptResponseDTO ? DeptUpdateRequestDTOModel : DeptCreateRequestDTOModel {
    this.leaderUserId = this.$leaders.map(d => d.id); // 同步更新 leaderUserId
    return { ...this, id: resource ? resource.id : undefined, $leaders: undefined };
  }
}

const { modelData, operationType } = useModelData<DeptCreateRequestDTOFromModel, DeptResponseDTO>(DeptCreateRequestDTOFromModel, {
  emptyAnyFields: ['sort', 'parentId', 'code'],
  syncResource: computed(() => props.resource),
  onAfterSync() {
    modelData.value.parentId = props.resource?.parentId;
    modelData.value.sort = props.resource?.sort;
    modelData.value.code = props.resource?.code;
    if (modelData.value.leaderUserId != null && modelData.value.leaderUserId != undefined) {
      modelData.value.$leaders = modelData.value.leaderUserId!.map(id => ({ id, nickname: '' }));
    }
  },
});

/** 是否显示弹窗 */
const modalVisible = useVModel(props, 'visible', emit);

const treeDataTranslate: any = inject('treeDataTranslate');
const formRef = ref<FormInstance>();

const rules: Partial<Record<keyof DeptCreateRequestDTOFromModel, Array<RuleObject> | RuleObject>> = {
  parentId: { required: true, message: '请选择上级部门' },
  code: { required: true, message: '请填写部门编码' },
  name: { required: true, message: '请填写部门名称' },
  $leaders: { required: true, message: '请填写负责人' },
};

const deptTreeData = ref<TreeSelectProps[]>([]);

/** getParSelectData */
async function getParSelectData() {
  const res = await AdminApiSystemDept.getSimpleDepts();
  deptTreeData.value = treeDataTranslate(res.data.data, 'id');
}
getParSelectData();

const labelCol = ref({ style: { width: '80px' } });

/** 提交表单 */
async function onOk() {
  await formRef.value!.validate();
  props.resource ? await AdminApiSystemDept.updateDept(modelData.value.getParams(props.resource)) : await AdminApiSystemDept.createDept(modelData.value.getParams(props.resource));
  message.success(`${operationType.value}成功`);
  modalVisible.value = false;
  emit('success', modelData.value);
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.deptUpdateOrAdd');
}

</script>

<template>
  <div class="deptUpdateOrAdd" v-dragModal>
  <a-modal
    v-model:visible="modalVisible"
    style="width: 40%"
    :title="`${operationType}部门`"
    :getContainer="customGetContainer"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="onOk"
    @cancel="modalVisible = false">
    <a-form ref="formRef" :model="modelData" :label-col="labelCol" :rules="rules">
      <a-form-item :label="$t('上级部门')" name="parentId">
        <a-tree-select
          v-model:value="modelData.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="$t('请选择上级部门')"
          allow-clear
          tree-default-expand-all
          :tree-data="deptTreeData"
          :height="233"
          tree-node-filter-prop="name"
          :field-names="{ children: 'children', label: 'name', value: 'id' }">
          <template #title="{ name }">
            {{ name }}
          </template>
        </a-tree-select>
      </a-form-item>
      <a-form-item :label="$t('部门编码')" name="code">
        <a-input v-model:value="modelData.code" :placeholder="$t('请输入部门名称')" />
      </a-form-item>
      <a-form-item :label="$t('部门名称')" name="name">
        <a-input v-model:value="modelData.name" :placeholder="$t('请输入部门名称')" />
      </a-form-item>
      <a-form-item :label="$t('显示排序')" name="sort">
        <a-input-number v-model:value="modelData.sort" />
      </a-form-item>
      <a-form-item :label="$t('联系电话')" name="phone">
        <a-input v-model:value="modelData.phone" :placeholder="$t('请输入联系电话')" />
      </a-form-item>
      <a-form-item :label="$t('邮箱')" name="email">
        <a-input v-model:value="modelData.email" :placeholder="$t('请输入邮箱')" />
      </a-form-item>
      <a-form-item :label="$t('状态')" name="status">
        <a-select v-model:value="modelData.status" :placeholder="$t('请选择状态')" style="width: 200px">
          <a-select-option :value="0">
            {{ $t('开启') }}
          </a-select-option>
          <a-select-option :value="1">
            {{ $t('关闭') }}
          </a-select-option>
        </a-select>
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
<style scoped lang="less">
  .deptUpdateOrAdd {
    position: relative;
  }
</style>
