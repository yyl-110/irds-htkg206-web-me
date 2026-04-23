<script setup lang="ts">
import { inject, nextTick, reactive, ref, h } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import { message, Tooltip } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import Tree from '@/components/tree/tree.vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import SelectBoomTree from './components/selectBoomTree.vue';
import ProcessFlowList from './components/process-flow-list.vue';
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const parameterName = ref<string>('');
const parameterNum = ref<string>('');
const selectNodeKeys = ref<string>('');
const currentNode = ref<any>();

const processFlowListRef = ref<any>(null);
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 列表请求参数 */
const requestParams = reactive(new ParameterPageRequestDTOModel());

const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());

/** 列表数据 */
const datasource = ref<Array<ParameterInfoRequestDTOModel>>([]);
const rawTreeData = ref<Array<any>>([]); // 保存完整的原始树数据

treeRequestParams.userid = userStore.getUser.id;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, loadParameterListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
const loading = ref<boolean>(false);

const menuId = ref<string>('');
function initInfoList(id: any) {
  menuId.value = id;
  getListData();
}
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const data: any = {};
    data.menuId = menuId.value;
    const res = await AdminApiSystemProcessTask.getDesignTaskAppTreeList(data);
    loadingTree.value = false;
    // 处理返回的数据格式
    if ((res.data.code == 0 || res.data.code == 200) && res.data.data) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      // 保存原始数据
      dataSource.value = rawData[0];
      rawTreeData.value = rawData;
      const treeNodes = convertToTreeNodes(rawTreeData.value);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = '';
        nextTick(() => {
          if (type) {
            if (currentNode.value.key) {
              let rootNode = findNodeByIdFromKey(treeData.value, currentNode.value.key, 'key');
              // 刷新后需要重新设置 expandedKeys，避免三级节点被折叠
              const pathNodes = findNodePathByKey(treeNodes, String(currentNode.value.key));
              if (pathNodes && pathNodes.length) {
                expandedKeys.value = pathNodes
                  .filter(n => Array.isArray(n?.children) && n.children.length > 0)
                  .map(n => n.key)
                  .join(',');
              }
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

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  if (!data || !Array.isArray(data)) return [];

  return data.map(item => {
    // 判断是否有子节点
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    // 根据规则设置level值
    let level = 3; // 默认值为3（没有子节点的情况）
    if (hasChildren) {
      level = 2; // 有子节点的非根节点level为2
    }
    return {
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || '',
      type: 'param', // 对于产品平台管理，所有节点都视为分类节点
      categoryType: item.type,
      parentId: item.parentId,
      level: level, // 设置level值
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  if (!nodes || !Array.isArray(nodes)) return [];

  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.name && node.name.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
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
async function getNodeAddData(selectedKeys: any) {
  const parentNode = currentNode.value ?? selectedKeys ?? {};
  const parentName = String(parentNode?.partName ?? '');
  const parentKey = parentNode?.key ?? 0;
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: parentName,
      type: 'input',
      hidden: false,
      disabled: true,
    },
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
      value: parentKey,
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

async function downNode(selectedKeys: any) {
  await AdminApiSystemProcessTask.sortDownDesignTaskTree({ id: selectedKeys.key });
  await getListData('change');
  Selectafterchanges();
}

async function upNode(selectedKeys: any) {
  await AdminApiSystemProcessTask.sortUpDesignTaskTree({ id: selectedKeys.key });
  await getListData('change');
  Selectafterchanges();
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}
const currentNodeLevel = ref<number>(2);
async function selectNode(node: any) {
  currentNode.value = node;
  parameterName.value = '';
  parameterNum.value = '';
  selectNodeKeys.value = node.key;
  if (node.parentId == 0 || node.parentId == 1) {
    currentNodeLevel.value = 2;
  } else {
    currentNodeLevel.value = 3;
  }
  loadParameterListData();
}

async function loadParameterListData() {
  await processFlowListRef.value?.reloadList?.(true);
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  if (selectedKeys.parentId == 0) {
    message.warning('此节点不支持编辑');
    return;
  }
  // 根据 parentId 从 treeData 递归找父节点名称
  const parentId = String(selectedKeys?.parentId ?? '');
  const parentNode = parentId ? findNodeById(treeData.value, parentId) : null;
  const parentNodeName = parentNode?.partName ?? '';
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: parentNodeName,
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'name',
      value: selectedKeys.partName,
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
      value: selectedKeys.parentId,
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

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  if (selectedKeys.parentId == 0) {
    message.warning('此节点不支持删除');
    return;
  }
  const res = await AdminApiSystemProcessTask.deleteDesignTaskTree({ id: selectedKeys.key });
  await getListData();
  message.success(WeiI18n.t('删除成功').value);
}

// 树选择器模态框相关状态
const selectTreeVisible = ref<boolean>(false);
const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);
const selectTreeSelectedKeys = ref<string>('');
const selectTreeExpandedKeys = ref<string>('');

/**
 * 处理浏览按钮点击事件，显示树选择器模态框
 * @param field 当前点击的字段信息
 */
async function selectBoomTree(field: any) {
  debugger;
  currentSelectField.value = field;
  // 深拷贝当前树数据，避免影响主树结构
  selectTreeData.value = JSON.parse(JSON.stringify(treeData.value));
  selectTreeVisible.value = true;
}

/**
 * 处理树选择器中的节点选择
 * @param selectedKeys 选中的节点keys
 * @param info 节点信息
 */
function handleSelectTreeNode(selectedKeys: any[], info: any) {
  selectTreeSelectedKeys.value = selectedKeys[0];
}

/**
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
function confirmSelectTreeNode(item: any) {
  if (selectTreeSelectedKeys.value && currentSelectField.value) {
    // 查找选中的节点信息
    const selectedNode = findNodeById(selectTreeData.value, selectTreeSelectedKeys.value);
    if (selectedNode) {
      // 构建选中的节点数据
      const nodeData = {
        key: selectedNode.key,
        title: selectedNode.partName,
        fieldKey: currentSelectField.value.key,
        categoryType: selectedNode.categoryType,
      };
      console.log(nodeData);
      // 调用tree组件的方法，将选中的节点数据传递回去
      treePage.value?.onTreeNodeSelected(nodeData);
    }
  }
  selectTreeVisible.value = false;
  // 重置选中状态
  selectTreeSelectedKeys.value = '';
}

/**
 * 取消选择树节点
 */
function cancelSelectTreeNode() {
  selectTreeVisible.value = false;
  // 重置选中状态
  selectTreeSelectedKeys.value = '';
}

/**
 * 递归查找树中的节点
 * @param tree 树数据
 * @param targetId 目标节点ID
 * @returns 找到的节点或null
 */
function findNodeById(tree: any[], targetId: string): any | null {
  for (const node of tree) {
    if (node.key === targetId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, targetId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * 查找从根到目标节点的路径（包含目标节点）
 * 用于刷新后恢复 expandedKeys，避免折叠丢失三级节点展示
 */
function findNodePathByKey(nodes: any[], targetKey: string, path: any[] = []): any[] | null {
  for (const node of nodes || []) {
    const nextPath = [...path, node];
    if (String(node?.key ?? '') === String(targetKey ?? '')) {
      return nextPath;
    }
    if (Array.isArray(node?.children) && node.children.length > 0) {
      const childPath = findNodePathByKey(node.children, targetKey, nextPath);
      if (childPath) return childPath;
    }
  }
  return null;
}
/** 提交树节点数据 */
async function submitTreeData(nodeList: any) {
  console.log(nodeList);
  const data: any = {};
  data.name = nodeList.name;
  data.parentId = nodeList.pid || 0;
  data.menuId = menuId.value;
  const res = await AdminApiSystemProcessTask.createDesignTaskTree(data);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  const data: any = {};
  data.name = nodeList.name;
  data.parentId = nodeList.pid;
  data.id = nodeList.id;
  data.menuId = menuId.value;
  const res = await AdminApiSystemProcessTask.updateDesignTaskTree(data);
  await getListData('change');
  message.success(WeiI18n.t('修改成功').value);
  Selectafterchanges();
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}

/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    await getListData();
    return;
  }
  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes([dataSource.value], searchValue);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

const { leftTreeCollapsed, leftTreePaneSize, rightTreePaneSize, minExpanded, onSplitpanesResized, toggleLeftTreePanel, splitToggleStyle, splitpanesTreeCollapseWrapClass } = useSplitpanesTreeCollapse();
defineExpose({ initInfoList });
</script>

<template>
  <div class="drawerContent">
    <div :class="splitpanesTreeCollapseWrapClass">
      <Splitpanes class="default-theme sbom" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
        <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
          <a-spin :spinning="loadingTree" tip="加载中...">
            <Tree
              ref="treePage"
              :operate-flag="true"
              :tree-data="treeData"
              bomType="unBom"
              :selected-keys="selectedKeys"
              :expanded-keys="expandedKeys"
              @select-node="selectNode"
              @up-Node="upNode"
              @down-Node="downNode"
              @get-node-update-data="getNodeUpdateData"
              @get-node-add-data="getNodeAddData"
              @delete-tree-node="deleteTreeNode"
              @submit="submitTreeData"
              @select-Boom-Tree="selectBoomTree"
              @edit="editTreeData"
              @reload-tree="reloadTree"
              @change-select-key="handleChangeSelectKey" />
          </a-spin>
        </Pane>

        <!-- 右侧内容区域 -->
        <Pane class="splitpane-cls" :size="rightTreePaneSize">
          <ProcessFlowList ref="processFlowListRef" :menu-id="menuId" :tree-node-key="selectNodeKeys" />
        </Pane>
      </Splitpanes>
      <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
        <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle" @click="toggleLeftTreePanel" @mousedown.stop>
          <LeftOutlined v-if="!leftTreeCollapsed" />
          <RightOutlined v-else />
        </button>
      </Tooltip>
    </div>

    <!-- 其他弹窗/组件 -->
    <SelectBoomTree
      ref="selectBoomTreeRef"
      :modal-visible="selectTreeVisible"
      :select-tree-data="selectTreeData"
      :select-tree-selected-keys="selectTreeSelectedKeys"
      @confirm-select-tree-node="confirmSelectTreeNode"
      @cancel-select-tree-node="cancelSelectTreeNode"
      @handle-select-tree-node="handleSelectTreeNode" />
  </div>
</template>

<style lang="less" scoped>
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}
.drawerContent {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 120px);
  background-color: #ffffff !important;
}

.version-history-modal {
  .ant-modal-content {
    border-radius: 8px;
  }

  .modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e6e7e9;

    .ant-typography {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      color: #333;
    }
  }

  .ant-table {
    margin: 0;
    border-top: 0;
    border-bottom: 0;

    .ant-table-thead > tr > th {
      background-color: #f5f5f5;
      color: #333;
      font-weight: 500;
      padding: 12px;
      border-bottom: 1px solid #e6e7e9;
    }

    .ant-table-tbody > tr > td {
      padding: 10px;
      border-bottom: 1px solid #e6e7e9;
    }
  }
}
</style>
