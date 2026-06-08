import { createDefaultFs15_1KParameterList, type Fs15_1KParameterItem } from './parameterDefaults';

export type { Fs15_1KParameterItem };

export async function loadFs15_1KPageParameters(pageId: string): Promise<Fs15_1KParameterItem[]> {
  return createDefaultFs15_1KParameterList(String(pageId ?? '').trim());
}

export { extractFs15_1KSaveParamValues } from './rowOperations';
