<script lang="ts" setup>
import { deleteData, findProduct } from "@/api/product";
import { useUserStore } from "@/store/modules/user";
import { usePagination } from "@/hooks/usePagination";
import { useTableFilter } from "@/hooks/useTableFilter";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { message, Modal, type TableColumnsType } from "ant-design-vue";

const searchData = ref({ projectStatus: null, projectName: "" });
const loading = ref(false);
const selectedRowKeys = ref<string[]>([]);

const params = reactive({
  code: "",
  nameCN: "",
  pageNo: 1,
  pageSize: 10,
  userId: "" as string | number,
  type: null as string | null,
});

const { pagination } = usePagination(params, fetchProductList);
pagination.showLessItems = true;
pagination.showTotal = (total: number) => `共 ${total} 条`;
// 覆盖 pagination.onChange，避免筛选/排序时触发接口调用
// 改为通过 table 的 @change 事件手动控制
const originalOnChange = pagination.onChange;
pagination.onChange = undefined;

const handleTableChange = (
  pag: any,
  filters: any,
  sorter: any,
  { action }: any
) => {
  if (action === "paginate" && originalOnChange) {
    originalOnChange(pag.current, pag.pageSize);
  }
};

const rowClassName = (_record: any, index: number) =>
  index % 2 === 1 ? "table-striped" : "";

const { getColumnSearchProps, getColumnSelectProps } = useTableFilter();

const tableData = ref<any[]>([]);

const columns = computed<TableColumnsType>(() => [
  {
    title: "项目编号",
    dataIndex: "code",
    key: "code",
    width: 170,
    fixed: "left",
    ellipsis: true,
    sorter: (a: any, b: any) => (a.code || "").localeCompare(b.code || ""),
  },
  {
    title: "项目名称",
    dataIndex: "nameCN",
    key: "nameCN",
    width: 210,
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "平台名称",
    dataIndex: "platformName",
    key: "platformName",
    width: 150,
    ellipsis: true,
    ...getColumnSearchProps("platformName"),
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    align: "center",
    ...getColumnSelectProps("status", tableData),
  },
  {
    title: "创建人",
    dataIndex: "createUserName",
    key: "createUserName",
    width: 120,
    ellipsis: true,
  },
  {
    title: "项目负责人",
    dataIndex: "responsibleName",
    key: "responsibleName",
    width: 120,
    ellipsis: true,
    ...getColumnSelectProps("responsibleName", tableData),
  },
  {
    title: "计划开始时间",
    dataIndex: "planStartTime",
    key: "planStartTime",
    width: 140,
    align: "center",
    ellipsis: true,
  },
  {
    title: "计划完成时间",
    dataIndex: "planCompleteTime",
    key: "planCompleteTime",
    width: 140,
    align: "center",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "operation",
    width: 120,
    align: "center",
    fixed: "right",
  },
]);

// 外部按鈕刪除項目
const delProject = () => {
  if (!selectedRowKeys.value.length) {
    message.error("请选择要删除的项");
    return;
  }
  const hasActive = tableData.value.some(
    (item: any) =>
      selectedRowKeys.value.includes(item.projectId) &&
      (item.status === "工作中" || item.status === "已完成")
  );
  if (hasActive) {
    message.error("工作中或已完成的项目，不可以删除");
    return;
  }
  Modal.confirm({
    title: "友情提示",
    icon: h(ExclamationCircleOutlined),
    content: "确认删除该项目？",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      const idList = selectedRowKeys.value.map((item) => ({
        projectId: item,
        userId: useUserStore().getUser.id,
      }));
      return deleteData({ projectId: idList }).then((res) => {
        if (res && res.data.code === "0") {
          message.success("删除成功！");
          fetchProductList();
        }
      });
    },
  });
};

const handleEdit = (row: any) => {
  // TODO: 编辑逻辑
};

const handleDetails = (row: any) => {
  // TODO: 详情逻辑
};

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};

async function fetchProductList() {
  try {
    loading.value = true;
    params.code = searchData.value.projectName;
    params.nameCN = searchData.value.projectName;
    params.userId = useUserStore().getUser.id;
    params.type = searchData.value.projectStatus;
    const res = await findProduct(params);
    if (res && res.data.code === "0") {
      tableData.value = res.data.data?.data || [];
      pagination.total = res.data.data?.total || 0;
    }
  } catch (error) {
    console.log("error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProductList();
});
</script>

<template>
  <div class="collaborationContainer p-[16px]">
    <div class="title text-[#313133] text-[16px] font-bold">协同设计列表</div>
    <div class="header flex justify-between items-center mt-[16px]">
      <div class="flex items-center gap-[8px]">
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          创建项目
        </a-button>
        <a-button @click="delProject">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
      <div class="flex items-center gap-[8px]">
        <a-input
          placeholder="请输入项目名称/项目编号"
          class="max-w-[200px]"
          v-model:value="searchData.projectName"
          @keydown.enter="fetchProductList"
        >
          <template #suffix>
            <SearchOutlined class="text-hex-555D6D" />
          </template>
        </a-input>
        <a-select
          v-model:value="searchData.projectStatus"
          class="min-w-[200px] max-w-[200px]"
          placeholder="请选择项目状态"
        >
          <a-select-option value="待启动">待启动</a-select-option>
          <a-select-option value="工作中">工作中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
        </a-select>
        <a-button type="primary" @click="fetchProductList"> 查询 </a-button>
      </div>
    </div>
    <main class="mt-[16px]">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :scroll="{ x: 1200 }"
        :rowKey="(record) => record.projectId"
        :loading="loading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        bordered
        :row-class-name="rowClassName"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code'">
            <span class="text-primary">{{ record.code }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <span
              :class="{
                sjz_style: record.status === '工作中',
                ywc_style: record.status === '已完成',
                dcl_style: record.status === '待启动',
              }"
              class="status"
              >{{ record.status }}</span
            >
          </template>
          <template v-if="column.key === 'operation'">
            <span
              v-if="record.editAuthed === '是'"
              class="handle_btn"
              @click="handleEdit(record)"
              >编辑</span
            >
            <span v-else>&nbsp;</span>
            <span class="handle_btn handle_btn1" @click="handleDetails(record)"
              >详情</span
            >
          </template>
        </template>
      </a-table>
    </main>
  </div>
</template>

<style lang="less" scoped>
:deep(.ant-table) {
  font-size: 12px;
  color: #313133;

  .text-primary {
    color: #1884ff;
    cursor: pointer;
  }

  .table-striped {
    background-color: #f7f8fb;
  }
  .dcl_style {
    &::before {
      background: #f7b400;
    }
  }
  .sjz_style {
    &::before {
      background: #0158f0;
    }
  }
  .ywc_style {
    &::before {
      background: #00b25c;
    }
  }
  .handle_btn {
    color: #1884ff;
    cursor: pointer;
  }

  .status {
    &::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }

  .handle_btn1 {
    margin-left: 10px;
  }
}

.collaborationContainer {
  :deep(.ant-input) {
    border-color: #eaeaf1;

    &::placeholder {
      color: #a2a1a6;
      font-size: 12px;
    }
  }
}
</style>