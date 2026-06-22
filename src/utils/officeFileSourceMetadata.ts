import JSZip from 'jszip';

/** 文件属性「来源 - 管理者」字段值 */
export const SYSTEM_SOURCE_PROPERTY_VALUE = '快速设计系统';
/** @deprecated 保留兼容，实际写入 app.xml 的 Manager 字段 */
export const SYSTEM_SOURCE_PROPERTY_NAME = '文件来源';

const OFFICE_OPEN_XML_EXT = /\.(xlsx|xlsm|docx|docm|pptx|pptm)$/i;
const APP_XML_PATH = 'docProps/app.xml';
const APP_REL_TYPE = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';
const APP_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';

export function isOfficeOpenXmlFileName(fileName: string): boolean {
  return OFFICE_OPEN_XML_EXT.test(String(fileName ?? '').trim());
}

function escapeXml(text: string): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function findZipEntryPath(zip: JSZip, pattern: RegExp): string | undefined {
  return Object.keys(zip.files).find((path) => pattern.test(path));
}

function isZipArchive(buffer: ArrayBuffer): boolean {
  const view = new Uint8Array(buffer);
  return view.length >= 4 && view[0] === 0x50 && view[1] === 0x4b;
}

function isOfficeOpenXmlZip(zip: JSZip): boolean {
  const contentTypesPath = findZipEntryPath(zip, /^\[Content_Types\]\.xml$/i);
  if (!contentTypesPath) {
    return false;
  }
  return Boolean(
    findZipEntryPath(zip, /^xl\/workbook\.xml$/i)
    || findZipEntryPath(zip, /^word\/document\.xml$/i)
    || findZipEntryPath(zip, /^ppt\/presentation\.xml$/i),
  );
}

function buildMinimalAppXml(managerValue: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Manager>${escapeXml(managerValue)}</Manager>
</Properties>`;
}

/** 写入或更新 app.xml 中的 Manager（对应 Windows 属性「管理者」） */
function upsertAppXmlManager(appXml: string | null, managerValue: string): string {
  const value = escapeXml(managerValue);
  if (!appXml?.trim()) {
    return buildMinimalAppXml(managerValue);
  }
  const managerPattern = /<Manager>[\s\S]*?<\/Manager>/i;
  if (managerPattern.test(appXml)) {
    return appXml.replace(managerPattern, `<Manager>${value}</Manager>`);
  }
  return appXml.replace('</Properties>', `  <Manager>${value}</Manager>\n</Properties>`);
}

function ensureAppXmlRelations(relsContent: string): string {
  if (relsContent.includes('extended-properties')) {
    return relsContent;
  }
  let maxId = 0;
  const idRegex = /Id="rId(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = idRegex.exec(relsContent)) !== null) {
    maxId = Math.max(maxId, Number.parseInt(match[1], 10));
  }
  const newRel = `<Relationship Id="rId${maxId + 1}" Type="${APP_REL_TYPE}" Target="docProps/app.xml"/>`;
  return relsContent.replace('</Relationships>', `  ${newRel}\n</Relationships>`);
}

function ensureAppContentType(contentTypesXml: string): string {
  if (contentTypesXml.includes('docProps/app.xml')) {
    return contentTypesXml;
  }
  const override = `<Override PartName="/docProps/app.xml" ContentType="${APP_CONTENT_TYPE}"/>`;
  return contentTypesXml.replace('</Types>', `  ${override}\n</Types>`);
}

export async function hasSystemSourceMetadata(input: Blob | ArrayBuffer | Uint8Array | ArrayBufferView): Promise<boolean> {
  try {
    const buffer = await toArrayBuffer(input);
    if (!isZipArchive(buffer)) {
      return false;
    }
    const zip = await JSZip.loadAsync(buffer);
    const appPath = findZipEntryPath(zip, /^docProps\/app\.xml$/i);
    if (!appPath) {
      return false;
    }
    const appXml = await zip.file(appPath)?.async('string');
    return /<Manager>\s*快速设计系统\s*<\/Manager>/i.test(appXml ?? '');
  } catch {
    return false;
  }
}

async function toArrayBuffer(input: Blob | ArrayBuffer | Uint8Array | ArrayBufferView): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) {
    return input;
  }
  if (ArrayBuffer.isView(input)) {
    return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer;
  }
  if (input instanceof Blob) {
    return input.arrayBuffer();
  }
  return input as ArrayBuffer;
}

/**
 * 向 Office Open XML 文件（xlsx/docx/pptx 等）的「管理者」字段写入「快速设计系统」。
 * 非 Office 文件或无法识别为 Office 包时原样返回。
 */
export async function injectSystemSourceMetadata(
  input: Blob | ArrayBuffer | Uint8Array | ArrayBufferView,
  _fileName?: string,
): Promise<Blob> {
  try {
    const buffer = await toArrayBuffer(input);
    if (!isZipArchive(buffer)) {
      return input instanceof Blob ? input : new Blob([buffer]);
    }

    const zip = await JSZip.loadAsync(buffer);
    if (!isOfficeOpenXmlZip(zip)) {
      return input instanceof Blob ? input : new Blob([buffer]);
    }

    const appPath = findZipEntryPath(zip, /^docProps\/app\.xml$/i) ?? APP_XML_PATH;
    const existingApp = (await zip.file(appPath)?.async('string')) ?? null;
    zip.file(appPath, upsertAppXmlManager(existingApp, SYSTEM_SOURCE_PROPERTY_VALUE));

    if (!existingApp?.trim()) {
      const relsPath = findZipEntryPath(zip, /^_rels\/\.rels$/i) ?? '_rels/.rels';
      const relsContent = await zip.file(relsPath)?.async('string');
      if (relsContent) {
        zip.file(relsPath, ensureAppXmlRelations(relsContent));
      }

      const contentTypesPath = findZipEntryPath(zip, /^\[Content_Types\]\.xml$/i) ?? '[Content_Types].xml';
      const contentTypesXml = await zip.file(contentTypesPath)?.async('string');
      if (contentTypesXml) {
        zip.file(contentTypesPath, ensureAppContentType(contentTypesXml));
      }
    }

    const outBuffer = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
    });
    const mimeType = input instanceof Blob && input.type ? input.type : undefined;
    return mimeType ? new Blob([outBuffer], { type: mimeType }) : new Blob([outBuffer]);
  } catch (error) {
    console.error('[injectSystemSourceMetadata] 写入管理者字段失败', error);
    return input instanceof Blob ? input : new Blob([await toArrayBuffer(input)]);
  }
}

export function extractFileNameFromUrl(url: string): string {
  const raw = String(url ?? '').trim();
  if (!raw) {
    return '';
  }
  try {
    const pathname = new URL(raw, window.location.origin).pathname;
    const seg = pathname.split('/').filter(Boolean).pop();
    return seg ? decodeURIComponent(seg) : '';
  } catch {
    const parts = raw.split('/').filter(Boolean);
    return decodeURIComponent(parts.pop() || '');
  }
}

export function extractFileIdFromUrl(url: string): string {
  const raw = String(url ?? '').trim();
  if (!raw) {
    return '';
  }
  try {
    const parsed = new URL(raw, window.location.origin);
    return String(parsed.searchParams.get('fileId') ?? parsed.searchParams.get('fileid') ?? '').trim();
  } catch {
    const match = /[?&]fileId=([^&]+)/i.exec(raw);
    return match ? decodeURIComponent(match[1]) : '';
  }
}
