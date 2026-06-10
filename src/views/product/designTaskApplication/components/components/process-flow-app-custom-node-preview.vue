<script setup lang="ts">
// 自定义页面
import { ref, shallowRef, watch } from 'vue';
import type { Component } from 'vue';
import { message } from 'ant-design-vue';
import { loadCustomPageComponent, loadCustomPageParameters, resolveCustomPageKey } from '../../../activityPage/custompage/registry/index';

const props = defineProps<{
  activityPageId?: string | number | null;
  pageUrl?: string | null;
  pageName?: string | null;
  savedParamValues?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null;
}>();

const emit = defineEmits<{
  (e: 'content-mutated'): void;
}>();

const loading = ref(false);
const ready = ref(false);
const resolvedComponent = shallowRef<Component | null>(null);
const customComponentRef = ref<{
  getCurrentSaveParamValues?: () => unknown[];
  getCurrentTableSavePayload?: () => unknown[];
} | null>(null);
const parameterTempList = ref<unknown[]>([]);
const pageKey = ref<string | null>(null);

async function loadPageContent() {
  ready.value = false;
  resolvedComponent.value = null;
  parameterTempList.value = [];
  pageKey.value = resolveCustomPageKey(props.pageUrl, props.pageName);
  if (!pageKey.value) {
    pageKey.value = 'customized-process-ansys';
  }
  loading.value = true;
  try {
    const component = await loadCustomPageComponent(pageKey.value);
    if (!component) {
      message.warning('未找到匹配的自定义页面组件');
      return;
    }
    resolvedComponent.value = component;
    parameterTempList.value = await loadCustomPageParameters(
      pageKey.value,
      String(props.activityPageId ?? ''),
      props.savedParamValues,
    );
    ready.value = true;
  } catch (error) {
    console.error('load custom page failed:', error);
    message.error('自定义页面加载失败');
  } finally {
    loading.value = false;
  }
}

function getCurrentSaveParamValues() {
  return customComponentRef.value?.getCurrentSaveParamValues?.() ?? [];
}

function getCurrentTableSavePayload() {
  return customComponentRef.value?.getCurrentTableSavePayload?.() ?? [];
}

function onContentMutated() {
  emit('content-mutated');
}

watch(
  () => [props.activityPageId, props.pageUrl, props.pageName, props.savedParamValues] as const,
  () => {
    void loadPageContent();
  },
  { immediate: true, deep: true },
);

defineExpose({
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});
</script>

<template>
  <a-spin :spinning="loading">
    <component
      :is="resolvedComponent"
      v-if="ready && resolvedComponent"
      ref="customComponentRef"
      :pageid="String(activityPageId ?? '')"
      :parameter-temp-list="parameterTempList"
      @set-save-btn-enable="onContentMutated" />
    <div v-else-if="ready && !resolvedComponent" class="custom-page-empty">未找到匹配的自定义页面组件</div>
  </a-spin>
</template>

<style scoped>
.custom-page-empty {
  padding: 24px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}
</style>
