<template>
  <div class="select">
    <div v-show="imgList.coverImagePath" class="selectTop">
      <div class="selectTop-shadow"></div>
      <img class="selectTop-img" :src="imgList.coverImagePath" alt="" />
      <div class="selectTop-text">{{ imgList.proname }}</div>
    </div>
    <a-form ref="ruleFormRef" class="elForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <div style="flex-direction: column; align-items: flex-end; min-width: 30vw">
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; margin-bottom: 10px">
          <span style="min-width: 160px; text-align: right">{{ imgList.proname + '编号：' }}</span>
          <a-input v-model:value="proId" :disabled="inputDis" allow-clear style="width: 300px" @input="lisCalcName" />
          <a-button style="margin-left: 20px" type="primary" @click="viewData">
            <EpcIcon type="icon-liulan" style="font-size: 18px" />
            浏览
          </a-button>
        </div>

        <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; margin-bottom: 10px">
          <span style="min-width: 160px; text-align: right">{{ imgList.proname + '名称：' }}</span>
          <a-input v-model:value="calcId" :disabled="inputDis" allow-clear style="width: 300px" />
          <a-button style="width: 93px; visibility: hidden"></a-button>
        </div>

        <div style="width: 500px; text-align: center; margin-left: 40px">
          <a-button style="width: 80px; height: 32px" :disabled="save" :loading="loading" type="primary" @click="saveFun">
            <EpcIcon type="icon-baocun" style="font-size: 15px" />
            保存
          </a-button>
          <a-button :disabled="next" type="primary" class="elForm-button" @click="nextFun" style="margin: 0 8px">
            <EpcIcon type="icon-paixujiantou" style="font-size: 12px" />
            下一步
          </a-button>
          <a-button type="primary" @click="backFun">
            <EpcIcon type="icon-fanhui" style="font-size: 12px" />
            返回
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
  <a-modal class="dialog" v-model:visible="dialogVisible" :title="modalTitle" width="70%" :mask-closable="false" @cancel="dialogVisible = false">
    <a-form class="dialog-form" layout="inline">
      <a-form-item class="dialog-form-item" label="计算编号：">
        <a-input v-model:value="DiaProNum" allow-clear style="width: 220px"></a-input>
      </a-form-item>
      <a-form-item class="dialog-form-item" label="计算名称：">
        <a-input v-model:value="DiaProName" allow-clear style="width: 220px"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="getCalcData">
          <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
          查询
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" danger :disabled="selectedRowList.length === 0" @click="delData">
          <EpcIcon type="icon-shanchu" style="font-size: 12px" />
          删除
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="handleReset"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />{{ $t('重置') }} </a-button>
      </a-form-item>
    </a-form>

    <a-table
      v-show="dialogVisible"
      :dataSource="tableData"
      :pagination="pagination"
      :columns="columns"
      :row-key="record => record.id"
      :row-selection="rowSelection"
      :customRow="customRow"
      :locale="locale"
      bordered
      style="width: 100%; margin-top: 20px"
      :sticky="true"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'addTime'">
          {{ formatWithIntl(record.addTime) }}
        </template>
      </template>
    </a-table>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="confirm()"> 确定 </a-button>
        <a-button @click="cancel">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useRouter } from 'vue-router';
import Empty from '@/components/Empty/index.vue';
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';
import { CheckTemplatePageRequestDTOModel } from '@/api/models/checkTemplate/CheckTemplatePageRequestDTOModel';
import { sortermethod } from '@/utils/tools';
import { encryptValue } from '@/utils';
const props = defineProps({
  imgList: {
    require: false,
    type: Object,
    default: () => {},
  },
  formKeyData: {
    require: false,
    type: Array,
    default: () => [],
  },
  showHide: {
    type: Boolean,
    required: true,
  },
});
const router = useRouter();
const ruleFormRef = ref(null);
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const DiaProName = ref();
const DiaProNum = ref();
const proId = ref();
const calcId = ref();
const referencePlan = ref('');
const save = ref(true);
const next = ref(true);
const pageSize = ref(10);
const pageNum = ref(1);
const inputDis = ref(false);
const diaFlag = ref();
const emit = defineEmits(['OnBackFun']);
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
const requestParams = reactive(new CheckTemplatePageRequestDTOModel());
const { pagination } = usePagination(requestParams, getCalcData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const columns = reactive([
  {
    title: '计算编号',
    dataIndex: 'identification',
    key: 'identification',
    sorter: (a: any, b: any) => sortermethod(a.identification, b.identification),
    width: 180,
  },
  {
    title: '计算名称',
    dataIndex: 'projectName',
    key: 'projectName',
    sorter: (a: any, b: any) => sortermethod(a.projectName, b.projectName),
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'userName',
    key: 'userName',
    sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
  },
  {
    title: '创建时间',
    key: 'addTime',
    dataIndex: 'addTime',
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
  },
]);
/**
 * @description 清除搜索
 */
function handleReset() {
  DiaProNum.value = '';
  DiaProName.value = '';
  pagination.current = 1;
  getCalcData();
}
// 模态框标题
const modalTitle = computed(() => (diaFlag.value === 1 ? '选择历史计算' : '选择计算'));

const lisCalcName = async () => {
  console.log(proId.value);
  let data: any = {
    identification: proId.value,
    checkPageInfoId: props.imgList.proId,
  };
  const res = await AdminApiSystemCheckFlowInfoApi.checkIdentificationUnique(data);
  console.log(res);
  if (res.data.data) {
    save.value = false;
    next.value = true;
  } else {
    message.warning('编号重复，请修改！');
    save.value = true;
    next.value = true;
  }
};

/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}

// 获取主列表浏览接口
async function getCalcData() {
  const params: any = {
    pageSize: requestParams.pageSize,
    pageNum: requestParams.pageNo,
    projectName: DiaProName.value || null,
    identification: DiaProNum.value || null,
    userId: useUserStore().getUser.id,
    checkPageInfoId: props.imgList.proId ? props.imgList.proId : null,
  };

  const res = await AdminApiSystemCheckFlowInfoApi.getCalculateList(params);
  tableData.value = res.data.data.result;
  pagination.total = res.data.data.pageCount;
}

function formatWithIntl(dateString: any) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
const viewData = () => {
  selectedRowList.value = [];
  selectedRowkeys.value = [];
  getCalcData();
  dialogVisible.value = true;
  diaFlag.value = 0;
};

// 点击保存
const saveFun = async () => {
  selectedRowList.value = [];
  selectedRowkeys.value = [];
  if (proId.value == '') {
    message.warning('请输入计算编号');
    save.value = true;
    return;
  }
  if (calcId.value == '') {
    message.warning('请输入计算名称');
    save.value = true;
    return;
  }
  const params = {
    projectName: calcId.value,
    identification: proId.value,
    userId: useUserStore().getUser.id,
    checkPageInfoId: props.imgList.proId,
    projectState: 0, // 0未开始  1设计中
    formKeys: props.formKeyData,
    id: null,
  };
  console.log(params);
  const res = await AdminApiSystemCheckFlowInfoApi.saveOrUpdateCalculate(params);
  if (res.data.data) {
    message.success('保存成功');
    getCalcData();
    flagStatus.value.id = res.data.data.id;
    updateData(flagStatus.value.id);
    save.value = true;
    next.value = false;
  } else {
    message.error('保存失败');
  }
  console.log(res);
};

async function updateData(id: any) {
  const params = {
    id: id,
    projectState: String(1),
  };
  const res = await AdminApiSystemCheckFlowInfoApi.updateCalculateProjectState(params);
}
// 下一步
const nextFun = () => {
  debugger;
  // 不走弹窗的操作，直接保存点击下一步 flagStatus.value
  if (flagStatus.value.id) {
    router.push({
      path: '/home/calcpage',
      query: {
        parms: encryptValue(JSON.stringify(props.imgList)),
        selectPageData: encryptValue(JSON.stringify(flagStatus.value)),
        formKeyData: encryptValue(JSON.stringify(props.formKeyData)),
        calcId: encryptValue(calcId.value),
        proId: encryptValue(proId.value),
      },
    });
    updateData(flagStatus.value.id);
    setTimeout(() => {
      clearData();
      emit('OnBackFun', true);
    }, 900);
  }
  if (selectedRowList.value.length > 0) {
    router.push({
      path: '/home/calcpage',
      query: {
        parms: encryptValue(JSON.stringify(props.imgList)),
        selectPageData: encryptValue(JSON.stringify(selectedRowList.value[0])),
        formKeyData: encryptValue(JSON.stringify(props.formKeyData)),
        calcId: encryptValue(calcId.value),
        proId: encryptValue(proId.value),
      },
    });
    updateData(selectedRowList.value[0].id);
    tableData.value.map((v: any) => {
      if (v.id === selectedRowList.value[0].id) {
        v.projectState = '1';
      }
    });
    setTimeout(() => {
      clearData();
      emit('OnBackFun', true);
    }, 900);
  }
};

// 返回上一步
const backFun = () => {
  clearData();
  emit('OnBackFun', true);
  loading.value = false;
};

// 数据删除
const delData = async () => {
  if (selectedRowList.value.length == 0) {
    message.warning('请选择数据进行删除');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `是否确认删除数据项?`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const params = {
        idList: selectedRowList.value,
      };
      const res = await AdminApiSystemCheckFlowInfoApi.deleteCheckPageCalculates(params);
      message.info('删除成功');
      getCalcData();
      save.value = true;
      next.value = false;
      selectedRowList.value = [];
      selectedRowkeys.value = [];
    },
    onCancel() {
      message.warning('取消删除');
    },
  });
};

const flagStatus = ref<any>({
  id: '',
});
// 弹窗确认
const confirm = () => {
  console.log(selectedRowList.value);
  if (selectedRowList.value.length == 1) {
    dialogVisible.value = false;
    DiaProName.value = '';
    DiaProNum.value = '';
    proId.value = selectedRowList.value[0].identification;
    calcId.value = selectedRowList.value[0].projectName;
    referencePlan.value = selectedRowList.value[0].identification;
    flagStatus.value.id = '';
    if (proId.value && calcId.value) {
      next.value = false;
      save.value = true;
    }
    inputDis.value = false;
  } else {
    message.warning('请选择一条数据');
  }
};

// 弹窗取消
const cancel = () => {
  dialogVisible.value = false;
  DiaProName.value = '';
  DiaProNum.value = '';
};

// 清空数据
const clearData = () => {
  proId.value = '';
  calcId.value = '';
  referencePlan.value = '';
};
</script>

<style lang="less" scoped>
.select {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.selectTop {
  position: relative;
  width: 400px;
  height: 250px;
  &-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 250px;
  }
  &-img {
    width: 400px;
    height: 250px;
  }

  &-text {
    text-align: center;
    margin-bottom: 10px;
  }
}

.status {
  display: flex;
}
.start {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  margin-top: 10px;
  margin-right: 5px;
  background-color: red;
}
.degsin {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  margin-top: 10px;
  margin-right: 5px;
  background-color: orange;
}
.complate {
  height: 5px;
  width: 5px;
  border-radius: 50%;
  margin-top: 10px;
  margin-right: 5px;
  background-color: green;
}

.elForm {
  margin-top: 48px;
}

.dialog {
  &-form {
    display: flex;

    &-item {
      margin-right: 20px;
    }
  }
}

.pagetion {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.disBgc {
  background-color: #ccc !important;
  color: #fff !important;
  border: none !important;
}
.bgc {
  background-color: #1890ff !important;
  color: #fff !important;
}
.disBgc:hover {
  background-color: #ccc !important;
  color: #fff !important;
  border: none !important;
}
.bgc:hover {
  background-color: #1890ff !important;
  color: #fff !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f4f4f4 !important;
  color: #000;
}
:deep(.ant-table-cell) {
  padding: 8px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
