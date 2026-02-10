<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useWindowSize } from '@vueuse/core';
import DeptUpdateOrAdd from './components/form/index.vue';
import type { FeedbackPOModel } from '@/api/models/personal-center/feedback/FeedbackPOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import type { DeptListRequestDTO, DeptResponseDTO } from '@/api/tags/data-contracts';
import { AdminApiSystemBasiclanguage } from '@/api/tags/管理基础语言';
import { BasiclanguagePageRequestDTOModel } from '@/api/models/language/BasiclanguagePageRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon';
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); //
const loading = ref(false);
const addOrUpdate = ref<InstanceType<typeof DeptUpdateOrAdd>>();
/** 当前查询条件中的 name */
const currentQueryName = ref('');
/** 列表请求参数 */
const requestParams = reactive(new BasiclanguagePageRequestDTOModel());
/** 列表数据 */
const dataSource = ref<Array<DeptResponseDTO>>([]);
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 获取部门数据 */

const formRef = ref();

const { height } = useWindowSize();
const gridHeight = computed(() => height.value - 285);
/** 是否显示 新增 / 编辑 弹窗 */
const visible = ref<boolean>(false);
const columns = computed<FeedbackPOModel>(() => [
  {
    title: WeiI18n.t('语言').value,
    dataIndex: 'lang',
    key: 'lang',
    minWidth: 170,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('语言说明').value,
    dataIndex: 'langDesc',
    key: 'langDesc',
    minWidth: 170,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('排版').value,
    dataIndex: 'langDirection',
    key: 'langDirection',
    minWidth: 170,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 160,
    fixed: 'right',
    slots: {
      default: 'operation_default',
    },
  },
]);

/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  getListData();
}

/**
 * 删除
 * @param record record
 */
function handleDelete(record: any) {
  const delTable = AdminApiSystemBasiclanguage.deleteBasiclanguage({
    id: record.id,
  });
  delTable.then(() => {
    message.success(WeiI18n.t('删除成功').value);
    const index = dataSource.value.findIndex(item => item.id === record.id);
    if (index !== -1) dataSource.value.splice(index, 1);
  });
}
/** reset */
function handleReset() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  formRef.value.resetFields();
}

/**
 * 显示 新增 / 编辑 弹窗
 * @param record record
 * @param id
 * @param parentId
 */
function handleAddOrUpdate(id: any) {
  visible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    addOrUpdate.value?.handleModalAddOrUpdate(id);
  });
}
/**
 * 同步
 */
async function Sincronizar() {
  const res = await AdminApiSystemBasiclanguage.Sincronizar();
  if (res.data.code === 200) {
    message.success(WeiI18n.t('同步成功').value);
  }
}

async function getListData() {
  currentQueryName.value = requestParams.searchKey || '';
  loading.value = true;
  try {
    const res = await AdminApiSystemBasiclanguage.getBasiclanguageList(requestParams);
    if (res.data.code === 200) {
      dataSource.value = res.data.data?.list || [];
      pagination.total = res.data.data?.total;
    }
  } finally {
    loading.value = false;
  }
}
getListData();
</script>

<template>
  <a-card>
    <a-form ref="formRef" class="form_main" layout="inline" :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 14 }" :model="requestParams" @finish="handleFinish">
      <a-form-item :label="$t('语言说明')" name="searchKey">
        <a-input v-model:value="requestParams.searchKey" style="width: 240px" :placeholder="$t('请输入')" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
          {{ $t('查询') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <!-- v-hasPermi="['system:multilangData:create']" -->
        <a-button type="primary" @click="handleAddOrUpdate(undefined)">
          <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
          {{ $t('添加') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <!-- v-hasPermi="['system:multilangFront:synchronous']" -->
        <!-- <a-button type="primary" @click="Sincronizar()">
          {{ $t('同步') }}
        </a-button> -->
      </a-form-item>
    </a-form>
  </a-card>

  <a-card style="margin-top: 10px" class="b-body">
    <a-table
      :columns="columns"
      :scroll="{ x: 1200 }"
      :pagination="pagination"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div style="height: 22px; display: flex; align-items: center">
            <!-- v-hasPermi="['system:multilangData:update']" -->
            <a @click.stop="handleAddOrUpdate(record.id)">{{ $t('编辑') }}</a>
            <!-- v-hasPermi="['system:multilangData:update']" -->
            <a-divider type="vertical" />
            <div @click.stop>
              <a-popconfirm
                v-if="dataSource.length"
                :title="$t('确定要删除吗？')"
                :ok-text="$t('确定')"
                :cancel-text="$t('取消')"
                :disabled="$isPending('delete', record.id)"
                @confirm="handleDelete(record)">
                <!-- v-hasPermi="['system:multilangData:delete']" -->
                <a style="color: #ff4d4f">{{ $t('删除') }}</a>
              </a-popconfirm>
            </div>
          </div>
        </template>
      </template>
    </a-table>
    <DeptUpdateOrAdd ref="addOrUpdate" v-model:visible="visible" @refresh-table-data="getListData" />
  </a-card>
</template>

<style lang="less" scoped>
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
</style>
