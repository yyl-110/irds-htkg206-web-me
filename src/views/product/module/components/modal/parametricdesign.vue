<script lang="ts" setup>
import { ref, computed, getCurrentInstance } from 'vue';
import type { TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
import { useUserStore } from '@/store/modules/user';
import { openModule, parameterInFirstCsys, GetLocParametersInFirstCsys } from '@/libs/webSocket';

const userStore = useUserStore();
const instance = getCurrentInstance();

const props = withDefaults(
  defineProps<{
    /** 弹窗状态 */
    modalVisible?: boolean;
    parmDesignData?: any[];
    paramsObject?: { templateModuleNum?: string; templateModuleType?: string; inputVal?: string };
    selectModelList?: any[];
    categoryid?: string;
    moduleId?: string;
  }>(),
  {
    modalVisible: false,
    parmDesignData: () => [],
    paramsObject: () => ({}),
    selectModelList: () => [],
    categoryid: '',
    moduleId: '',
  },
);

const emit = defineEmits<{
  onClose: [visible: boolean];
  handleSave: [resource: any];
  changeData: [moduleNewNum: string];
  /** 重置参数后同步列表数据，父组件需 v-model:parmDesignData 或 @update:parmDesignData */
  updateParmDesignData: [data: any[]];
}>();
const visible = computed(() => props.modalVisible);

const parmDesignColumn = ref([
  {
    title: '列名',
    key: 'propertyName',
    dataIndex: 'propertyName',
    align: 'left',
    resizable: true,
    width: 100,
  },

  {
    title: '模型参数名',
    key: 'parameterNum',
    dataIndex: 'parameterNum',
    align: 'center',
    resizable: true,
    width: 170,
  },
  {
    title: '参数值',
    key: 'parameterValue',
    dataIndex: 'parameterValue',
    align: 'center',
    resizable: true,
    width: 100,
  },
]);
const selectedRowList = ref<any[]>([]);

/** 表格勾选 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (_selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRowList.value = selectedRows;
  },
};

const needPieceNumberTip = () => {
  const inputVal = props.paramsObject?.inputVal;
  if (inputVal == null || inputVal === '') {
    message.warning({ content: '请先申请件号！', duration: 3, closable: true });
    return true;
  }
  return false;
};

/** 拼接参数 JSON 字符串（使用当前表格中的 parameterValue，无则用 paraValue） */
function buildParametersStr(): string {
  const list = props.parmDesignData ?? [];
  const parts = list
    .filter((item: any) => item.paraDictionaryName != null && item.paraDictionaryName !== undefined)
    .map((item: any) => `{"Name": "${item.paraDictionaryName}","Type": "double","Value": "${item.parameterValue ?? item.paraValue ?? ''}","Description": ""}`);
  return parts.join(',');
}

function setModuleParameter() {
  if (needPieceNumberTip()) return;
  const parametersStr = buildParametersStr();
  parameterInFirstCsys(props.paramsObject!.inputVal!, props.paramsObject!.templateModuleType!, parametersStr);
}

async function applyPieceNumber() {
  const data = {
    categoryId: props.categoryid,
    userId: userStore.getUser.id,
    moduleNum: props.paramsObject?.templateModuleNum,
  };
  const res = await AdminApiwebSocketAuth.getModuleNumber(data);
  if (res.data.code === 200) {
    emit('changeData', res.data.data.moduleNewNum);
  }
}

function makeModule() {
  if (needPieceNumberTip()) return;
  const parametersStr = buildParametersStr();
  openModule(instance, props.paramsObject!.templateModuleNum!, props.paramsObject!.templateModuleType!, props.paramsObject!.inputVal!, '', parametersStr);
}

function getModuleParameter() {
  if (needPieceNumberTip()) return;
  GetLocParametersInFirstCsys(instance, props.paramsObject!.inputVal!, props.paramsObject!.templateModuleType!);
}

async function resetParm() {
  const list = props.selectModelList ?? [];
  if (list.length === 0) {
    message.warning({ content: '请选择数据，进行设计', duration: 3, closable: true });
    return;
  }
  const res = await AdminApiwebSocketAuth.modelDesignParametric({
    categoryId: props.categoryid,
    userId: userStore.getUser.id,
    id: list[0].id,
  });
  const moduleParaList = res.data.data?.moduleParaList ?? [];
  const parmDesignData1 = moduleParaList.filter((item: any) => {
    const modelInfoProp = item.modelInfoProp;
    if (!modelInfoProp || modelInfoProp.length <= 4) return false;
    const numPart = modelInfoProp.substring(4);
    return Number(numPart) > 9;
  });
  emit('updateParmDesignData', parmDesignData1);
}

async function saveParm() {
  const designData = queryParmList();
  const res = await AdminApiwebSocketAuth.parametricDesignSave({
    categoryId: props.categoryid,
    userId: userStore.getUser.id,
    moduleId: props.moduleId,
    designData,
  });
  if (res.data.code === 200) {
    message.info({ content: '保存成功', duration: 3, closable: true });
  }
}

/** 汇总为保存接口需要的 designData 格式（使用当前 parameterValue） */
function queryParmList(): any[] {
  const po = props.paramsObject ?? {};
  const list = props.parmDesignData ?? [];
  if (list.length === 0) return [];
  const first: any = {
    moduleNewNum: po.inputVal,
    moduleType: po.templateModuleType,
  };
  list.forEach((item: any) => {
    first[item.dataProp] = item.parameterValue ?? item.paraValue;
  });
  return [first];
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
</script>

<template>
  <a-modal v-model:visible="visible" style="width: 50%; top: 10vh; height: 80vh;"
    :body-style="{ height: 'calc(80vh - 108px)', display: 'flex', flexDirection: 'column', padding: '16px' }"
    :title="$t('编辑应用')" @cancel="cancel" :confirm-loading="$isPending()" :mask-closable="false">
    <div class="flex flex-col h-full w-full">
      <a-form label-position="left">
        <div style="width: 600px">
          <a-form-item label="模版文件名：" :label-width="150" style="float: left; margin-left: 20px; margin-bottom: 10px">
            <a-input style="width: 220px; margin-left: 14px" v-model:value="paramsObject.templateModuleNum"
              class="ivu-input" disabled />
            <a-input style="width: 220px; display: none" v-model:value="paramsObject.templateModuleType"
              class="ivu-input" />
          </a-form-item>
        </div>
        <div style="width: 600px">
          <a-form-item label="新模型文件名：" :label-width="150" style="float: left; margin-left: 20px; margin-bottom: 10px">
            <a-input style="width: 220px" v-model:value="paramsObject.inputVal" class="ivu-input" disabled />
            <a-button type="primary" style="margin-left: 20px" @click="applyPieceNumber">申请件号</a-button>
            <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="makeModule">打开模型</a-button>
          </a-form-item>
        </div>
      </a-form>

      <div class="flex-1 h-0 mt-[5px] relative">
        <a-table bordered :scroll="{ x: 500, y: '100%' }" :pagination="false" row-key="id" :data-source="parmDesignData"
          :columns="parmDesignColumn" :row-selection="rowSelection"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')" class="h-full custom-flex-table">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'parameterValue'">
              <a-input v-model:value="record.parameterValue" style="width: 100px" />
            </template>
          </template>
        </a-table>
      </div>

      <div class="w-full mt-[16px]">
        <a-button type="primary" class="btnSty" @click="setModuleParameter">再生模型</a-button>
        <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="getModuleParameter">同步模型数据</a-button>
        <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="resetParm">重置参数</a-button>
        <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="saveParm">保存</a-button>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="cancel">关闭</a-button>
    </template>
  </a-modal>
</template>
<style lang="less" scoped>
:deep(.ant-modal-body) {
  padding: 16px;
}

.custom-flex-table {
  height: 100%;

  :deep(.ant-spin-nested-loading),
  :deep(.ant-spin-container),
  :deep(.ant-table),
  :deep(.ant-table-container) {
    height: 100%;
  }

  :deep(.ant-table-container) {
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table-body) {
    flex: 1;
    overflow-y: auto !important;
    max-height: none !important;
  }
}
</style>
