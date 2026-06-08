export interface ZqFrameDesignPage2ParameterItem {
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

export const BEAM_MATERIAL_OPTIONS = [{ value: 'ZQS500L' }];
export const NOTCH_OPTIONS = [{ value: 'HOWO-TH' }];
export const REINFORCEMENT_LAYER_OPTIONS = [{ value: '1' }, { value: '2' }];

export function createDefaultZqFrameDesignPage2ParameterList(pageId = ''): ZqFrameDesignPage2ParameterItem[] {
  return [
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '车架前悬' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '车架后悬' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '驱动形式' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '主轴距(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '双联驱动桥轴距(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '纵梁长度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '250', propertyType: '1', pageId, inputName: '腹面高度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '翼面高度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '7', propertyType: '1', pageId, inputName: '纵梁厚度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '起点位置(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '角度(°)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '2', propertyType: '1', pageId, inputName: '加强梁层数' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '内加强梁厚度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: '', propertyType: '1', pageId, inputName: '外加强梁厚度(mm)' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: 'HOWO-TH', propertyType: '1', pageId, inputName: '前端切口' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: 'HOWO-TH', propertyType: '1', pageId, inputName: '后端切口' },
    { inputOrOutput: '0', ifSingleLine: '1', inputType: '0', parameterNum: '', parameterId: '', defaultValue: 'ZQS500L', propertyType: '1', pageId, inputName: '纵梁材料' },
  ];
}

export function cloneParameterList(source: ZqFrameDesignPage2ParameterItem[]): ZqFrameDesignPage2ParameterItem[] {
  return source.map(item => ({ ...item }));
}

export const PARAM_FIELD_COUNT = 17;
