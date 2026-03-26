<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  confirm: (param?: { closeDropdown?: boolean }) => void;
  clearFilters?: () => void;
  column: { title?: string; dataIndex?: string };
  mode?: "input" | "select";
  options?: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  search: [selectedKeys: string[], dataIndex: string];
  reset: [dataIndex: string];
}>();

const searchInput = ref();
const dropdownRef = ref<HTMLElement>();

const onSearch = () => {
  props.confirm();
  emit("search", props.selectedKeys, props.column.dataIndex || "");
};

const onReset = () => {
  props.clearFilters?.();
  props.confirm();
  emit("reset", props.column.dataIndex || "");
};

const onInputChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  props.setSelectedKeys(value ? [value] : []);
};

const onSelectChange = (value: string | undefined) => {
  props.setSelectedKeys(value ? [value] : []);
};

defineExpose({ searchInput });
</script>

<template>
  <div ref="dropdownRef" class="table-filter-dropdown">
    <template v-if="mode === 'select'">
      <a-select
        :value="selectedKeys[0] || undefined"
        :placeholder="`筛选 ${column.title}`"
        allow-clear
        class="filter-select"
        :getPopupContainer="() => dropdownRef"
        @change="onSelectChange"
      >
        <a-select-option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </a-select-option>
      </a-select>
    </template>
    <template v-else>
      <a-input
        ref="searchInput"
        :placeholder="`搜索 ${column.title}`"
        :value="selectedKeys[0]"
        class="filter-input"
        @change="onInputChange"
        @pressEnter="onSearch"
      />
    </template>
    <div class="filter-actions">
      <a-button type="primary" size="small" @click="onSearch">
        <template #icon><SearchOutlined /></template>
        确定
      </a-button>
      <a-button size="small" @click="onReset">重置</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-filter-dropdown {
  padding: 8px 16px;
  position: relative;

  .filter-input,
  .filter-select {
    width: 188px;
    margin-bottom: 8px;
    display: block;
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid #f0f0f0;
    padding-top: 8px;
  }
}
</style>
