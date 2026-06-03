export interface JsinvokeParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums: number;
    rowData: Record<string, unknown>[];
  };
}

export function createDefaultJsinvokeParameterList(pageId = ''): JsinvokeParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'PARAMETER1',
      parameterId: '',
      defaultValue: '10',
      pageId,
      inputName: '参数1',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'PARAMETER2',
      parameterId: '',
      defaultValue: '20',
      pageId,
      inputName: '参数2',
    },
    {
      inputOrOutput: '1',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'PARAMETER3',
      parameterId: '',
      defaultValue: '306',
      pageId,
      inputName: '参数3',
    },
  ];
}
