<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useDateRangeParams } from '@/hooks/useDate';
import { useRender } from '@/components/escape';
import { ProductTempPageRequestDTOModel } from '@/api/models/productTemp/ProductTempPageRequestDTOModel';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import ProductTempAddOrUpdate from './components/productTemp-addorupdate.vue';
import Empty from '@/components/Empty/index.vue';
import { sortermethod } from '@/utils/tools';
const addOrUpdateModel = ref<any>(null);

const userStore = useUserStore();
const loading = ref<boolean>(false);
/** 是否显示 新增 / 编辑 弹窗 */
const visibleNoticeEditor = ref<boolean>(false);
const visibleHistoryModal = ref<boolean>(false);
const historyLoading = ref<boolean>(false);
const historyList = ref<any[]>([]);
const columns = ref<TableColumnType<NoticeInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('模板编号'),
    dataIndex: 'tempNum',
    key: 'tempNum',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.tempNum, b.tempNum),
    width: 200,
  },
  {
    title: WeiI18n.$t('模板名称'),
    dataIndex: 'tempName',
    key: 'tempName',
    align: 'center',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.tempName, b.tempName),
  },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'versionNum',
    key: 'versionNum',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.versionNum, b.versionNum),
    width: 130,
    customRender: ({ record }: any) =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
        String('V' + (record.versionNum ?? '-') + '.0'),
        h(
          'a',
          {
            style: { cursor: 'pointer' },
            onClick: (e: Event) => {
              e && (e as Event).stopPropagation();
              showVersionHistory(record);
            },
            title: '查看历史版本',
          },
          h(EpcIcon, {
            type: 'icon-banbenlishi',
            style: { fontSize: '14px', color: '#1890ff' },
          }),
        ),
      ]),
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
    title: WeiI18n.$t('备注'),
    dataIndex: 'remarks',
    key: 'remarks',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 270,
    sorter: (a: any, b: any) => sortermethod(a.remarks, b.remarks),
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 250,
  },
  {},
]);
const { dateRange, dateRangeParams } = useDateRangeParams();
/** 列表请求参数 */
const requestParams = reactive(new ProductTempPageRequestDTOModel());
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

function handleCloseAddModal() {
  visibleNoticeEditor.value = false;
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;
    const res = await AdminApiProductTemp.getProductTempPageList({
      ...requestParams,
    });
    resources.value = res.data.data.list || [];
    pagination.total = res.data?.data.total;
  } finally {
    loading.value = false;
  }
}

async function showVersionHistory(record: any) {
  visibleHistoryModal.value = true;
  historyLoading.value = true;
  try {
    const data: any = {};
    data.tempId = record.id;
    const res = await AdminApiProductTemp.getHistoryList(data);
    historyList.value = (res?.data?.data || []).sort((a: any, b: any) => Number(b.versionNum || 0) - Number(a.versionNum || 0));
  } finally {
    historyLoading.value = false;
  }
}

function closeHistoryModal() {
  visibleHistoryModal.value = false;
}

function getVersionText(versionNum: string | number) {
  return `V${versionNum}.0`;
}

/**
 * 发布公告
 */
async function pushFun(id: string) {
  const data: any = {};
  data.id = id;
  data.status = 1;
  const res = await AdminApiProductTemp.goBackPushFun(data);
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
  const data: any = {};
  data.id = id;
  data.status = 0;
  const res = await AdminApiProductTemp.goBackPushFun(data);
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
async function handleDelete(id: any) {
  const data: any = {};
  data.id = id;
  await AdminApiProductTemp.productTempDelete(data);
  message.success(WeiI18n.$t('删除成功'));
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
async function noticeAdd(record?: any) {
  visibleNoticeEditor.value = true;
  if (record) {
    addOrUpdateModel.value?.noticeInfoAddOrUpdate(record);
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
  requestParams.pageNo = 1;
  pagination.current = 1;
  getResources();
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.productTemp-index');
}
</script>

<template>
  <div class="drawerContent">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '70px' } }" :model="requestParams">
        <a-input v-model:value="requestParams.tempNum" style="width: 220px" allow-clear :placeholder="$t('请输入模板编号')" />
        <a-input v-model:value="requestParams.tempName" style="width: 220px; margin-left: 10px" allow-clear :placeholder="$t('请输入模板名称')" />
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
          <template v-else-if="column.dataIndex === 'type'">
            <span>
              <span v-if="record.type === '1'"> {{ $t('富文本') }}</span>
              <span v-else>{{ $t('附件') }}</span>
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <span>
              <a-tag v-if="record.status == '0'">{{ $t('未发布') }}</a-tag>
              <a-tag v-else-if="record.status == '1'" color="blue">{{ $t('已发布') }}</a-tag>
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <a-button type="link" class="p-0" :disabled="record.status == '1'" @click="noticeAdd(record)">
              {{ $t('编辑') }}
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" :disabled="record.status == '1'" @confirm="handleDelete(record.id)">
              <a-button type="link" danger class="p-0" :disabled="record.status == '1'">
                {{ $t('删除') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm v-if="record.status == '0'" :title="`${$t('确定要发布吗')}?`" ok-text="确定" cancel-text="取消" @confirm="pushFun(record.id)">
              <a-button type="link" class="p-0">
                {{ $t('发布') }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm v-else :title="`${$t('确定要撤销发布吗')}?`" ok-text="确定" cancel-text="取消" @confirm="goBackPushFun(record.id)">
              <a-button type="link" class="p-0">
                {{ $t('撤销') }}
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-button v-if="record.status == '1'" type="link" class="p-0">
              {{ $t('浏览WBS结构') }}
            </a-button>
            <a-button v-else type="link" class="p-0">
              {{ $t('配置WBS结构') }}
            </a-button>
          </template>
        </template>
      </a-table>
      <ProductTempAddOrUpdate ref="addOrUpdateModel" :modal-visible="visibleNoticeEditor" @refreshtabledata="getResources" @close="handleCloseAddModal" />
    </a-card>
    <div class="productTemp-index" v-dragModal>
      <a-modal
        v-model:visible="visibleHistoryModal"
        :getContainer="customGetContainer"
        :title="$t('历史版本')"
        :width="760"
        :body-style="{ padding: '0' }"
        :mask-closable="false"
        :footer="null"
        @cancel="closeHistoryModal">
        <div class="history-modal-wrap">
          <div class="history-modal-content" v-if="!historyLoading">
            <div v-if="historyList.length" class="history-timeline">
              <div v-for="item in historyList" :key="item.id || item.versionNum" class="history-item">
                <div class="history-dot"></div>
                <div class="history-main">
                  <div class="history-version">{{ getVersionText(item.versionNum) }}</div>
                  <div class="history-card">
                    <div class="history-title">{{ item.tempName }} {{ item.tempNum }}</div>
                    <div class="history-meta">({{ item.creatorName || '-' }}) {{ item.createTime || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
            <a-empty v-else />
          </div>
          <div v-else class="history-loading-wrap">
            <a-spin />
          </div>
          <div class="history-footer">
            <a-button type="primary" @click="closeHistoryModal">{{ $t('关闭') }}</a-button>
          </div>
        </div>
      </a-modal>
    </div>
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

.history-modal-wrap {
  height: 620px;
  display: flex;
  flex-direction: column;
}

.history-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 0;
}

.history-timeline {
  padding-left: 16px;
  border-left: 2px solid #e8e8e8;
}

.history-item {
  position: relative;
  margin-bottom: 28px;
}

.history-dot {
  position: absolute;
  left: -23px;
  top: 42px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #20c997;
}

.history-version {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.history-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 18px 20px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.history-meta {
  margin-top: 10px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.85);
}

.history-loading-wrap {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.history-footer {
  border-top: 1px solid #f0f0f0;
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
