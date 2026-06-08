import type { Ref } from 'vue';
import { combinationLists, type CombinationRow } from './combinationLists';
import type { Page4_1ParameterItem } from './parameterDefaults';

export type PageType = 0 | 1 | 2;

export interface QueryImgResult {
  pageType: PageType;
  imgIndex: string;
  tableRows: CombinationRow[];
}

function cloneRows(rows: CombinationRow[]): CombinationRow[] {
  return rows.map(row => ({ ...row }));
}

function normalizeYesNo(value: unknown): string {
  if (value === undefined || value === '') return '否';
  return value !== '否' ? '是' : '否';
}

export function resolveDiagramState(parameterTempList: Page4_1ParameterItem[]): QueryImgResult {
  const systemType = String(parameterTempList[0]?.defaultValue ?? '');

  if (systemType === '交流输入、交流母线') {
    const param1 = String(parameterTempList[1]?.defaultValue ?? '');
    const param2 = String(parameterTempList[2]?.defaultValue ?? '');
    const param3 = String(parameterTempList[3]?.defaultValue ?? '');
    const mapping: Array<[string, string, string, string, number]> = [
      ['是', '是', '是', '1', 1],
      ['是', '否', '是', '2', 2],
      ['是', '否', '否', '3', 3],
      ['是', '是', '否', '4', 4],
      ['否', '是', '是', '5', 5],
      ['否', '否', '是', '6', 6],
      ['否', '是', '否', '7', 7],
      ['否', '否', '否', '8', 8],
    ];
    const matched = mapping.find(item => item[0] === param1 && item[1] === param2 && item[2] === param3);
    const imgIndex = matched?.[3] ?? '1';
    const listId = matched?.[4] ?? 1;
    return { pageType: 0, imgIndex, tableRows: cloneRows(combinationLists[listId] ?? []) };
  }

  if (systemType === '交流输入、高压直流母线') {
    const param1 = String(parameterTempList[4]?.defaultValue ?? '');
    const param2 = String(parameterTempList[5]?.defaultValue ?? '');
    const param3 = String(parameterTempList[6]?.defaultValue ?? '');
    const mapping: Array<[string, string, string, string, number]> = [
      ['是', '是', '是', '9', 9],
      ['是', '否', '是', '12', 12],
      ['是', '否', '否', '11', 11],
      ['是', '是', '否', '10', 10],
      ['否', '是', '是', '13', 13],
      ['否', '否', '是', '15', 15],
      ['否', '是', '否', '14', 14],
      ['否', '否', '否', '16', 16],
    ];
    const matched = mapping.find(item => item[0] === param1 && item[1] === param2 && item[2] === param3);
    const imgIndex = matched?.[3] ?? '9';
    const listId = matched?.[4] ?? 9;
    return { pageType: 1, imgIndex, tableRows: cloneRows(combinationLists[listId] ?? []) };
  }

  if (systemType === '高压直流输入、高压直流母线') {
    const param1 = String(parameterTempList[7]?.defaultValue ?? '');
    const param2 = normalizeYesNo(parameterTempList[8]?.defaultValue);
    const param3 = normalizeYesNo(parameterTempList[9]?.defaultValue);
    const mapping: Array<[string, string, string, string, number]> = [
      ['是', '是', '是', '17', 17],
      ['是', '否', '是', '20', 20],
      ['是', '否', '否', '19', 19],
      ['是', '是', '否', '18', 18],
      ['否', '是', '是', '21', 21],
      ['否', '否', '是', '23', 23],
      ['否', '是', '否', '22', 22],
      ['否', '否', '否', '24', 24],
    ];
    const matched = mapping.find(item => item[0] === param1 && item[1] === param2 && item[2] === param3);
    const imgIndex = matched?.[3] ?? '17';
    const listId = matched?.[4] ?? 17;
    return { pageType: 2, imgIndex, tableRows: cloneRows(combinationLists[listId] ?? []) };
  }

  return { pageType: 0, imgIndex: '1', tableRows: cloneRows(combinationLists[1] ?? []) };
}

const diagramImages = import.meta.glob<string>('../../../../../assets/images/calculation/7RC_*.jpg', {
  eager: true,
  import: 'default',
});

export function resolveDiagramImageUrl(imgIndex: string, fallbackUrl: string): string {
  const suffix = `7RC_${imgIndex}.jpg`;
  const matchedKey = Object.keys(diagramImages).find(key => key.endsWith(suffix));
  return matchedKey ? diagramImages[matchedKey] : fallbackUrl;
}

export function applyDiagramState(
  parameterTempList: Ref<Page4_1ParameterItem[]>,
  pageType: Ref<PageType>,
  imgIndex: Ref<string>,
  imgurl: Ref<string>,
  fallbackUrl: string,
) {
  const state = resolveDiagramState(parameterTempList.value);
  pageType.value = state.pageType;
  imgIndex.value = state.imgIndex;
  parameterTempList.value[10].tableMap!.rowData = state.tableRows;
  imgurl.value = resolveDiagramImageUrl(state.imgIndex, fallbackUrl);
}
