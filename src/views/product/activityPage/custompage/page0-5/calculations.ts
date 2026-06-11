import type { Ref } from 'vue';
import { handleCutZero } from '@/utils/tools';
import type { Page0_5ParameterItem } from './parameterDefaults';

export interface Page0_5CalcContext {
  parameterTempList: Ref<Page0_5ParameterItem[]>;
  data: Ref<Array<Record<string, string>>>;
  data1: Ref<Array<Record<string, string>>>;
  data2: Ref<Array<Record<string, string>>>;
  trip: Ref<string>;
  onSaveBtnEnable: () => void;
}

export function createPage0_5Calculations(ctx: Page0_5CalcContext) {
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
      parameterTempList.value[0].tableMap.colStr = ['p0', 'p1', 'p2', 'p3'];
    }
    if (parameterTempList.value[1]?.tableMap) {
      parameterTempList.value[1].tableMap.rowData = data1.value;
      parameterTempList.value[1].tableMap.rowNums = String(data1.value.length);
      parameterTempList.value[1].tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
    }
    if (parameterTempList.value[2]) {
      parameterTempList.value[2].defaultValue = trip.value;
    }
    if (parameterTempList.value[3]?.tableMap) {
      parameterTempList.value[3].tableMap.rowData = data2.value;
      parameterTempList.value[3].tableMap.rowNums = String(data2.value.length);
      parameterTempList.value[3].tableMap.colStr = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];
    }
  }

  function sumTrip() {
    const tableData2 = parameterTempList.value[3]?.tableMap?.rowData ?? [];
    const newList: string[] = [];
    tableData2.forEach(item => {
      newList.push(item.p4);
    });
    const maxStr = Math.max(...(newList as unknown as number[]));
    const minStr = Math.min(...(newList as unknown as number[]));
    trip.value = handleCutZero(Number(maxStr - minStr).toFixed(2));
    if (parameterTempList.value[3]?.tableMap) {
      parameterTempList.value[3].tableMap.rowData = tableData2;
    }
  }

  function angleInput1(index: number, str: string) {
    setLocalData();
    const tableData = parameterTempList.value[0]?.tableMap?.rowData ?? [];
    const tableData1 = parameterTempList.value[1]?.tableMap?.rowData ?? [];
    const tableData2 = parameterTempList.value[3]?.tableMap?.rowData ?? [];
    const parm = tableData[0]?.p2;
    const parm1 = tableData[1]?.p2;
    const parm2 = tableData[2]?.p2;
    const parm3 = tableData[3]?.p2;
    const parm4 = tableData1[0]?.p4;

    const radian = handleCutZero((((Number(str) + Number(parm2)) * Math.PI) / 180).toFixed(2));
    if (!isNaN(Number(radian))) {
      tableData2[index]['p1'] = radian;
    }

    const val = Number(parm) * Math.cos(Number(radian));
    if (!isNaN(val)) {
      tableData2[index]['p2'] = handleCutZero(val.toFixed(2));
    }

    const val1 = Number(parm) * Math.sin(Number(radian));
    if (!isNaN(val1)) {
      tableData2[index]['p3'] = handleCutZero(val1.toFixed(2));
    }

    const val2 = val1 - Math.sqrt(Math.pow(Number(parm1), 2) - Math.pow(val - Number(parm3), 2));
    if (!isNaN(val2)) {
      tableData2[index]['p4'] = handleCutZero(val2.toFixed(2));
    }

    const val3 = val2 - Number(parm4);
    if (!isNaN(val3)) {
      tableData2[index]['p5'] = handleCutZero(val3.toFixed(2));
    }

    const val4 = Math.asin(Math.abs(val - Number(parm3)) / Number(parm1));
    if (!isNaN(val4)) {
      tableData2[index]['p6'] = handleCutZero(val4.toFixed(2));
    }

    const val5 = Math.abs(val4 - Number(radian));
    if (!isNaN(val5)) {
      tableData2[index]['p7'] = handleCutZero(val5.toFixed(2));
    }

    const val7 = Math.cos(val5) / Math.cos(val4);
    if (!isNaN(val7)) {
      tableData2[index]['p9'] = handleCutZero(val7.toFixed(3));
    }

    const val6 = Number(parm) * val7;
    if (!isNaN(val6)) {
      tableData2[index]['p8'] = handleCutZero(val6.toFixed(2));
    }

    if (parameterTempList.value[3]?.tableMap) {
      parameterTempList.value[3].tableMap.rowData = tableData2;
    }
    sumTrip();
    resetParameterTempList();
  }

  function angleInput(str: string) {
    setLocalData();
    const tableData = parameterTempList.value[0]?.tableMap?.rowData ?? [];
    const tableData1 = parameterTempList.value[1]?.tableMap?.rowData ?? [];
    const tableData2 = parameterTempList.value[3]?.tableMap?.rowData ?? [];
    const parm = tableData[0]?.p2;
    const parm1 = tableData[1]?.p2;
    const parm2 = tableData[2]?.p2;
    const parm3 = tableData[3]?.p2;

    if (str) {
      const val = ((Number(str) + Number(parm2)) * Math.PI) / 180;
      if (!isNaN(val)) {
        tableData1[0]['p1'] = handleCutZero(val.toFixed(2));
      }

      const val1 = Number(parm) * Math.cos(val);
      if (!isNaN(val1)) {
        tableData1[0]['p2'] = handleCutZero(val1.toFixed(2));
      }

      const val2 = Number(parm) * Math.sin(val);
      if (!isNaN(val2)) {
        tableData1[0]['p3'] = handleCutZero(val2.toFixed(2));
      }

      const val3 = val2 - Math.sqrt(Math.pow(Number(parm1), 2) - Math.pow(val1 - Number(parm3), 2));
      if (!isNaN(val3)) {
        tableData1[0]['p4'] = handleCutZero(val3.toFixed(2));
      }

      const val4 = val3 - val3;
      if (!isNaN(val4)) {
        tableData1[0]['p5'] = handleCutZero(val4.toFixed(2));
      }

      const val5 = Math.asin(Math.abs(val1 - Number(parm3)) / Number(parm1));
      if (!isNaN(val5)) {
        tableData1[0]['p6'] = handleCutZero(val5.toFixed(2));
      }

      const val6 = Math.abs(val5 - val);
      if (!isNaN(val5)) {
        tableData1[0]['p7'] = handleCutZero(val6.toFixed(2));
      }

      const val8 = Math.cos(val6) / Math.cos(val5);
      if (!isNaN(val8)) {
        tableData1[0]['p9'] = handleCutZero(val8.toFixed(3));
      }

      const val7 = Number(parm) * val8;
      if (!isNaN(val7)) {
        tableData1[0]['p8'] = handleCutZero(val7.toFixed(2));
      }

      if (parameterTempList.value[1]?.tableMap) {
        parameterTempList.value[1].tableMap.rowData = tableData1;
      }

      tableData2.forEach((item, index) => {
        angleInput1(index, item.p0);
      });
      resetParameterTempList();
    }
  }

  function runChangeInput(
    str: string,
    pickParm: (tableData: Array<Record<string, string>>, tableData1: Array<Record<string, string>>) => {
      parm: string | undefined;
      parm1: string | undefined;
      parm2: string | undefined;
      parm3: string | undefined;
      parm4: string | undefined;
      parm5: string | undefined;
      parm6: string | undefined;
    },
  ) {
    setLocalData();
    const tableData = parameterTempList.value[0]?.tableMap?.rowData ?? [];
    const tableData1 = parameterTempList.value[1]?.tableMap?.rowData ?? [];
    const tableData2 = parameterTempList.value[3]?.tableMap?.rowData ?? [];
    let { parm, parm1, parm2, parm3, parm4, parm5, parm6 } = pickParm(tableData, tableData1);

    if (parm1 === '' && parm1 === undefined) {
      parm1 = '0';
    }
    if (parm3 === '' && parm3 === undefined) {
      parm3 = '0';
    }
    if (parm4 === '' && parm4 === undefined) {
      parm4 = '0';
    }
    if (parm5 === '' && parm5 === undefined) {
      parm5 = '0';
    }

    const val = ((Number(parm6) + Number(parm2)) * Math.PI) / 180;
    if (!isNaN(val)) {
      tableData1[0]['p1'] = handleCutZero(val.toFixed(2));
    }

    const val1 = Number(parm) * Math.cos(Number(parm5));
    if (!isNaN(val1)) {
      tableData1[0]['p2'] = handleCutZero(val1.toFixed(2));
    }

    const val2 = Number(parm) * Math.sin(Number(parm5));
    if (!isNaN(val2)) {
      tableData1[0]['p3'] = handleCutZero(val2.toFixed(2));
    }

    const val3 = val2 - Math.sqrt(Math.pow(Number(parm1), 2) - Math.pow(val1 - Number(parm3), 2));
    if (!isNaN(val3)) {
      tableData1[0]['p4'] = handleCutZero(val3.toFixed(2));
    }

    const val4 = val3 - val3;
    if (!isNaN(val4)) {
      tableData1[0]['p5'] = handleCutZero(val4.toFixed(2));
    }

    const val5 = Math.asin(Math.abs(val1 - Number(parm3)) / Number(parm1));
    if (!isNaN(val5)) {
      tableData1[0]['p6'] = handleCutZero(val5.toFixed(2));
    }

    const val6 = Math.abs(val5 - val);
    if (!isNaN(val6)) {
      tableData1[0]['p7'] = handleCutZero(val6.toFixed(2));
    }

    const val8 = Math.cos(val6) / Math.cos(val5);
    if (!isNaN(val8)) {
      tableData1[0]['p9'] = handleCutZero(val8.toFixed(3));
    }

    const val7 = Number(parm) * val8;
    if (!isNaN(val7)) {
      tableData1[0]['p8'] = handleCutZero(val7.toFixed(2));
    }

    if (parameterTempList.value[1]?.tableMap) {
      parameterTempList.value[1].tableMap.rowData = tableData1;
    }

    tableData2.forEach((item, index) => {
      angleInput1(index, item.p0);
    });
    resetParameterTempList();
    void str;
  }

  function changeInput(str: string) {
    runChangeInput(str, (tableData, tableData1) => ({
      parm: str,
      parm1: tableData[1]?.p2,
      parm2: tableData[2]?.p2,
      parm3: tableData[3]?.p2,
      parm4: tableData1[0]?.p4,
      parm5: tableData1[0]?.p1,
      parm6: tableData1[0]?.p0,
    }));
  }

  function changeInput1(str: string) {
    runChangeInput(str, (tableData, tableData1) => ({
      parm: tableData[0]?.p2,
      parm1: str,
      parm2: tableData[2]?.p2,
      parm3: tableData[3]?.p2,
      parm4: tableData1[0]?.p4,
      parm5: tableData1[0]?.p1,
      parm6: tableData1[0]?.p0,
    }));
  }

  function changeInput2(str: string) {
    runChangeInput(str, (tableData, tableData1) => ({
      parm: tableData[0]?.p2,
      parm1: tableData[1]?.p2,
      parm2: str,
      parm3: tableData[3]?.p2,
      parm4: tableData1[0]?.p4,
      parm5: tableData1[0]?.p1,
      parm6: tableData1[0]?.p0,
    }));
  }

  function changeInput3(str: string) {
    runChangeInput(str, (tableData, tableData1) => ({
      parm: tableData[0]?.p2,
      parm1: tableData[1]?.p2,
      parm2: tableData[2]?.p2,
      parm3: str,
      parm4: tableData1[0]?.p4,
      parm5: tableData1[0]?.p1,
      parm6: tableData1[0]?.p0,
    }));
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
      p8: '0',
      p9: '0',
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
    const columnData = [...data2.value];
    const checkColumnList = selectList;
    for (let i = 0; i < checkColumnList.length; i++) {
      for (let j = 0; j < columnData.length; j++) {
        if (checkColumnList[i].id != undefined) {
          if (checkColumnList[i].id == columnData[j].id) {
            columnData.splice(j, 1);
          }
        } else if (checkColumnList[i].delIndex == columnData[j].delIndex) {
          columnData.splice(j, 1);
        }
      }
    }
    data2.value = columnData;
    resetParameterTempList();
    onSaveBtnEnable();
  }

  function calc() {
    setLocalData();
    const tableData = parameterTempList.value[0]?.tableMap?.rowData ?? [];
    const tableData1 = parameterTempList.value[1]?.tableMap?.rowData ?? [];
    const tableData2 = parameterTempList.value[3]?.tableMap?.rowData ?? [];
    const parm = tableData[0]?.p2;
    const parm1 = tableData[1]?.p2;
    const parm2 = tableData[2]?.p2;
    const parm3 = tableData[3]?.p2;
    const str = tableData1[1] as unknown as string;
    const parm4 = tableData1[0]?.p4;
    const index = 0;

    const radian = handleCutZero((((Number(str) + Number(parm2)) * Math.PI) / 180).toFixed(2));
    if (!isNaN(Number(radian))) {
      tableData2[index]['p1'] = radian;
    }

    const val = Number(parm) * Math.cos(Number(radian));
    if (!isNaN(val)) {
      tableData2[index]['p2'] = handleCutZero(val.toFixed(2));
    }

    const val1 = Number(parm) * Math.sin(Number(radian));
    if (!isNaN(val1)) {
      tableData2[index]['p3'] = handleCutZero(val1.toFixed(2));
    }

    const val2 = val1 - Math.sqrt(Math.pow(Number(parm1), 2) - Math.pow(val - Number(parm3), 2));
    if (!isNaN(val2)) {
      tableData2[index]['p4'] = handleCutZero(val2.toFixed(2));
    }

    const val3 = val2 - Number(parm4);
    if (!isNaN(val3)) {
      tableData2[index]['p5'] = handleCutZero(val3.toFixed(2));
    }

    const val4 = Math.asin(Math.abs(val - Number(parm3)) / Number(parm1));
    if (!isNaN(val4)) {
      tableData2[index]['p6'] = handleCutZero(val4.toFixed(2));
    }

    const val5 = Math.abs(val4 - Number(radian));
    if (!isNaN(val5)) {
      tableData2[index]['p7'] = handleCutZero(val5.toFixed(2));
    }

    const val7 = Math.cos(val5) / Math.cos(val4);
    if (!isNaN(val7)) {
      tableData2[index]['p9'] = handleCutZero(val7.toFixed(3));
    }

    const val6 = Number(parm) * val7;
    if (!isNaN(val6)) {
      tableData2[index]['p8'] = handleCutZero(val6.toFixed(2));
    }

    if (parameterTempList.value[3]?.tableMap) {
      parameterTempList.value[3].tableMap.rowData = tableData2;
    }
    sumTrip();
    resetParameterTempList();
  }

  return {
    setLocalData,
    resetParameterTempList,
    sumTrip,
    angleInput,
    angleInput1,
    changeInput,
    changeInput1,
    changeInput2,
    changeInput3,
    addRowData,
    delRow,
    calc,
  };
}

/** 顶部输入参数表 tableNum，仅该表的可编辑列进入 values */
export const PAGE0_5_INPUT_PARAMS_TABLE_NUM = 'DJ1-1_T_INPUTPARAMS';

export type Page0_5TableSaveRow = {
  componentId: string | number;
  tableName: string;
  values: Array<Record<string, string>>;
};

function mapPage0_5RowToCValueFormat(row: Record<string, string>, colNums: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < colNums; i++) {
    const val = String(row[`p${i}`] ?? '');
    if (val !== '') result[`c${i + 1}`] = val;
  }
  return result;
}

/** values：单行参数 + 顶部输入框（不含两个数据表格） */
export function extractPage0_5SaveParamValues(list: Page0_5ParameterItem[]) {
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
    if (tableNum !== PAGE0_5_INPUT_PARAMS_TABLE_NUM || !item.tableMap?.rowData) return;

    item.tableMap.rowData.forEach(row => {
      const paramKey = String(row.cellParentNum2 ?? row[`cellParentNum2`] ?? '').trim();
      if (!paramKey) return;
      const label = `${row.p0 ?? ''}${row.p1 ?? ''}`.trim();
      result.push({
        paramKey,
        paramName: label || paramKey,
        paramValue: String(row.p2 ?? ''),
      });
    });
  });

  return result;
}

/** tables：带 componentId 的数据表格（零位表=1，行程计算表=2） */
export function extractPage0_5TableSavePayload(list: Page0_5ParameterItem[]): Page0_5TableSaveRow[] {
  return list
    .filter(item => item.ifSingleLine === 't' && item.tableMap && item.componentId != null && item.componentId !== '')
    .map(item => {
      const colNums = Number(item.tableMap?.colNums ?? 0);
      const rowData = item.tableMap?.rowData ?? [];
      const values = rowData.map(row => mapPage0_5RowToCValueFormat(row, colNums));
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
