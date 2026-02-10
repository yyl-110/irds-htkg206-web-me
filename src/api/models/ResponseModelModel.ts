import { BaseModel } from '@/utils/BaseModel';
import type { ResponseModel } from '../tags/data-contracts';

export class ResponseModelModel extends BaseModel implements ResponseModel {
  repCode?: string = '';
  repMsg?: string = '';
  repData?: object;
  success?: boolean = false;
  repCodeEnum?:
    | 'SUCCESS'
    | 'ERROR'
    | 'EXCEPTION'
    | 'BLANK_ERROR'
    | 'NULL_ERROR'
    | 'NOT_NULL_ERROR'
    | 'NOT_EXIST_ERROR'
    | 'EXIST_ERROR'
    | 'PARAM_TYPE_ERROR'
    | 'PARAM_FORMAT_ERROR'
    | 'API_CAPTCHA_INVALID'
    | 'API_CAPTCHA_COORDINATE_ERROR'
    | 'API_CAPTCHA_ERROR'
    | 'API_CAPTCHA_BASEMAP_NULL'
    | 'API_REQ_LIMIT_GET_ERROR'
    | 'API_REQ_INVALID'
    | 'API_REQ_LOCK_GET_ERROR'
    | 'API_REQ_LIMIT_CHECK_ERROR'
    | 'API_REQ_LIMIT_VERIFY_ERROR';
}
