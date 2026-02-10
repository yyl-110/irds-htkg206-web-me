<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useRender } from '@/components/escape';
import { BoardPageRequestDTOModel } from '@/api/models/board/BoardPageRequestDTOModel';
import { AdminApiSystemBoard } from '@/api/tags/board/平台看板管理';
import { EpcIcon } from '@/components/icon/EpcIcon';
import type { BoardInfoRequestDTOModel } from '@/api/models/board/BoardInfoRequestDTOModel';
import AddOrUpdate from './components/board-addorupdate.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
const powerModel = ref<InstanceType<typeof BoardInfoRequestDTOModel>>();
const addOrUpdateModel = ref<InstanceType<typeof BoardInfoRequestDTOModel>>();

const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);

const reportIndex = ref<string>('');
const reportName = ref<string>('');

/** 是否显示 新增 / 编辑 弹窗 */
const visibleEditor = ref<boolean>(false);
const columns = ref<TableColumnType<BoardInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('报表名称'),
    dataIndex: 'reportName',
    key: 'reportName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.reportName, b.reportName),
    width: 490,
  },
  {
    title: WeiI18n.$t('报表区域'),
    dataIndex: 'reportIndex',
    key: 'reportIndex',
    align: 'center',
    resizable: true,
    width: 260,
    sorter: (a: any, b: any) => sortermethod(a.reportIndex, b.reportIndex),
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'addTime',
    dataIndex: 'addTime',
    align: 'center',
    resizable: true,
    width: 320,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
    /**
     * customRender
     * @param root0 params
     * @param root0.text text
     */
    customRender: ({ text }) => {
      return useRender.renderDateNoTime(text);
    },
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 350,
  },
]);
/** 列表请求参数 */
const requestParams = reactive(new BoardPageRequestDTOModel());

/** 列表数据 */
const resources = ref<Array<BoardInfoRequestDTOModel>>([]);
onMounted(() => {
  getResources();
});

function handleResizeColumn(w, col) {
  col.width = w;
}

function handleClosePowModal() {
  powVisible.value = false;
}

function handleCloseAddModal() {
  visibleEditor.value = false;
}

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

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.reportIndex = reportIndex;
    requestParams.reportName = reportName;
    const res = await AdminApiSystemBoard.getReportInfoList({
      ...requestParams,
    });
    resources.value = res.data.data.result || [];
  } finally {
    loading.value = false;
  }
}
/**
 * 详情查看页面
 */
// async function seeDetailFun(id: string) {
//   requestParams.id = id;
//   const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
//   powVisible.value = true;
//   nextTick(() => {
//     powerModel.value.getDetailFromMain(res.data.data.data, res.data.data.pdfFileName);
//   });
// }

/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: string) {
  await AdminApiSystemBoard.reportinfoDeleteReportInfo({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
}

/**
 * 添加数据和编辑页面
 */
function infoAdd(record?: any) {
  visibleEditor.value = true;
  nextTick(() => {
    addOrUpdateModel.value?.infoReload(record);
  });
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
        <a-form-item>
          <a-select placeholder="请选择报表区域" v-model:value="reportIndex" style="width: 200px" show-search allow-clear @change="getResources">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="5">5</a-select-option>
            <a-select-option value="6">6</a-select-option>
            <a-select-option value="7">7</a-select-option>
            <a-select-option value="8">8</a-select-option>
            <a-select-option value="9">9</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="请输入报表名称" v-model:value="reportName" allow-clear style="width: 220px" />
        </a-form-item>
        <a-form-item>
          <!-- v-hasPermi="['system:role:create']" -->
          <a-button type="primary" @click="getResources">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
            {{ $t('查询') }}
          </a-button>
          <a-button type="primary" @click="infoAdd(undefined)" style="margin-left: 15px">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="mt-[10px] b-body2">
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :data-source="resources"
        :pagination="false"
        @resizeColumn="handleResizeColumn"
        :locale="locale"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === '0'">{{ $t('未发布') }}</a-tag>
              <a-tag v-else-if="record.status === '1'" color="blue">{{ $t('已发布') }}</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a @click="infoAdd(record)">{{ $t('编辑') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
          </template>
          <!-- <template v-else>
          {{ column.dataIndex }}
        </template> -->
        </template>
      </a-table>
      <AddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleEditor" @refresh-table-data="getResources" @close="handleCloseAddModal" />
      <NoticeDetail ref="powerModel" :modal-visible="powVisible" @refresh-table-data="getResources" @close="handleClosePowModal" />
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}

.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.form_css .ant-form-item {
  margin-bottom: 20px;
}

// .user-selector-modal{
:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
