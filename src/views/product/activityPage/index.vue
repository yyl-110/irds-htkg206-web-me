<script setup lang="ts">
import { inject, nextTick, reactive, ref, h } from 'vue';
import { computed } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message, Tooltip } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { AdminApiActivityPage } from '@/api/tags/activityPage/活动页面管理';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { ActivityPageRequestDTOModel } from '@/api/models/activityPage/ActivityPageRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Tree from '@/components/tree/tree.vue';
import { useUserStore } from '@/store/modules/user';
import SelectBoomTree from './components/selectBoomTree.vue';
import ActivityAdd from './components/activity-add.vue';
import ActivityUpdate from './components/activity-update.vue';
import ActivityConfigModal from './components/activity-config-modal.vue';
import ActivityPreviewModal from './components/activity-preview-modal.vue';
import ActivityCheckConfigModal from './components/activity-check-config-modal.vue';
import ActivityCheckPreviewModal from './components/activity-check-preview-modal.vue';
import { downloadFileFromStream } from '@/utils/file';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
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
const pageName = ref<string>('');
const selectNodeKeys = ref<string>('');
const currentNode = ref<any>();
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 删除按钮状态 */
const deleteFlag = computed(() => {
  return selectedRowList.value?.length === 0;
});
/** 列表请求参数 */
const requestParams = reactive(new ActivityPageRequestDTOModel());
/** 列表数据 */
const datasource = ref<any>([]);
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, loadParameterListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

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
const addModel = ref<any>();
const updateModel = ref<any>();
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('页面名称'),
    dataIndex: 'pageName',
    key: 'pageName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.pageName, b.pageName),
    width: 180,
  },
  {
    title: WeiI18n.$t('页面模板类型'),
    dataIndex: 'pageType',
    key: 'pageType',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.pageType, b.pageType),
    width: 180,
  },
  {
    title: WeiI18n.$t('所属分类'),
    dataIndex: 'treeName',
    key: 'treeName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.treeName, b.treeName),
    width: 180,
  },
  {
    title: WeiI18n.$t('组名称'),
    dataIndex: 'groupName',
    key: 'groupName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.groupName, b.groupName),
    width: 130,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.remark, b.remark),
    width: 180,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    width: 230,
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 180,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const data: any = {};
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

onMounted(() => {
  getListData();
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
      title: WeiI18n.t('父节点ID').value,
      key: 'pid',
      value: currentNode.value.key,
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
    datasource.value = res.data.data.list || [];
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
  const res = await AdminApiActivityPage.saveActivityTree(data);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  console.log(nodeList);
  const data: any = {};
  data.name = nodeList.categoryName;
  data.parentId = nodeList.pid;
  data.id = nodeList.id;
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
  getListData();
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
    //批量删除
    let infoDel: any = { checkList: [] };
    selectedRowkeys.value.forEach(item => {
      infoDel.checkList.push({ id: item });
    });
    infoDel.userid = userStore.getUser.id;
    await AdminApiActivityPage.deleteActivityInfo(infoDel);
  } else {
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
    ? ['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'TITLE', 'DIVIDER', 'DATA_VIEW', 'CALC_BUTTON']
    : ['INPUT', 'TEXTAREA', 'SELECT', 'AUTO_COMPLETE', 'RADIO', 'DATE', 'TITLE', 'RICH_TEXT', 'DIVIDER', 'DATA_VIEW'];
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
async function showPageConfigModal(record: any) {
  const res = await AdminApiActivityPage.pageConfigList({ activityPageId: record.id });
  const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
  const normalizedRecord = normalizePageConfigResponseToRecord(record, rows);
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

// 新增：分享知识弹窗状态
const shareModalVisible = ref(false);
const shareContent = ref<string>('');
const shareModalTitle = ref<string>('');

function closeShareModal() {
  shareModalVisible.value = false;
  shareContent.value = '';
  shareModalTitle.value = '';
}

/** 左侧分类树折叠：与 splitpanes 左侧 Pane 宽度联动 */
const leftTreeCollapsed = ref(false);
const treePaneSize = ref(20);
const treePaneSizeBeforeCollapse = ref(20);
const leftTreePaneSize = computed(() => (leftTreeCollapsed.value ? 0 : treePaneSize.value));
const rightTreePaneSize = computed(() => (leftTreeCollapsed.value ? 100 : Math.max(0, 100 - treePaneSize.value)));

function onSplitpanesResized(panes: any[]) {
  if (leftTreeCollapsed.value) return;
  const p0 = panes?.[0];
  if (!p0) return;
  const raw = p0.size;
  const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
  if (Number.isFinite(n) && n >= 5) {
    treePaneSize.value = n;
  }
}

function toggleLeftTreePanel() {
  if (!leftTreeCollapsed.value) {
    treePaneSizeBeforeCollapse.value = treePaneSize.value > 0 ? treePaneSize.value : 20;
    leftTreeCollapsed.value = true;
  } else {
    leftTreeCollapsed.value = false;
    treePaneSize.value = treePaneSizeBeforeCollapse.value || 20;
  }
}

/** 按钮叠在 splitpanes 竖向分隔条上：水平对齐分隔线，竖向略低于内置拖动手柄 */
const splitToggleStyle = computed(() => {
  const top = 'calc(50% + 32px)';
  if (leftTreeCollapsed.value) {
    return {
      left: '2px',
      top,
      transform: 'translateY(-50%)',
    };
  }
  return {
    left: `${treePaneSize.value}%`,
    top,
    transform: 'translate(-50%, -50%)',
  };
});
</script>

<template>
  <div class="drawerContent">
    <div class="activity-splitpanes-wrap">
    <!-- 左侧树结构 -->
    <Splitpanes class="default-theme sbom" @resized="onSplitpanesResized">
      <Pane :min-size="leftTreeCollapsed ? 0 : 15" :size="leftTreePaneSize" class="splitpane-cls marginstyle">
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
        <a-card>
          <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
            <a-form-item name="pageName">
              <a-input v-model:value="pageName" style="width: 220px" allow-clear :placeholder="$t('请输入活动名称')" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="loadParameterListData">
                <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                {{ $t('查询') }}
              </a-button>
              <a-button type="primary" @click="handleAddOrUpdate(undefined)" style="margin-left: 15px">
                <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
                {{ $t('添加') }}
              </a-button>
              <!--删除按钮（批量删除需二次确认）-->
              <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(undefined)">
                <a-button type="primary" danger :disabled="deleteFlag" style="margin-left: 15px">
                  <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
                  {{ $t('删除') }}
                </a-button>
              </a-popconfirm>
              <!--导入数据按钮-->
              <a-button type="primary" @click="handleUploadFile()" style="margin-left: 15px">
                <EpcIcon type="icon-daiyanshou1" style="font-size: 12px" />
                {{ $t('另存为') }}
              </a-button>
              <!--导出数据按钮-->
              <a-button type="primary" :loading="exportLoading" @click="exportParameData()" style="margin-left: 15px">
                <EpcIcon type="icon-daochu" style="font-size: 12px" />
                {{ $t('导出') }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card style="margin-top: 10px">
          <!-- 表格 -->
          <a-table
            :scroll="{ x: 1200, y: 500 }"
            :row-key="(record: any) => record.id"
            :columns="columns"
            :data-source="datasource"
            :pagination="pagination"
            :row-selection="rowSelection"
            :customRow="customRow"
            @resizeColumn="handleResizeColumn"
            :locale="locale"
            :loading="loading"
            :sticky="true"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <!-- 操作列：编辑/删除 等，阻止事件冒泡 -->
              <template v-if="column.dataIndex === 'operation'">
                <a @click="handleUpdate(record)">{{ $t('编辑') }}</a>
                <a-divider type="vertical" />
                <a @click="showPageConfigModal(record)">{{ $t('配置') }}</a>
                <a-divider type="vertical" />
                <a @click="priviewPageConfigModal(record)">{{ $t('预览') }}</a>
                <a-divider type="vertical" />
                <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(record)">
                  <a @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
                </a-popconfirm>
              </template>
              <template v-else-if="column.dataIndex === 'pageType'">
                <span v-if="record.pageType === '1'">{{ $t('设计配置页面') }}</span>
                <span v-else-if="record.pageType === '2'">{{ $t('计算集成页面') }}</span>
                <span v-else-if="record.pageType === '3'">{{ $t('自定义页面') }}</span>
              </template>
              <!-- 默认渲染：按列 dataIndex 输出 -->
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </a-table>
        </a-card>
      </Pane>
    </Splitpanes>

    <!-- 叠在分隔条上的折叠/展开（略低于中线拖动手柄，避免抢拖动） -->
    <Tooltip :title="leftTreeCollapsed ? $t('展开分类') : $t('折叠分类')">
      <button
        type="button"
        class="activity-splitpanes-wrap__toggle"
        :style="splitToggleStyle"
        @click="toggleLeftTreePanel"
        @mousedown.stop>
        <LeftOutlined v-if="!leftTreeCollapsed" />
        <RightOutlined v-else />
      </button>
    </Tooltip>
    </div>

    <!-- 分享知识弹窗：展示富文本内容 -->
    <a-modal v-model:visible="shareModalVisible" :title="shareModalTitle" width="800px" @cancel="closeShareModal">
      <div style="min-height: 320px">
        <!-- 富文本直接渲染（后端内容已是 HTML） -->
        <div v-if="shareContent" v-html="shareContent" style="padding: 12px; max-height: 520px; overflow: auto; border-radius: 4px; background: #fff"></div>
        <div v-else style="text-align: center; padding: 40px 0; color: #999">暂无知识内容</div>
      </div>
      <template #footer>
        <a-space style="width: 100%; display: flex; justify-content: flex-end">
          <a-button @click="closeShareModal">关闭</a-button>
        </a-space>
      </template>
    </a-modal>

    <!-- 其他弹窗/组件 -->
    <SelectBoomTree
      ref="selectBoomTreeRef"
      :modal-visible="selectTreeVisible"
      :select-tree-data="selectTreeData"
      :select-tree-selected-keys="selectTreeSelectedKeys"
      @confirm-select-tree-node="confirmSelectTreeNode"
      @cancel-select-tree-node="cancelSelectTreeNode"
      @handle-select-tree-node="handleSelectTreeNode" />
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
      @close="closeActivityConfigModal"
      @save="saveActivityConfig" />
    <ActivityPreviewModal :modal-visible="activityPreviewVisible" :record="currentPreviewRecord" :image-list="previewImageList" @close="closeActivityPreviewModal" />
    <ActivityCheckConfigModal
      :modal-visible="activityCheckConfigVisible"
      :record="currentCheckConfigRecord"
      :save-loading="activityCheckConfigSaving"
      @close="closeActivityCheckConfigModal"
      @save="saveActivityCheckConfig" />
    <ActivityCheckPreviewModal
      :modal-visible="activityCheckPreviewVisible"
      :record="currentCheckPreviewRecord"
      :image-list="previewCheckImageList"
      @close="closeActivityCheckPreviewModal" />
  </div>
</template>

<style lang="less" scoped>
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
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}

.activity-splitpanes-wrap {
  position: relative;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.activity-splitpanes-wrap > :deep(.splitpanes) {
  flex: 1;
  min-height: 0;
}
/* splitpanes default-theme 在中部用 ::before/::after 画两根拖动手柄竖线；去掉后只保留 splitter 本体一条分隔线 */
.activity-splitpanes-wrap :deep(.splitpanes__splitter::before),
.activity-splitpanes-wrap :deep(.splitpanes__splitter::after) {
  display: none !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
.activity-splitpanes-wrap :deep(.splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
.activity-splitpanes-wrap__toggle {
  position: absolute;
  z-index: 6;
  width: 18px;
  height: 26px;
  padding: 0;
  border: 1px solid #e6e7e9;
  border-radius: 3px;
  background: #f5f5f5;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.activity-splitpanes-wrap__toggle:hover {
  color: #1890ff;
  background: #f0f7ff;
  border-color: #91d5ff;
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
