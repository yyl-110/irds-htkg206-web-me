import dayjs from 'dayjs'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'

export const useRender = {
  /**
   * 渲染标签
   * @param text 标签文本
   * @param color 标签颜色
   * @returns 标签
   */
  renderTag: (text: any, color?: any) => {
    if (!color)
      return h(Tag, { color }, () => text)
    else
      return h('span', text)
  },
  /**
   * 渲染多标签
   * @param texts 文本
   * @returns 多标签
   */
  renderTags: (texts: string[]) => {
    if (texts) {
      return h('div', null, [
        texts.map((text) => {
          return h(Tag, null, () => text)
        }),
      ])
    }
    return ''
  },
  /**
   * 渲染日期
   * @param text 日期
   * @param format 格式化
   * @returns 格式化后日期
   */
  renderDate: (text: any, format?: any) => {
    if (!text)
      return ''

    if (!format)
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    else
      return dayjs(text).format(format)
  },

    /**
   * 渲染日期
   * @param text 日期
   * @param format 格式化
   * @returns 格式化后日期不带时分秒
   */
    renderDateNoTime: (text: any, format?: any) => {
      if (!text)
        return ''
  
      if (!format)
        return dayjs(text).format('YYYY-MM-DD')
      else
        return dayjs(text).format(format)
  },
    
  /**
   * 渲染文本，将text与val 拼接到一起
   * @param text 文本1
   * @param val 文本2
   * @returns 文本1 + 文本2
   */
  renderText: (text: any, val: any) => {
    if (text)
      return `${text} ${val}`
    else
      return ''
  },
}
