import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';
import { createInputColumnRender } from '@/views/product/activityPage/custompage/shared/process7/rxTableColumnRenders';

import { onPowerChange, onRatedVoltageChange } from './calculation';
import type { LowVoltageDCRow, LowVoltageDCTableContext } from './types';

export interface LowVoltageDCColumnHandlers {
  getContext: () => LowVoltageDCTableContext;
}

export function createLowVoltageDCColumns1(handlers: LowVoltageDCColumnHandlers): LegacyColumn[] {
  const ctx = () => handlers.getContext();

  return [
    {
      id: '1',
      title: '供电支路',
      key: 'a1',
      align: 'center',
      width: 120,
    },
    {
      id: '2',
      title: '供电分支',
      key: 'a2',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '供电分支代号',
      key: 'a3',
      align: 'center',
      width: 120,
    },
    {
      id: '4',
      title: '额定输出电压（V）',
      key: 'a4',
      align: 'center',
      width: 230,
      render: (h, params) => {
        if (params.row.a1 === '总低压直流输出功率') {
          return h('div', {}, '—— ——  ');
        }
        return createInputColumnRender('a4', (_, row) => {
          onRatedVoltageChange(row as LowVoltageDCRow, String(row.a4 ?? ''), ctx());
        }, { numeric: true })(h, params);
      },
    },
    {
      id: '5',
      title: '功率（W）',
      key: 'a5',
      align: 'center',
      minWidth: 160,
      render: createInputColumnRender('a5', (_, row) => {
        onPowerChange(row as LowVoltageDCRow, String(row.a5 ?? ''), ctx());
      }, { numeric: true }),
    },
  ];
}

export function createLowVoltageDCColumns2(): LegacyColumn[] {
  return [
    {
      id: '1',
      title: '供电支路',
      key: 'a1',
      align: 'center',
      width: 220,
    },
    {
      id: '2',
      title: '功率',
      key: 'a2',
      align: 'center',
      width: 220,
    },
    {
      id: '3',
      title: '输出额定电压（V）',
      key: 'a3',
      align: 'center',
      minWidth: 160,
      render: (h, params) => {
        if (params.row.a1 === '总低压直流输出功率') {
          return h('div', {}, '—— ——  ');
        }
        return h('div', {}, String(params.row.a3 ?? ''));
      },
    },
  ];
}
