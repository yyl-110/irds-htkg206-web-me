import { handleCutZero } from '@/utils/tools';

import type { HighVoltageDCbusRow, HighVoltageDCbusTableContext } from './types';

export function onPowerChange(row: HighVoltageDCbusRow, event: string, ctx: HighVoltageDCbusTableContext) {
  if (row.a1 === '低压直流') {
    ctx.data2.forEach(item => {
      if (item.a2 === row.a2 && item.a1 === '各低压直流供电支路对应的高压直流输入功率') {
        if (row.a4 !== '' && row.a4 != undefined && event !== '') {
          item.a3 = handleCutZero((Number(event) / Number(row.a4)).toFixed(3));
        } else {
          item.a3 = '';
        }
      }
    });
    summarizeCabinetInput(ctx);
    summarizeHvdcEquipment(ctx);
  } else {
    ctx.data2.forEach(item => {
      if (item.a2 === row.a2 && item.a1 === '高压直流用电设备功率') {
        item.a3 = event;
      }
    });
    summarizeHvdcEquipment(ctx);
  }
}

export function onModuleEfficiencyChange(row: HighVoltageDCbusRow, event: string, ctx: HighVoltageDCbusTableContext) {
  if (row.a1 !== '低压直流') return;

  ctx.data2.forEach(item => {
    if (item.a2 === row.a2 && item.a1 === '各低压直流供电支路对应的高压直流输入功率') {
      if (row.a3 !== '' && row.a3 != undefined && event !== '') {
        item.a3 = handleCutZero((Number(row.a3) / Number(event)).toFixed(3));
      } else {
        item.a3 = '';
      }
    }
  });
  summarizeCabinetInput(ctx);
  summarizeHvdcEquipment(ctx);
}

export function onRatedVoltageChange(row: HighVoltageDCbusRow, event: string, ctx: HighVoltageDCbusTableContext) {
  ctx.data2.forEach(item => {
    if (row.a1 === '低压直流' && item.a2 === row.a2 && item.a1 === '各低压直流供电支路对应的高压直流输入功率') {
      if (row.a5 !== '' && row.a5 != undefined && event !== '') {
        item.a4 = event;
      }
    } else if (row.a1 === '高压直流' && item.a2 === '第1路' && item.a1 === '高压直流用电设备功率') {
      if (row.a5 !== '' && row.a5 != undefined && event !== '') {
        item.a4 = event;
      }
    } else if (item.a1 === '高压直流母线总输出功率') {
      if (row.a5 !== '' && row.a5 != undefined && event !== '') {
        item.a4 = event;
      }
    }
  });
}

function summarizeCabinetInput(ctx: HighVoltageDCbusTableContext) {
  let sumVal = 0;
  ctx.data2.forEach(item => {
    if (item.a1 === '电源机柜总输入功率（高压DC/DC模块总输入功率）') {
      item.a3 = handleCutZero(Number(sumVal).toFixed(3));
    } else if (item.a1 === '各低压直流供电支路对应的高压直流输入功率') {
      sumVal += Number(item.a3);
    }
  });
}

function summarizeHvdcEquipment(ctx: HighVoltageDCbusTableContext) {
  let sumVal = 0;
  ctx.data2.forEach(item => {
    if (item.a1 === '高压直流用电设备功率') {
      sumVal += Number(item.a3);
    }
  });
  applyHvdcEquipmentTotal(sumVal, ctx);
}

function applyHvdcEquipmentTotal(sumVal: number, ctx: HighVoltageDCbusTableContext) {
  let sumOutputPower = 0;
  ctx.data2.forEach(item => {
    if (item.a1 === '高压直流用电设备总功率') {
      item.a3 = handleCutZero(Number(sumVal).toFixed(3));
      sumOutputPower += Number(item.a3);
    } else if (item.a1 === '电源机柜总输入功率（高压DC/DC模块总输入功率）') {
      sumOutputPower = Number(sumOutputPower) + Number(item.a3);
    }
  });
  applyHvdcBusTotalOutput(sumOutputPower, ctx);
}

function applyHvdcBusTotalOutput(sumOutputPower: number, ctx: HighVoltageDCbusTableContext) {
  ctx.data2.forEach(item => {
    if (item.a1 === '高压直流母线总输出功率') {
      item.a3 = handleCutZero(Number(sumOutputPower).toFixed(3));
    }
  });
  applyTotalAcInput(sumOutputPower, ctx);
}

function applyTotalAcInput(sumOutputPower: number, ctx: HighVoltageDCbusTableContext) {
  if (ctx.rectifierEfficiency == null) return;
  const efficiency = Number(ctx.rectifierEfficiency);
  if (!efficiency) return;

  ctx.data2.forEach(item => {
    if (item.a1 === '总交流输入功率') {
      item.a3 = handleCutZero((sumOutputPower / efficiency).toFixed(3));
    }
  });
}

export function applyRectifierEfficiencyChange(rectifierEfficiency: number | null, ctx: HighVoltageDCbusTableContext) {
  if (rectifierEfficiency == null) return;

  const efficiency = Number(rectifierEfficiency);
  if (!efficiency) return;

  let busOutputPower = 0;
  ctx.data2.forEach(item => {
    if (item.a1 === '高压直流母线总输出功率') {
      busOutputPower = Number(item.a3);
    }
    if (item.a1 === '总交流输入功率') {
      item.a3 = handleCutZero((busOutputPower / efficiency).toFixed(3));
    }
  });
}

export function buildHighVoltageDCbusTables(
  paprm1: number | null,
  paprm2: number | null,
): Pick<HighVoltageDCbusTableContext, 'data1' | 'data2'> {
  const data1: HighVoltageDCbusRow[] = [];
  const data2: HighVoltageDCbusRow[] = [];

  for (let i = 0; i < Number(paprm1); i++) {
    data1.push({
      a1: '低压直流',
      a2: `第${i + 1}路`,
      a3: '',
      a4: '',
      a5: '',
      a6: '',
    });

    data2.push({
      a1: '各低压直流供电支路对应的高压直流输入功率',
      a2: `第${i + 1}路`,
      a3: '',
      a4: '',
    });
  }

  for (let i = 0; i < Number(paprm2); i++) {
    data1.push({
      a1: '高压直流',
      a2: `第${i + 1}路`,
      a3: '',
      a4: '',
      a5: '',
      a6: '',
    });

    data2.push({
      a1: '高压直流用电设备功率',
      a2: `第${i + 1}路`,
      a3: '',
      a4: '',
    });
  }

  data2.push(
    { a1: '高压直流用电设备总功率', a2: '', a3: '', a4: '' },
    { a1: '电源机柜总输入功率（高压DC/DC模块总输入功率）', a2: '', a3: '', a4: '' },
    { a1: '高压直流母线总输出功率', a2: '', a3: '', a4: '' },
    { a1: '总交流输入功率', a2: '', a3: '', a4: '' },
  );

  return { data1, data2 };
}
