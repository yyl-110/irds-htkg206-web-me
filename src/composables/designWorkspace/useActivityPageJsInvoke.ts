import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { fetchJsScriptText, resolveJsFileId } from '@/utils/activityPageJsFile';
import {
  applyActivityJsInvokeResult,
  buildActivityJsInvokeParams,
  compileActivityPageJsMethods,
  getComponentJsMethodName,
  invokeActivityJsMethod,
  type ActivityJsApplyContext,
  type ActivityJsMethod,
} from '@/utils/activityPageJsRuntime';

export interface UseActivityPageJsInvokeOptions {
  getNodeDetail: () => Record<string, any> | null | undefined;
}

export function useActivityPageJsInvoke(options: UseActivityPageJsInvokeOptions) {
  const jsMethods = ref<Record<string, ActivityJsMethod>>({});
  const jsMethodsLoading = ref(false);
  const jsMethodsReady = ref(false);
  const applyingJsResult = ref(false);
  let loadToken = 0;

  async function loadJsMethods() {
    const fileId = resolveJsFileId(options.getNodeDetail() || {});
    if (!fileId) {
      jsMethods.value = {};
      jsMethodsReady.value = false;
      return;
    }
    const token = ++loadToken;
    jsMethodsLoading.value = true;
    try {
      const text = await fetchJsScriptText(fileId);
      if (token !== loadToken) return;
      jsMethods.value = await compileActivityPageJsMethods(text);
      jsMethodsReady.value = Object.keys(jsMethods.value).length > 0;
    } catch (e) {
      if (token !== loadToken) return;
      console.error('load activity js runtime failed:', e, { fileId });
      jsMethods.value = {};
      jsMethodsReady.value = false;
      message.warning('JS脚本加载失败，请确认活动已上传JS文件且已保存');
    } finally {
      if (token === loadToken) jsMethodsLoading.value = false;
    }
  }

  watch(
    () => resolveJsFileId(options.getNodeDetail() || {}),
    () => {
      void loadJsMethods();
    },
    { immediate: true },
  );

  async function invokeComponentJsMethod(item: any, index: number, ctx: ActivityJsApplyContext) {
    if (applyingJsResult.value || !item) return;
    const methodName = getComponentJsMethodName(item);
    if (!methodName) return;
    if (!jsMethodsReady.value) {
      await loadJsMethods();
    }
    if (!jsMethods.value[methodName]) {
      console.warn(`JS method not found: ${methodName}`);
      return;
    }
    const params = buildActivityJsInvokeParams(item, index, ctx);
    try {
      const result = await invokeActivityJsMethod(jsMethods.value, methodName, params);
      applyingJsResult.value = true;
      try {
        applyActivityJsInvokeResult(result, ctx);
      } finally {
        applyingJsResult.value = false;
      }
    } catch (e) {
      console.error(`JS method ${methodName} failed:`, e);
      message.warning(`JS方法 ${methodName} 执行失败`);
    }
  }

  return {
    invokeComponentJsMethod,
    jsMethodsLoading,
    jsMethodsReady,
    reloadJsMethods: loadJsMethods,
  };
}
