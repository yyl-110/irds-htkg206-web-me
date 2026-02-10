import { BaseModel } from '@/utils/BaseModel';
/** 竞品数据库添加、编辑条件 */
export class CompetitorDataRequestDTOModel extends BaseModel {
  checkList?: any = [];
  imgFiled?: string = '';
  fileIdstr?: any = [];
  fileImgIdstr?: any = [];
  id?: number = 0;
  treeId?: number = 0;
}
