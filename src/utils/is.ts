/**
 * @file copy to vben-admin
 */

const toString = Object.prototype.toString

/**
 * is
 * @param val
 * @param type
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/**
 * isDef
 * @param val
 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

/**
 * isUnDef
 * @param val
 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

/**
 * isObject
 * @param val
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/**
 * isEmpty
 * @param val
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val))
    return val.length === 0

  if (val instanceof Map || val instanceof Set)
    return val.size === 0

  if (isObject(val))
    return Object.keys(val).length === 0

  return false
}

/**
 * isDate
 * @param val
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/**
 * isNull
 * @param val
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * isNullAndUnDef
 * @param val
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/**
 * isNullOrUnDef
 * @param val
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/**
 * isNumber
 * @param val
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * isPromise
 * @param val
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * isString
 * @param val
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * isFunction
 * @param val
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

/**
 * isBoolean
 * @param val
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * isRegExp
 * @param val
 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

/**
 * isArray
 * @param val
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/**
 * isWindow
 * @param val
 */
export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * isElement
 * @param val
 */
export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

/**
 * isMap
 * @param val
 */
export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

/**
 * isUrl
 * @param path
 */
export function isUrl(path: string): boolean {
  const reg
    = /(((^https?:(?:\/\/)?)(?:[-:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??[-+=&%@.\w_]*#?\w*)?)$/
  return reg.test(path)
}

/** isDark */
export function isDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
