import JSZip from 'jszip';

/** 文件属性「来源」中展示的文件来源字段名 */
export const SYSTEM_SOURCE_PROPERTY_NAME = '文件来源';
/** 文件属性「来源」中展示的文件来源字段值 */
export const SYSTEM_SOURCE_PROPERTY_VALUE = '快速设计系统';

const OFFICE_OPEN_XML_EXT = /\.(xlsx|xlsm|docx|docm|pptx|pptm)$/i;
const CUSTOM_FMTID = '{D5CDD505-2E9C-101B-9397-080020BFC665}';
const CUSTOM_REL_TYPE = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';
const CUSTOM_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';

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

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildCustomXml(propertyName: string, propertyValue: string, pid: number): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <property fmtid="${CUSTOM_FMTID}" pid="${pid}" name="${escapeXml(propertyName)}">
    <vt:lpwstr>${escapeXml(propertyValue)}</vt:lpwstr>
  </property>
</Properties>`;
}

function upsertCustomXmlProperty(existingXml: string | null, propertyName: string, propertyValue: string): string {
  if (!existingXml?.trim()) {
    return buildCustomXml(propertyName, propertyValue, 2);
  }

  const propertyPattern = new RegExp(
    `<property\\b[^>]*\\bname="${escapeRegExp(propertyName)}"[^>]*>[\\s\\S]*?</property>`,
    'i',
  );
  if (propertyPattern.test(existingXml)) {
    const valuePattern = new RegExp(
      `(<property\\b[^>]*\\bname="${escapeRegExp(propertyName)}"[^>]*>[\\s\\S]*?<vt:lpwstr>)([\\s\\S]*?)(</vt:lpwstr>)`,
      'i',
    );
    return existingXml.replace(valuePattern, `$1${escapeXml(propertyValue)}$3`);
  }

  let maxPid = 1;
  const pidRegex = /\bpid="(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = pidRegex.exec(existingXml)) !== null) {
    maxPid = Math.max(maxPid, Number.parseInt(match[1], 10));
  }
  const newProperty = `  <property fmtid="${CUSTOM_FMTID}" pid="${maxPid + 1}" name="${escapeXml(propertyName)}">
    <vt:lpwstr>${escapeXml(propertyValue)}</vt:lpwstr>
  </property>`;
  return existingXml.replace('</Properties>', `${newProperty}\n</Properties>`);
}

function ensureCustomXmlRelations(relsContent: string): string {
  if (relsContent.includes('custom-properties')) {
    return relsContent;
  }
  let maxId = 0;
  const idRegex = /Id="rId(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = idRegex.exec(relsContent)) !== null) {
    maxId = Math.max(maxId, Number.parseInt(match[1], 10));
  }
  const newRel = `<Relationship Id="rId${maxId + 1}" Type="${CUSTOM_REL_TYPE}" Target="docProps/custom.xml"/>`;
  return relsContent.replace('</Relationships>', `  ${newRel}\n</Relationships>`);
}

function ensureCustomContentType(contentTypesXml: string): string {
  if (contentTypesXml.includes('docProps/custom.xml')) {
    return contentTypesXml;
  }
  const override = `<Override PartName="/docProps/custom.xml" ContentType="${CUSTOM_CONTENT_TYPE}"/>`;
  return contentTypesXml.replace('</Types>', `  ${override}\n</Types>`);
}

function isZipArchive(buffer: ArrayBuffer): boolean {
  const view = new Uint8Array(buffer);
  return view.length >= 4 && view[0] === 0x50 && view[1] === 0x4b;
}

function isOfficeOpenXmlZip(zip: JSZip): boolean {
  if (!zip.file('[Content_Types].xml')) {
    return false;
  }
  return Boolean(
    zip.file('xl/workbook.xml')
    || zip.file('word/document.xml')
    || zip.file('ppt/presentation.xml'),
  );
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
 * 向 Office Open XML 文件（xlsx/docx/pptx 等）写入「文件来源：快速设计系统」自定义属性。
 * 非 Office 文件或无法识别为 Office 包时原样返回。
 */
export async function injectSystemSourceMetadata(
  input: Blob | ArrayBuffer | Uint8Array | ArrayBufferView,
  fileName?: string,
): Promise<Blob> {
  const buffer = await toArrayBuffer(input);
  if (fileName && !isOfficeOpenXmlFileName(fileName)) {
    return input instanceof Blob ? input : new Blob([buffer]);
  }
  if (!isZipArchive(buffer)) {
    return input instanceof Blob ? input : new Blob([buffer]);
  }

  const zip = await JSZip.loadAsync(buffer);
  if (!isOfficeOpenXmlZip(zip)) {
    return input instanceof Blob ? input : new Blob([buffer]);
  }

  const customPath = 'docProps/custom.xml';
  const existingCustom = (await zip.file(customPath)?.async('string')) ?? null;
  zip.file(
    customPath,
    upsertCustomXmlProperty(existingCustom, SYSTEM_SOURCE_PROPERTY_NAME, SYSTEM_SOURCE_PROPERTY_VALUE),
  );

  const relsPath = '_rels/.rels';
  const relsContent = await zip.file(relsPath)?.async('string');
  if (relsContent) {
    zip.file(relsPath, ensureCustomXmlRelations(relsContent));
  }

  const contentTypesPath = '[Content_Types].xml';
  const contentTypesXml = await zip.file(contentTypesPath)?.async('string');
  if (contentTypesXml) {
    zip.file(contentTypesPath, ensureCustomContentType(contentTypesXml));
  }

  const outBuffer = await zip.generateAsync({
    type: 'arraybuffer',
    compression: 'DEFLATE',
  });
  const mimeType = input instanceof Blob && input.type ? input.type : undefined;
  return mimeType ? new Blob([outBuffer], { type: mimeType }) : new Blob([outBuffer]);
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
