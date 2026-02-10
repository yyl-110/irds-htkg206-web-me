<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import productHome from './components/productHome.vue';
import DemandDetail from './components/product-detail.vue';
import DemandAddUpdate from './components/product-add-update.vue';
import { TableColumnType, TableProps, Modal } from 'ant-design-vue';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
import { productSpeciListPage } from '@/api/models/productSpecification/productSpecificationPage';
const userStore = useUserStore();
const AddUpdateVisible = ref<boolean>(false);
const DetailVisible = ref<boolean>(false);
const Hoemflag = ref<boolean>(false);
const loading = ref<boolean>(false);
const designData = ref([]); // 系列设计列表数据
const designKeywords = ref(''); // 设计列表模糊名称搜索
const designCode = ref(''); // 设计列表模糊code搜索
const RefAddUpdate = ref();
const RefDetail = ref();
// 规划年度
const planYear = ref();
// 规划季度
const planQuarter = ref();
/** 列表请求参数 */
const requestParams = reactive(new productSpeciListPage());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getInfoPage);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '120px', marginTop: '50px' },
  }),
});
const columns = ref<TableColumnType[]>([
  {
    title: WeiI18n.t('序号').value,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    customRender({ text, record, index }) {
      return h(
        'div',
        {
          style: 'display: flex;justify-content: flex-start;align-items: center;',
        },
        [h('span', { innerText: index + 1 })],
      );
    },
  },
  {
    title: WeiI18n.$t('产品规划编号'),
    dataIndex: 'planCode',
    key: 'planCode',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planCode, b.planCode),
    width: 120,
  },
  {
    title: WeiI18n.$t('产品规划名称'),
    dataIndex: 'planName',
    key: 'planName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planName, b.planName),
    width: 160,
  },
  {
    title: WeiI18n.$t('发起人'),
    dataIndex: 'initiatorName',
    key: 'initiatorName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.initiatorName, b.initiatorName),
    width: 120,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('计划开始时间'),
    dataIndex: 'planStartTime',
    key: 'planStartTime',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planStartTime, b.planStartTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('计划完成时间'),
    dataIndex: 'planCompleteTime',
    key: 'planCompleteTime',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planCompleteTime, b.planCompleteTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('实际开始时间'),
    dataIndex: 'actualStartTime',
    key: 'actualStartTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actualStartTime, b.actualStartTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('实际完成时间'),
    dataIndex: 'actualEndTime',
    key: 'actualEndTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.actualEndTime, b.actualEndTime),
    width: 120,
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 130,
  },
  {
    title: WeiI18n.$t('当前阶段'),
    dataIndex: 'planPhase',
    key: 'planPhase',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.planPhase, b.planPhase),
    width: 180,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 200,
    fixed: 'right',
  },
]);

/** 删除按钮状态 */
const deleteFlag = computed(() => {
  let flag = true;
  if (selectedRowList.value.length > 0) {
    flag = false;
    for (const item of selectedRowList.value) {
      if (item.status != 0) {
        flag = true;
        break;
      }
    }
  }
  return flag;
});
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
// 模糊搜索系列
function serialSearch() {
  getInfoPage();
}
// 获取设计列表数据
async function getInfoPage() {
  loading.value = true;
  try {
    requestParams.keywords = designKeywords.value;
    // requestParams.currentPage = requestParams.pageNo;
    // requestParams.numberPage = requestParams.pageSize;
    requestParams.planYear = planYear.value;
    requestParams.planQuarter = planQuarter.value;
    const res = await AdminApiSystemProductSpecification.productPlanPage({
      ...requestParams,
    });
    designData.value = res.data.data.list || [];
    pagination.total = res.data.data.pageCount;
  } finally {
    loading.value = false;
  }
}

function handleResizeColumn(w: any, col: any) {
  col.width = w;
}

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}

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
// 多选点击行选择
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

async function deleteInfo() {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除所选内容吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      let infoDel: any = [];
      selectedRowkeys.value.forEach(item => {
        infoDel.push(item);
      });
      const res = await AdminApiSystemProductSpecification.batchDelete(infoDel);
      if (res.data.code == 200) {
        selectedRowList.value = [];
        selectedRowkeys.value = [];
        getInfoPage();
        message.success('删除成功!');
      } else {
        message.success('删除失败。');
      }
    },
  });
}

function handleAdddemand(row: any, type: any) {
  nextTick(() => {
    RefAddUpdate.value?.handleModalAddOrUpdate(row, type);
  });
  AddUpdateVisible.value = true;
}

function handleDetaildemand(row: any, type: any) {
  nextTick(() => {
    RefDetail.value?.handleModalAddOrUpdate(row, type);
  });
  DetailVisible.value = true;
}

function onClose(trueOrFalse: any) {
  AddUpdateVisible.value = trueOrFalse;
  if (trueOrFalse) {
    getInfoPage();
  }
}
function onCloseDetail(trueOrFalse: any) {
  DetailVisible.value = trueOrFalse;
}
function disabledoperation(record: any) {
  return record.initiatorName !== userStore.getUser.nickname;
}
function resetTable(value: string) {
  designKeywords.value = '';
  getInfoPage();
}
function Enterquarterlylist(item: any, ite: any) {
  planYear.value = ite.planYear;
  planQuarter.value = ite.planQuarter;
  getInfoPage();
  Hoemflag.value = true;
}
function oncancel() {
  Hoemflag.value = false;
}
onMounted(() => {
  Hoemflag.value = false;
});
function ADDdisabled() {
  return designData.value.length > 0;
}
defineExpose({});
</script>

<template>
  <div v-if="Hoemflag">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-input v-model:value="designKeywords" style="width: 220px; margin-right: 10px" placeholder="请输入编号或名称" allowClear />
          <a-button type="primary" @click="serialSearch"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" /> {{ $t('查询') }}</a-button>
          <a-button @click="resetTable" style="margin-left: 15px">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button>
          <a-button type="primary" :disabled="ADDdisabled()" @click="handleAdddemand('', false)" style="margin-left: 15px">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('新建') }}
          </a-button>
          <a-button type="primary" danger :disabled="deleteFlag" @click="deleteInfo()" style="margin-left: 15px">
            <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
            {{ $t('删除') }}
          </a-button>
          <a-button type="primary" @click="oncancel()" style="margin-left: 15px">
            <EpcIcon type="icon-fanhui-copy" style="font-size: 12px" />
            {{ $t('返回') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="designData"
        :locale="locale"
        :pagination="pagination"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-selection="rowSelection"
        :customRow="customRow"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status == 0">{{ $t('未开始') }}</a-tag>
              <a-tag v-else-if="record.status == 1" color="#e6a23c">{{ $t('进行中') }}</a-tag>
              <a-tag v-else-if="record.status == 2" color="#67c23a">{{ $t('已完成') }}</a-tag>
            </span>
          </template>
          <template v-if="column.dataIndex === 'planPhase'">
            <span>
              <span v-if="record.planPhase == '1'">定义产品组合清单</span>
              <span v-else-if="record.planPhase == '2'">定义产品组合策略</span>
              <span v-else-if="record.planPhase == '3'">定义产品周期规划</span>
            </span>
          </template>

          <template v-if="column.dataIndex === 'operation'">
            <a-button shape="circle" type="link" @click="handleAdddemand(record, false)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button shape="circle" type="link" @click="handleDetaildemand(record, true)">详情</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
  <productHome v-else ref="RefproductHome" @Enterquarterlylist="Enterquarterlylist" @onClose="Hoemflag = false" />
  <DemandAddUpdate :planYear="planYear" :planQuarter="planQuarter" :modalVisible="AddUpdateVisible" ref="RefAddUpdate" @onClose="onClose" @reloadListData="getInfoPage" />
  <DemandDetail :modalVisible="DetailVisible" ref="RefDetail" @onClose="onCloseDetail" @reloadListData="getInfoPage" />
</template>

<style lang="less" scoped>
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
:deep(.ant-drawer-content-wrapper) {
  width: 300px !important;
}
:deep(.ant-drawer-body) {
  padding: 2px;
}
.menuLi {
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.85);
}
.menuLi:hover {
  margin-left: 5px;
  color: #165dff;
}
</style>
