export interface Process7ParameterItem {
  ifSingleLine?: string;
  parameterId?: string;
  defaultValue?: string;
  tableMap?: {
    colNums?: number | string;
    rowData?: Array<Record<string, string | number | undefined>>;
  };
}

/** 流程页保存按钮联动（原各 customizedProcess7 页 setSaveBtnEnable） */
export function applyProcess7SaveBtnEnable(
  list: Process7ParameterItem[],
  inputOrOutput?: string,
  parameterId?: string | number,
  parameterValue?: string,
) {
  if (inputOrOutput === undefined || inputOrOutput === '1') return;
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
  if (parameterValue === undefined || parameterValue === null) return;

  list.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === String(parameterId)) {
        item.defaultValue = parameterValue;
      }
      return;
    }

    const colNums = Number(item.tableMap?.colNums ?? 0);
    if (colNums <= 0) return;

    item.tableMap?.rowData?.forEach(row => {
      for (let i = 0; i < colNums; i += 1) {
        if (row[`cellParameterId${i}`] === String(parameterId)) {
          row[`p${i}`] = parameterValue;
        }
      }
    });
  });
}
