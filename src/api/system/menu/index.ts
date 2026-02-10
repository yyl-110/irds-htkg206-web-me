import httpRequest from "../../../httpRequest/index";

/**
 * 获取表格菜单数据
 * @param params
 */
export function getMenuTableData(params: any) {
  return httpRequest({
    url: "/admin-api/system/menu/list",
    method: "GET",
    params,
  });
}
/**
 * 获取上级菜单
 * @param params
 */
export function getParMenuData(params: any) {
  return httpRequest({
    url: "/cirpoint-auth-api/system/menu/list-all-simple",
    method: "GET",
    params,
  });
}
/**
 * 删除表格数据
 * @param params
 */
export function getDeleteTableData(params: any) {
  return httpRequest({
    url: "/cirpoint-auth-api/system/menu/delete/",
    method: "GET",
    params,
  });
}
/**
 * 菜单管理--弹窗--修改
 * @param params
 */
export function getMenuUpdateData(params: any) {
  return httpRequest({
    url: "/cirpoint-auth-api/system/menu/get",
    method: "GET",
    params,
  });
}
/**
 * 菜单管理--保存--新增
 * @param data
 */
export function getMenuAddSaveData(data: any) {
  return httpRequest({
    url: "/cirpoint-auth-api/system/menu/create",
    method: "POST",
    data,
  });
}
/**
 * 菜单管理--保存--修改
 * @param data
 */
export function getMenuUpdateSaveData(data: any) {
  return httpRequest({
    url: "/cirpoint-auth-api/system/menu/update",
    method: "POST",
    data,
  });
}
