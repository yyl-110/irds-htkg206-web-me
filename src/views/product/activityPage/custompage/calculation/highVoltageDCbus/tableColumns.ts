import type { LegacyColumn } from '@/views/product/activityPage/custompage/_shared/components/ProcessRxTable.types';
import { createInputColumnRender } from '@/views/product/activityPage/custompage/shared/process7/rxTableColumnRenders';

import {
  onModuleEfficiencyChange,
  onPowerChange,
  onRatedVoltageChange,
} from './calculation';
import type { HighVoltageDCbusRow, HighVoltageDCbusTableContext } from './types';

export interface HighVoltageDCbusColumnHandlers {
  getContext: () => HighVoltageDCbusTableContext;
}

export function createHighVoltageDCbusColumns1(handlers: HighVoltageDCbusColumnHandlers): LegacyColumn[] {
  const ctx = () => handlers.getContext();

  return [
    {
      id: '1',
      title: '供电种类',
      key: 'a1',
      align: 'center',
      width: 120,
    },
    {
      id: '2',
      title: '供电支路',
      key: 'a2',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '功率（W）',
      key: 'a3',
      align: 'center',
      width: 120,
      render: createInputColumnRender('a3', (_, row) => {
        onPowerChange(row as HighVoltageDCbusRow, String(row.a3 ?? ''), ctx());
      }, { numeric: true }),
    },
    {
      id: '4',
      title: '高压DC/DC模块效率（手动填写）',
      key: 'a4',
      align: 'center',
      width: 230,
      render: (h, params) => {
        if (params.row.a1 === '高压直流') {
          return h('div', {}, '—— ——  ');
        }
        return createInputColumnRender('a4', (_, row) => {
          onModuleEfficiencyChange(row as HighVoltageDCbusRow, String(row.a4 ?? ''), ctx());
        }, { numeric: true })(h, params);
      },
    },
    {
      id: '5',
      title: '输出额定电压（V）',
      key: 'a5',
      align: 'center',
      minWidth: 160,
      render: createInputColumnRender('a5', (_, row) => {
        onRatedVoltageChange(row as HighVoltageDCbusRow, String(row.a5 ?? ''), ctx());
      }, { numeric: true }),
    },
  ];
}

export function createHighVoltageDCbusColumns2(): LegacyColumn[] {
  return [
    {
      id: '1',
      title: '供电种类',
      key: 'a1',
      align: 'center',
      width: 380,
    },
    {
      id: '2',
      title: '供电支路',
      key: 'a2',
      align: 'center',
      width: 120,
    },
    {
      id: '3',
      title: '功率',
      key: 'a3',
      align: 'center',
      width: 120,
    },
    {
      id: '4',
      title: '输出额定电压（V）',
      key: 'a4',
      align: 'center',
      minWidth: 160,
      render: (h, params) => {
        const type = String(params.row.a1 ?? '');
        if (
          type === '高压直流用电设备总功率' ||
          type === '电源机柜总输入功率（高压DC/DC模块总输入功率）' ||
          type === '总交流输入功率'
        ) {
          return h('div', {}, '—— ——  ');
        }
        return h('div', {}, String(params.row.a4 ?? ''));
      },
    },
  ];
}
