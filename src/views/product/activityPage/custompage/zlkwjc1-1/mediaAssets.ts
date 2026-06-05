const MINIO_BASE = String(import.meta.env.VITE_MINIO_PREVIEW_URL ?? 'http://192.168.111.82:9000/irds/').replace(/\/?$/, '/');

function minioUrl(filename: string) {
  return `${MINIO_BASE}${filename}`;
}

/** 各行「检查方法」PDF 资源 */
export const CHECK_METHOD_URLS = [
  minioUrl('cjzc_jcff_1.pdf'),
  minioUrl('cjzc_jcff_2.pdf'),
  minioUrl('cjzc_jcff_3.pdf'),
  minioUrl('cjzc_jcff_4.pdf'),
  minioUrl('cjzc_jcff_5.pdf'),
];

export type MediaFileKind = 'pdf' | 'image' | 'unknown';

export function matchFileType(fileName: string): MediaFileKind {
  const lower = String(fileName ?? '').toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(lower)) return 'image';
  return 'unknown';
}

export function buildPdfViewerUrl(fileUrl: string) {
  return `/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
}
