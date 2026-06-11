<script setup lang="ts">
// 自定义页面
import { ref, shallowRef, watch } from 'vue';
import type { Component } from 'vue';
import { message } from 'ant-design-vue';
import CustomPageScope from '../../../activityPage/custompage/_shared/components/CustomPageScope.vue';
import {
  loadCustomPageComponent,
  loadCustomPageParameters,
  resolveCustomPageKey,
  type CustomPageSavedParamRow,
} from '../../../activityPage/custompage/registry/index';
import type { CustomPageSavedTableRow } from '../../../activityPage/custompage/_shared/utils/taskParamMapMerge';

const props = defineProps<{
  activityPageId?: string | number | null;
  pageUrl?: string | null;
  pageName?: string | null;
  savedParamValues?: CustomPageSavedParamRow[] | null;
  savedTables?: CustomPageSavedTableRow[] | null;
  /** 只读查看：禁止页面内交互 */
  readOnly?: boolean;
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
  getInternalParameterList?: () => unknown[];
  updateEl?: () => void;
} | null>(null);
const parameterTempList = ref<unknown[]>([]);
const pageKey = ref<string | null>(null);
let loadSeq = 0;

async function loadPageContent() {
  const seq = ++loadSeq;
  ready.value = false;
  resolvedComponent.value = null;
  parameterTempList.value = [];
  pageKey.value = null;

  const pageUrl = String(props.pageUrl ?? '').trim();
  if (!pageUrl) {
    loading.value = false;
    return;
  }

  pageKey.value = resolveCustomPageKey(props.pageUrl, props.pageName);
  if (!pageKey.value) {
    message.warning('未找到匹配的自定义页面组件');
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const component = await loadCustomPageComponent(pageKey.value);
    if (seq !== loadSeq) return;
    if (!component) {
      message.warning('未找到匹配的自定义页面组件');
      return;
    }
    resolvedComponent.value = component;
    parameterTempList.value = await loadCustomPageParameters(
      pageKey.value,
      String(props.activityPageId ?? ''),
      props.savedParamValues,
      props.savedTables,
    );
    if (seq !== loadSeq) return;
    ready.value = true;
  } catch (error) {
    if (seq !== loadSeq) return;
    console.error('load custom page failed:', error);
    message.error('自定义页面加载失败');
  } finally {
    if (seq === loadSeq) {
      loading.value = false;
    }
  }
}

function getCurrentSaveParamValues() {
  return customComponentRef.value?.getCurrentSaveParamValues?.() ?? [];
}

function getCurrentTableSavePayload() {
  const child = customComponentRef.value;
  if (!child) return [];
  const fromChild = child.getCurrentTableSavePayload?.();
  if (Array.isArray(fromChild) && fromChild.length) return fromChild;
  if (child.getInternalParameterList) {
    child.getInternalParameterList();
    const retry = child.getCurrentTableSavePayload?.();
    if (Array.isArray(retry)) return retry;
  }
  return [];
}

function onContentMutated() {
  if (props.readOnly) return;
  emit('content-mutated');
}

watch(
  () => [props.activityPageId, props.pageUrl, props.pageName] as const,
  () => {
    void loadPageContent();
  },
  { immediate: true },
);

watch(
  () => [props.savedParamValues, props.savedTables] as const,
  () => {
    if (!ready.value) return;
    customComponentRef.value?.updateEl?.();
  },
  { deep: true },
);

defineExpose({
  getCurrentSaveParamValues,
  getCurrentTableSavePayload,
});
</script>

<template>
  <a-spin :spinning="loading">
    <CustomPageScope v-if="ready && resolvedComponent" :class="{ 'custom-page-scope--readonly': readOnly }">
      <component
        :is="resolvedComponent"
        ref="customComponentRef"
        :pageid="String(activityPageId ?? '')"
        :parameter-temp-list="parameterTempList"
        :saved-param-values="savedParamValues"
        :saved-tables="savedTables"
        @set-save-btn-enable="onContentMutated" />
    </CustomPageScope>
    <div v-else-if="ready && !resolvedComponent" class="custom-page-empty">未找到匹配的自定义页面组件</div>
  </a-spin>
</template>

<style scoped>
.custom-page-scope--readonly {
  pointer-events: none;
  user-select: text;
}

.custom-page-empty {
  padding: 24px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}
</style>
