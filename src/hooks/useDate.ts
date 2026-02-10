import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export type DateRangeParams = [ConfigType, ConfigType] | null

/**
 * 获取开始结束时间, 及其请求参数 computed 和参数处理方法
 * @param defaultValue 默认的时间范围
 */
export function useDateRangeParams(defaultValue: DateRangeParams = null) {
  /**
   * is empty date
   * @param date
   */
  const isEmptyDate = (date: ConfigType) => date === null || date === undefined

  const dateRange: Ref<DateRangeParams> = defaultValue
    ? ref([
      isEmptyDate(defaultValue[0]) ? undefined : dayjs(defaultValue[0]),
      isEmptyDate(defaultValue[1]) ? undefined : dayjs(defaultValue[1]),
    ])
    : ref(null)
  /**
   * to date params
   * @param date
   * @param endOfDay
   */
  const toDateParams = (date: ConfigType, endOfDay?: boolean) => {
    if (isEmptyDate(date))
      return
    let _date = dayjs(date)
    _date = endOfDay ? _date.endOf('day') : _date.startOf('day')
    return _date.format('YYYY-MM-DD HH:mm:ss')
  }
  /** 时间范围对应的请求参数 */
  const dateRangeParams = computed(() => {
    if (dateRange.value === null || isEmptyDate(dateRange.value[0]) || isEmptyDate(dateRange.value[1]))
      return undefined
    return [
      toDateParams(dateRange.value[0]) as string,
      toDateParams(dateRange.value[1], true) as string,
    ]
  })
  return {
    /** 开始 & 结束时间 */
    dateRange,
    /** 将时间范围参数转换为接口请求参数 */
    toDateParams,
    /** 时间范围对应的请求参数 */
    dateRangeParams,
  }
}
