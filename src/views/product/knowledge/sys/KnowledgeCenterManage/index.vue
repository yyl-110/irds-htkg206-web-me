<script setup lang="ts">
import { knowledgeTree, queryByKey, removeTree, sortTree } from "@/api/knowledge";
import { useUserStore } from "@/store/modules/user";
import { message, Spin } from "ant-design-vue";
import { Pane, Splitpanes } from "splitpanes";
import { findNodeByIdFromKey } from "@/utils/tools";
import Tree from "@/components/tree/tree.vue";
import centerTreeModal from '../components/centerTreeModal.vue'
import centerList from '../components/centerList.vue'

const treeData = ref([]);
const loadingTree = ref(false)
const selectedKeys = ref<string>("");
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const userStore = useUserStore();
const parameterName = ref<string>("");
const parameterNum = ref<string>("");
const selectNodeKeys = ref<string>("");
const currentNode = ref<any>();
const currentNodeLevel = ref<number>(2);
const rawTreeData = ref<Array<any>>([]); // 保存完整的原始树数据
const centerTreeModalRef = ref(null)

async function selectNode(node: any) {
  currentNode.value = node;
  parameterName.value = "";
  parameterNum.value = "";
  selectNodeKeys.value = node.key;
  currentNodeLevel.value = node.level;
}

/** 获取选中节点下所有子节点的 key，拼接为逗号分隔字符串 */
function getAllChildrenKeys(node: any): string[] {
  if (!node || !node.children || !Array.isArray(node.children)) {
    return [];
  }

  let keys: string[] = [];
  for (const child of node.children) {
    keys.push(child.key);
    keys = keys.concat(getAllChildrenKeys(child)); // 递归子节点
  }
  return keys;
}

/** 获取分类数据 */
async function getTreeData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    const res = await knowledgeTree({ menuId: 1, treeType: "1", parentId: "0", menuParentId: '' });
    loadingTree.value = false;
    // 处理返回的数据格式
    if (res.data.code == 0 && res.data.data) {
      const rawData = Array.isArray(res.data.data?.result)
        ? res.data.data?.result
        : [res.data.data?.result];

      // 保存原始数据
      rawTreeData.value = rawData;
      const treeNodes = convertToTreeNodes(rawTreeData.value);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        selectedKeys.value = "";
        nextTick(() => {
          if (type) {
            if (currentNode.value.key) {
              let rootNode = findNodeByIdFromKey(
                treeData.value,
                currentNode.value.key,
                "key"
              );
              expandedKeys.value = treePage.value.getExpandedKeys().join(",");
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
    console.error("获取树数据失败:", error);
    message.error("获取数据失败");
  } finally {
    loadingTree.value = false;
  }
}

async function downNode(selectedKeys: any) {
  const res = await sortTree({ id: selectedKeys.key, type: 1 });
  if (res && res.data.code === "0") {
    await getTreeData("change");
    Selectafterchanges();
  }
}

async function upNode(selectedKeys: any) {
  const res = await sortTree({ id: selectedKeys.key, type: 0 });
  if (res && res.data.code === "0") {
    await getTreeData("change");
    Selectafterchanges();
  }
}

function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}

/** 获取当前 selectedKeys 对应节点的所有子孙节点 key 字符串 */
const kldTreeIds = computed(() => {
  const targetNode = findNodeByIdFromKey(treeData.value, selectNodeKeys.value, 'key');
  if (!targetNode) return '';
  const allChildrenKeys = getAllChildrenKeys(targetNode);
  const allKeys = [selectNodeKeys.value, ...allChildrenKeys];
  return allKeys.join(',');
});

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  try {
    const res = await removeTree({ id: Number(selectedKeys.key) });
    if (res.data.code === "0") {
      await getTreeData("change");
      message.success(WeiI18n.t("删除成功").value);
    }
  } catch (error) {
    console.log("error:", error);
  }
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  if (!nodes || !Array.isArray(nodes)) return [];

  return nodes
    .map((node) => {
      // 检查当前节点是否匹配搜索值
      const isMatch =
        node.nodeName &&
        node.nodeName.toLowerCase().includes(searchValue.toLowerCase());

      // 递归检查子节点
      let matchingChildren = [];
      if (
        node.children &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
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

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getTreeData();
}

/** 处理搜索功能 */
async function handleChangeSelectKey(searchValue: string, languageSel: string) {
  // 当搜索值为空时，显示完整树结构
  if (!searchValue) {
    // 重新获取数据
    await getTreeData();
    return;
  }

  // 根据搜索值过滤树节点
  const filteredData = filterTreeNodes(rawTreeData.value, searchValue);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;

  // 如果没有搜索结果，显示提示
  if (treeNodes.length === 0) {
    message.info("未找到匹配的节点");
  }
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => {
    // 判断是否为根节点
    const isRootNode =
      item.nodeLevel === "1" ||
      (item.nodeRootType && item.nodeRootType.toString() === "1");
    // 判断是否有子节点
    const hasChildren =
      item.children && Array.isArray(item.children) && item.children.length > 0;

    // 设置level值：根节点level为1，有子节点的节点level为2，没有子节点的节点level为3
    let level = 3; // 默认level为3（无子节点）
    if (isRootNode) {
      level = 1;
    } else if (hasChildren) {
      level = 2;
    }

    return {
      // addTreeType: item.addTreeType,
      key: item.id?.toString() || item.tid?.toString() || "",
      partName: item.nodeName || "",
      // 添加type字段，用于在Tree组件中区分节点类型
      type: "category", // 对于产品平台管理，所有节点都视为分类节点
      nodeRootId: item.id,
      nodeLevel: item.nodeLevel,
      categoryId: item.categoryId,
      categoryParentId: item.categoryParentId,
      level: level,
      style: item.style,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}


/** 获取节点添加数据 */
async function getNodeAddData(selectedKeys: any) {
  // 这里可以根据需要实现添加节点的逻辑
  centerTreeModalRef.value.show(selectedKeys || currentNode.value, {}, 1);
}

const getParentNode = (nodeId: string): any | null => {
  // 辅助递归函数
  function findParent(
    nodes: any[],
    targetId: string,
    parent: any = null
  ): any | null {
    for (const node of nodes) {
      if (node.id?.toString() === targetId || node.key === targetId) {
        return parent; // 找到目标节点，返回其父节点
      }
      if (node.children && node.children.length > 0) {
        const found = findParent(node.children, targetId, node);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }

  // 从根节点开始查找，根节点的父节点为 null
  return findParent(rawTreeData.value, nodeId);
};



/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  if (selectedKeys?.level === 1 || currentNode.value.level === 1) {
    message.warn("顶层节点不允许修改！");
    return;
  }
  const parentNode = getParentNode(selectedKeys.key); // ✅ 获取父节点
  if (!parentNode) {
    message.error("未找到父节点");
    return;
  }
  centerTreeModalRef.value.show(selectedKeys, parentNode, 2);
}

const saveSuccess = () => {
  getTreeData('change');
}

onMounted(() => {
  // 获取树数据
  getTreeData();
});



</script>

<template>
  <div class="drawerContent">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom">
      <Pane min-size="15" :size="20" class="splitpane-cls marginstyle">
        <a-spin :spinning="loadingTree" tip="加载中...">
          <Tree ref="treePage" :operate-flag="true" :tree-data="treeData" bomType="unBom" :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys" @select-node="selectNode" @up-Node="upNode" @down-Node="downNode"
            @get-node-update-data="getNodeUpdateData" @get-node-add-data="getNodeAddData"
            @delete-tree-node="deleteTreeNode" @reload-tree="reloadTree" @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <center-list :kldTreeId="kldTreeIds" />
      </Pane>
    </Splitpanes>
    <centerTreeModal ref="centerTreeModalRef" @saveSuccess="saveSuccess" />
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

:deep(.marginstyle) {
  padding: 10px !important;
  padding-bottom: 5px !important;
  padding-top: 16px !important;
}

.drawerContent {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffffff !important;
}
</style>