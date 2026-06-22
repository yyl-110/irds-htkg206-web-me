import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';

/** 从活动/节点详情记录解析 JS 文件 ID */
export function resolveJsFileId(record: Record<string, any> | null | undefined): string {
  if (!record) return '';
  const direct = record.jsFileId ?? record.jsFileInfo?.fileId;
  if (direct != null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  const path = String(record.jsFilePath ?? record.jsFileInfo?.filePath ?? '').trim();
  if (!path) return '';
  const m = path.match(/[?&]fileId=([^&]+)/i);
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * 通过 system-service/fileManagerController/download.json 下载 JS 文本。
 * @see com.domed.system.controller.fileInfo.FileManagementController#download
 */
export async function fetchJsScriptText(fileId: string): Promise<string> {
  const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId } as any, { skipErrorNotify: true });
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
