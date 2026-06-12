/** 应用端「共享」虚拟树节点 ID（与后端 CheckPlatformShareConstants.SHARED_TREE_NODE_ID 一致） */
export const CHECK_SHARED_TREE_NODE_KEY = '0';

export function isCheckSharedTreeNodeKey(key?: string | number | null): boolean {
  return String(key ?? '') === CHECK_SHARED_TREE_NODE_KEY;
}

export function isPlatformShared(status?: number | string | null): boolean {
  return Number(status) === 1;
}

/** 管理端是否展示全平台共享按钮：已发布 + 创建人（兼容后端未返回 canPlatformShare 的情况） */
export function canManageCheckPlatformShare(options: {
  published: boolean;
  canPlatformShare?: boolean;
  canShare?: boolean;
  creator?: string | number | null;
  loginUserId?: string | number | null;
}): boolean {
  if (!options.published) {
    return false;
  }
  if (options.canPlatformShare === true || options.canShare === true) {
    return true;
  }
  const creator = options.creator;
  const loginUserId = options.loginUserId;
  if (creator == null || loginUserId == null) {
    return false;
  }
  return String(creator) === String(loginUserId);
}
