<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message, Tooltip } from 'ant-design-vue';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { WeiI18n } from '@/utils/WeiI18n';
import Tree from '@/components/tree/tree.vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import ParameterDefinition from './conmmonets/parameterDefinition.vue';
import GBOMDefinition from './conmmonets/GBOMDefinition.vue';
import GBOMDefinitionChirdren from './conmmonets/GBOMDefinitionChirdren.vue';
import ProjectManager from './conmmonets/projectManager.vue';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import addGBOMParameterInfoModule from './conmmonets/modalComponent/selecgGBOMParamterInfoModuleUse.vue';
// 树结构相关属性
const activKey = ref('1');
const treeData = ref<any[]>([]);
const parameterDefinition = ref<any>(null);
const gBOMDefinition = ref<any>(null);
const gBOMDefinitionChirdren = ref<any>(null);
const projectManager = ref<any>(null);
const platformRequirements = ref<any>(null);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const showLeft = ref<boolean>(true);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
// 当前选中节点的层级
const currentNodeLevel = ref<number>(1);
// 当前选中的节点数据
const currentNodeData = ref<any>(null);
const treeRequestParams = reactive(new ProductTreeInfoRequestDTOModel());
treeRequestParams.userId = userStore.getUser.id;
const loading = ref<boolean>(false);
const loadingTree = ref<boolean>(false);
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData() {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    const res = await AdminApiSystemProduct.getProductTree(new ProductTreeInfoRequestDTOModel());
    if (res.data.code == 0 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData;
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        selectedKeys.value = treeNodes[0].key;
        expandedKeys.value = treeNodes[0].key;
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
  getPic();
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
      oldFileName: item.oldFileName,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

const picUrl = ref<string>('');
async function getPic() {
  const res = await AdminApiSystemProduct.getPic(treeRequestParams);
  picUrl.value = res.data.data;
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
      title: WeiI18n.t('节点详情').value,
      key: 'text',
      value: '',
      type: 'textarea',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点详情不能为空').value,
        },
      ],
    },
    {
      title: WeiI18n.t('示意图').value,
      key: 'uploadFile',
      value: '',
      type: 'upload',
      hidden: false,
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
      title: WeiI18n.t('文件ID').value,
      key: 'fileId',
      value: 0,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('文件URL').value,
      key: 'fileUrl',
      value: '',
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

async function downNode(selectedKeys: any) {
  treeRequestParams.id = selectedKeys.key;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.moveDownProductTree(treeRequestParams);
  await getListData();
}

async function upNode(selectedKeys: any) {
  treeRequestParams.id = selectedKeys.key;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.moveUpProductTree(treeRequestParams);
  await getListData();
}

async function selectNode(selectedKeys: any) {
  currentNodeLevel.value = selectedKeys.level || 1;
  currentNodeData.value = selectedKeys;
  // 使用nextTick确保组件已经挂载完成
  await nextTick();
  if (activKey.value === '1') {
    parameterDefinition.value?.reloadTableParameter(selectedKeys);
  } else if (activKey.value === '2') {
    if (currentNodeLevel.value == 2) {
      gBOMDefinition.value?.reloadTableParameter(selectedKeys);
    } else {
      gBOMDefinitionChirdren.value?.reloadTableParameter(selectedKeys);
    }
  } else if (activKey.value === '3') {
    if (currentNodeLevel.value == 2) {
      platformRequirements.value?.initgetListData(currentNodeData.value);
    } else {
      projectManager.value?.reloadTableParameter(selectedKeys);
    }
  }
}

async function handleTabChange(key: string) {
  activKey.value = key;
  await nextTick();
  if (activKey.value === '1') {
    parameterDefinition.value?.reloadTableParameter(currentNodeData.value);
  } else if (activKey.value === '2') {
    if (currentNodeLevel.value == 2) {
      gBOMDefinition.value?.reloadTableParameter(currentNodeData.value);
    } else {
      gBOMDefinitionChirdren.value?.reloadTableParameter(currentNodeData.value);
    }
  } else if (activKey.value === '3') {
    if (currentNodeLevel.value == 2) {
      platformRequirements.value?.initgetListData(currentNodeData.value);
    } else {
      projectManager.value?.reloadTableParameter(currentNodeData.value);
    }
  }
}

const updatePlatformParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());

const resource = ref<Array<any>>([]);
const updateParameterVisible = ref<boolean>(false);
async function gbomShow() {
  const res = await AdminApiSystemProduct.getGBOMTreeList(updatePlatformParameter);
  resource.value = res.data.data || [];
  updateParameterVisible.value = true;
}

function updateParameterVisibleCanel() {
  updateParameterVisible.value = false;
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  console.log(selectedKeys);
  treeNodeColmoun.value = [
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
      title: WeiI18n.t('节点详情').value,
      key: 'text',
      value: selectedKeys.text,
      type: 'textarea',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点详情不能为空').value,
        },
      ],
    },
    {
      title: WeiI18n.t('示意图').value,
      key: 'uploadFile',
      value: '',
      type: 'upload',
      hidden: false,
    },
    {
      title: WeiI18n.t('父节点ID').value,
      key: 'pid',
      value: selectedKeys.pid,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('文件ID').value,
      key: 'fileId',
      value: selectedKeys.fileId,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('文件URL').value,
      key: 'fileUrl',
      value: selectedKeys.fileUrl,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('层级').value,
      key: 'level',
      value: selectedKeys.level,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('用户ID').value,
      key: 'userId',
      value: selectedKeys.userId,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('id').value,
      key: 'id',
      value: selectedKeys.key,
      type: 'input',
      disabled: true,
      hidden: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value, selectedKeys.oldFileName);
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  treeRequestParams.ids = [];
  treeRequestParams.ids?.push(selectedKeys.key);
  const res = await AdminApiSystemProduct.delProductTree(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('删除成功').value);
}

/** 提交树节点数据 */
async function submitTreeData(nodeList: any, selectedKeys: any) {
  treeRequestParams.fileId = nodeList.fileId;
  treeRequestParams.fileUrl = nodeList.fileUrl;
  treeRequestParams.level = nodeList.level;
  treeRequestParams.name = nodeList.name;
  treeRequestParams.pid = nodeList.parentId;
  treeRequestParams.text = nodeList.text;
  console.log(treeRequestParams);
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.addProductTree(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  treeRequestParams.fileId = nodeList.fileId;
  treeRequestParams.fileUrl = nodeList.fileUrl;
  treeRequestParams.level = nodeList.level;
  treeRequestParams.name = nodeList.name;
  treeRequestParams.pid = nodeList.parentId;
  treeRequestParams.text = nodeList.text;
  treeRequestParams.id = nodeList.id;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.updateProductTree(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('修改成功').value);
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}

const {
  leftTreeCollapsed,
  leftTreePaneSize,
  rightTreePaneSize,
  minExpanded,
  onSplitpanesResized,
  toggleLeftTreePanel,
  splitToggleStyle,
  splitpanesTreeCollapseWrapClass,
} = useSplitpanesTreeCollapse();
</script>

<template>
  <div class="drawerContent">
    <div :class="splitpanesTreeCollapseWrapClass">
    <Splitpanes class="default-theme sbom" @resize="onSplitpanesResized" @resized="onSplitpanesResized">
      <Pane :min-size="leftTreeCollapsed ? 0 : minExpanded" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
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
      <Pane class="splitpane-cls" :size="rightTreePaneSize">
        <!-- 当level等于1时显示的界面 -->
        <div v-if="currentNodeLevel === 1" class="level-1-content">
          <a-card>
            <a-link
              style="cursor: pointer; color: #165dff; text-decoration: none"
              @mouseenter="e => (e.target.style.textDecoration = 'underline')"
              @mouseleave="e => (e.target.style.textDecoration = 'none')"
              @click="gbomShow"
              type="primary"
              >超级构型结构</a-link
            >
            <div style="width: 80%; height: 100%; margin-top: 20px">
              <a-image style="width: 100%; height: 450px" :src="picUrl" fit="contain" :preview="false" />
            </div>
          </a-card>
        </div>
        <!-- 当level等于3时显示的界面 -->
        <div v-else class="level-3-content">
          <div class="tab-container">
            <a-card>
              <a-tabs :default-active-key="activKey" @change="handleTabChange">
                <a-tab-pane key="1" tab="参数定义">
                  <ParameterDefinition ref="parameterDefinition" :current-node-data="currentNodeData" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="模块结构树">
                  <GBOMDefinition ref="gBOMDefinition" :current-node-data="currentNodeData" v-if="currentNodeLevel === 2" />
                  <GBOMDefinitionChirdren ref="gBOMDefinitionChirdren" :current-node-data="currentNodeData" v-if="currentNodeLevel === 3" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="项目管理" v-if="currentNodeLevel === 3">
                  <ProjectManager ref="projectManager" :current-node-data="currentNodeData" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="平台需求" v-if="currentNodeLevel === 2">
             
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </div>
        </div>
      </Pane>
    </Splitpanes>
    <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
      <button
        type="button"
        class="splitpanes-tree-collapse-wrap__toggle"
        :style="splitToggleStyle"
        @click="toggleLeftTreePanel"
        @mousedown.stop>
        <LeftOutlined v-if="!leftTreeCollapsed" />
        <RightOutlined v-else />
      </button>
    </Tooltip>
    </div>
  </div>

  <addGBOMParameterInfoModule ref="updateParameterInfoModuleRef" :modal-visible="updateParameterVisible" :resource="resource" @close="updateParameterVisibleCanel" />
</template>

<style lang="less" scoped>
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

.stat-item {
  text-align: center;
  padding: 10px 20px;
  background: #f5f5f5;
  border-radius: 4px;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.stat-label {
  margin-top: 5px;
  color: #666;
}

.platform-actions {
  display: flex;
  gap: 10px;
}

/* 层级2和层级3界面样式 */
.tab-container {
  height: 100%;
}

.params-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 直接设置表格区域足够高度，确保显示所有139条数据 */
.ant-table-wrapper {
  height: calc(100vh - 300px);
  overflow: auto;
}

/* 确保表格头部固定，只让表格主体滚动 */
.ant-table {
  min-height: 100%;
}

.ant-table-body {
  overflow-y: auto;
  overflow-x: auto;
}

/* 项目管理区域样式 */
.project-info {
  padding: 20px;
  text-align: center;
}
</style>
