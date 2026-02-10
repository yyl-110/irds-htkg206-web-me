import { sortBy } from 'lodash-es';
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import type { DictDataPageRequestDTOModel } from '@/api/models/DictDataPageRequestDTOModel';
import type { DictDataResponseDTOModel } from '@/api/models/DictDataResponseDTOModel';
import { DictDataSimpleResponseDTOModel } from '@/api/models/DictDataSimpleResponseDTOModel';
import { DictTypeSimpleResponseDTOModel } from '@/api/models/DictTypeSimpleResponseDTOModel';
import { AdminApiSystemDictData } from '@/api/tags/管理后台字典数据';
import { AdminApiSystemDictType } from '@/api/tags/管理后台字典类型';

export interface UseDictOptions {
  /**
   * 需要获取的字典类型
   * @description 可通过返回的 `dict` 获取字典类型及其数据
   */
  dictType?: string;
  /** 需要获取的所有字典类型 */
  dictTypes?: Array<string>;
  /** 是否直接更新所有字典数据 */
  updateAll?: boolean;
}

const defaultUseDictOptions: UseDictOptions = {};

/** 字典数据 DTO */
export class DictDataItemSimpleResponseDTOModel extends DictDataSimpleResponseDTOModel {
  /**
   * 从接口返回值创建
   * @param response response data
   */
  static fromResponse(response: DictDataSimpleResponseDTOModel) {
    const item = new DictDataItemSimpleResponseDTOModel();
    Object.assign(item, response);
    return item;
  }
}

/** 包含字典数据的字典类型 */
export class DictTypeItemSimpleResponseDTOModel extends DictTypeSimpleResponseDTOModel {
  /** 数据加载状态 */
  loadState: 'initial' | 'loading' | 'loaded' = 'initial';
  /**
   * 所有的字典数据
   * @description `key` 为字典数据 `value`, `value` 为字典数据
   */
  data: Record<string, DictDataItemSimpleResponseDTOModel> = {};
  /**
   * 获取指定字典数据值对应的 `label`
   * @param value 字典数据值
   */
  getLabel(value: string | number | boolean | undefined | null) {
    if (value === undefined || value === null) return '';
    const data = this.data[value.toString()];
    return data ? data.label : '';
  }

  /**
   * 所有的 data Map value keys
   * @description 值为字典数据的 `value`, 仅用于保持顺序(`object` 无法保持顺序)
   */
  dataValues: Set<string> = new Set();

  /** 所有的字典数据 `array` */
  get dataList() {
    const list: Array<DictDataItemSimpleResponseDTOModel> = [];
    for (const k of this.dataValues) list.push(this.data[k]);
    return list;
  }

  /** 所有的字典数据 `array`(`number`) */
  get numberDataList() {
    const list: Array<Omit<DictDataItemSimpleResponseDTOModel, 'value'> & { value: number }> = [];
    for (const k of this.dataValues) list.push({ ...this.data[k], value: Number(this.data[k].value) });
    return list;
  }

  /** 所有的字典数据 `array`(`boolean`) */
  get booleanDataList() {
    const list: Array<Omit<DictDataItemSimpleResponseDTOModel, 'value'> & { value: boolean }> = [];
    for (const k of this.dataValues) list.push({ ...this.data[k], value: this.data[k].value === 'true' });
    return list;
  }

  /** 所有的字典数据对应的 `a-select` 的 `options` 数据 */
  get dataOptions() {
    const list: Array<DictDataItemSimpleResponseDTOModel> = [];
    for (const k of this.dataValues) list.push(this.data[k]);
    return list;
  }

  /** 所有的字典数据对应的 `a-select` 的 `options` 数据(`number`) */
  get numberDataOptions(): Array<DefaultOptionType> {
    const options: Array<DefaultOptionType> = [];
    for (const k of this.dataValues) {
      const option: DefaultOptionType = { label: this.data[k].label, value: Number(this.data[k].value) };
      if (Number.isNaN(option.value)) throw new Error(`Invalid Value: ${this.data[k].value}`);
      options.push(option);
    }
    return options;
  }

  /**
   * 从接口返回值创建
   * @param response response data
   */
  static fromResponse(response: DictTypeSimpleResponseDTOModel) {
    const item = new DictTypeItemSimpleResponseDTOModel();
    Object.assign(item, response);
    return item;
  }
}

/** 字典数据 Map */
export type DictTypeMap = Record<string, DictTypeItemSimpleResponseDTOModel>;

/** 字典 Map 数据(缓存数据) */
const dictDataMapCache = ref<DictTypeMap>({});

/** 是否正在加载所有字典数据 */
const dictLoading = ref<boolean>(false);
/** 所有字典数据更新时间 */
const dictLoadingTime = ref<number>(0);
/** 所有字典数据更新时的路由 */
const dictLoadingRoutePath = ref<string>('');

/** 请求接口获取并保存所有字典数据 */
async function updateAllDictData() {
  const route = useRoute();
  // 路由未发生变化时, 优先使用缓存数据
  if (route.fullPath === dictLoadingRoutePath.value && dictLoadingTime.value !== 0) return dictDataMapCache.value;
  dictLoading.value = true;
  const dictDataMap: DictTypeMap = {};
  try {
    const [dataRes, typeRes] = await Promise.all([
      // AdminApiSystemDictData.getSimpleDictDataList(),
      AdminApiSystemDictType.getSimpleDictTypeList(),
    ]);
    for (const type of typeRes.data.data || []) {
      const item = DictTypeItemSimpleResponseDTOModel.fromResponse(type);
      if (!dictDataMap[item.type]) dictDataMap[item.type] = item;
    }
    for (const data of dataRes.data.data || []) {
      if (!dictDataMap[data.dictType]) {
        console.warn('Missing dict type: ', dictDataMap, data.dictType);
      } else {
        dictDataMap[data.dictType].data[data.value] = DictDataItemSimpleResponseDTOModel.fromResponse(data);
        dictDataMap[data.dictType].dataValues.add(data.value);
      }
    }
  } finally {
    dictLoading.value = false;
  }
  return (dictDataMapCache.value = dictDataMap);
}

/**
 * 请求分页接口获取所有字典数据
 * @param dictType 字典类型值
 */
async function getAllDictDataPage(dictType: string) {
  const pageSize = 100;
  const params: DictDataPageRequestDTOModel = { pageNo: 1, pageSize, dictType, status: 0 };
  const res = await AdminApiSystemDictData.getDictTypePage(params);
  if (!res.data.data) return;
  if (res.data.data.total > params.pageSize) {
    const dataList: Array<DictDataResponseDTOModel> = res.data.data.list;
    const requestParams = Array.from({ length: Math.floor(res.data.data.total / pageSize) - 1 }, (_, index) => {
      const _params: DictDataPageRequestDTOModel = { ...params, pageNo: index + 2, pageSize };
      return _params;
    });
    await Promise.all(
      requestParams.map(async p => {
        const res = await AdminApiSystemDictData.getDictTypePage(p);
        if (!res.data.data) return;
        dataList.push(...res.data.data.list);
      })
    );
    return dataList;
  } else {
    return res.data.data.list;
  }
}

/**
 * 生成空的字典数据
 * @param dictType 字典数据值
 */
function generateDictType(dictType: string) {
  if (dictDataMapCache.value[dictType]) return;
  dictDataMapCache.value[dictType] = new DictTypeItemSimpleResponseDTOModel();
  dictDataMapCache.value[dictType].type = dictType;
}

/**
 * 获取字典类型数据
 * @param dictType 字典类型
 */
async function fetchDictType(dictType: string) {
  const res = await AdminApiSystemDictType.pageDictTypes({ pageNo: 1, pageSize: 1, type: dictType });
  if (res.data.data && res.data.data.list.length) Object.assign(dictDataMapCache.value[dictType], res.data.data.list[0]);
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
async function fetchDictData(dictType: string) {
  const dictDataList = await getAllDictDataPage(dictType);
  if (dictDataList) {
    for (const data of sortBy(dictDataList, d => d.sort)) {
      dictDataMapCache.value[dictType].data[data.value] = data;
      dictDataMapCache.value[dictType].dataValues.add(data.value);
    }
  }
}

/**
 * 获取字典及其字典数据
 * @param dictType 字典类型值
 */
async function getDict(dictType: string) {
  if (dictDataMapCache.value[dictType] && dictDataMapCache.value[dictType].loadState === 'loading') return; // 忽略已获取完毕和正在获取的字典数据

  generateDictType(dictType);
  dictDataMapCache.value[dictType].loadState = 'loading';
  await Promise.all([fetchDictType(dictType), fetchDictData(dictType)]);
  dictDataMapCache.value[dictType].loadState = 'loaded';
}

/**
 * 更新指定的字典类型及其数据
 * @param dictTypes 字典类型值
 */
async function updateDictData(dictTypes: Array<string>) {
  if (dictTypes.length === 0) return;
  dictLoading.value = true;
  await Promise.all(dictTypes.map(type => getDict(type))).finally(() => (dictLoading.value = false));
}

/**
 * 字典数据处理 hook
 * @param options options
 */
export function useDict(options: UseDictOptions = defaultUseDictOptions) {
  // 获取所有字典数据
  if (options.updateAll) {
    updateAllDictData();
  } else if (options.dictTypes) {
    options.dictTypes.map(d => generateDictType(d));
    updateDictData(options.dictTypes);
  }

  if (options.dictType) {
    generateDictType(options.dictType);
    updateDictData([options.dictType]);
  }
  /** 当前字典类型及其数据 */
  const dict = computed(() => {
    const dict = new DictTypeItemSimpleResponseDTOModel();
    if (!options.dictType) return dict;

    dict.type = options.dictType;
    if (!dictDataMapCache.value[options.dictType]) console.error('Missing dict: ', options.dictType);
    return dictDataMapCache.value[options.dictType] || dict;
  });

  return {
    /** 当前字典类型及其数据 */
    dict,
    /** 是否正在加载所有字典数据 */
    dictLoading,
    /** 请求接口获取并保存所有字典数据 */
    updateAllDictData,
    /** 更新指定的字典类型及其数据 */
    updateDictData,
    /** 字典 Map 数据(缓存数据) */
    dictDataMapCache,
  };
}
