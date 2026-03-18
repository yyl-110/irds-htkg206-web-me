<script setup lang="ts">
const open = ref<boolean>(false);
const searchText = ref<string>("");
function onSearch() {
  console.log(searchText.value);
}
const openDrawer = () => {
  open.value = true;
};

defineExpose({
  openDrawer,
});
</script>

<template>
  <a-drawer v-model:visible="open" :closable="false">
    <div class="header">
      <a-input-search
        v-model:value="searchText"
        placeholder="请输入标题或作者搜索"
        enter-button
        @search="onSearch"
      />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <a-button type="primary" @click="open = false">关闭</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style lang="less" scoped></style>