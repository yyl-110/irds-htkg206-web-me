/**
 * 雪花 ID 在前端统一按字符串处理，避免 Number 精度丢失。
 */
export function toSnowflakeIdStr(id: unknown): string {
  if (id == null || id === '') return '';
  return String(id);
}

export function normalizeRowSnowflakeId<T extends { id?: unknown }>(row: T): T {
  if (row == null || row.id == null || row.id === '') {
    return row;
  }
  return { ...row, id: toSnowflakeIdStr(row.id) };
}

export function normalizeListSnowflakeIds<T extends { id?: unknown }>(list: T[]): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeRowSnowflakeId);
}
