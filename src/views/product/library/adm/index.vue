<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { LibraryPageRequestDTOModel } from '@/api/models/library/LibraryPageRequestDTOModel';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import Empty from '@/components/Empty/index.vue';
import LibraryAddOrUpdate from './libraryAddOrUpdate.vue';
import { sortermethod } from '@/utils/tools';
const powerModel = ref<any>(null);
const addOrUpdateModel = ref<any>(null);
const userStore = useUserStore();
const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);
const visibleNoticeEditor = ref<boolean>(false);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('基础库名称'),
    dataIndex: 'menuName',
    key: 'menuName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.menuName, b.menuName),
    width: 290,
  },
  {
    title: WeiI18n.$t('参数库类型'),
    dataIndex: 'categoryType',
    key: 'categoryType',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.categoryType, b.categoryType),
  },
  {
    title: WeiI18n.$t('资源库类型'),
    dataIndex: 'menuType',
    key: 'menuType',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.menuType, b.menuType),
  },
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'sort',
    key: 'sort',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 100,
    sorter: (a: any, b: any) => sortermethod(a.sort, b.sort),
  },
  {
    title: WeiI18n.$t('分类节点共用'),
    dataIndex: 'categoryName',
    key: 'categoryName',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
  },
  {
    title: WeiI18n.$t('发布状态'),
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
    fixed: 'right',
  },
]);
/** 列表请求参数 */
const requestParams = reactive(new LibraryPageRequestDTOModel());
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
    const res = await businessApiLibrary.getLibraryPageList({
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
async function seeDetailFun(record: any) {
  powVisible.value = true;
}
/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: number) {
  await businessApiLibrary.deleteLibrary({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
}

async function handleStatusChange(checked: any, record: any) {
  const data: any = {};
  data.id = record.id;
  if (checked) {
    data.status = 1;
  } else {
    data.status = 0;
  }
  const res = await businessApiLibrary.updateLibraryMenuStatus(data);
  if (checked) {
    message.success(WeiI18n.$t('发布成功'));
  } else {
    message.success(WeiI18n.$t('撤销成功'));
  }
  getResources();
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
async function libraryAdd(record?: any) {
  visibleNoticeEditor.value = true;
  if (record) {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(record, resources.value);
    });
  } else {
    nextTick(() => {
      addOrUpdateModel.value?.noticeInfoAddOrUpdate(undefined, resources.value);
    });
  }
}
function handleFinish() {
  getResources();
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '70px' } }" :model="requestParams">
        <a-input v-model:value="requestParams.menuName" style="width: 220px" allow-clear :placeholder="$t('请输入基础库名称')" />
        <a-form-item style="margin-left: 15px">
          <a-button type="primary" @click="handleFinish"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{ $t('查询') }} </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="libraryAdd(undefined)">
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

          <template v-else-if="column.dataIndex === 'categoryType'">
            <span>
              <span v-if="record.categoryType === 1"> {{ $t('固定列') }}</span>
              <span v-else-if="record.categoryType === 2"> {{ $t('自定义列') }}</span>
              <span v-else-if="record.categoryType === 3"> {{ $t('固定列+自定义列') }}</span>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'menuType'">
            <span>
              <span v-if="record.menuType === 1"> {{ $t('模块库') }}</span>
              <span v-else-if="record.menuType === 2"> {{ $t('UDF库') }}</span>
              <span v-else-if="record.menuType === 3"> {{ $t('列表数据类') }}</span>
              <span v-else-if="record.menuType === 4"> {{ $t('系统集成类') }}</span>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-switch :checked="record.status === 1" @change="checked => handleStatusChange(checked, record)" />
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a @click="libraryAdd(record)">{{ $t('编辑') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" v-if="record.categoryType !== 2" />
            <a @click="seeDetailFun(record)" v-if="record.categoryType !== 2">{{ $t('属性配置') }}</a>
          </template>
        </template>
      </a-table>
      <LibraryAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
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
