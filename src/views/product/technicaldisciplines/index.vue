<script setup lang="ts">
import { inject, nextTick, reactive, ref } from "vue";
import type { TableColumnType, TableProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import { useForm } from "ant-design-vue/es/form";
import MenuAddUpdate from "./components/form/index.vue";
import { AdminApiSystemTechnicaldisciplines } from "@/api/tags/technicaldisciplines/管理后台技术学科管理";
import type { MenuResponseDTOModel } from "@/api/models/MenuResponseDTOModel";
import { WeiI18n } from "@/utils/WeiI18n";
import { ProdTechnicaldRequestDTOModel } from "@/api/models/technicaldisciplines/ProdTechnicaldRequestDTOModel";
import Empty from "@/components/Empty/index.vue";
import type { RolePOModel } from "@/api/models/RolePOModel";
import { AdminApiSystemUser } from "@/api/tags/管理后台用户";
import { EpcIcon } from "@/components/icon/EpcIcon";
import { WeiMessage } from "@/utils/WeiMessage";
import { exportFile } from "@/utils/file";
import UploadModal from "./components/modal/upload-modal.vue";
import { useUserStore } from "@/store/modules/user";
import { sortermethod, cleanEmptyChildrenBFS } from "@/utils/tools";
import { filterTree } from "@/utils/tools";
/** 模块树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};

/** 表单样式 label对象 */
const labelCol = ref({ style: { width: "70px" } });
/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });
/** 获取用户对象 */
const userStore = useUserStore();
const modalVisible = ref<boolean>(false);
/** 列表请求参数 */
const requestParams = reactive(new ProdTechnicaldRequestDTOModel());
/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = (pageSizeOptions) =>
  `${pageSizeOptions.value}${WeiI18n.$t("条/页")}`;
pagination.showTotal = (total) =>
  `${WeiI18n.$t("共") + total + WeiI18n.$t("条")}`;
pagination.showQuickJumper = false;
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
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag?: boolean;
}
interface userData {
  value: string | number;
  label: string;
}
const userData = ref<userData[]>([]);
const formData = reactive<any>({});
/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    type: "radio",
    columnWidth: 15, // 直接设置复选框列宽度
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowList.value = selectedRows;
      selectedRowkeys.value = selectedRowKeys;
      if (selectedRows && selectedRows.length > 0) {
        formData.pdmName = selectedRows[0].descript || "";
        formData.techid = selectedRows[0].techid || "";
        formData.associationId = selectedRows[0].id || "";
      }
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      if (record.id == selectedRowkeys.value[0]) {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        formData.pdmName = "";
        formData.techid = "";
        formData.associationId = "";
      } else {
        selectedRowkeys.value = [];
        selectedRowList.value = [];
        selectedRowkeys.value.push(record.id);
        selectedRowList.value.push(record);
        formData.pdmName = record.descript || "";
        formData.techid = record.techid || "";
        formData.associationId = record.id || "";
      }
    },
  };
}
// eslint-disable-next-line jsdoc/check-indentation
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(":root");
  const width = getComputedStyle(root).getPropertyValue(
    "--main-operation2-width"
  );
  return Number(width);
});
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const addOrUpdate = ref<InstanceType<typeof MenuAddUpdate>>();
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const columns = ref<TableColumnType<Menus>[]>([
  {
    title: WeiI18n.t("学科名称").value,
    dataIndex: "categoryName",
    key: "categoryName",
    sorter: (a: any, b: any) => sortermethod(a.categoryName, b.categoryName),
    width: 150,
    resizable: true,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: WeiI18n.t("学科负责人").value,
    dataIndex: "userId",
    key: "userId",
    sorter: (a: any, b: any) => sortermethod(a.userId, b.userId),
    width: 150,
    resizable: true,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: WeiI18n.t("操作").value,
    align: "left",
    dataIndex: "operation",
    width: operationWidth.value,
    fixed: "right",
  },
]);

/** 列表数据 */
const treeData = ref<any>([]);
const temporaryTreeData = ref<any>([]);

async function getListData() {
  loading.value = true;
  try {
    const res =
      await AdminApiSystemTechnicaldisciplines.gettechnicaldisciplinesList({});
    loading.value = false;
    if (res.data.code === 200) {
      treeData.value = cleanEmptyChildrenBFS(res.data.data);
      temporaryTreeData.value = res.data.data;
    }
  } finally {
    loading.value = false;
  }
}
function getUsergroupData() {
  try {
    AdminApiSystemUser.getSimpleUsers().then((res: any) => {
      userData.value =
        res.data.data?.map((item: any) => ({
          label: `${item.nickname}  （${item.username}）`,
          value: item.id,
        })) || [];
    });
  } catch (error) {}
}
function usernameprocessing(id: string) {
  let arr = "";
  userData.value.forEach((item: any) => {
    if (item.value == id) {
      arr = item.label;
    }
  });
  return arr;
}
onMounted(() => {
  getListData();
  getUsergroupData();
});

/**
 * 新增 / 修改
 * @param row
 * @param parentId parentId
 */
function handleAddOrUpdate(row: any) {
  // if (!row && selectedRowkeys.value.length == 0 && treeData.value.length > 0) {
  //   return message.warning('请选择要操作的行');
  // }
  visible.value = true;
  nextTick(() => {
    addOrUpdate.value?.handleModalAddOrUpdate(row);
  });
}
/**
 * 查询表格数据
 */
function handleFinish(categoryName: string) {
  if (categoryName) {
    const list = [...temporaryTreeData.value];
    const condition = (node: any) => node?.categoryName.includes(categoryName);
    treeData.value = filterTree(list, condition);
  } else {
    treeData.value = temporaryTreeData.value;
  }
}

/**
 * @description 清除搜索
 */
function handleReset() {
  requestParams.name = "";
  treeData.value = temporaryTreeData.value;
}

/**
 * 删除
 * @param id id
 */
async function handleDelete(row: any) {
  // 根节点判断（假设根节点无 parentId 或 parentId 为 0）
  const isRoot = row.parentId == "0" || !row.parentId;
  // 子节点判断（排除空数组情况）
  const hasChildren = row.children && row.children.length > 0;
  if (isRoot && hasChildren) {
    message.warning("根节点包含子节点，无法删除");
    return;
  }
  const res =
    await AdminApiSystemTechnicaldisciplines.deletetechnicaldisciplines({
      id: row.id,
    });
  if (res.data.code == 200) {
    message.success("删除成功!");
    getListData();
  }
}
// 获取同层级兄弟节点
function getSiblings(node: any) {
  return treeData.value
    .filter((item) => item.parentId == node.parentId)
    .sort((a, b) => a.sort - b.sort);
}
// 判断是否可上移
function canMoveUp(node: any) {
  const siblings = getSiblings(node);
  const index = siblings.findIndex((item) => item.id == node.id);
  return index > 0;
}
// 判断是否可下移
function canMoveDown(node: any) {
  const siblings = getSiblings(node);
  const index = siblings.findIndex((item) => item.id == node.id);
  return index < siblings.length - 1;
}

async function Treenodemovement(row: any, type: any) {
  // if (type == 1) {
  //   canMoveUp(row);
  // } else {
  //   canMoveDown(row);
  // }
  try {
    const res = await AdminApiSystemTechnicaldisciplines.sortdiscipline({
      id: row.id,
      type,
    });
    if (res.data.code == 200) {
      getListData();
    }
  } catch (error) {
    console.log(error, "error");
  }
}

/**
 * @description 导入数据成功回调
 */
function importSuccess() {
  getListData();
  modalVisible.value = false;
}
interface MockData {
  key: string;
  title: string;
  username: string;
  nickname: string;
  chosen: boolean;
}
</script>

<template>
  <div class="bg-body">
    <a-card>
      <a-form
        ref="formRef"
        class="form_css"
        layout="inline"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="requestParams"
      >
        <a-form-item :label="$t('名称')" name="orderId">
          <a-input
            v-model:value="requestParams.name"
            allow-clear
            style="width: 240px; text-align: left"
            :placeholder="$t('请输入')"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleAddOrUpdate(undefined)">
            <EpcIcon type="icon-md-add" style="font-size: 17px" />{{
              $t("添加")
            }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleFinish(requestParams.name)">
            <EpcIcon type="icon-fangdajing" style="font-size: 12px" />{{
              $t("查询")
            }}
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset">
            <EpcIcon type="icon-zhongzhi" style="font-size: 12px" />{{
              $t("重置")
            }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 10px">
      <a-table
        :scroll="{ x: 1200, y: 500 }"
        :pagination="false"
        :loading="loading"
        row-key="id"
        :locale="locale"
        :data-source="treeData"
        :columns="columns"
        @resizeColumn="handleResizeColumn"
        :row-selection="rowSelection"
        :customRow="customRow"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userId'">
            <span>
              {{ usernameprocessing(record.userId) }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div style="height: 22px; display: flex; align-items: center">
              <a @click.stop="handleAddOrUpdate(record)">{{ $t("修改") }}</a>
              <a-divider type="vertical" />
              <a @click.stop="Treenodemovement(record, 1)">{{ $t("上移") }}</a>
              <a-divider type="vertical" />
              <a @click.stop="Treenodemovement(record, 2)">{{ $t("下移") }}</a>
              <a-divider type="vertical" />
              <div @click.stop>
                <a-popconfirm
                  v-if="treeData.length"
                  :title="`${$t('确定要删除吗')}?`"
                  :ok-text="$t('确定')"
                  :cancel-text="$t('取消')"
                  :disabled="$isPending('delete', record.id)"
                  @confirm="handleDelete(record)"
                >
                  <a style="color: #ff4d4f">{{ $t("删除") }}</a>
                </a-popconfirm>
              </div>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <UploadModal
      :modal-visible="modalVisible"
      @cancel="modalVisible = false"
      @import-success="importSuccess"
    />
    <!--    弹窗 -- 新增 or 修改 -->
    <MenuAddUpdate
      ref="addOrUpdate"
      :treeData="treeData"
      :selectedRowList="selectedRowList"
      v-model:modal-visible="visible"
      @refresh-table-data="getListData"
    />
  </div>
</template>

<style scoped>
.bg-body {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 5px;
}

:deep(.ant-table-column-sorters) {
  justify-content: flex-start;
  align-items: flex-end;
}

:deep(.ant-table-column-title) {
  flex: none;
}
</style>
