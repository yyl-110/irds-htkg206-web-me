<script setup lang="ts">
import { inject, nextTick, reactive, ref } from "vue";
import type { TableColumnType, TableProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import { useForm } from "ant-design-vue/es/form";
import MenuAddUpdate from "./components/form/index.vue";
import ConfigurationItemPoint from "./components/form/ConfigurationItemPoint.vue";
import { AdminApiSystemProductpackage } from "@/api/tags/productpackage/管理后台产品包管理";
import type { MenuResponseDTOModel } from "@/api/models/MenuResponseDTOModel";
import { WeiI18n } from "@/utils/WeiI18n";
import { ProdProductpackageRequestDTOModel } from "@/api/models/productpackage/ProdProductpackageRequestDTOModel";
import Empty from "@/components/Empty/index.vue";
import type { RolePOModel } from "@/api/models/RolePOModel";
import { AdminApiSystemUser } from "@/api/tags/管理后台用户";
import { exportFile } from "@/utils/file";
import UploadModal from "./components/modal/upload-modal.vue";
import { EpcIcon } from "@/components/icon/EpcIcon";
import { useUserStore } from "@/store/modules/user";
import { sortermethod } from "@/utils/tools";
import type {
  AdminListItemResponseDTO,
  PermissionAssignUsersRoleRequestDTO,
  RolePO,
} from "@/api/tags/data-contracts";
/** 模块树类型 */
type Menus = MenuResponseDTOModel & {
  children: Array<MenuResponseDTOModel>;
};
interface GroupData {
  id: number;
  deptId?: number;
  name: string;
  roleClass?: number;
  key?: object;
}
/** 表单样式 label对象 */
const labelCol = ref({ style: { width: "70px" } });
/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });
/** 获取用户对象 */
const userStore = useUserStore();
/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); // 表格高度
const modalVisible = ref<boolean>(false);
const gurationVisible = ref<boolean>(false);
interface customerList {
  label: string;
  value?: number | string;
}
/** 用户数据 */
const customerList = ref<Array<customerList>>([]);
/** 列表请求参数 */
const requestParams = reactive(new ProdProductpackageRequestDTOModel());
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

/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);
const selectedRowkeys = ref<any>([]);
/** 表格勾选事件 */
const rowSelection = computed(() => {
  /**
   * @param selectedRowkeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  return {
    selectedRowKeys: selectedRowkeys.value,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      selectedRowkeys.value = selectedRowKeys;
    },
  };
});
function customRow(record: any) {
  return {
    onClick: () => {
      const selectedRowKeys = [...selectedRowkeys.value];
      const key = record.id;
      if (selectedRowKeys.includes(key)) {
        // 如果已选中则取消选中
        selectedRowkeys.value = selectedRowKeys.filter((k) => k !== key);
      } else {
        // 如果未选中则选中
        selectedRowkeys.value = [...selectedRowKeys, key];
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
const Configuration = ref<InstanceType<typeof ConfigurationItemPoint>>();
function handleResizeColumn(w: any, col: any) {
  col.width = w;
}
const columns = ref([
  {
    title: WeiI18n.t("类别名称").value,
    dataIndex: "packageName",
    key: "packageName",
    sorter: (a: any, b: any) => sortermethod(a.packageName, b.packageName),
    width: 100,
    resizable: true,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: WeiI18n.t("类别说明").value,
    dataIndex: "packageRemarks",
    key: "packageRemarks",
    sorter: (a: any, b: any) =>
      sortermethod(a.packageRemarks, b.packageRemarks),
    width: 200,
    resizable: true,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: WeiI18n.t("配置项点数").value,
    dataIndex: "packageItemCount",
    key: "packageItemCount",
    sorter: (a: any, b: any) =>
      sortermethod(a.packageItemCount, b.packageItemCount),
    width: 50,
    resizable: true,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: WeiI18n.t("排序").value,
    dataIndex: "sortIndex",
    key: "sortIndex",
    sorter: (a: any, b: any) =>
      sortermethod(a.sortIndex + "", b.sortIndex + ""),
    width: 50,
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
const dataSource = ref<any>([]);
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemProductpackage.getpackageList({
      ...requestParams,
    });
    loading.value = false;
    dataSource.value = res.data.data?.list;
    pagination.total = res.data.data?.total;
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  getListData();
});

/**
 * 新增 / 修改
 * @param row
 * @param parentId parentId
 */
function handleAddOrUpdate(row: any, parentId?: number) {
  visible.value = true;
  gurationVisible.value = true;
  nextTick(() => {
    addOrUpdate.value?.handleModalAddOrUpdate(row, parentId);
  });
}
function ConfigurationItem(row: any) {
  gurationVisible.value = true;
  nextTick(() => {
    Configuration.value?.handleModalAddOrUpdate(row);
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
 * @description 清除搜索
 */
function handleReset() {
  requestParams.packageName = "";
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
/**
 * 删除
 * @param id id
 */
function handleDelete(id: Menus["id"]) {
  AdminApiSystemProductpackage.deletepackage({ id }).then(() => {
    message.success("删除成功!");
    getListData();
  });
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
        <a-form-item :label="$t('名称')" name="packageName">
          <a-input
            v-model:value="requestParams.packageName"
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
          <a-button type="primary" @click="handleFinish">
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
        :scroll="{ x: 900 }"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        :locale="locale"
        :data-source="dataSource"
        :columns="columns"
        @resizeColumn="handleResizeColumn"
        :row-selection="rowSelection"
        :customRow="customRow"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div style="height: 22px; display: flex; align-items: center">
              <a @click.stop="handleAddOrUpdate(record)">{{ $t("修改") }}</a>
              <a-divider type="vertical" />
              <a @click.stop="ConfigurationItem(record)">{{
                $t("配置项点")
              }}</a>
              <a-divider type="vertical" />
              <div @click.stop>
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="`${$t('确定要删除吗')}?`"
                  :ok-text="$t('确定')"
                  :cancel-text="$t('取消')"
                  :disabled="$isPending('delete', record.id)"
                  @confirm="handleDelete(record.id)"
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
      v-model:modal-visible="visible"
      @refresh-table-data="getListData"
    />
    <!--    弹窗 -- 配置项点 -->
    <ConfigurationItemPoint
      ref="Configuration"
      v-model:modal-visible="gurationVisible"
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
