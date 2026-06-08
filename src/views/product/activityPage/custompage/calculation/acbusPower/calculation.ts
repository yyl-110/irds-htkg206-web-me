import { handleCutZero } from '@/utils/tools';

import type { AcbusPowerRow, AcbusPowerTableContext } from './types';

export function syncOutputVoltage(row: AcbusPowerRow, event: string, ctx: AcbusPowerTableContext) {
  if (row.powerType === '低压直流') {
    ctx.data2.forEach(item => {
      if (item.brankId === row.brankId) {
        item.outputvoltage = event;
      }
    });
  }

  ctx.data3.forEach((item, index) => {
    if (index === row._index) {
      item.outputvoltage = event;
    }
  });
}

export function onPowerChange(row: AcbusPowerRow, event: string, ctx: AcbusPowerTableContext) {
  let val = 0;
  let val1 = 1;

  if (row.powerType === '低压直流') {
    ctx.data2.forEach(item => {
      if (item.brankId === row.brankId) {
        if (row.dcdc !== '' && row.dcdc != undefined && event !== '') {
          val1 = Number(event) / Number(row.dcdc);
          item.power = handleCutZero(val1.toFixed(3));
        } else {
          item.power = '';
        }
      }

      if (
        row.power !== '' &&
        row.power != undefined &&
        row.dcdc !== '' &&
        row.dcdc != undefined &&
        event !== '' &&
        row.acdc !== ''
      ) {
        if (item.powerType === '低压直流' && item.brankId === row.brankId) {
          val = Number(event / (Number(row.dcdc) * Number(row.acdc)));
          applyBranchAcInput(val, row, ctx);
        }
      } else {
        applyBranchAcInput(0, row, ctx);
      }
    });
    summarizeLowVoltageOutput(ctx);
  } else {
    ctx.data3.forEach(item => {
      if (item.brankId === row.brankId && item.powerType === '各交流用电负载支路对应的交流输入功率') {
        item.power = event;
      }
    });
    totalAcInputPower(ctx);
  }
}

export function onDcdcChange(row: AcbusPowerRow, event: string, ctx: AcbusPowerTableContext) {
  let val = 0;

  if (row.powerType === '低压直流') {
    ctx.data2.forEach(item => {
      if (item.brankId === row.brankId) {
        if (row.dcdc !== '' && row.dcdc != undefined && event !== '') {
          val = Number(row.power) / Number(event);
          item.power = handleCutZero(val.toFixed(3));
        } else {
          item.power = '';
        }
      }

      if (
        row.power !== '' &&
        row.power != undefined &&
        row.dcdc !== '' &&
        row.dcdc != undefined &&
        event !== '' &&
        row.acdc !== ''
      ) {
        if (item.powerType === '低压直流' && item.brankId === row.brankId) {
          val = Number(Number(row.power) / (Number(event) * Number(row.acdc)));
          applyBranchAcInput(val, row, ctx);
        }
      } else {
        applyBranchAcInput(0, row, ctx);
      }
    });
    summarizeLowVoltageOutput(ctx);
  }
}

export function onAcdcChange(row: AcbusPowerRow, event: string, ctx: AcbusPowerTableContext) {
  let val = 0;

  if (row.power !== '' && row.power != undefined && row.dcdc !== '' && row.dcdc != undefined && event !== '') {
    ctx.data1.forEach(item => {
      if (item.powerType === '低压直流' && item.brankId === row.brankId) {
        val = Number(Number(item.power) / (Number(item.dcdc) * Number(event)));
      }
    });
  }

  applyBranchAcInput(val, row, ctx);
}

function applyBranchAcInput(val: number, row: AcbusPowerRow, ctx: AcbusPowerTableContext) {
  ctx.data3.forEach(item => {
    if (item.powerType === '各低压直流供电支路对应的交流输入功率' && item.brankId === row.brankId) {
      item.power = handleCutZero(val.toFixed(3));
    }
  });
  totalInputPower(ctx);
}

function summarizeLowVoltageOutput(ctx: AcbusPowerTableContext) {
  let sumVal = 0;
  ctx.data2.forEach(item => {
    if (item.powerType === '低压直流') {
      sumVal += Number(item.power);
    }
  });
  applyLowVoltageTotalOutput(sumVal, ctx);
}

function applyLowVoltageTotalOutput(sumVal: number, ctx: AcbusPowerTableContext) {
  ctx.data3.forEach(item => {
    if (item.powerType === '低压直流母线总输出功率') {
      item.power = handleCutZero(Number(sumVal).toFixed(3));
    }
  });

  ctx.data2.forEach(item => {
    if (item.powerType === '低压直流母线总输出功率') {
      item.power = handleCutZero(Number(sumVal).toFixed(3));
    }
  });
}

function totalInputPower(ctx: AcbusPowerTableContext) {
  let sumVal = 0;
  ctx.data3.forEach(item => {
    if (item.powerType === '各低压直流供电支路对应的交流输入功率') {
      sumVal += Number(item.power);
    }
    if (item.powerType === '电源机柜总输入功率（AD/DC组合总输入功率）') {
      item.power = handleCutZero(Number(sumVal).toFixed(3));
    }
  });

  totalAcInputPower(ctx);
}

function totalAcInputPower(ctx: AcbusPowerTableContext) {
  let sumVal = 0;
  ctx.data3.forEach(item => {
    if (
      item.powerType === '各低压直流供电支路对应的交流输入功率' ||
      item.powerType === '各交流用电负载支路对应的交流输入功率'
    ) {
      sumVal += Number(item.power);
    }
    if (item.powerType === '总交流输入功率') {
      item.power = handleCutZero(Number(sumVal).toFixed(3));
    }
  });
}

export function buildAcbusPowerTables(paprm1: number | null, paprm2: number | null): AcbusPowerTableContext {
  const data1: AcbusPowerRow[] = [];
  const data2: AcbusPowerRow[] = [];
  const data3: AcbusPowerRow[] = [];

  for (let i = 0; i < Number(paprm1); i++) {
    data1.push({
      powerType: '低压直流',
      brankId: `第${i + 1}路`,
      power: '',
      dcdc: '',
      acdc: '',
      outputvoltage: '',
    });

    data2.push({
      powerType: '低压直流',
      brankId: `第${i + 1}路`,
      power: '',
      outputvoltage: '',
    });

    data3.push({
      powerType: '各低压直流供电支路对应的交流输入功率',
      brankId: `第${i + 1}路`,
      power: '',
      outputvoltage: '',
    });
  }

  data2.push({
    powerType: '低压直流母线总输出功率',
    brankId: '',
    power: '',
    outputvoltage: '',
  });

  for (let i = 0; i < Number(paprm2); i++) {
    data1.push({
      powerType: '交流',
      brankId: `第${i + 1}路`,
      power: '',
      dcdc: '',
      acdc: '',
      outputvoltage: '',
    });

    data3.push({
      powerType: '各交流用电负载支路对应的交流输入功率',
      brankId: `第${i + 1}路`,
      power: '',
      outputvoltage: '',
    });
  }

  data3.push(
    {
      powerType: '低压直流母线总输出功率',
      brankId: '',
      power: '',
      outputvoltage: '',
    },
    {
      powerType: '电源机柜总输入功率（AD/DC组合总输入功率）',
      brankId: '',
      power: '',
      outputvoltage: '',
    },
    {
      powerType: '总交流输入功率',
      brankId: '',
      power: '',
      outputvoltage: '',
    },
  );

  return { data1, data2, data3 };
}
