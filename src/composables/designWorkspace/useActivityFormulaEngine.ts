import { ref, watch } from 'vue';
import {
  collectFormulaOutputBindings,
  evaluateActivityFormula,
  extractFormulaParamCodes,
  isFormulaOutputComponent,
  sortFormulaBindingsTopologically,
  type ActivityFormulaBinding,
} from '@/utils/activityFormulaEvaluate';

export interface UseActivityFormulaEngineOptions {
  /** 当前活动页组件列表 */
  getComponents: () => any[];
  getComponentKey: (item: any, index: number) => string;
  /** 读取组件当前编辑值（INPUT / SELECT / RADIO 等） */
  getComponentLiveValue: (item: any, index: number) => string;
  /** 同任务已落库参数（含其它活动），key=paramCode */
  getTaskSavedValue: (paramCode: string) => string;
  /** 写回公式输出组件展示值 */
  setFormulaFieldValue: (componentKey: string, value: string) => void;
  /** 触发联动的数据源（字段图、任务参数池等） */
  watchSources: () => unknown[];
}

function getParamCode(item: any): string {
  return String(item?.paramCode ?? item?.paramKey ?? '').trim();
}

function buildTaskParamStore(options: UseActivityFormulaEngineOptions): Record<string, string> {
  const store: Record<string, string> = {};
  const components = options.getComponents();
  const formulaCodes = new Set(
    collectFormulaOutputBindings(components, options.getComponentKey).map(b => b.paramCode),
  );

  components.forEach((item, index) => {
    const code = getParamCode(item);
    if (!code) return;
    if (formulaCodes.has(code)) return;
    store[code] = options.getComponentLiveValue(item, index);
  });

  const allCodes = new Set<string>([
    ...Object.keys(store),
    ...components.map(getParamCode).filter(Boolean),
  ]);
  collectFormulaOutputBindings(components, options.getComponentKey).forEach(binding => {
    extractFormulaParamCodes(binding.expression, allCodes).forEach(code => allCodes.add(code));
  });

  allCodes.forEach(code => {
    if (store[code] != null && String(store[code]).trim() !== '') return;
    const saved = options.getTaskSavedValue(code);
    if (saved != null && String(saved).trim() !== '') {
      store[code] = saved;
    }
  });

  return store;
}

function applyFormulaBindings(
  bindings: ActivityFormulaBinding[],
  baseStore: Record<string, string>,
  knownCodes: Set<string>,
  setFormulaFieldValue: (componentKey: string, value: string) => void,
) {
  const store = { ...baseStore };
  const { sorted } = sortFormulaBindingsTopologically(bindings);
  sorted.forEach(binding => {
    const result = evaluateActivityFormula(binding.expression, store, knownCodes);
    const value = result.ok ? result.value : '';
    store[binding.paramCode] = value;
    setFormulaFieldValue(binding.componentKey, value);
  });
}

/**
 * 同任务公式联动：当前活动页输入变更 / 任务参数池变更时，重算本页公式输出（OUTPUT + validateRule.formula）。
 */
export function useActivityFormulaEngine(options: UseActivityFormulaEngineOptions) {
  const recalcRunning = ref(false);

  function recalculateFormulaOutputs() {
    if (recalcRunning.value) return;
    const components = options.getComponents();
    const bindings = collectFormulaOutputBindings(components, options.getComponentKey);
    if (!bindings.length) return;

    recalcRunning.value = true;
    try {
      const baseStore = buildTaskParamStore(options);
      const knownCodes = new Set(Object.keys(baseStore));
      bindings.forEach(b => extractFormulaParamCodes(b.expression, knownCodes).forEach(c => knownCodes.add(c)));
      applyFormulaBindings(bindings, baseStore, knownCodes, options.setFormulaFieldValue);
    } finally {
      recalcRunning.value = false;
    }
  }

  watch(
    options.watchSources,
    () => {
      recalculateFormulaOutputs();
    },
    { deep: true },
  );

  return {
    recalculateFormulaOutputs,
    isFormulaOutputComponent,
  };
}

export type { ActivityFormulaBinding };
