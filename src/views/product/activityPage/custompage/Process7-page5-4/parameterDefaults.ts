export interface Page5_4ParameterItem {
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

export function initCustomizedProcessPage7Data5_4(pageid: string): Page5_4ParameterItem[] {
  return [
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_SDJLSR',
      parameterId: '',
      defaultValue: '三相四线',
      propertyType: '1',
      pageId: pageid,
      inputName: '市电交流输入类型',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_SDJLSRV',
      parameterId: '',
      defaultValue: '380V',
      propertyType: '1',
      pageId: pageid,
      inputName: '市电交流输入额定电压（V）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_SDJLSRVF',
      parameterId: '',
      defaultValue: '380V±10%',
      propertyType: '1',
      pageId: pageid,
      inputName: '市电交流输入电压范围',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_SDJLSH',
      parameterId: '',
      defaultValue: '50Hz',
      propertyType: '1',
      pageId: pageid,
      inputName: '市电额定交流频率（Hz）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_SDJLSHF',
      parameterId: '',
      defaultValue: '50Hz±1.5Hz',
      propertyType: '1',
      pageId: pageid,
      inputName: '市电交流频率范围（Hz）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_GYZLEDDY',
      parameterId: '',
      defaultValue: '600V',
      propertyType: '1',
      pageId: pageid,
      inputName: '额定电压（V）',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DY1_1_7_GYZLEDDYF',
      parameterId: '',
      defaultValue: '600V±50V',
      propertyType: '1',
      pageId: pageid,
      inputName: '电压范围（V）',
    },
  ];
}

export function cloneParameterList(source: Page5_4ParameterItem[]): Page5_4ParameterItem[] {
  return JSON.parse(JSON.stringify(source)) as Page5_4ParameterItem[];
}
