<template>
  <div class="params-toolbar">
    <a-input v-model:value="keywords" placeholder="请输入参数名称" style="width: 200px" />
    <a-button type="primary" class="ml-2" @click="queryParameterInfoS">
      <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
      {{ $t('查询') }}
    </a-button>
  </div>
  <div class="b-body2">
    <a-table
      :scroll="{ x: 1200, y: tableHXH }"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :locale="locale"
      @resizeColumn="handleResizeColumn"
      :data-source="resources"
      :pagination="pagination"
      @change="handleTableChange"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <!-- 序号从 1 开始自增 -->
          {{ index + 1 }}
        </template>
        <template v-else-if="column.dataIndex === 'parameterType'">
          <span>
            <span v-if="record.parameterType === '0'"> {{ $t('实数') }}</span>
            <span v-else-if="record.parameterType === '1'"> {{ $t('字符串') }}</span>
            <span v-else-if="record.parameterType === '2'"> {{ $t('布尔型') }}</span>
            <span v-else-if="record.parameterType === '9'"> {{ $t('整数') }}</span>
            <span v-else>{{ $t('未知') }}</span>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'status'">
          <span>
            <a-tag v-if="record.status === '0'">{{ $t('未发布') }}</a-tag>
            <a-tag v-else-if="record.status === '1'" color="blue">{{ $t('已发布') }}</a-tag>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'keyIndicators'">
          <a-switch :checked="record.keyIndicators === '1' || record.keyIndicators === 1" :disabled="true" style="margin-left: 10px" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import type { TableColumnType } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductSeriesParameterInfoRequestDTOModel } from '@/api/models/product/ProductSeriesParameterInfoRequestDTOModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { useUserStore } from '@/store/modules/user';
import { sortermethod } from '@/utils/tools';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  currentNodeData: () => null,
});

function handleResizeColumn(w, col) {
  col.width = w;
}
const tableHXH = ref(document.body.clientHeight - 450); //
const userStore = useUserStore();
const keywords = ref('');
const platformParameter = reactive(new ProductPlatformParameterInfoRequestDTOModel());
const seriesParameter = reactive(new ProductSeriesParameterInfoRequestDTOModel());
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
treeRequestParams.userid = userStore.getUser.id;
platformParameter.userid = userStore.getUser.id;
seriesParameter.userid = userStore.getUser.id;
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
// 分页相关变量
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: false, // 去掉Go to功能
  pageSizeOptions: ['10', '20', '50', '100'],
  // 显示总条数信息
  showTotal: (total: number) => `共${total}条`,
  // 处理页码变化
  onChange: current => {
    pagination.value.current = current;
    queryParameterInfoS();
  },
  // 处理每页显示条数变化
  onShowSizeChange: (current, pageSize) => {
    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    queryParameterInfoS();
  },
  // 自定义每页显示条数的选项文本
  buildOptionText: pageSizeOptions => {
    // pageSizeOptions是一个对象，包含value属性
    return `${pageSizeOptions.value}条/页`;
  },
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
const columns = ref<TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    resizable: true,
    width: 90,
  },
  {
    title: WeiI18n.$t('参数名称'),
    dataIndex: 'parameterName',
    key: 'parameterName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
  },
  {
    title: WeiI18n.$t('参数代号'),
    dataIndex: 'parameterNum',
    key: 'parameterNum',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.parameterNum, b.parameterNum),
  },
  {
    title: WeiI18n.$t('参数类型'),
    dataIndex: 'parameterType',
    key: 'parameterType',
    align: 'center',
    resizable: true,
    width: 130,
    sorter: (a: any, b: any) => sortermethod(a.parameterType, b.parameterType),
  },
  {
    title: WeiI18n.$t('参数单位'),
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'center',
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.unitName, b.unitName),
  },
  {
    title: WeiI18n.$t('大小量纲'),
    dataIndex: 'dimension',
    key: 'dimension',
    align: 'center',
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.dimension, b.dimension),
  },
  {
    title: WeiI18n.$t('默认值'),
    dataIndex: 'value',
    key: 'value',
    align: 'left',
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.value, b.value),
  },
  {
    title: WeiI18n.$t('参数属性'),
    dataIndex: 'rangeValue',
    key: 'rangeValue',
    align: 'left',
    resizable: true,
    width: 130,
    sorter: (a: any, b: any) => sortermethod(a.rangeValue, b.rangeValue),
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'note',
    key: 'note',
    align: 'left',
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.note, b.note),
  },
  { fixed: 'right', width: 1 },
]);
const categoryInfo = ref<any>(null);
async function reloadTableParameter(selectedKeys: any) {
  categoryInfo.value = selectedKeys;
  queryParameterInfoS();
}
// 保存原始columns配置，用于在不同level之间切换时恢复
const originalColumns = [...columns.value];

async function queryParameterInfoS() {
  if (categoryInfo.value.level == 2) {
    // 恢复原始columns配置
    columns.value = [...originalColumns];
    platformParameter.proId = categoryInfo.value.key;
    platformParameter.keywords = keywords.value;
    platformParameter.pageNum = pagination.value.current;
    platformParameter.pageSize = pagination.value.pageSize;
    const res = await AdminApiSystemProduct.getPlatformParameterList(platformParameter);
    resources.value = res.data.data.data ? res.data.data.data : [];
    // 更新分页信息
    pagination.value.total = res.data.data.total || 0;
  } else if (categoryInfo.value.level == 3) {
    // 恢复原始columns配置，然后添加关键指标和所属专业列
    columns.value = [...originalColumns];
    // 找到备注列的索引位置，在其后面添加新列
    const noteColumnIndex = columns.value.findIndex(col => col.dataIndex === 'note');
    if (noteColumnIndex !== -1) {
      // 在备注列后面添加关键指标列
      columns.value.splice(noteColumnIndex + 1, 0, {
        title: WeiI18n.$t('关键指标'),
        dataIndex: 'keyIndicators',
        key: 'keyIndicators',
        align: 'left',
        resizable: true,
        width: 130,
      });
      // 添加所属专业列
      columns.value.splice(noteColumnIndex + 2, 0, {
        title: WeiI18n.$t('所属专业'),
        dataIndex: 'major',
        key: 'major',
        align: 'left',
        resizable: true,
        width: 130,
      });
    }
    seriesParameter.seriesId = categoryInfo.value.key;
    seriesParameter.keywords = keywords.value;
    seriesParameter.pageNum = pagination.value.current;
    seriesParameter.pageSize = pagination.value.pageSize;
    const res = await AdminApiSystemProduct.getSeriesParameterList(seriesParameter);
    resources.value = res.data.data.data || [];
    // 更新分页信息
    pagination.value.total = res.data.data.total || 0;
  }
}

// 处理表格分页变化
function handleTableChange(paginationInfo: any) {
  pagination.value = { ...pagination.value, ...paginationInfo };
  queryParameterInfoS();
}

defineExpose({ reloadTableParameter });
</script>

<style lang="less" scoped>
.parameter-definition {
  height: 100%;
}

.params-toolbar {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

/* 确保表格区域有足够高度 */
.ant-table-wrapper {
  min-height: 400px;
}
.b-body2 {
  height: calc(100vh - 320px);
  overflow: auto;
  margin-top: 20px;
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

/* 确保分页选择器有足够宽度显示完整文本 */
:deep(.ant-pagination-options-size-changer) {
  min-width: 100px;
}

:deep(.ant-select-selector) {
  min-width: 80px !important;
}

/* 减小数字和单位之间的间距 */
:deep(.ant-select-selection-item) {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
}

:deep(.ant-select-selection-item-content) {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
