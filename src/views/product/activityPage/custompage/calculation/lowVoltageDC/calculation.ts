import { message } from 'ant-design-vue';

import { handleCutZero } from '@/utils/tools';

import type { BranchCountField, BranchCountParam, LowVoltageDCRow, LowVoltageDCTableContext } from './types';

const INT_REG = /^[1-9]\d*$/;

export function onRatedVoltageChange(row: LowVoltageDCRow, event: string, ctx: LowVoltageDCTableContext) {
  ctx.data2.forEach(item => {
    if (item.a1.includes(row.a1)) {
      item.a3 = event;
    }
  });
}

export function onPowerChange(row: LowVoltageDCRow, event: string, ctx: LowVoltageDCTableContext) {
  let sumVal = 0;
  ctx.data1.forEach(item => {
    if (item.a1 === row.a1) {
      sumVal += Number(item.a5);
    }
  });
  applyRoutePower(sumVal, row.a1, ctx);
}

function applyRoutePower(sumVal: number, rowName: string, ctx: LowVoltageDCTableContext) {
  ctx.data2.forEach(item => {
    if (item.a1.includes(rowName)) {
      item.a2 = handleCutZero(Number(sumVal).toFixed(3));
    }
  });
  applyTotalLowVoltagePower(ctx);
}

function applyTotalLowVoltagePower(ctx: LowVoltageDCTableContext) {
  let sumVal = 0;
  ctx.data2.forEach(item => {
    if (item.a1 !== '总低压直流输出功率') {
      sumVal += Number(item.a2);
    } else {
      item.a2 = handleCutZero(Number(sumVal).toFixed(3));
    }
  });
}

export function buildLowVoltageDCTables(
  branchCount: number | null,
  branchParams: BranchCountParam[],
): { data1: LowVoltageDCRow[]; data2: LowVoltageDCRow[]; valid: boolean } {
  if (!branchCount) {
    return { data1: [], data2: [], valid: false };
  }

  const data1: LowVoltageDCRow[] = [];
  const data2: LowVoltageDCRow[] = [];
  let hasError = false;

  for (let i = 0; i < Number(branchCount); i++) {
    let flag = false;

    branchParams.forEach(item => {
      if (Number(item.modelInfoProp) !== i + 1) return;

      const paramLength = String(item.modelInfoPropValue ?? '');
      if (!INT_REG.test(paramLength)) {
        message.error(`第${i + 1}路分支数量有误，请输入正确的数字`);
        hasError = true;
        flag = true;
        return;
      }

      flag = false;
      for (let j = 0; j < Number(paramLength); j++) {
        data1.push({
          a1: `第${i + 1}路`,
          a2: `供电分支${j + 1}`,
          a3: `P${i + 1}-${j + 1}`,
          a4: '',
          a5: '',
          a6: '',
        });
      }
    });

    if (!flag) {
      data2.push({
        a1: `第${i + 1}路低压直流功率`,
        a2: '',
        a3: '',
      });
    }
  }

  if (hasError) {
    return { data1: [], data2: [], valid: false };
  }

  data2.push({
    a1: '总低压直流输出功率',
    a2: '',
    a3: '',
  });

  return { data1, data2, valid: true };
}

export function unwrapExposedFieldValue(raw: unknown): string | number {
  if (raw == null) return '';
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    return (raw as { value: string | number }).value ?? '';
  }
  return raw as string | number;
}

export function collectBranchParams(
  fieldRefs: Array<{ newModeTypeVal?: unknown; typeKey?: string } | null>,
): BranchCountParam[] {
  return fieldRefs
    .filter((item): item is NonNullable<typeof item> => item != null)
    .map(val => ({
      modelInfoProp: String(val.typeKey ?? ''),
      modelInfoPropValue: unwrapExposedFieldValue(val.newModeTypeVal),
    }));
}

export function createBranchCountFields(branchCount: number | null): BranchCountField[] {
  if (!branchCount || !INT_REG.test(String(branchCount))) {
    return [];
  }

  return Array.from({ length: Number(branchCount) }, (_, index) => ({
    id: index + 1,
    labelName: `第${index + 1}路分支数量：`,
    typeKey: String(index + 1),
  }));
}
