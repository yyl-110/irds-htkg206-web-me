import httpRequest from '../../../httpRequest/index';

/**
 * 获取角色表格信息
 * @param params
 */
export function getRoleTableData(params: any) {
  return httpRequest({
    url: '/system-service/system/role/page',
    method: 'GET',
    params,
  });
}
/**
 * 删除角色表格数据
 * @param params
 */
export function getRoleDeleteTableData(params: any) {
  return httpRequest({
    url: '/system-service/system/role/delete',
    method: 'GET',
    params,
  });
}
/**
 * 获取菜单权限
 * @param params
 */
export function getMenuData(params: any) {
  return httpRequest({
    url: '/admin-api/powerApi/sys/menu/list',
    method: 'GET',
    params,
  });
}
/**
 * 角色管理--修改--弹窗
 * @param params
 */
export function getRoleUpdateData(params: any) {
  return httpRequest({
    url: '/admin-api/system/role/get',
    method: 'GET',
    params,
  });
}
/**
 * 表单新增保存
 * @param data
 */
export function getRoleAddSaveData(data: any) {
  return httpRequest({
    url: '/admin-api/system/role/create',
    method: 'POST',
    data,
  });
}
/**
 * 表单修改保存
 * @param data
 */
export function getRoleUpdateSaveData(data: any) {
  return httpRequest({
    url: '/admin-api/system/role/update',
    method: 'POST',
    data,
  });
}
/**
 * 菜单权限列表
 * @param params
 */
export function getRoleMenuListData(params: any) {
  return httpRequest({
    url: '/system-service/system/menu/list-all-simple',
    method: 'GET',
    params,
  });
}
/**
 * 拥有的菜单权限
 * @param params
 */
export function getRoleMenuData(params: any) {
  return httpRequest({
    url: '/system-service/system/permission/list-role-resources',
    method: 'GET',
    params,
  });
}
/**
 * 菜单权限--保存--修改
 * @param data
 */
export function getRoleUpdateMenuData(data: any) {
  return httpRequest({
    url: '/system-service/system/permission/assign-role-menu',
    method: 'POST',
    data,
  });
}

/**
 * 模型库菜单权限--保存--修改
 * @param data
 */
export function getModuleRoleUpdateMenuData(data: any) {
  return httpRequest({
    url: '/system-service/system/permission/assign-role-module-menu',
    method: 'POST',
    data,
  });
}

/**
 * 获取已授权模型库角色菜单
 * @param data
 */
export function getModuleRoleMenuList(data: any) {
  return httpRequest({
    url: '/system-service/system/permission/getModuleRoleMenuList',
    method: 'POST',
    data,
  });
}

/**
 * 数据权限
 * @param params
 */
export function getRolePowerData(params: any) {
  return httpRequest({
    url: '/system-service/system/dept/list-all-simple',
    method: 'GET',
    params,
  });
}
/**
 * 数据权限--保存--修改
 * @param data
 */
export function getRoleUpdatePowerData(data: any) {
  return httpRequest({
    url: '/admin-api/system/permission/assign-role-data-scope',
    method: 'POST',
    data,
  });
}
