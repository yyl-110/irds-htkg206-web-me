import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import explogTemplateUrl from '@/assets/temp/explog.xlsx?url';
import { OperateLogSearchDTOModel } from '@/api/models/log/OperateLogSearchDTOModel';
import { AdminApiLog } from '@/api/tags/管理后台日志管理';

/** 单次拉取条数，分页直至取完（与当前筛选条件一致） */
const EXPORT_PAGE_SIZE = 500;

export type OperateLogExportRow = Record<string, any>;

/**
 * 与列表查询一致：带上日期筛选与各日志页的 moduleName
 */
export function buildSeadminLogExportBody(
  requestParams: OperateLogSearchDTOModel,
  dateRangeParams: unknown[] | undefined | null,
  moduleName: string,
): OperateLogSearchDTOModel {
  const q = Object.assign(new OperateLogSearchDTOModel(), JSON.parse(JSON.stringify(requestParams)));
  if (dateRangeParams && dateRangeParams.length > 0)
    q.createTime = dateRangeParams as any;
  q.moduleName = moduleName as any;
  q.userName = requestParams.userName;
  return q;
}

/** 导出列顺序：表头与详情页字段对齐（不含链路追踪、类型、纯内容、扩展等） */
const EXPORT_KEYS = [
  'userNickname',
  'module',
  'name',
  'createTime',
  'userId',
  'requestMethod',
  'requestUrl',
  'userIp',
  'userAgent',
  'javaMethod',
  'javaMethodArgs',
  'duration',
  'resultCode',
  'resultMsg',
  'resultData',
  'id',
] as const;

function formatExportCell(row: OperateLogExportRow, key: string): string {
  if (key === 'createTime') {
    const v = row.createTime ?? row.startTime;
    if (v === null || v === undefined || v === '')
      return '';
    return String(v);
  }
  const raw = row[key];
  if (raw === null || raw === undefined)
    return '';
  if (typeof raw === 'object') {
    try {
      return JSON.stringify(raw);
    }
    catch {
      return String(raw);
    }
  }
  return String(raw);
}

/**
 * 解析 exp-log-list 返回：可能为 `data: T[]`（一次给全量）或 `data: { list, total }`（分页）
 */
function extractExpLogRows(resData: unknown): {
  list: OperateLogExportRow[];
  total?: number;
  /** data 为顶层数组时表示后端已一次返回全部，不再翻页 */
  completeArray: boolean;
} {
  if (resData == null)
    return { list: [], completeArray: false };
  if (Array.isArray(resData))
    return { list: resData as OperateLogExportRow[], completeArray: true };
  if (typeof resData === 'object' && resData !== null && 'list' in resData) {
    const o = resData as { list?: OperateLogExportRow[]; total?: number };
    return {
      list: Array.isArray(o.list) ? o.list : [],
      total: o.total,
      completeArray: false,
    };
  }
  return { list: [], completeArray: false };
}

/**
 * 按当前筛选条件调用 **expSeadminLogPageList**（POST `/statistics-log/exp-log-list`）拉取全部日志
 */
export async function fetchAllSeadminOperateLogs(base: OperateLogSearchDTOModel): Promise<OperateLogExportRow[]> {
  const all: OperateLogExportRow[] = [];
  let pageNo = 1;
  const basePlain = JSON.parse(JSON.stringify(base)) as OperateLogSearchDTOModel & { pageNo?: number; pageSize?: number };

  while (true) {
    const body = {
      ...basePlain,
      pageNo,
      pageSize: EXPORT_PAGE_SIZE,
    };
    const res = await AdminApiLog.expSeadminLogPageList(body);
    if (res.data.code !== 200)
      throw new Error(String((res.data as any)?.msg ?? '导出请求失败'));

    const { list, total, completeArray } = extractExpLogRows(res.data.data);
    all.push(...list);

    if (completeArray || list.length === 0)
      break;
    if (list.length < EXPORT_PAGE_SIZE)
      break;
    if (total !== undefined && all.length >= total)
      break;
    pageNo += 1;
    if (pageNo > 10000)
      break;
  }

  return all;
}

/** 黑色细边框（表格边线） */
const BORDER_GRID: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FF000000' } },
  left: { style: 'thin', color: { argb: 'FF000000' } },
  bottom: { style: 'thin', color: { argb: 'FF000000' } },
  right: { style: 'thin', color: { argb: 'FF000000' } },
};

/** 表头绿色填充（RGB 146,208,80 / Excel 常用强调绿） */
const HEADER_GREEN_FILL: ExcelJS.FillPattern = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF92D050' },
};

/** Excel 第 1 行：表头；数据从第 2 行写入（与模版一致） */
const HEADER_ROW_NUMBER = 1;
const FIRST_DATA_ROW_NUMBER = 2;

async function loadExplogExcelJsWorkbook(): Promise<{ workbook: ExcelJS.Workbook; worksheet: ExcelJS.Worksheet }> {
  const res = await fetch(explogTemplateUrl);
  if (!res.ok)
    throw new Error('加载导出模版失败');
  const buf = await res.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buf);
  const worksheet = workbook.getWorksheet(1) ?? workbook.worksheets[0];
  if (!worksheet)
    throw new Error('模版工作表为空');
  return { workbook, worksheet };
}

/** 第 1 行：加粗、垂直居中、水平居中、绿底、全边框 */
function applyHeaderRowStyle(ws: ExcelJS.Worksheet, columnCount: number) {
  const row = ws.getRow(HEADER_ROW_NUMBER);
  for (let c = 1; c <= columnCount; c++) {
    const cell = row.getCell(c);
    cell.font = { bold: true, color: { argb: 'FF000000' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = HEADER_GREEN_FILL;
    cell.border = BORDER_GRID;
  }
}

/** 自第 2 行写入数据并带边框 */
function writeDataRowsStyled(ws: ExcelJS.Worksheet, rows: OperateLogExportRow[], keys: readonly string[]) {
  rows.forEach((record, i) => {
    const row = ws.getRow(FIRST_DATA_ROW_NUMBER + i);
    keys.forEach((key, j) => {
      const cell = row.getCell(j + 1);
      cell.value = formatExportCell(record, key);
      cell.border = BORDER_GRID;
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });
  });
}

function downloadXlsxBuffer(buffer: BlobPart, filename: string) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 使用 `src/assets/temp/explog.xlsx` 模版导出（exceljs 保留样式）：
 * - 第 1 行表头：加粗、垂直居中、绿色背景、边框；
 * - 自第 2 行写入数据并带边框；
 * - `baseFileName` 用于下载文件名。
 */
export async function exportOperateLogRowsToExcel(rows: OperateLogExportRow[], baseFileName: string) {
  const keys = [...EXPORT_KEYS] as string[];
  const colCount = keys.length;
  const { workbook, worksheet } = await loadExplogExcelJsWorkbook();
  applyHeaderRowStyle(worksheet, colCount);
  writeDataRowsStyled(worksheet, rows, keys);
  const stamp = dayjs().format('YYYYMMDD_HHmmss');
  const outName = `${baseFileName}_${stamp}.xlsx`;
  const buf = await workbook.xlsx.writeBuffer();
  downloadXlsxBuffer(buf, outName);
}
