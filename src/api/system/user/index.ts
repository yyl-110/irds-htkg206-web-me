import httpRequest from "@/httpRequest";

export interface UserVO {
  id: number | undefined;
  username: string;
  nickname: string;
  deptId: number | string;
  postIds: string[];
  email: string;
  mobile: string;
  sex?: number;
  avatar: string;
  loginIp: string;
  status: number;
  remark: string;
  loginDate: Date;
  createTime: Date;
}

/**
 * 查询用户管理列表
 * @param params
 */
export function getUserPage(params: PageParam) {
  return httpRequest({
    url: "/admin-api/system/epc-user/page",
    params,
    method: "GET",
  });
}

/**
 * 查询用户详情
 * @param id
 */
export function getUser(id: number) {
  return httpRequest({
    url: `/admin-api/system/user/get?id=${id}`,
    method: "GET",
  });
}

/**
 * 新增用户
 * @param data
 */
export function createUser(data: UserVO) {
  return httpRequest({
    url: "/admin-api/system/user/create",
    data,
    method: "POST",
  });
}

/**
 * 修改用户
 * @param data
 */
export function updateUser(data: UserVO) {
  return httpRequest({
    url: "/admin-api/system/user/update",
    data,
    method: "POST",
  });
}

/**
 * 删除用户
 * @param id
 */
export function deleteUser(id: number) {
  return httpRequest({
    url: `/admin-api/system/user/delete?id=${id}`,
    method: "GET",
  });
}

/**
 * 导出用户
 * @param params
 */
export function exportUser(params: any) {
  return httpRequest({
    url: "/admin-api/system/user/export",
    params,
    method: "DOWNLOAD",
  });
}

/**
 * 下载用户导入模板
 */
export function importUserTemplate() {
  return httpRequest({
    url: "/admin-api/system/user/get-import-template",
    method: "DOWNLOAD",
  });
}

/**
 * 用户密码重置
 * @param id
 * @param password
 */
export function resetUserPwd(id: number | string, password: string) {
  const data = {
    id,
    password,
  };
  return httpRequest({
    url: "/admin-api/system/user/update-password",
    data,
    method: "POST",
  });
}

/**
 * 用户状态修改
 * @param id
 * @param status
 */
export function updateUserStatus(id: number, status: number) {
  const data = {
    id,
    status,
  };
  return httpRequest({
    url: "/admin-api/system/user/update-status",
    data,
    method: "POST",
  });
}

/**
 * 获取用户精简信息列表
 */
export function getSimpleUserList(): Promise<UserVO[]> {
  return httpRequest({
    url: "/cirpoint-auth-api/system/user/list-all-simple",
    method: "GET",
  });
}
