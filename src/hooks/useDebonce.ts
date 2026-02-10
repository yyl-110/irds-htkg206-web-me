/**
 * 防抖函数，通过指定延迟时间来限制函数的执行频率。
 *
 * @param func 需要防抖的函数
 * @param wait 延迟时间（毫秒）
 * @param immediate 是否立即执行函数，默认为 false
 * @returns 返回防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    const context = this

    if (immediate && !timeout) {
      func.apply(context, args)
    }

    clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }, wait)
  }
}
