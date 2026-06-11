export interface Page1_2ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums?: string | number;
    rowData?: Array<Record<string, string>>;
  };
}

export function createDefaultPage1_2ParameterList(pageId = ''): Page1_2ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_1_GZFS',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它工作方式',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_5_MDJSQXS',
      parameterId: '',
      defaultValue: '直线',
      propertyType: '1',
      pageId,
      inputName: '舟它末端减速器形式',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_DXLB',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '等效力臂(mm)',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_JSQZH_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '减速器直线载荷',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_5_JSQZH_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '减速器旋转载荷',
    },
  ];
}
