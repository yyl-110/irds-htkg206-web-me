<template>
  <div class="project-manager">
    <div class="mt-2 b-body2">
      <div class="member-search-row">
        <a-input v-model:value="keywords" style="width: 240px" placeholder="请输入关键字搜索" />
        <a-button type="primary" @click="turnToTask" style="margin-left: 10px"> <EpcIcon type="icon-fangdajing" style="font-size: 12px" />查询</a-button>
        <a-button @click="resetTurnToTask" style="margin-left: 10px"> <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />重置</a-button>
      </div>
      <div class="project-info" style="margin-top: 20px">
        <a-table
          :columns="columns"
          :locale="locale"
          :loading="loading"
          @resizeColumn="handleResizeColumn"
          row-key="id"
          :data-source="resources"
          :scroll="{ x: 'max-content' }"
          :pagination="false"
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
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="editInfo(record)" v-if="record.librayName.includes(userStore.getUser.nickname)">{{ $t('编辑') }}</a>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>

  <!-- 编辑Modal -->
  <div class="projectManager" v-dragModal>
    <a-modal v-model:visible="editModalVisible" :getContainer="customGetContainer" title="编辑项目信息" @ok="handleEditSave" @cancel="handleEditCancel" width="800px">
      <a-form ref="editForm" :model="editFormData" layout="vertical" style="height: 500px; overflow-y: auto; overflow-x: hidden">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="执行项目状态" name="executionStatus">
              <a-select v-model:value="editFormData.executionStatus" placeholder="请选择执行项目状态" allowClear>
                <a-select-option value="1">跟踪阶段</a-select-option>
                <a-select-option value="2">投标阶段</a-select-option>
                <a-select-option value="3">执行阶段</a-select-option>
                <a-select-option value="4">售后阶段</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目名称" name="nameCN">
              <a-input v-model:value="editFormData.nameCN" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目编号" name="code">
              <a-input v-model:value="editFormData.code" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目分类" name="projectCategory">
              <a-select v-model:value="editFormData.projectCategory" :disabled="true">
                <a-select-option value="1">市场执行项目</a-select-option>
                <a-select-option value="2">科技开发项目</a-select-option>
                <a-select-option value="3">机电业务项目</a-select-option>
                <a-select-option value="4">检修运维项目</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品业务分类" name="businessClassification">
              <a-select allowClear v-model:value="editFormData.businessClassification" @change="RegionChange" placeholder="请选择产品业务分类">
                <a-select-option v-for="item in regionalMarketlist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品所属平台" name="platformName">
              <a-input v-model:value="editFormData.platformName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品所属区域" name="affiliatedArea">
              <a-select v-model:value="editFormData.affiliatedArea" placeholder="请选择产品所属区域" allowClear>
                <a-select-option v-for="item in MarketSegmentlist" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计经理" name="designManagerName">
              <a-input v-model:value="editFormData.designManagerName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="研发阶段" name="pdPhase">
              <a-select v-model:value="editFormData.pdPhase" placeholder="请选择研发阶段" allowClear>
                <a-select-option value="1">设计策划</a-select-option>
                <a-select-option value="2">方案设计</a-select-option>
                <a-select-option value="3">系统设计</a-select-option>
                <a-select-option value="4">详细设计</a-select-option>
                <a-select-option value="5">验证总结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="研发阶段里程碑节点" name="pdPhaseTime">
              <a-date-picker
                :locale="localeA"
                v-model:value="editFormData.pdPhaseTime"
                format="YYYY-MM-DD "
                placeholder="请选择节点"
                value-format="YYYY-MM-DD"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品主管副总师/副主任" name="supervisorId">
              <a-input v-model:value="editFormData.supervisorId" placeholder="请输入产品主管副总师/副主任" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品主管领导" name="leaderId">
              <a-input v-model:value="editFormData.leaderId" placeholder="请输入产品主管领导" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结构主管" name="mechanicalName">
              <a-input v-model:value="editFormData.mechanicalName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电气主管" name="electricalName">
              <a-input v-model:value="editFormData.electricalName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="产品成熟度" name="projectType">
              <a-select v-model:value="editFormData.projectType" :disabled="true">
                <a-select-option value="1">一般改进型产品</a-select-option>
                <a-select-option value="2">重大改进型产品</a-select-option>
                <a-select-option value="3">延续型产品</a-select-option>
                <a-select-option value="4">全新产品</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属平台" name="platformName">
              <a-input v-model:value="editFormData.platformName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属主型产品" name="seriesName">
              <a-input v-model:value="editFormData.seriesName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="平台经理" name="librayName">
              <a-input v-model:value="editFormData.librayName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="具体进展" name="specificProgress">
              <a-textarea v-model:value="editFormData.specificProgress" placeholder="请输入具体进展" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="风险管控" name="riskControl">
              <a-textarea v-model:value="editFormData.riskControl" placeholder="请输入风险管控" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="handleEditSave">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleEditCancel">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnType } from 'ant-design-vue';
import { Modal, Form, Input, Row, Col, message } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { sortermethod } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import localeA from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { AdminApiSystemDictType } from '@/api/tags/管理后台字典类型';
import { useUserStore } from '@/store/modules/user';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const seriesParameter = reactive(new ProductPlatformParameterInfoRequestDTOModel());
const userStore = useUserStore();
const keywords = ref('');
const loading = ref<boolean>(false);
// 区域市场
interface OptionrItem {
  label: string;
  value: string;
}
const regionalMarketlist = ref<OptionrItem[]>([
  // { label: '国内地铁市场', value: '国内地铁市场' },
  // { label: '国内铁路市场', value: '国内铁路市场' },
  // { label: '海外产品市场', value: '海外产品市场' },
]);
// 区域/细分市场
const marketList = ref([]);
// 细分市场
const MarketSegmentlist = ref<OptionrItem[]>([]);
// 编辑表单相关变量
const editModalVisible = ref(false);
const editForm = ref();
const editFormData = reactive(new ProductPlatformParameterInfoRequestDTOModel());
// GBOM定义表格列配置
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
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 120,
    fixed: 'right',
  },
]);

const props = withDefaults(defineProps<Props>(), {
  currentNodeData: () => null,
});
function handleResizeColumn(w, col) {
  col.width = w;
}

function editInfo(record: any) {
  initDictionary('Demandmarkets');
  // 将选中的记录数据复制到表单中
  Object.assign(editFormData, record);
  // 打开编辑Modal
  editModalVisible.value = true;
}

/**
 * @param category
 * @description 获取字典
 */
async function initDictionary(dictType: string) {
  const res = await AdminApiSystemDictType.getSelValListById({ dictType });
  if (res.data.code === 200) {
    let data: any = res.data.data;
    marketList.value = data;
    regionalMarketlist.value = data.map((item: any) => ({ label: item.label, value: item.value })) || [];
  }
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.projectManager');
}

function RegionChange(value: string) {
  editFormData.affiliatedArea = undefined;
  let data: any = marketList.value.filter((item: any) => item.value == value);
  if (data[0] && data[0].remark) {
    let arr = data[0].remark.split(',');
    if (arr.length > 0) {
      MarketSegmentlist.value = arr.map((item: string) => ({ label: item, value: item }));
    }
  }
}

// 保存编辑
async function handleEditSave() {
  try {
    const res = await AdminApiSystemProduct.updateProduct(editFormData);
    console.log(res);
    if (res.data.code == 0) {
      editModalVisible.value = false;
      message.success('编辑成功');
      await turnToTask();
    } else {
      message.error('编辑失败：' + res.data.message);
    }
  } catch (error) {
    console.error('编辑保存失败：', error);
  }
}

// 取消编辑
function handleEditCancel() {
  // 关闭Modal
  editModalVisible.value = false;
  // 重置表单数据（可选）
  // Object.assign(editFormData, new ProductPlatformParameterInfoRequestDTOModel());
}
async function reloadTableParameter(selectedKeys: any) {
  loading.value = true;
  seriesParameter.proId = selectedKeys.key;
  const res = await AdminApiSystemProduct.getProductListByProId(seriesParameter);
  resources.value = res.data.data.data || [];
  loading.value = false;
}
async function turnToTask() {
  loading.value = true;
  seriesParameter.keywords = keywords.value;
  const res = await AdminApiSystemProduct.getProductListByProId(seriesParameter);
  resources.value = res.data.data.data || [];
  loading.value = false;
}
async function resetTurnToTask() {
  keywords.value = '';
  turnToTask();
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
