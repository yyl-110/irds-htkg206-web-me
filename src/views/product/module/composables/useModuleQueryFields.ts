/** 模型库默认查询区：使用文本输入的字段（propertyName） */
export const MODULE_QUERY_TEXT_FIELD_NAMES = new Set([
  '模型件号',
  '模型编码',
  '模型名称',
  '模型坐标系',
  'CAD计算重量',
]);

export function isModuleQueryTextField(propertyName: string): boolean {
  return MODULE_QUERY_TEXT_FIELD_NAMES.has(propertyName);
}
