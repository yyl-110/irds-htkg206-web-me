import request from "@/httpRequest";

export interface DictTypeVO {
  id: number | undefined;
  name: string;
  type: string;
  status: number;
  remark: string;
  createTime: Date;
}

/**
 * 查询字典（精简)列表
 */
export function getSimpleDictTypeList() {
  return request({
    url: "/admin-api/system/dict-type/list-all-simple",
    method: "get",
  });
}

/**
 * 查询字典列表
 * @param params
 */
export function getDictTypePage(params: PageParam) {
  return request({
    url: "/admin-api/system/dict-type/page",
    params,
    method: "get",
  });
}

/**
 * 查询字典详情
 * @param id
 */
export function getDictType(id: number) {
  return request({
    url: `/system-service/system/dict-type/get?id=${id}`,
    method: "get",
  });
}

/**
 * 新增字典
 * @param data
 */
export function createDictType(data: DictTypeVO) {
  return request({
    url: "/system-service/system/dict-type/create",
    data,
    method: "post",
  });
}

/**
 * 修改字典
 * @param data
 */
export function updateDictType(data: DictTypeVO) {
  return request({
    url: "/system-service/system/dict-type/update",
    data,
    method: "POST",
  });
}

/**
 * 删除字典
 * @param id
 */
export function deleteDictType(id: number) {
  return request({
    url: `/system-service/system/dict-type/delete?id=${id}`,
    method: "GET",
  });
}
/**
 * 导出字典类型
 * @param params
 */
export function exportDictType(params: any) {
  return request({
    url: "/admin-api/system/dict-type/export",
    params,
    method: "get",
  });
}
