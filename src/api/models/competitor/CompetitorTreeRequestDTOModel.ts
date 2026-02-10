import { BaseModel } from '@/utils/BaseModel';
/** 竞品数据库分类信息 */
export class CompetitorTreeRequestDTOModel extends BaseModel {
  id?: number = 0;
  parentId?: string = '';
  name?: string = '';
  nodeName?: string = '';
  userid?: number = 0;
  categoryName?: string = '';
  level?: number = 0;
  fixedFlag?: number = 2;
  isLeaf?: number = 0;
  unit?: string = '';
  compType?: string = '';
  paraType?: string = '';
  optionStr?: string = '';
  checkComp2?: string = '';
  treeId?: number = 0;
}
