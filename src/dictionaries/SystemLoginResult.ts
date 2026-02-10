import { BaseDictionary, BaseDictionaryItem } from './BaseDict'

/** 登录结果, 扩展默认的字典项类型 */
export class SystemLoginResultItem extends BaseDictionaryItem<number> {
  /** 对应的错误码, 仅在当前字典中使用 */
  errorCode: string = ''
}

export const SystemLoginResultDict = BaseDictionary.from<number, SystemLoginResultItem>({
  name: '登录结果',
  type: 'system_login_result',
  items: BaseDictionaryItem.fromItems<number, SystemLoginResultItem>(SystemLoginResultItem, [
    { label: '测试', value: 0, errorCode: '0' },
    { label: '未知异常', value: 100, errorCode: '100' },
    { label: '验证码不正确', value: 31, errorCode: '31' },
    { label: '验证码不存在', value: 30, errorCode: '30' },
    { label: '用户被禁用', value: 20, errorCode: '20' },
  ]),
})
