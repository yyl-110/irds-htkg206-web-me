import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';
import { createInputColumnRender } from '@/views/product/activityPage/custompage/shared/process7/rxTableColumnRenders';

import type { AcbusPowerRow, AcbusPowerTableContext } from './types';
import { onAcdcChange, onDcdcChange, onPowerChange, syncOutputVoltage } from './calculation';

export interface AcbusPowerColumnHandlers {
  getContext: () => AcbusPowerTableContext;
}

export function createAcbusPowerColumns1(handlers: AcbusPowerColumnHandlers): LegacyColumn[] {
  const ctx = () => handlers.getContext();

  return [
    {
      id: '1',
      title: '供电种类',
      key: 'powerType',
      align: 'center',
      width: 120,
    },
    {
      id: '2',
      title: '供电支路',
      key: 'brankId',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '功率（W）',
      key: 'power',
      align: 'center',
      width: 120,
      render: createInputColumnRender('power', (_, row) => {
        onPowerChange(row as AcbusPowerRow, String(row.power ?? ''), ctx());
      }, { numeric: true }),
    },
    {
      id: '4',
      title: '低压DC/DC组合效率',
      key: 'dcdc',
      align: 'center',
      width: 200,
      render: (h, params) => {
        if (params.row.powerType === '交流') {
          return h('div', {}, '—— ——  ');
        }
        return createInputColumnRender('dcdc', (_, row) => {
          onDcdcChange(row as AcbusPowerRow, String(row.dcdc ?? ''), ctx());
        }, { numeric: true })(h, params);
      },
    },
    {
      id: '5',
      title: 'AC/DC组合效率',
      key: 'acdc',
      align: 'center',
      width: 160,
      render: (h, params) => {
        if (params.row.a1 === '交流' || params.row.powerType === '交流') {
          return h('div', {}, '—— ——  ');
        }
        return createInputColumnRender('acdc', (_, row) => {
          onAcdcChange(row as AcbusPowerRow, String(row.acdc ?? ''), ctx());
        }, { numeric: true })(h, params);
      },
    },
    {
      id: '6',
      title: '额定输出电压（V）',
      key: 'outputvoltage',
      align: 'center',
      minWidth: 120,
      render: createInputColumnRender('outputvoltage', (_, row) => {
        syncOutputVoltage(row as AcbusPowerRow, String(row.outputvoltage ?? ''), ctx());
      }, { numeric: true }),
    },
  ];
}

export function createAcbusPowerColumns2(): LegacyColumn[] {
  return [
    {
      id: '1',
      title: '供电种类',
      key: 'powerType',
      align: 'center',
      width: 300,
    },
    {
      id: '2',
      title: '供电支路',
      key: 'brankId',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '功率（W）',
      key: 'power',
      align: 'center',
      width: 180,
    },
    {
      id: '4',
      title: '输出电压（V）',
      key: 'outputvoltage',
      align: 'center',
      minWidth: 260,
      render: (h, params) => {
        if (params.row.powerType === '低压直流母线总输出功率') {
          return h('div', {}, '—— ——  ');
        }
        return h('div', {}, String(params.row.outputvoltage ?? ''));
      },
    },
  ];
}

export function createAcbusPowerColumns3(): LegacyColumn[] {
  return [
    {
      id: '1',
      title: '供电种类',
      key: 'powerType',
      align: 'center',
      width: 300,
    },
    {
      id: '2',
      title: '供电支路',
      key: 'brankId',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '功率（W）',
      key: 'power',
      align: 'center',
      width: 120,
    },
    {
      id: '6',
      title: '额定输出电压（V）',
      key: 'outputvoltage',
      align: 'center',
      minWidth: 120,
      render: (h, params) => {
        const type = String(params.row.powerType ?? '');
        if (
          type === '低压直流母线总输出功率' ||
          type === '电源机柜总输入功率（AD/DC组合总输入功率）' ||
          type === '总交流输入功率'
        ) {
          return h('div', {}, '—— ——  ');
        }
        return h('div', {}, String(params.row.outputvoltage ?? ''));
      },
    },
  ];
}
