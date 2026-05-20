/**
 * 针对 https://github.com/xaboy/form-create-designer 封装的工具类
 */

import { isRef } from 'vue'

// 编码表单 Conf
export function encodeConf(designerRef: object) {
  // @ts-ignore
  return JSON.stringify(designerRef.value.getOption())
}

// 编码表单 Fields
export function encodeFields(designerRef: object) {
  // @ts-ignore
  const rule = JSON.parse(designerRef.value.getJson())
  const fields: string[] = []
  rule.forEach(item => {
    fields.push(JSON.stringify(item))
  })
  return fields
}

// 解码表单 Fields
export function decodeFields(fields: string[]) {
  if (!Array.isArray(fields) || fields.length === 0) {
    return []
  }
  const rule: object[] = []
  fields.forEach(item => {
    rule.push(JSON.parse(item))
  })
  return rule
}

// 设置表单的 Conf 和 Fields，适用 FcDesigner 场景
export function setConfAndFields(designerRef: object, conf: string, fields: string) {
  // @ts-ignore
  designerRef.value.setOption(JSON.parse(conf))
  // @ts-ignore
  designerRef.value.setRule(decodeFields(fields))
}

// 设置表单的 Conf 和 Fields，适用 form-create 场景
export function setConfAndFields2(
  detailPreview: object,
  conf: string | undefined | null,
  fields: string[] | undefined | null,
  value?: object,
) {
  let target: any = detailPreview
  if (isRef(detailPreview)) {
    target = detailPreview.value
  }
  if (conf == null || conf === '') {
    target.option = {}
  } else {
    try {
      target.option = typeof conf === 'string' ? JSON.parse(conf) : conf
    } catch {
      target.option = {}
    }
  }
  if (!Array.isArray(fields) || fields.length === 0) {
    target.rule = []
  } else {
    try {
      target.rule = decodeFields(fields)
    } catch {
      target.rule = []
    }
  }
  if (value) {
    target.value = value
  }
}
/**
 * 截取字符串
 *
 * @param str 字符串
 * @param start 开始位置
 * @param end 结束位置
 */

export function subString(str: string, start: number, end: number) {
  if (str.length > end) {
    return str.slice(start, end)
  }
  return str
}
