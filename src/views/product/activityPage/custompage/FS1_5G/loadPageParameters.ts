import { createDefaultFs15GParameterList, type Fs15GParameterItem } from './parameterDefaults';

export type { Fs15GParameterItem };

export async function loadFs15GPageParameters(pageId: string): Promise<Fs15GParameterItem[]> {
  return createDefaultFs15GParameterList(String(pageId ?? '').trim());
}

export { extractFs15GSaveParamValues } from './rowOperations';
