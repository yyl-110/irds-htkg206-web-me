<script setup lang="ts">
import { nextTick, ref } from 'vue';
import MaterialInfoList from './MaterialInfoList.vue';
import MaterialPropertyInfo from './MaterialPropertyInfo.vue';

const emit = defineEmits(['getCategory']);
const materialInfoListRef = ref<any>(null);
const materialPropertyInfoRef = ref<any>(null);

const activeKey = ref('1');
const categoryid = ref<string>('');
const menuId = ref<any>('');

async function infoReload(categoryidStr: string, menuid: any) {
  categoryid.value = categoryidStr;
  menuId.value = menuid;
  if (activeKey.value === '1') {
    await materialInfoListRef.value?.initData(categoryid.value, menuId.value);
  } else {
    nextTick(() => {
      materialPropertyInfoRef.value?.initColumnData(categoryid.value);
    });
  }
}

function getCategory(categoryId: any) {
  emit('getCategory', categoryId);
}

function handleTabChange() {
  if (activeKey.value === '1') {
    materialInfoListRef.value?.initData(categoryid.value, menuId.value);
  } else {
    nextTick(() => {
      materialPropertyInfoRef.value?.initColumnData(categoryid.value);
    });
  }
}

defineExpose({ infoReload });
</script>

<template>
  <div class="module-adm">
    <a-tabs v-model:activeKey="activeKey" class="module-adm-tabs" @change="handleTabChange">
      <a-tab-pane key="1" tab="数据管理">
        <MaterialInfoList ref="materialInfoListRef" @getCategory="getCategory" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="属性管理">
        <MaterialPropertyInfo ref="materialPropertyInfoRef" />
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
