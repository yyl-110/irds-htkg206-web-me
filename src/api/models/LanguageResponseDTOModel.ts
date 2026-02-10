import { BaseModel } from '@/utils/BaseModel';
import type { LanguageResponseDTO } from '../tags/data-contracts';

/** 国际化语言表 Response DTO */
export class LanguageResponseDTOModel extends BaseModel implements LanguageResponseDTO {
  /**
   * 国际化语言ID
   * @example 123
   */
  id: bigint;
  /**
   * 国际化语言
   * @example "简体中文"
   */
  lang: string = '';
  /**
   * 语言说明
   * @example '参考'
   */
  lang_desc: string = '';

  /**
   * 语言对齐方式
   * @example 'RTL'
   */
  lang_direction: string = '';
}
