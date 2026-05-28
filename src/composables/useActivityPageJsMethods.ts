import { ref, watch, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import { parseJsMethodNames } from '@/utils/parseJsMethods';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';

/** 从活动记录解析 JS 文件 ID */
function resolveJsFileId(record: Record<string, any> | null | undefined): string {
  if (!record) return '';
  const direct = record.jsFileId ?? record.jsFileInfo?.fileId;
  if (direct != null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  const path = String(record.jsFilePath ?? '').trim();
  if (!path) return '';
  const m = path.match(/[?&]fileId=([^&]+)/i);
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * 通过 system-service/fileManagerController/download.json 下载 JS 文本。
 * @see com.domed.system.controller.fileInfo.FileManagementController#download
 */
async function fetchJsScriptText(fileId: string): Promise<string> {
  const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId } as any);
  const raw = (res as any)?.data !== undefined ? (res as any).data : res;
  const blob = raw instanceof Blob ? raw : new Blob([raw ?? '']);
  let text = await blob.text();
  text = text.replace(/^\uFEFF/, '').trim();
  const trimmed = text;
  if (trimmed.startsWith('{') && trimmed.includes('"code"')) {
    try {
      const body = JSON.parse(trimmed) as { code?: number | string; msg?: string };
      const code = Number(body.code);
      if (Number.isFinite(code) && code !== 0 && code !== 200) {
        throw new Error(body.msg || '下载JS文件失败');
      }
    } catch (e) {
      if (e instanceof Error && e.message !== '下载JS文件失败') {
        throw e;
      }
    }
  }
  return text;
}

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
