import request from "@/httpRequest";

export interface DictDataVO {
  id: number | undefined;
  sort: number | undefined;
  label: string;
  value: string;
  dictType: string;
  status: number;
  colorType: string;
  cssClass: string;
  remark: string;
  createTime: Date;
}

/**
 * 查询字典数据（精简)列表
 */
export function listSimpleDictData() {
  return request({
    url: "/cirpoint-demand-api/system/dict-data/list-all-simple",
    method: "get",
  });
}

/**
 * 查询字典数据列表
 * @param params
 */
export function getDictDataPage(params: PageParam) {
  return request({
    url: "/cirpoint-demand-api/system/dict-data/page",
    params,
    method: "get",
  });
}

/**
 * 查询字典数据详情
 * @param id
 */
export function getDictData(id: number) {
  return request({
    url: `/cirpoint-demand-api/system/dict-data/get?id=${id}`,
    method: "get",
  });
}

/**
 * 新增字典数据
 * @param data
 */
export function createDictData(data: DictDataVO) {
  return request({
    url: "/cirpoint-demand-api/system/dict-data/create",
    data,
    method: "post",
  });
}

/**
 * 修改字典数据
 * @param data
 */
export function updateDictData(data: DictDataVO) {
  return request({
    url: "/cirpoint-demand-api/system/dict-data/update",
    data,
    method: "POST",
  });
}

/**
 * 删除字典数据
 * @param id
 */
export function deleteDictData(id: number) {
  return request({
    url: `/cirpoint-demand-api/system/dict-data/delete?id=${id}`,
    method: "GET",
  });
}

/**
 * 导出字典类型数据
 * @param params
 */
export function exportDictData(params: any) {
  return request({
    url: "/cirpoint-demand-api/system/dict-data/export",
    params,
    method: "get",
  });
}
