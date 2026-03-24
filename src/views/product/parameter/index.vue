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
import Tree from '@/components/tree/tree.vue';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import SelectBoomTree from './components/selectBoomTree.vue';
import ParameterAdd from './components/parameter-add.vue';
import ParameterUpdate from './components/parameter-update.vue';
import { downloadFileFromStream } from '@/utils/file';
import ImportFile from '@/components/ImportFile/index.vue';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { ShareAltOutlined } from '@ant-design/icons-vue';
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
const addModel = ref<InstanceType<typeof ParameterInfoRequestDTOModel>>();
const updateModel = ref<InstanceType<typeof ParameterInfoRequestDTOModel>>();
const treeDataTranslate: any = inject('treeDataTranslate');
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('参数名称'),
    dataIndex: 'parameterName',
    key: 'parameterName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
    width: 230,
  },
  {
    title: WeiI18n.$t('参数代号'),
    dataIndex: 'parameterNum',
    key: 'parameterNum',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.parameterNum, b.parameterNum),
    width: 260,
  },
  {
    title: WeiI18n.$t('参数类型'),
    dataIndex: 'parameterTypeStr',
    key: 'parameterTypeStr',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.parameterTypeStr, b.parameterTypeStr),
    width: 100,
  },
  {
    title: WeiI18n.$t('参数单位'),
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.unitName, b.unitName),
    width: 130,
  },
  {
    title: WeiI18n.$t('大小量纲'),
    dataIndex: 'dimension',
    key: 'dimension',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.dimension, b.dimension),
    width: 100,
  },
  {
    title: WeiI18n.$t('所属分类'),
    dataIndex: 'categoryName',
    key: 'categoryName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
    width: 150,
  },
  {
    title: WeiI18n.$t('创建人'),
    dataIndex: 'username',
    key: 'username',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.username, b.username),
    width: 150,
  },
  {
    title: WeiI18n.$t('创建时间'),
    dataIndex: 'addTime',
    key: 'addTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
    width: 130,
  },
  {
    title: WeiI18n.$t('备注'),
    dataIndex: 'remarks',
    key: 'remarks',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.remarks, b.remarks),
    width: 180,
    customRender: ({ text }: { text: string }) => {
      const display = text ?? '';
      return h(Tooltip, { title: display, placement: 'topLeft' }, () =>
        h(
          'div',
          {
            style: {
              maxHeight: '48px',
              overflow: 'hidden',
              whiteSpace: 'normal',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
            },
          },
          display,
        ),
      );
    },
  },
  {
    title: WeiI18n.$t('版本'),
    dataIndex: 'version',
    key: 'version',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.version, b.version),
    width: 130,
    customRender: ({ record }: any) =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
        String('V' + (record.version ?? '-') + '.0'),
        h(
          'a',
          {
            style: { cursor: 'pointer' },
            onClick: (e: Event) => {
              e && (e as Event).stopPropagation();
              showVersionHistory(record);
            },
            title: '查看版本历史',
          },
          h(EpcIcon, {
            type: 'icon-banbenlishi',
            style: { fontSize: '14px', color: '#1890ff' },
          }),
        ),
      ]),
  },
  // 新增：分享知识列（点击弹窗显示富文本）
  {
    title: WeiI18n.$t('参数知识'),
    dataIndex: 'knowledge',
    key: 'knowledge_share',
    align: 'center',
    width: 80,
    customRender: ({ record }: any) =>
      h(
        'a',
        {
          style: {
            cursor: record?.knowledge ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          onClick: (e: Event) => {
            e && (e as Event).stopPropagation();
            if (record?.knowledge) showShareModal(record);
          },
          title: record?.knowledge ? '查看知识' : '暂无知识',
        },
        // 使用已有图标组件，若图标名不同可替换为其他 icon 类型或文案
        h(EpcIcon, {
          type: 'icon-fenxiang',
          style: {
            fontSize: '16px',
            color: record?.knowledge ? '#1890ff' : '#bfbfbf',
          },
        }),
      ),
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: 200,
    fixed: 'right',
  },
  { fixed: 'right', width: 1 },
]);

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    treeParameterParams.categoryid = '147';
    const res = await AdminApiSystemParameter.getParameterTree(treeParameterParams);
    loadingTree.value = false;
    // 处理返回的数据格式
    if ((res.data.code == 0 || res.data.code == 200) && res.data.data) {
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      // 保存原始数据
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
    alert(hasChildren);
    // 设置level值：根节点level为1，有子节点的节点level为2，没有子节点的节点level为3
    let level = 3; // 默认level为3（无子节点）
    if (hasChildren) {
      level = 2;
    }

    return {
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || item.title || '',
      // 添加type字段，用于在Tree组件中区分节点类型
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      nodeRootType: item.nodeRootType,
      nodeType: item.nodeType,
      nodeRootId: item.nodeRootId,
      moduleLevel: item.moduleLevel,
      expand: item.expand,
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
    message.info('未找到匹配的节点');
  }
}

/** 递归过滤树节点 */
function filterTreeNodes(nodes: any[], searchValue: string): any[] {
  if (!nodes || !Array.isArray(nodes)) return [];

  return nodes
    .map(node => {
      // 检查当前节点是否匹配搜索值
      const isMatch = (node.name && node.name.toLowerCase().includes(searchValue.toLowerCase())) || (node.title && node.title.toLowerCase().includes(searchValue.toLowerCase()));

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
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: selectedKeys.partName,
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
      key: 'nodeType',
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
        { label: '数据节点', value: '2' },
        { label: '分类节点', value: '1' },
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
      value: selectedKeys.key,
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
  treeRequestParams.type = 1;
  await AdminApiSystemProduct.updTreeKey(treeRequestParams);
  await getListData('change');
  Selectafterchanges();
}

async function upNode(selectedKeys: any) {
  treeRequestParams.id = selectedKeys.key;
  treeRequestParams.type = 0;
  await AdminApiSystemProduct.updTreeKey(treeRequestParams);
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
  selectNodeKeys.value = node.key;
  currentNodeLevel.value = node.level;
  loadParameterListData();
}

async function loadParameterListData() {
  loading.value = true;
  try {
    requestParams.categoryid = selectNodeKeys.value || selectedKeys.value;
    requestParams.parameterName = parameterName.value;
    requestParams.parameterNum = parameterNum.value;
    requestParams.userId = userStore.getUser.id;
    requestParams.currentPage = requestParams.pageNo;
    requestParams.numberPage = requestParams.pageSize;

    const res = await AdminApiSystemParameter.getParameterPageList({
      ...requestParams,
    });
    datasource.value = res.data.data.data || [];
    pagination.total = res.data.data.pageCount;
  } finally {
    loading.value = false;
  }
}

/** 获取节点编辑数据 */
async function getNodeUpdateData(selectedKeys: any) {
  treeRequestParams.categoryid = selectedKeys.key;
  const res = await AdminApiSystemProduct.getCategpryInfoById(treeRequestParams);
  const categoryStrs = res.data.data.result[0];
  // 这里可以根据需要实现添加节点的逻辑
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
      key: 'nodeType',
      value: categoryStrs.nodeType,
      type: 'select',
      hidden: false,
      rules: [
        {
          required: true,
          message: WeiI18n.t('节点类别不能为空').value,
        },
      ],
      selectStr: [
        { label: '数据节点', value: '2' },
        { label: '分类节点', value: '1' },
      ],
    },

    {
      title: WeiI18n.t('示意图').value,
      key: 'uploadFile',
      value: selectedKeys.uploadFile,
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
  ];
  treePage.value?.reloadTableStyle(treeNodeColmoun.value, categoryStrs.oldFileName);
}

/** 删除树节点 */
async function deleteTreeNode(selectedKeys: any) {
  treeRequestParams.categoryid = treeRequestParams.rootNodeid;
  treeRequestParams.id = selectedKeys.key;
  const res = await AdminApiSystemProduct.delTreeNode(treeRequestParams);
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
/** 提交树节点数据 */
async function submitTreeData(nodeList: any, selectedKeys: any) {
  console.log(nodeList);
  treeRequestParams.categoryName = nodeList.categoryName;
  treeRequestParams.nodeType = nodeList.nodeType;
  treeRequestParams.parentid = nodeList.pid;
  treeRequestParams.sketchMapId = nodeList.fileId;
  console.log(treeRequestParams);
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.addProductModuleTree(treeRequestParams);
  await getListData();
  message.success(WeiI18n.t('保存成功').value);
}

/** 编辑树节点数据 */
async function editTreeData(nodeList: any, selectedKeys: any) {
  console.log(treeRequestParams);
  console.log(nodeList);
  treeRequestParams.categoryName = nodeList.categoryName;
  treeRequestParams.id = nodeList.id;
  treeRequestParams.nodeType = nodeList.nodeType;
  treeRequestParams.parentid = nodeList.pid;
  treeRequestParams.sketchMapId = nodeList.fileId;
  // 这里可以根据需要实现提交树节点数据的逻辑
  const res = await AdminApiSystemProduct.updateCategoryNode(treeRequestParams);
  await getListData('change');
  message.success(WeiI18n.t('修改成功').value);
  Selectafterchanges();
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
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
/**
 * 删除
 * @param id id
 */
function handleDelete(id: Menus['id']) {
  AdminApiSystemMenu.deleteMenu({ id }).then(() => {
    message.success('删除成功!');
    getListData();
  });
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
  message.success(WeiI18n.t('导入成功').value);
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
const knowledgeModalVisible = ref(false);
const knowledgeLoading = ref(false);
const knowledgeContent = ref('');
const knowledgeEditorRef = ref<any>(null);
const currentKnowledgeId = ref<number | string>(0);

// 打开知识配置弹窗，带入当前行 id 与 knowledge 字段
async function showKnowledgeModal(record: any) {
  currentKnowledgeId.value = record?.id;
  knowledgeContent.value = record?.knowledge ?? '';
  knowledgeModalVisible.value = true;
  await nextTick();
  if (knowledgeEditorRef.value && knowledgeEditorRef.value.setData) {
    knowledgeEditorRef.value.setData(knowledgeContent.value);
  }
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
const shareContent = ref<string>('');
const shareModalTitle = ref<string>('');

function showShareModal(record: any) {
  shareContent.value = record?.knowledge ?? '';
  shareModalTitle.value = `${record?.parameterName ?? ''} - 知识分享`;
  shareModalVisible.value = true;
}

function closeShareModal() {
  shareModalVisible.value = false;
  shareContent.value = '';
  shareModalTitle.value = '';
}
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
      <Pane class="splitpane-cls">
        <a-card>
          <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams" @finish="handleFinish">
            <a-form-item name="parameterName">
              <a-input v-model:value="parameterName" style="width: 220px" allow-clear :placeholder="$t('请输入参数名称')" />
            </a-form-item>
            <a-form-item name="parameterNum">
              <a-input v-model:value="parameterNum" style="width: 220px" allow-clear :placeholder="$t('请输入参数代号')" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="loadParameterListData">
                <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
                {{ $t('查询') }}
              </a-button>
              <a-button v-if="currentNodeLevel != 2" type="primary" @click="handleAddOrUpdate(undefined)" style="margin-left: 15px">
                <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
                {{ $t('添加') }}
              </a-button>
              <!--删除按钮-->
              <a-button v-if="currentNodeLevel != 2" type="primary" danger :disabled="deleteFlag" @click="handleParameterDelete(undefined)" style="margin-left: 15px">
                <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
                {{ $t('删除') }}
              </a-button>
              <!--导入数据按钮-->
              <a-button v-if="currentNodeLevel != 2" type="primary" @click="handleUploadFile()" style="margin-left: 15px">
                <EpcIcon type="icon-daoru1" style="font-size: 12px" />
                {{ $t('导入') }}
              </a-button>
              <!--导出数据按钮-->
              <a-button v-if="currentNodeLevel != 2" type="primary" :loading="exportLoading" @click="exportParameData()" style="margin-left: 15px">
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
              <!-- 参数名称 -->
              <template v-if="column.dataIndex === 'parameterName'">
                <sapn>{{ record.parameterName }}</sapn>
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
                  <a-tag v-if="record.status === '0'">{{ $t('未发布') }}</a-tag>
                  <a-tag v-else-if="record.status === '1'" color="blue">{{ $t('已发布') }}</a-tag>
                </span>
              </template>

              <!-- 操作列：编辑/删除 等，阻止事件冒泡 -->
              <template v-else-if="column.dataIndex === 'operation'">
                <div style="display: flex; justify-content: space-around; align-items: center">
                  <a @click.stop.prevent="handleUpdate(record)">{{ $t('编辑') }}</a>
                  <a @click.stop.prevent="showKnowledgeModal(record)">{{ $t('知识配置') }}</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a-popconfirm placement="topLeft" :title="`${$t('确定要删除吗')}?`" ok-text="确定" cancel-text="取消" @confirm.stop.prevent="handleParameterDelete(record)">
                    <a @click.stop style="color: #ff4d4f; cursor: pointer">{{ $t('删除') }}</a>
                  </a-popconfirm>
                </div>
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
    <a-modal v-model:visible="knowledgeModalVisible" :title="$t('知识配置')" width="800px" :confirm-loading="knowledgeLoading" @cancel="closeKnowledgeModal">
      <div style="min-height: 360px">
        <CkeditorPlugin ref="knowledgeEditorRef" height="320" />
      </div>
      <template #footer>
        <a-space>
          <a-button type="primary" :loading="knowledgeLoading" @click="saveKnowledge">{{ $t('确定') }}</a-button>
          <a-button @click="closeKnowledgeModal">{{ $t('取消') }}</a-button>
        </a-space>
      </template>
    </a-modal>

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
