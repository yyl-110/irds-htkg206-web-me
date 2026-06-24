<script setup lang="ts">
import { computed, h, inject, nextTick, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePlatformPickerDrawerLifecycle } from '@/composables/usePlatformPickerDrawerLifecycle';
import {
  consumeSkipPlatformPickerDrawerOnTab,
  createPlatformPickerDrawerStyle,
  normalizePlatformPickerList,
  shouldAutoSelectSinglePlatform,
} from '@/utils/platformPickerDrawerNav';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message, Tooltip } from 'ant-design-vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, LeftOutlined, RightOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import knowledgeConfig from '../components/knowledge-config.vue';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import { fetchPlatformPickerList } from '@/utils/platformPickerList';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { ActivityPageRequestDTOModel } from '@/api/models/activityPage/ActivityPageRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Tree from '@/components/tree/tree.vue';
import { useUserStore } from '@/store/modules/user';
import { useLayoutStore } from '@/store/modules/layout/layout';
import SelectBoomTree from './components/selectBoomTree.vue';
import ActivityAdd from './components/activity-add.vue';
import ActivityUpdate from './components/activity-update.vue';
import ActivityConfigModal from './components/activity-config-modal.vue';
import ActivityPreviewModal from './components/activity-preview-modal.vue';
import ActivityCheckConfigModal from './components/activity-check-config-modal.vue';
import ActivityCheckPreviewModal from './components/activity-check-preview-modal.vue';
import CustomPageParamModal from './components/custom-page-param-modal.vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { downloadFileFromStream } from '@/utils/file';
import { normalizeListSnowflakeIds, toSnowflakeIdStr } from '@/utils/snowflakeId';
import { resolveCustomPagePreviewTarget } from './custompage/registry/index';
import ProductPlatformPicker from '@/components/ProductPlatformPicker/index.vue';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import draggableModal from '@/components/DraggableModal/index.vue';
import DesignResourceShareModal from '../components/design-resource-share-modal.vue';

/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};
// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const loadingTree = ref<boolean>(false);
const treeNodeColmoun = ref<any[]>([]);
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const router = useRouter();
const pageName = ref<string>('');
const selectNodeKeys = ref<string>('');
const currentNode = ref<any>();
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 删除按钮状态：仅可操作行可批量删除 */
const deleteFlag = computed(() => {
  return getOperableSelectedRows().length === 0;
});

function canRowOperate(record: any) {
  return record?.canOperate === true;
}

function canRowShare(record: any) {
  return record?.canShare === true;
}

function getOperableSelectedRows() {
  return (selectedRowList.value || []).filter((r: any) => canRowOperate(r));
}

const designShareModalVisible = ref(false);
const designShareTarget = ref<{ bizId: string | number; title: string } | null>(null);

function openDesignShareModal(record: any) {
  if (!record?.id) return;
  designShareTarget.value = {
    bizId: toSnowflakeIdStr(record.id),
    title: `${record.pageName ?? ''} - 共享配置`,
  };
  designShareModalVisible.value = true;
}

function onDesignShareSaved() {
  void loadParameterListData();
}
/** 列表请求参数 */
const requestParams = reactive(new ActivityPageRequestDTOModel());
/** 列表数据 */
const datasource = ref<any>([]);
/** 初始化绑定分页请求参数 */
const { pagination, resetToFirstPage } = usePagination(requestParams, loadParameterListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '暂无数据',
    style: { paddingBottom: '50px' },
  }),
});
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const selectedRows = [...selectedRowList.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter(k => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
      }
      const sameIdKeys = selectedRows.map((item: any) => item.id);
      if (sameIdKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowList.value = selectedRows.filter(item => item.id !== key);
      } else {
        // 如果未选中则选中
        selectedRowList.value = [...selectedRows, record];
      }
    },
  };
}
const visible = ref<boolean>(false);
const updateVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const exportLoading = ref<boolean>(false);
const saveAsLoading = ref<boolean>(false);
const titleVisible = ref<boolean>(false);
const shouldShowDrawer = ref<boolean>(false);
const titleList = ref<any[]>([]);
const menuId = ref<string>('');
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '0px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh)',
});
function resetDrawerStyle() {
  drawerStyle.value = {};
}
const addModel = ref<any>();
const updateModel = ref<any>();
const isTestEnv =
  String(import.meta.env.VITE_BASE_URL_TEST ?? '')
    .replace(/['"]/g, '')
    .toLowerCase() === 'true';

function randomSynergyDisplay() {
  return Math.random() < 0.5 ? '是' : '否';
}

const synergyColumn: TableColumnType<Menus> = {
  title: WeiI18n.$t('是否协同'),
  dataIndex: 'isSynergy',
  key: 'isSynergy',
  align: 'center',
  resizable: true,
  width: 100,
};

const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('页面名称'),
    dataIndex: 'pageName',
    key: 'pageName',
    align: 'left',
    fixed: 'left',
    resizable: true,
    ellipsis: true,
    width: 220,
  },
  {
    title: WeiI18n.$t('页面模板类型'),
    dataIndex: 'pageType',
    key: 'pageType',
    align: 'left',
    resizable: true,
    width: 180,
  },
  {
    title: WeiI18n.$t('所属分类'),
    dataIndex: 'treeName',
    key: 'treeName',
    align: 'left',
    resizable: true,
    width: 160,
  },
  ...(isTestEnv ? [synergyColumn] : []),
  {
    title: WeiI18n.$t('组名称'),
    dataIndex: 'groupName',
    key: 'groupName',
    align: 'left',
    resizable: true,
    width: 130,
  },

  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    resizable: true,
    width: 150,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    resizable: true,
    width: 130,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'creatorName',
    key: 'creatorName',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 120,
  },
  {
    title: WeiI18n.$t('共享人'),
    dataIndex: 'sharedUserNames',
    key: 'sharedUserNames',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 140,
  },
  {
    title: WeiI18n.$t('页面知识'),
    dataIndex: 'knowledge',
    key: 'knowledge',
    align: 'center',
    resizable: false,
    width: 100,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 320,
    fixed: 'right',
    resizable: false,
  },
]);

/** 横向滚动：列宽 + 勾选列 + 缓冲（与 parameter 列表一致） */
const SCROLL_X_BUFFER_PX = 2;
const TABLE_SELECTION_COL_WIDTH_PX = 60;
const activityTableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + TABLE_SELECTION_COL_WIDTH_PX + SCROLL_X_BUFFER_PX;
});

/** 表头排序、页面名称列检索（与 parameter/index.vue 一致） */
type ActivitySortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: ActivitySortOrder }>({ key: '', order: '' });
const filterValueMap = ref<Record<string, string>>({ pageName: '' });
const filterOpenMap = ref<Record<string, boolean>>({});

const activityTableDisplayList = computed(() => {
  let list = [...datasource.value];
  if (!sortState.value.key || !sortState.value.order) return list;
  const key = sortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[key], b[key]));
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function isActivityTableSelectionColumn(column: any) {
  const c = column?.className;
  if (typeof c === 'string') return c.includes('selection-column');
  if (Array.isArray(c)) return c.some((x: unknown) => String(x).includes('selection-column'));
  return false;
}

function isSortableActivityColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation') return false;
  return true;
}

function isFilterableActivityColumn(column: any) {
  return column?.dataIndex === 'pageName';
}

function toggleActivityColumnSort(column: any) {
  if (!isSortableActivityColumn(column)) return;
  const key = String(column.dataIndex);
  if (sortState.value.key !== key) {
    sortState.value = { key, order: 'ascend' };
    return;
  }
  if (sortState.value.order === 'ascend') {
    sortState.value = { key, order: 'descend' };
    return;
  }
  if (sortState.value.order === 'descend') {
    sortState.value = { key: '', order: '' };
    return;
  }
  sortState.value = { key, order: 'ascend' };
}

function getActivitySortOrder(key: string): ActivitySortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function getActivityFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function handleActivityFilterOpenChange(key: string, open: boolean) {
  if (open && key === 'pageName') {
    filterValueMap.value = { ...filterValueMap.value, pageName: String(pageName.value ?? '') };
  }
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function applyActivityColumnFilter(key: string) {
  const v = String(filterValueMap.value[key] ?? '').trim();
  if (key === 'pageName') pageName.value = v;
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void loadParameterListData();
}

function resetActivityColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  if (key === 'pageName') pageName.value = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  filterOpenMap.value = { ...filterOpenMap.value, [key]: false };
  void loadParameterListData();
}

function getActivityTableRowKey(record: any) {
  return record.id;
}

function getActivityTableRowClassName(_record: any, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
}

/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const data: any = {};
    data.menuId = menuId.value;
    const res = await AdminApiActivityPage.getActivityTree(data);
    console.log(res);
    loadingTree.value = false;
    // 处理返回的数据格式
    if ((res.data.code == 0 || res.data.code == 200) && res.data.data) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      // 保存原始数据
      dataSource.value = rawData[0];
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

async function getMenuListData(options?: { forceOpenDrawer?: boolean }) {
  try {
    titleList.value = await fetchPlatformPickerList({ force: options?.forceOpenDrawer });
    if (!options?.forceOpenDrawer && consumeSkipPlatformPickerDrawerOnTab()) {
      shouldShowDrawer.value = false;
      titleVisible.value = false;
      resetDrawerStyle();
      if (!menuId.value && titleList.value.length > 0) {
        menuId.value = String(titleList.value[0]?.id ?? '');
        await getListData();
      }
      return;
    }
    if (shouldAutoSelectSinglePlatform(titleList.value)) {
      shouldShowDrawer.value = false;
      await updateMenu(titleList.value[0]);
      return;
    }
    drawerStyle.value = createPlatformPickerDrawerStyle(layoutStore.asideWidthStyle);
    shouldShowDrawer.value = true;
    titleVisible.value = true;
  } catch (error) {
    console.error('获取平台分类失败:', error);
  }
}

async function updateMenu(item: any) {
  menuId.value = String(item?.id ?? '');
  onCloseDrawer();
  await getListData();
}

function onCloseDrawer() {
  resetDrawerStyle();
  titleVisible.value = false;
}

onMounted(() => {
  drawerStyle.value = createPlatformPickerDrawerStyle(layoutStore.asideWidthStyle);
});

usePlatformPickerDrawerLifecycle(getMenuListData, {
  onTabSkip: () => {
    shouldShowDrawer.value = false;
    titleVisible.value = false;
    resetDrawerStyle();
  },
});

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
  await AdminApiActivityPage.sortDownTreeNode({ id: selectedKeys.key });
  await getListData('change');
  Selectafterchanges();
}

async function upNode(selectedKeys: any) {
  await AdminApiActivityPage.sortUpTreeNode({ id: selectedKeys.key });
  await getListData('change');
  Selectafterchanges();
}
function Selectafterchanges() {
  selectedKeys.value = currentNode.value.key;
}
async function selectNode(node: any) {
  currentNode.value = node;
  pageName.value = '';
  selectNodeKeys.value = node.key;
  resetToFirstPage();
  loadParameterListData();
}

async function loadParameterListData() {
  loading.value = true;
  try {
    const data: any = {};
    data.treeId = selectNodeKeys.value || selectedKeys.value;
    data.pageName = pageName.value;
    data.pageNo = requestParams.pageNo;
    data.pageSize = requestParams.pageSize;
    const res = await AdminApiActivityPage.getActivityPage(data);
    const list = normalizeListSnowflakeIds(res.data.data.list || []);
    datasource.value = isTestEnv ? list.map((row: any) => ({ ...row, isSynergy: randomSynergyDisplay() })) : list;
    pagination.total = res.data.data.total;
  } finally {
    loading.value = false;
  }
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
      key: 'categoryName',
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
  const res = await AdminApiActivityPage.delTreeNode({ id: selectedKeys.key });
  await getListData();
  message.success(WeiI18n.t('删除成功').value);
}

// 树选择器模态框相关状态
const selectTreeVisible = ref<boolean>(false);
const currentSelectField = ref<any>(null);
const selectTreeData = ref<any[]>([]);
const selectTreeSelectedKeys = ref<string>('');

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
  data.name = nodeList.categoryName;
  data.parentId = nodeList.pid;
  data.menuId = menuId.value;
  const res = await AdminApiActivityPage.saveActivityTree(data);
  await getListData('change');
  Selectafterchanges();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  console.log(nodeList);
  const data: any = {};
  data.name = nodeList.categoryName;
  data.parentId = nodeList.pid;
  data.id = nodeList.id;
  data.menuId = menuId.value;
  const res = await AdminApiActivityPage.editActivityTree(data);
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

/**
 * 新增
 * @param id id
 * @param parentId parentId
 */
function handleAddOrUpdate(data: any) {
  visible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    addModel.value?.infoReload(selectNodeKeys.value);
  });
}

/**
 * 修改
 * @param data data
 */
function handleUpdate(data: any) {
  if (!canRowOperate(data)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  updateVisible.value = true;
  // 根据menuId获取修改的记录
  nextTick(() => {
    updateModel.value?.infoReload(data, selectNodeKeys.value);
  });
}

/**
 * 查询表格数据
 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  void loadParameterListData();
}

function handleResizeColumn(w, col) {
  col.width = w;
}

function handleCloseAddModal() {
  visible.value = false;
}

function handleCloseUpdateModal() {
  updateVisible.value = false;
}

/**
 * 删除数据
 * @param id id
 */
async function handleParameterDelete(data: any) {
  if (data == undefined) {
    const operableRows = getOperableSelectedRows();
    if (!operableRows.length) {
      message.warning(WeiI18n.t('所选数据无删除权限').value || '所选数据无删除权限');
      return;
    }
    if (operableRows.length < selectedRowList.value.length) {
      message.warning('已跳过无权限的数据，仅删除有权限的项');
    }
    let infoDel: any = { checkList: [] };
    operableRows.forEach((item: any) => {
      infoDel.checkList.push({ id: item.id });
    });
    infoDel.userid = userStore.getUser.id;
    await AdminApiActivityPage.deleteActivityInfo(infoDel);
  } else {
    if (!canRowOperate(data)) {
      message.warning('无操作权限，仅可预览');
      return;
    }
    let infoDel: any = { checkList: [] };
    infoDel.checkList[0] = { id: data.id };
    infoDel.userid = userStore.getUser.id;
    await AdminApiActivityPage.deleteActivityInfo(infoDel);
  }
  loadParameterListData();
}
// ---------------------------导入/导出------------------------------------
// 导出附件
async function exportParameData() {
  exportLoading.value = true;
  try {
    let data: any = {};
    data.categoryid = selectNodeKeys.value;
    const res = await AdminApiActivityPage.exportDatatempalteinfo(data);
    const fileName = '系统参数.xlsx';
    downloadFileFromStream(res, fileName);
  } catch (err) {
    message.error(WeiI18n.t('导出失败').value);
    console.error('exportParameData error:', err);
  } finally {
    exportLoading.value = false;
  }
}
const batchflag = ref<boolean>(false);
async function handleUploadFile() {
  fileList.value = [];
  batchflag.value = true;
}

/** 另存为：待复制的源活动行 */
const saveAsSourceRecord = ref<any>(null);
const saveAsPlatformVisible = ref(false);
const saveAsTreeVisible = ref(false);
const saveAsTargetMenuId = ref<string>('');
const saveAsTreeData = ref<any[]>([]);
const saveAsTreeSelectedKey = ref<string>('');
/** 产品平台选择器用途：menu=进入页面选平台，saveAs=另存为选目标平台 */
const platformPickerMode = ref<'menu' | 'saveAs'>('menu');

const platformPickerVisible = computed(() => titleVisible.value || saveAsPlatformVisible.value);
const platformPickerMounted = computed(() => shouldShowDrawer.value || saveAsPlatformVisible.value);

function onPlatformPickerSelect(item: any) {
  if (platformPickerMode.value === 'saveAs') {
    void onSaveAsPlatformSelected(item);
    return;
  }
  void updateMenu(item);
}

function onPlatformPickerClose() {
  if (platformPickerMode.value === 'saveAs') {
    saveAsPlatformVisible.value = false;
    platformPickerMode.value = 'menu';
    return;
  }
  onCloseDrawer();
}

function handleSaveAs() {
  const rows = selectedRowList.value?.length ? selectedRowList.value : [];
  if (rows.length !== 1) {
    message.warning('请勾选一条活动数据进行另存为');
    return;
  }
  saveAsSourceRecord.value = rows[0];
  if (!titleList.value.length) {
    message.warning('暂无可选产品平台');
    return;
  }
  platformPickerMode.value = 'saveAs';
  if (titleList.value.length === 1) {
    void onSaveAsPlatformSelected(titleList.value[0]);
    return;
  }
  saveAsPlatformVisible.value = true;
}

const migrateCalcPageModalVisible = ref(false);
const migrateCalcPageId = ref('');
const migrateCalcPageLoading = ref(false);

const migrateTemplatePageModalVisible = ref(false);
const migrateTemplatePageId = ref('');
const migrateTemplatePageLoading = ref(false);

function getSelectedCategoryTreeId() {
  return String(selectNodeKeys.value || selectedKeys.value || currentNode.value?.key || '');
}

function saveHistroyCheckInfo() {
  if (!getSelectedCategoryTreeId()) {
    message.warning('请先选择分类树节点');
    return;
  }
  migrateCalcPageId.value = '';
  migrateCalcPageModalVisible.value = true;
}

function cancelMigrateCalcPage() {
  migrateCalcPageModalVisible.value = false;
  migrateCalcPageId.value = '';
}

async function confirmMigrateCalcPage() {
  const calcPageId = migrateCalcPageId.value?.trim();
  if (!calcPageId) {
    message.warning('请输入计算页面id');
    return;
  }
  const treeId = getSelectedCategoryTreeId();
  if (!treeId) {
    message.warning('请先选择分类树节点');
    return;
  }
  migrateCalcPageModalVisible.value = false;
  migrateCalcPageLoading.value = true;
  try {
    const res = await AdminApiActivityPage.migrateCalcPage({
      calcPageId,
      treeId,
    });
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      message.success('迁移成功');
      await loadParameterListData();
    } else {
      message.error(res?.data?.msg || '迁移失败');
    }
  } catch (error) {
    console.error('migrateCalcPage failed:', error);
    message.error('迁移失败');
  } finally {
    migrateCalcPageLoading.value = false;
    migrateCalcPageId.value = '';
  }
}

function openMigrateTemplatePageModal() {
  if (!getSelectedCategoryTreeId()) {
    message.warning('请先选择分类树节点');
    return;
  }
  migrateTemplatePageId.value = '';
  migrateTemplatePageModalVisible.value = true;
}

function cancelMigrateTemplatePage() {
  migrateTemplatePageModalVisible.value = false;
  migrateTemplatePageId.value = '';
}

async function confirmMigrateTemplatePage() {
  const templatePageId = migrateTemplatePageId.value?.trim();
  if (!templatePageId) {
    message.warning('请输入设计配置页面id');
    return;
  }
  const treeId = getSelectedCategoryTreeId();
  if (!treeId) {
    message.warning('请先选择分类树节点');
    return;
  }
  migrateTemplatePageModalVisible.value = false;
  migrateTemplatePageLoading.value = true;
  try {
    const res = await AdminApiActivityPage.migrateTemplatePage({
      templatePageId,
      treeId,
    });
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      message.success(res?.data?.data?.message || '迁移成功');
      await loadParameterListData();
    } else {
      message.error(res?.data?.msg || '迁移失败');
    }
  } catch (error) {
    console.error('migrateTemplatePage failed:', error);
    message.error('迁移失败');
  } finally {
    migrateTemplatePageLoading.value = false;
    migrateTemplatePageId.value = '';
  }
}

// ---------------------------分配分类------------------------------------
const assignCategoryModalVisible = ref(false);
const assignCategoryLoading = ref(false);
const assignCategorySubmitLoading = ref(false);
const assignCategoryPlatforms = ref<any[]>([]);
const assignCategoryActiveMenuId = ref<string>('');
const assignCategoryTreeData = ref<any[]>([]);
const assignCategorySelectedKey = ref<string>('');

function canAssignActivityToTargetNode(node: any) {
  if (!node?.key) {
    return false;
  }
  return (node.level ?? 0) >= 3;
}

async function loadAssignCategoryTree(menuIdValue: string) {
  if (!menuIdValue) {
    assignCategoryTreeData.value = [];
    return;
  }
  assignCategoryLoading.value = true;
  try {
    const res = await AdminApiActivityPage.getActivityTree({ menuId: menuIdValue });
    if ((res.data.code === 0 || res.data.code === 200) && res.data.data != null) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      assignCategoryTreeData.value = convertToTreeNodes(rawData);
    } else {
      assignCategoryTreeData.value = [];
    }
  } catch (error) {
    console.error('loadAssignCategoryTree failed:', error);
    assignCategoryTreeData.value = [];
    message.error('加载分类树失败');
  } finally {
    assignCategoryLoading.value = false;
  }
}

async function openAssignCategoryModal() {
  const rows = getOperableSelectedRows();
  if (!rows.length) {
    message.warning('请先勾选要分配的活动页');
    return;
  }
  assignCategoryModalVisible.value = true;
  assignCategorySelectedKey.value = '';
  assignCategoryLoading.value = true;
  try {
    assignCategoryPlatforms.value = await fetchPlatformPickerList();
    if (!assignCategoryPlatforms.value.length) {
      message.warning('暂无可选产品平台');
      assignCategoryTreeData.value = [];
      return;
    }
    const defaultMenuId = String(menuId.value || assignCategoryPlatforms.value[0]?.id || '');
    assignCategoryActiveMenuId.value = defaultMenuId;
    await loadAssignCategoryTree(defaultMenuId);
  } catch (error) {
    console.error('openAssignCategoryModal failed:', error);
    message.error('加载产品平台失败');
  } finally {
    assignCategoryLoading.value = false;
  }
}

async function onAssignCategoryTabChange(activeKey: string | number) {
  assignCategoryActiveMenuId.value = String(activeKey);
  assignCategorySelectedKey.value = '';
  await loadAssignCategoryTree(assignCategoryActiveMenuId.value);
}

function onAssignCategoryTreeSelect(selectedKeys: any[]) {
  assignCategorySelectedKey.value = selectedKeys?.[0] ?? '';
}

function cancelAssignCategory() {
  assignCategoryModalVisible.value = false;
  assignCategorySelectedKey.value = '';
  assignCategoryTreeData.value = [];
}

async function confirmAssignCategory() {
  if (!assignCategorySelectedKey.value) {
    message.warning('请选择目标分类节点');
    return;
  }
  const targetNode = findNodeById(assignCategoryTreeData.value, assignCategorySelectedKey.value);
  if (!canAssignActivityToTargetNode(targetNode)) {
    message.warning('请选择三级及以下具体分类节点');
    return;
  }
  if (!assignCategoryActiveMenuId.value) {
    message.warning('请选择产品平台');
    return;
  }
  const activityPageIds = getOperableSelectedRows()
    .map((row: any) => row.id)
    .filter((id: any) => id != null && id !== '');
  if (!activityPageIds.length) {
    message.warning('未找到有效的活动页记录');
    return;
  }
  assignCategorySubmitLoading.value = true;
  try {
    const res = await AdminApiActivityPage.assignActivitiesToCategory({
      activityPageIds,
      treeId: assignCategorySelectedKey.value,
      menuId: assignCategoryActiveMenuId.value,
    });
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      const resultMsg = res?.data?.data?.message || '分配成功';
      message.success(resultMsg);
      assignCategoryModalVisible.value = false;
      selectedRowList.value = [];
      await loadParameterListData();
      if (menuId.value === assignCategoryActiveMenuId.value) {
        await getListData('change');
      }
    } else {
      message.error(res?.data?.msg || '分配失败');
    }
  } catch (error) {
    console.error('confirmAssignCategory failed:', error);
    message.error('分配失败');
  } finally {
    assignCategorySubmitLoading.value = false;
    assignCategorySelectedKey.value = '';
  }
}

async function onSaveAsPlatformSelected(item: any) {
  saveAsPlatformVisible.value = false;
  platformPickerMode.value = 'menu';
  saveAsTargetMenuId.value = String(item?.id ?? '');
  if (!saveAsTargetMenuId.value) {
    message.warning('产品平台无效');
    return;
  }
  try {
    const res = await AdminApiActivityPage.getActivityTree({ menuId: saveAsTargetMenuId.value });
    const rawData = Array.isArray(res?.data?.data) ? res.data.data : res?.data?.data ? [res.data.data] : [];
    if (!rawData.length) {
      message.warning('目标平台下暂无活动树，请先维护活动树');
      return;
    }
    saveAsTreeData.value = convertToTreeNodes(rawData);
    saveAsTreeSelectedKey.value = '';
    saveAsTreeVisible.value = true;
  } catch (error) {
    console.error('load save-as tree failed:', error);
    message.error('加载活动树失败');
  }
}

function onSaveAsTreeNodeSelect(selectedKeys: any[]) {
  saveAsTreeSelectedKey.value = selectedKeys?.[0] ?? '';
}

function cancelSaveAsTree() {
  saveAsTreeVisible.value = false;
  saveAsTreeSelectedKey.value = '';
}

function handleSelectTreeNodeChange(selectedKeys: any[], info: any) {
  if (saveAsTreeVisible.value) {
    onSaveAsTreeNodeSelect(selectedKeys);
    return;
  }
  handleSelectTreeNode(selectedKeys, info);
}

function handleSelectTreeConfirm() {
  if (saveAsTreeVisible.value) {
    void confirmSaveAsTree();
    return;
  }
  confirmSelectTreeNode(undefined);
}

function handleSelectTreeCancel() {
  if (saveAsTreeVisible.value) {
    cancelSaveAsTree();
    return;
  }
  cancelSelectTreeNode();
}

async function confirmSaveAsTree() {
  if (!saveAsTreeSelectedKey.value) {
    message.warning('请选择目标活动树节点');
    return;
  }
  if (!saveAsSourceRecord.value?.id) {
    message.warning('源活动数据无效');
    return;
  }
  saveAsLoading.value = true;
  try {
    const res = await AdminApiActivityPage.saveAsActivityInfo({
      sourceActivityPageId: saveAsSourceRecord.value.id,
      targetMenuId: saveAsTargetMenuId.value,
      targetTreeId: saveAsTreeSelectedKey.value,
    });
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      message.success('另存为成功');
      saveAsTreeVisible.value = false;
      saveAsSourceRecord.value = null;
      selectedRowkeys.value = [];
      selectedRowList.value = [];
      if (menuId.value === saveAsTargetMenuId.value) {
        await loadParameterListData();
      }
    } else {
      message.error(res?.data?.msg || '另存为失败');
    }
  } catch (error) {
    console.error('save-as failed:', error);
    message.error('另存为失败');
  } finally {
    saveAsLoading.value = false;
  }
}
// 下载附件
async function templateDownload() {
  const res = await AdminApiActivityPage.downloadExcel({});
  const fileName = '系统参数.xlsx';
  downloadFileFromStream(res, fileName);
}
/** 文件列表 */
const fileList = ref<any>([]);
async function customRequest(options: any) {
  fileList.value[0] = options.file;
}
function filechange(file: any) {
  fileList.value[0] = file;
}
// 导入附件
async function importSuccessfulFun() {
  const res = await AdminApiSystemUploadFile.templateImportData({
    file: fileList.value[0] as File,
    userid: userStore.getUser.id,
    categoryid: selectNodeKeys.value,
  });
  batchflag.value = false;
  message.success(res.data.data);
  loadParameterListData();
}

// 打开知识配置弹窗，带入当前行 id 与 knowledge 字段
const activityConfigVisible = ref(false);
const currentConfigRecord = ref<any>({});
const activityCheckConfigVisible = ref(false);
const currentCheckConfigRecord = ref<any>({});
const activityConfigSaving = ref(false);
const activityCheckConfigSaving = ref(false);
const activityPreviewVisible = ref(false);
const currentPreviewRecord = ref<any>({});
const previewImageList = ref<any[]>([]);
const activityCheckPreviewVisible = ref(false);
const currentCheckPreviewRecord = ref<any>({});
const previewCheckImageList = ref<any[]>([]);
function toNumOrFallback(v: any, fallback = Number.MIN_SAFE_INTEGER) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
/** 保证页面配置弹窗能拿到 JS 脚本访问路径（列表 fillFileInfos 或兜底 download URL） */
function ensureJsFileFields(record: any) {
  const r = { ...(record || {}) };
  const path = String(r.jsFilePath ?? r.jsFileInfo?.filePath ?? '').trim();
  if (path) {
    r.jsFilePath = path;
    return r;
  }
  const fileId = r.jsFileId ?? r.jsFileInfo?.fileId;
  if (fileId != null && String(fileId) !== '') {
    r.jsFilePath = `/Api/system-service/fileManagerController/download.json?fileId=${fileId}`;
  }
  return r;
}

/** 将 pageConfigList 的扁平 data[] 归并为设计器可直接初始化的 record 结构 */
function normalizePageConfigResponseToRecord(baseRecord: any, rows: any[]) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return { ...(baseRecord || {}) };
  // 同一 activityPage 可能返回多个 formId 的快照，优先取 formId 最大（最新）的一组
  const latestFormId = list.reduce((max, item) => Math.max(max, toNumOrFallback(item?.formId)), Number.MIN_SAFE_INTEGER);
  const filtered = list.filter(item => toNumOrFallback(item?.formId) === latestFormId);
  const finalList = filtered.length ? filtered : list;
  const sorted = [...finalList].sort((a, b) => toNumOrFallback(a?.sortNo, Number.MAX_SAFE_INTEGER) - toNumOrFallback(b?.sortNo, Number.MAX_SAFE_INTEGER));
  const isCalcPage = String(baseRecord?.pageType ?? '') === '2';
  const basicTypes = isCalcPage
    ? ['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'TITLE', 'DIVIDER', 'DATA_VIEW', 'CALC_BUTTON', 'OUTPUT_IMAGE']
    : ['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'RADIO', 'DATE', 'TITLE', 'PLAIN_TEXT', 'RICH_TEXT', 'DIVIDER', 'DATA_VIEW'];
  const uploadTypes = isCalcPage ? [] : ['FILE'];
  const tableTypes = isCalcPage ? [] : ['TABLE'];
  const threeDTypes = isCalcPage ? [] : ['3D_VIEW'];
  const pick = (types: string[]) => sorted.filter(item => types.includes(String(item?.componentType || '')));
  return {
    ...(baseRecord || {}),
    formId: sorted[0]?.formId ?? null,
    formCode: sorted[0]?.formCode ?? null,
    activityPageId: sorted[0]?.activityPageId ?? baseRecord?.id ?? null,
    basicComponentList: pick(basicTypes),
    threeDComponentList: pick(threeDTypes),
    uploadComponentList: pick(uploadTypes),
    tableComponentList: pick(tableTypes),
  };
}
const customPageParamModalRef = ref<any>(null);

/** 自定义页面：打开「关联参数」穿梭配置；其它页面走设计器配置 */
function handlePageConfigClick(record: any) {
  if (!canRowOperate(record)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  if (String(record?.pageType ?? '') === '3') {
    customPageParamModalRef.value?.open(record);
    return;
  }
  void showPageConfigModal(record);
}

async function showPageConfigModal(record: any) {
  const res = await AdminApiActivityPage.pageConfigList({ activityPageId: record.id });
  const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
  const normalizedRecord = ensureJsFileFields(normalizePageConfigResponseToRecord(record, rows));
  if (String(record?.pageType ?? '') === '2') {
    currentCheckConfigRecord.value = normalizedRecord;
    activityConfigVisible.value = false;
    activityCheckConfigVisible.value = true;
    return;
  }
  currentConfigRecord.value = normalizedRecord;
  activityCheckConfigVisible.value = false;
  activityConfigVisible.value = true;
}

/** 自定义页面（pageType=3）预览：支持 page key（如 customizedProcess-ansys）或完整 URL */
function previewCustomActivityPage(record: any) {
  const target = resolveCustomPagePreviewTarget(record);
  if (!target) {
    message.warning('该自定义页面未配置页面URL');
    return;
  }
  const href = target.type === 'external' ? target.href : `${window.location.origin}${window.location.pathname}${router.resolve({ path: target.path, query: target.query }).href}`;
  window.open(href, '_blank', 'noopener,noreferrer');
}

function handleActivityPagePreview(record: any) {
  if (String(record?.pageType ?? '') === '3') {
    previewCustomActivityPage(record);
  } else {
    void priviewPageConfigModal(record);
  }
}

async function priviewPageConfigModal(record: any) {
  try {
    const res = await AdminApiActivityPage.pageConfigList({ activityPageId: record.id });
    const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
    const normalizedRecord = normalizePageConfigResponseToRecord(record, rows);
    const params = { activityPageId: record.id };
    const data = await AdminApiActivityPage.activityImageList(params);
    const images = Array.isArray(data?.data?.data) ? data.data.data : [];
    if (String(record?.pageType ?? '') === '2') {
      currentCheckPreviewRecord.value = normalizedRecord;
      previewCheckImageList.value = images;
      activityCheckPreviewVisible.value = true;
      return;
    }
    currentPreviewRecord.value = normalizedRecord;
    previewImageList.value = images;
    activityPreviewVisible.value = true;
  } catch (error) {
    console.error('preview activity config failed:', error);
    message.error('页面预览加载失败');
  }
}

function closeActivityPreviewModal() {
  activityPreviewVisible.value = false;
  currentPreviewRecord.value = {};
  previewImageList.value = [];
}
function closeActivityCheckPreviewModal() {
  activityCheckPreviewVisible.value = false;
  currentCheckPreviewRecord.value = {};
  previewCheckImageList.value = [];
}

function closeActivityConfigModal() {
  activityConfigVisible.value = false;
}
function closeActivityCheckConfigModal() {
  activityCheckConfigVisible.value = false;
}

async function saveActivityConfig(payload: any) {
  activityConfigSaving.value = true;
  try {
    const res = await AdminApiActivityPage.saveActivityPageFormComponent(payload);
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      message.success('配置保存成功');
      activityConfigVisible.value = false;
    } else {
      message.error(res?.data?.msg || '配置保存失败');
    }
  } catch (error) {
    console.error('save activity config failed:', error);
    message.error('配置保存失败');
  } finally {
    activityConfigSaving.value = false;
  }
}

/** 计算页面配置：保存成功后关闭弹窗 */
async function saveActivityCheckConfig(payload: any) {
  activityCheckConfigSaving.value = true;
  try {
    const res = await AdminApiActivityPage.saveActivityPageFormComponent(payload);
    if (res?.data?.code === 0 || res?.data?.code === 200) {
      message.success('配置保存成功');
      activityCheckConfigVisible.value = false;
    } else {
      message.error(res?.data?.msg || '配置保存失败');
    }
  } catch (error) {
    console.error('save activity check config failed:', error);
    message.error('配置保存失败');
  } finally {
    activityCheckConfigSaving.value = false;
  }
}

// 知识配置弹窗
const knowledgeConfigRef = ref<any>(null);

async function showKnowledgeModal(record: any) {
  if (!canRowOperate(record)) {
    message.warning('无操作权限，仅可预览');
    return;
  }
  knowledgeConfigRef.value?.show(record?.id);
}

// 分享知识弹窗
const shareModalVisible = ref(false);
const shareModalTitle = ref<string>('');
const shareLoading = ref(false);
const shareList = ref<any[]>([]);

async function showShareModal(record: any) {
  shareModalTitle.value = `${record?.pageName ?? ''} - 知识分享`;
  shareModalVisible.value = true;
  shareList.value = [];
  try {
    shareLoading.value = true;
    const res = await AdminApiSystemParameter.getParameterActList({ businessId: record?.id, type: '2' });
    if (res?.data?.code === '0' || res?.data?.code === 200) {
      shareList.value = Array.isArray(res.data.data) ? res.data.data : [];
    }
  } catch (error) {
    console.error('showShareModal error:', error);
  } finally {
    shareLoading.value = false;
  }
}

function closeShareModal() {
  shareModalVisible.value = false;
  shareList.value = [];
  shareModalTitle.value = '';
}

const { leftTreeCollapsed, leftTreePaneSize, rightTreePaneSize, minExpanded, onSplitpanesResized, toggleLeftTreePanel, splitToggleStyle, splitpanesTreeCollapseWrapClass } =
  useSplitpanesTreeCollapse();
</script>

<template>
  <div class="drawerContent h-full">
    <div :class="splitpanesTreeCollapseWrapClass" class="h-full">
      <!-- 左侧树结构 -->
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

        <!-- 右侧内容区域（布局与 parameter/index 列表区一致） -->
        <Pane class="splitpane-cls activity-right-pane" :size="rightTreePaneSize">
          <div class="calc-config-pane">
            <a-card class="calc-toolbar-card">
              <a-form class="calc-toolbar-form" layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
                <a-form-item name="pageName">
                  <a-input v-model:value="pageName" style="width: 220px" allow-clear :placeholder="$t('请输入活动名称')" />
                </a-form-item>
                <a-form-item class="activity-toolbar-btns">
                  <a-button type="primary" @click="loadParameterListData">
                    <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                    {{ $t('查询') }}
                  </a-button>
                  <a-button type="primary" @click="handleAddOrUpdate(undefined)">
                    <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
                    {{ $t('新建') }}
                  </a-button>
                  <!--删除按钮（批量删除需二次确认）-->
                  <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(undefined)">
                    <a-button type="primary" danger :disabled="deleteFlag">
                      <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
                      {{ $t('删除') }}
                    </a-button>
                  </a-popconfirm>
                  <!--导入数据按钮-->
                  <a-button type="primary" :loading="saveAsLoading" @click="handleSaveAs">
                    <EpcIcon type="icon-daiyanshou1" style="font-size: 12px" />
                    {{ $t('另存为') }}
                  </a-button>
                  <!--导出数据按钮-->
                  <a-button type="primary" :loading="exportLoading" @click="exportParameData()">
                    <EpcIcon type="icon-daochu" style="font-size: 12px" />
                    {{ $t('导出') }}
                  </a-button>

                  <a-button type="primary" :loading="migrateCalcPageLoading" @click="saveHistroyCheckInfo()">
                    <EpcIcon type="icon-daochu" style="font-size: 12px" />
                    {{ $t('迁移计算页面') }}
                  </a-button>
                  <a-button type="primary" :loading="migrateTemplatePageLoading" @click="openMigrateTemplatePageModal()">
                    <EpcIcon type="icon-daochu" style="font-size: 12px" />
                    {{ $t('迁移设计配置页') }}
                  </a-button>
                  <a-button type="primary" :disabled="deleteFlag" @click="openAssignCategoryModal()">
                    <EpcIcon type="icon-fenpei" style="font-size: 12px" />
                    {{ $t('分配分类') }}
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>

            <a-card class="calc-table-card">
              <a-table
                class="exe-config-table"
                :scroll="{ x: activityTableScrollX, y: 'calc(100vh - 300px)' }"
                :row-key="getActivityTableRowKey"
                :columns="columns"
                :data-source="activityTableDisplayList"
                :pagination="pagination"
                :row-selection="rowSelection"
                :customRow="customRow"
                bordered
                table-layout="fixed"
                :locale="locale"
                :loading="loading"
                :row-class-name="getActivityTableRowClassName"
                @resize-column="handleResizeColumn">
                <template #headerCell="{ column }">
                  <template v-if="isActivityTableSelectionColumn(column)">
                    <span />
                  </template>
                  <template v-else-if="isSortableActivityColumn(column) || isFilterableActivityColumn(column)">
                    <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isFilterableActivityColumn(column) }">
                      <span class="header-title-sort" :class="{ 'header-title-sort--disabled': !isSortableActivityColumn(column) }" @click.stop="toggleActivityColumnSort(column)">
                        <span>{{ column.title }}</span>
                        <span v-if="isSortableActivityColumn(column)" class="header-sort-icon">
                          <CaretUpOutlined v-if="getActivitySortOrder(String(column.dataIndex)) === 'ascend'" />
                          <CaretDownOutlined v-else-if="getActivitySortOrder(String(column.dataIndex)) === 'descend'" />
                          <CaretUpOutlined v-else class="header-sort-icon--muted" />
                        </span>
                      </span>
                      <span v-if="isFilterableActivityColumn(column)" class="header-filter-anchor">
                        <a-popover
                          trigger="click"
                          placement="bottomRight"
                          :open="getActivityFilterOpen(String(column.dataIndex))"
                          @openChange="handleActivityFilterOpenChange(String(column.dataIndex), $event)">
                          <template #content>
                            <div class="header-filter-pop">
                              <a-input v-model:value="filterValueMap[String(column.dataIndex)]" :placeholder="`${$t('搜索')} ${column.title}`" allow-clear />
                              <div class="header-filter-actions">
                                <a-button type="primary" size="small" @click="applyActivityColumnFilter(String(column.dataIndex))">
                                  <SearchOutlined />
                                  {{ $t('搜索') }}
                                </a-button>
                                <a-button size="small" @click="resetActivityColumnFilter(String(column.dataIndex))">{{ $t('重置') }}</a-button>
                              </div>
                            </div>
                          </template>
                          <FilterOutlined class="header-query-icon" />
                        </a-popover>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="header-cell-main header-cell-main--static">
                      <span class="header-title-sort header-title-sort--disabled">
                        <span>{{ column.title }}</span>
                      </span>
                    </div>
                  </template>
                </template>
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'knowledge'">
                    <span style="display: flex; justify-content: center; align-items: center">
                      <span v-if="record.knowledge" @click.stop.prevent="showShareModal(record)" style="cursor: pointer; color: var(--ant-primary-color)" title="查看知识">
                        <ShareAltOutlined style="font-size: 16px" />
                      </span>
                      <span v-else style="color: #bfbfbf">—</span>
                    </span>
                  </template>
                  <template v-else-if="column.dataIndex === 'operation'">
                    <div class="calc-operation-links" @click.stop>
                      <a @click.stop.prevent="handleActivityPagePreview(record)">{{ $t('预览') }}</a>
                      <template v-if="canRowOperate(record)">
                        <a @click.stop.prevent="handleUpdate(record)">{{ $t('编辑') }}</a>
                        <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(record)">
                          <a href="#" class="calc-operation-links__danger" @click.prevent>{{ $t('删除') }}</a>
                        </a-popconfirm>
                        <a @click.stop.prevent="handlePageConfigClick(record)">
                          {{ String(record.pageType) === '3' ? $t('参数配置') : $t('页面配置') }}
                        </a>
                        <a @click.stop.prevent="showKnowledgeModal(record)">{{ $t('知识配置') }}</a>
                      </template>
                      <a v-if="canRowShare(record)" @click.stop.prevent="openDesignShareModal(record)">{{ $t('共享') }}</a>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'sharedUserNames'">
                    <span>{{ record.sharedUserNames || '—' }}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'creatorName'">
                    <span>{{ record.creatorName || '—' }}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'pageType'">
                    <span v-if="record.pageType === '1'">{{ $t('设计配置页面') }}</span>
                    <span v-else-if="record.pageType === '2'">{{ $t('计算集成页面') }}</span>
                    <span v-else-if="record.pageType === '3'">{{ $t('自定义页面') }}</span>
                  </template>
                  <template v-else>
                    {{ record[column.dataIndex] }}
                  </template>
                </template>
              </a-table>
            </a-card>
          </div>
        </Pane>
      </Splitpanes>

      <!-- 叠在分隔条上的折叠/展开（略低于中线拖动手柄，避免抢拖动） -->
      <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
        <button type="button" class="splitpanes-tree-collapse-wrap__toggle" :style="splitToggleStyle" @click="toggleLeftTreePanel" @mousedown.stop>
          <LeftOutlined v-if="!leftTreeCollapsed" />
          <RightOutlined v-else />
        </button>
      </Tooltip>
    </div>

    <DesignResourceShareModal
      v-model:visible="designShareModalVisible"
      biz-type="ACTIVITY"
      :biz-id="designShareTarget?.bizId"
      :title="designShareTarget?.title"
      @saved="onDesignShareSaved" />

    <!-- 知识配置弹窗 -->
    <knowledge-config ref="knowledgeConfigRef" @handleConfirmClose="() => getListData('change')" type="2" />

    <!-- 自定义页面：用户/部门关联参数 -->
    <CustomPageParamModal ref="customPageParamModalRef" @saved="loadParameterListData" />

    <!-- 分享知识弹窗：展示关联知识列表 -->
    <draggable-modal v-model:visible="shareModalVisible" :title="shareModalTitle" width="860px" :footer="null" centered @cancel="closeShareModal">
      <a-spin :spinning="shareLoading">
        <div class="share-knowledge-list min-h-[400px]">
          <template v-if="shareList.length > 0">
            <div v-for="(item, idx) in shareList" :key="idx" class="share-knowledge-item">
              <div class="share-knowledge-meta">
                <a-tag color="blue">{{ item.file?.title || '知识文档' }}</a-tag>
                <a-tag v-if="item.remark" color="default">{{ item.remark }}</a-tag>
                <a-tag v-if="item.versionNum" color="cyan">V{{ item.versionNum }}</a-tag>
              </div>
              <div v-if="item.file?.picture" class="share-knowledge-pictures">
                <a-image :src="item.file?.picture" :width="400" fit="contain" class="share-knowledge-img" />
              </div>
              <div v-if="item.file?.content" class="share-knowledge-content" v-html="item.file.content" />
              <a-divider v-if="idx < shareList.length - 1" style="margin: 12px 0" />
            </div>
          </template>
          <div v-else-if="!shareLoading" class="share-knowledge-empty">暂无关联知识</div>
        </div>
      </a-spin>
      <div class="share-knowledge-footer">
        <a-button @click="closeShareModal">关闭</a-button>
      </div>
    </draggable-modal>

    <!-- 其他弹窗/组件 -->
    <SelectBoomTree
      ref="selectBoomTreeRef"
      :modal-visible="selectTreeVisible || saveAsTreeVisible"
      :confirm-loading="saveAsTreeVisible && saveAsLoading"
      :select-tree-data="saveAsTreeVisible ? saveAsTreeData : selectTreeData"
      :select-tree-selected-keys="saveAsTreeVisible ? saveAsTreeSelectedKey : selectTreeSelectedKeys"
      @confirm-select-tree-node="handleSelectTreeConfirm"
      @cancel-select-tree-node="handleSelectTreeCancel"
      @handle-select-tree-node="handleSelectTreeNodeChange" />
    <ActivityAdd ref="addModel" :modal-visible="visible" @refresh-table-data="loadParameterListData" @close="handleCloseAddModal" />
    <ActivityUpdate ref="updateModel" :modal-visible="updateVisible" @refresh-table-data="loadParameterListData" @close="handleCloseUpdateModal" />
    <ImportFile
      :modalVisible="batchflag"
      :fileList="fileList"
      :selectedKeys="selectedKeys"
      @change="filechange"
      @customRequest="customRequest"
      @templateDownload="templateDownload"
      @importSuccessfulFun="importSuccessfulFun"
      @close="batchflag = false" />
    <ActivityConfigModal
      :modal-visible="activityConfigVisible"
      :record="currentConfigRecord"
      :save-loading="activityConfigSaving"
      :menu-id="menuId"
      @close="closeActivityConfigModal"
      @save="saveActivityConfig" />
    <ActivityPreviewModal :modal-visible="activityPreviewVisible" :record="currentPreviewRecord" :image-list="previewImageList" @close="closeActivityPreviewModal" />
    <ActivityCheckConfigModal
      :modal-visible="activityCheckConfigVisible"
      :record="currentCheckConfigRecord"
      :save-loading="activityCheckConfigSaving"
      :menu-id="menuId"
      @close="closeActivityCheckConfigModal"
      @save="saveActivityCheckConfig" />
    <ActivityCheckPreviewModal
      :modal-visible="activityCheckPreviewVisible"
      :record="currentCheckPreviewRecord"
      :image-list="previewCheckImageList"
      @close="closeActivityCheckPreviewModal" />

    <a-modal
      v-model:visible="migrateCalcPageModalVisible"
      :title="$t('迁移计算页面')"
      width="480px"
      :confirm-loading="migrateCalcPageLoading"
      destroy-on-close
      @ok="confirmMigrateCalcPage"
      @cancel="cancelMigrateCalcPage">
      <a-form layout="horizontal" :label-col="{ style: { width: '100px' } }">
        <a-form-item :label="$t('计算页面id')">
          <a-input v-model:value="migrateCalcPageId" allow-clear :placeholder="$t('请输入计算页面id')" @pressEnter="confirmMigrateCalcPage" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="migrateTemplatePageModalVisible"
      :title="$t('迁移设计配置页')"
      width="480px"
      :confirm-loading="migrateTemplatePageLoading"
      destroy-on-close
      @ok="confirmMigrateTemplatePage"
      @cancel="cancelMigrateTemplatePage">
      <a-form layout="horizontal" :label-col="{ style: { width: '120px' } }">
        <a-form-item :label="$t('设计配置页id')">
          <a-input v-model:value="migrateTemplatePageId" allow-clear :placeholder="$t('请输入 T_TEMPLATE_PAGE_INFO.ID')" @pressEnter="confirmMigrateTemplatePage" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配分类弹窗 -->
    <a-modal
      v-model:visible="assignCategoryModalVisible"
      :title="$t('分配分类')"
      width="720px"
      :confirm-loading="assignCategorySubmitLoading"
      destroy-on-close
      @ok="confirmAssignCategory"
      @cancel="cancelAssignCategory">
      <a-spin :spinning="assignCategoryLoading">
        <a-tabs v-if="assignCategoryPlatforms.length" v-model:activeKey="assignCategoryActiveMenuId" @change="onAssignCategoryTabChange">
          <a-tab-pane v-for="platform in assignCategoryPlatforms" :key="String(platform.id)" :tab="platform.categoryName || platform.name || String(platform.id)" />
        </a-tabs>
        <div v-if="assignCategoryTreeData.length" class="assign-category-tree-wrap">
          <a-directory-tree
            :show-icon="true"
            :tree-data="assignCategoryTreeData"
            :expand-action="false"
            default-expand-all
            :selected-keys="assignCategorySelectedKey ? [assignCategorySelectedKey] : []"
            @select="onAssignCategoryTreeSelect">
            <template #title="item">
              {{ item.partName }}
            </template>
          </a-directory-tree>
        </div>
        <div v-else-if="!assignCategoryLoading" class="assign-category-empty">{{ $t('暂无分类数据') }}</div>
      </a-spin>
    </a-modal>
  </div>
  <ProductPlatformPicker
    v-if="platformPickerMounted"
    :visible="platformPickerVisible"
    :drawer-style="drawerStyle"
    :list="titleList"
    @select="onPlatformPickerSelect"
    @close="onPlatformPickerClose" />
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
  // min-height: calc(100vh - 84px);
  background-color: #ffffff !important;
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
  display: inline-block;
  margin: 20px 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
}

.menuLi:hover {
  transform: translateY(-2px);
  color: #165dff;
}

/* ---------- 与 parameter/index.vue 列表区一致 ---------- */
.activity-right-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 10px;
}

.activity-toolbar-btns :deep(.ant-form-item-control-input-content) {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.calc-config-pane {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calc-toolbar-card {
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.calc-toolbar-form {
  gap: 4px;
}

.calc-table-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 0;
  }

  :deep(.ant-table-wrapper) {
    height: 100%;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    background: #fafafa !important;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
  }

  :deep(.ant-table-thead .ant-table-column-sorters) {
    justify-content: center !important;
  }

  :deep(.ant-table-thead .ant-table-column-title) {
    flex: none;
  }

  :deep(.ant-table-tbody > tr.odd > td) {
    background: #ffffff;
  }

  :deep(.ant-table-tbody > tr.even > td) {
    background: #f7f9fc;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-right: none !important;
  }

  :deep(.ant-table-tbody > tr > td:last-child) {
    border-right: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: 1px solid #e8e8e8 !important;
  }
}

.exe-config-table {
  :deep(.ant-table-cell-ellipsis .ant-typography) {
    margin-bottom: 0;
  }

  :deep(.ant-table-content),
  :deep(.ant-table-body) {
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  :deep(.ant-table-bordered > .ant-table-container) {
    border-left: none !important;
  }

  :deep(.ant-table-bordered .ant-table-thead > tr > th:first-child),
  :deep(.ant-table-bordered .ant-table-tbody > tr > td:first-child) {
    border-left: 1px solid #e8e8e8 !important;
  }

  :deep(.ant-table-cell-fix-left-last::after),
  :deep(.ant-table-cell-fix-right-first::after),
  :deep(.ant-table-cell-fix-left-first::after) {
    display: none !important;
  }

  :deep(.ant-table-cell-fix-left-last) {
    box-shadow: inset -8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }

  :deep(.ant-table-cell-fix-right-first) {
    box-shadow: inset 8px 0 8px -6px rgba(0, 0, 0, 0.07);
  }
}

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  row-gap: 6px;
  column-gap: 0;

  > * {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 2px @exe-op-links-line-gap;
    line-height: inherit;
    font-size: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:first-child) {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: @exe-op-links-divider-h;
        margin-left: -0.5px;
        background: @exe-op-links-divider;
        transform: translateY(-50%);
        pointer-events: none;
      }
    }
  }
}

.header-query-icon {
  font-size: 12px;
  color: #8c8c8c;
  cursor: pointer;
}

.header-cell-main {
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
}

.header-cell-main--static {
  padding-right: 0;
}

.header-cell-main--has-filter {
  padding-right: 22px;
}

.header-filter-anchor {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-title-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-title-sort--disabled {
  cursor: default;
}

.header-sort-icon {
  font-size: 11px;
  color: #595959;
  display: inline-flex;
}

.header-sort-icon--muted {
  color: #bfbfbf;
}

.header-filter-pop {
  width: 220px;
}

.header-filter-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
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

/* ---------- 分享知识弹框 ---------- */
.share-knowledge-list {
  max-height: 70vh;
  overflow-y: auto;
  padding: 4px 2px;
}

.share-knowledge-item {
  padding: 4px 0;
}

.share-knowledge-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.share-knowledge-pictures {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.share-knowledge-img {
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  object-fit: contain;
}

.share-knowledge-content {
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.85);
  word-break: break-word;
  white-space: pre-wrap;

  :deep(img) {
    max-width: 100%;
    border-radius: 4px;
  }

  :deep(p) {
    margin: 4px 0;
  }
}

.share-knowledge-empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.share-knowledge-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.assign-category-tree-wrap {
  margin-top: 12px;
  max-height: calc(100vh - 360px);
  overflow-y: auto;
}

.assign-category-empty {
  padding: 24px 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}
</style>
