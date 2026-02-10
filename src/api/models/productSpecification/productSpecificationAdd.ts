import { BaseModel } from '@/utils/BaseModel';

/** 数据 */
export class productSpecificationAdd extends BaseModel {
  
  planCode?: string = '';
  planName?: string = '';
  initiator?: number ;
  initiatorName?: string = '';
  planStartTime?: string = '';
  planCompleteTime?: string = '';
  status?: string = '';
  actualStartTime?: string = '';
  actualEndTime?: string = '';
  planDescribe?: string = '';
  planPhase?: string = '';
  creator?: string = '';
  createTime?: string = '';
  updater?: string = '';
  updateTime?: string = '';
  deleted?: string = '';
  id?:number = 0;
  fileInfoA?:Array<any>= [];
  fileInfoB?:Array<any>= [];
  fileInfoC?:Array<any>= [];
  fileInfoD?:Array<any>= [];
  checkList?:Array<any>= [];
}
