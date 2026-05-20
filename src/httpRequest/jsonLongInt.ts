/**
 * 雪花 ID 等超过 JS 安全整数精度的字段，必须在 JSON.parse 之前把数字改成字符串，否则会先被舍入。
 * 见 {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER}
 */

/** `"key": 1234567890123456789` 中数字前的片段 */
const FIELD_LONG_INT = /"(\w+)":\s*(\d{16,})(?=\s*[,}\]])/g

function shouldQuoteLongIntFieldKey(key: string): boolean {
  return (
    key === 'id'
    || key === 'Id'
    || key.endsWith('Id')
    || key.endsWith('ID')
    || key.endsWith('_id')
    || key.endsWith('_Id')
  )
}

/**
 * 在 JSON 文本层把指定键后的超长整数改为字符串字面量，再交给 JSON.parse
 * @param jsonText
 */
export function quoteLongIntegerFieldsInJsonText(jsonText: string): string {
  return jsonText.replace(FIELD_LONG_INT, (full, key: string, digits: string) =>
    shouldQuoteLongIntFieldKey(key) ? `"${key}":"${digits}"` : full)
}

export function parseJsonPreservingLongIntegers(jsonText: string): unknown {
  return JSON.parse(quoteLongIntegerFieldsInJsonText(jsonText))
}
