<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { WeiI18n } from '@/utils/WeiI18n';
import { PermissionAssignUsersRoleRequestDTOmenuModel } from '@/api/models/menu/PermissionAssignUsersRoleRequestDTOmenuModel';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Tree from '@/components/tree/tree.vue';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { ModuleMenuPageRequestDTOModel } from '@/api/models/module/ModuleMenuPageRequestDTOModel';
import ModuleImgList from '../components/form/ModuleImgList.vue';
import ModuleInfoList from './components/ModuleInfoList.vue';
import { decryptValue } from '@/utils';
import { useLayoutStore } from '@/store/modules/layout/layout';
import SelectBoomTree from '../components/selectBoomTree.vue';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
const layoutStore = useLayoutStore();
const router = useRoute();
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const titleVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const titleList = ref<any>([]);
const categoryid = ref<string>('');
const menuId = ref<string>('');
const categoryType = ref<string>('');
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '65px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh - 65px)',
});

/** 列表请求参数 */
const requestModuleParams = reactive(new ModuleMenuPageRequestDTOModel());
/** 列表请求参数 */
const requestParams = reactive(new PermissionAssignUsersRoleRequestDTOmenuModel());
requestParams.condition = undefined;
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const ModuleImgListRef = ref<InstanceType<typeof ModuleImgList>>();
const ModuleInfoListRef = ref<InstanceType<typeof ModuleInfoList>>();

treeRequestParams.creator = userStore.getUser.id;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    let data: any = {};
    data.id = treeRequestParams.categoryId;
    const res = await AdminApiSystemProduct.getProductModuleTree(data);
    console.log(res);
    if (res.data.code == 200 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData[0];
      const treeNodes = convertToTreeNodes(rawData);
      debugger;
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = '';
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
    message.error('获取数据失败!');
  } finally {
    loadingTree.value = false;
  }
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map(item => {
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
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.categoryName || '',
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      categoryType: item.categoryType,
      parentId: item.parentId,
      level: level, // 设置level值
      children: hasChildren ? convertToTreeNodes(item.children) : [],
      menuId: item.menuId,
    };
  });
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

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = node.categoryName && node.categoryName.toLowerCase().includes(searchValue.toLowerCase());
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
    treeRequestParams.id = 0;
    // 这里可以根据需要实现添加节点的逻辑
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t('父节点名称').value,
        key: 'parentName',
        value: currentNode.value.partName,
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
        rules: [
          {
            required: true,
            message: WeiI18n.t('节点名称不能为空').value,
          },
        ],
      },
      {
        title: WeiI18n.t('节点类别').value,
        key: 'categoryType',
        value: '',
        type: 'select',
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t('节点类别不能为空').value,
          },
        ],
        selectStr: [
          { label: '数据节点', value: 4 },
          { label: '分类节点', value: 3 },
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
        value: currentNode.value.key,
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
  } else {
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t('父节点名称').value,
        key: 'parentName',
        value: '根节点',
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
        rules: [
          {
            required: true,
            message: WeiI18n.t('节点名称不能为空').value,
          },
        ],
      },
      {
        title: WeiI18n.t('节点类别').value,
        key: 'categoryType',
        value: '',
        type: 'select',
        hidden: false,
        rules: [
          {
            required: true,
            message: WeiI18n.t('节点类别不能为空').value,
          },
        ],
        selectStr: [
          { label: '数据节点', value: 4 },
          { label: '分类节点', value: 3 },
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
        value: currentNode.value.key,
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
  }
  treePage.value?.reloadTableStyle(treeNodeColmoun.value);
}

async function downNode(node: any) {
  if (node == undefined) {
    node = treeData.value[0];
  }
  if (node.categoryType == 2) {
    message.warning('该节点不能被下移！');
    return;
  }
  let data = { ...treeRequestParams };
  data.id = (node && node.key) || selectedKeys.value;
  await AdminApiSystemProduct.sortDown(data);
  await getListData('change');
  Selectafterchanges();
}
const currentNode = ref();

async function upNode(node: any) {
  if (node == undefined) {
    node = treeData.value[0];
  }
  if (node.categoryType == 2) {
    message.warning('该节点不能被上移！');
    return;
  }
  let data = { ...treeRequestParams };
  data.id = (node && node.key) || selectedKeys.value;
  await AdminApiSystemProduct.sortUp(data);
  await getListData('change');
  Selectafterchanges();
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}

async function selectNode(node: any) {
  currentNode.value = node;
  categoryid.value = node.key ? node.key : node.id;
  menuId.value = node.menuId || 9;
  categoryType.value = node.categoryType;
  if (categoryType.value == 2 || categoryType.value == 3) {
    nextTick(() => {
      ModuleImgListRef.value?.infoReload(categoryid.value, menuId.value);
    });
  } else {
    nextTick(() => {
      ModuleInfoListRef.value?.initData(categoryid.value, menuId.value);
    });
  }
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(node: any) {
  if (node == undefined) {
    node = treeData.value[0];
  }
  if (node.categoryType == 2) {
    message.warning('该节点不能被编辑！');
    return;
  }
  let nodeData = node ? node : currentNode.value;
  categoryid.value = nodeData.key;
  let data = { ...treeRequestParams };
  data.id = nodeData.key;
  const res = await AdminApiSystemProduct.getCategpryInfoById(data);
  const categoryStrs = res.data.data;
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: categoryStrs.parentName,
      type: 'input',
      hidden: false,
      disabled: true,
    },
    {
      title: WeiI18n.t('节点名称').value,
      key: 'categoryName',
      value: categoryStrs.categoryName,
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
      title: WeiI18n.t('节点类别').value,
      key: 'categoryType',
      value: categoryStrs.categoryType,
      type: 'select',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点类别不能为空').value,
        },
      ],
      selectStr: [
        { label: '数据节点', value: 4 },
        { label: '分类节点', value: 3 },
      ],
    },
    {
      title: WeiI18n.t('示意图').value,
      key: 'uploadFile',
      value: categoryStrs.uploadFile || categoryStrs.oldFileName || '',
      type: 'upload',
      hidden: false,
    },
    {
      title: WeiI18n.t('父节点ID').value,
      key: 'pid',
      value: categoryStrs.parentid,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('文件ID').value,
      key: 'fileId',
      value: categoryStrs.fileId || categoryStrs.imgUrl || '',
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('文件URL').value,
      key: 'fileUrl',
      value: categoryStrs.fileUrl || '',
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('层级').value,
      key: 'level',
      value: categoryStrs.level || '',
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('用户ID').value,
      key: 'userId',
      value: categoryStrs.userId || '',
      type: 'input',
      disabled: true,
      hidden: true,
    },
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value, categoryStrs.oldFileName);
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  if (selectedKeys == undefined) {
    selectedKeys = treeData.value[0];
  }
  if (selectedKeys.categoryType == 2) {
    message.warning('该节点不能被删除！');
    return;
  }
  let data = { ...treeRequestParams };
  data.id = selectedKeys.key;
  const res = await AdminApiSystemProduct.delTreeNodetoManagement(data);
  await getListData();
  message.success(WeiI18n.t('删除成功').value);
}

const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);
const selectTreeData1 = ref<any[]>([]);

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

const resource = ref<Array<any>>([]);
const updatePlatformParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());
/**
 * 处理浏览按钮点击事件，显示树选择器模态框
 * @param field 当前点击的字段信息
 */
async function selectBoomTree1(field: any) {
  debugger;
  // 记录当前触发的字段，供确认回调使用
  currentSelectField.value = field;
  const res = await AdminApiSystemProduct.getGBOMTreeList(updatePlatformParameter);
  // 规范化返回数据，确保每个节点都有 partName 字段供弹窗展示
  function normalizeTree(nodes: any[]): any[] {
    if (!Array.isArray(nodes)) return [];
    return nodes.map((n: any) => {
      const node = { ...n };
      const displayName = node.partName || node.name || node.title || node.label || node.part_name || node.descript || node.pdmName || node.description || node.text || '';
      node.partName = node.techid ? `${displayName}(${node.techid})` : displayName;
      // ensure tree component can use key for selection
      if (node.id !== undefined && node.id !== null) {
        node.key = node.id?.toString();
      } else if (!node.key) {
        node.key = node.tid || node.id || node.key || '';
      }
      if (node.children && Array.isArray(node.children)) {
        node.children = normalizeTree(node.children);
      }
      return node;
    });
  }
  const normalized = normalizeTree(JSON.parse(JSON.stringify(res.data.data)));
  // debug: 打印规范化后的前几项，便于本地查看
  // eslint-disable-next-line no-console
  console.log('selectBoomTree1 normalized:', JSON.stringify(normalized.slice ? normalized.slice(0, 5) : normalized));
  selectTreeData1.value = normalized;
  selectTreeVisible1.value = true;
}

/** 提交树节点数据 */
async function submitTreeData(nodeList: any) {
  let data = { ...treeRequestParams };
  data.categoryName = nodeList.categoryName;
  data.categoryType = nodeList.categoryType;
  data.parentId = nodeList.pid;
  data.fileId = nodeList.fileId;
  const res = await AdminApiSystemProduct.addEmptyNodetoManagement(data);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any) {
  let data = { ...treeRequestParams };
  data.categoryName = nodeList.categoryName;
  data.id = nodeList.id;
  data.categoryType = nodeList.categoryType;
  data.parentId = nodeList.pid;
  data.fileId = nodeList.fileId;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.updateTreeNodetoManagement(data);
  await getListData('change');
  message.success(WeiI18n.t('修改成功').value);
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
    marginTop: '65px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh - 65px)',
  };
  loading.value = true;
  try {
    requestModuleParams.userId = userStore.getUser.id + '';
    const res = await AdminApiSystemModule.getModuleMenuList({
      ...requestModuleParams,
    });
    titleList.value = res.data.data;
    // 处理返回的数据格式
  } catch (error) {
    console.error('获取树数据失败:', error);
  } finally {
  }
}

function onClose() {
  drawerStyle.value = ref({});
  titleVisible.value = false;
}
function changeTitleModule(item: any) {
  treeRequestParams.id = item.id;
  treeRequestParams.categoryId = item.id;
  categoryid.value = item.id;
  categoryType.value = item.categoryType;
  getListData();
  drawerStyle.value = ref({});
  loading.value = false;
  titleVisible.value = false;
}

function actionNode(item: any) {
  console.log('changeTitleModule', item);
  nextTick(() => {
    selectNode(item);
    selectedKeys.value = `${item.id}`;
  });
}

function getCategory(categoryId: any) {
  const targetId = String(categoryId ?? '');
  if (!targetId) return;
  const path = findNodePathById(treeData.value, targetId);
  if (!path || path.length === 0) {
    message.warning('未找到对应树节点');
    return;
  }
  const targetNode = path[path.length - 1];
  selectedKeys.value = targetId;
  // Tree 组件当前按逗号分割 expandedKeys，传字符串可稳定触发展开父链
  expandedKeys.value = path.map((n: any) => n.key).join(',');
  nextTick(() => {
    selectNode(targetNode);
  });
}

function findNodePathById(nodes: any[], targetId: string, path: any[] = []): any[] | null {
  for (const node of nodes || []) {
    const nextPath = [...path, node];
    if (String(node?.key ?? node?.id ?? '') === targetId) {
      return nextPath;
    }
    if (node?.children?.length) {
      const childPath = findNodePathById(node.children, targetId, nextPath);
      if (childPath) return childPath;
    }
  }
  return null;
}

// 树选择器模态框相关状态
const selectTreeVisible = ref<boolean>(false);
const selectTreeSelectedKeys = ref<string>('');

// 树选择器模态框相关状态
const selectTreeVisible1 = ref<boolean>(false);
const selectTreeSelectedKeys1 = ref<string>('');

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
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
function confirmSelectTreeNode1(item: any) {
  debugger;
  if (selectTreeSelectedKeys1.value && currentSelectField.value) {
    // 查找选中的节点信息
    const selectedNode = findNodeById(selectTreeData1.value, selectTreeSelectedKeys1.value);
    if (selectedNode) {
      // 构建选中的节点数据
      const nodeData = {
        key: selectedNode.key,
        title: selectedNode.partName,
        fieldKey: currentSelectField.value.key,
        techid: selectedNode.techid || selectedNode.pdmName || selectedNode.techID || selectedNode.techId || '',
      };
      console.log(nodeData);
      // 调用tree组件的方法，将选中的节点数据传递回去
      treePage.value?.onTreeNodeSelected(nodeData);
    }
  }
  selectTreeVisible1.value = false;
  // 重置选中状态
  selectTreeSelectedKeys1.value = '';
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
 * 取消选择树节点
 */
function cancelSelectTreeNode() {
  selectTreeVisible.value = false;
  // 重置选中状态
  selectTreeSelectedKeys.value = '';
}
/**
 * 取消选择树节点
 */
function cancelSelectTreeNode1() {
  selectTreeVisible1.value = false;
  // 重置选中状态
  selectTreeSelectedKeys1.value = '';
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
 * 处理树选择器中的节点选择
 * @param selectedKeys 选中的节点keys
 * @param info 节点信息
 */
function handleSelectTreeNode1(selectedKeys: any[], info: any) {
  selectTreeSelectedKeys1.value = selectedKeys[0];
}

watch(
  () => router.query.parms,
  () => {
    let paramStr = '';
    if (router.query.parms) {
      // 对界面上的参数进行解密处理
      paramStr = decryptValue(router.query.parms);
    }
    if (paramStr) {
      getMenuListData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <!-- 父节点名称弹窗 -->
  <SelectBoomTree
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="selectTreeData"
    :select-tree-selected-keys="selectTreeSelectedKeys"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancel-select-tree-node="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode" />
  <!-- 构型编码弹窗 -->
  <SelectBoomTree
    ref="selectBoomTreeRef1"
    :modal-visible="selectTreeVisible1"
    :select-tree-data="selectTreeData1"
    :select-tree-selected-keys="selectTreeSelectedKeys1"
    @confirm-select-tree-node="confirmSelectTreeNode1"
    @cancel-select-tree-node="cancelSelectTreeNode1"
    @handle-select-tree-node="handleSelectTreeNode1" />
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
            @select-boom-tree1="selectBoomTree1"
            @edit="editTreeData"
            @reload-tree="reloadTree"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <div v-if="!loading">
          <ModuleImgList v-if="categoryType == '1' || categoryType == '2' || categoryType == '3'" ref="ModuleImgListRef" @actionNode="actionNode" @getCategory="getCategory" />
          <ModuleInfoList v-else ref="ModuleInfoListRef" :categoryid="categoryid" :menuId="menuId" @getCategory="getCategory" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
  <a-drawer
    :title="`模型库管理`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onClose"
    @close="onClose">
    <div v-for="(item, index) in titleList" :key="index">
      <p style="margin-left: 15px; margin-top: 10px">
        <EpcIcon type="icon-caidan" style="font-size: 12px" />
        <b style="margin-left: 10px">{{ item.categoryName }}</b>
      </p>
      <div style="width: 400px; display: flex; flex-wrap: wrap; margin-left: 30px">
        <div v-for="(item2, index2) in item.children" :key="index2" style="width: 130px; padding: 0 0 20px 0; cursor: pointer" @click="changeTitleModule(item2)">
          <EpcIcon type="icon-chilun--" style="font-size: 14px; color: #0d65ff" /><a class="menuLi">{{ item2.categoryName }}</a>
        </div>
      </div>
    </div>
  </a-drawer>
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
