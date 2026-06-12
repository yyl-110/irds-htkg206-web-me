import { downloadFile, newPreviewFile } from '@/api/common';
import { getAccessToken } from '@/utils/auth';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { ContentType, httpClient } from '@/api/tags/http-client';
import { WeiMessage } from '@/utils/WeiMessage';
/**
 * 文件流附件下载
 * @param data 文件流
 * @param fileName 附件名
 */
export function exportFile(data: any, fileName: string) {
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.href = URL.createObjectURL(data);
  document.body.appendChild(elink);
  elink.click(); // 点击下载
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}

// 下载数据
export function downloadFileFromStream(stream: any, fileName: string) {
  const blob = new Blob([stream], { type: 'application/octet-stream' });
  if (navigator.msSaveBlob) {
    // 兼容性处理，适用于 Internet Explorer 和 Edge
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Base64文件流附件下载--转Blob
 */
export function downloadBase64FileAsBlob(base64Data: any, fileName: any, mimeType: any) {
  // 将Base64转换为二进制数据
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Base64Url 转 File 对象
 * @param {string} base64Url - 完整的 Base64 字符串（如 data:image/png;base64,...）
 * @param {string} filename - 文件名（含后缀，如 'image.png'）
 * @returns {File} File 对象
 */
export function base64ToFile(base64Url: any, filename: any) {
  // 拆分 Base64 头部和编码内容
  const arr = base64Url.split(',');
  // 提取 MIME 类型（如 image/png）
  const mime = arr[0].match(/:(.*?);/)[1];
  // 解码 Base64 内容为二进制字符串
  const bstr = atob(arr[1]);
  // 创建 Uint8Array 存储二进制数据
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i); // 转换字符为 Unicode 编码
  }
  // 返回 File 对象（参数：数据数组、文件名、MIME 类型）
  return new File([u8arr], filename, { type: mime });
}

interface downLoadItem {
  queryId: string;
}
/**
 * 地址生成附件下载
 * @param params queryId
 * @param fileName 文件名
 */
export function handleDownload(params: downLoadItem, fileName: string) {
  downloadFile(params).then((res: any) => {
    const data = res.data;
    if (data.data) {
      const a = document.createElement('a');
      a.download = fileName;
      a.style.display = 'none';
      a.href = data.data;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(data.data);
    }
  });
}

interface preViewItem {
  fileId: string;
  token?: string;
}
/**
 *预览附件
 * @param params
 */
export function handlePreviewFile(params: preViewItem) {
  params.token = getAccessToken() as string;
  newPreviewFile(params).then((res: any) => {
    const data = res.data;
    if (data.code === 200) window.open(data.data);
  });
}

/**
 * 解密预览函数
 * @param fileId 文件id
 */
const dePreviewUrl = `/Api/file-storage/getSimFileByPath?fileId=`;
export function dePreviewFile(fileId: string) {
  return `${dePreviewUrl + fileId}&token=${getAccessToken()}`;
}

/**
 * 预览
 * @param fileId 文件id
 */
const onlinePrefix = '/Api/file-storage/downloadFile?fileId=';
export function previewUrlFile(fileId: string) {
  return `${onlinePrefix + fileId}&token=${getAccessToken()}`;
}

/**
 * 将 share/minio 绝对地址转为 pdf.js 可用的同源路径，避免跨域 CORS
 * @param rawUrl 列表 pdfUrl 或完整 share 地址
 * @param fileId 兜底：走网关下载（同源）
 */
export function normalizePdfViewerUrl(rawUrl: string, fileId?: string): string {
  const url = rawUrl?.trim();
  if (!url) {
    return fileId ? previewUrlFile(String(fileId)) : '';
  }
  if (url.startsWith('/share/') || url.startsWith('/Api/')) {
    return url;
  }
  try {
    const parsed = new URL(url);
    const shareIdx = parsed.pathname.indexOf('/share/');
    if (shareIdx >= 0) {
      return parsed.pathname.slice(shareIdx) + parsed.search;
    }
  } catch {
    if (!url.startsWith('/')) {
      return `/share/${url.replace(/^\/+/, '')}`;
    }
  }
  if (fileId) {
    return previewUrlFile(String(fileId));
  }
  return url;
}

/**
 * 预览水印pdf
 * @param fileId 文件id
 */
const pwatermarkPrefix = '/Api/file-storage/getSimFileWatermark?fileId=';
export function pwatermarkreviewUrlFile(fileId: string) {
  return `${pwatermarkPrefix + fileId}&token=${getAccessToken()}`;
}

/**
 * 公共预览服务
 * @param fileId
 */
export function kkFilePreview(fileId: string) {
  return new Promise(async (resolve, reject) => {
    const token = getAccessToken();
    try {
      const res = await AdminApiSystemUploadFile.showKkFileView({ fileId, token });
      if (`${res?.data?.code}` === '0') {
        resolve(res.data);
      } else {
        reject('预览失败');
      }
    } catch (err) {
      reject(`预览失败!${err}`);
    }
  });
}

interface downLoadEpcItem {
  fileId: string;
}

/**
 * 根据fileID下载附件
 * @param params
 * @param fileName
 */
export function handleEpcDownload(params: downLoadEpcItem, fileName: string) {
  AdminApiSystemUploadFile.downloadEpcFile(params).then((res: any) => {
    exportFile(res, fileName);
  });
}

/** 根据文件名下载附件 */
export function handleDownloadByFilename(filename: string) {
  if (!filename) return;
  AdminApiSystemUploadFile.downloadByFilename({ filename }).then((res: any) => {
    exportFile(res, filename);
  });
}

/**
 * 解析 upload.json 响应（兼容直接返回文件 DTO 与 CommonResult 包装）
 */
export function parseUploadFileResponse(raw: unknown): {
  ok: boolean;
  fileId: string;
  fileUrl: string;
  oldFileName: string;
  record: Record<string, unknown>;
  errMsg?: string;
} {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, fileId: '', fileUrl: '', oldFileName: '', record: {}, errMsg: '响应为空' };
  }
  const body = raw as Record<string, unknown>;
  const code = body.code;
  const successCodes: Array<number | string> = [0, 200, '0', '200'];
  if (code !== undefined && code !== null && !successCodes.includes(code as number | string)) {
    return { ok: false, fileId: '', fileUrl: '', oldFileName: '', record: {}, errMsg: String(body.msg ?? '上传失败') };
  }
  let record: Record<string, unknown> = body;
  const nested = body.data;
  if (nested && typeof nested === 'object' && (nested as Record<string, unknown>).id != null) {
    record = nested as Record<string, unknown>;
  } else if (body.id == null && body.queryId == null && nested && typeof nested === 'object') {
    record = nested as Record<string, unknown>;
  }
  const fileId = String(record.id ?? record.queryId ?? '').trim();
  if (!fileId) {
    return { ok: false, fileId: '', fileUrl: '', oldFileName: '', record: {}, errMsg: '未获取到上传文件ID' };
  }
  const fileUrl = String(record.fileUrl ?? record.filePath ?? record.url ?? '').trim();
  const oldFileName = String(
    record.oldFileName ?? record.oldfileName ?? record.fileName ?? record.documentName ?? '',
  ).trim();
  return { ok: true, fileId, fileUrl, oldFileName, record };
}
