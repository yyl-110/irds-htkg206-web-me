import {
  applyActivityParameterIds,
  applyTaskParamMapToParameterList,
  type CustomPageParameterItem,
  type CustomPageSavedParamRow,
  type CustomPageSavedTableRow,
} from './taskParamMapMerge';

export type CustomPageParameterLoader = (
  pageId: string,
  saved?: CustomPageSavedParamRow[] | null,
  savedTables?: CustomPageSavedTableRow[] | null,
) => Promise<unknown[]>;

export function createParameterLoader<T extends CustomPageParameterItem>(
  createDefaultList: (pageId: string) => T[],
): CustomPageParameterLoader {
  return async (pageId, saved, savedTables) => {
    const pageKey = String(pageId ?? '').trim();
    let list = createDefaultList(pageKey);
    list = await applyActivityParameterIds(pageKey, list);
    return applyTaskParamMapToParameterList(list, saved, savedTables);
  };
}

/** 包装已有 loadPageParameters，统一补全 task-param-map 合并 */
export function wrapExistingParameterLoader(
  loadFn: (pageId: string, saved?: CustomPageSavedParamRow[] | null) => Promise<CustomPageParameterItem[]>,
): CustomPageParameterLoader {
  return async (pageId, saved, savedTables) => {
    const list = await loadFn(String(pageId ?? '').trim(), saved);
    return applyTaskParamMapToParameterList(list, saved, savedTables);
  };
}
