<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Pane, Splitpanes } from 'splitpanes';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { AdminApiMaterial } from '@/api/tags/material/通用物料管理';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import type { MenuResponseDTOModel } from '@/api/models/MenuResponseDTOModel';
import { WeiI18n } from '@/utils/WeiI18n';
import Empty from '@/components/Empty/index.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { sortermethod } from '@/utils/tools';
import Tree from '@/components/tree/tree.vue';
import { ProductTreeInfoRequestDTOModel } from '@/api/models/product/ProductTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { useRender } from '@/components/escape';
import { MaterialPageRequestDTOModel } from '@/api/models/material/MaterialPageRequestDTOModel';
import { MaterialInfoRequestDTOModel } from '@/api/models/material/MaterialInfoRequestDTOModel';
import { openModule, assembleModule } from '@/utils/webSocket';

/** 菜单树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

// 树结构相关属性
const treeData = ref<any[]>([]);
const selectedKeys = ref<string>('');
const expandedKeys = ref<string>('');
const treePage = ref<any>(null);
const loading = ref<boolean>(false);
const loadingTree = ref<boolean>(false);
const showLeft = ref<boolean>(true);
const userStore = useUserStore();
// 搜索数据
const searchData = ref<string>('');
/** 列表请求参数 */
const requestParams = reactive(new MaterialPageRequestDTOModel());
const selectNodeKeys = ref<string>('');
const treeRequestParams = reactive(new ProductTreeInfoRequestDTOModel());
treeRequestParams.userId = userStore.getUser.id;

/** 列表数据 */
const resources = ref<Array<MaterialInfoRequestDTOModel>>([]);

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

const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.$t('序号'),
    dataIndex: 'seq',
    key: 'seq',
    align: 'center',
    resizable: true,
    width: 80,
  },
  {
    title: WeiI18n.$t('物料编码'),
    dataIndex: 'partNumber',
    key: 'partNumber',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.partNumber, b.partNumber),
    width: 200,
  },
  {
    title: WeiI18n.$t('名称'),
    dataIndex: 'partName',
    key: 'partName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.partName, b.partName),
    width: 200,
  },
  {
    title: WeiI18n.$t('型号规格'),
    dataIndex: 'partSize',
    key: 'partSize',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.partSize, b.partSize),
    width: 120,
  },
  {
    title: WeiI18n.$t('近三年重用次数'),
    dataIndex: 'recentQuqntity',
    key: 'recentQuqntity',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.recentQuqntity, b.recentQuqntity),
    width: 150,
  },
  {
    title: WeiI18n.$t('历史重用次数'),
    dataIndex: 'useQuqntity',
    key: 'useQuqntity',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.useQuqntity, b.useQuqntity),
    width: 150,
  },
  {
    title: WeiI18n.$t('状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.status, b.status),
    width: 130,
  },
  {
    title: WeiI18n.$t('上次修改时间'),
    dataIndex: 'addTime',
    key: 'addTime',
    align: 'center',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
    width: 130,
    customRender: ({ text }) => {
      return useRender.renderDateNoTime(text);
    },
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

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData() {
  loadingTree.value = true;
  try {
    // 使用正确的API获取产品树数据
    const res = await AdminApiSystemProduct.getPlatformTreeInfo(new ProductTreeInfoRequestDTOModel());
    if (res.data.code == 0 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData;
      console.log(rawData);
      const treeNodes = convertToTreeNodes(rawData);
      treeData.value = treeNodes;
      // 默认选中第一个节点
      if (treeNodes.length > 0) {
        // 侦听器监听选中节点
        selectedKeys.value = '';
        nextTick(() => {
          selectedKeys.value = treeNodes[0].key;
          expandedKeys.value = treeNodes[0].key;
          selectNode(treeNodes[0]);
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
  return data.map(item => {
    // 判断是否为根节点：使用moduleLevel和nodeRootType字段
    // 根节点通常是moduleLevel为1或nodeRootType为'1'的节点
    const isRootNode = item.moduleLevel === 1 || (item.nodeRootType && item.nodeRootType.toString() === '1');
    // 判断是否有子节点
    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

    // 设置level值：根节点level为1，有子节点的节点level为2，没有子节点的节点level为3
    let level = 3; // 默认level为3（无子节点）
    if (isRootNode) {
      level = 1;
    } else if (hasChildren) {
      level = 2;
    }

    return {
      level: level,
      key: item.id?.toString() || item.tid?.toString() || '',
      partName: item.name || item.title || '',
      // 添加type字段，用于在Tree组件中区分节点类型
      type: 'category', // 对于产品平台管理，所有节点都视为分类节点
      fileId: item.fileId,
      fileUrl: item.fileUrl,
      seq: item.seq,
      text: item.text,
      userId: item.userId,
      nodeRootType: item.nodeRootType,
      nodeRootId: item.nodeRootId,
      moduleLevel: item.moduleLevel,
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
    .map(node => {
      debugger;
      // 检查当前节点是否匹配搜索值
      const isMatch = node.title && node.title.toLowerCase().includes(searchValue.toLowerCase());

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

async function selectNode(selectedKeys2: any) {
  searchData.value = '';
  selectNodeKeys.value = selectedKeys2.key;
  selectedKeys.value = selectedKeys2.key;
  loadParameterListData();
}

/** 重新加载树结构 */
async function reloadTree() {
  // 重新获取树数据
  await getListData();
}

function handleResizeColumn(w, col) {
  col.width = w;
}

async function loadParameterListData() {
  loading.value = true;
  try {
    requestParams.folderId = selectNodeKeys.value || selectedKeys.value;
    requestParams.keywords = searchData.value;
    requestParams.userId = userStore.getUser.id + '';
    const res = await AdminApiMaterial.getDataInfo({
      ...requestParams,
    });
    resources.value = res.data.data || [];
  } finally {
    loading.value = false;
  }
}

async function syncData() {
  loading.value = true;
  try {
    requestParams.folderId = selectedKeys.value;
    const res = await AdminApiMaterial.syncCommonPartFolder({ ...requestParams });
    message.success('同步成功！');
  } finally {
    loading.value = false;
  }
}

async function syncDataInfo() {
  loading.value = true;
  try {
    requestParams.folderId = selectedKeys.value;
    const res = await AdminApiMaterial.syncCommonPartFolderInfo({ ...requestParams });
    message.success('同步成功！');
    loadParameterListData();
  } finally {
    loading.value = false;
  }
}

function openModuleInfoMx(row: any) {
  openModule({}, row.value.partNumber, 'prt', '', '', '');
}
// 装配模型
function assembleModuleInfo(row: any) {
  assembleModule({}, row.value.partNumber, 'prt', '', '', '', '');
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
            :operate-flag="false"
            :tree-data="treeData"
            bomType="unBom"
            :selected-keys="selectedKeys"
            :expanded-keys="expandedKeys"
            @select-node="selectNode"
            @reload-tree="reloadTree"
            @change-select-key="handleChangeSelectKey" />
        </a-spin>
      </Pane>
      <!-- 右侧内容区域 -->
      <Pane class="splitpane-cls">
        <a-card>
          <a-form layout="inline" :label-col="{ style: { width: '100px' } }" :model="requestParams">
            <a-form-item name="name">
              <a-input v-model:value="searchData" style="width: 220px" allow-clear :placeholder="$t('请输入数据搜索')" @change="loadParameterListData" />
            </a-form-item>
            <a-button type="primary" @click="loadParameterListData">
              <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
              {{ $t('查询') }}
            </a-button>
            <a-button type="primary" @click="syncData" style="margin-left: 15px">
              <EpcIcon type="icon-wuliaodan" style="font-size: 12px" />
              {{ $t('同步文件夹') }}
            </a-button>
            <a-button type="primary" @click="syncDataInfo" style="margin-left: 15px">
              <EpcIcon type="icon-tongbu1" style="font-size: 12px" />
              {{ $t('同步数据') }}
            </a-button>
          </a-form>
        </a-card>
        <a-card style="margin-top: 10px">
          <a-table
            :scroll="{ x: 1200, y: 500 }"
            :row-key="(record: any) => record.id"
            :columns="columns"
            :data-source="resources"
            :pagination="false"
            @resizeColumn="handleResizeColumn"
            :loading="loading"
            :locale="locale"
            :sticky="true"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'name'">
                {{ record.name }}
              </template>
              <template v-else-if="column.dataIndex === 'status'">
                <a-tag v-if="record.status === 1" color="green">{{ $t('已发布') }}</a-tag>
                <a-tag v-else>{{ $t('待发布') }}</a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <a @click="openModuleInfoMx(record)">{{ $t('打开模型') }}</a>
                <a-divider type="vertical" />
                <a @click="assembleModuleInfo(record)">{{ $t('装配模型') }}</a>
              </template>
              <!-- <template v-else>
          {{ column.dataIndex }}
        </template> -->
            </template>
          </a-table>
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
  padding: 10px;
}

:deep(.ant-table-column-sorters) {
  justify-content: center;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
