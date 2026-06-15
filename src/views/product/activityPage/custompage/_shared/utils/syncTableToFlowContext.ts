import { upsertFlowTableItem } from '../../shared/flowContext';

/** 将当前页表格写入流程上下文，供下游 initData 读取（同 page3 flowSync） */
export function syncTableToFlowContext(
  tableNum: string,
  componentId: string | number,
  rows: Array<Record<string, string | number | undefined>>,
  maxPIndex = 30,
) {
  if (!rows.length) return;
  const rowdata = rows.map(row => {
    const next: Record<string, string | number | undefined> = { ...row };
    for (let i = 0; i <= maxPIndex; i++) {
      const val = String(row[`p${i}`] ?? '').trim();
      if (val) next[`p${i}`] = val;
    }
    return next;
  });
  upsertFlowTableItem({
    tablenum: tableNum,
    componentId,
    rowdata,
  });
}
