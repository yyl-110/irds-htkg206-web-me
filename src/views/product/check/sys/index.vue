<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemCheckInfoApi } from '@/api/tags/check/计算管理后台';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Tree from '@/components/tree/checkTree.vue';
import { useUserStore } from '@/store/modules/user';
import { findNodeByIdFromKey } from '@/utils/tools';
import checkImgList from './componets/checkImgList.vue';
import templateInfo from './componets/templateInfo.vue';
import checkFlowApplay from './componets/checkFlowApplay.vue';
import { decryptValue } from '@/utils';
const route = useRoute();
const currentNodeLevel = ref<number>();
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const watchselectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const activKey = ref('1');
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const keywords = ref<string>('');
const selectNodeKeys = ref<string>('');
const loadingTree = ref<boolean>(false);
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
const checkImgListRefA = ref<any>({});
const checkImgListRefB = ref<any>({});
const templateInfoRef = ref<any>({});
const checkFlowApplayRef = ref<any>({});
const categoryType = ref<string>('');
const categoryId = ref<string>('');
/**
 * 根据给定的ID在树形结构中找到对应的节点
 *
 * @param tree 树形结构的数据
 * @param id 要查找的节点的ID
 * @returns 如果找到对应的节点，则返回该节点；否则返回null
 */
function findNodeById(tree: any, id: string): any | null {
  for (const node of tree) {
    if (node.id == id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const foundNode = findNodeById(node.children, id);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null; // 如果没有找到节点，返回null
}
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    let data: any = {};
    data.productType = '17';
    data.toolType = '1';
    const res = await AdminApiSystemCheckInfoApi.getAllCheckTreeData(data);
    // 处理返回的数据格式
    if (res.data.code == 0 && res.data.data.result) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data.result) ? res.data.data.result : [res.data.data.result];
      dataSource.value = rawData;
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
      // 默认选中第一个节点
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
            selectedKeys.value = watchselectedKeys.value || treeNodes[0].key;
            expandedKeys.value = treeNodes[0].key;
            if (watchselectedKeys.value) {
              // 查找选中的节点信息
              const selectedNode = findNodeById(treeNodes, watchselectedKeys.value);
              selectNode(selectedNode);
            } else {
              selectNode(treeNodes[0]);
            }
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
  return data.map(item => {
    // 判断是否为根节点：pid不存在、为0或为空字符串通常表示根节点
    const isRootNode = item.parentId === 0;
    // 判断是否有子节点
    const hasChildren = item.childrenList && Array.isArray(item.childrenList) && item.childrenList.length > 0;

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
      partName: item.nodeName,
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      parentId: item.parentId,
      children: hasChildren ? convertToTreeNodes(item.childrenList) : [],
      addTreeType: item.addTreeType,
      applicationType: item.applicationType,
      createBy: item.createBy,
      empowerFlag: item.empowerFlag,
      exeName: item.exeName,
      exeid: item.exeid,
      id: item.id,
      imageFileId: item.imageFileId,
      imageFileName: item.imageFileName,
      imageFileUrl: item.imageFileUrl,
      nodeCategory: item.nodeCategory,
      nodeEnName: item.nodeEnName,
      organizationalAffiliation1: item.organizationalAffiliation1,
      organizationalAffiliation2: item.organizationalAffiliation2,
      parentNodeName: item.parentNodeName,
      productType: item.productType,
      secretLevel: item.secretLevel,
      sort: item.sort,
      toolType: item.toolType,
      uploadFileList: item.uploadFileList,
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
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.nodeName && node.nodeName.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (node.childrenList && node.childrenList.length > 0) {
        matchingChildren = filterTreeNodes(node.childrenList, searchValue);
      }

      // 如果当前节点匹配或有匹配的子节点，则保留该节点
      if (isMatch || matchingChildren.length > 0) {
        return {
          ...node,
          childrenList: matchingChildren,
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉null值
}

const currentNode = ref();
const auditId = ref<string>('');
async function selectNode(node: any) {
  currentNode.value = node;
  currentNodeLevel.value = node.level;
  auditId.value = node.key;
  keywords.value = '';
  selectNodeKeys.value = node.key;
  categoryType.value = node.nodeCategory;
  categoryId.value = node.key;
  if (currentNode.value.nodeCategory == '1') {
    //计算程序节点
    if (activKey.value == '1') {
      //计算页面配置
      nextTick(() => {
        templateInfoRef.value?.infoReload(node);
      });
    } else {
      //计算应用管理
      nextTick(() => {
        checkFlowApplayRef.value?.infoReload(node, activKey.value);
      });
    }
  } else {
    //计算分类节点
    if (activKey.value == '1') {
      nextTick(() => {
        checkImgListRefA.value?.infoReload(categoryId.value);
      });
    } else {
      nextTick(() => {
        checkImgListRefB.value?.infoReload(categoryId.value);
      });
    }
  }
}

async function actionNode(item: any) {
  currentNode.value = item;
  selectedKeys.value = item.id + '';
  if (item.nodeCategory == '1') {
    categoryType.value = '1';
    if (activKey.value == '1') {
      nextTick(() => {
        templateInfoRef.value?.infoReload(item);
      });
    } else {
      nextTick(() => {
        checkFlowApplayRef.value?.infoReload(item, activKey.value);
      });
    }
  } else {
    if (activKey.value == '1') {
      nextTick(() => {
        checkImgListRefA.value?.infoReload(item.id);
      });
    } else {
      nextTick(() => {
        checkImgListRefB.value?.infoReload(item.id);
      });
    }
  }
}

async function handleTabChange(key: string) {
  activKey.value = key;
  if (currentNode.value.nodeCategory == '1') {
    //计算程序节点
    if (activKey.value == '1') {
      //计算页面配置
      nextTick(() => {
        templateInfoRef.value?.infoReload(currentNode.value);
      });
    } else {
      //计算应用管理
      nextTick(() => {
        checkFlowApplayRef.value?.infoReload(currentNode.value, activKey.value);
      });
    }
  } else {
    //计算分类节点
    if (activKey.value == '1') {
      nextTick(() => {
        checkImgListRefA.value?.infoReload(categoryId.value);
      });
    } else {
      nextTick(() => {
        checkImgListRefB.value?.infoReload(categoryId.value);
      });
    }
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
      key: 'parentId',
      value: currentNode.value.parentId,
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
onMounted(() => {
  getListData();
});
/** 重新加载树结构 */
async function reloadTree() {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    let data: any = {};
    data.productType = '17';
    data.toolType = '1';
    const res = await AdminApiSystemCheckInfoApi.getAllCheckTreeData(data);
    // 处理返回的数据格式
    if (res.data.code == 0 && res.data.data.result) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data.result) ? res.data.data.result : [res.data.data.result];
      dataSource.value = rawData;
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
    }
  } catch (error) {
    console.error('获取树数据失败:', error);
    message.error('获取数据失败');
  } finally {
    loadingTree.value = false;
  }
}

watch(
  () => route.query,
  newQuery => {
    console.log(newQuery.activKey, newQuery.currentNodeId);
    if (newQuery.activKey != undefined) {
      activKey.value = newQuery.activKey + '';
    }
    if (newQuery.currentNodeId != undefined) {
      nextTick(() => {
        watchselectedKeys.value = newQuery.currentNodeId + '';
      });
    }
  },
  { immediate: true, deep: true } // 立即执行一次，并监听变化
);
</script>

<template>
  <div class="drawerContent">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <a-spin :spinning="loadingTree" tip="加载中...">
          <Tree
            ref="treePage"
            :operate-flag="true"
            :tree-data="treeData"
            bomType="unBom"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            :current-node="currentNode"
            @select-node="selectNode"
            @get-node-update-data="getNodeUpdateData"
            @reload-tree="reloadTree"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <a-card style="margin-top: 10px" class="tab-container">
          <a-tabs :default-active-key="activKey" @change="handleTabChange">
            <a-tab-pane key="1" tab="计算页面配置">
              <checkImgList v-if="categoryType == '2'" ref="checkImgListRefA" @actionNode="actionNode"></checkImgList>
              <templateInfo v-if="categoryType == '1'" ref="templateInfoRef"></templateInfo>
            </a-tab-pane>
            <a-tab-pane key="2" tab="计算应用管理">
              <checkImgList v-if="categoryType == '2'" ref="checkImgListRefB" @actionNode="actionNode"></checkImgList>
              <checkFlowApplay v-if="categoryType == '1'" ref="checkFlowApplayRef"></checkFlowApplay>
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
  position: sticky;
  bottom: 20px !important;
  display: flex;
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
.tab-container {
  height: calc(100vh - 150px);
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
