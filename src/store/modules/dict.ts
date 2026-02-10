import { defineStore } from 'pinia';
// import { store } from '../index'
// import type { DictDataVO } from '@/api/system/dict/dict.data'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
// import { swaggerApi } from '@/httpRequest'

const { wsCache } = useCache('sessionStorage');
// import { listSimpleDictData } from '@/api/system/dict/dict.data'

/** 获取 dictType 对应的数据字典数组 */
export interface DictDataType {
  /** 数据类型 */
  dictType: string;
  label: string;
  value: string | number | boolean;
  colorType: string;
  cssClass: string;
}
export interface DictValueType {
  value: any;
  label: string;
  clorType?: string;
  cssClass?: string;
}
export interface DictTypeType {
  dictType: string;
  dictValue: DictValueType[];
}
export interface DictState {
  dictMap: { [key: string]: Array<DictDataType> };
  isSetDict: boolean;
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: {},
    isSetDict: false,
  }),
  getters: {
    getDictMap(): Recordable {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE);
      if (dictMap) this.dictMap = dictMap;

      return this.dictMap;
    },
    getIsSetDict(): boolean {
      return this.isSetDict;
    },
  },
  actions: {
    async setDictMap() {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE);
      if (dictMap) {
        this.dictMap = dictMap;
        this.isSetDict = true;
      } else {
        // const res = await listSimpleDictData()
        // const response = await swaggerApi.adminApi.getSimpleDictDataList()
        const response = await AdminApiSystemDictData.getSimpleDictDataList();
        const res = response.data.data;
        // 设置数据
        const dictDataMap: { [key: string]: any } = {};
        res?.forEach((dictData: any) => {
          // 获得 dictType 层级
          const enumValueObj = dictDataMap[dictData.dictType];
          if (!enumValueObj) dictDataMap[dictData.dictType] = [];

          // 处理 dictValue 层级
          dictDataMap[dictData.dictType].push({
            value: dictData.value,
            label: dictData.label,
            colorType: dictData.colorType,
            cssClass: dictData.cssClass,
          });
        });
        this.dictMap = dictDataMap;
        this.isSetDict = true;
        wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }); // 60 秒 过期
      }
    },
    getDictByType(type: string) {
      if (!this.isSetDict) this.setDictMap();

      return this.dictMap[type];
    },
    async resetDict() {
      wsCache.delete(CACHE_KEY.DICT_CACHE);
      // const response = await swaggerApi.adminApi.getSimpleDictDataList()
      const response = await AdminApiSystemDictData.getSimpleDictDataList();
      const res = response.data.data;
      // const res = await listSimpleDictData()
      // 设置数据
      const dictDataMap: { [key: string]: any } = {};
      res?.forEach((dictData: any) => {
        // 获得 dictType 层级
        const enumValueObj = dictDataMap[dictData.dictType];
        if (!enumValueObj) dictDataMap[dictData.dictType] = [];

        // 处理 dictValue 层级
        dictDataMap[dictData.dictType].push({
          value: dictData.value,
          label: dictData.label,
          colorType: dictData.colorType,
          cssClass: dictData.cssClass,
        });
      });
      this.dictMap = dictDataMap;
      this.isSetDict = true;
      wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }); // 60 秒 过期
    },
    getDictOptions(dictType: string, valueType?: 'int' | 'string' | 'boolean') {
      const dictOptions = this.getDictByType(dictType) || [];
      if (!valueType) return dictOptions;
      return dictOptions.map(item => {
        let value = item.value;
        switch (valueType) {
          case 'int':
            value = Number.parseInt(`${value}`);
            break;
          case 'string':
            value = `${value}`;
            break;
          case 'boolean':
            value = `${value}` === 'true';
            break;
        }
        return {
          ...item,
          value,
        };
      });
    },
    getIntDictOptions(dictType: string) {
      return this.getDictOptions(dictType, 'int');
    },
    getStrDictOptions(dictType: string) {
      return this.getDictOptions(dictType, 'string');
    },
    getBoolDictOptions(dictType: string) {
      return this.getDictOptions(dictType, 'boolean');
    },
    /**
     * 获得字典数据的文本展示
     * @param dictType 字典类型
     * @param value 字典数据的值
     */
    getDictLabel(dictType: string, value: any) {
      const dictOptions: DictDataType[] = this.getDictOptions(dictType);
      let dictLabel = '';
      dictOptions.forEach((dict: DictDataType) => {
        if (dict.value === value) dictLabel = dict.label;
      });
      return dictLabel;
    },
  },
});
