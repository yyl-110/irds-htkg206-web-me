<template>
  <div class="gbom-definition">
    <div class="main-content">
      <div class="b-body2">
        <a-table
          :columns="columns"
          row-key="id"
          :data-source="resources"
          :pagination="false"
          :locale="locale"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
          @resizeColumn="handleResizeColumn">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'required'">
              <a-switch :checked="record.required === true" checked-children="必选" un-checked-children="可选" :disabled="true" style="margin-left: 10px" />
            </template>
            <template v-else-if="column.dataIndex === 'isModule'">
              <a-link v-if="record.isModule === 0" class="act-btn" @click="relevanceModule(record)" type="primary"> 关联 </a-link>
              <a-link v-if="record.isModule === 1" class="act-btn" @click="relevanceModule(record)" type="primary"> 已关联 </a-link>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Empty from '@/components/Empty/index.vue';
import type { TableColumnType } from 'ant-design-vue';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductSeriesParameterInfoRequestDTOModel } from '@/api/models/product/ProductSeriesParameterInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { ProductSeriesGBOMModuleInfoDTOModel } from '@/api/models/product/ProductSeriesGBOMModuleInfoDTOModel';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { message } from 'ant-design-vue';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const addGBOMSericesParameterInfoModuleRef = ref<any>(null);
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const platformParameter = reactive(new ProductPlatformParameterInfoRequestDTOModel());
const seriesParameter = reactive(new ProductSeriesParameterInfoRequestDTOModel());
const seriesGBOMParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const seriesGBOMModuleInfoDTOModel = reactive(new ProductSeriesGBOMModuleInfoDTOModel());
const userStore = useUserStore();
treeRequestParams.userid = userStore.getUser.id;
platformParameter.userid = userStore.getUser.id;
seriesParameter.userid = userStore.getUser.id;
seriesGBOMParameter.userid = userStore.getUser.id;

// 先确保 selectedRowKeys 和 selectedRows 是响应式变量（已定义的话忽略）
const selectTreeVisible = ref<boolean>(false);
const selectTreeData = ref<any[]>([]);
const parameterInfoData = ref<{
  moduleParaList: any[];
  moduleList: any[];
}>({
  moduleParaList: [],
  moduleList: [],
});
function handleResizeColumn(w, col) {
  col.width = w;
}
const parameterInfoData_B = ref<any[]>([]);
const categoryNamesString = ref<string>('');
const selectTreeSelectedKeys_B = ref<string>('');
const categoryNameStr = ref<string>('');
const existingAssociatedModules = ref<any>({});
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

async function relevanceModule(data: any) {
  // 设置参数
  seriesGBOMModuleInfoDTOModel.id = data.id;
  seriesGBOMModuleInfoDTOModel.userId = 60; // 使用当前用户ID而不是硬编码
  // 获取系列GBOM模块数据
  const resA = await AdminApiSystemProduct.getSeriesGBOMModules(seriesGBOMModuleInfoDTOModel);
  console.log(resA);
  // 存储resA.data到existingAssociatedModules变量中
  existingAssociatedModules.value = resA.data || {};
  // 获取树结构节点数据 (resB作为左侧树结构节点)
  const resB = await AdminApiSystemProduct.getSeriesGBOMModuleTree(seriesGBOMModuleInfoDTOModel);
  selectTreeData.value = resB.data?.data || [];
  console.log(selectTreeData.value);

  // 根据resA的key值（id）从selectTreeData中提取categoryName并拼接为字符串
  const categoryNames = [];
  for (const id in resA.data.data) {
    if (resA.data.data.hasOwnProperty(id)) {
      // 递归查找树中对应的节点
      const findNodeById = nodes => {
        for (const node of nodes) {
          if (String(node.id) === String(id)) {
            return node.categoryName;
          }
          if (node.children && node.children.length > 0) {
            const found = findNodeById(node.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const categoryName = findNodeById(selectTreeData.value);
      if (categoryName) {
        categoryNames.push(categoryName);
      }
    }
  }
  // 拼接成逗号分隔的字符串
  categoryNamesString.value = categoryNames.join(', ');
  // 获取表格和列表头数据 (resC中的moduleList和moduleParaList)
  seriesGBOMModuleInfoDTOModel.categoryId = resB.data?.data[0].id;
  seriesGBOMModuleInfoDTOModel.userName = userStore.getUser.username || 'admin';
  const resC = await AdminApiSystemProduct.findModelByCategoryId(seriesGBOMModuleInfoDTOModel);
  // 设置parameterInfoData，包含moduleParaList（动态列表头数据）和moduleList（表格数据）
  if (resC.data && resC.data.data) {
    parameterInfoData.value = {
      moduleParaList: resC.data.data.moduleParaList || [],
      moduleList: resC.data.data.moduleList || [],
    };
  }
  addGBOMSericesParameterInfoModuleRef.value?.addParameterInfoData(3935);
  // 打开弹框
  selectTreeVisible.value = true;
}

// GBOM定义表格列配置
const columns = ref<TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('超级GBOM'),
    dataIndex: 'descript',
    key: 'descript',
    align: 'left',
    resizable: true,
    width: 500,
  },
  {
    title: WeiI18n.$t('必选/可选'),
    dataIndex: 'required',
    key: 'required',
    align: 'left',
    resizable: true,
    width: 100,
  },
  {
    title: WeiI18n.$t('构型项名称'),
    dataIndex: 'pdmName',
    key: 'pdmName',
    align: 'left',
    resizable: true,
    width: 220,
  },
  {
    title: WeiI18n.$t('系统分类标识'),
    dataIndex: 'techid',
    key: 'techid',
    align: 'left',
    resizable: true,
    width: 190,
  },
  {
    title: WeiI18n.$t('标记'),
    dataIndex: 'signString',
    key: 'signString',
    align: 'left',
    resizable: true,
    width: 120,
  },
  {},
]);
const categoryInfo = ref<any>(null);
async function reloadTableParameter(selectedKeys: any) {
  categoryInfo.value = selectedKeys;
  categoryNameStr.value = categoryInfo.value.partName + '系列参数';
  queryParameterInfoS();
}

async function queryParameterInfoS() {
  seriesParameter.seriesId = categoryInfo.value.key;
  const res = await AdminApiSystemProduct.getSeriesGBOM(seriesParameter);
  resources.value = res.data.data || [];
}

defineExpose({ reloadTableParameter });
</script>

<style lang="less" scoped>
.act-btn {
  cursor: pointer;
  color: blue;
  font-size: 13px;
}
.main-content {
  display: flex;
  height: 100%;
}
.gbom-definition {
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
:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}
:deep(.ant-table-column-title) {
  flex: none;
}
</style>
