import { handleCutZero } from '@/utils/tools';
import type { TransmissionShaftPage1ParameterItem, TransmissionTableRow } from './parameterDefaults';

export const NUMERIC_REG = /^\d+(?=\.{0,1}\d+$|$)/;

export function runCriticalSpeedCalculation(list: TransmissionShaftPage1ParameterItem[]) {
  const rows = list[4]?.tableMap?.rowData ?? [];
  const shaftSpeed = Number(list[1]?.defaultValue ?? 0);

  rows.forEach(item => {
    const length = item.p1;
    const inner = item.p2;
    const outer = item.p3;

    const val =
      (0.7 * 1.2 * Math.sqrt(Number(inner) * Number(inner) + Number(outer) * Number(outer)) * 100000000) /
      Number(length) /
      Number(length);

    if (!Number.isNaN(val) && val !== Infinity) {
      item.p4 = handleCutZero(val.toFixed(2));
    }

    if (Number(item.p4) > shaftSpeed) {
      item.p5 = '合格';
    } else {
      item.p5 = '不合格';
    }

    if (item.p3 === '') {
      item.p4 = '';
    }
    if (item.p4 === '') {
      item.p5 = '';
    }
  });
}

export function runUniversalJointCalculation(list: TransmissionShaftPage1ParameterItem[]) {
  const rows = list[5]?.tableMap?.rowData ?? [];
  const rowCount = rows.length;

  rows.forEach(item => {
    if (Number(item.p3) < 5) {
      item.p4 = '合格';
    } else {
      item.p4 = '不合格';
    }

    if (item.p3 === '') {
      item.p4 = '';
    }
    if (item.p4 === '') {
      item.p5 = '';
    }

    if (rowCount === 2) {
      const val = Math.sqrt(Math.abs(Number(rows[0].p3) * Number(rows[0].p3) - Number(rows[1].p3) * Number(rows[1].p3)));
      if (rows[1].p3 !== '') {
        item.p5 = handleCutZero(val.toFixed(2));
      }
    } else if (rowCount === 3) {
      const val = Math.sqrt(
        Math.abs(
          Number(rows[0].p3) * Number(rows[0].p3) +
            Number(rows[1].p3) * Number(rows[1].p3) -
            Number(rows[2].p3) * Number(rows[2].p3),
        ),
      );
      if (rows[2].p3 !== '') {
        item.p5 = handleCutZero(val.toFixed(2));
      }
    } else if (rowCount === 4) {
      const val = Math.sqrt(
        Math.abs(
          Number(rows[0].p3) * Number(rows[0].p3) +
            Number(rows[1].p3) * Number(rows[1].p3) +
            Number(rows[2].p3) * Number(rows[2].p3) -
            Number(rows[3].p3) * Number(rows[3].p3),
        ),
      );
      if (rows[3].p3 !== '') {
        item.p5 = handleCutZero(val.toFixed(2));
      }
    } else if (rowCount === 5) {
      const val = Math.sqrt(
        Math.abs(
          Number(rows[0].p3) * Number(rows[0].p3) +
            Number(rows[1].p3) * Number(rows[1].p3) +
            Number(rows[2].p3) * Number(rows[2].p3) +
            Number(rows[3].p3) * Number(rows[3].p3) -
            Number(rows[4].p3) * Number(rows[4].p3),
        ),
      );
      if (rows[4].p3 !== '') {
        item.p5 = handleCutZero(val.toFixed(2));
      }
    }

    if (Number(item.p5) < 3) {
      item.p6 = '合格';
    } else {
      item.p6 = '不合格';
    }

    if (item.p3 === '') {
      item.p5 = '';
    }
    if (item.p5 === '') {
      item.p6 = '';
    }
  });
}

export function validateNumericInput(value: string) {
  return !value || NUMERIC_REG.test(value);
}

export function applyDesignResultToRow(
  list: TransmissionShaftPage1ParameterItem[],
  selectedIndex: number,
  partNo: string,
  innerDiameter: string,
  outerDiameter: string,
) {
  const shaftRows = list[2]?.tableMap?.rowData ?? [];
  const speedRows = list[4]?.tableMap?.rowData ?? [];
  if (selectedIndex < 0) return;

  shaftRows[selectedIndex].p3 = partNo;
  speedRows[selectedIndex].p2 = innerDiameter;
  speedRows[selectedIndex].p3 = outerDiameter;
  shaftRows[selectedIndex].p4 = partNo !== '' ? '已发布' : '设计中';
}

export function resetSpeedRowForShaft(list: TransmissionShaftPage1ParameterItem[], selectedIndex: number) {
  const speedRows = list[4]?.tableMap?.rowData ?? [];
  if (selectedIndex < 0 || !speedRows[selectedIndex]) return;
  speedRows[selectedIndex].p1 = '';
  speedRows[selectedIndex].p2 = '';
  speedRows[selectedIndex].p3 = '';
  speedRows[selectedIndex].p4 = '';
  speedRows[selectedIndex].p5 = '';
}

export function markShaftRowsPublished(list: TransmissionShaftPage1ParameterItem[]) {
  const rows = list[2]?.tableMap?.rowData ?? [];
  rows.forEach(item => {
    if (item.p3 !== '') {
      item.p4 = '已发布';
    }
  });
}

export function getSelectedRowIndex(rows: TransmissionTableRow[], selected: TransmissionTableRow) {
  return Number(selected.p0 ?? 0) - 1;
}
