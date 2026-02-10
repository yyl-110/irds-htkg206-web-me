import { BaseModel } from '@/utils/BaseModel';
import type { CaptchaVO } from '../tags/data-contracts';

import { PointVOModel } from './PointVOModel';

export class CaptchaVOModel extends BaseModel implements CaptchaVO {
  captchaId?: string = '';
  projectCode?: string = '';
  type?: string = '';
  captchaOriginalPath?: string = '';
  captchaFontType?: string = '';
  /** @format int32 */
  captchaFontSize?: number = 0;
  secretKey?: string = '';
  originalImageBase64?: string = '';
  point?: PointVOModel = new PointVOModel();
  jigsawImageBase64?: string = '';
  wordList?: Array<string> = [];
  pointList?: Array<{
    /** @format double */
    x?: number;
    /** @format double */
    y?: number;
  }> = [];
  pointJson?: string = '';
  token?: string = '';
  result?: boolean = false;
  captchaVerification?: string = '';
  clientUid?: string = '';
  /** @format int64 */
  ts?: number = 0;
  browserInfo?: string = '';
}
