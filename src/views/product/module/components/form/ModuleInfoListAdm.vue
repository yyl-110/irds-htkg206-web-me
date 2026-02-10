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
const emit = defineEmits([]);
//初始化数据
async function infoReload(categoryidStr: string) {
  categoryid.value = categoryidStr;
  if (activeKey.value == '1') {
    moduleInfoListRef.value.initData(categoryid.value);
  } else {
    nextTick(() => {
      modulePropertyInfoRef.value.initColumnData(categoryid.value);
    });
  }
}

function handleTabChange(item: any) {
  if (activeKey.value == '1') {
    moduleInfoListRef.value.initData(categoryid.value);
  } else {
    nextTick(() => {
      modulePropertyInfoRef.value.initColumnData(categoryid.value);
    });
  }
}
defineExpose({ infoReload });
</script>

<template>
  <div class="imgList">
    <a-tabs v-model:activeKey="activeKey" @change="handleTabChange" style="margin-left: 20px">
      <a-tab-pane key="1" tab="数据管理">
        <ModuleInfoList :categoryid="categoryid" ref="moduleInfoListRef" />
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
  width: auto;
  height: 100%;
}
</style>
