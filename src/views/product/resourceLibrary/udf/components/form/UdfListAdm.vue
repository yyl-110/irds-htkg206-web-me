<script setup lang="ts">
import { nextTick, ref } from 'vue';
import UdfInfoList from './UdfInfoList.vue';
import UdfPropertyInfo from './UdfPropertyInfo.vue';

const emit = defineEmits(['getCategory']);
const udfInfoListRef = ref<any>(null);
const udfPropertyInfoRef = ref<any>(null);

const activeKey = ref('1');
const categoryid = ref<string>('');
const menuId = ref<any>('');

async function infoReload(categoryidStr: string, menuid: any) {
  categoryid.value = categoryidStr;
  menuId.value = menuid;
  if (activeKey.value === '1') {
    await udfInfoListRef.value?.initData(categoryid.value, menuId.value);
  } else {
    nextTick(() => {
      udfPropertyInfoRef.value?.initColumnData(categoryid.value);
    });
  }
}

function getCategory(categoryId: any) {
  emit('getCategory', categoryId);
}

function handleTabChange() {
  if (activeKey.value === '1') {
    udfInfoListRef.value?.initData(categoryid.value, menuId.value);
  } else {
    nextTick(() => {
      udfPropertyInfoRef.value?.initColumnData(categoryid.value);
    });
  }
}

defineExpose({ infoReload });
</script>

<template>
  <div class="module-adm">
    <a-tabs v-model:activeKey="activeKey" class="module-adm-tabs" @change="handleTabChange">
      <a-tab-pane key="1" tab="数据管理">
        <UdfInfoList ref="udfInfoListRef" @getCategory="getCategory" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="属性管理">
        <UdfPropertyInfo ref="udfPropertyInfoRef" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less">
.module-adm {
  height: 100%;
  padding: 12px;
  background: #fff;
}
.module-adm-tabs {
  height: 100%;
}
</style>
