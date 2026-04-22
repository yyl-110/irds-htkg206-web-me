<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { ModuleTypeRequestDTOModel } from '@/api/models/module/ModuleTypeRequestDTOModel';
import { ModulePropertyPageRequestDTOModel } from '@/api/models/module/ModulePropertyPageRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import ModulePropertyInfo from './ModulePropertyInfo.vue';
import ModuleInfoList from './ModuleInfoList.vue';
const moduleInfoListRef = ref<any>(null);
const modulePropertyInfoRef = ref<any>(null);
const userStore = useUserStore();
const activeKey = ref('1');
const categoryid = ref<string>('');
const menuId = ref<any>('');
const emit = defineEmits(['getCategory']);
//初始化数据
async function infoReload(categoryidStr: string, menuid: any) {
  categoryid.value = categoryidStr;
  menuId.value = menuid;
  if (activeKey.value == '1') {
    moduleInfoListRef.value.initData(categoryid.value, menuid);
  } else {
    nextTick(() => {
      modulePropertyInfoRef.value.initColumnData(categoryid.value);
    });
  }
}

function getCategory(categoryId: any) {
  emit('getCategory', categoryId);
}

function handleTabChange(item: any) {
  if (activeKey.value == '1') {
    moduleInfoListRef.value.initData(categoryid.value, menuId.value);
  } else {
    nextTick(() => {
      modulePropertyInfoRef.value.initColumnData(categoryid.value);
    });
  }
}
function handleGlobalQuery() {
  moduleInfoListRef.value?.selectAllModuleInfo?.();
}
defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <div class="top-right-actions">
      <a-button type="link" @click="handleGlobalQuery">全局查询</a-button>
    </div>
    <a-tabs v-model:activeKey="activeKey" class="module-adm-tabs" @change="handleTabChange" style="margin-left: 20px">
      <a-tab-pane key="1" tab="数据管理">
        <ModuleInfoList :categoryid="categoryid" ref="moduleInfoListRef" @getCategory="getCategory" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="属性管理">
        <ModulePropertyInfo ref="modulePropertyInfoRef" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less">
.imgList {
  background-color: #ffffff;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 与 Main / 分栏定高链衔接，仅 tab 内容区可内部滚动，避免 a-tabs 撑高整页 */
.module-adm-tabs {
  flex: 1 1 0%;
  min-height: 0;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}

:deep(.module-adm-tabs.ant-tabs) {
  flex: 1 1 0%;
  min-height: 0;
  overflow: hidden;
}

:deep(.module-adm-tabs .ant-tabs-nav) {
  flex: 0 0 auto;
  margin-bottom: 0;
}

:deep(.module-adm-tabs .ant-tabs-content-holder) {
  flex: 1 1 0%;
  min-height: 0;
  overflow: hidden;
}

:deep(.module-adm-tabs .ant-tabs-content) {
  height: 100%;
  overflow: hidden;
}

:deep(.module-adm-tabs .ant-tabs-tabpane) {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.top-right-actions {
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 10;
}
</style>
