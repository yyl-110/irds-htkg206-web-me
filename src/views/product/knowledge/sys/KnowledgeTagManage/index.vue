<script setup lang="ts">
import { nextTick, reactive, ref, h } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import type { TableColumnType, TableProps } from "ant-design-vue";
import { message, } from "ant-design-vue";
import type { MenuResponseDTOModel } from "@/api/models/MenuResponseDTOModel";
import { WeiI18n } from "@/utils/WeiI18n";
import { findNodeByIdFromKey } from "@/utils/tools";
import Empty from "@/components/Empty/index.vue";
import Tree from "@/components/tree/tree.vue";
import { useUserStore } from "@/store/modules/user";
import { knowledgeTagList, removeTag, sortTag } from "@/api/knowledge";
import addAndEditTag from "../components/add-and-edit-tag.vue";
/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

interface ITreeParams {
  tagType: string;
  parentId: string;
}

// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>("");
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const userStore = useUserStore();
const parameterName = ref<string>("");
const parameterNum = ref<string>("");
const selectNodeKeys = ref<string>("");
const currentNode = ref<any>();

const addAndEditTagRef = ref(null);

const treeRequestParams = reactive<ITreeParams>({
  tagType: "1",
  parentId: "0",
});

const rawTreeData = ref<Array<any>>([]); // 保存完整的原始树数据

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t("点击取消排序").value,
  triggerAsc: WeiI18n.t("点击升序").value,
  triggerDesc: WeiI18n.t("点击降序").value,
  emptyText: h(Empty, {
    description: "数据为空",
    style: { paddingBottom: "50px" },
  }),
});
const selectedRowkeys = ref<any>([]);
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    const res = await knowledgeTagList(treeRequestParams);
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
        // 侦听器监听选中节点
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

onMounted(() => {
  getListData();
});

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
      nodeType: item.nodeType,
      nodeRootId: item.id,
      moduleLevel: item.nodeLevel,
      categoryId: item.categoryId,
      categoryParentId: item.categoryParentId,
      selectType: item.selectType,
      level: level,
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
  const filteredData = filterTreeNodes(rawTreeData.value, searchValue);
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;

  // 如果没有搜索结果，显示提示
  if (treeNodes.length === 0) {
    message.info("未找到匹配的节点");
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

/** 获取节点添加数据 */
async function getNodeAddData(selectedKeys: any) {
  if (selectedKeys?.level === 3) {
    message.warn("请选择上层父节点添加！");
    return;
  }
  if (selectedKeys?.level === 1 || !selectedKeys?.level) {
    message.warn("顶层文件夹节点不能新建，请选择可以新建的节点！");
    return;
  }
  const parentNode = getParentNode(selectedKeys.key); // ✅ 获取父节点
  if (!parentNode) {
    message.error("未找到父节点");
    return;
  }
  // 这里可以根据需要实现添加节点的逻辑
  addAndEditTagRef.value.show(selectedKeys, parentNode, 1);
}

async function downNode(selectedKeys: any) {
  const res = await sortTag({ id: selectedKeys.key, type: 1 });
  if (res && res.data.code === "0") {
    await getListData("change");
    Selectafterchanges();
  }
}

async function upNode(selectedKeys: any) {
  const res = await sortTag({ id: selectedKeys.key, type: 0 });
  if (res && res.data.code === "0") {
    await getListData("change");
    Selectafterchanges();
  }
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}
const currentNodeLevel = ref<number>(2);
async function selectNode(node: any) {
  currentNode.value = node;
  parameterName.value = "";
  parameterNum.value = "";
  selectNodeKeys.value = node.key;
  currentNodeLevel.value = node.level;
  loadParameterListData();
}

async function loadParameterListData() {
  console.log(currentNode.value, 9999);
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
  addAndEditTagRef.value.show(selectedKeys, parentNode, 2);
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  try {
    const res = await removeTag({ id: Number(selectedKeys.key) });
    if (res.data.code === "0") {
      await getListData("change");
      message.success(WeiI18n.t("删除成功").value);
    }
  } catch (error) {
    console.log("error:", error);
  }
}

// 树选择器模态框相关状态
const selectTreeVisible = ref<boolean>(false);
const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);

/**
 * 处理浏览按钮点击事件，显示树选择器模态框
 * @param field 当前点击的字段信息
 */
async function selectBoomTree(field: any) {
  currentSelectField.value = field;
  // 深拷贝当前树数据，避免影响主树结构
  selectTreeData.value = JSON.parse(JSON.stringify(treeData.value));
  selectTreeVisible.value = true;
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}
const saveSuccess = () => {
  reloadTree();
};

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
            @delete-tree-node="deleteTreeNode" @select-Boom-Tree="selectBoomTree" @reload-tree="reloadTree"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>

      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <div class="form-layout">
          <div class="form-list">
            <div class="tabStatsTit">{{ currentNode?.partName }}</div>
            <a-checkbox-group class="checkGroup" v-if="
              currentNode?.children &&
              currentNode.children.length > 0 &&
              rawTreeData[0]?.selectType === '1'
            ">
              <a-checkbox class="checkBox" v-for="(item, index) in currentNode.children" :key="item.partName"
                :value="item.partName" disabled>{{ item.partName }}</a-checkbox>
            </a-checkbox-group>
            <a-radio-group v-if="
              currentNode?.children &&
              currentNode.children.length > 0 &&
              rawTreeData[0]?.selectType === '0'
            ">
              <a-radio v-for="(item, index) in currentNode.children" :label="item.partName" disabled :value="item.key"
                :key="item.key" />
            </a-radio-group>
          </div>
        </div>
      </Pane>
    </Splitpanes>
    <addAndEditTag ref="addAndEditTagRef" @saveSuccess="saveSuccess" />
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
  padding-right: 5px !important;
  padding-bottom: 5px !important;
  padding-left: 0 !important;
}

.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
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

    .ant-table-thead>tr>th {
      background-color: #f5f5f5;
      color: #333;
      font-weight: 500;
      padding: 12px;
      border-bottom: 1px solid #e6e7e9;
    }

    .ant-table-tbody>tr>td {
      padding: 10px;
      border-bottom: 1px solid #e6e7e9;
    }
  }
}

.form-layout {
  padding: 16px;

  .form-list {
    margin-bottom: 40px;

    .tabStatsTit {
      height: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #1890ff;
      line-height: 20px;
      margin-bottom: 16px;
    }
  }
}
</style>
