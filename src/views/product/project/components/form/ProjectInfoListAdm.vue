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
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
const addOrUpdateModel = ref<any>(null);

const userStore = useUserStore();
const loading = ref<boolean>(false);
const categoryid = ref<string>('');
/** 是否显示 新增 / 编辑 弹窗 */
const visibleNoticeEditor = ref<boolean>(false);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'title',
    key: 'title',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.title, b.title),
    width: 200,
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.type, b.type),
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
    title: WeiI18n.$t('创建人'),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    resizable: true,
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.type, b.type),
  },
  {
    title: WeiI18n.$t('项目负责人'),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    resizable: true,
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.type, b.type),
  },
  {
    title: WeiI18n.$t('计划开始时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    resizable: true,
    width: 150,
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
    title: WeiI18n.$t('计划完成时间'),
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    resizable: true,
    width: 150,
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
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 220,
  },
  {},
]);
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

// onMounted(() => {
//   getResources();
// });

function handleResizeColumn(w, col) {
  col.width = w;
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

function getResourcesByParent(categoryids: any) {
  alert(categoryids);
  categoryid.value = categoryids;
  getResources();
}



defineExpose({ getResourcesByParent });

</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '70px' } }" :model="requestParams">
        <a-input v-model:value="requestParams.title" style="width: 220px" allow-clear :placeholder="$t('请输入项目编号')" />
        <a-input v-model:value="requestParams.title" style="width: 220px;margin-left: 20px;" allow-clear :placeholder="$t('请输入项目名称')" />
        <a-select allowClear style="width: 220px;margin-left: 20px;" :placeholder="$t('请选择项目类型')"> 
          <a-select-option value="1"> {{ $t('待启动') }} </a-select-option>
          <a-select-option value="2"> {{ $t('工作中') }} </a-select-option>
          <a-select-option value="3"> {{ $t('已完成') }} </a-select-option>
        </a-select>
        <a-form-item style="margin-left: 15px">
          <a-button type="primary" @click="handleFinish"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }} </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="noticeAdd(undefined)">
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
  display: block !important;
  width: 100% !important;
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
