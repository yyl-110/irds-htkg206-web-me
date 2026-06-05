export interface PicFieldParts {
  fileId: string;
  fileName: string;
  newFileName: string;
}

export function parsePicField(value?: string): PicFieldParts {
  const parts = String(value ?? '').split(':');
  if (parts.length >= 3) {
    return {
      fileId: parts[0] ?? '',
      fileName: parts[1] ?? '',
      newFileName: parts[2] ?? '',
    };
  }
  return {
    fileId: '',
    fileName: '',
    newFileName: parts[0] ?? '',
  };
}

export function isEmptyPicField(value?: string): boolean {
  const parts = parsePicField(value);
  return !parts.fileId || !parts.fileName || !parts.newFileName;
}

export function formatPicField(fileId: string, fileName: string, newFileName: string): string {
  return `${fileId}:${fileName}:${newFileName}`;
}
