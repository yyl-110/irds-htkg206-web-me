const MINIO_BASE = String(import.meta.env.VITE_MINIO_PREVIEW_URL ?? 'http://192.168.111.82:9000/irds/').replace(/\/?$/, '/');

function minioUrl(filename: string) {
  return `${MINIO_BASE}${filename}`;
}

/** 各行「检查方法」资源（与原 checkMethod 一致） */
export const CHECK_METHOD_URLS = [
  minioUrl('zjzc_jcff_1.mp4'),
  minioUrl('cjzc_jcff_2.pdf'),
  minioUrl('cjzc_jcff_3.pdf'),
  minioUrl('cjzc_jcff_4.pdf'),
  minioUrl('cjzc_jcff_5.pdf'),
];

/** 各行「示意图」资源（与原 viewSketchMap 一致） */
export const SKETCH_IMAGE_URLS = [
  minioUrl('cjzc_syt_1.png'),
  minioUrl('cjzc_syt_2.png'),
  minioUrl('cjzc_syt_3.jpg'),
  minioUrl('cjzc_syt_4.jpg'),
  minioUrl('cjzc_syt_5.png'),
];

export type MediaFileKind = 'pdf' | 'video' | 'image' | 'unknown';

export function matchFileType(fileName: string): MediaFileKind {
  const lower = String(fileName ?? '').toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (/\.(mp4|webm|ogg|mov)$/.test(lower)) return 'video';
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(lower)) return 'image';
  return 'unknown';
}

export function buildPdfViewerUrl(fileUrl: string) {
  return `/pdfjs-2.12.313/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
}
