<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Tree from '@/components/tree/tree.vue';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { useUserStore } from '@/store/modules/user';
import Empty from '@/components/Empty/index.vue';
import { DesignPageRequestDTOModel } from '@/api/models/designcheck/DesignPageRequestDTOModel';
import { DesignInfoRequestDTOModel } from '@/api/models/designcheck/DesignInfoRequestDTOModel';
import { AdminApiSystemDesign } from '@/api/tags/designcheck/系统设计查核';
import Designrequirements from '../components/Designrequirements.vue';
/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const selectNodeKeys = ref<string>('');
const treePage = ref<any>(null);
const showLeft = ref<boolean>(true);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const keywords = ref<string>('');
const activKey = ref('1');
const currentNodeLevel = ref<number>();
const DesignrequirementsRef = ref<any>(null);
/** 列表请求参数 */
const requestParams = reactive(new DesignPageRequestDTOModel());
// ensure Select placeholder shows on first load (no selected value)
requestParams.requirementLevel = undefined;
const requirementLevelOptions = ref<Array<{ value: string; label: string }>>([
  { value: '一级需求', label: '一级需求' },
  { value: '二级需求', label: '二级需求' },
  { value: '三级需求', label: '三级需求' },
]);
const treeRequestParams = reactive(new ProductTreeInfoRequestDTOModel());
/** 列表数据 */
const resources = ref<Array<DesignInfoRequestDTOModel>>([]);

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
  },
};

const loading = ref<boolean>(false);
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'seq',
    key: 'seq',
    align: 'center',
    resizable: true,
    width: 80,
  },
  {
    title: WeiI18n.$t('编号'),
    dataIndex: 'num',
    key: 'num',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.num, b.num),
    width: 140,
  },
  {
    title: WeiI18n.$t('需求级别'),
    dataIndex: 'requirementLevel',
    key: 'requirementLevel',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementLevel, b.requirementLevel),
    width: 80,
  },
  {
    title: WeiI18n.$t('名称'),
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    width: 200,
  },
  {
    title: WeiI18n.$t('描述'),
    dataIndex: 'standard',
    key: 'standard',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.standard, b.standard),
    width: 500,
  },
  {
    title: WeiI18n.$t('产品平台'),
    dataIndex: 'productPlatform',
    key: 'productPlatform',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.productPlatform, b.productPlatform),
    width: 180,
  },
  {
    title: WeiI18n.$t('系统'),
    dataIndex: 'sys',
    key: 'sys',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.sys, b.sys),
    width: 100,
  },
  {
    title: WeiI18n.$t('部件/部位'),
    dataIndex: 'part',
    key: 'part',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.part, b.part),
    width: 80,
  },
  {
    title: WeiI18n.$t('重要性'),
    dataIndex: 'importance',
    key: 'importance',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.importance, b.importance),
    width: 80,
  },
  {
    title: WeiI18n.$t('专业分类'),
    dataIndex: 'businessClassification',
    key: 'businessClassification',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.businessClassification, b.businessClassification),
    width: 120,
  },
  {
    title: WeiI18n.$t('需求分类'),
    dataIndex: 'requirementsClassification',
    key: 'requirementsClassification',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.requirementsClassification, b.requirementsClassification),
    width: 180,
  },
  {
    title: WeiI18n.$t('适用阶段'),
    dataIndex: 'term',
    key: 'term',
    align: 'left',
    resizable: true,
    width: 250,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'text',
    key: 'text',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.text, b.text),
    width: 200,
  },
]);

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    const res = await AdminApiSystemProduct.getDesignTree(new ProductTreeInfoRequestDTOModel());
    if (res.data.code == 0 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData;
      console.log(rawData);
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = '';
        nextTick(() => {
          if (type) {
            if (currentNode.value.key) {
              let rootNode = findNodeByIdFromKey(treeData.value, currentNode.value.key, 'key');
              selectNode(rootNode);
            }
          } else {
            selectedKeys.value = treeNodes[0].key;
            expandedKeys.value = treeNodes[0].key;
            selectNode(treeNodes[0]);
          }
        });
      }
    }
  } catch (error) {
    console.error('获取树数据失败:', error);
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}

onMounted(() => {
  getListData();
});

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map(item => {
    // 判断是否为根节点：pid不存在、为0或为空字符串通常表示根节点
    const isRootNode = !item.pid || item.pid === 0 || item.pid === '';
    // 判断是否有子节点
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

    // 根据规则设置level值
    let level = 3; // 默认值为3（没有子节点的情况）
    if (isRootNode) {
      level = 1; // 根节点level为1
    } else if (hasChildren) {
      level = 2; // 有子节点的非根节点level为2
    }

    return {
      level: level,
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || item.title || '',
      // 添加type字段，用于在Tree组件中区分节点类型
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      fileId: item.fileId,
      fileUrl: item.fileUrl,
      pid: item.pid,
      seq: item.seq,
      text: item.text,
      userId: item.userId,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    await getListData();
    return;
  }

  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes(dataSource.value, searchValue);
  console.log(filteredData);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.name && node.name.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (node.children && node.children.length > 0) {
        matchingChildren = filterTreeNodes(node.children, searchValue);
      }

      // 如果当前节点匹配或有匹配的子节点，则保留该节点
      if (isMatch || matchingChildren.length > 0) {
        return {
          ...node,
          children: matchingChildren,
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉null值
}

/** 获取节点添加数据 */
async function getNodeAddData(key: string) {
  // 这里可以根据需要实现添加节点的逻辑
  if (key === undefined) {
    key = selectedKeys.value;
  }
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('节点名称').value,
      key: 'name',
      value: '',
      type: 'input',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点名称不能为空').value,
        },
      ],
    },
    {
      title: WeiI18n.t('父节点ID').value,
      key: 'pid',
      value: 0,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('层级').value,
      key: 'level',
      value: 0,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('用户ID').value,
      key: 'userId',
      value: 0,
      type: 'input',
      disabled: true,
      hidden: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}
const currentNode = ref();
async function downNode(selectedKeys: any) {
  treeRequestParams.id = selectedKeys.key;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.designTreeMoveDown(treeRequestParams);
  await getListData('change');
  Selectafterchanges();
}

async function upNode(selectedKeys: any) {
  treeRequestParams.id = selectedKeys.key;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.designTreeMoveUp(treeRequestParams);
  await getListData('change');
  Selectafterchanges();
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}
async function selectNode(node: any) {
  currentNode.value = node;
  currentNodeLevel.value = node.level;
  keywords.value = '';
  selectNodeKeys.value = node.key;
  if (node.level == 1) {
    activKey.value = '1';
  }
  if (activKey.value == '1') {
    loadDesignListData();
  } else {
    DesignrequirementsRef.value.initgetListData(currentNode.value);
  }
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('节点名称').value,
      key: 'name',
      value: currentNode.value.partName,
      type: 'input',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点名称不能为空').value,
        },
      ],
    },
    {
      title: WeiI18n.t('父节点ID').value,
      key: 'pid',
      value: currentNode.value.pid,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('层级').value,
      key: 'level',
      value: currentNode.value.level,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('用户ID').value,
      key: 'userId',
      value: currentNode.value.userId,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('id').value,
      key: 'id',
      value: currentNode.value.key,
      type: 'input',
      disabled: true,
      hidden: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  treeRequestParams.ids = [];
  treeRequestParams.ids?.push(selectedKeys.key);
  const res = await AdminApiSystemProduct.designTreeDel(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('删除成功').value);
}

/** 提交树节点数据 */
async function submitTreeData(nodeList: any, selectedKeys: any) {
  treeRequestParams.level = nodeList.level;
  treeRequestParams.name = nodeList.name;
  treeRequestParams.pid = nodeList.parentId;
  console.log(treeRequestParams);
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.addDesignTree(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

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

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  treeRequestParams.level = nodeList.level;
  treeRequestParams.name = nodeList.name;
  treeRequestParams.pid = nodeList.parentId;
  treeRequestParams.id = nodeList.id;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.updateesignTree(treeRequestParams);
  await getListData('change');
  message.success(WeiI18n.t('修改成功').value);
  Selectafterchanges();
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}

function handleResizeColumn(w, col) {
  col.width = w;
}

async function loadDesignListData() {
  loading.value = true;
  try {
    requestParams.auditId = selectNodeKeys.value || selectedKeys.value;
    requestParams.keywords = keywords.value;
    requestParams.userId = userStore.getUser.id + '';
    // requestParams.contents = contents.value;
    // requestParams.terms = terms.value;
    const res = await AdminApiSystemDesign.getDesignPageList({
      ...requestParams,
    });
    resources.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}
async function handleTabChange(key: string) {
  activKey.value = key;
  await nextTick();
  if (activKey.value == '1') {
    loadDesignListData();
  } else if (activKey.value == '2') {
    DesignrequirementsRef.value.initgetListData(currentNode.value);
  }
}
</script>

<template>
  <div class="drawerContent">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <a-spin :spinning="loadingTree" tip="加载中...">
          <Tree
            ref="treePage"
            :operate-flag="false"
            :tree-data="treeData"
            bomType="unBom"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            @select-node="selectNode"
            @get-node-update-data="getNodeUpdateData"
            @up-Node="upNode"
            @down-Node="downNode"
            @get-node-add-data="getNodeAddData"
            @delete-tree-node="deleteTreeNode"
            @submit="submitTreeData"
            @edit="editTreeData"
            @reload-tree="reloadTree"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <a-card style="margin-top: 10px" class="tab-container">
          <a-tabs :default-active-key="activKey" @change="handleTabChange">
            <a-tab-pane key="1" tab="设计项点">
              <a-form style="margin-bottom: 10px" layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
                <a-form-item name="requirementLevel">
                  <a-select v-model:value="requestParams.requirementLevel" style="width: 150px" placeholder="请选择需求级别" allow-clear @change="loadDesignListData">
                    <a-select-option v-for="option in requirementLevelOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item name="keywords">
                  <a-input v-model:value="keywords" style="width: 220px" allow-clear :placeholder="$t('请输入项点名称')" />
                </a-form-item>

                <a-form-item>
                  <a-button type="primary" @click="loadDesignListData">
                    <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                    {{ $t('查询') }}
                  </a-button>
                </a-form-item>
              </a-form>
              <a-table
                :scroll="{ x: 1200, y: 500 }"
                :row-key="(record: any) => record.id"
                :columns="columns"
                :data-source="resources"
                :pagination="false"
                @resizeColumn="handleResizeColumn"
                :locale="locale"
                :loading="loading"
                :sticky="true"
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
                  <template v-else-if="column.dataIndex === 'term'">
                    <div class="status-tags" v-if="+record.term === 1" style="margin-left: 10px"><span>方案设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 2" style="margin-left: 10px"><span>系统设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 3" style="margin-left: 10px"><span>详细设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 4" style="margin-left: 10px"><span>方案设计</span><span>系统设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 5" style="margin-left: 10px"><span>方案设计</span><span>详细设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 6" style="margin-left: 10px"><span>系统设计</span><span>详细设计</span></div>
                    <div class="status-tags" v-else-if="+record.term === 7" style="margin-left: 10px"><span>方案设计</span><span>系统设计</span><span>详细设计</span></div>
                    <div class="status-tags" style="margin-left: 10px" v-else><span>未知</span></div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane v-if="currentNodeLevel == 1" key="2" tab="DF(x)需求">
              <Designrequirements ref="DesignrequirementsRef" :current-node-data="currentNode" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
.drawerContent {
  display: flex;
  position: sticky;
  bottom: 20px !important;
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-tabs-tab .ant-tabs-nav-wrap) {
  display: none !important;
}

// :deep(.ant-table-tbody > tr > td) {
//   padding: 5px;
// }

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}

//表格里的适用阶段样式
.status-tags {
  span {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: #6a696e;
    line-height: 12px;
    font-style: normal;
    text-transform: none;
    min-width: 64px;
    height: 20px;
    background: #eaeaf1;
    border-radius: 13px 13px 13px 13px;
    text-align: center;
    padding: 4px 8px;
    margin-right: 4px;
  }
}
</style>
