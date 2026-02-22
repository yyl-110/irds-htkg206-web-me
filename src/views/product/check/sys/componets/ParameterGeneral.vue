<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref } from 'vue';
import { TableProps, Modal, Button, Popconfirm, message } from 'ant-design-vue';
import { getCurrentInstance } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { parameterDictionaryRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
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
  selectedRowkeys.value = [];
  selectedRowList.value = [];
  return props.modalVisible;
});
const loading = ref<boolean>(false);
const instance = getCurrentInstance();
const userStore = useUserStore();
const columns = ref([
  {
    title: '参数名称',
    key: 'parameterName',
    dataIndex: 'parameterName',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '参数代号',
    key: 'parameterNum',
    dataIndex: 'parameterNum',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '参数类型',
    key: 'parameterTypeStr',
    dataIndex: 'parameterTypeStr',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '单位',
    key: 'cmpany',
    dataIndex: 'cmpany',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '所属分类',
    key: 'categoryName',
    dataIndex: 'categoryName',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '创建人',
    key: 'username',
    dataIndex: 'username',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '创建时间',
    key: 'addTime',
    dataIndex: 'addTime',
    align: 'center',
    resizable: true,
    width: 100,
  },
]);
const dataSource = ref<any[]>([]);
const requestParams = reactive(new parameterDictionaryRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    // 单选模式
    type: 'radio',
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      // 只保留第一条选中数据，确保单选
      selectedRowList.value = selectedRows && selectedRows.length > 0 ? [selectedRows[0]] : [];
      selectedRowkeys.value = selectedRowKeys && selectedRowKeys.length > 0 ? [selectedRowKeys[0]] : [];
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      if (record.id == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.id);
        selectedRowList.value.push(record);
      }
    },
  };
}
function selectParameterb() {
  getListData();
}
const typeid = ref('');
function handlegetData(categoryid: string) {
  typeid.value = categoryid;
  getListData();
}
async function getListData() {
  try {
    loading.value = true;
    requestParams.userid = userStore.getUser.id;
    requestParams.categoryid = typeid.value;
    requestParams.organizationID = '';
    requestParams.currentPage = requestParams.pageNo;
    // requestParams.pageid = pageid;
    const res = await AdminApiSystemModule.getTempalteParaInfoList({ ...requestParams });
    if (res.data.code == 0) {
      dataSource.value = res.data.data.data || [];
      pagination.total = res.data.data.pageCount || 0;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
/**
 * @description 点击确认
 */
async function handleSave() {
  if (selectedRowList.value.length > 0) {
    emit('handleSave', selectedRowList.value[0]);
  } else {
    message.warning('请选中要操作的数据');
  }
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
function handleClear() {
  requestParams.parameterName = '';
  requestParams.parameterNum = '';
  getListData();
}
defineExpose({
  handlegetData,
});
</script>

<template>
  <a-modal v-model:visible="visible" style="width: 80%" @cancel="cancel" :ok-text="false" :confirm-loading="$isPending()" :mask-closable="false" :title="$t('参数字典')">
    <div>
      <span>参数名称：</span>
      <a-input v-model:value="requestParams.parameterName" allowClear placeholder="请输入参数名称" style="width: 220px"></a-input>
      <span style="margin-left: 10px">参数代号：</span>
      <a-input v-model:value="requestParams.parameterNum" allowClear placeholder="请输入参数代号" style="width: 220px" />
      <a-button type="primary" style="margin-left: 15px" @click="selectParameterb"><EpcIcon type="icon-fangdajing" style="font-size: 12px" /> 查询 </a-button>
      <a-button style="margin-left: 10px" @click="handleClear">
        <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
        {{ $t('重置') }}
      </a-button>
    </div>
    <a-table
      bordered
      :loading="loading"
      style="margin-top: 5px"
      :scroll="{ x: 600, y: 450 }"
      :pagination="pagination"
      row-key="id"
      :data-source="dataSource"
      :columns="columns"
      :row-selection="rowSelection"
      :customRow="customRow"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }"> </template>
    </a-table>
    <template #footer>
      <a-button type="primary" @click="handleSave">确定</a-button>
      <a-button @click="emit('onClose', false)">取消</a-button>
    </template>
  </a-modal>
</template>
<style lang="less" scoped></style>
