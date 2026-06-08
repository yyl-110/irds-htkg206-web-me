import { createDefaultFs15_1LParameterList, type Fs15_1LParameterItem } from './parameterDefaults';

export type { Fs15_1LParameterItem };

export async function loadFs15_1LPageParameters(pageId: string): Promise<Fs15_1LParameterItem[]> {
  return createDefaultFs15_1LParameterList(String(pageId ?? '').trim());
}

export { extractFs15_1LSaveParamValues } from './rowOperations';
