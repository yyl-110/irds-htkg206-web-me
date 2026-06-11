import { nextTick, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchTaskParamMapFromRoute } from '../utils/fetchTaskParamMap';
import {
  applyTaskParamMapToParameterList,
  syncFlowContextFromTaskParamMap,
  type CustomPageParameterItem,
  type CustomPageSavedParamRow,
  type CustomPageSavedTableRow,
} from '../utils/taskParamMapMerge';

type PageProps = {
  pageid?: string;
  parameterTempList?: CustomPageParameterItem[];
  /** 工作区 task-param-map 原始快照，优先用于回填（避免从空 defaultValue 反推） */
  savedParamValues?: CustomPageSavedParamRow[] | null;
  savedTables?: CustomPageSavedTableRow[] | null;
};

type LoadPageParametersFn<T extends CustomPageParameterItem> = (
  pageId: string,
  saved?: CustomPageSavedParamRow[] | null,
  savedTables?: CustomPageSavedTableRow[] | null,
) => Promise<T[]>;

function extractSavedRowsFromList<T extends CustomPageParameterItem>(list: T[]): CustomPageSavedParamRow[] {
  return list
    .filter(item => String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramCode: String(item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

/** 自定义页统一接入 task-param-map：加载、监听、按 parameterNum 回填 parameterTempList */
export function useCustomPageTaskParamMap<T extends CustomPageParameterItem>(options: {
  props: PageProps;
  parameterTempList: Ref<T[]>;
  loadPageParameters?: LoadPageParametersFn<T>;
  cloneItem?: (list: T[]) => T[];
}) {
  const route = useRoute();
  const taskParamSaved = ref<CustomPageSavedParamRow[]>([]);
  const taskParamSavedTables = ref<CustomPageSavedTableRow[]>([]);
  let taskParamLoaded = false;

  function resolvePageId(): string {
    return String(
      options.props.pageid || route.query.pageId || route.query.activityPageId || route.query.pageid || '',
    ).trim();
  }

  function cloneList(list: T[]): T[] {
    if (options.cloneItem) return options.cloneItem(list);
    return list.map(item => ({ ...item }));
  }

  function setTaskParamCache(
    saved: CustomPageSavedParamRow[],
    savedTables: CustomPageSavedTableRow[],
    syncFlow = true,
  ) {
    taskParamSaved.value = saved;
    taskParamSavedTables.value = savedTables;
    if (syncFlow) {
      syncFlowContextFromTaskParamMap(saved, savedTables);
    }
    taskParamLoaded = true;
  }

  function resolveSavedFromProps(): CustomPageSavedParamRow[] {
    const raw = options.props.savedParamValues;
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map(row => ({
          paramCode: String(row?.paramCode ?? row?.paramKey ?? '').trim(),
          paramValue: String(row?.paramValue ?? ''),
        }))
        .filter(row => row.paramCode);
    }
    const list = options.props.parameterTempList;
    if (!list?.length) return [];
    return extractSavedRowsFromList(list as T[]).filter(row => String(row.paramValue ?? '').trim() !== '');
  }

  function syncTaskParamCacheFromProps() {
    const saved = resolveSavedFromProps();
    const savedTables = Array.isArray(options.props.savedTables) ? options.props.savedTables : [];
    if (!saved.length && !savedTables.length) return;
    // 父级 loadCustomPageParameters 已同步过 flowContext，此处仅缓存回填数据，避免用空值覆盖
    setTaskParamCache(saved, savedTables, false);
  }

  async function ensureTaskParamMapLoaded() {
    if (taskParamLoaded) return;
    if (options.props.parameterTempList?.length) {
      syncTaskParamCacheFromProps();
      return;
    }
    const parsed = await fetchTaskParamMapFromRoute(route);
    setTaskParamCache(parsed.saved, parsed.savedTables);
  }

  function applyTaskParamMapToList() {
    if (!taskParamSaved.value.length && !taskParamSavedTables.value.length) return;
    options.parameterTempList.value = applyTaskParamMapToParameterList(
      options.parameterTempList.value,
      taskParamSaved.value,
      taskParamSavedTables.value,
    );
  }

  async function loadPageParametersIfNeeded() {
    if (options.props.parameterTempList?.length) return;
    const pageId = resolvePageId();
    if (!pageId || !options.loadPageParameters) return;
    await ensureTaskParamMapLoaded();
    options.parameterTempList.value = await options.loadPageParameters(
      pageId,
      taskParamSaved.value,
      taskParamSavedTables.value,
    );
  }

  function setupParameterWatch(updateEl: () => void) {
    watch(
      () => options.props.parameterTempList,
      val => {
        if (val && val.length > 0) {
          options.parameterTempList.value = cloneList(val as T[]);
          taskParamLoaded = false;
          syncTaskParamCacheFromProps();
          nextTick(() => updateEl());
        }
      },
      { deep: true },
    );
    watch(
      () => [options.props.savedParamValues, options.props.savedTables] as const,
      () => {
        syncTaskParamCacheFromProps();
        nextTick(() => updateEl());
      },
      { deep: true },
    );
  }

  function mountWithTaskParamMap(updateEl: () => void) {
    onMounted(async () => {
      await loadPageParametersIfNeeded();
      if (!taskParamLoaded) {
        await ensureTaskParamMapLoaded();
      }
      updateEl();
    });
  }

  return {
    applyTaskParamMapToList,
    loadPageParametersIfNeeded,
    setupParameterWatch,
    mountWithTaskParamMap,
  };
}
