<template>
  <div class="params-toolbar">
    <a-input
      v-model:value="keywords"
      placeholder="请输入参数名称"
      style="width: 200px"
    />
    <a-button type="primary" class="ml-2" @click="queryParameterInfoS">
      <EpcIcon type="icon-fangdajing" style="font-size: 12px" />
      {{ $t("查询") }}
    </a-button>
    <a-button type="primary" class="ml-2" @click="addParameterInfoS">
      <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
      {{ $t("添加") }}
    </a-button>
    <!-- 添加导入按钮 -->
    <a-button
      type="primary"
      @click="handleUploadFile()"
      style="margin-left: 12px"
    >
      <EpcIcon type="icon-daoru1" style="font-size: 12px" />
      {{ $t("导入") }}
    </a-button>
    <a-button
      type="primary"
      @click="exportParameterInfo()"
      style="margin-left: 12px"
    >
      <EpcIcon type="icon-daochu" style="font-size: 12px" />
      {{ $t("Excel导出") }}
    </a-button>
    <a-button
      type="danger"
      @click="batchDelete"
      :disabled="selectedRowKeys.length === 0"
      style="margin-left: 12px"
    >
      <EpcIcon type="icon-shanchu1" style="font-size: 12px" />
      {{ $t("批量删除") }}
    </a-button>
  </div>
  <div style="margin-top: 20px">
    <a-table
      :row-selection="rowSelection"
      :scroll="{ x: 1200, y: tableHXH }"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :locale="locale"
      @resizeColumn="handleResizeColumn"
      :data-source="resources"
      :pagination="pagination"
      @change="handleTableChange"
      :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.dataIndex === 'parameterType'">
          <span>
            <span v-if="record.parameterType === '0'"> {{ $t("实数") }}</span>
            <span v-else-if="record.parameterType === '1'">
              {{ $t("字符串") }}</span
            >
            <span v-else-if="record.parameterType === '2'">
              {{ $t("布尔型") }}</span
            >
            <span v-else-if="record.parameterType === '9'">
              {{ $t("整数") }}</span
            >
            <span v-else>{{ $t("未知") }}</span>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'status'">
          <span>
            <a-tag v-if="record.status === '0'">{{ $t("未发布") }}</a-tag>
            <a-tag v-else-if="record.status === '1'" color="blue">{{
              $t("已发布")
            }}</a-tag>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a @click="parameterEdig(record)">{{ $t("编辑") }}</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="`${$t('确定要删除吗')}?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" danger class="p-0">
              {{ $t("删除") }}
            </a-button>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="moveUp(record)">{{ $t("上移") }}</a>
          <a-divider type="vertical" />
          <a @click="moveDown(record)">{{ $t("下移") }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'keyIndicators'">
          <a-switch
            :checked="
              record.keyIndicators === '1' || record.keyIndicators === 1
            "
            @change="handleKeyIndicatorChange(record, $event)"
            style="margin-left: 10px"
          />
        </template>
      </template>
    </a-table>
  </div>

  <saveParameterInfoModule
    ref="selectBoomTreeRef"
    :modal-visible="selectTreeVisible"
    :select-tree-data="selectTreeData"
    :parameter-info-data="parameterInfoData"
    :select-tree-selected-keys="selectTreeSelectedKeys"
    :existing-resources="resources"
    @confirm-select-tree-node="confirmSelectTreeNode"
    @cancelSelectTreeNode="cancelSelectTreeNode"
    @handle-select-tree-node="handleSelectTreeNode"
  />

  <saveParameterChirdrenInfoModule
    ref="selectBoomTreeRefB"
    :modal-visible="selectparameterChirdren"
    :parameter-info-data="parameterChirdrenData"
    :existing-resources="resources"
    @cancelSelectTreeNode_B="cancelSelectTreeNode_B"
    @confirm-select-tree-node="confirmSelectTreeNode_B"
  />

  <updateParameterInfoModule
    ref="updateParameterInfoModuleRef"
    :modal-visible="updateParameterVisible"
    :select-tree-data="selectTreeData"
    @close="updateParameterVisibleCanel"
    @updateParaneterInfo="updateParaneterInfo"
  />

  <!-- 添加 ImportFile 组件 -->
  <ImportFile
    :modalVisible="batchflag"
    :fileList="fileList"
    :selectedKeys="categoryInfo"
    @change="filechange"
    @customRequest="customRequest"
    @templateDownload="templateDownload"
    @importSuccessfulFun="importSuccessfulFun"
    @close="batchflag = false"
  />
</template>

<script lang="ts" setup>
import { ref, computed, reactive, h } from "vue";
import { downloadFileFromStream } from "@/utils/file.ts";
import { message, Modal } from "ant-design-vue";
import type { TableColumnType } from "ant-design-vue";
import Empty from "@/components/Empty/index.vue";
import { EpcIcon } from "@/components/icon/EpcIcon";
import { ProductPlatformParameterInfoRequestDTOModel } from "@/api/models/product/ProductPlatformParameterInfoRequestDTOModel";
import { ProductPlatformParameterInfoUpdateDTOModel } from "@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel";
import { ProductSeriesParameterInfoRequestDTOModel } from "@/api/models/product/ProductSeriesParameterInfoRequestDTOModel";
import { ProductModuleTreeInfoRequestDTOModel } from "@/api/models/product/ProductModuleTreeInfoRequestDTOModel";
import { AdminApiSystemProduct } from "@/api/tags/product/产品平台后台";
import { AdminApiSystemParameter } from "@/api/tags/parameter/系统参数管理";
import { AdminApiSystemUploadFile } from "@/api/tags/文件上传";
import saveParameterInfoModule from "./modalComponent/saveParameterInfoModule.vue";
import saveParameterChirdrenInfoModule from "./modalComponent/saveParameterChirdrenInfoModule.vue";
import updateParameterInfoModule from "./modalComponent/updateParameterInfoModule.vue";
import ImportFile from "@/components/ImportFile/index.vue";
import { useUserStore } from "@/store/modules/user";
import { sortermethod } from "@/utils/tools";
import { WeiI18n } from "@/utils/WeiI18n";

// 组件接收的属性
interface Props {
  currentNodeData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  currentNodeData: () => null,
});

function handleResizeColumn(w, col) {
  col.width = w;
}
const tableHXH = ref(document.body.clientHeight - 420);
const updateParameterInfoModuleRef = ref<any>(null);
const selectTreeSelectedKeys = ref<string>("");
const selectTreeData = ref<any[]>([]);
const parameterInfoData = ref<any[]>([]);
const parameterChirdrenData = ref<any[]>([]);
const selectTreeVisible = ref<boolean>(false);
const selectparameterChirdren = ref<boolean>(false);
const updateParameterVisible = ref<boolean>(false);
const userStore = useUserStore();
const keywords = ref("");
const dataSource = ref<any[]>([]);
const platformParameter = reactive(
  new ProductPlatformParameterInfoRequestDTOModel()
);
const updatePlatformParameter = reactive(
  new ProductPlatformParameterInfoUpdateDTOModel()
);
const seriesParameter = reactive(
  new ProductSeriesParameterInfoRequestDTOModel()
);
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
treeRequestParams.userid = userStore.getUser.id;
platformParameter.userid = userStore.getUser.id;
seriesParameter.userid = userStore.getUser.id;
const resources = ref<Array<ProductPlatformParameterInfoRequestDTOModel>>([]);
const selectedRowKeys = ref<any[]>([]);
const selectedRows = ref<any[]>([]);

// ---------------------------导入/导出------------------------------------
const batchflag = ref<boolean>(false);
const fileList = ref<any>([]);

async function handleUploadFile() {
  fileList.value = [];
  batchflag.value = true;
}

// 下载模板
async function templateDownload() {
  try {
    let data: any = {};
    const res = await AdminApiSystemProduct.downloadParamTemplate(data);
    const fileName = "参数导入模板.xlsx";
    downloadFileFromStream(res, fileName);
  } catch (error) {
    message.error(WeiI18n.t("下载模板失败").value);
  }
}

// 自定义上传请求
async function customRequest(options: any) {
  fileList.value[0] = options.file;
}

// 文件变化处理
function filechange(file: any) {
  fileList.value[0] = file;
}

// 导入成功处理
async function importSuccessfulFun() {
  try {
    const res = await AdminApiSystemUploadFile.paramImportData({
      file: fileList.value[0] as File,
      userId: userStore.getUser.id,
      seriesId: categoryInfo.value?.key || "",
      proId: categoryInfo.value.pid,
    });
    batchflag.value = false;
    message.success(WeiI18n.t("导入成功").value);
    queryParameterInfoS(); // 刷新列表
  } catch (error) {
    message.error(WeiI18n.t("导入失败").value);
  }
}
// ---------------------------导入/导出-----end-------------------------------

function onSelectChange(keys: any[], rows: any[]) {
  selectedRowKeys.value = keys;
  selectedRows.value = rows;
}

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
}));

async function batchDelete() {
  if (!selectedRows.value || selectedRows.value.length === 0) {
    message.warning(WeiI18n.t("请先选择要删除的项").value);
    return;
  }

  Modal.confirm({
    title: WeiI18n.t("确认删除").value,
    content: `确定要删除已选 ${selectedRows.value.length} 条记录？此操作不可恢复。`,
    okText: WeiI18n.t("确定").value,
    cancelText: WeiI18n.t("取消").value,
    async onOk() {
      try {
        const ids = selectedRows.value.map((r: any) => r.id);
        if (categoryInfo.value && categoryInfo.value.level == 2) {
          updatePlatformParameter.ids = ids;
          await AdminApiSystemProduct.delParameterInfo(updatePlatformParameter);
        } else {
          seriesParameter.ids = ids;
          await AdminApiSystemProduct.delSeriesParameter(seriesParameter);
        }
        message.success(WeiI18n.t("删除成功").value);
        // 清空选中并刷新列表
        selectedRowKeys.value = [];
        selectedRows.value = [];
        queryParameterInfoS();
      } catch (err) {
        message.error(WeiI18n.t("删除失败").value);
      }
    },
  });
}
// 分页相关变量
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: false, // 去掉Go to功能
  pageSizeOptions: ["10", "20", "50", "100"],
  // 显示总条数信息
  showTotal: (total: number) => `共${total}条`,
  // 处理页码变化
  onChange: (current) => {
    pagination.value.current = current;
    queryParameterInfoS();
  },
  // 处理每页显示条数变化
  onShowSizeChange: (current, pageSize) => {
    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    queryParameterInfoS();
  },
  // 自定义每页显示条数的选项文本
  buildOptionText: (pageSizeOptions) => {
    // pageSizeOptions是一个对象，包含value属性
    return `${pageSizeOptions.value}条/页`;
  },
});
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
const columns = ref<
  TableColumnType<ProductPlatformParameterInfoRequestDTOModel>[]
>([
  {
    title: WeiI18n.$t("序号"),
    dataIndex: "index",
    key: "index",
    align: "center",
    resizable: true,
    width: 90,
  },
  {
    title: WeiI18n.$t("参数名称"),
    dataIndex: "parameterName",
    key: "parameterName",
    align: "left",
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.parameterName, b.parameterName),
  },
  {
    title: WeiI18n.$t("参数代号"),
    dataIndex: "parameterNum",
    key: "parameterNum",
    align: "left",
    resizable: true,
    width: 200,
    sorter: (a: any, b: any) => sortermethod(a.parameterNum, b.parameterNum),
  },
  {
    title: WeiI18n.$t("参数类型"),
    dataIndex: "parameterType",
    key: "parameterType",
    align: "center",
    resizable: true,
    width: 130,
    sorter: (a: any, b: any) => sortermethod(a.parameterType, b.parameterType),
  },
  {
    title: WeiI18n.$t("参数单位"),
    dataIndex: "unitName",
    key: "unitName",
    align: "center",
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.unitName, b.unitName),
  },
  {
    title: WeiI18n.$t("大小量纲"),
    dataIndex: "dimension",
    key: "dimension",
    align: "center",
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.dimension, b.dimension),
  },
  {
    title: WeiI18n.$t("默认值"),
    dataIndex: "VALUE",
    key: "value",
    align: "left",
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.value, b.value),
  },
  {
    title: WeiI18n.$t("参数属性"),
    dataIndex: "rangeValue",
    key: "rangeValue",
    align: "left",
    resizable: true,
    width: 130,
    sorter: (a: any, b: any) => sortermethod(a.rangeValue, b.rangeValue),
  },
  {
    title: WeiI18n.$t("备注"),
    dataIndex: "note",
    key: "note",
    align: "left",
    resizable: true,
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.note, b.note),
  },
  {
    title: WeiI18n.$t("操作"),
    dataIndex: "operation",
    align: "left",
    width: 200,
    fixed: "right",
  },
  { fixed: "right", width: 1 },
]);
const categoryInfo = ref<any>(null);
async function reloadTableParameter(selectedKeys: any) {
  categoryInfo.value = selectedKeys;
  queryParameterInfoS();
}
// 保存原始columns配置，用于在不同level之间切换时恢复
const originalColumns = [...columns.value];

async function queryParameterInfoS() {
  if (categoryInfo.value.level == 2) {
    // 恢复原始columns配置
    columns.value = [...originalColumns];
    platformParameter.proId = categoryInfo.value.key;
    platformParameter.keywords = keywords.value;
    platformParameter.pageNum = pagination.value.current;
    platformParameter.pageSize = pagination.value.pageSize;
    const res =
      await AdminApiSystemProduct.getPlatformParameterList(platformParameter);
    resources.value = res.data.data.data || [];
    // 更新分页信息
    pagination.value.total = res.data.data.total || 0;
  } else if (categoryInfo.value.level == 3) {
    // 恢复原始columns配置，然后添加关键指标和所属专业列
    columns.value = [...originalColumns];
    // 找到备注列的索引位置，在其后面添加新列
    const noteColumnIndex = columns.value.findIndex(
      (col) => col.dataIndex === "note"
    );
    if (noteColumnIndex !== -1) {
      // 在备注列后面添加关键指标列
      columns.value.splice(noteColumnIndex + 1, 0, {
        title: WeiI18n.$t("关键指标"),
        dataIndex: "keyIndicators",
        key: "keyIndicators",
        align: "left",
        resizable: true,
        width: 130,
      });
      // 添加所属专业列
      columns.value.splice(noteColumnIndex + 2, 0, {
        title: WeiI18n.$t("所属专业"),
        dataIndex: "major",
        key: "major",
        align: "left",
        resizable: true,
        width: 130,
      });
    }
    seriesParameter.seriesId = categoryInfo.value.key;
    seriesParameter.keywords = keywords.value;
    seriesParameter.pageNum = pagination.value.current;
    seriesParameter.pageSize = pagination.value.pageSize;
    const res =
      await AdminApiSystemProduct.getSeriesParameterList(seriesParameter);
    resources.value = res.data.data.data || [];
    // 更新分页信息
    pagination.value.total = res.data.data.total || 0;
  }
}

// 处理表格分页变化
function handleTableChange(paginationInfo: any) {
  pagination.value = { ...pagination.value, ...paginationInfo };
  queryParameterInfoS();
}

async function handleDelete(record: any) {
  const ids = [];
  ids.push(record.id);
  if (categoryInfo.value.level == 2) {
    updatePlatformParameter.ids = ids;
    await AdminApiSystemProduct.delParameterInfo(updatePlatformParameter);
    queryParameterInfoS();
  } else {
    seriesParameter.ids = ids;
    await AdminApiSystemProduct.delSeriesParameter(seriesParameter);
    queryParameterInfoS();
  }
}

async function parameterEdig(record: any) {
  if (categoryInfo.value.level == 2) {
    updateParameterVisible.value = true;
    updateParameterInfoModuleRef.value?.editParameterInfoData(record);
  } else {
    updateParameterVisible.value = true;
    updateParameterInfoModuleRef.value?.editParameterInfoData(
      record,
      categoryInfo.value.level
    );
  }
}

async function moveUp(record: any) {
  if (categoryInfo.value.level == 2) {
    updatePlatformParameter.id = record.id;
    updatePlatformParameter.move = true;
    await AdminApiSystemProduct.moveParameterInfo(updatePlatformParameter);
  } else {
    seriesParameter.id = record.id;
    updatePlatformParameter.move = true;
    await AdminApiSystemProduct.movePamareterChirdrenUp(seriesParameter);
  }
  queryParameterInfoS();
}

async function moveDown(record: any) {
  if (categoryInfo.value.level == 2) {
    updatePlatformParameter.id = record.id;
    updatePlatformParameter.move = false;
    await AdminApiSystemProduct.moveParameterInfo(updatePlatformParameter);
  } else {
    seriesParameter.id = record.id;
    seriesParameter.move = false;
    await AdminApiSystemProduct.movePamareterChirdrenDown(seriesParameter);
  }
  queryParameterInfoS();
}

function updateParameterVisibleCanel(record: any) {
  updateParameterVisible.value = false;
}

async function updateParaneterInfo(updatePlatformParameter: any) {
  if (categoryInfo.value.level == 2) {
    const res = await AdminApiSystemProduct.updateParameterInfo(
      updatePlatformParameter
    );
    console.log(res);
    if (res.status == 200) {
      message.success(WeiI18n.t("修改成功").value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t("修改失败").value);
    }
  } else {
    const res = await AdminApiSystemProduct.updateSeriesParameter(
      updatePlatformParameter
    );
    console.log(res);
    if (res.status == 200) {
      message.success(WeiI18n.t("修改成功").value);
      updateParameterVisible.value = false;
      queryParameterInfoS();
    } else {
      message.error(WeiI18n.t("修改失败").value);
    }
  }
}

async function exportParameterInfo() {
  console.log(categoryInfo.value);
  if (categoryInfo.value.level == 2) {
    platformParameter.proId = categoryInfo.value.key;
    const res =
      await AdminApiSystemProduct.exportDataPlatParameterList(
        platformParameter
      );
    const fileName = categoryInfo.value.partName + "-参数.xlsx";
    downloadFileFromStream(res, fileName);
  } else {
    seriesParameter.seriesId = categoryInfo.value.key;
    const res =
      await AdminApiSystemProduct.exportSeriesParameterList(seriesParameter);
    const fileName = categoryInfo.value.partName + "-参数.xlsx";
    downloadFileFromStream(res, fileName);
  }
}

async function addParameterInfoS() {
  if (categoryInfo.value.level == 2) {
    console.log(resources);
    treeRequestParams.categoryid = 147;
    selectTreeSelectedKeys.value = "147";
    treeRequestParams.titleid = "2";
    const res =
      await AdminApiSystemProduct.getProductModuleTree(treeRequestParams);
    seriesParameter.pageSize = "10000";
    const templateRes =
      await AdminApiSystemProduct.getTempalteParaInfoList(seriesParameter);
    if (res.data.code == "0" && res.data.data) {
      const rawData = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];
      const treeNodes = convertToTreeNodes(rawData[0].result[0]);
      selectTreeData.value = JSON.parse(JSON.stringify(treeNodes));
      parameterInfoData.value = templateRes.data.data.data;
      selectTreeVisible.value = true;
    }
  } else {
    platformParameter.proId = categoryInfo.value.pid;
    const res = await AdminApiSystemProduct.getParameterData(platformParameter);
    parameterChirdrenData.value = res.data.data;
    selectparameterChirdren.value = true;
  }
}

function cancelSelectTreeNode() {
  selectTreeVisible.value = false;
}
function cancelSelectTreeNode_B() {
  selectparameterChirdren.value = false;
}

async function confirmSelectTreeNode_B(selectedRows: any) {
  const ids = [];
  selectedRows.forEach((obj) => {
    ids.push(obj.id);
  });
  seriesParameter.ids = ids;
  seriesParameter.seriesId = categoryInfo.value.key;
  await AdminApiSystemProduct.addSeriesParameter(seriesParameter);
  selectparameterChirdren.value = false;
  message.success(WeiI18n.t("添加成功").value);
  queryParameterInfoS();
}

/**
 * 处理树选择器中的节点选择
 * @param selectedKeys 选中的节点keys
 * @param info 节点信息
 */
async function handleSelectTreeNode(selectedKeys: any[], info: any) {
  selectTreeSelectedKeys.value = selectedKeys[0];
  seriesParameter.categoryid = selectedKeys[0];
  const templateRes =
    await AdminApiSystemProduct.getTempalteParaInfoList(seriesParameter);
  parameterInfoData.value = templateRes.data.data.data;
}

async function handleKeyIndicatorChange(record: any, checked: boolean) {
  try {
    ((seriesParameter.id = record.id),
      (seriesParameter.keyIndicators = checked));
    await AdminApiSystemProduct.updateKeyIndicators(seriesParameter);
    // 更新本地数据以立即反映变化
    record.keyIndicators = checked ? "1" : "0";
    // 显示操作成功的提示信息
    message.success(WeiI18n.t("操作成功").value);
    queryParameterInfoS();
  } catch (error) {
    // 如果更新失败，恢复原始状态
    record.keyIndicators = checked ? "0" : "1";
    message.error(WeiI18n.t("操作失败").value);
  }
}

/**
 * 确认选择树节点，将选中的节点名称传回tree组件
 */
async function confirmSelectTreeNode(item: any) {
  const ids = [];
  item.forEach((obj) => {
    ids.push(obj.id);
  });
  console.log(ids);
  platformParameter.ids = ids;
  platformParameter.proId = categoryInfo.value.key;
  await AdminApiSystemProduct.addParameterInfo(platformParameter);
  selectTreeVisible.value = false;
  selectTreeSelectedKeys.value = "";
  message.success(WeiI18n.t("添加成功").value);
  queryParameterInfoS();
}

/** 将数据转换为树结构所需格式 */
function convertToTreeNodes(data: any[]): any[] {
  return data.map((item) => {
    // 判断是否为根节点
    const isRootNode =
      item.moduleLevel === 1 ||
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
      level: level,
      children: hasChildren ? convertToTreeNodes(item.children) : [],
    };
  });
}

defineExpose({ reloadTableParameter });
</script>

<style lang="less" scoped>
.parameter-definition {
  height: 100%;
}

.params-toolbar {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

/* 确保表格区域有足够高度 */
.ant-table-wrapper {
  min-height: 400px;
}
.b-body2 {
  height: calc(100vh - 320px);
  overflow: auto;
  margin-top: 20px;
}

// .user-selector-modal{
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

/* 确保分页选择器有足够宽度显示完整文本 */
:deep(.ant-pagination-options-size-changer) {
  min-width: 100px;
}

:deep(.ant-select-selector) {
  min-width: 80px !important;
}

/* 减小数字和单位之间的间距 */
:deep(.ant-select-selection-item) {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
}

:deep(.ant-select-selection-item-content) {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
