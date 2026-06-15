import { getFlowParameterList } from '../shared/flowContext';

export const LINEAR_WORK_MODES = ['直线喷管', '直线非喷管'] as const;

type SavedParamRow = { paramCode?: string; paramKey?: string; paramValue?: string };

export function resolveWorkModeFromContext(...sources: Array<SavedParamRow[] | null | undefined>): string {
  for (const item of getFlowParameterList()) {
    const code = String(item.paramnum ?? '').trim();
    if (code === 'DJ1_1_GZFS') {
      const val = String(item.paramvalue ?? '').trim();
      if (val) return val;
    }
  }
  for (const source of sources) {
    for (const row of source ?? []) {
      const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
      if (code === 'DJ1_1_GZFS') {
        const val = String(row?.paramValue ?? '').trim();
        if (val) return val;
      }
    }
  }
  return '';
}

export function isLinearWorkMode(workMode: string): boolean {
  return LINEAR_WORK_MODES.includes(workMode as (typeof LINEAR_WORK_MODES)[number]);
}
