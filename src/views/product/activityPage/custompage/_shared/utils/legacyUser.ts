import { useUserStore } from '@/store/modules/user';

/** 兼容旧定制页 globaluserId() 调用 */
export function globaluserId() {
  return useUserStore().getUser.id;
}
