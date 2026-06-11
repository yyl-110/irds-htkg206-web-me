export interface Page0_3ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  selectStr?: Array<{ label: string }>;
  selectStrVal?: Array<{ label: string }>;
  propertyType?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums?: string | number;
    rowData?: Array<Record<string, string>>;
  };
}

export function createDefaultPage0_3ParameterList(pageId = ''): Page0_3ParameterItem[] {
  return [
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '1',
      parameterNum: 'DJ1_1_GZFS',
      parameterId: '',
      defaultValue: '直线喷管',
      selectStr: [
        { label: '直线喷管' },
        { label: '直线非喷管' },
        { label: '旋转拨叉类' },
        { label: '旋转非拨叉类' },
      ],
      propertyType: '1',
      pageId,
      inputName: '舟它工作方式',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_SCLJ_MAX_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它最大输出力矩',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_SCLJ_ED_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '额定输出力矩',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_FZZS_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它负载转速（旋转）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_JXXC_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '机械行程（单边转角）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_KZZS_MAX_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '最大空载转速（旋转）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_EDGL_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它额定功率（旋转）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_DXLB_X',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '等效力臂（旋转）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_SCL_MAX_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它最大输出力',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_SCL_ED_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '额定输出力',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_FZZS_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它负载转速（直线）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_JXXC_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '机械行程（单边直线）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_KZZS_MAX_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '最大空载转速（直线）',
    },
    {
      inputOrOutput: '0',
      ifSingleLine: '1',
      inputType: '0',
      parameterNum: 'DJ1_1_EDGL_Z',
      parameterId: '',
      defaultValue: '',
      propertyType: '1',
      pageId,
      inputName: '舟它额定功率（直线）',
    },
  ];
}
