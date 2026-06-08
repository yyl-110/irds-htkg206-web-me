import { resolveTemplateByType, setAdapterTableRows, TYPE_OPTIONS, type AdapterDesignRow, type AdapterPageConfig, type AdapterParameterItem } from './parameterDefaults';

export { TYPE_OPTIONS };

export function addAdapterTableRow(config: AdapterPageConfig, list: AdapterParameterItem[]) {
  const rows = [...(list[19]?.tableMap?.rowData ?? [])] as AdapterDesignRow[];
  const num = rows.length + 1;
  rows.push({
    p0: num,
    p1: '有电缆槽',
    p2: '0',
    p3: '15',
    p4: '0',
    p5: '',
    p6: config.templates.withCable,
    delIndex: rows.length,
  });
  setAdapterTableRows(list, rows);
}

export function deleteAdapterTableRows(list: AdapterParameterItem[], selectedRows: AdapterDesignRow[]) {
  let rowData = [...(list[19]?.tableMap?.rowData ?? [])] as AdapterDesignRow[];
  selectedRows.forEach(selected => {
    rowData = rowData.filter(row => {
      if (selected.id != null && row.id != null) return selected.id !== row.id;
      return selected.delIndex !== row.delIndex;
    });
  });
  rowData.forEach((row, index) => {
    row.p0 = index + 1;
  });
  setAdapterTableRows(list, rowData);
}

export function updateAdapterRowType(
  config: AdapterPageConfig,
  row: AdapterDesignRow,
  typeValue: string,
) {
  const nextType = typeValue || '有电缆槽';
  row.p1 = nextType;
  row.p6 = resolveTemplateByType(config, nextType);
}
