import httpRequest from '../../../httpRequest/index';

/**
 * 获取字典管理表格数据
 * @param params
 */
export function getDictTableData(params: any) {
  return httpRequest({
    url: '/system-service/system/dict-type/page',
    method: 'GET',
    params,
  });
}
/**
 * 字典管理--删除
 * @param params
 */
export function getDeleteTableData(params: any) {
  return httpRequest({
    url: '/system-service/system/dict-type/delete',
    method: 'GET',
    params,
  });
}
/**
 * 字典管理--修改--弹窗
 * @param params
 */
export function getUpdateDictData(params: any) {
  return httpRequest({
    url: '/system-service/system/dict-type/get',
    method: 'GET',
    params,
  });
}
/**
 * 字典管理--新增--保存
 * @param data
 */
export function getDictAddSaveData(data: any) {
  return httpRequest({
    url: '/system-service/system/dict-type/create',
    method: 'POST',
    data,
  });
}
/**
 * 字典管理--修改--保存
 * @param data
 */
export function getDictUpdateSaveData(data: any) {
  return httpRequest({
    url: '/system-service/system/dict-type/update',
    method: 'POST',
    data,
  });
}
