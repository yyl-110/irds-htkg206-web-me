<script setup lang="ts">
import { reactive, ref } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { AdminApiSystemProduct } from "@/api/tags/product/产品平台后台";
import { ModuleTypeRequestDTOModel } from "@/api/models/module/ModuleTypeRequestDTOModel";
import { WeiI18n } from "@/utils/WeiI18n";
import { PermissionAssignUsersRoleRequestDTOmenuModel } from "@/api/models/menu/PermissionAssignUsersRoleRequestDTOmenuModel";
import { EpcIcon } from "@/components/icon/EpcIcon";
import Tree from "@/components/tree/tree.vue";
import { ProductModuleTreeInfoRequestDTOModel } from "@/api/models/product/ProductModuleTreeInfoRequestDTOModel";
import { useUserStore } from "@/store/modules/user";
import { AdminApiSystemModule } from "@/api/tags/module/系统模块库";
import { ModuleMenuPageRequestDTOModel } from "@/api/models/module/ModuleMenuPageRequestDTOModel";
import ModuleImgList from "../components/form/ModuleImgList.vue";
import ModuleInfoList from "./components/ModuleInfoList.vue";
import { decryptValue, encryptValue } from "@/utils";
import TreeModule from "../components/modal/TreeModule.vue";
import { useLayoutStore } from "@/store/modules/layout/layout";
const layoutStore = useLayoutStore();
const router = useRoute();
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>("");
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const showLeft = ref<boolean>(true);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const titleVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const titleList = ref<any>([]);
const categoryid = ref<string>("");
const nodeType = ref<string>("");
const drawerStyle = ref<any>({
  marginLeft: "201px",
  marginTop: "65px",
  width: "calc(100% - 201px)",
  height: "calc(100vh - 65px)",
});

/** 列表请求参数 */
const requestModuleParams = reactive(new ModuleMenuPageRequestDTOModel());
/** 列表请求参数 */
const requestParams = reactive(
  new PermissionAssignUsersRoleRequestDTOmenuModel()
);
requestParams.condition = undefined;
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const ModuleImgListRef = ref<InstanceType<typeof ModuleImgList>>();
const ModuleInfoListRef = ref<InstanceType<typeof ModuleInfoList>>();

treeRequestParams.userid = userStore.getUser.id;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = (pageSizeOptions) =>
  `${pageSizeOptions.value}${WeiI18n.$t("条/页")}`;
pagination.showTotal = (total) =>
  `${WeiI18n.$t("共") + total + WeiI18n.$t("条")}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const res =
      await AdminApiSystemProduct.getProductModuleTree(treeRequestParams);
    if (res.data.code == 0 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];
      dataSource.value = rawData[0].result[0];
      const treeNodes = convertToTreeNodes(rawData[0].result[0]);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = "";
        nextTick(() => {
          if (type) {
            selectNode(currentNode.value);
          } else {
            selectedKeys.value = treeNodes[0].key;
            expandedKeys.value = treeNodes[0].key;
            selectNode(treeNodes[0]);
          }
        });
      }
    }
  } catch (error) {
    message.error("获取数据失败!");
  } finally {
    loadingTree.value = false;
  }
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map((item) => {
    // 判断是否为根节点：使用moduleLevel和nodeRootType字段
    // 根节点通常是moduleLevel为1或nodeRootType有特定值的节点
    const isRootNode =
      item.moduleLevel === 1 ||
      (item.nodeRootType && item.nodeRootType.toString() === "1");
    // 判断是否有子节点
    const hasChildren =
      item.children && Array.isArray(item.children) && item.children.length > 0;

    // 根据规则设置level值
    let level = 3; // 默认值为3（没有子节点的情况）
    if (isRootNode) {
      level = 1; // 根节点level为1
    } else if (hasChildren) {
      level = 2; // 有子节点的非根节点level为2
    }

    return {
      addTreeType: item.addTreeType,
      key: item.id?.toString() || item.tid?.toString() || "",
      partName: item.name || item.title || "",
      // 添加type字段，用于在Tree组件中区分节点类型
      type: "category", // 对于产品平台管理，所有节点都视为分类节点
      nodeRootType: item.nodeRootType,
      nodeType: item.nodeType,
      nodeRootId: item.nodeRootId,
      moduleLevel: item.moduleLevel,
      expand: item.expand,
      level: level, // 设置level值
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
  const treeNodes = convertToTreeNodes(filteredData);
  treeData.value = treeNodes;
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map((node) => {
      // 检查当前节点是否匹配搜索值
      const isMatch =
        node.title &&
        node.title.toLowerCase().includes(searchValue.toLowerCase());

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
async function getNodeAddData(selectedKeys: any) {
  if (currentNode.value) {
    // 这里可以根据需要实现添加节点的逻辑
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t("父节点名称").value,
        key: "parentName",
        value: currentNode.value.partName,
        type: "input",
        hidden: false,
        disabled: true,
      },
      {
        title: WeiI18n.t("节点名称").value,
        key: "categoryName",
        value: "",
        type: "input",
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t("节点名称不能为空").value,
          },
        ],
      },
      {
        title: WeiI18n.t("节点类别").value,
        key: "nodeType",
        value: "",
        type: "select",
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t("节点类别不能为空").value,
          },
        ],
        selectStr: [
          { label: "数据节点", value: "2" },
          { label: "分类节点", value: "1" },
        ],
      },
      {
        title: WeiI18n.t("构型编码").value,
        key: "gxbm",
        value: "",
        type: "input",
        hidden: false,
        disabled: true,
      },
      {
        title: WeiI18n.t("示意图").value,
        key: "uploadFile",
        value: "",
        type: "upload",
        hidden: false,
      },
      {
        title: WeiI18n.t("父节点ID").value,
        key: "pid",
        value: currentNode.value.key,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("文件ID").value,
        key: "fileId",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("文件URL").value,
        key: "fileUrl",
        value: "",
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("层级").value,
        key: "level",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("用户ID").value,
        key: "userId",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
    ];
  } else {
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t("父节点名称").value,
        key: "parentName",
        value: "根节点",
        type: "input",
        hidden: false,
        disabled: true,
      },
      {
        title: WeiI18n.t("节点名称").value,
        key: "categoryName",
        value: "",
        type: "input",
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t("节点名称不能为空").value,
          },
        ],
      },
      {
        title: WeiI18n.t("节点类别").value,
        key: "nodeType",
        value: "",
        type: "select",
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t("节点类别不能为空").value,
          },
        ],
        selectStr: [
          { label: "数据节点", value: "2" },
          { label: "分类节点", value: "1" },
        ],
      },
      {
        title: WeiI18n.t("构型编码").value,
        key: "gxbm",
        value: "",
        type: "input",
        hidden: false,
        disabled: true,
      },
      {
        title: WeiI18n.t("示意图").value,
        key: "uploadFile",
        value: "",
        type: "upload",
        hidden: false,
      },
      {
        title: WeiI18n.t("父节点ID").value,
        key: "pid",
        value: currentNode.value.key,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("文件ID").value,
        key: "fileId",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("文件URL").value,
        key: "fileUrl",
        value: "",
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("层级").value,
        key: "level",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t("用户ID").value,
        key: "userId",
        value: 0,
        type: "input",
        disabled: true,
        hidden: true,
      },
    ];
  }
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

async function downNode(node: any) {
  let data = { ...treeRequestParams };
  data.id = (node && node.key) || selectedKeys.value;
  data.type = 1;
  await AdminApiSystemProduct.updTreeKey(data);
  await getListData("change");
  Selectafterchanges();
}
const currentNode = ref();

async function upNode(node: any) {
  let data = { ...treeRequestParams };
  data.id = (node && node.key) || selectedKeys.value;
  data.type = 0;
  await AdminApiSystemProduct.updTreeKey(data);
  await getListData("change");
  Selectafterchanges();
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}

async function selectNode(node: any) {
  currentNode.value = node;
  let data = { ...treeRequestParams };
  data.categoryid = node.key ? node.key : node.id;
  data.rootNodeid = node.key ? node.key : node.id;
  const res = await AdminApiSystemProduct.getCategpryInfoById(data);
  categoryid.value = res.data.data.result[0].id;
  nodeType.value = res.data.data.result[0].nodeType;
  if (nodeType.value == "1") {
    nextTick(() => {
      ModuleImgListRef.value?.infoReload(categoryid.value);
    });
  } else {
    nextTick(() => {
      ModuleInfoListRef.value?.initData(categoryid.value);
    });
  }
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(node: any) {
  let nodeData = node ? node : currentNode.value;
  categoryid.value = nodeData.key;
  let data = { ...treeRequestParams };
  data.categoryid = nodeData.key;
  data.rootNodeid = nodeData.key;
  const res = await AdminApiSystemProduct.getCategpryInfoById(data);
  const categoryStrs = res.data.data.result[0];
  // 这里可以根据需要实现添加节点的逻辑
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t("父节点名称").value,
      key: "parentName",
      value: categoryStrs.parentName,
      type: "input",
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t("节点名称").value,
      key: "categoryName",
      value: categoryStrs.categoryName,
      type: "input",
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t("节点名称不能为空").value,
        },
      ],
    },
    {
      title: WeiI18n.t("节点类别").value,
      key: "nodeType",
      value: categoryStrs.nodeType,
      type: "select",
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t("节点类别不能为空").value,
        },
      ],
      selectStr: [
        { label: "数据节点", value: "2" },
        { label: "分类节点", value: "1" },
      ],
    },
    {
      title: WeiI18n.t("构型编码").value,
      key: "gxbm",
      value: selectedKeys.gxbm,
      type: "input",
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t("示意图").value,
      key: "uploadFile",
      value: selectedKeys.uploadFile,
      type: "upload",
      hidden: false,
    },
    {
      title: WeiI18n.t("父节点ID").value,
      key: "pid",
      value: categoryStrs.parentid,
      type: "input",
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t("文件ID").value,
      key: "fileId",
      value: selectedKeys.fileId,
      type: "input",
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t("文件URL").value,
      key: "fileUrl",
      value: selectedKeys.fileUrl,
      type: "input",
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t("层级").value,
      key: "level",
      value: selectedKeys.level,
      type: "input",
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t("用户ID").value,
      key: "userId",
      value: selectedKeys.userId,
      type: "input",
      disabled: true,
      hidden: true,
    },
  ];
  treePage.value?.reloadTableStyle(
    treeNodeColmoun.value,
    categoryStrs.oldFileName
  );
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  let data = { ...treeRequestParams };
  data.categoryid = treeRequestParams.rootNodeid;
  data.id = selectedKeys.key;
  const res = await AdminApiSystemProduct.delTreeNode(data);
  await getListData();
  message.success(WeiI18n.t("删除成功").value);
}

const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);

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
/** 提交树节点数据 */
async function submitTreeData(nodeList: any, selectedKeys: any) {
  let data = { ...treeRequestParams };
  data.categoryName = nodeList.categoryName;
  data.nodeType = nodeList.nodeType;
  data.parentid = nodeList.pid;
  data.sketchMapId = nodeList.fileId;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.addProductModuleTree(data);
  await getListData();
  message.success(WeiI18n.t("保存成功").value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  let data = { ...treeRequestParams };
  data.categoryName = nodeList.categoryName;
  data.id = nodeList.id;
  data.nodeType = nodeList.nodeType;
  data.parentid = nodeList.pid;
  data.sketchMapId = nodeList.fileId;
  data.sketchMapId = nodeList.fileId;
  data.sketchMapId = nodeList.fileId;
  // data.categoryid = categoryid.value;
  // data.rootNodeid = categoryid.value;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.updateCategoryNode(data);
  await getListData("change");
  message.success(WeiI18n.t("修改成功").value);
  Selectafterchanges();
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}

/** 获取分类数据 */
async function getMenuListData() {
  titleVisible.value = true;
  treeData.value = [];
  drawerStyle.value = {
    marginLeft: layoutStore.asideWidthStyle,
    marginTop: "65px",
    width: "calc(100% - 241px)",
    height: "calc(100vh - 65px)",
  };
  loading.value = true;
  try {
    requestModuleParams.userId = userStore.getUser.id + "";
    const res = await AdminApiSystemModule.getModuleMenuList({
      ...requestModuleParams,
    });
    titleList.value = res.data.data;
    // 处理返回的数据格式
  } catch (error) {
    console.error("获取树数据失败:", error);
  } finally {
  }
}

function onClose() {
  drawerStyle.value = ref({});
  titleVisible.value = false;
}
function changeTitleModule(item: any) {
  treeRequestParams.categoryid = item.id;
  treeRequestParams.rootNodeid = item.id;
  categoryid.value = item.id;
  nodeType.value = item.nodeType;
  getListData();
  drawerStyle.value = ref({});
  loading.value = false;
  titleVisible.value = false;
}

function actionNode(item: any) {
  nextTick(() => {
    selectNode(item);
    selectedKeys.value = `${item.id}`;
  });
}

const dialogVisible = ref(false);
const TreeModuleRef = ref<any>(null);
// 初始化数据方法
const updateMenu = async () => {
  dialogVisible.value = true;
  TreeModuleRef.value.updateMenu("init");
};
function close() {
  dialogVisible.value = false;
}
watch(
  () => router.query.parms,
  () => {
    let paramStr = "";
    if (router.query.parms) {
      // 对界面上的参数进行解密处理
      paramStr = decryptValue(router.query.parms);
    }
    if (paramStr) {
      getMenuListData();
    }
  },
  { immediate: true }
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
            :operate-flag="false"
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
            @change-select-key="handleChangeSelectKey"
          />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <div v-if="!loading">
          <ModuleImgList
            v-if="nodeType == '1'"
            ref="ModuleImgListRef"
            @actionNode="actionNode"
          />
          <ModuleInfoList
            v-if="nodeType != '1'"
            ref="ModuleInfoListRef"
            :categoryid="categoryid"
          />
        </div>
        <!-- <div v-else class="example">
          <a-spin tip="加载中..." />
        </div> -->
      </Pane>
    </Splitpanes>
  </div>
  <a-drawer
    :title="`产品模块管理`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onClose"
    @close="onClose"
  >
    <!-- <template #extra>
      <EpcIcon style="margin-right: 310px; font-size: 16px; color: #0d65ff" type="icon-edit" @click="updateMenu" />
    </template> -->
    <div v-for="(item, index) in titleList" :key="index">
      <p style="margin-left: 15px; margin-top: 10px">
        <EpcIcon type="icon-caidan" style="font-size: 12px" />
        <b style="margin-left: 10px">{{ item.title }}</b>
      </p>
      <div
        style="width: 400px; display: flex; flex-wrap: wrap; margin-left: 30px"
      >
        <div
          v-for="(item2, index2) in item.children"
          :key="index2"
          style="width: 130px; padding: 0 0 20px 0; cursor: pointer"
          @click="changeTitleModule(item2)"
        >
          <EpcIcon
            type="icon-chilun--"
            style="font-size: 14px; color: #0d65ff"
          /><a class="menuLi">{{ item2.title }}</a>
        </div>
      </div>
    </div>
  </a-drawer>
  <TreeModule ref="TreeModuleRef" :modalVisible="dialogVisible" @close="close">
  </TreeModule>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
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
</style>
