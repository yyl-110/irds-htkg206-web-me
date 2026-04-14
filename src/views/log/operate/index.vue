<script setup lang="ts">
import { Modal, Switch, TableProps, message } from 'ant-design-vue';
import { ref } from 'vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { OperateLogSearchDTOModel } from '@/api/models/log/OperateLogSearchDTOModel';
import { AdminApiLog } from '@/api/tags/管理后台日志管理';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450);
const loading = ref(false);
/** 列表请求参数 */
const requestParams = reactive(new OperateLogSearchDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 表格列属性 */
const columns = ref<computed<any>[]>([
  {
    title: WeiI18n.t('操作用户').value,
    dataIndex: 'username',
    key: 'username',
    width: 300,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.username, b.username),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作模块').value,
    dataIndex: 'moduleName',
    key: 'moduleName',
    width: 400,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.moduleName, b.moduleName),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作类型').value,
    dataIndex: 'logType',
    key: 'logType',
    width: 300,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.logType, b.logType),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    width: 300,
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    sortDirections: ['descend', 'ascend'],
  },
  {},
]);

/** 数据 定义 */
const dataSource = ref<Array<any>>([]);

/** 表单对象 */
const formRef = ref();
/** 时间对象 */
const dateRangeParams = ref([]);

/** 表单样式 label对象 */
const labelCol = ref({ style: { width: '100px' } });

/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });

/**
 * @description 获取数据列表
 */
async function getListData() {
  if (dateRangeParams.value && dateRangeParams.value.length > 0) {
    requestParams.createTime = dateRangeParams.value;
  }
  requestParams.userName = requestParams.userName; // 查询条件用户名称
  requestParams.moduleName = requestParams.moduleName; // 操作模块
  loading.value = true;
  try {
    const res = await AdminApiLog.getOperateLogPageList(requestParams);
    if (res.data.code === 200) {
      dataSource.value = res.data.data?.records || [];
      pagination.total = res.data.data?.total;
    }
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getListData();
});

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/**
 * @description 重置搜索条件
 */
function handleReset() {
  dateRangeParams.value = [];
  requestParams.userName = '';
  requestParams.moduleName = '';
  formRef.value.resetFields();
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}

function handleResizeColumn(w, col) {
  col.width = w;
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <!-- 强制不换行，按钮会跟在查询后面；视口窄时可横向滚动 -->
      <a-form
        ref="formRef"
        class="form_css"
        layout="inline"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="requestParams"
        style="display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; overflow-x: auto">
        <a-form-item name="name">
          <a-input v-model:value="requestParams.userName" style="width: 220px; text-align: left" :placeholder="$t('请输入操作用户')" />
        </a-form-item>
        <a-form-item name="module">
          <a-input v-model:value="requestParams.moduleName" style="width: 220px; text-align: left" :placeholder="$t('请输入操作模块')" />
        </a-form-item>
        <a-form-item name="createTime">
          <a-range-picker
            v-model:value="dateRangeParams"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 340px; text-align: left"
            :placeholder="[$t('请选择开始日期'), $t('请选择结束日期')]" />
        </a-form-item>
        <a-form-item style="display: inline-flex; align-items: center; gap: 8px">
          <a-button @click="handleFinish" type="primary">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <!-- <a-button @click="handleReset" style="margin-left: 8px">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />
            {{ $t('重置') }}
          </a-button> -->
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 10px" class="b-body">
      <a-table
        :scroll="{ x: 1200 }"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :locale="locale"
        :data-source="dataSource"
        :columns="columns"
        @resizeColumn="handleResizeColumn"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div style="height: 22px; display: flex; align-items: center" />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.calclation-content {
  width: 100%;
  padding: 10px 20px 15px 20px;
  text-align: left;
  color: #222222;
  height: 80px;
  background: #fff;
}

// :deep(.ant-table-column-sorters) {
//   justify-content: center;
//   align-items: flex-end;
// }

// :deep(.ant-table-column-title) {
//   flex: none;
// }

/* 保底：确保 form_css 不换行（跟上面 inline style 双保险） */
.form_css {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.form_css ::v-deep(.ant-form-item) {
  margin-bottom: 0;
  white-space: nowrap;
}
</style>
