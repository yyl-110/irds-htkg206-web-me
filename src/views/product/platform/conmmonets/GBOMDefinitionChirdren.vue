<template>
  <div class="gbom-definition">
    <div class="params-toolbar">
      <a-button type="primary" @click="addGBOMInfo">
        <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
        {{ $t('添加') }}
      </a-button>
      <a-button type="primary" class="ml-2" @click="getGBOMTemplate">
        <EpcIcon type="icon-navigation" style="font-size: 12px" />
        {{ $t('继承节点') }}
      </a-button>

      <a-button type="primary" @click="exportData()" class="ml-2">
        <EpcIcon type="icon-daochu" style="font-size: 12px" />
        {{ $t('Excel导出') }}
      </a-button>
    </div>

    <div class="main-content">
      <div class="b-body2">
        <a-table
          :columns="columns"
          row-key="id"
          :data-source="resources"
          :defaultExpandedRowKeys="defaultExpandedRowKeys"
          :pagination="false"
          :locale="locale"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
          :row-selection="rowSelection"
          :customRow="customRow"
          @resizeColumn="handleResizeColumn">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'required'">
              <a-switch
                :checked="record.required === true"
                checked-children="必选"
                un-checked-children="可选"
                @change="handleKeyIndicatorChange(record, $event)"
                style="margin-left: 10px" />
            </template>
            <template v-else-if="column.dataIndex === 'isModule'">
              <a-link v-if="record.isModule === 0" class="act-btn" @click="relevanceModule(record)" type="primary"> 关联 </a-link>
              <a-link v-if="record.isModule === 1" class="act-btn" @click="relevanceModule(record)" type="primary" style="color: green"> 已关联 </a-link>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a @click="editGBOMParameterInfo(record)">{{ $t('编辑') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                <a-button type="link" danger class="p-0">
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-link v-if="record.isParameter" class="act-btn" @click="getParameterModule(record)" type="primary" style="color: green"> 已定义</a-link>
              <a-link v-else class="act-btn" @click="getParameterModule(record)" type="primary"> 参数定义 </a-link>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>

  <addGBOMParameterInfoModule
    ref="updateParameterInfoModuleRef"
    :modal-visible="updateParameterVisible"
    @close="updateParameterVisibleCanel"
    @updateParaneterInfo="updateParaneterInfo" />

  <addGBOMSericesParameterInfoModule
    ref="addGBOMSericesParameterInfoModuleRef"
    :modal-visible="getGBOMTreeInfo"
    :gbom-info="resources"
    :select-tree-data="gBOMResources"
    @close="GBOMSeriesVisibleCanel"
    @updateGBOMSeriesVisible="updateGBOMSeriesVisible" />

  <saveGBOMParameterModuleInfo
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="selectTreeData"
    :parameter-info-data="parameterInfoData"
    :select-tree-selected-keys="selectTreeSelectedKeys"
    :existing-resources="existingAssociatedModules"
    :category-names-string="categoryNamesString"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancelSelectTreeNode="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode" />

  <getGBOMParameterInfoModule
    ref="selectBoomTreeRefB"
    :modal-visible="selectParameterVisible"
    :parameter-info-data="parameterGBOMInfo"
    :parameter-category-info-data="parameterGBOMCategoryInfo"
    :category-name-str="categoryNameStr"
    @cancelSelectTreeNode_B="cancelSelectTreeNode_B"
    @confirm-select-tree-node="confirmSelectTreeNode_B"
    @change-gbom="changeGbom"
    @move-up="moveUpGBOMParameterInfo"
    @move-down="moveDownGBOMParameterInfo"
    @get-parameter-info="getParameterInfo"
    @del-gbom="delGomParameterInfo"
    @edit-gbom="editGbom" />

  <updateGBOMParameterInfoModule
    ref="updateGBOMParameterInfo"
    :modal-visible="updateGbomParameterVisible"
    @close="updateGbomParameterVisibleCanel"
    @updateGbomParaneterInfo="updateGbomParaneterInfo" />

  <saveGBOMParameterInfoModule
    ref="selectBoomTreeRef_B"
    :modal-visible="selectParameterTreeVisible"
    :select-tree-data="selectTreeData_B"
    :parameter-info-data="parameterInfoData_B"
    :select-tree-selected-keys="selectTreeSelectedKeys_B"
    :existing-resources="parameterGBOMInfo"
    @confirm-select-tree-node="confirmSelectTreeNode_C"
    @cancelSelectTreeNode="cancelSelectTreeNode_C"
    @handle-select-tree-node="handleSelectTreeNode_C" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { downloadFileFromStream } from '@/utils/file.ts';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductPlatformParameterInfoUpdateDTOModel } from '@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel';
import { ProductSeriesParameterInfoRequestDTOModel } from '@/api/models/product/ProductSeriesParameterInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { ProductSeriesGBOMModuleInfoDTOModel } from '@/api/models/product/ProductSeriesGBOMModuleInfoDTOModel';
import saveGBOMParameterModuleInfo from './modalComponent/saveGBOMParameterModuleInfo.vue';
import getGBOMParameterInfoModule from './modalComponent/getGBOMParameterInfoModule.vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import addGBOMParameterInfoModule from './modalComponent/addGBOMParameterInfoModule.vue';
import addGBOMSericesParameterInfoModule from './modalComponent/addGBOMSericesParameterInfoModule.vue';
import updateGBOMParameterInfoModule from './modalComponent/updateGBOMParameterInfoModule.vue';
import saveGBOMParameterInfoModule from './modalComponent/saveGBOMParameterInfoModule.vue';
import { message } from 'ant-design-vue';
// 组件接收的属性
interface Props {
  currentNodeData?: any;
}
const updateParameterInfoModuleRef = ref<any>(null);
const addGBOMSericesParameterInfoModuleRef = ref<any>(null);
const selectBoomTreeRef = ref<any>(null);
const selectBoomTreeRef_B = ref<any>(null);
const selectBoomTreeRefB = ref<any>(null);
const updateGBOMParameterInfo = ref<any>(null);
const updateParameterVisible = ref<boolean>(false);
const updateGbomParameterVisible = ref<boolean>(false);
const getGBOMTreeInfo = ref<boolean>(false);
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const defaultExpandedRowKeys = ref<any>([]);
const resources_B = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const gBOMResources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
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
const selectedRowkeys = ref<string[] | number[]>([]); // 存储选中行的key
const selectedRowList = ref<ProductPlatformParameterInfoRequestDTOModel[]>([]); // 存储选中行的完整数据
const selectTreeVisible = ref<boolean>(false);
const selectParameterVisible = ref<boolean>(false);
const selectParameterTreeVisible = ref<boolean>(false);
const selectTreeData = ref<any[]>([]);
const selectTreeData_B = ref<any[]>([]);
const parameterGBOMInfo = ref<any[]>([]);
const parameterGBOMCategoryInfo = ref<any[]>([]);
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
const selectTreeSelectedKeys = ref<string>('');
const selectTreeSelectedKeys_B = ref<string>('');
const categoryNameStr = ref<string>('');
// 新增：存储已关联的模块数据（从resA获取）
const existingAssociatedModules = ref<any>({});

/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: 'radio',
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      if (record.id == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.id);
        selectedRowList.value.push(record);
      }
    },
  };
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

function updateParameterVisibleCanel(record: any) {
  updateParameterVisible.value = false;
}

function updateGbomParameterVisibleCanel(record: any) {
  updateGbomParameterVisible.value = false;
}

async function updateGbomParaneterInfo(record: any) {
  const res = await AdminApiSystemProduct.seriesGBOMUpdateParameterInfo(record);
  if (res.status == 200) {
    message.success(WeiI18n.t('修改成功').value);
    updateGbomParameterVisible.value = false;
    shuhParameterInfo();
  } else {
    message.error(WeiI18n.t('修改失败').value);
  }
}

function GBOMSeriesVisibleCanel(record: any) {
  getGBOMTreeInfo.value = false;
}
async function updateGBOMSeriesVisible(seriesGBOMParameter: any) {
  seriesGBOMParameter.seriesId = categoryInfo.value.key;
  seriesGBOMParameter.userId = userStore.getUser.id;
  const res = await AdminApiSystemProduct.customSaveSeriesGBOM(seriesGBOMParameter);
  if (res.status == 200) {
    message.success(WeiI18n.t('添加成功').value);
    getGBOMTreeInfo.value = false;
    queryParameterInfoS();
  } else {
    message.error(WeiI18n.t('添加失败').value);
  }
}

async function updateParaneterInfo(updatePlatformParameter: any, titleInfo: string) {
  if (titleInfo == '编辑GBOM节点') {
    const res = await AdminApiSystemProduct.customUpdateSeriesGBOM(updatePlatformParameter);
    if (res.status == 200) {
      message.success(WeiI18n.t('修改成功').value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t('修改失败').value);
    }
  } else {
    updatePlatformParameter.seriesId = categoryInfo.value.key;
    updatePlatformParameter.id = selectedRowkeys.value[0];
    updatePlatformParameter.userId = userStore.getUser.id;
    const res = await AdminApiSystemProduct.customAddSeriesGBOM(updatePlatformParameter);
    if (res.status == 200) {
      message.success(WeiI18n.t('添加成功').value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t('添加失败').value);
    }
  }
}

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

/**
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
async function confirmSelectTreeNode(item: any) {
  seriesGBOMModuleInfoDTOModel.moduleInfoIdList = item;
  const resC = await AdminApiSystemProduct.associatedModules(seriesGBOMModuleInfoDTOModel);
  console.log(resC);
  if (resC.status == 200) {
    selectTreeVisible.value = false;
    queryParameterInfoS();
    message.success(WeiI18n.t('关联成功').value);
  } else {
    message.success(WeiI18n.t('关联失败').value);
  }
}

async function cancelSelectTreeNode(item: any) {
  selectTreeVisible.value = false;
  queryParameterInfoS();
}

async function cancelSelectTreeNode_B(item: any) {
  selectParameterVisible.value = false;
  queryParameterInfoS();
}

async function cancelSelectTreeNode_C(item: any) {
  selectParameterTreeVisible.value = false;
}

async function confirmSelectTreeNode_B(item: any) {
  selectParameterVisible.value = false;
  queryParameterInfoS();
}

async function confirmSelectTreeNode_C(item: any) {
  const ids = [];
  item.forEach(obj => {
    ids.push(obj.id);
  });
  console.log(ids);
  seriesGBOMModuleInfoDTOModel.idList = ids;
  await AdminApiSystemProduct.seriesGBOMAddParameter(seriesGBOMModuleInfoDTOModel);
  selectParameterTreeVisible.value = false;
  selectTreeSelectedKeys_B.value = '';
  message.success(WeiI18n.t('添加成功').value);
  shuhParameterInfo();
}

async function changeGbom(record: any) {
  seriesGBOMModuleInfoDTOModel.id = record.id;
  seriesGBOMModuleInfoDTOModel.keyIndicators = record.keyIndicators;
  const res = await AdminApiSystemProduct.seriesGBOMupdateKeyIndicators(seriesGBOMModuleInfoDTOModel);
  shuhParameterInfo();
}

async function moveUpGBOMParameterInfo(record: any) {
  seriesGBOMModuleInfoDTOModel.id = record.id;
  seriesGBOMModuleInfoDTOModel.move = true;
  await AdminApiSystemProduct.seriesGBOMMove(seriesGBOMModuleInfoDTOModel);
  shuhParameterInfo();
}

async function moveDownGBOMParameterInfo(record: any) {
  seriesGBOMModuleInfoDTOModel.id = record.id;
  seriesGBOMModuleInfoDTOModel.move = false;
  await AdminApiSystemProduct.seriesGBOMMove(seriesGBOMModuleInfoDTOModel);
  shuhParameterInfo();
}

async function getParameterInfo(record: any) {
  treeRequestParams.categoryid = 147;
  selectTreeSelectedKeys_B.value = '147';
  treeRequestParams.titleid = '2';
  const res = await AdminApiSystemProduct.getProductModuleTree(treeRequestParams);
  const templateRes = await AdminApiSystemProduct.getTempalteParaInfoList(seriesParameter);
  if (res.data.code == '0' && res.data.data) {
    const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
    const treeNodes = convertToTreeNodes(rawData[0].result[0]);
    selectTreeData_B.value = JSON.parse(JSON.stringify(treeNodes));
    parameterInfoData_B.value = templateRes.data.data.data;
    selectParameterTreeVisible.value = true;
  }
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map(item => {
    // 判断是否为根节点
    const isRootNode = item.moduleLevel === 1 || (item.nodeRootType && item.nodeRootType.toString() === '1');
    // 判断是否有子节点
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

    // 设置level值：根节点level为1，有子节点的节点level为2，没有子节点的节点level为3
    let level = 3; // 默认level为3（无子节点）
    if (isRootNode) {
      level = 1;
    } else if (hasChildren) {
      level = 2;
    }

    return {
      addTreeType: item.addTreeType,
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || item.title || '',
      // 添加type字段，用于在Tree组件中区分节点类型
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      nodeRootType: item.nodeRootType,
      nodeType: item.nodeType,
      nodeRootId: item.nodeRootId,
      moduleLevel: item.moduleLevel,
      expand: item.expand,
      level: level,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

async function delGomParameterInfo(record: any) {
  seriesGBOMModuleInfoDTOModel.ids = [];
  seriesGBOMModuleInfoDTOModel.ids.push(record.id);
  await AdminApiSystemProduct.seriesGBOMDel(seriesGBOMModuleInfoDTOModel);
  shuhParameterInfo();
}

async function editGbom(record: any) {
  updateGbomParameterVisible.value = true;
  updateGBOMParameterInfo.value?.editParameterInfoData(record, 3);
}

async function shuhParameterInfo() {
  const res = await AdminApiSystemProduct.seriesGBOMGetParameterList(seriesGBOMModuleInfoDTOModel);
  parameterGBOMInfo.value = res.data.data || [];
}

async function handleSelectTreeNode(item: any, info: any) {
  try {
    // 设置当前节点ID
    seriesGBOMModuleInfoDTOModel.categoryId = info.node.id; // 使用点击节点的ID
    seriesGBOMModuleInfoDTOModel.userName = userStore.getUser.username || 'admin'; // 设置当前用户名

    // 调用接口获取数据
    const resC = await AdminApiSystemProduct.findModelByCategoryId(seriesGBOMModuleInfoDTOModel);

    // 更新parameterInfoData，包含moduleParaList（动态列表头数据）和moduleList（表格数据）
    if (resC.data && resC.data.data) {
      parameterInfoData.value = {
        moduleParaList: resC.data.data.moduleParaList || [],
        moduleList: resC.data.data.moduleList || [],
      };
    }
  } catch (error) {
    message.error(WeiI18n.t('获取数据失败').value);
  }
}

async function handleSelectTreeNode_C(selectedKeys: any[], info: any) {
  selectTreeSelectedKeys_B.value = selectedKeys[0];
  seriesParameter.categoryid = selectedKeys[0];
  const templateRes = await AdminApiSystemProduct.getTempalteParaInfoList(seriesParameter);
  parameterInfoData_B.value = templateRes.data.data.data;
}

// GBOM定义表格列配置
const columns = ref<TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('超级GBOM'),
    dataIndex: 'descript',
    key: 'descript',
    align: 'left',
    resizable: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('必选/可选'),
    dataIndex: 'required',
    key: 'required',
    align: 'left',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('关联模块数据'),
    dataIndex: 'isModule',
    key: 'isModule',
    align: 'center',
    resizable: true,
    width: 200,
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
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 230,
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
  defaultExpandedRowKeys.value.push(res.data.data[0].id);
}

function addGBOMInfo() {
  updateParameterVisible.value = true;
  updateParameterInfoModuleRef.value?.addParameterInfoData(selectedRowList.value[0]);
}

async function getGBOMTemplate() {
  platformParameter.proId = categoryInfo.value.pid;
  const res = await AdminApiSystemProduct.getPlatformbomGBOMTree(platformParameter);
  gBOMResources.value = res.data.data || [];
  addGBOMSericesParameterInfoModuleRef.value?.addParameterInfoData();
  getGBOMTreeInfo.value = true;
}

async function exportData() {
  seriesParameter.seriesId = categoryInfo.value.key;
  const res = await AdminApiSystemProduct.seriesGBOMExportData(seriesParameter);
  const fileName = categoryInfo.value.partName + '-模块结构树.xlsx';
  downloadFileFromStream(res, fileName);
}

function editGBOMParameterInfo(record) {
  updateParameterVisible.value = true;
  updateParameterInfoModuleRef.value?.editParameterInfoData(record);
}

async function getParameterModule(record) {
  seriesGBOMModuleInfoDTOModel.seriesGBOMId = record.id;
  const res = await AdminApiSystemProduct.seriesGBOMGetParameterList(seriesGBOMModuleInfoDTOModel);
  seriesParameter.seriesId = categoryInfo.value.key;
  const resA = await AdminApiSystemProduct.seriesParameterGetParameterData(seriesParameter);
  selectParameterVisible.value = true;
  parameterGBOMInfo.value = res.data.data || [];
  parameterGBOMCategoryInfo.value = resA.data.data || [];
}

async function handleKeyIndicatorChange(record: any, checked: boolean) {
  try {
    ((seriesGBOMParameter.id = record.id), (seriesGBOMParameter.required = checked));
    await AdminApiSystemProduct.updateSeriesGBOMStatus(seriesGBOMParameter);
    // 更新本地数据以立即反映变化
    record.required = checked;
    // 显示操作成功的提示信息
    message.success(WeiI18n.t('操作成功').value);
    queryParameterInfoS();
  } catch (error) {
    // 如果更新失败，恢复原始状态
    record.required = checked;
    message.error(WeiI18n.t('操作失败').value);
  }
}

async function handleDelete(record) {
  platformParameter.ids = [];
  platformParameter.ids.push(record.id);
  const res = await AdminApiSystemProduct.customDeleteSeriesGBOM(platformParameter);
  if (res.status == 200) {
    message.success(WeiI18n.t('删除成功').value);
    queryParameterInfoS();
  } else {
    message.error(WeiI18n.t('删除失败').value);
  }
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
