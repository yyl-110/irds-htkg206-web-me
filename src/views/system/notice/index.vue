<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { useRender } from '@/components/escape';
import { NoticePageRequestDTOModel } from '@/api/models/notice/NoticePageRequestDTOModel';
import { AdminApiSystemNotice } from '@/api/tags/notice/管理后台公告';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import NoticeDetail from './components/notice-detail.vue';
import NoticeAddOrUpdate from './components/notice-addorupdate.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
const powerModel = ref<any>(null);
const addOrUpdateModel = ref<any>(null);

const userStore = useUserStore();
const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);
/** 是否显示 新增 / 编辑 弹窗 */
const visibleNoticeEditor = ref<boolean>(false);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('公告名称'),
    dataIndex: 'title',
    key: 'title',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.title, b.title),
    width: 490,
  },
  {
    title: WeiI18n.$t('类型'),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.type, b.type),
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
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
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 180,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 220,
  },
  {},
]);
const { dateRange, dateRangeParams } = useDateRangeParams();
/** 列表请求参数 */
const requestParams = reactive(new NoticePageRequestDTOModel());
requestParams.releaseFlag = 0;
requestParams.userid = userStore.getUser.id;
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getResources);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const resources = ref<Array<NoticeInfoRequestDTOModel>>([]);

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
  visibleNoticeEditor.value = false;
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await AdminApiSystemNotice.getNoticePageList({
      ...requestParams,
    });
    console.log(res);
    resources.value = res.data.data.list || [];
    pagination.total = res.data?.data.total;
  } finally {
    loading.value = false;
  }
}
/**
 * 详情查看页面
 */
async function seeDetailFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
  let data = res.data.data.systemNoticeInfoBaseDTO;
  let filedata = res.data.data;
  powVisible.value = true;
  nextTick(() => {
    powerModel.value.getDetailFromMain(data, filedata);
  });
}

/**
 * 发布公告
 */
async function pushFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.noticeRelease({ ...requestParams });
  nextTick(() => {
    //发布成功刷新页面
    message.success(WeiI18n.$t('发布成功'));
    getResources();
  });
}

/**
 * 撤销发布
 */
async function goBackPushFun(id: string) {
  requestParams.id = id;
  const res = await AdminApiSystemNotice.goBackNotice({ ...requestParams });
  nextTick(() => {
    //撤销成功刷新页面
    message.success(WeiI18n.$t('撤销成功'));
    getResources();
  });
}

/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: string) {
  await AdminApiSystemNotice.deleteNotice({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
  //   },
  // })
}

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
 * 添加数据和编辑页面
 */
async function noticeAdd(record?: any) {
  visibleNoticeEditor.value = true;
  if (record) {
    requestParams.id = record.id;
    const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
    console.log(res);
    let data = res.data.data.systemNoticeInfoBaseDTO;
    let filedata = res.data.data;
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(data, filedata);
    });
  } else {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate();
    });
  }
}
function handleFinish() {
  getResources();
}
function handleReset() {
  requestParams.title = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '70px' } }" :model="requestParams">
        <a-input v-model:value="requestParams.title" style="width: 220px" allow-clear :placeholder="$t('请输入公告名称')" />
        <a-form-item style="margin-left: 15px">
          <a-button type="primary" @click="handleFinish"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }} </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="noticeAdd(undefined)">
            <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
            {{ $t('添加') }}
          </a-button>
        </a-form-item>
        <!-- <a-form-item>
          <a-button @click="handleReset"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />{{ $t('重置') }} </a-button>
        </a-form-item> -->
      </a-form>
    </a-card>

    <a-card class="mt-[10px] b-body2">
      <a-table
        :scroll="{ x: 1200 }"
        :row-key="(record: any) => record.id"
        :columns="columns"
        :locale="locale"
        :data-source="resources"
        :pagination="pagination"
        @resizeColumn="handleResizeColumn"
        :loading="loading"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <span>
              <span v-if="record.type === '1'"> {{ $t('富文本') }}</span>
              <span v-else>{{ $t('附件') }}</span>
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status === '0'">{{ $t('未发布') }}</a-tag>
              <a-tag v-else-if="record.status === '1'" color="blue">{{ $t('已发布') }}</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a @click="seeDetailFun(record.id)">{{ $t('查看') }}</a>
            <a-divider type="vertical" />
            <a @click="noticeAdd(record)">{{ $t('编辑') }}</a>

            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a v-if="record.status === '0'" @click="pushFun(record.id)">{{ $t('发布') }}</a>
            <a v-else @click="goBackPushFun(record.id)">{{ $t('撤销') }}</a>
          </template>
          <!-- <template v-else>
          {{ column.dataIndex }}
        </template> -->
        </template>
      </a-table>
      <NoticeAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
      <NoticeDetail ref="powerModel" :modal-visible="powVisible" @refreshtabledata="getResources" @close="handleClosePowModal" />
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
