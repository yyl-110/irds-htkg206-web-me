export interface SelectOption {
  label: string;
  value?: string;
}

export interface Page1_3ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  selectStr?: SelectOption[];
  selectStrVal?: SelectOption[];
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums?: string | number;
    rowData?: Array<Record<string, string>>;
  };
}

export function createDefaultPage1_3ParameterList(pageId = ''): Page1_3ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_7_TXXS',
      parameterId: '',
      defaultValue: '数字',
      selectStr: [{ label: '数字' }, { label: '模拟' }],
      selectStrVal: [{ label: '数字' }, { label: '模拟' }],
      propertyType: '1',
      pageId,
      inputName: '通讯形式',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_7_SZTXXS',
      parameterId: '',
      defaultValue: '',
      selectStr: [
        { label: 'CAN' },
        { label: 'RS422' },
        { label: 'RS485' },
        { label: '1553B' },
        { label: '其它' },
      ],
      selectStrVal: [
        { label: 'CAN' },
        { label: 'RS422' },
        { label: 'RS485' },
        { label: '1553B' },
        { label: '其它' },
      ],
      propertyType: '1',
      pageId,
      inputName: '数字通讯形式',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_7_GL',
      parameterId: '',
      defaultValue: '',
      selectStrVal: [{ label: '隔离' }, { label: '不隔离' }],
      propertyType: '1',
      pageId,
      inputName: '是否隔离',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_7_YCXH',
      parameterId: '',
      defaultValue: '',
      selectStrVal: [{ label: '有遥测信号' }, { label: '无遥测信号' }],
      propertyType: '1',
      pageId,
      inputName: '有无遥测信号',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_7_XHDY_S',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '信号电压(V)(下限)',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_7_XHDY_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '信号电压(V)(上限)',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_7_FKDY_S',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '反馈电压(V)(下限)',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_7_FKDY_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '反馈电压(V)(上限)',
    },
  ];
}
