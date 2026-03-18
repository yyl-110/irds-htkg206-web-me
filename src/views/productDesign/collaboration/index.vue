<script lang="ts" setup>
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import type { TableColumnsType } from "ant-design-vue";

const columns: TableColumnsType = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
  },
  { title: "Age", width: 100, dataIndex: "age", key: "age" },
  { title: "Column 1", dataIndex: "address", key: "1" },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
  },
];

interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataItem[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 40,
    address: "London Park",
  },
  {
    key: "23",
    name: "Jim Green",
    age: 40,
    address: "London Park",
  },
  {
    key: "233",
    name: "Jim Green",
    age: 40,
    address: "London Park",
  },
];
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
        <a-button>
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
      <div class="flex items-center gap-[8px]">
        <a-input placeholder="请输入项目名称/项目编号" style="width: 200px">
          <template #suffix>
            <SearchOutlined class="text-hex-555D6D" />
          </template>
        </a-input>
        <a-button> 高级搜索 </a-button>
      </div>
    </div>
    <main class="mt-[16px]">
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1300 }"
        bordered
        :row-class-name="
          (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
        "
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            <a>action</a>
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
  .table-striped {
    background-color: #f7f8fb;
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