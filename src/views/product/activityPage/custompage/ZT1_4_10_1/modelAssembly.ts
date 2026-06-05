import type { Zt1CabinetRow } from './parameterDefaults';

const MODEL_PARAM_DEFS: Array<{ name: string; field: keyof Zt1CabinetRow }> = [
  { name: 'SHEBEICANG_SKEL_X', field: 'p3' },
  { name: 'SHEBEICANG_SKEL_Y', field: 'p4' },
  { name: 'SHEBEICANG_SKEL_Z', field: 'p5' },
  { name: 'SHEBEICANG_SKEL_H', field: 'p6' },
  { name: 'SHEBEICANG_SKEL_W', field: 'p7' },
  { name: 'SHEBEICANG_SKEL_DEG1', field: 'p8' },
  { name: 'SHEBEICANG_SKEL_H1', field: 'p9' },
  { name: 'SHEBEICANG_SKEL_DEG2', field: 'p10' },
  { name: 'SHEBEICANG_SKEL_L', field: 'p11' },
];

export const TEMP_FILE_EXT = 'prt';

export function buildModelParametersStr(row: Zt1CabinetRow): string {
  return MODEL_PARAM_DEFS.map(({ name, field }) => {
    const value = row[field] ?? '';
    return `{"Name":"${name}","Type":"double","Value":"${value}","Description":""}`;
  }).join(',');
}

export function resolveTemplateFileName(templateName: string, ext = TEMP_FILE_EXT): string {
  if (!templateName) return '';
  return templateName.includes('.') ? templateName : `${templateName}.${ext}`;
}

export function extractZt1_4101SaveParamValues(
  list: Array<{ ifSingleLine?: string; parameterNum?: string; inputName?: string; defaultValue?: string; tableMap?: unknown }>,
) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];
  list.forEach(item => {
    if (item.ifSingleLine === 't' && item.tableMap) return;
    const key = String(item.parameterNum ?? '').trim();
    if (!key) return;
    result.push({
      paramKey: key,
      paramName: String(item.inputName ?? key),
      paramValue: String(item.defaultValue ?? ''),
    });
  });
  return result;
}
