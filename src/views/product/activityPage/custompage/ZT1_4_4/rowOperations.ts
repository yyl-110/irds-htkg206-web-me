import type { Zt1_44ParameterItem } from './parameterDefaults';

export function extractZt1_44SaveParamValues(list: Zt1_44ParameterItem[]) {
  return list
    .map(item => {
      const key = String(item.parameterNum ?? '').trim();
      if (!key) return null;
      return {
        paramKey: key,
        paramName: String(item.inputName ?? key),
        paramValue: String(item.defaultValue ?? ''),
      };
    })
    .filter((item): item is { paramKey: string; paramName: string; paramValue: string } => item != null);
}
