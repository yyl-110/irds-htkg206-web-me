<script lang="ts" setup>
import type { FormInstance, TableProps } from 'ant-design-vue';
import { getCurrentInstance, ref } from 'vue';
import { Button, Modal, Popconfirm, message } from 'ant-design-vue';

import {
  DownloadModuleFile,
  GetLocParametersInFirstCsys,
  apiRenameModel,
  assembleModule,
  openDrawing,
  openModule,
  openTopAsmTemplateInterfaceModel,
  parameterInFirstCsys,
} from '@/libs/webSocket';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  bomInfoData: {
    require: false,
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
}>();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const instance = getCurrentInstance();
const imgColumns = ref([
  {
    title: '模型结构树',
    key: 'equnr',
    dataIndex: 'equnr',
    align: 'left',
    resizable: true,
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '新文件名称',
    key: 'moduleNewNum',
    dataIndex: 'moduleNewNum',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '公用名称',
    key: 'descript',
    dataIndex: 'descript',
    align: 'center',
    resizable: true,
    width: 100,
  },
]);
const selectedRowList = ref<any[]>([]);
const actionList = ref([
  { label: '重新使用', value: '重新使用' },
  { label: '手动命名', value: '手动命名' },
  { label: '自动命名', value: '自动命名' },
]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRowList.value = selectedRows;
  },
};
/**
 * @description 点击确认
 */
async function handleSave() {}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
/**
 * 打开编辑应用的类型
 */
async function openBomInfoData() {
  const tree: any = props.bomInfoData[0];
  const openTop = await openTopAsmTemplateInterfaceModel(
    instance,
    tree.equnr,
    tree.moduleType,
    tree.moduleNewNum,
    '',
    ''
  );
  if (openTop.ReturnStatus == 0) {
    recursiveTraversal(props.bomInfoData);
  }
}
/**
 * 递归调用接口数据
 * @param tree
 */
function recursiveTraversal(tree: any) {
  if (Array.isArray(tree)) {
    // 如果是数组，则递归处理每个子节点
    return Promise.all(tree.map(subtree => recursiveTraversal(subtree)));
  } else if (typeof tree === 'object' && tree !== null) {
    // 如果是对象，则遍历当前节点的数据并进行循环调用接口
    for (const key in tree) {
      if (tree.hasOwnProperty(key)) {
        const data = tree[key];
        if (key === 'supeq') {
          if (+data !== 0) {
            if (tree.moduleNewNum) {
              apiRenameModel(instance, tree.equnr, tree.moduleType, tree.moduleNewNum);
            }
          }
        }
        recursiveTraversal(data);
      }
    }
  }
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 80%"
    :title="$t('编辑应用')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @cancel="cancel">
    <a-table
      bordered
      style="margin-top: 5px"
      :scroll="{ x: 600 }"
      :pagination="false"
      row-key="id"
      :data-source="bomInfoData"
      :columns="imgColumns"
      :row-selection="rowSelection"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-select v-model:value="record.status" style="width: 150px" allow-clear>
            <a-select-option v-for="item in actionList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template v-if="column.dataIndex === 'moduleNewNum'">
          <a-input
            v-model:value="record.moduleNewNum"
            style="width: 150px"
            :disabled="record.moduleNewNum !== '手动命名'" />
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="openBomInfoData"> 打开 </a-button>
      <a-button type="primary" @click="emit('onClose', false)"> 确定 </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped></style>
