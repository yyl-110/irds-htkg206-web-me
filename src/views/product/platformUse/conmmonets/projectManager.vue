<template>
  <div class="project-manager">
    <div class="mt-2 b-body2">
      <div class="project-info">
        <a-table
          :columns="columns"
          :locale="locale"
          @resizeColumn="handleResizeColumn"
          row-key="id"
          :data-source="resources"
          :pagination="false"
          :scroll="{ x: 'max-content' }"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'projectCategory'">
              <span>
                <span v-if="record.projectCategory === '1'"> {{ $t('市场执行项目') }}</span>
                <span v-else-if="record.projectCategory === '2'">{{ $t('科技开发项目') }}</span>
                <span v-else-if="record.projectCategory === '3'"> {{ $t('机电业务项目') }}</span>
                <span v-else-if="record.projectCategory === '4'">{{ $t('检修运维项目') }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'projectType'">
              <div v-if="record.projectType === '1'">一般改进型产品</div>
              <div v-else-if="record.projectType === '2'">重大改进型产品</div>
              <div v-else-if="record.projectType === '3'">延续型产品</div>
              <div v-else>全新产品</div>
            </template>
            <template v-else-if="column.dataIndex === 'projectPercentage'">
              <div style="color: #3172f5"><a-progress :percent="record.projectPercentage" /></div>
            </template>
            <template v-else-if="column.dataIndex === 'executionStatus'">
              <span>
                <span v-if="record.executionStatus === '1'"> {{ $t('跟踪阶段') }}</span>
                <span v-else-if="record.executionStatus === '2'">{{ $t('投标阶段') }}</span>
                <span v-else-if="record.executionStatus === '3'"> {{ $t('执行阶段') }}</span>
                <span v-else-if="record.executionStatus === '4'">{{ $t('售后阶段') }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'pdPhase'">
              <span>
                <span v-if="record.pdPhase === '1'"> {{ $t('设计策划') }}</span>
                <span v-else-if="record.pdPhase === '2'">{{ $t('方案设计') }}</span>
                <span v-else-if="record.pdPhase === '3'"> {{ $t('系统设计') }}</span>
                <span v-else-if="record.pdPhase === '4'">{{ $t('详细设计') }}</span>
                <span v-else-if="record.pdPhase === '5'">{{ $t('验证总结') }}</span>
              </span>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Empty from '@/components/Empty/index.vue';
import type { TableColumnType } from 'ant-design-vue';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { sortermethod } from '@/utils/tools';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const seriesParameter = reactive(new ProductPlatformParameterInfoRequestDTOModel());
const columns = ref<TableColumnType<any>[]>([
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    resizable: true,
    width: 90,
  },
  {
    title: WeiI18n.$t('执行项目状态'),
    dataIndex: 'executionStatus',
    key: 'executionStatus',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.executionStatus, b.executionStatus),
  },
  {
    title: WeiI18n.$t('项目名称'),
    dataIndex: 'nameCN',
    key: 'nameCN',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.nameCN, b.nameCN),
  },
  {
    title: WeiI18n.$t('项目编号'),
    dataIndex: 'code',
    key: 'code',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.code, b.code),
  },
  {
    title: WeiI18n.$t('项目分类'),
    dataIndex: 'projectCategory',
    key: 'projectCategory',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.projectCategory, b.projectCategory),
  },
  {
    title: WeiI18n.$t('产品业务分类'),
    dataIndex: 'businessClassification',
    key: 'businessClassification',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.businessClassification, b.businessClassification),
  },
  {
    title: WeiI18n.$t('产品所属平台'),
    dataIndex: 'platformName',
    key: 'platformName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.platformName, b.platformName),
  },
  {
    title: WeiI18n.$t('产品所属区域'),
    dataIndex: 'affiliatedArea',
    key: 'affiliatedArea',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.affiliatedArea, b.affiliatedArea),
  },
  {
    title: WeiI18n.$t('设计经理'),
    dataIndex: 'designManagerName',
    key: 'designManagerName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.designManagerName, b.designManagerName),
  },
  {
    title: WeiI18n.$t('研发阶段'),
    dataIndex: 'pdPhase',
    key: 'pdPhase',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.pdPhase, b.pdPhase),
  },
  {
    title: WeiI18n.$t('研发阶段里程碑节点'),
    dataIndex: 'pdPhaseTime',
    key: 'pdPhaseTime',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.pdPhaseTime, b.pdPhaseTime),
  },
  {
    title: WeiI18n.$t('研发进展'),
    dataIndex: 'projectPercentage',
    key: 'projectPercentage',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.projectPercentage, b.projectPercentage),
  },
  {
    title: WeiI18n.$t('具体进展'),
    dataIndex: 'specificProgress',
    key: 'specificProgress',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.specificProgress, b.specificProgress),
  },
  {
    title: WeiI18n.$t('风险管控'),
    dataIndex: 'riskControl',
    key: 'riskControl',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.riskControl, b.riskControl),
  },
  {
    title: WeiI18n.$t('产品主管副总师/副主任'),
    dataIndex: 'supervisorId',
    key: 'supervisorId',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.supervisorId, b.supervisorId),
  },
  {
    title: WeiI18n.$t('产品主管领导'),
    dataIndex: 'leaderId',
    key: 'leaderId',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.leaderId, b.leaderId),
  },
  {
    title: WeiI18n.$t('结构主管'),
    dataIndex: 'mechanicalName',
    key: 'mechanicalName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.mechanicalName, b.mechanicalName),
  },
  {
    title: WeiI18n.$t('电气主管'),
    dataIndex: 'electricalName',
    key: 'electricalName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.electricalName, b.electricalName),
  },
  {
    title: WeiI18n.$t('产品成熟度'),
    dataIndex: 'projectType',
    key: 'projectType',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.projectType, b.projectType),
  },
  {
    title: WeiI18n.$t('所属平台'),
    dataIndex: 'platformName',
    key: 'platformName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.platformName, b.platformName),
  },
  {
    title: WeiI18n.$t('所属主型产品'),
    dataIndex: 'seriesName',
    key: 'seriesName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.seriesName, b.seriesName),
  },
  {
    title: WeiI18n.$t('平台经理'),
    dataIndex: 'librayName',
    key: 'librayName',
    align: 'left',
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.librayName, b.librayName),
  },
  // {
  //   title: WeiI18n.$t('计划开始时间'),
  //   dataIndex: 'startTime',
  //   key: 'startTime',
  //   align: 'left',
  //   resizable: true,
  //   width: 170,
  //   sorter: (a: any, b: any) => sortermethod(a.startTime, b.startTime),
  // },
  // {
  //   title: WeiI18n.$t('计划结束时间'),
  //   dataIndex: 'endTime',
  //   key: 'endTime',
  //   align: 'left',
  //   resizable: true,
  //   width: 170,
  //   sorter: (a: any, b: any) => sortermethod(a.endTime, b.endTime),
  // },
  // {
  //   title: WeiI18n.$t('创建人'),
  //   dataIndex: 'userName',
  //   key: 'userName',
  //   align: 'left',
  //   resizable: true,
  //   width: 120,
  //   sorter: (a: any, b: any) => sortermethod(a.userName, b.userName),
  // },
]);

const props = withDefaults(defineProps<Props>(), {
  currentNodeData: () => null,
});
function handleResizeColumn(w, col) {
  col.width = w;
}
async function reloadTableParameter(selectedKeys: any) {
  seriesParameter.proId = selectedKeys.key;
  const res = await AdminApiSystemProduct.getProductListByProId(seriesParameter);
  resources.value = res.data.data.data || [];
  console.log(resources.value);
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

defineExpose({ reloadTableParameter });

// 可以在这里添加更多项目管理相关的逻辑和方法
</script>

<style lang="less" scoped>
.project-manager {
  height: 100%;
}

.project-info {
  text-align: center;
  width: 100%;
  overflow-x: auto; /* 强制水平滚动 */
}

.b-body2 {
  height: calc(100vh - 320px);
  overflow: auto;
  margin-top: 10px;
}
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
