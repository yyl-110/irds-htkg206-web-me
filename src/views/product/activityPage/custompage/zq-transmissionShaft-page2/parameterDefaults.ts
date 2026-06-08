export interface TransmissionShaftPage2ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
}

export const SHAFT_MODULE_CATEGORY_ID = '1249';
export const PIPE_MODULE_CATEGORY_ID = '1238';

export function createDefaultTransmissionShaftPage2ParameterList(pageId = ''): TransmissionShaftPage2ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_BH_CKCDZZC',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '参考传动轴编号',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_ZGNJ',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '轴管内径',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_ZGWJ',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '轴管外径',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_FJCD',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '附件长度',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '传动轴长度',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '新轴管长度',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_ZGBH',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '轴管编号',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'A31_CDZ_BH',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '传动轴编号',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '传动轴模型类型',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: '',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '轴管模型类型',
    },
  ];
}

export function cloneParameterList(source: TransmissionShaftPage2ParameterItem[]) {
  return source.map(item => ({ ...item }));
}

export const FORM_PARAM_COUNT = 8;
