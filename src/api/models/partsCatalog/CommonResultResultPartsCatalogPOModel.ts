import { BaseModel } from '@/utils/BaseModel';
import type { CommonResultResultPartsCatalogPO } from '../../tags/data-contracts';
import { ResultPartsCatalogPOModel, PageResultPartsReplacePOModel, PageResultManualPOModel, PageResultEcuPOModel, ResultPartsCatalogPOModel2 } from './ResultPartsCatalogPOModel';

export class CommonResultResultPartsCatalogPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: ResultPartsCatalogPOModel = new ResultPartsCatalogPOModel();
  msg?: string = '';
}

export class CommonResultResultPartsCatalogPOModel2 extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: ResultPartsCatalogPOModel2 = new ResultPartsCatalogPOModel2();
  msg?: string = '';
}

export class CommonResultPageResultPartsCatalogPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultPartsReplacePOModel = new PageResultPartsReplacePOModel();
  msg?: string = '';
}

export class CommonResultPageResultManualPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultManualPOModel = new PageResultManualPOModel();
  msg?: string = '';
}

export class CommonResulResultEcuPOModel extends BaseModel {
  /** @format int32 */
  code?: number = 0;
  data?: PageResultEcuPOModel = new PageResultEcuPOModel();
  msg?: string = '';
}
