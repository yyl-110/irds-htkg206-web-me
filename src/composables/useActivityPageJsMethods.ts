import { ref, watch, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import { parseJsMethodNames } from '@/utils/parseJsMethods';
import { fetchJsScriptText, resolveJsFileId } from '@/utils/activityPageJsFile';

/**
 * 根据活动记录中的 jsFileId 加载 JS 并解析方法列表。
 */
export function useActivityPageJsMethods(record: Ref<Record<string, any>>) {
  const jsMethodOptions = ref<{ label: string; value: string }[]>([]);
  const jsMethodsLoading = ref(false);

  async function loadJsMethods() {
    const r = record.value || {};
    const fileId = resolveJsFileId(r);
    if (!fileId) {
      jsMethodOptions.value = [];
      return;
    }
    jsMethodsLoading.value = true;
    try {
      const text = await fetchJsScriptText(fileId);
      jsMethodOptions.value = parseJsMethodNames(text).map(name => ({ label: name, value: name }));
    } catch (e) {
      console.error('load js methods failed:', e, { fileId, record: r });
      jsMethodOptions.value = [];
      message.warning('JS脚本加载失败，请确认活动已上传JS文件且已保存');
    } finally {
      jsMethodsLoading.value = false;
    }
  }

  watch(
    () => [record.value?.jsFileId, record.value?.jsFilePath, record.value?.jsFileInfo?.fileId],
    () => {
      void loadJsMethods();
    },
    { immediate: true },
  );

  return { jsMethodOptions, jsMethodsLoading, reloadJsMethods: loadJsMethods };
}
