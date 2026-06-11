import type { Ref } from 'vue';
import { handleCutZero } from '@/utils/tools';
import type { Page1ParameterItem } from './parameterDefaults';

export interface Page1CalcContext {
  parameterTempList: Ref<Page1ParameterItem[]>;
  data: Ref<Array<Record<string, string>>>;
  data1: Ref<Array<Record<string, string>>>;
  data2: Ref<Array<Record<string, string>>>;
  trip: Ref<string>;
  onSaveBtnEnable: () => void;
}

export function createPage1Calculations(ctx: Page1CalcContext) {
  const { parameterTempList, data, data1, data2, trip, onSaveBtnEnable } = ctx;

  function setLocalData() {
    data.value = parameterTempList.value[0]?.tableMap?.rowData ?? [];
    data1.value = parameterTempList.value[1]?.tableMap?.rowData ?? [];
    trip.value = parameterTempList.value[2]?.defaultValue ?? '';
    data2.value = parameterTempList.value[3]?.tableMap?.rowData ?? [];
  }

  function resetParameterTempList() {
    if (parameterTempList.value[0]?.tableMap) {
      parameterTempList.value[0].tableMap.rowData = data.value;
      parameterTempList.value[0].tableMap.rowNums = String(data.value.length);
      parameterTempList.value[0].tableMap.colStr = ['p0', 'p1', 'p2'];
    }
    if (parameterTempList.value[1]?.tableMap) {
      parameterTempList.value[1].tableMap.rowData = data1.value;
      parameterTempList.value[1].tableMap.rowNums = String(data1.value.length);
      parameterTempList.value[1].tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
    }
    if (parameterTempList.value[2]) {
      parameterTempList.value[2].defaultValue = trip.value;
    }
    if (parameterTempList.value[3]?.tableMap) {
      parameterTempList.value[3].tableMap.rowData = data2.value;
      parameterTempList.value[3].tableMap.rowNums = String(data2.value.length);
      parameterTempList.value[3].tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
    }
  }

  function sumTrip() {
    const newList: string[] = [];
    data2.value.forEach(item => {
      newList.push(item.p4);
    });
    const maxStr = Math.max(...(newList as unknown as number[]));
    const minStr = Math.min(...(newList as unknown as number[]));
    trip.value = handleCutZero(Number(maxStr - minStr).toFixed(2));
  }

  function angleInput(str: Record<string, string>) {
    setLocalData();

    if (str.p0) {
      const val = (Number(str.p0) * Math.PI) / 180;
      data1.value[0]['p1'] = handleCutZero(val.toFixed(2));

      const parm1 = data.value[2].p1;
      const parm2 = data.value[2].p2;

      const val1 = Number(parm1) * Math.cos(val) - Number(parm2) * Math.sin(val);
      data1.value[0]['p2'] = handleCutZero(val1.toFixed(2));

      const val2 = Number(parm1) * Math.sin(val) + Number(parm2) * Math.cos(val);
      data1.value[0]['p3'] = handleCutZero(val2.toFixed(2));

      const parm3 = data.value[1].p1;
      const parm4 = data.value[1].p2;

      const p1 = val1 - Number(parm3);
      const p2 = val2 - Number(parm4);
      const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
      data1.value[0]['p4'] = handleCutZero(val3.toFixed(2));

      const val4 = val3 - val3;
      data1.value[0]['p5'] = handleCutZero(val4.toFixed(2));

      const val5 = (val1 * Number(parm4) - val2 * Number(parm3)) / val3;
      data1.value[0]['p6'] = handleCutZero(val5.toFixed(2));

      data2.value.forEach((item, index) => {
        changeInput5(index, item.p0);
      });
      resetParameterTempList();
    }
  }

  function changeInput1(str: string) {
    setLocalData();
    if (str) {
      const parm3 = str;
      const parm4 = data.value[1].p2;
      const val1 = Number(data.value[0]['p2']);
      const val2 = Number(data.value[0]['p3']);
      if (val1 && val2) {
        const p1 = val1 - Number(parm3);
        const p2 = val2 - Number(parm4);
        const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
        data.value[0]['p4'] = String(val3);

        const val4 = val3 - val3;
        data.value[0]['p5'] = String(val4);

        const val5 = (val1 * Number(parm4) - val2 * Number(parm3)) / val3;
        data.value[0]['p6'] = String(val5);

        data2.value.forEach((item, index) => {
          changeInput5(index, item.p0);
        });
      }
    }
    resetParameterTempList();
  }

  function changeInput2(str: string) {
    setLocalData();
    const parm1 = str;
    const parm2 = data.value[2].p2;
    const val = data.value[0]['p1'] + '';

    if (parm1 && parm2 && val) {
      const val1 = Number(parm1) * Math.cos(Number(val)) - Number(parm2) * Math.sin(Number(val));
      data.value[0]['p2'] = String(val1);

      const val2 = Number(parm1) * Math.sin(Number(val)) + Number(parm2) * Math.cos(Number(val));
      data.value[0]['p3'] = String(val2);

      const parm3 = data.value[1].p1;
      const parm4 = data.value[1].p2;

      const p1 = val1 - Number(parm3);
      const p2 = val2 - Number(parm4);
      const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
      data.value[0]['p4'] = String(val3);

      const val4 = val3 - val3;
      data.value[0]['p5'] = String(val4);

      const val5 = (val1 * Number(parm4) - val2 * Number(parm3)) / val3;
      data.value[0]['p6'] = String(val5);

      data2.value.forEach((item, index) => {
        changeInput5(index, item.p0);
      });
      resetParameterTempList();
    }
  }

  function changeInput3(str: string) {
    setLocalData();
    if (str) {
      const parm3 = data.value[1].p1;
      const parm4 = str;
      const val1 = data.value[0]['p2'] + '';
      const val2 = data.value[0]['p3'] + '';
      if (val1 && val2) {
        const p1 = Number(val1) - Number(parm3);
        const p2 = Number(val2) - Number(parm4);
        const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
        data.value[0]['p4'] = String(val3);

        const val4 = val3 - val3;
        data.value[0]['p5'] = String(val4);

        const val5 = (Number(val1) * Number(parm4) - Number(val2) * Number(parm3)) / val3;
        data.value[0]['p6'] = String(val5);

        data2.value.forEach((item, index) => {
          changeInput5(index, item.p0);
        });
      }
      resetParameterTempList();
    }
  }

  function changeInput4(str: string) {
    setLocalData();
    const parm1 = data.value[2].p1 + '';
    const parm2 = str;
    const val = data.value[0]['p1'] + '';

    if (parm1 && parm2 && val) {
      const val1 = Number(parm1) * Math.cos(Number(val)) - Number(parm2) * Math.sin(Number(val));
      data.value[0]['p2'] = String(val1);

      const val2 = Number(parm1) * Math.sin(Number(val)) + Number(parm2) * Math.cos(Number(val));
      data.value[0]['p3'] = String(val2);

      const parm3 = data.value[1].p1;
      const parm4 = data.value[1].p2;

      const p1 = val1 - Number(parm3);
      const p2 = val2 - Number(parm4);
      const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
      data.value[0]['p4'] = String(val3);

      const val4 = val3 - val3;
      data.value[0]['p5'] = String(val4);

      const val5 = (val1 * Number(parm4) - val2 * Number(parm3)) / val3;
      data.value[0]['p6'] = String(val5);

      data2.value.forEach((item, index) => {
        changeInput5(index, item.p0);
      });
      resetParameterTempList();
    }
  }

  function changeInput5(index: number, str: string) {
    setLocalData();

    const radian = handleCutZero(((Number(str) * Math.PI) / 180).toFixed(2));
    data2.value[index]['p1'] = radian;

    const parm1 = data.value[2].p1;
    const parm2 = data.value[2].p2;
    const parm3 = data.value[1].p1;
    const parm4 = data.value[1].p2;
    let parm5 = data1.value[0].p4;
    const parm6 = data1.value[0].p6;

    const str1 = Number(parm1) * Math.cos(Number(radian)) - Number(parm2) * Math.sin(Number(radian));
    data2.value[index]['p2'] = handleCutZero(str1.toFixed(2));

    const str2 = Number(parm1) * Math.sin(Number(radian)) + Number(parm2) * Math.cos(Number(radian));
    data2.value[index]['p3'] = handleCutZero(str2.toFixed(2));

    const str3 = Math.sqrt(Math.pow(str1 - Number(parm3), 2) + Math.pow(str2 - Number(parm4), 2));
    data2.value[index]['p4'] = handleCutZero(str3.toFixed(2));

    if (parm5 == '' || parm5 == undefined) {
      parm5 = '0';
    }
    const str4 = str3 - Number(parm5);
    data2.value[index]['p5'] = handleCutZero(str4.toFixed(2));

    const str5 = (str1 * Number(parm4) - str2 * Number(parm3)) / str3;
    data2.value[index]['p6'] = handleCutZero(str5.toFixed(2));

    if (parm6 != undefined && parm6 != '') {
      const str6 = str5 / Number(parm6);
      data2.value[index]['p7'] = handleCutZero(str6.toFixed(2));
    }
    sumTrip();
    resetParameterTempList();
  }

  function addRowData() {
    const str: Record<string, string> = {
      p0: '0',
      p1: '0',
      p2: '0',
      p3: '0',
      p4: '0',
      p5: '0',
      p6: '0',
      p7: '0',
      delIndex: String(data2.value.length),
    };
    setLocalData();
    data2.value.unshift({ ...str });
    data2.value.push({ ...str });
    resetParameterTempList();
    onSaveBtnEnable();
  }

  function delRow(selectList: Array<Record<string, string>>) {
    setLocalData();
    const rowData = [...data2.value];
    const checkColumnList = selectList;
    for (let i = 0; i < checkColumnList.length; i++) {
      for (let j = 0; j < rowData.length; j++) {
        if (checkColumnList[i].id != undefined) {
          if (checkColumnList[i].id == rowData[j].id) {
            rowData.splice(j, 1);
          }
        } else if (checkColumnList[i].delIndex == rowData[j].delIndex) {
          rowData.splice(j, 1);
        }
      }
    }
    data2.value = rowData;
    resetParameterTempList();
    onSaveBtnEnable();
  }

  function calc() {
    setLocalData();
    const str = parameterTempList.value[1]?.tableMap?.rowData?.[0];
    if (str?.p0) {
      const val = (Number(str.p0) * Math.PI) / 180;
      data1.value[0]['p1'] = handleCutZero(val.toFixed(2));

      const parm1 = data.value[2].p1;
      const parm2 = data.value[2].p2;

      const val1 = Number(parm1) * Math.cos(val) - Number(parm2) * Math.sin(val);
      data1.value[0]['p2'] = handleCutZero(val1.toFixed(2));

      const val2 = Number(parm1) * Math.sin(val) + Number(parm2) * Math.cos(val);
      data1.value[0]['p3'] = handleCutZero(val2.toFixed(2));

      const parm3 = data.value[1].p1;
      const parm4 = data.value[1].p2;

      const p1 = val1 - Number(parm3);
      const p2 = val2 - Number(parm4);
      const val3 = Math.sqrt(Math.pow(p1, 2) + Math.pow(p2, 2));
      data1.value[0]['p4'] = handleCutZero(val3.toFixed(2));

      const val4 = val3 - val3;
      data1.value[0]['p5'] = handleCutZero(val4.toFixed(2));

      const val5 = (val1 * Number(parm4) - val2 * Number(parm3)) / val3;
      data1.value[0]['p6'] = handleCutZero(val5.toFixed(2));

      data2.value.forEach((item, index) => {
        changeInput5(index, item.p0);
      });
      resetParameterTempList();
    }
  }

  return {
    setLocalData,
    resetParameterTempList,
    sumTrip,
    angleInput,
    changeInput1,
    changeInput2,
    changeInput3,
    changeInput4,
    changeInput5,
    addRowData,
    delRow,
    calc,
  };
}

export const PAGE1_INPUT_PARAMS_TABLE_NUM = 'DJ1_T_INPUTPARAMS';

export type Page1TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function getPage1TableColNums(tableMap?: Page1ParameterItem['tableMap']): number {
  const fromColNums = Number(tableMap?.colNums ?? 0);
  if (fromColNums > 0) return fromColNums;
  return tableMap?.colStr?.length ?? 0;
}

function mapPage1RowToCValueFormat(row: Record<string, string>, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：单行参数 + 计算输入参数表可编辑列（不含零位表、结果表） */
export function extractPage1SaveParamValues(list: Page1ParameterItem[]) {
  const result: Array<{ paramKey: string; paramName: string; paramValue: string }> = [];

  list.forEach(item => {
    if (item.ifSingleLine !== 't' && String(item.parameterNum ?? '').trim()) {
      result.push({
        paramKey: String(item.parameterNum),
        paramName: String(item.inputName ?? item.parameterNum),
        paramValue: String(item.defaultValue ?? ''),
      });
      return;
    }

    const tableNum = String(item.tableNum ?? '').trim();
    if (tableNum !== PAGE1_INPUT_PARAMS_TABLE_NUM || !item.tableMap?.rowData) return;

    item.tableMap.rowData.forEach(row => {
      for (const colIndex of [1, 2]) {
        const paramKey = String(row[`cellParentNum${colIndex}`] ?? '').trim();
        if (!paramKey) continue;
        result.push({
          paramKey,
          paramName: paramKey,
          paramValue: String(row[`p${colIndex}`] ?? ''),
        });
      }
    });
  });

  return result;
}

/** tables：带 componentId 的数据表格（零位表=3，结果表=4，page1 专用） */
export function extractPage1TableSavePayload(list: Page1ParameterItem[]): Page1TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = getPage1TableColNums(item.tableMap);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage1RowToCValueFormat(row, colNums));
      const rawId = String(item.componentId ?? '').trim();
      const numericId = Number(rawId);
      const componentId =
        rawId && !Number.isNaN(numericId) && String(numericId) === rawId ? numericId : item.componentId!;
      return {
        componentId,
        tableName: String(item.tableName ?? item.inputName ?? ''),
        values,
      };
    });
}
