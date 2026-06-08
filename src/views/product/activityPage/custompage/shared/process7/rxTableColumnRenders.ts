import { message } from 'ant-design-vue';
import type { LegacyColumn, LegacyRenderParams } from '../../_shared/components/ProcessRxTable.types';

const NUMBER_REG = /^\d+(?=\.{0,1}\d+$|$)/;

export const VOLTAGE_REGULATION_TYPES = [
  { id: 1, name: '远端电阻调压' },
  { id: 2, name: '远端电压调压' },
  { id: 3, name: 'CAN通信调压' },
  { id: 4, name: '无调压' },
];

type SyncRowFn = (index: number, row: Record<string, unknown>) => void;

function inputStyle() {
  return { width: '100%', textAlign: 'center', align: 'center' };
}

/** ProcessRxTable legacy Input render（可选数字校验、disabled） */
export function createInputColumnRender(
  fieldKey: string,
  syncRow: SyncRowFn,
  options?: { numeric?: boolean; disabled?: boolean },
) {
  return (h: LegacyColumn['render'] extends (...args: infer A) => unknown ? A[0] : never, params: LegacyRenderParams) => {
    params.row.$isEdit = true;
    return h('Input', {
      props: {
        type: 'text',
        value: params.row[fieldKey],
        disabled: options?.disabled ?? false,
      },
      style: inputStyle(),
      on: {
        'on-blur': (event: Event) => {
          const value = (event.target as HTMLInputElement).value;
          if (options?.numeric && value && !NUMBER_REG.test(value)) {
            message.error('请输入数字');
            return;
          }
          params.row[fieldKey] = value;
          syncRow(params.index, params.row);
        },
      },
    });
  };
}

/** ProcessRxTable legacy Select render（调压控制方式） */
export function createSelectColumnRender(fieldKey: string, syncRow: SyncRowFn, disabled = false) {
  return (h: LegacyColumn['render'] extends (...args: infer A) => unknown ? A[0] : never, params: LegacyRenderParams) => {
    params.row.$isEdit = true;
    return h(
      'Select',
      {
        props: {
          type: 'text',
          value: params.row[fieldKey],
          labelInValue: true,
          clearable: false,
          transfer: true,
          disabled,
        },
        style: inputStyle(),
        on: {
          'on-change': (event: { value?: unknown }) => {
            params.row[fieldKey] = event?.value;
            syncRow(params.index, params.row);
          },
        },
      },
      VOLTAGE_REGULATION_TYPES.map(item =>
        h('Option', {
          props: {
            value: item.id,
            label: item.name,
            Selected: item.id === params.row.sortLevel,
          },
        }),
      ),
    );
  };
}

/** 供电时序表流程列：用电设备 */
export function createProcessDeviceColumnRender(fieldKey: string, syncRow: SyncRowFn) {
  return createInputColumnRender(fieldKey, syncRow);
}

/** 供电时序表流程列：时间(小时) */
export function createProcessTimeColumnRender(fieldKey: string, syncRow: SyncRowFn) {
  return (h: LegacyColumn['render'] extends (...args: infer A) => unknown ? A[0] : never, params: LegacyRenderParams) => {
    params.row.$isEdit = true;
    return h('Input', {
      props: {
        type: 'text',
        value: params.row[fieldKey],
      },
      style: inputStyle(),
      on: {
        'on-blur': (event: Event) => {
          const value = (event.target as HTMLInputElement).value;
          if (value && !NUMBER_REG.test(value)) {
            message.error('请输入数字');
            return;
          }
          params.row[fieldKey] = value;
          syncRow(params.index, params.row);
        },
      },
    });
  };
}
