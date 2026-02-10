import { BaseDictionary, BaseDictionaryItem } from './BaseDict'

export const SystemUserSexDict = BaseDictionary.from({
  name: '用户性别',
  type: 'system_user_sex',
  items: BaseDictionaryItem.fromItems(BaseDictionaryItem, [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ]),
})
