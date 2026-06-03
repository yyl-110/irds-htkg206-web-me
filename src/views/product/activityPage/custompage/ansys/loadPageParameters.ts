import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { createDefaultAnsysParameterList, type AnsysParameterItem } from './parameterDefaults';

export type { AnsysParameterItem };

export function mergeSavedParamsIntoList(
  list: AnsysParameterItem[],
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): AnsysParameterItem[] {
  const savedMap = new Map<string, string>();
  (saved || []).forEach(row => {
    const code = String(row?.paramCode ?? row?.paramKey ?? '').trim();
    if (code) savedMap.set(code, String(row?.paramValue ?? ''));
  });
  return list.map(item => {
    const num = String(item.parameterNum ?? '').trim();
    if (num && savedMap.has(num)) {
      const savedVal = savedMap.get(num);
      if (savedVal !== undefined && savedVal !== '') {
        return { ...item, defaultValue: savedVal };
      }
    }
    return { ...item };
  });
}

async function applyActivityParameterIds(pageId: string, list: AnsysParameterItem[]): Promise<AnsysParameterItem[]> {
  if (!pageId) return list;
  try {
    const res = await AdminApiSystemParameter.getParameterActList({ businessId: pageId, type: '2' });
    const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
    const byNum = new Map<string, Record<string, unknown>>();
    rows.forEach((row: Record<string, unknown>) => {
      const num = String(row?.parameterNum ?? row?.paramNum ?? row?.paramCode ?? '').trim();
      if (num) byNum.set(num, row);
    });
    return list.map(item => {
      const num = String(item.parameterNum ?? '').trim();
      const hit = num ? byNum.get(num) : null;
      if (!hit) return item;
      const pid = String(hit?.id ?? hit?.parameterId ?? '').trim();
      return pid ? { ...item, parameterId: pid } : item;
    });
  } catch {
    return list;
  }
}

export async function loadAnsysPageParameters(
  pageId: string,
  saved?: Array<{ paramCode?: string; paramKey?: string; paramValue?: string }> | null,
): Promise<AnsysParameterItem[]> {
  const pageKey = String(pageId ?? '').trim();
  let list = createDefaultAnsysParameterList(pageKey);
  list = await applyActivityParameterIds(pageKey, list);
  return mergeSavedParamsIntoList(list, saved);
}
