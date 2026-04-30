<script setup lang="ts">
import { inject, nextTick, reactive, ref, h } from 'vue';
import { computed } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message, Tooltip } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import { AdminApiSystemMenu } from '@/api/tags/管理后台菜单';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import { sortermethod, findNodeByIdFromKey } from '@/utils/tools';
import { ParameterPageRequestDTOModel } from '@/api/models/parameter/ParameterPageRequestDTOModel';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import Tree from '@/components/tree/tree.vue';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import SelectBoomTree from './components/selectBoomTree.vue';
import ParameterAdd from './components/parameter-add.vue';
import ParameterUpdate from './components/parameter-update.vue';
import { useSplitpanesTreeCollapse } from '@/composables/useSplitpanesTreeCollapse';
import { downloadFileFromStream } from '@/utils/file';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { CaretDownOutlined, CaretUpOutlined, FilterOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import TableCellOverflowTooltip from './components/TableCellOverflowTooltip.vue';
import knowledgeConfig from '../components/knowledge-config.vue'
import draggableModal from '@/components/DraggableModal/index.vue'
/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<any>();
const treePage = ref<any>(null);
const showLeft = ref<boolean>(true);
const loadingTree = ref<boolean>(false);
const selectTreeId = ref<string>('');
const treeNodeColmoun = ref<any[]>([]);
const selectBoomTreeRef = ref<any>(null);
const userStore = useUserStore();
const parameterName = ref<string>('');
const parameterNum = ref<string>('');
const selectNodeKeys = ref<string>('');
const currentNode = ref<any>();
/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 删除按钮状态 */
const deleteFlag = computed(() => {
  return selectedRowList.value?.length === 0;
});
/** 列表请求参数 */
const requestParams = reactive(new ParameterPageRequestDTOModel());

const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
const treeParameterParams = reactive(new ParameterPageRequestDTOModel());

/** 列表数据 */
const datasource = ref<Array<ParameterInfoRequestDTOModel>>([]);
const rawTreeData = ref<Array<any>>([]); // 保存完整的原始树数据

treeRequestParams.userid = userStore.getUser.id;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, loadParameterListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

// eslint-disable-next-line jsdoc/check-indentation
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation3-width');
  return Number(width);
});
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
const { resetFields } = useForm(requestParams);
/** 勾选表格数据源  */
const selectedRowList = ref<any>([]);
const selectedRowkeys = ref<any>([]);
/** 表头首列「全选」与行勾选用同一套 key，需与 getParameterRowKey 类型一致 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    /** 与操作列一起：仅锁定首列复选框，数据列横向滚动 */
    fixed: true,
    onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
/** 当前页全选/半选（与 antd 默认全选行为一致，仅作用当前页展示数据） */
const parameterSelectionHeaderChecked = computed(() => {
  const rows = parameterTableDisplayList.value;
  if (!rows.length) return false;
  return rows.every((r: any) => selectedRowkeys.value.includes(r.id));
});
const parameterSelectionHeaderIndeterminate = computed(() => {
  const rows = parameterTableDisplayList.value;
  if (!rows.length) return false;
  const n = rows.filter((r: any) => selectedRowkeys.value.includes(r.id)).length;
  return n > 0 && n < rows.length;
});
function onParameterSelectionHeaderChange(e: any) {
  const checked = Boolean(e?.target?.checked);
  const pageRows = parameterTableDisplayList.value as any[];
  const pageIds = pageRows.map(r => r.id);
  if (checked) {
    const nextKeys = new Set([...selectedRowkeys.value.map((x: any) => x), ...pageIds]);
    selectedRowkeys.value = Array.from(nextKeys);
    const byId = new Map(selectedRowList.value.map((r: any) => [r.id, r]));
    pageRows.forEach(r => byId.set(r.id, r));
    selectedRowList.value = Array.from(byId.values());
  } else {
    const idSet = new Set(pageIds);
    selectedRowkeys.value = selectedRowkeys.value.filter((k: any) => !idSet.has(k));
    selectedRowList.value = selectedRowList.value.filter((r: any) => !idSet.has(r.id));
  }
}
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
const addModel = ref<InstanceType<typeof ParameterInfoRequestDTOModel>>();
const updateModel = ref<InstanceType<typeof ParameterInfoRequestDTOModel>>();
const treeDataTranslate: any = inject('treeDataTranslate');
const columns = ref<TableColumnType<Menus>[]>([
  /** 与前方的勾选列（rowSelection.fixed）共同固定左侧前两列 */
  {
    title: WeiI18n.$t('参数名称'),
    dataIndex: 'parameterName',
    key: 'parameterName',
    align: 'left',
    fixed: 'left',
    resizable: false,
    width: 200,
    ellipsis: true,
  },
  {
    title: WeiI18n.$t('参数代号'),
    dataIndex: 'parameterNum',
    key: 'parameterNum',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 200,
  },
  {
    title: WeiI18n.$t('参数类型'),
    dataIndex: 'parameterTypeName',
    key: 'parameterTypeName',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: WeiI18n.$t('参数单位'),
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 130,
  },
  {
    title: WeiI18n.$t('大小量纲'),
    dataIndex: 'dimenSion',
    key: 'dimenSion',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: WeiI18n.$t('所属分类'),
    dataIndex: 'treeName',
    key: 'treeName',
    align: 'left',
    resizable: true,
    ellipsis: true,
    width: 130,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'createUserName',
    key: 'createUserName',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 120,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    resizable: true,
    ellipsis: true,
    width: 220,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    align: 'left',
    resizable: true,
    width: 130,
  },
  // {
  //   title: WeiI18n.$t('版本'),
  //   dataIndex: 'version',
  //   key: 'version',
  //   align: 'center',
  //   resizable: true,
  //   sorter: (a: any, b: any) => sortermethod(a.version, b.version),
  //   width: 130,
  //   customRender: ({ record }: any) =>
  //     h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
  //       String('V' + (record.version ?? '-') + '.0'),
  //       h(
  //         'a',
  //         {
  //           style: { cursor: 'pointer' },
  //           onClick: (e: Event) => {
  //             e && (e as Event).stopPropagation();
  //             showVersionHistory(record);
  //           },
  //           title: '查看版本历史',
  //         },
  //         h(EpcIcon, {
  //           type: 'icon-banbenlishi',
  //           style: { fontSize: '14px', color: '#1890ff' },
  //         }),
  //       ),
  //     ]),
  // },
  // 新增：分享知识列（点击弹窗显示富文本）
  {
    title: WeiI18n.$t('参数知识'),
    dataIndex: 'knowledge',
    key: 'knowledge_share',
    align: 'center',
    width: 80,
  },
  /** 固定右侧列不建议 resizable（与 exeConfigTab 一致） */
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 200,
    fixed: 'right',
  },
]);

/** 横向滚动宽度：列 width 之和 + 勾选列约宽 + 极小缓冲（与 exeConfigTab 思路一致） */
const SCROLL_X_BUFFER_PX = 2;
/** ant-table rowSelection 预留列宽约值，未计入 columns[].width */
const TABLE_SELECTION_COL_WIDTH_PX = 60;
const parameterTableScrollX = computed(() => {
  const sum = columns.value.reduce((acc, col) => {
    const w = col.width;
    return acc + (typeof w === 'number' ? w : Number(w) || 0);
  }, 0);
  return sum + TABLE_SELECTION_COL_WIDTH_PX + SCROLL_X_BUFFER_PX;
});

/** 表头排序（当前页数据，与 exeConfigTab 一致） */
type ParameterSortOrder = 'ascend' | 'descend' | '';
const sortState = ref<{ key: string; order: ParameterSortOrder }>({ key: '', order: '' });
/** 表头筛选弹层输入草稿（确定后写入查询条件并请求接口） */
const filterValueMap = ref<Record<string, string>>({ parameterName: '', parameterNum: '' });
const filterOpenMap = ref<Record<string, boolean>>({});
/** 首列（勾选列）组合筛选用与 column 筛选同一套草稿字段 */
const SELECTION_FILTER_KEY = '__selection__';

const parameterTableDisplayList = computed(() => {
  let list = [...datasource.value];
  if (!sortState.value.key || !sortState.value.order) return list;
  const key = sortState.value.key;
  const sorted = [...list].sort((a: any, b: any) => sortermethod(a[key], b[key]));
  return sortState.value.order === 'ascend' ? sorted : sorted.reverse();
});

function isParameterTableSelectionColumn(column: any) {
  const c = column?.className;
  if (typeof c === 'string') return c.includes('selection-column');
  if (Array.isArray(c)) return c.some((x: unknown) => String(x).includes('selection-column'));
  return false;
}

function isSortableParameterColumn(column: any) {
  const di = column?.dataIndex;
  if (!di || di === 'operation') return false;
  if (di === 'knowledge') return false;
  return true;
}

function isFilterableParameterColumn(column: any) {
  const di = column?.dataIndex;
  return di === 'parameterName' || di === 'parameterNum';
}

function toggleParameterColumnSort(column: any) {
  if (!isSortableParameterColumn(column)) return;
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

function getParameterSortOrder(key: string): ParameterSortOrder {
  return sortState.value.key === key ? sortState.value.order : '';
}

function setParameterFilterOpen(key: string, open: boolean) {
  filterOpenMap.value = { ...filterOpenMap.value, [key]: open };
}

function handleParameterFilterOpenChange(key: string, open: boolean) {
  if (open) {
    if (key === 'parameterName') {
      filterValueMap.value = { ...filterValueMap.value, parameterName: parameterName.value ?? '' };
    }
  }
  setParameterFilterOpen(key, open);
}

function getParameterFilterOpen(key: string) {
  return Boolean(filterOpenMap.value[key]);
}

function applyParameterColumnFilter(key: string) {
  const v = String(filterValueMap.value[key] ?? '').trim();
  if (key === 'parameterName') parameterName.value = v;
  if (key === 'parameterNum') parameterNum.value = v;
  requestParams.pageNo = 1;
  pagination.current = 1;
  setParameterFilterOpen(key, false);
  void loadParameterListData();
}

function resetParameterColumnFilter(key: string) {
  filterValueMap.value = { ...filterValueMap.value, [key]: '' };
  if (key === 'parameterName') parameterName.value = '';
  if (key === 'parameterNum') parameterNum.value = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  setParameterFilterOpen(key, false);
  void loadParameterListData();
}

function handleSelectionFilterOpenChange(open: boolean) {
  if (open) {
    filterValueMap.value = {
      ...filterValueMap.value,
      parameterName: parameterName.value ?? '',
      parameterNum: parameterNum.value ?? '',
    };
  }
  setParameterFilterOpen(SELECTION_FILTER_KEY, open);
}

function applySelectionColumnFilter() {
  parameterName.value = String(filterValueMap.value.parameterName ?? '').trim();
  parameterNum.value = String(filterValueMap.value.parameterNum ?? '').trim();
  requestParams.pageNo = 1;
  pagination.current = 1;
  setParameterFilterOpen(SELECTION_FILTER_KEY, false);
  void loadParameterListData();
}

function resetSelectionColumnFilter() {
  filterValueMap.value = { ...filterValueMap.value, parameterName: '', parameterNum: '' };
  parameterName.value = '';
  parameterNum.value = '';
  requestParams.pageNo = 1;
  pagination.current = 1;
  setParameterFilterOpen(SELECTION_FILTER_KEY, false);
  void loadParameterListData();
}

/** 默认单元格展示文案（对象列不转字符串，避免 [object Object]） */
function formatParameterCellText(record: Record<string, unknown>, column: { dataIndex?: string | number }) {
  const key = column?.dataIndex;
  if (key === undefined || key === null || key === '') return '';
  const v = (record as Record<string, unknown>)[String(key)];
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return '';
  return String(v);
}

/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    const res = await AdminApiSystemParameter.getParameterTree(treeParameterParams);
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
  // 这里可以根据需要实现添加节点的逻辑
  console.log('getNodeAddData', currentNode.value);
  if (currentNode.value.parentId == 0) {
    message.warning('根节点不能添加子节点,请选择二级节点添加');
    return;
  }
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
      title: WeiI18n.t('类别').value,
      key: 'categoryType',
      value: currentNode.value.categoryType,
      type: 'input',
      hidden: true,
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
  await AdminApiSystemProduct.downTreeKey({ id: selectedKeys.key });
  await getListData('change');
  Selectafterchanges();
}

async function upNode(selectedKeys: any) {
  await AdminApiSystemProduct.upTreeKey({ id: selectedKeys.key });
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
  filterValueMap.value = { ...filterValueMap.value, parameterName: '', parameterNum: '' };
  sortState.value = { key: '', order: '' };
  selectNodeKeys.value = node.key;
  if (node.parentId == 0 || node.parentId == 1) {
    currentNodeLevel.value = 2;
  } else {
    currentNodeLevel.value = 3;
  }
  loadParameterListData();
}

async function loadParameterListData() {
  loading.value = true;
  try {
    const data: any = {};
    data.treeId = selectNodeKeys.value || selectedKeys.value;
    data.parameterName = parameterName.value;
    data.parameterNum = parameterNum.value;
    data.userId = userStore.getUser.id;
    data.pageNo = requestParams.pageNo;
    data.pageSize = requestParams.pageSize;
    const res = await AdminApiSystemParameter.getParameterPageList(data);
    datasource.value = res.data.data.list || [];
    pagination.total = res.data.data.total;
  } finally {
    loading.value = false;
  }
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  if (selectedKeys.parentId == 0 || selectedKeys.parentId == 1) {
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
      title: WeiI18n.t('类别').value,
      key: 'categoryType',
      value: selectedKeys.categoryType,
      type: 'input',
      hidden: true,
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
  if (selectedKeys.parentId == 0 || selectedKeys.parentId == 1) {
    message.warning('此节点不支持删除');
    return;
  }
  const res = await AdminApiSystemProduct.delTreeNode({ id: selectedKeys.key });
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
  data.name = nodeList.categoryName;
  data.parentId = nodeList.pid;
  data.type = nodeList.categoryType;
  const res = await AdminApiSystemProduct.addProductModuleTree(data);
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
  data.type = nodeList.categoryType;
  data.id = nodeList.id;
  const res = await AdminApiSystemProduct.updateCategoryNode(data);
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

/** 允许新增子菜单的菜单类型 */
const ALLOW_CREATE_TYPES: Array<number> = [1, 2];

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

function handleResizeColumn(w: number, col: TableColumnType<Menus>) {
  col.width = w;
}

function getParameterRowKey(record: ParameterInfoRequestDTOModel) {
  return record.id;
}

function getParameterTableRowClassName(_record: ParameterInfoRequestDTOModel, index: number) {
  return index % 2 === 0 ? 'odd' : 'even';
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
    await AdminApiSystemParameter.deleteParameterInfo(infoDel);
  } else {
    let infoDel: any = { checkList: [] };
    infoDel.checkList[0] = { id: data.id };
    infoDel.userid = userStore.getUser.id;
    await AdminApiSystemParameter.deleteParameterInfo(infoDel);
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
    const res = await AdminApiSystemParameter.exportDatatempalteinfo(data);
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
  const res = await AdminApiSystemParameter.downloadExcel({});
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

// 新增：版本历史弹窗状态与数据
const hisModalVisible = ref(false);
const hisLoading = ref(false);
const hisData = ref<any[]>([]);
const hisModalTitle = ref<string>('版本历史');
const currentRecordForHis = ref<any>(null);

/** 展示版本历史弹窗，调用后端接口获取历史数据 */
async function showVersionHistory(record: any) {
  try {
    hisLoading.value = true;
    currentRecordForHis.value = record;
    // 按需把 record 或 record.id 作为入参传给接口（接口说明：入参是当前列的弹窗 数据）
    const params = { ...record }; // 若接口只需 id，可改为 { id: record.id }
    const res = await AdminApiSystemParameter.getHisParameterInfo(params);
    if (res && res.data && res.data.code === '0') {
      hisData.value = res.data.data?.data || [];
      hisModalTitle.value = ` 版本历史`;
      hisModalVisible.value = true;
    } else {
      message.error(WeiI18n.t('获取历史失败').value || '获取历史失败');
    }
  } catch (err) {
    console.error('showVersionHistory error:', err);
    message.error(WeiI18n.t('获取历史失败').value || '获取历史失败');
  } finally {
    hisLoading.value = false;
  }
}

/** 格式化版本历史记录一行显示内容（包含版本号 Vx.0） */
function formatHisLine(item: any) {
  if (!item) return '';
  const ver = item.version != null ? `V${item.version}.0` : '';
  const name = item.parameterName || '';
  const alias = item.propAlias || item.propSymbol || '';
  const user = item.username ? `${item.username}(${item.userid || ''})` : item.userCount || '';
  const time = item.addTime || '';
  const op = item.operation || '';
  return [ver, name, alias, user, time, op].filter(Boolean).join('  ');
}

// 新增：知识配置相关状态
const knowledgeConfigRef = ref(null)
const knowledgeModalVisible = ref(false);
const knowledgeLoading = ref(false);
const knowledgeContent = ref('');
const knowledgeEditorRef = ref<any>(null);
const currentKnowledgeId = ref<number | string>(0);

// 打开知识配置弹窗，带入当前行 id 与 knowledge 字段
async function showKnowledgeModal(record: any) {
  knowledgeConfigRef.value.show(record?.id)
}

// 关闭弹窗
function closeKnowledgeModal() {
  knowledgeModalVisible.value = false;
  knowledgeContent.value = '';
  currentKnowledgeId.value = 0;
}

// 保存知识配置，调用后端接口
async function saveKnowledge() {
  try {
    knowledgeLoading.value = true;
    const content = knowledgeEditorRef.value && knowledgeEditorRef.value.getData ? knowledgeEditorRef.value.getData() : knowledgeContent.value;
    const params: any = {
      id: currentKnowledgeId.value,
      knowledge: content,
      userid: userStore.getUser?.id,
    };
    const res = await AdminApiSystemParameter.saveKnowledgeUpdagte(params);
    // 兼容不同后端 code 返回
    const ok = res && res.data && (res.data.code === '0' || res.data.code === 0 || res.data.code === '200' || res.data.code === 200);
    if (ok) {
      message.success(WeiI18n.t('保存成功').value || '保存成功');
      knowledgeModalVisible.value = false;
      // 刷新列表
      await loadParameterListData();
    } else {
      message.error(res?.data?.msg || WeiI18n.t('保存失败').value || '保存失败');
    }
  } catch (err) {
    console.error('saveKnowledge error:', err);
    message.error(WeiI18n.t('保存失败').value || '保存失败');
  } finally {
    knowledgeLoading.value = false;
  }
}

// 新增：分享知识弹窗状态
const shareModalVisible = ref(false);
const shareModalTitle = ref<string>('');
const shareLoading = ref(false);
const shareList = ref<any[]>([]);

async function showShareModal(record: any) {
  shareModalTitle.value = `${record?.parameterName ?? ''} - 知识分享`;
  shareModalVisible.value = true;
  shareList.value = [];
  try {
    shareLoading.value = true;
    const res = await AdminApiSystemParameter.getParameterActList({ businessId: record?.id, type: '1' });
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
  <div class="drawerContent h-full">
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

      <!-- 右侧内容区域（列表卡片布局与 exeConfigTab 一致） -->
      <Pane class="splitpane-cls parameter-right-pane" :size="rightTreePaneSize">
        <div class="calc-config-pane">
          <a-card class="calc-merged-card">
            <a-form layout="inline" class="form_main calc-toolbar-form" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
              <a-form-item name="parameterName">
                <a-input v-model:value="parameterName" style="width: 220px" allow-clear :placeholder="$t('请输入参数名称')" />
              </a-form-item>
              <a-form-item name="parameterNum">
                <a-input v-model:value="parameterNum" style="width: 220px" allow-clear :placeholder="$t('请输入参数代号')" />
              </a-form-item>
              <a-form-item class="parameter-toolbar-btns">
                <a-button type="primary" @click="loadParameterListData">
                  <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                  {{ $t('查询') }}
                </a-button>
                <a-button v-if="currentNodeLevel != 2" type="primary" @click="handleAddOrUpdate(undefined)">
                  <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
                  {{ $t('添加') }}
                </a-button>
                <!--删除按钮（批量删除需二次确认）-->
                <a-popconfirm
                  v-if="currentNodeLevel != 2"
                  placement="topLeft"
                  :title="`${$t('确定要删除吗')}?`"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop.prevent="handleParameterDelete(undefined)">
                  <a-button type="primary" danger :disabled="deleteFlag">
                    <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
                    {{ $t('删除') }}
                  </a-button>
                </a-popconfirm>
                <!--导入数据按钮-->
                <a-button v-if="currentNodeLevel != 2" type="primary" @click="handleUploadFile()">
                  <EpcIcon type="icon-daoru1" style="font-size: 12px" />
                  {{ $t('导入') }}
                </a-button>
                <!--导出数据按钮-->
                <a-button type="primary" :loading="exportLoading" @click="exportParameData()">
                  <EpcIcon type="icon-daochu" style="font-size: 12px" />
                  {{ $t('导出') }}
                </a-button>
              </a-form-item>
            </a-form>

            <a-table
              class="exe-config-table parameter-table-spaced"
              :scroll="{ x: parameterTableScrollX, y: 'calc(100vh - 300px)' }"
              :row-key="getParameterRowKey"
              :columns="columns"
              :data-source="parameterTableDisplayList"
              :pagination="pagination"
              :row-selection="rowSelection"
              :customRow="customRow"
              bordered
              table-layout="fixed"
              :locale="locale"
              :loading="loading"
              :row-class-name="getParameterTableRowClassName"
              @resize-column="handleResizeColumn">
              <template #headerCell="{ column }">
                <template v-if="isParameterTableSelectionColumn(column)">
                  <div class="header-cell-main header-cell-main--selection header-cell-main--has-filter">
                    <a-checkbox
                      :checked="parameterSelectionHeaderChecked"
                      :indeterminate="parameterSelectionHeaderIndeterminate"
                      @change="onParameterSelectionHeaderChange" />
                    <span class="header-filter-anchor header-filter-anchor--inline">
                      <a-popover
                        trigger="click"
                        placement="bottomRight"
                        :open="getParameterFilterOpen(SELECTION_FILTER_KEY)"
                        @openChange="handleSelectionFilterOpenChange">
                        <template #content>
                          <div class="header-filter-pop header-filter-pop--selection">
                            <a-input v-model:value="filterValueMap.parameterName" :placeholder="$t('请输入参数名称')" allow-clear />
                            <a-input v-model:value="filterValueMap.parameterNum" class="header-filter-pop__second" :placeholder="$t('请输入参数代号')" allow-clear />
                            <div class="header-filter-actions">
                              <a-button type="primary" size="small" @click="applySelectionColumnFilter">
                                <SearchOutlined />
                                {{ $t('确定') }}
                              </a-button>
                              <a-button size="small" @click="resetSelectionColumnFilter">{{ $t('重置') }}</a-button>
                            </div>
                          </div>
                        </template>
                        <FilterOutlined class="header-query-icon" />
                      </a-popover>
                    </span>
                  </div>
                </template>
                <template v-else-if="isSortableParameterColumn(column) || isFilterableParameterColumn(column)">
                  <div class="header-cell-main" :class="{ 'header-cell-main--has-filter': isFilterableParameterColumn(column) }">
                    <span
                      class="header-title-sort"
                      :class="{ 'header-title-sort--disabled': !isSortableParameterColumn(column) }"
                      @click.stop="toggleParameterColumnSort(column)">
                      <span>{{ column.title }}</span>
                      <span v-if="isSortableParameterColumn(column)" class="header-sort-icon">
                        <CaretUpOutlined v-if="getParameterSortOrder(String(column.dataIndex)) === 'ascend'" />
                        <CaretDownOutlined v-else-if="getParameterSortOrder(String(column.dataIndex)) === 'descend'" />
                        <CaretUpOutlined v-else class="header-sort-icon--muted" />
                      </span>
                    </span>
                    <span v-if="isFilterableParameterColumn(column)" class="header-filter-anchor">
                      <a-popover
                        trigger="click"
                        placement="bottomRight"
                        :open="getParameterFilterOpen(String(column.dataIndex))"
                        @openChange="handleParameterFilterOpenChange(String(column.dataIndex), $event)">
                        <template #content>
                          <div class="header-filter-pop">
                            <a-input
                              v-model:value="filterValueMap[String(column.dataIndex)]"
                              :placeholder="`${$t('搜索')} ${column.title}`"
                              allow-clear />
                            <div class="header-filter-actions">
                              <a-button type="primary" size="small" @click="applyParameterColumnFilter(String(column.dataIndex))">
                                <SearchOutlined />
                                {{ $t('确定') }}
                              </a-button>
                              <a-button size="small" @click="resetParameterColumnFilter(String(column.dataIndex))">{{ $t('重置') }}</a-button>
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
              <template #bodyCell="{ column, record, text }">
                <!-- 参数名称：仅溢出时悬停提示 -->
                <template v-if="column.dataIndex === 'parameterName'">
                  <TableCellOverflowTooltip :text="String(record.parameterName ?? '')" />
                </template>

                <!-- 参数知识列：用图标代替，不直接渲染内容 -->
                <template v-else-if="column.dataIndex === 'knowledge'">
                  <span style="display: flex; justify-content: center; align-items: center">
                    <a v-if="record.knowledge" @click.stop.prevent="showShareModal(record)" style="cursor: pointer; color: #1890ff" title="查看知识">
                      <ShareAltOutlined style="font-size: 16px" />
                    </a>
                    <span v-else style="color: #bfbfbf">—</span>
                  </span>
                </template>

                <!-- 版本列：已存在的图标触发历史，版本显示为 V{n}.0 -->
                <template v-else-if="column.dataIndex === 'version'">
                  <span style="display: flex; align-items: center">
                    <span style="margin-right: 6px">{{ record.version != null ? 'V' + record.version + '.0' : 'V1.0' }}</span>
                    <a @click.stop.prevent="showVersionHistory(record)" style="cursor: pointer" title="查看版本历史">
                      <EpcIcon type="icon-banbenlishi" style="font-size: 14px; color: #1890ff" />
                    </a>
                  </span>
                </template>

                <!-- 状态列示例（如有） -->
                <template v-else-if="column.dataIndex === 'status'">
                  <span>
                    <a-tag v-if="record.status === '0'" :class="['exe-status-tag', 'exe-status-tag--off']">{{ $t('未发布') }}</a-tag>
                    <a-tag v-else-if="record.status === '1'" :class="['exe-status-tag', 'exe-status-tag--on']">{{ $t('已发布') }}</a-tag>
                  </span>
                </template>

                <template v-else-if="column.dataIndex === 'remark'">
                  <TableCellOverflowTooltip :text="String(record.remark ?? '')" variant="clamp" />
                </template>

                <!-- 操作列（与 exeConfigTab 链接区一致） -->
                <template v-else-if="column.dataIndex === 'operation'">
                  <div class="calc-operation-links" @click.stop>
                    <a @click.stop.prevent="handleUpdate(record)">{{ $t('编辑') }}</a>
                    <a @click.stop.prevent="showKnowledgeModal(record)">{{ $t('知识配置') }}</a>
                    <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(record)">
                      <a href="#" style="color: #ff4d4f" @click.prevent>{{ $t('删除') }}</a>
                    </a-popconfirm>
                  </div>
                </template>

                <template v-else-if="column.ellipsis">
                  <TableCellOverflowTooltip :text="String(text ?? '')" />
                </template>

                <template v-else>
                  <TableCellOverflowTooltip :text="formatParameterCellText(record, column)" />
                </template>
              </template>
            </a-table>
          </a-card>
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

    <!-- 版本历史弹窗：以 time-line 展示 -->
    <a-modal v-model:visible="hisModalVisible" :title="hisModalTitle" width="640px" :confirm-loading="hisLoading" @cancel="hisModalVisible = false" :footer="null">
      <a-spin :spinning="hisLoading">
        <a-timeline>
          <a-timeline-item v-for="(item, idx) in hisData" :key="idx" :color="idx === 0 ? 'blue' : 'gray'" :dot="null" :timestamp="item.addTime || ''">
            <!-- 按字段渲染：parameterName 加粗，整行不换行，超出用省略 -->
            {{ item.version != null ? 'V' + item.version + '.0' : '-' }}
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 12px">
              <strong style="margin-right: 6px">{{ item.parameterName || '-' }}</strong>
              <span>{{ item.propAlias || item.propSymbol || '' }}</span>
              <span>{{ item.userCount }}</span>
              <span>{{ item.addTime || '' }}</span>
              <span>{{ item.operation || '' }}</span>
            </div>
          </a-timeline-item>
        </a-timeline>
        <div v-if="!hisLoading && (!hisData || hisData.length === 0)" style="text-align: center; padding: 16px 0">暂无历史记录</div>
      </a-spin>
    </a-modal>

    <!-- 知识配置弹窗 -->
   <knowledge-config ref="knowledgeConfigRef" @handleConfirmClose="() => getListData('change')" type="1" />

    <!-- 分享知识弹窗：展示关联知识列表 -->
    <draggable-modal
      v-model:visible="shareModalVisible"
      :title="shareModalTitle"
      width="860px"
      :footer="null"
      centered
      @cancel="closeShareModal">
      <a-spin :spinning="shareLoading">
        <div class="share-knowledge-list min-h-[400px]">
          <template v-if="shareList.length > 0">
            <div v-for="(item, idx) in shareList" :key="idx" class="share-knowledge-item">
              <!-- 元信息标签行 -->
              <div class="share-knowledge-meta">
                <a-tag color="blue">{{ item.file?.title || '知识文档' }}</a-tag>
                <a-tag v-if="item.remark" color="default">{{ item.remark }}</a-tag>
                <a-tag v-if="item.versionNum" color="cyan">V{{ item.versionNum }}</a-tag>
              </div>
              <!-- 图片 -->
              <div v-if="item.file?.picture" class="share-knowledge-pictures">
                <a-image
                  :src="item.file?.picture"
                  :width="400"
                  fit="contain"
                  class="share-knowledge-img" />
              </div>
              <!-- 富文本内容 -->
              <div
                v-if="item.file?.content"
                class="share-knowledge-content"
                v-html="item.file.content" />
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
      :modal-visible="selectTreeVisible"
      :select-tree-data="selectTreeData"
      :select-tree-selected-keys="selectTreeSelectedKeys"
      @confirm-select-tree-node="confirmSelectTreeNode"
      @cancel-select-tree-node="cancelSelectTreeNode"
      @handle-select-tree-node="handleSelectTreeNode" />
    <ParameterAdd ref="addModel" :modal-visible="visible" @refresh-table-data="loadParameterListData" @close="handleCloseAddModal" />
    <ParameterUpdate ref="updateModel" :modal-visible="updateVisible" @refresh-table-data="loadParameterListData" @close="handleCloseUpdateModal" />
    <ImportFile
      :modalVisible="batchflag"
      :fileList="fileList"
      :selectedKeys="selectedKeys"
      @change="filechange"
      @customRequest="customRequest"
      @templateDownload="templateDownload"
      @importSuccessfulFun="importSuccessfulFun"
      @close="batchflag = false" />
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
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}

/* ---------- 以下与 src/views/product/check/sys/components/exeConfigTab.vue 列表区一致 ---------- */
.parameter-right-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
  /* 与左侧树、与视口右缘各留 10px */
  padding: 0 10px;
}

.parameter-toolbar-btns :deep(.ant-form-item-control-input-content) {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.calc-config-pane {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.calc-toolbar-form {
  gap: 4px;
}

/** 查询区与表格同一卡片，去掉中间分割线 */
.calc-merged-card {
  flex: 1;
  min-height: 0;
  border: none;
  box-shadow: none;

  :deep(.ant-card-body) {
    height: 100%;
    padding: 12px 0 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  :deep(.ant-table-wrapper) {
    flex: 1;
    min-height: 0;
  }
  :deep(.ant-spin-nested-loading) {
    height: 100%;
    .ant-spin-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      .ant-table {
        flex: 0.8;
      }
    }
  }

  /** 表格与上方查询表单留出间距（可按视觉再微调数值） */
  :deep(.parameter-table-spaced) {
    margin-top: 16px;
  }

  :deep(.ant-table-thead > tr > th) {
    border-right: 1px solid #e8e8e8;
    text-align: center;
    vertical-align: middle;
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

  /*
   * 固定列分界：用单元格 **inset** 内阴影，阴影完全落在锁定列内，
   * 避免外扩 box-shadow 被滚动区域裁剪成底部一截“断线”。
   */
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

.exe-config-cell-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

@exe-op-links-divider: #e0e0e0;
@exe-op-links-line-gap: 8px;
@exe-op-links-divider-h: 1em;

.calc-operation-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
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

.exe-status-tag {
  margin: 0;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  padding: 0 10px;
  border-style: solid;
  border-width: 1px;
}

.exe-status-tag--on {
  color: #1677ff;
  background: #e6f4ff;
  border-color: #91caff;
}

.exe-status-tag--off {
  color: rgba(0, 0, 0, 0.65);
  background: #fafafa;
  border-color: #d9d9d9;
}

/* 表头：标题+排序+筛选（与 exeConfigTab 一致） */
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

/* 首列：全选 + 筛选，与数据列表头同高、居中对齐 */
.header-cell-main--selection {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding-right: 0;
}

.header-filter-anchor--inline {
  position: static !important;
  transform: none !important;
}

.header-filter-pop--selection {
  width: 260px;
}

.header-filter-pop__second {
  margin-top: 8px;
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
</style>
