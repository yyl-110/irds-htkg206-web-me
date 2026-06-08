import type { LegacyColumn } from '../../_shared/components/ProcessRxTable.types';
import { createInputColumnRender, createSelectColumnRender } from './rxTableColumnRenders';

type SyncRowFn = (index: number, row: Record<string, unknown>) => void;

/** 电源机柜输出路数表（Dyjg 页 ProcessRxTable 列，disabled 只读展示） */
export function createDyjgOutputTableColumns(syncRow: SyncRowFn, disabled = true): LegacyColumn[] {
  const numeric = (key: string) => createInputColumnRender(key, syncRow, { numeric: true, disabled });
  const text = (key: string) => createInputColumnRender(key, syncRow, { disabled });

  return [
    { id: '1', title: '输出路数', key: 'p0', align: 'center', resizable: true, width: 80 },
    { id: '2', title: '输出功率(W)', key: 'p1', align: 'center', resizable: true, width: 90, render: numeric('p1') },
    { id: '3', title: '额定输出电压(V)', key: 'p2', align: 'center', resizable: true, width: 100, render: numeric('p2') },
    { id: '4', title: '输出电压范围(V)', key: 'p3', align: 'center', resizable: true, width: 100, render: numeric('p3') },
    { id: '5', title: '纹波电压范围(mV)', key: 'p4', align: 'center', resizable: true, width: 100, render: numeric('p4') },
    { id: '6', title: '电压稳定度', key: 'p5', align: 'center', resizable: true, width: 100, render: text('p5') },
    { id: '7', title: '负载稳定度', key: 'p6', align: 'center', resizable: true, width: 100, render: text('p6') },
    { id: '8', title: '暂稳态回复时间(mS)', key: 'p7', align: 'center', resizable: true, width: 100, render: text('p7') },
    { id: '9', title: '阶跃过冲电压(V)', key: 'p8', align: 'center', resizable: true, width: 100, render: text('p8') },
    {
      id: '10',
      title: '调压控制方式',
      key: 'p9',
      align: 'center',
      resizable: true,
      width: 150,
      render: createSelectColumnRender('p9', syncRow, disabled),
    },
  ];
}

/** InputDyjg 页输出路数表（可编辑） */
export function createInputDyjgOutputTableColumns(syncRow: SyncRowFn): LegacyColumn[] {
  return createDyjgOutputTableColumns(syncRow, false);
}
