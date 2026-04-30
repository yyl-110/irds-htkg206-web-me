<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import { message, Tooltip } from 'ant-design-vue';
import Tree from '@/components/tree/tree.vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import SelectBoomTree from '@/views/product/module/components/selectBoomTree.vue';
import UdfImgList from './components/form/UdfImgList.vue';
import UdfInfoList from './components/form/UdfListAdm.vue';

const loadingTree = ref<boolean>(false);
const treeData = ref<any[]>([]);
const rawTreeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const currentNode = ref<any>(null);
const categoryid = ref<string>('');
const menuId = ref<string>('10');
const categoryType = ref<string>('');
const loading = ref<boolean>(false);
const UdfImgListRef = ref<InstanceType<typeof UdfImgList>>();
const UdfInfoListRef = ref<InstanceType<typeof UdfInfoList>>();
const treePage = ref<any>(null);
const treeNodeColmoun = ref<any[]>([]);
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);
const selectTreeData1 = ref<any[]>([]);
const selectTreeVisible = ref<boolean>(false);
const selectTreeVisible1 = ref<boolean>(false);
const selectTreeSelectedKeys = ref<string>('');
const selectTreeSelectedKeys1 = ref<string>('');
const updatePlatformParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());

const { leftTreeCollapsed, leftTreePaneSize, rightTreePaneSize, minExpanded, onSplitpanesResized, toggleLeftTreePanel, splitToggleStyle, splitpanesTreeCollapseWrapClass } =
  useSplitpanesTreeCollapse();

onMounted(() => {
  getListData();
});

/** 将接口返回数据转换为 Tree 组件结构 */
function convertToTreeNodes(data: any[]): any[] {
  return (data || []).map(item => {
    // 判断是否为根节点：使用moduleLevel和nodeRootType字段
    // 根节点通常是moduleLevel为1或nodeRootType有特定值的节点
    const isRootNode = item.categoryType === 1 || item.categoryType === 2;
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
      key: String(item?.id ?? item?.tid ?? ''),
      id: item?.id,
      partName: item?.categoryName || '',
      categoryName: item?.categoryName || '',
      categoryType: item?.categoryType,
      parentId: item?.parentId,
      menuId: item?.menuId,
      level: level, // 设置level值
      moduleCount: item?.moduleCount || 0,
      type: 'category',
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

/** 获取左侧树数据 */
async function getListData(targetKey?: string) {
  loadingTree.value = true;
  try {
    const res = await AdminApiSystemModule.getResourceLibraryTree({ menuId: 10 });
    if (res?.data?.code === 200 && res?.data?.data) {
      const source = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      rawTreeData.value = source;
      const nodes = convertToTreeNodes(source);
      treeData.value = nodes;
      if (nodes.length > 0) {
        const fallbackKey = String(currentNode.value?.key || selectedKeys.value || '');
        const nextTargetKey = String(targetKey || fallbackKey || '');
        const matchedNode = nextTargetKey ? findNodeById(nodes, nextTargetKey) : null;
        const defaultNode = matchedNode || nodes[0];
        nextTick(() => {
          selectedKeys.value = defaultNode.key;
          expandedKeys.value = defaultNode.key;
          selectNode(defaultNode);
        });
      }
    } else {
      treeData.value = [];
    }
  } catch (error) {
    message.error('获取树数据失败!');
  } finally {
    loadingTree.value = false;
  }
}

/** 选中树节点 */
function selectNode(node: any) {
  currentNode.value = node;
  selectedKeys.value = String(node?.key || '');
  categoryid.value = node?.key ? String(node.key) : String(node?.id || '');
  menuId.value = '10';
  categoryType.value = String(node?.categoryType || '');
  if (categoryType.value == '2' || categoryType.value == '3') {
    nextTick(() => {
      UdfImgListRef.value?.infoReload(categoryid.value, menuId.value, 'manager');
    });
  } else {
    nextTick(() => {
      UdfInfoListRef.value?.infoReload(categoryid.value, menuId.value);
    });
  }
}

async function upNode(node: any) {
  const targetNode = node || currentNode.value || treeData.value[0];
  if (!targetNode?.key) return;
  await AdminApiSystemProduct.sortUp({ id: targetNode.key });
  await getListData(String(targetNode.key));
}

async function downNode(node: any) {
  const targetNode = node || currentNode.value || treeData.value[0];
  if (!targetNode?.key) return;
  await AdminApiSystemProduct.sortDown({ id: targetNode.key });
  await getListData(String(targetNode.key));
}

async function getNodeUpdateData(node: any) {
  const targetNode = node || currentNode.value || treeData.value[0];
  if (!targetNode?.key) return;
  const res = await AdminApiSystemProduct.getCategpryInfoById({ id: targetNode.key });
  const nodeInfo = res?.data?.data || {};
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: nodeInfo.parentName || '',
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'categoryName',
      value: nodeInfo.categoryName || '',
      type: 'input',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点名称不能为空').value }],
    },
    {
      title: WeiI18n.t('节点类别').value,
      key: 'categoryType',
      value: nodeInfo.categoryType,
      type: 'select',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点类别不能为空').value }],
      selectStr: [
        { label: '数据节点', value: 4 },
        { label: '分类节点', value: 3 },
      ],
    },
    { title: 'id', key: 'id', value: targetNode.key, type: 'input', hidden: true, disabled: true },
    { title: 'pid', key: 'pid', value: nodeInfo.parentid || targetNode.parentId || 0, type: 'input', hidden: true, disabled: true },
    { title: 'fileId', key: 'fileId', value: nodeInfo.fileId || 0, type: 'input', hidden: true, disabled: true },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

async function getNodeAddData() {
  const parentNode = currentNode.value;
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: parentNode?.partName || '根节点',
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'categoryName',
      value: '',
      type: 'input',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点名称不能为空').value }],
    },
    {
      title: WeiI18n.t('节点类别').value,
      key: 'categoryType',
      value: '',
      type: 'select',
      hidden: false,
      rules: [{ required: true, message: WeiI18n.t('节点类别不能为空').value }],
      selectStr: [
        { label: '数据节点', value: 4 },
        { label: '分类节点', value: 3 },
      ],
    },
    { title: 'pid', key: 'pid', value: parentNode?.key || 0, type: 'input', hidden: true, disabled: true },
    { title: 'fileId', key: 'fileId', value: 0, type: 'input', hidden: true, disabled: true },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

async function deleteTreeNode(node: any) {
  const targetNode = node || currentNode.value || treeData.value[0];
  if (!targetNode?.key) return;
  await AdminApiSystemProduct.delTreeNodetoManagement({ id: targetNode.key });
  message.success(WeiI18n.t('删除成功').value);
  await getListData();
}

async function submitTreeData(nodeList: any) {
  const keepKey = String(currentNode.value?.key || '');
  treeRequestParams.categoryName = nodeList.categoryName;
  treeRequestParams.categoryType = nodeList.categoryType;
  treeRequestParams.parentId = nodeList.pid;
  treeRequestParams.fileId = nodeList.fileId || 0;
  treeRequestParams.menuId = 10;
  await AdminApiSystemProduct.addEmptyNodetoManagement({ ...treeRequestParams });
  message.success(WeiI18n.t('保存成功').value);
  await getListData(keepKey);
}

async function editTreeData(nodeList: any) {
  const keepKey = String(nodeList?.id || currentNode.value?.key || '');
  treeRequestParams.id = nodeList.id;
  treeRequestParams.categoryName = nodeList.categoryName;
  treeRequestParams.categoryType = nodeList.categoryType;
  treeRequestParams.parentId = nodeList.pid;
  treeRequestParams.fileId = nodeList.fileId || 0;
  treeRequestParams.menuId = 10;
  await AdminApiSystemProduct.updateTreeNodetoManagement({ ...treeRequestParams });
  message.success(WeiI18n.t('修改成功').value);
  await getListData(keepKey);
}

async function selectBoomTree(field: any) {
  currentSelectField.value = field;
  selectTreeData.value = JSON.parse(JSON.stringify(treeData.value));
  selectTreeVisible.value = true;
}

async function selectBoomTree1(field: any) {
  currentSelectField.value = field;
  const res = await AdminApiSystemProduct.getGBOMTreeList(updatePlatformParameter);
  function normalizeTree(nodes: any[]): any[] {
    if (!Array.isArray(nodes)) return [];
    return nodes.map((n: any) => {
      const node = { ...n };
      const displayName = node.partName || node.name || node.title || node.label || node.part_name || node.descript || node.pdmName || node.description || node.text || '';
      node.partName = node.techid ? `${displayName}(${node.techid})` : displayName;
      if (node.id !== undefined && node.id !== null) {
        node.key = String(node.id);
      } else if (!node.key) {
        node.key = node.tid || node.id || node.key || '';
      }
      if (Array.isArray(node.children)) {
        node.children = normalizeTree(node.children);
      }
      return node;
    });
  }
  selectTreeData1.value = normalizeTree(JSON.parse(JSON.stringify(res?.data?.data || [])));
  selectTreeVisible1.value = true;
}

function findNodeById(tree: any[], targetId: string): any | null {
  for (const node of tree || []) {
    if (String(node?.key || '') === String(targetId || '')) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function confirmSelectTreeNode() {
  if (selectTreeSelectedKeys.value && currentSelectField.value) {
    const selectedNode = findNodeById(selectTreeData.value, selectTreeSelectedKeys.value);
    if (selectedNode) {
      treePage.value?.onTreeNodeSelected({
        key: selectedNode.key,
        title: selectedNode.partName,
        fieldKey: currentSelectField.value.key,
      });
    }
  }
  selectTreeVisible.value = false;
  selectTreeSelectedKeys.value = '';
}

function confirmSelectTreeNode1() {
  if (selectTreeSelectedKeys1.value && currentSelectField.value) {
    const selectedNode = findNodeById(selectTreeData1.value, selectTreeSelectedKeys1.value);
    if (selectedNode) {
      treePage.value?.onTreeNodeSelected({
        key: selectedNode.key,
        title: selectedNode.partName,
        fieldKey: currentSelectField.value.key,
        techid: selectedNode.techid || selectedNode.pdmName || selectedNode.techID || selectedNode.techId || '',
      });
    }
  }
  selectTreeVisible1.value = false;
  selectTreeSelectedKeys1.value = '';
}

function cancelSelectTreeNode() {
  selectTreeVisible.value = false;
  selectTreeSelectedKeys.value = '';
}

function cancelSelectTreeNode1() {
  selectTreeVisible1.value = false;
  selectTreeSelectedKeys1.value = '';
}

function handleSelectTreeNode(selectedKeys: any[]) {
  selectTreeSelectedKeys.value = selectedKeys[0];
}

function handleSelectTreeNode1(selectedKeys: any[]) {
  selectTreeSelectedKeys1.value = selectedKeys[0];
}

function actionNode(item: any) {
  nextTick(() => {
    selectNode(item);
    selectedKeys.value = String(item?.id || item?.key || '');
  });
}

async function getCategory(targetCategoryId: any) {
  const targetId = String(targetCategoryId || '');
  if (!targetId) return;
  const targetNode = findNodeById(treeData.value, targetId);
  if (!targetNode) {
    message.warning('未找到对应树节点');
    return;
  }
  selectedKeys.value = targetId;
  expandedKeys.value = targetId;
  nextTick(() => {
    selectNode(targetNode);
  });
}

/** 按关键字过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return (nodes || [])
    .map(node => {
      const isMatch = String(node?.categoryName || '')
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchedChildren = Array.isArray(node?.children) ? filterTreeNodes(node.children, searchValue) : [];
      if (isMatch || matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren,
        };
      }
      return null;
    })
    .filter(Boolean) as any[];
}

/** 树搜索 */
async function handleChangeSelectKey(searchValue: string) {
  if (!searchValue) {
    treeData.value = convertToTreeNodes(rawTreeData.value);
    return;
  }
  const filtered = filterTreeNodes(rawTreeData.value, searchValue);
  treeData.value = convertToTreeNodes(filtered);
}

/** 重新加载树结构 */
async function reloadTree() {
  await getListData();
}
</script>

<template>
  <SelectBoomTree
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="selectTreeData"
    :select-tree-selected-keys="selectTreeSelectedKeys"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancel-select-tree-node="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode" />
  <SelectBoomTree
    ref="selectBoomTreeRef1"
    :modal-visible="selectTreeVisible1"
    :select-tree-data="selectTreeData1"
    :select-tree-selected-keys="selectTreeSelectedKeys1"
    @confirm-select-tree-node="confirmSelectTreeNode1"
    @cancel-select-tree-node="cancelSelectTreeNode1"
    @handle-select-tree-node="handleSelectTreeNode1" />
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
              @select-boom-tree1="selectBoomTree1"
              @edit="editTreeData"
              @reload-tree="reloadTree"
              @change-select-key="handleChangeSelectKey" />
          </a-spin>
        </Pane>
        <Pane class="splitpane-cls module-index-right-pane" :size="rightTreePaneSize">
          <div v-if="!loading" class="module-index-right-inner">
            <UdfImgList v-if="categoryType == '1' || categoryType == '2' || categoryType == '3'" ref="UdfImgListRef" @actionNode="actionNode" @getCategory="getCategory" />
            <UdfInfoList v-else ref="UdfInfoListRef" :categoryid="categoryid" :menuId="menuId" @getCategory="getCategory" />
          </div>
        </Pane>
      </Splitpanes>
      <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
        <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle" @click="toggleLeftTreePanel" @mousedown.stop>
          <LeftOutlined v-if="!leftTreeCollapsed" />
          <RightOutlined v-else />
        </button>
      </Tooltip>
    </div>
  </div>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}

:deep(.splitpanes.default-theme .splitpanes__pane) {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.module-index-right-pane {
  min-height: 0;
  overflow: hidden;
}

.module-index-right-inner {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* 与 Main 主区 flex 定高一致，避免 sticky+底边偏移撑高文档 */
.drawerContent {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff !important;
  box-sizing: border-box;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-drawer-content-wrapper) {
  width: 480px !important;
}

:deep(.b-body) {
  height: calc(100vh - 125px);
  overflow: auto;
}
:deep(.ant-drawer-body) {
  padding: 2px;
}

.menuLi {
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.85);
}
.menuLi:hover {
  margin-left: 5px;
  color: #165dff;
}

.menuLi2 {
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.993);
}
.menuLi2:hover {
  margin-left: 5px;
  color: #165dff;
}
</style>
